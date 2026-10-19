> **Final continuation, 19 October 2026:** [PENDING-FINAL-REPORT.md](PENDING-FINAL-REPORT.md) and [pending-final-verification.json](pending-final-verification.json) record the owner-approved production request-table repair and successful live queue refresh, the final pagination accessibility correction, and 34 additional real browser/HTTP lifecycle checks. They supersede earlier open request-table, pagination-ARIA and framework-adapter-only statements. Source release and external provider/device/native/field acceptance remain separate. The historical results below were not rerun or silently upgraded by this continuation.

# Workflow, security and privacy audit

**Latest continuation — 19 October:** [PENDING-COMPLETION.md](PENDING-COMPLETION.md) and [pending-verification.json](pending-verification.json) supersede the previous translation-transfer and disposable-service-lifecycle pending statements. They include the renewed-session production request failure, fresh tests and exact remaining gates. Results below retain their original date and scope.


> Final status authority: this document retains the dated 17 October source/before review. The 19 October coordinator sections and [FINAL-VERIFICATION.md](FINAL-VERIFICATION.md) provide the final candidate results; [SECURITY-RELEASE-REVIEW.md](SECURITY-RELEASE-REVIEW.md) covers later dependency patches. Earlier source-only requests and issue labels below are not new current passing or open-test claims.

Audit date: 17 October 2026. Source baseline inspected: `66e82ef04f76b8460654bab4329ccbadfb47f28e`, with the existing local cinematic acceptance changes preserved. This document is a source-and-contract audit, not a penetration-test certificate or an assertion about current production database privileges.

The current architecture preserves the intended journey: discover a published piece or choose a custom brief, validate against its current schema, save the inquiry and private-reference associations, expose the saved receipt and Studio record, prepare a message from the saved snapshot, and let the customer explicitly open WhatsApp and press Send. No checkout, payment service or customer account has been added. No production writes, publications, role changes, migrations, exports or external messages were performed by this specialist.

## Evidence classification

- **Fresh source review:** the file locations below were inspected in this audit. They establish what the candidate implements, not that every production configuration is correct.
- **17 October before-fix isolated runtime:** root executed `tools/master-audit/workflow.mjs` against the guarded loopback environment. `test-results/rivya-master-audit/workflow-before.json`, timestamp `2026-10-17T05:29:57.200Z`, records **48 passing checks**, successful exact-ID cleanup, and unchanged fingerprints for **21 tables / 2,657 original rows**. Two operational defects were reproduced as observations; the overall harness pass does not close those findings. Session idle timestamps and rate-limit metadata are excluded from the protected-row comparison; identity sequence advances are not reset.
- **Historical runtime:** the October 16 acceptance checkpoint records 350 unit, 403 built-server and 12 preflight tests, protected-row comparisons and Studio reads. These are historical evidence until the current audit reruns the relevant checks. In particular, the built-server suite predominantly tests fail-closed unavailable-storage and anonymous-access boundaries; it is not a successful inquiry integration test.
- **Blocked provider evidence:** the safe local harness rejects a remote Blob token. Metadata authorization tests cannot certify real private upload, provider byte retrieval or deletion. Production write tests remain prohibited.

## Journey and trust boundaries

