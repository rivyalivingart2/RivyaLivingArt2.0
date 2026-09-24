# Phase 9 — Media, motion and responsive refinement

24 September 2026 · Master revision 3.10 · **Source checkpoint complete. Formal QA and production release remain gated.** Next exact task: **P10.1**.

Continues main 94f70f76c8f61c2fd0c01a3221b48d836e91ea23 (PR #23) on codex/phase-9-media-refinement. Preserves all 120 product identities, 36 articles, eight deliberately unpublished fictional projects, 59 page/API files and 144 original media/brand files. No application server, database read/write, migration, content publication, private-reference operation or deployment occurred.

## Completed source work

| Task | Result | Evidence |
|---|---|---|
| P9.1 | Reconciled 144 files with merged-main bytes and current source mappings. Inspected 15 actual source images. Corrected six mismatched gift associations using existing images; no new image needed for these gaps | phase-9-optimized-media.json; phase-9-media-corrections.json; supplied-media.ts |
| P9.2 | Home uses one picture element: same-piece portrait on compact screens, landscape above 780px. Full piece remains visible in gallery, collection feature, order summary and zoom. Published focal points reach home/editorial images; landscape journal cards; shared responsive sizes | hero-image.tsx; product-gallery.tsx; image-sizes.ts; shop-site.tsx; editorial.tsx; styles |
| P9.3 | Fine-pointer hover movement only; reduced-motion stays static. Dialog entrance is short and nonessential; no hidden essential content or scroll hijacking. Reading layout no longer receives the scroll transform that could disrupt its sticky contents | dialog.tsx; shop.module.css |
| P9.4 | Long titles/values wrap, grid children shrink, narrow footer and form summary stack correctly, gallery buttons wrap. Sidebar respects header and viewport; it becomes static on short/narrow screens. Product copy is static so a tall sticky panel cannot hide its action/details. Studio horizontal navigation and local table/media scrolling retained | public/Studio styles |
| P9.5 | Product card and gallery separated from discovery client module; six Studio editors load on demand. Closed dialogs unmount heavy children. Product/article/Studio navigation avoids speculative route prefetch. Public-media query is shared per server render; home data/settings read together. Bounded optimizer widths/quality, same-origin public media only, image failure/decorative fallback corrected | published-media.ts; workspace.tsx; product-card.tsx; public-image.tsx; next.config.ts |
| P9.6 | All 49 coverage rows, 164 instances and 59 routes carry source/QA dispositions; remaining issues have explicit phase owners | coverage.json; instances.json; phase-9-source.json |

The existing four local WOFF2 files total 75,040 bytes. Their swap/fallback behavior and licenses are preserved; no third-party font request or replacement font is introduced. No measured font, bundle, image-transfer or query-latency improvement is claimed. The source reduces avoidable work; exact browser evidence belongs to Phase 11.

## Image association correction

The filename is historical evidence, not proof of the pictured subject. These six sources visually depict different approved products than their original filename suggests. Only associations and matching metadata bytes in the source mapping change. IDs, slugs, original files and historical candidate remain intact.

| Product | Previously assigned file | Correct source file |
|---|---|---|
| DP110 | dp110-petal-drop-earrings-portrait-4x5.webp | dp120-little-archive-keepsake-box-portrait-4x5.webp |
| DP112 | dp112-initial-story-keychain-portrait-4x5.webp | dp110-petal-drop-earrings-portrait-4x5.webp |
| DP113 | dp113-chaptermark-flower-bookmark-portrait-4x5.webp | dp112-initial-story-keychain-portrait-4x5.webp |
| DP120 | dp120-little-archive-keepsake-box-portrait-4x5.webp | dp113-chaptermark-flower-bookmark-portrait-4x5.webp |
| DP115 | dp115-palm-mini-serving-tray-portrait-4x5.webp | dp117-twinleaf-mini-bookends-portrait-4x5.webp |
| DP117 | dp117-twinleaf-mini-bookends-portrait-4x5.webp | dp115-palm-mini-serving-tray-portrait-4x5.webp |

The inspected set includes River Channel portrait/room, the material close-up, Vow's framed garland, and 11 generated gift primaries (DP109–DP113 and DP115–DP120). The separate coaster primary was not part of this visual sample. The six corrections resolve observed subject swaps; this is **not** a claim that all 120 source images have passed full subject/material review. DP118 also has dark irregular edge treatment requiring final rendered review. P9-R02 and P9-R07 track these remaining checks.

No genuine completed-project photo gap is filled with a generated image. The eight fictional project records remain unpublished and the portfolio remains truthful when no real project is published.

## Saved drafts and publication

No data is silently rewritten. The media API now supplies the reviewed source association alongside the actual saved draft. Studio offers “Apply reviewed image association” when stored ownership differs; it changes the unsaved editor only and preserves focal point/caption. The catalogue receives a separate reviewed image proposal and offers “Apply reviewed product images” when the primary differs. Written copy, form fields, identity and version are preserved; the action deliberately replaces only image/gallery fields. Both still require explicit Save/Publish with the existing roles and version conflict handling.

Corrected media ownership is part of existing validation. Old published metadata for the six mismatched files will be omitted by the public reader; a product whose primary no longer belongs to it is unavailable until its reviewed media and product revisions are deliberately published. This is a **release dependency**, not a database migration and not automatic unpublication in storage. Resolve all six records together in the controlled publication checklist before enabling intake.

The original reviewed-publication.json and Phase 4 matrices remain historical. Do not reseed their six old image assignments or call that the Phase 9 candidate. phase-8-content-proposals.json remains the current copy proposal. Studio always opens saved drafts rather than overwriting them from either source proposal.

## Media delivery and preservation

The original 144 files total 31,529,633 bytes: 132 WebP images, 10 PNG brand assets, one ICO and one webmanifest. These are **repository source bytes**, not page transfer size. Existing image optimization requests WebP at quality 75 from six device widths and five thumbnail widths; public paths are limited to /media and /brand with no arbitrary query. Private customer references still use authenticated raw routes and never enter the optimizer, this manifest or image-generation tools.

Every current file matches its tracked merged-main bytes. The historic manifest hash for site.webmanifest differs from that already-tracked baseline; both hashes and the discrepancy are retained in the new register, without changing the file or inventing a cause. The other 143 historical hashes match. No raster edit, resampling, file rename or new paid service occurred.

The mobile and desktop hero use the same published product. The browser selects one responsive source; no dual preload is added. A selected gallery image loads eagerly, only the initial view gets high priority, thumbnails remain lazy, and zoom content is absent until opened. Cards retain intentional cover crops; inspection/zoom uses contain. Failed decorative thumbnails remain silent rather than showing overflow text. Meaningful failed images retain readable descriptions and gallery retry controls.

Implementation follows official [Next.js responsive image/art-direction guidance](https://nextjs.org/docs/app/api-reference/components/image), [named dynamic component loading](https://nextjs.org/docs/app/guides/lazy-loading), and [React request-scoped cache guidance](https://react.dev/reference/react/cache), consulted 24 September 2026. No cross-request cache is added to customer records, receipts, staff identity or permission decisions. Existing private/no-store responses and public visibility validation remain.

## Responsive and motion acceptance prepared for Phase 11

| Family | Source behavior | Required final evidence |
|---|---|---|
| Home/collections/search | 1/2/3-column cards, device-specific hero, aspect-ratio reservation, wrapping actions | 320/390/768/1024/1440/1920px, DPR 1/2, no layout overflow, one initial hero request |
| Product/detail/form/receipt | Full-object gallery, small thumbnails, native zoom dialog; static tall product copy; bounded desktop form sidebar; no fixed mobile submit overlay | Keyboard/swipe, Escape/focus return, mobile keyboard, 200% zoom, long answers, open/copy recovery without duplicate saves |
| Editorial/policies/journal | Landscape cards, focal-point reading images, bounded reading width, scrollable desktop contents/static compact contents | All 36 articles, captions/anchors, text zoom, failed images, empty/unpublished content |
| Studio | On-demand page editor, loading status, narrow grids, scrollable tables/board, long saved values | All roles/routes, chunk/network failure and reload, unsaved-change protection, permissions, cross-device version conflicts |
| Shared movement | Fine-pointer hover; native scrolling; content initially visible; reduced-motion disables animation/transition | Reduced-motion, no-JS/public fallback, touch-only input and keyboard focus |

Keep the existing source loading/error/not-found/expired-receipt states. Verify chunk failure reaches route recovery rather than claiming success. No synthetic inquiry or customer reference may be created in the shared future-live resources.

## Unresolved issue register

| ID | Severity | Owner/phase | Issue and required resolution | Status |
|---|---|---|---|---|
| P9-R01 | High | P10.4 / administrator | Six source image assignments corrected; saved product and media revisions are not automatically changed. Compare and apply reviewed associations in Studio, preserve edited drafts/history, publish corrected media and product revisions deliberately only after readiness gates. | Source remedy ready; durable publication pending |
| P9-R02 | High | P10.4 / P11 | 15 source images inspected, not every source image or final crop. Source filenames proved unreliable; remaining products need full image-subject and specification review. Review all 120 product primaries, owned gallery views and 36 article imagery associations. Hold mismatches; record corrections before release. | Required release review |
| P9-R03 | Medium | P11 performance/device QA | Transfer sizes, image optimization cost, chunk savings, LCP/INP/CLS and font swap are not measured. Measure exact release candidate at 320/390/768/1024/1440/1920 widths, DPR 1/2, cold/warm and slow network. Budgets below are targets, not results. | Deferred by development-first instruction |
| P9-R04 | High | P10.1 | Existing Vercel-only/free-only commercial eligibility unresolved. Fresh provider/account evidence and eligible free path required; no upgrade/trial/deployment bypass. | Production and automatic deployment held |
| P9-R05 | High | P10.2–P10.4 | Operating-policy particulars, runtime grants, staff secrets, deliberate content publication and backup/full restore remain outstanding. Carry prior phase gates; obtain only missing factual business answers, never repeat blanket plan approval. | Open |
| P9-R06 | High | P11 | Configured Preview and Production share future live resources; synthetic tests cannot run there. Different disposable DB/private storage, authorized isolated setup and exact-candidate QA before activation; both write flags remain off. | Open |
| P9-R07 | Medium | P10.4 / P11 | DP118 paperweight source has visibly dark irregular edge treatment; final crop/background suitability unproven. Inspect full rendered crop on approved backgrounds; replace only if a concrete visual defect remains, preserving original. | Recorded source observation |

Phase 11 measurement targets, not results: mobile LCP <=2.5s, INP <=200ms, CLS <=0.1; initial mobile image transfer <=600KB; card image <=120KB; initial compressed public JS <=220KB and Studio <=300KB. Measure cold/warm runs and explain any justified exceptions. Shared-media SELECT target is one per React server render; public data is still requested afresh on later requests. No closed-zoom image request and one initial hero resource are specific network assertions. Provider quota/cost eligibility remains P10; bounded image settings do not themselves establish commercial eligibility.

## Checks and continuation

TypeScript no-emit wiring passes on Node 22.23.2. Source comparison, route/instance inventory and asset-byte preservation are recorded; they do not establish runtime behavior. No lint, build, unit, browser, device, API, security, database, backup-restore or live performance QA was run under the development-first instruction.

Continue **P10.1** under master 3.10: obtain fresh Vercel account/hosting eligibility evidence, then the integrated readiness audit/remediation. Keep the existing free-only/Vercel-only commercial hold, both order-write flags off and automatic Git deployment disabled. Carry the unanswered exact retention/cancellation/delivery facts forward; do not ask for the same plan/product/image approvals. Shared Preview/Production and private storage approvals persist; never replay applied Phase 2/6 migrations blindly.

Git publication is the remaining checkpoint action. The implementation receipt and local completion artifact will record independently verified commit identities.
