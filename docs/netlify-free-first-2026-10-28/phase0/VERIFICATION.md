# Phase 0 verification and private evidence index

Application source baseline: `41cda9c20947dface0b027484106d0bbcc0cdd14`. Audit date: 28 October 2026. Only local documentation and an audit utility changed. No application tests are reclassified as live provider acceptance.

| Fresh check | Result | Evidence scope |
|---|---|---|
| Authenticated Git remote heads / connected open-PR reads | Passed | Main and migration heads unchanged; PR #71 still draft/open; latest local branch unpublished |
| `node tools/codex-preflight.mjs --report-only` | Passed, no source blockers | Correct repository, branch, package/lockfile and Next entrypoint; deployment safety/build explicitly not checked by this command |
| `node --import tsx tools/phase0-source-inventory.mjs --out docs/netlify-free-first-2026-10-28/phase0` | Passed | 557 source files, 53 handlers, 37 modules, 32 old sidebar entries; static limitations recorded |
| Repeat inventory into ignored local evidence directory | Passed | Both generated JSON artifacts reproduce byte for byte at the same source revision |
| Independent file hash/matrix/link validation | Passed | Rehashed all 1,198 protected files; zero baseline changes; 37 feature rows; relative evidence links resolve |
| Selected creation/access tests | **7/7 passed** | `node --import tsx --test tests/owner-creation-selection.test.mjs tests/owner-creations-public.test.mjs`; includes 169 images / 507 variants byte and dimension verification |
| `node --check tools/phase0-source-inventory.mjs` | Passed | Audit utility syntax |
| `node node_modules/eslint/bin/eslint.js tools/phase0-source-inventory.mjs` | Passed | 0 errors / 0 warnings for the new utility |
| `git diff --check` | Passed | No whitespace errors; normal checkout LF/CRLF notices are not test failures |
| Local artifact screening | Passed within stated scope | No obvious database-URL/private-key/Google-token patterns found in new audit artifacts; provider responses/credentials are excluded from Git |
| Netlify API/environment-name readback | Passed for inventory | Exact deployed migration SHA, locked deployment, branch, account Free/no auto-top-up/no trial; Google not selected |
| Database read-only inventory/fingerprints | Passed | 22 tables / 3,454 rows, 20 business-table comparisons unchanged; constraints validated; no row values exported |
| Blob metadata read | Passed | 92 objects / 11,678,925 bytes; normalized metadata unchanged; original bytes not rehashed/copied |
| Public HTTPS/DNS readback | Passed for stated routes | Correct www/apex/Netlify hosting, login/anonymous guards; default-host redirect and indexing state explicitly reported |
| Google Drive/native Sheet metadata | Passed for inventory | Four owner-only workbooks, five expected tabs each, 100 × 12 allocation; no protection or writer execution acceptance |
| Vercel recovery inventory | Partial | Projects/domain associations retained; account says Pro; zero configurations returned by accessible integration queries; webhook list denied 403; schedules/billing details still open |
| Real authenticated browser inspection | **Blocked** | Chrome tab binding times out before page read; native window title alone is not page/rendering/workflow evidence |

The application build, 767 unit tests, 12 preflight tests and 663 isolated HTTP checks from the preceding repair checkpoint are documented in [CLAIMS-AND-GATES.md](CLAIMS-AND-GATES.md). They were not rerun for these audit-only changes. No production write probe, Google concurrency test, migration rehearsal into a target, publication, deployment or resource removal was run.

## Retained local evidence

Fresh private evidence remains Git-ignored under `test-results/netlify-free-first-phase0-20261028/`:

- `netlify.json` — sanitized hosting revision/configuration/key-name readback.
- `netlify-account.json` — selected account/free-plan capability fields only; no secret/account identity values.
- `database.json` — actual table counts and constraint inventory.
- `source-fingerprints.json` — private source change-detection fingerprints; no row values.
- `blob-metadata.json` — private object inventory and normalized comparison summary.
- `public.json` — public HTTPS and DNS results.
- `connector-summary.json` and `provider-metadata-summary.json` — sanitized current GitHub/Google/Vercel observations and access limitations.
- `audit-validation.json` and `reproduced/` — local consistency/reproducibility results.
- Local read-only helper scripts — retain separately from public source artifacts; they refer to legitimate local configuration locations without embedding credential values.

Provider/fingerprint files were created using the repository's owner-only private-metadata writer; raw source records, screenshots and credentials were not published. This local directory is not an independently verified encrypted backup or a restored target.

Git-safe generated artifacts are [source-inventory.json](source-inventory.json) and [protected-source-baseline.json](protected-source-baseline.json), accompanied by the human-reviewed [feature matrix](FEATURE-MATRIX.md), [dependency map](DEPENDENCIES.md), [protected baseline](PROTECTED-BASELINE.md) and [audit](AUDIT.md). The inventory generator is at `tools/phase0-source-inventory.mjs`.

## Separate outcome dimensions

| Dimension | Phase 0 outcome |
|---|---|
| Implementation | Audit tool and documentation only; application unchanged |
| Local verification | Checks above passed |
| Real-provider verification | Read-only inventory passed within stated limits; five Google acceptance checks remain open |
| Migration | None; source fingerprints and prior encoding rehearsal are not a migrated target |
| Cutover | None; SQL/Blob remain authoritative |
| Production release | None; production still serves the existing migration commit |
| GitHub publication | None; no push, PR creation/update or merge |
| Old-resource removal | None; all recovery resources and OLDWEBSITE retained |

Phase 0 remains **partial** until the unresolved authenticated/browser, installed-Google and provider/recovery inventory evidence is available. This status is intentionally narrower than a release-ready or complete-migration claim.
