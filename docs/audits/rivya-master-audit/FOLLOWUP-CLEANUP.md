# Audit follow-up and confirmed-unused cleanup — 19 October 2026

The owner authorized implementing the audit changes and explicitly limited removal to **confirmed unused, duplicate and already-excluded features**. This follow-up is local on `codex/audit-followup-cleanup`, based on the completed audit checkpoint `ad84a2a47a138e876b7c91d5da762d293ceecf38`. It includes that checkpoint's verified fixes and compatible dependency patches; it does not repeat the cinematic redesign.

No push, PR, merge, deployment, production data change or CMS publication was performed. All original audit receipts retain their dates. The production failures and external acceptance gates below are not closed by a local UI repair.

## Implemented and verified

| Area | Change | Result and boundary |
|---|---|---|
| Studio navigation | Remove inactive Bulk import and Subscribers from desktop/mobile menus and page search. | 35 everyday administrator destinations. All 37 route registrations and the two administrator-only status bookmarks remain. Editors retain their previous permitted destinations. No working importer or subscriber service was deleted. |
| Language review | Reuse existing pagination for 20 cards per page; memoize draft/public review calculations by saved entries and language. | All 603 QA records are reachable across 31 pages. Search/state filtering operates on all records; filter/language changes return to page 1. Hindi/Gujarati counts and exact-record links preserve existing review semantics. |
| Account/password request errors | Separate queue-load failure from decision feedback; show an explicit error/retry state; disable review while loading or stale. | A failed GET no longer also says “No open requests.” Refresh exposes loading feedback and recovers to successful empty/results states. Existing rows remain visible but cannot be acted on until a successful refresh. |
| Unused source | Delete the 14 files in the manifest below. | No remaining source reference to a deleted file or package, and no unresolved relative/alias imports in the independent scan. Current public pages, Studio, films, fonts and order board remain. |
| Packages | Remove `pattern.css` and `@gsap/react`. | Neither has a retained consumer. Core `gsap` and the active motion system remain. No replacement package, new service or new dependency was introduced. |
| Evidence tooling | Allow a validated dedicated local report folder for checks and browser reports, including the public QA fixture manifest. | Follow-up receipts live in ignored `test-results/audit-followup-cleanup/`. Existing fixed-loopback, production-environment rejection and blocked-write guards remain. |

### Translation measurement

| Observation | Before | After | Interpretation |
|---|---:|---:|---|
| Saved QA records | 603 | 603 | No content removal. |
| Mounted review cards on an unfiltered page | 603 | 20 | Rendering is bounded; all records remain searchable/reachable. |
| DOM elements on the measured desktop page | 4,691 | 595 | 87.3% fewer mounted elements in this fixture. |
| Parsed entry JSON bytes | 6,256,425 | 6,256,425 | Initial content transfer has **not** been optimized. This is parsed JSON size, not compressed network transfer. |
| Search input to two animation frames, one observation | 30.7 ms | 14.8 ms | Diagnostic only. Earlier passing rerun was 30.5 ms; no repeatable latency or field INP improvement is claimed. |

The existing full-content API and server queries remain unchanged. A summary-only read projection could reduce transfer, but should be separately scoped and verified against draft/published review fingerprints. Pagination does not establish physical-device performance or complete the production performance gate.

### Exact source removal manifest

