#> Final status authority: this document retains the dated 17 October source/before review. The 19 October coordinator sections and [FINAL-VERIFICATION.md](FINAL-VERIFICATION.md) provide the final candidate results; [SECURITY-RELEASE-REVIEW.md](SECURITY-RELEASE-REVIEW.md) covers later dependency patches. Earlier source-only requests and issue labels below are not new current passing or open-test claims.

 Codebase reconnaissance — 17 October 2026

This report preserves the initial read-only source/Git reconnaissance and, in the final reconciliation below, links subsequent executed audit receipts. The accompanying inventory separates source discovery, related-family evidence and directly scoped runtime observations; it is not a universal route, accessibility or deployment certificate. The specialist later repaired the explicitly assigned local E2E infrastructure, documented in `tools/master-audit/E2E-README.md`. No application code, package, production record or release was changed by this specialist.

## Baseline and instruction reconciliation — initial discovery

At initial discovery the observed local branch was `codex/cinematic-acceptance`, HEAD `66e82ef04f76b8460654bab4329ccbadfb47f28e`. Remote: `https://github.com/rivyalivingart2/RivyaLivingArt2.0.git`. The working tree was already dirty when reconnaissance began: eleven application/font files, three existing checkpoint files, untracked acceptance reports and `tools/cinematic-acceptance/`. These were the prior local acceptance follow-up, not new audit changes. The parent subsequently preserved that work in local checkpoint `40907ff0906fa279f2314b4d9653fdbed5606537` on `codex/rivya-master-audit`; fresh local fixes remain separate from the production baseline. The final consolidated report owns the final working-tree/release assessment.

Local Git history independently identifies `66e82ef` as the PR #63 documentation merge, parent documentation commit `1382f69`, and preceding PR #62 implementation merge `224b2ca`. `docs/redesign/sitewide-cinematic-2026-10-16/RELEASE.md:32` records the PR #62 production receipt. That historical receipt and source implementation must be retained; it is not current production verification. The prior acceptance follow-up remains local. The latest user request expressly requires **fresh authorization for every release or production write**, superseding historical fulfilled release authorizations.

Authoritative reading order for this audit:

1. Latest 17 October full-audit instruction and root project rule that synced `sources/` is read-only.
2. `AGENTS.md:1` acceptance checkpoint and current source, including existing uncommitted repairs.
3. `docs/redesign/sitewide-cinematic-2026-10-16/ACCEPTANCE-FOLLOWUP.md`, `CONTINUE.md`, `RELEASE.md`, `FINAL-REPORT.md` and source-backed verification records.
4. `docs/redesign/cinematic-sections-2026-10-16/` for the preceding homepage stage. Treat old local-only and fulfilled release checkpoints as historical.
5. Owner decisions preserving brand, content, media/crops, private inquiry workflow and manual WhatsApp sending. `docs/decisions/2026-10-05-remove-backups.md:3` removes project backup operations. `2026-10-12-m10-m11.md` and `2026-10-12-m10-pending-completion.md` describe fulfilled earlier release authority, not permission for this audit to release again.

Initial inspection established documentation drift in the three requested overview files. Baseline `PRODUCT.md:8` described Phase 2-only work and stopping before Phase 3; baseline `PRODUCT.md:20` said the foundation was unconnected to public/Studio routes. Baseline `README.md:119` listed authentication/CMS/database as incomplete, `README.md:122` said production showed a holding page, and `README.md:142` deferred testing. `PROJECT_STATE.md:1` and `README.md:1` led with a 5 October release instruction. Current route, authentication, published-data and cinematic components contradicted those active-sounding statements. **The local audit has now corrected this drift** with dated current guidance and clearly historical release sections; see the final reconciliation.

## Source inventory and fresh runtime evidence boundaries

`ROUTE-STUDIO-INVENTORY.csv` retains **all 230 original source coverage rows and their identities**. Every row has source/line, renderer or handler, data facade, access boundary, state dimensions and availability. Four added columns identify exact runtime receipts, tested scope, limitations and the authoritative consolidated report. `PARTIAL_RUNTIME_COVERAGE` means only the stated observations are evidenced; it never certifies the entire route/template. `SOURCE_ONLY_FOR_*` explicitly preserves gaps for a handler, alias, child redirect, framework boundary, source slot or block variant despite related page evidence. `NOT_EXECUTED_BY_RECON` means no fresh direct receipt was assigned, not that the route is broken. The two `VERIFIED_OPEN` rows retain the later production Staff/access-request panel error.

