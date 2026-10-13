# M10 completion pass — 12 October 2026

The owner requested completion of all five outstanding acceptance areas. Work continues on `codex/m10-completion-evidence`, from main `a0cdf638ebdc3ca24ea39fb75d94c48f341e5b6b`. This report distinguishes tested engineering from evidence that automation cannot supply. The standing detailed-PR/main/release instruction remains applicable. Do not replay the 480 publications or homepage revision 4.

## Application changes

- Reduce the three common Inter derivatives from 156,860 to 109,952 bytes, retaining every original supported character, outline and metric. Defer their eager preload so critical styles and imagery can start first. Originals and font licences remain untouched.
- Add 420px and 512px responsive image sizes, preserving all image sources, crops and quality settings.
- Load the existing 98,481-byte film poster when its section approaches the viewport or Play is chosen. Preserve the same described silent film, native controls, fixed frame, deliberate playback and offscreen pause.
- Reveal closed Materials & Care accordion bodies in print. The previous print view contained only headings; browser evidence shows all six body sections now occupy real print space while the screen disclosures stay closed.
- Give the light saved inquiry card a dark keyboard focus ring. Measured contrast rises from 2.612641:1 to 14.847523:1.
- Give printed image captions a solid white backing and black text, preserving their positioning. The final rebuilt print capture shows the design-visualization disclosure clearly above the image.
- Clarify the Studio production register: original intake notes are historical, current editor links come from saved records, and isolated local counts do not claim live production totals. No stored intake manifests or record status are rewritten.

## Language and evidence work

The remaining 34 legacy articles received a complete assistant meaning pass: 462 English fields, 924 Hindi/Gujarati target values and 200 corrected values across 33 articles. Together with previous DB001/DB010 work, all 36 articles now have assistant review evidence. The 68 supplemental import candidates are unreviewed local drafts; neither Studio nor production translations were overwritten or published. English source hashes and protected facts remain unchanged. See [the language review](M10-LANGUAGE-RIGHTS-REVIEW.md), [the supplemental packet](../../editorial-translations/m10-followup/README.md) and [the technical review](M10-TECHNICAL-REVIEW.md).

The [rights register](M10-RIGHTS-EVIDENCE-REGISTER.md) gives exact source/Drive/hash evidence for all 21 M9 images and the film family. Owner publication permission and concept/fictional classification are already documented. Missing source-specific licensing/third-party permission and factual substantiation remain distinct; historical generic approval-pending fields do not revoke the owner's instruction.

## Performance evidence before hosted release

Fresh production cold-load diagnosis used 390×844, DPR 1, CPU 4×, 150ms latency, 200,000 B/s download and 93,750 B/s upload with browser cache disabled. Home LCP was 3.852s; collection was 2.316s. Keep the previous failing samples too. The home hero was only 9,374 bytes; five preloaded fonts competed with critical styles. Final document headers arrived at 1.169s although an interim 103 response arrived at 43ms. `responseStart` alone therefore understates the server wait.

The first rebuilt local candidate recorded home cold LCP 1.132/1.156/1.360s and collection 1.296/1.172/1.236s. Home cumulative layout shift was 0.000190; collection 0. No complete Inter face or offscreen poster was requested. Local content and server latency differ from production: these are diagnostic samples, not a production or field p75 pass. Hosted verification must be appended after the exact source is released.

The official public PageSpeed endpoint returned HTTP 429 `RESOURCE_EXHAUSTED`; it supplied no field measurements. A subsequent actual CrUX Vis screen explicitly reports no data for the canonical origin in the Phone view. Neither observation establishes a field-performance pass; Desktop/All-device availability was not inferred. No tracking or paid service was enabled. See [the field evidence](M10-FIELD-EVIDENCE.md).

## Visual evidence and limitations

The [full execution register](M10-FULL-VISUAL-COVERAGE.md) maps all 85 old routes, 74 section definitions and 16 landing block types into 36 execution groups. Thirteen scraper/ingestion routes remain excluded. Empty old collections get explicit reference-limited dispositions; they cannot supply populated detail comparisons.

Some simultaneous browser captures had repeated strips or transient narrow-column painting despite plausible viewport metadata. Those images are rejected. Serialize browser capture work, inspect actual pixels and record the actual width; neither successful capture nor DOM geometry alone establishes visual acceptance. The separate scoped visual reports and machine-readable register record the accepted coverage.

Actual 200%/400% browser zoom, real screen-reader tasks and physical-phone checks remain evidence gates. The available root browser exposes viewport emulation but no native application/device control. Do not relabel viewport emulation, accessibility snapshots or assistant narration as those checks.

Independent fluent Hindi/Gujarati review, media provenance/factual evidence, real field measurements and an actual consent-safe customer inquiry also require evidence beyond synthetic QA. Do not create a fictional customer to close real-world acceptance.

## Verification and continuation

