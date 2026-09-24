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

# Continue the new RivyaLivingArt application in Codex

**Repository:** `rivyalivingart2/RivyaLivingArt2.0`  
**Working branch:** `codex/r8-first-frontend`  
**Latest decisions:** R8-4A merged through PR #11; development first, with all QA
deferred until after backend/database integration. New work stays on development.

Read `AGENTS.md`, `PROJECT_STATE.md`,
`docs/decisions/2026-09-21-development-first.md`,
`docs/decisions/2026-09-21-r8-4a-main-merge.md`, the new-build decision and the
current slice document. The nine Revision 8 documents remain the feature
specification; dated owner decisions supersede their source-gap and QA-timing rules.
**Do not ask for old source, restore another repository, scaffold again or generate
another prompt pack.** Continue the source now present.

**Historical baseline:** R8-3A was verified: 24 authored concepts
(12/6/6), 48 unit / 12 preflight / 95 HTTP / 146 browser tests; 10 mobile-only cases
are inapplicable on desktop/tablet. Clean npm ci, lint/typecheck/build pass. Read
`docs/R8-3A_MEMORY_PERSONAL_FRONTEND.md` and `docs/VERCEL_RUNTIME_ALIGNMENT.md`.
The owner-authorized PR #7 merged that work at
`0999b3b0a873e0745231f119c1567b3f8cd79fd8`, verified from the remote ref. Those checks
do not cover R8-3B, R8-3C, R8-3D, R8-4A or R8-4B source. R8-3B merged through PR #8 at
`cd6f91e55f8153b55a8c4af1f4329af1be81f38d`. The owner then authorized PR #9
to merge R8-3C at `96af467fe5cc94dc56f1fa507df35317cbdbc798`, also verified
from the remote main ref. PR #10 then merged R8-3D source head
`679a358b334bcc658226a3661ed6b6add2dff852` at
`6e1be895b98a147ce0f00102e2ade7f9881db9f6`, verified from the main reference.
PR #11 subsequently merged R8-4A head
`0691ef45500dc679577aaf1f77ea534f5c98bb67` at
`8b8c81f5d85bf0a78d165184b3d8e460073452e4`, read back from the remote main ref.
Read `docs/R8-3B_INQUIRY_FRONTEND.md` for the local form
boundary, `docs/R8-3C_PUBLIC_PAGES.md` for public pages and
`docs/R8-3D_SYSTEM_STATES.md` for state visuals and article progress.
Read `docs/R8-4A_STUDIO_CATALOGUE.md` for the Studio shell, dashboard,
product table/editors and form-builder presentation. These slices await final QA.
Read `docs/R8-4B_CONTENT_WORKSPACE.md` for the current content hub, typed editors,
actual Tiptap, controlled page sections, shared media picker, responsive preview
and local autosave/validation/history presentation. New R8-4B work is published
separately on development. Next is R8-4C: enquiry pipeline/status details and
internal notes, catalogue import/export, demo manager/remove dialogs and independent
menu visibility.
Vercel has Git deployment triggers and Preview protection. Read-only project
inspection still reports Node `22.x`, aligned with the app; no setting was changed
by this task.

**Current rule:** do development work now. Do not run or add per-slice test work,
lint/preflight suites, build verification or browser/visual QA. Compiler/typechecking
is allowed only to resolve implementation wiring and must not be called a QA pass.
Keep existing test sources, scripts and assertions intact for final QA after the
backend/database and remaining integrations are complete.

## 1. Open the correct branch

Select the repository and this branch in the coding workspace. For a new local
checkout only:

```sh
git clone --branch codex/r8-first-frontend https://github.com/rivyalivingart2/RivyaLivingArt2.0.git
cd RivyaLivingArt2.0
```

For an existing checkout, inspect status, current branch and fetch/push identity
before switching or fetching. Preserve unrelated edits. If origin is genuinely absent
and the checkout is this exact project, add the confirmed URL; never overwrite a
different origin or print credential-bearing URLs. Read Git status, remote identity
and deployment targets directly. The existing preflight tooling is retained for
final QA; do not run its suite as a current development gate.

## 2. Develop now; retain the final QA commands

