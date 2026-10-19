# Pending audit follow-up — 19 October 2026

The owner requested completion of pending audit changes. This local follow-up starts from `e7000c4b3acf9515c140eea2c0cea8c1051ac2a6` on `codex/audit-pending-completion`. It retains the completed audit and confirmed-unused cleanup, closes the remaining translation-overview transfer issue, and supplies actual disposable-database evidence for previously blocked lifecycle cases. It does not release the candidate or mark external acceptance complete.

## Completed local change

The Language review screen previously downloaded complete draft and published documents, including captured page content, to display only titles, destinations and review counts. Its 603-entry parsed response occupied **6,256,425 bytes** even after the earlier 20-card pagination improvement.

`GET /api/studio/content?view=translations` now returns an explicit read-only projection: ID, title, route, revision and canonical Hindi/Gujarati draft/publication review results. The same 603 entries occupy **206,124 bytes**, a **96.7% reduction** in parsed entry JSON. This measurement excludes HTTP compression/envelope and is not a field-performance or database-transfer measurement. The underlying full database read and server baseline comparison remain; the browser no longer needs full documents or calculates their review fingerprints.

- Staff authentication and private/no-store response headers remain in force.
- Every draft and published review result in both languages matches the original full-document calculation. Hidden or absent publications remain “Not published.”
- Search, language/status filters, revision labels, all 31 pages and all 603 editor destinations remain available.
- Language switching uses results from the same response without refetching.
- Selected editors still receive their complete records, including captured snapshots, before editing. Save, publication, rollback and translation eligibility rules are unchanged.
- Failed refresh retains previous results with an explicit stale warning; retry restores current coverage.
- No logo, palette, media, content, active feature, schema, dependency or production configuration changed in this follow-up.

Changed application files: `src/lib/translation-overview.ts`, `src/app/api/studio/content/route.ts`, `src/components/studio/translation-workspace.tsx`. The 12 new unit cases in `tests/translation-overview.test.mjs` cover missing/incomplete/unreviewed/reviewed/stale results, independent published status, hidden/null publication, metadata-only output and source preservation.

## Previously blocked lifecycle checks now executed

A dedicated runner creates a fresh, wholly synthetic PostgreSQL 18.6 cluster on `127.0.0.1:55441`, separate from the existing protected QA database on 55439. It verifies the precise role, database, port and new data directory, refuses an occupied port, strips inherited deployment/database/storage configuration, and stops only the cluster it created. The guarded fetch/SQL transport rejects external fetch requests and every other database target; this is not an OS-wide network firewall. No private or existing QA records are copied.

The suite uses **actual application services and route handlers with real SQL**. Its fixtures comprise three fictional inquiries/orders, three fictional CMS pages, two fictional staff accounts and two erasure-ledger rows. Next cookie/cache context and the Blob SDK are explicitly labelled test adapters. They are not a real browser/HTTP server or cloud provider.

Verified cases include:

- Erasure denied for missing request/identity verification, a hold, ongoing follow-up, an accepted open order, stale versions, wrong role/origin or missing exact confirmation; relevant state remains unchanged.
- Actual anonymization, note/event and recovery-audit cleanup, assignment/guest revocation, export invalidation and minimal erasure-ledger accounting.
- Missing storage credentials leave references inaccessible with deletion pending and quota reserved. This is a safe pending state, not a claim that remote bytes were deleted.
- Labelled fake-provider private-byte round trip and access checks, deletion failure/retry, concurrent retries and exactly-once quota/slot accounting.
- Due retention versus premature erasure, repeated ledger replay after selected fictional personal fields are deliberately restored, and no duplicate ledger completion.
- Actual draft creation, role/origin enforcement, publication through the real public SQL projection, stale/unsaved rejection, revision recovery as a new draft, explicit republishing, withdrawal and changed-dependency conflicts.

No application defect was reproduced within these executed lifecycle cases. The remaining real-provider, HTTP/framework-cache and full external-restore boundaries are disclosed rather than inferred from the adapters. See `tools/audit-pending/lifecycle-README.md` for reproduction and exact safety boundaries.

