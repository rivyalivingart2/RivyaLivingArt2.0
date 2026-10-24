# CRAFT MASTER PROMPT — RIVYA LIVING ART
## Studio Redesign, Google Sheets + Drive Migration, and Completion of Remaining Work

## C — CONTEXT

### Latest owner instruction

Continue my Rivya Living Art project using these requirements:

1. **Preserve the main public website’s current design.**
2. **Redesign only the authenticated Studio using the old Studio as the design and feature reference.**
3. **Preserve the current Studio login screen.**
4. **Remove the application’s dependence on a separate database service.**
5. **Use Google Sheets as the authoritative store for structured application data after a verified migration.**
6. **Use Google Drive for managed media, uploads, documents, generated catalogues, backups, and related files.**
7. **Before implementing anything, verify what is already completed in the current project.**
8. **Existing recreated images, working features, scripts, templates, and migrated data must be located, verified, and reused.**
9. Complete the remaining scraper, catalogue automation, content, media, filtering, migration, and QA work.

These instructions supersede earlier requirements to restore the old public website design or keep a separate database as the permanent source of truth.

Read existing project instructions and historical decisions, then reconcile owner-maintained plans with this latest direction.

### Project references

| Purpose | Reference |
|---|---|
| Implementation repository | [RivyaLivingArt2.0](https://github.com/rivyalivingart2/RivyaLivingArt2.0) |
| Public website whose design must be preserved | [www.rivyalivingart.com](https://www.rivyalivingart.com/) |
| Current Studio login to preserve | [Current Studio login](https://www.rivyalivingart.com/studio/login) |
| Old repository for Studio design and feature reference | [OLDWEBSITE](https://github.com/rivyalivingart2/OLDWEBSITE) |
| Old Studio reference | [Old Studio](https://oldwebsite-one.vercel.app/studio/login?callbackUrl=%2Fstudio) |

### Approved media sources

**My own completed products and creations:**

[Own completed resin work — Google Drive](https://drive.google.com/drive/folders/1s-CO-_Yk0FMg-mq2FwHtCPV__kEan6h4?usp=sharing)

Use suitable assets to showcase my previously created work, with product names, descriptions, associated projects, and genuine reviews/usernames/ratings where supported by evidence.

**General website images and videos:**

[Website images and videos — Google Drive](https://drive.google.com/drive/folders/1P2HCTmPge6HsEwtoo-xGEzPTSn68oZOW?usp=drive_link)

These are the supplied sources for new production-media discovery.

Use Google, Pinterest, and relevant international websites for research and design references. Keep external inspiration and competitor material distinguished from my own creations.

Preserve originals, existing source-folder organization, provenance, and approved processed assets.

### Protected elements

| Element | Requirement |
|---|---|
| Public website design | Preserve current layouts, section order, typography, spacing, colors, navigation, animations, media framing, cards, product presentation, and responsive behavior. |
| Logo and contact details | Preserve current logo identity, phone/WhatsApp numbers, email, address where present, social links, and destinations. |
| Main brand color | Preserve it across the public website, Studio, and generated catalogues. |
| Existing products | Preserve identities, IDs, slugs, prices, variants, specifications, relationships, and valid content. |
| Studio login screen | Preserve visible design, fields, labels, controls, responsive appearance, and interaction states. |
| Valid existing content | Preserve it during migration, allowing permitted additions and clearly mapped title corrections. |
| Original and approved recreated media | Preserve originals and reuse verified derivatives. |
| Completed working functionality | Retain it and integrate it into the final architecture. |

Content and imagery may be managed through Sheets and Drive and displayed through current public components. This does not authorize a public redesign.

Fix confirmed defects through targeted changes. Identify any unavoidable visible change separately.

### Meaning of “without database”

The completed application must operate without a separate application database such as PostgreSQL, Neon, Supabase, MySQL, MongoDB, Firestore, SQLite, or another SQL/NoSQL service.

Do not introduce a hidden database through an external queue, Redis service, persistent local file, or alternative backend.

Retain server/API code for secure authentication, authorization, validation, publishing, Google access, and automation.

Google Sheets and Drive must hold persistent application records and files. Temporary processing files and disposable derived caches are acceptable when rebuildable from those sources.

---

## R — ROLE

Act as a senior:

- UI/UX designer for administrative interfaces.
- Next.js/React frontend engineer.
- Google Sheets, Drive, and Apps Script integration engineer.
- Data migration and application security engineer.
- Scraper and automation engineer.
- QA and release engineer.

Use relevant installed skills, official documentation, and available tools.

Start with a read-only audit. Produce a phase-wise plan based on actual remaining work, then continue through implementation and verification.

Use parallel work where dependencies permit, with clear ownership and controlled integration.

Make routine decisions autonomously. When an action requires authorization, first prepare its exact scope and supporting evidence. Continue unaffected work while that action is blocked.

Do not stop after presenting a plan when implementation is authorized.

---

## A — ACTION

# 1. Mandatory read-only audit before implementation

Before modifying application code, data, media, or production configuration, determine what already exists and what remains necessary.

### Inspect current project state

Review:

- Latest GitHub `main`.
- Relevant working branches and open PRs.
- Local changes and uncommitted work.
- Current deployment revisions.
- Public website and authorized Studio views.
- Existing Google Sheets/Drive integration and configuration.
- Current media manifests and asset mappings.
- Existing recreated images and generated files.
- Migration scripts, exports, checkpoints, and reconciliation reports.
- Scraper adapters and source records.
- Catalogue templates, scripts, and generated outputs.
- Content population and filtering work.
- Current tests, audit receipts, and release status.

Read relevant project files where present:

- `AGENTS.md`
- `PROJECT_STATE.md`
- `PRODUCT.md`
- `README.md`
- Current audit reports.
- Documents under `docs/restoration/exact-legacy-2026-10-21/`, including the owner decision, master prompt, phase plan, and continuation instructions.

Treat historical reports as dated evidence. Verify whether their findings still apply.

Do not replay completed repairs, rebuild working modules, or regenerate existing imagery merely because an older plan lists those tasks.

### Use these audit statuses

- **Verified complete**
- **Implemented — needs verification**
- **Partially complete**
- **Missing**
- **Broken**
- **Blocked from verification**

Distinguish:

- Source present in a branch.
- Source merged into main.
- Functionality verified locally.
- Functionality verified in preview.
- Functionality deployed and verified in production.

A file’s existence does not prove integration. A visible interface does not prove persistence, permissions, or correct behavior.

### Required audit report

| Requirement or asset | Current status | Evidence and environment | Already completed | Remaining action |
|---|---|---|---|---|

Identify the revision and environment supporting each verification claim.

Then revise the phase-wise plan:

- Retain verified work.
- Schedule checks for implemented but unverified work.
- Complete partial work.
- Repair confirmed defects.
- Implement genuinely missing work.
- Record blockers and continue independent tasks.

**Every phase below must follow this audit. Do not reset completed work to “not started.”**

---

# 2. Verify and reuse existing recreated images

Some images have already been recreated or modified in the current project.

Before planning further image work:

1. Locate originals and existing derivatives.
2. Inspect media manifests, Drive folders, repository assets, and current application references.
3. Match each derivative to its source and associated content.
4. Verify whether it is already used on the website, in Studio, or in catalogue templates.
5. Check resolution, crop, proportions, loading, metadata, and desktop/mobile presentation.
6. Record the precise remaining action.

### Asset treatment

| Current condition | Action |
|---|---|
| Recreated image exists and works correctly | Reuse it and mark the applicable work verified. |
| Valid image exists but is not connected | Complete the association or integration. |
| Approved image needs another delivery size | Produce the required size from the existing asset. |
| Valid asset is stored outside the target Drive structure | Migrate the existing file and references without recreating it. |
| Image has a confirmed defect | Make a targeted correction while preserving the previous version. |
| Required image is genuinely missing | Create/edit it using the supplied Drive reference. |
| Asset or environment is inaccessible | Mark verification blocked and identify the missing evidence/access. |

Preserve the product’s real shape, materials, proportions, colors, and meaningful details.

Keep recreated environments or conceptual variants accurately classified.

Do not replace an accurate existing image solely because another stylistic interpretation is possible.

---

# 3. Establish the Sheets and Drive architecture

### Target responsibilities

| Layer | Responsibility |
|---|---|
| Current public website | Preserve its appearance and customer experience. |
| Redesigned Studio | Manage products, content, media, operations, sources, and catalogues. |
| Google Sheets | Canonical structured records, relationships, statuses, configuration, revisions, and job metadata. |
| Google Drive | Managed media, private attachments, documents, outputs, backups, and publication snapshots. |
| Server/API layer | Authentication, permissions, validation, controlled data/media access, and publication. |
| Apps Script or compatible workers | Coordinated writes, background processing, reconciliation, and automation. |
| Google Slides | Editable catalogue templates and generated presentations. |

Studio remains the convenient management interface. Provide an organized direct Google Sheets workflow for permitted owner edits.

### Workbook organization

Use actual access boundaries and project needs to define workbooks.

Suitable groups include:

| Group | Example records |
|---|---|
| Catalogue | Products, categories, variants, prices, materials, specifications, relationships. |
| Website content | Copy, image slots, existing section settings, navigation, languages, SEO, pages, FAQs. |
| Editorial | Journal, projects, portfolio, testimonials, evidence, publication metadata. |
| Business operations | Inquiries, commissions/orders, follow-ups, operational history. |
| Scraper/research | Sources, runs, observations, candidates, mappings, reviews, approved handoffs. |
| Media register | Drive IDs, originals, derivatives, associations, provenance, processing status. |
| Catalogue automation | Templates, selections, snapshots, settings, jobs, outputs. |
| Restricted identity/security | Staff, roles, credential metadata, sessions/revocation, access requests, login-protection state. |
| System operations | Schema versions, migration mappings, conflicts, audit events, publication pointers, checkpoints. |

Keep confidential information in separately permissioned workbooks. Hidden tabs and protected ranges must not be treated as confidentiality boundaries.

### Record requirements

Use stable IDs rather than spreadsheet row positions.

Define field types, required values, relationships, uniqueness rules, timestamps, revisions, publication states, source references, and archive/deletion behavior.

Store files in Drive and reference stable file IDs from Sheets.

Preserve identifiers, dates, currencies, units, slugs, and product values.

Treat imported and user-entered text as data; prevent unintended spreadsheet formula execution.

---

# 4. Implement controlled data access, publication, and jobs

### Secure access

Keep Google credentials, signing secrets, and other infrastructure secrets in protected server/script configuration.

Browsers must receive only authorized application responses. Do not expose unrestricted workbooks, private files, or credentials.

Enforce permissions on the server for every operation.

### Coordinated writes

Use one controlled mutation path for canonical application writes.

A suitable implementation may use an authenticated Apps Script writer with a shared lock and revision checks:

1. Authenticate and authorize the operation.
2. Acquire the relevant lock.
3. Read the current record and revision.
4. Check the expected revision.
5. Validate values and relationships.
6. Apply the update and increment its revision.
7. Record the result.
8. Release the lock.

Use idempotency keys to prevent duplicate submissions and job actions.

Do not assume a script lock prevents unrelated API clients or human editors from changing cells.

Support direct Sheet editing through controlled input/draft areas followed by validation and import/publish actions. Protect structural identifiers and canonical ranges.

Surface conflicts instead of silently overwriting changes.

### Public publication

Preserve draft/published separation and revision history.

Build validated, versioned public snapshots and asset manifests in Drive. Switch the active publication pointer only after the complete snapshot is valid.

Each public request must use one coherent publication version.

Only approved public fields may enter snapshots. Exclude drafts, staff/security data, private inquiries, and private attachments.

Use bounded reads, batching, caching, and explicit invalidation. A failed publication must leave the last valid version available.

Measure real quotas, latency, and concurrent-editor behavior.

### Durable jobs

Store job state in Sheets and large intermediate artifacts in Drive.

Include job ID/type, input revision, state, worker lease, checkpoint, attempts, next retry, output IDs, and error summary.

Use explicit dispatch or a controlled polling worker. Support cancellation, retries, resumability, and duplicate-safe output creation.

Perform slow scraping, media processing, and rendering outside shared write locks.

---

# 5. Replace authentication persistence while preserving the login screen

Inventory all current authentication dependencies:

- Staff identity and roles.
- Password verification.
- Account status.
- Login throttling.
- Sessions.
- Absolute and idle expiry.
- Credential-version enforcement.
- Logout and revocation.
- Access requests and recovery.

Preserve the current login appearance and normal interactions while replacing backend persistence where needed.

Requirements:

- No plaintext passwords in ordinary spreadsheets.
- Restrict access to any retained credential hashes and session records.
- Keep verification and authorization server-side.
- Preserve secure cookie behavior.
- Disabled/revoked accounts must lose access correctly.
- Login protection must work across server instances.
- Do not rely only on process-local memory for durable security controls.
- Provider failures must not grant access.
- Define session continuity or an intentional reauthentication step during cutover.

Do not introduce a different visible login method merely to simplify migration.

Verify that Studio styling changes do not affect shared login fonts, styles, wrappers, or components.

---

# 6. Migrate data and media without losing current content

### Authority during migration

- Before cutover, the current production system remains authoritative.
- Prepare and verify imports in isolated Google workbooks/folders.
- After cutover, Sheets becomes the single authoritative write destination.
- Avoid uncontrolled dual writing.
- Do not fall back silently to a stale database after Sheets accepts new records.

### Mapping

For every source field and entity, document:

| Source | Destination | Matching rule | Transformation | Preservation/conflict rule | Verification |
|---|---|---|---|---|---|

Include current database records, repository-managed business content, media storage, histories, and relevant old-only content.

### Preservation and merge rules

- Preserve current product identities, URLs, prices, variants, specifications, and relationships.
- Add missing old fields and relevant content.
- Import old-only records with provenance and suitable review/publication states.
- Match equivalent records using reliable identifiers.
- Fill genuinely missing values when supported by the mapping.
- Limit title changes to clearly mapped display-title fields.
- Preserve populated current values by default when sources disagree.
- Record proposed conflicting replacements explicitly.
- Account for every source record as migrated, merged, retained, conflicting, excluded with reason, or pending.

Do not overwrite current content with an old seed or sample dataset.

### Reconciliation

Verify record counts, IDs, relationships, important values, publication states, histories, and media associations.

Keep source exports and recovery checkpoints.

Retain the old database during preparation. Removing its active runtime dependency does not require prematurely deleting it.

### Media migration

Inventory public media and private attachments separately.

Preserve privacy, originals, derivatives, filenames where appropriate, metadata, provenance, and application associations.

Replace old storage adapters with Drive-backed implementations.

Use controlled delivery endpoints. Serve public renditions only when published; require authorization for private attachments.

Prevent arbitrary file-ID requests from exposing unrelated Drive content.

Test upload, display/download, replacement, archive/delete, retry, orphan handling, and video delivery where applicable.

Reuse existing recreated assets during migration.

---

# 7. Preserve the public website and reconnect its data

Keep the current public design unchanged.

Replace underlying data adapters while preserving rendering contracts for:

- Homepage.
- Collections and product details.
- About/atelier.
- Process and materials.
- Journal/articles.
- Projects/portfolio.
- Testimonials.
- Contact and FAQs.
- Commission/customization journeys.
- Existing content-managed pages.

Preserve routes, SEO behavior, navigation, animations, layouts, and media framing.

Feed existing components from validated Sheets/Drive content.

Public submissions must be durably saved before showing success. Retain user input when a write fails.

Compare before/after designs using the same content first. Report intentional content or image changes separately.

Restore necessary functionality through existing interface patterns. If a requested feature requires an unavoidable new public element, identify the smallest compatible addition and its impact.

---

# 8. Redesign authenticated Studio using the old Studio

Use the old Studio as the visual and interaction reference.

Restore relevant navigation, dashboard composition, typography, spacing, cards, tables, forms, dialogs, filtering, detail views, status displays, and responsive behavior.

Preserve the new main color and current login.

Scope Studio styles so they cannot affect the public website or login screen.

### Functional inventory

| Area | Modules and workflows |
|---|---|
| Operations | Overview, inquiries/commissions/orders, follow-ups, activity, analytics, production tracking. |
| Catalogue | Products, categories, variants, media, import, catalogue completion, exports, research, content gaps. |
| Scraper | Sources, runs, mapping, review, quality, shortlist/confirmed products, approved handoffs. |
| Content | Site copy, images, existing section settings, navigation, languages, materials, process, forms. |
| Editorial | Journal, portfolio, testimonials, FAQs, pages, landing pages, ordering, publication. |
| Settings | Site settings, SEO, staff/access, subscribers, content health, supported legacy controls. |
| Catalogue generation | Selection, customization, templates, jobs, previews, history, downloads. |

Audit existing implementations first. Retain working features and complete their integration.

Verify permissions, create/edit/save/reload, validation, search, filters, sorting, pagination, bulk actions where supported, and draft/publication behavior.

---

# 9. Complete media coverage and meaningful content population

Use my existing recreated images and supplied Drive creations for suitable product/project showcases.

Support appropriate imagery for categories, journal entries, projects, testimonials, and other image-bearing content through existing public layouts.

For each record, maintain appropriate names, descriptions, associations, alt text, captions, focal points, processing status, and provenance.

Use genuine review text, usernames/display names, and ratings only when supported by evidence.

A product image does not establish a customer review.

### Content targets

Retain the approximately 50+ meaningful-record target for eligible content/research collections where business scope and authentic material support it.

Track:

| Module | Existing | Migrated | New verified additions | Drafts | Test fixtures | Remaining target/shortfall |
|---|---|---|---|---|---|---|

Do not duplicate completed records to reach a count.

Alternate crops and delivery sizes are not separate products or completed projects.

Do not manufacture live customers, orders, reviews, ratings, histories, or analytics.

For small settings, navigation, and taxonomy structures, create the number the business actually needs.

Use isolated synthetic fixtures to test 50+ rows where genuine data is insufficient.

### Filters

Implement relevant filters for:

- Category, type, segment, material, size, price, status.
- Publication state and date.
- Media coverage, provenance, processing state, association.
- Source/vendor, platform, market, quality, duplicate and review state.
- Catalogue template, creator, job state, date, output availability.

Include search, sorting, reset, pagination, accurate counts, and combined filters.

Reuse working filters and repair only confirmed gaps.

---

# 10. Restore and expand the product scraper

Audit existing adapters, source records, jobs, review flows, and exports before building replacements.

Research additional relevant vendors, competitors, makers, and sources through Google, Pinterest discovery, official sites, and suitable global references.

Deduplicate domains and record:

- Name and canonical URL.
- Supplier/competitor/maker/marketplace classification.
- Relevant categories.
- Market/country where known.
- Ingestion method.
- Access/reuse constraints.
- Adapter.
- Verification date.
- Readiness status.

Use this pipeline:

**Source → raw observations → normalized candidates → review → selected downstream action.**

Store structured records in Sheets and large artifacts in Drive.

Preserve source URLs, dates, price/currency/unit information, mapping, and provenance.

Implement missing bounded crawling, pagination, retries, cancellation, checkpoints, duplicate detection, change detection, and quality checks.

Keep researched products separate from the current owned catalogue until a reviewed action is taken.

Respect source restrictions and do not bypass access controls.

Report discovered, configured, tested, active, and blocked sources separately.

---

# 11. Complete automatic Sheets → Slides → PDF catalogue generation

First inspect and reuse existing templates, scripts, configuration, and outputs.

Provide a Studio Catalogue Builder with:

- Category and individual-product selection.
- Search, filters, exclusions, and custom ordering.
- Variant selection.
- Template presets.
- Cover title and introduction.
- Language and page format.
- Image selection.
- Optional fields and price visibility.
- Preview, status, retry, cancellation, history, and downloads.

### Generation flow

1. Read selected canonical product records from Sheets.
2. Freeze a generation snapshot.
3. Apply catalogue-specific overrides separately.
4. Copy an editable Google Slides master.
5. Populate layouts, imagery, specifications, and category sections.
6. Export a premium PDF.
7. Save presentation and PDF outputs in Drive.
8. Record verified output IDs/status in Sheets.
9. Return working links to Studio.

Catalogue customization must not silently alter canonical product data.

### Visual requirements

Preserve current logo, brand color, and contact details.

Use suitable cover, introduction, category divider, product detail, product grid, specification table, and closing layouts.

Provide clear typography, spacious composition, consistent grids, and high-quality existing imagery.

Handle long content, many variants, different image proportions, and page breaks without clipping or unreadably small text.

Use genuine prices, sizes, and specifications. Show retail/bulk pricing only where supplied.

Optional Figma/Canva references may guide template design. Repeated generation must work without manual slide assembly.

### Automation

Use versioned scripts, clear setup instructions, appropriate account ownership/scopes, and explicit dispatch or a controlled queue.

Keep durable job state in Sheets and artifacts in Drive.

Support quotas, retries, checkpoints, cancellation, concurrency, and duplicate-safe output creation.

Verify current Google image/export limits and handle large catalogues through supported mechanisms.

### Acceptance

Demonstrate single-product, multi-category, customized, and large-catalogue generation.

Verify selection/order, variants, prices, images, text, editable Slides, actual PDF download, output access, and visual quality.

Exercise missing images, long descriptions, expired authorization, interrupted jobs, and retries.

Deliver script source, setup guide, template, editable presentation, verified PDF, and optional PPTX export where useful.

---

# 12. Phase-wise implementation plan

Expand this baseline after the current-work audit. Assign actual files, tasks, dependencies, and evidence.

| Phase | Scope | Required outcome |
|---|---|---|
| 0 — Current-work audit | Inspect repositories, branches, local changes, deployments, documentation, Google configuration, and existing assets/features. | Evidence-based status register and protected baseline. |
| 1 — Remaining-work plan | Define architecture, schemas, permissions, migration, auth, publication, jobs, and scope. | Detailed phase plan based on actual gaps. |
| 2 — Google foundations | Verify/build isolated Sheets/Drive interfaces, controlled writes, validation, access, and job handling. | Tested foundation without duplicating completed integration. |
| 3 — Migration rehearsal | Export/map/import remaining records and assets; reconcile values and relationships. | Migration evidence, conflicts, and recovery checkpoint. |
| 4 — Backend replacement | Complete auth, public data/forms, publication, private storage, and remaining provider replacements. | Full isolated workflows using Sheets/Drive with current public design preserved. |
| 5 — Studio redesign | Complete old-Studio visual restoration and module integration. | Verified Studio modules with no public/login styling regression. |
| 6 — Media/content/filters | Reuse assets, finish associations, fill justified gaps, complete content and filters. | Media coverage, truthful counts, working filters. |
| 7 — Scraper expansion | Reuse adapters and complete source research, jobs, review, and handoffs. | Verified source-to-reviewed-action workflows. |
| 8 — Catalogue automation | Reuse/complete templates, selection, generation, export, and recovery. | Working editable Slides and verified PDF generation. |
| 9 — Full verification | Test migration, UI, functionality, security, failures, concurrency, and performance without old providers. | Evidence tied to the release candidate; explicit limitations. |
| 10 — Cutover/release | Reconcile final changes, switch authority, complete authorized release, verify production. | Accurate deployed state and recovery readiness. |
| 11 — Handover | Update documentation, operating guides, status, and cleanup. | Complete phase-wise report and actionable remaining items. |

For each phase provide objective, task IDs, affected files/modules, data/media/auth impact, dependencies, deliverables, acceptance criteria, verification method, and status.

Estimate effort only after inspection, with assumptions.

Continue routine phases without repeated permission requests. Isolate only actions requiring a specific decision or authorization.

---

# 13. Verification requirements

### Visual verification

Capture and inspect these widths:

**1920, 1440, 1200, 992, 768, 512, and 320 pixels.**

Compare:

- Public website against its current design baseline.
- Studio against the old Studio reference, allowing protected branding differences.
- Login against its current baseline.

Cover unique templates and important populated, empty, loading, error, and long-content states.

Group duplicate product templates efficiently while checking meaningful variations.

Keep screenshots, recordings, and traces local and Git-ignored.

### Functional verification

Verify:

**Browser → server/API → Sheets/Drive → refreshed interface.**

Test authentication, roles, expiry, revocation, login protection, save/reload, direct Sheet validation, conflicts, duplicate submissions, publishing, private media, scraper jobs, filters, and catalogue generation.

Use isolated test accounts/data for mutating tests.

Do not send test messages to real customers.

### Failure and performance verification

Test concurrent edits, throttling, Google unavailability, interrupted jobs, failed writes, and recovery.

Check keyboard access, focus, form errors, text scaling, reduced motion, media loading, layout stability, and representative performance.

Run applicable lint, type checks, builds, automated tests, and browser checks.

Tie each result to its actual revision and environment. Do not relabel historical evidence as fresh verification.

### Prove removal of old runtime dependencies

In an isolated production-like environment, disable/remove access to:

- `DATABASE_URL`.
- Old SQL/NoSQL providers.
- Old Blob/storage credentials.
- Deprecated persistent-storage dependencies.

Verify complete public and Studio journeys.

A successful build alone does not prove independence.

---

# 14. Controlled cutover and release

Before production cutover:

1. Confirm backups and migration reconciliation.
2. Pause affected writes briefly or capture/replay intervening changes.
3. Reconcile the final delta.
4. Switch reads and write authority to Sheets/Drive.
5. Verify deployed workflows, public appearance, login, and media.
6. Record the exact cutover state.

Recovery must account for new records written after cutover. Do not silently switch back to stale data.

Retain old data and exports through a defined recovery window. Database deletion is a separate destructive action.

Use the project’s authorized branch, PR, preview, merge, and deployment workflow.

Prepare exact reviewable release actions when authorization is required. Do not infer fresh production authority from historical documents.

Stop task-owned background processes and completed agents when finished. Preserve unrelated services.

---

## F — FORMAT

### Initial deliverables

Provide:

1. Current-work verification report.
2. Protected public-design/login/product baseline.
3. Existing recreated-image inventory and reuse decisions.
4. Feature/module status matrix.
5. Remaining database/storage dependency map.
6. Sheets/Drive data dictionary and permissions.
7. Migration and conflict mapping.
8. Authentication/publication approach.
9. Detailed phase-wise remaining-work plan.

### Progress reports

Use:

| Phase/task | Status | Completed work | Evidence | Remaining action/blocker |
|---|---|---|---|---|

Maintain the plan as findings change.

### Documentation

Inspect existing Markdown before creating new documents.

Update appropriate equivalents for:

- Latest owner scope.
- Master implementation plan.
- Feature parity and current-work register.
- Workbook schemas and permissions.
- Direct Sheet editing.
- Drive/media management and provenance.
- Authentication and publication.
- Migration, reconciliation, cutover, and recovery.
- Scraper operation.
- Catalogue scripts/templates/setup.
- Content population and filters.
- QA and operating limits.

Carry over useful old documentation with corrected paths, architecture, commands, and contact information.

Preserve historical records as historical. Remove ambiguity between old public-redesign instructions and this Studio-only redesign scope.

### Final handover

Provide a phase-wise completion report and:

- What was already complete and reused.
- What was newly implemented or repaired.
- Public design preservation evidence.
- Studio redesign and login verification.
- Workbook/folder links and schemas.
- Migration counts, conflicts, and reconciliation.
- Existing images reused and new derivatives created.
- Content counts and shortfalls.
- Scraper source readiness.
- Catalogue scripts, editable presentation, and verified PDF links.
- Tests performed and limitations.
- Local screenshot locations.
- Branch, commit, PR, preview, and deployment status.
- Recovery instructions.
- Remaining blockers and exact next actions.
- Cleanup confirmation.

Report separately:

**Implementation complete · Verified locally · Preview verified · Sheets/Drive cutover complete · Production released · Old dependencies removed · Legacy backups retained**

---

## T — TARGET AUDIENCE AND DEFINITION OF DONE

The public website serves Rivya Living Art customers and must retain its current design.

The redesigned Studio serves the team managing the business. Sheets and Drive provide its underlying records and files.

Keep workflows clear and communicate in practical language.

### Definition of done

1. Current work was audited before implementation.
2. Completed code, media, data, templates, and scripts were reused.
3. The main public website retains its current design and responsive behavior.
4. Only authenticated Studio receives the old Studio design restoration.
5. Logo, contact details, main color, existing products, and login appearance are preserved.
6. Sheets is authoritative for structured application data after verified cutover.
7. Drive stores managed media and generated files.
8. Auth, permissions, publication, forms, uploads, and jobs work without former database/storage providers.
9. Valid records and relationships are preserved and reconciled.
10. Required old fields/content are incorporated using documented merge rules.
11. Scraper, content, filters, media, and catalogue workflows operate correctly.
12. Recreated images are reused appropriately and new image work is limited to verified needs.
13. Reviews, usernames, ratings, and project claims remain evidence-based.
14. The application is verified with old provider credentials unavailable.
15. Documentation, phase-wise status, operating guidance, and release evidence are complete.

**Begin with a read-only audit of the current repositories, branches, local changes, deployments, Google Sheets/Drive configuration, existing recreated media, and project documentation. Classify each requirement using the defined statuses and produce a phase-wise plan based on the actual remaining work. Reuse verified assets and implementations, then complete only the necessary changes while preserving the current public website design and Studio login.**