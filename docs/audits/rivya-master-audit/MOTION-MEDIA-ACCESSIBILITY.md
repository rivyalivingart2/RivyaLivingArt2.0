> **Final continuation, 19 October 2026:** [PENDING-FINAL-REPORT.md](PENDING-FINAL-REPORT.md) and [pending-final-verification.json](pending-final-verification.json) record the owner-approved production request-table repair and successful live queue refresh, the final pagination accessibility correction, and 34 additional real browser/HTTP lifecycle checks. They supersede earlier open request-table, pagination-ARIA and framework-adapter-only statements. Source release and external provider/device/native/field acceptance remain separate. The historical results below were not rerun or silently upgraded by this continuation.

# Motion, media and accessibility source audit

> Final status authority: this document retains the dated 17 October source/before review. The 19 October coordinator sections and [FINAL-VERIFICATION.md](FINAL-VERIFICATION.md) provide the final candidate results; [SECURITY-RELEASE-REVIEW.md](SECURITY-RELEASE-REVIEW.md) covers later dependency patches. Earlier source-only requests and issue labels below are not new current passing or open-test claims.

Audit date: 17 October 2026. Baseline HEAD: `66e82ef04f76b8460654bab4329ccbadfb47f28e`. Working branch: `codex/rivya-master-audit`. This specialist pass writes audit reports, the authorized `tools/master-audit/motion-seo-repro.mjs` reproduction tool and ignored browser evidence only. A later delegated follow-up independently reproduced the two motion findings locally and checked one public production article's language metadata. No application source, media, records, dependency or release was changed by this pass.

## Evidence boundaries

This review inspects the current working source, compares the pre-existing acceptance changes with HEAD, freshly hashes the approved local film assets, and records the narrow fresh browser reproductions below. It does not substitute historical screenshots or test receipts for new contrast, device or screen-reader observations. `FINAL-VERIFICATION.md` is the authoritative integration record for the complete audit.

The prior cinematic redesign is an existing baseline to retain. `docs/redesign/sitewide-cinematic-2026-10-16/ACCEPTANCE-FOLLOWUP.md` describes a later, still-local acceptance repair bundle. Its 600 contrast samples, 66 interaction checks and other totals are historical evidence, not tests rerun by this specialist. Current media bytes and source behavior are independently inspected below.

## Architecture and current coverage

