# Component: Toast

> Brief. Affirming. Then gone.

---

## Overview

Toast provides transient feedback after state transitions (todo created, completed, or deleted). It slides up from the bottom of the viewport, displays for 3 seconds, then slides out. Toasts are non-interactive and purely informational.

---

## Variants

| Variant | Text | Glow Color |
|---------|------|-----------|
| **Created** | "Locked in. Focus on this." | Neon cyan |
| **Completed** | "Done. What's next?" | Success green |
| **Deleted** | "Dropped. Fresh start." | Neon cyan |

---

## States

| State | Visual |
|-------|--------|
| **Entering** | Slides up from bottom, scales 0.95 → 1, fades in |
| **Visible** | Static with subtle glow |
| **Exiting** | Slides down, scales → 0.95, fades out |

---

## Structure

```html
<div class="toast-region" aria-live="assertive" aria-atomic="true">
  <div class="toast toast-success" role="status">
    <span class="toast-text">Done. What's next?</span>
  </div>
</div>
```

---

## CSS

```css
.toast-region {
  position: fixed;
  bottom: var(--space-6);
  left: 50%;
  transform: translateX(-50%);
  z-index: var(--z-toast);
  pointer-events: none;
}

.toast {
  display: inline-flex;
  align-items: center;
  padding: var(--space-3) var(--space-5);
  background-color: var(--color-surface);
  background-image:
    repeating-linear-gradient(
      145deg,
      transparent,
      transparent 2px,
      #FFFFFF02 2px,
      #FFFFFF02 3px
    );
  border: 1px solid var(--color-border-strong);
  border-top-color: #FFFFFF18;
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-toast);
  color: var(--color-text-primary);
  font-size: var(--text-small);
  font-weight: 500;
  white-space: nowrap;
}

.toast.entering {
  animation: toast-enter var(--duration-normal) var(--ease-spring) forwards;
}

.toast.exiting {
  animation: toast-exit var(--duration-fast) var(--ease-in) forwards;
}

/* Variant glows */
.toast-neon {
  box-shadow: var(--shadow-toast), 0 0 20px #00F0FF22;
  border-color: #00F0FF22;
}

.toast-success {
  box-shadow: 4px 6px 24px #00000080, 0 0 20px #00FF8822;
  border-color: #00FF8822;
}

/* Animations */
@keyframes toast-enter {
  from {
    opacity: 0;
    transform: translateY(100%) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes toast-exit {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(100%) scale(0.95);
  }
}
```

---

## Behavior

| Property | Value |
|----------|-------|
| Duration visible | 3000ms |
| Enter animation | 300ms, spring easing |
| Exit animation | 200ms, ease-in |
| Position | Fixed, bottom center |
| Stacking | Only one toast at a time (queue if needed) |
| Interaction | Non-interactive (`pointer-events: none`) |
| Auto-dismiss | Yes, after 3s |

---

## Timing Sequence

```
0ms      → Toast enters (300ms animation)
300ms    → Toast visible (static)
3000ms   → Toast exit begins (200ms animation)
3200ms   → Toast removed from DOM
```

---

## Accessibility

- `aria-live="assertive"` on region — screen readers announce immediately
- `aria-atomic="true"` — the full toast text is announced, not partial updates
- `role="status"` on toast element
- Non-interactive — no focus management needed
- Duration is long enough to read (3s minimum)
- `prefers-reduced-motion`: Enter/exit instant (0.01ms)
