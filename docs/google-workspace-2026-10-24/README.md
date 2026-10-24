# Current checkpoint — Phase 0–2 local implementation and release

The owner requested completion from `43c0f14`, then authorized all latest changes through a detailed PR into GitHub `main` and a Codex Cloud handoff. The active branch is `codex/sheets-drive-foundation`. Read [the Phase 2 checkpoint](PHASE-2-CHECKPOINT.md), [verification](phase2-verification.json), [isolated Google target plan](ISOLATED-TARGET-PLAN.md), [complete owner brief](OWNER-BRIEF.md) and [Cloud continuation prompt](CONTINUE-IN-CODEX-CLOUD.md).

The read-only audit and architecture/mapping plan are delivered. The controlled writer and signed Apps Script source, Drive JSON provider/large-document support, coherent publication bundle and durable job runner/canonical adapter are implemented and tested locally. Existing editors, data and login remain on the current provider. No Google resources or scripts have been activated; migration/cutover and real-provider acceptance are pending.

The owner also requested correct service placement. See [SERVICE-PLACEMENT.md](SERVICE-PLACEMENT.md): Google Sheets/Drive/Apps Script own the future data/files/writer, GitHub owns source/tests/PR/handoff, and Vercel owns website previews/deployment. Source availability and real installation are reported separately.

Publication of this branch also includes the earlier approved local website/Studio work. The release packages the exact approved 169-image derivatives for portable website delivery and guards new schema-dependent workflows so no automatic DDL is required. Original source files, private lineage, raw evidence and credentials are excluded from Git. The final receipt records preservation exceptions introduced solely for release compatibility.

Use the existing [phase plan](PHASE-PLAN.md) for phases 3–11 after the pending real Google acceptance. The old checkpoint below records historical evidence at `43c0f14`; its next-work list has now been implemented locally. The current checkpoint and Cloud prompt supersede it.

---
# Current checkpoint — Studio and Google Workspace transition

The owner approved the final local website and asked to begin the new CRAFT brief on 24 October 2026. Started from `e9d3228`, preserving it on `codex/exact-legacy-restoration`; current work is on `codex/sheets-drive-foundation`. All changes are local. Nothing has been uploaded, imported, published, pushed or deployed.

Read [the audit](AUDIT.md), [architecture](ARCHITECTURE.md), [phase plan](PHASE-PLAN.md), [field dictionary](data-dictionary.csv), [migration mapping](migration-mapping.csv), [decision](../decisions/2026-10-24-sheets-drive.md) and [verification receipt](verification.json). These replace the previous stopped execution entry while retaining its completed work and evidence.

## Completed in this checkpoint

| Phase/task | Status | Completed work | Evidence | Remaining action/blocker |
|---|---|---|---|---|
| 0 / GW-000–002 | Verified complete within the stated read-only audit scope | Current branches/main/deployment, SQL/Blob/auth dependencies, Studio features, selected imagery and connected catalogue assets audited | Main and production remain `1936cbb`; local protected baseline `e9d3228`; current receipts and source inspection | Live production record reconciliation, complete authenticated coverage and installed Apps Script execution remain unverified |
| 1 / GW-100–102 | Local planning complete | 28 actual tables, 230 fields, 45 SQL constraints mapped; workbook permissions, auth, publication, jobs, direct-input, migration and recovery design documented | Machine-readable schema, field/migration CSVs and detailed phases 0–11 | Implement and validate each provider/workflow; these documents are not a cutover |
| 2 / GW-200–201 | Local components implemented and verified; phase partially complete | Strict record codec; stable IDs; literal formula-safe cells; optimistic revisions and idempotent replay planner; bounded registered-resource Google GET transport | 51 new focused tests included in 448 passing application tests; scoped lint and full TypeScript pass | Deployed coordinated writer, durable jobs, runtime credentials, target resources and real Google writes remain open |
| 3 / GW-300 | Read-only local mapping preflight verified | 406 existing QA rows accounted for in RAM; 404 inline round trips; two presentation/history records explicitly pending Drive artifacts; 45 key constraints verified | Repeatable-read loopback rehearsal and unchanged before/after hashes | Actual Sheets/Drive import, Drive artifact delivery, logical JSON relationships, production export/reconciliation and recovery execution remain pending |

The two oversized presentation records are 46,644 and 46,665 UTF-8 bytes. They exceed the foundation's conservative 45,000-character inline cell budget; complete canonical content is hashed in memory and explicitly planned for Drive. No file ID or successful upload was invented and no content was truncated.

