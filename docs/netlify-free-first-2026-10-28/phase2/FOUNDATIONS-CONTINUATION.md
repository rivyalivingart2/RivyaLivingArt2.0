# Local storage foundations continuation — 29 October 2026

Candidate parent: `f7333aa828885a08ed3883d45efeca9384a51f75`, branch `codex/netlify-free-first`. The owner authorized continuing capacity repair and pending work locally. The changes described here are not pushed, published, deployed or activated. SQL/Blob remain authoritative; existing v1 Google resources, Vercel and OLDWEBSITE remain retained. Public/login presentation and existing products, data and media are preserved.

This checkpoint extends the [bounded storage and recovery foundation](README.md). The earlier [verification report](VERIFICATION.md), encrypted source checkpoint and local SQL restore keep their original observation dates and scope. The source checkpoint completed on **28 October 2026 at 18:34:02 UTC**; using it for another local rehearsal is not a fresh production database inventory or another SQL restore.

## Inactive job and login-throttle adapters

The new [bounded job adapter](../../../src/lib/google-workspace/bounded-job-store.ts) implements the existing `JobStore` interface without changing the v1 adapter or application provider selection. It validates exact creation and transitions against the original prior record, preserves frozen job inputs and lease fencing, and passes the worker's exact `commitBefore` deadline to the writer. Its operation identity binds actor, action, transition time, guard, expected revision, mutation ID and payload hash. Different actions that happen to produce the same resulting job cannot reuse each other's replay receipt.

The [bounded login-throttle adapter](../../../src/lib/google-workspace/bounded-throttle-store.ts) uses the guarded canonical counter and the existing throttle rules. Explicit no-write conflicts may be retried within one operation budget. Unavailable, unknown, malformed or denied outcomes fail closed; an in-memory counter does not become authority. It is not wired into the current login flow.

The shared [bounded store](../../../src/lib/google-workspace/bounded-store.ts) now supplies a named trusted policy context: current records remain separate from `originalsByMutation`, which contains the verified prior record for a mutation, including historical replay. Preflight and guarded callbacks receive independent copies, the exact layout and `commitBefore`. This reuses already required bounded proof pages; it introduces no whole-history scan. An optional absolute monotonic deadline lets adapters share one budget across reads, mutations and conflict readback, capped by the existing **30-second** ceiling. Exceptions after provider dispatch and expiry during successful-receipt processing remain unknown outcomes.

The focused job tests pass **17/17** and throttle tests **15/15**. They execute the exact saved Apps Script source through the local range-slicing emulator. Evidence includes cold object recreation, canonical record/receipt readback within the emulator, historical replay, concurrent claims/counters, denial, lease expiry, altered provenance, uncertain writes and shared deadlines. These tests do not prove Google execution, owner/API isolation, account limits or production durability.

## Complete document staging and local operator journal

The [source-document bridge](../../../tools/google-workspace/source-document-migration.README.md) consumes a complete oversized source row and explicit immutable registration. It journals the registration before create, verifies bytes/hash and complete bounded owner/user-permission evidence, and returns a small staged reference only after verified journal readback. Actual provider IDs must be reserved and retained through a separately reviewed provisioning step. No filename search, invented Google ID, overwrite, deletion, canonical Sheet write or authority switch is supplied.

The upload path currently rejects documents exceeding **5 MiB** with `RESUMABLE_UPLOAD_REQUIRED`; it never clips them. Privacy evidence is a point-in-time observation, not a lock against later owner or API changes. Shared-drive ownership and incomplete, public, domain or group permission evidence fail this policy. Overall monotonic checks cover planning, journal work, provider calls and reference return, including synchronous work that delays timers.

The local operator journal is a private, fsynced append-only file with an exclusive lock, checked file identity and a validated hash chain. It is limited to **16 MiB**, **10,000 entries** and **12,000 bytes per value**. It contains private registrations, reference metadata and hashes; raw oversized row bodies and tokens are excluded. Directory/file permissions are checked at open, with no per-document PowerShell ACL call. An uncertain append/fsync or corrupt replay quarantines the journal and retains its lock. There is no automatic lock expiry, truncation, pruning or force-unlock operation.

This journal is not a Netlify application store or off-device backup. Without an independent anchor, its hash chain cannot detect removal of a complete valid suffix or history recomputed by the owner. A clean close/reopen does not establish machine-loss, power-loss or remote-provider recovery.

The bridge/privacy/journal suite passes **12/12** synthetic/local tests, including fsync quarantine and monotonic-deadline starvation. The [actual-source rehearsal CLI](../../../tools/google-workspace/rehearse-source-documents.mjs) passes **3/3** focused synthetic tests. It accepts an already verified encrypted actual-source checkpoint, keeps rows and artifact bytes in memory, and uses an explicitly local Drive emulator plus a real owner-only operator journal. Its two passes reuse the same registrations across journal close/reopen and bridge recreation. One deliberate local lost acknowledgement checks reuse of the same identity. Creates, create attempts and duplicates are measured.

