# R8-4A — Studio shell, catalogue and form-builder presentation

**Date:** 21 September 2026

**Work branch:** `codex/r8-first-frontend`

**Parent main:** `6e1be895b98a147ce0f00102e2ade7f9881db9f6`

## Owner instruction and main integration

The owner requested that completed work be merged into main, followed by R8-4A.
PR [#10](https://github.com/rivyalivingart2/RivyaLivingArt2.0/pull/10) merged R8-3D
head `679a358b334bcc658226a3661ed6b6add2dff852` into the main commit above.
The actual main reference was read back and verified. R8-4A continues from that
merge on development; this new slice is published separately. No force-push,
branch deletion or history removal occurred.

The [development-first decision](decisions/2026-09-21-development-first.md) remains
active. All testing-related work is deferred until after backend/database
integration. This document records source implementation, not performed browser,
responsive, keyboard, build or integration QA. Existing tests and checks remain
intact, including older expectations that will need reconciliation during final QA.

## Route and access boundary

| Route | Presentation |
|---|---|
| `/preview/studio` | Studio shell and fixture-derived overview |
| `/preview/studio/products` | Search, filters, source catalogue and current-page selection |
| `/preview/studio/products/new` | New local product draft |
| `/preview/studio/products/[id]` | Existing fixture opened as a local draft |
| `/preview/studio/products/[id]/form` | That fixture’s tier-specific inquiry schema and public field preview |
| `/preview/studio/modules/[module]` | Explicit planned-scope/status pages for content, media, enquiries, imports and settings |
| `/studio` | Existing holding boundary, with a preview-only link to the harness |

The Studio layout and each page call the shared server-side preview guard. Page
metadata uses the guarded metadata helper. Product/module lookup follows preview
permission and unknown IDs call `notFound`. There is no query/cookie login bypass,
fake staff identity or server-side session created by the harness.

`ApplicationFrame` in `src/components/application-frame.tsx` omits public chrome
only for `/preview/studio` and its descendants. This is a presentation choice,
not access control. The production preview restriction remains authoritative;
`RIVYA_VISUAL_PREVIEW` and `noindex` never substitute for separately verified
online deployment protection. No production fixture route is deliberately enabled.
Scoped `not-found.tsx` and `error.tsx` under `/preview/studio` reuse `SystemState`
inside the existing Studio main region, with catalogue/overview destinations and
local reset. Error copy does not promise that interrupted local drafts survived.
Runtime response status, navigation and hydration behavior await deferred final QA.

The existing `/studio` page is not replaced by this harness; its holding screen
exposes a harness link only when preview is allowed. Real staff login,
permissions and role-scoped navigation belong to the later auth/backend work.
The overview’s Demo/Live switch selects a presentation: Live displays an honest
unconnected state and never combines fictional counts with business activity.

## Component and operation map

| Specification | Actual source | Source behavior | Later integration boundary |
|---|---|---|---|
| A01 / Studio shell | `src/components/studio-shell.tsx` | Grouped navigation, current route, desktop sidebar, native mobile disclosure and links to implemented or explicitly planned module pages | Real staff identity, server permissions and role-scoped navigation |
| A04 / Overview | `src/components/studio-overview.tsx`, `src/lib/studio-overview.ts` | Fixture-derived totals, tier breakdown with a table, source content progress and disconnected operations/Live state | Database metrics and separate live/demo enquiry, backlog, pipeline and import data |
| A05 / Product management | `src/components/studio-products.tsx`, `src/lib/studio-catalogue.ts` | Bounded URL query, source filtering/sorting, eight-row pages, table/card presentation, current-page selection and confirmed local review marker | Server querying at catalogue scale, staff ownership/rights checks and authorized durable bulk operations |
| A06 / Product fields | `src/components/studio-product-editor.tsx`, `src/lib/studio-product-draft.ts` | Local product draft, required tier and fields, preserved other-tier values, confirmed tier transitions and storefront/CTA preview | Server validation, versioned saved drafts, actual review/publication and public delivery refresh |
| A07 / Form builder | `src/components/studio-form-builder.tsx`, `src/lib/studio-form-schema.ts` | Typed configuration editing, keyboard ordering, controlled conditions, local schema inspection and public field preview | Saved schema versions, server schema validation and immutable original inquiry snapshots |
| Public field renderer | `src/components/inquiry-input.tsx` | Shared by the public wizard and Studio preview using the existing inquiry schema/validation | Integrated inquiry save and private file workflow remain separate |

No row claims full A01/A04–A07 backend acceptance or the complete 52-component
map. These are frontend presentations awaiting visual review and final QA. No
service/action, migration, database, authentication, upload or dependency has been
added in this slice.

## Local catalogue behavior

The product list preserves its query in the URL: bounded title/fixture/type search,
tier, working draft, media state, sort and page. Invalid options fall back to known
values. Pagination displays eight records per page; the empty view provides a
reset destination. These source filters are not a production-scale server query.

Selection always names its scope: records on the current page. A filter/page
change remounts the local workspace and clears selection and staged review state.
The confirmation lists the exact selected fixture IDs/titles. “Stage local review”
adds only a temporary marker; it does not save, publish, archive, assign a reviewer
or send a notification. Original draft/visibility labels remain visible.

Sample prices use the existing INR/minor-unit formatter. The table keeps price
mode, sample lead time, tier, visual state and draft status distinct. Rights
approval remains unverified and owner assignment remains unassigned; neither is
invented from a source fixture. A concept image is not proof of approved rights,
manufactured inventory or a published business catalogue.

The editor creates a local copy rather than modifying `concepts`. A mandatory tier
selects its category and conditional fields. LARGE exposes edition/installation
fields, MEDIUM preservation/occasion/format/size fields, and SMALL recipient,
colour, festival, variant, quantity and gifting fields. A tier-change confirmation
explains the affected storefront presentation; other tier values stay in local
state so switching back does not silently discard them. Frontend validation and
local draft feedback do not establish server validation or persisted saving.

Care notes and finish ID/label/description entries are copied into the local
snapshot, editable and retained across tiers. Product-editor controls stay disabled
until hydration so an ordinary browser submission cannot serialize the draft.
The source-study link uses the established `/pieces/[slug]` route. Studio error
and not-found presentations retain a primary heading within the compact layout;
invalid product or module metadata also resolves to “Not found.”

Reloading or navigating away discards this slice’s local edits. There is no
localStorage, sessionStorage, database draft, publish/unpublish operation or
mutation of the public fixture catalogue. The original source product and its
public route remain the reference snapshot.

## Form builder and public parity

The form route derives the existing `buildInquiryConfig` from the selected
product’s tier. The builder uses that typed `InquiryConfig` and the extracted
`InquiryInput` renderer also used by the public inquiry wizard. Preview values,
visibility and local validation use the existing public helpers; this avoids
creating a separate imitation form engine.

Included tier questions retain their type, choices and validation rules. Contact
routing and local-preview acknowledgement fields are protected from weakening.
Custom questions support the allowlisted text, textarea, select, radio, number,
email, tel, date and checkbox definitions. The local editor bounds fields, choices,
labels and validation values. It accepts no executable JavaScript, arbitrary code,
HTML schema editor or evaluation-based condition.

Move-up/down controls reorder questions by keyboard action. Conditions may use
an earlier, always-visible choice or checkbox. Ordering that would put a controller
after its dependent is rejected; fields/choices with dependencies cannot be
removed until those rules are explicitly cleared. Reset, custom-field removal
and fictional-answer replacement have local confirmation states.

The focused visitor preview renders the chosen step or summary, and can validate
fictional answers locally. File selection is unavailable in this builder; its
reference-image position is a labelled placeholder. Controls remain disabled
before hydration and with JavaScript unavailable. No preview submit creates a
request, upload, message or database record.

The original schema remains v1; the visible local revision is an editing counter,
not a saved version or an inquiry history record. The optional schema inspection
omits preview answers. Historical inquiry snapshots and publication remain future
backend capabilities. Source reuse is not evidence that browser behavior has been
verified; shared-renderer and public-wizard regressions remain part of final QA.

## Source content and media

| Record type | This slice | Current total / target |
|---|---|---|
| Products | DP003–DP012 and DP015–DP016: twelve further LARGE concepts | 36 / 120: 24 LARGE, 6 MEDIUM, 6 SMALL; 84 remain |
| Articles | Unchanged | 12 / 36 complete labelled drafts; 24 remain |
| FAQ answers | Unchanged | 42 / 42 owner-review drafts |
| Fictional design studies | Unchanged | 3 |
| Editorial page records | Unchanged | 6 |
| Testimonials | None added | 0 / 24 |
| Inquiry/order scenarios | None added; local editor states are not operational records | 0 / 40 |

The twelve product records retain their blueprint IDs and names, stable slugs,
original descriptions/details, typed materials, sample price modes, dimensions,
lead times and clearly fictional draft/media states. They are design-discussion
records, not manufactured items, construction instructions, confirmed prices or
production commitments. The public fixture catalogue and Studio read the same
source records; Studio local edits do not alter them.

The two existing product AVIFs are unchanged. All twelve new images are `null`,
bringing pending product visuals to 34. DP004’s `PRODUCT-HERO-010` Drive-index
candidate is unverified and is not an approved mapping. The existing separate
asset companion adds `IMG04-DP003`–`IMG04-DP012` and `IMG04-DP015`–`IMG04-DP016`
owner briefs. Each names its actual `/pieces/[slug]` placement and remains
AWAITING_OWNER_OUTPUT. No image generation, download, Drive mutation, upload or
new media mapping occurred.

## Development feedback, publication and next task

**SOURCE_IMPLEMENTED:** R8-4A Studio catalogue presentation and twelve LARGE
source records.

**UI_READY:** pending deferred visual/keyboard QA.

**BACKEND_CONNECTED:** no.

**TESTED:** not run for this slice.

`npm run typecheck` passed (Next route generation and TypeScript, Node 22) for
implementation wiring. No lint, build verification, unit/preflight/HTTP/browser checks or screenshot QA were run
or added for this slice. Compiler feedback alone cannot establish UI_READY or
TESTED. Historical R8-3A checks do not certify later source. Existing tests and
assertions remain for the final phase and must not be suppressed to fit the new
fixture counts or routes.

Read-only Vercel inspection reports Node `22.x` and authentication protection
`all_except_custom_domains`. Existing Git triggers can build main/Preview; no
explicit deployment, promotion, environment, runtime/protection setting or
live-domain change was performed. Publish this coherent development checkpoint,
read back its actual branch SHA/tree and report the resulting draft PR separately
from implementation and QA status.

Remaining work includes the rest of Studio, full demo source, approved imagery,
owner-reviewed care/legal wording and studio history, backend/database integration
and final consolidated QA. Known master contact details remain correctly supplied;
do not reopen the earlier missing-contact mistake. R8-5/V1 owner approval and
R8-11/V2 readiness have not been reached. The custom CMS and every rejected
integration/S01–S04 exclusion remain unchanged.

**Next exact task:** R8-4B — content hub, page-section editor, Tiptap presentation,
FAQ/blog/testimonial editors, media picker, responsive layout preview and
autosave/validation/history presentation.
