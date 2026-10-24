import {createHash} from 'node:crypto';
import {types as nodeTypes} from 'node:util';

/** Storage contracts only. No provider, credentials, network, filesystem or app activation. */
export const RECORD_COLUMNS = ['record_id', 'revision', 'payload_json', 'payload_sha256', 'source_updated_at', 'archived_at', 'last_mutation_id'] as const;
export const SHEETS_CELL_CHARACTER_LIMIT = 45_000;
export const DRIVE_ARTIFACT_CHARACTER_LIMIT = 8 * 1024 * 1024;
export type JsonValue = null | boolean | number | string | JsonValue[] | {[key: string]: JsonValue};
export type RecordCodecErrorCode = 'INVALID_JSON' | 'DRIVE_ARTIFACT_REQUIRED' | 'ARTIFACT_TOO_LARGE' | 'INVALID_RECORD' | 'INVALID_COLUMNS' | 'INVALID_ROW' | 'DUPLICATE_RECORD_ID' | 'DIGEST_MISMATCH' | 'UNAUTHORIZED' | 'REVISION_CONFLICT' | 'IDEMPOTENCY_CONFLICT' | 'INVALID_LEDGER';
export class RecordCodecError extends Error {
  constructor(public readonly code: RecordCodecErrorCode, message: string) { super(message); this.name = 'RecordCodecError'; }
}
export class DriveArtifactRequiredError extends RecordCodecError {
  constructor() { super('DRIVE_ARTIFACT_REQUIRED', 'The record exceeds the 45000-character cell budget. Store the complete payload as a verified Drive artifact and retain its registered reference; do not truncate it.'); this.name = 'DriveArtifactRequiredError'; }
}
function fail(code: RecordCodecErrorCode, message: string): never { throw new RecordCodecError(code, message); }
const unsafeKeys = new Set(['__proto__', 'prototype', 'constructor']);

/** Deterministic JSON with exact string/number types and signed zero retained.
 * Rejects coercion hooks, sparse arrays, accessors, hidden/symbol keys and cycles.
 * JSON text is the cell value, never an executable Sheets expression. */
function serializeCanonicalJson(value: unknown, characterLimit: number): string {
  const parts: string[] = [], ancestors = new Set<object>();
  let characters = 0, nodes = 0;
  const tooLarge = (): never => { if (characterLimit === SHEETS_CELL_CHARACTER_LIMIT) throw new DriveArtifactRequiredError(); return fail('ARTIFACT_TOO_LARGE', 'The complete artifact exceeds the supported 8 MiB character budget; do not truncate it.'); };
  const append = (text: string) => { characters += text.length; if (characters > characterLimit) tooLarge(); parts.push(text); };
  const visit = (item: unknown, depth: number): void => {
    if (++nodes > 100_000 || depth > 64) fail('INVALID_JSON', 'JSON nesting or node count exceeds the supported limit.');
    if (item === null) { append('null'); return; }
    if (typeof item === 'string') { if (item.length > characterLimit) tooLarge(); append(JSON.stringify(item)); return; }
    if (typeof item === 'boolean') { append(item ? 'true' : 'false'); return; }
    if (typeof item === 'number') { if (!Number.isFinite(item)) fail('INVALID_JSON', 'JSON numbers must be finite.'); append(Object.is(item, -0) ? '-0' : JSON.stringify(item)); return; }
    if (typeof item !== 'object') fail('INVALID_JSON', 'Only explicit JSON values are accepted; undefined and coercion are forbidden.');
    const object = item as object;
    if (nodeTypes.isProxy(object)) fail('INVALID_JSON', 'Proxy objects are not explicit JSON values.');
    const array = Array.isArray(object), prototype = Object.getPrototypeOf(object);
    if (array ? prototype !== Array.prototype : prototype !== Object.prototype && prototype !== null) fail('INVALID_JSON', 'Only ordinary JSON objects and arrays are accepted.');
    if (ancestors.has(object)) fail('INVALID_JSON', 'Cyclic JSON values are forbidden.');
    const descriptors = Object.getOwnPropertyDescriptors(object), keys = Reflect.ownKeys(descriptors);
    if (keys.some(key => typeof key !== 'string')) fail('INVALID_JSON', 'Symbol keys cannot be stored losslessly.');
    const names = keys as string[];
    for (const key of names) {
      const descriptor = descriptors[key];
      if (array && key === 'length') continue;
      if (unsafeKeys.has(key) || !descriptor.enumerable || !('value' in descriptor)) fail('INVALID_JSON', 'Unsafe keys, hidden properties and accessors are forbidden.');
    }
    ancestors.add(object);
    if (array) {
      const length = (object as unknown[]).length;
      if (length > characterLimit) tooLarge();
      if (names.length !== length + 1 || names.some(key => key !== 'length' && !/^(0|[1-9]\d*)$/.test(key))) fail('INVALID_JSON', 'Arrays must be dense and contain only indexed values.');
      append('[');
      for (let index = 0; index < length; index++) { if (!Object.hasOwn(descriptors, String(index))) fail('INVALID_JSON', 'Sparse arrays cannot be stored losslessly.'); if (index) append(','); visit(descriptors[String(index)].value, depth + 1); }
      append(']');
    } else {
      append('{');
      names.sort().forEach((key, index) => { if (key.length > characterLimit) tooLarge(); if (index) append(','); append(JSON.stringify(key)); append(':'); visit(descriptors[key].value, depth + 1); });
      append('}');
    }
    ancestors.delete(object);
  };
  visit(value, 0);
  return parts.join('');
}
/** Inline Sheets payloads keep their conservative per-cell limit. */
export function canonicalJson(value: unknown): string { return serializeCanonicalJson(value, SHEETS_CELL_CHARACTER_LIMIT); }
/** Validate and hash complete source documents for artifact planning only.
 * This does not create a Drive file or authorize an oversized Sheets cell. */
