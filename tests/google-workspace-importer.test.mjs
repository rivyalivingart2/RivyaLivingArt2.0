import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {
  IsolatedImporter,
  createInitialCheckpoint,
} from '../src/lib/google-workspace/importer.ts';
import publicCreations from '../src/lib/selected-creations-public.json' with {type: 'json'};

const schema = JSON.parse(readFileSync('src/lib/google-workspace/schema.json', 'utf8'));

// Exact schema-conforming fixtures
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

const sampleSubscriberRow = {
  email: 'subscriber@example.test',
  source: 'website_footer',
  created_at: '2026-10-24T00:00:00.000Z',
};

function createMockWriter() {
  const storage = new Map();
  let commitsCount = 0;

  return {
    storage,
    get commitsCount() { return commitsCount; },
    async commitBatch(workbook, sheet, records) {
      if (!storage.has(workbook)) storage.set(workbook, new Map());
      const wb = storage.get(workbook);
      if (!wb.has(sheet)) wb.set(sheet, new Map());
      const sh = wb.get(sheet);

      for (const rec of records) {
        sh.set(rec.recordId, rec);
      }
      commitsCount += records.length;
      return {committed: records.length};
    },
    async readExistingRecord(workbook, sheet, recordId) {
      return storage.get(workbook)?.get(sheet)?.get(recordId) ?? null;
    },
  };
}

test('initial checkpoint creation produces valid version 1 structure', () => {
  const ckpt = createInitialCheckpoint('ckpt_test_001', '2026-10-26T12:00:00.000Z');
  assert.equal(ckpt.schemaVersion, 1);
  assert.equal(ckpt.checkpointId, 'ckpt_test_001');
  assert.equal(ckpt.currentTableIndex, 0);
  assert.equal(ckpt.currentRowIndex, 0);
  assert.equal(ckpt.completedTables.length, 0);
  assert.equal(ckpt.inlineCommitted, 0);
  assert.equal(ckpt.driveArtifactsPlanned, 0);
  assert.equal(ckpt.conflictsRecorded, 0);
});

test('importer plan validates all 28 tables and produces deterministic crosswalks', () => {
  const sourceData = {};
  for (const table of schema.tables) {
    sourceData[table.sourceTable] = [];
  }
  sourceData['rivya_staff'] = [sampleStaffRow];
  sourceData['rivya_newsletter_subscribers'] = [sampleSubscriberRow];

  const importer = new IsolatedImporter(schema);
  const plan = importer.plan(sourceData);

  assert.equal(plan.tablesPlanned, 28);
  assert.equal(plan.totalRows, 2);
  assert.equal(plan.inlineCount, 2);
  assert.equal(plan.driveArtifactCount, 0);
  assert.equal(plan.crosswalkEntries.length, 2);

  const staffCrosswalk = plan.crosswalkEntries.find(c => c.sourceEntity === 'rivya_staff');
  assert.ok(staffCrosswalk);
  assert.equal(staffCrosswalk.destinationWorkbook, 'security');
  assert.equal(staffCrosswalk.destinationSheet, 'staff');
  assert.ok(staffCrosswalk.recordId.startsWith('r_'));
  assert.equal(staffCrosswalk.payloadSha256.length, 64);

  const subscriberCrosswalk = plan.crosswalkEntries.find(c => c.sourceEntity === 'rivya_newsletter_subscribers');
  assert.ok(subscriberCrosswalk);
  assert.equal(subscriberCrosswalk.destinationWorkbook, 'operations');
  assert.equal(subscriberCrosswalk.destinationSheet, 'newsletter_subscribers');
});

test('importer execute commits all records and marks checkpoint completed', async () => {
  const sourceData = {};
  for (const table of schema.tables) {
    sourceData[table.sourceTable] = [];
  }
  sourceData['rivya_staff'] = [sampleStaffRow];
  sourceData['rivya_newsletter_subscribers'] = [sampleSubscriberRow];

  const writer = createMockWriter();
  const importer = new IsolatedImporter(schema);

  const result = await importer.execute({
    sourceData,
    targetWriter: writer,
    batchSize: 10,
  });

  assert.equal(result.status, 'completed');
  assert.equal(result.recordsCommitted, 2);
  assert.equal(result.conflictsEncountered, 0);
  assert.equal(result.checkpoint.inlineCommitted, 2);
  assert.equal(result.checkpoint.completedTables.length, 28);
  assert.equal(writer.commitsCount, 2);

  const plan = importer.plan(sourceData);
  const staffRecordId = plan.crosswalkEntries.find(c => c.sourceEntity === 'rivya_staff').recordId;
  const storedStaff = await writer.readExistingRecord('security', 'staff', staffRecordId);
  assert.ok(storedStaff);
});

