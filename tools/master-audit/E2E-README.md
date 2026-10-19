# Canonical browser checks against existing isolated QA

## PR #64 browser-error guard correction — 19 October 2026

The shared guard now records both `pageerror` and error-level `console` events, including non-throwing hydration errors. Only exact Chrome resource diagnostics for an explicitly declared URL/status in an intentional 404 or 503 test are exempted; application console errors and unexpected resource failures still fail. Listeners are removed during fixture teardown. A separate real-browser regression verifies console errors, uncaught exceptions, strict resource matching and listener cleanup at all four widths.

Fresh execution against the unchanged final application build `AVszvoAaWRdzkbTXvBAcW`, Node 22.23.2 and installed Chrome: **159 passed, 5 intentional skips, 0 failed, 0 flaky**, no retries, start `2026-10-19T08:43:00.174Z`, duration `170916.595ms`. Raw results remain ignored at `test-results/audit-release-review/e2e-final-results.json`. The earlier attempt was blocked by sandbox loopback access before tests ran; the authorized unrestricted-local retry passed. Server navigation can still log the previously disclosed destination-stream-close notice; this is not a claim of an empty server log. Focused E2E lint and application TypeScript checks also passed. Older result counts below retain their dated scope.

---

For a separate local follow-up, set `RIVYA_E2E_REPORT_ROOT=test-results/audit-followup-cleanup`. The optional value accepts exactly one lowercase alphanumeric/hyphenated folder below `test-results/`; traversal, absolute paths and nested paths are rejected. Reporter output, screenshot/trace output and the read-only public fixture writer/reader share this location. Omission retains the original master-audit folder. This changes evidence storage only; all isolated-QA and blocked-write guards below remain.

The former suite started a published-content server with an empty database URL. On 17 October 2026 its existing desktop home check returned HTTP 500 (`Studio storage is not configured`) before any visual assertion. Evidence is local in `test-results/rivya-master-audit/e2e-before/` and `e2e-before-retry.log`. This was a test-environment failure, not evidence of a production outage.

The repaired suite exercises current published catalogue contracts. It does not recreate the superseded sample catalogue, provision a database, seed records, authenticate staff, send messages, or publish content.

## Preconditions and run

1. Use the project's Node 22 runtime, version 22.16 or newer.
2. Have an existing local production build matching the source being checked (`npm run build`). Do not rebuild while another check is using that build.
3. Have the already provisioned isolated QA environment at `test-results/old-design-migration/.env.qa`, with its expected fixed loopback database available. Never copy production credentials into this file.
4. Set `RIVYA_MIGRATION_PG_MODULE` to an existing absolute path to the local PostgreSQL adapter's `pg/lib/index.js`, and set `RIVYA_E2E_ISOLATED_QA=1` explicitly.
5. Optionally set `RIVYA_BROWSER_EXECUTABLE` to the existing Chrome executable. No browser or package installation is required when that browser is available.
6. Run `npm run test:e2e` using Node 22 in PATH. Run outside a Vercel deployment and outside an enclosing `run-local.mjs` process.

For example, after setting the environment variables above:

```powershell
npm run test:e2e -- --project=desktop-1440 --grep 'home: responsive'
npm run test:e2e
```

`--list` can inspect the tests without a running database or the explicit opt-in. Do not override `--output`: sanitized fixture descriptors are intentionally located inside the configured result child directory.

The configuration owns port 4173 and does not reuse any listening server. It invokes the existing `tools/old-design-migration/run-local.mjs` guard, which validates both the configured target and actual database identity before starting Next.js. It leaves the owner's preview on port 4199 alone. An occupied port is an error; do not stop another process to bypass it.

The setup checks the fixed host `127.0.0.1`, port `55439`, role `rivya_migration_qa` and database `rivya_migration_local` inside an explicit read-only transaction. It reads only published public product/media descriptors and validates them through the application's existing product and media validators. It requires representative records already present in all three collections and enough records for incremental loading. Missing prerequisites fail clearly instead of manufacturing production-like content.

## Write and evidence boundaries

