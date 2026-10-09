# Current checkpoint — M9 drafts delivered; stop before M10

9 October 2026. All 480 new English drafts are authored, saved in isolated local Studio in 48 ten-entry batches, and delivered to the dedicated Drive folder: 120 Journal, 120 labelled Portfolio concepts, 120 labelled fictional Testimonial examples and 120 FAQs. Production remains 0/480. Read `M9-EDITORIAL-DRAFT-PRODUCTION.md`, `m9-evidence.json` and `PENDING-AFTER-M9.md` under `docs/redesign/old-design-migration-2026-10-08/`. Build/type/lint, 337 unit, 403 built-server, 480 saved-render checks and 34 core Drive hash readbacks pass. Every pre-M9 row in all 13 protected scopes is unchanged. Human editorial, rights/crop, native-reader, physical-device and publication approvals remain open. Stop before M10. No push, release or production writes. Do not re-import existing M9 IDs or copy local QA media publication into production.

---

# Current authorization — M9 draft production and staging

9 October 2026. The owner explicitly authorized M9. Read `docs/decisions/2026-10-09-m9.md`. Produce the new editorial drafts and media in ten-entry batches, stage additively in isolated local Studio and copy the delivery to a dedicated Drive folder. Preserve all pre-M9 records and Drive originals. Stop before M10. No push/release/production publication. Actual human/native/media-owner approvals remain distinct from assistant review. Earlier stops before M9 below are superseded for this phase only.

---

# Current checkpoint — M7 and M8 verified locally; stop before M9

9 October 2026. The owner-authorized M7 and M8 are complete for their documented local engineering scopes. Read `M7-ORDERS-AND-EDITORIAL-ORDERING.md`, `M8-EDITORIAL-WORKFLOW.md`, `m8-evidence.json` and `PENDING-AFTER-M8.md` in this migration directory. M7 is commit `467e157`; M8 is the commit containing this checkpoint. Final M8 build/type/lint, 333 unit, 403 built-server and five workflow groups pass. All 13 pre-M8 protected scopes match row-for-row. M5–M8 remain local; production editorial remains 0/480. Stop before M9. No push, release or production writes until an applicable owner instruction. Human/native-reader/physical-device/field/full-parity acceptance remains open. Historical checkpoints below do not authorize further phases.

---

# M7 checkpoint — verified locally; M8 authorized next

9 October 2026. M7 is complete for its recorded engineering scope. Read `M7-ORDERS-AND-EDITORIAL-ORDERING.md` and `m7-evidence.json` in this migration directory. All 13 pre-M7 protected scopes match. Continue with authorized M8, then stop before M9. Local only; no release or production writes.

---

# Current authorization — M7 then M8 locally

9 October 2026. The owner explicitly requested M7 and M8. Complete and verify M7 before M8; stop before M9. No push, release or production writes are authorized. Preserve existing records and test additively only in the existing loopback QA database. Read `docs/decisions/2026-10-09-m7-m8.md`. Earlier stops before M7 are superseded for these two phases.

---

# Implementation checkpoint — 9 October 2026

**Current: M5 and M6 verified locally; STOP before M7.** The owner explicitly authorized these two phases only. M5 is saved at `edd8347`; M6 is the following local checkpoint. Read `M5-PUBLIC-JOURNEYS.md`, `M6-STUDIO-WORKSPACES.md`, `m6-evidence.json`, `m6-studio-dispositions.json` and `PENDING-AFTER-M6.md`. Final M6 checks: build/type/lint, 326 unit, 403 built-server and five workflow groups pass. All 13 original/pre-M6 protected scopes match. M5/M6 are not deployed; new production editorial remains 0/480. M7 requires explicit permission. The following previous checkpoints are historical.

**Production setup is complete; stop before M5.** PR #46 is merged at `6605b1b19283f7725eee1bc1639cc277556428bf`; its existing production application now serves Studio presentation revision 2. Two additive tables, narrow grants, fresh saved previews and deliberate publication are verified. Homepage images/video and all seven enabled page layouts are live; all 13 original protected scopes match their pre-activation counts and digests. Read `PRODUCTION-SETUP.md` for the exact evidence and limitations. No new application deployment or editorial production was needed. M5 still requires explicit permission.

**M0–M4 are verified for their recorded local engineering scopes. M5–M11 remain unfinished. M5 has not started and requires the owner's explicit permission.** The latest phase-by-phase instruction supersedes automatic progression through the original plan; see `docs/decisions/2026-10-09-phase-permission-and-media.md`. The subsequent owner request authorizes releasing the completed M0–M4 candidate through a detailed PR into main; see `RELEASE-M0-M4.md` for release scope and production activation limits.

Branch: `codex/old-design-migration`, based on main `afba59f6adf6d3cdcc168f0d784d093a4cb4a294`. Old reference: `2dd6d5de34acf3f98e611eda2e1b858ebd0da8e6`. Both remote main revisions and their READY production deployments were verified read-only. The original checkout was on main with only the cancelled audit untracked. That file was not copied, staged, changed or deleted.

## Completed M0

- Captured private protected IDs, publication identities and row hashes across 13 scopes. All local and live before/after comparisons match.
- Created a separate local branch/checkout and a dedicated loopback database containing current public source fixtures only.
- Added a guarded local application runner, remote SQL refusal and read-only transaction checks. The two guard tests, transport checks, changed-tooling lint and production build/type validation pass.
- Captured ten local screenshots, twenty cold/warm samples and three keyboard navigation flows at 1440×1000 and 390×844. No body overflow or browser errors occurred. Studio desktop CLS about 0.112 is an open baseline defect.
- Captured twelve anonymous old/current public reference screenshots at the same viewports. These are opening-viewport samples, not full-page acceptance.
- Recorded data, asset, rights and conditional-service ownership in `OWNERSHIP-AND-ISOLATION.md`.

