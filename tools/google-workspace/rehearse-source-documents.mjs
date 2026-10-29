/** Actual encrypted source -> LOCAL Drive emulator + private operator journal.
 * No network, Google resource IDs, canonical writes or application authority.
 * Payload bytes remain in memory; the private journal stores only registrations,
 * digests and reference envelopes. Never treat this as a target migration. */
import {createHash, randomUUID} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {inspectEncryptedCheckpoint} from './local-recovery.mjs';
import {readPrivateRecoveryFile, writePrivateRecoveryFile} from './local-recovery-files.mjs';
import {openLocalSourceDocumentJournal} from './source-document-local-journal.mjs';
import {createSourceDocumentMigrationBridge} from './source-document-migration.mjs';
import {planSourceRecord, reconcileSource} from './migration.mjs';
import {MAX_MULTIPART_ARTIFACT_BYTES} from '../../src/lib/google-workspace/drive-json-rest.ts';
import {canonicalArtifactJson, decodeRecord, planRecordMutation} from '../../src/lib/google-workspace/record-codec.ts';
import {BOUNDED_PROTOCOL, BOUNDED_LIMITS, buildBoundedState, auditBoundedState, measureBoundedState,
  readBoundedRecords, requiredBoundedPageIds, prepareBoundedCommit, boundedRequestBytes} from '../../src/lib/google-workspace/bounded-store.ts';

const fail = code => { throw Object.assign(new Error(code), {code}); };
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const same = (left, right) => canonicalArtifactJson(left) === canonicalArtifactJson(right);
const checkSignal = signal => { if (signal?.aborted) fail('ABORTED'); };
const privacyPolicy = {ownerEmail: 'local-document-emulator@example.invalid', allowedUsers: []};
const filesToHash = [
  'tools/google-workspace/rehearse-source-documents.mjs',
  'tools/google-workspace/source-document-migration.mjs',
  'tools/google-workspace/source-document-local-journal.mjs',
  'tools/google-workspace/migration.mjs',
  'tools/google-workspace/local-recovery.mjs',
  'tools/google-workspace/local-recovery-files.mjs',
  'src/lib/google-workspace/drive-documents.ts',
  'src/lib/google-workspace/record-codec.ts',
  'src/lib/google-workspace/bounded-store.ts',
];
const repository = fileURLToPath(new URL('../../', import.meta.url));
const codeHashes = () => Object.fromEntries(filesToHash.map(path => [path,
  hash(readFileSync(join(repository, path), 'utf8').replaceAll('\r\n', '\n'))]));

