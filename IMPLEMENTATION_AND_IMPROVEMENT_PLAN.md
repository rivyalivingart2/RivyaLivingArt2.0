# Full Implementation & Improvement Plan: Legacy to RivyaLivingArt2.0 (Midnight Atelier)

## Executive Summary
This document provides an exhaustive, in-depth blueprint for migrating features, UI/UX improvements, and the Studio CMS from the `OLDWEBSITE` to the current `RivyaLivingArt2.0` repository. It ensures the "imprint" and rich operational features of the old architecture are integrated securely into the new `ShopSite` architecture under the Midnight Atelier redesign.

## 1. Route & Content Gap Analysis (The "Imprint" & Features)
The following routes exist in the `OLDWEBSITE` but are currently operating as simplified or shell views in the new architecture:
- **Legal & Imprint (The "Imprint Thing")**: 
  - `terms` (Terms & Conditions)
  - `privacy` (Privacy Policy)
  - **Action**: Implement full database-driven HTML resolution for these pages, similar to the legacy `renderTiptapToHtml` pipeline. Add an explicit `imprint` (Impressum) section fulfilling EU legal requirements, mapping to a new CMS singleton.
- **Storefront Sections**:
  - `about` & `process` -> Transition into `our-story` and `process` utilizing the rich `page-section-analysis` findings from the old site.
  - `custom-order` & `whatsapp-order` -> Integrate the WhatsApp handoff mechanism directly into the new `commission/customize` flows.
  - `portfolio` -> Re-enable the dynamic portfolio grid.
- **Studio (CMS) Features**:
  - The legacy studio possessed 50+ dashboard endpoints (`catalog-fill`, `content-gaps`, `scraper`, `site-copy`).
  - **Action**: Incrementally restore the `/preview/studio` administrative capabilities, particularly the "Total Resolver" pattern allowing staff to edit site copy and legal imprints via the database without code deployments.

## 2. UI/UX Improvements to Migrate (from Legacy Audits)
1. **Touch Target Accessibility**: Enforce `min-height: 48px; min-width: 48px` for all mobile buttons (e.g., in `ShopShell`, `OrderForm`, and gallery controls).
2. **Product Form UX (Studio)**: Break down the monolithic product form into 5 logical tabs (General, Images, Customization, Details, SEO) to prevent scroll fatigue.
3. **Data Table Pagination**: Upgrade Studio pagination controls with high-contrast badges (e.g., `bg-muted/50`, `border`).
4. **Motion & Fluidity**: Ensure GSAP / Lenis integrations strictly respect `prefers-reduced-motion` while matching the legacy site's smooth scrolling.
5. **Responsive Padding**: Consolidate mobile padding across `ShopSite` grids to match the refined `OLDWEBSITE` layout.

## 3. Implementation Plan (In-Depth)
**Phase 1: Legal & Imprint Implementation**
- Define `imprint` and `legal` content models in the database schema.
- Update `src/components/shop/editorial.tsx` to pull `imprint` data and render it.
- Replace the `ApprovedExperience` stubs in `/terms` and `/privacy` with live content blocks.

**Phase 2: Storefront UI/UX Synchronization**
- Apply `.sf-touch-target-improved` logic to the CSS modules (e.g., `s.button`, `s.actions`) in `shop.module.css`.
- Reconstruct the `gallery.tsx` thumbnail rail for mobile viewports.

**Phase 3: Studio Restoration**
- Port over `src/components/studio/products/product-form.tsx` with its tabbed architecture.
- Re-implement the `Pagination` component in the new Studio shell.
- Restore the `site-copy` and `site-images` singleton editors.

## 4. Definition of Done
- Imprint, Terms, and Privacy pages render dynamic content from the database.
- Mobile touch targets pass the 48px accessibility threshold.
- Studio product forms utilize the 5-tab layout.
- The `ShopSite` architecture is preserved, but visually upgraded to match the legacy site's rich UX.