export function canonicalArtifactJson(value: unknown): string { return serializeCanonicalJson(value, DRIVE_ARTIFACT_CHARACTER_LIMIT); }
const sha256 = (text: string) => createHash('sha256').update(text, 'utf8').digest('hex');
export const digestPayload = (payload: unknown): string => sha256(canonicalJson(payload));
const cloneJson = <T>(value: T): T => JSON.parse(canonicalJson(value)) as T;

function exactObject(value: unknown, keys: readonly string[], code: RecordCodecErrorCode): Record<string, unknown> {
  if (!value || typeof value !== 'object' || nodeTypes.isProxy(value) || Array.isArray(value) || ![Object.prototype, null].includes(Object.getPrototypeOf(value))) fail(code, 'Expected an ordinary object.');
  const descriptors = Object.getOwnPropertyDescriptors(value);
  const ownKeys = Reflect.ownKeys(value);
  if (ownKeys.length !== keys.length || ownKeys.some(key => typeof key !== 'string' || !keys.includes(key) || !descriptors[key].enumerable || !('value' in descriptors[key]))) fail(code, 'Missing, unknown or unsafe fields are not accepted.');
  return value as Record<string, unknown>;
}
function stableId(value: unknown, code: RecordCodecErrorCode = 'INVALID_RECORD'): asserts value is string {
  if (typeof value !== 'string' || !value.length || value.length > 240 || /[\s\u0000-\u001f\u007f-\u009f]/u.test(value) || /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/u.test(value)) fail(code, 'Stable identifiers must be nonempty, bounded strings without whitespace or control characters.');
}
function timestamp(value: unknown, nullable = true, code: RecordCodecErrorCode = 'INVALID_RECORD'): asserts value is string | null {
  if (value === null && nullable) return;
  const match = typeof value === 'string' ? /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d{1,9})?(?:Z|([+-])(\d{2}):(\d{2}))$/.exec(value) : null;
  if (!match) fail(code, 'Use a valid ISO timestamp with an explicit timezone; null represents unavailable source metadata.');
  const [, year, month, day, hour, minute, second, , offsetHour = '0', offsetMinute = '0'] = match;
  const y = Number(year), m = Number(month), days = [31, y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (m < 1 || m > 12 || Number(day) < 1 || Number(day) > days[m - 1] || Number(hour) > 23 || Number(minute) > 59 || Number(second) > 59 || Number(offsetHour) > 23 || Number(offsetMinute) > 59 || !Number.isFinite(Date.parse(value as string))) fail(code, 'The source timestamp has an invalid date, time or offset.');
}
function revision(value: unknown, allowZero = false, code: RecordCodecErrorCode = 'INVALID_RECORD'): asserts value is number {
  if (!Number.isSafeInteger(value) || (value as number) < (allowZero ? 0 : 1) || Object.is(value, -0)) fail(code, 'Storage revisions must be safe positive integers; only create commands may expect zero.');
}
const digest = (value: unknown, code: RecordCodecErrorCode = 'INVALID_RECORD') => { if (typeof value !== 'string' || !/^[a-f0-9]{64}$/.test(value)) fail(code, 'Expected a lowercase SHA-256 digest.'); };

