---
name: RivyaLivingArt Phase 1 local composition prototype
description: Proposed contemporary material gallery composition awaiting owner review; scoped to this experiment.
colors:
  obsidian: "#080a0e"
  ocean: "#08283a"
  sapphire: "#164e6b"
  champagne: "#b89b63"
  ivory: "#f4f1e9"
  stone: "#ddd6cb"
  muted: "#a9b4bc"
  ink: "#18202a"
  line: "#41505c"
  light-muted: "#405363"
typography:
  display:
    fontFamily: "Instrument, Georgia, serif"
    fontSize: "clamp(58px, 6.7vw, 96px)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Instrument, Georgia, serif"
    fontSize: "clamp(38px, 4.5vw, 64px)"
    fontWeight: 400
    lineHeight: 1.07
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "20px"
    fontWeight: 500
    lineHeight: 1.3
  body:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "15px"
    lineHeight: 1.75
  article-body:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "16px"
    lineHeight: 1.85
  button:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.4
  caption:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "12px"
    lineHeight: 1.6
rounded:
  icon: "50%"
  status: "20px"
spacing:
  public-gutter: "4vw"
  section-gutter: "6vw"
  control-gap: "12px"
  studio-page: "32px"
components:
  button-primary:
    backgroundColor: "{colors.champagne}"
    textColor: "{colors.obsidian}"
    typography: "{typography.button}"
    padding: "12px 22px"
  button-primary-hover:
    backgroundColor: "{colors.stone}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ivory}"
    typography: "{typography.button}"
    padding: "12px 22px"
  button-studio-new:
    backgroundColor: "{colors.sapphire}"
    textColor: "{colors.ivory}"
    typography: "{typography.button}"
    padding: "12px 22px"
  icon-button:
    backgroundColor: "transparent"
    rounded: "{rounded.icon}"
    width: "44px"
    height: "44px"
  order-search:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    padding: "12px"
    height: "44px"
  order-detail:
    backgroundColor: "{colors.ocean}"
    textColor: "{colors.ivory}"
    padding: "28px 30px"
---

# Design System: RivyaLivingArt Phase 1 local composition prototype

## Overview

**Creative North Star: "Contemporary material gallery"**

This is a source-extracted record of the isolated Phase 1 prototype, not a root production design system. The owner approved the seven-phase plan and authorized Phase 1 only. This composition, including the ivory Studio and Journal surfaces, remains proposed and awaits owner approval. Phase 2 has not started. Extraction establishes what the prototype implements; it does not establish visual acceptance, user research, native-device acceptance or production readiness.

Existing resin furniture imagery leads the public experience. Dark framing, restrained champagne actions and generous compositions support the work; the proposed ivory reading and working surfaces use an existing brand colour for sustained reading and task clarity. Qualitative language follows the existing direction contract rather than an invented user interview.

