# RivyaLivingArt project state

## R8 checkpoint — 2026-09-21 (main integration and actual browser verification)

- **Owner instruction:** merge accumulated work into main, then go to the next task.
  PR #4 merged development head `274fc26d4a5132ed9c1a23e9b603d15be7dc03a1` into
  main at `f4d79f125622a547488e081fb38e062089c636e6`; remote main was read back.
  Earlier branches are ancestors; no history/branch was removed. See the merge decision.
- **Phase/slice:** R8-1 actual browser verification and mobile-menu repair, continuing
  from that main commit on `codex/r8-first-frontend`.
- **Completed:** repository-owned Playwright configuration/tests; dialog centering,
  keyboard containment, dismissal focus/scroll restoration, anchor navigation and
  desktop-resize behavior. Independent review found no actionable issue.
- **Checks:** clean npm ci with the updated, reviewed 443-entry lockfile; lint and
  semantic typecheck pass; unit 22/22; preflight 12/12; build passes; HTTP 29/29;
  Chromium browser 50 passed / 10 inapplicable mobile-only skips / zero failed.
- **Actual browser evidence:** seven routes at 1440/768/390/320 px, decoded images,
  navigation, unknown-route 404, reduced motion and menu keyboard/focus/scroll.
  Five actual screenshots retained in `docs/evidence/r8-1-browser/`. Read
  `docs/R8-1_BROWSER_VERIFICATION.md` for reproducible commands and limits.
- **SOURCE_IMPLEMENTED:** foundation/browser repair. **UI_READY:** existing
  foundation verified for continued development; complete frontend not ready.
  **BACKEND_CONNECTED:** no. **TESTED:** the checks above.
- **Browser boundary:** the cloud browser still blocks localhost. Local Playwright
  successfully exercised the real built app; no network controls were changed.
  No Safari/Firefox, physical-device or complete accessibility certification claimed.
- **Fixtures/persistence/media:** still two fictional products, zero database rows;
  120/36/42/24/40 content coverage remains ahead. Existing small AVIFs unchanged;
  higher-resolution source access remains blocked as previously documented.
- **Schema/environment:** no schema, real auth, uploads, outgoing messages or backend.
  All rejected integrations and S01–S04 remain excluded. Browser executable override
  is local test tooling only; no deployment configuration or secrets added.
- **Publishing:** this new slice is prepared for a normal development-branch commit;
  query the remote SHA after publication and report it in the task result. The
  already-verified main merge above is separate from subsequent development fixes.
- **Vercel:** connected team again returned zero projects; no project, deployment,
  production promotion or live-domain change. No repository deployment trigger found.
- **V1/V2:** not ready. This is not the R8-5 handoff or owner visual approval.
- **Next exact task:** R8-2 furniture collection discovery and detail presentation,
  using the existing typed concepts/components and progressively authored demo content.

## R8 checkpoint — 2026-09-21 14:20 Asia/Kolkata (dependencies and runtime verified)

- **Phase/slice:** R8-1 continuation; dependency verification and route-status repair.
- **Starting / last verified pushed commit:** `3bb86481fc261d6fd17ef59c56884e76d1e5a3b6`.
- **Repository / work branch:** `rivyalivingart2/RivyaLivingArt2.0` /
  `codex/r8-first-frontend`; origin Git read transport works; no separate push URL.
- **Completed:** actual npm install and reviewed version-3 lockfile (439 entries),
  clean npm ci under Node 22.23.2/npm 10.9.2; lint warning fixes; route-type generation
  before semantic typecheck; real HTTP 404 for unknown collection/product routes;
  collection metadata preview guard; built-server regression suite.
- **Owned paths:** package/lock/generated Next types, PostCSS config, app home and
  collection metadata, loading view moved to shared component, two unused test
  imports, new runtime test, AGENTS/README/workflow/current evidence/checkpoint.
- **Checks:** lint zero warnings; typecheck passes including without prior build
  output; unit 22/22; preflight 12/12; production build passes; HTTP suite 29/29.
  HTTP coverage includes link destinations, exact served image bytes, unknown-route
  404 and production fixture isolation. No browser/hydration pass is inferred.
- **SOURCE_IMPLEMENTED:** dependency/runtime repair slice; **UI_READY:** no,
  awaiting actual browser verification; **BACKEND_CONNECTED:** no;
  **TESTED:** build/unit/preflight/HTTP only.