| Area | Actual source | Source observation | Assessment |
|---|---|---|---|
| Public page lighting | `src/components/shop/shop-frame.tsx:21`, `design-foundation/cinematic-canvas.tsx:15` | Public frame wraps its contents once. Context avoids duplicating the canvas when public previews are nested in Studio. | KEEP. One shared enhancement boundary; not homepage-only. |
| Studio productivity lighting | `studio/workspace.tsx:130`, `cinematic-canvas.module.css:12` | Same palette with restrained opacity; Studio ambient/glow keyframes are disabled. It does not install the public page GSAP runtime. | KEEP. Preserve operational layouts. |
| Studio access | `studio/access-shell.tsx:22`, `studio/studio-access.module.css:58` | Existing making-study image, logo, approved white 30–50% glass, and pause/reduced-motion behavior. Glass pauses on focus, hover, explicit pause, offscreen and hidden-tab state. | KEEP approved design. Moving-background contrast needs current browser evidence. |
| Pointer interpolation | `cinematic-canvas.tsx:35` | Refs/local variables, exponential easing with 115ms response, one scheduled rAF, transform on spotlight, CSS coordinates on only the active card. Stops scheduling after convergence. | Source lifecycle satisfactory; no React render per pointer move. Active-card radial lighting still requires paint, so this is not described as entirely compositor-only. |
| Pointer interaction safety | `cinematic-canvas.tsx:59`, `cinematic-canvas.module.css:2` | Decorative layer is `aria-hidden`, `pointer-events:none`. Photography/input/dialog targets quiet the lighting; focus in fields also suppresses it. | KEEP. No cursor replacement or click interception. |
| General scroll effects | `cinematic-motion-runtime.ts:6` | Delayed dynamic import, scoped GSAP context, headings stay opaque; media moves -2% to +2%. Existing homepage motion boundary is excluded. | KEEP. No scroll hijacking. |
| Homepage motion | `shop/homepage-motion.tsx:11`, `homepage-motion-runtime.ts:7` | 600ms optional import; native smooth anchor behavior; media -3% to +3%, short heading/CTA entrances; cleanup restores previous scroll behavior. | KEEP, with low-memory consistency finding MOTION-01. |
| Hero and Resin film | `shop/cinematic-video.tsx:23`, `material-film.tsx:10` | One reusable poster-first player, explicit play/pause, responsive cover, native expanded player, complete visual description. | KEEP. No new film, shader or library needed. |
| Full-bleed image chapters | `shop/immersive-image.tsx:7`, `chapter-media.tsx:8` | Saved image usage feeds the same editorial renderer. Media moves inside overscan, while captions remain outside moving layers. | KEEP; no replacement/crop mutation. |
| Product media | `shop/product-gallery.tsx:9` | Source/caption/focal positions retained; arrow/Home/End navigation, touch gesture discrimination, thumbnail selection, enlarged `contain` image, no-script image links. | KEEP product-specific presentation rather than forcing a cinematic cover over detail inspection. |
| Image failures | `shop/public-image.tsx`, `hero-image.tsx:15` | Stable unavailable state, meaningful accessible text where appropriate, product retry, and hero text fallback. | KEEP; validate failure rendering in browser, not just source. |
| Non-current foundation specimens | `design-foundation/MaterialFilm.tsx`, `MotionSurface.tsx` | Alternative earlier components exist but no current source imports were found in the inspected app/component tree. | INTENTIONAL reference code, not evidence that those behaviors run in production. No reactivation. |

The reusable reveal mechanism is currently attributes plus scoped runtimes, not a separate component named `ScrollReveal`. A cosmetic rename would add no audit value. Main website, Studio access and operational Studio deliberately use different intensity levels within the same system.

## Lifecycle, capability and media review

### Source checks that are supported

- `cinematic-canvas.tsx:32–82` cancels pending rAF and delayed work, disconnects its intersection observer, removes pointer/focus/scroll/resize/media-query/network/visibility listeners, clears the active-card attributes and reverts the current motion context. Version guards prevent a late dynamic import from mounting after cleanup.
- The canvas gates enhancement on fine pointer, hover, no reduced motion, visible document, visible root, no Save-Data/2G constraint, memory above 4 GB when reported, and more than four CPU cores when reported. Unknown hardware values are not treated as proof of fast hardware. Homepage has a separate gate; its memory mismatch is listed below.
- `cinematic-motion-runtime.ts:19–20` and `homepage-motion-runtime.ts` cancel the refresh rAF and revert their scoped GSAP contexts. Paused or failed optional loading leaves server-rendered readable text.
- `cinematic-video.tsx:23–84` mounts sources only when playback is requested and the frame is visible. Intersection and visibility changes pause playback. Reduced-motion or data-saving changes set the background intent to pause. An explicit user Play remains possible afterward. WebM/MP4 source failures retain the poster and an unavailable-film message.
- Automatic video gating uses reduced motion, Save-Data and 2G/slow-2G information; it is **not** a promise that all low-memory devices receive no video. The separate hardware restrictions primarily govern decorative lighting and parallax.
- The explicit film control is deliberately independent of Pause effects. Pausing decoration is not expected to stop a film the visitor chose to play. The expanded player pauses the background and uses native controls; native control Tab events are not trapped by the parent custom wrap. Dialog Escape and opener recovery are implemented in `shop/dialog.tsx:29–57`.
- Access-panel observer and visibility listeners are removed on unmount (`studio/access-shell.tsx:13–20`). CSS stops its animation for reduced motion and print, with an opaque white fallback when backdrop filtering is unavailable.

