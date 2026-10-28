import test from 'node:test';
import assert from 'node:assert/strict';
import {planRecordMutation} from '../src/lib/google-workspace/record-codec.ts';
import {buildBoundedState,auditBoundedState,measureBoundedState,createBoundedStore} from '../src/lib/google-workspace/bounded-store.ts';
import {boundedGatewayHarness,boundedFixtureLayout as layout} from './helpers/google-workspace-bounded-harness.mjs';
const now='2026-10-28T12:00:00.000Z',actor={id:'local-test-owner'},policy={authorize:()=>true,validate:()=>true};
const command=(recordId,mutationId,payload,expectedRevision=0)=>({recordId,mutationId,payload,expectedRevision,sourceUpdatedAt:null,archivedAt:null});
const plan=c=>planRecordMutation({current:null,previousMutation:null,command:c,actor,now,authorize:()=>true});
const store=h=>createBoundedStore({layout:h.layout,policy,now:()=>now},h.provider);

test('bounded source fixture retains complete large records and history with finite responses',()=>{
  const plans=Array.from({length:80},(_,i)=>plan(command('record_'+i,'initial_'+i,{text:'x'.repeat(30000)}))),state=buildBoundedState({layout,epoch:'fixture',plans});
  const audit=auditBoundedState(layout,state),measure=measureBoundedState(layout,state);
  assert.equal(audit.records,80);assert.equal(audit.history,80);assert.ok(measure.pageCount>40);assert.ok(measure.maximumPageCharacters<=131072);assert.ok(measure.maximumSignedResponseBytes<6000000);assert.equal(measure.providerVerified,false);
});

test('actual v2 Apps Script source serves bounded pages and atomically commits a multi-record group',async()=>{
  const h=boundedGatewayHarness(),s=store(h),commands=[command('one','create_one',{name:'One'}),command('two','create_two',{name:'Two'})];
  const result=await s.mutate({commands,actor,operationId:'create_both'});assert.equal(result.status,'committed');assert.equal(result.receipts.length,2);assert.equal(h.state.batches,2);
  const after=h.snapshot();assert.deepEqual(auditBoundedState(layout,after),{records:2,ledger:2,audit:2,history:2,pages:4,transactions:1,providerVerified:false});
  h.restart();const reloaded=await store(h).load('one',actor);assert.equal(reloaded.payload.name,'One');
  const replay=await store(h).mutate({commands,actor,operationId:'create_both'});assert.equal(replay.status,'replay');assert.equal(h.state.batches,2);
  assert.ok(h.state.reads.filter(r=>r.sheetId===layout.dataSheetId).every(r=>r.rows===8&&r.columns===7));
});

test('lost final response reconciles original receipts after restart without another batch',async()=>{
  const h=boundedGatewayHarness();h.state.fault=n=>n===2?'lost':null;const input={commands:[command('one','create_one',{value:1})],actor,operationId:'create'};
  assert.equal((await store(h).mutate(input)).status,'unknown');h.state.fault=null;h.restart();assert.equal((await store(h).mutate(input)).status,'replay');assert.equal(h.state.batches,2);
});

test('an uncertain inflight batch blocks reads and unrelated writes across restart',async()=>{
  const h=boundedGatewayHarness();h.state.fault=n=>n===2?'pending':null;assert.equal((await store(h).mutate({commands:[command('one','create_one',{value:1})],actor,operationId:'create'})).status,'unknown');h.state.fault=null;h.restart();
  await assert.rejects(h.provider.readManifest());assert.equal(h.state.batches,2);
  h.apply(h.state.pending);h.state.pending=null;assert.equal((await store(h).load('one',actor)).payload.value,1);assert.equal(h.state.batches,2);
});

test('policy callbacks cannot alter the caller intent or the validated current record',async()=>{
  const h=boundedGatewayHarness(),input={commands:[command('one','create_one',{value:1})],actor,operationId:'create'};
  const mutatingPolicy={authorize(context){context.actor.id='accidentally-replaced';for(const c of context.commands)c.payload={value:999};for(const record of context.records.values())record.payload={value:999};return true;},validate(context){for(const c of context.commands)c.payload={value:777};return true;}};
  const s=createBoundedStore({layout,policy:mutatingPolicy,now:()=>now},h.provider);
  assert.equal((await s.mutate(input)).status,'committed');assert.equal(input.commands[0].payload.value,1);assert.equal(input.actor.id,actor.id);
  assert.equal((await s.load('one',actor)).payload.value,1);assert.equal(auditBoundedState(layout,h.snapshot()).records,1);
});
