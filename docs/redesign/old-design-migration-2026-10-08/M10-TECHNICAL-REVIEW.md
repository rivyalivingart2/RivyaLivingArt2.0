# M10 application and artifact review — 12 October 2026

This is a second-pass source/artifact review of the current local candidate. It is not production verification, native-browser zoom, a screen-reader session, a physical-device test, a human language approval or a genuine customer interaction. No protected content, database records or publication state were changed by this review.

## Findings and validation conditions

1. **Print disclosure contrast defect resolved in the rebuilt candidate.** In both initial care print captures, the “Design visualization” label was black directly over a dark photograph. The added print-only caption rule supplies a solid white backing, black text and padding while retaining caption positioning. The final `care-print-caption-verified.png` was independently opened and inspected: the caption is fully visible and readable inside its white rectangle. This resolves the observed disclosure-contrast defect in the captured Chromium print-media view; physical print output and other browsers remain separate.
2. **Do not describe the translation packets as automatically protected against historical source drift.** All hashes and exact field mappings checked below pass, and the README correctly requires a current-source comparison. However, the compatible Studio packet contains only `documentId`, `locale` and `fields`; its `sourceHash` lives in the sidecar manifest. `reviewTranslationImport()` therefore does not compare the October 6 English source hash. The existing editor guard detects source/target edits after a dry run; it does not by itself reject a packet prepared from an older source. A subsequent [read-only production freshness check](M10-LANGUAGE-FRESHNESS.md) established exact current English matches for all 34 articles, but all 68 target maps are empty. Recheck immediately before later application; the historical target before-values are not the current production baseline. No import was performed.
3. **Hosted cold loading still needs equivalent after evidence.** The candidate's three local samples per route meet the 2.5-second lab target, but their local document response times differ from the hosted baseline. Do not present the local measurements as a measured production improvement or as real-user field performance. Repeat the same hosted cold protocol after an authorized deployment before closing that gate.
4. **SF04 fixed skip-link print overlay resolved with final PDF pixels.** The intermediate PDFs exposed a fixed “Skip to main content” box covering the film disclosure and part of a care paragraph. Global print CSS now hides only this navigation link. The regenerated `home-print-clean.pdf` page 9 and `care-print-clean.pdf` page 1 were rendered and independently inspected: both disclosure lines and the complete care paragraph are unobscured. The poster and white caption backing remain intact. This closes the observed PDF overlap; physical printer output remains separate.

No additional correctness defect was found in the examined application diff. This is a bounded review of the files and evidence below, not blanket acceptance of the full site.

## Application diff examined

| File | Verified behaviour and limit |
| --- | --- |
| `next.config.ts` | Image candidates add 420 and 512 pixels without removing an existing width, changing source media or crops, or changing allowed paths/qualities. The retained local homepage trace selects a 420-pixel hero at the measured viewport. |
| `src/app/layout.tsx` | Inter common-face preloads are disabled; the same faces still load through CSS with `display: swap`. The existing full-face Arial metric fallback and Instrument Serif/JetBrains declarations remain intact. No request/data cache, auth or publication logic changed. |
| `src/styles/fonts/inter-common-{400,500,600}.woff2` | Independently checked against the original full Inter files and the generated report as detailed below. |
| `src/components/shop/material-film.tsx` and `material-film.module.css` | The original screen poster is requested near the video using an 800-pixel observer margin or an explicit Play action. Existing source files, native controls, deliberate playback, offscreen pause, visibility pause and still-image error fallback remain. Both observers and the visibility listener are cleaned up. The CSS reserves the frame aspect ratio. The later print-only `picture` supplies the original still through a `media="print"` source, with a data-URL GIF fallback on screen; its print CSS hides the video and Play control. This fixes printing before the video reaches the viewport, verified by actual PDF pixels below. The screen video poster still depends on hydration; no JavaScript-disabled screen presentation is asserted. |
| `src/components/shop/reference-pages.module.css` | The print-only rule exposes native details contents and removes interactive plus toggles without changing screen accordion behaviour. Before/after screenshots establish the result in the captured Chromium print-media view, not physical printing or every browser's pagination. |
| `src/components/shop/editorial-reading.module.css` | The later print-only figcaption rule overrides the generic transparent-background reset with a white backing, black text and padding. It preserves the existing position and has inspected final screenshot evidence. |
| `src/components/studio/inquiry-card.module.css` | A scoped two-pixel dark focus outline with four-pixel offset replaces reliance on the weak global bronze indicator. It does not alter the saved inquiry, printed content or navigation target. |
| `src/components/studio/workspace.module.css` | The final mobile crop repair lets Desktop/Mobile preview buttons wrap into full-width rows and keeps their words intact. Below 640px, only the selected landing-block fieldset (`content-field-block-…`) and its nested panels use 8px horizontal padding, recovering space lost to four nested panel layers. Both scoped padding selectors override the later general 18px mobile shorthand by specificity. Vertical padding, desktop presentation, stored crops, image associations and handlers remain unchanged. Source inspection and the final build/runtime checks support the repair; rebuilt pixel acceptance belongs to the separate conditional-editor evidence. |
| `src/components/studio/content-register.tsx` | The later copy/display change identifies intake metadata as historical, explains connected-Studio totals, and avoids displaying historical row status as a current saved record when no editor record is available. Intake, filtering, paging and publication request logic are unchanged. This source review does not itself claim the updated browser workflow was tested. |
| `src/app/globals.css` | The final `@media print` rule hides `.skip-link` with `display:none!important`, without changing its screen focus behaviour. Final PDF pixels confirm it no longer covers printed text. |
| `tools/old-design-migration/split-inter-fonts.py` | Derives subsets from the retained originals, keeps layout-feature closure/names/hints, verifies shapes and metrics, writes the narrowed CSS ranges, and emits a new core report without overwriting the historical split report. Timestamp recalculation is disabled for repeatability. |

