import assert from 'node:assert/strict';
import test from 'node:test';
import {createBoundedThrottleStore} from '../src/lib/google-workspace/bounded-throttle-store.ts';
import {BoundedStoreError, buildBoundedState, readBoundedRecords, auditBoundedState} from '../src/lib/google-workspace/bounded-store.ts';
import {planRecordMutation} from '../src/lib/google-workspace/record-codec.ts';
import {stableRecordId} from '../tools/google-workspace/migration.mjs';
import {boundedGatewayHarness, boundedFixtureLayout} from './helpers/google-workspace-bounded-harness.mjs';

// Synthetic LOCAL emulator evidence only. The harness executes the exact saved
// Apps Script and rejects real network calls; no Google acceptance is claimed.
const actorId = 'local-auth-service', key = 'isolated-login-key';
const sourceTable = {sourceTable: 'rivya_studio_login_limits', primaryKey: ['key']};
const idFor = value => stableRecordId(sourceTable, {key: value});
const now = '2026-10-28T12:00:00.000Z', resetAt = '2026-10-28T12:15:00.000Z';
const request = (h, extra = {}) => ({key, limit: 1, windowMinutes: 15, now: new Date(h.state.now).toISOString(), ...extra});
const client = (h, provider = h.provider, config = {}) => createBoundedThrottleStore({layout: h.layout, actorId, clock: () => h.state.now, ...config}, provider);
const unavailable = error => error?.code === 'THROTTLE_UNAVAILABLE';
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
function value(h, recordId = idFor(key)) {
  const state = h.snapshot();
  return readBoundedRecords(h.layout, state, [recordId]).get(recordId);
}
function seeded({payload = {key, attempts: 1, reset_at: resetAt}, sourceUpdatedAt = null, archivedAt = null, revisions = 1} = {}) {
  const plans = []; let current = null;
  for (let revision = 0; revision < revisions; revision++) {
    const plan = planRecordMutation({current, previousMutation: null, command: {recordId: idFor(key), expectedRevision: revision,
      mutationId: 'fixture-throttle-' + revision, payload, sourceUpdatedAt, archivedAt}, actor: {id: actorId}, now, authorize: () => true});
    plans.push(plan); current = plan.record;
  }
  return boundedGatewayHarness(buildBoundedState({layout: boundedFixtureLayout, epoch: 'local-throttle-fixture', plans}));
}

test('independent bounded callers share the source ID and only one consumes limit one at a real script CAS race', async () => {
  const h = boundedGatewayHarness(), prepared = []; let arrivals = 0, release;
  const barrier = new Promise(resolve => { release = resolve; });
  const independentProvider = () => ({...h.provider, async commit(commit, options) {
    prepared.push(commit); if (++arrivals === 2) release(); await barrier;
    return h.provider.commit(commit, options);
  }});
  const outcomes = await Promise.all([client(h, independentProvider()).consumeLoginAttempt(request(h)), client(h, independentProvider()).consumeLoginAttempt(request(h))]);
  assert.deepEqual(outcomes.slice().sort(), [false, true]);
  assert.equal(prepared.length, 2); assert.equal(h.state.batches, 2);
  assert.equal(value(h).recordId, idFor(key)); assert.equal(value(h).payload.attempts, 1);
  assert.equal(h.snapshot().manifest.records.length, 1); assert.equal(h.snapshot().manifest.mutations.length, 1);
  assert.equal(prepared[0].expected.revision, 0); assert.equal(prepared[1].expected.revision, 0);
  assert.equal(prepared[0].commitBefore, Date.parse(resetAt));
  auditBoundedState(h.layout, h.snapshot());
});

test('expiry, independent keys and a cold script restart use durable records and retain history', async () => {
  const h = boundedGatewayHarness();
  assert.equal(await client(h).consumeLoginAttempt(request(h, {limit: 2})), true);
  assert.equal(await client(h).consumeLoginAttempt(request(h, {limit: 2})), true);
  h.restart(); assert.equal(await client(h).consumeLoginAttempt(request(h, {limit: 2})), false);
  assert.equal(value(h).payload.attempts, 2);
  assert.equal(await client(h).consumeLoginAttempt(request(h, {key: key + '-other'})), true);
  assert.equal(value(h, idFor(key + '-other')).payload.attempts, 1);
  h.state.now = Date.parse(resetAt);
  assert.equal(await client(h).consumeLoginAttempt(request(h)), true);
  assert.equal(value(h).payload.attempts, 1); assert.equal(value(h).payload.reset_at, '2026-10-28T12:30:00.000Z');
  assert.equal(value(h).revision, 3); assert.equal(h.snapshot().manifest.mutations.length, 4);
  auditBoundedState(h.layout, h.snapshot());
});