The original authoring container had DNS failures; that historical limitation is
resolved in the current continuation. The real lockfile is committed with the
dependency-verification slice. Terminal Git reads work here; terminal push lacks
write credentials. Use the authorized GitHub connector to publish and verify the
branch ref, or normal Git push when a later workspace already has credentials.

Use Node 22 and the root package. R8-4B adds actual Tiptap core/pm/react/starter-kit
with exact 3.31.3 pins and a regenerated lockfile. Retain the existing Next/React
versions; no paid/cloud collaboration or hosted CMS is added. For ordinary
local development, `npm run dev` starts the app. When needed to resolve TypeScript
wiring, `npm run typecheck` generates route types and runs the compiler; record only
that limited outcome, not TESTED or full UI readiness.

The following commands remain available **for final QA after integration**. They
are retained here for continuity, not as instructions to execute them now:

```sh
npm ci
npm run lint
npm run typecheck
npm test
npm run test:preflight
npm run build
npm run test:runtime
npx playwright install chromium
npm run test:e2e
```

The existing Next/React/Tailwind pins installed together and built successfully.
Do not change them merely to restart installation. Review metadata/peer constraints
when a real dependency change is needed. Do not invent a lockfile, bypass integrity
checks or disable sandbox controls. `npm run check` runs lint, typecheck, unit,
preflight, build and HTTP checks; browser setup and `test:e2e` are separate.
The runtime suite checks real Next servers over HTTP. The separate browser suite
starts a local preview and checks the hydrated app; it refuses Vercel deployments.
An existing local Chromium executable may be selected with the test-only
`RIVYA_BROWSER_EXECUTABLE` override. See the evidence for this workspace’s runtime.

During final QA, use the real built app with `RIVYA_VISUAL_PREVIEW=1 npm start` for
local preview-mode checks. Exercise desktop/mobile, keyboard dialogs, route
transitions, unknown slugs, reduced motion, media and production isolation, plus
the actual backend/database journeys. Static diagnostic images do not establish
React hydration, server behavior or integrated correctness.

## 3. Copy-ready continuation task

