import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {RECORD_COLUMNS, SHEETS_CELL_CHARACTER_LIMIT, DRIVE_ARTIFACT_CHARACTER_LIMIT, canonicalJson, canonicalArtifactJson, digestPayload, makeRecord, encodeRecord, decodeRecord, decodeRecordRows, recordCells, rawRecordValues, planRecordMutation, DriveArtifactRequiredError} from '../src/lib/google-workspace/record-codec.ts';

const now = '2026-10-24T12:00:00.000Z';
const record = (id = 'newsletter:0007', payload = {email: 'sample@example.invalid', version: 19}) => makeRecord({recordId: id, revision: 3, payload, sourceUpdatedAt: now, archivedAt: null, lastMutationId: 'fixture:previous'});
const changedRecord = changes => { const value = record(); delete value.payloadSha256; return makeRecord({...value, ...changes}); };
const command = (overrides = {}) => ({recordId: 'newsletter:0007', expectedRevision: 0, mutationId: 'test:create:0001', payload: {email: 'sample@example.invalid', source: 'footer', originalVersion: 19}, sourceUpdatedAt: now, archivedAt: null, ...overrides});
const plan = (overrides = {}) => planRecordMutation({current: null, previousMutation: null, command: command(), actor: {id: 'synthetic-admin'}, now, authorize: () => true, ...overrides});
const code = expected => error => error?.code === expected;

test('canonical JSON is deterministic, typed and lossless for source values', () => {
  const payload = {z: null, sourceId: '00007', active: false, amount: '19.00', numeric: 19, list: [null, true, '0042', {b: 2, a: 1}], signedZero: -0};
  const text = canonicalJson(payload);
  assert.equal(text, canonicalJson(Object.fromEntries(Object.entries(payload).reverse())));
  assert.equal(digestPayload(payload), createHash('sha256').update(text).digest('hex'));
  assert.deepEqual(JSON.parse(text), payload);
  assert.ok(Object.is(JSON.parse(text).signedZero, -0));
  assert.notEqual(digestPayload({value: '19'}), digestPayload({value: 19}));
});

test('record round trip retains original version, literal formulas and leading zero identity', () => {
  const payload = {version: '00019', names: ['=IMPORTXML("https://example.invalid","//a")', '+1', '-2', '@value', '\t=SUM(1)', '  =SUM(1)'], null: null, nested: {empty: [], bool: true}};
  const saved = record('000007', payload), row = encodeRecord(saved);
  assert.deepEqual(decodeRecord(row), saved);
  assert.equal(row[0], '000007'); assert.equal(row[1], '3'); assert.equal(saved.payload.version, '00019');
  for (const cell of recordCells(saved)) { assert.deepEqual(Object.keys(cell.userEnteredValue), ['stringValue']); assert.equal(typeof cell.userEnteredValue.stringValue, 'string'); }
  assert.deepEqual(rawRecordValues([saved]), {valueInputOption: 'RAW', majorDimension: 'ROWS', values: [row]});
  const formulaId = record('=literal-id', payload); assert.equal(recordCells(formulaId)[0].userEnteredValue.stringValue, '=literal-id');
});

test('row and declared-column reordering preserve identity, while duplicates fail', () => {
  const first = record('newsletter:0001'), second = record('newsletter:0002');
  const columns = [...RECORD_COLUMNS].reverse();
  const rows = [second, first].map(value => encodeRecord(value).reverse());
  const decoded = decodeRecordRows(columns, rows);
  assert.deepEqual(decoded.get(first.recordId), first); assert.deepEqual(decoded.get(second.recordId), second);
  assert.throws(() => decodeRecordRows(RECORD_COLUMNS, [encodeRecord(first), encodeRecord(first)]), code('DUPLICATE_RECORD_ID'));
  assert.equal(decodeRecordRows(RECORD_COLUMNS, []).size, 0);
});

