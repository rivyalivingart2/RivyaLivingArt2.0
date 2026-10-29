import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planSecurityLookupProjection, securitySourceRecordId, securityLookupKey,
  securityLookupClaimId, securityLookupHash} from '../src/lib/google-workspace/security-lookup-projection.ts';
import {createBoundedSecurityLookupReader} from '../src/lib/google-workspace/bounded-security-lookup.ts';
import {buildBoundedState, boundedCursor, createBoundedStore} from '../src/lib/google-workspace/bounded-store.ts';
import {makeRecord, planRecordMutation} from '../src/lib/google-workspace/record-codec.ts';
import {boundedGatewayHarness, boundedFixtureLayout} from './helpers/google-workspace-bounded-harness.mjs';

// Synthetic local fixtures only. Coverage below is an emulator registration,
// never an assertion about source completeness or a provisioned Google index.
const schema = JSON.parse(readFileSync(new URL('../src/lib/google-workspace/schema.json', import.meta.url), 'utf8'));
const layout = {...boundedFixtureLayout, key: 'security'};
const now = '2026-10-28T12:00:00.000Z', actor = {id: 'security:local-lookup-test'};
const code = expected => error => error?.code === expected;
const uuid = number => '00000000-0000-0000-0000-' + String(number).padStart(12, '0');
const copy = value => structuredClone(value);
function staff(number = 1, overrides = {}) {
  return {id: uuid(number), login: 'Editor' + number, name: 'Synthetic editor ' + number,
    password_hash: 'a'.repeat(32) + ':' + 'b'.repeat(128), role: 'editor', active: true,
    version: 1, created_at: now, ...overrides};
}
function request(number = 101, overrides = {}) {
  return {id: uuid(number), kind: 'access', login: 'Applicant' + number, name: 'Synthetic request',
    contact: 'fixture@example.invalid', status: 'pending', staff_id: null, token_hash: null,
    credential_version: null, expires_at: null, created_at: now, updated_at: now,
    decided_by: null, version: 1, ...overrides};
}
function source(staffRows = [staff()], requestRows = []) {
  return {rivya_staff: staffRows, rivya_access_requests: requestRows};
}
const project = (rows, changes = {}) => planSecurityLookupProjection({schema, source: rows,
  layout, coverageId: 'local-coverage-fixture', ...changes});
function creation(record) {
  return planRecordMutation({current: null, previousMutation: null, actor, now, authorize: () => true,
    command: {recordId: record.recordId, expectedRevision: 0, mutationId: record.lastMutationId,
      payload: record.payload, sourceUpdatedAt: record.sourceUpdatedAt, archivedAt: record.archivedAt}});
}
function fixture(rows = source(), transform = value => value) {
  const projection = project(rows), records = [];
  for (const [table, values] of Object.entries(rows)) for (const row of values) {
    const recordId = securitySourceRecordId(table, row.id);
    records.push(makeRecord({recordId, revision: 1, payload: row, sourceUpdatedAt: row.updated_at ?? row.created_at,
      archivedAt: null, lastMutationId: 'source:' + securityLookupHash([table, row.id])}));
  }
  const planned = transform([...records, ...projection.claims, projection.marker]);
  const state = buildBoundedState({layout, epoch: 'local-security-lookup-epoch', plans: planned.map(creation)});
  const h = boundedGatewayHarness(state, layout);
  const coverage = {format: 'rivya-security-lookup-coverage-v1', ...projection.coverageProposal, root: boundedCursor(state.root)};
  const reader = (extra = {}, provider = h.provider) => createBoundedSecurityLookupReader({layout, coverage,
    actor, authorize: () => true, ...extra}, provider);
  const mutate = async (recordId, payload, mutationId = 'local:source-update', sourceUpdatedAt = now) => {
    const store = createBoundedStore({layout, policy: {authorize: () => true, validate: () => true}, now: () => now}, h.provider);
    const current = await store.load(recordId, actor);
    const result = await store.mutate({actor, operationId: mutationId,
      commands: [{recordId, expectedRevision: current?.revision ?? 0, mutationId,
        payload, sourceUpdatedAt, archivedAt: null}]});
    assert.equal(result.status, 'committed');
  };
  return {projection, records, h, coverage, reader, mutate};
}

