> Owner scope change, 5 October 2026: the project backup feature, scheduled archive jobs, archive-key custody tasks and backup/RPO/RTO acceptance gates are removed. Any earlier instruction below to run, verify, schedule or require them is historical and superseded. Existing archives/keys were not deleted. Studio draft/revision recovery and privacy-erasure safeguards remain. See the 2026-10-05 removal decision.

# P7 verification report and P4 performance acceptance

3 October 2026. **Engineering repairs and the recorded isolated checks are saved locally. P4 performance acceptance and full P7 acceptance remain open. P8 preparation is ready for review; no live release occurred.**

Candidate source: `dc744c3dd35a9f2bdc4641c4d7d551374dbf9d3c` on `codex/p7-performance-release`. Includes P6 commits `56aca73` and `2a84b1e`, based on main `c94427de88d45a216fdf545840efef2f875e5789`. This document records actual failures and unavailable evidence as well as successful checks. A local source commit is not a deployed candidate.

## What changed and why

Public rendering was repeating publication reads and compiling unrelated pages. It now shares published product/content/media and shell reads within one server render, and compiles only the requested document when a route is known. Stored snapshots are not repeatedly transferred where they are recompiled. There is no cache across requests: publication and withdrawal still take effect on the next public request; saved private previews retain their captured dependencies. All 120 product projections, 55 visible page projections and the business projection matched the prior implementation exactly.

Three existing fonts now use WOFF2 packaging. Their original files, licenses, character maps, glyph order, outlines and metrics remain unchanged. Files total 89,540 bytes instead of 238,664 bytes; measured network saving is approximately 31 KB because the server already compressed TTF responses. No new app dependency or font design was introduced.

Privacy verification found real defects: legacy answers survived erasure, failed storage deletion lost its retry record, erasure lacked version checks, an administrative reason could bypass normal eligibility, and restored notes/recovery explanations could retain personal details. The repaired engine checks the current record and policy, atomically revokes access and anonymizes both answer representations, preserves inaccessible pending storage work, and releases quota exactly once after deletion succeeds. Holds and open/ongoing cases remain blocked. Replay removes restored personal fields, notes, private references and recovery explanations. Erased records cannot receive new notes, assignments, follow-ups, amendments or order moves. Audit identities/times remain; customer-bearing explanation text is redacted.

Tablet navigation now switches to its compact menu before links overflow at intermediate widths. Named inquiry and Content health control groups use valid accessibility roles. Studio accurately distinguishes erased personal fields from pending private-image deletion.

## Results tied to this candidate

| Check | Recorded result and limits |
|---|---|
| Unit / preflight | 280 / 12 passed, including three erasure-policy boundary tests |
| Compiled HTTP suite | 401 passed; run after the application changes, before font-only packaging |
| Build / TypeScript | Final font build passed; no dependency lockfile change |
| ESLint | Zero errors; 62 existing repository warnings. Changed final layout also passed |
| Customer/security journeys | 48 checks across existing furniture, memory, gift and bespoke flows; real isolated private upload/deletion; no external message sent |
| Wrong guest | Additional exact API check: a separately initialized guest received 404 with no receipt data |
| Private deletion failure | Five checks: failed provider deletion stays pending/inaccessible; retry and repeated retry release quota once |
| Privacy/export/replay | Nine checks: actual empty scoped export, seven-day metadata expiry, invalidation, reason redaction and three synthetic ledger replays |
| Homepage lifecycle | 12 checks: draft isolation, exact preview, publication, withdrawal, stale conflict and recovery; original publication and unpublished draft restored separately |
| Accessibility/layout | 43 loaded pages, 215 width samples at 320/390/768/1024/1440; zero horizontal overflow. Two axe findings fixed and affected pages rescanned with zero violations |
| Interaction follow-up | 19 checks: keyboard dialog/gallery/focus, seven board widths, loaded media, no-JavaScript navigation and wrong-guest denial; zero uncaught browser errors |
| Old/reference preservation | 1,882 whole-file matches against P0, seven documented code exceptions, zero unauthorized source differences; old repository unchanged |
| Shared destination | Fresh read-only comparison matches all 120 products, 131 original public-media records, gallery associations and the full business settings record against P0 |
| Exact public projection | All 120 products, 55 content documents and business output match pre-P7 code; per-route and full compilation agree |
| Backup | Fresh ciphertext, owner-only remote permissions/parent, downloaded hash, authenticated decryption and manifest verified; 19 tables, zero private objects |
| Service restore | All 19 table counts/digests match; restored public routes and real Studio owner sign-in pass; temporary DB/role removed. Controlled drill: 87.581 seconds |

The current final compiled build includes all application repairs and compressed fonts. Broad behavior checks preceded only the font packaging; final keyboard/Studio checks and final desktop/mobile measurements include it. Build success and a clean browser console are not claims of empty server logs: aborted navigations produced closed-stream messages. Automated axe checks leave contrast/manual-review items; they do not certify WCAG compliance.

## P4/T42 measured performance

