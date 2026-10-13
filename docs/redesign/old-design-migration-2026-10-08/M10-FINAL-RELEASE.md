# M10 verified fixes released — 13 October 2026

The application fixes are released through [PR52](https://github.com/rivyalivingart2/RivyaLivingArt2.0/pull/52) and [PR53](https://github.com/rivyalivingart2/RivyaLivingArt2.0/pull/53). M10 acceptance remains partial. This receipt supersedes the pending-release instructions in older checkpoint sections without deleting their historical evidence. It does not certify missing human, device, rights or field results.

Main `839af6d3114e81c30fdd4fdacb1cf9468d0e253c` is verified on READY production `dpl_4T1oD95yrLdzEz6S6xosmL3ZWYQF`, aliased to [the live website](https://www.rivyalivingart.com). Final application source is `e71cfc8e952704b505a7f843e554177d1b60b6ae`. The portable committed application fingerprint is `2128ad65374b3c4887e966f05a4277b0e3a6b5b985d752a2106b950a1f0be56c`; Windows bytes are `00adfe44c4524ce49e56497c0e5a3e37ec25b774d1fea425fe35b3931d0856f7`. Of 580 files, all 539 byte differences are CRLF-only. The accompanying documentation does not change application source.

## What changed and was verified

- Font and media loading: remove competing common/display-font preloads; add 420/512px responsive image choices; defer the 98,481-byte film poster until near its section or explicit Play. Preserve original sources, crops and the deliberate silent film. The final common Inter files total **187,088 bytes**, superseding the discarded smaller candidate. All 33 original-versus-derivative browser comparisons match every pixel and width/ascent/descent, including combining accents, Greek, Cyrillic, Hindi and Gujarati. Full original character coverage remains available.
- Print and contrast: closed care answers print; captions have a readable backing; the film has a real print still; the fixed skip link no longer covers printed text. All 21 Home and three Care PDF pages were inspected. A final Care action-label repair is black on white, 21:1. Saved inquiry-card focus contrast is 14.847523:1.
- Studio: nested crop controls wrap whole words at narrow widths. All 16 default landing editors have inspected 1440/390/320 captures. Historical intake versus current saved content is stated clearly. Product-related label spacing is repaired.
- Translation packet integrity: 68 supplemental draft files have matching exact saved-byte and committed Git-blob hashes, with LF checkout protection. This changed hashes/serialization metadata only; no protected translation was imported, approved or published.
- Validation: final build/type checks and **403 runtime tests pass** (12.273s). The preceding **344 unit** and **12 preflight** passes cover unchanged logic. Full lint has zero errors and 62 existing warnings. PR52's two review findings were corrected; PR53's code/security reviews reported no findings.

## Production and protected records

All **36 final read-only production checks pass**: 19 public/login pages, six selected concept/fictional detail pages with disclosures, two unauthorized API checks, two Studio redirects, workshop 410, missing-page 404, robots, sitemap and three byte/hash-verified media files. This is an expanded final suite: the earlier generic helper had 22 checks, while the older PR50 receipt had a different 26-check scope. Do not report those counts as interchangeable.

Actual homepage Play and Pause were observed on the final deployment. The video was ready, muted, had native controls and duration 8.042 seconds. Its visible description states that it is a material visualization, not a customer commission. The final desktop screenshot is saved locally at `test-results/old-design-migration/m10-completion/production-film-desktop-final.png`; raw captures remain ignored. Images and labelled Portfolio/Testimonials selections remain visible.

Fresh production original-ID/row-digest comparisons pass in **all 13 protected scopes**, including 120 catalogue records, 535 content records, 154 public media records, 1,389 revisions and the existing two inquiries/two orders. Local original rows also match in all 13 scopes. The only QA additions are the previously documented one unpublished conflict-test article and its two revisions. No production database writes, inquiry submission, translation publication or replay of the 480 M9 entries/homepage revision 4 occurred. Read the [sanitized receipt](m10-final-release-evidence.json); private ID maps and credentials remain ignored.

## Final hosted cold-load results

Protocol: 390×844, DPR1, CPU4×, latency150ms, 200,000 B/s down and 93,750 B/s up, browser cache disabled. Wait for load and fonts, then collect buffered LCP/layout-shift entries. These are serial lab samples, not field p75. The third collection navigation finished during a tool timeout; its buffered entry was subsequently saved without reloading.

| Route | Every final LCP sample | Median | CLS |
| --- | --- | --- | --- |
| Home | 4.544, 3.064, 2.308, 2.688, 2.240, 2.216 seconds | 2.498 seconds | 0 in all six |
| Collection | 1.988, 2.016, 1.964 seconds | 1.988 seconds | 0 in all three |

Three of six home samples exceed 2.5 seconds. The target is therefore **not fully passed**, despite the improved median. Home final response headers vary from about 754 to 2,263ms. Removing two Instrument display-font preloads reduces competition with critical styles; it does not eliminate hosted server variability. Do not hide slow samples or introduce a stale publication cache merely to obtain a passing number. Earlier local samples from the discarded smaller font are not final-source results.

The actual CrUX origin Phone screen reported no data; the public PageSpeed request returned quota HTTP429. There is no field p75 measurement and no genuine consent-safe inquiry observation.

## Additional visual and interaction evidence

The prior scoped registers retain 31 Studio editorial groups/215 frames, 16 landing public defaults/66 frames, 48 landing editor panels/229 frames, and 42 supplemental public route/width sets/382 frames. These counts describe different scopes and must not be added into a blanket all-state pass.

Sixteen additional 390×720 state captures were inspected, plus the complete six-tile custom review sheet:

- Search dialog focus, no-results and Clear restoration; Escape returns focus to Search pieces.
- Narrow navigation drawer, last focusable item, backward/forward Tab wrap and Escape restoration to Open navigation.
- Product lightbox third image, Next wrap from three to one, and Escape restoration to Enlarge.
- Saved pieces empty and populated display, followed by removing the temporary browser-only selection.
- FAQ last-page navigation, filter dialog, empty result and Clear restoration, hash-open answer/body. The file named `faq-expanded-390.png` actually shows the closed state and is explicitly excluded as expanded-answer proof; use `faq-hash-open-390.png`.
- Custom inquiry required-field summary focuses the first invalid field; details and review steps render; Edit retains the entered piece choice. The full review/consent/action/footer pixels were inspected. Synthetic values were cleared through the UI without Save/submit. A timed-out leave attempt is not native-dialog evidence.

These observations close their named states only. Full coverage of the eight planned widths, every conditional selector/gallery population, all long-policy print layouts and all alternate error/loading/editor states remains unfinished. Empty old reference collections cannot supply populated old/current pixel comparisons; retain the explicit reference-limited disposition instead of fabricating old records.

## Exact remaining work

1. **Engineering visual coverage:** use the 36-group [full visual execution register](M10-FULL-VISUAL-COVERAGE.md), prioritizing V29/V17 conditional reference selectors/gallery populations, remaining widths, long-policy print and native Return-link confirmation. Reuse accepted unchanged screenshots; retain the existing unpublished conflict fixture rather than recreating it.
2. **Homepage cold loading:** investigate the variable final-header/server wait under a documented repeatable protocol; preserve current publication withdrawal/fail-closed behavior. Collection lab samples pass the stated sample target; this does not close real-user performance.
3. **Native/device/reader evidence:** actual 200%/400% browser zoom, human screen-reader tasks and physical-phone observations. The available browser surface provides emulation but no native app or physical-device control. No such result was invented.
4. **Independent language and source evidence:** actual Hindi/Gujarati reviewer decisions for the prepared 36-article/1,002-value packets and the separate seven-page scope; source-specific media permitted-use/creator records and factual substantiation listed in the [rights register](M10-RIGHTS-EVIDENCE-REGISTER.md). Assistant review and owner publication authorization do not supply independent acceptance or missing source records.
5. **Real-world evidence:** field measurements and the next genuinely originated, consent-safe inquiry. Do not impersonate a customer, submit a fictional inquiry or contact reviewers without authorization.

The [external acceptance handoff](M10-EXTERNAL-ACCEPTANCE-HANDOFF.md) provides exact packets, source groups and evidence fields. M11 release execution is verified for this source; full M10/M11 plan acceptance remains open. Scrapers, old-product transfers and backups remain excluded. No automation is scheduled.

QA application and isolated PostgreSQL stopped gracefully with data retained; ports4199/55439 have no listeners. Temporary browser CPU/network/cache/media/viewport overrides reset and completed local testing tabs closed. No automation is running.

