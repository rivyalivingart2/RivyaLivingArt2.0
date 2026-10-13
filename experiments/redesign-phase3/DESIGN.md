---
name: RivyaLivingArt Phase 3 homepage and shared public frame
description: Source-extracted contemporary material gallery integrated into local homepage routes and public framing.
colors:
  obsidian: "#080a0e"
  ocean: "#08283a"
  sapphire: "#164e6b"
  sapphire-hover: "#1d6389"
  champagne: "#b89b63"
  ivory: "#f4f1e9"
  stone: "#ddd6cb"
  muted: "#a9b4bc"
  ink: "#18202a"
  light-copy: "#384856"
  control-border: "#78828c"
  chapter-line: "#b89b633b"
  strong-line: "#b89b6366"
typography:
  display:
    fontFamily: "var(--font-instrument), Georgia, serif"
    fontSize: "clamp(54px,6.1vw,96px)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-.03em"
  headline:
    fontFamily: "var(--font-instrument), Georgia, serif"
    fontSize: "clamp(40px,5vw,76px)"
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: "-.03em"
  title:
    fontFamily: "var(--font-instrument), Georgia, serif"
    fontSize: "clamp(26px,3vw,38px)"
    fontWeight: 400
    lineHeight: 1.2
  body:
    fontFamily: "var(--font-inter-common), var(--font-inter), Arial, Helvetica, sans-serif"
    fontSize: "17px"
    lineHeight: 1.6
  action:
    fontFamily: "var(--font-inter-common), var(--font-inter), Arial, Helvetica, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    letterSpacing: "0.025em"
  reference-eyebrow:
    fontFamily: "var(--font-inter-common), var(--font-inter), Arial, Helvetica, sans-serif"
    fontSize: "13px"
    lineHeight: 1.6
    letterSpacing: ".035em"
  footer-title:
    fontFamily: "var(--font-instrument), Georgia, serif"
    fontSize: "26px"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "0"
rounded:
  rectilinear: "0"
spacing:
  gutter: "clamp(20px, 5vw, 88px)"
  chapter: "clamp(80px,9vw,144px)"
  chapter-mobile: "72px 24px"
  hero-copy: "clamp(40px,6vw,96px) clamp(24px,4vw,64px)"
  hero-copy-mobile: "56px 24px 48px"
  action: "12px 18px"
  header-action: "12px 20px"
  film-action: "12px 24px"
  search-field: "14px"
components:
  button-primary:
    backgroundColor: "{colors.sapphire}"
    textColor: "{colors.ivory}"
    typography: "{typography.action}"
    rounded: "{rounded.rectilinear}"
    padding: "{spacing.action}"
  button-primary-hover:
    backgroundColor: "{colors.sapphire-hover}"
  header-action:
    backgroundColor: "{colors.ivory}"
    textColor: "{colors.ink}"
    rounded: "{rounded.rectilinear}"
    padding: "{spacing.header-action}"
  film-action:
    backgroundColor: "{colors.ivory}"
    textColor: "{colors.ink}"
    rounded: "{rounded.rectilinear}"
    padding: "{spacing.film-action}"
  search-field:
    backgroundColor: "{colors.ocean}"
    textColor: "{colors.ivory}"
    rounded: "{rounded.rectilinear}"
    padding: "{spacing.search-field}"
  category-copy:
    backgroundColor: "#080a0ef2"
    textColor: "{colors.ivory}"
    padding: "22px"
  logo-backing:
    backgroundColor: "{colors.ivory}"
    rounded: "{rounded.rectilinear}"
    padding: "8px 12px"
    width: "198px"
    height: "60px"
---

# Design System: RivyaLivingArt Phase 3 homepage and shared public frame

## Overview

**Creative North Star: "Contemporary material gallery"**

Resin imagery leads within obsidian and ocean framing, with warm ivory reading intervals and restrained champagne details. Large serif headings, asymmetrical photographic groups and generous chapter spacing give existing content a deliberate reading rhythm. This language carries forward the owner-approved Phase 1 and Phase 2 direction; it does not introduce a new visual-world choice.

Phase 3 brings that direction into the real homepage renderers and shared public header, navigation, search entry, mobile menu and footer. This document governs that local implementation only. Other website page bodies and Studio remain incumbent or future-phase work; Phase 4 and release remain gated. Original logo assets, main colours, published text, saved conditions, media associations, focal positions and functionality constrain the visual treatment.

