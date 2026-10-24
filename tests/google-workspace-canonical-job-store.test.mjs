import test from 'node:test';
import assert from 'node:assert/strict';
import {createCanonicalJobStore} from '../src/lib/google-workspace/canonical-job-store.ts';
import {createJob, transitionJob, createJobRunner, JobWorkError} from '../src/lib/google-workspace/durable-jobs.ts';
import {decodeRecord, RECORD_COLUMNS} from '../src/lib/google-workspace/record-codec.ts';
import {createTestWriterProvider, writerFixtureResource} from './helpers/google-workspace-writer-provider.mjs';

const resource = {...writerFixtureResource, key:'jobs', relationshipSheetIds:[]};
const sha='a'.repeat(64), signal=()=>new AbortController().signal, code=expected=>error=>error.code===expected;
const deferred=()=>{let resolve;const promise=new Promise(done=>{resolve=done;});return {promise,resolve};};
const newJob=overrides=>createJob({id:'job:isolated-report:1',type:'synthetic-report',inputId:'frozen:1',inputRevision:7,inputSha256:sha,maxAttempts:3,now:1_000,...overrides});
const workerAction=(job,type='complete',extras={})=>({type,token:{owner:job.lease.owner,fence:job.lease.fence},...extras});

// Explicit disposable RAM implementation of the provider protocol only. The
// application has no implicit fallback store; a real gateway is separately gated.
function fixture(options={}) {
  let milliseconds=1_000;const provider=createTestWriterProvider(resource),prepared=[];
  const clock=()=>milliseconds;
  const dependencies={readSnapshot:provider.readSnapshot,now:()=>new Date(clock()).toISOString(),commitAtomic:async(plan,opts)=>{
    prepared.push(structuredClone(plan));
    if(options.beforeCommit)await options.beforeCommit(plan,{setTime:n=>{milliseconds=n;},provider});
    // Models the gateway's required lock-time deadline check. Real shared-lock
    // and signed-request execution are tested by the gateway VM suite.
    if(plan.commitBefore!==null&&clock()>=plan.commitBefore)return {status:'conflict'};
    return provider.commitAtomic(plan,opts);
  }};
  const store=extra=>createCanonicalJobStore({resource,actor:{id:'server-worker:isolated'},clock,authorize:()=>true,...extra},dependencies);
  const runner=(extra={})=>createJobRunner({owner:'worker:isolated',store:store(),clock,leaseMs:1_000,maxRunMs:2_000,pollMs:100,retryDelayMs:100,...extra});
  return {provider,prepared,clock,setTime:n=>{milliseconds=n;},store,runner,dependencies};
}

function creation(job=newJob(),mutationId='enqueue:1') {return {id:job.id,expectedRevision:0,job,mutationId,action:null,transitionAt:job.createdAt};}
function next(snapshot,action,now=1_000,mutationId='action:'+snapshot.revision) {
  const worker=action.type!=='claim'&&action.type!=='cancel';
  return {id:snapshot.job.id,expectedRevision:snapshot.revision,job:transitionJob(snapshot.job,action,now),mutationId,action,transitionAt:now,...(worker?{guard:structuredClone(snapshot.job.lease)}:{})};
}
async function start(f) {
  const store=f.store(),queued=(await store.compareAndSet(creation(),signal())).snapshot;
  const claimed=(await store.compareAndSet(next(queued,{type:'claim',owner:'worker:isolated',leaseMs:1_000}),signal())).snapshot;
  return {store,queued,claimed};
}

test('canonical adapter commits job, receipt, audit and history together through the actual controlled writer',async()=>{
  const f=fixture(),runner=f.runner();await runner.enqueue(newJob());
  const result=await runner.run(newJob().id,async context=>{
    await context.checkpoint({sequence:1,key:'page:1',data:{cursor:2}});
  });
  assert.equal(result.status,'succeeded');assert.equal(result.job.checkpoint.sequence,1);
  assert.equal(f.provider.calls.applied,4);
  for(const sheetId of [resource.ledgerSheetId,resource.auditSheetId,resource.historySheetId])assert.equal(f.provider.rows(sheetId).length,5);
  assert.equal(f.provider.rows(resource.recordSheetId).length,2);
  assert.deepEqual(decodeRecord(f.provider.rows(resource.recordSheetId)[1]).payload,result.job);
  assert.deepEqual(f.prepared.map(plan=>plan.commitBefore),[null,null,2_000,2_000]);
  assert.equal((await f.store().load(newJob().id,signal())).revision,4);
});

