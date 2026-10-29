import test from 'node:test';
import assert from 'node:assert/strict';
import {createBoundedJobStore} from '../src/lib/google-workspace/bounded-job-store.ts';
import {createBoundedStore, auditBoundedState, BoundedStoreError} from '../src/lib/google-workspace/bounded-store.ts';
import {createJob, transitionJob, createJobRunner, JobWorkError} from '../src/lib/google-workspace/durable-jobs.ts';
import {boundedGatewayHarness} from './helpers/google-workspace-bounded-harness.mjs';

const sha = 'a'.repeat(64), signal = () => new AbortController().signal;
const code = expected => error => error.code === expected;
function fixture(options = {}) {
  const h = boundedGatewayHarness(), prepared = [];
  const clock = () => h.state.now;
  const provider = {...h.provider, async commit(plan, settings) {
    prepared.push(structuredClone(plan));
    await options.beforeCommit?.(plan, h);
    return h.provider.commit(plan, settings);
  }};
  const store = (extra = {}, target = provider) => createBoundedJobStore({
    layout: h.layout, actor: {id: 'worker:local-fixture'}, clock, authorize: () => true, ...extra,
  }, target);
  const runner = extra => createJobRunner({owner: 'worker:fixture', store: store(), clock,
    leaseMs: 1_000, maxRunMs: 5_000, pollMs: 100, retryDelayMs: 100, ...extra});
  const job = () => createJob({id: 'job:fixture', type: 'local-only-report', inputId: 'frozen:fixture',
    inputRevision: 7, inputSha256: sha, maxAttempts: 3, now: clock()});
  return {h, prepared, clock, store, runner, job, provider};
}
const creation = (job, mutationId = 'enqueue:fixture') => ({id: job.id, expectedRevision: 0, job,
  mutationId, action: null, transitionAt: job.createdAt});
const workerAction = (job, type = 'complete', extra = {}) => ({type,
  token: {owner: job.lease.owner, fence: job.lease.fence}, ...extra});
function next(snapshot, action, at = snapshot.job.updatedAt, mutationId = 'action:' + snapshot.revision) {
  const worker = action.type !== 'claim' && action.type !== 'cancel';
  return {id: snapshot.job.id, expectedRevision: snapshot.revision,
    job: transitionJob(snapshot.job, action, at), mutationId, action, transitionAt: at,
    ...(worker ? {guard: structuredClone(snapshot.job.lease)} : {})};
}
async function start(f) {
  const store = f.store(), queued = (await store.compareAndSet(creation(f.job()), signal())).snapshot;
  const claimed = (await store.compareAndSet(next(queued, {type: 'claim', owner: 'worker:fixture', leaseMs: 1_000}), signal())).snapshot;
  return {store, queued, claimed};
}

test('bounded job runner commits every domain transition with receipt, audit and history through exact script source', async () => {
  const f = fixture(), runner = f.runner();
  await runner.enqueue(f.job());
  const result = await runner.run(f.job().id, async context => {
    await context.checkpoint({sequence: 1, key: 'page:fixture', data: {cursor: 2}});
  });
  assert.equal(result.status, 'succeeded');
  assert.equal(result.job.checkpoint.sequence, 1);
  const audit = auditBoundedState(f.h.layout, f.h.snapshot());
  assert.equal(audit.records, 1); assert.equal(audit.history, 4); assert.equal(audit.audit, 4); assert.equal(audit.ledger, 4);
  assert.deepEqual(f.prepared.map(plan => plan.commitBefore), [null, null, f.clock() + 1_000, f.clock() + 1_000]);
  f.h.restart();
  assert.equal((await f.store().load(f.job().id, signal())).revision, 4);
  assert.ok(f.h.state.reads.filter(read => read.sheetId === f.h.layout.dataSheetId).every(read => read.rows === 8 && read.columns === 7));
});

test('cold runner resumes durable checkpoint and output identity without creating another local fixture output', async () => {
  const f = fixture(), files = new Map(); let created = 0;
  // Disposable output-provider emulator; these IDs are never Google output IDs.
  const outputs = {async ensure({key}) { if (!files.has(key)) files.set(key, {id: 'local-file:' + ++created, sha256: 'b'.repeat(64)}); return files.get(key); }};
  const job = f.job(); await f.runner({outputs}).enqueue(job);
  const first = await f.runner({outputs}).run(job.id, async context => {
    await context.ensureOutput('report'); await context.checkpoint({sequence: 1, key: 'rendered', data: {pages: 2}});
    throw new JobWorkError('provider-unavailable');
  });
  assert.equal(first.status, 'retry_wait'); f.h.restart(); f.h.state.now += 100;
  const second = await f.runner({outputs, owner: 'worker:restarted'}).run(job.id, async context => {
    assert.equal(context.job.checkpoint.sequence, 1); await context.ensureOutput('report');
  });
  assert.equal(second.status, 'succeeded'); assert.equal(second.job.attempts, 2); assert.equal(created, 1);
});

