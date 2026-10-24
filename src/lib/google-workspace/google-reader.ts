import {setTimeout as wait} from 'node:timers/promises';

/**
 * Inactive, Node-only read transport. It has no environment lookup, token minting,
 * write method, public route or application import. Server callers must authorize
 * their user and supply a trusted registration before calling it. A Drive ID or
 * parent check is not a replacement for application publication/privacy checks.
 *
 * Sheets UNFORMATTED_VALUE preserves numbers, booleans and literal text. It does
 * not distinguish a formula's evaluated result from a literal cell. Canonical
 * writers must use RAW/stringValue; formula provenance requires a separate grid
 * audit. This reader never evaluates text or coerces numeric-looking identifiers.
 */
export type GoogleCellValue = string | number | boolean;
export type GoogleValueRange = {range:string;majorDimension:'ROWS';values:GoogleCellValue[][]};
export type GoogleSheetValues = {spreadsheetId:string;valueRanges:GoogleValueRange[]};
export type RegisteredDriveFile = {id:string;expectedMimeType?:string;expectedParentId?:string;maxBytes?:number};
export type GoogleDriveMetadata = {id:string;mimeType:string;trashed:false;parents:string[];size?:number};
export type GoogleReadOptions = {signal?:AbortSignal};
export type GoogleReadLimits = {
 timeoutMs:number;maxResponseBytes:number;maxRanges:number;maxCells:number;
 maxRangeRows:number;maxRangeColumns:number;maxRetries:number;maxRetryDelayMs:number;
};
export type GoogleReaderConfig = {
 workbookIds:readonly string[];files:readonly RegisteredDriveFile[];limits?:Partial<GoogleReadLimits>;
};
export type GoogleReaderDependencies = {
 token:(signal:AbortSignal)=>Promise<string>;
 fetch:(url:string,init:RequestInit)=>Promise<Response>;
 sleep?:(milliseconds:number,signal:AbortSignal)=>Promise<void>;
 random?:()=>number;
};
export type GoogleReadErrorCode = 'configuration'|'not-registered'|'invalid-range'|'credentials'|'unavailable'|'retry-exhausted'|'timeout'|'aborted'|'too-large'|'invalid-response'|'redirect'|'file-policy';
const messages:Record<GoogleReadErrorCode,string> = {
 configuration:'Google reader configuration is invalid.',
 'not-registered':'The requested Google resource is not registered.',
 'invalid-range':'Use bounded, explicit sheet ranges within the configured limits.',
 credentials:'Google read credentials are unavailable.',
 unavailable:'Google data could not be read. Retry later.',
 'retry-exhausted':'Google read retries are exhausted. Retry later.',
 timeout:'Google read timed out.',aborted:'Google read was cancelled.',
 'too-large':'Google response exceeds the configured size limit.',
 'invalid-response':'Google returned an invalid response.',
 redirect:'Google read redirects are not allowed.',
 'file-policy':'The Drive file does not match its registration.',
};
export class GoogleReadError extends Error {
 readonly code:GoogleReadErrorCode;
 constructor(code:GoogleReadErrorCode){super(messages[code]);this.name='GoogleReadError';this.code=code;}
}
const fail=(code:GoogleReadErrorCode):never=>{throw new GoogleReadError(code);};
const idPattern=/^[A-Za-z0-9_-]{10,160}$/;
const mimePattern=/^[a-zA-Z0-9!#$&^_.+-]+\/[a-zA-Z0-9!#$&^_.+-]+$/;
const defaults:GoogleReadLimits = {
 timeoutMs:10_000,maxResponseBytes:8*1024*1024,maxRanges:20,maxCells:100_000,
 maxRangeRows:10_000,maxRangeColumns:256,maxRetries:2,maxRetryDelayMs:2_000,
};
const ceilings:GoogleReadLimits = {
 timeoutMs:30_000,maxResponseBytes:64*1024*1024,maxRanges:50,maxCells:200_000,
 maxRangeRows:20_000,maxRangeColumns:512,maxRetries:3,maxRetryDelayMs:5_000,
};
type BoundedRange={title:string;startColumn:number;startRow:number;endColumn:number;endRow:number;rows:number;columns:number;source:string};
const record=(value:unknown):value is Record<string,unknown>=>!!value&&typeof value==='object'&&!Array.isArray(value);
const validId=(value:unknown):value is string=>typeof value==='string'&&idPattern.test(value);
const columnNumber=(value:string)=>[...value].reduce((n,c)=>n*26+c.charCodeAt(0)-64,0);

function boundedRange(value:unknown,limits:GoogleReadLimits):BoundedRange{
 if(typeof value!=='string'||value.length>180||/[\u0000-\u001f\u007f]/.test(value))return fail('invalid-range');
 // No named ranges, open rows/columns, R1C1, URLs or unbounded sheet reads.
 const match=/^(?:'((?:[^']|'')+)'|([A-Za-z_][A-Za-z0-9_ ]*))!([A-Z]{1,3})([1-9]\d{0,6}):([A-Z]{1,3})([1-9]\d{0,6})$/.exec(value);
 if(!match)return fail('invalid-range');
 const title=(match[1]??match[2]).replace(/''/g,"'");
 if(!title.trim()||title.length>100||/[\[\]:*?/\\]/.test(title))return fail('invalid-range');
 const startColumn=columnNumber(match[3]),startRow=Number(match[4]),endColumn=columnNumber(match[5]),endRow=Number(match[6]);
 const rows=endRow-startRow+1,columns=endColumn-startColumn+1;
 if(rows<1||columns<1||rows>limits.maxRangeRows||columns>limits.maxRangeColumns||rows*columns>limits.maxCells)return fail('invalid-range');
 return {title,startColumn,startRow,endColumn,endRow,rows,columns,source:value};
}
const sameRange=(a:BoundedRange,b:BoundedRange)=>a.title===b.title&&a.startColumn===b.startColumn&&a.endColumn===b.endColumn&&a.startRow===b.startRow&&a.endRow===b.endRow;
const cancelBody=(response:Response)=>{void response.body?.cancel().catch(()=>{});};

