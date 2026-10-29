/** Actual encrypted source checkpoint, LOCAL current-record proof rehearsal.
 * No requests to Google, SQL or Netlify, no tokens, no target bootstrap/writes. */
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {resolve, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {canonicalArtifactJson, planRecordMutation} from '../../src/lib/google-workspace/record-codec.ts';
import {planSecurityLookupProjection} from '../../src/lib/google-workspace/security-lookup-projection.ts';
import {buildBoundedState, boundedCursor, measureBoundedState} from '../../src/lib/google-workspace/bounded-store.ts';
import {readSecurityCurrentSnapshot, SECURITY_SNAPSHOT_LIMITS} from '../../src/lib/google-workspace/security-current-snapshot.ts';
import {runSecurityOperation} from '../../src/lib/google-workspace/security-operation.ts';
import {planSourceRecord} from './migration.mjs';
import {inspectEncryptedCheckpoint} from './local-recovery.mjs';
import {readPrivateRecoveryFile, writePrivateRecoveryFile, createPrivateRecoveryDirectory} from './local-recovery-files.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const paths = ['tools/google-workspace/rehearse-security-current.mjs', 'src/lib/google-workspace/security-current-snapshot.ts',
  'src/lib/google-workspace/security-operation.ts', 'src/lib/google-workspace/security-lookup-projection.ts',
  'src/lib/google-workspace/bounded-store.ts', 'src/lib/google-workspace/record-codec.ts',
  'src/lib/google-workspace/schema.json', 'tools/google-workspace/migration.mjs', 'tools/google-workspace/local-recovery.mjs'];
const hashes = () => Object.fromEntries(paths.map(path => [path, createHash('sha256').update(readFileSync(join(root, path), 'utf8').replaceAll('\r\n', '\n')).digest('hex')]));
export async function main(args) {
  if (args.length !== 4 || args[0] !== '--checkpoint' || args[2] !== '--directory') throw Error('INVALID_ARGUMENTS');
  const before = hashes(), receipt = JSON.parse((await readPrivateRecoveryFile(resolve(args[1]), 100000)).toString('utf8'));
  if (receipt.evidenceKind !== 'live-source' || receipt.scope !== 'SOURCE_RECORDS_ONLY' || receipt.localIntegrityVerified !== true) throw Error('ACTUAL_CHECKPOINT_REQUIRED');
  const directory = await createPrivateRecoveryDirectory(resolve(args[3]));
  const aggregate = await inspectEncryptedCheckpoint({archivePath: receipt.archivePath, keyPath: receipt.keyPath,
    expectedArchiveSha256: receipt.archiveSha256, expectedManifestSha256: receipt.manifestSha256}, async ({schema, source}) => {
    const layout = {protocol: 'rivya-bounded-v2', key: 'security', workbookId: 'local_security_current_rehearsal',
      rootSheetId: 1, metadataSheetId: 2, dataSheetId: 3, maxPages: 8192, maxMetadataChunks: 64};
    const projection = planSecurityLookupProjection({schema, source, layout, coverageId: 'local-current-rehearsal'});
    const tables = schema.tables.filter(table => table.workbook === 'security');
    const sourceRecords = tables.flatMap(table => source[table.sourceTable].map(row => {
      const planned = planSourceRecord(table, row);
      if (planned.disposition !== 'inline') throw Error('UNSUPPORTED_SECURITY_SOURCE');
      return planned.record;
    }));
    const records = [...sourceRecords, ...projection.claims, projection.marker];
    const plans = records.map(record => planRecordMutation({current: null, previousMutation: null, actor: {id: 'local-current-rehearsal'},
      now: receipt.createdAt, authorize: () => true, command: {recordId: record.recordId, expectedRevision: 0,
        mutationId: record.lastMutationId, payload: record.payload, sourceUpdatedAt: record.sourceUpdatedAt, archivedAt: record.archivedAt}}));
    const state = buildBoundedState({layout, epoch: 'local-current-rehearsal', plans});
    const coverage = {format: 'rivya-security-lookup-coverage-v1', ...projection.coverageProposal, root: boundedCursor(state.root)};
    let manifestReads = 0, pageReads = 0; const proofPages = new Set();
    const provider = {
      async readManifest() { manifestReads++; return structuredClone({root: state.root, manifest: state.manifest}); },
      async readPages(base, ids) {
        if (canonicalArtifactJson(base.root) !== canonicalArtifactJson(state.root)) throw Error('LOCAL_ROOT_MISMATCH');
        pageReads++; ids.forEach(id => proofPages.add(id)); return ids.map(id => structuredClone(state.pages.find(page => page.id === id)));
      },
      async commit() { throw Error('READ_ONLY_REHEARSAL'); },
    };
    const snapshot = await runSecurityOperation(30000, {}, operation => readSecurityCurrentSnapshot(layout, coverage,
      'owner-epoch:unprovisioned-rehearsal-reference', provider, operation));
    for (const record of sourceRecords) if (canonicalArtifactJson(record) !== canonicalArtifactJson(snapshot.records.get(record.recordId))) throw Error('SOURCE_ROUNDTRIP_MISMATCH');
    return {sourceTables: schema.tables.length, sourceRows: Object.values(source).reduce((sum, rows) => sum + rows.length, 0),
      securityTableCounts: Object.fromEntries(tables.map(table => [table.sourceTable, source[table.sourceTable].length])),
      securitySourceRecords: sourceRecords.length, claims: projection.claims.length, syntheticCoverageMarkers: 1,
      sourceRecordsExactlyMatched: true, currentRecords: snapshot.records.size, localManifestReads: manifestReads,
      localPageReadBatches: pageReads, localProofPagesRead: proofPages.size, safetyCeilings: SECURITY_SNAPSHOT_LIMITS,
      measurement: measureBoundedState(layout, state)};
  });
  if (canonicalArtifactJson(before) !== canonicalArtifactJson(hashes())) throw Error('SOURCE_CHANGED_DURING_REHEARSAL');
  const report = {...aggregate, kind: 'actual-encrypted-checkpoint-local-security-current-proof', checkedAt: new Date().toISOString(),
    sourceCheckpointCreatedAt: receipt.createdAt, sourceCheckpointIntegrityVerified: true, codeHashes: before,
    providerRequests: 0, sourceWrites: 0, targetWrites: 0, sourceRowsPersisted: 0, lookupCoverageRegistered: false,
    ownerEpochProvisioned: false, currentProductionInventory: false, providerVerified: false,
    limitations: ['Current records from the dated encrypted checkpoint; not a fresh production inventory.',
      'One explicitly synthetic coverage marker and local bootstrap history wrappers; no installed Google registration or source-history migration.',
      'Owner epoch was not created or inferred. No session was authenticated, refreshed, archived or issued.',
      'No media, full SQL schema, off-device restore, free-plan capacity or real provider latency/quota acceptance.']};
  await writePrivateRecoveryFile(join(directory, 'security-current-rehearsal.json'), Buffer.from(JSON.stringify(report, null, 2) + '\n'));
  return report;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { console.log(JSON.stringify(await main(process.argv.slice(2)))); }
  catch (error) { console.error(JSON.stringify({ok: false, code: /^[A-Z_]+$/.test(error?.message ?? '') ? error.message : 'SECURITY_REHEARSAL_FAILED',
    providerRequests: 0, targetWrites: 0, sourceRowsPersisted: 0})); process.exitCode = 1; }
}
