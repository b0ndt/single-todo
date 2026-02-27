# Content Guide — single-todo

> Every word is a design decision.

---

## 1. Voice Summary

| Attribute | Guideline |
|-----------|-----------|
| **Tone** | Assured, warm, concise |
| **Person** | Second person ("you") for prompts; imperative for actions |
| **Tense** | Present. Always present. |
| **Length** | Shortest correct version wins |
| **Humor** | Dry, rare, never at the user's expense |

---

## 2. Headline Templates

Headlines follow a pattern: **short declarative + period**. The period is a design element — it signals finality, focus, completion.

| Context | Template | Example |
|---------|----------|---------|
| Empty state | `[Positive statement about readiness].` | "Ready when you are." |
| Active todo | `[Acknowledgment of focus].` | "Focus on this." |
| After completion | `[Celebration + forward motion].` | "Done. What's next?" |
| After deletion | `[Release + fresh start].` | "Clean slate." |
| Error state | `[What went wrong, plainly].` | "That didn't work." |

---

## 3. Microcopy — All Screens

### 3.1 Empty State

| Element | Copy |
|---------|------|
| **Headline** | "What needs doing?" |
| **Supporting text** | "One thing at a time. Add your focus." |
| **Input placeholder** | "Your one thing…" |
| **Submit button** | "Lock it in" |
| **Character counter (under limit)** | "142 left" |
| **Character counter (at limit)** | "0 left" |
| **Character counter (near limit, ≤20)** | "18 left" _(color shifts to warning)_ |

### 3.2 Active Todo State

| Element | Copy |
|---------|------|
| **Embossed label** | "YOUR FOCUS" |
| **Timestamp** | "Added 5 min ago" / "Added 2 hours ago" / "Added yesterday" |
| **Complete button** | "Done" |
| **Delete button** | "Drop it" |
| **Tooltip — complete** | "Mark as done and clear" |
| **Tooltip — delete** | "Discard without completing" |

### 3.3 Confirm Delete State

| Element | Copy |
|---------|------|
| **Headline** | "Let this one go?" |
| **Supporting text** | "It won't be marked as done." |
| **Confirm button** | "Yes, drop it" |
| **Cancel button** | "Keep it" |

### 3.4 Transition Moments

| Moment | Copy (toast / aria-live) |
|--------|------------------------|
| Todo created | "Locked in. Focus on this." |
| Todo completed | "Done. What's next?" |
| Todo deleted | "Dropped. Fresh start." |

---

## 4. Error Copy

All error messages follow the pattern: **[What happened]** + **[What to do]**.

| Error Code | User-Facing Copy |
|------------|-----------------|
| `EMPTY_TEXT` | "Your todo needs some words. Type something." |
| `TEXT_TOO_LONG` | "That's over 200 characters. Trim it down." |
| `TODO_EXISTS` | _(This state is prevented by UI — input is hidden. If reached programmatically:)_ "You already have a focus. Finish it first." |
| `STORAGE_CORRUPT` | "Something went sideways. Your slate has been cleared." |

### Validation States

| State | Visual | Copy |
|-------|--------|------|
| Empty submission | Input border glows `--color-danger` | "Your todo needs some words." |
| Approaching limit (≤ 20 chars) | Counter color shifts to `--color-warning` | "18 left" |
| At limit | Counter color shifts to `--color-danger`, input stops accepting | "0 left" |

---

## 5. Empty State Content (Real Samples — No Lorem Ipsum)

The empty state cycles through motivational prompts. Each is a real, human sentence:

| # | Headline | Supporting Line |
|---|----------|----------------|
| 1 | "What needs doing?" | "One thing at a time. Add your focus." |
| 2 | "All clear." | "Nothing on your plate. Enjoy it or add something." |
| 3 | "The board is empty." | "One task. That's all you get. Make it count." |
| 4 | "Ready when you are." | "Type your most important thing." |

> **Implementation note:** v1 uses prompt #1 as the default. Cycling/randomization is a v2 enhancement.

---

## 6. Sample Todo Content (For Wireframes & Tests)

These are realistic, varied examples for design mockups:

| # | Todo Text | Length |
|---|-----------|-------|
| 1 | "Buy oat milk" | 12 chars |
| 2 | "Send the revised proposal to Aya by 3pm" | 41 chars |
| 3 | "Call the dentist about Tuesday" | 30 chars |
| 4 | "Review pull request #847 — check the error handling in the auth module" | 71 chars |
| 5 | "Run" | 3 chars |
| 6 | "Write the quarterly report intro paragraph and send it to Dana and Priya for review before the Thursday standup" | 112 chars |

---

## 7. CTAs (Calls to Action)

| Context | Primary CTA | Secondary CTA |
|---------|------------|---------------|
| Empty state | "Lock it in" (submit) | — |
| Active state | "Done" (complete) | "Drop it" (delete) |
| Confirm delete | "Yes, drop it" (confirm) | "Keep it" (cancel) |

### CTA Rules

1. **Primary CTAs use active verbs.** "Lock it in", "Done", not "Submit", "OK".
2. **Destructive CTAs are never the visual default.** "Drop it" is secondary (muted). "Yes, drop it" is confirmation-only.
3. **Cancel CTAs are gentle.** "Keep it" (not "Cancel" or "Go back").
4. **No double negatives.** Never "Don't delete" — use "Keep it".

---

## 8. Accessibility Copy

| Element | ARIA Label / Role |
|---------|------------------|
| App container | `role="main"`, `aria-label="single-todo"` |
| Input field | `aria-label="What needs doing?"` |
| Submit button | `aria-label="Add todo"` |
| Character counter | `aria-live="polite"`, `aria-label="Characters remaining"` |
| Todo display | `role="status"`, `aria-live="polite"` |
| Complete button | `aria-label="Mark todo as done"` |
| Delete button | `aria-label="Delete todo"` |
| Confirm dialog | `role="alertdialog"`, `aria-labelledby` → headline |
| Confirm button | `aria-label="Confirm delete"` |
| Cancel button | `aria-label="Cancel delete"` |
| Transition announcements | `aria-live="assertive"` on a visually-hidden live region |

---

## 9. Timestamp Formatting Rules

| Age | Format | Example |
|-----|--------|---------|
| < 1 min | "Just now" | "Added just now" |
| 1–59 min | "{n} min ago" | "Added 5 min ago" |
| 1–23 hours | "{n} hour(s) ago" | "Added 2 hours ago" |
| 1 day | "Yesterday" | "Added yesterday" |
| 2–6 days | "{n} days ago" | "Added 3 days ago" |
| 7+ days | Date | "Added Feb 20" |

---

## 10. Writing Checklist

Before shipping any copy:

- [ ] Under 8 words? (Headlines)
- [ ] Active verb leading? (CTAs)
- [ ] Period at the end? (Headlines — intentional full stop)
- [ ] No jargon? (No "item", "entry", "record")
- [ ] Present tense?
- [ ] Would you say this out loud?

---

## Handoff

| Artifact | Path | Status |
|----------|------|--------|
| Content Guide (this file) | `docs/design/content-guide.md` | ✅ Complete |

### Notes for Engineer

- All microcopy is final and ready to implement verbatim.
- ARIA labels are specified — use exactly as written.
- Timestamp formatting should use a lightweight relative-time utility (or hand-rolled — < 20 lines for v1 requirements).
- Transition toasts should be `aria-live="assertive"` and auto-dismiss after 3 seconds.
