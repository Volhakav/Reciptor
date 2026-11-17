import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bookmark, LogIn, LogOut, Sparkles, KeyRound, UserPlus } from 'lucide-react';
import { Logo, LogoMark } from './ui/Logo';
import { cn } from '../lib/cn';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 text-[13px] font-semibold transition-all duration-200',
    isActive
      ? 'bg-brand-50 text-brand-700 ring-1 ring-brand-100 shadow-xs'
      : 'text-muted hover:bg-canvas-2 hover:text-ink',
  );

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const displayName = user?.firstName || user?.email || 'Guest';
  const initials = displayName
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part: string) => part[0]?.toUpperCase())
    .join('');

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-3 sm:h-[4.5rem] sm:px-6 lg:px-8">
        <Link to="/" className="shrink-0 transition-opacity hover:opacity-80">
          <LogoMark size="sm" className="sm:hidden" />
          <Logo size="md" className="hidden sm:flex" />
        </Link>

        {isAuthenticated ? (
          <>
            <nav className="flex items-center gap-1 rounded-full bg-canvas p-1 ring-1 ring-line/70 sm:gap-1.5">
              <NavLink to="/" end className={navLinkClass}>
                <Sparkles className="h-4 w-4" />
                <span className="hidden sm:inline">Generator</span>
              </NavLink>
              <NavLink to="/favorites" className={navLinkClass}>
                <Bookmark className="h-4 w-4" />
                <span className="hidden sm:inline">Saved</span>
              </NavLink>
            </nav>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="hidden items-center gap-2 rounded-full border border-line bg-white py-1 pl-1 pr-3 md:flex">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-sun-500 text-[11px] font-bold text-white">
                  {initials || 'R'}
                </span>
                <span className="max-w-[130px] truncate text-xs font-semibold text-ink">
                  {displayName}
                </span>
              </div>

              <Link
                to="/change-password"
                title="Change password"
                className="grid h-10 w-10 place-items-center rounded-full text-muted transition-colors hover:bg-canvas-2 hover:text-brand-600"
              >
                <KeyRound className="h-[18px] w-[18px]" />
                <span className="sr-only">Change password</span>
              </Link>

              <button
                onClick={handleLogout}
                title="Sign out"
                className="grid h-10 w-10 place-items-center rounded-full text-muted transition-colors hover:bg-berry-50 hover:text-berry-600"
              >
                <LogOut className="h-[18px] w-[18px]" />
                <span className="sr-only">Sign out</span>
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 text-[13px] font-semibold text-muted transition-colors hover:bg-canvas-2 hover:text-ink"
            >
              <LogIn className="h-4 w-4" />
              <span>Sign in</span>
            </Link>
            <Link
              to="/register"
              className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-gradient-to-r from-brand-500 to-brand-400 px-3.5 py-2 text-[13px] font-semibold text-white shadow-glow transition-all hover:from-brand-600 hover:to-brand-500"
            >
              <UserPlus className="h-4 w-4" />
              <span className="hidden sm:inline">Sign up</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
