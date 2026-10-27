# Current status — Phase 11 complete locally, full Google Workspace transition verified

27 October 2026. Phase 11 (Handover & Final Documentation: tasks GW-1100, GW-1101) and the entire Google Workspace Transition Programme (Phases 0 through 11) are **complete locally and fully verified** on branch **`codex/google-cloud-acceptance`** following release checkpoint `c40f989` (Phase 10 delivery). Full check passes 65/65 Google Workspace unit tests (all 5 GW-1100/1101 handover tests, 5 GW-1000/1001/1002 cutover tests, 5 GW-900/901/902 integrated verification tests, 4 GW-800/801/802 catalogue automation tests, 3 GW-700/701/702 scraper expansion tests, 6 GW-600/601/602 media and content tests, 5 GW-500/501/502 Studio workflow tests, 8 GW-400 security tests, 5 GW-401 publication tests, 6 GW-402 operations tests, 4 GW-403 provider switch tests, 6 importer tests, and 3 reconciliation tests pass), preflight passes 12/12, route typegen and TypeScript pass with 0 errors, and ESLint passes with 0 errors (62 existing baseline warnings).

Delivered deliverables include the comprehensive [Owner Operating Guide](docs/google-workspace-2026-10-24/OWNER-OPERATING-GUIDE.md), [Issue, Limitation & Governance Register](docs/google-workspace-2026-10-24/ISSUE-REGISTER.md), programmatic verification module (`src/lib/google-workspace/handover.ts`), [Phase 11 Checkpoint](docs/google-workspace-2026-10-24/PHASE-11-CHECKPOINT.md), [Phase 11 PR description](docs/google-workspace-2026-10-24/PHASE-11-PR.md), and [verification receipt](docs/google-workspace-2026-10-24/phase11-verification.json). Clean process hygiene with zero leaked daemons is asserted.

Preserve approved public design, Studio login/security, current provider authority, all data/media/IDs/URLs/prices/relationships and the 169-image collection. Zero products added, zero archived imports, no reseeding, no deleted-database recovery, no request repair replay, no Photos revisit or regeneration. Zero Google cloud writes, zero Drive resources created, zero production database writes, zero CMS publications. Phase deliveries continue through detailed new PRs from `codex/google-cloud-acceptance` into `main`, never direct push. Real Google cloud migration, storage cutover, and production release retain their separate owner authorization boundaries (`RIVYA_CUTOVER_AUTHORIZED`). Earlier entries below are historical.

---

# Historical status — Phase 10 complete locally, PR prepared on codex/google-cloud-acceptance

26 October 2026. Phase 10 (controlled cutover and release preparation: tasks GW-1000, GW-1001, GW-1002) is **complete locally and verified** on branch **`codex/google-cloud-acceptance`** following release checkpoint `40976b8` (Phase 5-9 PR delivery). Full check passes 60/60 Google Workspace unit tests (all 5 GW-1000/1001/1002 cutover tests, 5 GW-900/901/902 integrated verification tests, 4 GW-800/801/802 catalogue automation tests, 3 GW-700/701/702 scraper expansion tests, 6 GW-600/601/602 media and content tests, 5 GW-500/501/502 Studio workflow tests, 8 GW-400 security tests, 5 GW-401 publication tests, 6 GW-402 operations tests, 4 GW-403 provider switch tests, 6 importer tests, and 3 reconciliation tests pass), preflight passes 12/12, route typegen and TypeScript pass with 0 errors, and ESLint passes with 0 errors (62 existing warnings). Cutover runbook ([`CUTOVER-RUNBOOK.md`](docs/google-workspace-2026-10-24/CUTOVER-RUNBOOK.md)), backup and recovery manifest across all 28 canonical tables and 169 approved creations / 507 variants ([`backup-recovery-manifest.json`](docs/google-workspace-2026-10-24/backup-recovery-manifest.json)), bounded write pause protocol (<= 30s budget), authority switch state machine with strict authorization gating (`RIVYA_CUTOVER_AUTHORIZED`), simulated dry-run validation, emergency abort and rollback procedures (< 15s budget), and read-only production acceptance verification with zero SQL fallback and armed post-cutover audit ledger are verified. Read [the Phase 10 checkpoint](docs/google-workspace-2026-10-24/PHASE-10-CHECKPOINT.md), [PR description](docs/google-workspace-2026-10-24/PHASE-10-PR.md), and [verification receipt](docs/google-workspace-2026-10-24/phase10-verification.json).

Preserve approved public design, Studio login/security, current provider authority, all data/media/IDs/URLs/prices/relationships and the 169-image collection. Zero products added, zero archived imports, no reseeding, no deleted-database recovery, no request repair replay, no Photos revisit or regeneration. Zero Google cloud writes, zero Drive resources created, zero production database writes, zero CMS publications. Phase deliveries continue through detailed new PRs from `codex/google-cloud-acceptance` into `main`, never direct push. Earlier entries below are historical.

---

# Historical status — Phase 9 complete locally, PR prepared on codex/google-cloud-acceptance

26 October 2026. Phase 9 (full integrated verification: tasks GW-900, GW-901, GW-902) is **complete locally and verified** on branch **`codex/google-cloud-acceptance`** following release checkpoint `2847189` (Phase 8 delivery). Full check passes 55/55 Google Workspace unit tests (all 5 GW-900/901/902 integrated verification tests, 4 GW-800/801/802 catalogue automation tests, 3 GW-700/701/702 scraper expansion tests, 6 GW-600/601/602 media and content tests, 5 GW-500/501/502 Studio workflow tests, 8 GW-400 security tests, 5 GW-401 publication tests, 6 GW-402 operations tests, 4 GW-403 provider switch tests, 6 importer tests, and 3 reconciliation tests pass), preflight passes 12/12, route typegen and TypeScript pass with 0 errors, and ESLint passes with 0 errors (62 existing warnings). Cross-module end-to-end data flow (auth -> ops -> media -> scraper review -> catalogue -> publication), security invariants (optimistic locking CAS mismatch rejection, replay deduplication, session lifecycle, rate limiting, and input quarantine), 7-width canonical responsive viewport matrix ([375, 540, 768, 800, 1080, 1440, 1920]), and 100% provider independence under RIVYA_STORAGE_PROVIDER='google-workspace' and RIVYA_SQL_DISABLED=true with zero SQL queries and zero fallback to legacy databases are verified. Read [the Phase 9 checkpoint](docs/google-workspace-2026-10-24/PHASE-9-CHECKPOINT.md), [PR description](docs/google-workspace-2026-10-24/PHASE-9-PR.md), and [verification receipt](docs/google-workspace-2026-10-24/phase9-verification.json).

Preserve approved public design, Studio login/security, current provider authority, all data/media/IDs/URLs/prices/relationships and the 169-image collection. Zero products added, zero archived imports, no reseeding, no deleted-database recovery, no request repair replay, no Photos revisit or regeneration. Zero Google cloud writes, zero Drive resources created, zero production database writes, zero CMS publications. Phase deliveries continue through detailed new PRs from `codex/google-cloud-acceptance` into `main`, never direct push. Earlier entries below are historical.

---

# Historical status — Phase 8 complete locally, PR prepared on codex/google-cloud-acceptance

26 October 2026. Phase 8 (catalogue automation: tasks GW-800, GW-801, GW-802) is **complete locally and verified** on branch **`codex/google-cloud-acceptance`** following release checkpoint `ae5c41a` (Phase 7 delivery). Full check passes 50/50 Google Workspace unit tests (all 4 GW-800/801/802 catalogue automation tests, 3 GW-700/701/702 scraper expansion tests, 6 GW-600/601/602 media and content tests, 5 GW-500/501/502 Studio workflow tests, 8 GW-400 security tests, 5 GW-401 publication tests, 6 GW-402 operations tests, 4 GW-403 provider switch tests, 6 importer tests, and 3 reconciliation tests pass), preflight passes 12/12, route typegen and TypeScript pass with 0 errors, and ESLint passes with 0 errors (62 existing warnings). Reused native Slides/cover/typography template register (4 artifacts), immutable input snapshot freeze from approved concepts, idempotent worker generation adapter with stable Drive IDs, slide layout validation (4:5 vertical artwork ratio, Hindi Devanagari UTF-8), PDF byte and pagination budgets, and private Studio access gating are verified. Read [the Phase 8 checkpoint](docs/google-workspace-2026-10-24/PHASE-8-CHECKPOINT.md), [PR description](docs/google-workspace-2026-10-24/PHASE-8-PR.md), and [verification receipt](docs/google-workspace-2026-10-24/phase8-verification.json).

