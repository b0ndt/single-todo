# QA Review — single-todo

**Date:** 2026-02-27
**Reviewer:** QA Reviewer (automated)
**Scope:** Full codebase review — correctness, security (OWASP), performance, code quality, tests, a11y, design compliance
**Branch:** `cursor/single-todo-project-review-1500`

---

## Summary

single-todo is cleanly implemented: Preact + explicit state machine + localStorage adapter. All 18 unit/integration tests pass across 4 test files. TypeScript compiles with zero errors. The production build totals ~14.5 KB gzipped (JS 9.93 KB + CSS 4.57 KB), well under the 50 KB budget. The state machine correctly enforces the single-todo invariant. No API keys or environment variables are required. Five findings below — zero blockers, zero critical.

---

## Environment

- **Required API keys / env vars:** None. v1 is entirely client-side.
- **Blockers:** None.
- **Build:** `npm run build` succeeds. Output: JS 25.23 KB raw / 9.93 KB gzip, CSS 20.42 KB raw / 4.57 KB gzip.
- **Tests:** `vitest run` — 18/18 pass (4 files, ~2.8s).
- **Typecheck:** `tsc -b` — zero errors.

---

## Findings

### 1. WARNING — `localStorage` write failures unhandled → stuck UI (Correctness)

**File:** `src/storageAdapter.ts:75–91`

`saveTodo()` and `removeTodo()` call `storage.setItem()` / `storage.removeItem()` without try-catch. While `getSafeStorage()` handles localStorage being entirely inaccessible (returns null → memory fallback), it does not guard against runtime write exceptions on an otherwise accessible `Storage` object:

- `QuotaExceededError` — storage full (mobile devices, restricted quota).
- `SecurityError` — certain restricted browser contexts at write time.

**Failure cascade in `addTodo()` (via `app.tsx` `handleAddTodo`):**
1. `storage.saveTodo()` throws inside the `queueAction` setTimeout callback.
2. `transition()` never fires — state stays `empty`, but no todo was persisted.
3. `setIsSubmitting(false)` never executes — submit button is stuck in permanent loading/disabled state.
4. User is locked out of the app until page refresh.

**Impact:** Medium. Users on storage-constrained devices hit a non-recoverable stuck UI.
**Action:** Wrap `storage.setItem()` / `storage.removeItem()` in try-catch. On write failure, fall back to `memoryTodo` and surface a toast via an error return from the adapter.

---

### 2. WARNING — Non-hashed asset filenames combined with `immutable` cache-control (Correctness / Operations)

**Files:** `vite.config.ts:16–24`, `vercel.json:12–17`

The Vite build produces fixed filenames (`assets/app.js`, `assets/app.css`) with no content hash:

```ts
entryFileNames: 'assets/app.js',
```

Meanwhile, `vercel.json` sets `Cache-Control: public, max-age=31536000, immutable` on `/assets/*`.

The `immutable` directive tells browsers to never revalidate the cached response for that URL. When a new build deploys changed JS under the same `/assets/app.js` path, returning users whose browser has the old file cached will continue serving the stale version indefinitely — the browser will not even issue a conditional request.

The SW versioning (`__APP_BUILD_ID__` query param) triggers a new SW install, but `cache.addAll()` in the SW may also hit the browser's HTTP cache and receive the stale `immutable` response.

**Impact:** Medium. Users may never receive updates after their first visit until they manually clear their browser cache.
**Action:** Either (a) add content hashes to filenames (`entryFileNames: 'assets/app-[hash].js'`) and generate the SW precache list at build time, or (b) change the `/assets/*` cache header to `public, max-age=0, must-revalidate` to match the non-hashed naming strategy.

---

### 3. WARNING — No security-hardening HTTP headers (OWASP A05:2021)

**File:** `vercel.json`

Only `Cache-Control` headers are configured. Missing defense-in-depth headers:

| Missing Header | Risk |
|---|---|
| `Content-Security-Policy` | No CSP — a CDN compromise or browser extension could inject arbitrary scripts in the app's origin. |
| `X-Content-Type-Options: nosniff` | MIME-sniffing could execute non-JS resources as scripts. |
| `X-Frame-Options: DENY` | App can be iframe-embedded for clickjacking. |
| `Strict-Transport-Security` | First visit can be intercepted over HTTP before HTTPS redirect. |

**Impact:** Low immediate risk (no backend, no secrets, Preact auto-escapes JSX). Fails OWASP security misconfiguration checks.
**Action:** Add to `vercel.json`:
```
Content-Security-Policy: default-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```

---

### 4. WARNING — Service Worker pre-cache list manually maintained (Correctness)

**File:** `public/sw.js:3–13`

`APP_SHELL_ASSETS` is a hardcoded array. Issues:

1. **Atomic failure:** `cache.addAll()` rejects if *any* URL 404s. If the build output changes (e.g., code splitting adds a chunk), the SW install silently fails and offline support breaks for all users.
2. **Stale entry:** `/logo.svg` is pre-cached but never referenced — `Logo.tsx` uses `/logo-dark.svg` only. Wastes cache space.
3. **No build-time validation:** Nothing verifies the list matches actual `dist/` output.