These are source conclusions, not a heap-retention measurement, CPU/GPU profile or native-reader certification. No unconditional memory leak was identified in the reviewed lifecycle code.

### Verified source findings reproduced in the browser

| ID | Severity | Actual / expected | Source cause | Minimal local correction | Verification and status |
|---|---|---|---|---|---|
| MOTION-01 | P2 | A desktop reporting 4 GB and 8 cores classifies the global canvas as low-power while the independent homepage controller still loads scroll motion. Both should honor the same already-established hardware policy. | `shop/homepage-motion.tsx:15` checks only CPU cores; compare `design-foundation/cinematic-canvas.tsx:27`. | Include the same memory condition in the existing predicate, or share that predicate. No new dependency or composition change. | VERIFIED_OPEN, reproduced: 4 GB / 8 cores gave `low-power` canvas, `active` homepage and hero translation -29.7px → -5.94px. 8 GB / 8-core normal and 8 GB / 4-core static controls behaved as expected. |
| MOTION-02 | P2 | Pause effects tears down GSAP, but CSS `section-arrival` view-timeline animations are not covered by that opt-out. An entering section still translates while the interface reports Effects paused. | `shop/shop.module.css:128–129`; `design-foundation/cinematic-tokens.css:8–9` only suppresses card decoration and selected pseudo-elements. | Scope `animation:none!important; transform:none!important` to the paused canvas's legacy `.section`/`.storyImage` elements. Do not merely pause the animation at a displaced intermediate frame. Keep operational feedback and explicit film controls usable. | VERIFIED_OPEN, reproduced: collection `#browse` translated 10.1497px → 5.83243px → 0 while canvas/preference both reported paused, including a persisted paused reload. Resume was also exercised. |

These are different roots of incomplete fallback coverage, not a recommendation to add animation. No performance degradation is inferred merely from the existence of a ScrollTrigger. The source reviewer did not implement fixes; the coordinator owns correction and retesting.

### Fresh browser reproduction conditions and evidence

Headless Google Chrome **155.0.8059.40**, 1440×900 CSS pixels, DPR 1, desktop/fine pointer, no reduced motion, controlled 4G/no-Save-Data connection. Fresh browser contexts had no imported administrator session. Optional runtime initialization waited for visible H1, fonts, 1,800ms and a second 500ms stable state sample. The hardware scenario additionally measured the transform after a real scroll. CSS section evidence records actual scroll coordinates, computed animation names/timelines and transforms across five entry positions. Screenshots alone were not used to infer movement.

- Local receipt: `test-results/rivya-master-audit/motion-seo-repro-before.json` (preserved baseline); `motion-seo-repro.json` is the latest script output.
- Local captures: `motion-low-memory-4gb-8core.png`, `motion-css-section-enabled.png`, `motion-css-section-paused.png`, `seo-article-hi.png`, `seo-article-gu.png`.
- The completed local run reported **zero execution errors and zero non-GET/HEAD write attempts**. The earlier sandboxed attempt could not reach localhost and was not counted as a test result; the authorized run outside that network restriction produced the evidence above.
- Screenshot inspection confirms the captured pages are the expected collection and article designs. The transform receipt, rather than a static screenshot, establishes the pause failure.

### Language metadata follow-up: source suspicion tested against both environments

The exact route `/journal/a-room-begins-with-a-statement-table` was opened independently in fresh `en`, `hi`, and `gu` preference contexts, using public GETs only.

| Environment / language | HTML language | Visible H1 and structured headline | Article `inLanguage` | Result |
|---|---|---|---|---|
| Local / English | en | A Room Begins with a Statement Table | en | Correct control |
| Local / Hindi | hi | A Room Begins with a Statement Table | en | English fallback; original metadata suspicion NOT_REPRODUCED locally |
| Local / Gujarati | gu | A Room Begins with a Statement Table | en | English fallback; original metadata suspicion NOT_REPRODUCED locally |
| Production / English | en | A Room Begins with a Statement Table | en | Correct control |
| Production / Hindi | hi | कमरे की पहचान बनती है एक खास मेज़ से | en | SEO-LANGUAGE-01 VERIFIED_OPEN |
| Production / Gujarati | gu | રૂમની ઓળખ બને છે એક ખાસ ટેબલથી | en | SEO-LANGUAGE-01 VERIFIED_OPEN |

