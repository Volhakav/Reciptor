import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api/client';
import { ChefHat, AlertCircle, CheckCircle2, Lock } from 'lucide-react';

export const ChangePasswordPage: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      setSuccess('Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-[#F4EFE3]">
      <div className="w-full max-w-sm my-6 bg-[#FFFBF2] border border-[#D8CFB8] rounded-2xl relative px-8 py-9">
        <div
          className="absolute left-0 top-5 bottom-5 w-[2px]"
          style={{
            background: 'repeating-linear-gradient(to bottom, #C1502E 0 6px, transparent 6px 12px)',
          }}
        />

        <div className="pl-1.5">
          <div className="flex items-center gap-2 mb-3">
            <ChefHat className="w-5 h-5 text-[#C1502E]" />
            <span className="text-sm font-medium text-[#8A6B3F]">Reciptor</span>
          </div>

          <h1 className="font-serif text-[26px] font-semibold text-[#2B2E23] mb-1">
            Change password
          </h1>
          <p className="text-[13px] text-[#6B6858] mb-6">Update the password for your account.</p>

          {error && (
            <div className="mb-4 p-3 bg-[#FAECE7] border border-[#F0997B] rounded-sm flex items-center gap-2 text-[#993C1D] text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-[#EAF3EA] border border-[#9CC59C] rounded-sm flex items-center gap-2 text-[#2F5F2F] text-sm">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <label className="block text-xs text-[#5C5A4E]">
              Current password
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-10 mt-1.5 px-3 border border-[#D8CFB8] bg-[#FFFDF8] rounded-lg text-sm text-[#2B2E23] placeholder:text-[#A9A18A] focus:outline-none focus:border-[#C1502E]"
              />
            </label>

            <label className="block text-xs text-[#5C5A4E]">
              New password
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-10 mt-1.5 px-3 border border-[#D8CFB8] bg-[#FFFDF8] rounded-lg text-sm text-[#2B2E23] placeholder:text-[#A9A18A] focus:outline-none focus:border-[#C1502E]"
              />
            </label>

            <label className="block text-xs text-[#5C5A4E]">
              Confirm new password
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-10 mt-1.5 px-3 border border-[#D8CFB8] bg-[#FFFDF8] rounded-lg text-sm text-[#2B2E23] placeholder:text-[#A9A18A] focus:outline-none focus:border-[#C1502E]"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 mt-2 bg-[#C1502E] hover:bg-[#993C1D] text-[#FFFBF2] text-sm font-medium rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              {loading ? 'Updating…' : 'Update password'}
            </button>
          </form>

          <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#E3DCC8] text-xs">
            <button
              onClick={() => navigate(-1)}
              className="font-medium text-[#3D4A2C] hover:underline"
            >
              Go back
            </button>
            <Link to="/" className="text-[#A9A18A] hover:underline">
              Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
