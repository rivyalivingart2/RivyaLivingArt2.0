---
name: framer-motion-advanced
description: Master advanced UI motion and animation using Framer Motion (motion/react) and modern CSS scroll-driven animations. Use when asked to "add page transitions", "animate layout changes", "shared element transition", "scroll parallax", "spring physics motion", "staggered entrance", or "choreograph animations".
version: 0.1.0
---

# Advanced Web Motion & Framer Motion Mastery

Modern luxury web animation is not about bouncing novelties—it is about physical presence, spatial continuity, and tactile weight. Every motion must reinforce the user's mental model of where surfaces and objects exist in space.

---

## 1. The Core Motion Philosophy: Tactile Physics

- **Never use linear easing** for visual UI elements. Use physical springs or asymmetric cubics.
- **Asymmetric Timing**:
  - Entrances: Faster, snappy deceleration (`cubic-bezier(0.16, 1, 0.3, 1)` or spring `damping: 28, stiffness: 260`).
  - Exits: Quieter, faster acceleration out of view (`cubic-bezier(0.7, 0, 0.84, 0)`).
- **Scale Bounds**: Micro-scale down on press (`scale: 0.98`), gentle lift on hover (`y: -2px` to `-4px`), never exaggerated zooms.

---

## 2. Spring Physics Tokens

```typescript
export const MOTION_SPRINGS = {
  // Snappy for buttons, toggles, icon micro-interactions
  snappy: { type: "spring", stiffness: 400, damping: 30, mass: 0.8 },
  // Smooth for card lifts, drawers, and modal transitions
  smooth: { type: "spring", stiffness: 260, damping: 28, mass: 1 },
  // Heavy for luxury spatial panels and monolithic furniture cards
  monolith: { type: "spring", stiffness: 180, damping: 24, mass: 1.2 },
} as const;
```

---

## 3. Shared Element Transitions (`layoutId`)

When expanding a product card into a detailed view, use `layoutId` to morph the container continuously:

```tsx
import { motion, AnimatePresence } from "motion/react";

export function ProductCardExpansion({ product, isSelected, onSelect }) {
  return (
    <motion.div
      layoutId={`product-container-${product.id}`}
      className="card"
      onClick={onSelect}
      transition={MOTION_SPRINGS.smooth}
    >
      <motion.img
        layoutId={`product-image-${product.id}`}
        src={product.image}
        alt={product.name}
      />
      <motion.h3 layoutId={`product-title-${product.id}`}>
        {product.name}
      </motion.h3>
    </motion.div>
  );
}
```

---

## 4. Staggered Entrance Choreography

When rendering grids or lists, avoid popping everything into view simultaneously:

```tsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
};
```

---

## 5. CSS Scroll-Driven Animation (Zero JS Main-Thread Overhead)

For background parallax and scroll progress bars, prefer native modern CSS `@supports (animation-timeline: scroll())`:

```css
@keyframes parallax-lift {
  from { transform: translateY(0); }
  to { transform: translateY(-40px); }
}

.heroVisual {
  animation: parallax-lift linear both;
  animation-timeline: scroll(root);
  animation-range: entry 0% exit 100%;
}
```

---

## 6. Accessibility & Reduced Motion

Always respect `prefers-reduced-motion`:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```
In Framer Motion:
```tsx
import { useReducedMotion } from "motion/react";
const shouldReduceMotion = useReducedMotion();
const transition = shouldReduceMotion ? { duration: 0 } : MOTION_SPRINGS.smooth;
```
