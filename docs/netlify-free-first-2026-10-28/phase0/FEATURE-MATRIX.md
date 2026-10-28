# Studio feature and workflow register

Observed at application revision `41cda9c20947dface0b027484106d0bbcc0cdd14`, against OLDWEBSITE reference `2dd6d5de34acf3f98e611eda2e1b858ebd0da8e6`. No Studio or public UI was edited during Phase 0. See [AUDIT.md](AUDIT.md) for scope and evidence limits.

Status vocabulary: **verified complete**, **implemented but unverified**, **partial**, **missing**, **broken**, **blocked**. The matrix assesses the stated current capability, not future Google activation. No module's full live authenticated workflow is certified by its registered `active` flag. SQL is current authority throughout; all replacement-store integration and browser acceptance remain open. A limited screen is marked partial rather than accepted as complete old-Studio parity.

For every editable module, later acceptance must cover existing-record load, permission checks, actual save/readback/reload, stale-edit conflict, loading/empty/error/retry states, search/filter/pagination where offered, history/recovery and publication where applicable. Use isolated records and targets for writes. Preserve IDs, URLs, prices, variants, relationships and source evidence. Never create a product to prove an editor works.

**Later live read-only observation, 28 October:** the owner signed in normally on the current Netlify migration deployment `7b390d5`. All 36 inspected navigation routes admitted without a login redirect or generic error boundary. Initial route admission does not certify that every data request finished. Existing product search, empty state, six-page pagination, read-only selection and unchanged saved review after reload were observed; the session survived reload and all six review tabs opened without edits. Seven-width selected-editor geometry had no document-level horizontal overflow. No business mutation was submitted. See [authenticated-browser-readback.json](authenticated-browser-readback.json) and [the pending-work report](../PENDING-CLOSURE.md). Full workflow statuses below remain unverified because save/conflict/publication/recovery and old/new parity were not exercised.

