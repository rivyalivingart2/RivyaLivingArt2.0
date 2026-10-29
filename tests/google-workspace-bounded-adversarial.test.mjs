import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import test from 'node:test';
import {canonicalArtifactJson, planRecordMutation} from '../src/lib/google-workspace/record-codec.ts';
import {
  BOUNDED_PROTOCOL, BOUNDED_LIMITS, buildBoundedState, auditBoundedState,
  encodeBoundedMetadata, validateBoundedManifest, validateBoundedPage,
  requiredBoundedPageIds, readBoundedRecords, prepareBoundedCommit,
  createBoundedStore, createBoundedProvider, boundedResponseBytes,
} from '../src/lib/google-workspace/bounded-store.ts';
import {boundedGatewayHarness} from './helpers/google-workspace-bounded-harness.mjs';

// Local, synthetic protocol fixtures. No Google credentials or network access.
const layout={protocol:BOUNDED_PROTOCOL,key:'notes',workbookId:'local_bounded_adversarial',rootSheetId:1,metadataSheetId:2,dataSheetId:3,maxPages:1024,maxMetadataChunks:64};
const now='2026-10-28T12:00:00.000Z';
const actor={id:'local-editor'};
const policy={authorize:({actor:who})=>who.id===actor.id,validate:()=>true};
const copy=value=>structuredClone(value);
const hash=value=>createHash('sha256').update(canonicalArtifactJson(value)).digest('hex');
const errorCode=code=>error=>error?.code===code;
function command(recordId,revision,mutationId,payload={text:'literal =1+1 / કલા / कला'}) {
  return {recordId,expectedRevision:revision,mutationId,payload,sourceUpdatedAt:null,archivedAt:null};
}
function fixture({revisions=3,recordIds=['note:first'],customLayout=layout,payload}={}) {
  const plans=[],current=new Map();
  for(const recordId of recordIds)for(let revision=0;revision<revisions;revision++) {
    const c=command(recordId,revision,`mutation:${plans.length}`,payload??{text:`revision ${revision} / literal =1+1 / કલા / कला`});
    const p=planRecordMutation({current:current.get(recordId)??null,previousMutation:null,command:c,actor,now,authorize:()=>true});
    plans.push(p);current.set(recordId,p.record);
  }
  return {plans,state:buildBoundedState({layout:customLayout,epoch:'local-epoch',plans})};
}
function rehash(state,customLayout=layout) {
  state.root.manifestSha256=hash(state.manifest);
  state.root.metadataChunks=encodeBoundedMetadata(state.manifest,customLayout).length;
  return state;
}
function subset(state,commands,relationships=[]) {
  const ids=new Set(requiredBoundedPageIds(state.manifest,commands,relationships));
  return {...copy(state),pages:state.pages.filter(p=>ids.has(p.id)).map(copy)};
}
function fakeProvider(state,{pageTransform=x=>x,manifestTransform=x=>x}={}) {
  const calls={manifests:0,pages:[],commits:0};
  return {calls,
    async readManifest(){calls.manifests++;return manifestTransform(copy({root:state.root,manifest:state.manifest}));},
    async readPage(base,id){calls.pages.push(id);assert.equal(base.root.manifestSha256,state.root.manifestSha256);return pageTransform(copy(state.pages.find(p=>p.id===id)));},
    async readPages(base,ids){return Promise.all(ids.map(id=>this.readPage(base,id)));},
    async commit(){calls.commits++;throw Error('This read-only test provider does not commit');},
  };
}

test('a current record read stays bounded after 160 preserved revisions, including prototype-like IDs',async()=>{
  const {state}=fixture({revisions:160,recordIds:['constructor','toString']});
  assert.equal(auditBoundedState(layout,state).history,320);
  const provider=fakeProvider(state),store=createBoundedStore({layout,policy,now:()=>now},provider);
  const record=await store.load('constructor',actor);
  assert.equal(record.recordId,'constructor');assert.equal(record.revision,160);
  assert.ok(provider.calls.pages.length<=5);
  assert.ok(provider.calls.pages.length<state.pages.length/8);
  assert.equal(provider.calls.commits,0);
  assert.equal((await store.load('toString',actor)).recordId,'toString');
});

