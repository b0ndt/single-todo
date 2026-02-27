# Design System — Neo-Skeuomorphic Cinematic

> Surfaces that feel real. Light that feels alive.

---

## 1. Design Philosophy

**Neo-Skeuomorphic Cinematic** merges physical material metaphors (brushed metal, matte finishes, glass) with dramatic lighting and neon accents. Every surface has depth. Every interaction has weight. The UI is not flat — it exists in a space lit by a single cinematic light source at **145°** (top-left to bottom-right).

### Principles

1. **Material truth** — Surfaces look like what they are: metal, glass, matte polymer. No gradients for decoration.
2. **One light source** — All shadows, highlights, and glows originate from a 145° angle. Consistency creates believability.
3. **Neon as signal** — Glowing accents are never decorative. They indicate: focus, action, state change.
4. **Physics, not decoration** — Animations obey spring physics and momentum. Nothing teleports.
5. **Depth hierarchy** — Background → Surface → Raised → Floating. Each layer has distinct material and shadow.

---

## 2. Materials

### 2.1 Deep Black (Background)

The void. The stage on which everything sits.

```css
.material-void {
  background-color: #0A0A0F;
  background-image: 
    radial-gradient(ellipse at 30% 20%, #12121A 0%, transparent 50%),
    radial-gradient(ellipse at 70% 80%, #0D0D15 0%, transparent 40%);
}
```

### 2.2 Brushed Metal (Surface)

Primary card and panel material. Has a subtle directional grain texture.

```css
.material-brushed-metal {
  background-color: #12121A;
  background-image: 
    repeating-linear-gradient(
      145deg,
      transparent,
      transparent 2px,
      #FFFFFF02 2px,
      #FFFFFF02 3px
    );
  border: 1px solid #FFFFFF08;
  border-top-color: #FFFFFF12;
  border-left-color: #FFFFFF10;
  border-bottom-color: #00000040;
  border-right-color: #00000030;
}
```

### 2.3 Matte Dark (Elevated Surface)

Slightly raised surfaces — input fields, secondary panels.

```css
.material-matte-dark {
  background-color: #1A1A2E;
  border: 1px solid #FFFFFF06;
  border-top-color: #FFFFFF10;
  border-bottom-color: #00000060;
}
```

### 2.4 Glass (Overlay)

For modals and floating dialogs. Frosted glass effect with backdrop blur.

```css
.material-glass {
  background: #12121ACC;
  backdrop-filter: blur(24px) saturate(1.2);
  -webkit-backdrop-filter: blur(24px) saturate(1.2);
  border: 1px solid #FFFFFF10;
  border-top-color: #FFFFFF18;
}
```

### 2.5 Material Depth Map

| Layer | Z-Index | Material | Shadow |
|-------|---------|----------|--------|
| **Background** | 0 | Deep Black | None |
| **Surface** | 1 | Brushed Metal | `shadow-surface` |
| **Raised** | 2 | Matte Dark | `shadow-raised` |
| **Floating** | 10 | Glass | `shadow-floating` |
| **Toast** | 100 | Brushed Metal + glow | `shadow-toast` |

---

## 3. Shadows

All shadows cast from the **145° light source** (top-left). This means shadows fall toward bottom-right.

### 3.1 Shadow Tokens

```css
:root {
  /* 145° light → shadow offset: x positive, y positive */
  --shadow-surface:
    2px 3px 8px #00000040,
    1px 1px 2px #00000020;

  --shadow-raised:
    4px 6px 16px #00000060,
    2px 3px 4px #00000030;

  --shadow-floating:
    8px 12px 32px #000000A0,
    4px 6px 8px #00000040,
    0 0 0 1px #FFFFFF08;

  --shadow-toast:
    4px 6px 24px #00000080,
    0 0 40px #00F0FF11;

  /* Inset shadow for pressed/debossed states */
  --shadow-inset:
    inset 2px 3px 6px #00000060,
    inset -1px -1px 2px #FFFFFF06;

  /* Neon glow shadows — not positional, they radiate */
  --glow-neon:
    0 0 20px #00F0FF33,
    0 0 60px #00F0FF11;

  --glow-neon-intense:
    0 0 20px #00F0FF66,
    0 0 60px #00F0FF22,
    0 0 120px #00F0FF0A;

  --glow-success:
    0 0 20px #00FF8833,
    0 0 60px #00FF8811;

  --glow-danger:
    0 0 20px #FF336633,
    0 0 60px #FF336611;
}
```

