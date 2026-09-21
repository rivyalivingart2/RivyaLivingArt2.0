# RivyaLivingArt — Git Checkpoints and Push Workflow

**Revision 8 · 21 September 2026**  
**Master:** `RivyaLivingArt_Master_Build_Prompt_v8.md`  
**Purpose:** Codex must save each completed, tested, coherent slice in the owner's Git repository. Do not wait until an entire site or phase is complete.

## 1. Authorization and exact target

The owner has requested commit-and-push after each completed slice. Once the actual writable remote and safe work branch are established, this request authorizes ordinary additive commits/pushes to that work branch; do not ask again for every routine push. It does **not** authorize production merges, force pushes, rewriting published history, deleting branches/tags, changing repository visibility, new repositories, credential rotation or Vercel production deployment.

Phase R8-0 must inspect the actual checkout, current branch/detached state, remote names and fetch/push targets, upstream configuration, pending local changes, relevant branch policy and existing CI/deployment triggers. The historical website README and Drive asset README name different repositories. They are clues, not authority to change the current remote. Confirm the actual target from the selected workspace/owner-provided repository and audited configuration. Ask only for a genuinely missing/ambiguous target or permission.

Never echo credentials embedded in a remote URL. Inspect/redact locally; record only the safe repository identity. Verify every configured push URL: Git remotes can have more than one. Do not push a remote that would send code to an unintended second destination.

Use the existing approved non-production work branch. Where none exists and repository instructions permit it, create a compatible feature branch such as `codex/rivya-frontend-first`; this is a proposal, not a known branch. Do not change branches in a dirty worktree until unrelated owner work is safely accounted for. Preserve existing PR/branch conventions and never create a new branch just because a session resumes.

Before the first push, check whether the destination is tracked as a production/custom environment by Vercel or other automation. Non-`main` is not by itself proof of safety. If the integration is unavailable, record the unknown and request the specific branch/deployment confirmation before a potentially publishing push. Preview auto-builds may proceed only under the already configured/authorized protected preview setup. Do not configure new workflows that publish production.

## 2. Definition of a completed slice

A slice is a coherent, reviewable change: for example header/mobile navigation; collectible cards/detail gallery; Studio product-table visual states; real session revocation; or database-backed demo deletion. One button colour change does not require an artificial phase, and an entire application must not be held in one giant commit.

Required sequence:

1. Inspect current status and pending changes; define owned file/hunk scope and acceptance checks.
2. Implement the slice with compatible interfaces and no unrelated refactors.
3. Run the actual relevant lint/type/unit/component/browser checks. Run build when route, dependency, rendering or configuration changes warrant it; always at V1/V2 gates. Record commands, exits and genuine results. Do not invent an absent script, skip hooks or turn warnings/errors off to manufacture a pass.
4. Review the exact diff, accidental files, source licenses and secret/customer-data exposure. Separate pre-existing failures from new failures. A required failing check means the slice is not complete; fix it or document the blocker.
5. Update the active phase record, component/status map, applicable guides and a new checkpoint. Preserve old dated entries. The checkpoint inside the commit should say “push verification pending”; do not claim a future push already succeeded.
6. Stage only the reviewed owned paths/hunks. Do not use `git add .` or `git add -A` across unknown work. Inspect the staged diff again. Never include `.env*` secrets, `.vercel` local links/tokens, build directories, node_modules, database exports, customer data, original media libraries or large generated outputs. A sanitized `.env.example` is allowed when reviewed.
7. Create an ordinary new commit using the repository's convention. Suggested format only: `feat(rivya): R8-2B collectible product gallery`. Never amend a pushed commit to hide a follow-up fix.
8. Push the explicit approved work-branch ref through the available authorized Git/PR publishing path.
9. Verify the remote branch contains the exact local commit. Report commit SHA, branch, remote push result and any observed CI/preview result separately. Do not construct a fake PR/preview URL.

A log that says “ready to push” is not proof of push. A local commit is not a remote backup. Complete-with-remote-verification is the expected slice outcome.

## 3. Safe command pattern — adapt only after audit

These are command patterns, not commands already run for this project. Preserve the repository package manager and actual tests. Placeholder paths/remotes/branches must be resolved before execution.

```bash
# Inspect without discarding owner work.
git status --short --branch
git branch --show-current
git diff --stat
git diff --check

# Run the actual required project checks here; record real exit statuses.
# Stage explicitly selected reviewed files/hunks, not the whole unknown worktree.
git add -- <reviewed-file-1> <reviewed-file-2> <checkpoint-file>
git diff --cached --check
git diff --cached --stat
# Inspect staged content privately for accidental secrets before committing.
git commit -m "feat(rivya): R8-2B complete collectible gallery"

# Use the one verified remote and approved non-production branch.
git push <verified-remote> HEAD:refs/heads/<approved-work-branch>
git rev-parse HEAD
git ls-remote <verified-remote> refs/heads/<approved-work-branch>
git status --short --branch
```

