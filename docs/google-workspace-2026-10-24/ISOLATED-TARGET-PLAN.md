# Isolated Google acceptance target — prepared, not created

This is the exact next external setup for owner review and account configuration. The owner authorized the current GitHub PR/main release and requested service-specific placement; [the placement register](SERVICE-PLACEMENT.md) distinguishes each destination from what is installed. No target IDs, app credentials, workbooks, folders, sharing grants, Apps Script deployment, triggers or Google writes have been created by Phase 2. Read-only connector access does not supply runtime application credentials. Do not use the existing catalogue/Sheets lists as targets or import them.

## Resource and access plan

| New resource | Purpose and initial contents | Access boundary |
|---|---|---|
| `Rivya Workspace Sandbox — Content` | Empty canonical document and publication-pointer probe; no real content publication | Owner; dedicated writer identity as editor; server reader only as needed |
| `Rivya Workspace Sandbox — Operations` | Empty synthetic non-product job probe and private document references | Owner and dedicated writer/worker only; no public/editor sharing |
| `Rivya Workspace Sandbox — Security` | Empty non-secret probe for testing a separate confidential boundary | Owner and dedicated security writer only; no passwords/sessions copied in this phase |
| `Rivya Workspace Sandbox — System` | Empty reconciliation/receipt probe | Owner and dedicated migration operator only |
| `Rivya Workspace Sandbox` private Drive root | New empty `Originals`, `Derivatives`, `Private Attachments`, `Publication Snapshots`, `Catalogue Templates`, `Catalogue Outputs`, `Jobs`, `Recovery` subfolders | Restricted owner/service identities; no anyone-with-link permission or edits to supplied folders |

Initially register exactly one non-product probe per workbook. Each probe has separate `records`, `ledger`, `audit`, `history` tabs; co-locate all four in that same workbook. If multiple resources are later registered in one workbook, each needs its own four tabs, and all share **one** `writer_control` tab for workbook-wide uncertainty fencing. Configure one writer script deployment and one shared ScriptLock for this accepted boundary; additional independent scripts must not write the same canonical tabs.

Use the exported header constants in `record-codec.ts` and `controlled-writer.ts`, not hand-transcribed headers. Initialize `writer_control!A1` to the canonical serialization of `{format:"rivya-writer-gate-v1",state:"ready",mutationId:null,requestSha256:null,actorId:null}`. Initial grid size: 100 rows × 12 columns per tab, including the control tab; registry limits must match. Growth beyond the approved registration is a reviewed capacity change, never silently ignored. No data-bearing row is seeded. Direct editing belongs in separate input/proposal tabs; it must never overwrite canonical rows.

Protect canonical identifiers, header rows and complete canonical tabs against ordinary editors. Separate workbook sharing provides confidentiality; hidden tabs and range protections do not. A workbook owner or unrelated API identity can still bypass ScriptLock and protections. Those clients must not edit canonical data while the writer is active. Complete-sheet fingerprints detect intervening changes, while record/ledger/audit/history consistency detects partial tampering; these are **not** a cryptographic defense against an owner rewriting every history and digest coherently.

## Exact activation sequence, after external authorization

