# Phase 4 — selected-image drafts and subscribers

Started locally from `924978a` on `codex/exact-legacy-restoration`, 24 October 2026. **Phase 4 is in progress, not complete.** This checkpoint restores two working paths and preserves the full remaining action inventory. See [verification](verification.json) and [the workflow ledger](workflow-ledger.csv).

## Owner scope

Use the earlier 169-image collection selected at port 4215, already displayed by the local homepage, portfolio and `/creations`. Do not regenerate it, substitute the rejected cutouts, resume Google Photos, add products or import archived catalogue/Sheets lists. Preserve current data, relationships, original media, contact details, colour and Studio login. All work stays local; no push, PR, deployment, production migration, CMS publication, cloud writes or external messages.

## Implemented here

### Selected creation → private Studio draft → save → reload

`/studio/media` now includes **Your selected creation images**. It searches all 169 selected images by number/type, filters their 12 creation types, pages in groups of 12, and opens an individual image in the existing editorial metadata editor. Current dirty edits block a record switch. Preparing an image locks the current editor until the request completes.

Preparation validates the original file hash, selection manifest, all three exact WebP hashes and dimensions. The files retain 640 × 800, 960 × 1200 and 1600 × 2000 sizes. There is no re-encoding. Each draft has source Drive lineage, original-parent SHA-256, AI-edit provenance and design-visualization classification. It has zero product associations and no publication. Existing matching assets are opened without rewriting their metadata. Concurrent requests create one deterministic draft; retrying partial storage verifies existing bytes rather than replacing them. The draft, revision and audit entry are written atomically.

The selected collection endpoint requires a current Studio session and the exact isolated environment, database and loopback host. It accepts only an image number. Original filesystem paths and arbitrary client URLs are never accepted. It is unavailable in production. An unpublished Studio draft remains unavailable from its public editorial URL. The previously selected `/creations` gallery continues its separately approved local display.

These are the old media upload/metadata/provenance/usage operations adapted to the protected current storage and revision contracts. Folder moves, tags, favourites and the complete old bulk-media workflow are **not completed** by this slice. Selected AI images are not genuine project/customer/review evidence.

### Website newsletter → Studio subscribers → CSV

The former inactive subscriber screen is replaced by the old three-column subscriber table, count, clamped 50-row pagination and CSV export. The existing newsletter capture table supplies the records. There is no new schema or import. Search, footer/journal source filters, inclusive UTC dates and newest/oldest/email order are available behind the Filters control. CSV exports every matching row, independent of the current page, with quoting and spreadsheet-formula protection.

The current administrator-only route and server API checks are retained. Loading, empty, invalid-filter, expired-session, export-failure and retry paths do not invent counts. This is a captured-signup register, not a mailing service or evidence of email verification. No email is sent, and no consent/verification/delivery state is invented. The old launching-soon source and campaign/unsubscribe integrations remain outside this delivered path.

## Source and visual comparison

Reference: preserved `OLDWEBSITE` source `2dd6d5de34acf3f98e611eda2e1b858ebd0da8e6`, especially `src/app/studio/(dashboard)/subscribers/page.tsx`, `src/app/api/subscribers/export/route.ts`, `src/app/studio/(dashboard)/media/page.tsx` and `src/actions/media.ts`. The authenticated shell retains the earlier Phase 2 legacy styles, current logo/colour and current access controls. A narrow breadcrumb wrapping defect observed during comparison is corrected without changing login.

The existing old isolated database refused its historical listener on Windows. `old-local.mjs start --alternate-reference-port` opens the same preserved database on loopback 55442 and the reference app on 4212; it never prepares/reseeds it. Both port choices remain explicitly allowlisted by the network guard. The source checkout stays unchanged. Private old/new desktop captures and browser observations are under `test-results/exact-legacy-2026-10-21/phase4/`. Data counts differ because each isolated application retains its existing records; these are not recovered production records. The new subscriber filters and security controls are explicit additions. Global Studio chrome and every module's visual parity still require the rest of Phase 4.

## Preservation and verification

The fresh Phase 4 baseline records every local table before work. The after check requires every existing non-session row hash to remain present, checks exact row counts for tables outside the permitted additive test paths, and compares every original public media/login file. Normal sign-in changes session expiry/rate-limit rows; those two transient tables are reported separately rather than falsely declared unchanged. Production was not connected or verified.

The receipt records the final build, application tests, API scenarios, all-image source checks, browser save/reload/download observations and the exact local additions. Private test evidence includes one newly prepared owner-selected image draft and synthetic `example.invalid` newsletter signups. No product, customer, order, genuine testimonial or published record was added. Do not rerun historical fixture setup, request-table repair or old Phase 3 mutation tests on this preserved cluster.

## Continue Phase 4

1. Use [the ledger](workflow-ledger.csv) with the original [156-action inventory](../inventory/action-parity.csv) and [98-route inventory](../inventory/legacy-routes.csv). Reproduce each missing behavior before marking it complete; keep publication and external actions separate.
2. Complete old media folder/tag/favourite/bulk operations with version checks and usage protection. Preserve the chosen bytes, current records and original-parent lineage. Add draft-only placement previews before any separately authorized publication.
3. Close public collection/detail/form/search/gallery states and editorial taxonomy/bulk/revision workflows using existing catalogue records. Never create product fixtures or synthesize genuine customer content.
4. Verify inquiry/order/follow-up, staff roles, SEO/translations, recovery and error states against the old workflows. Preserve current login/security as the protected exception.
5. Capture matched desktop/mobile states at each checkpoint. Route/menu existence does not prove a workflow. Keep scraper/vendor work and catalogue automation in Phases 5–6; leave release operations in Phase 7 with their authorization gates.

Local app: `http://127.0.0.1:4210/`; media: `/studio/media`; subscribers: `/studio/subscribers`; selected gallery: `/creations`; old reference: `http://127.0.0.1:4212/studio/subscribers`; selected review: `http://127.0.0.1:4215/`.

Runtime: Node 22 at `../tooling/node22/node.exe`. Use `tools/exact-legacy/run-local.mjs stop`, `build`, then `start` as needed. Keep the populated ignored databases and private manifests. New verification utilities live in `tools/exact-legacy/phase4/`; `preservation.mjs before` refuses to overwrite this checkpoint's original baseline.
