# RIVYA LIVING ART — EXACT LEGACY RESTORATION MASTER CRAFT PROMPT

Version: 21 October 2026. Read [OWNER-DECISION.md](OWNER-DECISION.md) first.
Plan: [PHASE-WISE-PLAN.md](PHASE-WISE-PLAN.md). Entry prompt: [CONTINUE-IN-NEW-CHAT.md](CONTINUE-IN-NEW-CHAT.md).

## C — CONTEXT

### Primary requirement: copy the old design and feature behavior

I want the **same old website design and all its public and Studio features in the new website**. Treat OLDWEBSITE as the exact reference to reproduce, not loose inspiration. Copy/port its suitable components, styles and behavior; adapt integration to the new repository and data contracts. Architecture may be refactored where necessary. Do not substitute a newly imagined luxury design or retain the newer layout against this instruction.

Match page structure, section order, typography, spacing, sizing, backgrounds, borders, cards, galleries, forms, menus, footer, responsive behavior, animations, timing, hover/focus states and complete workflows. Compare equivalent routes and interaction states side by side.

The only intended visual/data exceptions are the protected elements below. If reference access is unavailable, inspect the old source and run it in isolation where possible. Do not invent a missing reference or mark an unseen screen matched.

Earlier project-level design preferences and feature exclusions that conflict with this owner instruction are superseded for this programme. Inventory and restore every discovered old feature; do not silently exclude scraping, imports, subscribers, exports or other modules just because a previous audit removed their entry. Where an old feature is broken, restore its intended working behavior and document the repair rather than copying the bug.

### Source and destination

| Purpose | Location |
|---|---|
| Destination repository | https://github.com/rivyalivingart2/RivyaLivingArt2.0 |
| Destination public site | https://www.rivyalivingart.com/ |
| Destination Studio login — protected | https://www.rivyalivingart.com/studio/login |
| Exact legacy repository reference | https://github.com/rivyalivingart2/OLDWEBSITE |
| Exact legacy public reference | https://oldwebsite-one.vercel.app/ |
| Legacy Studio reference | https://oldwebsite-one.vercel.app/studio/login?callbackUrl=%2Fstudio |
| General images/videos | https://drive.google.com/drive/folders/1P2HCTmPge6HsEwtoo-xGEzPTSn68oZOW?usp=drive_link |
| My own creations | https://drive.google.com/drive/folders/1s-CO-_Yk0FMg-mq2FwHtCPV__kEan6h4?usp=sharing |
| More photographs of my work | https://photos.app.goo.gl/ZHJo6xxmy2ff6bRm8 |

### Protected exceptions

Preserve the new site's logo; contact, phone, email, address and social values; main color; current product identities/slugs/prices/variants/content; and current Studio login design, responsive states and security. Preserve valid current database values, original assets and existing data relationships.

Old text may require length-aware layout adjustment for protected current content. Existing product images must not be silently replaced; add traceable derivatives. Compare the login before/after shared CSS/font changes.

Preserve useful new-only functionality alongside legacy parity. Consolidate duplicates only when no behavior or data is lost. A current secure backend may implement the old visible workflow without inheriting obsolete security defects.

### Database intent

Account for all old business entities, fields and content through an explicit merge. "Copy all old data" does **not** mean drop the new database or overwrite every current value.

| Case | Action |
|---|---|
| Old-only field | Add compatible field/structure and mapped content. |
| Old-only record | Import with provenance and relationships into appropriate review/draft state. |
| Same record in both systems | Match with stable identifiers/crosswalk; preserve destination identity. |
| Genuinely missing destination value | Fill from old source after verifying it was not intentionally blank. |
| Different populated values | Keep current value; stage field-level replacement decision. |
| Title change | Apply only a documented mapping; preserve slug/ID/URL unless separately decided. |
| Duplicate/obsolete/incompatible source | Record disposition and retain unresolved source safely; do not silently lose it. |
| Erased/deleted/unpublished record | Respect its current state; do not resurrect it through import. |
| Password/token/session/secret | Exclude from content merge; design authentication handling separately. |

### New capabilities

- Restore and expand the scraper with additional verified vendors/competitors.
- Automatic customizable catalogues from selected categories/products using Google Sheets, editable Google Slides, premium PDF and optional PPTX.
- Image support for categories, blogs, projects, testimonials and all applicable content.
- Edited/recreated derivatives of my own products, retaining truthful provenance.
- Meaningful 50+ data population/test coverage for eligible Studio modules and relevant combined filters.
- Fix reproduced outstanding audit issues; carry useful legacy Markdown knowledge into current documentation.

## R — ROLE

