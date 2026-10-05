# Draft PR — complete acceptance follow-up and reduce database transfer

Release requested on 5 October 2026. This local description accompanies the candidate's detailed PR; its result is recorded separately.

## Problem and resulting behavior

Studio lists still transferred complete content snapshots from Neon, and warm public checks transferred full publication identity arrays. Public builds also scanned non-application files for Tailwind classes. This follow-up projects small list rows in SQL, uses a database-computed publication digest, scopes/splits CSS and corrects footer logo sizing. Selected editing records stay exact, and public withdrawals remain immediate.

Collection/journal saved previews now carry their expected revision marker, resolving false preview-failure feedback. SEO policy excludes private and transient journeys consistently and uses the approved published homepage hero for share metadata.

## Changes

- `src/lib/content-read-query.ts` and content API: bound-parameter compact list projection, full selected details, source JSONB draft-state comparison.
- `src/lib/publication-read-query.ts` and published source: ordered publication digest on every reuse; coherent full-source/digest snapshot; no TTL or stale fallback.
- `src/app/globals.css`, `next.config.ts`, ShopFrame: source-only Tailwind scanning, graph CSS chunks and correct footer logo sizes.
- Saved preview renderer: exact collection/journal revision marker.
- Public indexing helper, metadata, sitemap, robots and focused tests: permitted routes, approved media and private/Preview exclusions.
- C6/final-acceptance tools: source-only loopback PostgreSQL, explicit rejection of shared live Neon QA, parameter/transaction fidelity, SQL/preview/indexing contracts and bounded production audit.
- Documentation: current acceptance receipt, accurate CRAFT task register, recovery/Launch follow-up and future indexing decision.

No package/lockfile dependency change. The local `pg` client belongs to workspace tooling only.

## Production editorial work already completed separately

The owner authorized normal Studio publication. Imprint public revision 2 is verified; earlier content recovered into draft revision 3 without changing public content. Five reviewed Drive assets have fresh production identities and no product associations. Nine page documents have complete reviewed Hindi/Gujarati translations; current versions and provenance are in the acceptance receipt. This PR does not replay those writes or import QA records.

Protected comparison: 120 catalogue records, 131 original media records/associations and business settings unchanged. No customer records/messages, product transfer, scraper changes, grants or backup work.

## Verification

290 unit, 12 preflight, 403 built-server, 45 actual local SQL, 13 publication/recovery and 19 indexing-policy checks. TypeScript, build and changed-file lint pass. Browser checks include 144 accessibility scans, 73 interaction assertions and ten image/motion observations.

All 21 local mobile samples pass 2.5 seconds across seven routes; medians 1.384–1.708s. Final footer follow-up passes at 1.724s home / 1.688s process. Full server/a11y/interaction matrices precede only that final sizes attribute; build/media/focused loading include it. Fixtures do not reproduce current production Blob media, Neon latency or cold CDN/server behavior.

## Release checklist and known limits

- The owner requested this release. Create the detailed PR, inspect exact-head checks/reviews, merge through PR and verify main plus Vercel READY.
- At that approved release, apply the owner's Production-only `SITE_INDEXABLE=true` decision, redeploy and verify robots/sitemap/canonical/private exclusions. Preview stays closed.
- Current hosted collection LCP is 3.539s; repeat against this deployed candidate/current assets. Field p75 unavailable.
- Human screen-reader/physical-phone checks remain unavailable; automated evidence is not certification.
- Remaining translations, native-reader review, gallery/content sign-off and genuine business inquiry observation remain open.
- Backups/key custody remain removed. Revision recovery stays supported.

Rollback uses a reviewed source revert/promotion, not restoring the database. Publication recovery stays in Studio's saved-revision workflow. See FINAL-ACCEPTANCE-2026-10-05.md for detailed evidence and scope.

