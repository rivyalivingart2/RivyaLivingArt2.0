import {createHash,randomUUID} from 'node:crypto';
import {BOUNDED_LIMITS,BoundedStoreError,createBoundedStore,validateBoundedLayout,type BoundedLayout,type BoundedPolicyContext,type BoundedOutcome,type createBoundedProvider} from './bounded-store';
import {canonicalArtifactJson,canonicalJson,digestPayload,type GoogleWorkspaceRecord,type JsonValue,type MutationActor,type RecordMutationCommand} from './record-codec';

/** Inactive explicit security provider. Source sessions have FIVE fields and
 * sourceUpdatedAt:null. No token/cookie generation, epoch bootstrap or selection. */
export type BoundedSessionOptions={signal?:AbortSignal;deadline?:number};
export type BoundedSessionIdentity={kind:'staff';staffId:string;credentialVersion:number;login:string;role:'admin'|'editor'}|{kind:'owner'};
export type BoundedSessionPrincipal={adminId:string;role:'admin'|'editor';staffId:string|null;credentialVersion?:number};
export type BoundedSessionPayload={token_hash:string;credential_version:string;expires_at:string;idle_expires_at:string;staff_id:string|null};
export type BoundedSessionAuthorization={operation:'create'|'refresh'|'revoke';phase:'preflight'|'guarded';actor:MutationActor;recordId:string;tokenHash:string;session:GoogleWorkspaceRecord|null;staff:GoogleWorkspaceRecord|null;ownerEpoch:GoogleWorkspaceRecord|null;identity:BoundedSessionIdentity|null};
export type BoundedSessionConfig={layout:BoundedLayout;actor:MutationActor;clock:()=>number;authorize:(context:BoundedSessionAuthorization)=>boolean|Promise<boolean>;owner:{login:string;fingerprint:string;epochRecordId:string};timeoutMs?:number};
export type BoundedSessionCreateInput={operationId:string;tokenHash:string;identity:BoundedSessionIdentity;createdAt:number};
export type BoundedSessionTokenInput={operationId:string;tokenHash:string};
export type BoundedSessionCreateResult={status:'committed'|'replay';receiptOnly:true;sessionRevision:number};
export type BoundedSessionValidationResult={status:'valid';identity:BoundedSessionPrincipal;sessionRevision:number}|{status:'invalid'}|{status:'replay';receiptOnly:true;sessionRevision:number};
export type BoundedSessionRevokeResult={status:'revoked'|'replay';receiptOnly:true;sessionRevision:number}|{status:'missing';receiptOnly:true};
type ErrorCode='configuration'|'invalid-input'|'invalid-identity'|'unauthorized'|'conflict'|'expired'|'unavailable'|'outcome-unknown';
export class BoundedSessionError extends Error {constructor(public readonly code:ErrorCode){super('Bounded session: '+code+'.');}}
function fail(code:ErrorCode):never {throw new BoundedSessionError(code);}
const ABSOLUTE_MS=8*60*60*1000,IDLE_MS=30*60*1000;
const clone=<T>(value:T):T=>JSON.parse(canonicalArtifactJson(value)) as T;
const same=(a:unknown,b:unknown)=>canonicalArtifactJson(a)===canonicalArtifactJson(b);
const hash=(value:unknown)=>createHash('sha256').update(canonicalArtifactJson(value)).digest('hex');
const exact=(value:unknown,keys:string[])=>!!value&&typeof value==='object'&&!Array.isArray(value)&&Object.keys(value).sort().join(',')===keys.sort().join(',');
const text=(value:unknown,min:number,max:number):value is string=>typeof value==='string'&&value.length>=min&&value.length<=max;
const id=(value:unknown):value is string=>text(value,1,160)&&/^[A-Za-z0-9:_-]+$/.test(value);
const hex=(value:unknown):value is string=>typeof value==='string'&&/^[a-f0-9]{64}$/.test(value);
const uuid=(value:unknown):value is string=>typeof value==='string'&&/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(value);
const integer=(value:unknown,min:number,max:number):value is number=>Number.isSafeInteger(value)&&Number(value)>=min&&Number(value)<=max;
const timestamp=(value:unknown):value is string=>text(value,1,40)&&Number.isFinite(Date.parse(value));
const sourceId=(table:string,key:string)=>'r_'+createHash('sha256').update(canonicalJson([table,[key]])).digest('hex');
const sessionId=(tokenHash:string)=>sourceId('rivya_studio_sessions',tokenHash);
type StaffPayload={id:string;login:string;name:string;password_hash:string;role:'admin'|'editor';active:boolean;version:number;created_at:string};
type Operation={signal:AbortSignal;deadline:number;dispatched:boolean;check:()=>void;wait:<T>(work:()=>Promise<T>)=>Promise<T>};

