import test from 'node:test';
import assert from 'node:assert/strict';
import {createBoundedSessionStore} from '../src/lib/google-workspace/bounded-session-store.ts';
import {buildBoundedState,createBoundedStore,readBoundedRecords,auditBoundedState} from '../src/lib/google-workspace/bounded-store.ts';
import {planRecordMutation} from '../src/lib/google-workspace/record-codec.ts';
import {stableRecordId} from '../tools/google-workspace/migration.mjs';
import {boundedGatewayHarness,boundedFixtureLayout} from './helpers/google-workspace-bounded-harness.mjs';

// Independent synthetic tests against the exact saved Apps Script emulator.
// No actual sessions, owner fingerprints, Google calls or authentication proof.
const staffUuid='00000000-0000-4000-8000-000000000001',tokenHash='a'.repeat(64),otherToken='b'.repeat(64);
const fingerprint='c'.repeat(64),rotatedFingerprint='d'.repeat(64),epochId='owner-credential-epoch';
const at='2026-10-28T12:00:00.000Z',created='2026-10-28T11:00:00.000Z';
const actor={id:'service:independent-session-test'},layout={...boundedFixtureLayout,key:'security'};
const idFor=(table,key)=>stableRecordId({sourceTable:table,primaryKey:[table==='rivya_staff'?'id':'token_hash']},{id:key,token_hash:key});
const sessionId=idFor('rivya_studio_sessions',tokenHash),staffId=idFor('rivya_staff',staffUuid);
const identity={kind:'staff',staffId:staffUuid,credentialVersion:1,login:'fixture.staff',role:'admin'};
const newRequest=(extra={})=>({operationId:'fixture-create',tokenHash,identity:{...identity},createdAt:Date.parse(at),...extra});
function fixture({session='staff',staff={},epoch=fingerprint,sessionPayload={}}={}){
  const staffPayload={id:staffUuid,login:'fixture.staff',name:'Fixture staff',password_hash:'1'.repeat(32)+':'+ '2'.repeat(128),role:'admin',active:true,version:1,created_at:created,...staff};
  const records=[{recordId:staffId,payload:staffPayload,sourceUpdatedAt:created},
    {recordId:epochId,payload:{format:'rivya-owner-credential-epoch-v1',fingerprint:epoch},sourceUpdatedAt:null}];
  if(session)records.push({recordId:sessionId,sourceUpdatedAt:null,payload:{token_hash:tokenHash,
    credential_version:session==='owner'?fingerprint:String(staffPayload.version),expires_at:'2026-10-28T20:00:00.000Z',
    idle_expires_at:'2026-10-28T12:30:00.000Z',staff_id:session==='owner'?null:staffUuid,...sessionPayload}});
  const plans=records.map((record,i)=>planRecordMutation({current:null,previousMutation:null,actor:{id:'fixture-seed'},now:at,authorize:()=>true,
    command:{...record,expectedRevision:0,mutationId:'seed-session-fixture-'+i,archivedAt:null}}));
  const h=boundedGatewayHarness(buildBoundedState({layout,epoch:'independent-session-fixture',plans}),layout);
  const config={layout:h.layout,actor,clock:()=>h.state.now,authorize:()=>true,owner:{login:'fixture.owner',fingerprint,epochRecordId:epochId}};
  const store=(provider=h.provider,extra={})=>createBoundedSessionStore({...config,...extra},provider);
  const read=(recordId=sessionId)=>readBoundedRecords(h.layout,h.snapshot(),[recordId]).get(recordId)??null;
  const change=async(recordId,change,mutationId='independent-change')=>{
    const current=read(recordId),writer=createBoundedStore({layout:h.layout,now:()=>new Date(h.state.now).toISOString(),policy:{authorize:()=>true,validate:()=>true}},h.provider);
    return writer.mutate({actor:{id:'fixture-concurrent-admin'},operationId:mutationId,commands:[{recordId,expectedRevision:current.revision,
      mutationId,payload:{...current.payload,...change},sourceUpdatedAt:current.sourceUpdatedAt,archivedAt:current.archivedAt}]});
  };
  return {h,config,store,read,change};
}
async function noGrant(promise){
  try{const result=await promise;assert.ok(!['valid','committed'].includes(result.status));return result;}
  catch(error){assert.ok(['conflict','invalid','expired','unavailable','outcome-unknown','unauthorized','invalid-input','invalid-identity'].includes(error.code),String(error));return error;}
}
function beforeCommit(f,action){let called=false;return {...f.h.provider,async commit(prepared,options){if(!called){called=true;await action(prepared);}return f.h.provider.commit(prepared,options);}};}

