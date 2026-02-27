export interface Todo {
  text: string;
  createdAt: string;
}

export type AppState =
  | { status: 'empty' }
  | { status: 'active'; todo: Todo }
  | { status: 'confirm-delete'; todo: Todo };

export type AddTodoError = 'EMPTY_TEXT' | 'TEXT_TOO_LONG' | 'TODO_EXISTS';

export type AddTodoResult = { ok: true } | { ok: false; error: AddTodoError };

export type Subscriber = (state: AppState) => void;

export interface StorageAdapter {
  loadTodo: () => Todo | null;
  saveTodo: (todo: Todo) => void;
  removeTodo: () => void;
}
