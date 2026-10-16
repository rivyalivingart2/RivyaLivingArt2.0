# Public inner-page implementation register

16 October 2026. Local extension of the existing cinematic branch; no publication, migration, route, API, product, contact, translation, media-association or permission change. This register records source implementation and the focused checks performed by the public-template contributor. The parent verification report records the subsequent integrated browser/build results.

## Active template trace

The public route entry points resolve through `ApprovedExperience` / `ShopSite` or their direct `ShopShell` equivalents. The active inner-page surface is `ShopFrame` with `publicDesign`, which supplies `public-pages.module.css`. Older `components/rivya/public-pages.tsx` demo compositions are not the production renderers being restyled here.

| Route family | Active template / sections | Fullscreen treatment | Atmosphere and media |
|---|---|---|---|
| `/collectible-design`, `/memory-art`, `/personal-art`, `/commission`, `/preserve`, `/personalize` | `CollectionDocument`: opening, contents, published chapters, browse/results, guidance | Opening uses remaining viewport minimum; eligible narrative chapters use 100svh; browse/results grow naturally | Story/media/gallery hooks. Existing split or full presentation choice retained. Full saved hero media uses `ChapterMedia` with saved focal point and stationary caption |
| `/search` | Collection opening, grouped discovery, filters, results, guidance | Natural height throughout | Restrained reading/gallery surface; search is available without a decorative full-height introduction |
| `/our-story`, `/process`, `/materials-care`, `/architects` | `EditorialDocument`, `ReferenceChapters`, `ReferencePageAdditions`; supported film and shared material/process sections | Safe viewport story chapters; selected media chapters use full bleed; technical/checklist chapters and accordions remain natural | Continuous charcoal edges; story, media and reading hooks; existing published film renderer retained |
| `/journal` | `JournalDocument` / `JournalBrowser`, intro, lead text, featured stories, filters, archive and pagination | Intro gets an immersive minimum; archive and prose grow naturally | Editorial dark canvas; article cards join shared pointer lighting; original filters and ordering untouched |
| `/journal/[slug]` | `EditorialDocument`: breadcrumb, title/media, byline, contents, prose, galleries, related stories | Image-bearing opening becomes an editorial two-column viewport composition on desktop; reading remains natural | Reading lighting stays restrained, original captions/crops and all text preserved |
| `/portfolio`, `/testimonials` | Existing index intro plus `EditorialArchive` and shared entry cards | Intro inherits the viewport presentation; archive remains a natural gallery | Shared dark surface, quiet borders and readable original concept/fictional disclosures |
| `/portfolio/[slug]` editorial record | `EditorialDocument`: disclosure, title/media, chapters, gallery, details and related cards | Applicable opening/media story sections; prose/details natural | Same editorial system; no sample is relabelled as genuine |
| `/portfolio/[slug]` approved-project fallback | `ProjectStory`: title/image, setting, brief, response, specifications, gallery and actions | Viewport editorial opening; reading and gallery natural | Accurate contained lead photograph rather than a decorative crop; original project facts and captions unchanged |
| `/testimonials/[slug]`, `/faq/[slug]` | `EditorialDocument` reading/detail path | Natural reading with clear title hierarchy | Restrained reading gradient, original classification and policy links retained |
| `/faq` | Intro, question filters, question index, groups/accordions, empty state and pagination | Natural height, including compact opening | Dark reading surface; visible gold links, unchanged filtering and disclosure behavior |
| `/contact` | Intro, business contact methods, FAQ link and existing sections | Compact opening and natural contact grid | Quiet form preset; no change to phone, email, map or request destinations |
| `/privacy`, `/terms`, `/shipping-delivery`, `/returns-cancellations`, `/accessibility`, `/imprint` | Intro, effective date, sticky contents, legal prose, contact bindings and policy navigation | Natural height | Dark restrained reading canvas with white/black print rendering preserved |
| `/p/[slug]` | `EditorialDocument` or `LandingDocumentView` | Eligible image CTA, hero and final CTA blocks use safe 100svh minimum; rich text, grids, FAQ, quotes and gallery grow naturally | All 16 supported landing block types inherit the system; full-bleed blocks preserve original copy/actions/captions; video blocks keep original published film |
| `/pieces/[slug]` | Parent-owned `ShopSite` / `Gallery`, detail copy, specifications, accordions and related products | Viewport minimum for overall detail composition, natural content height | Shared public CSS supplies calm dark surface; product image gallery, enlargement and controls are not replaced |
| `/pieces/[slug]/customize`, `/commission/customize` | Existing `OrderForm`, review and summary | Natural height | Restrained reading surface, comfortable inputs, visible focus and calm summary panel; no behavior change |
| `/saved-pieces`, `/inquiry/received`, unavailable/error screens | Existing saved cards, private receipt, feedback | Saved/receipt data grows naturally; feedback uses a viewport minimum | Shared public surface applies without changing persistence, receipt keys or retry behavior |
| `/about`, `/materials`, `/care` | Existing permanent redirects | Not applicable | Continue to `/our-story` and `/materials-care` with existing query/anchor behavior |
| Studio saved-content and presentation frames | Existing authenticated `ShopShell publicDesign` previews reuse the same renderers | Same rules as the public target | Current/saved snapshot selection and preview permissions untouched |

