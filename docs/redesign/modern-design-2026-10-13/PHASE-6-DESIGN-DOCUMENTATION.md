# Phase 6 design documentation comparison

Date: 2026-10-13

**Documentary verdict: ordinary extension of the approved Studio Operate world into operations and administration.** The final Phase 6 source retains the incumbent identity, palette, body typography, native controls and shared shell. New table, queue, board, staff-row, dialog and access layouts adapt that vocabulary to operational tasks. They do not establish a replacement visual world. No new concept seed, root DESIGN.md or Phase 6 design sidecar is required. Existing PRODUCT.md, scoped DESIGN.md and sidecar authority are preserved.

The owner approved Phase 5 and authorized Phase 6 only, as recorded in [Phase 6 direction](../../../experiments/redesign-phase6/DIRECTION.md). This comparison follows the Impeccable ordinary-extension documentation handoff after the final independent finish review. It is source and receipt analysis, not another visual acceptance or workflow-test pass.

## Evidence and exact inspected files

The reference read for the documenter workflow was `C:/Users/gonda/.codex/skills/impeccable/reference/document.md`, alongside the Impeccable SKILL.md. The existing session records the failed context launcher; it was not rerun. No design authority was regenerated or overwritten.

Project authority and supplied evidence inspected:

- `AGENTS.md` current checkpoint; `PRODUCT.md`; `docs/redesign/modern-design-2026-10-13/CONTINUE.md` current stop and evidence boundary.
- `experiments/redesign-phase6/DIRECTION.md` and `experiments/redesign-phase5/DIRECTION.md`.
- `experiments/redesign-phase3/DESIGN.md` and `experiments/redesign-phase3/.impeccable/design.json`, including their scoped authority, token primitives, extensions, specimens and preserved drift. Root `DESIGN.md` is absent.
- `docs/redesign/modern-design-2026-10-13/PHASE-5-DESIGN-DOCUMENTATION.md`.
- `docs/redesign/modern-design-2026-10-13/PHASE-6-REVIEW.md`, `PHASE-6-INDEPENDENT-REVIEW.md` and `phase6-preservation.json` in the same directory.

Styles inspected directly:

- `src/styles/tokens.css`.
- `src/components/studio/studio-editing.module.css`.
- `src/components/studio/studio-operations.module.css`.
- `src/components/studio/studio-access.module.css`.
- Final Phase 6 deltas in `src/components/studio/overview.module.css` and `src/components/studio/inquiry-card.module.css`.

Source deltas inspected against the approved Phase 5 base `da435d3`:

- `src/components/studio/workspace.tsx`, `overview-panel.tsx` and `conditional-workspace.tsx`.
- `src/components/studio-login.tsx`, `src/components/studio-orders-board.tsx` and `src/app/studio/inquiries/[id]/card/page.tsx`.
- Under `src/components/studio/`: `analytics-panel.tsx`, `business-settings.tsx`, `inquiry-detail.tsx`, `inquiry-workspace.tsx`, `legacy-disposition.tsx`, `operations.tsx`, `privacy-controls.tsx`, `publication-queue.tsx`, `reference-cleanup.tsx`, `route-review.tsx`, `site-settings-editor.tsx` and `staff-editor.tsx`.

For the last twelve files, a direct baseline/current text comparison after removing only added `data-studio-part` and `data-studio-action` attributes matched the base exactly. That narrowly supports the presentation-hook classification; it does not replace runtime verification. Untracked operations/access CSS was read explicitly because an ordinary tracked diff omits it.

## Comparison with the incumbent