## Production request queue: fresh observation, no guessed repair

After the owner renewed sign-in, the production Staff page was checked again on **19 October at approximately 06:47 UTC**. Authentication and the Staff workspace loaded, but the Account & password requests panel still displayed: “Access requests are unavailable. Ask the owner to check the access-request database setup.” This confirms the feature remains unavailable; the message is not evidence of a particular missing table or grant.

Fresh Vercel route-log and error-cluster queries covering the reproduction window succeeded but returned no matching events. The source's generic exception handler does not expose a sanitized SQL cause. An older 17 October log query exceeded retention and was rejected; that is distinct from the successful empty fresh query. Production is still the READY deployment `dpl_7u2Yji4v5cpAbPde4DRq3Ua1LfDw`, SHA `66e82ef04f76b8460654bab4329ccbadfb47f28e`.

No existing production runtime-role database connection was available to this task. A metadata-only, transaction-read-only diagnostic was prepared in `tools/audit-pending/access-diagnostics.sql`, with the operator runbook `ACCESS-DIAGNOSTICS.md`. It checks relation resolution, search path, 19 required columns/types, effective privileges and a constant-false queue projection, returning zero request rows and ending in rollback. It passed local QA validation. **It was not executed in production.** Read-only diagnosis is authorized; a specific production repair still requires a known cause and fresh approval.

## Fresh verification

Environment: Windows, Node 22.23.2, Next.js 16.3.8, installed Chrome 155.0.8059.84, DPR 1, fixed isolated QA. Browser mutation attempts were blocked in the translation verifier. The lifecycle runner used only its separate synthetic cluster. Raw artifacts remain ignored under `test-results/audit-pending/`.

| Check | Result | Evidence and scope |
|---|---|---|
| Final full lint | PASS, 0 errors / 62 existing warnings | `lint-final.log`; rerun after all new harness files were finished. An unused test import found in the initial pass was removed. |
| Unit tests | PASS, 377/377 | `checks.json`, `unit.log`; 12 new summary-contract cases. |
| Preflight | PASS, 12/12 | `preflight.log`. |
| Production build / route type generation / TypeScript | PASS | `build.log`, `typegen.log`, `typecheck.log`. No deployment. |
| Runtime checks | PASS, 403/403 | `runtime.log`; existing real HTTP contracts. |
| Translation API and browser verification | PASS, 39 checks | `translations.json`; record/status parity, payload size, access/cache/record validation, complete editor data, filters, paging, retry and responsive checks. |
| Automated accessibility in changed workspace | PASS, 3 scans with zero violations | Included in the 39 checks, at 1440/390/320 px. Incomplete contrast/ARIA evaluations remain manual-review limits. |
| Canonical browser regression | PASS, 155; 5 intentional skips; no flaky cases | `e2e-final-results.json`; four viewport projects, 164,952 ms. |
| Disposable lifecycle integration | PASS, 46 checks / 151 SQL requests | `lifecycle/run-2026-10-19T06-53-42-920Z/results.json`; matching cluster-stop receipt at 06:53:54 UTC. Actual services/SQL, labelled framework/provider adapters. |
| Protected existing QA data | PASS, 1,658 rows / 13 scopes identical | `preservation.json`; independent before/final read-only hashes. Auth/session metadata is outside these protected row scopes. |
| Read-only access diagnostic | PASS locally | `access-diagnostics-local.json`; 19 columns, read-only transaction and rollback, zero queue records. No production SQL. |
| Independent source review | No blocking regression found | Summary allowlist, canonical review semantics, editor/auth isolation and disposable harness safety reviewed separately. |

Responsive checks used 1920, 1440, 1200, 992 and 768 px widths at 1000 px height, and 512, 390 and 320 px widths at 844 px height. Canonical E2E uses 1440×1000, 768×1024, 390×844 and 320×740. These are browser/emulated viewports, not physical devices.

The first focused test attempt used a request client that did not send the secure loopback browser session; the second used an unscoped alert selector that also matched Next's route announcer. Both harness issues were corrected, failed receipts retained, and the completed 39-check pass is separately recorded. Neither was an application defect. Earlier lifecycle launcher/adapter attempts are also retained locally and are not counted as passes.

