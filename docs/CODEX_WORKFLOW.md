# Continue the new RivyaLivingArt application in Codex

**Repository:** `rivyalivingart2/RivyaLivingArt2.0`  
**Working branch:** `codex/r8-first-frontend`  
**Latest decision:** new build confirmed; first application initialization authorized.

Read `AGENTS.md`, `PROJECT_STATE.md`, `docs/decisions/2026-09-21-new-build.md` and
`docs/R8-1_FRONTEND_FOUNDATION.md`. The nine Revision 8 documents remain the feature
specification; the dated owner decision supersedes their initial source-gap guard.
**Do not ask for old source, restore another repository, scaffold again or generate
another prompt pack.** Continue the source now present.

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

## 2. First actual task: install, lock and verify the frontend

The authoring container had DNS failures for registry.npmjs.org and github.com.
Source was published through the authorized GitHub connector; a terminal Git push
was not claimed. No fake lockfile or successful Next build was substituted.

Use a network-enabled authorized coding environment, Node 22 and the root package:

```sh
npm install
npm run lint
npm run typecheck
npm test
npm run test:preflight
npm run build
```

Review current stable package metadata and peer constraints before changing candidate
pins. Resolve real errors, generate and commit `package-lock.json`, then verify a
clean `npm ci`. Do not write an invented lockfile, bypass integrity checks or disable
sandbox controls to retrieve packages. If installation is still blocked, record the
specific network failure and preserve all source; it is not a missing-source blocker.

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

First install actual dependencies in the authorized network environment,
generate/review the real lockfile, and run lint, semantic typecheck, the fixture
and preflight tests, and the Next.js build. Resolve errors without suppressing
checks. Test the actual rendered frontend and mobile dialog in a browser.

Then continue the smallest R8-1/R8-2 visual task: improve production-quality
media/typography, furniture collection and detail layouts while preserving
reusable components, the dark logo-derived tokens and honest fixture labels.
Do not start backend implementation before the visual-review gate.

Only two fictional source products currently exist. Complete the specified
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
work for owner review. This current R8-1 source is NOT that completed gate.
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

The connected Vercel team returned no projects during this slice. Recheck later;
this does not cover unrelated accounts. No project creation, paid activation, preview
deployment, main merge or live-domain action occurred. Preview protection and build
verification remain prerequisites; a preview flag and noindex are not access control.

After dependency/build/browser verification, continue the recorded frontend task,
not the earlier documentation-only audit. Preserve historical records unchanged.
