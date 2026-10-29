/** Synthetic source only. No actual checkpoint, source connection or provider. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {readFile, access} from 'node:fs/promises';
import {resolve, join} from 'node:path';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {rehearseSourceDocuments, main} from '../tools/google-workspace/rehearse-source-documents.mjs';
import {planSourceRecord} from '../tools/google-workspace/migration.mjs';
import {createPrivateRecoveryDirectory, writePrivateRecoveryFile} from '../tools/google-workspace/local-recovery-files.mjs';

const table = {sourceTable: 'rivya_fixture_documents', workbook: 'content', primaryKey: ['id'], fields: [
  {name: 'id', sqlType: 'text', representation: 'text', nullable: false},
  {name: 'amount', sqlType: 'bigint', representation: 'decimal-string', nullable: false},
  {name: 'payload', sqlType: 'jsonb', representation: 'preserved-json', nullable: false},
  {name: 'updated_at', sqlType: 'timestamp with time zone', representation: 'text', nullable: false},
], constraints: [{name: 'fixture_pk', definition: 'PRIMARY KEY (id)'}]};
const schema = {tables: [table]};
const row = (id, text) => ({id, amount: '9007199254740993',
  payload: {text, signedZero: -0, formula: '=SUM(A1)'}, updated_at: '2026-10-29T00:00:00.000Z'});
const directory = () => resolve('test-results', 'document-rehearsal-fixture-' + randomUUID());

test('all oversized fixture rows pass complete-payload, journal cold-reopen and full bounded-format rehearsal without duplicate emulator creates', async () => {
  const rows = [row('private-source-inline', 'small'),
    row('private-source-one', 'ખાનગી'.repeat(12_000)),
    row('private-source-two', 'पूर्ण'.repeat(12_000)),
    row('private-source-three', 'private-source-body:'.repeat(3_000))];
  const source = {[table.sourceTable]: rows}, target = directory();
  const expected = rows.map(value => planSourceRecord(table, value)).filter(value => value.disposition === 'drive-artifact-required');
  assert.equal(expected.length, 3);
  const report = await rehearseSourceDocuments({schema, source, directory: target});
  assert.equal(report.sourceRows, 4); assert.equal(report.inlineRecords, 1); assert.equal(report.oversizedDocuments, 3);
  assert.equal(report.documentPayloadBytes, expected.reduce((sum, plan) => sum + plan.bytes, 0));
  assert.equal(report.verifiedDocumentPasses, 6); assert.equal(report.completeSourcePayloadHashesMatched, true);
  assert.equal(report.localEmulator.creates, 3); assert.equal(report.localEmulator.duplicateCreates, 0);
  assert.equal(report.localEmulator.createAttempts, 3); assert.equal(report.localEmulator.duplicateCreateAttempts, 0);
  assert.equal(report.localEmulator.deliberatelyLostCreateAcknowledgements, 1);
  assert.equal(report.localJournal.entries, 6); assert.equal(report.localJournal.coldReopens, 1);
  assert.equal(report.localJournal.repeatedDocuments, 3); assert.equal(report.localJournal.closedCleanly, true);
  assert.equal(report.processRestarts, 0); assert.equal(report.emulatorStateSurvivedProcessRestart, false);
  assert.equal(report.sourceRowsPersisted, 0); assert.equal(report.targetWrites, 0); assert.equal(report.canonicalWritten, false);
  assert.equal(report.providerVerified, false); assert.equal(report.completeTargetCapacityVerified, false);
  assert.deepEqual(report.emulatedReferenceIdentifierCharacters, {fileId: 160, parentId: 160});
  const modeled = report.completeBoundedModel;
  assert.equal(modeled.records, 4); assert.equal(modeled.documentReferences, 3); assert.equal(modeled.completeLocalPayloadModel, true);
  const content = modeled.workbooks.find(value => value.workbook === 'content');
  assert.equal(content.historyCoverage.history, 4); assert.equal(content.records, 4); assert.equal(content.emulatedDocumentReferences, 3);
  assert.equal(content.preparedUpdateFits, true); assert.equal(content.fitsReadBudgets, true);
  const journal = await readFile(join(target, 'document-operations.jsonl'), 'utf8');
  assert.equal(journal.trim().split('\n').length, 7);
  for (const value of rows) { assert.ok(!journal.includes(value.id)); assert.ok(!journal.includes(value.payload.text)); }
  assert.ok(!journal.includes('9007199254740993'));
  const publicEvidence = JSON.stringify(report);
  for (const plan of expected) { assert.ok(!publicEvidence.includes(plan.recordId)); assert.ok(!publicEvidence.includes(plan.payloadSha256)); }
  assert.ok(!publicEvidence.includes('local_document_emulator_'));
  await assert.rejects(access(join(target, 'document-operations.lock')), {code: 'ENOENT'});
});

test('aborted, oversized and all-inline inputs reject before creating a journal', async () => {
  const aborted = new AbortController(); aborted.abort();
  for (const input of [
    {source: {[table.sourceTable]: [row('one', 'x'.repeat(50_000))]}, signal: aborted.signal, code: 'ABORTED'},
    {source: {[table.sourceTable]: [row('one', 'x'.repeat(5 * 1024 * 1024))]}, code: 'RESUMABLE_UPLOAD_REQUIRED'},
    {source: {[table.sourceTable]: [row('one', 'small')]}, code: 'NO_OVERSIZED_DOCUMENTS'},
  ]) {
    const target = directory();
    await assert.rejects(rehearseSourceDocuments({schema, source: input.source, directory: target, signal: input.signal}), {code: input.code});
    await assert.rejects(access(target), {code: 'ENOENT'});
  }
});

test('CLI rejects synthetic or malformed checkpoint requests and emits only a sanitized failure', async () => {
  const target = directory(); await createPrivateRecoveryDirectory(target);
  const checkpoint = join(target, 'checkpoint-receipt.json');
  await writePrivateRecoveryFile(checkpoint, Buffer.from(JSON.stringify({
    evidenceKind: 'synthetic-fixture', scope: 'SOURCE_RECORDS_ONLY', localIntegrityVerified: true,
    archivePath: 'synthetic-private-marker', keyPath: 'synthetic-private-marker',
  })));
  await assert.rejects(main(['--checkpoint', checkpoint, '--directory', directory()]), {code: 'ACTUAL_CHECKPOINT_REQUIRED'});
  try {
    await promisify(execFile)(process.execPath, ['--import', 'tsx', 'tools/google-workspace/rehearse-source-documents.mjs', '--invalid', 'synthetic-private-marker'],
      {cwd: resolve('.'), windowsHide: true});
    assert.fail('invalid arguments must fail');
  } catch (error) {
    assert.equal(error.code, 1); assert.equal(error.stdout, '');
    const report = JSON.parse(error.stderr.trim());
    assert.equal(report.code, 'INVALID_ARGUMENTS'); assert.equal(report.providerVerified, false);
    assert.equal(report.targetWrites, 0); assert.ok(!error.stderr.includes('synthetic-private-marker'));
  }
});
