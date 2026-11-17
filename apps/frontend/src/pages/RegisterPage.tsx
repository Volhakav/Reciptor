import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api/client';
import { AlertCircle } from 'lucide-react';
import { StepIndicator } from '../components/register/StepIndicator';
import { Step1PersonalInfo } from '../components/register/Step1PersonalInfo';
import { Step2AccountInfo } from '../components/register/Step2AccountInfo';
import { Step3SecurityInfo } from '../components/register/Step3SecurityInfo';
import { AuthShell } from '../components/AuthShell';
import { Logo } from '../components/ui/Logo';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

const STEPS = [{ label: 'Personal info' }, { label: 'Contact' }, { label: 'Security' }];

export const RegisterPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    birthDate: '',
    gender: 'female',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const updateFields = (fields: Partial<RegisterFormData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      await api.post('/auth/register', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        gender: formData.gender,
        phone: formData.phone || undefined,
        birthDate: formData.birthDate || undefined,
      });

      navigate('/register/success');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Registration failed. Please check your inputs.');
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <div className="rounded-3xl border border-line bg-surface p-6 shadow-soft sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <Logo size="sm" showAiBadge={false} />
          <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-600 ring-1 ring-brand-100">
            Step {step} of 3
          </span>
        </div>

        <StepIndicator steps={STEPS} current={step} />

        <h1 className="font-display text-[26px] leading-tight text-ink">Create your account</h1>
        <p className="mt-1.5 mb-5 text-[13.5px] leading-relaxed text-muted">
          A few details and your personal AI cookbook is ready.
        </p>

        {error && (
          <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-berry-500/25 bg-berry-50 p-3 text-[13px] font-medium text-berry-600">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {step === 1 && (
          <Step1PersonalInfo
            firstName={formData.firstName}
            lastName={formData.lastName}
            birthDate={formData.birthDate}
            gender={formData.gender}
            onChange={updateFields}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <Step2AccountInfo
            email={formData.email}
            phone={formData.phone}
            onChange={updateFields}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        )}

        {step === 3 && (
          <Step3SecurityInfo
            password={formData.password}
            confirmPassword={formData.confirmPassword}
            onChange={updateFields}
            onBack={() => setStep(2)}
            onSubmit={handleSubmit}
            loading={loading}
          />
        )}

        <div className="mt-6 border-t border-line pt-4 text-center text-[12.5px] text-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
            Sign in
          </Link>
        </div>
      </div>
    </AuthShell>
  );
};
