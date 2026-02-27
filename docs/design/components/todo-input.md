# Component: TodoInput

> The gateway. Where focus begins.

---

## Overview

A compound input group that combines a text input and a submit button into a single debossed surface. Includes a character counter below. Only visible when no active todo exists (`status: "empty"`).

The input group uses the Matte Dark material with an inset shadow — it looks carved into the surface, like a slot in a control panel. When focused, the neon glow ring wraps the entire group, signaling that this is the active control.

---

## Variants

| Variant | Usage |
|---------|-------|
| **Default** | Standard input, ready for typing |
| **Error** | Validation error displayed (empty text / too long) |
| **Disabled** | Never shown in v1 (hidden instead when todo exists) |

---

## States

| State | Border | Shadow | Counter | Button |
|-------|--------|--------|---------|--------|
| **Default** | `--color-border` | `--shadow-inset` | Hidden | Muted neon |
| **Focused** | `--color-neon-40` | `--shadow-inset` + `--glow-focus` | Visible, `--color-text-disabled` | Neon bright |
| **Typing** | `--color-neon-40` | `--shadow-inset` + `--glow-focus` | Active count, updates live | Neon bright |
| **Near limit (≤20)** | `--color-neon-40` | `--shadow-inset` + `--glow-focus` | `--color-warning` | Neon bright |
| **At limit (0)** | `--color-warning` | `--shadow-inset` + warning glow | `--color-danger`, "0 left" | Neon bright |
| **Error (empty submit)** | `--color-danger` | `--shadow-inset` + `--glow-danger-focus` | Error message text | Muted |
| **Hover (button)** | — | — | — | `--color-surface-hover` bg |

---

## Structure

```html
<form class="todo-input-group" role="form" aria-label="Add a todo">
  <div class="input-wrapper">
    <input
      type="text"
      class="todo-input"
      placeholder="Your one thing…"
      aria-label="What needs doing?"
      maxlength="200"
      autocomplete="off"
      autocapitalize="sentences"
    />
    <button
      type="submit"
      class="todo-submit"
      aria-label="Add todo"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 12h14M12 5l7 7-7 7"/>
      </svg>
    </button>
  </div>
  <div class="char-counter" aria-live="polite" aria-label="Characters remaining">
    <span class="char-count">200 left</span>
  </div>
</form>
```

---

## CSS

```css
.todo-input-group {
  width: 100%;
  max-width: 400px;
}

.input-wrapper {
  display: flex;
  align-items: stretch;
  background: var(--color-surface-raised);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-inset);
  transition: border-color var(--duration-fast) ease,
              box-shadow var(--duration-fast) ease;
  overflow: hidden;
}

.input-wrapper:focus-within {
  border-color: var(--color-neon-40);
  box-shadow: var(--shadow-inset), var(--glow-focus);
}

.input-wrapper.error {
  border-color: var(--color-danger);
  box-shadow: var(--shadow-inset), var(--glow-danger-focus);
  animation: input-shake 300ms ease-out;
}

.todo-input {
  flex: 1;
  background: transparent;
  border: none;
  padding: var(--space-4);
  color: var(--color-text-primary);
  font-family: var(--font-sans);
  font-size: var(--text-body);
  line-height: 1.5;
  outline: none;
  caret-color: var(--color-neon);
}

.todo-input::placeholder {
  color: var(--color-text-disabled);
  font-style: normal;
}

.todo-submit {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  min-height: 48px;
  padding: 0;
  background: transparent;
  border: none;
  border-left: 1px solid var(--color-border);
  color: var(--color-neon);
  cursor: pointer;
  transition: background-color var(--duration-instant) ease,
              box-shadow var(--duration-fast) ease;
}

.todo-submit:hover {
  background: var(--color-surface-hover);
}

.todo-submit:active {
  background: var(--color-surface-active);
}

.todo-submit:focus-visible {
  outline: 2px solid var(--color-neon);
  outline-offset: -2px;
  box-shadow: var(--glow-focus);
}

/* Character Counter */
.char-counter {
  display: flex;
  justify-content: flex-end;
  padding: var(--space-1) var(--space-2) 0;
  min-height: 20px;
}

.char-count {
  font-size: var(--text-counter);
  font-weight: 500;
  letter-spacing: 0.04em;
  color: var(--color-text-disabled);
  transition: color var(--duration-instant) ease;
}

.char-count.warning {
  color: var(--color-warning);
}

.char-count.danger {
  color: var(--color-danger);
}

.char-count.error-message {
  color: var(--color-danger);
  font-weight: 500;
  letter-spacing: 0;
}

/* Shake animation for error */
@keyframes input-shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-2px); }
  40% { transform: translateX(2px); }
  60% { transform: translateX(-2px); }
  80% { transform: translateX(1px); }
}
```

---

## Responsive

| Breakpoint | Changes |
|-----------|---------|
| Mobile (< 640px) | Full width, `--space-4` side margins from AppShell |
| Tablet+ (≥ 640px) | Max-width 400px |

---

## Accessibility

- `aria-label="What needs doing?"` on input
- `aria-label="Add todo"` on submit button
- `maxlength="200"` enforced at HTML level
- `aria-live="polite"` on character counter for real-time updates
- `autocomplete="off"` — no browser suggestions
- `autocapitalize="sentences"` — mobile UX
- Error state announced via `aria-live` region
- Enter key submits (native form behavior)
- Input receives focus on screen mount
