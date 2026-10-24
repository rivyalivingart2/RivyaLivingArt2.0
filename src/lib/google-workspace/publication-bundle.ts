import {canonicalArtifactJson,type JsonValue} from './record-codec';
import {validateDriveJsonRef,type DriveJsonRef,type DriveDocumentStore,type ArtifactOptions} from './drive-documents';

/** Public projections are supplied by trusted server domain policies, not request
 * fields or role claims. This module does not activate the current application.
 */
export type PublicAsset={id:string;fileId:string;mimeType:string;bytes:number;sha256:string};
export type PublicationInput={version:string;source:unknown;shell:unknown;design:unknown;assets:unknown};
export type PublicationBundle={format:'rivya-publication-v1';version:string;source:{version:string;value:JsonValue};shell:{version:string;value:JsonValue};design:{version:string;value:JsonValue};assets:{version:string;value:PublicAsset[]}};
export type PublicationPolicy={
 authorize:(context:{version:string})=>boolean;
 projectSource:(input:JsonValue)=>JsonValue;
 projectShell:(input:JsonValue)=>JsonValue;
 projectDesign:(input:JsonValue)=>JsonValue;
 projectAssets:(input:JsonValue)=>PublicAsset[];
 /** Use existing domain validators; reject drafts and confidential fields. */
 validate:(bundle:PublicationBundle)=>boolean;
 /** Verify registered, approved public bytes and their hashes before activation. */
 verifyAsset:(asset:PublicAsset,signal:AbortSignal)=>Promise<boolean>;
};
export type PublicationPointer={revision:number;version:string;artifact:DriveJsonRef};
export type PublicationPointerIO={
 read:(signal:AbortSignal)=>Promise<PublicationPointer|null>;
 /** One atomic expected-pointer comparison and replacement, or no change. */
 compareAndSwap:(expected:PublicationPointer|null,next:PublicationPointer,signal:AbortSignal)=>Promise<'committed'|'conflict'>;
};
export type PublicationDependencies={documents:DriveDocumentStore;policy:PublicationPolicy;pointers:PublicationPointerIO;timeoutMs?:number};
export class PublicationError extends Error{
 constructor(public readonly code:'INVALID_BUNDLE'|'UNAUTHORIZED'|'ASSET_UNVERIFIED'|'POINTER_CONFLICT'|'POINTER_READ_UNAVAILABLE'|'POINTER_UNAVAILABLE'|'POINTER_OUTCOME_UNKNOWN'|'ABORTED'|'TIMEOUT'){
  super({INVALID_BUNDLE:'Publication bundle is invalid or mixes versions.',UNAUTHORIZED:'Publication requires a trusted server policy.',ASSET_UNVERIFIED:'A public asset has not been verified.',POINTER_CONFLICT:'The active publication changed; retain the candidate for review.',POINTER_READ_UNAVAILABLE:'The active publication could not be read; no pointer update was attempted.',POINTER_UNAVAILABLE:'Publication pointer was not committed; the prior pointer was verified unchanged.',POINTER_OUTCOME_UNKNOWN:'Publication outcome could not be confirmed. Read the pointer before retrying; do not assume rollback.',ABORTED:'Publication operation cancelled; verify the pointer before retrying.',TIMEOUT:'Publication operation timed out; verify the pointer before retrying.'}[code]);this.name='PublicationError';
 }
}
const fail=(code:PublicationError['code']):never=>{throw new PublicationError(code);};
const jsonCopy=<T>(value:T):T=>{try{return JSON.parse(canonicalArtifactJson(value)) as T;}catch{return fail('INVALID_BUNDLE');}};
function freeze<T>(value:T):T{if(value&&typeof value==='object'){for(const item of Object.values(value))freeze(item);Object.freeze(value);}return value;}
const version=(value:unknown):value is string=>typeof value==='string'&&/^[A-Za-z0-9:_-]{1,180}$/.test(value);
const exact=(value:unknown,keys:string[]):value is Record<string,unknown>=>!!value&&typeof value==='object'&&!Array.isArray(value)&&Object.keys(value).length===keys.length&&Object.keys(value).every(key=>keys.includes(key));
function assets(value:unknown):PublicAsset[]{
 const rows=jsonCopy(value);
 if(!Array.isArray(rows)||rows.length>2000)return fail('INVALID_BUNDLE');
 const ids=new Set<string>();
 for(const row of rows){
  if(!exact(row,['id','fileId','mimeType','bytes','sha256'])||!version(row.id)||ids.has(row.id)||typeof row.fileId!=='string'||!(/^[A-Za-z0-9_-]{10,160}$/).test(row.fileId)||typeof row.mimeType!=='string'||row.mimeType.length>150||!(/^[\w.+-]+\/[\w.+-]+$/).test(row.mimeType)||!Number.isSafeInteger(row.bytes)||(row.bytes as number)<1||(row.bytes as number)>256*1024*1024||typeof row.sha256!=='string'||!(/^[a-f0-9]{64}$/).test(row.sha256))return fail('INVALID_BUNDLE');
  ids.add(row.id);
 }
 return rows as PublicAsset[];
}
function policyPresent(policy:PublicationPolicy){if(!policy||['authorize','projectSource','projectShell','projectDesign','projectAssets','validate','verifyAsset'].some(key=>typeof policy[key as keyof PublicationPolicy]!=='function'))return fail('UNAUTHORIZED');}
export function validatePublicationBundle(raw:unknown,policy:PublicationPolicy):PublicationBundle{
 policyPresent(policy);const bundle=jsonCopy(raw);
 if(!exact(bundle,['format','version','source','shell','design','assets'])||bundle.format!=='rivya-publication-v1'||!version(bundle.version))return fail('INVALID_BUNDLE');
 for(const key of ['source','shell','design','assets'])if(!exact(bundle[key],['version','value'])||(bundle[key] as Record<string,unknown>).version!==bundle.version)return fail('INVALID_BUNDLE');
 assets((bundle.assets as {value:unknown}).value);
 let valid=false;try{valid=policy.validate(jsonCopy(bundle) as PublicationBundle)===true;}catch{return fail('INVALID_BUNDLE');}
 if(!valid)return fail('INVALID_BUNDLE');return freeze(bundle as PublicationBundle);
}
export function buildPublicationBundle(input:PublicationInput,policy:PublicationPolicy):PublicationBundle{
 policyPresent(policy);const safe=jsonCopy(input);
 if(!exact(safe,['version','source','shell','design','assets'])||!version(safe.version))return fail('INVALID_BUNDLE');
 let allowed=false;try{allowed=policy.authorize({version:safe.version})===true;}catch{return fail('UNAUTHORIZED');}
 if(!allowed)return fail('UNAUTHORIZED');
 try{
  const section=(value:JsonValue)=>({version:safe.version,value:jsonCopy(value)});
  return validatePublicationBundle({format:'rivya-publication-v1',version:safe.version,source:section(policy.projectSource(safe.source as JsonValue)),shell:section(policy.projectShell(safe.shell as JsonValue)),design:section(policy.projectDesign(safe.design as JsonValue)),assets:section(assets(policy.projectAssets(safe.assets as JsonValue)) as unknown as JsonValue)},policy);
 }catch(error){if(error instanceof PublicationError)throw error;return fail('INVALID_BUNDLE');}
}
function pointer(raw:unknown):PublicationPointer|null{
 if(raw===null)return null;const p=jsonCopy(raw);
 if(!exact(p,['revision','version','artifact'])||!Number.isSafeInteger(p.revision)||(p.revision as number)<1||!version(p.version))return fail('INVALID_BUNDLE');
 let ref:DriveJsonRef;try{ref=validateDriveJsonRef(p.artifact);}catch{return fail('INVALID_BUNDLE');}
 if(ref.purpose!=='publication-bundle'||ref.ownerId!==p.version)return fail('INVALID_BUNDLE');
 return {revision:p.revision as number,version:p.version,artifact:ref};
}
const equal=(a:PublicationPointer|null,b:PublicationPointer|null)=>canonicalArtifactJson(a)===canonicalArtifactJson(b);
async function abortable<T>(fn:()=>Promise<T>,signal:AbortSignal):Promise<T>{
 if(signal.aborted)return fail('ABORTED');
 return new Promise<T>((resolve,reject)=>{const aborted=()=>reject(new PublicationError('ABORTED'));signal.addEventListener('abort',aborted,{once:true});Promise.resolve().then(()=>{if(signal.aborted)return fail('ABORTED');return fn();}).then(resolve,reject).finally(()=>signal.removeEventListener('abort',aborted));});
}
async function run<T>(dependencies:PublicationDependencies,options:ArtifactOptions,fn:(signal:AbortSignal)=>Promise<T>):Promise<T>{
 const duration=dependencies.timeoutMs??30_000;
 if(!Number.isSafeInteger(duration)||duration<1||duration>60_000)return fail('INVALID_BUNDLE');
 if(options.signal?.aborted)return fail('ABORTED');
 const controller=new AbortController();let timeout=false;const relay=()=>controller.abort();options.signal?.addEventListener('abort',relay,{once:true});const timer=setTimeout(()=>{timeout=true;controller.abort();},duration);
 try{return await abortable(()=>fn(controller.signal),controller.signal);}
 catch(error){if(timeout)return fail('TIMEOUT');if(controller.signal.aborted)return fail('ABORTED');throw error;}
 finally{clearTimeout(timer);options.signal?.removeEventListener('abort',relay);}
}
/** Every dependency is verified before one pointer CAS. Failed artifact/asset
 * checks never call CAS. Unknown CAS responses are read back, never rolled back
 * over another publisher. The injected CAS must enforce its atomic contract.
 */