test('domain policy rejects arbitrary replacement, terminal resurrection, and forged creation metadata', async () => {
  const f = fixture(), {store, claimed} = await start(f);
  const command = next(claimed, workerAction(claimed.job, 'checkpoint', {checkpoint: {sequence: 1, key: 'saved', data: null}}));
  const before = f.h.state.batches;
  for (const job of [{...command.job, inputRevision: 8}, {...command.job, attempts: 2, fence: 2, lease: {...command.job.lease, fence: 2}}]) {
    await assert.rejects(store.compareAndSet({...command, job}, signal()), code('invalid-action'));
  }
  await assert.rejects(store.compareAndSet({...command, sourceUpdatedAt: '2026-10-29'}, signal()), code('invalid-action'));
  assert.equal(f.h.state.batches, before);
  const done = (await store.compareAndSet(next(claimed, workerAction(claimed.job)), signal())).snapshot;
  await assert.rejects(store.compareAndSet({...creation(f.job()), expectedRevision: done.revision, mutationId: 'resurrect'}, signal()), code('invalid-action'));
  assert.equal((await store.load(f.job().id, signal())).job.state, 'succeeded');
  const other = fixture(), initial = creation(other.job());
  for (const input of [{...initial, job: {...initial.job, fence: 1}}, {...initial, transitionAt: other.clock() + 1}, {...initial, action: {type: 'cancel'}}]) {
    await assert.rejects(other.store().compareAndSet(input, signal()));
  }
  assert.equal(other.h.state.batches, 0);
});

test('worker transition requires exact original lease, token and commit deadline', async () => {
  const f = fixture(), {store, claimed} = await start(f), command = next(claimed, workerAction(claimed.job));
  const {guard, ...missingGuard} = command;
  await assert.rejects(store.compareAndSet(missingGuard, signal()), code('invalid-action'));
  for (const replacement of [{...guard, expiresAt: guard.expiresAt + 1_000}, {...guard, owner: 'other'}, {...guard, fence: 2}]) {
    await assert.rejects(store.compareAndSet({...command, guard: replacement}, signal()), code('invalid-action'));
  }
  await assert.rejects(store.compareAndSet({...command, action: {...command.action, token: {...command.action.token, fence: 2}}}, signal()), code('invalid-action'));
  assert.equal(f.h.state.batches, 4);
});

test('lock-time lease expiration prevents a completion and a stale worker cannot overwrite fenced reclaim', async () => {
  let expire = false;
  const f = fixture({beforeCommit(plan, h) { if (expire && plan.commitBefore !== null) { expire = false; h.state.now = plan.commitBefore; } }});
  const {store, claimed} = await start(f); expire = true;
  await assert.rejects(store.compareAndSet(next(claimed, workerAction(claimed.job)), signal()), code('lease-lost'));
  assert.equal(f.h.state.batches, 4);
  const reclaimed = (await store.compareAndSet(next(claimed, {type: 'claim', owner: 'worker:new', leaseMs: 1_000}, f.clock(), 'reclaim'), signal())).snapshot;
  assert.equal(reclaimed.job.fence, 2);
  const stale = await store.compareAndSet(next(claimed, workerAction(claimed.job), claimed.job.updatedAt, 'stale'), signal());
  assert.equal(stale.applied, false); assert.equal(stale.snapshot.job.fence, 2); assert.equal(f.h.state.batches, 6);
});

test('historical replay uses its verified original prior revision after many later changes and lease expiry', async () => {
  const f = fixture(), {store, claimed} = await start(f);
  const command = next(claimed, workerAction(claimed.job, 'checkpoint', {checkpoint: {sequence: 1, key: 'saved:1', data: {cursor: 1}}}));
  const original = await store.compareAndSet(command, signal()); let current = original.snapshot;
  for (let sequence = 2; sequence <= 12; sequence++) {
    current = (await store.compareAndSet(next(current, workerAction(current.job, 'checkpoint', {checkpoint: {sequence, key: 'saved:' + sequence, data: {cursor: sequence}}})), signal())).snapshot;
  }
  await store.compareAndSet(next(current, workerAction(current.job)), signal());
  const batches = f.h.state.batches; f.h.state.now += 5_000; f.h.restart();
  assert.deepEqual(await f.store().compareAndSet(command, signal()), original);
  assert.equal(f.h.state.batches, batches);
  const changedAction = {...command, action: workerAction(claimed.job, 'renew', {leaseMs: 1_000})};
  assert.equal((await f.store().compareAndSet(changedAction, signal())).applied, false);
  assert.equal(f.h.state.batches, batches);
});

