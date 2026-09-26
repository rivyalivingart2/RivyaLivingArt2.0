# RivyaLivingArt 2.0 — Dark Theme Redesign & Platform Upgrade
## Implementation Plan v3.0 + Master Systematic Prompt

**Version:** 3.0 · **Date:** 2026-09-26 · **Supersedes:** Craft Prompt v2.1 (Liquid Luxury v3, light-default)
**Scope:** Storefront (rivyalivingart.com) + Studio admin (rivyalivingart.com/studio) · Full dark theme, old-site feature port, benchmark-grade UX
**Codebases:** Production repo `rivyalivingart2/RivyaLivingArt2.0` · Feature-donor/reference repo `rivyalivingart2/OLDWEBSITE`
**Assets:** Google Drive folder (all approved images/video)

---

## 0 · Changelog v2.1 → v3.0

| Change | Detail |
|---|---|
| ADDED | Dual-dark base palette — old dark green `#101713` + new dark blue `#08111D` — as the combined color scheme for both sites |
| ADDED | Signature **brand gradient** (green→blue) as the primary color/CTA element |
| CHANGED | Dark mode promoted from "option" to **product default across storefront AND Studio** (this finalizes the direction v2.1 started) |
| DEPRECATED | Flat primary `#19221C` — no longer primary; retained only as a legacy tint token for borders/hover states |
| ADDED | Old-site "needed things" must be implemented across **all pages** of the new site |
| ADDED | Header sizing + navigation legibility fixes (both sites) |
| ADDED | Studio Kanban system: inquiries pipeline + reference materials + staff roles |
| ADDED | Product-specific customization interfaces replacing demo forms |
| ADDED | Benchmark audit set: era-residence.com · spykercars.com · aoiofficial.com · mdebeauty.com · storeyarchitecture.co.uk + Awwwards e-commerce winners |
| UNCHANGED (locked) | Fonts (Instrument Serif / Inter / JetBrains Mono) · Motion tokens (180/350/800/900 ms) · Champagne accent rules · WhatsApp-only order flow (+91 7096036250) · No payments / no customer accounts · No URL / Prisma / Server-Action rewrites · No invented products · 9 storefront locales |

## 0.1 · Recorded Decisions (v3.0)

1. **Dark-default everywhere.** *Rejected: light pages with dark bands.* Both brand shades (`#101713`, `#08111D`) are dark — the identity is the dark theme; a light default would fight the palette.
2. **Primary = gradient, not a flat swatch.** *Rejected: continuing flat `#19221C` as primary.* User directive — both shades carry brand equity (old site's green, new site's blue); a gradient lets both coexist as one brand element.
3. **Gradient direction 135° (top-left → bottom-right).** *Rejected: 90°, 180°.* Diagonal gradient reads premium on wide hero bands and gives CTA buttons a directional "sweep" on hover (animate background-position, never change the angle).
4. **Champagne remains the sole bright accent.** *Rejected: adding a second accent to pair with the gradient.* Champagne already carries the luxury signal; two-accent cap per viewport stays enforceable.
5. **Kanban lives inside Studio** (not a separate tool/board). Single auth surface; staff roles already exist in Studio — a second system would split inquiry context.
6. **Merge old INTO new, never new into old.** OLDWEBSITE is the feature/content donor; RivyaLivingArt2.0 is production. Old features are ported page-by-page, not the reverse.

---

## PART A — MASTER SYSTEMATIC PROMPT (copy-paste ready)

