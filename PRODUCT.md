# Current status — Phase 3 complete locally, PR prepared on codex/google-cloud-acceptance

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
# Historical execution checkpoint — remaining Phase 1 and 2 work, 21 October 2026

Preserve the local descendant of `f3a7c04` on `codex/exact-legacy-restoration`. Read [the latest pending-work checkpoint](docs/restoration/exact-legacy-2026-10-21/PHASE-1-2-FINISH-CHECKPOINT.md), [verification receipt](docs/restoration/exact-legacy-2026-10-21/phase12-finish-verification.json) and [visual exceptions](docs/restoration/exact-legacy-2026-10-21/VISUAL-EXCEPTIONS.csv). The owner requested Phase 1 and 2 completion before moving on. Both phases are **not yet fully accepted**: real old database access and remaining exact-design/content mapping acceptance remain open.

This continuation reproduces the old project/Studio/error states in a guarded isolated source build, refines footer/project/scope images, and implements local newsletter capture and desktop WhatsApp behavior. Final local build `-PQ1q3ySBQe05yA-S1mEm` passes 411 unit/isolation, 403 HTTP and 12 preflight checks, 64 responsive measurements, unchanged 21 protected source hashes, and 28 accepted captures (11 on the final candidate build). The current Studio login remains unchanged. Original old source remains clean.

**Local only.** No production migration, publication, push/PR/merge/deploy, external messages or paid services. Preserve the populated isolated databases; never reseed or replay the request-table repair. The owner is signing into the OLDWEBSITE Vercel team's Storage page; continue the real read-only source baseline when access is available. Do not replace missing evidence with synthetic records or advance to Phase 3 based on older prose. Raw screenshots, SQL evidence and credentials remain ignored.

---

# Historical checkpoint — Phase 1 discovery / Phase 2 foundations, 21 October 2026

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

# Current audit continuation — 19 October 2026

The owner requested completion of pending audit changes. The [latest local report](docs/audits/rivya-master-audit/PENDING-COMPLETION.md) closes the translation-overview transfer issue and records bounded disposable lifecycle verification. It preserves active features, the established brand, content and manual WhatsApp flow. The previous cleanup's removal scope remains limited to confirmed unused, duplicate and excluded functionality. No new release, production repair or publication is authorized; external acceptance remains evidence-based.

---

# Current cleanup authority — 19 October 2026

The owner authorized audit follow-up changes and removal only of confirmed unused, duplicate and already-excluded features. [The follow-up report](docs/audits/rivya-master-audit/FOLLOWUP-CLEANUP.md) records the implemented bounded cleanup and retained functions. No active business feature, protected content/media, core workflow, logo or palette was removed. The previous audit's local-only release boundary remains: fresh authorization is required for a push, PR, merge, deployment, production write or CMS publication. Native/device/field evidence remains separate.

---

# Historical audit authority — 19 October 2026

The current scope is the 17–19 October full project audit and narrowly verified local repairs, including compatible security patch versions for existing dependencies. The accepted cinematic design, logo, palette, real content, data and manual inquiry/WhatsApp workflow remain protected. [Final verification](docs/audits/rivya-master-audit/FINAL-VERIFICATION.md) and the [independent security review](docs/audits/rivya-master-audit/SECURITY-RELEASE-REVIEW.md) distinguish source implementation, local execution, dated production observations and remaining acceptance gates. No release, production write or CMS publication is authorized without a fresh explicit instruction. The historical product/checkpoint sections below remain preserved.

---

# Product
<!-- impeccable:product-schema 1 -->

## Platform
web

## Confirmed scope and approval
Current checkpoint, 17 October 2026: the seven-phase redesign and subsequent sitewide cinematic system are delivered through PR #62; PR #63 records release verification. The current owner request is a full audit, followed by reproduced, narrowly scoped local fixes and an evidence-based report. Do not restart earlier phases. Do not push, merge, deploy, mutate production data or publish CMS content without fresh explicit authorization. See `docs/audits/rivya-master-audit/EXECUTIVE-SUMMARY.md` for the current audit and remaining evidence gates.

## Users and purpose
Public visitors explore collectible resin furniture/spatial art, memory art and personal gifts, read editorial content, save pieces and prepare a commission/inquiry. Studio staff manage products, content, media, languages, inquiries/orders and administration. These workflows are evidenced in the current source; this is not new user research.

## Capabilities and constraints
Keep RivyaLivingArt2.0 and its existing Next.js/React application, backend, permissions and publication contracts. Preserve products, prices, text, translations, media associations/crops, identities, routes, drafts, revisions, customer/order records, business and social values. Preserve manual WhatsApp sending and consent boundaries. Orders/commissions and editorial display ordering remain separate.

## Brand commitments
Retain exact current logo assets and main colour values. New layouts and motion follow the owner-approved contemporary material gallery direction. No copy rewriting, invented business claims, relabelled fictional testimonials, product recolouring or silent activation of optional offerings.

## Evidence and limits
Source copy, brand assets, media provenance, previous verification registers and explicitly fictional training-order examples exist. The shared cinematic foundation is connected to public pages and restrained Studio interfaces. Published content, authenticated staff access, database-backed inquiries and manual WhatsApp preparation are working source contracts, not planned placeholder features. Current verification must distinguish source review, isolated tests, live read-only checks and native/device/human evidence. Historical admin acceptance remains historical.

## Release boundary
Local only until explicitly authorized. A future release uses a detailed PR into main and exact deployment verification. Do not replay content publications. Scrapers, old-product transfers and backup work remain excluded.
