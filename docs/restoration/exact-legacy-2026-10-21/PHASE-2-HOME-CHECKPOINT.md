# Local homepage restoration checkpoint — Phase 2 continuation

21 October 2026. Continued from `5b0a0ea` on `codex/exact-legacy-restoration`. The owner's "GO TO NEXT PHASE" continues the authorized local restoration; it does not authorize skipping unfinished parity gates or releasing changes. Final application build: `GN1TzWAYdKFILJnSQXYyu`.

## Implemented in this slice

The public homepage now uses the existing validated reference-composition adapter without requiring a saved presentation. Actual OLDWEBSITE component geometry and motion at source `2dd6d5d` have been adapted around current published content:

- Source section order, display typography, standard/major vertical spacing, scope grid, atelier image/copy columns, process hairline and closing invitation.
- Measured desktop progress ruler and mobile progress bar; native contents disclosure remains usable with JavaScript disabled.
- Featured product rail with source card widths, horizontal snap fallback and eligible desktop pin/scrub. Keyboard focus releases the pin. Existing product IDs, URLs, prices and Save controls remain.
- Six expanding desktop collection doors and stacked mobile doors. Current category counts and assigned images/crops remain; all additional categories stay reachable through a native disclosure.
- Below-fold meniscus image reveals, with cleanup on pause, reduced motion and unmount. Hero and first paint remain visible.
- Material-story sticky image and reading-column layout using the current image, paragraphs and optional published film.
- Editorial journal rows with real article destinations, preserved descriptions and image focal points, computed reading time and one bounded pointer preview. Keyboard focus hides the decorative image.
- Existing explicit hidden sections and data-readiness gates remain respected. No invented reviews, portraits, customers, ratings or dates.

[LEGACY-HOME-MAPPING.md](LEGACY-HOME-MAPPING.md) records each old slot, its current binding, source provenance and differences. [LEGACY-DESIGN-CONTRACT.md](LEGACY-DESIGN-CONTRACT.md) retains the wider foundation contract. This is a working partial Phase 2 implementation, not complete homepage or whole-site parity.

## Verification

The sanitized machine receipt is [home-composition-verification.json](home-composition-verification.json). Private screenshots, logs and runtime configuration remain Git-ignored.

| Check | Result and limit |
|---|---|
| Final application build / TypeScript | PASS, build above, task-owned synthetic PostgreSQL only |
| Unit / isolation / reconciliation | PASS, 409 |
| Built HTTP / publication boundaries | PASS, 403 |
| Repository preflight | PASS, 12 |
| ESLint | Full run: zero errors, 62 inherited warnings; changed source/tools checked separately |
| Protected source | All 21 baseline file hashes unchanged |
| Responsive layout | Eight widths from 320 to 1920px: no horizontal overflow, one h1, eleven visible reference slots, three selected product cards, six collection doors, correct ruler breakpoint |
| Motion and keyboard | Pin/scrub observed, focus releases pin, below-fold images reveal, effects pause removes pin/masks, no-JS contents opens natively |
| Collections | Door expansion observed; nine additional categories exposed; actual category URL opens matching published results |
| Journal | Three existing fixture articles render in an unpublished test preview; pointer image loads and stays bounded; keyboard hides it; actual article link opens matching title |
| Local Studio authentication | Synthetic owner sign-in and sign-out passed; session left signed out |
| Protected login geometry | Seven element bounds match exactly at 1440 and 390px; current login source/assets unchanged |
| Login pixels | Not pixel-identical. Mean channel differences: 0.2409/255 desktop, 0.5160/255 mobile; channels differing by more than 12/255: 0.0005% and 0.0164%. Pixel metrics are diagnostic, not an exact-match pass |
| Screenshot integrity | 54 distinct checkpoint captures; dimensions and candidate capture time/build association verified |
| Browser interactions | 14 scoped checks passed |

The initial login comparison mixed animated glass states. Fresh captures confirmed reduced motion and identical geometry. Chrome selected a 420px production backdrop and retained a 1440px local backdrop at mobile width; these image variants are recorded in the receipt. The remaining small pixel differences are disclosed rather than hidden by loosening a pixel threshold.

These checks use resized desktop viewports. They do not certify physical phones, screen readers, real providers, field performance or every old conditional workflow. The build and screenshot checks do not certify protected live database preservation by themselves.

## Data and publication boundary

No production database write, migration, title rewrite, record import, media derivative, CMS publication, vendor job, external message, push, PR, merge or deployment occurred. The request-table repair was not repeated. Current product/content/media data is read through the existing publication contracts.

The existing local synthetic public homepage has no selected journal articles. To verify the populated journal without changing it, `prepare-home-preview.mjs` added exactly two task-owned local rows: one unpublished presentation and its revision, selecting three existing fixture articles in a private captured snapshot. It modified zero existing rows and published nothing. Do not rerun it on the populated fixture.

The prior Phase 1 continuation recorded matching before/after digests for 19 destination runtime-visible tables. **No new live database digest comparison was performed in this UI-only slice.** Old live database export remains unavailable. Synthetic fixtures are not a substitute for that missing evidence or a real migration.

## Working previews and continuation

- Application: `http://127.0.0.1:4210/`.
- Old/new comparison: `http://127.0.0.1:4211/`. Latest states start with `home2-`; journal candidate is explicitly an unpublished local preview.
- Private evidence: `test-results/exact-legacy-2026-10-21/`. Original 216 baseline captures and prior 54 foundation captures remain separate.
- Provisioned Node 22 is under `../tooling/node22/`. Use `tools/exact-legacy/run-local.mjs start` / `stop`; stop the existing server before building. Preserve the populated local cluster.
- Verify saved evidence with `verify-home-composition.mjs`; regenerate the viewer with `comparison.mjs`. Temporary browser viewport/motion/script settings were restored.

## Remaining work and next edit boundary

Phase 1 remains open for the old live data export and unverified conditional/error/unsaved states. Phase 2 remains **IN_PROGRESS_LOCALLY**. Its next work is:

1. Bind the old material sequence and stage content safely, including the 121-frame pour/cure experience; the current sticky image layout is not that completed feature.
2. Port representative product, collection and editorial templates with actual quick-view, variant, Save and manual WhatsApp workflows.
3. Complete footer/newsletter/announcement behaviors and authenticated Studio shell, tables and editors while preserving the current login.
4. Resolve missing scope/maker/category/print/workshop bindings with traceable fields and genuine assets. Current unmapped category images remain monograms; this is an open content gap.
5. Continue useful legacy Markdown migration individually with provenance. One source Markdown contract is adapted so far; the 286-path inventory is not a migration count.

Phase 3 has planning/dry-run primitives only; no real protected-data reconciliation or media migration is complete. Phases 4–7 remain outstanding, including complete workflows, vendor expansion, catalogue automation, population/filters and release readiness. Keep all changes local until separate authorization changes that boundary.
