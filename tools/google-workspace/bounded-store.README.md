# Bounded canonical storage v2 — local operator and integration notes

This is an **inactive local foundation**, implemented in [bounded-store.ts](../../src/lib/google-workspace/bounded-store.ts) and [BoundedWriter.gs](apps-script/BoundedWriter.gs). It addresses the measured requirement to stop loading all Content records and history for every read or mutation. The previous source-derived Content representation exceeded 152 MB of signed response data. No deployment, target bootstrap, migration or production activation is supplied or performed by these modules.

Keep the existing v1 source, endpoint, registration and sandbox intact. A v2 provider is constructed only from an explicitly supplied gateway and a separately verified layout. There is no environment lookup, automatic provider selection, credential generation, workbook creation or fallback to the old authority. SQL/Blob remain current authority until later verified migration and cutover.

## Registration and physical layout

The exact `BoundedLayout` fields are `protocol`, `key`, `workbookId`, `rootSheetId`, `metadataSheetId`, `dataSheetId`, `maxPages` and `maxMetadataChunks`. `protocol` must be `rivya-bounded-v2`. Workbook and sheet IDs must be actual verified registrations; fixture names in tests are not resource registrations.

The three distinct registered sheets have these exact allocations:

| Sheet | Allocation | Contents |
|---|---|---|
| Root | 1 row × 1 column | Canonical JSON root, manifest digest, authority epoch/revision and durable operation state |
| Metadata | `maxMetadataChunks` rows × 1 column | Canonical manifest split into literal chunks; unused rows must be blank |
| Data | `maxPages × 8` rows × 7 columns | Fixed eight-row physical page blocks; the manifest identifies each block's family, occupied rows and digest |

The Apps Script uses `GW_KEYS_JSON` for existing signing credentials and `GW_BOUNDED_RESOURCES_JSON` for v2 registrations. It permits one v2 registration per workbook, avoiding overlapping coordinator ownership. Secrets and private registration files belong in owner-controlled storage and must not enter source, Sheet cells, browser responses or logs. Setting these properties, allocating sheets, installing scopes and deploying an endpoint are separate actions; this README is not a bootstrap receipt or authorization to replace an existing installation.

## Canonical metadata and limits

The manifest binds the layout digest, authority epoch, revision, page hashes and exact record/mutation/transaction locations. Compact tuple indexes avoid duplicate full payloads:

- `pages[id]`: family (`r`, `l`, `a`, `h`), occupied row count and literal-grid SHA-256.
- `records`: record ID, current page, current row and latest mutation index.
- `mutations`: mutation ID, record index, predecessor mutation index, then ledger/audit/history page-row pairs.
- `transactions`: operation ID, first mutation index and contiguous member count.

Every physical occupied row must have exactly one index owner. Missing pages, duplicate identities/slots, wrong families, broken predecessor chains and unknown fields fail validation. The root's committed operation ID must match the latest transaction. Full audit additionally checks its actor/request hash against that transaction's durable ledgers; ordinary reads validate their selected record/receipt proofs rather than reconstructing every historical transaction.

Current hard ceilings are exported as `BOUNDED_LIMITS`:

| Limit | Ceiling |
|---|---:|
| Rows per physical page | 8 |
| Normalized characters per page | 131,072 |
| Manifest UTF-8 bytes | 1,048,576 |
| Characters per metadata cell | 16,384 |
| Metadata chunks | At most 64, with a smaller explicit registration allowed |
| Registered pages | At most 8,192, with a smaller explicit registration allowed |
| Pages per signed read request | 4 |
| Pages in a mutation working set | 64 |
| Records per atomic mutation group | 8 |
| Signed response bytes | 6,000,000 |
| Signed request bytes and Google write batch bytes | 1,800,000 |
| Entire client operation | 30 seconds; only smaller overrides allowed |

UTF-8 wire bytes, JSON escaping, normalized characters, cell limits and physical allocation are checked separately. A lower metadata or page limit can stop writes before the other limits are reached. Indexes are finite and append-only: there is no eviction, receipt expiry, history pruning or automatic growth. Capacity exhaustion requires a reviewed allocation/partition plan and reconciliation; it is not permission to delete history or raise every ceiling.

## Read and mutation behavior

`createBoundedProvider(gateway, layout)` exposes `readManifest`, `readPages`, compatible `readPage`, and `commit`. A read returns metadata or at most four requested pages, pinned to the same epoch/revision/manifest digest. Stale, duplicate, missing or unexpected pages fail. The script checks literal entered/effective values before returning compact strings; formulas, numeric coercion and unexplained trailing cells are not accepted.