/** Bounds token acquisition, fetch, body reads and injected sleeps even when a dependency ignores its signal. */
async function abortable<T>(work:()=>Promise<T>,signal:AbortSignal):Promise<T>{
 if(signal.aborted)return fail('aborted');
 return new Promise<T>((resolve,reject)=>{
  const aborted=()=>reject(new GoogleReadError('aborted'));
  signal.addEventListener('abort',aborted,{once:true});
  Promise.resolve().then(()=>{if(signal.aborted)return fail('aborted');return work();}).then(resolve,reject).finally(()=>signal.removeEventListener('abort',aborted));
 });
}

async function boundedBody(response:Response,maximum:number,signal:AbortSignal):Promise<Uint8Array>{
 const length=response.headers.get('content-length');
 if(length!==null&&(!/^\d+$/.test(length)||!Number.isSafeInteger(Number(length)))){cancelBody(response);return fail('invalid-response');}
 if(length!==null&&Number(length)>maximum){cancelBody(response);return fail('too-large');}
 if(!response.body)return new Uint8Array();
 const reader=response.body.getReader(),chunks:Uint8Array[]=[];let total=0;
 try{
  while(true){
   const chunk=await abortable(()=>reader.read(),signal);
   if(chunk.done)break;
   if(!(chunk.value instanceof Uint8Array))return fail('invalid-response');
   total+=chunk.value.byteLength;
   if(total>maximum)return fail('too-large');
   chunks.push(chunk.value);
  }
 }catch(error){void reader.cancel().catch(()=>{});throw error;}
 finally{reader.releaseLock();}
 // Fetch transparently decompresses gzip/br but may retain the wire length.
 const encoding=response.headers.get('content-encoding');
 if(length!==null&&(!encoding||encoding==='identity')&&Number(length)!==total)return fail('invalid-response');
 const bytes=new Uint8Array(total);let offset=0;
 for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.byteLength;}
 return bytes;
}
function decodeJson(bytes:Uint8Array):unknown{
 try{return JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));}
 catch{return fail('invalid-response');}
}

