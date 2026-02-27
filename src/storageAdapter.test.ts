import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { STORAGE_KEY } from './constants';
import { consumeStorageCorruptRecovery, createStorageAdapter } from './storageAdapter';

describe('storage adapter', () => {
  const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

  beforeEach(() => {
    localStorage.clear();
    consumeStorageCorruptRecovery();
  });

  afterEach(() => {
    warnSpy.mockClear();
  });

  afterAll(() => {
    warnSpy.mockRestore();
  });

  it('loads valid todo payloads', () => {
    const adapter = createStorageAdapter(localStorage);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        text: 'Clean desk',
        createdAt: '2026-02-27T09:00:00.000Z',
      }),
    );

    expect(adapter.loadTodo()).toEqual({
      text: 'Clean desk',
      createdAt: '2026-02-27T09:00:00.000Z',
    });
  });

  it('clears corrupt payloads and reports recovery', () => {
    const adapter = createStorageAdapter(localStorage);
    localStorage.setItem(STORAGE_KEY, '{invalid');

    expect(adapter.loadTodo()).toBeNull();
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    expect(consumeStorageCorruptRecovery()).toBe(true);
    expect(consumeStorageCorruptRecovery()).toBe(false);
  });
});
