> Owner scope change, 5 October 2026: the project backup feature, scheduled archive jobs, archive-key custody tasks and backup/RPO/RTO acceptance gates are removed. Any earlier instruction below to run, verify, schedule or require them is historical and superseded. Existing archives/keys were not deleted. Studio draft/revision recovery and privacy-erasure safeguards remain. See the 2026-10-05 removal decision.

# C3 — collections, discovery and inquiry presentation

3 October 2026. Implemented and verified locally on `codex/craft-visual-improvements`, continuing C2 commit `949d435`. C3-01–06 have scoped local and isolated QA evidence. This is not production publication, physical-device acceptance or completion of the full CRAFT plan.

## What changed

- Furniture/spatial art, memory art and personal art retain their distinct published copy, reviewed images and detailed chapters. The shared renderer now gives their openings, statements, checklists and image/text sections clearer hierarchy and spacing. A native disclosure links directly to enabled chapters. Studio remains the source of order, headings, paragraphs, image assignments and crops.
- Search has a compact opening, responsive filter controls and a readable result count. The existing introductory guidance remains below the results. Applied chips, URL filters, sorting, pagination, reset and Back behavior retain their existing implementation.
- Product pages have more readable specifications and disclosure controls. Enlarged images use `contain`, so the complete original frame is visible. Original gallery membership, order, captions and focal points remain unchanged.
- Inquiry fields occupy the main desktop column; the compact product summary follows them in reading order and appears after the form on phones. The current product name/ID appears immediately above the existing steps. The field schema, validation, private upload, exact retry, saved receipt and manual WhatsApp behavior remain the existing service contracts.
- Saved-piece and receipt typography and spacing are refined. No package, schema, permission, API, scraper or product-data change was needed.

## Detailed content retained

The QA collection snapshots contain 84 furniture/spatial pieces, 24 memory pieces and 12 personal pieces. Their existing chapters cover room proportions/access/material appearance, keepsake preparation/condition/display/care, and personalization/gifting/expectations. These are rendered from published Studio content; no new claims, product records, business promises or social copy were written. Search uses the same 120 products.

Previously reviewed Drive-derived editorial images and their saved crops are retained. Product imagery is never replaced by editorial images. The C3 implementation adds no video or animation dependency. Native disclosure/anchor behavior and the established reduced-motion foundation remain in use.

## Browser and service verification

Evidence: `craft-c3-validation.json`, `craft-c3-browser-verification.json`, `craft-c3-service-verification.json`; actual screenshots are in workspace `outputs/CRAFT-C3` and `outputs/CRAFT/c3-implementation.html`.

- Search combined collection, category and sort; removing a chip preserved the other filters; Back restored the previous six results/order. Applied chips remained visible with filters collapsed. Keyboard load-more showed 24 records, Back restored 12, and no-match search offered reset.
- Original River Channel gallery passed ArrowRight, Home/End, enlargement, full-image fit and Escape/focus return. Saving one test selection, reload, and removing that same selection restored the original empty list. Built-server checks retain unknown/unavailable record behavior.
- Large, memory, personal and bespoke forms each retained answers through Back and saved one canonical inquiry. Required-field focus, a conditional dimensions field and personal quantity bounds were exercised. Contact values were synthetic, and no external message was sent.
- The shared private-upload path normalized one approved public test image into the isolated private store. Authorized staff received the image with `no-store`; unauthenticated access returned 401. A separately initialized guest received 404 with no private receipt data.
- On the large-piece path, a successful server response was deliberately dropped. The browser sealed editing, offered retry of the unchanged brief, and recovered the saved receipt. Reload worked; the database confirmed exactly one inquiry. This fault was exercised on the shared path once, not separately on all four form types.
- The four specifically named synthetic requests were closed through the normal Studio action with their history retained. No customer inquiry was edited or erased.
- Baseline comparison passed for every catalogue/form record, media/gallery association, business setting and all 64 content entries, including drafts/publications/social copy. There were no content saves or publications in C3.
- Seven page families were checked at 320, 390, 768 and 1440 pixels: three collections, search, a product, bespoke customization and saved pieces. All 28 checks had no horizontal body overflow and their headings fit. Reduced-motion emulation kept collection headings visible without CSS animation.
- TypeScript, changed-component lint, optimized build, 281 unit tests, 12 preflight tests and 401 built-server HTTP checks passed.

The dropped-response test intentionally produced a network failure. A Next.js warning identified the original product image as a lazily loaded LCP candidate on saved pieces; mobile loading acceptance remains in C6. Browser emulation and keyboard checks do not certify a physical phone, human screen-reader use or field performance. Existing full-family gates remain open.

## Continue with C4

Next: story, process, materials/care, journal, contact and policy presentation, using the page register and detailed CRAFT specifications. Preserve the old site's substantive section intent and current Studio-owned content. Verify affected layouts and existing editing/preview behavior without inventing business content.

C2 optional video is still deferred. C5 remaining Studio modules and C6 performance, human/device checks, independent/offsite key custody, sustained backup history and production editorial acceptance remain open. Keep all changes local until another explicit push-main request; then use a detailed PR and the authorized release process. No push, PR or production deployment occurred for C3.
