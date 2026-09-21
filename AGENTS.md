# RivyaLivingArt repository guidance

Read this file, `PROJECT_STATE.md`, `docs/CODEX_WORKFLOW.md` and the applicable
Revision 8 specification before editing.

## Latest owner decision — 21 September 2026

**This is a new build.** The Markdown files were the brief, not missing application
source. The owner explicitly authorized the first application here; see
`docs/decisions/2026-09-21-new-build.md`. Earlier source-restoration guards are
superseded for this initialization. Do not restart the source-gap/approval loop.
The first frontend source now exists. Preserve it, all briefs and Git history.

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
- Only two source fixtures exist in this slice. The complete demo dataset, CMS,
  staff login, data/storage and real enquiries remain planned work.
- Current visual flag is NOT authentication. Online preview requires separately
  verified deployment protection. Never enable fixture routes in Vercel production.
- No secrets in code, prompts, commits, diagnostics or `.env.example`.

## Actual commands and current verification boundary

Node 22; npm project at repository root. The actual dependency tree and reviewed
package-lock.json now exist. A clean npm ci, lint, semantic typecheck, unit/preflight
tests and production build passed in the continuation slice. See
`docs/R8-1_DEPENDENCY_VERIFICATION.md` for current evidence and limits.

```sh
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npm run test:preflight
npm run test:runtime # after npm run build; real HTTP checks, not a browser test
```

The earlier npm/Git network blocker is resolved in this workspace. Actual hydrated
browser verification remains blocked: Browser Use rejected the local app with
ERR_BLOCKED_BY_CLIENT. No desktop/mobile screenshot, keyboard, focus or image-decode
pass is claimed. Complete those checks in an authorized browser-capable environment
before treating the foundation as UI_READY or continuing the furniture visuals.
Do not weaken network controls or substitute static HTML evidence.

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