The public CSS import inspection did not establish a Studio workspace CSS leak. No speculative stylesheet removal or freshness-reducing cache was added.

## Independent font verification

Read-only FontTools verification was rerun against the final on-disk binaries, rather than accepting the generation report's booleans alone. All source/target byte lengths and SHA-256 hashes match [m10-font-core-split.json](m10-font-core-split.json). The two `unicode-range` strings in `layout.tsx` exactly match that report and do not overlap.

| Weight | Original codepoints | Common codepoints | Retained glyphs compared | Final common bytes |
| --- | ---: | ---: | ---: | ---: |
| 400 | 2,849 | 407 | 892 | 35,912 |
| 500 | 2,849 | 407 | 892 | 37,028 |
| 600 | 2,849 | 407 | 892 | 37,012 |

For every retained glyph at all three weights, decomposed drawing commands and horizontal metrics match the original. Units per em, hhea ascent/descent/line gap, OS/2 typographic ascent/descent/line gap, x-height and cap height also match. The common plus complementary ranges cover every original codepoint. Combining marks and current interface symbols remain in the common set; the unchanged complete face supplies the other glyphs.

The three common files total **109,952 bytes**, a reduction of **46,908 bytes** from the previous common subsets' 156,860 bytes. The license remains at `public/fonts/licenses/inter-OFL.txt`. Binary verification establishes preservation of the retained shapes and metrics; it does not independently establish every script's browser shaping or a production loading target.

## Independent translation-packet verification

The offline candidate set was checked without importing it or rerunning its writing builder. The historical English source SHA-256 is `0a5f935fde9634e9aa4d5b840108ab3a0f8f7ac262b8f8302f7af9b7b03ecd08`, matching the recorded verification. All 34 article source hashes and candidate-fields hashes match. All **68** import file hashes and exact path/value mappings match their sidecar manifest; the packets contain no extra routing, media, contact, product or approval keys.

The review contains **462 source fields / 924 target values**, with **200 changed values**. English source strings and existing numeric sequences are unchanged. Every record retains `NEEDS REVIEW`; independent Hindi/Gujarati approvals remain false, and every import-manifest approval flag remains false. The existing Studio code resets reviewed state when applying draft text and rejects protected/unknown import paths.

These artifact checks establish integrity and the described editor safeguards. The subsequent production snapshot is documented separately in [M10-LANGUAGE-FRESHNESS.md](M10-LANGUAGE-FRESHNESS.md). Neither check is an independent semantic audit, native-reader approval or permission to publish. Follow the freshness procedure in [the packet README](../../editorial-translations/m10-followup/README.md) and the separate [language review](M10-LANGUAGE-RIGHTS-REVIEW.md).

## Contrast and image inspection

The WCAG relative-luminance calculation uses normalized sRGB channels, the 0.04045 transfer-function threshold, and `(lighter + 0.05) / (darker + 0.05)`:

- `#29261f` against `#fffdf8`: **14.84752347473118:1**.
- Previous bronze `#b89b63` against `#fffdf8`: **2.6126412665033234:1**.

The first pair exceeds both the 3:1 non-text indicator target and 4.5:1 normal-text target. The local `inquiry-card-focus-after.png` was actually opened and inspected: all four edges of the Return to saved record focus ring are visible; the synthetic saved-card content is readable and unclipped in that captured view. This does not establish every keyboard path or responsive size.

