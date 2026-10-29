import {createHash} from 'node:crypto';
import {BOUNDED_LIMITS,BoundedStoreError,createBoundedStore,validateBoundedLayout,
  type BoundedLayout,type BoundedPolicyContext,type createBoundedProvider} from './bounded-store';
import {canonicalArtifactJson,canonicalJson,decodeRecord,encodeRecord,digestPayload,
  type GoogleWorkspaceRecord,type JsonValue,type MutationActor,type RecordMutationCommand} from './record-codec';

/** Inactive atomic primitive only. An explicitly registered source UUID pair
 * replaces unbounded token/history search. No provider bootstrap, live adapter
 * wiring, token issuance, authentication grant or session deletion is present. */
export type AccessRedemptionRegistration={kind:'rivya-security-redemption-v1';boundary:'security';layoutSha256:string;requestId:string;staffId:string};
export type AccessRedemptionInput={operationId:string;request:GoogleWorkspaceRecord;staff:GoogleWorkspaceRecord;tokenHash:string;passwordHash:string;transitionAt:number};
export type AccessRedemptionAuthorization={operation:'read'|'redeem';phase:'preflight'|'guarded';actor:MutationActor;registration:AccessRedemptionRegistration;recordId:string|null;request:GoogleWorkspaceRecord|null;staff:GoogleWorkspaceRecord|null};
type StaffPayload={id:string;login:string;name:string;password_hash:string;role:'admin'|'editor';active:boolean;version:number;created_at:string};
type RequestPayload={id:string;kind:'access'|'recovery';login:string;name:string;contact:string;status:'pending'|'approved'|'rejected'|'completed';staff_id:string|null;token_hash:string|null;credential_version:number|null;expires_at:string|null;created_at:string;updated_at:string;decided_by:string|null;version:number};
type ErrorCode='configuration'|'invalid-input'|'unauthorized'|'conflict'|'expired'|'unavailable'|'outcome-unknown';
export class AccessRedemptionError extends Error {constructor(public readonly code:ErrorCode){super('Access redemption: '+code+'.');}}
function fail(code:ErrorCode):never {throw new AccessRedemptionError(code);}
const clone=<T>(value:T):T=>JSON.parse(canonicalArtifactJson(value)) as T;
const same=(a:unknown,b:unknown)=>canonicalArtifactJson(a)===canonicalArtifactJson(b);
const hash=(value:unknown)=>createHash('sha256').update(canonicalArtifactJson(value),'utf8').digest('hex');
const uuid=(value:unknown):value is string=>typeof value==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(value);
const hex=(value:unknown):value is string=>typeof value==='string'&&/^[0-9a-f]{64}$/.test(value);
const password=(value:unknown):value is string=>typeof value==='string'&&/^[0-9a-f]{32}:[0-9a-f]{128}$/.test(value);
const time=(value:unknown):value is number=>Number.isSafeInteger(value)&&Number(value)>=0&&Number(value)<=8_640_000_000_000_000;
const date=(value:unknown):value is string=>typeof value==='string'&&value.length<=40&&Number.isFinite(Date.parse(value));
const version=(value:unknown):value is number=>Number.isSafeInteger(value)&&Number(value)>=1&&Number(value)<=2147483647;
const text=(value:unknown,minimum:number,maximum:number):value is string=>typeof value==='string'&&value.length>=minimum&&value.length<=maximum;
const exact=(value:unknown,keys:string[])=>!!value&&typeof value==='object'&&!Array.isArray(value)&&Object.keys(value).sort().join(',')===keys.sort().join(',');
const sourceId=(table:string,id:string)=>'r_'+createHash('sha256').update(canonicalJson([table,[id]])).digest('hex');

function staffPayload(record:GoogleWorkspaceRecord,id:string):StaffPayload {
  const p=record.payload as unknown as StaffPayload;
  if(record.recordId!==sourceId('rivya_staff',id)||record.archivedAt!==null||record.lastMutationId===null||!exact(p,['id','login','name','password_hash','role','active','version','created_at'])||p.id!==id||!text(p.login,3,80)||!text(p.name,1,100)||!password(p.password_hash)||!['admin','editor'].includes(p.role)||typeof p.active!=='boolean'||!version(p.version)||!date(p.created_at)||record.sourceUpdatedAt!==p.created_at)fail('invalid-input');
  return p;
}
function requestPayload(record:GoogleWorkspaceRecord,id:string):RequestPayload {
  const p=record.payload as unknown as RequestPayload;
  if(record.recordId!==sourceId('rivya_access_requests',id)||record.archivedAt!==null||record.lastMutationId===null||!exact(p,['id','kind','login','name','contact','status','staff_id','token_hash','credential_version','expires_at','created_at','updated_at','decided_by','version'])||p.id!==id||!['access','recovery'].includes(p.kind)||!text(p.login,3,80)||!text(p.name,1,100)||!text(p.contact,3,160)||!['pending','approved','rejected','completed'].includes(p.status)||!(p.staff_id===null||uuid(p.staff_id))||!(p.token_hash===null||hex(p.token_hash))||!(p.credential_version===null||version(p.credential_version))||!(p.expires_at===null||date(p.expires_at))||!date(p.created_at)||!date(p.updated_at)||!(p.decided_by===null||text(p.decided_by,1,240))||!version(p.version)||record.sourceUpdatedAt!==p.updated_at)fail('invalid-input');
  return p;
}

