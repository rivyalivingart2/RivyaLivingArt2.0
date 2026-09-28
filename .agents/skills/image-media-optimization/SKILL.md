---
name: image-media-optimization
description: Optimize responsive imagery, WebP/AVIF compression, LQIP blur-up placeholders, aspect ratio containers, and priority loading. Use when asked to "optimize images", "fix blurry or heavy images", "add blur placeholder", "prevent image CLS", or "speed up photo galleries".
version: 0.1.0
---

# Image & Media Optimization Mastery

For a high-end atelier like RivyaLivingArt, images are the primary product. High visual fidelity must be balanced with instantaneous load times and zero Cumulative Layout Shift.

---

## 1. The Optical Aspect Ratio Container

Never let an image render without an explicit container holding its exact aspect ratio:

```css
/* Product Catalogue: Luxury 4:5 Portrait */
.portraitFrame {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  border-radius: 3px;
  background-color: var(--surface-card); /* Prevents white flashes */
}

/* Interior Editorial: Cinematic 16:9 Landscape */
.cinematicFrame {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: 4px;
}
```

---

## 2. Accurate Responsive `sizes` Attribute

Without an explicit `sizes` attribute, Next.js / browsers assume images are `100vw` wide and download massive desktop images onto mobile devices.

```tsx
// 3-Column Catalogue Grid:
<Image
  src={product.image}
  alt={product.name}
  fill
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  className="object-cover"
/>

// 2-Column Detail Gallery:
<Image
  src={product.scene}
  alt={`${product.name} interior`}
  fill
  sizes="(max-width: 768px) 100vw, 55vw"
  className="object-cover"
/>
```

---

## 3. High-Fidelity Blur-Up Placeholders (LQIP)

Use low-quality inline SVG or base64 blur placeholders so the layout is instantly warm and visually stable before high-res photography arrives:

```tsx
const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#08111d" offset="20%" />
      <stop stop-color="#15243b" offset="50%" />
      <stop stop-color="#08111d" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#08111d" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

export const blurDataURL = `data:image/svg+xml;base64,${toBase64(shimmer(700, 875))}`;
```

---

## 4. Offscreen Lazy-Loading vs Hero Eager Priority

- **Above the fold (Hero, Main Product Display)**:
  `priority={true}`, `fetchPriority="high"`, `loading="eager"`
- **Below the fold (Related Products, Testimonials, Footer)**:
  `loading="lazy"`, `decoding="async"`
