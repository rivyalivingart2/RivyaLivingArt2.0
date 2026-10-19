# Translation workspace: bounded accessibility follow-up

Date: 19 October 2026. Environment: guarded isolated QA application on loopback 4199; synthetic QA administrator; Chrome 155.0.8059.84, DPR 1, reduced motion. No production actions or content mutations. The helper creates the local synthetic login/session; subsequent Studio API writes are blocked by the browser harness.

## Reproduced semantic issue and local correction

The original shared pagination rendered `<span aria-live="polite" aria-label="Page 1 of 31">1 / 31</span>`. At all three widths, axe left exactly this node for `aria-prohibited-attr` review. Chrome's accessibility snapshot exposed `1 / 31`, without the intended page wording.

This is a concrete semantic defect: the implicit generic role on a span prohibits `aria-label`. The local correction gives the existing element `role="status"`, retains polite delivery, makes the update atomic, and supplies actual accessible text `Page 1 of 31`. The visual fraction stays unchanged and is hidden from the accessibility tree to prevent duplicate announcements. No focus movement or button behavior is added.

Primary references: [WAI-ARIA 1.2 generic role](https://www.w3.org/TR/wai-aria-1.2/#generic), [WAI-ARIA 1.2 status role](https://www.w3.org/TR/wai-aria-1.2/#status). Actual native screen-reader announcement remains a separate unverified acceptance item; browser accessibility-tree evidence is not native reader certification.

## Before evidence

Raw local receipt: `test-results/audit-pending-accessibility/review.json`, captured 07:17 UTC. Raw screenshots are in the same ignored directory and remain unchanged. The initial tool's focus object used `width` for outline width (2 px); viewport provenance is established by the five controls per width in run order and screenshot filenames. The updated tool uses a separate `viewportWidth` field.

| Viewport | Text snapshots | Text/background comparisons | Lowest sampled ratio | Text failures | Focus controls |
|---|---:|---:|---:|---:|---:|
| 1440 × 1000 | 12 | 947 | 6.085:1 | 0 | 5 |
| 390 × 844 | 20 | 589 | 6.030:1 | 0 | 5 |
| 320 × 844 | 21 | 555 | 6.142:1 | 0 | 5 |

The 2,091 comparisons include repeated text across overlapping viewport snapshots. They are not 2,091 unique controls or records. The 15 focus observations passed the finite check: visible 2 px outline, four sampled adjacent midpoints, minimum 14.500:1. Text thresholds were 4.5:1 for ordinary text and 3:1 for large text. Before text sampling covered the main workspace rather than the entire shell.

At 1440/390/320, the two-rule axe scans reported no automatic violations, one unresolved pagination node each and 179/137/136 contrast nodes for manual review. Their causes include gradients, overlap and non-BMP characters. These incompletes are not failed contrast measurements and cannot be represented as automatically passed scans.

Visual review inspected desktop top, 390 px refresh-error, 320 px refresh-loading and 320 px focused Next screenshots. The sampled layouts keep headings, controls and error/loading feedback readable. The refresh-error state correctly retained 20 cards and explicitly described them as stale; recovery completed. No runtime errors or attempted content writes were recorded.

## Method and limits

`translation-accessibility.mjs` traverses rendered, fully visible text and selected input values, temporarily removes glyph fill while retaining rendered backgrounds/gradients, captures pixels, and applies WCAG sRGB relative-luminance contrast to the computed foreground color. It samples every two CSS pixels within each visible text box. Focus checks compare the outline color with the rendered background at four ring midpoints. The after run also includes visible shell text.

Primary criteria: [WCAG 2.2 contrast minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) and [non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html).

Finite scope: the first 20 translation cards, top-level controls, visible shell text in the after run, keyboard focus on Refresh coverage/Find document/Review language/Next/Review this record, page-one to page-two transition, and intercepted refresh loading/error/recovery. Disabled, clipped, hidden and occluded text is excluded; disabled controls have a contrast exception. This does not certify every record, every native select popup, offscreen sidebar item, every animation frame, all pointer/hover states, all browsers, assistive technology, or the wider website. Reduced-motion stationary gradients were tested; moving cinematic/media contrast is outside this bounded task.

## After verification

The first rebuilt run removed the ARIA incomplete and exposed `Page 2 of 31` after keyboard activation, with focus retained on Next. Screenshot review caught the existing `.workspace [role=status]` rule applying muted text to the new role. The final narrow correction adds `color: inherit` to preserve the original fraction color. A second verification assertion compares its computed color to the parent. Initial desktop capture also preceded logo decoding; the tool now waits for loaded header imagery, and the first after receipt/image are preserved separately.

Final run: **VERIFIED_FIXED** for the pagination semantics; **PASS for the finite rendered contrast/focus scope below**. Receipt `test-results/audit-pending-accessibility/after/review.json` at 07:38 UTC, after the final coordinated build. No additional application changes followed this run.

| Viewport | Text snapshots | Text/background comparisons | Lowest sampled ratio | Text failures | Focus controls |
|---|---:|---:|---:|---:|---:|
| 1440 × 1000 | 12 | 1,247 | 6.085:1 | 0 | 5 |
| 390 × 844 | 20 | 590 | 6.030:1 | 0 | 5 |
| 320 × 844 | 21 | 553 | 6.142:1 | 0 | 5 |

After totals: 53 viewport/state snapshots, 2,390 repeated text/background comparisons, 15 focus observations; no failures. Lowest focus-adjacent ratio: 14.500:1. The broader after text sampling includes visible shell text, so comparison totals are not a direct equal-coverage before/after metric.

All three widths passed keyboard Enter activation of Next, exposed exactly `status: Page 2 of 31`, retained focus on Next and preserved the original inherited fraction color. After recovery, the snapshot exposes `status: Page 1 of 31`. The three two-rule axe scans have zero violations and zero `aria-prohibited-attr` incompletes. Their 179/137/136 `color-contrast` incompletes remain listed honestly; finite rendered sampling supplies additional evidence for sampled text, not an automatic or exhaustive waiver of every unresolved node.

Loading and synthetic 503 refresh-error states were inspected at every width. All retained 20 cards, displayed the stale-results notice and recovered after removing interception. No runtime errors or attempted content writes occurred. The helper's local synthetic login/session is the only permitted state change.

Final visual review inspected the loaded-logo desktop top, 320 px focused Next, 320 px refresh-loading and 390 px refresh-error images. Original fraction color, logo and layout are preserved, and no new overlap/clipping was observed in these frames. A five-second logo-readiness attempt stopped before testing; its receipt is preserved in `logo-wait-5s.json`. The final harness allows 30 seconds for visible image readiness. That wait and subsequent success are not a media-performance acceptance claim.

The existing cleanup verification script now locates the semantic page status rather than its removed generic `aria-label` and verifies the exposed page wording through a browser accessibility snapshot. This narrow follow-up did not rerun that older broad suite; the final targeted script exercised the replacement contract directly.
