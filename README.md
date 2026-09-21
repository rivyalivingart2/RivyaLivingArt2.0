# RivyaLivingArt

**Repository:** `rivyalivingart2/RivyaLivingArt2.0`  
**Work branch:** `codex/r8-first-frontend`  
**Stage:** R8-3D system-state development; testing deferred until after backend/database
integration. Next: R8-4A Studio shell, dashboard and product/form-builder visuals.

This is a new application, as confirmed by the owner on 21 September 2026.
The earlier Markdown-only state was intentional. [The owner decision](docs/decisions/2026-09-21-new-build.md)
supersedes the old source-absence guard without discarding documents or history.
The [latest development-first decision](docs/decisions/2026-09-21-development-first.md)
moves all testing-related work to final QA after integration. The owner subsequently
authorized the [R8-3C merge](docs/decisions/2026-09-21-r8-3c-main-merge.md) through
PR #9 at `96af467fe5cc94dc56f1fa507df35317cbdbc798`, verified from the remote
main reference. New R8-3D work stays on development.

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
receipt. R8-3C adds journal/article, FAQ, about/process/materials/care, portfolio,
contact, architect enquiry and catalogue-search pages. Its typed editorial content
includes six complete labelled article drafts (DB001–DB006), 42 FAQ answers and
three fictional project studies. R8-3D adds shared 404/error/root-error/loading/
empty/unavailable views, media fallbacks and gallery retry, local form-failure and
blocked-WhatsApp simulations, pending indicators and a guarded `/preview/states`
presentation gallery. These are frontend development surfaces, not executed QA.
Six more article drafts (DB007–DB012) bring the source total to 12/36. The 24
labelled catalogue fixtures are unchanged; 24 article drafts and the complete
120-product/24-testimonial/40-scenario targets remain ahead. All source added after
R8-3A remains untested under the owner’s development-first instruction.

**Contact correction:** the master brief already supplied the business phone,
WhatsApp, email and map link. R8-3D uses those exact values, correcting the earlier
missing-contact description. Local fictional drafts do not transfer into live
contact links, and no messages are sent automatically. Genuine care/legal wording,
studio history and supporting media still need owner review; no address, hours
or delivery terms are inferred from the map link.

**Not complete:** full frontend, staff login, CMS,
database/storage, enquiries, imports, full demo pack
or protected visual-preview handoff. The existing Vercel production deployment
serves the intended holding screen. Form values stay in local UI state; there is
no real enquiry submission, upload, persistence or outgoing message.

Read [Codex workflow](docs/CODEX_WORKFLOW.md), [R8-3D development status](docs/R8-3D_SYSTEM_STATES.md)
and [current checkpoint](PROJECT_STATE.md) before continuing. The
[R8-3B form boundary](docs/R8-3B_INQUIRY_FRONTEND.md) remains applicable.

## Run locally

Use Node 22 and npm 10.9.2. The committed lockfile was resolved from the npm registry
and verified with a clean install. No application dependency pins were changed.

```sh
npm run dev
```

The existing lockfile/dependencies support development; R8-3D adds no dependency.
Use `npm run typecheck` only as needed to resolve implementation wiring. Compiler
feedback alone does not establish UI_READY or TESTED.

All lint/test/preflight, build-verification and browser/visual QA work is deferred
until after backend/database integration. Existing test sources and scripts remain
intact. For that final stage, `npm run check` runs lint, typecheck, unit, preflight,
build and HTTP checks; `npm run test:e2e` runs Chromium after a build and browser
installation. Historical R8-3A results are in its [evidence document](docs/R8-3A_MEMORY_PERSONAL_FRONTEND.md)
and do not certify R8-3B, R8-3C or R8-3D.

Local development displays the labelled visual study. The retained built-server
preview command is `RIVYA_VISUAL_PREVIEW=1 npm start` after a build. Do not set
`VERCEL_ENV` manually to bypass a production restriction. An online non-production
preview additionally requires verified deployment protection. Production always
receives a holding page for these fixture routes.

## Source and document map

- `src/app/`: App Router layouts, catalogue, local enquiry, editorial and system views.
- `src/components/`: reusable first public components; `src/styles/`: semantic tokens.
- `src/lib/`: typed catalogue/editorial fixtures, local form contracts, query helpers and preview policy.
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
- `docs/R8-3B_INQUIRY_FRONTEND.md`: form source and deferred-QA boundary.
- `docs/R8-3C_PUBLIC_PAGES.md`: public-page source, original content counts and deferred QA.
- `docs/R8-3D_SYSTEM_STATES.md`: current system states, article progress and deferred QA.
- `docs/VERCEL_RUNTIME_ALIGNMENT.md`: current Node22 alignment and historical mismatch diagnosis.
- `docs/decisions/2026-09-21-main-merge.md`: owner-authorized PR #4 main integration.
- `docs/decisions/2026-09-21-new-build.md`: confirmed initial-creation decision.
- `docs/decisions/2026-09-21-development-first.md`: final-QA timing override.
- `docs/decisions/2026-09-21-r8-3b-main-merge.md`: owner-authorized PR #8 main integration.
- `docs/decisions/2026-09-21-r8-3c-main-merge.md`: owner-authorized PR #9 main integration.
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
handoff has been reached. R8-3C is merged through PR #9; new slices continue on the
development branch. Vercel Git integration exists, so development pushes may build previews
and main pushes may deploy production. This task changed no deployment settings or
domains. Read-only inspection now confirms the project Node22 setting is aligned;
this task did not change it. The runtime note preserves the earlier diagnosis.
Exact business rules and exclusions remain in the brief.
