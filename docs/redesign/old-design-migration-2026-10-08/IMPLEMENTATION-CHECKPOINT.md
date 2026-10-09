# Local implementation checkpoint — 9 October 2026

**M0 baseline/isolation, M1 source contracts and M2 shared frames are verified for their recorded scopes. M3 is next. M3–M11 remain unfinished.** Continue the existing authorization; do not repeat the planning/release permission discussion.

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

## Earliest unfinished work

Start M3's complete presentation-only homepage save → actual saved preview → isolated publication → public readback → restore-to-draft flow. Use a new additive presentation record and revision store so existing content, products, crops and history remain unchanged. Verify permission, stale-version, dependency and recovery states before marking this phase complete. Then proceed through the remaining phases in dependency order.

## Content and external evidence

| Section | Planned | New records created | Approved | Published |
| --- | ---: | ---: | ---: | ---: |
| Journal | 120 | 0 | 0 | 0 |
| Portfolio | 120 labelled concepts or evidenced projects | 0 | 0 | 0 |
| Testimonials | 120 labelled fictional samples or evidenced feedback | 0 | 0 | 0 |
| FAQs | 120 | 0 | 0 | 0 |

The owner explicitly selected labelled concepts and fictional samples on 9 October; see `docs/decisions/2026-10-09-labelled-editorial-content.md`. The original genuine-only plan is superseded for these new clearly labelled entries. Matching new copies are requested in Drive and Studio; no files or new records have yet been delivered. No genuine source pack or consent was inferred from intake slots or Drive images. Native-reader, human screen-reader, physical-phone, field-performance and genuine-inquiry checks remain open. Do not count source fixtures or assistant review as that evidence.

Release state: local only. No push, PR, merge, deployment, production data migration, product transfer, scraper run, customer message or production content publication.
