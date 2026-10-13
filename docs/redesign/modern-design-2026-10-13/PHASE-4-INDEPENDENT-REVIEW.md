# Phase 4 independent finish review

Date: 2026-10-13

**Latest disposition: ship — scoped verdict pass; F1 and F2 resolved.**

**Original full-review disposition: fix.** The original findings below are preserved as review history; the dated verdict pass at the end records their resolution.

Scope: local Phase 4 public-page extension of the owner-approved Phase 3 material-gallery direction. This is a full independent source-and-capture review following replacement of invalid interaction evidence, not a fix-list verdict. No new raster comp was approved; fidelity is assessed against `experiments/redesign-phase4/DIRECTION.md` and the incumbent Phase 3 design. No implementation was changed by this reviewer.

## persistence

The visual system persists across collection, product, Journal, story, policy, FAQ, customization, receipt and feedback states. Desktop divisions become readable single-column compositions at 768, 390 and 320px. Existing disclosures and manual WhatsApp handoff conditions remain visible. The corrected review-step captures show populated synthetic answers and separate final-control captures; the save control was not clicked. The corrected desktop enlarged-gallery capture now contains the decoded product image.

Source inspection confirms `publicDesign` defaults to false, applies the Phase 4 module to the public `main`, and is explicitly enabled on the intended routes; `ShopSite` excludes `/`. Data-part annotations provide styling hooks without replacing the component behavior. The reviewed diff leaves media associations and content in place. This supports the scoped preservation approach; it is not a fresh database integrity audit.

Evidence examined includes 1440/390 Journal, collection opening/body, product, customization, story opening/body, policy reading and FAQ captures; all supplied 768px and 320px representative captures; portfolio archive/detail, testimonial detail, landing/imageCta/videoStory/bentoGallery and receipt fixtures; corrected review/error controls and enlarged gallery; print privacy; and representative language/loading/empty/error captures. The receipts contain 570 browser checks, 100 fixture checks, 64 interaction checks and 155 sampled text contrasts. Those are the builder's saved local receipts, not checks rerun by this reviewer. The reported 344 unit and 403 runtime passes are supporting packet claims, not independently rerun test results.

## fidelity

The large Instrument Serif headings, ocean/obsidian photographic framing, ivory reading intervals, restrained rules and original logo treatment carry the approved world into the remaining public pages. Product detail provides a strong image-to-brief route. The text-only collection opening is a defensible response to the lack of an assigned cover, and does not fabricate a media association. Policy copy has a bounded reading measure; FAQ and filter surfaces retain clear controls. Story chapter ordering and alternating surfaces remain legible at narrow widths.

Preserved eyebrow labels are required content in this scope. Their presence is not a finding against the craft-floor preference; their low contrast on some dark openings is a finding. No wholesale fidelity failure or rebuild is warranted.

## ceiling

The design is close to the scoped local-preview quality bar, but two shared contrast defects prevent a ship verdict. Both are narrow CSS issues and can be repaired without revisiting composition, assets, approved colors or text.

The original blank review/gallery evidence and the supplemental stale-scroll Journal/error captures were replaced and reopened. The new captures are usable for their named states. Static fixture video remains a non-hydrated layout specimen with a native media placeholder; it does not prove playback, and its placeholder is not treated as a production defect. Repeated fixture images and synthetic QA record names constrain editorial polish assessment but are not a license to invent customer projects, testimonials or media assignments.

The failed context/detector launchers provide no hook pass. Local browser emulation and this review do not establish physical-device, screen-reader, native-language meaning, real-world performance, legitimate-business, production or publication acceptance. The QA inventory's 185 available routes and 480 unpublished draft URLs are not a claim that every URL was visually reviewed. Phase 5 remains outside the verdict.

## material_fixes

