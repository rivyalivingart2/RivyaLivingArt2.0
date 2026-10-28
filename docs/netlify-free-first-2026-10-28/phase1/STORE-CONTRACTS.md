# NFF-100 — Authoritative stores and transaction contracts

This is the target design, not live configuration. Existing SQL owns every observed table below until verified cutover. An absent table has no current records to migrate. The existing schema dictionary is a field-level starting point from isolated QA; reconcile it against actual production columns/constraints before import.

## Complete mapped table authority

All table names below have the rivya_ prefix. One canonical record uses a typed namespace and a stable mapping of the original primary key. Original keys remain present in the payload; no business identity is regenerated. Source row counts are the dated 28 October census, not committed target rows.

| Source table | Source rows | Preferred canonical boundary | Preserved key |
|---|---:|---|---|
| rivya_access_requests | 0 | security | id |
| rivya_audit | 1099 | system | id |
| rivya_business_settings | 1 | content | id |
| rivya_catalogue | 120 | content | product_id |
| rivya_content | 535 | content | content_key |
| rivya_editorial_extension_revisions | absent | content | kind + entity_key + version |
| rivya_editorial_extensions | absent | content | kind + entity_key |
| rivya_erasure_ledger | 0 | operations | id |
| rivya_inquiries | 2 | operations | id |
| rivya_inquiry_notes | 0 | operations | id |
| rivya_inquiry_upload_sessions | 14 | operations | request_key |
| rivya_managed_exports | 0 | operations | id |
| rivya_migration_markers | absent | system | migration_id |
| rivya_newsletter_subscribers | absent | operations | email |
| rivya_presentation_revisions | 4 | content | presentation_key + version |
| rivya_presentations | 1 | content | presentation_key |
| rivya_privacy_controls | 26 | operations | order_id |
| rivya_public_media | 154 | content | path |
| rivya_references | 0 | operations | id |
| rivya_restoration_conflicts | absent | system | source_namespace + source_entity + source_id + field_path |
| rivya_restoration_crosswalk | absent | system | source_namespace + source_entity + source_id |
| rivya_revisions | 1395 | content | kind + entity_key + version |
| rivya_staff | 0 | security | id |
| rivya_storage_budget | 1 | operations | id |
| rivya_studio_login_limits | 28 | security | key |
| rivya_studio_order_events | 47 | operations | id |
| rivya_studio_orders | 26 | operations | id |
| rivya_studio_sessions | 1 | security | token_hash |

Security's target is conditional on atomicity, isolation and latency tests. A justified free-database exception would replace the canonical Security authority as a whole transaction family; it would not introduce concurrent Sheet/DB masters. No such exception is selected.

## New workflow records and files

| Family | One target authority | Relationship / projection rule |
|---|---|---|
| Staff/access/session/throttle mutations | Security canonical transaction group | Preserve supported credential hashes/versions; revocation cannot be an asynchronous System job |
| Inquiry/order/reference transactions | Operations canonical group | Record, event, privacy state, reservation and idempotency receipt commit together |
| Content revisions and publication pointer | Content canonical group | Atomic publication pointer references one validated immutable bundle and its input revision vector |
| Catalogue jobs, selected input, overrides and output registrations | Content canonical group | Versioned Sheets input; catalogue overrides do not modify canonical products; generated Slides/PDF bytes in private Drive |
| Research sources, observations, reviewed candidates and scraper jobs | System canonical group | Third-party provenance retained; candidate review cannot insert products |
| Cleanup/export jobs for private operational records | Operations canonical group | Job checkpoint and affected record state commit under the same fence; private outputs stay private |
| Per-mutation audit, history and idempotency receipts | Same canonical boundary as the mutation | System's historical audit table is an immutable imported source; an aggregate audit UI is a read projection, never a second master |
| Migration manifests/crosswalk/conflicts | System for non-sensitive control; private Drive for detailed source manifests | Security/private payloads are not copied into broadly editable system records; opaque reference and hashes only |
| Full record documents | Immutable Drive artifact linked by the canonical record | Exact bytes/hash/version; no independent direct document editing; create a new immutable version then CAS the record |
| Blob originals, private references and managed media | Registered Drive file after verified migration | Preserve existing Blob as current original until reconciled; exact application-authorized delivery |
| Approved 169-image collection / 507 variants | Existing repository assets | Preserve files, names, portrait ratios and manifests; do not move for bookkeeping |
| Public delivery cache | Rebuildable Netlify cache of the validated bundle | Not a source of truth; cold-start retrieval from the registered immutable bundle, never process-local-only persistence |

## Atomic mutation boundaries

The current gateway compiles exactly four single-row writes plus its coordinator marker. It cannot yet atomically update several business records. Extend it with a bounded same-workbook transaction command: operation ID, actor derived from the authenticated server, expected revisions for every member, typed actions, uniqueness/relationship checks, deadline and one request hash. Compile one Sheets batch containing the complete member changes plus ledger, audit, history and committed gate. Store uncertainty before dispatch; do not automatically retry an unknown outcome with a new identity.

Required groups include: access-request consumption plus staff/credential change and session invalidation; order plus events/privacy/reference reservations; content plus its revision and pointer where publication needs them; job state plus its verified output registration. Cross-workbook operations use immutable input references and explicit compensating/quarantine state, never pretend distributed atomicity. A staff reference in Operations is an opaque identity checked by server authorization, not a copy of Security credentials.

External Drive copy/export happens after a durable intent and before a verified output commit. The worker rechecks lease and fence at the final commit; it does not hold a Sheets lock over the network. A stale worker must not publish an output. Native Slides copies need unknown-outcome reconciliation because pre-generated Drive IDs are not a general duplicate-proof mechanism for native file copy. Search matches alone cannot establish an output's identity.

## Editing, retention and publication

Schema versions, exact original IDs, status, timestamps and revision/hash checks survive encoding. Store prices with existing exact decimal/paise semantics, not binary floating-point conversions. Formula-leading strings remain literal values. Reject unsupported fields and coercion; do not discard populated source columns to make a row fit.

Editors submit staging proposals with expected revisions. Validation returns field errors without losing their input. A stale revision becomes a reviewable conflict. Archive/tombstone records according to existing domain policy; no hard deletion, reseeding, history trimming or automatic erasure is introduced here. Exact restore/export must preserve both original history and later writer bookkeeping.

Publication freezes one revision vector for public catalogue/content/settings/presentation/media, validates allowed public fields and references, writes a complete immutable Drive bundle, verifies it, then CASes one active pointer. Cache keys include bundle identity and content hash. Partial builds never replace the last valid version. Test invalidation and cold starts on Netlify. Private customer/security/operational data never enters public bundles, search indexes or cache logs.

The current login and public design are unchanged. Server adapter initialization and replacement of all enumerated SQL/Blob callers belong to later implementation; changing an environment flag does not install these contracts.
