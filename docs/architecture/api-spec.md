# API Specification — single-todo

> **Note:** v1 has no backend. This document specifies the **internal module API** — the contract between the UI layer and the state machine / storage adapter. This serves as the integration boundary that a future backend API would replace.

---

## 1. State Machine API

The state machine is the single source of truth. UI components call these functions and subscribe to state changes.

### 1.1 Types

```typescript
interface Todo {
  text: string;        // 1–200 characters, trimmed, non-empty
  createdAt: string;   // ISO 8601 UTC timestamp (e.g., "2026-02-27T10:30:00.000Z")
}

type AppState =
  | { status: "empty" }
  | { status: "active"; todo: Todo }
  | { status: "confirm-delete"; todo: Todo };

type Subscriber = (state: AppState) => void;
```

### 1.2 Functions

#### `getState(): AppState`

Returns the current application state.

- **Returns:** `AppState`
- **Side effects:** None.

---

#### `subscribe(fn: Subscriber): () => void`

Registers a callback that fires on every state change. Returns an unsubscribe function.

- **Parameters:**
  - `fn` — Callback receiving the new `AppState`.
- **Returns:** `() => void` — call to unsubscribe.

---

#### `addTodo(text: string): { ok: true } | { ok: false; error: string }`

Creates a new todo if no active todo exists.

- **Precondition:** State is `empty`.
- **Parameters:**
  - `text` — Raw input string.
- **Validation:**
  - Trim whitespace.
  - Reject if empty after trimming → `{ ok: false, error: "EMPTY_TEXT" }`
  - Reject if length > 200 → `{ ok: false, error: "TEXT_TOO_LONG" }`
  - Reject if state ≠ `empty` → `{ ok: false, error: "TODO_EXISTS" }`
- **On success:**
  - Persist `{ text, createdAt }` to localStorage.
  - Transition state to `active`.
  - Notify subscribers.
  - Return `{ ok: true }`.

---

#### `completeTodo(): void`

Marks the active todo as done and returns to empty state.

- **Precondition:** State is `active`.
- **Side effects:**
  - Remove todo from localStorage.
  - Transition state to `empty`.
  - Notify subscribers.
- **No-op** if state is not `active`.

---

#### `requestDelete(): void`

Begins the delete flow by entering the confirmation state.

- **Precondition:** State is `active`.
- **Side effects:**
  - Transition state to `confirm-delete`.
  - Notify subscribers.
- **No-op** if state is not `active`.

---

#### `confirmDelete(): void`

Confirms deletion and returns to empty state.

- **Precondition:** State is `confirm-delete`.
- **Side effects:**
  - Remove todo from localStorage.
  - Transition state to `empty`.
  - Notify subscribers.
- **No-op** if state is not `confirm-delete`.

---

#### `cancelDelete(): void`

Cancels the delete flow and returns to active state.

- **Precondition:** State is `confirm-delete`.
- **Side effects:**
  - Transition state to `active`.
  - Notify subscribers.
- **No-op** if state is not `confirm-delete`.

---

## 2. Storage Adapter API

Thin wrapper around `localStorage`. The state machine is the only consumer.

### 2.1 Constants

```typescript
const STORAGE_KEY = "single-todo";
```

### 2.2 Functions

#### `loadTodo(): Todo | null`

Reads and deserializes the stored todo.

- **Returns:** `Todo` object or `null` if key is missing or data is corrupt.
- **Error handling:** If `JSON.parse` fails, logs a warning and returns `null` (treat as empty).

---

#### `saveTodo(todo: Todo): void`

Serializes and writes the todo to localStorage.

- **Parameters:**
  - `todo` — A valid `Todo` object.
- **Side effects:** `localStorage.setItem(STORAGE_KEY, JSON.stringify(todo))`

---

#### `removeTodo(): void`

Deletes the todo from localStorage.

- **Side effects:** `localStorage.removeItem(STORAGE_KEY)`

---

## 3. localStorage Schema

A single key is used:

| Key | Value Type | Example |
|-----|-----------|---------|
| `single-todo` | JSON string | `{"text":"Buy milk","createdAt":"2026-02-27T10:30:00.000Z"}` |

When no todo exists, the key is absent (removed, not set to `null` or `""`).

---

## 4. Error Codes

| Code | Meaning | Triggered By |
|------|---------|-------------|
| `EMPTY_TEXT` | Input is empty or whitespace-only after trimming | `addTodo` |
| `TEXT_TOO_LONG` | Input exceeds 200 characters after trimming | `addTodo` |
| `TODO_EXISTS` | Attempted to add when an active todo already exists | `addTodo` |

---

## 5. Future: REST API (v2 Sketch)

If a backend is introduced in v2, the internal API maps cleanly to REST:

| Internal Function | HTTP Method | Endpoint | Request Body | Response |
|------------------|------------|----------|-------------|----------|
| `getState` | `GET` | `/api/todo` | — | `200 { todo }` or `200 { todo: null }` |
| `addTodo` | `POST` | `/api/todo` | `{ "text": "..." }` | `201 { todo }` or `409 conflict` |
| `completeTodo` | `POST` | `/api/todo/complete` | — | `200 { }` or `404` |
| `confirmDelete` | `DELETE` | `/api/todo` | — | `200 { }` or `404` |

This sketch is informational only and is **not** in scope for v1.