```
You are a senior design-engineer working on Rivya Living Art — a Surat-based resin-art
studio brand (resin furniture & spatial art, flower preservation, personal gifting).
You execute in strict phases, self-validate before delivery, and never break the hard
rules below. The written spec, not generated code, is the durable source of truth.

=== SOURCES ===
- Production repo:  https://github.com/rivyalivingart2/RivyaLivingArt2.0
  (live: https://www.rivyalivingart.com/ and /studio)
- Donor/reference repo (old site): https://github.com/rivyalivingart2/OLDWEBSITE
  (live: https://oldwebsite-one.vercel.app/ and /studio)
- Approved media: Google Drive folder — use ONLY these assets (or generate new ones);
  never hotlink or invent product imagery.

=== MISSION ===
Ship a full dark-theme redesign of the storefront AND the Studio admin, benchmarked
against Awwwards-tier e-commerce, and port every needed feature/section from the old
site into the corresponding pages of the new site.

=== DESIGN SYSTEM — "LIQUID LUXURY v4: MIDNIGHT VERDANT" ===
Dark is the DEFAULT and ONLY shipped theme on both sites.

Color tokens (exact values, do not approximate):
  --bg-base:        #08111D   (new dark blue — primary page background)
  --bg-elev:        #101713   (old dark green — elevated surfaces: cards, nav, footer, Studio chrome)
  --grad-brand:     linear-gradient(135deg, #101713 0%, #08111D 100%)
                    (signature: hero/section bands, primary CTA fills, focus rings, skeleton loaders)
  --grad-reverse:   linear-gradient(315deg, #101713 0%, #08111D 100%) (Studio-dominant surfaces)
  --surface-mix:    #0D1519   (mixed tint — cards floating on gradient bands)
  --border-subtle:  rgba(237, 239, 242, 0.08)
  --text-primary:   #EDEFF2
  --text-muted:     #9AA6B2
  --accent-champagne: <existing v3 champagne token>  (UNCHANGED value)

Gradient usage rules:
  - Section/hero backgrounds: full-strength --grad-brand, 135° only.
  - Primary CTAs: gradient fill; on hover animate background-position (sweep), never change angle.
  - Cards on a gradient band: --surface-mix with --border-subtle, never a second full gradient.
  - Deprecated #19221C: legacy tint only (hover/border states). Never a primary surface again.
  - Champagne: accent-only — NEVER a button fill, MAX two champagne elements per viewport.

Typography (LOCKED): Instrument Serif (display) / Inter (body) / JetBrains Mono (labels, specs).
Motion tokens (LOCKED): 180 / 350 / 800 / 900 ms; primary easing cubic-bezier(0.22, 1, 0.36, 1).
Every animation ships with prefers-reduced-motion, touch, and mobile guards.

Fix as part of this system: header sizing and navigation legibility on BOTH sites
(contrast vs dark surfaces, active states, mobile nav, touch targets ≥ 44px).

=== HARD RULES (violations = failed delivery) ===
1. NON-TRANSACTIONAL forever: no payment gateways (Razorpay permanently rejected),
   no customer accounts, no cart/checkout.
2. Every order closes on WhatsApp +91 7096036250 — the multi-step custom-order wizard
   ends in a formatted WhatsApp brief (inquiry → studio database → WhatsApp handoff).
3. NO invented products, names, prices, or imagery. Catalogue content comes only from
   the approved inventory and Drive assets.
4. DO NOT rewrite URL structure, Prisma schema, or Server Actions. Build within the
   existing architecture.
5. NO placeholder, lorem ipsum, or dummy copy. All copy is professional and unique.
6. Do not port old-site code verbatim — port features/behaviors/content, restyled in
   the v4 dark system.

=== BENCHMARKS (audit first, then apply) ===
era-residence.com · spykercars.com · aoiofficial.com · mdebeauty.com ·
storeyarchitecture.co.uk · current Awwwards e-commerce winners.
For each: document typography, motion, layout, and interaction patterns worth adopting;
record in docs/BENCHMARK-AUDIT.md; apply to all pages. Match this fidelity — rough
layouts are a failure, not a draft.

=== WORKFLOW RULES ===
- PHASE-GATED: Phase 0/1 produce documents for approval. Do NOT start execution phases
  until the user approves.
- RESUMABLE: work in small independent PRs. When output limits near, stop at a clean
  task boundary, update docs/PROGRESS.md, and end with a marker:
  [RESUME: Phase N — next task: <exact next task>]
- SELF-VALIDATE BEFORE EVERY DELIVERY: no duplicate IDs; no CSS state leaking across
  pages; animation timelines replay correctly; dark-surface contrast passes; no
  placeholder text; WhatsApp number correct; no invented products; responsive at all
  breakpoints.
- End every phase with a Markdown summary in docs/ (PHASE-N-SUMMARY.md).

=== DELIVERABLES ===
1. docs/AUDIT.md + docs/FEATURE-PORT-MAP.md + docs/BENCHMARK-AUDIT.md (Phase 0)
2. Dark token foundation PR (Phase 1)
3. Per-phase PRs with summaries (Phases 2–5)
4. Final: updated craft prompt (v3.0) + README, push to main, verify Vercel deploy
   and smoke-test /studio.
```

---

## PART B — PHASE-WISE IMPLEMENTATION PLAN

> **Gates:** Phase 0 and Phase 1 end in **approval gates** — documents/plan only, no execution until approved. Every phase ends with a `PHASE-N-SUMMARY.md` + `[RESUME: ...]` marker so work survives output limits.