test('interrupted import preserves checkpoint and resumes without duplicate commits', async () => {
  const multiStaffRows = [
    {...sampleStaffRow, id: '00000000-0000-4000-8000-000000000001', login: 's1'},
    {...sampleStaffRow, id: '00000000-0000-4000-8000-000000000002', login: 's2'},
    {...sampleStaffRow, id: '00000000-0000-4000-8000-000000000003', login: 's3'},
    {...sampleStaffRow, id: '00000000-0000-4000-8000-000000000004', login: 's4'},
  ];

  const sourceData = {};
  for (const table of schema.tables) {
    sourceData[table.sourceTable] = [];
  }
  sourceData['rivya_staff'] = multiStaffRows;

  const writer = createMockWriter();
  const importer = new IsolatedImporter(schema);

  // Run 1: Normal run
  const run1 = await importer.execute({
    sourceData,
    targetWriter: writer,
    batchSize: 2,
  });

  assert.equal(run1.status, 'completed');
  assert.equal(writer.commitsCount, 4);

  // Now simulate a true interruption at row 2:
  const initialCkpt = createInitialCheckpoint('sim_interrupt');
  const staffTableIdx = schema.tables.findIndex(t => t.sourceTable === 'rivya_staff');
  assert.ok(staffTableIdx >= 0);

  const interruptedWriter = createMockWriter();
  // Pre-commit first 2 rows
  await interruptedWriter.commitBatch('security', 'staff', [
    {recordId: 'r_part1', revision: 1, payload: multiStaffRows[0], payloadSha256: 'h1'},
    {recordId: 'r_part2', revision: 1, payload: multiStaffRows[1], payloadSha256: 'h2'},
  ]);

  const interruptedCkpt = {
    ...initialCkpt,
    currentTableIndex: staffTableIdx,
    currentRowIndex: 2,
    inlineCommitted: 2,
    totalRowsProcessed: 2,
    lastCommittedRecordId: 'r_part2',
    tableCheckpoints: {
      rivya_staff: {
        rowsTotal: 4,
        rowsProcessed: 2,
        completed: false,
        sha256Set: ['h1', 'h2'],
      },
    },
  };

  // Run 2: Resume from interrupted checkpoint
  const run2 = await importer.execute({
    sourceData,
    targetWriter: interruptedWriter,
    checkpoint: interruptedCkpt,
    batchSize: 5,
  });

  assert.equal(run2.status, 'completed');
  // It only committed the remaining 2 rows (rows 2 and 3)
  assert.equal(run2.recordsCommitted, 2);
  assert.equal(interruptedWriter.commitsCount, 4); // 2 from before + 2 from resume
  assert.equal(run2.checkpoint.inlineCommitted, 4);
});

test('existing destination record with conflicting payloadSha256 is recorded as conflict', async () => {
  const sourceData = {};
  for (const table of schema.tables) {
    sourceData[table.sourceTable] = [];
  }
  sourceData['rivya_staff'] = [sampleStaffRow];

  const writer = createMockWriter();
  const importer = new IsolatedImporter(schema);
  const plan = importer.plan(sourceData);
  const staffRecordId = plan.crosswalkEntries.find(c => c.sourceEntity === 'rivya_staff').recordId;

  await writer.commitBatch('security', 'staff', [{
    recordId: staffRecordId,
    revision: 1,
    payload: {...sampleStaffRow, name: 'Conflicting Name'},
    payloadSha256: '0000000000000000000000000000000000000000000000000000000000000000',
  }]);

  const result = await importer.execute({
    sourceData,
    targetWriter: writer,
  });

  assert.equal(result.conflictsEncountered, 1);
  assert.equal(result.recordsCommitted, 0); // Did not overwrite conflicting record
});

test('media mapping lineage preserves all 169 approved creations and 507 variants', () => {
  assert.equal(publicCreations.schemaVersion, 1);
  assert.equal(publicCreations.featured.length, 6);
  assert.equal(publicCreations.images.length, 169);

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

  assert.equal(mediaEntries.length, 507);
  for (const entry of mediaEntries) {
    assert.match(entry.sha256, /^[a-f0-9]{64}$/);
    assert.ok(entry.bytes > 0);
    assert.ok([640, 960, 1600].includes(entry.width));
    assert.equal(entry.classification, 'design-visualization');
    assert.equal(entry.provenance, 'owner-completed-resin-work');
    assert.equal(entry.associatedEntity, undefined); // No invented associations!
  }

  const importer = new IsolatedImporter(schema, mediaEntries);
  const plan = importer.plan({
    rivya_access_requests: [], rivya_audit: [], rivya_business_settings: [],
    rivya_catalogue: [], rivya_content: [], rivya_editorial_extension_revisions: [],
    rivya_editorial_extensions: [], rivya_erasure_ledger: [], rivya_inquiries: [],
    rivya_inquiry_notes: [], rivya_inquiry_upload_sessions: [], rivya_managed_exports: [],
    rivya_migration_markers: [], rivya_newsletter_subscribers: [], rivya_presentation_revisions: [],
    rivya_presentations: [], rivya_privacy_controls: [], rivya_public_media: [],
    rivya_references: [], rivya_restoration_conflicts: [], rivya_restoration_crosswalk: [],
    rivya_revisions: [], rivya_staff: [], rivya_storage_budget: [],
    rivya_studio_login_limits: [], rivya_studio_order_events: [], rivya_studio_orders: [],
    rivya_studio_sessions: [],
  });

  assert.equal(plan.mediaEntries.length, 507);
});