The agreed field targets remain LCP ≤2.5s, INP ≤200ms and CLS ≤0.1 at the 75th percentile of real visits. Single laboratory samples are diagnostics, not field percentiles. No analytics service or customer event tracking was activated.

Desktop: local compiled QA with remote isolated storage, 1440×1000, no throttling, cold then warm browser cache. Final measurements:

| Route / browser state | P6 LCP | Final P7 LCP | Final TTFB | CLS |
|---|---:|---:|---:|---:|
| `/` / cold-browser | 6.128s | 2.248s | 1.982s | 0.000 |
| `/` / warm-browser | 3.160s | 2.136s | 2.025s | 0.000 |
| `/collectible-design` / cold-browser | 3.628s | 1.408s | 1.272s | 0.000 |
| `/collectible-design` / warm-browser | 4.704s | 3.964s | 3.869s | 0.000 |
| `/process` / cold-browser | 2.748s | 3.292s | 0.240s | 0.000 |
| `/process` / warm-browser | 3.232s | 2.332s | 0.452s | 0.000 |
| `/journal` / cold-browser | 2.372s | 2.368s | 0.280s | 0.000 |
| `/journal` / warm-browser | 1.932s | 2.332s | 0.463s | 0.000 |

An intermediate optimized run before font packaging had all eight samples under 2.5s. The final build has 6/8 under that value; do not cherry-pick the intermediate run as acceptance. Variable database response time and local image/font processing remain visible. Cold homepage improved from 6.128s to 2.248s, but a warm collection and cold Process sample still miss the threshold. No CLS regression was observed in these desktop samples.

Mobile: 390×844, DPR 3, touch, reduced motion, cold browser cache; CDP CPU 4×, latency 150ms, download 1.6Mbps/upload 750Kbps. Local image delivery is not the production CDN. One sample per route, with menu interactions on public pages and board switching on the inquiry list:

| Route | LCP | TTFB | CLS | Largest sampled interaction duration |
|---|---:|---:|---:|---:|
| `/` | 3.632s | 1.923s | 0.0158 | 248 ms |
| `/collectible-design` | 4.576s | 1.526s | 0.0000 | 200 ms |
| `/memory-art` | 5.696s | 3.361s | 0.0000 | 152 ms |
| `/personal-art` | 5.848s | 2.818s | 0.0000 | 136 ms |
| `/pieces/river-channel` | 5.480s | 3.859s | 0.0000 | 136 ms |
| `/pieces/vow-framed-varmala-keepsake` | 4.432s | 2.599s | 0.0000 | 144 ms |
| `/pieces/botanical-resin-pendant` | 3.236s | 1.666s | 0.0006 | 136 ms |
| `/pieces/river-channel/customize` | 2.708s | 1.504s | 0.0001 | 136 ms |
| `/pieces/vow-framed-varmala-keepsake/customize` | 2.704s | 1.484s | 0.0001 | 136 ms |
| `/pieces/botanical-resin-pendant/customize` | 2.700s | 1.558s | 0.0001 | 136 ms |
| `/commission/customize` | 1.752s | 0.536s | 0.0001 | 136 ms |
| `/process` | 3.104s | 0.456s | 0.0000 | 152 ms |
| `/journal` | 2.736s | 0.472s | 0.0000 | 152 ms |
| `/studio/inquiries` | 4.352s | 0.991s | 0.0385 | 280 ms |
| `/studio/content?record=page%3Ahome` | 4.856s | 0.913s | 0.0348 | Not sampled ms |

Only 1/15 samples meet a 2.5s laboratory LCP comparison. All measured CLS values are under 0.1. The largest sampled interaction durations include values above 200ms; these are Event Timing diagnostics, **not p75 INP**. No edit interaction was sampled on the editor. Studio editor transfer is approximately 2.49 MB, a concrete remaining optimization target. Final font saving is real; changing network/server timing prevents attributing every LCP difference to it.

**Acceptance is not passed.** Continue with a candidate served in the intended hosting/database region, inspect actual query and image timing, reduce Studio list/editor payloads through version-preserving lazy detail reads, and profile menu/board work before introducing any cache across requests. Such a cache must retain exact-preview and immediate withdrawal guarantees. Re-run affected routes under the same profile, then collect eligible real-user field evidence after an authorized release. Do not silently weaken the target or publish fake p75 values.

## Backup, recovery and privacy boundaries

The verified archive was created at 05:41:59 UTC (11:11:59 IST) on 3 October and remotely verified at 05:46:54 UTC. SHA-256: `06882596ab729a94743a8e026044422452153da41093ce4d1f877b90bac05d80`. It contains 19 tables and zero current private objects. No source records were changed. No retention candidate was eligible; no archive was deleted.

The prior successful-backup gap was **52.21 hours**, exceeding the 24-hour RPO target. A fresh valid archive does not erase that failure. The local daily schedule still requires this computer to be awake, connected and authorized. Independent password-manager and sealed offline key copies are **owner-confirmed unverified**. No key was requested in chat or written into these reports. The 87.581-second controlled service drill does not establish recovery after losing this computer. Fresh private-object restore is not proved by an archive with zero objects; actual upload/deletion and failure/retry were tested separately.

