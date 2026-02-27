import { useEffect, useRef, useState } from 'preact/hooks';
import { CONFIRM_DIALOG_EXIT_MS, COPY } from '../constants';
import { ActionButton } from './ActionButton';

interface ConfirmDialogProps {
  open: boolean;
  isCancelLoading: boolean;
  isConfirmLoading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const ConfirmDialog = ({
  open,
  isCancelLoading,
  isConfirmLoading,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [isRendered, setIsRendered] = useState(open);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (open) {
      setIsRendered(true);
      setIsExiting(false);
      return;
    }

    if (!isRendered) {
      return;
    }

    setIsExiting(true);
    const timerId = window.setTimeout(() => {
      setIsRendered(false);
      setIsExiting(false);
    }, CONFIRM_DIALOG_EXIT_MS);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [open, isRendered]);

  useEffect(() => {
    if (!open) {
      return;
    }

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const keepButton = dialogRef.current?.querySelector<HTMLButtonElement>('[data-keep]');
    keepButton?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        if (!isCancelLoading && !isConfirmLoading) {
          onCancel();
        }
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      const focusable = dialogRef.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)');
      if (!focusable || focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, isCancelLoading, isConfirmLoading, onCancel]);

  useEffect(() => {
    if (open) {
      return;
    }

    if (previousFocusRef.current?.isConnected) {
      previousFocusRef.current.focus();
    }
  }, [open]);

  if (!isRendered) {
    return null;
  }

  const backdropClassName = ['confirm-backdrop', isExiting ? 'exiting' : 'entering'].join(' ');
  const dialogClassName = ['confirm-dialog', isExiting ? 'exiting' : 'entering'].join(' ');

  return (
    <>
      <div
        class={backdropClassName}
        aria-hidden="true"
        onClick={() => {
          if (open && !isCancelLoading && !isConfirmLoading) {
            onCancel();
          }
        }}
      />
      <div
        ref={dialogRef}
        class={dialogClassName}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-desc"
      >
        <h2 id="confirm-title" class="confirm-headline text-debossed">
          {COPY.confirmHeadline}
        </h2>
        <p id="confirm-desc" class="confirm-body">
          {COPY.confirmSupporting}
        </p>
        <div class="confirm-actions">
          <ActionButton
            variant="primary"
            data-keep
            aria-label="Cancel delete"
            isLoading={isCancelLoading}
            disabled={isConfirmLoading}
            onClick={onCancel}
          >
            {COPY.cta.keep}
          </ActionButton>
          <ActionButton
            variant="danger"
            aria-label="Confirm delete"
            isLoading={isConfirmLoading}
            disabled={isCancelLoading}
            onClick={onConfirm}
          >
            {COPY.cta.confirmDrop}
          </ActionButton>
        </div>
      </div>
    </>
  );
};
