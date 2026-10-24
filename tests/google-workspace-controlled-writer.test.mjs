import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {canonicalJson, digestPayload, decodeRecord} from '../src/lib/google-workspace/record-codec.ts';
import {createControlledWriter, prepareControlledMutation, normalizeWriterSnapshot} from '../src/lib/google-workspace/controlled-writer.ts';
import {createTestWriterProvider, writerFixtureResource as resource, literalCell} from './helpers/google-workspace-writer-provider.mjs';

const now = '2026-10-24T12:00:00.000Z';
const command = (overrides = {}) => ({recordId: 'newsletter:0007', expectedRevision: 0, mutationId: 'mutation:0001', payload: {email: '=literal@example.invalid', source: 'footer', originalVersion: '00019'}, sourceUpdatedAt: now, archivedAt: null, ...overrides});
const request = (overrides = {}) => ({resourceKey: resource.key, actor: {id: 'synthetic-owner'}, command: command(), ...overrides});
const policy = {
  authorize: ({actor}) => actor.id === 'synthetic-owner',
  validate: ({command, sheets}) => typeof command.payload.email === 'string' && command.payload.email.endsWith('@example.invalid') && sheets.get(15).slice(1).some(row => row[0] === command.payload.source && row[1] === 'true'),
};
const setup = (options = {}) => {
  const provider = options.provider ?? createTestWriterProvider();
  const writer = createControlledWriter({resources: [resource], policies: {[resource.key]: options.policy ?? policy}, limits: options.limits}, {...provider, now: options.now ?? (() => now)});
  return {provider, writer};
};
const code = expected => error => error?.code === expected;

test('complete controlled mutation creates literal record, durable receipt, audit and full history together', async () => {
  const {provider, writer} = setup(); const result = await writer.mutate(request());
  assert.equal(result.status, 'committed'); assert.equal(result.receipt.revision, 1); assert.equal(provider.calls.applied, 1);
  for (const id of [11, 12, 13, 14]) assert.equal(provider.rows(id).length, 2);
  const record = decodeRecord(provider.rows(11)[1]); assert.equal(record.payload.originalVersion, '00019'); assert.equal(record.payload.email, '=literal@example.invalid');
  assert.deepEqual(provider.rows(14)[1], provider.rows(11)[1]);
  const refresh = setup({provider}).writer;
  assert.deepEqual(await refresh.mutate(request()), {status: 'replay', receipt: result.receipt}); assert.equal(provider.calls.applied, 1);
});

test('prepared protocol guards all canonical and relationship sheets and uses only four fixed UpdateCells requests', async () => {
  const provider = createTestWriterProvider();
  const result = await prepareControlledMutation({resource, snapshot: provider.snapshot(), ...request(), now, policy});
  assert.equal(result.kind, 'commit'); const prepared = result.prepared;
  assert.deepEqual(prepared.guards.map(g => g.sheetId), [11, 12, 13, 14, 15]); assert.equal(prepared.commitBefore, null);
  for (const guard of prepared.guards) assert.equal(guard.sha256, createHash('sha256').update(JSON.stringify(provider.rows(guard.sheetId))).digest('hex'));
  assert.equal(prepared.batch.requests.length, 4);
  for (const entry of prepared.batch.requests) {
    assert.deepEqual(Object.keys(entry), ['updateCells']); assert.equal(entry.updateCells.start.rowIndex, 1); assert.equal(entry.updateCells.fields, 'userEnteredValue');
    for (const cell of entry.updateCells.rows[0].values) assert.deepEqual(Object.keys(cell.userEnteredValue), ['stringValue']);
  }
});

test('unauthorized caller, browser role claims and unknown resources never reach the provider', async () => {
  const {provider, writer} = setup();
  await assert.rejects(writer.mutate(request({actor: {id: 'browser', role: 'admin'}})), code('unauthorized'));
  await assert.rejects(writer.mutate(request({actor: {id: 'not-authorized'}})), code('unauthorized'));
  await assert.rejects(writer.mutate(request({resourceKey: 'unregistered'})), code('not-registered'));
  await assert.rejects(writer.mutate({...request(), workbookId: 'arbitrary'}), code('not-registered'));
  assert.deepEqual(provider.calls, {reads: 0, commits: 0, applied: 0, conflicts: 0});
});

