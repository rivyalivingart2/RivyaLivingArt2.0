# Phase 2 local animation and media review

Run from the repository root with Node 22:

```powershell
node experiments/redesign-phase2/build.mjs
node experiments/redesign-phase2/serve.mjs
```

Open `http://127.0.0.1:4179/` for animation, film, image crops and an unchanged Journal excerpt. Open `/studio` for the native-scroll control specimen. This loopback server exposes an explicit asset allowlist and accepts GET/HEAD only. It has no credentials, database connection or publication endpoint.

## Source boundaries

Reusable, opt-in components live in `src/components/design-foundation/`. Existing public/Studio route code imports none of them yet. Import `foundation.css` at a future authorized presentation boundary and use `.rv-foundation`; tokens do not replace production globals. `MotionSurface` is for one public presentation region per document, not Studio or an application-wide wrapper. Its cleanup restores native scroll behaviour and removes its scoped GSAP effects. Keep Studio on native scrolling; do not combine multiple smoothing engines.

The experiment hydrates the actual components over server-rendered HTML. Text, images and native video controls remain available without scripting. React/GSAP diagnostics and the unmount helper exist only in the experiment client. Neither diagnostics nor review labels belong in future public UI.

## Media

`media-manifest.json` holds six Drive source IDs, SHA-256 hashes of originals, dimensions, proposed focal points, alt descriptions, 36 responsive AVIF/WebP variants and explicit provenance limits. Optimized derivatives are committed under `media/` so the preview works without another authenticated download. Originals are retained locally under ignored `output/phase2-media/originals/`; no original was overwritten. To regenerate, fetch those exact six IDs through the authorized Drive connector into that folder and run `node experiments/redesign-phase2/prepare-media.mjs`. Never save signed download URLs in the repository.

The original room visualization, logo, fonts and material film/poster use existing repository assets. MP4 is first for broad playback support; WebM is an alternate source. `preload="none"`, a poster, native controls, a labelled button, visibility pausing and readable error feedback are implemented. Reduced-motion users see the same still poster and may explicitly play the film.

No new image generation was necessary. The supplied imagery fills the foundation-preview needs. It must not be labelled as proof of real workers, customers, projects or production processes. `studioId: null` means a new preview candidate has not been assigned a Studio media record. Do not infer one from a filename.

## Verification

```powershell
node experiments/redesign-phase2/review.mjs
node experiments/redesign-phase2/verify-edge-cases.mjs
node node_modules/typescript/bin/tsc --project experiments/redesign-phase2/tsconfig.json
```

Browser checks use installed Chrome through the repository's existing Playwright dependency. Screenshots and detailed receipts are ignored under `output/playwright/redesign-phase2/`; committed summarized evidence belongs in the modern redesign documentation directory. These checks are local browser emulation, not independent language review, physical-device or native screen-reader evidence.

## Smoothing decision

ScrollSmoother was prototyped, then rejected after a focus test reproduced `pointerdown` on Play film followed by `pointerup` on a different section. The retained implementation uses browser-native scrolling and smooth anchor navigation. GSAP handles only shallow image transforms and a few headings. There is no transformed full-page scroll wrapper, scroll-jacking, long pinning, custom pointer suppression or inertial Studio scrolling.

Owner approval of this preview is the stop gate before Phase 3. No push/release is authorized by this phase.
