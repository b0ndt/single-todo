# Screen: Active Todo

> One thing. Front and center. Unmissable.

**State:** `{ status: "active", todo: { text, createdAt } }`
**Route:** `/` (only route)
**Trigger:** After `addTodo()` succeeds, or app loads with existing localStorage todo.

---

## 1. Layout

```
┌─────────────────────────────────────┐
│            [Logo] 40px              │  ← Top: --space-12
│                                     │
│                                     │
│  ┌─────────────────────────────┐    │
│  │  YOUR FOCUS          emboss │    │  ← Embossed label
│  │                             │    │
│  │  "Send the revised          │    │  ← Todo text, prominent
│  │   proposal to Aya by 3pm"  │    │
│  │                             │    │
│  │  Added 5 min ago            │    │  ← Timestamp, muted
│  │                             │    │
│  │  ┌──────────┐ ┌──────────┐  │    │  ← Action buttons
│  │  │  ✓ Done  │ │ ✕ Drop it│  │    │
│  │  └──────────┘ └──────────┘  │    │
│  └─────────────────────────────┘    │
│                                     │
│                                     │
└─────────────────────────────────────┘
```

### Vertical Stack (Center-Aligned)

| Element | Spacing | Alignment |
|---------|---------|-----------|
| Logo | `--space-12` from top | Center |
| Todo Card | Vertically centered in remaining space | Center |
| ↳ Embossed label | `--space-6` padding top | Left |
| ↳ Todo text | `--space-3` below label | Left |
| ↳ Timestamp | `--space-2` below text | Left |
| ↳ Action buttons | `--space-6` below timestamp | Left, row |

---

## 2. Materials & Surfaces

| Element | Material | CSS Class |
|---------|----------|-----------|
| Page background | Deep Black | `.material-void` |
| Todo Card | Brushed Metal | `.material-brushed-metal` + `--shadow-raised` |
| "Done" button | Surface with success glow on hover | Custom |
| "Drop it" button | Surface with danger glow on hover | Custom |

The card is the star of this screen. Its brushed-metal grain (145° diagonal lines at 2–3% white opacity) catches the cinematic light source. The asymmetric border (bright top-left, dark bottom-right) reinforces physicality.

---

## 3. Component Specifications

### 3.1 Todo Card

The centerpiece. A brushed-metal panel that commands the viewport.

```css
.todo-card {
  width: 100%;
  max-width: 480px;
  padding: var(--space-6);
  background-color: var(--color-surface);
  background-image: 
    repeating-linear-gradient(
      145deg,
      transparent,
      transparent 2px,
      #FFFFFF02 2px,
      #FFFFFF02 3px
    );
  border: 1px solid var(--color-border);
  border-top-color: #FFFFFF12;
  border-left-color: #FFFFFF10;
  border-bottom-color: #00000040;
  border-right-color: #00000030;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-raised);
}
```

### 3.2 Embossed Label

- **Text:** "YOUR FOCUS"
- **Style:** `.text-embossed` — 12px, weight 600, uppercase, tracking +0.08em
- **Color:** `--color-text-disabled` with embossed text-shadow

### 3.3 Todo Text

- **Text:** The user's todo (dynamic content)
- **Style:** `--text-headline` (32px) on desktop, `--text-title` (24px) on mobile
- **Weight:** 700
- **Color:** `--color-text-primary`
- **Effect:** `.text-debossed`
- **Overflow:** Word-wrap. No truncation — all 200 chars must be visible.

### 3.4 Timestamp

- **Text:** "Added {relative time}" (e.g., "Added 5 min ago")
- **Style:** `--text-small` (14px), weight 400
- **Color:** `--color-text-secondary`
- **Icon:** Clock icon (14px) inline before text, same color
- **Updates:** Every 60 seconds via interval

### 3.5 Action Buttons

Two buttons side by side, equal width:

