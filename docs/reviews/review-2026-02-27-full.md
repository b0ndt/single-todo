# QA Review — single-todo

**Date:** 2026-02-27
**Reviewer:** QA Reviewer (automated)
**Scope:** Full codebase review — correctness, security (OWASP), performance, code quality, tests, a11y, design compliance
**Commit branch:** `cursor/single-todo-project-review-0ac8`

---

## Summary

The single-todo application is well-architected and cleanly implemented. All 16 unit/integration tests pass across 4 test files. The production build (JS 9.93 KB + CSS 4.47 KB gzipped, ~14.4 KB total) is well within the 50 KB bundle budget. The state machine correctly enforces the single-todo invariant. TypeScript compiles with zero errors. No API keys or environment variables are required (client-side only). Five findings are documented below — none are blockers.

---

## Environment

- **Required API keys / env vars:** None. v1 is entirely client-side.
- **Blockers:** None.
- **Build:** `npm run build` succeeds. Output in `dist/`. (JS 25.23 KB raw / 9.93 KB gzip, CSS 19.71 KB raw / 4.47 KB gzip)
- **Tests:** `npm test` — 16/16 pass (4 test files, ~2.5s).
- **Typecheck:** `npm run typecheck` — zero errors.

---

## Findings

### 1. WARNING — `localStorage` write operations lack try-catch (correctness)

**Category:** Correctness / Resilience
**File:** `src/storageAdapter.ts` lines 75–82, 84–91

`saveTodo()` and `removeTodo()` call `storage.setItem()` / `storage.removeItem()` without a try-catch. While `getSafeStorage()` gracefully handles `localStorage` being entirely unavailable (falling back to in-memory), it does not guard against write-time exceptions on an accessible `Storage` object:

- `QuotaExceededError` — storage full (especially on mobile or with other sites consuming quota).
- `DOMException` / `SecurityError` — certain restricted browser contexts (e.g., older Safari private browsing would allow reads but throw on writes).

If `saveTodo()` throws inside `addTodo()`:

1. `transition()` never fires — state remains `empty`, but no todo was persisted.
2. The exception propagates through the `setTimeout` in `queueAction` — unhandled.
3. `setIsSubmitting(false)` never executes — the submit button is stuck in a permanent loading/disabled state.
4. The user is locked out until they refresh the page.

**Impact:** Users on storage-constrained devices or restricted contexts can hit a non-recoverable stuck UI.
**Recommendation:** Wrap `storage.setItem()` and `storage.removeItem()` in try-catch within the adapter. On write failure, either fall back to `memoryTodo` (best-effort) and surface a toast, or return an error that `addTodo` can propagate via `AddTodoResult`.

---

### 2. WARNING — No security headers in deployment config (OWASP)

**Category:** Security (OWASP A05:2021 — Security Misconfiguration)
**File:** `vercel.json`

The `vercel.json` only sets `Cache-Control` headers. No security-hardening headers are configured:

| Missing Header | Risk |
|---|---|
| `Content-Security-Policy` | No CSP means browser extensions, injected scripts, or a CDN compromise could execute arbitrary JS in the app's origin. |
| `X-Content-Type-Options: nosniff` | Browsers might MIME-sniff responses, potentially executing non-JS files as scripts. |
| `X-Frame-Options: DENY` | The app can be embedded in an iframe on a malicious site (clickjacking). |
| `Strict-Transport-Security` | No HSTS directive; the first visit could be intercepted over HTTP before redirect to HTTPS. |

While the app has no backend and Preact auto-escapes JSX, defense-in-depth headers are standard practice and required for a strong Lighthouse security score.

**Impact:** Low immediate risk (no backend, no secrets), but leaves the door open for future regressions and fails OWASP security misconfiguration checks.
**Recommendation:** Add a `Content-Security-Policy` header (e.g., `default-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self'`), along with `X-Content-Type-Options`, `X-Frame-Options`, and `Strict-Transport-Security` in the `vercel.json` headers block.

---

### 3. WARNING — Service Worker pre-cache list is manually maintained

**Category:** Correctness / Operations
**File:** `public/sw.js` lines 3–12

The `APP_SHELL_ASSETS` array is a hardcoded list of paths:

```js
const APP_SHELL_ASSETS = [
  '/', '/index.html',
  '/assets/app.js', '/assets/app.css',
  '/logo.svg', '/logo-dark.svg', '/logo-light.svg', '/favicon.svg',
];
```

Issues:

1. **Atomic failure:** `cache.addAll()` rejects if *any* URL returns a non-ok response. If the build output changes (e.g., a chunk split introduces `chunk-vendor.js`) or a file is renamed, the SW install fails silently and users lose offline support entirely.
2. **Unused asset cached:** `/logo.svg` is pre-cached but never referenced by any component — only `/logo-dark.svg` is used in `Logo.tsx`. This wastes cache space.
3. **No build-time validation:** Nothing verifies that the pre-cache list matches actual `dist/` output.

The version-based cache invalidation *does* work correctly: `registerServiceWorker.ts` appends `__APP_BUILD_ID__` (a build-time timestamp from `vite.config.ts`) as a query parameter, which changes the SW registration URL on each build, triggering a new install and old-cache cleanup. This is well implemented.

**Impact:** Build output drift could silently break offline support. Diagnosed only when an end-user reports the app not working offline.
**Recommendation:** Generate the asset list at build time (e.g., via a Vite plugin that reads the manifest and injects the list into `sw.js`), or switch to a tool like Workbox with `injectManifest` mode that automates precache list generation.

---

### 4. WARNING — Card-complete animation timing not synchronized with unmount

**Category:** Design Compliance
**Files:** `src/app.tsx` lines 173–180, `src/constants.ts`

