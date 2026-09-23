# Phase 2 — Foundation and data architecture

Date: 23 September 2026. Implements P2.1–P2.7 of the approved master. This is its technical companion, not a replacement plan.

## Baseline and boundaries

The clean Phase 1 commit `3d720f313e90f98d1d8aab40e055eb4729afedfe` was merged upstream in PR #15 at `bdfd78fa08f5b7738df8d465326eb960147b9ac2`. The two commits have identical file trees. The former remote work branch no longer exists. Phase 2 continues on `codex/phase-2-foundation` from that merged baseline; no source was reset. There were no uncommitted drafts to snapshot. Existing ignored configuration, source drafts and database records are preserved.

This phase supplies architecture, typed contracts, an inactive bespoke registry, read-only inspection SQL and a proposed migration/runbook. No application route consumes the new contracts yet. No migration, seed, backup export, deletion, public submission, production deployment or paid service activation is part of this phase. Final integrated QA remains Phase 11.

## Current schema map

All table names below have the `rivya_` prefix. Source definitions and recorded migrations are reconciled with the environment observations in `phase-2-environments.json`; current row counts are observations only, never migration assumptions.

| Table | Current durable responsibility | Phase 2 contract / later change |
|---|---|---|
| studio_orders | UUID, client/title, eight-stage status, optimistic version, creation/update times | Keep same ID and stages; immutable customer brief remains in inquiries; new bespoke title comes from saved definition |
| studio_order_events | Identity PK, order FK, actor/from/to/version/time/reason | Preserve; initial NEW in the same save as order; later staff transitions only |
| studio_sessions | Hashed token, credential fingerprint/version, absolute/idle expiry, optional staff FK | Keep isolated secrets; session/role revocation proof in P7/P11 |
| studio_login_limits | Key, attempts, reset time | Preserve data; replace shared owner throttle in P7; no new PII logging |
| staff | UUID, unique login and case-insensitive index, name/password hash, role/active/version | Admin/editor only; no customer identity table |
| catalogue | Product ID; draft/published JSON; versions, visibility, author/time; slug indexes | Reuse published schema; snapshot field IDs and labels at submission |
| inquiries | Same-ID FK to orders; unique reference/request key; guest/payload hashes; product snapshot; customer/answers/notes/summary; assignee/follow-up/time | Add versioned request/schema/answer/evidence/message fields; product columns become nullable only for explicit v2 bespoke requests |
| references | UUID, guest/request/upload IDs, private unique path, bytes, inquiry FK, state/provider/time | Add normalized MIME and linked time, unknown for old records; new writes Vercel-only |
| inquiry_upload_sessions | Unique request UUID, guest hash, slots 0–3, finalized flag/time | Retain for both product and bespoke; lock ownership consistently during upload/save/cleanup |
| storage_budget | Singleton 1, reserved bytes | Preserve reservations through uncertain provider operations; not a provider quota guarantee |
| inquiry_notes | Identity PK, inquiry FK, actor/body/time | Private staff notes may include PII; included in deletion mapping |
| audit | Identity PK, actor/action/entity/time | Keep minimal opaque identifiers; no brief/message/contact data |
| content | Page/article kind; unique key/route; draft/live JSON; versions, visibility, author/time | Existing editorial scope; no inquiry snapshots in public content |
| public_media | Approved public path, draft/live metadata, version/author/time | Separate from private references and backup objects |
| business_settings | Singleton details JSON, version, author/time | Current business destination + version used at save and revalidated at every handoff |
| revisions | Composite kind/entity/version PK; document/actor/operation/time | Editorial historical data; never copy customer briefs here |

The existing `storage-provider-schema.sql` permits a historical Netlify value, while the runtime provider type accepts only Vercel. Preserve the migration receipt; the proposed extra Vercel-only constraint rejects new/updated non-Vercel rows. Inventory and resolve any historical provider rows before validating it. Never relabel or delete them blindly.

## Version 2 saved brief

