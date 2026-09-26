# Rivya Living Art — Unified Dark-Theme Redesign
## Integrated Audit, Design System & Phase-Based Implementation Plan

**Status:** PHASE 0 COMPLETE — awaiting Phase 1 approval before any code is written  
**Date:** 2026-09-26  
**Owner repo (production target):** `https://github.com/rivyalivingart2/RivyaLivingArt2.0.git`  
**Reference / “old needed things” repo:** `https://github.com/rivyalivingart2/OLDWEBSITE.git`  
**Live production:** `https://www.rivyalivingart.com` · Studio `https://www.rivyalivingart.com/studio`  
**Reference deployment:** `https://oldwebsite-one.vercel.app` · Studio `https://oldwebsite-one.vercel.app/studio/`  
**Media source of truth:** Google Drive folder `1P2HCTmPge6HsEwtoo-xGEzPTSn68oZOW`  
**This document is the single source of truth until Phase 8 ships to `main`.**

---

## 0. How this plan is meant to be used

1. Read this document. Approve Phase 1 (or mark amendments).
2. Each later session starts from the **Master Systematic Prompt** in §8 and the current phase checklist.
3. At the end of every phase, append a **Phase Close-Out** block to `docs/phases/PHASE-XX.md` and update the status table in §7.
4. No payment gateway. No customer accounts. No invented catalogue items. Every public conversion ends as a persisted Inquiry + WhatsApp handoff to `wa.me/917096036250`.
5. Do not start execution until Phase 1 is explicitly approved.

---

## 1. Strategic approach

Two live systems already exist. This is not a greenfield rebuild.

| System | What it is today | What we keep |
|---|---|---|
| **Current production** (`rivyalivingart.com`, repo `RivyaLivingArt2.0`) | Material-first atelier. Split-hero home. Three-tier catalogue (Furniture & spatial art · Memory art · Personal art & gifts). Commission flow. Dark canvas already `#08111d`. Studio login + staff panel. | Information architecture, three-tier merchandising, commission UX, unique copy, product data, Studio data model, WhatsApp inquiry pipeline, Next.js App Router stack. |
| **Proposed / “old” design** (`oldwebsite-one.vercel.app`, repo `OLDWEBSITE`) | Editorial “Liquid Luxury” composition. Cure Line. Numbered sections. Manifesto. Process (pour / gild / cure / polish). Collections as look-first tiles. Bespoke band. 3D-print chapter. Shop + Workshops + Portfolio + Journal. Champagne accent discipline. | Editorial rhythm, Cure Line, section numbering, process storytelling, collection-as-look, header wordmark + utility cluster, shop/custom-order depth, 3D-print chapter if still in scope, Kanban intent, token naming discipline. |

**North star:** one fully dark platform — storefront and Studio — that reads as a contemporary resin-and-timber atelier. Wood-night green and river-night blue are the same atmosphere, not two themes. The visitor journey is:

> DISCOVER material → EXPLORE collection → DESIRE an object → UNDERSTAND the craft → TRUST the maker → PERSONALIZE on a product-specific form → CONNECT on WhatsApp → COMMISSION a one-of-one piece.

**What “full dark theme” means here**

- No light mineral page grounds on storefront or Studio.
- Surfaces lift in value, not in hue toward beige.
- Champagne / river-gold is accent only (max two champagne objects per viewport).
- Photography and resin remain the brightest things on the page.
- Text is warm ivory on night, never pure white on pure black.

**What “implement old needed things on all pages” means here**

Carry forward from OLDWEBSITE onto every production page:

- Cure Line (desktop) + section index ticks.
- Numbered mono eyebrows (`01 · THE POUR`).
- Manifesto / process / maker / how-it-works / why-Rivya blocks where they belong.
- Collection tiles browsed by look, not by SKU count.
- Product-specific customizer (not a generic demo form).
- WhatsApp as the only close — with a persisted inquiry first.
- Shop, Bespoke, Process, Journal, Portfolio, Workshops, Contact, Large-format — all present and dark.
- Studio: inquiries + references + staff roles inside a Kanban, not a flat table.

---

## 2. Audit — current production (`rivyalivingart.com`)

Measured 2026-09-26.

### 2.1 Visual

