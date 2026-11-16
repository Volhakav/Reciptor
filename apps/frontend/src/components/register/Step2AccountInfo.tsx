import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';

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
  const isPhoneValid = phone.trim().length === 0 || phone.trim().length >= 7;
  const isStep2Valid = isEmailValid && isPhoneValid;

  const [emailStatus, setEmailStatus] = useState<
    'idle' | 'checking' | 'available' | 'taken' | 'invalid'
  >('idle');
  const [phoneStatus, setPhoneStatus] = useState<
    'idle' | 'checking' | 'available' | 'taken' | 'invalid'
  >('idle');

  // Debounced availability check for email
  useEffect(() => {
    if (!isEmailValid) {
      setEmailStatus('invalid');
      return;
    }
    setEmailStatus('checking');
    const handle = setTimeout(async () => {
      try {
        const res = await api.post('/auth/check-availability', { email });
        setEmailStatus(res.data?.email?.available ? 'available' : 'taken');
      } catch {
        setEmailStatus('idle');
      }
    }, 500);
    return () => clearTimeout(handle);
  }, [email, isEmailValid]);

  // Debounced availability check for phone (only when provided)
  useEffect(() => {
    const trimmed = phone.trim();
    if (trimmed.length === 0) {
      setPhoneStatus('idle');
      return;
    }
    if (trimmed.length < 7) {
      setPhoneStatus('invalid');
      return;
    }
    setPhoneStatus('checking');
    const handle = setTimeout(async () => {
      try {
        const res = await api.post('/auth/check-availability', { phone: trimmed });
        setPhoneStatus(res.data?.phone?.available ? 'available' : 'taken');
      } catch {
        setPhoneStatus('idle');
      }
    }, 500);
    return () => clearTimeout(handle);
  }, [phone]);

  const statusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'border-[#3D4A2C] focus:border-[#3D4A2C]';
      case 'taken':
      case 'invalid':
        return 'border-[#C1502E] focus:border-[#C1502E]';
      default:
        return 'border-[#D8CFB8] focus:border-[#C1502E]';
    }
  };

  const statusText = (status: string, label: string) => {
    switch (status) {
      case 'checking':
        return <span className="text-[11px] text-[#8A6B3F] mt-1 block">Checking {label}…</span>;
      case 'available':
        return <span className="text-[11px] text-[#3D4A2C] mt-1 block">{label} is available</span>;
      case 'taken':
        return (
          <span className="text-[11px] text-[#C1502E] mt-1 block">
            {label} is already registered
          </span>
        );
      case 'invalid':
        return <span className="text-[11px] text-[#C1502E] mt-1 block">Invalid {label}</span>;
      default:
        return null;
    }
  };

  const canProceed =
    isStep2Valid &&
    emailStatus !== 'taken' &&
    emailStatus !== 'checking' &&
    phoneStatus !== 'taken' &&
    phoneStatus !== 'checking';

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
          className={`w-full h-10 mt-1.5 px-3 border rounded-lg text-sm text-[#2B2E23] placeholder:text-[#A9A18A] focus:outline-none bg-[#FFFDF8] ${statusColor(emailStatus)}`}
        />
        {statusText(emailStatus, 'Email')}
      </label>

      <label className="block text-xs font-semibold text-[#5C5A4E]">
        Phone number (optional)
        <input
          type="tel"
          value={phone}
          onChange={(e) => onChange({ phone: e.target.value })}
          placeholder="+1 (555) 000-0000"
          className={`w-full h-10 mt-1.5 px-3 border rounded-lg text-sm text-[#2B2E23] placeholder:text-[#A9A18A] focus:outline-none bg-[#FFFDF8] ${statusColor(phoneStatus)}`}
        />
        {statusText(phoneStatus, 'Phone')}
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
          disabled={!canProceed}
          onClick={onNext}
          className="w-full h-11 bg-[#C1502E] hover:bg-[#993C1D] text-[#FFFBF2] text-sm font-medium rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next: Security →
        </button>
      </div>
    </div>
  );
};
