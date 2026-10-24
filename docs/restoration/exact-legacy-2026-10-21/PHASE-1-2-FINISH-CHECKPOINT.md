# Phase 1 and 2 pending-work continuation

21 October 2026. Local descendant of `f3a7c04` on `codex/exact-legacy-restoration`. The owner requested completion of the remaining Phase 1 and 2 work, preserving protected data and the current Studio login, with everything local. This report does **not** declare both phases complete.

## Status

| Requirement | Current evidence | Acceptance |
|---|---|---|
| Phase 1 route/entity/action inventory | Existing 98 routes, 45 entities, 575 fields and 156 actions remain accounted for | Source discovery complete within the recorded inventory |
| Real old database records, relationships and counts | Correct Vercel project/team and Prisma Postgres provider identified; connector returns metadata without usable connection values; known local project locations have no usable old export/connection | **Blocked by access**; synthetic fixtures cannot close this gate |
| Previously unobserved conditional states | Original old components running in a separate local database; matched populated project fixture, Studio unsaved/validation states, newsletter failure/retry/persistence and error components observed | Bounded observations verified; live HTTP status and all role/provider workflows are not certified |
| Phase 2 representative design gaps | Footer, newsletter, desktop WhatsApp control, source scope images, current category images and project geometry refined against actual source/live captures | Implemented and verified locally; final whole-phase exact-design acceptance is not claimed while remaining content mappings and complete state coverage are open |
| Protected data and login | 21 source hashes unchanged; seven login rectangles identical at 1440 and 390px; original media preserved, six source assets added with hashes | Source/login preservation verified; no fresh live destination row-digest comparison in this continuation |
| Migration, publication and release | Local synthetic data only | No real data migration, CMS publication, push, PR, merge or deployment |

## What changed

The footer now follows the old twelve-column 4/2/2/2/2 composition, source texture, CTA proportions, contact icons, responsive stacking and inset separators. The existing logo, contacts, populated copy, language control, pause control and legal links remain. Different protected copy and additional valid controls explain differences in total height; the old fields are not blindly written over current records.

The inline newsletter now works through browser → API → local SQL → retry/refresh. It validates and normalizes email, rejects foreign origins and unknown input, ignores the honeypot, rate limits requests, and makes duplicate registration idempotent without exposing membership. The additive schema was applied only to the task-owned local database. Production activation requires the separately reviewed table/grants and `RIVYA_NEWSLETTER_ENABLED=true`; no production setup or email delivery occurred. Subscriber management and campaigns are not implemented by this form.

The source desktop WhatsApp control appears after one-quarter scroll, uses the protected current number, and stays hidden on mobile and product/commission pages. Its animation and cleanup are ported; checking the link did not send a message.

Category doors select an existing valid published product image and record its media dependency. Four scope images and a maker fallback restore missing visual slots. Six old assets totaling 490,199 bytes are byte-identical to the pinned source and listed in [foundation-media.json](inventory/foundation-media.json). Current original media, crops and associations were not overwritten. The image optimizer now explicitly allows this narrow additive asset directory; broken scope images discovered during checking were corrected.

The project template now matches the source hero height, title wrapping, grouped breadcrumb, concept badge spacing, story/specification grid, stat row, brief/material/process bands and closing commission composition. Both comparison sides use the same synthetic project content. The current truthful concept wording remains. This makes the layout comparable without inventing a customer commission or publishing a record.

## Isolated old reference and observed limits

The clean pinned `OLDWEBSITE-reference` checkout remains at `2dd6d5de34acf3f98e611eda2e1b858ebd0da8e6`. A separate `OLDWEBSITE-isolated` archive runs on port 4212 against only its task-owned loopback PostgreSQL database on 55444. The source build was invoked directly through Next, avoiding the old npm build's migration/bootstrap commands. No real source credential or production database was used.

Documented adapters in that disposable copy:

