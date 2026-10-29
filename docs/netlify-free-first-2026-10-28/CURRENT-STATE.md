# Current state — guarded session lifecycle, 29 October 2026

**Latest local continuation:** session creation, validation/refresh and revocation now use a guarded store and token service with explicit adapter integration. The supported-runtime session/related and lookup runs passed 138 distinct tests. The next local dependency, strict security lookup planning and root-pinned reading, is implemented with final verification recorded in [the session continuation](phase2/SESSION-CONTINUATION.md). No Google runtime activation, provider write, migration or release occurred.

**Latest scope:** fix storage capacity, continue pending work, and keep all changes local. Do not push, create/update a PR or merge without the owner's later permission. [OWNER-SCOPE.md](OWNER-SCOPE.md) and [Phase 2](phase2/README.md) are the active continuation instructions. Full provider checks, recovery, Studio parity and verification belong to their assigned phases; they are not a circular prerequisite for implementing their local foundations.

The inactive v2 bounded writer, job adapter and atomic login-throttle adapter are implemented and locally tested. The writer exposes verified original-prior records to domain policies, preserves complete history, reads registered proof pages and fences unknown outcomes. Shared deadlines cover reads, commits and conflict reconciliation. The original v1 endpoint and production application selection remain unchanged. No new database was selected. The latest details and aggregate receipts are in [the foundations continuation](phase2/FOUNDATIONS-CONTINUATION.md).

