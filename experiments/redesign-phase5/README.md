# Phase 5 local Studio review

Phase 5 extends the approved design into Studio content and editing. The owner approved Phase 4 and authorized Phase 5 only. Review at http://127.0.0.1:4182/review and stop before Phase 6.

The gallery contains real localhost QA screenshots, with separately labelled synthetic state specimens and one synthetic lifecycle record. Images do not require Studio login. The real app at http://127.0.0.1:4199/studio/products requires the existing isolated QA session. The screenshot server accepts GET/HEAD only and never connects to the database.

## Restart

Use the existing isolated PostgreSQL on 127.0.0.1:55439, database `rivya_migration_local`. Never reseed records to reproduce a screenshot. The guarded runner reads ignored `test-results/old-design-migration/.env.qa`; never print or commit it. The local-only `RIVYA_P2_STATE_GALLERY=1` flag enables labelled state specimens at `/studio/preview/states`. It does not enable that route in production.

From the repository root, with the app stopped before building:

```powershell
$phase5Node = 'C:/Users/gonda/Documents/Codex/2026-09-23/continue-the-approved-rivyalivingart-redesign-read/work/tooling/node_modules/node/bin/node.exe'
$env:RIVYA_MIGRATION_PG_MODULE = 'C:/Users/gonda/Documents/Codex/2026-09-30/keep-rivyalivingart2-0-as-the-base/work/tooling/local-postgres/node_modules/pg/lib/index.js'
& $phase5Node tools/old-design-migration/run-local.mjs build
& $phase5Node tools/old-design-migration/run-local.mjs serve
```

In another terminal, start the screenshot gallery:

```powershell
& $phase5Node experiments/redesign-phase5/serve.mjs
```

Do not rebuild `.next` beneath the running app; cached chunks can become invalid. Local services are left available for owner review, with no automation or production changes.

## Evidence and reproduction

Read `../../docs/redesign/modern-design-2026-10-13/PHASE-5-REVIEW.md`, `phase5-verification.json`, `phase5-preservation.json`, `PHASE-5-INDEPENDENT-REVIEW.md` and `CONTINUE.md`.

Generated logs and private DOM/screenshot evidence stay ignored under `output/redesign-phase5` and `output/playwright/redesign-phase5`. The 24-workspace baseline was captured against Phase 4 `157ea4b`. Final baseline comparison passed before the synthetic lifecycle FAQ was added. Do not overwrite the original baseline or misreport the known QA addition as altered original content. A later run must explicitly reconcile its extra record/count; it must not silently replace the baseline.

Run browser scripts through the guarded runner, e.g.:

```powershell
& $phase5Node tools/old-design-migration/run-local.mjs tools/redesign-phase5-interactions.mjs
& $phase5Node tools/old-design-migration/run-local.mjs tools/redesign-phase5-states.mjs
& $phase5Node tools/old-design-migration/run-local.mjs tools/redesign-phase5-coverage.mjs
& $phase5Node tools/old-design-migration/run-local.mjs tools/redesign-phase5-review-captures.mjs
```

`redesign-phase5-lifecycle.mjs` is intentionally mutating **only in guarded localhost QA**. It creates a new clearly labelled synthetic FAQ, checks save/conflict/publish/hide and retains it hidden. Do not rerun it merely to refresh images: it creates another record. Existing fixture ID and exact revision are recorded in the lifecycle/preservation receipts. No existing product/content/translation was saved by these checks.

`redesign-phase5-preservation.mjs` compares original IDs/digests from ignored before/after snapshots and emits only safe aggregate counts plus the known synthetic fixture. All 1,641 originals remain unchanged; one QA FAQ and four revisions were added. Authentication/session/rate-limit bookkeeping is outside those 13 scopes. Local data is not a fresh production mirror.

Viewport emulation, computed text contrast and synthetic state previews are scoped evidence. They do not supply physical-phone, screen-reader, independent-language or field-performance acceptance.
