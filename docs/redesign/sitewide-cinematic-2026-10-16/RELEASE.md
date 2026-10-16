# Website-wide cinematic redesign release

16 October 2026. The owner explicitly requested **"push all things into main branch"** after the local cinematic implementation. This authorizes release of both the homepage cinematic work and its website-wide extension. It supersedes the local-only hold recorded in the earlier implementation reports; those reports remain historical local verification evidence.

## Target and method

- Repository: `rivyalivingart2/RivyaLivingArt2.0`.
- Source branch: `codex/cinematic-sections`.
- Target branch: `main`; freshly fetched base `ffd863928744df0ae2cf985f6504421842a074db` with no divergence.
- Vercel project: `rivya-living-art2-0` (`prj_J90SIW3OHaXYsmhan527F4n8PYUc`), team `team_mnsVrzWm8seMFfIZE9Oxu691`, Next.js on Node 22.
- Production: `https://www.rivyalivingart.com/` and `/studio`.
- Detailed pull request, hosting checks on the exact proposed commit, expected-head merge, then production commit/domain and fresh live public/Studio verification. Do not bypass branch protection or independently change hosting configuration.

## Included

Both cinematic redesign stages: safe viewport storytelling, seamless dark gradients, cursor/ambient lighting, Hero and Resin in Motion video parallax, reusable image/video wrappers, public template improvements, restrained Studio and access styling, pause/reduced-motion/touch/low-power fallbacks, source research, section/route inventories, preservation receipts and local review generators.

All 45 changed source files match the tested fingerprints in `verification.json` immediately before this release. Build/types and focused lint passed; repository lint has zero errors and 62 existing warnings. Recorded results include 350 unit, 403 runtime and 12 preflight checks; 562 browser layout observations; 12 interaction checks; and nine automated accessibility views with zero reported violations and explicitly incomplete contextual checks. The release does not reinterpret local samples as production or field evidence.

## Preservation and boundaries

No packages, media bytes, database schema, API handlers, route adapters, business data or SEO metadata are changed. All 1,658 protected local rows across 13 scopes were unchanged, and 17 sampled public paths preserve normalized text, ordered links and SEO. Production data is not imported, seeded, reset or republished during this release. Existing selected media, crops, drafts, translations, orders and truthful concept/fictional disclosures remain authoritative.

Raw screenshots, generated review HTML, private QA state and local logs remain in ignored local directories. Source review generators and sanitized reports are included. Root synced `sources/` remains untouched.

The historical Studio access-request production-table activation is separate. Full contextual contrast certification, native screen-reader/physical-device observations, independent language/media-rights decisions and production field performance are not supplied by this release. Fresh live checks are representative; they do not certify every dynamic record or permission combination.

The merged PR and exact production deployment are the release receipt. Record their actual results after verification; do not claim production completion based only on a local build or a Preview deployment.

## Verified production result

- [Detailed implementation PR #62](https://github.com/rivyalivingart2/RivyaLivingArt2.0/pull/62) merged normally into `main` as `224b2ca0e192b8d8ceced3045d6f8a193b734362`.
- Proposed head `bb75495b53da97be2f28f9841edd91b59292d931` passed the Vercel build/status and Preview Comments check before an expected-head merge. No branch protection was bypassed.
- Production deployment `dpl_DuMXE1zs914eaG6FLCVazZJYQSvb` reached **READY**, with GitHub branch `main`, exact merge SHA above, and both `www.rivyalivingart.com` and `rivyalivingart.com` assigned.
- The local `main` branch was fast-forwarded to that merge; application source matches the tested branch exactly.

[live-verification.json](./live-verification.json) records fresh read-only production checks after deployment:

| Live verification | Observed result |
|---|---|
| Public desktop | 15 actual routes at 1440px: homepage, story, collection, product, Journal archive/article, portfolio concept, fictional testimonial, FAQ, contact, commission, policy, materials, process and customization |
| Public mobile | Seven representative routes at 390px |
| Authenticated Studio | All 37 workspace destinations at 1440px; five representative workspaces at 390px |
| Combined layouts | 64 unique route/width observations; no detected horizontal page overflow, clipped visible heading or broken visible image |
| Studio data loading | All 37 workspace states settled with no visible error alert; the real administrator renewed their own login |
| Hero and Resin in Motion | Actual playback at readyState 4, two mounted sources per visible film, changing parallax transform, offscreen pause and initially deferred below-fold sources |
| Film controls | Manual pause, expanded player opening and close control worked |
| Cursor lighting | Measured eased light movement between pointer positions |
| Mobile navigation | Open/close, Escape and focus return worked |
| Motion preferences | Reduced-motion mode left both films static with no sources mounted; explicit effects pause persisted onto another route |
| Browser console | No captured error-level messages in the scoped public/Studio release verification |

The media and site-image mapping workspaces took longer on initial opening. Both were revisited after their loading indicators cleared and showed no error alert. This is successful completion evidence, not a latency or field-performance guarantee. Opening a workspace and reading its current state does not certify every editor action, record, permission combination or production write workflow. No test inquiry, order, account, reset link, publication or contact change was submitted.

Representative live screenshots are retained locally under ignored `test-results/sitewide-cinematic/release/`: `production-home-desktop.jpg`, `production-home-mobile.jpg`, `production-resin-desktop.jpg`, `production-story-desktop.jpg`, `production-product-desktop.jpg`, `production-product-mobile.jpg`, `production-studio-desktop.jpg`, `production-studio-products-desktop.jpg` and `production-studio-mobile.jpg`. Studio captures were refreshed after data loaded. Browser viewport/touch/reduced-motion overrides were cleared and the effects preference restored.

All intended implementation, reports, audits and review generators are included in PR #62. This follow-up records the actual release and live evidence; it changes documentation only. The original `FINAL-REPORT.md` and `verification.json` remain the historical local implementation evidence, while this release receipt supersedes their local-only status. The preservation and independent acceptance boundaries above still apply.
