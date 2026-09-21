# R8-1 actual browser verification — 21 September 2026

The existing foundation now passes actual hydrated Chromium checks. This resolves
the project browser-verification blocker recorded in the earlier dependency slice.
It does not complete R8-2–R8-5 or constitute the owner's visual approval.

## Integration and scope

The owner authorized merging accumulated work. PR #4 integrated development head
`274fc26d4a5132ed9c1a23e9b603d15be7dc03a1` into main at
`f4d79f125622a547488e081fb38e062089c636e6`, verified from the remote ref.
See [the decision](decisions/2026-09-21-main-merge.md). This subsequent browser/fix
slice continues on `codex/r8-first-frontend`; no deployment or domain change occurs.

## Actual checks

Node 22.23.2 / npm 10.9.2; Playwright 1.62.1; Chromium 153.0.8010.0.

| Check | Result |
| --- | --- |
| Clean `npm ci` after adding the browser test dependency | Pass |
| `npm run lint` | Pass, zero warnings/errors |
| `npm run typecheck` | Pass |
| `npm test` | 22 passed |
| `npm run test:preflight` | 12 passed |
| `npm run build` | Pass |
| `npm run test:runtime` | 29 passed |
| `npm run test:e2e` | 50 passed, 10 inapplicable mobile-only cases skipped on desktop/tablet, zero failures |

The four browser projects use 1440×1000, 768×1024, 390×844 and 320×740 viewports.
Seven existing routes are checked at each size: home, three collections, two
pieces and the Studio status page. Coverage includes real image decoding after
lazy loading, console/uncaught JavaScript errors, horizontal overflow, visible
sample labels, rendered-link navigation, real unknown-route 404s and reduced
motion. Mobile cases check centering, Tab/Shift+Tab containment, Escape/Close,
trigger focus and scroll restoration, anchor/route navigation and desktop resizing.

The real browser reproduced a dialog offset from the center, focus escaping at
the keyboard boundary, anchor navigation retaining header focus and an open modal
remaining after desktop resize. The fixes explicitly center the dialog, wrap focus,
distinguish dismissal from navigation and close it at the desktop breakpoint.
The scroll assertion uses keyboard activation: Playwright's pointer click scrolled
the trigger into view before the app handler, so that earlier pointer assertion
was an automation artifact, not evidence of an additional app defect. Pointer
navigation and the Close button remain exercised by the suite.

An independent read-only review found no actionable issue in these changes.

## Reproduction and environment boundary

```sh
npm ci
npx playwright install chromium
npm run check
npm run test:e2e
```

The checked-in suite launches its own local built Next server, never reuses an
unknown server and refuses to run within a Vercel deployment. `npm run check`
retains the non-browser checks; browser setup and `test:e2e` are explicit.

In this workspace, Chromium came from the installed `@sparticuz/chromium@153.0.0`
test runtime outside the repository. Its packaged executable was extracted into
the task workspace because its normal `/tmp/fonts` extraction encountered a file
ownership error. It was launched through Playwright's standard options with the
local-only `RIVYA_BROWSER_EXECUTABLE` override. No custom browser launch flags or
network controls were changed. The runtime binary is not an application dependency
or committed artifact. Browser Use's cloud loopback restriction remains unchanged;
these results come from repository-owned local Playwright tests.

The version-3 lockfile was reviewed for npm registry origins and integrity hashes.
Only Playwright and its resolved test tooling were added; application pins remain.
The clean install reported the existing ESLint 9.39.1 deprecation warning; checks
still ran normally. No checks or source lint rules were suppressed. Generated
Playwright HTML/report output is ignored by Git and ESLint.

## Actual screenshots and limits

Unmodified captures from the passing browser run:

- [Home, desktop](evidence/r8-1-browser/home-1440.png)
- [Home, mobile](evidence/r8-1-browser/home-390.png)
- [Collection, tablet](evidence/r8-1-browser/collection-768.png)
- [Detail, desktop](evidence/r8-1-browser/detail-1440.png)
- [Mobile menu](evidence/r8-1-browser/menu-390.png)

Visual inspection confirms the existing hierarchy and responsive stacking; the
compact source images remain visibly limited at larger sizes. No Safari/Firefox,
real-device, comprehensive accessibility or performance certification is claimed.

**SOURCE_IMPLEMENTED:** foundation and menu repairs. **UI_READY:** existing
foundation verified for continued development, not the complete visual-review
milestone. **BACKEND_CONNECTED:** no. **TESTED:** results above.

There are still two fictional source products and zero database rows. Higher
resolution media access remains blocked as documented in the preceding evidence;
no rejected asset request was retried. Full demo content and public/Studio visuals
remain ahead. All excluded integrations and S01–S04 remain excluded.

**Next exact task:** R8-2 furniture collection discovery and detail presentation,
starting with the existing typed concepts and reusable components. Keep sample
content labelled and do not begin backend integration before R8-5 owner review.

Publication of this reviewed slice is pending at document-writing time; the task
result must report the queried development-branch SHA after publishing.
