# Phase 0–11 implementation guide

Prepared 29 October 2026 against implementation checkpoint `98a8369`. Refresh
actual state before work. This expands the [master brief](../netlify-free-first-2026-10-28/OWNER-BRIEF.md),
[phase matrix](../netlify-free-first-2026-10-28/PHASE-PLAN.md) and
[current state](../netlify-free-first-2026-10-28/CURRENT-STATE.md); it does not
replace their protected requirements or certify unfinished phases.

Use the [working procedure](AI-WORKING-GUIDE.md) and [verification guide](VERIFICATION-AND-RELEASE.md).
For every task retain its ID, objective, dependencies, affected files, data/media/auth
impact, actual evidence, status and remaining action. Status vocabulary: verified
complete; implemented but unverified; partial; missing; broken; blocked. Qualify
each status by implementation/local/provider/preview/production environment.

## Current acceptance map

| Phase | Current bounded status | Work that still determines acceptance |
|---|---|---|
| 0 | Audit package prepared; partial provider inventory | Refresh exact installed source, account/integration ownership and inventory gaps |
| 1 | Local design/measurements prepared | Sustainable growth, ongoing-free capacity and final authority decision |
| 2 | Substantial local foundations; provider acceptance partial | Renewable credentials, v2 bootstrap, five actual Google checks, scheduling |
| 3 | Actual retained-record checkpoint and local rehearsal/restore evidence | Google/media targets, complete reconciliation and full/off-device recovery |
| 4 | Guarded sessions and atomic Security slice locally verified | Runtime assembly, operations/forms/publication/private-media completeness |
| 5 | Partial Studio implementation | Every relevant OLDWEBSITE workflow and visual/role acceptance |
| 6 | Partial | Actual approved-asset coverage, truthful associations and filters |
| 7 | Partial | Durable real acquisition/review workflow; no product insertion |
| 8 | Partial | Real editable Slides and verified downloadable PDF generation |
| 9 | Partial local evidence | Full provider/browser/concurrency/failure/responsive/performance journeys |
| 10 | Production cutover blocked by acceptance | Final delta, exact authorized deployment and recovery |
| 11 | Documentation partial; retirement blocked | Operating proof, accurate final handover and scoped retirement |

The order below is acceptance order. Safe local prerequisites may overlap. Never
require a completed provider migration before implementing its missing adapter,
or label a later phase done because its local simulation exists.

## Phase 0 — actual current-state audit (NFF-000–004)

**Purpose:** establish what exists and protect it before changes. **Impact:**
read-only source/provider inspection; normal owner login may refresh session rows.

Read [phase0/AUDIT.md](../netlify-free-first-2026-10-28/phase0/AUDIT.md),
[FOLLOWUP.md](../netlify-free-first-2026-10-28/phase0/FOLLOWUP.md), the protected
baseline and [Netlify migration history](../hosting/netlify/MIGRATION.md).

1. Refresh branches/worktrees/dirty files, main, open PRs and production source.
   Verify that the old migration commits remain ancestors, not merely named in a report.
2. Inspect Netlify branch/lock, deploy revision, domain/TLS, scopes, redirects,
   indexing and intake/retry flags. Preserve working GoDaddy records.
3. Inventory actual SQL tables/records, Blob/media, Google workbooks/folders/writer
   versions and account ownership using supported read-only access. Public reports
   contain counts/hashes, never rows, keys, private IDs or authenticated links.
4. Compare protected public/component/data/assets against the retained hashes.
   Classify the old Studio modules/routes and current handlers by actual behavior.
5. Reconcile every historical claim with source or executable/provider evidence.
   Retain unavailable installed-source/identity facts as gaps; do not infer them
   from an unsigned endpoint, UI label or a local Writer.gs file.

**Verify/deliver:** refreshed feature/dependency/asset/authority matrix with exact
revisions and timestamps, protected hash result, explicit missing facts and next
action. Existing audit counted 37 modules, 32 old routes and 53 handlers; those
are dated inventory counts, not completed workflows. No repair/import is a Phase 0
audit side effect. Acceptance does not require finishing Phase 5 or Phase 9 first.