1. Create the named empty resources and review their actual owners, sharing and writer identity. Save real resource IDs only in a private registry; examples or emulator IDs are never valid registrations. Do not reuse existing production workbooks, folders or catalogue files.
2. Initialize only structural headers and control cells, then protect them. Validate IDs, actual grid bounds, range permissions and the same workbook control ID across resource registrations. Keep direct-input tabs separate and route later reviewed proposals through the controlled writer and existing domain validators.
3. Create the isolated Apps Script project from `tools/google-workspace/apps-script/Writer.gs` and its manifest. Enable the advanced Sheets v4 service. Store a generated signing secret and the exact resource registry in private Script Properties (`GW_KEYS_JSON`, `GW_RESOURCES_JSON`). Configure the corresponding server secret through its secret store. Neither business Sheets nor browser code receives it. No Apps Script scheduler or trigger is needed: explicit server dispatch only.
4. Deploy the isolated gateway with the appropriate owner/service execution identity. Record its exact URL, script version, permissions and key identifier privately. HMAC binds operation, request ID, expiration and complete payload; responses are signed and tied to that request. Test the actual Google ContentService redirect through the client. This authentication/permission setup has not been verified against a real account locally.
5. Reserve Google Drive IDs with `files.generateIds`, and durably register each ID, parent, purpose and application owner before creating bytes. Use an approved non-product document. The REST adapter only creates JSON at that registered ID; it never updates, deletes, shares, converts native Docs/Slides or searches filenames. Its multipart create ceiling is 5 MiB; larger files need a separately implemented resumable transport, not truncation.
6. Execute the non-product acceptance matrix below. Save raw evidence privately, and a sanitized receipt in the repository. Only then consider future migration/provider integration. No app persistence, public publication or login switch is part of this activation plan.

## Required real-provider acceptance

| Scenario | Evidence needed before marking verified |
|---|---|
| Signed read/write/reload | Actual Sheets row plus matching ledger/audit/history and a committed control marker; then an independently refreshed server read |
| Concurrent clients | One valid revision advancement per accepted command; stale/reused-key conflicts; no duplicate rows or partial bookkeeping |
| Lost response and interrupted script | Durable marker/receipt inspected; replay original mutation; no new mutation used to guess whether the old one committed |
| Human/API edit and formula injection | Editor protection exercised; bypassed edits detected and fenced; no evaluated formula accepted as canonical literal content |
| Drive JSON | Actual reserved ID/parent/MIME/byte length/SHA-256 matches, same-ID retry returns exact original bytes, another private ID cannot be fetched |
| Jobs | Independent worker processes resume from Sheets checkpoints; expired/fenced/cancelled workers cannot save output state; duplicate outputs reuse registered IDs |
| Publication | Complete source/shell/design/assets candidate verified before CAS; simulated failure retains previous pointer or reports uncertainty; each read pins one version |
| Provider failures and quotas | Actual authorization denial, rate limiting and latency behavior measured; no sensitive response body leaks; login remains on its current provider |

## Quarantine and recovery

The gateway writes an `inflight` marker before issuing the canonical batch. That batch atomically writes the record, receipt, audit, history and `committed` marker. If a response is lost, the gateway never assumes failure or resends a batch automatically. A confirmed receipt supports replay; an unresolved marker fences new writes to that workbook. The server's original expected revision and mutation ID must be retained.

An absent ledger row immediately after a timeout is **not** proof that the operation cannot still commit. There is deliberately no automatic "clear quarantine" API. Before any operator clears a marker, establish the original remote invocation's terminal outcome, inspect the exact intended row/ledger/audit/history/control changes, and capture a private recovery checkpoint. If there is no definitive outcome, leave the scope fenced. If recovery is proven, reconcile under the same writer lock; never clear a live marker manually while another invocation can still apply. This prioritizes preserved data over availability and is an explicit operational tradeoff.

The deadline on worker writes is checked by the gateway under the lock before dispatch. It is an admission deadline, not a promise about Google's physical commit timestamp. A late uncertain provider request remains fenced, so a newer worker cannot race it through this gateway. External side effects must also use deterministic output IDs and their own permission/idempotency checks; cancelling a job cannot undo an already-created immutable file.

Official contracts checked for this implementation: [Sheets atomic batches](https://developers.google.com/workspace/sheets/api/guides/batch), [Apps Script locks](https://developers.google.com/apps-script/reference/lock/lock-service), [ContentService redirects](https://developers.google.com/apps-script/guides/content), [Drive pre-generated IDs](https://developers.google.com/workspace/drive/api/reference/rest/v3/files/generateIds), [Drive file creation](https://developers.google.com/workspace/drive/api/guides/create-file). Account permissions, latency and quota capacity still require the actual isolated run.