### 3.2 Shadow Usage

| Element | Shadow Token | Notes |
|---------|-------------|-------|
| Todo card | `--shadow-raised` | Static |
| Input field | `--shadow-inset` | Debossed look |
| Input field (focused) | `--shadow-inset` + `--glow-neon` | Combined |
| Primary button | `--shadow-surface` | Default |
| Primary button (hover) | `--shadow-raised` + `--glow-neon` | Lifts + glows |
| Primary button (active) | `--shadow-inset` | Pressed in |
| Confirm dialog | `--shadow-floating` | Highest elevation |
| Toast | `--shadow-toast` | Glow + shadow |

---

## 4. Neon Glow System

Glow is the lifeblood of the visual language. It is never arbitrary.

### 4.1 Glow Rules

1. **Glow = Interactive.** If it glows, you can touch it.
2. **Glow intensity = State.** Idle → subtle. Hover → medium. Active/Focus → intense.
3. **Glow color = Semantic.** Cyan = primary. Green = success. Red = danger. Yellow = warning.
4. **Glow transitions smoothly.** Never snap on/off. Always `transition: box-shadow 200ms ease`.

### 4.2 Glow Tokens

```css
:root {
  --glow-transition: box-shadow 200ms ease, border-color 200ms ease;

  /* Idle — subtle presence */
  --glow-idle: 0 0 8px #00F0FF11;

  /* Hover — draws attention */
  --glow-hover: 0 0 16px #00F0FF33, 0 0 40px #00F0FF11;

  /* Focus / Active — commands attention */
  --glow-focus: 0 0 20px #00F0FF66, 0 0 60px #00F0FF22, 0 0 120px #00F0FF0A;

  /* Success */
  --glow-success-idle: 0 0 8px #00FF8811;
  --glow-success-hover: 0 0 16px #00FF8833, 0 0 40px #00FF8811;
  --glow-success-focus: 0 0 20px #00FF8866, 0 0 60px #00FF8822;

  /* Danger */
  --glow-danger-idle: 0 0 8px #FF336611;
  --glow-danger-hover: 0 0 16px #FF336633, 0 0 40px #FF336611;
  --glow-danger-focus: 0 0 20px #FF336666, 0 0 60px #FF336622;
}
```

---

## 5. Color Tokens

### 5.1 Core Palette

```css
:root {
  /* Backgrounds */
  --color-void: #0A0A0F;
  --color-surface: #12121A;
  --color-surface-raised: #1A1A2E;
  --color-surface-hover: #222240;
  --color-surface-active: #2A2A4A;

  /* Neon Primary */
  --color-neon: #00F0FF;
  --color-neon-20: #00F0FF33;
  --color-neon-40: #00F0FF66;
  --color-neon-70: #00F0FFB3;

  /* Semantic */
  --color-success: #00FF88;
  --color-success-20: #00FF8833;
  --color-danger: #FF3366;
  --color-danger-20: #FF336633;
  --color-warning: #FFB800;
  --color-warning-20: #FFB80033;

  /* Text */
  --color-text-primary: #E8E8F0;
  --color-text-secondary: #8888A0;
  --color-text-disabled: #4A4A60;
  --color-text-inverse: #0A0A0F;

  /* Borders */
  --color-border: #FFFFFF08;
  --color-border-subtle: #FFFFFF04;
  --color-border-strong: #FFFFFF14;
}
```

### 5.2 Light Mode Override (Future — v2)

v1 is dark-mode only. Light mode tokens reserved here for v2:

```css
/* NOT IMPLEMENTED IN V1 */
@media (prefers-color-scheme: light) {
  :root {
    --color-void: #F0F0F5;
    --color-surface: #FFFFFF;
    --color-surface-raised: #F8F8FC;
    --color-neon: #0088AA;
    --color-text-primary: #1A1A2E;
    --color-text-secondary: #6A6A80;
  }
}
```

---

## 6. Typography

### 6.1 Font Stack

```css
:root {
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;
}
```

### 6.2 Type Scale (4px Base Grid)

