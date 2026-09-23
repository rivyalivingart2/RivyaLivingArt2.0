# Phase 3 — shared design-system implementation

23 September 2026 · approved master revision 3.3 · P3.1–P3.6 source complete.

## Baseline and evidence boundary

Existing repository retained. Phase 2 was merged through PR #16 to main 85b476df358d9fb07c9a8ec07cc478da581138f4; its tree matches Phase 2 checkpoint cdc8a3da516d82b2c88b443a8584ca4dfa9da369. Branch: codex/phase-3-design-system. The Git commit containing this report identifies the implementation snapshot; verify the branch remotely before resuming.

This is a source completion record, not visual, accessibility, browser, authentication or database certification. Node 22.23.2 TypeScript no-emit compiler wiring passes. CSS is parsed with the existing PostCSS dependency and token ratios are calculated from source colors. Formal lint, build, suites, browser/device checks and full integrated QA remain Phase 11. No development server, migration, seed or deployment was run.

## P3.1 — retained-source audit and resolutions

| Finding in the inherited source | Phase 3 resolution |
|---|---|
| Public shell duplicated navy/ivory/bronze tokens; bronze differed from the approved palette | Shared root roles; approved bronze #B08D57; forest alias retained for existing page classes |
| Header navigation was 13px, with a retained 11px compact rule; 76px compact header | Effective active navigation 16px; 84px desktop / 72px compact; content-based collapse at 1200px |
| Header was not sticky; sticky sidebars used a 25px top offset | Sticky header and shared anchor offset; product/form/sidebar offsets leave space beneath it |
| Mobile menu independently cleared body overflow; search and Studio dialogs used another lock | One native Dialog primitive with reference-counted scroll locking and cleanup |
| Route changes and breakpoint changes could leave a menu open | Route-keyed header state and a cleaned-up 1201px media listener dismiss the mobile menu |
| Only JavaScript could open the compact navigation | Native noscript disclosure provides all collection/page/search/customization links |
| Dialog styles depended on being inside the public site | Explicit dialog fonts, colors, focus, button and viewport sizing also serve Studio |
| Reduced-motion disabled transitions but retained hover zoom | Static reset removes hover/focus transforms; no essential content is faded out |
| Studio had two conflicting generations of login/board CSS | One token-based login/board stylesheet; workspace controls use shared semantic roles |
| Shared footer/metadata described broad WhatsApp conversation | General copy removed; order actions remain in the saved-order workflow |

Local Cormorant Garamond 400 normal/italic and DM Sans 400/500, their license files, supplied logo, images, drafts and catalogue records are retained. No remote font loader or new package/asset is introduced. Legacy source presentations remain available; shared active rules are scoped so page composition can continue in later phases.

## P3.2 — roles, grid and contrast

Forest #19221C remains the primary brand color; navy #0B1728 frames navigation and Studio. Ivory #F3EFE7 holds light chapters; ink #18202A is their text. Bronze #B08D57 is decorative on ivory and may be an accent on dark surfaces. Forest and navy must never be the only distinction between text, controls or active states.

| Source pair | Calculated ratio | Intended role |
|---|---|---|
| Ivory / navy | 15.69:1 | Public/Studio body and inverse controls |
| Ivory / forest | 14.23:1 | Atelier chapters |
| Ink / ivory | 14.32:1 | Light text and controls |
| Bronze / navy | 5.82:1 | Dark-surface accent |
| Bronze / ivory | 2.70:1 | Decoration only; never normal text/focus boundary |
| Control border #8B96A3 / field #122336 | 5.30:1 | Visible dark field boundary |
| Control border #65717D / ivory | 4.35:1 | Visible light field boundary |
| Focus #E6BA85 / navy | 10.05:1 | Dark focus ring |
| Error #FFD1C5 / field #122336 | 11.50:1 | Dark error text plus textual reason |
| Muted #B7BFB5 / Studio panel #112033 | 8.71:1 | Supporting staff text |

These are token calculations, not measured rendered contrast; image overlays, every state and browser rendering still require P11 inspection. A 3px focus ring with 4px offset is used in the shared components; light surfaces use navy focus. Dialog focus uses the dark focus token independently of its surrounding theme.

Retain the three-column product grid, two columns at 780px and one at 390px. Use minmax(0,1fr) for flexible columns and wrapping text for cards, forms, feedback and staff records. Public gutter is clamp(20px,5vw,88px); section spacing clamp(64px,8vw,128px). Studio side navigation becomes a horizontal strip at 1080px, editor layouts stack at 800px and media selection becomes one column at 540px. Wide tables and Kanban scroll inside their containers. No full-page horizontal scroll is intended.

## P3.3 — navigation contract

- Header: 84px above 1200px, 72px at or below; logo 184×52 desktop and 158×45 at 780px; original transparent image and aspect preserved.
- Navigation: 16px, 44px minimum control target; current destination uses underline/text rather than color alone. Collections remains a native details disclosure with Escape and outside-focus dismissal.
- Compact menu: native modal, visible close, focus containment, Escape, explicit link dismissal, backdrop-only dismissal, independent overflow scrolling and focus return. Closing by resizing cannot focus the hidden mobile trigger; it falls back to main content.
- Route-keyed header state prevents a dismissed menu or search overlay reappearing on a later return to the old pathname. Search submit and browse-all dismiss the search dialog.
- No JavaScript: a native Explore disclosure supplies navigation, search and Begin a piece. Inert search/menu buttons are hidden in that mode. No public Studio link is added.
- Sticky header, global scroll padding and content offsets share header-height tokens. Main regions are programmatically focusable for skip links/focus recovery.

