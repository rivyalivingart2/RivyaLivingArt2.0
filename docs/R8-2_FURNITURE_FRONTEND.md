# R8-2 — Furniture frontend

**Date:** 21 September 2026

**Repository / work branch:** `rivyalivingart2/RivyaLivingArt2.0` / `codex/r8-first-frontend`

## Owner-authorized main integration

The owner requested: “Merge all things to main branch and go to next task R8-2”.
PR [#5](https://github.com/rivyalivingart2/RivyaLivingArt2.0/pull/5) merged the verified
browser slice `8e8e14b287ebdcc28ed1bd511cb7cbbab914d62b` into main at
`7d9edc1315c39b22335f9f69599b7c8c89b9a63f`; the actual remote ref was read back.
The obsolete stacked draft PR #3 was closed after confirming its complete head
was included. No branches or history were removed.

R8-2 work starts from that main merge and is published separately to the development
branch. No Vercel project, deployment, production promotion or domain change occurred.
The connected Vercel team still reported zero projects before the merge.

## Implemented surfaces

| Revision 8 area | Actual source | Result |
| --- | --- | --- |
| W04 / furniture hero | `src/components/homepage.tsx`, home route | Furniture-led composition; bounded existing concept image; working collection and commission links |
| W05 / typography | `src/app/layout.tsx`, `src/styles/tokens.css`, `src/styles/fonts/` | Local Cormorant Garamond display and DM Sans body fonts; visible semantic text, no animation dependency |
| W06 / discovery | Homepage; `src/components/furniture-collection.tsx` | Tables, seating, consoles and spatial-art category links; distinct secondary worlds retained |
| W07 / large cards | `src/components/concept-card.tsx` | Material, dimensions, edition/bespoke study, labelled price mode and media fallback; ordinary product link |
| W10 / collection filters | Collection route and furniture collection component | Server-validated URL category/material/width/sort; six-item pagination; reset/empty states; keyboard disclosure |
| W11 / gallery | `src/components/product-gallery.tsx`, `concept-image.tsx` | Actual available image/caption, keyboard zoom and focus restoration; separate missing/load-error states |
| W12 / specifications | `src/app/pieces/[slug]/page.tsx`, `finish-options.tsx` | Sample dimensions/units, pricing, lead time, availability, simple finish choices, care/access and semantic story paragraphs |
| W14 / material narrative | Homepage and detail story sections | Textual design narrative; no fabricated workshop photographs or technical performance claims |
| W15 / commission CTA | Home, collection and detail | Working link to the commissioning overview; forms remain R8-3 |

No image recolouring, enhanced comparison, specification PDF builder or fabricated
3D experience was added. No approved downloadable specifications or GLB exist.
The shared loading component remains available; the known home route now delivers
its content together so cross-route hash links find their actual destinations.

## Authored fixtures, not persisted products

`src/lib/catalogue.ts` contains **12 complete LARGE source concepts / 0 database
rows**: DP001, DP002, DP013, DP014, DP025, DP035, DP043, DP048, DP051, DP057, DP069
and DP077. Existing DP001/DP013 IDs, slugs and image bytes are preserved.

- Six table/desk studies, two seating studies, one console and three spatial-art studies.
- Seven ON_REQUEST, three STARTING_FROM and two FIXED examples. Amounts use integer
  INR minor units; request-only prices have no invented number. Every displayed
  price, measurement, material, finish, availability and timeline is labelled sample.
- Each exact blueprint name has a distinct 45–48-word summary and 135–145-word
  original detail, stable fixture key/batch/version, sample specifications,
  customization fields and separate visual/draft-state metadata.
- All 12 are demo-visible in the isolated preview. Draft flags describe future
  editor examples; no working draft revision or live publication is represented.
- The final 120/36/42/24/40 dataset remains incomplete. This is the progressive
  furniture batch, not a completed seed or a database migration.

The query adapter remains server-side. Client components receive only media or
finish options needed for the displayed piece; no runtime catalogue import exists
in a client component. URL values and repeated parameters are validated, sort is
applied before pagination and invalid/out-of-range pages have bounded behavior.

## Media and fonts

The two inspected AVIFs remain unchanged; ten concepts use deliberate visual-pending
panels. A failed request for an existing image instead says “Image unavailable”.
Zoom displays the same supplied image within its original pixel bounds and does
not invent extra detail, alternate angles or a model.

Higher-resolution originals remain unavailable under the earlier documented
source-authorization/transfer limitations. Those rejected requests were not retried.
The existing asset companion now records eight candidate source reviews and two
filled owner-generation briefs for Petal and Estuary. No new prompt pack, image
service or Drive sync was created. No generated outputs are claimed.

Four unmodified Latin WOFF2 subsets (75,040 bytes total) were obtained through
`npm pack` from Fontsource packages 5.3.0. They are self-hosted with original OFL
licenses and a SHA-256 manifest in `src/styles/fonts/`; no font CDN or new runtime
package dependency is required. The existing wordmark font remains unchanged.

## Verification and review

Actual integrated results under Node 22.23.2 / npm 10.9.2, Playwright 1.62.1 and
Chromium 153.0.8010.0. No browser result is inferred from source or static HTML.

| Command | Actual result |
| --- | --- |
| `npm run lint` | Pass, no warnings/errors |
| `npm run typecheck` | Pass |
| `npm test` | 33 passed |
| `npm run test:preflight` | 12 passed |
| `npm run build` | Pass |
| `npm run test:runtime` | 59 passed, including all 12 detail routes and production denial |
| `npm run test:e2e` | 98 passed; 10 mobile-only cases inapplicable on desktop/tablet; zero failures |

`npm run check` passed as a complete sequence. The lockfile/application dependencies
are unchanged; the earlier clean `npm ci` remains recorded in R8-1 evidence. This
slice changes only the HTTP-test script to explicitly support TypeScript imports
at the declared Node 22 engine floor.

The browser matrix is 1440×1000, 768×1024, 390×844 and 320×740. Checks cover actual
loaded display/body fonts, responsive layouts, decoded images, every filter/sort,
page navigation, invalid/repeated query parameters, browser Back/reload, empty reset,
keyboard disclosures, finish selection without recolouring/persistence, gallery
zoom/Tab/Escape/scroll/focus, forced image failure, missing-media detail, related and
commission navigation, unknown 404s and the existing mobile-menu/reduced-motion
regressions. Existing routes produced no console errors; the intentionally failed
image case is tested separately.

Actual unmodified screenshots from the passing full run:

- [Desktop home](evidence/r8-2/home-desktop.png)
- [Mobile home](evidence/r8-2/home-mobile.png)
- [Tablet collection](evidence/r8-2/collection-tablet.png)
- [Desktop detail](evidence/r8-2/detail-desktop.png)
- [320px gallery](evidence/r8-2/gallery-320.png)

Visual inspection, including an independent detail/gallery review, found no blocking
layout issue. Existing image softness and ten pending visuals remain explicit.
Chromium emulation is not physical-device, Safari/Firefox or comprehensive
accessibility/performance certification. Reproduce with `npm ci`,
`npx playwright install chromium`, `npm run check`, then `npm run test:e2e`.
This workspace used the existing local test-only Chromium executable override;
no browser/network controls or deployment flags were changed.

Independent source review checked exact names, content lengths, sample price
semantics, field completeness and client/server boundaries. It prompted separate
story paragraphs, visible sample availability and truthful error-media labels.

Actual browser testing caught a font-variable scope error and native-form history
restoring controls that disagreed with the URL. Font variables now live on the root
element; the filter uses Next's built-in navigation Form, retaining a GET fallback
and server-side queries. Another run caught a cross-route commission hash arriving
before the streamed home content; the home now delivers its destination with the
page. Tests wait for the actual navigation result rather than an already-visible
heading. These corrections do not suppress any check.

**SOURCE_IMPLEMENTED:** R8-2 furniture journey. **UI_READY:** verified sample
journey for continued frontend work; final media still incomplete. **BACKEND_CONNECTED:**
no. R8-3 public pages/forms, R8-4 Studio visuals and R8-5 owner review remain ahead.
All rejected integrations and S01–S04 remain excluded.

**Next exact task:** R8-3A — build distinct memory-art and personal-art collection
presentations and tier-aware sample detail pages using the shared catalogue contract.

Publication is pending at document-writing time. The task result must report the
queried development-branch SHA after publishing, not infer it from a local commit.
