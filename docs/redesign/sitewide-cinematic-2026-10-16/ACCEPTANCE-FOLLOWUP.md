# Cinematic acceptance follow-up

16 October 2026. Local branch `codex/cinematic-acceptance`, based on released main `66e82ef04f76b8460654bab4329ccbadfb47f28e`.

This follow-up addresses the four remaining acceptance areas identified by the owner. It includes actual contrast repairs, smaller font transfers, safer automatic video loading, broader conditional-screen tests and fresh production checks. These new source changes are local. No push, PR, merge, deployment, production data change or publication was performed.

## Changes

| Area | Change | Preservation |
|---|---|---|
| Homepage hero | Stronger directional shading behind copy; stable dark backing for the featured-piece note | Same logo, palette, words, product destination, selected film and crop |
| Resin in Motion | Shading remains dark enough behind text at intermediate tablet widths and on mobile | Same film, captions, visualization disclosure, playback controls and full-bleed composition |
| Material story / Our Story | Stronger mobile and tablet reading-area gradients | Same images, captions, crops, chapters and links |
| Studio access | Stronger background shading behind welcome text, including the shorter mobile reset state | Approved white glass remains at its existing 30–50% opacity; authentication forms and behavior preserved |
| Keyboard focus | Two contrasting edges across public and Studio controls; system Highlight outline in forced-colors mode | Existing interactions and accessible names retained |
| Font transfer | Common Inter files reduced from 187,088 to 109,252 bytes across three weights: 77,836 bytes / 41.6% less | Retained glyph outlines, horizontal spacing and vertical metrics verified unchanged. Complete original font remains available for other glyphs and combining clusters. No font upgrade or new runtime dependency |
| Hero loading | Automatic video waits for fonts and the opening poster to be ready | Explicit Play bypasses the wait; reduced-motion/data-saving modes, offscreen pause and poster fallback retained |

## Verification scope

The final machine-readable receipt is `acceptance-verification.json`; local raw evidence lives in `test-results/cinematic-acceptance/`. The receipt includes the source hashes and artifact hashes so a later release can identify exactly what was tested.

### Contrast and interaction states

The audit samples actual rendered backgrounds behind text at 1920, 1440, 1200, 992, 768, 512, 390 and 320 CSS pixels. It includes five decoded positions in each video loop, three ambient-gradient positions, bright-white/dark-black media stress cases, hover states and keyboard focus. It covers the hero, Resin film, material story, invitation, Our Story opening, collection opening and all four Studio access routes.

Background pixels are measured after hiding text fill while retaining images, film, filters, gradients and lighting. Thresholds are 4.5:1 for normal text and 3:1 for large text. Synthetic bright/dark media is identified separately from actual film frames. The approved frosted glass is tested at several gradient positions rather than certified from its flat colour values.

The expanded audit found a tablet-width film/story shortfall and a small mobile reset-page shortfall; both were fixed and rechecked. A later focus diagnostic sampled the fixed navigation's ivory logo behind an already covered heading at `(25,61)` and `(21,48)`. The sampler now excludes obscured line rectangles and holds scroll still during measurement. Those were measurement artifacts; no product content was removed or hidden to obtain a pass.

The separate interaction suite checks deferred automatic video, immediate manual playback, offscreen pause, reduced motion, data saving, slow-network fallback, unavailable-video poster, expanded-player Escape/focus restoration, persisted effects pause, two-edge focus at all eight widths and Windows forced-colors emulation. Emulated hardware and accessibility preferences do not establish actual hardware or native-reader results.

The final merged matrix contains **600 passing samples**, including **80 decoded video-frame samples** and **168 hover/focus background states**, with zero remaining measured failures. The separate interaction suite passes **66 checks**. The 60 mobile access rechecks replace their earlier results; the 96 homepage control rechecks replace measurements affected by fixed-navigation occlusion. Rechecks are not counted twice.

**Limits:** this is finite evidence for the tested content and design. Partly offscreen, occluded and fading text is excluded. It does not certify every continuous animation frame, every arbitrary future content combination or complete WCAG conformance.

### Public and conditional coverage

- All **656 current sitemap URLs** returned successful HTML with a title and heading.
- All **246 referenced media URLs** in that inventory returned successful responses.
- All **656 published URLs** then opened in Chromium at 390px with touch/reduced-motion emulation. Each visible main-content image placement was scrolled into view. No broken/unloaded images, horizontal overflow or page JavaScript errors were found in that run.
- **1,051 conditional assertions across 321 local states** passed. Coverage includes six product child tabs; six editorial-family child editors; Hindi/Gujarati panels; existing saved revisions; homepage presentation options; seven story-page groups and individual chapter styles; private workshop controls; nine labelled authoring states; intercepted service failure and recovery; session renewal; missing records; unavailable fixture history; and all 37 anonymous Studio redirects plus six unauthorized APIs.
- Unsaved selector changes were discarded. The local browser blocked mutation requests and recorded zero attempted writes. These checks do not claim to save or publish every possible combination of options.
- Authenticated administrator views, anonymous denial and automated authorization tests are covered. Fresh real sessions for every individual staff role were not created; production role accounts and permissions were left intact.

### Renewed production Studio checks

`acceptance-production-studio.json` records read-only observations after the owner renewed sign-in. Public media opened with 131 product assets and zero broken completed images. Its first API request took 1,355ms; the latest repeat took 398ms. Observed editorial-image requests ranged from 333 to 1,913ms. These are session measurements, not a service-level or field-performance guarantee.