| Step | Actual implementation | Fresh source conclusion | Runtime evidence required |
|---|---|---|---|
| Published catalogue selection | `src/lib/published-source.ts:15`, `publication-read-query.ts:3`, `shop-catalogue.ts`; only visible published documents enter public projection | Source candidates are not used as a public fallback. The cross-request cache validates a fresh publication digest and fails closed on errors. | Public route checks plus current published-product inquiry test |
| Customization schema | `src/lib/inquiry-definition.ts:7`, `brief-validation.ts:14`, `order-input.ts:7` | Required/conditional fields, allowed field names, repeated fields, request kind, product revision, consent version and bounded payload are validated on the server. Hidden conditional answers cannot be submitted silently. | Current valid/invalid form tests; full browser keyboard/error audit is recorded separately |
| Guest form identity | `src/lib/request-security.ts:5`, `api/inquiry/session/route.ts:6` | A random 256-bit browser token is an HttpOnly, Secure production, SameSite Strict, host-only cookie. Only its HMAC is stored; request keys alone do not grant receipt access. Cookie and session lifetime are 24 hours. | Correct guest succeeds; other guest and anonymous receipt requests fail |
| Core save | `src/app/actions/inquiry.ts:13`, `src/lib/order-persistence.ts:6` | The session is locked before checking references/product/business versions. One transaction finalizes the session, inserts order/inquiry, links references and records the first event/audit entry. No WhatsApp work precedes the committed save. | Concurrent same-key commits yield one inquiry and one initial event; stale product version rejected |
| Retry/recovery | `src/app/actions/inquiry.ts:21`, `order-handoff.ts:18` | Exact owned payload hash recovers an existing save. A changed retry cannot replace the original brief. Lost-save response is distinguished from message failure; message attempts are bounded and ready messages are immutable. | Duplicate race, pending-to-ready and repeated ready preparation checks |
| Saved receipt | `api/inquiry/receipt/route.ts:6`, `app/inquiry/received/page.tsx:8` | Guest identity + key + age + non-erased record are required. API is no-store, no-referrer and noindex; receipt page declares no-referrer. Expiry does not claim inquiry deletion. | Guest receipt success, anonymous denial and saved reload checks |
| Studio access | `api/studio/workspace/route.ts:23`, `api/studio/orders/route.ts:30` | Admin or current assignee predicates scope inquiry data, notes, references, events and list queries. Response removes the internal full saved record before serialization. Manual records are admin-only. | Assigned/unassigned editor contrast; direct endpoint tests |
| WhatsApp preparation | `order-handoff.ts:41`, `src/lib/whatsapp.ts:3`, `shop/saved-order-actions.tsx:10` | Current business destination and version are checked again. Private image URLs are excluded. Long URLs fall back to a reference message and require full-summary copying. Opening occurs only in the explicit button handler; no message is sent by the website. | Receipt GET without `open=1` has no link; generated URL inspected locally; no actual WhatsApp navigation |
| Operational change | `api/studio/orders/route.ts:116`, `api/studio/workspace/route.ts:93` | Stage, amendment and assignment updates use versions, record access predicates and erasure checks. Closing or moving backward requires a reason. Amendments append evidence without replacing the original message. | Stage update succeeds; stale version conflicts; original message stays unchanged |

## Authentication, recovery and authorization

`src/lib/studio-auth.ts:23–86` uses scrypt for password verification, timing-safe comparison, random session tokens, hashed session storage, eight-hour absolute expiry and 30-minute idle expiry. Credential version, active state and role are resolved together. Staff changes invalidate sessions through the version check; recovery also deletes that staff member's previous sessions. Owner credentials remain hosting-managed.

The public login action applies durable per-network and normalized per-identity throttles (`src/app/studio/login/actions.ts:16`). Network identities are HMAC-derived, not raw addresses in application rate-limit keys. `studioConfigured()` fails closed when required configuration is missing. Error responses avoid echoing passwords or database errors.

Every discovered mutating Studio API route checks `originAllowed` and authenticates staff before business mutation. Admin-only branches cover publication/hiding, business/site settings, staff administration, access approval, privacy/erasure, cleanup and private exports. Editors may author drafts and operate only assigned inquiries. Next Server Actions rely on the framework's same-origin protection in addition to the application cookie; HTTP API mutations explicitly reject absent or mismatched Origin. The helper allows equivalent loopback hostnames only when scheme and port match (`src/lib/request-security.ts:18`).

Registration/recovery keeps the administrator-assisted flow selected by the owner (`src/lib/studio-access.ts:16–82`):

- A public request receives a generic acknowledgement and creates no usable account.
- Only an administrator may decide it; the HTTP approval requires explicit identity verification.
- New accounts start disabled with an unknown random password and editor role.
- The one-time link is stored as a hash, expires after 30 minutes, and is bound to the staff credential version.
- Redemption locks request and staff rows, consumes the request, changes the password, increments the version and revokes sessions.
- Recovery cannot reactivate a disabled account or reset the hosting-managed owner. Neither a caller-selected role nor an automatic email path exists.

