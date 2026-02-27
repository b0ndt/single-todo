import { MAX_TODO_LENGTH, STORAGE_KEY } from './constants';
import type { StorageAdapter, Todo } from './types';

let storageRecoveredFromCorruptData = false;

const isTodo = (value: unknown): value is Todo => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const maybeTodo = value as Partial<Todo>;
  if (typeof maybeTodo.text !== 'string' || typeof maybeTodo.createdAt !== 'string') {
    return false;
  }

  const trimmedText = maybeTodo.text.trim();
  if (trimmedText.length < 1 || trimmedText.length > MAX_TODO_LENGTH) {
    return false;
  }

  return !Number.isNaN(Date.parse(maybeTodo.createdAt));
};

const getSafeStorage = (): Storage | null => {
  try {
    return window.localStorage;
  } catch (error) {
    console.warn('single-todo: localStorage unavailable, using memory fallback', error);
    return null;
  }
};

export const consumeStorageCorruptRecovery = (): boolean => {
  if (!storageRecoveredFromCorruptData) {
    return false;
  }

  storageRecoveredFromCorruptData = false;
  return true;
};

export const createStorageAdapter = (storage: Storage | null = getSafeStorage()): StorageAdapter => {
  let memoryTodo: Todo | null = null;

  const loadTodo = (): Todo | null => {
    if (!storage) {
      return memoryTodo;
    }

    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    try {
      const parsed = JSON.parse(raw);
      if (!isTodo(parsed)) {
        storage.removeItem(STORAGE_KEY);
        storageRecoveredFromCorruptData = true;
        return null;
      }

      return {
        text: parsed.text.trim(),
        createdAt: parsed.createdAt,
      };
    } catch (error) {
      console.warn('single-todo: corrupted localStorage entry cleared', error);
      storage.removeItem(STORAGE_KEY);
      storageRecoveredFromCorruptData = true;
      return null;
    }
  };

  const saveTodo = (todo: Todo): void => {
    if (!storage) {
      memoryTodo = todo;
      return;
    }

    storage.setItem(STORAGE_KEY, JSON.stringify(todo));
  };

  const removeTodo = (): void => {
    memoryTodo = null;
    if (!storage) {
      return;
    }

    storage.removeItem(STORAGE_KEY);
  };

  return {
    loadTodo,
    saveTodo,
    removeTodo,
  };
};
