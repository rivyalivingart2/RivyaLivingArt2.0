# RivyaLivingArt project state

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