All six page requests returned 200. In each case the JSON-LD headline exactly matched the visible H1. The production Hindi/Gujarati headings contained the expected script. This independently verifies the production mismatch rather than assuming the local database contains the same reviewed translations.

Root cause: `shop/structured-data.tsx:15` hard-codes `inLanguage:'en'`, while `published-content.ts:29` applies `localizeContent` and `editorial.tsx:97` renders the resulting localized document. Minimal correction is to pass the **resolved editorial content language** into JSON-LD. Do not blindly use the interface cookie: the local English fallback correctly needs `en`. Existing `availableEditorialLanguages` derives from reviewed source translations (`editorial-metadata.ts`, `published-content.ts:34`), so this can be transient rendering metadata without a database schema change or publication.

A distinct fallback accessibility observation is also verified locally: English H1 text inherited `hi`/`gu` from `<html>` with no nearer `lang="en"` boundary. `layout.tsx` sets the interface language, `localizeContent` returns English for unreviewed/missing translations, and `EditorialDocument` does not distinguish the fallback text's language. A scoped language boundary on actual fallback content is appropriate; translated navigation/controls should retain their real interface language. This is a DOM-language finding, not a claim about native screen-reader speech output.

Production receipt: `test-results/rivya-master-audit/motion-seo-repro-production-language.json`; captures: `seo-article-production-hi.png`, `seo-article-production-gu.png`. The completed production language run reported **zero execution errors and zero write attempts**. All raw evidence is Git-ignored. No sign-in, CMS, database, publishing or release operation occurred.

## Targeted local corrections after reproduction

The coordinator checkpointed the pre-audit acceptance bundle at `40907ff` before authorizing these focused local fixes. No release or production mutation is included.

| Finding | Local correction | Fresh proof | Remaining gate |
|---|---|---|---|
| MOTION-01 | `homepage-motion.tsx` now applies the same reported-memory threshold as the global canvas: 4 GB or lower suppresses decorative homepage motion, even when CPU cores exceed four. Existing pointer, connection, pause and cleanup behavior remains. | Targeted ESLint passed. The original 4 GB/8-core reproduction is preserved in `motion-seo-repro-before.json`. | Rerun the capability browser matrix against the rebuilt local server; source editing alone is not a browser pass. |
| SEO-LANGUAGE-01 | `localizeEditorialContent` resolves actual language from the original revision before public projection or saved-preview localization. Article JSON-LD uses this transient value. Reviewed hi/gu yields hi/gu; missing, incomplete, unreviewed and stale translations retain en. | New render regressions exercise the actual JSON-LD script component and review-gated text for both languages. | Rebuilt local browser verification. Production remains the pre-fix release. |
| A11Y-LANGUAGE-FALLBACK-01 | Explicit content-language boundaries on editorial headings, prose/chapter content, main media, Journal leads/cards and content labels. Interface controls retain the document interface language; `JourneyText` continues to supply its own language boundary. | Pure localization and rendered metadata regressions pass; code review confirms no translation eligibility or stored data change. | Rebuilt browser H1/body language and translated-control checks; native reader speech remains untested. |
| Saved-preview consistency | Preview callers now pass original captured revisions into the localization boundary. Snapshot cards identify hi/gu only when their saved `localizedCopy` contains that language. Saved images, crops, IDs, routes and dependency revisions remain unchanged. | Tests cover current reviewed hi/gu, all fallback states, captured translated and legacy English cards, source immutability and JSON-LD escaping. | Current private preview render smoke after rebuild. |

