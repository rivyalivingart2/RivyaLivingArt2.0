> **Final continuation, 19 October 2026:** [PENDING-FINAL-REPORT.md](PENDING-FINAL-REPORT.md) and [pending-final-verification.json](pending-final-verification.json) record the owner-approved production request-table repair and successful live queue refresh, the final pagination accessibility correction, and 34 additional real browser/HTTP lifecycle checks. They supersede earlier open request-table, pagination-ARIA and framework-adapter-only statements. Source release and external provider/device/native/field acceptance remain separate. The historical results below were not rerun or silently upgraded by this continuation.

# Performance and SEO audit

**Latest continuation — 19 October:** [PENDING-COMPLETION.md](PENDING-COMPLETION.md) and [pending-verification.json](pending-verification.json) supersede the previous translation-transfer and disposable-service-lifecycle pending statements. They include the renewed-session production request failure, fresh tests and exact remaining gates. Results below retain their original date and scope.


> Final status authority: this document retains the dated 17 October source/before review. The 19 October coordinator sections and [FINAL-VERIFICATION.md](FINAL-VERIFICATION.md) provide the final candidate results; [SECURITY-RELEASE-REVIEW.md](SECURITY-RELEASE-REVIEW.md) covers later dependency patches. Earlier source-only requests and issue labels below are not new current passing or open-test claims.

Audit date: 17 October 2026. Repository baseline: `66e82ef04f76b8460654bab4329ccbadfb47f28e`, branch `codex/cinematic-acceptance`. This report inspects that baseline plus the preserved local acceptance work. Those local files are not evidence of a deployed optimization. The audit lead separately verified the GitHub PR #62/#63 receipts and the production deployment identity; no release operation was performed for this audit.

## Evidence and acceptance boundaries

This specialist performed source inspection and fresh, read-only font/media verification. Browser profiling, production requests and execution of package checks belong to the audit lead so concurrent processes do not invalidate timing measurements. Earlier performance reports are historical context, not passing results for this audit.