- **Browser blocker:** actual app starts, but Browser Use rejects its loopback URL
  with `net::ERR_BLOCKED_BY_CLIENT`. Layout, keyboard/focus, reduced motion, image
  decode and client-navigation checks remain unverified; no screenshots fabricated.
- **Fixtures/persistence:** still TWO fictional source products, zero database rows.
  Full 120/36/42/24/40 source coverage remains ahead. No backend work started.
- **Media:** existing derivatives unchanged. Riverline raw fetch rejected by automatic
  approval review; Basin byte transfer failed HTTP 403. Details and safe continuation
  are in `docs/R8-1_DEPENDENCY_VERIFICATION.md`.
- **Schema/environment:** no schema, secrets, auth, uploads or outgoing messages.
  Test-only child environments exercise production denial; no deployment flags changed.
- **Owner work:** source, nine briefs and historical checkpoints/evidence preserved.
- **Publishing:** reviewed checkpoint commit/push verification pending at writing;
  terminal push failed due to absent GitHub write credentials. Use the authorized
  GitHub connector and verify both tree equality and actual branch SHA. Actual SHA
  and remote confirmation belong in the session result.
- **Vercel:** connected team again lists zero projects. None created/deployed;
  no repository deployment workflows found. Main and live domain unchanged.
- **V1/V2:** not ready. Frontend continuation beyond the initial browser gate remains
  pending; this is not the R8-5 visual-review handoff.
- **Next exact task:** run the real frontend in an authorized browser-capable
  environment at 390/768/1440 px; verify menu keyboard/focus/Escape/scroll restoration,
  navigation, image decode, unknown routes and reduced motion, fix failures and
  capture actual screenshots before continuing R8-2 furniture presentation.

## R8 checkpoint — 2026-09-21 (new build confirmed; initial frontend source)

- **Owner decision:** this is a new build with Markdown specifications only. Initial
  application creation is authorized; do not ask for old source again. See
  `docs/decisions/2026-09-21-new-build.md`.
- **Branch/parent:** `codex/r8-first-frontend` from
  `7f7ec493ac3163821b369f72982435eb32e9c0b3`; main unchanged.
- **Slice:** R8-1 initial app foundation, public shell and furniture presentation.
- **Source:** Next.js/TypeScript configuration, CSS-first tokens, responsive header,
  mobile dialog source, homepage, collection/concept pages, status-only Studio and
  system views. No prior source was replaced; briefs and tools remain intact.
- **Fixtures/media:** TWO fictional source records (DP001/DP013); zero database rows.
  Two inspected Drive concept images have compact local AVIF preview derivatives.
  Full demo counts, higher-quality production assets and final typography remain.
- **Tests:** `npm test` passed 22 pure policy/fixture/source-contract tests. Seventeen
  source TS/TSX files passed a global TS5.8.3 syntax-only check; two CSS files parsed.
  A source-derived static diagnostic had three decoded images and no horizontal
  overflow at 1440/390px; this is NOT Next/React/hydration/event/browser-app testing.
- **Blocker:** npm install failed EAI_AGAIN resolving registry.npmjs.org. No dependency
  tree/lockfile; ESLint, semantic typecheck, Next build and actual app browser tests
  remain unrun. Direct shell Git network is unavailable; connector publication is
  separate. Do not describe source tests or static screenshots as a successful build.
- **SOURCE_IMPLEMENTED:** initial slice. **UI_READY:** pending build/browser checks.
  **BACKEND_CONNECTED:** no. **TESTED:** limited checks above. **V1/V2:** not ready.
- **Environment:** no app secrets, schema migrations, real auth, uploads or messages.
  Preview flag is not authentication; online preview needs verified protection.
  Connected Vercel team returned no projects; none created/deployed/changed.
- **Docs:** current AGENTS, README and Codex workflow updated; new owner decision,
  frontend evidence and media manifest added. Old audits/checkpoints unchanged below.
- **Publication at checkpoint-writing time:** reviewed source prepared for a draft
  commit on the named branch. Final SHA and remote verification belong in the task/PR
  result and must be queried, not inferred from this pre-commit document.
