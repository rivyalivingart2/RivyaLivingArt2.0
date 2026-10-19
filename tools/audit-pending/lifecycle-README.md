# Disposable local lifecycle verification

This runner creates a **new PostgreSQL cluster for every invocation** under ignored `test-results/audit-pending/lifecycle/run-<timestamp>/`. It never connects to, copies, resets or destroys the existing migration QA database on55439 or production. It uses the already-installed PostgreSQL18.6 binaries and `pg` module listed explicitly in `lifecycle-run.mjs`; no installation or cloud token is needed.

Run with the project's existing Node22 executable:

```text
node tools/audit-pending/lifecycle-run.mjs
```

On this Windows sandbox, loopback database access requires approved execution outside the filesystem sandbox. Review the source before running. The runner binds to127.0.0.1:55441 with role `rivya_lifecycle_qa` and database `rivya_lifecycle_disposable`, rejects an occupied port/existing run directory, checks the exact server data directory, strips inherited deployment/database/storage credentials, and refuses every other SQL connection or external fetch through its test transport. This is not an OS-wide egress firewall. The existing QA transport is not broadened.

The current checked-in schema files are applied only to this empty database. Fixtures consist of three wholly fictional inquiries/orders, three fictional custom CMS pages, two fictional staff accounts, synthetic notes/references/exports and two erasure ledger records. No public-source inventory or private customer records are copied. All synthetic staff passwords/session keys exist only in the process environment/memory.

`lifecycle-tests.mjs` invokes **actual application services and Web Request route handlers with real PostgreSQL**. Next cookie context and cache invalidation are test adapters. Authentication still checks real synthetic database sessions. The Blob SDK is a separately labelled in-memory adapter, while the actual reference-storage module's validation and private-read/write options execute. No HTTP server, Next build, browser, cloud provider or customer message is involved.

The suite covers:

- External/other-database refusal, read-only SQL and transaction rollback.
- Anonymous/unassigned private-reference denial, assigned-editor/admin synthetic byte access and private response headers.
- Missing request/identity, hold, ongoing follow-up, accepted-order and stale-version erasure refusal without mutation.
- Administrator/origin/confirmation enforcement in the actual privacy handler.
- Actual anonymization of personal fields, notes/event reasons, recovery audit text and guest/assignment access.
- Managed export invalidation and minimal erasure ledger accounting.
- Missing real storage credential leaves references inaccessible and quota reserved for retry.
- Labelled fake-provider failure/retry/concurrency, exactly-once quota/slot release and idempotent completed retries.
- Due versus premature retention expiry and repeated replay after deliberately fictional restoration.
- CMS draft isolation, publication role/origin checks, public SQL projection, unsaved/stale rejection, restored revision as new draft, explicit republish, withdrawal, revision history and changed-dependency conflicts.
- Exact cache-invalidation calls for all six successful publication/withdrawal operations: affected page, `/journal`, `/` and `/sitemap.xml` in order; drafts and refused changes add no calls. Actual framework cache propagation remains outside this adapter test.

Each attempt retains `results.json` when the test body ran, `schemas.json`, `execution.json`, and `cluster-stopped.json`; `latest-run.json` points to the most recent attempt. The runner stops only its own exact PostgreSQL data directory and preserves all files. There is no recursive cleanup. An early Windows captured-pipe launcher attempt and a missing test-adapter export were corrected; those earlier attempt artifacts remain local and are not counted as application defects or passing tests.

The real Vercel Blob upload/read/delete/provider-permission gate remains **BLOCKED**. Passing fake-SDK checks verifies application contracts, not a remote storage service. Handler integration also does not certify browser UI, framework cache propagation or full HTTP acceptance.