`src/lib/order-contract.ts` defines the future application boundary; `scripts/phase2-order-contract.sql` is the matching proposed DDL. Contracts are specifications, not runtime validators.

- `contract_version=1` means the existing record format, including any old writer used during a controlled transition. Existing answers and text are untouched. Consent/destination/schema evidence that was never recorded remains null/unknown. `legacy_unverified` describes missing handoff evidence, not a sent message.
- New server code must explicitly write `contract_version=2`. `request_kind` is product or bespoke. Products retain ID and complete product snapshot; bespoke has null product ID/snapshot and schema ID `bespoke-piece`, never a fake catalogue product.
- `schema_id`, positive `schema_version` and `schema_snapshot` preserve the accepted definition, including field order, IDs, labels, option labels, units, conditions and bounds. Product schema ID is `product:<product ID>`; its version is the accepted published product revision.
- `answer_snapshot` is an ordered array, keyed by stable field IDs: text string, selected option plus display label, or finite number plus unit. The server checks unique IDs, visibility, required fields, exact option membership and bounds. Optional absent answers are omitted; empty optional numeric input is not zero. Existing label-keyed `answers` can retain a compatibility projection, never the v2 authority.
- Store `submission_source='website'`, server-resolved pathname without query/referrer, consent-text version and server acceptance time. A versioned consent copy must exist before enabling the v2 writer. Do not infer acceptance from old timestamps or request booleans after the fact.
- Customer name/normalized phone/optional email and notes use the existing columns. Message rendering includes all accepted data without silent truncation. `reference_count` is the count linked in the core transaction, not a client promise.
- Retain the existing unique request key and guest/payload binding. Canonical hash input in P6 includes schema identity/version, normalized accepted answers, customer fields, notes, reference IDs and consent version. Reject duplicate scalar form keys and non-declared fields before hashing; preserve Unicode and meaningful whitespace rules.
- There is deliberately no FK from the historical product ID to deletable current catalogue content. Original snapshot survives product hiding/archival.

## Transaction and message-finalization decision

Retain the installed Neon HTTP adapter in `studio-db.ts`; do not add an ORM, paid queue or WhatsApp API. Keep dependent core operations in one parameterized SQL statement with data-modifying CTEs. Use the existing driver transaction facility only for a prebuilt batch that does not need JavaScript to consume intermediate results. No sequence of independent writes can replace the atomic core.

**Stage A (P6):** resolve and validate the current published schema, guest, payload and owned ready references. Lock the request session and selected references in a consistent order, reject concurrent unselected pending/ready reservations or reconcile them explicitly, then insert order, inquiry, snapshots, initial history/audit and reference links atomically. All new inserts start `handoff_pending`, empty stored `summary`, approved destination/config version and chosen renderer version. Lock/check the catalogue published revision in the same statement to avoid a publish-after-validation race. Bespoke versions are immutable code registry entries.

**Stage B (P6):** read the committed record by UUID under guest/staff authorization. Render using its stored template version, schema/answer/customer/reference snapshots. Compare-and-set update from pending/failed to ready with summary/finalized time, without altering the business status. Concurrent render attempts are safe because inputs are immutable and rendering deterministic. A ready row returns the persisted winner. A failed attempt may update failure metadata only while the row is not ready; it cannot overwrite a successful finalization. Keep a bounded attempt counter/time and sanitized failure code. Do not log message text or raw errors.

Stage B is a synchronous, retryable operation after commit, not outbound sending. Retry resumes the same request; no extra Studio card. GET receipts remain read-only: P6 adds an authorized same-origin, rate-limited retry action. Success response/receipt state distinguishes saved-pending, saved-failed, saved-ready and core-save-unconfirmed. Never open a link or expose an empty `summary` while pending. Update all receipt/Studio readers before enabling v2 writes.

