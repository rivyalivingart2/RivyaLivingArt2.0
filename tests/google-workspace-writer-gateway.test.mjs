import assert from 'node:assert/strict';
import test from 'node:test';
import {createHash} from 'node:crypto';
import {createWriterGateway,createAppsScriptWriterProvider} from '../src/lib/google-workspace/writer-gateway.ts';
import {createControlledWriter} from '../src/lib/google-workspace/controlled-writer.ts';
import {gatewayHarness} from './helpers/google-workspace-gateway-harness.mjs';

const command=(id='mutation-001',payload={title:'Local document'})=>({recordId:'document-001',expectedRevision:0,mutationId:id,payload,sourceUpdatedAt:null,archivedAt:null});
function setup(fetchOverride){
  const harness=gatewayHarness();
  const gateway=createWriterGateway({endpoint:harness.endpoint,keyId:'test',secret:harness.secret,timeoutMs:1000},{fetch:fetchOverride?.(harness)??harness.fetch,now:()=>harness.state.now});
  const provider=createAppsScriptWriterProvider(gateway);
  const writer=createControlledWriter({resources:[harness.resource],policies:{documents:{authorize:({actor})=>actor.id==='editor-local',validate:()=>true}}},{...provider,now:()=>new Date(harness.state.now).toISOString()});
  return {harness,gateway,provider,writer,write:cmd=>writer.mutate({resourceKey:'documents',actor:{id:'editor-local'},command:cmd})};
}

