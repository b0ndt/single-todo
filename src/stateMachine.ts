import { MAX_TODO_LENGTH } from './constants';
import { createStorageAdapter } from './storageAdapter';
import type { AddTodoResult, AppState, StorageAdapter, Subscriber, Todo } from './types';

export interface StateMachine {
  getState: () => AppState;
  subscribe: (subscriber: Subscriber) => () => void;
  addTodo: (text: string) => AddTodoResult;
  completeTodo: () => void;
  requestDelete: () => void;
  confirmDelete: () => void;
  cancelDelete: () => void;
}

const nowIso = (): string => new Date().toISOString();

const getInitialState = (storage: StorageAdapter): AppState => {
  const persistedTodo = storage.loadTodo();
  if (!persistedTodo) {
    return { status: 'empty' };
  }

  return { status: 'active', todo: persistedTodo };
};

const toActiveState = (todo: Todo): AppState => ({ status: 'active', todo });

export const createStateMachine = (storage: StorageAdapter = createStorageAdapter()): StateMachine => {
  let state: AppState = getInitialState(storage);
  const subscribers = new Set<Subscriber>();

  const notify = (): void => {
    subscribers.forEach((subscriber) => subscriber(state));
  };

  const transition = (nextState: AppState): void => {
    state = nextState;
    notify();
  };

  const getState = (): AppState => state;

  const subscribe = (subscriber: Subscriber): (() => void) => {
    subscribers.add(subscriber);
    return () => {
      subscribers.delete(subscriber);
    };
  };

  const addTodo = (rawText: string): AddTodoResult => {
    if (state.status !== 'empty') {
      return { ok: false, error: 'TODO_EXISTS' };
    }

    const text = rawText.trim();
    if (!text) {
      return { ok: false, error: 'EMPTY_TEXT' };
    }

    if (text.length > MAX_TODO_LENGTH) {
      return { ok: false, error: 'TEXT_TOO_LONG' };
    }

    const todo: Todo = {
      text,
      createdAt: nowIso(),
    };

    storage.saveTodo(todo);
    transition(toActiveState(todo));
    return { ok: true };
  };

  const completeTodo = (): void => {
    if (state.status !== 'active') {
      return;
    }

    storage.removeTodo();
    transition({ status: 'empty' });
  };

  const requestDelete = (): void => {
    if (state.status !== 'active') {
      return;
    }

    transition({ status: 'confirm-delete', todo: state.todo });
  };

  const confirmDelete = (): void => {
    if (state.status !== 'confirm-delete') {
      return;
    }

    storage.removeTodo();
    transition({ status: 'empty' });
  };

  const cancelDelete = (): void => {
    if (state.status !== 'confirm-delete') {
      return;
    }

    transition(toActiveState(state.todo));
  };

  return {
    getState,
    subscribe,
    addTodo,
    completeTodo,
    requestDelete,
    confirmDelete,
    cancelDelete,
  };
};