- Page ground is already `rgb(8, 17, 29)` = `#08111D`.
- Ivory body text `rgb(243, 239, 231)`.
- Header ~72 px, wordmark lockup + serif “RIVYA LIVING ART”, champagne hairline under header.
- Nav: Collections ▾ · Our Atelier · Process · Journal · Contact · Search · `Begin a piece`.
- Hero is a **split composition**: copy left, river-table visualization right. Strongest image on the site.
- Tone is atelier, not shop.

### 2.2 Information architecture (public)

| Route | Role |
|---|---|
| `/` | Split hero, featured objects, language finder, dialogue, commission CTA |
| `/collectible-design` | Tier 01 — Furniture & spatial art |
| `/memory-art` | Tier 02 — Memory art |
| `/personal-art` | Tier 03 — Personal art & gifts |
| `/pieces/[slug]` | Object page |
| `/commission` | Begin a piece / custom brief |
| `/our-story` | Atelier story |
| `/process` | Craft process |
| `/journal` + articles | Editorial |
| `/contact` | WhatsApp / phone / email / maps |
| `/studio` | Staff-only (login confirmed) |

### 2.3 Studio (production)

- Login: “RIVYALIVINGART · PRIVATE STUDIO”, Staff ID + password, champagne primary button.
- Background already a forest→ocean gradient — this is the colour direction to systematize, not invent.
- Full Studio feature set in the 2.0 README: dashboard, products + per-product form builder, categories, portfolio, blog, media, inquiries/WhatsApp orders, testimonials, FAQs, subscribers, SEO, settings, pages, bulk import, catalog fill, product scraper, roles, activity log.

### 2.4 What is working

- Brand voice. No dummy copy on the flagship pages.
- Three-tier catalogue is the correct merchandising model.
- Non-transactional model is already enforced in product and docs.
- Photography of the river table is the brand’s signature object.
- Stack is modern: Next.js App Router, TypeScript, Tailwind v4, GSAP/Lenis, Prisma.

### 2.5 What is not working (must fix in this programme)

- Header sizing and nav legibility — 72 px is tight for a wordmark + 6 items + search + CTA; Collections mega-menu needs more air and contrast against `#08111D`.
- Light-theme leftovers in Studio interiors (if any mineral/sand cards remain, they must go).
- Colour system is one-note ocean. Forest `#101713` is not tokenized, so wood and resin night do not speak.
- OLDWEBSITE editorial devices (Cure Line, numbered sections, manifesto band, look-first collections, how-it-works timeline) are missing or thinner on production.
- Customization is not consistently product-specific on every object page.
- Catalogue density on `/shop`-style views (old site still shows long scraped titles). Production must stay object-named, never marketplace-titled.
- Kanban for inquiries / references / staff is specified, not the daily operating surface.
- Cross-device catalogue: filters, cards, and customizer must be first-class on 390 / 768 / 1280 / 1440.

---

## 3. Audit — proposed / OLDWEBSITE (`oldwebsite-one.vercel.app`)

Measured 2026-09-26.

### 3.1 Visual

- Ground `rgb(8, 10, 14)` = `#080A0E` (obsidian from Liquid Luxury spec).
- Header ~80 px. Wordmark “Rivya Living Art” (serif, no lockup). Center nav: Shop · Bespoke · Studio · Journal. Right: search, WhatsApp pill, menu.
- Top utility rail: “MADE-TO-ORDER LUXURY RESIN ART — EVERY ORDER FINALIZED PERSONALLY ON WHATSAPP”.
- Hero is **type-first**, not image-first: “Cast for the room it will live in.”
- Cure Line with numbered ticks down the left gutter (`01 · the pour` …).
- Fonts confirmed: Instrument Serif + Inter + JetBrains Mono + Lenis.

### 3.2 Homepage section map (keep this rhythm)

1. Hero — type, eyebrow, two CTAs, fact row  
2. Manifesto — “Objects made slowly. Memories made permanent.”  
3. Featured pieces  
4. Large-format band  
5. Material — pour / gild / cure / polish  
6. Collections as look tiles  
7. The maker  
8. Bespoke — “Made to your story”  
9. 3D printing chapter  
10. How it works — Choose → Customize → WhatsApp → Craft & deliver  
11. Why Rivya  
12. Journal  
13. Final CTA + newsletter  

### 3.3 What to steal

- Cure Line as the signature interaction.
- Numbered mono eyebrows and section ticks.
- Champagne used as outline and micro-label, never as a fill flood.
- Header cluster: wordmark · 4 links · search · WhatsApp · menu.
- How-it-works timeline with the explicit line: *No payment on this website — price is agreed on WhatsApp before anything is poured.*
- Shop / custom-order / large-format / workshops / portfolio depth.