test('signed client -> actual Apps Script source -> atomic sheets emulator -> reread and cold restart',async()=>{
  const f=setup();const first=await f.write(command());assert.equal(first.status,'committed');
  assert.equal(f.harness.state.batches,2); // durable inflight gate + ONE canonical batch.
  assert.equal(f.harness.state.held,false);f.harness.restart();
  assert.equal((await f.write(command())).status,'replay');assert.equal(f.harness.state.batches,2);
  const next={...command('mutation-002',{title:'Updated local document'}),expectedRevision:1};
  assert.equal((await f.write(next)).receipt.revision,2);assert.equal(f.harness.state.sheets.get(1).length,2);
  assert.equal(f.harness.state.sheets.get(2).length,3);assert.equal(f.harness.state.sheets.get(3).length,3);assert.equal(f.harness.state.sheets.get(4).length,3);
});
test('lost committed batch response is recovered from the same durable mutation after restart',async()=>{
  const f=setup();f.harness.state.fault=n=>n===2?'lost':null;
  await assert.rejects(f.write(command()),{code:'outcome-unknown'});f.harness.restart();
  assert.equal((await f.write(command())).status,'replay');assert.equal(f.harness.state.batches,2);
});
test('uncertain pending batch quarantines unrelated writes until its late atomic outcome is visible',async()=>{
  const f=setup();f.harness.state.fault=n=>n===2?'pending':null;
  await assert.rejects(f.write(command()),{code:'outcome-unknown'});f.harness.restart();
  await assert.rejects(f.write({...command('mutation-002'),recordId:'document-002'}),{code:'outcome-unknown'});
  assert.equal(f.harness.state.batches,2);f.harness.apply(f.harness.state.pending);f.harness.state.fault=null;
  assert.equal((await f.write(command())).status,'replay');assert.equal(f.harness.state.batches,2);
});
test('unknown inflight marker never dispatches a canonical batch',async()=>{
  const f=setup();f.harness.state.fault=n=>n===1?'lost':null;
  await assert.rejects(f.write(command()),{code:'outcome-unknown'});assert.equal(f.harness.state.batches,1);assert.equal(f.harness.state.sheets.get(1).length,1);
  await assert.rejects(f.write(command()),{code:'outcome-unknown'});assert.equal(f.harness.state.batches,1);
});
test('manual canonical edits and formulas block the signed writer',async()=>{
  const f=setup();await f.write(command());
  f.harness.state.sheets.get(1)[1][2]=f.harness.literal('{"title":"external change"}');
  await assert.rejects(f.write({...command('mutation-002'),expectedRevision:1}),{code:'integrity'});assert.equal(f.harness.state.batches,2);
  f.harness.state.sheets.get(1)[1][2]={userEnteredValue:{formulaValue:'=1+1'},effectiveValue:{numberValue:2}};
  await assert.rejects(f.gateway.request('read',{resourceKey:'documents'}),{code:'unavailable'});assert.equal(f.harness.state.batches,2);
});
test('unsigned or altered signed requests perform no reads or writes',()=>{
  const f=setup();const result=JSON.parse(f.harness.post(JSON.stringify({message:'{}',signature:'0'.repeat(64)})));
  assert.equal(result.error,'unauthorized');assert.equal(f.harness.state.locks,0);assert.equal(f.harness.state.batches,0);
});
test('gateway guards reject a grid changed between prepare and commit',async()=>{
  const f=setup();let prepared;
  const writer=createControlledWriter({resources:[f.harness.resource],policies:{documents:{authorize:()=>true,validate:()=>true}},limits:{maxConflicts:0}},{...f.provider,now:()=>new Date(f.harness.state.now).toISOString(),commitAtomic:async p=>{prepared=p;f.harness.state.sheets.get(4).push(Array.from({length:7},()=>f.harness.literal('changed')));return f.provider.commitAtomic(p,{signal:new AbortController().signal});}});
  await assert.rejects(writer.mutate({resourceKey:'documents',actor:{id:'editor-local'},command:command()}),{code:'conflict'});
  assert.ok(prepared);assert.equal(f.harness.state.batches,0);
});
test('gateway deadline rechecks expire a worker after server planning',async()=>{
  const f=setup();const writer=createControlledWriter({resources:[f.harness.resource],policies:{documents:{authorize:()=>true,validate:()=>true}},limits:{maxConflicts:0}},{...f.provider,now:()=>new Date(f.harness.state.now).toISOString(),commitAtomic:async p=>{f.harness.state.now+=1000;return f.provider.commitAtomic(p,{signal:new AbortController().signal});}});
  await assert.rejects(writer.mutate({resourceKey:'documents',actor:{id:'editor-local'},command:command(),commitBefore:f.harness.state.now+500}),{code:'conflict'});assert.equal(f.harness.state.batches,0);
});
test('HTTP errors and tampered replies never imply a failed write or trigger retries',async()=>{
  let count=0;const f=setup(()=>async()=>{count++;return new Response('provider secret',{status:503});});
  await assert.rejects(f.gateway.request('commit',{}),error=>error.code==='outcome-unknown'&&!error.message.includes('secret'));assert.equal(count,1);
  await assert.rejects(f.gateway.request('read',{}),{code:'invalid-response'});
});
test('only the documented ContentService GET redirect is followed without request body',async()=>{
  let count=0;const f=setup(h=>async(url,init)=>{
    if(++count===1){const actual=await h.fetch(url,init);const body=await actual.text();h.reply=body;return new Response(null,{status:302,headers:{Location:'https://script.googleusercontent.com/macros/echo?user_content_key=fixture'}});}
    assert.equal(init.method,'GET');assert.equal(init.body,undefined);return new Response(h.reply,{headers:{'Content-Type':'application/json'}});
  });
  assert.equal((await f.gateway.request('read',{resourceKey:'documents'})).sheets.length,4);assert.equal(count,2);
});
test('cross-host redirects, stale replies, cancellation and bounded timeout fail closed',async()=>{
  const f=setup(()=>async()=>new Response(null,{status:302,headers:{Location:'https://example.test/steal'}}));
  await assert.rejects(f.gateway.request('read',{}),{code:'invalid-response'});
  const controller=new AbortController();controller.abort();await assert.rejects(f.gateway.request('commit',{}, {signal:controller.signal}),{code:'aborted'});
  const g=createWriterGateway({endpoint:f.harness.endpoint,keyId:'test',secret:f.harness.secret,timeoutMs:10},{fetch:async()=>new Promise(()=>{})});
  await assert.rejects(g.request('commit',{}),{code:'outcome-unknown'});
});
test('literal formulas and unicode survive exact gateway cells',async()=>{
  const f=setup();const payload={label:'=IMPORTXML("https://invalid.test")',text:'કલા / कला',id:'000042'};
  await f.write(command('mutation-001',payload));const row=f.harness.state.sheets.get(1)[1];
  assert.deepEqual(JSON.parse(row[2].userEnteredValue.stringValue),payload);
  assert.equal(row[3].userEnteredValue.stringValue,createHash('sha256').update(row[2].userEnteredValue.stringValue).digest('hex'));
});