Sources: [PRODUCT.md](../../PRODUCT.md), [DIRECTION.md](https://github.com/rivyalivingart2/RivyaLivingArt2.0/blob/7becabb7b6ee9d98f8786435a6e766e2ed33aaa9/experiments/redesign-phase1/DIRECTION.md), [styles.css](styles.css), [preview.js](preview.js), [index.html](index.html), [asset-map.json](asset-map.json) and [serve.mjs](serve.mjs). This file and [.impeccable/design.json](.impeccable/design.json) apply only to this experiment. Frontmatter records reused prototype values; the CSS remains implementation truth. The sidecar contains extensions and representative component snippets, not a second primitive-token registry.

**Key Characteristics:**
- Original logo and image identity remain intact.
- Serif public display type pairs with functional Inter text.
- Public imagery is dominant; Studio task controls remain compact.
- Ivory reading and working surfaces are proposed within the retained dark brand framing.
- Content is visible at initial render; motion is optional and limited.
- Prototype actions disclose their scope and do not save or publish records.

## Colors

The palette combines dark ocean surfaces with warm ivory, champagne accents and quiet supporting neutrals; the frontmatter preserves the source values.

### Primary

- **Champagne** marks public calls to action, selected-gallery borders and focus on dark backgrounds.
- **Sapphire** identifies Studio active navigation and selection, its New order action and focus on the light workspace.

### Neutral

- **Obsidian** anchors the public shell and review framing.
- **Deep ocean** supports material storytelling, product details, Studio navigation, the contextual order brief and the prototype dialog.
- **Ivory** supplies dark-surface text, the logo support and the proposed Journal/Studio light backgrounds.
- **Stone** supplies supporting dark-surface copy, the primary-button hover fill, selected-order fill and small information surfaces.
- **Muted** supports captions and secondary copy on dark surfaces. **Ink** and **light-muted** serve the ivory surfaces.
- **Line** separates dark controls and panels. Light borders use the source's context-specific literals, recorded with relevant snippets rather than promoted into an invented global scale.

**The Original Identity Rule.** Preserve the current logo bytes and primary colour values. The logo uses `public/brand/rivyalivingart-logo-horizontal-transparent.png` through the local asset map, with no recolouring or CSS filters. Its ivory support is part of this proposed composition.

## Typography

**Display Font:** Instrument Serif, loaded under the CSS family alias `Instrument`, with Georgia and serif fallbacks. The source file is `src/styles/fonts/instrument-serif-normal-400.woff2`.

**Body Font:** Inter with Arial and sans-serif fallbacks. The prototype loads local common 400 and 500 WOFF2 files with `font-display: swap`; `font-synthesis: none` is set. This English-only specimen does not establish Hindi/Gujarati font coverage or rendered acceptance.

### Hierarchy

- **Display / headline:** frontmatter values describe the shared public h1/h2 rules. These are editorial, lightly tightened serif headings; h1/h2 use balanced wrapping.
- **Page overrides:** the Home h1 becomes 72px at widths at or below 1100px and 64px at or below 800px. Product h1 is 72px, then 60px, then 57px at those breakpoints. Journal h1 is `clamp(50px, 5.2vw, 78px)`, then 55px at the mobile breakpoint.
- **Functional titles:** Studio h1 is Inter 500 at 30px, reducing to 25px with 1.25 line height on mobile. The order detail title uses Inter 500 at 24px and 1.25 line height.
- **Body:** shared paragraphs have a 70ch maximum. Hero introduction is constrained to 390px on desktop; this is a composition-specific limit.
- **Article:** desktop reading paragraphs use the article-body token within the 690px reading track; mobile paragraphs become 15px and retain 1.85 line height. Article h2 is 38px on desktop and 35px on mobile.
- **Labels and captions:** caption values are in frontmatter; many Studio labels and control annotations use 11–13px source-specific sizes. No invented modular type scale is implied.

## Layout

Surface modes belong to [DIRECTION.md](https://github.com/rivyalivingart2/RivyaLivingArt2.0/blob/7becabb7b6ee9d98f8786435a6e766e2ed33aaa9/experiments/redesign-phase1/DIRECTION.md): Home is Experience/Persuade, Product is Experience/Operate, Journal is Read and Studio is Operate. These are surface-specific choices, not a single global mode. Four specimens represent a subset of the complete site. The homepage's full 18-slot mapping and the broader route/Studio coverage remain in `docs/redesign/modern-design-2026-10-13/`.

| Surface | Actual desktop composition | At or below 800px |
| --- | --- | --- |
| Public shell | 104px header, 206px logo support with 57px contained logo image, 4vw side padding | 85px header, 167px logo support with 47px contained image, 6vw padding; navigation opens below header |
| Home opening | 43% copy / 57% image; 620px minimum height; 12px top margin | Copy above image; minimum height reset to zero; image frame 410px high |
| Selected gallery | 1.22fr / 1fr tracks, 60px gap, second item offset 140px; image heights 540px / 420px | One column, 35px gap, no offset, 4:5 image frames |
| Material section | 1.1fr / 1fr tracks, 7vw gap; film 4:3 | Copy precedes film, 35px gap; film retains 4:3 |
| Product | 58% gallery / 42% deep-ocean details; main image 660px high | Gallery above details; main image 4:5; 24px gap before details |
| Journal | Equal opening tracks; reading body 230px contents / minmax(0, 690px) article, 7vw gap, max-width 1130px including padding | Stacked opening and reading content; contents become static above article |
| Studio | 222px sidebar / flexible main; workspace minmax(280px, .92fr) / minmax(320px, 1.2fr), 28px gap | Sidebar initially hidden with toggle; list above details; 25px workspace gap |

The intermediate breakpoint at 1100px reduces the Studio sidebar to 190px, page padding to 25px and workspace gap to 18px, with 1fr / 1.1fr workspace tracks. The mobile breakpoint is 800px. Public sections generally use 110px vertical padding, reducing to 70px on mobile; material and closing sections have their own source-defined padding.

Images and video fill their media frames with `object-fit: cover`; the logo uses `contain`. The Home image focal point is 56% horizontally on desktop and 54% on mobile; the product image is centred. These prototype crops do not rewrite stored media associations or production crop settings. Captions retain the design-visualization distinction.

No general one-screen minimum is implemented for every section. The Studio shell uses `min-height: calc(100vh - 42px)` and its mobile main uses `100vh`; the Home hero uses the pixel minimum recorded above. Target review sizes are 1440×1000 desktop and 390×844 browser emulation. These targets do not prove physical-phone, screen-reader, native zoom or full-width acceptance.

## Elevation & Depth

Depth comes from tonal surfaces, imagery, separators and whitespace. There are no raised-card drop shadows or backdrop blurs in the extracted CSS. The `box-shadow` declarations are inset state indicators: a champagne underline for current preview/detail tabs, and a sapphire edge for the selected order. The dialog uses an obsidian translucent backdrop; it does not introduce a general elevation scale.

Motion runs only inside `prefers-reduced-motion: no-preference`: native smooth anchor scrolling; background, text and border-colour transitions of 0.18s on links/buttons; and a one-second opening-image scale from 1.035 to 1 using `cubic-bezier(.22, 1, .36, 1)`. Reduced-motion users receive the static opening image and default anchor navigation. No paragraph reveal, scroll-driven parallax or reusable motion runtime is implemented. The material film starts paused (`preload="none"`); a person may explicitly play or pause it, including under reduced motion. It is muted, loops and plays inline.

## Shapes

Large image frames, content blocks, text actions and primary buttons are rectilinear. Circular 44px icon controls and the 20px status-pill radius are the explicit rounded exceptions. Fine borders and inset selection indicators establish state without lifted containers. The reusable SVG icon geometry uses a 24-unit view box, a 19px displayed size, no fill, current-colour stroke and 1.5 stroke width.

## Components

### Buttons and focus

The primary button is a champagne action with obsidian text, a matching 1px border, a 50px minimum height and 22px icon gap. Hover changes its fill and border to stone. Secondary buttons have transparent backgrounds and line-colour borders; hover changes their border to champagne. The Studio New order variant stays sapphire on hover through its more-specific source rule. Contextual Studio actions use a 44px minimum height and tighter padding.

Focus uses a visible 3px outline with a 5px offset. The default colour is champagne; Studio light surfaces use sapphire and the dark order detail restores champagne. Journal links use sapphire focus. The source does not define a separate pressed transform or a complete disabled-style family. Do not infer such states from this extraction.

### Navigation and previews

The 42px review strip switches Home, Product, Journal and Studio via `?view=` and identifies the current view with an inset underline. Desktop public text links underline on hover. Mobile menu buttons toggle their navigation and `aria-expanded`; Studio has its own sidebar toggle. The logo links to the local Home preview. Public reference links open the current site in a new tab with `noopener`.

### Product gallery and saved state

Three thumbnail buttons switch the displayed River Channel asset and its alternative text. `aria-pressed` and a champagne border identify the chosen thumbnail. The save button toggles its label and `aria-pressed` in the current document only; there is no browser storage or server persistence. Native details/summary components expose the customization, material, care and ordering notes.

### Journal reading

The ivory main surface follows the dark public header and precedes the dark footer. The complete supplied DB001 English article is rendered from local data with section headings and anchored contents. Desktop contents stay sticky at a 30px top offset; mobile contents precede the text. Reading paragraphs do not animate.

### Studio list and contextual brief

The specimen shows the existing 24 explicitly fictional training examples across eight stages, three per stage. Stage selection updates the local list and selects that stage's first example. Search matches the local title/client strings; selecting a row updates the detail panel. Selected rows use stone fill and an inset sapphire edge. Brief, Notes and History are local detail tabs; notes/history display scope explanations rather than fabricated records. The stage select is a visual control; its action shows a prototype notice and does not mutate an order. Printing is represented by a notice, not a generated production card.

The search field has a 44px height, transparent background, ink text and a 1px `#7b909a` border. Stage tabs scroll horizontally on narrow screens. The source assigns tab roles and selected states, but this document does not claim a complete keyboard tab-widget implementation or assistive-technology acceptance.

### Scope dialog and print treatment

Unconnected operational controls open a native modal dialog that explains the action's limits; Close and Return to preview dismiss it. The dialog has a `min(500px, 90vw)` width, 30px padding and dark surface framing. The local server accepts GET/HEAD for an explicit file/asset allowlist on loopback; the prototype fetches local sample JSON and has no operational API connection. A loading message, failure message and noscript explanation exist.

Print CSS hides the review strip, public header, Studio sidebar, review note and buttons; removes sticky article contents; stacks Studio layout; and applies white backgrounds with black text to the designated print surfaces. This is a source description, not verified comprehensive print acceptance.

## Do's and Don'ts

### Do:

- **Do** keep this system scoped to the Phase 1 experiment until the owner approves the composition and authorizes the next phase.
- **Do** preserve the original logo bytes, main colours, content identity, image disclosures and manual sending boundaries.
- **Do** use the actual source values and responsive overrides when reproducing these specimens.
- **Do** keep the ivory Journal and Studio treatment explicitly proposed.
- **Do** retain visible focus, readable initial content, reduced-motion behavior and explicit prototype action notices.
- **Do** keep browser emulation, independent review, owner approval and native/device evidence distinct.

### Don't:

- **Don't** promote this file or its sidecar into a production-wide visual authority or start Phase 2 from this extraction.
- **Don't** recolour the logo, distort product identity or silently turn visualization/training content into real business evidence.
- **Don't** treat four specimens as complete homepage, route, Studio or state coverage.
- **Don't** claim parallax, saved records, publication, authenticated administration, full accessibility acceptance or production integration from this prototype.
- **Don't** invent user research, owner composition approval, events, customer contact information or factual claims.
