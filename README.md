# single-todo

single-todo is a dark-mode, offline-capable Preact app that intentionally allows **exactly one active todo** at a time.

## Tech stack

- Preact + TypeScript + Vite
- LocalStorage persistence through a storage adapter
- Explicit state machine (`empty -> active -> confirm-delete`)
- Service worker (`public/sw.js`) for offline shell support
- Vitest + Testing Library for critical-path tests

## Requirements covered

- Add, view, complete, delete a single todo
- Input validation (empty/whitespace, max 200 chars)
- Character counter with warning and danger states
- Confirm-delete modal with focus trap and Escape handling
- ARIA labels, focus-visible states, live region announcements
- Responsive behavior from mobile through desktop
- Token-driven design system styling

## Design assets

- Runtime brand assets are loaded from `public/` (`logo.svg`, `logo-dark.svg`, `logo-light.svg`, `favicon.svg`, `og-image.svg`).
- Screen/layout fidelity is implemented from `wireframes/*.html` and the design specs in `docs/design/`.
- `docs/design/mockups/*.png` assets are treated as visual references when present; the shipped UI does not depend on those files at runtime.

## Setup

```bash
npm install
npm run dev
```

App runs at the Vite local URL (typically `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview
```

## Test

```bash
npm test
```

## Environment variables / API keys

None required for v1.

If browser storage is unavailable, the app falls back to an in-memory store for the current session.

## Deployment (Vercel)

`vercel.json` is included with:

- SPA rewrite to `index.html`
- immutable asset caching for `/assets/*`
- revalidation headers for `index.html` and `sw.js`
- service worker registration with a per-build version query (`/sw.js?v=<build-id>`) to avoid stale shell caches after deploys
