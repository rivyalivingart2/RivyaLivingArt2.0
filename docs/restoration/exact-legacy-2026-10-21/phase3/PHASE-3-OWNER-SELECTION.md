# Phase 3 owner-selected images in the local website

Date: 24 October 2026. Continued from `c88071a` on `codex/exact-legacy-restoration`.
This report supplements the [field/media implementation](PHASE-3-IMPLEMENTATION.md), [mapping](PHASE-3-MAPPING.md), and [earlier image collection](PHASE-3-IMAGE-COLLECTION.md).

## Latest owner decision

The owner stopped Google Photos work because it duplicates the Drive collection for this project. Treat Photos as **owner-excluded duplicate coverage**, not as a verified byte-for-byte duplicate library. Do not resume downloads or request another export to close this scope.

The owner then rejected the newer source-pixel cutout/compositing treatment and selected **all 169 images in the earlier review at http://127.0.0.1:4215/** for use in the website. The latest selection supersedes the earlier compositing preference. The rejected experiment is preserved privately and is not referenced by the website.

The selection authorizes **local website use**. It does not authorize production publication, a push, PR, deployment, cloud upload or database reassignment. It is an aesthetic selection of AI-enhanced presentations, not a certification of exact personal lettering, faces or documentary product details.

## Implemented

- The existing legacy homepage portfolio slot now features six selected images, including images 006, 007 and 008 shown in the owner's annotation. Existing published project records remain intact.
- The local portfolio page includes the same featured collection alongside its existing editorial archive.
- The new local `/creations` page displays all 169 selected images, with 12 creation-type filters, image-number/type search, reset, 12-image pagination, accessible enlargement and individual full-size WebP downloads.
- The original 4215 review now shows a dated owner-selection annotation and a link to the website gallery. Original/edited comparisons and the six JPEG/WebP download packs remain available.
- The website serves the exact earlier exports: 640 × 800, 960 × 1200 and 1600 × 2000 WebP, all 4:5. The earlier 1600 × 2000 JPEGs remain in the review and download packs. No new redraw, cutout or crop was substituted.
- The website uses Rivya's existing display type, ocean/obsidian/champagne palette, header and footer. Gallery cards retain the entire 4:5 image.

The private selection manifest contains immutable variant paths/hashes and the owner's local-use scope. The browser receives only an image number, creation type and local image URLs. The image endpoint requires the exact isolated local environment and rejects foreign Host/Origin and cross-site embedding. Private originals, manifests, prompts and experiment files remain outside public routes and build output traces.

No image has been assigned to an existing product, customer, testimonial, review or genuine project record. The collection contains 169 photographs/presentation images, not 169 newly created products.

## Verification and preservation

Fresh evidence is recorded in [owner-selection-verification.json](owner-selection-verification.json). Build `gbV5ib2nPHG2Ja9ZxXMvv` and TypeScript pass, as do 393 application tests and scoped ESLint. All 507 served variants match the selected bytes; five application pages, eight route boundaries, 119 private-file-free build traces, 1,352 delivery file hashes, six archives and 11 review-server checks pass. Fifteen browser observations include filters, empty/reset states, pagination, enlargement/Escape, homepage placement, Studio login and an actual downloaded image hash. At an emulated 390-pixel width, the page and 352-pixel dialog have no horizontal overflow. The browser screenshot surface scaled that emulated capture; DOM measurements supply the responsive evidence, not physical-phone certification. Private screenshots and detailed receipts remain ignored.

The existing synthetic loopback database is compared in a read-only transaction with the completed `f64294f` snapshot: **355 rows in 13 tables** remain identical. **301 original media/login files** and **21 protected source hashes** remain identical. No database write, migration, media association, product addition or archived import occurred in this continuation. Existing Studio login code and original media are unchanged.

These checks verify local preservation. They are not a fresh production database audit. Application changes are confined to the selected collection's display/loader/guard and exclusion of private evidence from deployment traces.

## Phase disposition and limits

The owner-amended local image task is complete and the final linked receipt passes: the chosen Drive images are prepared, selected and usable in the local website; Photos and the rejected cutout treatment are excluded. Prior Phase 3 additive fields, media contracts, crosswalk/conflict storage and isolated replay/recovery remain delivered at their recorded checkpoints.

Do not describe the deleted source database as recovered. Its identities, rows and relationship values remain unavailable. Do not infer missing product/customer associations from the images. Wider reference/branding inventories are not an unprocessed product-import queue. The 326 mapped requirements are not 326 implemented fields or workflows.

Full operational public/Studio restoration, vendor/scraper work, automated catalogues and integration/release acceptance remain Phases 4–7. No production activation or release is included here.

## Working pages and continuation

- Website homepage collection: http://127.0.0.1:4210/#home-work
- Full website collection: http://127.0.0.1:4210/creations
- Portfolio: http://127.0.0.1:4210/portfolio
- Current Studio login: http://127.0.0.1:4210/studio/login
- Earlier selected images and annotation: http://127.0.0.1:4215/

The exact local images require the preserved ignored `phase3-completion/` folder and `phase3-website-selection/selection-private.json` under `test-results/exact-legacy-2026-10-21/`. No private images belong in GitHub. A checkout without those local files does not expose the selection; production also fails closed.

Use the existing Node 22 runtime. Do not reseed or replay the request-table repair:

```powershell
# Start only if the guarded app/database is not already running.
& ..\tooling\node22\node.exe tools/exact-legacy/run-local.mjs start
# Validate exact selected exports served by the built local application.
& ..\tooling\node22\node.exe tools/exact-legacy/phase3/verify-website-selection.mjs
# Compare the unchanged existing local data and protected files.
& ..\tooling\node22\node.exe tools/exact-legacy/phase3/verify-collection-preservation.mjs --website-selection
# Recheck preserved originals, export sizes, packs and review boundaries.
& ..\tooling\node22\node.exe tools/exact-legacy/phase3/verify-owner-collection.mjs
```

Keep all source snapshots, originals, masters and prior evidence. Do not resume Photos/compositing or regenerate selected images without a new owner instruction.
