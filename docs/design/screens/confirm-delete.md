# Screen: Confirm Delete

> A moment of pause before letting go.

**State:** `{ status: "confirm-delete", todo: { text, createdAt } }`
**Route:** `/` (overlay on Active Todo)
**Trigger:** User taps "Drop it" on Active Todo screen.

---

## 1. Layout

```
┌─────────────────────────────────────┐
│                                     │
│        ░░ Backdrop Overlay ░░       │  ← 70% opacity dark
│                                     │
│        ┌───────────────────┐        │
│        │                   │        │
│        │  "Let this one    │        │  ← Dialog headline
│        │       go?"        │        │
│        │                   │        │
│        │  "It won't be     │        │  ← Supporting text
│        │   marked as done."│        │
│        │                   │        │
│        │  ┌─────┐ ┌─────┐ │        │  ← Action buttons
│        │  │Keep │ │Yes,  │ │        │
│        │  │ it  │ │drop  │ │        │
│        │  │     │ │ it   │ │        │
│        │  └─────┘ └─────┘ │        │
│        │                   │        │
│        └───────────────────┘        │
│                                     │
│    (Active Todo card visible        │
│     but dimmed behind overlay)      │
│                                     │
└─────────────────────────────────────┘
```

### Dialog Position

- **Vertically:** Centered in viewport
- **Horizontally:** Centered, max-width 360px
- **Padding:** `--space-6` (24px) all sides

---

## 2. Materials & Surfaces

| Element | Material | CSS Class |
|---------|----------|-----------|
| Backdrop | Dark overlay | `background: #0A0A0FCC` (80% opacity void) |
| Dialog card | Glass | `.material-glass` + `--shadow-floating` |
| Active todo (behind) | Same as Active screen, but dimmed | `filter: brightness(0.4) blur(2px)` |

The glass material is the hero here. The frosted-glass card floats above the dimmed content, catching the 145° light on its top border. The backdrop blur creates a cinematic depth-of-field effect — the todo behind is still visible but defocused, maintaining spatial context.

---

## 3. Component Specifications

### 3.1 Backdrop

```css
.confirm-backdrop {
  position: fixed;
  inset: 0;
  background: #0A0A0FCC;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: var(--z-overlay);
  animation: backdrop-enter var(--duration-fast) var(--ease-out) forwards;
}
```

### 3.2 Dialog Card

```css
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
  animation: dialog-enter var(--duration-normal) var(--ease-spring) forwards;
}
```

### 3.3 Headline

- **Text:** "Let this one go?"
- **Style:** `--text-title` (24px), weight 700, `.text-debossed`
- **Color:** `--color-text-primary`
- **Alignment:** Center

### 3.4 Supporting Text

- **Text:** "It won't be marked as done."
- **Style:** `--text-body` (16px), weight 400
- **Color:** `--color-text-secondary`
- **Alignment:** Center
- **Spacing:** `--space-2` below headline

### 3.5 Action Buttons

Two buttons, side by side. **"Keep it" is primary** (safe action), **"Yes, drop it" is destructive**.

```css
.confirm-actions {
  display: flex;
  gap: var(--space-3);
  margin-top: var(--space-6);
}

/* Keep it (Cancel) — the safe action, visually primary */
.btn-keep {
  flex: 1;
  padding: var(--space-3) var(--space-4);
  min-height: 48px;
  border-radius: var(--radius-sm);
  background: var(--color-surface-raised);
  border: 1px solid var(--color-neon-20);
  color: var(--color-neon);
  font-size: var(--text-body);
  font-weight: 600;
  cursor: pointer;
  box-shadow: var(--glow-idle);
  transition: var(--transition-glow), var(--transition-color), var(--transition-transform);
}

.btn-keep:hover {
  background: #00F0FF0D;
  border-color: var(--color-neon-40);
  box-shadow: var(--glow-hover);
  transform: translateY(-1px);
}

/* Yes, drop it (Confirm delete) — muted, only glows red on hover */
.btn-confirm-drop {
  flex: 1;
  padding: var(--space-3) var(--space-4);
  min-height: 48px;
  border-radius: var(--radius-sm);
  background: var(--color-surface-raised);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  font-size: var(--text-body);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-glow), var(--transition-color), var(--transition-transform);
}

.btn-confirm-drop:hover {
  border-color: #FF336644;
  color: var(--color-danger);
  box-shadow: var(--glow-danger-hover);
  transform: translateY(-1px);
}

.btn-confirm-drop:active {
  transform: translateY(0);
  box-shadow: var(--shadow-inset), var(--glow-danger-focus);
}
```

