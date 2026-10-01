# P3–P5 changed-file register

Comparison base: `8990e73e818c9a0f9aba8183c1e2d9f74a5206c9` (previous main). Application implementation ends at `a06971bf17ebe26d989c3046789258b83687ae48`; PR preparation adds documentation only. The complete PR contains 128 changed files. Every file is listed below; GitHub retains the exact diff and all original commits. No credentials, build output, raw QA logs, private customer media or untracked environment files are included.

## Included implementation commits

- 3fbf2de Start P3 page image placement workspace and record PR-only publication rule
- 5ec565e Complete P3 reviewed editorial ingestion and page image workflows
- b2eab08 feat: start P4 with detailed homepage and published navigation
- 4207b01 Implement P4B-P4E detailed pages and Studio publishing workflows
- 87ae884 Start P5 Studio shell and scoped work queue
- a06971b Complete P5 Studio workflows and isolated acceptance

## File inventory

| Area | Changed file |
|---|---|
| Documentation | `AGENTS.md` |
| Documentation | `PROJECT_STATE.md` |
| Documentation | `docs/CODEX_WORKFLOW.md` |
| Documentation | `docs/decisions/2026-10-01-local-first-pr-and-p3.md` |
| Documentation | `docs/decisions/2026-10-01-p3-completion.md` |
| Documentation | `docs/decisions/2026-10-01-p4-completion.md` |
| Documentation | `docs/decisions/2026-10-01-p4-start.md` |
| Documentation | `docs/decisions/2026-10-01-p5-completion.md` |
| Documentation | `docs/decisions/2026-10-01-p5-start.md` |
| Documentation | `docs/decisions/2026-10-01-publish-p3-p5-main.md` |
| Documentation | `docs/redesign/P3-CHECKPOINT.md` |
| Documentation | `docs/redesign/P3-CLOSURE.md` |
| Documentation | `docs/redesign/P3-P5-CHANGE-REGISTER.md` |
| Documentation | `docs/redesign/P3-P5-MAIN-SUMMARY.md` |
| Documentation | `docs/redesign/P4-CHECKPOINT.md` |
| Documentation | `docs/redesign/P4-CLOSURE.md` |
| Documentation | `docs/redesign/P4-HOME-SECTION-DISPOSITION.md` |
| Documentation | `docs/redesign/P4-SECTION-DISPOSITION.md` |
| Documentation | `docs/redesign/P5-CHECKPOINT.md` |
| Documentation | `docs/redesign/P5-CLOSURE.md` |
| Documentation | `docs/redesign/P5-REFERENCE-COMPARISON.md` |
| Documentation | `docs/redesign/P5A-IMPLEMENTATION.md` |
| Documentation | `docs/redesign/p3-editorial-asset-review.json` |
| Documentation | `docs/redesign/p3-editorial-release-manifest.json` |
| Documentation | `docs/redesign/p4-public-pages-release.json` |
| Documentation | `docs/redesign/p4-validation.json` |
| Documentation | `docs/redesign/p4a-home-release.json` |
| Documentation | `docs/redesign/p4a-validation.json` |
| Documentation | `docs/redesign/p5-family-coverage.csv` |
| Documentation | `docs/redesign/p5-validation.json` |
| Documentation | `docs/redesign/p5a-validation.json` |
| Public pages / shared model | `next.config.ts` |
| Studio / server | `src/app/api/studio/editorial-assets/image/route.ts` |
| Studio / server | `src/app/api/studio/editorial-assets/route.ts` |
| Studio / server | `src/app/api/studio/operations/route.ts` |
| Studio / server | `src/app/api/studio/orders/route.ts` |
| Studio / server | `src/app/api/studio/work-queue/route.ts` |
| Studio / server | `src/app/api/studio/workspace/route.ts` |
| Public pages / shared model | `src/app/editorial/[id]/route.ts` |
| Public pages / shared model | `src/app/error.tsx` |
| Public pages / shared model | `src/app/not-found.tsx` |
| Public pages / shared model | `src/app/p/[slug]/page.tsx` |
| Public pages / shared model | `src/app/saved-pieces/page.tsx` |
| Public pages / shared model | `src/components/shop/catalogue-browser.tsx` |
| Public pages / shared model | `src/components/shop/collection-document.tsx` |
| Public pages / shared model | `src/components/shop/customization-fields.tsx` |
| Public pages / shared model | `src/components/shop/detailed-pages.module.css` |
| Public pages / shared model | `src/components/shop/dialog.tsx` |
| Public pages / shared model | `src/components/shop/editorial-chapter.tsx` |
| Public pages / shared model | `src/components/shop/editorial-image.tsx` |
| Public pages / shared model | `src/components/shop/editorial.tsx` |
| Public pages / shared model | `src/components/shop/faq-browser.tsx` |
| Public pages / shared model | `src/components/shop/header.tsx` |
| Public pages / shared model | `src/components/shop/homepage-document.tsx` |
| Public pages / shared model | `src/components/shop/homepage.module.css` |
| Public pages / shared model | `src/components/shop/journal-browser.tsx` |
| Public pages / shared model | `src/components/shop/order-form.tsx` |
| Public pages / shared model | `src/components/shop/product-card.tsx` |
| Public pages / shared model | `src/components/shop/product-gallery.tsx` |
| Public pages / shared model | `src/components/shop/saved-piece-button.tsx` |
| Public pages / shared model | `src/components/shop/saved-pieces.tsx` |
| Public pages / shared model | `src/components/shop/saved-receipt.tsx` |
| Public pages / shared model | `src/components/shop/shop-frame.tsx` |
| Public pages / shared model | `src/components/shop/shop-shell.tsx` |
| Public pages / shared model | `src/components/shop/shop-site.tsx` |
| Public pages / shared model | `src/components/shop/structured-data.tsx` |
| Studio / server | `src/components/studio-login.tsx` |
| Studio / server | `src/components/studio-orders-board.tsx` |
| Studio / server | `src/components/studio-private.css` |
| Studio / server | `src/components/studio/business-settings.tsx` |
| Studio / server | `src/components/studio/catalogue-editor.tsx` |
| Studio / server | `src/components/studio/content-compare.tsx` |
| Studio / server | `src/components/studio/content-editor.tsx` |
| Studio / server | `src/components/studio/content-health.tsx` |
| Studio / server | `src/components/studio/editorial-asset-library.tsx` |
| Studio / server | `src/components/studio/homepage-editor.tsx` |
| Studio / server | `src/components/studio/inquiry-board.tsx` |
| Studio / server | `src/components/studio/inquiry-detail.tsx` |
| Studio / server | `src/components/studio/inquiry-workspace.tsx` |
| Studio / server | `src/components/studio/media-library.tsx` |
| Studio / server | `src/components/studio/operations.tsx` |
| Studio / server | `src/components/studio/overview-panel.tsx` |
| Studio / server | `src/components/studio/page-sections-editor.tsx` |
| Studio / server | `src/components/studio/publication-queue.tsx` |
| Studio / server | `src/components/studio/read-content-health.ts` |
| Studio / server | `src/components/studio/record-status.tsx` |
| Studio / server | `src/components/studio/record-switch.tsx` |
| Studio / server | `src/components/studio/site-images-editor.tsx` |
| Studio / server | `src/components/studio/staff-editor.tsx` |
| Studio / server | `src/components/studio/workspace.module.css` |
| Studio / server | `src/components/studio/workspace.tsx` |
| Public pages / shared model | `src/lib/business-time.ts` |
| Public pages / shared model | `src/lib/content-health-report.ts` |
| Public pages / shared model | `src/lib/content-issues.ts` |
| Public pages / shared model | `src/lib/content-model.ts` |
| Public pages / shared model | `src/lib/content-preview-model.ts` |
| Public pages / shared model | `src/lib/custom-page-identity.ts` |
| Public pages / shared model | `src/lib/detailed-pages.ts` |
| Public pages / shared model | `src/lib/discovery-preview-url.ts` |
| Public pages / shared model | `src/lib/editorial-media-model.ts` |
| Public pages / shared model | `src/lib/editorial-media-processing.ts` |
| Public pages / shared model | `src/lib/editorial-media-storage.ts` |
| Public pages / shared model | `src/lib/editorial-slots.ts` |
| Public pages / shared model | `src/lib/homepage-dependencies.ts` |
| Public pages / shared model | `src/lib/homepage-model.ts` |
| Public pages / shared model | `src/lib/homepage-persistence.ts` |
| Public pages / shared model | `src/lib/homepage-restoration.ts` |
| Public pages / shared model | `src/lib/navigation-availability.ts` |
| Public pages / shared model | `src/lib/page-dependencies.ts` |
| Public pages / shared model | `src/lib/product-presentation.ts` |
| Public pages / shared model | `src/lib/published-content.ts` |
| Public pages / shared model | `src/lib/published-media.ts` |
| Public pages / shared model | `src/lib/published-navigation.ts` |
| Public pages / shared model | `src/lib/saved-content-preview.tsx` |
| Public pages / shared model | `src/lib/saved-pieces.ts` |
| Public pages / shared model | `src/lib/site-metadata.ts` |
| Studio / server | `src/lib/studio-inquiry-view.ts` |
| Studio / server | `src/lib/studio-modules.ts` |
| Studio / server | `src/lib/studio-record-links.ts` |
| Studio / server | `src/lib/studio-work-queue.ts` |
| Verification | `tests/p3-editorial-media.test.mjs` |
| Verification | `tests/p3-editorial-slots.test.mjs` |
| Verification | `tests/p4-detailed-pages.test.mjs` |
| Verification | `tests/p4-homepage-restoration.test.mjs` |
| Verification | `tests/p5-inquiry-continuity.test.mjs` |
| Verification | `tests/p5-studio-workspace.test.mjs` |
| Verification | `tests/release-contracts.test.mjs` |
| Verification | `tools/frontend-runtime.test.mjs` |