| Inventory row type | Fresh count | Interpretation |
| --- | ---: | --- |
| App route adapters | 109 | 62 `page.tsx` and 47 `route.ts` files |
| Metadata endpoints | 2 | `/robots.txt`, `/sitemap.xml` |
| Loading/error/not-found boundaries | 16 | Framework states, not separate publicly addressable pages |
| Layout boundaries | 3 | Root, private Studio and legacy preview Studio |
| Actual Studio registry modules | 37 | Catch-all dispatch expands to these destinations |
| Studio aliases | 6 | Orders, kanban, enquiries, users, blog, custom-pages |
| Studio child selection contracts | 8 | Supported `/{id|new}` redirects into record/create query states |
| Concrete public collection instances | 3 | Furniture/spatial, memory and personal-art collections |
| Homepage coverage rows | 19 | 18 composition slots plus conditional Resin in Motion |
| Landing block types | 16 | All types in `landing-model.ts:3` |
| Shared visual/functional components | 9 | Navigation, footer, lighting, product/card/gallery, saved pieces, form, chapter, dialog |
| Explicit excluded feature entries | 2 | No active current scraper or Catalog Fill workspace |

The 109 adapter classifications were rechecked against the current file set and imports: 31 public page templates; three canonical aliases; 30 API handlers; nine locale handlers; seven legacy redirect/notice handlers; one public editorial-image handler; two deprecated public state-harness routes; eleven authenticated legacy Studio redirects; two private workspace adapters; seven authenticated previews; four access forms; one private print page; one private reference page. The complete adapter set matches the historical source inventory, but publication state is deliberately not inherited from it.

Dynamic records are represented by `/pieces/[slug]`, `/pieces/[slug]/customize`, `/journal/[slug]`, `/portfolio/[slug]`, `/testimonials/[slug]`, `/faq/[slug]`, `/p/[slug]` and the three valid `[collection]` values. Current published membership must come from a fresh public sitemap/database projection, not the historical 636-detail/665-total URL register. Missing or withdrawn records are independent negative cases.

## Route → component → data ownership

| Family | Renderer ownership | Data/authorization contract |
| --- | --- | --- |
| Homepage | `Homepage` → `ShopSite` → `HomepageDocument`/`ReferenceHomepage` | `publishedContent`, `publishedProducts`, presentation/layout and current referenced publications |
| Collections, search and selection journeys | `ShopSite` → `CollectionDocument`/`CatalogueBrowser` | Validated published catalogue; URL-owned filter/sort/show state; no fixture substitution |
| Product and customization | `ShopSite`, `Gallery`, `OrderForm` | Published product and form version; selected image/caption/crop; private session-backed submission |
| Editorial, FAQ, policies and stories | `EditorialPage`/`EditorialDocument`, `SectionBody`, `ReferenceChapters` | Published content and dependencies; saved presentation settings where eligible |
| Landing pages | `LandingDocumentView`, `LandingGallery`, `MaterialFilm` | Published landing blocks and compiled dependencies; optional media/groups |
| Public shell | `ShopShell` → `ShopFrame` | Published business, copy, navigation and locale settings; available destinations |
| Studio | `requireStudioSession` → `PrivateStudioEntry` → `Workspace` | Server session and role, then module APIs; server authority remains separate from UI gating |
| Studio saved previews | Saved frame and public renderers | Captured saved revision; current publication is not substituted for an old saved preview |
| Private print/reference | Dedicated authenticated pages and reference API | Inquiry authorization; private asset stream; never public asset guessing |
| Access forms | `StudioAccessShell`, login/request/password forms | Staff authentication; administrator-assisted requests and one-time reset/activation flow |

`src/lib/publication-read-query.ts:3` and `:11` define published-only catalogue/content/media reads and their database-computed identity. `published-source.ts:25` checks a fresh digest before cross-request snapshot reuse. `shop-catalogue.ts:11` and `published-content.ts:21` validate and project public fields; baseline records are validation references, not a production fallback. `studio-db.ts:4` creates the configured PostgreSQL client and rejects absent configuration. Root should verify the request-to-service-to-persistence workflow in the guarded local environment rather than assuming a mocked page proves persistence.

The public root uses `connection()`, public locale and shared published copy. It owns fonts and the skip link, not a second storefront shell. Private `studio/layout.tsx` applies private styling and noindex metadata; individual pages authenticate before their private content. A broad public-shell replacement would risk duplicate navigation and inappropriate private-page behavior.

