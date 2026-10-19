# Production access-request diagnosis

Status: **BLOCKED on production runtime-role database access; VERIFIED_OPEN for the observed feature failure.** No production SQL, migration, grant, publication, request decision or deployment was performed by this diagnostic pass.

## Current evidence — 19 October 2026

After the owner renewed the Studio session, the coordinator observed the settled Staff panel error at approximately **06:47 UTC**: “Access requests are unavailable. Ask the owner to check the access-request database setup.” The rest of the Staff page and authentication loaded. This is the coordinator's browser observation; it is not a fresh successful queue response.

The read-only deployment inspection still identifies production deployment `dpl_7u2Yji4v5cpAbPde4DRq3Ua1LfDw`, READY, at Git SHA `66e82ef04f76b8460654bab4329ccbadfb47f28e`. The queue API, access service, database adapter and authentication service have no local changes relative to that released source.

After the renewed-session reproduction, these Vercel queries completed successfully:

- Runtime logs: production deployment above, path text filter `/api/studio/access-requests`, **06:38:10.429–06:48:10.429 UTC**, no matching log events.
- Grouped runtime errors: project `prj_J90SIW3OHaXYsmhan527F4n8PYUc`, route `/api/studio/access-requests`, preceding ten minutes, no error clusters returned.

Neither result establishes that the route is healthy. The API catches the underlying exception without logging a SQLSTATE or sanitized category, so the tools contain no causal SQL detail. The earlier attempt to read **17 October 04:00–06:15 UTC** logs failed with an explicit HTTP 400 retention error; that historical failure is not an empty-log result.

Current tool/environment discovery found an authenticated read-only Vercel connector, but no Neon/Postgres query connector. The repository root has `.env.example`; the existing ignored `.env.qa` is isolated loopback QA. The current shell has no `DATABASE_URL`, `POSTGRES_URL`, `VERCEL_TOKEN` or `RIVYA_PROTECTED_READ_CONFIG` value. No secret values were read or printed. These observations do not assert that the deployment lacks its configured database environment.

## Why a speculative repair is unsafe

`src/app/api/studio/access-requests/route.ts` catches failures from both `studioSession()` and `listAccessRequests()` in one generic 503 response. Authentication resolves session/staff state and updates idle expiry. Queue listing selects nine fields from the unqualified `rivya_access_requests` relation. Missing relation/column, privileges, search-path mismatch, connectivity and session-query failures therefore remain possible categories, not confirmed causes.

The existing `scripts/studio-access-migration.sql` and `scripts/studio-access-runtime-grants.sql` are prepared source. Their presence does not establish that either was applied to the current production database, or that running them would repair this failure. Do not run them as a diagnostic.

## Read-only procedure when the existing connection is available

1. Use the owner-controlled database console or private environment. Confirm the project, database and **same runtime role used by the deployed application** through trusted configuration. An owner-role success does not prove the runtime role has permission. Do not paste connection strings, passwords or session tokens into chat or files in Git.
2. Review `access-diagnostics.sql`, then run the entire batch in one connection with stop-on-error behavior. It opens a read-only transaction, limits statement/lock/idle timeouts, reads only relation/column/privilege metadata, and validates the queue projection with a constant-false predicate. It does not enumerate request records, call the Studio authentication function, apply DDL, change permissions or inspect token/password values.
3. If any statement fails, record only the statement number, sanitized SQLSTATE/category and relevant metadata result. Roll back before closing the connection if the client leaves the transaction open. Do not share an unredacted provider exception or connection details.
4. Compare unqualified relation resolution with `public`; review column/type results and effective runtime privileges. A nonmatching type is a review signal, not automatic proof that PostgreSQL cannot run the query. Row-level security metadata similarly requires interpretation.
5. If relation, columns and permissions pass, the remaining diagnosis concerns deployment-to-database connectivity, session-query behavior or a runtime-only condition. The zero-row probe does **not** validate real row contents, access-request mutations, or the session idle update. Do not expand this read-only check into request approval, password redemption or a broad record export.
6. Prepare the smallest evidence-backed repair proposal. Any production migration/grant, deployment or data mutation needs the owner's fresh explicit authorization. A local UI error-state improvement does not close this production finding.

## Verification boundary

The SQL was validated on **19 October 2026 at 06:51:41 UTC** against the existing guarded loopback QA database after verifying its host, port, database and role. The transaction reported read-only; all 19 expected column/type/SELECT checks and the session idle-column UPDATE privilege check passed; the projection probe returned zero request rows; the batch ended with ROLLBACK. Receipt: ignored `test-results/audit-pending/access-diagnostics-local.json`. This establishes syntax and diagnostic behavior against that isolated schema only.

This file and SQL remain a diagnostic handoff, not production execution evidence. The coordinator owns subsequent production diagnosis receipts. Preserve the original audit and follow-up evidence; do not relabel unavailable production SQL diagnosis as passed.
