# RivyaLivingArt Platform Redesign & Architecture Upgrade

## 1\. Context & Objectives

This document establishes the implementation blueprint, design system specifications, and phase-wise execution plan for the complete redesign and functional upgrade of the RivyaLivingArt ecosystem:

- **Main Client Platform**: High-end luxury resin & living art showcase (`rivyalivingart.com`).  
- **Studio / Admin Platform**: Studio inquiry management, order customization tracking, and Kanban operations (`/studio`).

### Repositories & Reference Code:

- Current Target Repo: `https://github.com/rivyalivingart2/RivyaLivingArt2.0.git`  
- Legacy / Reference Repo: `https://github.com/rivyalivingart2/OLDWEBSITE.git`  
- Target Production Deployment: `https://www.rivyalivingart.com/` and `https://www.rivyalivingart.com/studio`  
- Reference Deployment: `https://oldwebsite-one.vercel.app/` and `https://oldwebsite-one.vercel.app/studio/`  
- Media & Asset Storage: `https://drive.google.com/drive/folders/1P2HCTmPge6HsEwtoo-xGEzPTSn68oZOW?usp=drive_link`

---

## 2\. Design System & Theming Specifications

### Dark Theme Palette:

- **Deep Base Layer**: `#08111d` (Deep Midnight Blue)  
- **Secondary Surface Layer**: `#101713` (Deep Obsidian Emerald / Dark Forest)  
- **Combined Ambient Gradient**: `linear-gradient(135deg, #08111d 0%, #101713 50%, #0d1a1b 100%)`  
- **Surface / Card Backgrounds**: `rgba(16, 23, 19, 0.65)` to `rgba(8, 17, 29, 0.75)` with backdrop blur (`16px`) and hairline border `rgba(255, 255, 255, 0.08)`.  
- **Text & Foreground Hierarchy**:  
  - Primary Text: `#f3f4f6` (High contrast, neutral-white)  
  - Secondary / Body Text: `#9ca3af`  
  - Subtle Labels / Meta: `#6b7280`  
- **Accents**:  
  - Emerald highlight: `#2a9c68` / `#16a766`  
  - Cyan-tinted glow: `#1e3a5f`

### Design Standards & Benchmarks:

- UX & motion inspired by *era-residence.com*, *spykercars.com*, *aoiofficial.com*, *mdebeauty.com*, and *storeyarchitecture.co.uk*.  
- Implement smooth transitions, restrained mouse tracking/parallax where appropriate, and clean typographic hierarchy.  
- **Zero Placeholder Policy**: No lorem ipsum or temporary mock copy. All copy must reflect bespoke living art, custom craftsmanship, resin design, and architectural decor.

---

## 3\. Core Functional & Architectural Rules

1. **Strictly Non-Transactional Model**:  
     
   - No payment gateways (Stripe, Razorpay, etc.).  
   - No customer self-service login/sign-up barriers.  
   - All customer inquiry paths convert directly into an inquiry record in the studio database and generate a structured WhatsApp dispatch link (`https://wa.me/...`).

   

2. **Navigation & Layout Refinement**:  
     
   - Resolve current header sizing and legibility issues.  
   - Use fixed/sticky translucent micro-headers with blur effects to prevent occlusion of hero content.  
   - Guarantee responsive layout scaling across ultra-wide, standard desktop, tablet, and mobile breakpoints.

   

3. **Product Customization Engine**:  
     
   - Upgrade standard contact forms to interactive customization selectors (dimensions, resin tint, wood type, edge profile, finish, placement intent).  
   - Real-time summary generation fed into the WhatsApp link and Studio API.

   

4. **Studio Kanban Workspace**:  
     
   - Multi-stage pipeline: `New Inquiries` → `Design Review` → `Material Sourcing` → `In Production` → `Final Polishing` → `Dispatched / Delivered`.  
   - Card structure must hold client metadata, customization parameters, uploaded reference images, and assigned internal staff roles.

---

## 4\. Technical Architecture & Implementation Guide

### Global CSS Configuration

:root {

  /\* Color Foundation \*/

  \--bg-deep-blue: \#08111d;

  \--bg-dark-green: \#101713;

  \--bg-surface: rgba(16, 23, 19, 0.7);

  \--bg-surface-elevated: rgba(8, 17, 29, 0.85);

  /\* Signature Ambient Gradient \*/

  \--bg-ambient-gradient: radial-gradient(

    circle at 50% 0%,

    \#0f2238 0%,

    \#101713 55%,

    \#08111d 100%

  );

  /\* Borders & Dividers \*/

  \--border-subtle: rgba(255, 255, 255, 0.08);

  \--border-focused: rgba(42, 156, 104, 0.35);

  /\* Typography \*/

  \--text-primary: \#f8fafc;

  \--text-secondary: \#94a3b8;

  \--text-muted: \#64748b;

  \--text-accent: \#34d399;

}

body {

  background-color: var(--bg-deep-blue);

  background-image: var(--bg-ambient-gradient);

  color: var(--text-primary);

  min-height: 100vh;

}

### Header Legibility & Micro-Navigation

