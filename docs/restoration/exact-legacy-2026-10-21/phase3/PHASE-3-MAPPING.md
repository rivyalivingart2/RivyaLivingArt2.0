# Phase 3 — field and media mapping checkpoint

Local continuation from `39b948c7d0f792fe9b663afbc4a2edcc4a1610cf` on `codex/exact-legacy-restoration`, 21 October 2026. Reference source remains the clean pinned OLDWEBSITE commit `2dd6d5de34acf3f98e611eda2e1b858ebd0da8e6`.

The requested **contract and available-file mapping is complete locally**. Every discovered field, relationship contract, bundled asset and image placement has an explicit destination, preservation rule, exclusion or required extension. This is a mapping checkpoint, not completion of the entire Phase 3 migration/media programme. No application schema, existing record, image, binding or Studio login was changed. No products or product fixtures were added. Archived catalogue/Sheets lists, samples and saved product rewrites were neither parsed nor imported by this work.

## Evidence and outputs

| Output | Verified coverage | File |
|---|---|---|
| Entity and field contracts | 45 entities, 566 actual fields, source types/attributes/lines, destination contracts, transforms and write exclusions | [entity mapping](entity-mapping.csv), [field mapping](field-mapping.csv) |
| Relationship contracts | 48 fields, cardinality, declared foreign keys/references/delete rules, endpoint rules | [relationship mapping](relationship-mapping.csv) |
| Record identity handling | Zero invented source record mappings; per-entity missing-record disposition | [record crosswalk](source-record-crosswalk.json) |
| Field decisions | 566 decisions; current values retained; no replacement approval implied | [decision ledger](field-decision-ledger.json) |
| Bundled copy comparison | 12 explicit keys across existing draft/published states: 20 differences retained, four equal, zero changes | [copy mapping](copy-mapping.json) |
| Bundled asset mapping | 326 old files, 297 current files; 135 old files have exact SHA-256 matches; 191 have no byte match | [source asset mapping](asset-mapping.json), [destination assets](destination-assets.json), [duplicate references](asset-duplicates.json) |
| Placement contracts | All 78 literal legacy image/video slots, existing byte matches, target usage and crop rules | [slot mapping](slot-mapping.json) |
| Media families | Category, product, blog, project, testimonial, page/landing, video, private inquiry and protected Studio login | [family mapping](media-family-mapping.json) |
| Media evidence summary | 597 local raster metadata reads, zero metadata errors; 866 existing local draft/published media references, zero missing bundled files | [media summary](media-summary.json) |
| Verification | Mapping regeneration, unit checks, lint, browser checks and preservation comparison | [verification receipt](verification.json) |

**Inventory correction:** the old Phase 1 parser counted nine prose lines inside a `SiteSettings` block comment as fields. The corrected parser preserves source line numbers and validates all declarations. The actual count is **566**, not 575. Historical receipts retain their original counts; [mapping-summary.json](mapping-summary.json) identifies each removed comment line. No actual schema field was removed or omitted.

## Preservation and conflict rules

The read-only before/after comparison covers the **existing synthetic loopback database**, not production. All 13 inspected business tables / 313 rows match their canonical row digests, including all 120 existing catalogue rows. All **897 tracked `src/` and `public/` files** match their byte hashes. This covers the current Studio login, application code and bundled original/delivery assets. No login reimplementation or shared style change occurred. Runtime session bookkeeping is outside the business-table comparison; no new production data-baseline claim is made.

The mapping treats all six catalogue/import entity families as owner-excluded (92 fields), protects 14 current settings, excludes 13 authentication/runtime fields and one source claim-token field, and requires explicit identity matches for relationships. The other dispositions are 86 existing-contract adapters, 326 additive-contract requirements and 34 relationship-crosswalk requirements. An adapter disposition describes a compatible destination contract, not a deployed converter.

Record matching requires a source namespace, immutable source ID, destination ID, expected revision and traceable evidence. Title, filename, position and similar appearance cannot establish identity. Because the source database was deleted, there are no verified source records or edges to attach. The empty record crosswalk is intentional; seeds, archived product lists and filenames do not fill that gap.

Bundled English message keys can be compared with explicitly corresponding existing local content fields. That produced the 24 copy decisions above. Private evidence retains value digests and expected versions; public reports omit values. These comparisons do not recover deleted `SiteCopy` overrides. Every differing populated value remains unchanged, including titles. The review planner returns no executable patches or staged values.

## Media mapping and remaining evidence limits

