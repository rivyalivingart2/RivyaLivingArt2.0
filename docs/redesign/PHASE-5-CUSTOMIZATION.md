# Phase 5 — product-specific and bespoke customization

23 September 2026 · approved master revision 3.5 · P5.1–P5.7 complete at the source implementation gate. Durable bespoke submission is Phase 6; formal integrated QA is Phase 11.

## Baseline and preservation

Continue the existing repository from main a007d0fb0b2cc05f4ce55e0f3ebff6d66f51c17f, the Phase 4 merge PR #18. Branch: codex/phase-5-customization. The commit containing this report identifies its source snapshot. No scaffold, new dependency, asset replacement, database query/write, migration, seed, publication or deployment occurred.

The original 120-product candidate, Phase 4 inventory, saved drafts, publication versions, existing inquiries and supplied assets remain intact. The source template revision is now 3; this is distinct from the database's monotonically assigned published_version. Existing database rows continue to take precedence over baseline templates. No form schema is silently applied to an existing record.

## P5.1 — explicit product capabilities

product-capabilities.json maps every approved stable product ID to a reviewed form family. There are **120 products (84 furniture/spatial, 24 memory, 12 personal), 27 families and one bespoke schema**. Selection no longer searches product names for words such as ring. The DP110 earrings and DP119 ring dish proposals therefore no longer require jewellery sizing.

Furniture forms cover room/use, conditional dimensions with units, colour/reference direction, finish discussion, family-specific placement/seating/mounting, delivery city, access and timing. Memory forms distinguish preservation/condition from occasion-led display, and require inscription only for the actual nameplates. Personal forms distinguish wearing/fitting, coaster set size and quantities of pairs/sets/pieces. Choices request atelier review; they do not assert a material, engineering or manufacturing guarantee. Unknown future product IDs receive a minimal brief/city fallback for staff to author deliberately.

The reproducible scripts/phase5-schema-inventory.mjs evaluates only fixed pure source registries. **phase-5-schemas.json** records every ID/name/route, family, previous field IDs, exact proposed fields, schema hash and publication disposition. **111 proposals differ; nine remain identical**. Both old and proposed source schemas satisfy the shared shape constraints. Historical candidate/matrix files are not overwritten.

## P5.2 — stable schemas and Studio authoring

The shared fieldSchemaIssues validator serves Studio feedback and server product validation: 1–16 unique stable fields; text/select/whole-number types; bounded labels/help/answers/options; distinct labels/options after trim and case normalization; ordered integer limits; conditions only on an earlier unconditional select and one of its options. A field's ID is visible but not editable in the builder.

Studio now reports actionable schema errors, blocks invalid saves/publications, supports safe upward/downward movement and prevents removal of a parent while dependent conditions remain. The existing role, optimistic-version and publication protections remain. A deliberate **Use reviewed product-specific form** action replaces only the selected unsaved draft's fields after confirmation; staff can inspect its preview before saving. It never edits published or saved inquiry snapshots.

## P5.3–P5.4 — selected-product and bespoke forms

One typed InquiryDefinition supplies product or bespoke identity, schema version and fields. Product routes continue to use exact published fields/version. The new /commission/customize route uses bespoke-piece v1 directly with no fabricated product ID, linked from the customization entry pages. Its seven fields cover piece type, purpose, scale, direction, constraints, city and timing.

Both forms have preference, details/references and review steps, edit controls, required/optional labels, bounded name/phone/email/notes, consent and a copyable unsaved brief. References remain optional and private; a WhatsApp text link cannot attach them automatically. No customer account, payment, cart or generic WhatsApp entry is added.

**Bespoke integration boundary:** the v2 database proposal is still unapplied and the legacy writer is product-only. Bespoke prepare/review/copy is source-ready; its interface clearly says saving is temporarily unavailable. It creates no upload session, accepts no uploads, disables final submission and opens no WhatsApp. The server also rejects a forged bespoke submit before touching the legacy writer. P6 must connect genuine v2 persistence; a fake product or simulated success would violate the approved contract.

## P5.5 — recoverable state and stable identity