test('staff disable or credential rotation between proof and CAS prevents a stale session grant',async()=>{
  for(const patch of [{active:false},{version:2}]){
    const f=fixture(),provider=beforeCommit(f,()=>f.change(staffId,patch));
    await noGrant(f.store(provider).validateAndRefresh({tokenHash,operationId:'validate-before-change'}));
    assert.equal(f.read().revision,1);assert.equal(f.h.state.batches,2);
    await noGrant(f.store().validateAndRefresh({tokenHash,operationId:'validate-after-change'}));
    assert.equal(f.read().revision,1);
  }
});

test('concurrent role change cannot return the old role, and a fresh validation uses current role',async()=>{
  const f=fixture(),provider=beforeCommit(f,()=>f.change(staffId,{role:'editor'}));
  try {
    const raced=await f.store(provider).validateAndRefresh({tokenHash,operationId:'role-race'});
    if(raced.status==='valid')assert.equal(raced.identity.role,'editor');
  } catch(error) { assert.ok(['conflict','unavailable','outcome-unknown'].includes(error.code),String(error)); }
  const current=await f.store().validateAndRefresh({tokenHash,operationId:'role-current'});
  assert.equal(current.status,'valid');assert.equal(current.identity.role,'editor');assert.equal(current.identity.adminId,'fixture.staff');
});

test('same-wall-time unchanged idle refresh still checks a guarded staff record and does not skip CAS',async()=>{
  const f=fixture();let commits=0;
  const provider={...f.h.provider,async commit(prepared,options){commits++;return f.h.provider.commit(prepared,options);}};
  const before=f.read().payload.idle_expires_at;
  const result=await f.store(provider).validateAndRefresh({tokenHash,operationId:'same-time'});
  assert.equal(result.status,'valid');assert.equal(f.read().payload.idle_expires_at,before);
  assert.equal(commits,1);assert.equal(f.read().revision,2);
});

test('refresh fences the old idle expiry and cannot extend an already expired session during commit',async()=>{
  const f=fixture(),oldIdle=Date.parse(f.read().payload.idle_expires_at);f.h.state.now=oldIdle-1000;
  const provider=beforeCommit(f,prepared=>{assert.equal(prepared.commitBefore,oldIdle);f.h.state.now=oldIdle;});
  await noGrant(f.store(provider).validateAndRefresh({tokenHash,operationId:'old-idle-expiry'}));
  assert.equal(f.h.state.batches,0);assert.equal(f.read().revision,1);assert.equal(Date.parse(f.read().payload.idle_expires_at),oldIdle);
});

test('revoke winning the refresh race archives the session and blocks historical refresh authorization',async()=>{
  const f=fixture(),provider=beforeCommit(f,()=>f.store().revoke({tokenHash,operationId:'revoke-first'}));
  await noGrant(f.store(provider).validateAndRefresh({tokenHash,operationId:'losing-refresh'}));
  assert.notEqual(f.read().archivedAt,null);const before=JSON.stringify(f.h.snapshot());f.h.restart();
  await noGrant(f.store().validateAndRefresh({tokenHash,operationId:'losing-refresh'}));
  assert.equal(JSON.stringify(f.h.snapshot()),before);
});

test('a historical successful refresh receipt never grants after disable, revoke or owner epoch rotation',async()=>{
  for(const change of ['disable','revoke','owner-rotation']){
    const f=fixture({session:change==='owner-rotation'?'owner':'staff'}),input={tokenHash,operationId:'original-success'};
    assert.equal((await f.store().validateAndRefresh(input)).status,'valid');
    if(change==='disable')await f.change(staffId,{active:false});
    else if(change==='revoke')await f.store().revoke({tokenHash,operationId:'later-revoke'});
    else await f.change(epochId,{fingerprint:rotatedFingerprint});
    const batches=f.h.state.batches;f.h.restart();const result=await noGrant(f.store().validateAndRefresh(input));
    if(result.status==='replay'){assert.equal(result.receiptOnly,true);assert.equal(Object.hasOwn(result,'identity'),false);}
    assert.equal(f.h.state.batches,batches);
  }
});