test('runner recreation resumes canonical checkpoints and deterministic output identity without duplicate outputs',async()=>{
  const f=fixture(),files=new Map();let created=0;
  const outputs={async ensure({key}){if(!files.has(key))files.set(key,{id:'synthetic-file:'+ ++created,sha256:'b'.repeat(64)});return files.get(key);}};
  await f.runner({outputs}).enqueue(newJob());
  const first=await f.runner({outputs}).run(newJob().id,async context=>{await context.ensureOutput('report');await context.checkpoint({sequence:1,key:'rendered',data:{pages:2}});throw new JobWorkError('provider-unavailable');});
  assert.equal(first.status,'retry_wait');f.setTime(1_100);
  const second=await f.runner({outputs,owner:'worker:restarted'}).run(newJob().id,async context=>{assert.equal(context.job.checkpoint.sequence,1);await context.ensureOutput('report');});
  assert.equal(second.status,'succeeded');assert.equal(created,1);assert.equal(second.job.attempts,2);
});

test('domain policy rejects frozen-input changes, terminal resurrection and arbitrary payload replacement',async()=>{
  const f=fixture(),{store,claimed}=await start(f),action=workerAction(claimed.job,'checkpoint',{checkpoint:{sequence:1,key:'first',data:{cursor:1}}});
  const command=next(claimed,action),applied=f.provider.calls.applied;
  for(const job of [{...command.job,inputRevision:8},{...command.job,attempts:2,fence:2,lease:{...command.job.lease,fence:2}},{...command.job,outputs:[{slot:'report',key:'bad',id:'synthetic',sha256:sha}]},{...command.job,error:{code:'worker-failed',summary:'private provider token'}}]){
    await assert.rejects(store.compareAndSet({...command,job},signal()));
  }
  assert.equal(f.provider.calls.applied,applied);
  const completed=(await store.compareAndSet(next(claimed,workerAction(claimed.job)),signal())).snapshot;
  const forged={...creation(newJob()),expectedRevision:completed.revision,mutationId:'resurrect:1',transitionAt:1_000};
  await assert.rejects(store.compareAndSet(forged,signal()),code('invalid-action'));
  assert.equal((await store.load(newJob().id,signal())).job.state,'succeeded');
});

test('creation accepts only the exact initial job state and no forged source metadata',async()=>{
  const f=fixture(),store=f.store(),base=creation();
  const running=transitionJob(base.job,{type:'claim',owner:'worker:other',leaseMs:1_000},1_000);
  for(const input of [{...base,job:running},{...base,job:{...base.job,fence:1}},{...base,sourceUpdatedAt:'2026-10-24T00:00:00.000Z'},{...base,transitionAt:1_001},{...base,action:{type:'cancel'}}])await assert.rejects(store.compareAndSet(input,signal()));
  assert.equal(f.provider.calls.applied,0);
});

test('worker transitions require the exact current lease guard and token',async()=>{
  const f=fixture(),{store,claimed}=await start(f),command=next(claimed,workerAction(claimed.job));
  const {guard,...unguarded}=command;
  await assert.rejects(store.compareAndSet(unguarded,signal()),code('invalid-action'));
  for(const replacement of [{...guard,expiresAt:3_000},{...guard,owner:'other'},{...guard,fence:2}])await assert.rejects(store.compareAndSet({...command,guard:replacement},signal()),code('invalid-action'));
  await assert.rejects(store.compareAndSet({...command,action:{...command.action,token:{owner:guard.owner,fence:2}}},signal()),code('invalid-action'));
  assert.equal(f.provider.calls.applied,2);
});

test('expired lease at lock-time prevents a prepared completion and permits a fenced reclaim',async()=>{
  let expire=false;const f=fixture({beforeCommit(plan,{setTime}){if(expire&&plan.commitBefore!==null){expire=false;setTime(plan.commitBefore);}}}),{store,claimed}=await start(f);
  expire=true;await assert.rejects(store.compareAndSet(next(claimed,workerAction(claimed.job)),signal()),code('lease-lost'));
  assert.equal(f.provider.calls.applied,2);assert.equal((await store.load(newJob().id,signal())).job.state,'running');
  const renewed=(await store.compareAndSet(next(claimed,{type:'claim',owner:'worker:second',leaseMs:1_000},2_000,'reclaim:1'),signal())).snapshot;
  assert.equal(renewed.job.fence,2);
  const stale=next(claimed,workerAction(claimed.job),1_000,'stale:1');const result=await store.compareAndSet(stale,signal());
  assert.equal(result.applied,false);assert.equal(result.snapshot.job.fence,2);assert.equal(f.provider.calls.applied,3);
});

