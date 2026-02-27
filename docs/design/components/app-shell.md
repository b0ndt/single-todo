# Component: AppShell

> The stage. Everything lives inside it.

---

## Overview

The AppShell is the root layout component. It provides the viewport container, background material, centering, and responsive padding. Every screen renders inside the AppShell. The void background is not flat — it has subtle radial gradients that create a concave depth illusion, as if the screen itself is a dimly lit chamber.

---

## Variants

| Variant | Usage |
|---------|-------|
| **Default** | Single variant — always rendered |

---

## States

| State | Visual |
|-------|--------|
| Default | Deep black void background with subtle radial gradient vignetting |

---

## Structure

```html
<div class="app-shell" role="main" aria-label="single-todo">
  <header class="app-header">
    <!-- Logo component -->
  </header>
  <main class="app-content">
    <!-- Screen content (Empty / Active / ConfirmDelete) -->
  </main>
  <div class="toast-region" aria-live="assertive" aria-atomic="true">
    <!-- Toast component (when visible) -->
  </div>
</div>
```

---

## CSS

```css
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-family: var(--font-sans);
  font-size: 16px;
  line-height: 1.5;
  color: var(--color-text-primary);
  background: var(--color-void);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  min-height: 100vh;
  min-height: 100dvh;
  background: var(--color-void);
}

.app-shell {
  width: 100%;
  max-width: 480px;
  min-height: 100vh;
  min-height: 100dvh;
  margin: 0 auto;
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  background-color: var(--color-void);
  background-image:
    radial-gradient(ellipse at 30% 20%, #12121A 0%, transparent 50%),
    radial-gradient(ellipse at 70% 80%, #0D0D15 0%, transparent 40%);
}

.app-header {
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: var(--space-12);
  flex-shrink: 0;
}

.app-content {
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.toast-region {
  position: fixed;
  bottom: var(--space-6);
  left: 50%;
  transform: translateX(-50%);
  z-index: var(--z-toast);
  pointer-events: none;
}

@media (min-width: 640px) {
  .app-shell {
    padding: var(--space-8);
  }
}

@media (min-width: 1024px) {
  .app-shell {
    padding: var(--space-16);
  }
}
```

---

## Material Detail

The void background uses two offset radial gradients:
- **Top-left ellipse** (30% 20%): Lighter (#12121A) — simulates light from the 145° source
- **Bottom-right ellipse** (70% 80%): Slightly lighter (#0D0D15) — ambient bounce light

Together they create a barely-visible depth field that prevents the background from being dead flat.

---

## Responsive

| Breakpoint | Padding | Max-Width |
|-----------|---------|-----------|
| Mobile (< 640px) | 16px | 480px |
| Tablet (≥ 640px) | 32px | 480px |
| Desktop (≥ 1024px) | 64px | 480px |

---

## Accessibility

- `role="main"` on shell (or use `<main>`)
- `aria-label="single-todo"` for screen reader identification
- Toast region: `aria-live="assertive"`, `aria-atomic="true"`
