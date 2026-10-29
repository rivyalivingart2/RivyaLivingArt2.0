# Active continuation — 28 October 2026

Read [the refreshed Netlify free-first checkpoint](../netlify-free-first-2026-10-28/CURRENT-STATE.md) and its latest owner brief first. Netlify is live at www.rivyalivingart.com on 7b390d5; PR #71 remains draft and production is locked to the migration branch. Continue locally on codex/netlify-free-first, preserving the migration commits. Sheets/Drive is the preferred target with a conditional, justified ongoing-free database exception. The Google replacement, migration, full Studio parity and release acceptance are incomplete. Historical completion claims below are dated and superseded; simulation receipts do not certify providers, backups or production. Preserve public/login design, records/media, credentials and OLDWEBSITE. Add no products and import no archived catalogue. No production migration, publication, credential rotation or old-resource deletion has occurred in this continuation.

---

# Google Workspace Controlled Cutover Runbook

**Version:** 1.0.0  
**Date:** 26 October 2026  
**Scope:** Controlled Storage Authority Switch, Backup Manifest & Rollback Procedures  
**Target Authority:** `google-workspace` (Sheets & Drive)  
**Safety Boundaries:** Bounded Write Pause (< 30s) · Emergency Rollback (< 15s) · Zero Public Storefront Drift · Zero SQL Fallback

---

## 1. Operational Overview

This runbook defines the exact, repeatable operational procedure for executing the storage authority transition from PostgreSQL/Vercel Blob to Google Workspace (Google Sheets & Google Drive) for the Rivya Living Art 2.0 platform.

### Core Architecture Invariants
1. **Single Authoritative Destination:** At any point in time, exactly one storage provider holds authoritative write and read status. Dual uncoordinated writes are strictly prohibited.
2. **Strict SQL Disablement:** Switching to `google-workspace` activates `RIVYA_SQL_DISABLED = true`. All SQL database connections are severed and throw `SqlDisabledError`.
3. **Preservation of Assets:** All 169 approved creations, 507 WebP responsive derivatives, The Signature ("From liquid to light"), and the public storefront remain byte-identical.
4. **Authorization Gating:** The cutover execution requires explicit authorization (`RIVYA_CUTOVER_AUTHORIZED = 'true'` or cryptographically signed token `cutover-auth-...`). Unauthorized attempts execute simulated dry-run validation without mutation.

---

## 2. Pre-Cutover Verification Checklist

Before initiating write pause or authority transition, ensure all prerequisites pass:

- [ ] **Google Workspace Unit Tests:** All 60 automated unit tests pass across 12 test suites (`node --import tsx --test tests/google-workspace-*.test.mjs`).
- [ ] **Preflight Checks:** 12/12 pass (`npm run test:preflight`).
- [ ] **TypeScript Typecheck:** 0 errors (`npm run typecheck`).
- [ ] **ESLint:** 0 errors, 62 baseline warnings (`npm run lint`).
- [ ] **Canonical Viewports:** 7/7 viewports verified (`[375, 540, 768, 800, 1080, 1440, 1920]`).
- [ ] **Reconciliation Report:** 28/28 tables reconciled (100% ID and payload hash agreement).
- [ ] **Backup Manifest:** Generated and verified at `docs/google-workspace-2026-10-24/backup-recovery-manifest.json`.

---

## 3. Step-by-Step Cutover Procedure

### Step 1: Pre-Cutover Dry Run
Execute simulated authority switch to confirm that all prerequisites, workbooks, and schemas are operational without mutating active traffic:
```typescript
import { authoritySwitchManager } from '@/lib/google-workspace/authority-switch';

const dryRunResult = authoritySwitchManager.executeSwitch({
  targetProvider: 'google-workspace',
  dryRun: true,
  operator: 'release-lead',
  reason: 'Pre-cutover readiness dry-run',
});

console.log(dryRunResult.status); // 'SIMULATED_DRY_RUN'
console.log(dryRunResult.prerequisites); // All checks must be true
```

