# Phase 1 — design previews ready for owner review

13 October 2026. Phase 1 preparation is complete for the scope below. **Visual acceptance is awaiting the owner. Phase 2 is not authorized and has not started.**

## Review the four specimens

Start the isolated preview from the repository root:

```powershell
node experiments/redesign-phase1/serve.mjs
```

Open `http://127.0.0.1:4178/`. The review bar switches between Home, Product, Journal and Studio. It is review tooling, not proposed production navigation. The server is bound to loopback and serves only explicitly allowlisted prototype files and existing assets. It cannot serve credentials, database exports or arbitrary repository files; non-GET/HEAD requests are refused.

| Specimen | Desktop composition | Mobile composition | Content basis |
| --- | --- | --- | --- |
| Home | Original title beside a large room image; asymmetric selected works; controlled material film; Journal feature and invitation | Readable opening followed by a large image; stacked galleries and film | Current homepage opening/material/selected/closing copy; existing DP001/DP013 assets |
| Product | Dominant gallery with a deep-ocean specification/inquiry panel; separated detail accordions | Gallery and thumbnails followed by complete details and actions | DP001 River Channel, existing source story, original price-on-request wording and imagery |
| Journal | Existing headline and image followed by an ivory reading area and anchored contents | Stacked opening and full-width reading column with contents before article | Complete DB001 English article: title, intro, six section headings and nine paragraphs |
| Studio | Dark navigation, ivory working area, stage selector, searchable list and contextual order brief | Collapsed navigation; horizontally scrollable stages; order list and detail stack | Existing 24 fictional training examples; private record IDs and contact data omitted |

The lighter Journal and Studio surfaces use the existing ivory brand colour. They are a proposed balance for owner review; no theme or colour value in production was changed. The logo is the exact existing horizontal asset on an ivory support, without a filter or recolouring. Instrument Serif and Inter come from the existing repository fonts.

## Preservation and coverage

- Source baseline: **934 tracked application/configuration/data/asset files**, with SHA-256 per file in `source-baseline.json`. Original source files remain unchanged; additions are isolated documentation/prototypes and continuity notes.
- Anonymous live reads: homepage, River Channel and DB001 returned HTTP 200. Exact semantic text snapshots are in `public-baseline.json`. The product story matches live. All **17** checked Journal strings match live: title, intro, six headings and nine paragraphs.
- Current sitemap: **656 route entries**, mapped individually in `published-route-coverage.json`. The earlier verification receipt's 781-route scope includes its own broader test inventory; these counts are not interchangeable and this task did not re-audit all historic routes.
- Current source: **59 page route patterns**, including public, Studio and protected preview routes, in `route-coverage.json`. Existing aliases, guards, error/loading/print states and conditional routes must remain intact. This is a coverage inventory, not 59 executed route tests.
- Studio: **37 workspaces**, each mapped to Phase 5 or 6 with its common/record states, in `studio-coverage.json`. The sidebar shown in the specimen is representative; no production workspace is removed.
- Homepage: **18 registered section slots**, including conditional/hidden offerings, mapped to new treatments in `homepage-section-map.json`. The specimen shows a representative subset. Keep saved selections, visibility, order, claims and dependencies in the full Phase 3 implementation.
- Supporting register: **74 section entries** across Home, About, Contact, Custom Order, Large Format, Materials, Process and Workshops. These are coverage references only, not permission to restore old layouts or activate unavailable offerings.
- Media: **11 allowlisted existing assets/fonts**, with exact hashes and provenance in `preview-assets.json`. Film/poster preserve their recorded Drive IDs. No media upload, Drive change, generated asset, reassignment or crop save occurred.

No private database or authenticated Studio data was read or written in this phase. This does **not** claim a fresh private-row hash baseline. Before implementation connects to mutable records, obtain an authorized read-only snapshot of IDs, versions and digests; retain raw/private records outside Git. Source fixtures, anonymous public content and historical receipts must never be described as a current production database snapshot. There were no production writes to preserve or undo in Phase 1.

## Preview verification

Final automated browser run: Chrome, 1440×1000 desktop and 390×844 mobile emulation, reduced motion, isolated localhost application. Eight page/viewport captures passed: no document overflow, no broken images, no script errors, no automatic external requests, original logo filter `none`. **26 focused interaction assertions passed**, covering video play/pause and caption clearance; product gallery/saved-state/disclosure/accordions; wrong-product prevention; representative order stages; local search empty state; non-invented history state.

An independent Impeccable finish reviewer inspected all eight initial full-page captures. Fixes resolved a mobile film-control/caption overlap and misleading Shallow Basin navigation. A Windows encoding regression introduced during correction was subsequently fixed and recaptured. Final reviewer disposition: **ship the Phase 1 preview set for user review**; all three identified defects resolved. This verdict is not owner approval, production release approval or broad accessibility/device acceptance.

Screenshots and detailed browser receipt are local-only under `output/playwright/redesign-phase1/`. The public application was not rebuilt because no application runtime source or dependency changed. Actual native zoom, screen-reader, physical-device, full contrast, language and field-performance acceptance are outside these representative Phase 1 checks.

## What has not started

No reusable production design-system implementation, GSAP installation, scroll-engine integration, full parallax choreography, bulk asset selection, image generation, database schema change, content publication, push, PR, merge or deployment. A small CSS opening movement/native smooth-anchor specimen illustrates intent; the production motion architecture belongs to Phase 2 onward.

## Approval decision

Review the four previews and give feedback on composition, image balance, typography and the proposed ivory reading/working surfaces. Once the owner accepts the direction, record that decision. **Start Phase 2 only when explicitly authorized.**
