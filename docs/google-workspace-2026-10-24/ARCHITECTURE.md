# Active continuation — 28 October 2026

Read [the refreshed Netlify free-first checkpoint](../netlify-free-first-2026-10-28/CURRENT-STATE.md) and its latest owner brief first. Netlify is live at www.rivyalivingart.com on 7b390d5; PR #71 remains draft and production is locked to the migration branch. Continue locally on codex/netlify-free-first, preserving the migration commits. Sheets/Drive is the preferred target with a conditional, justified ongoing-free database exception. The Google replacement, migration, full Studio parity and release acceptance are incomplete. Historical completion claims below are dated and superseded; simulation receipts do not certify providers, backups or production. Preserve public/login design, records/media, credentials and OLDWEBSITE. Add no products and import no archived catalogue. No production migration, publication, credential rotation or old-resource deletion has occurred in this continuation.

---

# Current continuation — 26 October 2026

Read [the Gemini/Antigravity handoff checkpoint](ANTIGRAVITY-HANDOFF-CHECKPOINT.md), [sanitized verification](antigravity-handoff-verification.json), [complete continuation prompt](CONTINUE-IN-GEMINI-ANTIGRAVITY.md) and [local/offline runbook](LOCAL-OFFLINE-RUNBOOK.md) first. Continue the existing `codex/google-cloud-acceptance` branch and open PR #67; do not reset to main or provision another sandbox. Fresh connected Drive/Sheets reads succeeded with zero writes. The new portable populated-state audit is locally verified; its full live run requires the original private registry, reviewed baseline and secure runtime OAuth binding. Earlier real writer/protection/deployment evidence remains dated; eight acceptance groups and phases 3–11 remain open. Source PR publication is authorized; a main merge can trigger Vercel production and retains the explicit later-release boundary. The existing production provider stays authoritative.

---

# Sheets and Drive transition architecture

This is the target design and the boundary for the local foundation. It is not a deployed provider. Current authority remains the existing application storage. The approved public rendering and login files remain unchanged.

**Phase 2 implementation update:** the controlled writer, signed Apps Script gateway source, Drive document/REST provider, coherent publication contract and durable job/canonical adapter now exist and pass local tests. See [the checkpoint](PHASE-2-CHECKPOINT.md). The earlier future-tense descriptions below are the original target contract, not a claim that the source is still missing. Real Google activation and account acceptance remain pending. The owner authorized PR/main publication after local completion; the [target plan](ISOLATED-TARGET-PLAN.md) and [Cloud prompt](CONTINUE-IN-CODEX-CLOUD.md) retain separate external authorization boundaries.

The server reads and validates a complete bounded snapshot; the remote gateway then acquires one ScriptLock, rereads every canonical/dependency guard and commits only if they still match. It writes an inflight control marker before the one atomic record/ledger/audit/history/committed-marker batch. Unconfirmed dispatch fences that workbook; an unchanged immediate read is not proof of failure. Worker deadlines are admission checks under the same lock, and uncertain CAS aborts suppress replacement/cleanup writes. Direct owners or unrelated clients can bypass a script lock; protections and reconciliation remain mandatory. Slow Drive/media processing runs outside it.

Oversized documents use an immutable registered Drive JSON reference with exact complete-payload bytes/hash and a separately hashed inline envelope. Two actual local oversized rows now round-trip in RAM. The REST multipart creation limit is 5 MiB; larger uploads reject until resumable support exists. Public bundles pin source/shell/design/approved assets together; ambiguous pointer outcomes remain unknown even if a read still observes the old pointer. These contracts do not switch current render/storage providers.

## Evidence and reusable contracts

The observed loopback schema has 28 tables, 230 top-level columns and 45 primary/unique/foreign-key constraints. `src/lib/google-workspace/schema.json` records those exact contracts; [data-dictionary.csv](data-dictionary.csv) maps every observed column; [migration-mapping.csv](migration-mapping.csv) maps each source entity. These are observed QA schema contracts, not a production export. Nested product/content documents remain intact and are validated by existing domain validators during provider integration; 230 is not a claim to count all nested fields. Existing Phase 3 mappings of 45 legacy entities/566 fields/48 relationships are retained as separate historical source-contract evidence. Deleted old records remain unavailable.