## Localized and legacy routing

Nine locale directories exist, but they **do not represent nine separately published localized sites**. `src/lib/site-settings-model.ts:3` limits public journey choices to enabled English, Hindi and Gujarati. `legacy-locale.ts:10` maps reviewed public routes to current canonical paths; `legacy-locale-handler.ts:12` returns a temporary 307, noindex/noarchive and a language cookie. Unsupported locale choices fall back to English; unknown/private route identities are rejected. Editorial language eligibility and fallback still require the actual reviewed content contracts.

`legacy-route-handler.ts:7` returns real 308/404/410 responses before a streamed body. It renders no original URL, secret receipt token or arbitrary incoming query. Legacy receipt/wishlist/workshop/supply/print routes are intentionally notices or retired states; unknown product identity must not be redirected merely because a similar slug exists. `/about`, `/materials` and `/care` remain canonical aliases. No separate language SEO migration should be inferred or activated by this audit.

## Studio coverage and deliberate exclusions

`src/lib/studio-modules.ts:4` is the shared navigation/route/renderer key registry. `src/app/studio/[...path]/page.tsx:9` checks admin-only module access before child redirects. `studioChildHref` validates supported record IDs and maps them to `?record=`/`?create=1`; arbitrary extra path segments are not admitted. The 37 views are dynamically imported in `src/components/studio/workspace.tsx:34` and mapped exhaustively by `StudioModuleKey`.

Present operational views include Overview, Inquiries & orders (including kanban/enquiries aliases), Follow-ups due, Activity, Analytics and Exports. Catalogue includes Products, Categories, Public media, Research, Content gaps and the inactive Bulk import explanation. Content/editorial includes all content, Production register, Editorial ordering, Site copy, Page design, Site images, Language review, Process, Materials, Commission forms, Journal, Portfolio, Testimonials, FAQs, Pages and Landing pages. Settings include Content health, Navigation & languages, Legacy decisions, Old links & publication, Staff access, Atelier settings, SEO, Content lab and the inactive Subscribers explanation.

Important distinctions:

- **Bulk import** and **Subscribers** are present but intentionally inactive (`conditional-workspace.tsx:4`). They do not expose actual upload, mailing or subscription services.
- **Product scraper and Catalog Fill** are absent from the active current registry. Historical legacy references are present in `legacy-disposition.json:673`; they are excluded by owner, not missing work to reactivate.
- **Access requests** are a child of Staff access, backed by `/api/studio/access-requests`, not a separate 38th workspace.
- **Orders, kanban and enquiries** are aliases of one inquiry/order workspace, not independent stores.
- **Forms** shares the product editor's `formsOnly` mode; **Content gaps** shares Content health; **Process/Materials** select specific content records; **Exports** shares operational export behavior.
- Optional Workshops/Printing homepage slots require actual confirmed offering data. Registry visibility defaults are not business approval or live availability.

## Dependency and architecture baseline

`package.json:6` pins Node `>=22.16.0 <23` and npm `10.9.2`. The package manifest has 21 runtime and 10 development dependencies. Principal versions at the initial 17 October source baseline: Next `16.3.5`, React/React DOM `19.3.0`, TypeScript `5.9.3`, GSAP `3.15.0`, `@gsap/react` `2.1.2`, Tiptap core/pm/react/starter-kit `3.31.3`, Neon serverless `1.0.2`, Vercel Blob `2.8.0`, Sharp `0.35.4`, Playwright `1.62.1`, Tailwind `4.3.3`, ESLint `9.39.1`, Radix `1.6.7` and Lucide `1.31.0`. No Motion/Framer Motion, WebGL, Three.js or alternative scrolling package is currently required for the delivered visual system.

The existing design system separates semantic colors in `src/styles/tokens.css`, cinematic tokens and canvas in `src/components/design-foundation/`, co-located public media/page CSS modules and restrained Studio editing/operational CSS modules. `Workspace` dynamically loads its content, memoizes module bodies and cleans up navigation/session listeners. Large catalogue/editorial source datasets are fixtures/validation material; their file size alone is not evidence of a production client bundle regression.

There are 259 TS/TSX/CSS files beneath `src/components`, 162 beneath `src/lib`, and one CSS token file directly within the `src/styles` subtree (font binaries excluded). These are source-scale observations, not code-quality defects. The largest operational editor is `catalogue-editor.tsx` at 452 lines; the largest common public CSS module is 616 lines. A blanket rewrite would be unjustified without an observed fault.

