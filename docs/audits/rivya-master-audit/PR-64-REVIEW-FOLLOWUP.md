# PR #64 review corrections — 19 October 2026

The automated PR review identified three P2 issues that the earlier application-only reachability review missed or did not cover. All three are corrected before merge; the earlier no-blocker review is not a claim that the first PR head had no defects.

| Finding | Correction | Verification |
|---|---|---|
| Runnable Phase 2 preview referenced removed prototypes | Archive the five prototype components/styles and their motion hook beside the experiment; update imports, server allowlist and isolated TypeScript configuration. Use an isomorphic layout effect with existing core GSAP matchMedia cleanup instead of restoring the unused wrapper package. | Preview build and isolated TypeScript pass; browser review 57/57, edge cases 22/22; 36 media variants retain byte counts; no observed runtime errors or external requests. |
| Shared browser guard missed non-throwing console errors | Collect error-level console messages and page exceptions. Exempt only exact URL/status resource diagnostics deliberately produced by 404/503 tests. Remove both listeners on teardown. | Four real Chrome regression cases exercise hydration-like console error, uncaught exception, exact matcher and cleanup. Full canonical rerun: 159 passed, 5 intentional skips, 0 failures/flaky, no retries. |
| Optional-resource instructions referenced retired imports | Correct current Poppins-loader/pattern-package availability and usage examples; annotate the historical retained-work decision rather than rewriting its original scope. | Reference and manifest inspection; actual Poppins files, notices, active typography and current gradients remain. |

The corrected browser run started at `2026-10-19T08:43:00.174Z` and lasted `170916.595ms`. It uses the existing final production-mode application build `AVszvoAaWRdzkbTXvBAcW`, Node 22.23.2, installed Chrome and guarded loopback QA at the four canonical viewports. Focused E2E lint and application TypeScript also pass. The first sandboxed attempt was blocked from local PostgreSQL before executing tests; the authorized local retry passed. Previously disclosed server stream-close/navigation warnings remain distinct from browser failures.

Raw E2E results stay ignored at `test-results/audit-release-review/e2e-final-results.json`; preview results stay ignored at `output/playwright/redesign-phase2/review.json` and `edge-cases.json`. The owned preview server was stopped. No screenshots, traces, private records or credentials are uploaded.

These corrections change experiments, tests and documentation only. Public/Studio application source, packages and lockfile are unchanged from the reviewed and built application candidate. No database, CMS, staff or media mutation occurred. The independent reviewer checked the final browser guard as well as the corrected preview; no actionable follow-up was found.

The earlier production request-table repair remains complete and must not be replayed. External acceptance limits in [RELEASE.md](RELEASE.md) remain.
