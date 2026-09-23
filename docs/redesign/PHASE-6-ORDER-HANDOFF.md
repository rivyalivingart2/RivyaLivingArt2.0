# Phase 6 — Durable order save and saved-order WhatsApp handoff

23 September 2026. P6.1–P6.8 are complete at the source and isolated Preview schema gate. Formal application QA is deferred to Phase 11; intake remains disabled. Next: P7.1. This report supplements master revision 3.6, not a new implementation plan.

## What changed

Selected-product and bespoke briefs now share the v2 writer. A bespoke request has no invented catalogue product. The server accepts only the selected version's fields, visible conditions, approved options, bounded contact/notes, current consent version and owned private references. It hashes the normalized accepted payload, not arbitrary form fields. Retrying the same guest/request key recovers only the same saved payload, using its original schema even if today's catalogue has changed.

Stage A commits the Studio order, inquiry, immutable schema/product/typed-answer snapshots, source route, consent evidence, reference count/links, initial NEW event and audit together. The message initially remains pending. The session lock is acquired in the first transaction command; the core command then gets a fresh Read Committed snapshot. Upload, submission and cleanup share session-first locking. Catalogue visibility/version and destination configuration are checked inside the core transaction. No missing business-settings row is silently invented.

Stage B reads the committed record and renders pinned template `order-brief-v1`. The full text is saved once; a preparation failure cannot undo the inquiry or overwrite a concurrent ready message. Attempts are bounded to five. Pending/failed receipts expose saved brief details and an authorized explicit preparation action. A GET never creates an inquiry or finalizes a message.

Every WhatsApp opening rechecks the saved record, access, ready state and current business number/configuration version on the server. It uses the exact saved text. A long URL requires copying the full text before opening a short reference message. Clipboard denial has selectable text and manual-copy acknowledgement. Opening never marks the inquiry Sent or changes its business stage. The customer presses Send in WhatsApp; no message is automatically sent.

## Task evidence

| Task | Implemented source |
|---|---|
| P6.1 | `brief-validation.ts`, `order-input.ts`, `saved-brief.ts`, session/reference routes: strict shape, canonical identity, guest binding, schema and reference ownership |
| P6.2 | `order-persistence.ts`: one atomic core transaction and linked references/events/audit |
| P6.3 | `order-handoff.ts`, `order-consent.ts`: saved-snapshot rendering, pinned version, bounded preparation and destination/configuration recheck |
| P6.4 | Receipt GET/POST, received page, shared saved actions: pending/ready/failed/legacy/unavailable states; exact request recovery |
| P6.5 | `whatsapp.ts`, `saved-order-actions.tsx`: encoded full text, long-link copy-first flow, manual clipboard and blocked-app recovery |
| P6.6 | Studio workspace/detail and `/api/studio/inquiry-handoff`: independent authorized retrieval, typed answers, private references and message recovery |
| P6.7 | Shared receipt/Studio copy and commission entry: saved request first, customer manual Send, no generic WhatsApp or automatic order confirmation |
| P6.8 | Only the saved-order server path imports the WhatsApp URL helper; removed unused default-number export. Historical presentation components/data retained. Preview state routes retain their production guard and use the current approved renderer. No customer-facing general chat was added. |

## Failure and recovery contract