Pin and retain old renderer versions; never regenerate a ready historical message after template edits. Revalidate the stored destination against the current approved business setting before every open/reopen. If changed, disable that link until an admin records an explicit audited destination authorization; keep submitted evidence and text immutable. P6/P7 must define a separate authorization record before supporting this switch, rather than rewriting evidence in-place. Legacy messages remain readable/copyable to authorized staff but must not gain invented destination/consent proof.

## Bespoke and ownership registry

`src/lib/bespoke-schema.ts` adds the inactive `bespoke-piece` v1 definition for P5. Fields cover piece type, purpose, approximate scale, material/colour direction, constraints, city and timing. All options describe a request for review. A released definition is append-only by version; future edits create v2. The route remains planned at `/commission/customize`; adding the registry does not publish or enable it.

Both request kinds reuse the same anonymous 24-hour guest cookie, HMAC stored identity, request UUID and upload UUID boundaries. The cookie is an opaque random bearer value; it is not itself a signed customer account. No plaintext PII in browser persistent storage. Guest access needs cookie + request key + age check, and may return only the saved receipt. Never authorize by public reference alone.

Private files keep existing 3 × 3 MB limits, decoded JPEG/PNG/WebP checks, 20 MP ceiling and 1,800 px normalized JPEG. New writes record server-verified `normalized_mime`; link timestamp is written in the atomic inquiry commit. Old unknown metadata remains null. Reference access is staff-authorized and private/no-store; no private path, access token or image URL enters WhatsApp or the public image optimizer.

## Role and operation register

| Principal | Allowed | Explicit exclusions / implementation follow-up |
|---|---|---|
| Anonymous visitor | Read published products/content, create own guest-bound draft upload and request; own unexpired saved receipt | No database credentials, other guest receipts, Studio endpoints or list/export |
| Assigned editor | Read assigned inquiries/references, permitted stage/follow-up/note changes; editorial drafts | No unassigned inquiry, staff management, publication, business destination, deletion or PII export |
| Named admin | All Studio business records; assignment; validated publish/hide/restore; staff and settings | Every mutation authorized server-side and audited; no automatic WhatsApp sending |
| Environment owner fallback | Admin via existing isolated server credential | Operational break-glass/bootstrap account; split Preview/Production credentials before release |
| Database migration identity | Reviewed DDL on explicitly selected environment after backup | Never browser-side, app public config or routine build |
| Application database identity | Only required application operations | Current dashboard role is not proof of least-privilege runtime role; reconcile grants before activation |

Existing role sources: `studio-auth.ts`, `studio-access.ts`, orders/workspace/content/media/settings/operations/references API routes. Role checks alone do not prove race safety: P7/P11 must exercise assignment revocation between authorization and write, session expiry, concurrent stage moves and draft publication conflicts. No new database role/grant was created in Phase 2.

## Data/instance register

Preserve the 120 product, 36 article and 8 held project entries in `instances.json` and the reconciliation checklist. Twenty-four fictional testimonials and 40 fictional operational examples remain unpublished. P32 bespoke is a schema-driven request screen, not a 121st product. `coverage.json` is aligned to 49 entries and the new final QA phase number; it does not mark any route TESTED.

## Decision log and remaining activation gates

1. Continue from the newly merged main baseline on a fresh Phase 2 branch; preserve automatic deployment disablement.
2. Reuse existing tables and atomic core; extend fields additively and relax only product nullability with explicit kind constraints.
3. Keep stable typed answers + immutable schema snapshots authoritative for v2; no historical label-to-ID guesses.
4. Record missing legacy metadata honestly; migration is not consent capture.
5. Two-stage saved-message finalization, no queue/bot/API/outbound automation.
6. Local source work is permitted. Hosted business activation stays blocked pending Vercel commercial eligibility; masked local service secrets do not become usable by copying a provider placeholder.
7. Independent backup, owner-approved attached-reference retention, database inspection/privilege reconciliation and final recovery proof are deployment prerequisites. Exact continuation tasks are in the environment register and migration runbook.

No live customer record or secret belongs in the GitHub publication.
