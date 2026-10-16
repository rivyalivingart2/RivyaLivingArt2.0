# Cinematic sections — local implementation direction

Owner authorized implementation on 16 October 2026. Starting point: main `ffd863928744df0ae2cf985f6504421842a074db`. This is a local design task, with no new release or publication authorization.

## Visual direction

A continuous dark exhibition, with resin itself supplying the light and colour. Preserve the original logo, typography, copy, brand colours and approved media. Charcoal `#080a0e` is the shared boundary colour; atelier navy `#08283a`, sapphire `#164e6b`, gold `#b89b63`, ivory `#f4f1e9` and muted silver `#a9b4bc` remain the palette. Instrument Serif leads the editorial headings, Inter carries readable body text and controls, and JetBrains Mono remains for small chapter labels.

Use two immersive moving images as the primary visual gesture. Alternate wide material studies, quiet text compositions and usable collection galleries; avoid making every section an identical background-image card. No new marketing claims, invented projects, customer evidence or stock assets.

```
HERO       [ resin film across the viewport              ]
           [ large left-aligned title / actions          ]
           [ existing annotation             film toggle]
TRANSITION [ quiet manifesto; charcoal at both edges    ]
COLLECTION [ editorial introduction / functional gallery ]
MATERIAL   [ full-width grain / text on a shaded field   ]
FILM       [ resin in motion / lower-left copy / control ]
WORLDS     [ three tall image-led doors, copy integrated ]
ATELIER    [ full-width material / aligned editorial copy]
EDITORIAL  [ portfolio / quotes / journal, natural growth]
INVITATION [ centred title / single action / soft glow   ]
```

The initial idea of putting all text over all media was rejected: product information, long quotes, factual disclosures and dense Studio forms need their own stable reading surfaces. Viewport minimums apply to storytelling, never fixed heights that clip content. Compact navigation and the strip variant of the manifesto remain shorter to avoid empty scrolling; its statement variant fills the viewport. Grids and editorial content grow naturally.

## Implementation checklist

- Capture the unchanged local desktop/mobile baseline and the supplied production references.
- Apply shared boundary/lighting/overlay tokens and content-safe viewport minimums.
- Add hero and Resin in Motion video with explicit controls, deferred sources, posters, reduced-motion/data-saving handling and offscreen pause.
- Integrate full-bleed material/atelier images and tall Worlds panels while retaining saved crops, captions and disclosures.
- Refine collections, portfolio, testimonials, principles, process, commission and invitation compositions.
- Align relevant Studio backgrounds and workspace hierarchy without cinematic effects in operational forms.
- Check all eight requested widths; compare original copy, links, metadata and protected data; verify video, keyboard, reduced motion and fallbacks.
- Save screenshots, test evidence, exceptions and a continuation checkpoint. Keep the work local for review.
