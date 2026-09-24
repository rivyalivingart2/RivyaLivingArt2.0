# Active owner instruction — Midnight atelier presentation redesign

24 September 2026. Read docs/decisions/2026-09-24-midnight-atelier.md and docs/redesign/MIDNIGHT-ATELIER-CHECKPOINT.md. The owner explicitly resumed presentation work and its quality gates. Work on codex/midnight-atelier from current main; preserve the current published ShopSite architecture and all data/security behavior. Publish a protected Preview for owner visual review only. No main merge or Production deployment is authorized for this new redesign. Prior stopped operational work remains pending.

---
# Active owner instruction — publish current work; further development and testing stopped

24 September 2026. Read docs/decisions/2026-09-24-publish-current-stop-testing.md. The owner explicitly requested completing current publication to GitHub main and Vercel Preview/Production, stopping new work and testing, and documenting all pending work. This supersedes the earlier all-findings-closed release hold for this current deployment. Do not resume the pending development or test programme without a new owner request.

Read docs/redesign/PENDING-WORK.md for the complete current status and docs/redesign/PHASE-11-CHECKPOINT.md for continuation. Master revision 3.13 records this scope change; Phase 11 is not fully complete. Existing completed work, restricted runtime configuration, retention-control schema and deliberate approved public-content publication are being released. Preview/Production share the authorized database/private store with independent session secrets. WhatsApp remains saved-order Open/Copy plus manual customer Send only. Search indexing remains off; automatic Git deployment remains off.

No new purchases, customer accounts, payments, Netlify, WhatsApp automation or Sheets synchronization. Preserve original assets, drafts, data, revision history, secrets and private backups. The older checkpoint text below is historical where superseded.

---

# Active checkpoint — Phase 11 verification in progress

The owner authorized completing all remaining work, normal GitHub main publication and intentional Vercel Preview/Production release after the applicable checks. Read docs/decisions/2026-09-24-pro-final-release.md and 2026-09-24-operating-policies.md. The correct Vercel team now has Pro; the earlier free-only/Hobby hold is superseded. No additional paid service is authorized.

Continue codex/final-verification-release from merged main fc6d3fe (PR #25). Read docs/redesign/PHASE-11-CHECKPOINT.md for exact current evidence and pending tasks. Master revision 3.12 is an in-progress verification update, not a release certificate. No repeat plan, asset, shared database or shared private-store approval is needed.

172 unit checks, 12 preflight checks, lint/typecheck/build and the first isolated browser order/Studio tests have passed at their recorded intermediate source; later edits require rerun. QA uses separate database rivya_qa_20260924 and private store store_maHrpDDHXPR93N0w, with independent credentials. The normal Preview/Production shared resources must never receive synthetic tests. QA now has 120 published products, 47 content entries including 36 articles and 131 media entries. Shared-resource publication remains pending.

The encrypted database archive was uploaded to an owner-only Drive folder and restored into isolated resources with matching counts/digests for 16 tables. Recovery-key password-manager/physical custody, scheduled operations, reference/remote restore and complete privacy lifecycle remain unverified. Do not mark these achieved because the owner delegated them. Current live runtime grants, full device/security/accessibility/performance/media/license QA and exact deployment checks remain release gates.

WhatsApp remains saved-order Open/Copy followed by manual customer Send only. No bots, generic chat, notifications, payments, customer accounts, Sheets synchronization or Netlify. Preserve original assets, drafts, revisions and data. Do not rerun historical migrations or wholesale historical publication candidates. Keep automatic Git deployment disabled and normal order flags off until their release checks pass. No new main merge or deployment has occurred in Phase 11.

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
