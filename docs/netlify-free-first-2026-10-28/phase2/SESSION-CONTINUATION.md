# Session lifecycle continuation — 29 October 2026

Candidate parent: `0745c954bd4167b388a133ba80d4100ef2e8b3e7`, branch `codex/netlify-free-first`. The owner explicitly requested completing session creation, validation and refresh, then continuing pending work with all changes local. This checkpoint adds local implementation and verification; it does not activate Google storage, provision credentials, migrate production data, publish code or change the public/login presentation.

## Session creation, validation, refresh and revocation

The [bounded session store](../../../src/lib/google-workspace/bounded-session-store.ts) and [token service](../../../src/lib/google-workspace/bounded-session-service.ts) implement the session lifecycle through the guarded canonical Security writer. The existing [Google security adapter](../../../src/lib/google-workspace/security-adapter.ts) accepts that lifecycle explicitly as its third constructor argument and delegates its three session methods. A persistent store without the atomic lifecycle now fails closed instead of using the older split read/update operations. The old session model remains available only to the explicitly named in-memory test simulation.

The actual source session payload has exactly `token_hash`, `credential_version`, `expires_at`, `idle_expires_at` and `staff_id`; it has no `created_at`. Its canonical identity derives from the existing token-hash primary key, and `sourceUpdatedAt` stays null. Staff retains its original UUID and actual created-at-only source metadata. No source field or identity is invented to match the older simulation interfaces.

Creation generates 32 cryptographically random bytes and sends only the token hash to storage. An explicit server-authenticated owner/staff identity is required; a missing identity does not implicitly grant owner access. Staff activity, credential version, login and role are verified again against guarded current records at commit. A raw token returns only after a confirmed new commit. Lost or late responses produce an unknown outcome and no token; the code does not retry by generating a replacement token. Any uncertain orphan remains inaccessible to the client and subject to its original expiry.

Absolute expiry remains eight hours, idle expiry thirty minutes. Validation and idle refresh form one guarded session mutation with the current staff record or owner epoch included as a guarded relationship. The lock-time deadline uses the OLD idle/absolute expiry, so an expired session cannot extend itself while waiting. Idle extension never exceeds absolute expiry. Even an unchanged wall clock/idle value requires a new guarded revision; a read-only shortcut cannot grant stale authority.

Each refresh attempt includes a new internal nonce. Repeating a caller operation ID therefore performs a new current-state decision, not historical authentication. A provider replay response is receipt-only and never supplies an identity to the token service. Staff disable, credential-version change, revoked session or owner-epoch mismatch denies access. A concurrent role change may safely retry and return the newly guarded role, never the earlier role.

Revocation archives the existing session record and retains its payload/history. Archived token identities cannot be recreated by retry. Missing/already archived sessions are idempotent no-ops. Up to four explicit no-write conflicts may retry; unknown outcomes do not. Reads, policy checks, retries, commits and final receipt checks share one monotonic budget, capped at thirty seconds. Inputs are captured before the first asynchronous yield and policy callbacks receive detached views.

## Owner credential epoch and integration boundary

Owner credential fingerprints use the existing HMAC derivation over the exact owner login/password with the session secret. A private canonical record with exact payload `{format: 'rivya-owner-credential-epoch-v1', fingerprint}` must already exist at the explicitly registered Security record ID. Its source/archived metadata are null. The store guards this record during owner creation/refresh; a stale warm worker cannot accept its old fingerprint after the canonical epoch changes.

This code neither creates that record nor rotates credentials. Provisioning/readback, secure runtime binding, coordinated future rotation and real provider acceptance remain pending. The token service's fingerprint also binds it to the existing adapter's configured owner credentials; mismatched configurations fail before session operations. The internal lifecycle object, fingerprints, staff/session envelopes and permission callbacks must never be serialized into browser output or logs.

The implementation is connected to the adapter's session methods but **not selected as the application's runtime provider**. SQL/Blob remain authoritative. Full staff authentication lookup, access approval/redemption integration, business audit, expired-session retention/archival and successful-login throttle reset remain separate work. Unlike the existing SQL maintenance path, this slice does not bulk-delete expired sessions or delete the owner throttle counter. History growth and the bounded manifest's hard limit remain explicit capacity gates; per-request session mutations have not been benchmarked against real Google latency/quotas.

