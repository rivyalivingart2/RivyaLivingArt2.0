# Phase 2 — controlled writer, Drive documents and durable jobs

Continued from `43c0f14` on `codex/sheets-drive-foundation`. The local implementation is complete and independently reviewed. The owner subsequently authorized publishing all latest changes through a detailed PR into GitHub `main` and requested a Codex Cloud continuation prompt. This supersedes the earlier Git-only local hold; it does not authorize Google provisioning, database migrations, storage cutover or CMS publication.

## Delivered implementation

| Area | Working source and behavior | Verification boundary |
|---|---|---|
| Controlled writer | `controlled-writer.ts`: authenticated server policy, registered resources, revision/idempotency validation, relationship dependencies, exact literal grids and coherent history/audit/receipt validation. Compiler emits fixed-address record + ledger + audit + history writes. | Local concurrency, stale revisions, key reuse, manual edits/formulas, missing history, partial bookkeeping and bounded failures tested. |
| Remote coordinator | `writer-gateway.ts` and `tools/google-workspace/apps-script/Writer.gs`: signed expiring requests/responses, remote ScriptLock, guarded snapshot CAS, deadline admission, durable workbook uncertainty marker and one atomic canonical batch. | Exact Apps Script source executes in the local service emulator; signed transport, late commits, lost acknowledgements and restart recovery tested. Script is not deployed. |
| Large documents | `drive-documents.ts`, `drive-json-rest.ts`: complete canonical JSON, reserved registered Drive IDs, exact MIME/parent/bytes/hash verification, create-only REST uploads, same-ID recovery and small hashed Sheets envelopes. | The two existing large local records round-trip exactly in RAM. No actual Drive file or identifier has been created. REST multipart creation is bounded at 5 MiB; larger creation explicitly rejects. |
| Coherent publication | `publication-bundle.ts`: one version of source, shell, design and approved asset manifest; trusted public projections; asset verification before atomic pointer CAS; one pinned read. | Failure, concurrent publisher, privacy projection and mixed-version cases tested. An old pointer observed after an uncertain CAS is still an unknown outcome because a late commit remains possible. No CMS publication is performed. |
| Durable jobs | `durable-jobs.ts`, `canonical-job-store.ts`: canonical Sheets-backed CAS adapter, frozen inputs, leases/fences, checkpoints, retry/backoff, cancellation, output identities and bounded dispatch. | Independent runner instances resume from provider state. Expired workers cannot advance; an unconfirmed CAS, including abort/timeout races, prevents cleanup or replacement writes. No worker/trigger is installed. |

The end-to-end local test follows a non-product job through the signed writer, the actual Apps Script source and its atomic Sheets emulator, then through the Drive document adapter. It creates an artifact, interrupts the worker before saving its output reference, restarts the worker/gateway, resumes the job and verifies that the same artifact is reused and the durable job finishes with coherent audit/history. This is stronger than isolated mocks but remains local emulation, not Google account acceptance.

The new modules are not imported by the running application. The existing database and Blob provider remain authoritative. No products, archived imports, user accounts or business records were added by this checkpoint. No login presentation or security behavior was changed.

## Data and artifact evidence

The read-only rehearsal accounts for all **406 existing QA rows in 28 tables**, with **230 columns and 45 SQL constraints**: 404 inline record round trips and two complete document round trips of **46,644** and **46,665 UTF-8 bytes**. Full content hashes agree; source values are neither truncated nor exported. These are synthetic loopback records, not a production export or recovered old database.

The original Phase 2 baseline includes 926 tracked application/media/package files. Core Phase 2 adds inactive modules. The later owner-authorized release preparation changes a small, explicitly recorded set of existing source files to deliver approved images without private files and prevent queries against uninstalled tables. The final preservation receipt reports those exact exceptions; it must not claim every baseline source file stayed byte-identical. Existing database rows/schema and original login/design/media assets remain protected.

Raw before/after hashes, logs and the document rehearsal are ignored under `test-results/google-workspace-phase2-2026-10-24/`. They must not be pushed or recreated as business data. The sanitized [verification receipt](phase2-verification.json) records final checks and hashes. The earlier [foundation receipt](verification.json) remains historical evidence for `43c0f14`.

## Release preparation

The full branch includes earlier approved public design, media and Studio work that had never been pushed. Release checks therefore cover the complete `origin/main` comparison, not only the Phase 2 files. Two concrete prerequisites were found: approved creation images depended on ignored local files, and new extension queries assumed an uninstalled schema. The release prepares a sanitized public derivative package and capability gates the schema-dependent features. No database migration is bundled or run automatically. Existing source originals and private lineage evidence remain local.

The exact latest head, PR, checks, merge commit and deployment outcome belong in the PR/deployment receipt. A Git merge does not prove Google runtime activation, production record reconciliation or full Studio parity.

## Next work

Read [the isolated target plan](ISOLATED-TARGET-PLAN.md) and [Cloud continuation prompt](CONTINUE-IN-CODEX-CLOUD.md). Real Google resources, private runtime credentials, protected ranges, script deployment and non-product provider acceptance remain pending separate external authorization. The target plan defines the four workbooks, private folders, permissions, structural cells, exact calls and recovery evidence without creating anything.

After that acceptance, continue the existing phases 3–11. Reuse this writer, document store, job adapter, existing editors and selected media. Do not introduce SQL emulation, a second canonical database, uncontrolled dual writes or an old-database fallback after cutover. Do not replay request-table repair, historical seeds, prior publications, archived imports or image generation.

For a portable checkout use Node 22 and `npm ci`, then `npm test`, `npm run test:preflight`, `npm run lint` and `npm run build`. Google module tests require no cloud credentials or private files. The optional local source rehearsal `node --import tsx tools/google-workspace/rehearse-documents.mjs <fresh-label>` requires the already-existing guarded Windows QA cluster; it intentionally refuses arbitrary database URLs and is not available in a fresh Cloud checkout.
