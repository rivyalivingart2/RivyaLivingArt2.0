---
name: memory-leak-prevention
description: Detect, prevent, and debug JavaScript memory leaks, dangling event listeners, unmounted React state updates, and observer cleanup in single-page apps. Use when asked to "fix memory leak", "clean up event listeners", "prevent high memory usage", or "profile browser heap".
version: 0.1.0
---

# Memory Leak Prevention & Lifecycle Hygiene

In high-interaction web applications with galleries, filters, drawers, and admin data tables, memory leaks accumulate quietly over user sessions, causing jank, dropped frames, and mobile crashes.

---

## 1. The Golden Rule of `useEffect` Cleanup

Every resource created inside a React effect must have an explicit destruction / cleanup counterpart:

```tsx
useEffect(() => {
  const controller = new AbortController();

  async function fetchData() {
    try {
      const res = await fetch("/api/studio/products", { signal: controller.signal });
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error(err);
      }
    }
  }

  fetchData();

  // Crucial: Abort in-flight requests on unmount
  return () => {
    controller.abort();
  };
}, []);
```

---

## 2. Observer Lifecycle (`IntersectionObserver`, `ResizeObserver`)

Dangling observer instances will retain references to detached DOM nodes, preventing garbage collection:

```tsx
useEffect(() => {
  if (!containerRef.current) return;

  const observer = new ResizeObserver((entries) => {
    for (const entry of entries) {
      setWidth(entry.contentRect.width);
    }
  });

  observer.observe(containerRef.current);

  return () => {
    observer.disconnect(); // Must disconnect on unmount
  };
}, []);
```

---

## 3. Window & Document Global Event Listeners

Always remove global listeners (keydown, resize, scroll) when components unmount:

```tsx
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  };

  window.addEventListener("keydown", handleKeyDown);
  
  return () => {
    window.removeEventListener("keydown", handleKeyDown);
  };
}, [onClose]);
```

---

## 4. Timers & Animation Frame Loops (`requestAnimationFrame`)

```tsx
useEffect(() => {
  let frameId: number;

  const loop = () => {
    // Animation work
    frameId = requestAnimationFrame(loop);
  };
  frameId = requestAnimationFrame(loop);

  return () => {
    cancelAnimationFrame(frameId);
  };
}, []);
```
