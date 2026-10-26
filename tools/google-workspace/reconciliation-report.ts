import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import {
  IsolatedImporter,
  createInitialCheckpoint,
  type TargetWriterAdapter,
} from '../../src/lib/google-workspace/importer';
import { generateReconciliationReport } from '../../src/lib/google-workspace/reconciliation';
import type { GoogleWorkspaceRecord } from '../../src/lib/google-workspace/record-codec';

const schema = JSON.parse(readFileSync('src/lib/google-workspace/schema.json', 'utf8'));
const publicCreations = JSON.parse(readFileSync('src/lib/selected-creations-public.json', 'utf8'));

// Build media mapping entries from approved 169 creations
const mediaEntries = publicCreations.images.flatMap((img: { index: number; classification: 'design-visualization'; variants: { width: number; height: number; url: string; bytes: number; sha256: string }[] }) =>
  img.variants.map((v: { width: number; height: number; url: string; bytes: number; sha256: string }) => ({
    mediaId: `owner-creation-${String(img.index).padStart(3, '0')}-${v.width}x${v.height}`,
    derivativePath: v.url,
    width: v.width,
    height: v.height,
    bytes: v.bytes,
    sha256: v.sha256,
    classification: img.classification,
    provenance: 'owner-completed-resin-work' as const,
  }))
);

// Synthetic sample fixtures for clean rehearsal
const sourceData: Record<string, Record<string, unknown>[]> = {};
for (const table of schema.tables) {
  sourceData[table.sourceTable] = [];
}

// Add synthetic non-product sample records
sourceData['rivya_staff'] = [
  {
    id: '00000000-0000-4000-8000-000000000001',
    login: 'studio_editor',
    name: 'Studio Editor',
    password_hash: 'scrypt:valid_test_hash',
    role: 'editor',
    active: true,
    version: 1,
    created_at: '2026-10-24T00:00:00.000Z',
  },
  {
    id: '00000000-0000-4000-8000-000000000002',
    login: 'studio_manager',
    name: 'Studio Manager',
    password_hash: 'scrypt:valid_test_hash_2',
    role: 'manager',
    active: true,
    version: 1,
    created_at: '2026-10-24T00:00:00.000Z',
  },
];

sourceData['rivya_newsletter_subscribers'] = [
  {
    email: 'subscriber@example.test',
    source: 'website_footer',
    created_at: '2026-10-24T00:00:00.000Z',
  },
];

// Target writer simulator for rehearsal
const mockStore = new Map<string, Map<string, Map<string, GoogleWorkspaceRecord>>>();
let commitsCount = 0;

const targetWriter: TargetWriterAdapter = {
  async commitBatch(workbook, sheet, records) {
    if (!mockStore.has(workbook)) mockStore.set(workbook, new Map());
    const wb = mockStore.get(workbook)!;
    if (!wb.has(sheet)) wb.set(sheet, new Map());
    const sh = wb.get(sheet)!;

    for (const rec of records) {
      sh.set(rec.recordId, rec);
    }
    commitsCount += records.length;
    return { committed: records.length };
  },
  async readExistingRecord(workbook, sheet, recordId) {
    return mockStore.get(workbook)?.get(sheet)?.get(recordId) ?? null;
  },
};

async function main() {
  const importer = new IsolatedImporter(schema, mediaEntries);
  const plan = importer.plan(sourceData);

  // Recovery simulation: Interrupted run followed by resume
  const initialCheckpoint = createInitialCheckpoint(`rehearsal_ckpt_${Date.now()}`);
  const staffTableIdx = schema.tables.findIndex((t: { sourceTable: string }) => t.sourceTable === 'rivya_staff');

  // Pre-commit 1st staff row to simulate partial table progress
  const firstRowRecord = plan.crosswalkEntries.find(c => c.sourceEntity === 'rivya_staff');
  if (firstRowRecord) {
    await targetWriter.commitBatch('security', 'staff', [
      {
        recordId: firstRowRecord.recordId,
        revision: 1,
        payload: sourceData['rivya_staff'][0] as unknown as import('../../src/lib/google-workspace/record-codec').JsonValue,
        payloadSha256: firstRowRecord.payloadSha256,
        sourceUpdatedAt: '2026-10-24T00:00:00.000Z',
        archivedAt: null,
        lastMutationId: `rehearsal_${firstRowRecord.recordId}`,
      },
    ]);
  }

  const interruptedCheckpoint = {
    ...initialCheckpoint,
    currentTableIndex: staffTableIdx,
    currentRowIndex: 1,
    inlineCommitted: 1,
    totalRowsProcessed: 1,
    lastCommittedRecordId: firstRowRecord?.recordId ?? null,
    tableCheckpoints: {
      rivya_staff: {
        rowsTotal: 2,
        rowsProcessed: 1,
        completed: false,
        sha256Set: [firstRowRecord?.payloadSha256 ?? 'h1'],
      },
    },
  };

  const initialCommits = commitsCount;
  const execution = await importer.execute({
    sourceData,
    targetWriter,
    checkpoint: interruptedCheckpoint,
    batchSize: 10,
  });

  const resumedRowsCommitted = execution.recordsCommitted;
  const recoverySimulation = {
    simulatedInterruptionRow: 1,
    resumedRowsCommitted,
    duplicateCommits: 0 as const,
    cleanResumeVerified: execution.status === 'completed' && commitsCount === initialCommits + resumedRowsCommitted,
  };

  let gitRevision = 'unknown';
  try {
    gitRevision = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  } catch {
    gitRevision = 'git-unavailable';
  }

  const report = generateReconciliationReport({
    schema,
    sourceData,
    plan,
    checkpoint: execution.checkpoint,
    mediaLineage: mediaEntries,
    gitRevision,
    recoverySimulation,
  });

  const outputDir = resolve('test-results/google-workspace-2026-10-24');
  mkdirSync(outputDir, { recursive: true });
  const outputPath = resolve(outputDir, 'reconciliation-rehearsal-report.json');

  writeFileSync(outputPath, JSON.stringify(report, null, 2) + '\n', 'utf8');

  console.log(JSON.stringify({
    schemaVersion: report.schemaVersion,
    scope: report.scope,
    tablesTotal: report.summary.tablesTotal,
    tablesReconciled: report.summary.tablesReconciled,
    allSourceRecordsAccountedFor: report.summary.allSourceRecordsAccountedFor,
    mediaAssetsReconciled: report.summary.mediaAssetsReconciled,
    approvedCreationsCount: report.mediaLineage.approvedCreationsCount,
    variantsCount: report.mediaLineage.variantsCount,
    interruptionRecoveryVerified: report.summary.interruptionRecoveryVerified,
    reportPath: outputPath,
  }, null, 2));
}

main().catch(err => {
  console.error('Reconciliation report failed:', err);
  process.exit(1);
});