test('pure projection reserves all staff, expired open requests and every non-null token without duplicating credentials', () => {
  const rows = source([staff(1, {active: false})], [
    request(101, {status: 'approved', staff_id: uuid(1), token_hash: 'a'.repeat(64), expires_at: '2020-01-01T00:00:00.000Z'}),
    request(102, {status: 'completed', token_hash: 'b'.repeat(64)}),
    request(103, {status: 'rejected', token_hash: 'c'.repeat(64)}),
  ]), before = copy(rows), plan = project(rows);
  assert.deepEqual(rows, before);
  assert.deepEqual(plan.report.sourceCounts, {staff: 1, requests: 3});
  assert.deepEqual(plan.report.claimCounts, {staffLogin: 1, openRequest: 1, accessToken: 3});
  assert.equal(plan.claims.length, 5);
  assert.equal(plan.report.installed, false); assert.equal(plan.report.providerVerified, false);
  assert.equal(plan.report.canonicalWritten, false); assert.equal(plan.report.liveSourceCompletenessVerified, false);
  assert.equal(plan.report.atomicIndexMaintenanceImplemented, false);
  assert.equal(Object.hasOwn(plan.coverageProposal, 'root'), false);
  for (const record of plan.claims) {
    assert.deepEqual(Object.keys(record.payload).sort(), ['coverageId', 'format', 'keySha256', 'kind', 'normalization', 'sourceId', 'sourceRecordId', 'sourceTable'].sort());
    assert.equal(record.payload.sourceRecordId, securitySourceRecordId(record.payload.sourceTable, record.payload.sourceId));
    assert.equal(JSON.stringify(record).includes(rows.rivya_staff[0].password_hash), false);
    assert.equal(JSON.stringify(record).includes('Synthetic'), false);
  }
  const reordered = project(source([...rows.rivya_staff].reverse(), [...rows.rivya_access_requests].reverse()));
  assert.deepEqual(reordered.marker, plan.marker); assert.deepEqual(reordered.claims, plan.claims);
});

test('planner requires both complete supplied arrays and exact supported table schemas', () => {
  assert.throws(() => project({rivya_staff: []}), code('unsupported-source'));
  assert.throws(() => project(source(), {schema: {tables: []}}), code('unsupported-source'));
  const drift = copy(schema); drift.tables.find(table => table.sourceTable === 'rivya_staff').unrecognized = true;
  assert.throws(() => project(source(), {schema: drift}), code('unsupported-source'));
  const duplicate = copy(schema); duplicate.tables.push(copy(duplicate.tables.find(table => table.sourceTable === 'rivya_staff')));
  assert.throws(() => project(source(), {schema: duplicate}), code('unsupported-source'));
  const empty = project(source([], []));
  assert.equal(empty.claims.length, 0); assert.equal(empty.report.liveSourceCompletenessVerified, false);
});

test('planner rejects duplicate IDs and SQL uniqueness violations, while request kinds retain distinct open keys', () => {
  assert.throws(() => project(source([staff(), staff()])), code('duplicate-key'));
  assert.throws(() => project(source([staff(1), staff(2, {login: 'EDITOR1', active: false})])), code('duplicate-key'));
  assert.throws(() => project(source([], [request(), request()])), code('duplicate-key'));
  assert.throws(() => project(source([], [request(101), request(102, {login: 'APPLICANT101', status: 'approved'})])), code('duplicate-key'));
  assert.throws(() => project(source([], [request(101, {token_hash: 'a'.repeat(64)}),
    request(102, {status: 'rejected', token_hash: 'a'.repeat(64)})])), code('duplicate-key'));
  const plan = project(source([], [request(101), request(102, {login: 'APPLICANT101', kind: 'recovery'})]));
  assert.equal(plan.report.claimCounts.openRequest, 2);
});

