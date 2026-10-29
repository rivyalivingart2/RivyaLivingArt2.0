# CRAFT MASTER PROMPT — RIVYA LIVING ART
## Netlify hosting, no separate database by default, Google Sheets + Drive, and completion of all remaining work

Revised owner direction: 28 October 2026. This is a complete implementation brief and new-chat continuation prompt. It does not claim that the work below is already implemented, migrated or released.

## C — CONTEXT AND OWNER DECISIONS

Continue RivyaLivingArt2.0 from its actual latest state. Audit completed work, preserve it, and finish the remaining website, authenticated Studio, Google integration, scraper, catalogue, media, content and verification work.

### 1. Hosting and storage direction

- Use **Netlify** for the public website, authenticated Studio, application server routes/functions, previews and production deployment.
- The public address is **https://www.rivyalivingart.com/**. Keep GoDaddy as the domain registrar and preserve the working DNS and email configuration.
- My preferred architecture has **no separately connected database service**. Use **Google Sheets for editable structured records** and **Google Drive for managed files**, with secure server-side access.
- Sheets and Drive are persistent storage. “No database” does not mean that records, security state or jobs may disappear between requests.
- **If a requirement genuinely needs a database, you may use a suitable ongoing free-tier database tool under this conditional instruction.** First document the specific requirement, evidence that the Sheets/Drive approach cannot meet it reliably, the narrowest necessary scope, current free-plan limits, backup/export options and failure behavior.
- Do not add a database merely for convenience or because a template provisions one automatically. Do not force authentication, concurrency or durable jobs into Sheets if the result is unsafe or unreliable.
- Prefer avoiding a new provider. An existing database may be retained for a justified limited role only if its ownership, ongoing free tier and independence from the Vercel resources being retired are verified.
- Do not treat “Netlify Database” as database-free or unlimited free storage: it is a database and is subject to the applicable Netlify plan and usage limits.
- No paid database, paid upgrade, trial that becomes paid, automatic recharge or increased billing commitment without my explicit approval. Where requirements exceed free limits, report the measured limitation and alternatives.
- Design for a final application that does not require Vercel hosting or Vercel-owned storage. Existing services remain protected during migration and recovery.

Choose one authoritative store for each record type. If a free database exception is necessary, name exactly which entities it owns. Sheets may be an editable staging interface, mirror or catalogue input for those entities; do not describe both systems as simultaneously authoritative. Define conflict handling and synchronization explicitly.

### 2. Project references

- Repository: https://github.com/rivyalivingart2/RivyaLivingArt2.0
- Public website: https://www.rivyalivingart.com/
- Protected Studio: https://www.rivyalivingart.com/studio/login
- Netlify project: rivyalivingart
- Old reference source: https://github.com/rivyalivingart2/OLDWEBSITE
- Old website/reference: https://oldwebsite-one.vercel.app/
- Old authenticated Studio reference: https://oldwebsite-one.vercel.app/studio/login?callbackUrl=%2Fstudio
- Google owner account: **rivyalivingart2.0@gmail.com**

OLDWEBSITE remains a source and design reference. Its Vercel URL does not make Vercel the target hosting platform. Do not delete that reference as part of retiring the new website’s Vercel resources.

### 3. Protected design, content and access

Preserve the approved current public website, including its homepage, Rivya / Creations, The Signature, footer, responsive behavior, navigation, typography, spacing, animations and interactions.

Restore the **authenticated Studio** using the old Studio’s layouts and complete workflows. Preserve the **current Studio login appearance, credentials and behavior**, including request-access, recovery, validation, loading, failure and motion states. Do not redesign the public website or login while replacing their data access.

Preserve:

- Logo, main brand colour, contact information, social links and WhatsApp details.
- Existing products, identities, URLs, titles except traceable approved corrections, prices, variants and valid populated content.
- Customers, inquiries, orders, histories, permissions and valid relationships.
- Original files, selected edited images, attribution, provenance and privacy.
- Existing local work, branches, reviewed changes and useful documentation.

**Add no products. Import none of the archived catalogue or Sheets lists.** Do not recreate the previously listed 64,496 archived rows or the separate owner-sheet export. Those exclusions override older bulk-import requests. Do not replay the completed request-table repair.

The old database was deleted. Do not invent its records or present source code, fixtures or archived catalogues as a recovered database. Map surviving fields and genuinely available permitted evidence; record unavailable data honestly.

