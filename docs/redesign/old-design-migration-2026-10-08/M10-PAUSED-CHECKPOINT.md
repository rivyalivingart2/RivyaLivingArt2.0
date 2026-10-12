# M10 paused checkpoint - 10 October 2026

Owner requested a stop during M10. Wait for an explicit resume. Preserve all uncommitted changes on `codex/m10-regression`. The local QA server was stopped; no tests/builds remain intentionally running. No automation was created. Production remains the approved M5-M9 release. Do not start M11 or release new M10 changes without applicable permission.

## Release completed

- PR47: https://github.com/rivyalivingart2/RivyaLivingArt2.0/pull/47
- Main: `f39136580bdfeb09ee37003b5a9a48fe111b0d21`; reviewed head: `19cabdb721d269232cd174efa596d20d44459a18`.
- READY production: `dpl_3FCaDo3ERESQkRLfb3Y4WpHaJM3a`, https://www.rivyalivingart.com.
- 480/480 published at revision 2: 120 Journal, 120 labelled Portfolio concepts, 120 labelled fictional Testimonials, 120 FAQs. All 480 anonymous public routes return 200, matching titles and revisions; disclosures checked and no Review/AggregateRating schema introduced. Six selected film placements have controlled video and preload none.
- 21 image references: 18 additive media rows and 3 existing rows reused unchanged; all 63 public derivatives SHA-256 verified. Drive delivery remains in the dedicated M9 folder recorded in the release records.
- Final production preservation comparison: every original row in all 13 scopes unchanged, including 120 products, 55 original content records, 136 original media records, 375 revisions, business and customer/order data. Only approved new editorial/media/history rows were added.
- Release build/type/lint, 338 unit and 403 built-server checks passed before merge. These do not certify the newer M10 working tree.

## M10 evidence already collected

- Fresh isolated M5, M6, M7, M8 workflow checks passed. M8 harness was repaired to compare actual baseline register counts and find the existing FAQ through pagination/filtering. This is test maintenance, not an application content change.
- 64 viewport captures: Studio register, homepage, Portfolio archive, Testimonial archive, FAQ, Journal, collection, product; widths 1920, 1440, 1200, 992, 768, 512, 390, 320. Captured DOM metrics show one H1, no document horizontal overflow and no images missing alt attributes. Only selected screenshots have been visually inspected; these are not complete old/new visual-parity acceptance or physical-device evidence.
- Production register screenshot shows 480 linked / 480 published. Individual public data and publication evidence are retained in ignored `test-results/old-design-migration/`.
- Homepage finding: full archives are live, but Portfolio and testimonial homepage adapters had no Studio selection controls. A local fix is in progress: explicit up-to-three IDs per section, publication validation, exact dependency capture, preserved media crops, reviewed translation capture and missing-source blocking. No automatic selections or fabricated attribution.
- New `tests/home-editorial.test.mjs`: six focused tests pass. An intermediate TypeScript check passed before the final small edits. Final candidate build, complete unit/lint/runtime and actual Studio save/preview/publish/restore verification for this fix are still pending. The current local server build predates the fix.

## Resume next

1. Read AGENTS.md, this file and `docs/decisions/2026-10-10-m10-regression.md`; inspect branch/diff before edits. Do not reimport or republish the 480 records.
2. Review and finish the local homepage selection fix (`home-editorial.ts`, picker, presentation model/store/editor, reference adapters/renderers). Verify eligibility, exact saved previews, stale dependency rejection, preserved crops, safe labels, unavailable selections and English fallback. No production selections have been changed.
3. Build and run appropriate checks in the existing isolated QA database only, then verify the new Studio controls and homepage through the browser. Capture a local after snapshot and compare every original row with `local-m10-before-private.json`.
4. Continue M10 visual, accessibility and language coverage: remaining distinct templates, failure/empty/dialog states, Hindi/Gujarati long text, keyboard/focus, contrast/reduced-motion/zoom, film playback, comparison with OLDWEBSITE. Investigate one transient old homepage image-unavailable observation; do not label all existing images verified from the new-media hash results.
5. Collect repeatable local/hosted cold/warm performance evidence. No new M10 lab performance results have been collected yet. Field p75, native readers, human screen-reader, physical phones and genuine inquiry evidence stay open until actually supplied/observed.
6. Reconcile M10 task/register/acceptance evidence and prepare a local commit. M11 and any new M10 release remain separate from PR47.

## Evidence locations and environment

Ignored evidence under `test-results/old-design-migration/`: `production-m9-content-inventory.json`, `production-m9-media-inventory.json`, `production-m9-media-public.json`, `production-m9-public-pages.json`, `production-m9-preservation-summary.json`, `production-m9-publication-receipts.json`, `production-register-480.png`, `m10/layouts.json`, M5-M8 contract reports/logs, and private before/after digests. Publication receipts contain two interrupted per-batch browser verifications; the final database inventory and complete anonymous 480-route check supersede those partial receipts. An initial public-page run encountered a connection reset; the resumable final check completed all 480 routes.

QA remains the pinned loopback database at 127.0.0.1:55439, database `rivya_migration_local`, role `rivya_migration_qa`. Existing run-local tooling checks isolation and uses ignored configuration. Never print credentials. Keep screenshots/raw/private evidence out of Git. Use CUA for browser actions, reset temporary viewport overrides, and retain the real production administrator session through normal Studio controls only.

A protected-preview fetch was rejected by automatic approval review because it creates an authentication-bypass link. Do not retry that mechanism. The exact production deployment and public website were verified through the approved public path instead.