## Phase 1 — free-first architecture (NFF-100–103)

**Purpose:** choose an enforceable authority, permission and capacity model.
Read [ARCHITECTURE.md](../netlify-free-first-2026-10-28/ARCHITECTURE.md) and
[phase1/README.md](../netlify-free-first-2026-10-28/phase1/README.md).
Source: `src/lib/storage`, `src/lib/google-workspace/schema.json`,
`tools/google-workspace/source-capacity.mjs`, `bounded-source-measurement.mjs`.

1. Measure actual field sizes/encoding/wire bytes, read/write/concurrency rates,
   transaction groups, history growth and recovery retention. Do not size only
   today's live rows. Keep Security, System, Operations and Content boundaries.
2. Finish sustainable Security history capacity. Current verifier limits are
   256 current records, 256 proof pages and 8 MiB proof data; bounded manifest is
   capped at 1 MiB. Archived sessions/claims/events still consume space. Define
   verifiable segmentation/retention without deleting protected history.
3. Describe one authority per entity, stable IDs/schema/revisions, normalization,
   deletion/archive semantics and conflict rules. Direct editable Sheets are
   validated staging unless equivalent concurrency protection is demonstrated.
4. Verify ongoing-free account ownership and limits from current official sources
   plus actual account settings. A temporary 5 TB promotion is not ongoing-free
   capacity; prior account use exceeded the ordinary 15 GB allowance. Check actual
   eligibility and usage again. Do not move/delete files merely to clear capacity.
5. If measured reliability/security cannot fit Sheets/Drive, document the smallest
   free database exception: requirement, failed approach, exact owned entities,
   plan/limits, no billing upgrade, exports/restore and exhaustion behavior.
   Existing SQL is protected during the decision; do not provision by convenience.

**Verify/deliver:** architecture decision, authority and permission tables, source
and growth measurements, quota/cost evidence with date, migration/conflict/recovery
plan. Test bounded rejection at ceilings. A source-scale emulation does not prove
real Google latency, indefinite growth or future free capacity.

## Phase 2 — Google/Netlify foundations (NFF-200–205)

**Dependencies:** Phase 1 safety/authority contracts and legitimate resource access.
**Impact:** server persistence, credential renewal, jobs and controlled writes.
Read [FOUNDATIONS-CONTINUATION.md](../netlify-free-first-2026-10-28/phase2/FOUNDATIONS-CONTINUATION.md),
[provider acceptance](../netlify-free-first-2026-10-28/phase1/PROVIDER-ACCEPTANCE.md)
and [bounded-store tooling](../../tools/google-workspace/bounded-store.README.md).

Code: `tools/google-workspace/apps-script/BoundedWriter.gs`,
`convert-legacy-writer.mjs`, `isolated-setup.ts`; `src/lib/google-workspace/`
`bounded-store.ts`, `writer-gateway.ts`, `oauth-token-provider.ts`,
`drive-json-rest.ts`, `drive-documents.ts`, `bounded-job-store.ts`,
`bounded-throttle-store.ts`, `durable-jobs.ts`.

1. Preserve the installed v1 sandbox. Compare signed existing observations with
   saved source/deployment identity; prepare an isolated v2 conversion/bootstrap
   and reconciliation. Do not overwrite its registry or install by guessed ID.
2. Bind renewable least-privilege server credentials through the legitimate owner
   configuration. Test expiry, renewal races, revocation, scope/resource allowlist
   and safe error reporting. A temporary Playground token is not production auth.
3. Finish bounded manifests/pages/document references. Verify readback hashes,
   revisions, formula-safe typed encoding, HMAC requests/responses, lock-time
   validation, idempotency, quarantine and resolution of unknown outcomes.
4. Make jobs durable through separate processes: claims, lease/fence renewal,
   cancellation, bounded work, checkpoint, retry and actual output readback.
   Keep slow provider calls outside write locks. Wire real scheduling only with
   appropriate configuration authority and measured execution/quota budgets.
