# Homepage source mapping — second Phase 2 slice

Continues local foundation `5b0a0ea`. Reference remains OLDWEBSITE `2dd6d5de34acf3f98e611eda2e1b858ebd0da8e6`. This is a rendering adapter, not a database migration or content publication. The current owner decision overrides older architectural exclusions.

## Current data bindings

The public route now uses the existing validated `compileHomeReference` read adapter even when no presentation record exists. It reads only the current published projection. The default reference composition preserves the legacy section order; an explicit saved hidden-section selection remains respected. Saved presentation previews use their captured reference snapshot.

| Old slot | Current source | Implemented layout / remaining difference |
|---|---|---|
| pour | Current homepage title, description, actions, media/film and annotation | Previous hero geometry; protected product attribution remains an intentional difference |
| manifesto | All existing homepage strip strings | Centered 18ch display, source type and standard spacing; no replacement wording |
| pieces | Explicit current selected product IDs | Horizontal snap rail, eligible desktop pin/scrub, existing Save control, source card widths and image ratio; old quick-view/card WhatsApp/metadata vocabulary still needs full product workflow port |
| large-format | Published `/architects` document | Four-column scope rhythm; existing paragraphs, actions and available images. Old scope photography has no mapped destination fields yet |
| material | Current story section, selected image/crops and optional published film | Sticky visual and reading column, static reduced-motion/pause fallbacks. Old 121-frame pour/cure animation and four source stages remain pending |
| collections | Current category counts and available selected product images | Six expanding desktop doors, stacked 38vh mobile doors, all other categories in disclosure. Categories without a matched current image retain an honest monogram; no unrelated asset assigned |
| collection journeys | Current enabled journey blocks | Retained below collection doors to preserve existing copy, images and actions; this is extra content compared with the old six-door-only band |
| maker | Published `/our-story`, current image and first enabled chapter | Five/six-column image/copy composition; current design image stays labelled. No invented maker portrait |
| bespoke | Published `/commission` | Source major spacing and outline action using current invitation and route |
| process | Existing ordered homepage steps | Connecting hairline, small mono indices and 16px titles; exact existing chronology and manual WhatsApp wording |
| why | Published story chapters | Source proof-point grid rhythm; no invented metrics, reviews or customers. Current page title is repeated because no new title has been approved/mapped |
| journal | Explicit current selected article IDs | Source editorial rows and single pointer image; current descriptions retained and computed reading time occupies metadata column because no date is present in this snapshot contract |
| closing | Current invitation block | Source spacing/type and outlined action |
| furniture / rooms | Current reference composition flags | Remain off by default, as in the old source. Existing selected products/scenes are still the available inputs |
| work / words / workshops / print | Validated explicit editorial/offering adapters | Remain absent when records or service confirmation are missing. They are outstanding parity work, not completed features |

The source fixture public page renders eleven top-level reference slots, plus its existing journey content inside collections. Its journal has no selected articles. A separate **unpublished synthetic presentation revision** exercises three existing articles without changing that public selection. This is not owner review, production publication or customer evidence.

## Source implementation provenance

| Old implementation | Adaptation |
|---|---|
| `src/app/[locale]/(v2)/page.tsx` | `homepage-document.tsx`, `reference-homepage.tsx`, `legacy-home.module.css` |
| `src/styles/tokens.css` | Component-scoped h1/h2/h3 formulas, standard/major spacing and shell; current global tokens untouched |
| `src/app/globals.css` `.cd-*`, `.fr-*` | `reference-homepage.module.css`, `legacy-home-sections.module.css` |
| `src/components/storefront/cure-line.tsx` | `legacy-cure-line.tsx` / module; SHA-256 `c8ff759ef223e9771c8c654ac8728b6cc34f0d1f03c7d85325c75a9c596b67dd` |
| `src/components/storefront/meniscus-image.tsx` | Server-rendered wrapper + guarded `legacy-home-motion.ts`; SHA-256 `44e62229bb2dc30a4f1219981004202a196e9d90e4e4ead1c38b6800424e31c6` |
| `src/components/storefront/featured-rail.tsx` | Same horizontal rail and scroll-driven pin; server product cards retain current records and Save behavior |
| `src/components/storefront/journal-list.tsx` | `legacy-journal-list.tsx`; real routes, one decorative preview and preserved focal points |
| `src/components/storefront/pour-cure-showcase.tsx` | Geometry/reference audit only; sequence engine/assets are **not** ported by this slice |

## Necessary adaptations

- The pin uses the existing guarded GSAP runtime and cleans up on pause, reduced motion, capability change and route exit. Keyboard focus explicitly releases the pin so all cards stay reachable. A rail too tall for its viewport remains a native horizontal scroller.
- Meniscus masking applies only to below-fold images. SSR and first paint stay visible; focused or passed images open; pause/unmount remove masks. No hero/LCP wipe is introduced.
- The desktop ruler measures actual section positions. Mobile uses the source's 2px progress bar plus the existing native contents disclosure. Without JavaScript, the unmeasured ruler is hidden and the disclosure is available on desktop as well.
- The decorative journal preview is disabled on reduced motion, coarse pointers and the existing effects-pause preference. Its position is bounded to the viewport; keyboard focus hides it.
- Current descriptions, additional journey content, image captions, article reading times and product identifiers remain visible even where they differ from old copy lengths. No populated database field is rewritten to force a screenshot match.
- Component-scoped CSS leaves the Studio login and global theme untouched. No old authentication implementation is imported.

## Acceptance boundary

This is a substantial working homepage foundation, not exact whole-site parity. Missing media bindings, the material sequence, richer cards, print/workshop adapters, remaining templates, footer/newsletter/announcement behavior, authenticated Studio restoration and data reconciliation remain tracked work. A screenshot or menu entry is not evidence of a completed backend workflow.