async function measureCompleteBoundedRepresentation({schema, source, stagedRecords, signal}) {
  const keys = ['content', 'operations', 'security', 'system'];
  const groups = new Map(keys.map(key => [key, {plans: [], documents: 0}]));
  const actor = {id: 'local-document-capacity-model'}, now = new Date().toISOString();
  for (const table of schema.tables) {
    const group = groups.get(table.workbook);
    if (!group) fail('UNMAPPED_WORKBOOK');
    for (const row of source[table.sourceTable]) {
      checkSignal(signal);
      const sourcePlan = planSourceRecord(table, row);
      const record = sourcePlan.disposition === 'inline' ? sourcePlan.record : stagedRecords.get(sourcePlan.recordId);
      if (!record) fail('MISSING_STAGED_DOCUMENT');
      if (sourcePlan.disposition !== 'inline') {
        group.documents++;
        if (record.payload?.artifact?.sha256 !== sourcePlan.payloadSha256 ||
            record.payload?.artifact?.bytes !== sourcePlan.bytes) fail('SOURCE_ROUND_TRIP_MISMATCH');
      }
      const plan = planRecordMutation({current: null, previousMutation: null, actor, now, authorize: () => true,
        command: {recordId: record.recordId, expectedRevision: 0, mutationId: record.lastMutationId,
          payload: record.payload, sourceUpdatedAt: record.sourceUpdatedAt, archivedAt: record.archivedAt}});
      if (plan.kind !== 'apply' || !same(plan.record, record)) fail('SOURCE_ENCODING_MISMATCH');
      group.plans.push(plan);
    }
  }
  const workbooks = [];
  for (const [workbook, group] of groups) {
    checkSignal(signal);
    const layout = {protocol: BOUNDED_PROTOCOL, key: workbook, workbookId: 'local_fixture_' + workbook,
      rootSheetId: 1, metadataSheetId: 2, dataSheetId: 3, maxPages: 8192, maxMetadataChunks: 64};
    const state = buildBoundedState({layout, epoch: 'local-complete-document-model', plans: group.plans});
    const historyCoverage = auditBoundedState(layout, state), measurement = measureBoundedState(layout, state);
    const restored = readBoundedRecords(layout, state, group.plans.map(plan => plan.record.recordId));
    if (restored.size !== group.plans.length || group.plans.some(plan => !same(restored.get(plan.record.recordId), plan.record))) fail('LOCAL_TARGET_ROUND_TRIP_MISMATCH');
    const candidates = [...group.plans].sort((left, right) =>
      canonicalArtifactJson(right.record.payload).length - canonicalArtifactJson(left.record.payload).length).slice(0, 8);
    const preparedSizes = [], workingPages = [];
    for (const [index, plan] of candidates.entries()) {
      checkSignal(signal);
      const command = {recordId: plan.record.recordId, expectedRevision: 1, mutationId: 'local-model-update-' + index,
        payload: plan.record.payload, sourceUpdatedAt: plan.record.sourceUpdatedAt, archivedAt: plan.record.archivedAt};
      const ids = requiredBoundedPageIds(state.manifest, [command]);
      const result = await prepareBoundedCommit({layout, state: {...state, pages: state.pages.filter(page => ids.includes(page.id))},
        commands: [command], actor, operationId: 'local-model-operation-' + index, now,
        policy: {authorize: () => true, validate: () => true}});
      if (result.kind !== 'commit') fail('INVALID_CAPACITY_PREPARATION');
      preparedSizes.push(boundedRequestBytes('commit', result.prepared)); workingPages.push(ids.length);
    }
    const maximumWorkingPages = workingPages.length ? Math.max(...workingPages) : 0;
    workbooks.push({workbook, records: group.plans.length, inlineRecords: group.plans.length - group.documents,
      emulatedDocumentReferences: group.documents, historyCoverage, ...measurement,
      representationPayloadHashesMatched: true,
      maximumPreparedRequestBytes: preparedSizes.length ? Math.max(...preparedSizes) : null,
      representativeUnchangedPayloadUpdates: preparedSizes.length, maximumWorkingPages,
      maximumReadRequestsPerPreparedUpdate: preparedSizes.length ? 1 + Math.ceil(maximumWorkingPages / BOUNDED_LIMITS.readPagesPerRequest) : 0,
      maximumRequestsIncludingCommit: preparedSizes.length ? 2 + Math.ceil(maximumWorkingPages / BOUNDED_LIMITS.readPagesPerRequest) : 0,
      preparedUpdateFits: preparedSizes.every(bytes => bytes <= BOUNDED_LIMITS.requestBytes), providerLatencyMeasured: false});
  }
  return {kind: 'local-complete-source-representation-with-emulated-artifact-references', workbooks,
    records: workbooks.reduce((sum, value) => sum + value.records, 0),
    documentReferences: workbooks.reduce((sum, value) => sum + value.emulatedDocumentReferences, 0),
    completeLocalPayloadModel: true, completeTargetCapacityVerified: false, providerVerified: false,
    wrapperActorAndCommitTimesAreSynthetic: true, targetWrites: 0};
}

/** Uses the actual bridge and actual fsynced journal, with a closed local
 * emulator. Provider objects and payloads are deliberately not injectable. */
