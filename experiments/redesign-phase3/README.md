# Phase 3 local review

The main implementation is in src/components/shop/. This folder contains direction/design records and static fixture rendering, not a replacement application.

Use Node 22. The local application runner requires the existing isolated PostgreSQL QA cluster on 127.0.0.1:55439, database rivya_migration_local, and the existing ignored test-results/old-design-migration/.env.qa. It refuses a remote database. Never print or commit that configuration.

Set RIVYA_MIGRATION_PG_MODULE to the locally installed pg module path, then:

```powershell
node tools/old-design-migration/run-local.mjs build
node tools/old-design-migration/run-local.mjs serve
```

The built application serves http://127.0.0.1:4199/. Do not use fixture seeding, Studio saves or publication to reproduce this phase's checks.

With that application running, build and serve the optional static fixtures:

```powershell
node experiments/redesign-phase3/build.mjs
node experiments/redesign-phase3/serve.mjs
```

Port 4180 exposes /all, /classic, /editorial and /empty. Only GET/HEAD and allowlisted public asset paths are forwarded to the loopback application. There is no authenticated request forwarding or API/Studio proxy. Static fixtures do not hydrate video/form controls and are labelled accordingly.

The standalone Next image adapter needs explicit CommonJS interop. The fixture's ImageConfigContext uses the actual project's size/quality configuration. Hero getImageProps may issue a standalone configuration warning; the production Next build uses its normal compiler configuration and succeeds.

Verification:

```powershell
node tools/redesign-phase3-browser.mjs
node tools/redesign-phase3-fixtures.mjs
node tools/redesign-phase3-edge.mjs
node tools/redesign-phase3-full-capture.mjs
node tools/redesign-phase3-report.mjs
```

The baseline tool is for a pre-change capture only; do not overwrite the accepted baseline after changes. The report tool compares the read-only before/after database summaries already recorded in the ignored QA directory. It does not connect to any database.

Run the full-capture tool last: it replaces Chromium's unreliable oversized mobile full-page output with verified viewport tiles. The generated ending crop and receipt explain the method.

No screenshot or automated result is a substitute for the owner's approval to start Phase 4. Keep all changes local until separately authorized to push/release.