| ID / module and route | Current implementation / current store | Status | Specific missing evidence or limitation |
|---|---|---|---|
| S01 Overview — `/studio` | `Operations` overview; operations API; SQL orders/settings/audit | implemented but unverified | Reconcile displayed summaries to actual records; live navigation and failure states |
| S02 Inquiries & orders — `/studio/inquiries` | `InquiryBoard`; order/inquiry APIs; SQL orders/events/inquiries/notes; Blob attachments | implemented but unverified | Actual stages, assignments, notes, follow-ups and attachments across reload; distinguish the two record families; no customer messages |
| S03 Follow-ups — `/studio/follow-ups` | Same board with due-only view | implemented but unverified | Due/timezone boundaries, assignment permissions and filtered counts |
| S04 Products — `/studio/products` | `CatalogueEditor`; workspace API; SQL catalogue/history/publication | implemented but unverified | Existing-record edit/preview/history parity; protect prices, forms, variants, URLs and authentic/demo classification; no creation/import |
| S05 Production register — `/studio/content-register` | `ContentRegister`; register/intake APIs; content inventory plus SQL drafts | implemented but unverified | Register identities and statuses must trace to real saved records; source targets are not completed content |
| S06 Editorial ordering — `/studio/editorial-order` | `EditorialOrderEditor`; ordering API; SQL content/history | implemented but unverified | Stable ranks, same-time edits, restore and actual public ordering |
| S07 All content — `/studio/content` | `EditorialLibrary` plus selected-record editor; SQL content/revisions | implemented but unverified | Selected full record, optimistic conflict, language drafts, preview/publish/hide and dependency capture |
| S08 Public media — `/studio/media` | `MediaLibrary`; media API; SQL metadata; repo images/Blob originals | implemented but unverified | Upload/replace/archive/download, references/privacy, video and recovery; inventory is not file migration |
| S09 Site copy — `/studio/site-copy` | `SiteCopyEditor`; shared content APIs; SQL content/revisions | implemented but unverified | Exact shared-copy associations, draft/published distinction, public footer/contact preservation |
| S10 Page design — `/studio/sections` | `PresentationEditor`; presentation API; SQL presentations/revisions | implemented but unverified | Real save/preview/publish/media playback; prior additive schema setup did not prove activation |
| S11 Site images — `/studio/site-images` | `SiteImagesEditor`; content/media/editorial-assets APIs | implemented but unverified | Approved image selection, original/derivative relationship and public reload without fabricated associations |
| S12 Content health — `/studio/content-health` | `ContentHealth`; content and validation models | implemented but unverified | Findings/counts correspond to actual saved records; fixes lead to exact records; no synthetic coverage verdict |
| S13 Navigation & languages — `/studio/navigation` | `SiteSettingsEditor`; site-settings API; SQL settings/content | implemented but unverified | Admin boundary, routes, menus/languages, conflicts and preview of unchanged public design |
| S14 Legacy decisions — `/studio/legacy` | `LegacyDisposition`; source disposition/reference views | partial | Historical source decisions are not recovered records; absent restoration tables and unavailable old database stay explicit |
| S15 Language review — `/studio/translations` | `TranslationWorkspace`; translation/content APIs; SQL content/revisions | implemented but unverified | English originals, native-review provenance and publication authorization; machine draft does not imply editorial approval |
| S16 Old links & publication — `/studio/route-review` | `RouteReview`; route-review API; route ledger/publication state | implemented but unverified | Real old/current URL outcomes, redirects/404/privacy and published visibility; retained aliases alone are insufficient |
| S17 Activity & logs — `/studio/activity` | `Operations` activity view; SQL audit/events | implemented but unverified | Actor/action/time/history accuracy and restricted exports across reload |
| S18 Staff access — `/studio/staff` | `StaffEditor`; workspace/access APIs; SQL staff/access requests/sessions | implemented but unverified | Admin-only grants, request redemption, revocation, concurrency and credential/session preservation; no credential resets in audit |
| S19 Atelier settings — `/studio/settings` | `Operations` settings view; SQL business settings | implemented but unverified | Protect current contact/business details, permission checks and exact revisions |
| S20 Analytics — `/studio/analytics` | `AnalyticsPanel`; analytics API; SQL inquiries/orders | implemented but unverified | Actual query/filter counts and dates; no inferred sales/customers from editorial/demo records |
| S21 Categories — `/studio/categories` | `CatalogueCategories`; membership derived from catalogue; optional editorial extension component | partial | Current membership screen does not rename/move products; extension schema not active in production; full old category workflows unverified |
| S22 Bulk import — `/studio/import` | `ConditionalWorkspace` status view; no import job; hidden from ordinary navigation | blocked | Intentionally inactive under no-products/no-archived-import rule. Do not activate product ingestion to close parity |
| S23 Exports — `/studio/exports` | `Operations` export-only view; operations/export APIs; SQL managed-export lifecycle and Blob access | implemented but unverified | Real authorized download, correct contents/redaction, expiry and retry; this is not the requested native Slides/PDF pipeline |
| S24 Research — `/studio/research` | `EditorialDesk` research view; existing content source notes in SQL | partial | No vendor fetch, persisted observations, review queue or durable scraper is run by this screen |
| S25 Content gaps — `/studio/content-gaps` | `ContentHealth` gaps-only view | partial | Current content diagnostics do not establish complete vendor/product/competitor gap workflows |
| S26 Process steps — `/studio/process` | `ContentEditor` selects `page:process`; SQL content/revisions | implemented but unverified | Exact steps/media/order and saved/published distinctions; truthful process claims |
| S27 Materials — `/studio/materials` | `ContentEditor` selects `page:materials-care`; SQL content/revisions | implemented but unverified | Exact material/care evidence, approved media and publication/reload |
| S28 Commission forms — `/studio/forms` | `CatalogueEditor` forms-only view; catalogue schemas in SQL | implemented but unverified | Existing schemas/variants, validation and intake-disabled behavior; do not submit an actual customer request |
| S29 Journal — `/studio/journal` | `EditorialLibrary` journal area plus selected editor; SQL content | implemented but unverified | Lists, filters, full content, media, draft/publication/history and truthful bylines |
| S30 Portfolio — `/studio/portfolio` | `EditorialLibrary` portfolio area; SQL content | implemented but unverified | Existing project/media relationships and evidence; no invented commissions or clients |
| S31 Testimonials — `/studio/testimonials` | `EditorialLibrary` testimonials area; SQL content | implemented but unverified | Authentic source/permission, draft/review visibility; no invented reviews |
| S32 FAQs — `/studio/faqs` | `EditorialLibrary` FAQs area; SQL content | implemented but unverified | Ordering, filtering, search, real answers and publication dependencies |
| S33 Pages — `/studio/pages` | `EditorialLibrary` pages area; SQL content | implemented but unverified | Existing address stability, full editor, dependencies and unpublished/private routes |
| S34 Landing pages — `/studio/landing-pages` | `EditorialLibrary` landing-pages area; SQL content | implemented but unverified | Stable identities/URLs, structured sections, media and public routing |
| S35 SEO — `/studio/seo` | `EditorialDesk` saved metadata inspection, links to exact editor | partial | Read-only inspection is not a complete SEO management workflow; indexing remains disabled |
| S36 Subscribers — `/studio/subscribers` | `SubscriberWorkspace`; admin API; SQL table only when enabled | blocked | Newsletter flag absent and table absent. Honest disabled-state handling exists; no subscriber/mail capability claimed or enabled |
| S37 Content lab — `/studio/content-lab` | `EditorialDesk` planning/list view over current drafts | partial | Existing notes and draft counts are not durable research automation or independent evidence approval |

