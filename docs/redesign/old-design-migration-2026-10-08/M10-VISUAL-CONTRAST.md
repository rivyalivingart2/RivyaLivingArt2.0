# M10 visual comparison and contrast — 12 October 2026

## Result and candidate

The remaining **104 recorded colour-contrast review targets on 14 routes have explicit dispositions**: 101 applicable targets pass the calculated bound; three decorative, `aria-hidden` category monograms are excluded with their visible category labels checked separately. The lowest applicable ratio is **6.0972392688:1**. The product-gallery dialog also has no confirmed contrast violation or incomplete contrast target.

**Visual comparison remains partially verified.** Thirty Studio opening pairs and eight public opening pairs were assembled and inspected, with two Studio reference captures rejected as unreliable. Nine additional homepage chapter openings were compared using the old homepage already loaded in the browser. This does not establish every section, scroll state, responsive variant or child/editor/error view. The remaining old public navigation began timing out. Preserve these limits instead of converting the screenshot count into full parity acceptance.

Branch: `codex/m10-visual-contrast`, based on local loading-improvement commit `b6d290a039864494c572b76c1ac444701f4ca009`. Final application fingerprint: `a352a269ed90522ab2ebfe86978b807670ddcae55d49ca95ae473084368e9482`. The underlying loading improvements remain included. No new push, PR, production write or deployment occurred. Prior PR48/49 release and the 480 published entries remain separate, completed work.

## Changes

- The full-image homepage hero maintains a dark overlay behind its text, including narrow layouts. A translucent dark plate now backs the image caption and its link.
- Homepage category labels have their own dark backing, so their readability does not depend on the selected image or tile height.
- Our Atelier and Process full-image heroes use a stronger minimum overlay. Their text can remain readable even over an entirely white image.

Only three CSS modules changed. Existing images, videos, crops, text, translations, business/contact details, orders, revisions and publication state were preserved. The work does not replace the current functional base with the old site's products or business facts.

## Contrast method and limits

The final built application was scanned with axe's `color-contrast` rule. Fourteen route scans have zero confirmed violations but return 104 targets that require manual reasoning because of images, gradients, transparent backgrounds or viewport clipping. These are **resolved in the review record**, not falsely reported as zero scanner-incomplete items. Exact selectors, computed foregrounds, conservative backgrounds, thresholds and decisions are retained in `m10-visual-contrast-evidence.json`.

Ratios use the WCAG relative-luminance formula: linearize sRGB channels, apply `0.2126 R + 0.7152 G + 0.0722 B`, then divide the lighter luminance plus 0.05 by the darker plus 0.05. Alpha backings are composited over white for image-dependent cases. Opaque gradients use the componentwise maximum of their stops, a conservative upper bound on background luminance. All text was checked against 4.5:1, including large text. The four play/arrow symbols use 3:1. Values are compared before rounding. See [WCAG contrast minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) and [non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html).

| Surface / conservative backing | Targets | Minimum ratio |
|---|---:|---:|
| Homepage hero text: `rgba(5,12,16,.8)` over white | 5 | 6.0972:1 |
| Homepage caption: `rgba(5,12,16,.88)` over white | 4 | 10.1910:1 |
| Material gradient: brightest channel values of opaque stops | 6 | 8.5532:1 |
| Opaque midnight backing under transparent gradients | 44 | 7.4586:1 |
| Category label: `rgba(8,10,14,.82)` over white | 18 | 10.7060:1 |
| Invitation: brightest radial-gradient stop | 3 | 6.6440:1 |
| Full-image story/process hero: `rgba(8,10,14,.8)` over white | 6 | 6.1725:1 |
| Gallery enlarge control: `rgba(16,23,19,.85)` over white | 1 | 10.3338:1 |
| Analytics: componentwise maximum of opaque gradient | 10 | 14.5554:1 |
| Product/form pagination: brighter badge backing, also conservative for Next | 4 | 14.0273:1 |

The homepage text bounds were checked at 320, 390, 780, 980, 1280 and 1920 CSS pixels, with a 700px viewport height. At widths up to 780px the first text lies below the mobile gradient's 25% boundary; at larger widths all reviewed text remains left of the 74% desktop stop. Thus the .8 minimum is supported by actual geometry, not assumed from CSS alone. No horizontal overflow occurred in these six samples. Every recorded foreground was rechecked against the live DOM after the final build: 104 present, none changed.

The ratio is a bound for these named text/control states, not a certification of every possible future Studio-authored layout. The split-hero variant and every hover/focus/error combination were not exhaustively re-reviewed. The enlarged product-gallery state was scanned separately: zero violations, zero incomplete targets; Escape closed it and returned focus to the Enlarge button. Native 200%/400% browser zoom, screen-reader tasks and physical-device checks remain open.

## Visual comparison findings

The authenticated old Studio reference was available after the owner's sign-in. The current QA site uses its existing local dataset; its draft counts and content differ from production and from the old site. Do not interpret these differences as missing production entries.