The care before/after images were also actually opened and inspected. The before image shows closed headings with no care bodies; the after image shows the first paragraph and the beginning of the next section with the plus toggles removed. The screenshot is a viewport excerpt, so it does not prove that every paragraph appears in a full print document. The coordinating agent additionally observed all six care details still closed in DOM state while their `::details-content` print content-visibility was visible; the two hidden shared-shell details were expected exclusions.

The final caption proof, `care-print-caption-verified.png`, has SHA-256 `09ac4c30e52908747fcce82b07a977e50d144c682855c41917508caec4a22631`. Its black disclosure text on a solid white rectangle is visible at the bottom-right of the image. CSS print-media evidence is not a physical printing receipt.

Local evidence lives in the ignored `test-results/old-design-migration/m10-completion/` folder. No real customer information was needed for the synthetic card inspection.

## Actual PDF pixel follow-up

The PDF skill was used for read-only review. Bundled `pypdf` identified relevant pages, and bundled Poppler rendered the full relevant pages to PNG at a 1,600-pixel long edge. The resulting pixels were actually opened and inspected; text extraction and image `naturalWidth` were not treated as visual proof.

| Actual PDF | SHA-256 | Pages inspected and observed result |
| --- | --- | --- |
| `m10-full-reference/local-home-film-print-unscrolled.pdf` | `56571e313dea88462498c318cbfe7db951aad6c7ad84c39c1fe1858fbf292597` | Baseline, 22 total pages. Pages 9–10 show the film title/Play button, then a blank native-video rectangle with 0:00 controls. The blue/gold poster is absent. |
| `m10-full-reference/local-home-film-print-fixed-unscrolled.pdf` | `4cf68902afa66965f916997930f67b497f41db9d19dfd3bf92f0fb4ccba72a40` | Intermediate poster-fixed candidate, 21 total pages. Page 9 contains the actual blue/gold resin-pour poster, film heading and disclosure; video/Play controls are absent. The poster defect is fixed. Its separate skip-link overlap prompted SF04 and is superseded by the clean PDF below. |
| `m10-completion/care-print-default-background.pdf` | `19171d9af03e091cd717cbcf6045b2f4f2bb2fec711d76b0637073ce30a2d91f` | Three total pages, generated with print backgrounds disabled. Page 1 retains the white backing and readable black “Design visualization” caption over the photograph. Care text is expanded. The separate fixed skip-link box overlaps text in the second care paragraph. |
| `m10-completion/home-print-clean.pdf` | `ecfce2d58a537d9d3a748e0e517ba349050e2afe3a4cdff253d2f403911e3d0e` | Final skip-link-fixed candidate, 21 pages. Page 9 was rendered and inspected: the poster remains visible and both full film disclosure lines are unobscured. No navigation box or video controls cover the content. |
| `m10-completion/care-print-clean.pdf` | `6f6b57ac670680018bf4526e027101572d34b968d4ab685c038e19f2ead8b331` | Final skip-link-fixed candidate, three pages, with print backgrounds disabled. Page 1 was rendered and inspected: “Colour in context” is fully readable, its final line has no overlay, and the image's black-on-white disclosure caption remains visible. |

Paths above are relative to `test-results/old-design-migration/`. Rendered evidence is `m10-full-reference/pdf-review-film-before-09.png`, `pdf-review-film-before-10.png`, `pdf-review-film-after-09.png`, and `m10-completion/pdf-review-care-background-off-1.png`.

The final inspected renders are `m10-completion/pdf-review-home-clean-09.png` and `m10-completion/pdf-review-care-clean-1.png`. Supporting text extraction finds zero “Skip to main content” occurrences across all 21 final homepage pages and all three final care pages. That whole-document text check supports the scoped page-pixel review; it is not a claim that every PDF page's layout was visually audited.

The visual-review agent's capture metadata establishes the valid final homepage PDF was generated at fresh scroll position zero. Before print, no offscreen poster/video network resource was observed; when print media applied, the `picture` selected the original poster with natural width 1,280. Source review is consistent: the screen fallback is an inline data GIF, so it requires no poster HTTP request, while the print media source names the actual poster. The actual PDF supplies independent confirmation that the chosen print image rendered. The earlier `local-home-film-print-fresh.pdf` is excluded because its reload retained scroll and cannot prove fresh unscrolled printing.

These are actual browser-generated PDF results in the captured Chromium setup. They are still not physical printer output, and only the named pages were inspected.