### 4. Existing media to reuse

Reuse the owner-selected Drive image set already prepared in the website’s colours and Studio’s portrait 4:5 format. Do not replace it with the later rejected cutout collection or regenerate the approved images unnecessarily.

Approved sources:

- Owner creations: https://drive.google.com/drive/folders/1s-CO-_Yk0FMg-mq2FwHtCPV__kEan6h4?usp=sharing
- Website images and video: https://drive.google.com/drive/folders/1P2HCTmPge6HsEwtoo-xGEzPTSn68oZOW?usp=drive_link

Google Photos duplicates the Drive material and is excluded from further collection work. Use Pinterest, Google and worldwide references for research only; do not present third-party work as mine.

## R — ROLE AND WORKING METHOD

Act as the implementation engineer, migration engineer and verifier. Inspect real code and deployed behavior; complete working workflows, not just plans, labels or mockups.

Read current AGENTS.md, PROJECT_STATE.md, PRODUCT.md where present, README and relevant audit reports. Read:

- docs/google-workspace-2026-10-24/OWNER-BRIEF.md
- That folder’s PHASE-PLAN.md, ARCHITECTURE.md, SANDBOX-CHECKPOINT.md, PHASE-2-CHECKPOINT.md, ANTIGRAVITY-HANDOFF-CHECKPOINT.md, SERVICE-PLACEMENT.md, migration dictionaries and verification receipts.
- docs/hosting/netlify/MIGRATION.md
- Relevant exact-restoration decisions, feature inventories and checkpoints.

This revised instruction supersedes conflicting Vercel-hosting directions, the older absolute prohibition on any database, and older public-redesign or archived-import instructions. Preserve historical documents as dated evidence and update the active instructions clearly.

Use a suitable existing codex/ branch or isolated worktree. Preserve uncommitted work. Do not start from main in a way that loses the Netlify migration.

Continue routine local and isolated work without repeated phase-start questions. This prompt permits the justified free-database exception described above; it does not authorize paid services, destructive production changes, secret rotation, external messages or deletion of provider resources. Prepare those concrete actions for the authorization appropriate to their exact scope.

## A — ACTION

### 1. Refresh the baseline before implementation

Inspect repository branches, working trees, open PRs, production source revision, Netlify deployment configuration, domain/TLS, authenticated Studio, data contracts, Google resources, images, scraper/catalogue code and existing tests.

The following is a **dated 28 October audit baseline to refresh**, not a substitute for current verification:

- Main was 35f99fd9b5fd1b76333d92b4ddf3b90289c99b2a. Netlify work was on codex/netlify-hosting-migration at 7b390d558b9a48d5ec7ccedb8bab104f6b1411f9 in open draft PR #71: https://github.com/rivyalivingart2/RivyaLivingArt2.0/pull/71.
- Production was a ready, manually locked Netlify deployment from that branch. The owner confirmed Studio login. The www site, HTTPS and apex-to-www redirect worked.
- Production still used Neon/PostgreSQL and Vercel Blob. Read-only inventory found 22 tables and 3,454 rows, including security state. All 3,425 business rows across 20 tables matched the earlier fingerprints.
- Vercel Blob held 92 editorial files. The approved collection contained 169 images / 507 variants; its local hash and dimension checks passed.
- Google production connection settings were absent in Netlify. The application still defaulted to PostgreSQL. Changing a provider flag alone would not complete the backend.
- Four private Google workbooks and a controlled writer already existed. A sampled record was an isolated acceptance probe, not proof of migrated business data.
- Search indexing, order intake and message retry were disabled. The default Netlify hostname still served pages instead of redirecting to www.

Create a feature/status matrix using: **verified complete; implemented but unverified; partial; missing; broken; blocked**. Keep code, local tests, real-provider tests, preview, production, migration and release evidence separate.

### 2. Fix misleading completion evidence

Audit and repair these known findings if still present:

- Production acceptance returning READY_FOR_RELEASE without actual providers or evidence.
- Integration checks reporting success with zero network calls.
- Backup/cutover reports using synthetic 15-row-per-table counts.
- Catalogue workers inventing Slides/PDF identifiers and estimating output bytes.
- In-memory operations, security, scraper or job stores presented as durable storage.
- Google adapter setters that are never initialized while routes continue calling studioDb().
- A proposed Google throttle race allowing two concurrent attempts at a limit of one.
- Media delivery authorizing broad path prefixes without validating the registered file and its visibility.

