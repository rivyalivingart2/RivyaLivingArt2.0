# R8-0 follow-up: confirmed repository, source still absent

**Checked:** 21 September 2026.  
**Owner-confirmed destination:** `rivyalivingart2/RivyaLivingArt2.0`.  
**Baseline main commit:** `5500fe9b92fb48d015dbb873afea1434d0bd8c18`.  
**Baseline tree:** `d62ee2f2dd0af67eb40f25e27e49dc93b138eab9`.

This supplements, and does not rewrite, the dated `R8-0_AUDIT.md`.

## Observed evidence

- GitHub repository metadata resolves the exact owner's URL and grants the active
  connection pull/push permissions. The default branch is `main`.
- The branch listing returned `main` and
  `codex/audit-and-build-frontend-for-rivyalivingart`. Recursive tree reads for
  both commits were complete (`truncated: false`) and contain the same 13 files:
  nine brief documents, README, AGENTS, PROJECT_STATE and the earlier audit.
- There is no package manifest, lockfile, `src`, `app`, `pages`, Prisma schema,
  auth implementation, CI workflow, `.vercel` link or `vercel.json` in those trees.
- The supplied logo remains accessible in this conversation, but is not tracked
  in either inspected branch. No Drive media was imported during this follow-up.
- The connected Vercel context returned an empty projects list. No project,
  deployment, domain, resource or secret was created or changed. This is not an
  assertion about other unconnected Vercel accounts.
- The container's direct Git clone failed with `Could not resolve host: github.com`.
  The connected GitHub API did work. Do not confuse those two access mechanisms.

## Scope and work in this follow-up

The current request identifies the correct repository but does not explicitly
rescind its checked-in prohibition on initializing a replacement app when source
is absent. Preserve that rule until the owner chooses source restoration or
initial application creation. Do not invent the historical Next.js application
or claim compatibility with code that has not been supplied.

Add a concrete Codex workflow and dependency-free, read-only preflight with tests.
The preflight distinguishes wrong/missing remotes from missing application source,
redacts remote credentials, supports an explicit nested app root, does not execute
package scripts and never reports application/deployment tests as completed.

**Handoff branch:** `codex/r8-repository-handoff`, created from the baseline main
commit. No update to main, force push, merge, deployment or source deletion is
part of this slice. Remote completion must be verified after commit/ref creation;
this document cannot contain its own future commit hash.

## Executed checks

Environment: Node.js `v22.16.0`, Git `2.47.3`.

- `node --check tools/codex-preflight.mjs`: passed.
- `node --test tools/codex-preflight.test.mjs`: 12 tests passed, 0 failed.
- Tests used temporary local Git repositories and synthetic source markers. They
  did not contact GitHub, inspect production data or modify the owner's repository.
- Application install/typecheck/lint/build/browser tests: **not run; source absent**.
- Application fixtures: 0 authored or persisted; no website/Studio UI implemented.
- V1/V2 deployment readiness: **blocked**, not ready.

## Exact next decision

Choose one: identify/restore the existing application source with its history, or
explicitly authorize initialization of the first application in this confirmed
repository. The repository URL is no longer a missing input. The Codex guide
contains the one-line owner instruction needed for the second path.

After that choice, begin the first source-backed R8-1 visual slice, not backend
setup. Preserve the existing nine briefs, source-control history, exclusions,
contact details, logo direction and per-slice commit/push requirements.
