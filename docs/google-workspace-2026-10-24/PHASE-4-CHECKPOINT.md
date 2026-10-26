# Phase 4 — Backend replacement: Full Phase Delivery Checkpoint

26 October 2026. Continued on continuation branch `codex/google-cloud-acceptance` from release checkpoint `075ea96` (Phase 3 delivery commit) and `32fa573` (GW-400 commit), `cbcf2bb` (GW-401 commit). Phase 4 Tasks GW-400, GW-401, GW-402, and GW-403 are **complete locally and verified** in full accordance with the [Phase Plan](PHASE-PLAN.md) and [Architecture Decision](../../decisions/2026-10-24-sheets-drive.md).

## Delivered implementation

| Task | Module / Artifact | Behavior and Verification Boundary |
|---|---|---|
| **GW-400: Restricted Security Adapter** | `src/lib/google-workspace/security-adapter.ts`<br>`src/lib/studio-auth.ts`<br>`src/lib/studio-staff.ts`<br>`src/lib/request-security.ts`<br>`src/lib/studio-access.ts`<br>`tests/google-workspace-studio-auth.test.mjs` | Restricted identity security adapter for the 4 security tables (`staff`, `studio_sessions`, `studio_login_limits`, `access_requests`). Implements password verification with scrypt, account roles/status, secure session lifecycle (8h absolute / 30m idle sliding window), immediate credential-version invalidation on password change, durable account-wide throttling, and access/recovery link issuance and redemption. Top-level auth, staff, rate-limiting, and access APIs delegate seamlessly to the adapter while preserving default SQL fallback. |
| **GW-401: Drive Publication Adapter** | `src/lib/google-workspace/publication-adapter.ts`<br>`src/lib/published-source.ts`<br>`src/lib/published-media.ts`<br>`src/lib/published-design-source.ts`<br>`tests/google-workspace-publication-adapter.test.mjs` | Drive-backed coherent publication adapter pinning immutable versioned JSON snapshots (`source`, `content`, `media`, `presentation`) in Drive. Implements optimistic concurrency control (CAS) for active pointer updates, request-scoped publication pinning to prevent tear/mix across requests, draft/private exclusion, and preservation of last-good-version on publication/verification failure. Seamless delegation in `published-source.ts`, `published-media.ts`, and `published-design-source.ts` preserves SQL fallback when unconfigured. |
| **GW-402: Inquiry & Subscriber Operations** | `src/lib/google-workspace/operations-adapter.ts`<br>`src/lib/subscribers.ts`<br>`src/app/api/newsletter/route.ts`<br>`src/lib/studio-access.ts`<br>`tests/google-workspace-operations-adapter.test.mjs` | Operations workbook adapter for `operations.inquiries`, `operations.studio_orders`, `operations.studio_order_events`, `operations.inquiry_notes`, `operations.newsletter_subscribers`, and `operations.references`. Implements idempotent subscriber capture (`ON CONFLICT DO NOTHING`), subscriber filtering/sorting/pagination, inquiry/order creation with initial order event, staff assignment scoping (editors only view assigned inquiries), and strict private reference protection preventing arbitrary file ID or path retrieval. |
| **GW-403: Studio DB Provider Switch** | `src/lib/google-workspace/provider-switch.ts`<br>`src/lib/studio-db.ts`<br>`tests/google-workspace-provider-switch.test.mjs` | Unified storage provider abstraction (`StorageProvider = 'postgres' \| 'google-workspace' \| 'disabled'`). Allows switching between PostgreSQL and Google Workspace via runtime config or `RIVYA_STORAGE_PROVIDER` / `RIVYA_SQL_DISABLED` environment variables. Protects against unintended SQL access when running in Google Workspace mode. |

## Test and verification summary

- **Unit tests:** 32/32 Google Workspace tests passed across the full test suite.
  - `tests/google-workspace-studio-auth.test.mjs`: 8/8 tests passed (admin verification, staff password hashing & authentication, absolute & idle session expiration, credential-version invalidation, explicit session revocation, rate limit window enforcement, access request & redemption lifecycle, workspace staff role scoping).
  - `tests/google-workspace-publication-adapter.test.mjs`: 5/5 tests passed (initial unpinned/unactivated state, publish with immutable artifact and atomic CAS pointer update, request-scoped coherent publication pinning, CAS conflict protection on concurrent publish, failed asset verification retaining last good version and blocking CAS).
  - `tests/google-workspace-operations-adapter.test.mjs`: 6/6 tests passed (subscriber capture & idempotency, filtering & pagination & sorting, inquiry & order creation, staff assignment scoping, optimistic status locking, private media permission gating).
  - `tests/google-workspace-provider-switch.test.mjs`: 4/4 tests passed (default postgres behavior, environment activation, SQL disabled mode, runtime provider override).
  - `tests/google-workspace-importer.test.mjs`: 6/6 tests passed.
  - `tests/google-workspace-reconciliation.test.mjs`: 3/3 tests passed.
  - Preflight suite: 12/12 passed (`npm run test:preflight`).
- **Static analysis & typecheck:**
  - Route typegen & TypeScript: 0 errors (`npm run typecheck`).
  - ESLint: 0 errors, 62 existing repository baseline warnings (`npm run lint`).

## Preservation and boundaries

1. **Approved visual design:** The public homepage, Rivya / Creations gallery, The Signature ("From liquid to light"), footer, typography, and styling remain untouched and byte-identical.
2. **Studio login & security:** Authenticated Studio routes, session handling, rate limits, and security middleware remain completely unchanged. Login presentation and markup are preserved.
3. **Current provider authority:** Existing PostgreSQL/Prisma database connections and Vercel Blob integrations remain 100% authoritative when Google Workspace adapter is unconfigured.
4. **Data preservation:** Zero products added, zero test fixture products injected, zero archived catalogue/Sheets imports performed, zero database reseeding, zero request table repair replay.
5. **Zero cloud side effects:** Zero Google cloud writes, zero Drive resources created, zero Sheets modified, zero production database writes, zero CMS publications.
