# Phase 1 execution checkpoint — 21 October 2026

Status: **BASELINE_ESTABLISHED; PHASE_1_IN_PROGRESS**. This is an evidence-backed local checkpoint, not a completed restoration, data migration, publication or release. The latest owner decision governs; the older attachment's “inspired by” and full-height design suggestions do not override exact OLDWEBSITE restoration.

## Repository and deployment identities

| Surface | Verified identity | Evidence and limitation |
|---|---|---|
| Destination main | `1936cbbe25c1c7ccd75cab82057354ae94f6ebc0` | Fetched `origin/main`; clean checkout before creating `codex/exact-legacy-restoration`. Previous branches preserved. |
| Reference main | `2dd6d5de34acf3f98e611eda2e1b858ebd0da8e6` | Fresh read-only reference clone in sibling `OLDWEBSITE-reference`; source tree left unchanged. |
| Current production | `dpl_8QzVE3qCX5gKbV5Ztw5tWiDvrvdc`, READY, destination main above | Vercel deployment listing plus aliases confirm `www.rivyalivingart.com`; public and authenticated UI inspected. |
| Old production | `dpl_71hEmTqT59ru4AqstL4gkZdJEitj`, READY, reference main above | Vercel listing plus aliases confirm `oldwebsite-one.vercel.app`; public and authenticated UI inspected. |
| Local runtime | Node `22.23.2`; Next `16.3.8`; build `R8zc8czi74gHA3JrwdQ6O` | Official Node executable hash checked against official SHASUMS. Fresh build and TypeScript build stage passed. |

No push, PR, merge, deployment, live business-record mutation or CMS publication was performed. Browsing authenticated pages uses the site's normal session bookkeeping. The already completed production access-request table repair was not replayed.

## Implemented locally in this checkpoint

- `tools/exact-legacy/inventory.mjs`: reproducible tracked-source route/entity/field/action/Markdown inventory and protected-source SHA-256 baseline. It does not import either application or read environment files or databases.
- `reconcile.mjs`: pure dry-run planner with explicit identity crosswalks, destination revision checks, field digests, title/name approval binding, conflict decisions, intentional-blank protection, deletion/erasure protection and draft staging. It has no persistence or publication path. It is a migration preparation primitive, not the Phase 3 migration engine.
- `local-guard.mjs`, `prepare-local.mjs`, `local-transport.mjs`, `run-local.mjs`: a new task-owned PostgreSQL cluster on `127.0.0.1:55443`. Environment inheritance is allowlisted; remote SQL targets and server-side external fetches are refused. Real Next routing uses a test-only Neon HTTP-to-local PostgreSQL adapter. This does not certify the real Neon transport or external providers.
- `comparison.mjs`: a local comparison viewer that serves only explicitly inventoried screenshots and its own HTML, bound to loopback. Raw screenshots, captured UI text, Drive metadata, local credentials and runtime data remain under Git-ignored `test-results/exact-legacy-2026-10-21/`.

No application files under `src/` or brand/media originals were changed. None of the old UI or missing Studio workflows is claimed restored by these tools.

## Source inventory and runtime observations

The generated [inventory](inventory/summary.json) accounts for **98 legacy route files: 25 public pages, 60 Studio pages and 13 handlers; 45 Prisma models; 575 model fields; 156 exported server actions; and 286 Markdown paths**. The destination has 109 route files, 37 registered Studio modules and 23 distinct SQL table names in committed schema scripts. Dynamic route files are not counts of live records or every reachable URL. All 575 field rows still require an explicit reviewed destination-field mapping before migration.

Every discovered old route and entity has a candidate destination or an explicit restoration requirement in [legacy-routes.csv](inventory/legacy-routes.csv) and [legacy-entities.csv](inventory/legacy-entities.csv). These are planning mappings, not verified equivalence. The 286 Markdown paths are inventoried, not all read or migrated.

