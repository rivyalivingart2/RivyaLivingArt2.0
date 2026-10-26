# Current continuation — 26 October 2026

Read [the Gemini/Antigravity handoff checkpoint](ANTIGRAVITY-HANDOFF-CHECKPOINT.md), [sanitized verification](antigravity-handoff-verification.json), [complete continuation prompt](CONTINUE-IN-GEMINI-ANTIGRAVITY.md) and [local/offline runbook](LOCAL-OFFLINE-RUNBOOK.md) first. Continue the existing `codex/google-cloud-acceptance` branch and open PR #67; do not reset to main or provision another sandbox. Fresh connected Drive/Sheets reads succeeded with zero writes. The new portable populated-state audit is locally verified; its full live run requires the original private registry, reviewed baseline and secure runtime OAuth binding. Earlier real writer/protection/deployment evidence remains dated; eight acceptance groups and phases 3–11 remain open. Source PR publication is authorized; a main merge can trigger Vercel production and retains the explicit later-release boundary. The existing production provider stays authoritative.

---

# Sheets/Drive transition and Studio completion plan

**Real sandbox installation update:** private Drive tree, four protected workbooks and one owner-executed version-1 signed writer are installed. The existing Phase 2 implementation now has real signed writer/conflict/replay, Drive JSON, durable job and private publication-pointer evidence. Read the [current checkpoint](SANDBOX-CHECKPOINT.md) and [scenario receipt](sandbox-verification.json) for exact coverage and carried gaps. Browser consent and sandbox key configuration are complete. No production migration, CMS publication, provider cutover, website release or environment publication occurred.

**Historical preparation checkpoint, 24 October 2026:** PR #66 main is verified at `019f4c1bac2c03dfeab00a1ed1fb46dc20c29d30`; new branch `codex/google-cloud-acceptance`. The earlier [cloud-verification.json](cloud-verification.json) records preparation before access was supplied. Phase 3–11 dependencies below remain in force; current source exports and real reconciliation are still required, and no historical row totals may be recreated as input data.

Date: 24 October 2026. Baseline: `e9d3228`; branch: `codex/sheets-drive-foundation`. Read [AUDIT.md](AUDIT.md) before execution. This plan implements the latest owner brief and retains completed work instead of resetting earlier restoration phases.

## Scope and execution rules

Preserve the accepted public design, including Rivya / Creations, The Signature and footer, plus all current Studio login states. Change only authenticated Studio visuals against the old reference. Preserve records, identifiers, URLs, prices, variants, originals, approved images, relationships and publication history.

Sheets becomes the structured-record authority only after reconciliation and controlled cutover; Drive holds managed files and versioned public snapshots. Keep server authorization/validation and preserve existing login behavior. Do not introduce an alternative persistent database, queue service or disk store. Disposable caches must be rebuildable from the authoritative Google resources.

The owner subsequently authorized publishing the accumulated Phase 0–2 checkpoint and earlier approved changes through a detailed PR into GitHub main, followed by a Codex Cloud handoff. This supersedes the earlier Git local-only hold for this release. That release authorization is historical. The later owner approval covers only the private sandbox and signed endpoint described in the current checkpoint; no production migration, CMS publication, storage cutover or later release is authorized. No products, archived catalogue/Sheets imports, Google Photos revisit, selected-image regeneration, seeds or replayed request repair. Prepare precise reviewable target ranges/folders, permissions and evidence before any action needing separate authority. Do not ask repeatedly before ordinary authorized local work.

Paths below are repository-relative. Existing and current implementation files are named directly; future modules are identified as planned. Private data, Google resource IDs/URLs, credentials, screenshots and raw exports stay in the ignored `test-results/google-workspace-2026-10-24/` directory; commit only schemas, code and sanitized receipts.

The current architecture maps the 28 actual tables into four permission-separated workbook groups: content (catalogue, CMS, media, settings and revisions), operations (inquiries, orders, private attachments, privacy and subscribers), security (four authentication tables), and system (historical audit, migration, crosswalks and conflicts). Future research, catalogue automation and job groups remain explicit extensions. New mutation audit/idempotency records must live alongside their canonical records for a single-workbook atomic batch. There is no cross-workbook transaction claim. The four isolated target workbooks are now installed; production resources remain outside this approval. See [ARCHITECTURE.md](ARCHITECTURE.md) and [the decision](../decisions/2026-10-24-sheets-drive.md).

