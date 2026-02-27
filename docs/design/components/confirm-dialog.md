# Component: ConfirmDialog

> A frosted-glass moment of deliberation.

---

## Overview

The ConfirmDialog is a modal overlay used for the delete confirmation flow. It consists of a frosted-glass card centered over a dark backdrop. The dialog implements a focus trap and responds to Escape key.

The glass material is deliberately chosen for this component — it keeps the active todo visible (but blurred) behind the dialog, maintaining spatial context. The user can see what they're about to delete, creating a stronger emotional connection to the decision.

---

## Variants

| Variant | Usage |
|---------|-------|
| **Delete Confirmation** | Only variant in v1. Could be extended for other confirmations. |

---

## States

| State | Visual |
|-------|--------|
| **Opening** | Backdrop fades in (200ms), dialog slides up + scales in (300ms, spring) |
| **Open** | Static — glass material, floating shadow, full interaction |
| **Closing (cancel)** | Dialog slides down + fades, backdrop fades |
| **Closing (confirm)** | Dialog fades + scales down, backdrop fades, then parent screen transitions |

---

## Structure

```html
<!-- Backdrop -->
<div class="confirm-backdrop" aria-hidden="true"></div>

<!-- Dialog -->
<div
  class="confirm-dialog"
  role="alertdialog"
  aria-modal="true"
  aria-labelledby="confirm-title"
  aria-describedby="confirm-desc"
>
  <h2 id="confirm-title" class="confirm-headline text-debossed">
    Let this one go?
  </h2>
  <p id="confirm-desc" class="confirm-body">
    It won't be marked as done.
  </p>
  <div class="confirm-actions">
    <button class="btn btn-primary" aria-label="Cancel delete">
      Keep it
    </button>
    <button class="btn btn-danger" aria-label="Confirm delete">
      Yes, drop it
    </button>
  </div>
</div>
```

---

## CSS

```css
/* Backdrop */
.confirm-backdrop {
  position: fixed;
  inset: 0;
  background: #0A0A0FCC;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: var(--z-overlay);
}

.confirm-backdrop.entering {
  animation: backdrop-enter var(--duration-fast) var(--ease-out) forwards;
}

.confirm-backdrop.exiting {
  animation: backdrop-exit var(--duration-fast) var(--ease-in) forwards;
}

/* Dialog */
.confirm-dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: calc(100% - var(--space-8));
  max-width: 360px;
  padding: var(--space-6);
  background: #12121ACC;
  backdrop-filter: blur(24px) saturate(1.2);
  -webkit-backdrop-filter: blur(24px) saturate(1.2);
  border: 1px solid #FFFFFF10;
  border-top-color: #FFFFFF18;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-floating);
  z-index: var(--z-modal);
  text-align: center;
}

.confirm-dialog.entering {
  animation: dialog-enter var(--duration-normal) var(--ease-spring) forwards;
  animation-delay: 50ms;
}

.confirm-dialog.exiting {
  animation: dialog-exit var(--duration-fast) var(--ease-in) forwards;
}

/* Content */
.confirm-headline {
  font-size: var(--text-title);
  font-weight: 700;
  color: var(--color-text-primary);
  text-shadow: 0 2px 4px #00000080, 0 -1px 0 #FFFFFF08;
}

.confirm-body {
  margin-top: var(--space-2);
  font-size: var(--text-body);
  color: var(--color-text-secondary);
}

.confirm-actions {
  display: flex;
  gap: var(--space-3);
  margin-top: var(--space-6);
}

.confirm-actions .btn {
  flex: 1;
}

/* Animations */
@keyframes backdrop-enter {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes backdrop-exit {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes dialog-enter {
  from {
    opacity: 0;
    transform: translate(-50%, calc(-50% + 16px)) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

@keyframes dialog-exit {
  from {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  to {
    opacity: 0;
    transform: translate(-50%, calc(-50% + 8px)) scale(0.98);
  }
}

/* Mobile: stack buttons with safe action on top */
@media (max-width: 639px) {
  .confirm-actions {
    flex-direction: column-reverse;
  }
}
```

---

## Focus Management

```
1. On mount:
   - Store document.activeElement as previousFocus
   - Move focus to first button ("Keep it" — safe action)

2. While open:
   - Trap focus: Tab/Shift+Tab cycle within dialog only
   - Escape key → cancelDelete()

3. On unmount:
   - Restore focus to previousFocus
   - If todo was deleted, focus goes to input field (empty state)
```

---

## Responsive

| Breakpoint | Width | Buttons |
|-----------|-------|---------|
| Mobile (< 640px) | `calc(100% - 32px)` | Stacked (column-reverse: Keep it on top) |
| Tablet+ (≥ 640px) | max 360px | Side by side (row) |

---

## Accessibility

- `role="alertdialog"` — screen readers announce as alert dialog
- `aria-modal="true"` — indicates modal behavior
- `aria-labelledby` → headline element
- `aria-describedby` → body text element
- Focus trapped within dialog
- Escape key dismisses (same as cancel)
- Backdrop click dismisses (same as cancel)