### Phase 0 — Audit & Baseline Mapping
**Objective:** Know exactly what exists, what's missing, and what must port — before touching code.
- **0.1 Repo/feature diff:** map both repos; list every feature, section, and content block on OLDWEBSITE (incl. /studio) and the new site.
- **0.2 Feature-port map:** for each old-site item the business needs, define its target page/section in the new site → `docs/FEATURE-PORT-MAP.md` (template in Part D).
- **0.3 Benchmark audit:** per-site notes for the 5 reference sites + Awwwards winners → `docs/BENCHMARK-AUDIT.md`.
- **0.4 Asset inventory:** list Drive images/video; map each to a page slot; flag gaps (assets to generate).
- **0.5 Content audit:** inventory all live copy; flag demo/placeholder/weak copy for Phase 4 rewrite.
- **Deliverables:** `docs/AUDIT.md`, `docs/FEATURE-PORT-MAP.md`, `docs/BENCHMARK-AUDIT.md`, `docs/ASSET-MAP.md`
- **Definition of done:** every old-site feature is marked port / skip (with reason); every page has a benchmark note; asset gaps listed.
- **🔒 GATE: user approves the audit + port map.**

### Phase 1 — Design Foundation (Dark Tokens + Primitives)
**Objective:** The v4 token system lives in code; both sites render dark by default.
- **1.1 Token layer:** implement Part C tokens (colors, gradients, elevation, borders, text); dark default; retire light-first styles (keep any legacy light scope only if already shipped, behind the existing toggle).
- **1.2 Gradient system:** `--grad-brand` components — hero bands, primary CTA, focus rings, skeletons; hover sweep interaction.
- **1.3 Header & nav fix:** sizing + legibility on both sites (storefront + Studio): contrast, active states, mobile nav, 44px targets.
- **1.4 Motion primitives:** reveal-on-scroll, hover states, page transitions — with reduced-motion/touch guards.
- **Deliverables:** tokens PR + preview screenshots (home + studio) + `docs/PHASE-1-SUMMARY.md`
- **Definition of done:** no hardcoded hex outside tokens; champagne rules enforced; nav passes contrast on `#08111D` and `#101713`.
- **🔒 GATE: user approves the foundation before page work starts.**

### Phase 2 — Storefront Pages (all pages, old features included)
**Objective:** Every storefront page restyled to v4, with old-site features ported in.
- **2.1 Home:** gradient hero, three-tier catalogue storytelling, ported old-home sections per port map.
- **2.2 Catalogue (3 tiers):** Furniture & spatial art · Memory & celebration · Personal gifting — grid/list views, cross-device compatible.
- **2.3 PDP:** product imagery (Drive assets), specs (JetBrains Mono detail blocks), inquiry CTA → wizard or WhatsApp.
- **2.4 Custom Order wizard:** **product-specific customization interfaces replace all demo forms** — options vary by product type; ends in formatted WhatsApp brief.
- **2.5 About / Contact / system pages** (404, legal, etc.) + any old-site pages worth reviving (per port map).
- **2.6 i18n:** all 9 locales updated for dark theme + new copy.
- **Deliverables:** one PR per page (small, reviewable) + `docs/PHASE-2-SUMMARY.md`
- **Definition of done:** port map 100% executed; zero demo forms; zero placeholders; wizard → WhatsApp message verified E2E.

### Phase 3 — Studio/Admin (Dark + Kanban + Roles)
**Objective:** Studio becomes the single ops surface for the business.
- **3.1 Dark theme applied** to Studio chrome (`--grad-reverse` dominance), header/nav legibility.
- **3.2 Kanban board:** inquiry pipeline (New → In Discussion → Quoted → Won / Lost), cards linked to product + customer + WhatsApp thread; drag-drop with role-based permissions.
- **3.3 Reference materials:** attach/link Drive reference images & docs to inquiry cards.
- **3.4 Staff roles:** role management (view/edit/admin) mapped to board permissions; stays English-only.
- **3.5 Customization management:** review/approve product-specific customization requests arriving from the wizard.
- **Deliverables:** per-feature PRs + `docs/PHASE-3-SUMMARY.md`
- **Definition of done:** an inquiry can flow New→Won entirely inside Studio with references attached; roles restrict edits correctly.

