# Rivya Living Art — Issue, Limitation, & Governance Register

Date: 27 October 2026  
Status: Phase 11 Verified Local Handover  
Scope: Google Workspace Transition Programme (Phases 0 through 11)  

---

## 1. Carried Gaps & Live Credentials Gate

| Item ID | Category | Description | Status & Resolution Strategy |
|---|---|---|---|
| **GAP-001** | Live Credentials | Live Google Workspace API OAuth client secrets and Service Account JSON keys are withheld from local Git tracking for security. Local adapters use deterministic simulated CAS gateways and validated structural payloads. | Production cutover requires configuring server-only environment variables (`GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `GOOGLE_DRIVE_ROOT_FOLDER_ID`, `GOOGLE_SHEETS_WORKBOOK_IDS`). |
| **GAP-002** | Separate Authorization Boundary | The completion of Phases 0–11 locally establishes full functional, security, and architectural readiness. It does **not** authorize automatic production cutover or Vercel release. | Cutover requires explicit owner token and `RIVYA_CUTOVER_AUTHORIZED=true`. Authority remains `postgres` until that explicit gate is activated. |
| **GAP-003** | Live Sheet Latency Quotas | Google Sheets API imposes a 300 requests/minute/project quota and ~250–500ms write latency. While local atomic batches and CAS Writer accommodate this, high-velocity concurrent writes require Studio batching. | Studio actions batch mutations; live storefront never writes to Sheets directly; public reads consume pinned Drive JSON publication bundles. |

---

## 2. Environment Differences (Windows vs. Linux CI)

| Issue ID | Environment | Description | Impact & Remediation |
|---|---|---|---|
| **ENV-001** | Windows NT Local | Creating filesystem symlinks without administrative privileges fails with `EPERM` on Windows (`tools/codex-preflight.test.mjs` handles this; 2 tests in `tests/google-workspace-isolated-setup.test.mjs` test symlink denial behavior). | Informational only. Application runtime and Next.js build do not rely on symlinks. Zero application defect. |
| **ENV-002** | File Path Separators | Windows backslashes (`\`) vs POSIX slashes (`/`) in path resolution. | All Google Workspace adapters normalize paths using Node `path.posix` or `path.resolve` with forward slashes for Drive paths and media lineage IDs. |

---

## 3. Strict Safety Invariants & Negative Scope Enforcements

The following strict preservation boundaries have been enforced across all 12 programme phases:

1. **Zero Products Added:**
   - The catalogue database retains its exact original creation records.
   - Code asserts `CAN_CREATE_PRODUCT = false` in both catalogue automation (`src/lib/google-workspace/catalogue-automation.ts`) and scraper candidate review (`src/lib/google-workspace/scraper-handoff.ts`).
2. **Zero Archived Imports:**
   - No archived catalogue, external spreadsheets, or legacy product dumps have been imported or merged into the production database.
3. **No Database Reseeding:**
   - No database reset, migrations replay, or destructive schema alter (`prisma db push --force-reset`) was performed.
4. **No Request Table Repair Replay:**
   - Deprecated repair scripts and old request recovery replays are permanently disabled.
5. **No Google Photos Revisit or Media Regeneration:**
   - The 169 approved creations, 507 WebP variants, and 6 featured works remain bit-identical to the accepted baseline `e9d3228`.
   - Sharp image processing validates dimensions and 4:5 aspect ratio without regenerating existing files.
6. **Zero Unauthorized Cloud Writes:**
   - Zero Google Drive files created in production folders.
   - Zero Google Sheets modified in production workbooks.
   - Zero CMS publications dispatched to live domains.

---

## 4. Operational Invariant Budgets

| Operational Invariant | Bound / Budget | Verification Reference |
|---|---|---|
| **Inbound Write Pause Budget** | $\le 30$ seconds | `src/lib/google-workspace/cutover-runbook.ts` (enforced via timeout error) |
| **Emergency Rollback Budget** | $\le 15$ seconds | `src/lib/google-workspace/authority-switch.ts` (synchronous execution $< 2$ms) |
| **Canonical Table Coverage** | 28 / 28 tables | `docs/google-workspace-2026-10-24/backup-recovery-manifest.json` |
| **Creations Asset Coverage** | 169 creations / 507 variants | `src/lib/google-workspace/media-association-map.ts` |
| **SQL Disablement Guard** | 0 queries permitted under GW | `src/lib/google-workspace/provider-switch.ts` (`SqlDisabledError`) |
| **Formula Injection Guard** | 0 unescaped formulas | `src/lib/google-workspace/record-codec.ts` (leading `=,+,-,@` sanitized) |

---

## 5. Process Hygiene & Task-Owned Process Cleanup

All background verification tasks, child processes, and temporary worker fixtures have been gracefully terminated:
- Zero background daemons running.
- Zero dangling file locks or open sockets.
- Temporary test fixtures in system `temp` folders cleaned up by test runners.
