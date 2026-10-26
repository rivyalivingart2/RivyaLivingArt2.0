# Private Google sandbox checkpoint

Continued from local `f07d38d` on `codex/google-cloud-acceptance`, based on PR #66 main `019f4c1bac2c03dfeab00a1ed1fb46dc20c29d30`. The owner authorized the private sandbox, its HMAC-authenticated Internet endpoint, owner Sheets consent and temporary private signing-key storage/transfer. The desktop browser created exactly one deployment. **Keep the Codex environment unpublished; no push, merge, website deployment, CMS publication or production cutover is authorized.**

## Actual installation and acceptance

| Component | Verified on real Google | Evidence boundary |
|---|---|---|
| Account and installation | Live account matches the intended owner. The initial management verifier passed all **36** checks, including ownership, sharing, exact grids/protections, immutable deployed source and execution/access settings. | Runtime metadata alone reported unknown readiness; actual API calls establish access for the operations performed. Token expiry remains separate. |
| Drive tree and workbooks | One private root, eight planned child folders and four owner-only workbooks. All twenty canonical tabs have 100×12 grids and whole-tab protection. | Only four synthetic non-product records remain: one Content probe, two Operations jobs and one non-secret Security pointer. System returns to its exact empty baseline. No business source records were imported. |
| Apps Script | One owner-private standalone writer project; exact version-controlled `Writer.gs` plus approved web-app manifest deployed as immutable **version 1**. API confirms `USER_DEPLOYING` / `ANYONE_ANONYMOUS`; signed requests successfully read and mutate owner-only workbooks. | Endpoint is Internet-reachable under explicit approval; files remain private. No triggers/schedulers, duplicate deployments, source bootstrap or broader scopes. No owner-browser consent remains for these completed checks. |
| Controlled writer | Signed write/reload, direct Sheets comparison, original-receipt replay, changed-intent rejection and synchronized same-revision race passed. Exactly one racing client committed. Final Content revision 3 has three ledger/audit/history entries. | One additional real successful signed acknowledgement was deliberately withheld from the coordinator; original-ID replay recovered it and a fresh process replayed with zero commits. This is a client fault, not a killed Apps Script or unfinished remote batch. |
| Drive documents | Three private immutable JSON artifacts: reserved-ID adapter probe, durable-job output and non-rendered publication bundle. Exact bytes, parent, MIME, size/hash and replay were checked. The adapter probe passed 18 checks and another 18 in a fresh process with zero new creates/reservations. | The deliberately discarded create acknowledgement is a client fault. Forged application registrations reject before HTTP; this does not establish another authenticated principal's ACL behavior. |
| Durable jobs | Two non-product jobs persisted through the signed writer. A controlled interruption before output-reference checkpointing survived a fresh process; the same output ID was reused with zero Drive creates. Completion, cancellation and stale-worker rejection passed. | Interruption used an explicit retry transition, not an OS kill/provider outage. Stale revision/fence rejection is not an independently expired-lease race. |
| Private publication | A complete hashed bundle was written before its isolated pointer. Pinned reads, no-write replay and invalid-bundle retention passed. Final verification made zero commits/creates. | Empty assets and a non-rendered sandbox pointer only; no public asset acceptance or actual CMS publication. |
| Request boundaries | Wrong HMAC, expired signed requests and unregistered resources rejected. Anonymous Sheets/Drive calls returned verified Google `403 PERMISSION_DENIED`; a subsequent healthy signed read passed. | Anonymous API denial is not a second-principal editor test. Six latency samples were recorded; the healthy signed read took 2,259 ms. No load/latency SLO or quota exhaustion claim. |
| Formula rejection | Under exclusive test access, owner API set only System `records!A2` to `=1+1`; effective value 2 and authenticated signed rejection were observed. Narrow restoration returned all cells, protections and control state to the exact baseline; healthy signed read passed. | Owner bypass only. No control reset, concurrent repair, ordinary-editor denial or ambiguous-write auto-recovery was attempted. |

One cancellation preflight encountered `invalid-response` on its first gateway read, before any commit/create. A diagnostic read subsequently followed the permitted ContentService 302→GET 200 JSON flow; the original checkpoint then continued successfully. The initial failure remains in the private journal and sanitized receipt. Its cause is unconfirmed; no source change or redeployment concealed it.

The final read-only audit passed another **36 checks across 54 Google reads**, verifying all 17 registered resources, exact folder membership, all twenty unchanged protections, all three artifact hashes, final canonical counts and the same version-1 source/deployment. Final ledger/audit/history counts are Content 3, Operations 10, Security 1 and System 0.

## Local changes and checks