Reuse `DependencySource`/`PublishedSource`, content/shop validators, editorial media and extension models, subscriber query/CSV behavior and current version checks. Do not reinterpret a website presentation editor as a catalogue generator, or a scraper registry as a working crawler.

## Workbooks and access boundaries

Proposed isolated resources (not created):

| Workbook | Existing data | Authorized application use | Direct Sheet editing |
|---|---|---|---|
| Rivya Workspace Sandbox — Content | Existing catalogue, content/site copy, media register, presentations, extensions, settings and revisions | Scoped content editors; publisher role for public activation | Separate input tabs; immutable IDs/canonical ranges protected |
| Rivya Workspace Sandbox — Operations | Inquiries/orders, notes, private references/upload leases, privacy/erasure records, subscribers, managed exports and storage budget | Authorized staff, with assignment restrictions and administrator-only exports | Owner-approved staging inputs only |
| Rivya Workspace Sandbox — Security | Staff identities/credential hashes, sessions, throttles and access requests | Dedicated server authentication writer; owner administration | No ordinary editor access; no plaintext credentials |
| Rivya Workspace Sandbox — System | Historical audit, migration markers, source crosswalk and field conflicts | Restricted migration/operator access | Review decisions only, through validated commands |
| Future Research / Catalogues / Jobs | New source observations, template/job selections and durable worker state | Least-privilege workers and corresponding Studio roles | Explicit review/input tabs only |

The first four workbooks reflect actual source access boundaries. Logical catalogue/site/editorial modules can share the Content workbook without imposing extra cross-workbook transactions. Jobs for sensitive operations must stay in the matching confidential boundary or contain opaque references only. New audit/revision/idempotency tabs are co-located with each record mutation; historical global audit can remain in System. Any aggregate audit mirror is derived and never substitutes for the atomic mutation receipt.

Hidden tabs and protected ranges are not confidentiality controls. Separate workbook sharing provides confidentiality; canonical range protection and a single writer prevent ordinary direct edits. Owners and unrelated API clients can bypass script locks, so direct canonical editing is unsupported. A detected canonical digest/version mismatch blocks a write and requires reconciliation. The existing catalogue workbook is a separate reuse artifact and will not be converted into an application database or imported wholesale.

## Records and typed values

The initial canonical envelope uses `record_id`, `revision`, `payload_json`, `payload_sha256`, `source_updated_at`, `archived_at` and `last_mutation_id`. The envelope revision is independent from original source document versions, which stay in the payload. Stable IDs are derived from the source table and typed primary-key tuple; every original primary key, slug, price and relationship is preserved in the payload. Row numbers are only transient locations resolved under a write lock.

All cell writes use explicit `stringValue` or `RAW`. IDs, dates, decimal strings, formulas-as-text, multilingual strings, nulls and booleans are preserved without Sheets locale conversion. Bigint source columns become exact decimal text. The rehearsal rejects unrepresentable JSON numbers instead of rounding them. Unknown columns, unmapped tables, duplicate keys and broken foreign keys fail validation. No product creation or archive ingestion is performed.

The codec rejects oversized JSON at a conservative 45,000-character cell boundary. Such records require immutable Drive JSON artifacts with registered file IDs and digests; that spillover path is still to implement. It never truncates records. The baseline rehearsal reports any actual blocked record. Canonical JSON hashes provide integrity and conflict detection, not encryption or access control.

The local mutation planner requires an authorization function supplied by trusted server code. It checks expected revision and idempotency intent, then returns the record, local audit event and durable receipt for one future workbook batch. Same-key/same-intent retries return the original receipt; a changed intent or stale revision is a conflict. This pure planner does not provide concurrency safety alone: the real writer must read, validate and commit under its lock with a single atomic Sheets request. No live mutation endpoint exists in this checkpoint.

## Writer, direct input and durable jobs

The future controlled writer must authenticate the server, bind actor/operation/resource/revision/idempotency into the signed request, enforce authorization and resource allowlists, acquire the shared script lock, read current state and prior receipt, validate values/references, commit the record/history/audit/receipt atomically, then release. Slow media/scraping/rendering never holds this lock. Never enable a browser-callable write URL with an embedded signing secret. Secrets stay in server/script configuration; Google access tokens are never stored in business Sheets.

Input tabs carry stable source ID, expected revision, proposed fields, reviewer and validation state. A direct Sheet edit is a draft proposal. The import/publish operation verifies it and records conflicts; it does not overwrite populated canonical values automatically. Formula presence must be audited separately because a values-only read cannot prove that a displayed number was not produced by a formula.