Focused command: `node --import tsx --test tests/editorial-content-language.test.mjs tests/editorial-language-presentation.test.mjs tests/p6-completion.test.mjs` — **29 passed, 0 failed, 0 skipped** (14 new regression cases and 15 existing cases). Targeted ESLint over the ten owned source/test files exited 0. TypeScript was also started; its then-current errors were in concurrently edited `e2e/frontend.spec.ts:55` and `playwright.config.ts:32`, outside this specialist's files. Final integrated verification belongs to the coordinator. No build or server restart was performed by this specialist.

The language correction is scoped to the reproduced editorial/article problem and captured card contracts. It does not constitute a complete native-reader certification of every mixed-language aggregated widget.

## Existing local acceptance changes, kept separate from released HEAD

| Pre-audit local change | Current source inspected | Current conclusion |
|---|---|---|
| Stronger hero reading scrim and stable featured-piece note backing | `shop/modern-homepage.module.css` | Present locally. Same structure, approved colors and content. Recheck moving frames in browser; do not imply live release. |
| Stronger Resin film desktop/tablet/mobile scrims | `shop/material-film.module.css:2`, `:10` | Present locally. Whole film and complete description remain. |
| Stronger immersive-story mobile and inner-page tablet scrims | `shop/immersive-image.module.css`, `reference-pages.module.css:49` | Present locally. Direct saved image positions remain intact. |
| Stronger access welcome-area shading | `studio/studio-access.module.css:103–123` | Present locally. Approved glass opacity and logo are unchanged. |
| Two-edge keyboard focus | `design-foundation/cinematic-tokens.css:11–12` | Present locally: ivory outline plus charcoal backing, system Highlight in forced colors. Requires rendered focus/occlusion checking. |
| Common Inter subset narrowing | `src/app/layout.tsx:25–36`, `src/styles/fonts/inter-common-*.woff2` | Actual current sizes freshly read: 35,784 / 36,716 / 36,752 bytes = 109,252. HEAD values are 61,016 / 62,836 / 63,236 = 187,088; 77,836 fewer bytes, 41.6%. Complete original font definitions remain. Glyph equivalence is supported by the prior acceptance receipt, not independently rerun here. |
| Priority automatic film startup waits for poster and fonts | `shop/cinematic-video.tsx:36–57` | Present locally. Decode errors are caught; explicit Play bypasses automatic readiness gate; unmount guard prevents a late promise from resuming the player. Network and actual LCP effect require fresh measurement. |

These modifications were already in the worktree before the master audit. They are not newly invented fixes, and local evidence does not establish their production behavior.

## Fresh media integrity results

Read-only SHA-256 and file-size checks were run on 17 October 2026 against the actual files. All match `src/lib/presentation-media.ts` exactly.

| File | Bytes | SHA-256 | Result |
|---|---:|---|---|
| `public/media/migration/hero-pour-loop-poster.jpg` | 98,481 | `e7dec2a8d6972a0825caf57aae320db7b1a0c319eb2f7a3d5581ba9190040caf` | Match |
| `public/media/migration/hero-pour-loop.webm` | 1,649,274 | `ba77d14e1d380f382bbc86af1c5e8533ad3e8a0ad2bb604d06506b3da5b216c8` | Match |
| `public/media/migration/hero-pour-loop.mp4` | 2,135,160 | `61d4633578353e813e64506877eed198bc682b6424701b7783720af51530869d` | Match |

The manifest labels the material film as an approved visualization, not footage of a particular completed commission. The description in `material-film.tsx` preserves that distinction. Local byte integrity is not a fresh independent rights/creator review of the Drive source.

`EditorialImage` interpolates numeric desktop/mobile `x` and `y` values directly; `home-editorial.ts:18` and `landing-dependencies.ts:31` use nullish fallback. Explicit 0% coordinates therefore remain zero. `HeroImage` accepts complete position strings; a string such as `0% 0%` is truthy and is not replaced by its default. Product galleries pass position strings through unchanged. Captions and factual/concept disclosures remain source data rather than generated replacement copy.

