# ADR-004: Explicit State Machine for Todo Lifecycle

## Status

Accepted

## Context

The core invariant (C-1: at most one active todo) must be enforced reliably. Approaches:

| Approach | Description | Risk |
|----------|-------------|------|
| Ad-hoc conditionals | Sprinkle `if (todo !== null)` checks across UI handlers | Easy to miss a path; constraint violations possible |
| State machine | Model states (`Empty`, `Active`, `ConfirmDelete`) and legal transitions explicitly | Impossible to reach an illegal state if machine is correct |
| State management lib (Redux, Zustand) | Centralized store with reducers | Adds weight; overkill for two states |

## Decision

Implement an **explicit state machine** as a plain JS module that owns all todo state and exposes transition functions.

## Rationale

- **Correctness by construction**: The machine only allows `addTodo` when in `Empty` state and `completeTodo`/`requestDelete` when in `Active` state. Illegal transitions throw or no-op, guaranteeing the single-todo invariant.
- **Testability**: The machine is a pure module with no DOM dependency. Unit tests cover every transition and every illegal-transition rejection.
- **Simplicity**: Two primary states, one transient state. No external library needed — a `switch` or object-literal dispatch table is sufficient.
- **Separation of concerns**: UI components subscribe to state changes but never mutate state directly. This keeps rendering logic free of business rules.

## Consequences

- All state mutations flow through the machine. UI handlers call machine functions, never `localStorage` directly.
- Adding states in v2 (e.g., `Editing`) means extending the machine — well-defined change surface.
- Slightly more upfront structure than ad-hoc checks, but pays off immediately in confidence and testability.

## State Transition Table

| Current State | Event | Next State | Side Effects |
|--------------|-------|-----------|--------------|
| Empty | `addTodo(text)` | Active | Validate input; persist to localStorage |
| Active | `completeTodo()` | Empty | Remove from localStorage |
| Active | `requestDelete()` | ConfirmDelete | Show confirmation UI |
| ConfirmDelete | `confirmDelete()` | Empty | Remove from localStorage |
| ConfirmDelete | `cancelDelete()` | Active | Dismiss confirmation UI |