test('self-consistent hashes do not make duplicate IDs, slots, wrong page kinds or broken chains valid',()=>{
  const base=fixture({recordIds:['note:first','note:second']}).state;
  const corruptions=[
    m=>{m.records[1][0]=m.records[0][0];},
    m=>{m.records[1][1]=m.records[0][1];m.records[1][2]=m.records[0][2];},
    m=>{m.records[0][1]=m.mutations[0][3];m.records[0][2]=m.mutations[0][4];},
    m=>{m.mutations[1][0]=m.mutations[0][0];},
    m=>{m.mutations[2][2]=-1;},
    m=>{m.records[0][3]=0;},
    m=>{m.transactions[1][0]=m.transactions[0][0];},
  ];
  for(const corrupt of corruptions){const bad=copy(base);corrupt(bad.manifest);rehash(bad);assert.throws(()=>validateBoundedManifest(layout,bad.root,bad.manifest),errorCode('integrity'));}
});

test('coordinator state cannot be reset to ready or relabel a committed operation',()=>{
  const {state}=fixture();
  const reset=copy(state);Object.assign(reset.root,{state:'ready',operationId:null,requestSha256:null,actorId:null});
  assert.throws(()=>validateBoundedManifest(layout,reset.root,reset.manifest),errorCode('integrity'));
  const relabel=copy(state);relabel.root.operationId='unrelated-operation';
  assert.throws(()=>validateBoundedManifest(layout,relabel.root,relabel.manifest),errorCode('integrity'));
});

test('inflights, duplicate returned pages, modified payloads and partial proofs never become valid reads',()=>{
  const {state}=fixture();
  const uncertain=copy(state);uncertain.root.state='inflight';
  assert.throws(()=>readBoundedRecords(layout,uncertain,['note:first']),errorCode('outcome-unknown'));
  const duplicated=copy(state);duplicated.pages.push(copy(duplicated.pages[0]));
  assert.throws(()=>readBoundedRecords(layout,duplicated,['note:first']),errorCode('integrity'));
  const altered=copy(state);altered.pages[0].rows[0][2]='{"text":"changed outside the writer"}';
  assert.throws(()=>readBoundedRecords(layout,altered,['note:first']),errorCode('integrity'));
  const partial=copy(state);partial.pages=partial.pages.filter(p=>p.id!==partial.manifest.mutations.at(-1)[7]);
  assert.throws(()=>readBoundedRecords(layout,partial,['note:first']),errorCode('integrity'));
});

test('provider rejects a valid-looking page paired with a stale root or a different registered location',async()=>{
  const {state}=fixture();const page=copy(state.pages[0]);
  for(const response of [
    {root:{...state.root,revision:state.root.revision+1},pages:[page]},
    {root:{...state.root,epoch:'different-epoch'},pages:[page]},
    {root:state.root,pages:[{...page,id:state.pages[1].id}]},
  ]){
    const gateway={request:async()=>copy(response)},provider=createBoundedProvider(gateway,layout);
    await assert.rejects(provider.readPage({root:state.root,manifest:state.manifest},page.id),errorCode('conflict'));
  }
});

test('finite metadata and physical registrations fail closed without mutating the input state',async()=>{
  const small={...layout,maxMetadataChunks:1};
  assert.throws(()=>fixture({revisions:400,recordIds:['x'.repeat(200)],customLayout:small}),errorCode('capacity'));
  const constrained={...layout,maxPages:4};
  const {state}=fixture({revisions:1,recordIds:Array.from({length:8},(_,i)=>`note:${i}`),payload:{text:'x'.repeat(15000)},customLayout:constrained});
  const before=canonicalArtifactJson(state),c=command('note:0',1,'grow-current-page',{text:'x'.repeat(44000)});
  await assert.rejects(prepareBoundedCommit({layout:constrained,state:subset(state,[c]),commands:[c],actor,operationId:'grow-page',now,policy}),errorCode('capacity'));
  assert.equal(canonicalArtifactJson(state),before);
});