| Removed source | Why removable |
|---|---|
| `src/components/studio-shell.tsx` | Superseded shell; no retained application/test/tool consumer. |
| `src/components/studio-shell.module.css` | Used only by the removed shell. |
| `src/components/studio-overview.tsx` | Superseded overview; no retained consumer. |
| `src/components/studio-overview.module.css` | Used only by the removed overview. |
| `src/lib/studio-overview.ts` | Used only by the removed overview. |
| `src/components/design-foundation/MaterialFilm.tsx` | Disconnected prototype; active `shop/material-film.tsx` retained. |
| `src/components/design-foundation/MotionSurface.tsx` | Disconnected prototype; sole `@gsap/react` consumer. |
| `src/components/design-foundation/ResponsivePicture.tsx` | Disconnected prototype. |
| `src/components/design-foundation/primitives.tsx` | Disconnected prototype composition. |
| `src/components/design-foundation/foundation.css` | Styles used only by the disconnected prototype cluster. |
| `src/components/homepage.module.css` | Orphaned historical stylesheet; active `shop/homepage.module.css` retained. |
| `src/app/pieces/[slug]/piece.module.css` | Orphaned historical stylesheet; current shared product presentation retained. |
| `src/app/preview/studio/modules/[module]/page.module.css` | Orphaned stylesheet; the preview route itself is retained. |
| `src/lib/fonts/poppins.ts` | Unused font loader; actual font assets and active typography retained. |

These deletions remove **53,648 committed source bytes**, a repository-maintenance figure measured from the parent Git objects. The files were unreachable, so this is **not** a measured shipped-bundle saving. Import/re-export/literal dynamic-import and CSS reachability were checked from 130 Next entrypoints and against executable tool/test references before deletion; the independent final scan found no remaining broken references.

### Deliberately retained

- Products, categories, public collections, search, saved pieces, commissions, inquiry persistence and manual WhatsApp sending.
- Journal, portfolio, testimonials, FAQs, pages, translations, draft/revision/publication and media/crop functionality.
- Staff approval and administrator-assisted password reset, authentication, roles and request APIs.
- The active inquiry `OrderKanban`, current Studio shell/overview, core GSAP and cinematic components.
- Legacy-slug resolution, retained fixture/test/type contracts and compatibility route wrappers.
- `read-excel-file` and `fflate`: retained source still imports them; a generic unused-package guess was insufficient to remove them.
- Raw font/media assets and provenance records. No asset-library deletion was attempted.

Excluded checkout/customer accounts/new scraping/legacy transfer/backup features remain excluded. No new removal of an active business feature was inferred from “unnecessary.”

## Verification and evidence

Environment: Windows, Node 22.23.2, Next.js 16.3.8, installed Chrome 155.0.8059.84, DPR 1, isolated fixed-loopback QA. Production credentials were not used. The Studio verifier authenticates the existing local fixture, then blocks every Studio mutation request. Access-request failure, empty and stale-row responses are browser-intercepted fictional GET responses; they do not reproduce or repair the production database failure.

| Check | Result | Evidence / limit |
|---|---|---|
| Full lint | PASS, 0 errors; 62 existing warnings | `lint.log`; no mass unrelated lint rewrite. |
| Unit checks | PASS, 365/365 | `unit.log`; includes preserved bookmarks and unchanged editor navigation. |
| Preflight | PASS, 12/12 | `preflight.log`. |
| Production build, generated route types, TypeScript | PASS | `build.log`, `typegen.log`, `typecheck.log`. App build completed before browser testing. |
| Runtime checks | PASS, 403/403 | `runtime.log`. |
| Focused Studio verification | PASS, 50 checks | `after.json`; 46 behavior/geometry/guard checks plus 4 automated accessibility scans. |
| Canonical public/browser regression | PASS, 155; 5 intentional skips | Four viewport projects. Final receipt: `e2e-final-results.json`; no retries or flaky cases. |
| Protected QA records | PASS, all 1,658 rows unchanged across 13 scopes | `preservation.json`; read-only before/after hashes, no raw values in this report. |
| Independent source/behavior review | No blocking regression found | Separate read-only reachability and Studio reviewers; not a substitute for executed browser checks. |

The focused browser pass checked 1920, 1440, 1200, 992 and 768 px widths at 1000 px height, and 512, 390 and 320 px widths at 844 px height. Canonical E2E uses 1440×1000, 768×1024, 390×844 and 320×740. Touch/mobile settings in the canonical suite are browser emulation. No physical-phone or native-reader certification is claimed.

The four axe scans report zero automated violations. They retain incomplete contrast evaluations over complex surfaces and one incomplete ARIA evaluation in each translation view. These are not silently converted into passes for every contrast/background state. Keyboard finder dismissal/focus return and mobile navigation are explicitly exercised.

