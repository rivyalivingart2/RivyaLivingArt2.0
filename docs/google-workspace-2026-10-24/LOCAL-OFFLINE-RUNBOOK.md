# Rivya Living Art — local and offline Antigravity runbook

Prepared 26 October 2026. Open the existing project in Antigravity and use [the Gemini/Antigravity master prompt](CONTINUE-IN-GEMINI-ANTIGRAVITY.md). This guide preserves the existing branch, code and private local work while distinguishing local execution from connected Google verification.

Read [the current handoff checkpoint](ANTIGRAVITY-HANDOFF-CHECKPOINT.md) and [verification receipt](antigravity-handoff-verification.json) for the latest source revision and actual tests. These documents distinguish fresh 26 October observations from retained 24–25 October evidence.

The source of truth is the inspected checkout plus current remote/provider observations. The released main checkpoint is `019f4c1bac2c03dfeab00a1ed1fb46dc20c29d30`. The continuation branch is `codex/google-cloud-acceptance`; [PR #67](https://github.com/rivyalivingart2/RivyaLivingArt2.0/pull/67) was open at preparation. Do not reset newer local work to either recorded SHA.

## 1. What “offline” includes

| Activity | Works locally without a live service? | Conditions and limits |
| --- | --- | --- |
| Read/edit committed code, prompts, plans and schemas | Yes | Repository/source archive must already be present. |
| Local Git history, branches, commits and diffs | Yes | Requires a Git checkout or a supplied Git bundle. A source ZIP alone has no history. |
| Pure unit tests and Apps Script/Google emulators | Yes | Compatible Node, npm dependencies and required local assets must already be installed/cached. Results remain local evidence. |
| Typecheck, lint and application build | Normally yes after dependency preparation | Use the pinned repository toolchain. Missing dependencies are a preparation issue; do not change versions to force success. |
| Local browser preview | Yes within available inputs | A fresh clone has no populated private provider. Safe holding/login states are not proof of full business workflows. |
| Existing guarded Windows QA rehearsal | Only on the original prepared machine/environment | Requires its actual private guard/configuration and populated cluster. Do not bootstrap or seed replacements. |
| Real Google installation/permission/round-trip checks | No | Requires network, actual intended account, registered targets and appropriate runtime credentials. |
| Native Google Slides and real Google PDF generation | No | Requires approved template/output resources and authorized Google execution. A local mock cannot establish this. |
| GitHub fetch/push/PR/check/merge or Vercel deployment | No | Requires authenticated connectivity and applicable release authority. |
| Fresh vendor/Pinterest/official-source research | No | Queue work until online; retain dates on older evidence. |
| Cloud-hosted Gemini/Antigravity reasoning | Do not assume offline availability | Keeping files local does not make a cloud model offline. Use the tools actually available; report connectivity limits. |

The offline deliverable is the available **committed project and continuation instructions**. It is not a copy of missing Windows originals, private customer exports, credentials, browser sessions, the existing loopback database or ignored Google operation journals. Preserve those where the owner already keeps them; do not reconstruct them from summaries.

## 2. Inspect the existing Windows workspace first

Open the actual existing repository folder in Antigravity. In its PowerShell terminal, run these read-only commands individually:

```powershell
Get-Location
git rev-parse --show-toplevel
git remote -v
git status --short --branch
git branch --show-current
git rev-parse HEAD
git worktree list
git branch -vv
git diff --stat
git diff --cached --stat
git log -8 --oneline --decorate
```

Confirm the repository is `rivyalivingart2/RivyaLivingArt2.0`. The worktree may contain important work that was never pushed. Record its scope privately before changing branches or installing/building anything that may replace generated files. Do not print secret file contents into terminal logs or the model conversation.

**If the worktree is dirty:** retain the files and branch. Review what belongs to the owner, current phase and other tasks. Make an explicit preservation checkpoint using the existing private backup process before any integration that could conflict. Never use `git reset --hard`, `git clean`, a forced checkout, a blanket stash, blanket staging or a repository replacement as a shortcut.

**If the worktree is on another branch:** inspect its relationship to `codex/google-cloud-acceptance` before switching. A detached worktree, additional branch or unpushed commit is evidence to preserve. Use a separate worktree only if needed for safe inspection/testing; the designated continuation branch remains the same.

**If the continuation branch is already checked out elsewhere:** use that worktree or coordinate with its owner. Do not force the same branch into a second working tree or start competing agents on it.

Do not delete or replace the original local database, private evidence, source media, uploaded assets, local configuration or running reference previews. The historical ports 4210–4215 and database port 55442 describe earlier local services, not guaranteed current availability.

## 3. Refresh remote evidence when online

From the correctly identified repository, with local changes preserved:

```powershell
git fetch origin
git rev-parse origin/main
git rev-parse origin/codex/google-cloud-acceptance
git log --oneline --left-right origin/main...origin/codex/google-cloud-acceptance
git status --short --branch
```

At the handoff, main was `019f4c1bac2c03dfeab00a1ed1fb46dc20c29d30` and the pre-handoff continuation head was `ab717a61c3a5133ce32a88b2b36dfe29d9a7c5dd`. Newer commits are expected as work progresses. Investigate unexpected differences; do not force those historical values back into place.

If the local continuation branch exists and its worktree is clean, switch normally:

```powershell
git switch codex/google-cloud-acceptance
```

If the branch does not exist locally, the worktree is clean, and the fetched remote branch has been verified, create its local tracking branch:

```powershell
git switch --track origin/codex/google-cloud-acceptance
```

Run only the applicable command. The earlier generic “new codex branch” paragraph is superseded by the owner's explicit same-branch continuation and the latest root entries. Do not switch back to a stale main-only starting point and lose PR #67's work.

Use the installed GitHub plugin or authenticated GitHub CLI to inspect the PR. Where `gh` is already configured, these are read-only checks:

```powershell
gh pr view 67 --repo rivyalivingart2/RivyaLivingArt2.0
gh pr checks 67 --repo rivyalivingart2/RivyaLivingArt2.0
```

Record actual PR state, head/base, checks and reviews. A previous successful Vercel check is dated evidence, and an unavailable protection API does not prove absence of protections.

If offline, retain local work and record **remote status not refreshed**. Do not claim main/PR/deployment status is current until a real online read succeeds.

## 4. A new local copy or source package

Prefer the existing workspace because it may contain necessary private state. Use a new directory only when no existing checkout exists or an isolated copy is needed.

An online clone of the already verified branch is:

```powershell
git clone --branch codex/google-cloud-acceptance https://github.com/rivyalivingart2/RivyaLivingArt2.0.git RivyaLivingArt2.0-local
Set-Location RivyaLivingArt2.0-local
git status --short --branch
git rev-parse HEAD
```

Do not clone over an existing folder. Compare the resulting SHA to the actual current PR head, not only the historical baseline.

If a handoff includes a Git bundle, use the **actual supplied filename** in a new directory. Inspect its branches with `git bundle list-heads <bundle-path>`, then clone its continuation branch. After cloning, run `git bundle verify <absolute-bundle-path>` from inside the new repository. A verified complete bundle can provide local history without downloading it; it does not supply ignored files or npm packages.

If the handoff is a source ZIP, extract into a new folder and retain its manifest/checksum. It contains code at its stated revision and any explicitly included handoff changes. It does not preserve Git history by itself. Obtain or use a proper Git checkout before pushing or opening phase PRs; do not initialize an unrelated history and force it onto the project.

A package's file count, checksum or successful extraction proves package integrity only. It does not establish local tests, real Google access, a migration or a deployment.

## 5. Prepare the existing toolchain once while connected

Read `package.json` and the lockfile. This repository declares **Node `>=22.16.0 <23`** and **npm `10.9.2`**. The earlier portable environment and this continuation use Node **22.23.4**. Node 24 is outside the declared range.

Check the selected tools without printing the environment:

```powershell
node --version
npm --version
```

Use the owner's already-installed compatible Node runtime or install the declared version through the normal trusted local setup. Do not repurpose system home variables. The historical Windows runtime path `../tooling/node22/node.exe` and cloud bootstrap `/workspace/rivya-cloud/env.sh` are environment-specific; use them only if those exact files exist and have been inspected. A Linux `source` command is not a PowerShell setup command.

In a clean checkout or isolated verification worktree, install the lockfile dependencies:

```powershell
npm ci --no-audit --no-fund
```

`npm ci` replaces `node_modules`; preserve any nonstandard local dependency work before running it in an existing development folder. It does not create a business database. Do not run seed scripts, request-table repair or migration scripts as an installation step. Never delete or regenerate `package-lock.json` merely to make installation succeed.

Prepare any browser binaries needed by the selected browser tests while online using the project's existing approved tooling. Do not download another runtime or broaden network access silently. Keep installed dependencies/cache on the same machine if later offline work is required. A source ZIP alone is not a self-contained dependency installation, and packages compiled for another OS are not a Windows dependency bundle.

## 6. Run the committed local checks

The recorded full source gate is:

```powershell
npm run check
```

It runs the repository's existing sequence: lint, typecheck, application tests, preflight tests, production build and built HTTP runtime tests. Run it in an isolated verification worktree when local production/provider settings or unrelated running services could affect results. Inspect the current scripts before execution if they have changed.

For focused work, the declared commands are:

```powershell
npm test
npm run test:preflight
npm run lint
npm run typecheck
npm run build
npm run test:runtime
```

`test:runtime` requires the completed build. Its current runner starts its own loopback process with database/Blob/admin credentials cleared for its safe boundary tests. That isolation does not establish populated Studio workflows. Do not manually remove or overwrite the owner's real settings to reproduce it.

Use the exact revision, command, exit code and output summary in the new receipt. PR #67's historical receipt records 641 application tests, 12 preflight tests, 409 built HTTP tests, successful type/build and zero lint errors with 62 existing warnings. Do not call those counts freshly verified until the current run actually completes.

Local Google tests exercise codecs, the writer, signed gateway, Drive documents, publication and jobs without cloud secrets. A passing test is not proof of deployment, permissions, migrated rows or installed catalogue automation.

Do not run every historic audit or mutation script. The `rehearse.mjs` / `rehearse-documents.mjs` tools require the original guarded Windows QA cluster and private configuration. Do not alter their guard, accept an arbitrary production connection string or build a replacement seed database to run them.

## 7. Local preview and evidence

Use the existing verified local preview if it is running. Inspect the process/port owner before starting or stopping anything. The package declares `npm run dev` and, after a build, `npm run start`; use the project's existing loopback launch wrapper or explicitly bind the Next server to loopback on an unused port in the chosen environment.

Do not expose the server or PostgreSQL to a public interface. Preserve the old reference site and any owner-managed local services. Record only processes started by this task so they can be stopped at the end.

A fresh checkout without a provider may show guarded holding or login states. Do not create products, accounts or archived imports to populate a screenshot. Use only authorized existing records or isolated **non-product** test data in the appropriate guarded environment. Record blocked populated states honestly.

For visual changes, compare the approved public website/login and old authenticated Studio at 1920, 1440, 1200, 992, 768, 512 and 320 pixels. Save screenshots/traces locally in a Git-ignored evidence directory. Check unique templates and important empty/loading/error/long-content states. Do not push screenshots to GitHub.

## 8. Resume the existing Google sandbox safely

### Current observation versus historical runtime state

Fresh connected Drive/Sheets reads on 26 October 2026 succeeded for the intended owner account. They confirmed the private root, eight child folders, four owner-only workbooks, twenty tabs with the expected names and 100×12 dimensions, and three private JSON artifacts. These were **read-only** observations. The connector's available spreadsheet metadata did not expose protected-range details, and it did not provide Apps Script deployment/source inspection.

The previous runtime's HTTP 401 on 25 October applies to its short-lived management token. It is not a current failure of the working connector. Conversely, successful connector reads do not configure the Node/Vercel runtime's OAuth binding, restore a missing private HMAC key, or prove the deployed writer's current immutable source.

### Required private inputs

Inspect file existence and access without printing contents. The retained sandbox's private evidence directory is `test-results/google-workspace-cloud/`.

| Input | Purpose | If absent |
| --- | --- | --- |
| `registry.json` | Observed resource/tab/deployment identities and approved boundaries | Locate the owner-retained registry through an approved private path. Do not replace it with a scaffold or guessed IDs. |
| Installation and workbook snapshots, final audit receipt/raw baseline | Expected installed source, permissions, structure and retained populated state | Obtain the existing private evidence or independently reconstruct a read-only inventory with clear limits. Never pretend it proves a missing prior state. |
| Saved writer/Drive/job/publication/formula journals | Original mutation/output identities and recovery state | Preserve/locate the original records before replay; never issue substitute mutations to guess a prior outcome. |
| Secure runtime Google OAuth binding | Authenticated management reads/writes in the application tool process | Refresh/configure privately for the intended account and permitted hosts. A plugin token is not a portable credential. |
| Existing signing-key file and `runtime-secrets.json` path metadata | Real HMAC request/response signing against the installed key | Use the owner-retained private key via the approved secure route. Do not ask for it in chat, search a vault or generate a replacement silently. |
| Existing private verify-only runner files | Reproduce the exact historical signed replay/current-state checks | Use only if present and reviewed. A fresh clone intentionally excludes these runners and private inputs. |

PowerShell can check existence safely:

```powershell
Test-Path 'test-results/google-workspace-cloud/registry.json'
Test-Path 'test-results/google-workspace-cloud/runtime-secrets.json'
Test-Path 'test-results/google-workspace-cloud/final-sandbox-audit-receipt.json'
Test-Path 'test-results/google-workspace-cloud/final-sandbox-audit-raw.json'
Test-Path Env:RIVYA_GOOGLE_ACCESS_TOKEN
```

These commands do not validate the file contents or credential; they only detect missing dependencies. Do not print the token, full environment, Script Properties, private key or raw records. Resource IDs and endpoint URLs remain private even though they are not themselves passwords.

The installed key's hexadecimal characters are consumed as UTF-8 HMAC bytes in the retained implementation; do not decode them as hexadecimal bytes or replace them with an opaque OAuth proxy placeholder. The sandbox's temporary key-file arrangement is not production secret management.

### Do not run initial setup on the populated sandbox

The original `verify-isolated.ts` checks **empty** initial canonical grids and a ready control marker. The sandbox now retains a revision-3 Content probe, two Operations jobs, a non-secret Security pointer and an empty restored System workbook. Initial-ready expectations cannot certify this state.

Do not run scaffold creation into an existing registry, initialize headers/control again, clear the workbooks, repeat the formula-injection probe, recreate folders, deploy another writer or install triggers. No scheduler was part of the accepted foundation. Never clear an inflight marker merely because a test reports it; retain original IDs and reconcile the original operation.

The retained private runners documented in `SANDBOX-CHECKPOINT.md` have safe verification modes:

```text
final-sandbox-audit.mjs audit
writer-response-loss.mjs verify
jobs-publication-acceptance.mjs verify
formula-acceptance.mjs verify
```

These are historical private script names under `test-results/google-workspace-cloud/`, **not commands available in every clone**. Execute their documented Node commands only when the exact files, compatible runtime, registry, credentials and journals are present and reviewed. Preserve inherited proxy/CA settings where applicable. Do not convert a missing runner into an invented successful receipt.

### Portable read-only audit for an existing populated sandbox

This continuation supplies `tools/google-workspace/audit-existing.ts`. Its safe help command is available from the committed checkout once dependencies are installed:

```powershell
node --import tsx tools/google-workspace/audit-existing.ts --help
```

For the actual audit, securely configure `RIVYA_GOOGLE_ACCESS_TOKEN` in the execution environment and use the **existing** private registry plus a reviewed baseline. Command syntax, with the two placeholders replaced by real owner-controlled paths, is:

```text
node --use-env-proxy --import tsx tools/google-workspace/audit-existing.ts --registry <existing-private-registry.json> --baseline <reviewed-private-baseline.json>
```

Alternatively, the tool reads the nonsecret path variables `RIVYA_GOOGLE_REGISTRY_PATH` and `RIVYA_GOOGLE_AUDIT_BASELINE_PATH`. Use Node 22.23.4 for the documented proxy flag, preserve the approved proxy/CA configuration and keep the token out of command arguments, files committed to Git and logs. The tool prints a sanitized JSON receipt to stdout; save it to a **new** ignored evidence filename rather than overwriting an earlier receipt. Review the current source/help for exact argument handling before execution.

The baseline must describe the retained populated state, using `schemaVersion: 1`, kind `rivya-existing-sandbox-baseline`, and the `content`, `operations`, `security` and `system` workbook entries. Each entry records reviewed `records`, `ledger`, `audit`, `history` counts and `controlState`; an optional `canonicalSha256` can assert exact retained canonical state. Derive these values from the retained private checkpoint, not from whichever current cells would make the audit pass. The baseline is not a business-data export.

The optional digest is SHA-256 of UTF-8 `canonicalArtifactJson({tabs:{records,ledger,audit,history},writerControl})`, using normalized full string rows including headers and the parsed canonical control marker. Full historical canonical-byte equality is established only where the required reviewed hashes were supplied and matched; matching counts alone does not prove byte equality.

The audit verifies registered ownership/permissions, workbook dimensions/protections, canonical record/ledger/audit/history/control integrity, baseline counts/optional hashes, and immutable deployed source/version/manifest/policy. It performs no writes, resets, repair, provisioning or HMAC signing. It therefore needs no signing key. It fails closed when registry, baseline or OAuth input is absent.

Its scope does **not** include unregistered folder-child enumeration, Drive artifact byte verification, signed gateway execution, the remaining real-provider fault/permission/lease/quota scenarios, migration, cutover or release. Reuse the retained broader private final-audit runners when they are available and appropriate. A portable audit source file is not a successfully rerun Google audit; the current handoff receipt states whether actual runtime inputs were available.

### Acceptance still required

Carry all eight groups from `sandbox-verification.json`: ordinary-editor denial; concurrent owner/API edits; actual mid-script interruption/inflight quarantine; independently expired leases; quota/rate-limit capacity; public assets and production-scale bundles; production secret management/source export/reconciliation; application integration and authorized cutover/release.

Run only specifically scoped safe tests supported by current authorization and inputs. Additional sharing, disruptive quota testing or quarantine repair needs an exact target/effects/recovery plan before execution. Mark a blocked case as blocked. Do not equate anonymous access denial with an ordinary-editor test, a withheld acknowledgement with a killed script, or a private empty-asset bundle with public publication.

## 9. Preserve same-branch phase delivery

One integration owner should stage reviewed source/docs/tests with explicit paths. Never use blanket `git add .` in a workspace containing private evidence. Before committing or pushing:

```powershell
git status --short --branch
git diff --check
git diff --stat
git diff --cached --stat
git diff --cached --name-only
```

Review the staged content for secrets, resource IDs, customer records, screenshots, source exports, originals and private keys. Do not include ignored evidence by force. Commit actual verified phase scope with an accurate message and preserve unrelated work.

When the phase source is ready and the existing PR scope is appropriate, ordinary publication to the existing branch is:

```powershell
git push origin HEAD:codex/google-cloud-acceptance
```

Do not add `--force` or push to main. Source publication can trigger a branch preview; record actual resulting checks/deployment scope. Update the phase PR body with a complete report, using a file/structured argument for multiline text.

There is one open branch-to-main PR for a given head/base pair. PR #67 must retain its coherent Phase 2 scope. After that PR is **actually merged with all applicable authorization/checks**, retain the continuation branch and integrate main from a clean worktree:

```powershell
git fetch origin
git switch codex/google-cloud-acceptance
git merge --no-edit origin/main
```

These integration commands apply only after checking the actual merged state and preserving local changes. Resolve conflicts carefully; do not rewrite already-published commits or recreate the branch at a stale baseline. Develop the next phase on this same branch, verify its work, and open its next PR into main. Keep the branch after each merge.

If a phase merge is blocked, preserve independent future-phase source locally with clearly separated commits/ownership. Do not upload unrelated phases into the current PR just to get them online or declare phases complete without their external acceptance.

### Main merge and Vercel release are separate from preparation

`vercel.json` enables Git deployment. A main merge may deploy to Production. Before merging, inspect the actual project linkage, production branch, target revision, required checks/reviews and deployment effects. Prepare the exact release and recovery result; obtain any still-missing later-production-release authorization. The owner's source-PR instruction does not override their explicit later-release boundary.

Do not change deployment settings to bypass that boundary. Do not enable automatic merge while release authorization is unresolved. Production migration/cutover, CMS publication, destructive changes, paid services and external messages each retain their concrete authorization boundaries.

## 10. Phase report and end-of-session checklist

Update existing root/phase ledgers with current scope and evidence. Use this report shape:

```text
Phase/task IDs:
Branch and exact source revision:
Base/main and PR status (observed date):
Work reused:
Work implemented or repaired:
Files/services affected:
Local checks and result:
Real Google checks and exact coverage:
Private evidence location (no contents/secrets):
Design/login/data/media preservation:
Business records migrated:
CMS/public content published:
Provider cut over:
Preview/production release status:
Remaining dependency and exact next action:
Recovery and task-owned cleanup:
```

State **implemented**, **verified locally**, **verified on real Google**, **preview verified**, **migrated**, **published**, **cut over** and **released** independently. Source merged to main is not proof of installed Apps Script, runtime activation, Google migration or full feature acceptance.

Before ending, preserve work and private journals, stop only this task's processes/agents, leave unrelated services intact, and record the exact next command or evidence dependency. A next session must be able to resume without the old ChatGPT share link or unstated chat history.

## References

- [Complete continuation prompt](CONTINUE-IN-GEMINI-ANTIGRAVITY.md).
- [Current PR checkpoint](PHASE-2-PR.md), [sandbox checkpoint](SANDBOX-CHECKPOINT.md), [receipt](sandbox-verification.json), [setup](CLOUD-GOOGLE-SETUP.md).
- [Phase plan](PHASE-PLAN.md), [service placement](SERVICE-PLACEMENT.md), [architecture](ARCHITECTURE.md), [isolated target and recovery contract](ISOLATED-TARGET-PLAN.md).
- Repository `package.json`, `tools/frontend-runtime.test.mjs` and `tools/google-workspace/` for the actual runnable source.