| Condition | Behavior / recovery |
|---|---|
| Maintenance or missing schema/settings | No new core save; retain/copy entered brief and retry later |
| Stale published form | Reconcile current options; retain contact details and supported choices |
| Lost save response / simultaneous retry | Retain request key and exact payload; recover the same owned record, never automatically create a new request |
| Same request key with different payload | Reject mutation of the original brief; direct the user to its saved receipt |
| Core transaction failure | No partial order/inquiry/reference association/event; uncertain responses remain explicitly unconfirmed |
| Message preparation interrupted | Keep saved core; receipt/Studio can retry preparation within the five-attempt bound |
| Invalid historical snapshot or exhausted attempts | Preserve evidence and show staff-review state; do not manufacture a message or new order |
| Legacy summary without destination evidence | Read/copy preserved summary; no assumed destination or new WhatsApp link |
| Destination number/version changed | Keep saved summary copyable; block opening. An audited destination override is not implemented and must not be replaced by silently editing the snapshot |
| Guest receipt expired | Guest access ends after 24 hours; authorized Studio access remains independent |
| Upload response lost | Same upload key plus normalized-byte digest; recover matching existing object, including byte/hash comparison, or retry after its five-minute write lease |
| Pending upload cannot be confirmed | Retain metadata, slot and quota reservation. It may block submission of that brief until same-image recovery succeeds; pending removal waits for the 24-hour expiry cleanup window. Do not promise immediate cancellation or start a duplicate inquiry |
| Provider deletion uncertain | Keep deleting record and reservation for retry; attached images cannot be deleted by this cleanup |
| WhatsApp/clipboard unavailable | Inquiry remains saved; refresh, copy manually or reopen. No automatic send or stage change |

The pending-upload wait is a deliberate current limitation. Phase 10/11 must prove late-write/deletion reconciliation and decide whether a durable cancellation tombstone is needed before release. Tab-only unsaved state still does not survive closing/reloading; copy guidance remains visible. These source contracts are not runtime proof.

## Preview infrastructure and migration receipt

The owner delegated retrieving isolated Preview credentials and choosing backup destination/key custody with “DO IT BY YOURSELF.” Existing Vercel resources were used; no subscription, host, service plan or customer account was added. The resource Quickstart values were copied directly into ignored local configuration without printing secrets. Only the Preview database/direct endpoint and private Blob token were merged into `.env.local`; masked bulk-pull output was not treated as usable credentials. Blob operations now explicitly use the private token rather than accidentally selecting OIDC.

- Preview Neon resource: `store_TYe2hzqKpB0JBuDN`, project `blue-haze-08978208`.
- Preview private Blob: `store_1W9MAXAeFr2AwK23`, empty at the inventory.
- Before DDL: all 16 application tables inventoried. One storage-budget row and one existing Studio-session row; all other counts zero. No customer inquiries, reference rows or objects existed.
- Independent backup outside repository/output/provider storage: encrypted PostgreSQL custom archive plus metadata/count/fingerprint/object manifest. Windows DPAPI CurrentUser holds encryption under the owner's Windows profile, with restricted directory ACL. No plaintext database dump or key was committed.
- Archive decryption checksum matched; PostgreSQL `pg_restore --list` read the archive. Before/after backup inventories matched. This establishes archive integrity/readability, **not a full restore rehearsal or offsite disaster recovery**. Profile/machine recovery and a separately recoverable copy remain P10/11 gates.
- PostgreSQL 18.6 portable client tools were obtained from the official EDB distribution. No Windows service or application dependency was installed. TLS used `verify-full` with existing Windows trusted roots; verification was not disabled.
- `phase2-order-contract.sql` and `phase6-upload-identity.sql` applied together at **2026-09-23T14:52:40.400Z**, with unchanged-data guards, table locks, five-second lock timeout and 30-second statement timeout.
- Added 24 columns. Aggregate counts and original-column row fingerprints matched after commit. Existing IDs, session and budget data were preserved. Provider-only constraint remains intentionally NOT VALID for historical compatibility; no historical non-Vercel references were present.
- See `phase-6-preview-migration.json` for sanitized receipt and hashes. Do not blindly replay either migration. Production was not migrated or freshly inventoried in this phase.

The existing resource-owner credential was used only by the local maintenance process for DDL; a dedicated least-privilege application/migration role split is still outstanding. Do not activate the application with an owner-level database credential. Historical Phase 2 environment/runbook entries describing masked credentials or unapplied DDL remain dated evidence; this receipt supersedes those specific current-state claims.

## Maintenance, rollout and recovery

