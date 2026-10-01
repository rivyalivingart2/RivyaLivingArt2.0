# P4B–P4E implementation and verification report

1 October 2026. **P4B–P4E implementation and isolated functional acceptance are complete.** Together with the earlier P4A delivery, the detailed public-page implementation is in place on local `codex/p4-detailed-pages`. **Performance acceptance remains open:** selected local loading samples exceed the target. This is not a whole-site performance, accessibility or production-release certificate. P5–P8 have not started.

No push, PR, merge, deployment or production content publication occurred. Main remains `8990e73e818c9a0f9aba8183c1e2d9f74a5206c9`. The owner’s rule remains: keep work local until an explicit push-to-main instruction; then use a feature branch and detailed PR, never a direct main push.

## P4B — collections, search and saved pieces

Six new registered Studio candidates support the three collections, search, commission entry and journal. They become editable drafts without automatically replacing the public site. The actual saved preview and published page use the same renderers. Furniture/spatial art, memory art and personal art have distinct introductions, planning guidance and reviewed images. The browse section stays visible and cannot be accidentally removed; catalogue content comes from existing published products.

The catalogue has applied-filter chips, separate removal, reset, counts, sort, page size and load more. Search/filter/pagination changes preserve browser Back and the exact saved-preview record/version. Empty-result reset now also stays inside the saved preview. Product order is stable after publication updates.

Saved pieces uses a versioned, 60-item browser list containing only current product identifiers. Save/remove, clear, reload persistence, unavailable-record removal, the empty state and explicit storage-failure messaging are supported. No account, contact details, old wishlist or old product data is imported.

## P4C — product, brief and receipt

Existing product names, stories, dimensions, materials, specifications, options, form schemas and gallery associations remain unchanged. Product cards and detail pages gain a separate accessible save control. Gallery navigation supports Arrow keys, Home/End, the existing swipe interaction and enlarged view with Escape/focus return. Price presentation respects the existing public projection: inherited amounts marked `sample` never become actual advertised prices. Current products continue to show Price on request.

Customization and bespoke forms gain clearer step context and consistent error targets. A private-reference error focuses the reference group instead of a disabled file chooser. The existing required fields, conditional answers, upload behavior, same-request recovery and schema reconciliation are retained. The saved receipt distinguishes brief saved, message prepared and the customer choosing to send. It does not claim to observe WhatsApp Send or a confirmed order.

One explicitly synthetic inquiry was saved through the browser in isolated QA. Required-field focus, retained answers after Back, contact validation, review, save and repeated receipt access passed; storage contains exactly one request. No WhatsApp window was opened and no message was sent. New file-upload fault injection was not executed in this pass; the unchanged upload/retry behavior retains the existing regression coverage and later full-flow verification gate.

## P4D — detailed editorial pages and journal

The old-site section comparison now accounts for all 74 registered old sections: 18 home sections in P4A and 56 additional sections here. Story, Process, Materials & care and Architects gain 16 additive chapter templates. Studio’s Add missing detailed chapters action is idempotent, retains existing copy/order/crops/translations, keeps additions hidden for review and refuses overflow beyond the existing 20-section limit. The reviewed Process composition has 12 chapters separating the customer journey from questions about material selection, preparation, casting/curing, finishing, review and arrival.

Reading-column, image/text, reversed and statement compositions are editable. Staff source notes remain private. The content describes useful decisions without inventing a named maker, manufacturing method, universal lead time, installation or certification. Unsupported workshops, projects and testimonials are recorded as conditional; no fake public page or project was added.

Journal discovery adds a published-story picker, featured story, topic counts, search, progressive loading and URL/back continuity. All existing article paragraphs and related product identities remain unchanged. Nine covers were corrected using P3 reviewed Drive subjects and visually checked, already-published product visuals. Original assets, public-media rows and product galleries were not modified. There are distinct collection/room, memory, gifting, material and making subjects. Image captions retain visualization/illustration disclosures. Optional video remains unselected; the reviewed static path is the initial delivery.

## P4E — help, factual pages, custom pages and system states

FAQ retains all 12 answers, adds four editable groups, search, keyboard-operable answers and stable answer anchors that reopen after reload. Contact makes the existing channels and supported saved-brief destination easier to find. Policies, accessibility text, Imprint and canonical business values remain unchanged. Cross-page help links follow publication availability. Current factual omissions and unprovided legal identity details remain recorded release conditions.

Studio can create a custom page with a durable identity and bounded `/p/slug` address, edit its chapters/images/crops/actions, save a real preview, publish, independently verify, recover a revision and withdraw the page. Existing saved addresses stay stable. A synthetic custom-page lifecycle passed, and that page was withdrawn with its revision history retained. No fabricated business page is included in the release manifest.

