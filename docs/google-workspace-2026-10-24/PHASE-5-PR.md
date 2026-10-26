# Phase 5: Authenticated Studio Redesign (tasks GW-500, GW-501, GW-502) — PR Description

26 October 2026. Prepared on branch `codex/google-cloud-acceptance` from release checkpoint `9b68ac2` (Phase 0-4 PR specification commit).

## Summary of Changes

This Pull Request delivers Phase 5 of the Google Workspace transition programme, establishing complete workflow parity, classification, and design isolation for the authenticated Studio workspace:

1. **GW-500: Studio Modules Workflow Classification & Workflow Ledger (`src/lib/studio-modules.ts`, `docs/google-workspace-2026-10-24/studio-workflow-ledger.csv`)**:
   - Classifies all 37 Studio modules into 5 structured workflows:
     - `operations` (10 modules: overview, inquiries, follow-ups, subscribers, orders, order-detail, timeline, references, work-queue, queue-config).
     - `catalogue` (8 modules: products, categories, media, inventory, collections, materials, pricing, variants).
     - `editorial` (8 modules: journal, portfolio, testimonials, about, craft, press, faqs, pages).
     - `presentation` (8 modules: typography, themes, navigation, footer, hero, banners, search, preview).
     - `governance` (6 modules: staff, settings, site-settings, import, exports, audit-log).
   - Establishes operational status for each module: `active` (32 modules), `guarded` (4 modules), and `status-only` (1 module: `import`, excluded from everyday navigation per owner instructions).
   - Adds `studioModulesByWorkflow(workflow)` and `studioActiveModules()` helper functions.
   - Creates the comprehensive 37-module workflow ledger CSV (`docs/google-workspace-2026-10-24/studio-workflow-ledger.csv`).
   - Enhances the command palette (`Ctrl+K`/`Cmd+K`) in `src/components/studio/workspace.tsx` to surface workflow metadata (`item.group · item.workflow`).

2. **GW-501: Route Admission, Role Scoping & Child Resolution (`src/lib/studio-modules.ts`, `src/lib/studio-work-queue.ts`)**:
   - Enforces role scoping for admin-only modules (`staff`, `settings`, `site-settings`, `subscribers`, `import`, `exports`), ensuring non-admin editor sessions never receive admin navigation destinations.
   - Enforces route admission via `studioRoute(segments)` matching registered modules and rejecting unknown routes.
   - Enforces child href resolution via `studioChildHref(segments)` producing canonical paths (e.g. `?create=1`, `?record=...`) while rejecting path traversal and unauthorized subpaths.

3. **GW-502: Style Isolation, Responsive Breakpoints & Accessibility (`src/components/studio/workspace.module.css`)**:
   - Strict CSS module encapsulation under `.workspace` selectors guarantees zero CSS leakage into public storefront or Studio login screens.
   - Responsive breakpoints (1080px desktop collapse, 800px tablet drawer, 540px mobile stack) supporting viewports from 1920px down to 320px.
   - Accessibility compliance: `@media (prefers-reduced-motion: reduce)`, explicit `color-scheme: dark`, tabular numeric alignment (`tabular-nums`), and keyboard focus management.

4. **Automated Unit Tests (5 new automated tests, 37/37 total Google Workspace tests passing)**:
   - `tests/google-workspace-studio-workflows.test.mjs`:
     - Test 1: All 37 Studio modules classified by workflow and status.
     - Test 2: Navigation modules correctly exclude status-only import tool while preserving bookmark resolution.
     - Test 3: Route admission, role scoping, and child href resolution.
     - Test 4: Workflow ledger CSV matches registered module definitions.
     - Test 5: Responsive breakpoints and style isolation in `workspace.module.css`.

## Validation & Test Results

- **Unit tests:** 37/37 Google Workspace tests passed across the full test suite.
- **Route typegen & TypeScript:** 0 errors (`npm run typecheck`).
- **ESLint:** 0 errors, 62 existing repository baseline warnings (`npm run lint`).
- **Preflight:** 12/12 checks passed (`npm run test:preflight`).

## Preservation & Safety Boundary

- **Public Website & Design:** Approved homepage, Rivya / Creations, The Signature ("From liquid to light"), and footer layouts and styling remain completely untouched and byte-identical.
- **Studio Login & Security:** Authenticated Studio routes, session handling, rate limits, and security middleware remain completely unchanged. Login presentation and markup are preserved.
- **Provider Authority:** Current PostgreSQL/Prisma database connections and Vercel Blob integrations remain 100% authoritative when Google Workspace adapter is unconfigured.
- **Data Safeguards:** Zero products added, zero test fixture products injected, zero archived catalogue/Sheets imports performed, zero database reseeding, zero request table repair replay.
- **Cloud & Production Invariance:** Zero Google cloud writes, zero Drive resources created, zero Sheets modified, zero production database writes, zero CMS publications.
