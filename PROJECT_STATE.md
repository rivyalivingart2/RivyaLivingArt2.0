# RivyaLivingArt project state

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