## Initial test-infrastructure finding — subsequently reproduced and fixed locally

Package scripts exist for lint, typecheck, unit, preflight, build, runtime and Playwright e2e. Initial source discovery found 38 `tests/*.test.mjs` files, two additional tool test suites and three `e2e/*.spec.ts` files. Those initial counts were source observations; subsequent fresh test results are identified below rather than borrowed from older release reports.

The original Playwright harness was stale relative to the delivered application. Baseline `playwright.config.ts:48` started a separate server with an empty database, staff identity and session secret; intake was disabled at `:54`. Baseline `e2e/frontend.spec.ts:4` expected the old fixture headings, including “Not just an object”, “Art for the space.” and the Studio holding screen. Current `ShopSite` reads published database state and `/studio` authenticates. The requested focused reproduction subsequently returned HTTP 500 (`Studio storage is not configured`) before its obsolete heading assertion. The later repair retained application auth/publication guards and used the existing isolated environment; the final run passed 155 cases with five intentional desktop skips.

The existing `tools/old-design-migration/run-local.mjs:16` checks the actual loopback database, role, server address and port against the local target before starting a QA child. Root should use this guarded environment for safe runtime/database work. Validate every proposed test script first: some old helper names refer to fixture creation/publication, and prior completion is not permission to replay them.

Raw evidence is already ignored through `.gitignore:10` (`test-results/`). The new required audit folder can safely hold browser images, traces and local test data there without staging them. Only sanitized reports and source should ever be eligible for a future authorized release.

## Recon findings for independent issue review

| Candidate ID | Severity | Initial state at recon handoff | Evidence and recommendation |
| --- | --- | --- | --- |
| RECON-DOC-01 | P2 | VERIFIED_OPEN | Three entry documents use superseded current-state statements. Reconcile dated top-level checkpoint and current run guidance while preserving historical sections. Validate by checking current source/HEAD and referenced reports. No application risk; estimated small documentation change. |
| RECON-E2E-02 | P2 | VERIFIED_OPEN (source mismatch; runtime reproduction requested) | Playwright wipes DB/auth config and tests pre-integration fixture content. Reproduce one failure, then migrate a focused smoke suite to a verified isolated environment or explicitly retire unsupported historical assertions. Keep intake writes guarded; estimated medium test-infrastructure change. |

No P0 or P1 application defect is asserted by this source reconnaissance. Absence of such a finding is not security clearance. Findings concerning specific authentication, persistence, media behavior or browser layouts belong to their specialist evidence and root reproduction.

## Recommended audit execution coverage

1. Refresh published URL/media membership and exercise each public template at the eight requested widths; include all three product tiers, long multilingual content, missing details, empty catalogue and storage-unavailable saved pieces.
2. Exercise all 37 actual Studio workspace bodies after loading; separately cover the eight supported child-selection families, six product tabs, saved/history previews, translation panels, access requests, private reference and print layouts.
3. Sample all 18 homepage slots and 16 landing block types in explicitly local saved/inert variants. Optional/unpublished business offerings stay inactive.
4. Run guarded workflow tests for exact-save retry, receipt recovery, reference privacy, role denial and stale-version conflicts; no real inquiry or external WhatsApp message.
5. Preserve the previous candidate's font/scrim/video-gate changes, then measure them as the local audit baseline. No production performance claim follows from local timings alone.
6. Independently review issue evidence, apply only narrow local fixes after the audit, and rerun the relevant checks. Native-reader/physical-device/field-data limitations remain separate gates.

## Skills used

All 20 compatible skill names from the user prompt are installed in this repository's `.agents/skills/`; the initial global-directory lookup was not their actual location. This specialist read and selectively applied `clean-code-architecture/SKILL.md` (separate persistence, contracts and presentation) and `css-module-scalability/SKILL.md` (token/scoped-style reconnaissance, no blanket refactor). Their suggestions do not override owner preservation constraints. The attached kit's `rivya-full-project-audit/SKILL.md` was read from the ignored audit kit and applied for actual-route discovery, historical-evidence separation and no production writes. No skill script was executed or package installed by this specialist.

## Final receipt reconciliation — 17 October 2026

