# P6 implementation checkpoint

3 October 2026. **P6 is in progress. P6A implementation and isolated QA are complete; P6B is next.** Work remains local on `codex/p6-legacy-language-journeys`, based on main `c94427de88d45a216fdf545840efef2f875e5789`. P3–P5 and the media-layout fix were previously merged through PRs #34 and #35. This delivery does not push, deploy or publish production content.

## Implemented in P6A

- A source-backed disposition registry accounts for 19 legacy route patterns. Seven reviewed, single-hop 308 redirects cover `/shop`, `/blog`, `/custom-order`, `/large-resin-art` and the verified furniture, gift and varmala category routes. Existing about/materials/care aliases remain intact. Category redirects preserve collection intent, not an assertion that old and current product sets are identical.
- Only supported, bounded search/sort parameters survive redirects. Unsupported old discovery filters receive a visible reset notice on current search/collection/journal pages. Arbitrary tokens, contact fields, message payloads and redirect targets are not forwarded.
- Old receipt and wishlist links receive honest 410 explanations. Receipt tokens never enter the new inquiry handler or response body. Unsupported workshop/supplies/printing addresses do not invent an offering. Unverified product/article/category paths return 404 with a useful next step; names or similar slugs are never treated as product identity.
- Compatibility notices send no-store/noindex/no-referrer headers and have no scripts, third-party assets or forms. Compiled QA discovered that global headers overrode the Route Handler privacy header; matching configuration now enforces no-referrer. The disabled-public-site boundary still returns a real 404.
- Administrators can open **Studio → Old links & publication** (`/studio/route-review`). It shows mapping evidence, dispositions, publication-source availability, current published category counts, canonical host and indexing state. Search, filtering, keyboard evidence disclosure, empty/error/stale/retry states and responsive cards are working. Anonymous requests receive 401 and editors receive 403. These are read-only diagnostics, not an editable redirect or taxonomy migration tool.
- Shared canonical metadata now uses `https://www.rivyalivingart.com`. Read-only production headers confirmed the apex already redirects there with 308. No hosting, environment, indexing activation or locale URL migration was performed. QA robots remain disallowed; production robots were also sampled as noindex/disallowed before this change.

## Evidence and limits

Passed: 267 unit tests (8 new), 12 preflight tests, 395 compiled HTTP regression tests, production build/TypeScript, changed-file ESLint with zero warnings/errors, 53 isolated API assertions, 29 browser assertions and 14 layout samples across 320–1440px. Desktop, phone and old-receipt screenshots were visually inspected. Browser page-error count was zero. A synthetic diagnostics 503 verified stale results and retry; it was removed afterward. Physical-device accessibility, full assistive-technology testing, field performance and search-engine indexing are not certified by these checks.

API verification used the established isolated QA environment. Catalogue/media/business and content/inquiry/manual-order row fingerprints were identical before and after. Temporary editor accounts from both QA attempts were disabled with audits retained. No products, forms, original assets, gallery associations, contacts, scraper, drafts or histories were rewritten. No schema migration, old-product transfer or production mutation was needed.

Sanitized evidence is in `p6a-validation.json`. Full local API/browser results and screenshots are in the parent workspace `outputs/P6/`. HTTP tests use the actual compiled application. Publication-source availability is explicitly different from a live production HTTP check: production is still on the previously merged source.

## Remaining phase slices

| Slice | Scope and acceptance |
|---|---|
| P6B — reviewed language journeys | Audit and complete English/Gujarati/Hindi interface, navigation, search, validation, forms and receipt text; source/translation review and stale states; honest incomplete-language fallback. Handle verified legacy locale prefixes without assuming a new language URL/SEO scheme. Preserve product facts, IDs, numbers and contacts. |
| P6C — taxonomy and import review | Extend stable category identities, labels, aliases, usage and conflict presentation. Improve dry-run/error presentation only where a supported editorial operation exists. Product import/transfer and scraper execution remain excluded. |
| P6D — supported legacy capabilities | Finish every family disposition. Project/testimonial editors require genuine facts, media permission and real contracts; analytics require trustworthy permitted events. Workshops, printing, supplies, campaigns and internal tools are not activated from old templates alone. |
| P6E — phase closure | Complete reviewed exact route identities where evidence exists; verify language/redirect/private-route journeys, metadata and recovery. Reconcile every task and conditional item. Record any remaining release dependencies rather than claim blanket completion. |

## Ten-task status

| Task | Current disposition |
|---|---|
| T32 | Partial: live published category counts and collection labels; full stable-ID/alias/conflict review remains. |
| T33 | Pending presentation work; product ingestion remains protected and unrun. |
| T34 | Conditional project editor; genuine facts and permissions remain required. |
| T35 | Partial: seven reviewed redirects plus private/retired/unverified handling; exact remaining identities and locale paths are open. |
| T36 | Pending coherent, reviewed English/Gujarati/Hindi journeys. |
| T37 | Conditional and not selected: no locale URL/SEO migration is active. |
| T38 | Canonical code correction and isolated checks complete; indexing remains held; production verification follows an authorized release. |
| T45 | Conditional: no new funnel instrumentation, consent assumption or invented zero metrics. |
| T47 | Conditional: no verified new workshop/3D/supplies offering activated. |
| T59 | Partial: 19 route patterns now have explicit implementation/review/retirement evidence; full 79-family/136-template reconciliation remains. |

P4 T41/T61 performance acceptance and P7/P8 remain open. No media changes were needed in P6A; future editorial assets still use the owner's supplied Drive folder and subject/provenance review.

## Continuation and recovery

Continue P6B in this local branch. Keep all work local until the owner explicitly requests pushing main; then use a detailed feature-branch PR and merge through that PR. Do not confuse that later source release with publishing QA content.

Recovery is a new revert commit of the P6A code, preserving later work and all saved records. No database rollback is required. Review redirect behavior before a later production release because permanent redirects can be retained by clients. Never reset protected records or purge QA audits to reverse this slice.
