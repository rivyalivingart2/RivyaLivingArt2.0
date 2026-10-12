# M11 release — 12 October 2026

The owner explicitly authorized M10 and M11. This release continues the existing RivyaLivingArt2.0 application through a detailed PR into main and the existing Vercel Git deployment. The 480 M9 documents are already live from PR47 and must not be reimported. Release execution and external acceptance are separate.

## Application changes since PR47

- Studio Page design now chooses up to three published Portfolio entries and three Testimonials in a deliberate display order. The homepage renders those exact identities with concept/fictional-sample labels and detail links. No fictional entry is represented as real feedback and no review/rating schema is added.
- The saved design captures content/media identities, revisions, fingerprints, image crops and reviewed locale values. Private proof/review metadata is stripped. Wrong kinds, duplicates, unavailable media, withdrawn entries and stale dependencies are rejected. Save, exact preview, publish and revision restoration remain distinct.
- Public layout reads begin alongside the existing locale/source reads; publication freshness checks are retained. No time-based stale cache or database migration is introduced.
- Filter groups have accessible group semantics; the phone filter trigger stays hidden at desktop sizes. Studio hover/selected status text retains readable contrast.
- The silent material film has a visible sequence description programmatically associated with the player. It remains deliberate-play, muted, controlled, offscreen-pausing and explicitly a visualization. MP4 container inspection shows only a video track; WebM playback decoded no audio. This resolves the inspected caption warning as silent-video alternative coverage, not a human accessibility certificate. Reference: [W3C video-only alternatives](https://www.w3.org/WAI/WCAG22/Understanding/audio-only-and-video-only-prerecorded.html).
- Empty inquiry views omit the empty table and retain the actual empty-state message; populated lists and mobile cards retain their existing records and permissions.
- Six meaningful homepage lifecycle tests, a guarded isolated publication/recovery contract, and explicit per-family acceptance/evidence registers accompany the source changes. The M8 contract reads actual counts and paginated FAQ results.

## Verification before release

Fresh final build and TypeScript, edited-source lint, all 344 unit tests and all 403 built-server checks pass. Earlier M10 evidence retains its actual candidate/date: six homepage lifecycle groups, 73 accessibility scans with no confirmed violations, and 544 responsive DOM checks across 68 routes/eight widths. Additional final-candidate browser checks verify the empty follow-up state, editorial creation, saved synthetic order dialog and print CSS card; no real customer data is used. Print CSS emulation is not a physical print/device check.

The fresh production read-only baseline has 120 catalogue records, 535 content records, 154 media records, 1 business-settings record, 1,389 content revisions, 2 inquiries, 2 orders, 2 order events and 2 privacy-control records. The local baseline has all original rows preserved and retained synthetic QA history. Final comparisons must check original row digests in all 13 protected scopes, not counts alone.

## Production activation and verification

[PR48](https://github.com/rivyalivingart2/RivyaLivingArt2.0/pull/48) merged after exact-head checks. Head `db41fb3780211a2c2169e7fd0024c73181a3aa37` produced main `0f1b1457f1bf870a3742d206a43f04fa781bdf02`. Vercel production `dpl_G1muuWBRGoo8DLBQG3sHxM94uzKt` is READY for that exact main SHA, and the domain alias plus public HTML deployment marker both match. Vercel and Preview Comments checks passed with no unresolved feedback. There was no direct push to main or protection bypass.

The owner's renewed real Studio administrator session selected three approved Portfolio concepts and three approved fictional Testimonial samples, saved draft revision 3, reviewed its exact desktop/mobile preview, then published design revision 4. The public page confirmed revision 4. All six detail links, three loaded Portfolio images and visible concept/fictional labels match. The mobile preview content and scroll widths both measured 373px inside a 390px frame; this is browser emulation, not a physical-phone result. Existing homepage source revision 5, product selections, seven page layouts and the material-film selection remain intact. No QA identity or revision was copied.

The live silent film plays with its visible associated description, reports duration 8.042 seconds and muted playback, and pauses with the actual Pause control. Studio's production register confirms 480 linked and published records, 120 per kind, with 480 recorded Drive deliveries. The prior 480-entry release was not replayed.

All 26 bounded public production checks pass: public pages, six selected detail routes, contact/SEO/indexing checks, robots/sitemap, login, anonymous Studio redirect, protected API denial and retired/missing routes. The existing production contract intentionally returns 410 for retired /workshops; an initial probe's 404 expectation was corrected after source inspection. This was a test expectation correction, not an application defect. The 30-minute runtime-error observation for / and /collectible-design returned no errors; that is not a full-site uptime guarantee.

All original production row digests and counts match in all 13 protected scopes. Local original-row comparisons also pass against three preserved baselines. Only two additive presentation-history revisions were created in production. No original content, media, crop, draft, translation, business/contact value, customer record or order record changed. Private digests and raw browser evidence remain outside Git.

Nine focused browser scans now have zero confirmed violations, including the released homepage. Empty follow-up semantics, the unsaved new-editor form, a saved synthetic order dialog, print CSS emulation, Studio selections and the film were inspected. Analytics metric-card contrast is at least 14.56:1 against its computed gradient stops. Remaining image/overlay manual items still require review. No human screen-reader, physical-print or native-zoom pass is inferred.

## Released performance measurements

The four production samples below used 390×844, DPR 1, 4× CPU slowdown, 150ms latency, 1.6Mbps download and 0.75Mbps upload. Browser cache state does not establish server/CDN cache state. All samples are retained, including the slow repeat.

| Route and browser cache | LCP | TTFB | CLS | Largest observed menu event |
|---|---:|---:|---:|---:|
| Homepage, bypassed | 7.056s | 3.466s | 0 | 136ms |
| Homepage, enabled repeat | 11.488s | 10.237s | 0 | 112ms |
| Collection, bypassed | 6.628s | 3.076s | 0 | 112ms |
| Collection, enabled repeat | 4.064s | 3.192s | 0 | 80ms |

None meets the 2.5s LCP target. Menu-event samples are not field INP, and field p75 remains unavailable. Read-only production query profiling from this local machine measured database execution of 61–182ms and round trips of 1.013–5.350s. This is not a Vercel server trace and does not establish the cause of all hosted latency. Continue server/transport and font/media-budget diagnosis without weakening publication freshness or adding unapproved tracking or paid infrastructure.

## Acceptance and recovery

Full visual comparison of all distinct sections and child/error states remains incomplete. The current engineering evidence does not certify all 85 old templates and 74 section definitions. Image/overlay contrast needs remaining manual review. Native 200%/400% zoom, actual screen-reader tasks, physical-phone tasks, independent Hindi/Gujarati native review and outstanding factual/media-owner review have no new external evidence. Original unreviewed translation drafts stay unpublished.

The released candidate has been retested above and still exceeds the LCP target. No field p75 or genuine-customer inquiry acceptance is claimed. No new tracking, customer messaging, paid infrastructure, scraper, old-product transfer or backup work is included. There are no schema, package or license changes. Workshops/printing remain unconfirmed offerings; preview availability does not authorize public business claims.

Recovery uses immutable Studio design history and a reviewed Git revert if required; no reset, seed, rollback of protected records or automatic deletion is authorized. The previous production code at `f39136580bdfeb09ee37003b5a9a48fe111b0d21` and presentation revision 2 form the recorded pre-release state. The old code does not accept the new layout.editorial property: first use the current Studio to restore revision 2 into a fresh draft, inspect its exact preview and publish a new compatible revision; only then release a reviewed code revert. This recovery sequence is documented, not executed or claimed as a tested production rollback.

QA server and isolated PostgreSQL are stopped with data retained. Temporary test tabs and device/network/CPU/media/viewport overrides are cleaned up. The live website and production register remain available as deliverables. No scheduled continuation is running. M11 release execution is verified for this scope; full M10 acceptance remains open in M10-CONTINUATION.md. The documentation receipt is a follow-up with the same application fingerprint, not another application or content change.
