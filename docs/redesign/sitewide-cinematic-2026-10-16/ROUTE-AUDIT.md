# Website-wide route and section audit

Audited 2026-10-16T07:33:29.821Z. Local branch `codex/cinematic-sections`, source HEAD `ffd863928744df0ae2cf985f6504421842a074db`; the working tree includes the approved earlier cinematic work and ongoing sitewide changes. This is a source inventory and implementation coverage plan, not a runtime completion certificate.

## Discovery totals and scope

| Inventory | Count |
| --- | --- |
| routeFiles | 109 |
| pageTemplates | 62 |
| routeHandlers | 47 |
| studioWorkspaces | 37 |
| homepageSlots | 18 |
| landingBlockTypes | 16 |
| registeredUrls | 665 |
| registeredDynamicUrls | 636 |

| Classification | Route-file count |
| --- | --- |
| public-page-template | 31 |
| public-canonical-redirect | 3 |
| api-nonvisual | 30 |
| legacy-locale-handler | 9 |
| legacy-redirect-or-notice | 7 |
| public-media-nonvisual | 1 |
| disabled-legacy-state-route | 2 |
| authenticated-legacy-redirect | 11 |
| private-workspace | 2 |
| authenticated-preview | 7 |
| studio-access | 4 |
| private-print | 1 |
| private-reference | 1 |

There are **37 actual Studio module destinations**, not merely the catch-all source file. Public content URLs share the owners listed below. Query-filter states, aliases and locale handoffs are states of those templates, not separate authored designs. The JSON lists every source adapter and 636 registered dynamic URLs with their historical source. No database write, import, publication or asset reassignment was performed for this audit.

## Architectural coverage

- `ApplicationFrame` is pass-through; route shells own navigation. Public integration therefore belongs in `ShopShell` and shared page/section components, not a second global fixture frame.
- Published collections use `CollectionDocument`; its chapters delegate to `ReferenceChapter` or the regular chapter renderer. Preserve filters and catalogue grids at natural height.
- Stories, policies and editorial details use `EditorialDocument`; articles, FAQs, concept statements and policy copy need reading-first composition. Optional landing documents use all 16 registered block types.
- Product detail uses `Gallery` plus exact product facts; scene art can be immersive, but product photography and zoom controls must retain accurate framing. Forms and receipt handling are separate functional surfaces.
- Private Studio uses one `Workspace` dispatch registry with 37 modules. Use low-intensity shared surface styling. Saved previews must use the same public renderer and preserve saved revision semantics.
- Studio login/request/reset surfaces use `StudioAccessShell`; the approved logo, glass treatment, consent text and administrator-assisted flows remain intact.

## All route adapters

