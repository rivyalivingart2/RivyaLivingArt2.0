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

After the checked PR is merged, verify the exact main SHA, READY production deployment and domain assignment. Then use the real signed-in Studio administrator to select approved production content, save, inspect the exact desktop/mobile preview and publish. Do not copy QA selections or presentation revisions. Capture public disclosure/media/link readback and protected-record comparisons. Append exact PR, SHA, deployment, presentation revisions and timing evidence to this receipt.

## Acceptance and recovery

Full visual comparison of all distinct sections and child/error states remains incomplete. The current engineering evidence does not certify all 85 old templates and 74 section definitions. Image/overlay contrast needs remaining manual review. Native 200%/400% zoom, actual screen-reader tasks, physical-phone tasks, independent Hindi/Gujarati native review and outstanding factual/media-owner review have no new external evidence. Original unreviewed translation drafts stay unpublished.

The prior hosted mobile timing samples exceed the LCP target; retest the released candidate. Lab events are not field INP, and no field p75 or genuine-customer inquiry acceptance is claimed. No new tracking, customer messaging, paid infrastructure, scraper, old-product transfer or backup work is included. There are no schema, package or license changes.

Recovery uses immutable Studio design history and a reviewed Git revert of this PR if required; no reset, seed, rollback of protected records or automatic deletion is authorized. The previous production code at `f39136580bdfeb09ee37003b5a9a48fe111b0d21` and presentation revision 2 form the recorded pre-release state.