test('a changed guarded record is reloaded before admission, without retrying a rejected policy', async () => {
  const h = boundedGatewayHarness(); let reads = 0, intervened = false;
  const provider = {...h.provider, async readManifest(options) {
    if (++reads === 2 && !intervened) {
      intervened = true;
      assert.equal(await client(h).consumeLoginAttempt(request(h)), true);
    }
    return h.provider.readManifest(options);
  }};
  assert.equal(await client(h, provider).consumeLoginAttempt(request(h)), false);
  assert.equal(h.state.batches, 2); assert.equal(value(h).payload.attempts, 1);
});

test('invalid inputs and malformed authoritative payloads or record metadata fail closed without writes', async () => {
  const h = boundedGatewayHarness();
  for (const extra of [{key: ''}, {key: 'x'.repeat(241)}, {limit: 0}, {limit: 1.5}, {limit: 1001}, {windowMinutes: 0}, {windowMinutes: 1441}, {now: 'invalid'}, {now: '2026-10-28T11:00:00Z'}, {unexpected: true}]) {
    await assert.rejects(client(h).consumeLoginAttempt(request(h, extra)), unavailable);
  }
  assert.equal(h.state.reads.length, 0);
  const bad = [
    {payload: {key: 'another-key', attempts: 1, reset_at: resetAt}},
    {payload: {key, attempts: -1, reset_at: resetAt}},
    {payload: {key, attempts: 1.5, reset_at: resetAt}},
    {payload: {key, attempts: 1, reset_at: 'invalid'}},
    {payload: {key, attempts: 1, reset_at: resetAt, extra: true}},
    {sourceUpdatedAt: now}, {archivedAt: now},
  ];
  for (const record of bad) {
    const fixture = seeded(record);
    await assert.rejects(client(fixture).consumeLoginAttempt(request(fixture, {limit: 5})), unavailable);
    assert.equal(fixture.state.batches, 0);
  }
  assert.throws(() => client(h, h.provider, {timeoutMs: 30001}), /INVALID_THROTTLE/);
  assert.throws(() => client(h, h.provider, {actorId: 'invalid actor'}), /INVALID_THROTTLE/);
  for (const invalidClock of [NaN, -1, Infinity]) await assert.rejects(client(h, h.provider, {clock: () => invalidClock}).consumeLoginAttempt(request(h)), unavailable);
});

test('only an explicit no-write conflict retries, and the retry keeps the source-derived record ID', async () => {
  const h = boundedGatewayHarness(), commits = [];
  const provider = {...h.provider, async commit(prepared, options) {
    commits.push(prepared);
    return commits.length === 1 ? {status: 'conflict'} : h.provider.commit(prepared, options);
  }};
  assert.equal(await client(h, provider).consumeLoginAttempt(request(h)), true);
  assert.equal(commits.length, 2); assert.notEqual(commits[0].operationId, commits[1].operationId);
  assert.equal(commits[0].manifest.records[0][0], idFor(key)); assert.equal(commits[1].manifest.records[0][0], idFor(key));
  assert.equal(value(h).payload.attempts, 1);
  let refused = 0;
  const blocked = {...h.provider, async readManifest() { refused++; throw new BoundedStoreError('policy-rejected'); }};
  await assert.rejects(client(h, blocked).consumeLoginAttempt(request(h)), unavailable); assert.equal(refused, 1);
});

test('repeated explicit conflicts exhaust four attempts without local admission', async () => {
  const h = boundedGatewayHarness(); let commits = 0;
  const provider = {...h.provider, async commit() { commits++; return {status: 'conflict'}; }};
  await assert.rejects(client(h, provider).consumeLoginAttempt(request(h)), unavailable);
  assert.equal(commits, 4); assert.equal(h.state.batches, 0);
});

test('a lost committed response denies admission and does not consume another mutation', async () => {
  const h = boundedGatewayHarness(); h.state.fault = n => n === 2 ? 'lost' : null;
  await assert.rejects(client(h).consumeLoginAttempt(request(h)), unavailable);
  assert.equal(h.state.batches, 2); assert.equal(value(h).payload.attempts, 1);
  h.state.fault = null; h.restart();
  assert.equal(await client(h).consumeLoginAttempt(request(h)), false);
  assert.equal(h.snapshot().manifest.mutations.length, 1);
});

test('any commit exception, including a misleading conflict after dispatch, has an unknown outcome and is not retried', async () => {
  const h = boundedGatewayHarness(); let commits = 0;
  const provider = {...h.provider, async commit(prepared, options) {
    commits++; await h.provider.commit(prepared, options); throw new BoundedStoreError('conflict');
  }};
  await assert.rejects(client(h, provider).consumeLoginAttempt(request(h, {limit: 5})), unavailable);
  assert.equal(commits, 1); assert.equal(value(h).payload.attempts, 1);
});

