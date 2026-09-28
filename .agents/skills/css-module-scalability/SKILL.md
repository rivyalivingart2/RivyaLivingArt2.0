---
name: css-module-scalability
description: Write bulletproof, scalable, and zero-conflict CSS Modules with design tokens, container queries, and predictable cascade governance. Use when asked to "organize CSS modules", "avoid CSS specificity conflicts", "use CSS container queries", or "scale design tokens".
version: 0.1.0
---

# CSS Module Scalability & Cascade Governance

CSS Modules provide local scoping by default, preventing name collisions. However, without disciplined token structure and cascade rules, stylesheets grow into unmaintainable duplicates.

---

## 1. Design Token Hierarchy

Never hardcode arbitrary pixel or hex values inside CSS modules. Always reference global tokens:

```css
/* Good: Consistent spacing, radius, and elevation */
.card {
  padding: var(--space-4);
  border-radius: var(--radius-sm);
  background: var(--surface-card);
  border: 1px solid var(--border-subtle);
  transition: transform var(--duration-fast) var(--ease-spring);
}

/* Bad: Random values that break consistency */
.card {
  padding: 17px;
  border-radius: 5px;
  background: #111a28;
  border: 1px solid rgba(255,255,255,0.07);
}
```

---

## 2. Low Specificity & Flat Selectors

Avoid deep nested selector chains like `.header nav ul li a span`. They make overriding and maintaining styles a nightmare:

```css
/* Good: Single flat class selector */
.navItemLink {
  color: var(--text-muted);
}
.navItemLink:hover {
  color: var(--text-ivory-primary);
}

/* Bad: High specificity chain */
.nav > div ul li a {
  color: #abb8c2;
}
```

---

## 3. Container Queries (`@container`) over Media Queries

When building reusable components (like `ProductCard` or `InquiryForm`), style them based on the width of their parent container rather than the entire browser viewport:

```css
.cardContainer {
  container-type: inline-size;
}

@container (max-width: 400px) {
  .cardGrid {
    grid-template-columns: 1fr;
    gap: var(--space-2);
  }
  .cardTitle {
    font-size: 18px;
  }
}

@container (min-width: 401px) {
  .cardGrid {
    grid-template-columns: 1fr 1fr;
    gap: var(--space-4);
  }
}
```

---

## 4. Composing Utility Classes in CSS Modules

Leverage `composes` to share common button and typography styles across modules:

```css
/* styles/primitives.module.css */
.interactiveControl {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  cursor: pointer;
  user-select: none;
}

/* components/shop/shop.module.css */
.customButton {
  composes: interactiveControl from "./primitives.module.css";
  background: var(--accent-gradient);
  color: var(--surface-ground);
}
```
