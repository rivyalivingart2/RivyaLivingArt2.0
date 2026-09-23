# Phase 2 — Migration, recovery and privacy runbook

Status: prepared, not executed. Read with PHASE-2-DATA-ARCHITECTURE.md and the current environment register. This runbook does not authorize bypassing the commercial hosting hold.

## Bundle and application order

1. `scripts/phase2-schema-inspection.sql`: read-only metadata/constraints/indexes/current-role permission inventory. Run independently against positively identified Preview and Production resources. Counts and customer-data exports are separate; no private row contents should enter the public receipt.
2. Existing source baseline: `studio-schema.sql`, `whatsapp-schema.sql` (or the recorded transactional `redesign-preview-migration.sql`, not both blindly), `content-schema.sql`, `storage-provider-schema.sql`, `business-settings-schema.sql`, `revision-schema.sql`. Determine missing objects from the actual environment, not file timestamps or old zero-count receipts.
3. `scripts/phase2-order-contract.sql`: one-time proposed widening/additive migration. No new request, seed, user or public content is inserted. A repeated application fails rather than silently accepting mismatched columns. Record a SHA-256 receipt and inspect before any retry.
4. Read-only post-migration checks and staged compatibility readers first. Enable v2 writer only with P5/P6/P7 code and permitted integration environment. Production waits for Phase 12 gates.

## Mandatory preconditions for applying DDL

- Confirm environment resource ID and actual database identity without printing the connection URL. Preview and Production are different databases/stores/secrets. Never infer target from a local filename.
- Capture full schema, constraints, indexes, privileges and exact aggregate row counts under read-only access. Record any drift. Inspect provider-value groups without object paths.
- Capture all current drafts and independent database/object backups as below. A copy inside `rla_backup_20260923_p6` cannot replace independent backup.
- Preserve current data and hashes of original inquiry summary/answer/product payloads in a private comparison manifest. No document/public receipt contains these customer fields.
- Prepare backward-compatible Studio and receipt readers for legacy + v2, including null product fields and pending message state. Current readers have not been adapted; do not enable v2 requests yet.
- Schedule bounded DDL access, quiet submission/upload writes, monitor in-flight requests and budget cleanup races. Apply using a migration-only credential, not through the app or build.
- Keep explicit lock/statement timeouts. On any failure, rollback the transaction; do not continue statement-by-statement.

## Post-migration invariants and formal recovery cases

These are prepared acceptance cases, not tests already passed. Execute in permitted integration and formal QA:

- Table counts and all old IDs, request keys, customer fields, snapshots, summaries, statuses, versions and references match the private pre-migration manifest.
- Existing rows read as contract 1; missing consent/destination/MIME evidence remains unknown. Legacy inserts continue to work until the v2 writer is deliberately enabled.
- Product requests require product ID/snapshot. Bespoke v2 requires both null. Missing required v2 schema/consent/source/message evidence is rejected, including SQL NULL cases.
- V2 pending/failed rows cannot contain a supposedly ready message; ready requires nonempty exact text, finalization time and no failure code.
- One request key + same guest/payload produces one Studio order, one inquiry and one initial event under simultaneous retries. Changed payload or guest cannot reuse it.
- Reference ownership, expiry/state/count and session finalization are atomic. Concurrent upload/cleanup/submission cannot oversubscribe slots/bytes, attach a removed file or orphan a finalized request.
- Interrupted Stage A has no partial records; interrupted Stage B leaves one recoverable saved brief. A late failure cannot overwrite a concurrent ready message.
- Reopening and copying neither writes another inquiry nor changes the business stage.
- Retired destination prevents handoff until an explicit admin authorization exists.
- Restore to an isolated target proves historical readability, private object retrieval, integrity and permissions. Runtime secrets/sessions must not become valid in a public restore.

## Rollback without data loss

Before COMMIT, PostgreSQL transaction rollback removes the entire attempted DDL. If the client loses the response, inspect schema first; do not assume failure and rerun.

After commit, keep the additive columns and data. Disable new v2 submissions and retry actions using an explicitly implemented maintenance control; no such new control is claimed to exist today. Continue read-only access through a version-compatible reader while repairing forward. Do not drop columns, reset IDs, reseed, overwrite messages or fabricate product IDs.

If no v2 rows have ever been written, an old app may still read the unchanged legacy data, but only after verifying its queries against the expanded schema. Once bespoke/pending v2 rows exist, reverting to the pre-Phase-6 app is unsafe: it assumes product fields and ready summaries. Roll back to the last v2-compatible application, preserve all rows and repair forward.

Disaster recovery restores into a new isolated database/store, verifies it, reconciles writes after the snapshot and only then switches the application under approved release controls. Never restore an old dump over the live database merely to undo DDL.

## Independent backup and restore definition (P2.4)

Use existing owner-controlled, access-restricted encrypted local/offline storage outside the repository, output artifacts, Git, public web root and both hosted databases. No backup service subscription or new provider is introduced. Exact destination, encryption-key custody, frequency/retention and acceptable RPO/RTO require an operational owner decision before activation; no recovery-time promise is invented.

