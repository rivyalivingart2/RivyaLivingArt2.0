# Phase 10 — Operating and recovery runbook

24 September 2026. Current candidate remains unpublished and intake/message preparation are off. This runbook prepares operation; it is not evidence that production activation or recovery rehearsal occurred. See the Commercial Readiness Report for open gates.

## Environments and maintenance

Preview and future Production intentionally share the modern database and private Blob store. Their saved environment configuration is not a disposable testing boundary. Existing deployments retain their captured settings. Keep `vercel.json` automatic deployment disabled and both `RIVYA_ORDER_*_ENABLED` flags false until the release gates pass. A Git push must not activate the site.

Use a different database and Blob store for synthetic orders, staff-role tests and restore. Set `RIVYA_DATA_MODE=isolated` only after verifying actual targets differ; a variable is not proof of isolation. Give that environment independent owner/session secrets and no real customer references. No message is automatically sent during QA.

For an eventual incident, stop new intake first; independently decide whether saved-message preparation can safely remain available. Flags are deployment configuration, so confirm the actual running version and captured settings. Do not describe editing a saved variable as an immediate live stop. Never destroy a database, reset a schema, run a seed, detach integrations or delete customer files to repair an outage. Preserve evidence in a restricted location without raw PII in public logs/issues.

## Restricted runtime credentials — prepared, not applied

Fresh inspection found an owner-capable application connection. Keep this connection only as an operational/migration credential after a restricted replacement is proved. Never create a new login with membership in the owner/provider administration role.

The runtime login needs CONNECT to its exact database, USAGE on public schema, and only the application-table privileges below. It must not have superuser, database/role creation, RLS bypass, schema CREATE, table ownership, TRUNCATE or grant option. Inspect inherited membership as well as direct grants. Do not revoke PUBLIC/provider permissions globally without a separate dependency review.

| Tables | Candidate runtime privileges | Why |
|---|---|---|
| rivya_audit, rivya_revisions, rivya_studio_order_events, rivya_inquiry_notes | SELECT, INSERT | Append-only operational evidence; no runtime history rewriting |
| rivya_business_settings, rivya_catalogue, rivya_content, rivya_public_media, rivya_staff, rivya_studio_orders, rivya_inquiries | SELECT, INSERT, UPDATE | Current settings/publishing/staff/order workflow; no general deletion |
| rivya_studio_sessions, rivya_studio_login_limits, rivya_inquiry_upload_sessions, rivya_references | SELECT, INSERT, UPDATE, DELETE | Expiry/revocation, idempotency, unsubmitted-reference cleanup |
| rivya_storage_budget | SELECT, UPDATE | Reserve/release existing budget row; operational setup owns creation |
| Only sequences referenced by defaults of permitted INSERT tables | USAGE; SELECT only if an actual query requires it | Generated IDs; no blanket sequence ownership or schema privileges |

Reconcile this candidate matrix against the final source and actual defaults. Prove all legitimate actions and denied DDL/TRUNCATE/history rewriting on a disposable copy. Prepare new secrets through the existing authorized provider/private-file channel, never through Git or chat. Update the future Preview/Production pooled runtime connection and required aliases consistently, retaining encrypted rollback config; keep the direct migration credential outside runtime. Verify effective privileges again with the replacement credential. Do not switch active deployments without the applicable release/maintenance and rollback evidence.

## Free, private operational monitoring

The `/studio/settings` service view is admin-only and no-store. It reads aggregate counts; the endpoint does not return connection strings, customer records, file paths, tokens or prepared messages. “Credential configured” does not mean Blob access was tested. “Database read succeeded” does not prove writes, schema correctness or restore capability. Enabled flags do not certify hosting eligibility.

After eligible activation, the designated administrator checks this view at the start of each operating day and after configuration changes or reported failures. Use the provider's already available logs/quota view within the free allowance; do not enable paid observability, external analytics or automatic notifications. Define an actual operational contact before release. This document creates no scheduled automation.

| Indicator | Action |
|---|---|
| Messages pending over ten minutes or failed | Open the authorized saved inquiry; confirm its immutable brief exists. Inspect destination/version and generic failure category. Fix configuration through the reviewed process, then use the existing saved-message retry within its limit. Never create another order to obtain a message. |
| Five attempts exhausted | Escalate to the owner for a reviewed repair that preserves the saved evidence and audit trail. There is no automatic counter-reset or guarantee of handoff. Do not silently bypass the bound or send a customer message. |
| Unsubmitted references older than 24 hours | Review the existing admin cleanup inventory. Confirm exact scope and applicable procedure; attached references are excluded. Cleanup requires the supported gate and confirmation. Do not turn on customer intake solely to make cleanup available during a hold. |
| Deletions awaiting completion | Reconcile private-provider deletion outcome before budget/row removal. Retry only the existing idempotent path; never treat an uncertain provider result as successful erasure. |
| Read/credential/provider error | Keep the affected workflow held; check correct deployment, environment and quota. Record generic failure category/time/SHA privately; do not copy request bodies, authorization headers or message URLs into logs/issues. |
| No published contacts/media/catalogue | Complete the deliberate publication process below. Source fixtures and default contacts are not durable publication evidence. |

