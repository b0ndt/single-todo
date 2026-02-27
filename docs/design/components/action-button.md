# Component: ActionButton

> Every tap has weight.

---

## Overview

ActionButton is the reusable button component used across all screens. It supports multiple visual variants (primary/neon, success, danger, ghost) and states. All buttons share the same structural base and interaction physics.

---

## Variants

| Variant | Usage | Border | Text Color | Glow |
|---------|-------|--------|-----------|------|
| **Primary (Neon)** | "Lock it in", "Keep it" | `--color-neon-20` | `--color-neon` | Neon |
| **Success** | "Done" | `#00FF8833` | `--color-success` | Green |
| **Danger** | "Yes, drop it" | `--color-border` → `#FF336644` on hover | `--color-text-secondary` → `--color-danger` on hover | Red (hover only) |
| **Ghost** | "Drop it" | `--color-border` | `--color-text-secondary` | None → Red on hover |

---

## States

| State | Transform | Shadow | Border |
|-------|-----------|--------|--------|
| **Default** | `none` | Variant-specific idle | Variant-specific |
| **Hover** | `translateY(-1px)` | Variant-specific hover glow | Intensified |
| **Active/Pressed** | `translateY(0)` | `--shadow-inset` + variant glow | Intensified |
| **Focus-visible** | `none` | `--glow-focus` | `2px solid --color-neon` outline |
| **Disabled** | `none` | `none` | `--color-border` | Opacity 0.4 |

---

## CSS

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  min-height: 48px;
  min-width: 44px;
  border-radius: var(--radius-sm);
  font-family: var(--font-sans);
  font-size: var(--text-body);
  font-weight: 600;
  line-height: 1;
  text-decoration: none;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  transition:
    box-shadow var(--duration-fast) ease,
    border-color var(--duration-fast) ease,
    color var(--duration-instant) ease,
    background-color var(--duration-instant) ease,
    transform var(--duration-fast) var(--ease-spring);
}

.btn:focus-visible {
  outline: 2px solid var(--color-neon);
  outline-offset: 3px;
  box-shadow: var(--glow-focus);
}

.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

/* --- Primary (Neon) --- */
.btn-primary {
  background: var(--color-surface-raised);
  border: 1px solid var(--color-neon-20);
  color: var(--color-neon);
  box-shadow: var(--glow-idle);
}

.btn-primary:hover:not(:disabled) {
  background: #00F0FF0D;
  border-color: var(--color-neon-40);
  box-shadow: var(--glow-hover);
  transform: translateY(-1px);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: var(--shadow-inset), var(--glow-focus);
}

/* --- Success --- */
.btn-success {
  background: var(--color-surface-raised);
  border: 1px solid #00FF8833;
  color: var(--color-success);
  box-shadow: 0 0 8px #00FF8811;
}

.btn-success:hover:not(:disabled) {
  background: #00FF8811;
  border-color: #00FF8866;
  box-shadow: 0 0 16px #00FF8833, 0 0 40px #00FF8811;
  transform: translateY(-1px);
}

.btn-success:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: var(--shadow-inset), 0 0 20px #00FF8866, 0 0 60px #00FF8822;
}

/* --- Danger --- */
.btn-danger {
  background: var(--color-surface-raised);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
}

.btn-danger:hover:not(:disabled) {
  border-color: #FF336644;
  color: var(--color-danger);
  box-shadow: 0 0 16px #FF336633, 0 0 40px #FF336611;
  transform: translateY(-1px);
}

.btn-danger:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: var(--shadow-inset), 0 0 20px #FF336666, 0 0 60px #FF336622;
}

/* --- Ghost --- */
.btn-ghost {
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
}

.btn-ghost:hover:not(:disabled) {
  background: var(--color-surface-hover);
  border-color: #FF336644;
  color: var(--color-danger);
  box-shadow: 0 0 16px #FF336633, 0 0 40px #FF336611;
  transform: translateY(-1px);
}

.btn-ghost:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: var(--shadow-inset);
}

/* --- Icon inside button --- */
.btn svg {
  width: 20px;
  height: 20px;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
  flex-shrink: 0;
}
```

---

## Size Variants

| Size | Padding | Min-Height | Font-Size |
|------|---------|------------|-----------|
| **Default** | `12px 16px` | 48px | 16px |
| **Small** (future) | `8px 12px` | 36px | 14px |

---

## Responsive

On mobile (< 640px), when buttons are in a row that overflows, they should stack vertically with full width. This is handled by the parent container (`.action-row`), not the button itself.

---

## Accessibility

- Minimum 48×44px touch target
- `aria-label` required when button text is icon-only
- `:focus-visible` ring with `--color-neon`
- `:disabled` state: `opacity: 0.4`, `cursor: not-allowed`
- No `tabindex` manipulation — natural DOM order