### 3.4 What not to steal

- Marketplace product titles on the homepage (“Lord Khatu Shyam Ji Spiritual Puja…”). Production object names stay curated (`River Channel`, `Stillwater`, `Verdant`).
- Light mineral page grounds and “max three dark bands” rule — **superseded**. The new rule is full night, with surface elevation instead of light bands.
- Obsidian-only `#080A0E` as the only night. Too cold, severs the timber story. We blend it with `#101713`.

---

## 4. Reference-site benchmarking (what we actually borrow)

These sites are the quality bar, not templates to clone.

| Site | Borrow | Do not borrow |
|---|---|---|
| **era-residence.com** | Architectural calm. Full-bleed material photography. Slow reveal. Plan-to-enquire rather than plan-to-cart. | Real-estate floor-plan chrome. |
| **spykercars.com** | Heritage axiom as a repeating engraved idea. Object as geometry. “One house, one language.” | Automotive configurator complexity. |
| **aoiofficial.com** | 1-of-1 language. Enquire-about-this-piece as the primary verb. Collection as worlds, not SKUs. Process / salon as a destination. | Fashion drop / gift-card mechanics. |
| **mdebeauty.com** | Clinical-luxury dark UI. Precise type. Ritual-as-process. | Beauty e-com checkout. |
| **storeyarchitecture.co.uk** | Project index as a crafted grid. Quiet nav. Case-study depth. | Architecture-only project pages with no object commerce. |
| **Awwwards e-com benchmarks** | View-transition from card → object. Cursor-aware but reduced-motion safe. Image as the interface. | Parallax theatre that hides information. |

**Applied standard for every Rivya page**

- One H1. One primary CTA. One secondary CTA.
- Object before metadata. Metadata in mono.
- Motion is structural (reveal, line-draw, view-transition), never decorative bounce.
- Mobile is a designed surface, not a squeezed desktop.

---

## 5. Design system — “Night Timber / River”

### 5.1 Colour decision (locked)

User instruction: full dark theme for storefront **and** Studio; combine old dark green `#101713` with new dark blue `#08111D`; keep `#19221C` in the family; primary as a **combined gradient**.

```
WOOD NIGHT                         RIVER NIGHT
#101713  ───────────────────────▶  #08111D
         #19221C sits between them
```

| Token | Hex | Role |
|---|---|---|
| `--night-forest` | `#101713` | Wood-side night. Footer depths, maker, process, Studio rail. |
| `--night-ocean` | `#08111D` | River-side night. Hero, catalogue, object pages. |
| `--night-ink` | `#19221C` | Mid night. Cards, elevated panels, mega-menu, Studio canvas. |
| `--night-canvas` | `#0B1418` | Default page ground (mix of forest + ocean). |
| `--night-surface` | `#121C22` | Raised surface (cards, forms, login panel). |
| `--night-surface-2` | `#18242B` | Hover / selected / Kanban card. |
| `--resin-primary` | gradient | `linear-gradient(135deg, #101713 0%, #19221C 42%, #08111D 100%)` — header-on-scroll, hero veil, Studio shell, primary large bands. |
| `--resin-primary-v` | gradient | `linear-gradient(180deg, #08111D 0%, #101713 100%)` — full-page veil, login atmosphere. |
| `--river` | `#1A5C7A` | Primary interactive (links, Cure Line fill, focus). From the live river table. |
| `--river-hi` | `#2A7A9C` | Hover only. |
| `--champagne` | `#C4A574` | Accent. Hairlines, micro-labels, active ticks. Max two per viewport. Never a solid button fill except the Studio login primary if already established. |
| `--ivory` | `#F3EFE7` | Primary text on night. |
| `--ivory-dim` | `#C9C2B4` | Secondary text on night. |
| `--mist` | `#8A9AA3` | Tertiary / mono metadata on night. |
| `--hairline` | `rgba(243,239,231,0.12)` | All dividers. |
| `--whatsapp` | `#128C7E` | WhatsApp actions only. |
| `--alert` | `#B4564A` | Errors. |
| `--success` | `#3D7A6A` | Success / stage-complete. |

**Rules**

