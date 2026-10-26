# Phase 7: Scraper Expansion (tasks GW-700, GW-701, GW-702) — PR Description

26 October 2026. Prepared on branch `codex/google-cloud-acceptance` from release checkpoint `474329b` (Phase 6 delivery commit).

## Summary of Changes

This Pull Request delivers Phase 7 of the Google Workspace transition programme, establishing vendor source governance, bounded scraper job execution, candidate observation tracking, review workflows, and strict product insertion safeguards:

1. **GW-700: Vendor Source Registry & Access Boundaries (`src/lib/google-workspace/scraper-registry.ts`)**:
   - Implements strongly-typed vendor source registry managing all 23 legacy configured sources across platforms (`WOOCOMMERCE`, `SHOPIFY`, `JSONLD`, `UNKNOWN`) and tiers (`OWNER`, `LARGE_FORMAT`, `MEDIUM_FORMAT`, `SMALL_FORMAT`).
   - Categorizes permitted access methods (`STORE_API`, `SHOPIFY_API`, `JSON_LD`, `MANUAL_RESEARCH`) and operational statuses (`ACTIVE_ACCESSIBLE`, `MANUAL_ONLY`, `CATALOGUE_EMPTY`, `BLOCKED_ACCESS`).
   - Strictly enforces compliance boundaries: `bypassAccessControls: false`, `requiresAuth: false`, and bounded rate limits (max 30 RPM, concurrency 2).
   - Sites requiring Cloudflare challenges or logins fail closed into manual research records without automated dispatch.

2. **GW-701: Bounded Scraper Adapters, Jobs & Deduplication (`src/lib/google-workspace/scraper-adapters.ts`)**:
   - Implements bounded scraper job execution with explicit state management (`QUEUED`, `RUNNING`, `COMPLETED`, `FAILED`, `CANCELLED`).
   - Rejects job creation on blocked/manual sources with clear diagnostic feedback.
   - Normalizes raw vendor items into immutable candidate observations (`CandidateObservation`) with SHA-256 payload deduplication.
   - Provides cancellation tokens (`cancelScraperJob`) to cleanly halt in-flight extractions.
   - Quarantines parsing failures into diagnostic logs without terminating queue execution.

3. **GW-702: Candidate Review, Mapping & Product Creation Guard (`src/lib/google-workspace/scraper-handoff.ts`)**:
   - Implements structured candidate review proposals (`proposeCandidateMapping`), allowing researchers to inspect traceable candidates, infer suggested tiers (`LARGE`, `MEDIUM`, `SMALL`), estimate price ranges, and record review dispositions (`ACCEPTED_RESEARCH`, `REJECTED`, `NEEDS_INVESTIGATION`).
   - Provides multi-criteria filtering for candidate inspection.
   - **CRITICAL SAFEGUARD:** Product creation from scraper observations is strictly disabled (`CAN_CREATE_PRODUCT = false`). `assertProductCreationDisabled()` and `executeProductHandoff()` always throw and fail closed, guaranteeing that candidate research remains 100% isolated from canonical business and catalogue records.

4. **Automated Unit Tests (3 new automated tests, 46/46 total Google Workspace tests passing)**:
   - `tests/google-workspace-scraper-expansion.test.mjs`:
     - Test 1: Vendor registry has all 23 sources and enforces strict compliance boundaries.
     - Test 2: Bounded scraper adapters prevent scraping manual/blocked sites and handle jobs safely.
     - Test 3: Candidate review, filtering, and strict prohibition of product creation.

## Validation & Test Results

- **Unit tests:** 46/46 Google Workspace tests passed across the full test suite.
- **Route typegen & TypeScript:** 0 errors (`npm run typecheck`).
- **ESLint:** 0 errors, 62 existing repository baseline warnings (`npm run lint`).
- **Preflight:** 12/12 checks passed (`npm run test:preflight`).

## Preservation & Safety Boundary

- **Public Website & Design:** Approved homepage, Rivya / Creations (169 selected images / 507 WebP variants), The Signature ("From liquid to light"), and footer layouts and styling remain completely untouched and byte-identical.
- **Studio Login & Security:** Authenticated Studio routes, session handling, rate limits, and security middleware remain completely unchanged.
- **Provider Authority:** Current PostgreSQL/Prisma database connections and Vercel Blob integrations remain 100% authoritative when Google Workspace adapter is unconfigured.
- **Data Safeguards:** Zero products added, zero test fixture products injected, zero archived catalogue/Sheets imports performed, zero database reseeding, zero request table repair replay.
- **Cloud & Production Invariance:** Zero Google cloud writes, zero Drive resources created, zero Sheets modified, zero production database writes, zero CMS publications.
