# Large source document bridge — inactive local operator workflow

This bridge consumes a complete oversized source row and the result of `planSourceRecord`. It stages a verified immutable Drive reference suitable for later controlled migration. It does not import products, write a canonical Sheet row, change storage authority, enable an application provider, or configure Google credentials. SQL/Blob remain the current authority. All provider dependencies and registrations are supplied explicitly by a trusted local operator.

The existing immutable Drive store verifies the registered file ID, MIME type, exact parent, trash state, byte count, canonical UTF-8 bytes and SHA-256. The bridge additionally checks complete, bounded owner/permission evidence for the destination folder before creating anything and for both folder and file before returning a reference. Only the configured single My Drive owner and explicitly allowed user accounts are accepted. Public, domain, group, unknown-user, pending-owner and incomplete paginated permissions reject. Shared-drive ownership is deliberately unsupported by this policy.

These are point-in-time checks. They do not lock an owner or another API writer out of future sharing/content changes, and they do not satisfy the separate owner/API race acceptance check. Returned references must continue to be resolved through the registered, validating document store.

## API

Run with the project's Node 22 runtime and `--import tsx`.

```js
import {planSourceRecord} from './tools/google-workspace/migration.mjs';
import {createSourceDocumentMigrationBridge} from './tools/google-workspace/source-document-migration.mjs';
import {openLocalSourceDocumentJournal} from './tools/google-workspace/source-document-local-journal.mjs';

const journal = await openLocalSourceDocumentJournal({
  mode: 'local-operator', directory: newIgnoredPrivateDirectory, create: true,
});
try {
  const bridge = createSourceDocumentMigrationBridge({
    mode: 'local-operator', privacyPolicy: {ownerEmail, allowedUsers},
  }, {journal, io, readPrivacy});
  const staged = await bridge.stage({
    table, row, plan: planSourceRecord(table, row), registration,
  });
  // staged.record/cells contain a small reference, not a committed Sheet row.
  // Keep identifiers, source hashes and private receipts out of public logs.
} finally {
  await journal.close();
}
```

`registration` is the existing `ArtifactRegistration` contract: `{fileId, parentId, purpose: 'record-payload', ownerId: plan.recordId}`. A real provider ID must already have been reserved through reviewed Google provisioning and retained privately. The bridge does not generate IDs, infer an ID from a filename, list/search files, replace existing bytes, delete an orphan, or reassign an object. A missing or conflicting registration is a hard failure. Fixture IDs in tests are explicitly emulator values.

`io` implements the existing `DriveDocumentIO` contract. `createGoogleDriveJsonIO` is the existing explicit REST implementation; provide its complete trusted registration list and server-side token supplier. The current upload implementation is bounded to 5 MiB. Larger source documents return `RESUMABLE_UPLOAD_REQUIRED` before journal/provider writes; they are never truncated or reported as migrated.