- Browser requests are restricted to the owned `http://127.0.0.1:4173` origin. All unexpected non-GET/HEAD requests fail the test.
- Opening a customization form normally prepares an inquiry session with POST. This read-only suite intercepts only that exact session endpoint and returns a documented 503. It checks the unavailable-saving UI and temporary input behavior. It does **not** prove inquiry persistence, recovery, uploads or WhatsApp delivery; those belong to the separate isolated workflow tests.
- Saved pieces use the browser's temporary local storage, not database records. Staff checks here cover unauthenticated redirection and the sign-in surface only.
- Raw screenshots, traces, JSON results, HTML reports and public fixture descriptors stay below ignored `test-results/rivya-master-audit/`. Playwright may replace only `e2e-final/` and its own reports. The configuration no longer uses the broad `test-results/` as its output directory.
- No fixture includes staff credentials, sessions, private/customer data, private media URLs or database credentials. Do not attach raw evidence to GitHub.

## Coverage migration

There were 39 original cases per project. The replacement retains their meaningful current behavior in 39 cases and adds a fortieth saved-pieces recovery case. Four projects cover 1440×1000, 768×1024, 390×844 and 320×740. Five mobile-navigation cases are intentionally skipped only above the actual 1100px mobile-header breakpoint. This suite uses reduced motion for stable layout and keyboard checks; cinematic motion-state coverage remains in the separate master audit.

| Original coverage | Current test contract | Treatment |
|---|---|---|
| Seven home, collection, detail and Studio preview routes | Current published routes, headings, decoded media, one main landmark, overflow and screenshot checks; Studio redirects to sign-in | Preserved; obsolete preview banner and sample headings removed |
| Collection/detail journeys | Actual rendered product, breadcrumb and collection/footer links | Preserved |
| Three unknown route forms | Actual 404 status, current unavailable-page heading and recovery link | Preserved |
| Reduced-motion transitions and hover transforms | Shared canvas reduced-motion state, paused videos and inactive cursor-card lighting | Updated to current motion system |
| Five mobile menu focus/escape/route/resize cases | Drawer bounds, forward/reverse Tab containment, Escape/Close focus and scroll restoration, collection navigation, Our Atelier route, desktop resize | Preserved; centered-modal assumption removed; former `#atelier` anchor is now the published `/our-story` destination |
| Furniture local typography | Distinct loaded display/body font families | Preserved |
| Furniture pagination and browser Back | Incremental catalogue loading, preserved first records, uniqueness and browser Back | Preserved; numbered sample pagination was replaced by the current incremental control |
| Furniture invalid URL controls | Invalid/repeated category/collection/sort/page-size/show values normalize safely | Preserved for current URL model |
| Furniture category/material/size reload and Back | Current search/category/page-size reload, Back and reset | Replaced superseded sample-only material/size facets; product customization still checked separately |
| Furniture category links | Published category selections and rendered product destinations | Preserved without assuming sample seating/installations records exist |
| Furniture name/width/sample-price sorting | Ascending/descending names, actual result order and retained sort while loading more | Preserved supported sorting; sample width/price options are intentionally absent in request-only catalogue |
| Furniture empty results and keyboard filters | Accessible reset, zero product cards, Enter/Space disclosure | Preserved |
| Furniture sample finish radios | Current customization select, explicit save-unavailable state and non-persistence on reload | Preserved local-choice semantics; no claim of storage success |
| Furniture image zoom | Actual multi-image published fixture, decoded zoom, Tab containment, Escape and focus/scroll return | Preserved |
| Furniture missing sample visual | Forced primary-image failure retains product information, customization destination and a working retry | Reproducible current failure state, without creating a missing-media record |
| Furniture forced image failure | Failed catalogue image presents honest fallback and valid product link; gallery failure is covered by previous case | Preserved across both surfaces |
| Two art collections: four cases each | Published cards/pagination or page-size boundary, safe repeated URL normalization, name order/request-only price labels, keyboard filters/empty reset | Preserved; obsolete six-study counts and price sort replaced by current published contracts |
| Memory occasion/preservation facets | Current category/search reload, Back and reset | Replaced removed sample-only facets; preservation detail text remains checked |
| Personal recipient/colour/festival facets | Current category/query chip removal, query preservation and reset | Replaced removed sample-only facets; customization choice remains checked |
| Memory preservation detail/guidance | Current preservation text, keyboard care disclosure, same-collection related products and process guide | Preserved |
| Personal local variant/reload | Current select choice, stable product image, explicit save-unavailable state and reload reset | Preserved without persistence or message sending |
| No original saved-pieces case | Save a published piece, reload saved list, clear list and verify empty recovery | Added browser-local regression coverage |

