# Local migration verification

Use Node 22 and the repository's pinned dependencies. Read the implementation checkpoint before running anything. No command here deploys or publishes production records.

- `verify-registers.mjs` reads `RIVYA_OLD_REFERENCE_ROOT` and traces the old source without executing it. It generates the source reconciliation register.
- `prepare-qa.mjs` requires `RIVYA_MIGRATION_PG_MODULE` pointing to the already available local `pg` module. Start a dedicated PostgreSQL cluster bound to `127.0.0.1:55439`, with cluster role `rivya_migration_qa`, before calling it with `node --import tsx`. It refuses an existing database/configuration and loads only current public source fixtures. Never substitute live data or an old bootstrap.
- `run-local.mjs build` builds against the verified isolated database. `run-local.mjs serve` starts the compiled application at `http://127.0.0.1:4199`. The runtime strips live credentials and installs the fixed-target SQL guard. Keep the PG module environment value available to the runner.
- `run-local.mjs tools/old-design-migration/transport-check.mjs` verifies read-only transactions, rollback and remote refusal.
- `run-local.mjs tools/old-design-migration/browser-baseline.mjs` signs into **local QA only**, proves its session exists in that database and captures representative desktop/mobile-emulation checks. It never submits inquiries or clicks publication actions.
- `reference-baseline.mjs` makes twelve anonymous public page reads/captures across old/current sites. Run only when a fresh reference is needed, not on every iteration.
- `protected-snapshot.mjs local <label>` runs through the local runner. `protected-snapshot.mjs live-read-only <label>` runs separately with `RIVYA_PROTECTED_READ_CONFIG` pointing at the existing current runtime configuration. The live path is pinned and transactions are read-only. Output contains private IDs and hashes, never raw documents/customer fields. Do not put configuration values on the command line or in reports.
- `record-baseline.mjs` verifies M0 before/after equality and writes sanitized evidence. It is the one-time M0 closure recorder; do not use it later to reset newer phase statuses.

Keep all database files, configuration, sessions, screenshots, logs and private receipts under ignored `test-results/old-design-migration/`. Existing labels use exclusive creation and must not be overwritten. Do not initialize an existing database or rerun preparation against a populated target. A failed schema preparation must be inspected and resumed deliberately, never reset automatically.

The tooling is development-only. It does not run from a build hook, application request or deployment migration. Baseline snapshots are verification fingerprints and contain no recoverable record bodies.
