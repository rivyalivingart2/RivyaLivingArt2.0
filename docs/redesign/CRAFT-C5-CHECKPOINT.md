# C5 acceptance update — 5 October 2026

**Permission, error-handling and publishing/recovery acceptance is complete in isolated QA.** Source `0c5dfc5` is saved locally on `codex/c5-acceptance`. See [the current acceptance report](CRAFT-C5-ACCEPTANCE.md) and `craft-c5-acceptance-evidence.json` for exact scope, final checks, cleanup and protection evidence.

All six C5 engineering rows are accepted. All 16 modules pass automated viewport/keyboard checks and 200% CSS page zoom. Human screen-reader, physical-phone and native-browser-zoom certification remain in C6 alongside performance. C6 has not been started. Nothing from this acceptance pass was pushed or deployed; protected facts and existing records are unchanged.

The record below is the historical 3 October presentation receipt, superseded by this update for C5 status. Backup-related gates remain removed by owner.

---

> Owner scope change, 5 October 2026: the project backup feature, scheduled archive jobs, archive-key custody tasks and backup/RPO/RTO acceptance gates are removed. Any earlier instruction below to run, verify, schedule or require them is historical and superseded. Existing archives/keys were not deleted. Studio draft/revision recovery and privacy-erasure safeguards remain. See the 2026-10-05 removal decision.

# C5 — Studio presentation and scoped verification

3 October 2026. Continues C4 commit `a35cb48` on `codex/craft-visual-improvements`. **The presentation pass is implemented. Full C5 acceptance remains open.** Local work only; no push, PR, deployment or production write.

## Changes

The C1 overview direction now reaches all 16 current Studio modules through shared surfaces, readable typography, restrained teal selection, bronze focus, consistent panels, lists, form controls, dialogs and table spacing. The old Studio's detailed sections and operational controls remain. The Bionis/Medesk/Gridline references inform hierarchy and density; previously recorded notices remain in `CRAFT-THIRD-PARTY-NOTICES.md`. No registry installer, package addition, new analytics or fabricated dashboard metric was introduced.

Inquiry search and stage are immediately visible, with the other filters inside a keyboard-operated native disclosure. Applied chips and received-date presets stay outside it; all controls remain in the same form, using the same URL/filter service. Selected advanced filters open the disclosure. Shared table stage labels are textual, not color-only. Board semantics and stage changes still wait for the existing service.

Record status is now a labelled definition list separating record identity, saved revision, publication and editing state. Unsaved work has a distinct labelled state. Product editor tabs use shared CSS, arrow keys, Home/End, roving focus and named, focusable panels. Media cards retain max-content rows and contained images, with an explicit pressed state for selection. Existing independent page crops, saved-preview links, protected default catalogue review and read-only business settings remain.

## Verified scope

- TypeScript, changed-component lint and the final optimized build passed. 281 unit tests, 12 preflight tests and 403 built-server checks passed. The final keyboard repair was also checked in-browser and by the final typecheck/lint/build/runtime run.
- Fifteen focused browser checks cover combined inquiry filtering, applied chips, Back, phone board selection, unsaved IST-date control, content switch cancellation and draft-copy/reload, protected products, repaired tab keys, conditional form preview, selected media, read-only business contacts and separate crop previews.
- Thirty-two body-reflow observations cover all 16 registered modules at 390 and 1440 CSS pixels, without horizontal body overflow. This is not a complete per-field accessibility or loaded-data test. Selected settled desktop/phone screenshots are included in the review; intermediate/loading captures do not count as workflow evidence.
- Eighteen read-only service assertions passed: authenticated access and anonymous denial for seven Studio endpoints; three invalid inquiry filters rejected; complete before/after record comparison.
- All 120 products and forms, 136 media records/associations, business settings, all 64 content entries, inquiries and manual orders match the starting QA baseline. No content/product/customer record was saved, published, restored, imported or deleted. Temporary unsaved UI values were discarded or reloaded from their existing saved record.

An initial read verification encountered one 503. The complete repeat passed. This does not demonstrate sustained service reliability. The browser controller could not reliably exercise the native dirty-inquiry close dialog; that attempted check is not a pass. Content's in-app switch dialog and explicit reload were checked instead. No customer message, export, access change or credential change occurred.

Evidence: `craft-c5-validation.json`, `craft-c5-browser-verification.json`, `craft-c5-service-verification.json`, `craft-c5-module-acceptance.csv`. Screenshots/review are in workspace `outputs/CRAFT/c5-implementation.html`.

## Remaining acceptance and next work

All six C5 rows are **PRESENTATION + SCOPED QA VERIFIED; FULL ACCEPTANCE OPEN**. Before closing C5, execute the complete role/permission matrix, initial failure and stale-refresh behavior, dirty inquiry navigation, simulated 409/401 retention, real saved-preview/publish/revision-recovery cycles in isolated QA, mobile keyboard coverage and 200% zoom. Existing historical tests are not a substitute for this new visual acceptance. No production or private-data mutation is authorized by the presentation receipt.

Then continue C6 performance and wider release acceptance. C2 optional video remains deferred. C4-05 production Imprint's last recorded result is 404 in the C4 receipt; it was not rechecked or published in C5. Human screen-reader and physical-phone checks, independent recovery-key custody, sustained daily-backup history and production editorial acceptance remain open. Do not present these as completed by automation.

Keep changes local until the next explicit push-main request, then provide a detailed PR. Preserve the RivyaLivingArt2.0 base, products/forms/galleries, business/social facts, scraper behavior, inquiry history, drafts and manual-send controls.