export type GoogleWorkspaceRecord = {
  recordId: string; revision: number; payload: JsonValue; payloadSha256: string;
  sourceUpdatedAt: string | null; archivedAt: string | null; lastMutationId: string | null;
};
const recordKeys = ['recordId', 'revision', 'payload', 'payloadSha256', 'sourceUpdatedAt', 'archivedAt', 'lastMutationId'] as const;
function validatedRecord(value: unknown): GoogleWorkspaceRecord {
  const record = exactObject(value, recordKeys, 'INVALID_RECORD');
  stableId(record.recordId); revision(record.revision); timestamp(record.sourceUpdatedAt); timestamp(record.archivedAt);
  if (record.lastMutationId !== null) stableId(record.lastMutationId);
  digest(record.payloadSha256);
  const payloadText = canonicalJson(record.payload);
  if (sha256(payloadText) !== record.payloadSha256) fail('DIGEST_MISMATCH', 'The complete payload does not match its recorded digest.');
  return {...record, payload: JSON.parse(payloadText)} as GoogleWorkspaceRecord;
}
export function makeRecord(input: Omit<GoogleWorkspaceRecord, 'payloadSha256'>): GoogleWorkspaceRecord {
  exactObject(input, recordKeys.filter(key => key !== 'payloadSha256'), 'INVALID_RECORD');
  return validatedRecord({...input, payloadSha256: digestPayload(input.payload)});
}
/** Canonical column order; all seven values remain literal strings. */
export function encodeRecord(input: GoogleWorkspaceRecord): string[] {
  const record = validatedRecord(input);
  return [record.recordId, String(record.revision), canonicalJson(record.payload), record.payloadSha256, record.sourceUpdatedAt ?? '', record.archivedAt ?? '', record.lastMutationId ?? ''];
}
function stringCells(value: unknown, code: RecordCodecErrorCode): string[] {
  if (!Array.isArray(value) || nodeTypes.isProxy(value) || Object.getPrototypeOf(value) !== Array.prototype || value.length !== RECORD_COLUMNS.length) fail(code, 'Use exactly seven explicit string cells.');
  const descriptors = Object.getOwnPropertyDescriptors(value);
  if (Reflect.ownKeys(descriptors).length !== RECORD_COLUMNS.length + 1) fail(code, 'Row properties must be exactly the seven cell positions.');
  return RECORD_COLUMNS.map((_, index) => {
    const descriptor = descriptors[String(index)];
    if (!descriptor || !descriptor.enumerable || !('value' in descriptor) || typeof descriptor.value !== 'string') fail(code, 'Cell coercion and accessors are forbidden.');
    if (descriptor.value.length > SHEETS_CELL_CHARACTER_LIMIT) throw new DriveArtifactRequiredError();
    return descriptor.value;
  });
}
function columnPositions(columns: readonly unknown[]): number[] {
  const names = stringCells(columns, 'INVALID_COLUMNS');
  if (new Set(names).size !== RECORD_COLUMNS.length || names.some(name => !(RECORD_COLUMNS as readonly string[]).includes(name))) fail('INVALID_COLUMNS', 'Use each declared record column exactly once; unknown columns are forbidden.');
  return RECORD_COLUMNS.map(name => names.indexOf(name));
}
export function decodeRecord(row: readonly unknown[], columns: readonly unknown[] = RECORD_COLUMNS): GoogleWorkspaceRecord {
  const positions = columnPositions(columns);
  const cells = stringCells(row, 'INVALID_ROW');
  const [recordId, storedRevision, payloadText, payloadSha256, sourceUpdatedAt, archivedAt, lastMutationId] = positions.map(index => cells[index]);
  if (!/^[1-9]\d*$/.test(storedRevision)) fail('INVALID_ROW', 'Storage revision cells must contain a canonical positive integer string.');
  let payload: JsonValue;
  try { payload = JSON.parse(payloadText) as JsonValue; } catch { return fail('INVALID_JSON', 'The payload cell must contain complete JSON.'); }
  if (canonicalJson(payload) !== payloadText) fail('INVALID_ROW', 'The payload cell is not canonical JSON; do not coerce or silently rewrite it.');
  return validatedRecord({recordId, revision: Number(storedRevision), payload, payloadSha256, sourceUpdatedAt: sourceUpdatedAt || null, archivedAt: archivedAt || null, lastMutationId: lastMutationId || null});
}
/** Row order has no identity meaning. The result is keyed only by stable IDs. */
export function decodeRecordRows(columns: readonly unknown[], rows: readonly (readonly unknown[])[]): Map<string, GoogleWorkspaceRecord> {
  columnPositions(columns);
  if (!Array.isArray(rows)) fail('INVALID_ROW', 'Expected a list of record rows.');
  const records = new Map<string, GoogleWorkspaceRecord>();
  for (const row of rows) { const record = decodeRecord(row, columns); if (records.has(record.recordId)) fail('DUPLICATE_RECORD_ID', 'Multiple rows claim the same stable record ID.'); records.set(record.recordId, record); }
  return records;
}
/** Feed these cells to UpdateCells with fields=userEnteredValue. Never infer formulas. */
export function recordCells(record: GoogleWorkspaceRecord): {userEnteredValue: {stringValue: string}}[] {
  return encodeRecord(record).map(stringValue => ({userEnteredValue: {stringValue}}));
}
/** Alternative Sheets values API contract: RAW is fixed, never USER_ENTERED. */
export function rawRecordValues(records: readonly GoogleWorkspaceRecord[]) {
  return {valueInputOption: 'RAW' as const, majorDimension: 'ROWS' as const, values: records.map(encodeRecord)};
}

