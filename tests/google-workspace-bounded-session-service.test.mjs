import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createBoundedSessionService,sessionOwnerFingerprint} from '../src/lib/google-workspace/bounded-session-service.ts';
import {GoogleWorkspaceSecurityAdapter} from '../src/lib/google-workspace/security-adapter.ts';
import {buildBoundedState,createBoundedStore,readBoundedRecords} from '../src/lib/google-workspace/bounded-store.ts';
import {planRecordMutation} from '../src/lib/google-workspace/record-codec.ts';
import {stableRecordId} from '../tools/google-workspace/migration.mjs';
import {boundedGatewayHarness,boundedFixtureLayout} from './helpers/google-workspace-bounded-harness.mjs';

// Synthetic local emulator only. No actual tokens, credentials or providers.
const owner={login:'fixture.owner',password:'fixture-password-only-123456',sessionSecret:'fixture-session-secret-only-1234567890',epochRecordId:'fixture-owner-epoch'};
const staffUuid='00000000-0000-4000-8000-000000000001',at='2026-10-28T12:00:00.000Z',created='2026-10-28T11:00:00.000Z';
const staff={id:staffUuid,login:'fixture.staff',name:'Fixture staff',password_hash:'a'.repeat(32)+':'+ 'b'.repeat(128),role:'editor',active:true,version:1,created_at:created};
const ownerIdentity={adminId:owner.login,staffId:null,role:'admin'},staffIdentity={adminId:staff.login,staffId:staffUuid,role:'editor',credentialVersion:1};
const hash=token=>createHash('sha256').update(token).digest('hex');
const sourceId=(sourceTable,primaryKey,key)=>stableRecordId({sourceTable,primaryKey:[primaryKey]},{[primaryKey]:key});
const staffRecordId=sourceId('rivya_staff','id',staffUuid),code=expected=>error=>error.code===expected;
function fixture({epoch=true,staffChanges={}}={}){
  const layout={...boundedFixtureLayout,key:'security'},actor={id:'fixture:session-service'};
  const records=[{recordId:staffRecordId,payload:{...staff,...staffChanges},sourceUpdatedAt:created}];
  if(epoch)records.push({recordId:owner.epochRecordId,payload:{format:'rivya-owner-credential-epoch-v1',fingerprint:sessionOwnerFingerprint(owner)},sourceUpdatedAt:null});
  const plans=records.map((r,i)=>planRecordMutation({current:null,previousMutation:null,actor,now:at,authorize:()=>true,
    command:{...r,expectedRevision:0,mutationId:'fixture-seed-'+i,archivedAt:null}}));
  const h=boundedGatewayHarness(buildBoundedState({layout,epoch:'local-service-fixture',plans}),layout);
  const config={layout,actor,clock:()=>h.state.now,authorize:()=>true,owner};
  const service=(provider=h.provider,extra={})=>createBoundedSessionService({...config,...extra},provider);
  const read=token=>readBoundedRecords(h.layout,h.snapshot(),[sourceId('rivya_studio_sessions','token_hash',hash(token))]).get(sourceId('rivya_studio_sessions','token_hash',hash(token)));
  const change=async(recordId,patch)=>{const current=readBoundedRecords(h.layout,h.snapshot(),[recordId]).get(recordId);
    return createBoundedStore({layout,now:()=>new Date(h.state.now).toISOString(),policy:{authorize:()=>true,validate:()=>true}},h.provider).mutate({actor,operationId:'fixture-change-'+h.state.batches,
      commands:[{recordId,expectedRevision:current.revision,mutationId:'fixture-change-'+h.state.batches,payload:{...current.payload,...patch},sourceUpdatedAt:current.sourceUpdatedAt,archivedAt:current.archivedAt}]});};
  return {h,config,service,read,change};
}