Act as creative director, UI engineer, backend/database engineer, Studio workflow engineer, scraper engineer, Google Workspace automation specialist, image-production specialist and QA/release reviewer. Use relevant installed skills and official documentation. Independent agents may handle non-overlapping analysis/implementation, with explicit ownership.

Use evidence from source and actual browser behavior. Do not claim that creating a route, button or placeholder implements its feature. Validate browser → API → persistence → refreshed UI.

## A — ACTION

### 1. Repository-first baseline and parity inventory

Read current AGENTS.md, PRODUCT.md where present, PROJECT_STATE.md, README, this owner decision and current source. Capture branches, commits, remotes, working tree and deployment identities for both applications. Preserve others' uncommitted work.

Inspect installation/build/bootstrap/seed/migration hooks before execution. Establish isolated test database/storage and a codex/ branch or appropriate worktree. Never run write tests against shared production-connected resources.

Review latest audit/redesign receipts and PRs, including #62–#64 and later releases. Reproduce current defects before reopening historical fixes. The earlier live request-table repair must not be replayed.

Inventory every public route, localized/dynamic template, shared component and authenticated Studio workspace. Include loading/empty/error/permission/draft/publish states. For each legacy feature record:
- Old route/component/data source and observable behavior.
- New equivalent and missing behavior.
- Exact visual/functional target.
- Protected exception or necessary secure adaptation.
- Implementation files, dependencies and validation.
- Status and evidence.

Never label an omitted feature "unnecessary" without a real conflict or owner decision. Source/API parity and visual parity are separate checks.

### 2. Faithful visual reconstruction

Capture matched old/new screenshots at 1920, 1440, 1200, 992, 768, 512, 390 and 320 px, including viewport height, browser/DPR, route, interaction state and content fixture.

Port the old:
- Header, menus, mobile navigation, footer and section navigation.
- Section layout/sequence, type hierarchy, spacing and proportions.
- Product/category cards, detail galleries, filters and saved-piece behavior.
- About/process/material storytelling, journal/project/testimonial/FAQ/contact layouts.
- Studio sidebar, dashboard, tables, editors, forms, dialogs and feedback.
- Motion, scroll timing, media transitions, hover and focus behavior.

Build reusable primitives to reproduce those specifics. Do not force a new composition onto every page. Fullscreen sections, gradients and parallax must serve the old-reference match; they are not a license to invent unrelated effects.

Keep content-safe min-heights, readable overlays, keyboard operation, reduced-motion alternatives, touch fallbacks and listener cleanup. Public pages can be cinematic; operational interfaces must remain usable. Record any security/accessibility adaptation and demonstrate equivalent visible behavior.

Produce side-by-side views and an exception register. Do not claim literal pixel equality where protected logo/color/content differ. After deterministic fonts/assets and motion settling, investigate meaningful visual differences rather than hiding them with broad masks.

### 3. Complete Studio and public feature parity

Discover actual modules rather than relying solely on this example list:
- Overview, analytics, inquiries/orders/commissions, follow-ups, activity and production tracking.
- Products, categories, variants/customization, media, bulk import, catalogue fill, exports and research.
- Scraper sources/runs/review/shortlists/imports and quality/health views.
- Site copy, images, section design, navigation/languages, process/materials and commission forms.
- Journal, portfolio, testimonials, FAQs, pages, landing pages and editorial ordering.
- Settings, SEO, staff, account/password requests, subscribers, content health and remaining modules.
- New catalogue selection, templates, generation and history.

Reinstate every discovered legacy capability by default. For payment/account/message integrations, implement and test the needed local or sandbox behavior; activation, real charges, new accounts or outgoing communications require appropriate credentials and explicit action authority. Do not silently drop the feature or perform the external action during testing.

Preserve product discovery → customization/brief → saved inquiry → Studio access → prepared WhatsApp message → manual customer send. Any genuinely conflicting legacy flow needs an explicit migration decision.

Verify roles, forms, validation, persistence, filters, sorting, pagination, bulk operations, loading/error/retry, unsaved changes, revisions, preview and publication. A hidden menu entry and a working backend are different facts.

### 4. Database merge and backend

Create field/entity mappings with types, transforms, match rules, IDs, relationships, defaults, protected fields and conflict actions. Avoid matching by title alone.

Build dry runs, idempotent jobs, transactions/resumable batches, duplicate detection, count/digest comparisons and revision checks before writing. Preserve translations, drafts, history, crops and associations. Account for every source entity.

Rehearse migration and restore on isolated data. Use schema expansion/backfill compatible with old/new app versions. Make rollback preserve post-migration writes; do not blindly drop populated tables or columns.