5. Prepare the five Google checks below in disposable authorized targets. Run
   actual provider checks only within their bounded scope; never change production
   records, sharing, scopes or quotas merely to manufacture a pass.

| Gate | Required actual experiment | Passing evidence |
|---|---|---|
| G1 ordinary-editor protection | Attempt prohibited canonical edits as an ordinary editor, separate from the owner/writer | Provider denies mutation; exact protected range/resource remains unchanged |
| G2 owner/API race | Coordinate real direct owner/API edits against a controlled write | Conflict/quarantine detected and no lost or falsely accepted write |
| G3 interrupted script | Interrupt real execution at a prepared safe intermediate point | Durable partial state is quarantined; restart cannot report false success; reconciliation recovers |
| G4 independently expired lease | Separate workers, actual elapsed expiry and a later valid fence | Stale worker cannot commit; current worker preserves cancellation/checkpoint/output |
| G5 genuine quota response | Bounded naturally encountered limit, or separately authorized disposable reduced quota | Real provider retry metadata, backoff and canonical resume; no quota flooding |

**Verify/deliver:** installed revision/registration proof privately retained,
sanitized provider receipts with real request counts, worker restart evidence and
safe credential runbook. Injected 429s and same-process clocks remain simulations.
If a gate cannot safely run, retain blocked status and continue independent work.

## Phase 3 — protected migration rehearsal (NFF-300–303)

**Dependencies:** target contracts, safe isolated resources and verified source
backup. **Impact:** actual private data/files; source remains authoritative.
Code: `tools/google-workspace/checkpoint-live-source.mjs`, `local-recovery.mjs`,
`run-local-record-restore.mjs`, `source-document-migration.mjs`,
`rehearse-source-documents.mjs`, `rehearse-live-source.mjs`,
`src/lib/google-workspace/importer.ts`, `reconciliation.ts`.
Read [recovery instructions](../../tools/google-workspace/local-recovery.README.md)
and [document migration](../../tools/google-workspace/source-document-migration.README.md).

1. Refresh source inventory privately; authenticate the existing protected checkpoint
   before reusing it. The retained 28 October checkpoint has 22 tables/3,455 rows,
   not a current inventory. Explain six absent tables from the older 28-table mapping.
2. Reconcile exact IDs, values, types, revisions, URLs/prices/variants, foreign keys
   and references embedded in JSON. Do not invent missing tables/history or import
   excluded archived rows. Represent bootstrap history honestly.
3. Rehearse inline and oversized document rows in isolated actual target storage.
   Existing local coverage includes 310 emulated document references; it is not
   proof that 310 Drive files exist. Journal allocation, resume, readback and
   unknown outcomes; reopen in a genuinely separate process.
4. Inventory necessary Blob originals and references. Copy only permitted existing
   media, verify checksums/MIME/dimensions/privacy/ownership, and reconcile every
   reference. Keep repository-served working public images where appropriate.
5. Stop/resume during each critical stage. Resolve conflicts explicitly. Restore
   full schema/constraints/grants as well as rows, files and relationships in a fresh
   environment. Test owner-accessible off-device recovery and key recovery.

**Verify/deliver:** actual source/target counts and canonical hashes, absent/conflict
register, per-file reconciliation, interruption receipts and verified recovery.
The existing fresh local SQL record restore is valuable but does not prove complete
schema/media/off-device restoration or a backup interval/RPO guarantee.

## Phase 4 — application persistence (NFF-400–406)

**Dependencies:** safe capacity/bootstrap, selected provider and real persistence
contracts. **Impact:** authentication, public data, forms, operations, publication,
private media and every old SQL caller. Preserve current working login.

Read [Security continuation](../netlify-free-first-2026-10-28/phase2/SECURITY-WORKFLOWS-CONTINUATION.md)
and [session continuation](../netlify-free-first-2026-10-28/phase2/SESSION-CONTINUATION.md).
Source: `src/lib/google-workspace/security-current-snapshot.ts`,
`bounded-security-workflows.ts`, `bounded-security-service.ts`,
`bounded-session-store.ts`, `bounded-session-service.ts`, `security-adapter.ts`,
`operations-adapter.ts`, `publication-adapter.ts`, `publication-bundle.ts`,
`drive-media-delivery.ts`, `provider-switch.ts`; `src/lib/studio-access.ts`,
`src/app/api`, `src/app/studio` and all `studioDb()` call sites.

