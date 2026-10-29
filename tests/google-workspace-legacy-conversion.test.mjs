import assert from 'node:assert/strict';
import test from 'node:test';
import {createControlledWriter} from '../src/lib/google-workspace/controlled-writer.ts';
import {BOUNDED_PROTOCOL,prepareBoundedCommit,requiredBoundedPageIds,auditBoundedState} from '../src/lib/google-workspace/bounded-store.ts';
import {createBoundedJobStore} from '../src/lib/google-workspace/bounded-job-store.ts';
import {createJob,transitionJob} from '../src/lib/google-workspace/durable-jobs.ts';
import {convertLegacyWriter} from '../tools/google-workspace/convert-legacy-writer.mjs';
import {createTestWriterProvider} from './helpers/google-workspace-writer-provider.mjs';
import {boundedGatewayHarness} from './helpers/google-workspace-bounded-harness.mjs';

const resource={key:'content',workbookId:'legacy_fixture_workbook',recordSheetId:1,ledgerSheetId:2,auditSheetId:3,historySheetId:4};
const layout={protocol:BOUNDED_PROTOCOL,key:'content',workbookId:'bounded_fixture_workbook',rootSheetId:11,metadataSheetId:12,dataSheetId:13,maxPages:8192,maxMetadataChunks:64};
const policy={authorize:()=>true,validate:()=>true};
async function fixture(){
  const provider=createTestWriterProvider(resource);
  let now='2026-10-29T00:00:00.000Z';
  const writer=createControlledWriter({resources:[resource],policies:{content:policy}},{...provider,now:()=>now});
  const commands=[
    {recordId:'existing-a',expectedRevision:0,mutationId:'mutation-a1',payload:{title:'=Original Gujarati text',price:'100.00'},sourceUpdatedAt:'2026-10-01T00:00:00Z',archivedAt:null},
    {recordId:'existing-b',expectedRevision:0,mutationId:'mutation-b1',payload:{title:'Other original',relationship:'existing-a'},sourceUpdatedAt:null,archivedAt:null},
    {recordId:'existing-a',expectedRevision:1,mutationId:'mutation-a2',payload:{title:'Reviewed original',price:'100.00'},sourceUpdatedAt:'2026-10-01T00:00:00Z',archivedAt:'2026-10-29T00:00:02Z'},
  ];
  const receipts=[];
  for(const [i,command] of commands.entries()){
    now=new Date(Date.parse('2026-10-29T00:00:00Z')+i*1000).toISOString();
    receipts.push((await writer.mutate({resourceKey:resource.key,actor:{id:i===1?'other-editor':'original-editor'},command})).receipt);
  }
  return {provider,commands,receipts};
}
test('v1 conversion preserves existing identities, archived payloads, actors, receipts and every historical revision',async()=>{
  const f=await fixture(),snapshot=f.provider.snapshot(),before=JSON.stringify(snapshot),calls={...f.provider.calls};
  const result=convertLegacyWriter({resource,snapshot,layout,epoch:'fixture-conversion'});
  assert.equal(result.report.records,2);assert.equal(result.report.mutations,3);
  assert.equal(result.report.historyCoverage.history,3);assert.equal(result.report.targetInstalled,false);
  assert.equal(result.report.providerVerified,false);assert.equal(result.report.targetWrites,0);
  assert.equal(result.report.originalGenericReceiptsPreserved,true);
  assert.equal(result.report.genericReplayOperationId,'legacy-mutation-id');
  assert.equal(result.report.domainOperationBindingsPreserved,false);assert.equal(result.report.domainAdapterReplayVerified,false);
  assert.equal(JSON.stringify(snapshot),before);assert.deepEqual(f.provider.calls,calls);
  for(const [i,command] of f.commands.entries()){
    const required=requiredBoundedPageIds(result.state.manifest,[command]);
    const replay=await prepareBoundedCommit({layout,state:{...result.state,pages:result.state.pages.filter(p=>required.includes(p.id))},
      commands:[command],actor:{id:i===1?'other-editor':'original-editor'},operationId:command.mutationId,
      now:'2026-12-01T00:00:00.000Z',policy});
    assert.equal(replay.kind,'replay');assert.deepEqual(replay.receipts,[f.receipts[i]]);
  }
});