The CSV enrichment is a read-only reconciliation of saved evidence, not a new browser run. All 230 source-row identities are preserved. Raw receipt paths below are relative to ignored `test-results/rivya-master-audit/`. **`FINAL-VERIFICATION.md` is the authoritative consolidated final result and release-readiness assessment. This section retains the 17 October reconciliation; see its dated table for the newer post-patch results.** Later issue/status updates there take precedence over an earlier opening observation.

| Fresh receipt | Recorded outcome | Scope and important limit |
| --- | --- | --- |
| `layouts.json` | 588 route/viewport observations, zero recorded suite errors or horizontal overflows | Existing isolated published fixtures; eight requested widths plus four short-height observations. These are representative settled layouts, not all conditional states or all dynamic records. |
| `conditional.json` | 1,051 checks and 321 state observations, zero recorded issues | 1440/390/320px editor tabs, selected existing child editors, translation panels, exact saved previews, unsaved layout controls, synthetic authoring states, intercepted inquiry failure/retry and anonymous denials. Unsaved options do not prove every published variant. |
| `published-inventory.json` | 656 current published URLs returned 200 with title/H1; 246 referenced asset HEAD checks; zero recorded errors | Production read-only sitemap/HTML/media availability. This is not 656 interactive or visual page audits and does not decode all media. Dynamic adapter rows keep representative-family limits. |
| `production-studio.json` | 37 workspace openings at 1575×930, no opening overflow or completed broken images; later **P1 VERIFIED_OPEN** in Staff | Account & password requests later settled to its unavailable message. This overrides any interpretation that every module is fully healthy; cause remains unestablished. No production mutation occurred. |
| `accessibility.json` | 86 final local automated scans at 1440/390px; zero detected violations | Automated incomplete/manual-review items include contrast and selected video captions. This is not native screen-reader, physical-device or complete animated-contrast certification. |
| `motion-seo-repro-after.json` | Final low-memory/high-core and low-core motion fallback; CSS pause/reload/resume; sampled editorial language inheritance | Actual media transforms and DOM language evidence on representative pages. English article fallback keeps `lang=en` while Hindi/Gujarati interface controls retain their chosen language. No native speech inference. |
| `workflow.json` | 53 isolated service/HTTP checks passed; protected fingerprint preserved across 21 tables/2,677 rows; generated fixtures cleaned | Exact inquiry/idempotency/message/receipt, staff/access/recovery, scoped operational updates and denials. No messages sent. Private files are metadata-only fixtures; remote bytes/deletion and real erasure are not certified. Pure/service tests are not relabelled as HTTP endpoint tests in the CSV. |
| `e2e-final-results.json` | **155 passed, 5 intentionally skipped, 0 unexpected, 0 flaky**, 238.48 seconds; 59 screenshots | Four projects; existing isolated published data; no production work. Read-only browser suite mocks only automatic inquiry-session preparation as unavailable and blocks other mutation/external requests. Staff checks here are unauthenticated sign-in, not administrator workflow acceptance. |

The initial findings now resolve as follows:

- **RECON-DOC-01 — VERIFIED_FIXED locally.** `README.md:1` and `PROJECT_STATE.md:1` now identify the released cinematic baseline, current local audit scope, fresh authorization boundary and reports. `PRODUCT.md:8` identifies the completed redesign/current audit and its capabilities. Fulfilled historical release instructions are visibly historical, without restoring excluded features.
- **RECON-E2E-02 — VERIFIED_FIXED locally.** The old blank-database failure was reproduced and retained in `e2e-before-retry.log`. The canonical suite now owns guarded local port 4173, validates actual loopback database identity, reads only existing public fixture descriptors, and scopes raw artifacts to its own ignored child directory. `tools/master-audit/E2E-README.md` maps every original coverage group to the current application and records the additional saved-pieces case. Final focused ESLint and full TypeScript checks exited 0. The owner preview on 4199 was preserved. Five stream-close notices around navigation/reload remain disclosed in the run log; no tested page/browser assertion failed.

Source-only coverage remains intentional and visible: unmatched legacy redirects, unexecuted API methods/actions, framework loading/global-error boundaries, child path/create contracts, optional reference homepage slots and individual landing block variants are not upgraded to full runtime verification from nearby page screenshots. In particular, local access-service success does not close the production access-request P1. The current branch is `codex/rivya-master-audit` at local baseline HEAD `40907ff0906fa279f2314b4d9653fdbed5606537` plus the audit's local changes; no push, merge or deployment is authorized by this report.