export async function rehearseSourceDocuments({schema, source, directory, signal}) {
  checkSignal(signal);
  const relationships = reconcileSource(schema, source);
  const runId = randomUUID().replaceAll('-', '');
  const parentId = ('local_document_emulator_folder_' + runId).padEnd(160, 'x');
  const documents = [], registrations = new Map(), bytesById = new Map(), stagedRecords = new Map();
  let inlineRecords = 0, documentBytes = 0, maximumDocumentBytes = 0;
  for (const table of schema.tables) {
    for (const row of source[table.sourceTable]) {
      checkSignal(signal);
      const plan = planSourceRecord(table, row);
      if (plan.disposition === 'inline') { inlineRecords++; continue; }
      if (plan.disposition !== 'drive-artifact-required' || plan.driveFileId !== null) fail('SOURCE_PLAN_MISMATCH');
      if (plan.bytes > MAX_MULTIPART_ARTIFACT_BYTES) fail('RESUMABLE_UPLOAD_REQUIRED');
      const fileId = ('local_document_emulator_' + runId + '_' + documents.length).padEnd(160, 'x');
      const registration = {fileId, parentId, purpose: 'record-payload', ownerId: plan.recordId};
      registrations.set(fileId, registration);
      documents.push({table, row, plan, registration});
      documentBytes += plan.bytes;
      maximumDocumentBytes = Math.max(maximumDocumentBytes, plan.bytes);
    }
  }
  if (documents.length === 0) fail('NO_OVERSIZED_DOCUMENTS');
  // A fixture label is not a returned Google resource ID. These registration
  // values may appear only inside the private operator journal and this heap.
  let emulatorCreates = 0, createAttempts = 0, duplicateCreateAttempts = 0, metadataReads = 0, payloadReads = 0, privacyReads = 0;
  let lostCreateAcknowledgements = 0, journalColdReopens = 0, verifiedPasses = 0;
  const io = {
    async metadata(fileId, operationSignal) {
      checkSignal(operationSignal);
      if (!registrations.has(fileId)) fail('EMULATOR_REGISTRATION_MISMATCH');
      metadataReads++;
      const bytes = bytesById.get(fileId);
      return bytes ? {id: fileId, mimeType: 'application/json', parents: [parentId], trashed: false, size: bytes.length} : null;
    },
    async read(fileId, maximumBytes, operationSignal) {
      checkSignal(operationSignal);
      const bytes = bytesById.get(fileId);
      if (!registrations.has(fileId) || !bytes || bytes.length > maximumBytes) fail('EMULATOR_READ_MISMATCH');
      payloadReads++;
      return new Uint8Array(bytes);
    },
    async create(request, operationSignal) {
      checkSignal(operationSignal);
      createAttempts++;
      if (bytesById.has(request.fileId)) duplicateCreateAttempts++;
      if (!registrations.has(request.fileId) || request.parentId !== parentId || request.mimeType !== 'application/json' ||
          !(request.bytes instanceof Uint8Array) || bytesById.has(request.fileId)) fail('EMULATOR_CREATE_MISMATCH');
      bytesById.set(request.fileId, new Uint8Array(request.bytes));
      emulatorCreates++;
      // One deliberate LOCAL lost acknowledgement exercises readback at the
      // exact registered identity. It never represents an observed Google fault.
      if (lostCreateAcknowledgements === 0) { lostCreateAcknowledgements++; fail('LOCAL_EMULATOR_ACKNOWLEDGEMENT_LOST'); }
    },
  };
  const readPrivacy = async (fileId, operationSignal) => {
    checkSignal(operationSignal);
    const folder = fileId === parentId;
    if (!folder && (!registrations.has(fileId) || !bytesById.has(fileId))) fail('EMULATOR_PRIVACY_MISMATCH');
    privacyReads++;
    return {
      metadata: {id: fileId, mimeType: folder ? 'application/vnd.google-apps.folder' : 'application/json',
        parents: folder ? [] : [parentId], trashed: false, owners: [{emailAddress: privacyPolicy.ownerEmail}]},
      permissions: {permissions: [{type: 'user', role: 'owner', emailAddress: privacyPolicy.ownerEmail}]},
    };
  };
  let journal;
  try {
    journal = await openLocalSourceDocumentJournal({mode: 'local-operator', directory, create: true});
    for (let pass = 0; pass < 2; pass++) {
      checkSignal(signal);
      if (pass > 0) {
        await journal.close(); journal = null;
        journal = await openLocalSourceDocumentJournal({mode: 'local-operator', directory});
        journalColdReopens++;
      }
      const bridge = createSourceDocumentMigrationBridge({mode: 'local-operator', privacyPolicy}, {journal, io, readPrivacy});
      for (const input of documents) {
        checkSignal(signal);
        const staged = await bridge.stage(input, {signal});
        const bytes = bytesById.get(input.registration.fileId);
        if (staged.status !== 'staged-document-reference' || staged.canonicalWritten !== false || staged.authorityChanged !== false ||
            !bytes || staged.artifact.fileId !== input.registration.fileId || staged.artifact.parentId !== parentId ||
            staged.artifact.ownerId !== input.plan.recordId || staged.sourcePayloadSha256 !== input.plan.payloadSha256 ||
            staged.artifact.sha256 !== input.plan.payloadSha256 || staged.sourceBytes !== input.plan.bytes ||
            bytes.length !== input.plan.bytes || hash(bytes) !== input.plan.payloadSha256 ||
            Buffer.from(bytes).toString('utf8') !== canonicalArtifactJson(input.row) ||
            staged.record.recordId !== input.plan.recordId || !same(decodeRecord(staged.cells), staged.record)) fail('SOURCE_ROUND_TRIP_MISMATCH');
        const registration = await journal.read(staged.operationId, 'registration', signal);
        const verified = await journal.read(staged.operationId, 'verified', signal);
        if (!same(registration?.registration, input.registration) || verified?.sourcePayloadSha256 !== input.plan.payloadSha256 ||
            !same(verified.record, staged.record) || !same(verified.artifact, staged.artifact)) fail('JOURNAL_REPLAY_MISMATCH');
        if (pass > 0 && !same(stagedRecords.get(input.plan.recordId), staged.record)) fail('JOURNAL_REPLAY_MISMATCH');
        stagedRecords.set(input.plan.recordId, staged.record);
        verifiedPasses++;
      }
      if (emulatorCreates !== documents.length || bytesById.size !== documents.length ||
          createAttempts !== documents.length || duplicateCreateAttempts !== 0) fail('EMULATOR_CREATE_COUNT_MISMATCH');
    }
    await journal.close(); journal = null;
    const completeBoundedModel = await measureCompleteBoundedRepresentation({schema, source, stagedRecords, signal});
    if (completeBoundedModel.records !== relationships.rows || completeBoundedModel.documentReferences !== documents.length) fail('LOCAL_TARGET_COUNT_MISMATCH');
    return {
      schemaVersion: 1, kind: 'source-records-with-local-document-emulator', checkedAt: new Date().toISOString(),
      relationships, sourceRows: relationships.rows, inlineRecords, oversizedDocuments: documents.length,
      documentPayloadBytes: documentBytes, maximumDocumentBytes, verifiedDocumentPasses: verifiedPasses,
      completeSourcePayloadHashesMatched: true, referenceEnvelopesRoundTripped: documents.length,
      emulatedReferenceIdentifierCharacters: {fileId: 160, parentId: 160}, completeBoundedModel,
      localEmulator: {createAttempts, creates: emulatorCreates, duplicateCreateAttempts,
        duplicateCreates: emulatorCreates - bytesById.size, metadataReads, payloadReads, privacyReads,
        deliberatelyLostCreateAcknowledgements: lostCreateAcknowledgements, filesPersisted: 0,
        networkRequests: 0, actualGoogleResourceIds: 0},
      localJournal: {scope: 'LOCAL_OPERATOR_JOURNAL', entries: documents.length * 2,
        coldReopens: journalColdReopens, repeatedDocuments: documents.length,
        privateRegistrationsAndDigestsPersisted: true, closedCleanly: true},
      processRestarts: 0, emulatorStateSurvivedProcessRestart: false,
      sourceRowsPersisted: 0, sourceMutations: 0, providerVerified: false, providerRequests: 0,
      targetWrites: 0, canonicalWritten: false, authorityChanged: false, migrationComplete: false,
      completeTargetCapacityVerified: false,
      limitations: [
        'All Drive behavior, ownership evidence and resource IDs are explicitly local emulation.',
        'Only the private operator journal survives close/reopen; no process restart or provider durability is proven.',
        'Complete source payload bytes remain in memory and are never exported to plaintext files.',
        'Local bounded history contains initial wrappers; source histories remain preserved inside their complete source payloads.',
        'Document-envelope hashes differ from source-payload hashes by design; both are checked independently.',
        'No Google upload, canonical record write, provider acceptance or authority cutover occurred.',
      ],
    };
  } finally {
    try { await journal?.close(); }
    finally { for (const bytes of bytesById.values()) bytes.fill(0); bytesById.clear(); registrations.clear(); stagedRecords.clear(); documents.length = 0; }
  }
}