The published B13 media child editor rendered its image, metadata and 18 saved usages. Saved homepage desktop/mobile crop controls were present and untouched. Our Story revision 3 rendered in full-width and mobile saved previews. Journal DB001 revision 6 rendered; its existing Hindi and Gujarati panels each showed reviewed, 19/19 fields filled. Observing that saved state is not a new independent language review.

The older local DB001 fixture has no saved revision. Its unavailable-preview response is covered, while an actual newer saved local article and the existing production DB001 revision confirm the successful path.

## Performance

See the per-route cold/repeat results in `acceptance-verification.json`. Measurements use fresh browser contexts, not a forced purge of hosting/server/CDN caches. The slow-mobile profile uses 390×844, 4× CPU throttling, a configured 150ms network latency and 1.6Mbps download. Browser long-task blocking is not presented as INP or a Lighthouse score.

The initial 32 production samples were collected alongside other audits, so a separate serial mobile run is the stronger mobile evidence. Local candidate results demonstrate the candidate under the same browser profile but have a different origin and database; they must not be advertised as production performance improvements.

The dedicated production mobile run still exceeds the 2.5-second cold LCP target. It therefore does **not** pass production cold-load acceptance:

| Route | Three cold LCP samples | Median | Repeat visit |
|---|---|---|---|
| Homepage | 3.668s / 3.608s / 3.208s | 3.608s | 1.240s |
| Collection | 2.772s / 2.800s / 2.692s | 2.772s | 1.284s |
| Journal | 3.524s / 3.172s / 3.060s | 3.172s | 1.348s |
| Product | 2.520s / 2.508s / 2.900s | 2.520s | 2.388s |

No sampled layout shift exceeded 0.000154 in that dedicated run. Server wait also varied: the product repeat sample's TTFB was approximately 695ms. All requests succeeded. Further production acceptance must be measured after the new candidate is released; neither a repeat-visit improvement nor a low CLS value closes the cold-LCP gate.

The final local candidate's 12 cold mobile samples all passed 2.5s. Medians were **1.736s home**, **1.436s collection**, **1.636s Journal** and **1.288s product**, with a total cold range of **1.272–1.808s**. Four additional repeat visits were recorded. Maximum observed candidate CLS was 0.000468. This is evidence from the local candidate, not a measured production speedup or a promise about a physical phone.

No LCP, INP or CLS field observations were returned by the scoped Vercel queries for the released checkpoint window. The public PageSpeed request was also unavailable because the shared API quota returned 429. No analytics or tracking service was enabled. `acceptance-field-availability.json` records the empty field results; empty results are not passing results.

## Native and physical limitations

The owner requested **existing screen readers only** and confirmed **no physical device is available**. The already installed Windows Narrator was attempted. Its higher-integrity window prevented the available helper from observing speech/recap output. Narrator was stopped and no new screen-reader software was installed. Native screen-reader tasks remain unverified.

Actual phone/tablet and low-powered hardware observations remain unavailable. Responsive browser tests, CPU throttling, reduced motion and emulated device capabilities are reported as browser evidence only. `acceptance-native-limitations.json` preserves these constraints and the attempted test result.

## Preservation and release

All **1,658 protected local rows in 13 scopes** match their before/after counts and fingerprints. This includes content, products, revisions, media associations, business settings, inquiries, orders/events, staff and privacy records. Session tables are outside that protected snapshot. No production business data was written, no translations republished, and no customer inquiry or testimonial was invented.

Original full font files, media files, database/API handlers and business metadata were not changed. The presentation changes retain the established dark palette and logo. Historical access-request table activation remains a separate prerequisite; this pass did not perform a production migration or establish that prerequisite.

Build and type checks pass; lint has zero errors and the same 62 existing warnings. All 350 unit, 403 runtime and 12 preflight checks pass. `git diff --check` passes. New checks are reproducible under `tools/cinematic-acceptance/`; authenticated local work requires the existing guarded QA runtime.

## Visual evidence

Normal-media screenshots, separate from artificial contrast stress images:

- `test-results/cinematic-acceptance/after-hero-1440.png`
- `test-results/cinematic-acceptance/after-hero-390.png`
- `test-results/cinematic-acceptance/after-resin-1440.png`
- `test-results/cinematic-acceptance/after-resin-390.png`
- `test-results/cinematic-acceptance/after-studio-login-1440.png`
- `test-results/cinematic-acceptance/after-studio-login-390.png`
- `test-results/cinematic-acceptance/studio-login-focus-390.png`

Earlier production baseline captures remain in the same directory as `performance-desktop-home.png` and `performance-mobile-home.png`. All raw images remain local and ignored by Git. The final receipt inventories filenames and hashes.

## Remaining gates

| Requested acceptance area | Status | Exact boundary |
|---|---|---|
| Contrast over moving backgrounds | Completed for the measured matrix | Repairs verified across 600 current samples and 66 interaction checks; finite coverage and visibility exclusions above remain explicit |
| Conditional-screen coverage | Completed for the documented matrix | Current published URL inventory plus individual supported controls, child editors, saved previews and error/authorization checks; not every possible permutation or newly created staff-role session |
| Production performance acceptance | Partially completed | Repeated production measurements and local optimizations completed; released slow-mobile cold LCP still exceeds target and field observations were unavailable |
| Real-device and native assistive testing | Not completed | Existing Narrator attempted but speech unobservable; owner confirms no physical device; no new software installed |

1. Release these new local fixes through a detailed PR only after the owner's release instruction, then recheck the exact production deployment and slower-mobile cold loads.
2. Obtain observable native screen-reader results and actual physical-device observations when the permitted equipment is available.
3. Obtain sufficient actual field observations before claiming production field-performance acceptance.

This report does not mark unavailable observations complete by assumption or by an earlier administrative sign-off.
