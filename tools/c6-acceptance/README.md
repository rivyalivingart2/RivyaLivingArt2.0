# C6 compiled QA checks

Run from the repository root with Node 22 and installed locked dependencies. `axe-core` 4.13.0 is present in the lockfile through the existing lint toolchain. Chrome is expected at the standard Windows path used by these runners. The full application check remains `npm run check`.

Set `RIVYA_QA_CONFIG_PATH` to the existing private QA configuration file path, never put credentials on the command line. `common.mjs` verifies the database name, database role and object store identity before reads. Sign-in verifies the issued session hash in the pinned QA database; token/hash stay in memory. The compiled server keeps its production `__Host-` cookie. The browser harness stores its HTTPS-source cookie on the trustworthy loopback host; it does not disable or change production cookie security.

1. Build the current application (`npm run build`).
2. Start `node tools/c6-acceptance/serve.mjs` in a separate terminal. This serves the compiled candidate on `http://127.0.0.1:4194` using only isolated QA settings. Keep the server and build source aligned; restart after a new build.
3. Run `node tools/c6-acceptance/performance.mjs final 3 / /collectible-design /pieces/river-channel /commission/customize /process /studio/inquiries '/studio/content?record=page%3Ahome'`. Run alone, without another browser suite or build competing for CPU. Browser cache is cleared per sample; server and image caches may be warm. Authenticated route assertions reject redirects to sign-in. Menu opening/closing supplies a bounded interaction diagnostic.
4. Run `node tools/c6-acceptance/accessibility.mjs final`. This visits 32 public/system/login routes and 16 actual Studio modules at 1440/390/320 CSS pixels with reduced motion. Required route and Studio controls must be present. It stores violations and unresolved manual-review categories, not page text or customer records.
5. Run `node tools/c6-acceptance/interactions.mjs`. It checks skip links, modal focus, gallery keys, invalid-field focus and description, filter announcements, FAQ, 720/360px reflow, unsaved Studio title retention around navigation/page finder, and language policy/fallback. No brief or editorial change is saved.
6. Run `node tools/c6-acceptance/media-motion.mjs`. Regression guards check initially visible image bytes, source widths, availability/names, finite entrance motion and static reduced motion on five public routes at two sizes. These guards are adopted for C6, not a claim of previously agreed asset budgets or field acceptance.
7. Optional query diagnosis: `node --import tsx --loader ./tools/c6-acceptance/server-only-loader.mjs tools/c6-acceptance/source-profile.mjs`. Only elapsed times and response sizes are recorded. Do not introduce a cross-request cache without proving immediate publication/withdrawal and preview isolation.

Evidence goes into ignored `test-results/c6-acceptance`; only reviewed, sanitized receipts belong in `docs/redesign`. Browser screenshots must exclude private records, signed URLs and credentials. The accessibility runner compares protected catalogue/media/business fingerprints and pre-existing content/inquiry/order/staff rows before and after its read-only run. Authentication sessions are expected operational side effects; there are no fixture publications, customer messages, exports, erasures or backup jobs.

## Interpretation

- Three lab samples per route are diagnostics. They do not establish real-user p75 LCP/INP/CLS. A maximum Event Timing duration is not p75 INP.
- A completed run is not automatically a passing metric. Record failures and the missing evidence explicitly.
- axe zero violations is not WCAG certification. Preserve `incomplete` manual-review cases, especially text over photos/gradients.
- Narrow CSS viewports and headless touch are emulations. CSS `zoom` was rejected as a native zoom proxy because it does not trigger viewport media queries. Native browser zoom, human screen-reader use and physical phones retain separate gates.
- Earlier provisional Studio samples that redirected to login are invalid and excluded from the final receipt. Use only the final run with exact destination assertions.
- The owner said no real phone or screen reader is available. Use `docs/redesign/C6-HUMAN-DEVICE-CHECKLIST.md` later on an authorized HTTPS preview of the exact candidate. C7 release still requires an explicit new push-main request.
