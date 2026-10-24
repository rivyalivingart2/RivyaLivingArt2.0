import test from 'node:test';
import assert from 'node:assert/strict';
import {createJob, validateJob, transitionJob, jobOutputKey, createJobRunner, JobWorkError, JobError} from '../src/lib/google-workspace/durable-jobs.ts';
import {makeRecord, encodeRecord, decodeRecord} from '../src/lib/google-workspace/record-codec.ts';

const sha = 'a'.repeat(64), outputSha = 'b'.repeat(64);
const newJob = overrides => createJob({id:'job:synthetic-report:1',type:'synthetic-report',inputId:'snapshot:1',inputRevision:7,inputSha256:sha,maxAttempts:3,now:1_000,...overrides});
const claim = (job=newJob(),owner='worker:a',now=1_000) => transitionJob(job,{type:'claim',owner,leaseMs:1_000},now);
const token = job => ({owner:job.lease.owner,fence:job.lease.fence});
const checkpoint = (sequence=1) => ({sequence,key:'step:'+sequence,data:{cursor:sequence,sourceRevision:7}});
const output = (job,slot='report') => ({slot,key:jobOutputKey(job,slot),id:'drive-synthetic-0001',sha256:outputSha});
const code = expected => error => error.code === expected;
const deferred = () => {let resolve,reject;const promise=new Promise((yes,no)=>{resolve=yes;reject=no;});return {promise,resolve,reject};};

// A deterministic test double only. It is deliberately supplied externally so
// runner recreation proves no runner-owned persistence. Production durability
// requires the canonical Sheets writer and its atomic lease/revision guard.
function harness(options={}) {
  let currentTime=1_000;const records=new Map(),writes=[],effects=new Map();let creations=0,ensures=0;
  const clock=()=>currentTime;
  const store={
    async load(id,signal){assert.equal(signal instanceof AbortSignal,true);return records.has(id)?structuredClone(records.get(id)):null;},
    async compareAndSet(input,signal){
      if(signal.aborted)throw Error('aborted');
      if(options.beforeCas)await options.beforeCas(input,{records,clock,setTime:n=>{currentTime=n;}});
      const current=records.get(input.id);
      if((current?.revision??0)!==input.expectedRevision)return {applied:false,snapshot:structuredClone(current)};
      if(input.guard&&(!current?.job.lease||JSON.stringify(current.job.lease)!==JSON.stringify(input.guard)||input.guard.expiresAt<=clock()))return {applied:false,snapshot:structuredClone(current)};
      const saved={revision:input.expectedRevision+1,job:validateJob(input.job)};records.set(input.id,structuredClone(saved));writes.push(structuredClone(input));
      if(options.afterCas)await options.afterCas(input,{records,clock});
      return {applied:true,snapshot:structuredClone(saved)};
    },
  };
  const outputs={async ensure({key,signal}){assert.equal(signal instanceof AbortSignal,true);ensures++;if(!effects.has(key)){creations++;effects.set(key,{id:'drive-synthetic-'+creations,sha256:outputSha});}return structuredClone(effects.get(key));}};
  const runner=(extra={})=>createJobRunner({owner:'worker:a',store,clock,outputs,leaseMs:1_000,pollMs:100,maxRunMs:500,retryDelayMs:100,...extra});
  return {store,records,writes,effects,runner,clock,setTime:n=>{currentTime=n;},get creations(){return creations;},get ensures(){return ensures;}};
}

test('job schema is strict, bounded, immutable by caller and lossless in canonical records',()=>{
  const job=newJob();assert.equal(job.state,'queued');assert.equal(job.fence,0);assert.equal(job.inputRevision,7);
  const copy=validateJob(job);copy.inputRevision=8;assert.equal(job.inputRevision,7);
  const envelope=makeRecord({recordId:job.id,revision:1,payload:job,sourceUpdatedAt:null,archivedAt:null,lastMutationId:'enqueue:1'});
  assert.deepEqual(decodeRecord(encodeRecord(envelope)).payload,job);
  for(const bad of [{...job,unknown:1},{...job,inputRevision:0},{...job,inputSha256:'secret'},{...job,outputs:Array(33).fill(output(job))},{...job,error:{code:'worker-failed',summary:'token https://private.invalid'}},{...job,maxAttempts:101},{...job,checkpoint:{sequence:1,key:'step:1',data:'x'.repeat(8001)}}])assert.throws(()=>validateJob(bad),code('invalid-job'));
});