test('growing one current record splits its page while retaining other records and every historical row',async()=>{
  const {state}=fixture({revisions:1,recordIds:Array.from({length:8},(_,i)=>`note:${i}`),payload:{text:'x'.repeat(15000)}});
  const before=canonicalArtifactJson(state),c=command('note:0',1,'grow-current-page',{text:'x'.repeat(44000)});
  const result=await prepareBoundedCommit({layout,state:subset(state,[c]),commands:[c],actor,operationId:'grow-page',now,policy});
  assert.equal(result.kind,'commit');
  const pages=new Map(state.pages.map(p=>[p.id,copy(p)]));result.prepared.pages.forEach(p=>pages.set(p.id,copy(p)));
  const next={root:result.prepared.next,manifest:result.prepared.manifest,pages:[...pages.values()]};
  assert.equal(auditBoundedState(layout,next).history,9);
  for(let i=1;i<8;i++)assert.deepEqual(readBoundedRecords(layout,next,[`note:${i}`]).get(`note:${i}`),readBoundedRecords(layout,state,[`note:${i}`]).get(`note:${i}`));
  for(const p of state.pages.filter(p=>state.manifest.pages[p.id][0]!=='r'))assert.deepEqual(next.pages.find(n=>n.id===p.id).rows.slice(0,p.rows.length),p.rows);
  assert.equal(canonicalArtifactJson(state),before);
});

test('page character limit and literal-cell schema remain independent of a matching digest',()=>{
  const {state}=fixture();const manifest=copy(state.manifest),page=copy(state.pages.find(p=>manifest.pages[p.id][0]==='l'));
  page.rows[0]=Array.from({length:6},()=> 'x'.repeat(30000));manifest.pages[page.id][2]=hash(page.rows);
  assert.throws(()=>validateBoundedPage(manifest,page),errorCode('capacity'));
  const unknown=copy(state.pages[0]);unknown.complete=true;
  assert.throws(()=>validateBoundedPage(state.manifest,unknown),errorCode('integrity'));
  const typed=copy(state.pages[0]);typed.rows[0][1]=3;
  assert.throws(()=>validateBoundedPage(state.manifest,typed),errorCode('integrity'));
});

test('bounded replay uses the original actor, command and whole operation membership',async()=>{
  const {state,plans}=fixture();const last=plans.at(-1),c=command(last.record.recordId,last.record.revision-1,last.record.lastMutationId,last.record.payload);
  const prepared=await prepareBoundedCommit({layout,state:subset(state,[c]),commands:[c],actor,operationId:last.ledger.mutationId,now:'2026-10-28T12:10:00.000Z',policy});
  assert.equal(prepared.kind,'replay');assert.deepEqual(prepared.receipts,[last.receipt]);
  const forged={...c,payload:{text:'replacement content'}};
  await assert.rejects(prepareBoundedCommit({layout,state:subset(state,[forged]),commands:[forged],actor,operationId:last.ledger.mutationId,now,policy}),errorCode('IDEMPOTENCY_CONFLICT'));
  await assert.rejects(prepareBoundedCommit({layout,state:subset(state,[c]),commands:[c],actor:{id:'another-editor'},operationId:last.ledger.mutationId,now,policy:{authorize:()=>true,validate:()=>true}}),errorCode('IDEMPOTENCY_CONFLICT'));
  await assert.rejects(prepareBoundedCommit({layout,state:subset(state,[c]),commands:[c],actor,operationId:'new-operation-reusing-old-mutation',now,policy}),errorCode('conflict'));
});

test('working set and group membership budgets reject an oversized transaction before any write',async()=>{
  const {state}=fixture(),commands=Array.from({length:BOUNDED_LIMITS.members+1},(_,i)=>command(`new:${i}`,0,`new-mutation:${i}`));
  const provider=fakeProvider(state),store=createBoundedStore({layout,policy,now:()=>now},provider);
  await assert.rejects(store.mutate({commands,actor,operationId:'oversized-group'}),errorCode('capacity'));
  assert.equal(provider.calls.commits,0);assert.equal(provider.calls.pages.length,0);
});

test('maximum transport identifiers and UTF-8 are included in the reported signed-response byte count',()=>{
  const text='"\\\nગુજરાતી 😀'.repeat(1000),result={text};
  const actual=JSON.stringify({message:canonicalArtifactJson({version:1,keyId:'k'.repeat(64),requestId:'n'.repeat(100),action:'read',ok:true,result}),signature:'a'.repeat(64)});
  assert.equal(boundedResponseBytes('read',result),Buffer.byteLength(actual));
  assert.ok(boundedResponseBytes('read',result)>actual.length);
});

