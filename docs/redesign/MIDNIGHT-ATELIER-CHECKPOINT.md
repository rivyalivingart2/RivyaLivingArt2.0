# Midnight atelier redesign — continuation checkpoint

Updated 24 September 2026. Active authority: docs/decisions/2026-09-24-midnight-atelier.md.

## Source and boundaries

Branch: codex/midnight-atelier. Base: main eb2316019ad260a877ee2c3cdb63fcd5fd3b5bb9. Legacy visual reference only: f9533bbbaf3cc2843025f1a1243442b0a9d920e8.

Presentation implemented: shared dark/bronze tokens; local Instrument Serif and JetBrains Mono with existing DM Sans; dark accessible header/footer/dropdown/dialog surfaces; 47/53 hero; three staggered featured products; live category counts/links; material split; four process columns; three image-led worlds; dark journal/invitation; aligned catalogue and object-contained galleries; dark forms/policies/states; Studio login, navigation, metrics, tables, editors and eight-stage Kanban styling. Reduced-motion controls are retained.

No backend, schema, API, permission, persistence, media-source, policy or metadata changes. Original asset files are unchanged. Header/footer present the existing supplied logo in ivory through CSS. WhatsApp remains saved-order Open/Copy with manual Send.

The browser review found a pre-existing search submission race: closing the dialog during the native submit event detached its form before the browser could navigate. Removing that premature close preserves native GET submission; route navigation resets the dialog as before.

## Verification completed for this presentation handoff

- First pass: lint, typecheck, production build, 178 unit checks, 12 preflight and 386 HTTP checks passed.
- Isolated database-backed order workflow: 11 checks passed, including save-before-handoff, private reference linking and Studio visibility.
- Isolated Studio permissions/order flow: 14 checks passed.
- 276 published product/customization/article routes passed. 42 automated accessibility/layout combinations at 320, 390, 768, 1024, 1200 and 1440px had no reported violations or page overflow.
- Redesign interaction suite: 15 grouped checks passed with zero browser page errors, including keyboard skip/search, gallery focus return, mobile menu, reduced motion, empty search, image failure, all public page groups/404, 200% equivalent reflow, 54 authenticated Studio route/width combinations, nine opened-editor/width combinations and session expiry.
- Final hero screenshots visually reviewed at 320, 390, 768, 1024, 1200 and 1600px; Studio desktop/tablet screenshots reviewed. Tablet hero width corrected to fill its grid track without cropping the product.
- Review corrected a pre-existing 320px Studio inquiry-filter flex issue and added the missing H1 to the bespoke form. No order or editor mutation logic changed.
- Browser automation uses Playwright with system Chrome. Agent-browser could not establish its CDP channel, so the existing repository Playwright tooling provided the actual verification.
- No synthetic submissions to shared live resources. QA database remains rivya_qa_20260924; credentials stay in ignored files.

## Delivery checkpoint

Implementation and scoped regression review are complete. The dedicated branch is published to GitHub and the protected Preview is READY. See the publication receipt below. No main merge or Production deployment was performed for this redesign.

## Remaining owner/operational review

- Owner visual acceptance of the protected Preview.
- Physical-device and assistive-technology review; zoom geometry was emulated rather than changed through a physical browser UI. Automated checks do not establish universal accessibility certification.
- The existing operational list in PENDING-WORK.md (privacy erasure/replay, backup custody/operational proof and other deferred release items) is unchanged and outside this presentation task.
- Following owner acceptance, any requested main merge/Production promotion must preserve current data, settings, protection and secrets.

Runtime/data/API/auth/security source files and original asset bytes are unchanged. Local QA evidence is under ignored test-results/midnight and test-results/release-qa; local command logs are in the task outputs/phase11-local directory. These are isolated synthetic-data results, not tests against shared live records.
## Protected Preview publication

- Vercel status: READY; target: Preview.
- Preview: https://rivya-living-art2-0-jnta1utfl-rivyalivingart20-4705.vercel.app
- Implementation commit: 6c539217074ba826f0a3c4cd70801427ef6a2e44.
- Deployment: dpl_DbktSdAL6c2aVK1a7Xq2hq6QnzbR.
- GitHub review: https://github.com/rivyalivingart2/RivyaLivingArt2.0/pull/27 (draft, not merged).
- Existing Vercel authentication protection is retained. The hosted request redirects to Vercel authentication; no public bypass was published. Application interaction evidence comes from isolated QA.
- Production was read back unchanged at dpl_EtSWDywAQSZrMcBiRAH1Lh28cdBk, source eb2316019ad260a877ee2c3cdb63fcd5fd3b5bb9.
- This receipt is a documentation-only follow-up to the deployed implementation commit. No application code changed after that deployment.
## Owner visual correction — images fill their frames (24 September 2026)

The owner supplied six screenshots and explicitly requested that website images fill their containers. This supersedes the earlier contain-style photography direction for framed public imagery. Hero, material, collection, journey, catalogue, product/form and enlarged-gallery images now use proportional cover fitting with their existing focal positions. Original image files remain unchanged. The supplied logo retains its proper proportions. Journal cards retain wide 16:10 frames, fixing the later portrait-card rule that had overridden their editorial aspect ratio.

This is a presentation-only correction on codex/midnight-atelier / PR #27, to be delivered to protected Preview. Production remains unchanged. The build passed; focused desktop/tablet/mobile visual review is recorded with the follow-up Preview receipt.

Image-fill follow-up READY: https://rivya-living-art2-0-f8zfezxhg-rivyalivingart20-4705.vercel.app

Deployed implementation: 8aba9ab88c13f97eeb535611e033112018d139ef. Vercel deployment: dpl_EUtxLZMAZdLyDZdMWcz1ypnnH9Pb. The build and focused image-fitting/reflow review passed on five public page types at 390, 768 and 1440px (15 combinations). Loaded journal and material screenshots were visually reviewed. Existing Production was verified unchanged. This receipt is documentation-only; the deployed application code is unchanged by it.
