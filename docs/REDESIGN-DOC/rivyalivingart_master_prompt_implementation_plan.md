# RivyaLivingArt - Master System Prompt & Implementation Plan

## Part 1: The Master System Prompt
*Copy and paste this comprehensive prompt into your AI coding assistant (like Cursor, GitHub Copilot, or Claude) to execute the project.*

**Prompt:**
> **Role & Objective:**
> You are an elite Full-Stack Developer and UI/UX Expert specializing in high-end, Awwwards-winning web design. Your objective is to execute a comprehensive redesign and functional upgrade of the RivyaLivingArt platform (Main Website and Studio Admin). You will merge the best elements of our old and new codebases while applying a premium, dark-themed aesthetic and a specific WhatsApp-based non-transactional business model.
> 
> **Project Context & Assets:**
> *   **Current Codebase:** `https://github.com/rivyalivingart2/RivyaLivingArt2.0.git`
> *   **Current Live Sites:** `https://www.rivyalivingart.com/` (Main) | `https://www.rivyalivingart.com/studio` (Admin)
> *   **Legacy Codebase (For Reference/Extraction):** `https://github.com/rivyalivingart2/OLDWEBSITE.git`
> *   **Legacy Live Sites:** `https://oldwebsite-one.vercel.app/` | `https://oldwebsite-one.vercel.app/studio/`
> *   **Media Assets:** Google Drive link: `https://drive.google.com/drive/folders/1P2HCTmPge6HsEwtoo-xGEzPTSn68oZOW?usp=drive_link`
> 
> **1. Design & UI/UX Specifications:**
> *   **Theme:** Implement a strict, luxurious **Full Dark Theme** across both the Main Website and the Studio/Admin dashboard.
> *   **Color Palette:** The primary color scheme must be a sophisticated, combined gradient of the legacy Dark Green (`#101713`) and the new Dark Blue (`#08111d`). Use these to create depth, glassy overlays, and premium active states.
> *   **Aesthetics & Benchmarks:** Emulate the high-end aesthetics, smooth micro-interactions, and world-class UX/UI standards seen on `era-residence.com`, `spykercars.com`, `aoiofficial.com`, `mdebeauty.com`, and `storeyarchitecture.co.uk`.
> *   **Content Quality:** Generate professional, unique, and engaging copy. Strictly **NO placeholder text (lorem ipsum)** or dummy content is permitted. Generate necessary SVG icons or vectors to match the luxury dark theme, and utilize the provided Drive assets.
> 
> **2. Technical & Functional Upgrades:**
> *   **Layout Fixes:** Rectify current header sizing issues and ensure crystal-clear navigation legibility against the new dark gradient backgrounds. 
> *   **Product Interactions:** Replace generic demo forms with **product-specific customization interfaces** (allowing users to select materials, dimensions, etc., tailored to the item).
> *   **Studio/Admin Features:** Build a **Kanban Management System** within the Studio dashboard to track inquiries, manage reference materials, and assign staff roles. 
> *   **Responsiveness:** Ensure flawless cross-device compatibility, particularly for the product catalogue.
> *   **Legacy Integration:** Extract and implement essential "needed" features/sections from the old website into the new architecture seamlessly.
> 
> **3. Operational Compliance (Strict Rules):**
> *   **Non-Transactional Model:** DO NOT integrate payment gateways (Stripe, PayPal, etc.). DO NOT build traditional customer login/account systems.
> *   **Checkout Flow:** All orders and product customizations must conclude via **WhatsApp**. The flow is: User Customizes Product -> Submits Inquiry -> Data is saved to Studio Database -> User is redirected to WhatsApp with a pre-filled, highly detailed order summary message.
> 
> **4. Execution Protocol:**
> *   **Phase-Wise Execution:** Do not attempt to write the entire codebase at once. Output the code in distinct, logical phases to avoid output limits. 
> *   **Approval & Documentation:** After completing a phase, provide a summary in a Markdown file before proceeding to the next.
> *   **Deployment:** Upon final approval of all phases, ensure the codebase is production-ready to be pushed to the main Git repository.
> 
> **First Action:** Acknowledge this prompt, confirm your understanding of the constraints (especially the WhatsApp flow and color hex codes), and begin executing Phase 1 of the implementation plan.

