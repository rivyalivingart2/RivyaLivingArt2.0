/** Synthetic fixtures through exact local Apps Script emulator only. These are
 * not actual access requests, Google acceptance, account changes or login proof. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {createBoundedAccessRedemptionStore} from '../src/lib/google-workspace/bounded-access-redemption.ts';
import {buildBoundedState,readBoundedRecords,auditBoundedState,createBoundedStore} from '../src/lib/google-workspace/bounded-store.ts';
import {canonicalArtifactJson,planRecordMutation} from '../src/lib/google-workspace/record-codec.ts';
import {prepareRecord,stableRecordId} from '../tools/google-workspace/migration.mjs';
import {boundedFixtureLayout,boundedGatewayHarness} from './helpers/google-workspace-bounded-harness.mjs';

const schema=JSON.parse(readFileSync(new URL('../src/lib/google-workspace/schema.json',import.meta.url),'utf8'));
const staffTable=schema.tables.find(t=>t.sourceTable==='rivya_staff'),requestTable=schema.tables.find(t=>t.sourceTable==='rivya_access_requests');
const staffId='00000000-0000-4000-8000-000000000001',requestId='00000000-0000-4000-8000-000000000002',otherId='00000000-0000-4000-8000-000000000003';
const at='2026-10-28T12:00:00.000Z',created='2026-10-28T11:00:00.000Z',expires='2026-10-28T12:30:00.000Z';
const passwordHash='a'.repeat(32)+':'+ 'b'.repeat(128),nextPasswordHash='c'.repeat(32)+':'+ 'd'.repeat(128),tokenHash='e'.repeat(64),actor={id:'service:synthetic-access-redemption'};
const code=value=>error=>error.code===value,signal=()=>new AbortController().signal;
function fixture({request={},staff={},metadata={}}={}){
  const s={id:staffId,login:'synthetic.curator',name:'Synthetic curator',password_hash:passwordHash,role:'editor',active:false,version:1,created_at:created,...staff};
  const r={id:requestId,kind:'access',login:'synthetic.curator',name:'Synthetic curator',contact:'fixture@example.invalid',status:'approved',staff_id:staffId,token_hash:tokenHash,credential_version:1,expires_at:expires,created_at:created,updated_at:created,decided_by:'synthetic-owner',version:2,...request};
  const records=[prepareRecord(staffTable,s).record,prepareRecord(requestTable,r).record].map(record=>({...record,...metadata}));
  const plans=records.map(record=>planRecordMutation({current:null,previousMutation:null,command:{recordId:record.recordId,expectedRevision:0,mutationId:record.lastMutationId,payload:record.payload,sourceUpdatedAt:record.sourceUpdatedAt,archivedAt:record.archivedAt},actor,now:at,authorize:()=>true}));
  const layout={...boundedFixtureLayout,key:'security'};
  const h=boundedGatewayHarness(buildBoundedState({layout,epoch:'synthetic-access-epoch',plans}),layout);
  const registration={kind:'rivya-security-redemption-v1',boundary:'security',layoutSha256:createHash('sha256').update(canonicalArtifactJson(h.layout)).digest('hex'),requestId,staffId};
  const config={layout:h.layout,registration,actor,ownerLogin:'synthetic-owner',clock:()=>h.state.now,authorize:()=>true};
  const store=(provider=h.provider,extra={})=>createBoundedAccessRedemptionStore({...config,...extra},provider);
  const input=(extra={})=>({operationId:'synthetic-operation',staff:records[0],request:records[1],tokenHash,passwordHash:nextPasswordHash,transitionAt:h.state.now,...extra});
  const values=()=>{const state=h.snapshot(),ids=records.map(r=>r.recordId),map=readBoundedRecords(h.layout,state,ids);return {staff:map.get(ids[0]),request:map.get(ids[1])};};
  return {h,records,registration,config,store,input,values};
}

test('registered source identities redeem staff plus request atomically with real source metadata and completed status',async()=>{
  const f=fixture(),loaded=await f.store().load(signal());assert.deepEqual(loaded,{staff:f.records[0],request:f.records[1]});
  const result=await f.store().redeem(f.input(),signal());assert.deepEqual(result,{status:'committed',staffRevision:2,requestRevision:2,receiptOnly:true});
  const actual=f.values();assert.equal(actual.staff.recordId,stableRecordId(staffTable,{id:staffId}));assert.equal(actual.request.recordId,stableRecordId(requestTable,{id:requestId}));
  assert.equal(actual.staff.payload.password_hash,nextPasswordHash);assert.equal(actual.staff.payload.active,true);assert.equal(actual.staff.payload.version,2);assert.equal(actual.staff.sourceUpdatedAt,created);assert.equal(Object.hasOwn(actual.staff.payload,'updated_at'),false);
  assert.equal(actual.request.payload.status,'completed');assert.equal(actual.request.payload.token_hash,null);assert.equal(actual.request.payload.expires_at,null);assert.equal(actual.request.payload.version,3);assert.equal(actual.request.sourceUpdatedAt,at);
  assert.equal(f.h.state.batches,2);const audit=auditBoundedState(f.h.layout,f.h.snapshot());assert.equal(audit.records,2);assert.equal(audit.history,4);
});
test('two independent redemptions race at the script CAS and exactly one transaction succeeds',async()=>{
  const f=fixture();let arrivals=0,release;const barrier=new Promise(resolve=>{release=resolve;});
  const provider=()=>({...f.h.provider,async commit(plan,options){if(++arrivals===2)release();await barrier;return f.h.provider.commit(plan,options);}});
  const results=await Promise.allSettled(['one','two'].map(operationId=>f.store(provider()).redeem(f.input({operationId}),signal())));
  assert.equal(results.filter(x=>x.status==='fulfilled').length,1);assert.equal(results.find(x=>x.status==='rejected').reason.code,'conflict');assert.equal(f.h.state.batches,2);assert.equal(f.values().staff.payload.version,2);assert.equal(f.values().request.payload.version,3);
});
test('same-intent restart replays original priors after later history and expiry without authenticating again',async()=>{
  const f=fixture(),input=f.input();await f.store().redeem(input,signal());
  const current=f.values().staff,writer=createBoundedStore({layout:f.h.layout,now:()=>at,policy:{authorize:()=>true,validate:()=>true}},f.h.provider);
  await writer.mutate({actor,operationId:'synthetic-later-disable',commands:[{recordId:current.recordId,expectedRevision:current.revision,mutationId:'synthetic-later-disable',payload:{...current.payload,active:false,version:3},sourceUpdatedAt:current.sourceUpdatedAt,archivedAt:null}]});
  f.h.restart();f.h.state.now=Date.parse(expires)+1;const before=f.h.state.batches,result=await f.store().redeem(input,signal());
  assert.equal(result.status,'replay');assert.equal(result.receiptOnly,true);assert.equal(f.values().staff.payload.active,false);assert.equal(f.h.state.batches,before);
  for(const change of [{operationId:'other-attempt'},{passwordHash:'1'.repeat(32)+':'+ '2'.repeat(128)},{transitionAt:input.transitionAt+1}])await assert.rejects(f.store().redeem({...input,...change},signal()),code('conflict'));
});
test('expiry at preparation or inside the provider lock prevents both writes',async()=>{
  const f=fixture();f.h.state.now=Date.parse(expires);await assert.rejects(f.store().redeem(f.input({transitionAt:Date.parse(at)}),signal()),code('expired'));assert.equal(f.h.state.batches,0);
  const locked=fixture(),provider={...locked.h.provider,async commit(plan,options){locked.h.state.now=plan.commitBefore;return locked.h.provider.commit(plan,options);}};
  await assert.rejects(locked.store(provider).redeem(locked.input(),signal()),code('expired'));assert.equal(locked.h.state.batches,0);assert.equal(locked.values().request.payload.status,'approved');
});
test('unknown post-dispatch outcomes deny success and same-intent recovery never creates a second update',async()=>{
  const f=fixture(),input=f.input(),provider={...f.h.provider,async commit(plan,options){await f.h.provider.commit(plan,options);throw Error('synthetic lost acknowledgement');}};
  await assert.rejects(f.store(provider).redeem(input,signal()),code('outcome-unknown'));assert.equal(f.h.state.batches,2);f.h.restart();
  assert.equal((await f.store().redeem(input,signal())).status,'replay');assert.equal(f.h.state.batches,2);
  const pending=fixture();pending.h.state.fault=batch=>batch===2?'pending':null;await assert.rejects(pending.store().redeem(pending.input(),signal()),code('outcome-unknown'));
  pending.h.restart();await assert.rejects(pending.store().load(signal()),code('outcome-unknown'));assert.equal(pending.h.state.batches,2);
});
test('mandatory authorization denies reads before IO and rechecks immutable guarded intent',async()=>{
  const f=fixture();assert.throws(()=>f.store(f.h.provider,{authorize:undefined}),code('configuration'));
  const denied=f.store(f.h.provider,{authorize:()=>false});await assert.rejects(denied.load(signal()),code('unauthorized'));await assert.rejects(denied.redeem(f.input(),signal()),code('unauthorized'));assert.equal(f.h.state.reads.length,0);
  const phases=[];const guarded=f.store(f.h.provider,{authorize:context=>{phases.push(context.phase);return context.phase==='preflight';}});await assert.rejects(guarded.redeem(f.input(),signal()),code('unauthorized'));assert.deepEqual(phases,['preflight','guarded']);assert.equal(f.h.state.batches,0);
});
test('source schema, archived/sourceUpdatedAt metadata, hash bounds, identity pair, active state and owner exclusions fail closed',async()=>{
  const f=fixture();for(const registration of [{...f.registration,boundary:'content'},{...f.registration,layoutSha256:'0'.repeat(64)},{...f.registration,staffId:'invalid'},{...f.registration,extra:true}])assert.throws(()=>f.store(f.h.provider,{registration}),code('configuration'));
  const wrongLayout={...f.h.layout,key:'content'},wrongHash=createHash('sha256').update(canonicalArtifactJson(wrongLayout)).digest('hex');assert.throws(()=>f.store(f.h.provider,{layout:wrongLayout,registration:{...f.registration,layoutSha256:wrongHash}}),code('configuration'));
  for(const change of [{tokenHash:'wrong'},{passwordHash:'short'},{passwordHash:nextPasswordHash+':extra'},{transitionAt:f.h.state.now+1},{operationId:'bad op'}])await assert.rejects(f.store().redeem(f.input(change),signal()),code('invalid-input'));
  for(const side of ['staff','request'])for(const metadata of [{archivedAt:at},{sourceUpdatedAt:null},{sourceUpdatedAt:at}]){
    const record=f.input()[side];if(metadata.sourceUpdatedAt===record.sourceUpdatedAt)continue;
    await assert.rejects(f.store().redeem(f.input({[side]:{...record,...metadata}}),signal()),code('invalid-input'));
  }
  for(const overrides of [{request:{staff_id:otherId}},{request:{credential_version:2}},{request:{login:'other.login'}},{request:{kind:'recovery'}},{staff:{active:true}},{staff:{login:'synthetic-owner'},request:{login:'synthetic-owner'}}]){const bad=fixture(overrides);await assert.rejects(bad.store().redeem(bad.input(),signal()),code('invalid-input'));assert.equal(bad.h.state.batches,0);}
  const recovery=fixture({request:{kind:'recovery'},staff:{active:true}});assert.equal((await recovery.store().redeem(recovery.input(),signal())).status,'committed');assert.equal(f.h.state.batches,0);
});
test('last representable SQL credential/request versions stay readable and never overflow',async()=>{
  const f=fixture({staff:{version:2147483646},request:{version:2147483646,credential_version:2147483646}});
  assert.equal((await f.store().redeem(f.input(),signal())).status,'committed');const read=await f.store().load(signal());assert.equal(read.staff.payload.version,2147483647);assert.equal(read.request.payload.version,2147483647);
  const max=fixture({staff:{version:2147483647},request:{credential_version:2147483647}});await assert.rejects(max.store().redeem(max.input(),signal()),code('invalid-input'));assert.equal(max.h.state.batches,0);
});
test('historical mutation proof tampering rejects replay and all reads stay bounded',async()=>{
  const f=fixture(),input=f.input();await f.store().redeem(input,signal());
  assert.ok(f.h.state.reads.filter(r=>r.sheetId===f.h.layout.dataSheetId).every(r=>r.rows===8&&r.columns===7));
  const mutation=f.h.snapshot().manifest.mutations[0],[page,row]=mutation.slice(7,9);f.h.state.sheets.get(f.h.layout.dataSheetId)[page*8+row][2]=f.h.literal('changed');
  await assert.rejects(f.store().redeem(input,signal()),code('unavailable'));assert.equal(f.h.state.batches,2);
});
test('stalled authorization and synchronous or postcommit deadline expiry never grant redemption',async t=>{
  const f=fixture();await assert.rejects(f.store(f.h.provider,{timeoutMs:10,authorize:async()=>new Promise(()=>{})}).redeem(f.input(),signal()),code('unavailable'));assert.equal(f.h.state.batches,0);
  let elapsed=0;const monotonic=t.mock.method(performance,'now',()=>elapsed);
  try{
    const denied=fixture();await assert.rejects(denied.store(denied.h.provider,{timeoutMs:1000,authorize:()=>{elapsed=1001;return true;}}).redeem(denied.input(),signal()),code('unavailable'));assert.equal(denied.h.state.batches,0);
    elapsed=0;const late=fixture(),provider={...late.h.provider,async commit(plan,options){const result=await late.h.provider.commit(plan,options);elapsed=1001;return result;}};
    await assert.rejects(late.store(provider,{timeoutMs:1000}).redeem(late.input(),signal()),code('outcome-unknown'));assert.equal(late.h.state.batches,2);
  }finally{monotonic.mock.restore();}
});
