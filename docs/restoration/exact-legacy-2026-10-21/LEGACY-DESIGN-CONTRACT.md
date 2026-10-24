# Adapted legacy design contract — foundation and homepage restoration

Source: OLDWEBSITE `2dd6d5de34acf3f98e611eda2e1b858ebd0da8e6`, `docs/redesign-contract.md`.
Original SHA-256: `8200981b2faadaa47b26196e37b71e424158cd6f76625de41184db7f04b08a4b`.
Adapted 21 October 2026. The current [owner decision](OWNER-DECISION.md) governs conflicts.

This preserves useful implementation knowledge from the old contract. It is not a copy of its historical scope restrictions. The actual committed component and deployed reference take precedence over stale prose; for example, the current reference is dark throughout despite the earlier contract's alternating light/dark rule.

## Foundation vocabulary

- Instrument Serif display, Inter body, JetBrains Mono metadata. Reuse current loaded faces; do not change global fonts or the protected Studio login.
- Shell max-width 1440px, horizontal padding clamp(20px, 4vw, 72px), with the 56px desktop cure-line reservation at 1024px and up.
- Hero type clamp(3rem, 7vw + .5rem, 7.5rem), line-height .95, tracking -.02em, measure 14ch.
- Primary display heading clamp(2.5rem, 4.5vw + .5rem, 5.5rem), line-height 1.02.
- Metadata: 11px mono, line-height 1.6, tracking .14em. Section spacing: standard clamp(80px, 9vw, 120px); major clamp(120px, 14vw, 200px).
- Existing destination obsidian/deep-ocean/sapphire/champagne tokens already share the old anchors. Their source bytes remain protected. New component styles reference those tokens.
- Outlined pill action sizes 48px and 56px; color and underline feedback. Square major surfaces. Use real published images with their current focal points.
- Base transition 350ms and luxury easing cubic-bezier(.16, 1, .3, 1); drawer 320ms. Reduced motion bypasses transitions.

## Concrete adapters in this checkpoint

| Old source | Destination | Implemented scope |
|---|---|---|
| storefront/site-header.tsx | shop/header.tsx + public-frame.module.css | Flat 80px sticky slot, compact 64px row, scroll-direction behavior, 120/160ms collection hover intent, keyboard disclosure, full-height drawer |
| storefront/announcement-bar.tsx | shop/header.tsx | Single current-copy announcement and optional seven-day dismissal; old multi-message rotation remains pending |
| storefront/mobile-bottom-bar.tsx | shop/header.tsx | Five actions, safe-area inset, active indicator; suppressed on piece/customization and commission routes |
| (v2) homepage hero + tokens.css | shop/legacy-home.module.css + homepage-document.tsx | Hero type, bottom alignment, 32px rhythm, source gradient and outline action; existing media, copy and product attribution retained |
| storefront/footer.tsx | shop/shop-frame.tsx + public-frame.module.css | Commission band, source spacing/type, link columns and legal row; current business details |
| old search and drawer layer behavior | existing shop/dialog.tsx | Native modal inertness, focus wrap, Escape, opener recovery retained; additive per-instance styling hook |

## Preserved exceptions and pending parity

Current logo artwork/backplate, contacts, color tokens, enabled locale policy, published navigation labels/routes, content, media and product attribution remain authoritative. The extra current header destinations and different copy lengths are visible differences. The footer currently has the current three link groups; the old journal group, newsletter workflow and decorative texture remain pending. The collection menu uses the current three published collections with current product media; old print/supply routes and the four-column content arrangement need the corresponding restored capability.

The second Phase 2 slice now implements the bound homepage section order, measured cure ruler, meniscus reveals, featured rail, collection doors, journal list and timeline. Read [the explicit source/content mapping](LEGACY-HOME-MAPPING.md) for scope, preserved differences and fallback behavior. The full material sequence, remaining card/form/page templates, Studio shell/table/editor layouts and nine-locale parity remain work. The local source-fixture homepage is not a representation of the production homepage's latest published content or video settings.

## Rules retained or corrected during migration

Keep keyboard reachability, visible focus, native reduced-motion preferences, accurate empty/error/loading states, bounded parallax, explicit success, safe image loading and server-first public data projection. Do not transplant old phone numbers, staff/auth secrets, default five-star import ratings, automatic production catalogue fill or migration-on-build behavior. Old import/scraper/Sheets/legacy-transfer exclusions do not constrain the owner's new scope.

Every future port needs a working route, real handler/data contract, state evidence and source provenance. A menu label, screenshot or placeholder alone never marks a feature complete.
