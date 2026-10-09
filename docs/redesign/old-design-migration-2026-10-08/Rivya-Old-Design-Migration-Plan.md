# Rivya Living Art old design migration and improvement plan

Prepared 8 October 2026. **Deliverable status: analysis and implementation plan, not a completed migration.** This is a new brief, separate from the cancelled design audit. The current working application remains the base; the old site supplies the desired appearance, page depth and motion language.

## 1 Decision and scope

Reproduce the old website's recognizable visual system and detailed page structures across equivalent current pages. Reproduce the old Studio's grouped navigation, working layouts, tables, editors and module separation while preserving the current application's working authentication, publication, permission, inquiry and revision contracts.

“Same” means matching the relevant page composition, hierarchy, typography, palette, spacing, media treatment and interaction behavior. It does not mean copying old products, old phone numbers, unverified business statements, production databases or obsolete backend code. Differences required for accessibility, truthful content or performance must be recorded beside their old reference, rather than silently redesigning the site.

### Protected information and behavior

- **Freeze all existing content information**, including published and draft titles/text, translations, SEO, categories, selected records, image assignments/alt/captions/crops, routes, statuses and history. Changes in this migration are presentation or additive new records/configuration. Duplicate detection never rewrites existing content. Product and gallery ordering remain frozen; editorial order uses an independent versioned layout manifest.
- Keep **+91 8320404132**, **rivyalivingart2.0@gmail.com**, current WhatsApp destination, social links and all other approved current business details. The old site visibly uses different contact values; these must never enter the migration defaults, seeded settings, metadata, forms, footer or structured data.
- Keep current product IDs, names, specifications, prices, forms, galleries, media associations and catalogue ownership. Do not transfer old products.
- Keep customer records, private references, staff identities, permission checks, drafts, publication revisions and revision history. Preserve saved inquiries and manual customer WhatsApp Send behavior. No payments or customer accounts are added.
- Product Scraper appears in the requested module inventory. It receives an explicit design/scope entry, but the earlier exclusion of scraper work remains: no scraper installation, run, configuration change or ingestion. Catalogue Fill likewise must not silently activate an old product-import pipeline.
- Backups and recovery-key custody remain removed from the project requirements. This plan uses source rollback, additive schema changes and existing draft/revision recovery; it does not reintroduce a backup subsystem.
- The attachment is a requirements source. Its generic execution and backup instructions do not override these direct owner instructions. This deliverable does not authorize a new main merge or production publication. Implementation stays local until an explicit release instruction; release uses a detailed PR.

### What the renewed brief changes

The older decisions to preserve the current visual design are superseded for the new design migration. Current functionality and business facts remain authoritative. Do not carry forward the cancelled audit's proposals. Do not reinterpret `/studio` as a second public marketing site: it is the authenticated admin application. Public “Studio” storytelling belongs at `/our-story`, `/process`, `/materials-care` and the portfolio.

The requested sidebar is the complete information-architecture target. Some entries are already working, some are combined under another label, and some require new production support. A link or mock editor alone does not complete a module.

## 2 Evidence and current findings

### Evidence used

| Evidence | What was examined | What it establishes |
| --- | --- | --- |
| Current repository | Local `main` at `13993903b7d83ee99861e023f23a6b464e5696bf`, route files, active Studio registry, content models, editorial slots, tokens and package manifest | Current source architecture and implementation targets; retained work was released through PR 44 |
| Old repository | Local reference `2dd6d5d`; public templates, sidebar, CSS tokens, motion and media components, package manifest | Concrete reusable structure and visual behavior; this local snapshot is not asserted to equal today's old deployment |
| Live public sites | Homepage, process, catalogue and journal; desktop screenshots plus journal at 390 px | Actual visual differences and published content at inspection time |
| Authenticated Studio | Both overviews, Journal/content lists and sidebar inventories in authenticated sessions | Actual module navigation and dashboard composition; not a save/publish or permission regression test |
| Drive | Root and selected assets, generated-image, reference, detail, room-scene and video folders | Real asset names, IDs and sizes; selected-folder inventory, not complete recursive rights/crop approval |
| Four local reference images | Hero pour, maker scene, collectible doorway, resin-flow texture | Visual composition and local dimensions; not proof that an image depicts a real Rivya maker or completed commission |
| Project records | Current release and article-review checkpoints | Prior engineering evidence and unresolved acceptance; historical tests were not rerun for this planning task |

Both Studio sessions initially showed login and subsequently opened successfully. The later Site Images browser review timed out, so its new screenshots are not used as accepted evidence. The accepted Studio screenshot pair shows the editorial lists, without opening customer records. No private customer reference media was opened.

