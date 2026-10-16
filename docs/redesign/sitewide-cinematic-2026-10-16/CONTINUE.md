# Continue — website-wide cinematic redesign

**Release update, 16 October 2026:** the owner subsequently authorized pushing all changes into main. PR #62 merged as `224b2ca0e192b8d8ceced3045d6f8a193b734362`; exact-head production is READY and live public/Studio checks passed within the recorded scope. Read `RELEASE.md` and `live-verification.json` first. The local-only status and instructions below are the historical pre-release checkpoint, superseded by that explicit authorization and completed release. Do not replay fixtures, data publications or migrations. The current follow-up contains documentation only.

16 October 2026. Owner directly authorized implementation of the website-wide CRAFT master prompt. Implementation is local on `codex/cinematic-sections`, based on released main `ffd863928744df0ae2cf985f6504421842a074db`. Earlier homepage cinematic work is included in this uncommitted branch; preserve it.

## Read first

1. `FINAL-REPORT.md` — outcome, technical decisions, scope and 20 requirements.
2. `FINAL-SECTION-AUDIT.md`, `ROUTE-AUDIT.md`, `route-audit.json` — implementation versus source/conditional coverage.
3. `COMPONENT-RESEARCH.md`, `MEDIA-AUDIT.md` — source/licence decisions and approved media.
4. `verification.json`, `preservation.json` — current local checks and protected-data evidence.
5. `PUBLIC-IMPLEMENTATION.md`, `STUDIO-IMPLEMENTATION.md` — template ownership and exceptions.

## Current state

- Shared `CinematicCanvas`, gradient/motion tokens and effects preference cover public, private workspace and access shells. Existing GSAP handles eligible media parallax; no package added, no WebGL.
- Public page families and all 37 Studio workspace families use the same palette with purpose-specific intensity. Existing logo/fonts/content/crops/routes/APIs remain authoritative.
- Build/types, zero-error lint (62 existing warnings), final focused lint, 350 unit, 403 runtime and 12 preflight checks passed. An extra final `tsc --noEmit` also exited 0.
- 562 browser layout observations cover eight requested widths across public pages, Studio samples, saved previews, access forms and 22 inert layout specimens. Twelve representative interaction checks and nine accessibility scans are recorded. Automatic scans report zero violations but leave contextual contrast and silent-video checks incomplete.
- All 1,658 inventoried protected local rows are unchanged. Seventeen sampled public paths retain normalized text, ordered links and SEO metadata. No business record was submitted while testing.
- Local previews: application `http://127.0.0.1:4199/`; new gallery `http://127.0.0.1:4186/review`; prior homepage gallery `http://127.0.0.1:4185/review`.
- The temporary local QA Studio session was signed out after private review. Production sign-in tabs were not touched.

## Run locally if needed

Use the existing pinned Node 22 runtime and `tools/old-design-migration/run-local.mjs`; it verifies `127.0.0.1:55439/rivya_migration_local` before invoking the application. The protected QA configuration remains in ignored `test-results/old-design-migration/.env.qa`; never print it.

The known Node executable is `C:/Users/gonda/Documents/Codex/2026-09-23/continue-the-approved-rivyalivingart-redesign-read/work/tooling/node_modules/node/bin/node.exe`. Set only `RIVYA_MIGRATION_PG_MODULE` to `C:/Users/gonda/Documents/Codex/2026-09-30/keep-rivyalivingart2-0-as-the-base/work/tooling/local-postgres/node_modules/pg/lib/index.js`. Then run the guard with `serve` or `build` as appropriate. Do not use a production environment for checks.

The new static gallery server is `experiments/sitewide-cinematic/serve.mjs` (loopback 4186). `build.mjs` renders inert layout specimens without importing persistence; `build-review.mjs` indexes existing local screenshots; `verify-evidence.mjs` reads receipts and source fingerprints. Generated HTML/images stay under ignored `output/` and `test-results/`.

## Remaining boundaries

Owner visual review is next. **Do not push, create a PR, release, publish records, import fixtures, install tables, upload to Drive or change production without a new explicit request.** A later authorized release should include both the prior cinematic homepage work and this sitewide extension, with a detailed PR into main, exact-head hosting confirmation and fresh live public/Studio checks.

Contextual contrast over imagery/gradients, native screen-reader tasks, physical devices and production field performance are not independently certified. Historical admin acceptance is not a substitute for new observations. Historical Studio access-request production-table activation remains separate. Not every historical dynamic URL or conditional saved configuration was opened; the report identifies template, actual-runtime and static-specimen coverage.

Keep all protected records, original media associations, crops, drafts, translations and visualization/fictional disclosures intact. No new customer/project/feedback claim or inquiry was created. Root `sources/` remains read-only reference material.
