import type { ComponentChildren, JSX } from 'preact';

type ActionButtonVariant = 'primary' | 'success' | 'danger' | 'ghost';

interface ActionButtonProps extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  variant: ActionButtonVariant;
  children: ComponentChildren;
  icon?: ComponentChildren;
  isLoading?: boolean;
  onClick?: JSX.MouseEventHandler<HTMLButtonElement>;
}

const variantClassMap: Record<ActionButtonVariant, string> = {
  primary: 'btn-primary',
  success: 'btn-success',
  danger: 'btn-danger',
  ghost: 'btn-ghost',
};

export const ActionButton = ({
  variant,
  children,
  icon,
  isLoading = false,
  disabled = false,
  class: className,
  onClick,
  ...rest
}: ActionButtonProps) => {
  const classes = ['btn', variantClassMap[variant], isLoading ? 'is-loading' : '', className ?? '']
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      class={classes}
      disabled={disabled || isLoading}
      aria-busy={isLoading ? 'true' : undefined}
      onClick={onClick}
      {...rest}
    >
      {isLoading ? <span class="loading-spinner" aria-hidden="true" /> : icon}
      <span>{children}</span>
    </button>
  );
};
