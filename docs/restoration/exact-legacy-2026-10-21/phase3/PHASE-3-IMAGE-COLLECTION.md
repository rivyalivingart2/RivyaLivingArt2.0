# Phase 3 owner image collection — local continuation from f64294f

Date: 24 October 2026. Branch: `codex/exact-legacy-restoration`. This report supplements [the field/media implementation](PHASE-3-IMPLEMENTATION.md) and [mapping](PHASE-3-MAPPING.md). The latest owner restriction remains authoritative: preserve existing data and Studio login, add no products, import no archived catalogue/Sheets lists, and keep everything local.

## Delivered scope

The supplied creation Drive folder contains 170 files: **169 still images (136 JPEG and 33 HEIF) and one video**. All 169 still originals were downloaded and inspected; their byte counts and SHA-256 digests were recorded. There are 169 distinct original byte hashes. Different photographs of the same creation are retained; distinct hashes are not proof of distinct physical products.

**163 new background edits** extend the six from `f64294f`, giving **169 private presentation candidates**. The built-in image tool used each inspected source photograph. Backgrounds use the site's obsidian `#080a0e`, deep ocean `#08283a`, sapphire `#164e6b`, champagne `#b89b63` and ivory `#f4f1e9` palette. The ordinary image pipeline only decodes, orients, resizes and encodes; it does not synthesize objects or backgrounds.

Every candidate has:

- A **1600 × 2000 JPEG**, portrait **4:5**, matching the existing Studio product-image convention.
- **640 × 800**, **960 × 1200** and **1600 × 2000 WebP** versions.
- Its untouched source, generated master, normalized PNG, exact generation prompt and hash lineage retained privately.
- An unassigned `design-visualization` classification and `publicationApproved: false`.

The delivery contains **676 JPEG/WebP files**, with **six ZIP packs** (30/30/30/30/30/19 images). The generated masters vary in resolution; 1600 × 2000 describes the export canvas, not newly recovered native detail. Contain normalization retains the complete generated composition with brand-colour padding when necessary. It cannot recover product areas absent from the source photograph.

## Working local review

Open **http://127.0.0.1:4215/** on this computer. The gallery provides all image numbers, creation-type filters, review-detail filters, search, pagination, original/edited comparison and individual JPEG/WebP or ZIP downloads. It has no database, association or publication controls. Its server binds only to loopback, allowlists delivery files, and rejects private manifests, original-file routes, foreign Host/Origin, cross-site requests and write methods.

Review categories cover keepsakes, nameplates, clocks, phone cases, jewellery/keychains, trays/devotional work, floral preservation, ring displays, candle holders, portrait drawings, a tabletop and resin letters. Source-detail flags identify personal photographs, lettering, creator marks, cropped views, unfinished work, collages, event context and limited source detail. These are visual triage labels, not ownership, customer or permission evidence.

## Fidelity and source coverage limits

**Preparation is complete for the 169-still creation folder; final documentary fidelity acceptance is not complete.** AI outputs can change lettering, faces, ornament shapes or other fine details even when explicitly instructed to preserve them. Visible examples include changed lettering in some plaques and reconstructed edges in cropped photographs. Every output stays a private candidate and must be compared with its original before business use. Creator marks present in sources are flagged and were requested to be retained; their exact preservation is not certified automatically.

The separate supplied Google Photos album is accessible. One original was downloaded and preserved locally; it depicts another angle of the same framed creation as Drive image 001, with different bytes. Several album-wide download attempts did not return an archive, including through the recovered browser download API. The full album's count, duplicates and additional-original coverage are **unverified**, not silently counted as prepared. Do not infer a total from the virtualized thumbnail list. Individual-file download is a possible continuation route; a complete owner-exported album archive is another. This is a source-coverage dependency, not a request for database credentials.

The wider historical Drive inventory also contains branding, reference and other assets. It is not a batch of 813 verified product photographs. No arbitrary existing product/project/testimonial association was inferred from a filename or visual resemblance. The owner-deleted database still supplies no recoverable source record IDs or relationships. Those unknowns remain unknown.

The existing video/media contracts and previously prepared film remain as documented in the implementation checkpoint. This still-image continuation does not claim new video editing, GLB creation or full Phase 4 workflow parity.

## Preservation and validation

See [the sanitized verification receipt](collection-verification.json) for fresh results. Validation checks original/master/normalized/review/export hashes, all decoded export dimensions/formats, absence of EXIF in delivery exports, bounded WebP size, all ZIP entries, repeat-safe identical writes, refusal to overwrite differing bytes, and private preview boundaries.

A read-only transaction against the existing **synthetic loopback database** compares the completed `f64294f` snapshot: **355 rows across 13 tables remain identical**. This includes the earlier checkpoint's 14 private image drafts and 28 associated revisions; none were added by this continuation. **301 original media/login files and 21 protected baseline hashes** still match. Application source, public media, package manifests and lockfile are unchanged from `f64294f`.

These are local preservation results, not a fresh production-database audit. No schema migration, database write, new Studio record, product, archived import, title replacement, customer/review identity, gallery reassignment, cloud write, CMS publication, push, PR or deployment occurred in this continuation. Earlier application/build/HTTP test counts keep their original checkpoint dates and are not represented as rerun here.

## Files and resumption

All originals, generated images, exact prompts, manifests, signed download information, screenshots and archive files remain ignored under:

`test-results/exact-legacy-2026-10-21/phase3-completion/`

Do not commit this private directory or copy it into `public/`. The committed tools and sanitized report are sufficient to explain the workflow, but the private artifacts are required to reproduce this exact delivery. Existing source/download files are retained; no credential recovery is involved.

From the repository, with the existing Node 22 runtime:

```powershell
# Re-export retained masters without regenerating images or writing to the database.
& ..\tooling\node22\node.exe tools/exact-legacy/phase3/prepare-owner-collection.mjs --complete
# Validate every delivery file and a temporary loopback preview server.
& ..\tooling\node22\node.exe tools/exact-legacy/phase3/verify-owner-collection.mjs
# Read-only comparison, with the guarded existing local PostgreSQL instance running.
& ..\tooling\node22\node.exe tools/exact-legacy/phase3/verify-collection-preservation.mjs
# Start only if port 4215 is not already serving this collection.
& ..\tooling\node22\node.exe tools/exact-legacy/phase3/serve-owner-collection.mjs
```

Keep the populated cluster and all historical before/after snapshots. Do not reseed, replay the request-table repair or overwrite the completed baseline. The existing app/Studio remains at `http://127.0.0.1:4210/`; the older six-image review at 4214 is historical. Further phases and production activation retain their own scope and authorization.