| ID | Material issue and evidence | Required correction | Acceptance evidence |
| --- | --- | --- | --- |
| F1 | Dark editorial opening labels are difficult to read. `1440-privacy.png`, `320-privacy.png`, `1440/390-our-story.png` and the portfolio/testimonial detail fixtures visibly show dim preserved labels. In `src/components/shop/public-pages.module.css:31`, `:is(span,p:first-child:not(:last-child))` takes the specificity of its strongest branch, so its `#505851` color beats the later nested-opening `#ddd6cb` rule at line 42 even for a `span`. Against flat ocean `#08283a`, the source-derived contrast is **2.08:1**, below the 4.5:1 small-text floor. The 155-sample check omits intro spans, so its pass does not cover these labels. | Correct the selector precedence or separate the light-intro and dark-opening label rules. Preserve every label's wording and use an existing palette color with sufficient contrast. Keep the ivory Journal/brief opening labels dark. | Capture the corrected privacy and story openings at 1440/390/320, plus a representative dark detail fixture. Record computed foreground/background values and contrast for the actual intro span; show at least 4.5:1 on flat dark surfaces and visually verify the label over the story image. Confirm the ivory opening remains legible. |
| F2 | The Phase 4 universal focus rule at `src/components/shop/public-pages.module.css:19` forces a 3px `#b89b63` outline on all public controls, including links and summaries on ivory reading surfaces. The outline has only **2.35:1** contrast against `#f4f1e9`. It therefore loses the clear focus distinction required by the direction's keyboard-access quality bar. The 5px outline offset places this indicator against the light surface, so the control fill does not repair its contrast. | Add a focus color appropriate to ivory reading/statement surfaces using an existing dark palette color, while retaining the light focus color on dark surfaces and on dark nested filters/dialogs. Keep visible outline thickness and offset. | Capture keyboard focus on a privacy contents link and FAQ summary/link on ivory at 1440/390; record computed outline color and adjacent background with at least 3:1 contrast. Also check one nested dark filter/dialog control to ensure the light-surface override does not make its focus indicator dark on dark. |

Apply these two fixes as one batch, recapture the affected evidence, and return to this reviewer for a verdict scoring F1 and F2 resolved, partial or unresolved. No additional aesthetic exploration is requested.

## keep

- Keep the approved logo, palette, existing fonts, content, disclosures, media/crops and route behavior.
- Keep the restrained distinction between visual browsing, long-form reading and operational forms.
- Keep the full product photograph, native enlargement, bounded policy measure, stacked mobile controls and explicit review-before-save path.
- Keep fixture labels and the separation between synthetic layout coverage and built-app interaction receipts.
- Keep the `publicDesign` boundary, homepage exclusion and Phase 5 stop; do not publish, deploy or assign new assets to resolve this review.

## Verdict pass — 2026-10-13

**disposition: ship**

This pass scores only F1 and F2 from the full review above. It does not reopen the aesthetic review or claim a new whole-surface audit.

| Finding | Score | Evidence checked |
| --- | --- | --- |
| F1 — dark editorial opening labels | **resolved** | The nested opening first-child rule now wins with `#ddd6cb`. The current computed receipt reports **10.59:1** against ocean at 1440, 768, 390 and 320px. Reopened privacy and story openings at 1440/390/320 show readable preserved labels, including the label over the story image; refreshed portfolio/testimonial detail fixtures agree. Journal openings at 1440/390 retain their legible dark labels on ivory. |
| F2 — focus on ivory and nested dark surfaces | **resolved** | The outline now uses scoped `--page-focus`: sapphire on ivory intro/reading/statement surfaces and champagne on dark openings, nested filters and dialogs. Reopened privacy-link and FAQ-summary focus captures show the clear 3px sapphire ring; computed contrast is **7.96:1** against ivory. Reopened desktop and mobile dark FAQ filters preserve the champagne ring; the corrected measurement against the adjacent ocean panel is **5.75:1**. Dark form-control evidence reports **7.46:1** against obsidian. The source retains the 5px offset. |

The final `review-fixes-verification.json` contains 20 computed checks covering these fixes. I read the current receipt and source and opened the affected screenshots; no browser or tests were rerun by this reviewer. The missing 320px story image and stale 320px privacy image identified during this pass were supplied/replaced and reopened before this verdict.

Both listed material fixes are resolved. This supports continuing the local Phase 4 preview handoff under the original scope. It does not assert that the final broad browser rerun was an unconditional pass: the builder reports 569 raw passes and one preserved form-availability difference caused by the existing session limit. That runtime condition is outside F1/F2, and this verdict does not certify a successful inquiry submission or receipt save.

The original exclusions remain: no Phase 5, production, publication, physical-device, screen-reader, native-language meaning, real-world performance or legitimate-business acceptance is inferred. Only this review document was changed by the reviewer.
