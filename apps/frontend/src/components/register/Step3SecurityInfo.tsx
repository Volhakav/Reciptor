import React, { useState } from 'react';
import { Eye, EyeOff, Check, X } from 'lucide-react';

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

  const failedRules = RULES.filter((rule) => !rule.test(password));
  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const isValid = failedRules.length === 0 && passwordsMatch;

  return (
    <div className="space-y-4">
      <label className="block text-xs font-semibold text-[#5C5A4E]">
        Password *
        <div className="relative mt-1.5">
          <input
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => onChange({ password: e.target.value })}
            placeholder="••••••••"
            className="w-full h-10 px-3 pr-10 border border-[#D8CFB8] bg-[#FFFDF8] rounded-sm text-sm text-[#2B2E23] placeholder:text-[#A9A18A] focus:outline-none focus:border-[#C1502E]"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A9A18A] hover:text-[#5C5A4E]"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </label>

      {password.length > 0 && (
        <ul className="space-y-1 -mt-1">
          {RULES.map((rule) => {
            const passed = rule.test(password);
            return (
              <li
                key={rule.label}
                className={`flex items-center gap-1.5 text-[11px] ${
                  passed ? 'text-[#3D4A2C]' : 'text-[#A9A18A]'
                }`}
              >
                {passed ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                {rule.label}
              </li>
            );
          })}
        </ul>
      )}

      <label className="block text-xs font-semibold text-[#5C5A4E]">
        Confirm password *
        <div className="relative mt-1.5">
          <input
            type={showConfirm ? 'text' : 'password'}
            required
            value={confirmPassword}
            onChange={(e) => onChange({ confirmPassword: e.target.value })}
            placeholder="••••••••"
            className={`w-full h-10 px-3 pr-10 border rounded-sm text-sm text-[#2B2E23] placeholder:text-[#A9A18A] focus:outline-none bg-[#FFFDF8] ${
              confirmPassword.length > 0 && !passwordsMatch
                ? 'border-[#C1502E]'
                : 'border-[#D8CFB8] focus:border-[#C1502E]'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A9A18A] hover:text-[#5C5A4E]"
            tabIndex={-1}
          >
            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {confirmPassword.length > 0 && !passwordsMatch && (
          <span className="text-[11px] text-[#C1502E] mt-1 block">Passwords don't match</span>
        )}
      </label>

      <div className="grid grid-cols-2 gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="w-full h-11 border border-[#D8CFB8] bg-[#FFFDF8] hover:bg-[#F4EFE3] text-[#2B2E23] text-sm font-medium rounded-sm transition-colors"
        >
          ← Back
        </button>
        <button
          type="button"
          disabled={!isValid || loading}
          onClick={onSubmit}
          className="w-full h-11 bg-[#C1502E] hover:bg-[#993C1D] text-[#FFFBF2] text-sm font-medium rounded-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </div>
    </div>
  );
};
