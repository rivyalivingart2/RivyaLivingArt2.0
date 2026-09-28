---
name: clean-code-architecture
description: Architect maintainable, modular, and scalable full-stack Next.js/React codebases. Use when asked to "refactor code structure", "improve clean architecture", "separate concerns", "organize component folders", or "eliminate duplicated code".
version: 0.1.0
---

# Clean Code Architecture & Component Modularity

Scalable frontends thrive when business logic, data persistence, and presentation are strictly decoupled.

---

## 1. The Container vs Presentational Component Pattern

- **Presentational Components (Dumb/Pure)**:
  - Accept typed props.
  - Return JSX and CSS module classes.
  - Have zero knowledge of database schemas, session auth, or HTTP routes.
  - Easy to unit test and visually audit.

- **Container Components (Smart/Controllers)**:
  - Manage state, query data, handle routing.
  - Pass handlers and data down to pure presentational components.

```
components/
├── shop/
│   ├── product-card.tsx       # Pure presentation
│   ├── product-gallery.tsx    # Pure presentation
│   ├── product-card.module.css
│   └── catalogue-browser.tsx  # Smart filter/state container
```

---

## 2. Single Source of Truth for Domain Types & Contracts

Never redeclare object shapes ad-hoc across multiple files. Centralize domain schemas:

```typescript
// src/lib/types/catalogue.ts
export type ProductTier = "LARGE" | "MEDIUM" | "SMALL";

export interface ProductConcept {
  id: string;
  slug: string;
  name: string;
  tier: ProductTier;
  category: string;
  dimensions: string;
  priceType: "ON_REQUEST" | "STARTING_FROM" | "FIXED";
  image: string;
  scene?: string;
}
```

---

## 3. Co-location Principle

Keep related files together:
- A component's stylesheet (`component.module.css`) sits next to its `.tsx`.
- Component unit tests (`component.test.tsx`) sit next to the component.
- Do not create a separate monolithic `styles/` folder containing hundreds of disconnected CSS files.

---

## 4. Custom Hooks for Complex State Machines

If a component has more than 3-4 `useState` calls managing an interactive workflow (such as multi-step customization or Studio drafts), extract the logic into a typed custom hook:

```typescript
export function useProductDraft(initialProduct: ProductConcept) {
  const [draft, setDraft] = useState(initialProduct);
  const [isDirty, setIsDirty] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = useCallback((field: keyof ProductConcept, value: any) => {
    setDraft(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  }, []);

  return { draft, isDirty, errors, updateField, reset: () => setDraft(initialProduct) };
}
```