test('committed same-intent replay returns its original receipt after later changes and lease expiry',async()=>{
  const f=fixture(),{store,claimed}=await start(f),checkpointAction=workerAction(claimed.job,'checkpoint',{checkpoint:{sequence:1,key:'saved',data:{cursor:2}}}),command=next(claimed,checkpointAction);
  const original=await store.compareAndSet(command,signal());
  await store.compareAndSet(next(original.snapshot,workerAction(original.snapshot.job),1_000,'complete:1'),signal());
  f.setTime(5_000);const replay=await store.compareAndSet(command,signal());
  assert.deepEqual(replay,original);assert.equal(f.provider.calls.applied,4);
  const changedAction={...command,action:workerAction(claimed.job,'renew',{leaseMs:1_000})};
  const denied=await store.compareAndSet(changedAction,signal());assert.equal(denied.applied,false);assert.equal(f.provider.calls.applied,4);
});

test('unconfirmed outcomes remain quarantined and runner submits no cleanup replacement',async()=>{
  const f=fixture(),runner=f.runner();await runner.enqueue(newJob());
  const first=await runner.run(newJob().id,async context=>{f.provider.faults.unknownBeforeCommitOnce=true;await context.checkpoint({sequence:1,key:'awaiting-receipt',data:{cursor:2}});});
  assert.equal(first.status,'unavailable');assert.equal(f.provider.quarantine(),true);
  assert.equal(f.provider.calls.commits,3);assert.equal(f.provider.calls.applied,2);
  assert.equal((await f.store().load(newJob().id,signal())).job.state,'running');
  await f.provider.resolveQuarantine();f.setTime(2_000);
  const second=await f.runner({owner:'worker:after-reconcile'}).run(newJob().id,async context=>{assert.equal(context.job.checkpoint.sequence,1);});
  assert.equal(second.status,'succeeded');assert.equal(second.job.attempts,2);
});

test('lost response after commit can be reconciled by replaying the exact command without an extra revision',async()=>{
  const f=fixture(),store=f.store(),command=creation();f.provider.faults.loseResponseOnce=true;
  await assert.rejects(store.compareAndSet(command,signal()),code('outcome-unknown'));
  const replay=await store.compareAndSet(command,signal());assert.equal(replay.applied,true);assert.equal(replay.snapshot.revision,1);assert.equal(f.provider.calls.applied,1);
});

test('concurrent stale revision returns current durable state instead of overwriting it',async()=>{
  const f=fixture(),store=f.store(),queued=(await store.compareAndSet(creation(),signal())).snapshot;
  const first=next(queued,{type:'claim',owner:'worker:one',leaseMs:1_000},1_000,'claim:one'),second=next(queued,{type:'claim',owner:'worker:two',leaseMs:1_000},1_000,'claim:two');
  const results=await Promise.all([store.compareAndSet(first,signal()),store.compareAndSet(second,signal())]);
  assert.equal(results.filter(result=>result.applied).length,1);assert.equal(f.provider.calls.applied,2);assert.equal(results.find(result=>!result.applied).snapshot.revision,2);
});

test('mandatory authorization runs before any mutation read and again against exact prior state',async()=>{
  const f=fixture(),denied=f.store({authorize:()=>false});
  await assert.rejects(denied.compareAndSet(creation(),signal()),code('unavailable'));assert.equal(f.provider.calls.reads,0);assert.equal(f.provider.calls.applied,0);
  const {claimed}=await start(f),calls=[];const ownerScoped=f.store({authorize:context=>{calls.push(context);return context.operation==='read'||context.current===null||context.current.lease?.owner==='different-owner';}});
  await assert.rejects(ownerScoped.compareAndSet(next(claimed,workerAction(claimed.job)),signal()),code('invalid-action'));
  assert.ok(calls.some(context=>context.current?.lease?.owner==='worker:isolated'));assert.equal(f.provider.calls.applied,2);
  await assert.rejects(f.store({authorize:()=>false}).load(newJob().id,signal()),code('unavailable'));
});

test('conflict recovery does not expose current job state when read permission is denied',async()=>{
  const f=fixture(),{queued}=await start(f),store=f.store({authorize:context=>context.operation!=='read'});
  await assert.rejects(store.compareAndSet(next(queued,{type:'claim',owner:'worker:other',leaseMs:1_000},1_000,'other:claim'),signal()),code('unavailable'));
  assert.equal(f.provider.calls.applied,2);
});

