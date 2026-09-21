# RivyaLivingArt — Master Build Prompt & Implementation Blueprint

**Prepared:** 20 September 2026  
**Revision:** 8 — Frontend and visuals first; tested commit/push after each completed slice; owner-led Vercel visual preview before backend and full-deployment handoff after integration. Revision 7 scope and S01–S04 exclusions remain unchanged.
**Updated:** 21 September 2026.
**Active pack:** see `RivyaLivingArt_READ_FIRST_v8.md`; it indexes the start/resume prompts, frontend-first plan, Git workflow, Vercel handoff, demo blueprint, separate asset prompts and AGENTS addendum.
**Scope decision:** S01–S04 are excluded, not pending approval. No optional-improvements companion is part of this pack; Section 22 records the exclusion boundary.  
**Brand correction:** 21 September 2026.  
**Asset-workflow update:** 21 September 2026.  
**Included logo reference:** `reference/91707.png` is the owner-supplied board, unchanged; use clean existing masters for production.
**Purpose:** A copy-ready specification for a coding agent working inside the existing application repository. This is a phased enhancement and migration brief, not permission to replace an established application with a new template.

## How to use this document

Give Codex this complete Revision 8 pack with access to the actual source repository. Begin with R8-0 before implementation, then follow the frontend-first order in Section 14 and `RivyaLivingArt_Frontend_First_Plan_v8.md`. Read Section 23 before implementing a visual preview. Commit/push completed tested slices under the Git companion; use the Vercel companion for owner deployment gates. Keep the large specification as referenced files, not pasted wholesale into AGENTS.md. The component names below remain proposed implementation names and slots, not verified existing files.

This revision is the current implementation specification. The owner has selected **our own custom CMS**, with a Sanity-inspired structured editing experience but **no Sanity service or integration**. Products remain managed through authorized staff entry and owner-supplied CSV/XLSX files. **Use the owner-specified Google Drive images and videos first**, alongside existing approved repository/Blob assets; fill genuine visual gaps by writing **separate image/video prompts for the owner to generate and return through Drive**. Codex does not need an image/video-generation account. Original vector code may be authored and reviewed in the repository. Icons and vectors may be created from prompts or discovered through Google and obtained from an original, license-verified source. Section 11 defines selection, generation, rights review, delivery and documentation.

This permits asset production during the build, not a new hosted-CMS or generation-service integration. Product scraping and competitor-to-catalogue automation remain excluded; Higgsfield remains excluded. Do not add those modules, accounts, routes, credentials or jobs. Google Drive is an input source, not a required public hosting or continuous-sync dependency. Keep the website and CMS operational without a visitor Google login or live generation API. Preserve historical documents and stored data rather than silently deleting them.

### Latest execution decision — frontend first, Git saved incrementally, owner deploys

Build the public website frontend and visuals first, then the Studio frontend. Use shared typed presentation contracts and explicitly labelled isolated visual fixtures without requiring new database/auth/media services. Prepare a protected Vercel visual-preview handoff before backend work so the owner can see the result. After review, connect the existing backend foundation and finish all real functions. Do not rebuild an already working backend merely because this is a new session.

After each coherent completed slice: run its required checks, update canonical Markdown, commit only the reviewed owned changes, push to the verified safe non-production branch and verify the remote commit. Preserve permissions, unrelated work and production. The owner will deploy: provide V1 visual-preview readiness at R8-5 and V2 full-deployment readiness at R8-11, with exact branch/SHA, settings and evidence. Never automatically merge/promote the production branch or run a production deployment. Existing authorized preview auto-builds must be reported honestly.

Use explicit R8 phase IDs; earlier phase order is superseded, historical records are not. The 52 component and 12 CMS requirement IDs are unchanged. UI completion and backend completion are separate recorded states. See Sections 23–25 and the execution companions.

### Latest owner decisions — implement these, not superseded restrictions

The owner explicitly requests a substantial **synthetic demo dataset** and manual removal through Studio: **120 products, 36 complete blog drafts, 42 FAQs, 24 fictional testimonial examples, and 40 inquiry/order scenarios**, plus representative records for all in-scope Studio modules. These are target fixtures to implement, not existing inventory or records already inserted. Section 18 and the demo companion define counts, isolation, manual cleanup and safeguards. Earlier “do not invent content” clauses continue to prohibit invented **real/public business claims**; they do not prohibit clearly labelled, protected demo fixtures.

Images/video come from the identified Drive source first. Missing outputs go into the **separate asset-prompts Markdown file** so the owner can generate and upload them. Do not generate new image/video assets automatically under the older Revision 5 permission. Approved originals and licensed online icons/vectors remain usable.

Use the supplied logo board for bronze/forest/ivory art direction. Keep the entire website and Studio dark. Aim for Awwwards-calibre craft, not an award guarantee or an imitation site. Extend the audited architecture with compatible free tools only when needed. The owner has explicitly declined all four previously suggested additions. They are **excluded**, not awaiting approval: no added staff MFA/passkeys, no specification/quotation PDF builder, no enhanced material-and-finish comparison, and no account-free private client design-approval workflow. Do not implement, re-propose or add dependencies for them. Section 22 defines the exact boundary; continue the already requested work without another feature-approval round.

“Remove manually from Studio” means individual/bulk demo cleanup. Also provide separate optional-menu visibility preferences. Hiding a menu does not delete data or alter permissions; deleting demos does not remove working modules or real content.

The supplied uploads were `Pasted text.txt` (three-tier product architecture) and `Pasted markdown (2)(3).md` (project README). They describe a much larger existing application than the public GitHub listing exposed during this review. The public listing showed a README, not the documented application source. Therefore actual component paths, exports, dependency versions and compatibility have not been verified against executable code. A browser-level animation/accessibility audit of the reference websites was also not completed; the design comparison below is grounded in retrievable page structure and content, with proposed adaptations explicitly separated.

## Document map

| Section | Find here |
|---|---|
| 1–3 | Brand and business rules; three product journeys; Vercel-centred custom CMS, database/media architecture and cost boundaries. |
| 4–6 | Six reference-site analyses; full public page inventory; selection decisions for all eleven requested UI libraries. |
| 7 | Fifty-two replacement specifications: W01–W30 public/shared components and A01–A22 Studio components. |
| 8–10 | SQL ownership and migrations; custom CMS capabilities and permissions; owner-supplied catalogue entry and resumable file imports. |
| 11–12 | Drive-first images/video; prompt-generated assets; licensed online icons/vectors; dark interactions, accessibility and performance. |
| 13–14 | Canonical Markdown documentation; checkpoint template; twelve implementation phases and acceptance gates. |
| 15–17 | Missing inputs; official references/research limits; first-session execution instruction. |
| 18–20 | Demo data and safe removal; full staff login and Vercel environments; Codex/ChatGPT working agreement. |
| 21–22 | Supplied-logo dark theme; public/Studio quality gates; explicit rejected-feature exclusions and retained baseline boundaries. |
| 23–25 | Frontend-only preview contract; per-slice verified Git pushes; owner Vercel preview/full-deployment gates. |

# MASTER INSTRUCTION TO THE CODING AGENT

You are the senior product designer, Next.js engineer, CMS architect, accessibility engineer and implementation lead for RivyaLivingArt. Improve the existing codebase into a premium, furniture-first, dark-mode resin-art website with a fully functional dark Studio. Preserve working business logic, routes, data, security boundaries and repository conventions.

Do not deliver a generic ecommerce template, a component-library demo or a permanently fake admin/backend. A labelled fixture-driven frontend is explicitly required as the first reviewable milestone under Section 23. It is not the final application. All final real data flows must subsequently be integrated and tested; never call the application production-ready until that evidence exists.

## 1. Owner brief, authority and conflict resolution

The owner's confirmed brand name is **RivyaLivingArt**, with this exact capitalization and no spaces. Use it consistently in current website copy, metadata, social previews, editable logo/wordmark text, Studio/CMS labels and active implementation documents. The custom CMS is **RivyaLivingArt Studio CMS**. This is an owner-confirmed naming correction, not a pending rebrand approval. Preserve the existing domain, repository name, email, stored identifiers, historical records and URLs unless a separate migration is approved. Retain exact titles and wording when quoting historical source documents; do not rewrite dated entries or bulk-rename technical identifiers.

Authoritative supplied contact details:

| Field | Value |
|---|---|
| Public brand | RivyaLivingArt |
| Phone | +91 8320404132 |
| WhatsApp | +91 8320404132 |
| Click-to-chat destination | `https://wa.me/918320404132` |
| Email | `rivyalivingart2.0@gmail.com` |
| Location link | `https://maps.app.goo.gl/L2NHDt9Akgqs2ZoT6?g_st=ac` |
| Existing domain in uploaded README | `https://www.rivyalivingart.com` |
| Existing repository in uploaded README | `https://github.com/rivyalivingart2/RivyaLivingArt2.0.git` |
| Working display currency | INR, unless an existing approved setting says otherwise |

Use the location link as supplied; do not infer a street address, store hours, delivery region, workshop access or map coordinates. Do not publish fabricated awards, client logos, testimonials, stock counts, prices, materials, warranties or product specifications as real. Section 18 explicitly permits fictional, labelled demo fixtures inside the isolated demo scope; never mix those fixtures into live trust, catalogue or analytics.

### Non-negotiable business rules

The latest brief makes large work primary and the entire public website and admin dark. Preserve the uploaded README's more explicit WhatsApp business model:

- No payment gateway, online checkout or cart payment.
- No customer registration, customer login, membership or customer account dashboard.
- The requested login/recovery pages are staff-only Studio pages.
- Customer requests are saved as Inquiry records before WhatsApp handoff. Pricing, payment and delivery agreement are finalized manually through WhatsApp.
- A WhatsApp link click is not proof of message delivery, accepted quotation, payment or an order confirmation.

The three-tier upload contains generic cart/checkout language for small products. Adapt that part to the README's hard rules: smaller products get fast personalization and WhatsApp request submission, not checkout. Retain three distinct customer intents, not three interchangeable filter values.

Honor the effective Codex `AGENTS.md`/directory instructions. Explicitly read the existing `CLAUDE.md` as the repository engineering guide, then the current `REDESIGN.md`, `README.md`, newest `PROJECT_STATE.md` checkpoint and active plans. Add concise references to this current specification in AGENTS.md rather than assuming Codex automatically reads CLAUDE.md. Preserve their engineering and safety constraints. Record the latest owner's confirmed decisions—exact RivyaLivingArt spelling, fully dark presentation, the repository-owned custom CMS and the revised catalogue/media scope—before modifying active specs. Do not rewrite dated decisions or historical entries to make them look as though they always contained the new requirements.

## 2. Primary business and product architecture

### LARGE — Collectible Furniture & Spatial Art: primary business

Dining tables, coffee/centre tables, side and bedside tables, consoles, chairs, stools, benches, desks, resin-and-wood furniture, sculptural furniture, oversized wall art, resin wall panels, statement sculptures, architectural pieces and custom installations.

This category establishes the brand's identity. Give it the first navigation position, hero, first major product section, dedicated landing experience, strongest imagery, trade/project enquiry flow and the most complete product information. A suggested initial homepage emphasis is approximately 70% large work, 20% memory work and 10% personal objects; this is a merchandising proposal, not a factual revenue split or a hard-coded catalogue quota.

Primary CTA: **Commission a Piece**. Secondary CTA: **Request a Consultation**. Contextual actions: Customize This Piece, Request Price, Discuss Your Project, Download Specifications. Support fixed price, Starting From and Price on Request without manufacturing a zero price.

### MEDIUM — Memory & Celebration Art: secondary business

Varmala/jaimala and bouquet preservation, wedding flower pieces, preservation clocks, engagement and ring trays/platters, invitation preservation, couple/memory frames, anniversary pieces, nameplates, baby keepsakes, flower frames, pooja and celebration pieces where actually offered.

This is a guided customization and preservation journey. Product fields and instructions should explain how physical materials reach the studio and become finished art. Primary CTA: **Preserve Your Memory**. Secondary: Start Customization or Discuss on WhatsApp.

### SMALL — Personal Art & Gifting: secondary business

Rakhi/rakhdi, resin jewellery, pendants, earrings, bracelets, keychains, charms, bookmarks, coasters, magnets, mini frames, desk objects, mini trays, festive products, return gifts and corporate gifting where actually offered.

This journey is faster and denser: select product, variant, personalization and quantity; review the request; submit; continue on WhatsApp. Primary CTA: **Personalize & Enquire** or **Request on WhatsApp**.

### Shared foundations, distinct presentation

Use one product system with typed tier-specific fieldsets and controlled component variants. Do not build three disconnected sites. Do not make a commissioned dining table use the same card, form density and CTA as a keychain. Internal enum values may be LARGE, MEDIUM and SMALL; customer-facing labels are editable. Changing tier in Studio must not require a code deployment and must not erase previous data silently.

Keep product tier separate from legacy CSV classification tiers. Migration requires an explicit mapping; similar words do not mean the underlying enums are equivalent.

## 3. Technology, cost and account decisions

### Required architecture: `CUSTOM_STUDIO_CMS`

Build **RivyaLivingArt Studio CMS**, our own application-owned CMS inside the existing `/studio`. “Sanity-inspired” describes the owner's desired quality of structured editing, navigation, media selection, preview and publishing—not a requirement to use that product, duplicate its proprietary interface, or promise its complete feature set.

Do not install or embed Sanity, connect Content Lake, create a Sanity project/dataset, require a separate CMS login, use its SDK/query system, or add its API tokens, webhooks, subscription or media hosting. Do not substitute another turnkey CMS without a later explicit owner decision. Ordinary audited UI/editor libraries are permitted; the content model, editing screens, APIs, permissions and publishing workflows belong to this repository.

Preserve and enhance the Next.js App Router, TypeScript, Tailwind v4/shadcn, Prisma/Neon, Vercel Blob, Tiptap, existing staff authentication and WhatsApp workflow described in the uploaded README. R8-0 must verify the actual implementations. Do not replace working page/blog editors just to build a new branded shell.

| Concern | Required owner | Boundary |
|---|---|---|
| Deployment, app routes and server logic | Existing Next.js application on Vercel | Keep App Router, repository conventions and deployment pipeline. |
| Products, variants, prices, specifications, customization and operational settings | Existing Neon Postgres database via Prisma | One canonical SQL record per entity; retain current models where they work. |
| Pages, journal, collection stories, process, FAQs, testimonials, navigation and editorial SEO | Our custom CMS, backed by the same Neon/Prisma layer | Structured editorial data stays in our database; no external content dataset. |
| Drafts, immutable revisions, approvals, publication pointers and content-reference edges | Custom CMS server layer and SQL models | The working draft and public version must be distinct. Reuse equivalent existing tables before adding new ones. |
| Staff, sessions, roles, inquiries, private notes, audits and file-import state | Existing application authentication and server authorization | One staff login and permission system across Content, Catalogue, Media and operational modules. |
| Rich text | Existing Tiptap editor with an audited extension set | Keep the current compatible stored format; add schema-versioned changes only when required. |
| Approved images, videos, editorial vectors, models and specification files | Public Vercel Blob store, indexed by MediaAsset in SQL | Import selected Drive/provided assets and approved generated files; content references media IDs. Keep small audited UI icons in the existing local component system. No public Drive hotlinks or media bytes in Postgres. |
| Customer references, private quotes and sensitive uploads | Private Vercel Blob store | Authenticated staff access or explicit narrowly scoped expiring access; never a public CMS media source. |
| Owner's daily working surface | Existing `/studio` and its in-scope routes | One branded application workspace; no second hosted CMS dashboard. |

This is a Vercel-centred operational design, not a guarantee that all infrastructure has one vendor identity or one invoice. Keep the current Neon/Blob integrations and verify their actual management and billing setup. There is no separate hosted-CMS account in this specification.

### Custom content workspace and media integration

Use ordinary existing Next.js Studio routes. A proposed `/studio/content` content hub may link to established `/studio/pages`, `/studio/blog` and other editors, or use compatible typed editor routes after audit. Preserve canonical existing routes. Do not introduce a vendor catch-all or a second Studio application. Share the current dark tokens, accessible primitives and staff session.

Implement schema-driven field groups, content lists, rich text, a controlled page-section composer, draft autosave, validation, protected preview, revisions, publication and role checks as described in Section 9. These are custom build requirements, not claims that the existing repository already implements them.

Reuse a single Blob media picker across product editors, page sections, rich text and settings. Store a stable MediaAsset ID plus usage-specific alt text, caption, crop/focal overrides and variant selection where appropriate. The authoritative SQL media record owns storage path, access policy, dimensions, bytes, lifecycle and rights status. Validate references server-side; private customer attachments never appear in public-content pickers.

Use stable SQL references for related products, collections, pages and assets. Use foreign keys where suitable and a validated/indexed reference table for edges inside structured JSON. Do not duplicate product prices/specifications as separately editable CMS fields. Resolve product references through the published catalogue read layer. When a referenced item changes or becomes unavailable, apply a documented fallback or block publication and show a fixable warning.

Database transactions can coordinate changes inside SQL, but not atomically upload/delete Blob objects or invalidate external caches. Use explicit media lifecycle states, retryable post-commit tasks and idempotent reconciliation where needed. Do not leave half-published documents or delete in-use files because an external operation failed.

### Free-first, not falsely free

Vercel’s official Hobby and fair-use documentation, checked on 21 September 2026, restricts Hobby to personal, non-commercial use. Free application libraries do not make commercial Vercel hosting free. Verify current eligible plan pricing, usage, seats and tax terms before any business deployment, including business previews; no paid activation without owner approval. See Section 16 for official sources. Do not label a business brochure or WhatsApp-selling site non-commercial simply because it lacks checkout.

The earlier specification selects Neon through Vercel Marketplace rather than the discontinued standalone Vercel Postgres offering. Keep that documented direction, but verify the specific integration plan, allowances, billing relationship and provider-management links at setup. Do not promise an unlimited free database or that every provider operation lives in the Vercel dashboard.

Our CMS introduces no hosted-CMS subscription by design. Custom roles, drafts, history and preview must be implemented and tested in our code rather than bought as a CMS plan upgrade. Engineering, maintenance, storage, backups, function usage and any configured scheduler still have costs. A custom CMS is not a claim of zero hosting cost or free unlimited features.

Use free-licensed components where their actual license permits this commercial site. “Free component” does not imply every template/plugin in a library is free. The prior reference review identifies React Bits as MIT + Commons Clause; verify and preserve its applicable terms. Reuse the installed Tiptap extension set after license/compatibility audit; do not add paid cloud collaboration or premium editor services as a hidden prerequisite. Do not buy paid templates or activate paid services without owner approval. For missing images/video, provide the owner with prompts in the separate asset file; the owner generates and returns files to Drive. Record known source costs/limits without purchasing credits. Small original SVG/UI assets may be authored in code. Do not promise free unlimited generation or infer that Codex/ChatGPT usage is unlimited.

### Versions and dependency policy

Use the latest stable, security-patched release that is demonstrably compatible with the existing application—not canary/beta by default and not a blind major upgrade. Resolve exact supported versions at implementation time; do not treat an earlier release-family mention as a current package pin. Audit installed React, Node, Next, Tailwind, Prisma, staff auth, Tiptap and motion peer requirements before changing them.

Record current version, candidate version, source URL, license, compatibility notes and upgrade test results. Preserve the existing package manager and lockfile. Pin resolved versions reproducibly. Never put the literal string `latest` into production dependency requirements as a substitute for a tested lockfile.

Prefer the existing GSAP + ScrollTrigger + SplitText motion system and existing Lenis integration. Add Motion only if selected functionality justifies it and no current dependency already supplies it. Do not run two animation systems on the same DOM properties. Retain a working model-viewer integration. Keep the current authentication solution unless a separately scoped security/compatibility issue requires migration.

## 4. Design references: observed structure versus adaptation

These references are design research, not sources for product copy, customer proof, visual assets or complete-site cloning. Their live animation implementation and accessibility were not fully exercised in this review.