## Composition and shared hooks

- `data-atmosphere="story|media|gallery|reading|form"` marks stable sections for the parent-owned global lighting controller.
- `data-reveal` is limited to headings. No server-rendered text is hidden by these components.
- `data-cinematic-parallax` and its child `data-cinematic-parallax-layer` are provided by the new `ChapterMedia` companion. On eligible desktops the layer is 108% tall; touch and reduced-motion layouts retain a still image. The parent runtime owns animation and cleanup.
- `ChapterMedia` delegates actual rendering to the existing `EditorialImage`. Saved desktop/mobile crop coordinates, alt text, source and priority behavior are retained. It passes `caption: ''` to the moving layer and renders the complete original caption in a normal-flow sibling. Caption length therefore increases section height rather than colliding with body copy.
- Technical material metadata, checklists and accordion bodies are deliberately excluded from full-bleed chapter conversion. Existing saved `prose` chapters remain content-led. Eligible saved `split`, `reverse` or `statement` chapters receive an image background and directional shading.
- Public colours derive from the parent-owned `--cinema-edge`, `--cinema-primary`, `--cinema-ambient` and `--cinema-canvas` tokens with local fallbacks. Primary story sections use the deeper preset; prose uses the quieter ambient preset. High-information controls have bounded surfaces instead of moving media.
- At narrow widths, prose chapters and grids grow naturally. Immersive image chapters retain a minimum viewport but can grow. Project opening media switches to a stacked composition; articles stack their original image beneath their heading. No fixed screen height is added.

## Changed source

New `src/components/shop/chapter-media.tsx`.

Updated `reference-chapters.tsx`, `collection-document.tsx`, `landing-document.tsx`, `editorial.tsx`, `editorial-chapter.tsx`, `project-story.tsx`, `public-pages.module.css`, `reference-pages.module.css`, and the `projectOpening` class in `editorial-reading.module.css`.

No new package or remote component code is added by this contribution. Existing Next Image / EditorialImage / MaterialFilm and the parent-owned GSAP and lighting system are reused. Schema, published documents, media files, locale logic, links, SEO structured data, publication queries and form handlers were not changed.

## Focused verification and handoff

- Focused ESLint on all seven changed/new TSX components: passed with zero output/errors.
- PostCSS parsing of the three modified stylesheets: passed.
- `git diff --check` on the owned files: passed.
- Source route/template tracing completed, including dynamic editorial, landing and approved-project fallback paths.
- No build or browser was started by this contributor so the parent could preserve a stable running baseline. Integrated type/build checks, viewport screenshots, gradient interaction, print and content preservation checks remain the parent verification task until its receipts exist.

Recommended integrated samples: a full-image Our Story opening; Process timeline; Materials accordion; a split collection opening; a product gallery and enlarged view; an article with image and long heading; Portfolio disclosures; FAQ filters; a long policy print; Contact; a custom form; and a landing image CTA with a long caption. Verify 320px captions and heading flow, then desktop parallax/lighting with reduced-motion disabled. Confirm the full-bleed media layer never moves its credit or clickable content.
