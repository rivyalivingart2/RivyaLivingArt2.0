# Active checkpoint — Phase 10 audit/remediation complete; release HELD

The owner authorized the next phase and GitHub publication; read docs/decisions/2026-09-24-phase-10-execution.md. Canonical master: docs/redesign/RivyaLivingArt-Commercial-Implementation-Plan.md revision 3.11. Read RivyaLivingArt-Commercial-Readiness-Report.md, PHASE-10-OPERATIONS-RUNBOOK.md, phase-10-source.json and IMPLEMENTATION_PROGRESS.md. P10.1–P10.7 audit/remediation checkpoint is complete under the explicit release-held exit. Next exact task: P11.1, safe local final QA first. Do not repeat plan/asset/shared-storage approval.

Source fixes: canonical login throttle identity, minimum guest HMAC secret, validated/projected published contacts, correct published-image ownership before product publication, accurate administrator service/attention counts and deliberate first contact publication. Current operational warnings supersede stale migration instructions. No new analytics, accounts, payment or extra WhatsApp use.

Fresh read-only audit: 16 tables, 134 columns, 151 constraints; the intentionally unvalidated legacy-provider check remains. Only pre-existing budget/session rows exist; zero orders/catalogue/content/business settings/staff/private Blob objects. The inspected credential owns all tables and can create roles/databases/bypass RLS; restricted runtime credentials remain a High release gate. Both encrypted backup sets exist; full isolated restore and portable recovery remain unproved.

Vercel dashboard still shows Hobby. Existing production remains dpl_7HRC8CVEJ98ih86yRxoppxVgMgR2 / f9533bbbaf3cc2843025f1a1243442b0a9d920e8. Future Preview/Production intentionally share the modern database and private store; existing deployments retain captured settings. No provider setting, database row/schema/grant, content publication, upload/deletion/export or deployment changed. Order-write flags and automatic deployment remain off. No synthetic QA on shared data.

Branch codex/phase-10-commercial-readiness starts from freshly fetched merged main 80be3a0120e200b2d7ce874305b2d117d4e104e1, PR #24. Read phase-10-github-publication.json and the local completion artifact for independently verified publication heads; fetch fresh refs. TypeScript no-emit is development wiring, not formal QA. P11 local checks can start while hosting is held; database/Blob tests and full restore require different disposable resources and independent credentials.

CR-01–CR-20 retain exact findings and dispositions. Release gates include eligible free Vercel hosting, runtime grants/secrets/targets, recovery/lifecycle, missing policy facts, deliberate content/media/contact publication, full subject/device/license review and exact-commit QA. The specific retention/cancellation/delivery question remains unanswered. Six Phase 9 source image corrections remain authoritative; preserve drafts and original bytes. Never reseed historical reviewed-publication.json or replay applied Phase 2/6 DDL.

WhatsApp remains saved-order Open/Copy followed by manual customer Send only. No generic chat, bot, notifications, payments, customer accounts, cart or Netlify. Main/eligible release remains Phase 12 after the required gates.

Older records below are historical where superseded.

---

# Active owner instruction — approved full redesign

Latest override: read docs/decisions/2026-09-23-vercel-only-hold.md. Publish saved source to the existing GitHub work branch; Vercel only, no Netlify. Commercial deployment remains on hold under free-only constraints. Do not bypass vercel.json's automatic-deployment hold or activate business workflows on Hobby without resolved eligibility.

Continue the approved master from `docs/redesign/CHECKPOINT.md`. Read `docs/decisions/2026-09-23-approved-full-redesign.md` first. Older appearance, frontend-only and release restrictions below are historical where superseded. Preserve source/data; final QA and eligible free hosting remain release gates.

---

# Latest owner override — 23 September 2026 production release

The owner confirmed Studio login and explicitly authorized merging the full current update into main and deploying Vercel Production, using free services only. See `docs/decisions/2026-09-23-production-release.md`. This overrides the historical no-main/no-production and public holding-page restrictions below for this release. Keep Studio server authentication, concept/sample disclosures, separate production data, and the deferred formal-QA boundary. The actual CMS remains partially local; deployment is not full backend completion.

---

# RivyaLivingArt repository guidance

Read this file, `PROJECT_STATE.md`, `docs/CODEX_WORKFLOW.md` and the applicable
Revision 8 specification before editing.

## Current checkpoint — 22 September 2026

The owner approved the existing Sites design and then asked to continue non-image
development while they generate assets. The same Site is preserved; no redesign,
new Site, deployment or sharing change is authorized. Current source fixtures are
120 products (84/24/12), 36 articles, 42 FAQs, 24 fictional testimonials and 40
fictional enquiries. Older counts below are historical.

Continue `codex/sites-approved-design`. See `docs/sites/non-image-development.md`
and `docs/sites/source-version.json` for the latest native source and port.
CSV/XLSX parsing, local batches/exports, draft continuity, cleanup dependencies and
review validation now exist as browser-only demonstrations. Database/auth/storage
and real WhatsApp handoff remain in R8 integration; do not describe them as connected.
Formal QA remains deferred. The owner is preparing missing assets; do not generate
substitutes or retry the previously blocked Drive child access.

