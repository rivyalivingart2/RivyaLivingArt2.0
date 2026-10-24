import {createHash} from 'node:crypto';
import {canonicalArtifactJson,canonicalJson,decodeRecord,encodeRecord,makeRecord,type GoogleWorkspaceRecord,type JsonValue} from './record-codec';

/** Server-only protocol, inactive until a trusted caller supplies a provider.
 * IDs must already be reserved and durably registered before any create attempt.
 * Filename searches, overwrite, deletion, sharing and browser proxies are absent.
 */
export type ArtifactPurpose='record-payload'|'publication-bundle';
export type ArtifactRegistration={fileId:string;parentId:string;purpose:ArtifactPurpose;ownerId:string};
export type DriveJsonRef=ArtifactRegistration&{format:'rivya-drive-json-v1';mimeType:'application/json';bytes:number;sha256:string};
export type DriveArtifactMetadata={id:string;mimeType:string;parents:string[];trashed:boolean;size:number};
export type DriveCreateRequest={fileId:string;parentId:string;mimeType:'application/json';bytes:Uint8Array};
export type DriveDocumentIO={
 /** null means a 404 response, which can also hide lack of access. It never
  * authorizes overwrite or reassignment of a pre-existing Drive ID. Other
  * authorization/network errors must throw rather than be converted to null. */
 metadata:(fileId:string,signal:AbortSignal)=>Promise<DriveArtifactMetadata|null>;
 read:(fileId:string,maxBytes:number,signal:AbortSignal)=>Promise<Uint8Array>;
 /** Create-only at the registered ID; a conflict must never update existing bytes. */
 create:(request:DriveCreateRequest,signal:AbortSignal)=>Promise<void>;
};
export type DriveDocumentConfig={registrations:readonly ArtifactRegistration[];maxBytes?:number;timeoutMs?:number;createAttempts?:number};
export type ArtifactOptions={signal?:AbortSignal};
export type ArtifactRecordMetadata=Omit<GoogleWorkspaceRecord,'payload'|'payloadSha256'>;
export type ArtifactErrorCode='INVALID_CONFIGURATION'|'UNREGISTERED_ARTIFACT'|'INVALID_REFERENCE'|'INVALID_JSON'|'ARTIFACT_TOO_LARGE'|'ARTIFACT_NOT_FOUND'|'ARTIFACT_MISMATCH'|'PROVIDER_UNAVAILABLE'|'ABORTED'|'TIMEOUT';
export class DriveDocumentError extends Error{
 constructor(public readonly code:ArtifactErrorCode){super({INVALID_CONFIGURATION:'Artifact configuration is invalid.',UNREGISTERED_ARTIFACT:'Artifact is not registered.',INVALID_REFERENCE:'Artifact reference is invalid.',INVALID_JSON:'Artifact is not complete canonical JSON.',ARTIFACT_TOO_LARGE:'Artifact exceeds its byte limit.',ARTIFACT_NOT_FOUND:'Registered artifact is unavailable.',ARTIFACT_MISMATCH:'Artifact metadata or bytes differ from its reference.',PROVIDER_UNAVAILABLE:'Artifact provider is unavailable; retain the reserved ID for retry.',ABORTED:'Artifact operation cancelled; retry with the same reserved ID.',TIMEOUT:'Artifact operation timed out; retry with the same reserved ID.'}[code]);this.name='DriveDocumentError';}
}
/** A trusted provider may use this only when create validation failed before
 * dispatch. Ordinary typed errors can also occur after a successful remote
 * create and must still be reconciled at the reserved ID. */
