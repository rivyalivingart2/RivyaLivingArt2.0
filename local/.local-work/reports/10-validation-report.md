# Validation report

Updated: 2026-09-30
Final tested application source head: `6c4ac3d16bb9c914eae0a94ece8771328941f551`
Vercel Preview: `dpl_CAJYQrVxMy3YVkF61Js6kLSqqNVQ` — **READY / success**

## Final validation

| Check | Result |
|---|---|
| Transformation fixture suite | PASS |
| Dirty-tree safety guard | PASS |
| Build / Vercel Preview | PASS |
| Public/SEO source checks | PASS |
| Studio D1/D3/D4 source/build checks | PASS |
| Portfolio truthfulness correction | PASS |
| Touch/reduced-motion refinement | PASS |
| Seven-width rendered browser matrix | PASS |
| Production data safety | PASS |

## Seven-width browser matrix
Routes tested at every viewport:
- `/`
- `/collectible-design`
- `/journal`
- `/portfolio`
- `/preview/studio`

Viewports:
- 1920×1080
- 1440×900
- 1200×900
- 992×900
- 768×1024
- 512×915
- 320×740

Final totals across 35 rendered states:
- navigation failures: **0**
- horizontal overflow failures: **0**
- broken image failures: **0**
- console/page error cases: **0**
- mobile controls under 44×44: **0**
- focus-outline failures: **0**

The initial rendered run found short mobile text links below 44px width. The fix was committed as `6c4ac3d16bb9c914eae0a94ece8771328941f551`, deployed to `dpl_CAJYQrVxMy3YVkF61Js6kLSqqNVQ`, and the entire matrix was rerun successfully.

## Performance/media
- Public images use Next Image/getImageProps with responsive sizes.
- Hero art direction selects one responsive optimized resource.
- Active body-font assets are WOFF2; JetBrains Mono is not preloaded.
- No field Core Web Vitals claim is made because this validation is a controlled Preview/lab pass, not production field telemetry.

## Evidence
- screenshot archive media id: `e24e3e54-aed0-4c3f-9c6b-8df87279c949`
- machine-readable QA report media id: `59a21442-9a2f-4d8e-911c-9871182837af`

No screenshots or success states were fabricated.