The current Studio retains the old dark navigation and blue work panels, with larger controls and the current base's revision-aware editors. The overview uses the display serif; most other current workspace headings use a larger sans-serif where the old workspace uses a smaller serif. This is a recorded visual difference, not newly granted owner approval. Product tables, shared section editors, SEO and research views differ structurally because they operate on the current base's data and publication workflows. Bulk import and subscribers remain prerequisite views; this review did not activate excluded transfers or an unconfigured subscription service.

Initial local loading frames were replaced with completed captures for overview, products, media, research, content gaps, content lab, materials, process, page design, SEO and site images. Content health was separately captured after its saved-record checks completed. The capture helper now reads the live DOM after readiness; stale read-only snapshot metadata must not be used to label a loading view complete.

The old Media Library and Research screenshots contain an implausibly narrow content column after capture/viewport problems. They are retained as **unreliable reference captures**, not diagnosed as old-site defects and not counted as accepted comparisons. Recapture these two before closing their visual rows.

Public opening comparisons cover Home, About → Our Atelier, Process, Large Resin Art → Collectible Design, Shop → Search, Custom Order → Commission, Contact and FAQ. Loaded Atelier and Process captures replace earlier streaming/loading frames. Some old opening imagery remained blurred or unavailable; do not claim image/crop parity from it. The current base's logo, language selector, saved briefs, contact facts and labelled design visualizations remain protected.

Nine homepage chapter openings were inspected: manifesto, featured pieces, large-format/material-partner band, material story, category doors, maker/atelier band, bespoke/journeys, process and closing invitation. The current spacing, band colours, text/image balance and card arrangements differ visibly from the reference. Current large-format content is a material-partner brief rather than the old four-image rail; the current material story uses a split image/text composition instead of the old scroll-driven stages; the current closing invitation is centered. Preserve the comparison as evidence of these differences. It does not authorize copying obsolete facts or mark all variants accepted.

Current-only opening captures additionally cover Journal, Portfolio, Saved Pieces, Privacy, Terms, the unlisted Workshops fallback and the unavailable private-receipt state. The old Journal request timed out and subsequent reference navigation was unavailable. No old/current acceptance is claimed for those seven pairs. The original already-loaded old homepage remained usable for bounded chapter inspection without another request.

## Verification and preservation

- Final production build and TypeScript check: pass.
- Unit suite: **344/344 pass**.
- Isolated built-server suite: **403/403 pass**.
- Lint: **0 errors, 62 warnings**; warnings were not automatically rewritten.
- Fourteen route contrast scans plus the gallery modal: no confirmed contrast violations; the 104 manual targets have the dispositions above.
- Exact original ID/digest maps and counts match before/after in all **13 protected local scopes**. No rows were added, removed or edited by this follow-up.
- `git diff --check`: pass.

The earlier six SQL and six Studio lifecycle groups belong to the preceding loading candidate. They were not rerun or relabelled as fresh evidence for this CSS-only follow-up. The current build and runtime checks are fresh. No hosted performance or production acceptance is inferred.

## Evidence and exact continuation

Sanitized evidence is `m10-visual-contrast-evidence.json`. Screenshots, raw axe results, computed styles and protected digests remain ignored under `test-results/old-design-migration/m10-visual/` and `test-results/old-design-migration/local-m10-visual-{before,after}-*.json`. Logs are `m10-visual-unit.log`, `m10-visual-runtime.log` and `m10-visual-lint.log`. The build succeeded in the command output; there is no separate persisted build log for this run.

Public final screenshots: `home-final-1280.png` and `home-final-390.png`. The comparison sheets are `studio-compare-1..6.png`, superseded where applicable by `studio-loaded-replacements-1..3.png`; `public-compare-1..2.png`, with loaded story/process replacements in `public-compare-pages-loaded.png`; and `home-chapters-1..2.png`. The evidence JSON hashes the local screenshot files. Raw authenticated screenshots must not be committed to the public repository.

Resume without resetting QA data or replaying publication:

1. Restore a working old-reference connection; the owner has already authorized and completed its normal sign-in. Recapture old Media Library/Research and the seven outstanding public pairs.
2. Complete the remaining section/scroll/mobile comparisons and child/create/edit/print/error states against the existing route/section manifests. Record and resolve substantive differences; do not mark all 85 templates / 74 sections accepted from opening screenshots.
3. Retain native zoom, real screen-reader/physical-phone tasks, independent Hindi/Gujarati review, factual/media-rights review and field performance as separate evidence gaps.
4. Preserve both local loading and contrast commits for a specifically authorized release; then verify the exact deployed application and remeasure hosted mobile LCP. Do not replay the 480-entry import or homepage revision 4 activation.

The QA server and isolated PostgreSQL are stopped at handoff, with data retained. Temporary emulations were reset. No scheduled continuation was created.