| Route pattern | Classification | Template owner | Source |
| --- | --- | --- | --- |
| / | public-page-template | Homepage -> ShopSite -> HomepageDocument/ReferenceHomepage; ShopShell | src/app/page.tsx |
| /[collection] | public-page-template | ApprovedExperience -> ShopSite -> CollectionDocument; fallback catalogue composition | src/app/[collection]/page.tsx |
| /about | public-canonical-redirect | Permanent canonical redirect to /our-story; query preserved | src/app/about/page.tsx |
| /accessibility | public-page-template | ApprovedExperience -> ShopSite -> EditorialPage/EditorialDocument | src/app/accessibility/page.tsx |
| /api/inquiry/receipt | api-nonvisual | Route handler; no UI template | src/app/api/inquiry/receipt/route.ts |
| /api/inquiry/reference | api-nonvisual | Route handler; no UI template | src/app/api/inquiry/reference/route.ts |
| /api/inquiry/schema | api-nonvisual | Route handler; no UI template | src/app/api/inquiry/schema/route.ts |
| /api/inquiry/session | api-nonvisual | Route handler; no UI template | src/app/api/inquiry/session/route.ts |
| /api/locale | api-nonvisual | Route handler; no UI template | src/app/api/locale/route.ts |
| /api/studio/access-requests | api-nonvisual | Route handler; no UI template | src/app/api/studio/access-requests/route.ts |
| /api/studio/analytics | api-nonvisual | Route handler; no UI template | src/app/api/studio/analytics/route.ts |
| /api/studio/cleanup | api-nonvisual | Route handler; no UI template | src/app/api/studio/cleanup/route.ts |
| /api/studio/content | api-nonvisual | Route handler; no UI template | src/app/api/studio/content/route.ts |
| /api/studio/content-intake | api-nonvisual | Route handler; no UI template | src/app/api/studio/content-intake/route.ts |
| /api/studio/content-list | api-nonvisual | Route handler; no UI template | src/app/api/studio/content-list/route.ts |
| /api/studio/content-register | api-nonvisual | Route handler; no UI template | src/app/api/studio/content-register/route.ts |
| /api/studio/editorial-assets | api-nonvisual | Route handler; no UI template | src/app/api/studio/editorial-assets/route.ts |
| /api/studio/editorial-assets/image | api-nonvisual | Route handler; no UI template | src/app/api/studio/editorial-assets/image/route.ts |
| /api/studio/editorial-order | api-nonvisual | Route handler; no UI template | src/app/api/studio/editorial-order/route.ts |
| /api/studio/health-context | api-nonvisual | Route handler; no UI template | src/app/api/studio/health-context/route.ts |
| /api/studio/homepage-options | api-nonvisual | Route handler; no UI template | src/app/api/studio/homepage-options/route.ts |
| /api/studio/inquiry-handoff | api-nonvisual | Route handler; no UI template | src/app/api/studio/inquiry-handoff/route.ts |
| /api/studio/media | api-nonvisual | Route handler; no UI template | src/app/api/studio/media/route.ts |
| /api/studio/operations | api-nonvisual | Route handler; no UI template | src/app/api/studio/operations/route.ts |
| /api/studio/orders | api-nonvisual | Route handler; no UI template | src/app/api/studio/orders/route.ts |
| /api/studio/presentation | api-nonvisual | Route handler; no UI template | src/app/api/studio/presentation/route.ts |
| /api/studio/privacy | api-nonvisual | Route handler; no UI template | src/app/api/studio/privacy/route.ts |
| /api/studio/references/[id] | api-nonvisual | Route handler; no UI template | src/app/api/studio/references/[id]/route.ts |
| /api/studio/revisions | api-nonvisual | Route handler; no UI template | src/app/api/studio/revisions/route.ts |
| /api/studio/route-review | api-nonvisual | Route handler; no UI template | src/app/api/studio/route-review/route.ts |
| /api/studio/settings | api-nonvisual | Route handler; no UI template | src/app/api/studio/settings/route.ts |
| /api/studio/site-settings | api-nonvisual | Route handler; no UI template | src/app/api/studio/site-settings/route.ts |
| /api/studio/work-queue | api-nonvisual | Route handler; no UI template | src/app/api/studio/work-queue/route.ts |
| /api/studio/workspace | api-nonvisual | Route handler; no UI template | src/app/api/studio/workspace/route.ts |
| /ar/[[...legacyPath]] | legacy-locale-handler | Route-owned response/redirect | src/app/ar/[[...legacyPath]]/route.ts |
| /architects | public-page-template | ApprovedExperience -> ShopSite -> EditorialPage/EditorialDocument | src/app/architects/page.tsx |
| /blog/[[...legacy]] | legacy-redirect-or-notice | Route-owned response/redirect | src/app/blog/[[...legacy]]/route.ts |
| /care | public-canonical-redirect | Permanent canonical redirect to /materials-care; query preserved | src/app/care/page.tsx |
| /commission | public-page-template | LegacyJourney -> ShopSite -> CollectionDocument; optional piece-query redirect | src/app/commission/page.tsx |
| /commission/customize | public-page-template | ShopShell + Intro + OrderForm | src/app/commission/customize/page.tsx |
| /contact | public-page-template | ApprovedExperience -> ShopSite -> EditorialPage/EditorialDocument | src/app/contact/page.tsx |
| /custom-order | legacy-redirect-or-notice | Route-owned response/redirect | src/app/custom-order/route.ts |
| /de/[[...legacyPath]] | legacy-locale-handler | Route-owned response/redirect | src/app/de/[[...legacyPath]]/route.ts |
| /editorial/[id] | public-media-nonvisual | Route handler; no UI template | src/app/editorial/[id]/route.ts |
| /en/[[...legacyPath]] | legacy-locale-handler | Route-owned response/redirect | src/app/en/[[...legacyPath]]/route.ts |
| /es/[[...legacyPath]] | legacy-locale-handler | Route-owned response/redirect | src/app/es/[[...legacyPath]]/route.ts |
| /faq | public-page-template | ShopSite -> EditorialDocument + FaqBrowser | src/app/faq/page.tsx |
| /faq/[slug] | public-page-template | ShopShell + EditorialDocument FAQ detail | src/app/faq/[slug]/page.tsx |
| /fr/[[...legacyPath]] | legacy-locale-handler | Route-owned response/redirect | src/app/fr/[[...legacyPath]]/route.ts |
| /gu/[[...legacyPath]] | legacy-locale-handler | Route-owned response/redirect | src/app/gu/[[...legacyPath]]/route.ts |
| /hi/[[...legacyPath]] | legacy-locale-handler | Route-owned response/redirect | src/app/hi/[[...legacyPath]]/route.ts |
| /imprint | public-page-template | ApprovedExperience -> ShopSite -> EditorialPage/EditorialDocument | src/app/imprint/page.tsx |
| /inquiry/received | public-page-template | ShopShell + SavedReceipt / Feedback; protected receipt session | src/app/inquiry/received/page.tsx |
| /ja/[[...legacyPath]] | legacy-locale-handler | Route-owned response/redirect | src/app/ja/[[...legacyPath]]/route.ts |
| /journal | public-page-template | ShopSite -> EditorialPage -> JournalDocument + JournalBrowser | src/app/journal/page.tsx |
| /journal/[slug] | public-page-template | ShopSite -> EditorialDocument article; canonical alias handling | src/app/journal/[slug]/page.tsx |
| /large-resin-art | legacy-redirect-or-notice | Route-owned response/redirect | src/app/large-resin-art/route.ts |
| /materials | public-canonical-redirect | Permanent canonical redirect to /materials-care; query preserved | src/app/materials/page.tsx |
| /materials-care | public-page-template | ApprovedExperience -> ShopSite -> EditorialPage/EditorialDocument | src/app/materials-care/page.tsx |
| /our-story | public-page-template | ApprovedExperience -> ShopSite -> EditorialPage/EditorialDocument | src/app/our-story/page.tsx |
| /p/[slug] | public-page-template | ShopShell + EditorialDocument or LandingDocumentView | src/app/p/[slug]/page.tsx |
| /personalize | public-page-template | LegacyJourney -> ShopSite catalogue selector; optional piece-query redirect | src/app/personalize/page.tsx |
| /pieces/[slug] | public-page-template | ShopSite -> Gallery + product detail + related ProductCard | src/app/pieces/[slug]/page.tsx |
| /pieces/[slug]/customize | public-page-template | ShopSite -> OrderForm entry | src/app/pieces/[slug]/customize/page.tsx |
| /portfolio | public-page-template | ShopShell + PortfolioIndex + EditorialArchive | src/app/portfolio/page.tsx |
| /portfolio/[slug] | public-page-template | ShopShell + EditorialDocument concept/evidenced record; approved ProjectStory fallback | src/app/portfolio/[slug]/page.tsx |
| /preserve | public-page-template | LegacyJourney -> ShopSite catalogue selector; optional piece-query redirect | src/app/preserve/page.tsx |
| /preview/states | disabled-legacy-state-route | @/components/rivya/approved-entry | src/app/preview/states/page.tsx |
| /preview/states/[kind] | disabled-legacy-state-route | @/components/rivya/approved-entry | src/app/preview/states/[kind]/page.tsx |
| /preview/studio | authenticated-legacy-redirect | @/lib/studio-auth | src/app/preview/studio/page.tsx |
| /preview/studio/[...path] | authenticated-legacy-redirect | @/lib/studio-auth | src/app/preview/studio/[...path]/page.tsx |
| /preview/studio/content | authenticated-legacy-redirect | @/lib/studio-auth | src/app/preview/studio/content/page.tsx |
| /preview/studio/content/[id] | authenticated-legacy-redirect | @/lib/studio-auth | src/app/preview/studio/content/[id]/page.tsx |
| /preview/studio/content/new | authenticated-legacy-redirect | @/lib/studio-auth | src/app/preview/studio/content/new/page.tsx |
| /preview/studio/media | authenticated-legacy-redirect | @/lib/studio-auth | src/app/preview/studio/media/page.tsx |
| /preview/studio/modules/[module] | authenticated-legacy-redirect | @/lib/studio-auth | src/app/preview/studio/modules/[module]/page.tsx |
| /preview/studio/products | authenticated-legacy-redirect | @/lib/studio-auth | src/app/preview/studio/products/page.tsx |
| /preview/studio/products/[id] | authenticated-legacy-redirect | @/lib/studio-auth | src/app/preview/studio/products/[id]/page.tsx |
| /preview/studio/products/[id]/form | authenticated-legacy-redirect | @/lib/studio-auth | src/app/preview/studio/products/[id]/form/page.tsx |
| /preview/studio/products/new | authenticated-legacy-redirect | @/lib/studio-auth | src/app/preview/studio/products/new/page.tsx |
| /privacy | public-page-template | ApprovedExperience -> ShopSite -> EditorialPage/EditorialDocument | src/app/privacy/page.tsx |
| /process | public-page-template | ApprovedExperience -> ShopSite -> EditorialPage/EditorialDocument | src/app/process/page.tsx |
| /product/[slug] | legacy-redirect-or-notice | Route-owned response/redirect | src/app/product/[slug]/route.ts |
| /returns-cancellations | public-page-template | ApprovedExperience -> ShopSite -> EditorialPage/EditorialDocument | src/app/returns-cancellations/page.tsx |
| /saved-pieces | public-page-template | ShopShell + Intro + SavedPieces | src/app/saved-pieces/page.tsx |
| /search | public-page-template | ApprovedExperience -> ShopSite -> CollectionDocument + CatalogueBrowser + GroupedDiscovery | src/app/search/page.tsx |
| /shipping-delivery | public-page-template | ApprovedExperience -> ShopSite -> EditorialPage/EditorialDocument | src/app/shipping-delivery/page.tsx |
| /shop/[[...legacy]] | legacy-redirect-or-notice | Route-owned response/redirect | src/app/shop/[[...legacy]]/route.ts |
| /studio | private-workspace | PrivateStudioEntry -> Workspace -> Operations overview | src/app/studio/page.tsx |
| /studio/[...path] | private-workspace | PrivateStudioEntry -> Workspace -> moduleViews dispatch | src/app/studio/[...path]/page.tsx |
| /studio/editorial-order/preview | authenticated-preview | @/components/shop/public-pages.module.css; @/components/studio/saved-preview-frame; @/components/shop/editorial-entry-card; @/components/shop/migration-public.module.css | src/app/studio/editorial-order/preview/page.tsx |
| /studio/editorial-order/preview/frame | authenticated-preview | Route-owned response/redirect | src/app/studio/editorial-order/preview/frame/page.tsx |
| /studio/forgot-password | studio-access | AccessRequestForm recovery -> StudioAccessShell | src/app/studio/forgot-password/page.tsx |
| /studio/inquiries/[id]/card | private-print | @/components/studio/print-card-button; @/components/studio/inquiry-card.module.css | src/app/studio/inquiries/[id]/card/page.tsx |
| /studio/login | studio-access | StudioLogin -> StudioAccessShell | src/app/studio/login/page.tsx |
| /studio/presentation/preview | authenticated-preview | @/components/shop/shop-shell; @/components/shop/homepage-document; @/components/shop/editorial; @/components/shop/collection-document; @/components/studio/workshop-template-preview; @/components/studio/saved-preview-frame | src/app/studio/presentation/preview/page.tsx |
| /studio/presentation/preview/frame | authenticated-preview | Route-owned response/redirect | src/app/studio/presentation/preview/frame/page.tsx |
| /studio/preview | authenticated-preview | @/components/shop/shop-shell; @/components/studio/saved-preview-frame | src/app/studio/preview/page.tsx |
| /studio/preview/frame | authenticated-preview | @/components/shop/shop-shell | src/app/studio/preview/frame/page.tsx |
| /studio/preview/states | authenticated-preview | @/components/studio/authoring-states | src/app/studio/preview/states/page.tsx |
| /studio/reference/[id] | private-reference | @/components/studio/reference-viewer | src/app/studio/reference/[id]/page.tsx |
| /studio/request-access | studio-access | AccessRequestForm -> StudioAccessShell | src/app/studio/request-access/page.tsx |
| /studio/set-password | studio-access | AccessPasswordForm -> StudioAccessShell | src/app/studio/set-password/page.tsx |
| /terms | public-page-template | ApprovedExperience -> ShopSite -> EditorialPage/EditorialDocument | src/app/terms/page.tsx |
| /testimonials | public-page-template | ShopShell + EditorialArchive | src/app/testimonials/page.tsx |
| /testimonials/[slug] | public-page-template | ShopShell + EditorialDocument with disclosure | src/app/testimonials/[slug]/page.tsx |
| /whatsapp-order | legacy-redirect-or-notice | Route-owned response/redirect | src/app/whatsapp-order/route.ts |
| /workshops | legacy-redirect-or-notice | Route-owned response/redirect | src/app/workshops/route.ts |
| /zh/[[...legacyPath]] | legacy-locale-handler | Route-owned response/redirect | src/app/zh/[[...legacyPath]]/route.ts |