The source and migration files are not evidence that `rivya_access_requests` and its grants are active in production. The repository's current checkpoint explicitly leaves production activation separate. The audit should report the actual fresh Studio response when available, without applying setup SQL.

## Private and editorial media

Customer uploads (`api/inquiry/reference/route.ts:12`) accept only still JPEG/PNG/WebP, stream-limit input to 3 MB, cap decoded pixels at 20 million, compare decoded format to declared type, reject animation, rotate/resize and re-encode to JPEG. Re-encoding avoids carrying original metadata into the served derivative. Reservations, per-form slots, byte quota, payload digests and write leases protect retries and link races. Uncertain storage writes retain reservations for later confirmation; cleanup does not release quota before confirmed deletion.

`src/lib/reference-storage.ts:4–19` validates its storage-key namespace and uses private Vercel Blob access. `api/studio/references/[id]/route.ts:5–11` authorizes before obtaining a stream, requires a ready linked reference and current admin/assignee access, and returns JPEG with no-store, nosniff and a sandbox policy. The customer message contains only the count of saved private images. Reference IDs or storage paths do not become public media records.

Editorial media is a separate review path (`api/studio/editorial-assets/route.ts:13–51`). Files are written privately, originals and derivatives are immutable, and public eligibility depends on the current reviewed published media record. Failed partial processing does not publish the files. Source review found no public fallback to draft editorial bytes. Local editorial storage is explicitly restricted to the exact loopback QA harness (`src/lib/local-editorial-store.ts:4`).

**Limit:** no isolated private Blob store is available in the current safe harness. The new integration script deliberately labels its reference row as metadata-only. It tests ownership and denial; it does not claim that an image was uploaded or that provider deletion succeeded.

## CMS, rich text and language integrity

Content publication (`api/studio/content/route.ts:33–104`) requires administrator role, a saved current draft/version and a dependency snapshot without issues. Dependency fingerprints are rechecked in the publication statement. Saved revisions and audit entries are created atomically with changes. A restore is a new draft, not a silent rollback of public content. A saved revision identifier must exist. Product and media writes similarly use version checks; editor publication is refused at the API boundary.

The active editorial text format (`src/lib/editorial-body.ts:1–18`) accepts bounded text-only paragraph/quote runs with safe local links. Tiptap support separately validates node/mark/attribute lists, depth and size (`content-richtext.ts:51`). `components/content-richtext.tsx:8` renders React nodes, not stored HTML. The one raw-HTML rendering use discovered is structured-data JSON; `<` is escaped in `shop/structured-data.tsx:6`. No executable user HTML path was identified in the inspected renderers.

Hindi/Gujarati text is applied only when the complete document translation matches its reviewed revision; missing, incomplete, stale or unreviewed content falls back to English (`translation-review.ts:29–51`, `content-model.ts:106`). Imports accept editorial fields only and reject protected identifiers/destinations. The review marker is explicitly a deterministic change detector, not a signature or independent native-language certificate. The Studio UI tells staff to record named meaning-review evidence separately. No human review was invented by this audit.

## Retention, erasure and exports

The current retention calculation (`retention-policy.ts:6`) implements the documented policy: unconverted inquiry after 90 days from meaningful contact; accepted-order personal data one year after closure; accepted-order references 90 days after closure. A hold, ongoing requested follow-up or open accepted order blocks eligibility. Holds do not auto-expire at their review date. This describes implementation, not legal advice or independent compliance certification.

The admin privacy endpoint validates current versions, request/identity evidence, dates and holds (`api/studio/privacy/route.ts:25`). Erasure first atomically anonymizes customer-bearing fields, clears notes/event reasons, revokes guest/assignment access, marks references deleting, records a ledger and invalidates managed-export metadata (`erasure-execution.ts:25`). Provider deletion is separately retried; inaccessible rows and quota remain until confirmed deletion. This avoids claiming completion after an uncertain storage operation.

Downloaded CSVs cannot be remotely erased by the site. Export metadata records a seven-day deadline and invalidation; operator handling of downloaded files remains a real operational responsibility. The current erasure service invalidates all managed-export metadata conservatively. For that reason the audit does **not** run it against the reused QA database containing original protected rows. Full erasure/provider and restoration-replay testing needs a wholly disposable database/store, not just a new inquiry within a shared fixture database.

