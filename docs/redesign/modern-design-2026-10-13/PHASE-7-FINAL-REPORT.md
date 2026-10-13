# Phase 7 — final local verification report

Date: 13 October 2026. Branch: `codex/redesign-phase7-verification`. Approved application candidate: `15a0307` (Phase 6). GitHub main was checked read-only and remains `4cadf21b380a8f3753232318fbb78027aa09ffc5`.

**The local verification pass is complete and the candidate is ready for owner report review. No push, PR, merge, publication or deployment has occurred.** Release remains explicitly unapproved. This report distinguishes measured results, earlier unchanged-code evidence and checks that require human/native/production observations.

## What was verified

The current candidate includes the owner-approved Phases 1–6: design previews; motion/media foundation; homepage/shared frame; remaining public families; Studio content/editing; and Studio operations/administration. Phase 7 introduced no application, logo, public asset, content, API, domain, database-schema or dependency change. The only configuration correction excludes generated `output/**` bundles from ESLint source scanning; it does not disable a source lint rule.

Public coverage includes homepage, collections and aliases, search, saved pieces, product/gallery/customizer, commission preparation and review, receipt unavailability, story/process/architect/materials pages, Journal/Portfolio/Testimonials/FAQs, contact, policies and unavailable pages. Conditional unpublished details, all 16 landing block types and utility/receipt states use clearly labelled local specimens where the older QA database lacks published records.

Studio coverage includes all 37 modules, content child editors, translations/review controls, media/crops, saved previews, separate editorial ordering, overview, inquiries/orders/follow-ups, eight-stage training board, navigation, staff, settings, logs, analytics, legacy decisions, import/export, subscribers, sign-in, confirmation cancellation and private printable cards.

## Results

| Check | Result | Scope |
| --- | --- | --- |
| Fresh production build and TypeScript | Passed | Approved candidate, guarded localhost configuration |
| Unit / preflight / HTTP runtime | 344 / 12 / 403 passed | Existing regression suites |
| Full repository source lint | 0 errors, 62 existing warnings | Generated bundles excluded; six previously reported Studio warnings are included in this broader total |
| Registered public URLs | 665 checked | 185 available; 480 known local unpublished drafts; status/destinations unchanged |
| Referenced HTTP assets / extra internal links | 232 / 299 checked | No failures |
| Homepage / edge interactions | 58 / 16 checks passed | Four widths, original slot order/text/media, search/menu/focus, controlled video, locale, no-JS and reduced-motion behavior |
| Public page matrix | 570 checks passed | 30 representative routes at 1440/768/390/320; original DOM text, links and crops retained |
| Static public specimens | 100 checks passed | Ten families at four widths, with concept/fiction disclosures; illustrative controls do not persist |
| Public interactions / focus | 64 / 20 checks passed | Search, shortlist, gallery, form validation/unsaved review, FAQ, filters/pagination, language layout and print |
| Studio matrix / anonymous access | 489 checks passed | 37 modules × four widths = 148 rendered pages; private routes/APIs denied to anonymous sessions; nested navigation/analytics scrolling |
| Studio editing | 35 checks passed | Unsaved cancellation, six product tabs, filters, Gujarati editor, crop preview and exact saved preview |
| Editor states / child coverage | 52 / 36 entries | Child coverage includes ten disclosure-label observations; do not count all 36 as assertions |
| Operational states / previews | 58 / 59 checks passed | Recovery, session-feedback specimen, review dialogs, original brief, print, sign-in and labelled training stages |
| Computed text contrast | 1,462 samples passed | Public 163, editing 686, operations 613; separate 20 focus/label checks above |
| Automated accessibility | 71 scans, 0 detected violations | Installed axe-core WCAG A/AA tags in Chromium; 14 incomplete rule instances still need contextual human assessment |
| Increased text spacing | 7 checks passed | 390px public/Studio layouts with increased line/letter/word/paragraph spacing |
| Public assets | 163 original files byte-identical | Includes original logo and media; all 145 current raster files decoded |
| Rendered media | 52 image instances loaded; both video formats played | Homepage/collection/product/story/Journal; existing MP4 and WebM |
| Print source preservation | 65 blocks retained in six policy PDFs / 15 pages | Every collected prose heading/text block found; representative PDF pages and the private QA inquiry card visually inspected |
| Local performance | 24 samples completed without errors | All observed LCP <2.5s and CLS <0.1; methodology below |
| Protected data | 1,657 phase-start rows unchanged | No protected additions, changes or deletions in Phase 7 |

The protected inventory additionally confirms that **all 1,641 pre-redesign original rows are still unchanged**. The 16 additional rows are the already-disclosed Phase 5/6 synthetic fixtures, retained as before. No original product, translation, draft, contact, business/social detail, crop, media association, order, staff or privacy record was saved by Phase 7. Authentication, audit, session and rate-limit bookkeeping are outside these 13 scopes.

## Performance measurements

