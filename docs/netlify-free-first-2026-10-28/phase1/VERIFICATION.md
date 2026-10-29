# Phase 1 local verification

## Pending-work continuation on local baseline `9a4c26b`

The later continuation adds bounded read-only source paging/fragments, conservative source-encoding capacity measurements and refreshed provider/browser evidence. Application source and runtime configuration remain unchanged. Source rows are assembled only in memory; accepted metadata is written through the existing owner-only private-file helper.

- `node --import tsx --test tests/google-workspace-live-source.test.mjs tests/google-workspace-source-capacity.test.mjs tests/google-workspace-migration.test.mjs tests/google-workspace-writer-gateway.test.mjs tests/phase1-capacity-plan.test.mjs`: **43/43 passed**. Cases include changed initial/readback/final fingerprints, incomplete or altered fragments, Unicode code points, invalid request/byte bounds, conservative omitted-empty-cell wire sizing, lossless migration planning and existing writer conflict/unknown-outcome behavior.
- The writer-gateway tests execute an emulator. They do **not** satisfy the five real Google safety checks.
- Current authenticated browser evidence is in [authenticated-browser-readback.json](../phase0/authenticated-browser-readback.json): owner login and reload, 36 route admissions and narrower existing-product read-only checks. No save, publication or complete workflow acceptance is inferred.
- Four signed Google `read` calls, saved editor-source comparison and exact registered workbook metadata are in [the pending-work report](../PENDING-CLOSURE.md). No Google commit occurred.
- Source measurement attempts that timed out or found changing security records were rejected and are not completion evidence. The accepted measurement, if present, is separately identified in the pending-work report.

The commands above ran with the available Node 24.14.0 and the project's `tsx` loader. The repository's declared runtime is Node 22; this is a local tool check, not validation of a different deployment runtime. An initial invocation without the required loader failed before source access; it was corrected to the documented command.

Final checks at 17:49 UTC: targeted ESLint completed with no diagnostics; `git diff --check` passed. All 1,198 protected files and 21 public capture hashes matched. All 356 checked local Markdown links resolved. Twenty-three changed/new files contained none of the ten retained private writer values checked; this limited scan supplements deliberate exclusion of private identifiers and record contents, not a universal privacy guarantee. Sanitized capacity output matches the private accepted report and its reader/collector source hashes. No application or public asset file changed. Aggregate verification metadata is retained under ignored `test-results/netlify-pending-20261028/`.

The successful live source run finished at 17:43:16 UTC: 22 tables / 3,455 rows, 36 constraints, all 20 business-table fingerprints unchanged. It rejected the current Content protocol's capacity using measured lower bounds. It created no target records, backup or restore; it is not a migration receipt.

## Earlier architecture-only checkpoint

Source/application baseline: local `c3cb484081232170895151674742de4ec8c6fa61`, with unchanged application code at `41cda9c20947dface0b027484106d0bbcc0cdd14`. Scope: architecture documents, aggregate census/assessment and the offline planning tool. No provider mutation or deployed behavior is claimed from these checks.

## Commands and evidence

- `node --test tests/phase1-capacity-plan.test.mjs`: targeted offline planning tests; source volume/capacity, absent-table semantics, quota/readback accounting, invalid input rejection and private-field exclusion.
- `npx eslint tools/phase1-capacity-plan.mjs tests/phase1-capacity-plan.test.mjs`: targeted lint.
- `git diff --check`: whitespace/patch verification.
- Recompute the capacity assessment from the committed aggregate profile and normalized-source-hash policy; compare the complete JSON with the saved report.
- Rehash the 1,198 protected files against the Phase 0 manifest, check new documentation links and scan the changed files for obvious credential/provider-ID leakage. Detailed results are recorded in the ignored local `test-results/netlify-free-first-phase1-20261028/` evidence directory.

The policy binds schema/writer hashes using UTF-8 with LF line endings so equivalent Windows/Linux checkouts agree. It does not bind or certify an installed Apps Script version. Counter arithmetic is a model; it does not certify real quota accounting, throughput or migration time.

Final local check at 15:42 UTC: **5/5 targeted tests passed**, targeted ESLint passed with no diagnostics, and `git diff --check` passed. The generated assessment reproduced exactly. All **1,198 protected files** matched their prior hashes; **34 local documentation links** resolved; **23 changed/new files** passed the obvious-secret/private-provider-URL scan. No application files changed. A pattern scan is a limited check, not a general guarantee that arbitrary prose contains no sensitive information; the new reports also deliberately exclude raw records, account IDs and monetary values.

No full application build/test rerun was performed for this documentation/offline-tool-only step. Earlier 767 unit / 12 preflight / 663 HTTP results remain historical application evidence at their own revision.

Real public browser and provider metadata observations are separately scoped in [Phase 0 follow-up](../phase0/FOLLOWUP.md). No authenticated Studio pass, full responsive matrix, five Google acceptance passes, target migration, restore, preview, deployment, release or retirement is inferred.