Source paths, renderer mappings, literal API references and all 32 OLDWEBSITE sidebar routes are machine-readable in [source-inventory.json](source-inventory.json). API reference extraction is limited to literals in each renderer; an empty list can mean shared hooks, not no API dependency.

## Old-route parity and additional requested workflows

The old reference has 32 sidebar entries: 30 resolve through the current registry, including old `/studio/blog` → Journal, `/studio/custom-pages` → Landing pages and `/studio/users` → Staff. Current inquiries also recognize orders/kanban/enquiries aliases. Supported record child URLs redirect to exact record/create query parameters; unsupported paths are not silently admitted.

| Workflow | Status | Current evidence / next acceptance |
|---|---|---|
| Old `/studio/scraper` | missing | No current route/renderer. Map-based source scaffolding is not an operational replacement; implement durable research/review only in its later phase |
| Old `/studio/catalog-fill` | missing | No current route/renderer. Old automatic product insertion conflicts with the owner's no-product rule; do not restore that behavior |
| Native editable catalogue and PDF | missing | Snapshot/validation contracts exist; real Sheets projection, template registration, Slides copy/population, PDF export/readback and Studio output history do not |
| Customers | partial | Existing inquiries/orders contain relationships; the old sidebar explicitly had no customer-account surface. Do not invent a recovered customer database or equate inquiry count with customers |
| Workshops | partial | Old source treats workshops as a product category, not an independent sidebar route. Preserve any existing category/data; actual workflow coverage needs record evidence |
| Durable jobs and notifications | partial | Canonical job-store/lease contracts exist; deployed bounded workers, restarts, delivery/retry/cancellation and provider reconciliation remain unverified; send no messages |
| Login, access/recovery and roles | partial | Owner sign-in and session across reload now verified on current SQL authority; full role/revocation/recovery lifecycle and Google persistence are unverified |
| Responsive old-Studio design parity | partial | Actual public captures and selected-product editor geometry now cover 320, 512, 768, 992, 1200, 1440 and 1920. Capture limits remain; authenticated OLDWEBSITE reference and complete visual/device acceptance are unavailable |

The remaining work belongs to the later phases identified in the master brief. This audit does not implement it or certify old feature behavior from historical comments.