Keep useful simulations, but label them as simulations. Missing credentials, skipped tests and absent measurements must never become passing acceptance results. Do not imply that a defect in an unfinished Google path proves the current working SQL login is broken.

### 3. Define the free-first architecture and service placement

Use the following default responsibilities:

| Responsibility | Preferred location |
|---|---|
| Website, Studio, server routes, previews, deployment | Netlify |
| Editable content and operational records | Private Google Sheets |
| Uploads, originals, managed media, documents, backups, generated outputs | Google Drive |
| Controlled Sheets writes and suitable bounded Google jobs | Google Apps Script |
| Editable catalogue layouts and presentations | Google Slides |
| Source, PRs, tests, release history | GitHub |
| Domain registration and existing DNS records | GoDaddy |
| Proven persistence gap that requires a database | Narrowly scoped, verified ongoing free-tier database |
| Historical source and protected recovery resources | Existing providers until safely retired |

Keep Google configuration in Google, hosting settings in Netlify, source/reviews in GitHub and retirement actions in the relevant old provider. Do not continue creating new Vercel deployment infrastructure.

Before selecting storage, document record volumes, read/write rates, concurrency, privacy, transaction needs, retention, latency and recovery requirements. Verify current free-tier eligibility and real usage limits, including shared Netlify credits, Google quotas and Drive capacity. No assumption of unlimited free operation.

Use separate workbooks or equally effective permission boundaries for content, operations, security and system data. Hidden tabs and protected ranges are not confidentiality boundaries. Reuse existing registered resources; do not reset workbooks or create duplicate installations.

Give records stable IDs, schema versions, revisions, timestamps, status and relationships. Escape formula-leading user text. Define normalization, validation, pagination, conflict resolution, deletion/archive rules and exportability.

### 4. Implement secure writes, publication and durable jobs

Keep credentials and provider access on the server. Browsers must not receive service credentials, workbook secrets, signing keys or unrestricted private-file access.

Verify the existing Google authorization and private registry without exposing them. A temporary OAuth Playground access token is not a production authentication strategy. Implement a supported renewal/credential lifecycle with least-privilege access, private secret storage, expiry monitoring and tested recovery. Preserve existing signed-writer restrictions; expanding the endpoint, scopes or resource allowlist requires authority for that exact change.

Reuse and finish the controlled writer. Each mutation must authenticate, authorize, validate, check the expected revision, enforce idempotency, apply the change, and record an audit/history result. Verify behavior when interrupted between those steps; Sheets is not a general transactional database.

Use the chosen provider’s real concurrency guarantees. An Apps Script lock does not stop direct owner edits or unrelated API clients. Route direct Sheet editing through a clearly documented staging/validation/publication process, or implement equivalent reliable conflict detection.

Publish coherent, versioned public snapshots that contain only approved public fields. Serve the last valid version during temporary provider failures. Batch/cache public reads so each page view does not query multiple Sheets. Invalidate caches after publication and test Netlify’s actual behavior.

Persist jobs, leases, fencing tokens, checkpoints, retries, cancellation and verified output references. Jobs must survive cold starts, redeploys, duplicate deliveries and worker interruption. No process-local Map or temporary file as the authoritative job store.

Choose Netlify or Apps Script execution according to measured free-plan/time limits. Break large jobs into bounded resumable steps; keep slow provider calls outside critical write locks. Never claim background scheduling is durable merely because a function exists.

Complete the five outstanding real-provider checks: ordinary-editor protection, concurrent owner/API edits, actual mid-script interruption and quarantine, independently expired leases, and real quota/rate-limit handling. Use safe bounded tests; do not exhaust a live account’s quota to manufacture evidence.

### 5. Preserve authentication while replacing its persistence

Keep the current Studio login screen and working access intact. Preserve staff identities, roles and permission checks; migrate password hashes or other supported credential representations safely.

Store password hashes, session identifiers, recovery material and throttling state in a private security store. Never place plaintext passwords in ordinary Sheets. Keep STUDIO_ADMIN_ID, STUDIO_ADMIN_PASSWORD, STUDIO_SESSION_SECRET and other runtime secrets private in the appropriate Netlify contexts.