### Phase 4 — Content & Media
**Objective:** Award-site words + real assets only.
- **4.1 Copy rewrite:** professional, unique copy for every page/section flagged in 0.5 — no placeholders anywhere.
- **4.2 Asset integration:** Drive images/video optimized (WebP/AVIF, lazy-load, poster frames); generate only gap assets; alt text everywhere.
- **4.3 SEO/OG:** meta, Open Graph images per page, sitemap sanity.
- **Deliverables:** content PR(s) + `docs/PHASE-4-SUMMARY.md`
- **Definition of done:** placeholder scan returns zero; every catalogue item has real imagery; OG previews correct.

### Phase 5 — QA & Hardening
**Objective:** Ship-grade quality across devices and flows.
- **5.1 Cross-device catalogue:** mobile / tablet / desktop QA matrix for catalogue + PDP + wizard.
- **5.2 Accessibility & guards:** reduced-motion, keyboard nav, focus states, contrast audit.
- **5.3 Performance:** image weight budget, LCP on home/PDP, font loading.
- **5.4 Self-validation checklist** (Part E) run in full; bugfix PRs.
- **Deliverables:** QA report + `docs/PHASE-5-SUMMARY.md`
- **Definition of done:** Part E checklist passes 100%; WhatsApp E2E re-verified post-fixes.

### Phase 6 — Documentation & Deployment
**Objective:** Durable truth + live release.
- **6.1** Finalize craft prompt **v3.0** (this document) with as-built corrections; update README; archive v2.1.
- **6.2** Merge approved PR sequence; **push to main**; verify Vercel deploy (storefront + /studio smoke test).
- **Deliverables:** `docs/PHASE-6-SUMMARY.md` + final release note.
- **Definition of done:** rivyalivingart.com + /studio live on v4 dark; spec doc matches production.

---

## PART C — v4 Token Spec (core CSS custom properties)

```css
:root {
  /* ——— Midnight Verdant: base pair ——— */
  --bg-base:        #08111D;  /* new dark blue — page background          */
  --bg-elev:        #101713;  /* old dark green — elevated surfaces        */
  --surface-mix:    #0D1519;  /* cards on gradient bands                   */
  --border-subtle:  rgba(237, 239, 242, 0.08);

  /* ——— Signature gradient (primary brand element) ——— */
  --grad-brand:     linear-gradient(135deg, #101713 0%, #08111D 100%);
  --grad-reverse:   linear-gradient(315deg, #101713 0%, #08111D 100%);
  --grad-lift:      linear-gradient(135deg, #1E3A2F 0%, #12263C 100%); /* hover/active only */

  /* ——— Text ——— */
  --text-primary:   #EDEFF2;  /* ~16:1 on both base shades                 */
  --text-muted:     #9AA6B2;  /* ~7:1 on both base shades                  */

  /* ——— Locked from v3 (unchanged values) ——— */
  --font-display:   "Instrument Serif", serif;
  --font-body:      "Inter", sans-serif;
  --font-mono:      "JetBrains Mono", monospace;
  --dur-fast: 180ms; --dur-med: 350ms; --dur-slow: 800ms; --dur-page: 900ms;
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --accent-champagne: /* existing v3 champagne token — value unchanged  */
}
```

Usage rules: gradient at 135° only · CTA hover = background-position sweep · one gradient per viewport (never nested bands) · champagne never a button fill, max two per viewport · `#19221C` legacy tint only.

## PART D — Old-Site Feature-Port Map (template)

| # | Old-site feature/section | Old location (page/URL) | Needed? (Y/N) | Target page (new site) | Port notes (content vs behavior vs both) |
|---|---|---|---|---|---|
| 1 | … | oldwebsite-one.vercel.app/… | Y | /… | … |

## PART E — Self-Validation Checklist (run before every delivery)

- [ ] No duplicate element IDs anywhere in changed pages
- [ ] No CSS state leaking across pages (hover/focus/scroll states reset correctly)
- [ ] Animation timelines replay correctly on re-navigation (no one-shot dead states)
- [ ] Contrast passes on `#08111D` AND `#101713` surfaces (text + champagne accents)
- [ ] `prefers-reduced-motion` honored on every new animation
- [ ] Touch targets ≥ 44px; mobile nav usable at 360px
- [ ] Zero placeholder/lorem/dummy copy in changed scope
- [ ] No invented products, prices, or imagery
- [ ] WhatsApp number +91 7096036250 correct in every CTA/wizard output
- [ ] No URL / Prisma / Server-Action rewrites introduced
- [ ] Responsive verified: 360 / 768 / 1280 / 1920