1. Storefront and Studio share this exact token file.
2. No `#FFFFFF` page grounds. No `#F4F1E9` mineral bands.
3. Contrast: ivory on `--night-canvas` and `--night-ink` must hold ≥ 4.5:1 for body, ≥ 3:1 for display.
4. Champagne is outline, 1 px hairline, or 11–12 px mono label. Not a flood.
5. Photography and resin pours are allowed to be the only “light” in a viewport.
6. Primary CTA on storefront = ivory text on `--resin-primary` gradient, 1 px champagne hairline. Secondary = ghost + ivory underline.
7. WhatsApp CTA is the only green fill, and only for the WhatsApp action.

### 5.2 Type (unchanged family, dark optical sizes)

- Display: Instrument Serif  
- Body: Inter  
- Meta / price / dimension / section index: JetBrains Mono  
- Optical: slightly higher tracking on ivory-on-night body (+0.01em) so Inter does not look thin.

### 5.3 Header — the specified fix

**Problem:** production header is 72 px, lockup + 6 items + search + CTA compete; contrast of small nav on `#08111D` is the reported legibility issue.

**Target**

- Height 88 px desktop, 64 px compact-on-scroll, 56 px mobile.
- Left: existing lockup, 36 px mark, wordmark not smaller than 14 px tracking-wide.
- Center (desktop): Collections · Atelier · Process · Journal · Contact — 14 px, `ivory-dim`, hover `ivory`, active = 1 px champagne underline drawn 180 ms.
- Right: search icon · WhatsApp text button · `Begin a piece` (gradient fill).
- On scroll: background becomes `--resin-primary` at 92% + blur 16 px. No jump in height greater than 24 px.
- Mega-menu for Collections: `--night-ink` panel, three columns matching the three tiers, look-tiles not link lists, 1 px hairline, 32 px inset.
- Mobile: lockup + search + menu. Drawer from right, `--night-forest`, focus-trapped. Bottom bar 64 px: Home · Collection · Search · WhatsApp · Menu.

### 5.4 Signature device — Cure Line

Port from OLDWEBSITE to production, restyled.

- 1 px vertical hairline in a 56 px left gutter, desktop only (`≥1280`).
- Fill colour `--river`, track colour `--hairline`.
- Ticks labelled in 10 px mono, champagne when active.
- Hidden below 1280 and whenever `prefers-reduced-motion: reduce` (page still works; the line is not content).

### 5.5 Motion

- Lenis + GSAP ScrollTrigger + SplitText already in stack — keep.
- Card → object page: view transition on the image only.
- No hover scale on buttons. 1 px hairline brightens instead.
- Reduced-motion: skip splits, jump Cure Line to final, keep opacity fades ≤ 150 ms.

---

## 6. Functional scope (non-negotiable)

### 6.1 Business model

- No Stripe / Razorpay / PayPal / cart payment.
- No customer accounts.
- Flow: view → product-specific customizer → persist Inquiry (Studio DB) → open WhatsApp with a complete pre-filled brief → price and payment happen on WhatsApp.
- No AI-invented products. Catalogue originates from Studio (manual, import, or reviewed scrape).

### 6.2 Product-specific customization

Replace any remaining demo / generic form with a form whose fields come from the product record:

- Furniture: dimensions (L × W × H), edge profile, resin colourway, timber species, base, reference room photos, budget band.
- Memory / preservation: event date, flowers vs. photograph vs. both, size, inscription, reference uploads.
- Personal / gifts: name, date, size, palette, quantity, gift note.
- Every submit writes an Inquiry with product id, field payload, media refs, source URL, and a generated WhatsApp message.

### 6.3 Studio operating system

Kanban is the home of work, not a side view.

**Boards**

1. **Commissions** — Inquiry → Quoted → Approved → Design → Production → Curing → Finishing → Ready → Delivered / Lost.  
2. **References** — Incoming media / competitor / material refs → Review → Attached to commission or library.  
3. **Staff** — roles (Owner, Editor, Maker, Atelier) as swimlanes or filters on the same cards.

Card anatomy: client name, object, thumbnail, next action, stage timer (cure hours), assignee, WhatsApp deep-link, attachments.

Permissions: Owner sees all; Editor cannot delete products or change roles; Maker sees commissions + references assigned to them.

### 6.4 Catalogue, cross-device

- Three-tier IA stays.
- Object cards: 4:5 image, object name, tier, “Made to order” / “Price on request”, no long scraped titles.
- Filters: tier, scale, customizable, material — as a calm drawer, not a Shopify facet dump.
- Breakpoints signed off at 390, 768, 1024, 1280, 1440.
- Touch targets ≥ 44 px. Filter chips wrap. Customizer is a single column on mobile.

