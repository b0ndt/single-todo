# ADR-003: Service Worker with Cache-First Strategy for Offline Support

## Status

Accepted

## Context

The app must work offline after the first load (REQ-007, C-4). Since there is no backend API to cache, "offline support" means caching the static assets (HTML, JS, CSS, icons) so the app shell loads without network.

Strategies considered:

| Strategy | Description | Fit |
|----------|-------------|-----|
| Cache-first (app shell) | SW pre-caches known assets on install; serves from cache, falls back to network | Best — static-only app |
| Network-first | Try network, fall back to cache | Overkill — no dynamic data |
| Stale-while-revalidate | Serve cache, update in background | Reasonable, but adds complexity for no benefit when assets are hash-versioned |

## Decision

Use a **service worker** with a **cache-first (pre-cache)** strategy for the app shell.

## Rationale

- **All assets are static and hash-versioned.** The SW pre-caches them at install time. On subsequent visits (online or offline), assets are served from the cache instantly.
- **No dynamic data fetches.** There are no API calls to cache or invalidate.
- **Update path**: When a new version is deployed, the SW detects changed hashes, downloads new assets, and activates on the next navigation. A simple "New version available — refresh" prompt suffices.
- **Workbox considered**: Workbox simplifies SW authoring but adds ~5 KB. For an app with < 10 assets to pre-cache, a hand-rolled SW (< 50 lines) is acceptable and avoids the dependency. Either approach is fine; the team may choose based on preference.

## Consequences

- First visit requires network to download and cache all assets.
- SW requires HTTPS in production (localhost is exempt during development).
- Browser support: All modern browsers support service workers. IE11 is not supported (acceptable for v1).
- Cache invalidation relies on a new SW file being generated each build (hash in filename or SW version bump).
