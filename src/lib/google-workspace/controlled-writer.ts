import {createHash} from 'node:crypto';
import {
  RECORD_COLUMNS, SHEETS_CELL_CHARACTER_LIMIT, canonicalArtifactJson, canonicalJson, decodeRecord,
  digestPayload, encodeRecord, makeRecord, planRecordMutation,
  RecordCodecError,
  type GoogleWorkspaceRecord, type MutationActor, type MutationAuditEntry, type MutationLedgerEntry,
  type MutationReceipt, type RecordMutationCommand, type RecordMutationPlan,
} from './record-codec';

export const LEDGER_COLUMNS = ['mutation_id', 'resource_key', 'record_id', 'request_sha256', 'ledger_json', 'ledger_sha256'] as const;
export const AUDIT_COLUMNS = ['mutation_id', 'resource_key', 'record_id', 'audit_json', 'audit_sha256'] as const;
export const HISTORY_COLUMNS = RECORD_COLUMNS;
export type WriterResource = {
  key: string; workbookId: string; recordSheetId: number; ledgerSheetId: number; auditSheetId: number;
  historySheetId: number; relationshipSheetIds?: readonly number[];
};
export type WriterCell = {
  userEnteredValue?: {stringValue?: string; formulaValue?: string; numberValue?: number; boolValue?: boolean};
  effectiveValue?: {stringValue?: string; formulaValue?: string; numberValue?: number; boolValue?: boolean};
};
export type WriterSheetSnapshot = {sheetId: number; complete: true; rows: readonly (readonly WriterCell[])[]};
export type WriterSnapshot = {workbookId: string; sheets: readonly WriterSheetSnapshot[]};
export type WriterGuard = {sheetId: number; sha256: string; rowCount: number; columnCount: number};
export type SheetsUpdateCells = {updateCells: {start: {sheetId: number; rowIndex: number; columnIndex: 0}; rows: {values: {userEnteredValue: {stringValue: string}}[]}[]; fields: 'userEnteredValue'}};
export type SheetsAtomicBatch = {requests: SheetsUpdateCells[]};
export type PreparedControlledCommit = {
  schemaVersion: 1; resourceKey: string; workbookId: string; mutationId: string; requestSha256: string;
  actorId: string; commitBefore: number | null; guards: WriterGuard[]; batch: SheetsAtomicBatch; receipt: MutationReceipt;
};
export type ControlledWriteResult = {status: 'committed' | 'replay'; receipt: MutationReceipt};
export type AtomicCommitOutcome = ControlledWriteResult | {status: 'conflict'} | {status: 'unknown'};
export type WriterLimits = {timeoutMs: number; maxRowsPerSheet: number; maxSnapshotCharacters: number; maxBatchBytes: number; maxConflicts: number};
export type WriterPolicyContext = {resource: WriterResource; actor: MutationActor; command: RecordMutationCommand; commitBefore: number | null};
export type WriterValidationContext = WriterPolicyContext & {replay: boolean; current: GoogleWorkspaceRecord | null; records: ReadonlyMap<string, GoogleWorkspaceRecord>; sheets: ReadonlyMap<number, readonly (readonly string[])[]>};
export type WriterPolicy = {
  /** Trusted server policy, never a role or boolean taken from the submitted payload. */
  authorize: (context: WriterPolicyContext) => boolean | Promise<boolean>;
  /** Validate the domain and all relationships from these exact guarded sheet reads. */
  validate: (context: WriterValidationContext) => boolean | Promise<boolean>;
};
export type ControlledWriterConfig = {resources: readonly WriterResource[]; policies: Readonly<Record<string, WriterPolicy>>; limits?: Partial<WriterLimits>};
export type ControlledWriterDependencies = {
  readSnapshot: (resource: WriterResource, options: {signal: AbortSignal; limits: WriterLimits}) => Promise<WriterSnapshot>;
  /** REQUIRED PROVIDER CONTRACT: acquire one shared remote lock, resolve/quarantine
   * any prior uncertain attempt, reread every guard with formula provenance, then
   * either apply this entire fixed-address batch once or return conflict/no-write.
   * A timeout is unknown, never evidence of failure. The provider must durably fence
   * the scope until that attempt is reconciled. A local mutex is test-only.
   * This contract is implemented by the separately deployed signed CAS gateway;
   * no network-spanning or process-local lock is claimed by this coordinator. */
  commitAtomic: (prepared: PreparedControlledCommit, options: {signal: AbortSignal}) => Promise<AtomicCommitOutcome>;
  now: () => string;
};
export type ControlledWriteErrorCode = 'configuration' | 'not-registered' | 'unauthorized' | 'invalid-command' | 'integrity' | 'policy-rejected' | 'too-large' | 'conflict' | 'commit-expired' | 'unavailable' | 'timeout' | 'aborted' | 'outcome-unknown';
export class ControlledWriteError extends Error {
  constructor(public readonly code: ControlledWriteErrorCode) { super(messages[code]); this.name = 'ControlledWriteError'; }
}
const messages: Record<ControlledWriteErrorCode, string> = {
  configuration: 'Controlled writer configuration is invalid.', 'not-registered': 'This canonical resource is not registered.',
  unauthorized: 'This actor is not authorized for the requested operation.', 'invalid-command': 'The mutation command is invalid.',
  integrity: 'Canonical rows, formulas or mutation history need reconciliation before writing.',
  'policy-rejected': 'The record or its relationships did not pass the trusted domain policy.',
  'too-large': 'This operation exceeds its bounded writer limits.', conflict: 'Canonical state changed. Keep the same mutation identity when retrying.',
  'commit-expired': 'The operation lease expired before commit. Reload its durable state before continuing.',
  unavailable: 'Canonical storage is unavailable; nothing has been submitted for writing.', timeout: 'The canonical read timed out before a write was submitted.',
  aborted: 'The operation was cancelled before a write was submitted.',
  'outcome-unknown': 'The commit outcome is unconfirmed. Keep the same mutation ID and reconcile the durable receipt; do not submit a replacement mutation.',
};
function fail(code: ControlledWriteErrorCode): never { throw new ControlledWriteError(code); }
const defaults: WriterLimits = {timeoutMs: 10_000, maxRowsPerSheet: 2_000, maxSnapshotCharacters: 2 * 1024 * 1024, maxBatchBytes: 1024 * 1024, maxConflicts: 1};
const ceilings: WriterLimits = {timeoutMs: 30_000, maxRowsPerSheet: 20_000, maxSnapshotCharacters: 8 * 1024 * 1024, maxBatchBytes: 2 * 1024 * 1024, maxConflicts: 3};
const hash = (text: string) => createHash('sha256').update(text, 'utf8').digest('hex');
const clone = <T>(value: T): T => JSON.parse(canonicalArtifactJson(value)) as T;
const same = (a: unknown, b: unknown) => canonicalArtifactJson(a) === canonicalArtifactJson(b);
const mainSheets = (resource: WriterResource) => [resource.recordSheetId, resource.ledgerSheetId, resource.auditSheetId, resource.historySheetId];
const allSheets = (resource: WriterResource) => [...mainSheets(resource), ...(resource.relationshipSheetIds ?? [])].sort((a, b) => a - b);
const validSheetId = (id: unknown): id is number => Number.isSafeInteger(id) && Number(id) >= 0 && Number(id) <= 2_147_483_647;
function deadline(value: unknown): number | null { if (value === undefined || value === null) return null; if (!Number.isSafeInteger(value) || Number(value) < 1) fail('invalid-command'); return Number(value); }