## Phase 0 — Current-work audit

**Objective/status:** audit scope complete, with explicit access/verification gaps carried. Existing source and assets are retained.

| Task | Files/modules and deliverable | Dependency and impact | Acceptance and evidence |
| --- | --- | --- | --- |
| GW-000 | `AUDIT.md`; private Git/deployment/resource register. | Read-only repository, connector and deployment access; no data/auth/media changes. | Local `e9d3228`, main/production `1936cbb`, 12 local commits and no open PRs recorded. Distinguish build availability from complete workflow verification. |
| GW-001 | Private schema/record/protected-file snapshot; existing Phase 3/4 receipts. | Existing populated loopback database; read-only, no reseed. | 400 business rows/26 tables plus 6 transient rows/2 tables; 28-table/230-column/45-constraint schema; 923 protected tracked files accounted for. |
| GW-002 | Existing `src/lib/owner-creations.ts`, selected-media manifest and private Google artifact register. | Reuse existing files and connector metadata only. | 169 selected images/507 variants checked; 6 featured/12 types retained. Catalogue workbook/templates/source/output inventories classified without importing rows. |

**Carried gaps:** production row reconciliation, full authenticated live state coverage and installed Apps Script/trigger execution are unverified. These gaps prevent cutover claims, not independent local preparation.

## Phase 1 — Remaining-work architecture and permission plan

**Objective/status:** complete as a local architecture and remaining-work plan. The field dictionary, workbook boundaries, auth/publication/job/recovery design and phased implementation contracts are recorded; deployment and implementation acceptance remain in their respective phases.

| Task | Files/modules and deliverable | Dependency and impact | Acceptance and evidence |
| --- | --- | --- | --- |
| GW-100 | `ARCHITECTURE.md`, `data-dictionary.csv`, `migration-mapping.csv`, `src/lib/google-workspace/schema.json`; `src/lib/studio-db.ts` consumers and `src/lib/studio-modules.ts` inventory. | GW-001; no runtime or record changes. | Every one of 28 tables/230 fields/45 constraints has a destination, stable matching rule, transform, preservation/conflict rule and verification. Include repository-managed records and histories. |
| GW-101 | Permission and direct-edit contracts; planned resource registry. | GW-002 and real access boundaries. No shared resources created yet. | Separate restricted identity/operations workbooks from public/editorial content. Hidden tabs/protected ranges are not confidentiality. Canonical ranges cannot be bypassed by owner input areas. |
| GW-102 | Auth/publication/job/cutover design and migration conflict register. | Source audit of `studio-auth.ts`, `studio-staff.ts`, `published-source.ts`, `published-media.ts`, `presentation-store.ts`. | Define session continuity, durable throttling, coherent publication versions, validated direct edits, job leases/checkpoints, final delta and post-cutover recovery. No stale SQL fallback or uncontrolled dual writes. |

**Deliverable:** versioned field/resource/permission contracts and an implementation order that leaves the current app usable until an isolated replacement passes.

## Phase 2 — Google foundations

**Objective/status:** local implementation complete; private Google installation and core non-product round trips now verified. The codec/read transport, controlled writer, signed Apps Script CAS gateway, Drive JSON/publication contract and durable job adapter are reused. The earlier two large CMS round trips remain historical local evidence, not imported Cloud data. Full production readiness is not established: carry the current checkpoint's remaining real-provider/permissions/recovery cases into reconciliation and release gates. See [original Phase 2 evidence](PHASE-2-CHECKPOINT.md), [current sandbox evidence](sandbox-verification.json) and [isolated target plan](ISOLATED-TARGET-PLAN.md).

