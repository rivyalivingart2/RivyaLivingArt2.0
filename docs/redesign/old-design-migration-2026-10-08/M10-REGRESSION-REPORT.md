# M10 regression — 12 October 2026

## Latest follow-up

Read `M10-VISUAL-CONTRAST.md` and `m10-visual-contrast-evidence.json` for the current local candidate `a352a269ed90522ab2ebfe86978b807670ddcae55d49ca95ae473084368e9482`, which includes the preceding loading improvements. Three CSS modules strengthen image-dependent contrast. All 104 named manual targets have explicit dispositions (101 pass, three decorative); fresh build/typecheck, 344 unit, 403 built-server and protected-data comparisons pass, with lint at zero errors/62 warnings. Visual comparison is expanded but still partial, with unreliable/unavailable references and remaining section/child/mobile views explicitly recorded. No new release occurred. PR48/49 had already completed the earlier documented M11 release; the text below is its preceding historical regression report.

## Historical regression candidate

The paused M10 work is resumed. The local candidate passes the engineering checks described below. **M10 full acceptance is not complete:** hosted loading performance, complete visual parity and the independent human/device/field gates remain open. M11 has not started. No new push, PR, deployment or production content change occurred during this resumed work.

M5–M9 activation was already completed through [PR47](https://github.com/rivyalivingart2/RivyaLivingArt2.0/pull/47) on 10 October. Its release receipt records 480 published entries, 120 per section, 21 image references and 63 verified derivatives. Concepts and fictional samples remain labelled. Do not replay those batches. The public homepage and collection were observed again on 12 October; the full 480-page and production preservation checks retain their actual 10 October observation date.

## Changes completed locally

- Studio Page design now lets an editor choose up to three published Portfolio entries and three Testimonials, in explicit display order. The reference homepage renders those choices with the correct concept/fictional labels and a link to the full statement. It never automatically replaces the existing editorial selections or invents attribution.
- Saving captures the exact published text, eligible reviewed translations, media associations and desktop/mobile crops. The saved preview remains fixed when a source changes. A stale source blocks publication; withdrawal removes a record from the public page. Restoring a layout creates a new draft with fresh references.
- The picker exposes loading, unavailable-selection and retry states. It prevents duplicate selections. Hindi and Gujarati interface disclosures were added; this is assistant-authored interface text, not independent native-reader approval. Existing English fallback and unpublished translation drafts remain protected.
- The presentation read begins alongside the initial source/locale reads, avoiding a sequential request on supported pages. Publication freshness checks remain in place; no stale cache or weaker validation was introduced.
- The selected/hovered Studio record status now has readable contrast. The observed old combination was 4.25:1 at small text size; the final browser scan passes after using the light foreground.
- Applied editorial filters have a labelled group role in public and Studio views. The mobile filter trigger is hidden on desktop and visible on phone layouts. The prior shared button style had overridden its desktop visibility.

No new schema, dependency, scraper, product ingestion or backup work is included.

## Verification and preservation

The final application fingerprint is recorded in `m10-evidence.json`. The production-mode build and its TypeScript check pass; edited-source ESLint passes; **344 unit tests and 403 built-server checks pass**. The final isolated homepage lifecycle passes six groups covering anonymous/cross-origin denial, editor/admin separation, exact saved preview, crops/disclosures, stale dependency rejection, publish/readback, restore and withdrawal. Six focused unit cases cover the new selection and capture behavior.

The visible Studio workflow was also exercised: draft 66 → exact preview → public 67 → restore revision 65 into draft 68, leaving public 67 unchanged. These are isolated QA revisions, not production revisions. A later final-build contract creates its own new fixtures and restores the starting QA layout. The earlier UI receipt and final contract are separate evidence.

Every pre-existing row matches in **all 13 protected local scopes**, compared with both the 10 October M10 baseline and the 12 October resume baseline. That includes all 120 products, existing content/drafts/translations, media/crops, business settings and customer/order/history rows. The two final homepage contract runs added only synthetic QA records/staff/history. The sanitized report includes counts; private IDs, hashes, credentials and raw screenshots remain ignored.

Fresh M5–M8 contract runs from 10 October are retained as prior evidence. They are not relabelled as new runs. An initial 12 October build failed because the local PostgreSQL process was stopped; starting the existing isolated database resolved it. No database reset or reseed occurred.

## Browser, visual and accessibility evidence

- **73 final-build automated accessibility scans**, covering 37 Studio routes, 31 public route samples, the unconfirmed workshop state, and additional filter/dialog states. There are **zero confirmed axe violations in those scans**. This is a result for the named states, not all possible states or a WCAG certification.
- **544 settled-page responsive DOM checks:** 68 routes at 1920, 1440, 1200, 992, 768, 512, 390 and 320 CSS pixels, each 900 pixels high. No horizontal document overflow, visible-H1 count failure or missing image alt attribute was found. Meaningful alt descriptions and complete crop acceptance require separate review.
- Studio coverage includes all 30 in-scope destinations from the original 32-module list, plus seven newer workspaces. Catalog Fill and Product Scraper remain explicitly excluded. No import was activated by visiting the prerequisite screen.
- Filter keyboard traversal wraps inside the open dialog. Applying a no-results query focuses its announced result count; Clear filters recovers the listing. Menu Escape/focus-return was observed during the performance samples. These are assistant browser checks, not a human screen-reader task log.
- Video advanced to 7.46 seconds of its 8.04-second duration after deliberate Play; Pause worked. Reduced-motion emulation left the film paused at time zero with `autoplay=false`, `preload=none`, and zero transition duration on sampled controls.
- Hindi and Gujarati language selections and the new disclosure text were observed at narrow widths. The Gujarati footer was visually inspected at 320 pixels. This does not approve the language's meaning or publish previously unreviewed content.
- Four representative openings were compared against the retained 8 October OLDWEBSITE screenshots: homepage, Journal, process and Studio Journal. Display typography, dark surfaces, blue panels and image-led openings are present. Current copy/logo/images and functional-base navigation remain authoritative. Studio's filter/list structure differs from the old tabular view. These comparisons do **not** establish full parity for 85 old templates and 74 section definitions.

Exploratory scans captured streaming/loading frames, including temporary duplicate headings and an empty title. Final evidence waits for the visible loading state to finish. The final scan and layout files are separate from exploratory evidence. Temporary CDP/viewport settings are reset after testing.

Remaining scanner review items are explicitly retained: image/overlay contrast in some public and Studio views, video-caption evaluation, and the empty follow-up table. A scanner's “incomplete” result is not converted to a pass. Native 200%/400% browser zoom, full child/create/edit/print/error-state comparison, actual assistive-technology tasks and physical phones are still unverified.

## Loading and interaction measurements

Profile: 390×844 CSS pixels, DPR1 desktop emulation, 4× CPU slowdown, 150 ms latency, 1.6 Mbps download and 750 Kbps upload. “Cache bypassed” disables the browser cache; it does not guarantee a cold server or CDN. “Warm” enables browser cache after a prior load. These are individual lab samples, not percentiles.

| Environment and route | LCP, cache bypassed | LCP, warm | TTFB, cache bypassed / warm |
|---|---:|---:|---:|
| Local homepage | 2.288 s | 0.472 s | 0.670 / 0.165 s |
| Local collection | 1.536 s | 0.456 s | 0.249 / 0.123 s |
| Hosted homepage, existing PR47 | 7.600 s | 4.940 s | 3.357 / 3.541 s |
| Hosted collection, existing PR47 | 13.884 s | 4.236 s | 10.405 / 2.909 s |

Hosted mobile CLS was zero in these samples. Local homepage cold CLS was approximately 0.00007; the other local samples were zero. The largest observed menu event durations were 80–144 ms. These event samples are **not field INP**. Two accidental desktop-width hosted diagnostic samples, including a slow outlier, remain in the raw evidence and are not silently discarded or labelled mobile.

Local transferred resource totals were approximately 903 KB for the cache-bypassed homepage and 742 KB for the collection. Three Inter font preloads account for roughly 330 KB of raw font files; this is a follow-up budget observation, not proof that removing a font is safe. The new client picker imports the lightweight selection model rather than the server capture/data model. Film bytes are deferred until Play.

The hosted samples **fail the 2.5-second LCP target**, with server response time a substantial contributor. Local results do not prove a hosted improvement. Re-measure the final candidate after an authorized release and investigate database/deployment latency if it persists. The local timing samples precede only the final small contrast/filter-role/visibility fixes; the server performance change is the same. Real-user p75 remains unavailable.

## Reproduce and continue

Use Node 22 and the existing `tools/old-design-migration/run-local.mjs` harness with the pinned PostgreSQL QA target and ignored configuration. Never point it at production or print credentials. The relevant commands after the local environment is running are:

```text
node tools/old-design-migration/run-local.mjs build
node --import tsx --test tests/*.test.mjs
node tools/old-design-migration/run-local.mjs --test tools/frontend-runtime.test.mjs
node tools/old-design-migration/run-local.mjs serve
node tools/old-design-migration/run-local.mjs tools/old-design-migration/m10-home-editorial-check.mjs
```

`RIVYA_MIGRATION_PG_MODULE` must identify the already-installed local PostgreSQL client module. Browser checks use CUA, the current built server, and actual completion of loading states. Accessibility scans use the installed axe-core with WCAG A/AA tags. Record actual `innerWidth` before interpreting emulation evidence. Detailed logs, lifecycle reports, performance samples and screenshots are under ignored `test-results/old-design-migration/`, with precise filenames in `m10-evidence.json`.

Read `M10-CONTINUATION.md` and `m10-acceptance-matrix.json` before continuing. The matrix has all W01–W28 families and all 32 original Studio destinations; it preserves exclusions and unperformed checks rather than assigning a misleading completion percentage.


## 12 October production follow-up

PR48 released the tested candidate and the real Studio published homepage design revision 4. See M11-RELEASE.md and m11-evidence.json for nine additional focused accessibility scans, 26 passing production checks, all-original-row preservation across 13 scopes and four hosted timing samples. The silent film now has a visible associated sequence description; empty inquiry tables are omitted. Analytics gradient contrast is measured at a minimum 14.56:1. Remaining image/overlay contrast, full visual parity, native zoom, human/device/native-language and field evidence stay open. Hosted mobile LCP remains above target. Earlier evidence retains its own candidate and date; this follow-up does not relabel it as a fresh full-suite browser run.