Sources: [DIRECTION.md](DIRECTION.md), [PRODUCT.md](../../PRODUCT.md), [modern homepage styles](../../src/components/shop/modern-homepage.module.css), [reference homepage styles](../../src/components/shop/reference-homepage.module.css), [public frame styles](../../src/components/shop/public-frame.module.css), [homepage document](../../src/components/shop/homepage-document.tsx), [reference renderer](../../src/components/shop/reference-homepage.tsx), [homepage styles](../../src/components/shop/homepage.module.css), [shared styles](../../src/components/shop/shop.module.css), [root tokens](../../src/styles/tokens.css), [header](../../src/components/shop/header.tsx), [frame](../../src/components/shop/shop-frame.tsx), [fallback renderer](../../src/components/shop/shop-site.tsx), [motion loader](../../src/components/shop/homepage-motion.tsx), [motion runtime](../../src/components/shop/homepage-motion-runtime.ts), [dialog](../../src/components/shop/dialog.tsx), and [film](../../src/components/shop/material-film.tsx). Frontmatter records actual reused values, including inherited styles; source remains implementation truth. The adjacent [.impeccable/design.json](.impeccable/design.json) carries extensions and static component specimens. No root design authority is created.

**Key Characteristics:**

- Original identity, source content and stored presentation choices remain intact.
- Dark photographic chapters alternate with quiet ivory reading and closing surfaces.
- Category images keep stable targets; asymmetry comes from composition, not hover expansion.
- Content is server rendered and visible before optional motion loads.
- Film playback requires deliberate input; navigation and dialogs retain native behavior.
- Local integration and browser evidence remain separate from native, human and release acceptance.

Independent finish review supplied to this documenter returned **ship** across all five review sections with no material local Phase 3 fixes. Existing receipts report 58 route checks, 40 fixture checks and 16 edge checks; this documentation pass did not rerun the browser. The four fixtures cover all 18 conditional templates, classic rendering, editorial hero and empty data, at 1440, 768, 390 and 320px. Receipt links and capture limitations are recorded in the sidecar. Detector/context launchers were unavailable due to the Windows batch-label failure; unavailable is not passed.

Preserved historical drift: root PRODUCT.md still states Phase 2 only, pending Phase 3 authorization and disconnected route integration. Phase 2 DESIGN.md/sidecar retain that earlier boundary; Phase 1 documentation retains approval-pending wording. The explicit Phase 3 authorization in DIRECTION.md and the current session supersede those historical status statements for this scope. Those files were not repaired during this extraction. Existing shared card/chapter styles also reference `--hairline`, but no declaration was found under src; their declared thin border must not be described as a verified visible rule. This source drift is reported without repair.

## Colors

Dark material framing and warm light surfaces retain the approved main palette. The frontmatter preserves source colour spelling; chapter-line and strong-line are alpha-bearing separator values, not new palette accents.

### Primary

- **Sapphire** is the inherited public primary action fill and the commission chapter surface; sapphire-hover belongs to the existing action hover state.
- **Champagne** marks focus, selection, reference eyebrows, process rules and quiet structural accents. Phase 2's champagne button specimen is not the integrated Phase 3 primary button.

### Neutral

- **Obsidian** anchors the opening, main chapters, image notes and header. **Ocean** supplies material, maker, journal, search input and footer surfaces.
- **Ivory** supports light reading intervals, original-logo backing, film/header actions and dark-surface text; **ink** is their dark text partner.
- **Stone** supports opening and footer copy. **Muted** serves dark-surface supporting text; **light-copy** supports ivory manifesto and closing paragraphs.
- **Control-border** remains the inherited action boundary. **Chapter-line** and **strong-line** separate chapters, tiles and quotation groups.

**The Original Identity Rule.** Preserve original logo bytes and main colour values; keep the logo contained on ivory without filters or recolouring.

## Typography

**Display Font:** existing locally loaded Instrument Serif through the root display variable. **Body Font:** existing local Inter subsets through the root body variable. **Data Font:** existing JetBrains Mono through the root data variable for product identifiers and counts. The frontmatter preserves the actual variable stacks; the self-hosted font setup remains in the application layout.

The display and headline roles describe modern homepage h1/h2, with balanced wrapping. Reference h3 uses the title baseline; reference tiles, quotes, product titles and journal titles retain local overrides. Body records the shared site baseline; modern homepage paragraphs use line-height 1.8. Reading copy and controls remain still during heading enhancement.

