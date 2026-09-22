# Approved Site to existing Next.js mapping

| Native source | Existing application integration |
|---|---|
| `components/rivya/experience.tsx` | `src/components/rivya/experience.tsx`, scoped `approved-experience.css`, `approved-entry.tsx` |
| Native public routes | Existing `src/app` public pages retain request-time preview guards and route validation |
| Native `/studio/*` | Guarded `/preview/studio/*`; `/studio` holding boundary is unchanged |
| Native `/states/*` | Guarded `/preview/states/*` |
| Native `components/foundation/*` | Existing `src/components/studio-*`, Tiptap, section renderer, media/form contracts reused |
| Native `lib/rivya/source/*` | Existing `src/lib/*`; one stable fixture catalogue |
| Native `lib/rivya/data.ts` | Presentation adapter preserving Site display aliases, exact first-five descriptions and source-ID references |
| Native local demo state | `src/lib/rivya/demo-state.tsx`; browser-only adapter pending real R8 services |
| Native Radix/Lucide primitives | Isolated `src/components/sites-ui`; exact dependency additions in genuine npm lockfile |
| Native Vinext/hosting/WebMCP | Preserved only in isolated native snapshot; no root runtime replacement |

Public canonical routes and approved aliases resolve to the same fixture IDs. Existing server guards run before fixture route rendering. Framework links from foundation editors use the current protected Studio harness. No iframe, screenshot, bundle scraping or remote Site embedding is used.
