import { useMemo } from 'preact/hooks';
import type { RefObject } from 'preact';
import { MAX_TODO_LENGTH } from '../constants';
import { ArrowRightIcon } from './Icons';
import { CharCounter } from './CharCounter';

interface TodoInputProps {
  value: string;
  showCounter: boolean;
  errorMessage: string | null;
  isLoading: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
  inputRef: RefObject<HTMLInputElement>;
}

export const TodoInput = ({
  value,
  showCounter,
  errorMessage,
  isLoading,
  onChange,
  onSubmit,
  inputRef,
}: TodoInputProps) => {
  const wrapperClass = useMemo(
    () => ['input-wrapper', errorMessage ? 'error' : ''].filter(Boolean).join(' '),
    [errorMessage],
  );

  return (
    <form
      class="todo-input-group"
      role="form"
      aria-label="Add a todo"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div class={wrapperClass}>
        <input
          ref={inputRef}
          type="text"
          class="todo-input"
          placeholder="Your one thing…"
          aria-label="What needs doing?"
          value={value}
          maxlength={MAX_TODO_LENGTH}
          autocomplete="off"
          autocapitalize="sentences"
          onInput={(event) => onChange((event.currentTarget as HTMLInputElement).value)}
        />
        <button
          type="submit"
          class={['todo-submit', isLoading ? 'is-loading' : ''].filter(Boolean).join(' ')}
          aria-label="Add todo"
          aria-busy={isLoading ? 'true' : undefined}
          disabled={isLoading}
        >
          {isLoading ? <span class="loading-spinner" aria-hidden="true" /> : <ArrowRightIcon />}
        </button>
      </div>
      <CharCounter valueLength={value.length} show={showCounter} errorMessage={errorMessage} />
    </form>
  );
};