- Hero h1 is limited to 11ch, then 12ch on mobile. Its intermediate size is clamp(52px,6.4vw,76px); mobile is clamp(52px,12vw,76px). Opening paragraphs use 38ch and 17px, reducing to 16px on mobile.
- Reference manifesto headings use clamp(44px,6vw,88px), limited to 22ch; strip mode uses 28px. The modern outer homepage h2 line-height and letter-spacing still apply. Invitation headings use clamp(52px,7vw,96px), limited to 17ch.
- Reference introductory copy is 16px; manifesto copy is 17px and 44ch. General reference copy is limited to 64ch. Journal body is 15px/1.7; its titles use clamp(30px,2.6vw,40px), then 34px on mobile.
- Shared header links are 14px with zero tracking. Footer copy is 16px/1.75, links 15px and the closing row 13px/1.7. Modal titles use clamp(38px,4vw,58px)/1.1.
- Existing uppercase homepage eyebrows remain where inherited from shared styles; reference eyebrows use normal case. Their source words are preserved. Hindi/Gujarati browser checks do not certify native-language typographic acceptance.

## Layout

The homepage has three source paths: versioned reference composition, classic saved-document composition and the existing no-document fallback. Their content conditions remain in source. The reference renderer keeps these 18 slot keys in configured order: pour, manifesto, pieces, large-format, material, collections, furniture, maker, rooms, work, words, bespoke, workshops, print, process, why, journal and closing. Unavailable records stay absent. Offering bands require a confirmation source; fictional feedback and concept projects keep their disclosures.

| Composition | Desktop | Responsive treatment |
| --- | --- | --- |
| Split opening | 0.86fr / 1.14fr copy/image; minimum calc(100svh - inherited header-height); image minimum 620px | At 780px, copy then image, image minimum 520px; saved cinematic mode also stacks |
| Cinematic opening | Image spans both columns; copy occupies first column on near-opaque obsidian; note starts after the copy column | Same mobile content order and readable copy backing as split |
| Main chapters | Fluid chapter spacing and root gutter; reference bands retain 100vh/100svh minima | At 780px, 72px 24px padding and reference-band minimum removed |
| Selected gallery | Three columns, 64px by 32px gaps; saved bento uses 1.35fr / 1fr, 72px by 5vw gaps, alternating 120px offsets and every third image 5:4 | One column, 48px gaps and no offsets at 780px |
| Reference headings and tiles | Heading 1.15fr / .75fr, 8vw gap; two-column tiles, 48px by 8vw gap | Headings stack at 1100px; tiles stack at 780px |
| Collection doors | Three stable columns, 32px gap, 3:4 frames, 480px minimum; middle columns offset 56px | Two columns and 400px minimum at 1100px; one column, 4:5 frames and no offsets at 780px |
| Portfolio and quotes | Two columns; portfolio even items offset 100px; rooms use 3:2 images | One column at 780px; offsets removed |
| Process | Four columns | Two at 1100px, one at 780px; at 480px the retained number/copy arrangement becomes compact |
| Material film | 16:9 contained video; chapter-height frame section | 4:3 contained video and no section minimum at 780px |
| Footer | 1.7fr brand column plus three link columns; 40px gap | Brand spans three columns at 1100px; two link columns and full-width final section at 600px |

Header heights are scoped locally to 88px, 80px at 1100px and 76px at 600px. Root inherited header-height values used by homepage calculations remain 80px, 72px at 1200px and 64px at 780px; they are distinct existing variables, not a single synchronized measurement. Header logo backing reduces from the frontmatter baseline to 180px by 54px, then 158px by 48px; the footer retains its desktop backing. Desktop navigation yields to the menu at 1100px. A native noscript disclosure exposes the same navigation destinations without hydration.

Reference chapter anchors have a 100px scroll margin. The contents disclosure uses a three-column list, stacking at 780px; classic contents retain their existing intermediate 980px two-column query. Atelier imagery becomes sticky only at 1000px and above. Cover images preserve existing inline focal positions; editorial desktop/mobile crops switch at 780px. Logo and film composition use contain. Empty collection categories retain their existing monogram fallback.

## Elevation & Depth