test('lost acknowledgement replays the same command after script restart without another revision', async () => {
  const f = fixture(), command = creation(f.job()); f.h.state.fault = number => number === 2 ? 'lost' : null;
  await assert.rejects(f.store().compareAndSet(command, signal()), code('outcome-unknown'));
  f.h.state.fault = null; f.h.restart();
  const replay = await f.store().compareAndSet(command, signal());
  assert.equal(replay.applied, true); assert.equal(replay.snapshot.revision, 1); assert.equal(f.h.state.batches, 2);
  const changedActor = f.store({actor: {id: 'worker:different'}});
  await assert.rejects(changedActor.compareAndSet(command, signal()), code('unavailable'));
  assert.equal(f.h.state.batches, 2);
});

test('unknown inflight mutation fences cold reads and runner performs no cleanup replacement', async () => {
  const f = fixture(), job = f.job(); await f.runner().enqueue(job);
  f.h.state.fault = number => number === 6 ? 'pending' : null;
  const result = await f.runner().run(job.id, async context => context.checkpoint({sequence: 1, key: 'pending', data: null}));
  assert.equal(result.status, 'unavailable'); assert.equal(f.h.state.batches, 6);
  f.h.state.fault = null; f.h.restart();
  await assert.rejects(f.store().load(job.id, signal()), code('outcome-unknown'));
  assert.equal(f.h.state.batches, 6);
  f.h.apply(f.h.state.pending); f.h.state.pending = null;
  assert.equal((await f.store().load(job.id, signal())).job.checkpoint.sequence, 1);
});

test('concurrent claims return one winner and read-authorized current state for the loser', async () => {
  const f = fixture(), store = f.store(), queued = (await store.compareAndSet(creation(f.job()), signal())).snapshot;
  const inputs = ['one', 'two'].map(owner => next(queued, {type: 'claim', owner, leaseMs: 1_000}, f.clock(), 'claim:' + owner));
  const results = await Promise.all(inputs.map(input => store.compareAndSet(input, signal())));
  assert.equal(results.filter(result => result.applied).length, 1);
  assert.equal(results.find(result => !result.applied).snapshot.revision, 2); assert.equal(f.h.state.batches, 4);
});

test('preflight denial makes no mutation read; guarded prior and conflict/current reads require permission', async () => {
  const f = fixture(), denied = f.store({authorize: () => false});
  await assert.rejects(denied.compareAndSet(creation(f.job()), signal()), code('unavailable'));
  assert.equal(f.h.state.reads.length, 0);
  const {queued, claimed} = await start(f), contexts = [];
  const scoped = f.store({authorize(context) { contexts.push(context); return context.operation === 'read' || context.current === null || context.current.lease?.owner === 'other'; }});
  await assert.rejects(scoped.compareAndSet(next(claimed, workerAction(claimed.job)), signal()), code('invalid-action'));
  assert.ok(contexts.some(context => context.current?.lease?.owner === 'worker:fixture'));
  const noRead = f.store({authorize: context => context.operation !== 'read'});
  await assert.rejects(noRead.compareAndSet(next(queued, {type: 'claim', owner: 'other', leaseMs: 1_000}, f.clock(), 'stale'), signal()), code('unavailable'));
  await assert.rejects(noRead.load(f.job().id, signal()), code('unavailable'));
  assert.equal(f.h.state.batches, 4);
});

test('tampered current or historical cells fail before jobs execute', async () => {
  for (const tamper of ['current', 'formula', 'history']) {
    const f = fixture(); await f.runner().enqueue(f.job()); const snapshot = f.h.snapshot();
    const location = tamper === 'history' ? snapshot.manifest.mutations[0].slice(7, 9) : snapshot.manifest.records[0].slice(1, 3);
    const [page, row] = location;
    f.h.state.sheets.get(f.h.layout.dataSheetId)[page * 8 + row][2] = tamper === 'formula'
      ? {userEnteredValue: {formulaValue: '="fake"'}, effectiveValue: {stringValue: 'fake'}} : f.h.literal('changed');
    await assert.rejects(f.store().load(f.job().id, signal()), code('unavailable'));
    let executed = 0; const result = await f.runner().run(f.job().id, async () => { executed++; });
    assert.equal(result.status, 'unavailable'); assert.equal(executed, 0); assert.equal(f.h.state.batches, 2);
  }
});