test('claim is exclusive, preserves frozen input and fences expired workers even with the same owner',()=>{
  const before=newJob(),first=claim(before);
  assert.deepEqual(before,newJob());assert.equal(first.attempts,1);assert.equal(first.fence,1);
  assert.throws(()=>claim(first,'worker:b',1_001),code('busy'));
  const second=claim(first,'worker:a',2_000);assert.equal(second.fence,2);assert.equal(second.attempts,2);
  assert.equal(second.inputRevision,7);assert.equal(second.inputSha256,sha);
  for(const action of [{type:'renew',leaseMs:1_000},{type:'checkpoint',checkpoint:checkpoint()},{type:'output',output:output(first)},{type:'retry',delayMs:100,code:'worker-failed'},{type:'fail',code:'worker-failed'},{type:'complete'}])assert.throws(()=>transitionJob(second,{...action,token:token(first)},2_001),code('lease-lost'));
});

test('renewal preserves fence and cannot revive an expired lease or rewind time',()=>{
  const first=claim();const renewed=transitionJob(first,{type:'renew',token:token(first),leaseMs:1_000},1_500);
  assert.equal(renewed.lease.expiresAt,2_500);assert.equal(renewed.fence,first.fence);
  assert.throws(()=>transitionJob(first,{type:'renew',token:token(first),leaseMs:1_000},2_000),code('lease-lost'));
  assert.throws(()=>transitionJob(renewed,{type:'complete',token:token(renewed)},1_499),code('invalid-action'));
});

test('checkpoints are ordered, replayable without rewriting, and reject conflicting or oversized data',()=>{
  const first=claim(),saved=transitionJob(first,{type:'checkpoint',token:token(first),checkpoint:checkpoint()},1_100);
  assert.deepEqual(transitionJob(saved,{type:'checkpoint',token:token(first),checkpoint:checkpoint()},1_200),saved);
  assert.throws(()=>transitionJob(saved,{type:'checkpoint',token:token(first),checkpoint:{...checkpoint(),data:{changed:true}}},1_200),code('checkpoint-conflict'));
  assert.throws(()=>transitionJob(saved,{type:'checkpoint',token:token(first),checkpoint:checkpoint(3)},1_200),code('checkpoint-conflict'));
  assert.equal(transitionJob(saved,{type:'checkpoint',token:token(first),checkpoint:checkpoint(2)},1_200).checkpoint.sequence,2);
  assert.throws(()=>transitionJob(saved,{type:'checkpoint',token:token(first),checkpoint:{...checkpoint(2),data:'x'.repeat(8001)}},1_200),code('invalid-action'));
});

test('output identities bind frozen input and slots, survive retries and reject replacements',()=>{
  const first=claim(),value=output(first),saved=transitionJob(first,{type:'output',token:token(first),output:value},1_100);
  assert.deepEqual(transitionJob(saved,{type:'output',token:token(first),output:value},1_200),saved);
  assert.notEqual(jobOutputKey(first,'report'),jobOutputKey(first,'thumbnail'));
  assert.notEqual(jobOutputKey(first,'report'),jobOutputKey({...first,inputRevision:8},'report'));
  assert.throws(()=>transitionJob(saved,{type:'output',token:token(first),output:{...value,id:'different'}},1_200),code('output-conflict'));
  assert.throws(()=>transitionJob(saved,{type:'output',token:token(first),output:{...value,key:'wrong'}},1_200),code('invalid-action'));
  const waiting=transitionJob(saved,{type:'retry',token:token(first),delayMs:100,code:'provider-unavailable'},1_200);
  const next=claim(waiting,'worker:b',1_300);assert.deepEqual(next.outputs,[value]);assert.equal(jobOutputKey(next,'report'),value.key);
});

test('retry scheduling respects due time and limits while preserving checkpoint and sanitized failures',()=>{
  let job=claim(newJob({maxAttempts:2}));job=transitionJob(job,{type:'checkpoint',token:token(job),checkpoint:checkpoint()},1_100);
  job=transitionJob(job,{type:'retry',token:token(job),delayMs:100,code:'rate-limited'},1_200);
  assert.equal(job.nextRetryAt,1_300);assert.equal(job.lease,null);assert.equal(job.checkpoint.sequence,1);
  assert.throws(()=>claim(job,'worker:b',1_299),code('not-due'));
  job=claim(job,'worker:b',1_300);job=transitionJob(job,{type:'retry',token:token(job),delayMs:100,code:'worker-failed'},1_400);
  assert.equal(job.state,'failed');assert.equal(job.attempts,2);assert.equal(job.nextRetryAt,null);
  assert.throws(()=>claim(job,'worker:c',1_500),code('terminal'));
  const exhausted=claim(claim(newJob({maxAttempts:1})),'worker:b',2_000);assert.equal(exhausted.state,'failed');assert.equal(exhausted.error.code,'attempts-exhausted');
});

