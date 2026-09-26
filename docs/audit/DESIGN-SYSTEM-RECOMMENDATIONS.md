# RivyaLivingArt — Design System Recommendations

**Document Status:** Grounded in UI/UX Pro Max Intelligence & Codebase Audit  
**Target:** Storefront (`www.rivyalivingart.com`) & Staff Studio (`/studio`)  
**Guiding Benchmark:** Awwwards E-commerce Excellence & Apple Human Interface Guidelines  

---

## 1. Executive Direction & UI/UX Pro Max Intelligence Synthesis

Using the **UI/UX Pro Max** search engine and design intelligence database, the following core archetypes and patterns have been analyzed:

| Dimension | UI/UX Pro Max Recommendation | Rivya Application & Atelier Identity |
| :--- | :--- | :--- |
| **Product Pattern** | `Feature-Rich Showcase` + `Storytelling-Driven` | Editorial hero showcasing resin & wood grain dialogue, room-scale doorways, and material journey. |
| **Primary Style** | `Exaggerated Minimalism` + `Liquid Glass` | Deep midnight dark canvas (`#08111D`), subtle specular glass highlights (`inset 0 1px 0 rgba(243,239,231,0.12)`), flowing resin depth. |
| **Color Archetype** | `E-commerce Luxury` (`#1C1917` / `#08111D` + Gold/Bronze `#B79270`) | Dark forest `#101713` $\times$ midnight `#08111D` brand gradient, bronze accent `#B79270`, ivory text `#F3EFE7`. |
| **Typography** | `Classic Elegant` (Serif Display + Clean Geometric Sans) | Instrument Serif (display elegance) + DM Sans (readable interface) + Monospace Tabular Numerals (order IDs, dimensions). |
| **Motion Archetype** | `Restrained Tactile` (150ms–250ms UI, 400ms–600ms reveals) | Tactile tap scale (`0.98`), smooth hover lift (`translateY(-3px)`), spring settlement on Kanban card drop. |

---

## 2. Token Comparison: Existing vs. Proposed Refinements

### A. Semantic Color Palette

| Token Role | Existing Implementation | Proposed Elevated Standard | Contrast Ratio (vs. Canvas) |
| :--- | :--- | :--- | :--- |
| **Canvas Background** | `--brand-midnight: #08111d` | `#08111D` (Retain OLED dark anchor) | Reference base |
| **Forest Glow** | `--brand-forest: #101713` | `#101713` (Retain heritage green anchor) | Subtle hue shift |
| **Primary Brand Gradient** | `linear-gradient(135deg, #101713 0%, #08111d 100%)` | `linear-gradient(135deg, #101713 0%, #08111d 100%)` (Retain) | Rich dark gradient |
| **Card Surface** | `--surface: #111d22` | `rgba(17, 29, 34, 0.85)` + `backdrop-filter: blur(12px)` | Translucent depth |
| **Elevated Surface** | `--surface-elevated: #1d2d33` | `rgba(29, 45, 51, 0.92)` + specular highlight | Multi-layer elevation |
| **Studio Panel** | `--studio-panel: #112033` | `#112033` with 1px border `rgba(183,146,112,0.18)` | High-density Pro feel |
| **Primary Text** | `--ivory: #f3efe7` | `#F3EFE7` (16.4:1 contrast on `#08111D`) | **WCAG AAA Pass** |
| **Secondary Text** | `--muted: #b7bfb5` | `#B7BFB5` (7.6:1 contrast on `#08111D`) | **WCAG AAA Pass** |
| **Tertiary / Data Text** | `10px–11px` ad-hoc | Minimum `12px` floor with `font-variant-numeric: tabular-nums` | **Readability Floor Pass** |
| **Bronze Accent** | `--bronze: #b79270` | `#B79270` (Active states, badge highlights, specular edges) | **WCAG AA Pass** |
| **Focus Ring** | `--focus-on-dark: #e6ba85` | `outline: 2px solid #E6BA85; outline-offset: 4px;` | **100% WCAG 2.2 Pass** |

---

### B. Typography & Measure System