```css
.action-row {
  display: flex;
  gap: var(--space-3);
  margin-top: var(--space-6);
}

.btn-action {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  min-height: 48px;
  border-radius: var(--radius-sm);
  font-size: var(--text-body);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-glow), var(--transition-color), var(--transition-transform);
}

/* Done (Complete) Button */
.btn-done {
  background: var(--color-surface-raised);
  border: 1px solid #00FF8833;
  color: var(--color-success);
  box-shadow: var(--glow-success-idle);
}

.btn-done:hover {
  background: #00FF8811;
  border-color: #00FF8866;
  box-shadow: var(--glow-success-hover);
  transform: translateY(-1px);
}

.btn-done:active {
  transform: translateY(0);
  box-shadow: var(--shadow-inset), var(--glow-success-focus);
}

/* Drop it (Delete) Button */
.btn-drop {
  background: var(--color-surface-raised);
  border: 1px solid #FFFFFF08;
  color: var(--color-text-secondary);
  box-shadow: none;
}

.btn-drop:hover {
  border-color: #FF336644;
  color: var(--color-danger);
  box-shadow: var(--glow-danger-hover);
  transform: translateY(-1px);
}

.btn-drop:active {
  transform: translateY(0);
  box-shadow: var(--shadow-inset), var(--glow-danger-focus);
}
```

**Design intent:** "Done" is visually primary — green glow signals positive action. "Drop it" is deliberately muted — it only reveals its danger red on hover, discouraging accidental deletion.

---

## 4. States

| State | Visual Change |
|-------|--------------|
| **Default** | Card displayed with brushed-metal material, raised shadow |
| **Hover: Done button** | Green glow intensifies, slight lift (-1px Y) |
| **Hover: Drop it button** | Red glow appears, text turns red, slight lift |
| **Active: Done button** | Pressed in (inset shadow), intense green glow |
| **Active: Drop it button** | Pressed in (inset shadow), intense red glow |
| **Focus-visible: any button** | Neon cyan outline + glow (standard focus indicator) |

---

## 5. Responsive Behavior

| Breakpoint | Changes |
|-----------|---------|
| **Mobile (< 640px)** | Todo text: 24px. Card padding: `--space-5`. Buttons stack vertically (column direction). Card: full width minus `--space-4`. |
| **Tablet (≥ 640px)** | Todo text: 28px. Card padding: `--space-6`. Buttons: row. Card: max 480px. |
| **Desktop (≥ 1024px)** | Todo text: 32px. Card padding: `--space-6`. Generous page margins. |

### Mobile Button Stack

```css
@media (max-width: 639px) {
  .action-row {
    flex-direction: column;
  }
  
  .btn-action {
    width: 100%;
  }
}
```

---

## 6. Animations

| Event | Animation | Duration | Easing |
|-------|-----------|----------|--------|
| Card enters (from empty state) | Scale 0.95 → 1 + fade in + glow pulse | 400ms | `--ease-spring` |
| Card enters (page load, todo exists) | Fade in only (no scale) | 300ms | `--ease-out` |
| Glow pulse on entry | `glow-pulse` keyframe — box-shadow intensity rises then settles | 800ms | `--ease-out` |
| Complete tap | Card scales down 0.95 + fades out, checkmark icon briefly flashes green | 300ms | `--ease-in` |
| Delete tap | Transitions to Confirm Delete screen |

### Entry Animation (From Empty State)

```css
.todo-card-enter {
  animation: card-enter 400ms var(--ease-spring) forwards;
}

.todo-card-enter::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  animation: glow-pulse 800ms var(--ease-out) forwards;
  pointer-events: none;
}
```

### Complete Animation

```css
@keyframes card-complete {
  0% {
    opacity: 1;
    transform: scale(1);
    box-shadow: var(--shadow-raised);
  }
  50% {
    box-shadow: var(--glow-success-focus);
  }
  100% {
    opacity: 0;
    transform: scale(0.95);
    box-shadow: 0 0 40px #00FF8800;
  }
}
```

### Completion Choreography

```
0ms      → Card: green glow flash begins
150ms    → Card: scale down + fade starts (300ms, ease-in)
300ms    → Toast: "Done. What's next?" slides up (300ms, spring)
450ms    → Card fully removed from DOM
500ms    → Empty state begins entry sequence
```

---

## 7. Accessibility

- Todo card: `role="status"`, `aria-live="polite"`
- Embossed label: `aria-hidden="true"` (decorative, text content conveys meaning)
- Todo text: Read by screen reader as status region content
- Timestamp: Part of the status region — "Added 5 minutes ago"
- Done button: `aria-label="Mark todo as done"`
- Drop it button: `aria-label="Delete todo"`
- Focus order: Logo (skip) → Done button → Drop it button
- Both buttons have `min-height: 48px` for touch target compliance

---

## Handoff

| Artifact | Status |
|----------|--------|
| Screen spec (this file) | ✅ Complete |
| Wireframe prototype | `wireframes/active-todo.html` |
| Visual mockup prompt | `docs/design/visual-prompts.md` → `mockup-active-todo` |