test('service issues crypto tokens only after canonical commit; IO stores only hashes and exact source fields',async()=>{
  const f=fixture(),lifecycle=f.service(),token=await lifecycle.createStudioSession({...ownerIdentity});
  assert.match(token,/^[A-Za-z0-9_-]{43}$/);const stored=f.read(token);
  assert.equal(stored.payload.token_hash,hash(token));assert.equal(stored.sourceUpdatedAt,null);
  assert.deepEqual(Object.keys(stored.payload).sort(),['credential_version','expires_at','idle_expires_at','staff_id','token_hash']);
  const providerData=JSON.stringify({sheets:[...f.h.state.sheets],requests:f.h.state.requests});
  for(const secret of [token,owner.password,owner.sessionSecret])assert.equal(providerData.includes(secret),false);
  assert.equal(stored.payload.expires_at,'2026-10-28T20:00:00.000Z');assert.equal(stored.payload.idle_expires_at,'2026-10-28T12:30:00.000Z');
});

test('existing adapter delegates create, sliding refresh and logout across cold service recreation without CRUD calls',async()=>{
  const f=fixture();let legacyCalls=0;
  const legacy=new Proxy({}, {get(){return async()=>{legacyCalls++;throw Error('Legacy session CRUD forbidden');};}});
  const options={adminId:owner.login,adminPassword:owner.password,sessionSecret:owner.sessionSecret};
  const adapter=()=>new GoogleWorkspaceSecurityAdapter(legacy,options,f.service());
  assert.equal(adapter().isConfigured(),true);
  const token=await adapter().createStudioSession({...staffIdentity});f.h.restart();f.h.state.now+=20*60*1000;
  assert.deepEqual(await adapter().studioSessionFromToken(token),staffIdentity);
  assert.equal(f.read(token).payload.idle_expires_at,'2026-10-28T12:50:00.000Z');
  assert.equal(f.read(token).payload.expires_at,'2026-10-28T20:00:00.000Z');
  await adapter().revokeStudioSession(token);assert.notEqual(f.read(token).archivedAt,null);
  assert.equal(await adapter().studioSessionFromToken(token),null);assert.equal(legacyCalls,0);
});

test('persistent adapter rejects missing atomic lifecycle instead of old split CRUD session writes',async()=>{
  let calls=0;const store=new Proxy({}, {get(){return async()=>{calls++;throw Error('No legacy IO');};}});
  const adapter=new GoogleWorkspaceSecurityAdapter(store,{adminId:owner.login,adminPassword:owner.password,sessionSecret:owner.sessionSecret});
  assert.equal(adapter.isConfigured(),false);
  await assert.rejects(adapter.createStudioSession(ownerIdentity),code('ATOMIC_SESSIONS_REQUIRED'));
  await assert.rejects(adapter.studioSessionFromToken('a'.repeat(43)),code('ATOMIC_SESSIONS_REQUIRED'));
  await assert.rejects(adapter.revokeStudioSession('a'.repeat(43)),code('ATOMIC_SESSIONS_REQUIRED'));assert.equal(calls,0);
});

test('owner epoch and adapter credential binding deny missing or rotated configuration',async()=>{
  const absent=fixture({epoch:false});await assert.rejects(absent.service().createStudioSession(ownerIdentity),code('SESSION_UNAVAILABLE'));assert.equal(absent.h.state.batches,0);
  const f=fixture(),token=await f.service().createStudioSession(ownerIdentity);
  const adapter=new GoogleWorkspaceSecurityAdapter({}, {adminId:owner.login,adminPassword:owner.password+'changed',sessionSecret:owner.sessionSecret},f.service());
  await assert.rejects(adapter.studioSessionFromToken(token),code('SESSION_BINDING_CHANGED'));
  await f.change(owner.epochRecordId,{fingerprint:'0'.repeat(64)});
  assert.equal(await f.service().studioSessionFromToken(token),null);
  await assert.rejects(f.service().createStudioSession(ownerIdentity),code('SESSION_UNAVAILABLE'));
});