test('old creation replay and fresh creation cannot resurrect an archived token identity',async()=>{
  const f=fixture({session:null}),input=newRequest();
  const first=await f.store().create(input);assert.equal(first.receiptOnly,true);
  await f.store().revoke({tokenHash,operationId:'archive-created-session'});const before=JSON.stringify(f.h.snapshot());f.h.restart();
  const replay=await noGrant(f.store().create(input));
  if(replay.status){assert.equal(replay.status,'replay');assert.equal(replay.receiptOnly,true);}
  await noGrant(f.store().create({...input,operationId:'fresh-create-same-token'}));
  assert.equal(JSON.stringify(f.h.snapshot()),before);assert.notEqual(f.read().archivedAt,null);
  await noGrant(f.store().validateAndRefresh({tokenHash,operationId:'validate-revoked-create'}));
});

test('staff creation is guarded against disable, version change and role change after authentication',async()=>{
  for(const patch of [{active:false},{version:2},{role:'editor'}]){
    const f=fixture({session:null}),provider=beforeCommit(f,()=>f.change(staffId,patch));
    await assert.rejects(f.store(provider).create(newRequest()));
    assert.equal(f.read(),null);assert.equal(f.h.state.batches,2);
  }
});

test('persisted owner epoch rotation fences validation and creation by an older owner configuration',async()=>{
  const f=fixture({session:'owner'}),provider=beforeCommit(f,()=>f.change(epochId,{fingerprint:rotatedFingerprint}));
  await noGrant(f.store(provider).validateAndRefresh({tokenHash,operationId:'owner-rotation-race'}));
  assert.equal(f.read().revision,1);
  await assert.rejects(f.store().create(newRequest({operationId:'owner-create-stale-config',tokenHash:otherToken,identity:{kind:'owner'}})));
  assert.equal(f.read(idFor('rivya_studio_sessions',otherToken)),null);
});

test('authorization denial happens before provider IO and wrong security layout is rejected',async()=>{
  const f=fixture(),store=f.store(f.h.provider,{authorize:()=>false});
  for(const work of [()=>store.create(newRequest()),()=>store.validateAndRefresh({tokenHash,operationId:'denied-read'}),()=>store.revoke({tokenHash,operationId:'denied-revoke'})])await assert.rejects(work());
  assert.equal(f.h.state.reads.length,0);assert.equal(f.h.state.batches,0);
  assert.throws(()=>f.store(f.h.provider,{layout:{...f.h.layout,key:'content'}}));
});

test('a postcommit deadline or exception remains unknown and cannot return a valid identity',async t=>{
  const f=fixture();let elapsed=0;const mocked=t.mock.method(performance,'now',()=>elapsed);
  try{
    const provider={...f.h.provider,async commit(prepared,options){const result=await f.h.provider.commit(prepared,options);elapsed=1001;return result;}};
    await assert.rejects(f.store(provider,{timeoutMs:1000}).validateAndRefresh({tokenHash,operationId:'deadline-after-write'}),{code:'outcome-unknown'});
    assert.equal(f.h.state.batches,2);assert.equal(f.read().revision,2);
  }finally{mocked.mock.restore();}
  const other=fixture(),provider={...other.h.provider,async commit(prepared,options){await other.h.provider.commit(prepared,options);throw Object.assign(Error('misleading'),{code:'conflict'});}};
  await assert.rejects(other.store(provider).validateAndRefresh({tokenHash,operationId:'exception-after-write'}),{code:'outcome-unknown'});
  assert.equal(other.h.state.batches,2);
});

