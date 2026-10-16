# Studio — sitewide cinematic implementation

16 October 2026. This work extends the existing local cinematic implementation under the owner's new website-wide master prompt. It is presentation-only and remains local. No push, release, record write, authentication change, permission change or API change is included.

## Active route and surface audit

The private `/studio` entry and `/studio/[...path]` route authenticate on the server and render `PrivateStudioEntry` → `components/studio/workspace.tsx`. The 37 admitted workspace keys come from `src/lib/studio-modules.ts`. Record child links resolve to the same editor surfaces using existing query parameters. The older `components/rivya/studio.tsx` demo is not the active private catch-all and was not substituted for it.

| Surface / routes | Treatment | Fullscreen decision | Source status |
|---|---|---|---|
| `/studio` | Editorial overview heading, quiet task-row lighting, gold attention edge, clear activity panel headings and workspace links | Existing `min-height:100svh` shell; queues retain natural height | Implemented |
| `/studio/inquiries`, aliases `/orders`, `/kanban`, `/enquiries`; `/follow-ups` | Static layered board lanes/cards, stable headings, focus-visible card boundary, reading panels and record anchors | Natural height; existing horizontal board / phone stage behavior retained | Implemented through shared operations styles |
| `/studio/analytics`, `/activity`, `/exports` | Restrained metric lighting, tabular number treatment, stationary table headers and opaque cells | Natural height | Implemented through shared operations styles |
| `/studio/products`, `/categories`, `/forms` | Clear selected-record lighting, opaque controls, stable media thumbnails, contextual field/editor surfaces | Natural-height editors and bounded existing selection list | Implemented through shared editor styles |
| `/studio/media`, `/site-images` | Shared navy/canvas media-card backing, quiet hover/focus frame, retained images/crops and captions | Contained imagery for accurate media inspection | Implemented |
| `/studio/content`, `/journal`, `/portfolio`, `/testimonials`, `/faqs`, `/pages`, `/landing-pages` | Refined library rows, highlighted selected record, opaque editor surfaces and unchanged field/action hierarchy | Natural height for authoring and long records | Implemented through shared editor styles |
| `/studio/content-register`, `/editorial-order`, `/content-health`, `/content-gaps` | Consistent toolbar/table surfaces, clearer status strip and empty-state treatment | Natural height; no animated rows or moved controls | Implemented through shared editor styles |
| `/studio/site-copy`, `/sections`, `/process`, `/materials`, `/translations` | Calm authoring canvas, readable protected-note side rule, shared control vocabulary | Natural height | Implemented through shared editor styles |
| `/studio/navigation`, `/legacy`, `/route-review`, `/staff`, `/settings` | Shared controls, panel surfaces and static admin lighting; account-request rows retain verification actions | Natural height | Implemented through shared operations/editor styles |
| `/studio/research`, `/seo`, `/content-lab` | Shared authoring/reading surfaces | Natural height | Implemented through shared editor styles |
| `/studio/import`, `/subscribers` | Existing unavailable/configuration state presented in matching calm panels | Natural height | Implemented visually; unavailable features remain unavailable |
| `/studio/login`, `/request-access`, `/forgot-password`, `/set-password` | Approved full-image background and 30–50% white glass retained; image edges blend into canvas, labels enlarged, existing logo/nav retained | `min-height:100svh`, growing with the complete form | Implemented through shared access stylesheet |
| `/studio/preview`, `/presentation/preview`, `/editorial-order/preview` | Shared gradient controls and clear current viewport state | Controls natural height; framed previews retain their own dimensions | Implemented in toolbar stylesheet |
| `/studio/reference/[id]` | Charcoal/natural navy ambient background and existing full-image containment | Existing viewport minimum | Implemented |
| Private workshop template in presentation preview | Shared seamless section gradients; source placeholders and unconfirmed-offering notice retained | Existing minimum viewport on suitable bands; compact fact/mobile bands remain natural height | Implemented |
| `/studio/preview/states` | Existing isolated authoring gallery inherits editor/control presentation | Natural height | Covered by shared stylesheet; production guard unchanged |
| `/studio` error boundary | Stable dark gradient recovery panel with existing retry/sign-in controls | Existing shell behavior | Implemented without motion-runtime dependence |
| `/studio/inquiries/[id]/card` | Existing ivory print-oriented record card | No fullscreen or motion | Intentionally retained for print readability |
| Preview `/frame` routes | Existing public renderer inside the saved preview | Determined by public template | Intentionally not wrapped in admin effects |

