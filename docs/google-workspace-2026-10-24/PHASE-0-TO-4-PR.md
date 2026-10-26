# Pull Request: Phase 0 to 4 — Google Workspace Backend Replacement, Drive Publication Pipeline & Isolated Migration Rehearsal

* **Base branch:** `main`
* **Compare branch:** `codex/google-cloud-acceptance`
* **Commits included:**
  - `075ea96`: Add Phase 3 isolated migration rehearsal, checkpointing, and reconciliation reporting
  - `32fa573`: Add Phase 4 Task GW-400 Studio Auth & Staff restricted Google adapters
  - `cbcf2bb`: Add Phase 4 Task GW-401 Drive-backed publication adapters
  - `53ee517`: Add Phase 4 Task GW-402 operations adapters and GW-403 provider switch

---

## Executive Summary

This Pull Request consolidates and delivers the foundational and backend replacement phases (Phases 0 through 4) of the Google Workspace transition programme. It replaces historical PostgreSQL/Vercel Blob dependencies with isolated Google Workspace adapters (Security, Content/Publication, Operations, and System Workbooks) while strictly preserving the approved public visual design, authenticated Studio login ergonomics, and existing data assets.

---

## Detailed Summary of Changes by Phase

### Phase 0 & 1: Audit, Schema Contract & Architectural Design
- Mapped all 28 canonical database tables, 230 columns, and 45 constraints into four isolated Google Workspace workbooks (`Security`, `Content`, `Operations`, `System`).
- Documented in `src/lib/google-workspace/schema.json`, `data-dictionary.csv`, and architectural decision records.

### Phase 2: Core Google Foundations
- Delivered typed record codec (`record-codec.ts`) preserving IDs, dates, currencies, formulas-as-text, and oversized Drive JSON references.
- Implemented controlled writer and signed gateway contracts (`controlled-writer.ts`, `writer-gateway.ts`) ensuring ScriptLock concurrency and original-receipt replay.
- Delivered durable jobs and canonical document storage (`durable-jobs.ts`, `drive-documents.ts`).

### Phase 3: Isolated Migration Rehearsal & Reconciliation
- **Migration Importer (`src/lib/google-workspace/importer.ts`)**: Implements chunked migration planning, deterministic primary key generation, and resilient checkpointing (`ImporterCheckpoint`) allowing safe resumption with zero duplicate commits.
- **Reconciliation Engine (`src/lib/google-workspace/reconciliation.ts`)**: Reconciles 28/28 canonical tables and 169 creation items / 507 variants with 100% ID and SHA-256 payload agreement.

### Phase 4: Backend Replacement Adapters
- **Task GW-400 (Security Adapter - `src/lib/google-workspace/security-adapter.ts`)**:
  - Manages restricted security tables (`staff`, `studio_sessions`, `studio_login_limits`, `access_requests`).
  - Scrypt password hashing, session lifecycle (8h absolute / 30m idle), credential-version invalidation, and rate-limiting.
  - Transparent delegation in `studio-auth.ts`, `studio-staff.ts`, `request-security.ts`, and `studio-access.ts`.
- **Task GW-401 (Publication Adapter - `src/lib/google-workspace/publication-adapter.ts`)**:
  - Drive-backed publication bundle pinning (`source`, `content`, `media`, `presentation`).
  - Atomic Compare-And-Swap (CAS) pointer updates and request-scoped coherent publication pinning.
  - Transparent delegation in `published-source.ts`, `published-media.ts`, and `published-design-source.ts`.
- **Task GW-402 (Operations Adapter - `src/lib/google-workspace/operations-adapter.ts`)**:
  - Manages operations tables (`inquiries`, `studio_orders`, `studio_order_events`, `inquiry_notes`, `newsletter_subscribers`, `references`).
  - Idempotent newsletter subscription capture (`ON CONFLICT DO NOTHING`), filtering, sorting, and pagination.
  - Inquiry creation, staff assignment scoping, and strict private reference protection preventing arbitrary file ID traversal.
  - Transparent delegation in `subscribers.ts`, `src/app/api/newsletter/route.ts`, and `studio-access.ts`.
- **Task GW-403 (Provider Switch - `src/lib/google-workspace/provider-switch.ts`, `src/lib/studio-db.ts`)**:
  - Unified storage provider abstraction (`StorageProvider = 'postgres' | 'google-workspace' | 'disabled'`).
  - Enforces SQL disabling guards when operating in Google Workspace mode.

---

## Verification & Test Results

| Verification Suite | Result | Details |
|---|---|---|
| **Google Workspace Unit Tests** | **32/32 PASS** | All 8 GW-400, 5 GW-401, 6 GW-402, 4 GW-403, 6 importer, and 3 reconciliation tests pass cleanly. |
| **Preflight Suite** | **12/12 PASS** | All preflight identity and repository isolation checks pass (`npm run test:preflight`). |
| **Route Typegen & TypeScript** | **0 Errors** | Route types generated and `tsc --noEmit` passed with 0 errors (`npm run typecheck`). |
| **ESLint Static Analysis** | **0 Errors** | ESLint passed with 0 errors and exactly 62 baseline repository warnings (`npm run lint`). |
| **Working Tree** | **Clean** | All commits committed to `codex/google-cloud-acceptance`. |

---

## Preservation Guarantees Maintained

1. **Approved Public Design:** Homepage, Rivya / Creations, The Signature ("From liquid to light"), and footer remain byte-identical.
2. **Studio Security & Login:** Studio login routes, markup, and rate limits remain completely unchanged.
3. **Provider Fallback:** Existing PostgreSQL and Vercel Blob connections remain authoritative when Google Workspace adapters are unconfigured.
4. **Data Protection:** Zero products added, zero catalogue imports, no database reseeding, and no attempt to recover deleted source records.
5. **Zero Cloud Side Effects:** Zero unapproved Google Cloud writes, zero Drive resources created in production, zero CMS publications.