test('an unresolved in-flight commit fences future callers and never falls back to local authority', async () => {
  const h = boundedGatewayHarness(); h.state.fault = n => n === 2 ? 'pending' : null;
  await assert.rejects(client(h).consumeLoginAttempt(request(h)), unavailable);
  assert.equal(h.snapshot().root.state, 'inflight'); assert.equal(h.state.batches, 2);
  h.state.fault = null; h.restart();
  await assert.rejects(client(h).consumeLoginAttempt(request(h)), unavailable);
  assert.equal(h.state.batches, 2);
});

test('the expiry fence rejects the old window before a safe retry consumes the new window', async () => {
  const h = seeded({payload: {key, attempts: 1, reset_at: '2026-10-28T12:00:01.000Z'}});
  let commits = 0;
  const provider = {...h.provider, async commit(prepared, options) {
    commits++;
    if (commits === 1) {
      assert.equal(prepared.commitBefore, h.state.now + 1000); h.state.now += 1000;
      const outcome = await h.provider.commit(prepared, options);
      assert.equal(outcome.status, 'conflict'); assert.equal(h.state.batches, 0);
      return outcome;
    }
    return h.provider.commit(prepared, options);
  }};
  assert.equal(await client(h, provider).consumeLoginAttempt(request(h, {limit: 2})), true);
  assert.equal(commits, 2); assert.equal(h.state.batches, 2); assert.equal(value(h).payload.attempts, 1);
  assert.equal(value(h).payload.reset_at, '2026-10-28T12:15:01.000Z');
  assert.equal(h.snapshot().manifest.mutations.length, 2);
});

test('initial read and CAS preparation share one total deadline instead of resetting it per store call', async t => {
  const h = boundedGatewayHarness(); let reads = 0, commits = 0, elapsed = 0;
  // Measure both phases deterministically: a busy test worker can oversleep a
  // real 70 ms delay and expire before the second phase is reached at all.
  t.mock.method(performance, 'now', () => elapsed);
  const provider = {...h.provider, async readManifest(options) { reads++; elapsed += 70; return h.provider.readManifest(options); }, async commit() { commits++; return {status: 'committed'}; }};
  await assert.rejects(client(h, provider, {timeoutMs: 110}).consumeLoginAttempt(request(h)), unavailable);
  assert.equal(reads, 2); assert.equal(elapsed, 140); assert.equal(commits, 0); assert.equal(h.state.batches, 0);
});

test('conflict retries retain the same total deadline', async () => {
  const h = boundedGatewayHarness(); let reads = 0, commits = 0;
  const provider = {...h.provider, async readManifest(options) { if (++reads === 3) await delay(70); return h.provider.readManifest(options); }, async commit() { commits++; await delay(70); return {status: 'conflict'}; }};
  await assert.rejects(client(h, provider, {timeoutMs: 110}).consumeLoginAttempt(request(h)), unavailable);
  assert.equal(commits, 1); assert.equal(h.state.batches, 0);
});

test('a synchronous stall expires monotonically before dispatch even if the abort timer has not run', async () => {
  const h = boundedGatewayHarness(); let commits = 0;
  const provider = {...h.provider, async readManifest(options) { const until = performance.now() + 40; while (performance.now() < until) { /* emulate blocking provider decoding */ } return h.provider.readManifest(options); }, async commit() { commits++; return {status: 'committed'}; }};
  await assert.rejects(client(h, provider, {timeoutMs: 20}).consumeLoginAttempt(request(h)), unavailable);
  assert.equal(commits, 0); assert.equal(h.state.batches, 0);
});

test('a stalled post-dispatch result fails closed within the shared deadline without a second write', async () => {
  const h = boundedGatewayHarness(); let commits = 0;
  const provider = {...h.provider, async commit(prepared, options) { commits++; await h.provider.commit(prepared, options); return new Promise(() => {}); }};
  await assert.rejects(client(h, provider, {timeoutMs: 100}).consumeLoginAttempt(request(h)), unavailable);
  assert.equal(commits, 1); assert.equal(value(h).payload.attempts, 1);
});

test('a limiter reads bounded proof pages after 160 retained mutations and never reassembles full history', async () => {
  const h = seeded({revisions: 160});
  const oldPages = h.snapshot().manifest.pages.length;
  assert.equal(await client(h).consumeLoginAttempt(request(h, {limit: 1000})), true);
  const dataReads = h.state.reads.filter(read => read.sheetId === h.layout.dataSheetId);
  assert.ok(dataReads.every(read => read.rows === 8 && read.columns <= 7));
  assert.ok(new Set(dataReads.map(read => read.startRow)).size < oldPages / 2);
  assert.equal(h.snapshot().manifest.mutations.length, 161); assert.equal(value(h).payload.attempts, 2);
  auditBoundedState(h.layout, h.snapshot());
});