test('canonical reads reject formula provenance and record/history tampering before jobs run',async()=>{
  for(const tamper of [f=>f.provider.overrideCell(resource.recordSheetId,1,2,{userEnteredValue:{formulaValue:'="fake"'},effectiveValue:{stringValue:'fake'}}),f=>f.provider.editCell(resource.recordSheetId,1,RECORD_COLUMNS.indexOf('payload_sha256'),'b'.repeat(64)),f=>f.provider.replaceRows(resource.historySheetId,[Array.from(RECORD_COLUMNS)])]){
    const f=fixture();await f.runner().enqueue(newJob());tamper(f);
    await assert.rejects(f.store().load(newJob().id,signal()),code('unavailable'));let handlers=0;
    const result=await f.runner().run(newJob().id,async()=>{handlers++;});assert.equal(result.status,'unavailable');assert.equal(handlers,0);assert.equal(f.provider.calls.applied,1);
  }
});

test('read and authorization stalls respect bounded aborts without leaking provider messages',async()=>{
  const f=fixture();await f.runner().enqueue(newJob());
  const controller=new AbortController();controller.abort();await assert.rejects(f.store().load(newJob().id,controller.signal),code('aborted'));
  const hanging=createCanonicalJobStore({resource,actor:{id:'worker:isolated'},clock:f.clock,authorize:()=>true,limits:{timeoutMs:10}},{...f.dependencies,readSnapshot:async()=>new Promise(()=>{})});
  await assert.rejects(hanging.load(newJob().id,signal()),code('aborted'));
  f.provider.faults.read=true;await assert.rejects(f.store().load(newJob().id,signal()),error=>error.code==='unavailable'&&!error.message.includes('secret'));
});

test('authorization accepts complete bounded job metadata when old plus new exceeds one Sheets cell',async()=>{
  const f=fixture(),outputs={async ensure(){return {id:'x'.repeat(160),sha256:'b'.repeat(64)};}};
  const runner=f.runner({outputs,maxRunMs:15_000});await runner.enqueue(newJob());
  const result=await runner.run(newJob().id,async context=>{
    await context.checkpoint({sequence:1,key:'x'.repeat(160),data:'x'.repeat(7_900)});
    for(let index=0;index<32;index++)await context.ensureOutput('slot:'+String(index).padStart(3,'0')+':'+ 'x'.repeat(151));
  });
  assert.equal(result.status,'succeeded');assert.equal(result.job.outputs.length,32);assert.equal(result.job.checkpoint.data.length,7_900);
});

test('abort after a persisted checkpoint with a missing response never submits a replacement retry',async()=>{
  const f=fixture(),started=deferred(),controller=new AbortController();
  const store=createCanonicalJobStore({resource,actor:{id:'worker:isolated'},clock:f.clock,authorize:()=>true}, {...f.dependencies,commitAtomic:async(plan,opts)=>{
    const result=await f.dependencies.commitAtomic(plan,opts);
    if(plan.receipt.revision===3){started.resolve();return new Promise(()=>{});}return result;
  }});
  const runner=f.runner({store});await runner.enqueue(newJob());
  const running=runner.run(newJob().id,async context=>{await context.checkpoint({sequence:1,key:'step:one',data:{completed:true}});},{signal:controller.signal});
  await started.promise;controller.abort();const result=await running;
  assert.equal(result.status,'unavailable');assert.equal(f.provider.calls.applied,3);assert.equal(f.provider.calls.commits,3);
  const current=await f.store().load(newJob().id,signal());assert.equal(current.revision,3);assert.equal(current.job.state,'running');assert.equal(current.job.checkpoint.sequence,1);
});

test('completion waits for a heartbeat receipt and cannot follow an unconfirmed renewal',async()=>{
  const f=fixture(),started=deferred(),finish=deferred(),controller=new AbortController();
  const store=createCanonicalJobStore({resource,actor:{id:'worker:isolated'},clock:f.clock,authorize:()=>true}, {...f.dependencies,commitAtomic:async(plan,opts)=>{
    const result=await f.dependencies.commitAtomic(plan,opts);
    if(plan.receipt.revision===3){started.resolve();return new Promise(()=>{});}return result;
  }});
  const runner=f.runner({store,pollMs:5});await runner.enqueue(newJob());
  const running=runner.run(newJob().id,async()=>{f.setTime(1_500);await finish.promise;},{signal:controller.signal});
  await started.promise;finish.resolve();await new Promise(resolve=>setTimeout(resolve,10));
  assert.equal(f.provider.calls.commits,3);controller.abort();assert.equal((await running).status,'unavailable');
  assert.equal(f.provider.calls.commits,3);const current=await f.store().load(newJob().id,signal());assert.equal(current.job.state,'running');assert.equal(current.job.lease.expiresAt,2_500);
});