The final canonical browser run started at `2026-10-19T06:24:58.615Z` and finished in 162,162 ms, producing 59 screenshots. Its server log retains one “The destination stream closed early” notice during navigation, terminal-color warnings and the ignored external home-directory lockfile warning. No corresponding tested response or uncaught-browser-error guard failed; this is not described as an empty server-error log. The final report-path tooling lint and TypeScript checks also exited 0 after that harness change.

One-time password-link retention was independently source-reviewed: queue loading/error changes do not clear `issued`. This follow-up did not click approval or create a real or synthetic staff account. The production request queue's root cause remains unknown.

The first targeted attempt stopped after three checks because the test expected an exact dropdown label. The selector was corrected; the failed receipt is retained as `after-attempt-1.json`. It is not counted as a completed pass. The initial passing E2E run refreshed the existing hard-coded public fixture manifest while saving reports in the new folder. Fixture writer, reader and reporter now share one validated folder; the corrected harness was rerun. Original master-audit result JSON, logs and screenshots were not replaced by this follow-up. The refreshed fixture manifest is a new read-only descriptor snapshot, not historical evidence.

### Local visual review

The local gallery is `test-results/audit-followup-cleanup/index.html`. All images remain ignored by Git:

- `before-translations-1440.png` / `after-translations-1440.png`
- `before-access-error-1440.png` / `after-access-error-1440.png`
- `after-translations-320.png`
- `after-navigation-390.png`
- `after-access-390.png`

The mobile captures show the changed controls and natural vertical growth. There is no invented mobile “before” pair. Screenshots use isolated fictional QA records and a simulated request error, not production customer records.

## Remaining gates and release conclusion

| Item | Status | Required next step |
|---|---|---|
| Production account/password-request availability (`PROD-ACCESS-01`) | VERIFIED_OPEN | Read-only production schema/grant/runtime diagnosis when existing authorized access is available; any production repair needs fresh permission. The local UI correction only makes failure/retry behavior accurate. |
| Released mobile performance (`PERF-MOBILE-01`) | VERIFIED_OPEN | Release the approved candidate only after fresh authorization, then repeat the production measurements; field evidence remains separate. |
| Development-only dependency advisory (`DEP-DEV-01`) | DEFERRED | The 19 October parent audit's advisory evidence remains applicable; the two removals do not touch that chain. No new advisory lookup is claimed here. |
| Translation initial transfer | DEFERRED | Parsed payload remains 6.26 MB; consider a separately validated summary projection. No severe latency claim is inferred from one timing sample. |
| Physical devices, native reader/zoom, field acceptance | BLOCKED | Existing restrictions and unavailable devices remain. Automated scans do not supply those observations. |
| Destructive/provider lifecycle verification | BLOCKED | A wholly disposable environment/provider scope is still required. |
| Local source release | DEFERRED | Fresh explicit owner authorization is required for push/PR/merge/deployment or production changes. |

The authorized cleanup and targeted local improvements are complete and reviewable. This is not an assertion that every master-audit production or external gate is complete. Preserve the prior audit and these follow-up receipts as separate dated evidence.

## Skills and independent review

Applied UI/UX Pro Max selectively, plus the installed Studio admin UX and clean-code architecture skills. The UI/UX search returned generic guidance rather than a specific removal prescription, so removal decisions use repository reachability and actual module behavior. The Vercel React review checklist was applied to the edited components: stable hooks, memoized derived coverage, explicit loading/error state, preserved accessible controls and no new runtime dependencies. No redesign, optimistic account approval, new library or skill installation followed automatically from a skill example.

`cleanup_reachability` independently reviewed deletion reachability, retained packages/routes and report-path validation. `cleanup_studio_review` independently reviewed navigation permissions, pagination/review semantics, retry guards and issued-link retention. Neither reviewer edited application code or contacted production. The coordinator owns the actual browser/test execution and final integrated report.