test('trusted policy rejects broken relationships and all relationship reads are guarded against intervening edits', async () => {
  const {provider, writer} = setup();
  await assert.rejects(writer.mutate(request({command: command({payload: {email: 'sample@example.invalid', source: 'missing'}})})), code('policy-rejected'));
  provider.faults.beforeCommit = () => provider.editCell(15, 1, 1, 'false');
  await assert.rejects(writer.mutate(request()), code('policy-rejected'));
  assert.equal(provider.calls.conflicts, 1); assert.equal(provider.calls.applied, 0); assert.equal(provider.rows(11).length, 1);
});

test('two writer instances racing the same revision cannot lose an update', async () => {
  const {provider, writer} = setup(); await writer.mutate(request());
  const other = setup({provider}).writer;
  const results = await Promise.allSettled([
    writer.mutate(request({command: command({expectedRevision: 1, mutationId: 'mutation:a', payload: {email: 'a@example.invalid', source: 'footer'}})})),
    other.mutate(request({command: command({expectedRevision: 1, mutationId: 'mutation:b', payload: {email: 'b@example.invalid', source: 'journal'}})})),
  ]);
  assert.equal(results.filter(r => r.status === 'fulfilled').length, 1); assert.equal(results.filter(r => r.status === 'rejected' && r.reason.code === 'REVISION_CONFLICT').length, 1);
  assert.equal(decodeRecord(provider.rows(11)[1]).revision, 2); assert.equal(provider.rows(14).length, 3); assert.equal(provider.calls.applied, 2);
});

test('simultaneous identical submissions apply once and the other returns its durable receipt', async () => {
  const {provider, writer} = setup(), other = setup({provider}).writer;
  const values = await Promise.all([writer.mutate(request()), other.mutate(request())]);
  assert.deepEqual(values.map(v => v.status).sort(), ['committed', 'replay']); assert.deepEqual(values[0].receipt, values[1].receipt);
  assert.equal(provider.calls.applied, 1); for (const id of [11, 12, 13, 14]) assert.equal(provider.rows(id).length, 2);
});

test('response loss is unknown, then same mutation recovers without another commit or duplicate rows', async () => {
  const {provider, writer} = setup(); provider.faults.loseResponseOnce = true;
  await assert.rejects(writer.mutate(request()), code('outcome-unknown'));
  assert.equal(provider.calls.commits, 1); assert.equal(provider.calls.applied, 1);
  const result = await writer.mutate(request()); assert.equal(result.status, 'replay'); assert.equal(provider.calls.commits, 1);
  await assert.rejects(writer.mutate(request({command: command({payload: {email: 'changed@example.invalid', source: 'footer'}})})), code('IDEMPOTENCY_CONFLICT'));
});

test('trusted policy can distinguish a verified replay from a new transition without losing authorization', async () => {
  const validations = [];
  const transitionPolicy = {
    authorize: policy.authorize,
    validate: context => {
      validations.push({replay: context.replay, revision: context.current?.revision ?? 0});
      return context.replay || context.command.expectedRevision === (context.current?.revision ?? 0);
    },
  };
  const {provider, writer} = setup({policy: transitionPolicy});
  const original = await writer.mutate(request());
  await writer.mutate(request({command: command({expectedRevision: 1, mutationId: 'mutation:advanced'})}));
  assert.deepEqual(await writer.mutate(request()), {status: 'replay', receipt: original.receipt});
  assert.deepEqual(validations, [{replay: false, revision: 0}, {replay: false, revision: 1}, {replay: true, revision: 2}]);
  await assert.rejects(writer.mutate(request({actor: {id: 'untrusted'}})), code('unauthorized'));
  assert.equal(validations.length, 3); assert.equal(provider.calls.applied, 2);
});