test('exact Apps Script emulator reads only bounded ranges for a record with retained historical pages',async()=>{
  const {state}=fixture({revisions:80,recordIds:['note:first','note:second'],payload:{text:'x'.repeat(12000)}});
  const h=boundedGatewayHarness(state,layout),store=createBoundedStore({layout,policy,now:()=>now},h.provider);
  assert.equal((await store.load('note:first',actor)).revision,80);
  const dataReads=h.state.reads.filter(r=>r.sheetId===layout.dataSheetId);
  assert.ok(dataReads.length<=5);assert.ok(dataReads.every(r=>r.rows===8&&r.columns===7));
  assert.ok(new Set(dataReads.map(r=>r.startRow)).size<state.manifest.pages.length/8);
  assert.equal(h.state.batches,0);
});

test('exact script rejects a modified unchanged proof dependency before any inflight write',async()=>{
  const {state}=fixture({revisions:16,recordIds:['note:first','note:second']});
  const c=command('note:first',16,'after-validation',{text:'authorized update'});
  const prepared=await prepareBoundedCommit({layout,state:subset(state,[c]),commands:[c],actor,operationId:'proof-race',now,policy});
  assert.equal(prepared.kind,'commit');
  const proof=state.manifest.mutations[state.manifest.records[0][3]],pageId=proof[3],rowIndex=proof[4];
  assert.ok(!prepared.prepared.pages.some(p=>p.id===pageId),'test must modify an unchanged validation dependency');
  const h=boundedGatewayHarness(state,layout);
  h.state.sheets.get(layout.dataSheetId)[pageId*8+rowIndex][0]=h.literal('edited-after-validation');
  await assert.rejects(h.gateway.request('commit',prepared.prepared),errorCode('outcome-unknown'));
  assert.equal(h.state.batches,0);
});

test('a signed plan cannot omit the mandatory unchanged current-record proof guard',async()=>{
  const {state}=fixture({revisions:16,recordIds:['note:first','note:second']}),c=command('note:first',16,'guard-omission-update');
  const result=await prepareBoundedCommit({layout,state:subset(state,[c]),commands:[c],actor,operationId:'guard-omission-operation',now,policy});
  const proofPage=state.manifest.mutations[state.manifest.records[0][3]][3],bad=copy(result.prepared);
  assert.ok(!bad.pages.some(p=>p.id===proofPage));assert.ok(bad.readPageIds.includes(proofPage));
  bad.readPageIds=bad.readPageIds.filter(id=>id!==proofPage);
  const h=boundedGatewayHarness(state,layout);
  await assert.rejects(h.gateway.request('commit',bad),errorCode('outcome-unknown'));assert.equal(h.state.batches,0);
});

test('validly hashed metadata cannot relabel or forget previous mutation and operation identities',async()=>{
  const {state}=fixture({revisions:5}),c=command('note:first',5,'new-mutation',{text:'new saved text'});
  const result=await prepareBoundedCommit({layout,state:subset(state,[c]),commands:[c],actor,operationId:'new-operation',now,policy});
  for(const modify of [m=>{m.mutations[0][0]='replacement-old-mutation';},m=>{m.transactions[0][0]='replacement-old-operation';}]){
    const bad=copy(result.prepared);modify(bad.manifest);bad.next.manifestSha256=hash(bad.manifest);bad.next.metadataChunks=encodeBoundedMetadata(bad.manifest,layout).length;
    assert.doesNotThrow(()=>validateBoundedManifest(layout,bad.next,bad.manifest));
    const h=boundedGatewayHarness(state,layout);
    await assert.rejects(h.gateway.request('commit',bad),errorCode('outcome-unknown'));assert.equal(h.state.batches,0);
  }
});

test('signed commit cannot overwrite an old history row while appending a valid new revision',async()=>{
  const {state}=fixture({revisions:24}),c=command('note:first',24,'new-mutation',{text:'new saved text'});
  const result=await prepareBoundedCommit({layout,state:subset(state,[c]),commands:[c],actor,operationId:'new-operation',now,policy});
  const bad=copy(result.prepared),old=copy(state.pages.find(p=>state.manifest.pages[p.id][0]==='h'&&!bad.pages.some(changed=>changed.id===p.id)));
  old.rows[0][2]='{"text":"rewritten old history"}';bad.pages.push(old);bad.manifest.pages[old.id][2]=hash(old.rows);
  bad.next.manifestSha256=hash(bad.manifest);bad.next.metadataChunks=encodeBoundedMetadata(bad.manifest,layout).length;
  const h=boundedGatewayHarness(state,layout);
  await assert.rejects(h.gateway.request('commit',bad),errorCode('outcome-unknown'));assert.equal(h.state.batches,0);
});