Use the exact destination push repository for verification when fetch and push targets differ. Inspect all commits being introduced by a new remote branch, not just the last diff: unexpected unpublished history may contain unrelated changes. Do not push `--all`, `--mirror`, `--tags`, `--force`, `--force-with-lease`, deletion refspecs or a production branch as part of this routine.

If a teammate advances the branch during verification, do not overwrite them. Fetch safely, check ancestry and report whether the local commit is contained in the remote history. If histories diverge, follow the repository's reviewed merge process or stop for a conflict resolution instruction. No destructive reset/rebase or automatic merge of unknown work.

## 4. Codex cloud, CLI and restricted environments

Inspect actual capabilities rather than assuming direct shell push is available. In a local CLI/IDE environment, use the existing authenticated Git setup with the granted network permissions. In a cloud surface that requires its built-in publish/create-PR action, use that supported path when available and report the resulting real branch/PR after verification. A request for pushing does not defeat sandbox or account permissions.

If no authorized push mechanism exists, preserve the checked changes/commit or supported patch artifact, label the result **COMMITTED — PUSH BLOCKED** (or **PATCH READY — PUBLISH BLOCKED** when commits are not supported), and tell the owner the exact missing action. Do not silently claim a PR was created or that GitHub contains the code. Ask for only the permission or publish step needed; never request production secrets to fix Git access.

A pre-existing CI/test blocker may be saved as an explicitly labelled WIP branch checkpoint only under the repository's existing policy. It is not a completed slice, never a V1/V2 release candidate, and cannot be merged/promoted automatically. The default is to fix a new failing check before committing/pushing a completed slice.

## 5. Checkpoint and status format

Maintain the repository's existing `PROJECT_STATE.md`, `CHANGELOG.md` and indexed phase docs. Add this minimum status per slice:

```markdown
## R8 checkpoint — YYYY-MM-DD HH:mm Asia/Kolkata
Phase/slice and stage:
Last verified pushed commit before this slice:
Actual safe remote identity / work branch:
Goal and exact owned paths:
UI status: not started / in progress / visual verified
Backend status: planned / in progress / integrated / tested
Tests: actual commands, exits, evidence paths
Fixture versus persisted record counts:
Asset source/output IDs and unresolved prompts:
Schema/env impact (names only):
Owner work preserved:
Commit/push: pending verification for this checkpoint commit
Vercel: not requested / ready for preview / observed build / observed deployment / blocked
Gate V1/V2 status and blockers:
Next exact instruction:
```

After commit/push, the **session report** supplies its actual SHA and remote evidence. On the next slice, record that prior verified SHA in the new checkpoint. This avoids endless commits merely to insert a commit's own hash or falsely predict its push. Preserve actual logs via the approved evidence mechanism. If there are unrelated uncommitted files, list them as preserved; do not falsely say the entire worktree is clean.

Suggested session report:

```text
Completed: R8-2B / visual-preview
What changed: ...
Tests and screenshots: ...
Commit: <actual SHA or NOT CREATED>
Push: VERIFIED <safe remote + branch> / BLOCKED <exact reason>
CI/preview: <observed status only; not checked is valid>
Backend: NOT YET CONNECTED
Owner action: none / V1 deploy-review / specific access blocker
Next: <one exact slice instruction>
```

## 6. Push versus deployment

Vercel's Git integration can create deployments when code is pushed, and its configured production branch can publish to production. That is why the push target and integration must be audited before routine updates. A verified push is reported independently of build/deployment results. Do not run `vercel --prod`, promote a deployment, merge the production branch or change the production branch/domain until the owner specifically authorizes that action.

At V1, ask the owner to deploy the ready frontend **as a protected Preview**. At V2, ask the owner to deploy the verified full build. If an already authorized Git integration has automatically produced a preview, report the observed URL/status instead of pretending the owner must create a duplicate; still request visual review and do not promote production.

## 7. Source basis for workflow rules

The commit cadence and ownership gates are the owner's requested workflow. The command/hosting distinctions were checked against official documentation on 21 September 2026; they are not evidence that this repository has been inspected or pushed:

- [Git push — explicit refspecs and destinations](https://git-scm.com/docs/git-push)
- [Git remote — fetch/push URL behavior](https://git-scm.com/docs/git-remote)
- [Git ls-remote — remote references and commit IDs](https://git-scm.com/docs/git-ls-remote)
- [Vercel Git deployment behavior](https://vercel.com/docs/git)
- [Codex cloud environment and available workflow](https://developers.openai.com/codex/cloud/environments)
