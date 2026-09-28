---
name: luxury-dark-mode
description: Design and implement high-end midnight luxury dark palettes, depth layering, metallic bronze/champagne accents, and anti-glare typography. Use when asked to "improve dark mode", "make dark theme look luxurious", "fix dark mode contrast", "add depth to dark UI", or "style luxury atelier theme".
version: 0.1.0
---

# Luxury Dark Mode & Midnight Atelier Craft

True luxury dark themes are never `#000000` text on `#111111` boxes. Luxury dark themes emulate deep natural light, sub-surface material scattering, and warm metallic accents (bronze, amber, champagne gold, ivory).

---

## 1. The 4-Tier Depth Surface System

Avoid flat gray layers. Build visual altitude with tinted darks:

```css
:root {
  /* Level 0: The Deep Ground (Canvas) */
  --surface-ground: #08111d;        /* Deep midnight indigo-black */

  /* Level 1: Resting Surfaces (Cards, Sections) */
  --surface-card: #0d1a2d;          /* Slightly lifted, blue-tinted dark */

  /* Level 2: Interactive Floating Elements (Hover states, Drawers) */
  --surface-elevated: #15243b;      /* Clear visual altitude */

  /* Level 3: Modals, Popovers, Command Palettes */
  --surface-overlay: rgba(16, 28, 45, 0.94);
  
  /* Borders: Hairline specular lights rather than harsh outlines */
  --border-subtle: rgba(183, 146, 112, 0.14);   /* Warm bronze hairline */
  --border-interactive: rgba(183, 146, 112, 0.32);
  --border-focus: #c5a27d;
}
```

---

## 2. Text Hierarchy & Anti-Glare Legibility

Pure `#FFFFFF` on dark backgrounds causes visual halation and eye fatigue:

```css
:root {
  --text-ivory-primary: #f5f4ef;   /* Warm ivory for headings & hero titles */
  --text-muted: #abb8c2;           /* Soft slate-ivory for body reading */
  --text-tertiary: #75838f;        /* Restrained metadata and captions */
  --text-bronze-accent: #d4b18d;   /* Warm metallic highlight */
}
```

---

## 3. Sub-Surface Glows & Caustics (Resin Emulation)

Resin interacts with ambient light. Emulate luminous resin depths using layered radial gradients:

```css
.resinGlowContainer {
  position: relative;
  background: var(--surface-card);
  isolation: isolate;
  overflow: hidden;
}

.resinGlowContainer::before {
  content: '';
  position: absolute;
  top: -20%;
  left: 30%;
  width: 50%;
  height: 60%;
  background: radial-gradient(
    circle,
    rgba(183, 146, 112, 0.12) 0%,
    rgba(7, 18, 33, 0) 70%
  );
  pointer-events: none;
  z-index: 0;
  filter: blur(40px);
}
```

---

## 4. Metallic CTA & Glassmorphic Highlights

Primary buttons should catch light like polished cast bronze:

```css
.luxuryButton {
  background: linear-gradient(135deg, #dfc09f 0%, #b79270 50%, #8c6a48 100%);
  color: #08111d !important;
  font-weight: 550;
  letter-spacing: 0.02em;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 
    0 4px 16px rgba(183, 146, 112, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.luxuryButton:hover {
  transform: translateY(-1px);
  box-shadow: 
    0 8px 24px rgba(183, 146, 112, 0.38),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
}
```
