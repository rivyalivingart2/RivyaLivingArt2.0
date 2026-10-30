---
name: RivyaLivingArt Phase 2 local motion and media foundation
description: Source-extracted extension of the approved contemporary material gallery direction; local review only.
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
  field-border: "#74838b"
  studio-divider: "#b6b7b4"
typography:
  display:
    fontFamily: "Instrument, Georgia, serif"
    fontSize: "clamp(58px, 6.7vw, 96px)"
    fontWeight: 400
    lineHeight: 1.06
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Instrument, Georgia, serif"
    fontSize: "clamp(38px, 4.5vw, 64px)"
    fontWeight: 400
    lineHeight: 1.06
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.75
  button:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.4
  media-title:
    fontFamily: "Instrument, Georgia, serif"
    fontSize: "28px"
    fontWeight: 400
    lineHeight: 1.2
  studio-title:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "32px"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0"
  studio-row:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 500
    lineHeight: 1.5
  caption:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "12px"
    lineHeight: 1.7
rounded:
  control: "0"
spacing:
  section: "100px 6vw"
  section-mobile: "64px 6vw"
  control-gap: "12px"
  field-gap: "8px"
  field-padding: "10px 12px"
components:
  button-primary:
    backgroundColor: "{colors.champagne}"
    textColor: "{colors.obsidian}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "12px 22px"
  button-primary-hover:
    backgroundColor: "{colors.stone}"
  button-secondary:
    backgroundColor: "transparent"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "12px 22px"
  button-studio:
    backgroundColor: "{colors.sapphire}"
    textColor: "{colors.ivory}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "12px 22px"
  button-studio-hover:
    backgroundColor: "{colors.ocean}"
  field:
    backgroundColor: "transparent"
    rounded: "{rounded.control}"
    padding: "{spacing.field-padding}"
    width: "100%"
  section:
    padding: "{spacing.section}"
  section-mobile:
    padding: "{spacing.section-mobile}"
---

# Design System: RivyaLivingArt Phase 2 local motion and media foundation

## Overview

**Creative North Star: "Contemporary material gallery"**

The owner approved the Phase 1 previews and authorized Phase 2 only. This record extracts the additive foundation and its local animation/media specimen. It extends the approved palette and direction; it does not establish root design authority, public or Studio route integration, or authorization for Phase 3. Animation and media remain subject to owner review before that next phase.

Resin imagery leads the public experience within dark ocean framing, restrained champagne actions and generous spacing. Ivory reading and working surfaces support sustained attention; serif public headings pair with functional Inter controls. The original logo, main colours, existing product story and Journal excerpt remain intact. Qualitative language follows the approved direction rather than an invented research or creative interview.

