# Production access-request diagnosis

Status: **VERIFIED_FIXED for the production request-queue availability failure.** After the owner's fresh explicit approval, the exact locally tested additive repair committed on the confirmed shared live target at approximately **07:42 UTC on 19 October**. Read-only schema/grant verification completed, then the renewed administrator session successfully refreshed the Staff request queue at approximately **07:45 UTC**. The panel showed “No open requests. New requests and password recovery requests will appear here.” without the previous unavailable error.

## Approved repair and production verification — 19 October

The coordinator executed the complete 15-statement `access-repair-proposed.sql` transaction, SHA-256 `36bd04cba2b5c3ec122be23c0e0a4460eab6a015a035805ea895e14051551ce8`, in the confirmed project/branch/endpoint below. The final COMMIT is preserved in `test-results/audit-access-repair/production-commit.txt` and `.jpg`. Only the missing table, its three secondary indexes and the table-specific runtime SELECT/INSERT/UPDATE grants were added; PUBLIC table access was revoked. Normal primary-key and foreign-key dependencies are part of that existing application schema contract.

The exact `access-repair-verify.sql`, SHA-256 `bb4fc565fc38e77f547460677a7af6f7e8d22ad7c8ba3df0796663f81ac9803d`, then completed all 15 statements in a read-only transaction ending with ROLLBACK. The saved 07:43:49 UTC metadata results show fourteen columns, six checks plus primary/foreign keys and nine PostgreSQL-cataloged NOT NULL constraints, four valid/ready indexes, the expected owner with RLS disabled, and runtime SELECT/INSERT/UPDATE only. PUBLIC table access, runtime grant options, schema CREATE and broader table permissions are absent. The constant-false queue projection returned zero rows. This was owner-side metadata verification, not a successful `SET ROLE` or direct runtime-role console connection.

After the owner renewed Studio sign-in, a fresh **Refresh requests** action on production `/studio/staff` loaded the empty open-request queue without the unavailable error. The saved text and screenshot are `production-studio-queue.txt` and `production-studio-repaired.jpg` under the ignored evidence directory. This separately verifies the authentic deployed administrator queue-read path; it does not exercise approval, password reset, link redemption or new request submission.

The repair SQL issued **no existing-record INSERT/UPDATE/DELETE**, no role/membership or schema/default-privilege changes, no account decisions, no credential resets and no content publication. Ordinary user sign-in/session metadata activity occurred during the authenticated UI checks. **A full before/after production row-hash comparison was not performed**, so no universal production-record hash-preservation claim is made. No secrets were printed or saved. No source push, merge or deployment was performed or authorized by this narrow database approval.

The exact SQL files and historical 37-check local receipt remain unchanged. The table now exists: do not replay the creation transaction; its existing-object guard deliberately refuses a second execution. Sanitized current receipt: `docs/audits/rivya-master-audit/production-access-diagnosis.json`. Earlier diagnosis below is retained as historical evidence, not the current open status.

## Subsequent console diagnosis — 19 October, approximately 07:19 UTC

The console matches the shared live target recorded in `docs/decisions/2026-10-09-production-presentation-setup.md`: project `blue-haze-08978208` (historically named `rivya-studio-preview`), branch `br-muddy-poetry-awe0sju1`, endpoint `ep-delicate-silence-awjxadrd`, database `neondb`. The separately named production project is not substituted for that recorded target. Sensitive current Vercel `DATABASE_URL` metadata confirms it is defined, but its value is not returned by the connector; no credential was decrypted, printed or saved.

The first transaction attempted `SET LOCAL ROLE rivya_runtime_20260924`. The console owner does not have permission to switch to that role (SQLSTATE 42501); the transaction was explicitly rolled back. No membership or permission was changed. This is not evidence that the application lacks its ordinary database permissions.

A second **read-only** transaction ran as `neondb_owner`, inspecting only catalog metadata and `has_table_privilege` for the recorded runtime role. It reported `transaction_read_only=on`, the expected database, and search path `"$user", public`. Both qualified and unqualified access-request relations were null. Staff and session relations were present, had RLS disabled, and exposed SELECT/INSERT/UPDATE to the recorded runtime role. The final ROLLBACK was confirmed in the console. Zero application rows were read.

This establishes a specific absent prerequisite for the observed queue failure. It does not certify a direct runtime-role connection, all 19 columns, the application's deployment-to-database transport, or every account/recovery operation. The local-validated full diagnostic below was **not** claimed as a complete production execution.

Raw local evidence for this pre-repair diagnosis: `test-results/audit-access-repair/production-metadata-query.sql`, `production-metadata-result.txt` and `production-missing-table.jpg`. At this checkpoint the additive repair still required local testing and separate approval; both were subsequently completed as recorded above. Earlier observations below retain their date and scope.

## Earlier evidence — 19 October, before console access