The version-based cache invalidation (`__APP_BUILD_ID__` query param on SW registration URL) works correctly — new deploys trigger re-install and stale cache cleanup. This part is well implemented.

**Impact:** Medium. Build output drift silently breaks offline (REQ-007). Diagnosed only when a user reports the issue.
**Action:** Generate the asset list at build time via a Vite plugin or switch to Workbox `injectManifest`.

---

### 5. INFO — Animation timing mismatch on card-complete exit

**Files:** `src/app.tsx:173–180`, `src/styles.css:849–863`

The completion flow:
1. `setIsCompleting(true)` → queues async Preact re-render
2. `queueAction` starts a 300ms `setTimeout`
3. Re-render fires (~2ms later) → `.exiting-complete` class added → CSS `card-complete` animation begins (300ms)
4. At 300ms from step 2: `completeTodo()` fires → state → `empty` → card unmounts

The CSS animation starts slightly after the timer, so it gets ~297ms to run. The card unmounts before the final frame (opacity 0, scale 0.95) fully renders. With `ease-in` timing, visible change is late in the curve, so the cut is perceptible.

**Impact:** Low. ~3–5ms clipping of exit animation. Functionally correct.
**Action:** Listen for `animationend` before calling `completeTodo()`, or add a small buffer to the timeout.

---

## Requirements Traceability

| Requirement | Priority | Status | Evidence |
|---|---|---|---|
| REQ-001 Add a Todo | Must | **Pass** | State machine validates text (empty, >200, duplicate); `stateMachine.test.ts` + `app.test.tsx` end-to-end create flow |
| REQ-002 Single-Todo Constraint | Must | **Pass** | `addTodo` rejects when `status !== 'empty'` → `TODO_EXISTS`; input hidden in UI when active; tested |
| REQ-003 View Current Todo | Must | **Pass** | `TodoCard` renders text + timestamp; `EmptyVisual` + headline for empty state; tested |
| REQ-004 Complete a Todo | Must | **Pass** | `completeTodo()` clears localStorage, transitions to empty; tested in state machine + app |
| REQ-005 Delete a Todo | Must | **Pass** | `requestDelete` → `confirmDelete` flow with ConfirmDialog; cancel path also tested |
| REQ-006 Persist in localStorage | Must | **Pass** ⚠ | Read/write/corrupt-recovery tested; write failures unhandled (Finding #1) |
| REQ-007 Offline Support | Must | **Pass** ⚠ | SW cache-first strategy + version invalidation present; pre-cache list manually maintained (Finding #4) |
| REQ-008 Responsive Layout | Must | **Pass** | 3 breakpoints (`<640px`, `≥640px`, `≥1024px`); touch targets ≥44px; mobile column stacking for action buttons |
| REQ-009 Keyboard Accessibility | Must | **Pass** | Focus trap in ConfirmDialog; Escape key handling; Tab cycling; focus restoration on close; tested in `app.test.tsx` |
| REQ-010 Screen Reader a11y | Must | **Pass** | ARIA labels on all interactive elements; `aria-live="assertive"` regions; `role="alertdialog"` + `aria-modal`; single `main` landmark verified by test; `prefers-reduced-motion` respected |
| REQ-011 Input Char Limit | Should | **Pass** | `maxlength=200` on input; `CharCounter` with warning (≤20) + danger (0) states; state machine rejects `TEXT_TOO_LONG`; tested |
| REQ-012 Confirmation on Delete | Should | **Pass** | `ConfirmDialog` with alertdialog role, focus trap, Escape, backdrop click; both cancel and confirm paths tested |
| REQ-013 Timestamp Display | Should | **Pass** | `formatAddedTimestamp` with just-now/min/hours/yesterday/days/date ranges; 60s refresh interval; tested in `time.test.ts` |
| REQ-014 Empty State Illustration | Should | **Pass** | Animated CSS orb with float + glow keyframes; responsive sizing; `aria-hidden="true"` |
| REQ-015 Performance Budget | Must | **Pass** | JS 9.93 KB + CSS 4.57 KB gzip = ~14.5 KB total, well under 50 KB |

---

## Verdict

**PASS with warnings.** The application is functionally correct, well-tested (18 tests, all critical paths covered), type-safe, and performant at ~14.5 KB gzipped. The state machine enforces the single-todo invariant reliably. Accessibility is strong — focus management, ARIA labels, reduced-motion support, live regions. No API keys required. No blockers.

Four warnings should be addressed before production deploy. Priority order:

1. **Finding #2** (immutable cache + non-hashed filenames) — can cause users to permanently run stale code.
2. **Finding #1** (localStorage write failures) — can lock the UI on constrained devices.
3. **Finding #4** (manual SW precache list) — can silently break offline support.
4. **Finding #3** (missing security headers) — defense-in-depth best practice.

| Severity | Count |
|---|---|
| CRITICAL | 0 |
| WARNING | 4 |
| INFO | 1 |
