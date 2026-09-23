# Active approved plan — Phase 4 complete

The owner authorized Phase 4 and GitHub publication; read docs/decisions/2026-09-23-phase-4-execution.md. The canonical plan is docs/redesign/RivyaLivingArt-Commercial-Implementation-Plan.md revision 3.4. Read PHASE-4-CATALOGUE.md, phase-4-products.json and IMPLEMENTATION_PROGRESS.md in docs/redesign; retain Phase 2 contracts/runbook as the integration authority.

P4.1–P4.6 catalogue/discovery source work is complete. Next is P5.1: reconcile field families and actual capabilities for all products; begin with the DP110 earrings and DP119 ring-dish size-field findings. Branch codex/phase-4-catalogue starts from Phase 3 merge 47323c51a9c225cac0ee719203612bc579d5ede0. Verify current Git refs; do not restart or repeat approval. Formal QA is Phase 11 and release Phase 12.

WhatsApp is only saved-order handoff with manual Send and saved-order Open/Copy. Preserve database/Studio records, private references, drafts and supplied assets. No generic WhatsApp, payments, carts or customer accounts. Vercel-only/free-only and automatic-deployment hold remain; no Netlify. No Phase 4 migration, catalogue publication or deployment occurred. Main/production release waits for final gates.

Older records below are historical where superseded.

---

# Redesign continuation checkpoint

Updated 23 September 2026. Full master and supplied product/policy/image use are approved. No repeat plan approval is needed.

Latest owner override: publish all saved source to the GitHub work branch; use Vercel only. Netlify onboarding is cancelled and its source integration removed. Commercial hosting remains on hold under free-only constraints. Read docs/decisions/2026-09-23-vercel-only-hold.md and VERCEL-COMMERCIAL-USE.md before proceeding. Automatic Git deployment is disabled in vercel.json; do not manually deploy this commercial candidate.

GitHub source publication succeeded on codex/whatsapp-order-experience. Remote implementation commit 583b0b61c2635ffe0793425c95f63040bec20202 was verified; it includes the complete redesign checkpoint and Vercel-only correction. Main remains f9533bb. See github-publication.json; no new Vercel deployment was returned in the post-push check. Subsequent documentation commits preserve this receipt.

## Current work

- Phase 2 and Phase 3 complete. Phase 4 complete at its source implementation gate. Phase 5 templates and copy candidates implemented; final instance/media review and deployment-specific policy wording remain. Phase 6 schema applied but local runtime connection blocked by masked provider secrets. Phase 7 all S01–S17 source implemented, with backend proof pending. Phase 8 source refinement underway. Formal Phase 9 QA has NOT started.
- Branch codex/whatsapp-order-experience; original baseline/main f9533bbbaf3cc2843025f1a1243442b0a9d920e8. All 33 inherited drafts preserved in baseline snapshot. Main and existing production unchanged.
- Read the approved master revision 2.5 section 18, AGENTS.md and PROJECT_STATE.md. Master path ../../outputs/RivyaLivingArt-Master-Full-Website-Redesign-Plan.md from repository.

## Applied Preview schema

Private snapshot rla_backup_20260923_p6 before the inquiry migration. Inquiry, content/media, storage-provider column, business-settings and revision-history migrations all succeeded in Preview. See INFRASTRUCTURE.json for resource identity and receipts. Production untouched. Never rerun blindly.

## Prepared source

- Public journey: URL discovery, three collections, gallery/swipe/zoom, native search/menu dialogs, 120 per-product field schemas, three-step customization, atomic inquiry+Studio save and private receipt before WhatsApp, full-copy fallback and upload retry recovery.
- Editorial: 36 revised original article candidates, 11 page/policy documents, approved image selection/related pieces, all aliases/metadata/robots/sitemap. Real-project template and empty portfolio provided; 8 fictional projects and all fictional testimonials/orders withheld.
- Catalogue copy: reviewed-product-copy.json removes obsolete demonstration labels and generic dimensions contradicted by the described forms; stable IDs/slugs retained. Public fields are explicit requests subject to atelier confirmation.
- Studio: overview, scoped list/board/detail, manual orders, assignment/follow-ups, notes, audit/export, product/form/gallery editing, draft/live comparison, content/media editing, staff, business settings, expired-upload cleanup, durable revisions and restore-to-draft. Session expiry preserves unsaved editors and offers renewed sign-in in another tab.
- Storage: Vercel private Blob only. Unsupported provider values fail closed. The applied storage-provider migration is preserved as history; no stored data was modified during the provider correction.
- Publication: docs/redesign/reviewed-publication.json contains 120 products, 47 content records and 131 media records. scripts/seed-reviewed-preview.mjs --apply-preview checks the private snapshot marker and inserts only absent records atomically. It has NOT been run.
- Source checks: TypeScript wiring passes on Node 22. Formal lint/tests/build/browser/DB end-to-end remain deferred to Phase 9; no TESTED claim.

## Exact next actions

1. User must replace only the masked DATABASE_URL and BLOB_READ_WRITE_TOKEN entries in ignored .env.local with the isolated Preview values. They must not be pasted into chat. Local-only bootstrap Studio credentials were generated into that file without displaying them; production credentials unchanged. Read values only inside commands, never print them.
2. Continue local integration preparation. Before activating hosted workflows or publishing records, resolve Vercel commercial eligibility. Once permitted, confirm the Preview snapshot marker before the explicit insert-only publication script; never seed through a build hook or into Production.
3. Netlify sign-in is no longer needed. Vercel-only and free-only constraints currently block commercial hosting. Do not assume a static business site, off-site sales or a protected Preview is exempt; see VERCEL-COMMERCIAL-USE.md.
4. Complete integrated Phase 8 and update copy naming the actual production providers. Then run Phase 9 required checks, end-to-end DB/Studio/WhatsApp proof, roles/concurrency, every-instance and responsive capture review. No main push until these gates pass and the old Vercel auto-deploy trigger is handled.
5. Publish finalized code to main and eligible production only after the approved release requirements. Do not mark complete because source compiles.

## Continuity

Current continuation task has work/tooling with official Node 22.23.2, npm 10.9.2 and Vercel CLI 59.25.4; work/vercel-config contains private local CLI auth. Do not publish that folder. Repository .env.local and .vercel are ignored. Current task work/baseline-2026-09-23 holds the preserved original drafts. Earlier scratch scripts are one-off transformations: do not rerun them blindly. Do not update personal memory unless the user asks.

Latest source additions: contextual private reference viewer, public image failure/retry states, article media selection and related published products. coverage.json now maps every one of 48 P/S rows to source evidence; no row is marked TESTED. Current-route-source.json supplements the preserved Phase 2 route inventory. Preview read-only reconciliation reports 16 tables with zero orders/catalogue/content/revisions.