---

## Part 2: Phase-Wise Implementation Plan
*This is the roadmap the AI (and your development team) will follow to ensure a systematic, bug-free rollout.*

### **Phase 1: Project Setup, Audit, and Theming Foundation**
*   **Action 1:** Clone and audit both the current (`RivyaLivingArt2.0`) and legacy (`OLDWEBSITE`) repositories to identify reusable components.
*   **Action 2:** Setup global CSS/Tailwind configuration for the new **Full Dark Theme**. 
    *   Define base colors: Dark Green (`#101713`) and Dark Blue (`#08111d`).
    *   Create the primary combined gradient utilities (e.g., `bg-gradient-to-br from-[#101713] to-[#08111d]`).
    *   Establish text colors (off-whites, soft silvers) to ensure high contrast and legibility.
*   **Action 3:** Connect and map the Google Drive assets to the project structure (public folder optimization).
*   **Deliverable:** A styled foundational shell with updated global styles, typography, and color variables.

### **Phase 2: Global UI Components & Awwwards-Level Polish**
*   **Action 1:** **Header & Navigation Fix:** Redesign the header to fix sizing and legibility. Implement a glass-morphism effect or solid dark gradient that shrinks on scroll.
*   **Action 2:** **Footer Integration:** Port necessary elements from the legacy site's footer, styling it for the new dark theme.
*   **Action 3:** Implement high-end entry animations (using Framer Motion or GSAP) inspired by the benchmark sites (smooth fade-ins, parallax scroll effects, slow image scaling).
*   **Deliverable:** Fully functional, responsive, and animated Header, Footer, and global layout wrappers.

### **Phase 3: Main Website Revamp (Front-End & Catalog)**
*   **Action 1:** **Homepage:** Rebuild the homepage using the new dark aesthetic. Replace all dummy text with professional, brand-aligned copy detailing "Living Art" and luxury craftsmanship.
*   **Action 2:** **Product Catalog:** Ensure the grid/list views are flawlessly responsive across mobile, tablet, and desktop. Implement smooth hover states on product cards.
*   **Action 3:** **Legacy Features:** Integrate any specific informational pages or sections from the old website that were missing in 2.0.
*   **Deliverable:** Completed Main Website front-end, fully styled with actual copy and assets.

### **Phase 4: Product Customization & WhatsApp Workflow**
*   **Action 1:** **Dynamic Forms:** Strip out old generic forms. Build product-specific customization forms (size, material, finish) on the single product pages.
*   **Action 2:** **Data Handling:** Code the logic to capture the customized form data and push it securely to the backend/database for the Studio Admin to view.
*   **Action 3:** **WhatsApp Routing:** Create the utility that takes the form data, formats it into a clean, readable text string, and generates a WhatsApp `wa.me` API link. The final call to action must be "Send Inquiry via WhatsApp."
*   **Deliverable:** A complete, non-transactional user journey from product discovery to WhatsApp redirection.

### **Phase 5: Studio/Admin Dashboard Overhaul**
*   **Action 1:** **Admin Theming:** Apply the same `#101713` and `#08111d` dark theme to the `/studio` routes. Ensure data tables and cards are highly readable in dark mode.
*   **Action 2:** **Kanban Management System:** Build a drag-and-drop Kanban board interface (e.g., Columns: New Inquiry -> In Discussion -> Production -> Completed). 
*   **Action 3:** **Staff & References:** Integrate modules within the Studio to assign staff roles to specific inquiries and attach reference materials (from the drive or user uploads) to those tickets.
*   **Deliverable:** A fully operational, dark-themed Studio Admin with Kanban functionality and inquiry tracking.

### **Phase 6: QA, Content Audit, and Deployment**
*   **Action 1:** Conduct a rigorous cross-device audit (iOS, Android, Mac, Windows) focusing on the product catalogue and navigation legibility.
*   **Action 2:** Final content pass to ensure absolutely zero *lorem ipsum* remains. 
*   **Action 3:** Compile the final Markdown summary document detailing all changes, API routes, and database schemas.
*   **Action 4:** Push the production-ready code to the `rivyalivingart2/RivyaLivingArt2.0.git` main branch.
*   **Deliverable:** Project completion, documented, and deployed.