1. Preserve completed session creation/validation/refresh/revocation and atomic
   lookup/request/approval/reissue/reject/redemption/audit/maintenance behavior.
   Their existing local integration is not installed runtime or Google acceptance.
2. Reconcile bootstrap completeness, SQL uniqueness/collation and stable marker.
   Provision a current owner epoch through explicit trusted configuration; do not
   infer it from legacy sessions. Prove all claim/source changes share one root.
3. Assemble the server provider with renewable credentials, actual request cookie
   resolver, session and workflow services, shared deadline and redacted errors.
   Connect successful-login attempt receipts and bounded maintenance scheduling.
   Reconstruct services across workers/cold starts; never rely on singleton memory.
4. Replace persistent split-CRUD operations with atomic domain transactions.
   Reserve unique references with their source writes, require expected revisions,
   record audit, and preserve one-time/replay semantics. Persistent adapters fail
   closed when incompletely configured; only explicitly named simulators use memory.
5. Implement operations/forms/publication and private-file paths end to end.
   Persist before reporting form success; preserve user values on failure. Publish
   coherent public-only bundles with last-valid fallback and actual Netlify cache
   invalidation. Authorize each registered private file, not a broad path prefix.
6. Inventory every active SQL/Blob caller and provider switch. Keep current authority
   selected until isolated acceptance and final cutover. No uncontrolled dual writes
   or hidden fallback; an approved narrow free DB exception must be explicit.

**Verify/deliver:** browser → server → durable provider → fresh-process/reloaded UI
journeys, secure cookie/host/role tests, concurrent throttling/redemption/approval,
credential changes, actual expiry/logout/revocation and provider outage behavior.
An old replay receipt cannot issue another credential/session. Domain audit and
legacy rivya_audit retain distinct provenance; do not fabricate cross-store atomicity.

## Phase 5 — authenticated Studio restoration (NFF-500–503)

**Dependencies:** the relevant Phase 4 paths. **Impact:** authenticated Studio only;
public design and current login remain protected.
Read [exact restoration reference](../restoration/exact-legacy-2026-10-21/CONTINUE-IN-NEW-CHAT.md)
and the Phase 0 feature inventory. Inspect actual OLDWEBSITE source/reference,
existing `src/app/studio`, `src/components` and API handlers before editing.

1. Build a route/module parity matrix: dashboard; products/variants/categories;
   orders/inquiries/follow-ups; customers; staff/access; media; editorial/content;
   projects/testimonials; research; catalogues; settings; audit/history.
2. Compare old authenticated layouts, navigation, density, fields, dialogs and
   interactions against current implementation. Document protected exceptions.
   Reuse compatible components; do not redesign from inspiration screens.
3. Complete each workflow's role checks, validation, draft/save/reload, history,
   filters/sort/pagination/count/reset, applicable bulk actions and error recovery.
   Edit only existing products; test isolated fixtures without adding live products.
4. Exercise a newly opened authenticated browser and another session/worker.
   Verify persisted data reloads and errors keep input. Include empty/loading,
   long-content, disabled/unauthorized and stale-revision states.

**Verify/deliver:** per-module actual journey and visual evidence at required widths,
role matrix, remaining parity defects and preserved public/login hashes/screens.
A menu item, route admission, screenshot or source registry is not a full workflow.

## Phase 6 — media, truthful content and filters (NFF-600–602)

**Dependencies:** actual content/media inventory and relevant Studio forms.
Code: `media-association-map.ts`, `entity-coverage.ts`, `drive-media-delivery.ts`
under `src/lib/google-workspace`, plus existing public/Studio filter consumers.

1. Reverify the approved 169-image/507-variant collection against actual files;
   refresh if legitimately changed. Preserve originals, selected edits, 4:5
   delivery and current sizes. Do not substitute rejected cutouts or collect Photos.
