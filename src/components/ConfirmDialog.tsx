import { useEffect, useRef } from 'preact/hooks';
import { COPY } from '../constants';
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
      previousFocusRef.current?.focus();
    };
  }, [open, isCancelLoading, isConfirmLoading, onCancel]);

  if (!open) {
    return null;
  }

  return (
    <>
      <div
        class="confirm-backdrop entering"
        aria-hidden="true"
        onClick={() => {
          if (!isCancelLoading && !isConfirmLoading) {
            onCancel();
          }
        }}
      />
      <div
        ref={dialogRef}
        class="confirm-dialog entering"
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
