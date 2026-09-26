# RivyaLivingArt — C.R.A.F.T. Master Redesign Prompt

Copy the prompt below into your development agent. Attach `RivyaLivingArt-Dark-Theme-Audit-and-Implementation-Plan.md` when available. It contains the initial code-grounded audit, page mappings, design specification and acceptance criteria.

---

## C — CONTEXT

Redesign and complete the **RivyaLivingArt storefront and staff Studio** as one premium, fully dark experience for handcrafted resin furniture, spatial art, memory preservation and personalized objects.

### Source roles — do not reverse these

- **Production codebase and final main-branch target:** `https://github.com/rivyalivingart2/RivyaLivingArt2.0.git`
- **Production storefront:** `https://www.rivyalivingart.com/`
- **Production staff Studio:** `https://www.rivyalivingart.com/studio`
- **Older design/code reference and selective feature donor:** `https://github.com/rivyalivingart2/OLDWEBSITE.git`
- **Reference storefront:** `https://oldwebsite-one.vercel.app/`
- **Reference Studio:** `https://oldwebsite-one.vercel.app/studio/`
- **Supplied asset folder:** `https://drive.google.com/drive/folders/1P2HCTmPge6HsEwtoo-xGEzPTSn68oZOW?usp=drive_link`

The goal is to combine the useful older design/content/Studio capabilities with the current application. Do not overwrite the current repository with OLDWEBSITE, import its database wholesale, or regress working order/security behaviour.

### CURRENT RUN MODE: PLAN ONLY

First perform read-only discovery, audit, source reconciliation and reference research. Produce a comprehensive integrated Markdown implementation plan, then wait for my approval before coding, generating new assets, changing databases/content, creating implementation branches, pushing to GitHub or deploying.

Creating the requested planning documents is allowed. No implementation or publication is authorized in the first response. Do not treat an older approval in project history as approval for this new plan.

After I approve this plan, execute the approved phases autonomously and keep the checkpoint current. Do not repeatedly ask for permission for ordinary implementation steps already covered by approval. Resolve routine choices yourself. Ask only for a specific missing business decision or action outside authorized scope, after completing all unaffected work.

### Initial baseline — verify it again

The 26 September 2026 audit read production `main` at `3c88c24cc2d19444aa8ec9e891b3c67c2ab39a04` and reference `main` at `2dd6d5de34acf3f98e611eda2e1b858ebd0da8e6`. These are historical starting points, not a command to reset newer work.

The current application already contains #101713/#08111D tokens, a dark public shell, product-specific forms, persistent inquiry code, private reference handling, admin/editor sessions, staff assignment and Kanban. Review them before proposing replacements. Repository docs contain historical and newer instructions; reconcile by date, scope, code and my latest request.

## R — ROLE

Act as a principal UI/UX designer, digital art director, senior Next.js/full-stack engineer, design-system architect, content strategist, CMS/operations designer and accessibility/performance lead.

Deliver an original, calm, material-focused luxury brand experience that is usable on mobile and efficient for staff. Make every implementation decision traceable to a user need, business constraint or verified defect. Award-level craft is the quality ambition; never fabricate awards or credentials.

## A — ACTION

### 1. Non-negotiable business rules

1. No payment gateway, cart checkout, customer accounts, customer login or membership. Staff authentication remains restricted to Studio.
2. WhatsApp is used only to carry **saved selected-product customization or bespoke order-request details** to the business. No generic chat/FAB/contact shortcut, bot, campaigns, notifications, automatic follow-ups, account connection or CRM synchronization.
3. Canonical journey: browse/select or choose bespoke → relevant customization → customer details and optional private references → review → Place Order → server validation → durable database save → same record available in Studio → prepare/persist message from the saved snapshot → offer Open WhatsApp and Copy → customer manually presses Send.
4. “Place Order” submits a request. It does not confirm price, payment, feasibility, manufacture or delivery. Explain this clearly next to the final action.
5. No WhatsApp handoff before a confirmed save. No false “sent”, “delivered”, “paid” or “confirmed” states based on an open/copy event.
6. Keep private references private. Do not copy the older public-upload URL approach. Retain current receipt ownership, private storage/viewers and reference-count message policy unless a separately reviewed change is approved.
7. Use current server-owned business settings for destination/contact details. Older documents contain a different WhatsApp number; never copy it by habit or hardcode it through components.
8. Preserve production records, product identities, published content, originals, drafts, revisions, consent evidence and staff audit history. No invented products, prices, reviews, client projects, delivery promises or capabilities.
9. No new paid services/purchases without authorization. Vercel Pro is recorded in current project history; verify the actual project rather than repeating the superseded free-only plan.
10. The latest instructions here override conflicting older design/WhatsApp assumptions. Current security and valid operational decisions must be preserved.

