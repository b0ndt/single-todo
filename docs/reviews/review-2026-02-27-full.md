# QA Review — single-todo

**Date:** 2026-02-27
**Reviewer:** QA Reviewer (automated)
**Scope:** Full codebase review — correctness, security, performance, code quality, tests, a11y, design compliance
**Commit branch:** `cursor/single-todo-full-review-2202`

---

## Summary

The single-todo application is well-architected and cleanly implemented. All 14 unit tests pass. The production build (JS 9.76 KB + CSS 4.34 KB gzipped) is well within the 50 KB bundle budget. The state machine correctly enforces the single-todo invariant. No API keys or environment variables are required (client-side only). Five findings are documented below — none are blockers.

---

## Environment

- **Required API keys / env vars:** None. v1 is entirely client-side.
- **Blockers:** None.
- **Build:** `npm run build` succeeds. Output in `dist/`.
- **Tests:** `npm test` — 14/14 pass (4 test files, 1.88s).

---

## Findings

### 1. WARNING — Service worker cache invalidation is manual

**Category:** Correctness / Operations
**Files:** `public/sw.js`, `vite.config.ts`

The service worker is a static file in `public/` with a hardcoded `CACHE_NAME = 'single-todo-v1'`. The Vite build outputs non-hashed filenames (`assets/app.js`, `assets/app.css`). When new code is deployed:

- If `sw.js` content has not changed, the browser does not install a new SW.
- The old SW continues serving stale cached assets indefinitely.

ADR-003 acknowledges this: *"Cache invalidation relies on a new SW file being generated each build (hash in filename or SW version bump)."* However, no build-time automation exists to bump `CACHE_NAME` or inject a build hash into `sw.js`.

**Impact:** Users may be stuck on a stale version after deploy until they clear site data.
**Recommendation:** Inject a build timestamp or content hash into `sw.js` at build time (e.g., via a Vite plugin or post-build script), or switch to hashed asset filenames so the pre-cache list itself changes the SW content.

---

### 2. WARNING — Duplicate `main` landmarks (a11y)

**Category:** Accessibility (WCAG 2.1 AA)
**File:** `src/app.tsx` lines 209, 214

The outer shell div has `role="main"`:
```tsx
<div class="app-shell" role="main" aria-label="single-todo">
```

Inside it, there is a `<main>` element:
```tsx
<main class="app-content">
```

This creates two `main` landmarks in the accessibility tree. Screen readers announce both, which is confusing. WCAG best practice: a page should have exactly one `main` landmark.

**Impact:** Screen reader users encounter two "main" regions, reducing navigability.
**Recommendation:** Remove `role="main"` from the outer `<div>` and keep the semantic `<main>` element. The outer div can remain as a generic container or use `role="application"` if needed, though a plain `<div>` is sufficient.

---

### 3. WARNING — Dialog and card exit animations do not play

**Category:** Design Compliance
**Files:** `src/components/ConfirmDialog.tsx`, `src/app.tsx`

The design spec (confirm-delete.md §6, user-flows.md §7) defines exit animations for the confirm dialog (`dialog-exit`, `backdrop-exit`) and a staggered close sequence. The implementation unmounts the dialog immediately when `open` becomes `false` (`if (!open) return null;`), so no exit animation plays on cancel or confirm.

Additionally, the card-complete animation (`card-complete`, 300ms) starts when `isCompleting` is set to `true`, but the state machine's `completeTodo()` fires after only `ACTION_LOADING_MS` (200ms), unmounting the card before the 300ms animation finishes.

**Impact:** Visual transitions are abrupt rather than choreographed per spec. Functional correctness is unaffected.
**Recommendation:**
- For dialog exit: delay unmount until the exit animation completes (e.g., set an `isExiting` state, apply exit CSS class, then unmount after animation duration).
- For card complete: increase `ACTION_LOADING_MS` to match `--duration-normal` (300ms), or decouple the animation from the state transition timing.

---

