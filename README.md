# RivyaLivingArt

**Repository:** `rivyalivingart2/RivyaLivingArt2.0`  
**Work branch:** `codex/r8-first-frontend`  
**Stage:** R8-3B form development; testing deferred until after backend/database
integration. Next: R8-3C public pages.

This is a new application, as confirmed by the owner on 21 September 2026.
The earlier Markdown-only state was intentional. [The owner decision](docs/decisions/2026-09-21-new-build.md)
supersedes the old source-absence guard without discarding documents or history.
The [latest development-first decision](docs/decisions/2026-09-21-development-first.md)
moves all testing-related work to final QA after integration. It also records the
completed R8-3A main merge through PR #7 at
`0999b3b0a873e0745231f119c1567b3f8cd79fd8`. New work stays on development.

## What exists now

Next.js App Router/TypeScript source, CSS-first Tailwind configuration, dark semantic
tokens, locally hosted typography, responsive header/mobile-dialog navigation,
furniture-led homepage, 24 labelled concepts (12 furniture / 6 memory / 6 personal),
distinct cards and tier-specific details, URL filters/pagination, gallery and local
finish/variant choices, sample specifications, status-only Studio,
and loading/error/404 views. The two compact concept images derive from the owner's
Drive collection. They are AI concepts, not real product photographs or stock.
Twenty-two studies have explicit visual-pending states; higher-resolution media remains
unavailable. No unrelated images are assigned to those products.

R8-3B adds typed client-only form journeys at `/commission?piece=slug`,
`/preserve?piece=slug` and `/personalize?piece=slug&variant=id`: local validation,
summary, optional local reference-image preview and an explicitly simulated
receipt. This source is untested. The 24 labelled catalogue fixtures are unchanged.

**Not complete:** full frontend, staff login, CMS,
database/storage, enquiries, imports, full demo pack
or protected visual-preview handoff. The existing Vercel production deployment
serves the intended holding screen. Form values stay in local UI state; there is
no real enquiry submission, upload, persistence or outgoing message.

Read [Codex workflow](docs/CODEX_WORKFLOW.md), [R8-3B development status](docs/R8-3B_INQUIRY_FRONTEND.md)
and [current checkpoint](PROJECT_STATE.md) before continuing.

## Run locally

Use Node 22 and npm 10.9.2. The committed lockfile was resolved from the npm registry
and verified with a clean install. No application dependency pins were changed.

```sh
npm run dev
```

The existing lockfile/dependencies support development; R8-3B adds no dependency.
Use `npm run typecheck` only as needed to resolve implementation wiring. Compiler
feedback alone does not establish UI_READY or TESTED.

All lint/test/preflight, build-verification and browser/visual QA work is deferred
until after backend/database integration. Existing test sources and scripts remain
intact. For that final stage, `npm run check` runs lint, typecheck, unit, preflight,
build and HTTP checks; `npm run test:e2e` runs Chromium after a build and browser
installation. Historical R8-3A results are in its [evidence document](docs/R8-3A_MEMORY_PERSONAL_FRONTEND.md)
and do not certify R8-3B.

Local development displays the labelled visual study. The retained built-server
preview command is `RIVYA_VISUAL_PREVIEW=1 npm start` after a build. Do not set
`VERCEL_ENV` manually to bypass a production restriction. An online non-production
preview additionally requires verified deployment protection. Production always
receives a holding page for these fixture routes.

## Source and document map

- `src/app/`: App Router layouts, collection/concept pages and system views.
- `src/components/`: reusable first public components; `src/styles/`: semantic tokens.
- `src/lib/`: 24 typed source concepts, server-side query helpers and preview policy.
- `src/styles/fonts/`: local WOFF2 files, original OFL licenses and hash manifest.
- `public/media/concepts/`: two small preview derivatives, not original masters.
- `tests/`: dependency-free fixture/policy/source-contract tests.
- `tools/`: read-only Codex preflight and actual built-server HTTP regression tests.
- `e2e/`, `playwright.config.ts`: local hydrated Chromium checks across four sizes.
- `docs/assets/initial-media.json`: provenance, dimensions, hashes and usage limits.
- `docs/CODEX_WORKFLOW.md`: current starting/continuation instructions.
- `docs/R8-1_FRONTEND_FOUNDATION.md`: preserved initial source-slice evidence.
- `docs/R8-1_DEPENDENCY_VERIFICATION.md`: historical install/build/runtime evidence.
- `docs/R8-1_BROWSER_VERIFICATION.md`: preserved foundation browser evidence.
- `docs/R8-2_FURNITURE_FRONTEND.md`: furniture slice features, results and screenshots.
- `docs/R8-3A_MEMORY_PERSONAL_FRONTEND.md`: historical collection/detail checks and screenshots.
- `docs/R8-3B_INQUIRY_FRONTEND.md`: current form source and deferred-QA boundary.
- `docs/VERCEL_RUNTIME_ALIGNMENT.md`: verified runtime mismatch and exact remaining setting.
- `docs/decisions/2026-09-21-main-merge.md`: owner-authorized PR #4 main integration.
- `docs/decisions/2026-09-21-new-build.md`: confirmed initial-creation decision.
- `docs/decisions/2026-09-21-development-first.md`: latest merge and final-QA timing override.
- `docs/R8-0_AUDIT.md` and `docs/R8-0_REMOTE_VERIFICATION.md`: unchanged history.
- `AGENTS.md`, `PROJECT_STATE.md`: active guidance and dated checkpoints.

## Retained Revision 8 specification

- [Read first](RivyaLivingArt_READ_FIRST_v8.md)
- [Master](RivyaLivingArt_Master_Build_Prompt_v8.md)
- [Frontend-first plan](RivyaLivingArt_Frontend_First_Plan_v8.md)
- [Git workflow](RivyaLivingArt_Git_Checkpoint_Workflow_v8.md)
- [Vercel handoff](RivyaLivingArt_Vercel_Deployment_Handoff_v8.md)
- [Start/resume prompts](RivyaLivingArt_Codex_Start_Resume_v8.md)
- [Demo content](RivyaLivingArt_Demo_Content_Blueprint_v8.md)
- [Asset prompts](RivyaLivingArt_Asset_Generation_Prompts_v8.md)
- [Original AGENTS addendum](RivyaLivingArt_AGENTS_Addendum_v8.md)

Frontend and Studio development precede real integrations. R8-5 remains an
owner-controlled protected frontend-preview handoff; it is not a full-QA gate under
the latest instruction. Do not invent owner visual approval. Final QA follows the
backend/database integration, before the R8-11 full deployment handoff. Neither
handoff has been reached. R8-3A is merged through PR #7; new slices continue on the
development branch. Vercel Git integration exists, so development pushes may build previews
and main pushes may deploy production. This task changed no deployment settings or
domains. The Node22 project-setting alignment is recorded in the runtime note.
Exact business rules and exclusions remain in the brief.
