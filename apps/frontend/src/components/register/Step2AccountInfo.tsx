import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Mail, Phone, XCircle } from 'lucide-react';
import { Input } from '../ui/Field';
import { Button } from '../ui/Button';

interface Step2Props {
  email: string;
  phone: string;
  onChange: (fields: Partial<{ email: string; phone: string }>) => void;
  onBack: () => void;
  onNext: () => void;
}

type Status = 'idle' | 'checking' | 'available' | 'taken' | 'invalid';

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

  const [emailStatus, setEmailStatus] = useState<Status>('idle');
  const [phoneStatus, setPhoneStatus] = useState<Status>('idle');

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

  const fieldState = (status: Status) => {
    if (status === 'available') return 'ok' as const;
    if (status === 'taken' || status === 'invalid') return 'bad' as const;
    return 'default' as const;
  };

  const statusHint = (status: Status, label: 'email' | 'phone') => {
    const noun = label === 'email' ? 'Email' : 'Phone number';
    switch (status) {
      case 'checking':
        return (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Checking availability…
          </>
        );
      case 'available':
        return (
          <>
            <CheckCircle2 className="h-3.5 w-3.5" />
            {noun} is available
          </>
        );
      case 'taken':
        return (
          <>
            <XCircle className="h-3.5 w-3.5" />
            {noun} is already registered
          </>
        );
      case 'invalid':
        return label === 'email' ? (
          <>
            <XCircle className="h-3.5 w-3.5" />
            Enter a valid email address
          </>
        ) : (
          <>
            <XCircle className="h-3.5 w-3.5" />
            Enter a valid phone number
          </>
        );
      default:
        return label === 'email'
          ? 'We will use this to sign you in.'
          : 'Optional — for account recovery.';
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
      <Input
        label="Email address"
        type="email"
        required
        value={email}
        onChange={(e) => onChange({ email: e.target.value })}
        placeholder="you@example.com"
        leading={<Mail className="h-4 w-4" />}
        state={fieldState(emailStatus)}
        hint={statusHint(emailStatus, 'email')}
        autoComplete="email"
      />

      <Input
        label="Phone number (optional)"
        type="tel"
        value={phone}
        onChange={(e) => onChange({ phone: e.target.value })}
        placeholder="+1 (555) 000-0000"
        leading={<Phone className="h-4 w-4" />}
        state={fieldState(phoneStatus)}
        hint={statusHint(phoneStatus, 'phone')}
        autoComplete="tel"
      />

      <div className="grid grid-cols-2 gap-3 pt-2">
        <Button type="button" variant="secondary" size="lg" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button type="button" size="lg" disabled={!canProceed} onClick={onNext}>
          Continue
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