Reuse existing structures for scraper observations/review, media provenance/derivatives, catalogue snapshots/jobs/templates and migration ledgers where suitable. Do not import old auth secrets.

Prepare production migration as a separate exact reviewed operation with target identity, backup, affected rows/fields and rollback. No production execution is implied merely by writing migration code.

### 5. Media, owned work and genuine content

Inventory accessible Drive/Photos files recursively; record source IDs, actual formats/dimensions, duplicates and product associations. Preserve originals and sharing settings. Use actual source images rather than generic substitutes for my work.

Inspect before editing. Create cutouts, corrected lighting/backgrounds, consistent crops, detail images and website/catalogue variants. Preserve real shape/material/proportions; generated environments or variants must be distinguished from documentary installations. Use appropriate image-generation/editing tools when recreation is required.

Provide image fields, selection/upload, preview, focal point, alt/caption and delivery for categories, products, blogs, projects, testimonials, landing pages and suitable sections. Use video posters and optimized delivery; avoid loading all videos at once.

Support product/project name, description, image, linked record, genuine review text, display name, rating and evidence. Do not infer customers/reviews/ratings from photographs. Show product imagery alongside a genuine testimonial when no portrait exists. Keep fictional/concept labels until real evidence justifies a changed status.

### 6. New vendor/competitor sources and scraper

Use Google, Pinterest discovery and worldwide relevant brands/makers. Verify canonical primary sources and deduplicate current domains. Record supplier/competitor/reference classification, country, categories, available prices/currencies, extraction method, reuse constraints, last verified date and adapter state. A candidate supplier is not an established partnership.

Restore the old scraper capabilities, then extend:
Source → raw observation → normalized candidate → review → approved import/export.
Keep external research separate from owned/current public products.

Implement supported API/feed/page adapters, pagination, bounded requests, normalization, units/currency, timestamps, duplicate/change detection, confidence, retry, cancel, resume, logs and health. Protect fetches against internal-network/redirect requests, unbounded bodies and unsafe content. Treat scraped text as untrusted.

Respect source access and reuse conditions; do not bypass credentials or anti-bot challenges. Do not republish competitor imagery as Rivya-owned work. Source discovery is not a tested integration. Prove each adapter marked operational through its complete downstream flow.

### 7. Automatic premium catalogue system

Required flow: select categories/products → customize → preview → generate → obtain editable Slides and PDF.
Required outputs: Google Sheet, editable Google Slides, premium PDF, optional PPTX.

Studio controls: search/select all/exclude, custom ordering, variant selection, image choices, template/preset, cover/intro, page format, language, fields/prices visibility, progress, retry, cancellation, history and download links.

Website DB remains authoritative. Snapshot each job's product/variant IDs, actual values, media, overrides, order, settings and template version. Catalogue-specific Sheet edits cannot silently change website prices/products. Preserve missing versus zero prices; never invent specifications.

Sheets structure: Settings, Products, Variants/Specifications, Assets, Layout, Job Status/Errors (or documented equivalent).
Build versioned Apps Script/backend integration with authenticated dispatcher/owned queue, least-needed access, job IDs, concurrency locks, batching, checkpoints, retries/backoff and duplicate-safe outputs. API updates must use an explicit dispatch path; do not assume a user edit trigger fires for backend writes. Handle expired authorization, quotas and export limits using current official documentation.

Read private images using authorized mechanisms without making source folders public. Keep secrets out of Sheets/public clients/Git. Clone the master template per job.

Premium master layouts: cover, brand intro, category divider, product detail/grid, variant/spec table, genuine project/testimonial, contact/closing. Match protected branding and restored website style. Handle long text/many variants by fitting or adding pages, not unreadable shrinkage. Use consistent grids/margins, typography, images, page numbers and product links. Figma/Canva may supply optional design references; automation cannot depend on manual slide assembly each run.

Test one/many categories, inclusion/exclusion/order, variants, hidden prices, long text, image proportions, missing fields, 50+ products or isolated fixtures, interruptions/retries, actual editability, PDF accessibility/readability and download permissions. Render/inspect actual exported pages; do not certify a PDF from its existence alone. Generation does not authorize customer distribution.

Official implementation references:
- https://developers.google.com/apps-script/guides/slides
- https://developers.google.com/apps-script/guides/services/quotas
Check current Sheets/Drive/Slides limits and supported export paths at implementation time.

### 8. Content population and comprehensive useful filters

Target approximately 50+ meaningful entries per eligible content/research collection where available owned evidence supports it. Exercise every eligible Studio list/data-entry family with isolated 50+ row fixtures spanning statuses, combinations and boundaries. Do not fabricate public reviews/orders/customers/projects or pad roles/settings/navigation to reach 50.