| Token | Size | Line Height | Weight | Tracking | Usage |
|-------|------|-------------|--------|----------|-------|
| `--text-hero` | 48px | 56px (1.17) | 700 | -0.01em | Empty state headline |
| `--text-headline` | 32px | 40px (1.25) | 700 | -0.01em | Active state headline |
| `--text-title` | 24px | 32px (1.33) | 600 | 0 | Dialog titles |
| `--text-body` | 16px | 24px (1.5) | 400 | 0 | Todo text, body copy |
| `--text-body-strong` | 16px | 24px (1.5) | 600 | 0 | Emphasis in body |
| `--text-small` | 14px | 20px (1.43) | 400 | 0 | Timestamps, hints |
| `--text-label` | 12px | 16px (1.33) | 600 | 0.08em | Embossed labels (uppercase) |
| `--text-counter` | 12px | 16px (1.33) | 500 | 0.04em | Character counter |

### 6.3 Embossed Typography

Labels that look stamped into the surface:

```css
.text-embossed {
  font-size: var(--text-label);
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-disabled);
  text-shadow:
    0 1px 0 #1A1A2E,
    0 -1px 0 #000000;
}
```

### 6.4 Debossed Typography

Headings that look pressed into the surface, catching light:

```css
.text-debossed {
  font-weight: 700;
  color: var(--color-text-primary);
  text-shadow:
    0 2px 4px #00000080,
    0 -1px 0 #FFFFFF08;
}
```

### 6.5 Neon Typography

Text that glows:

```css
.text-neon {
  color: var(--color-neon);
  text-shadow:
    0 0 10px #00F0FF44,
    0 0 30px #00F0FF22,
    0 0 60px #00F0FF11;
}
```

---

## 7. Spacing

### 7.1 Base Unit

**4px** base grid. All spacing is a multiple of 4.

### 7.2 Spacing Scale

```css
:root {
  --space-1: 4px;    /* Tight: icon-to-label */
  --space-2: 8px;    /* Compact: between related elements */
  --space-3: 12px;   /* Default: paragraph spacing */
  --space-4: 16px;   /* Comfortable: section gaps */
  --space-5: 20px;   /* Relaxed: card padding (mobile) */
  --space-6: 24px;   /* Generous: card padding (desktop) */
  --space-8: 32px;   /* Spacious: between major sections */
  --space-10: 40px;  /* Grand: vertical rhythm markers */
  --space-12: 48px;  /* Statement: hero section padding */
  --space-16: 64px;  /* Dramatic: page margins (desktop) */
  --space-20: 80px;  /* Theatrical: hero vertical spacing */
}
```

### 7.3 Usage Map

| Context | Token | Value |
|---------|-------|-------|
| Input padding | `--space-4` | 16px |
| Card padding (mobile) | `--space-5` | 20px |
| Card padding (desktop) | `--space-6` | 24px |
| Between input and button | `--space-3` | 12px |
| Between label and content | `--space-2` | 8px |
| Between todo text and timestamp | `--space-2` | 8px |
| Between action buttons | `--space-3` | 12px |
| Page horizontal padding (mobile) | `--space-4` | 16px |
| Page horizontal padding (desktop) | `--space-16` | 64px |
| Logo to main content | `--space-10` | 40px |
| Empty state visual to headline | `--space-8` | 32px |

---

## 8. Layout & Responsive Breakpoints

### 8.1 Container

```css
.app-container {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  padding: var(--space-4);
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
```

### 8.2 Breakpoints

| Name | Min-Width | Key Changes |
|------|----------|-------------|
| `--bp-sm` | 0px | Mobile-first base. Single column. Full-bleed cards. |
| `--bp-md` | 640px | Cards get visible padding increase. Hero text scales up. |
| `--bp-lg` | 1024px | Max-width container. Generous white space. |

```css
/* Mobile-first (default styles) */
/* ... base styles ... */

@media (min-width: 640px) {
  .app-container {
    padding: var(--space-8);
  }
  .todo-card {
    padding: var(--space-6);
  }
}

@media (min-width: 1024px) {
  .app-container {
    padding: var(--space-16);
  }
}
```

### 8.3 Touch Targets

All interactive elements meet WCAG 2.1 AA minimum:

```css
.touch-target {
  min-width: 44px;
  min-height: 44px;
}
```

---

## 9. Border Radius

```css
:root {
  --radius-sm: 8px;    /* Buttons, small chips */
  --radius-md: 12px;   /* Input fields, small cards */
  --radius-lg: 16px;   /* Main cards, panels */
  --radius-xl: 24px;   /* Hero elements, dialogs */
  --radius-full: 9999px; /* Pills, tags */
}
```

---

## 10. Animations & Transitions

### 10.1 Easing Functions

