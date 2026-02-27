# Brand Identity — single-todo

> _One thing. Done right._

---

## 1. Brand Essence

**single-todo** is not another productivity app. It is a philosophical stance against noise. In a world drowning in lists, notifications, and infinite backlogs, single-todo says: _one thing at a time_. The brand embodies **radical focus** — the discipline to commit to a single action and see it through before moving on.

The product is small by design. The brand must feel **inevitable** — like the answer was always this simple.

---

## 2. Brand Values

| Value | Expression |
|-------|-----------|
| **Focus** | One todo. No lists. No folders. No tags. The constraint _is_ the feature. |
| **Craft** | Every pixel is deliberate. The UI is a precision instrument, not a template. |
| **Confidence** | Bold surfaces, cinematic lighting, decisive interactions. No wishy-washy defaults. |
| **Respect** | For the user's time (sub-second interactions), attention (zero distraction), and intelligence (no hand-holding). |
| **Honesty** | No dark patterns. No upsells. What you see is what you get. |

---

## 3. Brand Personality

**If single-todo were a person**, they would be a master craftsperson's workbench — clean, purposeful, with one tool laid out and ready. Not minimalist for aesthetics, but minimal because everything unnecessary has been removed with intent.

| Trait | Description |
|-------|-----------|
| **Assured** | Speaks in short, confident statements. Never hedges. |
| **Warm but concise** | Friendly without being chatty. Every word earns its place. |
| **Precise** | Exact language, exact spacing, exact timing. |
| **Quietly bold** | Doesn't shout. The neon glow whispers power. |

---

## 4. Tone of Voice

### Principles

1. **Lead with verbs.** Action over description. _"Add your one thing"_ not _"You can add a task here"_.
2. **Short sentences.** If a comma works, use a period instead.
3. **Present tense.** The app lives in the now. _"Done."_ not _"Your task has been completed."_
4. **No jargon.** No "items", "entries", or "records". It's a _todo_.
5. **Encourage, don't instruct.** _"What needs doing?"_ not _"Enter a task in the field below."_

### Do / Don't

| ✓ Do | ✗ Don't |
|------|---------|
| "One thing at a time." | "Manage your tasks efficiently." |
| "Done. What's next?" | "Task successfully completed! Add another?" |
| "Focus on this." | "You currently have 1 active task." |
| "Let it go." | "Are you sure you want to permanently delete this item?" |

---

## 5. Logo Concept

### Shape & Symbolism

The **single-todo** logo is a **singular focused dot** — a filled circle with a subtle checkmark negative space — enclosed in a rounded square frame. The form references:

- **The dot**: One thing. A bullet point. The origin point. A full stop.
- **The check (negative space)**: Completion. Satisfaction. The stroke carved into the dot like an engraving on brushed metal.
- **The rounded square**: The app frame. A container that holds exactly one thing.

The mark sits alone — no wordmark in the primary usage. The shape is self-sufficient. When a wordmark is needed (marketing, OG images), the logotype "single-todo" is set in **500-weight geometric sans-serif**, letter-spaced +0.02em, all lowercase.

### Construction

```
┌─────────────────────┐
│                     │
│      ┌───────┐      │
│      │  ╱    │      │
│      │ ╱     │      │
│      │╱  ●   │      │
│      └───────┘      │
│                     │
└─────────────────────┘

Outer: Rounded rectangle (r=20%)
Inner: Circle with carved checkmark
```

The checkmark is not a separate element — it is a **debossed cut** in the circle, catching light from the 145° cinematic light source. This creates the illusion of a stamped metal badge.

### Colors

| Variant | Mark Fill | Check Cut | Frame | Background |
|---------|-----------|-----------|-------|-----------|
| **Primary (dark bg)** | `#00F0FF` (Neon Cyan) | Transparent to bg | `#1A1A2E` | `#0A0A0F` |
| **Light mode** | `#0A0A0F` (Deep Black) | Transparent to bg | `#D0D0D8` | `#FFFFFF` |
| **Monochrome** | `currentColor` | Transparent to bg | `currentColor` | Transparent |

### Variants

| File | Usage |
|------|-------|
| `public/logo.svg` | Universal — uses `currentColor` + neon glow, works on any background |
| `public/logo-dark.svg` | Optimized for dark backgrounds — neon cyan mark, deep frame |
| `public/logo-light.svg` | Optimized for light backgrounds — deep black mark, muted frame |
| `public/favicon.svg` | Simplified mark only (no frame) for small sizes, neon cyan |

---

## 6. Color Story

### Narrative

The palette is drawn from **a darkened control room at night** — matte black surfaces lit by a single cyan indicator light. Every color has a role: the darks create depth, the cyan commands attention, the accents signal state.

### Primary Palette

