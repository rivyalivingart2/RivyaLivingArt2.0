# NFF-102 — Provider acceptance and permissions

All five checks below remain **unrun in this continuation**. This is an executable acceptance specification, not a passing receipt. The later [pending-work closure](../PENDING-CLOSURE.md) verifies the existing four-resource registration and signing key through legitimate owner-interface readback, followed by four successful signed reads. The private readback is owner-only and ignored by Git; no key was rotated or registration reconstructed from names. Renewable server credentials for direct Drive/Slides access remain unverified. Signed reads do not satisfy any of the five checks below.

## Five outstanding Google checks

| Gate | Bounded procedure on registered isolated probes | Required observation and stop condition |
|---|---|---|
| G1 ordinary editor protection | Use an existing authorized non-owner test identity. Attempt one canonical-cell edit and one allowed staging edit; re-read permissions and exact cells as owner | Canonical edit denied and staging limited to its intended scope. Owner-only metadata is insufficient. If identity or staging permission is absent, record blocked; do not broaden sharing merely to pass |
| G2 owner/API concurrency | Two independent callers use the same expected revision/mutation conditions; introduce one deliberate owner/API change in a disposable record at a defined barrier, including the guard-to-write interval | No silent lost update or unregistered mutation acceptance. Competing canonical writes must conflict/quarantine; direct-owner bypass must be documented. ScriptLock does not lock owner/API edits. An observed overwrite is a failed isolation gate, not a successful retry |
| G3 actual interrupted script | In an explicitly isolated instrumented deployment, stop execution after durable inflight marker and before final batch, then query from a different process | Record execution evidence of a real server-side interruption. A client abort is not enough. Uncertain gate must reject unrelated writes; reconcile exact ledger/control/record state before explicitly clearing. Never clear merely on elapsed time |
| G4 independently expired lease | Process A claims a disposable job; allow its actual provider-clock lease to expire; process B claims with a newer fence; A attempts one stale checkpoint/output commit | B's fence wins, stale A is denied at durable commit, cancellation and verified output are preserved. Do not fake time only in one process or count a simulated expiry as provider evidence |
| G5 real rate-limit behavior | Prefer a genuine naturally encountered quota response, or a separately authorized reduced quota in a disposable project. Make a strictly bounded probe with a predetermined ceiling and preserve provider status/retry metadata privately | Verify a real provider quota/rate-limit response and bounded retry/resume from canonical state. Stop immediately on quota warning. Do not flood the live project or alter billing/quotas to manufacture a pass. Injected 429s remain simulation |

For every receipt record source SHA, exact installed deployment/version and private registration hash, UTC interval, test identity role, bounded request count, before/after revision hashes, provider outcome and cleanup disposition. Public reports contain only sanitized facts. Retain raw evidence privately with owner-only access. Never expose customer rows, credential material or authenticated URLs.

## Permissions, direct editing and credential lifecycle

- Content staging is the only general direct-editing surface. A staging row carries source key, expected revision, typed proposed changes, actor and review state. It is not public until validation and controlled commit, then separate publication. Treat formula-leading text as literal data; preserve original values through the codec.
- Operations is confidential. Authorized Studio roles may edit their permitted records; raw workbook editing remains restricted. Security has no ordinary-editor or public access. System review input cannot change canonical leases, audit or mutation receipts. Hidden/protected tabs never substitute for separate confidentiality boundaries.
- Netlify production and preview contexts must bind different allowed resources or use read-only/redacted data. Do not attach production credentials to an isolated browser/test server. Browser responses contain public projections or authorized records only.
- Inspect intended owner account, OAuth consent status, execution identity, granted scopes, refresh lifecycle and resource allowlist through normal owner-controlled access. Do not mint replacements or recover browser tokens. Existing source has renewable-token support, but no real credential binding is proved here.
- Read-only credential introspection and permitted renewal do not authorize a wider scope, public sharing, rotated signing key or new service identity. Prepare any necessary access change precisely before requesting its applicable approval.

## Additional transaction/security gates

Bounded multi-record commit must prove one-time request approval/redemption with unique login, credential-version changes and session revocation; shared throttling at a limit of one; concurrent order/event/reference reservation; idempotent form submission; stale expected revisions; formula/type rejection; actor authorization; and actual bookkeeping atomicity. Use separate processes and cold starts. No public product creation is part of these tests.

Measure snapshot characters/wire bytes, lock duration, actual quota accounting, p50/p95 latency and failures at source scale with 2 and then 5 isolated concurrent callers, stopping on invariant failure. Durable jobs must survive worker termination and redeploy. Publication requires whole-bundle coherence and cache invalidation on actual Netlify. A 200/202 status or script trigger is not persistence acceptance.

If a real interruption, identity or quota condition cannot safely be exercised, leave that gate blocked and continue independent implementation. Record the exact dependency; no skipped test becomes a pass.
