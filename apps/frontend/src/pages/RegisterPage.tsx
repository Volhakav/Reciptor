import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { ChefHat, AlertCircle } from 'lucide-react';
import { StepIndicator } from '../components/register/StepIndicator';
import { Step1PersonalInfo } from '../components/register/Step1PersonalInfo';
import { Step2AccountInfo } from '../components/register/Step2AccountInfo';
import { Step3SecurityInfo } from '../components/register/Step3SecurityInfo';

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

  const { login } = useAuth();
  const navigate = useNavigate();

  const updateFields = (fields: Partial<RegisterFormData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/register', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        gender: formData.gender,
        phone: formData.phone || undefined,
        birthDate: formData.birthDate || undefined,
      });

      const { user, token } = response.data;
      login(token, user);
      navigate('/');
    } catch (err: any) {
      console.error(err);
      // backend jest ostatecznym walidatorem hasła (min 8, 1 duża, 1 cyfra, 1 znak specjalny)
      setError(err.response?.data?.message || 'Registration failed. Please check your inputs.');
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-[#F4EFE3]">
      <div className="w-full max-w-md my-6">
        {/* Stepper — poza kartą */}
        <div className="mb-6">
          <StepIndicator steps={STEPS} current={step} />
        </div>

        {/* Karta */}
        <div className="bg-[#FFFBF2] border border-[#D8CFB8] rounded-sm relative px-8 py-9">
          {/* stitched edge */}
          <div
            className="absolute left-0 top-5 bottom-5 w-[2px]"
            style={{
              background:
                'repeating-linear-gradient(to bottom, #C1502E 0 6px, transparent 6px 12px)',
            }}
          />

          <div className="pl-1.5">
            <div className="flex items-center gap-2 mb-3">
              <ChefHat className="w-5 h-5 text-[#C1502E]" />
              <span className="text-sm font-medium text-[#8A6B3F]">Reciptor</span>
            </div>

            <h1 className="font-serif text-[26px] font-semibold text-[#2B2E23] mb-1">
              Create your account
            </h1>
            <p className="text-[13px] text-[#6B6858] mb-6">
              Sign up to start generating recipes from what's in your kitchen.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-[#FAECE7] border border-[#F0997B] rounded-sm flex items-center gap-2 text-[#993C1D] text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
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
          </div>
        </div>
      </div>
    </div>
  );
};