### 6.5 Content

- No lorem, no “product name here”, no dummy prices.
- Object names stay curated.
- Reuse production copy; lift OLDWEBSITE lines only when they are stronger (`Cast for the room it will live in.`, `Objects made slowly. Memories made permanent.`, `No payment on this website…`).
- New sentences must be original to Rivya.

### 6.6 Assets

- Prefer the provided Google Drive. Do not invent product photography.
- Generated assets allowed: icons, vectors, atmosphere, UI chrome, abstract resin-night textures.
- Higgsfield / Imagine: atmosphere only, never a fake catalogue object presented as real.

---

## 7. Phase-based implementation plan

Work stays on a branch `redesign/night-timber` off `RivyaLivingArt2.0` `main`. OLDWEBSITE is **read-only reference**. Each phase ends with a markdown close-out and a preview deploy.

| Phase | Name | Exit criterion |
|---|---|---|
| 0 | Audit & plan (this document) | Plan exists. **You are here.** |
| 1 | Approval & foundation | Tokens, header contract, IA map signed. Tokens file merged. |
| 2 | Shell — header, footer, Cure Line, dark surfaces | Every existing page wears the new night shell with no layout regression. |
| 3 | Home + core story pages | Home, Atelier, Process, Contact rewritten onto the night editorial rhythm. |
| 4 | Catalogue + object + customizer | Three tiers, object pages, product-specific forms, mobile catalogue signed off. |
| 5 | Remaining public pages | Journal, Portfolio, Workshops, Large-format, Search, legal, 404. |
| 6 | Studio night + Kanban | Full dark Studio. Commissions / References / Staff Kanban live. |
| 7 | Motion, a11y, performance, content QA | Scorecard in §9. No dummy copy. Lighthouse / a11y gates. |
| 8 | Production handoff | Preview accepted. Merge to `main`. Vercel production. Phase log complete. |

Do not start Phase N+1 until Phase N close-out is written.

---

### Phase 0 — Audit & plan
**Deliverable:** this file.  
**Status:** complete.

---

### Phase 1 — Approval & foundation
**Do not write page UI yet.**

1. Confirm this document, or return a marked-up list of amendments.
2. Confirm the colour table in §5.1 — especially that Studio and storefront share it.
3. Confirm header contract in §5.3 and nav labels:
   - Proposed production nav: **Collections · Atelier · Process · Journal · Contact** + Search + WhatsApp + **Begin a piece**.
   - Collections mega-menu = three tiers, not a flat shop dump.
4. Create `src/styles/tokens.css` (or update the existing token file) with the Night Timber / River tokens and bridge them into Tailwind v4 `@theme inline`.
5. Write `docs/ia/route-map.md` mapping every current production route and every OLDWEBSITE route to the surviving URL. Do not break inbound links; add redirects where OLDWEBSITE used `/shop`, `/custom-order`, `/about`, `/blog`.
6. Inventory Drive assets vs. what each page needs. List gaps. No generation of fake products.
7. Open branch `redesign/night-timber`.

**Exit:** tokens merged, IA map committed, written approval of §5 and nav labels.

**Suggested redirects**

| Old / reference path | Surviving production path |
|---|---|
| `/shop` | `/collectible-design` or a new `/collection` index that routes into the three tiers |
| `/custom-order` | `/commission` |
| `/about` | `/our-story` |
| `/blog` | `/journal` |
| `/large-resin-art` | `/large-format` (keep if already present) |

---

### Phase 2 — Shell
Apply night to the chrome so every page is already dark while inner sections are still being recomposed.

- Root background `--resin-primary-v` or `--night-canvas`.
- New header + mega-menu + mobile drawer + mobile bottom bar.
- Footer on `--night-forest`: Explore · Atelier · Journal · Contact, plus the no-payment line, WhatsApp, maps, legal.
- Cure Line component, desktop only.
- Shared button, input, card, dialog primitives restyled to night surfaces.
- Studio login page aligned to the same atmosphere (already close — lock tokens).

**Exit:** screenshot pass at 390 / 768 / 1440 on Home, one tier page, one object page, Contact, Studio login. No light flashes of unstyled content.

---

### Phase 3 — Home + core story
Recompose Home using the OLDWEBSITE section rhythm **and** the production split-hero (do not throw away the river table).