export type RecordMutationCommand = {
  recordId: string; expectedRevision: number; mutationId: string; payload: JsonValue;
  sourceUpdatedAt: string | null; archivedAt: string | null;
};
export type MutationActor = {id: string};
export type MutationReceipt = Omit<GoogleWorkspaceRecord, 'payload'> & {lastMutationId: string};
export type MutationLedgerEntry = {mutationId: string; recordId: string; actorId: string; requestSha256: string; committedAt: string; result: MutationReceipt};
export type MutationAuditEntry = {mutationId: string; actorId: string; recordId: string; operation: 'create' | 'update' | 'archive' | 'restore'; previousRevision: number; revision: number; payloadSha256: string; occurredAt: string};
export type RecordMutationPlan =
  | {kind: 'apply'; record: GoogleWorkspaceRecord; receipt: MutationReceipt; ledger: MutationLedgerEntry; audit: MutationAuditEntry; writes: readonly ['record', 'ledger', 'audit']}
  | {kind: 'replay'; receipt: MutationReceipt; writes: readonly []};
const commandKeys = ['recordId', 'expectedRevision', 'mutationId', 'payload', 'sourceUpdatedAt', 'archivedAt'] as const;
const receiptKeys = ['recordId', 'revision', 'payloadSha256', 'sourceUpdatedAt', 'archivedAt', 'lastMutationId'] as const;
function validatedLedger(input: unknown): MutationLedgerEntry {
  const entry = exactObject(input, ['mutationId', 'recordId', 'actorId', 'requestSha256', 'committedAt', 'result'], 'INVALID_LEDGER');
  for (const key of ['mutationId', 'recordId', 'actorId']) stableId(entry[key], 'INVALID_LEDGER');
  digest(entry.requestSha256, 'INVALID_LEDGER'); timestamp(entry.committedAt, false, 'INVALID_LEDGER');
  const result = exactObject(entry.result, receiptKeys, 'INVALID_LEDGER');
  stableId(result.recordId, 'INVALID_LEDGER'); stableId(result.lastMutationId, 'INVALID_LEDGER'); revision(result.revision, false, 'INVALID_LEDGER'); digest(result.payloadSha256, 'INVALID_LEDGER'); timestamp(result.sourceUpdatedAt, true, 'INVALID_LEDGER'); timestamp(result.archivedAt, true, 'INVALID_LEDGER');
  if (entry.recordId !== result.recordId || entry.mutationId !== result.lastMutationId) fail('INVALID_LEDGER', 'The mutation receipt is bound to another record or mutation.');
  return cloneJson(entry) as MutationLedgerEntry;
}

/** Plan while the future writer holds its shared lock. The caller must load the
 * current record and ledger inside that lock and commit ALL three changes in one
 * workbook batch. This function does not perform or claim a durable transaction.
 * actor/authorize are server-owned inputs, never browser-provided role claims. */