export async function publishPublication(request:{input:PublicationInput;fileId:string;expectedPointer:PublicationPointer|null},dependencies:PublicationDependencies,options:ArtifactOptions={}):Promise<{status:'activated'|'replayed'|'recovered';pointer:PublicationPointer;bundle:PublicationBundle}>{
 const bundle=buildPublicationBundle(request.input,dependencies.policy),expected=pointer(request.expectedPointer);
 const registered=dependencies.documents.getRegistration(request.fileId);
 if(registered.purpose!=='publication-bundle'||registered.ownerId!==bundle.version)return fail('INVALID_BUNDLE');
 if(expected?.version===bundle.version)return fail('POINTER_CONFLICT');
 return run(dependencies,options,async signal=>{
  let current:PublicationPointer|null;
  try{current=pointer(await abortable(()=>dependencies.pointers.read(signal),signal));}catch(error){if(signal.aborted)throw error;if(error instanceof PublicationError)throw error;return fail('POINTER_READ_UNAVAILABLE');}
  // A previous successful attempt may have lost its acknowledgement.
  const possibleReplay=current?.version===bundle.version&&current.artifact.fileId===request.fileId&&current.revision===(expected?.revision??0)+1;
  if(!equal(current,expected)&&!possibleReplay)return fail('POINTER_CONFLICT');
  const artifact=await dependencies.documents.ensureJson(request.fileId,bundle,{signal});
  if(artifact.purpose!=='publication-bundle'||artifact.ownerId!==bundle.version)return fail('INVALID_BUNDLE');
  for(const asset of bundle.assets.value){let verified=false;try{verified=await abortable(()=>dependencies.policy.verifyAsset(jsonCopy(asset),signal),signal);}catch(error){if(signal.aborted)throw error;return fail('ASSET_UNVERIFIED');}if(verified!==true)return fail('ASSET_UNVERIFIED');}
  const next:PublicationPointer={revision:(expected?.revision??0)+1,version:bundle.version,artifact};
  if(!Number.isSafeInteger(next.revision))return fail('INVALID_BUNDLE');
  if(possibleReplay){if(!equal(current,next))return fail('POINTER_CONFLICT');return {status:'replayed',pointer:next,bundle};}
  let acknowledged=false,definitelyUncommitted=false;
  try{const outcome=await abortable(()=>dependencies.pointers.compareAndSwap(jsonCopy(expected),jsonCopy(next),signal),signal);acknowledged=outcome==='committed';definitelyUncommitted=outcome==='conflict';}
  catch(error){if(signal.aborted)throw error;/* Read back the same pointer; never assume rollback. */}
  let observed:PublicationPointer|null;
  try{observed=pointer(await abortable(()=>dependencies.pointers.read(signal),signal));}
  catch(error){if(signal.aborted)throw error;return fail('POINTER_OUTCOME_UNKNOWN');}
  if(equal(observed,next))return {status:acknowledged?'activated':'recovered',pointer:next,bundle};
  // Reading the old pointer does not exclude an in-flight commit that may
  // finish later. Only an explicit atomic no-write outcome rules that out.
  if(equal(observed,expected))return fail(definitelyUncommitted?'POINTER_UNAVAILABLE':'POINTER_OUTCOME_UNKNOWN');
  return fail('POINTER_CONFLICT');
 });
}
/** Pin the pointer ONCE per request. All rendering contracts come from its one
 * complete artifact even if another publisher advances the pointer meanwhile. */
export async function readPinnedPublication(dependencies:PublicationDependencies,options:ArtifactOptions={}):Promise<{pointer:PublicationPointer;bundle:PublicationBundle}|null>{
 return run(dependencies,options,async signal=>{
  let pinned:PublicationPointer|null;
  try{pinned=pointer(await abortable(()=>dependencies.pointers.read(signal),signal));}catch(error){if(signal.aborted)throw error;if(error instanceof PublicationError)throw error;return fail('POINTER_READ_UNAVAILABLE');}if(!pinned)return null;
  const bundle=validatePublicationBundle(await dependencies.documents.readJson(pinned.artifact,{signal}),dependencies.policy);
  if(bundle.version!==pinned.version)return fail('INVALID_BUNDLE');
  return {pointer:pinned,bundle};
 });
}
