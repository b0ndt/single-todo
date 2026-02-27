# Component: Logo

> The mark. One dot. One check. One purpose.

---

## Overview

The logo renders as an inline SVG. It is a rounded-square frame containing a circle with a carved checkmark. The mark uses `currentColor` for universal background compatibility, with an optional neon glow effect.

The logo is the brand in microcosm: a single focused shape, lit by the same 145° light source as everything else, with a neon glow that whispers "this is alive."

---

## Variants

| Variant | File | Usage |
|---------|------|-------|
| **Universal** | `public/logo.svg` | Default — uses `currentColor`, works everywhere |
| **Dark background** | `public/logo-dark.svg` | Neon cyan on dark — for the app UI |
| **Light background** | `public/logo-light.svg` | Deep black on light — for marketing / light contexts |
| **Favicon** | `public/favicon.svg` | Simplified mark only (no frame) |

---

## States

| State | Visual |
|-------|--------|
| Default | Static mark with subtle idle glow |
| Hover | Glow intensifies (if interactive — e.g., link to home) |

---

## Sizes

| Context | Height | Width (auto) |
|---------|--------|-------------|
| App header | 40px | Auto |
| OG image | 200px | Auto |
| Favicon | 32px | 32px |

---

## CSS

```css
.logo {
  height: 40px;
  width: auto;
  filter: drop-shadow(0 0 8px #00F0FF22);
  transition: filter var(--duration-fast) ease;
}

.logo:hover {
  filter: drop-shadow(0 0 16px #00F0FF44);
}
```

---

## Structure

```html
<a href="/" class="logo-link" aria-label="single-todo home">
  <img src="/logo.svg" alt="single-todo" class="logo" width="40" height="40" />
</a>
```

Or inline SVG for zero-request rendering — see `public/logo.svg` for source.

---

## Accessibility

- Wrapped in a link: `aria-label="single-todo home"`
- If not a link: `role="img"`, `aria-label="single-todo logo"`
- Alt text: "single-todo"
