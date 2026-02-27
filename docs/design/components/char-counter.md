# Component: CharCounter

> A quiet sentinel. Speaks only when needed.

---

## Overview

The CharCounter displays remaining characters for the todo input. It lives below the input field and updates in real-time as the user types. It changes color to indicate warning (≤ 20 remaining) and danger (0 remaining) states.

---

## Variants

| Variant | Usage |
|---------|-------|
| **Counter** | Shows remaining characters: "142 left" |
| **Error** | Shows validation error: "Your todo needs some words." |

---

## States

| State | Color | Text | Visible |
|-------|-------|------|---------|
| **Hidden** | — | — | No (before first interaction) |
| **Normal** (> 20 remaining) | `--color-text-disabled` | "{n} left" | Yes (once typing begins) |
| **Warning** (≤ 20 remaining) | `--color-warning` | "{n} left" | Yes |
| **Danger** (0 remaining) | `--color-danger` | "0 left" | Yes |
| **Error** | `--color-danger` | Error message text | Yes |

---

## Structure

```html
<div class="char-counter" aria-live="polite" aria-label="Characters remaining">
  <span class="char-count">142 left</span>
</div>
```

### Error State

```html
<div class="char-counter" aria-live="polite">
  <span class="char-count error-message">Your todo needs some words.</span>
</div>
```

---

## CSS

```css
.char-counter {
  display: flex;
  justify-content: flex-end;
  padding: var(--space-1) var(--space-2) 0;
  min-height: 20px;
}

.char-count {
  font-family: var(--font-sans);
  font-size: var(--text-counter);
  font-weight: 500;
  letter-spacing: 0.04em;
  color: var(--color-text-disabled);
  transition: color var(--duration-instant) ease;
}

/* Warning: 20 or fewer remaining */
.char-count.warning {
  color: var(--color-warning);
}

/* Danger: 0 remaining */
.char-count.danger {
  color: var(--color-danger);
  font-weight: 600;
}

/* Error message (validation) */
.char-count.error-message {
  color: var(--color-danger);
  font-weight: 500;
  letter-spacing: 0;
  font-size: var(--text-small);
}
```

---

## Behavior

| Event | Counter Update |
|-------|---------------|
| User starts typing | Counter appears: "199 left" |
| Each keystroke | Counter decrements: "{200 - text.length} left" |
| At 20 remaining | Color shifts to `--color-warning` |
| At 0 remaining | Color shifts to `--color-danger`, further input blocked by `maxlength` |
| Empty submit attempted | Counter replaced with error message |
| User starts typing again | Error clears, counter resumes |

---

## Accessibility

- `aria-live="polite"` — screen readers announce changes without interrupting
- `aria-label="Characters remaining"` — context for screen readers
- Color is not the only indicator — the text itself changes meaning
- Error messages are also announced via the live region