test('planner preserves source identity and rejects unsupported normalization, source shape and dangling staff relations', () => {
  assert.throws(() => project(source([staff(1, {login: 'Éditor'})])), code('unsupported-source'));
  assert.throws(() => project(source([staff(1, {login: ' Editor1 '})])), code('unsupported-source'));
  assert.throws(() => project(source([staff(1, {updated_at: now})])), code('unsupported-source'));
  assert.throws(() => project(source([], [request(101, {staff_id: uuid(1)})])), code('broken-reference'));
  assert.throws(() => project(source([], [request(101, {status: 'redeemed'})])), code('unsupported-source'));
  const plan = project(source([staff(1, {login: 'EDITOR1'})]));
  assert.equal(plan.claims[0].payload.sourceId, uuid(1));
  assert.equal(plan.claims[0].payload.keySha256, securityLookupKey('staff-login', 'editor1'));
});

test('exact-script reads return current source proofs, never claim authority; reads remain bounded and perform no writes', async () => {
  const rows = source([staff(1, {active: false})], [request(101, {status: 'approved', staff_id: uuid(1), token_hash: 'a'.repeat(64),
    expires_at: '2020-01-01T00:00:00.000Z'}), request(102, {status: 'completed', token_hash: 'b'.repeat(64)})]);
  const f = fixture(rows), contexts = [];
  const reader = f.reader({authorize: context => {contexts.push(copy(context)); return true;}});
  assert.deepEqual((await reader.lookupStaff('  EDITOR1  ')).payload, rows.rivya_staff[0]);
  assert.deepEqual((await reader.lookupOpenRequest('access', 'applicant101')).payload, rows.rivya_access_requests[0]);
  assert.deepEqual((await reader.lookupAccessToken('b'.repeat(64))).payload, rows.rivya_access_requests[1]);
  assert.equal(await reader.lookupStaff('absent'), null);
  assert.equal(await reader.lookupOpenRequest('recovery', 'applicant101'), null);
  assert.equal(f.h.state.batches, 0);
  assert.equal(contexts.length, 10);
  assert.ok(contexts.filter(context => context.phase === 'preflight').every(context => context.source === null && context.marker === null));
  assert.ok(contexts.filter(context => context.phase === 'guarded').every(context => context.marker !== null));
  assert.ok(f.h.state.reads.filter(read => read.sheetId === layout.dataSheetId).every(read => read.rows === 8 && read.columns === 7));
  f.h.restart();
  assert.deepEqual((await f.reader().lookupStaff('editor1')).payload, rows.rivya_staff[0]);
});

test('missing claims require exact registered coverage and proven marker; a planner proposal is not installed coverage', async () => {
  const f = fixture();
  assert.throws(() => f.reader({coverage: f.projection.coverageProposal}), code('coverage-unverified'));
  assert.throws(() => f.reader({coverage: {...f.coverage, ready: true}}), code('coverage-unverified'));
  await assert.rejects(f.reader({coverage: {...f.coverage, markerPayloadSha256: 'a'.repeat(64)}}).lookupStaff('absent'), code('coverage-unverified'));
  await assert.rejects(f.reader({coverage: {...f.coverage, markerRecordId: 'security-lookup:coverage:' + 'a'.repeat(64)}}).lookupStaff('absent'), code('coverage-unverified'));
  await assert.rejects(f.reader({coverage: {...f.coverage, root: {...f.coverage.root, revision: 1}}}).lookupStaff('absent'), code('coverage-unverified'));
  assert.equal(f.h.state.batches, 0);
});

test('any root change invalidates registered coverage, including a new source record with no claim', async () => {
  const f = fixture(), reader = f.reader();
  const added = staff(2);
  await f.mutate(securitySourceRecordId('rivya_staff', added.id), added);
  await assert.rejects(reader.lookupStaff('editor1'), code('coverage-unverified'));
  await assert.rejects(reader.lookupStaff('editor2'), code('coverage-unverified'));
  const second = fixture(), before = second.reader();
  await second.mutate('unrelated:session', {tokenHash: 'a'.repeat(64)}, 'local:unrelated', null);
  await assert.rejects(before.lookupStaff('absent'), code('coverage-unverified'));
});