2. Map existing category/blog/project/testimonial records to appropriate permitted
   assets with IDs, alt text, provenance, privacy and publication state. AI images
   are presentation, not evidence of a delivered customer project.
3. Derive filters/counts from actual persisted approved records. Define combination,
   clear/reset, pagination and empty/error behavior. Keep page URLs and existing
   product relationships; no fabricated counts or additional products.
4. Test upload/view/download/replacement/archive/retry/video and orphan handling.
   Stable delivery must not rely on an expiring Drive URL. Distinguish public and
   private access through server authorization and intentional publication.

**Verify/deliver:** per-entity coverage from real records, checksum/reference report,
truthful content exceptions and browser filter/media results. The existence of
asset variants alone does not prove coverage or legitimate testimonials.

## Phase 7 — durable research and scraper workflows (NFF-700–703)

**Dependencies:** durable jobs, registered sources and review persistence.
Code: `scraper-registry.ts`, `scraper-adapters.ts`, `scraper-handoff.ts`,
`durable-jobs.ts` under `src/lib/google-workspace`; existing scraper UI/API routes.

1. Audit actual configured vendor/competitor sources and permitted acquisition.
   Respect access rules; no login bypass, paywall bypass or aggressive crawling.
   Use official APIs/allowed pages where available and preserve source provenance.
2. Implement bounded fetch, timeout/backoff, normalization, source URL/timestamp,
   content identity, duplicate/change detection and durable observation records.
3. Persist queue/lease/fence/checkpoint/cancel/retry and review decisions. Resume
   after process kill/redeploy without losing observations or duplicating acceptance.
4. Complete Studio review: inspect source, compare change, reject/archive/annotate
   and hand off to research/content work. Product creation/import stays forbidden;
   do not make a hidden create-product action available through a worker or bulk UI.

**Verify/deliver:** actual permitted source → saved observation → reopened review
journey, duplicate/change/cancel/retry tests and no product writes. Distinguish a
fixture parser test from live acquisition and durable cross-worker acceptance.

## Phase 8 — Sheets to editable Slides to PDF (NFF-800–803)

**Dependencies:** approved current records/media, durable jobs and real credential
access to registered templates/output folders. Code: `catalogue-automation.ts`,
`catalogue-worker.ts`, `catalogue-validation.ts` under `src/lib/google-workspace`,
the catalogue UI and [existing Studio catalogue scope](../R8-4A_STUDIO_CATALOGUE.md).

1. Read actual permitted Sheets catalogue input; validate selected existing products,
   prices/variants/images and template choices. Freeze a versioned input snapshot
   with stable IDs/hash and actor. Do not import archived source lists.
2. Reuse a registered native Google Slides template. Copy through the real provider,
   populate editable text/images/layouts, preserve 4:5 art and multilingual glyphs,
   and record returned IDs only after readback. No synthetic output identifiers.
3. Persist each bounded generation step. Reconcile unknown copy/export outcomes
   against registered job identity before creating another output. Support resume,
   cancellation, duplicate delivery and explicit superseded outputs/history.
4. Export actual PDF bytes via Google, store/reopen them, and verify hash/MIME/page
   count/content/layout. Render representative pages, including long titles, prices,
   Hindi/Gujarati and missing-image handling. Keep native Slides editable.
5. Connect Studio selection/customization, progress, retry/history, authorized Slides
   access and PDF download. Enforce privacy on files and links.

**Verify/deliver:** real input snapshot → editable deck → verified PDF → browser
download journey with actual provider IDs kept private where required. A static
mock, local generated presentation, estimated byte count or fake ID is not acceptance.

## Phase 9 — full integrated verification (NFF-900–904)

**Dependencies:** complete relevant implementation and isolated provider runtime.
Code: `integrated-verification.ts`, `verification-evidence.ts`,
`production-acceptance.ts`; `tests`, `e2e`, `playwright.config.ts`, runtime tools.

