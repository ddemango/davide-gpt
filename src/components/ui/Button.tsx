'use client';

import { forwardRef, type ButtonHTMLAttributes, type AnchorHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type ButtonBaseProps = {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
};

type ButtonAsButton = ButtonBaseProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type ButtonAsAnchor = ButtonBaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
type ButtonProps = ButtonAsButton | ButtonAsAnchor;

const buttonClasses = (
  variant: ButtonBaseProps['variant'] = 'primary',
  size: ButtonBaseProps['size'] = 'md',
  fullWidth = false,
  className?: string
) => {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variants = {
    primary: 'bg-gradient-brand text-white shadow-lg shadow-brand-600/25 hover:shadow-brand-600/40 hover:scale-[1.02] active:scale-[0.98]',
    secondary: 'bg-surface-2 text-white border border-white/10 hover:bg-surface-3 hover:border-brand-500/40',
    ghost: 'text-slate-300 hover:text-white hover:bg-white/5',
    outline: 'border border-brand-500/50 text-brand-400 hover:bg-brand-500/10 hover:border-brand-400',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
    xl: 'px-9 py-4 text-lg',
  };

  return cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className);
};

const ButtonInner = ({
  loading,
  icon,
  iconPosition,
  children,
}: {
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  children: ReactNode;
}) => (
  <>
    {loading && (
      <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    )}
    {!loading && icon && iconPosition === 'left' && icon}
    {children}
    {!loading && icon && iconPosition === 'right' && icon}
  </>
);

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ variant, size, loading, icon, iconPosition = 'right', fullWidth, className, children, ...props }, ref) => {
    const classes = buttonClasses(variant, size, fullWidth, className);

    if ('href' in props && props.href !== undefined) {
      const { href, ...anchorProps } = props as ButtonAsAnchor;
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={classes}
          {...anchorProps}
        >
          <ButtonInner loading={loading} icon={icon} iconPosition={iconPosition}>{children}</ButtonInner>
        </a>
      );
    }

    const { disabled, ...buttonProps } = props as ButtonAsButton;
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={classes}
        disabled={disabled || loading}
        aria-busy={loading}
        {...buttonProps}
      >
        <ButtonInner loading={loading} icon={icon} iconPosition={iconPosition}>{children}</ButtonInner>
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
