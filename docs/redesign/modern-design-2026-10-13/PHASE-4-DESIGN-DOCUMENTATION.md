# Phase 4 design documentation comparison

Date: 2026-10-13

**Documentary verdict: ordinary extension of the approved contemporary material gallery.** The finished Phase 4 source carries the incumbent Phase 3 language into remaining public page bodies. It introduces scoped compositions and control treatments, not a new identity or a replacement system authority. No Phase 4 `DESIGN.md` or `.impeccable/design.json` is warranted. Existing product and design files are preserved.

The authorization and descriptive language come from [Phase 4 DIRECTION.md](../../../experiments/redesign-phase4/DIRECTION.md), including the owner's Phase 3 approval and Phase 4-only instruction. This comparison follows Impeccable's ordinary-extension documentation path. It does not refresh the incumbent documents or seek a new visual-world choice.

## Source evidence checked

- [PRODUCT.md](../../../PRODUCT.md), [Phase 3 DESIGN.md](../../../experiments/redesign-phase3/DESIGN.md), and the Phase 3 sidecar's scope, source list, color metadata and preserved-drift record.
- [public-pages.module.css](../../../src/components/shop/public-pages.module.css), including the final dark-opening label precedence and surface-specific focus fixes; root `src/styles/tokens.css`; relevant typography, button, image and control rules in `shop.module.css`; and original-logo/header rules in `public-frame.module.css`.
- Current `ShopFrame` and `ShopShell` opt-in wiring; `ShopSite` homepage exclusion; public-part hooks in collection, editorial, archive, form, receipt and fallback renderers; and the product card/gallery diffs. Gallery source still retains keyboard navigation, touch navigation, image position and native enlargement behavior.
- [Independent finish review](PHASE-4-INDEPENDENT-REVIEW.md), as available during this documentation pass. That report requested F1/F2 corrections. The supplied corrections are present in the source examined here; recaptured browser evidence and the reviewer's final scoring remain the build/review handoff's responsibility.

This was a source comparison. The documenter did not rerun a build, browser, database audit or receipt suite and makes no new claim about those results.

## Comparison with the incumbent

| Area | Evidence and interpretation |
| --- | --- |
| Identity and palette | Obsidian `#080a0e`, ocean `#08283a`, sapphire `#164e6b`, champagne `#b89b63`, ivory `#f4f1e9`, stone `#ddd6cb`, muted `#a9b4bc` and ink `#18202a` match the Phase 3/root palette. Shared original-logo markup and ivory backing remain. Additional reading-copy, paper and separator values are local surface treatments, not renamed main colors. |
| Type and space | Existing Instrument Serif and Inter stacks remain inherited. Large balanced serif titles, `-.03em` tracking, the shared `clamp(20px, 5vw, 88px)` gutter and generous chapters extend the incumbent rhythm. Phase 4 uses local heading scales and bounds long prose at `72ch`, with chapter copy at `68ch`. These serve new page types without replacing homepage typography. |
| Composition | Ocean/obsidian browsing and product imagery alternate with ivory intros, statements and reading surfaces. Coverless collection openings use text columns. Product detail uses a `1.35fr / 1fr` division, with stacking at 980px; reading and forms stack at 780px. Sticky galleries/contents become static at their applicable breakpoints. Existing media data and crop positions remain in the examined component paths. |
| Shape and depth | Image cards are flat and rectilinear, with fine rules and tonal separation. Public-body buttons and form fields use a local 4px radius; this is an operational-page variant, not a rewrite of Phase 3's rectilinear homepage/header controls. No new raised-card or blur system is introduced. |
| Focus and labels | Final source explicitly keeps ocean opening labels stone `#ddd6cb`. The 3px outline with 5px offset uses sapphire `#164e6b` on ivory intros, reading and statements; champagne `#b89b63` on dark surfaces, including nested filters/dialogs. These apply existing colors to the two finish-review corrections. Source presence alone does not certify the recaptured contrast results. |
| Motion and behavior | The new module supplies a 650ms image-hover transform to `scale(1.025)` under `(hover:hover)` and `(prefers-reduced-motion:no-preference)`. It adds no JavaScript motion runtime. Public forms and reading retain static layout. Existing gallery handlers and image attributes remain in the inspected diffs. |
| Scope | `publicDesign` defaults to false and adds the module only to `main`; the public fallback excludes `/`. Shared header/footer retain Phase 3 styling. Public-body styling is an explicit opt-in, leaving Studio preview reconciliation for a separately authorized Phase 5. |

## Preserved drift and limits

`PRODUCT.md` still describes Phase 2-only authorization and a disconnected foundation. Phase 3 `DESIGN.md` and its sidecar still describe Phase 4 as gated. Those historical scope statements are superseded for this task by the explicit Phase 4 instruction in DIRECTION.md; they were not rewritten.

Phase 3 documents report an undeclared `--hairline` in shared styles. Phase 4 now supplies `--hairline: #43515a` within its opted-in public surface. That local declaration does not repair or re-document the historical homepage/global condition.

The direction describes hover enhancement for fine pointers; the actual Phase 4 query tests hover capability and reduced-motion preference without an explicit `pointer:fine` clause. This report records the source accurately without broadening the documenter's mandate into a source repair.

The context/detector launcher failure remains unavailable evidence, not a pass. Synthetic fixtures, browser emulation, native-language meaning, physical devices, screen readers, real-user performance and legitimate-business evidence remain distinct. Nothing here authorizes publication, deployment, data changes or Phase 5.

## Recheck anchor

The examined `public-pages.module.css` SHA-256 is `64FAD287A0591C135F1ABB57DD250305F90D7AAF4B752E58A8678DA8DB0D03FE`. Later source edits require a comparison recheck. No UI/source file was changed by this documenter; this report is the sole authored artifact.
