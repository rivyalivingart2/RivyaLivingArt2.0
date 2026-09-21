# R8-1 initial frontend source — evidence and continuation

**Date:** 21 September 2026  
**Parent:** `7f7ec493ac3163821b369f72982435eb32e9c0b3`  
**Branch:** `codex/r8-first-frontend`

## What was implemented

- Initial Next.js App Router/TypeScript and CSS-first Tailwind configuration.
- Forest/bronze/ivory semantic tokens; native responsive CSS, focus/selection states
  and reduced-motion fallbacks. Native serif/UI font fallbacks are intentional until
  approved production typography is implemented; no font files were redistributed.
- Reusable header with desktop links and mobile native-dialog source, homepage,
  footer, concept cards, holding state and arrow SVG. Mobile React events are not
  verified by the static diagnostic described below.
- Home, three collection routes, two concept-detail routes, 404/error/loading and
  status-only /studio. No credential fields, sessions or operational Studio yet.
- Two typed fictional concept records: DP001 Riverline and DP013 Basin. Not a full
  seed pack, live product catalogue or completed commissioning flow.
- Two visually inspected Drive concept originals, preserved unchanged; compact AVIF
  preview derivatives bundled locally with provenance. No live Drive hotlink or
  signed download URL in application code. Large-screen production-quality media
  remains follow-up work; these deliberately small derivatives are not final masters.
- Explicit request-time visual-mode gate, production holding state and noindex.
  These are data-mode safeguards, NOT staff authentication/deployment protection.

## Verification performed

Environment: Node 22.16.0, npm 10.9.2, Git 2.47.3.

| Check | Result and limits |
|---|---|
| `node --experimental-strip-types --test tests/*.test.mjs` | 22 passed, 0 failed: pure policy, fixture and source-contract tests. No React, network, auth or database tests. |
| TypeScript syntax diagnostic | 17 src TS/TSX files transpiled with globally available TS 5.8.3, zero syntax diagnostics. NOT semantic typecheck or the project's candidate TS version. |
| CSS syntax diagnostic | Two CSS files parsed with local PostCSS. NOT Tailwind compilation or a contrast/accessibility certification. |
| Static layout diagnostic | Source-derived HTML/CSS rendered at 1440 and 390 px with three decoded images, zero broken images and no horizontal document overflow at those sizes. Uses local substitute Link/Image rendering; NOT Next/React/RSC/hydration or event testing. |
| `npm install --ignore-scripts --fetch-retries=0 --fetch-timeout=8000` | Failed EAI_AGAIN resolving registry.npmjs.org. No installed dependency tree or lockfile. |
| ESLint / `tsc --noEmit` / Next build | NOT RUN: required packages unavailable. |
| Actual app browser tests | NOT RUN: Next cannot start without dependencies. Localhost browser navigation is also restricted in this authoring environment. No network-control workaround used. |
| Preflight tests | Existing prior slice recorded 12 passed; not reclassified here as new app tests. Run them again in Codex alongside the new suite. |

Static diagnostic files were produced outside the repository and clearly labelled.
They are a first visual indication, not evidence that the Next application builds
or that mobile-dialog behavior has passed. No temporary HTML route is committed.

## Initial package choices

Next 16.3.5, React/react-dom 19.3.0, Tailwind/PostCSS plugin 4.3.3, TS 5.9.3 and
ESLint 9.39.1 are candidate pins in package.json. Next/React/Tailwind current registry
metadata was read on 21 September 2026; installation/compatibility/security of the
complete graph remains unverified. The type packages use bounded major ranges until
actual lockfile resolution. Do not claim the manifest is a tested dependency graph.

Sources: https://registry.npmjs.org/next/latest ; https://registry.npmjs.org/react/latest ;
https://registry.npmjs.org/tailwindcss/latest ; https://nextjs.org/docs/app/getting-started/installation .

## Status

SOURCE_IMPLEMENTED: initial slice only. UI_READY: pending real build/browser checks.
BACKEND_CONNECTED: no. TESTED: 22 policy/source tests only. R8-5/V1: NOT READY.
No Vercel project/deployment, database, mail, private-media store or real enquiries.
No lockfile: do not run npm ci until Codex generates and verifies it through a real install.

## Exact next task

Open this branch in network-enabled Codex. Read current AGENTS and the owner decision.
Install dependencies, create/review package-lock.json, run lint/typecheck/test/build
and actual responsive/keyboard/route/image checks. Fix errors, commit/publish the
verified lockfile and fixes, then continue the furniture frontend. Do not ask to
restore source or initialize a second app. Backend stays after the visual-review gate.