An actual read-only checkpoint completed at **2026-10-28 18:34:02 UTC** (29 October in the owner's time zone): 22 tables, 3,455 rows and all 36 schema/key checks. All 20 business-table fingerprints / 3,425 business rows still matched the protected source. The 55,970,259-byte encrypted archive was decrypted and reconciled locally. Its key uses Windows DPAPI and owner-only permissions; no raw export, key, private registration or source payload hash is committed.

The complete local source model passed at **2026-10-29 04:00:12 UTC**, using that verified checkpoint. It preserves all **3,455 rows**, including **310 oversized payloads / 20,537,481 bytes** through an explicitly local Drive emulator. Both complete document passes verified exact bytes/hashes; there were 310 creates, no duplicate create attempts, one private journal reopen and zero process restarts. All four bounded representations fit. Content has 2,210 records, a 708,391-byte manifest, a 727,736-byte maximum measured signed read and a 926,992-byte maximum among eight sampled prepared updates. Samples rank JSON character length; they do not establish the largest UTF-8 request or every possible update. See [the complete-model receipt](phase2/source-document-rehearsal.json). **No real Google document exists from this rehearsal**. Actual allocation, future growth, provider latency/quotas and sustainable free Google-account capacity remain open.

The preceding real restore into a fresh local PostgreSQL cluster **passed on 28 October at 18:43:24 UTC**: all 3,455 source-row representations and 36 mapped schema/key checks reconciled. It was not rerun for the new local document model. The stopped database, failed-attempt evidence and encrypted archive remain retained. See [the restore receipt](phase2/local-record-restore.json). This is records-only: media, complete SQL schema semantics, portable/off-device recovery and full operational recovery remain excluded.

A fresh signed read of all four existing Google sandbox boundaries completed at **03:47:18 UTC**: eight read requests, four records and 14 historical mutations. Both observations matched; the local v1-to-v2 plan preserved their payloads, actors, times and generic receipts. It does not prove source coordinator state or a write freeze. Legacy full domain-operation bindings are unavailable, so converted job mutations deliberately fail closed at the new adapter's replay boundary. That compatibility gap remains a cutover gate. No target was installed or written.

| Reporting dimension | Current status |
|---|---|
| Implemented | Prior storage foundations plus guarded session lifecycle/token service, explicit adapter delegation and inactive strict lookup planner/reader. Full security provider remains unselected |
| Locally verified | Latest session/related and lookup runs passed 138 tests; actual-checkpoint lookup plan has zero staff/request rows and zero claims. Prior 195-case storage checkpoint and complete-source model retain their own scope; 1,198 protected files unchanged |
| Real-provider verified | No provider requests in the session continuation. Earlier eight signed sandbox reads and GitHub/Netlify observations retain their dates; the five Google checks remain open |
| Preview verified | No new preview or deployment |
| Migrated | No Google target records/documents/media copied or reconciled |
| Cut over | No authority switch; existing SQL/Blob remain authoritative |
| Production released | No push, PR change, merge or deployment |
| Old dependencies removed | None; Vercel, Blob, SQL and OLDWEBSITE retained |
| Backups retained | Current encrypted local source-record checkpoint and verified stopped SQL restore retained; complete backup and off-device recovery unverified |

The refreshed GitHub read still shows PR #71 open/draft/unmerged at `7b390d558b9a48d5ec7ccedb8bab104f6b1411f9`, with base main `35f99fd9b5fd1b76333d92b4ddf3b90289c99b2a`. Netlify's **29 October 03:55:35 UTC** readback is ready/locked on the same migration revision and branch at www.rivyalivingart.com. The latest session work continues from `0745c954bd4167b388a133ba80d4100ef2e8b3e7` on `codex/netlify-free-first`, preserving both migration commits.

Proceed with the exact remaining dependencies in [Phase 2](phase2/README.md) and [the phase plan](PHASE-PLAN.md). Do not claim full Phase 0–11 completion, provider acceptance or release from these local results.

## Dated audit detail retained from the preceding checkpoint

The following details retain their original observation dates. Their earlier implementation sequence/status is superseded by the current section and Phase 2 checkpoint above.

The earlier [Phase 0 follow-up](phase0/FOLLOWUP.md) closed narrower gaps: public browser control worked through an existing tab, Creations category/search/pagination/reset were observed, seven retained archives were listed directly, and bounded Vercel billing summaries returned nonzero team-wide cost records. Its unavailable current-authentication and signed-writer-binding observations are now superseded by the pending-work report. Full authenticated workflows, full responsive comparison, actual archive restore, immutable deployed writer source and renewable Drive/Slides runtime credentials remain unverified. The original [audit](phase0/AUDIT.md), [feature matrix](phase0/FEATURE-MATRIX.md), [dependency map](phase0/DEPENDENCIES.md), [protected baseline](phase0/PROTECTED-BASELINE.md) and [claims/gates register](phase0/CLAIMS-AND-GATES.md) retain their dated scope.

Application baseline is local commit `41cda9c20947dface0b027484106d0bbcc0cdd14`, still descended from the migration commits. Fresh Phase 0 reads at 14:20–14:21 UTC confirm unchanged live revision, 22 tables / 3,454 rows, all 20 business-table fingerprints and 92 Blob objects. The protected source manifest has 1,198 unchanged files. All 37 modules and 32 old sidebar entries are now mapped; two old routes are absent. The Netlify capability response reports 300 credits included / 0 used; independently reconciled usage remains unverified. Retained Vercel reports Pro, with trial/charges not exposed by the available account response. See the audit for evidence scope.

The latest owner brief is [OWNER-BRIEF.md](OWNER-BRIEF.md). It supersedes conflicting hosting, absolute database prohibition, public redesign and archived-import instructions. This programme is incomplete. Historical Phase 0–11 completion receipts are not provider or release acceptance.

## Refreshed baseline

- GitHub remote main: `35f99fd9b5fd1b76333d92b4ddf3b90289c99b2a`, refreshed with authenticated Git fetch on 28 October.
- Existing migration branch: `codex/netlify-hosting-migration`, `7b390d558b9a48d5ec7ccedb8bab104f6b1411f9`. PR #71 remains open/draft. Its earlier missing-login/DNS statements are stale.
- Continued locally from that exact commit on `codex/netlify-free-first` in the existing clean Netlify worktree. Both migration commits are retained. No remote branch update or production deployment from this continuation.
- Netlify API: published deployment `6ae1b9c6e88874ce935011ec`, ready, exact `7b390d5`; production branch remains the migration branch and deployment is locked. Account type reports Free; 300 plan credits, automatic top-ups disabled, no Pro/Enterprise trial active. Remaining credit usage is still unmeasured.
- Fresh HTTPS: homepage, Creations and login 200 from Netlify; apex 301 to www; anonymous Studio redirects to login and orders API returns 401. Login has fields and no setup-pending message. Default netlify.app login still returns 200, with no canonical redirect.
- Robots still blocks indexing. Fresh production environment readback confirms indexing, order intake and message retry disabled; newsletter unset. No Google runtime credentials are listed and Google storage is not selected. No settings changed.
- Existing browser Studio overview is visible. Its access-refresh warning cleared after the existing “Check renewed access” action. That is limited evidence, not a save/publish/role/expiry certification.
- Read-only source: 22 tables, 3,454 rows; 9 validated foreign-key constraints. Fresh hashes for 20 business tables / 3,425 rows exactly match the earlier protected baseline. No record values printed or production business writes made. The subsequent repeatable-read, read-only source rehearsal validated all 3,454 rows, unique stable identities, lossless encoding and all 36 primary/unique/foreign-key contracts. It measured 54,650,653 bytes of source row JSON; 3,144 records fit inline and 310 require Drive documents. This is source validation only, not target migration, encrypted backup or restore.
- Fresh Blob metadata inventory: 92 objects / 11,678,925 bytes, matching earlier totals. Original Blob bytes have not been rehashed/copied in this continuation.
- Four existing owner-only Google sandbox workbooks were found under the requested account. Each has records, ledger, audit, history and writer_control tabs (100 x 12 grid allocation). Metadata access does not verify the five outstanding acceptance checks.
- No retained private registry/signing-key file was located in this project's work directories. The cloud checkpoint points to files in its earlier cloud filesystem. Do not reconstruct its registry from display names, reset workbooks, rotate a key or reprovision to hide this dependency.
- OLDWEBSITE source remains available locally and through GitHub; its deleted database is unavailable. Old source counts are historical, never recoverable data.

Private readback evidence remains ignored under `test-results/hosting-google-audit-20261028/` and `test-results/netlify-migration/private/`. Earlier repair evidence is under `test-results/free-first-20261028/`; the latest Phase 0 refresh is under `test-results/netlify-free-first-phase0-20261028/`. Keep raw screenshots, resource registrations, provider IDs, customer rows and credentials out of Git.

## Protected baseline and reuse

The public homepage, Creations, Signature, footer, logo, contact details, selected images and Studio login presentation are protected. No public component, CSS or login file is being redesigned. The selected-creation suite passed 4/4 again: 169 images / 507 variants retain all expected bytes, dimensions and delivery references. The current live catalogue has 120 existing records; that is a storage count, not proof of 120 authentic sale offerings. Existing demo/disclosure labels and truthful provenance must survive migration.

No products are added. No archived catalogue or separate owner-sheet list is imported. Do not replay request-table repairs. Existing SQL/Blob remain authoritative during preparation; no automatic fallback after a future authority switch. All old providers and OLDWEBSITE are retained.

The 28-table schema was observed in isolated QA. Six mapped tables are absent from live production: editorial_extensions, editorial_extension_revisions, migration_markers, newsletter_subscribers, restoration_conflicts and restoration_crosswalk (all with rivya_ prefix). Absence is explicit; do not synthesize records or recreate tables to match historical counts.

## Evidence and feature matrix

| Area | Status | Evidence boundary / remaining work |
|---|---|---|
| Netlify public hosting, www/TLS/apex | verified complete for availability | Fresh provider/HTTP reads; main/PR alignment and broader release remain pending |
| Current SQL login | implemented but unverified for full lifecycle | Login renders and existing overview available; no credential changes |
| Public design/media | implemented but unverified for seven-width parity | Preserve source; new responsive capture programme pending |
| Controlled Sheets writer / Drive JSON / canonical jobs | partial | Real historical sandbox evidence plus source/local tests; five real checks still open |
| Production Google bootstrap | missing | Existing app remains SQL/Blob; missing retained signed registry and renewable credentials |
| Security/operations/publication replacement | partial | Store interfaces and foundations exist; runtime route integration remains incomplete |
| Authenticated Studio parity | partial | Existing editors plus 37 modules; route registry is not complete workflow acceptance |
| Actual migration and restore | missing | Actual source-row rehearsal passed; target copy/readback/recovery unperformed |
| Approved media associations / filters | partial | Genuine content and existing images retained; per-module acceptance needed |
| Durable scraper | partial | Legacy source explorer and simulated stores are not a deployed worker pipeline |
| Sheets → Slides → PDF | partial | Fake registrations/outputs removed; immutable caller snapshots retain exact prices/disclosures; native generation still missing |
| Integrated/release/handover verdicts | local repairs verified | Baseline false positives removed; real provider/browser/backup acceptance still missing |
| Default Netlify hostname redirect | partial | Source rule prepared on this branch; not deployed |
| Old-resource retirement | blocked | SQL/Blob dependencies and unreconciled replacement remain; exact deletion authorization still required |

## Implementation changes in this continuation

- Receipt aggregation now requires matching full revision, deployment, environment, evidence hash, observation time and actual request count. Missing/duplicate/stale/simulated evidence cannot pass. This is an evaluator, not an authenticity guarantee or provider runner.
- Responsive requirements use 320, 512, 768, 992, 1200, 1440 and 1920 widths across five protected surfaces. No width enumeration is described as a browser test.
- Schema-only backup inventories expose unknown row counts/hashes and explicitly say they are not backups. The in-process pause/ledger model is labelled simulation.
- Production switch and rollback helpers reject requests: token prefixes and environment booleans cannot change durable authority. Post-cutover writes must reconcile before rollback.
- Catalogue specifications no longer masquerade as private Drive registrations. The compatibility simulation blocks without a real provider and returns no invented file IDs/URLs/bytes/hashes.
- The Google security interface requires an atomic throttle operation. A canonical writer adapter is implemented; independent-client race and lost-ack tests are local, not fresh Google evidence.
- Media delivery requires exact registration and publication or resource-level private authorization. Prefixes and a staff-login boolean are insufficient.
- Server-only OAuth renewal is implemented and locally fault-tested: bounded requests, coalesced renewal, early expiry, revocation/rotation fail-closed and sanitized errors. No credential is created or activated.
- Snapshot inputs are detached/frozen; exact minor-unit prices, on-request/starting-from semantics and existing demo/media disclosures are retained. Catalogue access requires a registered-output policy.
- Windows metadata creation now restricts and verifies native owner-only ACLs before writing content. Junction and overwrite protections are tested. Unix mode-0600 behavior remains.
- Synthetic reconciliation distinguishes source plans and checkpoint claims from actual target commits/readback/media hashes/recovery.
- Canonical redirect targets only `rivyalivingart.netlify.app`, preserving path/query and independent preview hosts. Hosted verification remains pending deployment.

## Required next sequence

1. Restore browser inspection and collect real seven-width, authenticated-workflow evidence. Source repair tests, measured source rehearsal, build and local HTTP checks passed in this checkpoint.
2. Reuse the now-observed private writer configuration and verified signed-read path. Complete the distinct renewable Drive/Slides runtime credential, promotion-expiry/capacity and quota checks. Do not extract browser-vault credentials, revive sessions, rotate keys or replace the sandbox.
3. Complete the five real-provider checks: ordinary editor protection; concurrent owner/API edit; real interrupted script/quarantine; independently expired lease; bounded genuine rate-limit response. Synthetic faults remain simulation.
4. Integrate canonical persistence and coherent snapshots into the actual routes, preserving SQL as current authority until every dependent route is ready.
5. Rehearse actual records/assets into isolated targets and verify full target readback, relationships, restore and final-delta behavior.
6. Complete Studio, durable research and native Slides/PDF generation; verify browser→API→provider→reload.
7. Prepare exact reviewed Netlify cutover/release. Production migration/publication and old-resource deletion require scoped authorization; no question is needed to continue routine local work.

See [ARCHITECTURE.md](ARCHITECTURE.md) and [PHASE-PLAN.md](PHASE-PLAN.md) for placement and remaining acceptance.

## Verification receipt — local candidate, not a release

- `node --import tsx --test tests/*.test.mjs`: **767/767 passed**, no skips. Run outside the app sandbox for native Windows ACL/junction tests. Earlier 760/762 failures led to the ACL repair; they were not waived.
- `node --test tools/codex-preflight.test.mjs`: **12/12 passed** using temporary Git fixtures outside the sandbox.
- `npm run test:runtime`: **663/663 passed**, actual built localhost Next.js server with production credentials explicitly blanked. HTTP checks do not execute browser JavaScript.
- `npm run build`: passed outside the app sandbox. The earlier sandboxed build stalled and was interrupted; no production deployment occurred.
- Next route type generation + TypeScript: passed. ESLint: 0 errors / 62 pre-existing warnings. The generated `.netlify/` build directory is now ignored by source linting.
- `git diff --check`: passed. Public components, CSS, login implementation, selected media and product source/data were not changed.
- The selected-image byte/dimension suite is included in the passing tests and was separately rerun (4/4).
- Browser inspection: the earlier existing Studio overview/access refresh is limited evidence only. Subsequent Chrome page-control calls repeatedly timed out before inspection; an in-app-browser fallback also timed out. No seven-width screenshots or authenticated save/publish tests were completed.
- Google: fresh owner-only workbook metadata verified; all five outstanding provider acceptance cases remain unverified. The local credential renewal module and concurrency/failure tests use explicit emulation, not Google acceptance.

The principal external dependency is the retained signed Google sandbox registry/key and renewable server credential configuration from the earlier cloud environment. This checkout does not contain it; Netlify production does not have Google credentials. Connector access does not supply an application credential. No vault/history extraction, registry reconstruction, re-provisioning, credential rotation or sharing change was used to conceal that gap. Continue from legitimate owner-controlled runtime access when available. Browser control must also work before protected visual/Studio acceptance.

Private evidence and logs: `test-results/free-first-20261028/`. Source database row values stayed in memory. The local source remains incomplete across Phases 2–11; a passing build/test suite does not close those phases. See [RELEASE-PREPARATION.md](RELEASE-PREPARATION.md) for concrete release and retention sequencing.