test('parallel non-product creates resolve row reservations without overwriting either record',async()=>{
  const f=setup();const outcomes=await Promise.all([f.write(command()),f.write({...command('mutation-002'),recordId:'document-002'})]);
  assert.deepEqual(outcomes.map(x=>x.status),['committed','committed']);
  assert.equal(f.harness.state.sheets.get(1).length,3);assert.equal(f.harness.state.sheets.get(2).length,3);
  assert.equal(new Set(f.harness.state.sheets.get(1).slice(1).map(row=>row[0].userEnteredValue.stringValue)).size,2);
});
test('a signed response from another request and an altered response body are both rejected',async()=>{
  let responseText;const f=setup(h=>async(url,init)=>{
    if(!responseText)responseText=await (await h.fetch(url,init)).text();
    return new Response(responseText,{headers:{'Content-Type':'application/json'}});
  });
  await f.gateway.request('read',{resourceKey:'documents'});
  await assert.rejects(f.gateway.request('read',{resourceKey:'documents'}),{code:'invalid-response'});
  const corrupt=setup(h=>async(url,init)=>{
    const outer=await (await h.fetch(url,init)).json();outer.message=outer.message.replace('documents','changed');
    // Force a body alteration even if the snapshot does not contain the resource key.
    outer.message=outer.message.replace('local_fixture_workbook','other_fixture_workbook');
    return new Response(JSON.stringify(outer),{headers:{'Content-Type':'application/json'}});
  });
  await assert.rejects(corrupt.gateway.request('read',{resourceKey:'documents'}),{code:'invalid-response'});
});

test('a concurrently committed same intent with another timestamp rereads the original receipt',async()=>{
  const f=setup();let captured;
  const provider={...f.provider,commitAtomic:async p=>{captured=structuredClone(p);return f.provider.commitAtomic(p,{signal:new AbortController().signal});}};
  const writer=createControlledWriter({resources:[f.harness.resource],policies:{documents:{authorize:()=>true,validate:()=>true}}},{...provider,now:()=>new Date(f.harness.state.now).toISOString()});
  await writer.mutate({resourceKey:'documents',actor:{id:'editor-local'},command:command()});
  const changed=structuredClone(captured),ledger=changed.batch.requests[1].updateCells.rows[0].values;
  const saved=JSON.parse(ledger[4].userEnteredValue.stringValue);saved.committedAt='2026-10-24T12:00:01.000Z';
  ledger[4].userEnteredValue.stringValue=JSON.stringify(saved);
  const result=await f.gateway.request('commit',changed);assert.equal(result.status,'conflict');
  assert.equal((await f.write(command())).status,'replay');assert.equal(f.harness.state.batches,2);
});
test('empty-string cells without an effective value match the Node normalization',async()=>{
  const f=setup();await f.write(command());
  for(const id of [1,4])for(const row of f.harness.state.sheets.get(id))for(const cell of row)if(cell.userEnteredValue.stringValue==='')delete cell.effectiveValue;
  assert.equal((await f.write({...command('mutation-002'),expectedRevision:1})).status,'committed');
});
test('double-escaped outer request is bounded before any network dispatch',async()=>{
  let calls=0;const f=setup(()=>async()=>{calls++;throw new Error('should not run');});
  await assert.rejects(f.gateway.request('commit',{text:'"'.repeat(500000)}),{code:'invalid-request'});assert.equal(calls,0);
});
