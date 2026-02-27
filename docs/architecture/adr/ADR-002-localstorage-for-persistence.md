# ADR-002: Use localStorage for Persistence

## Status

Accepted

## Context

The app must persist the active todo across page refreshes (REQ-006) without a backend (C-3). Browser storage options:

| Option | Capacity | API | Async | Complexity |
|--------|----------|-----|-------|-----------|
| `localStorage` | ~5 MB | Sync key-value | No | Minimal |
| `IndexedDB` | ~50 MB+ | Async, transactional | Yes | Moderate |
| Cookies | ~4 KB | String-based | No | Low, but sent to server |
| `sessionStorage` | ~5 MB | Sync key-value | No | Minimal (tab-scoped) |

## Decision

Use **`localStorage`** via a thin adapter module.

## Rationale

- **Simplicity**: The app stores a single JSON object (< 1 KB). `localStorage`'s synchronous `getItem`/`setItem` is the simplest correct choice.
- **Persistence scope**: `localStorage` persists across tabs and browser restarts, unlike `sessionStorage`.
- **No async overhead**: IndexedDB's transactional async API adds complexity with zero benefit for a single-key store.
- **Adapter pattern**: All `localStorage` access goes through a `StorageAdapter` module. If v2 needs IndexedDB (e.g., for history), only the adapter changes.

## Consequences

- Synchronous reads on the main thread. Acceptable for a single key; would need revisiting if data grows.
- 5 MB limit is irrelevant for one todo (< 1 KB).
- Private/incognito mode may have restricted or ephemeral `localStorage` — acceptable for v1.