function resourceCopy(value: WriterResource): WriterResource {
  let resource: WriterResource;
  try { resource = clone(value); } catch { return fail('configuration'); }
  if (!resource || !/^[a-z][a-z0-9_-]{0,63}$/.test(resource.key) || !/^[A-Za-z0-9_-]{10,160}$/.test(resource.workbookId) ||
    Object.keys(resource).some(key => !['key', 'workbookId', 'recordSheetId', 'ledgerSheetId', 'auditSheetId', 'historySheetId', 'relationshipSheetIds'].includes(key)) ||
    !mainSheets(resource).every(validSheetId) || resource.relationshipSheetIds !== undefined && !Array.isArray(resource.relationshipSheetIds)) fail('configuration');
  const ids = allSheets(resource);
  if (ids.length > 16 || !ids.every(validSheetId) || new Set(ids).size !== ids.length) fail('configuration');
  return resource;
}
function writerLimits(input: Partial<WriterLimits> = {}): WriterLimits {
  if (Object.keys(input).some(key => !Object.hasOwn(defaults, key))) fail('configuration');
  const limits = {...defaults, ...input};
  for (const key of Object.keys(defaults) as (keyof WriterLimits)[]) if (!Number.isSafeInteger(limits[key]) || limits[key] < (key === 'maxConflicts' ? 0 : 1) || limits[key] > ceilings[key]) fail('configuration');
  return limits;
}
export function resolveWriterLimits(input: Partial<WriterLimits> = {}): WriterLimits { return writerLimits(input); }
function submitted(actor: MutationActor, command: RecordMutationCommand): {actor: MutationActor; command: RecordMutationCommand} {
  let copied: {actor: MutationActor; command: RecordMutationCommand};
  try { copied = clone({actor, command}); } catch { return fail('invalid-command'); }
  if (!copied.actor || Object.keys(copied.actor).join(',') !== 'id' || typeof copied.actor.id !== 'string' || !copied.actor.id.length || copied.actor.id.length > 240 || /\s|[\u0000-\u001f\u007f-\u009f]/u.test(copied.actor.id)) fail('unauthorized');
  const c = copied.command;
  if (!c || Object.keys(c).sort().join(',') !== ['recordId', 'expectedRevision', 'mutationId', 'payload', 'sourceUpdatedAt', 'archivedAt'].sort().join(',') || !Number.isSafeInteger(c.expectedRevision) || c.expectedRevision < 0) fail('invalid-command');
  makeRecord({recordId: c.recordId, revision: c.expectedRevision + 1, payload: c.payload, sourceUpdatedAt: c.sourceUpdatedAt, archivedAt: c.archivedAt, lastMutationId: c.mutationId});
  return copied;
}