Actual Google responses exposed two compatibility issues. Google omits default sheet ID zero inside a protected `GridRange`; the verifier now accepts that omission only in a real range object targeting registered sheet zero. The Google HTTP transports previously constrained credentials to an OAuth-token alphabet, rejecting a valid managed-proxy placeholder. They now accept bounded nonempty printable ASCII, rejecting controls, spaces, Unicode and oversized values before HTTP. Fixed destinations, registered IDs, TLS trust, redirect and privacy guards remain intact.

**641 application tests passed; zero failed/skipped.** Type checking and scoped ESLint passed. Protected public components/routes, Studio login/authentication, current provider wiring, media, dependency declarations and lockfile remain unchanged. Only the two inactive Google HTTP transport modules changed in existing application source. Earlier full build/409 HTTP results remain the preceding checkpoint's evidence; no fresh live-website or production-data audit is claimed.

See [sandbox-verification.json](sandbox-verification.json) for machine-readable evidence. Core Google foundations are implemented and verified in this private sandbox. Full production acceptance, migration and application integration remain separate gates; phases 3–11 are not declared complete.

## Private artifacts and safe continuation

The ignored directory is `test-results/google-workspace-cloud/`. Preserve `registry.json`, `installation-state.json`, initial/after workbook snapshots, `management-before-probes.json`, deployment receipts, `drive-acceptance-state.json`, writer/job/formula checkpoints and `final-sandbox-audit-receipt.json` / `final-sandbox-audit-raw.json`. Private IDs, owner identity, exact editor/endpoint URLs and raw receipts stay there, outside Git.

`runtime-secrets.json` stores only the path/key identifier. The raw sandbox key is in `private/signing-key.hex` (0600 under a 0700 directory); it was transferred using RSA-3072 OAEP/SHA-256 ciphertext and entered in owner-only Script Properties through browser memory. No key was printed, embedded in source or placed in ordinary environment variables. Use the hexadecimal characters as UTF-8 HMAC bytes, not decoded hex. This temporary arrangement is not production secret management. Never recover a missing credential from a vault or expose it in logs.

On resume, inspect branch/worktree and these receipts first. Source `/workspace/rivya-cloud/env.sh`; preserve inherited proxy/CA configuration and use `node --use-env-proxy --import tsx`. Confirm current OAuth access without printing its value. The owner desktop can refresh an expired token privately. Missing private registry/key files are real dependencies; do not invent IDs or create replacement resources silently.

Safe read-only follow-ups, using the retained ignored runners:

```sh
node --use-env-proxy --import tsx test-results/google-workspace-cloud/final-sandbox-audit.mjs audit
node --use-env-proxy --import tsx test-results/google-workspace-cloud/writer-response-loss.mjs verify
node --use-env-proxy --import tsx test-results/google-workspace-cloud/jobs-publication-acceptance.mjs verify
node --use-env-proxy --import tsx test-results/google-workspace-cloud/formula-acceptance.mjs verify
```

The initial management verifier expects empty grids/ready control, and the original writer receipt expects revision 2. Both are historical evidence now, not instructions to reset the current revision-3 sandbox. Do not repeat provisioning, overwrite snapshots, replay completed formula injection or discard uncertain mutation IDs. Unresolved operations require their saved original-command reconciliation, not a new mutation or control reset.

The startup-instruction draft save was confirmed without a network change. A subsequent owner-browser report showed an unsaved all-public-internet toggle; both the backend draft and runtime metadata still reported restricted networking with the original six Google domains and package-manager preset. Runtime enforcement remained unknown. The UI subsequently attributed Scripts to “By Codex” and Internet access to “By you”; the human selected the original restricted policy. The desktop is restoring/verifying that policy, Only me visibility and unpublished state before saving. The cloud agent will make no conflicting configuration update.

## Remaining dependencies

- Full real-provider acceptance still carries an authenticated ordinary-editor protection test, concurrent owner/API edits, actual mid-script interruption with durable inflight quarantine, independently expired leases and actual quota/rate-limit behavior. No unsupported pass is inferred from local tests or controlled client faults.
- Public asset/privacy and production-scale bundle behavior require approved real source inputs and private/public asset registrations. The current private empty-asset bundle is deliberately limited.
- Migration rehearsal/reconciliation requires a fresh owner-controlled source export or authorized source access. Windows private evidence, originals and the old loopback database are intentionally absent; historical counts are not data to reconstruct.
- Production key management, target permissions, backup/recovery, integration and separately authorized cutover/release remain necessary. Existing application storage remains authoritative.

**Status:** implemented; verified locally; core private sandbox verified on real Google. Business records migrated: no. CMS/public content published: no. Provider cut over: no. New website release: no. Environment published: no.