test('converted legacy job replay fails closed at the new domain-operation binding and returns current state without another write',async()=>{
  const provider=createTestWriterProvider(resource),actor={id:'legacy-job-worker'},at=Date.parse('2026-10-28T12:00:00.000Z');
  const writer=createControlledWriter({resources:[resource],policies:{content:policy}},{...provider,now:()=>new Date(at).toISOString()});
  const queued=createJob({id:'legacy:job',type:'fixture-report',inputId:'fixture:input',inputRevision:1,
    inputSha256:'a'.repeat(64),maxAttempts:3,now:at});
  const enqueue={recordId:queued.id,expectedRevision:0,mutationId:'legacy:enqueue',payload:queued,sourceUpdatedAt:null,archivedAt:null};
  const original=(await writer.mutate({resourceKey:resource.key,actor,command:enqueue})).receipt;
  const claimed=transitionJob(queued,{type:'claim',owner:actor.id,leaseMs:1000},at);
  await writer.mutate({resourceKey:resource.key,actor,command:{...enqueue,expectedRevision:1,mutationId:'legacy:claim',payload:claimed}});
  const converted=convertLegacyWriter({resource,snapshot:provider.snapshot(),layout,epoch:'legacy-job-conversion'});
  const h=boundedGatewayHarness(converted.state,layout),before=JSON.stringify(h.snapshot());
  const jobs=createBoundedJobStore({layout,actor,clock:()=>h.state.now,authorize:()=>true},h.provider);
  const result=await jobs.compareAndSet({id:queued.id,expectedRevision:0,job:queued,mutationId:enqueue.mutationId,
    action:null,transitionAt:at},new AbortController().signal);
  // The old generic receipt remains present, but its transaction is keyed by
  // mutationId. Never fabricate a full-domain binding or call this a replay.
  assert.equal(original.revision,1);assert.equal(result.applied,false);assert.equal(result.snapshot.revision,2);
  assert.deepEqual(result.snapshot.job,claimed);assert.notEqual(result.snapshot.revision,original.revision);
  assert.equal(h.state.batches,0);assert.equal(JSON.stringify(h.snapshot()),before);
  assert.equal(auditBoundedState(layout,h.snapshot()).history,2);
  assert.equal(converted.report.domainOperationBindingsPreserved,false);
});
test('empty registered v1 state converts to an empty v2 plan without inventing records',()=>{
  const result=convertLegacyWriter({resource,snapshot:createTestWriterProvider(resource).snapshot(),layout,epoch:'fixture-empty'});
  assert.equal(result.state.root.state,'ready');assert.equal(result.report.records,0);assert.equal(result.report.mutations,0);
  assert.equal(result.report.historyCoverage.pages,0);
});
test('formulas, missing history, incompatible boundaries and unhandled relationship sheets reject',async()=>{
  const f=await fixture(),base=f.provider.snapshot();
  const changed=structuredClone(base);changed.sheets[0].rows[1][2]={userEnteredValue:{formulaValue:'=1'},effectiveValue:{numberValue:1}};
  assert.throws(()=>convertLegacyWriter({resource,snapshot:changed,layout,epoch:'fixture'}),{code:'invalid-or-over-budget-source'});
  const missing=structuredClone(base);missing.sheets.find(s=>s.sheetId===4).rows.pop();
  assert.throws(()=>convertLegacyWriter({resource,snapshot:missing,layout,epoch:'fixture'}),{code:'invalid-or-over-budget-source'});
  assert.throws(()=>convertLegacyWriter({resource,snapshot:base,layout:{...layout,key:'security'},epoch:'fixture'}),{code:'boundary-mismatch'});
  assert.throws(()=>convertLegacyWriter({resource:{...resource,relationshipSheetIds:[5]},snapshot:base,layout,epoch:'fixture'}),{code:'relationship-layout-unsupported'});
});
test('unsupported ledger reordering and insufficient allocation fail without mutating source',async()=>{
  const f=await fixture(),snapshot=f.provider.snapshot(),ledger=snapshot.sheets.find(s=>s.sheetId===2).rows;
  [ledger[1],ledger[3]]=[ledger[3],ledger[1]];
  assert.throws(()=>convertLegacyWriter({resource,snapshot,layout,epoch:'fixture'}),{code:'predecessor-order'});
  const original=f.provider.snapshot(),before=JSON.stringify(original);
  assert.throws(()=>convertLegacyWriter({resource,snapshot:original,layout:{...layout,maxPages:1},epoch:'fixture'}),{code:'invalid-or-over-budget-source'});
  assert.equal(JSON.stringify(original),before);
});