/** Normalized full-grid guard: SHA256(JSON.stringify(literal string[][])).
 * Inspect ALL returned cells first, including trailing cells. Entirely absent
 * entered/effective values mean blank; otherwise require a literal string and
 * identical effective string (effective may be absent only for empty text).
 * Trim wholly blank trailing rows, trim blank trailing header cells, reject
 * nonblank cells beyond the header, then pad/trim each row to that header width.
 * The remote gateway repeats this under its lock. Values-only reads are invalid. */
export function normalizeWriterSnapshot(resourceInput: WriterResource, input: WriterSnapshot, limitInput: Partial<WriterLimits> = {}) {
  const resource = resourceCopy(resourceInput), limits = writerLimits(limitInput), expected = allSheets(resource);
  let snapshot: WriterSnapshot;
  try { snapshot = clone(input); } catch { return fail('integrity'); }
  if (!snapshot || snapshot.workbookId !== resource.workbookId || !Array.isArray(snapshot.sheets) || snapshot.sheets.length !== expected.length || Object.keys(snapshot).some(key => !['workbookId', 'sheets'].includes(key))) fail('integrity');
  const sheets = new Map<number, string[][]>(), guards: WriterGuard[] = [];
  let characters = 0;
  for (const sheet of snapshot.sheets) {
    if (!sheet || !expected.includes(sheet.sheetId) || sheets.has(sheet.sheetId) || sheet.complete !== true || !Array.isArray(sheet.rows) || !sheet.rows.length || Object.keys(sheet).some(key => !['sheetId', 'complete', 'rows'].includes(key))) fail('integrity');
    if (sheet.rows.length > limits.maxRowsPerSheet) fail('too-large');
    const rows: string[][] = sheet.rows.map((row: readonly WriterCell[]) => {
      if (!Array.isArray(row) || row.length > 64) return fail('integrity');
      return row.map((cell: WriterCell) => {
        if (!cell || typeof cell !== 'object' || Array.isArray(cell) || Object.keys(cell).some(key => !['userEnteredValue', 'effectiveValue'].includes(key))) return fail('integrity');
        const entered = cell.userEnteredValue, effective = cell.effectiveValue;
        if (entered === undefined && effective === undefined) return '';
        if (!entered || typeof entered !== 'object' || Array.isArray(entered) || Object.keys(entered).join(',') !== 'stringValue' || typeof entered.stringValue !== 'string' || entered.stringValue.length > SHEETS_CELL_CHARACTER_LIMIT) return fail('integrity');
        if (effective === undefined ? entered.stringValue !== '' : !effective || typeof effective !== 'object' || Array.isArray(effective) || Object.keys(effective).join(',') !== 'stringValue' || effective.stringValue !== entered.stringValue) return fail('integrity');
        return entered.stringValue;
      });
    });
    while (rows.length && rows[rows.length - 1].every(value => value === '')) rows.pop();
    if (!rows.length) fail('integrity');
    while (rows[0].length && rows[0][rows[0].length - 1] === '') rows[0].pop();
    const width = rows[0].length;
    if (!width || rows[0].some(value => value === '')) fail('integrity');
    for (const row of rows) {
      if (row.slice(width).some(value => value !== '')) fail('integrity');
      row.length = Math.min(row.length, width);
      while (row.length < width) row.push('');
    }
    const serialized = JSON.stringify(rows); characters += serialized.length;
    if (characters > limits.maxSnapshotCharacters) fail('too-large');
    sheets.set(sheet.sheetId, rows);
    guards.push({sheetId: sheet.sheetId, sha256: hash(serialized), rowCount: rows.length, columnCount: rows[0].length});
  }
  guards.sort((a, b) => a.sheetId - b.sheetId);
  return {resource, sheets, guards};
}