**Home section order (locked unless amended in Phase 1)**

1. Split hero — production visual + tightened type. Eyebrow `LARGE-FORMAT COMMISSIONS · RESIN · MADE TO ORDER`. Headline may combine both voices: production “Art for the way you live” as H1, or OLDWEBSITE “Cast for the room it will live in.” **Decision required in Phase 1 approval.** Default recommendation: keep production H1, use the OLDWEBSITE line as the manifesto H2.
2. Manifesto.
3. Featured objects (River Channel, Stillwater, Verdant — curated names only).
4. Language finder / three tiers.
5. Material — pour / gild / cure / polish, sticky media if the Drive has it.
6. Maker.
7. Bespoke band — “Your flowers. Your names. Your dates.”
8. How it works, with the no-payment sentence.
9. Why Rivya — four proof points, defensible mono facts only.
10. Journal strip (three stories).
11. Final CTA.

Then apply the same night editorial system to `/our-story`, `/process`, `/contact`.

**Exit:** unique copy only. Cure Line ticks match sections. Both CTAs work. WhatsApp prefill correct.

---

### Phase 4 — Catalogue + object + customizer
The commercial heart.

- Tier landing pages keep their production headlines and gain OLDWEBSITE look-first tiles + night filters.
- Object page: gallery 4:5 / 16:9, mono metadata, materials, lead time, product-specific customizer, “Ask on WhatsApp” secondary, persist-inquiry-then-handoff.
- Customizer reads field schema from the product record (Studio form builder already exists — wire it, do not replace with a demo).
- Cross-device: filter drawer, card grid 2/3/4 columns, customizer single column <768.
- Search overlay: night, grouped Results (Objects · Collections · Journal).

**Exit:** one furniture object, one preservation object, one gift object each complete a brief that lands in Studio and opens a correct WhatsApp message. No payment UI anywhere.

---

### Phase 5 — Remaining public pages
Journal index + article, Portfolio (before/after if present), Workshops, Large-format, FAQ, Privacy, Terms, 404, loading. Same tokens, same header/footer, no orphan light templates.

**Exit:** route map in `docs/ia/route-map.md` is fully checked off.

---

### Phase 6 — Studio night + Kanban
- Entire `/studio/*` on Night Timber / River. No mineral cards.
- Sidebar on `--night-forest`. Canvas `--night-canvas`. Cards `--night-surface`.
- **Commissions Kanban** is the default Inquiries home. List view remains as an alternate.
- **References** board for uploaded briefs, room photos, competitor refs.
- **Staff** roles + assignment on cards. Existing Auth.js roles stay the source of truth.
- Stage timer for curing (hours, not a toy progress bar).
- Activity log unchanged in data; restyle only.

**Exit:** a test inquiry submitted from an object page appears on the Kanban without a manual refresh longer than the existing realtime/poll interval. Assignee and stage changes persist.

---

### Phase 7 — Quality gates

Scorecard target (from the existing REDESIGN spec, adjusted for full-dark):

| Category | Target |
|---|---|
| Visual hierarchy | 10 |
| Premium feel | 10 |
| Product presentation | 10 |
| Mobile UX | 10 |
| Editorial storytelling | 10 |
| Custom-order UX | 10 |
| Visual consistency (storefront + Studio) | 10 |
| Typography | 9 |
| Navigation clarity | 9 |
| Accessibility | 9 |
| Studio Kanban | 9 |
| Motion | 8 |

Gates: contrast, focus rings, 44 px targets, `prefers-reduced-motion`, one H1 per page, LCP of hero image, no CLS from fonts or header hide-on-scroll, zero dummy copy, zero payment surfaces.

**Exit:** `docs/phases/PHASE-07-QA.md` with screenshots and a short fail-list of anything deferred.

---

### Phase 8 — Handoff

- Preview URL accepted.
- Merge `redesign/night-timber` → `main` on `rivyalivingart2/RivyaLivingArt2.0`.
- Production deploy on Vercel. Confirm `www.rivyalivingart.com` and `/studio`.
- Do not force-push. Do not touch OLDWEBSITE except to add a README pointer to this plan.
- Write the final close-out.

---

## 8. Master systematic prompt
### Use this at the start of every execution session

Copy everything inside the fence.

