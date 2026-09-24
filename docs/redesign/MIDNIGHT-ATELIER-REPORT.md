# RivyaLivingArt — Midnight atelier redesign

24 September 2026. Dedicated branch: `codex/midnight-atelier`, based on current main `eb23160`. This is a presentation evolution of the published ShopSite application. The legacy application has not been restored.

## Design implemented

| Area | Result |
|---|---|
| Shared identity | Deep canvas, navy, forest and dark elevated surfaces; ivory text; restrained bronze gradient with dark CTA text |
| Typography | Existing local Instrument Serif for display, DM Sans for text/UI and JetBrains Mono for identifiers; no remote fonts or new packages |
| Public shell | Quiet dark sticky header, supplied wordmark presented in ivory, dark collection dropdown, accessible search/mobile dialogs and multi-column footer |
| Home | 47/53 split hero with current published product; slim introduction strip; staggered three-piece selection; numbered categories with actual published counts; material split; four process columns; three image-led worlds; dark journal and oversized closing invitation |
| Catalogue/detail | Aligned full catalogue, 4:5 product imagery, small product IDs, full-product containment, editorial titles, thin specifications and dark gallery controls |
| Forms/editorial | Dark 48px controls, preserved labels/validation/receipts, bounded reading measures, dark policy/error/empty states and a clear custom-piece page heading |
| Studio | Dark gradient login, forest navigation with thin bronze indicator, navy panels, ivory metrics, dark tables/editors and all eight Kanban stages with existing controls |
| Motion | CSS-only, short restrained movement, hover scale capped at 1.025; reduced-motion support; no decorative entrance delay on forms or Studio |

The restored legacy patterns are layout, typography, spacing and restrained motion. Every visible catalogue record/count and linked form continues to come from current published data.

## Files changed

| Files | Purpose |
|---|---|
| `src/styles/tokens.css`, `src/app/layout.tsx` | Shared palette, gradients, motion and local font loading |
| `src/components/shop/shop.module.css` | Complete public theme and responsive editorial layouts |
| `src/components/shop/shop-site.tsx` | Database-backed home composition and dark related sections |
| `src/components/shop/product-card.tsx`, `hero-image.tsx` | Small identifiers and appropriate split-hero image sizing |
| `src/components/shop/header.tsx` | Fix native search submission being cancelled by premature dialog unmount |
| `src/app/commission/customize/page.tsx` | Add the missing main page heading and shared introduction |
| `src/components/studio-private.css`, `src/components/studio/workspace.module.css` | Login, board and workspace presentation; fix narrow-screen filter wrapping |
| `tools/release-qa/public.mjs`, `midnight.mjs` | Six-width checks and redesign-specific browser regression coverage |
| `AGENTS.md`, `PROJECT_STATE.md`, `docs/CODEX_WORKFLOW.md`, master/decision/checkpoint/report | Active authority, progress and resumable handoff |

## Functional boundaries preserved

No database migration or schema change, no product/content/media publication changes, no changes to API routes, authentication, sessions, roles, permissions, order persistence, uploads, business settings, privacy controls, retention operations, revision history, SEO or structured data. Original assets and existing drafts remain intact. No new dependencies or paid services.

WhatsApp remains order-specific: save the request and references to the database/Studio, prepare the message, then provide Open/Copy and manual customer Send. No automatic message, general chat, customer account or payment gateway was added.

Two narrow frontend defects discovered during review were corrected: the search form was being removed before its native GET navigation; the custom-piece page lacked an H1. A Studio flex-basis correction keeps inquiry filters usable on narrow screens.

## Verification and remaining review

Completed evidence and deployment details are recorded in `MIDNIGHT-ATELIER-CHECKPOINT.md`. Tests use the existing isolated QA database and private reference store. The normal Preview continues to use the previously authorized shared live resources; test submissions were not made there.

Physical-device behavior, assistive-technology review and owner visual acceptance remain separate from automated Chrome checks. The 200% check emulates the effective CSS viewport and is not a claim of physical browser zoom verification. Existing operational items in `PENDING-WORK.md` remain outside this presentation task.

Production remains the previous release. This redesign is delivered as a protected Preview for review; main merge and Production promotion require the next owner instruction.

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