type CanonicalState = {records: Map<string, GoogleWorkspaceRecord>; recordRows: Map<string, number>; ledgers: Map<string, MutationLedgerEntry>; sheets: Map<number, string[][]>; guards: WriterGuard[]};
function decodeState(resource: WriterResource, snapshot: WriterSnapshot, limits: WriterLimits): CanonicalState {
  const normalized = normalizeWriterSnapshot(resource, snapshot, limits), {sheets, guards} = normalized;
  const records = new Map<string, GoogleWorkspaceRecord>(), recordRows = new Map<string, number>(), ledgers = new Map<string, MutationLedgerEntry>(), audits = new Map<string, MutationAuditEntry>(), histories = new Map<string, GoogleWorkspaceRecord[]>();
  const table = (id: number, columns: readonly string[]) => { const rows = sheets.get(id)!; if (!same(rows[0], columns)) fail('integrity'); return rows.slice(1); };
  try {
    for (const [index, row] of table(resource.recordSheetId, RECORD_COLUMNS).entries()) { const value = decodeRecord(row); if (records.has(value.recordId)) fail('integrity'); records.set(value.recordId, value); recordRows.set(value.recordId, index + 1); }
    for (const row of table(resource.ledgerSheetId, LEDGER_COLUMNS)) {
      const [id, scope, recordId, requestSha256, json, digest] = row, value = JSON.parse(json) as MutationLedgerEntry;
      if (scope !== resource.key || ledgers.has(id) || canonicalJson(value) !== json || digestPayload(value) !== digest || value.mutationId !== id || value.recordId !== recordId || value.requestSha256 !== requestSha256) fail('integrity');
      ledgers.set(id, value);
    }
    for (const row of table(resource.auditSheetId, AUDIT_COLUMNS)) {
      const [id, scope, recordId, json, digest] = row, value = JSON.parse(json) as MutationAuditEntry;
      if (scope !== resource.key || audits.has(id) || canonicalJson(value) !== json || digestPayload(value) !== digest || value.mutationId !== id || value.recordId !== recordId) fail('integrity');
      audits.set(id, value);
    }
    for (const row of table(resource.historySheetId, HISTORY_COLUMNS)) { const value = decodeRecord(row), values = histories.get(value.recordId) ?? []; values.push(value); histories.set(value.recordId, values); }
    let historyCount = 0;
    for (const [recordId, values] of histories) {
      values.sort((a, b) => a.revision - b.revision); let previous: GoogleWorkspaceRecord | null = null;
      for (const value of values) {
        historyCount++;
        if (value.revision !== (previous?.revision ?? 0) + 1 || !value.lastMutationId) fail('integrity');
        const ledger = ledgers.get(value.lastMutationId), audit = audits.get(value.lastMutationId);
        if (!ledger || !audit) fail('integrity');
        const command: RecordMutationCommand = {recordId, expectedRevision: value.revision - 1, mutationId: value.lastMutationId, payload: value.payload, sourceUpdatedAt: value.sourceUpdatedAt, archivedAt: value.archivedAt};
        // Recreate the original change rather than trusting a self-consistent payload hash.
        const original = planRecordMutation({current: previous, previousMutation: null, command, actor: {id: ledger.actorId}, now: ledger.committedAt, authorize: () => true});
        if (original.kind !== 'apply' || !same(original.record, value) || !same(original.ledger, ledger) || !same(original.audit, audit)) fail('integrity');
        previous = value;
      }
      if (!records.has(recordId) || !same(records.get(recordId), previous)) fail('integrity');
    }
    if (records.size !== histories.size || historyCount !== ledgers.size || historyCount !== audits.size) fail('integrity');
  } catch (error) { if (error instanceof ControlledWriteError) throw error; return fail('integrity'); }
  return {records, recordRows, ledgers, sheets, guards};
}
/** Read-only integrity projection for trusted server adapters. The caller still
 * authorizes its read and supplies only registered resources. */
