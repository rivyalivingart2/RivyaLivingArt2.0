# UI Skills Registry — RivyaLivingArt

**Installation Date:** 26 September 2026  
**Provider:** `ui-skills` CLI (ibelick / Agentic Skills)  
**Location:** `.agents/skills/` (Discovered automatically by Antigravity and Agentic Coding environments)  
**Status:** **ACTIVE & INSTALLED**

---

## Installed Skills Overview

| Skill Slug & Name | Category | Primary Focus & Capabilities | File Path |
| :--- | :--- | :--- | :--- |
| **`jakubantalik/transitions-polish`** | `motion`, `craft` | Motion token scales (durations, distances, scales, blurs, easings), open/close asymmetry, hover-in vs. hover-out spring returns, stagger delays. | [`.agents/skills/transitions-polish/SKILL.md`](file:///c:/Users/gonda/Documents/antigravity/lucid-maxwell/.agents/skills/transitions-polish/SKILL.md) |
| **`emilkowalski/mobile-native`** | `interaction`, `mobile` | Mobile-native feel: notch safe areas (`viewport-fit=cover`), `100dvh` vs `100svh`, touch manipulation, 16px inputs to prevent zoom, overscroll containment. | [`.agents/skills/mobile-native/SKILL.md`](file:///c:/Users/gonda/Documents/antigravity/lucid-maxwell/.agents/skills/mobile-native/SKILL.md) |
| **`s0xdk/refactoring-ui`** | `visual`, `systems` | Refactoring UI doctrine: constrained spacing scales (8pt/16pt grid), visual hierarchy via weight & color rather than size, depth through directional light simulation. | [`.agents/skills/refactoring-ui/SKILL.md`](file:///c:/Users/gonda/Documents/antigravity/lucid-maxwell/.agents/skills/refactoring-ui/SKILL.md) |
| **`elithrar/web-perf`** | `performance`, `diagnostics` | Core Web Vitals profiling: Largest Contentful Paint (LCP), Cumulative Layout Shift (CLS), Interaction to Next Paint (INP), network/CPU trace analysis. | [`.agents/skills/web-perf/SKILL.md`](file:///c:/Users/gonda/Documents/antigravity/lucid-maxwell/.agents/skills/web-perf/SKILL.md) |

---

## How to Trigger & Use Each Skill

### 1. `transitions-polish`
- **Trigger Phrases:** `"transitions review"`, `"transitions polish"`, `"refine motion"`, `"tune animation timing"`, `"timing feels off"`, `"stagger delay"`.
- **Core Rules:**
  - Open/close asymmetry: Opens are invitations (`250ms` `--duration-fast`), closes get out of the way (`150ms` `--duration-quick`).
  - Stagger offsets: Keep total stagger under `300ms` (`40ms` `--duration-stagger` per item).
  - Hover in/out: Quick in (`--ease-smooth-out`), softer/springier out.

### 2. `mobile-native`
- **Trigger Phrases:** `"feels wrong on mobile"`, `"mobile touch"`, `"notch safe area"`, `"carousel scroll wrong"`, `"tap lag"`.
- **Core Rules:**
  - Viewport & notch: `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />`.
  - Input zoom prevention: Form inputs must have minimum `font-size: 16px`.
  - Viewport units: Use `100dvh` for dynamic shells, `100svh` for marketing hero banners.
  - Controls selection: `user-select: none` on buttons and chips; never on `body`.

### 3. `refactoring-ui`
- **Trigger Phrases:** `"looks amateur"`, `"refactor UI"`, `"improve visual hierarchy"`, `"spacing feels off"`, `"design tokens"`.
- **Core Rules:**
  - Never design from arbitrary pixels; pick values strictly from established scales.
  - Establish hierarchy via weight and color de-emphasis, not just increasing font size.
  - Minimum contrast: 4.5:1 for body copy; 3:1 for large text ($\ge 24\text{px}$) and control borders.

### 4. `web-perf`
- **Trigger Phrases:** `"diagnose web performance"`, `"LCP optimization"`, `"reduce layout shift"`, `"Lighthouse audit"`.
- **Core Rules:**
  - Separate field Core Web Vitals from lab synthetic metrics.
  - Trace resource load delays, render-blocking scripts, and image fetch priorities.
  - Verify layout shifts participants before altering element layout properties.
