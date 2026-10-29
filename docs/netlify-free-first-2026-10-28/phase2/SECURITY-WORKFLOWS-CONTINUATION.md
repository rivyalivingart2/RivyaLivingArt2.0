# Security workflows continuation — 29 October 2026

Candidate parent: `812296c72caefffcf477876a7687d1d96de96dfd`, branch `codex/netlify-free-first`. The owner requested atomic lookup maintenance, approval, redemption, audit and session maintenance, followed by the remaining pending work, with every change local. This report supersedes the corresponding pending implementation items in [the preceding session checkpoint](SESSION-CONTINUATION.md). It does not supersede provider, runtime, migration, capacity or release gates.

## Implemented local scope

The new [workflow engine](../../../src/lib/google-workspace/bounded-security-workflows.ts) completes these operations against the bounded Security provider:

- Request submission reserves the open-request lookup in the same transaction as the source request. Duplicate open requests leave existing details unchanged.
- Approval creates a disabled editor only for a new eligible access request, or binds an eligible existing identity for access reissue/recovery. Request update, new staff where applicable, lookup changes and a domain audit event commit together. Current administrative session, role, credential version and owner epoch are checked; client-supplied role props cannot authorize approval.
- Reissue archives the previous token claim and installs the new claim atomically. A token with any existing claim, including an archived claim, cannot be issued again. Reject archives token/open claims and preserves the request history. Open request keys can subsequently be assigned to a new request through a revision-checked claim update.
- Redemption checks the exact token, approval state, staff identity, current credential version, activity rule and old expiry. Password update, credential-version increment, completed request, token/open-claim tombstones and the domain event form one atomic group. Older sessions become invalid immediately through the version check; cleanup is not a prerequisite for revocation.
- Staff edits preserve UUID and created-at metadata, enforce unique login even against disabled staff, increment credential version and atomically move login claims. Renaming an identity with a linked open request rejects for explicit resolution instead of breaking its link. Self-edit/owner collisions reject.
- Session maintenance archives at most seven expired or demonstrably revoked sessions, plus one audit event, per transaction. Original payload and all history remain. The result reports remaining candidates, and a later bounded invocation continues. Clock rollback alone is not revocation evidence. Owner sessions are compared with the canonical epoch, so a worker holding old credentials cannot archive sessions valid under the new epoch.
- Successful-login counter reset requires a current unrefreshed session in its first 30 seconds and the exact counter revision from an admitted attempt. The reset operation identity is fixed per session. Later concurrent attempts survive, and another reset cannot reuse the same session to erase them. Counters are updated to zero without deleting history.

Creation, validation/refresh and logout retain the preceding guarded session service. Every workflow has one monotonic deadline across permission checks, proof reads, retries and commit. Up to four explicit no-write conflicts can retry. Post-dispatch exceptions and lost/late acknowledgements remain unknown; a response labelled conflict after dispatch is not permission to repeat a potentially committed operation.

## Lookup coverage without a stale ready flag

The earlier root-pinned reader remains available for its original narrow contract. The new [current snapshot verifier](../../../src/lib/google-workspace/security-current-snapshot.ts) reconciles every current canonical Security record and every live pointer claim against the trusted immutable bootstrap marker. It reads current-record proofs, not the complete immutable history. It verifies exact source schemas, source-derived IDs, metadata, relationships and the three SQL uniqueness rules represented by the projection planner. Unknown or malformed record shapes, missing/extra claims, source edits without matching claims, modified markers and forged audit receipts fail closed.

A later root is accepted only after that complete bounded reconciliation. The mutation must still use that exact root; any intervening Security write forces a new decision. New/changed/archived claims are generated from the proposed source state and included in the same transaction as the source records. They contain pointers rather than copied credentials or roles. No background projection job or unverified ready flag grants coverage.

The registration still requires separately reconciled bootstrap source completeness and SQL normalization/collation equivalence. The marker describes the bootstrap snapshot, not a mutable claim that its original counts remain current. No registration was provisioned by this work.

**This verifier has deliberate hard ceilings:** 256 current records, 256 current-proof pages and 8 MiB of accumulated proof data, within the 30-second operation budget. It rejects instead of truncating. Audit events, archived claims and archived sessions count toward that ceiling. The underlying bounded manifest still has a 1 MiB ceiling and retains history. These limits are safety boundaries, not a sustainable production capacity claim. Verified archival/segmentation and real latency/quota measurements remain required before activation; this change does not solve indefinite history growth.

## Audit authority and replay

Each successful workflow includes a `rivya-security-event-v1` record in its own Security transaction, with operation binding, actor, actual decision principal, action, entity references, time and changed-record count. Its structural proof must match the transaction group; changing the event or creating it separately cannot establish a completed workflow. Retry of the same bound operation returns a receipt only. Reusing its ID for different input rejects.

These are new Security domain events. They are **not** fabricated `rivya_audit` SQL rows, and are not dual-written across Security and System. Existing `rivya_audit` history remains in its current authoritative store and retains its real IDs. The generic canonical mutation audit/history also remains intact. A future combined Studio history view must read these distinct event sources with provenance; an unimplemented cross-workbook write is not described as atomic.

The authenticated Studio audit projection omits token/password hashes, request digests and private canonical proofs. Internal source snapshots and configuration fingerprints must never be serialized into browser responses or logs.

## Adapter and application boundary

