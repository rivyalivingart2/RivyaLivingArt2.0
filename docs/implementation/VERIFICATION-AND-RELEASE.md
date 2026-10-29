# Verification, publication and production release

Use supported Node 22 and the locked dependencies. Tests below are local checks
unless they explicitly execute real providers. Inspect script definitions before
running; commands can evolve after this guide's 29 October 2026 preparation.

## Local verification

| Command | What it establishes | What it does not establish |
|---|---|---|
| `npm run lint` | Static lint findings for the candidate | Provider behavior or UI correctness |
| `npm run typecheck` | Route type generation and TypeScript compatibility | Runtime initialization |
| `npm test` | Unit/contract/security/local-emulator behavior | Real Google concurrency, migration or browser acceptance |
| `npm run test:preflight` | Repository guard/tool tests | A remote release or branch permission |
| `npm run build` | Production bundle builds in this environment | Deployment or data migration |
| `npm run test:runtime` | Built Next HTTP behavior with script-defined fixtures | Hydrated browser workflows or real-provider persistence |
| `npm run check` | The scripted lint/type/unit/preflight/build/runtime sequence | All provider/human/device acceptance |
| `npm run test:e2e` | The configured Playwright browser cases | Unconfigured real provider or physical-device tests |
| `git diff --check` | Whitespace/patch hygiene | Secret scanning or security correctness |

Run focused relevant tests during implementation, then required broader checks
once per coherent candidate. Do not count repeated runs as distinct test coverage.
Inspect e2e configuration/base URL and fixture flags before running; never point
mutation tests at production. Install required browser binaries in an isolated
environment if necessary. Required comparison widths are **1920, 1440, 1200,
992, 768, 512 and 320**; older seven-width lists differ and are historical.

Windows sandbox permissions can block symlink/ACL/cleanup or build child processes.
Record the actual failure; do not weaken private-file protections or skip tests
to claim green. Reproduce in a legitimate environment or an isolated Linux Git
checkout. A source tarball without Git metadata cannot exercise Git-ignore/index
privacy tests. Do not copy real private evidence/secrets into test containers.

The current Playwright suite additionally requires `RIVYA_E2E_ISOLATED_QA=1`,
the existing ignored `test-results/old-design-migration/.env.qa`, and a valid
`RIVYA_MIGRATION_PG_MODULE` path. Read [the guarded QA instructions](../../tools/master-audit/E2E-README.md)
first. It owns a local server on port 4173 and must not reuse the owner's preview
or a production database. Missing QA configuration is a setup dependency, not a
passing browser test or permission to seed live products.

## Provider and browser verification

Follow [the five Google tests](../netlify-free-first-2026-10-28/phase1/PROVIDER-ACCEPTANCE.md).
Each real receipt includes candidate/installed source identity, environment,
identity role, UTC interval, bounded requests, before/after state, provider result,
recovery and private evidence location. Public receipts contain sanitized aggregates.

Verify actual persisted state after a new process, separate worker and browser
reload. Include owner/API races, shared throttling, one-time redemption, revocation,
lease fencing, interruption/quarantine, unknown outcomes, actual quota/credential
failure, media visibility, cache publication and real output downloads. Injected
errors and emulator clocks remain labelled simulations. No quota flooding.

Native-reader, physical-device, real-user/field performance and legitimate business
evidence are separate gates. A browser automation result cannot certify them.

## Before publishing source to GitHub

The repository is public. “Push all latest data” in this task means accumulated
source and documentation; protected customer records, exports and secrets remain
private under the owner's explicit master brief.

1. Confirm current owner publication permission. On 29 October 2026 the owner
   explicitly authorized the latest accumulated code and guides into main. This
   does not grant future pushes or provider migration/retirement authority.
2. Fetch main, inspect worktrees/open PRs/protections and deployment triggers.
   Preserve migration commits and unrelated work. Review the entire outgoing
   range and all its intermediate commits, not just the final working-tree diff.
3. Exclude `.env*` except sanitized examples, private registries/IDs/endpoints,
   exports, tokens, authenticated screenshots, synced sources and test-results.
   Inspect filename patterns and likely secret material. A known-value scan is
   additional bounded evidence, not a general guarantee. Do not log matches.
4. Verify protected file hashes, appropriate tests and documentation links. Confirm
   the historical AGENTS archive matches its prior committed bytes. Review new
   instructions for stale permission/completion statements.
5. Commit a coherent source/guide package, push the approved work branch, create
   a focused PR to main and attach its URL to the working task. Describe the full
   cumulative behavior, verification, gaps and production implications.
6. Inspect required checks/reviews and exact head. Fix actionable failures; do not
   bypass protection. Merge using an expected-head check and a history-preserving
   method. Do not force-push main or delete preserved migration branches.
7. Fetch/read back main and prove it includes the candidate and guides. Record the
   real PR/merge SHA. Inspect automatic deployment effects separately; source
   publication alone does not prove production release.

## Production migration and release are separate

The [Phase 10 steps](PHASE-BY-PHASE.md#phase-10--authorized-netlify-cutoverrelease-nff-10001003)
and [release preparation](../netlify-free-first-2026-10-28/RELEASE-PREPARATION.md)
require actual acceptance, protected restore, final delta and applicable explicit
authority. Do not switch Netlify branch/lock, change DNS/secrets, activate providers,
publish CMS records, enable intake/retries or remove resources as a side effect
of pushing code. Keep the Codex cloud environment unpublished.

Verify the exact Netlify deployed SHA, ready state, host/redirects/cookies, storage
authority, public publication and post-cutover writes. A rollback must reconcile
new target writes; old SQL pointers can be stale. Keep old resources and backups
until the exact destructive retirement action is authorized.

## Receipt template

```text
Task / phase / objective:
UTC and source SHA (or parent + reviewed diff):
Environment and active authoritative stores:
Affected files and data/media/auth impact:
Commands or actual provider/browser steps:
Results: passed / failed / skipped / not run:
Real provider request/write counts and measured scope:
Private evidence location (never secret contents):
Implemented:
Locally verified:
Real-provider verified:
Preview verified:
Migrated:
Cut over:
Production released:
Resources retired:
Backups retained / restore scope:
Remaining limitation and precise next action:
```
