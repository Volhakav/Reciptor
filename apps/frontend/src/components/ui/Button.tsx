import React from 'react';
import { cn } from '../../lib/cn';

type Variant = 'primary' | 'secondary' | 'soft' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
}

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-brand-500 to-brand-400 text-white shadow-glow hover:from-brand-600 hover:to-brand-500 active:translate-y-px',
  secondary:
    'bg-white text-ink border border-line-strong shadow-xs hover:border-brand-300 hover:text-brand-700 hover:bg-brand-50/60',
  soft: 'bg-brand-50 text-brand-700 border border-brand-100 hover:bg-brand-100 hover:border-brand-200',
  ghost: 'text-muted hover:bg-canvas-2 hover:text-ink',
  danger:
    'bg-gradient-to-r from-berry-500 to-berry-600 text-white shadow-lg hover:from-berry-600 hover:to-berry-600',
};

const SIZES: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-xs rounded-xl gap-1.5',
  md: 'h-11 px-5 text-sm rounded-xl gap-2',
  lg: 'h-13 px-6 text-[15px] rounded-2xl gap-2.5',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  className,
  children,
  ...rest
}) => {
  return (
    <button
      type="button"
      {...rest}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center font-semibold transition-all duration-200 select-none',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none',
        VARIANTS[variant],
        SIZES[size],
        fullWidth && 'w-full',
        className,
      )}
    >
      {loading && (
        <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
      )}
      {children}
    </button>
  );
};