| Typographic Role | Existing Value | Proposed Standard | Purpose & Guidelines |
| :--- | :--- | :--- | :--- |
| **Display Headings (`h1`)** | `clamp(55px, 8vw, 110px)` | `clamp(56px, 8.5vw, 112px)`, `line-height: 0.98` | Dramatic editorial entrance; balanced line wrapping (`text-wrap: balance`). |
| **Section Headings (`h2`)** | `clamp(42px, 5vw, 76px)` | `clamp(40px, 4.8vw, 72px)`, `line-height: 1.08` | Clear hierarchical stepping without text truncation. |
| **Card Titles (`h3`)** | `clamp(28px, 2.7vw, 40px)` | `clamp(26px, 2.5vw, 36px)`, `line-height: 1.15` | Consistent card title density across 3-column grids. |
| **Body Prose (`p`)** | `16px–17px`, `line-height: 1.85` | `17px / 1.8`, `max-width: 65ch`, `margin-inline: auto` | Optimal editorial reading measure; no orphaned words (`text-wrap: pretty`). |
| **Technical Data / Price** | Inherit / Body font | `12px–13px`, `var(--font-data)`, `font-variant-numeric: tabular-nums` | Clean alignment of dimensions, order codes, weights, and dates. |
| **Minimum Text Floor** | 10px in some badges | **12px absolute minimum** across all viewports | Eliminates unreadable fine print on mobile touch screens. |

---

### C. Spacing Scale & Grid Alignment (8pt System)

```
Space 1:   4px  (--space-1)   Subtle gaps, icon padding, indicator dots
Space 2:   8px  (--space-2)   Micro element spacing, tight badge padding
Space 3:  12px  (--space-3)   Card inner header padding, gallery thumbnail gaps
Space 4:  16px  (--space-4)   Form control internal padding, mobile gutters
Space 6:  24px  (--space-6)   Card body padding, grid gaps
Space 8:  32px  (--space-8)   Section header bottom spacing, desktop gutters
Space 12: 48px  (--space-12)  Large component separators, mobile section padding
Space 16: 64px  (--space-16)  Tablet section padding, major layout transitions
Space 24: 96px  (--space-24)  Desktop section top/bottom breathing room
```

---

### D. Component State Matrix

Every interactive component adheres to 5 mandatory states:

1. **Default:** Crisp dark surface, subtle 1px border (`rgba(183,146,112,0.18)`), clear typography.
2. **Hover (Desktop Pointer: Fine):** Smooth lift (`transform: translateY(-2px)` to `-3px`), subtle bronze border glow (`rgba(183,146,112,0.4)`), duration: `200ms ease`.
3. **Active / Pressed (Touch & Pointer):** Tactile compression (`transform: scale(0.98)`), duration: `100ms ease-out`.
4. **Focus-Visible (Keyboard Tab Navigation):** High-contrast focus ring (`outline: 2px solid var(--focus-on-dark); outline-offset: 4px;`).
5. **Disabled:** Visual de-emphasis (`opacity: 0.65; cursor: not-allowed; pointer-events: none;`), while preserving minimum contrast.

---

## 3. Cohesive Visual Bridge: Storefront vs. Studio Admin

While the **Storefront** serves luxury collectors, architects, and discerning clients requiring spacious, immersive editorial storytelling, the **Studio Admin** serves staff managing bespoke commissions, materials, and order fulfillment requiring compact information density.

They are unified by a shared visual identity:
1. **Shared Canvas:** Both reside on the deep `#101713` $\times$ `#08111D` dark palette.
2. **Shared Accents:** Bronze `#B79270` acts as the unifying signature element for focus, status indicators, and active accents.
3. **Shared Typography:** The same font hierarchy (`Instrument Serif` display, `DM Sans` interface, monospace tabular numerals) ensures seamless brand continuity.
4. **Density Calibration:**
   - Storefront: Low-to-medium density with generous breathing room (`48px–96px` section padding).
   - Studio: High density with 8pt baseline rhythm, compact table rows (`36px–44px`), and sticky blurred command toolbars.
