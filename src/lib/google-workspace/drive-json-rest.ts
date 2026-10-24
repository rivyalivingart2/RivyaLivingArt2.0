import {randomUUID} from 'node:crypto';
import {setTimeout as wait} from 'node:timers/promises';
import {DriveDocumentError,DriveCreatePreflightError,MAX_ARTIFACT_BYTES,parseCanonicalDocument,validateArtifactRegistration,type ArtifactRegistration,type DriveArtifactMetadata,type DriveDocumentIO} from './drive-documents';

/** Runnable REST provider source, but deliberately not imported by the app.
 * Registrations and token supplier are trusted server configuration. IDs passed
 * here must have been reserved by Drive files.generateIds and saved in the
 * operation ledger before creation. No browser token, resource URL, overwrite,
 * delete, sharing operation or native Google document conversion is supported.
 */
export type DriveRestConfig={registrations:readonly ArtifactRegistration[];maxBytes?:number;timeoutMs?:number};
export type DriveRestDependencies={token:(signal:AbortSignal)=>Promise<string>;fetch:(url:string,init:RequestInit)=>Promise<Response>;sleep?:(milliseconds:number,signal:AbortSignal)=>Promise<void>};
// Google's multipart guidance is bounded to 5 MB. Larger creation must use a
// separately implemented resumable protocol; never truncate or silently convert.
export const MAX_MULTIPART_ARTIFACT_BYTES=5*1024*1024;
const fail=(code:ConstructorParameters<typeof DriveDocumentError>[0]):never=>{throw new DriveDocumentError(code);};
const close=(response:Response)=>{void response.body?.cancel().catch(()=>{});};
async function abortable<T>(fn:()=>Promise<T>,signal:AbortSignal):Promise<T>{
 if(signal.aborted)return fail('ABORTED');
 return new Promise<T>((resolve,reject)=>{const aborted=()=>reject(new DriveDocumentError('ABORTED'));signal.addEventListener('abort',aborted,{once:true});Promise.resolve().then(()=>{if(signal.aborted)return fail('ABORTED');return fn();}).then(resolve,reject).finally(()=>signal.removeEventListener('abort',aborted));});
}
async function bodyBytes(response:Response,maximum:number,signal:AbortSignal):Promise<Uint8Array>{
 const length=response.headers.get('content-length');
 if(length!==null&&(!/^\d+$/.test(length)||!Number.isSafeInteger(Number(length)))){close(response);return fail('PROVIDER_UNAVAILABLE');}
 if(length!==null&&Number(length)>maximum){close(response);return fail('ARTIFACT_TOO_LARGE');}
 if(!response.body)return new Uint8Array();
 const reader=response.body.getReader(),parts:Uint8Array[]=[];let count=0;
 try{while(true){const item=await abortable(()=>reader.read(),signal);if(item.done)break;count+=item.value.byteLength;if(count>maximum)return fail('ARTIFACT_TOO_LARGE');parts.push(item.value);}}
 catch(error){void reader.cancel().catch(()=>{});throw error;}finally{reader.releaseLock();}
 if(length!==null&&!response.headers.get('content-encoding')&&Number(length)!==count)return fail('PROVIDER_UNAVAILABLE');
 const bytes=new Uint8Array(count);let offset=0;for(const part of parts){bytes.set(part,offset);offset+=part.byteLength;}return bytes;
}
function json(bytes:Uint8Array):Record<string,unknown>{try{const value:unknown=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));if(!value||typeof value!=='object'||Array.isArray(value))return fail('PROVIDER_UNAVAILABLE');return value as Record<string,unknown>;}catch{return fail('PROVIDER_UNAVAILABLE');}}
export function createGoogleDriveJsonIO(config:DriveRestConfig,dependencies:DriveRestDependencies):DriveDocumentIO{
 const maximum=config?.maxBytes??MAX_ARTIFACT_BYTES,timeoutMs=config?.timeoutMs??15_000;
 if(!config||!Array.isArray(config.registrations)||config.registrations.length>10_000||!Number.isSafeInteger(maximum)||maximum<1||maximum>MAX_ARTIFACT_BYTES||!Number.isSafeInteger(timeoutMs)||timeoutMs<1||timeoutMs>60_000||!dependencies||typeof dependencies.token!=='function'||typeof dependencies.fetch!=='function'||dependencies.sleep!==undefined&&typeof dependencies.sleep!=='function')return fail('INVALID_CONFIGURATION');
 const registry=new Map<string,ArtifactRegistration>();for(const raw of config.registrations){const entry=validateArtifactRegistration(raw);if(registry.has(entry.fileId))return fail('INVALID_CONFIGURATION');registry.set(entry.fileId,entry);}
 const token=dependencies.token,fetchResponse=dependencies.fetch,sleep=dependencies.sleep??((ms:number,signal:AbortSignal)=>wait(ms,undefined,{signal}));
 const registered=(id:string)=>{const entry=registry.get(id);if(!entry)return fail('UNREGISTERED_ARTIFACT');return entry;};
 async function run<T>(outer:AbortSignal,fn:(signal:AbortSignal)=>Promise<T>):Promise<T>{
  if(outer.aborted)return fail('ABORTED');const controller=new AbortController();let timeout=false;const relay=()=>controller.abort();outer.addEventListener('abort',relay,{once:true});const timer=setTimeout(()=>{timeout=true;controller.abort();},timeoutMs);
  try{return await abortable(()=>fn(controller.signal),controller.signal);}catch(error){if(timeout)return fail('TIMEOUT');if(controller.signal.aborted)return fail('ABORTED');if(error instanceof DriveDocumentError)throw error;return fail('PROVIDER_UNAVAILABLE');}finally{clearTimeout(timer);outer.removeEventListener('abort',relay);}
 }
 async function request(url:URL,signal:AbortSignal,limit:number,init:{method:'GET'|'POST';body?:Uint8Array;contentType?:string},notFound=false):Promise<Uint8Array|null>{
  for(let attempt=0;attempt<3;attempt++){
   const accessToken=await abortable(()=>token(signal),signal);if(typeof accessToken!=='string'||accessToken.length>8192||!/^[-A-Za-z0-9._~+/]+={0,2}$/.test(accessToken))return fail('PROVIDER_UNAVAILABLE');
   const response=await abortable(()=>fetchResponse(url.href,{method:init.method,headers:{Authorization:'Bearer '+accessToken,Accept:'application/json',...(init.contentType?{'Content-Type':init.contentType}:{})},...(init.body?{body:Buffer.from(init.body)}:{}),redirect:'manual',credentials:'omit',cache:'no-store',referrerPolicy:'no-referrer',signal}),signal);
   if(response.redirected||response.status>=300&&response.status<400||response.url&&response.url!==url.href){close(response);return fail('PROVIDER_UNAVAILABLE');}
   if(notFound&&response.status===404){close(response);return null;}
   if(init.method==='GET'&&(response.status===429||response.status===503)&&attempt<2){
    close(response);const retry=response.headers.get('retry-after');let delay=200*2**attempt;
    if(retry){const requested=/^\d+(?:\.\d+)?$/.test(retry)?Number(retry)*1000:Date.parse(retry)-Date.now();if(Number.isFinite(requested))delay=Math.max(delay,requested);}
    if(delay>2000)return fail('PROVIDER_UNAVAILABLE');await abortable(()=>sleep(delay,signal),signal);continue;
   }
   if(response.status!==200&&!(init.method==='POST'&&response.status===201)){close(response);return fail('PROVIDER_UNAVAILABLE');}
   if((response.headers.get('content-type')||'').split(';')[0].trim().toLowerCase()!=='application/json'){close(response);return fail('PROVIDER_UNAVAILABLE');}
   return bodyBytes(response,limit,signal);
  }
  return fail('PROVIDER_UNAVAILABLE');
 }
 async function metadata(fileId:string,signal:AbortSignal):Promise<DriveArtifactMetadata|null>{
  const entry=registered(fileId),url=new URL('https://www.googleapis.com/drive/v3/files/'+fileId);
  url.searchParams.set('fields','id,mimeType,parents,trashed,size');url.searchParams.set('supportsAllDrives','true');
  const bytes=await request(url,signal,256*1024,{method:'GET'},true);if(bytes===null)return null;const data=json(bytes);
  if(data.id!==fileId||data.mimeType!=='application/json'||data.trashed!==false||!Array.isArray(data.parents)||data.parents.length!==1||data.parents[0]!==entry.parentId||typeof data.size!=='string'||!/^\d+$/.test(data.size)||!Number.isSafeInteger(Number(data.size)))return fail('ARTIFACT_MISMATCH');
  if(Number(data.size)>maximum)return fail('ARTIFACT_TOO_LARGE');
  return {id:fileId,mimeType:'application/json',parents:[entry.parentId],trashed:false,size:Number(data.size)};
 }
 return Object.freeze({
  async metadata(fileId,signal){registered(fileId);return run(signal,inner=>metadata(fileId,inner));},
  async read(fileId,maxBytes,signal){
   registered(fileId);if(!Number.isSafeInteger(maxBytes)||maxBytes<1||maxBytes>maximum)return fail('ARTIFACT_TOO_LARGE');
   return run(signal,async inner=>{
    const meta=await metadata(fileId,inner);if(!meta)return fail('ARTIFACT_NOT_FOUND');if(meta.size>maxBytes)return fail('ARTIFACT_TOO_LARGE');
    const url=new URL('https://www.googleapis.com/drive/v3/files/'+fileId);url.searchParams.set('alt','media');url.searchParams.set('supportsAllDrives','true');
    const bytes=await request(url,inner,maxBytes,{method:'GET'});if(!bytes||bytes.byteLength!==meta.size)return fail('ARTIFACT_MISMATCH');parseCanonicalDocument(bytes,maxBytes);return bytes;
   });
  },
  async create(input,signal){
   let entry:ArtifactRegistration,bytes:Uint8Array;
   try{
    entry=registered(input.fileId);
    if(input.parentId!==entry.parentId||input.mimeType!=='application/json')return fail('UNREGISTERED_ARTIFACT');
    if(!(input.bytes instanceof Uint8Array))return fail('INVALID_JSON');
    if(input.bytes.byteLength>Math.min(maximum,MAX_MULTIPART_ARTIFACT_BYTES))return fail('ARTIFACT_TOO_LARGE');
    bytes=new Uint8Array(input.bytes);parseCanonicalDocument(bytes,Math.min(maximum,MAX_MULTIPART_ARTIFACT_BYTES));
   }catch(error){throw new DriveCreatePreflightError(error instanceof DriveDocumentError?error.code:'INVALID_JSON');}
   return run(signal,async inner=>{
    const boundary='rivya_'+randomUUID().replace(/-/g,''),data={id:entry.fileId,name:'rivya-'+entry.fileId+'.json',parents:[entry.parentId],mimeType:'application/json'};
    const multipart=Buffer.concat([Buffer.from('--'+boundary+'\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n'+JSON.stringify(data)+'\r\n--'+boundary+'\r\nContent-Type: application/json\r\n\r\n'),Buffer.from(bytes),Buffer.from('\r\n--'+boundary+'--\r\n')]);
    const url=new URL('https://www.googleapis.com/upload/drive/v3/files');url.searchParams.set('uploadType','multipart');url.searchParams.set('fields','id');url.searchParams.set('supportsAllDrives','true');
    const result=await request(url,inner,256*1024,{method:'POST',body:multipart,contentType:'multipart/related; boundary='+boundary});
    if(!result||json(result).id!==entry.fileId)return fail('ARTIFACT_MISMATCH');
   });
  },
 });
}