Sources: [PRODUCT.md](../../PRODUCT.md), [DIRECTION.md](https://github.com/rivyalivingart2/RivyaLivingArt2.0/blob/7becabb7b6ee9d98f8786435a6e766e2ed33aaa9/experiments/redesign-phase2/DIRECTION.md), [README.md](README.md), [App.tsx](App.tsx), [styles.css](styles.css), [media-manifest.json](media-manifest.json), and all six files in [design-foundation](../../src/components/design-foundation/). The normative extracted values above apply to this scope; source remains implementation truth. The adjacent [.impeccable/design.json](.impeccable/design.json) holds extensions and static component specimens. No root DESIGN.md is created or replaced.

**Key Characteristics:**

- Original identity and existing content remain intact.
- Public image movement is shallow, optional and capability-aware.
- Reading copy stays visible and does not animate.
- Media playback begins only by explicit user action.
- Studio uses native scrolling and local, clearly labelled controls.
- Foundation components remain opt-in and disconnected from operational routes.

This is source documentation, not a new browser verification run, private database audit, native-device or screen-reader acceptance, independent language review or production certification. The finish disposition supplied for this pass is ship at local-preview scope after three corrections. The detector limitation remains recorded in DIRECTION.md; it is not a successful detector result.

## Colors

The retained palette uses dark material framing, warm ivory and champagne, with sapphire for functional Studio actions. The first nine frontmatter colours correspond to scoped `--rv-*` properties; light-muted, field-border and studio-divider are actual reused literals, not newly introduced global tokens.

### Primary

- **Champagne** supplies public primary actions, dark-surface focus, pressed motion-control borders and selection colour.
- **Sapphire** supplies Studio action fill, light-surface focus, the field caret and the published Journal link.

### Neutral

- **Obsidian** anchors the public foundation and preview strip; **deep ocean** supports the material and closing sections, Studio sidebar and media fallback frames.
- **Ivory** is dark-surface text, logo backing and the reading/Studio/crop-dialog background; **ink** is light-surface text.
- **Stone** supports public copy and primary-action hover; it also backs the uncropped image comparison.
- **Muted** supports captions on dark surfaces; **light-muted** serves reading and Studio supporting text. The sidebar disclosure explicitly restores muted for its dark backing.
- **Line**, **field-border** and **studio-divider** distinguish dark controls, light inputs and Studio rows respectively.

**The Original Identity Rule.** Preserve original logo bytes, main colour values, product identity and media disclosures. The logo remains contained on ivory without recolouring or filters.

## Typography

**Display Font:** Instrument Serif, loaded locally as `Instrument`, with Georgia and serif fallbacks. **Body Font:** local Inter 400/500 with Arial and sans-serif fallbacks. All three font faces use swap; the foundation disables font synthesis. This English specimen does not establish Hindi/Gujarati typography acceptance.

- Shared h1/h2 use balanced wrapping and a bottom margin of 24px. The frontmatter records their foundation baselines.
- The opening h1 overrides display size to `clamp(58px, 6.3vw, 90px)`, then 64px at 1100px and 62px at 800px. Mobile material h2 is 48px; reading/closing h2 is 49px.
- Shared paragraphs have a 70ch maximum; opening copy uses 400px and material copy 380px on desktop. Reading article copy inherits 15px with 1.85 line height and a 65ch maximum. Its h3 is Instrument 400, 34px/1.15.
- Media titles use the media-title role. Supporting media copy uses 12px/1.65; film captions use 12px with inherited body line height. The caption role records the separate small-disclosure style.
- Studio page and media-row headings use the Inter roles above. Control states h2 inherits Instrument and sets 36px, matching the direction's explicit serif treatment for that heading.
- Crop-dialog h2 is 40px, reducing to 32px on mobile. Controls retain Inter with the button role; fields inherit body typography.

## Layout

The public specimen moves from Experience to Read; Studio is Operate. Foundation tokens are scoped under `.rv-foundation`; importing its CSS and adding that boundary are explicit future integration steps. Existing public/Studio routes are not connected to these components.

| Surface | Implemented desktop layout | At or below 800px |
| --- | --- | --- |
| Preview strip | Fixed, 52px minimum height; matching content offset | Public strip absolute, wrapping, 94px minimum and content offset; Studio strip remains 52px |
| Public header | 104px minimum; 18px 4vw padding; 206px ivory logo backing, image 57px high | 95px minimum; 16px 6vw padding; 164px backing, 47px image; stacked nav links, last link hidden |
| Opening | 43% copy / 57% image; 650px minimum | Copy above image; section minimum removed; image minimum 420px |
| Material | 1fr / 1.1fr; 7vw gap; 760px minimum; film 4:3 | Stacked, 38px gap, section minimum removed |
| Media | Three columns; 56px by 30px gaps; second/fifth items offset 65px | One column, 40px gaps, no offsets |
| Reading | 1fr / 1.1fr; 7vw gap; 700px minimum | Stacked, minimum removed, article starts 40px below introduction |
| Closing | Centred flex column, 520px minimum | 550px minimum; wrapped centred actions |
| Studio | 230px sidebar / flexible content; 100vh minimum; body 50px 5vw, max 1150px | Stacked sidebar/body; body 35px 6vw |
| Crop dialog | Width min(1080px, 94vw), max-height 90vh; 30px padding; 1.2fr / 1fr comparison | 20px padding; single column, 26px gap |

The intermediate max-width 1100px query reduces the material gap to 5vw and media to two columns; it removes the fifth-item offset while keeping the second-item offset until 800px. Foundation section padding and its mobile override are in frontmatter; anchors use a 100px scroll margin. These are observed pixel minima, not a universal one-screen section contract.

Images fill their frames with cover; the logo and full-composition dialog image use contain. Media cards and portrait comparisons are 4:5. The full comparison uses a 390px frame, then 280px on mobile. Studio thumbnails are 96px square, then 72px by 86px. Parallax frames clip an absolutely positioned picture of 110% height at top -5%; this overscan remains in the static composition.

## Elevation & Depth

Depth comes from imagery, tonal surfaces and fine separators. There is no raised-card shadow vocabulary or backdrop blur. Shadows only mark state: the current preview link has a 2px inset champagne underline, and pressed foundation buttons have a 3px inset current-colour underline. The native crop dialog dims the page with an obsidian backdrop at 87% opacity.

MotionSurface uses scoped GSAP/ScrollTrigger effects only when the viewport is at least 900px, hover is available, the primary pointer is fine, and reduced motion is not requested. Heading settling begins at y=28px, lasts 0.85s with `expo.out`, and runs once from `top 90%`; opacity never changes. Images scrub from yPercent -3 to +3 with linear easing between `top bottom` and `bottom top`. Reading text and Studio are outside these effects.

Optional smooth anchors use the document's native `scroll-behavior`, restoring its prior inline value on changes/unmount. GSAP context and media-query cleanup revert scoped effects. **No ScrollSmoother remains.** There is no transformed page wrapper, pinning or inertial Studio scrolling. The preview defaults both preferences on, but labels and pressed states reflect effective capability: unsupported/reduced-motion/touch environments show disabled **Static motion** and **Native scrolling** controls with false pressed states. Turning Motion off also disables smooth scrolling. Opening the crop dialog pauses scoped motion/smoothing until it closes.

Foundation button colour transitions last 0.18s only without reduced motion. Media-image hover scales to 1.025 over 0.4s ease-out only with hover and no reduced motion; this CSS hover condition is separate from the 900px GSAP capability query. Native film playback remains available by explicit request under reduced motion.

**The Visible Content Rule.** Text remains readable before JavaScript and throughout motion; motion never gates content access.

## Shapes


Buttons, fields, image frames and content sections are rectilinear. Foundation controls explicitly use zero radius and fine borders; this scope has no pill or circular-button primitive. The preview arrow is an inline 24-unit SVG displayed at 20px with current-colour stroke, no fill and 1.5 stroke width.

## Components

### Buttons, fields and status

Button exposes primary, secondary and studio variants. Each uses a 48px minimum height, 12px icon gap and the frontmatter padding/type. Primary hover becomes stone; secondary hover changes its line border to current colour; Studio hover becomes ocean. Hover fills are restricted to hover-capable devices. Disabled buttons use opacity .55 and a not-allowed cursor; pressed state uses the inset indicator described above. No distinct active transform is implemented.

Focus is a 3px champagne outline offset 5px; `.rv-light` changes it to sapphire. Field has a 38rem maximum, associated generated or supplied label ID, 48px minimum input height, transparent fill and sapphire caret. Hints and errors share an associated message ID; errors use role alert, aria-invalid and a 2px border, with no invented error colour. Status uses role status, 13px text and 24px minimum height.

### Navigation and motion controls

Public section links use native anchors; hover underlines the header links. The visible skip link appears on focus. The local preview strip links Animation, Media & crops and Studio controls, with an inset current-view indicator. Motion controls use their own compact 36px minimum height, reducing to 32px on mobile; their disabled opacity is .5. These review controls and diagnostics are experiment-only, not future public product UI.

### ResponsivePicture and media inspection

ResponsivePicture accepts intrinsic dimensions, alt text, AVIF/WebP variants and separate desktop/mobile focal pairs. AVIF sources precede the WebP image srcset; the final WebP variant is the fallback when available. Loading is lazy and decoding async by default; priority makes the opening eager with high fetch priority. Missing variants or load errors produce a labelled, readable image-unavailable fallback with a 220px minimum height.

Focal values become scoped CSS properties; mobile selection changes at 800px. The existing River Channel room uses desktop 56% 50% and mobile 54% 50%. New asset crops are manifest proposals only. Six Drive sources, original hashes/dimensions and 36 derivatives are recorded in the manifest; each new Studio ID remains null. Neither download nor appearance proves workers, customers, completed projects or creator permissions.

Image buttons open a native modal dialog with source composition and proposed 4:5 crop. Background body scrolling locks while open; scoped motion pauses. Close or Escape dismisses the dialog, restores prior overflow and returns focus to the opener without scrolling. Drive links open with noopener/noreferrer. No saved crop or media association changes.

### MaterialFilm

The film is a 4:3 cover frame with poster, native controls and a separate Play film / Pause film button synchronized to video events. MP4 is first, optional WebM second. It is muted, looping, inline and preload none; there is no autoplay. Leaving the viewport or hiding the document pauses it, and returning does not automatically resume it. Unmount cleanup pauses it and removes observers/listeners. Playback rejection and media errors produce readable status messages; the description identifies an eight-second silent visualization. Film controls and poster remain available without JavaScript, while the custom button requires hydration.

### Studio controls specimen

Studio does not mount MotionSurface. Search filters the six local media titles/alt descriptions and announces no matches. Rows expose original dimensions and size without connecting to records. Caption/hint, invalid-field and disabled-publication examples demonstrate states. Test local confirmation changes only the local status to “No record was saved.” The disabled publication control has no write path.

Print rules remove review/navigation/action framing, restore normal flow and transforms, and use light printable surfaces. This records source behavior without claiming comprehensive print acceptance.

## Do's and Don'ts

### Do:

- **Do** keep this foundation scoped to the authorized Phase 2 local preview until owner animation/media review and explicit Phase 3 authorization.
- **Do** preserve logo bytes, main colours, existing content, stored media associations and manual sending boundaries.
- **Do** report effective static motion states and keep Studio and reading text on native, readable layouts.
- **Do** preserve explicit film playback, visible focus, media failure messages and crop-dialog focus restoration.
- **Do** distinguish source extraction, local browser receipts, owner review and native/device/human evidence.

### Don't:

- **Don't** promote these files to root design authority or claim full-site implementation, private database verification or production acceptance.
- **Don't** add ScrollSmoother, transformed page scrolling, hidden text reveals or Studio parallax from this specimen.
- **Don't** publish selections, assign fabricated Studio IDs, save proposed crops or infer business evidence from visualization assets.
- **Don't** ship experiment labels, review controls or diagnostics as public product UI.

Historical documentation drift remains intentionally untouched: Phase 1 DESIGN.md and its sidecar still describe approval as pending and Phase 2 as not started; PRODUCT.md and this phase's DIRECTION.md carry the current approval boundary. This observation does not authorize edits outside this extraction.