Both live Studios were authenticated by the owner during this session. Read-only inspection covered the overview, catalogue, product editor, categories, imports, automatic fill/conflicts, exports, scraper and its nested workspaces, research, media, inquiries, analytics/activity, editorial modules, copy/images/sections/navigation, forms/materials/process, settings and staff. Save/publish/delete/import/start-scrape controls were not exercised on production.

Observed old UI totals: 4,373 published products and 12 drafts (4,385 total), 55 journal posts, 23 scraper sources, 11 enabled sources, 9 queued/running scraper jobs, zero staged scraper records, zero testimonials/portfolio/media/subscribers, and five recorded catalogue-fill runs. These are rendered screen counts at observation time, not a complete database export, identity match or guarantee of queue health. The old automatic-fill and fill-on-deploy switches were visibly enabled. Do not copy that deployment behavior onto the protected destination database.

Observed current UI: 120 product records, 131 product-media entries, 23 editorial images, and 26 permitted inquiry/order records on the dashboard (including explicitly fictional training records). These counts do not prove all records are genuine or satisfy the new 50+ content requirement. Preserve the classification, originals, usages, drafts and revisions.

## Confirmed gaps and secure adaptations

| ID / priority | Old reference and current evidence | Required implementation / acceptance |
|---|---|---|
| VIS-01 / P1 | Old flat sticky header, announcement strip, cure-line, different hero composition and section rhythm; current floating rounded header and different home composition. | Port `src/components/storefront/`, old `(v2)` page compositions and motion into current `src/components/shop/`. Match exact spacing/type/section order at eight widths; retain current branding and valid content. |
| VIS-02 / P1 | Old dense sidebar/topbar/table/editor composition differs from current Studio. Product table/board, columns, pinning and filter controls have distinct implementations. | Adapt old Studio shell/components against current permissions/services; prove table/board/filter/editor flows. A similar menu is insufficient. |
| FUN-01 / P1 | Current `/studio/import` says ingestion excluded and offers no importer. Old importer supports products, categories, blog posts, FAQs, testimonials, portfolio and pages from Sheets/CSV/XLSX. | Port parser/templates/validation into a preview/conflict/revision-aware import service. Unknown ratings must remain unknown; never reproduce the old import default of five stars as genuine evidence. |
| FUN-02 / P1 | Old `/studio/catalog-fill` and `/conflicts` expose list provenance, dry-run/run controls, settings and history. No equivalent current module. | Restore explicit bounded jobs and conflict resolution. Do not automatically seed production during builds or reuse unreviewed external catalogue content as owned creations. |
| FUN-03 / P1 | Old scraper has sources/detail, runs, review, confirmed, explorer, large-format, mapping, quality and analytics. No destination scraper module/pipeline. | Adapt old `src/lib/scraper/`, actions, source registry and job contracts, preserving bounded fetch/SSRF/redirect checks and research separation. Source configuration or stale queued jobs do not prove working extraction. |
| FUN-04 / P1 | Current Research is an editorial desk; current Exports is managed activity export. Old research/export operates on scraped/confirmed products and subscribers. | Retain useful current tools and restore the separate legacy research/export pipeline; test source→normalize→review→approved draft/export. |
| FUN-05 / P1 | Current Subscribers is an inactive status page; old subscribers and newsletter/workshop sources have a data contract. | Add consent/source/status/history model, UI and controlled export; do not synthesize subscribers or send messages. |
| DATA-01 / P1 | Old normalized Prisma entities differ from current versioned JSON documents/SQL stores. All fields inventoried; no live row export or stable crosswalk. | Explicit source namespace+ID→destination ID map, additive fields, relationship edges, exact version guards and field-level conflicts. Never join on title alone. |
| DATA-02 / P1 | Current product validation limits names/stories/gallery size and accepts known approved image references. Legacy content can exceed those assumptions. | Adapt validators and media references without truncating valid values, replacing current identities or weakening upload/privacy checks. |
| MEDIA-01 / P1 | Current `editorial-record-model.ts` rejects testimonial galleries and has no typed rating field; old testimonials have images/rating/evidence fields. | Add optional genuine rating and product/image association contracts with evidence and permission; propagate through editor, validation, public rendering and export. No fabricated reviews/names/ratings. |
| MEDIA-02 / P1 | Current category data is derived from catalogue choices; legacy categories have richer image/description/order metadata. | Add explicit category metadata and media associations while retaining product category membership and valid routes. |
| ROUTE-01 / P1 | `legacy-routes.ts` still retires workshops/print/supplies and resets unsupported filters; product/article identities remain unresolved. | Restore offering capabilities and query semantics; publish offerings only with real availability. Resolve individual redirects through approved ID/slug crosswalks. Keep existing new URLs valid. |
| AUTH-01 / protected | Current login differs intentionally; current sessions/permissions must survive the port. Old auth tokens and passwords are not portable content. | Keep `access-shell.tsx`, `login-form.tsx`, `studio-access.module.css` and auth behavior protected. Map appropriate staff roles without copying password hashes/session/reset secrets. |
| LOCALE-01 / P2 | Old public pages support nine locale paths; current active public journeys use en/hi/gu and older locale handoffs. | Account for every legacy language capability while preserving reviewed translations and explicit missing/stale/review states. Do not claim machine drafts as native-reviewed translations. |
| CAT-01 / P1 | No proven selected-product Sheets→editable Slides→PDF job pipeline exists in the destination. | Build versioned job snapshots, editable masters, customization, authentication/quotas/retry/cancel/output history, and visual PDF checks. This is Phase 6, not an existing export button. |
| EVID-01 / P1 | Older audit performance/device/provider/field evidence is dated and bounded. | Reproduce outstanding findings on the restored candidate; retain distinct live-provider, physical-device, native-reader and field metrics gates. |