`createBoundedStore({layout, policy, now}, provider)` exposes `load` and `mutate`. Server-owned `authorize` and `validate` callbacks are mandatory. Their input is copied so a callback cannot alter the submitted intent or validated current record. Do not take roles, policy decisions, registrations or privileged relationship sets from browser input.

A normal existing-record load fetches metadata plus current record/ledger/audit/latest-history proof pages, and the predecessor history page when needed. It does not fetch all retained history. `mutate` supplies commands, a stable operation ID and actor, optional guarded relationship record IDs, and an optional lease deadline. Current-record page growth can split only the affected mutable page; neighboring records retain their exact encoded values and all historical page/row locations stay fixed.

Preparation validates each member through `planRecordMutation`. Every selected read dependency is guarded, including unchanged relationship and proof pages. The script rechecks root and page digests under its lock, persists an inflight marker, then issues one atomic same-workbook batch containing all member changes, receipts/audit/history, indexes, metadata and the committed root. It rejects omitted historical entries, rewritten historical rows and unexplained changes to moved neighbors. Multi-record groups are never silently split into separate commits.

The operation timeout covers authorization, reads, proof validation, preparation and commit. Monotonic elapsed checks also stop dispatch after blocking synchronous validation exceeds the deadline. A dispatched timeout remains uncertain; cancelling the client is not proof that Google stopped execution.

## Failure and recovery states

- A stale root, expected revision or page proof stops the mutation. Preserve edits and operation/mutation IDs for explicit reconciliation; do not create replacement IDs automatically.
- A known lost final response can replay the original stored receipts after a fresh read, including after a worker restart. A new proposed timestamp never replaces the original receipt.
- An inflight marker fences reads and unrelated writes. The code has no automatic timeout-based clearing or blind batch replay. If a late original atomic result appears, the committed state becomes readable again. A permanently interrupted inflight operation needs a separately prepared recovery procedure and verified state inspection.
- A lease expiring after the inflight marker prevents the final canonical batch and leaves quarantine intact.
- Unknown or malformed provider outcomes remain unknown. A 200 response, local process completion, test pass or successful source encoding is not target migration evidence.

## Local builders, audit and evidence

`buildBoundedState({layout, epoch, plans})` creates a pure in-memory representation from valid apply plans. It preserves complete payloads and every supplied historical revision. It creates no provider IDs or resources. Source rehearsal may use explicitly labelled synthetic layout IDs, actors and mutation wrappers around actual source rows; those must never be reported as migrated records or real provider receipts.

`auditBoundedState(layout, state)` verifies all supplied pages and replays every recorded mutation to check current state, histories, receipts and audit correspondence. This explicit local full-audit helper expects its pages in memory. A production streaming audit worker, durable audit checkpoints and target bootstrap are not supplied. Remote pages can be read in bounded, root-pinned groups, but ordinary application operations never reassemble the full history.

`measureBoundedState(layout, state)` reports aggregate metadata/page sizes and conservative signed-response maxima, including the largest four-page batch and maximum legal transport identifiers. It does not claim a maximum prepared write request until a concrete operation is measured. `prepareBoundedCommit` and `boundedRequestBytes` supply that check for an actual proposed group. No fabricated Drive reference may be inserted to improve a measurement; unresolved large documents remain unresolved until real registered files exist and their bytes are verified.

The exact Apps Script source is exercised by a range-slicing emulator in [the test helper](../../tests/helpers/google-workspace-bounded-harness.mjs). Its memory is disposable test state, not application durability. Run:

```powershell
node --import tsx --test tests/google-workspace-bounded-store.test.mjs tests/google-workspace-bounded-adversarial.test.mjs
node node_modules/typescript/bin/tsc --noEmit --pretty false
```

Source-scale measurements, real provider permissions/latency/quotas, independently interrupted executions and all five Google acceptance checks remain separate evidence. In particular, ScriptLock serializes cooperating requests; it cannot exclude an owner or unrelated API writer between final guard reads and the batch. [Google's batch-update contract](https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/batchUpdate) guarantees the batch's updates apply together but explicitly qualifies behavior with collaborator changes. Capacity repair does not certify that isolation gate or justify an unmeasured database exception.

No new database has been selected. The intended Google account's ongoing-free capacity and renewable Drive/Slides credentials remain account-level prerequisites. Existing job/throttle adapters still use v1 and need explicitly tested v2 adapters before runtime integration. Preserve public/login design, records/media and all recovery resources throughout.