See `m0-evidence.json`. Screenshots and private evidence remain in ignored `test-results/old-design-migration/`.

## Completed M1 source contracts

`source-reconciliation.json` compares the supplied registers against the actual old checkout. It confirms all 85 page templates (25 public/utility, 60 Studio), 74 sections, 18 home sections, 16 landing block types, 32 intended Studio destinations, 60 tickets, 111 Drive candidates and four groups of 120 editorial candidates. A read-only TypeScript trace follows 635 source files, their imports, inherited layouts and conditional expressions.

The only unresolved import names are the old generated Prisma client and enum modules. They are backend dependencies to replace with current services, not dependencies to generate or port. The trace never executes old modules. Source discovery does not mean their visual, default, conditional, permission or recovery states have passed.

`implementation-contracts.json` now supplies all 85 route/record contracts, 74 section bindings, 16 landing-block contracts, 12 shared interaction states and 32 planned Studio destinations. Current production APIs, rather than fixture adapters, own persistence. All 85 before/target acceptance sheets are prepared in `PARITY-ACCEPTANCE-SHEETS.html`; target captures remain explicitly unperformed. Read `M1-CONTRACT-REVIEW.md` for source/specification scope and deferred rendered acceptance.

## Completed M2 shared frames

The old blue/ivory/champagne palette, local Inter fonts, public header/footer/section rail and five Studio navigation groups now use current functionality. Sidebar collapse persists; all 16 existing destinations and former search terms remain available. Studio loading reserves stage-card space. Mobile controls retain accessible labels and the small Studio wordmark uses Inter after screenshot review caught a nonpainting Instrument glyph run.

The final candidate passes a production build/type validation, 298 unit tests, 22 frame checks, 20 cold/warm browser samples, ten route screenshots and three keyboard flows. No body overflow or browser errors occurred. All 13 protected local scopes still match baseline. Fourteen semantic contrast pairs and converted font metrics pass. Desktop Studio sample CLS is about 0.009, down from the M0 sample of 0.112; these are local unthrottled samples, not field evidence. See `M2-SHARED-FRAMES.md`, `m2-fonts.json` and `m2-evidence.json`. Full-page contrast/parity and human/device acceptance remain open.

## Completed M3 homepage design workflow

The separate presentation record, additive schema, `/studio/sections` editor and exact saved desktop/mobile preview now work through current authentication and public rendering. All 17 workflow checks and 301 unit tests pass, with production build/type validation and changed-source lint. All 13 protected local scopes still match. See `M3-PRESENTATION-WORKFLOW.md` and `m3-evidence.json` for the failure simulations, iframe fix, recovery and limits. The new schema exists only in isolated local QA. The original records and live database are unchanged.

## Completed M4 local engineering scope

Read `M4-PAGE-TEMPLATES.md`, `m4-evidence.json` and `m4-media-evidence.json`. All 18 home slots, seven current page designs, a private seven-slot workshop structure, shared page editing and labelled material film are implemented. Studio saves exact snapshots, previews pages/locale/mobile frames, publishes deliberately, verifies actual public revision and restores earlier layouts as new drafts. Commission filtering retains the saved preview identity. Video waits for Play; fresh sessions verify format recovery and a still-image fallback.

The final candidate passes 311 unit tests, 42 workflow checks, production build/type validation, changed-source lint and scoped screenshot review. All 13 original protected local scopes match M0. These are engineering checks on source fixtures, not full 85-template visual parity or human acceptance. Furniture/Rooms remain distinct/default-off. Making/material bindings and conditional service templates do not invent factual evidence. Public workshop availability remains unconfirmed and its route stays 410.

## Earliest unfinished work — permission required

M5 is next in dependency order. Do not start it until the owner explicitly authorizes M5. Preserve this checkout, the dedicated loopback database and presentation history; do not restart M0 or re-seed records. After approval, continue the five M5 tickets in the existing combined plan and registers. Require fresh permission again at every subsequent phase boundary.

## Content and external evidence

| Section | Planned | New records created | Approved | Published |
| --- | ---: | ---: | ---: | ---: |
| Journal | 120 | 0 | 0 | 0 |
| Portfolio | 120 labelled concepts or evidenced projects | 0 | 0 | 0 |
| Testimonials | 120 labelled fictional samples or evidenced feedback | 0 | 0 | 0 |
| FAQs | 120 | 0 | 0 | 0 |

The owner explicitly selected labelled concepts and fictional samples on 9 October; see `docs/decisions/2026-10-09-labelled-editorial-content.md`. The original genuine-only plan is superseded for these new clearly labelled entries. Matching new copies are requested in Drive and Studio. M4 delivered one MP4 derivative to Drive and verified matching existing WebM/poster files; the local Studio presentation stores their metadata and references. That one material film is not an editorial-production entry. All 480 requested new content records remain outstanding. No genuine source pack or consent was inferred from intake slots or Drive images. Native-reader, human screen-reader, physical-phone, field-performance and genuine-inquiry checks remain open.

Release scope: PR #46 records the exact head, checked merge and deployment results. The subsequent owner-authorized production setup is now complete, as recorded above and in `PRODUCTION-SETUP.md`. The earlier phase paragraphs retain their historical local evidence scope. Local QA records/history must never be transferred. No product transfer, scraper run, backup work or customer message is authorized. Read `PENDING-AFTER-M4.md` before continuing.
