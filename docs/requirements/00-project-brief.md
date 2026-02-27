# Project Brief — single-todo

## Vision

A radically simple todo application that holds **exactly one todo at a time**. The constraint is the feature: by forcing a single active item, the app eliminates prioritisation overhead and keeps the user focused on one thing.

## Problem Statement

Conventional todo apps encourage list hoarding. Users accumulate dozens of items, lose focus, and feel overwhelmed. single-todo inverts the model: finish or discard the current item before you can add another.

## Personas

| Persona | Description | Key Need |
|---------|-------------|----------|
| **Focused Worker** | Knowledge worker who wants to single-task | One clear next action, zero distraction |
| **Quick Capturer** | Mobile user who needs to jot a reminder fast | Sub-second add, glanceable status |

## Core Constraints

| # | Constraint |
|---|-----------|
| C-1 | Maximum one active todo exists at any time |
| C-2 | No user accounts or authentication in v1 |
| C-3 | All state persists in browser local storage (no backend in v1) |
| C-4 | Must work offline after first load |
| C-5 | Accessible — WCAG 2.1 AA minimum |
| C-6 | Mobile-first responsive design |

## Success Metrics

| Metric | Target |
|--------|--------|
| Time to add a todo | < 2 seconds |
| Time to complete a todo | 1 tap / click |
| Lighthouse Performance score | ≥ 90 |
| Lighthouse Accessibility score | ≥ 90 |
| JS bundle size (gzipped) | < 50 KB |

## Scope — v1

**In scope:** Create, view, complete, delete a single todo. Local persistence. Responsive UI.

**Out of scope:** Multi-user, backend API, push notifications, recurring todos, categories/tags.
