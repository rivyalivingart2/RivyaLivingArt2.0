# NFF-101 — Capacity and service placement

This is a source-derived model with current official limits, not a load test. Inputs are [the aggregate source census](source-profile.json) and [the source-bound policy](capacity-policy.json). [The generated assessment](capacity-assessment.json) is produced by `node tools/phase1-capacity-plan.mjs --out <new-local-report.json>` from the repository root. The tool rejects stale hashes for the schema and three writer files, duplicate/unmapped tables and inconsistent counts. It never contacts providers or certifies a migration.

## Measured source volume and implementation bounds

The census was observed at 13:01 UTC on 28 October; the later 14:20 source refresh matched its counts and all 20 business-table fingerprints. It is a dated source snapshot. Fresh counts are required for rehearsal and final delta.

| Boundary | Source rows | Full Drive documents needed | Initial rows/tab under one mutation per row, including header | Shortfall against 100-row sandbox | Shortfall against 2,000-row default |
|---|---:|---:|---:|---:|---:|
| Content | 2,210 | 310 | 2,211 | 2,111 | 211 |
| Operations | 116 | 0 | 117 | 17 | 0 |
| Security | 29 | 0 | 30 | 0 | 0 |
| System | 1,099 | 0 | 1,100 | 1,000 | 0 |

The model assumes one record, ledger, audit and history entry for each imported source row. Source historical audit/revision rows remain preserved records, in addition to the migration writer's own bookkeeping. Existing sandbox probes, staging tabs and future writes are excluded; they must be inventoried before allocating capacity. No tab was resized and no probe was overwritten.

The source JSON measured 54,650,653 bytes. That is not the future canonical snapshot or a Drive-capacity measurement. The 310 large payloads need immutable, hash-verified documents; do not truncate them. Current local limits differ:

| Layer | Current local source bound | Implication |
|---|---|---|
| Record codec | 45,000 characters inline; 8 MiB characters per full artifact | Characters and UTF-8 wire bytes are separate measurements |
| Controlled writer | 2,000 rows/sheet, 2 MiB snapshot characters, 1 MiB batch bytes by default; ceilings 20,000 rows / 8 MiB characters / 2 MiB batch bytes | Increasing the row limit alone cannot establish fit |
| Signed gateway | 1,800,000 request bytes including serialized envelope; 6,000,000 response bytes by default, maximum 8,000,000 | Nested JSON escaping and duplicated raw/effective cell values increase wire size |
| Apps Script registration | At most 10,000 rows and 32 columns/tab; lock attempt 5 seconds | Lower than the TypeScript row ceiling; actual installed registration must be read back |
| Current mutation | Exactly one row in each of records/ledger/audit/history, plus gate marker | Multi-record transactions and bounded bootstrap need implementation |

Every successful later update appends history, audit and a ledger entry. Do not purge them to fit. Before migration, measure actual encoded snapshots, signed wire sizes, p95 latency and growth for all four boundaries. Choose reviewed partitioning/checkpoint archives with retained replay/relationship evidence; simply raising every ceiling is not the design. A 10,000-row allocation would leave Content at most 7,789 extra history rows under this model, before byte limits. This is not a usable-capacity promise.

## Quotas, costs and conservative operating behavior

Official references checked 28 October 2026; actual account eligibility/usage is a separate gate.

- [Sheets usage limits](https://developers.google.com/workspace/sheets/api/limits): 300 reads and writes per minute per project, 60 per minute per user/project, recommended 2 MB payloads. One batch counts as one request. Standard use is no additional cost; the page describes planned quota-related billing later in 2026. Recheck actual project settings before activation; no quota increase or billing enablement here.
- [Apps Script quotas](https://developers.google.com/apps-script/guides/services/quotas): consumer limits include 6 minutes/execution, 30 simultaneous executions/user, 90 minutes/day trigger runtime and 20,000 URL Fetch calls/day. Other Google-product quotas still apply. These are shared budgets, not guaranteed throughput.
- [Netlify Free](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/) has 300 monthly credits with a hard limit and no auto recharge. Account Free/no-top-up was read back in Phase 0; remaining usage requires an independently reconciled read. Do not add another paid service when credits run out.
- [Netlify function defaults](https://docs.netlify.com/build/functions/configuration/): synchronous 60 seconds, scheduled 30 seconds, background 15 minutes; buffered payload 6 MB and background payload 256 KB. The actual Next.js adapter and deployment must be verified independently.
- [Background functions](https://docs.netlify.com/build/functions/background-functions/) are available on credit-based Free; 202 confirms invocation, not completed work. Retry delivery is possible. Job state must remain canonical and idempotent.
- [Google OAuth expiration](https://developers.google.com/identity/protocols/oauth2#expiration): an external consent app in Testing normally receives seven-day refresh tokens for these scopes. Inspect consent status, intended server identity and scopes; the local renewal implementation alone cannot guarantee unattended access.

The present writer path performs two Sheets reads to prepare, four more to check snapshot/control at commit, and two writes (inflight marker then atomic batch). An independent readback adds two reads. Using the full documented 60-read user budget gives 10 whole mutations/minute, or 7 with readback. Importing 3,454 rows at that illustrative 7/minute budget takes 494 whole-minute windows. This assumes no other traffic, conflict, retry, lock wait or provider latency and is **not an ETA, benchmark or safe production allocation**. A bounded bulk bootstrap requires its own verified transaction design. Do not multiply the 60-user allowance by workbook count or treat 30 simultaneous executions as 30 safe writers.

## Placement and measurements needed

| Work | Execution | Durable authority / failure behavior |
|---|---|---|
| Public pages | Netlify, immutable validated cached bundle | Content active pointer + Drive bundle; last validated cache on temporary provider failure; no SQL fallback after switch |
| Studio/security mutations | Netlify authorization; signed Apps Script coordinator | Same-boundary canonical records, receipt and audit; preserve form values, reject safely on timeout/unknown outcome |
| Catalogue and research | Bounded Netlify background steps; Apps Script for short Google-local operations where measured suitable | Domain job/lease/checkpoint; retry time survives redeploy; 202 never means outputs are ready |
| Scheduling | One designated scheduler per job family, selected after usage measurement | Scheduler only wakes canonical work; expired leases require fenced reclaim, never duplicate side effects |
| Files and export | Drive transport with bounded transfer/resume | Registered immutable original or output; exact hash/type/permission readback before linking |

Initial isolated load probes must leave shared quota headroom: begin serially, measure actual calls and bytes, stop on any quota warning, conflict anomaly or unexpected writes. No deliberate account exhaustion. Productive demand rates, peak concurrency, p95 login/save latency, Drive free space, retention growth, Netlify credit use and full restore duration are still **unknown**. Proposed operational targets are: login/save p95 under 3 seconds in normal operation, reject/retain input within 10 seconds on failure, and bounded worker steps with at least 20% execution headroom. These are engineering targets to test, not owner-promised SLAs or measured results.