## Dynamic expansion from existing registers

| Template | Registered URLs |
| --- | --- |
| /faq/[slug] | 120 |
| /journal/[slug] | 156 |
| /pieces/[slug] | 120 |
| /portfolio/[slug] | 120 |
| /testimonials/[slug] | 120 |

- Historical local HTTP statuses are not current production publication evidence.
- 480 M9 records were unpublished in the historical local QA register; do not publish them or treat their 404 as a new defect.
- Dynamic product customize pages reuse each valid published product slug; generated aliases do not create new templates.
- Stored content may add/remove/reorder sections; shared section renderers are the coverage boundary.
- Old 74-section manifest includes old-only material/step/workshop slots, not 74 currently published sections.

The three collection segments admitted by `findCollection` are `/collectible-design`, `/memory-art` and `/personal-art`. Product aliases canonicalize to current published slugs. `/commission`, `/preserve` and `/personalize` can redirect a recognized piece/product query into its customization form. Unsupported records retain existing not-found behavior.

## Full website section audit

The fullscreen column is a content-safe target, not an instruction to clip content. Every row is source-audited; the final implementation report and test receipt must identify verified results. Original content/visibility conditions remain authoritative.

| Page | Section | Fullscreen | Gradient type | Cursor effect | Media / parallax | Status |
| --- | --- | --- | --- | --- | --- | --- |
| All public pages | Navigation, language/search, mobile navigation | No | Continuous charcoal / restrained hover | CTA/nav hover only | No moving labels | Audited; verify final implementation |
| All public pages | Footer, legal/contact/social links | No | Gradual navy/charcoal continuation | Low-intensity ambient only | No | Audited; verify final implementation |
| / | pour — Hero | Yes / content-safe minimum | Media edge + reading scrim | Shared low-intensity spotlight | CinematicVideo + poster | Audited; verify final implementation |
| / | manifesto — Manifesto | Yes / content-safe minimum | Coordinated story/reading ambient | Shared low-intensity spotlight | Existing content; no invented media | Audited; verify final implementation |
| / | pieces — Featured pieces | Partial | Coordinated story/reading ambient | Card hover / restrained | Existing content; no invented media | Audited; verify final implementation |
| / | large-format — Large format | Yes / content-safe minimum | Coordinated story/reading ambient | Shared low-intensity spotlight | Existing content; no invented media | Audited; verify final implementation |
| / | material — Material story | Yes / content-safe minimum | Media edge + reading scrim | Shared low-intensity spotlight | Existing media only; subtle desktop transform | Audited; verify final implementation |
| / | collections — Collections | Yes / content-safe minimum | Coordinated story/reading ambient | Shared low-intensity spotlight | Existing content; no invented media | Audited; verify final implementation |
| / | furniture — Furniture concepts | Partial | Media edge + reading scrim | Card hover / restrained | Existing media only; subtle desktop transform | Audited; verify final implementation |
| / | maker — Atelier story | Yes / content-safe minimum | Media edge + reading scrim | Shared low-intensity spotlight | Existing media only; subtle desktop transform | Audited; verify final implementation |
| / | rooms — Room concepts | Yes / content-safe minimum | Media edge + reading scrim | Shared low-intensity spotlight | Existing media only; subtle desktop transform | Audited; verify final implementation |
| / | work — Portfolio | Partial | Media edge + reading scrim | Card hover / restrained | Existing media only; subtle desktop transform | Audited; verify final implementation |
| / | words — Testimonials | Partial | Coordinated story/reading ambient | Card hover / restrained | Existing content; no invented media | Audited; verify final implementation |
| / | bespoke — Commission band | Yes / content-safe minimum | Coordinated story/reading ambient | Shared low-intensity spotlight | Existing content; no invented media | Audited; verify final implementation |
| / | workshops — Workshops | Yes / content-safe minimum | Coordinated story/reading ambient | Shared low-intensity spotlight | Existing content; no invented media | Audited; verify final implementation |
| / | print — Printing | Yes / content-safe minimum | Coordinated story/reading ambient | Shared low-intensity spotlight | Existing content; no invented media | Audited; verify final implementation |
| / | process — How it works | Yes / content-safe minimum | Coordinated story/reading ambient | Shared low-intensity spotlight | Existing content; no invented media | Audited; verify final implementation |
| / | why — The approach | Yes / content-safe minimum | Coordinated story/reading ambient | Shared low-intensity spotlight | Existing content; no invented media | Audited; verify final implementation |
| / | journal — Journal | Partial | Coordinated story/reading ambient | Card hover / restrained | Existing content; no invented media | Audited; verify final implementation |
| / | closing — Closing invitation | Yes / content-safe minimum | Coordinated story/reading ambient | Shared low-intensity spotlight | Existing content; no invented media | Audited; verify final implementation |
| / | Resin in Motion | Yes / content-safe minimum | Video-edge fades + contrast overlay | Restrained media preset | CinematicVideo / MaterialFilm | Audited; verify final implementation |
| /collectible-design | browse — Find a piece for your space. | No | Reading or story preset; media fade if image exists | Restrained; no cursor effect over controls | Accurate product cards | Audited; verify final implementation |
| /collectible-design | proportion — The room is part of the brief. | Partial | Reading or story preset; media fade if image exists | Restrained; no cursor effect over controls | Only existing selected image/video | Audited; verify final implementation |
| /collectible-design | material — Read the grain. Notice the colour. | Partial | Reading or story preset; media fade if image exists | Restrained; no cursor effect over controls | Only existing selected image/video | Audited; verify final implementation |
| /collectible-design | delivery — Plan the arrival as well as the setting. | Partial | Reading or story preset; media fade if image exists | Restrained; no cursor effect over controls | Only existing selected image/video | Audited; verify final implementation |
| /collectible-design | next — Begin with a piece or a possibility. | Partial | Reading or story preset; media fade if image exists | Restrained; no cursor effect over controls | Only existing selected image/video | Audited; verify final implementation |
| /memory-art | browse — Find a format for the memory. | No | Reading or story preset; media fade if image exists | Restrained; no cursor effect over controls | Accurate product cards | Audited; verify final implementation |
| /memory-art | prepare — Keep the original with you for now. | Partial | Reading or story preset; media fade if image exists | Restrained; no cursor effect over controls | Only existing selected image/video | Audited; verify final implementation |
| /memory-art | appearance — Leave room for the material’s character. | Partial | Reading or story preset; media fade if image exists | Restrained; no cursor effect over controls | Only existing selected image/video | Audited; verify final implementation |
| /memory-art | care — Consider where the memory will live. | Partial | Reading or story preset; media fade if image exists | Restrained; no cursor effect over controls | Only existing selected image/video | Audited; verify final implementation |
| /memory-art | next — Tell us the story behind it. | Partial | Reading or story preset; media fade if image exists | Restrained; no cursor effect over controls | Only existing selected image/video | Audited; verify final implementation |
| /personal-art | browse — Find the right small gesture. | No | Reading or story preset; media fade if image exists | Restrained; no cursor effect over controls | Accurate product cards | Audited; verify final implementation |
| /personal-art | personalize — The small details deserve a second look. | Partial | Reading or story preset; media fade if image exists | Restrained; no cursor effect over controls | Only existing selected image/video | Audited; verify final implementation |
| /personal-art | expectations — Agree the practical details. | Partial | Reading or story preset; media fade if image exists | Restrained; no cursor effect over controls | Only existing selected image/video | Audited; verify final implementation |
| /personal-art | next — A thoughtful brief is a useful beginning. | Partial | Reading or story preset; media fade if image exists | Restrained; no cursor effect over controls | Only existing selected image/video | Audited; verify final implementation |
| /search | browse — Explore the published pieces. | No | Reading or story preset; media fade if image exists | Restrained; no cursor effect over controls | Accurate product cards | Audited; verify final implementation |
| /search | next — Still finding the direction? | Partial | Reading or story preset; media fade if image exists | Restrained; no cursor effect over controls | Only existing selected image/video | Audited; verify final implementation |
| /commission | choice — Two ways to begin. | Partial | Reading or story preset; media fade if image exists | Restrained; no cursor effect over controls | Only existing selected image/video | Audited; verify final implementation |
| /commission | browse — Begin with an existing design. | No | Reading or story preset; media fade if image exists | Restrained; no cursor effect over controls | Accurate product cards | Audited; verify final implementation |
| /commission | prepare — Bring context, not a finished specification. | Partial | Reading or story preset; media fade if image exists | Restrained; no cursor effect over controls | Only existing selected image/video | Audited; verify final implementation |
| /commission | agreement — The conversation comes before confirmation. | Partial | Reading or story preset; media fade if image exists | Restrained; no cursor effect over controls | Only existing selected image/video | Audited; verify final implementation |
| /journal | reading — A notebook for your next piece. | Partial | Reading or story preset; media fade if image exists | Restrained; no cursor effect over controls | Only existing selected image/video | Audited; verify final implementation |
| /our-story | point-of-view — A room, a memory, a personal gesture. | Partial | Reading or story preset; media fade if image exists | Restrained; no cursor effect over controls | Only existing selected image/video | Audited; verify final implementation |
| /our-story | material-conversation — Look closely at the meeting of materials. | Partial | Reading or story preset; media fade if image exists | Restrained; no cursor effect over controls | Only existing selected image/video | Audited; verify final implementation |
| /our-story | practice — A specification, shaped in conversation. | Partial | Reading or story preset; media fade if image exists | Restrained; no cursor effect over controls | Only existing selected image/video | Audited; verify final implementation |
| /our-story | atelier-contact — Meet the atelier through your brief. | Partial | Reading or story preset; media fade if image exists | Restrained; no cursor effect over controls | Only existing selected image/video | Audited; verify final implementation |
| /process | making-discussion — From design direction to material decisions. | Partial | Reading or story preset; media fade if image exists | Restrained; no cursor effect over controls | Only existing selected image/video | Audited; verify final implementation |
| /process | material-selection — Begin with the actual material. | Partial | Reading or story preset; media fade if image exists | Restrained; no cursor effect over controls | Only existing selected image/video | Audited; verify final implementation |
| /process | preparation-arrangement — Talk through preparation and arrangement. | Partial | Reading or story preset; media fade if image exists | Restrained; no cursor effect over controls | Only existing selected image/video | Audited; verify final implementation |
| /process | casting-curing — Ask what the chosen method requires. | Partial | Reading or story preset; media fade if image exists | Restrained; no cursor effect over controls | Only existing selected image/video | Audited; verify final implementation |
| /process | surface-finish — Read the edge, the surface and the finish. | Partial | Reading or story preset; media fade if image exists | Restrained; no cursor effect over controls | Only existing selected image/video | Audited; verify final implementation |
| /process | review-checks — Make the final review clear. | Partial | Reading or story preset; media fade if image exists | Restrained; no cursor effect over controls | Only existing selected image/video | Audited; verify final implementation |
| /process | timing — Discuss the sequence and the timing. | Partial | Reading or story preset; media fade if image exists | Restrained; no cursor effect over controls | Only existing selected image/video | Audited; verify final implementation |
| /process | arrival-and-care — Finish the conversation with arrival and care. | Partial | Reading or story preset; media fade if image exists | Restrained; no cursor effect over controls | Only existing selected image/video | Audited; verify final implementation |
| /materials-care | material-questions — Ask about the material in your piece. | Partial | Reading or story preset; media fade if image exists | Restrained; no cursor effect over controls | Only existing selected image/video | Audited; verify final implementation |
| /materials-care | keepsakes — Different objects need different conversations. | Partial | Reading or story preset; media fade if image exists | Restrained; no cursor effect over controls | Only existing selected image/video | Audited; verify final implementation |
| /architects | project-checklist — Give the setting a clear brief. | Partial | Reading or story preset; media fade if image exists | Restrained; no cursor effect over controls | Only existing selected image/video | Audited; verify final implementation |
| /architects | scope — Make the responsibilities explicit. | Partial | Reading or story preset; media fade if image exists | Restrained; no cursor effect over controls | Only existing selected image/video | Audited; verify final implementation |
| /collectible-design, /memory-art, /personal-art | Opening / collection feature | Partial | Story/gallery/media according to content | Shared pointer + card hover | Full-bleed eligible art-directed scene; preserve crop | Audited; verify final implementation |
| /collectible-design, /memory-art, /personal-art, /search, /commission | Browse, filters, sorts, pagination, no-results | No | Reading / utility ambient | Subtle external lighting; never replaces focus | No catalogue-image distortion; card hover only | Audited; verify final implementation |
| /preserve, /personalize | Chooser intro / collection feature / catalogue / invitation | Partial | Story/gallery/media according to content | Shared pointer + card hover | Existing approved feature image; natural chooser/grid | Audited; verify final implementation |
| /pieces/[slug] | Breadcrumb / product gallery / product facts / actions | Partial | Story/gallery/media according to content | Shared pointer + card hover | Contained exact product images and usable gallery | Audited; verify final implementation |
| /pieces/[slug] | Specifications, customization/care/delivery accordions | No | Reading / utility ambient | Subtle external lighting; never replaces focus | Static accurate detail | Audited; verify final implementation |
| /pieces/[slug] | Related pieces | No | Reading / utility ambient | Subtle external lighting; never replaces focus | Interactive card framing | Audited; verify final implementation |
| /pieces/[slug]/customize, /commission/customize | Intro / steps / fields / reference upload / summary / confirmation | No | Reading / utility ambient | Subtle external lighting; never replaces focus | Quiet ambient surround; no media behind fields | Audited; verify final implementation |
| /saved-pieces | Intro / saved grid / empty / removal feedback | No | Reading / utility ambient | Subtle external lighting; never replaces focus | Accurate product cards | Audited; verify final implementation |
| /inquiry/received | Receipt / summary / handoff / session-unavailable state | No | Reading / utility ambient | Subtle external lighting; never replaces focus | No decorative parallax | Audited; verify final implementation |
| /journal | Intro / lead prose / filters / featured / archive / pagination | Partial | Story/gallery/media according to content | Shared pointer + card hover | Card lighting; natural reading/filter height | Audited; verify final implementation |
| /journal/[slug] | Breadcrumb / lead image / disclosure / contents / body / related | Partial | Story/gallery/media according to content | Shared pointer + card hover | Full-bleed opening only where safe; body natural height | Audited; verify final implementation |
| /portfolio | Intro / filters / featured studies / archive / empty state | Partial | Story/gallery/media according to content | Shared pointer + card hover | Interactive image framing | Audited; verify final implementation |
| /portfolio/[slug] | Disclosure / opening / chapters / gallery / facts / related | Partial | Story/gallery/media according to content | Shared pointer + card hover | Existing gallery and preserved concept disclosure | Audited; verify final implementation |
| /testimonials | Intro / filterable statements / attribution / empty state | Partial | Story/gallery/media according to content | Shared pointer + card hover | Restrained reading preset; no fictional customer portraits | Audited; verify final implementation |
| /testimonials/[slug] | Disclosure / title / quote body / attribution / related | No | Reading / utility ambient | Subtle external lighting; never replaces focus | Reading-first layout | Audited; verify final implementation |
| /faq | Intro / search / groups / accordions / next steps | No | Reading / utility ambient | Subtle external lighting; never replaces focus | Restrained reading preset | Audited; verify final implementation |
| /faq/[slug] | Question / answer / policy links / next steps | No | Reading / utility ambient | Subtle external lighting; never replaces focus | Restrained reading preset | Audited; verify final implementation |
| /our-story, /process, /materials-care, /architects | Opening / saved chapters / optional film / shared bands / related | Partial | Story/gallery/media according to content | Shared pointer + card hover | Eligible full-bleed scenes and subtle image/video parallax | Audited; verify final implementation |
| /contact | Intro / real contact channels / page chapters / FAQ link | No | Reading / utility ambient | Subtle external lighting; never replaces focus | Calm field-safe ambient; no replacement business facts | Audited; verify final implementation |
| /privacy, /terms, /shipping-delivery, /returns-cancellations, /accessibility, /imprint | Intro / effective date / contents / complete policy / related policies / contact | No | Reading / utility ambient | Subtle external lighting; never replaces focus | Static legible reading/print layout | Audited; verify final implementation |
| /p/[slug] | Generic editorial page / custom landing blocks | Partial | Story/gallery/media according to content | Shared pointer + card hover | Depends on enabled block type | Audited; verify final implementation |
| System states | Not found / route error / root error / loading / holding / empty | No | Reading / utility ambient | Subtle external lighting; never replaces focus | Static brand backdrop; actionable recovery remains visible | Audited; verify final implementation |
| /p/[slug] and any saved landing document | Landing block: hero | Partial | Reading/gallery/story/media preset | Card hover or ambient, content-dependent | Existing block-selected images only | Audited; verify final implementation |
| /p/[slug] and any saved landing document | Landing block: richText | No | Reading/gallery/story/media preset | Card hover or ambient, content-dependent | Existing block-selected images only | Audited; verify final implementation |
| /p/[slug] and any saved landing document | Landing block: productGrid | No | Reading/gallery/story/media preset | Card hover or ambient, content-dependent | Existing block-selected images only | Audited; verify final implementation |
| /p/[slug] and any saved landing document | Landing block: imageCta | Partial | Reading/gallery/story/media preset | Card hover or ambient, content-dependent | Existing block-selected images only | Audited; verify final implementation |
| /p/[slug] and any saved landing document | Landing block: faqPicker | No | Reading/gallery/story/media preset | Card hover or ambient, content-dependent | Existing block-selected images only | Audited; verify final implementation |
| /p/[slug] and any saved landing document | Landing block: finalCta | Partial | Reading/gallery/story/media preset | Card hover or ambient, content-dependent | Existing block-selected images only | Audited; verify final implementation |
| /p/[slug] and any saved landing document | Landing block: collectionGrid | No | Reading/gallery/story/media preset | Card hover or ambient, content-dependent | Existing block-selected images only | Audited; verify final implementation |
| /p/[slug] and any saved landing document | Landing block: portfolioGrid | No | Reading/gallery/story/media preset | Card hover or ambient, content-dependent | Existing block-selected images only | Audited; verify final implementation |
| /p/[slug] and any saved landing document | Landing block: journalGrid | No | Reading/gallery/story/media preset | Card hover or ambient, content-dependent | Existing block-selected images only | Audited; verify final implementation |
| /p/[slug] and any saved landing document | Landing block: testimonial | No | Reading/gallery/story/media preset | Card hover or ambient, content-dependent | Existing block-selected images only | Audited; verify final implementation |
| /p/[slug] and any saved landing document | Landing block: testimonialGrid | No | Reading/gallery/story/media preset | Card hover or ambient, content-dependent | Existing block-selected images only | Audited; verify final implementation |
| /p/[slug] and any saved landing document | Landing block: videoHero | Partial | Reading/gallery/story/media preset | Card hover or ambient, content-dependent | Existing MaterialFilm when selected | Audited; verify final implementation |
| /p/[slug] and any saved landing document | Landing block: videoStory | Partial | Reading/gallery/story/media preset | Card hover or ambient, content-dependent | Existing MaterialFilm when selected | Audited; verify final implementation |
| /p/[slug] and any saved landing document | Landing block: masonryGallery | Partial | Reading/gallery/story/media preset | Card hover or ambient, content-dependent | Saved gallery images; existing lightbox | Audited; verify final implementation |
| /p/[slug] and any saved landing document | Landing block: bentoGallery | Partial | Reading/gallery/story/media preset | Card hover or ambient, content-dependent | Saved gallery images; existing lightbox | Audited; verify final implementation |
| /p/[slug] and any saved landing document | Landing block: fullscreenGallery | Partial | Reading/gallery/story/media preset | Card hover or ambient, content-dependent | Saved gallery images; existing lightbox | Audited; verify final implementation |
| /studio | Overview / shared shell / body controls | No | Restrained Studio ambient | Shell only; tables/inputs unaffected | No video/parallax in productivity panels | Audited; verify final implementation |
| /studio/inquiries | Inquiries & orders / shared shell / body controls | No | Restrained Studio ambient | Shell only; tables/inputs unaffected | No video/parallax in productivity panels | Audited; verify final implementation |
| /studio/follow-ups | Follow-ups due / shared shell / body controls | No | Restrained Studio ambient | Shell only; tables/inputs unaffected | No video/parallax in productivity panels | Audited; verify final implementation |
| /studio/products | Products / shared shell / body controls | No | Restrained Studio ambient | Shell only; tables/inputs unaffected | No video/parallax in productivity panels | Audited; verify final implementation |
| /studio/content-register | Production register / shared shell / body controls | No | Restrained Studio ambient | Shell only; tables/inputs unaffected | No video/parallax in productivity panels | Audited; verify final implementation |
| /studio/editorial-order | Editorial ordering / shared shell / body controls | No | Restrained Studio ambient | Shell only; tables/inputs unaffected | No video/parallax in productivity panels | Audited; verify final implementation |
| /studio/content | All content / shared shell / body controls | No | Restrained Studio ambient | Shell only; tables/inputs unaffected | No video/parallax in productivity panels | Audited; verify final implementation |
| /studio/media | Public media / shared shell / body controls | No | Restrained Studio ambient | Shell only; tables/inputs unaffected | No video/parallax in productivity panels | Audited; verify final implementation |
| /studio/site-copy | Site copy / shared shell / body controls | No | Restrained Studio ambient | Shell only; tables/inputs unaffected | No video/parallax in productivity panels | Audited; verify final implementation |
| /studio/sections | Page design / shared shell / body controls | No | Restrained Studio ambient | Shell only; tables/inputs unaffected | No video/parallax in productivity panels | Audited; verify final implementation |
| /studio/site-images | Site images / shared shell / body controls | No | Restrained Studio ambient | Shell only; tables/inputs unaffected | No video/parallax in productivity panels | Audited; verify final implementation |
| /studio/content-health | Content health / shared shell / body controls | No | Restrained Studio ambient | Shell only; tables/inputs unaffected | No video/parallax in productivity panels | Audited; verify final implementation |
| /studio/navigation | Navigation & languages / shared shell / body controls | No | Restrained Studio ambient | Shell only; tables/inputs unaffected | No video/parallax in productivity panels | Audited; verify final implementation |
| /studio/legacy | Legacy decisions / shared shell / body controls | No | Restrained Studio ambient | Shell only; tables/inputs unaffected | No video/parallax in productivity panels | Audited; verify final implementation |
| /studio/translations | Language review / shared shell / body controls | No | Restrained Studio ambient | Shell only; tables/inputs unaffected | No video/parallax in productivity panels | Audited; verify final implementation |
| /studio/route-review | Old links & publication / shared shell / body controls | No | Restrained Studio ambient | Shell only; tables/inputs unaffected | No video/parallax in productivity panels | Audited; verify final implementation |
| /studio/activity | Activity & logs / shared shell / body controls | No | Restrained Studio ambient | Shell only; tables/inputs unaffected | No video/parallax in productivity panels | Audited; verify final implementation |
| /studio/staff | Staff access / shared shell / body controls | No | Restrained Studio ambient | Shell only; tables/inputs unaffected | No video/parallax in productivity panels | Audited; verify final implementation |
| /studio/settings | Atelier settings / shared shell / body controls | No | Restrained Studio ambient | Shell only; tables/inputs unaffected | No video/parallax in productivity panels | Audited; verify final implementation |
| /studio/analytics | Analytics / shared shell / body controls | No | Restrained Studio ambient | Shell only; tables/inputs unaffected | No video/parallax in productivity panels | Audited; verify final implementation |
| /studio/categories | Categories / shared shell / body controls | No | Restrained Studio ambient | Shell only; tables/inputs unaffected | No video/parallax in productivity panels | Audited; verify final implementation |
| /studio/import | Bulk import / shared shell / body controls | No | Restrained Studio ambient | Shell only; tables/inputs unaffected | No video/parallax in productivity panels | Audited; verify final implementation |
| /studio/exports | Exports / shared shell / body controls | No | Restrained Studio ambient | Shell only; tables/inputs unaffected | No video/parallax in productivity panels | Audited; verify final implementation |
| /studio/research | Research / shared shell / body controls | No | Restrained Studio ambient | Shell only; tables/inputs unaffected | No video/parallax in productivity panels | Audited; verify final implementation |
| /studio/content-gaps | Content gaps / shared shell / body controls | No | Restrained Studio ambient | Shell only; tables/inputs unaffected | No video/parallax in productivity panels | Audited; verify final implementation |
| /studio/process | Process steps / shared shell / body controls | No | Restrained Studio ambient | Shell only; tables/inputs unaffected | No video/parallax in productivity panels | Audited; verify final implementation |
| /studio/materials | Materials / shared shell / body controls | No | Restrained Studio ambient | Shell only; tables/inputs unaffected | No video/parallax in productivity panels | Audited; verify final implementation |
| /studio/forms | Commission forms / shared shell / body controls | No | Restrained Studio ambient | Shell only; tables/inputs unaffected | No video/parallax in productivity panels | Audited; verify final implementation |
| /studio/journal | Journal / shared shell / body controls | No | Restrained Studio ambient | Shell only; tables/inputs unaffected | No video/parallax in productivity panels | Audited; verify final implementation |
| /studio/portfolio | Portfolio / shared shell / body controls | No | Restrained Studio ambient | Shell only; tables/inputs unaffected | No video/parallax in productivity panels | Audited; verify final implementation |
| /studio/testimonials | Testimonials / shared shell / body controls | No | Restrained Studio ambient | Shell only; tables/inputs unaffected | No video/parallax in productivity panels | Audited; verify final implementation |
| /studio/faqs | FAQs / shared shell / body controls | No | Restrained Studio ambient | Shell only; tables/inputs unaffected | No video/parallax in productivity panels | Audited; verify final implementation |
| /studio/pages | Pages / shared shell / body controls | No | Restrained Studio ambient | Shell only; tables/inputs unaffected | No video/parallax in productivity panels | Audited; verify final implementation |
| /studio/landing-pages | Landing pages / shared shell / body controls | No | Restrained Studio ambient | Shell only; tables/inputs unaffected | No video/parallax in productivity panels | Audited; verify final implementation |
| /studio/seo | SEO / shared shell / body controls | No | Restrained Studio ambient | Shell only; tables/inputs unaffected | No video/parallax in productivity panels | Audited; verify final implementation |
| /studio/subscribers | Subscribers / shared shell / body controls | No | Restrained Studio ambient | Shell only; tables/inputs unaffected | No video/parallax in productivity panels | Audited; verify final implementation |
| /studio/content-lab | Content lab / shared shell / body controls | No | Restrained Studio ambient | Shell only; tables/inputs unaffected | No video/parallax in productivity panels | Audited; verify final implementation |
| /studio/editorial-order/preview | authenticated-preview | No | Access: branded glass; previews: exact page; print: static | Access/shell only, disabled in print | Saved media only | Audited; verify final implementation |
| /studio/editorial-order/preview/frame | authenticated-preview | No | Access: branded glass; previews: exact page; print: static | Access/shell only, disabled in print | Saved media only | Audited; verify final implementation |
| /studio/forgot-password | studio-access | No | Access: branded glass; previews: exact page; print: static | Access/shell only, disabled in print | Saved media only | Audited; verify final implementation |
| /studio/inquiries/[id]/card | private-print | No | Access: branded glass; previews: exact page; print: static | Access/shell only, disabled in print | Saved media only | Audited; verify final implementation |
| /studio/login | studio-access | No | Access: branded glass; previews: exact page; print: static | Access/shell only, disabled in print | Saved media only | Audited; verify final implementation |
| /studio/presentation/preview | authenticated-preview | No | Access: branded glass; previews: exact page; print: static | Access/shell only, disabled in print | Saved media only | Audited; verify final implementation |
| /studio/presentation/preview/frame | authenticated-preview | No | Access: branded glass; previews: exact page; print: static | Access/shell only, disabled in print | Saved media only | Audited; verify final implementation |
| /studio/preview | authenticated-preview | No | Access: branded glass; previews: exact page; print: static | Access/shell only, disabled in print | Saved media only | Audited; verify final implementation |
| /studio/preview/frame | authenticated-preview | No | Access: branded glass; previews: exact page; print: static | Access/shell only, disabled in print | Saved media only | Audited; verify final implementation |
| /studio/preview/states | authenticated-preview | No | Access: branded glass; previews: exact page; print: static | Access/shell only, disabled in print | Saved media only | Audited; verify final implementation |
| /studio/reference/[id] | private-reference | No | Access: branded glass; previews: exact page; print: static | Access/shell only, disabled in print | Saved media only | Audited; verify final implementation |
| /studio/request-access | studio-access | No | Access: branded glass; previews: exact page; print: static | Access/shell only, disabled in print | Saved media only | Audited; verify final implementation |
| /studio/set-password | studio-access | No | Access: branded glass; previews: exact page; print: static | Access/shell only, disabled in print | Saved media only | Audited; verify final implementation |