## Protected-data baseline and conflict rules

[protected-source.csv](inventory/protected-source.csv) records SHA-256 for 21 brand/contact/token/catalogue/login source files. This protects source bytes only; it is not a live database row-hash comparison. Current contact/WhatsApp details, primary color tokens, product IDs/slugs/URLs/prices/variants, populated content, classification, original media and associations remain authoritative.

The planner produces per-field `sourceDigest`, `destinationDigest`, identity and decision. Existing populated values become conflicts; zero and false are populated; intentional blanks win; null/empty values require an explicit missing-field ledger. Title/name changes require approval for the exact field, identities, revision and both digests. Deleted/erased records cannot be resurrected. Arrays are atomic until a relationship adapter exists. Old-only records are review drafts with legacy publication state excluded. Patches and staged values may be private; keep them ignored. No real conflict register populated from private rows is claimed yet.

Source contracts indicate Prisma's PostgreSQL adapter in OLDWEBSITE and `@neondatabase/serverless` in the destination. Deployment environment/database identities were not extracted from credentials; the exact live database target/schema/row preservation preflight remains open. Do not infer it from a successful login.

## Asset access and preparation

Both owner-linked Drive roots were enumerated recursively: **813 distinct file IDs across 22 folders**. The original-creations root contains 170 files (136 JPEG, 33 HEIF, one QuickTime video); the general-assets tree contributes 643 files. Across both roots the MIME totals are JPEG 154, PNG 442, WebP 141, HEIF 33, MP4 31, WebM 2, QuickTime 1, plus nine data/text/icon files. Distinct file IDs are not deduplicated image bytes.

The Google Photos album opened successfully in the browser (`resin all`); no total Photos count, download completeness, or deduplication with Drive is claimed. Some filenames and MIME types disagree. Next: inspect bytes/dimensions/orientation/color profile, calculate hashes, link originals to verified creations, then create traceable derivatives. No originals were modified, no generated image was presented as documentary work, and no new genuine review evidence was invented. Folder IDs, file-level metadata and private source URLs remain in ignored evidence; the owner-provided links remain in the committed master prompt.

## Verification and preview

