# Owner decision: merge R8-3D, then develop R8-4A

**Date:** 21 September 2026

**Repository:** `rivyalivingart2/RivyaLivingArt2.0`

**Development branch:** `codex/r8-first-frontend`

The owner instructed: “Merge all things to main branch and go to next task R8-4A”.
This authorizes integration of the completed R8-3D checkpoint, then the next
frontend development slice on the safe branch. It does not supply visual approval,
waive final QA or authorize automatic merges of subsequent work.

## Completed main integration

PR [#10](https://github.com/rivyalivingart2/RivyaLivingArt2.0/pull/10) merged source
head `679a358b334bcc658226a3661ed6b6add2dff852` into main at
`6e1be895b98a147ce0f00102e2ade7f9881db9f6`. The actual remote main reference
was read back and verified. Development continued from that main merge, preserving
Git history. No force-push or branch deletion is authorized.

Existing Vercel Git integration may build production from main and Preview from
development. Read-only inspection reports Node `22.x` and authentication protection
`all_except_custom_domains`. No explicit deployment, promotion, environment,
runtime/protection setting or live-domain change was performed. Production fixture
denial and independently protected Preview access remain required.

## R8-4A development scope

Implement A01 and A04–A07 presentation through an isolated `/preview/studio`
harness: Studio shell/navigation, fixture-derived dashboard, product table,
local product drafts with confirmed tier changes and preserved field values,
and the typed customization form builder using the public field renderer.
Every harness layout/page and metadata path applies the current preview policy
before exposing fixtures. Keep the `/studio` holding boundary intact; a harness
link is visible only when preview is allowed. The visual harness is not staff
login, authorization or a simulated authenticated session.

The dashboard must distinguish Demo source counts from unconnected Live,
enquiry and import operations. Product list selection is explicitly scoped to the
current page. Local review and draft controls are labelled, require confirmation
where appropriate and do not mutate public fixtures or persisted catalogue data.
Builder fields and conditions remain typed and versioned; arbitrary JavaScript
and evaluation are excluded. Routes for future Studio modules state their planned
scope and integration status, rather than pretending their workflows exist.

Author twelve further LARGE source concepts (DP003–DP012 and DP015–DP016),
progressively expanding the demo catalogue to 36/120: 24 LARGE, 6 MEDIUM and
6 SMALL. Only two product images are mapped; 34 remain visual-pending. Twelve
article drafts, 42 FAQ answers and three fictional studies remain present.
Eighty-four products, 24 articles, 24 fictional testimonials and 40 operational
scenarios still need authoring. No fixture creates a database row, a manufactured
product, a real customer or a successful business operation.

Record actual implementation and compiler-only feedback in
`docs/R8-4A_STUDIO_CATALOGUE.md` and `PROJECT_STATE.md`.
**SOURCE_IMPLEMENTED:** R8-4A Studio catalogue presentation.
**UI_READY:** pending deferred visual/keyboard QA. **BACKEND_CONNECTED:** no.
**TESTED:** not run for this slice.

## Continuing constraints

The [development-first decision](2026-09-21-development-first.md) remains active:
all testing-related work is deferred until after backend/database integration.
Do not run or add per-slice lint/test/preflight, build verification, browser checks
or visual QA. Compiler/typechecking may resolve implementation wiring and does not
establish TESTED or UI_READY. Preserve existing tests, commands and assertions;
historical R8-3A results do not certify later source.

Frontend and Studio development precede the protected R8-5 handoff and owner
review, then backend phases. Do not invent owner approval. No backend, database,
authentication, upload, persistent draft/publication, session or messaging
integration starts in this slice. The custom CMS remains repository-owned.
Sanity, product scraping, Higgsfield, continuous Drive sync, in-CMS generation,
customer accounts, checkout/payment and rejected S01–S04 remain excluded.

**Next exact task:** R8-4B — content hub, page-section editor, Tiptap presentation,
FAQ/blog/testimonial editors, media picker, responsive layout preview and
autosave/validation/history presentation.