After the owner renewed the Studio session, the coordinator observed the settled Staff panel error at approximately **06:47 UTC**: “Access requests are unavailable. Ask the owner to check the access-request database setup.” The rest of the Staff page and authentication loaded. This is the coordinator's browser observation; it is not a fresh successful queue response.

The read-only deployment inspection still identifies production deployment `dpl_7u2Yji4v5cpAbPde4DRq3Ua1LfDw`, READY, at Git SHA `66e82ef04f76b8460654bab4329ccbadfb47f28e`. The queue API, access service, database adapter and authentication service have no local changes relative to that released source.

After the renewed-session reproduction, these Vercel queries completed successfully:

- Runtime logs: production deployment above, path text filter `/api/studio/access-requests`, **06:38:10.429–06:48:10.429 UTC**, no matching log events.
- Grouped runtime errors: project `prj_J90SIW3OHaXYsmhan527F4n8PYUc`, route `/api/studio/access-requests`, preceding ten minutes, no error clusters returned.

Neither result establishes that the route is healthy. The API catches the underlying exception without logging a SQLSTATE or sanitized category, so the tools contain no causal SQL detail. The earlier attempt to read **17 October 04:00–06:15 UTC** logs failed with an explicit HTTP 400 retention error; that historical failure is not an empty-log result.

Current tool/environment discovery found an authenticated read-only Vercel connector, but no Neon/Postgres query connector. The repository root has `.env.example`; the existing ignored `.env.qa` is isolated loopback QA. The current shell has no `DATABASE_URL`, `POSTGRES_URL`, `VERCEL_TOKEN` or `RIVYA_PROTECTED_READ_CONFIG` value. No secret values were read or printed. These observations do not assert that the deployment lacks its configured database environment.

## Historical pre-diagnosis reasoning: why a speculative repair was unsafe

`src/app/api/studio/access-requests/route.ts` catches failures from both `studioSession()` and `listAccessRequests()` in one generic 503 response. Authentication resolves session/staff state and updates idle expiry. Queue listing selects nine fields from the unqualified `rivya_access_requests` relation. Before the console diagnosis, missing relation/column, privileges, search-path mismatch, connectivity and session-query failures were possible categories rather than confirmed causes. The later catalog inspection established the missing table; its approved repair and successful queue refresh resolved this observed failure.

The existing `scripts/studio-access-migration.sql` and `scripts/studio-access-runtime-grants.sql` are prepared source. Their presence does not establish that either was applied to the current production database, or that running them would repair this failure. Do not run them as a diagnostic.

## Retained read-only diagnostic procedure for a future recurrence

1. Use the owner-controlled database console or private environment. Confirm the project, database and **same runtime role used by the deployed application** through trusted configuration. An owner-role success does not prove the runtime role has permission. Do not paste connection strings, passwords or session tokens into chat or files in Git.
2. Review `access-diagnostics.sql`, then run the entire batch in one connection with stop-on-error behavior. It opens a read-only transaction, limits statement/lock/idle timeouts, reads only relation/column/privilege metadata, and validates the queue projection with a constant-false predicate. It does not enumerate request records, call the Studio authentication function, apply DDL, change permissions or inspect token/password values.
3. If any statement fails, record only the statement number, sanitized SQLSTATE/category and relevant metadata result. Roll back before closing the connection if the client leaves the transaction open. Do not share an unredacted provider exception or connection details.
4. Compare unqualified relation resolution with `public`; review column/type results and effective runtime privileges. A nonmatching type is a review signal, not automatic proof that PostgreSQL cannot run the query. Row-level security metadata similarly requires interpretation.
5. If relation, columns and permissions pass, the remaining diagnosis concerns deployment-to-database connectivity, session-query behavior or a runtime-only condition. The zero-row probe does **not** validate real row contents, access-request mutations, or the session idle update. Do not expand this read-only check into request approval, password redemption or a broad record export.
6. Prepare the smallest evidence-backed repair proposal. Any production migration/grant, deployment or data mutation needs the owner's fresh explicit authorization. A local UI error-state improvement does not close this production finding.

## Verification boundary

The SQL was validated on **19 October 2026 at 06:51:41 UTC** against the existing guarded loopback QA database after verifying its host, port, database and role. The transaction reported read-only; all 19 expected column/type/SELECT checks and the session idle-column UPDATE privilege check passed; the projection probe returned zero request rows; the batch ended with ROLLBACK. Receipt: ignored `test-results/audit-pending/access-diagnostics-local.json`. This establishes syntax and diagnostic behavior against that isolated schema only.

The earlier `access-diagnostics.sql` local result is not relabelled as a full production execution. The subsequent production repair, distinct `access-repair-verify.sql` run and Studio queue-read evidence are recorded above. Preserve these different dates and scopes; the local 19-column diagnostic, production metadata verification and real queue refresh are separate observations.
