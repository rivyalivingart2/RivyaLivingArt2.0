# Phase 10: Controlled Cutover & Release Preparation (tasks GW-1000, GW-1001, GW-1002) — PR Description

26 October 2026. Prepared on branch `codex/google-cloud-acceptance` from release checkpoint `40976b8` (Phase 5-9 PR specification commit).

## Summary of Changes

This Pull Request delivers Phase 10 of the Google Workspace transition programme, implementing the operational cutover runbook, backup and recovery manifest, write pause and delta sync protocols, authority switch state machine with authorization gating, and read-only production acceptance verification:

1. **GW-1000: Cutover Runbook, Backup/Recovery Manifest, Write Pause Protocol & Delta Sync (`src/lib/google-workspace/cutover-runbook.ts`, `docs/google-workspace-2026-10-24/CUTOVER-RUNBOOK.md`, `docs/google-workspace-2026-10-24/backup-recovery-manifest.json`)**:
   - Implements `cutoverOrchestrator` managing cutover lifecycle stages (`PRE_CUTOVER_STANDBY`, `WRITE_PAUSE_ACQUIRED`, `DELTA_SYNC_COMMITTED`, `POINTER_SWITCHED`, `POST_CUTOVER_ACTIVE`, `ROLLED_BACK`).
   - Generates machine-readable backup manifest tracking all 28 canonical tables (rows, primary keys, SHA-256 payload checksums) and 169 approved creations / 507 WebP variants across 4 workbooks (`content`, `operations`, `security`, `system`).
   - Implements bounded write pause protocol enforcing safety duration budgets (<= 30s) and non-blocking in-flight request drain.
   - Implements final delta sync planner guaranteeing zero canonical record deletions and atomic CAS publication pointer swapping.
   - Arms post-cutover recovery ledger (`post_cutover_audit`) with cryptographic sequence signatures.

2. **GW-1001: Authority Switch State Machine, Authorization Guard, Dry-Run & Emergency Rollback (`src/lib/google-workspace/authority-switch.ts`)**:
   - Implements `authoritySwitchManager` with strict **Authorization Gate**: direct cutover requires explicit authorized execution token or `RIVYA_CUTOVER_AUTHORIZED=true`.
   - Without authorization, runs simulated dry run validation with zero mutations while preserving `postgres` as primary authority.
   - Coordinates atomic authority transition to `google-workspace`, strictly disabling SQL database connections with `SqlDisabledError`.
   - Implements emergency rollback procedure restoring `postgres` authority and releasing write locks within a < 15s recovery budget.

3. **GW-1002: Read-Only Production Acceptance, SQL Disablement & Recovery Readiness (`src/lib/google-workspace/production-acceptance.ts`)**:
   - Implements `verifyProductionAcceptance` inspecting:
     - Public storefront integrity: all 169 creations, 507 WebP variants, The Signature, and footer visual contracts preserved.
     - Studio security ergonomics: login password verification, role scoping, and IP brute-force rate limits.
     - Strict SQL disablement: asserts `assertSqlAllowed` throws when Google Workspace is active.
     - Recovery readiness: verifies post-cutover recovery ledger probe and returns verdict `READY_FOR_RELEASE`.

4. **Automated Unit Tests (5 new automated tests, 60/60 total Google Workspace tests passing)**:
   - `tests/google-workspace-cutover.test.mjs`:
     - Test 1: Generate backup/recovery manifest across all 28 canonical tables and 169 creations.
     - Test 2: Write pause protocol, timeout budget enforcement (< 30s), and non-blocking drain.
     - Test 3: Authority switch state machine, authorization guard, and simulated dry-run validation.
     - Test 4: Authorized atomic authority switch execution, audit logging, and emergency rollback.
     - Test 5: Read-only production acceptance inspection, SQL disablement, and recovery readiness.

## Validation & Test Results

- **Unit tests:** 60/60 Google Workspace tests passed across the full test suite.
- **Route typegen & TypeScript:** 0 errors (`npm run typecheck`).
- **ESLint:** 0 errors, 62 existing repository baseline warnings (`npm run lint`).
- **Preflight:** 12/12 checks passed (`npm run test:preflight`).

## Preservation & Safety Boundary

- **Public Website & Design:** Approved homepage, Rivya / Creations (169 selected images / 507 WebP variants), The Signature ("From liquid to light"), and footer layouts and styling remain completely untouched and byte-identical.
- **Studio Login & Security:** Authenticated Studio routes, session handling, rate limits, and security middleware remain completely unchanged.
- **Provider Authority:** Current PostgreSQL/Prisma database connections and Vercel Blob integrations remain authoritative in ordinary operation; switching to Google Workspace completely disables SQL without regression.
- **Data Safeguards:** Zero products added, zero test fixture products injected, zero archived catalogue/Sheets imports performed, zero database reseeding, zero request table repair replay.
- **Cloud & Production Invariance:** Zero Google cloud writes, zero Drive resources created, zero Sheets modified, zero production database writes, zero CMS publications.
