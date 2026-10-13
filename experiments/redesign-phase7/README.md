# Phase 7 verification package

Owner approved Phase 6 and requested final verification/report before any push or release. Read `docs/redesign/modern-design-2026-10-13/PHASE-7-FINAL-REPORT.md`, the Phase 7 JSON receipts, PR draft, release checklist and CONTINUE.md from the repository root.

Application candidate is the approved Phase 6 `15a0307`; Phase 7 changes no application source/assets/dependencies. The verification branch is `codex/redesign-phase7-verification`. Local app remains at http://127.0.0.1:4199; prior preview galleries remain available. Report server uses http://127.0.0.1:4184/review. No production or Drive action occurred.

## Local runtime

Use the existing isolated PostgreSQL at 127.0.0.1:55439, database `rivya_migration_local`. Never reseed, replace it with production or print ignored configuration. Stop only the verified localhost Next process before rebuilding `.next`.

```powershell
$phase7Node = 'C:/Users/gonda/Documents/Codex/2026-09-23/continue-the-approved-rivyalivingart-redesign-read/work/tooling/node_modules/node/bin/node.exe'
$env:RIVYA_MIGRATION_PG_MODULE = 'C:/Users/gonda/Documents/Codex/2026-09-30/keep-rivyalivingart2-0-as-the-base/work/tooling/local-postgres/node_modules/pg/lib/index.js'
& $phase7Node tools/old-design-migration/run-local.mjs build
& $phase7Node tools/old-design-migration/run-local.mjs serve
```

## Reproduction boundaries

`tools/redesign-phase7-replay.mjs` allows only named previously reviewed non-destructive suites. It writes generated copies and fresh captures under Phase 7 ignored output, preserving earlier baselines. `redesign-phase7-session.mjs` reuses one normally authenticated QA session to respect login throttling; its exact ignored cache is removed at handoff. Do not clear rate limits or print credentials/cookies.

Example: run `tools/redesign-phase7-replay.mjs redesign-phase5-interactions` through the guarded runner. Other Phase 7 scripts provide public HTTP inventory, Studio/anonymous access matrix, axe checks, media, asset hashes, local performance, visual comparison, reading/print and preservation/report assembly. `redesign-phase7-print.py` uses the bundled Python/pypdf. Browser scripts use the installed Chrome and existing dependencies; no new package is required.

Do not rerun historical lifecycle/import/publication scripts as part of verification. The Phase 5 hidden FAQ and Phase 6 Closed order/disabled editor remain recorded fixtures. Read-only views can update session/rate-limit bookkeeping; those tables are outside the protected content inventory. Current QA has 480 older unpublished editorial URLs and must never be bulk-published to make a local status report green.

Fresh private evidence remains ignored under `output/redesign-phase7` and `output/playwright/redesign-phase7`. The committed receipt hashes 280 PNG/PDF files; it does not commit private record screenshots or credentials. Performance results are local lab measurements with an explicitly described mobile simulation. Human/native/physical/field acceptance is not inferred.

The report/preview server accepts GET/HEAD only and serves an explicit read-only file map. Start it with `node experiments/redesign-phase7/serve.mjs`. Later release requires explicit owner authorization and the detailed PR/deployment procedure in the checklist.