export function planRecordMutation(input: {
  current: GoogleWorkspaceRecord | null; previousMutation: MutationLedgerEntry | null;
  command: RecordMutationCommand; actor: MutationActor; now: string;
  authorize: (context: {actor: MutationActor; command: RecordMutationCommand; current: GoogleWorkspaceRecord | null}) => boolean;
}): RecordMutationPlan {
  if (!input || typeof input.authorize !== 'function') fail('UNAUTHORIZED', 'A server-side authorization decision is required.');
  const actor = exactObject(input.actor, ['id'], 'UNAUTHORIZED'); stableId(actor.id, 'UNAUTHORIZED');
  timestamp(input.now, false);
  const incoming = exactObject(input.command, commandKeys, 'INVALID_RECORD');
  stableId(incoming.recordId); stableId(incoming.mutationId); revision(incoming.expectedRevision, true); timestamp(incoming.sourceUpdatedAt); timestamp(incoming.archivedAt);
  // Validate payload separately so its full cell allowance is not spent on envelope fields.
  const command = {...incoming, payload: JSON.parse(canonicalJson(incoming.payload))} as RecordMutationCommand;
  const current = input.current === null ? null : validatedRecord(input.current);
  if (current && current.recordId !== command.recordId) fail('INVALID_RECORD', 'The current record does not match the command identity.');
  const actorValue = {id: actor.id as string};
  const authorizationContext = {actor: {...actorValue}, command: {...command, payload: JSON.parse(canonicalJson(command.payload)) as JsonValue}, current: current ? {...current, payload: JSON.parse(canonicalJson(current.payload)) as JsonValue} : null};
  if (input.authorize(authorizationContext) !== true) fail('UNAUTHORIZED', 'This actor is not authorized for the record mutation.');
  const payloadSha256 = digestPayload(command.payload);
  const requestSha256 = digestPayload({recordId: command.recordId, expectedRevision: command.expectedRevision, mutationId: command.mutationId, actorId: actorValue.id, payloadSha256, sourceUpdatedAt: command.sourceUpdatedAt, archivedAt: command.archivedAt});
  if (input.previousMutation !== null) {
    const previous = validatedLedger(input.previousMutation);
    if (previous.mutationId !== command.mutationId || previous.recordId !== command.recordId || previous.actorId !== actorValue.id || previous.requestSha256 !== requestSha256) fail('IDEMPOTENCY_CONFLICT', 'This mutation ID was already used for different input.');
    if (previous.result.revision !== command.expectedRevision + 1 || previous.result.payloadSha256 !== payloadSha256 || previous.result.sourceUpdatedAt !== command.sourceUpdatedAt || previous.result.archivedAt !== command.archivedAt) fail('INVALID_LEDGER', 'The saved receipt does not describe the original mutation.');
    return {kind: 'replay', receipt: previous.result, writes: []};
  }
  if ((current?.revision ?? 0) !== command.expectedRevision) fail('REVISION_CONFLICT', 'The record changed. Preserve the submitted edits and compare its current revision.');
  if (current?.lastMutationId === command.mutationId) fail('INVALID_LEDGER', 'The record references this mutation but its durable ledger entry is missing.');
  const nextRevision = command.expectedRevision + 1;
  revision(nextRevision);
  const record = makeRecord({recordId: command.recordId, revision: nextRevision, payload: command.payload, sourceUpdatedAt: command.sourceUpdatedAt, archivedAt: command.archivedAt, lastMutationId: command.mutationId});
  const receipt: MutationReceipt = {recordId: record.recordId, revision: record.revision, payloadSha256: record.payloadSha256, sourceUpdatedAt: record.sourceUpdatedAt, archivedAt: record.archivedAt, lastMutationId: command.mutationId};
  const ledger: MutationLedgerEntry = {mutationId: command.mutationId, recordId: command.recordId, actorId: actorValue.id, requestSha256, committedAt: input.now, result: {...receipt}};
  const operation = !current ? 'create' : !current.archivedAt && command.archivedAt ? 'archive' : current.archivedAt && !command.archivedAt ? 'restore' : 'update';
  const audit: MutationAuditEntry = {mutationId: command.mutationId, actorId: actorValue.id, recordId: command.recordId, operation, previousRevision: command.expectedRevision, revision: nextRevision, payloadSha256, occurredAt: input.now};
  return {kind: 'apply', record, receipt, ledger, audit, writes: ['record', 'ledger', 'audit']};
}