test('malformed rows, unknown columns and automatic spreadsheet coercion fail closed', () => {
  const row = encodeRecord(record());
  for (const columns of [[...RECORD_COLUMNS, 'extra'], RECORD_COLUMNS.slice(1), [...RECORD_COLUMNS.slice(0, 6), 'revision']]) assert.throws(() => decodeRecord(row, columns), code('INVALID_COLUMNS'));
  for (const change of [r => r.slice(1), r => [...r, 'extra'], r => { r[1] = 3; return r; }, r => { r[1] = '03'; return r; }, r => { delete r[2]; return r; }]) assert.throws(() => decodeRecord(change([...row])), code('INVALID_ROW'));
  const tampered = [...row]; tampered[2] = canonicalJson({email: 'changed@example.invalid'}); assert.throws(() => decodeRecord(tampered), code('DIGEST_MISMATCH'));
  const spaces = [...row]; spaces[2] = ' ' + spaces[2]; assert.throws(() => decodeRecord(spaces), code('INVALID_ROW'));
  const invalidJson = [...row]; invalidJson[2] = '{"unfinished":'; assert.throws(() => decodeRecord(invalidJson), code('INVALID_JSON'));
  let invoked = false; const accessor = [...row]; Object.defineProperty(accessor, '2', {enumerable: true, get() { invoked = true; return row[2]; }});
  assert.throws(() => decodeRecord(accessor), code('INVALID_ROW')); assert.equal(invoked, false);
});

test('unknown, invalid, ambiguous or unsafe envelope fields cannot silently disappear', () => {
  for (const recordId of ['', ' leading', 'trailing ', 'two words', 'line\nfeed', 'a\u0000b', '\ud800', 'x'.repeat(241), 7]) assert.throws(() => changedRecord({recordId}), code('INVALID_RECORD'));
  for (const revision of [0, -1, -0, 1.5, Number.MAX_SAFE_INTEGER + 1, '1']) assert.throws(() => encodeRecord({...record(), revision}), code('INVALID_RECORD'));
  assert.throws(() => encodeRecord({...record(), mystery: 'discard me'}), code('INVALID_RECORD'));
  assert.throws(() => encodeRecord({...record(), sourceUpdatedAt: '2026-02-30T12:00:00Z'}), code('INVALID_RECORD'));
  for (const sourceUpdatedAt of ['2026-10-24T12:00:00.123456Z', '2026-10-24T12:00:00.123456+00:00', '2026-10-24T17:30:00+05:30', null]) {
    const precise = changedRecord({sourceUpdatedAt}); assert.equal(decodeRecord(encodeRecord(precise)).sourceUpdatedAt, precise.sourceUpdatedAt);
  }
});

test('unsafe JSON never calls accessors or coercion hooks and rejects unsupported values', () => {
  let invoked = false;
  const accessor = Object.defineProperty({}, 'data', {enumerable: true, get() { invoked = true; return 1; }});
  const hidden = Object.defineProperty({}, 'hidden', {value: 'lost', enumerable: false});
  const cycle = {}; cycle.self = cycle;
  const sparse = []; sparse[2] = 'lost';
  const extraArray = [1]; extraArray.extra = 2;
  const proxy = new Proxy({}, {getPrototypeOf() { invoked = true; return Object.prototype; }});
  for (const value of [undefined, NaN, Infinity, -Infinity, 3n, () => 1, Symbol('value'), new Date(), new Map(), new Set(), new Number(3), accessor, hidden, cycle, sparse, extraArray, proxy, {[Symbol('hidden')]: 1}, {child: undefined}, JSON.parse('{"__proto__":{"polluted":true}}'), {constructor: 'value'}, {prototype: 'value'}, {toJSON() { invoked = true; return 'coerced'; }}]) assert.throws(() => canonicalJson(value), code('INVALID_JSON'));
  assert.equal(invoked, false); assert.equal({}.polluted, undefined);
  let deep = null; for (let index = 0; index < 66; index++) deep = {child: deep}; assert.throws(() => canonicalJson(deep), code('INVALID_JSON'));
  const shared = {a: 1}; assert.equal(canonicalJson([shared, shared]), '[{"a":1},{"a":1}]');
});

