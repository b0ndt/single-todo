# Component: EmptyVisual

> A luminous orb in the void. Calm. Singular. Waiting.

---

## Overview

The EmptyVisual is a decorative animated element shown on the Empty State screen. It depicts a floating, glowing orb that represents the space where a todo will live. It is purely decorative and hidden from screen readers.

The orb is the emotional heart of the empty state. It communicates: "There's nothing here, but this space is alive. It's waiting for you." The gentle float and glow cycle give the app a sense of breathing presence, even when idle.

---

## Variants

| Variant | Usage |
|---------|-------|
| **Default** | Single orb with glow and reflection |

---

## States

| State | Visual |
|-------|--------|
| **Idle** | Floating animation (vertical bob) + glow pulsing |
| **Entry** | Scales from 0.8 → 1, fades in (600ms, spring) |
| **Exit** | Scales to 0.95, fades out (300ms) when todo is added |

---

## Structure

```html
<div class="empty-visual" aria-hidden="true">
  <div class="orb">
    <div class="orb-inner"></div>
  </div>
  <div class="orb-reflection"></div>
</div>
```

---

## CSS

```css
.empty-visual {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.orb {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  animation:
    orb-float 4s var(--ease-in-out) infinite,
    orb-glow-shadow 4s var(--ease-in-out) infinite;
}

.orb-inner {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: radial-gradient(
    circle at 35% 35%,
    #00F0FF44 0%,
    #00F0FF18 30%,
    #00F0FF08 50%,
    transparent 70%
  );
  border: 1px solid #00F0FF33;
  box-shadow:
    inset 0 0 30px #00F0FF11,
    inset -10px -10px 20px #00000044;
}

.orb-reflection {
  width: 80px;
  height: 20px;
  border-radius: 50%;
  background: radial-gradient(
    ellipse,
    #00F0FF11 0%,
    transparent 70%
  );
  margin-top: var(--space-3);
  animation: reflection-pulse 4s var(--ease-in-out) infinite;
}

/* Entry */
.empty-visual.entering .orb {
  animation: 
    orb-enter 600ms var(--ease-spring) forwards,
    orb-float 4s var(--ease-in-out) infinite 600ms,
    orb-glow-shadow 4s var(--ease-in-out) infinite 600ms;
}

/* Exit */
.empty-visual.exiting {
  animation: empty-visual-exit 300ms var(--ease-in) forwards;
}

/* Keyframes */
@keyframes orb-float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

@keyframes orb-glow-shadow {
  0%, 100% {
    box-shadow: 0 0 40px #00F0FF33, 0 0 80px #00F0FF18, 0 0 120px #00F0FF0A;
  }
  50% {
    box-shadow: 0 0 50px #00F0FF44, 0 0 100px #00F0FF22, 0 0 160px #00F0FF11;
  }
}

@keyframes reflection-pulse {
  0%, 100% {
    opacity: 0.6;
    transform: scaleX(1);
  }
  50% {
    opacity: 0.9;
    transform: scaleX(1.1);
  }
}

@keyframes orb-enter {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes empty-visual-exit {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.95);
  }
}
```

### Material Detail

The orb's radial gradient is offset to `35% 35%` — this places the bright point at the top-left, consistent with the 145° light source. The `inset` box-shadows create an inner shadow at the bottom-right, simulating a translucent sphere catching light on one side.

The reflection below is a squashed ellipse that pulses in sync with the orb's glow cycle, creating the illusion of light bouncing off a floor plane.

---

## Responsive

| Breakpoint | Orb Size | Reflection |
|-----------|----------|-----------|
| Mobile (< 640px) | 80px | 56px wide, 14px tall |
| Tablet (≥ 640px) | 100px | 68px wide, 17px tall |
| Desktop (≥ 1024px) | 120px | 80px wide, 20px tall |

```css
@media (max-width: 639px) {
  .orb {
    width: 80px;
    height: 80px;
  }
  .orb-reflection {
    width: 56px;
    height: 14px;
  }
}

@media (min-width: 640px) and (max-width: 1023px) {
  .orb {
    width: 100px;
    height: 100px;
  }
  .orb-reflection {
    width: 68px;
    height: 17px;
  }
}
```

---

## Accessibility

- `aria-hidden="true"` — entirely decorative
- No interactive elements
- `prefers-reduced-motion`: All animations reduced to 0.01ms
- Does not convey any information — screen readers skip entirely