Exact SHA-256 matches identify equal local bytes, **not permission to replace a media association**. Duplicate groups retain each original path and scope. All 866 inspected existing media references remain attached to their current records and draft/published states. The reference count includes repeated uses, not 866 distinct images. Dynamic editorial delivery was not independently fetched in this mapping pass.

The private Drive inventory accounts for **813 original file IDs**: 280 have refreshed read-only metadata observations and 533 retain the earlier dated inventory. This is not a fresh complete remote listing. Existing committed manifests and film references provide documented lineage for 26 IDs; **787 remain explicitly unassigned originals**. Historical lineage is distinguished from a hash-verified current local file. No assignment to a product, project, customer or review was guessed. Raw child IDs, filenames, metadata and record-level evidence remain Git-ignored.

Remote byte hashes and image dimensions are unverified; remote deduplication is therefore incomplete. The previously observed Google Photos album does not supply file-level identities or a verified equivalence with Drive. No originals were downloaded or edited, and no derivatives were generated in this mapping scope.

The mapping identifies these concrete compatibility requirements:

- Category imagery needs explicit category metadata without creating products or changing current membership.
- The current testimonial validator rejects images/galleries and linked products; ratings, avatar/installation/video usages and evidence require additive typed support. Names, reviews and ratings require genuine source evidence and permission.
- Current `EditorialUsage` supports one image path with independent crops. Legacy separate mobile URLs need a distinct optional path; they must not be discarded or silently substituted.
- Thirteen legacy placements use `3:4` or `4:3`, which the current ratio contract does not allow. Preserve the ratios in a compatible extension instead of coercing them.
- Legacy focal coordinates are fractions `0..1`; destination coordinates are percentages `0..100`. The conversion rejects invalid values.
- The existing fixed `resin-pour` film reference does not support arbitrary legacy video, posters or 3D media. These require separate approved media contracts.
- Source `UPLOAD`/`BUNDLED` provenance does not prove photography. Unverified classification remains unknown; AI imagery remains a design visualization.
- Catalogue prices are displayed as rupees; the research variant `priceMinor` field uses minor units. Do not apply a blanket 100× conversion. Product prices remain protected and no conversion was applied.
- Legacy custom field types are `SELECT`, `TEXT`, `SWATCH`, `SIZE`, `NUMBER`, `FILE`. Swatch, size and file workflows need equivalent contracts rather than lossy text/select conversion. Product form definitions remain unchanged.

## Verification and working previews

Fresh checks for this checkpoint: **46 mapping/reconciliation tests**, scoped ESLint, deterministic regeneration of all 13 mapping artifacts, eight browser checks at desktop/mobile widths, and read-only before/after preservation. The browser checks exercise entity/search/reset filters, owner-excluded product rows, the protected login slot and nine media families. The receipt records artifact hashes. Screenshots and detailed evidence stay under the ignored `test-results/exact-legacy-2026-10-21/phase3/` directory.

- [Searchable field and media report](http://127.0.0.1:4213/)
- [Existing local website](http://127.0.0.1:4210/)
- [Existing matched Phase 2 comparisons](http://127.0.0.1:4211/)

The app retains build `v2CaXW2W1igYEi5x4rN2P`; it was not rebuilt because its source/media bytes are unchanged. Earlier broad app tests and comparison screenshots retain their original dates and scope. The new mapping report is a separate read-only loopback tool, not a new Studio module or import UI.

Reproduce from the repository with the existing Node 22 runtime:

```powershell
& ..\tooling\node22\node.exe tools/exact-legacy/phase3/verify.mjs
& ..\tooling\node22\node.exe tools/exact-legacy/phase3/preview.mjs --serve
```

Verification requires the existing ignored before/after, browser and Drive evidence. It does not obtain a DB connection. `snapshot.mjs before|after` is a separate, guarded read-only operation against the existing isolated cluster; do not overwrite an original before snapshot while verifying an existing checkpoint. Do not rerun fixture preparation or any seed/migration on the populated cluster.

## Continuation boundary

The requested mapping package is delivered. Subsequent Phase 3 implementation comprises additive non-product contracts, compatible editors, safe derivative preparation, justified non-product associations and isolated replay/recovery evidence. Those are not claimed implemented here. Real lost-source record recovery remains unavailable, and the unassigned originals must not be labelled as real projects or reviews without supporting evidence. Keep work local, preserve protected current data/login, and retain the owner’s exclusion of the historical product import sources unless the owner explicitly changes it. No publication, push, PR, release, production migration or cloud write occurred.
