# Release checklist â€” not executed

Phase 7 local verification and the owner-facing report are complete. The owner reviewed the report, confirmed redesign completion and instructed "PUSH ALL THINGS INTO GITHUB" on 13 October 2026. Push, detailed PR/main merge and normal release verification are now authorized. The GitHub PR will carry the final execution/deployment receipt; unchecked execution items below must be verified there.

- [x] Fresh local build and TypeScript pass on the approved candidate.
- [x] Unit, preflight, runtime, public/Studio browser, media, language-layout, print and scoped accessibility checks recorded.
- [x] Data/asset preservation and known evidence limits recorded.
- [x] Current GitHub main read-only check matches `4cadf21b380a8f3753232318fbb78027aa09ffc5`.
- [x] Detailed local PR body prepared in PHASE-7-PR-DRAFT.md.
- [x] Owner reviews PHASE-7-FINAL-REPORT.md and its findings, including 14 incomplete accessibility rule instances and 62 existing lint warnings.
- [x] Owner explicitly authorizes push/release.
- [x] Recheck branch/base, current working tree, candidate source and any drift since this verification.
- [ ] Push the candidate branch and create the detailed PR into main; attach it to the task.
- [ ] Verify required repository/hosting checks and review any new changes.
- [ ] Merge through the normal repository policy; do not bypass protection.
- [ ] Confirm production READY and exact deployed commit equals the approved merged candidate.
- [ ] Verify live public routes, images, video, language behavior and safe customer navigation.
- [ ] Verify authenticated production Studio with the owner's real session; credentials stay in Studio, never chat.
- [ ] Confirm production content/drafts/media associations/order records were preserved. Do not replay the 480 publications, translation publications, synthetic imports or prior homepage selections.
- [ ] Record deployment receipt, live evidence and any production-specific limitations; distinguish field/native/human observations from emulation.

If a deployment fails, diagnose from read-only logs first. A rollback must use an existing known-good deployment/commit and preserve database content. No reset, reseed, destructive cleanup, scraper, old-product transfer or backup work is part of this checklist.