| Task | Files/modules and deliverable | Dependency and impact | Acceptance and evidence |
| --- | --- | --- | --- |
| GW-200 | `src/lib/google-workspace/record-codec.ts`; `tests/google-workspace-record-codec.test.mjs`. | GW-100; pure local code, no source-record mutation. | Typed round trips preserve IDs, dates, currencies, units, nulls and formulas-as-text. Reject invalid records/relationships; detect stale expected revisions; duplicate operations return the established result. |
| GW-201 | `src/lib/google-workspace/google-reader.ts`; `tests/google-workspace-google-reader.test.mjs`; planned server-only runtime configuration. | GW-101; read-only transport first; no login/provider switch. | Allowlisted workbook/folder/file access only; bounded reads/batches; credentials never reach the browser; classify throttling/unavailability without leaking provider responses or granting access. |
| GW-202 | `controlled-writer.ts`, `writer-gateway.ts`, local `apps-script/Writer.gs`: local implementation verified. | GW-200/201; real isolated Google target acceptance still pending. | Trusted policies, formula/history integrity, all-dependency CAS, one canonical batch, original-receipt replay and durable unknown-write quarantine pass local adversarial tests. Owner/unrelated-API edits still require protected ranges and reconciliation; ScriptLock is not universal exclusion. |
| GW-203 | `durable-jobs.ts`, `canonical-job-store.ts`, `drive-documents.ts`, `drive-json-rest.ts`, `publication-bundle.ts`: local implementation verified. | GW-102/202; no job/Drive provider is activated in the app. | Leases/fences, frozen inputs, retry/resume/cancel, interrupted CAS, checkpoint/output reuse, full hashed documents and coherent publication pass local tests including the signed gateway. Real Google execution remains a distinct acceptance gate. |

**Deliverable:** tested local foundations plus a concrete isolated target/write plan. Pure unit tests and mocks do not substitute for a real authorized provider round trip.

## Phase 3 — Migration rehearsal

**Objective/status:** local read-only mapping preflight delivered; real Google migration rehearsal remains pending. Existing snapshots, media mappings and approved derivatives are retained inputs.

| Task | Files/modules and deliverable | Dependency and impact | Acceptance and evidence |
| --- | --- | --- | --- |
| GW-300 | `tools/google-workspace/migration.mjs`, `rehearse.mjs`, `tests/google-workspace-migration.test.mjs`; field map and conflict ledger. Reuse `tools/exact-legacy/phase3/` mappings where valid. | GW-001/100/200; read current records without changes; current rehearsal envelopes stay in memory. | Every source record gets migrated/merged/retained/conflicting/excluded-with-reason/pending accounting. No archived product catalogue import or replacement seed. |
| GW-301 | Isolated Sheets/Drive importer with checkpoints and resumable media mapping. | GW-202/203 and explicit isolated target/write scope. | Preserve stable identifiers, populated values, relationships, histories and publication states. File IDs/provenance and original/derivative distinctions survive. Unknown old associations remain unknown. |
| GW-302 | Reconciliation and recovery report; source snapshots retained privately. | GW-301. No production authority switch. | Counts, IDs, key values, relationships, media associations and hashes agree or have reviewed discrepancies. Interrupted/repeated runs are safe and recovery is rehearsed. |

**Deliverable:** complete isolated rehearsal evidence, not a production migration. Keep the old production store intact throughout preparation.

## Phase 4 — Backend replacement

**Objective/status:** planned. Reuse current validation, rendering, security and publication contracts.

| Task | Files/modules and deliverable | Dependency and impact | Acceptance and evidence |
| --- | --- | --- | --- |
| GW-400 | `src/lib/studio-auth.ts`, `studio-staff.ts`, Studio login actions and related auth APIs; restricted Google adapters. | GW-102/202/302. Backend auth change only; login markup/styles stay protected. | Password verification, roles/account status, secure cookies, absolute/idle expiry, credential version, logout/revocation, recovery/access requests and cross-instance throttling work. Provider failures deny access; restricted hashes/sessions never enter ordinary workbooks/snapshots. |
| GW-401 | `published-source.ts`, `published-content.ts`, `published-media.ts`, `presentation-store.ts`, public query adapters and publication APIs. | GW-302 and validated publication model. | Versioned Drive snapshot is complete/validated before active pointer change. Each request uses one coherent version; drafts/private data excluded; failed publication retains last good version. |
| GW-402 | `inquiry.ts`, `subscribers.ts`, public action/API routes, `editorial-media-storage.ts` and remaining `studioDb` consumers. | GW-400/401 and private-media permissions. | Browser-to-API-to-Google-to-refresh works for save/reload/forms/uploads/downloads. Preserve manual contact behavior; no real customer test messages. Private media cannot be fetched through arbitrary file IDs. |
| GW-403 | `src/lib/studio-db.ts`, old provider dependencies/configuration and `package.json` at removal checkpoint. | Every consumer replaced and verified. | Run complete isolated journeys with SQL/old Blob credentials and providers disabled. Remove unused runtime dependencies only after this proof; retain recoverable source exports. |

**Deliverable:** complete isolated backend workflows with current public and login appearance unchanged. A successful build alone is insufficient.

## Phase 5 — Authenticated Studio redesign