- `src/app/fonts.ts` uses the same locally available Latin font faces. `fonts-scripts.ts` has an English-only fallback; non-Latin parity is not claimed. Six local font files are copied into `src/app/reference-fonts/`.
- `src/i18n/routing.ts` uses `/en/` prefixes to avoid the local locale redirect loop. This is not deployed URL parity.
- `src/lib/slug.ts` uses Web Crypto for the same two random bytes because its `node:crypto` import entered a client dependency graph and prevented the isolated production build. Slug-uniqueness workflow parity is not claimed.
- The derived `vector(512)` column is represented as `real[]` in the disposable schema because this PostgreSQL runtime lacks pgvector. No vector/similarity acceptance is claimed.
- `src/app/[locale]/reference-state/page.tsx` renders the original gone/countdown components under a normal local route because the status self-rewrite fails locally. The original components are not rewritten, and these captures are explicitly component behavior evidence rather than HTTP 410/429 evidence.

The old production build retained CSP; it was not weakened to accommodate development hydration. Its synthetic database contains one user, one category, one project, two products, and the single browser-created subscriber. Guarded read-only queries verified that the discarded draft title remained unchanged and that newsletter registration persisted exactly once.

Observed old defects remain recorded: the live rate-limit URL showed Vercel's standard 429 page rather than the source custom countdown. Isolated unpublished-product, archived-product and missing-project probes returned HTTP 200. The missing project rendered useful recovery, and the original countdown reached its ready state, but rendering success does not establish correct status codes. These are future integration fixes, not hidden passing results.

## Verification and working comparisons

[Generated verification receipt](phase12-finish-verification.json): final isolated build `-PQ1q3ySBQe05yA-S1mEm`, 411 unit/isolation checks, 403 built HTTP checks, 12 preflight checks, and zero ESLint errors with 62 inherited warnings. The build compiled and typechecked. There are 64 final layout measurements over 1920, 1440, 1200, 992, 768, 512, 390 and 320px: one h1, no horizontal overflow, and no broken visible or unavailable images in the checked families.

The continuation records 17 browser observations, seven newsletter API/SQL checks, matched login geometry and 28 accepted screenshots; 11 candidate screenshots belong to the final build. Browser observations span the continuation, and are not falsely described as all repeated after the final CSS-only badge and separator adjustments. Earlier checkpoint observations remain historical evidence. Full-footer compositor clips falsely placed fixed controls over the content; they were excluded from the accepted capture manifest in favor of actual viewport screenshots.

Tall offscreen captures also produced repeated image strips. Final paired project/footer/scope captures were replaced with matching 640px-high viewports at 1200 and 390px widths and visually inspected. The 64 geometry measurements retain their recorded taller heights; these are separate evidence. The latest login image is a shorter bounded preview, while preservation is established by the unchanged source and earlier identical seven-element geometry at 1440×1000 and 390×844, not by a new pixel-equivalence claim.

- Working destination: `http://127.0.0.1:4210/`.
- Matched comparison: `http://127.0.0.1:4211/`; latest families start `finish-`.
- Matched new project: `/studio/restoration-reference?view=project&fixture=matched`, authenticated and isolated only.
- Original old source fixture: `http://127.0.0.1:4212/en/portfolio/synthetic-reference-project`.
- Private screenshots, SQL receipts and local authentication stay ignored under `test-results/exact-legacy-2026-10-21/`.

Run `verify-finish.mjs` to validate saved evidence; `verify-finish-data.mjs` checks the latest synthetic submission read-only while the local runtime is running. Preserve both populated task clusters. Never rerun preparation, reset existing fixtures, or repeat the completed production request-table repair.

## Remaining concrete work

The owner is signing into the Vercel account that can open `https://vercel.com/rivyalivingart20-4705/oldwebsite/stores`. Once access is available, inspect the existing connected Prisma Postgres store and obtain an owner-controlled read-only session/export without printing secrets. Verify source schema, counts, records and relationships in a read-only snapshot and prepare private conflict evidence. Do not create a new database, rotate credentials or activate an unrelated paused integration as a substitute.

Final Phase 2 acceptance must still resolve the content-driven homepage differences (including prints/workshops and the protected three-chapter proof content), and check remaining representative conditional states against populated real mappings or explicitly justified protected exceptions. The source-only configuration and synthetic fixtures do not certify those mappings. [VISUAL-EXCEPTIONS.csv](VISUAL-EXCEPTIONS.csv) keeps these open. Do not move to Phase 3 merely because earlier checkpoint prose said to do so; the latest owner request is to finish Phase 1 and 2 first.

All work is local. Physical-device, screen-reader, native-reader, real-provider, complete feature/workflow and release acceptance remain the separately named later-phase gates. No new authority to publish or mutate production is inferred from this checkpoint.