- **Next exact task:** in network-enabled Codex install actual packages and generate
  the real lockfile; run lint/typecheck/unit/preflight/build and actual responsive
  browser checks, fix errors, commit/publish verified results, then continue the
  furniture frontend. Do not scaffold again or begin backend before visual review.

## R8 checkpoint — 2026-09-21 (R8-0 remote verification and Codex handoff)

- **Phase/slice:** R8-0 follow-up; repository tooling and handoff, not application UI.
- **Confirmed destination:** `rivyalivingart2/RivyaLivingArt2.0`.
- **Baseline main SHA:** `5500fe9b92fb48d015dbb873afea1434d0bd8c18`.
- **Work branch:** `codex/r8-repository-handoff`, created from the baseline.
- **Observed source:** both pre-existing branches contain the same 13 documentation
  files and no application manifest, lockfile, routes, components or backend.
- **Access:** GitHub connector read/write capability verified. Direct container Git
  clone failed DNS resolution; this is not evidence that connector publishing fails.
- **Completed files:** `docs/CODEX_WORKFLOW.md`, `docs/R8-0_REMOTE_VERIFICATION.md`,
  `tools/codex-preflight.mjs`, `tools/codex-preflight.test.mjs`; current README,
  AGENTS guidance and this appended checkpoint updated. Earlier audit retained.
- **Tests:** Node syntax checks passed; 12 preflight tests passed, 0 failed. Tests
  use temporary local Git repositories and do not run application code or networks.
- **UI_READY:** No; **BACKEND_CONNECTED:** No; **application TESTED:** No.
- **Fixtures/media:** 0 application fixtures, 0 persisted rows, no Drive imports.
- **Environment/deployment:** no CI/deployment files in baseline; connected Vercel
  context returned no projects. No Vercel changes, deployments, paid activation,
  migrations, production merge, or main-branch update authorized/performed.
- **Commit/push state at writing:** files prepared/tested; commit and remote-ref
  verification to be recorded in the completed task report. Do not equate this
  planned publication with evidence; query the actual branch SHA.
- **Unresolved:** source restoration or explicit authorization to initialize the
  first application in this confirmed repo. The URL is no longer a missing input.
- **Next exact instruction:** resolve that one source decision; then perform the
  first source-backed R8-1 frontend slice. Follow `docs/CODEX_WORKFLOW.md`; do not
  re-run a missing-remote loop or silently override the no-replacement rule.

## R8 checkpoint — 2026-09-21 (R8-0 audit)

- **Phase/slice and stage:** R8-0 grounded audit; documentation-only checkpoint.
- **Last verified pushed commit before this slice:** none verifiable; no remote is configured.
- **Actual safe remote identity / work branch:** remote unavailable / local branch `work`.
- **Goal and exact owned paths:** audit the selected checkout; add `AGENTS.md`,
  `docs/R8-0_AUDIT.md`, this checkpoint, and index them from `README.md`.
- **UI_READY:** No — application source is absent.
- **BACKEND_CONNECTED:** No — backend source and configuration are absent.
- **TESTED:** Audit documents checked programmatically; no application test/build command exists.
- **Fixture versus persisted counts:** 0 authored source fixtures; 0 persisted records.
  The blueprint targets (120 products, 36 complete articles, 42 FAQs, 24 explicitly
  fictional testimonials, and 40 scenarios) remain unimplemented.
- **Asset inputs/outputs:** none available; `reference/91707.png` and approved Drive
  assets are not present in the checkout. No asset prompt was falsely marked fulfilled.
- **Schema/environment impact:** none.
- **Owner work preserved:** the README and all nine supplied Revision 8 documents;
  no source, history, or configuration was reset.
- **Commit/push:** commit pending at checkpoint-writing time; push is blocked because
  `.git/config` has no remote.
- **Vercel:** not requested; project, integration, deployment triggers, and preview
  protection are not observable in this checkout.
- **V1/V2:** both blocked. V1 is additionally blocked by absent frontend source;
  V2 remains out of sequence until visual review and backend integration.
- **Next exact instruction:** restore or identify the actual application source and
  verified safe remote in this repository, then repeat the source/deployment portions
  of R8-0 and implement the existing-shell tokens/header/mobile-nav R8-1 slice.

Detailed evidence and the full blocker statement are in `docs/R8-0_AUDIT.md`.
