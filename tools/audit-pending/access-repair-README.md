# Narrow Studio request-table repair — approved execution record

**Status: VERIFIED_FIXED for production request-queue availability, 19 October 2026.** After fresh explicit owner approval of the exact tested repair, the coordinator executed the additive transaction on the confirmed shared live target at approximately 07:42 UTC. Read-only production verification passed, followed by a successful administrator queue refresh at approximately 07:45 UTC. This approval did not authorize a Git push, merge, source release or deployment. The SQL files retain their original proposal names/comments and exact tested bytes as the historical reviewed artifact; they must not be replayed now that the table exists.

## Completed production evidence

- Repair SQL SHA-256: `36bd04cba2b5c3ec122be23c0e0a4460eab6a015a035805ea895e14051551ce8`. All 15 transaction statements completed and COMMIT was confirmed. Evidence: `test-results/audit-access-repair/production-commit.txt` and `.jpg`.
- Verification SQL SHA-256: `bb4fc565fc38e77f547460677a7af6f7e8d22ad7c8ba3df0796663f81ac9803d`. Its 15 statements ran read-only and ended with ROLLBACK. The 07:43:49 UTC receipt confirms fourteen columns, six checks plus primary/foreign keys and nine NOT NULL constraints, four valid/ready indexes, expected owner/RLS state, runtime SELECT/INSERT/UPDATE only and no PUBLIC or broader runtime grants. Evidence: `production-verification-results.json` in the same ignored directory.
- After the owner renewed Studio sign-in, a fresh **Refresh requests** on `/studio/staff` displayed “No open requests. New requests and password recovery requests will appear here.” with no unavailable error. Evidence: `production-studio-queue.txt` and `production-studio-repaired.jpg`, recorded approximately 07:46 UTC.

The repair issued no existing-record DML and no role/membership, schema-wide or default-privilege changes. No request was submitted for testing; no account was approved, no password reset or link redemption was performed, no credentials were exposed, and no content was published or source deployed. Ordinary sign-in/session bookkeeping occurred. **No full production before/after row-hash comparison was performed.** The successful queue-read path does not certify all account/recovery write operations. The historical local 37-check receipt remains unchanged and does not substitute for these distinct production observations.

## Diagnosed gap and exact scope

The coordinator's authenticated, read-only owner-console inspection on 19 October found both unqualified and `public.rivya_access_requests` resolution absent on the existing live database. Staff/session relations exist. A fresh metadata preflight matches the proposed staff/session signature, runtime identity and schema-privilege guards; raw metadata evidence is local in `test-results/audit-access-repair/production-preflight.*`.

This proposal adapts the already released application contract in `scripts/studio-access-migration.sql` and `scripts/studio-access-runtime-grants.sql`. It creates:

- `public.rivya_access_requests`, with the same 14 columns, six check constraints, UUID primary key and foreign key to existing `public.rivya_staff(id)`.
- Three secondary indexes: `rivya_access_open_login`, `rivya_access_token`, and `rivya_access_queue`. PostgreSQL also creates the primary-key index and normal foreign-key constraint dependencies/triggers.
- Only `SELECT`, `INSERT` and `UPDATE` on the new table for the existing `rivya_runtime_20260924` role. PUBLIC gets no table access, and runtime gets no grant option, delete, truncate, references, trigger or maintenance privilege.

It does not insert requests, create staff/accounts, reset credentials, issue links, modify existing records, publish content, change roles, change schema/default grants, install packages, or deploy source. The table starts empty; it cannot recover requests that were never saved while the table was missing.

## Files and safeguards

`access-repair-proposed.sql` is the entire proposed transaction. Do not extract or separately execute only its CREATE/GRANT statements. It checks:

1. Exact database `neondb`, current and session owner `neondb_owner`, writable primary transaction.
2. Existing non-superuser/non-bypass-RLS runtime role, public schema USAGE without CREATE, and existing staff/session SELECT/INSERT/UPDATE rights.
3. Ordinary staff/session tables without RLS; thirteen required column/type signatures and the staff UUID primary key.
4. Absence of the target and all three index names. It deliberately refuses replay and never silently accepts an unknown existing table shape.
5. After creation, exact new-table ACL boundaries. Unexpected default grants to another role or broader effective runtime rights abort the entire transaction.

Lock timeout is two seconds; statement timeout thirty seconds; idle transaction timeout sixty seconds. The transaction does not alter default privileges. Any failure must end with `ROLLBACK` before another attempt. A successful full-file execution commits this additive table and its narrow grants only.

SQL names cannot uniquely prove a Neon project or endpoint: different databases can share the same names. The owner-console identity check below is mandatory. No proposal claims otherwise.

## Local verification, never production