1. Run supported-runtime unit/security/provider-contract, lint, type, preflight,
   build and built HTTP checks. Record exact failures/skips/platform limits.
2. In a real browser execute public and authenticated journeys through actual
   provider storage and reload. Test auth/roles/forms/publication/media/research/
   catalogues and confirm outputs in the provider, not only a toast.
3. Compare 1920, 1440, 1200, 992, 768, 512 and 320 px: homepage, Creations,
   Signature, footer, login and authenticated Studio. Check keyboard/focus, reduced
   motion, empty/loading/error/long states and measured performance.
4. Use separate workers/processes for concurrency, cold starts, stale revisions,
   throttling, one-time tokens, lease expiry, worker interruption, replay, provider
   outage, quota and expired credentials. No production load or quota exhaustion.
5. Prove the isolated Netlify architecture with obsolete SQL/Blob/Vercel credentials
   absent, except a specifically justified narrow database role. Check logs for
   unintended fallback. Keep previews noindex and isolated from production writes.

**Verify/deliver:** exact candidate/deploy matrix, provider/network evidence,
screenshots retained privately, security/failure findings and resolved regressions.
Physical-device, native-reader, human editorial and real-user/field evidence remain
separate gates; do not infer them from automation. Release acceptance cannot return
ready unconditionally or when required evidence is absent.

## Phase 10 — authorized Netlify cutover/release (NFF-1000–1003)

**Dependencies:** real acceptance, complete recovery, final source inventory and
specific authority for production actions. Read [release preparation](../netlify-free-first-2026-10-28/RELEASE-PREPARATION.md).
The 29 October GitHub publication does not itself satisfy this phase.

1. Prepare exact production resource/context changes, candidate SHA, write fence/
   pause or delta capture, drain conditions, reconciliation and abort thresholds.
   Capture a recoverable backup and prove restore/access before migration.
2. Obtain/use authority for the concrete action. Reconcile final permitted records,
   files, identities and concurrent changes; switch each authority coherently.
   Record start/end/final delta and actual deployment IDs privately as appropriate.
3. Align Netlify's production branch/lock only as part of the authorized release.
   Verify exact deployment SHA/ready status, www/TLS/apex/default-host redirects,
   deep routes, cookies, publication/cache and operational flags. Preserve GoDaddy.
4. Verify fresh post-cutover reads/writes/auth/media. Recovery must account for new
   target writes; a stale SQL fallback is not safe rollback. Keep source resources
   intact throughout acceptance and the agreed retention window.

**Verify/deliver:** reviewed source/PR, exact deployed revision, delta reconciliation,
post-release journey and tested recovery procedure. No automatic intake/retry/
indexing enablement. A GitHub merge or Netlify build alone is not cutover evidence.

## Phase 11 — operating handover and approved retirement (NFF-1100–1102)

**Dependencies:** actual accepted architecture and separately scoped destructive
approval. Code/docs: `handover.ts`, cutover/owner operating guides and resource register.

1. Update setup/ownership, direct Sheet editing, credentials renewal, role/recovery,
   publication, uploads, scraper schedules, catalogue templates, quotas, backup/
   restore and incident procedures. Give commands with prerequisites and effect.
   Privately share real workbook/folder/template/output locations with the owner.
2. Report each evidence dimension honestly. Explain reused/repaired/missing work,
   actual record/media reconciliation, current authorities, tests and limitations.
   Ensure an operator can execute restore and routine work from the guide.
3. Inventory old deployments/integrations/domains/schedules/webhooks/Blob/database/
   credentials/billing. For each item state retain/migrate/disable/delete, reason,
   dependencies, recovery and the exact authorization required.
4. Execute only specifically authorized retirement after reconciliation, independence
   and recovery proof. Verify each result and billing impact. Keep OLDWEBSITE and
   required backups. Do not delete a database whose ownership depends on the old
   marketplace until independent continuation is proved.

**Verify/deliver:** owner-operable runbooks, accurate final matrix, retained backup
access and resource-by-resource actual retirement receipts. Source cleanup does not
prove provider deletion. An unexecuted retirement plan remains a plan.