## Studio module ownership

| Route | Label | Renderer | Admin only | Aliases |
| --- | --- | --- | --- | --- |
| /studio | Overview | Operations | No | None |
| /studio/inquiries | Inquiries & orders | InquiryBoard | No | /studio/orders, /studio/kanban, /studio/enquiries |
| /studio/follow-ups | Follow-ups due | InquiryBoard | No | None |
| /studio/products | Products | CatalogueEditor | No | None |
| /studio/content-register | Production register | ContentRegister | No | None |
| /studio/editorial-order | Editorial ordering | EditorialOrderEditor | No | None |
| /studio/content | All content | EditorialLibrary | No | None |
| /studio/media | Public media | MediaLibrary | No | None |
| /studio/site-copy | Site copy | SiteCopyEditor | No | None |
| /studio/sections | Page design | PresentationEditor | No | None |
| /studio/site-images | Site images | SiteImagesEditor | No | None |
| /studio/content-health | Content health | ContentHealth | No | None |
| /studio/navigation | Navigation & languages | SiteSettingsEditor | Yes | None |
| /studio/legacy | Legacy decisions | LegacyDisposition | Yes | None |
| /studio/translations | Language review | TranslationWorkspace | No | None |
| /studio/route-review | Old links & publication | RouteReview | Yes | None |
| /studio/activity | Activity & logs | Operations | No | None |
| /studio/staff | Staff access | StaffEditor | Yes | /studio/users |
| /studio/settings | Atelier settings | Operations | Yes | None |
| /studio/analytics | Analytics | AnalyticsPanel | No | None |
| /studio/categories | Categories | CatalogueCategories | No | None |
| /studio/import | Bulk import | ConditionalWorkspace | Yes | None |
| /studio/exports | Exports | Operations | Yes | None |
| /studio/research | Research | EditorialDesk | No | None |
| /studio/content-gaps | Content gaps | ContentHealth | No | None |
| /studio/process | Process steps | ContentEditor | No | None |
| /studio/materials | Materials | ContentEditor | No | None |
| /studio/forms | Commission forms | CatalogueEditor | No | None |
| /studio/journal | Journal | EditorialLibrary | No | /studio/blog |
| /studio/portfolio | Portfolio | EditorialLibrary | No | None |
| /studio/testimonials | Testimonials | EditorialLibrary | No | None |
| /studio/faqs | FAQs | EditorialLibrary | No | None |
| /studio/pages | Pages | EditorialLibrary | No | None |
| /studio/landing-pages | Landing pages | EditorialLibrary | No | /studio/custom-pages |
| /studio/seo | SEO | EditorialDesk | No | None |
| /studio/subscribers | Subscribers | ConditionalWorkspace | Yes | None |
| /studio/content-lab | Content lab | EditorialDesk | No | None |