**Objective/status:** partially complete inputs retained; full authenticated old-Studio design/function parity remains planned.

| Task | Files/modules and deliverable | Dependency and impact | Acceptance and evidence |
| --- | --- | --- | --- |
| GW-500 | `src/components/studio/workspace.tsx`, `workspace.module.css`, navigation and `src/lib/studio-modules.ts`; updated workflow ledger. | Old source reference and GW-400/402. Styling limited to authenticated Studio. | Each of 37 modules is classified by working workflow, not registration. Match old Studio layout/interactions where compatible with protected branding/security. |
| GW-501 | Existing catalogue/editorial/media/inquiry/staff/translation/subscriber workspaces and their APIs. | GW-500 plus entity adapters. | Search/filter/sort/pagination, bulk actions, drafts/revisions, validation, relationships, permissions and empty/loading/error/long-content states work after refresh. Retain completed image-draft/subscriber paths. |
| GW-502 | Private matched Studio/public/login captures and interaction evidence. | GW-501. No public/login CSS bleed. | Inspect 1920, 1440, 1200, 992, 768, 512 and 320 px; keyboard/focus/reduced-motion and supported roles pass. State any protected exception explicitly. |

**Deliverable:** usable Studio workflows and matched visual evidence; no menus counted as completed features.

## Phase 6 — Media, content and filters

**Objective/status:** partially complete; reuse all verified images and valid content. New products and archived imports remain excluded.

| Task | Files/modules and deliverable | Dependency and impact | Acceptance and evidence |
| --- | --- | --- | --- |
| GW-600 | `owner-creations.ts`, `studio-media.ts`, `editorial-media-model.ts`, category/project/article/testimonial fields and media association map. | GW-301/402. Preserve all originals and approved versions. | Required entity image slots support valid media; names/faces/details and provenance remain truthful. Associate only supported existing records; no invented reviews, customers or ratings. |
| GW-601 | Existing content editors and `src/components/studio/` filter controls; entity coverage report. | GW-501/600. Add only justified authorized non-product content. | Count meaningful distinct records/states and real filter combinations. Separate existing production content, drafts and isolated synthetic QA; never create duplicates or fabricate business evidence to reach 50+. |
| GW-602 | Drive-backed public/private delivery and derivative checks. | GW-402/600. No unnecessary regeneration. | Preserve 4:5 selected image sizes and exact approved masters; verify responsive loading, upload/replace/archive/retry/orphan and video behavior. |

**Deliverable:** supported content/media relationships, truthful coverage counts and functioning filters.

## Phase 7 — Scraper expansion

**Objective/status:** partially complete source inventory; 23 registered legacy vendors are not verified active adapters.

| Task | Files/modules and deliverable | Dependency and impact | Acceptance and evidence |
| --- | --- | --- | --- |
| GW-700 | `src/components/studio/legacy-scraper-reference.tsx`, legacy vendor registry and new source/research records. | Fresh source research and GW-203. External reads only within allowed sources. | Register provenance, country/category, permitted access method, rate limits and last verified status. Do not bypass logins/paywalls/access controls. |
| GW-701 | Bounded scraper adapters, Google-backed jobs, observations and review UI. | GW-700/402/501. Candidate research is separate from business records. | Real isolated fetch-to-observation/review flow; rate limits, deduplication, retries, cancellation, parsing failures and source changes are observable. |
| GW-702 | Reviewed handoff contracts and filters. | GW-701. No automatic product insertion or archived import. | Owner can inspect a traceable candidate and proposed mapping. Product creation remains disabled/excluded under current instructions. |

**Deliverable:** verified research/review workflows without implying that registered sources ran successfully.

## Phase 8 — Catalogue automation

**Objective/status:** existing workbook, templates, scripts and outputs located; working application integration/automatic generation remain unverified.

| Task | Files/modules and deliverable | Dependency and impact | Acceptance and evidence |
| --- | --- | --- | --- |
| GW-800 | Private artifact register; versioned local catalogue contract/source adaptation and future Studio catalogue module. | GW-002/203/600. Reuse existing native templates and source; no catalogue product imports. | Map current approved categories/products, template/theme/language/price/image choices and immutable input revision. Record each reused artifact; no needless template rebuild. |
| GW-801 | Apps Script/worker generation adapter and Sheets job/output records. | GW-800, approved isolated Google targets and authorized script execution. | Selected records produce editable native Slides plus PDF; stable Drive IDs; jobs survive retries/interruption without duplicate outputs. Move canonical queue/result state into Sheets. |
| GW-802 | PDF/slide validation, private renders and Studio output history/recovery UI. | GW-801. No public sharing or message delivery. | Inspect all pages for typography, image ratio, long content, pagination, Hindi text where included and current brand. Verify output links, PDF opening, editable Slides and failed-job retry/cancel. |

