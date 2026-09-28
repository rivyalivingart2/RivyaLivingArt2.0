---
name: studio-admin-ux
description: Design and implement high-efficiency administrative panels, tactile data tables, keyboard shortcuts, optimistic state mutations, and dense workflow ergonomics. Use when asked to "improve admin panel", "design dashboard UX", "add keyboard shortcuts", "build data table with sorting and filtering", or "make CMS feel snappy".
version: 0.1.0
---

# Studio Admin Panel Ergonomics & Command Center UX

An administrative workspace or CMS requires completely different UX rules than a public marketing storefront. The goal of an admin panel is speed, dense clarity, high tactile keyboard efficiency, and error prevention.

---

## 1. Information Density & Tabular Numerics

- Use compact vertical rhythm (`min-height: 38px–44px` per table row).
- Numbers (prices, dimensions, dates, counts) must **always** use `font-variant-numeric: tabular-nums` to line up vertically down columns.
- Text aligns left; numbers and financial amounts align right.

```css
.studioTable td.numeric {
  text-align: right;
  font-variant-numeric: tabular-nums;
  font-family: var(--font-mono, monospace);
}
```

---

## 2. Command Palette & Keyboard Shortcuts

Power users should be able to navigate and execute actions without touching the mouse:

```tsx
import { useEffect } from "react";

export function useAdminShortcuts({ onSearch, onSave, onNew }) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      
      // Cmd+K: Open quick search / command palette
      if (isCmdOrCtrl && e.key === "k") {
        e.preventDefault();
        onSearch();
      }
      // Cmd+S: Quick save draft
      if (isCmdOrCtrl && e.key === "s") {
        e.preventDefault();
        onSave();
      }
      // Cmd+N: New product or article
      if (isCmdOrCtrl && e.key === "n") {
        e.preventDefault();
        onNew();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSearch, onSave, onNew]);
}
```

---

## 3. Optimistic Mutations with Automatic Rollback

In Studio (saving product drafts, publishing articles, archiving inquiries):
1. Immediately update the UI state.
2. Send network request in the background.
3. If network fails, roll back state and display a clear toast with a "Retry" button.

```tsx
async function handleStatusChange(productId: string, newStatus: string) {
  const previousStatus = products.find(p => p.id === productId)?.status;
  
  // Optimistic update
  setProducts(prev => prev.map(p => p.id === productId ? { ...p, status: newStatus } : p));

  try {
    const res = await fetch(`/api/studio/products/${productId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: newStatus }),
    });
    if (!res.ok) throw new Error("Update failed");
  } catch (err) {
    // Rollback
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, status: previousStatus } : p));
    showToast({ title: "Failed to update status", action: "Retry" });
  }
}
```

---

## 4. Status Badges & Visual Scannability

Do not use decorative rainbow colors for statuses. Keep a strict, low-cognitive-load palette:
- **Published / Live**: Emerald glow (`#10b981` on subtle green background)
- **Draft / In Review**: Amber/bronze (`#d97706` on subtle amber background)
- **Archived / Inactive**: Neutral muted slate (`#64748b`)
- **Error / Attention Required**: Crimson warning (`#ef4444`)
