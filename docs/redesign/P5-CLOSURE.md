> Owner scope change, 5 October 2026: the project backup feature, scheduled archive jobs, archive-key custody tasks and backup/RPO/RTO acceptance gates are removed. Any earlier instruction below to run, verify, schedule or require them is historical and superseded. Existing archives/keys were not deleted. Studio draft/revision recovery and privacy-erasure safeguards remain. See the 2026-10-05 removal decision.

# P5 completion — Studio appearance and operational usability

1 October 2026. **P5A–P5E implementation and isolated acceptance are complete** on local `codex/p5-studio-workspace`. This closes T29, T30, T57 and T65 within the existing protected operating contracts. P5A commit `87ae88441bdae13ab53a1460405668b1c102e79f` remains the first slice. This report supersedes its remaining-work list; the original report is retained as historical evidence.

## Completed behavior

### P5B — inquiries and follow-ups

Search, stage, assignee, source, request kind, product/category, received dates, task, follow-up, sort, page, list/board mode, mobile stage and exact selected record now live in the URL. Opening a record keeps the working list mounted. Returning preserves the selected page and filters and restores focus to the matching visible row. Browser Back cannot silently unmount an editor with unsaved text; it keeps the record open and explains how to close it deliberately.

Lists use bounded 50-record pages and stable ordering. Failed reads keep the last loaded rows with a stale-data explanation. Phone layouts use readable cards; the board shows one selected stage with a labelled stage control. Stage selectors provide the keyboard/touch alternative to dragging. A stage remains unchanged until its save succeeds; backward/closed transitions retain the existing reason requirement and stale versions are rejected.

Inquiry details group the original brief, private references, next task, notes and history. Original customer answers and saved messages remain immutable; amendments append evidence. Note failures retain typed text, while stale assignments/follow-ups require review against the current version. Today and +3/+7/+14-day shortcuts use IST. SQL date-only follow-ups now serialize as calendar strings throughout list, detail, overview and operations, preventing the previous-day shift caused by timestamp conversion.

The existing manual workflow still records only a customer name and brief, with review before save and idempotent retry. It does not fabricate consent, create a website contract, attach products or send messages. The new printable inquiry summary contains the saved brief and current task metadata, is labelled as a request rather than an invoice, and excludes private reference imagery and operational editing controls.

### P5C — editors and publishing work

Shared record strips show identity, saved revision, publication state and local save/dirty state in content, catalogue and media editors. Failed initial loads offer retry; failed refreshes retain prior rows. Existing revision comparison and draft recovery remain available. Record-switch confirmation uses the shared native dialog with initial focus, keyboard wrap and Escape recovery.

Existing catalogue records start in protected review mode. Name, facts, galleries, schemas and publication actions require a deliberate opening of the existing editing controls. Product data was not edited. The new-piece screen starts with an explicit missing-image choice instead of borrowing another product's image; the new-product media-association dependency remains deferred as specified in the approved phase.

Studio form preview now uses the actual public customization-field renderer, including field type, options, limits, required markers and conditional visibility. Preview controls are intentionally outside the product-save form association so their required values cannot block saving the editor. The public submission contract is unchanged.

The overview includes up to eight exact recent editorial records. Publishing tasks run the same saved-record checks as Content health, show unknown readiness until a successful read, retain old results on failure, and link blockers to their exact records or filtered health views. Counts are derived from saved data, not fabricated from dashboard labels. In final QA, 315 saved entities were checked.

### P5D — administration and supporting states

Staff changes show a concrete account/role/active-state and session-impact review before the existing API is called. Revocation, role changes, fresh sign-in and concurrent-version rejection were exercised with temporary isolated staff accounts. Existing role definitions and authentication architecture remain unchanged.

Atelier settings default to read-only canonical references with copy controls, saved version, and links to public contact/Imprint and activity. Existing deliberate editing and publication confirmations remain available; no contact value changed. Activity exposes exact inquiry record identities and safe known editorial links. Export evidence tables fit their scroll region; no export, backup or retention deletion was executed. Private-reference presentation uses the same Studio palette without changing access or creating public links.

### P5E — reference comparison and acceptance

