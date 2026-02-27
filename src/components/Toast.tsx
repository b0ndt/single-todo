type ToastVariant = 'neon' | 'success';

interface ToastProps {
  message: string;
  variant: ToastVariant;
  isExiting: boolean;
}

export const Toast = ({ message, variant, isExiting }: ToastProps) => {
  const className = [
    'toast',
    variant === 'success' ? 'toast-success' : 'toast-neon',
    isExiting ? 'exiting' : 'entering',
  ].join(' ');

  return (
    <div class={className} role="status">
      <span class="toast-text">{message}</span>
    </div>
  );
};