export function decodeCanonicalWriterSnapshot(resource: WriterResource, snapshot: WriterSnapshot, limits: Partial<WriterLimits> = {}): ReadonlyMap<string, GoogleWorkspaceRecord> {
  const state = decodeState(resourceCopy(resource), snapshot, writerLimits(limits));
  return new Map([...state.records].map(([id, record]) => [id, clone(record)]));
}

function cells(values: readonly string[]) { return values.map(stringValue => ({userEnteredValue: {stringValue}})); }
/** Four fixed-address updates, never blind append. Their row positions are valid
 * only while every complete grid guard remains unchanged inside the gateway. */
export function compileSheetsAtomicBatch(resourceInput: WriterResource, plan: Extract<RecordMutationPlan, {kind: 'apply'}>, positions: {recordRow: number; ledgerRow: number; auditRow: number; historyRow: number}): SheetsAtomicBatch {
  const resource = resourceCopy(resourceInput);
  for (const value of Object.values(positions)) if (!Number.isSafeInteger(value) || value < 1 || value > ceilings.maxRowsPerSheet) fail('configuration');
  if (Object.keys(positions).sort().join(',') !== ['recordRow', 'ledgerRow', 'auditRow', 'historyRow'].sort().join(',')) fail('configuration');
  const updates: [number, number, string[]][] = [
    [resource.recordSheetId, positions.recordRow, encodeRecord(plan.record)],
    [resource.ledgerSheetId, positions.ledgerRow, [plan.ledger.mutationId, resource.key, plan.ledger.recordId, plan.ledger.requestSha256, canonicalJson(plan.ledger), digestPayload(plan.ledger)]],
    [resource.auditSheetId, positions.auditRow, [plan.audit.mutationId, resource.key, plan.audit.recordId, canonicalJson(plan.audit), digestPayload(plan.audit)]],
    [resource.historySheetId, positions.historyRow, encodeRecord(plan.record)],
  ];
  return {requests: updates.map(([sheetId, rowIndex, values]) => ({updateCells: {start: {sheetId, rowIndex, columnIndex: 0}, rows: [{values: cells(values)}], fields: 'userEnteredValue'}}))};
}