test('caller mutation while creation is awaiting storage cannot change the frozen token or staff proof',async()=>{
  const f=fixture({session:null}),input=newRequest();let signalRead,release;
  const reached=new Promise(resolve=>{signalRead=resolve;}),gate=new Promise(resolve=>{release=resolve;});let blocked=false;
  const provider={...f.h.provider,async readManifest(options){if(!blocked){blocked=true;signalRead();await gate;}return f.h.provider.readManifest(options);}};
  const work=f.store(provider).create(input);await reached;
  input.tokenHash=otherToken;input.identity.credentialVersion=99;input.identity.role='editor';input.operationId='changed-input';release();
  assert.equal((await work).status,'committed');assert.notEqual(f.read(),null);assert.equal(f.read().payload.credential_version,'1');
  assert.equal(f.read(idFor('rivya_studio_sessions',otherToken)),null);auditBoundedState(f.h.layout,f.h.snapshot());
});

test('a provider replay response is receipt-only and never supplies an authentication identity',async()=>{
  const f=fixture();let commits=0;
  const provider={...f.h.provider,async commit(){commits++;return {status:'replay'};}};
  const result=await f.store(provider).validateAndRefresh({tokenHash,operationId:'replay-protocol-response'});
  assert.equal(result.status,'replay');assert.equal(result.receiptOnly,true);assert.equal(Object.hasOwn(result,'identity'),false);
  assert.equal(commits,1);assert.equal(f.h.state.batches,0);assert.equal(f.read().revision,1);
});

test('session, relation reads and conflict retry consume one monotonic deadline',async t=>{
  let elapsed=0;const mocked=t.mock.method(performance,'now',()=>elapsed);
  try{
    const readCase=fixture();let commits=0,reads=0;
    const slowReads={...readCase.h.provider,async readManifest(options){reads++;const result=await readCase.h.provider.readManifest(options);elapsed+=60;return result;},async commit(){commits++;return {status:'committed'};}};
    await assert.rejects(readCase.store(slowReads,{timeoutMs:100}).validateAndRefresh({tokenHash,operationId:'shared-read-deadline'}),{code:'unavailable'});
    assert.equal(reads,2);assert.equal(commits,0);assert.equal(readCase.h.state.batches,0);
    elapsed=0;const retryCase=fixture();let attempted=false,retryCommits=0;
    const slowRetry={...retryCase.h.provider,async readManifest(options){const result=await retryCase.h.provider.readManifest(options);if(attempted)elapsed+=60;return result;},async commit(){retryCommits++;attempted=true;elapsed+=60;return {status:'conflict'};}};
    await assert.rejects(retryCase.store(slowRetry,{timeoutMs:100}).validateAndRefresh({tokenHash,operationId:'shared-retry-deadline'}),{code:'unavailable'});
    assert.equal(retryCommits,1);assert.equal(retryCase.h.state.batches,0);
  }finally{mocked.mock.restore();}
});

test('absolute expiry caps refresh even when the new idle proposal would extend beyond it',async()=>{
  const f=fixture({sessionPayload:{expires_at:'2026-10-28T12:10:00.000Z',idle_expires_at:'2026-10-28T12:10:00.000Z'}});
  const oldAbsolute=Date.parse(f.read().payload.expires_at);f.h.state.now=oldAbsolute-1000;
  const provider=beforeCommit(f,prepared=>{assert.equal(prepared.commitBefore,oldAbsolute);f.h.state.now=oldAbsolute;});
  await noGrant(f.store(provider).validateAndRefresh({tokenHash,operationId:'old-absolute-expiry'}));
  assert.equal(f.h.state.batches,0);assert.equal(f.read().revision,1);
});

test('independent creations of one token identity have only one durable winner',async()=>{
  const f=fixture({session:null});let arrivals=0,release;const barrier=new Promise(resolve=>{release=resolve;});
  const provider=()=>({...f.h.provider,async commit(prepared,options){if(++arrivals===2)release();await barrier;return f.h.provider.commit(prepared,options);}});
  const results=await Promise.allSettled(['first','second'].map(operationId=>f.store(provider()).create(newRequest({operationId}))));
  assert.equal(results.filter(value=>value.status==='fulfilled').length,1);
  assert.equal(f.read().revision,1);assert.equal(f.h.state.batches,2);
  assert.equal(auditBoundedState(f.h.layout,f.h.snapshot()).history,3);
});
