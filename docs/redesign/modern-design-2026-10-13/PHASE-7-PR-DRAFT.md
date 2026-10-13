# Draft PR: Redesign the public website and Studio with preserved content and controlled motion

Owner authorized the complete GitHub release after reviewing the final Phase 7 report. This PR includes all seven approved redesign phases and their verification documentation.

## Problem and resulting behavior

The website and Studio previously used inconsistent page compositions and editing surfaces. This candidate applies the owner-approved Rivya design across the homepage, public page families and all 37 Studio modules. It preserves the original logo, main colours, content, URL behavior, media associations/crops, translations, drafts, business details, order records and existing save/publication/access controls.

## Changes

- Phase 1: isolated design previews, preservation baselines, route/section/Studio registers and approval checkpoints.
- Phase 2: reusable design/motion/media foundation, supplied Drive media register and responsive derivatives. Scoped GSAP and React adapter support deliberate desktop motion; touch/reduced-motion/keyboard paths retain native behavior.
- Phase 3: homepage and shared public frame, original section order/content, controlled film, stable focus/navigation and native scroll fallback.
- Phase 4: collections, products/gallery, customization/search/saved pieces, editorial archives/details, story/process/materials, contact/policies, landing blocks, utility states and print presentation.
- Phase 5: Studio shell and 24 content/editing bodies, native controls, product imagery, translation/crop/revision/preview surfaces; underlying persistence remains unchanged.
- Phase 6: 13 operational/admin bodies, readable order list/board/detail, staff/settings/navigation/analytics, sign-in and saved inquiry cards. Editorial display ordering remains distinct from order/commission stages.
- Phase 7: full local verification receipts and release handoff. ESLint now excludes generated verification bundles under `output/**`; source rules remain enabled.

## Validation

Fresh build/TypeScript; 344 unit, 12 preflight and 403 runtime checks; source lint zero errors with 62 existing warnings. Local HTTP checks cover 665 registered URLs, 232 assets and 299 additional internal links. Responsive public matrix: 570 checks. Studio matrix: all 37 modules at four widths, 489 checks including anonymous denial. Further checks cover search, gallery, shortlist, unsaved forms/editors, focus, languages, contrast, print, recovery and confirmation cancellation.

Installed axe-core returned no detected violations in 71 scans, with 14 explicitly incomplete contextual checks retained in the final report. Both film formats play; 145 raster files decode; 52 representative rendered image instances load. Six policy PDFs retain all 65 collected prose blocks across 15 pages. Seventeen approved/current visual pairs were compared with disclosed QA/native-tooltip differences.

All 24 local LCP samples are below 2.5s, including the defined throttled mobile simulation; worst LCP 1.888s and maximum CLS below 0.014. These are local lab results, not production or field guarantees.

## Data safety

All 1,657 Phase 7 start rows in 13 protected local scopes are unchanged. All 1,641 pre-redesign original rows remain unchanged across the redesign; 16 existing synthetic QA additions from Phases 5/6 are separately documented and do not ship as production data. All 163 original public files are byte-identical. No Phase 7 database mutation, content publication, Drive upload or message occurred. No schema migration is added by this redesign.

## Risks and release boundary

The local QA database has 480 older unpublished editorial drafts; this PR must not publish, import or overwrite them into production. Native device/reader/zoom, independent language/media-rights, genuine-inquiry and field evidence are not supplied by automated tests. Existing admin closures remain historical. Full report: `PHASE-7-FINAL-REPORT.md`; machine receipts and exact coverage are alongside it.

Owner authorization is recorded in AGENTS.md and CONTINUE.md. The main base and unchanged application candidate were freshly rechecked. Run PR checks, use the normal detailed-PR merge workflow, verify the deployment's exact commit and inspect public routes/media plus authenticated Studio. Do not bypass branch protection or treat a documentation merge as proof of production publication.