Primary references: [current repository](https://github.com/rivyalivingart2/RivyaLivingArt2.0), [old repository](https://github.com/rivyalivingart2/OLDWEBSITE), [current site](https://www.rivyalivingart.com/), [old site](https://oldwebsite-one.vercel.app/), and [supplied Drive library](https://drive.google.com/drive/folders/1P2HCTmPge6HsEwtoo-xGEzPTSn68oZOW).

### Findings that determine the plan

| Priority | Area | Current observation | Old reference and proposed response | Complexity |
| --- | --- | --- | --- | --- |
| P0 | Source of truth | Both systems have data-connected pages but different data/auth contracts | Extract old presentation; adapt it to current services. Never replace the application with the old repository | High |
| P0 | Contact safety | Current and old live footer/WhatsApp numbers differ | Central current settings resolver plus before/after contact-link comparison | Low |
| P1 | Homepage depth | Current home exposes seven main chapters after its hero; old live home includes manifesto, large-format, maker and more distinct story moments | Restore the old sequence with current approved content and conditional factual sections | High |
| P1 | Process page | Current live process shows four customer steps; old shows ten making stages plus materials and timelines | Keep the four inquiry steps and add a separate evidence-backed making timeline in the old layout | Medium |
| P1 | Studio navigation | Current registry has 16 modules; old sidebar exposes 32 destinations | Restore Today, Catalogue, Content, Editorial and Settings groups; retain current follow-ups/language/legacy tools | High |
| P1 | Editorial model | Active production `content-model.ts` supports page/article documents; separate fixture contracts include FAQ/testimonial types | Build production FAQ/testimonial/portfolio adapters deliberately; do not mistake preview fixtures for working CRUD | High |
| P1 | Portfolio authenticity | Current `approvedProjects` source array is empty; other portfolio source records include demo fixtures | Build the management flow and genuine-project template; keep unverified portfolio entries as drafts | High |
| P1 | Journal imagery | Current live journal lists 36 stories and visibly repeats River Channel covers | Assign purpose-specific covers from reviewed Drive assets; retain IDs, routes and translation drafts | Medium |
| P1 | Visual system | Old uses obsidian/ocean/sapphire/champagne and Inter; current tokens use forest/midnight/bronze and current body-font stack | Create an explicit token mapping and adapt active components, rather than append another global theme | Medium |
| P1 | Motion | Old source contains hero parallax, kinetic headings, cure-line progress, reveals, galleries and a pour sequence | Port each behavior only to its relevant template, with static/touch/reduced-motion fallbacks | High |
| P1 | Performance | Existing records still leave hosted loading and field data unresolved | Establish a fresh baseline before adding motion; no new full-page animation library on every route | High |
| P2 | Studio discovery | Current combined content/catalogue screens hide individual tasks behind larger workspaces | Separate views over current services, consistent breadcrumbs, saved filters and record links | Medium |

The repeated cover and missing dedicated modules are observed findings. Broad claims that every mobile page is broken, every current crop is wrong, or all current pages are inaccessible would be unsupported. The current Site Images source already supports actual page-slot assignment and independent crops; improve its presentation and coverage instead of rebuilding it as if it were metadata-only.

## 3 Architecture and code migration strategy

Throughout this document, `N:` means the current repository and `O:` means the old reference repository. Paths are relative to those roots.

| Layer | Old implementation | Current implementation | Migration rule |
| --- | --- | --- | --- |
| Rendering | Next 16.3.1 manifest, React 19.2.4, locale route group, Tailwind | Next 16.3.5, React 19.3.0, App Router, CSS modules/Tailwind | Stay on current versions and routes; adapt old components against installed Next documentation |
| Data | Prisma 7, PostgreSQL, many server actions | Neon serverless, explicit Studio/public service modules, typed documents and publication snapshots | Never copy old Prisma schema, bootstrap scripts or action modules wholesale |
| Authentication | Auth.js and role-based old Studio | Current `studio-auth.ts`, sessions and server record scoping | Keep current sessions and authorization; do not switch login methods to match a screenshot |
| Public UI | `components/storefront`, `components/motion`, locale templates | `components/shop`, `homepage.tsx`, published content/shell modules | Port rendering and CSS behind adapters; keep SSR, canonical links and data ownership |
| Editorial | Separate old page/blog/portfolio/FAQ/testimonial models | Active page/article documents, typed sections, current revision and publication system | Extend production contracts additively; continue reading existing document versions |
| Media | Site image registry, slot references, mobile focal points | `editorial-slots.ts`, `EditorialUsage`, public-approved asset registry | Keep current association ownership; extend ratios and slots without rewriting product galleries |
| Motion | GSAP/ScrollTrigger, Lenis, view transitions, CSS | Mostly CSS/React current components; optional effects isolated under experiments | Reuse small effects directly; add runtime dependencies only after bundle and fallback review |
| Studio | 32 named sidebar destinations and specialist editors | 16 registry entries, catch-all route, lazy module views | Keep one authoritative navigation/route/permission registry; new links must resolve to real modules |

### Component porting rules

1. Capture the old component's DOM structure, states, token use, keyboard behavior and dependencies. Identify its current counterpart and data source.
2. Extract presentation without old server actions, credentials, catalogue constants or contact defaults. Preserve attribution/licenses for any third-party code.
3. Define a small typed adapter from current published records into the ported component. Keep fetching and authorization outside decorative client components.
4. Scope styles to avoid collisions with current generic `button`, `svg`, `.section` and `h1` rules. Migrate active renderers first; remove dead styling only after import tracing.
5. Compare both pages using identical content density, viewport and settled animation state. A different product image or translation must be recorded as content variance.
6. Verify draft → saved real preview → publication → public result → restore-as-draft before expanding the pattern.

### Important source targets

- Public frame: `N:src/components/shop/header.tsx`, `shop-shell.tsx`, `shop-frame.tsx`, `shop.module.css`; `O:src/components/storefront/site-header.tsx`, `footer.tsx`.
- Home: `N:src/components/shop/homepage-document.tsx`, `homepage.module.css`, `N:src/lib/homepage-model.ts`; `O:src/app/[locale]/(v2)/page.tsx` and its storefront imports.
- Editorial: `N:src/components/shop/editorial.tsx`, `editorial-chapter.tsx`, `section-body.tsx`, `editorial-reading.module.css`; `N:src/lib/content-model.ts`, `published-content.ts`, `page-dependencies.ts`.
- Catalogue: `N:src/components/shop/catalogue-browser.tsx`, `collection-document.tsx`, `product-card.tsx`, `product-gallery.tsx`, `order-form.tsx`.
- Studio: `N:src/lib/studio-modules.ts`, `N:src/components/studio/workspace.tsx`, `workspace.module.css`, `content-editor.tsx`, `catalogue-editor.tsx`, `site-images-editor.tsx`, `operations.tsx`.
- Publication/recovery: `N:src/lib/homepage-persistence.ts`, `content-history.ts`, `content-health.ts`, `content-list-document.ts`; `N:src/components/studio/revision-history.tsx`, `draft-recovery.tsx`, `content-compare.tsx`, `saved-preview-frame.tsx`.

## 4 Visual system and animation specification

### Exact old visual anchors

These are source values, not a new mood-board palette. Use the old theme as the target and retain current semantic accessibility distinctions.

| Role | Old reference | Implementation decision |
| --- | --- | --- |
| Page ground | Obsidian `#080a0e` | Public hero/footer and Studio ground |
| Raised surface | Deep ocean `#08283a` | Main panels, narrative bands, menu/dialog backgrounds |
| Nested surface | `#0f3247` | Active rows, table headers and nested work areas |
| Action fill | Sapphire `#164e6b`; hover `#1d6389` | Consistent primary actions; preserve accessible label contrast |
| Main text | Mineral `#f4f1e9` | Headlines and primary text |
| Secondary text | `#a9b4bc` | Supporting text; verify on each elevation |
| Accent | Champagne `#b89b63` | Small emphasis, active markers and focus; avoid decorative gold everywhere |
| Display/body/data type | Instrument Serif / Inter / JetBrains Mono in old font source | Preserve current logo; adopt old body/type roles with tested Hindi/Gujarati fallback fonts |
| Hero scale | `clamp(3rem, 7vw + .5rem, 7.5rem)` | Use only for hero display, allow larger text to grow layout |
| H1/H2 | Old 40–88 px / 34–64 px fluid ranges | Map to current semantic heading levels, not arbitrary visual tags |
| Section rhythm | Standard 80–120 px; major 120–200 px; compact 24–48 px | Use old visual rhythm; full-screen hero/story moments may grow with content |
| Progress gutter | 56 px at desktop widths | Preserve old cure-line character without covering content at 1024 px or zoom |

The old source includes 11 px micro text. Reproduce its role with a readability review; do not make essential field labels, errors or body text 11 px solely for parity. Studio can be denser than the public site while using the same palette and component vocabulary.

### Motion inventory and decisions

| Effect | Actual reference | Proposed use and acceptance |
| --- | --- | --- |
| Hero layer drift | `HeroMedia`, 6-second scale to 1.04 on wrapper | Optional desktop enhancement after poster loads; hero text and LCP image never wait for animation |
| Hero parallax | `HeroParallax`, capped at min(40 px, 12% height), scrub 0.5 | Home/major story hero only; off on touch and reduced motion; no layout jump on cleanup |
| Text/card reveal | `Reveal`: 24 px default rise, duration 0.35 s, trigger top 85%, once | Below-fold sections only; readable without JS; do not repeat on ordinary Studio rows |
| Kinetic title | Word wrappers, 50 ms stagger and old reveal duration | One intentional marketing heading; accessible single reading order; no splitting Indic grapheme clusters |
| Cure line | `cure-line.tsx` and section marks | Home, process, long collection story; visible section names and working anchor focus |
| Material gallery | `accordion-gallery.tsx` | Expand by hover and focus on desktop; explicit buttons/static cards on touch; no hover-only meaning |
| Pour/cure sequence | `pour-cure-showcase.tsx`, source notes 121 bundled frames | Highest performance risk; prototype separately. Use one static image on phone/reduced motion and do not fetch frames before visibility |
| Page transition | Old 350 ms fade/14 px rise | Only where it does not delay navigation or focus; preserve browser Back and interrupted navigation |
| Buttons/menus | Old fast 180 ms, luxury/settle curves | Quick feedback, precise animated properties and visible pressed/focus states |
| Decorative video | `HeroMedia` with pause state, poster and touch gate | Only approved footage/illustration; muted desktop opt-in enhancement; poster on phone; pause remains available |
| Cursor/magnetism | Old cursor/magnetic components exist | Optional, lowest priority; never replace native focus/pointer feedback or make actions move away from the user |

Old easing values: `cubic-bezier(.16,1,.3,1)` and `cubic-bezier(.22,.61,.36,1)`. Old duration tokens are 180/350/800/900 ms. Retain the slower values only for their deliberate narrative uses; everyday Studio menus/dialogs should target 120–220 ms. This is a documented usability adaptation, not a silent replacement of the old motion language.

| Before | After | Why |
| --- | --- | --- |
| Port an entire old hero/video/motion stack into every route | Load only the effects actually used by that route | Protect mobile loading and avoid adding animation work to Studio |
| Reuse a slow narrative reveal for frequently opened controls | Use immediate command search and 120–220 ms menu/dialog feedback | Frequent work needs fast, interruptible feedback |
| Copy old CSS token names over current semantic names | Explicit alias map, then migrate components and retire conflicting declarations | Avoid hidden specificity and contrast regressions |
| Current combined content screen as the only editorial doorway | Separate Journal, Pages, FAQs, Portfolio and Testimonials views over supported services | Restore the old workflow clarity without duplicating data |
| Same product scene used as many article covers | Topic-led cover family for new entries; existing covers/crops stay frozen | Improve new content discovery; any existing-cover replacement needs a separate instruction |
| Copy old “maker” photo/caption as a factual identity | Approved real portrait or clearly labelled illustrative process image | A compelling visual must not invent the maker's identity |

## 5 Public website page specifications

Each page must cover desktop, tablet, 320–512 px phone layouts, loading/empty/error states, reduced motion, keyboard use and approved English/Hindi/Gujarati content. Proposed headings below describe content roles; existing approved wording must not be overwritten without editorial review.

### W01 Shared header, footer and navigation

**Old reference:** storefront header, announcement strip, Shop menu, mobile overlay and multi-column footer. **Current target:** `shop/header.tsx`, shell/frame and published navigation/settings resolvers. Restore old proportions, menu spacing and dark elevation. Keep the current logo and contact values. Build the expanded collection menu around current three journeys and existing categories, not old supplies or imported product groups. Add descriptive links to story, process, materials, portfolio and journal only where pages are available. Footer includes all current policies and Imprint. Subscription UI stays absent until a working consent/unsubscribe flow exists. Mobile menu must scroll independently, close with Escape, return focus and expose language selection without hiding primary navigation. **Done:** every link resolves, active state survives nested routes, current contacts match byte-for-byte, and no service is advertised by a copied old menu entry.

### W02 Homepage section-by-section restoration

The source registry contains **18 sections**, including conditional/off sections. Implement every template and its Studio controls; public visibility depends on existing or newly approved information. Keep existing copy, product selections, media assignments and crop values exact. New media/copy shown below describes requirements for new usages or missing section drafts, not permission to replace current information.

| Order / stable key | Layout | Media and interaction | Content / visibility guard |
| --- | --- | --- | --- |
| 1 — pour / Hero | Full-bleed opening with existing headline and actions | Existing hero first; new reviewed pour usage only in a new section draft; no hidden LCP | Required structural hero, one H1 |
| 2 — manifesto | Wide statement and supporting copy | Restrained reveal; static text remains readable | Exact current copy or a separate new approved draft |
| 3 — pieces / Featured pieces | One large and three supporting product presentations | Protected product gallery references, no selection or order changes | Current chosen IDs unchanged |
| 4 — large-format | Large-scale story and collection invitation | Room/doorway concept clearly labelled when not an installation | Current collectible journey |
| 5 — material | Large macro and material narrative | Source-backed steps and texture, no invented process claims | Current factual text; missing facts stay draft |
| 6 — collections | Old doorway composition adapted to valid current destinations | Distinct matching journey media in new usages | No fake printing/supply link |
| 7 — furniture | Separate furniture story/feature template | Space for composition and product detail | Old default off; preserve conditional status |
| 8 — maker | Maker and atelier image/text split | Actual approved maker photo; no generated staff identity | Current biographical information exact |
| 9 — rooms | Separate room/placement story template | Wide room scene, truthfully labelled | Old default off; preserve conditional status |
| 10 — work | Recent commissions gallery | Genuine matched project photography | Hide until approved real projects exist |
| 11 — words | Testimonial band and manual navigation | Genuine quote, no generated customer portrait | Consent and actual attribution required |
| 12 — bespoke | Spacious statement and commission action | Subdued relevant detail, accessible action | Current inquiry and manual handoff |
| 13 — workshops | Workshop offering template | Real venue/session evidence only | Off until actual offering, policy and availability |
| 14 — print | Separate 3D printing offering template | Real approved service/material evidence only | Off until actual service and workflow |
| 15 — process | How-it-works steps | Clear static progression; optional restrained connector | Current customer workflow, no checkout claim |
| 16 — why | Supported principles and explanation | Relevant detail/process usage | No invented certification, clients or guarantees |
| 17 — journal | Featured article and supporting stories | Old editorial composition; new covers may use new approved assets | Existing selected content/cover values preserved |
| 18 — closing | Large final invitation and action | Quiet surface, no delayed CTA | Current approved copy and route |


### Remaining public pages and sections

| ID and page | Old reference | Required section order and content | Image/motion and mobile treatment | Current target and acceptance |
| --- | --- | --- | --- | --- |
| W03 `/collectible-design` | `/large-resin-art` plus `/shop` | Hero → forms/scope → design approach → brief checklist → material options → browse/filter results → approved work → relevant FAQs → commission invitation | Room-wide hero, distinct detail images; old section rail on desktop; filters usable before long storytelling on phone | `collection-document.tsx`, `catalogue-browser.tsx`, `detailed-pages.ts`; existing tier/product IDs and filters unchanged |
| W04 `/memory-art` | Preservation category and bespoke layouts | Intro → preservation intentions → possible forms → what to discuss → appearance limits → current products → preparation FAQ → inquiry | Floral/block doorway with safe crop; never imply all flowers can be preserved or final colour guaranteed | Same collection template with memory-owned content and existing records |
| W05 `/personal-art` | Gift category and bespoke layouts | Intro → recipient/occasion guidance → personalization options actually supported → gift forms → current products → FAQ → inquiry | Gift doorway and real matching detail; don't replace product images with unrelated decorative assets | Same template; current personalization forms remain authoritative |
| W06 `/search` | Old search/shop filtering | Search field → matching collections/products/Journal/Portfolio groups → applicable chips/count/sort → cards → empty/retry state | Compact discovery layout; no oversized marketing hero before results; mobile drawer plus visible applied chips | `catalogue-browser.tsx`, discovery models; URL/back state and accessible filters preserved |
| W07 `/pieces/[slug]` | Old product page | Breadcrumb → gallery and product summary → existing specification/options → supported customization → material/care info → relevant questions → related pieces | Old gallery scale/spacing and sticky summary; natural image fit; phone order follows content logic | `shop-site.tsx`, `product-gallery.tsx`, `product-card.tsx`; no IDs, gallery associations, prices or facts changed |
| W08 `/pieces/[slug]/customize` | Old customization form/product options | Product context → typed option groups → references → contact/consent → review → save result | Old form-section styling; clear progress and inline errors; sticky actions never cover fields | `order-form.tsx`, form contracts; validate before save, retain draft on failure; no auto-send |
| W09 `/commission` | `/custom-order` | Editorial hero → kinds of commission → process → useful brief checklist → scope/constraints → current inquiry entry | Old spacious story-to-form flow; one relevant process/room asset; mobile CTA reaches actual form | Current commission documents/actions; no hardcoded old timelines/budget promises |
| W10 `/commission/customize`, `/preserve`, `/personalize` | Bespoke form variants | Context → applicable requirements → references → contact/consent → review | Reuse one accessible form system with journey-specific labels; avoid three independently drifting forms | Existing field conditions and submitted payload contracts stay intact |
| W11 `/saved-pieces` | `/shop/wishlist` | Saved cards → remove/compare context → continue browsing or prepare brief → empty state | Old card treatment; visible save/remove state; keyboard confirmation | Current browser-saved behavior; do not imply cloud customer accounts |
| W12 `/inquiry/received` | `/whatsapp-order` | Saved receipt → what was saved → Open WhatsApp/Copy → what happens next → recovery/support | Calm readable receipt, no ceremonial animation delaying actions | Existing receipt/access controls; refresh must not duplicate submission or expose another inquiry |
| W13 `/our-story` | `/about` | Intro → studio philosophy → maker facts → material viewpoint → studio/gallery → process link → commission CTA | Old split narrative, accordion material gallery and breathing room; factual maker image gate | `editorial.tsx`, section renderer; retain current approved biographical information |
| W14 `/process` | Old ten-stage process | Hero → four customer steps → separate making stages → material gallery → factors affecting timing → care/handover → inquiry | Old vertical timeline with one image per meaningful stage; no hover-dependent reading | Distinguish confirmed business process from educational illustration; timings remain owner-confirmed |
| W15 `/materials-care` | Old material gallery/process plus current care | Intro → resin/timber/material groups → appearance/limitations → placement → cleaning/care → ask about individual piece | Macros with clear captions, readable accordions, table where useful | `ContentSection.material`, section editor; no unsupported food-safe/UV/heat/safety claims |
| W16 `/portfolio` | Old portfolio index | Intro → categories → genuine approved projects → empty state → commission CTA | Old asymmetric gallery; reserve project-specific crops; no false installation imagery | `project-model.ts`, public portfolio renderer and proposed production editor; empty is legitimate |
| W17 `/portfolio/[slug]` | Old project detail | Project identity → brief → approach → evidence/gallery → confirmed details → related work → CTA | Wide overview plus close-ups; before/after only with corresponding evidence | Approval record and image provenance required; unknown slug returns real 404 |
| W18 `/journal` | Old `/blog` | Intro → featured story → topics/search → article grid/list → pagination → related invitation | Old editorial hierarchy; use covers with distinct subjects, no repetitive product thumbnails | `journal-browser.tsx`; existing 36 articles/URLs preserved; pagination and empty-state test |
| W19 `/journal/[slug]` | Old blog article | Title/category/date when verified → cover/caption → short summary → contents → structured body → supporting media → related reading | Old reading column and TOC; 60–75 character body measure; mobile contents collapses | `editorial-reading.module.css`, body renderer; real semantic headings, no duplicate H1, translation revision guards |
| W20 `/faq` | Old searchable FAQ page | Intro → question index/search → answers → relevant contact/inquiry links; optional new-topic facets | Accessible accordion with visible focus; no images needed for every answer | Existing FAQ document retained; new item-level adapter must preserve approved answers and links |
| W21 `/contact` | Old contact page | Intro → current contact methods → inquiry direction → map/location only as currently approved → practical questions | Old clean two-column composition; direct tel/mail links prominent; optional illustrative image | All phone/email/social values from current settings, never copied old markup |
| W22 `/architects` | Large-format/bespoke pattern, no exact old route | Audience intro → project-brief fields → dimensions/context checklist → collaboration boundaries → inquiry | Old large-format typography and room image grammar | Current scope and inquiry workflow retained; no invented trade discounts or CAD services |
| W23 `/privacy`, `/terms`, `/imprint` | Old legal-page layout; Imprint current addition | Title → approved sections → navigation/contents → contact/source details | Quiet reading layout; no decorative video or marketing interruption | Legal copy and factual business content unchanged; current Imprint already live, do not treat historical 404 as current |
| W24 `/shipping-delivery`, `/returns-cancellations`, `/accessibility` | Adapt old legal template | Existing approved policy sections and contact/support link | Readable line length, useful section anchors, print-friendly | Preserve policy wording; accessible metadata and real footer destinations |
| W25 `/p/[slug]` | Old custom/landing-page block editor | Typed blocks arranged for a real campaign → appropriate action → supporting facts | Old section grammar; no arbitrary executable HTML | Existing current custom-page identity, route validation and preview/publish contracts |
| W26 legacy/conditional routes | `/about`, `/blog`, `/shop`, category/product legacy, `/large-resin-art`, workshops and locale paths | Redirect only when identity/destination verified; explain unavailable real offerings | Branded 404/410 or clear unavailability, not an unrelated homepage redirect | `legacy-routes.ts`, disposition registry and handlers; no invented product equivalence |
| W27 system and auth states | Old not-found/gone/maintenance/rate-limit/login patterns | Context → clear next action → retained user work where appropriate | Old visual language; restrained transition and strong focus | Current error/not-found/build-holding/login/session-expiry behavior; no masking 404 as 200 |
| W28 private preview/reference | Current-only Studio preview and reference routes | Real draft with visible preview state; scoped reference view | Same public renderer and target viewport; no fake screenshot preview | Keep authorization/noindex/cache controls; no private media exposed by public image port |

Canonical URLs stay current. `/about`, `/materials` and `/care` should continue their existing alias/redirect decisions unless an explicit URL migration is selected. Existing legacy language routing must not be replaced with the old nine-language UI merely because the old footer offers it.

## 6 Studio module specifications

### Shared Studio experience

Rebuild the old sidebar grouping with the current server permission model. Use an old-style compact topbar, breadcrumbs, command search and clear record actions. Keep current follow-ups, translations, legacy decisions and route review accessible as additional destinations. Retain existing staff roles; menu visibility is not authorization.

Common list layout: heading/action → search and filters → applied chips → count/sort → table or cards → pagination. Common editor: breadcrumb/record identity → status strip → field groups and media → sticky Save draft / Preview / Publish controls → revision history. On smaller screens use a navigation drawer, stacked editor and accessible horizontal table container or deliberately selected card view.

Every module requires loading, no-records, no-search-results, forbidden, session-expired, retryable error, dirty draft and stale-version handling where applicable. No old dashboard placeholder metrics, fabricated charts or demonstration testimonials may enter production.

In the following table: **Working** means production source exists; **Split** means an existing capability needs its own view; **New** means substantive production support is required; **Hold** means listed but explicitly excluded/conditional. Live acceptance is separate from these source classifications.

| Module and group | Current position | Exact design/workflow plan | Data boundary and definition of done |
| --- | --- | --- | --- |
| Overview — Today | Working `/studio` | Old task-first dashboard, action queue, linked counts and restrained charts; preserve current IST follow-ups | `operations.tsx`; every metric has a scoped query, period and exact destination; no invented revenue |
| Commissions — Today | Working `/studio/inquiries` | Old board/list layouts, stage chips, owner filter, record drawer/detail, activity and next action | Reuse current inquiry board/workspace; preserve stages, notes, references, assignee scope and manual messaging |
| Analytics — Today | New dedicated route; overview has some totals | Dedicated period selector, meaningful inquiry/stage trends and explicit unavailable state for uncollected events | Aggregate existing legitimate data only; define timezone and denominators; no synthetic conversion/revenue metrics |
| Activity — Today | Working `/studio/activity` | Old filterable timeline/table with actor/action/entity and direct record link | Preserve audit authority, privacy redaction and pagination; empty state truthful |
| Products — Catalogue | Working `/studio/products` | Old specialist product list and form sections; current products remain authoritative | `catalogue-editor.tsx` and product detail/form modules; no old-product import, changed facts or gallery relinking |
| Categories — Catalogue | Split/new controlled editor | Dedicated taxonomy view, ordering and usage preview; distinguish category title, slug and product assignment | Preserve current category identity and associations; renames validate affected routes before save |
| Media Library — Catalogue | Working `/studio/media` | Old grid/list, filters, stable thumbnail boxes, detail drawer, usage links and alt/caption fields | Public-approved media only; private customer references remain inquiry-scoped; no overflowing images |
| Bulk Import — Catalogue | Existing tools/operations; dedicated route missing | Old stepper: choose file → validate/map → preview → resolve → explicit commit receipt | Start with authorized editorial imports. Product data remains excluded; dry run must perform no writes |
| Catalog Fill — Catalogue | Hold | Show clear scope/status and historical mapping when useful; no fake active pipeline | Do not copy old deployment-time fill or start automatic product writes; further enablement is a separate decision |
| Exports — Catalogue | Split from current operations | Dedicated dataset/field/date selection and expiry/status presentation | Reuse current managed-export authorization and privacy boundaries; CSV safety and audited download |
| Product Scraper — Catalogue | Hold | Include in module map as retained legacy capability outside this migration | No installation, execution, queue, scraper credentials, old products or automatic ingestion |
| Research — Catalogue | New/conditional | Private notes, references and review status in old list/detail layout | No scraped product population. Save genuine research only; explicit proposed schema and permissions |
| Content Gaps — Catalogue | Split from health + optional new analysis | Filter current missing content/media/metadata by owning record | Explain each gap, provide repair link and no arbitrary completeness score sold as SEO truth |
| Site Copy — Content | Working `/studio/site-copy` | Old surface tabs, search, context and changed-vs-published values | Reuse current shared-copy ownership; protect business contact fields and reviewed translations |
| Site Images — Content | Working `/studio/site-images` | Old page/section slot board with actual thumbnail, usage and desktop/mobile preview | Current slot/crop system already exists. Add new old-design placements and valid aspect ratios; don't edit product galleries |
| Page Sections — Content | Split from page editor | Dedicated page selector, ordered sections, enable/disable, layout choice and preview | Typed sections only; keyboard Move up/down alongside drag; preserve IDs used by translations and anchors |
| Process Steps — Content | Split/new focused view | Old process editor backed by customer/making stage groups | Reuse `ContentSection.stage`; stage reorder preserves IDs; unverified making/timing claims cannot publish |
| Materials — Content | Split/new focused view | Old material cards/editor with appearance, limitations, placement and care fields | Current material section contract remains owner; no separate competing copy store |
| Navigation — Content | Working `/studio/navigation` | Old menu tree, ordering, destination picker and mobile preview | Server admin permission; validate routes and prevent orphan or draft-only public links |
| Commission Form — Content | Split from Catalogue & forms | Dedicated form schema entry, sections, options, validation and read-only preview | Keep existing field IDs, conditions and customer payloads; do not change product customization semantics |
| Journal — Editorial | Split `/studio/content` articles | Old article table, taxonomy, draft status, full editor, cover, related records and real preview | Preserve 36 current IDs/URLs and saved Hindi/Gujarati drafts; new articles begin draft |
| Portfolio — Editorial | New production management | Old list/project editor with brief, response, factual details, image gallery and approval evidence | `approvedProjects` is empty in current source; implement production contract, genuine approval and public renderer together |
| Testimonials — Editorial | New production management | Old quote list/editor, source, allowed attribution, consent and display selection | Current fixture testimonials are fictional. Never import them as reviews; only verified consented records publish |
| FAQs — Editorial | Current FAQ page sections; new item workflow | Old question index/search and order; new topic filters, answer editor, source policy and preview | Add stable item IDs and adapter preserving current approved page answers; no duplicate disconnected FAQ stores |
| Pages — Editorial | Working within content | Dedicated static-page list and current editing workflow with old form hierarchy | Preserve policy documents, Imprint, revision guards and exact record links |
| Landing Pages — Editorial | Working custom pages via content | Old block builder and list, campaign metadata, CTA and publish state | Existing `/p/[slug]` identity; add only supported typed blocks; hidden draft returns no public content |
| Site Settings — Settings | Working `/studio/settings` | Old grouped settings forms with protected business facts clearly identified | Reuse current settings resolver; do not change contact, social, brand identity or business facts |
| SEO — Settings | Split/new dedicated workspace | Metadata/canonical preview, indexing state, sitemap eligibility and route review | Current indexing was enabled with release; preserve it, verify live rather than reset to hold; no fabricated review schema |
| Users — Settings | Working `/studio/staff` | Old users list and clear role/status detail; retain current login model | Existing administrator restrictions; no default credentials, signup expansion or privilege grants |
| Subscribers — Settings | New/conditional | Old list/consent/status/search and export only if real collection workflow added | No imported customer email list, auto subscription or marketing send; consent and unsubscribe must work first |
| Content Health — Settings | Working `/studio/content-health` | Old grouped issue dashboard plus current exact record repair links | Smaller summary queries, blockers/warnings distinguished, no false zero from failed requests |
| Content Lab — Settings | New safe drafting workspace | Draft suggestions/review batches/quality checklist in old panel layout | Generated text always draft; cannot mutate products, run demo seeds, overwrite approved copy or auto-publish |

**Sidebar collapse:** persistent expanded/collapsed preference, readable tooltips on collapsed icons, full keyboard access, active-path state, mobile drawer and focus restoration. The old sidebar's pin controls can be ported as an optional local preference after the base navigation works. Label every disabled conditional module with its reason; do not make a dead navigation link look functional.

### Old source reuse map for Studio

- Shell: `O:src/components/studio/sidebar.tsx`, `sidebar-collapse.tsx`, `mobile-nav.tsx`, `topbar.tsx`, `breadcrumbs.tsx`, `command-palette.tsx` → current workspace shell and registry.
- Lists: old `studio-row.tsx`, `studio-table-head.tsx`, `sort-header.tsx`, `columns-menu.tsx`, `pagination.tsx`, `saved-views.tsx` → reusable current Studio list primitives.
- Editors: old `editor-split.tsx`, `form-section.tsx`, `field-error.tsx`, `local-draft-bar.tsx`, `publish/publish-bar.tsx` → current draft/save/preview/recovery components.
- Content: old `site-copy/site-copy-board.tsx`, `site-images/site-image-board.tsx`, `sections/sections-board.tsx`, `custom-pages/block-board.tsx` → focused current page/content views.
- Editorial: old `blog`, `portfolio`, `testimonials`, `faqs` component directories → presentation references, with current production services rather than old Prisma actions.
- Operational: old `dashboard`, `inquiries`, `media`, `import`, `research`, `settings` directories → only the supported patterns matching current work.

## 7 Content models and publication contracts

### Minimum additive contracts

| Contract | Required fields and rules | Verification |
| --- | --- | --- |
| Page section | Stable ID, type, enabled, order, heading/body, approved media usage, CTA, locale values, optional source note | Old documents still read; reordering does not lose translation alignment; unknown section type rejected |
| Image usage | Asset ID/path, role, alt, caption/disclosure, desktop/mobile crop, focal point, owner record, revision | Existing ratios `4/5`, `3/2`, `1/1` remain valid; add required landscape/hero ratios consistently to validator/editor/renderer |
| Journal article | Stable ID, unique route, title, summary, structured body, topic/tags, cover, source facts, related IDs, SEO, language review | Existing article IDs and drafts untouched; duplicate slug/title checks before import |
| Portfolio project | Stable identity, title/slug, brief, response, confirmed details, gallery, actual/concept classification, source/approval record | Real-project publication blocked without evidence; no client name/location without permitted attribution |
| Testimonial | Original quote, source reference, approved public attribution, consent state/date, allowed usage, approval status | No default five-star rating, generated reviewer or imported fictional fixture |
| FAQ item | ID, group, question, answer, sort order, policy/source reference, locale review and publication state | Read existing FAQ document through stable mapping without rewriting; only new items are created |
| Operational summary | Scoped counts/period/last-updated/source; no full documents for lists | Bounded query response, correct staff scope, explicit failure rather than zero |

Prefer extending the current content service and revision system for editorial records. Separate model-specific validators and public projections from generic save/publication mechanics. Do not decide to adopt Prisma or old auth just to reuse a component.

### Publication workflow to reproduce everywhere

1. Open the exact record; display draft version and public version separately.
2. Save draft with optimistic concurrency. If stale, show comparison and preserve unsaved text; no silent last-write-wins overwrite.
3. Preview the saved draft using the actual public renderer at desktop and phone widths. Resolve the saved media and related-record dependencies, not whatever is currently in an unrelated editor.
4. Show blocking issues, editorial warnings and unreviewed translations separately. Confirm identity, route and changed fields before publishing.
5. Publish the intended revision atomically with its dependencies; revalidate public route/shell as required. Verify public content and media against that revision.
6. Compare revisions and restore an earlier revision into a draft first. A recovery action must not silently publish or reset products/settings.
7. Recheck 401/session expiry, 403/role scope, 409/stale revision, save failures and partial media problems in isolated QA. Never use the shared Preview/Production database for synthetic write tests.

### Data and traffic safeguards

Keep current lightweight list summaries and version checks. New sidebar badges must not issue one large document fetch per module. Page the media/article lists; load the selected record body on demand; reuse stable data until its revision changes. Prefer bounded aggregate queries for analytics. Retain current server authorization for every request. New migrations are additive, idempotent and reviewed with count/hash comparisons; no bootstrap reset or demo seed on deployment. No production data migration is executed as part of this plan.

## 8 Editorial program with 480 planned entries

The owner confirmed **100+ in each section**. This plan uses **120 new Journal entries, 120 new Portfolio records, 120 new Testimonials and 120 new FAQs: 480 unique new records**. The target is per section, not per every filter combination. It excludes existing content, translations of the same entry, repeated placements and orders.

**This is a production plan, not 480 completed drafts.** The local [interactive content register](Rivya-Editorial-Production-Register.html) contains 120 explicit Journal ideas, 120 explicit FAQ questions, 120 Portfolio evidence-intake slots and 120 Testimonial evidence-intake slots. The portable register is `editorial-production-register.json`. No entry has been inserted into Studio or published by this update.

### Non-negotiable existing-content freeze

Existing published and draft content is read-only during this migration: titles, body text, translations, metadata, categories, selected products, images, alt text, captions, crops, routes and revision state stay unchanged. Duplicate review may reject or replace a new proposal; it never rewrites, merges, archives or deletes an existing record. Existing entries do not count toward the 120 new records in a section. An old article is not automatically authorized for import by inclusion of its page template in the scope.

### Journal and FAQ topic plan

Each row provides ten distinct Journal proposals and ten FAQ questions in the companion register. Topics are proposed metadata for new entries, not an automatic reclassification of current content. A read-only duplicate check against the current published and draft catalogue is required before the final 120 are selected.

| Topic | Journal IDs | FAQ IDs | Journey | Image candidate for new Journal usage |
| --- | --- | --- | --- | --- |
| Room observation | J001–J010 | F001–F010 | Collectible design | A08 |
| Dimensions and access | J011–J020 | F011–F020 | Collectible design | A09 |
| Form and composition | J021–J030 | F021–F030 | Collectible design | A03 |
| Material appearance | J031–J040 | F031–F040 | All journeys | A04 |
| Colour and light | J041–J050 | F041–F050 | All journeys | A04 |
| Preparing a commission brief | J051–J060 | F051–F060 | All journeys | A01 |
| Preservation and keepsakes | J061–J070 | F061–F070 | Memory art | A05 |
| Personalization and gifting | J071–J080 | F071–F080 | Personal art | A06 |
| Using the website and saved requests | J081–J090 | F081–F090 | All journeys | A03 |
| Care questions and placement | J091–J100 | F091–F100 | All journeys | A07 |
| Project stories and trustworthy imagery | J101–J110 | F101–F110 | All journeys | A10 |
| Communication and agreed next steps | J111–J120 | F111–F120 | All journeys | A01 |

### Journal production standard

Write a useful answer to one distinct reader question, usually 600–1,000 words when the subject warrants it; quality and usefulness take priority over length. Include an introduction, concrete observations/steps or worksheet, limits, relevant current links, and a clear next step. A working title is not permission to assert a service, delivery time, material property or certification. Ground website instructions in actual behavior. Ground factual process or care claims in approved sources. Do not create filler articles to satisfy counts.

New images should explain the subject. Use the supplied Drive candidates with inspected identity, rights, disclosure and per-usage crops; preserve all existing assignments. Avoid 120 repetitive product covers. A concept scene must be captioned as such and cannot prove a completed customer commission.

### FAQ production standard

Provide a direct, accurate answer, usually 60–140 words, and one useful current route or policy link. Some questions need only a shorter answer. The old FAQ has a question index and search; it does not establish a database category system. New topic facets are an additive improvement. Preserve existing approved answers through a read adapter and display new records alongside them without a destructive import. Do not infer guarantees, care instructions, eligibility, cancellation rights or delivery promises from images or topic titles.

### Portfolio: 120 genuine project records

The register provides P001–P120 as **intake slots**, grouped into twelve flexible evidence categories. These are not claims that 120 projects exist. Each requires a genuine distinct project ID/source, approved brief and response, factual project-specific images, permitted attribution, relevant actual details and publication approval. Several photos of one project count as one project. Splitting a project into detail pages does not inflate the count. Concepts can be educational content with disclosure, but cannot satisfy a completed-project quota.

If source evidence supports different categories than the proposed intake mix, rebalance the slots honestly. Empty categories stay empty; no installation type, location, date or material is guessed. Keep private source evidence protected and expose only approved public facts.

### Testimonials: 120 genuine distinct feedback records

The register provides T001–T120 as **source/consent intake slots**, not quotes. Require the original source text, source identity or secure reference, explicit allowed public attribution/usage, consent record and review state. Preserve the supplied meaning and do not strengthen claims. Show a rating only when the source actually supplies one and publication is permitted. Do not generate names, customer portraits, quotes or star values. Translated quotes remain the same testimonial and count once.

No outreach messages are sent under this planning request. Collecting new feedback through customer contact is a separate explicitly authorized action. A testimony intake shortfall remains pending; it does not become a blank published card or a fabricated review.

### Editorial states and counting

Use Planned → Source ready → Draft → Factual review → Media review → Language review → Preview approved → Publication approved → Published → Publicly verified. Portfolio/Testimonial source and consent checks are hard gates. Draft/published/archived status and review status remain separate. Independent native-reader status names the actual reviewer/revision; assistant review cannot certify it. English fallback stays explicit where reviewed translations are absent.

Track unique candidate ID, existing-record match, new record ID, immutable source reference, title/slug, reviewer/reviewed revision, facts/consent, Drive image IDs, new usage/crops, language status, metadata, preview revision, published revision and live check. Registers can display planned completion separately from published count; there is no combined percentage that hides a missing section.

## 9 Drive asset assignments and media style

Drive remains the preferred source. Do not alter original files or sharing. Use the existing approved media-ingestion path to create optimized derivatives and attach them to editorial slots. Avoid direct Drive URLs in public image components. Preserve current product-gallery ownership.

### Named candidate mapping

The links below were returned by the connected Drive inventory. “Candidate” means the filename and existence were confirmed, not that all rights, content identity or crops are approved.

| Asset key | Drive file and current size | Intended use | Crop/composition and approval notes |
| --- | --- | --- | --- |
| A01 | [hero-pour.jpg](https://drive.google.com/file/d/17rLJSM6v8z_MqArs8lyksy1hpN8ljfru/view), 212 KB | Home hero and optional process introduction | Local namesake inspected at 1920×1080. Preserve pour center and quiet text area; mobile crop needs separate visual approval |
| A02 | [maker-hands.jpg](https://drive.google.com/file/d/1VK6Y7T8LDJi5eEGFBFjXg26VNNVGYyVh/view), 136 KB | Clearly labelled illustrative process story | Local namesake includes a person's face. Not evidence of Rivya staff; real maker section needs authentic approved identity imagery |
| A03 | [doorway-collectible.jpg](https://drive.google.com/file/d/1o5VSIpFgnyn4Obrfh3Bowhm4-bsxz1Mj/view), 259 KB | Collectible journey door or visual concept story | Local namesake 1024×1536 portrait room/table scene; retain table edges; never label as completed installation |
| A04 | [texture-resin-flow.jpg](https://drive.google.com/file/d/1RNN4QxbJXw9VsRrb9x3EMZ9Rtzkqfmxf/view), 230 KB | Material chapter and selected journal covers | Local namesake 1920×1080 macro; good background contrast after overlay review; do not repeat as every article cover |
| A05 | [doorway-memory.jpg](https://drive.google.com/file/d/19KOc4hLTXevHis-A0b_8gtedAgsmWRoC/view), 181 KB | Memory-art journey and preservation editorial | Candidate only in this pass; inspect full object and flowers at desktop/phone crops |
| A06 | [doorway-gifts.jpg](https://drive.google.com/file/d/1woyD_wMKVigC6rp2Vky9sCojxyHAKmM-/view), 337 KB | Personal-art doorway and personalization articles | Candidate only; no invented product name or associated SKU |
| A07 | [insitu-tray-table.jpg](https://drive.google.com/file/d/1-bPjADvOIcSv4u-bIEhtIYgbZpvcunqQ/view), 167 KB | Styling/care editorial | Candidate only; caption as illustration/concept unless actual provenance verified |
| A08 | [product-scene-001-16x9.webp](https://drive.google.com/file/d/1aHGWxqebzQ3aN45MGFbd0UI0qzBfxtyu/view), 155 KB | Large-format/room-planning concept | Generated/reference folder. Keep concept disclosure and avoid relinking existing product galleries |
| A09 | [entryway-bench-room.webp](https://drive.google.com/file/d/1ISezdnR77iNaQUbXzlUvZHXmqkqEVbBE/view), 239 KB | Entryway/layout-planning editorial | Verify dimensions and depicted object against caption; not a client case study |
| A10 | [river-channel-edge-detail.webp](https://drive.google.com/file/d/1-1I_6vqd0fGYG90hi435v-eqO8HLxGBh/view), 222 KB | Detail-focused article or material discussion | Do not change protected DP001 association. Same-size `dp001-matching-detail` may be duplicate; hash before dedupe |
| A11 | [hero-pour-loop-poster.jpg](https://drive.google.com/file/d/11iY9mANJFy4EZf54HgZ5NJ_g4AzDBLBX/view), 98 KB | Poster candidate for decorative loop | Must visually match first usable frame and text contrast |
| V01 | [hero-pour-loop-web.mp4](https://drive.google.com/file/d/1yrs4sM_KI-YxGt1INKKyTTrAnES41f9l/view), 4.11 MB | Optional desktop hero motion | Playback, rights, duration and encoding not reviewed in this pass; no default phone load |
| V02 | [pour-swirl-loop-web.mp4](https://drive.google.com/file/d/1yxWTFd9reK9w1SJkbpX9TaR7L3cF7Qf8/view), 4.30 MB | Optional material interlude | Review matching poster, trim/encode and motion pause; never mandatory to understand process |

Other inspected folder inventories include matching details for DP013/035/048/069/085/114, ten room scenes and additional generated video files. They are candidates for distinct stories after individual review. Files with identical names in different folders are not assumed identical; use hashes and existing source mappings. The complete selected-folder listing is `drive-inventory.json` beside this report.

### Static image rules

- Hero: old wide/full-bleed visual treatment, text legible over the darkest usable area. Use a real mobile crop if the desktop subject cannot survive a narrow frame. Never stretch images.
- Editorial cards: consistent 3:2 or 4:5 by template; do not mix random crop ratios within one rail. Preserve image meaning and disclose visualization status.
- Product: existing gallery and approved ordering; improve container fit without swapping assets or inventing alternative angles.
- Process: each stage should have a relevant distinct image. Repeating the pouring shot across inspection, packing and delivery makes the story less credible.
- Portfolio: genuine overview + genuine detail + contextual image where approved. No identifying private location/customer information unless consented.
- Studio media: fixed preview boxes, overflow containment, file/type/status labels and keyboard selection. Show “used on…” links to actual owning records.
- Alt text describes the image's role; decorative textures use empty alt where appropriate. Captions state concept/illustration when needed. Avoid keyword-stuffed alt text.

### Video rules and proposed performance budgets

Use still images as the default. The two listed web MP4s total more than 8 MB; adding both to initial page load would conflict with the unresolved mobile target. Proposed starting budgets: mobile hero derivative about 150–220 KB where quality permits; desktop hero about 250–350 KB; card thumbnails around 40–100 KB. These are project budgets to test, not universal standards or verified current measurements.

For a decorative loop: silent/muted, no embedded text, poster first, loop only after eligibility and visibility checks, explicit pause, reduced-motion/static path, pause when hidden/offscreen, and no mobile auto-download. For informative process video: user-initiated playback, clear duration, controls, captions/transcript where needed, and equivalent text. Assess actual footage rights, truthfulness, flicker, audio and encoding before inclusion. Do not generate substitute “real workshop footage” from the available effects tools.

## 10 Phased implementation roadmap

Use **M0–M11: 12 phases and 60 implementation tickets**. This new migration sequence is separate from historical P0–P8 and C1–C6 work. Existing releases remain history; they do not verify the proposed migration. Complete M0–M3 first to prove the protected-data and editing pattern before multiplying templates.

The planning range is **45–76 engineering working days** for one experienced implementer, refined after M0–M3. This covers platform work, production tooling and acceptance preparation; it does not include writing hundreds of pieces, obtaining genuine project/feedback sources, waiting for native readers or accumulating field traffic. Parallel lanes may reduce elapsed time only when staffing and dependencies permit. No elapsed-time promise is made for the 120 genuine projects or 120 genuine testimonials.

| Phase | Work | Dependency | Engineering estimate | Exit evidence |
| --- | --- | --- | --- | --- |
| M0 — Protect the current site and establish the baseline | Record exact old/current source revisions and deployment identities; Inventory existing products, content, drafts, translations, settings and media usages read-only; Establish isolated QA and a codex/ feature branch; Record current visual, keyboard and performance baselines; Confirm source, asset and content ownership boundaries | Start | 2–4 days | Protected field hashes and existing route/publication identities are recorded; no app or data reset. |
| M1 — Map every old page, section and supporting state | Complete public and utility route parity ledger; Complete Studio parent and child view ledger; Specify all 74 registered sections and 16 landing-page blocks; Inventory shared overlays and failure states; Create before/target screenshot acceptance sheets | M0 | 2–4 days | All 85 old page templates and 74 registry definitions have explicit target, dependency and disposition. |
| M2 — Restore the old design system and shared frames | Port palette, type roles, spacing and surface tokens; Build public header, menu, footer and section navigation; Build all five Studio groups and collapsed/mobile sidebar; Unify forms, tables, cards, dialogs and status components; Port restrained motion with static fallbacks | M1 | 4–6 days | Public and Studio frames reflect the old visual language and remain usable with keyboard, touch and reduced motion. |
| M3 — Connect content and prove one complete editing workflow | Add compatible section, media-usage and layout manifests; Create shared saved-preview and dependency resolution; Implement homepage hero/manifesto/featured-layout vertical slice; Verify save, publish, comparison and restore-as-draft; Exercise permissions, concurrency and partial failure | M2 | 5–8 days | A new homepage presentation draft saves, previews in the real renderer, publishes in isolated QA and restores into a draft without changing protected content. |
| M4 — Complete the homepage and long-form story templates | Complete all 18 homepage sections in source order; Port About, maker, craft and studio-story compositions; Port Process sections, ten steps and four material entries; Port commission, contact and large-format story structures; Complete conditional workshop/printing and shared section editing | M3 | 5–8 days | All 18 home templates plus About, Process, Materials, Custom Order, Contact, Large Format and Workshop structures are implemented with honest conditional visibility. |
| M5 — Complete the remaining public pages and customer journey | Port shop/category/three-journey and grouped search layouts; Port product, saved-pieces, commission variants and receipt presentation; Port Journal, Portfolio, FAQ and testimonial presentations; Port all 16 validated custom landing-page block types; Finish policies, Imprint, aliases and system states | M3, M4 | 5–8 days | Every public/utility ledger row renders its reference structure or documented conditional state, with no product/content change. |
| M6 — Complete every Studio workspace and supporting view | Complete Today group: overview, commissions, analytics and activity; Complete Catalogue group and its explicit exclusions; Complete Content group: copy, images, sections, process, materials, navigation and forms; Complete Editorial group with list/new/edit/detail/revision views; Complete Settings, access and conditional subscribers/research tooling | M2, M3 | 6–10 days | All 32 requested destinations and 60 old page-file dispositions are reconciled with current server permissions and real services. |
| M7 — Complete orders and editorial display ordering | Finish commission board/list/detail and scoped filters; Add or adapt protected order print/card view; Verify submission, receipt and manual messaging end-to-end in QA; Implement editorial order manifests and accessible reorder controls; Connect order preview, publication and revision restore | M5, M6 | 3–5 days | Current eight-stage order workflow remains intact; editorial reordering is an independent, versioned presentation change. |
| M8 — Build editorial filters and the 480-entry production register | Reconcile 120 Journal and 120 FAQ proposals against existing records; Prepare 120 Portfolio and 120 Testimonial evidence slots; Implement appropriate public and Studio filter facets; Add publication evidence and language-review workflow; Bound queries and enforce import/create collision checks | M6, M7 | 3–5 days | 120 planned entries per editorial section are tracked independently and filter coverage reflects real metadata. |
| M9 — Produce, review and stage all new content and media | Create Journal and FAQ content in small reviewed batches; Build genuine Portfolio stories and Testimonial records; Review Drive assets for new usages and responsive crops; Complete language, factual and publication review records; Stage approved new records and reconcile counts | M8 | 4–7 days | 480 is complete only when each section has 120 unique approved new entries; evidence shortages remain open and are not filled with fiction. |
| M10 — Complete regression, visual and acceptance checks | Compare all templates and sections at required viewports; Run protected-data and real publication/permission regressions; Measure loading, interaction and layout stability; Run automated and actual human accessibility checks; Reconcile factual, native-language, consent and remaining gaps | M4, M5, M6, M7, M8 | 5–8 days | Current candidate has reproducible engineering evidence; human, field and genuine-customer evidence is separately recorded without false passes. |
| M11 — Release through a detailed PR and verify production | Prepare final change report, reviewable commits and release gate; Open detailed PR only under the applicable release instruction; Merge approved candidate and verify Vercel deployment; Verify public pages, signed-in Studio and approved content batches; Record observation and reversible rollback decisions | M10 | 1–3 days | Explicit release instruction, checked PR, exact main commit and READY deployment verified; content and external acceptance status remain separate. |

### Content production effort and batch guide

These are planning assumptions to calibrate against a ten-entry pilot, not measured production rates. Allow approximately 60–90 editorial days for 120 substantial English Journal entries, 10–20 for 120 researched FAQs, 30–60 for 120 project stories after complete source packs exist, and 8–15 for verification/editing of 120 genuine supplied testimonials. This is 108–185 editorial working days in addition to engineering, excluding source collection, photography and independent Hindi/Gujarati review. A specialist team may work in parallel, but publication cannot outrun source verification or consent.

Use batches of ten new entries per section. Each batch passes duplicate/source check → writing or source transcription → factual review → media/rights/crop review → meaning review → independent language review where required → saved Studio preview → specifically authorized publication → public revision verification. Keep incomplete project/quote slots pending. Never substitute Journal articles to declare the Portfolio/Testimonial targets complete.

M10 can start against code and representative approved records while M9 continues. M11 can release an explicitly approved code subset with unresolved content clearly disclosed; it cannot mark the full migration/content program complete. Full content acceptance also requires M9's four independent counts. No production publication is authorized by this planning document itself.

### Implementation tickets

Each ticket starts **planned**, with owner, changed files, evidence path, protected-field comparison and actual status filled during implementation. Tests belong to the candidate being reviewed. Dependency phases are shown above; dependent tickets within a phase proceed in the listed order unless inspection establishes independence.

| Ticket | Implementation | Phase prerequisite | Acceptance evidence |
| --- | --- | --- | --- |
| M0-01 | Record exact old/current source revisions and deployment identities | Start | Source snapshots and live observations are labelled separately; current work and cancelled audit are not mixed. |
| M0-02 | Inventory existing products, content, drafts, translations, settings and media usages read-only | Start | Private scoped IDs/revisions/hashes cover protected fields without exporting customer values into this report. |
| M0-03 | Establish isolated QA and a codex/ feature branch | Start | QA writes cannot reach the shared live database; no old bootstrap, seed or scraper executes. |
| M0-04 | Record current visual, keyboard and performance baselines | Start | Representative desktop/phone screenshots and cold/warm timings name the candidate and environment. |
| M0-05 | Confirm source, asset and content ownership boundaries | Start | Current contacts and all existing information frozen; unknown rights/offerings stay unresolved rather than inferred. |
| M1-01 | Complete public and utility route parity ledger | M0 | All 25 templates map to preserved canonical routes, new supported templates or explicit conditional states; dynamic records are not copied. |
| M1-02 | Complete Studio parent and child view ledger | M0 | All 60 page files, including create/edit/detail/print/auth, have a real destination or documented exclusion. |
| M1-03 | Specify all 74 registered sections and 16 landing-page blocks | M0 | Stable keys, order, conditions, existing data ownership and empty states recorded; Home has all 18 templates. |
| M1-04 | Inventory shared overlays and failure states | M0 | Header/menu, footer, cookie preferences, search, language, dialogs, loading, empty, forbidden and error states mapped from actual components. |
| M1-05 | Create before/target screenshot acceptance sheets | M0 | Compare same viewport and content; annotate content variance and accessibility/performance adaptations instead of silently changing design. |
| M2-01 | Port palette, type roles, spacing and surface tokens | M1 | Old source tokens drive the system; font licensing/loading and semantic contrast checked. |
| M2-02 | Build public header, menu, footer and section navigation | M1 | Current links/contact values preserved; mobile focus, Escape and scroll behavior verified. |
| M2-03 | Build all five Studio groups and collapsed/mobile sidebar | M1 | All 32 destinations accounted for; only authorized, supported destinations become active links. |
| M2-04 | Unify forms, tables, cards, dialogs and status components | M1 | Contain thumbnails, support long text, keep sticky actions clear of focus and show errors beside the relevant field. |
| M2-05 | Port restrained motion with static fallbacks | M1 | Narrative motion matches reference where useful; frequent Studio actions stay brief; no LCP element hidden awaiting animation. |
| M3-01 | Add compatible section, media-usage and layout manifests | M2 | Read adapters preserve existing payloads and IDs; new schema fields are optional/versioned and migrations idempotent. |
| M3-02 | Create shared saved-preview and dependency resolution | M2 | Preview binds to exact draft revision, locale, selected asset and layout; it cannot show unrelated live editor state. |
| M3-03 | Implement homepage hero/manifesto/featured-layout vertical slice | M2 | Use existing exact content/product selections; new sample copy belongs only to isolated QA fixtures. |
| M3-04 | Verify save, publish, comparison and restore-as-draft | M2 | Public projection matches intended revision; recovery does not publish, alter product records or reset settings. |
| M3-05 | Exercise permissions, concurrency and partial failure | M2 | 401/403/409, missing asset, failed save/publish and unsaved navigation preserve data; lightweight list summaries remain bounded. |
| M4-01 | Complete all 18 homepage sections in source order | M3 | Furniture and Rooms stay distinct; separate Testimonials, Workshops and Printing templates have explicit evidence conditions. |
| M4-02 | Port About, maker, craft and studio-story compositions | M3 | Current copy and stored image usage preserved; generated people are never represented as actual staff. |
| M4-03 | Port Process sections, ten steps and four material entries | M3 | Reuse current stage wording and chronology; unknown process claims remain unpublished. |
| M4-04 | Port commission, contact and large-format story structures | M3 | Current form contracts and factual channels remain authoritative; filter discovery remains easy on phones. |
| M4-05 | Complete conditional workshop/printing and shared section editing | M3 | All templates have Studio ownership and preview; no invented dates, services, pricing or availability becomes public. |
| M5-01 | Port shop/category/three-journey and grouped search layouts | M3, M4 | Current catalogue filters and identities retained; published Journal/Portfolio groups added without private/draft leaks. |
| M5-02 | Port product, saved-pieces, commission variants and receipt presentation | M3, M4 | Protected product/form/gallery and immutable saved-brief contracts unchanged; WhatsApp still requires customer Send. |
| M5-03 | Port Journal, Portfolio, FAQ and testimonial presentations | M3, M4 | Detail/index/empty/pagination states work with existing and new records; genuine proof separated from concept imagery. |
| M5-04 | Port all 16 validated custom landing-page block types | M3, M4 | Hero, text, product/collection/editorial/quote readers, video and galleries adapt to current services; media/product selections remain frozen. |
| M5-05 | Finish policies, Imprint, aliases and system states | M3, M4 | Approved text/SEO/routes preserved; errors, maintenance, rate limiting and private design preview do not leak drafts or gain unwanted indexing. |
| M6-01 | Complete Today group: overview, commissions, analytics and activity | M2, M3 | Linked scoped counts, correct periods and source labels; no fake revenue, conversions or order activity. |
| M6-02 | Complete Catalogue group and its explicit exclusions | M2, M3 | Products/categories/media/forms/import/export views preserve records; scraper and ingestion-dependent Catalog Fill remain on hold, not mock successes. |
| M6-03 | Complete Content group: copy, images, sections, process, materials, navigation and forms | M2, M3 | Exact-record links and actual preview; existing values are viewable and preserved during migration, with additive new-record editing. |
| M6-04 | Complete Editorial group with list/new/edit/detail/revision views | M2, M3 | Journal, Portfolio, Testimonials, FAQs, Pages and Landing Pages support genuine record lifecycle and source requirements. |
| M6-05 | Complete Settings, access and conditional subscribers/research tooling | M2, M3 | Current auth/staff policy retained; no new public signup or bulk outreach; non-supported services have explicit prerequisites. |
| M7-01 | Finish commission board/list/detail and scoped filters | M5, M6 | Saved brief, assignee, stage, notes, references and follow-ups render from current records with server authorization. |
| M7-02 | Add or adapt protected order print/card view | M5, M6 | Print only authorized saved facts; no unknown care/material/timing guarantees and no private data in screenshots. |
| M7-03 | Verify submission, receipt and manual messaging end-to-end in QA | M5, M6 | Duplicate-submit/error handling and customer consent preserved; synthetic records never count as genuine inquiry evidence. |
| M7-04 | Implement editorial order manifests and accessible reorder controls | M5, M6 | Drag plus Move up/down, stable IDs, curated/default sort distinction, concurrency guard and correct full-list behavior. |
| M7-05 | Connect order preview, publication and revision restore | M5, M6 | First default equals current order; later editorial layout revisions are explicit; product/gallery order and selections unchanged. |
| M8-01 | Reconcile 120 Journal and 120 FAQ proposals against existing records | M6, M7 | Duplicates replaced with distinct useful proposals; existing content is never rewritten or counted as new. |
| M8-02 | Prepare 120 Portfolio and 120 Testimonial evidence slots | M6, M7 | No invented project titles, quotes, ratings or people; required sources, rights, attribution and consent tracked privately. |
| M8-03 | Implement appropriate public and Studio filter facets | M6, M7 | URL/applied chips/clear/pagination and visible counts; existing categories unchanged; empty combinations remain honest. |
| M8-04 | Add publication evidence and language-review workflow | M6, M7 | Author/meaning/native review states distinct; publication does not imply native review; fallback and SEO locales correct. |
| M8-05 | Bound queries and enforce import/create collision checks | M6, M7 | Summaries for lists, record detail on demand, stable pagination, dry-run review and new-ID-only writes. |
| M9-01 | Create Journal and FAQ content in small reviewed batches | M8 | Ten-entry batches with factual sources, useful depth, duplicate check, exact draft preview and current policy links. |
| M9-02 | Build genuine Portfolio stories and Testimonial records | M8 | One real project/feedback source per record; original quote preserved and translations linked to it, not counted twice. |
| M9-03 | Review Drive assets for new usages and responsive crops | M8 | Verify identity/rights/disclosure, optimized size, alt/caption, focal point and desktop/mobile composition; existing assignments untouched. |
| M9-04 | Complete language, factual and publication review records | M8 | Native-review evidence supplied by a real reviewer; unresolved entries remain draft with reason. |
| M9-05 | Stage approved new records and reconcile counts | M8 | Review new IDs and publication revisions before any authorized production batch; no existing record mutation or false completion count. |
| M10-01 | Compare all templates and sections at required viewports | M4, M5, M6, M7, M8 | Reference/current screenshots, long locales, empty/full lists, error/loading states and cropped subjects covered. |
| M10-02 | Run protected-data and real publication/permission regressions | M4, M5, M6, M7, M8 | Before/after field comparison, role scope, stale saves, exact draft preview and revision recovery pass in isolated QA. |
| M10-03 | Measure loading, interaction and layout stability | M4, M5, M6, M7, M8 | Record hosted/local cold/warm samples and media/bundle budgets; field p75 remains separate from lab measurements. |
| M10-04 | Run automated and actual human accessibility checks | M4, M5, M6, M7, M8 | Keyboard, contrast, zoom, reduced motion, screen-reader task log and physical-phone task log name actual evidence; unavailable equipment stays open. |
| M10-05 | Reconcile factual, native-language, consent and remaining gaps | M4, M5, M6, M7, M8 | No pending item silently marked done; real inquiry and real-user evidence require actual consent-safe observations. |
| M11-01 | Prepare final change report, reviewable commits and release gate | M10 | List all module/template changes, protected baseline, migrations, licenses, test evidence, exclusions and remaining content dependencies. |
| M11-02 | Open detailed PR only under the applicable release instruction | M10 | No secrets/raw customer evidence; application changes and content publication steps distinguished; approved scope explicit. |
| M11-03 | Merge approved candidate and verify Vercel deployment | M10 | Required repository checks pass; exact main SHA matches READY deployment; no automatic reset/seed/import. |
| M11-04 | Verify public pages, signed-in Studio and approved content batches | M10 | Current contacts/SEO/indexing/Imprint, routes, records and media verified using small read-only production checks. |
| M11-05 | Record observation and reversible rollback decisions | M10 | Prior compatible code and draft revisions available; missing genuine inquiry/field/human evidence remains open until observed. |

### First implementation unit after plan approval

M0 establishes the frozen baseline and isolated QA; M1 maps the complete old source; M2 supplies the old-style frame; M3 proves the homepage hero/manifesto/featured-layout draft. The first delivery must include save → exact saved preview → isolated-QA publication → public verification → restore as draft. Use current exact text, images and product selections. Do not publish replacement copy or refactor all data models to achieve a visual demonstration.

## 11 Acceptance, improvements and release criteria

### Required parity and regression checklist

Create one row per W01–W28 family and per Studio module, with columns: structure, typography, palette, spacing, imagery, motion, responsive behavior, keyboard interaction, loading/error/empty state, content ownership, permission/publication, evidence path and status. Status values: not started; implemented awaiting verification; partially verified; verified for stated scope; blocked. Do not collapse them into one percentage without explaining missing gates.

Required viewports: 1920, 1440, 1200, 992, 768, 512 and 320 CSS px, plus a representative 390 px phone layout. Use consistent recorded heights. Test materially distinct templates and content extremes, not hundreds of identical product records. Include long Hindi/Gujarati labels, long titles, missing images, no results, empty portfolio, many table columns, crop-edge subjects and open dialogs.

Accessibility acceptance includes semantic headings/landmarks, meaningful image alternatives, keyboard completion, visible unobscured focus, accessible errors/status messages, reduced motion and pause controls, native 200%/400% zoom and reflow. Check normal text at 4.5:1, large text at 3:1 and relevant non-text controls at 3:1. Aim for 44 px touch controls as a project usability target; WCAG 2.2 AA's minimum target criterion is 24 CSS px with exceptions, not a blanket 44 px rule. [WCAG 2.2 quick reference](https://www.w3.org/WAI/WCAG22/quickref/).

Performance acceptance: target LCP ≤2.5 s, INP ≤200 ms and CLS ≤0.1 at the 75th percentile for real users. Lab tests are diagnostic evidence, not field compliance. Establish repeatable local and hosted runs, cold/warm samples, viewport, throttling and candidate commit; separately review image bytes, waterfall, fonts, client bundle and long tasks. No animation is allowed to hide the LCP candidate while waiting for a runtime. [Web Vitals guidance](https://web.dev/articles/vitals).

Current retained source has prior passing engineering checks recorded in PR 44, including 296 unit, 12 preflight and 403 server assertions, lint/type validation and build. These are history, not a test of the proposed migration. Run current-candidate checks after implementation; preserve meaningful tests and document any environment workaround. No application tests were rerun merely to produce this plan.

### Required fixes versus enhancements

| Classification | Work |
| --- | --- |
| Required | Old page/section layout parity; old token/type/motion mapping; all listed Studio modules accounted for; current fact/data protection; genuine editorial/publication support; correct preview/recovery; no broken routes; mobile loading, accessible controls and system states |
| Recommended after parity | Pinned Studio destinations, saved views, more precise filter chips, consistent dirty-draft messages, topic-led journal covers, faster bounded list queries and linked health issues |
| Optional/conditional | Video loops, custom cursor/magnetic effects, complex frame sequences, shaders/glass, new subscriber capture, broader analytics, real workshops/printing offerings and any future scraper work |

### Pending items carried forward honestly

- Independent native Hindi/Gujarati review remains a separate human task. Assistant translation/meaning review cannot certify independent native-reader approval.
- Existing 36 article translations: preserve their exact current drafts/publication states. Earlier review counts are historical. The new content freeze puts corrections/publication of these existing translations on hold unless separately authorized; new-entry translation review remains in scope.
- Human screen-reader and physical-phone checks remain unperformed unless the owner or a qualified tester provides actual evidence. Desktop emulation does not substitute for these.
- Real-user performance requires legitimate traffic and sufficient measurements. A lab run cannot create field p75.
- Genuine inquiry observation requires a real customer journey. Synthetic verification inquiries do not count, and no customer should be contacted just to manufacture acceptance.
- Complete media/crop/factual content sign-off remains entry-specific. Four visual checks and a Drive listing do not establish approval of the entire collection.
- Search indexing and Imprint were already released; verify their continued correct behavior instead of reopening historical resolved tasks as if still broken.

### Release workflow

Keep implementation on a `codex/` feature branch. Save screenshots and raw audit evidence locally, outside tracked application files. Prepare reviewable commits and a detailed PR explaining the old/current mapping, actual feature scope, content/schema changes, protected data, test evidence and remaining limitations. Only an explicit owner release instruction authorizes merge/deployment for this new migration. After approval, satisfy repository checks, merge through the PR, confirm exact `main` SHA and Vercel READY deployment, then verify public pages and signed-in Studio. Database/production publication changes are explicit steps, never side effects of a design build.

Rollback: retain the previous source/deployment revision and compatible document readers; use current revision recovery for affected editorial records. An additive schema migration must remain safe for the prior reader where possible. No deletion/reset/backup feature is added. If a change cannot be reversed without protected data loss, redesign the migration before release.

## 12 Installed skills and dashboard resources

| Resource | Actual use in this analysis | Decision |
| --- | --- | --- |
| UI/UX Pro Max | Read guidance and ran targeted dashboard/navigation UX search | Apply responsive tables, keyboard order, useful breadcrumbs and unobscured sticky navigation; old-site aesthetic overrides generic suggestions |
| Frontend Design | Read direction/typography/content principles | Old site is the chosen visual language; no unrelated replacement style |
| Emil Design Engineering | Read motion/interaction rules; applied Before/After/Why review | Keep narrative and frequent-work motion distinct; precise properties and reduced-motion behavior |
| Design Reference Workflow | Read reference-selection workflow | Actual old repo/live pages are primary references; do not mix unrelated effects libraries |
| Google Drive | Read skill and used connected folder/metadata tools | Asset IDs and media mapping grounded in supplied folder; no originals changed |
| Browser review | CUA browser DOM and screenshots, authenticated overview and editorial-list inspection | Live evidence limited to listed pages/states; no claim of full workflow testing |
| App Store Screenshots | Installed, not applied | This is a website/Studio migration, not app-store marketing artwork |
| Gstack | Prior installation record says not installed | No claim that its reviewer ran |
| Mobbin | Not queried in this renewed audit | Existing old-site reference is sufficient; account connection alone does not prove search access |
| Poppins, pattern.css, IRA, shadcn Card | Available from retained setup | Do not add them to public UI unless old-design parity requires them; preserve licenses |
| ShaderGradient, Paper, Three/Fiber/Drei, Liquid Glass | Isolated experimental toolkit exists | Keep outside public/Studio bundles by default; no shader effect needed to match old layout |

The attached Bionis, Medesk and Gridline registry URLs were attempted through web retrieval but returned internal fetch errors. Their exact current source/license/dependency suitability was not established in this pass. Do not label them installed/approved or execute `npx ...@latest` blindly. During M1, inspect pinned registry JSON and license, then compare candidate sidebar, stat, table or filter primitives to the old Studio. Only adopt a component if it reduces work while preserving old design and current data/permissions. Do not import demonstration patients, finances, charts or external dashboard branding.

## 13 Consolidated master implementation prompt

Copy the following only when starting the authorized implementation scope. The fuller page/module specifications, source ledgers and acceptance gates remain part of its contract.

```text
# Rivya Living Art — final implementation instruction

Status: implementation guide prepared 8 October 2026; not authorization to publish or release.

Use RivyaLivingArt2.0 as the functional/data base. Use OLDWEBSITE as the visual,
page-structure and section reference. Reproduce the old design language across
the public site and Studio through adapters to current services.

References:
https://github.com/rivyalivingart2/RivyaLivingArt2.0.git
https://www.rivyalivingart.com/
https://www.rivyalivingart.com/studio
https://github.com/rivyalivingart2/OLDWEBSITE.git
https://oldwebsite-one.vercel.app/
https://oldwebsite-one.vercel.app/studio
https://drive.google.com/drive/folders/1P2HCTmPge6HsEwtoo-xGEzPTSn68oZOW

PROTECT ALL EXISTING INFORMATION
Do not change any existing product or content information: published/draft
titles, text, translations, metadata, IDs, URLs, categories, status, history,
product facts/prices/forms, galleries, associations, image assignments, alt,
captions, stored crops, featured selections and product/gallery ordering.
Preserve all business/contact/social, staff/customer/order records and saved
briefs. Current phone +91 8320404132; email rivyalivingart2.0@gmail.com.
Read other current settings from their authoritative store, never old defaults.
Add new records/configuration; use read adapters for existing content. Reject
new-record ID collisions. Duplicate detection never rewrites an existing entry.
No old product transfer, scraper installation/execution or Catalog Fill ingestion.
Do not restore backups or key-custody requirements. Keep revision recovery.

COMPLETE SCOPE
Use the complete old-route-parity.json ledger: 85 old page files, comprising
25 public/utility templates and 60 Studio page files; account for handlers
and shared states separately. Preserve canonical current URLs; map individual
old identities only when verified. A redirect is not visual parity.
Implement all 74 section definitions in old-section-manifest.json, including
all 18 Home templates and the separate Furniture, Rooms, Workshops and Print
sections. Account for all 16 custom landing block types. Conditional business
offerings remain draft/hidden until supported by actual approved facts.

Cover W01–W28 plus every ledger child/create/edit/detail/print/auth state.
Studio's 32 destinations are: Overview, Commissions, Analytics, Activity;
Products, Categories, Media Library, Bulk Import, Catalog Fill, Exports,
Product Scraper, Research, Content Gaps; Site Copy, Site Images, Page Sections,
Process Steps, Materials, Navigation, Commission Form; Journal, Portfolio,
Testimonials, FAQs, Pages, Landing Pages; Site Settings, SEO, Users,
Subscribers, Content Health, Content Lab. Include Collapse, current follow-ups,
languages and route review. Mark excluded/conditional modules honestly;
no mock success screen or dead sidebar link counts as implementation.

CONTENT: 120 NEW ENTRIES IN EACH SECTION
Produce 120 Journal entries, 120 Portfolio records, 120 Testimonials and
120 FAQs. Use editorial-production-register.json: 240 explicit article/question
briefs and 240 genuine-evidence intake slots. These are plans, not completed
content. Check duplication against all existing drafts/published records.
Do not count translations, repeat placements, images or existing entries twice.
Do not invent projects, customers, quotes, ratings, facts or orders. Each
Portfolio/Testimonial needs actual distinct source evidence and permission.
If evidence is missing, leave that section count pending; do not substitute
other content to declare it complete. Do not contact customers without a
separate explicit instruction. Review approved new Drive media usages at both
desktop and phone crops; never edit Drive originals or existing image usage.

FILTERS AND BOTH KINDS OF ORDER
Add useful public/Studio filters using actual metadata, meaningful counts,
applied chips, clear actions and bounded pagination. No invented values just
to populate every possible combination; existing categories remain unchanged.
Preserve eight current order stages, immutable saved briefs, scoped records,
notes/follow-ups, receipt recovery and manual WhatsApp Send. Add supported
print/card presentation. No payment/account feature or synthetic real orders.
Editorial ordering uses a separate revisioned presentation manifest with
drag and keyboard Move controls, preview, optimistic concurrency, publication
and restore-as-draft. Initial default equals current order. Product/gallery
ordering and selected product IDs remain frozen.

IMPLEMENTATION AND ACCEPTANCE
Follow M0–M11 and all 60 tickets. Start with protected baseline and isolated
QA, exhaustive mapping, shared old-style frames, then one complete homepage
save -> actual saved preview -> QA publish -> public verification -> draft
revision recovery workflow. Expand only after that pattern passes.
Keep lightweight list summaries, server permissions and low database traffic.
Validate responsive layouts, keyboard/touch, native zoom, contrast, reduced
motion, loading/error/empty states, stale saves, role denial and media failures.
Use relevant installed design skills to refine the selected old-site style,
not to introduce unrelated effects. Review external code/license/dependencies.
Preserve current SEO/content values; only additive new metadata is in scope.
Separate lab tests from field p75; independent native review from assistant
review; emulation from actual screen-reader/physical-phone evidence. Never
claim unavailable human, field or genuine inquiry checks passed.

Keep this migration local on a codex/ feature branch until the applicable
explicit release request. Then use a detailed PR to main, required checks,
exact Vercel READY deployment verification and signed-in/public smoke checks.
Production content publication is a separate explicit batch step, not a build
side effect. Track code/template readiness, four content counts and external
acceptance separately. Do not change or restore the cancelled design audit.

```

## 14 Deliverables and status at this handoff

Completed for this planning request: full old-source coverage for 85 page templates and 74 registered section definitions; all 18 homepage templates; 16 landing-page block types; W01–W28 public families; 32 Studio destinations and their child views; six screenshot comparison pairs; old visual/motion tokens; current architecture contracts; Drive candidate mappings; both orders/commissions and editorial ordering; 480-entry production register; 12 phases and 60 tickets; acceptance criteria and consolidated implementation prompt.

Use `Rivya-Final-Phase-Wise-Guide.html` for the execution overview, this illustrated report for specifications, `Rivya-Editorial-Production-Register.html` for all 480 candidates, and `implementation-tracker.json` for structured ticket tracking. JSON route/section registers retain exact source evidence. Existing screenshots are retained from the 8 October review; this planning extension did not claim a new exhaustive live audit.

Not performed: application-code migration, production-record creation/publication, rewriting existing content, database migration, product import, scraper work, full rights/crop approval, new production workflow tests, fresh performance tests, human/native/device certification, push/PR or deployment. All 480 new content entries remain planned; 240 of them require real project/feedback sources before writing can be completed.

## 15 Complete old site coverage and protected content

This revision includes every old page template and every registered section, rather than only the sampled pages. The source inventory contains **85 page files: 25 public or utility templates and 60 Studio page files**, plus 13 request handlers. Dynamic product/article/project routes represent templates, not permission to copy their old database records. All 32 sidebar destinations and their create, edit, detail, print and supporting views must be accounted for. The full destination ledger is in Appendix D and `old-route-parity.json`.

The old section registry contains **74 section definitions across nine groups**. This includes **18 homepage sections**, ten process-step entries and four material-card entries. The previous 17-section estimate is corrected. Registry defaults and conditional flags must be preserved in the migration specification; a template being included does not make an unsupported business offering public. Appendix E lists every registered key, source line, image slot and visibility condition.

### Existing product and content information is frozen

Preserve existing published and draft titles, body text, summaries, FAQs, translations, SEO values, product facts, prices, identifiers, URLs, categories, form definitions, selected products, gallery associations, image assignments, alt text, captions, stored crop values, publication states and revision history. Existing orders, saved specifications and contact/social/business settings also remain unchanged. The old repository and database stay read-only references.

The redesign may change layout, styling, spacing, typography, component composition and accessible interaction. It must read existing content through compatibility adapters. It may create new section configuration, new editorial records and new editorial media usages without replacing protected values. When an old section needs information not already available, build its draft/empty template and record the content requirement. Do not move an existing paragraph into an incompatible meaning merely to fill a layout.

New editorial filter metadata lives on new entries. Existing content keeps its current categories and labels; use existing metadata and an explicit Unclassified group rather than silently reclassifying it. New editorial display-order manifests reference existing IDs without rewriting content records. The first migrated default retains current published order; a later chosen arrangement is a distinct previewable presentation revision. Product order, featured product selections and gallery order remain frozen.

Duplicate detection is read-only for existing records. A proposed Journal/FAQ entry that duplicates current content is replaced with a distinct useful idea or marked redundant; it never triggers an automatic rewrite, merge, archive or deletion. Old content is not imported wholesale. If a specific old non-product entry is later selected for transfer, keep its text intact in a separate draft, check ownership and duplicates, and record the origin without overwriting the current record.

Before implementation, capture a minimal protected-data baseline in a private local evidence file: IDs, revision numbers and canonical hashes of the protected fields. Compare at each phase. Structural wrappers may be added with exact before/after content equality; avoid rewriting old document payloads where a read adapter works. Reject imports whose new-record ID already exists. Reconcile legitimate concurrent owner edits rather than reverting them to an earlier hash. This is a verification record, not a restored backup subsystem.

### Full homepage order

Use the old registry sequence as the layout reference: **Hero → Manifesto → Featured pieces → Large format → Material story → Collections → Furniture → Maker → Rooms → Recent commissions → Testimonials → Bespoke → Workshops → 3D printing → Process → Why Rivya → Journal → Closing invitation**. Furniture and Rooms are separate sections. Workshops and Printing are separate sections. Neither their presence in the registry nor a design rendering proves a current offering.

Implement all 18 section templates with stable keys, copy/media ownership, responsive layouts, navigation behavior and editing controls. Render a conditional section only when its existing or newly approved information supports it. Keep unsupported sections as visible draft capabilities in Studio with the exact missing-content reason. Preserve current approved wording and selected product IDs when mapping to this order. A page can have fewer visible sections while the full template scope is complete; report template readiness and content readiness separately.

### Pages not represented by the section registry

| Old template | Complete structure to preserve or adapt | Completion boundary |
| --- | --- | --- |
| Shop index | Breadcrumb and intro, ecosystem/category navigation, collection doorway rail, search/filter toolbar, active filters, count/sort, product grid, pagination and no-results state | Read only the current catalogue. Preserve existing filter meanings and current canonical-route decisions; a redirect alone does not reproduce this layout |
| Category | Collection intro, transformation/story band, filtered pieces, related collections and commission invitation | Map only verified category identities; no old category/product import |
| Product | Breadcrumb, media gallery, actions, product/specification narrative, room context where applicable, order panel, relevant testimonials and related pieces | Same current product text, price, fields and gallery references; unsupported content stays absent |
| Search | Query heading and input, matching collections, product results, Journal results, Portfolio results, empty/short-query state and helpful next action | Add grouped published-editorial results without changing existing product search semantics; no draft or private result leaks |
| Wishlist | Saved item list, item actions, browse/brief continuation and empty state | Current browser storage behavior remains authoritative |
| WhatsApp handoff | Saved request summary, reference, Open/Copy actions, recovery and next steps | Current receipt authorization and manual Send; never old phone or automatic messaging |
| Journal index | Intro, category/topic navigation, lead story, archive, pagination and conditional newsletter band | Existing articles and categories unchanged; subscriber template remains inactive without real consent/unsubscribe support |
| Journal detail | Breadcrumb, title/metadata, cover/caption, article body and TOC, relevant pieces/collections, related reading, share controls and closing invitation | Existing article content and URLs remain exact; references use current IDs |
| Portfolio index | Intro/category navigation, archive, project wall and commission invitation | Completed-project results contain only genuine approved records; concepts remain clearly separate |
| Portfolio detail | Project title, story, brief, materials, process, final gallery, related work and commission invitation | Facts and photographs tied to that real project; hide unknown fields |
| FAQ | Title, search, sticky question index, accessible answers, answer anchors/copy link and closing contact action | Old public FAQ uses a question index, not stored categories. Topic filters are a new additive capability, not a claimed old feature |
| Custom landing page | Every supported typed block in the old block registry, block ordering, media, CTA and empty/unpublished state | Map each block to a validated current renderer; reject executable content and unsupported blocks |
| Privacy and Terms | Legal title, unchanged approved sections, reading layout and contact links | Content cannot be rewritten by the design migration |
| Gone, Maintenance, Too many requests | Correct operational message, appropriate status, recovery destination and accessible layout | Do not make an unavailable page return a misleading successful status |
| Design lab | Old component/state demonstrations in an isolated private preview | No production demo records, exposed experiments or new public menu link |
| Studio access pages | Old login, forgotten-password, reset and signup compositions mapped to current allowed authentication journeys | Preserve current access policy. No open signup, new credentials, disabled protection or copied old auth backend |

Global header, footer, announcement, menus, consent notices, drawers, search overlays, breadcrumbs, pagination, toast/status messages, loading, errors, 404, lightbox, form errors and empty states are part of the page, even when implemented in child components. Appendix D records page anchors and imported components; M1 must trace their nested renderers and capture default/conditional states before claiming visual parity. The 12 existing screenshots remain a sampled comparison set, not evidence that all 85 templates have been visually accepted.

## 16 Editorial filters and display order

The target is **120 new unique entries per editorial section**, not 120 entries for each possible combination of filters. Every relevant filter must work and return honest counts. Never tag an entry incorrectly, invent a project or create duplicates to fill an empty filter. Unsupported categories may remain empty in Studio and hidden from public navigation. Category coverage is measured separately from the total number of records.

### Filter contracts

| Surface | Public discovery | Studio filters and sorting | Protection and acceptance |
| --- | --- | --- | --- |
| Journal | Search, topic/category, collection journey, useful format, relevant tags, language availability; existing published dates/read-time only where reliable | Status, review state, source revision, author when known, missing cover/alt/SEO, topic, journey, date range; sort by published date, title and curated order | Existing 36 records keep current labels and content. Twelve new planning topics have ten briefs each. Search/category changes reset pagination; clear chips and browser Back work |
| Portfolio | Search, actual project category, journey, confirmed material, room/context when permitted; separate concept studies if retained | Approval/evidence state, missing real media, consent, category, publication, locale, date; sort title/date/curated order | Do not infer materials/client location from an image. Show actual project counts. No concept or duplicated photograph counts as a completed project |
| Testimonials | Genuine quote categories and optional linked project/product; no public internal review or consent details | Status, permission/consent, source present, attribution scope, linked current product/project, media type, locale; sort date/name/curated order; rating only if genuinely supplied | One source quote counts once across translations and placements. No default stars, fabricated identities or invented review dates |
| FAQs | Search, new-entry topic, journey, grouped question index, answer deep links | Status, topic, policy/source, locale, duplicate flag, order, last verification; sort question/order | Existing answers and anchors remain unchanged. Old source search/question-index behavior is retained; topic metadata is additive for new entries |
| Orders and commissions | No public customer list; only authorized individual receipt | Current stage, assignee, follow-up due, source, product/bespoke type, date range, search by allowed reference/text; sort created/updated/follow-up | Scope queries and counts to the signed-in staff member. No inferred values or synthetic commercial evidence |

All Studio lists retain meaningful old status/search/sort controls. The old demo-only filter belongs only in isolated QA; it must not become a route for inserting fictional production evidence. Old Journal category/tag tabs, Portfolio category sorting, Testimonial status/consent/rating fields and FAQ order/search controls are accounted for individually. Retain unsupported legacy values without reclassifying protected records; label them clearly.

Use native selects or accessible comboboxes, visible applied-filter chips, Clear all, result count, stable pagination and a mobile filter drawer with focus return. Encode safe public discovery state in URLs; keep sensitive customer search terms out of share links and analytics. Invalid facet values recover safely. Empty results explain the filters and offer a reset. List endpoints return bounded summaries and load bodies only after selecting a record.

### Editorial display order

Keep separate configuration for global archive order, category order, featured slots, related-content selections, FAQ groups/items and testimonial placements. Each references stable IDs and has its own version. Define a stable fallback order and tie-breaker; never use random ordering. Existing product/galleries/featured-product selections remain unchanged.

Provide drag handles and Move up/Move down keyboard buttons. Reordering is enabled only in an explicit curated-order view with a complete known scope; disable it under a different sort, text search or incomplete pagination unless a server-side scoped move contract exists. Moving one page of results must not reorder unseen entries accidentally. Preview the arrangement at desktop/phone widths, publish the selected presentation revision, and restore it as a draft. Stale ordering changes return a conflict without losing the user's pending arrangement.

## 17 Orders and commissions implementation guide

Orders remain the current saved inquiry and personal conversation workflow. Reuse the exact stages from `src/lib/studio-orders.ts`: **NEW, CONTACTED, QUALIFIED, QUOTED, CONFIRMED, IN_PRODUCTION, COMPLETED, CLOSED**. Restyling labels does not authorize changing stage semantics, existing values, transition rules or customer data. Preserve the `SavedBriefV2`, legacy evidence and handoff contracts in `order-contract.ts`.

| Step | Public or Studio presentation | Existing behavior to preserve | Required verification |
| --- | --- | --- | --- |
| Discover and choose | Old product/collection composition; current product or bespoke entry | Same product identity, price, fields, requirements and availability | Compare protected product/form references |
| Prepare brief | Old form sections with clear labels, validation and reference handling | Existing conditional fields, limits, consent and saved draft behavior | Keyboard completion, errors, retry, session/device constraints |
| Save request | Clear pending state and successful receipt | One saved inquiry and immutable specification snapshot; existing idempotency | Duplicate click/refresh does not duplicate records |
| Open or copy message | Receipt with reference, Open WhatsApp and Copy | Current destination, saved text, manual customer Send, recoverable handoff state | Open/Copy do not mark delivery or sale as confirmed |
| Triage | Old board/list, filters, count and exact record link | Current assignee scope and stage permissions | Different staff roles cannot access others' private records |
| Review detail | Original request, files, notes, stage, assignee, timeline and follow-up | Preserve original evidence separately from internal working notes | No product edit rewrites the saved request snapshot |
| Follow up | IST presets, overdue/upcoming views and history | Existing dates, ownership, audit and manual contact | Boundary dates and permission checks; no auto message |
| Print commission card | Old print-only composition reached from the authorized record | Only verified saved/customer/product facts the current contract permits | No invented care/material/timing values; private route and print styling |
| Complete or close | Existing allowed stage action, reason and history | No automatic payment, shipment or revenue inference | Version conflicts preserve work; audit records correct action |

No payment gateway, checkout, customer account, customer notification bot, synthetic orders or fabricated revenue is included. New styling must not introduce these through an imported dashboard. Do not copy the old server actions or WhatsApp number. A proposed print view is additive read-only presentation; it must pass current record-level authorization.

For engineering checks, use isolated local fixtures with explicit test labels and no external sends. Production acceptance uses a legitimate existing inquiry only with proper access, or waits for a genuine new inquiry. Do not create 120 orders to satisfy a content target: **the four editorial targets exclude orders**.

## 18 Execution handoff and completion tracking

Start with M0, then M1 and the M2/M3 shared framework. Prove one homepage save → actual saved preview → isolated publication → public readback → restore-to-draft flow before rolling the pattern across all old sections. Each phase ends with a change summary, exact files, tests run, protected-data comparison, screenshots, open issues and the next checkpoint. A source file existing is not proof that its UI or publishing behavior works.

Use three separate scorecards: **template/module implementation**, **editorial readiness**, and **live acceptance**. Count page templates, registered sections and child views separately. For editorial progress, report planned, drafted, source verified, reviewed, previewed and published counts for each of Journal, Portfolio, Testimonials and FAQs. Translations, repeated placements and imported duplicates do not increase the unique-content count.

Full editorial completion requires at least 120 genuine approved entries in each category. If 120 real projects or testimonials are unavailable, leave that category incomplete with its actual count; do not substitute articles or simulated endorsements and call the target met. The platform can be ready before that evidence is available, but a release must state exactly which content gates remain open.

Keep development local. When the owner explicitly requests release, use a detailed PR into `main`, required checks and exact Vercel deployment verification. No direct push to main, hidden production content import or permission expansion. Existing source/deployment rollback and editorial revision recovery remain supported; backups and recovery-key custody remain excluded as previously requested.


## Appendix A Full route source inventory

This is a filesystem inventory, not evidence that every route is active or tested. `[locale]` is the old multilingual path layer; route groups in parentheses do not appear in URLs. Current Studio module routes are admitted dynamically by `src/lib/studio-modules.ts`, so their 16 entries must be read alongside the catch-all file. API endpoints remain implementation dependencies, not proposed public pages.

### Old repository

| Route pattern | Type | Source |
| --- | --- | --- |
| /[locale]/about | page | `src/app/[locale]/(v2)/about/page.tsx` |
| /[locale]/blog | page | `src/app/[locale]/(v2)/blog/(index)/page.tsx` |
| /[locale]/blog/[slug] | page | `src/app/[locale]/(v2)/blog/[slug]/page.tsx` |
| /[locale]/contact | page | `src/app/[locale]/(v2)/contact/page.tsx` |
| /[locale]/custom-order | page | `src/app/[locale]/(v2)/custom-order/page.tsx` |
| /[locale]/faq | page | `src/app/[locale]/(v2)/faq/page.tsx` |
| /[locale]/large-resin-art | page | `src/app/[locale]/(v2)/large-resin-art/page.tsx` |
| /[locale]/p/[slug] | page | `src/app/[locale]/(v2)/p/[slug]/page.tsx` |
| /[locale] | page | `src/app/[locale]/(v2)/page.tsx` |
| /[locale]/portfolio | page | `src/app/[locale]/(v2)/portfolio/(index)/page.tsx` |
| /[locale]/portfolio/[slug] | page | `src/app/[locale]/(v2)/portfolio/[slug]/page.tsx` |
| /[locale]/privacy | page | `src/app/[locale]/(v2)/privacy/page.tsx` |
| /[locale]/process | page | `src/app/[locale]/(v2)/process/page.tsx` |
| /[locale]/product/[slug] | page | `src/app/[locale]/(v2)/product/[slug]/page.tsx` |
| /[locale]/search | page | `src/app/[locale]/(v2)/search/page.tsx` |
| /[locale]/shop | page | `src/app/[locale]/(v2)/shop/(index)/page.tsx` |
| /[locale]/shop/[category] | page | `src/app/[locale]/(v2)/shop/[category]/page.tsx` |
| /[locale]/shop/wishlist | page | `src/app/[locale]/(v2)/shop/wishlist/page.tsx` |
| /[locale]/terms | page | `src/app/[locale]/(v2)/terms/page.tsx` |
| /[locale]/whatsapp-order | page | `src/app/[locale]/(v2)/whatsapp-order/page.tsx` |
| /[locale]/workshops | page | `src/app/[locale]/(v2)/workshops/page.tsx` |
| /[locale]/gone | page | `src/app/[locale]/gone/page.tsx` |
| /[locale]/maintenance | page | `src/app/[locale]/maintenance/page.tsx` |
| /[locale]/too-many-requests | page | `src/app/[locale]/too-many-requests/page.tsx` |
| /api/auth/[...nextauth] | handler | `src/app/api/auth/[...nextauth]/route.ts` |
| /api/cron/mirror-images | handler | `src/app/api/cron/mirror-images/route.ts` |
| /api/cron/publish-scheduled | handler | `src/app/api/cron/publish-scheduled/route.ts` |
| /api/cron/scrape-drain | handler | `src/app/api/cron/scrape-drain/route.ts` |
| /api/csp-report | handler | `src/app/api/csp-report/route.ts` |
| /api/draft | handler | `src/app/api/draft/route.ts` |
| /api/form-token | handler | `src/app/api/form-token/route.ts` |
| /api/scraper/export | handler | `src/app/api/scraper/export/route.ts` |
| /api/scraper/export-confirmed | handler | `src/app/api/scraper/export-confirmed/route.ts` |
| /api/studio/export/confirmed | handler | `src/app/api/studio/export/confirmed/route.ts` |
| /api/subscribers/export | handler | `src/app/api/subscribers/export/route.ts` |
| /api/upload | handler | `src/app/api/upload/route.ts` |
| /design-lab | page | `src/app/design-lab/page.tsx` |
| /studio/activity | page | `src/app/studio/(dashboard)/activity/page.tsx` |
| /studio/analytics | page | `src/app/studio/(dashboard)/analytics/page.tsx` |
| /studio/blog/[id] | page | `src/app/studio/(dashboard)/blog/[id]/page.tsx` |
| /studio/blog/new | page | `src/app/studio/(dashboard)/blog/new/page.tsx` |
| /studio/blog | page | `src/app/studio/(dashboard)/blog/page.tsx` |
| /studio/catalog-fill/conflicts | page | `src/app/studio/(dashboard)/catalog-fill/conflicts/page.tsx` |
| /studio/catalog-fill | page | `src/app/studio/(dashboard)/catalog-fill/page.tsx` |
| /studio/categories | page | `src/app/studio/(dashboard)/categories/page.tsx` |
| /studio/content-gaps | page | `src/app/studio/(dashboard)/content-gaps/page.tsx` |
| /studio/content-health | page | `src/app/studio/(dashboard)/content-health/page.tsx` |
| /studio/content-lab | page | `src/app/studio/(dashboard)/content-lab/page.tsx` |
| /studio/custom-pages/[id] | page | `src/app/studio/(dashboard)/custom-pages/[id]/page.tsx` |
| /studio/custom-pages/new | page | `src/app/studio/(dashboard)/custom-pages/new/page.tsx` |
| /studio/custom-pages | page | `src/app/studio/(dashboard)/custom-pages/page.tsx` |
| /studio/exports | page | `src/app/studio/(dashboard)/exports/page.tsx` |
| /studio/faqs | page | `src/app/studio/(dashboard)/faqs/page.tsx` |
| /studio/forms | page | `src/app/studio/(dashboard)/forms/page.tsx` |
| /studio/import | page | `src/app/studio/(dashboard)/import/page.tsx` |
| /studio/inquiries/[id] | page | `src/app/studio/(dashboard)/inquiries/[id]/page.tsx` |
| /studio/inquiries | page | `src/app/studio/(dashboard)/inquiries/page.tsx` |
| /studio/materials | page | `src/app/studio/(dashboard)/materials/page.tsx` |
| /studio/media | page | `src/app/studio/(dashboard)/media/page.tsx` |
| /studio/navigation | page | `src/app/studio/(dashboard)/navigation/page.tsx` |
| /studio | page | `src/app/studio/(dashboard)/page.tsx` |
| /studio/pages/[id] | page | `src/app/studio/(dashboard)/pages/[id]/page.tsx` |
| /studio/pages | page | `src/app/studio/(dashboard)/pages/page.tsx` |
| /studio/portfolio/[id] | page | `src/app/studio/(dashboard)/portfolio/[id]/page.tsx` |
| /studio/portfolio/new | page | `src/app/studio/(dashboard)/portfolio/new/page.tsx` |
| /studio/portfolio | page | `src/app/studio/(dashboard)/portfolio/page.tsx` |
| /studio/process | page | `src/app/studio/(dashboard)/process/page.tsx` |
| /studio/products/[id] | page | `src/app/studio/(dashboard)/products/[id]/page.tsx` |
| /studio/products/new | page | `src/app/studio/(dashboard)/products/new/page.tsx` |
| /studio/products | page | `src/app/studio/(dashboard)/products/page.tsx` |
| /studio/research | page | `src/app/studio/(dashboard)/research/page.tsx` |
| /studio/scraper/analytics | page | `src/app/studio/(dashboard)/scraper/analytics/page.tsx` |
| /studio/scraper/confirmed | page | `src/app/studio/(dashboard)/scraper/confirmed/page.tsx` |
| /studio/scraper/explorer | page | `src/app/studio/(dashboard)/scraper/explorer/page.tsx` |
| /studio/scraper/large-format | page | `src/app/studio/(dashboard)/scraper/large-format/page.tsx` |
| /studio/scraper/mapping | page | `src/app/studio/(dashboard)/scraper/mapping/page.tsx` |
| /studio/scraper | page | `src/app/studio/(dashboard)/scraper/page.tsx` |
| /studio/scraper/quality | page | `src/app/studio/(dashboard)/scraper/quality/page.tsx` |
| /studio/scraper/review | page | `src/app/studio/(dashboard)/scraper/review/page.tsx` |
| /studio/scraper/runs | page | `src/app/studio/(dashboard)/scraper/runs/page.tsx` |
| /studio/scraper/sources/[key] | page | `src/app/studio/(dashboard)/scraper/sources/[key]/page.tsx` |
| /studio/scraper/sources | page | `src/app/studio/(dashboard)/scraper/sources/page.tsx` |
| /studio/sections | page | `src/app/studio/(dashboard)/sections/page.tsx` |
| /studio/seo | page | `src/app/studio/(dashboard)/seo/page.tsx` |
| /studio/settings | page | `src/app/studio/(dashboard)/settings/page.tsx` |
| /studio/site-copy | page | `src/app/studio/(dashboard)/site-copy/page.tsx` |
| /studio/site-images | page | `src/app/studio/(dashboard)/site-images/page.tsx` |
| /studio/subscribers | page | `src/app/studio/(dashboard)/subscribers/page.tsx` |
| /studio/testimonials/[id] | page | `src/app/studio/(dashboard)/testimonials/[id]/page.tsx` |
| /studio/testimonials/new | page | `src/app/studio/(dashboard)/testimonials/new/page.tsx` |
| /studio/testimonials | page | `src/app/studio/(dashboard)/testimonials/page.tsx` |
| /studio/users | page | `src/app/studio/(dashboard)/users/page.tsx` |
| /studio/forgot-password | page | `src/app/studio/forgot-password/page.tsx` |
| /studio/inquiries/[id]/card | page | `src/app/studio/inquiries/[id]/card/page.tsx` |
| /studio/login | page | `src/app/studio/login/page.tsx` |
| /studio/reset-password | page | `src/app/studio/reset-password/page.tsx` |
| /studio/signup | page | `src/app/studio/signup/page.tsx` |
| /uploads/[...path] | handler | `src/app/uploads/[...path]/route.ts` |

### Current repository

| Route pattern | Type | Source |
| --- | --- | --- |
| /[collection] | page | `src/app/[collection]/page.tsx` |
| /about | page | `src/app/about/page.tsx` |
| /accessibility | page | `src/app/accessibility/page.tsx` |
| /api/inquiry/receipt | handler | `src/app/api/inquiry/receipt/route.ts` |
| /api/inquiry/reference | handler | `src/app/api/inquiry/reference/route.ts` |
| /api/inquiry/schema | handler | `src/app/api/inquiry/schema/route.ts` |
| /api/inquiry/session | handler | `src/app/api/inquiry/session/route.ts` |
| /api/locale | handler | `src/app/api/locale/route.ts` |
| /api/studio/cleanup | handler | `src/app/api/studio/cleanup/route.ts` |
| /api/studio/content | handler | `src/app/api/studio/content/route.ts` |
| /api/studio/editorial-assets/image | handler | `src/app/api/studio/editorial-assets/image/route.ts` |
| /api/studio/editorial-assets | handler | `src/app/api/studio/editorial-assets/route.ts` |
| /api/studio/health-context | handler | `src/app/api/studio/health-context/route.ts` |
| /api/studio/homepage-options | handler | `src/app/api/studio/homepage-options/route.ts` |
| /api/studio/inquiry-handoff | handler | `src/app/api/studio/inquiry-handoff/route.ts` |
| /api/studio/media | handler | `src/app/api/studio/media/route.ts` |
| /api/studio/operations | handler | `src/app/api/studio/operations/route.ts` |
| /api/studio/orders | handler | `src/app/api/studio/orders/route.ts` |
| /api/studio/privacy | handler | `src/app/api/studio/privacy/route.ts` |
| /api/studio/references/[id] | handler | `src/app/api/studio/references/[id]/route.ts` |
| /api/studio/revisions | handler | `src/app/api/studio/revisions/route.ts` |
| /api/studio/route-review | handler | `src/app/api/studio/route-review/route.ts` |
| /api/studio/settings | handler | `src/app/api/studio/settings/route.ts` |
| /api/studio/site-settings | handler | `src/app/api/studio/site-settings/route.ts` |
| /api/studio/work-queue | handler | `src/app/api/studio/work-queue/route.ts` |
| /api/studio/workspace | handler | `src/app/api/studio/workspace/route.ts` |
| /ar/[[...legacyPath]] | handler | `src/app/ar/[[...legacyPath]]/route.ts` |
| /architects | page | `src/app/architects/page.tsx` |
| /blog/[[...legacy]] | handler | `src/app/blog/[[...legacy]]/route.ts` |
| /care | page | `src/app/care/page.tsx` |
| /commission/customize | page | `src/app/commission/customize/page.tsx` |
| /commission | page | `src/app/commission/page.tsx` |
| /contact | page | `src/app/contact/page.tsx` |
| /custom-order | handler | `src/app/custom-order/route.ts` |
| /de/[[...legacyPath]] | handler | `src/app/de/[[...legacyPath]]/route.ts` |
| /editorial/[id] | handler | `src/app/editorial/[id]/route.ts` |
| /en/[[...legacyPath]] | handler | `src/app/en/[[...legacyPath]]/route.ts` |
| /es/[[...legacyPath]] | handler | `src/app/es/[[...legacyPath]]/route.ts` |
| /faq | page | `src/app/faq/page.tsx` |
| /fr/[[...legacyPath]] | handler | `src/app/fr/[[...legacyPath]]/route.ts` |
| /gu/[[...legacyPath]] | handler | `src/app/gu/[[...legacyPath]]/route.ts` |
| /hi/[[...legacyPath]] | handler | `src/app/hi/[[...legacyPath]]/route.ts` |
| /imprint | page | `src/app/imprint/page.tsx` |
| /inquiry/received | page | `src/app/inquiry/received/page.tsx` |
| /ja/[[...legacyPath]] | handler | `src/app/ja/[[...legacyPath]]/route.ts` |
| /journal/[slug] | page | `src/app/journal/[slug]/page.tsx` |
| /journal | page | `src/app/journal/page.tsx` |
| /large-resin-art | handler | `src/app/large-resin-art/route.ts` |
| /materials | page | `src/app/materials/page.tsx` |
| /materials-care | page | `src/app/materials-care/page.tsx` |
| /our-story | page | `src/app/our-story/page.tsx` |
| /p/[slug] | page | `src/app/p/[slug]/page.tsx` |
| / | page | `src/app/page.tsx` |
| /personalize | page | `src/app/personalize/page.tsx` |
| /pieces/[slug]/customize | page | `src/app/pieces/[slug]/customize/page.tsx` |
| /pieces/[slug] | page | `src/app/pieces/[slug]/page.tsx` |
| /portfolio/[slug] | page | `src/app/portfolio/[slug]/page.tsx` |
| /portfolio | page | `src/app/portfolio/page.tsx` |
| /preserve | page | `src/app/preserve/page.tsx` |
| /preview/states/[kind] | page | `src/app/preview/states/[kind]/page.tsx` |
| /preview/states | page | `src/app/preview/states/page.tsx` |
| /preview/studio/[...path] | page | `src/app/preview/studio/[...path]/page.tsx` |
| /preview/studio/content/[id] | page | `src/app/preview/studio/content/[id]/page.tsx` |
| /preview/studio/content/new | page | `src/app/preview/studio/content/new/page.tsx` |
| /preview/studio/content | page | `src/app/preview/studio/content/page.tsx` |
| /preview/studio/media | page | `src/app/preview/studio/media/page.tsx` |
| /preview/studio/modules/[module] | page | `src/app/preview/studio/modules/[module]/page.tsx` |
| /preview/studio | page | `src/app/preview/studio/page.tsx` |
| /preview/studio/products/[id]/form | page | `src/app/preview/studio/products/[id]/form/page.tsx` |
| /preview/studio/products/[id] | page | `src/app/preview/studio/products/[id]/page.tsx` |
| /preview/studio/products/new | page | `src/app/preview/studio/products/new/page.tsx` |
| /preview/studio/products | page | `src/app/preview/studio/products/page.tsx` |
| /privacy | page | `src/app/privacy/page.tsx` |
| /process | page | `src/app/process/page.tsx` |
| /product/[slug] | handler | `src/app/product/[slug]/route.ts` |
| /returns-cancellations | page | `src/app/returns-cancellations/page.tsx` |
| /saved-pieces | page | `src/app/saved-pieces/page.tsx` |
| /search | page | `src/app/search/page.tsx` |
| /shipping-delivery | page | `src/app/shipping-delivery/page.tsx` |
| /shop/[[...legacy]] | handler | `src/app/shop/[[...legacy]]/route.ts` |
| /studio/[...path] | page | `src/app/studio/[...path]/page.tsx` |
| /studio/login | page | `src/app/studio/login/page.tsx` |
| /studio | page | `src/app/studio/page.tsx` |
| /studio/preview/frame | page | `src/app/studio/preview/frame/page.tsx` |
| /studio/preview | page | `src/app/studio/preview/page.tsx` |
| /studio/preview/states | page | `src/app/studio/preview/states/page.tsx` |
| /studio/reference/[id] | page | `src/app/studio/reference/[id]/page.tsx` |
| /terms | page | `src/app/terms/page.tsx` |
| /whatsapp-order | handler | `src/app/whatsapp-order/route.ts` |
| /workshops | handler | `src/app/workshops/route.ts` |
| /zh/[[...legacyPath]] | handler | `src/app/zh/[[...legacyPath]]/route.ts` |

## Appendix B Reference media dimensions

These dimensions belong to inspected local reference files. The Drive connector returned names, sizes and IDs but did not return requested image dimensions. Production asset hashes, rights and final crop approval still need entry-by-entry verification.

| Reference | Dimensions | Size in KB |
| --- | --- | --- |
| hero-pour.jpg | 1920 × 1080 | 212 |
| maker-hands.jpg | 1536 × 1024 | 136 |
| doorway-collectible.jpg | 1024 × 1536 | 259 |
| texture-resin-flow.jpg | 1920 × 1080 | 230 |

## Appendix C Read-only review evidence

Source snapshots: current `13993903b7d83ee99861e023f23a6b464e5696bf`; old local `2dd6d5d`. The old local snapshot was not freshly fetched, and its exact correspondence to the current old-site deployment is not established. Live observations and source findings are therefore distinguished. Browser observations were made on 8 October 2026.

Accepted desktop screenshots use the normal browser panel viewport, approximately 1176 × 930 pixels; exact image dimensions are recorded in screenshot-manifest.json. Studio evidence shows editorial lists without opening customer details. Earlier captures with viewport rendering artifacts were rejected and are not embedded. Journal mobile captures use 390 × 844 CSS pixels in desktop Chromium emulation, not a physical phone. A navigation timeout on the current collection resolved on subsequent DOM inspection; it is not a measured performance result. The later Site Images browser call timed out; no image-editor screenshot is included as accepted evidence.


### Homepage screenshots

Old reference

**Local visual reference — Old Homepage:** `old-home-desktop.png`. The image is retained outside Git; see [evidence notes](EVIDENCE-NOTES.md).

Current site

**Local visual reference — Current Homepage:** `current-home-desktop.png`. The image is retained outside Git; see [evidence notes](EVIDENCE-NOTES.md).

### Process screenshots

Old reference

**Local visual reference — Old Process:** `old-process-desktop.png`. The image is retained outside Git; see [evidence notes](EVIDENCE-NOTES.md).

Current site

**Local visual reference — Current Process:** `current-process-desktop.png`. The image is retained outside Git; see [evidence notes](EVIDENCE-NOTES.md).

### Catalogue screenshots

Old reference

**Local visual reference — Old Catalogue:** `old-shop-desktop.png`. The image is retained outside Git; see [evidence notes](EVIDENCE-NOTES.md).

Current site

**Local visual reference — Current Catalogue:** `current-collection-desktop.png`. The image is retained outside Git; see [evidence notes](EVIDENCE-NOTES.md).

### Journal screenshots

Old reference

**Local visual reference — Old Journal:** `old-journal-desktop.png`. The image is retained outside Git; see [evidence notes](EVIDENCE-NOTES.md).

Current site

**Local visual reference — Current Journal:** `current-journal-desktop.png`. The image is retained outside Git; see [evidence notes](EVIDENCE-NOTES.md).

### Studio editorial workspace screenshots

Old reference

**Local visual reference — Old Studio editorial workspace:** `old-studio-editorial.png`. The image is retained outside Git; see [evidence notes](EVIDENCE-NOTES.md).

Current site

**Local visual reference — Current Studio editorial workspace:** `current-studio-editorial.png`. The image is retained outside Git; see [evidence notes](EVIDENCE-NOTES.md).

### Journal mobile screenshots

Old reference

**Local visual reference — Old Journal mobile:** `old-journal-mobile.png`. The image is retained outside Git; see [evidence notes](EVIDENCE-NOTES.md).

Current site

**Local visual reference — Current Journal mobile:** `current-journal-mobile.png`. The image is retained outside Git; see [evidence notes](EVIDENCE-NOTES.md).


## Appendix D Every old page and its destination

This exhaustive source-template ledger covers 85 page files. Proposed targets are not claimed to exist today. The old `[locale]` prefix is normalized below; current canonical language behavior stays unchanged. A target layout and a legacy redirect are separate implementation decisions. The JSON companion retains the original source filename, component imports and literal section IDs for each row.

### Public / utility destination ledger

| Old route | Current or proposed target | Phase / disposition | Guard |
| --- | --- | --- | --- |
| /about | /our-story | M4 — Preserve/adapt presentation | Current biographical text preserved; /about alias decision retained. |
| /blog | /journal | M5 — Preserve/adapt presentation | Old intro/featured/archive structure; current article information intact. |
| /blog/[slug] | /journal/[slug] — verified identity only | M5 — Preserve/adapt presentation | Preserve current articles and URLs; absent old article identity gets truthful unavailable behavior. |
| /contact | /contact | M4 — Preserve/adapt presentation | Current contacts/settings only. |
| /custom-order | /commission | M4 — Preserve/adapt presentation | Existing form variants and immutable saved-brief schema retained. |
| /faq | /faq | M5 — Preserve/adapt presentation | Old question index/search; new topic facets additive, existing answers unchanged. |
| /large-resin-art | /collectible-design | M4 — Preserve/adapt presentation | Current products/categories only; legacy alias depends on verified destination. |
| /p/[slug] | /p/[slug] — verified identity only | M5 — Preserve/adapt presentation | All 16 block types specified; no old content import or arbitrary executable HTML. |
| / | / | M4 — Preserve/adapt presentation | Old 18-section structure; conditional templates do not force unsupported offerings live. |
| /portfolio | /portfolio | M5 — Preserve/adapt presentation | Only genuine approved project records; empty state acceptable. |
| /portfolio/[slug] | /portfolio/[slug] — verified identity only | M5 — Preserve/adapt presentation | Actual brief, factual response and matched gallery; no fabricated project. |
| /privacy | /privacy | M5 — Preserve/adapt presentation | Existing approved wording and metadata unchanged. |
| /process | /process | M4 — Preserve/adapt presentation | Also preserve PROCESS_STEPS_LIST and MATERIALS_LIST definitions. |
| /product/[slug] | /pieces/[slug] — verified identity only | M5 — Preserve/adapt presentation | No product import or guessed slug mapping; preserve all current fields and galleries. |
| /search | /search | M5 — Preserve/adapt presentation | Collections, products, Journal and Portfolio groups; no private/draft results. |
| /shop | /search plus current collection discovery — final alias audited in M1 | M5 — Preserve/adapt presentation | Implement complete old shop composition using current catalogue; do not rely on a redirect alone. |
| /shop/[category] | /[collection] or category-filter view — identity mapping required | M5 — Preserve/adapt presentation | No broad dynamic redirect until each old category identity matches an existing destination. |
| /shop/wishlist | /saved-pieces | M5 — Preserve/adapt presentation | Preserve browser-saved behavior; no invented cross-device account. |
| /terms | /terms | M5 — Preserve/adapt presentation | Existing approved wording and metadata unchanged. |
| /whatsapp-order | /inquiry/received — current authorization required | M5 — Preserve/adapt presentation | Not a blind redirect to a private receipt; saved reference and manual Send retained. |
| /workshops | /workshops — proposed conditional template | M4 — Conditional template | Draft/template only until a real offering and approved facts exist. |
| /gone | Existing gone/legacy handler and private state preview | M5 — Preserve/adapt presentation | Actual 410 only where valid; no accidental indexing or homepage redirect. |
| /maintenance | Existing holding state and private state preview | M5 — Preserve/adapt presentation | Operational state; do not expose drafts or replace healthy pages. |
| /too-many-requests | Existing rate-limit state and private state preview | M5 — Preserve/adapt presentation | Respect real 429/retry behavior; no bypass of current guard. |
| /design-lab | /preview/states — private reference equivalent | M5 — Preserve/adapt presentation | Development/reference only; authenticated or otherwise safely isolated, noindex. |

### Studio destination ledger

| Old route | Current or proposed target | Phase / disposition | Guard |
| --- | --- | --- | --- |
| /studio/activity | /studio/activity; list or workspace | M6 — Adapt or add supported view | Current catch-all admits only module segments. Record/new/print selection needs validated query/state or an explicitly implemented new route; no guessed nested path. Server authorization and existing fields preserved. |
| /studio/analytics | /studio/analytics — proposed; list or workspace | M6 — Adapt or add supported view | Current catch-all admits only module segments. Record/new/print selection needs validated query/state or an explicitly implemented new route; no guessed nested path. Server authorization and existing fields preserved. |
| /studio/blog/[id] | /studio/journal — current alias; dedicated view proposed; record detail/edit | M6 — Adapt or add supported view | Current catch-all admits only module segments. Record/new/print selection needs validated query/state or an explicitly implemented new route; no guessed nested path. Server authorization and existing fields preserved. |
| /studio/blog/new | /studio/journal — current alias; dedicated view proposed; new record | M6 — Adapt or add supported view | Current catch-all admits only module segments. Record/new/print selection needs validated query/state or an explicitly implemented new route; no guessed nested path. Server authorization and existing fields preserved. |
| /studio/blog | /studio/journal — current alias; dedicated view proposed; list or workspace | M6 — Adapt or add supported view | Current catch-all admits only module segments. Record/new/print selection needs validated query/state or an explicitly implemented new route; no guessed nested path. Server authorization and existing fields preserved. |
| /studio/catalog-fill/conflicts | Scope ledger only; no activated production route | M1 / M6 — Excluded implementation / reference only | Earlier scraper and ingestion exclusion remains. No run, installation, credential, ingest or product mutation. Account for child layout in source ledger only. |
| /studio/catalog-fill | Scope ledger only; no activated production route | M1 / M6 — Excluded implementation / reference only | Earlier scraper and ingestion exclusion remains. No run, installation, credential, ingest or product mutation. Account for child layout in source ledger only. |
| /studio/categories | /studio/categories — proposed; list or workspace | M6 — Adapt or add supported view | Current catch-all admits only module segments. Record/new/print selection needs validated query/state or an explicitly implemented new route; no guessed nested path. Server authorization and existing fields preserved. |
| /studio/content-gaps | /studio/content-gaps — proposed; list or workspace | M6 — Adapt or add supported view | Current catch-all admits only module segments. Record/new/print selection needs validated query/state or an explicitly implemented new route; no guessed nested path. Server authorization and existing fields preserved. |
| /studio/content-health | /studio/content-health; list or workspace | M6 — Adapt or add supported view | Current catch-all admits only module segments. Record/new/print selection needs validated query/state or an explicitly implemented new route; no guessed nested path. Server authorization and existing fields preserved. |
| /studio/content-lab | /studio/content-lab — proposed; list or workspace | M6 — Adapt or add supported view | Current catch-all admits only module segments. Record/new/print selection needs validated query/state or an explicitly implemented new route; no guessed nested path. Server authorization and existing fields preserved. |
| /studio/custom-pages/[id] | /studio/landing-pages — proposed; record detail/edit | M6 — Adapt or add supported view | Current catch-all admits only module segments. Record/new/print selection needs validated query/state or an explicitly implemented new route; no guessed nested path. Server authorization and existing fields preserved. |
| /studio/custom-pages/new | /studio/landing-pages — proposed; new record | M6 — Adapt or add supported view | Current catch-all admits only module segments. Record/new/print selection needs validated query/state or an explicitly implemented new route; no guessed nested path. Server authorization and existing fields preserved. |
| /studio/custom-pages | /studio/landing-pages — proposed; list or workspace | M6 — Adapt or add supported view | Current catch-all admits only module segments. Record/new/print selection needs validated query/state or an explicitly implemented new route; no guessed nested path. Server authorization and existing fields preserved. |
| /studio/exports | /studio/exports — proposed; list or workspace | M6 — Adapt or add supported view | Current catch-all admits only module segments. Record/new/print selection needs validated query/state or an explicitly implemented new route; no guessed nested path. Server authorization and existing fields preserved. |
| /studio/faqs | /studio/faqs — proposed; list or workspace | M6 — Adapt or add supported view | Current catch-all admits only module segments. Record/new/print selection needs validated query/state or an explicitly implemented new route; no guessed nested path. Server authorization and existing fields preserved. |
| /studio/forms | /studio/forms — current alias; dedicated view proposed; list or workspace | M6 — Adapt or add supported view | Current catch-all admits only module segments. Record/new/print selection needs validated query/state or an explicitly implemented new route; no guessed nested path. Server authorization and existing fields preserved. |
| /studio/import | /studio/import — proposed, existing product mutations held; list or workspace | M6 — Adapt or add supported view | Current catch-all admits only module segments. Record/new/print selection needs validated query/state or an explicitly implemented new route; no guessed nested path. Server authorization and existing fields preserved. |
| /studio/inquiries/[id] | /studio/inquiries; record detail/edit | M7 — Adapt or add supported view | Current catch-all admits only module segments. Record/new/print selection needs validated query/state or an explicitly implemented new route; no guessed nested path. Server authorization and existing fields preserved. |
| /studio/inquiries | /studio/inquiries; list or workspace | M7 — Adapt or add supported view | Current catch-all admits only module segments. Record/new/print selection needs validated query/state or an explicitly implemented new route; no guessed nested path. Server authorization and existing fields preserved. |
| /studio/materials | /studio/materials — proposed; list or workspace | M6 — Adapt or add supported view | Current catch-all admits only module segments. Record/new/print selection needs validated query/state or an explicitly implemented new route; no guessed nested path. Server authorization and existing fields preserved. |
| /studio/media | /studio/media; list or workspace | M6 — Adapt or add supported view | Current catch-all admits only module segments. Record/new/print selection needs validated query/state or an explicitly implemented new route; no guessed nested path. Server authorization and existing fields preserved. |
| /studio/navigation | /studio/navigation; list or workspace | M6 — Adapt or add supported view | Current catch-all admits only module segments. Record/new/print selection needs validated query/state or an explicitly implemented new route; no guessed nested path. Server authorization and existing fields preserved. |
| /studio | /studio | M6 — Adapt existing module | Current scoped counts, IST follow-ups and real action destinations only. |
| /studio/pages/[id] | /studio/pages — current alias; dedicated view proposed; record detail/edit | M6 — Adapt or add supported view | Current catch-all admits only module segments. Record/new/print selection needs validated query/state or an explicitly implemented new route; no guessed nested path. Server authorization and existing fields preserved. |
| /studio/pages | /studio/pages — current alias; dedicated view proposed; list or workspace | M6 — Adapt or add supported view | Current catch-all admits only module segments. Record/new/print selection needs validated query/state or an explicitly implemented new route; no guessed nested path. Server authorization and existing fields preserved. |
| /studio/portfolio/[id] | /studio/portfolio — proposed; record detail/edit | M6 — Adapt or add supported view | Current catch-all admits only module segments. Record/new/print selection needs validated query/state or an explicitly implemented new route; no guessed nested path. Server authorization and existing fields preserved. |
| /studio/portfolio/new | /studio/portfolio — proposed; new record | M6 — Adapt or add supported view | Current catch-all admits only module segments. Record/new/print selection needs validated query/state or an explicitly implemented new route; no guessed nested path. Server authorization and existing fields preserved. |
| /studio/portfolio | /studio/portfolio — proposed; list or workspace | M6 — Adapt or add supported view | Current catch-all admits only module segments. Record/new/print selection needs validated query/state or an explicitly implemented new route; no guessed nested path. Server authorization and existing fields preserved. |
| /studio/process | /studio/process — proposed; list or workspace | M6 — Adapt or add supported view | Current catch-all admits only module segments. Record/new/print selection needs validated query/state or an explicitly implemented new route; no guessed nested path. Server authorization and existing fields preserved. |
| /studio/products/[id] | /studio/products; record detail/edit | M6 — Adapt or add supported view | Current catch-all admits only module segments. Record/new/print selection needs validated query/state or an explicitly implemented new route; no guessed nested path. Server authorization and existing fields preserved. |
| /studio/products/new | /studio/products; new record | M6 — Adapt or add supported view | Current catch-all admits only module segments. Record/new/print selection needs validated query/state or an explicitly implemented new route; no guessed nested path. Server authorization and existing fields preserved. |
| /studio/products | /studio/products; list or workspace | M6 — Adapt or add supported view | Current catch-all admits only module segments. Record/new/print selection needs validated query/state or an explicitly implemented new route; no guessed nested path. Server authorization and existing fields preserved. |
| /studio/research | /studio/research — proposed; list or workspace | M6 — Adapt or add supported view | Current catch-all admits only module segments. Record/new/print selection needs validated query/state or an explicitly implemented new route; no guessed nested path. Server authorization and existing fields preserved. |
| /studio/scraper/analytics | Scope ledger only; no activated production route | M1 / M6 — Excluded implementation / reference only | Earlier scraper and ingestion exclusion remains. No run, installation, credential, ingest or product mutation. Account for child layout in source ledger only. |
| /studio/scraper/confirmed | Scope ledger only; no activated production route | M1 / M6 — Excluded implementation / reference only | Earlier scraper and ingestion exclusion remains. No run, installation, credential, ingest or product mutation. Account for child layout in source ledger only. |
| /studio/scraper/explorer | Scope ledger only; no activated production route | M1 / M6 — Excluded implementation / reference only | Earlier scraper and ingestion exclusion remains. No run, installation, credential, ingest or product mutation. Account for child layout in source ledger only. |
| /studio/scraper/large-format | Scope ledger only; no activated production route | M1 / M6 — Excluded implementation / reference only | Earlier scraper and ingestion exclusion remains. No run, installation, credential, ingest or product mutation. Account for child layout in source ledger only. |
| /studio/scraper/mapping | Scope ledger only; no activated production route | M1 / M6 — Excluded implementation / reference only | Earlier scraper and ingestion exclusion remains. No run, installation, credential, ingest or product mutation. Account for child layout in source ledger only. |
| /studio/scraper | Scope ledger only; no activated production route | M1 / M6 — Excluded implementation / reference only | Earlier scraper and ingestion exclusion remains. No run, installation, credential, ingest or product mutation. Account for child layout in source ledger only. |
| /studio/scraper/quality | Scope ledger only; no activated production route | M1 / M6 — Excluded implementation / reference only | Earlier scraper and ingestion exclusion remains. No run, installation, credential, ingest or product mutation. Account for child layout in source ledger only. |
| /studio/scraper/review | Scope ledger only; no activated production route | M1 / M6 — Excluded implementation / reference only | Earlier scraper and ingestion exclusion remains. No run, installation, credential, ingest or product mutation. Account for child layout in source ledger only. |
| /studio/scraper/runs | Scope ledger only; no activated production route | M1 / M6 — Excluded implementation / reference only | Earlier scraper and ingestion exclusion remains. No run, installation, credential, ingest or product mutation. Account for child layout in source ledger only. |
| /studio/scraper/sources/[key] | Scope ledger only; no activated production route | M1 / M6 — Excluded implementation / reference only | Earlier scraper and ingestion exclusion remains. No run, installation, credential, ingest or product mutation. Account for child layout in source ledger only. |
| /studio/scraper/sources | Scope ledger only; no activated production route | M1 / M6 — Excluded implementation / reference only | Earlier scraper and ingestion exclusion remains. No run, installation, credential, ingest or product mutation. Account for child layout in source ledger only. |
| /studio/sections | /studio/sections — proposed; list or workspace | M6 — Adapt or add supported view | Current catch-all admits only module segments. Record/new/print selection needs validated query/state or an explicitly implemented new route; no guessed nested path. Server authorization and existing fields preserved. |
| /studio/seo | /studio/seo — proposed; list or workspace | M6 — Adapt or add supported view | Current catch-all admits only module segments. Record/new/print selection needs validated query/state or an explicitly implemented new route; no guessed nested path. Server authorization and existing fields preserved. |
| /studio/settings | /studio/settings; list or workspace | M6 — Adapt or add supported view | Current catch-all admits only module segments. Record/new/print selection needs validated query/state or an explicitly implemented new route; no guessed nested path. Server authorization and existing fields preserved. |
| /studio/site-copy | /studio/site-copy; list or workspace | M6 — Adapt or add supported view | Current catch-all admits only module segments. Record/new/print selection needs validated query/state or an explicitly implemented new route; no guessed nested path. Server authorization and existing fields preserved. |
| /studio/site-images | /studio/site-images; list or workspace | M6 — Adapt or add supported view | Current catch-all admits only module segments. Record/new/print selection needs validated query/state or an explicitly implemented new route; no guessed nested path. Server authorization and existing fields preserved. |
| /studio/subscribers | /studio/subscribers — conditional proposal; list or workspace | M6 — Adapt or add supported view | Current catch-all admits only module segments. Record/new/print selection needs validated query/state or an explicitly implemented new route; no guessed nested path. Server authorization and existing fields preserved. |
| /studio/testimonials/[id] | /studio/testimonials — proposed; record detail/edit | M6 — Adapt or add supported view | Current catch-all admits only module segments. Record/new/print selection needs validated query/state or an explicitly implemented new route; no guessed nested path. Server authorization and existing fields preserved. |
| /studio/testimonials/new | /studio/testimonials — proposed; new record | M6 — Adapt or add supported view | Current catch-all admits only module segments. Record/new/print selection needs validated query/state or an explicitly implemented new route; no guessed nested path. Server authorization and existing fields preserved. |
| /studio/testimonials | /studio/testimonials — proposed; list or workspace | M6 — Adapt or add supported view | Current catch-all admits only module segments. Record/new/print selection needs validated query/state or an explicitly implemented new route; no guessed nested path. Server authorization and existing fields preserved. |
| /studio/users | /studio/staff; list or workspace | M6 — Adapt or add supported view | Current catch-all admits only module segments. Record/new/print selection needs validated query/state or an explicitly implemented new route; no guessed nested path. Server authorization and existing fields preserved. |
| /studio/forgot-password | /studio/login and current supported recovery/access flow | M2 / M6 — Presentation parity under current auth policy | Match forms/states where supported; preserve current auth mechanisms, no old Auth.js actions or new public signup. Unsupported recovery stays an explicit scope decision. |
| /studio/inquiries/[id]/card | /studio/inquiries; print/card | M7 — Adapt or add supported view | Current catch-all admits only module segments. Record/new/print selection needs validated query/state or an explicitly implemented new route; no guessed nested path. Server authorization and existing fields preserved. |
| /studio/login | /studio/login and current supported recovery/access flow | M2 / M6 — Presentation parity under current auth policy | Match forms/states where supported; preserve current auth mechanisms, no old Auth.js actions or new public signup. Unsupported recovery stays an explicit scope decision. |
| /studio/reset-password | /studio/login and current supported recovery/access flow | M2 / M6 — Presentation parity under current auth policy | Match forms/states where supported; preserve current auth mechanisms, no old Auth.js actions or new public signup. Unsupported recovery stays an explicit scope decision. |
| /studio/signup | /studio/login and current supported recovery/access flow | M2 / M6 — Presentation parity under current auth policy | Match forms/states where supported; preserve current auth mechanisms, no old Auth.js actions or new public signup. Unsupported recovery stays an explicit scope decision. |

## Appendix E Every registered section and landing-page block

These 74 entries come from the old `src/lib/page-sections.ts` registry. Ten process steps and four material cards are nested definitions, not separate public pages. Default visibility and available content are independent: every template is specified, while only eligible approved content may render publicly. Existing content values, crop metadata and selected products remain frozen.

### HOME — 18 definitions

| Stable key / label | Purpose | Copy ownership | Image slots | Flags | Source |
| --- | --- | --- | --- | --- | --- |
| pour — Hero | The full-bleed opening, with the headline and two buttons. | Home.hero | home.hero | hideable=false, movable=false, ownsH1=true | page-sections.ts:110 |
| manifesto — Manifesto | The two-line statement under the hero. | Home.manifesto | No declared image slot | hideable=true, movable=true | page-sections.ts:122 |
| pieces — Featured pieces | Four products — one large, three beside it. | Home.featured | No declared image slot | hideable=true, movable=true, conditional=true | page-sections.ts:132 |
| large-format — Large format | Four tiles pointing at work commissioned at scale. | Home.largeFormat | largeFormat.k1, largeFormat.k2, largeFormat.k3, largeFormat.k4 | hideable=true, movable=true | page-sections.ts:143 |
| material — The material story | The pinned pour scrub and its four stages. | Home.showcase | No declared image slot | hideable=true, movable=false | page-sections.ts:158 |
| collections — The collections | Six editorial tiles, each a doorway into the catalogue. | Home.collections | No declared image slot | hideable=true, movable=true | page-sections.ts:171 |
| furniture — What we commission | Six kinds of furniture the studio takes on, as concepts. | Home.furniture | home.furniture.dining, home.furniture.coffee, home.furniture.side, home.furniture.console, home.furniture.chair, home.furniture.bench | defaultVisible=false, hideable=true, movable=true | page-sections.ts:181 |
| maker — The maker | The portrait and the paragraph beside it. | Home.maker | home.maker | hideable=true, movable=true | page-sections.ts:205 |
| rooms — In the room | Four rooms shown with a commissioned piece in place. | Home.rooms | home.rooms.living, home.rooms.dining, home.rooms.study, home.rooms.bedroom | defaultVisible=false, hideable=true, movable=true | page-sections.ts:215 |
| work — Recent commissions | A mosaic of published portfolio cases. | Home.portfolio | No declared image slot | hideable=true, movable=true, conditional=true | page-sections.ts:234 |
| words — In their words | Customer quotes, with the photograph when one is set. | Home.testimonials | No declared image slot | hideable=true, movable=true, conditional=true | page-sections.ts:245 |
| bespoke — Commission band | The dark band inviting a bespoke enquiry. | Home.custom | home.bespoke | hideable=true, movable=true | page-sections.ts:264 |
| workshops — Workshops | The invitation to come and pour one yourself. | Home.workshops | home.workshops | hideable=true, movable=true | page-sections.ts:275 |
| print — Print studio | The 3D-printing block. | Home.printStudio | home.print | hideable=true, movable=true | page-sections.ts:285 |
| process — How it works | The four steps from idea to delivery. | Home.how | No declared image slot | hideable=true, movable=true | page-sections.ts:295 |
| why — Why Rivya Living Art | Four reasons, each with a picture. | Home.why | home.why.handcrafted, home.why.bespoke, home.why.slowMade, home.why.heirloom | hideable=true, movable=true | page-sections.ts:305 |
| journal — Journal | The latest writing from the studio. | Home.journal | No declared image slot | hideable=true, movable=true, conditional=true | page-sections.ts:319 |
| closing — Closing invitation | The last word and the commission button. | Home.cta | No declared image slot | hideable=false, movable=false | page-sections.ts:330 |

### ABOUT — 7 definitions

| Stable key / label | Purpose | Copy ownership | Image slots | Flags | Source |
| --- | --- | --- | --- | --- | --- |
| hero — Hero | The full-bleed opening and the page's heading. | About.hero | about.hero | hideable=false, movable=false, ownsH1=true | page-sections.ts:349 |
| story — The story | Three chapters of running prose, with what the studio holds to inside the third. | About.story, About.chapterLabels, About.values | No declared image slot | hideable=true, movable=true | page-sections.ts:360 |
| maker — The maker | The portrait and the paragraph beside it. | About.maker | about.maker | hideable=true, movable=true | page-sections.ts:378 |
| craft — The craft | The sticky four-panel story — pour, embed, cure, polish — and the link into Process. | About.craft, About.chapters | about.chapter1, about.chapter2, about.chapter3, about.chapter4 | hideable=true, movable=true | page-sections.ts:387 |
| materials — Materials | Four cards, each revealing a macro of the surface. | About.materials, About.sustain | No declared image slot | hideable=true, movable=true | page-sections.ts:408 |
| studio — The studio | Three photographs and the studio facts. | About.studio | about.studio1, about.studio2, about.studio3 | hideable=true, movable=true | page-sections.ts:417 |
| closing — Closing invitation | The last word and the commission button. | About.cta | No declared image slot | hideable=false, movable=false | page-sections.ts:426 |

### PROCESS — 5 definitions

| Stable key / label | Purpose | Copy ownership | Image slots | Flags | Source |
| --- | --- | --- | --- | --- | --- |
| pour — Hero | The full-bleed pour and the page's heading. | Process.hero | process.heroVideo, process.heroPoster | hideable=false, movable=false, ownsH1=true | page-sections.ts:444 |
| stages — The ten stages | Idea to delivery, one numbered stage at a time. | Process.timeline | No declared image slot | hideable=true, movable=true | page-sections.ts:457 |
| materials — Materials | What the studio works in, and why. | Process.materials | No declared image slot | hideable=true, movable=true | page-sections.ts:466 |
| timelines — Timelines | The published lead-time bands, as two cards. | Process.timelines | No declared image slot | hideable=true, movable=true | page-sections.ts:475 |
| closing — Closing invitation | The last word and the commission button. | Process.cta | No declared image slot | hideable=false, movable=false | page-sections.ts:484 |

### PROCESS_STEPS_LIST — 10 definitions

| Stable key / label | Purpose | Copy ownership | Image slots | Flags | Source |
| --- | --- | --- | --- | --- | --- |
| step1 — 01 · Concept | The opening WhatsApp conversation and the brief. | Process.timeline.step1Title, Process.timeline.step1Copy, Process.timeline.step1Meta, Process.timeline.step1Alt | process.step1 | hideable=true, movable=true | page-sections.ts:508 |
| step2 — 02 · Material selection | Choosing the resin, wood, pigment and any preserved botanicals. | Process.timeline.step2 | process.step2 | hideable=true, movable=true | page-sections.ts:522 |
| step3 — 03 · Wood preparation | Planing, sanding and sealing the wood before resin ever meets it. | Process.timeline.step3 | process.step3 | hideable=true, movable=true | page-sections.ts:532 |
| step4 — 04 · Resin composition | Mixing and testing pigment before a full pour. | Process.timeline.step4 | process.step4 | hideable=true, movable=true | page-sections.ts:542 |
| step5 — 05 · Casting | Pouring the resin into the mould, layer by layer. | Process.timeline.step5 | process.step5 | hideable=true, movable=true | page-sections.ts:551 |
| step6 — 06 · Curing | Each layer left to cure before the next goes in. | Process.timeline.step6 | process.step6 | hideable=true, movable=true | page-sections.ts:560 |
| step7 — 07 · Surface refinement | Sanding from 400 up to 3000 grit, then polishing. | Process.timeline.step7 | process.step7 | hideable=true, movable=true | page-sections.ts:569 |
| step8 — 08 · Hand finishing | Hardware fitted and every edge checked by hand. | Process.timeline.step8 | process.step8 | hideable=true, movable=true | page-sections.ts:578 |
| step9 — 09 · Quality inspection | Checked against the brief before photographs go to you. | Process.timeline.step9 | process.step9 | hideable=true, movable=true | page-sections.ts:587 |
| step10 — 10 · Delivery | Packed fragile-proof and sent with tracked shipping. | Process.timeline.step10Title, Process.timeline.step10Copy, Process.timeline.step10Meta, Process.timeline.step10Alt | process.step10 | hideable=true, movable=true | page-sections.ts:596 |

### MATERIALS_LIST — 4 definitions

| Stable key / label | Purpose | Copy ownership | Image slots | Flags | Source |
| --- | --- | --- | --- | --- | --- |
| m1 — Material 1 | Epoxy resin — shown on Process and About. | Process.materials.m1Title, Process.materials.m1Copy, Process.materials.alt1 | process.material1, about.material1.image, about.material1.macro | hideable=true, movable=true | page-sections.ts:622 |
| m2 — Material 2 | Teak & river wood — shown on Process and About. | Process.materials.m2Title, Process.materials.m2Copy, Process.materials.alt2 | process.material2, about.material2.image, about.material2.macro | hideable=true, movable=true | page-sections.ts:639 |
| m3 — Material 3 | Mineral pigments — shown on Process and About. | Process.materials.m3Title, Process.materials.m3Copy, Process.materials.alt3 | process.material3, about.material3.image, about.material3.macro | hideable=true, movable=true | page-sections.ts:656 |
| m4 — Material 4 | Preserved botanicals — shown on Process and About. | Process.materials.m4Title, Process.materials.m4Copy, Process.materials.alt4 | process.material4, about.material4.image, about.material4.macro | hideable=true, movable=true | page-sections.ts:673 |

### CUSTOM_ORDER — 7 definitions

| Stable key / label | Purpose | Copy ownership | Image slots | Flags | Source |
| --- | --- | --- | --- | --- | --- |
| commission — Hero | The split-screen opening and the page's heading. | CustomOrder.page.hero | customOrder.hero | hideable=false, movable=false, ownsH1=true | page-sections.ts:701 |
| kinds — What people commission | The four kinds of commission, as tiles. | CustomOrder.page.kinds | No declared image slot | hideable=true, movable=true | page-sections.ts:713 |
| how — How a commission runs | The four steps from brief to delivery. | CustomOrder.page.how | No declared image slot | hideable=true, movable=true | page-sections.ts:723 |
| brief — The brief | The form itself — where a commission actually starts. | CustomOrder.page.form, CustomOrder.form | No declared image slot | hideable=false, movable=false | page-sections.ts:733 |
| questions — Questions | Questions answered on the FAQ, shown here too. | Faq.hero | No declared image slot | hideable=true, movable=true, conditional=true | page-sections.ts:743 |
| work — Commissioned before | A gallery of finished commissions. | CustomOrder.page.seeCommissions, Portfolio.hero | No declared image slot | hideable=true, movable=true, conditional=true | page-sections.ts:756 |
| words — In their words | What previous clients said. | CustomOrder.page.proof | No declared image slot | hideable=true, movable=true, conditional=true | page-sections.ts:767 |

### CONTACT — 4 definitions

| Stable key / label | Purpose | Copy ownership | Image slots | Flags | Source |
| --- | --- | --- | --- | --- | --- |
| hero — Hero | The split-screen opening and the page's heading. | Contact.page.hero | contact.hero | hideable=false, movable=false, ownsH1=true | page-sections.ts:782 |
| channels — Four ways in | WhatsApp, phone, email and the studio address. | Contact.page.channels | No declared image slot | hideable=true, movable=true | page-sections.ts:793 |
| write — The form | The message form — the reason the page exists. | Contact.page.form, Contact.form | No declared image slot | hideable=false, movable=false | page-sections.ts:802 |
| faq — Asked often | Questions answered on the FAQ, shown here too. | Contact.page.faq | No declared image slot | hideable=true, movable=true, conditional=true | page-sections.ts:811 |

### WORKSHOPS — 7 definitions

| Stable key / label | Purpose | Copy ownership | Image slots | Flags | Source |
| --- | --- | --- | --- | --- | --- |
| hero — Hero | The full-bleed table and the page's heading. | Workshops.hero | workshops.hero | hideable=false, movable=false, ownsH1=true | page-sections.ts:831 |
| facts — The facts strip | Duration, group size and what is included. | Workshops.facts | No declared image slot | hideable=true, movable=true | page-sections.ts:842 |
| why — Why come | Three reasons, each with a photograph. | Workshops.intro | workshops.benefit1, workshops.benefit2, workshops.benefit3 | hideable=true, movable=true | page-sections.ts:851 |
| session — The session | The workshop beat by beat. | Workshops.experience | No declared image slot | hideable=true, movable=true | page-sections.ts:870 |
| sessions — Sessions | The dated sessions an owner has listed. | Workshops.sessions | No declared image slot | hideable=true, movable=true | page-sections.ts:879 |
| private — Private workshops | The dark band inviting a private booking. | Workshops.private | workshops.private | hideable=true, movable=true | page-sections.ts:888 |
| room — The room | Four photographs of the space. | Workshops.room | workshops.room1, workshops.room2, workshops.room3, workshops.room4 | hideable=true, movable=true | page-sections.ts:898 |

### LARGE_FORMAT — 12 definitions

| Stable key / label | Purpose | Copy ownership | Image slots | Flags | Source |
| --- | --- | --- | --- | --- | --- |
| scale — Hero | The full-height opening band and the page's h1. | LargeFormat.hero | largeFormat.hero | hideable=false, movable=false, ownsH1=true | page-sections.ts:931 |
| scope — Four kinds of large work | The shapes a large brief usually takes, with one picture each. | LargeFormat.scope | largeFormat.k1, largeFormat.k2, largeFormat.k3, largeFormat.k4 | hideable=true, movable=true | page-sections.ts:943 |
| philosophy — Philosophy | Why large work is planned before it is priced. | LargeFormat.philosophy | No declared image slot | hideable=true, movable=true | page-sections.ts:959 |
| how — How it runs | The four stages of a large commission, in order. | LargeFormat.how | No declared image slot | hideable=true, movable=true | page-sections.ts:969 |
| brief — What to send | What makes a quote quick — the room, the measurements, the use. | LargeFormat.brief | No declared image slot | hideable=true, movable=true | page-sections.ts:980 |
| materials — Materials | The same four materials the small work is made of, in more of it. | Process.materials | process.material1, process.material2, process.material3, process.material4 | hideable=true, movable=true | page-sections.ts:991 |
| pieces — Pieces we commission | The six furniture tiles, shown again for a visitor who came in here. | LargeFormat.pieces, Home.furniture | home.furniture.dining, home.furniture.coffee, home.furniture.side, home.furniture.console, home.furniture.chair, home.furniture.bench | defaultVisible=false, hideable=true, movable=true | page-sections.ts:1010 |
| work — Commissioned before | Published portfolio cases, when there are any to show. | LargeFormat.work | No declared image slot | hideable=true, movable=true, conditional=true | page-sections.ts:1032 |
| words — In their words | Testimonials given about large-format work. | LargeFormat.words | No declared image slot | hideable=true, movable=true, conditional=true | page-sections.ts:1043 |
| faq — Questions | Large-format questions answered on the FAQ, shown here too. | LargeFormat.faq | No declared image slot | hideable=true, movable=true, conditional=true | page-sections.ts:1054 |
| gallery — Large pieces | Published products in the large-format categories. Renders an invitation instead of a grid when there are none. | LargeFormat.gallery | No declared image slot | hideable=true, movable=true | page-sections.ts:1065 |
| commission — Start the conversation | The closing invitation into the existing commission flow. | LargeFormat.cta | No declared image slot | hideable=false, movable=false | page-sections.ts:1076 |

### Sixteen landing-page block types

Source: `OLDWEBSITE/src/lib/custom-blocks.ts`. Implement compatible presentation readers for **`hero`, `richText`, `productGrid`, `imageCta`, `faqPicker`, `finalCta`, `collectionGrid`, `portfolioGrid`, `journalGrid`, `testimonial`, `testimonialGrid`, `videoHero`, `videoStory`, `masonryGallery`, `bentoGallery`, `fullscreenGallery`**. Product and collection readers use current IDs without modifying selection. Journal/Portfolio/Testimonial/FAQ readers accept only eligible published content; new configuration never rewrites the referenced record. Video types remain optional and need footage, rights, poster, playback controls and loading acceptance. Gallery types preserve existing stored crops/associations; new usages receive separate reviewed crops. Rich text is validated structured content, never arbitrary script or HTML.
