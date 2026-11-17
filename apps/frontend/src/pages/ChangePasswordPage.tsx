import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api/client';
import { AlertCircle, ArrowLeft, CheckCircle2, KeyRound, Lock } from 'lucide-react';
import { AuthShell } from '../components/AuthShell';
import { Logo } from '../components/ui/Logo';
import { Input } from '../components/ui/Field';
import { Button } from '../components/ui/Button';

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
    <AuthShell>
      <div className="rounded-3xl border border-line bg-surface p-6 shadow-soft sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <Logo size="sm" showAiBadge={false} />
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
            <KeyRound className="h-4.5 w-4.5" />
          </span>
        </div>

        <h1 className="font-display text-[26px] leading-tight text-ink">Change password</h1>
        <p className="mt-1.5 mb-6 text-[13.5px] leading-relaxed text-muted">
          Pick something fresh — at least 8 characters.
        </p>

        {error && (
          <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-berry-500/25 bg-berry-50 p-3 text-[13px] font-medium text-berry-600">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-leaf-500/25 bg-leaf-50 p-3 text-[13px] font-medium text-leaf-600">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Current password"
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="••••••••"
            leading={<Lock className="h-4 w-4" />}
            autoComplete="current-password"
          />

          <Input
            label="New password"
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
            leading={<Lock className="h-4 w-4" />}
            autoComplete="new-password"
            hint="Use at least 8 characters."
          />

          <Input
            label="Confirm new password"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            leading={<Lock className="h-4 w-4" />}
            autoComplete="new-password"
            state={
              confirmPassword.length > 0 && confirmPassword !== newPassword ? 'bad' : 'default'
            }
            hint={
              confirmPassword.length > 0 && confirmPassword !== newPassword
                ? 'Passwords do not match.'
                : undefined
            }
          />

          <Button type="submit" size="lg" fullWidth loading={loading} className="mt-1">
            {loading ? 'Updating…' : 'Update password'}
          </Button>
        </form>

        <div className="mt-6 flex items-center justify-between border-t border-line pt-4 text-[12.5px]">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 font-semibold text-muted transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Go back
          </button>
          <Link to="/" className="font-semibold text-brand-600 hover:text-brand-700">
            Back to generator
          </Link>
        </div>
      </div>
    </AuthShell>
  );
};