### 4. WARNING — Action buttons lack `flex: 1` on todo card

**Category:** Design Compliance
**File:** `src/styles.css` (`.action-row`, `.btn`)

The active-todo.md spec defines action buttons as "Two buttons side by side, equal width" with `flex: 1`. In the CSS, `.confirm-actions .btn` correctly gets `flex: 1`, but `.action-row .btn` does not. The "Done" and "Drop it" buttons on the todo card are content-sized, not equal width.

**Impact:** Minor visual deviation from spec on desktop. On mobile, buttons stack full-width so the difference is invisible.
**Recommendation:** Add `.action-row .btn { flex: 1; }` to match the spec.

---

### 5. INFO — Module-level singleton flag in storage adapter

**Category:** Code Quality
**File:** `src/storageAdapter.ts` line 4

`storageRecoveredFromCorruptData` is a module-level boolean shared across all `createStorageAdapter()` instances. This creates implicit coupling — if multiple adapters are created (e.g., in tests), they share this flag. The test suite already mitigates this by calling `consumeStorageCorruptRecovery()` in `beforeEach`.

**Impact:** Low. Single-instance usage in production. Test isolation is handled.
**Recommendation:** Consider moving the flag into the adapter instance or into a dedicated recovery-state module to make ownership explicit.

---

## Requirements Traceability

| Requirement | Priority | Status | Evidence |
|-------------|----------|--------|----------|
| REQ-001 Add a Todo | Must | **Pass** | `addTodo()` validates and persists; tested in `stateMachine.test.ts`, `app.test.tsx` |
| REQ-002 Single-Todo Constraint | Must | **Pass** | State machine rejects `addTodo` when `status !== 'empty'`; input hidden in UI |
| REQ-003 View Current Todo | Must | **Pass** | `TodoCard` renders active todo; `EmptyVisual` + headline for empty state |
| REQ-004 Complete a Todo | Must | **Pass** | `completeTodo()` clears localStorage; UI returns to empty; tested |
| REQ-005 Delete a Todo | Must | **Pass** | `requestDelete` → `confirmDelete` flow; localStorage cleared; tested |
| REQ-006 Persist in localStorage | Must | **Pass** | `storageAdapter` read/write tested; corrupt data recovery tested |
| REQ-007 Offline Support | Must | **Pass** ⚠ | SW exists with cache-first strategy; cache invalidation is manual (Finding #1) |
| REQ-008 Responsive Layout | Must | **Pass** | Media queries at 640px/1024px; touch targets ≥ 44px; mobile column stacking |
| REQ-009 Keyboard Accessibility | Must | **Pass** | Focus trap in dialog; Escape key handling; tab cycling; focus restoration |
| REQ-010 Screen Reader Accessibility | Must | **Pass** ⚠ | ARIA labels match spec; `aria-live` regions present; duplicate `main` landmarks (Finding #2) |
| REQ-011 Input Character Limit | Should | **Pass** | `maxlength=200` on input; `CharCounter` with warning/danger states |
| REQ-012 Confirmation on Delete | Should | **Pass** | `ConfirmDialog` with `role="alertdialog"`, `aria-modal="true"` |
| REQ-013 Timestamp Display | Should | **Pass** | `formatAddedTimestamp` utility with 60s refresh interval; all ranges tested |
| REQ-014 Empty State Illustration | Should | **Pass** | Animated orb with float + glow; responsive sizing; `aria-hidden="true"` |
| REQ-015 Performance Budget | Must | **Pass** | JS: 9.76 KB gzip, CSS: 4.34 KB gzip — total ~14 KB, well under 50 KB |

---

## Verdict

**PASS with warnings.** The application is functionally correct, well-tested, secure (no injection vectors, no backend surface), and performant. The four warnings are non-blocking polish items that should be addressed before production deploy. No blockers identified. No API keys or environment variables required.

| Severity | Count |
|----------|-------|
| CRITICAL | 0 |
| WARNING | 4 |
| INFO | 1 |
