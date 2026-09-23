# Phase 8 — Public pages and corrected copy

23 September 2026. Master revision 3.9. **Source checkpoint complete; policy particulars, durable publication and formal QA remain gated.** Next independent task: **P9.1**.

The phase continues merged main 630521de2f228d2fe935585e12e4639e98da8839 (PR #22) on codex/phase-8-public-content. It preserves the 120 products, 36 articles, all original document routes/IDs/section IDs, existing drafts, approved image bytes and historical publication candidate. No database connection, migration, content write, staff action, reference upload, cleanup, production deployment or message send was performed.

## Task results

| Task | Result | Evidence |
|---|---|---|
| P8.1 | Contextual page navigation and next actions; deliberate page descriptions/images; architects brief guidance; contact uses phone/email and a separate saved-order entry; FAQ expands from 7 active questions to 12 | editorial.tsx, shop-editorial.ts, content-model.ts |
| P8.2 | All 36 articles reviewed paragraph by paragraph. Fifteen receive copy corrections; 21 retain their approved wording. All IDs/slugs/sections/media associations retained; image hashes match the approved manifest | reviewed-journal.json; phase-8-content.json |
| P8.3 | No substantiated real projects exist. Portfolio list and detail consistently require approvalRecord; empty list is truthful, absent detail remains 404. No fictional studies promoted | project-model.ts, portfolio routes |
| P8.4 | Privacy explains actual guest cookie/receipt, scoped private storage, manual cleanup eligibility, lack of automatic submitted-data deletion and contact requests. Terms/delivery/changes remain individualized, with no invented deadlines, fees, guarantees or exclusions. Accessibility describes intentions and incomplete evaluation | shop-editorial.ts; policy matrix below |
| P8.5 | Published-target-only article redirects, permanent product aliases, canonical commission page, host-precedence indexing policy, current metadata/images, deduplicated sitemap and private/custom-form exclusions; factual Website/Organization/Product/Article/WebPage/Breadcrumb structured data | site-metadata.ts, sitemap.ts, robots.ts, structured-data.tsx |
| P8.6 | Eighteen form-bearing source files classified. Active public forms are customization and GET search/filter controls. General contact has no form or WhatsApp handoff | phase-8-content.json forms |
| P8.7 | Editorial loading views, honest journal/project empties, existing retry/404/expired-receipt recovery retained; obsolete fixture frame removed from unavailable public routes; shared-data/production visual-fixture guard retained | reading-loading.tsx, loading routes, application-frame.tsx, build-state.tsx, public-website.ts |

Filenames without folders above resolve under src/components/shop, src/lib or src/app as appropriate. Full path lists are in phase-8-content.json and the Git diff.

## Page and policy disposition

| ID | Route | Disposition |
|---|---|---|
| page:process | /process | Source ready; deliberate Studio publication and final QA still required |
| page:our-story | /our-story | Source ready; deliberate Studio publication and final QA still required |
| page:privacy | /privacy | Factual draft ready; missing retention/fulfilment particulars remain a publication gate |
| page:terms | /terms | Factual draft ready; missing retention/fulfilment particulars remain a publication gate |
| page:shipping-delivery | /shipping-delivery | Factual draft ready; missing retention/fulfilment particulars remain a publication gate |
| page:returns-cancellations | /returns-cancellations | Factual draft ready; missing retention/fulfilment particulars remain a publication gate |
| page:accessibility | /accessibility | Source ready; deliberate Studio publication and final QA still required |
| page:architects | /architects | Source ready; deliberate Studio publication and final QA still required |
| page:contact | /contact | Source ready; deliberate Studio publication and final QA still required |
| page:materials-care | /materials-care | Source ready; deliberate Studio publication and final QA still required |
| page:faq | /faq | Source ready; deliberate Studio publication and final QA still required |

Privacy, terms, delivery and changes text is a factual draft rather than a claim that business or legal readiness is closed. Submitted inquiries/references have no implemented automatic deletion deadline; unsubmitted references become eligible for explicit administrator cleanup after 24 hours. Guest receipt expiry does not delete saved records or backups. Confirm submitted-data retention, request responsibility, backup retention/deletion procedure, business particulars and any delivery/installation/cancellation rules before production publication. The owner was asked once for the specific missing operating facts; no answer was presumed.

Accessibility evaluation is explicitly incomplete. Do not publish a conformance or successful-device-test claim until Phase 11 evidence exists. Statement structure was checked against [W3C guidance](https://www.w3.org/WAI/planning/statements/); this is not a conformance assessment. WhatsApp remains a separate service with its own [privacy policy](https://www.whatsapp.com/legal/privacy-policy), consulted 23 September 2026. No business policy has been inferred from WhatsApp's terms.

## Article review matrix

All rows retain their original content ID, route and section identities. Images are approved design visualizations, not evidence of completed work. Counts and SHA-256 values are in phase-8-content.json. Rendered crop/visual suitability remains P9/P11.

| ID | Article | Words including headings/intro | Copy disposition |
|---|---|---|---|
| DB001 | A Room Begins with a Statement Table | 628 | Reviewed; preserved |
| DB002 | Reading the Grain: Wood and Resin in a Shared Composition | 703 | Corrected; reviewed source proposal |
| DB003 | Round, Oval or Rectangular: A Dining-Table Planning Notebook | 673 | Reviewed; preserved |
| DB004 | Coffee Tables as Sculptural Objects | 714 | Reviewed; preserved |
| DB005 | The Quiet Role of a Side Table | 643 | Reviewed; preserved |
| DB006 | An Entryway Built Around One Console | 650 | Reviewed; preserved |
| DB007 | Pairing Resin Art with Warm Neutral Interiors | 717 | Corrected; reviewed source proposal |
| DB008 | A Guide to Describing Your Commission | 581 | Reviewed; preserved |
| DB009 | What to Include in an Architect’s Enquiry | 575 | Reviewed; preserved |
| DB010 | Wall Art at Architectural Scale | 720 | Reviewed; preserved |
| DB011 | From a Mood Board to a Material Conversation | 730 | Corrected; reviewed source proposal |
| DB012 | Light, Transparency and the Look of Resin | 662 | Corrected; reviewed source proposal |
| DB013 | Chairs, Benches and the Shape of a Room | 449 | Reviewed; preserved |
| DB014 | Planning a Large Piece for Delivery Access | 422 | Corrected; reviewed source proposal |
| DB015 | Why a Visualization Is Not a Final Specification | 426 | Corrected; reviewed source proposal |
| DB016 | A Home Office with a Material Focal Point | 532 | Reviewed; preserved |
| DB017 | A Small Vocabulary of Finishes and Forms | 555 | Corrected; reviewed source proposal |
| DB018 | The Project Story Behind a Collectible Interior | 273 | Reviewed; preserved |
| DB019 | Turning a Wedding Memory into a Design Brief | 285 | Corrected; reviewed source proposal |
| DB020 | Choosing a Format for a Bouquet Keepsake | 448 | Reviewed; preserved |
| DB021 | Names and Dates: A Personalization Proofreading Checklist | 429 | Reviewed; preserved |
| DB022 | Designing a Wedding-Invitation Keepsake | 314 | Reviewed; preserved |
| DB023 | A Preservation Clock as a Memory Object | 324 | Reviewed; preserved |
| DB024 | Before You Send Sentimental Materials | 286 | Corrected; reviewed source proposal |
| DB025 | A Family Nameplate with a Personal Story | 316 | Reviewed; preserved |
| DB026 | Photographs, Privacy and Memory Art | 325 | Reviewed; preserved |
| DB027 | Small Objects with a Personal Meaning | 298 | Reviewed; preserved |
| DB028 | A Cohesive Gift Set without Repeating Every Detail | 345 | Corrected; reviewed source proposal |
| DB029 | Personalized Resin Jewellery: Preparing Your Brief | 429 | Corrected; reviewed source proposal |
| DB030 | Seasonal Gifting without the Marketplace Clutter | 286 | Reviewed; preserved |
| DB031 | Corporate Gifts as Small Design Objects | 278 | Reviewed; preserved |
| DB032 | Choosing Initials, Colours and a Short Message | 432 | Corrected; reviewed source proposal |
| DB033 | Inside a Material-Led Design Notebook | 409 | Corrected; reviewed source proposal |
| DB034 | How to Read a Product Specification | 310 | Corrected; reviewed source proposal |
| DB035 | Preparing a Clear WhatsApp Enquiry | 300 | Reviewed; preserved |
| DB036 | From Draft to Approved Design: A Client Checklist | 408 | Corrected; reviewed source proposal |

The corrected-copy log is deliberately narrow:

- DB002, DB007, DB011, DB015, DB017, DB028, DB032, DB033, DB034 and DB036: repair malformed material-sample language; retain the distinction between a visual preference and a final specification.
- DB012: remove the internal “this draft” note and clarify physical-sample review.
- DB014: refer to the property owner's agreement for building alterations; the atelier cannot grant that permission.
- DB015: remove the browser-history implementation aside from customer-facing advice.
- DB019: name the product customization form as the first reference-sharing route.
- DB024: replace an internal policy-authority aside with item-specific transfer instructions.
- DB028, DB029 and DB036: clearer collection, image-caption and selected-option wording.
- Public process/FAQ: saving precedes the attempted WhatsApp opening; the customer must press Send. Opening can fail, and a long brief may require copying first. The existing saved-message contract was not changed.
- Contact: ordinary questions use phone/email; new pieces enter a product/bespoke form. Policy pages link to contact instead of a sales CTA.

## Publication and preservation

phase-8-content-proposals.json contains the current 47 reviewed source documents. reviewed-publication.json remains the earlier candidate, unchanged; its historic hashes in Phase 4/5 reports remain valid. **Do not seed the older content and call it this phase's reviewed version.**

For a record without a durable draft, Studio offers the current source candidate. A saved record still opens its actual saved draft. When current reviewed copy differs, the content editor offers a separate comparison and a deliberate “Use reviewed copy in this draft” action. It changes only the current editor contents, preserves ID/route/version, and still requires Save draft or administrator Publish. Existing public and saved revisions are not overwritten by a source update. Later business edits must be reconciled, not silently replaced.

Public content reads only visible, structurally valid, identity-matched published revisions and projects the allowed public fields. It deduplicates routes and never returns draft or extra private fields. Article/page images also need a valid published media record; an unpublished image is omitted. Related products must themselves be published. Reserved legacy article slugs cannot become a different new article.

No prices, offer availability, ratings, testimonials, publication dates, completion dates, address or production claims were fabricated in metadata or structured data. The empty portfolio is not indexed or included in the sitemap. Search/forms/private receipts/Studio/fixture presentations are excluded appropriately. Robots is a search preference, not access control.

## Route and form inventory

The generated register covers 59 page/API source files and all retained dynamic instances. The 120 product/legacy-slug mappings remain in phase-4-products.json; all 36 article routes and three aliases are listed in phase-8-content.json. Metadata files, 404/error/global-error and the new loading entries are described separately in the register/state report.

| Route pattern | Disposition |
|---|---|
| /[collection] | Only collectible-design, memory-art and personal-art; all other values 404 |
| /about | Permanent retained alias with query preservation and care/material anchors |
| /accessibility | Public route; published data only, explicit availability boundary |
| /architects | Public route; published data only, explicit availability boundary |
| /care | Permanent retained alias with query preservation and care/material anchors |
| /commission/customize | Published product or bespoke brief; noindex, writes gated, saves before order-only handoff |
| /commission | Public route; published data only, explicit availability boundary |
| /contact | Public route; published data only, explicit availability boundary |
| /faq | Public route; published data only, explicit availability boundary |
| /inquiry/received | Guest-bound saved receipt; noindex/private, expiry does not remove saved order |
| /journal/[slug] | Public route; published data only, explicit availability boundary |
| /journal | Public route; published data only, explicit availability boundary |
| /materials-care | Public route; published data only, explicit availability boundary |
| /materials | Permanent retained alias with query preservation and care/material anchors |
| /our-story | Public route; published data only, explicit availability boundary |
| / | Public route; published data only, explicit availability boundary |
| /personalize | Legacy selection/customization adapter; real published product context, noindex |
| /pieces/[slug]/customize | Published product or bespoke brief; noindex, writes gated, saves before order-only handoff |
| /pieces/[slug] | Public route; published data only, explicit availability boundary |
| /portfolio/[slug] | Approved real projects only; currently zero, truthful empty list or 404 detail |
| /portfolio | Approved real projects only; currently zero, truthful empty list or 404 detail |
| /preserve | Legacy selection/customization adapter; real published product context, noindex |
| /preview/states/[kind] | Visual system presentation only; denied in production and shared data mode |
| /preview/states | Visual system presentation only; denied in production and shared data mode |
| /preview/studio/[...path] | Authenticated legacy Studio adapter; redirects to Studio, never public content |
| /preview/studio/content/[id] | Authenticated legacy Studio adapter; redirects to Studio, never public content |
| /preview/studio/content/new | Authenticated legacy Studio adapter; redirects to Studio, never public content |
| /preview/studio/content | Authenticated legacy Studio adapter; redirects to Studio, never public content |
| /preview/studio/media | Authenticated legacy Studio adapter; redirects to Studio, never public content |
| /preview/studio/modules/[module] | Authenticated legacy Studio adapter; redirects to Studio, never public content |
| /preview/studio | Authenticated legacy Studio adapter; redirects to Studio, never public content |
| /preview/studio/products/[id]/form | Authenticated legacy Studio adapter; redirects to Studio, never public content |
| /preview/studio/products/[id] | Authenticated legacy Studio adapter; redirects to Studio, never public content |
| /preview/studio/products/new | Authenticated legacy Studio adapter; redirects to Studio, never public content |
| /preview/studio/products | Authenticated legacy Studio adapter; redirects to Studio, never public content |
| /privacy | Public route; published data only, explicit availability boundary |
| /process | Public route; published data only, explicit availability boundary |
| /returns-cancellations | Public route; published data only, explicit availability boundary |
| /search | Published catalogue query/filter form; noindex; no WhatsApp |
| /shipping-delivery | Public route; published data only, explicit availability boundary |
| /studio/[...path] | Staff-only Studio or sign-in; no customer account, noindex |
| /studio/login | Staff-only Studio or sign-in; no customer account, noindex |
| /studio | Staff-only Studio or sign-in; no customer account, noindex |
| /studio/reference/[id] | Staff-only Studio or sign-in; no customer account, noindex |
| /terms | Public route; published data only, explicit availability boundary |

| Form source | Scope |
|---|---|
| src/components/inquiry-wizard.tsx | Historical component preserved; not an active public-form entry |
| src/components/rivya/studio.tsx | Historical component preserved; not an active public-form entry |
| src/components/shop/catalogue-browser.tsx | Public GET catalogue search/filter only |
| src/components/shop/header.tsx | Public GET search only |
| src/components/shop/order-form.tsx | Public product/bespoke customization; sole order-save form; no direct unsaved handoff |
| src/components/studio-form-builder.tsx | Historical component preserved; not an active public-form entry |
| src/components/studio-login.tsx | Staff sign-in; no customer account or WhatsApp |
| src/components/studio-media-picker.tsx | Historical component preserved; not an active public-form entry |
| src/components/studio-orders-board.tsx | Shared authenticated Kanban; legacy form export is not a public entry |
| src/components/studio-product-editor.tsx | Historical component preserved; not an active public-form entry |
| src/components/studio/business-settings.tsx | Authenticated Studio editing/operations; existing saved-order actions only |
| src/components/studio/catalogue-editor.tsx | Authenticated Studio editing/operations; existing saved-order actions only |
| src/components/studio/content-editor.tsx | Authenticated Studio editing/operations; existing saved-order actions only |
| src/components/studio/inquiry-board.tsx | Authenticated Studio editing/operations; existing saved-order actions only |
| src/components/studio/inquiry-detail.tsx | Authenticated Studio editing/operations; existing saved-order actions only |
| src/components/studio/media-library.tsx | Authenticated Studio editing/operations; existing saved-order actions only |
| src/components/studio/staff-editor.tsx | Authenticated Studio editing/operations; existing saved-order actions only |
| src/components/studio/workspace.tsx | Authenticated Studio editing/operations; existing saved-order actions only |

Legacy source files are preserved for history; an inactive historical form is not a second supported public workflow. The common OrderKanban export is still used by authenticated Studio; its historical manual-form export is not a public entry.

## Verification boundary and prepared cases

Completed: Node 22.23.2 TypeScript no-emit wiring; full article/page source review; stable document/section/route identity reconciliation; approved image hashes; form/route source inventory; React/Next source review; Git whitespace, preservation and sensitive-file review before publication.

Not performed: lint, build, unit tests, development server, browser, device, accessibility, API, database integration, real publication, concurrency, full restore or production verification. This phase has no TESTED claim.

Phase 11 must cover:

1. Every retained route and alias, original query parameters and material/care anchors, unpublished/malformed content and unpublished media; distinguish DB failure from 404.
2. All editorial/FAQ/journal topic links and headings at narrow/wide sizes, zoom, keyboard and reduced motion; loading/error recovery and image failure.
3. Inspect real canonical/robots/sitemap/structured data for Production, Preview, copied production flags, shared-data mode and private routes. No invented offers/dates/private data; no JSON-LD markup breakout.
4. Studio current-versus-reviewed draft comparison, deliberate apply, unsaved-edit confirmation, concurrent save conflict, administrator publication and cross-device persistence.
5. General contact never prepares WhatsApp; product/bespoke success saves first; receipt retry/expiry/long-message flow never creates another inquiry. No automatic Send.
6. In a disposable database/store, verify empty, invalid and published rows; all fixture presentation routes denied in production/shared mode. Do not use the shared live target for synthetic checks.

## Continuation

Read master 3.9, IMPLEMENTATION_PROGRESS.md, this report and SHARED-DATA-CONFIGURATION.md. Begin P9.1: reconcile actual media gaps, then device crops, motion/reduced motion, breakpoints and loading costs. Preserve all 47 current source proposals and later saved drafts. Carry exact missing policy facts into P10 readiness.

Both order-write flags and automatic deployment remain off. Free-only/Vercel-only commercial eligibility is unresolved; production is not published. Credentials stay ignored. Phase 2/6 schema is already present on the shared target; do not replay migrations or ask for the same settings approvals.

## Git publication

Implementation 210112d1482cb8f5be6f1b961cc11cd781602acc is published on codex/phase-8-public-content and independently matches the remote branch. Main remains 630521de2f228d2fe935585e12e4639e98da8839. See phase-8-github-publication.json; the local completion artifact records the final documentation head. No production deployment or database publication occurred.