| Token | Hex | Role |
|-------|-----|------|
| `--color-void` | `#0A0A0F` | Deepest background. The void. |
| `--color-surface` | `#12121A` | Card / panel background. Brushed metal base. |
| `--color-surface-raised` | `#1A1A2E` | Elevated surfaces. Modal overlays. |
| `--color-surface-hover` | `#222240` | Hover states on interactive surfaces. |

### Neon Accent

| Token | Hex | Role |
|-------|-----|------|
| `--color-neon` | `#00F0FF` | Primary action. The glow. Focus rings. |
| `--color-neon-muted` | `#00F0FF33` | Glow halos. Background washes. 20% opacity. |
| `--color-neon-strong` | `#00F0FFB3` | Emphasized text on dark. 70% opacity. |

### Semantic Colors

| Token | Hex | Role |
|-------|-----|------|
| `--color-success` | `#00FF88` | Complete action. Positive confirmation. |
| `--color-danger` | `#FF3366` | Delete action. Destructive warning. |
| `--color-warning` | `#FFB800` | Character limit approaching. Caution. |
| `--color-text-primary` | `#E8E8F0` | Primary body text. High contrast on dark. |
| `--color-text-secondary` | `#8888A0` | Timestamps. Hints. Secondary info. |
| `--color-text-disabled` | `#4A4A60` | Disabled / placeholder text. |

### Glow System

Neon colors are never flat. They radiate:

```css
/* Primary glow */
box-shadow: 0 0 20px #00F0FF33, 0 0 60px #00F0FF11;

/* Intense glow (focus, active) */
box-shadow: 0 0 20px #00F0FF66, 0 0 60px #00F0FF22, 0 0 120px #00F0FF0A;

/* Success glow */
box-shadow: 0 0 20px #00FF8833, 0 0 60px #00FF8811;

/* Danger glow */
box-shadow: 0 0 20px #FF336633, 0 0 60px #FF336611;
```

---

## 7. OG Image Description

> **For the Engineer to generate:**
>
> **Composition:** A 1200×630 image. Deep black background (`#0A0A0F`). The logo mark centered-left at ~200px diameter, rendered in neon cyan with a prominent glow halo (layered box-shadows). To the right, the wordmark "single-todo" in 48px geometric sans, `#E8E8F0`, letter-spaced +0.02em. Below the wordmark, the tagline "One thing. Done right." in 24px, `#8888A0`. The entire composition sits on a subtle brushed-metal texture overlay at 3% opacity. A faint 145° light gradient sweeps from top-left to bottom-right.
>
> **File:** `public/og-image.png` (1200×630, PNG, <200KB)

---

## 8. Hero Visual Description

> **For the Engineer to generate:**
>
> **Composition:** A full-viewport hero illustration for the empty state. Abstract: a single luminous orb (neon cyan, `#00F0FF`) floating in a vast dark space (`#0A0A0F`). The orb casts a soft downward glow onto a reflective floor surface (brushed-metal texture at 5% opacity). Particle motes drift slowly around the orb (4–6 tiny dots, `#00F0FF44`). The mood is: calm, focused, singular.
>
> **Implementation:** This should be a CSS/SVG animation, not a raster image, to keep bundle size minimal and enable interaction (the orb could pulse gently when the app is in empty state).

---

## 9. Typography

| Role | Font | Weight | Size | Tracking |
|------|------|--------|------|----------|
| **Logotype** | `Inter`, system sans-serif | 500 | — | +0.02em |
| **Headline** | `Inter`, system sans-serif | 700 | 32–48px | -0.01em |
| **Body** | `Inter`, system sans-serif | 400 | 16px | 0 |
| **Label (embossed)** | `Inter`, system sans-serif | 600 | 12–14px | +0.08em, uppercase |
| **Monospace** | `JetBrains Mono`, monospace | 400 | 14px | 0 |

**Embossed label effect:**

```css
.label-embossed {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #4A4A60;
  text-shadow: 0 1px 0 #1A1A2E, 0 -1px 0 #000000;
}
```

**Debossed heading effect:**

```css
.heading-debossed {
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: #E8E8F0;
  text-shadow: 0 2px 4px #00000080, 0 -1px 0 #FFFFFF08;
}
```

---

## Handoff

| Artifact | Path | Status |
|----------|------|--------|
| Brand Identity (this file) | `docs/design/brand-identity.md` | ✅ Complete |
| Logo (universal) | `public/logo.svg` | ✅ Created by Design |
| Logo (dark bg) | `public/logo-dark.svg` | ✅ Created by Design |
| Logo (light bg) | `public/logo-light.svg` | ✅ Created by Design |
| Favicon | `public/favicon.svg` | ✅ Created by Design |
| OG Image | `public/og-image.png` | 🔲 Engineer to generate from spec above |
| Hero Visual | CSS/SVG animation | 🔲 Engineer to implement from spec above |