Track existing, migrated, new verified, draft, researched and synthetic counts separately; report shortfalls. Protected products receive permitted enrichment or staged old-only additions.

Filters by real fields:
- Products: category/type/material/size/price/publication/customization/media.
- Projects: category/material/date/status/actual versus concept/images.
- Testimonials: linked record/genuine rating/verification/date/publication/image.
- Content: topic/tags/language/author/date/state/missing media.
- Media: source/type/format/dimensions/orientation/provenance/associations.
- Operations: stage/assignee/date/follow-up/privacy scope.
- Scraper: source/country/category/run/duplicate/review/confidence/currency.
- Catalogue: state/creator/date/template/categories/count/output.

Provide combined filters, search, sort, reset, correct counts, pagination and appropriate saved views. Use server-side queries/indexes for large collections.

### 9. Useful Markdown and rules migration

Inventory old Markdown and preserve applicable architecture/scraper/setup/content/operations knowledge. Map old path → purpose → new path → retain/revise/archive. Correct obsolete paths, schemas, commands and environment assumptions. Do not copy credentials or treat an old prompt as fresh authorization.

Put this exact-restoration owner override above contradictory historical project instructions. Keep old decisions dated rather than deleting evidence. Update canonical current docs rather than proliferating competing plans.

### 10. Audit closure, testing and release

Use the seven-phase plan. Fix P0/P1 and relevant P2 defects with reproduction and before/after evidence. Run applicable lint/type/unit/preflight/build/runtime/E2E commands after checking scripts. Associate every result with revision/environment.

Check routes, errors/permissions, actual persistence, media, links/SEO, localization, protected fields/login, keyboard/dialog/focus, reflow/zoom, reduced-motion and eight widths. Retain screenshots/traces/private data locally, ignored by Git.

Measure repeated cold desktop/slower-mobile LCP/CLS/TTFB/interaction costs, bundle/media/font weight and motion cleanup. Investigate LCP <=2.5s, CLS <=0.1, INP <=200ms with conditions disclosed; lab timings are not field p75. Keep unavailable device/native-reader/provider acceptance open.

Prepare focused commits and detailed PRs. In the current handoff chat only documentation publication is authorized. In the implementation chat, release only within its explicit authority; do not inherit blanket permission for future production data replacements/publication/payments/messages from this document. Verify exact commit/checks/deployment and live affected journeys after any authorized release.

## F — FORMAT

Initial response after inspection: baseline, protected exceptions, full parity inventory, verified issue backlog, database/media/conflict approach, exact seven-phase plan and immediate work.

Per phase: objective, task IDs, actual files/routes/data, dependencies, deliverables, evidence, risk/recovery, status. Make routine transitions within approved scope without unnecessary approval questions; show preview/evidence at checkpoints.

Maintain/update canonical docs for protected baseline, feature parity, visual exceptions, field mapping/conflicts, migration runbook, media provenance, sources/adapters, catalogue automation, content/filter coverage, legacy documentation manifest, issue register, verification and release/recovery.

Final tables:
1. Phase | planned | implemented | verified | remaining.
2. Old page/feature | destination | visual match | behavioral match | exception/evidence.
3. Source entity/field | treatment | counts | conflict | validation.
4. Module | existing | migrated | new verified | drafts | QA fixtures | shortfall.
5. Requirement | status | evidence | remaining action.

Include verified Sheets/Slides/PDF links, screenshots/local gallery, changed docs/scripts, exact test results, git/PR/deployment status and protected-baseline comparison. Never upload raw private test evidence with source.

Statuses: NOT_STARTED, IN_PROGRESS, IMPLEMENTED, VERIFIED, BLOCKED, DEFERRED, PUBLISHED, RELEASED. Historical test counts are not fresh passes.

## T — TARGET

The new public site and authenticated Studio must feel and behave like the old site, with all legacy features accounted for and restored, subject only to the explicit protected exceptions and documented necessary secure adaptations. This is not another discretionary redesign.

Success means working parity, preserved current products/content/login/identity, traceable legacy data, usable media, genuine showcases, tested scraper sources, automatic editable luxury catalogues, meaningful content/filter coverage and verified fixes. Do not claim completion from navigation, mockups, test fixtures or exports alone.

Start with Phase 1 using [PHASE-WISE-PLAN.md](PHASE-WISE-PLAN.md). Present the inspected plan, then execute the authorized local/isolated work systematically. Keep the owner informed and continue until that scope is delivered or a concrete external dependency blocks it. Production writes/releases require the authority explicitly granted in the execution chat.