test('oversized payloads require a Drive artifact rather than truncation', () => {
  const exact = 'x'.repeat(SHEETS_CELL_CHARACTER_LIMIT - 2);
  assert.equal(canonicalJson(exact).length, SHEETS_CELL_CHARACTER_LIMIT);
  assert.equal(decodeRecord(encodeRecord(record('newsletter:large', exact))).payload, exact);
  assert.throws(() => canonicalJson(exact + 'x'), error => error instanceof DriveArtifactRequiredError && error.code === 'DRIVE_ARTIFACT_REQUIRED');
  assert.throws(() => canonicalJson('\n'.repeat(23_000)), code('DRIVE_ARTIFACT_REQUIRED'));
  assert.throws(() => canonicalJson(Array(45_001).fill(null)), code('DRIVE_ARTIFACT_REQUIRED'));
  assert.throws(() => plan({command: command({payload: {text: 'x'.repeat(45_000)}})}), code('DRIVE_ARTIFACT_REQUIRED'));
});

test('oversized source documents have complete deterministic artifact JSON while inline storage stays bounded', () => {
  const document = {sourceId: '00009', body: 'Original source content. '.repeat(4_000), version: 12, optional: null};
  const text = canonicalArtifactJson(document), hash = createHash('sha256').update(text).digest('hex');
  assert.ok(text.length > SHEETS_CELL_CHARACTER_LIMIT);
  assert.deepEqual(JSON.parse(text), document);
  assert.equal(canonicalArtifactJson(Object.fromEntries(Object.entries(document).reverse())), text);
  assert.equal(createHash('sha256').update(canonicalArtifactJson(document)).digest('hex'), hash);
  assert.throws(() => canonicalJson(document), code('DRIVE_ARTIFACT_REQUIRED'));
  assert.throws(() => encodeRecord({recordId: 'editorial:oversized', revision: 1, payload: document, payloadSha256: hash, sourceUpdatedAt: now, archivedAt: null, lastMutationId: null}), code('DRIVE_ARTIFACT_REQUIRED'));
  assert.throws(() => canonicalArtifactJson({body: 'x'.repeat(DRIVE_ARTIFACT_CHARACTER_LIMIT)}), code('ARTIFACT_TOO_LARGE'));
  assert.throws(() => canonicalArtifactJson({body: document.body, invalid: undefined}), code('INVALID_JSON'));
});

test('create plan atomically describes record, idempotency ledger and audit without mutating input', () => {
  const submitted = command(); const before = structuredClone(submitted);
  const result = plan({command: submitted});
  assert.equal(result.kind, 'apply'); assert.deepEqual(result.writes, ['record', 'ledger', 'audit']);
  assert.equal(result.record.revision, 1); assert.equal(result.record.payload.originalVersion, 19);
  assert.deepEqual(result.receipt, result.ledger.result); assert.equal(result.audit.operation, 'create');
  assert.equal(result.audit.actorId, 'synthetic-admin'); assert.equal(result.audit.occurredAt, now);
  assert.deepEqual(submitted, before); assert.equal(result.ledger.result.payload, undefined);
});

test('optimistic concurrency keeps the winning update and rejects stale or missing records', () => {
  const current = record(), before = structuredClone(current);
  const first = plan({current, command: command({expectedRevision: 3, mutationId: 'test:update:1'})});
  assert.equal(first.record.revision, 4); assert.equal(first.audit.operation, 'update');
  assert.throws(() => plan({current: first.record, command: command({expectedRevision: 3, mutationId: 'test:update:2'})}), code('REVISION_CONFLICT'));
  assert.throws(() => plan({current, command: command()}), code('REVISION_CONFLICT'));
  assert.throws(() => plan({command: command({expectedRevision: 3})}), code('REVISION_CONFLICT'));
  assert.deepEqual(current, before);
});

