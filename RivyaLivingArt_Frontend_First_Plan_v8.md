# RivyaLivingArt — Frontend-First Implementation Plan

**Revision 8 · 21 September 2026**  
**Master:** `RivyaLivingArt_Master_Build_Prompt_v8.md`

> **Later owner instruction — 21 September 2026:** development first; all
> testing-related work occurs at the final stage after backend/database
> integration. This overrides the per-slice and R8-5 QA timing below and in the
> older Revision 8 companions. Keep existing tests and checks intact; compiler/
> typechecking may resolve development wiring only. Historical results remain
> historical, and new R8-3B source is untested. R8-5 still provides protected
> frontend-development preview instructions and preserves owner review control;
> full QA is not a prerequisite to integration, and no visual approval is implied.
> See [the dated decision](docs/decisions/2026-09-21-development-first.md).

## 1. New order, unchanged final scope

**Effective order: website frontend → Studio frontend → development Git checkpoint
→ protected Vercel frontend handoff / owner review → backend/database integration
→ persistent demo management → final consolidated QA → owner Vercel deployment.**

The source and Git audit already exists. PR #7 merged R8-3A into main at
`0999b3b0a873e0745231f119c1567b3f8cd79fd8`; new R8-3B form work continues on
development. Its typed local simulations add no real uploads, persistence or
messages. The next exact task is **R8-3C**, followed by R8-3D and Studio. The phase
requirements below retain their feature scope; their earlier QA-gating clauses are
superseded by the dated timing override, not silently marked complete.

Revision 8 explicitly replaces Revision 7's backend-first ordering. Use `R8-0` through `R8-11` in active task IDs so earlier `Phase 4`, for example, cannot be mistaken for the new phase 4. Preserve historical checkpoints and add a phase crosswalk; do not renumber history or repeat already implemented functionality solely to fit the new order.

Keep all 52 specifications (W01–W30, A01–A22) and 12 CMS capabilities. Each component has a visual milestone and, where needed, a separate integration milestone. The `A` component IDs are stable, not phase numbers. Full backend requirements in the master describe the final result; they do not require backend-first execution.

## 2. Phase plan

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

## 3. Frontend slice ordering and real visual acceptance

### R8-0 — grounded audit before substantive edits

Read effective instructions and the current master. Establish the actual checkout and safe Git target, baseline commands, current routes/interfaces and a narrow fixture-only rendering path. Do not spend this phase redesigning schemas or provisioning accounts. Record which of the 52 components already exist, need restyling or need new compatible UI. The first audit report must name the first concrete visual slice, not leave a vague backend architecture exercise. After reporting the audit, continue to that smallest R8-1 slice in the same session when source/permissions and checks permit. Pause only for a real blocker, the V1 review gate, or the normal session boundary; do not require an unnecessary separate feature-approval round.

Map source-supported fields to shared view contracts. Inspect enough auth/server code to keep it safe; do not alter business security for screenshots. Verify which assets can actually be read. The known Drive folder is an intake reference, not proof this Codex environment can access it. The supplied logo board remains the visual reference; clean logo masters can be an asset blocker without blocking the whole UI.

### R8-1 — first visible result

1A: semantic bronze/forest/ivory tokens, typography scale, focus/control states and layout spacing.  
1B: header, mobile menu, footer, container/grid and first furniture-hero composition.  
1C: presentation models, shared empty/error/loading components, fixture adapter and a basic Studio shell.

Produce screenshots or an actually runnable local URL plus honest evidence availability. Small visible progress comes before SQL redesign. Do not invent missing screenshot evidence. Commit/push each completed slice through the Git companion.

### R8-2 — primary large-art site first

2A: furniture-led homepage including approved large object imagery, selected pieces and material/commission narrative.  
2B: collectible landing, tables/seating/consoles/installations discovery and URL-backed fixture filters.  
2C: large product card/detail/gallery, ordinary finish choices, specification fields, related work and commission CTA.

Keep actual dimensions and price modes in typed data; demo facts stay visibly fictional in preview. A missing valid GLB means a good poster/gallery, not a fabricated 3D experience. Do not add S03's enhanced comparison/configurator.

### R8-3 — all remaining public pages and form states

3A: memory and personal collections with genuinely different cards and detail density.  
3B: large commission, preservation and gifting forms: usable steps, keyboard validation, optional local preview of safe sample reference images, local summary and explicitly simulated receipt.  
3C: journal index/article layouts, FAQ, about/process/materials/care, portfolio, contact, search and approved existing service routes.  
3D: 404/error/root error, empty/unavailable product, loading, failed-media, failed-form and WhatsApp fallback designs; responsive refinements.

Write the full 36 demo article drafts across bounded content slices, not in one unreviewed batch. The demo companion's briefs are inputs to writing, not completed articles. Complete all 120 named concept records, 42 FAQ answers, 24 fictional quotes and 40 order scenarios as source fixtures by V1. Actual insertion into a database is R8-9.

### R8-4 — Studio frontend after the public website

4A: consistent sidebar/navigation and dashboard with fixture-derived metrics; product list/detail/tier fields/form builder.  
4B: content hub, page-section editor, Tiptap presentation, FAQs/blog/testimonial editors, media picker, layout preview, autosave/validation/history presentation.  
4C: enquiry pipeline/status details, internal notes, catalogue import/export controls, demo manager/remove dialogs and independent menu visibility.  
4D: login/setup/recovery/access-denied visuals, staff/role/session panels and environment-health layout.