Refresh is manual. Counts do not show WhatsApp Sent/Read/Replied or establish quotation, payment or fulfillment. Follow-up dates are internal Studio work only. Confirm the business timezone before relying on “due today.”

## Personal-data map and lifecycle gate

| Copy/location | Current boundary | Required lifecycle decision |
|---|---|---|
| Inquiries: name, phone, email, answers, notes, product/schema/answer snapshots and saved message | Guest receipt scoped to its token/24-hour window; staff admin or assigned editor; immutable original evidence | Exact retention, verified requests, correction versus append-only amendment, scoped erasure/redaction |
| Studio order title/client, notes, events, audit and revision/export artifacts | Staff role/assignment scope; public-content revisions must not contain customer data | Include copied personal text in a verified deletion plan; keep only justified nonidentifying audit evidence |
| Attached references and private object keys | Private Blob; no public/customer file addresses in message/export; authorized stream | Submitted retention, identity verification, legal/operational hold if applicable, retryable deletion evidence |
| Unsubmitted upload sessions/references | Guest-owned; up to three references; 24-hour cleanup eligibility; explicit admin cleanup | Confirm operating responsibility; incomplete provider deletion must be retried safely |
| Session tokens/rate-limit guest/IP hashes | HMAC/hash, server-only secrets, time-limited sessions and counters | Bounded expired-record housekeeping without resetting active limits; these are not anonymous public analytics |
| Administrator CSV downloads | Explicit private export, at most 5,000 rows, no private file links | Restricted local custody, documented expiry and deletion; downloaded copies do not disappear when DB rows change |
| Encrypted database/reference backups and rollback connection files | Outside Git/provider, owner-profile DPAPI, restricted local access | Backup schedule/expiry, portable/off-device custody, restore handling of erased records and independent key recovery |
| WhatsApp handoff | User chooses Open/Copy, then manually Send in WhatsApp; content leaves the site at that action | Explain the handoff in privacy copy; the website cannot revoke copies held in WhatsApp or prove sending |

Do not promise deletion after 24 hours for submitted orders: only guest access/unsubmitted eligibility currently uses that period. The owner has already been asked for exact retention, cancellation and delivery facts. Do not invent answers or re-request blanket approval.

Submitted-data deletion needs a reviewed, identity-scoped impact preview covering every copy, explicit authorized scope, durable private-object retry/outcome tracking and backup policy. The current app has no such complete mechanism. A backup receipt or simple SQL DELETE is not sufficient. No submitted data was erased in this phase.

## Backup and full-restore gate

The local completion artifact records the private backup location. Six encrypted files are present for the two prior database targets. CurrentUser DPAPI means the same Windows profile is required; this is independent of the database provider but not independent of the workstation. Previous receipts show decryption roundtrip and archive listing, not recovery rehearsal.

Before any future live migration, take a new independent encrypted database archive plus private-reference manifest/object copy and configuration snapshot. Confirm exact target, schema, row/reference totals, checksums and private custody. Use a consistent database snapshot and reconcile references modified during backup; do not assume DB and object-store clocks form one transaction.

Full rehearsal requires a different disposable database and private store: restore archive, inspect schema/grants/counts, map private references without public exposure, invalidate all restored sessions/guest access, use independent secrets, exercise authorized reads and saved-order recovery, and measure elapsed recovery time and backup age. Inspect only sanitized results in shared reports. Do not restore over either original database. Do not claim portable/offsite recovery until custody and decryption are actually proved. Cleanup of disposable resources follows verified scope and the appropriate deletion authorization.

The owner must establish recovery-point/recovery-time needs and a workable backup/custody schedule. They cannot be inferred from successful `pg_restore --list`.

## Deliberate publication and rollback

1. Preserve the current draft/published versions and revision history; identify the exact candidate SHA. Do not run `seed-reviewed-preview.mjs` against shared data. `reviewed-publication.json` is historical, including six obsolete image assignments.
2. Review all product/image facts and remaining policy particulars. Use current Phase 8 copy and Phase 9 image corrections. Keep fictional projects/testimonials/requests excluded.
3. Publish validated media metadata before associated products. Apply reviewed image associations for DP110, DP112, DP113, DP115, DP117 and DP120 deliberately. New product identities require an explicitly registered approved media association; the current public reader already fails closed without one.
4. Publish reviewed product drafts and customization schema versions; publish approved content and exact business details. The new product gate rejects missing/wrong-owner media and keeps the draft available. A later invalidated media record still fails closed in the reader; inspect the whole published catalogue again before activation.
5. Verify real published counts, instance routes/forms, contact destination, canonicals and policy text on the exact permitted candidate. Missing or malformed business settings are not an accepted order destination.
6. Keep all release gates held until final QA, eligible commercial hosting, restricted runtime credentials, recovery and policies pass. Only then execute Phase 12. Git publication now is not production activation.

To roll back a content change, restore the known revision to a draft, review and deliberately publish; never silently rewrite saved order/schema/message snapshots. To roll back configuration, use the encrypted saved values only after comparing target identities and confirming no newly saved records would be stranded. Both historical resources remain preserved. Integration reconnect/rotation may overwrite saved aliases, so recheck destinations before deployment.