Imagery, dark/light chapter changes and fine separators carry most depth. The header has no shadow or blur, and shared card images have no resting shadow. The collection dropdown retains a shadow (0 18px 40px #0005); native dialogs retain their inherited panel shadow (0 12px 32px #0004). The Phase 3 modal backdrop is opaque-tinted obsidian without backdrop blur. These overlays do not establish a raised-card vocabulary.

Homepage enhancement imports GSAP after a 600ms delay only when the viewport is at least 900px, hover is available, the pointer is fine and reduced motion is not requested. Image parallax scrubs from -3 to +3 yPercent; CSS reserves 108% image height with 4% overscan on each side under the same capability query. Selected/story heading matches settle from y=28 over .85s with expo.out, once from top 90%; opacity is untouched. These are two heading categories in the standard composition, and the fallback renderer can contain multiple selected matches.

Eligible enhancement temporarily sets native document smooth anchor behavior. Query changes and route unmount revert GSAP context, cancel refresh and restore the prior inline scroll behavior. A failed dynamic import leaves the server-rendered static page intact. There is no transformed page wrapper, scroll hijack, pinning or ScrollSmoother. Existing shared CSS control/image effects remain separate from the new GSAP effects. The modal entry translates 8px over 180ms ease-out only without reduced motion; category caption background changes over 180ms ease under the same motion preference.

**The Visible Content Rule.** Text remains readable before JavaScript and throughout motion; enhancement never gates access to content or controls.

## Shapes

Integrated homepage links/buttons, shared frame controls and image cards are rectilinear. The original logo sits on a flat ivory rectangle. Category captions occupy the bottom of stable photographic frames rather than expanding their columns on hover. Fine horizontal rules establish chapters, tiles, disclosures and process steps. Existing small badges retain their incumbent shape; this scope does not redefine all site or Studio primitives.

## Components

### Actions and search field

Public primary actions retain the inherited sapphire fill, ivory text, control border, 48px minimum height and 48px minimum width. The modern homepage/frame overrides their former radius. Hover uses sapphire-hover; disabled opacity is .55 with not-allowed cursor. Later shared rules remove active scale transforms. Header and film actions use the ivory variants in frontmatter; the invitation primary uses ocean with ivory text. Text links retain their existing underline/border and arrow treatment.

The modal search input has ocean fill, ivory text, muted border, champagne caret, 56px minimum height and the frontmatter padding. It preserves its label, search type, q name, 100-character limit and native GET form action. It receives initial focus when the dialog opens. No new search/filter or error model is introduced.

### Navigation and overlays

The desktop collections control remains native details/summary. Escape closes and focuses its summary; focus departure, outside pointer and selection close it. Current routes retain aria-current. Mobile menu and search use a native dialog with explicit Tab wrapping, Escape/backdrop close, body-scroll locking and opener-focus restoration; a missing opener falls back to main content. Route changes remount header state, and widening to 1101px closes the mobile menu. Modal close is placed above its heading on narrow layouts through the frame's column-reverse header treatment.

Frame and homepage focus use a 2px champagne outline offset 5px; the ivory invitation changes its outline to sapphire. Original logo bytes and original navigation/business/footer values are untouched. Header logo filters are explicitly removed by the scoped frame style. Locale selectors retain their existing data paths.

### Contents, cards and category doors

The reference contents component uses native details and anchors, and appears only for at least two visible slots. It is functional without JavaScript. Product cards retain source names, subtitles, identifiers, pricing rules, routes, media/crops and the separate saved-piece control. Cards are flat and retain their inherited border declaration, whose unresolved hairline variable is noted above; selected gallery frames override the shared card aspect ratio without redefining cards throughout the website.

Category doors link to the existing encoded category search. Their image is still selected from an existing matching-category product; absent imagery produces the existing first-letter monogram. Pointer hover changes caption backing to ocean where the retained cascade applies; dimensions remain stable. Further categories remain in a native disclosure. The sidecar includes source-derived static action, field, navigation, contents, card and disclosure specimens; snippets do not perform app mutations.

### Film and conditional editorial bands

Material film keeps native controls, muted loop, playsInline and preload=none, with no autoplay. Poster loading starts near the frame using an 800px observer margin. Playback begins only through explicit controls, pauses offscreen or when the document is hidden, and never automatically resumes. Failure replaces video with the original still and an explicit unavailable message. The print-only still is preserved. This integrated film uses contain, unlike the earlier Phase 2 specimen's cover treatment.

Conditional portfolio, testimonial and offering sections use only eligible source records. Disclosures stay visible beside the material they qualify. Fixture records exercise these templates locally and do not establish public availability or legitimate customer/business evidence.

## Do's and Don'ts

### Do:

- **Do** keep this authority limited to the Phase 3 homepage and shared public frame, with further phases and release gated.
- **Do** preserve original identity, content, stored conditions, selected media, crops, routes and manual sending boundaries.
- **Do** keep image frames filled while retaining logo and film containment and existing focal positions.
- **Do** keep text visible, native scrolling intact, film playback deliberate and dialog focus recoverable.
- **Do** distinguish local browser receipts, synthetic fixtures, independent finish review, owner acceptance and native/device/human evidence.

### Don't:

- **Don't** promote this scoped extraction into root design authority or redesign other page bodies or Studio from it.
- **Don't** activate optional offerings, relabel fictional feedback, assign proposed media to records or infer customer evidence from visualizations.
- **Don't** add hidden text reveals, expanding category columns, scroll hijacking or autoplay.
- **Don't** equate the local ship disposition or unavailable detector with production, physical-device, screen-reader or language acceptance.
- **Don't** repair historical Phase 1/2 or PRODUCT.md status wording as part of this documentation-only extraction.
