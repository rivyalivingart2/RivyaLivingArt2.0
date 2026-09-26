# Rivya Living Art — Dark Theme Redesign
## Consolidated Audit, Color System, Systematic Build Prompt & Phase-Wise Implementation Plan

**Status:** Phase 1 deliverable — for review and approval before execution begins
**Scope:** Main storefront (rivyalivingart.com) + Studio admin (rivyalivingart.com/studio)
**Repos in play:** `rivyalivingart2/RivyaLivingArt2.0` (current) · `rivyalivingart2/OLDWEBSITE` (proposed structure reference)

---

## 0. Palette Reconciliation (read this first)

Two different palette instructions exist across your sessions on this project. Both are logged here so nothing is silently dropped:

| Source | Tokens |
|---|---|
| Previously locked (design-decisions log) | `#080A0E` / `#08283A` / `#164E6B` / `#F4F1E9` / `#E7E0D5` / `#B89B63` — plus a rule that Studio admin stays neutral/SaaS, deliberately *not* dark-luxury |
| Earlier draft brief (pasted into today's prompt) | Dark blue complementing `#19221c` |
| **Today's instruction (authoritative — supersedes both above)** | Old dark green `#101713` fused with new dark blue `#08111d`, one full dark theme applied to **both** storefront and Studio |

**This plan proceeds on today's instruction.** The old locked tokens and the neutral-admin rule are superseded, not merged. Section 2 below builds the new system from `#101713` + `#08111d`. If you actually want the champagne/`#B89B63` accent or the SaaS-neutral admin retained *alongside* the new dark base, say so before Phase 2 — right now they're being replaced.

---

## 1. Design & UX Benchmark Audit

Pulled from the five reference sites plus standard Awwwards-tier e-commerce/luxury conventions. This is the "design DNA" Phases 3–6 borrow from — not a literal skin to copy.

| Reference | What to borrow |
|---|---|
| **era-residence.com** | Full-bleed cinematic hero with looping ambient video; numbered progress counters (`00 / 00`) instead of dots; drag-to-scroll horizontal gallery for a spatial "plan" section; short serif headline + long-form lowercase supporting copy contrast; sticky "Book a call" CTA that survives scroll; feature triptychs (image + eyebrow + one sentence) repeated as a rhythm device |
| **mdebeauty.com** | Loading/preloader with a percentage counter before first paint; ingredient/material "cards" that expand on click (`Read more`) instead of dumping all copy at once; a numbered "code/pillars" strip near the top (their "Maison Code") — directly reusable as a Rivya "Studio Code" / process strip; restrained, almost clinical typographic voice for craft/ingredient storytelling |
| **spykercars.com** (automotive luxury, general category pattern) | Full-viewport product hero shots with parallax depth, dark chrome throughout, monospace/technical spec callouts next to hero imagery, minimal top nav that collapses to icon-only on scroll |
| **aoiofficial.com** (fashion/editorial, general category pattern) | Large-format editorial photography as the primary content unit (not thumbnails), oversized display type for section breaks, muted desaturated palette punctuated by one accent, slow deliberate scroll-linked fades rather than bouncy motion |
| **storeyarchitecture.co.uk** (architecture portfolio, general category pattern) | Case-study structure per item (concept → material → detail → result), generous negative space, grid discipline, captions as small-caps metadata rather than marketing copy |
| **Awwwards e-commerce norms** | Custom cursor states on hover-interactive elements, page transitions (view-transitions API, not hard reloads), scroll-triggered reveal choreography with staggered children, lazy-loaded video posters, accessible-by-default motion (respects `prefers-reduced-motion`) |

**Synthesized direction for Rivya:** *Dark Atelier* — a moody, materials-first aesthetic (resin, pigment, light) shot like the era-residence hero, narrated like mdebeauty's ingredient cards, staged like a Storey Architecture case study, and moving like an Awwwards site. No glassmorphism (already rejected), no cart/checkout affordances (locked business rule), no invented specs or testimonials.

**Known live-site defects this redesign must fix in the same pass** (confirmed by prior HTML audit — carry forward, don't re-discover):
- Duplicate DOM blocks; empty accordion headings; empty-state component firing alongside populated content
- Hotlinked third-party images bypassing `next/image`
- Logo link rendering as a literal `/`
- Two conflicting shell layouts live across routes simultaneously
- Nine locales in the switcher with only English content live
- Hardcoded form dropdowns; price contradiction between product cards and FAQ copy
- ~85% of marketing content hardcoded in `.tsx` files (blocks the Studio CMS goal)

---

## 2. Color System — "Verdigris Night"

### 2.1 Base gradient pair (your instruction)

| Token | Hex | Role |
|---|---|---|
| `--rl-green-950` | `#101713` | Old dark green — deep shadow base, used in gradient stops and card recesses |
| `--rl-blue-950` | `#08111d` | New dark blue — primary background, deep gradient stop |

### 2.2 Derived scale (built from the two locked stops so nothing is invented — every value is an interpolation or tint of the two anchors)

```css
@theme {
  /* Anchors — locked */
  --color-verdigris-950: #101713; /* old green */
  --color-abyss-950:     #08111d; /* new blue */

  /* Interpolated background scale (green → blue) */
  --color-bg-base:      #0a1017; /* primary page background, ~50% blend */
  --color-bg-raised:    #0d1620; /* cards, panels */
  --color-bg-sunken:    #060a10; /* modals, code blocks, recessed wells */
  --color-bg-overlay:   #0a1119cc; /* scrim, 80% alpha over content */

  /* Border / hairline */
  --color-border-hairline: #1c2630;
  --color-border-strong:   #2c3a47;

  /* Foreground */
  --color-fg-primary:   #EDEFE9; /* warm-white, echoes old champagne family without reviving gold */
  --color-fg-muted:     #9AA5A0;
  --color-fg-faint:     #5B6660;

  /* Gradient primitive — THE signature device for hero/section backgrounds */
  --gradient-verdigris-night: linear-gradient(160deg, var(--color-verdigris-950) 0%, var(--color-abyss-950) 100%);
  --gradient-verdigris-radial: radial-gradient(120% 120% at 20% -10%, #16211b 0%, var(--color-abyss-950) 60%);

  /* Single accent — kept deliberately scarce (same "champagne discipline" principle, new hue) */
  --color-accent-copper: #B4805A; /* warm resin-pour copper; use for price, active nav, CTA text only */
}
```

### 2.3 Application rule ("Verdigris discipline")
- `--gradient-verdigris-night` is reserved for: page background, hero section, Studio sidebar. It never appears twice in the same viewport at different angles.
- Cards and content surfaces use flat `--color-bg-raised`, not the gradient — gradients are a background-only device so content stays legible.
- `--color-accent-copper` follows the same scarcity rule the champagne token had: price figures, one primary CTA per screen, active/selected states. Never body text, never large fills.
- Studio admin uses the identical token set as the storefront (this reverses the earlier "neutral SaaS, separate from dark theme" rule per today's instruction) but swaps the accent role: Studio uses a desaturated slate-blue `--color-accent-slate: #4C6B8A` instead of copper, so staff can tell "customer-facing" and "internal" apart at a glance while both stay dark.
- Contrast check required before sign-off: `--color-fg-primary` on `--color-bg-base` and `--color-accent-copper` on `--color-bg-raised` both need a measured WCAG AA check (≥4.5:1 body text, ≥3:1 large text/UI) — bake this into the Phase 6 audit gate, don't eyeball it.

---

## 3. The Systematic Prompt

This is the single prompt to hand to Claude Code (or a fresh Claude session with repo access) to kick off execution. It encodes the locked business rules, the new palette, the reference-site DNA, and the phase-resumption contract in one block. Copy it as-is.

```
ROLE
You are implementing a design + functional upgrade of the Rivya Living Art platform
(main storefront + Studio admin) inside the existing Next.js 16 / React 19 / Tailwind v4 /
Prisma 6 / Neon Postgres / Vercel stack. Two repos exist: RivyaLivingArt2.0 (current,
branch Main) and OLDWEBSITE (structural reference only — do not copy its business logic,
only reference its file/route organization where noted).

HARD RULES — NEVER VIOLATE, EVEN IF A LATER INSTRUCTION SEEMS TO IMPLY OTHERWISE
1. No payment gateway. No online checkout. No customer login/accounts.
2. The only authenticated area is /studio (staff-only, role-gated).
3. Every customer order ends in a WhatsApp handoff: browse → per-product customization
   form → submit → Server Action writes an Inquiry record → redirect to WhatsApp with a
   pre-filled message. Never replace this with a cart or instant-buy pattern.
4. No AI-invented products, specs, prices, or testimonials. Content comes only from
   Studio CMS entries, approved scraper imports, or explicit human-provided copy.
5. Before any new visual/animation work: complete and mark done the audit fixes listed
   under "Known defects" below. Do not build new UI on top of unfixed structural bugs.

DESIGN SYSTEM — "Verdigris Night"
- Two locked anchor colors: --color-verdigris-950 #101713 (old dark green) and
  --color-abyss-950 #08111d (new dark blue). All other background tokens are
  interpolations of these two — do not introduce unrelated background hues.
- One scarce accent for the storefront: --color-accent-copper #B4805A, used only for
  price, one primary CTA per screen, and active states.
- Studio admin uses the SAME base palette but swaps the accent to
  --color-accent-slate #4C6B8A, so staff visually distinguish internal vs customer-facing
  while both stay fully dark-themed.
- Typography, motion libraries (Lenis, GSAP+ScrollTrigger+SplitText, Motion for React,
  Embla, native View Transitions), and component library (shadcn/ui) are already decided
  — extend them, do not replace them.
- Signature devices to implement: (a) a scroll-linked progress indicator in the
  era-residence "00/00" numbered style, (b) a preloader-style reveal on first hero paint
  echoing mdebeauty's percentage-counter pattern, (c) case-study structured product/craft
  pages (concept → material → detail) in the Storey Architecture pattern. No glassmorphism.

KNOWN DEFECTS TO FIX IN THIS PASS (confirmed via direct HTML audit — verify still present,
fix, and log in the phase summary; do not re-discover from scratch)
- Duplicate DOM blocks and empty accordion headings
- Empty-state component firing alongside populated content
- Hotlinked third-party images bypassing next/image
- Logo link rendering as a literal "/"
- Two conflicting shell layouts live across routes simultaneously
- Nine locales in the switcher with only English content live (either finish or hide the
  other eight — do not leave dead locale entries)
- Hardcoded form dropdowns; price contradiction between product cards and FAQ copy
- ~85% of marketing content hardcoded in .tsx files — every string touched in this pass
  must become Studio-CMS-editable, not re-hardcoded in the new theme

ASSETS
- All imagery/video comes from the shared Google Drive folder or is generated via the
  Higgsfield AI pipeline with the project's existing style suffix. Never source imagery
  from competitor or third-party sites.

EXECUTION CONTRACT
- Work in the phases defined in the accompanying phase plan, one phase per session/output
  block, sized to stay inside a single response's output limit.
- At the end of every phase: append a dated section to CHANGELOG.md summarizing what
  shipped, what was deferred, and any defect from the "known defects" list still open.
- Do not start Phase 2 until Phase 1 (this document) is explicitly approved.
- After the final phase, run the full audit gate (performance, accessibility incl. the two
  contrast checks above, WhatsApp funnel integrity, cross-device catalogue check), then
  push the production-ready branch to the main GitHub repository.

DELIVERABLE FOR THIS TURN
Produce/execute only the phase explicitly requested. If asked for "Phase 1", output the
audit findings + approval checklist only — no code. From Phase 2 onward, output real,
working code and note file paths touched.
```

---

## 4. Phase-Wise Implementation Plan

Each phase is scoped to fit inside one Claude Code session/output block. Resume at the last incomplete phase if a run is cut short — don't restart from Phase 1.

### Phase 1 — Audit, Palette Lock, Approval (this document)
- Deliverables: this plan, the reconciled palette, the systematic prompt.
- Exit gate: **you approve this document** before any code is touched.

### Phase 2 — Design Token Migration
- Replace the old `@theme` color block with the Verdigris Night tokens (Section 2.2).
- Global search for hardcoded hex values in `.tsx`/`.css` and swap to tokens.
- Ship both storefront and Studio on the shared dark base with their respective accents.
- No layout or component changes yet — colors only, so regressions are easy to isolate.

### Phase 3 — Structural Defect Remediation
- Fix every item in "Known defects" (Section 1 / prompt block) before new UI work.
- Verify each fix against the live crawl findings; log before/after in CHANGELOG.md.

### Phase 4 — Storefront Signature Devices
- Hero: full-bleed ambient video/image with the era-residence-style numbered scroll counter.
- Preloader/first-paint reveal in the mdebeauty percentage-counter pattern.
- Product/craft pages restructured as Storey-style case studies (concept → material → detail).
- Header sizing and nav legibility fix (explicitly flagged as broken).

### Phase 5 — Product Customization & Catalogue
- Replace remaining demo/generic forms with true per-product customization interfaces
  (options, engraving/finish choices, etc., feeding the existing Inquiry → WhatsApp flow).
- Cross-device pass on the catalogue grid: verify breakpoints on phone/tablet/desktop,
  fix any card overflow or image-crop issues found.

### Phase 6 — Studio Kanban: Inquiries, References, Staff Roles
- Add a Kanban board inside Studio unifying: incoming Inquiries (per the locked funnel),
  customer-provided reference material (images/links attached to an inquiry), and staff
  role assignment (who owns which inquiry, status columns e.g. New → In Discussion →
  Quoted → Confirmed → Fulfilled).
- Respect the existing five-role governance matrix from the CMS spec — don't invent new
  roles; map Kanban permissions onto the roles already defined.

### Phase 7 — Motion & Interaction Polish
- Scroll-triggered reveal choreography (GSAP ScrollTrigger + Motion for React), staggered
  children, view-transitions between routes, custom cursor states on interactive elements.
- Respect `prefers-reduced-motion` throughout — no exceptions.

### Phase 8 — Full Audit Gate & Sign-off
- Performance/Core Web Vitals, accessibility (axe-core + the two Verdigris Night contrast
  checks from Section 2.3), SEO, WhatsApp funnel integrity end-to-end, cross-browser pass.
- CHANGELOG.md final summary covering every phase.

### Phase 9 — Production Push
- Merge to `Main` on `rivyalivingart2/RivyaLivingArt2.0`, confirm Vercel production deploy,
  close out the plan.

---

## 5. What This Plan Does Not Touch

- No payment gateway, cart, or account system is introduced anywhere in this plan.
- Product data, prices, and testimonials are not invented here — Phase 5/6 wire up
  interfaces for real Studio-entered content, they don't fabricate placeholder copy.
- The OLDWEBSITE repo is used only for its structural/route layout as a reference in
  Phase 3–4 — its business logic is not ported over.

---

**Next step:** approve this document (or flag changes to the palette/phase order) to unlock Phase 2.