The requested acceptance targets are LCP at or below 2.5 seconds, INP at or below 200 milliseconds and CLS at or below 0.1. Field assessment uses the 75th percentile, segmented by device class. A controlled load test can measure LCP and CLS, but a load-only Lighthouse result does not establish INP; Total Blocking Time is a lab diagnostic rather than a replacement for INP. [Google's Core Web Vitals definitions](https://web.dev/articles/vitals)

| Measurement | Current evidence in this specialist report | Acceptance conclusion |
|---|---|---|
| Production LCP, CLS, TTFB across repeated cold browser sessions | Not measured by this specialist; audit-lead results must be attached with conditions | Unestablished here |
| Slower mobile network / CPU samples | Not measured by this specialist | Unestablished here |
| Actual interaction latency / INP | No fresh interaction or field measurement by this specialist | Unestablished here |
| Field p75 LCP / INP / CLS | No CrUX or first-party field dataset queried by this specialist | Unestablished here |
| Per-route JavaScript and CSS wire cost | No fresh production network profile by this specialist | Unestablished here |
| Common Inter font files | Fresh byte, character-map, glyph-outline and metric comparison below | Payload reduction verified locally; user-visible timing benefit unmeasured |
| Approved hero film files | Fresh bytes and SHA-256 matched existing manifest | File identity verified; playback/network behavior needs browser evidence |

The companion `PERFORMANCE-FINDINGS.json` uses null for absent measurements. It must not be interpreted as zero latency, zero layout shift or a passing score. Exact executed checks and their evidence are consolidated in `FINAL-VERIFICATION.md`.

## Server rendering, data access and caching

**KEEP — current publication freshness.** `src/lib/published-source.ts:23` combines React render-local deduplication with a bounded verified snapshot. The existing snapshot is reused only after a successful current database identity check; a changed database connection creates a different reader. `src/lib/verified-snapshot.ts:6` clones the bounded value and fails closed when the identity read fails. `src/lib/publication-read-query.ts:9` builds value and identity in a single PostgreSQL statement. This protects withdrawal and publication correctness; replacing it with a time-based stale cache solely to improve a benchmark would alter the owner-approved contract.

**INVESTIGATE, not a reproduced defect — first-byte cost.** Root layout awaits the connection, locale and shared copy before returning the document (`src/app/layout.tsx:67`). `publishedShellSource` deduplicates the shell read within a render (`src/lib/published-shell-source.ts:5`); the locale/copy calls therefore should not be assumed to make duplicate independent queries. The publication digest still performs real database work and can contribute to TTFB. A current server/network trace is required to attribute variable first-byte time to region, connection setup, a particular query, image transformation, or browser scheduling. Do not claim a database bottleneck from the code alone.

**KEEP — explicit failure behavior.** The public design source catches the narrowly identified pre-activation missing-table condition; other storage failures are not silently converted into a valid published response (`src/lib/published-design-source.ts:7`). Private Studio responses use `Cache-Control: private, no-store` (`next.config.ts:32`). Performance changes must preserve that private/public boundary.

**KEEP — route-specific client work.** Studio modules are dynamically imported by the workspace and expensive module views are separated from navigation updates (`src/components/studio/workspace.tsx`). `CinematicCanvas` accepts server-rendered children; its client boundary alone does not prove those children became client-rendered or entered its JavaScript bundle. A built dependency/network inspection is required before recommending a boundary rewrite.

## Fonts: exact current local versus released files

The active root font configuration is in `src/app/layout.tsx:11`, not the older inventory in `src/styles/fonts/manifest.json`. It references Instrument Serif normal/italic, JetBrains Mono regular, three common Inter weights and three full Inter fallback weights. All use local font files, `display: swap` and `preload: false`; the complete Inter face supplies the Arial metric fallback while the smaller common face avoids defining a second metric fallback. No Google Fonts network preconnect is justified for these locally hosted files.

Fresh verification used the already-present local FontTools/Brotli tooling in the ignored test-results directory; no package was installed and no font was rewritten. Every full Inter file was compared with the bytes stored at the baseline Git SHA. For each weight, all 399 codepoints present in the common subset map to the corresponding full-font glyphs; all 886 retained glyph outlines and horizontal metrics match. Units per em, ascender, descender, line gap, x-height and cap-height were also equal.

| Inter weight | Unchanged full fallback bytes | Released common bytes | Current local common bytes | Retained characters / glyphs | Result |
|---|---:|---:|---:|---:|---|
| 400 | 108,208 | 61,016 | 35,784 | 399 / 886 | Verified equivalent retained glyphs and metrics |
| 500 | 111,876 | 62,836 | 36,716 | 399 / 886 | Verified equivalent retained glyphs and metrics |
| 600 | 111,964 | 63,236 | 36,752 | 399 / 886 | Verified equivalent retained glyphs and metrics |
| Common total | — | 187,088 | 109,252 | — | 77,836 bytes less, approximately 41.6% |

This comparison establishes the size and retained-glyph correctness of existing local changes, not a network transfer sum for every page and not a new measured LCP result. The full files retain 2,849 codepoints and remain available for fallback. Common and full Unicode coverage intentionally overlaps so complete combining clusters can use the full face. Hindi and Gujarati do not gain new glyph coverage from these Inter subsets; their existing system/native-script fallback remains. Visible shaping, translated layout and platform-specific fallback still require browser/native-language review.

Exact hashes and per-weight verification results are recorded in `PERFORMANCE-FINDINGS.json`. The untouched full originals are a useful regression reference. Do not remove them merely because an English homepage happens to load only common characters.

## Images, video and motion scheduling

**KEEP — approved media and responsive delivery.** Next image configuration allows only the expected local media roots, provides device widths from 360 to 1,920 pixels, accepts qualities 60/75 and supports AVIF/WebP (`next.config.ts:7`). `PublicImage` uses the existing fallback path and responsive `sizes` contracts; `src/components/shop/image-sizes.ts` distinguishes card, product detail, story, zoom and full-bleed placements. There is no evidence here that a broad recompression or media replacement is needed. Full-bleed cropping must continue to preserve the stored focal position and provenance.

| Existing film asset | Fresh raw file bytes | SHA-256 / manifest |
|---|---:|---|
| `hero-pour-loop-poster.jpg` | 98,481 | Matches existing manifest |
| `hero-pour-loop.webm` | 1,649,274 | Matches existing manifest |
| `hero-pour-loop.mp4` | 2,135,160 | Matches existing manifest |

These are file sizes, not actual compressed wire measurements. A browser chooses a supported video source; the WebM and MP4 sizes must not be added together and reported as a guaranteed initial download. This check verifies the local approved files, not a fresh Google Drive provenance or rights review.

**KEEP — poster-first and offscreen lifecycle.** `src/components/shop/cinematic-video.tsx:33` gates automatic playback on visibility and device preferences. The hero waits for fonts/poster decode and an opening delay; explicit play remains available. The normal video uses `preload="none"`, muted, looping inline playback and source mounting after the gate (`:104`). Reduced motion, save-data and slow-2G/2G block automatic playback. The observer, listeners and timers are removed on unmount (`:77`). The expanded film mounts in its dialog with native controls, a poster and descriptive text (`:115`). Actual autoplay-denial, decode failure, manual playback and offscreen network behavior belong to browser verification rather than a source-only pass.

**KEEP — efficient pointer and scroll effect controls.** `src/components/design-foundation/cinematic-canvas.tsx:33` drives pointer interpolation through refs and one requestAnimationFrame loop, settles once close to the target and cancels work on cleanup. It reduces effects for coarse pointers, reduced motion, constrained connection and modest device signals; visibility changes and intersection state govern activity (`:27`, `:47`, `:76`). Public scroll runtime is dynamically imported after the opening phase. `src/components/shop/homepage-motion.tsx:14` similarly checks motion/connection/device conditions, defers its runtime and cleans it up (`:31`). These safeguards are present; they are not proof that every device achieves a particular frame rate or that no memory leak can exist.

**INVESTIGATE — first opening of media-heavy Studio views.** The reported slower first open is consistent with several possible costs: chunk loading, authenticated data fetching, responsive image requests and image decoding. Capture a single opening trace and request waterfall before changing pagination, image sources or module code. Subsequent warm opening alone cannot validate the cold path.

## JavaScript, CSS and cleanup

No new animation package is justified by this audit. Existing GSAP loading is conditional and operational Studio pages retain restrained effects. The experimental CSS graph chunking option is already configured (`next.config.ts:6`); its effect needs a built route profile, not an assumed savings percentage.

Large shared/global style sources deserve coverage analysis, but a rule without an obvious text-search match may still serve a conditional CMS layout, saved preview, error state or dynamically assembled class. Removing legacy-looking CSS before those consumers are mapped is not a safely evidenced optimization. The candidate is recorded as `PERF-CSS-01`, an unmeasured hypothesis, rather than a bug.

Source lifecycle review found explicit cancellation of timers, requestAnimationFrame, match-media listeners, connection listeners, observers and motion cleanup. A heap/listener recording over repeated route/modal transitions remains separate evidence. Total disk bytes under `.next` or `node_modules` are not a useful first-load bundle metric.

## SEO, localization and structured data

| Area | Source evidence | Assessment |
|---|---|---|
| Final canonical host | `src/lib/site-metadata.ts:9`, `:38` | Canonical and share URLs use the approved `www` origin and omit task/query variations |
| Indexing gate | `src/lib/site-metadata.ts:11` | Requires explicit indexing flag, production environment and public-site availability |
| Private/task indexing exclusions | `src/lib/public-indexing.ts:3`; `next.config.ts:45` | Studio, API, previews, receipts and customization task routes remain excluded |
| Robots | `src/app/robots.ts:5` | Allows eligible production public pages; otherwise blocks indexing; this is not an authentication mechanism |
| Sitemap | `src/app/sitemap.ts:7` | Dynamic, current published products/content, deduplicated public paths, conditional portfolio/testimonial inclusion |
| Social image source | `src/lib/public-indexing.ts:10` | Reads approved current published media and withdrawal-aware snapshots |
| Article/product schema | `src/components/shop/structured-data.tsx` | Escapes markup boundaries; no fabricated prices, ratings or availability |
| Locale URL behavior | `src/lib/legacy-locale.ts`; `src/lib/legacy-locale-handler.ts` | Legacy locale prefixes hand off to canonical routes and cookies; they are not independent indexable translated URLs |
| Hreflang | Existing canonical/cookie architecture | No invented locale-URL alternates; a future indexable-language URL scheme is a separate product/SEO decision |

### SEO-LANGUAGE-01 — P2, source defect; rendered reproduction requested

`EditorialStructuredData` currently emits `inLanguage: 'en'` for every Article/WebPage (`src/components/shop/structured-data.tsx:15`). The common editorial page loads `publishedContent(locale)` and passes the localized document into that schema component (`src/components/shop/editorial.tsx:58`, `:97`). The public loader can supply reviewed Hindi/Gujarati text while that schema still asserts English. The audit lead has been asked to sample a real reviewed article in all three languages; this report does not invent a production reproduction or claim a fix was applied.

The safe narrow correction is to pass an explicit **effective content language**, preserving English for missing, incomplete, unreviewed or stale translations. `publicDiscovery(original).languages` already calculates eligibility from the original source before localization (`src/lib/editorial-metadata.ts:26`; `src/lib/published-content.ts:35`). For a public page, a requested Hindi/Gujarati locale is effective only when that original eligibility contains it; otherwise use English. A saved preview should calculate the same eligibility from its original saved document before `localizeContent`, or pass an explicit effective-language value at that boundary.

Do not recompute `translationStatus` on an already translated document: its source text differs and the review fingerprint can appear stale. Do not equate the shell's selected `<html lang>` with the content language of an English fallback document. If a rendering path cannot reliably supply effective language, omitting the optional schema language is preferable to asserting a known-wrong value. Regression coverage should include English, reviewed Hindi, reviewed Gujarati and every fallback review state. No route, translation, canonical URL or publication status needs to change for this correction.

## Skills and their limits

Applied project skills: `.agents/skills/web-perf/SKILL.md`, `.agents/skills/core-web-vitals-booster/SKILL.md`, `.agents/skills/nextjs-app-router-perf/SKILL.md`, and the supplied kit's `rivya-release-verification/SKILL.md`. Source recon also used the project architecture and CSS scalability skills. No skill script was executed blindly, no duplicate package was installed and no recommendation overrode the owner scope.

The booster skill's stronger aspirational thresholds do not replace the user-requested 2.5s / 200ms / 0.1 targets. Its generic external font hints do not apply to these local fonts. Generic stale-cache or optimistic-save advice must not weaken current publication withdrawal checks, confirmed inquiry persistence or staff mutation acknowledgements. App Router guidance is applied to the actual server/client graph rather than assuming that a client shell turns passed server children into client code.

## Remaining measurement protocol and release gate

1. Complete build/tests separately, then measure an otherwise idle production browser session. Record deployed SHA, time, browser version, viewport, DPR, hardware, CPU/network throttle, cache/service-worker state, locale and consent state.
2. Use at least three fresh browser contexts for a repeatable cold-browser comparison and record every sample plus median/range. A cold browser does not establish a cold CDN or cold database; disclose those separately. Keep warm repeats separate.
3. Measure public home, representative product and article pages, plus the first authenticated Studio media opening. Attribute LCP to its actual element and phases; record TTFB, image/font request timing, initial JavaScript/CSS transfer and layout shifts.
4. Record real interactions such as menu open, search/filter, media dialog and Studio navigation. Report observed interaction latency as lab evidence; do not label a load-only TBT score as field INP. Do not submit production forms or alter Studio data to manufacture a test.
5. Check available CrUX/approved field telemetry separately. Missing field data is a gate, not a zero or a pass. Do not add a tracking service or new telemetry collection without the appropriate owner decision.
6. Preserve raw screenshots, traces and timing output in ignored `test-results/rivya-master-audit/`. Sanitized conditions/results may be added to this report and `FINAL-VERIFICATION.md` by the audit lead.

No production performance acceptance or complete SEO-runtime sign-off is established by source inspection alone. The fresh local font equivalence and media identity checks are verified; candidate performance causes remain hypotheses until measured. The narrow language-schema correction requires a reproduced localized output and focused verification. Release remains subject to the user's fresh authorization and the audit-wide outstanding gates.


## Integrated fresh measurements — final audit

These results supplement the dated source review above. Production measurements are from 2026-10-17; final local measurements are from 2026-10-19. Main/READY alias was rechecked unchanged on 19 October. Production Chrome 155.0.8059.40 and final local Chrome 155.0.8059.84, DPR 1; desktop 1440 × 1000 unthrottled, mobile 390 × 844 touch/CPU 4×/150 ms latency/1.6 Mbps down/0.75 Mbps up. Per route/profile: three fresh browser contexts and one same-context repeat. Browser cache is controlled; production CDN/server/database warmth is not. Profiles ran separately from builds/other automated browser suites. Local QA content and loopback transport differ from production; this is not a causal deployed A/B experiment.

### Released production — 17 October

| Profile | Route | Cold LCP samples ms | Median ms | Repeat LCP ms | Cold TTFB samples ms | Max cold CLS | Search task max ms |
|---|---|---|---:|---:|---|---:|---:|
| desktop | / | 1712, 1836, 1324 | 1712 | 1220 | 83, 161, 82 | 0.00006 | 160 |
| desktop | /collectible-design | 1484, 1120, 1008 | 1120 | 788 | 289, 56, 78 | 0.00007 | 152 |
| desktop | /journal | 1060, 1184, 1064 | 1064 | 776 | 91, 54, 57 | 0.00000 | 88 |
| desktop | /pieces/river-channel | 936, 956, 956 | 956 | 716 | 50, 66, 47 | 0.00027 | 152 |
| mobile | / | 5116, 4804, 4404 | 4804 | 1260 | 183, 68, 188 | 0.00000 | 424 |
| mobile | /collectible-design | 6684, 2788, 2716 | 2788 | 1116 | 3757, 48, 58 | 0.00000 | 224 |
| mobile | /journal | 3564, 3604, 4140 | 3604 | 1484 | 240, 91, 48 | 0.00000 | 152 |
| mobile | /pieces/river-channel | 3020, 2620, 2620 | 2620 | 844 | 303, 224, 47 | 0.00015 | 208 |

### Final patched local candidate — 19 October

| Profile | Route | Cold LCP samples ms | Median ms | Repeat LCP ms | Cold TTFB samples ms | Max cold CLS | Search task max ms |
|---|---|---|---:|---:|---|---:|---:|
| desktop | / | 636, 480, 472 | 480 | 228 | 224, 171, 172 | 0.00006 | 88 |
| desktop | /collectible-design | 336, 440, 368 | 368 | 208 | 113, 211, 147 | 0.00007 | 48 |
| desktop | /journal | 284, 272, 1156 | 284 | 112 | 100, 101, 947 | 0.00000 | 48 |
| desktop | /pieces/river-channel | 308, 416, 308 | 308 | 176 | 95, 149, 107 | 0.00027 | 56 |
| mobile | / | 1952, 1840, 1952 | 1952 | 324 | 202, 224, 174 | 0.00047 | 136 |
| mobile | /collectible-design | 1480, 1492, 1540 | 1492 | 368 | 178, 103, 113 | 0.00000 | 136 |
| mobile | /journal | 1832, 1688, 1704 | 1704 | 640 | 81, 75, 70 | 0.00000 | 120 |
| mobile | /pieces/river-channel | 1344, 1364, 1372 | 1364 | 312 | 90, 92, 101 | 0.00015 | 120 |

All measurements are lab values. Search means open dialog/type resin/Escape, performed in the first cold sample per route/profile; maximum Event Timing observation has a 16 ms recording floor and is not p75 field INP. Production mobile target is VERIFIED_OPEN regardless of improved local values. The large single collection request wait warrants investigation rather than an unsupported cache or database claim. No Lighthouse score was manufactured: direct browser Navigation/LCP/LayoutShift/EventTiming/resource measurements were used.

Initial JavaScript transfer/decoded bytes and largest media/font requests are recorded per sample in production-performance.json and candidate-performance.json. Cross-origin ResourceTiming transfer sizes can be zero without Timing-Allow-Origin, so sums are observed browser values, not complete billing or wire totals. Existing film files are reused; font/video-startup changes belong to the preserved pre-audit acceptance checkpoint.

Existing Vercel field queries(p75 LCP/INP/CLS,16 Oct 00:00–17 Oct 06:00 UTC) returned empty data/summary arrays. Field acceptance is BLOCKED, not zero. Public sitemap 656 routes/media 246 availability checks passed. Cookie-based hi/gu preferences/locale handoffs retain canonical architecture; no invented hreflang URLs. SEO-LANGUAGE-01 is reproduced on production and fixed locally with 14 focused unit/render tests; actual translated production output awaits an authorized release.
