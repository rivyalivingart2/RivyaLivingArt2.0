# Optional design resources — current availability, 19 October 2026

The original 6 October setup followed the owner's request for useful resources from a five-repository article. Its practice resource-library page was an example, not a requested public page. The confirmed-unused cleanup on 19 October removed two unused entry points described below. This page documents current availability; the dated release decision preserves the original installation history. Existing website typography, editorial records, products, contacts and social details are unchanged.

## Available resources and removed entry points

| Resource | Project installation | Loading behavior |
| --- | --- | --- |
| Poppins assets | Regular 400 and Semibold 600 local TTF files and OFL notice retained; unused loader removed | No `@/lib/fonts/poppins` import is available. The application continues using its established fonts and language fallbacks. Retained assets are historical source material, not a recommendation to add a new font. |
| Lucide | Existing `lucide-react` 1.31.0 | Reuse named imports; no second icon library or upgrade. |
| shadcn/ui | `components.json`, `src/lib/utils.ts`, source-installed Card family | Existing React 19, Tailwind 4, Radix, clsx and tailwind-merge are retained. Three card color defaults use Rivya's existing tokens; scoped public themes still override them. |
| IRA | `public/illustrations/ira/photos-outline.svg` | One 2.5 KB outline object for optional media empty states. It is not an atelier/product photograph and has no production media association. Use a light solid background so its dark outlines remain visible. |
| pattern.css | Removed unused dependency; upstream README/notice retained | Not installed or available for import. Existing application gradients and textures remain the current styling system. |

No whole dashboard, new screenshot-editor application, site-wide font replacement, database work, or cloud release is part of this installation.

## Usage

```tsx
import { Search, ArrowRight, Download } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

// CardTitle is a layout container: use an appropriate real heading inside it.
<Card>
  <CardHeader>
    <CardTitle><h2>Section title</h2></CardTitle>
    <CardDescription>Short supporting text.</CardDescription>
  </CardHeader>
  <CardContent>Content or a descriptive link.</CardContent>
</Card>
```

Keep icon labels visible; decorative icons use `aria-hidden`. Preserve the established Hindi/Gujarati font fallbacks and verify actual glyph coverage for any separately authorized typography change.

Do not copy the former Poppins helper or pattern-package usage snippets: those unused entry points were removed. Reuse current application tokens and scoped gradients for decorative treatments; keep readable text surfaces and accessible focus indicators.

The IRA SVG can be used with Next Image at a modest size, for example 120 × 120 with `alt=""` when adjacent text explains the empty state. Do not let the illustration push the recovery action out of view.

Use the existing theme and inspect diffs when adding further shadcn components. Do not re-run initialization over the application or replace the existing theme with a preset.

## Sources and notices

- Google Fonts Poppins, source commit `8b0a1d0f5983c89bc2b93f1b5fb55f9e252744b5`: https://github.com/google/fonts/tree/8b0a1d0f5983c89bc2b93f1b5fb55f9e252744b5/ofl/poppins. Unmodified selected files; OFL retained in `public/fonts/licenses/poppins-OFL.txt`.
- Lucide: existing notices remain in `docs/sites/licenses/lucide-react-LICENSE.txt`.
- shadcn Card: https://ui.shadcn.com/r/styles/new-york-v4/card.json, retrieved 6 October 2026. Adaptations: local `cn` helper instead of an additional package, existing control radius, shrinkable width and wrapping/line height for longer titles. MIT notice: `docs/sites/licenses/shadcn-ui-LICENSE.md`.
- IRA: https://github.com/ira-design/ira-illustrations/blob/e2e7f9f6aaff3170526a67a2434732e07407fb1e/SVG.zip. Selected archive member `SVG/Outline/Objects/photos.svg`, copied without alteration. MIT notice from main source commit `8436ac247c7120766af00c055b1656b7f2122be0` retained beside the asset.
- pattern.css (historical): https://github.com/bansal/pattern.css, originally npm 1.0.0; removed from the current manifest and lockfile. The upstream README/package declare MIT but do not ship a separate license file; the original README is preserved in `docs/sites/licenses/pattern-css-README.md`. No invented copyright notice.

## Historical installation verification — 6 October

TypeScript and the production build passed. Lint passed with 0 errors and 62 warnings in pre-existing files. The selected font files have valid TrueType headers; the SVG was visually inspected on a light background and contains no scripts, event handlers, embedded HTML or external references. Package version, lack of runtime dependencies and shadcn aliases were checked. No additional test suite or database access was needed for these optional resources.

Those results describe the original installation only. Current cleanup verification is recorded in [FOLLOWUP-CLEANUP.md](../audits/rivya-master-audit/FOLLOWUP-CLEANUP.md). The retained optional resources are not proof of hosted performance or human accessibility acceptance; any future use requires its own scoped verification.