## Continued pending work: security lookups

The source has three expression/partial uniqueness rules outside the current schema manifest: case-insensitive staff login (including disabled staff), open request by kind/login (pending or approved, even if expired), and every non-null access-token hash. Source sessions, staff IDs and request IDs need no secondary lookup because their primary keys already determine their canonical IDs.

The new [projection planner](../../../src/lib/google-workspace/security-lookup-projection.ts) prepares pointer-only claims and a coverage marker from complete supplied staff/request arrays. It checks those uniqueness rules and relationships without copying passwords, roles or request state into a second authority. Unsupported/non-ASCII source logins fail for explicit reconciliation. Even the supported ASCII lowercase model requires actual SQL normalized-key/collation reconciliation before bootstrap; source collation is not captured by the schema manifest. The planner produces an uninstalled proposal, not proof of live source completeness or installed target coverage.

The [bounded lookup reader](../../../src/lib/google-workspace/bounded-security-lookup.ts) requires a trusted registration binding the exact Security layout, provider root cursor and marker payload hash. It reads claim/source proof pages against the same root, verifies the source's actual key binding, and authorizes before IO and after guarded readback. Returned internal source rows are not authentication grants. Missing claims can mean not-found only within that explicitly registered coverage.

Until atomic index maintenance is implemented, ANY root change invalidates coverage, including unrelated session writes. This is deliberately unsuitable for runtime activation. Staff/request mutations must update their source record and lookup claims in the same transaction; the earlier two-record redemption primitive would need token/open-claim tombstones in its atomic group. No detached projection job, stale marker or bare ready flag may substitute for that contract.

## Verification

The supported Node 22.23.2 combined session and related suite passed **126/126** tests. It includes 12 focused store cases, 16 independently written adversarial cases, 10 token-service/adapter cases, existing security/throttle compatibility and bounded store/job/access/provider-selection regressions. The first independent run used Node 24 and is not counted as supported-runtime evidence; all sixteen cases were rerun successfully on Node 22. Tests execute the saved Apps Script source in a local emulator, with explicit fault injection; they do not prove real Google durability or permissions.

At 04:45:44 UTC, all **1,198 protected source files** still matched the retained hashes. No full application build, new browser journey or real-provider session action has been claimed from this inactive storage change. Whole-project TypeScript, targeted ESLint and patch checks passed. The final combined run passed **138/138** tests, including all twelve lookup cases. This total includes fifty new session/lookup tests; repeated independent runs are not counted again.

The final 04:54:34 UTC preservation/privacy check covered all 19 changed files: zero matches against seven retained private endpoint/key/workbook values, all 340 checked local Markdown links resolved, and all 1,198 protected files still matched. This is a limited exact-value scan, not a general guarantee against arbitrary sensitive text. Private evidence remains ignored under `test-results/`.

## Actual checkpoint lookup rehearsal

The [aggregate receipt](security-lookup-rehearsal.json) completed at **2026-10-29 04:52:05 UTC** using the retained encrypted checkpoint created on 28 October. Authenticated decryption and reconciliation covered its **22 tables and 3,455 rows**. The actual checkpoint contains **zero staff and zero access-request rows**, so its correct plan has **zero lookup claims**. No source rows were invented to populate those lists. Non-empty uniqueness, race and malformed-proof cases are explicitly synthetic tests.

The receipt preserves its observed code hashes. It does not certify current live inventory or installed coverage: provider requests, source writes and target writes are all zero, and `lookupCoverageRegistered`, `providerVerified` and `atomicIndexMaintenanceImplemented` remain false. The only persisted new result is aggregate evidence; source rows, source digests and private projection objects are not exported.

## Remaining sequence

Finish atomic lookup maintenance and request/approval/revocation/audit integration before selecting a complete Google security provider. Continue operations/publication persistence, sustainable free capacity, the five real Google checks, actual data/media migration and complete recovery, Studio workflow parity, native Slides/PDF catalogue generation, and browser/failure/responsive verification. Release and resource retirement remain separate, with the owner's later authorization. Keep OLDWEBSITE, SQL, Blob and Vercel available; add no products or archived imports.
