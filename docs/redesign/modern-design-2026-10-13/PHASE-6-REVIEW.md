# Phase 6 — Studio operations and administration

The owner approved Phase 5 and authorized Phase 6 only. All 13 remaining operational/admin module bodies now extend the approved Studio design locally. The original logo, main colours, content and workflow rules remain intact. Review the gallery before authorizing Phase 7. Nothing has been pushed or deployed.

## Result

Overview attention queues and recent records use compact, readable rows. Inquiry lists, eight-stage boards and saved record dialogs share the approved obsidian/ocean palette, ivory text, champagne details and native controls. Staff, settings, navigation and analytics use consistent spacing and headings. Sign-in and private printable inquiry cards retain their existing data and access rules, with the original logo added deliberately.

The 13 modules are overview, inquiries/orders, follow-ups, navigation/languages, legacy decisions, old links/publication, activity/logs, staff, atelier settings, analytics, import, exports and subscribers. The Phase 5 shared control styling now extends to these bodies, with additional operational CSS scoped separately. All 37 module entries continue to open. Existing content-editing layouts remain under their Phase 5 scope.

Native scrolling, clear focus and short colour transitions support task completion. No decorative parallax, new observers, dependencies, schema, API, authentication or status logic were added. Inquiry/order ordering and separate editorial display ordering retain their existing contracts. No public page or media asset was replaced.

## Previews

- Gallery: http://127.0.0.1:4183/review
- Actual local Studio: http://127.0.0.1:4199/studio (QA administrator session required)
- Restart instructions: `experiments/redesign-phase6/README.md`
- Full-page desktop/mobile evidence: `output/playwright/redesign-phase6/{1440,390}-full-{overview,inquiries,staff,settings,navigation,analytics,exports}.png`
- Other captures cover saved inquiry detail, manual-order review, staff/cleanup confirmations, filtered empty lists, errors, sign-in, printable cards and all eight training stages.

The 24 existing fictional training examples appear only through an intercepted local browser response and carry an explicit disclosure. They are not imported into Studio records. A separate single synthetic order supplies actual persisted lifecycle evidence. The initial reviewer rejected a Closed-stage image that stopped above the cards; it was replaced by a full-page capture showing the selector and all three fictional Closed cards. No application change was required for that recapture.

## Verification

| Evidence | Result and boundary |
| --- | --- |
| Final Next production build / TypeScript | Pass |
| Application lint | Zero errors; six existing warnings in order-board navigation and inquiry/reference image markup |
| Phase 6 tool lint | Pass |
| Existing unit / HTTP runtime tests | 344 / 403 pass |
| Operational baseline / responsive comparison | 195 checks; 13 modules at 1440/768/390/320, unchanged original desktop headings/text/links |
| Module/state/contrast checks | 58 assertions, all 37 entries open, 600 computed text-contrast samples, simulated error/session feedback and reduced-motion checks |
| Final preview and confirmation checks | 59 assertions; 33 captures, original-brief preservation, unsaved cancellation, required fields, review dialogs, print and labelled training stages |
| Actual local workflow / permissions | 21 assertions; one new fictional order through eight stages, explicit closure reason, stale update rejected, eight history events, real editor sign-in, admin API/page denials, temporary account disabled |
| Reviewer recapture / gallery | 26 assertions; visible Closed stage/cards, gallery image decoding and links, desktop/mobile overflow and print-PDF response |
| Protected local records | All 1,646 original rows unchanged across 13 scopes; 11 known synthetic additions only |

Baseline text comparison excludes transient status/live publication timestamps and was completed before creating the new QA order/account. Per-record preservation was checked after those writes. The final CSS corrections were a stacked mobile dialog header and a queue label font adjustment; final build and preview evidence cover them. Unit/runtime checks preceded that CSS-only batch. React review retained existing state, lazy boundaries, effects, fetch/save and permissions; source changes are presentation hooks, scoped classes, logo and icon rendering.

All communications remain deliberate existing links; testing did not follow/send them. Staff/cleanup/export confirmation tests cancelled before saving, erasing or downloading private data. The actual permission check created only a new isolated QA editor and disabled it afterward. Testing never changed an original staff account. Error and expired-session specimens were explicitly intercepted/simulated, not proof of an actual expired production session.

## Preservation

Per-ID digests match for all 1,646 original rows in catalogue, content, public media, business settings, revisions, inquiries, orders, events, notes, references, staff, privacy and erasure scopes. Additions: one explicitly fictional order, eight events, its privacy row and one temporary editor retained disabled. The order ends Closed at version 8; the editor ends inactive at version 2. Their safe identifiers are in `phase6-preservation.json`. Normal session, audit and rate-limit bookkeeping is outside this inventory.

No original product, content, contact, translation, draft, revision, association, crop, privacy record or order was changed. Original public/logo/media files, data models, API code and dependencies remain unchanged. No Drive or production database action occurred. The local inventory is not a fresh production-data audit.

## Review and boundaries

Read `PHASE-6-INDEPENDENT-REVIEW.md` for the final independent disposition and its inspected scope; `PHASE-6-DESIGN-DOCUMENTATION.md` records comparison with the incumbent design authority. Nested navigation scrolling and offscreen analytics columns are not certified by their initial-position screenshots alone. The Impeccable context/detector launcher is unavailable with the Windows `cache_directory_failed` error; no detector pass is claimed.

No new physical-phone, actual browser-zoom, screen-reader, independent-language, factual/media-permission or field-performance certification is claimed. Historical owner administrative acceptance remains historical. No review or translation flags were changed.

**Stop before Phase 7.** Owner preview approval is the next gate. Phase 7 will verify the complete redesign and prepare the final candidate. Push/release still requires explicit authorization, a detailed PR into main and verification of the exact deployment. Scrapers, old-product transfers and backups remain excluded.