## Accessibility and composition review

| Topic | Source assessment | Remaining evidence |
|---|---|---|
| Safe viewport sections | Story and hero sections use `min-height:100svh` or near-viewport minimums. Natural flow can grow. Public reading, catalogue filters, search, forms and Studio operations retain content-driven layouts. Mobile removes minimum heights from selected/gallery-heavy bands. | Current short-height, 320px, long translation and 200% browser zoom checks. A minimum-height declaration alone is not proof of no clipping. |
| Seamless edges | `section-atmosphere.module.css`, `public-pages.module.css` and media overlays terminate at shared charcoal; media/image captions remain stationary. | Current adjacent section screenshots, especially optional CMS order/layout combinations. |
| Typography | Existing serif display / Inter body / mono data roles retained; WOFF2, swap, balanced headings, 68–72ch reading measures, 16px public form inputs and natural growing layouts. No content rewrite proposed. | Real wrapping and translated glyph rendering require fresh samples. Numeric token differences alone are not a defect. |
| Video descriptions | Silent material visualization has a complete associated description; poster and static print alternative remain. | Automated “video captions” nodes require human/context review because silence has no speech to caption. Do not label all automated incomplete nodes passed. |
| Keyboard media use | Named controls, native modal, visible close control, Escape callback, opener return, gallery keyboard commands and 44/48px principal controls exist. | Fresh keyboard traversal, native video controls, nested dialog focus, short-height scroll and focus-ring obstruction. |
| Reduced motion | CSS disables animation/transition/smooth scrolling; JS gates optional motion and background autoplay; manual film remains available. | Test changing the preference while already playing, not just a fresh reduced-motion page. |
| Forced colors | Decorative light/card layer is hidden and local focus uses system Highlight; content is not globally hidden. | Render in forced colors with actual controls and access panels. |
| Glass fallback | Base white panel works without backdrop-filter. Explicit pause, reduced motion and visibility stop its loop. | Re-sample text and boundaries over actual panel frames. A separate reduced-transparency rule is an optional future enhancement, not a claimed WCAG AA failure or permission to replace approved glass. |
| Contrast | Fixed dark film controls, directional scrims, bounded lighting and local two-edge focus make verification tractable. | All relevant video/gradient/glass state contrasts still need the coordinating audit's fresh measured evidence. Source colors alone cannot pass this gate. |

Native reader tasks, physical phones/tablets and weaker physical hardware remain separate. The owner permits only an existing screen reader and states no physical device is available. Neither browser emulation nor a source audit closes those gates.

## Targeted current-browser matrix handed to the coordinator

1. At 1920, 1440, 1200, 992, 768, 512, 390 and 320 widths, record viewport height, DPR and browser; test hero, film, media chapter and login. Include short portrait height and translated reading pages. Check horizontal overflow and complete controls/captions.
2. Hero: first paint poster; offscreen film has no sources; automatic readiness wait; explicit immediate Play; offscreen and tab-hidden pause; explicit Pause persists on re-entry; reduced-motion and network changes during playback; source failures retain poster/status.
3. Resin: scroll-linked media transform on eligible desktop, no transform on touch/reduced mode; Play/Pause; expanded native controls; Escape returns focus; static print still is visible.
4. Cursor: follow and settle without snapping, idle ambient layer, no pointer capture, no color shift while directly over product imagery, fields quiet on keyboard focus; one canvas after client navigation and Studio previews.
5. Opt-outs: persistent pause including CSS section entrances (MOTION-02); low-memory/high-core split (MOTION-01), low-core, Save-Data/2G, reduced motion, narrow touch, forced colors.
6. Contrast: actual decoded bright/dark video frames, multiple ambient and white-glass positions, normal/hover/focus states, fully visible unoccluded text only. Distinguish stress-test substituted backgrounds from real frames.
7. Repeated navigation: compare active observers/timelines or retained listeners before/after route cycles and inspect heap/performance only with a recorded method. Source cleanup alone is not a quantitative memory result.