`RIVYA_ORDER_INTAKE_ENABLED` and `RIVYA_ORDER_MESSAGE_RETRY_ENABLED` must explicitly equal `true` for their respective writes. Both remain off/unset locally; `.env.example` defaults to false. Session creation, upload, removal, core saving and admin reference cleanup use the intake gate. Message preparation uses its separate gate. Authorized read-only legacy/v2 receipts and Studio retrieval remain source-compatible. The gates do not pause unrelated Studio content/settings writes; any future backup must quiet all relevant writers and reconcile its inventory.

To continue: inspect current schema against the receipt rather than rerunning SQL; complete P7 roles/detail/publication paths and P8/9 content/media. Establish the permitted isolated integration target, separate credentials and runtime grants, real business-settings row and reviewed publication prerequisites. Only then enable flags for explicitly scoped Phase 11 synthetic QA; no hosted commercial activation under the unresolved Vercel eligibility hold. Re-disable both flags during repair, retaining additive schema and all data. Never revert to a pre-v2 reader after bespoke/pending records exist. Restore only into a new isolated target with revoked restored sessions; never overwrite live data to undo DDL.

The local completion artifact records the private backup directory and maintenance-helper location. Its `migrate` mode is already consumed and deliberately refuses a second application. DPAPI decryption requires the same authorized Windows user profile; do not publish decrypted archive/manifest or move only the encrypted files and assume portability. Backup cadence, retention, RPO/RTO and full restore evidence remain unresolved operational gates.

## Verification and release limits

Completed: Node 22.23.2 TypeScript no-emit compiler wiring; source/import and sensitive-file review; read-only Preview inventory, archive integrity and migration preservation checks. No dependency or approved media/content dataset changed. No real/synthetic inquiry, image upload, message sending, catalogue publication or new staff record was performed.

Deferred to Phase 11: lint, build, test suites, browser/device/accessibility QA, endpoint/SQL constraint denial cases, two-session concurrency, save-response loss, snapshot render parity, Stage B failures, five-attempt exhaustion, role reassignment/revocation, forged/expired access, no-store/noindex/referrer checks, private image retrieval, upload/cleanup races, quota reconciliation, destination changes, clipboard denial and long Unicode message cases. No TESTED claim. BACKEND_CONNECTED is limited to actual Preview resource access and applied schema, not the unexercised end-to-end order flow.

Vercel-only/free-only and `vercel.json` automatic-deployment hold remain. No Netlify, payments, cart, customer accounts, WhatsApp inbox/bot/broadcast/notification workflow. Existing commercial eligibility, privacy/retention, runtime permissions and release gates still apply. Main/production release remains Phase 12.

Transaction design references: [Neon HTTP transaction configuration](https://github.com/neondatabase/serverless/blob/main/CONFIG.md), [PostgreSQL Read Committed snapshots](https://www.postgresql.org/docs/18/transaction-iso.html), and [PostgreSQL application consistency](https://www.postgresql.org/docs/18/applevel-consistency.html). These explain the source design; they do not verify this application's behavior.

## Resume

Branch `codex/phase-6-order-handoff`, based on Phase 5 final head `44245c4b21405cd09c2986704accc3dd5dda4f1e`. Main at phase start was `a007d0fb0b2cc05f4ce55e0f3ebff6d66f51c17f` (Phase 4 PR #18); Phase 5 was not merged. This branch includes Phase 5. Read fresh Git refs and the publication receipt before proceeding. **P7.1: complete Studio detail layout and immutable original versus operational amendment separation.** Preserve this phase's saved-order action foundation; do not build a second handoff system or repeat plan approval.

Publication baseline update: main advanced during this phase to c7c5cb9161b961fe0e0c46c40d6b467d6a0252e7, Phase 5 PR #19. The fetched merge has exactly the Phase 5 source tree; this work branch fast-forwarded to it before committing Phase 6. No upstream source was overwritten.