The initial candidate build/type check, 344 unit tests, 403 built-server tests and 12 preflight tests pass. Lint has zero errors and 62 existing warnings. The sandbox blocked disposable Git fixture creation during the first preflight attempt; the authorized rerun passes all 12. The subsequent print-caption and Studio wording candidate builds successfully; its four focused M8 tests and focused lint pass. The final rebuilt print caption is visibly verified.

Fresh read-only production and local preservation baselines exist under ignored `test-results/old-design-migration/`; compare original IDs and row digests after testing/release. No schemas, existing content, crops, records, orders or review approvals were changed. Raw captures, traces, private identifiers and configuration stay ignored.

Continue current visual execution, verify the final print-caption build, complete font/film/browser checks, release through a detailed PR and record exact deployment plus hosted samples. The final receipt must preserve any remaining concrete acceptance gaps instead of claiming all M10/M11 acceptance is complete.

## Final local candidate — 13 October

Application commit `e6ea81243747197c62c668245f33020128767ec8` includes the final print skip-link fix, responsive nested crop controls and visibly verified related-product label spacing. Final build/type and403 runtime tests pass. The complete16 default landing editors have inspected1440/390/320 captures with460px overlap and visible tails. A320px Mobile-preview-selected gallery also visibly confirms the alternate crop controls; no crop was changed or saved. Supplementary public pixel review accepts42 route/width sets and382 overlapping screenshots; see [the scoped review](M10-SUPPLEMENTAL-PUBLIC-REVIEW.md).

All original local and production rows retain their exact digests across13 protected scopes. The only local additions are one unpublished synthetic conflict-test article and two revisions; no production writes. [Preservation receipt](m10-completion-preservation.json). The hosted release and cold-load verification remain the next step; this local result does not close the explicitly listed human, field or unobserved visual gates.

## 13 October final print follow-up

Root rendered and inspected all 21 pages of home-print-clean.pdf and all three pages of care-print-clean.pdf. Home content remains readable with its continuous screen-style pagination; image and section breaks are not claimed to be a redesigned print layout. The final care-page action revealed a pale label with backgrounds disabled, caused by the shared important button colour overriding the print wildcard. A scoped printable-prose link rule now renders it black on white (21:1). The actual regenerated care-print-final-contrast.pdf page 3 was inspected and its two links are readable. The earlier care PDF remains baseline evidence.

Final application commit a2a760c93a7fa02aa36a5ef9f673a185f3dd142c; committed-source fingerprint c135d928c7e153fc0781add6aebdb0e3beaef614c01f56ca138a095459e491b4; Windows-byte fingerprint 16b03f2615313af03992d2a01a54559b986a69c9a0dcec8fc233795bc5749f12. All 539 differences among 580 files are CRLF-only. Fresh build/type verification passes (build-print-final.log), followed by 403 runtime checks, zero failures, in 12.033s (runtime-print-final.log). The unchanged unit logic retains its prior 344 passing tests. Hosted performance and the explicit external acceptance gates still require their own evidence.

## Final review corrections — 13 October

PR52 review found a canonical-JSON versus saved-byte hash mismatch in the translation import manifest and a combining-cluster font coverage gap. Both are fixed. All 68 import files match exact on-disk and committed Git blob SHA-256; a scoped .gitattributes preserves LF bytes on checkout. No translation value changed.

Latin bases and combining marks now stay in the common font, and the complete fallback advertises its entire original cmap. All 33 browser canvas comparisons (11 strings across three weights) match the original full font in width, ascent, descent and every pixel, including decomposed extended Latin, Greek/Cyrillic accents, Hindi and Gujarati. FontTools verifies every retained outline/metric, with 1,239 codepoints and 1,451 retained glyphs. Common files total 187,088 bytes: the earlier 109,952-byte candidate and its local performance samples are superseded. Correct shaping takes priority over that discarded smaller candidate. Final source f984d3b822cc5b0073f82497289cd5d3ecfed628; committed application fingerprint bf96187827c7acc6c18ab9757639141fef4e2c80cc8992fe75c05671a07f6965, Windows fingerprint 7f58839e929af8fd981185e5fdb095b29408a8d293b30eb6ead988b8beb43b90. All 539 differing files are CRLF-only. Fresh build/type and 403 runtime checks pass (11.655s). Raw receipts: build-cluster-final.log, runtime-cluster-final.log and font-cluster-final.json. Hosted final-source cold measurements remain the release continuation.


## Released follow-up — 13 October

Read [M10-FINAL-RELEASE.md](M10-FINAL-RELEASE.md) and [the final receipt](m10-final-release-evidence.json) for PR52/53 production verification, corrected final font sizes, complete hosted sample series, all13 protected-scope digest comparisons and sixteen additional interaction-state captures. This supersedes older pending-release instructions while retaining their historical scope. Full visual/native/device/independent-language/rights/field acceptance remains partial.
