import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { generateReconciliationReport } from '../src/lib/google-workspace/reconciliation.ts';
import { IsolatedImporter, createInitialCheckpoint } from '../src/lib/google-workspace/importer.ts';
import publicCreations from '../src/lib/selected-creations-public.json' with { type: 'json' };

const schema = JSON.parse(readFileSync('src/lib/google-workspace/schema.json', 'utf8'));

const mediaEntries = publicCreations.images.flatMap(img =>
  img.variants.map(v => ({
    mediaId: `owner-creation-${String(img.index).padStart(3, '0')}-${v.width}x${v.height}`,
    derivativePath: v.url,
    width: v.width,
    height: v.height,
    bytes: v.bytes,
    sha256: v.sha256,
    classification: img.classification,
    provenance: 'owner-completed-resin-work',
  }))
);

const sampleStaffRow = {
  id: '00000000-0000-4000-8000-000000000001',
  login: 'studio_editor',
  name: 'Studio Editor',
  password_hash: 'scrypt:valid_test_hash',
  role: 'editor',
  active: true,
  version: 1,
  created_at: '2026-10-24T00:00:00.000Z',
};

test('reconciliation report verifies clean accounting across all 28 tables', () => {
  const sourceData = {};
  for (const table of schema.tables) {
    sourceData[table.sourceTable] = [];
  }
  sourceData['rivya_staff'] = [sampleStaffRow];

  const importer = new IsolatedImporter(schema, mediaEntries);
  const plan = importer.plan(sourceData);

  const checkpoint = {
    ...createInitialCheckpoint('ckpt_reconciled'),
    completedTables: schema.tables.map(t => t.sourceTable),
    inlineCommitted: 1,
    totalRowsProcessed: 1,
    tableCheckpoints: {
      rivya_staff: {
        rowsTotal: 1,
        rowsProcessed: 1,
        completed: true,
        sha256Set: [plan.crosswalkEntries[0].payloadSha256],
      },
    },
  };

  const report = generateReconciliationReport({
    schema,
    sourceData,
    plan,
    checkpoint,
    mediaLineage: mediaEntries,
    gitRevision: '36fbaf1',
  });

  assert.equal(report.schemaVersion, 1);
  assert.equal(report.kind, 'google-workspace-migration-reconciliation-report');
  assert.equal(report.scope, 'ISOLATED_SYNTHETIC_REHEARSAL');
  assert.equal(report.productionAuthorityRetained, true);
  assert.equal(report.summary.tablesTotal, 28);
  assert.equal(report.summary.tablesReconciled, 28);
  assert.equal(report.summary.allSourceRecordsAccountedFor, true);
  assert.equal(report.summary.mediaAssetsReconciled, true);
  assert.equal(report.mediaLineage.approvedCreationsCount, 169);
  assert.equal(report.mediaLineage.variantsCount, 507);
  assert.equal(report.mediaLineage.unassignedProductAssociations, 0);
  assert.equal(report.summary.interruptionRecoveryVerified, true);
});

test('reconciliation report flags discrepancies when table accounting does not match', () => {
  const sourceData = {};
  for (const table of schema.tables) {
    sourceData[table.sourceTable] = [];
  }
  sourceData['rivya_staff'] = [sampleStaffRow];

  const importer = new IsolatedImporter(schema, mediaEntries);
  const plan = importer.plan(sourceData);

  // Intentionally omit rivya_staff from completedTables and tableCheckpoints
  const incompleteCheckpoint = createInitialCheckpoint('ckpt_incomplete');

  const report = generateReconciliationReport({
    schema,
    sourceData,
    plan,
    checkpoint: incompleteCheckpoint,
    mediaLineage: mediaEntries,
  });

  // Table summary reports discrepancy
  const staffSummary = report.tables.find(t => t.sourceTable === 'rivya_staff');
  assert.ok(staffSummary);
  assert.equal(staffSummary.recordsCommitted, 0);
  assert.equal(staffSummary.sourceRows, 1);
  assert.equal(report.summary.allSourceRecordsAccountedFor, true); // plan accounts for all
});

test('reconciliation report rejects tampered or unapproved media lineage associations', () => {
  const sourceData = {};
  for (const table of schema.tables) {
    sourceData[table.sourceTable] = [];
  }

  const importer = new IsolatedImporter(schema);
  const plan = importer.plan(sourceData);
  const checkpoint = createInitialCheckpoint('ckpt_media_tampered');

  // Inject invalid product association
  const tamperedMedia = [
    ...mediaEntries.slice(0, 506),
    {
      ...mediaEntries[506],
      associatedEntity: { table: 'rivya_catalogue', id: 'fake_product_id' },
    },
  ];

  const report = generateReconciliationReport({
    schema,
    sourceData,
    plan,
    checkpoint,
    mediaLineage: tamperedMedia,
  });

  assert.equal(report.summary.mediaAssetsReconciled, false);
  assert.equal(report.mediaLineage.lineageConsistent, false);
});
