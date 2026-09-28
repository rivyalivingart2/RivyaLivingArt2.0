---
name: nextjs-app-router-perf
description: Maximize Next.js App Router performance, streaming SSR, React Server Components (RSC) optimization, and dynamic bundle splitting. Use when asked to "optimize Next.js app", "reduce bundle size", "fix slow server components", "improve streaming SSR", or "optimize RSC boundaries".
version: 0.1.0
---

# Next.js App Router Performance & RSC Architecture

In Next.js App Router, the single most critical performance architectural principle is **pushing client components down to the leaf nodes of the component tree**.

---

## 1. The Leaf Component Boundary Rule

**Anti-pattern**: Adding `'use client'` at the top of a page layout or container component. This forces every single child component, along with all imported libraries, into the client JavaScript bundle.

**Best Practice**: Keep layouts, pages, and data-fetching containers as pure Server Components. Only mark individual interactive buttons, accordions, and dialog triggers with `'use client'`.

```tsx
// app/pieces/[slug]/page.tsx (Server Component)
import { ProductGallery } from "@/components/shop/product-gallery"; // Client Leaf
import { CustomizationTrigger } from "@/components/shop/customization-trigger"; // Client Leaf
import { getProductData } from "@/lib/catalogue";

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProductData(slug);

  return (
    <article>
      {/* Server-rendered static metadata & markup */}
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      
      {/* Interactive client leaves */}
      <ProductGallery images={product.gallery} />
      <CustomizationTrigger productId={product.id} />
    </article>
  );
}
```

---

## 2. Dynamic Code Splitting (`next/dynamic`)

Heavy client-side libraries (such as rich text editors like Tiptap, Canvas/WebGL engines, chart libraries, and modal dialogs) should **never** be included in the initial page bundle.

```tsx
import dynamic from "next/dynamic";

// Dynamically import heavy Studio editor components
const RichTextComposer = dynamic(
  () => import("@/components/studio/rich-text-composer").then(mod => mod.RichTextComposer),
  {
    ssr: false,
    loading: () => <div className="editorSkeleton" aria-busy="true" />
  }
);
```

---

## 3. Streaming SSR with `<Suspense>`

Don't let slow secondary database or API calls block the rendering of the primary UI. Wrap secondary components in `<Suspense>`:

```tsx
import { Suspense } from "react";
import { RelatedProductsList } from "./related-products";
import { RelatedProductsSkeleton } from "./skeletons";

export default function ProductDetail({ product }) {
  return (
    <main>
      <ProductHero product={product} />
      
      {/* Streams in after hero renders immediately */}
      <Suspense fallback={<RelatedProductsSkeleton />}>
        <RelatedProductsList category={product.category} currentId={product.id} />
      </Suspense>
    </main>
  );
}
```

---

## 4. Route Segment Config Optimization

For pages that change infrequently, take advantage of static caching or Incremental Static Regeneration (ISR):

```typescript
// Revalidate every 1 hour (3600 seconds)
export const revalidate = 3600;
export const dynamic = "error"; // Guarantees page remains static
```