The GitHub repository is PUBLIC. After the public-disclosure blocker was reported,
the owner explicitly instructed: “Put this updated code into gitrepo” with this
repository URL. This authorizes publishing the prepared source and included approved
asset derivatives on `codex/sites-approved-design`. See
`docs/decisions/2026-09-22-approved-code-publication.md`. Keep main and the live Site
unchanged; no new sharing, secrets, domains or manual deployment is authorized.
The earlier rejection is history, not a reason to request the same approval again.

Publication is complete. GitHub implementation commit
`d74ca0ee722011bd453b08bc8939892413b0bd86` has the exact tree of local authoring
checkpoint `96af6ca360b68dafe33e94f2ee20e7cf49bccb3a`. Draft PR #13 targets main.
Read `docs/sites/github-publication.json` before continuing; fetch the current remote
branch instead of assuming the older local and connector-created commit IDs match.
The existing Git integration created a protected Preview automatically. No manual
deployment or production change was requested. The saved/live Site is unchanged.

## Latest owner decision — 21 September 2026

**This is a new build.** The Markdown files were the brief, not missing application
source. The owner explicitly authorized the first application here; see
`docs/decisions/2026-09-21-new-build.md`. Earlier source-restoration guards are
superseded for this initialization. Do not restart the source-gap/approval loop.
The first frontend source now exists. Preserve it, all briefs and Git history.

The owner subsequently authorized merging completed R8-4A into main, then
continuing R8-4B. PR #11 is merged at
`8b8c81f5d85bf0a78d165184b3d8e460073452e4`; the remote SHA was verified.
New R8-4B work continues on the development branch; the preceding merge is not
standing authorization to merge this new slice. See
`docs/decisions/2026-09-21-r8-4a-main-merge.md`.

**Latest override: development first; all testing-related work moves to the final
stage after backend/database integration.** Do not run per-slice lint, test,
preflight, build-verification or browser/visual QA gates. Compiler/typechecking
may resolve development wiring only; it does not establish TESTED. Keep all test
source, commands and checks intact for final QA. This overrides conflicting timing
in the older briefs and workflow. See
`docs/decisions/2026-09-21-development-first.md`.

- Exact brand: **RivyaLivingArt**. Large collectible resin furniture/spatial art
  leads; memory art and personal gifts are distinct secondary journeys.
- Continue public frontend, then Studio, then the R8-5 protected development-preview
  handoff and owner review, before backend R8-6 onward. Full QA is no longer a
  prerequisite to integration. Do not invent owner visual approval. Track
  SOURCE_IMPLEMENTED, UI_READY, BACKEND_CONNECTED and TESTED separately.
- Dark forest/bronze/ivory tokens. Reuse components and typed, labelled fixtures.
  No fake login, sessions, persistence, upload, payment, review or production claims.
- Build our own CMS later; no Sanity, scraping, Higgsfield, continuous Drive sync,
  in-CMS media generation, customer accounts, checkout or payment integration.
- S01 MFA/passkeys, S02 PDF quotation builder, S03 enhanced finish comparison and
  S04 private client approvals remain excluded. Do not re-propose them.
- Use approved Drive media first. Write missing image/video prompts for the owner
  in the existing separate asset document. No replacement logo, product recolouring,
  private media or large original media collections in Git.
- Thirty-six labelled source fixtures exist: 24 LARGE / 6 MEDIUM / 6 SMALL;
  two images, 34 pending visuals. Article source is 12/36, FAQs 42/42 and
  fictional testimonials 24/24; operational scenarios remain 0/40. The complete
  demo dataset, persistent CMS, staff login, data/storage and real enquiries remain
  planned work.
- Current visual flag is NOT authentication. Online preview requires separately
  verified deployment protection. Never enable fixture routes in Vercel production.
- The master Section 1 already supplies the business phone, WhatsApp, email and
  map link. R8-3D corrects the earlier claim that contacts were missing. Use those
  exact supplied values; do not infer an address, opening hours or delivery terms.
  Local fictional drafts must never be transferred into live contact links.
- No secrets in code, prompts, commits, diagnostics or `.env.example`.

## Deferred checks and current development boundary

Node 22; npm project at repository root. The actual dependency tree and
package-lock.json exist. R8-4B adds actual Tiptap with exact 3.31.3 pins for core,
pm, react and starter-kit; retain the existing Next/React versions. Commands below
remain available for the final QA stage; this is not an instruction to run them
during the current development slices.

```sh
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npm run test:preflight
npm run test:runtime # after npm run build; real HTTP checks
npx playwright install chromium # once per browser environment
npm run test:e2e # after npm run build; actual local browser tests
```