The [server facade](../../../src/lib/google-workspace/bounded-security-service.ts) generates cryptographic link tokens and password hashes, resolves the actual request's session token through an explicit server callback, and returns a raw link only after a new confirmed approval. Replay never returns a fresh token or a redemption success. Approval reports its actual persisted expiry; the application wrapper no longer invents an expiry from the current clock.

The existing [Google security adapter](../../../src/lib/google-workspace/security-adapter.ts) accepts the facade as its fourth constructor argument. Staff lookup/authentication, staff/request lists, request submission, decision and redemption delegate to it. A persistent adapter without the atomic facade rejects these old split-CRUD paths. Only the explicitly named in-memory simulation retains them. `isConfigured()` now requires both session and workflow services for a persistent store, and each service is bound to the configured owner fingerprint. Unknown/inactive staff password checks use the dummy hash path rather than immediately returning before derivation.

The bounded throttle store now optionally returns a committed attempt receipt while preserving its existing boolean method. `resetSuccessfulLogin` consumes that receipt; `maintainSessions` exposes bounded cleanup. These methods are explicit internal hooks. No production scheduler, cookie resolver, route provider initialization or new login flow was installed. The application's current SQL/Blob authority, SQL authentication path, public website and login presentation remain selected and unchanged.

## Local verification

The supported **Node 22.23.2 combined run passed 175/175 tests**, including **37 new workflow/service tests** and 138 session, lookup, throttle, job, bounded writer, redemption and provider-selection regressions. Tests execute the saved Apps Script source in a local emulator. Cases cover concurrent decisions and redemption, reissue/rejection, identity collisions, revocation during commit, lock-time expiry, stale owner workers, clock rollback, interrupted/quarantined writes, unknown outcomes, input/provider mutation, missing coverage, forged events, hard capacity rejection, shared deadlines and one-reset-per-session semantics.

The integrated local journey runs request → approve → redeem → password authentication → guarded session creation → reload through newly constructed services, with legacy CRUD calls rejected. Tokens and plaintext passwords are absent from the emulator's persisted state. This is executable local integration evidence, not a real Google or browser acceptance test. Whole-project TypeScript, targeted ESLint and patch checks passed. No new application build, browser/device journey or provider action is inferred from those checks.

The ignored combined log is `test-results/netlify-security-workflows-20261029-tests.log`. Aggregate source rehearsal evidence is linked below. Preserve private evidence under ignored owner-controlled directories.

An additional access-validation/security-contract run passed **10/10**, giving **185 distinct passing tests across the two final runs**; repeated exploratory runs are not added. At **07:19:47 UTC**, all **1,198 protected files** matched their retained hashes, all **437 checked local Markdown links** resolved, and the 23 changed files contained zero exact matches against seven retained private endpoint/key/registration values. This limited exact-value scan is not a general data-loss-prevention guarantee. No private `test-results/`, synced `sources/` or environment files were included in the change set.

## Continued pending work: actual checkpoint reconciliation

The [read-only local rehearsal](../../../tools/google-workspace/rehearse-security-current.mjs) completed at **2026-10-29 07:08:11 UTC**, authenticating and decrypting the retained 28 October checkpoint. Its [aggregate receipt](security-current-rehearsal.json) records all **22 tables / 3,455 source rows** and exactly **30 Security records**: 28 login-limit rows, 2 sessions, zero staff and zero access requests. All source envelopes and payloads matched exactly after current-record proof readback. Zero staff/request claims were correctly generated.

The local representation adds **one explicitly synthetic coverage marker**, for 31 current records. The verifier read one local manifest and four local page batches, covering 16 proof pages. The manifest measured 9,611 bytes, and the maximum measured signed response was 34,677 bytes. No owner epoch was created or inferred; no source session was authenticated, refreshed, archived or issued. Private source rows and hashes stayed in memory. Source/target writes and live provider requests were all zero.

This dated checkpoint is not a fresh production inventory. The local bootstrap wrappers do not recover original source history. The receipt does not verify live Google permissions/durability, SQL collation, media, full schema restoration, off-device recovery or free-plan capacity.

## Remaining work and operating sequence

1. Resolve sustainable capacity and verified retained-history archival/segmentation before production activation. Rehearse future growth, bootstrap claim completeness/collation, epoch provisioning, cold configuration binding and current-record read cost. Do not remove records/history to fit a budget.
2. Bind renewable credentials and the real writer/runtime only under applicable external-action authority. Complete ordinary-editor protection, owner/API edit races, actual mid-script interruption/quarantine, independently expired leases and bounded genuine quota/rate-limit acceptance. Current v1 sandbox observations retain their earlier dates; v2 is uninstalled.
3. Integrate scheduler/worker maintenance and successful-login receipt handoff in the complete runtime assembly, then prove actual cookie/route/provider/reload behavior. This turn proves local adapter composition only.
4. Continue operations/publication/forms/private-media persistence and the full Studio OLDWEBSITE workflows, research workers, real editable Slides/PDF output, actual media/data migration and complete recovery. Existing preserved products only; no archived catalogue import.
5. Complete real provider/browser, concurrency, failure, performance and responsive verification, then prepare the authorized release. GitHub publication, migration/cutover, production release and resource retirement remain separately reported actions.

No push, PR change, merge, deployment, provider configuration change, production write, authority switch or resource removal occurred. Vercel, SQL, Blob, Google resources, encrypted recovery evidence and OLDWEBSITE remain retained. The Codex cloud environment remains unpublished. No Phase 0–11 completion is claimed.