The final lifecycle run verifies the exact 24 cache-invalidation adapter calls for six successful publication/withdrawal operations (the affected page, `/journal`, `/` and `/sitemap.xml`), with no extra calls from draft saves or rejected operations. This verifies requested invalidation paths, not real framework cache propagation. The earlier weaker nonempty-call assertion was replaced and the suite rerun in a fresh disposable cluster.

The single approximately 313 ms local summary request is descriptive only: simultaneous E2E execution, loopback and cache conditions prevent using it as a production speed guarantee. The reduction in parsed bytes and parity are the verified improvements.

The canonical E2E log contains two “The destination stream closed early” server notices during navigation, plus terminal-color and external home-directory lockfile warnings. Tested request/runtime guards did not fail; this is not described as an empty server-error log.

### Local visual evidence

Open `test-results/audit-pending/index.html` for the navigable gallery. It includes the preceding verified desktop view as the labelled before image, fresh desktop/mobile after images, and the simulated stale-refresh state. The desktop before/after is primarily a preservation check: the change is data transfer, not a new visual direction. No mobile before image was invented. Raw screenshots and reports are excluded from Git.

## Remaining audit gates

| Pending item | Current status | What is still needed |
|---|---|---|
| Translation-overview initial transfer | **VERIFIED_FIXED locally** | The 6.26 MB overview transfer is replaced with the verified 206 KB projection. Deployment remains separate. |
| Disposable erasure/replay and CMS lifecycle | **Verified within the executed service/handler scope** | Real SQL evidence now exists; browser/HTTP/cache integration, every content variant and full external restore are not certified by this finite suite. |
| Production account/password requests | **VERIFIED_OPEN; database diagnosis BLOCKED** | Execute the prepared metadata-only diagnosis through the existing runtime-role connection; review actual cause before proposing a specific repair. |
| Released mobile performance | **VERIFIED_OPEN** | The local font/video/performance fixes have not been released. Fresh release authorization, exact deployment verification and repeated production measurements are required. Field p75 remains separate. |
| Development-only braces advisory | **DEFERRED** | Fresh official-source review on 19 October found no patched braces release or compatible chain update that removes it. Do not downgrade framework lint tooling just to silence the report. |
| Real storage provider | **BLOCKED** | A disposable provider scope is required to verify actual upload/read/delete/permissions; a fake SDK is not provider acceptance. |
| Native reader, actual zoom and physical devices | **BLOCKED** | Existing-reader restriction and unavailable device/speech observation still apply. Automated scans and browser emulation do not replace them. |
| Real-user field performance / complete moving-background acceptance | **Not certified** | Existing finite contrast/motion evidence retains its scope. Real observations and any incomplete manual rules remain separate. |
| Push / PR / main / release / production repair | **DEFERRED by owner boundary** | Fresh explicit authorization. This task performed no release or production data/publication change. |

The official dependency review used [the braces advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), [braces registry](https://registry.npmjs.org/braces), [micromatch registry](https://registry.npmjs.org/micromatch), [fast-glob registry](https://registry.npmjs.org/fast-glob), and [the current Next plugin manifest](https://raw.githubusercontent.com/vercel/next.js/v16.4.2/packages/eslint-plugin-next/package.json). Braces latest was 3.0.3 with no patched version; micromatch 4.0.8 still requires it. A newer fast-glob still follows that chain. The relevant local dependency is development-only. The maintainer's applicability dispute does not withdraw the advisory; no universal non-exploitability is claimed.

## Continuity

The previous full audit and cleanup reports retain their dated evidence. This report supersedes only their pending translation-transfer and disposable-service-lifecycle statements, and adds the fresh production request observation. It does not turn the original broad audit screenshots into new post-change tests.

Applied the existing clean-code architecture guidance to share one typed projection and preserve domain review rules. Independent reviewers checked summary behavior, dependency availability, production diagnostics and lifecycle isolation. No package, skill, external component, schema or new user feature was installed. The owner may review this local checkpoint before deciding on release and the remaining production diagnosis.