test('different domain intent cannot replay a receipt even when the resulting job payload is identical', async () => {
  const f = fixture(), store = f.store(), queued = (await store.compareAndSet(creation(f.job()), signal())).snapshot;
  const claimed = (await store.compareAndSet(next(queued, {type: 'claim', owner: 'worker:fixture', leaseMs: 5_000}), signal())).snapshot;
  f.h.state.now += 100;
  const first = next(claimed, workerAction(claimed.job, 'renew', {leaseMs: 1_000}), f.clock(), 'renew:stable');
  const changed = next(claimed, workerAction(claimed.job, 'renew', {leaseMs: 2_000}), f.clock(), 'renew:stable');
  assert.deepEqual(first.job, changed.job);
  assert.equal((await store.compareAndSet(first, signal())).applied, true);
  assert.equal((await store.compareAndSet(changed, signal())).applied, false);
  assert.equal(f.h.state.batches, 6);
});

test('stalled authorization and pre-abort stay bounded without any provider write', async () => {
  const f = fixture(), controller = new AbortController(); controller.abort();
  await assert.rejects(f.store().load(f.job().id, controller.signal), code('aborted'));
  await assert.rejects(f.store({timeoutMs: 15, authorize: async () => new Promise(() => {})}).compareAndSet(creation(f.job()), signal()), code('unavailable'));
  assert.equal(f.h.state.batches, 0); assert.equal(f.h.state.reads.length, 0);
});

test('mutate and conflict reconciliation share one absolute deadline', async t => {
  const f = fixture(), {claimed} = await start(f); let readingAfterConflict = false, readSignal, elapsed = 1_000;
  const monotonic = t.mock.method(performance, 'now', () => elapsed);
  const provider = {...f.provider,
    async commit() { elapsed += 150; readingAfterConflict = true; return {status: 'conflict'}; },
    async readManifest(options) {
      if (readingAfterConflict) { elapsed += 60; readSignal = options.signal; }
      return f.provider.readManifest(options);
    },
  };
  try {
    await assert.rejects(f.store({timeoutMs: 200}, provider).compareAndSet(next(claimed, workerAction(claimed.job)), signal()), code('unavailable'));
    assert.equal(readSignal.aborted, true); assert.equal(f.h.state.batches, 4);
  } finally { monotonic.mock.restore(); }
});

test('exception after a provider dispatch stays unknown even if it falsely carries a conflict code', async () => {
  const f = fixture(), command = creation(f.job());
  const provider = {...f.provider, async commit(plan, options) { await f.provider.commit(plan, options); throw new BoundedStoreError('conflict'); }};
  await assert.rejects(f.store({}, provider).compareAndSet(command, signal()), code('outcome-unknown'));
  assert.equal(f.h.state.batches, 2);
  assert.equal((await f.store().compareAndSet(command, signal())).snapshot.revision, 1);
  assert.equal(f.h.state.batches, 2);
});

test('abort after durable provider completion remains unknown and same-intent restart uses its original receipt', async () => {
  const f = fixture(), command = creation(f.job()), controller = new AbortController();
  const provider = {...f.provider, async commit(plan, options) {
    await f.provider.commit(plan, options); controller.abort(); return new Promise(() => {});
  }};
  await assert.rejects(f.store({}, provider).compareAndSet(command, controller.signal), code('outcome-unknown'));
  assert.equal(f.h.state.batches, 2); f.h.restart();
  assert.equal((await f.store().compareAndSet(command, signal())).snapshot.revision, 1);
  assert.equal(f.h.state.batches, 2);
});

test('trusted original-proof maps are cloned and shared expired deadlines cannot dispatch', async () => {
  const f = fixture(); let seen = 0;
  const core = createBoundedStore({layout: f.h.layout, now: () => new Date(f.clock()).toISOString(), policy: {
    authorize(context) {
      if (context.phase === 'guarded') { assert.equal(context.commitBefore, null); context.originalsByMutation.set('original', {bad: true}); }
      return true;
    },
    validate(context) { assert.equal(context.originalsByMutation.get('original'), null); seen++; return true; },
  }}, f.provider);
  const intent = {actor: {id: 'fixture'}, operationId: 'original', commands: [{recordId: 'fixture', mutationId: 'original', expectedRevision: 0, payload: {value: 1}, sourceUpdatedAt: null, archivedAt: null}]};
  await assert.rejects(core.mutate(intent, {deadline: performance.now() - 1}), code('unavailable'));
  assert.equal(f.h.state.batches, 0);
  assert.equal((await core.mutate(intent)).status, 'committed'); assert.equal(seen, 1);
});