export type PreparedMutation = {kind: 'replay'; receipt: MutationReceipt} | {kind: 'commit'; prepared: PreparedControlledCommit};
export async function prepareControlledMutation(input: {resource: WriterResource; snapshot: WriterSnapshot; command: RecordMutationCommand; actor: MutationActor; now: string; policy: WriterPolicy; limits?: Partial<WriterLimits>; commitBefore?: number | null}): Promise<PreparedMutation> {
  const resource = resourceCopy(input.resource), limits = writerLimits(input.limits), {actor, command} = submitted(input.actor, input.command), policy = input.policy;
  const commitBefore = deadline(input.commitBefore);
  if (!policy || typeof policy.authorize !== 'function' || typeof policy.validate !== 'function') fail('configuration');
  const context = {resource: clone(resource), actor: clone(actor), command: clone(command), commitBefore};
  if (await policy.authorize(context) !== true) fail('unauthorized');
  const state = decodeState(resource, input.snapshot, limits), current = state.records.get(command.recordId) ?? null;
  const plan = planRecordMutation({current, previousMutation: state.ledgers.get(command.mutationId) ?? null, command, actor, now: input.now, authorize: () => true});
  const validation: WriterValidationContext = {resource: clone(resource), actor: clone(actor), command: clone(command), commitBefore, replay: plan.kind === 'replay', current: current && clone(current), records: new Map([...state.records].map(([key, value]) => [key, clone(value)])), sheets: new Map([...state.sheets].map(([key, value]) => [key, clone(value)]))};
  if (await policy.validate(validation) !== true) fail('policy-rejected');
  if (plan.kind === 'replay') return {kind: 'replay', receipt: plan.receipt};
  if (commitBefore !== null && Date.parse(input.now) >= commitBefore) fail('commit-expired');
  const positions = {recordRow: state.recordRows.get(command.recordId) ?? state.sheets.get(resource.recordSheetId)!.length, ledgerRow: state.sheets.get(resource.ledgerSheetId)!.length, auditRow: state.sheets.get(resource.auditSheetId)!.length, historyRow: state.sheets.get(resource.historySheetId)!.length};
  if (Object.values(positions).some(row => row >= limits.maxRowsPerSheet)) fail('too-large');
  const batch = compileSheetsAtomicBatch(resource, plan, positions);
  if (Buffer.byteLength(JSON.stringify(batch), 'utf8') > limits.maxBatchBytes) fail('too-large');
  return {kind: 'commit', prepared: {schemaVersion: 1, resourceKey: resource.key, workbookId: resource.workbookId, mutationId: command.mutationId, requestSha256: plan.ledger.requestSha256, actorId: actor.id, commitBefore, guards: state.guards, batch, receipt: plan.receipt}};
}

async function bounded<T>(operation: () => Promise<T>, signal: AbortSignal): Promise<T> {
  if (signal.aborted) fail('aborted');
  return new Promise<T>((resolve, reject) => {
    const cancel = () => reject(new ControlledWriteError('aborted'));
    signal.addEventListener('abort', cancel, {once: true});
    Promise.resolve().then(() => { if (signal.aborted) fail('aborted'); return operation(); }).then(resolve, reject).finally(() => signal.removeEventListener('abort', cancel));
  });
}