test('cooperating commits from the same root conflict instead of losing a record update',async()=>{
  const {state}=fixture({revisions:1,recordIds:['note:first','note:second']}),h=boundedGatewayHarness(state,layout);
  const first=command('note:first',1,'first-update',{text:'first update'}),second=command('note:second',1,'second-update',{text:'second update'});
  const prepare=(c,operationId)=>prepareBoundedCommit({layout,state:subset(state,[c]),commands:[c],actor,operationId,now,policy});
  const [a,b]=await Promise.all([prepare(first,'first-operation'),prepare(second,'second-operation')]);
  assert.equal((await h.provider.commit(a.prepared)).status,'committed');
  assert.equal((await h.provider.commit(b.prepared)).status,'conflict');assert.equal(h.state.batches,2);
  const after=h.snapshot(),records=readBoundedRecords(layout,after,['note:first','note:second']);
  assert.equal(records.get('note:first').revision,2);assert.equal(records.get('note:second').revision,1);assert.equal(auditBoundedState(layout,after).history,3);
});

test('lost final response replays the whole atomic group after script restart with no duplicate writes',async()=>{
  const h=boundedGatewayHarness(undefined,layout),store=createBoundedStore({layout,policy,now:()=>now},h.provider);
  const input={actor,operationId:'atomic-group',commands:[command('note:first',0,'create-first'),command('note:second',0,'create-second')]};
  h.state.fault=n=>n===2?'lost':null;
  assert.equal((await store.mutate(input)).status,'unknown');assert.equal(h.state.batches,2);
  h.restart();h.state.fault=null;
  const fresh=createBoundedStore({layout,policy,now:()=>now},h.provider),result=await fresh.mutate(input);
  assert.equal(result.status,'replay');assert.equal(result.receipts.length,2);assert.equal(h.state.batches,2);
  assert.deepEqual(auditBoundedState(layout,h.snapshot()),{records:2,ledger:2,audit:2,history:2,pages:4,transactions:1,providerVerified:false});
});

test('uncertain inflight state survives restart and fences unrelated work until the late atomic result appears',async()=>{
  const h=boundedGatewayHarness(undefined,layout),store=createBoundedStore({layout,policy,now:()=>now},h.provider);
  const input={actor,operationId:'uncertain-operation',commands:[command('note:first',0,'uncertain-mutation')]};
  h.state.fault=n=>n===2?'pending':null;
  assert.equal((await store.mutate(input)).status,'unknown');h.restart();
  await assert.rejects(store.mutate({actor,operationId:'unrelated-operation',commands:[command('note:second',0,'unrelated-mutation')]}),errorCode('outcome-unknown'));
  assert.equal(h.state.batches,2);
  h.apply(h.state.pending);h.state.fault=null;h.restart();
  assert.equal((await store.mutate(input)).status,'replay');assert.equal(h.state.batches,2);
  assert.equal(auditBoundedState(layout,h.snapshot()).history,1);
});

test('literal strings do not authorize formula cells and stale page cursors fail after a different commit',async()=>{
  const {state}=fixture({revisions:1}),h=boundedGatewayHarness(state,layout),base=await h.provider.readManifest();
  const pageId=state.manifest.records[0][1],rowIndex=state.manifest.records[0][2];
  const saved=copy(h.state.sheets.get(layout.dataSheetId)[pageId*8+rowIndex][2]);
  h.state.sheets.get(layout.dataSheetId)[pageId*8+rowIndex][2]={userEnteredValue:{formulaValue:'="injected"'},effectiveValue:{stringValue:'injected'}};
  await assert.rejects(h.provider.readPage(base,pageId),errorCode('unavailable'));assert.equal(h.state.batches,0);
  h.state.sheets.get(layout.dataSheetId)[pageId*8+rowIndex][2]=saved;
  const store=createBoundedStore({layout,policy,now:()=>now},h.provider);
  assert.equal((await store.mutate({actor,operationId:'next-operation',commands:[command('note:first',1,'next-mutation')]})).status,'committed');
  await assert.rejects(h.provider.readPage(base,pageId),errorCode('unavailable'));
});

