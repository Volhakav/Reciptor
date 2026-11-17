import React, { useState } from 'react';
import { ArrowLeft, Check, Eye, EyeOff, Lock, ShieldCheck, X } from 'lucide-react';
import { Input } from '../ui/Field';
import { Button } from '../ui/Button';
import { cn } from '../../lib/cn';

interface Step3Props {
  password: string;
  confirmPassword: string;
  onChange: (fields: Partial<{ password: string; confirmPassword: string }>) => void;
  onBack: () => void;
  onSubmit: () => void;
  loading: boolean;
}

const RULES = [
  { label: 'At least 8 characters', test: (v: string) => v.length >= 8 },
  { label: 'One uppercase letter', test: (v: string) => /[A-Z]/.test(v) },
  { label: 'One number', test: (v: string) => /[0-9]/.test(v) },
  { label: 'One special character', test: (v: string) => /[!@#$%^&*(),.?":{}|<>]/.test(v) },
];

const STRENGTH = [
  { label: 'Too weak', color: 'bg-berry-500', text: 'text-berry-600' },
  { label: 'Weak', color: 'bg-brand-400', text: 'text-brand-600' },
  { label: 'Getting there', color: 'bg-sun-500', text: 'text-brand-600' },
  { label: 'Good', color: 'bg-leaf-500', text: 'text-leaf-600' },
  { label: 'Strong', color: 'bg-leaf-600', text: 'text-leaf-700' },
];

export const Step3SecurityInfo: React.FC<Step3Props> = ({
  password,
  confirmPassword,
  onChange,
  onBack,
  onSubmit,
  loading,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const passedCount = RULES.filter((rule) => rule.test(password)).length;
  const failedRules = RULES.filter((rule) => !rule.test(password));
  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const isValid = failedRules.length === 0 && passwordsMatch;
  const strength = STRENGTH[passedCount];

  return (
    <div className="space-y-4">
      <Input
        label="Password"
        type={showPassword ? 'text' : 'password'}
        required
        value={password}
        onChange={(e) => onChange({ password: e.target.value })}
        placeholder="••••••••"
        leading={<Lock className="h-4 w-4" />}
        autoComplete="new-password"
        trailing={
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-lg text-muted transition-colors hover:bg-canvas-2 hover:text-ink"
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        }
      />

      {password.length > 0 && (
        <div className="-mt-1">
          <div className="flex items-center justify-between text-[11px] font-semibold">
            <span className="text-muted">Password strength</span>
            <span className={strength.text}>{strength.label}</span>
          </div>
          <div className="mt-1.5 flex gap-1">
            {RULES.map((rule, i) => (
              <span
                key={rule.label}
                className={cn(
                  'h-1.5 flex-1 rounded-full transition-colors duration-300',
                  i < passedCount ? strength.color : 'bg-line',
                )}
              />
            ))}
          </div>
        </div>
      )}

      {password.length > 0 && (
        <ul className="grid grid-cols-1 gap-1.5 rounded-xl bg-canvas p-3 sm:grid-cols-2">
          {RULES.map((rule) => {
            const passed = rule.test(password);
            return (
              <li
                key={rule.label}
                className={cn(
                  'flex items-center gap-1.5 text-[11.5px] font-medium transition-colors',
                  passed ? 'text-leaf-600' : 'text-muted',
                )}
              >
                <span
                  className={cn(
                    'grid h-4 w-4 shrink-0 place-items-center rounded-full',
                    passed
                      ? 'bg-leaf-100 text-leaf-600'
                      : 'bg-white text-muted/70 ring-1 ring-line',
                  )}
                >
                  {passed ? <Check className="h-2.5 w-2.5" /> : <X className="h-2.5 w-2.5" />}
                </span>
                {rule.label}
              </li>
            );
          })}
        </ul>
      )}

      <Input
        label="Confirm password"
        type={showConfirm ? 'text' : 'password'}
        required
        value={confirmPassword}
        onChange={(e) => onChange({ confirmPassword: e.target.value })}
        placeholder="••••••••"
        leading={<ShieldCheck className="h-4 w-4" />}
        autoComplete="new-password"
        state={confirmPassword.length > 0 && !passwordsMatch ? 'bad' : 'default'}
        hint={
          confirmPassword.length > 0 && !passwordsMatch ? (
            <>
              <X className="h-3.5 w-3.5" />
              Passwords do not match
            </>
          ) : undefined
        }
        trailing={
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-lg text-muted transition-colors hover:bg-canvas-2 hover:text-ink"
            tabIndex={-1}
            aria-label={showConfirm ? 'Hide password' : 'Show password'}
          >
            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-3 pt-2">
        <Button type="button" variant="secondary" size="lg" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button type="button" size="lg" disabled={!isValid} loading={loading} onClick={onSubmit}>
          {loading ? 'Creating…' : 'Create account'}
        </Button>
      </div>
    </div>
  );
};