/** Provider-injected server coordinator. Reads/validation occur outside the
 * remote lock; all their sheet dependencies are guarded by commitAtomic CAS. */
export function createControlledWriter(config: ControlledWriterConfig, dependencies: ControlledWriterDependencies) {
  if (!config || !Array.isArray(config.resources) || !config.resources.length || config.resources.length > 100 || !config.policies || !dependencies || typeof dependencies.readSnapshot !== 'function' || typeof dependencies.commitAtomic !== 'function' || typeof dependencies.now !== 'function') fail('configuration');
  const limits = writerLimits(config.limits), resources = new Map<string, WriterResource>(), policies = new Map<string, WriterPolicy>(), ownedSheets = new Set<string>();
  for (const value of config.resources) {
    const resource = resourceCopy(value), policy = config.policies[resource.key];
    if (resources.has(resource.key) || !policy || typeof policy.authorize !== 'function' || typeof policy.validate !== 'function') fail('configuration');
    for (const sheet of mainSheets(resource)) { const key = resource.workbookId + ':' + sheet; if (ownedSheets.has(key)) fail('configuration'); ownedSheets.add(key); }
    resources.set(resource.key, resource); policies.set(resource.key, {authorize: policy.authorize, validate: policy.validate});
  }
  const read = dependencies.readSnapshot, commit = dependencies.commitAtomic, now = dependencies.now;
  return Object.freeze({
    async mutate(input: {resourceKey: string; command: RecordMutationCommand; actor: MutationActor; commitBefore?: number | null}, options: {signal?: AbortSignal} = {}): Promise<ControlledWriteResult> {
      if (!input || Object.keys(input).some(key => !['resourceKey', 'command', 'actor', 'commitBefore'].includes(key)) || !resources.has(input.resourceKey)) fail('not-registered');
      const resource = resources.get(input.resourceKey)!, policy = policies.get(input.resourceKey)!, submission = submitted(input.actor, input.command);
      const commitBefore = deadline(input.commitBefore);
      if (options.signal?.aborted) fail('aborted');
      const controller = new AbortController(); let timedOut = false, commitSubmitted = false;
      const relay = () => controller.abort(); options.signal?.addEventListener('abort', relay, {once: true});
      const timer = setTimeout(() => { timedOut = true; controller.abort(); }, limits.timeoutMs);
      try {
        if (await bounded(async () => await policy.authorize({resource: clone(resource), ...clone(submission), commitBefore}) === true, controller.signal) !== true) fail('unauthorized');
        for (let attempt = 0; attempt <= limits.maxConflicts; attempt++) {
          const snapshot = await bounded(() => read(clone(resource), {signal: controller.signal, limits: {...limits}}), controller.signal);
          const prepared = await bounded(() => prepareControlledMutation({resource, snapshot, ...submission, now: now(), policy, limits, commitBefore}), controller.signal);
          if (prepared.kind === 'replay') return {status: 'replay', receipt: prepared.receipt};
          if (controller.signal.aborted) fail('aborted');
          commitSubmitted = true;
          const outcome = await bounded(() => commit(clone(prepared.prepared), {signal: controller.signal}), controller.signal);
          if (outcome?.status === 'conflict') { commitSubmitted = false; if (attempt === limits.maxConflicts) fail('conflict'); continue; }
          if (!outcome || outcome.status !== 'committed' && outcome.status !== 'replay' || !same(outcome.receipt, prepared.prepared.receipt)) fail('outcome-unknown');
          return {status: outcome.status, receipt: clone(outcome.receipt)};
        }
        return fail('conflict');
      } catch (error) {
        if (commitSubmitted) return fail('outcome-unknown');
        if (timedOut) return fail('timeout');
        if (controller.signal.aborted) return fail('aborted');
        if (error instanceof ControlledWriteError || error instanceof RecordCodecError) throw error;
        return fail('unavailable');
      } finally { clearTimeout(timer); options.signal?.removeEventListener('abort', relay); }
    },
  });
}
