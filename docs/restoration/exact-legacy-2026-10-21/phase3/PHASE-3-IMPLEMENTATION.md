# Phase 3 local field and media implementation — 23 October 2026

Continuation from `5545ffb` on `codex/exact-legacy-restoration`. This checkpoint delivers the additive editorial/media contracts, local editors, selected owner-image preparation and preservation/recovery evidence described below. It does not recover the deleted source database, import its unknown records, replace existing products, finish every later-phase workflow, or release anything.

The [566-field mapping](PHASE-3-MAPPING.md) remains the historical source contract inventory. Its 326 additive requirements are not a count of implemented database columns or complete workflows. Research, job, catalogue automation and other operational contracts remain allocated to Phases 4–6. This report records the concrete Phase 3 media implementation without promoting those inventory entries to completed features.

## Implemented locally

| Gap identified at the mapping checkpoint | Concrete implementation | Evidence and boundary |
|---|---|---|
| Category image and description | Independent category metadata with image, description, saved SEO fields, revision history and optimistic concurrency | Existing category membership is checked against current catalogue rows. No products or category memberships created. Homepage collection doors can consume approved category imagery. SEO route use remains later integration. |
| Separate mobile image URLs and old ratios | Optional `mobilePath`, independent focal points and `3/4`, `4/3` ratios in shared usages, Studio previews and public picture sources | Both images enter dependency fingerprints; a missing mobile source prevents publication. No forced crop conversion. Project cover and gallery consumers retain old geometry. |
| Genuine testimonial media | Optional verified rating, permitted portrait and creation/installation usage, media-file references and private notes | Genuine evidence remains required. Fictional entries cannot acquire ratings or testimonial images/files. Private notes and permission evidence are removed from public documents. No real testimonial, rating or customer name created. |
| Arbitrary film/model originals | Private MP4/WebM and self-contained GLB intake, immutable source digest, editable metadata/poster/transcript, administrator review, revisions and approved file references | Authenticated video preview and byte-range seeking verified with an existing material film. Public renderer supports video and GLB download with poster. Interactive 3D viewer and an actual owner GLB acceptance are not claimed. |
| Source identity and conflicts | Four additive tables: extensions, extension revisions, restoration crosswalk and conflicts; 31 columns | Source/product import families are blocked in the crosswalk. Real crosswalk/conflict tables remain empty because verified source rows are unavailable. Historical keep-current copy decisions remain intact. |
| Owner originals and edited assets | 20 MB / 40 MP raster intake, immutable originals, 640/960/1600 WebP derivatives, original-parent digest on AI edits | AI edit classification cannot be changed to documentary photography. Private storage is restricted to the existing guarded loopback configuration. Existing originals and image assignments remain unchanged. |

The corresponding editors live in `/studio/categories`, `/studio/media`, the existing content editor and site-image assignment editor. Saved versions, stale revisions, source review, access control and recovery are implemented, rather than menu-only placeholders. Complete publication/withdrawal browser lifecycles across every restored module remain part of Phase 4 integration; this checkpoint publishes nothing.

## Image delivery

Six selected owner creation photographs were downloaded from the supplied Drive creation folder and inspected. The untouched source photographs are retained, including the file labelled PNG whose bytes are actually JPEG. This is a selected batch, not a claim that all 813 inventoried Drive originals were downloaded or edited.

The final six edited presentations use the actual website tokens: obsidian `#080a0e`, deep ocean `#08283a`, sapphire `#164e6b`, champagne `#b89b63`, ivory `#f4f1e9`. The built-in image generation tool changed backgrounds/lighting; ordinary image processing only normalized export dimensions and encoding.

- Six JPEG exports at **1600 × 2000**, portrait **4:5**, matching the Studio product layout.
- Eighteen WebP exports: **640 × 800**, **960 × 1200**, **1600 × 2000** for each creation.
- Generated masters are approximately 1122 × 1402; they are retained separately and resampled for delivery. Export dimensions do not imply native generated detail at 1600 × 2000.
- Private ZIP contains the 24 delivery images, README and six exact prompts. Hashes and actual decoded dimensions were checked against the unpacked files and the served download.
- The initial two warm-background edits remain private historical drafts. Final selection uses the six ocean-palette edits. Six source photographs + eight edited candidates = 14 private Studio image drafts and 42 prepared derivatives.
- Creation 6 has a cropped/obscured source. Reconstructed details are visualization only. All edited faces, personal lettering and small handcrafted details need owner fidelity review before business publication. No customer/project/review identity or permission was inferred from a photograph.

