# Phase 8: Catalogue Automation (tasks GW-800, GW-801, GW-802) — PR Description

26 October 2026. Prepared on branch `codex/google-cloud-acceptance` from release checkpoint `ae5c41a` (Phase 7 delivery commit).

## Summary of Changes

This Pull Request delivers Phase 8 of the Google Workspace transition programme, implementing native template artifact registration, versioned catalogue configuration and immutable input snapshot freezing, worker generation orchestration with stable Drive IDs and idempotency, layout/script validation, and private Studio access gating:

1. **GW-800: Private Artifact Register, Configuration Validation & Immutable Snapshot Freeze (`src/lib/google-workspace/catalogue-automation.ts`)**:
   - Implements native Drive template artifact register (`registeredTemplateArtifacts`) mapping 4 reused assets (`tmpl-slides-luxury-master`, `tmpl-slides-minimal-master`, `tmpl-cover-statement-v1`, `tmpl-typography-bilingual-v1`) without rebuilding templates needlessly.
   - Implements configuration validator (`validateCatalogueConfig`) verifying title, subtitle, curator statement, themes (`editorial-luxury`, `atelier-minimal`, `collectors-lookbook`), languages (`en`, `hi`), formats (`SLIDES_AND_PDF`, `PDF_ONLY`), and price display choices (`SHOW_PRICES`, `STARTING_FROM`, `ON_REQUEST_ONLY`).
   - Implements immutable input snapshot freeze (`createCatalogueInputSnapshot`) from approved concepts, creating reproducible SHA-256 hashes and snapshot IDs (`cat-snap-...`). Enforces exclusion and category filters, dimensions formatting, and localized INR currency presentation.
   - **Critical Invariant:** Zero products added; reuses approved catalogue concepts only.

2. **GW-801: Worker Generation Adapter, Sheets Job Records, Stable Drive IDs & Idempotency (`src/lib/google-workspace/catalogue-worker.ts`)**:
   - Implements worker generation manager (`catalogueWorkerManager`) with explicit lifecycle management (`QUEUED`, `PROCESSING_SLIDES`, `RENDERING_PDF`, `COMPLETED`, `FAILED`, `CANCELLED`).
   - Protects against duplicate generation: re-queueing an existing snapshot reuses the completed job receipt without duplicate writes.
   - Derives deterministic, stable Google Drive IDs for native Slides (`1slides_...`) and PDF outputs (`1pdf_...`).
   - Tracks page counts, byte budgets, and output SHA-256 checksums.
   - Provides safe cancellation tokens (`cancelJob`) and retry support (`retryJob`).

3. **GW-802: Slide Layout Validation, Hindi Script Support, PDF Validation & Studio Access Gating (`src/lib/google-workspace/catalogue-validation.ts`)**:
   - Implements slide layout validation (`validateSlideLayout`) enforcing text bounds, strict 4:5 vertical artwork ratio verification (`validateAspectRatio4x5`), and Devanagari UTF-8 script validity for Hindi editions.
   - Implements PDF output validator (`validatePdfOutput`) verifying page count minimums, byte size bounds (50 KB to 50 MB), and cryptographic SHA-256 checksums.
   - Implements private Studio access resolution (`verifyCatalogueOutputAccess`): strictly denies unauthenticated requests or public sharing, restricting all catalogue slide decks and PDFs to authenticated Studio staff.

4. **Automated Unit Tests (4 new automated tests, 50/50 total Google Workspace tests passing)**:
   - `tests/google-workspace-catalogue-automation.test.mjs`:
     - Test 1: Catalogue configuration validation and artifact register.
     - Test 2: Freeze immutable catalogue input snapshot from approved concepts.
     - Test 3: Worker generation adapter, stable Drive IDs, and idempotency.
     - Test 4: Slide layout validation, Hindi script support, and Studio access gating.

## Validation & Test Results

- **Unit tests:** 50/50 Google Workspace tests passed across the full test suite.
- **Route typegen & TypeScript:** 0 errors (`npm run typecheck`).
- **ESLint:** 0 errors, 62 existing repository baseline warnings (`npm run lint`).
- **Preflight:** 12/12 checks passed (`npm run test:preflight`).

## Preservation & Safety Boundary

- **Public Website & Design:** Approved homepage, Rivya / Creations (169 selected images / 507 WebP variants), The Signature ("From liquid to light"), and footer layouts and styling remain completely untouched and byte-identical.
- **Studio Login & Security:** Authenticated Studio routes, session handling, rate limits, and security middleware remain completely unchanged.
- **Provider Authority:** Current PostgreSQL/Prisma database connections and Vercel Blob integrations remain 100% authoritative when Google Workspace adapter is unconfigured.
- **Data Safeguards:** Zero products added, zero test fixture products injected, zero archived catalogue/Sheets imports performed, zero database reseeding, zero request table repair replay. Catalogue overrides remain strictly separated from canonical products.
- **Cloud & Production Invariance:** Zero Google cloud writes, zero Drive resources created, zero Sheets modified, zero production database writes, zero CMS publications.