**Deliverable:** actual Sheets-to-Slides-to-PDF evidence. Existing files, queued dashboard text and syntax checks alone do not close this phase.

## Phase 9 — Full verification

**Objective/status:** planned for the complete replacement candidate; retain historical tests as prior evidence only.

| Task | Files/modules and deliverable | Dependency and impact | Acceptance and evidence |
| --- | --- | --- | --- |
| GW-900 | Existing `tests/`, runtime/preflight checks, `package.json` scripts and new focused Google suites. | Phases 2–8 integrated. Isolated test records/accounts only. | Lint/type/build/app tests plus meaningful browser-to-provider-to-refresh journeys pass at a recorded exact revision. |
| GW-901 | Security/failure/concurrency/performance evidence. | GW-900. No real customer messages or production test writes. | Conflicting editors, duplicate submissions, Google throttle/outage, failed partial writes, expired leases, revocation and interrupted jobs recover safely. Measure quotas/latency; no silent auth grant or stale-store fallback. |
| GW-902 | Private seven-width public/Studio/login comparisons and provider-removal proof. | GW-403/502/602/802. Preserve protected design/data. | Required widths and states inspected; protected record/media comparisons pass; all critical flows work with old database/storage providers inaccessible. Disclose native/device/real-provider evidence separately. |

**Deliverable:** candidate-specific verification receipt and unresolved issue register. Do not reuse old test totals as fresh results.

## Phase 10 — Controlled cutover and release

**Objective/status:** the future Google storage cutover and its release remain planned and unauthorized. The current Phase 0–2 source PR/main publication is a separate owner-authorized release and does not activate Google storage.

| Task | Files/modules and deliverable | Dependency and impact | Acceptance and evidence |
| --- | --- | --- | --- |
| GW-1000 | Concrete cutover/runbook, backup/recovery manifest and release diff. | GW-302/902 and production access evidence. Preparation only. | Account for final delta, a bounded write pause or replay, exact target resources/permissions, active-pointer switch and recovery of post-cutover writes. |
| GW-1001 | Authorized migration/authority switch and repository release workflow. | Fresh authorization for the concrete external actions; do not infer from this plan. | Reconcile final data; single authoritative write destination; PR/exact head/reviews/deployment evidence follow project release requirements. |
| GW-1002 | Read-only production acceptance and recovery readiness. | GW-1001. Retain old data/exports for the defined window. | Exact READY revision and complete deployed journeys verified; public/login unchanged; no fallback to stale data. Database deletion is a separate destructive action. |

**Deliverable:** truthful deployed-state report only after the actual authorized cutover succeeds.

## Phase 11 — Handover

**Objective/status:** planned; this audit and plan are the first documentation inputs.

| Task | Files/modules and deliverable | Dependency and impact | Acceptance and evidence |
| --- | --- | --- | --- |
| GW-1100 | `AGENTS.md`, `PROJECT_STATE.md`, `PRODUCT.md`, root `README.md`, this directory's `README.md`, `docs/decisions/2026-10-24-sheets-drive.md` and operating/migration/auth/media/catalogue/scraper documents. | Actual implementation and verification receipts. No private artifacts committed. | Current scope supersedes historical public redesign/SQL permanence rules; every phase distinguishes implemented, verified, blocked, migrated, published and released. |
| GW-1101 | Owner operating guides, continuation instructions, issue register and task-owned-process cleanup. | Complete or explicitly bounded current checkpoint. | Direct Sheet edits, permissions, recovery, job retries and catalogue generation are documented with evidence. Preserve unrelated services and ignored backups; stop only completed task-owned processes. |

**Deliverable:** self-contained handoff with exact local/released revisions, protected-data evidence, usable previews, remaining blockers and next authorized action.

## Checkpoint reporting

For each checkpoint report task IDs, source revision, environment, implementation result, verification evidence, data/media/auth changes, unresolved limitations and next action. Keep the preview usable and provide matched screenshots when a visible design checkpoint changes. No phase is complete solely because its code compiles or its interface exists.
