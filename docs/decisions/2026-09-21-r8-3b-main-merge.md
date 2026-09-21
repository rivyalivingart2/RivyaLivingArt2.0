# Owner decision: merge R8-3B, then develop R8-3C

**Date:** 21 September 2026  
**Repository:** `rivyalivingart2/RivyaLivingArt2.0`  
**Development branch:** `codex/r8-first-frontend`

The owner instructed: “Merge all things to main branch and go to next task R8-3C”.
This authorizes integration of the completed R8-3B development checkpoint, followed
by R8-3C development on the safe branch. It does not supply owner visual approval,
waive final QA or authorize later slices to merge automatically.

## Completed main integration

PR [#8](https://github.com/rivyalivingart2/RivyaLivingArt2.0/pull/8) merged source
head `ce37e7966c8b50105c539caee44fba70a5a15278` into main at
`cd6f91e55f8153b55a8c4af1f4329af1be81f38d`. The actual remote main SHA was
read back and verified. The normal merge preserves existing history; no force-push
or branch deletion is authorized. The existing Vercel Git integration may build
production from main. This instruction did not change domains, deployment
protection, environment variables or the production fixture guard.

## R8-3C development scope

Continue the existing public components and labelled source content: journal and
article pages, FAQ, about/process/materials/care, portfolio, contact, architect
enquiry and catalogue search. Author six complete article drafts (DB001–DB006),
the 42 FAQ answers and three clearly fictional project studies. These are preview
fixtures awaiting owner editorial review, not live business statements, real
completed projects or approved policies. No contact details, services or legal
terms may be invented. The current catalogue remains 24 typed products with two
existing images and 22 explicit visual-pending states.

The remaining 30 articles and full 120-product/24-testimonial/40-scenario source
content are still required in later bounded slices. This checkpoint does not claim
the complete frontend, full demo pack or database rows exist. Record actual scope
and development feedback in `docs/R8-3C_PUBLIC_PAGES.md` and `PROJECT_STATE.md`.

## Continuing constraints

The [development-first decision](2026-09-21-development-first.md) remains in force:
all testing-related work occurs after backend/database integration. Do not run or
add per-slice lint/test/preflight, build-verification, browser or visual-QA work.
Compiler/typechecking may resolve implementation wiring only and is not a TESTED
or UI_READY claim. Preserve every existing test, command and assertion. Historical
R8-3A evidence does not certify either later slice.

Continue public frontend, Studio and the protected R8-5 development handoff before
backend phases. Owner review remains owner-controlled; do not fabricate approval.
Keep production fixture denial, separately protected Preview deployments and all
previously rejected integrations/S01–S04 exclusions intact. No backend, database,
authentication, upload, persistence or messaging integration begins in R8-3C.

Read-only Vercel inspection during this continuation now reports Node `22.x`,
aligned with the application. The earlier mismatch is resolved in the current
project setting; this task made no setting change. The historical diagnosis remains
in `docs/VERCEL_RUNTIME_ALIGNMENT.md`.

**Next exact task after R8-3C:** R8-3D — remaining error/root-error/loading/
unavailable, form-failure and WhatsApp-fallback visual states, followed by Studio.