test('uncertain pending commit quarantines later writes until explicit provider reconciliation', async () => {
  const {provider, writer} = setup(); provider.faults.unknownBeforeCommitOnce = true;
  await assert.rejects(writer.mutate(request()), code('outcome-unknown')); assert.equal(provider.quarantine(), true); assert.equal(provider.calls.applied, 0);
  await assert.rejects(writer.mutate(request({command: command({recordId: 'newsletter:later', mutationId: 'mutation:later'})})), code('outcome-unknown'));
  assert.equal(provider.calls.applied, 0);
  await provider.resolveQuarantine({commit: true});
  assert.equal((await writer.mutate(request())).status, 'replay'); assert.equal(provider.calls.applied, 1);
});

test('whole batch failure cannot leave a record without its ledger, audit or history', async () => {
  const {provider, writer} = setup(); provider.faults.rejectBatchOnce = true;
  await assert.rejects(writer.mutate(request()), code('outcome-unknown'));
  for (const id of [11, 12, 13, 14]) assert.equal(provider.rows(id).length, 1);
  assert.equal(provider.calls.applied, 0);
});

test('manual canonical payload edits fail even when their payload digest was also rewritten', async () => {
  const {provider, writer} = setup(); await writer.mutate(request());
  const changed = {email: 'manual@example.invalid', source: 'footer', originalVersion: '00019'};
  provider.editCell(11, 1, 2, canonicalJson(changed)); provider.editCell(11, 1, 3, digestPayload(changed));
  await assert.rejects(writer.mutate(request({command: command({expectedRevision: 1, mutationId: 'mutation:new'})})), code('integrity'));
  assert.equal(provider.calls.applied, 1);
});

test('history, ledger and audit tampering or partial removal fails closed', async () => {
  for (const sheetId of [12, 13, 14]) {
    const {provider, writer} = setup(); await writer.mutate(request()); provider.replaceRows(sheetId, provider.rows(sheetId).slice(0, 1));
    await assert.rejects(writer.mutate(request({command: command({expectedRevision: 1, mutationId: 'mutation:new'})})), code('integrity'));
    assert.equal(provider.calls.applied, 1);
  }
});

test('formula cells, effective-value mismatches and unknown columns are rejected before commit', async () => {
  for (const cell of [
    {userEnteredValue: {formulaValue: '="footer"'}, effectiveValue: {stringValue: 'footer'}},
    {userEnteredValue: {stringValue: 'footer'}, effectiveValue: {stringValue: 'journal'}},
    {userEnteredValue: {numberValue: 7}, effectiveValue: {numberValue: 7}},
  ]) {
    const {provider, writer} = setup(); provider.overrideCell(15, 1, 0, cell);
    await assert.rejects(writer.mutate(request()), code('integrity')); assert.equal(provider.calls.commits, 0);
  }
  const {provider, writer} = setup(); const rows = provider.rows(11); rows[0].push('unknown'); provider.replaceRows(11, rows);
  await assert.rejects(writer.mutate(request()), code('integrity'));
});

test('normalization pads genuine blank trailing cells but still audits trailing formulas', () => {
  const provider = createTestWriterProvider(), snapshot = provider.snapshot();
  const first = snapshot.sheets[0]; first.rows[0].push({}); first.rows.push([], [{}]);
  assert.deepEqual(normalizeWriterSnapshot(resource, snapshot).sheets.get(11), provider.rows(11));
  first.rows[first.rows.length - 1] = [{userEnteredValue: {formulaValue: '=""'}, effectiveValue: {stringValue: ''}}];
  assert.throws(() => normalizeWriterSnapshot(resource, snapshot), code('integrity'));
  assert.deepEqual(literalCell(''), {userEnteredValue: {stringValue: ''}, effectiveValue: {stringValue: ''}});
});

test('normalization accepts Google omitted empty effective values but rejects malformed cell shapes', () => {
  const provider = createTestWriterProvider(), blankSnapshot = provider.snapshot();
  blankSnapshot.sheets[0].rows[0].push({userEnteredValue: {stringValue: ''}});
  assert.deepEqual(normalizeWriterSnapshot(resource, blankSnapshot).sheets.get(11), provider.rows(11));
  for (const cell of [null, '', [], {userEnteredValue: ''}, {effectiveValue: ''}, {userEnteredValue: {stringValue: ''}, effectiveValue: []}, {userEnteredValue: {stringValue: 'footer'}}]) {
    const snapshot = provider.snapshot(); snapshot.sheets.find(s => s.sheetId === 15).rows[1][0] = cell;
    assert.throws(() => normalizeWriterSnapshot(resource, snapshot), code('integrity'));
  }
});