`readPrivacy(fileId, signal)` returns `{metadata, permissions}`. Metadata includes `id`, `mimeType`, `parents`, `trashed` and `owners: [{emailAddress}]`. Permissions include the complete `permissions` array of `type`, `role`, `emailAddress`, optional `deleted` and optional `pendingOwner`, with no nonempty `nextPageToken`. Each response is limited to 100 permissions. `source-document-privacy-reader.mjs` supplies an explicit GET-only implementation with registered IDs, a token callback, fetch, an overall deadline, a 128 KiB response limit, redirect denial and bounded UTF-8 JSON reads. No bare `private: true` evidence is accepted. Its requests use [Drive files.get](https://developers.google.com/workspace/drive/api/reference/rest/v3/files/get) and [permissions.list](https://developers.google.com/workspace/drive/api/reference/rest/v3/permissions/list), with explicit [permission fields](https://developers.google.com/workspace/drive/api/reference/rest/v3/permissions).

The result is `status: 'staged-document-reference'` with `record`, `cells`, `artifact`, `operationId`, `sourcePayloadSha256` and `sourceBytes`. `canonicalWritten` and `authorityChanged` are always false. The source row is snapshotted before asynchronous work; the whole row, original public/source IDs, bigint strings, JSON structure and stable migration identity remain intact. The artifact hash is the full source payload hash; the small envelope's record hash is intentionally a different hash.

## Durable registration and interrupted attempts

An operation key binds source table, stable record ID and complete source payload hash. Its immutable registration also binds destination folder/file ID and migration metadata. The journal registration must be acknowledged and independently read back before provider creation. An uncertain journal write is reconciled at the same operation/phase; a missing readback returns `JOURNAL_OUTCOME_UNKNOWN` and no upload occurs.

After upload or an uncertain create acknowledgement, the existing Drive store checks the same reserved file ID and verifies its actual metadata and bytes. A conflicting object is never overwritten. A failed privacy/content check leaves the source and registration intact, returns no canonical record and does not delete the uploaded object. A later attempt reuses that registration and rechecks provider bytes and permissions, even when a prior verification entry exists.

The verified phase is persisted and read back before the reference is returned. Lost acknowledgements can therefore recover without a second authority or invented completion flag. The reference is still only staged: a separately authorized canonical writer and target reconciliation must commit it later. One monotonic deadline starts before source copying/planning and covers journal work, privacy reads, creation and verification. Checks before/after dependency calls and before reference return also reject synchronous work that delays timer callbacks. Cancellation after an attempted write is an unknown outcome to reconcile at the same registration, never permission to allocate a replacement ID.

## Local operator journal scope

`openLocalSourceDocumentJournal` is a **LOCAL OPERATOR JOURNAL**. It is not the application database, a Netlify job store, or remotely redundant storage. Both bridge and journal reject a configuration mode other than `local-operator`. The journal implements `read(operationId, phase, signal)`, `putIfAbsent(operationId, phase, value, signal)` and `close()`; phases are `registration` and `verified`.

The directory must be a new, ignored, untracked, owner-only directory below `test-results/`; reopen it later with `create: false` after closing the previous journal. There is one fsynced append-only JSON-lines file and one exclusively created owner-only lock. Entries form a validated hash chain, which detects corruption and partial entries; without an independent anchor it cannot detect removal of a complete valid suffix or history recomputed by the owner. Every read replays bounded content from the actual file; no in-memory map is presented as durable state. Metadata includes private registrations and hashes, but never the oversized row body or access tokens. The file is limited to 16 MiB, 10,000 entries and 12,000 bytes per value; exhaustion stops without pruning history.

Only one journal owner is allowed. An abandoned lock is not automatically expired, and a partial/corrupt append is not truncated, rewritten or adopted. An uncertain append/fsync or corrupt replay quarantines that open journal: subsequent reads reject and closing retains the lock, because matching page-cache bytes do not prove durable registration. Investigate the retained journal and owning process before any manual recovery; this API deliberately supplies no force-unlock or overwrite command. Filesystem permissions are checked on opening, file identity and complete hash-chain contents are checked during replay, and append data is fsynced. This proves ordinary local process restart handling within the tested environment, not machine-loss, power-loss, portable-key or off-device recovery.

## Verification and remaining acceptance

`tests/google-workspace-source-documents.test.mjs` uses explicitly synthetic rows, fixture IDs, an in-memory Drive emulator and real private local journal files. It checks exact large-row preservation, durable restart, unknown acknowledgement reconciliation, non-overwrite behavior, input mutation resistance, timeout, privacy denial and corrupt/truncated journal rejection. The emulator tests do not constitute Google acceptance or target migration.

An actual-source rehearsal may supply verified checkpoint rows in memory while keeping the Drive provider explicitly labelled an emulator. Its receipt must state zero actual Google writes, zero canonical imports and no provider acceptance. Real ID reservation, privacy/ownership readback, actual upload, sustained free allocation, Google latency/quota behavior, canonical commit/reconciliation and production activation remain separate pending work.
