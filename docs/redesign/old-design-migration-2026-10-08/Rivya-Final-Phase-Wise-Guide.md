# Rivya Living Art — final phase-wise implementation guide

Prepared 8 October 2026. **Planning complete; implementation has not started under this new plan.** This revision incorporates the confirmed requirement of 100+ new entries in each editorial section and both meanings of Order.

## The agreed result

Keep RivyaLivingArt2.0 as the working platform. Reproduce the old website and Studio's design language, page depth and detailed section structures using the current working data, security, editing and publication services. Preserve every existing product and content value, including current drafts, translations, images/crops, contact/business/social details and saved orders.

The complete scope includes **85 old page templates** (25 public/utility and 60 Studio), **74 registered section definitions**, **18 homepage templates**, **16 custom landing blocks**, **32 Studio destinations**, **12 phases**, **60 tickets** and **480 planned new content entries**. Some templates/modules are explicitly conditional or excluded; accounting for them is not permission to activate unsupported business offerings or scraper ingestion.

Use the [full illustrated plan](Rivya-Old-Design-Migration-Plan.html) for page/module specifications, source ledgers and 12 comparison screenshots. Use the [480-entry register](Rivya-Editorial-Production-Register.html) for topic ideas and genuine-evidence intake slots. The [master implementation instruction](Rivya-Master-Implementation-Prompt.md) carries the same constraints into implementation.

## What stays unchanged

Existing product records, prices, forms, galleries, selected products and ordering; all existing content text, metadata, categories, drafts, translations, URLs, image assignments and stored crops; business, phone, email and social values; customer/staff/order data and revision history. New layouts read these values. New content and image usages are additive. No product transfer, scraper run, ingestion-dependent Catalog Fill activation, backup system or invented reviews/orders.

## The implementation phases

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

## Content production: four separate targets

| Section | New target | What is prepared now | What must exist before publication |
| --- | --- | --- | --- |
| Journal | 120 | 120 explicit topic/title briefs across 12 topic groups | Distinct useful writing, verified claims, approved new media, review and preview |
| Portfolio | 120 | 120 evidence-intake slots | 120 genuine distinct projects with factual evidence, images, rights and approval |
| Testimonials | 120 | 120 evidence-intake slots | 120 genuine distinct feedback sources with permitted attribution and consent |
| FAQs | 120 | 120 explicit questions across 12 topic groups | Accurate answers based on actual policy/workflow and duplicate review |

This means 120 per section, not 120 for every filter combination. Translations, repeated placements and multiple images do not increase the count. Orders are not a content quota. Missing projects or feedback remain pending; no synthetic records satisfy these targets. Existing entries are not rewritten or included in the new-entry count.

## Filters and ordering

Public Journal: topic, applicable journey, search and meaningful date/order. Portfolio: verified project category, supported material/type and search. Testimonials: approved relevant category/context, curated order and only source-supplied rating if appropriate. FAQs: searchable question index with additive topics for new content. Studio adds lifecycle, review, language, missing source/media/consent and assigned-work filters. Only stored, meaningful metadata becomes a filter; empty combinations remain honest.

Orders retain the existing stages NEW, CONTACTED, QUALIFIED, QUOTED, CONFIRMED, IN_PRODUCTION, COMPLETED and CLOSED, immutable saved specifications, scoped notes/references and IST follow-ups. Printing and detail presentation use real saved facts. Customer WhatsApp sending stays manual.

Editorial display order is a separate versioned presentation manifest with keyboard and drag controls, preview, publish and restore-as-draft. The first migrated default keeps current order. Reordering must not run against an arbitrary partial/filter-sorted page and accidentally overwrite the whole list. Product/gallery order and featured-product selections stay unchanged.

## Working and review guide

1. Start M0 with the protected baseline, source identities and isolated QA. Do not mutate the shared production database to test designs.
2. Complete the exhaustive route/section ledger in M1, then the old-style public and Studio frames in M2.
3. Deliver one complete editable homepage presentation in M3. Demonstrate save, actual saved preview, QA publication, public verification and restore into draft with exact current content.
4. Extend the proven pattern across all public templates, Studio views and both ordering workflows in M4–M7.
5. Reconcile all 480 candidates and build useful filters in M8. Produce content in ten-entry batches in M9, recording sources, consent, language and media evidence.
6. Run M10 against the exact candidate. Keep visual, code, content and external evidence as separate statuses; do not conceal unfinished source collection or human checks.
7. For M11, wait for the applicable explicit release request, then use a detailed PR, required checks, main merge, exact Vercel READY verification and small live checks. Production content publication is an explicit reviewed step.

## Effort and truthful completion

Estimated engineering effort is 45–76 working days for one experienced implementer, to refine after the first working slice. Editorial production assumes 108–185 additional working days after source packs exist, plus source collection, photography, independent language review and field observation. These are planning ranges, not delivery promises. A team can run independent lanes concurrently.

Code may be ready before 120 genuine projects or testimonials are available. That distinction must remain visible. The full program is complete only when the template/module ledger, four unique content targets and applicable acceptance checks are complete. A specifically approved partial release does not certify the remaining work.

Human screen-reader and physical-phone tests require actual equipment and a tester. Native-reader approval requires a real reviewer. Real-user p75 needs genuine traffic, and a legitimate inquiry observation needs an actual customer journey. These cannot be manufactured with automation or test data. Existing content corrections, including old translation/crop changes, remain held by the new freeze unless separately authorized.

## First reviewable delivery

M0–M3 produces the frozen baseline, full mapping, shared old-style frame and one working homepage edit-to-recovery demonstration. Review that concrete result before expanding the pattern. All work remains local under the standing release preference until an explicit push/release request.