test('row relocation remains safe and all writes use identities resolved from the current snapshot', async () => {
  const {provider, writer} = setup(); await writer.mutate(request()); await writer.mutate(request({command: command({recordId: 'newsletter:0008', mutationId: 'mutation:0008'})}));
  const rows = provider.rows(11); provider.replaceRows(11, [rows[0], rows[2], rows[1]]);
  const result = await writer.mutate(request({command: command({expectedRevision: 1, mutationId: 'mutation:update'})}));
  assert.equal(result.receipt.revision, 2); assert.equal(decodeRecord(provider.rows(11)[2]).recordId, 'newsletter:0007'); assert.equal(decodeRecord(provider.rows(11)[1]).revision, 1);
});

test('read failures and precommit timeout or cancellation do not submit writes or leak provider details', async () => {
  const {provider, writer} = setup(); provider.faults.read = true;
  await assert.rejects(writer.mutate(request()), error => error.code === 'unavailable' && !error.message.includes('secret'));
  assert.equal(provider.calls.commits, 0);
  const controller = new AbortController(); controller.abort(); await assert.rejects(writer.mutate(request(), {signal: controller.signal}), code('aborted'));
  const slow = createControlledWriter({resources: [resource], policies: {[resource.key]: policy}, limits: {timeoutMs: 10}}, {...provider, readSnapshot: () => new Promise(() => {}), now: () => now});
  await assert.rejects(slow.mutate(request()), code('timeout')); assert.equal(provider.calls.commits, 0);
});

test('commit timeout is unknown and is never automatically retried', async () => {
  const {provider, writer} = setup({limits: {timeoutMs: 10}}); provider.faults.hangCommit = true;
  await assert.rejects(writer.mutate(request()), code('outcome-unknown')); assert.equal(provider.calls.commits, 1); assert.equal(provider.calls.applied, 0);
});

test('limits bound conflicts, complete grids and batch size without truncation', async () => {
  const {provider, writer} = setup({limits: {maxConflicts: 1}}); provider.faults.conflictCount = 3;
  await assert.rejects(writer.mutate(request()), code('conflict')); assert.equal(provider.calls.commits, 2); assert.equal(provider.calls.applied, 0);
  const tiny = setup({limits: {maxBatchBytes: 10}}); await assert.rejects(tiny.writer.mutate(request()), code('too-large')); assert.equal(tiny.provider.calls.commits, 0);
  const grid = setup({limits: {maxRowsPerSheet: 2}}); await assert.rejects(grid.writer.mutate(request()), code('too-large'));
});

test('commit deadlines are signed-plan fields and expired leases never reach commit', async () => {
  const {provider, writer} = setup();
  await assert.rejects(writer.mutate(request({commitBefore: Date.parse(now)})), code('commit-expired')); assert.equal(provider.calls.commits, 0);
  let observed; provider.faults.beforeCommit = prepared => { observed = prepared.commitBefore; };
  const limit = Date.parse(now) + 1000; const result = await writer.mutate(request({commitBefore: limit})); assert.equal(observed, limit);
  const replay = setup({provider, now: () => '2026-10-24T13:00:00Z'}).writer;
  assert.deepEqual(await replay.mutate(request({commitBefore: limit})), {status: 'replay', receipt: result.receipt});
});

test('registration copies cannot be widened later or share writable sheet ownership', async () => {
  const mutable = {...resource, relationshipSheetIds: [...resource.relationshipSheetIds]}, provider = createTestWriterProvider();
  const writer = createControlledWriter({resources: [mutable], policies: {[resource.key]: policy}}, {...provider, now: () => now}); mutable.key = 'other';
  await assert.rejects(writer.mutate(request({resourceKey: 'other'})), code('not-registered'));
  assert.throws(() => createControlledWriter({resources: [resource, {...resource, key: 'other'}], policies: {[resource.key]: policy, other: policy}}, {...provider, now: () => now}), code('configuration'));
});
