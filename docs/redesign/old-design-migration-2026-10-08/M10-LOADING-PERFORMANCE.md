# M10 loading performance — local follow-up, 12 October 2026

The next M10 engineering step is implemented and verified locally on `codex/m10-loading-performance`. Initial Inter font files are 175,188 bytes smaller, and observed homepage/collection renders make three database requests instead of four. The matched cache-bypassed homepage sample improved from 2.712s to 1.732s LCP. This is local evidence, not a new production result or full M10 acceptance.

Base: current main `26b1e4b18c6ca8e5d9f10804072c1d50512fcae8` after the PR49 release receipt. Application fingerprint: `66964b6ef89ac9475a5a59f2142d0ff25ec8acd6736136059cc73918b371f1cd`. The machine-readable receipt is [m10-loading-evidence.json](m10-loading-evidence.json). No new push, PR, deployment or production write occurred in this slice.

## Changes and preservation

**Smaller initial fonts, the same typeface.** Three common-character subsets of the existing Inter 400/500/600 files are preloaded. The unchanged original files supply their remaining supported characters on demand through complementary `unicode-range` declarations. The complete original character coverage remains available. The original Arial metric fallback and native Hindi/Gujarati fallback remain in place. Instrument Serif and JetBrains Mono are unchanged.

The development-only [FontTools subset workflow](https://fonttools.readthedocs.io/en/stable/subset/) preserves layout-feature closure, hints, names, glyph shapes and metrics. `split-inter-fonts.py` verifies every retained glyph's outline and horizontal advance as well as the font's vertical metrics. It checks all three original character maps, common-subset coverage and disjoint CSS ranges. All 2,849 original supported codepoints remain available; 1,065 common codepoints and 1,276 glyphs are retained in each subset. Twelve browser canvas comparisons have identical width/ascent/descent across English, Hindi, Gujarati, Greek and Cyrillic samples at three weights. These are rendering checks, not native-reader approval. The existing Inter OFL notice remains distributed unchanged.

| Inter files | Before | After initial load |
|---|---:|---:|
| Weight 400 | 108,208 B | 51,128 B |
| Weight 500 | 111,876 B | 52,772 B |
| Weight 600 | 111,964 B | 52,960 B |
| Total | **332,048 B** | **156,860 B** |

The initial Inter payload is 52.76% smaller for the measured pages. The original full fonts still load when their remaining supported characters are actually used. A fresh Gujarati collection navigation, without diagnostic font probes or accessibility injection, loaded only the common Inter files. The multilingual canvas probe intentionally loads the extended font faces, so resource lists captured after that probe or the accessibility scanner are not clean navigation-budget evidence.

**One current display-setting read.** `publishedDesignSource()` combines published homepage layout and editorial display ordering in one request-local React cache. It projects layout/revision and scope/IDs without downloading captured editorial preview bodies. Each new request reads current publication; no cross-request TTL, stale fallback, schema change or dependency upgrade was added. Only the pre-existing missing-additive-table condition is handled as an absent design. Other database failures still propagate. Source digest validation, saved exact previews, optimistic concurrency and permission checks remain intact.

Sanitized local SQL timing traces show four requests before (`shell`, `layout`, `order`, `source`/`identity`) and three afterward (`shell`, `design`, `source`/`identity`). Both versions already issue their reads concurrently. This is a request-count reduction, not evidence that a serial waterfall caused the earlier hosted delay. The configured database region and recorded Vercel region are geographically aligned; production server timing remains unmeasured for this candidate.

## Matched local measurements

The built application used the same isolated QA data and warmed server. Browser settings were 390×844, DPR 1, mobile emulation, CPU 4× slowdown, 150ms network latency, 200,000 B/s download and 93,750 B/s upload. One sample was taken per route/cache mode/candidate. The intermediate font-range probe is retained in raw evidence but excluded from this final comparison.

| Route and browser cache | Before LCP | After LCP | Before TTFB | After TTFB |
|---|---:|---:|---:|---:|
| Homepage, bypassed | 2.712s | **1.732s** | 250.1ms | 155.1ms |
| Homepage, enabled repeat | 0.528s | 0.448s | 216.4ms | 158.6ms |
| Collection, bypassed | 1.464s | 1.384s | 118.1ms | 139.6ms |
| Collection, enabled repeat | 0.468s | 0.476s | 134.1ms | 113.2ms |

Homepage bypassed CLS was approximately 0.00019 before and after; the other six samples were 0. The collection repeat was 8ms slower and its bypassed TTFB was 21.5ms slower; preserve these results rather than describing every measurement as improved. Cache-bypassed encoded resource body totals changed from 855,763 to 681,463 bytes on home and 731,226 to 554,563 bytes on collection. Encoded sizes in cache-enabled samples do not represent network transfer totals.

Single local samples do not establish statistical significance, hosted performance, real-device behavior or field p75. The earlier production LCP samples of 7.056s/11.488s home and 6.628s/4.064s collection remain the latest recorded hosted measurements, all above the 2.5s target. A future authorized release needs fresh hosted samples and investigation if that gap remains.

## Verification performed

- Final production build and TypeScript check pass, with final font ranges included. Lint exits 0 with no errors and 62 existing warnings in unchanged files. The existing unit suite has 344 passes and the built-server suite has 403 passes.
- Six real SQL contract groups pass using a temporary transaction-scoped fixture: absent design, published-only projection, draft isolation, immediate new-publication visibility, immediate withdrawal and rollback retaining the original relation. The query was checked before the final font-only refinement; its source did not change afterward.
- Six actual local Studio HTTP lifecycle groups pass on the final application fingerprint: denied anonymous/cross-origin/editor publication, exact saved previews/crops/disclosures, stale-source rejection, fresh publication visible anonymously, restore to fresh draft and withdrawal. No production session was used.
- Eight focused axe scans cover homepage and collection in English/Hindi/Gujarati at 390px, plus both English desktop pages at 1440px. No confirmed violations, missing-alt attributes or horizontal overflow were found. Homepage scans still flag 40 image/overlay contrast nodes and one silent-video caption item for manual review. The previously verified visible silent-film description remains present; this follow-up does not claim every overlay is accepted.
- Final unscaled 390×700 collection English/Gujarati and 1280×720 homepage openings were visually inspected. They retain readable type and controls. Initial wrapper screenshots were scaled, an explicit clip distorted layout during capture and an oversized surface repeated pixels; those captures are not reliable parity evidence. DOM measurements and the final unscaled screenshots are kept separately. No complete old/new visual comparison is claimed.
- Every pre-existing row in all **13 protected local scopes** has the identical before/after digest. Tests added two synthetic content fixtures, seven immutable revisions and one local QA staff fixture. Original products, content, media, business settings, inquiries, orders/events/notes, references, staff, privacy controls and erasure records are unchanged.

Raw logs, screenshots, SQL timing labels and private digest receipts remain under ignored `test-results/old-design-migration/`. Public evidence contains only sanitized counts, timings and test descriptions. No credentials, customer bodies, authenticated URLs or private IDs are committed.

## Continue from here

M10 remains partially verified. Keep the local candidate for review and an applicable release instruction; do not reimport the 480 entries or repeat homepage activation. After an authorized release, verify the exact main SHA/READY deployment and compare hosted cache-bypassed/repeat samples before claiming that production performance is resolved.

Other remaining M10 work is unchanged: complete section/child/error-state visual comparison, outstanding overlay contrast review, actual 200%/400% native browser zoom, human screen-reader and physical-phone tasks, independent Hindi/Gujarati native-reader and factual/media-rights review, consent-safe real inquiry observations and field p75. The earlier M11 PR48/49 release is complete for its documented scope; this local follow-up is not another release.

At handoff the QA server and isolated PostgreSQL are stopped, retained data remains available, temporary local browser tabs are closed and emulation overrides are reset. No scheduled continuation is running.