## Preservation and verification

- All **406 pre-existing local rows** remain unchanged: 400 business rows across 26 tables plus six transient authentication rows across two tables. No schema, source-record or product change occurred.
- All **923 protected tracked application/media/package files** match the baseline. The approved public site and login source remain byte-for-byte unchanged. No existing component or provider was activated or replaced.
- All **169 selected images / 507 WebP variants** passed fresh read-only hash/dimension checks; six featured images and 12 creation types remain. No media was regenerated or reassigned.
- **448 application tests pass**, including **51 new foundation tests**; **12 preflight tests pass**; full TypeScript, scoped ESLint and whitespace checks pass. Preflight initially could not initialize temporary Git fixtures inside the sandbox; the same tests passed with permission to run their local fixtures. No application defect was hidden by that retry.
- Independent review led to explicit current-constraint drift checks, duplicate JSON-key rejection and dense/accessor-safe string-cell validation.
- The existing built preview remains `J0mF2NzSlOPFqGX4L_g0e` at **http://127.0.0.1:4210/**. Homepage/Creations/Signature presence was rechecked. This foundation has no app imports; no new Next build, complete seven-width sweep, cloud integration or production verification is claimed. Existing accepted screenshots remain under `test-results/exact-legacy-2026-10-21/final-live-design/`.

Private evidence is in ignored `test-results/google-workspace-2026-10-24/`: `baseline-private.json`, `after-private.json`, `rehearsal-verified-private.json`, test logs and `google-artifacts-private.json`. Do not commit these, authentication details, raw exports or screenshots. The rehearsal saves only hashes/counts/metadata, not source records. Its source rows exist only in memory.

## Reuse decisions

Retain existing editors, domain validators, published rendering contracts, media lineage, selected-image draft flow and newsletter/subscriber workflow. The old scraper provides source adapters and workflow logic, but current registry entries are not active scrapers.

Existing connected catalogue artifacts include an eight-tab workbook, three 30-slide A4 editions, a one-slide generator base, four generated native decks, four PDF editions and a V2 script source mirror. They will be reused and adapted. The automation dashboard requires installation/trigger authorization and has queued rows with blank output links; generation is not verified. Do not import the existing workbook's product rows. Its queue state in DocumentProperties and filename-based image lookup require adaptation to Sheets jobs and registered Drive IDs.

## Exact next local work

1. Implement the controlled writer adapter and workbook batch compiler around `planRecordMutation`, including per-workbook revisions/audit/idempotency, trusted authorization, lock/recovery semantics and stale/manual-edit conflicts.
2. Add Drive payload-reference and immutable-publication bundle contracts for the two oversized records, preserving the existing `PublishedSource`, shell and design projections as one pinned version.
3. Implement job lease/checkpoint/retry/cancel/fencing rules and test them with disposable non-product fixtures. Then prepare the four-workbook/private-folder sandbox setup with exact permissions and operations for owner review before cloud writes.
4. Prove a real non-product round trip in an authorized isolated target before changing current app persistence. Continue the remaining phases using the plan; do not rebuild completed imagery or editors.

No runtime Google credentials or canonical target workbooks/folders are configured. Read-only owner connector access is not app access. Keep the current SQL/Blob system authoritative until complete Google-backed migration/auth/publication verification; no stale fallback or uncontrolled dual writes after cutover.

## Safe local commands and continuation

Use the existing Node 22 runtime (`../tooling/node22/node.exe` in this checkout):

```powershell
& ..\tooling\node22\node.exe --import tsx --test tests/google-workspace-*.test.mjs
& ..\tooling\node22\node.exe --import tsx --test tests/*.test.mjs
& ..\tooling\node22\node.exe node_modules/typescript/bin/tsc --noEmit --incremental false
& ..\tooling\node22\node.exe node_modules/eslint/bin/eslint.js src/lib/google-workspace/*.ts tools/google-workspace/*.mjs tests/google-workspace-*.test.mjs
# Requires the already prepared local cluster to be running; accepts no remote DB input.
# Choose a new run label; the tool refuses to overwrite its prior receipt.
& ..\tooling\node22\node.exe --import tsx tools/google-workspace/rehearse.mjs next-checkpoint
```

Do not run fixture preparation/seeds or replay the request-table repair. Preserve populated clusters and existing preview processes. No new background service was started by this foundation; completed audit/test processes and agents are idle. The pre-existing local preview remains available for the owner.