test('claim-only tampering cannot select a different source login or approve a closed request', async () => {
  const f = fixture(source([staff(1), staff(2)]), records => records.map(record => {
    if (record.recordId !== securityLookupClaimId('staff-login', securityLookupKey('staff-login', 'editor1'))) return record;
    const changed = {...record}; delete changed.payloadSha256;
    return makeRecord({...changed, payload: {...record.payload, sourceId: uuid(2), sourceRecordId: securitySourceRecordId('rivya_staff', uuid(2))}});
  }));
  await assert.rejects(f.reader().lookupStaff('editor1'), code('integrity'));
  const closed = fixture(source([], [request(101)]), records => records.map(record => {
    if (record.recordId !== securitySourceRecordId('rivya_access_requests', uuid(101))) return record;
    const changed = {...record}; delete changed.payloadSha256;
    return makeRecord({...changed, payload: {...record.payload, status: 'completed'}});
  }));
  await assert.rejects(closed.reader().lookupOpenRequest('access', 'applicant101'), code('integrity'));
});

test('provider cannot replace the private root or requested IDs during an awaited page read', async () => {
  const f = fixture(), original = f.records[0]; let replaced = false;
  const provider = {...f.h.provider, async readPages(base, ids, options) {
    if (!replaced) {
      replaced = true;
      await f.mutate(original.recordId, {...original.payload, role: 'admin'});
      const fresh = await f.h.provider.readManifest(options);
      base.root = fresh.root; base.manifest = fresh.manifest;
    }
    return f.h.provider.readPages(base, ids, options);
  }};
  await assert.rejects(f.reader({}, provider).lookupStaff('editor1'));
  assert.equal(replaced, true);
  const second = fixture();
  const idsProvider = {...second.h.provider, async readPages(base, ids, options) {
    const pages = await second.h.provider.readPages(base, ids, options); ids.splice(0, ids.length); return pages;
  }};
  assert.equal((await second.reader({}, idsProvider).lookupStaff('editor1')).payload.role, 'editor');
});

test('malformed, omitted or duplicate provider pages cannot satisfy the proof', async () => {
  for (const transform of [pages => pages.slice(1), pages => [pages[0], ...pages.slice(1).map(() => pages[0])],
    pages => [...pages, pages[0]]]) {
    const f = fixture(), provider = {...f.h.provider, async readPages(base, ids, options) {
      return transform(await f.h.provider.readPages(base, ids, options));
    }};
    await assert.rejects(f.reader({}, provider).lookupStaff('editor1'), code('integrity'));
    assert.equal(f.h.state.batches, 0);
  }
});

test('mandatory authorization runs before reads and against detached proven source before return', async () => {
  const f = fixture();
  assert.throws(() => f.reader({authorize: undefined}), code('configuration'));
  await assert.rejects(f.reader({authorize: () => false}).lookupStaff('editor1'), code('unauthorized'));
  assert.equal(f.h.state.reads.length, 0);
  await assert.rejects(f.reader({authorize: context => context.phase !== 'guarded'}).lookupStaff('editor1'), code('unauthorized'));
  const reader = f.reader({authorize: context => {
    context.actor.id = 'injected';
    if (context.source) context.source.payload.role = 'admin';
    if (context.marker) context.marker.payload.coverageId = 'injected';
    return true;
  }});
  assert.equal((await reader.lookupStaff('editor1')).payload.role, 'editor');
  assert.equal(f.h.state.batches, 0);
});

test('one monotonic deadline bounds stalled policies, source reads, synchronous policy work and caller cancellation', async () => {
  const f = fixture();
  await assert.rejects(f.reader({timeoutMs: 20, authorize: () => new Promise(() => {})}).lookupStaff('editor1'), code('unavailable'));
  assert.equal(f.h.state.reads.length, 0);
  await assert.rejects(f.reader().lookupStaff('editor1', {deadline: performance.now() - 1}), code('unavailable'));
  const cancelled = new AbortController(); cancelled.abort();
  await assert.rejects(f.reader().lookupStaff('editor1', {signal: cancelled.signal}), code('unavailable'));
  const blocked = f.reader({timeoutMs: 20, authorize: () => {const end = performance.now() + 35; while (performance.now() < end) {} return true;}});
  await assert.rejects(blocked.lookupStaff('editor1'), code('unavailable'));
  assert.equal(f.h.state.reads.length, 0);
  const provider = {...f.h.provider, readPages: async () => new Promise(() => {})};
  await assert.rejects(f.reader({timeoutMs: 20}, provider).lookupStaff('editor1'), code('unavailable'));
  assert.equal(f.h.state.batches, 0);
});
