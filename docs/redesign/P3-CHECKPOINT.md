# P3 — Drive assets and page image assignments

1 October 2026. Started by the owner after P0/P1/P2 reached main `8990e73`. Current local branch: `codex/p3-editorial-images`. Work remains local until the owner says push to main; then use a detailed PR and merge through it. See the latest owner decision.

P3 is in progress. The full task register is T11, T15, T19 and T60. T15 and T60 have started; T11 and T19 remain planned. Protected product galleries, product records, contacts and scraper remain unchanged. No old-product transfer.

## Delivered locally

- Replaced the Site images shortcut with a page → section → image placement editor. Homepage story sections and ordinary page/article sections use their own image description, caption, desktop crop and mobile crop.
- The image picker lists only already-published public media. It never reads private customer reference uploads. Search narrows pages or approved assets.
- The editor shows public versus draft assignments, saved usage locations, source provenance and protected product association counts. Changes clone only the selected page document; they do not change global media framing, originals or product records.
- Save uses the existing version-checked content draft endpoint. A clean saved version links to its exact preview and owning page editor for publication/revision recovery. Unsaved changes suppress those navigation links; page switching offers keep/discard; reload and local-copy recovery remain available.
- Existing product-driven homepage hero/journey references and ordinary page headers are clearly read-only here. Their owning editors remain linked. Independent overrides for these placements are still required before P3 closure.
- Verified the owner's supplied Drive folder and its curated 37-file asset inventory. Visually inspected four downloaded originals: `hero-pour.jpg`, `doorway-collectible.jpg`, `doorway-memory.jpg`, `doorway-gifts.jpg`. Saved exact Drive IDs, byte counts, dimensions, SHA-256 hashes, subject notes, contextual descriptions and proposed desktop/mobile crop briefs in `p3-editorial-asset-review.json`.
- Those four images are unpublished design-visualization candidates, with no product associations. They do not establish actual workshop photography, delivered customer work or specifications. Originals are retained in Drive and locally under `outputs/P3`; no public derivative or media record was created.

## Verification for this initial slice

- 226 unit tests passed, including four new placement inventory, cloning/isolation, invalid usage and usage-count tests. Changed-file lint: zero errors/warnings. Final production build and TypeScript passed.
- Authenticated browser checks on localhost using the existing isolated QA identity: page/asset searches; material placement; mobile focus 50 → 51 while desktop stayed 50; save enabled and saved-preview link removed while dirty; keep preserved edits; explicit discard switched pages and restored the saved crop; hero product reference remained read-only.
- No horizontal overflow at 320, 390, 768 or 1440 CSS pixels. No browser warning/error logs observed. Desktop screenshots saved under `outputs/P3`. These are selected checks, not a complete accessibility or performance audit.
- The browser checks kept edits in memory and discarded them. The new panel's server save → preview → publish → recovery acceptance has **not** been executed in this slice. P2's earlier workflow evidence does not substitute for that P3 acceptance.
- All 1,889 protected source fingerprints still match P0. Isolated catalogue, public-media and business-settings fingerprints still match P2. No content publication, production writes, product transfers, scraper operations, Git push, PR or deployment occurred. Local test server and owned test tab were closed.

Evidence in the parent workspace: `outputs/P3/unit.log`, `build.log`, `lint.log`, `browser-layout.json`, `Protected-Source.json`, `Protected-Records.json`, `Initial-Asset-Review.json`, `Drive-Inventory.json`, `site-images-workspace.png`, `site-images-crops.png` and `P3-Start-Validation.json`.

## Continue from here

1. T11: add supported editorial asset ingestion with file/type/dimension checks, immutable originals, responsive derivatives, provenance and review/publication gates. Keep the protected product ingestion workflow unchanged.
2. T15: implement independent hero, journey and page-header usage contracts and rendering, then complete usage/dependency coverage and safe replacement controls. Preserve existing product references as compatible fallbacks.
3. T60/T19: complete file-level Drive review, ingest approved candidates, and assign distinct editorial/process/detail/doorway images using the recorded crop briefs. Check compositions on mobile and desktop; no filename-only approvals. Add video only through the specified reviewed, accessible media workflow.
4. Run the complete isolated image lifecycle: draft save → exact real preview → publish → anonymous page verification → revision recovery. Verify reuse independence, stale-version conflicts, protected galleries, missing/private media rejection, keyboard access and crop behavior.
5. Update the master plan and task register with evidence before declaring P3 complete. P4 detailed-page restoration remains a later phase.

## Publication rule

Keep code, assets, evidence and documents local until the owner explicitly says to push to main. Then push the working branch, open a PR with the complete change description, affected areas, tests, protected-data checks, limitations and recovery notes, and merge through that PR after required checks. No direct main push. Do not treat an earlier push instruction as authorization for future work. Deployment and production content publication remain separate actions.