The authenticated old Studio overview, pages, privacy editor, forms and Site images were inspected read-only. Their obsidian/blue panels, grouped navigation, readable tables and focused editors inform the shared new treatment. The new application's explicit draft, preview, publication and revision-recovery contracts are retained. The 43-family register records the implementation, shared treatment, conditional disposition or exclusion for every family. It is not a claim that 43 independent modules were activated.

## Verification and evidence

| Check | Final result |
|---|---|
| Build / TypeScript | Passed on the final source |
| Full lint | 0 errors; 63 existing warnings remain |
| Unit tests | 259 passed |
| Preflight and built HTTP regression | 399 passed |
| Isolated workflow assertions | 58 passed, including 54-record paging, permissions, stage/history/reason, notes/amendment, assignment, dates, content publication/recovery and session changes |
| Final compiled API assertions | 16 passed: exact calendar dates, positive failed-message queue, bounded editorial IDs, follow-up/operations agreement and protected-record cleanup |
| Browser checks added in P5B–E | 21 passed, including URL state, dirty Back, return focus, failed note, expired-session draft recovery, protected catalogue, native dialog keyboard wrap, exact health filter and print |
| Responsive sampling added in P5B–E | 14 samples, including all 13 registered destinations at phone width and a final compiled inquiry check; no sampled document overflow |
| Earlier P5A evidence retained | 22 API assertions, 19 browser checks and 21 layout samples |
| Final compiled browser console | No captured errors in the final fresh verification tab |
| Protected source | 1,886 whole files match P0; old repository and original assets unchanged; explicit read-only query/origin-helper exceptions documented |
| Protected persisted data | 120 catalogue rows, 136 public-media rows and business settings match P4; every pre-existing content/inquiry/order row matched before/after the workflow run |

Parent-workspace evidence: `outputs/P5/P5BE-API-QA.json`, `P5BE-Final-QA.json`, `P5BE-Browser.json`, `P5BE-Protected-Source.json`, `p5be-final-*.log` and the `P5BE-*.jpg` screenshots. Repository summaries: `p5-validation.json`, `p5-family-coverage.csv` and `P5-REFERENCE-COMPARISON.md`.

QA used the established isolated database, restricted runtime role and separate private store. Inquiry intake, automated retries and indexing stayed paused. Synthetic manual/inquiry fixtures were closed through audited transitions, temporary staff were deactivated, and the synthetic page was hidden with revisions retained. Earlier failed QA attempts also left only closed/inactive fixtures. Nothing was purged. The final positive failure-queue test temporarily supplied a valid synthetic v2 contract on a QA-only record, then restored its original synthetic contract; no real product or customer data was copied and no message was sent.

Test-harness errors were corrected before the final passes: one date query initially included manual entries, an initial failure fixture did not satisfy the v2 constraint, and an assignment attempted to retain an already deactivated QA staff member. The final checks use the valid synthetic contract and dedicated follow-up action. Browser checks also found and fixed date serialization, Back-navigation draft loss, and print ancestor visibility. Fault injection was removed and the compiled application was rechecked.

## Boundaries and recovery

All changes remain local. Main and origin/main remain `8990e73e818c9a0f9aba8183c1e2d9f74a5206c9`. No push, PR, merge, deployment or production publication occurred. A future explicit push-main request must use a detailed feature-branch PR. No schema migration, scraper work, old-product transfer, product/gallery/form data change or canonical contact change was made.

P5 applies shared presentation and honest unavailable states to conditional/unsupported families; it does not invent their business data or activate legacy services. New-product media association stays deferred. Genuine portfolio/testimonial content, reviewed language journeys and legacy URL decisions belong to their existing later tasks. Physical-device coverage and the complete accessibility/service-retention audit remain P7 checks. The synthetic legacy inquiry showed the existing retention service's unavailable state; this report does not certify retention execution. Reference access/absence and layout were covered, not a new private-image upload/deletion workflow.

**P4 T41/T61 public performance acceptance remains open. P6–P8 are not started by this delivery.** Studio functional QA is not a production-release or whole-site performance certificate. No new images/videos were required; future editorial work continues to use the supplied Drive folder and review requirements.

Recover P5 code with a new revert commit of the P5 completion commit and, if required, P5A, preserving P3/P4 and every saved draft/history. There is no schema rollback. Do not reset the working tree, purge audits or replace current destination content with synthetic QA data. Publication recovery continues to restore a chosen historical document as a new draft and requires explicit publication.
