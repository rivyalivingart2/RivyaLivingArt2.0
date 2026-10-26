# Phase 4: Backend replacement (tasks GW-400, GW-401, GW-402, GW-403) — PR Description

26 October 2026. Prepared on branch `codex/google-cloud-acceptance` from release checkpoint `075ea96` (Phase 3 delivery commit).

## Summary of Changes

This Pull Request delivers Phase 4 of the Google Workspace transition programme, replacing the backend runtime adapters across authentication, publication, operations, and storage switching:

1. **GW-400: Studio Auth & Staff Restricted Google Adapters (`src/lib/google-workspace/security-adapter.ts`)**:
   - Implements restricted identity security adapter managing the four security tables (`staff`, `studio_sessions`, `studio_login_limits`, `access_requests`).
   - Secure scrypt password verification, account roles/status, session lifecycle (8h absolute / 30m idle sliding window), and immediate credential-version invalidation on password change.
   - Durable rate-limiting across instances and access/recovery link issuance and redemption.
   - Integrated seamlessly into `src/lib/studio-auth.ts`, `src/lib/studio-staff.ts`, `src/lib/request-security.ts`, and `src/lib/studio-access.ts` with transparent SQL fallback.

2. **GW-401: Drive-Backed Publication Adapters (`src/lib/google-workspace/publication-adapter.ts`)**:
   - Implements Drive-backed publication adapter pinning immutable versioned JSON snapshots (`source`, `content`, `media`, `presentation`).
   - Atomic Compare-And-Swap (CAS) pointer updates on publication.
   - Request-scoped publication pinning ensuring a single coherent version lifecycle per request without torn reads.
   - Automatic preservation of last-good-version and rollback if publication validation or asset verification fails.
   - Seamlessly integrated into `src/lib/published-source.ts`, `src/lib/published-media.ts`, and `src/lib/published-design-source.ts`.

3. **GW-402: Inquiry, Subscriber, and Private Media Operations Adapters (`src/lib/google-workspace/operations-adapter.ts`)**:
   - Implements operations workbook adapter managing `operations.inquiries`, `operations.studio_orders`, `operations.studio_order_events`, `operations.inquiry_notes`, `operations.newsletter_subscribers`, and `operations.references`.
   - Idempotent newsletter subscription capture with lowercase deduplication (`ON CONFLICT DO NOTHING`).
   - Filtered, sorted, paginated subscriber queries.
   - Inquiry and Studio Order creation with automatic initial order event recording.
   - Staff assignment scoping ensuring editors cannot access inquiries outside their assignment.
   - Strict private reference resolution gating preventing arbitrary file ID or path retrieval.
   - Seamlessly integrated into `src/lib/subscribers.ts`, `src/app/api/newsletter/route.ts`, and `src/lib/studio-access.ts`.

4. **GW-403: Studio DB Provider Switch & Removal Checkpoint (`src/lib/google-workspace/provider-switch.ts`, `src/lib/studio-db.ts`)**:
   - Unified storage provider abstraction (`StorageProvider = 'postgres' | 'google-workspace' | 'disabled'`).
   - Controls provider selection via runtime functions (`setStorageProvider`) or environment variables (`RIVYA_STORAGE_PROVIDER`, `RIVYA_SQL_DISABLED`).
   - Guards against unintended SQL execution when operating in Google Workspace mode.

5. **Comprehensive Test Coverage (23 new automated unit tests, 32/32 total Google Workspace tests passing)**:
   - `tests/google-workspace-studio-auth.test.mjs` (8 tests): security adapter, scrypt verification, session lifecycle, revocation, rate-limits, access link redemption.
   - `tests/google-workspace-publication-adapter.test.mjs` (5 tests): unpinned state, atomic publish, request-scoped pinning, CAS conflict detection, failed publication fallback.
   - `tests/google-workspace-operations-adapter.test.mjs` (6 tests): subscriber idempotency, subscriber queries/pagination, inquiry/order creation, assignment scoping, optimistic locking, private media gating.
   - `tests/google-workspace-provider-switch.test.mjs` (4 tests): default postgres mode, Google Workspace mode, SQL disabled mode, runtime overrides.

## Validation & Test Results

- **Unit tests:** 32/32 Google Workspace tests passed across the full test suite.
- **Route typegen & TypeScript:** 0 errors (`npm run typecheck`).
- **ESLint:** 0 errors, 62 existing repository baseline warnings (`npm run lint`).
- **Preflight:** 12/12 checks passed (`npm run test:preflight`).

## Preservation & Safety Boundary

- **Public Website & Design:** Approved homepage, Rivya / Creations, The Signature ("From liquid to light"), and footer layouts and styling remain completely untouched and byte-identical.
- **Studio Login & Security:** Authenticated Studio routes, session handling, rate limits, and security middleware remain completely unchanged. Login presentation and markup are preserved.
- **Provider Authority:** Current PostgreSQL/Prisma database connections and Vercel Blob integrations remain 100% authoritative when Google Workspace adapter is unconfigured.
- **Data Safeguards:** Zero products added, zero test fixture products injected, zero archived catalogue/Sheets imports performed, zero database reseeding, zero request table repair replay.
- **Cloud & Production Invariance:** Zero Google cloud writes, zero Drive resources created, zero Sheets modified, zero production database writes, zero CMS publications.