- **Height**: Reduced to `70px` (or `64px` on mobile) to eliminate excessive screen real estate consumption.  
- **Glassmorphism Spec**: `backdrop-filter: blur(14px); background: rgba(8, 17, 29, 0.75); border-bottom: 1px solid rgba(255, 255, 255, 0.06);`.  
- **Typography**: 13px–14px tracked-out uppercase (`letter-spacing: 0.08em`) with active state indicator in subtle emerald accent.

### Customization & Non-Transactional WhatsApp Pipeline

- When a user customizes a piece (dimensions, pigments, wood selection, gold foil accents), store the state locally.  
- Form submission triggers:  
  1. Internal API call to create an inquiry entry in the database.  
  2. Construction of a pre-filled WhatsApp message URL: `https://wa.me/<BUSINESS_NUMBER>?text=Hello%20RivyaLivingArt,%20I%20would%20like%20to%20inquire%20about%20[Product%20Name]%20with%20custom%20specs:%20[Specs%20Summary].%20Inquiry%20Ref:%20[ID]`

### Studio Admin Kanban Architecture

- Multi-stage pipeline:  
  - **Inquiry Received**: Automatically created from the site.  
  - **Consultation / Quoting**: Specs confirmed with customer on WhatsApp.  
  - **Artisan Production**: Resin pour, curing, CNC/wood shaping, polishing.  
  - **Quality Check & Packaging**: Curing verification, hardware installation.  
  - **Fulfilled**: Handed over / dispatched.  
- Each ticket includes client details, reference images from Drive/upload, and assigned team members.

---

## 5\. Phase-Wise Implementation Plan

### Phase 1: Architectural Audit & Workspace Setup

- **Objectives**:  
  - Clone both repositories (`RivyaLivingArt2.0` and `OLDWEBSITE`) and catalog reusable layout components, assets, and metadata.  
  - Map every page and component in the legacy site against the 2.0 version to identify missing sections.  
  - Verify all media assets in the provided Google Drive folder and configure the local media pipeline/CDN proxy.  
- **Deliverables**:  
  - Component parity matrix (Old vs. New).  
  - Cleaned directory structure and baseline dependency audit.

### Phase 2: Unified Dark Design System & Global Layouts

- **Objectives**:  
  - Implement the `#08111d` \+ `#101713` color token system across Tailwind / CSS variables.  
  - Standardize high-contrast glassmorphic card containers, buttons, badge indicators, and form inputs.  
  - Re-engineer the navigation header on both Main and Studio:  
    - Reduce vertical padding and overall height.  
    - Implement backdrop blur and scroll-aware opacity transitions.  
    - Fix mobile hamburger menu readability and hit areas.  
- **Deliverables**:  
  - Complete style guide and UI component library (Buttons, Cards, Inputs, Modals, Badges).  
  - Polished responsive header and footer components.

### Phase 3: Public Catalog & Brand Storytelling Pages

- **Objectives**:  
  - Redesign Home, Collection/Catalog, Individual Product Showcases, About, and Contact pages.  
  - Integrate benchmarks (editorial grid layouts, fluid typography, subtle scroll animations).  
  - Integrate high-resolution imagery and video from the Drive folder.  
  - Ensure zero placeholder text; draft professional descriptions for resin art styles (Oceanic, Geode, Flora Preservation, Modern Noir, Custom Architectural).  
- **Deliverables**:  
  - Fully responsive, accessible, dark-themed public pages.  
  - Micro-interactions (hover zoom on art textures, smooth carousel navigation).

### Phase 4: Product Customization Interface & WhatsApp Order Flow

- **Objectives**:  
  - Replace static demo forms with a structured step-by-step configurator:  
    - Step 1: Base Dimensions & Form Factor (Round, Rectangular, Live Edge).  
    - Step 2: Wood Specie & Cut (Teak, Walnut, Burl).  
    - Step 3: Resin Characteristics (Opacity, Swirl Intensity, Pigment Tone).  
    - Step 4: Finishing Touches (Matte, High Gloss, Metallic Accents).  
  - Configure the submit handler to log the record to the backend and launch the pre-formatted WhatsApp chat.  
- **Deliverables**:  
  - Interactive multi-step customizer component.  
  - End-to-end inquiry-to-WhatsApp link generator.

### Phase 5: Studio & Admin Kanban System

- **Objectives**:  
  - Build the `/studio` dashboard using the exact same deep blue / dark green aesthetic.  
  - Construct a drag-and-drop Kanban board for order and inquiry lifecycles.  
  - Implement card detail modals showing customer contact info, inquiry parameters, Drive attachments, and internal staff assignment.  
  - Add search, tag filtering, and priority status toggles.  
- **Deliverables**:  
  - Functional Kanban view for studio staff.  
  - API routes for inquiry status updates and notes.

### Phase 6: Cross-Device QA, Performance Audit & Git Deployment

- **Objectives**:  
  - Performance audit: image optimization (WebP/AVIF conversions), lazy loading, bundle size inspection.  
  - Cross-browser testing (Chrome, Safari, Firefox, Edge) and mobile testing (iOS Safari, Android Chrome).  
  - Contrast and accessibility check (WCAG AA compliance on dark backgrounds).  
  - Push the production-ready code to `https://github.com/rivyalivingart2/RivyaLivingArt2.0.git`.  
- **Deliverables**:  
  - Production deployment build verification.  
  - Final phase summary documentation in repository root.