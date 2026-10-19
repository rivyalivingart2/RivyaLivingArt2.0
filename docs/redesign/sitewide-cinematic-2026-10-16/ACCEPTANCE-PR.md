# Improve cinematic contrast, keyboard focus and initial media loading

Bright resin-film frames and some tablet/mobile compositions could reduce text contrast, including the featured-piece note and Studio welcome text. This change strengthens the existing directional shading and supplies a consistent two-edge keyboard focus treatment while retaining Rivya's logo, palette, content, media selections and approved 30–50% white glass.

The common Inter subsets are 77,836 bytes (41.6%) smaller across three weights. All retained glyph outlines and spacing metrics are verified unchanged, and the complete original fonts remain available for other text and combining clusters. Automatic hero video waits for opening fonts and the poster; explicit Play remains immediate, with reduced-motion/data-saving and failure fallbacks preserved. No package or runtime dependency is added.

## Validation

- Build and type checks pass. Lint has zero errors and 62 existing warnings; final focused lint passes.
- 350 unit, 403 runtime and 12 preflight tests pass.
- 600 contrast samples across eight widths, including 80 decoded video frames and 168 hover/focus states; 66 behavioral checks pass.
- 1,051 conditional assertions across 321 local states pass, covering child editors, saved revisions, optional presentation controls and failure/authorization states without writes.
- All 656 published sitemap URLs pass public HTML and mobile-browser checks; 1,789 visible main-content image placements and 246 referenced media URLs checked without observed failures.
- Fresh production administrator checks cover media, image-placement crops, saved previews and existing Hindi/Gujarati translation panels. No production records changed.
- All 1,658 protected local rows in 13 scopes match their before/after fingerprints.
- Local candidate slow-mobile cold LCP: 1.272–1.808s across 12 samples. This does not establish production performance; current released slow-mobile samples remain above 2.5s.

## Evidence and release boundaries

Read `ACCEPTANCE-FOLLOWUP.md` and `acceptance-verification.json` in this directory for the exact matrix, source hashes, local image filenames, performance samples and limitations. Existing Narrator was attempted but speech was not observable; no physical device is available and field queries returned no observations. None of these gates is marked complete.

This description is prepared locally. No PR exists for this follow-up yet. After an authorized merge, verify the exact deployment commit, repeat the production mobile measurements, check live film/controls and renew Studio sign-in only if needed. Do not replay data fixtures, publications, migrations, staff operations or Drive writes.
