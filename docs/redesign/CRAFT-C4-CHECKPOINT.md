# C4 — editorial pages and detailed reading

3 October 2026. Local presentation work on `codex/craft-visual-improvements`, continuing C3 commit `c9c2b83`. C4-01–04 and C4-06 have the scoped local/isolated QA evidence below. C4-05 is **partial: QA Imprint verified, production still unavailable (404)**. This checkpoint does not close production editorial, human/device or full-language acceptance.

## What changed

- Story, process, materials/care and architects retain every existing enabled Studio chapter. Their openings now pair a stronger type hierarchy with the saved image, crop and caption; a native keyboard-operated chapter index leads into full detail. Statements, checklists and material rows have distinct readable layouts. The four customer process steps remain readable without animation.
- Journal has a framed search area, visible selected topics, a larger featured composition and an explicit story-list heading. Existing query/topic/pagination/Back logic stays intact. Articles have a narrower reading measure and a chapter index from three sections upward, with anchors offset below the fixed navigation.
- FAQ keeps its existing grouped search and native disclosure behavior, with clearer controls and answer spacing. Contact cards are readable at phone widths and still use the exact business settings. Policies have restrained headings, visible effective-date status and readable chapter navigation. Policy and materials print styles use black text on white and hide site navigation.
- The genuine portfolio empty state has a clearer invitation. No clients, projects, project locations, dates, staff identities, awards, material promises or legal facts were invented. All saved illustrative captions remain visible.
- Missing journal and portfolio detail routes now return actual HTTP 404. The previous parent `loading.tsx` files began streaming before detail validation, producing a 200 response with unavailable content. Loading fallbacks now sit inside the two index pages, leaving nested slug validation free to return 404. The built-server regression suite covers both missing detail routes.

No package, schema, permission, product/form service, scraper, business/social content, gallery association or content-record mutation was needed. No production write, push, PR or deployment occurred.

## Content and media retained

The QA story has seven chapters; process has twelve; materials has eight; architects has six. Journal contains 36 published article snapshots, with DB019 as its existing featured selection. FAQ has twelve answers in four groups. All headings, paragraphs, section order, enabled state, actions and image usage still come from the existing published Studio snapshots. The exact saved-revision preview uses the same renderer.

The previously reviewed Drive-derived assets retain their saved provenance/captions and crops. Existing journal covers and product associations were not replaced. The portfolio remains empty because no approved projects exist. The existing Imprint business identity was rendered unchanged; it was not newly verified as a legal fact. Unknown effective dates remain explicit.

## Evidence and practical limits

Evidence files: `craft-c4-validation.json`, `craft-c4-browser-verification.json`, `craft-c4-http-verification.json`, `craft-c4-protection-verification.json`, and `craft-c4-page-acceptance.csv`. Actual screenshots: workspace `outputs/CRAFT-C4` and `outputs/CRAFT/c4-implementation.html`.

- Fifteen public routes checked at 320, 390, 768 and 1440 CSS pixels: 60 body/heading reflow checks passed. Thirty additional loaded-page observations support the final desktop and phone screenshots. They are browser emulation, not physical-phone acceptance.
- Twenty scoped browser checks passed: keyboard chapter links, combined journal topic/search, pagination and browser Back, no-match reset, article anchor offset, FAQ keyboard grouping/disclosure/deep-link reopening, protected contact links, Hindi/Gujarati interface fallback/persistence, reduced-motion heading visibility, and policy/material print media.
- Thirty-six isolated HTTP assertions passed: fourteen published routes at their recorded revisions; six authenticated exact saved previews with six anonymous denials; four exact aliases; unavailable/retired routes; genuine portfolio empty state; and protected Imprint contacts. The preview records were story v8, process v18, materials v9, Imprint v5, DB019 v1 and the existing custom page v3. No new draft or publication was created.
- The browser Studio session expired. Authenticated preview evidence is the isolated HTTP check, not a browser editing demonstration. Re-executing each page's save/publish/restore cycle and production editorial approval remains separate acceptance work.
- The post-work comparison matched all 120 protected products, form definitions, media/gallery associations, business settings and all 64 content entries, including drafts/social copy/publications. No customer inquiry was changed or message sent.
- TypeScript, changed-component lint, optimized build, 281 unit tests, 12 preflight tests and 403 built-server HTTP tests passed. The final build includes the print changes and index-only loading fix.
- Browser errors were not observed in the captured log. A development warning flags the existing journal cover as a lazy LCP candidate. C6 mobile/field performance acceptance remains open. Print media was emulated; physical printing/pagination and 200% browser zoom were not separately certified. Human screen-reader, physical-device and translation-quality review remain open.

## Imprint is still a production blocker

A fresh read of `https://www.rivyalivingart.com/imprint` returned **404** and “This page is unavailable.” The live footer exposes the link. The isolated QA page and saved preview render their existing v5 content and protected contacts correctly; that does not prove production publication.

Before C4-05 can close, review the actual production business/legal record, resolve any missing factual/effective-date approval, inspect its exact saved preview, publish through the authorized workflow, follow the live footer link and verify the public revision, then record recovery evidence. Do not copy QA records/media identities into production or silently invent missing facts. Current work remains local until the owner's next explicit push-main instruction.

## Continue with C5

Next: C5 Studio modules and the requested dashboard design references. Continue the CRAFT Studio family register and page specifications; preserve record deep links, current forms, drafts, history and private workflows. Keep C4-05 visibly open until actual production evidence exists.

C2 optional video remains deferred. C6 performance, full-page/human/device checks, independent recovery-key custody, sustained daily-backup history and production editorial acceptance are still open. C7 requires the next explicit push-main instruction and a detailed PR. Historical P0–P8 evidence is not replaced by these CRAFT presentation receipts.