test('durable cancellation clears the lease and invalidates all old worker actions',()=>{
  const running=claim(),cancelled=transitionJob(running,{type:'cancel'},1_100);
  assert.equal(cancelled.state,'cancelled');assert.equal(cancelled.lease,null);assert.equal(cancelled.fence,2);
  assert.deepEqual(transitionJob(cancelled,{type:'cancel'},1_200),cancelled);
  assert.throws(()=>transitionJob(cancelled,{type:'complete',token:token(running)},1_200),code('lease-lost'));
});

test('runner persists all transitions through CAS and runs handler effects outside storage calls',async()=>{
  const h=harness(),runner=h.runner();await runner.enqueue(newJob());
  const result=await runner.run(newJob().id,async context=>{await context.checkpoint(checkpoint());const one=await context.ensureOutput('report'),two=await context.ensureOutput('report');assert.deepEqual(one,two);});
  assert.equal(result.status,'succeeded');assert.equal(result.job.checkpoint.sequence,1);assert.equal(result.job.outputs.length,1);assert.equal(h.creations,1);assert.equal(h.ensures,1);
  assert.deepEqual(h.writes.map(w=>w.job.state),['queued','running','running','running','succeeded']);
  assert.ok(h.writes.slice(2).every(w=>w.guard?.owner==='worker:a'&&w.guard.fence===1));
  assert.equal(new Set(h.writes.map(w=>w.mutationId)).size,h.writes.length);
});

test('two runners racing the same revision only run one handler',async()=>{
  const h=harness(),a=h.runner(),b=h.runner({owner:'worker:b'}),started=deferred(),finish=deferred();await a.enqueue(newJob());
  const first=a.run(newJob().id,async()=>{started.resolve();await finish.promise;});await started.promise;
  let secondCalls=0;const second=await b.run(newJob().id,async()=>{secondCalls++;});assert.equal(second.status,'busy');assert.equal(secondCalls,0);
  finish.resolve();assert.equal((await first).status,'succeeded');
});

test('restart resumes durable checkpoints and outputs with no runner-owned state',async()=>{
  const h=harness();await h.runner().enqueue(newJob());
  const first=await h.runner().run(newJob().id,async context=>{await context.ensureOutput('report');await context.checkpoint(checkpoint());throw new JobWorkError('provider-unavailable');});
  assert.equal(first.status,'retry_wait');h.setTime(1_100);
  const second=await h.runner({owner:'worker:restarted'}).run(newJob().id,async context=>{assert.equal(context.job.checkpoint.sequence,1);assert.equal(context.job.inputRevision,7);await context.ensureOutput('report');await context.checkpoint(checkpoint(2));});
  assert.equal(second.status,'succeeded');assert.equal(second.job.attempts,2);assert.equal(h.creations,1);assert.equal(h.ensures,1);
});

test('crash after external output creation but before its checkpoint reuses deterministic output on retry',async()=>{
  let failOnce=true;const h=harness({beforeCas(input){if(input.job.outputs.length&&failOnce){failOnce=false;throw Error('private provider secret');}}});await h.runner().enqueue(newJob());
  const first=await h.runner().run(newJob().id,async context=>{await context.ensureOutput('report');});assert.equal(first.status,'retry_wait');assert.equal(first.job.outputs.length,0);assert.equal(h.creations,1);
  h.setTime(1_100);const second=await h.runner({owner:'worker:restart'}).run(newJob().id,async context=>{await context.ensureOutput('report');});
  assert.equal(second.status,'succeeded');assert.equal(second.job.outputs.length,1);assert.equal(h.creations,1);assert.equal(h.ensures,2);
  assert.ok(!JSON.stringify([...h.records.values()]).includes('private provider'));
});

