import { useEffect, useRef, useState } from 'preact/hooks';
import {
  ACTION_LOADING_MS,
  COPY,
  MAX_TODO_LENGTH,
  TOAST_EXIT_MS,
  TOAST_VISIBLE_MS,
} from './constants';
import { consumeStorageCorruptRecovery } from './storageAdapter';
import { createStateMachine, type StateMachine } from './stateMachine';
import { formatAddedTimestamp } from './time';
import type { AppState } from './types';
import { ConfirmDialog } from './components/ConfirmDialog';
import { EmptyVisual } from './components/EmptyVisual';
import { Logo } from './components/Logo';
import { Toast } from './components/Toast';
import { TodoCard } from './components/TodoCard';
import { TodoInput } from './components/TodoInput';

type ToastVariant = 'neon' | 'success';

interface ToastState {
  id: number;
  message: string;
  variant: ToastVariant;
  isExiting: boolean;
}

export function App() {
  const machineRef = useRef<StateMachine | null>(null);
  if (!machineRef.current) {
    machineRef.current = createStateMachine();
  }
  const machine = machineRef.current as StateMachine;

  const inputRef = useRef<HTMLInputElement>(null);
  const previousStatusRef = useRef<AppState['status']>(machine.getState().status);
  const actionTimerIds = useRef<number[]>([]);
  const toastTimerIds = useRef<number[]>([]);

  const [state, setState] = useState<AppState>(machine.getState());
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [nowValue, setNowValue] = useState(Date.now());
  const [announcement, setAnnouncement] = useState('');
  const [isCardEntering, setIsCardEntering] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isCancelingDelete, setIsCancelingDelete] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const clearActionTimers = () => {
    actionTimerIds.current.forEach((timerId) => window.clearTimeout(timerId));
    actionTimerIds.current = [];
  };

  const clearToastTimers = () => {
    toastTimerIds.current.forEach((timerId) => window.clearTimeout(timerId));
    toastTimerIds.current = [];
  };

  const queueAction = (action: () => void) => {
    const timerId = window.setTimeout(() => {
      action();
    }, ACTION_LOADING_MS);
    actionTimerIds.current.push(timerId);
  };

  const showToast = (message: string, variant: ToastVariant) => {
    clearToastTimers();
    const toastId = Date.now();
    setToast({
      id: toastId,
      message,
      variant,
      isExiting: false,
    });

    const exitTimer = window.setTimeout(() => {
      setToast((currentToast) =>
        currentToast?.id === toastId ? { ...currentToast, isExiting: true } : currentToast,
      );
    }, TOAST_VISIBLE_MS);
    const removeTimer = window.setTimeout(() => {
      setToast((currentToast) => (currentToast?.id === toastId ? null : currentToast));
    }, TOAST_VISIBLE_MS + TOAST_EXIT_MS);

    toastTimerIds.current.push(exitTimer, removeTimer);
  };

  useEffect(() => {
    const unsubscribe = machine.subscribe(setState);
    return () => {
      unsubscribe();
      clearActionTimers();
      clearToastTimers();
    };
  }, [machine]);

  useEffect(() => {
    const tickId = window.setInterval(() => {
      setNowValue(Date.now());
    }, 60_000);

    return () => {
      window.clearInterval(tickId);
    };
  }, []);

  useEffect(() => {
    if (!consumeStorageCorruptRecovery()) {
      return;
    }

    showToast(COPY.errors.STORAGE_CORRUPT, 'neon');
    setAnnouncement(COPY.errors.STORAGE_CORRUPT);
  }, []);

  useEffect(() => {
    const previousStatus = previousStatusRef.current;
    const currentStatus = state.status;

    if (currentStatus === 'active' && previousStatus === 'empty') {
      setIsCardEntering(true);
      const timerId = window.setTimeout(() => {
        setIsCardEntering(false);
      }, ACTION_LOADING_MS * 2);
      actionTimerIds.current.push(timerId);
    }

    if (currentStatus === 'empty') {
      const timerId = window.setTimeout(() => {
        inputRef.current?.focus();
      });
      actionTimerIds.current.push(timerId);
    }

    previousStatusRef.current = currentStatus;
  }, [state.status]);

  const handleInputChange = (nextValue: string) => {
    setInputValue(nextValue.slice(0, MAX_TODO_LENGTH));
    setHasInteracted(true);
    if (inputError) {
      setInputError(null);
    }
  };

  const handleAddTodo = () => {
    setHasInteracted(true);
    setInputError(null);
    setIsSubmitting(true);

    queueAction(() => {
      const result = machine.addTodo(inputValue);
      setIsSubmitting(false);

      if (!result.ok) {
        setInputError(COPY.errors[result.error]);
        setAnnouncement(COPY.errors[result.error]);
        return;
      }

      setInputValue('');
      setInputError(null);
      showToast(COPY.toast.created, 'neon');
      setAnnouncement(COPY.toast.created);
    });
  };

  const handleComplete = () => {
    setIsCompleting(true);
    queueAction(() => {
      machine.completeTodo();
      setIsCompleting(false);
      showToast(COPY.toast.completed, 'success');
      setAnnouncement(COPY.toast.completed);
    });
  };

  const handleRequestDelete = () => {
    machine.requestDelete();
  };

  const handleCancelDelete = () => {
    setIsCancelingDelete(true);
    queueAction(() => {
      machine.cancelDelete();
      setIsCancelingDelete(false);
    });
  };

  const handleConfirmDelete = () => {
    setIsConfirmingDelete(true);
    queueAction(() => {
      machine.confirmDelete();
      setIsConfirmingDelete(false);
      showToast(COPY.toast.deleted, 'neon');
      setAnnouncement(COPY.toast.deleted);
    });
  };

  const timestampLabel =
    state.status === 'empty' ? '' : formatAddedTimestamp(state.todo.createdAt, nowValue);

  return (
    <div class="app-shell" role="main" aria-label="single-todo">
      <header class="app-header">
        <Logo />
      </header>

      <main class="app-content">
        {state.status === 'empty' ? (
          <section class="empty-screen">
            <EmptyVisual />
            <h1 class="headline text-debossed">{COPY.emptyHeadline}</h1>
            <p class="supporting-text">{COPY.emptySupporting}</p>
            <TodoInput
              value={inputValue}
              showCounter={hasInteracted}
              errorMessage={inputError}
              isLoading={isSubmitting}
              onChange={handleInputChange}
              onSubmit={handleAddTodo}
              inputRef={inputRef}
            />
          </section>
        ) : (
          <TodoCard
            todo={state.todo}
            timestampLabel={timestampLabel}
            isDimmed={state.status === 'confirm-delete'}
            isEntering={isCardEntering}
            isExitingComplete={isCompleting}
            isCompleteLoading={isCompleting}
            isDeleteLoading={false}
            onComplete={handleComplete}
            onDelete={handleRequestDelete}
          />
        )}
      </main>

      <div class="toast-region" aria-live="assertive" aria-atomic="true">
        {toast ? (
          <Toast message={toast.message} variant={toast.variant} isExiting={toast.isExiting} />
        ) : null}
      </div>

      <div class="sr-only-live-region" aria-live="assertive" aria-atomic="true">
        {announcement}
      </div>

      <ConfirmDialog
        open={state.status === 'confirm-delete'}
        isCancelLoading={isCancelingDelete}
        isConfirmLoading={isConfirmingDelete}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