export function createGoogleWorkspaceReader(config:GoogleReaderConfig,dependencies:GoogleReaderDependencies){
 if(!config||!Array.isArray(config.workbookIds)||!Array.isArray(config.files)||config.workbookIds.length>100||config.files.length>10_000||!dependencies||typeof dependencies.token!=='function'||typeof dependencies.fetch!=='function')return fail('configuration');
 const limits={...defaults,...config.limits};
 if(config.limits&&(!record(config.limits)||Object.keys(config.limits).some(key=>!Object.hasOwn(defaults,key))))return fail('configuration');
 for(const key of Object.keys(defaults) as (keyof GoogleReadLimits)[]){
  if(!Number.isSafeInteger(limits[key])||limits[key]<(key==='maxRetries'?0:1)||limits[key]>ceilings[key])return fail('configuration');
 }
 // Copy configuration so later mutations cannot widen this reader's authority.
 const workbooks=new Set<string>(),files=new Map<string,RegisteredDriveFile>();
 for(const id of config.workbookIds){if(!validId(id)||workbooks.has(id))return fail('configuration');workbooks.add(id);}
 for(const file of config.files){
  if(!file||!validId(file.id)||files.has(file.id)||Object.keys(file).some(key=>!['id','expectedMimeType','expectedParentId','maxBytes'].includes(key)))return fail('configuration');
  if(file.expectedMimeType!==undefined&&(typeof file.expectedMimeType!=='string'||file.expectedMimeType.length>150||!mimePattern.test(file.expectedMimeType)))return fail('configuration');
  if(file.expectedParentId!==undefined&&!validId(file.expectedParentId))return fail('configuration');
  if(file.maxBytes!==undefined&&(!Number.isSafeInteger(file.maxBytes)||file.maxBytes<1||file.maxBytes>limits.maxResponseBytes))return fail('configuration');
  files.set(file.id,{...file});
 }
 if(dependencies.sleep!==undefined&&typeof dependencies.sleep!=='function'||dependencies.random!==undefined&&typeof dependencies.random!=='function')return fail('configuration');
 const tokenSupplier=dependencies.token,fetchResponse=dependencies.fetch;
 const sleep=dependencies.sleep??((milliseconds:number,signal:AbortSignal)=>wait(milliseconds,undefined,{signal}));
 const random=dependencies.random??Math.random;
 const registeredFile=(id:string)=>{if(!validId(id)||!files.has(id))return fail('not-registered');return files.get(id)!;};

 async function operation<T>(options:GoogleReadOptions,run:(signal:AbortSignal)=>Promise<T>):Promise<T>{
  if(options.signal?.aborted)return fail('aborted');
  const controller=new AbortController();let timedOut=false;
  const relay=()=>controller.abort();options.signal?.addEventListener('abort',relay,{once:true});
  const timer=setTimeout(()=>{timedOut=true;controller.abort();},limits.timeoutMs);
  try{return await abortable(()=>run(controller.signal),controller.signal);}
  catch(error){if(timedOut)return fail('timeout');if(controller.signal.aborted)return fail('aborted');if(error instanceof GoogleReadError)throw error;return fail('unavailable');}
  finally{clearTimeout(timer);options.signal?.removeEventListener('abort',relay);}
 }
 async function request(url:URL,signal:AbortSignal,maximum:number,json:boolean,expectedMime?:string):Promise<Uint8Array>{
  for(let attempt=0;attempt<=limits.maxRetries;attempt++){
   let token:string;
   try{token=await abortable(()=>tokenSupplier(signal),signal);}
   catch(error){if(signal.aborted)throw error;return fail('credentials');}
   if(typeof token!=='string'||token.length>8192||!/^[-A-Za-z0-9._~+/]+={0,2}$/.test(token))return fail('credentials');
   let response:Response;
   try{response=await abortable(()=>fetchResponse(url.href,{method:'GET',headers:{Authorization:'Bearer '+token,Accept:json?'application/json':'*/*'},redirect:'manual',cache:'no-store',credentials:'omit',referrerPolicy:'no-referrer',signal}),signal);}
   catch(error){if(signal.aborted)throw error;return fail('unavailable');}
   if(response.redirected||response.status>=300&&response.status<400||response.url&&response.url!==url.href){cancelBody(response);return fail('redirect');}
   if(response.status===429||response.status===503){
    cancelBody(response);
    if(attempt===limits.maxRetries)return fail('retry-exhausted');
    const header=response.headers.get('retry-after');let retryAfter=0;
    if(header){
     if(/^\d+(?:\.\d+)?$/.test(header))retryAfter=Number(header)*1000;
     else{const date=Date.parse(header);if(Number.isFinite(date))retryAfter=Math.max(0,date-Date.now());}
     // Do not retry earlier than a server delay longer than our bounded policy.
     if(retryAfter>limits.maxRetryDelayMs)return fail('retry-exhausted');
    }
    const sample=random(),jitter=Number.isFinite(sample)?Math.max(0,Math.min(1,sample)):0.5;
    const milliseconds=Math.max(retryAfter,Math.min(limits.maxRetryDelayMs,200*2**attempt+Math.floor(jitter*200)));
    await abortable(()=>sleep(milliseconds,signal),signal);continue;
   }
   if(response.status!==200){cancelBody(response);return fail('unavailable');}
   const mime=(response.headers.get('content-type')||'').split(';')[0].trim().toLowerCase();
   if(json?mime!=='application/json':!!expectedMime&&mime!==expectedMime.toLowerCase()){cancelBody(response);return fail('invalid-response');}
   return boundedBody(response,maximum,signal);
  }
  return fail('retry-exhausted');
 }
 async function metadata(file:RegisteredDriveFile,signal:AbortSignal):Promise<GoogleDriveMetadata>{
  const url=new URL('https://www.googleapis.com/drive/v3/files/'+file.id);
  url.searchParams.set('fields','id,mimeType,trashed,parents,size');url.searchParams.set('supportsAllDrives','true');
  const data=decodeJson(await request(url,signal,Math.min(256*1024,limits.maxResponseBytes),true));
  if(!record(data)||data.id!==file.id||typeof data.mimeType!=='string'||data.mimeType.length>150||!mimePattern.test(data.mimeType)||typeof data.trashed!=='boolean')return fail('invalid-response');
  const parents=data.parents===undefined?[]:data.parents;
  if(!Array.isArray(parents)||parents.length>32||parents.some(id=>!validId(id))||new Set(parents).size!==parents.length)return fail('invalid-response');
  if(data.trashed||file.expectedMimeType&&data.mimeType.toLowerCase()!==file.expectedMimeType.toLowerCase()||file.expectedParentId&&!parents.includes(file.expectedParentId))return fail('file-policy');
  let size:number|undefined;
  if(data.size!==undefined){
   if(typeof data.size!=='string'||!/^\d+$/.test(data.size)||!Number.isSafeInteger(Number(data.size)))return fail('invalid-response');
   size=Number(data.size);
   if(size>(file.maxBytes??limits.maxResponseBytes))return fail('too-large');
  }
  return {id:file.id,mimeType:data.mimeType,trashed:false,parents:[...parents] as string[],...(size===undefined?{}:{size})};
 }
 return Object.freeze({
  async readSheetRanges(workbookId:string,ranges:readonly string[],options:GoogleReadOptions={}):Promise<GoogleSheetValues>{
   if(!validId(workbookId)||!workbooks.has(workbookId))return fail('not-registered');
   if(!Array.isArray(ranges)||ranges.length<1||ranges.length>limits.maxRanges)return fail('invalid-range');
   const expected=ranges.map(range=>boundedRange(range,limits));
   if(expected.reduce((n,range)=>n+range.rows*range.columns,0)>limits.maxCells)return fail('invalid-range');
   const identities=expected.map(range=>JSON.stringify([range.title,range.startRow,range.startColumn,range.endRow,range.endColumn]));
   if(new Set(identities).size!==identities.length)return fail('invalid-range');
   return operation(options,async signal=>{
    const url=new URL('https://sheets.googleapis.com/v4/spreadsheets/'+workbookId+'/values:batchGet');
    for(const range of expected)url.searchParams.append('ranges',range.source);
    url.searchParams.set('majorDimension','ROWS');url.searchParams.set('valueRenderOption','UNFORMATTED_VALUE');url.searchParams.set('dateTimeRenderOption','SERIAL_NUMBER');
    const data=decodeJson(await request(url,signal,limits.maxResponseBytes,true));
    if(!record(data)||data.spreadsheetId!==workbookId||!Array.isArray(data.valueRanges)||data.valueRanges.length!==expected.length)return fail('invalid-response');
    const valueRanges=data.valueRanges.map((item:unknown,index:number):GoogleValueRange=>{
     if(!record(item)||item.majorDimension!=='ROWS')return fail('invalid-response');
     let actual:BoundedRange;try{actual=boundedRange(item.range,limits);}catch{return fail('invalid-response');}
     if(!sameRange(expected[index],actual))return fail('invalid-response');
     const values=item.values===undefined?[]:item.values;
     if(!Array.isArray(values)||values.length>actual.rows)return fail('invalid-response');
     for(const row of values){
      if(!Array.isArray(row)||row.length>actual.columns)return fail('invalid-response');
      for(const cell of row)if(!(typeof cell==='string'&&cell.length<=50_000||typeof cell==='boolean'||typeof cell==='number'&&Number.isFinite(cell)))return fail('invalid-response');
     }
     return {range:expected[index].source,majorDimension:'ROWS',values:values as GoogleCellValue[][]};
    });
    return {spreadsheetId:workbookId,valueRanges};
   });
  },
  async readDriveMetadata(fileId:string,options:GoogleReadOptions={}):Promise<GoogleDriveMetadata>{
   const file=registeredFile(fileId);return operation(options,signal=>metadata(file,signal));
  },
  async readDriveFile(fileId:string,options:GoogleReadOptions={}):Promise<Uint8Array>{
   const file=registeredFile(fileId);
   return operation(options,async signal=>{
    const info=await metadata(file,signal);
    // Native Workspace documents need an explicit export contract, not alt=media.
    if(info.mimeType.toLowerCase().startsWith('application/vnd.google-apps.'))return fail('file-policy');
    const url=new URL('https://www.googleapis.com/drive/v3/files/'+file.id);url.searchParams.set('alt','media');url.searchParams.set('supportsAllDrives','true');
    const bytes=await request(url,signal,file.maxBytes??limits.maxResponseBytes,false,info.mimeType);
    if(info.size!==undefined&&bytes.byteLength!==info.size)return fail('invalid-response');
    return bytes;
   });
  },
 });
}
