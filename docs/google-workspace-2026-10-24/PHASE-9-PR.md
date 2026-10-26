# Phase 9: Full Integrated Verification (tasks GW-900, GW-901, GW-902) — PR Description

26 October 2026. Prepared on branch `codex/google-cloud-acceptance` from release checkpoint `2847189` (Phase 8 delivery commit).

## Summary of Changes

This Pull Request delivers Phase 9 of the Google Workspace transition programme, implementing full cross-module integrated verification, security invariants and concurrency resilience, 7-width canonical responsive viewport matrix verification, and provider independence proof:

1. **GW-900: Cross-Module Integration Journeys, End-to-End Data Flow & Lifecycle Verification (`src/lib/google-workspace/integrated-verification.ts`)**:
   - Implements `executeCrossModuleJourney` orchestrating comprehensive data flow across 6 core subsystems without SQL or legacy database reliance:
     1. Authenticated Studio administrative login and session issuance.
     2. Operations order lifecycle transitions with append-only event ledger and optimistic locking CAS version increments.
     3. Media association validation and truthful customer claims verification (zero invented reviews or customers).
     4. Vendor scraper observation ingestion with strictly isolated candidate review (`CAN_CREATE_PRODUCT = false`).
     5. Catalogue generation snapshot freeze with deterministic hashing and stable Drive IDs.
     6. CMS publication bundle activation with content-addressed SHA-256 artifacts and atomic pointer updates.

2. **GW-901: Security Invariants, Optimistic Locking (CAS), Idempotency & Failure Resilience (`src/lib/google-workspace/integrated-verification.ts`)**:
   - Implements `verifySecurityAndFailureResilience` validating critical operational and security invariants:
     - **Optimistic Locking (CAS):** Verifies that concurrent or stale updates with mismatched expected versions throw explicit CAS conflict errors and prevent dirty writes.
     - **Response-Loss Idempotency:** Validates that duplicate replay operations return idempotent success without duplicate row commits or duplicate subscribers.
     - **Authentication Governance:** Verifies 8-hour maximum session lifetimes, 30-minute idle sliding expiration, immediate token revocation, IP rate limiting (blocking after 3 failed attempts within a 15-minute window), and quarantine/rejection of malformed JSON payloads.

3. **GW-902: Seven-Width Canonical Responsive Viewport Matrix, Touch Ergonomics & Provider Independence (`src/lib/google-workspace/integrated-verification.ts`)**:
   - Implements `verifySevenWidthResponsiveMatrix` verifying all 7 canonical viewports (`[375, 540, 768, 800, 1080, 1440, 1920]`), enforcing responsive layout adaptation, zero horizontal overflow, and minimum touch target ergonomics (>= 44px on mobile, >= 40px on tablet, >= 36px on desktop).
   - Implements `proveProviderIndependence` demonstrating 100% operational autonomy when `RIVYA_STORAGE_PROVIDER = 'google-workspace'` and `RIVYA_SQL_DISABLED = true`.
   - Proves that SQL database calls throw `SqlDisabledError` and legacy/deleted databases cannot be queried or contacted under the Google Workspace provider.

4. **Automated Unit Tests (5 new automated tests, 55/55 total Google Workspace tests passing)**:
   - `tests/google-workspace-integrated-verification.test.mjs`:
     - Test 1: Full cross-module integration journey execution.
     - Test 2: Order state transition failure resilience and event ordering.
     - Test 3: Security invariants, optimistic locking (CAS), idempotency, and rate limiting.
     - Test 4: Canonical seven-width responsive viewport matrix.
     - Test 5: Provider independence proof under `RIVYA_STORAGE_PROVIDER = 'google-workspace'` and `RIVYA_SQL_DISABLED = true`.

## Validation & Test Results

- **Unit tests:** 55/55 Google Workspace tests passed across the full test suite.
- **Route typegen & TypeScript:** 0 errors (`npm run typecheck`).
- **ESLint:** 0 errors, 62 existing repository baseline warnings (`npm run lint`).
- **Preflight:** 12/12 checks passed (`npm run test:preflight`).

## Preservation & Safety Boundary

- **Public Website & Design:** Approved homepage, Rivya / Creations (169 selected images / 507 WebP variants), The Signature ("From liquid to light"), and footer layouts and styling remain completely untouched and byte-identical.
- **Studio Login & Security:** Authenticated Studio routes, session handling, rate limits, and security middleware remain completely unchanged.
- **Provider Authority:** Current PostgreSQL/Prisma database connections and Vercel Blob integrations remain authoritative when Google Workspace adapter is unconfigured; Google Workspace operates with complete independence and zero SQL dependencies when activated.
- **Data Safeguards:** Zero products added, zero test fixture products injected, zero archived catalogue/Sheets imports performed, zero database reseeding, zero request table repair replay. Candidate scraper items strictly cannot create products.
- **Cloud & Production Invariance:** Zero Google cloud writes, zero Drive resources created, zero Sheets modified, zero production database writes, zero CMS publications.
