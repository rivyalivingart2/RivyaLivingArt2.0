# Audit and acceptance release — 19 October 2026

## Authorization and identity

Owner instruction: **"push all things into main git branch"**. This authorizes the complete accumulated local source and documentation bundle through a detailed PR into main, normal Git-integrated deployment, and read-only live verification. It supersedes earlier local-only holds for this bundle.

- Source branch: `codex/audit-pending-completion`.
- Previously released baseline: `66e82ef04f76b8460654bab4329ccbadfb47f28e` (PR #63).
- Reviewed application/documentation checkpoint: `bd6467538863e72350f3fb6bd3e0dcd8bdb827fb`.
- Included earlier checkpoints: `40907ff`, `ad84a2a`, `e7000c4`, `016d332`.
- Hosting target: existing `rivya-living-art2-0` project; production domain [www.rivyalivingart.com](https://www.rivyalivingart.com/).
- Release status at preparation: authorized; remote push/PR/merge and deployment still to be verified. The release PR description will carry the exact head, merge SHA, deployment ID and final live observations, avoiding a self-referential commit receipt.

## Included changes

1. Cinematic acceptance refinements: stronger media text scrims and focus indicators, common Inter font subset weight reduced by 41.6% while retaining fallback glyph coverage, and deferred automatic hero playback until opening poster/font readiness. Motion pause, reduced-motion and low-memory fallbacks remain.
2. Compatible dependency repairs: Next and its ESLint config 16.3.8, Sharp 0.35.5 and source-map-js 1.2.2.
3. Editorial/SEO correctness: effective Hindi/Gujarati language and English fallback boundaries, with structured-data language matching rendered editorial content and escaped JSON preserved.
4. Studio workflow fixes: collection tabs, comparison keyboard access, duplicate confirmation, related-product edge cases, clearer follow-up assignee handling, and impossible calendar-date validation.
5. Confirmed-unused cleanup: the exact 14-source-file manifest and two unused packages in [FOLLOWUP-CLEANUP.md](FOLLOWUP-CLEANUP.md). Inactive Bulk Import and Subscribers entries are removed from navigation/search; 37 registered routes and guarded bookmarks remain. Core GSAP is retained.
6. Translation overview: 20 cards per page; metadata-only overview response reduces 603-record parsed entry bytes from 6,256,425 to 206,124 (96.7%) while retaining both Hindi/Gujarati status calculations. This is not a claim of equivalent compressed network or database-read savings. Full-record editing remains intact.
7. Accurate request-queue load errors and recovery, with decisions disabled until a current successful load; pagination now announces meaningful page status without prohibited ARIA.
8. Expanded isolated service/SQL/browser lifecycle tests, safe QA tools, ten master-audit deliverables, follow-up reports, and the record of the separately approved request-table repair.

## Evidence and review

Application build `AVszvoAaWRdzkbTXvBAcW` includes the final application changes. Its fresh 19 October checks passed:

| Check | Result |
|---|---|
| Unit / runtime / preflight | 377 / 403 / 12 passed |
| Lint / type generation / type checking / production-mode build | Passed; lint has 0 errors and 62 existing warnings |
| Pagination contrast / focus | 53 snapshots, 2,390 repeated text comparisons and 15 focus observations; zero failures |
| Pagination automated accessibility | 3 scans; zero violations; contextual contrast incompletes remain disclosed |
| Actual browser/HTTP lifecycle | 34 checks passed against isolated synthetic SQL and actual Next login/API/public responses; before the later independent pagination-only change |
| Exact repair SQL | 37 checks passed against disposable synthetic PostgreSQL; two pre-existing synthetic rows unchanged |
| Earlier same-day canonical E2E | 155 passed, 5 intentional skips, 0 flaky; not rerun after pagination-only change |
| Earlier translation / service lifecycle | 39 / 46 passed; 1,658 protected QA rows across 13 scopes unchanged |
| Independent full-bundle source review | No actionable release blocker across the five-commit, 148-file source bundle |

The independent review checked deployment/package hooks, SQL/tool entry points, deleted-source reachability, active navigation, public-field projection, localization, inquiry validation, media/font fallbacks and Studio request/error behavior. No automatic database repair, raw screenshots/traces/dumps, or credential literals were found. Only binary changes were the three documented font subsets.

Detailed evidence: [final continuation report](PENDING-FINAL-REPORT.md), [final receipt](pending-final-verification.json), [earlier completion report](PENDING-COMPLETION.md), [security/release review](SECURITY-RELEASE-REVIEW.md), and [cinematic acceptance follow-up](../../redesign/sitewide-cinematic-2026-10-16/ACCEPTANCE-FOLLOWUP.md).

## Release procedure and boundaries

Push the reviewed branch, create a detailed PR, wait for its exact-head hosting checks, review comments/checks, merge with the expected head, then verify the main commit's READY production deployment and public-domain aliases. Confirm representative live public pages/media, mobile layout, Studio navigation/translation pagination and the repaired request queue read-only where the existing session permits. Repeat bounded production cold-load measurements separately from field acceptance.

The additive request-table repair was already approved, applied once and verified before this release. Do not rerun its SQL or any migration/fixture/import. There is no build/deployment hook invoking those tools. No CMS publication, business-record write, staff approval/reset or outgoing message is authorized by this source release. Normal authenticated session bookkeeping is distinct.

Raw screenshots, traces, performance captures, synthetic/private records and browser sessions remain in ignored `test-results/` directories. They must not be committed or attached publicly.

## Remaining acceptance limits

- Physical phone/tablet and native-reader observations remain unavailable under the owner's existing constraints. Emulation and automated semantics are not substitutes.
- Real storage-provider upload/read/delete and full external-restore acceptance require a separate disposable provider environment; no shared-production write test is permitted.
- Repeated released mobile cold loads and field p75 must be reported from measurements. Local lab results are not field certification.
- Finite frame/gradient contrast samples do not establish every animation state; contextual automated incompletes remain disclosed.
- The development-only braces dependency advisory remains deferred pending a safe compatible upstream chain; do not describe the entire dependency graph as vulnerability-free.
- Successful empty request-queue reads do not certify every genuine staff approval/recovery scenario.
- This release preserves logo, palette, content, media/crops, active routes, database contracts and the customer-controlled manual WhatsApp journey. It does not certify the absence of all unknown defects.

Earlier audit receipts intentionally retain their dated no-release statements. This document and the current owner checkpoint supersede those statements for this release only.
