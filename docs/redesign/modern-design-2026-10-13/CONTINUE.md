# Continuation — modern redesign Phase 3 ready for owner review

## Current stop
The owner approved Phase 1 and Phase 2 previews, then explicitly said “START TO WORK ON PHASE 3.” Phase 3 homepage and shared public-frame integration is complete locally. **Stop before Phase 4 until the owner reviews this result and explicitly authorizes it.** Do not resume historical M0–M11 work or replay publication tasks.

## Working state
- Local branch: `codex/redesign-phase3-homepage`.
- Parent: local Phase 2 commit `4cf0e1b`; Phase 1 `e54390c`.
- Production baseline main: `4cadf21b380a8f3753232318fbb78027aa09ffc5`; not refreshed or released in Phase 3.
- Read `PHASE-3-REVIEW.md`, `phase3-verification.json`, `phase3-section-coverage.json` and `experiments/redesign-phase3/DIRECTION.md`.
- Main preview: `http://127.0.0.1:4199/`; material/video `/#home-material`.
- Static all-section fixture: `http://127.0.0.1:4180/all`; other fixture paths `/classic`, `/editorial`, `/empty`.
- Restart instructions: `experiments/redesign-phase3/README.md`. Use Node 22 and the existing guarded local PostgreSQL runner. Never print `.env.qa`, seed production, or write records to reproduce these checks.
- Local public application uses the existing QA database and presentation revision 82; 11 slots currently visible. All 18 slots are verified through separate static fixtures. Current production selection is not inferred from that local database.
- The loopback app and fixture servers remain available for review in this session; they may need restart later.

## Verification and preservation
- Production Next build, TypeScript and focused changed-application lint passed; 344 existing unit tests passed.
- 58 built-site checks + 40 static fixture checks + 16 edge checks passed; 9 named palette contrast pairs passed 4.5:1.
- Desktop/tablet/mobile widths: 1440, 768, 390 and 320 CSS pixels. English/Hindi/Gujarati selector refresh, search, browser-local saved pieces, no-JS navigation, original image/crop identity, explicit film playback and motion cleanup verified.
- Independent finish reviewer returned `ship` for the local Phase 3 source/capture scope. Its initial `recapture` finding was resolved with a verified mobile tiled full-document capture; a fresh full review then found no material fixes.
- 26 screenshot files recorded. `390-full.png` is tiled to avoid Chromium's oversized screenshot artifact; `390-full-ending.png` and its receipt show the actual footer/legal ending. Run the full-capture tool after the primary browser script when reproducing evidence.
- All 13 protected local table digests match: 1,641 rows unchanged. Private per-record evidence remains ignored. This snapshot does not claim coverage of every database table.
- 924/934 original baseline files unchanged. Phase 2 accounts for the two dependency files; Phase 3 accounts for seven existing presentation-source files and `.gitignore`. All original public/logo/media, lib data models and API files are byte-identical.
- No production/Studio/Drive record writes, publication, push, PR or deployment occurred. No physical-phone, native-screen-reader, independent language or field-performance check is newly certified.
- Impeccable context/detector unavailable due to Windows `cache_directory_failed`; not passed. Static fixtures are outside existing ESLint scope and were built/browser-checked separately.

## Decisions carried forward
- Keep the approved material-gallery palette, original logo bytes and existing display/body fonts.
- Native browser scroll and smooth anchors; never silently restore ScrollSmoother or whole-page transforms.
- Deferred desktop fine-pointer GSAP image/heading movement; reduced motion, touch and optional-chunk failure retain visible static content. No reading/form/table animation.
- Existing Drive-verified `resin-pour` film remains under the saved presentation selection and requires deliberate play. Preserve the visualization disclosure.
- Original published text, business facts, links, crops, media associations, section order and conditions are retained. Existing eyebrow text is protected content.
- The six Phase 2 Drive candidate images remain proposals with null Studio IDs; no record reassignment was authorized or performed here.
- Static concepts, fictional feedback and service fixtures never enter the database. Empty categories keep honest existing fallbacks.
- Phase 1/2 records and PRODUCT.md contain historical scope wording. Phase 3 direction/checkpoint record the later authorization; do not rewrite old evidence as current verification.

## Next phase, only after approval
Phase 4 covers remaining public page bodies: collections, products/galleries/customizers, commissions, search/saved/inquiry, story/process/architects/materials, Journal/Portfolio/Testimonials/FAQs, contact/policies and custom pages, including aliases and representative states. Keep records and existing workflows intact. Owner review is required before Phase 5.

Future release still requires explicit authorization, a detailed PR into main, exact deployed-commit verification and fresh public/authenticated Studio checks. Scraper work, old-product transfers and backups remain excluded.