Restore safety: disable intake and restored sessions/staff before exposing the service; reconcile the latest independent erasure ledger, then replay it and confirm pending storage deletion is zero. The current shared-source ledger contained zero erasures during this drill. Synthetic replay proved removal after restoration separately. A backup taken before a later erasure cannot be publicly restored without reconciling the newer ledger.

Managed-export expiry removes service metadata, not downloaded CSVs. Erasure invalidates all managed-export metadata conservatively and clears criteria. The operator must remove external copies according to the approved seven-day procedure; the application cannot recall them. Only a header-only empty export was generated here, and no customer CSV was saved.

Existing `phase11-erasure-engine.sql` and new `p7-erasure-runtime-grants.sql` were applied only to guarded QA. The fresh shared archive already had 19 tables; the backup-source role has the inspected privileges, which does not establish the deployed runtime role's grants. Verify actual runtime columns and privileges before any release. No automatic build migration was added.

## Detailed old-site and Studio coverage

The old site's 74 registered sections retain explicit dispositions: 18 homepage purposes in `P4-HOME-SECTION-DISPOSITION.md` and 56 further sections in `P4-SECTION-DISPOSITION.md`. Homepage furniture/work/words/workshops/print remain conditional where facts are missing; no fabricated offering, project or testimonial was substituted. The old Studio comparison and 43-family state decisions remain in `P5-REFERENCE-COMPARISON.md` and `p5-family-coverage.csv`.

`p7-family-evidence.csv` links all 79 public/Studio families to their existing decisions and the fresh P7 candidate samples. It distinguishes fresh checks from inherited P4/P5/P6 evidence. The 136-template register is a source inventory, not 136 new browser tests. Full per-family visual/assistive-device acceptance remains open where only inherited or sampled evidence exists. T66 is not closed merely because these registers exist.

## Phase task decisions

| Task | Current state |
|---|---|
| T24 | Core saved-request/manual-handoff journeys verified locally; durable snapshot, recovery race and no-auto-send evidence recorded |
| T25 | Real private upload/access/deletion and retry verified locally; wrong guest and wrong/reassigned staff denied |
| T40 | Automated and keyboard work verified; human screen-reader and physical-device tasks still required |
| T42 | Measurements and improvements delivered; loading/interaction acceptance and field evidence remain open |
| T43 | Erasure/export/replay repairs verified in isolated resources; external downloaded-copy procedure remains operator-owned |
| T44 | Fresh remote backup and controlled service restore pass; independent key custody and reliable daily/RPO evidence remain open |
| T62 | Source/data preservation and changed-flow evidence recorded; whole-candidate acceptance inherits the remaining performance/accessibility/recovery gates |
| T66 | Section dispositions and sampled candidate comparison recorded; full per-family visual/device acceptance is not yet complete |
| T41/T61 (P4) | Functional implementation remains complete; measured performance acceptance is still open |
| T48 (P8) | Release packet, rollback and owner guide prepared; no release authorized/executed for this candidate |

## Environment, cleanup and exclusions

Mutating checks used the existing guarded QA DB `rivya_qa_20260924`, its restricted runtime role and its dedicated private store. Four synthetic P7 saved inquiries were created; three were used for erasure/replay tests and the remaining one was closed. Two temporary staff accounts were disabled. A synthetic article is hidden; original homepage draft and publication were restored independently. Audit/revision history remains. Earlier failed attempts left two unsubmitted synthetic reference images subject to the existing 24-hour cleanup policy; this report does not claim every test blob was already removed. Guest upload sessions created by read-only form readiness checks expire normally.

Shared resources were read only for protection, content inventory and encrypted backup. Recovery used a separately created disposable database and role, both removed. No production save/erasure/migration, source push, PR, deployment, message, campaign or scraper job occurred.

Conditional T34/T37/T45/T47 remain inactive. S09 new-product media remains deferred. No old product transfer, payments or customer accounts were introduced. Existing business translations still need actual review/publication. Unsupplied legal address/registration details remain unsupplied. Reviewed Drive still-image assignments remain governed by the P3 manifest; video is unselected. Product records, forms, images/gallery links and canonical contacts are unchanged.

## Evidence and next handoff

All `p7-*.json` files beside this report are sanitized receipts; local screenshots and detailed test logs remain in the task's `outputs/P7/`. `P8-RELEASE-PACKET.md` identifies the source, current production/rollback reference, destination revisions and the held release steps. `P8-OWNER-EDITING-GUIDE.md` covers normal editing and recovery. `P8-PR-DRAFT.md` is a local draft only.

Primary standards: [Web Vitals thresholds](https://web.dev/articles/defining-core-web-vitals-thresholds), [WCAG 2.2](https://www.w3.org/TR/WCAG22/) and [target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum). The report applies their distinction between measured results and acceptance; it is not a compliance certificate.