Files and raw evidence stay under ignored `test-results/exact-legacy-2026-10-21/phase3-implementation/`. Originals, customer portraits, child Drive IDs, private manifests and screenshots are not committed. The local preview provides original/edited comparisons; the output is not linked into any existing product gallery.

## Verified preservation and checks

Final candidate build: `YDrtP647c0oo4I3hvf-7w`.

- **390 application tests**, **403 built HTTP regression checks**, **53 mapping/isolation checks**, **12 preflight tests**, TypeScript/build and ESLint pass (zero lint errors; 51 existing warnings).
- Initial local integration: **33 checks** for category create/edit/conflict/history recovery, private media replay, original identity, authorization and film ranges. Final image registration added **18 checks** for six branded drafts. These receipts retain their original build/time; they are not relabelled as newly rerun on the final build.
- **103 fresh final-delivery checks** verify final-build privacy, private previews, parent lineage, every export size, ZIP bytes and the working download.
- Fifteen browser observations cover desktop/mobile images, original comparison, normal Studio sign-in, category search and independent mobile crops, unsaved-work protection, six searchable drafts, private image preview, disabled image publication, actual eight-second film playback and revision controls. Detailed measurements/screenshots stay private.
- Schema replay succeeds twice with identical columns. Stale version update is refused; transaction rollback restores exact pre-rehearsal counts. No original business table is dropped, reseeded or migrated.
- **All 313 pre-existing business rows across 13 isolated tables are unchanged**, including 120 catalogue, 56 content and 131 existing media rows. Added 14 private media rows and 28 associated media revisions are explicitly distinguished from the original baseline. One private existing-film draft and its two revisions are in the new extension tables.
- **301 original media/login files** match their before hashes; **21 protected baseline byte hashes** match exactly. Ten additional source contracts match `5545ffb` after CRLF/LF normalization. The latter normalization is documented separately from exact byte comparisons.

This is evidence about the existing synthetic loopback database, not a fresh production record comparison. Session/auth/audit bookkeeping is outside the business-row baseline. No protected source exception was needed to explain a content or asset change.

## What remains outside this checkpoint

The owner-deleted database supplies no verified IDs, deleted counts, joins, overrides or publication states. Accordingly there are **zero recovered source records, zero real source relationship imports and zero title replacements**. Remaining unassigned Drive/Photos originals cannot be attached to real products/projects/testimonials by filename or visual similarity. A larger image batch and genuine record associations require selecting/evidencing those originals; the six-image result does not exhaust the full library.

The [migration candidate](PRODUCTION-MIGRATION-CANDIDATE.md) is prepared, not authorized or executed. No product additions, archived catalogue/Sheets imports, seed replay, current product/gallery overwrite, CMS publication, production DB access, cloud write, external message, push, PR or deployment occurred. The repaired request-table migration was not replayed.

## Local continuation

Keep this branch, working evidence and populated cluster. Do not rerun fixture preparation or overwrite any `before-private.json` evidence. Build/start are mutually exclusive because the guarded runner owns the same PostgreSQL port. The candidate requires the new schema before application startup; do not deploy the source ahead of that migration.

```powershell
# Stop only the task-owned app before rebuilding; allow its shutdown to finish.
& ..\tooling\node22\node.exe tools/exact-legacy/run-local.mjs stop
& ..\tooling\node22\node.exe tools/exact-legacy/run-local.mjs build
& ..\tooling\node22\node.exe tools/exact-legacy/run-local.mjs start
# With the existing guarded local app/PG running, from another terminal:
& ..\tooling\node22\node.exe tools/exact-legacy/phase3/rehearse-schema.mjs
& ..\tooling\node22\node.exe tools/exact-legacy/phase3/implementation-snapshot.mjs after
& ..\tooling\node22\node.exe --import tsx tools/exact-legacy/phase3/prepare-images.mjs --serve
& ..\tooling\node22\node.exe tools/exact-legacy/phase3/verify-final.mjs
```

The image preview serves on `http://127.0.0.1:4214/`; app/Studio on `http://127.0.0.1:4210/`. Image generation is not rerun by these commands. Preparation requires the existing private manifests and files. `register-branded-images.mjs` reuses already registered exact hashes and never publishes. Earlier mapping and Phase 1/2 reports remain historical evidence with their original scope.