export class DriveCreatePreflightError extends DriveDocumentError{
 constructor(code:ArtifactErrorCode){super(code);this.name='DriveCreatePreflightError';}
}
const fail=(code:ArtifactErrorCode):never=>{throw new DriveDocumentError(code);};
export const MAX_ARTIFACT_BYTES=32*1024*1024;
const id=(value:unknown):value is string=>typeof value==='string'&&/^[A-Za-z0-9_-]{10,160}$/.test(value);
const owner=(value:unknown):value is string=>typeof value==='string'&&/^[A-Za-z0-9:_-]{1,240}$/.test(value);
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const copy=<T>(value:T):T=>{try{return JSON.parse(canonicalArtifactJson(value)) as T;}catch{return fail('INVALID_JSON');}};
function exact(value:unknown,keys:readonly string[]):Record<string,unknown>{
 const safe=copy(value);
 if(!safe||typeof safe!=='object'||Array.isArray(safe)||Object.keys(safe).length!==keys.length||Object.keys(safe).some(key=>!keys.includes(key)))return fail('INVALID_REFERENCE');
 return safe as Record<string,unknown>;
}
export function validateArtifactRegistration(value:unknown):ArtifactRegistration{
 const r=exact(value,['fileId','parentId','purpose','ownerId']);
 if(!id(r.fileId)||!id(r.parentId)||!['record-payload','publication-bundle'].includes(r.purpose as string)||!owner(r.ownerId))return fail('INVALID_REFERENCE');
 return r as ArtifactRegistration;
}
export function validateDriveJsonRef(value:unknown):DriveJsonRef{
 const r=exact(value,['fileId','parentId','purpose','ownerId','format','mimeType','bytes','sha256']);
 validateArtifactRegistration({fileId:r.fileId,parentId:r.parentId,purpose:r.purpose,ownerId:r.ownerId});
 if(r.format!=='rivya-drive-json-v1'||r.mimeType!=='application/json'||!Number.isSafeInteger(r.bytes)||(r.bytes as number)<1||(r.bytes as number)>MAX_ARTIFACT_BYTES||typeof r.sha256!=='string'||!(/^[a-f0-9]{64}$/).test(r.sha256))return fail('INVALID_REFERENCE');
 return r as DriveJsonRef;
}
export function canonicalDocumentBytes(value:unknown,maximum=MAX_ARTIFACT_BYTES):Uint8Array{
 let text:string;try{text=canonicalArtifactJson(value);}catch{return fail('INVALID_JSON');}
 const bytes=new TextEncoder().encode(text);
 if(bytes.byteLength>maximum)return fail('ARTIFACT_TOO_LARGE');
 return bytes;
}
export function parseCanonicalDocument(bytes:Uint8Array,maximum=MAX_ARTIFACT_BYTES):JsonValue{
 if(!(bytes instanceof Uint8Array)||bytes.byteLength<1||bytes.byteLength>maximum)return fail('ARTIFACT_TOO_LARGE');
 try{
  const text=new TextDecoder('utf-8',{fatal:true,ignoreBOM:true}).decode(bytes),value:unknown=JSON.parse(text);
  if(canonicalArtifactJson(value)!==text)return fail('INVALID_JSON');
  return value as JsonValue;
 }catch{return fail('INVALID_JSON');}
}
async function abortable<T>(fn:()=>Promise<T>,signal:AbortSignal):Promise<T>{
 if(signal.aborted)return fail('ABORTED');
 return new Promise<T>((resolve,reject)=>{
  const aborted=()=>reject(new DriveDocumentError('ABORTED'));
  signal.addEventListener('abort',aborted,{once:true});
  Promise.resolve().then(()=>{if(signal.aborted)return fail('ABORTED');return fn();}).then(resolve,reject).finally(()=>signal.removeEventListener('abort',aborted));
 });
}
export function createDriveDocumentStore(config:DriveDocumentConfig,provider:DriveDocumentIO){
 const maxBytes=config?.maxBytes??MAX_ARTIFACT_BYTES,timeoutMs=config?.timeoutMs??15_000,attempts=config?.createAttempts??2;
 if(!config||!Array.isArray(config.registrations)||config.registrations.length>10_000||!Number.isSafeInteger(maxBytes)||maxBytes<1||maxBytes>MAX_ARTIFACT_BYTES||!Number.isSafeInteger(timeoutMs)||timeoutMs<1||timeoutMs>60_000||!Number.isSafeInteger(attempts)||attempts<1||attempts>3||!provider||['metadata','read','create'].some(key=>typeof provider[key as keyof DriveDocumentIO]!=='function'))return fail('INVALID_CONFIGURATION');
 const registry=new Map<string,ArtifactRegistration>();
 for(const raw of config.registrations){const r=validateArtifactRegistration(raw);if(registry.has(r.fileId))return fail('INVALID_CONFIGURATION');registry.set(r.fileId,r);}
 const io={...provider};
 const registration=(fileId:string)=>{const r=registry.get(fileId);if(!r)return fail('UNREGISTERED_ARTIFACT');return r;};
 function registeredReference(raw:unknown):DriveJsonRef{
  const ref=validateDriveJsonRef(raw),r=registration(ref.fileId);
  if(r.parentId!==ref.parentId||r.purpose!==ref.purpose||r.ownerId!==ref.ownerId)return fail('UNREGISTERED_ARTIFACT');
  if(ref.bytes>maxBytes)return fail('ARTIFACT_TOO_LARGE');return ref;
 }
 async function run<T>(options:ArtifactOptions,fn:(signal:AbortSignal)=>Promise<T>):Promise<T>{
  if(options.signal?.aborted)return fail('ABORTED');
  const controller=new AbortController();let timeout=false;
  const relay=()=>controller.abort();options.signal?.addEventListener('abort',relay,{once:true});
  const timer=setTimeout(()=>{timeout=true;controller.abort();},timeoutMs);
  try{return await abortable(()=>fn(controller.signal),controller.signal);}
  catch(error){if(timeout)return fail('TIMEOUT');if(controller.signal.aborted)return fail('ABORTED');if(error instanceof DriveDocumentError)throw error;return fail('PROVIDER_UNAVAILABLE');}
  finally{clearTimeout(timer);options.signal?.removeEventListener('abort',relay);}
 }
 async function verified(ref:DriveJsonRef,signal:AbortSignal,known?:DriveArtifactMetadata):Promise<JsonValue>{
  const meta=known??await abortable(()=>io.metadata(ref.fileId,signal),signal);
  if(meta===null)return fail('ARTIFACT_NOT_FOUND');
  if(meta.id!==ref.fileId||meta.mimeType!=='application/json'||meta.trashed!==false||meta.size!==ref.bytes||!Array.isArray(meta.parents)||meta.parents.length!==1||meta.parents[0]!==ref.parentId)return fail('ARTIFACT_MISMATCH');
  const raw=await abortable(()=>io.read(ref.fileId,ref.bytes,signal),signal);
  if(!(raw instanceof Uint8Array)||raw.byteLength!==ref.bytes||hash(raw)!==ref.sha256)return fail('ARTIFACT_MISMATCH');
  return parseCanonicalDocument(new Uint8Array(raw),maxBytes);
 }
 const store={
  getRegistration(fileId:string):ArtifactRegistration{return {...registration(fileId)};},
  async ensureJson(fileId:string,value:unknown,options:ArtifactOptions={}):Promise<DriveJsonRef>{
   const r=registration(fileId),bytes=canonicalDocumentBytes(value,maxBytes);
   const ref:DriveJsonRef={...r,format:'rivya-drive-json-v1',mimeType:'application/json',bytes:bytes.byteLength,sha256:hash(bytes)};
   return run(options,async signal=>{
    for(let attempt=0;attempt<attempts;attempt++){
     const existing=await abortable(()=>io.metadata(fileId,signal),signal);
     if(existing!==null){await verified(ref,signal,existing);return Object.freeze(ref);}
     try{await abortable(()=>io.create({fileId,parentId:r.parentId,mimeType:'application/json',bytes:new Uint8Array(bytes)},signal),signal);}
     catch(error){if(signal.aborted||error instanceof DriveCreatePreflightError)throw error;/* An unknown create result is recovered only at this same reserved ID. */}
     const created=await abortable(()=>io.metadata(fileId,signal),signal);
     if(created!==null){await verified(ref,signal,created);return Object.freeze(ref);}
    }
    return fail('PROVIDER_UNAVAILABLE');
   });
  },
  async readJson(raw:unknown,options:ArtifactOptions={}):Promise<JsonValue>{const ref=registeredReference(raw);return run(options,signal=>verified(ref,signal));},
  async makePayloadRecord(metadata:ArtifactRecordMetadata,fileId:string,payload:unknown,options:ArtifactOptions={}):Promise<GoogleWorkspaceRecord>{
   // Validate record metadata and identity before creating anything.
   const safeMetadata=copy(metadata),base=makeRecord({...safeMetadata,payload:null}),r=registration(fileId);
   if(r.purpose!=='record-payload'||r.ownerId!==base.recordId)return fail('UNREGISTERED_ARTIFACT');
   const artifact=await store.ensureJson(fileId,payload,options);
   return makeRecord({...safeMetadata,payload:copy({format:'rivya-drive-payload-v1',artifact}) as JsonValue});
  },
  async resolvePayload(input:GoogleWorkspaceRecord,options:ArtifactOptions={}):Promise<JsonValue>{
   const record=decodeRecord(encodeRecord(input)),payload=record.payload;
   if(payload&&typeof payload==='object'&&!Array.isArray(payload)&&payload.format==='rivya-drive-payload-v1'){
    const envelope=exact(payload,['format','artifact']),ref=registeredReference(envelope.artifact);
    if(ref.purpose!=='record-payload'||ref.ownerId!==record.recordId)return fail('UNREGISTERED_ARTIFACT');
    return store.readJson(ref,options);
   }
   return JSON.parse(canonicalJson(payload)) as JsonValue;
  },
 };
 return Object.freeze(store);
}
export type DriveDocumentStore=ReturnType<typeof createDriveDocumentStore>;