Each route/profile has three fresh-browser-cache samples and one repeat visit. Desktop uses 1440px and unthrottled localhost. Mobile uses 390px touch emulation, 4× CPU slowdown, 150ms network latency, 1.6Mbps download and 750Kbps upload. The Next server and its caches may already be warm.

| Page | Desktop cold median / worst | Mobile cold median / worst | Mobile repeat LCP |
| --- | --- | --- | --- |
| Homepage | 0.360s / 0.436s | 1.792s / 1.888s | 0.340s |
| Collection | 0.288s / 0.300s | 1.368s / 1.400s | 0.344s |
| Journal | 0.240s / 0.292s | 1.584s / 1.588s | 0.652s |

Maximum observed CLS was **0.01375** rounded upward. The largest summed observed long-task blocking time was 178ms; this is not INP or a Lighthouse certification. These local measurements do not settle production cold-server variability, third-party network behavior or field Core Web Vitals. Those require the later authorized deployment and real observations.

## Comparison with approved previews

Seventeen image pairs were compared. Fourteen have zero changed pixels under the recorded >24-per-channel difference threshold. Two overview captures are taller because the known Phase 6 QA order was created after the original captures; the current Closed record, stage total and timestamp account for that difference. The remaining 0.005% sign-in difference is confined to native required-field tooltip text, not a changed application element. This corrects the preliminary commentary attribution to a caret.

Current application files and public assets are identical to the owner-approved Phase 6 candidate. Representative full-page views and the newly exposed navigation scroll end were inspected; the recorded source/geometry matches the approved world. This is not individual visual acceptance of all 665 URLs, every nested dialog section or every conditional data combination. The earlier independent Phase 3–6 visual reports and owner approvals remain their original scoped evidence; no new independent-review verdict is invented in Phase 7.

## Findings and limits

1. **Release is on hold for owner review.** GitHub main was only read; no remote branch or deployment was created. A later explicit authorization is required.
2. **Local QA is older than production.** Its 480 registered editorial drafts remain unpublished locally by design. They are not new live outages and must not be bulk-published or copied over production as part of releasing this design.
3. **Axe has 14 incomplete rule instances.** These concern complex-background contrast and video-caption applicability across homepage, product/story/process and several Studio pages. Zero detected violations does not resolve an inconclusive rule. Existing flat-surface/focus samples pass, but the report does not claim full WCAG conformance or infer caption sufficiency from a muted video. Details remain in ignored `output/redesign-phase7/accessibility.json`.
4. **There are 62 existing lint warnings.** The full scan is broader than the six-warning Studio-only scan reported in Phase 6. No source lint error remains. Initial errors came from generated Phase 2–4 bundles; `output/**` is now excluded alongside existing build/experiment output exclusions.
5. **Category pages have ongoing background requests.** Two initial harness navigations timed out waiting for network idle. The final matrix and accessibility retry require rendered DOM/headings with a bounded network-idle wait; all four category layouts and its axe scan passed. Protections and application request behavior were not weakened.
6. **Native/human/real-world evidence remains separate.** No physical-phone, actual 200%/400% browser zoom, screen-reader task, independent Hindi/Gujarati meaning review, creator permission decision, genuine inquiry or field-performance observation was manufactured. Historical owner administrative closure remains recorded as such; this phase does not reclassify it as fresh test evidence.
7. **Print evidence is browser-based.** All collected text blocks are retained and representative renders are readable; this is not a physical-printer test or a tagged accessible-PDF certification. The private QA card remains a saved brief, not an invoice or customer evidence.
8. **The Impeccable detector remains unavailable.** Its earlier Windows `cache_directory_failed` failure is preserved; no fresh detector pass is claimed. There was no application UI edit to recertify in this phase.

Earlier actual mutating tests are intentionally not replayed: Phase 5 proved draft/save/conflict/publish/hide on a synthetic FAQ; Phase 6 proved eight order stages and real editor/admin permissions on new isolated fixtures. Their code and original records are unchanged. The FAQ remains hidden, the QA order Closed, and the temporary editor disabled. No genuine customer message, inquiry or production publication was sent.

## Review package and next step

- `phase7-verification.json`: measured results, performance summaries and 280 PNG/PDF evidence hashes.
- `phase7-preservation.json`: safe aggregate data-preservation receipt.
- `phase7-route-media-coverage.json`: registered routes, linked paths, HTTP assets, raster/video inventory and retained Drive-register reference.
- `phase7-completion-matrix.json`: coverage levels and explicit limits.
- `PHASE-7-PR-DRAFT.md`: reviewable local PR description for a later authorized release.
- `PHASE-7-RELEASE-CHECKLIST.md`: release actions that remain unexecuted.
- `CONTINUE.md` and `experiments/redesign-phase7/README.md`: exact continuation and reproduction instructions.

**Stop here for owner report review.** If the owner later authorizes release, recheck the remote base, create a detailed PR into main, verify checks, merge using the normal repository workflow, and verify the exact deployed commit plus the public site and authenticated Studio. Keep production content and unpublished drafts safe. Scrapers, old-product transfers and backups remain excluded.