```
You are implementing the approved Rivya Living Art Night Timber / River redesign.

CANONICAL PLAN
- Follow /docs (or artifacts) file: RIVYA-IMPLEMENTATION-PLAN.md
- Production repo: https://github.com/rivyalivingart2/RivyaLivingArt2.0.git
- Reference repo (read-only): https://github.com/rivyalivingart2/OLDWEBSITE.git
- Live production: https://www.rivyalivingart.com
- Reference live: https://oldwebsite-one.vercel.app
- Drive assets: https://drive.google.com/drive/folders/1P2HCTmPge6HsEwtoo-xGEzPTSn68oZOW
- Branch: redesign/night-timber
- Current phase: [PHASE NUMBER AND NAME]
- Stop at the phase exit criterion. Do not start the next phase.

HARD RULES
1. Full dark theme on storefront AND Studio. No light mineral/sand page grounds.
2. Colour tokens only from the plan: #101713 forest, #08111D ocean, #19221C ink, combined resin gradients, river #1A5C7A, champagne #C4A574 as accent only.
3. No payment gateway, no checkout, no customer accounts.
4. Every order path: product-specific customizer → persist Inquiry → WhatsApp wa.me/917096036250 with a complete pre-filled brief.
5. No AI-invented products. No dummy copy. No marketplace titles on curated surfaces.
6. Keep production IA: /collectible-design, /memory-art, /personal-art, /pieces/[slug], /commission, /our-story, /process, /journal, /contact, /studio.
7. Port OLDWEBSITE devices: Cure Line, numbered mono eyebrows, manifesto, pour/gild/cure/polish, look-first collection tiles, how-it-works, no-payment sentence.
8. Header contract: 88 px desktop, legible ivory-dim nav, Collections mega-menu of three tiers, WhatsApp + Begin a piece on the right.
9. Studio: Commissions / References / Staff live on a Kanban. Existing roles and Auth.js stay.
10. Assets from the Drive first. Generated assets = icons, vectors, atmosphere only.
11. Stack stays: Next.js App Router, TypeScript, Tailwind v4, existing GSAP/Lenis/Prisma/Auth.js/Blob (or current production equivalents). Do not rewrite the stack.
12. At phase end: commit on the branch, write docs/phases/PHASE-XX.md close-out (what shipped, what broke, what is next), do not merge to main until Phase 8.

QUALITY BAR
era-residence.com, spykercars.com, aoiofficial.com, mdebeauty.com, storeyarchitecture.co.uk, and Awwwards-level e-com presentation. Motion is structural. Reduced-motion safe. Cross-device at 390 / 768 / 1024 / 1280 / 1440.

THIS SESSION
- Work only on: [PASTE THE PHASE CHECKLIST]
- First action: read the plan + the files you will touch.
- Last action: phase close-out markdown.
```

---

## 9. Decisions required from you before Phase 1 closes

Reply with approvals or amendments.

1. **Hero headline.** Keep production “Art for the way you live.” and use “Cast for the room it will live in.” as manifesto — **recommended** — or swap them.
2. **Nav labels.** Collections · Atelier · Process · Journal · Contact — or keep “Our Atelier” spelled out.
3. **3D-printing chapter.** Keep as a Home band + page from OLDWEBSITE, or drop it from Home and leave it only if the production catalogue still sells it.
4. **Shop URL.** Add `/collection` as a visual index into the three tiers, or keep the three tier URLs as the only catalogue doors (recommended).
5. **Champagne on Studio login button.** Keep the current gold fill (already shot) or change it to the resin gradient to match storefront CTAs.
6. **Kanban columns.** Confirm Inquiry → Quoted → Approved → Design → Production → Curing → Finishing → Ready → Delivered / Lost.
7. **Phase 1 approval.** “Approved as written” or a bullet list of changes.

Until item 7 is answered, no code lands on the branch.

---

## 10. Suggested Phase 1 close-out template
*(paste into `docs/phases/PHASE-01.md` when that phase ends)*

```
# Phase 01 — Approval & foundation
Date:
Approved by:
Tokens file:
IA map:
Redirects added:
Drive inventory:
Open questions carried:
Next phase:
```

---

## 11. What this programme will not do

- Will not add checkout, wallets, or customer login.
- Will not light-theme the Studio “for readability.” Contrast is solved with ivory-on-night and larger type, not a second theme.
- Will not dump the full scraped catalogue onto the Home featured row.
- Will not clone Spyker / AOI / ERA pixel-for-pixel.
- Will not generate catalogue objects that were never poured.

---

*End of plan. Waiting on Phase 1 approval.*