test('lost response after successful completion is recovered from durable terminal state',async()=>{
  let once=true;const h=harness({afterCas(input){if(input.job.state==='succeeded'&&once){once=false;throw Error('connection lost');}}});await h.runner().enqueue(newJob());
  const result=await h.runner().run(newJob().id,async()=>{});assert.equal(result.status,'succeeded');assert.equal(h.records.get(newJob().id).job.attempts,1);
  let calls=0;await h.runner().run(newJob().id,async()=>{calls++;});assert.equal(calls,0);
});

test('lease expiring between preparation and CAS is rejected by the commit guard',async()=>{
  let expire=true;const h=harness({beforeCas(input,{setTime}){if(input.guard&&expire){expire=false;setTime(2_000);}}});await h.runner().enqueue(newJob());
  const result=await h.runner().run(newJob().id,async context=>{await context.checkpoint(checkpoint());});
  assert.equal(result.status,'lease-lost');assert.equal(h.records.get(newJob().id).job.checkpoint.sequence,0);assert.equal(h.records.get(newJob().id).job.state,'running');
  const next=await h.runner({owner:'worker:reclaimed'}).run(newJob().id,async()=>{});assert.equal(next.status,'succeeded');assert.equal(next.job.fence,2);
});

test('remote cancellation aborts an ongoing handler and prevents completion',async()=>{
  const h=harness(),runner=h.runner({pollMs:5}),started=deferred();let signal;await runner.enqueue(newJob());
  const executing=runner.run(newJob().id,async context=>{signal=context.signal;started.resolve();await new Promise(()=>{});});await started.promise;
  await runner.cancel(newJob().id);const result=await executing;assert.equal(result.status,'cancelled');assert.equal(signal.aborted,true);assert.equal(h.records.get(newJob().id).job.state,'cancelled');
});

test('caller abort releases a live lease for retry; fresh runner resumes it',async()=>{
  const h=harness(),controller=new AbortController(),started=deferred();await h.runner().enqueue(newJob());
  const executing=h.runner().run(newJob().id,async()=>{started.resolve();await new Promise(()=>{});},{signal:controller.signal});await started.promise;controller.abort('credential detail');
  const result=await executing;assert.equal(result.status,'aborted');assert.equal(result.job.state,'retry_wait');assert.equal(result.job.error.code,'interrupted');assert.ok(!JSON.stringify(result).includes('credential'));
  h.setTime(1_100);assert.equal((await h.runner({owner:'worker:after-abort'}).run(newJob().id,async()=>{})).status,'succeeded');
});

test('time and poll budgets bound workers that ignore their abort signal',async()=>{
  const h=harness();await h.runner().enqueue(newJob());
  const result=await h.runner({maxRunMs:20,pollMs:5}).run(newJob().id,async()=>new Promise(()=>{}));
  assert.equal(result.status,'run-limit');assert.equal(result.job.state,'retry_wait');
  const other=harness();await other.runner().enqueue(newJob());
  const limited=await other.runner({maxPolls:1,pollMs:1}).run(newJob().id,async()=>new Promise(()=>{}));assert.equal(limited.status,'run-limit');
});

test('invalid input is terminal and arbitrary exceptions are sanitized',async()=>{
  for(const [error,expected] of [[new JobWorkError('invalid-input'),'failed'],[Error('secret=abc https://private.invalid/customer'),'retry_wait']]){
    const h=harness();await h.runner().enqueue(newJob());const result=await h.runner().run(newJob().id,async()=>{throw error;});assert.equal(result.status,expected);assert.ok(!JSON.stringify(result).includes('secret'));assert.ok(!JSON.stringify(result).includes('private.invalid'));
  }
});

test('failed CAS is retried a bounded number of times without executing a handler',async()=>{
  const h=harness();await h.runner().enqueue(newJob());let attempts=0,handlers=0;
  const conflictStore={...h.store,compareAndSet:async input=>{attempts++;return {applied:false,snapshot:structuredClone(h.records.get(input.id))};}};
  const result=await h.runner({store:conflictStore,maxCasAttempts:3}).run(newJob().id,async()=>{handlers++;});assert.equal(result.status,'unavailable');assert.equal(attempts,3);assert.equal(handlers,0);
});

test('missing, already aborted and stalled store reads fail without worker execution',async()=>{
  const h=harness();let calls=0;assert.equal((await h.runner().run(newJob().id,async()=>{calls++;})).status,'missing');
  const controller=new AbortController();controller.abort();assert.equal((await h.runner().run(newJob().id,async()=>{calls++;},{signal:controller.signal})).status,'aborted');
  const stuck={...h.store,load:async()=>new Promise(()=>{})};assert.equal((await h.runner({store:stuck,maxRunMs:10}).run(newJob().id,async()=>{calls++;})).status,'run-limit');assert.equal(calls,0);
});