All registered workspace families receive shared styling even when their record data, filters, selected child or permissions differ. Source coverage is not evidence of every populated/conditional state having been opened; the parent task owns the browser matrix and final verification receipt.

## Art direction and implementation decisions

The plan is a restrained workbench within the same atelier: charcoal `#080a0e`, navy `#08283a`, sapphire `#164e6b`, gold `#b89b63`, ivory `#f4f1e9`. Existing body/display typefaces remain. The overview gets the display face; editing headings retain the practical body face. Fine rules still separate functional records; decorative rectangular background changes are softened.

The initial idea of repeating full-screen cinematic treatments in each module was rejected against the prompt's productivity requirement. Forms, orders, queues, media inspection and long editorial work should not gain artificial height, cursor motion over inputs, zoomed product crops or animated data. Lighting belongs to the surrounding canvas and static surfaces. No decorative video or new image was added to admin views.

The shared CSS reads `--cinema-canvas`, `--cinema-navy`, `--cinema-sapphire` and `--cinema-gold` with equivalent brand fallbacks. Editor panels, tabular cells and input backgrounds remain readable surfaces above the global atmosphere. Gold selected-record edges and keyboard focus give clear location cues. Hover changes alter backgrounds/borders only, never record position or layout. Existing reduced-motion rules continue to suppress transitions.

The parent task integrates the reusable global canvas at the actual workspace root with its calm Studio mode, and at the access shell with its form-compatible mode. Do not wrap the entire Studio layout: saved public frames and print cards must remain outside admin lighting. The global motion runtime, controls and pointer policy are owned by the parent component implementation, not duplicated here.

## Files changed in this slice

- `src/components/studio/studio-editing.module.css` — shared frame, controls, panels, selection lists, media library, tables, reading notices.
- `src/components/studio/studio-operations.module.css` — board lanes, order cards, metrics, notes, record anchors and focus state.
- `src/components/studio/overview.module.css` — overview hierarchy, task emphasis, activity panel headers and workspace links.
- `src/components/studio/studio-access.module.css` — seamless access image edges, original glass panel, form label size and static print fallback.
- `src/components/studio/homepage-composition.module.css` — homepage composition review metrics use the shared palette.
- `src/components/studio/workspace.module.css` — reference-image viewer background and existing body font.
- `src/components/studio/workshop-template-preview.module.css` — seamless private-template surfaces; no invented offering or imagery.
- `src/components/studio-private.css` — stable error-boundary presentation.
- `src/app/studio/preview/preview.module.css` — saved-preview control shell only.

No dependency was added or removed. No TSX event handler, form action, database/API code, permission policy, business copy, media selection, stored crop or route admission was edited by this slice. Existing uncommitted cinematic changes in the shared CSS were retained.

## Verification handoff

`studio-css-validation.json` records successful PostCSS syntax parsing for all nine edited stylesheets and their source hashes. `git diff --check` passed for this slice. This is source validation only. No concurrent production build, database write or browser session was started by this agent.

Parent verification should cover overview, catalogue editor, editorial list/editor, media, inquiry list/board/detail, staff request controls, access pages, preview controls and reference image at the requested widths; retain natural-height and focus behavior at 320px. Shared cursor lighting must pause/suppress over inputs and dialogs and remain static for touch/reduced-motion. Private tokens and personal records must not enter screenshots or reports. The print card's paper presentation is an intentional exception, not a missed cinematic surface.

Historical pending production access-request table activation remains separate. Styling an account request or recovery page does not prove delivery, approval, table installation or real administrator acceptance.