Verify expiry, revocation, secure cookies, host handling, request-access approval, one-time links, recovery, role restrictions, simultaneous attempts and failure behavior across separate workers. A client-side check is not authorization.

If Sheets cannot meet the demonstrated atomicity or security requirement, apply the authorized free-database exception to the smallest necessary scope. Do not silently weaken access protection to avoid a database.

Preserve active sessions where securely feasible. Document unavoidable reauthentication before cutover; do not silently rotate credentials or reset accounts.

### 6. Rehearse data and media migration

Keep the current source authoritative until a verified cutover. First create protected, verifiable backups and rehearse in isolated targets.

Map actual records field by field, including IDs, URLs, prices, variants, populated values, statuses, dates, histories, references and media. Reconcile counts, canonical record hashes, foreign keys and relationships stored inside JSON. Track conflicts without blindly overwriting valid content. Title changes must be traceable.

The previous mapping listed 28 tables while the live inventory had 22. Explain absent tables; do not manufacture records or re-run old repairs to make counts match.

Do not add products or import archived catalogues. Missing old data remains unavailable unless a genuine permitted source exists.

Copy necessary Vercel Blob files into the chosen final file store before retiring Blob. Verify bytes/checksums, MIME type, dimensions, ownership, privacy and every affected reference. Preserve originals and the approved derivatives.

Implement uploads, viewing, downloads, replacement, archive, retry, video playback and orphan handling. Private references require authorization; public media must have deliberate publication rules. Do not depend on expiring Drive links as permanent public image URLs without a tested delivery strategy.

Existing repository-served public images may remain there. Do not move working images solely to claim a migration. Preview environments must use isolated or appropriately redacted records and must not write to production.

### 7. Reconnect the public website and complete Studio

Preserve the approved public design and routes while replacing storage access. Verify products already present, galleries, categories, blogs, projects, testimonials, search, contact forms, inquiries, order requests, subscriptions and other existing workflows.

Persist a form submission successfully before reporting success. Keep entered values when saving fails. Preserve legitimate guest-reference links and privacy controls.

For authenticated Studio, inventory and implement every relevant old module: dashboard, products/variants/categories, orders/inquiries/follow-ups, customers, staff/access, media, content/editorial, projects/testimonials, scraper/research, catalogue builder, settings and audit/history.

Verify create/edit where allowed, save, reload, validation, roles, draft/publication, filters, sorting, pagination, counts, reset, appropriate bulk actions and recoverable errors. Respect the no-new-products instruction while developing and testing existing product editing.

Match the old authenticated Studio’s structure and interactions, documenting valid protected exceptions. A menu item, route, registry entry, screenshot or status label is not a completed workflow.

### 8. Complete media, truthful content and filters

Verify and reuse the 169 approved images and their variants; refresh the inventory if it has changed. Preserve the 4:5 delivery format and existing Studio sizes. Correct only demonstrated defects.

Provide appropriate images for categories, blogs, projects and testimonials. Map each asset to genuine content with useful alt text, provenance and publication status.

Use real customer names, reviews, ratings and project history only when supported. AI presentation images are not evidence of a customer testimonial or completed sale.

Aim for meaningful 50+ record/content coverage where genuine permitted records exist. Where they do not, report the shortfall and use isolated labelled fixtures for test coverage. Never create fictitious live products, customers, orders, reviews or analytics to reach a count.

Complete relevant combined filters, search, date/status/category/source/price/media filters as applicable, sorting, reset, pagination and accurate result counts.

### 9. Complete worldwide research and scraper workflows

Audit and reuse existing source registries and adapters. Research legitimate vendors and competitors across relevant countries/categories, keeping source ownership and readiness explicit.

Implement bounded acquisition, pagination, extraction, normalization, deduplication, change detection, provenance, validation, review, retries, cancellation and checkpoints with durable jobs.

Distinguish discovered, configured, tested, blocked and operational sources. Respect access restrictions and reasonable rate limits; do not bypass controls.

Keep third-party research candidates separate from owned inventory. No automatic product creation or archived imports. Provide reviewed handoffs only within the permitted scope. A read-only source explorer is not a working scraper.

### 10. Complete real Sheets → editable Slides → PDF catalogues

Reuse existing scripts, templates and layouts after verifying them. Allow selection of existing categories/products/variants, ordering/exclusion, optional prices/specifications, language, page format, cover and template customization.