## Executed verification — 17 October 2026

After the audit's final application build, the complete run started at `2026-10-17T06:12:59.228Z` and finished in `238482.06ms`: **155 passed, five intentionally skipped, zero failed, zero flaky**, exit 0. No retries were configured. Node 22.23.2 and the existing Windows Chrome executable were used with two workers and DPR 1. Mobile projects used touch/mobile emulation; this is not physical-device evidence.

| Project | Viewport | Passed | Skipped |
|---|---|---:|---:|
| desktop-1440 | 1440×1000 | 35 | 5 mobile-navigation cases |
| tablet-768 | 768×1024 | 40 | 0 |
| mobile-390 | 390×844 | 40 | 0 |
| narrow-320 | 320×740 | 40 | 0 |

The read-only fixture transaction validated 120 published public records already in isolated QA: 84 furniture, 24 memory and 12 personal pieces. The run saved 59 screenshots. Every executed case passed its unexpected-request and uncaught-browser-error guards.

Local evidence:

- `test-results/rivya-master-audit/e2e-final-run-2.log`
- `test-results/rivya-master-audit/e2e-final-results.json`
- `test-results/rivya-master-audit/e2e-final-report/index.html`
- `test-results/rivya-master-audit/e2e-final/`

The first repaired attempt stopped in global setup before running tests because Playwright's loader did not support the application's existing JSON-backed source-model import. The fixture reader now runs with the already installed `tsx` loader in a child process. That failed attempt remains in `e2e-final-run-1.log`; it is not counted as a browser pass.

The passing run's server log includes five `The destination stream closed early` notices around navigation/reload activity. No tested page response or uncaught browser error failed, and no user-visible defect was established from these notices. They are retained as diagnostic evidence, not silently represented as clean server logs. The owned port 4173 listener was absent after completion.

Physical-device, native screen-reader, full-motion-state and field-performance acceptance remain separate from this browser suite. The broader audit's `FINAL-VERIFICATION.md` reconciles those gates and the complete source/build evidence.

## Executed verification — 19 October 2026, after dependency patches

The complete canonical suite was rerun against the coordinator's rebuilt local candidate with Next.js 16.3.8, Sharp 0.35.5 and source-map-js 1.2.2, using Node 22.23.2 and the installed Windows Chrome 155.0.8059.84 executable. It started at `2026-10-19T05:36:12.443Z` and finished in `176419.625ms`: **155 passed, five intentionally skipped, zero failed, zero flaky**, exit 0. No retries were configured. The four viewport projects and five desktop-only mobile-navigation exclusions remain as documented above. All executed tests passed their unexpected-request and uncaught-browser-error guards; 59 screenshots were saved.

Before the rerun, the previous `e2e-final/` and `e2e-final-report/` directories were copied to `test-results/rivya-master-audit/checkpoint-2026-10-17/`. The historical JSON receipt and logs were already preserved there. The canonical current receipt is `test-results/rivya-master-audit/e2e-final-results.json`; the new execution log is `e2e-final-run-2026-10-19.log`, with the HTML report at `e2e-final-report/index.html`.

The fresh log retains **two** `The destination stream closed early` notices during navigation/reload activity, terminal-color environment warnings, and a Next.js warning that a home-directory lockfile outside this Git repository was ignored. These are disclosed diagnostics; the run is not described as having an empty server-error log. No corresponding tested page/request or browser-error guard failed. After completion, a listener check confirmed port 4173 was released and the owner's separate preview on 4199 remained running.

This rerun made no application changes, production requests, database fixture writes or releases. The explicit isolated-QA, read-only fixture and blocked-write boundaries above remained enabled. Browser-emulated layouts and keyboard tasks still do not supply native-reader or physical-device acceptance evidence.
