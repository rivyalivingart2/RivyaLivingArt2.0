# Continue the new RivyaLivingArt application in Codex

**Repository:** `rivyalivingart2/RivyaLivingArt2.0`  
**Working branch:** `codex/r8-first-frontend`  
**Latest decisions:** R8-3A merged through PR #7; development first, with all QA
deferred until after backend/database integration. New work stays on development.

Read `AGENTS.md`, `PROJECT_STATE.md`,
`docs/decisions/2026-09-21-development-first.md`, the new-build decision and the
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
do not cover new R8-3B source. Read `docs/R8-3B_INQUIRY_FRONTEND.md` for the current
form-development slice; its testing is deferred. Next is R8-3C public-page work.
Vercel has Git deployment triggers and Preview protection; the app's Node22
requirement overrides its Node24 project default.

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

Use Node 22 and the root package. R8-3B requires no dependency changes. For ordinary
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
docs/decisions/2026-09-21-development-first.md and the current slice document.
Follow the relevant Revision 8 features under the latest dated owner overrides.

R8-3A is merged into main through PR #7. Its historical checks do not certify new
R8-3B source. ALL testing-related work is deferred until after backend/database
integration. Do not run/add tests, lint/preflight, build verification or browser/
visual QA now. Compiler/typechecking is allowed only for development wiring.
Preserve existing tests/scripts/assertions; do not suppress checks or claim TESTED.

R8-3B adds typed client-only commission, preservation and gifting forms, local
validation/summary, optional local reference-image preview and simulated receipts.
Read docs/R8-3B_INQUIRY_FRONTEND.md. Continue R8-3C: journal/article, FAQ,
about/process/materials/care, portfolio, contact, search and approved service pages.
Progressively author the required content using existing components, dark tokens
and honest fixture labels. No real requests, uploads, persistence or messages.
Finish public frontend then Studio; do not start backend in the current slice.

Twenty-four fictional source products exist (12 LARGE / 6 MEDIUM / 6 SMALL);
22 lack approved visuals. Complete the specified
120/36/42/24/40 source content progressively; do not claim full counts early.
Use the known Drive sources first and give missing image/video prompts to the
owner in the separate asset document. Do not generate a replacement logo.

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
BACKEND_CONNECTED and TESTED independently. R8-3B is untested; compiler feedback
alone does not establish UI_READY or TESTED. Commit only intended source/docs/media
derivatives. Never commit node_modules, .next, credentials, private photos, original
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
remaining dashboard default alignment to Node22; no environment or protection
setting was changed here. The owner separately authorized the R8-3A merge through
PR #7. Later work continues on development. Preview protection remains required;
a preview flag and noindex are not access control. Do not change the production
fixture guard to make a development preview visible.

Continue the recorded development task without reopening historical verification
loops. Preserve historical evidence unchanged and record deferred final QA plainly.