Read a validated catalogue input from Sheets. If a justified free-database exception owns an input entity, create a versioned Sheets projection first; do not maintain conflicting product masters.

Freeze the selected input, keep catalogue-specific overrides separate from canonical product data, copy a real editable Google Slides template, populate the actual layouts, export a premium PDF, save both outputs in Drive, record verified IDs/status and return working Studio links.

Match the approved website’s ocean, obsidian and champagne palette. Check image quality, legibility, spacing, long names, pagination, missing imagery and print/export quality.

Test single-product, single-category, multi-category and large catalogues. Verify the actual presentation remains editable and the PDF opens/downloads. Test expired authorization, interruptions, retries and duplicate requests. Invented IDs, empty files or estimated output hashes are failures.

### 11. Complete Netlify hosting configuration

Inspect and preserve the existing working site before changing settings:

- Correct production branch, build/runtime versions, Next.js integration, functions, image handling, caching, revalidation, redirects and scheduled work.
- Secure environment-variable contexts for production versus previews; secrets must not enter client bundles.
- www.rivyalivingart.com as canonical HTTPS domain and the apex redirect.
- A path- and query-preserving redirect from the default production Netlify hostname once the custom domain works. Keep independent previews usable.
- Existing DNS nameservers and unrelated email MX/TXT/SPF/DKIM records.
- Intended indexing, order-intake, retry and publication settings, with their current disabled state reported rather than silently switched.

The platform’s default netlify.app hostname is not a separate website that should be deleted. Make the custom domain the visitor-facing address and redirect the default hostname; do not delete the Netlify project or break its DNS target.

Do not change GoDaddy DNS again merely because older instructions describe a migration already completed. Verify current values first.

Reconcile the migration PR, main and production branch/lock. Use a focused PR with accurate scope, tests, migration/rollback notes and unresolved limitations. Follow the authorized review/merge/release process; do not direct-push main or claim a release from a build alone.

### 12. Verify actual behavior and prepare cutover

Test the complete path: browser → authenticated server route → real authoritative storage → reloaded UI. Test publication through to the public website.

Capture real comparisons at **1920, 1440, 1200, 992, 768, 512 and 320 pixels**. Include public homepage, Creations, Signature, footer, login and authenticated Studio. Check keyboard access, focus, reduced motion, errors, long content, loading, empty states and performance.

Test cold starts, independent workers, concurrent edits, lease expiry, partial writes, provider outages, quota handling, expired credentials, upload failures, retries and replay protection. Separate automated results from native-reader, physical-device or real-user evidence.

Prove the final architecture in an isolated production-like Netlify environment without obsolete Vercel/SQL/Blob credentials. If a free database exception is approved by this brief and justified, keep only that documented store; removing all database credentials is not the test for that architecture.

Before production cutover: verify backups and restore, control writes or capture intervening changes, reconcile the final delta, switch authority coherently, verify deployment/auth/media, and record the exact revision.

Recovery must account for writes made after cutover. Do not fall back to a stale old database and lose newer records. Production migration, publication and destructive removal require the applicable exact authorization.

### 13. Retire Vercel only after independence is demonstrated

Inventory the new website’s old deployments, Git integration, domains, schedules, webhooks, Blob storage, database integrations, credentials, billing relationships and provider-specific runtime packages.

Prepare a resource-by-resource retain/migrate/disable/delete plan. Keep verified backups and recovery access. Confirm that the free database, if used, can continue independently of any Vercel project or marketplace integration being removed.

Do not delete Vercel Blob, Neon resources, integrations or the Vercel project while live code still depends on them. Do not delete OLDWEBSITE. Obtain the required specific approval for destructive retirement after showing the reconciled data/media and working replacement.

Next.js itself does not need to be removed merely because it originated at Vercel. Remove actual runtime dependencies and obsolete deployment instructions, not working framework code or historical evidence.

## F — PHASES, REPORTING AND HANDOVER

Continue the existing Phase 0–11 structure. Correct statuses using evidence; do not restart completed foundations or declare later phases complete because documents exist.