Reuse production-bound presentation components through a separately isolated visual harness. Do not remove real `/studio` authentication. A login mock must not accept real passwords or authenticate anyone. Where the final backend does not exist yet, use labelled local state/simulation or a clear disabled integration state; no unexplained dead controls and no fake success. All real operations are implemented later.

### R8-5 — stop for V1 visual review

Check primary routes and all Studio views at desktop, tablet and phone widths, plus keyboard/reduced motion. Verify actual fixture counts, article bodies, no broken navigation, useful static media fallbacks and no backend/secret dependency for visual rendering. Use existing test tooling; add a compatible free tool only for a real test gap.

Complete the V1 checklist, document exact project-root/build settings and the minimal preview environment contract, commit/push and verify the remote SHA. Tell the owner to deploy that commit as a protected Vercel Preview. Do not send a production-ready message. Pause substantive backend implementation for the visual review or an explicit instruction to continue. Fix review feedback in new tested, pushed slices; do not reopen rejected feature suggestions.

## 4. Backend integration without redesigning the frontend

R8-6 begins by replacing fixture reads behind stable interfaces, not by replacing the UI with admin templates. Inventory every simulated operation and assign an actual service/action, permission, validation schema, storage owner and test. Keep a per-operation status: `UI_READY`, `BACKEND_CONNECTED`, `TESTED`, `BLOCKED`. Do not describe `UI_READY` as a completed feature.

R8-7 custom-CMS subphases:

| Slice | Requirement | Evidence |
|---|---|---|
| R8-7A | Preserve existing content, map typed schemas/sections and add only needed draft/revision structures | Content/route/renderer parity; non-destructive migration |
| R8-7B | Connect editors, media/relation pickers and version-aware draft autosave | Save/read round-trip; stale/two-tab conflict checks |
| R8-7C | Protected real draft preview, exact-revision review/publish/unpublish and delivery refresh | No draft/cache leak; unauthorized/stale publish denied |
| R8-7D | History/diff/restore, dependencies, safe export and owner workflow | Restore creates draft; live snapshot unchanged; real owner edit exercise |
| R8-7E | Existing conditional scheduling requirement only when runner is authorized and tested | Persisted jobs, interval/cost/retry/cancel evidence; otherwise explicitly inactive, not a blocker to manual publishing |

R8-8 wires the public enquiry journey and Studio operations. Synthetic data continues to use no-op transport. Real enquiry saves must succeed before actual WhatsApp handoff. Use the same reviewed receipt and fallback UI without implying message delivery or accepted payment.

R8-9 imports exactly the stable source fixture pack into an isolated database through a deterministic seed service. Preserve dataset origin and prior cleanup/retain semantics. Show real persisted demo cleanup results instead of the earlier browser-only simulation. Keep 120/36/42/24/40 as a clean initial seed target, not an instruction to recreate removed examples. Additional actual order statuses get examples without destructive enum changes.

R8-10 tests both presentation parity and backend correctness. R8-11 hands the owner a specific release candidate, not a collection of unverified setup advice.

## 5. Required working documents inside the repository

Use existing indexed paths. A proposed import location is `docs/briefs/rivya-v8/` for this pack, not an instruction to move historical files. Update the existing documentation index and any repo-map test. Merge the supplied AGENTS addendum into existing guidance; never overwrite a whole existing `AGENTS.md`.

Maintain a component-operation table like this using **actual** paths:

| ID / operation | Actual UI path | Visual state | Actual service/action path | Integration state | Evidence | Last verified pushed commit |
|---|---|---|---|---|---|---|
| W16 / commission submit | To audit | Not started | To audit | Planned | None | None |
| A19 / remove demo batch | To audit | Not started | To audit | Planned | None | None |

Do not fill this sample table with fictitious paths or completed statuses. The full 52-row map is created from the actual code.

## 6. Phase crosswalk from Revision 7

| Previous workstream | Revision 8 destination |
|---|---|
| Phase 0 audit | R8-0, expanded with Git/deployment checks |
| Phase 1 foundations | R8-1; later backend-only dependencies in R8-6 |
| Phase 2 data/storage | Read contracts in R8-0/1; implement backend in R8-6 and fixtures in R8-9 |
| Phase 3 staff/Studio | Visuals R8-4; real auth R8-6; operational integration R8-8/9 |
| Phase 4 custom CMS, 4A–4E | Visuals R8-4; integrated CMS R8-7A–7E |
| Phase 5 large-art website | R8-2 before backend |
| Phase 6 commission journey | Visuals R8-3; real persistence/handoff R8-8 |
| Phase 7 other public pages | R8-3 |
| Phase 8 imports/demo | Visuals R8-4; durable services/cleanup R8-9 |
| Phase 9 assets/motion | Incremental R8-1–5; final returned assets and parity R8-10 |
| Phase 10 quality | Visual QA R8-5 and integrated QA R8-10 |
| Phase 11 deployment | V1 visual handoff R8-5; V2 full handoff R8-11 |

No old progress is erased by this crosswalk. The user has requested the frontend-first order; all business, custom-CMS, privacy and rejected-feature boundaries from Revision 7 remain unchanged.
