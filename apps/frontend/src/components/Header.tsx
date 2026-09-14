import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChefHat, Bookmark, LogIn, UserPlus, LogOut, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-[#FFFBF2] border-b border-[#D8CFB8] sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 font-serif text-xl font-semibold text-[#2B2E23] hover:text-[#C1502E] transition-colors"
        >
          <ChefHat className="w-6 h-6 text-[#C1502E]" />
          <span>
            Reciptor{' '}
            <span className="font-sans text-xs font-medium text-[#8A6B3F] bg-[#F4EFE3] px-2 py-0.5 rounded-sm border border-[#D8CFB8]">
              AI
            </span>
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-4 sm:gap-6">
          {isAuthenticated ? (
            <>
              <Link
                to="/"
                className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#5C5A4E] hover:text-[#C1502E] transition-colors"
              >
                <Sparkles className="w-4 h-4 text-[#C1502E]" />
                <span>Generator</span>
              </Link>
              <Link
                to="/favorites"
                className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#5C5A4E] hover:text-[#C1502E] transition-colors"
              >
                <Bookmark className="w-4 h-4 text-[#3D4A2C]" />
                <span>Saved</span>
              </Link>
              <div className="flex items-center gap-3 pl-4 border-l border-[#E3DCC8]">
                <span className="text-xs font-medium text-[#2B2E23] bg-[#F4EFE3] px-2.5 py-1 rounded-sm border border-[#D8CFB8]">
                  {user?.firstName || user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-xs font-medium text-[#6B6858] hover:text-[#C1502E] transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign out</span>
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3 text-xs sm:text-sm">
              <Link
                to="/login"
                className="flex items-center gap-1 text-[#5C5A4E] hover:text-[#C1502E] font-medium transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign in</span>
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-1 bg-[#C1502E] hover:bg-[#993C1D] text-[#FFFBF2] px-3 py-1.5 rounded-sm font-medium transition-colors shadow-xs"
              >
                <UserPlus className="w-4 h-4" />
                <span>Sign up</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
