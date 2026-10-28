# Historical claims and remaining evidence gates

Status review at application revision `41cda9c`, refreshed by the Phase 0 inventory, [read-only follow-up](FOLLOWUP.md) and [pending-work closure](../PENDING-CLOSURE.md). Historical reports remain dated records; active conclusions below supersede their broader completion wording. The latest owner scope requires finishing pending Phase 0/1 work before advancing, with no GitHub push/PR mutation.

| Earlier claim | Current disposition | Evidence still required |
|---|---|---|
| All Phases 0–11 complete locally / fully verified | **broken as an acceptance claim**; active root notices withdraw it | Actual provider, application, browser, migration, release and recovery evidence must be reported separately |
| Netlify login secrets/DNS still block hosting cutover | **verified complete only for current hosting availability**; earlier hosting checkpoint is stale | Netlify now serves migration SHA; main/PR/release alignment and the replacement architecture remain pending |
| 28 production tables / synthetic entity totals | **broken as live inventory** | At 17:43 UTC the source has 22 tables / 3,455 rows after owner sign-in added a session; all 20 business-table hashes still match. Six mapped tables are absent, not missing rows to fabricate |
| Source encoding/reconciliation proves migration | **partial** | Source representation passed; actual isolated target commits, readback, conflicts, JSON relationships, checksums and restore are missing |
| Backup manifest proves recoverability | **missing recovery evidence** | Actual encrypted archive, owner access, hash verification, retention interval and tested restore |
| Five Google acceptance checks passed through mocks | **blocked for provider acceptance** | Ordinary editor, owner/API concurrency, real interrupted script/quarantine, independent lease expiry and bounded genuine rate-limit response |
| Google storage adapter exists, therefore application is migrated | **partial implementation** | Zero setter call sites and extensive SQL/Blob coupling; server bootstrap, routes and cross-worker persistence remain |
| 37 Studio routes prove old Studio workflow/design parity | **partial** | Full matrix now maps each renderer; missing routes, limited views and authenticated/browser acceptance remain explicit |
| Scraper jobs/observations in Maps are durable | **broken as persistence claim** | Real bounded source acquisition, canonical observation/job store, durable leases/retries/history/cancellation and reviewed candidate flow |
| Catalogue placeholder registrations/IDs/URLs prove Slides/PDF outputs | **repaired locally; real generation missing** | Previous fabricated registrations/outputs removed; actual editable templates, generated slides, exported PDF bytes, access and retry/readback required |
| Seven width constants prove responsive verification | **broken as browser claim; actual public observations now partial** | 21 real public captures cover all seven measured widths, with documented full-page/lazy-image capture limits. Authenticated and complete responsive acceptance remain open |
| Unconditional integrated/production READY | **repaired locally** | Evidence evaluator now rejects missing/stale/wrong-revision/simulated receipts; independent authentic receipts are still required |
| In-process pause/ledger or a boolean performs cutover/rollback | **repaired locally** | Models are labelled simulation; unimplemented authority changes reject requests; real write fence/final delta/authority switch/recovery remain missing |
| All retained services are free because Netlify is Free | **unsupported** | Netlify account Free confirmed; retained Vercel team reports Pro and nonzero team-wide billed cost records. Project attribution, settled invoice/trial status and current DB plan still require separate readback |
| Source-only canonical Netlify-host redirect is live | **partial** | Default host currently returns 200; the prepared redirect has not been deployed |

Local repair test evidence belongs to commit `41cda9c`: 767/767 unit tests, 12/12 preflight, 663/663 isolated built-server HTTP checks, successful Next build/type checking and lint with 0 errors / 62 pre-existing warnings. These were observed in the preceding local repair checkpoint, not rerun wholesale in this documentation-only Phase 0 turn. HTTP tests intentionally omitted production credentials. They do not certify a Google provider or live authenticated Studio journey.

Fresh Phase 0 evidence includes the source/dependency/old-route inventory, current refs/PR/provider reads, source counts/fingerprints, Blob metadata and 7/7 selected-image/access tests. No new integrated pass is inferred from these narrower checks.

## Blocking and non-blocking gaps

| Gate | Status | Concrete dependency / next action |
|---|---|---|
| Current authenticated Studio observation and visual baseline | partial; current authentication verified | Owner signed in normally; session survived reload. All 36 inspected navigation routes admitted, with existing product search/pagination/review and seven-width geometry observed. Full old/new visual parity and write workflows remain unverified; see authenticated-browser-readback.json. No session extraction |
| Installed Google gateway and secure credentials | partial; signed read path verified | Owner-interface readback verified existing saved source, deployment settings, four registrations and signing-key use. Four signed reads and exact owner-only workbook metadata passed. Original full cloud registry, immutable deployed source and renewable Drive/Slides runtime binding remain distinct gaps; no reprovisioning |
| Source-scale Content capacity | current whole-workbook protocol fails | Source-derived lower bound is 152,446,178 signed bytes against the 8,000,000-byte maximum, excluding additional overhead. Implement and verify bounded reads with retained history under the Phase 1 remediation contract; raising row limits is insufficient |
| Provider safety acceptance | blocked | Requires actual existing sandbox binding, controlled test identities and bounded provider actions; write probes belong to the foundations phase |
| Account/recovery inventory details | partial | Seven retained archives and bounded team-wide billing summaries observed. Google membership is a time-limited Jio offer, not verified ongoing-free capacity. Exact expiry, restore/current coverage, project-attributed charges/trial status and remaining integrations remain unverified |
| Route integration and durable jobs | partial | Source foundations exist; actual current route dependencies are now enumerated for the later implementation phase |
| Migration/media and native catalogue generation | missing | Actual isolated target copy/readback/restore and provider-created Slides/PDF outputs have not occurred |
| New release to GitHub / main | blocked | Latest owner explicitly requires a later push instruction. Read-only inspection does not authorize branch pushes or PR creation/update |
| Production migration/publication/cutover | blocked | Missing replacement acceptance and exact concrete authorization; current SQL/Blob authority stays intact |
| Old-resource deletion/retirement | blocked | Replacement, reconciliation, recovery and exact destructive authorization all remain prerequisites |

No permission question is needed to record these gaps or continue independent local audit work. An unavailable prerequisite must remain unavailable in the report; a timeout, naming match, mock response or elapsed time cannot satisfy it.