## Loading evidence reviewed

The raw `local-{home,collection}-after-{1,2,3}.json` samples were independently read:

| Route | LCP samples, milliseconds | CLS samples | Final response headers, milliseconds |
| --- | --- | --- | --- |
| Home | 1,132; 1,156; 1,360 | 0.0001899652 each | 166.7; 196.1; 205.9 |
| Collection | 1,296; 1,172; 1,236 | 0 each | 313.5; 261.5; 215.0 |

The hosted before traces are 3,852 ms for Home and 2,316 ms for Collection in this run. Earlier slow samples remain relevant; the newer Collection sample does not erase them. In the Home hosted trace, the first `responseStart` belongs to interim response handling, while `finalResponseHeadersStart` is approximately 1,169 ms. Using the earlier value as final TTFB would misdiagnose the critical path.

These local samples support the candidate scheduling changes without showing a harmful CLS increase in those runs. Different host response times and transport conditions preclude treating their numerical difference as a controlled production before/after result.

## Verification boundary and continuation

The final crop candidate received a fresh run of the existing built-runtime suite on 12 October 2026: **403 passed, zero failed, cancelled or skipped, in 12.912 seconds**. The command was Node 22 `--import tsx --test tools/frontend-runtime.test.mjs`. It uses the existing build and temporary localhost child servers with database, blob and Studio credentials explicitly blanked; it does not run against production or exercise browser hydration/layout. The coordinating agent's running QA server on port 4199 and the build were not changed. The raw receipt is `test-results/old-design-migration/m10-completion/runtime-crop-final.log`.

The initial restricted attempt could start Next but could not reach localhost. A direct read of the already-running QA server confirmed `TypeError` with cause `EACCES`. That attempt was stopped, retained as `runtime-crop-sandbox-denied.log`, and the unchanged suite then passed with approved localhost access. This environmental failure is not counted as an application failure or silently substituted for a passing result.

Focused ESLint passed with zero errors or warnings for `next.config.ts`, `src/app/layout.tsx`, `src/components/shop/material-film.tsx` and `src/components/studio/content-register.tsx`; its zero-output receipt is `lint-crop-final.log`. `git diff --check` also passes. ESLint does not validate CSS layout. The final source review found no additional correctness defect in the scoped crop selectors or print skip-link rule. No build, browser, server-configuration change, protected-snapshot comparison or database operation was performed in this final check.

The tested build ID is `nUFt1233j12QbfO17chdt`, based on `cd0fdd4000013ab71fc23318f433e9b0c32e0fa8` plus the recorded local follow-up changes. `candidateFingerprint()` reports application SHA-256 `f8ddc675b9dc12d9090c260b667105ef994e6fae36ba48283ee86ad489daa20b`. The coordinating agent owns the separate build/type/unit and rebuilt browser receipts. Subsequent application changes require checking which evidence remains applicable.

The print caption contrast, unscrolled-film poster and SF04 fixed skip-link overlay defects are repaired and have final actual PDF evidence. Retain current-source conflict checks before any translation import and capture hosted after performance under the same protocol. Keep human language review, provenance/permission evidence, real assistive/device checks and field acceptance separate from this technical evidence. The subsequently observed CrUX origin/Phone no-data result is recorded in [M10-FIELD-EVIDENCE.md](M10-FIELD-EVIDENCE.md); it does not close field-performance acceptance.

## 13 October final print follow-up

Root rendered and inspected all 21 pages of home-print-clean.pdf and all three pages of care-print-clean.pdf. Home content remains readable with its continuous screen-style pagination; image and section breaks are not claimed to be a redesigned print layout. The final care-page action revealed a pale label with backgrounds disabled, caused by the shared important button colour overriding the print wildcard. A scoped printable-prose link rule now renders it black on white (21:1). The actual regenerated care-print-final-contrast.pdf page 3 was inspected and its two links are readable. The earlier care PDF remains baseline evidence.

Final application commit a2a760c93a7fa02aa36a5ef9f673a185f3dd142c; committed-source fingerprint c135d928c7e153fc0781add6aebdb0e3beaef614c01f56ca138a095459e491b4; Windows-byte fingerprint 16b03f2615313af03992d2a01a54559b986a69c9a0dcec8fc233795bc5749f12. All 539 differences among 580 files are CRLF-only. Fresh build/type verification passes (build-print-final.log), followed by 403 runtime checks, zero failures, in 12.033s (runtime-print-final.log). The unchanged unit logic retains its prior 344 passing tests. Hosted performance and the explicit external acceptance gates still require their own evidence.

