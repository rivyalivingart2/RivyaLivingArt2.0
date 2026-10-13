# Phase 3 — homepage and shared public frame

13 October 2026. The owner explicitly authorized Phase 3 after approving the earlier design and motion/media previews. Phase 3 is implemented and verified **locally**. Stop before Phase 4 until the owner reviews this result and authorizes the next phase.

## Review the result

- Built local website: http://127.0.0.1:4199/
- Homepage material chapter and playable film: http://127.0.0.1:4199/#home-material
- Static synthetic fixture showing all 18 conditional slots: http://127.0.0.1:4180/all
- Additional static fixtures: /classic, /editorial and /empty on port 4180.
- Direction and source-extracted design record: experiments/redesign-phase3/.
- Evidence: phase3-verification.json and phase3-section-coverage.json.
- Screenshots: output/playwright/redesign-phase3/. These generated local artifacts are ignored by Git; reproducible tools and sanitized verification receipts are committed.

The website uses the existing isolated local QA database, not a new production read. Its published presentation revision is 82 and it currently displays 11 of the 18 source slots. Optional sections remain conditional. Separate, clearly labelled static fixtures verify all 18 templates without publishing or changing a database record.

## Implemented

- Modern homepage composition for the published document, classic composition and fallback renderer. Saved cinematic/split hero and featured layout choices remain effective.
- Large selected imagery, an asymmetric featured gallery, quiet ivory statement and closing, ocean material story, deliberate film playback, stable category image columns and editorial reading sections.
- Shared public header, original unfiltered logo on ivory, desktop collection navigation, mobile menu, search dialog and footer, while retaining the existing navigation, contact and locale data.
- Native disclosure links to available homepage chapters. The reference composition's numeric progress rail is replaced with readable chapter labels.
- Deferred GSAP image parallax and two always-visible heading settling moments, restricted to desktop fine pointers without reduced motion. Native scrolling, anchor focus, modal focus and route cleanup remain intact.
- Existing Drive-verified video with poster, native controls, play/pause, no autoplay and no initial video preload. Existing stored imagery, alt text, associations and focal positions remain in place.
- Static synthetic fixtures for concept work, fictional feedback, unconfirmed services and Journal layouts. These are local layout evidence, not new editorial records or business claims.

## Verification

| Check | Result |
| --- | --- |
| Next production build and TypeScript | Passed |
| Focused lint of changed application components | Passed |
| Existing unit suite | 344 passed, 0 failed |
| Built-site browser checks | 58 passed |
| Conditional/alternate static layout checks | 40 passed |
| Preservation and public-flow edge checks | 16 passed |
| Named small-text palette contrast pairs | 9 passed at 4.5:1 or greater |
| Responsive widths | 320, 390, 768 and 1440 CSS pixels |
| Independent finish review | ship for local Phase 3 source/capture scope |
| Local database comparison | All 13 checked table digests match; 1,641 rows unchanged |

Flow checks include search results, saved pieces in browser storage, English/Hindi/Gujarati selection, all images after scrolling, no-JavaScript navigation, explicit video play/pause, modal focus restoration and scroll locking, live reduced-motion changes and route cleanup. Language selection checks do not constitute new native-language meaning approval.

The first narrow-screen pass found collection-tile overflow at 320px and a cramped mobile dialog heading; both were corrected. Closing-label contrast and rectangular controls were aligned with the approved design.

The reviewer initially rejected one oversized mobile screenshot because Chromium repeated part of the page. The corrected full-page capture uses 20 settled viewport tiles, shows the sticky header once, and reaches the footer/legal links. The capture method and readable ending are retained with the evidence. The reviewer then performed a fresh full review and returned ship with no material fixes.

## Preservation and limits

924 of the 934 original baseline files remain byte-identical. Ten differ: package.json/package-lock.json from Phase 2, seven existing homepage/public-frame source files from Phase 3, and .gitignore for generated Phase 3 evidence. New scoped components, styles and verification tools are additive.

All original public files, including the logo and media, are byte-identical. All src/lib and src/app/api files remain byte-identical. Original homepage non-anchor link labels/destinations, shared header/footer text, image associations, alt text and inline crop settings match the pre-change browser baseline. Database fingerprints cover the 13 tables enumerated in the receipt; this is not a claim that every database table was fingerprinted.

The six Phase 2 Drive image candidates retain their registered proposal status and null Studio IDs. No existing record was silently reassigned to one of them. The current public media and the existing Drive-verified film provide this phase's production-connected media.

The Impeccable context and detector launchers could not run because of the Windows batch error “The system cannot find the batch label specified - cache_directory_failed”. Their status is unavailable, not passed. Focused application lint excludes experiments under the repository's existing lint configuration; the static fixtures are built and browser-checked separately.

This evidence is local desktop-browser automation and source/screenshot review. It does not certify new physical-device, native-screen-reader, human-language, field-performance or production acceptance. No push, PR, release, production/Drive write or Studio publication was performed. Phase 4 has not started.
