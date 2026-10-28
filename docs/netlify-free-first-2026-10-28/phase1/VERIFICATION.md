# Phase 1 local verification

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