### 2. Discovery and evidence

Read current main, applicable AGENTS guidance, project-state/checkpoint files, package scripts, active route/component imports, database/schema contracts, media pipeline, auth/permissions, order APIs/actions, Studio modules and deployment records.

Find the current equivalents of:

- `RivyaLivingArt-Experience-Implementation-Plan.md`
- `RivyaLivingArt-Design-and-WhatsApp-Order-Plan.md`
- Current commercial master and pending-work register
- Midnight Atelier design report/checkpoint
- Existing CRAFT master and WhatsApp order reference

If a document is missing, identify the closest successor and state the limitation. Do not invent access or say a missing source was read. Reconcile contradictions; do not concatenate old plans.

Record repository SHAs, deployed environment and verified deployment SHA if available, read permissions, route inventory, browser/viewports, files examined and unverified areas. Separate **observed code**, **live behaviour**, **historical recorded tests**, **proposals** and **unverified assumptions**.

Enumerate every current public/Studio page and all older page families from source, including catch-all module routing, dynamic routes, aliases, preview harnesses, error/empty/loading/session states. Never interpret a catch-all route or fixture screen as a working backend module.

Classify each requirement: `PRESERVE`, `CHANGE`, `RESTORE`, `MISSING`, `CONDITIONAL`, `SUPERSEDED`, `UNVERIFIED` or `BLOCKED`. For each give evidence, target files/modules, work required, priority, phase and acceptance check.

Inspect representative public and accessible Studio views across desktop/tablet/mobile. Do not submit live customer-looking inquiries during audit. If staff access is unavailable, continue source review and mark authenticated behaviour unverified. Do not ask me to paste credentials into chat.

### 3. Exact dark-theme direction

Both storefront and Studio must be fully dark, including all nested pages, login, menus, search, forms, dialogs, galleries, rich-text editors, tooltips, tables, Kanban, toasts, empty/error states and browser theme colour.

Use these exact primary anchors:

- Old dark green: **#101713**
- New dark blue: **#08111D**
- Supporting forest: **#19221C**

Primary brand gradient:

```css
--brand-gradient: linear-gradient(135deg, #101713 0%, #08111d 100%);
--brand-gradient-hover: linear-gradient(135deg, #19221c 0%, #112033 100%);
```

Supporting tokens:

| Role | Value |
|---|---|
| Primary text | #F3EFE7 |
| Secondary text | #B7BFB5 |
| Surface | #111D22 |
| Elevated surface | #1D2D33 |
| Studio panels | #112033 |
| Structural border | #465466 |
| Control border | #8B96A3 |
| Input surface | #122336 |
| Bronze accent | #B79270 |
| Bronze hover | #CEAC89 |
| Focus ring | #E6BA85 |

Current source uses a bronze `--brand-gradient`; rename/separate that as an accent gradient so it no longer substitutes for my requested green–blue primary identity.

The two dark anchors have very little contrast against each other. Use ivory labels and a visible border/focus state on gradient controls. Keep dense operational surfaces solid. Check all rendered states, not just a colour table. No gradient body text, random bright accents or light card islands. Natural light areas within photographs are fine; never recolour products to fit the theme.

Keep the supplied logo and existing local fonts where appropriate. Use Instrument Serif for restrained public display headings, DM Sans for readable UI/body, and monospace only for identifiers/data. Studio should favour compact working layouts over cinematic decoration.

Fix header sizing/legibility based on actual breakpoints. Starting target: 76–80px desktop and 64–72px mobile/tablet, at least 44px touch targets, readable labels, visible active/focus states and no collision at zoom. Preserve the current collection structure and meaningful destinations.

### 4. Reference benchmarking

Audit these references and suitable Awwwards commerce/showroom examples:

- https://www.era-residence.com/
- https://spykercars.com/
- https://aoiofficial.com/
- https://mdebeauty.com/
- https://www.storeyarchitecture.co.uk/
- https://www.awwwards.com/websites/e-commerce/

