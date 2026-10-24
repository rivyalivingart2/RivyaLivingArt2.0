/** Disposable test provider only. Its local queue is NOT a distributed Google
 * lock or an application backend. Each test owns and discards its own RAM state. */
import {RECORD_COLUMNS, canonicalJson} from '../../src/lib/google-workspace/record-codec.ts';
import {AUDIT_COLUMNS, LEDGER_COLUMNS, normalizeWriterSnapshot} from '../../src/lib/google-workspace/controlled-writer.ts';

export const writerFixtureResource = Object.freeze({key: 'newsletter', workbookId: 'isolated_workbook_0001', recordSheetId: 11, ledgerSheetId: 12, auditSheetId: 13, historySheetId: 14, relationshipSheetIds: [15]});
export function literalCell(stringValue) { return {userEnteredValue: {stringValue}, effectiveValue: {stringValue}}; }
export function createTestWriterProvider(resource = writerFixtureResource) {
  let grids = new Map([
    [resource.recordSheetId, [[...RECORD_COLUMNS]]], [resource.ledgerSheetId, [[...LEDGER_COLUMNS]]],
    [resource.auditSheetId, [[...AUDIT_COLUMNS]]], [resource.historySheetId, [[...RECORD_COLUMNS]]],
    ...(resource.relationshipSheetIds ?? []).map(id => [id, [['source_id', 'enabled'], ['footer', 'true'], ['journal', 'true']]]),
  ]);
  let queue = Promise.resolve(), quarantine = null;
  const calls = {reads: 0, commits: 0, applied: 0, conflicts: 0};
  const faults = {read: false, beforeCommit: null, conflictCount: 0, loseResponseOnce: false, unknownBeforeCommitOnce: false, rejectBatchOnce: false, hangCommit: false};
  const cellOverrides = new Map();
  const snapshot = () => ({workbookId: resource.workbookId, sheets: [...grids].map(([sheetId, rows]) => ({sheetId, complete: true, rows: rows.map((row, ri) => row.map((value, ci) => structuredClone(cellOverrides.get(`${sheetId}:${ri}:${ci}`) ?? literalCell(value))))}))});
  const locked = async work => { let release; const next = new Promise(resolve => { release = resolve; }); const prior = queue; queue = prior.then(() => next); await prior; try { return await work(); } finally { release(); } };
  const sameGuards = prepared => canonicalJson(normalizeWriterSnapshot(resource, snapshot()).guards) === canonicalJson(prepared.guards);
  function apply(prepared) {
    const next = structuredClone(grids);
    // Stage every cell before the single RAM commit, modelling atomic batch failure.
    for (const request of prepared.batch.requests) {
      const update = request.updateCells, {sheetId, rowIndex, columnIndex} = update.start;
      if (!next.has(sheetId) || columnIndex !== 0 || update.rows.length !== 1 || update.fields !== 'userEnteredValue' || rowIndex > next.get(sheetId).length) throw Error('Invalid test batch');
      const row = update.rows[0].values.map(cell => { if (Object.keys(cell.userEnteredValue).join(',') !== 'stringValue') throw Error('Nonliteral test write'); return cell.userEnteredValue.stringValue; });
      next.get(sheetId)[rowIndex] = row;
    }
    if (faults.rejectBatchOnce) { faults.rejectBatchOnce = false; throw Error('Injected whole-batch rejection'); }
    grids = next; calls.applied++;
  }
  return {
    calls, faults, snapshot,
    rows: sheetId => structuredClone(grids.get(sheetId)),
    replaceRows: (sheetId, rows) => { grids.set(sheetId, structuredClone(rows)); },
    editCell: (sheetId, row, col, value) => { grids.get(sheetId)[row][col] = value; },
    overrideCell: (sheetId, row, col, cell) => { cellOverrides.set(`${sheetId}:${row}:${col}`, structuredClone(cell)); },
    quarantine: () => !!quarantine,
    async readSnapshot() { calls.reads++; if (faults.read) throw Error('Synthetic read provider failure with secret that must not escape'); return snapshot(); },
    async commitAtomic(prepared) {
      calls.commits++;
      return locked(async () => {
        if (quarantine) return {status: 'unknown'};
        if (faults.beforeCommit) { const hook = faults.beforeCommit; faults.beforeCommit = null; await hook(prepared); }
        if (faults.hangCommit) return new Promise(() => {});
        if (faults.conflictCount > 0) { faults.conflictCount--; calls.conflicts++; return {status: 'conflict'}; }
        if (!sameGuards(prepared)) { calls.conflicts++; return {status: 'conflict'}; }
        if (faults.unknownBeforeCommitOnce) { faults.unknownBeforeCommitOnce = false; quarantine = structuredClone(prepared); return {status: 'unknown'}; }
        apply(prepared);
        if (faults.loseResponseOnce) { faults.loseResponseOnce = false; throw Error('Synthetic lost response after complete atomic application'); }
        return {status: 'committed', receipt: structuredClone(prepared.receipt)};
      });
    },
    async resolveQuarantine({commit = true} = {}) { return locked(async () => { if (!quarantine) return; if (commit) apply(quarantine); quarantine = null; }); },
  };
}