- Dirty briefs, schema snapshots, request IDs and File objects remain in tab-local module memory, bounded to five drafts with a 30-minute inactivity expiry. No localStorage, sessionStorage, cookie or serialized history stores the new draft/contact payload. Reload/close loses that memory; the copy action and leave warning disclose this limitation.
- Secure-session reconnect retains the request key. Unconfirmed saves pause editing and retry the same payload/key. A guest-bound saved-receipt link allows checking the outcome; it does not automatically open WhatsApp. A confirmed success clears the local draft.
- Current-schema GET is private/no-store and published-only for products. A stale-version response offers the current definition. Compatible ID/type/label/condition/bounds/options answers carry forward. Incompatible answers remain visibly available until the customer reconciles them; contact details and references remain intact. No automatic page reload discards a brief.
- Uploads show real byte progress followed by server-processing status. Each file retains its upload UUID and request key across retry. Pending/failed files block submission until saved or deliberately removed. A batch is locked, capped at three still JPG/PNG/WebP images of 3 MB each, and canceled on unmount without continuing its remaining queue.
- Reference DELETE can address an unconfirmed upload by its stable upload key, still scoped to guest/request. Attached references are rejected. Nothing is dropped from the interface until the deletion endpoint confirms success. Existing file inspection, metadata stripping, private storage and budget controls remain.
- A fully expired server session still needs a reopened form and re-upload. The error instructs copying the brief first. Phase 6 must complete saved-state recovery; no durable draft or guaranteed cross-tab/reload recovery is claimed.

## P5.6–P5.7 — real validation and service boundaries

The honeypot is an actual form input included in the server action. Shared contact/answer validation rejects unsupported/duplicate fields, overlong data, invalid selected options, non-applicable answers, invalid or duplicate reference IDs and missing consent. Stable input/error/help IDs link the error summary to its fields; focus moves with steps, upload state is announced and the review has explicit edit actions.

Existing product submission still uses its genuine atomic legacy writer and saved receipt. No new fake save, placeholder inquiry or generic WhatsApp shortcut exists. The Phase 6 correction is still required: current legacy summary construction precedes the core save, and typed v2 snapshots/message finalization are not connected by this phase. The exact required end state remains database + Studio first, saved canonical message second, WhatsApp open third, customer manually presses Send.

## Source checks and deferred evidence

TypeScript no-emit wiring passes using the existing Node 22.23.2 runtime. Source inventory reconciles all 120 IDs/routes, old/new shapes and hashes plus bespoke v1. CSS syntax, source diff, register consistency and preservation/sensitive-file checks accompany publication. These are development checks, **not TESTED or fresh BACKEND_CONNECTED evidence**.

No lint, build, automated application suites, dev server, browser/device QA, real submission or database operation runs in this phase, per the development-first decision. Prepared Phase 11 cases:

1. All 120 published product/version instances, especially DP110/DP119, set/pair quantities, conditional fields and Unicode/unit input; bespoke has its own identity.
2. Studio role/version conflicts, duplicate IDs/options/labels, malformed/removed parent options, reorder/delete dependencies and deliberate template apply preserving prior snapshots.
3. Keyboard/error-summary focus, screen-reader announcements, compact devices, input keyboards, long filenames/text, reduced motion and no JavaScript recovery.
4. Back/Forward, link leave/cancel, privacy in a new tab, same-product revisit, five-draft/30-minute eviction, reload/close loss disclosure and blocked clipboard fallback.
5. Schema changed before submission, incompatible option/label/type/condition/bounds, unavailable product and recovery without losing customer text.
6. Interrupted/late uploads, three-file batching, retry same file/key, failed provider write, removal by upload key, expired references, unauthorized/attached deletion and concurrency with final save. A late provider write after deletion still needs reconciliation proof in Phase 6/10/11; this phase does not certify orphan cleanup.
7. Lost save response, identical retry versus editing, expired guest, receipt check, core saved/message pending states and exactly one inquiry/order/history/reference set after Phase 6 integration.

## Commercial and release state

No new service or dependency. Existing Vercel-only/free-only commercial eligibility hold remains, with git.deploymentEnabled false. No Netlify or paid service is introduced. The recorded masked local credentials, independent backup/restore, environment grants, retention/privacy and final release gates remain unresolved; no fresh provider inspection is claimed.

## Next exact task

**P6.1 — enforce validation, ownership and request identity for the product/bespoke v2 saved brief**, using Phase 2 contracts/runbook and this form's typed by-ID validation output. Inspect the current permitted environment and prerequisite schema/backup before any migration; credentials must stay out of chat/Git. Then retain atomic core persistence and finalize the WhatsApp message from the saved canonical snapshot. Keep historical records readable and preserve the no-send-before-save rule. Formal QA remains Phase 11; main/eligible production release remains Phase 12.