The CLI also constructs a local bounded-format model for every source row: inline records plus verified document-reference envelopes. Emulator file and parent IDs use the maximum permitted **160 characters** to make reference overhead conservative. Original document payload hashes and reference-envelope hashes differ by design and are checked independently. Local initial mutation wrappers preserve the supplied source payloads, including source history contained within them; they are not historical target migration receipts.

The sample update collector selects up to eight records per boundary by **payload JSON character length**. The largest prepared request it reports is the maximum within that sample, not a global maximum and not necessarily the largest UTF-8 payload. No claim that every possible multi-record update fits follows from those samples. Concrete future operations retain independent request/page/metadata checks and may reject for capacity.

The [actual-checkpoint document rehearsal](source-document-rehearsal.json) completed at **29 October 2026, 04:00:12 UTC**. It checked the prior encrypted checkpoint's 22 tables, 3,455 rows and 36 mapped schema/key contracts. All **310 oversized documents**, totaling **20,537,481 bytes** with a maximum individual size of **1,048,902 bytes**, matched their complete original payloads. Two passes performed **620 document verifications** with **310 emulator create attempts**, **310 creates**, **zero duplicate attempts/creates**, **620 durable local journal entries** and **one clean journal cold reopen**. There were **zero process restarts**. Raw source rows and artifact bytes remained in memory; the private journal remains under ignored owner-only `test-results/netlify-foundations-20261029-documents/`.

All **3,455 source rows** then passed the complete local bounded representation, including the 310 verified emulator document references. Each boundary's current-record, ledger, audit and initial-history counts matched. These are new local initial wrappers; complete original source histories remain within the supplied payloads.

| Boundary | Records | Physical pages | Manifest bytes | Largest signed read response | Largest sampled prepared update |
|---|---:|---:|---:|---:|---:|
| Content | 2,210 | 1,306 | 708,391 | 727,736 | 926,992 |
| Operations | 116 | 60 | 35,638 | 57,625 | 84,121 |
| Security | 30 | 16 | 9,327 | 33,713 | 30,223 |
| System | 1,099 | 552 | 341,842 | 351,505 | 365,723 |

The Content manifest fits below **1,048,576 bytes**; the reported read responses fit below **6,000,000 bytes**, and the sampled prepared requests fit below **1,800,000 bytes**. Eight unchanged-payload single-record updates were prepared per boundary, with at most eight proof/working pages and three signed reads plus one commit request per sampled operation. None was dispatched. These observations close the complete **local payload model** for this checkpoint; they do not establish future growth, all possible operation sizes, provider latency, account quota or installed target capacity.

The sanitized receipt preserves its original source-code hashes and explicitly retains `providerVerified: false`, `targetWrites: 0`, `canonicalWritten: false`, `migrationComplete: false` and `completeTargetCapacityVerified: false`. The reference IDs, folder/permission evidence and deliberate lost acknowledgement are emulator fixtures. No actual Google files were created and the journal is not evidence of remote-provider durability.

## Existing v1 history preservation

The pure [legacy conversion planner](../../../tools/google-workspace/convert-legacy-writer.mjs) validates an existing v1 snapshot before constructing a local v2 representation. It preserves original record identities, archived/current payloads, ledger order, receipts, audit/history rows, actors and timestamps. Missing history, formulas, unsupported relationship layouts, incompatible confidentiality boundaries, broken predecessor order and insufficient allocation reject. No source or target writer call occurs during conversion.

The **five-case preservation suite passed**, including the new domain-operation regression. Generic original receipts remain available for singleton replay using the legacy mutation ID as operation ID. V1 snapshots do not preserve the complete job/domain action binding expected by the new adapters. The converter therefore reports `domainOperationBindingsPreserved: false` and `domainAdapterReplayVerified: false`. A converted legacy enqueue replayed through the new job adapter after a later claim returns `applied: false` and the current revision, with no new writes and unchanged history. Compatibility needs an explicit design and verification before cutover; a domain binding must never be fabricated from missing evidence.

The [read-only provider receipt](legacy-conversion-readback.json), completed **29 October 2026 at 03:47:18 UTC**, records **eight signed read requests**, covering two observations of each of the four existing isolated v1 sandbox registrations. This is not an inventory or conversion of all business data. There are **four existing records and fourteen mutations** across the four boundaries, not eight records or twenty-eight unique mutations:

| Existing boundary | Current records | Ledger / audit / history entries each |
|---|---:|---:|
| Content | 1 | 3 |
| Operations | 2 | 10 |
| Security | 1 | 1 |
| System | 0 | 0 |

