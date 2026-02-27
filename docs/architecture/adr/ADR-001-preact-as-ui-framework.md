# ADR-001: Use Preact as UI Framework

## Status

Accepted

## Context

The app must ship a gzipped JS bundle under 50 KB (REQ-015, C-6) while still providing a component model, reactive rendering, and good developer ergonomics. The options considered:

| Option | Gzipped Size | Ecosystem | DX |
|--------|-------------|-----------|-----|
| Vanilla JS (no framework) | 0 KB overhead | None | Manual DOM diffing, event wiring |
| Preact | ~4 KB | Compatible with most React libs via `preact/compat` | JSX, hooks, components |
| React 18 | ~42 KB | Largest | JSX, hooks, components |
| Svelte | ~2 KB runtime | Growing | Compiler-based, different mental model |

## Decision

Use **Preact** (with hooks) as the UI layer.

## Rationale

- **Bundle budget**: Preact's ~4 KB gzipped leaves ample room for app code within the 50 KB ceiling. React alone nearly exhausts the budget.
- **Familiar API**: JSX + hooks are well-known; lowers the onboarding bar for contributors compared to Svelte's compiler approach.
- **Sufficient for scope**: The app has ~3 components and one piece of state. Preact's feature set is more than enough.
- **Vanilla JS rejected**: While zero-framework is smallest, hand-rolling reactivity and DOM updates for even this small app adds unnecessary bug surface and maintenance cost.

## Consequences

- Developers need Node.js tooling (npm, a bundler) for JSX compilation.
- If the app grows in v2, `preact/compat` enables incremental adoption of React-ecosystem libraries.
- Svelte could yield a marginally smaller bundle but would require the team to learn a new paradigm for minimal gain.
