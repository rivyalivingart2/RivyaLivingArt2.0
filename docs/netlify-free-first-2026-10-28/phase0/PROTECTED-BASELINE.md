# Protected design, records and asset reuse baseline

This inventory is read-only evidence from 28 October 2026. No original file, product, content record, credential or provider configuration was changed. See [AUDIT.md](AUDIT.md) for the exact revisions and [OWNER-SCOPE.md](../OWNER-SCOPE.md) for the local-only Phase 0 boundary.

## Design and source preservation

The protected source manifest covers all tracked `public/`, `src/components/` and application pages/layouts under `src/app/` outside API handlers. It also includes any tracked `src/data/` files (none currently). Each entry records the exact path, byte length and SHA-256. Both Studio and public components are included, making the scope broader than the public design alone.

There are **1,198 files / 139,839,148 bytes**, with **zero changes against migration commit `7b390d5`**. This covers the homepage, Creations, Signature/footer presentation, branding assets, login page and styles. Saved business/contact/content values are separately covered by actual source-data fingerprints. File equality does not prove live seven-width visual parity, image loading on devices or authenticated interaction behavior.

| Reusable source | Files / bytes | Reuse rule |
|---|---|---|
| `public/brand` | 12 / 1,771,992 | Keep existing logo/branding assets |
| `public/fonts` | 12 / 1,550,401 | Keep current type assets and language coverage |
| `public/illustrations` | 2 / 3,631 | Preserve current illustrations |
| `public/legacy-reference` | 132 / 3,506,765 | Reference assets remain available; do not infer data ownership or import products from them |
| `public/media` | 646 / 131,026,724 | Preserve all existing repository media; selected creations below are a subset |
| `src/app` protected page/layout scope | 109 / 96,397 | Preserve public pages, login and current routing presentation |
| `src/components` | 285 / 1,883,238 | Preserve current public design; old-Studio restoration belongs to the later authorized phase |
| Selected creations within public/media | 169 images / 507 variants / 97,229,902 bytes | Reuse the selected bytes and 4:5 derivatives; no Photos re-selection, regeneration or new product association |
| Existing managed Blob objects | 92 objects / 11,678,925 bytes | Retain originals; metadata equality is not a checksum-verified Drive copy |
| OLDWEBSITE reference source | Separate clean checkout at `2dd6d5d` | Read-only old Studio design/workflow reference; unavailable old database is not reconstructed from fixtures |

The selected public manifest is `src/lib/selected-creations-public.json`, SHA-256 `47cbe580a9d0124288d82cbd9c248a28f71b32cd606b70cbace974bfa9dff196`. Its verified presentation metadata includes 6 featured images and 12 categories. Those category/image counts do not establish product, sale, customer, review or project counts. Private original registrations remain private; no private file URL or source identity was added to the public manifest.

Fresh verification: **7/7** tests across `owner-creation-selection.test.mjs` and `owner-creations-public.test.mjs`, including the byte/dimension/reference check, public manifest field restrictions, public reads without database/private evidence, and local-image access/host guards. The pagination test uses synthetic rows and is a local model test; it is not a live browser interaction.

## Actual source records

Read at 14:20 UTC using read-only PostgreSQL transactions. All counts are observed, not filled from the 28-table schema or sample fixtures.

| Existing table | Rows |
|---|---:|
| rivya_access_requests | 0 |
| rivya_audit | 1,099 |
| rivya_business_settings | 1 |
| rivya_catalogue | 120 |
| rivya_content | 535 |
| rivya_erasure_ledger | 0 |
| rivya_inquiries | 2 |
| rivya_inquiry_notes | 0 |
| rivya_inquiry_upload_sessions | 14 |
| rivya_managed_exports | 0 |
| rivya_presentation_revisions | 4 |
| rivya_presentations | 1 |
| rivya_privacy_controls | 26 |
| rivya_public_media | 154 |
| rivya_references | 0 |
| rivya_revisions | 1,395 |
| rivya_staff | 0 |
| rivya_storage_budget | 1 |
| rivya_studio_login_limits | 28 |
| rivya_studio_order_events | 47 |
| rivya_studio_orders | 26 |
| rivya_studio_sessions | 1 |
| **Total** | **3,454** |

The 120 catalogue rows are storage records, not proof of 120 authentic sale offerings. Zero staff-table rows does not mean there is no administrator; current owner credentials are separately configured. One session row is not proof that the session is currently valid. No individual row, customer detail, password representation, session token or resource registration is included here.

All **20 previously fingerprinted business tables / 3,425 rows** match their retained earlier fingerprints. The comparison uses row counts plus a deterministic sorted aggregation of per-row JSON MD5 values within read-only repeatable-read transactions. It is a change-detection check, not a cryptographic archival guarantee or complete semantic relationship proof. The two excluded security-state tables contain 29 session/throttle rows in this observation.

The earlier same-day full-source encoding rehearsal remains separate evidence: all 3,454 rows validated losslessly and uniquely against 36 primary/unique/foreign-key contracts; 54,650,653 source JSON bytes; 3,144 inline records and 310 requiring Drive documents. That rehearsal was not repeated here because fresh business fingerprints and counts are unchanged. It is not a target migration, encrypted backup, restore, or media reconciliation.

## Preservation and migration gates

1. Preserve every real ID, URL, original/populated value, price/variant/form schema, revision, status/date, identity, media original and relationship. Preserve legitimate demo and source disclosures.
2. Keep each current store authoritative until a verified, authorized cutover. The isolated sandbox is not a production copy and must never be counted as one.
3. Before target writes, verify a protected source backup and restore, record explicit source/target registrations and map JSON relationships as well as SQL foreign keys.
4. Copy necessary managed files only in a later authorized migration rehearsal. Verify exact bytes, MIME/dimensions, permissions, original/derivative associations and every reference. Repository-served assets can remain in place.
5. Reconcile final deltas and post-cutover writes before any rollback or retirement. Preserve SQL, Blob, Vercel and OLDWEBSITE until replacement/recovery evidence and exact destructive authorization exist.

No archived catalogue, owner Sheets list or missing old database content was imported. No products were added. No schema was changed to force the observed table count to equal the isolated map.
