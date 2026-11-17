import React from 'react';
import { cn } from '../../lib/cn';

type FieldState = 'default' | 'ok' | 'bad';

interface FieldChrome {
  label?: string;
  hint?: React.ReactNode;
  state?: FieldState;
}

const BASE =
  'w-full h-11 rounded-xl border bg-white text-sm text-ink placeholder:text-muted/55 transition-all duration-200 ' +
  'focus:outline-none focus:ring-4 disabled:opacity-60 disabled:cursor-not-allowed';

const STATES: Record<FieldState, string> = {
  default: 'border-line-strong focus:border-brand-400 focus:ring-brand-500/15',
  ok: 'border-leaf-500 focus:border-leaf-500 focus:ring-leaf-500/15',
  bad: 'border-berry-500 focus:border-berry-500 focus:ring-berry-500/15',
};

const Label: React.FC<{ children: React.ReactNode; required?: boolean }> = ({
  children,
  required,
}) => (
  <span className="mb-1.5 flex items-center gap-1 text-xs font-semibold tracking-wide text-muted">
    {children}
    {required && <span className="text-brand-500">*</span>}
  </span>
);

const Hint: React.FC<{ state: FieldState; children: React.ReactNode }> = ({ state, children }) => (
  <span
    className={cn(
      'mt-1.5 flex items-center gap-1.5 text-[11.5px] font-medium',
      state === 'ok' && 'text-leaf-600',
      state === 'bad' && 'text-berry-600',
      state === 'default' && 'text-muted',
    )}
  >
    {children}
  </span>
);

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, FieldChrome {
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  hint,
  state = 'default',
  leading,
  trailing,
  required,
  className,
  ...rest
}) => (
  <label className="block">
    {label && <Label required={required}>{label}</Label>}
    <div className="relative">
      {leading && (
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
          {leading}
        </span>
      )}
      <input
        {...rest}
        required={required}
        className={cn(
          BASE,
          STATES[state],
          leading ? 'pl-10' : 'px-3.5',
          trailing ? 'pr-11' : 'pr-3.5',
          className,
        )}
      />
      {trailing && <span className="absolute right-1.5 top-1/2 -translate-y-1/2">{trailing}</span>}
    </div>
    {hint && <Hint state={state}>{hint}</Hint>}
  </label>
);

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement>, FieldChrome {}

export const Select: React.FC<SelectProps> = ({
  label,
  hint,
  state = 'default',
  required,
  className,
  children,
  ...rest
}) => (
  <label className="block">
    {label && <Label required={required}>{label}</Label>}
    <div className="relative">
      <select
        {...rest}
        required={required}
        className={cn(
          BASE,
          STATES[state],
          'appearance-none px-3.5 pr-10 cursor-pointer',
          className,
        )}
      >
        {children}
      </select>
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="none"
        className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
      >
        <path
          d="M5 7.5 10 12.5 15 7.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    </div>
    {hint && <Hint state={state}>{hint}</Hint>}
  </label>
);
