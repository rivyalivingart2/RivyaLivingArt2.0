# Homepage hero and navigation - local review

15 October 2026. Owner requested a redesign of the homepage hero and navigation. Based on released main bf6370832bab8b01b8b3e1549a0b497b287deb35; branch codex/home-hero-navigation.

## Result

Continuous full-width image canvas, larger Instrument Serif heading, directional dark overlay, rounded sapphire primary action, quieter secondary link, and a floating dark navigation frame with the original logo. Navigation remains sticky on inner pages. Mobile retains the existing menu dialog, search and language controls. Existing homepage variants use the new composition; editorial images request full-width responsive assets.

## Preservation

No text, destinations, logo assets, stored media selections/crops, backend logic, authentication, content or database records changed. No image/video added or replaced. Local QA currently uses River Channel for the hero; the production resin media selection is untouched. Existing material film and homepage motion implementation are unchanged. No publication, migration, push, PR or deployment performed. Prior production Studio access-table activation remains a separate task.

## Verification

- Final production-mode local build and TypeScript compilation passed.
- Focused ESLint on the two touched TSX files passed.
- Git whitespace check passed.
- Desktop 1408 x 932, breakpoint 1101 x 850, mobile 390 x 844 and narrow 320 x 740 inspected in the browser; no horizontal overflow observed in checked narrow/breakpoint states.
- Collections menu opens; Escape dismisses it. Search dialog opens and submits River to the existing search-results page with its query preserved.
- Mobile menu opens and closes; collection links, language selector and commission link remain present.
- Featured-piece action unobscured after scrolling on 320px view and opens River Channel. Product-page header verified at 1101px.
- Hindi and Gujarati selectors switch successfully; translated navigation fits at 1101px. Existing local English content fallback remains as designed. No independent language acceptance claimed.
- Browser error log empty during the scoped checks.
- Reduced-motion underline transition disabled; existing homepage motion preference handling retained. No new native-device, screen-reader or full-site certification claimed.

## Visual review

Desktop hierarchy and photo continuity verified. Fixed mobile credit spacing and removed inherited media height cap so the background fills growing content. Fixed stacking isolation so credit links remain clickable above the copy region. Saved desktop.png and mobile.png under ignored test-results/home-hero/.

## Continue

Preview: http://127.0.0.1:4199/. Await owner design review. Do not release this new change without explicit authorization. Do not replay fixtures or publications.
