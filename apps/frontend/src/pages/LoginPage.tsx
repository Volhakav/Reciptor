import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { ChefHat, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-[#F4EFE3]">
      <div className="w-full max-w-sm my-6 bg-[#FFFBF2] border border-[#D8CFB8] rounded-2xl relative px-8 py-9">
        {/* stitched edge */}
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

          <h1 className="font-serif text-[26px] font-semibold text-[#2B2E23] mb-1">Welcome back</h1>
          <p className="text-[13px] text-[#6B6858] mb-6">Sign in to get back to your recipes.</p>

          {error && (
            <div className="mb-4 p-3 bg-[#FAECE7] border border-[#F0997B] rounded-sm flex items-center gap-2 text-[#993C1D] text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <label className="block text-xs text-[#5C5A4E]">
              Email
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-10 mt-1.5 px-3 border border-[#D8CFB8] bg-[#FFFDF8] rounded-lg text-sm text-[#2B2E23] placeholder:text-[#A9A18A] focus:outline-none focus:border-[#C1502E]"
              />
            </label>

            <label className="block text-xs text-[#5C5A4E]">
              Password
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-10 mt-1.5 px-3 border border-[#D8CFB8] bg-[#FFFDF8] rounded-lg text-sm text-[#2B2E23] placeholder:text-[#A9A18A] focus:outline-none focus:border-[#C1502E]"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 mt-2 bg-[#C1502E] hover:bg-[#993C1D] text-[#FFFBF2] text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#E3DCC8] text-xs">
            <span
              className="text-[#A9A18A] cursor-not-allowed"
              title="Password recovery is currently disabled"
            >
              Forgot password?
            </span>
            <Link to="/register" className="font-medium text-[#3D4A2C] hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