export async function main(args) {
  if (args.length !== 4 || args[0] !== '--checkpoint' || args[2] !== '--directory') fail('INVALID_ARGUMENTS');
  const checkpoint = resolve(args[1]), directory = resolve(args[3]), before = codeHashes();
  const receipt = JSON.parse((await readPrivateRecoveryFile(checkpoint, 100_000)).toString('utf8'));
  if (receipt.evidenceKind !== 'live-source' || receipt.scope !== 'SOURCE_RECORDS_ONLY' || receipt.localIntegrityVerified !== true) fail('ACTUAL_CHECKPOINT_REQUIRED');
  const report = await inspectEncryptedCheckpoint({archivePath: receipt.archivePath, keyPath: receipt.keyPath,
    expectedArchiveSha256: receipt.archiveSha256, expectedManifestSha256: receipt.manifestSha256},
  ({schema, source}) => rehearseSourceDocuments({schema, source, directory}));
  if (!same(before, codeHashes())) fail('SOURCE_CHANGED_DURING_REHEARSAL');
  const evidence = {...report, kind: 'actual-source-with-local-document-emulator', codeHashes: before,
    sourceCheckpointIntegrityVerified: true, sourceCheckpointCreatedAt: receipt.createdAt,
    checkpointScope: receipt.scope, fullBackup: false, offDeviceVerified: false};
  await writePrivateRecoveryFile(join(directory, 'source-document-rehearsal.json'), Buffer.from(JSON.stringify(evidence, null, 2) + '\n'));
  return evidence;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { console.log(JSON.stringify(await main(process.argv.slice(2)))); }
  catch (error) {
    const code = /^[A-Z_]+$/.test(error?.code ?? '') ? error.code
      : /^[A-Z_]+$/.test(error?.message ?? '') ? error.message : 'SOURCE_DOCUMENT_REHEARSAL_FAILED';
    console.error(JSON.stringify({ok: false, code, providerVerified: false, providerRequests: 0,
      targetWrites: 0, canonicalWritten: false, sourceRowsPersisted: 0}));
    process.exitCode = 1;
  }
}
