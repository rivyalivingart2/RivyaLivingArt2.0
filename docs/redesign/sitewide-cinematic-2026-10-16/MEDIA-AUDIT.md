# Local media and preservation audit

Generated 2026-10-16T08:13:13.753Z, source HEAD `ffd863928744df0ae2cf985f6504421842a074db`. This is **current local evidence** from the isolated QA database and local application captures. It is not a production snapshot, a fresh Drive audit, or human/device acceptance.

## Protected local records

The existing guarded runner executed `protected-snapshot.mjs local sitewide-after` against the same isolated local database as `sitewide-before`. The snapshot query uses a read-only repeatable-read transaction, verifies read-only mode, and hashes complete rows at the database. No raw row values are exported. The private artifacts remain in ignored `test-results/old-design-migration/`.

Before: 2026-10-16T07:20:06.431Z. After: 2026-10-16T08:09:08.427Z. All **1658 rows across 13 inventoried tables** have identical row fingerprints, table counts and aggregate digests. Content identity/revision/visibility rows also match.

| Protected table | Before | After | Added / removed / changed | Result |
| --- | --- | --- | --- | --- |
| rivya_catalogue | 120 | 120 | 0 / 0 / 0 | Unchanged |
| rivya_content | 603 | 603 | 0 / 0 / 0 | Unchanged |
| rivya_public_media | 152 | 152 | 0 / 0 / 0 | Unchanged |
| rivya_business_settings | 1 | 1 | 0 / 0 / 0 | Unchanged |
| rivya_revisions | 738 | 738 | 0 / 0 / 0 | Unchanged |
| rivya_inquiries | 2 | 2 | 0 / 0 / 0 | Unchanged |
| rivya_studio_orders | 8 | 8 | 0 / 0 / 0 | Unchanged |
| rivya_studio_order_events | 16 | 16 | 0 / 0 / 0 | Unchanged |
| rivya_inquiry_notes | 0 | 0 | 0 / 0 / 0 | Unchanged |
| rivya_references | 0 | 0 | 0 / 0 / 0 | Unchanged |
| rivya_staff | 10 | 10 | 0 / 0 / 0 | Unchanged |
| rivya_privacy_controls | 8 | 8 | 0 / 0 / 0 | Unchanged |
| rivya_erasure_ledger | 0 | 0 | 0 / 0 / 0 | Unchanged |

This is the exact 13-table scope of the existing preservation tool. It covers the inventoried products, content/drafts/translations, media associations/crops, business settings, revisions, inquiries, orders/events, notes, references, staff and privacy records. It does not claim an exhaustive inventory of additional tables outside that tool.

## Local film bytes

The poster and both film formats were hashed directly from `public` and compared with the current `src/lib/presentation-media.ts` manifest. All three byte lengths and SHA-256 values match. These are existing approved material-visualization assets; no new media, crop or association was created.

| Asset | Expected bytes | Actual bytes | SHA-256 | Result |
| --- | --- | --- | --- | --- |
| /media/migration/hero-pour-loop-poster.jpg | 98481 | 98481 | e7dec2a8d6972a0825caf57aae320db7b1a0c319eb2f7a3d5581ba9190040caf | Matches manifest |
| /media/migration/hero-pour-loop.webm | 1649274 | 1649274 | ba77d14e1d380f382bbc86af1c5e8533ad3e8a0ad2bb604d06506b3da5b216c8 | Matches manifest |
| /media/migration/hero-pour-loop.mp4 | 2135160 | 2135160 | 61d4633578353e813e64506877eed198bc682b6424701b7783720af51530869d | Matches manifest |

**Drive evidence boundary:** the manifest records historical byte-for-byte verification against owner-supplied Drive copies on **2026-10-09**. Drive was not re-fetched during this audit. The evidence produced here confirms current local files match that recorded manifest; it does not establish current remote permissions, file availability or remote bytes.

## Unchanged protected source paths

Git working-tree status, including untracked files in these scopes, was compared against the current source HEAD. The following scopes have no changes. Presentation components/styles and documentation outside these scopes are intentionally being redesigned.

| Scope | Tracked files | Result |
| --- | --- | --- |
| Business, contact and social source | 5 | Unchanged |
| All library models, persistence, authentication and data source files | 167 | Unchanged |
| API handlers | 30 | Unchanged |
| Public route adapters and SEO metadata | 112 | Unchanged |
| Dependencies and application configuration | 4 | Unchanged |
| Approved media and original brand assets | 151 | Unchanged |
| Database schema/migration scripts and guarded runner | 22 | Unchanged |

Exact checked paths are recorded in `preservation.json`. Business source, database/authentication models, API contracts, route adapters, SEO metadata, dependency/configuration files and existing brand/media assets remain unchanged against HEAD.

## Public before/after comparison

Compared `test-results/sitewide-cinematic/before-public-content.json` with `after-public-content.json`, joining by path because capture order differs. The earlier text field is `text`; the later field is `main`. Link tuple/object formats were normalized without changing destination order or label meaning.

All **17 paths** retain identical whitespace-normalized main text, ordered link labels/destinations, document titles, H1s and canonical URLs. Fifteen paths also retain byte-identical captured main text.

| Path | Raw text | Normalized text | Ordered links | Title / H1 / canonical |
| --- | --- | --- | --- | --- |
| / | Identical | Unchanged | Unchanged | Unchanged |
| /our-story | Whitespace-only rendering change | Unchanged | Unchanged | Unchanged |
| /materials-care | Identical | Unchanged | Unchanged | Unchanged |
| /collectible-design | Identical | Unchanged | Unchanged | Unchanged |
| /memory-art | Identical | Unchanged | Unchanged | Unchanged |
| /personal-art | Identical | Unchanged | Unchanged | Unchanged |
| /pieces/river-channel | Identical | Unchanged | Unchanged | Unchanged |
| /commission | Identical | Unchanged | Unchanged | Unchanged |
| /contact | Identical | Unchanged | Unchanged | Unchanged |
| /journal | Identical | Unchanged | Unchanged | Unchanged |
| /portfolio | Identical | Unchanged | Unchanged | Unchanged |
| /testimonials | Identical | Unchanged | Unchanged | Unchanged |
| /faq | Identical | Unchanged | Unchanged | Unchanged |
| /privacy | Identical | Unchanged | Unchanged | Unchanged |
| /search | Identical | Unchanged | Unchanged | Unchanged |
| /saved-pieces | Identical | Unchanged | Unchanged | Unchanged |
| /process | Whitespace-only rendering change | Unchanged | Unchanged | Unchanged |

- `/our-story`: 2217 → 2218 captured characters. Only "" → "\n" at character 217; normalized words and punctuation are identical.
- `/process`: 1695 → 1696 captured characters. Only "" → "\n" at character 207; normalized words and punctuation are identical.

The captures cover the existing local rendered main content. They do not independently prove every stored record, hidden accordion answer, alternate language, private Studio screen or production route was rendered. The protected database hashes provide a separate preservation check for the inventoried stored records.

## Evidence files

- `preservation.json`: sanitized table counts/digests, local media checks, protected-path results and all 17 path comparisons.
- Ignored `test-results/old-design-migration/local-sitewide-before-private.json` and `local-sitewide-after-private.json`: private row identifiers/fingerprints and content identity metadata. No private values are copied here.
- Ignored local summary and public capture files: exact audit inputs; no fixture or record mutation was performed.