Create a matrix covering navigation, hero, typography, grid, media, motion, product/project detail, CTA/forms, mobile treatment and accessibility/performance cost. State how much of each site was actually inspected. Do not claim exact motion behaviour from text extraction.

Translate useful principles into Rivya: room-scale imagery; material/craft details; editorial rhythm; full-object and close-up pairing; genuine case studies; clear product-specific briefs. No copied assets/code/copy, carts/accounts, blocking preloaders, scroll-jacking or fake client proof.

Use short CSS motion where sufficient: 180–300ms UI, 400–550ms section reveals, restrained hover scale ≤1.025, no essential content waiting for animation. Respect reduced motion and touch. Studio gets clear state feedback, not parallax. New animation/3D libraries require a demonstrated benefit and measured budget.

### 5. Restore useful older features systematically

Build a legacy-to-current feature and route mapping with `KEEP`, `ADAPT`, `RESTORE`, `REDIRECT`, `CONDITIONAL`, `DEFER` or `EXCLUDE` for every older page/module.

Include useful older capabilities such as:

- Material-led hero, chapter navigation, craft/process storytelling and large-format showcase.
- Useful category/filter/search behaviour, gallery details and relevant customization controls.
- Studio editing for navigation, site copy, site media, page sections, FAQs, process, materials, journal and genuine portfolio.
- Product content/media readiness, useful import/export previews and operational activity.
- Inquiry board/list/detail, reference context, assignments, due dates and staff permissions.

Adapt to the current Next.js/SQL/session/publication architecture. Do not transplant Prisma, Auth.js, localized route wrappers, old dependency packages or destructive build/bootstrap scripts.

Do not automatically restore generic WhatsApp links, newsletters, subscribers, scraping/research systems, Sheets synchronization, public staff signup or customer accounts. Wishlist, full locale restoration, workshops, supplies and 3D-service expansion require explicit disposition and genuine current business content. Do not silently omit them or publish unsupported offerings.

Protect current URLs. Map old `/shop`, `/product/[slug]`, `/p/[slug]`, `/blog`, `/custom-order` and other valuable paths using verified counterparts. Avoid redirecting every missing item to the homepage. Preserve historical private receipt semantics carefully.

### 6. Cover every public page and state

For every discovered route document purpose, evidence/current state, target section order, shared components, old feature contribution, copy/media, mobile behaviour, CMS fields, SEO, risks and acceptance criteria.

Cover home; the three collection journeys; search; product details; selected-product customization; commission entry; bespoke customization; saved receipt; atelier/about; process; materials/care; architects; preservation/personalization entries; portfolio/index/detail; journal/index/detail; FAQ; contact; delivery; cancellation/returns; privacy; terms; accessibility; aliases; unavailable/error/not-found/loading states; preview isolation.

Do not redesign only the homepage and say “apply the same to other pages.” Explicitly account for every route, including conditional legacy routes.

Product presentation must clarify actual material, dimensions/scale, finish, use, customization and quotation basis. Use genuine media or truthful concept disclosure. Do not confuse a visualized design with a stocked, manufactured or completed customer piece.

### 7. Product-specific customization and data integrity

Audit existing product schemas before introducing a new form system. Extend stable IDs, typed values, units, required/conditional rules, allowed options, validation bounds, help and schema versions through the current Studio form editor and public renderer.

Use appropriate fields for furniture/spatial, memory/preservation, personal gifts and bespoke work. No generic demo form reused for unrelated products. Only expose choices the business actually offers; do not invent materials/finishes or automatic prices. Uploads remain supported private images unless a separate file-type design is approved.

Keep client and server validation consistent. Hidden/inapplicable fields must not become required, be accepted as arbitrary inputs, or alter historical evidence. Product/form edits do not change submitted snapshots.

Preserve idempotency, ownership, schema-change recovery, lost-response recovery, upload validation, atomic core save, message finalization retries, and saved receipt access. Distinguish “not saved”, “save unconfirmed”, “saved; message pending” and “ready to open/copy”. Test long messages including Gujarati/Hindi encoding without truncating the stored brief.

### 8. Studio and Kanban

Redesign the actual production workspace, not the old fixture preview. Current destinations include overview, inquiries, follow-ups, products/forms, content, media, activity, staff, settings and private references.

