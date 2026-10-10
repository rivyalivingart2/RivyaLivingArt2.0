# Production presentation setup — completed 9 October 2026

The owner authorized only Production setup and requested a stop afterward. This setup activates the already deployed M0–M4 application from PR #46, main `6605b1b19283f7725eee1bc1639cc277556428bf`. No new application code, build, push or deployment was needed. M5 remains unstarted and requires explicit permission.

## Database and publication

The verified live resource is Neon project `blue-haze-08978208` (historical name `rivya-studio-preview`), main branch `br-muddy-poetry-awe0sju1`, endpoint `ep-delicate-silence-awjxadrd`, database `neondb`. The project name is not a reason to use the separate historical production project. The existing runtime connection and owner console identified this same resource.

The signed-in owner SQL editor successfully applied `scripts/presentation-production-setup.sql` as `neondb_owner`. The transaction created only `rivya_presentations` and `rivya_presentation_revisions`. Read-only verification confirmed all 13 expected columns, both table owners and exactly five explicit runtime grants: SELECT/INSERT/UPDATE on presentations and SELECT/INSERT on revisions. Runtime schema CREATE remains false; history UPDATE/DELETE, schema-wide grants, default privileges and credentials were not changed. Both tables were empty before the Studio workflow.

The real signed-in Studio Administrator used `/studio/sections` to capture current production source content, save draft revision 1, inspect its exact previews and deliberately publish revision 2. No loopback fixture, synthetic source document or local presentation history was copied. The production history contains only draft 1 and publish 2. Studio confirmed public design revision 2 after checking the enabled routes.

## Active design

- Homepage: old-site section sequence, full-image opening, compact manifesto and editorial row. Twelve source-ready bands render; Furniture/Rooms remain default-off. Portfolio, Testimonials, Workshops and Printing remain unbound where source content or availability is missing; private waiting notes do not appear publicly.
- Seven page designs: `/our-story`, `/process`, `/materials-care`, `/architects`, `/collectible-design`, `/contact`, `/commission`. Existing approved public copy, products, image associations, crops and translations remain their source.
- Homepage material film: `resin-pour`, with the shipped JPEG poster, WebM and MP4. It is explicitly labelled a material visualization, not a customer commission recording. Play/Pause and native controls are present; autoplay is false. Existing verified Drive references remain in the saved presentation metadata; no new upload was needed.
- No workshop offering, factual maker evidence, customer feedback or new editorial entry was invented or published.

## Fresh verification

- Exact saved previews of homepage and all seven pages rendered the expected source revisions and one main heading. No horizontal overflow was detected. Our-story title matches the current source, `Art for the way you live.`
- The mobile preview uses its nominal 390px frame (388px inner frame, 373px content with browser scrollbar); its document has equal client/scroll widths, one main heading and paused, non-autoplay video. This is browser emulation, not physical-device acceptance.
- Both preview and live film decoded and played at 1280×720, duration 8.042 seconds, readyState 4, with advancing current time and no reported video error. Live screenshot saved privately as `production-home-film.jpg`.
- Eight public routes returned HTTP 200 and presentation revision 2. Every route retained the current phone and email links. The homepage includes all three media references and the disclosure, and excludes the private waiting-for-content notes. Live homepage and hydrated contact DOM checks passed. A raw HTML heading-count check initially included the streamed loading fallback; the hydrated contact DOM correctly has one visible heading, so the HTTP check was corrected to verify revision/contact output rather than count streamed headings.
- Before/after read-only snapshots match **every count and digest across all 13 original protected scopes**: 120 products, 55 content records, 136 public-media records, 1 business record, 375 original revisions, 2 inquiries, 2 orders, 2 order events, 2 privacy-control records and four empty protected scopes. Existing values, drafts, translations, associations/crops and order records are unchanged by this setup.
- The new verification tool passes focused ESLint. SQL executed successfully in the intended owner console; no application source changed, so the prior release's compiled application evidence remains applicable within its recorded scope.

Fresh private evidence is in ignored `test-results/old-design-migration/`: `live-read-only-activation-before/after-summary.json`, matching private fingerprints, `production-presentation-schema.json`, `production-presentation-published.json`, `production-activation-browser.json`, `production-activation-verification.json` and the screenshot. No credentials, private records or raw screenshots are staged in Git.

## Stop and remaining work

Production setup is complete. Do not start M5, create any of the 480 entries, or run another release without the applicable owner permission. `PENDING-AFTER-M4.md` retains the M5–M11 work list; all four content groups remain 0/120.

This activation check does not close full-page parity, native-reader, human screen-reader, physical-device, field-performance or genuine-inquiry acceptance. Live restore was not exercised: both immutable revisions are present, and isolated-QA restore evidence remains separately scoped. Current Studio can restore a chosen revision into a new draft for later reviewed publication; do not delete history as rollback. Scraper work, old-product transfers, ingestion-dependent Catalog Fill and backups remain excluded.
