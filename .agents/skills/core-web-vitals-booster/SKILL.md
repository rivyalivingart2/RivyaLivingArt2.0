---
name: core-web-vitals-booster
description: Audit and optimize Core Web Vitals (CWV) including LCP (Largest Contentful Paint < 1.2s), INP (Interaction to Next Paint < 100ms), and CLS (Cumulative Layout Shift < 0.02). Use when asked to "speed up page load", "fix layout shifts", "improve INP or LCP", "optimize Core Web Vitals", or "eliminate slow render bottlenecks".
version: 0.1.0
---

# Core Web Vitals Booster (LCP, INP, CLS)

Core Web Vitals determine whether an online experience feels instantaneous or frustratingly sluggish. This skill provides concrete code patterns to achieve green Lighthouse 100 scores.

---

## 1. Largest Contentful Paint (LCP < 1.2s)

LCP is almost always the hero image or primary typography element.

### Rule 1: High Priority Fetch
Never lazy-load the above-the-fold hero:
```tsx
// Next.js Image
<Image
  src={heroImage}
  alt="Rivya Riverline dining table"
  priority
  fetchPriority="high"
  sizes="(max-width: 768px) 100vw, 1200px"
  loading="eager"
/>
```

### Rule 2: Preconnect to Image & Asset CDNs
```html
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="dns-prefetch" href="https://fonts.googleapis.com" />
```

### Rule 3: Zero Render-Blocking Resources
- Critical CSS should be inlined.
- Heavy non-critical scripts must use `defer` or `next/script` with `strategy="afterInteractive"`.

---

## 2. Interaction to Next Paint (INP < 100ms)

INP measures how responsive the UI feels when the user clicks, taps, or types.

### Rule 1: Yield to the Main Thread via `scheduler.yield()`
When processing large arrays (e.g., filtering 278 catalogue items or sorting Studio tables):
```typescript
async function processLargeList<T>(items: T[], fn: (item: T) => void) {
  for (let i = 0; i < items.length; i++) {
    fn(items[i]);
    // Yield every 50 items so user clicks and animations don't stutter
    if (i % 50 === 0 && 'scheduler' in window && 'yield' in window.scheduler) {
      await window.scheduler.yield();
    }
  }
}
```

### Rule 2: Optimistic UI Updates
Never wait for a server response before updating visual UI state:
```tsx
const [optimisticStatus, setOptimisticStatus] = useOptimistic(order.status);
```

---

## 3. Cumulative Layout Shift (CLS < 0.02)

CLS occurs when elements unexpectedly jump while images, fonts, or ads load.

### Rule 1: Explicit Aspect Ratios on All Media Containers
```css
.cardVisualWrapper {
  aspect-ratio: 4 / 5;
  width: 100%;
  position: relative;
  background: var(--surface-card); /* Skeleton surface prevents empty flash */
}
```

### Rule 2: Zero Layout-Shift Typography
Use `next/font/google` or `next/font/local` with fallback font-metrics overrides (`size-adjust`, `ascent-override`) to ensure font swapping causes 0px layout shift.

### Rule 3: Reserve Space for Dynamic Elements
Always reserve height for banners, alerts, and notifications so the content below does not shift down when they appear.
```css
.bannerSlot {
  min-height: 48px;
  contain: layout;
}
```