test('batched page reads reject duplicate, missing and unexpected pages and validate the requested set before dispatch',async()=>{
  const {state}=fixture(),base={root:state.root,manifest:state.manifest},ids=[state.pages[0].id,state.pages[1].id];
  for(const returned of [[state.pages[0],state.pages[0]],[state.pages[0]],[state.pages[0],state.pages[2]]]){
    const provider=createBoundedProvider({request:async()=>copy({root:state.root,pages:returned})},layout);
    await assert.rejects(provider.readPages(base,ids),errorCode('conflict'));
  }
  let calls=0;const provider=createBoundedProvider({request:async()=>{calls++;throw Error('must not dispatch');}},layout);
  for(const invalid of [[0,0],[-1],[state.pages.length],[0,1,2,3,4]])await assert.rejects(provider.readPages(base,invalid),errorCode('configuration'));
  assert.equal(calls,0);
});

test('an operation deadline covers stalled authorization and stops a late pre-write read from continuing',async()=>{
  const {state}=fixture(),input={actor,operationId:'deadline-operation',commands:[command('note:first',3,'deadline-mutation')]};
  const stalled=fakeProvider(state),authorizationStore=createBoundedStore({layout,policy:{authorize:()=>new Promise(()=>{}),validate:()=>true},now:()=>now,timeoutMs:5},stalled);
  await assert.rejects(authorizationStore.mutate(input),errorCode('unavailable'));assert.equal(stalled.calls.manifests,0);
  let release;const delayed=fakeProvider(state);delayed.readManifest=()=>new Promise(resolve=>{release=resolve;});
  const readStore=createBoundedStore({layout,policy,now:()=>now,timeoutMs:5},delayed);
  await assert.rejects(readStore.mutate(input),errorCode('unavailable'));
  release(copy({root:state.root,manifest:state.manifest}));await new Promise(resolve=>setImmediate(resolve));
  assert.equal(delayed.calls.pages.length,0);assert.equal(delayed.calls.commits,0);
});

test('a deadline after dispatch is unknown and never retries a late commit response',async()=>{
  const {state}=fixture(),provider=fakeProvider(state);let release;
  provider.commit=()=>{provider.calls.commits++;return new Promise(resolve=>{release=resolve;});};
  const store=createBoundedStore({layout,policy,now:()=>now,timeoutMs:100},provider);
  await assert.rejects(store.mutate({actor,operationId:'slow-commit-operation',commands:[command('note:first',3,'slow-commit-mutation')]}),errorCode('outcome-unknown'));
  assert.equal(provider.calls.commits,1);release({status:'committed'});await new Promise(resolve=>setImmediate(resolve));
  assert.equal(provider.calls.commits,1);
});

test('elapsed synchronous validation time cannot dispatch a write before the timer callback runs',async()=>{
  const {state}=fixture(),provider=fakeProvider(state);
  provider.commit=async()=>{provider.calls.commits++;return {status:'committed'};};
  const slowPolicy={...policy,validate:()=>{const deadline=Date.now()+20;while(Date.now()<deadline){/* Simulate bounded synchronous validation work. */}return true;}};
  const store=createBoundedStore({layout,policy:slowPolicy,now:()=>now,timeoutMs:5},provider);
  await assert.rejects(store.mutate({actor,operationId:'elapsed-before-dispatch',commands:[command('note:first',3,'elapsed-mutation')]}),errorCode('unavailable'));
  assert.equal(provider.calls.commits,0);
});

test('server lease expiry after the inflight marker prevents the canonical batch and retains quarantine',async()=>{
  const h=boundedGatewayHarness(undefined,layout),store=createBoundedStore({layout,policy,now:()=>now},h.provider);
  const commitBefore=h.state.now+1000;
  h.state.fault=n=>{if(n===1)h.state.now+=2000;};
  assert.equal((await store.mutate({actor,operationId:'expired-server-lease',commands:[command('note:first',0,'expired-server-mutation')],commitBefore})).status,'unknown');
  assert.equal(h.state.batches,1);assert.equal(h.snapshot().manifest.records.length,0);
  h.restart();await assert.rejects(h.provider.readManifest(),errorCode('outcome-unknown'));
});