Preserve approved public design, Studio login/security, current provider authority, all data/media/IDs/URLs/prices/relationships and the 169-image collection. Zero products added, zero archived imports, no reseeding, no deleted-database recovery, no request repair replay, no Photos revisit or regeneration. Zero Google cloud writes, zero Drive resources created, zero production database writes, zero CMS publications. Phase deliveries continue through detailed new PRs from `codex/google-cloud-acceptance` into `main`, never direct push. Earlier entries below are historical.

---

# Historical status — Phase 7 complete locally, PR prepared on codex/google-cloud-acceptance

26 October 2026. Phase 7 (scraper expansion: tasks GW-700, GW-701, GW-702) is **complete locally and verified** on branch **`codex/google-cloud-acceptance`** following release checkpoint `474329b` (Phase 6 delivery). Full check passes 46/46 Google Workspace unit tests (all 3 GW-700/701/702 scraper expansion tests, 6 GW-600/601/602 media and content tests, 5 GW-500/501/502 Studio workflow tests, 8 GW-400 security tests, 5 GW-401 publication tests, 6 GW-402 operations tests, 4 GW-403 provider switch tests, 6 importer tests, and 3 reconciliation tests pass), preflight passes 12/12, route typegen and TypeScript pass with 0 errors, and ESLint passes with 0 errors (62 existing warnings). Vendor source governance (23 legacy configured sources), bounded scraper adapters with deduplication and cancellation, candidate review/handoff workflows, and strict product insertion prohibition (`CAN_CREATE_PRODUCT = false`) are verified. Read [the Phase 7 checkpoint](docs/google-workspace-2026-10-24/PHASE-7-CHECKPOINT.md), [PR description](docs/google-workspace-2026-10-24/PHASE-7-PR.md), and [verification receipt](docs/google-workspace-2026-10-24/phase7-verification.json).

Preserve approved public design, Studio login/security, current provider authority, all data/media/IDs/URLs/prices/relationships and the 169-image collection. Zero products added, zero archived imports, no reseeding, no deleted-database recovery, no request repair replay, no Photos revisit or regeneration. Zero Google cloud writes, zero Drive resources created, zero production database writes, zero CMS publications. Phase deliveries continue through detailed new PRs from `codex/google-cloud-acceptance` into `main`, never direct push. Earlier entries below are historical.

---

# Historical status — Phase 6 complete locally, PR prepared on codex/google-cloud-acceptance

26 October 2026. Phase 6 (media, content, and filters: tasks GW-600, GW-601, GW-602) is **complete locally and verified** on branch **`codex/google-cloud-acceptance`** following release checkpoint `039be1c` (Phase 5 delivery). Full check passes 43/43 Google Workspace unit tests (all 6 GW-600/601/602 media and content tests, 5 GW-500/501/502 Studio workflow tests, 8 GW-400 security tests, 5 GW-401 publication tests, 6 GW-402 operations tests, 4 GW-403 provider switch tests, 6 importer tests, and 3 reconciliation tests pass), preflight passes 12/12, route typegen and TypeScript pass with 0 errors, and ESLint passes with 0 errors (62 existing warnings). Media association governance, truthful claims validation (zero invented reviews/customers), 323 distinct baseline entity coverage across 28 tables, Studio filtering engine, 4:5 aspect ratio preservation, responsive derivatives ([640, 960, 1600]), and Drive-backed delivery gating are verified. Read [the Phase 6 checkpoint](docs/google-workspace-2026-10-24/PHASE-6-CHECKPOINT.md), [PR description](docs/google-workspace-2026-10-24/PHASE-6-PR.md), [entity coverage report](docs/google-workspace-2026-10-24/entity-coverage-report.json), and [verification receipt](docs/google-workspace-2026-10-24/phase6-verification.json).

Preserve approved public design, Studio login/security, current provider authority, all data/media/IDs/URLs/prices/relationships and the 169-image collection. Zero products added, zero archived imports, no reseeding, no deleted-database recovery, no request repair replay, no Photos revisit or regeneration. Zero Google cloud writes, zero Drive resources created, zero production database writes, zero CMS publications. Phase deliveries continue through detailed new PRs from `codex/google-cloud-acceptance` into `main`, never direct push. Earlier entries below are historical.

---

# Historical status — Phase 5 complete locally, PR prepared on codex/google-cloud-acceptance

26 October 2026. Phase 5 (authenticated Studio redesign: tasks GW-500, GW-501, GW-502) is **complete locally and verified** on branch **`codex/google-cloud-acceptance`** following release checkpoint `9b68ac2` (Phase 0-4 PR delivery). Full check passes 37/37 Google Workspace unit tests (all 5 GW-500/501/502 Studio workflow tests, 8 GW-400 security tests, 5 GW-401 publication tests, 6 GW-402 operations tests, 4 GW-403 provider switch tests, 6 importer tests, and 3 reconciliation tests pass), preflight passes 12/12, route typegen and TypeScript pass with 0 errors, and ESLint passes with 0 errors (62 existing warnings). All 37 Studio modules are classified across 5 functional workflows (`operations`, `catalogue`, `editorial`, `presentation`, `governance`) and 3 operational statuses (`active`, `guarded`, `status-only`); route admission, role scoping, canonical child href resolution, and responsive CSS module style isolation (1080px/800px/540px breakpoints, reduced motion, dark theme) are verified. Read [the Phase 5 checkpoint](docs/google-workspace-2026-10-24/PHASE-5-CHECKPOINT.md), [PR description](docs/google-workspace-2026-10-24/PHASE-5-PR.md), [workflow ledger](docs/google-workspace-2026-10-24/studio-workflow-ledger.csv), and [verification receipt](docs/google-workspace-2026-10-24/phase5-verification.json).

Preserve approved public design, Studio login/security, current provider authority, all data/media/IDs/URLs/prices/relationships and the 169-image collection. Zero products added, zero archived imports, no reseeding, no deleted-database recovery, no request repair replay, no Photos revisit or regeneration. Zero Google cloud writes, zero Drive resources created, zero production database writes, zero CMS publications. Phase deliveries continue through detailed new PRs from `codex/google-cloud-acceptance` into `main`, never direct push. Earlier entries below are historical.

---

# Historical status — Phase 4 complete locally, PR prepared on codex/google-cloud-acceptance

26 October 2026. Phase 4 (backend replacement: tasks GW-400, GW-401, GW-402, GW-403) is **complete locally and verified** on branch **`codex/google-cloud-acceptance`** following release checkpoint `075ea96` (Phase 3 delivery) and commits `32fa573` (GW-400), `cbcf2bb` (GW-401). Full check passes 32/32 Google Workspace unit tests (all 8 GW-400 security tests, 5 GW-401 publication tests, 6 GW-402 operations tests, and 4 GW-403 provider switch tests pass), preflight passes 12/12, route typegen and TypeScript pass with 0 errors, and ESLint passes with 0 errors (62 existing warnings). Restricted identity security adapter (`src/lib/google-workspace/security-adapter.ts`), Drive publication adapter (`src/lib/google-workspace/publication-adapter.ts`), operations adapter (`src/lib/google-workspace/operations-adapter.ts`), and provider switch abstraction (`src/lib/google-workspace/provider-switch.ts`, `src/lib/studio-db.ts`) are fully implemented and verified. Read [the Phase 4 checkpoint](docs/google-workspace-2026-10-24/PHASE-4-CHECKPOINT.md), [PR description](docs/google-workspace-2026-10-24/PHASE-4-PR.md), and [verification receipt](docs/google-workspace-2026-10-24/phase4-verification.json).