Preserve current business stages:

`NEW → CONTACTED → QUALIFIED → QUOTED → CONFIRMED → IN_PRODUCTION → COMPLETED`, plus `CLOSED`.

Keep manual status decisions separate from WhatsApp message preparation/open/copy. Show useful card context, filters, assignment, due dates, reference counts and history. Provide keyboard/touch Move-to controls alongside drag-and-drop. Preserve version conflict detection, reason capture and accurate optimistic-save feedback.

Keep product publication/readiness workflows separate from inquiry stages. Staff roles remain server-enforced; editors keep assigned-inquiry scope. Never widen permissions to match a copied old screen. Check reads, writes, direct routes, exports and private viewers.

All normal content and media must be editable through appropriate typed Studio controls: draft → preview → publish → public invalidation. A form that saves only local state is not a completed CMS. Include revisions, unsaved-change protection, content readiness and useful failure states.

### 9. Content and assets

Use supplied Drive assets first. Inventory all relevant folders and indexes, distinguish duplicate formats and earlier versions, then map assets by product/page/section. Do not assume filename or folder name proves rights or suitability.

Maintain an asset manifest with IDs, original/source hash, dimensions/duration, real/generated classification, rights/publication status, slot, focal point, responsive crops, alt, derivatives and poster. Preserve originals. Do not serve Drive sharing pages as production media URLs.

Create optimized responsive derivatives and reserve aspect ratios. Keep images filling intended frames with reviewed focal points; never stretch. Avoid repeating one product image through every homepage/article block.

After approval, generate new icons/vectors/editorial images or video only for confirmed gaps within available capabilities. Keep generated concepts truthful; no fake maker/client/project evidence or replacement logo. If generation is unavailable, record an exact pending production prompt and use an approved still when appropriate. Do not regenerate completed assets when resuming.

Professional, unique copy only. No lorem ipsum, dummy records, fictional testimonials or unverifiable claims. Keep legitimate design-visualization labels. Customer-facing copy should explain saved requests without database implementation details.

### 10. Indian operating context

Read and preserve current owner-approved operating policies. Current records identify Surat/Gujarat, India; INR quotations; serviceability-based Indian delivery; arranged Surat installation; Asia/Kolkata Studio time; defined cancellation/retention/deletion rules; encrypted private Drive backups and owner recovery-key custody.

Do not invent different policies or ask again for facts already supplied. Distinguish intended policy, source implementation and verified operation. RPO/RTO targets, scheduled backups and retention promises require evidence; preserve the pending-work register until its items are actually closed.

### 11. Phase roadmap

Use stable task IDs and expand each phase into work packages, dependencies, affected modules, deliverables, acceptance checks and rollback:

1. **DT-01 — Audit, integrated plan and approval.** First response ends here.
2. **DT-02 — Fresh baseline, legacy parity and isolated QA contract.** Reconcile existing branches and data architecture.
3. **DT-03 — Dark tokens, primary gradient, global public/Studio shells.** Complete reusable component states.
4. **DT-04 — Media/content foundations and CMS bindings.** Build Drive manifest and durable authoring/publication paths.
5. **DT-05 — Homepage, collections, discovery and product pages.** Restore selected old patterns and URL compatibility.
6. **DT-06 — Product-specific customization, private references and saved-order flow.** Preserve current guarantees and close actual gaps.
7. **DT-07 — Studio, Kanban, staff roles and selected operational parity.** Verify durable work and permissions.
8. **DT-08 — All editorial, service, policy and system routes; content completion.** No page left without disposition.
9. **DT-09 — Motion, responsive polish and interaction states.** Equal attention to mobile and desktop.
10. **DT-10 — Final regression, accessibility, performance, SEO and operational verification.** Close release blockers honestly.
11. **DT-11 — Documentation, protected Preview and approved final release.** Normal merge/push to current repository main; intended Vercel release verified against exact commit.

Do not restart completed work from old plans. Preserve completed implementations and test relevant regressions. If a phase is already partly done, record that and execute only the remaining tasks.

### 12. Verification and release

Use actual package scripts after reviewing their environment effects. Current repository declares lint, typecheck, test, test:preflight, build, test:runtime, test:e2e and check. Never invent a passed test result.