export function createBoundedAccessRedemptionStore(config:{
  layout:BoundedLayout;registration:AccessRedemptionRegistration;actor:MutationActor;ownerLogin:string;clock:()=>number;
  authorize:(context:AccessRedemptionAuthorization)=>boolean|Promise<boolean>;timeoutMs?:number;
},provider:ReturnType<typeof createBoundedProvider>){
  if(!config||typeof config.clock!=='function'||typeof config.authorize!=='function'||!exact(config.actor,['id'])||!text(config.actor.id,1,160)||/[\s\u0000-\u001f]/.test(config.actor.id)||!text(config.ownerLogin,3,80))fail('configuration');
  const layout=validateBoundedLayout(config.layout),registration=clone(config.registration),actor=clone(config.actor),ownerLogin=config.ownerLogin.toLowerCase(),authorize=config.authorize,clock=config.clock;
  if(layout.key!=='security'||!exact(registration,['kind','boundary','layoutSha256','requestId','staffId'])||registration.kind!=='rivya-security-redemption-v1'||registration.boundary!=='security'||registration.layoutSha256!==hash(layout)||!uuid(registration.requestId)||!uuid(registration.staffId))fail('configuration');
  const timeoutMs=config.timeoutMs??BOUNDED_LIMITS.operationTimeoutMs;
  if(!Number.isSafeInteger(timeoutMs)||timeoutMs<1||timeoutMs>BOUNDED_LIMITS.operationTimeoutMs)fail('configuration');
  const requestId=sourceId('rivya_access_requests',registration.requestId),staffId=sourceId('rivya_staff',registration.staffId);
  const now=()=>{const value=clock();if(!time(value))fail('unavailable');return value;};
  const permission=async(context:Omit<AccessRedemptionAuthorization,'actor'|'registration'>)=>{if(await authorize(clone({...context,actor,registration}))!==true)fail('unauthorized');return true;};
  const options=(signal:AbortSignal,deadline:number)=>({signal,deadline});
  const check=(signal:AbortSignal,deadline:number)=>{if(signal.aborted||performance.now()>=deadline)fail('unavailable');};
  const mapError=(error:unknown):never=>{
    if(error instanceof AccessRedemptionError)throw error;
    const code=error&&typeof error==='object'&&'code'in error?error.code:null;
    if(code==='outcome-unknown')fail('outcome-unknown');if(code==='commit-expired')fail('expired');if(code==='conflict'||code==='REVISION_CONFLICT')fail('conflict');fail('unavailable');
  };
  const storage=(policy:Parameters<typeof createBoundedStore>[0]['policy'])=>createBoundedStore({layout,policy,timeoutMs,now:()=>new Date(now()).toISOString()},provider);
  return Object.freeze({
    /** Internal server snapshots only: payloads include password/token hashes. */
    async load(signal:AbortSignal):Promise<{request:GoogleWorkspaceRecord;staff:GoogleWorkspaceRecord}>{
      const deadline=performance.now()+timeoutMs;
      try{
        const read=async(recordId:string)=>storage({authorize:async context=>{
          check(signal,deadline);const record=context.records.get(recordId)??null;
          const allowed=await permission({operation:'read',phase:context.phase,recordId,request:recordId===requestId?record:null,staff:recordId===staffId?record:null});check(signal,deadline);return allowed;
        },validate:()=>false}).load(recordId,actor,options(signal,deadline));
        check(signal,deadline);const request=await read(requestId),staff=await read(staffId);check(signal,deadline);
        if(!request||!staff)fail('invalid-input');requestPayload(request,registration.requestId);staffPayload(staff,registration.staffId);
        return {request,staff};
      }catch(error){return mapError(error);}
    },
    /** Two-record CAS with original-prior validation. A replay is only the
     * original operation's receipt, never a new login/session authorization. */
    async redeem(raw:AccessRedemptionInput,signal:AbortSignal):Promise<{status:'committed'|'replay';staffRevision:number;requestRevision:number;receiptOnly:true}>{
      const deadline=performance.now()+timeoutMs;
      try{
        check(signal,deadline);const input=clone(raw);
        if(!exact(input,['operationId','request','staff','tokenHash','passwordHash','transitionAt'])||!text(input.operationId,1,120)||!/^[A-Za-z0-9:_-]+$/.test(input.operationId)||!hex(input.tokenHash)||!password(input.passwordHash)||!time(input.transitionAt)||input.transitionAt>now())fail('invalid-input');
        const request=decodeRecord(encodeRecord(input.request)),staff=decodeRecord(encodeRecord(input.staff)),r=requestPayload(request,registration.requestId),s=staffPayload(staff,registration.staffId);
        if(r.status!=='approved'||r.staff_id!==s.id||r.token_hash!==input.tokenHash||r.credential_version!==s.version||!r.expires_at||Date.parse(r.expires_at)<=input.transitionAt||Date.parse(r.updated_at)>input.transitionAt||Date.parse(s.created_at)>input.transitionAt||r.login.toLowerCase()!==s.login.toLowerCase()||s.login.toLowerCase()===ownerLogin||s.version>=2147483647||r.version>=2147483647||(r.kind==='access'?s.active:!s.active))fail('invalid-input');
        const commitBefore=Date.parse(r.expires_at),at=new Date(input.transitionAt).toISOString();
        const nextStaff={...s,password_hash:input.passwordHash,active:true,version:s.version+1};
        const nextRequest={...r,status:'completed' as const,token_hash:null,expires_at:null,version:r.version+1,updated_at:at};
        const operationId='access-redemption:'+hash({layout,registration,actor,operationId:input.operationId,request,staff,tokenHash:input.tokenHash,passwordHash:input.passwordHash,transitionAt:input.transitionAt});
        const commands:RecordMutationCommand[]=[
          {recordId:staffId,expectedRevision:staff.revision,mutationId:operationId+':staff',payload:nextStaff as unknown as JsonValue,sourceUpdatedAt:staff.sourceUpdatedAt,archivedAt:null},
          {recordId:requestId,expectedRevision:request.revision,mutationId:operationId+':request',payload:nextRequest as unknown as JsonValue,sourceUpdatedAt:at,archivedAt:null},
        ];
        const guarded=(context:BoundedPolicyContext)=>{
          if(context.phase!=='guarded'||!same(context.layout,layout)||!same(context.actor,actor)||context.operationId!==operationId||context.commitBefore!==commitBefore||!same(context.commands,commands))fail('invalid-input');
          if(!context.originalsByMutation.has(commands[0].mutationId)||!context.originalsByMutation.has(commands[1].mutationId)||!same(context.originalsByMutation.get(commands[0].mutationId),staff)||!same(context.originalsByMutation.get(commands[1].mutationId),request))throw new BoundedStoreError('conflict');
          if(!context.replay&&now()>=commitBefore)fail('expired');
        };
        const store=storage({authorize:async context=>{
          check(signal,deadline);
          if(context.phase==='preflight')return permission({operation:'redeem',phase:'preflight',recordId:null,request,staff});
          return true;
        },validate:async context=>{
          check(signal,deadline);guarded(context);
          const allowed=await permission({operation:'redeem',phase:'guarded',recordId:null,request,staff});check(signal,deadline);return allowed;
        }});
        check(signal,deadline);const outcome=await store.mutate({actor,operationId,commitBefore,commands},options(signal,deadline));
        if(outcome.status==='unknown')fail('outcome-unknown');if(outcome.status==='conflict')fail(now()>=commitBefore?'expired':'conflict');
        if(!('receipts'in outcome))fail('outcome-unknown');
        if(outcome.receipts.length!==2||outcome.receipts.some((receipt,i)=>receipt.recordId!==commands[i].recordId||receipt.revision!==commands[i].expectedRevision+1||receipt.payloadSha256!==digestPayload(commands[i].payload)||receipt.lastMutationId!==commands[i].mutationId||receipt.sourceUpdatedAt!==commands[i].sourceUpdatedAt||receipt.archivedAt!==null))fail('outcome-unknown');
        if(signal.aborted||performance.now()>=deadline)fail('outcome-unknown');
        return {status:outcome.status,staffRevision:outcome.receipts[0].revision,requestRevision:outcome.receipts[1].revision,receiptOnly:true};
      }catch(error){return mapError(error);}
    },
  });
}
