# CRAFT website and Studio release

Prepared 5 October 2026 for the owner's explicit main-branch publication request. Base: `9600099a2767eade23f13da3709607fdcf735cbf`. Verified application source: `8f68d064267892c5c9852c055003de1a02ddf8e3`. The complete repository file register is [craft-release-files.csv](craft-release-files.csv).

## Public website

- A full-width, responsive opening and detailed homepage chapters with clearer type hierarchy, image/text compositions, collection doorways, process steps, journal cards and inquiry guidance. Native scrolling, visible first paint, truthful illustration captions and reduced-motion behavior are retained.
- Furniture/spatial art, memory art and personal art retain their distinct Studio-owned chapters. Keyboard-operated chapter navigation and responsive spacing improve reading without replacing saved copy or section order.
- Search and catalogue controls gain clearer filter/result presentation. Product galleries retain original image associations and true colours. Saved pieces, inquiry steps and receipts receive clearer hierarchy and phone-sized targets; saved-order recovery and manual WhatsApp sending remain unchanged.
- Story, process, materials, architects, journal, articles, FAQ, contact and policy pages gain consistent editorial layouts. Articles have readable line lengths and chapter indexes; print styles simplify policies and materials.
- Missing journal and portfolio detail pages return HTTP 404. Moving loading fallbacks into the index pages prevents the parent loading boundary from prematurely streaming a 200 response.

## Studio

- Homepage Studio directly assigns approved hero and collection-doorway images, with independent desktop/phone focal points and applicable frame ratios. Search preserves the current assignment when no match is found.
- A collapsible composition review shows enabled chapters, existing product references, image repetition and saved category coverage. Placement links focus the owning editor section. Exact saved preview, publication and revision recovery retain their existing contracts.
- Shared surfaces, typography, filters, tables, dialogs and status labels cover all 16 current Studio modules. Inquiry search/stage controls stay visible; advanced filters use a native disclosure, with applied chips and date presets available outside it.
- Product editor tabs support arrow keys, Home/End, roving focus and named panels. Media cards keep contained images and explicit selection state. Record identity, saved revision, publication and unsaved editing states are labelled separately.
- Overview hierarchy adapts the requested Bionis, Medesk and Gridline references using actual existing metrics and APIs. Attribution is retained. No new runtime dependency, demo analytics or sample-record installation is included.

## Backup removal

The owner removed backup operations from project scope. The archive/Drive operator, receipt writer/test, dedicated runbooks and backup-specific receipts are removed. C6-05 and C6-06 remain stable task IDs marked **removed by owner**, not passed.

The historical migration no longer copies orders, events, sessions or login limits into a backup schema. A metadata-only migration marker replaces the historical seed tool's dependency on that snapshot. Neither migration nor seed was executed. Earlier databases and snapshot schemas remain intact.

The old Codex automation was already absent (`not_found`), and no Rivya Windows task or Vercel cron was found. Existing archive files, keys, credential stores and remote data were preserved. Draft/revision recovery, managed exports, privacy erasure and deletion replay remain. Source privacy wording no longer promises an ongoing archive service; publishing a saved production policy is a separate editorial operation.

## Verification

The final application source passed **280 unit tests, 12 repository preflight checks, 403 built-server HTTP tests, changed-source lint, TypeScript during the optimized build, script syntax and whitespace checks**. These checks were completed on 5 October before release; this packaging adds only documentation and a file register. The count decreased from 281 unit tests because the one test for the deleted backup receipt writer was removed.

Earlier scoped CRAFT evidence is retained with dates and limitations:

| Slice | Recorded evidence |
|---|---|
| C1 | Public/Studio responsive, error/retry, reduced-motion and focus checks; 104 proposal views without missing images/body overflow |
| C2 | 20 isolated saved-preview/publish/stale-write/revision-recovery assertions; 320/390/768/1440px layout checks |
| C3 | Search/browse, private-reference, inquiry/receipt and lost-response recovery checks in isolated QA |
| C4 | 60 responsive observations, 20 browser checks and 36 isolated HTTP assertions; real missing-detail 404 coverage |
| C5 | 15 focused browser checks, 32 body-reflow observations across 16 modules and 18 read-only service assertions |

Relevant records: `backup-removal-verification.json`, the `craft-c2-*`, `craft-c3-*`, `craft-c4-*` and `craft-c5-*` evidence, their dated checkpoints and acceptance registers. Historical browser/service runs are not represented as a fresh full acceptance pass.

## Protected data and open work

Existing products, forms, galleries, scraper, business/social/contact facts, customer records, Studio drafts/history and manual-send behavior stay protected. Recorded C5 comparisons matched 120 products, 136 media records/associations, business settings and 64 content records. This source release makes no content/data publication, import, migration, grant or customer-message request. QA image identities and content snapshots must not be copied into production.

Still open: full C5 role/error/401/409/dirty-navigation/publishing/recovery/keyboard/zoom matrix; C6 mobile/field performance; human screen-reader and physical-phone evidence; optional video review; production editorial and reviewed-language acceptance. Production Imprint was last recorded as unavailable; source deployment alone cannot publish its Studio record. These are limitations of this release, not completed phases. Archive/key-copy and sustained-backup checks are no longer requirements.

## Release and recovery

Push the feature branch, open the detailed PR, inspect exact-head checks and merge through GitHub. Existing Git integration may deploy that main commit; verify READY state, source SHA and public route responses before reporting success. Keep the prior main SHA for an authorized source rollback. Recover editorial changes only through existing draft/revision workflow; never overwrite a database to undo presentation. Do not recreate removed backup operations during recovery.

Illustrated local reports and raw screenshots remain review artifacts outside the application source; canonical specifications, evidence, attribution and task registers are included in this PR. Credentials, private configuration, archives and keys are excluded.
