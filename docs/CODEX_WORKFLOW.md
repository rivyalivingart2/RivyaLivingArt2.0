# Continue the new RivyaLivingArt application in Codex

**Repository:** `rivyalivingart2/RivyaLivingArt2.0`  
**Working branch:** `codex/r8-first-frontend`  
**Latest decisions:** new build confirmed; accumulated work merged through PRs #4 and #5
under the owner’s subsequent instruction. New work continues on the development branch.

Read `AGENTS.md`, `PROJECT_STATE.md`, `docs/decisions/2026-09-21-new-build.md` and
`docs/R8-1_FRONTEND_FOUNDATION.md`. The nine Revision 8 documents remain the feature
specification; the dated owner decision supersedes their initial source-gap guard.
**Do not ask for old source, restore another repository, scaffold again or generate
another prompt pack.** Continue the source now present.

**Current continuation update:** R8-3A is verified: 24 authored concepts
(12/6/6), 48 unit / 12 preflight / 95 HTTP / 146 browser tests; 10 mobile-only cases
are inapplicable on desktop/tablet. Clean npm ci, lint/typecheck/build pass. Read
`docs/R8-3A_MEMORY_PERSONAL_FRONTEND.md` and `docs/VERCEL_RUNTIME_ALIGNMENT.md`.
The next task is R8-3B. PR #6 was already merged when this slice began; new work
continues on development. Vercel now has Git deployment triggers and Preview
protection; the app's Node22 requirement overrides its Node24 project default.

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
different origin or print credential-bearing URLs. Use the existing preflight:

```sh
node tools/codex-preflight.mjs --report-only
node --test tools/codex-preflight.test.mjs
```

The source presence check is not a dependency, build, security or deployment test.

## 2. Reproduce the verified build and browser checks

The original authoring container had DNS failures; that historical limitation is
resolved in the current continuation. The real lockfile is committed with the
dependency-verification slice. Terminal Git reads work here; terminal push lacks
write credentials. Use the authorized GitHub connector to publish and verify the
branch ref, or normal Git push when a later workspace already has credentials.

Use a network-enabled authorized coding environment, Node 22 and the root package:

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

Run the real app using `npm run dev`, or after a successful build use
`RIVYA_VISUAL_PREVIEW=1 npm start` for local production-mode testing. Verify desktop,
mobile, keyboard dialog behavior, route transitions, unknown slugs, reduced motion,
image loading and the production holding-page policy. Static diagnostic images are
not browser evidence for React hydration or server behavior.

## 3. Copy-ready continuation task

```text
Continue rivyalivingart2/RivyaLivingArt2.0 on codex/r8-first-frontend or its
reviewed successor. This is an owner-authorized NEW BUILD. The source is now
present; do not scaffold again or ask for old application files.

Read AGENTS.md, PROJECT_STATE.md, docs/CODEX_WORKFLOW.md, the new-build decision
and the R8-1 evidence document. Follow the relevant Revision 8 requirements.

The R8-3A memory/personal frontend is verified; read its current
evidence. Use npm ci, npm run check and npm run test:e2e with installed Chromium
to reproduce it. Resolve real errors without suppressing checks.

Continue R8-3B: furniture commission, memory-preservation and personal-gifting
form visuals, keyboard validation, local summary and an explicitly simulated receipt.
Do not send real requests, upload files or launch messages. Progressively author the required content using
reusable components, the dark logo-derived tokens and honest fixture labels.
Do not start backend implementation before the visual-review gate.

Twenty-four fictional source products exist (12 LARGE / 6 MEDIUM / 6 SMALL);
22 lack approved visuals. Complete the specified
120/36/42/24/40 source content progressively; do not claim full counts early.
Use the known Drive sources first and give missing image/video prompts to the
owner in the separate asset document. Do not generate a replacement logo.

Do not add Sanity, scraper, Higgsfield, customer accounts, checkout/payment,
continuous Drive sync, in-CMS generation or rejected S01–S04 features.
No fake staff auth, persisted saves, uploads or outgoing messages in preview.

After each coherent slice: test, inspect the diff, update relevant Markdown
and checkpoint, stage only owned changes, commit to a safe development branch,
publish through authorized Git or the environment's PR action, and verify the
remote SHA. Check deployment triggers before publishing. Never force-push or
merge/deploy production. Report unrun/failed checks and blocked publishing honestly.

At R8-5 provide the protected Vercel visual-preview handoff and pause backend
work for owner review. The completed R8-3A sample journeys are NOT that completed gate.
```

## 4. Git, readiness and next sessions

Use the established slice workflow. Report SOURCE_IMPLEMENTED, UI_READY,
BACKEND_CONNECTED and TESTED independently. Commit only reviewed source/docs/media
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
setting was changed here. The owner separately authorized PRs #4/#5; PR #6 was
already merged when this slice began. Later work continues on development.
Preview protection and build verification remain prerequisites; a preview flag
and noindex are not access control.

After dependency/build/browser verification, continue the recorded frontend task,
not the earlier documentation-only audit. Preserve historical records unchanged.