```css
:root {
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in: cubic-bezier(0.7, 0, 0.84, 0);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-bounce: cubic-bezier(0.34, 1.8, 0.64, 1);
}
```

### 10.2 Duration Scale

```css
:root {
  --duration-instant: 100ms;  /* Micro-interactions: color change */
  --duration-fast: 200ms;     /* Hover states, glow transitions */
  --duration-normal: 300ms;   /* Element enter/exit */
  --duration-slow: 400ms;     /* Card transitions, major state changes */
  --duration-dramatic: 600ms; /* Hero animations */
}
```

### 10.3 Standard Transitions

```css
:root {
  --transition-glow: box-shadow var(--duration-fast) ease,
                     border-color var(--duration-fast) ease;
  --transition-color: color var(--duration-instant) ease,
                      background-color var(--duration-instant) ease;
  --transition-transform: transform var(--duration-normal) var(--ease-spring);
  --transition-opacity: opacity var(--duration-normal) var(--ease-out);
}
```

### 10.4 Keyframe Animations

#### Card Enter (Empty → Active)

```css
@keyframes card-enter {
  0% {
    opacity: 0;
    transform: scale(0.95) translateY(8px);
  }
  60% {
    opacity: 1;
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.card-enter {
  animation: card-enter var(--duration-slow) var(--ease-spring) forwards;
}
```

#### Card Exit (Active → Empty)

```css
@keyframes card-exit {
  0% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  100% {
    opacity: 0;
    transform: scale(0.95) translateY(-8px);
  }
}

.card-exit {
  animation: card-exit var(--duration-normal) var(--ease-in) forwards;
}
```

#### Glow Pulse (on creation)

```css
@keyframes glow-pulse {
  0% {
    box-shadow: 0 0 20px #00F0FF66, 0 0 60px #00F0FF22, 0 0 120px #00F0FF0A;
  }
  50% {
    box-shadow: 0 0 30px #00F0FF88, 0 0 80px #00F0FF33, 0 0 160px #00F0FF11;
  }
  100% {
    box-shadow: 0 0 20px #00F0FF33, 0 0 60px #00F0FF11;
  }
}

.glow-pulse {
  animation: glow-pulse 800ms var(--ease-out) forwards;
}
```

#### Dialog Enter

```css
@keyframes dialog-enter {
  0% {
    opacity: 0;
    transform: translateY(16px) scale(0.98);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes backdrop-enter {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
```

#### Toast Slide

```css
@keyframes toast-enter {
  0% {
    opacity: 0;
    transform: translateY(100%) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes toast-exit {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(100%) scale(0.95);
  }
}
```

#### Orb Float (Empty State Visual)

```css
@keyframes orb-float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

@keyframes orb-glow {
  0%, 100% {
    box-shadow: 0 0 40px #00F0FF44, 0 0 80px #00F0FF22, 0 0 120px #00F0FF11;
  }
  50% {
    box-shadow: 0 0 50px #00F0FF55, 0 0 100px #00F0FF33, 0 0 160px #00F0FF18;
  }
}

.orb {
  animation: 
    orb-float 4s var(--ease-in-out) infinite,
    orb-glow 4s var(--ease-in-out) infinite;
}
```

### 10.5 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 11. Iconography

### 11.1 Style

Icons are **24×24px**, **1.5px stroke**, **round line-cap**, **round line-join**. No fill — stroke only. This matches the precision of the typographic weight.

### 11.2 Icon Set

| Icon | Usage | Description |
|------|-------|-----------|
| `check` | Complete button | Single checkmark stroke |
| `x` | Delete / dismiss | X formed by two diagonal strokes |
| `plus` | Add (if ever shown as icon) | Plus formed by two perpendicular strokes |
| `arrow-right` | Submit / CTA arrow | Right-pointing chevron |
| `alert-circle` | Error state | Circle with exclamation |
| `clock` | Timestamp | Simple clock face |

### 11.3 Icon Rendering

```css
.icon {
  width: 24px;
  height: 24px;
  stroke: currentColor;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
}
```

All icons are inline SVG for zero HTTP requests and full CSS control (color via `currentColor`, glow via `filter: drop-shadow()`).

---

## 12. Focus Indicators

Visible, high-contrast, branded:

```css
:focus-visible {
  outline: 2px solid var(--color-neon);
  outline-offset: 3px;
  box-shadow: var(--glow-focus);
  transition: var(--transition-glow);
}

:focus:not(:focus-visible) {
  outline: none;
}
```

---

