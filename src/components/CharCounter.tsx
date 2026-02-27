import { MAX_TODO_LENGTH } from '../constants';

interface CharCounterProps {
  valueLength: number;
  show: boolean;
  errorMessage: string | null;
}

export const CharCounter = ({ valueLength, show, errorMessage }: CharCounterProps) => {
  let label = '';
  let className = 'char-count';

  if (errorMessage) {
    label = errorMessage;
    className = 'char-count error-message';
  } else if (show) {
    const remaining = Math.max(0, MAX_TODO_LENGTH - valueLength);
    label = `${remaining} left`;

    if (remaining === 0) {
      className = 'char-count danger';
    } else if (remaining <= 20) {
      className = 'char-count warning';
    }
  }

  return (
    <div class="char-counter" aria-live="polite" aria-label="Characters remaining">
      <span class={className}>{label}</span>
    </div>
  );
};
