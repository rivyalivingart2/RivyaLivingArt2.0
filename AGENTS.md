# RivyaLivingArt repository guidance

Read this file, `PROJECT_STATE.md`, `docs/CODEX_WORKFLOW.md` and the applicable
Revision 8 specification before editing.

## Latest owner decision — 21 September 2026

**This is a new build.** The Markdown files were the brief, not missing application
source. The owner explicitly authorized the first application here; see
`docs/decisions/2026-09-21-new-build.md`. Earlier source-restoration guards are
superseded for this initialization. Do not restart the source-gap/approval loop.
The first frontend source now exists. Preserve it, all briefs and Git history.

The owner subsequently authorized merging R8-3A into main. PR #7 is merged at
`0999b3b0a873e0745231f119c1567b3f8cd79fd8`; the remote SHA was verified.
New R8-3B work continues on the development branch.

**Latest override: development first; all testing-related work moves to the final
stage after backend/database integration.** Do not run per-slice lint, test,
preflight, build-verification or browser/visual QA gates. Compiler/typechecking
may resolve development wiring only; it does not establish TESTED. Keep all test
source, commands and checks intact for final QA. This overrides conflicting timing
in the older briefs and workflow. See
`docs/decisions/2026-09-21-development-first.md`.

- Exact brand: **RivyaLivingArt**. Large collectible resin furniture/spatial art
  leads; memory art and personal gifts are distinct secondary journeys.
- Continue public frontend, then Studio, then the R8-5 protected development-preview
  handoff and owner review, before backend R8-6 onward. Full QA is no longer a
  prerequisite to integration. Do not invent owner visual approval. Track
  SOURCE_IMPLEMENTED, UI_READY, BACKEND_CONNECTED and TESTED separately.
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

## Deferred checks and current development boundary

Node 22; npm project at repository root. The actual dependency tree and reviewed
package-lock.json exist. No dependency change is needed for R8-3B. Commands below
remain available for the final QA stage; this is not an instruction to run them
during the current development slices.

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

Historical R8-3A memory/personal checks passed before the timing override:
48 unit, 12 preflight, 95 HTTP and 146 Chromium browser tests, with 10 mobile-only
cases inapplicable on desktop/tablet. Clean npm ci, lint/typecheck/build pass. Read
`docs/R8-3A_MEMORY_PERSONAL_FRONTEND.md` for current evidence and media limits.
Browser Use's cloud loopback restriction is unchanged; local Playwright supplies
real app evidence without weakening network controls. Those results do not cover
R8-3B and are not R8-5 owner approval.

R8-3B develops typed, client-only commission, preservation and gifting forms,
local validation/summary, an explicitly simulated receipt and local reference-image
preview. No real submissions, uploads, persistence or messages. Read
`docs/R8-3B_INQUIRY_FRONTEND.md`; its new source is untested and final QA is deferred.
Next: R8-3C journal/article, FAQ, about/process/materials/care, portfolio, contact,
search and approved service-page frontend work.

The owner-created Vercel project now exists and main deployments are READY. Preview
authentication is reported enabled. Recheck deployment target and protection before
publishing. The Node22 app overrides a Node24 project default; saving 22.x in the
Vercel dashboard remains an owner action because setting-write access is unavailable.
See `docs/VERCEL_RUNTIME_ALIGNMENT.md`. Never expose fixtures in production.

## Git and continuity

Work on `codex/r8-first-frontend` or its reviewed successor in the confirmed repo.
Inspect current changes, remote identity and deployment triggers. After a coherent
slice: update docs/checkpoint, inspect changes for the development commit, stage
only owned files, commit normally, publish to the safe work branch and verify the
actual remote SHA. Record testing as deferred, not passed; existing evidence only
covers its recorded revision. The R8-3A merge is not standing authorization to merge
later slices. No force-push, branch deletion, automatic production release or
live-domain changes.

The full requirements remain the nine Revision 8 documents. Apply the dated new-build
override above where they still describe nonexistent prior source. Do not rewrite
historical audits or create another competing master pack.