## 13. Z-Index Scale

```css
:root {
  --z-base: 0;
  --z-surface: 1;
  --z-raised: 2;
  --z-sticky: 10;
  --z-overlay: 50;
  --z-modal: 100;
  --z-toast: 200;
}
```

---

## 14. Complete Token Export

```css
:root {
  /* === COLORS === */
  --color-void: #0A0A0F;
  --color-surface: #12121A;
  --color-surface-raised: #1A1A2E;
  --color-surface-hover: #222240;
  --color-surface-active: #2A2A4A;
  --color-neon: #00F0FF;
  --color-neon-20: #00F0FF33;
  --color-neon-40: #00F0FF66;
  --color-neon-70: #00F0FFB3;
  --color-success: #00FF88;
  --color-success-20: #00FF8833;
  --color-danger: #FF3366;
  --color-danger-20: #FF336633;
  --color-warning: #FFB800;
  --color-warning-20: #FFB80033;
  --color-text-primary: #E8E8F0;
  --color-text-secondary: #8888A0;
  --color-text-disabled: #4A4A60;
  --color-text-inverse: #0A0A0F;
  --color-border: #FFFFFF08;
  --color-border-subtle: #FFFFFF04;
  --color-border-strong: #FFFFFF14;

  /* === TYPOGRAPHY === */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
  --text-hero: 48px;
  --text-headline: 32px;
  --text-title: 24px;
  --text-body: 16px;
  --text-small: 14px;
  --text-label: 12px;
  --text-counter: 12px;

  /* === SPACING === */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;

  /* === RADII === */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-full: 9999px;

  /* === SHADOWS === */
  --shadow-surface: 2px 3px 8px #00000040, 1px 1px 2px #00000020;
  --shadow-raised: 4px 6px 16px #00000060, 2px 3px 4px #00000030;
  --shadow-floating: 8px 12px 32px #000000A0, 4px 6px 8px #00000040, 0 0 0 1px #FFFFFF08;
  --shadow-toast: 4px 6px 24px #00000080, 0 0 40px #00F0FF11;
  --shadow-inset: inset 2px 3px 6px #00000060, inset -1px -1px 2px #FFFFFF06;

  /* === GLOWS === */
  --glow-idle: 0 0 8px #00F0FF11;
  --glow-hover: 0 0 16px #00F0FF33, 0 0 40px #00F0FF11;
  --glow-focus: 0 0 20px #00F0FF66, 0 0 60px #00F0FF22, 0 0 120px #00F0FF0A;
  --glow-success-idle: 0 0 8px #00FF8811;
  --glow-success-hover: 0 0 16px #00FF8833, 0 0 40px #00FF8811;
  --glow-success-focus: 0 0 20px #00FF8866, 0 0 60px #00FF8822;
  --glow-danger-idle: 0 0 8px #FF336611;
  --glow-danger-hover: 0 0 16px #FF336633, 0 0 40px #FF336611;
  --glow-danger-focus: 0 0 20px #FF336666, 0 0 60px #FF336622;

  /* === EASINGS === */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in: cubic-bezier(0.7, 0, 0.84, 0);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-bounce: cubic-bezier(0.34, 1.8, 0.64, 1);

  /* === DURATIONS === */
  --duration-instant: 100ms;
  --duration-fast: 200ms;
  --duration-normal: 300ms;
  --duration-slow: 400ms;
  --duration-dramatic: 600ms;

  /* === Z-INDEX === */
  --z-base: 0;
  --z-surface: 1;
  --z-raised: 2;
  --z-sticky: 10;
  --z-overlay: 50;
  --z-modal: 100;
  --z-toast: 200;
}
```

---

## Handoff

| Artifact | Path | Status |
|----------|------|--------|
| Design System (this file) | `docs/design/01-design-system.md` | ✅ Complete |

### Notes for Engineer

- All CSS custom properties above are the **source of truth**. Copy the Section 14 token export as-is into the app's root stylesheet.
- Materials (Section 2) provide exact CSS — implement verbatim.
- The 145° light source direction is baked into all shadow offset values. Do not change individual shadow angles.
- Animation keyframes (Section 10.4) are exact — implement as written.
- `prefers-reduced-motion` (Section 10.5) is mandatory for WCAG compliance.
- Inter and JetBrains Mono should be loaded via `@font-face` with `font-display: swap` to avoid FOIT.
- If Inter is too large for the 50KB budget, fall back to the system font stack — the design still works.
