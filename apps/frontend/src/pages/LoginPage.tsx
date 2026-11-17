import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { AuthShell } from '../components/AuthShell';
import { Logo } from '../components/ui/Logo';
import { Input } from '../components/ui/Field';
import { Button } from '../components/ui/Button';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data;
      login(token, user);
      navigate('/');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <div className="rounded-3xl border border-line bg-surface p-6 shadow-soft sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <Logo size="sm" showAiBadge={false} />
          <span className="rounded-full bg-leaf-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-leaf-600 ring-1 ring-leaf-100">
            Welcome back
          </span>
        </div>

        <h1 className="font-display text-[28px] leading-tight text-ink">Good to see you again</h1>
        <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">
          Sign in to pick up where you left off in your cookbook.
        </p>

        {error && (
          <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-berry-500/25 bg-berry-50 p-3 text-[13px] font-medium text-berry-600">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input
            label="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            leading={<Mail className="h-4 w-4" />}
            autoComplete="email"
          />

          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            leading={<Lock className="h-4 w-4" />}
            autoComplete="current-password"
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

          <Button type="submit" size="lg" fullWidth loading={loading} className="mt-1">
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        <div className="mt-6 flex items-center justify-between border-t border-line pt-4 text-[12.5px]">
          <span
            className="cursor-not-allowed text-muted/70"
            title="Password recovery is currently disabled"
          >
            Forgot password?
          </span>
          <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-700">
            Create account →
          </Link>
        </div>
      </div>
    </AuthShell>
  );
};
