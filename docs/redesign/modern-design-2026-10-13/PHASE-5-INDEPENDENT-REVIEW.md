# Phase 5 independent finish review

Date: 2026-10-13. Scope: local Phase 5 Studio content and editing changes relative to `157ea4b`.

**disposition: fix**

Fresh full review of the source, direction and supplied browser evidence found one material mobile readability issue, F1 below. This disposition concerns the local Phase 5 preview candidate. It neither authorizes release nor starts Phase 6.

Capture history: the initial packet lacked canonical full-page images, so the reviewer returned `recapture` with no binding findings. The builder supplied 12 full-page images at 1440/390 from document top, without changing UI. One media image was then replaced after offscreen thumbnails decoded. The reviewer opened all 12 canonical images and reopened the corrected media file, whose previously blank DP013 thumbnails are now visible. The evidence now supports this fresh full review.

## persistence

The implementation is present in application source. `studio-editing.module.css` defines the authoring treatment; `workspace.tsx` adds the shared shell and restricts body opt-in to the explicit 24 Phase 5 workspace keys. Examined editor edits primarily add styling hooks. Existing selection, saving, publication, translation, revision and recovery handlers remain in the examined diffs. The original horizontal logo file is used with ivory backing and no recoloring.

The safe preservation receipt `phase5-preservation.json` reports all **1,641 original rows unchanged across 13 inventoried local QA scopes**. Its only additions are one clearly labelled synthetic FAQ and four associated revisions. `output/redesign-phase5/lifecycle.json` records ten checks for the separate actual draft/save/conflict/publish/hide/preview workflow; that QA fixture ends hidden. These are inspected receipts, not database operations rerun by this reviewer. They support preservation within their local inventory; they do not certify production data, session bookkeeping or human translation review.

Direction and incumbent authority are discoverable at `experiments/redesign-phase5/DIRECTION.md`, `experiments/redesign-phase3/DESIGN.md`, and the Phase 4 comparison report. The lack of root DESIGN.md does not erase that authority. Historical Phase 2 wording in PRODUCT.md remains declared drift. The documentation handoff should describe an ordinary extension and preserve incumbent authorities.

## fidelity

The candidate substantially fulfills the code-led Operate direction. Original-logo identity, obsidian/ocean surfaces, ivory text, champagne focus and sapphire selection carry the approved palette into Studio. Compact navigation, workspace breadcrumb and restrained sans headings identify the active task. Product rows show actual existing imagery beside identity; journal rows keep titles, routes, revisions and publication information aligned.

Desktop/mobile product and editor captures show readable field grouping, separated record status and retained save/publish/recovery actions. Article and expanded Gujarati views retain English source comparison, missing/review state and manual review controls. The long mobile Gujarati and sections captures were also inspected with original-detail setting alongside native-scale supplemental views. Empty Gujarati fields correspond to the visible missing-state record. No native-language acceptance is inferred.

The signature flow is supported by source and separate interaction/lifecycle receipts: select a record, inspect its revision/publication state, edit, review and deliberately save. Unsaved navigation cancellation, product tabs, page finder, mobile navigation, crop switching and exact saved preview are represented in 35 interaction checks. State gallery images explicitly identify synthetic fixtures, so they provide visual state evidence only; the actual synthetic FAQ lifecycle supplies separate persistence evidence.

The reviewer read 360 workspace checks covering 24 workspaces with zero reported issues, 52 state/contrast checks with 686 computed samples, 36 child-editor/responsive checks, and the full-page receipt. Representative state, crop, product-image, page-finder, 320/768 responsive, child-editor and saved-preview images were opened in addition to all canonical captures. These records support the scoped review; they are not a fresh accessibility certification. F1 remains visible despite the absence of document overflow.

Saved public preview wiring opts non-homepage bodies into Phase 4 treatment while homepage retains its Phase 3 path. Shared navigation belongs to this phase; Phase 6 operational bodies remain outside the explicit opt-in. No whole-site or production acceptance is claimed.