These are preserved sandbox probes, not imported business records. The two source observations matched, but `sourceCoordinatorStateVerified` remains **false**: the read response validates coordinator shape without exposing or proving an idle coordinator. Matching reads are not a source write freeze, final-delta reconciliation or proof against a later pending outcome. Local conversion checks do not install the target, certify all real Google safety gates, prove immutable deployed-source identity or authorize a source reset. No commit request, target bootstrap or source mutation was performed by this read-only check.

The copied receipt is unchanged, including its original code hashes and earlier `originalReceiptsPreserved` field. It predates the explicit generic/domain replay distinction above. Interpret that field as preservation of **generic mutation receipts only**; it does not certify the missing full-domain action binding or compatibility with new adapter operation IDs. The later clarification and regression must not be backdated into the earlier provider receipt.

## Next local step: atomic access redemption

Review of the inactive existing security adapter reproduced two successes for the same link in a synthetic concurrent redemption: updating staff and consuming the request were separate writes. Replacing its CRUD methods is therefore insufficient for activation. The live SQL path remains authoritative and was not changed.

The new [atomic redemption primitive](../../../src/lib/google-workspace/bounded-access-redemption.ts) requires an explicit `security` layout, the exact layout hash, a trusted registration containing the source request/staff UUID pair, owner-login exclusion and mandatory external authorization. It derives the original migration record identities instead of inventing replacement staff IDs or scanning all requests. Bounded reads return internal server snapshots containing credential/token hashes; they must never be exposed to a browser or public log.

One two-member transaction guards the exact original request and staff envelopes, including expected revisions, source timestamps, token, request-to-staff relationship, login, credential version, expiry and access/recovery active-state rules. It updates staff credentials/active/version and consumes the request together. It matches the existing source schema and SQL semantics: `completed` status, staff's existing `created_at`-only metadata, and matching request `updated_at`/`sourceUpdatedAt`. Integer versions cannot overflow. Full operation intent is bound cryptographically, and expiry is passed through to the writer lock.

The primitive passed **10/10 focused tests**, an independent review/rerun, and the parent's final regression run. Evidence includes exactly one winner among competing redemptions, expiry inside the writer lock, original-prior replay after a later staff disable, altered source metadata, wrong-layout rejection, mandatory authorization, tampered history and late/unknown results. A replay returns `receiptOnly: true` and original revisions; it is not a current authentication grant. No token issuance, session creation/deletion, token/login lookup index, domain audit event or runtime wiring was added.

Next integration still needs atomic session creation/validation/refresh, credential-version revocation checks, trustworthy token/login lookup, request uniqueness/approval and explicit business audit/session revocation. Do not activate the older security adapter wholesale or treat this narrow primitive as a complete login/recovery workflow.

## Verification and production observation

**195 distinct tests passed** across the recorded runs: the 184-case combined storage suite, one new legacy-domain regression and ten atomic-access cases. The parent's final 15-case run repeated all five conversion tests and all ten access cases successfully; four repeated conversion cases are counted only once. The combined suite also covers bounded/adversarial storage, jobs, throttling, document bridge/journal/transport, source rehearsal, migration/codec and existing canonical jobs. No simulated provider test is classified as real Google acceptance.

Supported Node **22.23.2** was used. Whole-project TypeScript, targeted ESLint and patch checks passed. These inactive adapters/operator tools have not received a new full application build, real browser workflow or hosted-preview acceptance in this continuation.

At **04:06:07 UTC**, all **1,198 protected source files** matched their stored hashes. A limited exact-value scan checked the 27 changed files against seven retained private endpoint/key/workbook values and found no match; all 338 checked local Markdown links resolved. Private checkpoint contents, keys, provider registrations, original source fingerprints and the operator journal remain ignored and outside the commit. This scan is not a general proof that arbitrary text contains no sensitive information.

The Netlify read-only observation at **29 October 2026, 03:55:35 UTC** showed the existing production deployment ready and locked to migration commit `7b390d558b9a48d5ec7ccedb8bab104f6b1411f9` on `codex/netlify-hosting-migration`, with **www.rivyalivingart.com** retained as the public address. This is observation of the existing release, not publication of the local foundation changes. The domain configuration and production deployment were not changed by this work.

## Remaining acceptance

Local implementation and synthetic/source-backed modeling remain separate from real provider verification, actual migration, cutover, production release and old-resource removal. Still open: all five outstanding Google checks, renewable Drive/Slides runtime credentials, sustainable ongoing-free account capacity, real ID reservation and uploads, v2 registration/bootstrap, retained sandbox/domain replay compatibility, source/target/media reconciliation, complete recovery, runtime integration and complete Studio/catalogue workflows. Finite-index growth, sustained latency and quota behavior also require evidence. No phase or complete target-capacity gate is marked complete by this continuation, and no recovery resource may be retired on its basis.