test('staff credential changes and idle/absolute expiry deny further refresh',async()=>{
  const f=fixture(),token=await f.service().createStudioSession(staffIdentity);
  await f.change(staffRecordId,{version:2});assert.equal(await f.service().studioSessionFromToken(token),null);
  for(const elapsed of [30*60*1000,8*60*60*1000]){const g=fixture(),t=await g.service().createStudioSession(ownerIdentity);g.h.state.now+=elapsed;assert.equal(await g.service().studioSessionFromToken(t),null);}
});

test('invalid identities and malformed tokens cause no provider IO or implicit owner creation',async()=>{
  const f=fixture();for(const identity of [undefined,{...ownerIdentity,role:'editor'},{...ownerIdentity,adminId:'someone.else'}, {...staffIdentity,credentialVersion:undefined}, {...staffIdentity,extra:true}])await assert.rejects(f.service().createStudioSession(identity),code('SESSION_REAUTH_REQUIRED'));
  for(const token of [undefined,'', 'a'.repeat(42),'a'.repeat(44),'a'.repeat(42)+'!']){assert.equal(await f.service().studioSessionFromToken(token),null);await f.service().revokeStudioSession(token);}
  assert.equal(f.h.state.reads.length,0);assert.equal(f.h.state.batches,0);
});

test('unknown create and refresh acknowledgements never return a raw token or authenticated identity',async()=>{
  const f=fixture(),provider={...f.h.provider,async commit(prepared,options){await f.h.provider.commit(prepared,options);throw Error('sensitive provider response fixture');}};
  await assert.rejects(f.service(provider).createStudioSession(staffIdentity),error=>error.code==='SESSION_OUTCOME_UNKNOWN'&&!error.message.includes('sensitive'));
  assert.equal(f.h.state.batches,2);
  const g=fixture(),token=await g.service().createStudioSession(ownerIdentity),lost={...g.h.provider,async commit(p,o){await g.h.provider.commit(p,o);return {status:'unknown'};}};
  await assert.rejects(g.service(lost).studioSessionFromToken(token),code('SESSION_OUTCOME_UNKNOWN'));
  assert.equal(g.h.state.batches,4);
});

test('a provider replay response never becomes a newly issued token or authenticated identity',async()=>{
  const f=fixture(),replay={...f.h.provider,async commit(){return {status:'replay'};}};
  await assert.rejects(f.service(replay).createStudioSession(ownerIdentity),code('SESSION_REAUTH_REQUIRED'));assert.equal(f.h.state.batches,0);
  const token=await f.service().createStudioSession(ownerIdentity);
  assert.equal(await f.service(replay).studioSessionFromToken(token),null);
});

test('caller identity mutation cannot change an in-flight session subject',async()=>{
  const f=fixture(),identity={...staffIdentity};let entered,release;
  const ready=new Promise(r=>{entered=r;}),wait=new Promise(r=>{release=r;});let paused=false;
  const provider={...f.h.provider,async readManifest(options){if(!paused){paused=true;entered();await wait;}return f.h.provider.readManifest(options);}};
  const pending=f.service(provider).createStudioSession(identity);await ready;identity.staffId=null;identity.role='admin';identity.adminId=owner.login;release();
  const token=await pending;assert.equal(f.read(token).payload.staff_id,staffUuid);
});

test('postcommit service deadline preserves unknown outcome and configuration errors stay local',async t=>{
  const f=fixture();let elapsed=0;const mock=t.mock.method(performance,'now',()=>elapsed);
  try{const provider={...f.h.provider,async commit(p,o){const result=await f.h.provider.commit(p,o);elapsed=1001;return result;}};
    await assert.rejects(f.service(provider,{timeoutMs:1000}).createStudioSession(ownerIdentity),code('SESSION_OUTCOME_UNKNOWN'));assert.equal(f.h.state.batches,2);
  }finally{mock.mock.restore();}
  assert.throws(()=>f.service(f.h.provider,{owner:{...owner,sessionSecret:'short'}}),code('SESSION_CONFIGURATION'));
  assert.throws(()=>f.service(f.h.provider,{owner:{...owner,login:' fixture.owner '}}),code('SESSION_CONFIGURATION'));
});
