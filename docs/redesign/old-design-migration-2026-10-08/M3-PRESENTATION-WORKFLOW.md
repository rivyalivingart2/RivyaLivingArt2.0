# M3 — separate homepage design revisions

9 October 2026. Local implementation only. No production schema or content write.

The new `presentation:home` record owns three layout choices: full-image/split opening, compact/spacious manifesto and editorial-row/asymmetric featured grid. Existing content, selected products, crops, translations and revision tables are untouched. `/studio/sections` is a real seventeenth destination using the current session/role system.

The explicit idempotent schema creates two additive tables. A draft captures one coherent published homepage and its approved dependencies. Saved desktop and 390 px iframe previews render that fixed revision and explicit locale through `HomepageDocument`. Navigation/business contacts remain current and are described that way. The public renderer applies only the published layout to fresh current content, so it does not resurrect withdrawn source records. Missing schema keeps the original public layout; other storage errors propagate.

Editors can save/restore; administrators publish. Origin checks, bounded request validation and optimistic versions protect writes. A publication rechecks the captured homepage/product/media fingerprints in the same SQL statement that saves its immutable history. A history failure rolls back the design change. Recovery copies an earlier layout into a fresh draft with current references and never publishes it. History summaries contain at most 30 rows. Studio compares the public, edited and latest saved choices and preserves edits across interrupted responses and conflicts.

## Fresh evidence

- 301 unit tests, production build/type validation and changed-source lint pass.
- Seventeen compiled-browser/API checks pass: 401/403/409, payload injection, exact revision/locale, actual mobile iframe, protected selections, missing/changed dependency rejection, draft/publication rollback, cancelled unsaved navigation, a response lost after successful save, comparison/reconciliation, publication/public readback and restore-as-draft.
- Four widths (320, 390, 800 and 1440 px) have one homepage H1 and no body overflow. The new Studio editor also fits 390 px. Assistant reviewed desktop/mobile and featured-grid captures. These are browser emulations, not physical devices or human sign-off.
- All 13 protected local row/count digests equal the M0 baseline. Disposable synthetic editor access was removed after role checks; no original staff identity was touched.

The first run exposed a blocked mobile iframe. A dedicated authenticated `/studio/presentation/preview/frame` route now allows same-origin framing; other Studio routes retain `DENY`. The rerun checks those actual response headers. Test selection was also corrected to use the controls' accessible roles. Failed/intermediate runs are not acceptance evidence.

Dependency fault injection changed only the new QA presentation draft, then restored it; it did not hide real media or change protected content. A temporary trigger on the new revision table simulated storage failure and was removed. All evidence is scoped accordingly. Native browser tab-close, human readers, physical devices, field performance and real-world business checks remain open. M4 begins the complete home and story structures; this slice is not full visual parity.
