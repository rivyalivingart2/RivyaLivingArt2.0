# Phase 7 — Studio, Kanban and durable publishing

23 September 2026. Master revision 3.8. P7.1–P7.8 complete at the source implementation gate, including the conditional decision to leave real-project authoring inactive. No application QA or runtime integration proof is claimed. Next: **P8.1**.

## Result

Staff can read the original saved product/custom brief, inspect its private images, distinguish operational amendments from customer evidence, manage the eight-stage order workflow, and recover from conflicts or expired sessions. The existing Phase 6 saved-order Open/Copy/message-recovery controls remain the only WhatsApp integration. No outbound messaging, notification, inbox, payments or customer accounts were introduced.

This phase continues merged main d1a50072fb42ed44612e621d64a157c7fef20455 (PR #21) on codex/phase-7-studio. No schema migration or shared-database write was needed. Existing environment configuration, write flags, databases, backups, published records, drafts, assets and IDs were preserved. Automatic deployment remains disabled.

## Task completion

| Task | Source result | Primary evidence |
|---|---|---|
| P7.1 | Dedicated original-submission panel, typed saved answers, source/form/consent evidence and explicit unknown historical values; private references; separate append-only operational amendment ledger with reason and author/version/time | inquiry-detail.tsx; studio-amendment.ts; workspace API |
| P7.2 | Retained shared saved-order Open/Copy, long-message/manual-copy fallback and pending/failed preparation recovery using the original saved snapshot; amendments never rewrite this message | inquiry-detail.tsx; saved-order-actions.tsx; inquiry-handoff API; order-handoff.ts |
| P7.3 | Server-scoped search, stage, assignee/unassigned, source, product ID, saved category, received-date range and due-only filtering; 50-row pagination; meaningful references/source/assignee/date/age/reference count; keyboard/touch Move to and optimistic stage reconciliation | inquiry-board.tsx; studio-orders-board.tsx; orders API |
| P7.4 | All eight stages and historical events retained; backward/closed changes require a reason; same-stage requests do not append events. Staff-entered create/edit stays distinct, with a stable retry identity for active Studio creation | studio-orders.ts; orders API; inquiry-board.tsx |
| P7.5 | Admin-only staff management and explicit session revocation; authenticated credential version pinned during session creation; session/role resolved in one statement. Unsaved staff/manual/detail edits protected against ordinary close/reload, sign-in renewed separately, and expired-session feedback retains the editor | studio-auth.ts; staff-editor.tsx; workspace.tsx; workspace-api.ts; use-unsaved-work.ts |
| P7.6 | Existing durable product/form/content/media drafts, administrator publication, published comparison and revision restore preserved. Added deliberate latest-version reload and copyable local-draft recovery; disable editing while saving/reloading and retain acknowledged versions | catalogue-editor.tsx; content-editor.tsx; media-library.tsx; draft-recovery.tsx; revision-history.tsx; workspace/content/media/revisions APIs |
| P7.7 | Conditional authoring not activated: approvedProjects remains empty and inherited studies are fictional. No invented completed project is published or converted into evidence | project-model.ts; portfolio.ts; Phase 8 genuine-project review |
| P7.8 | Admin-only date/stage/source-scoped CSV export, formula neutralization, no private object URLs; audited export scope. Retention inventory distinguishes attached references from expired unsubmitted uploads; deletion remains limited to the existing guarded cleanup. Editor activity excludes unrelated/reassigned inquiry records and admin-only audit entries | operations.tsx; reference-cleanup.tsx; operations/cleanup APIs |

Component filenames above are under src/components/studio unless named otherwise; APIs are under src/app/api/studio; shared modules under src/lib. The common board is src/components/studio-orders-board.tsx.

## Operational amendment storage and preservation

Amendments append a validated RIVYA_OPERATIONAL_AMENDMENT_V1 envelope to the existing private rivya_inquiry_notes ledger. It contains a retry identity, reason, revised working instructions and resulting order version. Actor and timestamp are server-owned note columns. This avoids changing the deployed schema or rewriting historical notes. Ordinary note input cannot use the reserved prefix; malformed historical envelope-like text remains visible as an ordinary note.

The write checks current assignment and expected order version, then increments that version, appends the amendment and records audit activity in one SQL statement. A retry of the same actor's exact saved envelope returns the existing result. A conflicting version/reassignment returns a conflict; the editor keeps the typed instructions for deliberate reconciliation. There is no amendment edit/delete API. A later correction is another amendment. The original inquiry name/contact/answers/schema/consent/notes/message remain unchanged.

These are application source guarantees, not proof against a database owner or a replacement runtime role with excessive grants. Least-privilege runtime grants and direct negative/concurrency checks remain release gates. A note save can remain unconfirmed if its response is lost; staff must inspect the saved ledger before repeating free-text notes. The UI does not claim exactly-once semantics for that legacy note path.

## Capability and permission matrix

| Screen | Administrator | Editor | Durable source / recovery |
|---|---|---|---|
| S01 Sign-in | Owner or named staff sign-in | Named active staff sign-in | Hashed credentials/session, throttle, expiry, version-pinned creation; login actions/studio-auth |
| S02 Overview | All permitted records/counts | Assigned inquiry counts only | operations API; empty/error/refresh states |
| S03 Inquiry list | All records and filters | Assigned website inquiries only, even with forged filters | orders API; pagination/read failure states |
| S04 Kanban | All stages on all permitted records | Stages only on currently assigned inquiries | orders API; version conflict, reason validation, visible rollback/reload |
| S05 Detail | All inquiry detail and amendments | Currently assigned inquiry detail and amendments | workspace API; original evidence independent from operational ledger |
| S06 Manual orders | Create/edit and stage history | No manual-order read or mutation | orders/workspace APIs; source label and create retry identity |
| S07 Catalogue | All draft/published candidates | Shared editorial drafts | workspace catalogue read; stable product IDs |
| S08 Product editor | Draft/publish/hide | Draft only | catalogue mutation validation/version checks; local-copy/latest reload |
| S09 Form builder | Edit draft and publish | Edit draft only | validated field types/conditions; published schema version preserved |
| S10 Revisions | Read, restore to editor, save draft, publish | Read, restore to editor, save draft | immutable revision history; restoration does not publish |
| S11 Pages/journal/policies | Draft/publish/hide | Draft only | content API and version conflicts; real portfolio remains intentionally inactive |
| S12 Public media | Draft and publish metadata | Draft metadata only | approved asset registry/provenance; no private references in media library |
| S13 Private reference | Read references attached to any permitted inquiry | Read only currently assigned inquiry references | authenticated stream on each image request; no public object addresses |
| S14 Staff | Create/change/disable/revoke another staff account | Denied | workspace role checks, version changes and session revocation; owner environment account unchanged |
| S15 Settings/cleanup | Validated public business contacts, inventory and guarded expired-unsubmitted cleanup | Denied | settings/cleanup APIs; credentials never returned; shared-store warning and write gate |
| S16 Activity/follow-up/export | All scoped activity, internal follow-ups and bounded CSV | Assigned due work/stage history, own editorial activity and currently assigned inquiry audit; export denied | operations API; date/stage/source validation; CSV safety and audit |
| S17 Recovery/states | Authorized controls only | Same recovery within assigned/editor scope | modal close and unload warnings, separate sign-in renewal, retained text, explicit latest-version reload |

No menu/hidden button is treated as authorization. All server write/read paths continue to verify a real staff session and relevant record/role scope. Already-running requests may finish under the authorization snapshot at their start; revocation is enforced for subsequent requests. Runtime race behavior must be proven in Phase 11.

## Failure and continuity details

- Stage cards move optimistically while the mutation is pending. A rejected write restores the prior cards and reloads the server view. Acknowledged success followed by a failed refresh is reported as saved, with refresh still needed. No silent retry invents another stage event.
- Existing manual order history is preserved. New active-Studio manual creation uses a retained request ID. Recovery requires the same saved name/brief and original actor, and refuses a conflicting or website record. Legacy internal callers that omit the optional request identity retain their previous behavior and must not be treated as idempotent.
- Catalogue/content/media saves keep the server-acknowledged version before reloading. Draft recovery exposes only the selected local editorial document for intentional copying, and reloads only after warning that unsaved edits will be replaced. Staff passwords and customer drafts are not written to browser storage.
- Inquiry assignment/follow-up changes, private notes and amendments have separate controls. Saving a note/amendment preserves an unrelated unsaved assignment. The original saved message remains independent of all operational changes.
- Unsaved data remains tab-local until explicitly saved. The unload warning and Studio link/dialog guards reduce accidental loss; they are not durable autosave or a guarantee against browser crash, forced close or all browser-history navigation. Copy/save before leaving. Cross-device recovery uses server-saved drafts and revisions, never another device's unsaved memory.
- Date filters/exports use explicit UTC boundaries. Follow-up due calculations retain the existing database CURRENT_DATE behavior; Phase 10 must confirm the intended operating timezone before activation.

## Retention and export boundary

The existing cleanup still handles only unsubmitted images older than 24 hours, at most 25 per request, retaining uncertain deletions for retry. It cannot delete submitted inquiry references, inquiries or backups. Inventory now shows retained submitted count/bytes and whether the write gate is off. Both environments share the future live store, so this is not a disposable Preview cleanup target.

No submitted-data retention period, deletion authority or offsite recovery promise was invented. Those operational policy decisions, backup portability/full restore, least-privilege credentials, real catalogue/content/settings publication and eligible hosting remain P10–P12 gates. CSV exports contain contact details only after admin confirmation, are bounded at 5,000 matching rows, and exclude private reference paths/capabilities. Narrow the date/source/stage filters if over the limit. No export or cleanup was actually executed during this phase.

## Phase 11 evidence plan — prepared, not executed

Use a DIFFERENT disposable database/private store with separately verified credentials, never the configured shared target. Record the exact source SHA, role, scenario, expected result, actual result and evidence artifact. Revoke disposable sessions and remove only explicitly disposable QA data after the run.

| Scenario | Required proof |
|---|---|
| Two editors, one assigned inquiry | Other editor denied detail, list/search/date filters, counts, notes/amendment/stage writes, file stream, handoff and export; no cross-record leakage |
| Reassignment while open | Next read/mutation/file request rechecks scope; stale edits retained without saving to an inaccessible record |
| Two administrators, same version | One stage/assignment/amendment/catalogue/content/media mutation wins; the other conflicts; no overwritten original or duplicate event |
| Revocation / password / role / active changes | Existing sessions fail after credential-version change; slow password authentication cannot mint a fresh session using the new version; owner flow stays intact |
| Lost amendment/manual-create response | Same request and actor recover exactly once; changed payload/actor/website ID cannot reuse the identity |
| Saved core / message pending or failed | Full detail exists independently; recovery uses original snapshot; operational amendments do not alter generated text |
| Keyboard, touch, reduced motion | Native Move to works without dragging; focus returns after every modal; narrow widths and long text remain usable |
| Unsaved work and expiry | Assignment/note/amendment/manual/staff/editor drafts survive failed writes and sign-in renewal; confirm intentional discard; exercise browser-history/forced-close limits |
| Cross-device publication | Editor draft does not change public view; admin publishes a new version; stale save conflicts; restore creates a new draft without changing the current publication |
| Media and private references | Public registry never accepts customer reference paths; private images fail after loss of assignment/session; originals/provenance preserved |
| Filtered export | UTC boundary dates, invalid ranges, source/stage, 5,000/5,001 rows, formula/newline content, editor denial and audit scope |
| Retention and failure recovery | Attached references never eligible; pending write lease protected; uncertain provider deletion retains metadata/quota; write gate off denies cleanup |
| Compatibility | Legacy/manual records retain IDs/stages/messages, unknown consent stays unknown; all eight stages and initial/history events remain visible |

## Verification performed and resume

Node 22.23.2 TypeScript no-emit compiler wiring passes. React/Next source review covered client/server imports, SQL parameterization, role/scope checks, pending state, controlled fields, labels, focus reuse and original-record preservation. Formal lint/build/unit/browser/device/API/concurrency/restore tests were not run, as required by the approved development-first boundary. No TESTED status was added.

Continue **P8.1 — review/refine Atelier, process, materials/care, architects, contact and FAQ**, then complete the Phase 8 public content, genuine-project, policy, metadata/alias and form-scope inventory. Read master 3.8 and IMPLEMENTATION_PROGRESS.md first. No restart, new hosting service or repeat approval is needed. Final GitHub publication identity is recorded in phase-7-github-publication.json and the local completion artifact after pushing.
