import { describe, expect, it, vi } from 'vitest';
import { createStateMachine } from './stateMachine';
import { MAX_TODO_LENGTH } from './constants';
import type { StorageAdapter, Todo } from './types';

const createMockStorage = (initialTodo: Todo | null = null): StorageAdapter => {
  let todo: Todo | null = initialTodo;

  return {
    loadTodo: () => todo,
    saveTodo: (nextTodo) => {
      todo = nextTodo;
    },
    removeTodo: () => {
      todo = null;
    },
  };
};

describe('state machine', () => {
  it('starts empty when storage has no todo', () => {
    const machine = createStateMachine(createMockStorage());
    expect(machine.getState()).toEqual({ status: 'empty' });
  });

  it('hydrates to active when storage has a todo', () => {
    const machine = createStateMachine(
      createMockStorage({
        text: 'Ship release',
        createdAt: new Date().toISOString(),
      }),
    );

    expect(machine.getState().status).toBe('active');
  });

  it('rejects invalid add operations', () => {
    const machine = createStateMachine(createMockStorage());

    expect(machine.addTodo('   ')).toEqual({ ok: false, error: 'EMPTY_TEXT' });
    expect(machine.addTodo('x'.repeat(MAX_TODO_LENGTH + 1))).toEqual({
      ok: false,
      error: 'TEXT_TOO_LONG',
    });

    expect(machine.addTodo('First')).toEqual({ ok: true });
    expect(machine.addTodo('Second')).toEqual({ ok: false, error: 'TODO_EXISTS' });
  });

  it('completes the active todo and clears storage', () => {
    const storage = createMockStorage();
    const machine = createStateMachine(storage);
    machine.addTodo('Do one thing');
    machine.completeTodo();

    expect(machine.getState()).toEqual({ status: 'empty' });
    expect(storage.loadTodo()).toBeNull();
  });

  it('runs the confirm-delete state transitions', () => {
    const storage = createMockStorage();
    const machine = createStateMachine(storage);
    machine.addTodo('Delete me');

    machine.requestDelete();
    expect(machine.getState().status).toBe('confirm-delete');

    machine.cancelDelete();
    expect(machine.getState().status).toBe('active');

    machine.requestDelete();
    machine.confirmDelete();
    expect(machine.getState()).toEqual({ status: 'empty' });
    expect(storage.loadTodo()).toBeNull();
  });

  it('notifies subscribers on each transition', () => {
    const machine = createStateMachine(createMockStorage());
    const subscriber = vi.fn();
    const unsubscribe = machine.subscribe(subscriber);

    machine.addTodo('Focus');
    machine.requestDelete();
    machine.cancelDelete();
    machine.completeTodo();
    unsubscribe();
    machine.addTodo('No notify after unsubscribe');

    expect(subscriber).toHaveBeenCalledTimes(4);
  });
});
