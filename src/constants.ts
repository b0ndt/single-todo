import type { AddTodoError } from './types';

export const STORAGE_KEY = 'single-todo';
export const MAX_TODO_LENGTH = 200;
export const TOAST_VISIBLE_MS = 3000;
export const TOAST_EXIT_MS = 200;
export const ACTION_LOADING_MS = 300;
export const CONFIRM_DIALOG_EXIT_MS = 200;

export const COPY = {
  emptyHeadline: 'What needs doing?',
  emptySupporting: 'One thing at a time. Add your focus.',
  inputPlaceholder: 'Your one thing…',
  focusLabel: 'YOUR FOCUS',
  confirmHeadline: 'Let this one go?',
  confirmSupporting: "It won't be marked as done.",
  cta: {
    submit: 'Lock it in',
    done: 'Done',
    drop: 'Drop it',
    keep: 'Keep it',
    confirmDrop: 'Yes, drop it',
  },
  toast: {
    created: 'Locked in. Focus on this.',
    completed: "Done. What's next?",
    deleted: 'Dropped. Fresh start.',
  },
  errors: {
    EMPTY_TEXT: 'Your todo needs some words. Type something.',
    TEXT_TOO_LONG: "That's over 200 characters. Trim it down.",
    TODO_EXISTS: 'You already have a focus. Finish it first.',
    STORAGE_CORRUPT: 'Something went sideways. Your slate has been cleared.',
  } as Record<AddTodoError | 'STORAGE_CORRUPT', string>,
} as const;