| Area | Final source and compatibility judgment |
| --- | --- |
| Identity | The existing horizontal transparent logo path is reused in sign-in and saved inquiry cards. It is contained, not recolored. Sign-in places the 180px logo on ivory; the saved card uses its ivory document surface. Existing textual identity and private-record notices remain. The shared shell logo is unchanged from Phase 5. |
| Palette | Obsidian `#080a0e`, ocean `#08283a`, sapphire `#164e6b`, sapphire hover `#1d6389`, champagne `#b89b63`, ivory `#f4f1e9`, stone `#ddd6cb` and muted `#a9b4bc` remain the same. Phase 5 separator `#43515a` and control border `#78828c` are reused. Urgent/error `#fca5a5` is a local status treatment, not a new brand accent. The saved card reuses ink `#18202a` and light-copy `#384856`, with `#b9b2a7` light-surface separators. |
| Typography | Shared Studio body remains 15px/1.65 through the existing Inter-based `--font-body`. Task headings retain weight 500, line-height 1.3 and tracking `-.02em`, with 32px h1 reducing to 28px at 700px. The operational scope adds tabular numerals. Queue labels and record references use the body stack instead of adding a display/data-font voice. Dialog headings are 24px, reducing to 21px at 700px. Public serif typography stays in its own scope. |
| Shared shell and control reuse | Workspace wiring now applies Phase 5's shared content/control class to every Studio main region. The unchanged 24-member content-workspace set still identifies editorial work; only a known view outside that set receives the operations layout class. This preserves the Phase 5 editorial compositions while extending native control styles to the 13 operational/admin bodies. Existing sidebar, breadcrumb, module routing and authorization branches remain. |
| Form and action vocabulary | Shared fields retain 46px minimum height, 16px type, obsidian fill, 4px corners and visible control borders. Shared actions retain 44px minimum height, 4px corners, sapphire selection and the 3px champagne focus outline with 4px offset. The 20px checkbox treatment remains a local control dimension; it is not evidence that every rendered target measures 44px. Sign-in fields and its primary action use 48px minima. |
| Overview | Attention links become two-column ruled rows with counts, then one column at 700px. Recent-record and stage regions use `minmax(0,1.7fr) minmax(270px,1fr)` and stack at the 950px workspace container query. Stage tracks become thin, square champagne marks. Workspace links become ruled rows with restrained icons. These remain operational counts and links; the original distinction from completion scores and publication readiness remains in copy. |
| Inquiry list and board | Generic operational tables have a 580px minimum; the inquiry list has a 960px minimum with wider identity/action columns inside existing scroll regions. The board uses eight `minmax(285px,1fr)` columns with 18px gaps. Obsidian columns and ocean cards have 6px/4px corners and no resting shadow or transform. At 700px the board uses the existing selected-stage mobile structure and hides drag grips. Native stage controls and current move/open handlers remain. |
| Board icons | Copy, grip, reference and urgent glyphs use Lucide icons from the existing dependency. Copy gains an explicit accessible label; decorative SVGs are hidden from accessibility APIs. Clipboard, drag and stage handlers are retained. Icon replacement does not imply that communication is sent automatically. |
| Administration | Staff identity/actions use a three-column row, changing to two action columns below a full-width identity at 700px. Metrics become ruled two-column groups and stack on mobile. Route decisions and notes use rules and spacing. Analytics, settings, privacy, cleanup, staff and navigation receive scoped presentation hooks; their inspected code normalizes exactly to the base after those attributes are removed. |
| Dialogs and saved source | General operational dialogs use a 760px cap; inquiry detail uses 1080px, both constrained by viewport width. At 700px they use `calc(100vw - 24px)`, 18px padding and a stacked header with a separate close action. Original-source text wraps in its preserved block; section anchors and deliberate contact links remain visible structures. The inherited 8px dialog corners and `0 24px 72px #0008` shadow remain overlay treatments. |
| Access surface | Sign-in uses obsidian surroundings, a flat ocean form with a 520px maximum width, 6px corners and native validation controls. At 540px padding and title size reduce. Existing login action, pending state, setup/unavailable copy and password-visibility interaction remain; only the logo and scoped class are added in the inspected component delta. |
| Saved inquiry card | The private record uses a 900px maximum ivory page, body-font headings and 180px label column; facts stack at 540px. Print removes the toolbar through retained rules, uses white paper, 11pt body, 22pt title, 10mm card padding and a 42mm label column. Original saved-brief facts, limitations and account-scoped database query remain. This is a document variant within the existing palette, not a new public identity. |
| Motion and depth | Shared Studio actions retain short 160ms color/border transitions and reduced-motion cancellation. Phase 6 adds no animation runtime, parallax or scroll wrapper. Board drag/hover states use borders without scale transforms; operational grouping uses surfaces, rules and spacing. This remains consistent with native task completion and the Phase 5 Operate direction. |

## Review, preservation and evidence limits