Capture a PostgreSQL custom-format dump using a version-compatible `pg_dump`, with credentials supplied through protected PostgreSQL service/password configuration, never command arguments or transcripts. Include schema/data/sequences and review required roles/grants separately; avoid migrating provider-specific ownership blindly. The current machine has no `pg_dump` or `psql` on PATH. Install official tooling only when preparing the actual permitted backup/restore task.

Back up private Blob objects and an encrypted object manifest independently from the store, including random object ID/path, bytes, SHA-256, provider, MIME, state and inquiry association. A database dump alone cannot recover images. Public approved media/source are separately recoverable from Git and the asset manifest; they are not mixed with private reference exports.

For a coherent snapshot, pause uploads/submissions/deletion using an implemented maintenance control, settle or record in-flight operations, dump the DB, copy eligible objects, reconcile missing/extra objects and verify hashes before reopening writes. The definition is not an implemented backup job. No cron or automated WhatsApp process is added.

Restore procedure: provision an authorized isolated target within free capacity; restore schema/data/identity sequences; restore and hash-check private objects; reconcile FK links, reservation totals and provider paths; revoke restored sessions and rotate restore-only secrets; run denial/readability/idempotency tests with synthetic data. Do not send messages or enable public indexing. Save an encrypted recovery receipt; publish only sanitized outcome/counts. PostgreSQL documents custom-format archives and selective restore in [pg_dump](https://www.postgresql.org/docs/current/app-pgdump.html).

## Retention and deletion map

| Data | Current rule | Required implementation / disposition |
|---|---|---|
| Unsubmitted pending/ready references | Existing admin cleanup eligibility after 24 hours; attached rows excluded | Preserve metadata/byte reservation on provider failure; serialize with submission; retry idempotently |
| Attached references | No approved automatic deadline | Owner must define event, duration, exceptions and responsible admin; keep until resolved; no automatic deletion now |
| Inquiry customer/answers/notes/snapshots/summary | Same private brief, potentially repeated PII | Admin-scoped correction/deletion workflow must cover every copy, not only name/phone |
| studio_orders client/title | Can contain customer names or personal brief details | Include in anonymization; retain permitted opaque ID/stage history |
| Staff notes/event reason/actor/audit entity | May contain personal text or identifiable staff actor | Review exact fields and legal/operational hold; keep only justified minimal audit evidence |
| Guest/request/payload hashes and upload sessions | Pseudonymous, not anonymous | Retention tied to receipt/security window and anti-replay needs; do not delete idempotency evidence while accepting retries |
| Staff sessions/login throttle | Existing expiry/idle bounds and security purpose | Expired-row cleanup, revocation and separate environment secrets; no customer account |
| Private exports and independent backups | Additional PII copies | Encrypt, restrict access, track expiry and deletion ledger; restored backups must replay prior erasures before use |
| Public content/media/revisions | Business editorial data | Keep separate; private customer photos must never enter this lifecycle |

Deletion is an admin operation after identity/scope verification and a concrete impact preview: exact inquiries, references/bytes, notes/history/export/backup implications, and any retention hold. It requires explicit confirmation for irreversible deletion. A durable privacy-job/outbox design in P7/P10 must first deny access to affected records, then delete private objects, retry failures, anonymize allowed database fields transactionally and retain a minimal non-PII receipt/tombstone. Do not mark complete or release reserved bytes before provider deletion is confirmed. Handle a provider-absent object as idempotent only after safe identity verification.

The proposed Phase 2 DDL deliberately does not add a guessed retention deadline or destructive cleanup command. Final policy and privacy-job schema are a separately recorded gate.

## External blocker continuation

| Blocker | Exact next task | Blocks |
|---|---|---|
| Vercel Hobby eligibility unresolved | P10: establish eligible free commercial hosting within Vercel or record no eligible release; do not change provider/plan silently | Hosted business activation and release |
| Local DATABASE_URL / Blob token masked | Authorized operator supplies isolated Preview values directly in ignored local configuration; verify identities without revealing values | Connected local integration; not source/design work |
| Shared admin credentials across Preview/Production | At P7/P10 split server-side environment credentials and revoke affected sessions with owner-operated credential entry where required | Release isolation |
| Attached retention and backup custody undecided | P7/P10: obtain duration/trigger/hold and encrypted destination/custody decisions against the concrete map above | Privacy deletion activation and disaster recovery approval |
| Unexecuted migration/restore proof | Re-read live metadata, back up independently, then rehearse proposed migration and recovery under P6/P10/P11 gates | BACKEND_CONNECTED/TESTED claims |

PostgreSQL's [ALTER TABLE documentation](https://www.postgresql.org/docs/current/sql-altertable.html) informs the use of nullable widening, constraints and transaction-sensitive locking. The migration remains unexecuted; document review is not constraint or restore proof.
