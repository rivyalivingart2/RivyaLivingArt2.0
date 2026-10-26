# Phase 6: Media, Content and Filters (tasks GW-600, GW-601, GW-602) — PR Description

26 October 2026. Prepared on branch `codex/google-cloud-acceptance` from release checkpoint `039be1c` (Phase 5 delivery commit).

## Summary of Changes

This Pull Request delivers Phase 6 of the Google Workspace transition programme, establishing strict media association governance, truthful provenance enforcement, entity coverage reporting, Studio filter controls, and Drive-backed delivery verification:

1. **GW-600: Media Association Map & Truthful Claims Enforcement (`src/lib/google-workspace/media-association-map.ts`)**:
   - Implements strict media association map linking entity records (`category`, `article`, `project`, `testimonial`, `page`, `product_concept`) to valid media slots (`primary`, `hero`, `gallery`, `avatar`, `installation`, `detail`).
   - Validates entity/slot compatibility, directory traversal prevention, and blocks internal private customer reference endpoints (`/api/studio/reference/private`).
   - Truthful provenance enforcement:
     - Genuine testimonials require explicit client attribution, source, reviewer, approval date, and written consent record.
     - Fictional testimonial guidance samples strictly prohibit real client names, star ratings, or human avatars, requiring explicit sample disclosures.
     - Projects and product concepts require truthful disclosure of design visualizations and concept studies (no fictional claims of completed client commissions).
   - In-memory association registry (`mediaAssociationRegistry`) supporting fast entity and media path indexed lookups.

2. **GW-601: Entity Coverage Analysis, Studio Filtering & Reporting (`src/lib/google-workspace/entity-coverage.ts`, `docs/google-workspace-2026-10-24/entity-coverage-report.json`)**:
   - Analyzes and classifies the full repository baseline entity inventory across 323 distinct records:
     - 120 product concepts (`catalogue`).
     - 15 categories (`catalogue`).
     - 20 baseline pages (`presentation`).
     - 36 journal articles (`editorial`).
     - 131 approved public media assets (`catalogue`).
     - 1 guidance testimonial sample (`editorial`).
   - Implements multi-criteria entity filtering matching Studio UI controls: status (`all`, `published`, `draft`, `archived`), workflow (`operations`, `catalogue`, `editorial`, `presentation`, `governance`), entity kind, text query, and pagination.
   - Generates machine-verifiable entity coverage report (`docs/google-workspace-2026-10-24/entity-coverage-report.json`) confirming zero duplicate records and zero fabricated business evidence.

3. **GW-602: Drive Media Delivery, Aspect Ratios & Derivative Checks (`src/lib/google-workspace/drive-media-delivery.ts`)**:
   - Enforces 4:5 vertical portrait aspect ratio (0.8 ratio within 2% tolerance) for creation stills and catalogue visuals.
   - Validates responsive derivative sets across required widths ([640, 960, 1600]), enforcing the 600 KB byte budget per derivative and SHA-256 integrity.
   - Enforces private customer reference gating: public media and creations resolve for all clients, while customer references fail closed for unauthenticated requests and require Studio staff authentication.
   - Handles media lifecycles: upload bounding (max 20 MB, JPEG/PNG/WebP), replace lineage tracking (`parentSha256` -> `newSha256`), non-destructive archiving, and orphan asset scanning.
   - Validates background process motion video (`resin-pour`): requires valid static poster image, enforces duration <= 60s, and mandates silent audio (`hasAudio: false`).

4. **Automated Unit Tests (6 new automated tests, 43/43 total Google Workspace tests passing)**:
   - `tests/google-workspace-media-content.test.mjs`:
     - Test 1: Media association validation enforces entity/slot compatibility and path safety.
     - Test 2: Truthful claims - Testimonials strictly prohibit invented customers or reviews.
     - Test 3: Registry provides entity and media index queries.
     - Test 4: Entity coverage, studio filtering, and duplicate prevention.
     - Test 5: 4:5 aspect ratio check and responsive derivative verification.
     - Test 6: Media delivery gating, upload bounding, replace lineage, and motion validation.

## Validation & Test Results

- **Unit tests:** 43/43 Google Workspace tests passed across the full test suite.
- **Route typegen & TypeScript:** 0 errors (`npm run typecheck`).
- **ESLint:** 0 errors, 62 existing repository baseline warnings (`npm run lint`).
- **Preflight:** 12/12 checks passed (`npm run test:preflight`).

## Preservation & Safety Boundary

- **Public Website & Design:** Approved homepage, Rivya / Creations (169 selected images / 507 WebP variants), The Signature ("From liquid to light"), and footer layouts and styling remain completely untouched and byte-identical.
- **Studio Login & Security:** Authenticated Studio routes, session handling, rate limits, and security middleware remain completely unchanged.
- **Provider Authority:** Current PostgreSQL/Prisma database connections and Vercel Blob integrations remain 100% authoritative when Google Workspace adapter is unconfigured.
- **Data Safeguards:** Zero products added, zero test fixture products injected, zero archived catalogue/Sheets imports performed, zero database reseeding, zero request table repair replay.
- **Cloud & Production Invariance:** Zero Google cloud writes, zero Drive resources created, zero Sheets modified, zero production database writes, zero CMS publications.