Verify 320–1920px representative widths; actual iOS/Android/desktop coverage where available; 200% zoom; keyboard/focus; screen-reader sample; contrast; reduced motion; empty/error/long-content states; gallery/media failures; draft/publication/cache behaviour; role boundaries; upload ownership; saved-request idempotency; conflict recovery and WhatsApp Open/Copy fallback.

Mutation tests use isolated QA database and private storage. Normal Preview may share production resources; verify environment identity, not just the deployment label. No synthetic production orders or automated WhatsApp messages.

Target LCP ≤2.5s, INP ≤200ms and CLS ≤0.1 at the field 75th percentile when data exists. Report lab results separately. Budget media and new JS before adding cinematic effects; keep heavy editors off public bundles. Inspect metadata, canonical URLs, redirects, published-only sitemap, private-route noindex and truthful structured data. Enable public indexing only as an intentional release decision.

After approved work passes its gates, push the final code/docs to `rivyalivingart2/RivyaLivingArt2.0` main through a normal safe workflow. Never force-push unrelated work or bypass branch protection. Verify write access and the Vercel project association; current audit connection was read-only. Record final main/tested/deployed SHAs, deployment URLs, migrations, asset manifest, rollback target and remaining limitations. READY is not a quality certificate.

## F — FORMAT AND CONTINUITY

### First deliverable

Create one integrated Markdown plan containing:

1. Executive recommendation and verified evidence/limits.
2. Source reconciliation and requirement status register.
3. Current/older architecture comparison and selective restoration matrix.
4. Reference inspiration matrix.
5. Exact dark palette, gradients, typography, layout, components and motion.
6. Every public route and Studio module, with detailed implementation/acceptance mapping.
7. Customization, data, private-reference and WhatsApp workflow.
8. CMS editability, Kanban and permission plan.
9. Content and Drive-first asset plan.
10. Phase/task roadmap, testing, commercial-readiness gaps, rollback and release scope.
11. Checkpoint/resume system and reviewable approval scope.

Save it as `docs/redesign/DARK-THEME-MASTER-PLAN.md` once repository documentation writes are within the approved execution scope; during plan-only delivery return it as a standalone Markdown document. Preserve historical plans and link the new accepted plan as the active authority.

### Execution records after approval

Maintain:

- `docs/redesign/DARK-THEME-EXECUTION-STATE.md`
- `docs/redesign/DARK-THEME-PHASE-SUMMARIES.md`
- `docs/redesign/route-audit.csv`
- `docs/redesign/legacy-parity.csv`
- `docs/redesign/cms-field-map.csv`
- `docs/redesign/asset-manifest.csv`
- `docs/redesign/RELEASE-ACCEPTANCE.md`
- `docs/redesign/STUDIO-EDITOR-GUIDE.md`

Checkpoint fields: plan revision and approval; current/reference SHAs; branch; last safe commit; current phase/task; completed/in-progress/pending subtasks; exact files; data/migrations; asset source/generated/pending status; test results with candidate SHA; blockers; next exact action; work not to repeat.

At each phase end and before limits, save progress and report what changed, why, what was verified and what remains. Track `SOURCE_IMPLEMENTED`, `UI_REVIEWED`, `BACKEND_CONNECTED`, `VERIFIED` and `RELEASED` separately. Do not mark incomplete work finished to fit an output limit.

On resume, read the plan and checkpoint, inspect git status and recent commits, reconcile external changes, then continue the exact pending task. Do not restart previous phases or regenerate existing media. Do not claim automatic resumption after limits without a real scheduled capability.

### Resume prompt

> Continue RivyaLivingArt from `docs/redesign/DARK-THEME-EXECUTION-STATE.md` and the approved `DARK-THEME-MASTER-PLAN.md`. Verify the current branch and SHA, reconcile external changes, and resume the exact pending task. Preserve completed work and assets. Update the checkpoint and phase summary before stopping.

## T — TONE AND DECISION QUALITY

Be decisive, precise and evidence-based. Use concrete paths, route names, states and acceptance criteria. Do not call every suggestion “premium”; explain what it improves. Do not claim all pages were audited when only samples were inspected. Clearly identify missing access or unavailable verification.

**Start with DT-01 only. Produce the complete plan, then stop with:**

**STATUS: PLAN READY — WAITING FOR APPROVAL. NO IMPLEMENTATION STARTED.**