## ceiling

The builder reported two bounded visual passes before this independent review. Reviewer-requested capture repair supplied missing evidence with unchanged UI. Context and detector launchers failed with `cache_directory_failed`; they remain **unavailable**, not passed. This review applies the craft floor manually to the inspected evidence and preserves that limitation.

The candidate uses the approved palette and font stack, clear native controls, visible focus, consistent labels, flat authoring panels and responsive single-column editing. The review requests no new identity, composition rebuild or decorative motion. Long protected-content and recovery copy is preserved. F1 is the only material fix requested. Apply it in one scoped batch, rebuild once and return recaptured evidence for a verdict pass; do not reopen an unrelated defect hunt.

## material_fixes

| ID | Severity / location | Evidence and consequence | Exact scoped correction | Verdict evidence |
| --- | --- | --- | --- | --- |
| F1 | P2 — `/studio/sections`, Design comparison table | In `390-full-sections.png`, Area labels such as Opening image, Manifesto, Selected pieces and Page structure break into 2–4-character fragments. The horizontally scrollable table allows descriptive value columns to consume most width while row headings shrink. This makes the compared setting difficult to identify during review before publication. | Give only this design-comparison table's first-column headers a readable minimum width and normal word wrapping. Keep the existing horizontal-scroll container and access to Public layout / Your choices / Latest saved columns. Preserve field names, saved choices, comparison values and unrelated tables. A dedicated table hook/class is acceptable. | Recapture the comparison region at 390 and 320px and desktop at 1440px; include full-page 390 sections. Verify complete-word row labels, all columns reachable by horizontal scrolling, no document overflow, and the optional Latest saved column still usable. |

No other material fix is requested. F1 is open, so this is not a ship verdict.

## keep

- Preserve original logo, ivory backing, approved main palette and task-oriented Studio typography.
- Keep the explicit 24-workspace body opt-in, shared navigation scope and Phase 6 boundary.
- Preserve record facts, media/crop associations, protected instructions, source classifications, review states and deliberate save/publish controls.
- Keep product thumbnails, editorial revision/publication rows, visible focus, mobile stacking, scrollable tabs, page finder and draft recovery.
- Keep fixture-state evidence distinct from actual isolated QA lifecycle and protected-row digest comparison. The synthetic FAQ remains hidden.
- Keep release, native-device, screen-reader, real-user performance, language meaning and legitimate-business acceptance separate from local visual/automated evidence.

Only this report was authored by the reviewer. The reviewer did not run a browser, edit UI, mutate records, deploy or publish.

## F1 verdict pass — 2026-10-13

**Final disposition: ship — F1 resolved.** This is a scoped verdict pass over the sole material fix from the full review above, not a new whole-surface audit.

| Finding | Score | Evidence |
| --- | --- | --- |
| F1 — Design comparison row-header readability | resolved | The correction is limited to the Design comparison region: table minimum width 560px; first-column headers minimum width 148px with normal overflow/word wrapping. The reviewer opened the 1440, 390 and 320px comparison captures, all three optional Latest saved captures, and the refreshed 390px full-page sections image. Opening image, Manifesto, Selected pieces and Page structure now read as complete words at the two mobile widths. Desktop comparison remains aligned and readable. |

`output/playwright/redesign-phase5/review-fix.json` records 14 checks, with its script inspected: minimum widths, normal header wrapping and no document overflow at all three widths; actual horizontal scrolling at 390/320; and fourth-column visibility after scrolling to Latest saved at all three widths. These checks are supplied builder evidence, not browser tests rerun by the reviewer. The rebuilt candidate's comparison screenshots agree with the corrected source.

All material fixes listed in this review are resolved. No further correction is requested. The final disposition supports proceeding to documentation and showing the local Phase 5 previews to the owner. It does not authorize production release, Phase 6, content publication or replacement of the separate human/native acceptance gates. Context/detector unavailability remains recorded above.
