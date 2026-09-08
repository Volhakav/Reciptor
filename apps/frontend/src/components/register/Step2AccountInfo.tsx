import React from 'react';

interface Step2Props {
  email: string;
  phone: string;
  onChange: (fields: Partial<{ email: string; phone: string }>) => void;
  onBack: () => void;
  onNext: () => void;
}

export const Step2AccountInfo: React.FC<Step2Props> = ({
  email,
  phone,
  onChange,
  onBack,
  onNext,
}) => {
  const isEmailValid = email.includes('@') && email.includes('.');
  const isPhoneValid = phone.trim().length >= 7;
  const isStep2Valid = isEmailValid && isPhoneValid;

  return (
    <div className="space-y-4">
      <label className="block text-xs font-semibold text-[#5C5A4E]">
        Email address *
        <input
          type="email"
          required
          value={email}
          onChange={(e) => onChange({ email: e.target.value })}
          placeholder="you@example.com"
          className="w-full h-10 mt-1.5 px-3 border border-[#D8CFB8] bg-[#FFFDF8] rounded-lg text-sm text-[#2B2E23] placeholder:text-[#A9A18A] focus:outline-none focus:border-[#C1502E]"
        />
      </label>

      <label className="block text-xs font-semibold text-[#5C5A4E]">
        Phone number *
        <input
          type="tel"
          required
          value={phone}
          onChange={(e) => onChange({ phone: e.target.value })}
          placeholder="+1 (555) 000-0000"
          className="w-full h-10 mt-1.5 px-3 border border-[#D8CFB8] bg-[#FFFDF8] rounded-lg text-sm text-[#2B2E23] placeholder:text-[#A9A18A] focus:outline-none focus:border-[#C1502E]"
        />
      </label>

      <div className="grid grid-cols-2 gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="w-full h-11 border border-[#D8CFB8] bg-[#FFFDF8] hover:bg-[#F4EFE3] text-[#2B2E23] text-sm font-medium rounded-lg transition-colors"
        >
          ← Back
        </button>
        <button
          type="button"
          disabled={!isStep2Valid}
          onClick={onNext}
          className="w-full h-11 bg-[#C1502E] hover:bg-[#993C1D] text-[#FFFBF2] text-sm font-medium rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next: Security →
        </button>
      </div>
    </div>
  );
};
