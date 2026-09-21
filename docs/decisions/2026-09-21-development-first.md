# Owner decision: development first, final QA after integration

**Date:** 21 September 2026  
**Repository:** `rivyalivingart2/RivyaLivingArt2.0`  
**Development branch:** `codex/r8-first-frontend`

The owner instructed, in order: merge R8-3A into main, move **all testing-related
work to the final stage after backend/database integration**, then develop R8-3B.
This dated instruction supersedes per-slice test and visual-QA gates in AGENTS,
the workflow and older Revision 8 briefs. It changes when QA occurs, not the final
feature scope or the meaning of a passed check.

## Completed main integration

PR [#7](https://github.com/rivyalivingart2/RivyaLivingArt2.0/pull/7) merged R8-3A at
`0999b3b0a873e0745231f119c1567b3f8cd79fd8`. The remote SHA was verified. R8-3B and
later slices continue on the safe development branch; this instruction does not
automatically authorize their main merge, a production release or domain changes.
The existing Vercel Git integration can build deployments when branches change.

## Effective development sequence

1. Develop R8-3B commission, preservation and gifting form visuals.
2. Continue R8-3C public pages, R8-3D remaining states, then R8-4 Studio visuals.
3. At R8-5 provide the exact branch/SHA and protected Vercel frontend-preview
   instructions as a development handoff. Preserve the owner's visual-review
   control; do not claim approval or production readiness. Full QA is not a
   prerequisite to backend integration under this override. Await owner review or
   an explicit instruction to continue, as required by the handoff.
4. Implement the backend/database and remaining integration stages, then perform
   the final consolidated QA before the owner-led full deployment handoff.

Do not run or add test work, lint/test/preflight suites, build verification,
browser checks, screenshot QA or visual-review audits during development slices.
Compiler/typechecking is permitted only to resolve implementation wiring; this
limited development feedback is not a QA pass. Keep existing test files, scripts,
assertions and checks intact. Do not silence errors, weaken checks or remove them
to satisfy the new order. The final QA stage must exercise the completed frontend
and actual backend/database integrations and fix failures before release claims.

Continue Git checkpoints and remote-SHA verification after coherent development
slices. Record SOURCE_IMPLEMENTED, UI_READY, BACKEND_CONNECTED and TESTED separately.
R8-3B is untested under this decision; prior R8-3A results do not certify new source.
Preserve historical evidence and recorded failures unchanged.

## R8-3B boundary and continuation

R8-3B uses typed client-only form state at `/commission?piece=slug`,
`/preserve?piece=slug` and `/personalize?piece=slug&variant=id`. It provides local
validation, a local summary, optional local reference-image preview and an
explicitly simulated receipt. It does not upload, persist, submit an enquiry or
send a message. The 24 labelled source fixtures remain unchanged. Actual scope
and compiler-only feedback belong in `docs/R8-3B_INQUIRY_FRONTEND.md` and the
current checkpoint, without a TESTED claim.

No backend, database, auth or storage integration starts in R8-3B. Preview
protection and the production fixture guard remain required; a preview flag is
not authentication. Previously rejected integrations and S01–S04 remain excluded.

**Next exact task after R8-3B:** R8-3C — implement journal/article layouts, FAQ,
about/process/materials/care, portfolio, contact, search and approved service-page
frontend surfaces, with progressively authored, labelled demo content.
