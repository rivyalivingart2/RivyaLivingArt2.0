# Optional design resources — 6 October 2026

The owner requested the useful resources from the attached five-repository article. Its practice resource-library page is an example, not a requested new public page. These additions remain local. Existing website typography, editorial records, products, contacts and social details are unchanged.

## Installed and reusable

| Resource | Project installation | Loading behavior |
| --- | --- | --- |
| Poppins | Regular 400 and Semibold 600 local TTF files; `src/lib/fonts/poppins.ts` | Uses Next's local font loader with `display: swap` and no preloading. Only import for a section deliberately using Poppins. The root layout still uses the existing fonts. |
| Lucide | Existing `lucide-react` 1.31.0 | Reuse named imports; no second icon library or upgrade. |
| shadcn/ui | `components.json`, `src/lib/utils.ts`, source-installed Card family | Existing React 19, Tailwind 4, Radix, clsx and tailwind-merge are retained. Three card color defaults use Rivya's existing tokens; scoped public themes still override them. |
| IRA | `public/illustrations/ira/photos-outline.svg` | One 2.5 KB outline object for optional media empty states. It is not an atelier/product photograph and has no production media association. Use a light solid background so its dark outlines remain visible. |
| pattern.css | Exact npm dependency `pattern.css` 1.0.0 | No runtime dependencies or install scripts. Not imported by the application; opt in in the intended route. |

No whole dashboard, new screenshot-editor application, site-wide font replacement, database work, or cloud release is part of this installation.

## Usage

```tsx
import { Search, ArrowRight, Download } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { poppins } from "@/lib/fonts/poppins";

// Apply poppins.className only on a deliberately selected section.
// CardTitle is a layout container: use an appropriate real heading inside it.
<Card className={poppins.className}>
  <CardHeader>
    <CardTitle><h2>Section title</h2></CardTitle>
    <CardDescription>Short supporting text.</CardDescription>
  </CardHeader>
  <CardContent>Content or a descriptive link.</CardContent>
</Card>
```

Keep icon labels visible; decorative icons use `aria-hidden`. Poppins does not replace the established Hindi/Gujarati font fallbacks. Check the actual language and glyph coverage before using it for multilingual copy.

For optional patterns, import `pattern.css/dist/pattern.min.css` in the selected route and use the documented `pattern-dots-sm` class on a decorative block with explicit dimensions and `aria-hidden="true"`. Keep text on a solid surface and do not add this import to the root layout without a reason.

The IRA SVG can be used with Next Image at a modest size, for example 120 × 120 with `alt=""` when adjacent text explains the empty state. Do not let the illustration push the recovery action out of view.

Use the existing theme and inspect diffs when adding further shadcn components. Do not re-run initialization over the application or replace the existing theme with a preset.

## Sources and notices

- Google Fonts Poppins, source commit `8b0a1d0f5983c89bc2b93f1b5fb55f9e252744b5`: https://github.com/google/fonts/tree/8b0a1d0f5983c89bc2b93f1b5fb55f9e252744b5/ofl/poppins. Unmodified selected files; OFL retained in `public/fonts/licenses/poppins-OFL.txt`.
- Lucide: existing notices remain in `docs/sites/licenses/lucide-react-LICENSE.txt`.
- shadcn Card: https://ui.shadcn.com/r/styles/new-york-v4/card.json, retrieved 6 October 2026. Adaptations: local `cn` helper instead of an additional package, existing control radius, shrinkable width and wrapping/line height for longer titles. MIT notice: `docs/sites/licenses/shadcn-ui-LICENSE.md`.
- IRA: https://github.com/ira-design/ira-illustrations/blob/e2e7f9f6aaff3170526a67a2434732e07407fb1e/SVG.zip. Selected archive member `SVG/Outline/Objects/photos.svg`, copied without alteration. MIT notice from main source commit `8436ac247c7120766af00c055b1656b7f2122be0` retained beside the asset.
- pattern.css: https://github.com/bansal/pattern.css, npm 1.0.0 with registry integrity in the lockfile. The upstream README/package declare MIT but do not ship a separate license file; its complete README is preserved in `docs/sites/licenses/pattern-css-README.md`. No invented copyright notice.

## Verification

TypeScript and the production build passed. Lint passed with 0 errors and 62 warnings in pre-existing files. The selected font files have valid TrueType headers; the SVG was visually inspected on a light background and contains no scripts, event handlers, embedded HTML or external references. Package version, lack of runtime dependencies and shadcn aliases were checked. No additional test suite or database access was needed for these optional resources.

These resources are optional building blocks, not a completed visual redesign or proof of hosted performance/human accessibility acceptance. The font helper is not imported by a live route; route-specific font rendering, mobile layout and keyboard review belong to the future section that uses these resources.