Record-child adapters exist for inquiries, products, journal, portfolio, testimonials, FAQs, pages and landing pages. They canonicalize supported child IDs into `?record=` or `?create=1`; they do not define independent editor pages. Conditional import/subscriber surfaces must remain honest about unavailable services.

## Intentional visual exceptions

- APIs, media handlers, robots and sitemap have no visual layout; preserve their contracts.
- Legacy locale handlers use 307 handoffs. Legacy product/shop/blog/custom-order/workshop handlers use existing 308/404/410 decisions; their minimal notices remain usable without JavaScript and under restrictive CSP.
- `/about`, `/materials` and `/care` are canonical redirects, not duplicate redesign targets.
- `/preview/studio/*` requires real Studio auth and redirects to current Studio destinations. `/preview/states*` remains explicitly disabled. Do not revive old fixture UI.
- Private print cards and root error fallbacks prioritize legibility, privacy and recovery. No cursor/video canvas in print.
- Text-heavy chapters, FAQs, filters, forms, galleries, lists and operational tables retain natural height. No animation may obscure disclosures, focus, labels or business facts.

## Source evidence

Active route files in `src/app`; `src/lib/studio-modules.ts`; `src/lib/home-reference-model.ts`; `src/lib/page-design-model.ts`; `src/lib/landing-model.ts`; `src/lib/detailed-pages.ts`; `src/lib/content-model.ts`; `ShopSite`, `EditorialDocument`, `CollectionDocument`, `LandingDocumentView`, `Workspace`; prior route coverage and M9 manifest used only for URL expansion.