### Step 2: Acquire Inbound Write Pause
Acquire bounded write pause on inbound mutations (orders, inquiries, newsletter subscriptions, CMS draft saves). Maximum allowed duration budget is **30 seconds**:
```typescript
import { cutoverOrchestrator } from '@/lib/google-workspace/cutover-runbook';

const pauseReceipt = cutoverOrchestrator.acquireWritePause({
  durationSeconds: 25,
  drainTimeoutMs: 3000,
  reason: 'Storage cutover to Google Workspace',
  operator: 'release-lead',
});

console.log(pauseReceipt.lockId); // e.g. 'wp-lock-...'
```

### Step 3: Final Delta Sync
Compute and commit any pending mutations that occurred since the initial migration snapshot:
```typescript
const deltaPlan = cutoverOrchestrator.planFinalDeltaSync([
  // Final pending mutations from transactional queue
]);

console.log(`Delta changes to commit: ${deltaPlan.totalChanges}`);
console.log(`Batch SHA-256: ${deltaPlan.batchSha256}`);
```

### Step 4: Atomic Publication Pointer Swap
Atomically advance the canonical publication pointer to the verified Google Workspace root snapshot:
```typescript
const pointerReceipt = cutoverOrchestrator.executeActivePointerSwitch(
  'drive-root-artifact-live-v1',
  'live-checksum-verified'
);

console.log(`Swapped to revision: ${pointerReceipt.newRevision}`);
```

### Step 5: Switch Storage Authority
Promote `google-workspace` as primary storage authority. This disables SQL database access across all app endpoints:
```typescript
const switchResult = authoritySwitchManager.executeSwitch({
  targetProvider: 'google-workspace',
  authorizationToken: process.env.RIVYA_CUTOVER_AUTH_TOKEN,
  operator: 'release-lead',
  reason: 'Authorized production cutover',
});

console.log(switchResult.status); // 'AUTHORITY_SWITCHED'
```

### Step 6: Post-Cutover Verification & Smoke Tests
Immediately execute read-only production acceptance verification (< 60s):
```typescript
import { verifyProductionAcceptance } from '@/lib/google-workspace/production-acceptance';

const acceptance = verifyProductionAcceptance();
console.log(`Acceptance Verdict: ${acceptance.verdict}`); // 'READY_FOR_RELEASE'
```

### Step 7: Post-Cutover Write Capture
All subsequent user interactions (newsletter signups, bespoke art inquiries, order updates) are recorded directly into the Google Workspace Operations workbook and mirrored in the `post_cutover_audit` ledger:
```typescript
const auditRecord = cutoverOrchestrator.capturePostCutoverWrite({
  table: 'rivya_inquiries',
  operation: 'insert',
  recordId: 'inq-live-001',
  payload: { customer: 'Private Client', type: 'BESPOKE' },
  actor: 'storefront-client',
});
```

---

## 4. Emergency Abort & Rollback Procedures

If any critical health check fails, latency degrades beyond budget, or unexpected errors occur during the cutover window, trigger emergency rollback immediately.

**Recovery Budget:** < 15 seconds.

```typescript
import { authoritySwitchManager } from '@/lib/google-workspace/authority-switch';

const rollbackResult = authoritySwitchManager.emergencyRollback(
  'Emergency rollback: health check threshold exceeded',
  'on-call-incident-lead'
);

console.log(rollbackResult.status); // 'ROLLED_BACK'
console.log(rollbackResult.restoredAuthority); // 'postgres'
```

### Rollback Recovery Actions:
1. Primary authority is immediately restored to `postgres`.
2. Any active write pause is released.
3. Post-cutover audit ledger entries recorded during the active window are preserved for offline replay into PostgreSQL.
4. Storefront traffic continues uninterrupted without customer data loss.

---

## 5. Post-Cutover Incident & Audit Governance

- **Write Recovery Guarantee:** In the event of an interruption or rollback, all writes captured in `post_cutover_audit` possess cryptographic SHA-256 signatures, monotonic sequence counters, and timestamps.
- **Data Reconciliation Verification:** Post-cutover reconciliation scripts (`tools/google-workspace/reconciliation-report.ts`) must be re-run within 2 hours of cutover to verify zero schema drift.