**Design intent:** The safe action ("Keep it") gets the neon glow treatment. The destructive action is deliberately subdued. This reverses the typical modal pattern where "Confirm" is primary — here, keeping the todo is the encouraged path.

---

## 4. States

| State | Visual Change |
|-------|--------------|
| **Default** | Dialog visible with glass material, backdrop active |
| **Hover: Keep it** | Neon glow intensifies, slight lift |
| **Hover: Yes, drop it** | Red glow appears, text turns red, slight lift |
| **Active: Keep it** | Pressed (inset), neon glow |
| **Active: Yes, drop it** | Pressed (inset), red glow |
| **Focus-visible: any button** | Neon cyan outline + glow |
| **Escape pressed** | Same as "Keep it" — dialog dismisses |

---

## 5. Responsive Behavior

| Breakpoint | Changes |
|-----------|---------|
| **Mobile (< 640px)** | Dialog: width `calc(100% - 32px)`. Buttons stack vertically in column-reverse (Keep it on top, closer to thumb). Dialog position stays centered. |
| **Tablet+ (≥ 640px)** | Dialog: max-width 360px. Buttons always row. |

### Mobile Stack Fallback

```css
@media (max-width: 639px) {
  .confirm-actions {
    flex-direction: column-reverse;
  }
  
  .btn-keep {
    order: 1;
  }
  
  .btn-confirm-drop {
    order: 2;
  }
}
```

On mobile, buttons stack with "Keep it" on top (closer to thumb) and "Yes, drop it" below.

---

## 6. Animations

| Event | Animation | Duration | Easing |
|-------|-----------|----------|--------|
| Dialog opens | Backdrop fades in + dialog slides up from +16px + scales 0.98 → 1 | Backdrop: 200ms, Dialog: 300ms | `--ease-out`, `--ease-spring` |
| Dialog closes (Keep it) | Dialog slides down + fades out, backdrop fades out | 200ms | `--ease-in` |
| Dialog closes (Yes, drop it) | Dialog fades out + slight scale down, backdrop fades, then Active → Empty transition plays | 200ms + 300ms | `--ease-in` |

### Open Choreography

```
0ms      → Backdrop: fade in (200ms, ease-out)
50ms     → Dialog: slide up + scale (300ms, spring)
350ms    → Focus moves to "Keep it" button
```

### Close Choreography (Cancel)

```
0ms      → Dialog: slide down + fade out (200ms, ease-in)
0ms      → Backdrop: fade out (200ms, ease-in)
200ms    → Dialog removed, focus returns to "Drop it" button on Active screen
```

### Close Choreography (Confirm Delete)

```
0ms      → Dialog: fade out + scale down (200ms, ease-in)
0ms      → Backdrop: fade out (200ms, ease-in)
200ms    → Active → Empty transition plays (card-exit, 300ms)
350ms    → Toast: "Dropped. Fresh start." slides up (300ms, spring)
500ms    → Empty state entry sequence begins
```

---

## 7. Keyboard & Focus Management

- **On open:** Focus moves to "Keep it" button (safe action first)
- **Tab order:** Keep it → Yes, drop it
- **Escape key:** Closes dialog (same as "Keep it")
- **Focus trap:** Tab cycles within dialog only — cannot tab to elements behind backdrop
- **On close:** Focus returns to the "Drop it" button on Active Todo (or to input if deleted)

```
Focus trap implementation:
1. On dialog mount, store previously focused element
2. Move focus to first focusable element (btn-keep)
3. Intercept Tab/Shift+Tab to cycle within dialog
4. On dialog unmount, restore focus to stored element
```

---

## 8. Accessibility

- Dialog: `role="alertdialog"`, `aria-modal="true"`, `aria-labelledby="confirm-title"`, `aria-describedby="confirm-desc"`
- Headline: `id="confirm-title"`
- Supporting text: `id="confirm-desc"`
- Keep it button: `aria-label="Cancel delete"` (semantic, not just visual text)
- Confirm button: `aria-label="Confirm delete"`
- Backdrop: `aria-hidden="true"` (click on backdrop = "Keep it")
- Escape key handler dispatches `cancelDelete()`

---

## Handoff

| Artifact | Status |
|----------|--------|
| Screen spec (this file) | ✅ Complete |
| Wireframe prototype | `wireframes/confirm-delete.html` |
| Visual mockup prompt | `docs/design/visual-prompts.md` → `mockup-confirm-delete` |