## P3.4 — shared components and state contract

| Component/state | Source treatment / usable static behavior | Remaining proof |
|---|---|---|
| Buttons: resting, hover, keyboard, disabled | 48px primary / 44px compact minimum, 16px label, focus outline, disabled opacity/cursor, no hover motion required | P11 mouse/keyboard/touch/contrast |
| Fields: empty, filled, invalid, disabled | 16px input text, visible boundary, theme-specific placeholders, textual error plus aria-invalid border; existing labels/validation retained | P5/P7 behavior and P11 error association |
| Checkbox/consent | Native control with clickable 44px label region and readable 15px text | P5 consent content, P11 pointer/keyboard |
| Cards: image, missing image, focus | Existing reserved image slots and recovery retained; readable 14px secondary text even compact; wrapping names; focus independent of hover | P4 every product/media; P11 reflow |
| Dialogs: open, nested, dismiss, navigation | One native primitive; unique heading ID; body lock is released only when last shared dialog closes; opener or main receives focus; viewport scroll | P11 focus order, nested close orders, outside click and long content |
| Pending/loading | Existing labels remain; Studio workspace uses status role; sign-in form exposes busy state and disables inputs/toggle/submit | P7/P11 slow and failed requests |
| Success/saved | Shared success colors; existing saved text/action remains, no new fake send/paid/confirmed state | P6 exact saved-message sequencing |
| Error/empty/unavailable | Shared feedback heading has no duplicate fixed ID; recovery links remain usable without animation; explicit retry is a button | P4/P8 content; P11 failure recovery |
| Denied/unconfigured | Existing staff permission/setup text remains; no access decision changes in presentation | P7 roles, P11 direct denial |
| Session expired/conflict | Existing retained input, renew sign-in and conflict/reload actions keep shared readable styles | P7 semantics, P11 two-session concurrency |
| Offline / save failure | Existing retry/error paths retain input; no automatic WhatsApp opening is introduced | P5–P7 and P11 offline proof |
| Unsent / pending message | No styling is allowed to imply a send; current form/receipt behavior is preserved pending explicit P6 work | P6 source; P11 persisted-first flow |

A static fallback means visible content and explicit native controls with no decorative motion dependency. It does not promise database writes or authenticated operations while offline or with JavaScript disabled. Successful saving and the WhatsApp action remain dependent on the approved database/Studio workflow.

## P3.5 — motion and Studio density

Controls transition in 200ms; public entrance/image motion uses 550ms and a small 12px/1.025 transform. Initial text opacity is 1. Native scrolling is retained; supported scroll-linked reveals only translate visible content. Reduced-motion removes animation, transitions and card transforms. Menus, form steps and Studio operations have no decorative entrance delay.

Studio uses 16px body/inputs, 14px labels/supporting text, 32–44px main headings, 30px section headings, 44px action targets and 48px fields. Existing eight board columns and Move-to selectors remain. No business fields, permissions, notifications or workflow stages were added or removed.

## P3.6 — WhatsApp boundary

The shared public header, footer, feedback, dialog and default metadata contain no generic WhatsApp invitation, widget, phone-to-WhatsApp shortcut or new destination. Footer copy is now “Custom pieces, considered with the atelier.” Default description refers to selecting a piece and sharing customization details. Explicit order-only Open/Copy flows remain; message sequencing and the remaining page/Studio copy are assigned to P6–P8. This phase does not claim those later gaps are fixed.

## Source coverage and prepared final QA scenarios

| Coverage | Source |
|---|---|
| P01–P31 shared typography/palette; P31 chrome | src/styles/tokens.css; src/components/shop/shop.module.css; header.tsx; shop-frame.tsx |
| P31/S17 overlays; P29/P30 feedback | src/components/shop/dialog.tsx; feedback.tsx |
| S01 sign-in / board styles | src/components/studio-login.tsx; src/components/studio-private.css |
| S02–S17 shared workspace | src/components/studio/workspace.module.css; workspace.tsx |
| Global focus target offset and default description | src/app/globals.css; src/app/layout.tsx |

Prepared, NOT executed: 320/390/768/1024/1200/1201/1440px layouts; 200%/400% zoom and long labels; keyboard-only Collections/search/mobile/zoom/Studio dialogs; Escape and opener return; menu resize while open; Back/Forward and same-path search; JavaScript-disabled navigation; nested Studio close order and restored prior body overflow; long modal contents; anchors/skip links beneath the sticky header; pointer/touch Move-to; dark/light error/focus/disabled states; reduced motion with card hover; font/image failure and empty content. Formal QA must include screen-reader labeling, actual visible contrast and cross-device catalogue behavior.

## Completion and continuation

P3.1–P3.6 source and specifications are complete. No dependencies, source data, images/fonts, migrations, server actions, APIs, database records, private references or deployment settings changed. React/Next source review covered stable keys, listener cleanup, controlled native dialogs, browser APIs inside effects/events, retained server boundaries and local fonts/assets. Remaining runtime, privacy, commercial eligibility and release gates are unchanged.

Next exact task: **P4.1 — reconcile all 120 product IDs/slugs against actual publishable records**, using instances.json, product-review.json, reviewed-publication.json and current database evidence. Preserve records and approvals; do not seed or assume every prior candidate is already published. Continue on a verified Git baseline; do not repeat plan approval.
