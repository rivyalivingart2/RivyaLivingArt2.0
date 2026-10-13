# Phase 2 — reusable foundation and animation/media preview

13 October 2026. The owner approved the Phase 1 previews and authorized **Phase 2 only**. Phase 2 implementation is complete locally and the animation/media preview is ready for owner review. **Do not begin Phase 3 without explicit approval.**

## Review the result

- Animation, playable film and six Drive images: `http://127.0.0.1:4179/`.
- Image provenance and full/portrait crop comparison: `http://127.0.0.1:4179/#media`.
- Native-scroll Studio control specimen: `http://127.0.0.1:4179/studio`.
- Start/rebuild instructions: `experiments/redesign-phase2/README.md`.
- Source components: `src/components/design-foundation/`.
- Media register: `phase2-media-register.json`, all 18 homepage slots mapped.
- Local screenshots: `output/playwright/redesign-phase2/` (desktop, mobile and reduced-motion opening/film/media/crop/Studio captures).

The preview is isolated and read-only with respect to the website, Studio and Drive. It cannot publish, save customer records, change image assignments or submit inquiries. Browser confirmations are explicitly local demonstrations.

## What is implemented

- Scoped brand tokens, typography, sections, buttons, fields, focus treatments and status feedback, using the approved logo/palette and local fonts.
- Responsive picture component with width/height reservation, AVIF/WebP sources, responsive sizes, separate proposed desktop/mobile focal points, eager priority for the opening image, lower-page lazy loading and an accessible image-failure state.
- Film component with unchanged poster/video bytes, muted inline playback, native controls, explicit play/pause, no initial video preload, offscreen/hidden-tab pausing, and readable failure feedback. There is no automatic playback; reduced-motion users receive the still composition and can choose playback.
- Scoped GSAP ScrollTrigger parallax and short heading movement on capable desktop pointers. Body copy and Studio forms/tables stay steady. All content is present in server-rendered HTML.
- Motion and smooth-anchor controls that report effective capability; unsupported widths, touch and reduced-motion settings show disabled Static motion / Native scrolling states. Live preference changes and unmounting restore the native state.
- Six fresh Drive image downloads, originals retained locally, 36 optimized variants committed in the experiment, and source IDs/dimensions/alt/crop/provenance records. No image generation was necessary for this foundation preview.

## Scrolling decision

The planned desktop ScrollSmoother candidate was prototyped and rejected. A focus interaction could move Play film between pointer-down and pointer-up, losing the click. The final foundation preserves browser-native scrolling and uses native smooth anchor navigation. GSAP remains limited to image/heading transforms. There is no whole-page transform wrapper, pinning or second smoothing engine. Studio never receives custom scroll smoothing.

## Preservation and verification

- Of 934 original files in the Phase 1 source baseline, **932 remain byte-identical**. The only authorized differences are `package.json` and `package-lock.json`, adding exact GSAP `3.15.0` and `@gsap/react` `2.1.2` dependencies. Every pre-existing lockfile package record is retained.
- All existing application routes, API handlers, database/schema files, content, source media, translations, crop records and publication logic remain unchanged. New components are additive and unimported by existing routes. This establishes source preservation; no fresh private-row audit is claimed.
- **57/57 primary local browser checks passed** across 1440px desktop, 390px touch emulation and 1440px reduced motion. Includes motion capability, film start/pause, modal focus, effective state labels, teardown, Studio native scrolling/search/feedback, no-JavaScript text, baseline preservation, zero runtime errors and zero external preview requests.
- **22/22 edge checks passed** for direct/reloaded hashes, browser back, keyboard film control, offscreen pause, dialog focus, independent smooth preference, five computed contrast pairs, all 36 variant byte lengths, 320/768/1024px overflow, mobile Studio logo clearance, image failure and film failure feedback.
- Full local Next.js production build passed: successful compilation, TypeScript and 52 generated static pages. The initial sandboxed build stalled and was stopped; the normal-process retry compiled in 8.7 seconds and completed successfully. Existing root-outside-repository lockfile warning was informational and no configuration was changed for it.
- Application and separate preview TypeScript checks passed. Focused foundation ESLint passed with zero reported warnings/errors. Existing unit suite: **344/344 passed**.
- Standalone preview bundle: approximately **385 KB uncompressed / 126 KB gzip**, including React and the review UI. This is a local specimen measurement, not a production-route or field-performance claim. The committed responsive image set is 2,739,786 bytes across all 36 variants; a browser chooses a suitable variant rather than downloading the set.

The required local comparison is saved in `phase2-performance.json`. Three fresh desktop contexts per prototype, without network/CPU throttling, measured Phase 1 LCP 308/104/108ms and Phase 2 96/172/100ms. Phase 2 CLS was 0.0251 in each sample versus roughly 0.00005–0.00059 in Phase 1. The Phase 2 React/motion specimen adds 119,254 gzip bytes over the smaller Phase 1 vanilla-JS specimen (126,128 versus 6,874 bytes, gzip level 6). These have different content/implementations and are local samples; they do not establish a production speed improvement or field acceptance. Existing route imports remain unchanged; production integration and its route-level cost must be measured in the authorized later phase.

The native/human/physical-device checks closed administratively in the previous migration remain historical. This new phase does not manufacture native screen-reader, phone, language-review or field-performance evidence.

## Independent finish review

The first review requested two visual corrections and checkpoint reconciliation: a dark Studio disclosure had insufficient contrast; reduced-motion/mobile controls misleadingly showed their stored preference as active; PRODUCT.md still described Phase 1-only authorization. All three were fixed. The reviewer reopened all 15 refreshed captures and scored all three **resolved**, with disposition **ship** for this local Phase 2 fix review. The Studio disclosure now measures approximately 7.23:1. This verdict is not production acceptance or Phase 3 authorization.

The Impeccable detector could not run because its Windows launcher returned `The system cannot find the batch label specified - cache_directory_failed`. The finish review used the source, craft-floor guidance and captures; no successful detector run is claimed.

## Media and release limits

The Drive folder inspection covered 38 direct children of the supplied source subfolder, with six image downloads selected for this phase. This is not a recursive audit of the entire Drive. Source-specific creator/permission evidence is not established merely by access. Every concept/material image remains labelled appropriately; maker-hands must not be presented as proof of an actual Rivya worker.

New candidate Studio IDs remain null. The existing film has the source-defined presentation ID `resin-pour`; this was read from the repository, not inferred from a fresh private database session. No Drive upload, Studio record creation, publication, product-media reassignment or stored-crop change occurred.

Stop here for owner review. Phase 3 integration, later public journeys and Studio redesign, final acceptance and release remain future phases. A push/PR/merge/deployment requires explicit authorization for this redesign; prior migration release instructions are not replayed.
