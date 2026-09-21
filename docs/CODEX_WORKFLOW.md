# Work on RivyaLivingArt in Codex

**Confirmed repository:** `rivyalivingart2/RivyaLivingArt2.0`  
**Clone URL:** `https://github.com/rivyalivingart2/RivyaLivingArt2.0.git`  
**Handoff branch:** `codex/r8-repository-handoff`  
**Application brief:** the nine Revision 8 Markdown files already at the repository root.

## Current reality — 21 September 2026

The repository identity is resolved. Both branches inspected before this handoff
contained the same documentation-only tree: no package manifest, lockfile, Next.js
application, components, database schema or authentication source. The earlier
missing-remote statement describes an earlier local Codex checkout; it does not
mean this GitHub repository is inaccessible.

Read `docs/R8-0_REMOTE_VERIFICATION.md` and the newest `PROJECT_STATE.md` entry.
Connecting a remote does not restore missing application files. Existing `AGENTS.md`
and the Revision 8 brief explicitly prohibit silently generating a replacement app.
The owner must either identify/restore existing source, or explicitly authorize the
first application to be initialized here. Do not repeatedly ask for this repository
URL or silently pick the different repository mentioned in the asset README.

## 1. Open the correct checkout

In Codex, select `rivyalivingart2/RivyaLivingArt2.0` and the handoff branch when the
current interface supports branch selection. Otherwise fetch/check out this branch
using the environment's authorized Git workflow. Do not overwrite another task's
working tree.

For a **new local checkout only**:

```sh
git clone --branch codex/r8-repository-handoff \
  https://github.com/rivyalivingart2/RivyaLivingArt2.0.git
cd RivyaLivingArt2.0
```

For an existing checkout, inspect `git status --short` and the repository identity
first. If `origin` is genuinely absent and this is the owner's selected checkout,
add only the confirmed remote:

```sh
git remote add origin https://github.com/rivyalivingart2/RivyaLivingArt2.0.git
git fetch origin
```

Do not replace an existing different remote, discard edits, reset history, force
push or merge unrelated histories. Never paste remote URLs containing credentials
into prompts or logs. A fetch failure is not a reason to fabricate successful sync.

## 2. Run the checks that actually exist

These tools require Node.js and Git, but no npm dependencies or package manifest:

```sh
node --check tools/codex-preflight.mjs
node --test tools/codex-preflight.test.mjs
node tools/codex-preflight.mjs --report-only
```

The preflight only reads Git identity and known source markers. It does not install
packages, read `.env` values, fetch, push, edit configuration or approve deployment.
It checks both fetch and push origins. A zero exit with `--report-only` means the
report completed, not that the application exists. Without that flag, exit 3 means
source is absent; exit 2 means the expected remote was not established; exit 4
means another reported source prerequisite remains. Even exit 0 is not a successful
application build. For a verified monorepo app, pass `--app-root apps/web` or its
actual path; the script will not search arbitrary directories or leave the repo.

Do not invent `npm run dev`, `npm ci`, lint or application-build results while
`package.json` and application source are absent. Once source exists, inspect the
actual scripts and lockfile before installing or running them.

## 3. Copy this task into Codex

```text
Use rivyalivingart2/RivyaLivingArt2.0 as the confirmed repository. Start on the
codex/r8-repository-handoff branch or its reviewed successor. Read AGENTS.md,
PROJECT_STATE.md, docs/CODEX_WORKFLOW.md, docs/R8-0_REMOTE_VERIFICATION.md and
the relevant Revision 8 documents. Preserve all existing files and history.

Run the dependency-free preflight and its tests. Report separately whether the
remote is correct and whether application source exists. Do not repeat the old
"no remote" blocker once it has been resolved. This branch has no frontend yet.

If application source is still absent, check for a new explicit owner decision
to initialize the first Next.js application here. Without that decision, ask
one precise question about restoring source versus initializing here; do not
silently scaffold and do not write another large replacement prompt pack.

After source is available or initial creation is explicitly authorized, follow
frontend-first R8 order. Implement a small forest/bronze/ivory foundation,
responsive header/mobile navigation and furniture-led homepage direction first.
Use typed, labelled source fixtures, not fake login or persisted operations.
Keep the reviewed components as backend adapters are added later.

Keep all Revision 8 business rules: RivyaLivingArt; furniture primary; our own
CMS; WhatsApp enquiries; no customer accounts or checkout; no Sanity, scraper,
Higgsfield or S01-S04 additions. Reuse approved Drive assets and return missing
image/video briefs to the owner in the separate existing asset-prompts file.

After each completed coherent slice, run actual checks, inspect and stage only
owned changes, update Markdown/checkpoint, commit, push to the verified safe
work branch, and verify the remote SHA. A local commit is not a verified push.
Use an authorized Codex PR/publish action when raw Git push is unavailable.
Report blockers instead of copying credentials or disabling sandbox controls.

At R8-5 report protected frontend-preview readiness and exact deployment
settings for owner action. Pause for visual review before substantial backend
work. At R8-11 report full-deployment readiness or precise remaining blockers.
Do not create a Vercel project, deploy, merge main or change a domain now.
```

## 4. Initial creation needs a specific owner decision

The following is **not approved by this document**. The owner may explicitly send
it to resolve the current source-absence guard:

> There is no existing application source to restore. Initialize the first
> Next.js application inside rivyalivingart2/RivyaLivingArt2.0 on a development
> branch. Preserve the existing documents and history, record this narrow
> override of the source-absence guard, and follow the Revision 8 frontend-first
> plan. Do not deploy or merge production.

After that decision, do not start another source-gap loop. Build in place rather
than running a template generator over the root documents. Verify current stable
versions from original documentation/package sources; create and test a real
lockfile. No backend credentials are required for the first visual slice.

## 5. Per-slice and Vercel handoff

Report phase/slice, changed paths, UI_READY/BACKEND_CONNECTED/TESTED separately,
actual tests, commit SHA, verified remote branch/SHA, and one next instruction.
When checking a raw Git push, compare `git rev-parse HEAD` with the SHA returned by
`git ls-remote origin refs/heads/<actual-work-branch>`. Never force a mismatch away.

The connected Vercel context returned no projects during this handoff. Recheck
before a later push/deploy; that observation does not cover unrelated accounts.
This branch adds only documentation and read-only development tooling, no build
or automatic deployment configuration. Do not call it a deployable website.

V1 needs actual frontend code, a verified build, screenshots, safe fixture mode
and protection before telling the owner to deploy a visual preview. V2 also needs
authentication, CMS/database/storage/enquiry integration, cleanup/privacy tests,
production configuration and approved real content. Consult the existing Vercel
handoff document for both gates. Creating a new Vercel project or enabling paid
features still requires the owner's instruction.

## References checked for this handoff

- OpenAI: https://developers.openai.com/codex/guides/agents-md — repository-scoped guidance.
- OpenAI: https://developers.openai.com/codex/cloud/environments — environment-specific tools and access.
- Vercel: https://vercel.com/docs/git — branch pushes can trigger deployments.

A Codex connection and this chat's GitHub connection need not have identical
network access or credentials. Never claim one grants the other permission.
