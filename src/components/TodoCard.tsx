import type { Todo } from '../types';
import { COPY } from '../constants';
import { ActionButton } from './ActionButton';
import { CheckIcon, ClockIcon, XIcon } from './Icons';

interface TodoCardProps {
  todo: Todo;
  timestampLabel: string;
  isDimmed?: boolean;
  isEntering?: boolean;
  isExitingComplete?: boolean;
  isCompleteLoading?: boolean;
  isDeleteLoading?: boolean;
  onComplete: () => void;
  onDelete: () => void;
}

export const TodoCard = ({
  todo,
  timestampLabel,
  isDimmed = false,
  isEntering = false,
  isExitingComplete = false,
  isCompleteLoading = false,
  isDeleteLoading = false,
  onComplete,
  onDelete,
}: TodoCardProps) => {
  const className = [
    'todo-card',
    isEntering ? 'entering' : '',
    isExitingComplete ? 'exiting-complete' : '',
    isDimmed ? 'dimmed' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <article class={className} role="status" aria-live="polite">
      <span class="todo-label text-embossed" aria-hidden="true">
        {COPY.focusLabel}
      </span>

      <h2 class="todo-text text-debossed">{todo.text}</h2>

      <p class="todo-timestamp">
        <ClockIcon />
        {timestampLabel}
      </p>

      <div class="action-row">
        <ActionButton
          variant="success"
          aria-label="Mark todo as done"
          title="Mark as done and clear"
          icon={<CheckIcon />}
          isLoading={isCompleteLoading}
          disabled={isDeleteLoading}
          onClick={onComplete}
        >
          {COPY.cta.done}
        </ActionButton>
        <ActionButton
          variant="ghost"
          aria-label="Delete todo"
          title="Discard without completing"
          icon={<XIcon />}
          isLoading={isDeleteLoading}
          disabled={isCompleteLoading}
          onClick={onDelete}
        >
          {COPY.cta.drop}
        </ActionButton>
      </div>
    </article>
  );
};
