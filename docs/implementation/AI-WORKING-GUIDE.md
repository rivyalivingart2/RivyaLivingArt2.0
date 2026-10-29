# Working on this project with any AI

Prepared 29 October 2026. This is a procedure, not a completion report. Read the
complete [owner brief](../netlify-free-first-2026-10-28/OWNER-BRIEF.md) and
[scope](../netlify-free-first-2026-10-28/OWNER-SCOPE.md). New direct owner instructions
take precedence. Historical instructions are not live permission or acceptance.

## Obtain latest code safely

If no checkout exists:

```sh
git clone https://github.com/rivyalivingart2/RivyaLivingArt2.0.git
cd RivyaLivingArt2.0
git fetch origin
git switch -c codex/pending-foundations origin/main
```

Choose an unused codex/ name. In an existing checkout, inventory before switching:

```sh
git rev-parse --show-toplevel
git remote -v
git status --short --branch
git worktree list
git branch -vv
git log -8 --oneline
git fetch origin
git log --left-right --oneline HEAD...origin/main
```

Do not pull over dirty work, automatically stash, reset --hard, force-push or
delete branches/worktrees. Reuse a suitable continuation branch. If unrelated work
makes that unsafe, create a separate worktree from freshly fetched origin/main.
Local changes absent from main may be newer: compare and preserve them first.
Never assume the historical migration branch is the latest source.

Read START-HERE.md, AGENTS.md, these shared guides, CURRENT-STATE.md and the latest
relevant checkpoint. PROJECT_STATE.md, PRODUCT.md and README contain history below
their current notices. Do not repeat withdrawn all-phases-complete claims.

## Establish the baseline

Record HEAD, origin/main SHA, branch, dirty paths and UTC time. Inspect open PRs
and deployment triggers before an authorized push. PR #71 and `d583edb`/`7b390d5`
are preservation pointers, not the current state. The implementation checkpoint
before these guides is `98a8369`.

Inspect Netlify's published SHA, branch and lock through normal read-only access.
The 29 October publication preparation found production ready and locked at
`7b390d5`, tracking `codex/netlify-hosting-migration`. Recheck. Keep GoDaddy DNS,
email, www and TLS intact. GitHub publication is not production cutover.

Inspect installed Google writer version, resource registration, credential
lifecycle, capacity and ownership through supported account access. Never print
secrets, recover browser tokens or infer IDs from display names. A fresh clone
deliberately lacks private registries/evidence. Do not recreate installations.
Continue independent local work when provider access is unavailable; identify the
exact dependency and affected acceptance test.

## Prepare the runtime

Use package.json's supported Node range (currently >=22.16.0 and <23), Netlify's
22.23.2 pin and packageManager npm 10.9.2. Check versions before scripts. Use
`npm ci` on a fresh checkout. Do not upgrade dependencies merely to match the AI
machine's default runtime.

Create the ignored output directory on a fresh checkout before running recovery
tests: `node -e "require('node:fs').mkdirSync('test-results',{recursive:true})"`.
The private recovery helpers deliberately require an existing safe parent; they
must not relax that check because a test environment omitted setup.

Read `.env.example`; keep necessary local configuration untracked. Never attach
production credentials to fixture browser servers or isolated previews. Keep
indexing, order intake and message retry disabled unless separately authorized.
Inspect CLI help/source before migration, installer or recovery tools: a dry-run,
source read and provider write are different operations.

For Next.js edits read relevant installed docs in node_modules/next/dist/docs.
Use existing architecture; do not generate a replacement app. Public/login design
and existing data/media are protected.

## Implement a bounded slice

1. Identify phase/task ID, real defect, affected files, current authority and data/auth/media impact. Inspect routes/callers, not only an adapter's public API.
2. Define behavior and acceptance, including cold starts, failures and concurrency where relevant. Search `studioDb`, provider switches, temporary stores and background jobs.
3. Reuse completed bounded stores, document transport, guarded sessions and atomic Security workflows. Do not widen safety limits or discard history to fit tests.
4. Implement the smallest coherent slice, run focused tests and appropriate broader checks, then inspect the full diff.
5. Update continuation/phase status with exact evidence and next action. Commit locally when useful. Future pushes/PR changes/merges need current owner permission; the 29 October publication is a bounded authorization.

Continue safe work without repeated phase-start questions. A pending provider
check does not prohibit implementing its local prerequisites, and it cannot be
marked passed merely to begin another phase. Do not create other AI chats or
delegate private access without appropriate scope.

## Invariants

- One authoritative store per record type. SQL/Blob remain active until verified
  cutover. No silent fallback or uncontrolled dual writes.
- Sheets edits use staging, validation, expected revisions, controlled commit and
  separate publication. Apps Script locks do not stop direct owner/API edits.
  Workbooks separate confidentiality; hidden tabs are insufficient.
- Keep credentials, session/recovery material and private files server-side.
  Verify actual expiry, roles, credential version and current owner epoch.
  Lookup changes, one-time redemption and audit commit atomically. A replay receipt
  cannot authenticate. Unknown outcomes require canonical reconciliation.
- Persist job leases, fencing, checkpoints, retry, cancellation and verified
  outputs. Maps and local temporary files are simulations only.
- Add no products or archived imports. Preserve original files, identities,
  prices, variants and histories. No invented reviews or customer/project claims.
- A database exception needs measured necessity, narrow ownership, current free
  eligibility/limits, export/restore and exhaustion behavior. No paid trial,
  recharge or billing upgrade.
- Retain SQL, Blob, Vercel, Google resources, recovery evidence and OLDWEBSITE
  until replacement/reconciliation/recovery and exact retirement authorization.
  Keep the Codex cloud environment unpublished.

## Evidence and handoff

Each receipt records UTC, candidate SHA (or parent plus diff), environment,
commands/results, measured sample, provider request/write count, limitations and
next action. Public receipts contain aggregates. Keep private exports, IDs,
credentials, authenticated URLs/screenshots and signing material in ignored
owner-controlled storage; never paste them into another AI.

Report separately: implementation; local verification; real-provider verification;
preview; migration; cutover; production release; retirement; backups. Failed,
blocked, not-run and simulation are valid states. A flag, build or HTTP 200 cannot
establish another category. Update NEXT-WORK with an exact next operation/tests.