The supplied [independent review](PHASE-6-INDEPENDENT-REVIEW.md) records **disposition: ship** after a fresh full finish review of the corrected packet. The reviewer opened all 27 required images. The replacement mobile Closed-stage image shows the document top, fictional-training disclosure, selected Closed stage and all three Closed records. This is a full review after corrected evidence, not merely a fix-list scoring verdict. The reviewer reported no material fixes in the inspected local scope.

This documenter did not reopen those images, run a browser, rerun builds/tests or mutate data. Rendered judgments belong to that independent review. Its explicit limits remain: nested navigation scroll contents, offscreen analytics columns, the full desktop board and lower inquiry-dialog sections are not all exposed by initial-position screenshots. Source geometry and supporting functional receipts are separate from visual inspection of those regions.

The [builder review](PHASE-6-REVIEW.md) reports 195 responsive/preservation checks, 58 state assertions, 59 preview/confirmation assertions, 21 local lifecycle/permission assertions and 26 recapture/gallery assertions; it also reports all 37 module openings, 600 computed contrast samples, final build/types, six existing lint warnings and 344 unit/403 HTTP runtime passes. Those results were not independently rerun here. The original unit/runtime checks preceded the final CSS-only correction; the report states final build/preview evidence covers it.

The read [preservation receipt](phase6-preservation.json) records **all 1,646 original rows unchanged across 13 isolated local QA scopes**, plus 11 disclosed additions: one fictional order, eight stage events, its privacy row and one temporary editor retained disabled. The order ends Closed at version 8; the editor ends inactive at version 2. Session, audit and rate-limit bookkeeping are outside the inventory. This is not a production-data snapshot.

The separate 24-record training set is browser-fixture evidence and was not imported over Studio records. It is distinct from the single persisted synthetic lifecycle order. The reported staff/cleanup/export confirmation checks cancel before original access changes, erasure or private downloads. This pass performed no data, messaging, permission, export, publication or production action.

The context/detector launcher remains recorded as unavailable with `The system cannot find the batch label specified - cache_directory_failed`; unavailable is not passed. Browser emulation and source inspection do not certify physical phones, actual browser zoom, screen readers, independent language/factual/media-rights review, field performance or genuine customer/business acceptance. Historical administrative closures remain historical.

## Preserved drift and handoff

PRODUCT.md still says Phase 2-only approval and disconnected foundation work. Phase 3 DESIGN.md and its sidecar are scoped to the homepage/shared public frame and retain then-pending later-phase gates. The Phase 5 direction and documentation retain their then-pending Phase 6 gate. The current Phase 6 direction records the subsequent explicit authorization. The builder has deliberately updated AGENTS.md and CONTINUE.md to Phase 6 ready for owner review, with the old Phase 5 checkpoint now historical; their current gate is Phase 7. None of these files was rewritten by this documenter, and scoped public authority has not been promoted into global Studio authority.

The historical Phase 3 `--hairline` finding remains historical. This comparison does not establish a new global search or repair of that variable. Explicit Studio separators do not constitute a global drift repair.

Examined CSS SHA-256 values pin this comparison to the inspected candidate:

| File under `src/components/studio/` | SHA-256 |
| --- | --- |
| `studio-operations.module.css` | `40C285F25790039047346E4040E5DAA29CC0BBAC2E0A61642E84C3F5DE0D33EC` |
| `studio-access.module.css` | `AF8416330B1CC35C9732068BD80908FBD2D95A736E8DD84B8BE4D52A3E5148B9` |
| `studio-editing.module.css` | `A6C1A3895CF8DA52BC1E6701EC4F7087C18FCB02599A43D741E2866E41180444` |
| `overview.module.css` | `6F6B96D8A6DCE2CAC7D0382262E5F674D8B0FE0571EC19460CA38835C0D53E24` |
| `inquiry-card.module.css` | `08667A7A02C0E2A5BA81E01B68FBCB68953DAA8C51357CCD56D8001EC2C9D137` |

This report is the documenter's sole authored file. Later implementation changes require a targeted comparison recheck. **Stop before Phase 7 pending owner preview approval.** This documentary compatibility verdict supports presenting the local Phase 6 preview; it authorizes no push, PR, deployment, production publication, later-phase implementation or excluded scraper/import/backup work.
