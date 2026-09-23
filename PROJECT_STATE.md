# Active checkpoint — Phase 7 Studio source complete

The owner authorized the next phase and GitHub publication; read docs/decisions/2026-09-23-phase-7-execution.md. The canonical master is docs/redesign/RivyaLivingArt-Commercial-Implementation-Plan.md revision 3.8. Read PHASE-7-STUDIO.md and IMPLEMENTATION_PROGRESS.md in docs/redesign for the capability matrix, source evidence and prepared Phase 11 permission/concurrency scenarios. P7.1–P7.8 are source-complete; application QA is not performed. Next: P8.1.

Phase 7 separates immutable customer submission from append-only staff amendments; retains saved-order WhatsApp actions; adds scoped board context/filtering, conflict/retry recovery, explicit staff session revocation, version-pinned sign-in, editorial draft recovery, filtered private export and retention inventory. No migration, database write, new staff, inquiry, reference, content publication, export, cleanup or deployment occurred. Existing data/assets/drafts/IDs and eight stages are preserved. Real-project authoring remains inactive because no substantiated completed projects are registered.

Branch codex/phase-7-studio starts from freshly fetched main d1a50072fb42ed44612e621d64a157c7fef20455 (PR #21), incorporating the shared-data safeguards. Verify fresh refs and the Phase 7 publication receipt before continuing. Preserve the existing Phase 2/6 schema; do not replay migrations blindly.

Future Preview and Production deployments share the modern database and private reference store by explicit owner approval. Existing deployed versions retain their captured connections. Read SHARED-DATA-CONFIGURATION.md; old integration associations remain and reconnect/rotation may overwrite aligned variables. Synthetic QA/restore must use DIFFERENT disposable database/storage. Both order-write flags remain off. No new live credentials or database backup are needed for source-only Phase 8 work.

WhatsApp remains saved-order Open/Copy with manual customer Send only. No generic chat, payments, cart, customer accounts, outbound notifications or Netlify. Vercel-only/free-only commercial eligibility remains unresolved; production and automatic Git deployment remain on hold. Phase 10–12 gates include runtime grants, separate staff secrets, real content/settings publication, submitted-data retention policy, backup portability/full restore and exact-candidate QA. Do not repeat plan, shared-data or storage approval.

Older records below are historical where superseded.

---

# Active owner instruction — approved full redesign

Current continuation: master revision 2.5; Phase 4 source complete, Phases 5–8 source/integration candidate. Owner requests GitHub publication and Vercel only; Netlify onboarding is cancelled and its source integration removed. Commercial hosting remains on hold under free-only constraints; automatic Git deployment is disabled. Read docs/redesign/CHECKPOINT.md and docs/decisions/2026-09-23-vercel-only-hold.md. Preview credentials, formal QA and release eligibility remain outstanding.

Continue the approved master from `docs/redesign/CHECKPOINT.md`. Read `docs/decisions/2026-09-23-approved-full-redesign.md` first. Older appearance, frontend-only and release restrictions below are historical where superseded. Preserve source/data; final QA and eligible free hosting remain release gates.

---

# Latest owner override — 23 September 2026 production release

The owner confirmed Studio login and explicitly authorized merging the full current update into main and deploying Vercel Production, using free services only. See `docs/decisions/2026-09-23-production-release.md`. This overrides the historical no-main/no-production and public holding-page restrictions below for this release. Keep Studio server authentication, concept/sample disclosures, separate production data, and the deferred formal-QA boundary. The actual CMS remains partially local; deployment is not full backend completion.

---

# Current checkpoint — GitHub publication completed

22 September 2026. Owner explicitly instructed publishing the prepared updated code
into `rivyalivingart2/RivyaLivingArt2.0` after the public-disclosure blocker was explained.
This resolves the earlier scope blocker for this source/asset payload only. See
`docs/decisions/2026-09-22-approved-code-publication.md`.

Published `codex/sites-approved-design` on latest verified main history (`79f5834`,
R8-4B merge; no file differences from the existing development base). Implementation
commit `d74ca0ee722011bd453b08bc8939892413b0bd86` was read back from GitHub; its
tree `402ec253365133de2e3eeb7024bde91106b063e4` exactly matches local authoring
checkpoint `96af6ca360b68dafe33e94f2ee20e7cf49bccb3a`. Local development history
is retained. Draft PR: https://github.com/rivyalivingart2/RivyaLivingArt2.0/pull/13.
See `docs/sites/github-publication.json` for the source/remote identity mapping.
This documentation checkpoint records the verified implementation publication; read
the current remote ref for subsequent documentation commits.

Main remains `79f5834dc4028cb42fef4020651ccaac40c16285`. No merge, Site deployment,
manual Vercel deployment, secrets, domains or sharing changes were made. The existing
Git integration automatically produced protected Preview `dpl_6azZTgAjiu7NnCx9f4RYduiGDbFF`
for the implementation commit; Vercel reports READY, which is not formal QA evidence.
Saved Site Version 5 remains undeployed; approved live Version 1 remains unchanged.

Counts: 120 products (84/24/12), 36 article drafts, 42 FAQs, 24 fictional testimonials
and 40 fictional enquiry scenarios. Public and Studio source scope is recorded in
`docs/sites/status.md`. All persistence/authentication/handoff boundaries remain local
demonstrations; formal QA is deferred. Next: continue the existing R8 integration
sequence and map the owner's generated assets when their new Drive folder is supplied.

Prior checkpoints below retain their original blocker/evidence state as history.

---

# Current continuation — SITES-FULL-03

22 September 2026. Non-image source work continues on `codex/sites-approved-design`.
Implemented actual browser CSV/XLSX parsing/mapping and local product-draft batches,
protected resume and exports, own-ID content copies, saved-draft hydration, bounded
storage handling, local revision conflicts, exact cleanup dry runs, publication
validation, fuller tier projections, additional Memory/Gift filters and separate
Studio/editorial route chunks. See `docs/sites/non-image-development.md`.

Counts stay 120 products / 36 articles / 42 FAQs / 24 fictional quotes / 40 scenarios.
Images stay seven matched product portraits and 113 pending. No new assets, Drive
reads, real credentials/customer collection, database migration, auth, outgoing
messages, deployment, main merge or sharing change. Formal QA deferred; compiler
feedback only. Same approved live Version 1 remains. Saved version details are in
`docs/sites/source-version.json`. GitHub remains public; automatic approval rejection
of public source/media disclosure is still active. The read-only GitHub connection
verified both work branches at `29250ee0b8d011835a3053510f7d4ea7ca58cf1e`.

Next: use the saved review version and continue the R8 backend sequence through
verified isolated services; add owner-returned assets when supplied. Do not repeat
completed fixture writing or rebuild the approved homepage.

---

## 22 September 2026 — SITES-FULL-02 continuation

Approved Site preserved and extended; actual Next.js public/Studio port implemented on `codex/sites-approved-design`. Counts: 120 products (84/24/12), 36 original full articles, 42 FAQs, 24 fictional testimonials, 40 scenarios, 14 pages, 8 projects. All writes remain synthetic/local. Formal QA remains deferred; no production-readiness claim.

GitHub push blocked by automatic approval review because repository is public and source/media disclosure needs explicit authorization. No workaround or main merge. Saved Site version/source, local commit, remote verification and archive details are recorded in `docs/sites/source-handoff.md`. Read `docs/sites/status.md` and `sample-manifest.json` for the current boundaries and exact remaining integration work. Existing historical entries below retain their original evidence scope.

# RivyaLivingArt project state

## SITES-FULL checkpoint — 22 September 2026

Owner approved existing Sites Version 1 and authorized scoped source export and compatible frontend integration on codex/sites-approved-design, based on latest R8-4B head 29250ee0b8d011835a3053510f7d4ea7ca58cf1e. Baseline native source preserved under experiments/sites/rivyalivingart-studio-preview. Homepage composition/fonts and selected derivative media are ported into src without replacing root application/dependencies or preview guards. Same Site Version 2 saved but not deployed; current audience/live Version 1 unchanged. Memory/personal journeys and sample briefs implemented natively. Full Studio/public expansion and complete sample targets remain in progress; see docs/sites/status.md and source-handoff.md. Formal QA remains deferred; no backend/auth/submission connection. No main merge or Vercel deployment action.

## R8 checkpoint — 2026-09-21 (R8-4A merged; R8-4B content workspace)

- **Owner instruction:** merge completed work into main, then implement R8-4B.
  The development-first decision still defers all testing-related work until
  after backend/database integration. Existing tests and commands remain intact.
- **Main integration:** PR #11 merged development head
  `0691ef45500dc679577aaf1f77ea534f5c98bb67`; the actual main reference was
  read back at `8b8c81f5d85bf0a78d165184b3d8e460073452e4`. R8-4B continues on
  `codex/r8-first-frontend` from that merge and is published separately. The prior
  merge instruction is not standing authorization to merge this new slice.
- **Implemented:** content-type hub and deep links; typed page, article, FAQ and
  testimonial editors; eleven registered marketing sections with controlled
  add/duplicate/hide/order fields; actual Tiptap with safe structured content;
  shared media picker; responsive shared-renderer preview; and local
  autosave/validation/history, restore and labelled failure/conflict presentations.
  Product fields remain catalogue-owned; the marketing composer is distinct from
  the existing product inquiry form builder.
- **Route boundary:** `/preview/studio/content`, its new/document routes and
  `/preview/studio/media` reuse the existing shell and guard layout/page/metadata
  before exposing fixtures. `/studio` retains its holding boundary. No staff
  identity, session, server permission or public publication is manufactured.
  Vercel production continues to deny fixtures; the visual flag is not access control.
- **Local state:** working drafts, checkpoints, duplicate/archive/restore and
  simulated conflict/failure states do not write to a database, publish content,
  alter public source fixtures or produce real staff audit events. Local history
  is not durable recovery or server version checking. Reload/navigation can discard it.
- **Source content:** DT001–DT024 add all 24 exact supplied fictional quotes and
  identities, with permanent disclosures: 12 LARGE / 6 MEDIUM / 6 SMALL. Totals
  are 36/120 products, 12/36 full articles, 42/42 FAQs, 24/24 testimonials, three
  fictional studies and 0/40 operational scenarios. Six existing editorial page
  sources plus a homepage starting draft supply seven initial composer documents;
  the broader 14-page and authored history-fixture targets remain incomplete.
- **Media / dependencies:** two existing preview-only product AVIFs and 34
  pending product visuals; no new media mapping/generation/upload. The picker uses
  stable public-safe IDs and usage-specific alt/caption/focal fields; it does not
  invent approval or expose private attachments. Actual Tiptap core/pm/react/
  starter-kit 3.31.3 were installed with exact pins; npm added 51 packages and
  regenerated the lockfile. Existing Next/React pins and Node 22 remain.
- **Development feedback:** `npm run typecheck` passed for implementation
  wiring (Next route generation and TypeScript, Node 22). The npm-generated
  lockfile was reviewed: 51 new MIT packages, no existing package version changes
  or added install scripts; React type dependencies lose only their dev-only flag. No lint, build verification, unit/preflight/HTTP/browser checks or
  screenshot QA were run or added. Compiler feedback does not establish a QA pass.
- **SOURCE_IMPLEMENTED:** R8-4B content workspace, editor/media/history
  presentation and 24 fictional testimonials. **UI_READY:** pending deferred
  visual/keyboard QA. **BACKEND_CONNECTED:** no. **TESTED:** not run. Historical
  R8-3A results do not certify later source.
- **Vercel:** read-only inspection reports Node `22.x` and authentication
  protection `all_except_custom_domains`. Existing Git triggers may build the
  main production holding page or development Preview. No explicit deployment,
  promotion, environment, runtime/protection setting or live-domain action occurred.
- **Remaining:** Studio R8-4C/R8-4D, remaining demo source and authored history,
  genuine approved media and owner-reviewed care/legal wording/studio history;
  backend/database integration and final consolidated QA. All rejected integrations
  and S01–S04 remain excluded. Protected R8-5 instructions/owner review are still
  ahead; neither R8-5/V1 approval nor R8-11/V2 readiness is claimed.
- **Checkpoint / publication:** publish this development slice separately,
  read back its actual remote SHA/tree and report the resulting draft PR and
  source reference. See `docs/R8-4B_CONTENT_WORKSPACE.md` for the presentation and
  integration boundaries.
- **Next exact task:** R8-4C — enquiry pipeline/status details and internal notes,
  catalogue import/export controls, demo manager/remove dialogs and independent
  menu visibility.

## R8 checkpoint — 2026-09-21 (R8-3D merged; R8-4A Studio catalogue)

- **Owner instruction:** merge completed work into main, then implement R8-4A.
  The development-first decision still defers all testing-related work until
  after backend/database integration. Existing tests and commands remain intact.
- **Main integration:** PR #10 merged development head
  `679a358b334bcc658226a3661ed6b6add2dff852`; the actual main reference was
  read back at `6e1be895b98a147ce0f00102e2ade7f9881db9f6`. R8-4A continues on
  `codex/r8-first-frontend` from that merge and is published separately. No history
  or branch was removed.
- **Implemented:** isolated `/preview/studio` shell/navigation and dashboard;
  URL-filtered/paginated product table with explicit current-page selection and
  confirmed local review; product create/edit presentation with local draft state,
  tier-specific validation and confirmed tier changes that preserve other-tier
  fields; typed versioned form builder with keyboard ordering, controlled
  conditions and shared public input rendering. Future modules have explicit
  status routes rather than unexplained dead controls.
- **Route boundary:** each harness layout/page and metadata path is guarded before
  fixture rendering. The root application frame omits public chrome only for the
  Studio presentation path. `/studio` retains its holding boundary and adds a
  preview-only link to the harness; no staff identity, authenticated session or
  backend permission is manufactured.
  The preview flag is not access control and production continues to deny fixtures.
- **Local state:** table review, product draft and builder controls never write
  to a database, publish content or mutate source/public fixtures. The dashboard
  derives Demo metrics from actual source records and marks Live, enquiries and
  imports unconnected. No invented business totals, revenue or conversions.
- **Source content:** twelve LARGE concepts (DP003–DP012 and DP015–DP016) bring
  products to 36/120: 24 LARGE / 6 MEDIUM / 6 SMALL. Eighty-four remain to author.
  Article source remains 12/36 with 24 remaining; FAQs 42/42; three fictional
  studies; testimonials 0/24 and operational scenarios 0/40. Local UI examples
  are not persisted demo scenarios or real business activity.
- **Media / dependencies:** two mapped product AVIFs and 34 visual-pending
  products. Owner prompts for the twelve new concepts are in the existing asset
  companion. No new image/font, dependency or lockfile change; no image generation,
  download, upload or storage integration occurred in this slice.
- **Development feedback:** `npm run typecheck` passed (Next route generation
  and TypeScript, Node 22) for implementation wiring. No lint, build verification,
  unit/preflight/HTTP/browser checks or screenshot QA were run or added.
  Compiler feedback does not establish a QA pass.
- **SOURCE_IMPLEMENTED:** R8-4A Studio catalogue presentation and next product
  batch. **UI_READY:** pending deferred visual/keyboard QA.
  **BACKEND_CONNECTED:** no. **TESTED:** not run. Historical R8-3A results do not
  certify later source.
- **Vercel:** read-only inspection reports Node `22.x` and authentication
  protection `all_except_custom_domains`. Existing Git branch triggers may create
  production/Preview builds. No explicit deployment, promotion, environment,
  runtime/protection setting or live-domain action was performed.
- **Remaining:** genuine owner-approved media, care/legal wording and studio
  history; remaining demo content; R8-4B–R8-4D Studio frontend; backend/database
  integration and final consolidated QA. All rejected integrations and S01–S04
  remain excluded. Neither R8-5/V1 owner approval nor R8-11/V2 readiness is claimed.
- **Checkpoint / publication:** source and current guidance are prepared for the
  development commit. Publish the safe branch and read back its actual remote
  SHA/tree; report the resulting draft PR and source reference separately.
  See `docs/R8-4A_STUDIO_CATALOGUE.md` for the presentation and integration map.
- **Next exact task:** R8-4B — content hub, page-section editor, Tiptap presentation,
  FAQ/blog/testimonial editors, media picker, responsive layout preview and
  autosave/validation/history presentation.

## R8 checkpoint — 2026-09-21 (R8-3C merged; R8-3D system states)

- **Owner instruction:** merge completed work into main, then implement R8-3D.
  The development-first decision still defers all testing-related work until
  after backend/database integration. Existing tests and commands remain intact.
- **Main integration:** PR #9 merged development head
  `cbacda4d6d9661e47f75157c9e894277181e3ad6`; the actual main reference was
  read back at `96af467fe5cc94dc56f1fa507df35317cbdbc798`. R8-3D continues on
  `codex/r8-first-frontend`; this new slice is published separately. No history
  or branch was removed.
- **Implemented:** shared `SystemState` and `RootErrorPresentation` for 404,
  route/root errors, unavailable and empty views; page-loading presentation;
  guarded `/preview/states` gallery; post-validation Suspense boundaries on
  collection/search/journal pages; header `PendingLink` indicators using
  `useLinkStatus`; media fallback/retry and gallery zoom enabled after image load.
  The state gallery renders labelled examples, not deliberate runtime faults.
- **Local recovery:** form-failure presentation preserves mounted form/reference
  state for retry or editing. The blocked-WhatsApp example is a local simulation:
  no transport, message, persisted request or live draft transfer. Nothing in
  these frontend states establishes that a real submission succeeded or failed.
- **Route boundary:** preview denial and parameter/record validation precede
  fixture rendering and pending boundaries. No global root loading boundary is
  introduced that could stream a successful response before an unknown route is
  rejected. Real HTTP/browser behavior remains part of deferred final QA.
- **Contact correction:** master Section 1 already supplies the business phone,
  WhatsApp destination, email and map link. R8-3D uses those exact values. The
  earlier R8-3C missing-contact description was incorrect; contact values are no
  longer a blocker. No address, hours, workshop access or delivery terms are
  inferred. Local fictional drafts stay out of live contact links.
- **Source content:** DB007–DB012 add six complete labelled original article
  drafts, bringing article source to 12/36 with 24 remaining. The 42 FAQ drafts,
  three fictional studies and 24 products remain. The full 120-product,
  24-testimonial and 40-inquiry/order-scenario targets are still incomplete.
  Source fixtures do not create database rows or completed customer work.
- **Media / dependencies:** two existing product AVIFs and 22 pending product
  visuals; no new image/font, dependency or lockfile change. The existing asset
  companion adds owner briefs JOURNAL-DB007–JOURNAL-DB012, pending generation and
  approval. No image generation or download occurred in this slice.
- **Development feedback:** `npm run typecheck` passed (Next route generation
  and TypeScript, Node 22) for implementation wiring. No lint, build verification,
  unit/preflight/HTTP/browser checks or screenshot QA were run or added for R8-3D.
  Compiler feedback is not a QA pass.
- **SOURCE_IMPLEMENTED:** R8-3D frontend system states and second article batch.
  **UI_READY:** pending deferred visual/keyboard QA. **BACKEND_CONNECTED:** no.
  **TESTED:** not run. Historical R8-3A results do not certify later source.
- **Vercel:** read-only inspection still reports Node `22.x` and authentication
  protection `all_except_custom_domains`. Existing branch triggers may create
  production/Preview builds. No explicit deployment, promotion, environment,
  runtime/protection setting or live-domain action was made. Production fixture
  denial and separately protected Preview access remain required.
- **Remaining:** genuine owner-approved media, care/legal wording and studio
  history; remaining demo content; Studio frontend; backend/database integration
  and final consolidated QA. All rejected integrations and S01–S04 remain excluded.
  Neither R8-5/V1 owner approval nor R8-11/V2 readiness is claimed.
- **Checkpoint / publication:** source and current guidance reviewed for this
  development commit. Publish the safe branch and read back the actual remote
  SHA/tree; report the resulting draft PR and source reference separately.
  See `docs/R8-3D_SYSTEM_STATES.md` for implemented state and content boundaries.
- **Next exact task:** R8-4A — Studio shell/navigation, fixture-derived dashboard,
  product list/detail, tier fields and form-builder visuals.

## R8 checkpoint — 2026-09-21 (R8-3B merged; R8-3C public pages)

- **Owner instruction:** merge accumulated R8-3B into main, then implement R8-3C.
  The development-first decision still defers all testing until after backend and
  database integration. No test work or old assertions were removed or bypassed.
- **Main integration:** PR #8 merged development head
  `ce37e7966c8b50105c539caee44fba70a5a15278`; actual remote main was read back at
  `cd6f91e55f8153b55a8c4af1f4329af1be81f38d`. The development branch was
  fast-forwarded to that merge before new work. No branch/history was removed.
- **Work branch / slice:** R8-3C on `codex/r8-first-frontend`, published separately
  from the preceding R8-3B main merge.
- **Implemented:** journal index and six article detail paths; category/search/
  pagination, contents and reading progress; 42-answer FAQ with topic/search/native
  disclosures; about, process, materials, care, contact and architects pages;
  three fictional portfolio studies and detail routes; bounded catalogue search
  with tier filters/pagination/empty state. Header/footer/homepage now connect the
  new surfaces using shared components and existing typography/tokens.
- **Source content:** six complete original DB001–DB006 article drafts with six
  sections each, excerpts, owner-review notes and existing DP relationships;
  DF001–DF042 supplied FAQ drafts; DS001–DS003 fictional design studies; six
  versioned EP editorial page records. None is published business copy or a
  database row. The remaining 30 article assignments remain unfinished briefs.
- **Content boundaries:** no invented studio history, artist credentials, delivered
  client work, legal/care policy, real contact details or unsupported workshops/3D
  service. Planned FAQ upload/save/message/staff behavior is qualified with current
  preview notes. Professional enquiry reuses the existing local commission form.
- **Preview boundary:** shared request-time guard runs before fixture lookup/render;
  article/study metadata is guarded; unknown slugs call notFound. No fictional live
  canonicals, backend calls, database, auth, upload or outgoing-message work.
  Production holding/fixture denial remains in place.
- **Development feedback:** `npm run typecheck` passed (Next route generation and
  TypeScript compiler, Node 22). This is implementation-wiring feedback only.
  No lint, build verification, unit/preflight/HTTP/browser checks or screenshots
  ran for this slice. Existing QA code remains intact for the final phase.
- **SOURCE_IMPLEMENTED:** R8-3C public-page slice and first editorial batch.
  **UI_READY:** pending deferred visual/keyboard QA. **BACKEND_CONNECTED:** no.
  **TESTED:** not run. Earlier R8-3A results do not certify this source.
- **Products / media / dependencies:** 24 concepts remain (12 LARGE / 6 MEDIUM /
  6 SMALL), two existing AVIFs and 22 pending product visuals. No package/lockfile
  change or new image/font asset. Journal covers are original CSS decorations,
  labelled image-pending. Six owner-generation briefs were appended to the existing
  asset companion; no image generation/download took place.
- **Vercel:** read-only project inspection now reports Node `22.x`, so the prior
  project-default mismatch is resolved; this task changed no setting. Authentication
  protection still reports `all_except_custom_domains`. The authorized main merge
  can trigger the existing production build; development publishing can trigger a
  Preview. No explicit deployment/promotion or live-domain change occurred.
- **Remaining:** owner-approved media/contact/studio/policy content; remaining
  product/article/testimonial/scenario fixtures; R8-3D system states and Studio;
  backend/database/integrations and final QA. S01–S04 and all rejected integrations
  remain excluded. R8-5/V1 and R8-11/V2 are not claimed ready.
- **Checkpoint / publication:** source and current guidance reviewed for the
  development commit. Publish the coherent slice, compare remote/local source trees
  and read back the branch SHA; report those actual values with the draft PR.
  See `docs/R8-3C_PUBLIC_PAGES.md` for route/content maps and remaining boundaries.
- **Next exact task:** R8-3D — complete root-error/loading/unavailable product,
  failed-form/media and explicitly simulated WhatsApp-fallback visual states,
  before moving to Studio development.

## R8 checkpoint — 2026-09-21 (R8-3A merged; R8-3B development)

- **Owner instruction:** put R8-3A in main, defer all testing work until the final
  phase after backend/database integration, then develop R8-3B. The dated decision
  `docs/decisions/2026-09-21-development-first.md` overrides earlier QA timing.
- **Main integration:** PR #7 merged R8-3A head
  `7c47e36b0a523ebb83177952360504b9e17e47c5`; actual remote main is
  `0999b3b0a873e0745231f119c1567b3f8cd79fd8`. Development was fast-forwarded
  to that merge before continuing. No history or branch was removed.
- **Work branch / slice:** R8-3B on `codex/r8-first-frontend`. Its new source is
  published separately; the R8-3A merge does not merge subsequent form work.
- **Implemented:** guarded `/commission`, `/preserve` and `/personalize` routes;
  selected-product configurations and public selection rejection; sample pickers;
  distinct commission/preservation/gifting fields; local steps, conditional contact,
  validation/error focus, review/edit, fictional example filling, optional local
  reference preview, copyable local summary and explicitly simulated receipt.
  Product/home/header CTAs now enter the forms, preserving personal variant choice.
- **State boundary:** fictional inputs stay in React state. Reference files use
  temporary object URLs, never an upload. No local/session storage, API submission,
  saved request, outgoing message, login, checkout or database work. Query strings
  carry only selected public product/variant identifiers.
- **Development feedback:** `npm run typecheck` passed (Next route generation
  and TypeScript compiler, Node 22.23.2). This is implementation-wiring feedback,
  not QA. No lint, build verification, unit, preflight, HTTP, browser or screenshot
  checks were run for this slice. No test files, scripts or assertions were removed or weakened.
- **SOURCE_IMPLEMENTED:** R8-3B local inquiry frontend. **UI_READY:** pending deferred
  visual/keyboard QA. **BACKEND_CONNECTED:** no. **TESTED:** not run for R8-3B.
  Historical R8-3A results below do not certify this source.
- **Dependencies / fixtures / media:** no dependency or lockfile change; 24 labelled
  fixtures remain (12 LARGE / 6 MEDIUM / 6 SMALL), zero database rows, two existing
  concept images and 22 pending visuals. Complete source/demo content remains ahead.
- **Workflow:** continue frontend development, Studio and the protected R8-5
  development handoff; final QA moves after integration. Owner review remains
  owner-controlled and no visual approval is invented. All exclusions remain intact.
- **Vercel / publication:** existing Git deployment triggers can build main and
  development. No explicit deployment, environment/protection setting or domain
  change. Production fixture denial remains in the source. The Node22 dashboard
  alignment remains an owner action as recorded in the runtime note. Publish this
  development checkpoint and read back its actual SHA/tree; report those results.
- **Documentation:** `docs/R8-3B_INQUIRY_FRONTEND.md` maps routes, local behavior,
  preview-only bounds and the deferred final QA boundary. Prior evidence is retained.
- **Next exact task:** R8-3C — journal index/article, FAQ, about/process/materials/care,
  portfolio, contact and search frontend pages, progressively completing labelled
  source content with the existing components and typography.

## R8 checkpoint — 2026-09-21 (R8-3A memory and personal art)

- **Owner request:** diagnose the Vercel runtime warning, then implement R8-3A.
  The application selects tested Node 22; Vercel project default is 24.x. Dashboard
  alignment to 22.x remains an owner action because no authenticated setting-write
  capability is available here. See `docs/VERCEL_RUNTIME_ALIGNMENT.md`.
- **Remote continuity:** PR #6 was already merged externally at main
  `b1f0e095721d5b56a502598fe1478893ebf4e356`, confirmed through GitHub and a READY
  Vercel production deployment. Its tree matched development head
  `528d6b172cd04d98a10541c200be048c7163ab8d`; the work branch was fast-forwarded
  without changing its source or discarding in-progress work.
- **Phase / work branch:** R8-3A on `codex/r8-first-frontend`, based on that main
  merge. This task did not merge main, deploy production or change a domain.
- **Implemented:** discriminated shared catalogue; distinct memory story cards,
  personal gift cards, server-validated tier facets/sorts/pagination, empty/reset
  states; preservation and gifting details, related work, honest guidance and local
  variant radios. Furniture remains primary and all original furniture values match.
- **Fixtures / persistence:** 24 authored concepts (12 LARGE / 6 MEDIUM / 6 SMALL),
  zero database rows. New narratives are 134–142 words and summaries 46–50 words,
  with exact blueprint names and versioned IDs. Full 120/36/42/24/40 content is ahead.
- **Media:** two approved images unchanged, 22 visual-pending studies. The existing
  asset companion contains 12 new slots, three unapproved source-index candidates
  and two filled next-image briefs; no original-media request retried or image generated.
- **Actual checks:** clean npm ci; unchanged lockfile/dependencies; lint/typecheck/
  build pass; 48 unit / 12 preflight / 95 HTTP tests pass. Final full Chromium suite:
  146 passed, 10 mobile-only cases inapplicable on desktop/tablet, zero failures.
  Desktop/tablet/mobile/narrow coverage remains 1440/768/390/320px.
- **Review / evidence:** independent source and screenshot review; size axes made
  explicit and phone filter labels given full width. Six browser screenshots and
  reproducible results are in `docs/R8-3A_MEMORY_PERSONAL_FRONTEND.md`.
- **SOURCE_IMPLEMENTED:** R8-3A. **UI_READY:** tested sample journeys for continued
  work; final media/full frontend not complete. **BACKEND_CONNECTED:** no.
  **TESTED:** actual results above, not physical-device/Safari/Firefox certification.
- **Vercel:** existing owner-created project now observed; Preview authentication
  reports enabled (`all_except_custom_domains`). Development pushes can trigger
  Preview builds, main pushes production builds. No environment/protection settings
  changed. Production still denies all fictional catalogue routes.
- **Schema / scope:** no migrations, real auth, uploads, saved enquiries or outgoing
  messages. Forms remain R8-3B. All rejected integrations and S01–S04 remain excluded.
- **Publication:** review/commit this slice, publish the development branch and
  verify its actual SHA/tree; report those queried results in the task response.
- **V1/V2:** not ready. R8-5 protected visual review and backend gate remain intact.
- **Next exact task:** R8-3B — furniture commission, memory-preservation and
  personal-gifting form visuals with keyboard validation, local summary and an
  explicitly simulated receipt; no real submissions, uploads or messages.

## R8 checkpoint — 2026-09-21 (R8-2 furniture frontend)

- **Owner instruction / main:** merge all accumulated work, then R8-2. PR #5 merged
  browser head `8e8e14b287ebdcc28ed1bd511cb7cbbab914d62b` into main at
  `7d9edc1315c39b22335f9f69599b7c8c89b9a63f`; actual remote ref verified. Historical
  stacked draft PR #3 was closed after all its work was included. No branches removed.
- **Phase / branch / parent:** R8-2A–C furniture UI on `codex/r8-first-frontend`,
  starting from that main merge. Last published development head before this slice:
  `8e8e14b287ebdcc28ed1bd511cb7cbbab914d62b`.
- **Implemented:** locally hosted display/body typography; furniture-led homepage,
  category discovery, material/commission narrative; richer cards; URL category,
  material, width and sort filters with pagination/reset/empty states; detailed
  specifications, price modes, sample availability, finish radios, gallery/zoom,
  failed/pending media, care/site access and related furniture.
- **Fixtures/persistence:** 12 authored LARGE concepts (6 table/desk, 2 seating,
  1 console, 3 spatial-art); 7 ON_REQUEST / 3 STARTING_FROM / 2 FIXED; all sample
  facts labelled. Exact blueprint names, 45–48-word summaries and 135–145-word
  narratives. Stable IDs/version/batch. Zero database rows; full dataset remains ahead.
- **Actual checks:** lint/typecheck/build pass; 33 unit / 12 preflight / 59 HTTP tests
  pass. 98 Chromium browser tests pass at 1440/768/390/320px, 10 mobile-only cases
  inapplicable on desktop/tablet, zero failures. `npm run check` passed in sequence.
- **Browser fixes:** font-variable inheritance corrected; navigation Form keeps
  controls consistent with URL/history; home renders its anchor destinations with
  the page. Tests retain navigation/value assertions and wait for real transitions.
- **Review/evidence:** independent source and detail/gallery visual reviews found
  no remaining material issue. Five unmodified screenshots and a source/operation
  map are in `docs/R8-2_FURNITURE_FRONTEND.md` and `docs/evidence/r8-2/`.
- **Media/fonts:** two existing AVIFs unchanged, ten deliberate pending visuals.
  Original-media access limitations remain; no rejected request retried. Existing
  asset companion updated with eight candidate reviews and two filled missing-image
  briefs. Four licensed local font subsets total 75,040 bytes; licenses/hashes kept.
- **SOURCE_IMPLEMENTED:** R8-2 furniture UI. **UI_READY:** tested sample journey;
  final media and complete frontend remain unfinished. **BACKEND_CONNECTED:** no.
  **TESTED:** actual results above; no physical-device/Safari/Firefox certification.
- **Schema/environment:** no migrations, auth, storage, real enquiries or outgoing
  messages; rejected integrations and S01–S04 still excluded. Runtime app dependencies
  and lockfile unchanged. Node22 HTTP-test script explicitly enables type stripping.
- **Publication:** prepare/review the R8-2 commit and publish to the development branch;
  verify the remote tree/SHA and report it in the task result. The main SHA above is
  the preceding authorized merge, not an automatic merge of this new slice.
- **Vercel / deployment:** connected team still showed zero projects; no deployment
  configuration added, no project created, no production promotion/domain change.
- **V1/V2:** not ready. R8-3 public pages/forms, R8-4 Studio and R8-5 review remain.
- **Next exact task:** R8-3A — distinct memory-art and personal-art collection
  presentations and tier-aware sample detail pages using the shared catalogue.

## R8 checkpoint — 2026-09-21 (main integration and actual browser verification)

- **Owner instruction:** merge accumulated work into main, then go to the next task.
  PR #4 merged development head `274fc26d4a5132ed9c1a23e9b603d15be7dc03a1` into
  main at `f4d79f125622a547488e081fb38e062089c636e6`; remote main was read back.
  Earlier branches are ancestors; no history/branch was removed. See the merge decision.
- **Phase/slice:** R8-1 actual browser verification and mobile-menu repair, continuing
  from that main commit on `codex/r8-first-frontend`.
- **Completed:** repository-owned Playwright configuration/tests; dialog centering,
  keyboard containment, dismissal focus/scroll restoration, anchor navigation and
  desktop-resize behavior. Independent review found no actionable issue.
- **Checks:** clean npm ci with the updated, reviewed 443-entry lockfile; lint and
  semantic typecheck pass; unit 22/22; preflight 12/12; build passes; HTTP 29/29;
  Chromium browser 50 passed / 10 inapplicable mobile-only skips / zero failed.
- **Actual browser evidence:** seven routes at 1440/768/390/320 px, decoded images,
  navigation, unknown-route 404, reduced motion and menu keyboard/focus/scroll.
  Five actual screenshots retained in `docs/evidence/r8-1-browser/`. Read
  `docs/R8-1_BROWSER_VERIFICATION.md` for reproducible commands and limits.
- **SOURCE_IMPLEMENTED:** foundation/browser repair. **UI_READY:** existing
  foundation verified for continued development; complete frontend not ready.
  **BACKEND_CONNECTED:** no. **TESTED:** the checks above.
- **Browser boundary:** the cloud browser still blocks localhost. Local Playwright
  successfully exercised the real built app; no network controls were changed.
  No Safari/Firefox, physical-device or complete accessibility certification claimed.
- **Fixtures/persistence/media:** still two fictional products, zero database rows;
  120/36/42/24/40 content coverage remains ahead. Existing small AVIFs unchanged;
  higher-resolution source access remains blocked as previously documented.
- **Schema/environment:** no schema, real auth, uploads, outgoing messages or backend.
  All rejected integrations and S01–S04 remain excluded. Browser executable override
  is local test tooling only; no deployment configuration or secrets added.
- **Publishing:** this new slice is prepared for a normal development-branch commit;
  query the remote SHA after publication and report it in the task result. The
  already-verified main merge above is separate from subsequent development fixes.
- **Vercel:** connected team again returned zero projects; no project, deployment,
  production promotion or live-domain change. No repository deployment trigger found.
- **V1/V2:** not ready. This is not the R8-5 handoff or owner visual approval.
- **Next exact task:** R8-2 furniture collection discovery and detail presentation,
  using the existing typed concepts/components and progressively authored demo content.

## R8 checkpoint — 2026-09-21 14:20 Asia/Kolkata (dependencies and runtime verified)

- **Phase/slice:** R8-1 continuation; dependency verification and route-status repair.
- **Starting / last verified pushed commit:** `3bb86481fc261d6fd17ef59c56884e76d1e5a3b6`.
- **Repository / work branch:** `rivyalivingart2/RivyaLivingArt2.0` /
  `codex/r8-first-frontend`; origin Git read transport works; no separate push URL.
- **Completed:** actual npm install and reviewed version-3 lockfile (439 entries),
  clean npm ci under Node 22.23.2/npm 10.9.2; lint warning fixes; route-type generation
  before semantic typecheck; real HTTP 404 for unknown collection/product routes;
  collection metadata preview guard; built-server regression suite.
- **Owned paths:** package/lock/generated Next types, PostCSS config, app home and
  collection metadata, loading view moved to shared component, two unused test
  imports, new runtime test, AGENTS/README/workflow/current evidence/checkpoint.
- **Checks:** lint zero warnings; typecheck passes including without prior build
  output; unit 22/22; preflight 12/12; production build passes; HTTP suite 29/29.
  HTTP coverage includes link destinations, exact served image bytes, unknown-route
  404 and production fixture isolation. No browser/hydration pass is inferred.
- **SOURCE_IMPLEMENTED:** dependency/runtime repair slice; **UI_READY:** no,
  awaiting actual browser verification; **BACKEND_CONNECTED:** no;
  **TESTED:** build/unit/preflight/HTTP only.
- **Browser blocker:** actual app starts, but Browser Use rejects its loopback URL
  with `net::ERR_BLOCKED_BY_CLIENT`. Layout, keyboard/focus, reduced motion, image
  decode and client-navigation checks remain unverified; no screenshots fabricated.
- **Fixtures/persistence:** still TWO fictional source products, zero database rows.
  Full 120/36/42/24/40 source coverage remains ahead. No backend work started.
- **Media:** existing derivatives unchanged. Riverline raw fetch rejected by automatic
  approval review; Basin byte transfer failed HTTP 403. Details and safe continuation
  are in `docs/R8-1_DEPENDENCY_VERIFICATION.md`.
- **Schema/environment:** no schema, secrets, auth, uploads or outgoing messages.
  Test-only child environments exercise production denial; no deployment flags changed.
- **Owner work:** source, nine briefs and historical checkpoints/evidence preserved.
- **Publishing:** reviewed checkpoint commit/push verification pending at writing;
  terminal push failed due to absent GitHub write credentials. Use the authorized
  GitHub connector and verify both tree equality and actual branch SHA. Actual SHA
  and remote confirmation belong in the session result.
- **Vercel:** connected team again lists zero projects. None created/deployed;
  no repository deployment workflows found. Main and live domain unchanged.
- **V1/V2:** not ready. Frontend continuation beyond the initial browser gate remains
  pending; this is not the R8-5 visual-review handoff.
- **Next exact task:** run the real frontend in an authorized browser-capable
  environment at 390/768/1440 px; verify menu keyboard/focus/Escape/scroll restoration,
  navigation, image decode, unknown routes and reduced motion, fix failures and
  capture actual screenshots before continuing R8-2 furniture presentation.

## R8 checkpoint — 2026-09-21 (new build confirmed; initial frontend source)

- **Owner decision:** this is a new build with Markdown specifications only. Initial
  application creation is authorized; do not ask for old source again. See
  `docs/decisions/2026-09-21-new-build.md`.
- **Branch/parent:** `codex/r8-first-frontend` from
  `7f7ec493ac3163821b369f72982435eb32e9c0b3`; main unchanged.
- **Slice:** R8-1 initial app foundation, public shell and furniture presentation.
- **Source:** Next.js/TypeScript configuration, CSS-first tokens, responsive header,
  mobile dialog source, homepage, collection/concept pages, status-only Studio and
  system views. No prior source was replaced; briefs and tools remain intact.
- **Fixtures/media:** TWO fictional source records (DP001/DP013); zero database rows.
  Two inspected Drive concept images have compact local AVIF preview derivatives.
  Full demo counts, higher-quality production assets and final typography remain.
- **Tests:** `npm test` passed 22 pure policy/fixture/source-contract tests. Seventeen
  source TS/TSX files passed a global TS5.8.3 syntax-only check; two CSS files parsed.
  A source-derived static diagnostic had three decoded images and no horizontal
  overflow at 1440/390px; this is NOT Next/React/hydration/event/browser-app testing.
- **Blocker:** npm install failed EAI_AGAIN resolving registry.npmjs.org. No dependency
  tree/lockfile; ESLint, semantic typecheck, Next build and actual app browser tests
  remain unrun. Direct shell Git network is unavailable; connector publication is
  separate. Do not describe source tests or static screenshots as a successful build.
- **SOURCE_IMPLEMENTED:** initial slice. **UI_READY:** pending build/browser checks.
  **BACKEND_CONNECTED:** no. **TESTED:** limited checks above. **V1/V2:** not ready.
- **Environment:** no app secrets, schema migrations, real auth, uploads or messages.
  Preview flag is not authentication; online preview needs verified protection.
  Connected Vercel team returned no projects; none created/deployed/changed.
- **Docs:** current AGENTS, README and Codex workflow updated; new owner decision,
  frontend evidence and media manifest added. Old audits/checkpoints unchanged below.
- **Publication at checkpoint-writing time:** reviewed source prepared for a draft
  commit on the named branch. Final SHA and remote verification belong in the task/PR
  result and must be queried, not inferred from this pre-commit document.
- **Next exact task:** in network-enabled Codex install actual packages and generate
  the real lockfile; run lint/typecheck/unit/preflight/build and actual responsive
  browser checks, fix errors, commit/publish verified results, then continue the
  furniture frontend. Do not scaffold again or begin backend before visual review.

## R8 checkpoint — 2026-09-21 (R8-0 remote verification and Codex handoff)

- **Phase/slice:** R8-0 follow-up; repository tooling and handoff, not application UI.
- **Confirmed destination:** `rivyalivingart2/RivyaLivingArt2.0`.
- **Baseline main SHA:** `5500fe9b92fb48d015dbb873afea1434d0bd8c18`.
- **Work branch:** `codex/r8-repository-handoff`, created from the baseline.
- **Observed source:** both pre-existing branches contain the same 13 documentation
  files and no application manifest, lockfile, routes, components or backend.
- **Access:** GitHub connector read/write capability verified. Direct container Git
  clone failed DNS resolution; this is not evidence that connector publishing fails.
- **Completed files:** `docs/CODEX_WORKFLOW.md`, `docs/R8-0_REMOTE_VERIFICATION.md`,
  `tools/codex-preflight.mjs`, `tools/codex-preflight.test.mjs`; current README,
  AGENTS guidance and this appended checkpoint updated. Earlier audit retained.
- **Tests:** Node syntax checks passed; 12 preflight tests passed, 0 failed. Tests
  use temporary local Git repositories and do not run application code or networks.
- **UI_READY:** No; **BACKEND_CONNECTED:** No; **application TESTED:** No.
- **Fixtures/media:** 0 application fixtures, 0 persisted rows, no Drive imports.
- **Environment/deployment:** no CI/deployment files in baseline; connected Vercel
  context returned no projects. No Vercel changes, deployments, paid activation,
  migrations, production merge, or main-branch update authorized/performed.
- **Commit/push state at writing:** files prepared/tested; commit and remote-ref
  verification to be recorded in the completed task report. Do not equate this
  planned publication with evidence; query the actual branch SHA.
- **Unresolved:** source restoration or explicit authorization to initialize the
  first application in this confirmed repo. The URL is no longer a missing input.
- **Next exact instruction:** resolve that one source decision; then perform the
  first source-backed R8-1 frontend slice. Follow `docs/CODEX_WORKFLOW.md`; do not
  re-run a missing-remote loop or silently override the no-replacement rule.

## R8 checkpoint — 2026-09-21 (R8-0 audit)

- **Phase/slice and stage:** R8-0 grounded audit; documentation-only checkpoint.
- **Last verified pushed commit before this slice:** none verifiable; no remote is configured.
- **Actual safe remote identity / work branch:** remote unavailable / local branch `work`.
- **Goal and exact owned paths:** audit the selected checkout; add `AGENTS.md`,
  `docs/R8-0_AUDIT.md`, this checkpoint, and index them from `README.md`.
- **UI_READY:** No — application source is absent.
- **BACKEND_CONNECTED:** No — backend source and configuration are absent.
- **TESTED:** Audit documents checked programmatically; no application test/build command exists.
- **Fixture versus persisted counts:** 0 authored source fixtures; 0 persisted records.
  The blueprint targets (120 products, 36 complete articles, 42 FAQs, 24 explicitly
  fictional testimonials, and 40 scenarios) remain unimplemented.
- **Asset inputs/outputs:** none available; `reference/91707.png` and approved Drive
  assets are not present in the checkout. No asset prompt was falsely marked fulfilled.
- **Schema/environment impact:** none.
- **Owner work preserved:** the README and all nine supplied Revision 8 documents;
  no source, history, or configuration was reset.
- **Commit/push:** commit pending at checkpoint-writing time; push is blocked because
  `.git/config` has no remote.
- **Vercel:** not requested; project, integration, deployment triggers, and preview
  protection are not observable in this checkout.
- **V1/V2:** both blocked. V1 is additionally blocked by absent frontend source;
  V2 remains out of sequence until visual review and backend integration.
- **Next exact instruction:** restore or identify the actual application source and
  verified safe remote in this repository, then repeat the source/deployment portions
  of R8-0 and implement the existing-shell tokens/header/mobile-nav R8-1 slice.

Detailed evidence and the full blocker statement are in `docs/R8-0_AUDIT.md`.