| Phase | Scope | Acceptance |
|---|---|---|
| 0 | Current-work audit | Actual revisions, deployments, protected baseline, feature and dependency register |
| 1 | Remaining-work architecture | Sheets/Drive-first design, justified free-database decision, quotas, permissions, migration and detailed plan |
| 2 | Google/Netlify foundations | Real controlled writers, document support, durable jobs, secure credentials and provider checks |
| 3 | Migration rehearsal | Actual permitted records/assets reconciled; conflicts and restore checkpoint |
| 4 | Backend replacement | Working auth, public data/forms, publication and private media on the chosen architecture |
| 5 | Authenticated Studio restoration | Complete workflows and old-Studio parity; public/login designs preserved |
| 6 | Media, content and filters | Reused approved images, truthful associations/counts and functional filters |
| 7 | Scraper expansion | Durable source-to-reviewed-candidate workflows without adding products |
| 8 | Catalogue automation | Real editable Slides and verified PDFs with customization/recovery |
| 9 | Full verification | Actual provider/browser, security, concurrency, failure and performance evidence |
| 10 | Authorized Netlify cutover/release | Final delta reconciled, exact deployment verified, recovery ready |
| 11 | Handover and approved retirement | Operating guides, accurate final statuses and scoped old-resource cleanup |

For each phase record task IDs, objective, affected files/modules, data/media/auth impact, dependencies, acceptance criteria, verification method, evidence, status and remaining action. Estimate effort after inspection.

Initial outputs: current-work audit, protected design/data baseline, asset reuse inventory, feature matrix, dependency map, storage/permissions decision, migration/conflict plan, authentication/publication approach and phase-wise remaining-work plan. Then continue safe implementation.

Update active documents for owner scope, architecture, schemas, direct Sheet editing, Google setup, Netlify deployment, GitHub releases, media/provenance, authentication, publication, migration/recovery, scraper operation, catalogue templates, filters, quotas and verification.

Final handover must state:

- What was reused, newly implemented, repaired and still blocked.
- Public-design and login preservation; actual Studio workflow evidence.
- Source/target record counts, conflicts, relationship checks and media verification.
- The chosen storage authority for every entity and any justified free-database role.
- Google workbook/folder/template/output locations shared privately.
- Genuine content coverage, scraper readiness and working Slides/PDF results.
- Tests and limitations, screenshot locations, commit/PR/deployment and recovery steps.
- Which old resources remain, why, and what was actually retired.

Keep credentials, private IDs/endpoints, customer records, raw exports and private screenshots out of GitHub and chat. Use secure settings and ignored private evidence. Missing private access is a specific dependency, not permission to fabricate resources or recover browser secrets.

Keep the Codex cloud environment **unpublished** and preserve its approved restricted network settings. This is separate from the existing public Netlify website.

Report separately: **implemented; locally verified; real-provider verified; preview verified; migrated; cut over; production released; old dependencies removed; backups retained**.

## T — DEFINITION OF DONE

The approved public website and Studio login remain intact. Authenticated Studio workflows are complete and verified. Existing records, relationships and media are preserved. No products or archived catalogue imports were added.

Netlify hosts the application at www.rivyalivingart.com. Google Sheets and Drive provide the default records/files architecture. Any database exception has a demonstrated need, documented narrow authority, verified ongoing free tier and no unapproved billing commitment.

Authentication, permissions, forms, publication, uploads, scraper jobs, filters and catalogue generation work against real persistent providers, including failures and concurrency. There are genuine editable Slides and downloadable PDFs, verifiable migration/restore evidence and accurate phase statuses.

The application’s former Vercel dependencies are removed only after safe migration and authorized retirement. Completion is demonstrated by real evidence, not menu items, fixtures, synthetic counts or unconditional “ready” flags.

**Start by refreshing the actual project state and reading the current documents. Preserve completed work, then execute the remaining authorized local and isolated tasks.**

---

## Official platform references for implementation-time verification

These references inform the cost/limit checks; they do not guarantee that this owner account has a particular plan or unlimited capacity.

- Netlify plans and usage limits: https://www.netlify.com/pricing/
- Netlify Database: https://docs.netlify.com/build/data-and-storage/netlify-database/
- Google Sheets API usage limits and pricing: https://developers.google.com/workspace/sheets/api/limits
- Google Apps Script quotas: https://developers.google.com/apps-script/guides/services/quotas

At preparation time, Netlify listed a Free plan with hard monthly limits and database capability. Its database still consumes the applicable usage allowance. Google listed standard Sheets API use at no additional cost, with quota-related billing changes described for later in 2026. Verify account-specific limits and billing before implementation; do not promise a cost-free service beyond its verified allowance.