```text
Continue rivyalivingart2/RivyaLivingArt2.0 on codex/r8-first-frontend or its
reviewed successor. This is an owner-authorized NEW BUILD. The source is now
present; do not scaffold again or ask for old application files.

Read AGENTS.md, PROJECT_STATE.md, docs/CODEX_WORKFLOW.md,
docs/decisions/2026-09-21-development-first.md,
docs/decisions/2026-09-21-r8-4a-main-merge.md and the current slice document.
Follow the relevant Revision 8 features under the latest dated owner overrides.

R8-4A is merged into main through PR #11 at
8b8c81f5d85bf0a78d165184b3d8e460073452e4. Historical R8-3A checks do not certify
R8-3B, R8-3C, R8-3D, R8-4A or R8-4B source. ALL testing-related work is deferred until after
backend/database integration. Do not run/add tests, lint/preflight, build verification or browser/
visual QA now. Compiler/typechecking is allowed only for development wiring.
Preserve existing tests/scripts/assertions; do not suppress checks or claim TESTED.

R8-3B adds typed client-only commission, preservation and gifting forms, local
validation/summary, optional local reference-image preview and simulated receipts.
R8-3C adds journal/article, FAQ, about/process/materials/care, portfolio, contact,
architect enquiry and catalogue search. R8-3D adds 404/error/root-error/loading/
empty/unavailable states, media fallback/gallery retry, local form-failure and
blocked-WhatsApp simulations, pending indicators and a guarded /preview/states
presentation gallery. The gallery is development UI, not completed QA or runtime
fault injection. Keep pending boundaries after route validation; do not add a
root loading boundary that could stream success before unknown-route rejection.
Read docs/R8-3B_INQUIRY_FRONTEND.md, docs/R8-3C_PUBLIC_PAGES.md and
docs/R8-3D_SYSTEM_STATES.md. R8-4A adds the isolated /preview/studio shell,
fixture-derived dashboard, URL-filtered product table, local tier-aware product
editors and typed form builder. Read docs/R8-4A_STUDIO_CATALOGUE.md. Keep /studio
holding intact with its preview-only harness link, guard every preview
page/layout/metadata path, and keep real staff authentication separate. The harness has no sessions, backend permissions,
persistent saves or public fixture mutations. Typed builder fields use the same
public renderer; do not accept JavaScript or arbitrary executable conditions.
R8-4B adds the content hub and typed page/article/FAQ/testimonial editors,
eleven registered marketing sections, actual Tiptap and safe structured rendering,
shared public-safe media references, responsive preview and local autosave/history.
Read docs/R8-4B_CONTENT_WORKSPACE.md. Checkpoint/duplicate/archive/restore and
failure/conflict examples are session-local presentations, not durable saves,
publication or real server conflict protection. Product prices/specifications stay
catalogue-owned; the marketing composer remains distinct from inquiry forms.
Continue R8-4C: enquiry pipeline/status details and internal notes, catalogue
import/export controls, demo manager/remove dialogs and independent menu visibility.
Use existing components, dark tokens and honest fixture labels. No fake staff
authentication, real requests, uploads, persistence or messages. Do not start
backend integration in this frontend slice.

Thirty-six fictional source products exist (24 LARGE / 6 MEDIUM / 6 SMALL);
34 lack approved visuals, and 84 of the 120 products remain to author. Twelve full
article drafts (DB001–DB012), 42 FAQ answers, all 24 supplied fictional
testimonials (DT001–DT024) and three fictional project studies now exist as source.
The testimonial disclosure must remain permanently visible; no ratings, reviewer
photos, verified badges or conversion to real customer evidence. Complete the
remaining 84 products, 24 articles, operational scenarios and broader page/history
coverage progressively; do not claim full demo coverage early. The two existing
images are preview-only, and pending media or generation briefs are not approvals.
Use the known Drive sources first and give missing image/video prompts to the
owner in the separate asset document. Do not generate a replacement logo.

The master Section 1 already supplies the phone, WhatsApp, email and map link.
R8-3D corrects the earlier missing-contact description; preserve exact supplied
values and keep local fictional drafts out of live contact links. Never infer a
street address, hours or delivery terms. Real care/legal wording, studio history
and authentic supporting media still require owner review.

Do not add Sanity, scraper, Higgsfield, customer accounts, checkout/payment,
continuous Drive sync, in-CMS generation or rejected S01–S04 features.
No fake staff auth, persisted saves, uploads or outgoing messages in preview.

After each coherent development slice: inspect the changes for the commit,
update Markdown/checkpoint, stage only owned changes, commit to safe development,
publish through authorized Git or the environment's PR action, and verify the
remote SHA. Check deployment triggers before publishing. Never force-push or
merge/deploy production without a new explicit instruction. Report testing as
deferred and blocked publishing honestly; remote-SHA verification still applies.

At R8-5 provide the exact protected Vercel frontend-development preview instructions
and branch/SHA. Preserve owner review control; do not invent visual approval.
Full QA is not a prerequisite to integration under the new instruction. Await
owner review or explicit continuation at that handoff. Final QA follows integration.
```

## 4. Git, readiness and next sessions

Use the development-first slice workflow. Report SOURCE_IMPLEMENTED, UI_READY,
BACKEND_CONNECTED and TESTED independently. R8-3B, R8-3C, R8-3D, R8-4A and R8-4B
are untested.
Compiler feedback alone does not establish UI_READY or TESTED. Commit only
intended source/docs/media derivatives. Never commit node_modules, .next, credentials, private photos, original
asset collections or machine-specific configuration. If a slice is blocked, a draft
checkpoint commit may preserve it, but must not describe it as a completed build.

Verify publication from the actual branch reference, e.g. compare local HEAD with
`git ls-remote origin refs/heads/<actual-branch>` when Git transport is available.
Connector-based publication must instead verify the created commit and branch via
the connector. A created commit object alone is not a branch update.

The connected Vercel project now exists and has READY production deployments from
main. Preview authentication is reported enabled (`all_except_custom_domains`).
Recheck target and protection before publishing: a development push may trigger a
Preview build, while main may deploy production. The runtime note documents the
current read-only observation that the project default is now Node22, resolving
the earlier mismatch; no environment, runtime or protection setting was changed
here. The owner separately authorized the R8-4A merge through PR #11. Later work
continues on development. Preview protection remains required;
a preview flag and noindex are not access control. Do not change the production
fixture guard to make a development preview visible.

Continue the recorded development task without reopening historical verification
loops. Preserve historical evidence unchanged and record deferred final QA plainly.
