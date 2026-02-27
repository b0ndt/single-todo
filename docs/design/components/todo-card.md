# Component: TodoCard

> The artifact. Your one thing, rendered in brushed metal.

---

## Overview

The TodoCard is the primary display surface for the active todo. It is a brushed-metal panel containing the embossed label, todo text, timestamp, and action buttons. Only visible when a todo exists (`status: "active"` or `status: "confirm-delete"`).

The card is the most physically expressive element in the system. Its brushed-metal grain runs at 145° (aligned with the light source), its borders catch light asymmetrically, and its shadow falls to the bottom-right. Every detail reinforces that this is a real object sitting on the void.

---

## Variants

| Variant | Usage |
|---------|-------|
| **Active** | Full interactive state — buttons enabled |
| **Dimmed** | Behind confirm-delete overlay — visually muted, non-interactive |

---

## States

| State | Visual |
|-------|--------|
| **Default** | Brushed-metal surface, raised shadow, full color |
| **Entering** | Scale 0.95 → 1, fade in, glow pulse |
| **Exiting (complete)** | Green glow flash, scale → 0.95, fade out |
| **Exiting (delete confirmed)** | Fade out, handled by dialog close sequence |
| **Dimmed** | `filter: brightness(0.4) blur(2px)`, non-interactive |

---

## Structure

```html
<article class="todo-card" role="status" aria-live="polite">
  <span class="todo-label text-embossed" aria-hidden="true">YOUR FOCUS</span>
  
  <h2 class="todo-text text-debossed">
    Send the revised proposal to Aya by 3pm
  </h2>
  
  <p class="todo-timestamp">
    <svg class="icon-clock" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
    </svg>
    Added 5 min ago
  </p>
  
  <div class="action-row">
    <button class="btn-action btn-done" aria-label="Mark todo as done">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 6L9 17l-5-5"/>
      </svg>
      Done
    </button>
    <button class="btn-action btn-drop" aria-label="Delete todo">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 6L6 18M6 6l12 12"/>
      </svg>
      Drop it
    </button>
  </div>
</article>
```

---

## CSS

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

.todo-card.entering {
  animation: card-enter 400ms var(--ease-spring) forwards;
}

.todo-card.exiting-complete {
  animation: card-complete 300ms var(--ease-in) forwards;
}

.todo-card.dimmed {
  filter: brightness(0.4) blur(2px);
  pointer-events: none;
}

/* Label */
.todo-label {
  display: block;
  font-size: var(--text-label);
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-disabled);
  text-shadow: 0 1px 0 #1A1A2E, 0 -1px 0 #000000;
  margin-bottom: var(--space-3);
}

/* Todo text */
.todo-text {
  font-size: var(--text-headline);
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: -0.01em;
  color: var(--color-text-primary);
  text-shadow: 0 2px 4px #00000080, 0 -1px 0 #FFFFFF08;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

/* Timestamp */
.todo-timestamp {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  margin-top: var(--space-2);
  font-size: var(--text-small);
  color: var(--color-text-secondary);
}

.icon-clock {
  flex-shrink: 0;
}

/* Action row */
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
  font-family: var(--font-sans);
  font-size: var(--text-body);
  font-weight: 600;
  cursor: pointer;
  transition:
    box-shadow var(--duration-fast) ease,
    border-color var(--duration-fast) ease,
    color var(--duration-instant) ease,
    background-color var(--duration-instant) ease,
    transform var(--duration-fast) var(--ease-spring);
}

.btn-action:focus-visible {
  outline: 2px solid var(--color-neon);
  outline-offset: 3px;
  box-shadow: var(--glow-focus);
}

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
  box-shadow: inset 2px 3px 6px #00000060, inset -1px -1px 2px #FFFFFF06, var(--glow-success-focus);
}

.btn-drop {
  background: var(--color-surface-raised);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
}

.btn-drop:hover {
  border-color: #FF336644;
  color: var(--color-danger);
  box-shadow: var(--glow-danger-hover);
  transform: translateY(-1px);
}

.btn-drop:active {
  transform: translateY(0);
  box-shadow: inset 2px 3px 6px #00000060, inset -1px -1px 2px #FFFFFF06, var(--glow-danger-focus);
}

/* Animations */
@keyframes card-enter {
  0% {
    opacity: 0;
    transform: scale(0.95) translateY(8px);
  }
  60% { opacity: 1; }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes card-complete {
  0% {
    opacity: 1;
    transform: scale(1);
    box-shadow: var(--shadow-raised);
  }
  50% {
    box-shadow: 0 0 20px #00FF8866, 0 0 60px #00FF8822;
  }
  100% {
    opacity: 0;
    transform: scale(0.95);
    box-shadow: none;
  }
}

/* Responsive */
@media (max-width: 639px) {
  .todo-card {
    padding: var(--space-5);
  }
  
  .todo-text {
    font-size: var(--text-title);
  }
  
  .action-row {
    flex-direction: column;
  }
}
```

---

## Responsive

| Breakpoint | Text Size | Padding | Buttons |
|-----------|-----------|---------|---------|
| Mobile (< 640px) | 24px | 20px | Stacked (column) |
| Tablet (≥ 640px) | 28px | 24px | Side by side (row) |
| Desktop (≥ 1024px) | 32px | 24px | Side by side (row) |

---

## Accessibility

- `role="status"`, `aria-live="polite"` — announces todo to screen readers
- `<h2>` for todo text — semantic heading
- Buttons: descriptive `aria-label` values (not just icon text)
- Minimum 48px tap targets on all buttons
- Focus-visible glow ring on all interactive elements
