# Requirements — single-todo

## Legend

- **Priority:** Must (M) / Should (S)
- **Acceptance criteria** follow Given / When / Then format.

---

### REQ-001 — Add a Todo (M)

**User Story:** As a user, I want to add a todo so I have a clear next action.

**Acceptance Criteria:**

- **Given** no active todo exists, **When** I type text and submit, **Then** the todo is created and displayed.
- **Given** input is empty or whitespace-only, **When** I submit, **Then** no todo is created and an inline validation message appears.

---

### REQ-002 — Single-Todo Constraint (M)

**User Story:** As a user, I cannot add a second todo so I stay focused on one thing.

**Acceptance Criteria:**

- **Given** an active todo exists, **When** I view the app, **Then** the add-todo input is hidden or disabled.
- **Given** an active todo exists, **When** I attempt to create another via any path, **Then** the system prevents it.

---

### REQ-003 — View Current Todo (M)

**User Story:** As a user, I want to see my current todo at a glance.

**Acceptance Criteria:**

- **Given** an active todo exists, **When** I open the app, **Then** the todo text is prominently displayed.
- **Given** no active todo exists, **When** I open the app, **Then** an empty state with a prompt to add one is shown.

---

### REQ-004 — Complete a Todo (M)

**User Story:** As a user, I want to mark my todo as done so I can move on.

**Acceptance Criteria:**

- **Given** an active todo exists, **When** I tap/click the complete action, **Then** the todo is removed and the empty state appears.
- **Given** the todo is completed, **When** I check local storage, **Then** no active todo entry remains.

---

### REQ-005 — Delete a Todo (M)

**User Story:** As a user, I want to discard my todo without completing it.

**Acceptance Criteria:**

- **Given** an active todo exists, **When** I tap/click the delete action, **Then** the todo is removed and the empty state appears.
- **Given** the todo is deleted, **When** I check local storage, **Then** no active todo entry remains.

---

### REQ-006 — Persist State in Local Storage (M)

**User Story:** As a user, I want my todo to survive a page refresh.

**Acceptance Criteria:**

- **Given** an active todo exists, **When** I refresh the browser, **Then** the same todo is displayed.
- **Given** I completed/deleted the todo, **When** I refresh, **Then** the empty state is shown.

---

### REQ-007 — Offline Support (M)

**User Story:** As a user, I want the app to work without an internet connection after the first load.

**Acceptance Criteria:**

- **Given** the app has been loaded once, **When** the network is disconnected, **Then** all features (add, view, complete, delete) still work.

---

### REQ-008 — Responsive Layout (M)

**User Story:** As a mobile user, I want the app to look good on any screen size.

**Acceptance Criteria:**

- **Given** a viewport width of 320px–1440px, **When** I view the app, **Then** all content is readable and interactive without horizontal scrolling.

---

### REQ-009 — Keyboard Accessibility (M)

**User Story:** As a keyboard-only user, I want to operate the app entirely with a keyboard.

**Acceptance Criteria:**

- **Given** I am using only a keyboard, **When** I tab through the app, **Then** every interactive element receives visible focus and is operable.

---

### REQ-010 — Screen Reader Accessibility (M)

**User Story:** As a screen reader user, I want semantic markup and ARIA labels so I can understand the app.

**Acceptance Criteria:**

- **Given** a screen reader is active, **When** I navigate the app, **Then** the current todo state (active, empty) and all actions are announced.

---

### REQ-011 — Input Character Limit (S)

**User Story:** As a user, I want a reasonable character limit so the UI stays clean.

**Acceptance Criteria:**

- **Given** I am typing a todo, **When** I reach 200 characters, **Then** further input is prevented and a counter shows remaining characters.

---

### REQ-012 — Confirmation on Delete (S)

**User Story:** As a user, I want to confirm before discarding my todo to prevent accidents.

**Acceptance Criteria:**

- **Given** an active todo exists, **When** I tap delete, **Then** a confirmation prompt appears before the todo is removed.

---

### REQ-013 — Timestamp Display (S)

**User Story:** As a user, I want to see when I created my todo for context.

**Acceptance Criteria:**

- **Given** an active todo exists, **When** I view it, **Then** a human-readable "created at" timestamp is shown (e.g., "2 hours ago").

---

### REQ-014 — Empty State Illustration (S)

**User Story:** As a user, I want a friendly empty state so the app feels intentional, not broken.

**Acceptance Criteria:**

- **Given** no active todo exists, **When** I view the app, **Then** an illustration or icon and a short motivational prompt are displayed.

---

### REQ-015 — Performance Budget (M)

**User Story:** As a user on a slow connection, I want the app to load fast.

**Acceptance Criteria:**

- **Given** a simulated 3G connection, **When** I load the app, **Then** First Contentful Paint is under 2 seconds and the JS bundle (gzipped) is under 50 KB.

---

## Traceability Matrix

| Requirement | Constraint | Persona |
|-------------|-----------|---------|
| REQ-001 | C-1 | Quick Capturer |
| REQ-002 | C-1 | Focused Worker |
| REQ-003 | — | Both |
| REQ-004 | C-1 | Focused Worker |
| REQ-005 | C-1 | Both |
| REQ-006 | C-3 | Both |
| REQ-007 | C-4 | Both |
| REQ-008 | C-6 | Quick Capturer |
| REQ-009 | C-5 | Focused Worker |
| REQ-010 | C-5 | Focused Worker |
| REQ-011 | — | Both |
| REQ-012 | — | Both |
| REQ-013 | — | Focused Worker |
| REQ-014 | — | Both |
| REQ-015 | — | Quick Capturer |

---

## Handoff

### Artifacts Produced

| Artifact | Path |
|----------|------|
| Project Brief | `docs/requirements/00-project-brief.md` |
| Requirements (this file) | `docs/requirements/01-requirements.md` |
| Glossary | `docs/requirements/glossary.md` |

### Required Environment Variables / API Keys

None. v1 is entirely client-side with local storage persistence. No backend, no third-party services.

### Open Questions

1. Should completed todos be kept in a history log for later reference, or is "done = gone" the final design?
2. Should the delete confirmation (REQ-012) be a modal dialog or an inline undo toast?
3. Is a service worker acceptable for offline support, or should a different caching strategy be used?

### Blockers

None identified. No API keys or external services are required for v1.
