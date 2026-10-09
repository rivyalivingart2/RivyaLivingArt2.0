# Local implementation checkpoint — 9 October 2026

**M0 baseline/isolation, M1 source contracts, M2 shared frames and M3 homepage design workflow are verified for their recorded scopes. M4 is next. M4–M11 remain unfinished.** Continue the existing authorization; do not repeat the planning/release permission discussion.

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

## Earliest unfinished work

Start M4-01: expand the accepted presentation pattern to all 18 homepage sections in source order. Furniture and Rooms stay distinct/default-off; Portfolio concepts and fictional Testimonial samples require their explicit labels; workshop/printing business claims remain evidence-gated. Then complete M4 story/process/commission/contact structures and shared section editing before the dependent M5–M10 phases. Existing wording, selections and stored media usage remain frozen. Unbound source slots are not permission to invent business facts.

## Content and external evidence

| Section | Planned | New records created | Approved | Published |
| --- | ---: | ---: | ---: | ---: |
| Journal | 120 | 0 | 0 | 0 |
| Portfolio | 120 labelled concepts or evidenced projects | 0 | 0 | 0 |
| Testimonials | 120 labelled fictional samples or evidenced feedback | 0 | 0 | 0 |
| FAQs | 120 | 0 | 0 | 0 |

The owner explicitly selected labelled concepts and fictional samples on 9 October; see `docs/decisions/2026-10-09-labelled-editorial-content.md`. The original genuine-only plan is superseded for these new clearly labelled entries. Matching new copies are requested in Drive and Studio; no files or new records have yet been delivered. No genuine source pack or consent was inferred from intake slots or Drive images. Native-reader, human screen-reader, physical-phone, field-performance and genuine-inquiry checks remain open. Do not count source fixtures or assistant review as that evidence.

Release state: local only. No push, PR, merge, deployment, production data migration, product transfer, scraper run, customer message or production content publication.