## Metadata, layout and system-state adapters

These source files are separate from the 109 page/route adapters and are explicitly included in the audit. Metadata retains its existing nonvisual contract. Error/loading/not-found surfaces need static, readable recovery treatment.

| Source | Classification | Scope |
| --- | --- | --- |
| src/app/robots.ts | metadata-nonvisual | Preserve metadata, crawl and route discovery contracts; no redesign |
| src/app/sitemap.ts | metadata-nonvisual | Preserve metadata, crawl and route discovery contracts; no redesign |
| src/app/accessibility/loading.tsx | system-visual-state | Preserve authentication/layout ownership, loading stability and actionable recovery |
| src/app/architects/loading.tsx | system-visual-state | Preserve authentication/layout ownership, loading stability and actionable recovery |
| src/app/contact/loading.tsx | system-visual-state | Preserve authentication/layout ownership, loading stability and actionable recovery |
| src/app/error.tsx | system-visual-state | Preserve authentication/layout ownership, loading stability and actionable recovery |
| src/app/global-error.tsx | system-visual-state | Preserve authentication/layout ownership, loading stability and actionable recovery |
| src/app/layout.tsx | shared-layout | Preserve authentication/layout ownership, loading stability and actionable recovery |
| src/app/materials-care/loading.tsx | system-visual-state | Preserve authentication/layout ownership, loading stability and actionable recovery |
| src/app/not-found.tsx | system-visual-state | Preserve authentication/layout ownership, loading stability and actionable recovery |
| src/app/our-story/loading.tsx | system-visual-state | Preserve authentication/layout ownership, loading stability and actionable recovery |
| src/app/preview/studio/error.tsx | system-visual-state | Preserve authentication/layout ownership, loading stability and actionable recovery |
| src/app/preview/studio/layout.tsx | shared-layout | Preserve authentication/layout ownership, loading stability and actionable recovery |
| src/app/preview/studio/not-found.tsx | system-visual-state | Preserve authentication/layout ownership, loading stability and actionable recovery |
| src/app/privacy/loading.tsx | system-visual-state | Preserve authentication/layout ownership, loading stability and actionable recovery |
| src/app/process/loading.tsx | system-visual-state | Preserve authentication/layout ownership, loading stability and actionable recovery |
| src/app/returns-cancellations/loading.tsx | system-visual-state | Preserve authentication/layout ownership, loading stability and actionable recovery |
| src/app/shipping-delivery/loading.tsx | system-visual-state | Preserve authentication/layout ownership, loading stability and actionable recovery |
| src/app/studio/error.tsx | system-visual-state | Preserve authentication/layout ownership, loading stability and actionable recovery |
| src/app/studio/layout.tsx | shared-layout | Preserve authentication/layout ownership, loading stability and actionable recovery |
| src/app/terms/loading.tsx | system-visual-state | Preserve authentication/layout ownership, loading stability and actionable recovery |
