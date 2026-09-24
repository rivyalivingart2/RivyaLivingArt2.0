# Active owner instruction — publish current work; further development and testing stopped

24 September 2026. Read docs/decisions/2026-09-24-publish-current-stop-testing.md. The owner explicitly requested completing current publication to GitHub main and Vercel Preview/Production, stopping new work and testing, and documenting all pending work. This supersedes the earlier all-findings-closed release hold for this current deployment. Do not resume the pending development or test programme without a new owner request.

Read docs/redesign/PENDING-WORK.md for the complete current status and docs/redesign/PHASE-11-CHECKPOINT.md for continuation. Master revision 3.13 records this scope change; Phase 11 is not fully complete. Existing completed work, restricted runtime configuration, retention-control schema and deliberate approved public-content publication are being released. Preview/Production share the authorized database/private store with independent session secrets. WhatsApp remains saved-order Open/Copy plus manual customer Send only. Search indexing remains off; automatic Git deployment remains off.

No new purchases, customer accounts, payments, Netlify, WhatsApp automation or Sheets synchronization. Preserve original assets, drafts, data, revision history, secrets and private backups. The older checkpoint text below is historical where superseded.

---

# Active checkpoint — Phase 11 verification in progress

The owner authorized completing all remaining work, normal GitHub main publication and intentional Vercel Preview/Production release after the applicable checks. Read docs/decisions/2026-09-24-pro-final-release.md and 2026-09-24-operating-policies.md. The correct Vercel team now has Pro; the earlier free-only/Hobby hold is superseded. No additional paid service is authorized.

Continue codex/final-verification-release from merged main fc6d3fe (PR #25). Read docs/redesign/PHASE-11-CHECKPOINT.md for exact current evidence and pending tasks. Master revision 3.12 is an in-progress verification update, not a release certificate. No repeat plan, asset, shared database or shared private-store approval is needed.

172 unit checks, 12 preflight checks, lint/typecheck/build and the first isolated browser order/Studio tests have passed at their recorded intermediate source; later edits require rerun. QA uses separate database rivya_qa_20260924 and private store store_maHrpDDHXPR93N0w, with independent credentials. The normal Preview/Production shared resources must never receive synthetic tests. QA now has 120 published products, 47 content entries including 36 articles and 131 media entries. Shared-resource publication remains pending.

The encrypted database archive was uploaded to an owner-only Drive folder and restored into isolated resources with matching counts/digests for 16 tables. Recovery-key password-manager/physical custody, scheduled operations, reference/remote restore and complete privacy lifecycle remain unverified. Do not mark these achieved because the owner delegated them. Current live runtime grants, full device/security/accessibility/performance/media/license QA and exact deployment checks remain release gates.

WhatsApp remains saved-order Open/Copy followed by manual customer Send only. No bots, generic chat, notifications, payments, customer accounts, Sheets synchronization or Netlify. Preserve original assets, drafts, revisions and data. Do not rerun historical migrations or wholesale historical publication candidates. Keep automatic Git deployment disabled and normal order flags off until their release checks pass. No new main merge or deployment has occurred in Phase 11.

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
