# Glossary — single-todo

| Term | Definition |
|------|-----------|
| **Active Todo** | The single todo item currently held by the app. At most one exists at any time. |
| **Empty State** | The UI shown when no active todo exists; includes a prompt to add one. |
| **Complete** | User action that marks the active todo as done and removes it, returning the app to the empty state. |
| **Delete (Discard)** | User action that removes the active todo without marking it done. Functionally identical to complete in v1 (no history). |
| **Local Storage** | Browser-provided key-value store (`window.localStorage`) used to persist the active todo across sessions. |
| **Single-Todo Constraint** | Core invariant: the system never holds more than one active todo. |
| **Service Worker** | Background script that caches app assets for offline use after the first load. |
| **Empty Input Validation** | Client-side check rejecting blank or whitespace-only todo text on submission. |
| **Character Limit** | Maximum allowed length for todo text (200 characters in v1). |
| **Created-At Timestamp** | UTC datetime recorded when a todo is added, displayed as relative time (e.g., "3 min ago"). |