Raw output belongs under ignored `test-results/rivya-master-audit/`. No private record or browser trace should enter Git.

## Skills used and deliberately not applied

All twenty user-named skills were found under `.agents/skills/`. Selective use respects current owner scope and the existing design instead of applying every example literally.

| Skill / group | Review usage or exclusion |
|---|---|
| `memory-leak-prevention` | Read/applied: effects, listeners, rAF, timers, observers, asynchronous loading cleanup. |
| `micro-interaction` | Read/applied: purposeful feedback, small transforms, reduced motion; its Motion imports/demo recipes were not adopted. |
| `transitions-polish` | Read/applied: classify UI versus story duration by purpose, not closest token. No duration rewrite without a reproduced defect. |
| `image-media-optimization` | Read/applied: dimensions/aspect ratios, priority versus deferred sources, responsive crop, poster/fallback and exact local media integrity. |
| `luxury-dark-mode` | Read for hierarchy and restrained accent review. Its sample palette and metallic CTA replacement are rejected because current brand colors and approved design must remain. |
| `better-typography` | Read/applied to font roles, line measure, size and wrapping risk. Source-only review cannot approve rendered long-copy wrapping. |
| `glassmorphism` | Read/applied to existing access-panel fallback, pause and readability. No SVG refraction, heavy filters, new noise layer, opacity reduction or standalone demo. |
| `fixing-accessibility`, `mobile-native`, `studio-admin-ux` | Read/applied in the preceding Studio source pass; target size, labels, semantics, conditional editors and operational clarity. Native-device evidence stays separate. |
| `gsap-performance`, `gsap-react`, `gsap-scrolltrigger` | Official installed skills reviewed: scoped context, cleanup, lazy runtime, bounded transforms and browser-native scrolling. Existing `gsap@3.15.0` / `@gsap/react@2.1.2` reused. |
| `rivya-cinematic-visual-qa` audit kit | Read/applied: eight widths, interaction proof separate from screenshots, factual labels, 0% crops and ignored evidence. No supplied script was executed by this specialist. |
| `framer-motion-advanced` | Entry/philosophy inspected; package-specific implementation excluded. Current GSAP already serves the task. Its blanket “never linear” guidance is not appropriate for a one-to-one scroll scrub. |
| `apple-design` | Entry/routing inspected; no native HIG compliance review claimed. Native Apple visual replacement/refraction is not required for this existing web audit. |
| `ui-ux-pro-max`, `web-design-guidelines`, `nextjs-app-router-perf`, `web-perf`, `core-web-vitals-booster`, `clean-code-architecture`, `css-module-scalability`, `refactoring-ui` | Present and potentially relevant to the whole audit; routed to coordinator/performance/recon work. This specialist does not claim their complete application or manufacture a second redesign. |

No package installation or new external UI code occurred. Prior component research is retained in the cinematic release documentation. This pass finds no evidence-based need to add WebGL, another motion framework or a replacement gradient package.


## Final coordinator verification

The earlier source/reproduction sections are the before record. Final candidate: 2f7fc8e634fea4593b3bf1c44ed90d16fe7c6ef48bd21b977e1737a46341071b. MOTION-01 and MOTION-02 are now VERIFIED_FIXED in motion-seo-repro-after.json (normal/low-core controls, memory fallback, pause/reload/resume transforms). English fallback boundaries are DOM-verified; 14 new render tests cover actual reviewed hi/gu schema plus stale/missing/unreviewed fallbacks. Final unit total 364/364. No stored content, translations or publication decisions changed; application source was intentionally fixed. Final 2026-10-19 automated accessibility: 86 scans, 0 violations and 0 errors; named comparison scroll region fixes the prior 390px violation. Native speech output remains BLOCKED. 432 contrast samples and 66 interaction/fallback cases are preserved 17 October evidence; screenshots alone do not prove every animated frame. See FINAL-VERIFICATION.md for exact scope and gates.
