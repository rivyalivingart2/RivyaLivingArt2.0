# Owner decision: merge R8-4A, then develop R8-4B

**Date:** 21 September 2026

**Repository:** `rivyalivingart2/RivyaLivingArt2.0`

**Development branch:** `codex/r8-first-frontend`

The owner instructed: “Merge all things to main branch and go to next task R8-4B”.
This authorizes integration of the completed R8-4A checkpoint, followed by R8-4B
source development on the safe branch. It does not authorize automatic merging
of the new R8-4B slice, supply visual approval or waive the final QA phase.

## Completed main integration

PR [#11](https://github.com/rivyalivingart2/RivyaLivingArt2.0/pull/11) merged source
head `0691ef45500dc679577aaf1f77ea534f5c98bb67` into main at
`8b8c81f5d85bf0a78d165184b3d8e460073452e4`. The actual remote main reference
was read back and verified. Development continues from that merge, preserving
Git history. No force-push or branch deletion is authorized.

Existing Vercel Git integration may build the production holding page from main
and a Preview from development. Read-only inspection reports Node `22.x` and
authentication protection `all_except_custom_domains`. No explicit deployment,
promotion, environment, runtime/protection setting or live-domain change was
performed. Production fixture denial and separately protected Preview access
remain required; a visual flag and `noindex` are not authentication.

## R8-4B development scope

Continue the existing Studio harness with the content hub, typed page-section
composer, actual Tiptap editor, article/FAQ/testimonial editors, shared media
picker, responsive preview and local autosave/validation/history presentations.
Use stable content, section and media IDs, schema versions and shared public
renderers. Keep product specifications and prices owned by the catalogue.
The marketing section composer remains separate from product inquiry forms.

Add the exact 24 supplied fictional testimonials DT001–DT024, with permanent
sample disclosures and no customer photos, ratings or endorsement claims.
Source counts become 36/120 products, 12/36 full article drafts, 42/42 FAQs,
24/24 fictional testimonials, three fictional studies and 0/40 operational
scenarios. The two existing product images remain preview-only; 34 product
visuals are still pending. Fixtures are not database rows or customer evidence.

Install the actual compatible Tiptap dependency set and regenerate the npm
lockfile. Do not fabricate an editor, install premium/cloud collaboration or
change the existing Next/React pins merely to restart setup. Local editing,
checkpoints, restore, archive and simulations must not claim persistence,
publication, server authorization or real staff activity.

Record source behavior and compiler-only feedback in
`docs/R8-4B_CONTENT_WORKSPACE.md` and `PROJECT_STATE.md`. Publish the new
development checkpoint separately and verify its actual remote SHA/tree.

## Continuing constraints

The [development-first decision](2026-09-21-development-first.md) remains active:
all testing-related work is deferred until after backend/database integration.
Do not run or add per-slice lint/test/preflight, build verification, browser checks
or visual QA. Compiler/typechecking may resolve implementation wiring, but cannot
establish TESTED or UI_READY. Existing checks, tests and assertions stay intact.

Frontend and Studio work precede the protected R8-5 handoff and owner review,
then backend phases. No backend/database, staff authentication, storage/upload,
persistent CMS save/publication, scheduling or messaging integration starts in
this slice. The custom CMS remains repository-owned. Sanity, scraping,
Higgsfield, continuous Drive sync, in-CMS generation, customer accounts,
checkout/payment and rejected S01–S04 remain excluded.

**Next exact task:** R8-4C — enquiry pipeline/status details and internal notes,
catalogue import/export controls, demo manager/remove dialogs and independent
menu visibility.