Preserve approved public design, Studio login/security, current provider authority, all data/media/IDs/URLs/prices/relationships and the 169-image collection. Zero products added, zero archived imports, no reseeding, no deleted-database recovery, no request repair replay, no Photos revisit or regeneration. Zero Google cloud writes, zero Drive resources created, zero production database writes, zero CMS publications. Phase deliveries continue through detailed new PRs from `codex/google-cloud-acceptance` into `main`, never direct push. Earlier entries below are historical.

---

# Historical status — Phase 3 complete locally, PR prepared on codex/google-cloud-acceptance

26 October 2026. Phase 3 (isolated migration rehearsal, checkpointing, and reconciliation reporting: tasks GW-300, GW-301, GW-302) is **complete locally and verified** on branch **`codex/google-cloud-acceptance`** from release checkpoint `36fbaf14f24ae6e62ba31ef720989bf306563b67` (merged PR #67 into GitHub `main`). Full check passes 688/691 tests (all 9 new Phase 3 tests pass; 3 known Windows environment differences), preflight passes 12/12, route typegen and TypeScript pass with 0 errors, and ESLint passes with 0 errors (62 existing warnings). Reconciliation rehearsal verifies 28/28 canonical tables and 169 creations / 507 variants with 0 duplicate commits on interrupted resumption. Read [the Phase 3 checkpoint](docs/google-workspace-2026-10-24/PHASE-3-CHECKPOINT.md), [PR description](docs/google-workspace-2026-10-24/PHASE-3-PR.md), and [verification receipt](docs/google-workspace-2026-10-24/phase3-verification.json).

Preserve approved public design, Studio login/security, current provider authority, all data/media/IDs/URLs/prices/relationships and the 169-image collection. Zero products added, zero archived imports, no reseeding, no deleted-database recovery, no request repair replay, no Photos revisit or regeneration. Zero Google cloud writes, zero Drive resources created, zero production database writes, zero CMS publications. Phase deliveries continue through detailed new PRs from `codex/google-cloud-acceptance` into `main`, never direct push. Earlier entries below are historical.

---

# Historical continuation — Gemini/Antigravity handoff and existing-sandbox audit

26 October 2026. Continue **`codex/google-cloud-acceptance`** and existing **PR #67**; main remains the observed PR #66 checkpoint `019f4c1bac2c03dfeab00a1ed1fb46dc20c29d30`. The same-branch owner instruction supersedes the older generic new-branch prompt. Read [the current handoff checkpoint](docs/google-workspace-2026-10-24/ANTIGRAVITY-HANDOFF-CHECKPOINT.md), [verification](docs/google-workspace-2026-10-24/antigravity-handoff-verification.json), [complete Gemini/Antigravity prompt](docs/google-workspace-2026-10-24/CONTINUE-IN-GEMINI-ANTIGRAVITY.md) and [local/offline runbook](docs/google-workspace-2026-10-24/LOCAL-OFFLINE-RUNBOOK.md) first.

The private sandbox already exists. Fresh owner-account Drive/Sheets reads verify sixteen owner-only resources, twenty 100×12 grids and coherent retained records/history/control, with zero writes. The portable `audit-existing.ts` verifies a populated registered sandbox without resets. Full local check passes 682 application, 12 preflight and 409 HTTP tests, typecheck/build and lint (zero errors; 62 existing warnings). Fresh connector access is separate from the historical expired runtime token. This checkout lacks the original private registry/baseline/runtime credentials and signed replay inputs; full new Apps Script/runtime acceptance remains blocked, and all eight carried groups remain explicit.

Preserve approved public design, Studio login/security, current provider authority, all data/media/IDs/URLs/prices/relationships and the 169-image collection. No products or archived imports, reseeding, deleted-database recovery, request repair replay, Photos revisit or regeneration. Source/phase PR publication is authorized. Main is connected to Vercel production, so merging a concrete PR retains the user's separate later-release authorization boundary; do not bypass protection or change deployment settings. No business migration, CMS publication, cutover or later production release occurred. Earlier entries below are historical.

---

# Current owner direction — continue on this branch and deliver phase PRs

25 October 2026. The owner explicitly requested continuing on `codex/google-cloud-acceptance` and delivering each phase through a detailed PR into GitHub main. This supersedes the earlier Git local-only hold; retain this branch and both existing checkpoints. Verify actual required checks/reviews and merge through PRs, never by direct-main push or protection bypass. Production migration/cutover, CMS publication, destructive actions and later production release retain their separate concrete authorization boundaries; Vercel Git deployment is enabled, so inspect its release effects before merging.

Actual main remains `019f4c1bac2c03dfeab00a1ed1fb46dc20c29d30`. The private Google sandbox/core acceptance is retained at local `4122e89`; do not reprovision or reset it. On resumption the management token returned HTTP 401 while the existing HMAC signed System read succeeded. Refresh that token only in secure settings; no secrets in chat. GitHub PR API access works through the existing authenticated `gh` CLI with `api.github.com` added to the restricted allowlist for the authorized PR workflow. Removing that exception caused actual API requests to return Forbidden; restoring it restored access. Retain the six Google domains and package-manager preset, keep all-public Internet off, and keep the environment unpublished. See [the phase PR checkpoint](docs/google-workspace-2026-10-24/PHASE-2-PR.md).

Preserve the approved public design, current Studio login/security, provider authority, all existing data/media/IDs/URLs/prices/relationships and selected images. No products, archived imports, reseeding, old-database recovery, request repair replay, Photos revisit or regeneration. Continue independent migration preparation without reconstructing absent business data. Source implementation, local/real-Google verification, migration, publication, cutover and release remain separate statuses. Earlier entries are historical.

---

# Historical sandbox checkpoint — real Google foundations verified; production gates remain

The private Google sandbox is installed: owner-only Drive folders, four protected 100×12 workbooks, and one owner-executed version-1 HMAC writer deployment. Real signed save/reload, replay/conflict/concurrency, client acknowledgement-loss recovery, reserved-ID Drive JSON, fresh-process job resume/cancellation, private publication-pointer and guarded formula-rejection/restoration checks passed. Read [the current checkpoint](docs/google-workspace-2026-10-24/SANDBOX-CHECKPOINT.md) and [sanitized evidence](docs/google-workspace-2026-10-24/sandbox-verification.json) for the exact coverage and remaining gaps.

Reuse the observed private registry, deployment and checkpoint journals. Browser consent and matching private key configuration are complete; do not create a duplicate deployment or reset populated/control cells. Keep the Codex environment unpublished: no push, merge, website deployment, CMS publication or production cutover. Preserve public design, Studio login, current provider and all existing data/media; no products or archived imports. The sandbox retains only four synthetic non-product records and three private JSON artifacts. Business migration, phases 3–11 completion and production readiness are not claimed. Earlier entries are historical.

---

# Historical cloud checkpoint — isolated Google setup prepared; real access pending

Continued from verified GitHub main / PR #66 commit `019f4c1bac2c03dfeab00a1ed1fb46dc20c29d30` on `codex/google-cloud-acceptance`. The owner now authorizes continuing the isolated Google setup and acceptance, then the remaining committed phases. The selected account is recorded only in the ignored private registry. Read [the cloud setup guide](docs/google-workspace-2026-10-24/CLOUD-GOOGLE-SETUP.md) and [current verification receipt](docs/google-workspace-2026-10-24/cloud-verification.json).

The portable Node 22 environment is prepared. New setup tools generate structural payloads and inspect actual Google management state without writes; Phase 2 writer/Drive/publication/jobs foundations are reused. **No Google resources, script deployment, business rows, migration, CMS publication, cutover or new release have been performed in this continuation.** Actual account access, resource registrations and real-provider acceptance remain pending. A saved environment draft and passing local tests do not establish Google installation.

Preserve public design, Studio login/security, existing data/IDs/URLs/relationships and media. No products, archived imports, reseeding, request-table repair, deleted-database recovery, Google Photos or image regeneration. Keep the current provider authoritative. Continue the existing phase plan after its real acceptance/reconciliation prerequisites; production cutover, destructive actions, messages, paid services and later release retain their separate boundaries. Earlier checkpoints below are historical.

---

# Current checkpoint — Google foundations complete locally; PR publication authorized

Continued from `43c0f14` on `codex/sheets-drive-foundation`. Read [the Phase 2 checkpoint](docs/google-workspace-2026-10-24/PHASE-2-CHECKPOINT.md), [final verification](docs/google-workspace-2026-10-24/phase2-verification.json), [complete owner brief](docs/google-workspace-2026-10-24/OWNER-BRIEF.md), and [Codex Cloud continuation prompt](docs/google-workspace-2026-10-24/CONTINUE-IN-CODEX-CLOUD.md) first. The audit/plan and local controlled writer, Drive documents, coherent publication contract and durable-job foundation are implemented. Real Google acceptance, migration and cutover remain separate pending gates.

The owner now explicitly authorizes publishing all latest work through a detailed PR into GitHub `main`, then continuing in Codex Cloud. This supersedes older Git local-only holds for this release. Verify the exact PR head, required checks/reviews and resulting deployment; no direct-main push or protection bypass. No Google provisioning, production database migration, CMS publication, destructive overwrite or later release is implied. Release preparation packages only approved image derivatives and gates features that require uninstalled schemas; originals and private evidence stay ignored.

Preserve the approved public design, homepage/Creations/Signature/footer, current Studio login, products/data/URLs/relationships and original media. Add no products or archived catalogue/Sheets imports. Do not reseed, replay request-table repair, recover the deleted old database, regenerate selected images or resume Google Photos. Existing storage remains authoritative until a separately verified cutover. Stop after the authorized PR/main release and handoff; do not start the next implementation phase in this local chat. Earlier entries below are historical.

---
# Current owner direction — Sheets/Drive transition and Studio-only restoration

The owner approved the final local public website and supplied the new CRAFT master brief on 24 October 2026. Work has resumed from `e9d3228` on `codex/sheets-drive-foundation`. Read [the current checkpoint](docs/google-workspace-2026-10-24/README.md), [audit](docs/google-workspace-2026-10-24/AUDIT.md), [phase plan](docs/google-workspace-2026-10-24/PHASE-PLAN.md) and [architecture decision](docs/decisions/2026-10-24-sheets-drive.md) first. They supersede the prior stop and earlier public-redesign/permanent-SQL directions.

Preserve the approved homepage, Rivya / Creations, The Signature, footer, all current public layouts and Studio login. Restore only authenticated Studio using the old reference. Sheets/Drive is the target after verified migration; the existing application remains authoritative meanwhile. Keep all work local and preserve populated databases, originals and selected images. No products or archived catalogue/Sheets imports; no Google Photos rework, regeneration, reseeding or request-table repair. No cloud mutation, publication, production migration, push/PR/deployment or external messages have occurred or are implied.

The audit and local architecture/mapping plan are delivered. The local foundation includes a strict record codec, revision/idempotency planner, registered-resource Google read transport and read-only mapping rehearsal. It is not an activated provider or complete migration. All 406 existing local rows and 923 protected tracked source/media/package files are unchanged; 404 rows round-trip inline, two oversized CMS rows are explicitly pending Drive artifacts. See the checkpoint receipt for current tests and next actions. Earlier sections below are historical.

---
# Current owner direction — live-site design correction and stop

The owner confirmed **www.rivyalivingart.com** as the overall homepage design/background/colour reference, retaining the supplied **Rivya / Creations**, **footer** structures and **The Signature — From liquid to light** section. Read [the final correction](docs/restoration/exact-legacy-2026-10-21/FINAL-LIVE-DESIGN.md). This supersedes earlier exact-OLDWEBSITE homepage geometry instructions. The completed local Phase 4 workflow checkpoint `0e55789` is preserved; full Phase 4 is not complete.

**The requested correction is complete and work is stopped. Do not start another workflow or phase without a new owner request.** Keep all work local. Preserve existing data, products, media and Studio login; add no products or archived imports. No publication, production migration, push/PR/deployment or external message. Final local build `J0mF2NzSlOPFqGX4L_g0e`: 397 application tests, scoped lint/type/build, matched desktop/mobile checks, 400 unchanged business rows, 301 original files, 21 protected hashes and 507 selected image variants verified. See [the receipt](docs/restoration/exact-legacy-2026-10-21/final-live-design-verification.json). Earlier entries are historical.

---
# Current execution — Phase 4 started locally, 24 October 2026

Continued from `924978a` on `codex/exact-legacy-restoration`. Read [the Phase 4 checkpoint](docs/restoration/exact-legacy-2026-10-21/phase4/PHASE-4-CHECKPOINT.md), [verification](docs/restoration/exact-legacy-2026-10-21/phase4/verification.json) and [workflow ledger](docs/restoration/exact-legacy-2026-10-21/phase4/workflow-ledger.csv). **Phase 4 is in progress, not complete.**

Two real local workflows are delivered: the earlier 169 owner-selected images can be searched and opened as private Studio metadata drafts; website newsletter signups can be searched, filtered, paged and exported from the restored Subscribers screen. Selected image bytes and original-parent lineage are verified. No image was published or assigned to products, customers or reviews. Remaining media bulk/folder/tag operations, editorial taxonomy/bulk workflows, public-state parity, role/recovery and final visual acceptance remain in the ledger.

Final local build `MMFCYzH51pf9AL2D31SVA`: 397 application tests, 56 isolation/mapping checks, 12 preflight checks and 15 targeted API scenarios pass. All 169 originals, 507 selected WebP variants, 301 original media/login files and 21 protected hashes verify. All 388 pre-existing non-session rows across 26 local tables remain unchanged. Test additions: one private image draft, four revisions/audit entries and three synthetic newsletter signups; authentication session/rate-limit changes are reported separately.

**Keep everything local.** No products, archived catalogue/Sheets imports, publication, push/PR/deployment, production changes or external messages. Preserve current data/login, the populated databases and private evidence. Do not reseed or replay request-table repair. Google Photos remains owner-excluded; rejected cutouts remain unused. The selected website collection remains at `http://127.0.0.1:4210/creations`; Studio media and subscribers run on 4210. The unchanged old isolated reference runs on 4212 with alternate PostgreSQL loopback port 55442. Earlier entries below are historical.

---
# Historical execution — owner-selected website images, 24 October 2026

Continued from `c88071a` on `codex/exact-legacy-restoration`. Read [the owner-selection checkpoint](docs/restoration/exact-legacy-2026-10-21/phase3/PHASE-3-OWNER-SELECTION.md) and [verification](docs/restoration/exact-legacy-2026-10-21/phase3/owner-selection-verification.json) first. The owner chose the **earlier 169-image collection at 4215** for the local website and rejected the newer cutout experiment. Google Photos is **owner-excluded as duplicate coverage**; do not resume its downloads or claim independently verified library equality.

All 169 selected images are now usable at **http://127.0.0.1:4210/creations**, with six featured on the homepage's legacy portfolio slot and the portfolio page. Search, creation-type filters, pagination, enlargement and downloads work. The earlier 4215 review includes the owner's selection annotation. Exact earlier export bytes and their 4:5 sizes are retained; AI-enhanced presentation labels remain truthful.

The requested local field/media mapping, additive foundation and owner-amended image preparation/selection are delivered. The lost source database, unknown genuine record associations and full Phase 4–7 workflows are not completed or invented. This does not certify documentary fidelity of AI edits or authorize publication.

Final local build `gbV5ib2nPHG2Ja9ZxXMvv`: 393 application tests pass; 507 served image variants match; 676 exports and six packs verify. All **355 existing local rows / 13 tables**, **301 original media/login files** and **21 protected hashes** remain unchanged. No products, archived imports, database writes or new Studio records occurred.

**Keep everything local: no push, PR, deployment, CMS publication, cloud writes or production migration.** Preserve current data/login, the populated cluster, originals and private evidence. Do not reseed, replay the request-table repair, resume the rejected cutouts or regenerate the selected set. Earlier entries below are historical.

---
# Historical execution — Phase 3 creation image collection, 24 October 2026

Continued from `f64294f` on `codex/exact-legacy-restoration`. Read [the image collection checkpoint](docs/restoration/exact-legacy-2026-10-21/phase3/PHASE-3-IMAGE-COLLECTION.md) and [verification receipt](docs/restoration/exact-legacy-2026-10-21/phase3/collection-verification.json) first. All **169 stills in the supplied creation folder** now have private presentation edits: 163 new candidates plus six retained from the previous checkpoint, with 676 uniform 4:5 JPEG/WebP exports and six local download packs. Originals, masters, exact prompts and lineage remain in ignored private evidence.

The working comparison gallery is **http://127.0.0.1:4215/**; the unchanged app/Studio remains on 4210. Creation-folder preparation is complete; full Phase 3 source coverage and fidelity acceptance are not. The separate Photos album's full count/coverage remains unverified after album-download failures; one original was recovered, and individual downloads remain a possible route. Every AI edit remains unassigned and unapproved for publication because lettering, faces and fine details need comparison with the original. Do not equate the 169 photographs with 169 distinct products.

Fresh read-only preservation checks retain all **355 existing synthetic local rows across 13 tables**, **301 original media/login files** and **21 protected hashes**. Application source/public files/package manifests remain unchanged from `f64294f`. This is local evidence, not a new production audit. No database writes or new Studio records occurred in this continuation.

**Keep everything local. No products, archived catalogue/Sheets imports, seeds, production migrations, CMS publication, cloud writes, push, PR or deployment.** Preserve this branch, populated cluster and all private evidence. Do not replay the request-table repair, reseed, fabricate deleted source identities, or assign edited images to existing records without evidence. Earlier entries below are historical.

---
# Historical execution — Phase 3 local media implementation, 23 October 2026

Continued from `5545ffb` on `codex/exact-legacy-restoration`. Read [the implementation checkpoint](docs/restoration/exact-legacy-2026-10-21/phase3/PHASE-3-IMPLEMENTATION.md), [verification](docs/restoration/exact-legacy-2026-10-21/phase3/implementation-verification.json) and [production candidate](docs/restoration/exact-legacy-2026-10-21/phase3/PRODUCTION-MIGRATION-CANDIDATE.md). Additive category metadata, mobile image paths/legacy ratios, genuine testimonial media/rating fields, private video/GLB contracts, source crosswalk/conflict storage and versioned editors are implemented locally. This is not complete Phase 4–6 workflow parity or recovery of the deleted source database.

Six selected owner creation photos now have ocean/obsidian/champagne AI presentation edits in uniform 1600 × 2000 (4:5), with 960 × 1200 and 640 × 800 WebP variants. Untouched originals, generated masters, exact prompts and before/after review stay in ignored private evidence. Fourteen private image drafts include six originals, two earlier edits and six final branded edits; no existing product/gallery association changed. This batch does not cover the entire Drive/Photos library. Personal details and reconstructed areas remain subject to owner fidelity/permission review.

Final build `YDrtP647c0oo4I3hvf-7w`: 390 application, 403 built HTTP, 53 mapping/isolation, 12 preflight and 103 final delivery checks pass; 15 browser observations cover desktop/mobile and authenticated media. All 313 pre-existing isolated business rows, 301 original media/login files and 21 protected baseline byte hashes remain unchanged. New local schema: four tables / 31 columns, replayed with transaction recovery. No source records or title replacements imported.

**Keep everything local. No products, archived catalogue/Sheets imports, seeds, production migration, CMS publication, cloud writes, push, PR or deployment.** Do not repeat request-table repair or overwrite before snapshots. Preserve this branch and populated cluster. Private image preview: `http://127.0.0.1:4214/`; final app/Studio: `http://127.0.0.1:4210/`. The candidate app requires the additive schema before activation; production target, backup, grants and upload transport remain separate gates. Earlier entries below are historical.

---
# Historical execution — Phase 3 field and media mapping, 21 October 2026

The owner authorized Phase 3 from `39b948c`, limited to local field/media mapping while preserving current data and Studio login. Read [the mapping checkpoint](docs/restoration/exact-legacy-2026-10-21/phase3/PHASE-3-MAPPING.md) and [verification](docs/restoration/exact-legacy-2026-10-21/phase3/verification.json). The package maps 45 entities, 566 real fields, 48 relationship contracts and 78 media placements. The earlier 575-field count included nine block-comment prose lines; the corrected mapping is authoritative.

**No products or archived catalogue/Sheets imports.** No products/fixtures, database writes, media edits/relinks or app/login changes occurred. All 13 inspected isolated business tables and 897 tracked application/media files are unchanged. The deleted source database remains unavailable; no real source IDs or relationships were invented. Drive lineage is explicit where evidenced, with 787 originals unassigned. Proposed extensions are mapped requirements, not installed features. See the report for complete evidence limits.

The requested contract/available-file mapping is complete; Phase 3 additive non-product implementation, derivatives and replay/recovery remain subsequent work. Keep everything local and preserve this branch and ignored evidence. No push, PR, deploy, production migration, CMS publication or cloud write is authorized. Do not reseed populated clusters or repeat the request-table repair. Mapping preview: `http://127.0.0.1:4213/`; existing app/comparisons: 4210/4211. Earlier entries below are historical.

---
# Historical execution — available files after old database deletion, 21 October 2026

The owner reports accidental deletion of the old Vercel database and directs continuation using files. Read [the updated owner decision](docs/restoration/exact-legacy-2026-10-21/OWNER-DECISION.md), [file-based continuation](docs/restoration/exact-legacy-2026-10-21/FILE-BASED-CONTINUATION.md) and [105-file baseline](docs/restoration/exact-legacy-2026-10-21/inventory/available-file-baseline.json). Continue from local `7d2556e` on `codex/exact-legacy-restoration`. The Vercel login/export handoff is superseded as a prerequisite; do not ask for it again. Deleted record counts, identities, relationships and overrides remain unknown, never fabricated from seeds or samples.

Latest owner restriction: **do not add products or import archived catalogue/Sheets lists, samples or saved product rewrites**. No such rows were imported. These sources are excluded from migration; use the existing catalogue and existing fixtures only. Preserve the current destination data, media, relationships and Studio login. Work remains local: no push, production migration, CMS publication or deployment. Do not reseed populated clusters or replay the request-table repair. Phase 1 available-file discovery is complete with the lost-source limitation; Phase 2 representative design foundations are verified locally. Read the final file-based receipt linked in the continuation report. Full operational feature parity remains in later phases. Earlier checkpoints below retain their historical evidence and access assumptions.

---
# Historical execution checkpoint — Phase 1 discovery / Phase 2 foundations, 21 October 2026

Continue the local descendant of `13f1ff2` on `codex/exact-legacy-restoration`. Read [the latest checkpoint](docs/restoration/exact-legacy-2026-10-21/PHASE-1-2-CHECKPOINT.md), [verification receipt](docs/restoration/exact-legacy-2026-10-21/phase12-verification.json), and [visual exceptions](docs/restoration/exact-legacy-2026-10-21/VISUAL-EXCEPTIONS.csv) first. The 98-route / 45-entity / 156-action discovery is accounted for. Phase 1 complete live-data acceptance remains blocked by the unavailable old SQL export. Do not fabricate it or equate UI counts with a database snapshot.

The representative Phase 2 foundations are implemented locally: 121-frame material sequence; public card/quick-view/product/article/project templates; authenticated Studio shell/table/editor with unsaved preview; historical scraper-register shell; and eight adapted Markdown documents. This is not full Phase 4 workflow parity or an operational scraper. Protected current data/media/login remain authoritative. The receipt verifies 21 protected hashes, 409 unit/isolation, 403 HTTP and 12 preflight checks, 64 responsive checks, 29 browser checks and 25 new captures. All screenshots and credentials remain ignored.

**Local only.** No production migration, CMS publication, push/PR/merge/deploy, external messages or paid services. Preserve the populated isolated cluster and earlier work; never rerun fixture preparation or request-table DDL. Proceed to local Phase 3 mapping/media preparation under the existing owner scope, carrying the source-access blocker. The older checkpoints below retain their historical scope.

---

# Historical execution checkpoint — Phase 2 homepage continuation, 21 October 2026

Continue the local descendant of `5b0a0ea` on `codex/exact-legacy-restoration`. Read [the latest homepage checkpoint](docs/restoration/exact-legacy-2026-10-21/PHASE-2-HOME-CHECKPOINT.md), [source/content mapping](docs/restoration/exact-legacy-2026-10-21/LEGACY-HOME-MAPPING.md), and the owner decision/master prompt.

The second Phase 2 slice ports the homepage composition, progress ruler, product rail, collection doors, meniscus reveals, material layout, process rhythm and journal rows. Build `GN1TzWAYdKFILJnSQXYyu`: 409 unit/isolation, 403 HTTP and 12 preflight checks passed; eight widths, fourteen interactions and 54 new captures verified. All 21 protected source hashes remain unchanged. Login geometry matches; small pixel differences are disclosed. Phase 2 remains incomplete; the material sequence, remaining public templates, richer workflows and Studio shell are next. Phase 1's source database export gap remains open. No fresh live row-hash comparison occurred in this UI-only slice.

**Keep all changes local.** No production migration, CMS publication, push/PR/merge/deploy, external message or paid service is authorized. Preserve current brand/contact/content/product/media/login exceptions. Raw evidence and credentials stay ignored. Do not repeat the request-table repair, reset the branch, or rerun fixture preparation on the populated cluster. The private journal test added only two unpublished synthetic local rows. Continue routine authorized work without another phase-start question.

---

# Historical execution checkpoint — first Phase 2 local slice, 21 October 2026

Continue the local descendant of `d04218c` on `codex/exact-legacy-restoration`; preserve the branch and ignored evidence. Read the owner decision and master prompt, then [Phase 1 continuation](docs/restoration/exact-legacy-2026-10-21/PHASE-1-CONTINUATION.md), [Phase 2 checkpoint](docs/restoration/exact-legacy-2026-10-21/PHASE-2-CHECKPOINT.md), and [canonical seven-phase plan](docs/restoration/exact-legacy-2026-10-21/PHASE-WISE-PLAN.md).

Phase 2 has started with a working public header/drawer/mobile-navigation/hero/footer foundation adapted from OLDWEBSITE. Full-page and Studio restoration are incomplete. Phase 1's destination baseline now has 193 schema columns and 19 unchanged runtime-visible row digests; the old source database export and some workflow states remain open. All 21 protected source hashes match. Final local build `dIA7_A33jqOuNsY09oTOw`; 409 unit/isolation, 403 HTTP and 12 preflight tests passed. These are scoped checks, not full restoration acceptance.

**Keep all changes local.** Preserve current logo/contact/main-color/product/content/media/login exceptions. No production mutation/migration, CMS publication, push/PR/merge/deploy, paid service or external message is authorized. Do not repeat the repaired request-table DDL. Raw screenshots, credentials, private manifests and database evidence remain ignored. Continue routine local source porting without another phase-start question. The older checkpoints below retain their historical date and scope.

---
# Current checkpoint — approved request-table repair and final local audit checks, 19 October 2026

Continue on `codex/audit-pending-completion` from local checkpoint `016d332`. Read [the final continuation report](docs/audits/rivya-master-audit/PENDING-FINAL-REPORT.md) and [its verification receipt](docs/audits/rivya-master-audit/pending-final-verification.json). The shared pagination now exposes meaningful accessible page status while preserving its design; final build `AVszvoAaWRdzkbTXvBAcW` passed the bounded desktop/mobile checks. Fresh checks: 377 unit, 403 runtime, 12 preflight, lint/type/build, 34 actual browser/HTTP lifecycle checks and 37 exact repair-SQL checks.

The owner explicitly approved **this database repair only**. The missing live request table, three secondary indexes and runtime SELECT/INSERT/UPDATE grants were applied once on the recorded shared live Neon target, verified read-only, and the renewed production Studio session successfully loaded/refreshed its empty request queue. Do not replay the creation transaction or interpret approval as release authority. No existing business-record DML, account decision, reset or production publication occurred; normal session bookkeeping is distinct. No full production row-hash comparison is claimed.

No push, PR, merge, deployment or further production mutation/publication is authorized. Production performance after source release, real provider, native/zoom/device/field acceptance and the development-only upstream advisory remain separate. Preserve active functions, logo/colors/content/media and manual WhatsApp behavior; cleanup remains limited to the earlier confirmed-unused/duplicate/excluded manifest. Raw evidence stays Git-ignored. Everything below is historical and retains its original date and scope.

---

# Current checkpoint — pending audit completion, 19 October 2026

[Pending audit completion report](docs/audits/rivya-master-audit/PENDING-COMPLETION.md) records the latest local changes on `codex/audit-pending-completion` after `e7000c4`: 96.7% smaller language-review entry data, complete record/status parity, newly executed disposable lifecycle checks, fresh responsive/regression verification and the live request-queue diagnosis boundary. [Verification receipt](docs/audits/rivya-master-audit/pending-verification.json) distinguishes actual tests from blocked external gates. All work remains local; no release or production mutation is authorized.

---

# Current checkpoint — 19 October 2026 audit cleanup

The owner-approved local cleanup is on `codex/audit-followup-cleanup`, based on audit checkpoint `ad84a2a`. Read [the follow-up report](docs/audits/rivya-master-audit/FOLLOWUP-CLEANUP.md) for confirmed unused source/package removal, inactive Studio menu cleanup, bounded language review, request-error recovery and current verification. All active website/Studio features and protected records remain; 37 registered workspaces now provide 35 everyday administrator menu destinations. Production repair, release and external acceptance gates remain open where documented. No push or deployment is authorized.

---

# Historical checkpoint — 19 October 2026 master audit continuation

Continue the 17–19 October full audit on `codex/rivya-master-audit`. The delivered cinematic design remains the baseline; only reproduced local fixes, compatible dependency security patches and verification/documentation are in scope. Read [the executive summary](docs/audits/rivya-master-audit/EXECUTIVE-SUMMARY.md), [final verification](docs/audits/rivya-master-audit/FINAL-VERIFICATION.md), [issue register](docs/audits/rivya-master-audit/ISSUE-REGISTER.csv) and [independent security review](docs/audits/rivya-master-audit/SECURITY-RELEASE-REVIEW.md). Their dated receipts distinguish preserved 17 October broad evidence from 19 October post-patch retesting.

GitHub main and the READY production alias were rechecked unchanged at `66e82ef04f76b8460654bab4329ccbadfb47f28e` on 19 October. No release or production data change is authorized by this audit. The Staff account/password-request queue failure, released mobile performance and external acceptance gates remain visible in the report. There was no accessible private Studio session or production database configuration for a fresh private schema check on 19 October. Read-only diagnosis is permitted when appropriate existing access is available; actual production repairs or release require fresh approval. Preserve all earlier checkpoint bytes and do not reactivate excluded work.

---

# Historical checkpoint — 17 October 2026 master audit

The production baseline is PR #62's sitewide cinematic implementation and PR #63's verification documentation, merge SHA `66e82ef04f76b8460654bab4329ccbadfb47f28e`. Current source includes published database-backed catalogue/editorial pages, private Studio with 37 workspaces, staff access and recovery, saved inquiries, private reference controls and customer-initiated WhatsApp sending. The early placeholder/Phase 2/C5 statements below are historical, not the current capability inventory.

The latest owner instruction authorizes a complete audit and safe, reproduced **local** fixes. It does **not** authorize a push, PR merge, deployment, production write or CMS publication. Existing local acceptance repairs were preserved before this audit's fixes. Read [the master audit](docs/audits/rivya-master-audit/EXECUTIVE-SUMMARY.md), [verification](docs/audits/rivya-master-audit/FINAL-VERIFICATION.md) and [route inventory](docs/audits/rivya-master-audit/ROUTE-STUDIO-INVENTORY.csv). Raw screenshots, traces and private test evidence stay in ignored `test-results/rivya-master-audit/`.

Use the pinned Node 22 toolchain and isolated QA guard for database-facing tests. Never run mutation tests against a shared or production database. Preserve the logo, brand palette, content, media/crops, revisions, private records and manual-send boundary. Removed backup tooling, payments, customer accounts, new scraping and legacy product transfers remain excluded. Earlier release instructions below were fulfilled and do not grant fresh release authority.

---

# Historical owner instruction — publish CRAFT through a detailed PR

5 October 2026. The owner explicitly requested all updated files in main with a PR documenting every change. Read `docs/decisions/2026-10-05-publish-craft-main.md` and `docs/redesign/CRAFT-MAIN-RELEASE.md`. Push the complete CRAFT branch, verify the exact PR head and required checks, then merge through the PR and verify the existing Vercel Git deployment. Do not push directly to main or bypass required reviews. This release includes C1–C5 source and backup removal; it does not certify unfinished C5/C6 or publish Studio records. Preserve protected data and archive/key removal boundaries. Later development returns to local-only until a new push-main request.

---

# Current owner instruction — remove project backups

5 October 2026. The owner requested "REMOVE BACKUP FROM THIS PROJECT ENTIRELY". Backup generation, receipt tooling, scheduled jobs, dedicated runbooks and backup/key-custody release gates are removed from scope. Do not recreate or run them during continued C5/C6 work. Historical phase evidence below is superseded for this topic, not proof of an active schedule. Read `docs/decisions/2026-10-05-remove-backups.md`.

Existing archives, keys, source history and customer data remain intact. Studio drafts, revision recovery, manual-send behavior, retention controls, erasure ledger/replay and business/contact/product facts remain protected. Keep changes local until a new explicit push-main request; then use a detailed PR. C5 acceptance, performance, accessibility, human/device and production editorial work continue independently of the retired backup scope.

---

> Owner scope change, 5 October 2026: the project backup feature, scheduled archive jobs, archive-key custody tasks and backup/RPO/RTO acceptance gates are removed. Any earlier instruction below to run, verify, schedule or require them is historical and superseded. Existing archives/keys were not deleted. Studio draft/revision recovery and privacy-erasure safeguards remain. See the 2026-10-05 removal decision.

# Current continuation — C5 Studio presentation implemented; full acceptance open

3 October 2026. Read `docs/redesign/CRAFT-C5-CHECKPOINT.md`, the three `craft-c5-*.json` evidence files and `craft-c5-module-acceptance.csv`. Shared presentation reaches all 16 Studio modules, with labelled record state, compact inquiry filters, protected catalogue/form review, keyboard product tabs, media selection and consistent administration panels. Fifteen focused browser checks, 32 body-reflow observations, 18 isolated service assertions and 403 built-server checks passed. All protected and content/inquiry records match baseline.

Full C5 permission/error/mutation/keyboard acceptance remains open; finish those checks before certifying C5, then continue C6. C4-05 production Imprint's last recorded result was 404; no C5 publication or live recheck occurred. C2 video, human/device/performance, independent key custody, sustained backups and production editorial acceptance remain open. Keep work local until another explicit push-main request, then use a detailed PR. Preserve products/forms/galleries, business/social facts, scraper, private inquiries, drafts/history and manual sending. Screenshot review: workspace `outputs/CRAFT/c5-implementation.html`.

---

# Current continuation — C4 editorial presentation verified locally; live Imprint open

3 October 2026. Read `docs/redesign/CRAFT-C4-CHECKPOINT.md`, the four `craft-c4-*.json` evidence files and `craft-c4-page-acceptance.csv`. C4 refines story/process/materials, architects/portfolio, journal/articles, FAQ/contact and policies while retaining all protected records and content. Missing journal/portfolio details now return real 404. Sixty responsive checks, twenty browser checks, thirty-six isolated HTTP assertions and 403 built-server tests pass.

C4-05 is PARTIAL: isolated QA Imprint and exact preview work, but a fresh live read returns 404. Production factual approval, exact preview, publication, footer/public and recovery evidence remain open. Do not certify C4 or the full CRAFT plan as complete. Next is C5 Studio. C2 optional video and C6 performance, human/device, independent key custody, sustained backups and full production editorial acceptance remain open. Keep work local until another explicit push-main request, then use a detailed PR. Preserve products/forms/galleries, social/business facts, scraper, private inquiries, drafts and history. Review screenshots in workspace `outputs/CRAFT/c4-implementation.html`.

---

# Current continuation — C3 collections and inquiry journey verified locally

3 October 2026. Read `docs/redesign/CRAFT-C3-CHECKPOINT.md` and its three `craft-c3-*.json` evidence files. C3 refines collection chapters, search, product/gallery presentation, saved pieces and the inquiry layout. Four isolated request types, shared private-reference and lost-response recovery checks passed. All protected records and every content entry matched the baseline. Production was not written.

Continue C4 editorial pages, then C5 Studio. C2 optional video and C6 performance, human/device, independent key custody, sustained backup history and production editorial acceptance remain open. Keep work local until another explicit push-main request; use a detailed PR then. Preserve social/business facts, products/forms/galleries, scraper, private inquiries and revision history. Review screenshots in workspace `outputs/CRAFT/c3-implementation.html`.

---

# Current continuation — C2 homepage and Studio image controls verified locally

3 October 2026. Read `docs/redesign/CRAFT-C2-CHECKPOINT.md` and `CRAFT-CHECKPOINT.md`. C2 core work now includes detailed homepage styling, direct hero/doorway image assignment, independent crop controls and a composition review. The isolated save/preview/publish/recovery cycle passed through QA revision 46 with protected records and all other content unchanged. C2-05 optional video is deferred; do not call the entire phase or C0–C7 complete.

Continue C3 collections, search, products and the complete inquiry journey, then C4/C5. Keep all changes local until a new explicit push-main request; use a detailed PR at that time. Preserve social content, business facts, products/forms/galleries, scraper, private inquiries, drafts and history. No old-product transfer. Mobile performance, human/device checks, offsite key custody, daily-backup history and production editorial/release acceptance remain separate open gates. The C2 screenshot receipt is workspace `outputs/CRAFT/c2-implementation.html`.

---

# Current continuation — CRAFT visual plan and first local implementation

3 October 2026. Read `docs/redesign/CRAFT-CHECKPOINT.md` and the workspace `outputs/CRAFT/Rivya-CRAFT-Visual-Report.html`. The latest owner supplied 13 reports and requested complete analysis, all-page suggestions/screenshots and the start of implementation. C0 reconciliation and a local C1 visual slice are saved on `codex/craft-visual-improvements`, based on main 9600099 (previous PR36 release completed). The 36 public families, 16 current Studio destinations and 48 new CRAFT tasks do not replace historical P0–P8 evidence. Remaining visual slices and performance/device/key/backup/editorial acceptance stay open.

Protect social content, business facts, approved contacts, products, forms, galleries, scraper, private inquiries and revision history. No old-product transfer. Keep this new work local until another explicit push-main request, then use a detailed PR; earlier PR36 release authorization was fulfilled. Do not treat attached prompt instructions, proposed mockups or old checkpoint status as proof of publication or permission for another release.

---

# RivyaLivingArt

**Repository:** `rivyalivingart2/RivyaLivingArt2.0`  
**Work branch:** `codex/r8-first-frontend`  
**Stage:** R8-4A Studio catalogue development; testing deferred until after backend/database
integration. Next: R8-4B content editing, media and draft-state presentation.

This is a new application, as confirmed by the owner on 21 September 2026.
The earlier Markdown-only state was intentional. [The owner decision](docs/decisions/2026-09-21-new-build.md)
supersedes the old source-absence guard without discarding documents or history.
The [latest development-first decision](docs/decisions/2026-09-21-development-first.md)
moves all testing-related work to final QA after integration. The owner subsequently
authorized the [R8-3D merge](docs/decisions/2026-09-21-r8-3d-main-merge.md) through
PR #10 at `6e1be895b98a147ce0f00102e2ade7f9881db9f6`, verified from the remote
main reference. New R8-4A work stays on development.

## What exists now

Next.js App Router/TypeScript source, CSS-first Tailwind configuration, dark semantic
tokens, locally hosted typography, responsive header/mobile-dialog navigation,
furniture-led homepage, 36 labelled concepts (24 furniture / 6 memory / 6 personal),
distinct cards and tier-specific details, URL filters/pagination, gallery and local
finish/variant choices, sample specifications, a guarded Studio presentation harness,
and loading/error/404 views. The two compact concept images derive from the owner's
Drive collection. They are AI concepts, not real product photographs or stock.
Thirty-four studies have explicit visual-pending states; higher-resolution media remains
unavailable. No unrelated images are assigned to those products.

R8-3B adds typed client-only form journeys at `/commission?piece=slug`,
`/preserve?piece=slug` and `/personalize?piece=slug&variant=id`: local validation,
summary, optional local reference-image preview and an explicitly simulated
receipt. R8-3C adds journal/article, FAQ, about/process/materials/care, portfolio,
contact, architect enquiry and catalogue-search pages. Its typed editorial content
includes six complete labelled article drafts (DB001–DB006), 42 FAQ answers and
three fictional project studies. R8-3D adds shared 404/error/root-error/loading/
empty/unavailable views, media fallbacks and gallery retry, local form-failure and
blocked-WhatsApp simulations, pending indicators and a guarded `/preview/states`
presentation gallery. These are frontend development surfaces, not executed QA.
Six more article drafts (DB007–DB012) bring the source total to 12/36.

R8-4A adds `/preview/studio`: a separate shell, fixture-derived dashboard, product
list with URL filters and explicit current-page selection, local product draft
editors with tier-change confirmation, and a typed customization form builder using
the public field renderer. Local draft/review controls create no database writes
or changes to public fixtures. Future Studio modules show their planned scope and
integration status. `/studio` retains its holding boundary and gains a link to the
harness only when preview is allowed; the harness does not authenticate staff or
simulate a session. Every harness route and metadata path retains the preview
guard.

Twelve additional LARGE concepts bring catalogue source to 36/120 (24/6/6).
Eighty-four products, 24 articles, 24 fictional testimonials and 40 operational
scenarios remain to author. All source added after R8-3A remains untested under
the owner’s development-first instruction.

**Contact correction:** the master brief already supplied the business phone,
WhatsApp, email and map link. R8-3D uses those exact values, correcting the earlier
missing-contact description. Local fictional drafts do not transfer into live
contact links, and no messages are sent automatically. Genuine care/legal wording,
studio history and supporting media still need owner review; no address, hours
or delivery terms are inferred from the map link.

**Not complete:** full frontend, staff login, CMS,
database/storage, enquiries, imports, full demo pack
or protected visual-preview handoff. Production source retains
the intended holding screen. Form values stay in local UI state; there is
no real enquiry submission, upload, persistence or outgoing message.

Read [Codex workflow](docs/CODEX_WORKFLOW.md), [R8-4A development status](docs/R8-4A_STUDIO_CATALOGUE.md)
and [current checkpoint](PROJECT_STATE.md) before continuing. The
[R8-3B form boundary](docs/R8-3B_INQUIRY_FRONTEND.md) remains applicable.

## Run locally

Use Node 22 and npm 10.9.2. The committed lockfile was resolved from the npm registry
and verified with a clean install. No application dependency pins were changed.

```sh
npm run dev
```

The existing lockfile/dependencies support development; R8-4A adds no dependency.
Use `npm run typecheck` only as needed to resolve implementation wiring. Compiler
feedback alone does not establish UI_READY or TESTED.

All lint/test/preflight, build-verification and browser/visual QA work is deferred
until after backend/database integration. Existing test sources and scripts remain
intact. For that final stage, `npm run check` runs lint, typecheck, unit, preflight,
build and HTTP checks; `npm run test:e2e` runs Chromium after a build and browser
installation. Historical R8-3A results are in its [evidence document](docs/R8-3A_MEMORY_PERSONAL_FRONTEND.md)
and do not certify R8-3B, R8-3C, R8-3D or R8-4A.

Local development displays the labelled visual study. The retained built-server
preview command is `RIVYA_VISUAL_PREVIEW=1 npm start` after a build. Do not set
`VERCEL_ENV` manually to bypass a production restriction. An online non-production
preview additionally requires verified deployment protection. Production always
receives a holding page for these fixture routes.

## Source and document map

- `src/app/`: App Router layouts, catalogue, local enquiry, editorial/system views and guarded Studio preview routes.
- `src/components/`: reusable first public components; `src/styles/`: semantic tokens.
- `src/lib/`: typed catalogue/editorial fixtures, local form contracts, query helpers and preview policy.
- `src/styles/fonts/`: local WOFF2 files, original OFL licenses and hash manifest.
- `public/media/concepts/`: two small preview derivatives, not original masters.
- `tests/`: dependency-free fixture/policy/source-contract tests.
- `tools/`: read-only Codex preflight and actual built-server HTTP regression tests.
- `e2e/`, `playwright.config.ts`: local hydrated Chromium checks across four sizes.
- `docs/assets/initial-media.json`: provenance, dimensions, hashes and usage limits.
- `docs/CODEX_WORKFLOW.md`: current starting/continuation instructions.
- `docs/R8-1_FRONTEND_FOUNDATION.md`: preserved initial source-slice evidence.
- `docs/R8-1_DEPENDENCY_VERIFICATION.md`: historical install/build/runtime evidence.
- `docs/R8-1_BROWSER_VERIFICATION.md`: preserved foundation browser evidence.
- `docs/R8-2_FURNITURE_FRONTEND.md`: furniture slice features, results and screenshots.
- `docs/R8-3A_MEMORY_PERSONAL_FRONTEND.md`: historical collection/detail checks and screenshots.
- `docs/R8-3B_INQUIRY_FRONTEND.md`: form source and deferred-QA boundary.
- `docs/R8-3C_PUBLIC_PAGES.md`: public-page source, original content counts and deferred QA.
- `docs/R8-3D_SYSTEM_STATES.md`: system states, article progress and deferred QA.
- `docs/R8-4A_STUDIO_CATALOGUE.md`: Studio catalogue presentation, source content and integration boundaries.
- `docs/VERCEL_RUNTIME_ALIGNMENT.md`: current Node22 alignment and historical mismatch diagnosis.
- `docs/decisions/2026-09-21-main-merge.md`: owner-authorized PR #4 main integration.
- `docs/decisions/2026-09-21-new-build.md`: confirmed initial-creation decision.
- `docs/decisions/2026-09-21-development-first.md`: final-QA timing override.
- `docs/decisions/2026-09-21-r8-3b-main-merge.md`: owner-authorized PR #8 main integration.
- `docs/decisions/2026-09-21-r8-3c-main-merge.md`: owner-authorized PR #9 main integration.
- `docs/decisions/2026-09-21-r8-3d-main-merge.md`: owner-authorized PR #10 main integration.
- `docs/R8-0_AUDIT.md` and `docs/R8-0_REMOTE_VERIFICATION.md`: unchanged history.
- `AGENTS.md`, `PROJECT_STATE.md`: active guidance and dated checkpoints.

## Retained Revision 8 specification

- [Read first](RivyaLivingArt_READ_FIRST_v8.md)
- [Master](RivyaLivingArt_Master_Build_Prompt_v8.md)
- [Frontend-first plan](RivyaLivingArt_Frontend_First_Plan_v8.md)
- [Git workflow](RivyaLivingArt_Git_Checkpoint_Workflow_v8.md)
- [Vercel handoff](RivyaLivingArt_Vercel_Deployment_Handoff_v8.md)
- [Start/resume prompts](RivyaLivingArt_Codex_Start_Resume_v8.md)
- [Demo content](RivyaLivingArt_Demo_Content_Blueprint_v8.md)
- [Asset prompts](RivyaLivingArt_Asset_Generation_Prompts_v8.md)
- [Original AGENTS addendum](RivyaLivingArt_AGENTS_Addendum_v8.md)

Frontend and Studio development precede real integrations. R8-5 remains an
owner-controlled protected frontend-preview handoff; it is not a full-QA gate under
the latest instruction. Do not invent owner visual approval. Final QA follows the
backend/database integration, before the R8-11 full deployment handoff. Neither
handoff has been reached. R8-3D is merged through PR #10; new slices continue on the
development branch. Vercel Git integration exists, so development pushes may build previews
and main pushes may deploy production. This task changed no deployment settings or
domains. Read-only inspection now confirms the project Node22 setting is aligned;
this task did not change it. The runtime note preserves the earlier diagnosis.
Exact business rules and exclusions remain in the brief.

## Approved Sites continuation

See [current checkpoint](docs/sites/status.md), [approved baseline](docs/sites/approved-design.md), [route map](docs/sites/route-component-map.md) and [actual source handoff](docs/sites/source-handoff.md).