test('enqueue is idempotent and rejects reuse of a job ID for a changed frozen input',async()=>{
  const h=harness(),runner=h.runner();const first=await runner.enqueue(newJob()),second=await runner.enqueue(newJob());assert.deepEqual(first,second);assert.equal(h.writes.length,1);
  await assert.rejects(runner.enqueue(newJob({inputRevision:8})),code('input-changed'));
});

test('a changed input read during an attempt is rejected before output provider use',async()=>{
  const h=harness();await h.runner().enqueue(newJob());
  const result=await h.runner().run(newJob().id,async context=>{h.records.get(newJob().id).job.inputRevision=8;await context.ensureOutput('report');});assert.equal(result.status,'lease-lost');assert.equal(h.ensures,0);
});

test('claim responses arriving after expiry do not execute the handler',async()=>{
  const h=harness({beforeCas(input,{setTime}){if(input.action?.type==='claim')setTime(2_000);}});await h.runner().enqueue(newJob());let handlers=0;
  const result=await h.runner().run(newJob().id,async()=>{handlers++;});assert.equal(result.status,'lease-lost');assert.equal(handlers,0);assert.equal(h.writes.length,2);
});

test('an unknown commit does not cause a runner cleanup or replacement mutation',async()=>{
  const h=harness({beforeCas(input){if(input.action?.type==='checkpoint')throw new JobError('outcome-unknown');}});await h.runner().enqueue(newJob());
  const result=await h.runner().run(newJob().id,async context=>{await context.checkpoint(checkpoint());});
  assert.equal(result.status,'unavailable');assert.equal(h.writes.length,2);assert.equal(h.records.get(newJob().id).job.state,'running');
});

test('heartbeat renews through canonical CAS while handler work remains outside the lock',async()=>{
  const h=harness(),finish=deferred();await h.runner().enqueue(newJob());
  const result=h.runner({pollMs:5}).run(newJob().id,async()=>{h.setTime(1_500);await finish.promise;});
  for(let attempt=0;attempt<30&&!h.writes.some(write=>write.action?.type==='renew');attempt++)await new Promise(resolve=>setTimeout(resolve,2));
  assert.ok(h.writes.some(write=>write.action?.type==='renew'));assert.equal(h.records.get(newJob().id).job.lease.expiresAt,2_500);finish.resolve();
  assert.equal((await result).status,'succeeded');
});

test('enqueue rejects forged queued progress and invalid CAS acknowledgements',async()=>{
  const h=harness();await assert.rejects(h.runner().enqueue({...newJob(),checkpoint:checkpoint()}),code('invalid-action'));assert.equal(h.writes.length,0);
  const malformed={...h.store,compareAndSet:async()=>({applied:'true',snapshot:{revision:1,job:newJob()}})};
  await assert.rejects(h.runner({store:malformed}).enqueue(newJob()),code('outcome-unknown'));
  assert.throws(()=>createJobRunner(null),code('invalid-action'));
});

test('enqueue and cancel aborts after CAS dispatch report uncertainty instead of implying rollback',async()=>{
  for(const operation of ['enqueue','cancel']){
    const started=deferred(),controller=new AbortController();let hanging=false;
    const h=harness({afterCas(){if(hanging){started.resolve();return new Promise(()=>{});}}});
    if(operation==='cancel')await h.runner().enqueue(newJob());hanging=true;
    const pending=operation==='enqueue'?h.runner().enqueue(newJob(),{signal:controller.signal}):h.runner().cancel(newJob().id,{signal:controller.signal});
    await started.promise;controller.abort();await assert.rejects(pending,code('outcome-unknown'));
    assert.equal(h.writes.length,operation==='enqueue'?1:2);
  }
});

test('run deadline during an unconfirmed checkpoint does not emit an interrupted retry',async()=>{
  const h=harness({afterCas(input){if(input.action?.type==='checkpoint')return new Promise(()=>{});}});await h.runner().enqueue(newJob());
  const result=await h.runner({maxRunMs:20}).run(newJob().id,async context=>{await context.checkpoint(checkpoint());});
  assert.equal(result.status,'unavailable');assert.equal(h.writes.length,3);assert.equal(h.records.get(newJob().id).job.state,'running');
});