test('response-loss replay returns the original receipt even after another revision, with no writes', () => {
  const original = plan();
  const next = plan({current: original.record, command: command({expectedRevision: 1, mutationId: 'test:later:0002', payload: {email: 'other@example.invalid'}})});
  const replay = plan({current: next.record, previousMutation: original.ledger, now: '2026-10-24T12:05:00Z'});
  assert.equal(replay.kind, 'replay'); assert.equal(replay.receipt.revision, 1); assert.deepEqual(replay.receipt, original.receipt); assert.deepEqual(replay.writes, []);
  assert.equal(replay.record, undefined); assert.equal(replay.audit, undefined); assert.equal(replay.ledger, undefined);
});

test('same mutation ID with changed payload, revision, metadata or actor is a conflict', () => {
  const saved = plan();
  for (const changed of [{payload: {email: 'other@example.invalid'}}, {expectedRevision: 1}, {archivedAt: now}, {sourceUpdatedAt: null}]) assert.throws(() => plan({current: saved.record, previousMutation: saved.ledger, command: command(changed)}), code('IDEMPOTENCY_CONFLICT'));
  assert.throws(() => plan({current: saved.record, previousMutation: saved.ledger, actor: {id: 'different-admin'}}), code('IDEMPOTENCY_CONFLICT'));
});

test('authorization is mandatory for writes and replays and cannot mutate the planned document', () => {
  const saved = plan();
  for (const authorize of [undefined, () => false, () => 'admin', () => Promise.resolve(true)]) assert.throws(() => plan({authorize}), code('UNAUTHORIZED'));
  assert.throws(() => plan({current: saved.record, previousMutation: saved.ledger, authorize: () => false}), code('UNAUTHORIZED'));
  assert.throws(() => plan({actor: {id: 'browser', role: 'admin'}}), code('UNAUTHORIZED'));
  const result = plan({authorize: context => { context.command.payload.email = 'tampered@example.invalid'; context.actor.id = 'tampered'; return true; }});
  assert.equal(result.record.payload.email, 'sample@example.invalid'); assert.equal(result.audit.actorId, 'synthetic-admin');
});

test('malformed or inconsistent ledgers fail closed and absent ledger does not invent success', () => {
  const saved = plan();
  const ledger = structuredClone(saved.ledger); ledger.result.revision = 7;
  assert.throws(() => plan({current: saved.record, previousMutation: ledger}), code('INVALID_LEDGER'));
  assert.throws(() => plan({current: saved.record, previousMutation: {...saved.ledger, unknown: true}}), code('INVALID_LEDGER'));
  assert.throws(() => plan({current: saved.record, command: command({expectedRevision: 1})}), code('INVALID_LEDGER'));
  assert.throws(() => plan({current: {...saved.record, recordId: 'another:id'}}), code('INVALID_RECORD'));
});

test('archive and restore preserve payload, record identity and original source time', () => {
  const current = record(), archived = plan({current, command: command({expectedRevision: 3, payload: current.payload, archivedAt: now, mutationId: 'test:archive'})});
  assert.equal(archived.audit.operation, 'archive'); assert.deepEqual(archived.record.payload, current.payload);
  const restored = plan({current: archived.record, command: command({expectedRevision: 4, payload: current.payload, mutationId: 'test:restore'})});
  assert.equal(restored.audit.operation, 'restore'); assert.equal(restored.record.recordId, current.recordId); assert.equal(restored.record.sourceUpdatedAt, current.sourceUpdatedAt); assert.equal(restored.record.archivedAt, null);
});

test('storage revision overflow is rejected instead of wrapping or losing precision', () => {
  const current = changedRecord({revision: Number.MAX_SAFE_INTEGER});
  assert.throws(() => plan({current, command: command({expectedRevision: Number.MAX_SAFE_INTEGER})}), code('INVALID_RECORD'));
});
