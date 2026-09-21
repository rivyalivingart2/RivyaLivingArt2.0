# RivyaLivingArt

**Repository:** `rivyalivingart2/RivyaLivingArt2.0`  
**Work branch:** `codex/r8-first-frontend`  
**Stage:** R8-1 dependencies/build verified; actual browser verification blocked.

This is a new application, as confirmed by the owner on 21 September 2026.
The earlier Markdown-only state was intentional. [The owner decision](docs/decisions/2026-09-21-new-build.md)
supersedes the old source-absence guard without discarding documents or history.

## What exists now

Next.js App Router/TypeScript source, CSS-first Tailwind configuration, dark semantic
tokens, responsive header/mobile-dialog navigation, furniture-led homepage, two
fictional concept studies, collection/detail route foundations, status-only Studio,
and loading/error/404 views. The two compact concept images derive from the owner's
Drive collection. They are AI concepts, not real product photographs or stock.

**Not complete:** hydrated browser/layout checks, full frontend, staff login, CMS,
database/storage, enquiries, imports, full demo pack
or deployment. No code in this slice collects personal data or sends messages.

Read [Codex workflow](docs/CODEX_WORKFLOW.md), [current verification](docs/R8-1_DEPENDENCY_VERIFICATION.md)
and [current checkpoint](PROJECT_STATE.md) before continuing.

## Run locally

Use Node 22 and npm 10.9.2. The committed lockfile was resolved from the npm registry
and verified with a clean install. No application dependency pins were changed.

```sh
npm ci
npm run lint
npm run typecheck
npm test
npm run test:preflight
npm run build
npm run test:runtime
npm run dev
```

`npm run check` runs the six checks above, including the build and HTTP regression
tests. Typecheck generates Next route types first, so it works before the first
build. Runtime tests start the real built app on loopback; they do not exercise a
browser, React hydration, desktop/mobile layout or the mobile dialog.

Local development displays the labelled visual study. For a local built-server
review after a successful build: `RIVYA_VISUAL_PREVIEW=1 npm start`. Do not set
`VERCEL_ENV` manually to bypass a production restriction. An online non-production
preview additionally requires verified deployment protection. Production always
receives a holding page for these fixture routes.

## Source and document map

- `src/app/`: App Router layouts, collection/concept pages and system views.
- `src/components/`: reusable first public components; `src/styles/`: semantic tokens.
- `src/lib/`: typed source concepts and pure preview-mode policy.
- `public/media/concepts/`: two small preview derivatives, not original masters.
- `tests/`: dependency-free fixture/policy/source-contract tests.
- `tools/`: read-only Codex preflight and actual built-server HTTP regression tests.
- `docs/assets/initial-media.json`: provenance, dimensions, hashes and usage limits.
- `docs/CODEX_WORKFLOW.md`: current starting/continuation instructions.
- `docs/R8-1_FRONTEND_FOUNDATION.md`: preserved initial source-slice evidence.
- `docs/R8-1_DEPENDENCY_VERIFICATION.md`: current install/build/runtime evidence and browser blocker.
- `docs/decisions/2026-09-21-new-build.md`: confirmed initial-creation decision.
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

Frontend and Studio visuals precede real integrations. R8-5 gives an owner-controlled
protected visual-preview handoff; R8-11 addresses the complete application. Neither
milestone has been reached. No main merge, Vercel project or deployment is authorized
by this README. Exact contact/business rules and rejected features remain in the brief.