The runtime-grant scripts are explicit operator tools, not build steps. Their least-privilege intent and narrow erasure grants were inspected (`scripts/phase11-runtime-grants.sql`, `scripts/p7-erasure-runtime-grants.sql`, `scripts/studio-access-runtime-grants.sql`). Actual production ownership, inherited roles, grants and provider policies have not been inferred from those scripts. Removed backup generation/tooling remains out of scope; existing privacy-erasure replay source is preserved.

## Reproduced issues and decisions

No P0 or P1 security defect was established by this source review and focused runtime pass. This is not an assurance that no such defect exists. Two operational issues were reproduced through the actual local HTTP endpoint and are **VERIFIED_OPEN** pending a narrow fix and fresh regression checks:

| ID | Candidate | Evidence and reproduction | Priority | Safe remedy |
|---|---|---|---|---|
| SEC-OBS-01 | Follow-up-only note implies reassignment | `api/studio/workspace/route.ts:127` sets `body.assignee` to the actor for `follow-up`; line 134 preserves the actual assignee, but line 137 records `Assignment updated. Staff: <actor>`. The local test changed a date as a different administrator and confirmed that the note named that actor while the stored assignee remained unchanged. | P2: operational history accuracy; VERIFIED_OPEN | Separate date-change wording from assignment-change wording; preserve actual assignment. |
| SEC-OBS-02 | Invalid calendar date reaches PostgreSQL and is reported as service failure | `api/studio/workspace/route.ts:128` checks shape only; line 134 casts to date. The local test submitted `2026-02-30` with a valid current version and received **503**, rather than actionable **400**. The stored version remained unchanged. | P3: validation feedback; VERIFIED_OPEN | Validate actual calendar dates before the write, consistent with the existing order filters. |

Evidence for both observations is the `observations` array in `test-results/rivya-master-audit/workflow-before.json`. The root audit owns independent review, any narrow app fix and fresh post-fix tests. No new business policy, schema, feature or design direction is recommended from this pass.

## Required integration evidence and remaining gates

The 17 October before-fix focused script created only random, explicitly fictional records and used exact-ID cleanup. Its 48 checks covered custom and published-product saves, concurrent duplicate commit, stale product revision, pending/ready message states, guest receipt ownership, manual-link boundaries, admin/editor authorization, Origin rejection, version conflicts, access approval/recovery and session expiry. It also checked three pure retention-policy cases. Cleanup removed two synthetic orders, three staff fixtures, two access requests and one metadata-only private reference. The original protected-row SHA-256 remained `602d1ef7ebe0853927308b6ccd3faf450870c64f4fba3f4ec60ed5a1edb4b38d`. No WhatsApp message was sent or opened.

Fresh full public browser form submission, optional uploads, all role/record permutations, real private storage bytes/deletion, a fully disposable erasure/replay cycle and production setup/privilege verification remain distinct. Passing unit validation or the missing-storage HTTP suite must not close those gates. Current root-run results and exact command outcomes belong in `FINAL-VERIFICATION.md`; provider/device/human limitations must remain visible in the executive summary.


## Final coordinator verification

SEC-OBS-01 and SEC-OBS-02 are VERIFIED_FIXED locally: final workflow.json (2026-10-19) has 55 passing assertions, including year-zero rejection, and successful cleanup. Original audit-start to final post-patch protected snapshot: all 13 scopes / 1,658 records identical. Within-run 21-table preservation also passes; authentication bookkeeping/sequence advances are excluded. Do not compare the two different 21-table aggregates as a start/end business-data certificate; the 13-scope snapshot provides that evidence.

**Production exception discovered after the 37-opening survey:** Staff account/password request panel reports unavailable (PROD-ACCESS-01,P1,VERIFIED_OPEN). Login worked in the observed 17 October session. Generic 503 does not establish whether schema/grants or another storage failure caused it; a scoped runtime-log query was empty. No production SQL/write was run. Read-only diagnosis is already authorized. An actual production repair or write requires fresh authorization. No private session was available for a 19 October recheck. Provider byte/deletion and full destructive erasure/CMS rollback matrices remain explicitly blocked/deferred.