export function createBoundedSessionStore(config:BoundedSessionConfig,provider:ReturnType<typeof createBoundedProvider>){
  if(!config||typeof config.clock!=='function'||typeof config.authorize!=='function'||!exact(config.actor,['id'])||!id(config.actor.id)||!exact(config.owner,['login','fingerprint','epochRecordId'])||!text(config.owner.login,3,80)||config.owner.login.trim()!==config.owner.login||!hex(config.owner.fingerprint)||!id(config.owner.epochRecordId)||!provider||['readManifest','readPages','commit'].some(key=>typeof provider[key as keyof typeof provider]!=='function'))fail('configuration');
  const layout=validateBoundedLayout(config.layout),actor=clone(config.actor),owner=clone(config.owner),clock=config.clock,authorize=config.authorize,timeoutMs=config.timeoutMs??BOUNDED_LIMITS.operationTimeoutMs;
  if(layout.key!=='security'||!integer(timeoutMs,1,BOUNDED_LIMITS.operationTimeoutMs))fail('configuration');
  const now=()=>{const value=clock();if(!integer(value,0,8_640_000_000_000_000))fail('unavailable');return value;};
  const mapError=(error:unknown):never=>{if(error instanceof BoundedSessionError)throw error;const code=error&&typeof error==='object'&&'code'in error?error.code:null;if(code==='outcome-unknown')fail('outcome-unknown');if(code==='commit-expired')fail('expired');if(code==='conflict'||code==='REVISION_CONFLICT')fail('conflict');fail('unavailable');};
  async function run<T>(options:BoundedSessionOptions,work:(operation:Operation)=>Promise<T>):Promise<T>{
    if(options.deadline!==undefined&&(!Number.isFinite(options.deadline)||options.deadline<0))fail('invalid-input');
    const start=performance.now(),deadline=Math.min(start+timeoutMs,options.deadline??Infinity),controller=new AbortController();
    const abort=()=>controller.abort();options.signal?.addEventListener('abort',abort,{once:true});if(options.signal?.aborted)abort();
    const operation:Operation={signal:controller.signal,deadline,dispatched:false,check(){if(controller.signal.aborted||performance.now()>=deadline)fail(operation.dispatched?'outcome-unknown':'unavailable');},async wait<U>(action:()=>Promise<U>):Promise<U>{
      operation.check();const value=await new Promise<U>((resolve,reject)=>{const cancelled=()=>reject(new BoundedSessionError(operation.dispatched?'outcome-unknown':'unavailable'));controller.signal.addEventListener('abort',cancelled,{once:true});try{operation.check();Promise.resolve(action()).then(resolve,reject).finally(()=>controller.signal.removeEventListener('abort',cancelled));}catch(error){controller.signal.removeEventListener('abort',cancelled);reject(error);}});operation.check();return value;
    }};
    const timer=setTimeout(abort,Math.max(0,deadline-start));
    try{return await operation.wait(()=>work(operation));}catch(error){return mapError(error);}finally{clearTimeout(timer);options.signal?.removeEventListener('abort',abort);controller.abort();}
  }
  const authorized=async(o:Operation,context:Omit<BoundedSessionAuthorization,'actor'>)=>{o.check();if(await o.wait(()=>Promise.resolve(authorize(clone({...context,actor}))))!==true)fail('unauthorized');return true;};
  const store=(o:Operation,policy:Parameters<typeof createBoundedStore>[0]['policy'])=>createBoundedStore({layout,policy,timeoutMs,now:()=>new Date(now()).toISOString()},{...provider,async commit(prepared,options){o.check();o.dispatched=true;return provider.commit(prepared,options);}});
  const baseContext=(operation:BoundedSessionAuthorization['operation'],tokenHash:string,recordId:string,phase:BoundedSessionAuthorization['phase']):Omit<BoundedSessionAuthorization,'actor'>=>({operation,phase,tokenHash,recordId,session:null,staff:null,ownerEpoch:null,identity:null});
  async function read(o:Operation,operation:BoundedSessionAuthorization['operation'],tokenHash:string,recordId:string,kind:'session'|'staff'|'ownerEpoch'){
    return store(o,{authorize:context=>authorized(o,{...baseContext(operation,tokenHash,recordId,context.phase),[kind]:context.records.get(recordId)??null}),validate:()=>false}).load(recordId,actor,{signal:o.signal,deadline:o.deadline});
  }
  function session(record:GoogleWorkspaceRecord,tokenHash:string):BoundedSessionPayload{
    const p=record.payload as unknown as BoundedSessionPayload;
    if(record.recordId!==sessionId(tokenHash)||record.sourceUpdatedAt!==null||record.lastMutationId===null||!(record.archivedAt===null||timestamp(record.archivedAt))||!exact(p,['token_hash','credential_version','expires_at','idle_expires_at','staff_id'])||p.token_hash!==tokenHash||!text(p.credential_version,1,64)||!timestamp(p.expires_at)||!timestamp(p.idle_expires_at)||Date.parse(p.idle_expires_at)>Date.parse(p.expires_at)||!(p.staff_id===null||uuid(p.staff_id)))fail('unavailable');
    return p;
  }
  function staff(record:GoogleWorkspaceRecord,staffId:string):StaffPayload{
    const p=record.payload as unknown as StaffPayload;
    if(record.recordId!==sourceId('rivya_staff',staffId)||record.archivedAt!==null||record.lastMutationId===null||!exact(p,['id','login','name','password_hash','role','active','version','created_at'])||p.id!==staffId||!text(p.login,3,80)||!text(p.name,1,100)||!(/^[a-f0-9]{32}:[a-f0-9]{128}$/).test(p.password_hash)||!['admin','editor'].includes(p.role)||typeof p.active!=='boolean'||!integer(p.version,1,2147483647)||!timestamp(p.created_at)||record.sourceUpdatedAt!==p.created_at)fail('unavailable');
    return p;
  }
  function epoch(record:GoogleWorkspaceRecord|null):boolean{
    return !!record&&record.recordId===owner.epochRecordId&&record.sourceUpdatedAt===null&&record.archivedAt===null&&record.lastMutationId!==null&&exact(record.payload,['format','fingerprint'])&&(record.payload as {format:unknown}).format==='rivya-owner-credential-epoch-v1'&&(record.payload as {fingerprint:unknown}).fingerprint===owner.fingerprint;
  }
  const relationId=(p:BoundedSessionPayload)=>p.staff_id===null?owner.epochRecordId:sourceId('rivya_staff',p.staff_id);
  function principal(p:BoundedSessionPayload,relation:GoogleWorkspaceRecord|null):BoundedSessionPrincipal|null{
    if(p.staff_id===null)return p.credential_version===owner.fingerprint&&epoch(relation)?{adminId:owner.login,role:'admin',staffId:null}:null;
    if(!relation)return null;const s=staff(relation,p.staff_id);
    if(!s.active||String(s.version)!==p.credential_version||s.login.toLowerCase()===owner.login.toLowerCase())return null;
    return {adminId:s.login,role:s.role,staffId:s.id,credentialVersion:s.version};
  }
  const active=(record:GoogleWorkspaceRecord,p:BoundedSessionPayload,at:number)=>record.archivedAt===null&&Date.parse(p.expires_at)>at&&Date.parse(p.idle_expires_at)>at&&Date.parse(p.expires_at)-at<=ABSOLUTE_MS&&Date.parse(p.idle_expires_at)-at<=IDLE_MS;
  function tokens(input:BoundedSessionTokenInput){if(!exact(input,['operationId','tokenHash'])||!id(input.operationId)||!hex(input.tokenHash))fail('invalid-input');}
  function receipt(outcome:BoundedOutcome,command:RecordMutationCommand):number{
    if(outcome.status==='unknown')fail('outcome-unknown');if(outcome.status==='conflict')throw new BoundedStoreError('conflict');if(!('receipts'in outcome))fail('outcome-unknown');
    const r=outcome.receipts[0];if(outcome.receipts.length!==1||!r||r.recordId!==command.recordId||r.revision!==command.expectedRevision+1||r.payloadSha256!==digestPayload(command.payload)||r.sourceUpdatedAt!==command.sourceUpdatedAt||r.archivedAt!==command.archivedAt||r.lastMutationId!==command.mutationId)fail('outcome-unknown');return r.revision;
  }
  const commandContext=(operation:BoundedSessionAuthorization['operation'],tokenHash:string,c:BoundedPolicyContext,relation:string|null,identity:BoundedSessionIdentity|null)=>({...baseContext(operation,tokenHash,sessionId(tokenHash),c.phase),session:c.records.get(sessionId(tokenHash))??null,staff:relation&&relation!==owner.epochRecordId?c.records.get(relation)??null:null,ownerEpoch:relation===owner.epochRecordId?c.records.get(relation)??null:null,identity});
  const policyShape=(c:BoundedPolicyContext,operationId:string,command:RecordMutationCommand,commitBefore:number|null)=>{if(c.phase!=='guarded'||!same(c.layout,layout)||!same(c.actor,actor)||c.operationId!==operationId||c.commitBefore!==commitBefore||!same(c.commands,[command]))fail('invalid-input');};
  // Operations below use this common bounded provider and authorization path.
  return Object.freeze({
    async create(raw:BoundedSessionCreateInput,options:BoundedSessionOptions={}):Promise<BoundedSessionCreateResult>{
      return run(options,async o=>{
        const input=clone(raw);
        if(!exact(input,['operationId','tokenHash','identity','createdAt'])||!id(input.operationId)||!hex(input.tokenHash)||!integer(input.createdAt,0,8_640_000_000_000_000-ABSOLUTE_MS)||input.createdAt>now())fail('invalid-input');
        const identity=input.identity;
        if(!identity||!(identity.kind==='owner'?exact(identity,['kind']):identity.kind==='staff'&&exact(identity,['kind','staffId','credentialVersion','login','role'])&&uuid(identity.staffId)&&integer(identity.credentialVersion,1,2147483647)&&text(identity.login,3,80)&&['admin','editor'].includes(identity.role)))fail('invalid-input');
        const payload:BoundedSessionPayload={token_hash:input.tokenHash,credential_version:identity.kind==='owner'?owner.fingerprint:String(identity.credentialVersion),expires_at:new Date(input.createdAt+ABSOLUTE_MS).toISOString(),idle_expires_at:new Date(input.createdAt+IDLE_MS).toISOString(),staff_id:identity.kind==='owner'?null:identity.staffId};
        const relation=relationId(payload),operationId='session-create:'+hash({input,layout,actor,owner}),commitBefore=input.createdAt+IDLE_MS;
        const command:RecordMutationCommand={recordId:sessionId(input.tokenHash),expectedRevision:0,mutationId:operationId,payload:payload as unknown as JsonValue,sourceUpdatedAt:null,archivedAt:null};
        const writer=store(o,{authorize:c=>c.phase==='preflight'?authorized(o,{...baseContext('create',input.tokenHash,command.recordId,'preflight'),identity}):true,validate:async c=>{
          o.check();policyShape(c,operationId,command,commitBefore);
          if(!c.originalsByMutation.has(command.mutationId)||c.originalsByMutation.get(command.mutationId)!==null)throw new BoundedStoreError('conflict');
          const who=principal(payload,c.records.get(relation)??null);
          if(!who||(identity.kind==='staff'&&(who.adminId!==identity.login||who.role!==identity.role||who.credentialVersion!==identity.credentialVersion)))fail('invalid-identity');
          if(c.replay){
            const current=c.records.get(command.recordId);if(!current)fail('invalid-identity');const p=session(current,input.tokenHash);
            if(!active(current,p,now())||p.staff_id!==payload.staff_id||p.credential_version!==payload.credential_version||p.expires_at!==payload.expires_at)fail('invalid-identity');
          }else if(now()>=commitBefore)fail('expired');
          return authorized(o,commandContext('create',input.tokenHash,c,relation,identity));
        }});
        const outcome=await writer.mutate({actor,operationId,commands:[command],relationships:[relation],commitBefore},{signal:o.signal,deadline:o.deadline});
        const sessionRevision=receipt(outcome,command);o.check();
        if(outcome.status!=='committed'&&outcome.status!=='replay')fail('outcome-unknown');
        return {status:outcome.status,receiptOnly:true,sessionRevision};
      });
    },
    /** Every successful validation advances a guarded session revision, even
     * when the wall clock and idle expiry have not changed. Caller operation IDs may
     * be reused: each refresh attempt gets a fresh nonce and reauthorizes current
     * state. A provider replay is a receipt and never authenticates. */
    async validateAndRefresh(raw:BoundedSessionTokenInput,options:BoundedSessionOptions={}):Promise<BoundedSessionValidationResult>{
      return run(options,async o=>{
        const input=clone(raw);tokens(input);
        for(let attempt=0;attempt<4;attempt++){
          o.check();const current=await read(o,'refresh',input.tokenHash,sessionId(input.tokenHash),'session');if(!current)return {status:'invalid'};
          const payload=session(current,input.tokenHash),at=now();if(!active(current,payload,at))return {status:'invalid'};
          const relation=relationId(payload),related=await read(o,'refresh',input.tokenHash,relation,payload.staff_id===null?'ownerEpoch':'staff'),who=principal(payload,related);if(!who)return {status:'invalid'};
          const next={...payload,idle_expires_at:new Date(Math.min(Date.parse(payload.expires_at),at+IDLE_MS)).toISOString()};
          const operationId='session-refresh:'+hash({input,nonce:randomUUID(),current,related,next,actor,layout}),commitBefore=Math.min(Date.parse(payload.expires_at),Date.parse(payload.idle_expires_at));
          const command:RecordMutationCommand={recordId:current.recordId,expectedRevision:current.revision,mutationId:operationId,payload:next as unknown as JsonValue,sourceUpdatedAt:null,archivedAt:null};
          const writer=store(o,{authorize:c=>c.phase==='preflight'?authorized(o,baseContext('refresh',input.tokenHash,current.recordId,'preflight')):true,validate:async c=>{
            o.check();policyShape(c,operationId,command,commitBefore);
            if(!c.originalsByMutation.has(command.mutationId)||!same(c.originalsByMutation.get(command.mutationId),current)||!same(c.records.get(relation)??null,related))throw new BoundedStoreError('conflict');
            if(!c.replay&&!same(c.records.get(current.recordId)??null,current))throw new BoundedStoreError('conflict');
            const live=c.records.get(current.recordId);if(!live||!active(live,session(live,input.tokenHash),now())||!same(principal(payload,c.records.get(relation)??null),who))fail('invalid-identity');
            return authorized(o,commandContext('refresh',input.tokenHash,c,relation,null));
          }});
          try{
            const outcome=await writer.mutate({actor,operationId,commands:[command],relationships:[relation],commitBefore},{signal:o.signal,deadline:o.deadline});
            if(outcome.status==='conflict'){o.dispatched=false;continue;}
            const sessionRevision=receipt(outcome,command);o.check();
            return outcome.status==='replay'?{status:'replay',receiptOnly:true,sessionRevision}:{status:'valid',identity:clone(who),sessionRevision};
          }catch(error){
            const code=error&&typeof error==='object'&&'code'in error?error.code:null;
            if(code==='conflict'||code==='REVISION_CONFLICT'){o.dispatched=false;continue;}
            if(code==='invalid-identity'||code==='expired'||code==='commit-expired')return {status:'invalid'};
            throw error;
          }
        }
        fail('conflict');
      });
    },
    async revoke(raw:BoundedSessionTokenInput,options:BoundedSessionOptions={}):Promise<BoundedSessionRevokeResult>{
      return run(options,async o=>{
        const input=clone(raw);tokens(input);
        for(let attempt=0;attempt<4;attempt++){
          const current=await read(o,'revoke',input.tokenHash,sessionId(input.tokenHash),'session');if(!current)return {status:'missing',receiptOnly:true};
          session(current,input.tokenHash);if(current.archivedAt!==null)return {status:'missing',receiptOnly:true};
          const archivedAt=new Date(now()).toISOString(),operationId='session-revoke:'+hash({input,current,archivedAt,layout,actor});
          const command:RecordMutationCommand={recordId:current.recordId,expectedRevision:current.revision,mutationId:operationId,payload:current.payload,sourceUpdatedAt:null,archivedAt};
          const writer=store(o,{authorize:c=>c.phase==='preflight'?authorized(o,baseContext('revoke',input.tokenHash,current.recordId,'preflight')):true,validate:async c=>{
            o.check();policyShape(c,operationId,command,null);
            if(!c.originalsByMutation.has(command.mutationId)||!same(c.originalsByMutation.get(command.mutationId),current)||(!c.replay&&!same(c.records.get(current.recordId)??null,current)))throw new BoundedStoreError('conflict');
            return authorized(o,commandContext('revoke',input.tokenHash,c,null,null));
          }});
          try{
            const outcome=await writer.mutate({actor,operationId,commands:[command]},{signal:o.signal,deadline:o.deadline});
            if(outcome.status==='conflict'){o.dispatched=false;continue;}
            const sessionRevision=receipt(outcome,command);o.check();return {status:outcome.status==='replay'?'replay':'revoked',receiptOnly:true,sessionRevision};
          }catch(error){const code=error&&typeof error==='object'&&'code'in error?error.code:null;if(code==='conflict'||code==='REVISION_CONFLICT'){o.dispatched=false;continue;}throw error;}
        }
        fail('conflict');
      });
    },
  });
}
export type BoundedSessionStore=ReturnType<typeof createBoundedSessionStore>;
