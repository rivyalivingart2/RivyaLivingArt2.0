# Cinematic acceptance checks

Run from the repository root with its pinned Node 22 runtime. Browser scripts use the already installed Chrome and Playwright; no browser or screen-reader installation is required. Generated evidence stays in ignored `test-results/cinematic-acceptance/`.

1. Use the existing `tools/old-design-migration/run-local.mjs` guard to build and serve the isolated local database on port 4199. Set `RIVYA_MIGRATION_PG_MODULE` to the existing local `pg` module; never print or copy the QA environment file.
2. `public-inventory.mjs` reads the production sitemap and media headers. `published-browser.mjs` consumes that inventory and visits each public page at 390px without submitting forms.
3. Run `conditional.mjs` through the local guard. It uses the existing QA administrator and existing records, blocks browser mutations, and exercises unsaved selectors and labelled intercepted failures. Do not point it at production or replay historical fixture creation.
4. `contrast.mjs` samples composited background pixels. Optional settings: `RIVYA_CONTRAST_ORIGIN`, `RIVYA_CONTRAST_LABEL`, comma-separated `RIVYA_CONTRAST_WIDTHS`, `RIVYA_CONTRAST_PATHS`, `RIVYA_CONTRAST_STATES`. White/black-media states deliberately replace pixels in this browser only. They are not screenshots of the normal design.
5. `interactions.mjs` tests local playback, font gating, failure fallbacks, device preferences and keyboard focus. `capture.mjs` saves six ordinary-media screenshots separately from stress images.
6. `performance.mjs` measures public GET requests in fresh contexts. Set `RIVYA_PERF_ORIGIN`, `RIVYA_PERF_LABEL`, and optionally `RIVYA_PERF_PROFILES=mobile`. Run performance serially after other audits/builds stop. A new browser context does not purge the hosting provider's caches. Local measurements are not production or field evidence.
7. `subset-fonts.py` requires the already available development FontTools 4.61.1/Brotli runtime. It preserves the original full fonts, checks retained glyph outlines and metrics, and regenerates common subsets and their unicode range. It compares sizes to released base `66e82ef04f76b8460654bab4329ccbadfb47f28e`.
8. `summarize.mjs` verifies the completed follow-up matrix and inventories source/evidence hashes. It expects the named full, repair, control-recheck and performance receipts documented in `ACCEPTANCE-FOLLOWUP.md`. If changing the matrix in a later task, update the expected coverage deliberately rather than ignoring missing results.

Current merged contrast coverage is 600 unique observations. `contrast-access-recheck` replaces 60 earlier mobile access rows; `contrast-controls-recheck` replaces 96 homepage control rows after correcting fixed-navigation occlusion in the pixel sampler. Historical diagnostic files remain locally available and are not silently relabelled as current passes.

Native speech, physical-device and real-user field evidence are separate. Do not infer them from these scripts or mark them complete because a browser test passes.
