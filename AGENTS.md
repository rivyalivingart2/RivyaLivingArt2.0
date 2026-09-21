# RivyaLivingArt repository guidance

Read this file, `PROJECT_STATE.md`, `docs/CODEX_WORKFLOW.md` and the applicable
Revision 8 specification before editing.

## Latest owner decision — 21 September 2026

**This is a new build.** The Markdown files were the brief, not missing application
source. The owner explicitly authorized the first application here; see
`docs/decisions/2026-09-21-new-build.md`. Earlier source-restoration guards are
superseded for this initialization. Do not restart the source-gap/approval loop.
The first frontend source now exists. Preserve it, all briefs and Git history.

The owner subsequently authorized merging accumulated work into main; PRs #4 and
#5 are merged. PR #6 was also already merged when R8-3A began; main is now
`b1f0e095721d5b56a502598fe1478893ebf4e356`. Continue new work on the development
branch. See `docs/decisions/2026-09-21-main-merge.md`. Visual QA remains required.

- Exact brand: **RivyaLivingArt**. Large collectible resin furniture/spatial art
  leads; memory art and personal gifts are distinct secondary journeys.
- Follow frontend-first R8-0–R8-5, owner visual review, then backend R8-6 onward.
  Track SOURCE_IMPLEMENTED, UI_READY, BACKEND_CONNECTED and TESTED separately.
- Dark forest/bronze/ivory tokens. Reuse components and typed, labelled fixtures.
  No fake login, sessions, persistence, upload, payment, review or production claims.
- Build our own CMS later; no Sanity, scraping, Higgsfield, continuous Drive sync,
  in-CMS media generation, customer accounts, checkout or payment integration.
- S01 MFA/passkeys, S02 PDF quotation builder, S03 enhanced finish comparison and
  S04 private client approvals remain excluded. Do not re-propose them.
- Use approved Drive media first. Write missing image/video prompts for the owner
  in the existing separate asset document. No replacement logo, product recolouring,
  private media or large original media collections in Git.
- Twenty-four labelled source fixtures exist: 12 LARGE / 6 MEDIUM / 6 SMALL;
  two images, 22 pending visuals. The complete demo dataset, CMS,
  staff login, data/storage and real enquiries remain planned work.
- Current visual flag is NOT authentication. Online preview requires separately
  verified deployment protection. Never enable fixture routes in Vercel production.
- No secrets in code, prompts, commits, diagnostics or `.env.example`.

## Actual commands and current verification boundary

Node 22; npm project at repository root. The actual dependency tree and reviewed
package-lock.json now exist. A clean npm ci, lint, semantic typecheck, unit/preflight
tests and production build passed in the continuation slice. See
`docs/R8-1_DEPENDENCY_VERIFICATION.md` for install/runtime evidence and
`docs/R8-1_BROWSER_VERIFICATION.md` for the foundation browser results. Current R8-2
furniture evidence and media limits are in `docs/R8-2_FURNITURE_FRONTEND.md`.

```sh
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npm run test:preflight
npm run test:runtime # after npm run build; real HTTP checks
npx playwright install chromium # once per browser environment
npm run test:e2e # after npm run build; actual local browser tests
```

R8-3A memory/personal collections and tier-specific details now pass actual checks:
48 unit, 12 preflight, 95 HTTP and 146 Chromium browser tests, with 10 mobile-only
cases inapplicable on desktop/tablet. Clean npm ci, lint/typecheck/build pass. Read
`docs/R8-3A_MEMORY_PERSONAL_FRONTEND.md` for current evidence and media limits.
Browser Use's cloud loopback restriction is unchanged; local Playwright supplies
real app evidence without weakening network controls. This is not R8-5 owner approval.
Next: R8-3B commission/preservation/gifting form visuals, keyboard validation,
local summary and explicitly simulated receipt; no real submission or upload.

The owner-created Vercel project now exists and main deployments are READY. Preview
authentication is reported enabled. Recheck deployment target and protection before
publishing. The Node22 app overrides a Node24 project default; saving 22.x in the
Vercel dashboard remains an owner action because setting-write access is unavailable.
See `docs/VERCEL_RUNTIME_ALIGNMENT.md`. Never expose fixtures in production.

## Git and continuity

Work on `codex/r8-first-frontend` or its reviewed successor in the confirmed repo.
Inspect current changes, remote identity and deployment triggers. After a coherent
slice: run checks, update docs/checkpoint, stage only owned files, commit normally,
publish to the safe work branch and verify the actual remote SHA. A blocked partial
checkpoint must state its failing/unrun checks. No force-push, production merge,
branch deletion, automatic deployment or live-domain changes.

The full requirements remain the nine Revision 8 documents. Apply the dated new-build
override above where they still describe nonexistent prior source. Do not rewrite
historical audits or create another competing master pack.