Historical R8-3A memory/personal checks passed before the timing override:
48 unit, 12 preflight, 95 HTTP and 146 Chromium browser tests, with 10 mobile-only
cases inapplicable on desktop/tablet. Clean npm ci, lint/typecheck/build pass. Read
`docs/R8-3A_MEMORY_PERSONAL_FRONTEND.md` for current evidence and media limits.
Browser Use's cloud loopback restriction is unchanged; the historical local
Playwright evidence did not weaken network controls. Those results do not cover
R8-3B, R8-3C, R8-3D, R8-4A or R8-4B and are not R8-5 owner approval.

R8-3B provides typed, client-only commission, preservation and gifting forms,
local validation/summary, an explicitly simulated receipt and local reference-image
preview. No real submissions, uploads, persistence or messages. Read
`docs/R8-3B_INQUIRY_FRONTEND.md`; its new source is untested and final QA is deferred.
R8-3C adds journal/article, FAQ, about/process/materials/care, portfolio, contact,
architect enquiry and catalogue-search frontend pages. Six full labelled article
drafts (DB001–DB006), 42 FAQ answers and three fictional project studies are source
content, not published business claims. Read `docs/R8-3C_PUBLIC_PAGES.md`.
R8-3D adds shared 404/error/root-error/loading/empty/unavailable states, media
fallbacks and gallery retry, local form-failure and blocked-WhatsApp simulations,
and a guarded `/preview/states` presentation gallery. This gallery is implemented
UI, not performed QA or runtime fault injection. Pending indicators and boundaries
belong after route validation; avoid a root loading boundary that could stream
a success response before an invalid route is rejected. Six more article drafts
(DB007–DB012) bring the source total to 12/36, leaving 24. The complete
120-product/24-testimonial/40-scenario targets remain ahead. Read
`docs/R8-3D_SYSTEM_STATES.md`; all new source remains untested pending final QA.
R8-4A adds the isolated `/preview/studio` shell, fixture-derived dashboard,
URL-filtered product list, local product drafts and typed form-builder presentation.
Guard each harness layout/page and metadata before fixture access. The existing
`/studio` holding boundary remains intact, with a link to the harness only when
preview is allowed: no fake staff identity, authenticated session, backend
permission or persistent operation. Root application framing
omits public chrome only on the Studio presentation path. Future modules have
explicit status pages, not invented working editors. Local review/draft/builder
changes never alter public source fixtures or database records. Product tier
changes require confirmation and preserve the other tier fields in local state.
The form builder uses the public schema and shared input renderer; allow only
typed fields/conditions, never JavaScript. Read `docs/R8-4A_STUDIO_CATALOGUE.md`.
Twelve additional LARGE records bring products to 36/120, with 84 remaining.
No new media is mapped.

R8-4B adds the guarded content hub, typed page/article/FAQ/testimonial editors,
eleven registered marketing section types, actual Tiptap, the shared media picker,
responsive preview and local autosave/validation/history presentation. Read
`docs/R8-4B_CONTENT_WORKSPACE.md`. Content and media routes live under
`/preview/studio`; keep every page and metadata guard before fixture access.
Shared renderers use typed JSON and stable references, never arbitrary HTML,
JavaScript or private attachments. Product specifications/prices stay catalogue-owned.
The marketing composer does not replace the product inquiry form builder.
All checkpoints, duplicate/archive/restore and conflict/failure examples are
session-local presentation, not durable saves, publication, staff audit or actual
server conflict protection. Public source fixtures remain unchanged by local edits.
The media picker distinguishes the two preview-only images from 34 pending
visuals and never invents production rights approval or working upload/storage.
DT001–DT024 complete the supplied fictional quote batch. The shared quote renderer
always retains “Fictional sample — not a customer review.” No stars, reviewer
photos, verified badges or review-schema claims. Remaining products/articles,
page drafts, history examples, studies and operational fixtures are still incomplete.
Next: R8-4C enquiry pipeline/status details and internal notes, catalogue
import/export controls, demo manager/remove dialogs and independent menu visibility.

The owner-created Vercel project exists, with prior READY main deployments and
Preview authentication reported enabled. Recheck deployment target and protection
before publishing. Read-only project inspection during R8-4A still reports Node
`22.x`, aligned with the repository. No setting was changed by this task; the prior
Node24 mismatch is resolved in the current project setting. See
`docs/VERCEL_RUNTIME_ALIGNMENT.md`. Never expose fixtures in production.

## Git and continuity

Work on `codex/r8-first-frontend` or its reviewed successor in the confirmed repo.
Inspect current changes, remote identity and deployment triggers. After a coherent
slice: update docs/checkpoint, inspect changes for the development commit, stage
only owned files, commit normally, publish to the safe work branch and verify the
actual remote SHA. Record testing as deferred, not passed; existing evidence only
covers its recorded revision. The R8-4A merge is not standing authorization to merge
later slices. No force-push, branch deletion, automatic production release or
live-domain changes.

The full requirements remain the nine Revision 8 documents. Apply the dated new-build
override above where they still describe nonexistent prior source. Do not rewrite
historical audits or create another competing master pack.
