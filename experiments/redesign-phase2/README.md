# Phase 2 local animation and media review

This is a **historical, runnable local specimen**, retained for design comparison. The released cinematic site supersedes its presentation. It is not a current public/Studio route or a prerequisite to future releases.

Run from the repository root with Node 22:

```powershell
node experiments/redesign-phase2/build.mjs
node experiments/redesign-phase2/serve.mjs
```

Open `http://127.0.0.1:4179/` for animation, film, image crops and an unchanged Journal excerpt. Open `/studio` for the native-scroll control specimen. This loopback server exposes an explicit asset allowlist and accepts GET/HEAD only. It has no credentials, database connection or publication endpoint.

## Source boundaries

The specimen's archived components and scoped styles live in `experiments/redesign-phase2/foundation/`. They were relocated from the former application prototype directory after PR #64 review found that application-only reachability had missed this runnable consumer. Public/Studio application routes do not import this archive. For current product work, use the active components in `src/components/shop/` and `src/components/studio/`, rather than reintroducing these historical prototypes.

The archive retains the 13 October component appearance and media behavior from commit `ad84a2a`, including its motion-capability hook. Its only motion integration adaptation replaces the removed `@gsap/react` wrapper with an isomorphic React layout effect and the existing core GSAP `matchMedia` lifecycle. Cleanup reverts scoped animations, triggers and styles; no package was restored. `MotionSurface` remains limited to one specimen presentation region, while Studio controls use native scrolling.

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

The current review checks the experiment's bundled dependency boundary and interactions. The original whole-application source fingerprint in `docs/redesign/modern-design-2026-10-13/source-baseline.json` is historical: later approved releases deliberately changed the application. It is not a current preview pass/fail condition. The separately recorded original receipt is preserved. `performance.mjs` is also a historical two-preview comparison requiring Phase 1 on port 4178; it is not part of the current runnable-preview verification and must not overwrite the dated committed performance receipt.

## Smoothing decision

ScrollSmoother was prototyped, then rejected after a focus test reproduced `pointerdown` on Play film followed by `pointerup` on a different section. The retained implementation uses browser-native scrolling and smooth anchor navigation. GSAP handles only shallow image transforms and a few headings. There is no transformed full-page scroll wrapper, scroll-jacking, long pinning, custom pointer suppression or inertial Studio scrolling.

At its creation, owner approval of this preview was the stop gate before Phase 3. That historical phase gate has been superseded by later owner-approved work; this archive itself grants no production write or release permission.
