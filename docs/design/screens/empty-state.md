# Screen: Empty State

> The blank canvas. An invitation, not an absence.

**State:** `{ status: "empty" }`
**Route:** `/` (only route)
**Trigger:** App loads with no localStorage todo, or after complete/delete.

---

## 1. Layout

```
┌─────────────────────────────────────┐
│            [Logo] 40px              │  ← Top: --space-12
│                                     │
│                                     │
│           ◉  (Orb Visual)           │  ← Centered, 120px diameter
│                                     │
│        "What needs doing?"          │  ← Hero headline, debossed
│   "One thing at a time. Add your    │  ← Supporting text, secondary
│            focus."                  │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ Your one thing…         │→│ │    │  ← Input + submit inline
│  └─────────────────────────────┘    │
│                         142 left    │  ← Character counter
│                                     │
│                                     │
└─────────────────────────────────────┘
```

### Vertical Stack (Center-Aligned)

| Element | Spacing Above | Alignment |
|---------|---------------|-----------|
| Logo | `--space-12` (48px) from viewport top | Center |
| Orb Visual | `--space-20` (80px) below logo | Center |
| Headline | `--space-8` (32px) below orb | Center |
| Supporting Text | `--space-2` (8px) below headline | Center |
| Input Group | `--space-8` (32px) below supporting text | Center, full width (max 400px) |
| Character Counter | `--space-1` (4px) below input | Right-aligned within input width |

---

## 2. Materials & Surfaces

| Element | Material | CSS Class |
|---------|----------|-----------|
| Page background | Deep Black | `.material-void` |
| Input field | Matte Dark (debossed) | `.material-matte-dark` + `--shadow-inset` |
| Submit button area | Within input, brushed metal accent | `.material-brushed-metal` |

---

## 3. Component Specifications

### 3.1 Logo

- **Size:** 40px height
- **Variant:** `logo.svg` (universal/currentColor, neon glow on dark)
- **Glow:** Subtle idle glow `--glow-idle`
- **Color:** `--color-neon` on dark background

### 3.2 Empty State Visual (Orb)

- **Size:** 120px diameter circle
- **Color:** `--color-neon` at 30% opacity fill, neon border
- **Animation:** `orb-float` (4s infinite) + `orb-glow` (4s infinite)
- **Glow:** `0 0 40px #00F0FF44, 0 0 80px #00F0FF22, 0 0 120px #00F0FF11`
- **Reflection:** Below the orb, a faded ellipse (20% height, 5% opacity) simulating floor reflection

```css
.empty-orb {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #00F0FF44 0%, #00F0FF11 50%, transparent 70%);
  border: 1px solid #00F0FF44;
  box-shadow: 0 0 40px #00F0FF44, 0 0 80px #00F0FF22, 0 0 120px #00F0FF11;
  animation: orb-float 4s var(--ease-in-out) infinite, orb-glow 4s var(--ease-in-out) infinite;
}

.empty-orb-reflection {
  width: 80px;
  height: 20px;
  border-radius: 50%;
  background: radial-gradient(ellipse, #00F0FF11 0%, transparent 70%);
  margin-top: var(--space-2);
}
```

### 3.3 Headline

- **Text:** "What needs doing?"
- **Style:** `--text-hero` (48px), weight 700, `.text-debossed`
- **Color:** `--color-text-primary`
- **Responsive:** Scales to `--text-headline` (32px) below 640px

### 3.4 Supporting Text

- **Text:** "One thing at a time. Add your focus."
- **Style:** `--text-body` (16px), weight 400
- **Color:** `--color-text-secondary`

### 3.5 Input Group

The input and submit button form a single visual unit:

```css
.input-group {
  display: flex;
  align-items: stretch;
  width: 100%;
  max-width: 400px;
  background: var(--color-surface-raised);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-inset);
  transition: var(--transition-glow);
}

.input-group:focus-within {
  border-color: var(--color-neon-40);
  box-shadow: var(--shadow-inset), var(--glow-focus);
}

.input-group input {
  flex: 1;
  background: transparent;
  border: none;
  padding: var(--space-4);
  color: var(--color-text-primary);
  font-size: var(--text-body);
  outline: none;
}

.input-group input::placeholder {
  color: var(--color-text-disabled);
}

.input-group button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
  background: transparent;
  border: none;
  border-left: 1px solid var(--color-border);
  color: var(--color-neon);
  cursor: pointer;
  transition: var(--transition-color), var(--transition-glow);
}

.input-group button:hover {
  background: var(--color-surface-hover);
  box-shadow: var(--glow-hover);
}
```

### 3.6 Character Counter

- **Position:** Below input, right-aligned
- **Style:** `--text-counter` (12px), weight 500, tracking +0.04em
- **Color states:**
  - Normal (> 20 remaining): `--color-text-disabled`
  - Warning (≤ 20 remaining): `--color-warning`
  - Limit (0 remaining): `--color-danger`

---

## 4. States

| State | Visual Change |
|-------|--------------|
| **Default** | As described above |
| **Input focused** | Input group border shifts to `--color-neon-40`, glow ring appears |
| **Typing** | Character counter becomes visible, updates in real-time |
| **Validation error (empty)** | Input group border flashes `--color-danger`, counter replaced with error text "Your todo needs some words." in `--color-danger` |
| **Validation error (too long)** | Counter turns `--color-danger`, shows "0 left" |
| **Submitting** | Submit button icon briefly pulses, then screen transitions to Active |

---

## 5. Responsive Behavior

| Breakpoint | Changes |
|-----------|---------|
| **Mobile (< 640px)** | Headline: 32px. Orb: 80px diameter. Input group: full width minus `--space-4` padding. Page padding: `--space-4`. |
| **Tablet (≥ 640px)** | Headline: 40px. Orb: 100px. Input group: 400px max. Page padding: `--space-8`. |
| **Desktop (≥ 1024px)** | Headline: 48px. Orb: 120px. Input group: 400px max. Page padding: `--space-16`. |

---

## 6. Animations

| Event | Animation | Duration | Easing |
|-------|-----------|----------|--------|
| Screen enters (initial load) | Orb fades in + scales from 0.8 → 1, then starts floating | 600ms | `--ease-spring` |
| Screen enters (after complete/delete) | Headline + input fade in staggered (100ms delay between) | 300ms each | `--ease-out` |
| Validation error | Input border + error text fade in, input shakes subtly (2px horizontal oscillation, 3 cycles) | 300ms | `ease-out` |
| Orb continuous | Float up/down 8px + glow intensity cycles | 4s | `--ease-in-out`, infinite |

### Validation Shake

```css
@keyframes input-shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-2px); }
  40% { transform: translateX(2px); }
  60% { transform: translateX(-2px); }
  80% { transform: translateX(1px); }
}

.input-error {
  animation: input-shake 300ms ease-out;
  border-color: var(--color-danger) !important;
  box-shadow: var(--shadow-inset), var(--glow-danger-focus) !important;
}
```

---

## 7. Accessibility

- Input: `aria-label="What needs doing?"`, `maxlength="200"`
- Submit button: `aria-label="Add todo"`
- Character counter: `aria-live="polite"`, `aria-label="Characters remaining"`
- Orb visual: `aria-hidden="true"` (decorative)
- Headline: `<h1>` semantic heading
- Focus order: Logo (skip) → Input → Submit button

---

## Handoff

| Artifact | Status |
|----------|--------|
| Screen spec (this file) | ✅ Complete |
| Wireframe prototype | `wireframes/empty-state.html` |