- 377 existing unit tests passed on Node 22.23.2.
- 32 new reconciliation/isolation tests passed; scoped ESLint passed.
- 12 repository preflight tests passed. Initial sandbox failures were Git-temp and Windows-junction permission failures; rerun used a verified workspace temp directory with the needed local permission. No assertions were disabled.
- Fresh npm audit: zero production vulnerabilities; full audit still reports five high-severity package entries in the existing development lint chain (`braces` / `micromatch` / `fast-glob` / Next lint packages). No automatic fix, lint downgrade or dependency modification was applied. This remains an open upstream-development dependency item.
- Current production Staff request queue loaded successfully and displayed no open requests. This was a read-only UI recheck; the existing repaired table was not recreated or altered.
- Fresh Next production build and its TypeScript stage passed. Build artifact is local, not deployed.
- Real local PostgreSQL identity/data-directory checks, fixture counts and SQL-adapter readback passed; nonlocal fetch refusal checked.
- Local homepage loaded through the real Next server against the new fixture database: 120 source-fixture products, 56 source-fixture content records, 131 source-fixture media entries; zero copied production rows. Source fixtures are not a current production data snapshot.
- Matched visual baselines include live home at eight widths; current protected login from the unchanged isolated build at eight widths; live old/current Studio overview at eight widths; eight further live public page-family pairs at desktop/narrow widths; 70 authenticated workspace observations plus two product-editor observations at desktop/narrow widths. Current total: 216 screenshots. The live current login was separately inspected; the eight login images are explicitly labeled local. Old login-request captures had redirected to `/studio`; their family/route metadata was corrected to Studio overview. They must not be presented as login comparisons.
- Captures use reduced motion, DPR 1, resized desktop-browser viewports. Initial default screenshots were scaled/clipped, and background-tab emulation produced paint artifacts despite correct dimensions. All were replaced using the selected tab's native viewport override and CDP capture; saved JPEG dimensions are asserted before generating the receipt. Representative desktop and narrow images were visually inspected. These are viewport captures, not full-page or full-flow certification. Missing counterparts are shown explicitly. Product editor comparisons use different existing records to compare the layout; no identity equivalence is implied. The old public site was returned from the owner's draft-preview session to its published view before capturing its baseline.

Local comparison: `http://127.0.0.1:4211/`. Isolated current-app baseline: `http://127.0.0.1:4210/`. These are task-owned loopback previews, not hosted deployments or restored-design acceptance. Use Node 22 from the repository directory:

```powershell
node tools/exact-legacy/comparison.mjs --serve
node tools/exact-legacy/run-local.mjs start
# From another terminal, request clean app/database shutdown:
node tools/exact-legacy/run-local.mjs stop
```

Do not run preparation again on a populated cluster. It refuses prepared resources; `--resume-empty` only recovers the initial interrupted cluster before any non-template database exists. The reference repository's normal build runs migrations/bootstrap; it was not run against any real target.

## Remaining Phase 1 work and next implementation

1. Finish public product/article/project/custom-page and conditional/error-state inspection, full-page section/footer alignment, and representative keyboard/menu/filter/unsaved-editor states. Source coverage is complete at the route-file level; visual/workflow state coverage is not.
2. Obtain a narrowly scoped read-only live data/schema snapshot through an owner-controlled path, record exact source/destination targets, and prepare private row/relationship digests and crosswalk candidates. No production migration authority is inferred.
3. Extend the reproduced-defect ledger beyond the refreshed dependency audit and successful request-queue check; retain historical performance/provider/native/device/field findings as historical until measured again.
4. Continue Phase 2 independent source porting from `src/components/storefront/`, `(v2)` routes and old Studio components into the current service contracts. Keep the login and protected source values scoped out of shared visual changes. Adapt useful Markdown with source commit provenance; do not copy old deployment/autofill rules unchanged.

The [canonical seven-phase plan](PHASE-WISE-PLAN.md) names the concrete edit areas and acceptance gates. Routine local work does not need another phase-start approval. Production migrations, destructive conflicts, CMS publication, paid services, external transactions/messages and release remain separately authorized actions.