Loading, empty, unavailable and failure states retain useful recovery actions. Unknown custom/product pages return 404. The sampled unknown portfolio route returns a streamed 200 with the not-found presentation and noindex; the initial test incorrectly required a 404 and was corrected to record this framework behavior. [Next.js documents the streamed distinction](https://nextjs.org/docs/app/api-reference/file-conventions/not-found). No unavailable project content is exposed.

## Executed checks

| Evidence | Result |
|---|---|
| Full unit suite | 246 passed, 0 failed; 11 focused P4 tests cover hidden restoration/preservation, capacity, dependency withdrawal, saved storage failure, sample-price protection, preview URL identity and custom-page boundaries |
| Preflight and built HTTP regression | 398 passed, 0 failed |
| Build / TypeScript / lint | Final production build and TypeScript passed after the final empty-state preview correction; changed-file lint and final edited component lint passed |
| Main isolated editorial lifecycle | 74 assertions across draft, exact preview, deliberate publication, independent public revision, invalid reference refusal, stale-write refusal and revision recovery |
| Covers | Nine saved/previewed/published cover corrections; article text and related products retained |
| Final isolated lifecycle/link pass | 27 assertions, including custom-page publication/recovery/withdrawal, unchanged policies and protected data |
| Final readback | 34 assertions after the read optimization and final preview-link correction; all page and cover versions preserved, staff source notes private, anonymous preview denied |
| Public destinations | 24 starting page families; all 99 internal href/anchor combinations and 98 distinct active destinations resolved |
| Browser interactions | 34 assertions; search/chips/sort/history, saved list, gallery keyboard/enlargement, form errors/review/receipt, journal, FAQ anchors, Studio controls and exact previews |
| Responsive layout | 55 samples at 320, 390, 768 and 1440 CSS px; no document overflow; one main, heading and skip link per sampled page |
| Console / reduced motion | No captured browser console errors; save controls have zero animation/transition under reduced motion |
| Protected source | All 1,889 files match P0, including OLDWEBSITE, product/schema/gallery data, protected contact code, scraper, package files and protected APIs |
| Protected persisted data | Whole-row fingerprints match for all 120 catalogue entries, all 136 public-media records and business settings; unrelated drafts, home and policy/contact records remain unchanged |

Browser tests use desktop viewport emulation, not physical devices or a full WCAG audit. Some navigation waits expired while streaming completed; a fresh page inspection confirmed the loaded result. The local server logged destination-stream-closed events during navigation; zero console errors is not a claim that every server log was empty.

## Performance finding — acceptance stays open

Public reads now discard stored nested page snapshots and rebuild references against current publication, retaining the original full-record fingerprints and exact private preview snapshots. The audited visible document payload drops from 842,328 to 193,806 bytes when nested snapshots are excluded (about 77%). This is a content-payload measurement, not a browser speed score.

The selected built-server measurements used a 1440-pixel desktop browser, an existing cache and no artificial CPU/network throttle. Observed LCP was 10.17 seconds for the collection, 3.38 seconds for Process and 3.03 seconds for Journal. TTFB was 10.03, 0.93 and 0.50 seconds respectively. A separate read-only profile measured 6.65 seconds for the remote QA dependency read and 0.33 seconds for all-page snapshot compilation. These samples identify data-read/server latency as a major contributor; they do not establish production behavior or a cold-cache transfer budget.

**The performance target has not passed.** T41/T61 remain implemented with performance acceptance open. P7/P8 must measure the deployed environment with controlled cold/warm loads, resolve excessive request/data latency, measure representative interactions and layout shift, and validate the plan’s field targets when enough real data exists. Do not use the functional closure to waive this gate or claim INP/CLS/75th-percentile field results.

## Final isolated publications and recovery

| Record | Published revision |
|---|---:|
| Homepage (unchanged from P4A) | 32 |
| Furniture/spatial art | 7 |
| Memory art / Personal art / Search / Commission / Journal | 4 each |
| Story | 8 |
| Process | 18 |
| Materials & care | 9 |
| Architects | 3 |
| FAQ | 10 |
| Nine corrected article covers | 3 each |
| Synthetic custom page | Hidden at 6; history retained |

These are isolated QA versions, not production versions. QA uses its established separate database/runtime role/private store; indexing remains off. Inquiry intake was enabled only in the temporary local QA server for the synthetic browser check. No production setting was changed.

Use `p4-public-pages-release.json` and the earlier `p4a-home-release.json` for a later authorized release. Resolve the named Drive sources to published destination assets; never copy QA UUIDs or private receipt URLs. Begin with current destination drafts, append only missing chapters, review copy/visibility/crops/references, save, inspect the exact preview, deliberately publish and independently read back. Restore an earlier revision into a new draft when recovery is needed; retain all earlier revisions and immutable assets. Production release requires its own applicable authorization.

## Evidence and continuation

The repository contains the implementation, section disposition, portable manifest and validation summary. Full isolated evidence and screenshots are in the parent workspace `outputs/P4/`: `P4BE-API-QA.json`, `P4BE-Covers-QA.json`, `P4BE-Final-QA.json`, `P4BE-Postcheck.json`, `P4BE-Browser.json`, `P4BE-Performance.json`, `P4BE-Protected-Source.json`, build/lint/test/runtime logs and the P4A historical evidence. The original API log retains its initially incorrect streamed-404 expectation; the final outcome report records the corrected contract rather than hiding the first result.

Read `P4-SECTION-DISPOSITION.md` for the 56 non-home old-section decisions and `P4-HOME-SECTION-DISPOSITION.md` for the other 18. Main is unchanged. P5 Studio-wide appearance/operational work, P6 language/legacy journeys, P7 comprehensive verification and P8 authorized release remain later phases. This implementation does not start them automatically.