Run `access-repair-test.mjs` from the repository root using the existing Node 22 runtime. It creates a new timestamped PostgreSQL 18.6 cluster at `127.0.0.1:55442`, verifies the exact new `SHOW data_directory` before writes, and uses only synthetic local `neondb_owner` and `rivya_runtime_20260924` identities. It neither reads nor reuses protected QA on 55439 or HTTP lifecycle QA on 55441. No production credentials or connection string are needed. The local bootstrap owner is a disposable superuser; this is not proof of all capabilities of the real Neon owner.

The runner executes the exact proposed file, not a rewritten approximation. It tests wrong database/role/read-only rejection, missing role, unsafe privileges, mismatched signatures, conflicting names, unexpected default grants and atomic rollback, success, replay refusal, actual runtime privileges, constraints, unique partial-index behavior, the application's precise ON CONFLICT target and protected synthetic fixture hashes. It executes the exact metadata-only verification file. All synthetic request mutations are rolled back. It stops only its newly created cluster and writes a separate stopped receipt.

Raw outputs remain Git-ignored under `test-results/audit-access-repair/run-*/`. `latest-run.json` identifies the final run. Failed attempts remain labelled as failures, including the initial sandbox loopback-connection refusal and a verification-only count corrected for PostgreSQL 18's separately cataloged NOT NULL constraints; they are not counted as passing SQL tests.

Final local result: **37 checks passed**, in `run-2026-10-19T07-30-45-735Z`, completed 07:30:54.978 UTC. The matching stopped receipt is 07:30:56.324 UTC. `access-repair-verification.json` records the exact tested SQL hashes, two preserved synthetic records, selected unchanged metadata and zero-error/zero-warning focused lint result. These are local results only.

## Reviewed production procedure — completed once; do not replay

The following is the reviewed procedure retained for traceability, not a new execution instruction. Steps 1–6 were completed for this approved repair. Step 7's privilege and metadata checks were completed; a full production record-hash comparison was not performed and remains explicitly unclaimed.

1. In the existing signed-in Neon owner console, confirm project `blue-haze-08978208`, branch `br-muddy-poetry-awe0sju1`, endpoint `ep-delicate-silence-awjxadrd`, database `neondb`, owner `neondb_owner`. This is the historically shared live target, not an isolated preview database. Verify the selection again immediately before the repair; historical records alone are insufficient.
2. Confirm fresh explicit approval names this missing access-request table, its indexes and the narrow runtime grants. Approval to prepare/test the proposal is not approval to execute production DDL.
3. Preserve appropriate before-state metadata/protected-record verification privately in ignored evidence; never copy customer records or secrets into Git or chat. Reconfirm the target is still absent. If it now exists, stop and inspect it; do not bypass the replay guard.
4. Execute **all of `access-repair-proposed.sql` as one session/transaction**, stopping on first error. On failure, explicitly `ROLLBACK`, preserve the sanitized error and inspect the cause. Do not retry with guards removed or broader grants.
5. Run **all of `access-repair-verify.sql`**, which uses a read-only transaction and ends with `ROLLBACK`. Confirm fourteen exact columns, eight valid key/foreign-key/check constraints plus the required NOT NULL attributes, four valid/ready total indexes, expected owner/RLS state, runtime SELECT/INSERT/UPDATE only, and zero PUBLIC/non-owner unexpected grants. The final application projection has a constant-false predicate and returns no request records. The owner-side probe is not runtime impersonation.
6. Through the real owner-controlled administrator Studio session, reload Staff and inspect the request queue read-only. Successful table creation alone does not prove the deployed API/session path works. Record whether the unavailable error clears and the queue loads; do not invent or submit test requests, approve accounts, send links, or change staff data. If failure persists, retain it as open and diagnose the new evidence without further mutations.
7. Compare before/after protected records and privilege boundaries using the approved read-only method. Report separately: DDL result, metadata checks, existing-data preservation, real Studio read result and any remaining workflow acceptance gate.

The attempted production `SET LOCAL ROLE` was denied because the owner lacks membership; do not grant membership or weaken role boundaries to make that diagnostic work. Use owner metadata privilege checks and the authentic deployed read path instead.

## Failure and rollback boundaries

Before COMMIT, all proposed objects/grants roll back atomically if any guard or statement fails. After a successful COMMIT, do not automatically DROP the table: legitimate requests could already have arrived. Any post-commit removal is a separate potentially destructive change requiring assessment and fresh approval. A failure to verify the UI is not permission to delete requests or widen privileges.

Local SQL verification does not certify real Neon network behavior, authenticated production approval/recovery, outgoing communications, field performance, native assistive technology, physical devices or source deployment. Those remain separate evidence boundaries.