The completion flow:

1. `setIsCompleting(true)` → queues an async Preact re-render
2. `queueAction(() => { machine.completeTodo(); })` → starts a `setTimeout` at `ACTION_LOADING_MS` (300ms)
3. Re-render fires (a few ms later) → DOM gets `.exiting-complete` class → CSS animation `card-complete` begins (duration: `--duration-normal` = 300ms)
4. At 300ms from step 2: `completeTodo()` fires → state transitions to `empty` → card unmounts

Because the CSS animation starts *after* the `setTimeout` is already ticking (due to the async re-render in step 3), the animation gets ~295–298ms to run instead of the full 300ms. The card unmounts before the final animation frame (opacity: 0, scale: 0.95) fully renders.

The design spec (active-todo.md §6, "Completion Choreography") defines a specific stagger sequence where the card should fully complete its exit before the empty state begins.

**Impact:** The final ~5ms of the card-complete fade are clipped. With `ease-in` timing, most of the visual change happens late, so the cut is slightly perceptible — the card vanishes at ~5% opacity rather than 0%. Functional correctness is unaffected.
**Recommendation:** Decouple the animation from the state transition: listen for the `animationend` event on the card, then trigger `completeTodo()`. Alternatively, add a small buffer (e.g., `ACTION_LOADING_MS + 50`) to ensure the animation fully completes before unmount.

---

### 5. INFO — Module-level singleton flag in storage adapter

**Category:** Code Quality
**File:** `src/storageAdapter.ts` line 4

`storageRecoveredFromCorruptData` is a module-level `let` shared across all `createStorageAdapter()` instances. If multiple adapters are created (e.g., in tests), they share this flag, creating implicit coupling. The test suite mitigates this by calling `consumeStorageCorruptRecovery()` in `beforeEach`.

**Impact:** Low. Single-instance usage in production. Test isolation is handled.
**Recommendation:** Move the flag into the adapter instance (return it as part of the adapter object), or into a dedicated recovery-state module to make ownership explicit.

---

## Requirements Traceability

| Requirement | Priority | Status | Evidence |
|---|---|---|---|
| REQ-001 Add a Todo | Must | **Pass** | `addTodo()` validates text, persists to localStorage; tested in `stateMachine.test.ts` (rejects empty/long/duplicate), `app.test.tsx` (end-to-end create flow) |
| REQ-002 Single-Todo Constraint | Must | **Pass** | State machine rejects `addTodo` when `status !== 'empty'` → `TODO_EXISTS`; input hidden in UI when active; tested |
| REQ-003 View Current Todo | Must | **Pass** | `TodoCard` renders active todo with text, timestamp; `EmptyVisual` + headline for empty state; tested |
| REQ-004 Complete a Todo | Must | **Pass** | `completeTodo()` clears localStorage, transitions to empty; tested in `stateMachine.test.ts` and `app.test.tsx` |
| REQ-005 Delete a Todo | Must | **Pass** | `requestDelete` → `confirmDelete` flow with ConfirmDialog; localStorage cleared; cancel path also tested |
| REQ-006 Persist in localStorage | Must | **Pass** ⚠ | `storageAdapter` read/write/corrupt-recovery tested; write failures not handled (Finding #1) |
| REQ-007 Offline Support | Must | **Pass** ⚠ | SW exists with cache-first strategy and dynamic version invalidation; pre-cache list manually maintained (Finding #3) |
| REQ-008 Responsive Layout | Must | **Pass** | Media queries at `<640px` / `≥640px` / `≥1024px`; touch targets ≥ 44px (`--size-touch-target`); mobile column stacking for buttons |
| REQ-009 Keyboard Accessibility | Must | **Pass** | Focus trap in ConfirmDialog; Escape key handling; Tab cycling between dialog buttons; focus restoration to previous element on close; tested in `app.test.tsx` |
| REQ-010 Screen Reader Accessibility | Must | **Pass** | ARIA labels on all interactive elements; `aria-live="assertive"` regions for toasts and announcements; `role="alertdialog"` on confirm dialog; single `main` landmark (verified by test); `prefers-reduced-motion` respected |
| REQ-011 Input Character Limit | Should | **Pass** | `maxlength=200` on input; `CharCounter` with warning (≤20) and danger (0) color states; state machine rejects `TEXT_TOO_LONG` |
| REQ-012 Confirmation on Delete | Should | **Pass** | `ConfirmDialog` with `role="alertdialog"`, `aria-modal="true"`, focus trap, Escape support, backdrop click to cancel |
| REQ-013 Timestamp Display | Should | **Pass** | `formatAddedTimestamp` utility with just-now / min / hours / yesterday / days / date ranges; 60s refresh interval; tested in `time.test.ts` |
| REQ-014 Empty State Illustration | Should | **Pass** | Animated orb with float + glow keyframe animations; responsive sizing across breakpoints; `aria-hidden="true"` |
| REQ-015 Performance Budget | Must | **Pass** | JS: 9.93 KB gzip, CSS: 4.47 KB gzip — total ~14.4 KB, well under 50 KB |

---

## Verdict

**PASS with warnings.** The application is functionally correct, well-tested (16 tests covering all critical paths), and performant. The state machine cleanly enforces the single-todo invariant. TypeScript, Preact, and the design system are used consistently. Accessibility implementation is strong — single `main` landmark, focus trap, ARIA labels, `prefers-reduced-motion`, live regions. No API keys or environment variables required. No blockers identified.

The four warnings are non-blocking items that should be addressed before production deploy, with Finding #1 (`localStorage` write failure resilience) being the highest priority.

| Severity | Count |
|---|---|
| CRITICAL | 0 |
| WARNING | 4 |
| INFO | 1 |
