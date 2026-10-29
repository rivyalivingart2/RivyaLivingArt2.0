/** Synthetic source-schema fixtures through the exact saved Apps Script
 * emulator. No real accounts, sessions, provider calls or acceptance claims. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createBoundedSessionStore} from '../src/lib/google-workspace/bounded-session-store.ts';
import {buildBoundedState,readBoundedRecords,auditBoundedState,createBoundedStore} from '../src/lib/google-workspace/bounded-store.ts';
import {planRecordMutation} from '../src/lib/google-workspace/record-codec.ts';
import {prepareRecord,stableRecordId} from '../tools/google-workspace/migration.mjs';
import {boundedFixtureLayout,boundedGatewayHarness} from './helpers/google-workspace-bounded-harness.mjs';

const schema=JSON.parse(readFileSync(new URL('../src/lib/google-workspace/schema.json',import.meta.url),'utf8'));
const staffTable=schema.tables.find(t=>t.sourceTable==='rivya_staff'),sessionTable=schema.tables.find(t=>t.sourceTable==='rivya_studio_sessions');
const uuid='00000000-0000-4000-8000-000000000001',at='2026-10-28T12:00:00.000Z',created='2026-10-28T11:00:00.000Z';
const tokenHash='a'.repeat(64),fingerprint='b'.repeat(64),actor={id:'service:synthetic-session-store'},epochId='synthetic-owner-epoch';
const sourceSessionId=stableRecordId(sessionTable,{token_hash:tokenHash});
const code=value=>error=>error.code===value;
function fixture({staff={},staffMetadata={},session=null,sessionMetadata={},withEpoch=true}={}){
  const s={id:uuid,login:'fixture.curator',name:'Fixture curator',password_hash:'1'.repeat(32)+':'+ '2'.repeat(128),role:'editor',active:true,version:1,created_at:created,...staff};
  const records=[{...prepareRecord(staffTable,s).record,...staffMetadata}];
  if(session)records.push({...prepareRecord(sessionTable,session).record,...sessionMetadata});
  if(withEpoch)records.push({recordId:epochId,payload:{format:'rivya-owner-credential-epoch-v1',fingerprint},sourceUpdatedAt:null,archivedAt:null,lastMutationId:'synthetic-epoch'});
  const plans=records.map(record=>planRecordMutation({current:null,previousMutation:null,command:{recordId:record.recordId,expectedRevision:0,mutationId:record.lastMutationId,payload:record.payload,sourceUpdatedAt:record.sourceUpdatedAt,archivedAt:record.archivedAt},actor,now:at,authorize:()=>true}));
  const layout={...boundedFixtureLayout,key:'security'},h=boundedGatewayHarness(buildBoundedState({layout,epoch:'synthetic-session-fixture',plans}),layout);
  const config={layout:h.layout,actor,clock:()=>h.state.now,authorize:()=>true,owner:{login:'fixture.owner',fingerprint,epochRecordId:epochId}};
  const store=(provider=h.provider,extra={})=>createBoundedSessionStore({...config,...extra},provider);
  const create=(extra={})=>({operationId:'synthetic-create',tokenHash,identity:{kind:'staff',staffId:uuid,credentialVersion:1,login:s.login,role:s.role},createdAt:h.state.now,...extra});
  const input=(extra={})=>({operationId:'synthetic-validate',tokenHash,...extra});
  const read=(id=sourceSessionId)=>readBoundedRecords(h.layout,h.snapshot(),[id]).get(id)??null;
  const update=async(id,change,mutationId='synthetic-change')=>{
    const current=read(id);return createBoundedStore({layout:h.layout,now:()=>new Date(h.state.now).toISOString(),policy:{authorize:()=>true,validate:()=>true}},h.provider).mutate({actor,operationId:mutationId,commands:[{recordId:id,expectedRevision:current.revision,mutationId,payload:{...current.payload,...change},sourceUpdatedAt:current.sourceUpdatedAt,archivedAt:current.archivedAt}]});
  };
  return {h,config,store,create,input,read,update};
}
const migratedSession=(extra={})=>({token_hash:tokenHash,credential_version:'1',expires_at:'2026-10-28T20:00:00.000Z',idle_expires_at:'2026-10-28T12:30:00.000Z',staff_id:uuid,...extra});

test('create preserves the exact five-column source schema and source-derived token identity',async()=>{
  const f=fixture(),input=f.create(),result=await f.store().create(input);
  assert.deepEqual(result,{status:'committed',receiptOnly:true,sessionRevision:1});
  const record=f.read();assert.equal(record.recordId,sourceSessionId);assert.equal(record.sourceUpdatedAt,null);assert.equal(record.archivedAt,null);
  assert.deepEqual(record.payload,migratedSession());assert.equal(Object.hasOwn(record.payload,'created_at'),false);
  assert.equal(f.h.state.batches,2);assert.equal(auditBoundedState(f.h.layout,f.h.snapshot()).history,3);
  assert.equal((await f.store().create(input)).status,'replay');assert.equal(f.h.state.batches,2);
  f.h.restart();const fresh=await f.store().validateAndRefresh(f.input());assert.equal(fresh.status,'valid');assert.equal(fresh.identity.adminId,'fixture.curator');
});
test('migrated sessions refresh after restart and repeated caller IDs always require a fresh guarded mutation',async()=>{
  const f=fixture({session:migratedSession()});f.h.restart();
  for(let i=0;i<2;i++){const result=await f.store().validateAndRefresh(f.input());assert.equal(result.status,'valid');assert.equal(result.sessionRevision,2+i);}
  const record=f.read();assert.equal(record.sourceUpdatedAt,null);assert.equal(record.payload.expires_at,'2026-10-28T20:00:00.000Z');assert.equal(f.h.state.batches,4);
  assert.ok(f.h.state.reads.filter(r=>r.sheetId===f.h.layout.dataSheetId).every(r=>r.rows===8&&r.columns===7));
});
test('idle refresh is capped by eight-hour absolute expiry and exact idle/absolute boundaries deny',async()=>{
  const f=fixture({session:migratedSession({expires_at:'2026-10-28T12:10:00.000Z',idle_expires_at:'2026-10-28T12:05:00.000Z'})});
  const result=await f.store().validateAndRefresh(f.input());assert.equal(result.status,'valid');assert.equal(f.read().payload.idle_expires_at,f.read().payload.expires_at);
  f.h.state.now=Date.parse(f.read().payload.expires_at);const before=f.h.state.batches;assert.deepEqual(await f.store().validateAndRefresh(f.input()),{status:'invalid'});assert.equal(f.h.state.batches,before);
  const idle=fixture({session:migratedSession()});idle.h.state.now=Date.parse('2026-10-28T12:30:00Z');assert.deepEqual(await idle.store().validateAndRefresh(idle.input()),{status:'invalid'});assert.equal(idle.h.state.batches,0);
});
test('owner creation and validation require an explicitly existing matching credential epoch',async()=>{
  const f=fixture(),request=f.create({identity:{kind:'owner'}});
  assert.equal((await f.store().create(request)).status,'committed');assert.equal(f.read().payload.staff_id,null);assert.equal(f.read().payload.credential_version,fingerprint);
  assert.deepEqual((await f.store().validateAndRefresh(f.input())).identity,{adminId:'fixture.owner',role:'admin',staffId:null});
  await f.update(epochId,{fingerprint:'c'.repeat(64)});assert.deepEqual(await f.store().validateAndRefresh(f.input()),{status:'invalid'});
  const missing=fixture({withEpoch:false});await assert.rejects(missing.store().create(missing.create({identity:{kind:'owner'}})),code('invalid-identity'));assert.equal(missing.h.state.batches,0);
});
test('create rechecks authenticated staff version, login and role and never accepts inactive staff',async()=>{
  for(const identity of [{credentialVersion:2},{login:'changed.login'},{role:'admin'}]){
    const f=fixture(),input=f.create();await assert.rejects(f.store().create({...input,identity:{...input.identity,...identity}}),code('invalid-identity'));assert.equal(f.h.state.batches,0);
  }
  for(const staff of [{active:false},{login:'fixture.owner'}]){
    const f=fixture({staff});await assert.rejects(f.store().create(f.create()),code('invalid-identity'));assert.equal(f.h.state.batches,0);
  }
});
test('revocation archives canonical history without dropping payload or permitting token resurrection',async()=>{
  const f=fixture(),input=f.create();await f.store().create(input);const original=f.read().payload;
  assert.deepEqual(await f.store().revoke(f.input()),{status:'revoked',receiptOnly:true,sessionRevision:2});
  assert.deepEqual(f.read().payload,original);assert.equal(f.read().archivedAt,at);assert.equal(f.read().sourceUpdatedAt,null);
  assert.deepEqual(await f.store().revoke(f.input()),{status:'missing',receiptOnly:true});
  assert.deepEqual(await f.store().validateAndRefresh(f.input()),{status:'invalid'});
  await assert.rejects(f.store().create(input),code('invalid-identity'));
  await assert.rejects(f.store().create({...input,operationId:'new-create'}),code('conflict'));
  assert.equal(f.read().revision,2);assert.equal(auditBoundedState(f.h.layout,f.h.snapshot()).history,4);
});
test('lost creation acknowledgement denies issuance and cold retry provides only the original receipt',async()=>{
  const f=fixture(),input=f.create(),provider={...f.h.provider,async commit(plan,options){await f.h.provider.commit(plan,options);throw Error('synthetic lost acknowledgement');}};
  await assert.rejects(f.store(provider).create(input),code('outcome-unknown'));assert.equal(f.h.state.batches,2);
  f.h.restart();assert.deepEqual(await f.store().create(input),{status:'replay',receiptOnly:true,sessionRevision:1});assert.equal(f.h.state.batches,2);
  const fresh=fixture({session:migratedSession()}),replayProvider={...fresh.h.provider,async commit(){return {status:'replay'};}};
  assert.equal((await fresh.store(replayProvider).validateAndRefresh(fresh.input())).status,'replay');assert.equal(fresh.read().revision,1);
});
test('external policy is mandatory before reads and denies at guarded intent without writes',async()=>{
  const f=fixture();assert.throws(()=>f.store(f.h.provider,{authorize:undefined}),code('configuration'));
  for(const name of ['create','validateAndRefresh','revoke'])await assert.rejects(f.store(f.h.provider,{authorize:()=>false})[name](name==='create'?f.create():f.input()),code('unauthorized'));
  assert.equal(f.h.state.reads.length,0);
  const phases=[];await assert.rejects(f.store(f.h.provider,{authorize:c=>{phases.push(c.phase);return c.phase==='preflight';}}).create(f.create()),code('unauthorized'));
  assert.deepEqual(phases,['preflight','guarded']);assert.equal(f.h.state.batches,0);
});
test('wrong boundary, source metadata, extra session fields and invalid caller input fail closed',async()=>{
  const f=fixture();assert.throws(()=>f.store(f.h.provider,{layout:{...f.h.layout,key:'content'}}),code('configuration'));
  for(const extra of [{tokenHash:'invalid'},{operationId:'bad id'},{createdAt:f.h.state.now+1}])await assert.rejects(f.store().create(f.create(extra)),code('invalid-input'));
  for(const metadata of [{sourceUpdatedAt:at},{archivedAt:at}]){
    const bad=fixture({staffMetadata:metadata});await assert.rejects(bad.store().create(bad.create()),code('unavailable'));assert.equal(bad.h.state.batches,0);
  }
  const bad=fixture({session:migratedSession(),sessionMetadata:{sourceUpdatedAt:at}});await assert.rejects(bad.store().validateAndRefresh(bad.input()),code('unavailable'));
  const extra=fixture({session:migratedSession()});await extra.update(sourceSessionId,{created_at:at});await assert.rejects(extra.store().validateAndRefresh(extra.input()),code('unavailable'));
});
test('bounded explicit conflict retries never convert unknown outcomes into authentication',async()=>{
  const f=fixture({session:migratedSession()});let commits=0;
  const conflicts={...f.h.provider,async commit(){commits++;return {status:'conflict'};}};
  await assert.rejects(f.store(conflicts).validateAndRefresh(f.input()),code('conflict'));assert.equal(commits,4);assert.equal(f.h.state.batches,0);
  commits=0;const unknown={...f.h.provider,async commit(){commits++;return {status:'unknown'};}};
  await assert.rejects(f.store(unknown).validateAndRefresh(f.input()),code('outcome-unknown'));assert.equal(commits,1);
});
test('one monotonic budget rejects stalled policies and late successful writes without granting auth',async t=>{
  const f=fixture();await assert.rejects(f.store(f.h.provider,{timeoutMs:10,authorize:()=>new Promise(()=>{})}).create(f.create()),code('unavailable'));assert.equal(f.h.state.batches,0);
  let elapsed=0;const monotonic=t.mock.method(performance,'now',()=>elapsed);
  try{
    const late=fixture({session:migratedSession()}),provider={...late.h.provider,async commit(plan,options){const result=await late.h.provider.commit(plan,options);elapsed=1001;return result;}};
    await assert.rejects(late.store(provider,{timeoutMs:1000}).validateAndRefresh(late.input()),code('outcome-unknown'));assert.equal(late.h.state.batches,2);
    elapsed=0;const expired=fixture();await assert.rejects(expired.store().create(expired.create(),{deadline:0}),code('unavailable'));assert.equal(expired.h.state.reads.length,0);
  }finally{monotonic.mock.restore();}
});


test('caller input is captured synchronously before policy awaits and mutable permission views cannot alter it',async()=>{
  const f=fixture(),input=f.create();let release;
  const gate=new Promise(resolve=>{release=resolve;});
  const store=f.store(f.h.provider,{authorize:async context=>{if(context.phase==='preflight'){context.tokenHash='f'.repeat(64);await gate;}return true;}});
  const pending=store.create(input);input.tokenHash='e'.repeat(64);input.identity.role='admin';release();
  assert.equal((await pending).status,'committed');assert.equal(f.read().payload.token_hash,tokenHash);
});