Jobs require ID/type/input revision/state/lease owner/lease expiry/fencing revision/checkpoint/attempt count/next retry/cancel request/output IDs/error code. Their state persists in Sheets and large artifacts in Drive. Claim/renew/finish/cancel are writer commands; an expired worker cannot finish after a newer fencing revision. Deterministic output identity and saved checkpoints prevent duplicate PDFs/Slides after timeout. This job runner and deployed writer are future Phase 2 work, not completed by the pure planner.

## Authentication without changing the login

Preserve scrypt verification, hashed session/recovery tokens, roles and assignment scoping, account status and credential-version checks. Retain the actual login path's 40-per-IP and 10-per-normalized-login limits per 15 minutes across instances; 8-hour absolute/30-minute idle expiry; secure HttpOnly `SameSite=Strict` production `__Host-rivya-studio` cookie; single-use 30-minute recovery approvals. Provider failure denies access. A failed logout revocation must not misleadingly claim success.

Replace `studioConfigured()` and database-specific revoke guards only after the security provider is verified. Reauthentication at cutover is the proposed safest continuity rule; preserve the old hashed records through the recovery window and explicitly communicate the transition. Do not copy live sessions into ordinary content workbooks. No login UI/styles/fonts/wrappers are changed in the foundation.

## Drive and coherent public publication

Proposed private root: `Rivya Workspace Sandbox`, with `Originals`, `Derivatives`, `Private Attachments`, `Publication Snapshots`, `Catalogue Templates`, `Catalogue Outputs`, `Jobs`, `Recovery` subfolders. Supplied source folders remain intact. Reuse the selected 169 images and all 507 exact WebP renditions; originals, provenance, personal-detail caveats and genuine association requirements survive migration. The existing source Drive ID is provenance and is not automatically the storage ID of a newly managed derivative.

Delivery keeps the existing application routes. A public rendition must appear in the pinned public manifest; a private attachment needs a current authorized request/assignment. Resolve a registered application asset ID to its approved Drive ID, MIME, size and parent boundary. Never expose an arbitrary Drive-file-ID proxy. The new read transport rejects unconfigured resources, redirects, oversized bodies and malformed responses and sanitizes provider errors; application authorization still belongs to the server route.

A publication bundle contains one immutable version of source content, shell/copy/navigation, design/presentation and approved public assets. Compile explicit public projections using existing validators, exclude drafts and private/security/operations data, verify all assets, write the immutable Drive snapshot, and only then advance its active pointer by expected revision. Each request pins one pointer/bundle and derives every component from it. Failed publication leaves the prior valid pointer intact. Provider errors do not authorize serving a draft or falling back to the former database after cutover. A bounded cache contains only rebuildable published bundles and obeys explicit invalidation; security decisions do not rely on stale content caches.

## Migration, recovery and operating limits

Read a consistent source export, map every entity/field and logical relationship, preserve populated destination values and versions, stage conflicts, verify exact row hashes/identities/publication state/media and record each disposition. The included loopback rehearsal encodes and decodes existing records only in RAM; it does not create Sheets, write products, or migrate production. No local file becomes a canonical data backend. Auth, logical JSON relationships, actual Drive files and real concurrent writes require their own rehearsal.

Before cutover, capture a recovery checkpoint and final delta while affected writes are paused or journaled. After switching authority, every new write belongs to Sheets; recovery must replay those writes before any replacement can serve traffic. Retaining the former database is permitted and prudent. Deletion is a separate destructive decision. No cutover or release is authorized by a local test result.

At the documentation check, Sheets published 300 read and 300 write requests per minute per project, with 60 of each per user per project, and recommended payloads at or below 2 MB. Quotas can change. Batch within a workbook and use bounded backoff; measure actual account latency, concurrent editors and login load before activation. Apps Script execution/runtime/daily quotas depend on account type. A passing mocked transport does not measure any of these. See [Google Sheets limits](https://developers.google.com/workspace/sheets/api/limits), [batch guarantees](https://developers.google.com/workspace/sheets/api/guides/batch), [LockService](https://developers.google.com/apps-script/reference/lock/lock-service) and [Apps Script quotas](https://developers.google.com/apps-script/guides/services/quotas).