| Reference | What the retrievable page supports | Proposed RivyaLivingArt adaptation | Do not copy |
|---|---|---|---|
| [Aventura Dental Arts](https://aventuradentalarts.com/) | Premium positioning, a prominent booking CTA, service categories, a numbered technology sequence, expert/team and testimonial sections. | A simple furniture-first opening, a Commission a Piece CTA, material/process chapters and genuine maker credibility. | Dental content, claimed years, testimonials, staff images or unsupported claims about its precise animation timings. |
| [ADM Design](https://www.admdesign.com.sg/) | Project-led storytelling, planning/design/construction/management steps and case studies. | A commission process and project case-study format with real interiors, material decisions and installation context. | Their project numbers, client logos or corporate service taxonomy. |
| [ARIO](https://ario.law/en/) | Numbered navigation/practice sections, a strong verbal identity, team hierarchy and recognition/news content. | Clear numbered chapters and confident concise typography for large work. | Their awards, irreverent legal copy or motion that interferes with product reading. |
| [Floema products](https://floema.com/en/products) | Separate collection/product filters, product names, sizes, colours and result counts. | Structured furniture discovery, dimensions/material facets, shareable filters and measured card density. | Its product designs, descriptions, images or the same density for every resin product tier. |
| [OKA](https://www.oka.com/) | Broad furniture/home category navigation and editorial/room-oriented merchandising. | Product/room/material discovery and related-piece suggestions while retaining the commission-led model. | Conventional checkout/account flows, promotion-heavy merchandising or unverifiable styling details. |
| [Core Atelier](https://coreatelierpilates.com/) | Focused studio story, hero media, image-slider references, testimonials and a journey CTA. | A maker-led atelier story, selective imagery and an approachable consultation invitation. | Pilates booking/membership features, press logos, testimonials or wellness claims. |

Retain the additional resin-specific references named in the three-tier upload as a later research queue, not as independently validated recommendations: Draga & Aurel, Materia Aurea, Dinosaur Designs, Scarlet Splendour, WITHIN, Korepox Arts, VEDUMI, The Art Galaxy, Radhika Art and Resin Art Store India. Record source URLs and research dates when actually reviewed.

### Proposed visual system

Keep the repository-specific styling contract described in the upload: semantic tokens in `src/styles/tokens.css`, bridged through `@theme inline` in `src/app/globals.css`. Do not introduce a new `tailwind.config.*` merely because a downloaded component assumes Tailwind v3. Verify and preserve `src/proxy.ts` and the existing route-protection conventions. Audit the installed `next-view-transitions` integration before retaining or replacing it; do not add another page-transition provider by default. These paths come from the uploaded README and still require source verification.

Evolve the existing “Liquid Luxury” system rather than importing a new global template. The upload names Instrument Serif for display, Inter for body/UI and JetBrains Mono for price/count/date/dimension data, along with existing multilingual support. Retain those fonts and locale conventions unless the actual repository differs; avoid loading unused script faces on every route.

Use the supplied logo board’s bronze, forest-green and warm ivory as the brand basis. The dark-theme adaptation is background `#101713`, surface `#19221C`, elevated surface `#232E26`, primary bronze `#B79270`, hover bronze `#CEAC89`, primary text `#F3EFE7`, muted text `#B7BFB5` and decorative border `#3A483E`. Use a stronger control boundary such as `#78867C` where a visible input outline is necessary. These are proposed interface tokens derived from the raster artwork, not certified original logo swatches. Section 21 documents sampling, contrast and logo handling. This replaces the earlier generic champagne/ocean fallback while retaining existing token names and component APIs.

Replace the older “no adjacent dark bands / max three dark sections” rule in the active design spec with the owner's fully dark requirement. Create hierarchy with spacing, imagery, tonal surfaces and hairlines, not light-mode sections or bright gradients. Preserve historical design records. Keep bronze restrained; use dark text on an occasional solid-bronze primary action, and avoid ubiquitous metallic fills, neon, glass cards or pill-shaped marketplace tiles. Preserve older dated palette rules as history rather than active requirements.

Large imagery, generous negative space, a disciplined type scale and a few deliberate transitions should do most of the work. Public pages are expressive; Studio is compact, readable and task-oriented. No cursor trails, parallax, shader backgrounds or scroll hijacking in Studio.

## 5. Information architecture and section requirements

Preserve existing canonical URLs. The route names below express intended destinations; do not rename already-indexed equivalents without a redirect/canonical plan.

### Public page inventory

| Destination | Required content/behavior |
|---|---|
| Home | Furniture-led hero, selected collectible pieces, category discovery, material story, commission process, three-world introduction, approved project/testimonial proof, journal and contact. |
| `/collectible-design` | Dedicated editorial gallery for tables, seating, consoles, sculptural objects, wall installations and bespoke projects. Large cards, dimensions/material discovery and commission CTAs. |
| Collectible subcollections | Use audited existing category routes or a compatible nested route; preserve URL filters and canonical product links. |
| Canonical product detail | Existing product slug route; tier-aware media, pricing, specifications, customization and related products. Do not create duplicate uncanonical product pages. |
| `/memory-art` | Occasion/preservation browsing, product grid, customization explanation, physical-material shipping process and preservation CTA. |
| `/personal-art` | Fast variant/personalization discovery, gifts/recipient/festival filters and WhatsApp request flow. |
| Custom commission/custom order | Dedicated large-project wizard; reuse the existing custom-order backend. |
| Architect/designer enquiry | Trade/project context, dimensions/site-access fields, specifications and consultation; no account requirement. |
| About / Our Story | Verified studio, artist, process and craft information. |
| Portfolio and case studies | Owner-approved finished work, materials, project context and related products. |
| Process / Materials / Care | Real fabrication and care information, not unverified durability/safety guarantees. |
| Journal index and article | CMS categories, author/date, related content/products and SEO. |
| FAQ / Contact | Configurable answers, supplied WhatsApp/phone/email/map link and accessible forms. |
| Existing workshops / 3D printing pages | Preserve functioning services described in the README; do not remove them because furniture is now primary. Hide unsupported service claims until approved. |
| Search | Published-product discovery, pagination, tier-aware results and useful no-results state. |
| Inquiry receipt / WhatsApp fallback | Confirm only the saved request, show reference and next action, offer copy/retry/contact fallbacks; do not expose private data through guessable URLs. |
| Privacy / Terms / delivery-care policies | Owner-approved business policies and privacy/retention wording; do not claim legal certification. |
| System states | Branded 404, recoverable error, root error, loading, empty collection, unavailable product, media failure and form-submission failure. |
| Staff login / recovery / access denied | Staff-only, not public customer account pages. |

### Home: proposed section order

1. Atelier header and collection-led navigation.
2. Large-product hero with one key object and two controlled actions.
3. Three to six approved collectible pieces in live mode. In isolated demo preview, use explicitly labelled demo/concept pieces from Section 18; never imply that they are actual stock.
4. Tables, seating, consoles and installations discovery.
5. Macro material and craft story.
6. Bespoke commission process with an enquiry action.
7. “Three scales. One artistic language.” introducing the secondary worlds while keeping large work visually dominant.
8. One approved project story; genuine testimonials only in live mode. Isolated demo preview may show clearly identified sample stories/testimonials.
9. Journal insights and care/process education.
10. Contact invitation and full footer.

### Large-product detail and enquiry sequence

The product detail needs editorial media, object name/type, edition/bespoke state, material story, dimensions with units, optional verified weight, finish choices, pricing mode, lead-time range, shipping/installation constraints, care, specification download if available, creator/process context and related large pieces.

The commissioning sequence is: choose object or project type → describe dimensions/site → choose materials/finish → share location/site-access and timing → optional budget and private references → review personal/contact details and consent → save request → continue on WhatsApp. Capture a product/options/price/lead-time snapshot so later catalogue edits cannot alter what was originally requested. Manufacturing feasibility, load-bearing claims and installation suitability remain subject to the owner's review, not generated guarantees.

## 6. Component adoption policy

Audit before installing. The full replacement register follows in Section 7. It describes replacement slots because the actual component tree was not available for this review.

| Requested library | Selection decision |
|---|---|
| [ThreeUI](https://threeui.com/browse) | Optional research for a single material study; the directly retrieved catalogue did not expose enough detail to certify component-level compatibility. No WebGL dependency in the baseline and no use for essential navigation/forms. |
| [SmoothUI](https://smoothui.dev/docs/components) | Strong candidate for selected stepper/upload/button presentation, subject to actual source/license/dependency audit. Reuse behavior patterns without importing a second app architecture. |
| [Magic UI](https://magicui.design/) | Selective Blur Fade, Scroll Progress and optional Number Ticker. Free components are distinct from the promoted Pro templates. Reimplement simple effects with existing dependencies when cheaper. |
| [unlumen UI](https://ui.unlumen.com/components) | Its catalogue labels free and Pro entries. Consider free Motion FAQs Accordion or Sidebar 001; do not require Pro navigation/video effects. |
| [21st.dev](https://21st.dev/) | Discovery registry, not a blanket compatibility/license guarantee. Follow each author's original source, license and dependency list. Do not let an agent install arbitrary community code unreviewed. |
| [React Bits](https://reactbits.dev/) | Optional TypeScript/Tailwind effects such as Split Text; prefer current GSAP implementation. Review MIT + Commons Clause terms and preserve attribution/notices. Avoid continuous GPU backgrounds for the main site. |
| [Animmaster Lib](https://animmasterlib.dev/) | The page promotes paid access. Treat as research only unless a specific free, legally usable source is verified; no paywall bypass or required paid component. |
| [Skiper UI](https://skiper-ui.com/) | Mixed free/premium catalogue. Do not depend on premium image reveal, cursor trails or sign-in examples. Its free Dynamic Island is not needed for this site's baseline. |
| [Vengeance UI](https://www.vengenceui.com/) | A possible micro-interaction reference. The reviewed Kinetic Text Loader is not a reason to block real loading or add a cinematic preloader. No baseline dependency. |
| [daisyUI](https://daisyui.com/?lang=en) | Valid separate component system, but not the default addition to an existing shadcn/Tailwind token system. Use as reference only; avoid an unnecessary global theme/plugin collision. |
| [Originkit](https://www.originkit.dev/) | Home page was discoverable but usable component documentation was not retrieved. Mark unverified; do not invent component names, license claims or install commands. |

Do not install all eleven libraries. The mandatory foundation is the existing primitives and motion stack. shadcn documentation now offers multiple primitive families; stay with the family's actual installed implementation (for example Radix if that is what the project uses). Do not introduce Base UI and Radix duplicates solely because a current example defaults to a different family.

For each candidate, record: existing file/export/call sites → desired replacement/variant → exact original source link → license → dependencies and package versions → server/client boundary → token mapping → prop compatibility → accessibility fallback → performance delta → test result → adopted/deferred/rejected decision.

A registry component is untrusted source code. Inspect scripts, remote assets, network requests, environment usage and dependencies before running its installer. Never paste an entire unrelated template over the repository.

## 7. Full component replacement register — 52 proposed specifications

**Stage rule:** these acceptance criteria describe final integrated behavior. First implement each component’s presentation and safe labelled fixture interactions in R8-1–5; record UI_READY separately from BACKEND_CONNECTED/TESTED. Complete actual persistence, authentication and external behavior in R8-6–10. Section 23 governs preview isolation and overrides any implication that final backend behavior must exist before visual review.

**Path rule:** map these names to actual files during R8-0. Reuse the current component location/export whenever possible. Where a genuinely new component is needed, place it in the matching existing feature directory; a proposed class name does not authorize a parallel `components-new` tree or a global template replacement. Source links indicate the reference or primitive, not a promise of drop-in compatibility.

### W01 — `AtelierHeader`

**Surface:** Website  
**Replace or extend:** Existing header and primary navigation (actual path/export must be recorded in R8-0).  
**Placement:** Public layout; reuse existing header file.  
**Reference:** [shadcn Navigation Menu](https://ui.shadcn.com/docs/components).

**Implementation:** Keep existing routes, logo contract and navigation data. Lead with Collectible Design, then Memory Art, Personal Art & Gifts, Custom Commission, Our Story and Journal. Apply existing tokens, not imported global CSS.

**Acceptance:** Keyboard navigation; active-route state; no unexpected header layout shift.

### W02 — `MobileAtelierMenu`

**Surface:** Website  
**Replace or extend:** Existing mobile menu (actual path/export must be recorded in R8-0).  
**Placement:** Public layout, small viewports.  
**Reference:** [shadcn Sheet](https://ui.shadcn.com/docs/components).

**Implementation:** Use the existing dialog/sheet primitive family. Provide scroll locking, focus trapping, Escape dismissal and focus return. Keep contact actions visible without covering page controls.

**Acceptance:** Touch and keyboard work; no scroll lock remains after close.

### W03 — `CollectionSearch`

**Surface:** Website  
**Replace or extend:** Existing search UI (actual path/export must be recorded in R8-0).  
**Placement:** Header and search route.  
**Reference:** [shadcn Command](https://ui.shadcn.com/docs/components).

**Implementation:** Search published products first, grouped by customer-facing collection. Large products take merchandising priority without hiding smaller matches. Use database-backed server queries and debounced requests; expose a normal search page fallback.

**Acceptance:** No drafts or customer data in results; useful empty state; cancel stale requests.

### W04 — `CollectibleHero`

**Surface:** Website  
**Replace or extend:** Existing generic hero (actual path/export must be recorded in R8-0).  
**Placement:** Home and /collectible-design.  
**Reference:** [Custom editorial section; GSAP](https://gsap.com/).

**Implementation:** Build a server-rendered image/poster-led hero with an optional approved Blob video. First map a suitable owner-approved Drive or existing library asset; use a prompt-generated editorial concept only where appropriate and approved under Section 11. Never depict an invented commission as completed work. One clear headline and Commission a Piece CTA. Video is an enhancement, not a prerequisite for content or navigation.

**Acceptance:** Poster visible immediately; no forced preloader; reduced motion and failed-video fallback.

### W05 — `EditorialSplitHeading`

**Surface:** Website  
**Replace or extend:** Existing animated display heading (actual path/export must be recorded in R8-0).  
**Placement:** Hero and a few section headings.  
**Reference:** [React Bits Split Text](https://reactbits.dev/text-animations/split-text).

**Implementation:** Treat the component as a reference. Prefer the already-installed GSAP SplitText implementation. Preserve an accessible full text alternative, wait for fonts where necessary, and revert split DOM during cleanup.

**Acceptance:** Text visible without JavaScript; no duplicate screen-reader text; no layout jump.

### W06 — `ThreeWorldsSection`

**Surface:** Website  
**Replace or extend:** Existing category tiles (actual path/export must be recorded in R8-0).  
**Placement:** Home, below primary furniture storytelling.  
**Reference:** [Custom shared design variants; shadcn Card](https://ui.shadcn.com/docs/components).

**Implementation:** Create an asymmetric three-world composition, giving the furniture image greater prominence. Do not render three identical ecommerce cards or display internal LARGE/MEDIUM/SMALL labels to customers.

**Acceptance:** All three routes are discoverable; approved images suit the different product scales.

### W07 — `CollectibleProductCard`

**Surface:** Website  
**Replace or extend:** Existing large-product card usage (actual path/export must be recorded in R8-0).  
**Placement:** Home and collectible listings.  
**Reference:** [Custom server component; Next Image](https://nextjs.org/docs/app/api-reference/components/image).

**Implementation:** Show a large image, title, object type, material, edition/bespoke label and allowed price state. Keep purchase intent consultation-led. Use a real link and prevent nested interactive elements.

**Acceptance:** Correct price-on-request semantics; no Add to Cart; stable image aspect ratio.

### W08 — `MemoryProductCard`

**Surface:** Website  
**Replace or extend:** Existing medium-product card usage (actual path/export must be recorded in R8-0).  
**Placement:** /memory-art and related-product sections.  
**Reference:** [Custom controlled variant; shadcn Card](https://ui.shadcn.com/docs/components).

**Implementation:** Show occasion/preservation type, available sizes, customization indicator and starting price only when supplied. Link to the preservation flow rather than a checkout.

**Acceptance:** Missing prices are not displayed as zero; correct medium-tier CTA.

### W09 — `PersonalArtProductCard`

**Surface:** Website  
**Replace or extend:** Existing small-product card usage (actual path/export must be recorded in R8-0).  
**Placement:** /personal-art and seasonal collections.  
**Reference:** [Custom controlled variant; shadcn Card](https://ui.shadcn.com/docs/components).

**Implementation:** Use denser discovery, visible variants and real prices where available. Main action is Personalize / Request on WhatsApp. Preserve accessibility without wrapping the entire card around nested buttons.

**Acceptance:** Variant selections survive into inquiry; no customer account or payment flow.

### W10 — `CollectionFilterPanel`

**Surface:** Website  
**Replace or extend:** Existing collection filters and sort controls (actual path/export must be recorded in R8-0).  
**Placement:** All collection pages.  
**Reference:** [shadcn Select, Sheet and Checkbox](https://ui.shadcn.com/docs/components).

**Implementation:** Store shareable filters in URL parameters. Use tier-appropriate facets: dimensions/material/type for large, occasion/preservation for medium, recipient/colour/festival for small. Validate sorting server-side and paginate.

**Acceptance:** Browser back restores filters; mobile filters close accessibly; no full-catalogue client download.

### W11 — `ProductMediaGallery`

**Surface:** Website  
**Replace or extend:** Existing product gallery (actual path/export must be recorded in R8-0).  
**Placement:** Canonical product detail route.  
**Reference:** [shadcn Carousel / Dialog](https://ui.shadcn.com/docs/components).

**Implementation:** Preserve the existing media model. Prioritize authentic Drive/library photographs and footage of the specific product. Keep approved renders visibly distinguishable from photographs; generated views are not evidence of dimensions or construction. Add keyboard-enabled thumbnails, zoom, explicit video controls and captions. Use responsive images and reserve dimensions. Avoid autoplaying all product videos.

**Acceptance:** A complete static gallery works; focus returns after closing zoom; broken media falls back.

### W12 — `CollectibleSpecifications`

**Surface:** Website  
**Replace or extend:** Existing product specification area (actual path/export must be recorded in R8-0).  
**Placement:** Large-product detail pages.  
**Reference:** [shadcn Tabs and Accordion](https://ui.shadcn.com/docs/components).

**Implementation:** Group dimensions with units, materials, weight when known, finishes, lead-time range, installation notes, care and approved specification downloads. Show unknown values as not supplied or omit them, never invent them.

**Acceptance:** Accessible semantic values; versioned downloadable specifications match the product.

### W13 — `ProductModelViewer`

**Surface:** Website  
**Replace or extend:** Existing optional 3D viewer (actual path/export must be recorded in R8-0).  
**Placement:** Large-product detail, after primary imagery.  
**Reference:** [Google model-viewer](https://modelviewer.dev/).

**Implementation:** Retain model-viewer if present. Load an approved GLB on interaction or proximity; provide a poster, useful alt text, loading/error states and optional USDZ only when a valid asset exists. No fabricated AR or dimensional accuracy claims.

**Acceptance:** Unsupported device still shows imagery and specifications; offscreen models do not keep rendering.

### W14 — `MaterialStory`

**Surface:** Website  
**Replace or extend:** Existing material/process sections (actual path/export must be recorded in R8-0).  
**Placement:** Home, collectible landing and process page.  
**Reference:** [Magic UI Blur Fade / existing GSAP](https://magicui.design/docs/components/blur-fade).

**Implementation:** Use relevant approved Drive/library macro photography and short maker-approved captions. Prompt-generated abstract material illustrations are allowed where clearly presented as concepts, not documentary workshop evidence. Prefer existing GSAP or IntersectionObserver over adding Motion solely for an opacity reveal. Optional desktop scroll storytelling must become normal vertical content on mobile.

**Acceptance:** Content never stays hidden when script fails; no mobile scroll hijacking.

### W15 — `CommissionButton`

**Surface:** Website  
**Replace or extend:** Existing main CTA button styling (actual path/export must be recorded in R8-0).  
**Placement:** Hero, product detail and contact CTA.  
**Reference:** [SmoothUI Magnetic Button](https://smoothui.dev/docs/components/magnetic-button).

**Implementation:** Keep the current Button API and semantic element. Adopt only a restrained hover/press treatment. Optional magnetism is desktop fine-pointer only and never moves the keyboard focus target or changes the hit area.

**Acceptance:** Disabled/pending/focus states remain visible; no magnetism in Studio or reduced motion.

### W16 — `CommissionWizard`

**Surface:** Website  
**Replace or extend:** Existing custom-order form (actual path/export must be recorded in R8-0).  
**Placement:** Dedicated large-art commissioning route.  
**Reference:** [SmoothUI Animated Stepper](https://smoothui.dev/docs/components/animated-stepper).

**Implementation:** Use React Hook Form and server-side Zod. Steps cover product/project, dimensions, materials/finish, delivery/site access, optional budget/timing, private references/contact and review. Store a versioned inquiry before WhatsApp handoff.

**Acceptance:** Per-step validation; back navigation preserves inputs; duplicate submit produces one record.

### W17 — `PreservationWizard`

**Surface:** Website  
**Replace or extend:** Existing preservation customization form (actual path/export must be recorded in R8-0).  
**Placement:** Medium-tier product detail and /memory-art.  
**Reference:** [SmoothUI Animated Stepper](https://smoothui.dev/docs/components/animated-stepper).

**Implementation:** Add occasion, names, dates, shape, size, finish and private uploads. Show physical flower/object shipping instructions as owner-approved content; explain design confirmation, casting, curing, finishing and delivery.

**Acceptance:** Privacy consent captured; date handling is correct; only applicable fields are required.

### W18 — `PersonalizationRequest`

**Surface:** Website  
**Replace or extend:** Existing quick personalization form (actual path/export must be recorded in R8-0).  
**Placement:** Small-tier product detail.  
**Reference:** [shadcn Field, Input, Select and Radio Group](https://ui.shadcn.com/docs/components).

**Implementation:** Use a compact form for name/initial, colour, variant, quantity, optional gift wrap and notes. Calculate only configured values server-side; do not imply a binding final quote if WhatsApp approval is required.

**Acceptance:** Selections and quantity are captured in a saved request; input labels and errors are accessible.

### W19 — `ReferenceUpload / MediaUpload`

**Surface:** Both  
**Replace or extend:** Existing file-upload widget (actual path/export must be recorded in R8-0).  
**Placement:** Customer forms and Studio media library.  
**Reference:** [SmoothUI Animated File Upload](https://smoothui.dev/docs/components/animated-file-upload).

**Implementation:** Reuse the upload presentation only. Implement authorized direct-to-Blob uploads, per-file restrictions, metadata validation, cancellation and retry. Public approved marketing media and private customer references use distinct access policies/stores.

**Acceptance:** Unauthorized and oversized uploads fail; progress reflects bytes; private files are never publicly listed.

### W20 — `CraftFAQ`

**Surface:** Website  
**Replace or extend:** Existing FAQ/process disclosure (actual path/export must be recorded in R8-0).  
**Placement:** Product pages and /faq.  
**Reference:** [unlumen Motion FAQs Accordion](https://ui.unlumen.com/components/motion-faqs-accordion).

**Implementation:** Use the current accessible accordion as the implementation baseline. Adapt spacing and subtle open/close movement from the free reference; keep FAQ content in our custom CMS with the published-version read boundary.

**Acceptance:** Keyboard and screen readers work; no FAQ answer exists only inside an animation.

### W21 — `AtelierTestimonials`

**Surface:** Website  
**Replace or extend:** Existing testimonials block (actual path/export must be recorded in R8-0).  
**Placement:** Home and selected landing pages.  
**Reference:** [shadcn Carousel](https://ui.shadcn.com/docs/components).

**Implementation:** Live mode displays only verified customer-approved testimonials. Isolated demo preview may render the 24 fictional fixtures with a persistent demo banner and an adjacent “Fictional sample — not a customer review” label. Prefer manual navigation and a static quote on small screens. Omit the live section when no genuine approved testimonials exist; never copy demo quotes into real reviews.

**Acceptance:** No fabricated rating, reviewer photo, review count or press logo.

### W22 — `JournalGrid / JournalArticle`

**Surface:** Website  
**Replace or extend:** Existing blog teaser and article layout (actual path/export must be recorded in R8-0).  
**Placement:** Home, journal index and article routes.  
**Reference:** [Magic UI Blur Fade](https://magicui.design/docs/components/blur-fade).

**Implementation:** Keep articles server-rendered from our custom CMS published-content service. Add category, author, date and related product references; motion is optional and titles remain ordinary links.

**Acceptance:** Drafts cannot leak; canonical metadata and article links are correct.

### W23 — `AtelierCursor`

**Surface:** Website  
**Replace or extend:** Existing decorative mouse effect (actual path/export must be recorded in R8-0).  
**Placement:** Optional public gallery areas only.  
**Reference:** [Custom CSS + existing GSAP](https://gsap.com/).

**Implementation:** Render a non-interactive aria-hidden pointer-following label only for eligible fine pointers. Preserve the native cursor by default. Disable on controls, touch, reduced motion, low-power fallback and every Studio route.

**Acceptance:** No pointer blocking; no per-mousemove React rerender loop; normal selection works.

### W24 — `ReadingProgress`

**Surface:** Website  
**Replace or extend:** Existing long-page scroll indicator (actual path/export must be recorded in R8-0).  
**Placement:** Journal and long process/detail pages.  
**Reference:** [Magic UI Scroll Progress](https://magicui.design/docs/components/scroll-progress).

**Implementation:** Reuse existing motion infrastructure where possible. Measure the correct scroll container and actual scrollable range; label this as reading progress, not loading or purchase completion.

**Acceptance:** Accurate on resize and content changes; hidden or completed sensibly on short pages.

### W25 — `RoutePendingBar`

**Surface:** Both  
**Replace or extend:** Existing route loading bar (actual path/export must be recorded in R8-0).  
**Placement:** Public and Studio layouts.  
**Reference:** [Next loading.js / Suspense](https://nextjs.org/docs/app/api-reference/file-conventions/loading).

**Implementation:** Use supported App Router pending/navigation signals from the installed version and the existing route architecture. Show an indeterminate bar only for actual pending work; keep it separate from step and upload percentages. Do not use Pages Router router.events hacks.

**Acceptance:** Completes after success, cancellation and failure; never adds an artificial delay.

### W26 — `CollectionSkeleton / StudioSkeleton`

**Surface:** Both  
**Replace or extend:** Existing placeholder/loading UI (actual path/export must be recorded in R8-0).  
**Placement:** Route loading files and async panels.  
**Reference:** [shadcn Skeleton](https://ui.shadcn.com/docs/components).

**Implementation:** Match the shape and dimensions of final content to reduce layout shift. Use reserved media ratios. Disable shimmer under reduced motion and expose polite loading status.

**Acceptance:** No infinite skeleton after errors; page remains navigable.

### W27 — `AtelierControlPrimitives`

**Surface:** Both  
**Replace or extend:** Existing select/dropdown/button interaction styles (actual path/export must be recorded in R8-0).  
**Placement:** Shared ui primitive files.  
**Reference:** [shadcn Dropdown Menu, Select, Button](https://ui.shadcn.com/docs/components).

**Implementation:** Restyle current primitives with dark semantic tokens. Include hover, focus-visible, open, pressed, invalid, disabled, loading and success states. Keep native/select semantics and avoid nested button/link elements.

**Acceptance:** Keyboard typeahead and Escape; clear contrast in all states.

### W28 — `GlobalInteractionTokens`

**Surface:** Both  
**Replace or extend:** Existing selection/scrollbar/focus styling (actual path/export must be recorded in R8-0).  
**Placement:** Existing tokens and globals CSS.  
**Reference:** [Native CSS / current Tailwind foundation](https://daisyui.com/?lang=en).

**Implementation:** Use native CSS for ::selection and restrained scrollbar styling; daisyUI is a visual comparison, not a required install. Do not disable selection or native scrolling. Focus styling must remain highly visible.

**Acceptance:** Text remains selectable; standard scrolling works; no new global component reset.

### W29 — `AtelierNotFound / AtelierError / EmptyCollection`

**Surface:** Website  
**Replace or extend:** Existing 404, error and empty views (actual path/export must be recorded in R8-0).  
**Placement:** Existing not-found.tsx, error.tsx and global-error.tsx conventions.  
**Reference:** [Next error handling](https://nextjs.org/docs/app/getting-started/error-handling).

**Implementation:** Build a refined static sculptural composition with home, collectible and contact links. An original prompt-designed SVG or an approved lightweight illustration may supply the decorative artwork; keep it locally available so an asset-service failure does not break the error page. Keep error reset/retry meaningful; log server errors safely. Never expose stack traces, credentials or customer details.

**Acceptance:** Real 404 response where appropriate; retry works; dark mode persists in root error UI.

### W30 — `AtelierContact / WhatsAppHandoff`

**Surface:** Website  
**Replace or extend:** Existing contact/footer/WhatsApp block (actual path/export must be recorded in R8-0).  
**Placement:** Footer, contact and inquiry receipt.  
**Reference:** [Custom Next server action; existing WhatsApp utility](https://nextjs.org/docs/app/guides/forms).

**Implementation:** Use supplied contact data. Save the inquiry first, then open the encoded WhatsApp message. Provide copy summary, retry WhatsApp and phone/email fallbacks. Do not mark a WhatsApp click as an accepted order.

**Acceptance:** Failed DB write does not claim success; handoff blocked by browser is recoverable.

### A01 — `StudioShell`

**Surface:** Studio  
**Replace or extend:** Existing sidebar and dashboard shell (actual path/export must be recorded in R8-0).  
**Placement:** Existing /studio layout.  
**Reference:** [shadcn Sidebar; unlumen Sidebar 001](https://ui.shadcn.com/docs/components/radix/sidebar).

**Implementation:** Keep the current primitive family and routing. Group Overview, Catalogue, Content, Media, Inquiries, Imports/Exports and Settings. Adopt restrained sidebar spacing from unlumen only after license checks.

**Acceptance:** Role-scoped navigation; persistent mobile/desktop layout; no public animation provider.

### A02 — `StudioLogin`

**Surface:** Studio  
**Replace or extend:** Existing staff sign-in screen (actual path/export must be recorded in R8-0).  
**Placement:** Existing staff login route.  
**Reference:** [SmoothUI Auth Form](https://smoothui.dev/docs/components/auth-form).

**Implementation:** Audit and retain the working authentication backend; extend any missing behavior under Section 19 rather than merely drawing a login card. Use the supplied brand lockup, labelled fields, password visibility, recovery help, truthful pending/errors and persistent server-side throttling. Do not ship demo credentials or a public demo-login bypass.

**Acceptance:** Keyboard usable; generic auth errors; no client-only access control.

### A03 — `StudioRecovery / StaffSetup`

**Surface:** Studio  
**Replace or extend:** Existing password recovery/setup screens (actual path/export must be recorded in R8-0).  
**Placement:** Existing reset/first-run routes.  
**Reference:** [shadcn Field and Alert](https://ui.shadcn.com/docs/components).

**Implementation:** Retain only working backend flows. Use single-use expiring reset/setup tokens; disable bootstrap after owner creation. Without configured email delivery, provide a documented controlled recovery process instead of a fake send button.

**Acceptance:** Expired/reused tokens fail; no public registration; safe redirect targets.

### A04 — `StudioOverview`

**Surface:** Studio  
**Replace or extend:** Existing KPI cards and charts (actual path/export must be recorded in R8-0).  
**Placement:** /studio dashboard.  
**Reference:** [shadcn Chart + optional Magic UI Number Ticker](https://ui.shadcn.com/docs/components/radix/chart).

**Implementation:** Show database-derived inquiry counts, response backlog, large-project pipeline, draft products, pending asset approvals and failed file imports. Separate Live and Demo dataset views; label Demo analytics explicitly and never merge demo orders into business totals. Break down by product tier. Animate initial numbers once at most and keep tabular alternatives.

**Acceptance:** No invented revenue/conversions; accessible chart summary; honest empty state.

### A05 — `ProductManagementTable`

**Surface:** Studio  
**Replace or extend:** Existing product list table (actual path/export must be recorded in R8-0).  
**Placement:** Existing Studio products route.  
**Reference:** [shadcn Data Table](https://ui.shadcn.com/docs/components/radix/data-table).

**Implementation:** Add server-side filtering, search, pagination, tier badges, publication/rights status, price type, lead time and owner. Use safe bulk operations with explicit selection scope and confirmation.

**Acceptance:** Thousands of rows remain usable; selections do not silently apply to all pages.

### A06 — `ProductTierFieldsets`

**Surface:** Studio  
**Replace or extend:** Existing product editor fields (actual path/export must be recorded in R8-0).  
**Placement:** Studio product create/edit.  
**Reference:** [shadcn Tabs, Select and Field](https://ui.shadcn.com/docs/components).

**Implementation:** Mandatory tier controls conditional fieldsets, storefront variant and CTA. Tier changes show affected fields, validate preserved data and require confirmation; do not silently erase tier-specific information.

**Acceptance:** Move a product between tiers without code changes; required values validate server-side.

### A07 — `ProductFormBuilder`

**Surface:** Studio  
**Replace or extend:** Existing custom form builder (actual path/export must be recorded in R8-0).  
**Placement:** Studio product customization tab.  
**Reference:** [shadcn Field, Select and Accordion](https://ui.shadcn.com/docs/components).

**Implementation:** Keep the existing builder engine. Allow only typed, versioned field definitions and controlled visibility rules. Add keyboard move-up/down controls for ordering. Never allow arbitrary JavaScript or evaluation in stored schemas.

**Acceptance:** Preview matches the public form; historical inquiries preserve their original schema version.

### A08 — `MediaAssetManager`

**Surface:** Studio  
**Replace or extend:** Existing media library grid (actual path/export must be recorded in R8-0).  
**Placement:** Existing /studio media route.  
**Reference:** [SmoothUI Animated File Upload + shadcn Sheet](https://smoothui.dev/docs/components/animated-file-upload).

**Implementation:** Add searchable tags, folder-like prefixes, product/page/component assignments, tier, alt text, focal point, provenance, photograph/illustration/visualization label, rights approval, file size and usage references. Track source kind (owner Drive, owner upload, existing library, generated asset or licensed online vector/icon), original source reference, generation-brief ID when applicable, version and approver. Keep sensitive source details and prompts staff-only. Use the same upload/approval workflow for every source; no embedded Google search, live Drive synchronization or generation API is required. Confirm deletion and block removal of in-use assets by default.

**Acceptance:** Private customer uploads separated; valid upload retry; no broken product image after deletion. Assets have traceable sources and rights/approval status; blocked assets cannot be published. Source/generation metadata is not exposed through public APIs, while required public credits are rendered intentionally.

### A09 — `CustomContentWorkspace`

**Surface:** Studio  
**Replace or extend:** Existing editorial content entry point and content-list navigation (actual path/export must be recorded in R8-0).  
**Placement:** Existing Studio shell; proposed `/studio/content` hub linking to audited editor routes.  
**Reference:** Our custom composition of the existing [shadcn Sidebar, Command, Table and Resizable primitives](https://ui.shadcn.com/docs/components); no hosted CMS embed.

**Implementation:** Build a dark structure navigator, searchable/filterable document list and editor/preview area. Use the existing staff session and permissions. Preserve direct links, query filters and the current page/blog routes; show drafts, published content and documents with unpublished changes accurately. On mobile, collapse panes into accessible navigation rather than squeezing three columns into the viewport. Add allowed create, duplicate, archive and restore actions with real server handlers.

**Acceptance:** One staff login; refresh/deep links work; permission-filtered lists; no second CMS runtime or credentials; a published document with a new draft remains live at its old published version.

### A10 — `StructuredContentEditor / PageSectionBuilder`

**Surface:** Studio  
**Replace or extend:** Existing page, journal and editorial field editors (actual path/export must be recorded in R8-0).  
**Placement:** Existing content editors, organized through CustomContentWorkspace.  
**Reference:** Existing Tiptap implementation and [shadcn Field, Tabs, Accordion and Sheet](https://ui.shadcn.com/docs/components). The field/section registry and publication behavior are custom code.

**Implementation:** Define code-reviewed content-type schemas with field groups, constraints, defaults, conditional fields and schema versions. Retain the installed Tiptap editor and safe renderer. Add a section picker limited to actual W-series website components and approved variants; staff can add, reorder, duplicate, hide and edit those sections without writing code. Provide keyboard move-up/down as well as any audited drag-and-drop behavior. Use stable block IDs and SQL relation/media pickers. Add no arbitrary HTML, CSS, executable code, remote iframe builder or unreviewed plugin installation.

**Acceptance:** Required fields validate server-side; preview and public renderer use the same registered components; unknown blocks fail validation rather than executing; existing rich text, slugs and localization remain intact; content changes need no deployment, while new component/schema types remain code-reviewed changes.

### A11 — `ContentPreviewAndValidation`

**Surface:** Studio  
**Replace or extend:** Existing draft preview, autosave and validation feedback (actual path/export must be recorded in R8-0).  
**Placement:** Content editor and applicable product editor.  
**Reference:** Existing Next.js authenticated preview conventions and [shadcn Resizable, Alert and Dialog](https://ui.shadcn.com/docs/components).

**Implementation:** Provide desktop/tablet/mobile preview using the same frontend components and selected draft version. Baseline is authenticated staff-only preview; use a narrow expiring preview capability only for an explicitly approved sharing need. Show unsaved/saving/saved/failed/conflict states and the preview's actual saved revision. Implement server-side validation with field links. Autosave must not publish, advance approval, or silently overwrite another editor's version. Keep preview data and tokens out of public caches, search, metadata and logs.

**Acceptance:** Unsaved and failed saves remain distinguishable; draft changes never leak publicly; expired/unauthorized previews fail; a two-tab edit conflict is detected; a failed save cannot show a successful save or publication.

### A12 — `ImportProgressPanel`

**Surface:** Studio  
**Replace or extend:** Existing owner-supplied file-import progress UI (actual path/export must be recorded in R8-0).  
**Placement:** Existing owner-supplied CSV/XLSX import screens.  
**Reference:** [SmoothUI Animated Progress Bar](https://smoothui.dev/docs/components/animated-progress-bar).

**Implementation:** Read durable row counters and the current file-import cursor from the database. Provide resume, retry failed batch and cancel for owner-supplied CSV/XLSX files. Use indeterminate progress when total row count is unknown, then honest processed/known counts.

**Acceptance:** Refresh/session loss does not restart the job; repeated execution is idempotent.

### A13 — `InquiryPipeline`

**Surface:** Studio  
**Replace or extend:** Existing inquiry/order management view (actual path/export must be recorded in R8-0).  
**Placement:** Existing /studio inquiries route.  
**Reference:** [shadcn Data Table, Sheet and Tabs](https://ui.shadcn.com/docs/components/radix/data-table).

**Implementation:** Preserve the actual inquiry/order lifecycle. The proposed eight-state baseline is NEW, CONTACTED, QUALIFIED, QUOTED, CONFIRMED, IN_PRODUCTION, COMPLETED and CLOSED. The demo pack supplies five scenarios per state, with coverage expanded for any additional actual states. Show contact, tier, immutable request snapshots, assignment, notes, quotation references, next action and private attachments. Separate demo and live records; demo contact/export actions cannot send messages or imply payments.

**Acceptance:** A click-to-chat event never sets CONFIRMED; status changes require authorization and audit.

### A14 — `StudioSettings / SEOInspector`

**Surface:** Studio  
**Replace or extend:** Existing settings and SEO forms (actual path/export must be recorded in R8-0).  
**Placement:** Existing settings and SEO routes.  
**Reference:** [shadcn Tabs, Field, Switch and Alert](https://ui.shadcn.com/docs/components).

**Implementation:** Manage approved brand/contact values, featured products, content sections, metadata, redirects and safe feature toggles. Keep secrets in environment management, not editable public CMS fields.

**Acceptance:** No arbitrary HTML/script injection; canonical URLs stay on the approved domain.

### A15 — `StaffPermissions / AuditTrail`

**Surface:** Studio  
**Replace or extend:** Existing staff/roles/activity views (actual path/export must be recorded in R8-0).  
**Placement:** Existing roles and activity routes.  
**Reference:** [shadcn Table, Dialog and Badge](https://ui.shadcn.com/docs/components).

**Implementation:** Use the same staff identity and explicit capability checks across content, products, media, publication, imports and settings. Enforce admin/editor scopes inside every server mutation and private read; do not treat a hidden sidebar item as authorization. Log actor, operation, target, revision and timestamp with redaction. Preserve existing roles; map approval/publication powers explicitly and test privilege changes.

**Acceptance:** Direct unauthorized API calls fail even when users bypass the UI.

### A16 — `StudioIconSet / CraftVectors`

**Surface:** Both, with Studio as the primary functional use  
**Replace or extend:** Existing unlabeled icons and empty-state illustrations (actual path/export must be recorded in R8-0).  
**Placement:** Shared controls, public process/specification sections, Studio navigation/forms/media and empty states.  
**Reference:** Existing icon family first; [Lucide license](https://lucide.dev/license), [Google Material Symbols](https://developers.google.com/fonts/docs/material_symbols), or original prompt-authored sanitized SVG. Source selection must follow Section 11.

**Implementation:** Keep one compatible stroke language with visible labels or accessible names and optional explanatory tooltips. Reuse installed icons before adding assets. For missing craft symbols, use the prompt briefs to author true vector paths, or search Google and verify the original source's exact reuse terms. Normalize size, optical weight and padding without violating license terms. Suggested meanings: furniture, layers, ruler, palette, image, gift, flowers, inquiries, imports, settings, security and activity. Add original table/wood/resin diagrams and labelled empty-state illustrations. Store safe icon keys in CMS fields; never execute arbitrary user-entered SVG/code. Keep functional UI icons local, not dependent on a live search or Drive URL.

**Acceptance:** Decorative vectors are aria-hidden; meaningful icons have names; status never depends only on colour. SVG contains no executable/remote content. Source/notice records exist; no mixed full icon packs, fake vector exports, or oversized icon-font payload.

### A17 — `CatalogueImportExport`

**Surface:** Studio  
**Replace or extend:** Existing bulk import/export UI (actual path/export must be recorded in R8-0).  
**Placement:** Existing CSV/XLSX import and exports routes.  
**Reference:** [shadcn Table, Dialog and Progress](https://ui.shadcn.com/docs/components).

**Implementation:** Keep the documented CSV/XLSX workflow; do not reintroduce removed Google Sheets sync. Add schema/version validation, dry run, per-row errors, formula-injection-safe exports and resumable batches.

**Acceptance:** Import cannot bypass draft/rights gates; export is authorized and omits secrets.

### A18 — `ContentWorkflowControls / RevisionHistory`

**Surface:** Studio  
**Replace or extend:** Existing save, review, publish and document-history controls (actual path/export must be recorded in R8-0).  
**Placement:** Content editor action bar, revision drawer and supported scheduling panel.  
**Reference:** Our SQL-backed workflow with existing [shadcn Dialog, Sheet, Tabs and Alert](https://ui.shadcn.com/docs/components).

**Implementation:** Provide Save Draft, Submit for Review, Approve, Publish, Unpublish, Archive and Restore where permitted. Store immutable revision checkpoints; show author, timestamp and a readable diff. Restoring a revision creates a new draft and audit event, not an automatic public rollback. Publish only the exact validated/approved version through a transaction, then refresh affected public pages. Scheduling is a later subphase: persist the selected revision and UTC due time, and enable the control only after a durable authorized runner is configured and tested. Later edits do not silently change a scheduled revision.

**Acceptance:** Draft save cannot change public content; stale or unauthorized publication fails; audit/history survive restore; no lost-update overwrite; duplicate schedule execution is harmless; absent scheduling infrastructure produces a truthful disabled state, not a fake timer.

### A19 — `DemoDataManager / DemoDatasetNotice`

**Surface:** Studio; shared notice in protected demo preview.  
**Replace or extend:** Existing seed/import tools and dataset badges, if present.  
**Placement:** Proposed `/studio/settings/demo-data`, or matching existing route.  
**Reference:** Existing [shadcn Table, Alert Dialog, Checkbox, Progress and Badge](https://ui.shadcn.com/docs/components); backend contract is Section 18.

**Implementation:** Show batch/version/environment, counts by entity/status, installation and exclusion state, live/demo filters, and dirty/retained references. Provide preview-install, explicit install, individual deletion, delete selected, delete entity type, archive/restore where supported, full-batch removal and an explicit fresh reset. Use a dependency-aware dry run before execution, recent staff reauthentication, typed confirmation for full removal, durable cursors, idempotency and per-item results. A shared visible notice distinguishes demo content from real claims.

**Acceptance:** 120 products, 36 blogs, 42 FAQs, 24 testimonial examples and 40 scenarios are inspectable. Two install runs cannot duplicate them. Removing a batch preserves real data, real accounts and shared Drive/Blob assets. Removed fixtures do not return on restart/deploy. Demo replies, notifications and live metrics are blocked.

### A20 — `StudioNavigationSettings`

**Surface:** Studio.  
**Replace or extend:** Existing sidebar preferences and settings.  
**Placement:** Proposed preferences area under existing Studio settings.  
**Reference:** Existing [shadcn Checkbox, Switch, Separator and Button](https://ui.shadcn.com/docs/components).

**Implementation:** Let authorized staff hide/show optional menu shortcuts, reorder allowed groups and restore defaults. Use code-owned module keys with user/role-appropriate preferences, not arbitrary routes or permission editors. Keep account/security, sign-out, essential settings and a recovery path reachable. Module disablement, when supported, is a separate admin setting with server guards; it is not the same as hiding a shortcut.

**Acceptance:** Hidden menus neither delete records nor grant/revoke authorization. Demo cleanup does not silently remove content modules. A user can restore all permitted menu items without a code change.

### A21 — `EnvironmentHealthPanel`

**Surface:** Owner/admin Studio.  
**Replace or extend:** Existing deployment/setup diagnostics.  
**Placement:** Proposed `/studio/settings/environment`, subject to route audit.  
**Reference:** [Vercel environment variables](https://vercel.com/docs/environment-variables) and Section 19; use existing Field/Alert/Table primitives.

**Implementation:** Show only environment label, non-sensitive deployment identity, configured/missing flags, last check and safe DB/Blob/mail readiness. Credentials remain in Vercel settings; no secret reveal, generic environment dump, browser-side connection test, arbitrary shell/SQL execution or privileged Vercel API token is needed. Map buttons to actual supported checks and owner instructions.

**Acceptance:** A missing value produces a useful status, not an exposed value/connection string. Unauthorized users cannot query diagnostics. Test checks are bounded, rate-limited and scoped to the current environment; they never write live business content.

### A22 — `StaffAccountAndSessionManager`

**Surface:** Studio.  
**Replace or extend:** Existing staff profile/session pages; share A02/A03/A15 backend, not a second auth system.  
**Placement:** Existing account/security and staff routes.  
**Reference:** [Next.js authentication and authorization](https://nextjs.org/docs/app/guides/authentication); installed auth library’s current official guidance.

**Implementation:** Complete change-password, current-session information, logout, logout-all, active-user/role management, controlled invitation/setup, recovery and revocation. Recheck active identity/capabilities server-side even with JWT sessions; use an audited session-version/revocation design where needed. Changes to roles/password/active status invalidate access according to a tested policy. The owner has declined additional MFA/passkey functionality; do not add enrollment, challenges, recovery-code screens or related dependencies. Preserve the required password-based staff login, session revocation, role checks and controlled recovery.

**Acceptance:** Disabled staff and revoked sessions fail protected reads/mutations immediately according to the documented policy. No self-escalation, last-admin lockout, reused reset token or open redirect. Browser back cannot retrieve cached private data after logout; production has no demo credentials.



## 8. Data model and source-of-truth contract

Extend the actual schema with additive migrations; the following are conceptual entities, not instructions to drop and recreate existing tables.

| Entity | Required responsibilities |
|---|---|
| Product | Stable ID, existing canonical slug, title, status, product tier, customer-facing collection, type/category, approved descriptions, product SEO, featured priority and publication metadata. |
| Product commercial/specification fields | Pricing mode, optional fixed/starting amount in integer minor units, currency, material/finish relations, dimensions with explicit units, optional weight, lead-time range, made-to-order/ready-to-ship flag, shipping class, commission/preservation capabilities and edition information. |
| Product tier detail | Typed collectible, preservation or gifting-specific attributes; preserve existing data during tier changes. Query-critical dimensions, categories and statuses should not be buried in unvalidated JSON. |
| Variant and customization schema | Allowed options, configured pricing adjustments, field types, required/visibility rules and schema version; no executable expressions from the CMS. |
| Collection, Material, Finish, Occasion | Stable shared SQL taxonomy, managed through authorized Studio forms. Editorial narrative references those same IDs without duplicating commercial fields or introducing a second storage owner. |
| MediaAsset | Stable ID, storage/access policy, Blob path/URL, type/dimensions/duration/bytes, checksum, alt/caption/focal metadata, source kind and protected source reference, asset version, rights/credit/approval, photograph/illustration/visualization and generated status, optional brief/parent-asset IDs, lifecycle and usage references. Derive what is possible from the file; do not invent unavailable provider metadata. |
| Inquiry | Random internal ID, separate human-readable reference, tier, customer contact, consent record/version, product/options/price snapshot, requirements, private asset IDs, idempotency key, status, owner and timestamps. |
| Inquiry activity | Internal notes, assignment, quotation and production milestones; access controlled and never returned by public catalogue APIs. |
| ImportJob | Owner-supplied file ID/checksum, schema version, status, row cursor, bounded batch size, counters, lease/lock, retry state, per-row errors, idempotency and timestamps. |
| Staff and AuditEvent | Existing user/session model, server-enforced role, actor/target/operation/time and redacted changes. Never store secrets or full sensitive payloads in audit logs. |
| Editorial document identity | Extend existing Page, BlogPost and matching content models with stable identity, content type, slug/locale, schema version, draft version and published-revision pointer as needed. These are conceptual responsibilities, not an instruction to add a competing generic table for every existing entity. |
| ContentRevision | Immutable snapshot at explicit save/checkpoint, review, approval, publish or restore; document identity, schema version, content hash/version, author, timestamp and change summary. Coalesce autosave checkpoints to control growth without losing review/published evidence. |
| ContentReference / asset usage | Validated edges from structured blocks/rich text to product, collection, page and media IDs; usage location, owning revision and public/draft state for dependency checks and deletion protection. |
| Review / publication audit | Exact submitted and approved revision IDs, actor, decision and timestamp; current public pointer and authorized unpublish/archive actions. A newer draft does not inherit approval automatically. |
| ScheduledPublication, when enabled | Approved revision ID, due time in UTC, requested timezone, status, lease, retries, idempotency and errors; no process-memory scheduling. |
| Content delivery/reconciliation task | Affected public routes/tags and retryable post-commit invalidation or Blob-cleanup state; SQL publication remains consistent if a later external side effect fails. |
| DemoDatasetBatch / demo provenance | Server-owned batch ID/version, deterministic fixture key, environment/dataset scope, seed checksum, current content checksum/edited state, lifecycle, retained references and operation cursors. Extend equivalent existing tables before adding parallel models. |
| Staff session/recovery state | Existing session strategy plus active-user/role/revocation version and single-use hashed setup/reset token state where needed; no invented demo login accounts. |
| Studio navigation preferences | Validated known module IDs, allowed ordering/visibility and scoped user preferences, distinct from permissions and content deletion. |

### Product invariants

`productTier` is mandatory. `priceType` is an explicit enum such as FIXED, STARTING_FROM or ON_REQUEST. ON_REQUEST does not require a fake numeric amount. Dimensions must carry units, and render using existing locale helpers. Store currency values without floating-point rounding errors. Validate metadata/media presence, image rights and tier-specific completeness before publishing.

Use stable IDs for relations. Changing a label must not break inquiries or URLs. Changing a slug must create a controlled redirect if public URLs already exist. Never expose draft or archived records through public APIs, search, sitemap, related-product queries or generated metadata.

Tier reclassification must show the owner what changes in the card, detail template, required fields and CTA. Preserve historical inquiries and old customization snapshots. Do not reinterpret prior requests using today's form schema.

### Content lifecycle, public snapshots and safe schema changes

Do not encode draft editing and public visibility as one ambiguous status. A document may have a published revision **and** a newer private working draft. Keep the published pointer independent from the draft/review state. The proposed draft path is DRAFT → IN_REVIEW → APPROVED; explicit authorized publication selects that exact immutable revision for public delivery. Editing after approval creates or updates an unapproved draft and invalidates any approval for that changed version. Unpublish clears public delivery through a deliberate audited action; archive is not silent deletion.

Public queries must select only approved published snapshots and permitted fields, never the mutable working-draft payload. Apply the same rule to related items, navigation, homepage configuration, SEO, search and sitemaps. Publication of referenced content is separate unless an explicitly designed release groups it. Pin or resolve related records through their own approved public version; never traverse a reference into a draft by accident.

Preserve the existing Tiptap/SQL content and editor format. Before a required schema or renderer change, export data, inventory counts/relations, stage an additive transformation, compare rendered content and verify rollback. No migration into an external content platform is required. Reuse current Page/Blog/FAQ models and write services rather than retaining two independently writable copies.

Use optimistic concurrency for draft writes: submit document ID, expected draft version and validated payload; atomically update only the expected version and increment it. On mismatch, return a conflict with authorized comparison information, not a silent last-write-wins overwrite. Serialize/coalesce saves from each editor, retain unsaved changes on failure and provide explicit conflict resolution. Publication and revision restoration must check the expected state too.

Publish inside a database transaction that validates authority, the exact version and all required references, records the revision/audit, and advances the public pointer. Perform targeted cache revalidation after commit through a retryable mechanism; a cache-refresh failure must be visible and recoverable rather than undoing history or falsely claiming public freshness. For unpublish/private-content transitions, use a fail-closed visibility boundary and test cached route, search, metadata and CDN behavior so a stale cached payload is not treated as authorized public content indefinitely. State the tested delivery/refresh behavior and any unavoidable propagation limits.

Use server-only read services for public products and content. Preview must be staff-authenticated by default, revision-scoped, explicitly exited and excluded from shared caches. Baseline same-application publication needs no external CMS webhook. Any later internal callback or scheduler endpoint still requires authentication, replay/idempotency protection and narrow validation. Missing references create actionable validation/dependency reports rather than broken published pages.

## 9. Studio functionality and permissions

Preserve working modules listed in the uploaded README: Dashboard, Products and Custom Form Builder, Categories, Portfolio, Blog, Media, Inquiries/WhatsApp Orders, Testimonials, FAQs, Subscribers, SEO, Site Settings, Pages, owner-supplied CSV/XLSX import/export, catalogue fill, staff roles and activity logs.

Add the requested three-tier merchandising and our custom editorial workspace while preserving the listed in-scope capabilities. Older module inventories do not override this revision's catalogue/media scope. A subscriber list is not a customer account system. A quoted or confirmed inquiry is an operational record, not an online payment module.

### Minimum role and identity rules

Keep the existing verified staff auth implementation. The app's admin can manage catalogue publication, owner-supplied imports, staff access and settings. Editors receive only the operations the backend actually permits; server checks must match the UI. Viewer access can be added only if the existing model and owner need justify it.

Use one application staff session and one server-enforced permission model; no second CMS membership is required. Keep current admin/editor roles and explicitly map capabilities such as content:readDraft, content:edit, content:review, content:publish, media:manage, catalogue:publish, inquiry:read and staff:manage. The default editor may draft/edit but cannot publish, manage staff or read private inquiry attachments unless separately authorized. The owner/admin can perform the approved operational actions. An optional reviewer/viewer role is a code-and-schema extension only when justified; do not add roles merely for decorative UI. Preview, restore, export and schedule execution must honor the same relevant permissions. Protect against self-escalation and loss of the last active administrator.

Every mutation needs authenticated identity, server-side authorization, input validation and appropriate anti-CSRF/origin protections. Route-level protection is defense in depth, not a replacement for checks inside Server Actions, route handlers, upload-token endpoints, exports and file-import operations. Use secure sessions, hashed passwords through the established auth library, rate limiting and safe token-based recovery. No default passwords, public sign-up or permanently enabled first-run setup endpoint.

Studio forms need field-level errors, unsaved-change handling, safe cancellation, explicit destructive-action confirmation, audit history and honest empty/error states. Final integrated dashboards use persisted data, not random values. R8-4 visual dashboards may aggregate the deterministic source fixtures under Section 23, with an explicit preview label. After integration, demo dashboards aggregate only persisted demo records and real dashboards exclude them. Metrics should be labelled as inquiries, qualified projects and manually confirmed orders rather than pretending WhatsApp clicks prove revenue.

### Custom CMS capability contract — proposed implementation, not existing functionality

The following expands the owner's “our own CMS, Sanity-type features” requirement into concrete custom behavior. It is not a claim of vendor feature parity. Map each capability to the existing code first; extend A09–A11 and A18 rather than introducing a second admin product.

| ID / capability | Custom behavior and placement | Acceptance evidence |
|---|---|---|
| CMS01 — Structured content navigation | A09: grouped content types, searchable/filterable lists, status/locale/author filters, accessible multi-pane editing and deep links. Keep Products, Media and Inquiries reachable within the same shell. | Refresh retains the selected document and filters; lists are permission-scoped and paginated; mobile layout is usable. |
| CMS02 — Schema-driven fields | A10: code-owned typed schemas for page, article, project story, collection narrative, process, FAQ, testimonial, navigation, SEO and settings. Required/conditional fields, stable IDs, defaults and schema versions control forms. | Unknown fields/types and invalid references fail server validation; labels/order can evolve without corrupting saved documents. |
| CMS03 — Rich-text editing | A10: extend current Tiptap with only audited headings, lists, links, quotes, images, captions and product references. Persist validated structured content in the existing compatible format. Use safe link protocols and shared renderers. | Existing articles render consistently; unsafe pasted content/scripts are rejected or sanitized; no paid cloud editor is necessary. |
| CMS04 — Controlled page sections | A10: approved section templates mapped to the W-series components; add, reorder, duplicate, hide and edit sections, with keyboard controls and per-section validation. No arbitrary canvas or code builder. | A nontechnical staff member changes a homepage section and previews it without deployment; new component types still require source review. |
| CMS05 — Shared media and references | A08/A10: use one Blob asset library for approved Drive/provided/generated/editorial assets, source and approval filters, relationship search, usage-specific alt/crop, product/collection links, “used in” reports and missing/archived-reference warnings. | In-use assets cannot be silently deleted; private uploads and unapproved assets cannot be selected for public delivery; required credits/visualization labels survive reuse; linked prices remain catalogue-owned. |
| CMS06 — Draft autosave and conflicts | A11: debounced/coalesced saves, last-saved revision/time, explicit Save Draft, unsaved-change warnings, recoverable errors and expected-version checks. | Rapid changes do not save out of order; two tabs cannot silently overwrite each other; failed save retains input and never reports Saved. |
| CMS07 — Live draft preview | A11: split preview with responsive sizes, shared frontend components, selected draft revision and visible refresh state. Baseline preview updates after a confirmed draft save; unsaved preview, if added, must be explicitly labelled. | Anonymous access fails; public content is unchanged while drafting; preview revision matches the editor's confirmed save. |
| CMS08 — Revisions and restore | A18: author/time history, meaningful field or block diff, immutable review/publish snapshots and restore-to-new-draft. Define retention limits and keep referenced published/approved snapshots. | Restore preserves the currently published version until explicit publication; old revisions are not edited in place. |
| CMS09 — Review and publication | A18/A15: submit, approve/reject, publish, unpublish and archive with revision-specific approvals, optional internal review notes and clear permissions. | Editing invalidates changed-version approval; unauthorized direct publish fails; publication records actor/revision and updates intended public pages. |
| CMS10 — Operational content tools | A09/A10/A14: duplicate-as-draft, safe slug changes/redirect checks, drafts/archived lists, SEO and social-preview fields, existing locale conventions and internal cross-content search. | Duplicate does not inherit published status; canonical/locale URLs remain valid; private documents do not appear in public search. |
| CMS11 — Scheduling, later subphase | A18: optional authorized schedule/cancel/reschedule UI backed by durable SQL jobs for a fixed approved revision, UTC due time and a tested runner. Show pending/running/failed/completed status. | Timezone handling, restart/retry, duplicate execution and approval changes are tested; scheduling is unavailable until infrastructure actually works. |
| CMS12 — Recovery, audit and export | A15/A17/A18: revision audit, structured content export with schema versions and media manifest, safe backup/restore runbooks, retention policy and dependency checks. Catalogue CSV/XLSX remains its own existing workflow. | Test restore into an isolated environment; exports omit unauthorized private data/secrets; Blob recovery is covered rather than assuming a database export contains media bytes. |

#### Editor layout and component boundaries

The proposed desktop arrangement is content structure → document list → editor, with an optional preview or inspector pane. On a normal-width screen, show only the panes needed for the current task; do not force every pane to remain open. Use a sticky action bar with document title, visibility state, draft save state, preview and permitted actions. Group Content, Media, SEO and Settings fields using the installed primitives. Provide field-linked validation errors, friendly empty states and visible text labels for icon actions. Keep custom cursors and cinematic motion off all CMS routes.

Subcomponents may be named `ContentTypeNavigator`, `ContentDocumentList`, `ContentFieldRenderer`, `RichTextEditor`, `PageSectionBuilder`, `AssetReferencePicker`, `ProductReferencePicker`, `DraftSaveStatus`, `DraftPreviewPane`, `RevisionHistoryDrawer` and `PublishActionBar`. These are proposed names to map to actual existing modules; they are not extra standalone applications or verified source paths. Record their props, dependencies, source references and tests in the component map.

#### Page-section registry contract

Start with approved hero, product selection, category discovery, material story, commission process, three-world introduction, project story, testimonial, FAQ, journal selection and contact sections. Each definition needs a stable type/version, display label, schema, initial values, matching public component, preview behavior, permitted variants, reference extraction and migration strategy. Use Section 18’s rich demo fixture content for isolated preview/testing. Keep real/public fields factual and owner-approved. All sample products, testimonials and stories retain server-owned demo provenance; their presence is not permission to publish them as real.

Retain the furniture-first hierarchy through compatible section defaults and explicit safeguards for required global sections. A user may edit content and reorder allowed sections without a deployment; this does not mean they can create arbitrary React components or change security rules through CMS fields. Keep the product customization form builder separate from the marketing page composer, while sharing validated field primitives where appropriate.

#### Autosave, collaboration and scheduling limits

Baseline collaboration is safe multi-user editing with conflict detection and audit, not Google-Docs-style simultaneous character editing. Do not claim real-time cursors, CRDT merging or presence unless a later explicit phase designs and tests the necessary infrastructure. Do not add a paid collaboration service or persistent WebSocket backend merely to match a reference product's appearance.

Autosave checkpoints should be debounced and bounded; retain explicit review, approval and publication snapshots. Do not persist customer-sensitive content to shared browser storage by default or imply full offline editing. On network loss, show the unsaved state and offer safe recovery within the current authenticated session.

Scheduling comes after reliable manual publication. Verify runner availability, interval, function limits, authentication and cost before enabling it. Persist and authorize each job; re-check the selected revision and relevant permissions at execution, fail clearly when approval is invalid, and never execute a different newer draft silently. A scheduler may run late: document actual timing behavior rather than guaranteeing second-precise publication. Manual publication remains functional without a scheduler.

## 10. Owner-managed catalogue and file imports

Real product records come from authorized staff entry or owner-supplied CSV/XLSX files. The owner also authorizes deterministic fictional demo fixtures under Section 18; that is not competitor import or real inventory. Keep the existing catalogue editor, custom form builder and import/export tools; do not create a parallel catalogue administration system.

### Manual product workflow

Create draft → choose LARGE, MEDIUM or SMALL → enter product details, specifications and pricing mode → attach approved media → configure applicable customization fields → validate completeness → preview → explicit authorized publication.

Staff choose and may change the product tier. Validate tier-specific fields, preserve existing values safely and show the resulting card, detail layout and enquiry CTA before publication. Product text, specifications and imagery must describe actual owner-offered products and remain subject to the existing approval and rights checks.

### Owner-supplied CSV/XLSX workflow

Upload an authorized file → validate file type and schema version → map supported fields → dry-run validation and duplicate checks → show per-row errors and proposed changes → confirm import → process bounded batches → review drafts → publish through the ordinary catalogue workflow.

Preserve the documented CSV/XLSX route and template conventions. Do not reintroduce removed Google Sheets synchronization. Use explicit product-tier mappings for legacy templates; do not infer that similarly named columns use the same enum. An import must not overwrite edited products without a clear update policy and confirmation. Ordinary file imports must not bypass server authorization, product validation or media-rights checks.

### Import reliability and safety

Validate uploaded files and enforce size/row limits. Do not execute spreadsheet formulas, macros or embedded instructions. Keep exports formula-injection-safe and omit secrets and unauthorized private data.

For imports large enough to need multiple requests, persist the file reference/checksum, row cursor, counters and per-row errors. Use bounded batches, idempotent row handling and a lease/lock where needed. Let staff resume or retry a failed batch without duplicate records. Report real processed, skipped, failed and pending counts; unknown totals remain explicitly indeterminate. Do not keep durable import state only in process memory.

### Design reference documentation

Keep the canonical `COMPETITOR.md` for manually recorded design inspiration, source links and component observations. Reference websites inform layout, typography and interaction choices only; they do not supply catalogue records, product descriptions or media. Record this distinction in the owner guide and active phase plans.

## 11. Drive-first images/video, prompt-created assets and licensed icons/vectors

### 11.1 Scope and sourcing order

The owner explicitly permits sourcing needed website and Studio visuals from the supplied Drive or creating them from prompts, and using prompt-created or online-discovered icons/vectors. Apply this to the existing site/component structure; do not introduce a different theme just to fit a found asset. **All needed assets** means every required visual slot has an appropriate resolved asset or an explicit blocker—not importing every Drive file or forcing a video onto every page.

| Priority | Images and video | Icons and vectors |
|---|---|---|
| 1 — Reuse | Inspect the exact owner-specified Google Drive folder and relevant subfolders, plus existing approved repository/Blob assets. Prefer authentic product and workshop material. | Reuse the approved logo/artwork, existing icon components and suitable Drive/library vectors. |
| 2 — Fill gaps | Create a precise reference-aware prompt in the separate asset-prompts MD. The owner generates the image/video and uploads it to Drive; then inspect and import the approved output. | Create original vector artwork from a prompt or use a matching licensed icon from an original source found through Google. Choose the route that preserves clarity and the existing visual language. |
| 3 — Resolve blockers | When source access, factual references, generation capability or permission is missing, retain the exact request and an honest preview fallback; do not claim generation happened. | Keep an existing compatible icon or simple original vector fallback when licensing or source quality is uncertain. |

Owner-led asset generation is **build-time production**, not a new in-CMS AI product. No specific generation provider is required, and Higgsfield remains excluded. Do not add permanent generation endpoints, paid subscriptions, Google search APIs or live Drive-sync infrastructure merely to deliver files. Prompt-based image/video creation is now allowed; older upload-only wording is superseded only to that extent. Catalogue scraping and hosted CMS integration remain outside scope.

**Current evidence for Revision 6:** the supplied logo board is attached as `91707.png` (1536 × 1536 raster). The Drive source previously discovered and its README re-read for this update are:

- Folder: `Rivya_All_Generated_Images`, ID `1wUG_qzou3CC1wjnTGeTDwP5Fh7Dab86l`.
- Folder URL: <https://drive.google.com/drive/folders/1wUG_qzou3CC1wjnTGeTDwP5Fh7Dab86l>.
- README: file ID `1RkCclKtmgNvpw_6opUYNCZPfQpdMfDCo`.
- Asset index: file ID `1cgkeziT6VjkrIZW81YmWbjA997YT2fDH`.
- The README reports **45 final AI concept images: 35 product portraits and 10 room scenes**, plus two superseded versions. It identifies `final/product-heroes/` and `final/room-scenes/` as the selected source directories.
- Reported native sizes are **1122 × 1402** for portraits and **1672 × 941** for scenes. The README explicitly says they are below the original brief’s production size targets and says the matching homepage video poster is not included.

These are source-reported inventory/dimension/classification facts, not a fresh pixel-level approval of every file. No new Drive image/video was imported, generated or published in this document update. Keep the imagery as **concept visualizations**, suitable for honest demo treatment; do not rename it real product photography. Do not count ten additional scenes as ten additional product identities. Do not infer that every missing video is absent from the entire Drive account; the reviewed collection is limited to this source.

The Drive README references an asset brief in `gondaliyabhavya70960/RivyaLivingArt`, while the earlier project README names `rivyalivingart2/RivyaLivingArt2.0`. Record this repository discrepancy. Codex must use the owner-selected active source workspace; a link in an asset README does not authorize switching repositories or adopting its older Cloudinary/provider instructions.

### 11.2 Google Drive intake and selection

Find the precise folder already supplied in the project/conversation before asking for it again. Use authorized access to that folder only; do not browse unrelated personal folders, change sharing, make files public, or upload changes back to Drive without an explicit request. A document naming a Drive asset is not proof that its bytes are accessible. If the exact source is missing, record `SOURCE_NOT_PROVIDED`; if known but unreadable, record `ACCESS_BLOCKED`. Do not conflate either with an empty folder.

Inventory relevant filenames, stable source IDs, file types, sizes, dimensions/durations where inspectable, and existing approval/provenance. Inspect images and representative video frames rather than deciding from filenames alone. Assess full-object visibility, sharpness, colour, orientation, useful crop, dark-background compatibility, product identity, typography-safe space, audio, privacy and consistency between angles. Exact duplicate checks may use checksums; visually similar variants still need selection review. Record the reason for selecting, replacing, excluding or leaving an asset unresolved.

Create a mapping from **actual route → existing component/export → media slot → selected asset/version → crop/poster/fallback**. Give primary furniture slots priority. Reuse authentic large-object images before creating generic resin imagery. Do not alter product shape, leg count, colour or finish just to match art direction. A file in the owner's Drive may still be a reference or third-party download; its presence is not a reuse-rights approval.

Read/import selected approved files through available authorized tooling. Keep originals untouched. Copy optimized derivatives into the existing media pipeline and store the original source reference as protected provenance. Final public pages use approved Blob media or reviewed small local functional assets, never a Drive sharing page, search thumbnail or expiring source-download URL. During R8-1–5, reviewed modest-size local visual derivatives or existing approved public Blob URLs may support the isolated visual preview without provisioning new storage; keep source mapping for the later media-library import. No visitor Google login is required; the deployed site should continue working when the build agent's Drive access ends. Standard owner uploads remain available for future management. No continuous Drive synchronization or Google Sheets synchronization is introduced.

### 11.3 Complete asset-slot plan

The following are suggested coverage targets, not fabricated inventory or mandatory quotas. Map each to actual existing routes and components during the audit; repeated use of a suitable asset is permitted.

| Surface / slot | Required visual direction | Preferred source and fallback |
|---|---|---|
| Home and collectible landing — W04 | One large resin furniture piece, spacious architectural context, desktop and mobile-safe crop, immediate poster; optional short film. | Authentic approved Drive/library material first; an approved clearly presented editorial concept may fill a gap. |
| Furniture discovery — W06/W07 | Tables, seating, consoles and installations; visible scale and uncluttered silhouettes. | Relevant real product assets; never fabricate an offered product just to complete category tiles. |
| Large product gallery — W11/W12 | Primary full object, alternate angle, material macro, contextual view, known dimensions/specification support. | Authentic images of that product; clearly labelled approved renders may supplement but cannot certify specifications. |
| Optional large-product video / W13 | Controlled object footage and poster; GLB/USDZ only when valid geometry actually exists. | Drive/library video/model first. Generated film needs review. An image or video is not a usable 3D/AR model. |
| Memory art — W08/W17 | Intimate preservation details, shapes and safe sample personalization. | Approved real work; concept samples use fictional/non-identifying placeholders and clear context. |
| Personal art and gifts — W09/W18 | Clean close-ups with legible variants and believable scale. | Actual products first; generated alternatives must not imply existing stock or exact variant fidelity. |
| Materials and process — W14 | Resin/wood macros and step illustrations. | Real workshop evidence first; generated abstractions or vectors remain illustrative, not documentary. |
| About, portfolio and testimonials — W21 | Genuine people, workshop and completed-project evidence. | Authentic approved assets only for factual claims; omit unsupported proof rather than invent people or commissions. |
| Journal, category banners and social previews — W22 | Cohesive editorial imagery; readable text rendered by the site. | Approved Drive imagery or original illustrative concepts; retain source and classification. |
| Commission flow and specification diagrams — W12/W16 | Object categories, dimension arrows, finish hints and process steps. | Original prompt-authored SVG using verified labels/measurements; otherwise schematic, with no invented numbers. |
| 404/error/loading, staff login and Studio empty states — W26/W29/A02/A16 | Lightweight abstract resin/furniture motif; no heavy video for operational screens. | Original prompt-authored vectors or reviewed licensed artwork; preserve functional text and navigation. |
| Shared controls and Studio actions — A16 | Consistent menu/search/filter/edit/save/preview/publish/history/media/security icons. | Current icon family, selected license-verified originals or original matching SVG. |

### 11.4 Prompt-based image and video production

For every unresolved slot, save a reusable brief before execution: slot ID, actual component/route, purpose, product/reference asset IDs, real versus concept status, composition, aspect ratio, dimensions, text-safe area, colours, lighting, allowed edits, constraints, output format, budget and fallback. Prompts use the confirmed brand **RivyaLivingArt**, not a superseded spelling. Do not bake headings/logos into generated photographs; render accessible brand text in the website.

The current handoff is **Codex/ChatGPT prepares the image/video prompt → owner generates → owner uploads to Drive → Codex inspects and imports**. Do not automatically generate images/video under the older permission. Verify input availability, privacy and output rights before recommending a reference-based brief. Keep this workflow in the separate `RivyaLivingArt_Asset_Generation_Prompts_v8.md` file. Image-generation capability does not establish video-generation capability. Do not submit personal customer photos/cards/plans to an external generator without permission for that specific use. Use only actually accessible reference inputs; never claim an unseen image was preserved or edited.

Record actual generated output IDs/files, provider/model/version when known, prompt version, parent reference IDs, review result and selected derivative. Unknown metadata stays unknown. Do not purchase credits, upgrade plans or send private data to an unapproved service. When generation cannot run, the deliverable is a saved executable brief and pending status—not a pretend generated asset. A static approved poster is an honest fallback for unavailable optional video.

Review identity/geometry, wood grain/resin appearance, physical plausibility, hands/people if present, text artefacts, scale, temporal consistency, unwanted logos and crop quality. Failed results stay rejected. Pure illustrations and concept renders need an appropriate public context or label; do not represent them as photos of manufactured inventory, delivered commissions, the real studio or customer proof. Use actual specifications, not generated pixels, to establish dimensions and materials.

#### Reusable prompt brief examples — companion file is authoritative

The six examples below are background patterns. The actual owner handoff, output names, missing-slot priorities and copy-ready prompts live in `RivyaLivingArt_Asset_Generation_Prompts_v8.md`. Keep its logo-derived bronze/forest palette and generation ownership current.

**P01 — Furniture-led editorial image**

```text
Create an editorial concept for RivyaLivingArt's large resin furniture collection.
Use the approved object reference only when actually attached and authorized.
Preserve its silhouette, proportions, supports, materials and finish; otherwise
create an original explicitly labelled design concept, not a claimed stock item.
Quiet architectural interior, obsidian/mineral surroundings, warm side light,
subtle resin translucency and visible wood grain, spacious negative space on
[TEXT_SAFE_SIDE], realistic perspective, no people, brand logos or baked-in text.
Compose for [ASPECT_RATIO] and a separate mobile-safe crop; keep the full object
visible. Avoid impossible structure, added legs, distorted geometry and neon.
```

**P02 — Short furniture film**

```text
Use the supplied approved object image as a reference only when the video tool
supports that input. Produce a proposed 5-8 second silent editorial clip with a
slow restrained camera move and gentle natural reflections. Preserve object
geometry, proportions, grain, colour and supports frame to frame. No morphing,
extra parts, text, logos, fast cuts or simulated manufacturing claims. Compose for
[ASPECT_RATIO]; identify a clean poster frame. A seamless loop is optional and
must be inspected, not assumed. Treat the result as a visualization until approved.
```

**P03 — Material macro / journal illustration**

```text
Create an original abstract close study of translucent resin meeting natural
wood, soft raking light, fine tactile detail, restrained reflections and a dark
mineral backdrop. Calm luxury editorial art direction; no text or logo. Match
[ASPECT_RATIO] and leave [TEXT_SAFE_AREA] uncluttered. This is a material concept,
not evidence of an actual RivyaLivingArt product, process or finish specification.
```

**P04 — Secondary-collection concept**

```text
Create an illustrative concept for [MEMORY_ART or PERSONAL_ART_AND_GIFTS] using
[APPROVED_PRODUCT_REFERENCE] only when supplied. Emphasize [PRESERVED_FLOWERS or
SMALL_TACTILE_OBJECT], tasteful restrained styling, soft light and clear scale.
Do not use real customer names, wedding dates, faces or documents. No invented
reviews or stock claims. Keep the approved product geometry unchanged; label any
new design as a concept. Output [ASPECT_RATIO] with mobile-safe framing, no lettering.
```

**P05 — Original functional icon**

```text
Author a simple original SVG icon for [ACTION_OR_OBJECT] that matches the existing
RivyaLivingArt icon system. Use viewBox="0 0 24 24", currentColor and the audited
stroke weight (fallback 1.75-2), rounded line caps/joins, consistent padding and
few clear vector paths. It must read at 16, 20 and 24 pixels on dark surfaces.
Do not embed raster images, scripts, event handlers, external URLs or foreignObject.
Return actual SVG geometry suitable for review, not a bitmap renamed as .svg.
Provide the intended accessible label separately; decorative uses are aria-hidden.
```

**P06 — Craft vector / dimensional schematic / empty state**

```text
Author an original lightweight SVG illustration of [RESIN_TABLE / WOOD_RESIN_LAYER /
FLOWER_PRESERVATION / EMPTY_MEDIA_LIBRARY / DIMENSION_GUIDE] for RivyaLivingArt.
Match the existing dark design tokens and restrained stroke language, with optional
logo-derived bronze accent controlled by CSS. Clear silhouette, generous negative space,
no third-party logos, raster embeds, scripts or remote resources. Dimension arrows
must have no invented values; labels come from verified product data in the UI.
Keep text outside the SVG where possible. Use a useful viewBox and simple paths.
```

Prompt-authored code is still untrusted until reviewed. A raster illustration from an image tool is valid as a raster illustration, but cannot be called a scalable vector without actual vector geometry. If conversion/redrawing is needed, record it and inspect the resulting paths.

### 11.5 Icons and vectors found online through Google

Use Google for discovery, then open the original creator/library page and verify the exact asset's license and reuse conditions. Do not treat a search result, thumbnail, “free download” label or presence in an image search as permission. Google itself advises checking the source license and exact reuse terms: [Google Search Help — images you can use and share](https://support.google.com/websearch/answer/29508?hl=en). Record original URL, creator, asset/version, license URL, permitted use, required notices/credits, restrictions and check date before adoption.

Prefer the existing installed icon family. [Lucide](https://lucide.dev/license) publishes an ISC license and separate MIT notices for listed Feather-derived icons; retain applicable notices. [Google Material Symbols](https://developers.google.com/fonts/docs/material_symbols) provides individual SVG/PNG assets under Apache 2.0. These are candidate sources, not a requirement to install both families. Verify selected assets at adoption and retain the applicable license/notice material. Avoid an entire font or library payload for a handful of symbols.

Use original prompt-authored artwork when source licensing is unknown or a library does not fit the style. Exclude personal-use-only or otherwise incompatible assets from this commercial project. Do not remove watermarks or use competitor product photos, team photos, logos or customer proof. Google's role here is discovery for icons/vectors; it is not a substitute catalogue supplier. Download only rights-cleared assets from their source, normalize compatible appearance, and store them through the reviewed local-code or Blob workflow—no thumbnail hotlinking.

### 11.6 Custom CMS, asset records and Markdown continuity

Use A08 and CMS05 for all editable media, without adding a second asset-management application. Staff need source/type filters, upload and preview, selected/approved/rejected status, alt/caption/focal controls, product/section assignments, replacement history and “used in” references. Public-ready approval and content publication are separate actions. Changing a source file must not silently change a live product: create a version, review it, then update the content reference deliberately.

The asset manifest should contain stable local asset/slot IDs; actual Drive/source references where available; source kind; actual generation brief/output references where applicable; product tier and route/component placement; dimensions/duration/bytes/format; original checksum and derivative relation; alt/caption/crop/poster; real/concept classification; rights/credit/consent status; approval actor/time; storage access; actual output path/Blob reference; fallback and processing state. Keep private source links, full prompts containing sensitive context, tokens and customer details out of public payloads. Maintain public credits deliberately when required.

Reuse canonical `docs/images.md` and existing manifest conventions. If missing, propose an indexed `docs/assets/manifest.json`, `docs/assets/prompts.md` and `docs/assets/licenses.md` rather than duplicate root files. Store the reusable prompt library, candidate/rejection reasons, source-rights checks, output mappings, and next unresolved slot. Suggested states are SOURCE_NOT_PROVIDED, ACCESS_BLOCKED, NEEDS_BRIEF, READY_TO_PRODUCE, PRODUCED, IN_REVIEW, APPROVED, REJECTED and MAPPED; map these to existing conventions instead of adding unnecessary database enums. A prompt alone never qualifies as PRODUCED.

At each checkpoint record actual assets reused/generated/imported, remaining blocked slots, approval state and output mapping. Resuming a coding session must not regenerate approved files, redownload duplicates or overwrite selected versions without a reason. Never place source credentials or private customer samples in Markdown, repository fixtures or logs.

### 11.7 Storage, accessibility and delivery

Keep original masters separate from delivery derivatives. Serve approved photography/video/editorial artwork through the existing Blob/media pipeline; keep small functional icons and critical 404/login decorations in the reviewed local component/static-asset structure. Structured CMS fields select vetted icon keys or approved asset IDs, not arbitrary executable SVG or remote URLs.

Use responsive image sizes and explicit dimensions/crops; retain truthful colours and physical features. Use the current Next Image pipeline and narrow allowed remote patterns. Do not base64-embed large files or put image/video bytes in SQL. For hero video, retain the README's approximately 6 MB ceiling as a target, not a quality guarantee; use suitable mobile versions, a lightweight poster, explicit playback controls and a static reduced-motion fallback. Keep content usable without video/3D. Meaningful speech/instructions need captions or a transcript; music/audio must have its own permitted use. No heavy full-video transcoding inside a standard short-lived request.

Use the installed SDK's authorized upload flow and validate type/content, size and counts. Strip unnecessary private metadata from public derivatives where appropriate. SVGs require a reviewed allowlist/sanitization process, not regex-only filtering: no scripts, event handlers, remote loads or unsafe embedded content. Icons need visible or accessible labels where meaningful; decorative vectors remain hidden from assistive technology. Validate keyboard, touch, contrast and small-size readability.

Public Blob is only for approved marketing media. Customer references—including wedding photos, room plans and contact-bearing documents—stay private and are excluded from public media pickers. Finding a private image in Drive does not authorize publication or third-party generation. Apply the existing consent, scoped access, retention, deletion and backup rules. Keep the draft/public boundary and in-use deletion protection intact.

### 11.8 Asset completion checks

Every required visual slot is mapped to an accessible approved asset, an acceptable designed fallback, or a specific unresolved blocker. Source review, generated output review, rights/consent and public classification are recorded. Test broken media, denied source access, duplicate import, unsafe SVG, rejected publication, reduced motion and mobile crops. Confirm public routes have no live Drive/search/generator dependency and no leaked source tokens or private file URLs. Do not report the media work complete merely because prompts or empty media fields exist.

## 12. Motion, interaction, accessibility and performance contract

Motion is a usability layer, not the product. Use the current motion provider where possible, clean up observers/timelines on unmount and route changes, and avoid duplicate RAF loops or multiple smooth-scroll providers. Keep a fully usable static experience.

| Interaction | Requirement |
|---|---|
| Scroll | Normal document scrolling is the baseline. Existing Lenis may enhance eligible public desktop routes; disable or bypass it for Studio, nested scroll areas, reduced motion and problematic devices. Restore anchor/focus/back-navigation behavior. |
| Pointer | Native pointer remains usable. A subtle decorative gallery follower is optional and never enabled for forms, touch or Studio. |
| Text selection | Theme native selection colours with tested contrast. Never disable selection globally. |
| Buttons | Visible hover, focus-visible, active, loading, disabled and success/error states. Proposed timing: 120–180 ms for simple micro-interactions, with reduced-motion alternatives. |
| Dropdowns/dialogs | Proper keyboard, focus, Escape and scroll-lock behavior. Use established primitives; transitions must not delay interaction. |
| Editorial reveals | Proposed 250–450 ms restrained opacity/position changes on a few sections; no permanent hidden initial text or “animate everything” rule. |
| Loading bar | Real indeterminate navigation state, not a fictitious percentage or fixed waiting screen. |
| Upload progress | Actual transferred/total bytes, with a separate validation/processing state. |
| File-import progress | Durable row-processing counters; unknown totals remain explicitly indeterminate. |
| Form step progress | Completed valid steps relative to applicable steps; it must not be confused with order completion. |
| Video | Muted/playsInline when used as ambient media, pause controls and static fallback; no mandatory autoplay. |
| Reduced motion | Remove parallax, cursor follow, smooth scrolling, animated counters and decorative transitions where necessary; content and function remain identical. |
| Studio | Minimal movement, standard scrolling, legible focus and dense forms/tables. No landing-page animation imports. |

Set **proposed acceptance targets**, not unsupported guarantees: field p75 LCP ≤2.5 seconds, INP ≤200 ms and CLS ≤0.1 when sufficient real traffic exists. Use agreed mobile lab profiles before launch; do not describe lab results as field measurements. Check slow devices and realistic networks, image budgets, bundle analyzer output and the public-versus-Studio chunk split. No full-screen WebGL in the baseline; no product model download on initial home-page load.

Target WCAG 2.2 AA for implemented surfaces and test it; do not claim certification without a proper audit. Check keyboard-only flows, readable error messages, labels, headings, contrast, reduced motion, zoom and touch targets. Use meaningful alt text and decorative `aria-hidden` vectors. Never use colour or animation alone to communicate status.

Use real public product information for structured data. Price-on-request products must not receive fabricated zero-price offers or fake review aggregates. Keep metadata/canonicals consistent, preserve approved locale URLs, generate only published sitemap entries, noindex private/preview routes and block private data at the server rather than relying on robots/noindex. Test social previews and redirect maps after branding changes.

## 13. Markdown documentation and session continuity

The owner requires phase-wise work and durable Markdown memory. Follow the repository's current document hierarchy instead of scattering duplicate root files.

| Requested documentation area | Canonical handling |
|---|---|
| Codex / engineering instructions | Keep effective `AGENTS.md` concise with links to current specs and actual verification commands; explicitly retain/read `CLAUDE.md` as the existing engineering guide. No competing claud.md and no wholesale master-spec paste. |
| Project overview | Maintain existing `README.md`, with business model, architecture and links to current guidance. |
| Current context / session state | Use the latest `PROJECT_STATE.md` checkpoint plus `CLAUDE.md`. The upload marks `CONTEXT.md` superseded; preserve it as history rather than resurrecting it as authority. |
| Design | Update current `REDESIGN.md` with the explicit fully-dark/furniture-first decision; preserve dated records. |
| Comparator / competitor | Maintain existing `COMPETITOR.md` for design inspiration only; it is not a catalogue data source. |
| CMS | Reuse the existing CMS architecture guide or create `docs/cms.md` if genuinely absent, covering custom SQL models, content/section schemas, editor/renderer contracts, draft/public boundaries, autosave/conflicts, versions, permissions, media references, preview, publication, retention and recovery. |
| Admin | Extend existing `ADMIN_GUIDE.md` rather than duplicating it at the root. |
| Studio architecture | Reuse a matching guide or create `docs/studio.md`, with route map, role checks, modules and operational recovery. |
| Images / video / vectors | Maintain `docs/images.md` with the Drive-first source policy, route/component slot map, prompt-production briefs, original/licensed provenance, approvals, budgets, privacy, uploads and unresolved requests. Reuse existing manifests; add indexed `docs/assets/manifest.json`, `docs/assets/prompts.md` and `docs/assets/licenses.md` only if absent and permitted. |
| Environment / staff access | Maintain `docs/environment.md`, the matching auth runbook and `.env.example`; include Section 19’s environment matrix, presence-only health checks, bootstrap/reset/revocation and safe deployment steps. Names/descriptions only, never secrets. |
| Demo fixtures | Maintain indexed `docs/demo-content.md` and existing fixture/seed directories; record batch IDs, counts, edit/retain policy, cleanup dependencies, tests and production exclusion. |
| Current scope / exclusions | Record the owner’s S01–S04 rejection in the existing active guidance and newest checkpoint. If a historical improvements register exists, append the rejection there without rewriting history. Do not create a new proposal queue, optional-features companion or implementation tasks for these items. |
| Components | Reuse or create `docs/component-map.md`, containing actual existing paths, exports, replacement decisions, source links, dependencies and test results. |
| Dependencies / costs | Reuse or create a version-and-cost decision record under `docs/`, noting verification date, stable version, licenses, included allowances and approval-required costs. |
| Phases | Use existing `docs/plan/` conventions; index the R8 frontend-first plan and historical-phase crosswalk. Track visual and backend milestones separately. |
| Git / deployment handoff | Maintain the audited work branch/remote, prior verified push SHA and V1/V2 checklists through the existing checkpoint/deployment docs. Follow the new Git and Vercel companions; no secret or unverified deployment URLs. |
| Release history | Add new dated entries to `CHANGELOG.md` and new checkpoints to `PROJECT_STATE.md`; do not rewrite older entries. |
| Setup/deploy/security/backup | Maintain existing `INSTALL.md`, `DEPLOYMENT.md`, `BACKUP_GUIDE.md`, `SEO_GUIDE.md`, `CONTENT_GUIDE.md` and `WHATSAPP_ORDER_GUIDE.md` where affected. |
| Documentation index | Update existing `docs/README.md` and any repository map test. Avoid new root documents unless the actual repository rules permit and index them. |

The upload says a test at `src/lib/repo-map.test.ts` validates the root map. Verify whether it exists in the actual source; if it does, keep it passing. Do not move/delete documents merely to make the tree tidier, and do not change historical references to disguise a move.

### Environment inventory

Derive required names from the existing code and installed providers, not this list alone. Inventory database runtime/migration URLs, auth/session secrets, public app origin, Blob store IDs and selected credential mode, upload/preview secrets and optional mail/scheduler configuration. The custom CMS uses those existing application resources and the staff session; it needs no hosted-CMS project, dataset or API tokens. Do not add a second CMS credential set. Record any optional internal publishing-runner secret by name only. Drive intake by the build agent and image/video generation performed by the owner do not create a runtime environment requirement. Keep any actually needed local source/provider credential outside the public app and Markdown; do not add a Drive/search/generation credential set without an implemented, approved need.

Keep development, preview and production resources isolated. Preview must not write production products, send real notifications or run production imports by default. Protect private previews. Record setup/rotation instructions without copying `.env.local`, long-lived tokens, private customer samples or passwords into Markdown or logs.

### End-of-slice checkpoint template

```markdown
## Checkpoint — YYYY-MM-DD HH:mm Asia/Kolkata
R8 phase / slice / execution stage:
Visual state / backend state:
Last verified pushed commit and safe remote / work branch:
Current slice commit/push: pending until actually verified
Branch / working-tree state:
Goal and scope:
Completed in this slice:
Actual files and exports changed:
Schema/content migrations run and result:
Commands executed and observed results:
Screenshots/manual checks completed:
Known pre-existing failures versus new failures:
Unfinished work and blockers:
Environment variables required (names only):
External assets/permissions still needed:
Asset slots resolved; source/brief/output IDs; owner-returned files and blockers:
Demo batch/version; current counts; dataset/environment scope; cleanup impact:
Current scope / exclusions checked (S01–S04 remain excluded):
Relevant canonical docs updated:
Safe rollback/recovery notes:
V1/V2 gate status, exact blockers and owner action:
Next smallest task:
Exact resume instruction:
```

Write a checkpoint after each meaningful atomic slice, not only when the session is nearly exhausted. Do not start a large migration as the final action before a context limit. Preserve the user's uncommitted changes; do not force reset, rewrite commits or silently stash work. A completed slice must have its required checks and docs, a scoped commit and a verified safe push; distinguish COMMITTED—PUSH BLOCKED when remote publication is unavailable. External blockers should not stop unrelated safe work, but never report remote completion without evidence. Follow the Git companion for exact staging, verification and permissions.

## 14. Phase-wise delivery plan — frontend first

This active order supersedes Revision 7’s backend-first sequence. Preserve historical dated phase numbers; use `R8-0`–`R8-11` in new checkpoints. The frontend plan companion supplies slice details and the crosswalk. Commit and verify push after every completed tested slice, not only at phase ends.

| Phase | Focus | Deliverables | Exit evidence |
|---|---|---|---|
| R8-0 | Source, Git and delivery audit | Inspect the actual repository, current branch/remotes, effective instructions, dependency/route/component tree, existing backend boundaries, logo and available media. Verify safe push target and deployment triggers. Define frontend contracts and map the old phase plan to R8. | Audited paths and 52-component map; baseline check results; safe branch/remote; mock/live boundary plan; minimal frontend build path; no database migration. |
| R8-1 | Design system and frontend foundation | Apply logo-derived dark tokens, typography, navigation primitives, responsive grids, shared layout, typed view models and deterministic visual fixtures. Reuse the existing app; do not initialize a replacement. | A real rendered header/hero foundation and Studio shell primitive; fixture-only build path works without database/auth/Blob secrets; no production security bypass. |
| R8-2 | Primary furniture website | Build home, /collectible-design, category discovery, large-product cards/detail/gallery/specification presentation, materials and commission CTA. Use suitable approved media and honest concept labels. | Desktop/mobile screenshots; navigable large-art journey; real component code rather than wireframes; URL/filter states and static media fallbacks work. |
| R8-3 | Remaining website and form visuals | Build memory/personal worlds, tier-aware details, commission/preservation/personalization wizard UI, journal/articles, FAQ, about/process/contact/search, retained service pages and all loading/error/404/receipt states. | Complete public route/state inventory; typed fixture-driven forms with local validation and clearly simulated completion; full planned demo text coverage; no real submissions/uploads/messages. |
| R8-4 | Studio frontend and login visuals | Build the full Studio visual experience using the same eventual components: dashboard, products/editors, custom CMS screens, media, enquiries/statuses, imports, demo manager, navigation settings, staff/session and environment panels. Preview login/recovery states without authenticating users. | All 22 Studio specifications have usable visual states; CMS fields/section controls and local demo interactions work; simulations labelled; real /studio authorization unchanged; no fake operational success. |
| R8-5 | Frontend QA and visual-preview handoff | Finish responsive and motion polish, use real screenshots, check keyboard/reduced motion, audit media/links, run fixture-mode type/lint/tests/build, prepare exact protected Vercel Preview settings, commit and verify push. | Gate V1: frontend visual preview ready, not a complete backend. Tell owner to deploy/review the exact branch/SHA; stop before new backend implementation until visual review or explicit instruction to continue. |
| R8-6 | Backend foundation and real staff access | After the visual gate, add audited additive SQL/Prisma changes, environment validation, repository adapters, public/private Blob workflow, normal staff login/setup/recovery/session revocation and server permissions. Preserve working backend services. | Migration and isolation tests; real login and protected reads/mutations; working storage controls; no default credentials; approved frontend unchanged. |
| R8-7 | Custom CMS backend | Connect structured editors, typed content/section schemas, Tiptap, media/relation pickers, conflict-safe saves, private draft preview, revision history, role-based review/publication and delivery refresh. | R8-7A–7D pass with real persistence/authorization; draft/public separation, stale version/conflict/restore/revalidation tests; scheduling remains conditional R8-7E. |
| R8-8 | Catalogue, enquiry and operations integration | Connect actual product queries, filters, search, taxonomy, customization, saved request snapshots, private uploads, save-before-WhatsApp handoff, staff pipeline/notes and safe configuration diagnostics. | Real end-to-end journeys in an isolated environment; submit failure/double-submit/privacy/blocked-handoff tests; no demo external messaging; UI remains consistent with reviewed visuals. |
| R8-9 | Persistent demo data and owner imports | Reuse frontend fixture IDs/content for deterministic database seeding. Complete 120 products / 36 blog drafts / 42 FAQs / 24 fictional testimonials / 40+ status scenarios, all in-scope Studio data, CSV/XLSX import/export and manual demo cleanup. | Exact seed/status report; no duplicates; edit/retain/tombstone protection; single/type/batch cleanup preserves real data/media/accounts; actual imports resume safely. |
| R8-10 | Full integration and release QA | Verify all former simulated actions against real adapters, responsive visual parity, authorization, demo/live separation, assets, accessibility/performance/SEO and recovery. Test release-candidate build in isolated integration preview. | Actual tests and screenshots; production bundle cannot enable visual bypass/fixture fallback; asset/content gaps explicit; preview-to-live resource map, migration and rollback runbook ready. |
| R8-11 | Owner-led full Vercel deployment handoff | Finish environment checklist, deployment commands/settings, budget/plan checks, owner bootstrap runbook, live content readiness, backup/restore notes and smoke tests. Commit/push final release candidate; request owner deployment, not automatic production release. | Gate V2: ready for full deployment when evidence supports it; otherwise report exact blocker. Owner deploys approved SHA; verify returned deployment and smoke tests before saying DEPLOYED / VERIFIED. |

**V1:** R8-5 is a protected frontend visual-review milestone; no claim of a completed backend. **V2:** R8-11 is the full-deployment readiness milestone. The owner deploys; production changes need explicit authorization. Pause after V1 for visual review or an explicit continue instruction.

Assets are incremental: R8-0 inventories, R8-1–4 use reviewed local/approved media and issue prompts, R8-5 closes visual blockers, R8-6 introduces actual storage services, and R8-10 checks all final mappings. Do not postpone every visual asset until the backend is done.

### R8-7 custom-CMS integration gates

The previous Phase 4A–4E CMS capabilities now execute as R8-7A–7E after their frontend was built in R8-4: preserve/structure; editing/assets/autosave; preview/publication; history/recovery; and conditional supported scheduling. The detailed acceptance requirements are retained in Sections 8–9 and the frontend-first plan. Manual publication does not depend on activating scheduling.

### Visual versus final acceptance

At V1, component rendering, navigation, local validation/simulation, fixtures, responsive behavior, privacy isolation and build evidence must pass. At V2, the following final integration scenarios must pass against actual services. A simulated UI does not satisfy a real persistence or authorization scenario.

### Required acceptance scenarios

A large furniture object renders the collectible card/detail and opens the commission flow; a memory item renders its preservation options; a small gift renders quick personalization. An administrator can reclassify a product without a code change, with validation and no silent loss. A fixed/starting/request-only price is displayed correctly in every relevant place.

A valid inquiry is saved exactly once before handoff; a failed write cannot display successful submission. A blocked WhatsApp navigation leaves a usable retry/copy/contact fallback. Historical request details stay intact after product updates. Private files cannot be read by unauthenticated users or exposed by public search, metadata, exports or predictable receipt URLs.

A CMS draft stays private while the previous published revision remains visible. Editing an approved draft requires approval of its new version. Authorized publication updates the correct public page; unauthorized or stale-version publication fails. Two editing sessions produce a visible conflict instead of silent lost changes. Restore creates a new draft without changing the public version. Missing/removed media and product references produce actionable dependency warnings. The same staff session and server-enforced capabilities protect content, product and media operations. No external CMS credentials, SDK or hosted editing route is required. Exercise cached public routes after unpublish and confirm delivery visibility behavior.

An owner-supplied CSV/XLSX import can be interrupted and resumed without duplicate products. Invalid rows produce actionable errors. Import cannot silently overwrite owner edits, bypass authorization or publish incomplete/unapproved products. Exports respect access controls and handle spreadsheet formula injection safely.

Media acceptance: actual source/output files map to the intended routes/components; prompt briefs are not mistaken for generated files; required rights/credits and concept labels persist; private Drive/customer files stay private. Public routes keep working without a Drive or generation session.

All essential public and Studio routes have useful loading/error/empty states. Forms, menus and dialogs work with keyboard and touch. Reduced motion retains all content and functionality. A page remains usable without its decorative effects, optional video or 3D viewer. No public customer login, online checkout or payment gateway is introduced.

## 15. Information still needed before implementation or launch

Do not ask again for the brand, phone, WhatsApp, email or location link already supplied. Create a checklist with status, owner, affected phase and safe temporary handling for missing inputs.

| Input | Why it is needed | Safe handling while missing |
|---|---|---|
| Actual source repository/branch and current deployment | Verify compatibility, existing exports, scripts, routes and production constraints. | Audit/planning only; do not invent source files or certify replacements. |
| Production logo masters and legal display details | The brand board `91707.png` is now supplied; use it for palette and visual reference. Transparent/SVG logo masters and legal particulars are still separate inputs. | Do not ask for the board again. Use a text lockup or existing approved logo while awaiting clean masters; never ship the whole board as the header or fabricate registration details. |
| Real catalogue and priorities | Needed for eventual live sales claims, not for the authorized synthetic demo build. | Build Section 18’s demo pack now in an isolated scope; live publication still needs actual product facts and approved imagery. |
| Drive asset access and returned gap assets | The exact concept-image collection and metadata are identified in Section 11. Reconfirm access in the Codex environment, review pixels and match slots. | Do not ask for an already known folder link. Report only any actual access gap; use owner-returned files or approved fallbacks, and keep AI concepts labelled. |
| Available generation capability and approved asset references; license/credit evidence for online icons/vectors | Produce specific missing visuals and clear outputs for commercial publication. | Save executable briefs and pending status when a tool/reference is unavailable; preserve authentic-product requirements and do not purchase credits without approval. |
| Manufacturing, shipping and installation policies | Large-piece feasibility, service areas, site access, charges and lead times. | Enquiry-first wording; do not guarantee unavailable details. |
| Preservation process and material-receipt rules | Instructions for sentimental physical objects. | Keep unsupplied instructions unpublished and route to consultation. |
| Existing custom-CMS source/schema/export plus approval of content types, role powers and history retention | Extend real editors safely and define the owner workflow without losing data. | Audit documented defaults; preserve content and routes; keep optional scheduling disabled until its runner is approved and tested. |
| Vercel project, eligible commercial plan, Neon/Blob integration and budget approval | Deployment, storage, isolated environments and spend management. | Local/non-production development within permitted terms; do not activate paid upgrades unapproved. |
| Staff roles and recovery channel | Needed for R8-6 real auth, not to draw login/Studio visuals. | R8-4 uses protected labelled UI preview; real staff setup/reset remains blocked until configured, with no default credentials or pretend delivery. |
| Verified about/process/testimonials/portfolio content | Trust content without invented proof. | Hide unsupported proof blocks; maintain drafts for review. |
| Privacy/consent, retention, deletion and policy wording | Customer photos, plans, phone numbers and private references. | Conservative private storage/minimal collection; launch review required. |
| Canonical domain, locales, business address/hours and social links | Correct SEO and contact information. | Preserve existing configured domain/locales; use supplied map link without inference. |

## 16. Reference register and research limits

**Uploaded basis:** U1 — `Pasted text.txt`, “RIVYA LIVING ART — THREE-TIER PRODUCT ARCHITECTURE”; U2 — `Pasted markdown (2)(3).md`, “Rivya Living Art — Luxury Resin Art & 3D Printing Platform.” The current brief confirms the exact public brand spelling **RivyaLivingArt**, requires a fully dark design and preserves the explicit WhatsApp/staff-only rules. Revision 2 limited catalogue inputs to staff entry and owner-supplied files, and media handling to existing approved files and standard uploads. Revision 3 implements the owner's explicit custom-CMS decision using the README's existing Tiptap/SQL foundation and replaces the earlier hosted-CMS proposal. Revision 4 corrects the brand name and active document filenames to RivyaLivingArt, removes the superseded rebrand-approval requirement and leaves the custom CMS and other then-current scope decisions unchanged. Revision 5 adds the owner's latest Drive-first images/video, prompt-based asset production and Google-discovered licensed icons/vectors workflow. That change permits generic build-time generation without restoring Higgsfield, product scraping or a hosted CMS. Revision 6 adds the owner’s explicit synthetic-demo permission, full staff/environment management, Codex workflow and supplied-logo palette. It changes image/video production to owner generation from the separate prompt file, followed by Drive intake. It does not restore excluded integrations. Revision 7 records the owner’s rejection of S01–S04, removes the pending-improvements workflow from the active pack and makes those four additions explicit exclusions. It does not change the approved baseline, fixture counts, logo palette, component register, media handoff or phase numbering. Real product catalogue inputs remain owner-managed; demo fixtures are separately governed by Section 18. The detailed CMS capabilities, version/publication safeguards and private-media rules are proposed implementation requirements, not verified existing functionality or a claim of reference-product feature parity. These owner decisions supersede broader or conflicting earlier instructions.

**Reference links and checks recorded in the original specification on 20 September 2026:** Retained where relevant to the unchanged infrastructure/design requirements, with hosted-CMS references removed. Except for the references separately checked for later revisions below, these earlier sources were not re-verified in this update; verify current versions, plans and APIs during implementation. Newly specified custom CMS behavior is an engineering requirement derived from the owner's change, not a report of an external service's features.

- [Vercel Hobby commercial-use restriction](https://vercel.com/docs/plans/hobby)
- [Vercel pricing](https://vercel.com/pricing)
- [Postgres on Vercel / Marketplace providers](https://vercel.com/docs/postgres)
- [Vercel native integrations](https://vercel.com/docs/integrations/install-an-integration/product-integration)
- [Vercel Blob](https://vercel.com/docs/vercel-blob)
- [Vercel Blob private storage](https://vercel.com/docs/vercel-blob/private-storage)
- [Vercel Blob SDK and authorization/upload options](https://vercel.com/docs/vercel-blob/using-blob-sdk)
- [Next.js release blog](https://nextjs.org/blog)
- [Next.js authentication guidance](https://nextjs.org/docs/app/guides/authentication)
- [Core Web Vitals definitions and thresholds](https://web.dev/articles/vitals)
- [WCAG 2.2 accessibility standard](https://www.w3.org/TR/WCAG22/)
- [shadcn component index](https://ui.shadcn.com/docs/components)
- [GSAP](https://gsap.com/pricing/)
- [Motion for React](https://motion.dev/docs/react)
- [Lenis](https://lenis.dev/)
- [React Bits repository and license declaration](https://github.com/DavidHDev/react-bits)
- [Lucide license](https://lucide.dev/license)
- [Google model-viewer](https://modelviewer.dev/)
- [OWASP file-upload guidance](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)

**Asset-source guidance checked for Revision 5 on 21 September 2026:** [Google Search usage-rights guidance](https://support.google.com/websearch/answer/29508?hl=en), [Lucide license and inherited notices](https://lucide.dev/license), and [Google Material Symbols formats/license](https://developers.google.com/fonts/docs/material_symbols). These checks support source-selection rules, not approval of an unidentified asset. No individual online graphic, Drive file, model or generation output has been adopted in this document-only update.

The six design sites and eleven requested component-library links appear in their respective sections. Some JavaScript-heavy catalogues yielded little retrievable content; unverified entries are explicitly marked rather than assigned fabricated compatibility or licensing claims. Re-check versions, prices, licenses, quotas and available features at implementation time. This is a document-only specification: application source files were not modified, provider accounts were not connected and no deployment was performed.

### Revision 6 source checks and limitations — 21 September 2026

- [Official Codex AGENTS.md guidance](https://developers.openai.com/codex/guides/agents-md) (redirected by the official site to ChatGPT Learn): use concise effective instructions and explicit referenced files; do not assume a very large master is automatically loaded in full.
- [Official Codex cloud environments](https://developers.openai.com/codex/cloud/environments): setup/agent phases and their secret availability are separate. Recheck the current environment’s behavior at setup; never work around isolation by copying secrets into artifacts.
- [Vercel environment variables](https://vercel.com/docs/environment-variables), [sensitive variables](https://vercel.com/docs/environment-variables/sensitive-environment-variables), [Deployment Protection](https://vercel.com/docs/deployment-protection), [Hobby](https://vercel.com/docs/plans/hobby), and [fair use](https://vercel.com/docs/limits/fair-use-guidelines): support the environment, protection and commercial-use boundaries. Variable changes require a new deployment to apply; deployment protection is not app staff authorization.
- [Next.js authentication](https://nextjs.org/docs/app/guides/authentication): protected data access and mutation checks belong on the server, not just in the sidebar or layout.
- [GSAP Standard No Charge License](https://gsap.com/community/standard-license/): review the actual selected license and restrictions; free use is not the same as a blanket MIT/open-source declaration.
- [Awwwards reference directory](https://www.awwwards.com/websites/) could not be retrieved reliably in this review. An official [Self Aware SOTD entry](https://www.awwwards.com/sites/self-aware) exposes design/usability/creativity/content criteria and technical evaluation categories. That supports a multidimensional quality target, not a claim that current winners were exhaustively audited or that this project will win. Retain the six earlier design references and require actual browser review during implementation.
- Owner-supplied logo board: `91707.png`, 1536 × 1536. Pixel sampling supports only an approximate web palette; no original SVG/swatches or font ownership is inferred.
- Drive README, re-read through the connected source: <https://drive.google.com/file/d/1RkCclKtmgNvpw_6opUYNCZPfQpdMfDCo/view>. Its inventory/classification is recorded in Section 11. Source metadata was read; no bulk visual approval or media import took place.

### Revision 8 change and research boundary — 21 September 2026

The frontend-first order, incremental verified Git pushes and owner-led preview/full-deployment handoffs are the owner’s latest instructions. They supersede only conflicting execution order and mock-preview restrictions, not the final custom-CMS/Studio/security/business requirements. No application repository or Vercel project was modified or newly audited while preparing this document revision.

Official Git remote/push/ref verification, Vercel Git/Preview/protection/environment behavior and Codex instruction/cloud-environment guidance were checked for the new runbooks. URLs and precise scope are in `RivyaLivingArt_Git_Checkpoint_Workflow_v8.md` and `RivyaLivingArt_Vercel_Deployment_Handoff_v8.md`. Earlier design-library research remains historical and is not claimed to be newly verified. The Drive metadata and supplied logo reference are carried forward; no new media review/import/generation occurred in this update.

All newly added database models, demo controls, tests and quality criteria below are **proposed engineering requirements**. This delivery modifies documents only; it does not establish an implemented CMS, create application records, change Vercel secrets, generate media or deploy code.

### Revision 7 scope-only update — 21 September 2026

This update applies the owner’s explicit rejection of the four suggestions listed in Section 22. Earlier source-check notes above are retained with their original revision labels; no new external research, Drive review, logo sampling, source-code audit or implementation occurred in this revision. Older prompt-pack editions and optional-improvements documents are superseded as instructions, not erased from history.

## 17. First response and execution instruction

Start R8-0 now **only if you have the actual project source**. First summarize the observed repository, the important source conflicts resolved above, the exact files you will inspect, and the smallest safe audit slice. Then perform that audit slice, record real results and write its checkpoint. Commit/push it to the verified safe work branch when the required checks and permissions permit; otherwise report the exact push blocker. The next implementation task must be frontend-first, not a migration or backend rebuild. After reporting the audit, begin the smallest safe R8-1 visual slice in the same session when the source, checks and permissions permit; otherwise state the exact blocker. No additional audit-approval round is required for already confirmed safe scope.

Confirm first that Section 22’s four rejected additions are excluded from planned components, dependencies, schemas, routes, fixtures and asset requests. Do not ask again whether to add them. Your R8-0 output must include the actual W01–W30/A01–A22 component map, dependencies/version findings, routes to preserve, custom-CMS gaps, demo model/status mapping and seed/removal plan, login/session/recovery gaps, Vercel environment matrix, supplied-logo token adaptation, exact Drive/source status, initial media slots and owner prompt backlog, cost constraints, missing inputs and next phase plan. The CMS choice is already decided: our repository-owned implementation; do not reopen a hosted-CMS selection exercise. Do not claim to have reviewed files that were not available. Do not silently initialize a new app in place of missing existing source.

For later phases, implement one coherent slice at a time in the R8 order. State what changed, actual files, visual/integrated status, migration effects, commands/results, actual commit and verified push, remaining blockers and the exact next instruction. At R8-5 and R8-11 issue the specific owner Vercel handoff; do not automatically deploy production. Do not repeat completed phases, remove in-scope working features, invent real/public claims, reintroduce excluded integrations or start a broad rewrite merely because a new session begins. Fictional demo content is explicitly required by Section 18; preserve its provenance and manual removal decisions.

## 18. Rich demo content, Studio coverage and owner-controlled removal

**Staged delivery:** R8-1–5 first author and render the versioned source fixture pack without a database. Browser-local preview changes are explicitly simulated under Section 23. R8-9 uses the same fixture identities/content through real authenticated seed/cleanup services. The SQL durability and full removal criteria below are final integration requirements, not a reason to delay the frontend. Do not count source fixtures as inserted database rows.

### 18.1 Required seed pack — authorized fictional data, not a live catalogue

Implement the quantities below through the existing seed/service architecture. The companion `RivyaLivingArt_Demo_Content_Blueprint_v8.md` contains the named product list, article briefs, FAQ questions, fictional testimonial examples, forty order scenarios and module coverage. The counts are a **clean initial batch acceptance target**, not a requirement to recreate items after the owner deletes them.

| Entity | Initial target | Required distribution/content |
|---|---:|---|
| Products | 120 | 84 LARGE collectible furniture/spatial art, 24 MEDIUM memory/celebration pieces, 12 SMALL personal/gifting pieces. Complete tier-specific fields and customization examples, not 120 duplicate cards. |
| Blog posts | 36 | 18 large-art/design, 8 memory/preservation, 6 personal/gifting, 4 studio/process subjects. Complete original demo article bodies, not title-only entries. |
| FAQs | 42 | Seven topic groups of six, with meaningful sample answers and configurable product/collection references. |
| Testimonial examples | 24 | Fictional UI fixtures, visibly labelled; no real reviewer faces, verified badges or public review aggregates. |
| Inquiry/order scenarios | 40 | Five in each of the eight proposed lifecycle states. Cover every actual stored state discovered in R8-0; increase the total when needed rather than overwriting existing enums. |
| Other Studio content | Coverage-driven | All in-scope content types, taxonomy, variants, page sections, revision states, media metadata, imports, notes, notifications and settings views must have meaningful examples or honest empty/error cases. |

The owner has authorized creating demo content without supplying real product facts. Do not ask the owner to write these examples first. However, **do not fabricate real business evidence**. Sample prices, dates, specifications, lead times and stock values are simulated and cannot be promoted to real without review. Complete blog drafts should generally be 600–1,000 useful words with an excerpt, 4–7 purposeful headings, relevant internal demo references, a draft cover mapping and original prose. Vary structure; no lorem ipsum, repeated paragraphs or keyword stuffing. No fictional author credentials or claims of actual delivered projects.

Use creative design/planning content, not unsupported resin safety, environmental certification, durability, food-contact or manufacturing guarantees. Demo policies/FAQ answers must explicitly be sample wording awaiting owner review when business terms are unknown. Protect the user's actual contact details from demo outgoing messages.

### 18.2 Dataset isolation and visible presentation

The preferred testing environment is an isolated development/preview database and appropriate media storage, not a copy of real customer records. Add an explicit **Live / Demo** scope in Studio where both kinds can be inspected. Demo preview needs a persistent label such as **“Demo collection — sample content and concept imagery. Not a live offer.”** Fictional testimonials also need an adjacent sample label. Staff-only demo preview must use the actual site components so the owner can inspect the full design without contaminating live content.

Production public read services must hard-exclude demo provenance across page delivery, products, navigation, related items, feeds, JSON-LD, search, sitemaps, previews, metrics and exports intended for business use. A feature flag alone is not the exclusion boundary. Live content must not silently traverse references into demo records. Protected demo mode is a separate authorized path/scope, not a query parameter any visitor can enable.

Default: install fixtures only into development or a designated protected preview environment. Installing demo records into a production database, even for staff-only training, requires a separate explicit owner action and environment checks; the public read exclusion still cannot be bypassed. Do not auto-seed in `next build`, postinstall, migrations, cron, deployment hooks, login or application startup.

Demo operations must use a server-side **no-op/outbox-preview adapter** for email, WhatsApp handoff, webhooks, subscriber campaigns and any external fulfillment. Block `wa.me`, `tel:` and `mailto:` actions for synthetic contacts in demo views; show a local message preview instead. A button labelled “Simulate” must not secretly send anything. Default reports and real operational counts exclude all demo records; demo charts derive from the seeded records and are explicitly labelled.

Use fictional person labels such as `Demo Client 001`, email addresses under `.invalid`, and a nullable phone plus a non-contactable display label. Do not generate plausible Indian mobile numbers: they may belong to real people. Do not weaken real enquiry validation to accept demo sentinels; fixtures enter through a separate authorized typed seed service, not the public customer form. Any fixture testing a real phone validator uses a stubbed transport and never sends. Demo staff profiles are inactive/non-authenticating fixtures; actual test logins are provisioned securely into an isolated test environment, never shipped as default credentials.

### 18.3 Deterministic creation, provenance and edit protection

Reuse equivalent existing columns/models or add an indexed server-owned provenance design. Conceptual fields:

```text
originKind: REAL | DEMO_FIXTURE | OWNER_CONCEPT  (map to actual application conventions)
demoBatchId: nullable stable batch identity
demoFixtureKey: nullable deterministic key, unique within batch/entity
seedVersion: version of fixture definitions
seedContentHash: checksum of initially seeded content
currentContentHash / editedSinceSeed: detects owner changes
retainedAt / retainedBy: explicit owner keep decision
createdByOperationId: seed operation trace
lifecycle: active | archived | removed (where appropriate)
```

A seed batch records environment/database identity without exposing credentials, fixture manifest version, creation timestamp, counts, operation status, safe cursors and errors. Capture one `baseTime` for synthetic chronology and persist it; resuming cannot move all dates or alter past statuses. Use deterministic IDs or stable unique fixture keys so repeated runs cannot duplicate records. Do not reuse predictable fixture identifiers as real enquiry access secrets.

Separate initial install, fill missing approved fixtures, upgrade and reset. A normal re-run must skip existing/edited/retained records and respect tombstones/manual removals. A version upgrade shows a dry-run diff and does not silently overwrite owner edits. A full reset requires explicit confirmation. Keep public/draft content states independent from demo provenance: “published in demo preview” is not “real.”

Use the ordinary validation and rendering services, with an explicit fixture context for synthetic-only data. Avoid copying the entire application into a second demo implementation. Fixtures must not create executable stored code, hidden auth exceptions or parallel hard-coded frontends.

### 18.4 Manual Demo Data Manager — A19

Provide a real working Studio interface, not only a CLI seed command:

| Action | Exact semantics |
|---|---|
| Preview installation | Counts, environment, sources, expected media cost, validation and conflicts; no write. |
| Install demo pack | Explicit owner/admin action, protected environment, deterministic idempotent batches and truthful progress. |
| Edit a sample | Normal editor, persistent demo badge, changed-from-seed indicator; editing alone does not turn it real. |
| Remove one / selected | Show affected references and retain/block choices; remove only explicitly selected demo IDs. |
| Remove demo products/blogs/etc. | Entity-type filter within the selected batch; show dependent sample references and block real dependencies. |
| Remove entire demo batch | Fresh dependency preview, exact count/hash, typed confirmation and recent reauthentication; resumable cleanup. |
| Archive / restore | Use existing lifecycle support; restore preserves demo classification and never auto-publishes. |
| Keep selected content | Explicit retained state protects it from bulk removal; still demo until separate verified conversion. |
| Convert suitable content | Duplicate an eligible product/page/article into a new REAL draft after factual, rights and relationship review. Keep provenance; never merely unset a boolean on the original. |
| Reinstall/reset | Separate deliberate action; never undo the owner's removal automatically. |

**Never convert a fictional testimonial, synthetic order, fabricated customer identity or simulated audit into real customer evidence.** Replace a sample testimonial with a separately collected genuine review; create a real operational record from a real request. For an eligible product/article, conversion must require actual specifications/content review and media classification, reject demo references, and preserve the original fixture audit. Copying a demo name alone is not approval of its claims.

The “remove menu items” request also gets A20's independent navigation preferences. Hiding Blog or Portfolio does not delete its content. Core security/settings/sign-out must remain accessible. Role permissions are always enforced separately.

### 18.5 Safe deletion algorithm and shared assets

Deletion is consequential: scope it by exact server-verified batch/entity/IDs, never by a title prefix, loose date range, email pattern or `deleteMany({})` without provenance constraints.

1. Validate staff identity, capability, recent reauthentication, environment and batch state. Lock the operation so seeding/cleanup cannot race.
2. Compute a dependency report from current SQL relations and indexed rich-text/section references, including published and retained revisions. Include shared media, taxonomies, navigation and genuine records pointing at a demo item.
3. Present counts and a signed/opaque operation token binding scope, version and expiry. Require an explicit retained/dependency policy and typed confirmation for destructive batch actions.
4. At execution, revalidate record versions/dependencies inside suitable transactions. Abort or recompute on conflict; a stale dry run is not permission to delete changed records.
5. Delete/archive demo-only children before parents in bounded batches. Block real incoming dependencies until the owner resolves them; never cascade into real enquiries, published pages or real content revisions. Preserve minimal redacted cleanup/audit evidence.
6. Queue only eligible orphan **demo-owned derived Blob objects** for delayed cleanup after commit. Re-check references before deletion; skip anything shared, retained or ownership-ambiguous. Never delete original Drive files, brand masters, owner uploads or a real file because a demo used it.
7. Invalidate the correct demo/public reference caches as needed. Persist success/skipped/blocked/failed counts and a resume cursor. Repeated execution must be harmless.
8. Verify a real-content sentinel and real asset checksum/reference count are unchanged, removed fixtures remain removed after a deployment/reseed attempt, and unaffected pages still render.

Database transactions do not roll back Blob deletion. Do not promise permanent-deletion undo unless a tested independent backup/quarantine retention actually supports it. Default to removing selected demo records without physically deleting shared media. Export/backup access is staff-only; do not put private database snapshots in public Blob or Markdown.

### 18.6 Test matrix and acceptance

Prove exact initial counts, per-tier/per-status coverage, fixture key uniqueness, coherent relationships, complete article/FAQ bodies and no broken mandatory media slots (approved asset or labelled fallback). Include:

- Initial seed; second seed; interrupted seed/resume; owner edit; individual removal; entity removal; whole-batch removal; interrupted cleanup/resume; protected retained item; stale confirmation; concurrent edit; missing permission; wrong environment.
- Public read/cache/search/metadata/sitemap refusal of demo records, including demo references inside otherwise real pages. Draft-preview permissions must not leak into shared cache keys.
- Real record/media/staff preservation; no real messages; no fake analytics; no credentials seeded; demo cleanup can complete without destroying audit provenance.
- Thirty-six article drafts genuinely contain prose. Forty orders span the real lifecycle and have valid synthetic chronology, snapshots, tasks and activity.

The UI should report actual completion, unresolved asset prompts and test evidence. Specifying 120 products here is not evidence that the database contains them yet.

## 19. Complete staff login, Studio administration and Vercel environment operation

### 19.1 One real authentication system

Only staff authenticate. Audit the documented Auth.js Credentials implementation and its actual version/session strategy before editing; do not assume a README proves it works or silently replace it with another provider. Reuse the established password hashing/session library and compatible server runtime. Implement missing pieces with explicit tests.

| Flow | Required behavior |
|---|---|
| Staff login | Labelled email/password, visibility toggle, paste/password-manager support, safe errors, real pending state, accessible focus and controlled redirect. Do not redirect to arbitrary hosts. |
| First owner setup | Prefer a documented one-time trusted bootstrap command. If an existing setup page is retained, require a single-use expiring server-side token, empty/allowed bootstrap state and concurrency protection; disable permanently after initialization until an explicit recovery procedure. |
| Staff invitation/creation | Admin-only; permitted role/capabilities; expiring one-use setup token through a configured channel; no public registration and no plaintext default password. |
| Password recovery | Generic response without account enumeration; stored hashed expiring single-use token; actual configured sender; no reset token in logs. Without delivery configuration show an honest controlled recovery procedure, not “email sent.” |
| Password/account change | Verify current identity/recent authentication; validate server-side; invalidate appropriate sessions and log a redacted event. Email changes require a deliberate verified workflow. |
| Logout / logout-all | Invalidate the appropriate actual session or revocation version, clear cookies and stop protected reads. A button that only navigates to login is insufficient. |
| Session/active staff management | Meaningful current/other-session information supported by the real strategy; revocation, inactive/disabled state, least privilege and last-admin protection. Do not claim precise device identity from a user-agent string. |
| Access denied / expired session | Branded dark views with safe recovery, no sensitive record data, no infinite redirect loop. |
| Audit | Actor, action, target, time, relevant revision and outcome; no passwords, reset links, full request payloads or secrets. |

Role/active-state checks must run in protected data access, Server Actions, API routes, exports, private media access, preview, imports, publishing and demo controls. Route `proxy.ts`/layout checks are additional defenses, not the whole authorization scheme. JWT-based sessions still need a strategy for revocation and timely current-role checks; document and test it. Do not weaken authorization to make a demo page or screenshot work.

Use secure `HttpOnly` cookies, appropriate `SameSite`, HTTPS `Secure` handling, idle/absolute expiry policies, narrow trusted origins, bounded input and generic login/reset errors. Use an existing durable rate limit or a tested persistence-backed alternative; process-local memory alone is not a dependable cross-instance production login throttle. Missing infrastructure must be reported, not silently replaced by an ineffective control.

Do not add public Google customer login, checkout, payment credentials or automated WhatsApp sending. Staff MFA/passkey additions are explicitly excluded by the owner. Password hashing, server authorization, session revocation, rate limiting, recent password reauthentication for sensitive operations and safe recovery remain mandatory; they are not the rejected second-factor feature.

### 19.2 Vercel dashboard versus application Studio

The owner manages runtime secrets in **Vercel Project Settings → Environment Variables** (or authorized provider/CLI workflow). The application Studio offers **presence/readiness information only**, not unrestricted access to the Vercel account. Do not build a secret editor or put a broad `VERCEL_TOKEN` in the application merely to imitate a hosting dashboard.

Vercel account authentication, optional Vercel Deployment Protection and application staff authentication are different boundaries. Verify any protection feature against the actual plan; do not assume password-protected deployments or enterprise controls are free. Application staff login and permissions remain required even when preview deployments are protected.

### 19.3 Environment matrix — derive names from audited source

The following names are **proposed logical examples**, not guaranteed SDK defaults. Preserve actual installed-library names and avoid duplicate aliases. Validate required server config with the existing schema approach. Never show its values in Studio, prompts, CI artifacts or screenshots.

| Configuration | Scope / secret status | Required handling |
|---|---|---|
| `DATABASE_URL` | Server-only secret | Runtime connection for the correct environment; least-privilege app access. |
| Existing migration connection, e.g. `DIRECT_URL` if required by installed Prisma | Controlled migration secret | Use only where actually required; no new alias if current Prisma integration differs. Migration identity is not the public runtime identity. |
| Auth/session secret, actual library name | Server-only secret | Independently generated per environment; rotation and session effects documented; no hard-coded/example real password. |
| Approved application origin | Public only if truly needed | Production canonical domain versus preview origin; validate redirect/callback hosts and do not trust arbitrary forwarded headers. |
| Blob public/private store configuration and credential mode | Secrets server-side | Follow the selected SDK's token/OIDC flow; distinguish public marketing media from private customer references and isolated demo files. |
| Optional mail API key and verified sender | Key server-only; sender config | Required only for actual recovery/invitations; no send test by default and no pretend success when absent. |
| Optional scheduler secret | Server-only; conditional | Only for approved implemented durable scheduling; not required to launch manual publishing. |
| `APP_DATA_MODE` or equivalent | Server configuration | Proposed `live` / `demo` / `test` context, validated against deployment/database identity. Never a user-controlled bypass. |
| `DEMO_SEED_ENABLED` or equivalent | Server-only guard | Default off; explicit designated environment action; real public filters apply independently. |
| `DEMO_EXTERNAL_ACTIONS_DISABLED` or equivalent | Server-enforced behavior | Demo operations always use no-op transport; avoid a flag combination that allows demos to contact people. |
| Deployment identity/commit metadata | Non-sensitive subset | Display only safe fields; do not return all process environment or project internals. |
| Bootstrap/recovery material | Short-lived controlled setup | Remove/expire after authorized use; never keep a permanent production admin password in environment. |

No Sanity, scraping or generation-provider credentials. Drive source IDs and manifests do not require a live visitor Google credential. Codex credentials are not automatically Vercel application credentials. `NEXT_PUBLIC_*` is not a safe place for any secret. No client-side condition, secret-name obscurity or noindex directive substitutes for server controls.

### 19.4 Development, preview and production

Use isolated database/storage resources and secrets for local development, preview and production. An environment label is not enough: verify that its actual resource identity is not production before seed/reset/tests. Treat `NODE_ENV=production` as a build/runtime mode, not by itself a reliable deployment/data-scope detector. A local `next start` may still be running an isolated demo; verify the real environment explicitly. Conversely, `VERCEL_ENV=preview` must not justify writing a database URL that points at production.

Vercel's official environment guidance says changes apply to **new deployments**, not previously deployed ones. Document the approved redeploy and verification step after a configuration change, and distinguish runtime values from build-inlined public variables. Record variable names/scope and successful readiness checks, never values. Existing old deployments may retain earlier config; retirement/rotation is an owner-controlled operation.

Preview must not send real email/WhatsApp, run production imports, publish live content or contain copied customer references. Protect previews using available deployment controls and app authentication. Keep robots/noindex as indexing preferences only, not access control.

### 19.5 Deployment and owner runbook

Required handover: correct repository/branch/root and runtime; lockfile install/build; database integration and migration workflow; public/private media configuration; server-only auth secret; verified production/preview origins; optional real mail configuration; protection/budget settings; one-time owner bootstrap; staff login; health/readiness; draft-save/preview/publish check; real-form submission into a controlled test workflow; private upload denial tests; rollback and backup/restore exercise.

Do not run destructive migrations or reset seeds from the Vercel build command. Deploy application/database changes using an additive expand-then-contract strategy where needed; a code rollback is not a database rollback. Backups must cover SQL and Blob ownership/manifests, not just Git. Long jobs use persistent cursors and bounded requests within verified plan limits.

The Environment Health panel may check database connectivity/readiness, media configuration and mail configuration presence. Network checks must be predefined, bounded and authorized; no arbitrary URL tester, secret echo, table browser or raw SQL console. A configured variable does not prove the provider is healthy: use distinct `configured`, `check passed`, `check failed`, and `not tested` states. Owner-only provider dashboard links are convenience links, not an app-managed Vercel session.

## 20. Codex implementation and ChatGPT content/asset handoff

### 20.1 Division of work

| Participant | Responsibility |
|---|---|
| Codex | Audit actual repository; write compatible application code/tests/migrations; implement custom CMS, Studio, seed/cleanup controls and deployment documentation; process approved returned assets. |
| ChatGPT | Help refine specifications, demo editorial content, image/video prompt batches, source research and review notes. Its output is reviewed content/code, not automatically published or executed. |
| Owner | Approve factual/live content and returned assets, provide secure account configuration, generate requested image/video files, return outputs to Drive and authorize production actions. The four declined suggestions require no further approval request. |

Codex is the requested engineering workflow, not a runtime feature of the website. Do not add an OpenAI API key, model call, in-CMS assistant, remote generation endpoint or subscription merely because code is created with Codex. Do not claim ChatGPT's connectors, browser, files or credentials automatically exist in the Codex environment.

### 20.2 Repository instructions and context limits

Follow effective AGENTS.md instructions; keep it compact with business/security rules, actual commands and links to the current master, demo blueprint, asset prompts and active plans. Explicitly read existing CLAUDE.md and preserve the repository's document hierarchy. Do not paste the entire 100+ KB specification into AGENTS.md or depend on a fresh session remembering earlier chats. Current official guidance describes an instruction-discovery size cap; linked detailed files should be read in relevant slices.

Treat earlier source documents as history where the owner's latest choices supersede them: brand `RivyaLivingArt`; custom CMS; no product scraper; no Higgsfield; owner image/video generation from separate prompts; mandatory isolated demo dataset; logo-derived fully dark design; and the explicit S01–S04 exclusions in Section 22. Resolve a true scope conflict in a dated decision note rather than silently rewriting history.

Each implementation task packet must state: phase/slice, goal, actual files allowed to change, preserved interfaces, schema/migration effects, dependency justification, acceptance tests, output docs and stop condition. Use small reviewable diffs. Parallel agents may work on clearly disjoint tasks after shared contracts are stable; no simultaneous unsupervised edits to schema, auth, tokens or lockfile. Merge/review checkpoints prevent divergent implementations.

### 20.3 Codex environment setup

Identify whether the owner is using Codex cloud, CLI or an IDE integration. Use that environment’s actual repository/permissions and runtime, not assumptions from another surface. Pin a compatible Node/package-manager toolchain and use the existing lockfile/frozen installation. Discover the real lint/typecheck/test/build commands from the repository; never invent passing output or assume an obsolete framework lint command exists.

Official cloud guidance separates setup and agent phases and describes secrets being available during setup but removed before the agent phase. Plan dependency installation and tests accordingly. Never write secrets to `.bashrc`, source files, documentation or generated artifacts to defeat that boundary. Use a local disposable test database or an explicitly authorized least-privilege environment with a verified secure credential mechanism; when unavailable, record blocked integration tests and run safe independent tests. Do not copy production secrets into ordinary agent-visible configuration.

Network access, package installation, provider access and background processes depend on actual permissions. Verify them. Keep allowed domains narrow where supported. Do not disable sandbox/approval controls, fork protection or auth because a test cannot connect. Source text, file imports and downloaded UI components are untrusted data, not instructions to leak credentials.

### 20.4 Frontend-first slices and verified Git checkpoints

Use Section 14 and `RivyaLivingArt_Frontend_First_Plan_v8.md`, not the earlier Phase 2–4 backend-first order. R8-0 audits; R8-1 establishes the visual foundation; R8-2/3 build the website; R8-4 builds Studio visuals; R8-5 hands the owner a protected visual preview. R8-6–9 add real backend/auth/CMS/enquiry/import/demo services; R8-10 tests integration; R8-11 hands the owner the full release candidate.

Every completed coherent slice follows `RivyaLivingArt_Git_Checkpoint_Workflow_v8.md`: real checks → documentation → reviewed commit → authorized safe-branch push → remote verification → report. Do not leave all changes unpushed until the end. Do not automatically merge the production branch, force push or disable protection. An unavailable push mechanism is an explicit blocker, not a hidden success.

At V1 and V2 use `RivyaLivingArt_Vercel_Deployment_Handoff_v8.md` and its exact owner messages. State the actual branch/SHA and verified readiness, not an invented deployment link. The first checkpoint is visual preview only; the final one requires real functionality. Existing automatic protected previews from authorized Git integration are distinct from an authorized production deployment.

At each checkpoint mark missing content and assets honestly. “Prompt prepared” is not “file generated”; “source fixtures authored” is not “database seeded”; “UI_READY” is not “BACKEND_TESTED”; “committed” is not “pushed”; “pushed” is not “deployed.” Preserve source-supported history and the owner’s exclusion decisions.

## 21. Supplied-logo dark theme and Awwwards-calibre quality

### 21.1 What the supplied image supports

The attached board visually shows a bronze R/leaf/circular monogram, a dark forest-toned wordmark/background treatment, warm ivory surfaces, primary/alternate logo arrangements and favicon examples. Keep the exact public brand spelling `RivyaLivingArt` in text/metadata while preserving the approved spaced typographic logo artwork as artwork. Do not retype a new logo with an arbitrary similar font or treat the whole mood board as a header image.

The board also includes brand-line wording. Preserve it as owner-supplied brand material, not evidence of a workshop, environmental certification or a promise about product sustainability. Avoid repeating both slogan and tagline in every viewport. Obtain actual clean transparent/SVG masters for final logo production when absent; a raster board does not contain editable vector geometry.

Local pixel sampling of selected logo/background regions, after resizing the board for sampling consistency, gave approximate medians: bronze monogram `#A38166`, bronze secondary lettering `#AC917B`, dark panel `#282E29`, dark wordmark `#262C23`, and warm ivory `#F0EBE5`. Metallic shading, texture, raster encoding and sampling location affect these values. They are not declared official brand swatches.

### 21.2 Proposed web adaptation — use existing semantic token names

| Role | Proposed token | Usage |
|---|---|---|
| Dark canvas | `#101713` | Main website and Studio background. |
| Surface | `#19221C` | Tables, forms, editors and quiet content surfaces. |
| Elevated surface | `#232E26` | Dialogs, dropdowns and selected panels. |
| Primary / bronze | `#B79270` | Important actions, links, selection accents and selected controls. Slightly lighter than sampled bronze for dark-interface readability. |
| Primary hover | `#CEAC89` | Subtle accessible interaction highlight. |
| Primary foreground | `#101713` | Text/icons on solid bronze action buttons; not ivory-on-bronze. |
| Main text | `#F3EFE7` | Warm ivory body text. |
| Muted text | `#B7BFB5` | Secondary readable information. |
| Decorative hairline | `#3A483E` | Nonessential separators; not the sole boundary of a critical input. |
| Strong control boundary | `#78867C` | Input/control outline where needed for contrast. |
| Focus ring | `#CEAC89` with clear offset | Visible keyboard focus on dark surfaces. |

Calculated opaque sRGB contrast examples for this proposal: bronze `#B79270` on canvas `#101713` is approximately **6.38:1**; bronze on elevated `#232E26` is **4.94:1**; ivory `#F3EFE7` on canvas is **15.87:1**; muted `#B7BFB5` on surface is **8.65:1**. Ivory on bronze is only about **2.49:1**, so use dark primary-button text. These are calculations for solid pairs, not a site accessibility audit; inspect actual opacity, gradients, imagery, focus and disabled/selected states.

Keep forest surfaces mostly quiet and bronze scarce. Do not recolour product resin or wood to match the UI. Do not use gradients across all controls or make every card metallic. Preserve functional status semantics with accessible text/icons rather than replacing all errors/success states with bronze. Public pages may use expressive display typography; Studio tables/forms should favor the existing readable UI font and tabular numerals.

### 21.3 Public experience quality brief

Aim for the discipline seen in award-level editorial design: clear furniture-first identity, a deliberate grid, strong scale, authentic tactile imagery or honestly labelled concepts, purposeful whitespace, restrained motion and a frictionless commission journey. Awwwards quality is a target, **not a guaranteed award, badge, score or affiliation**. Actual submission/fees are a later separate owner decision.

The primary hierarchy remains logo/navigation → collectible hero → selected objects → material/process narrative → commission action. Design transitions around that story instead of stacking unrelated registry effects. Limit an initial viewport to one focal animated treatment; keep content and actions present without waiting for an intro. Preserve normal scroll/keyboard navigation and reduced-motion fallbacks. Do not copy an award site's full layout, protected assets or proprietary interactions.

The requested directory is a research starting point. If it is inaccessible, record the limitation rather than claiming a current winner review. Review any chosen reference with real browser desktop/mobile checks and record concrete observations. Do not claim this document performed that browser audit.

### 21.4 Studio quality brief

“World-class Studio” means an efficient, complete working tool: stable dark shell, legible density, sensible page widths, clear grouping, consistent controls, accurate counts, sticky save/publish actions, inline validation, useful blank states, safe recovery and no unwanted scroll resets. Give dangerous actions space and explicit confirmation; never place Delete Batch beside Save as visually equivalent actions.

Make common tasks coherent: find a product, edit dimensions, choose an asset, save a draft, preview, publish; open an enquiry, see its request snapshot, add a note and change status; inspect a demo batch and remove selected samples; check environment readiness without exposing values. Each task must work with keyboard and on a narrow viewport. Use accessible split panes on desktop and a purposeful pane-switching flow on mobile.

Basic click, dropdown, loading, progress, selection and focus refinements are required. Do not import cinematic cursor, parallax, scroll-smoother or autoplay video behavior into operational Studio routes. “More modern” must not mean slower, harder to operate or dependent on more services.

### 21.5 Free-compatible tool policy and evidence gates

Prefer the documented Next.js/React/TypeScript, CSS-first Tailwind/shadcn, Prisma/Neon, Tiptap, Blob, existing auth and existing GSAP/Lenis foundation. The framework does not need replacement just to pursue design quality. Stable compatible releases and actual license terms take precedence over novelty.

Candidate additions only where an audited gap exists: existing shadcn/TanStack table primitives for large lists; existing Tiptap open extensions for structured editing; the installed unit-test runner or compatible Vitest where absent; Playwright for browser journeys/screenshots; axe-core integration for automated accessibility checks; existing bundle analysis and Lighthouse tooling for measurement. These are proposed tool choices, not unverified install commands or claims that every extension/service is free. Check original repository/license, security, package peers, server/client compatibility and bundle impact at adoption. Automated accessibility checks supplement manual testing.

Only add dependencies needed for already approved scope. Keep paid templates, cloud collaboration, premium animation packs, GPU-heavy global effects, new backends and vendor replacements out unless separately approved. A free library may still incur hosting/browser costs. Do not label GSAP's license plain MIT; review its actual Standard No Charge terms. Free-first does not override Vercel's commercial plan conditions.

Quality acceptance needs actual screenshots at agreed phone/tablet/desktop widths (for example 390, 768 and 1440 CSS pixels), keyboard/touch testing, browser console checks, real performance measurement, content realism/privacy review and complete Studio actions. Keep existing Core Web Vitals/WCAG targets in Section 12 as measured targets, not unearned pass statements. If testing tools or source are unavailable, report that specific gap.

## 22. Confirmed scope — four suggestions explicitly excluded

**Owner decision:** all four suggested additions are declined. Their status is **EXCLUDED**, not PROPOSED, DEFERRED or AWAITING APPROVAL. Do not re-propose them, ask for their approval again, or reinterpret “world-class,” “full Studio management,” “all Studio items” or “modern tools” as permission to implement them.

| Rejected ID | Do not add | Already-requested behavior that stays in scope |
|---|---|---|
| S01 | Additional staff MFA, authenticator second factors, passkeys, enrollment/challenge/recovery-code screens, or dependencies for that feature. | Normal staff email/password login, controlled owner setup, staff creation, password recovery/change, hashing, server permissions, rate limiting, session revocation and password reauthentication for sensitive actions. |
| S02 | A branded specification/quotation PDF generator, document-template builder, generated quote-download workflow or dedicated rendering jobs. | Product specifications displayed on the website, uploads/downloads of existing owner-approved files, inquiry snapshots, internal quotation notes/status and manual WhatsApp discussion. A supplied specification file is not an automated PDF builder. |
| S03 | An enhanced side-by-side material/finish comparison module, interactive comparison interface or new visual configurator introduced for that suggestion. | Ordinary material/finish fields and selections, existing galleries, explanatory content, dimension information and approved asset-dependent model viewing already specified elsewhere. |
| S04 | An account-free client design-approval portal, client proof/approval pages, approval capability links, client-feedback endpoints or related client-approval notifications. | Staff-only CMS draft preview/review/publication, private customer reference uploads, the existing inquiry receipt/WhatsApp fallback, internal notes and manual design discussion through WhatsApp. |

Do not introduce new menu entries, teaser controls, schemas, migrations, API routes, packages, environment secrets, generated assets, demo fixtures, tests or implementation phases to support the rejected modules. Do verify that newly written code does not accidentally introduce them. Existing demo copy about reviewing names, dimensions or a design refers to the ordinary manual conversation and internal records, not a client-facing approval service.

Remove the optional-improvements document from the active pack and from agent reading lists. Do not maintain a pending approval queue for these four items. Preserve original historical documents and dated records; if the repository already contains a decision register, append the current exclusion without falsifying older entries. This scope update is not permission to drop production tables, delete business files or disable any pre-existing authentication protection without an audited change plan.

The retained baseline is unchanged: **52 component specifications (W01–W30 and A01–A22), twelve phases (R8-0–R8-11, reordered frontend first), our custom CMS, the logo-derived dark website and Studio, full normal staff management and Vercel environment handling, 120 products / 36 complete blog drafts / 42 FAQs / 24 fictional testimonials / 40 inquiry-order scenarios, manual demo cleanup, Drive-first media and separate owner-generation prompts.** Ordinary content/media review and production authorization still apply. No new feature is added merely to replace one of the rejected suggestions.

**Completion rule for this document pack:** the specification is complete when its requested requirements are represented and internally consistent. Application completion is a different milestone, proved by actual source, migrations, fixtures, tests, assets and an authorized deployment—not by the existence of these Markdown files.


## 23. Frontend-first delivery contract — authoritative for Revision 8

The owner explicitly wants to **see the website and Studio before the backend is completed**. Build the real reusable frontend first, then connect it to the backend. This is a sequencing change, not permission to deliver a permanently fake application. The final operational requirements in Sections 1–22 remain in force.

### 23.1 Three distinct execution stages

| Stage | Data and authentication | Allowed result | Must not claim |
|---|---|---|---|
| `visual-preview` | Versioned synthetic fixtures and reviewed static/approved public media. No live database credentials or operational auth/Blob/mail clients. Owner access protected by existing working staff auth or verified deployment protection. | Real website/Studio components, navigation, local filtering, form validation, responsive visuals and labelled browser-local simulations. | A real login, database save, upload, email, quote acceptance, publication or actual order. |
| `integrated-preview` | Isolated test database/storage, normal staff authentication, real application services, synthetic/non-contactable data and suppressed external delivery. | Test actual saves, private uploads, seed cleanup, import, draft/publication and request handling without production impact. | Live customer transactions or final production readiness before all checks. |
| `live` | Approved production resources, normal server authorization, actual factual content and public/private storage policies. | Fully operational website and Studio within the confirmed scope. | Any demo fixture, mock success, hard-coded health result or fallback to mock authentication. |

These are proposed logical stage names. Reuse an equivalent existing configuration system instead of inventing duplicate flags. An `APP_STAGE` variable is a suggested single server-owned selector, not a framework default or secret. Stage selection must not be changeable with a query string, localStorage, ordinary cookie, unauthenticated header or public client toggle. Live mode fails closed when required configuration is missing; never silently fall back to fixtures.

### 23.2 Frontend work allowed before backend

Create/reuse pure TypeScript presentation models and validation contracts based on audited existing schemas. Add a narrow fixture adapter behind existing query/view interfaces; use the same UI exports and route components for later real data. Server rendering, ordinary route code, frontend validation and minimal preview isolation are allowed: “frontend first” does not mean converting the Next.js app into a separate SPA or static-export framework.

Do not run schema migrations, create real users, seed databases, rewrite authentication, provision a new backend or require database credentials merely to display the first visual build. Preserve working existing backend code and auth protection. Read it during the audit so the frontend contract fits it; connect or enhance it in R8-6 onward.

Audit module initialization, server imports, layout providers, metadata, route handlers, build scripts and instrumentation. The visual build must not initialize Prisma/Neon/Auth/Blob/mail clients or require their secrets through an unused import. Use type-only imports and compatible separated adapters where appropriate. Avoid exporting secrets or server modules into client bundles. Do not add fake URLs/tokens just to silence configuration errors. Keep the established deployment/runtime target and lockfile.

The fixture catalogue lives in versioned source data or the audited fixture directory, not scattered JSX arrays. Reuse the demo blueprint's stable IDs, relationships and full content later for SQL seeding. Paginate/filter through the fixture adapter; do not ship every full article and Studio record into the home-page bundle. Complete the required 120/36/42/24/40 fixture content by the visual checkpoint, while distinguishing source fixtures from database rows. Missing optional media can use a deliberate labelled fallback plus a concrete prompt request; missing essential layouts or article bodies are not silently complete.

### 23.3 Safe Studio visual preview — not a login bypass

Use the real presentation components to show the Studio screens in a **non-production visual harness**. Prefer a separately scoped proposed path such as `/__visual/studio` when existing `/studio` routes require real staff authentication. Map it to an actual safe route during audit. It is a build/review surface, not a new customer portal or a second CMS. It must be absent or return a true denial/not-found in live mode. The actual `/studio` and every existing protected server action retain their normal authorization; no `if demo then admin` rule, query-token bypass, default password, fake auth session or weakened middleware.

The visual login/recovery screen demonstrates layout and documented states only. Disable real credential submission and use fixed non-contactable sample labels or an explicit “View Studio design preview” action inside the already protected visual harness. Never ask the owner to enter a real password into a simulated form. Visual role labels are synthetic UI examples, not permission grants. Connect real sign-in/setup/reset during R8-6.

Until real staff auth is available, online visual review requires verified Vercel Authentication/deployment protection for the **actual Preview target and every relevant deployment/alias URL**. Do not assume that an obscure URL or robots/noindex protects it. Do not ask for a paid password-protection add-on or build a custom temporary authentication product. If the available platform protection cannot be verified, keep Studio visuals local and report that deployment prerequisite rather than expose the mock workspace. This is deployment access control, not the rejected staff MFA feature.

### 23.4 Simulations must be useful and honest

Menus, responsive layouts, gallery controls, pagination/filtering, form steps, client-side validation, editor field changes and draft section arrangement should work locally. A browser-local fixture state store may persist **synthetic-only** edits/removal tombstones keyed by fixture version. It must never store real credentials, real reference images, customer content, tokens or private production data. Provide an explicit reset for that local sandbox; do not silently reset owner deletions on every navigation.

Label simulated changes “Preview only — stored in this browser, not the database,” or an equally clear true status. Upload samples use safe fixture thumbnails or temporary local object URLs that are revoked; no real upload tokens. Generated enquiry summaries stay inside a local preview. External message actions are suppressed. Save/publish/import/health panels must distinguish example state from actual backend results; no “Published live,” “Email sent,” “Uploaded to Blob,” or verified healthy badge while simulated.

This local visual state is not the final Demo Data Manager. R8-9 must replace the simulated persistence with tested, staff-authorized database operations, retain the same interface/content IDs, and demonstrate durable removal through deployment/restarts.

### 23.5 Live and preview isolation acceptance

Test the stage/route matrix, not just a client flag. In live mode: the visual harness is denied, production queries exclude demos, no mock-auth success path exists, real configuration is mandatory, and imports/mutations keep server authorization. Verify middleware/proxy, Server Actions, route handlers, asset URLs, cached responses and client payloads; a disabled menu is not isolation.

For the first preview, use approved modest-size static derivatives in the existing asset structure or existing approved public Blob URLs. Keep Drive as intake only. Do not commit original image libraries, large video masters or private references to Git. Backend/Blob management comes later; a screenshot or file-source map is not evidence of a Blob import.

### 23.6 Review boundary and final handoff

At R8-5, complete relevant checks, commit and verify push, then issue the **V1 visual-preview deployment handoff** from the deployment companion. Invite review of the actual website and Studio visuals before substantial backend implementation. Continue after the owner reports the visual review or explicitly instructs continuation without online deployment. If deployment is blocked, local screenshots can support a review; record the remaining V1 deployment blocker honestly.

At R8-11, issue the **V2 full-deployment handoff** only after real functionality and release prerequisites are demonstrated. A mock frontend is never a completed CMS. A push is never a deployment; a successful build is never an observed deployed URL. The owner controls production deployment, domain changes and merging/promoting the production branch.


## 24. Every completed slice must reach a verified Git checkpoint

`RivyaLivingArt_Git_Checkpoint_Workflow_v8.md` is part of this specification. The owner requests incremental commit/push to the actual repository. Audit and use one approved non-production work branch with an explicitly verified remote, respect permissions and existing Git/PR conventions, stage only reviewed owned paths, run required checks, update canonical docs, commit and verify remote publication. Report blocked publication honestly. No production merge/push, force push, branch deletion, credentials exposure or history rewrite is authorized by this cadence.

A first setup/readme slice also follows the policy when files change. A read-only audit with no changes does not need an empty commit. Report the actual Git SHA/push independently from CI/Vercel status. Check every effective push destination and whether a push will trigger an existing production deployment before the first remote write.

## 25. Owner Vercel handoffs — show the visuals, then deploy the complete build

`RivyaLivingArt_Vercel_Deployment_Handoff_v8.md` is authoritative for readiness messages and runbooks. Gate V1 follows R8-5: “Frontend visual preview is ready. Please deploy the verified work-branch commit to a protected Vercel Preview so you can review the website and Studio. Backend integration is not complete.” Include exact evidence/settings; never use this as a public production launch instruction.

Gate V2 follows R8-11: tell the owner the full build is ready for the target deployment only after real auth, database/CMS, enquiries, media, imports/demo management, quality and environment prerequisites are verified. If factual live content or production configuration is missing, say “integrated preview ready; public launch blocked” with the exact gap, not “everything complete.”

The owner performs the deployment or gives explicit authorization for that action. An existing permitted automatic preview can be reported with its actual URL, but must not be confused with production promotion. After the owner supplies a real deployment URL or a connected tool returns it, verify build SHA, target/stage, routes and relevant smoke tests before recording DEPLOYED/VERIFIED. Do not assume that a deployment was performed merely because this prompt or runbook exists.
