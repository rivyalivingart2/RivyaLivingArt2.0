# Continuation — modern redesign Phase 2 ready for review

## Current stop
The owner approved Phase 1 previews and authorized Phase 2 only. Phase 2 reusable presentation/motion/media components and local previews are implemented and verified. **Stop before Phase 3 until the owner explicitly approves the animation/media previews.** The current seven-phase redesign supersedes the old visual-matching project; do not resume historical M0–M11 tasks or replay publication work.

## Working state
- Local branch: `codex/redesign-phase2-foundation`.
- Production base main: `4cadf21b380a8f3753232318fbb78027aa09ffc5`; parent local Phase 1 commit `e54390c`.
- Read `PHASE-2-REVIEW.md`, `phase2-verification.json` and `phase2-media-register.json`.
- Reusable source: `src/components/design-foundation/`; no existing route imports it.
- Preview: `experiments/redesign-phase2/`; direction/design documentation is scoped there.
- Start from repo root: `node experiments/redesign-phase2/build.mjs`, then `node experiments/redesign-phase2/serve.mjs`.
- Review `http://127.0.0.1:4179/`, `/#media`, and `/studio`. The loopback preview remains available in this session; restart if needed.
- Committed media derivatives make the preview reproducible without another Drive login. Original downloads and screenshots are retained locally under ignored output directories.

## Verification and preservation
57/57 primary plus 22/22 edge browser checks passed. Next build, application/preview TypeScript, focused foundation lint and all 344 existing unit tests passed. The independent reviewer scored three requested corrections resolved and returned ship for the local Phase 2 fix review. All 15 final captures are recorded. Detector unavailable due to a Windows launcher error; no native/device/human acceptance is inferred.

932 of 934 source-baseline files are byte-identical; only package.json/package-lock.json differ to add GSAP 3.15.0 and @gsap/react 2.1.2. All previous lockfile package records are retained. Existing logo, public media, content, translations, data contracts, routes, permissions, drafts and publication logic are unchanged. New components are opt-in, not integrated. No production/Studio/Drive writes, push or deployment occurred. A fresh private database digest remains necessary before any future authorized data-connected integration.

## Decisions carried forward
- Retain the approved Phase 1 palette and contemporary material gallery layouts.
- Use native browser scrolling and smooth anchor navigation. ScrollSmoother was prototyped and rejected because focus could move controls between pointer-down and pointer-up. Do not silently reintroduce it.
- GSAP image/heading transforms run only for desktop fine pointers without reduced motion. Text is readable initially and reading/form/table content stays steady.
- Film starts from a poster, loads on request, has play/pause and native controls; labels remain material visualization.
- Six Drive image candidates, 36 variants and all 18 homepage media decisions are registered. New candidate Studio IDs are null; the existing film is source-defined resin-pour. Preserve existing associations/crops until explicitly integrating an approved choice.
- Supplied maker-hands imagery is a visual study, not evidence of an actual Rivya worker. Concepts and fictional samples retain their disclosures.
- Phase 1 DESIGN.md/sidecar approval wording is historical. Phase 2 direction and this checkpoint record the subsequent approval; do not rewrite old evidence as newly tested.

## Next authorized boundary
Show the owner the Phase 2 animation/media previews and wait. After explicit Phase 3 approval, integrate only that phase from the approved seven-phase plan; reconcile the 18-slot map, preserve conditions and data, and take fresh authorized read-only baselines where needed. Future push/release requires explicit authorization, detailed PR into main and deployment verification. Scrapers, old-product transfers and backup work remain excluded.
