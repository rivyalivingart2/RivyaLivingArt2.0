# Cinematic sections — continuation checkpoint

16 October 2026. The owner requested direct local implementation of the fullscreen, seamless-gradient and parallax-media brief. Implementation and scoped verification are complete on `codex/cinematic-sections`, based on released main `ffd863928744df0ae2cf985f6504421842a074db`. The source changes are uncommitted; no push, PR, merge or release was performed for this request.

Read `FINAL-REPORT.md`, `verification.json`, `preservation.json` and `SCOPED-REVIEW.md` before continuing. `DIRECTION.md` records the design and initial checklist.

## Preview and evidence

- Working production-mode local application: http://127.0.0.1:4199/
- Local Studio: http://127.0.0.1:4199/studio
- Before/after gallery: http://127.0.0.1:4185/review
- Static conditional specimens: http://127.0.0.1:4185/all, `/classic`, `/editorial`, `/empty`
- Raw screenshots and test receipts: `test-results/cinematic-sections/` (ignored).
- Generated specimen/gallery files: `output/cinematic-sections/` (ignored).

The app uses the existing isolated QA database at `127.0.0.1:55439/rivya_migration_local`, never production. To restart it, use the existing Node 22 runtime and guarded `tools/old-design-migration/run-local.mjs serve` command. The optional `RIVYA_MIGRATION_PG_MODULE` must reference the existing local PostgreSQL driver used by this checkout. Do not print environment files or credentials. Windows sandbox access may require the same approved local-process permission used during verification.

With the guarded app available, `node experiments/cinematic-sections/build.mjs` regenerates the static specimens; `node experiments/cinematic-sections/build-review.mjs` rebuilds the screenshot gallery; `node experiments/cinematic-sections/serve.mjs` serves loopback port 4185. Specimens are unhydrated rendering tests with clearly synthetic content. They do not create records, publish content or replace application interaction testing.

## Verified state

Build/types pass; full lint has zero errors and 62 existing warnings. All 350 unit, 403 runtime and 12 preflight tests pass. The actual homepage passes the eight requested widths. Four conditional variants pass 32 layout checks. All 37 Studio workspace openings pass at desktop and mobile, plus 24 breakpoint checks across overview/products/inquiries. Four related public pages pass final opening/overflow checks with no captured runtime exceptions.

Film playback, scroll-linked transform, explicit pause, offscreen/re-entry behavior, reduced motion, expanded-player Escape/focus, blocked-source poster fallback and print stills were verified. The local cache-disabled performance sample is LCP 1.788s and CLS 0.0000373; this is not production or field evidence. Automated accessibility samples show no detected violations, but contextual contrast and silent-video-caption results remain incomplete. No physical-device, native-reader, independent language or real-world acceptance is inferred.

All 1,658 pre-existing local rows across 13 protected scopes have identical hashes and content identities. All 42 homepage link texts/destinations, section order, SEO title and canonical URL match the baseline. Original business copy, concept/fictional labels, media associations and stored crops are preserved. No new media, translations, orders, inquiries, staff, publications or migrations were created.

## Resume boundary

Present the local gallery and report for owner review. Make any requested visual refinements locally. Wait for a new explicit release request for this redesign before creating the detailed PR into main and verifying deployment. Previous release instructions and completed release checkpoints are historical and must not be replayed.

Historical Studio access-request table activation and real administrator acceptance are separate operational work; this visual task neither changes nor completes them. Never replay imports, lifecycle tests, production publication, Drive writes, scraper work, old-product transfers or backup operations from earlier checkpoints.
