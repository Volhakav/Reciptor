// Header.tsx
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
    <header className="bg-[#FFFBF2] border-b border-[#D8CFB8] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link
          to="/"
          className="flex items-center gap-2 text-[#2B2E23] hover:text-[#C1502E] transition-colors"
        >
          <ChefHat className="w-5 h-5 text-[#C1502E]" />
          <span className="font-medium text-[15px]">
            Reciptor <span className="text-[#8A6B3F] text-xs align-top">AI</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-5 sm:gap-6">
          {isAuthenticated ? (
            <>
              <Link
                to="/"
                className="flex items-center gap-1.5 text-[#5C5A4E] hover:text-[#C1502E] transition-colors text-sm"
              >
                <Sparkles className="w-4 h-4 text-[#C1502E]" />
                <span>Generator</span>
              </Link>
              <Link
                to="/favorites"
                className="flex items-center gap-1.5 text-[#5C5A4E] hover:text-[#C1502E] transition-colors text-sm"
              >
                <Bookmark className="w-4 h-4 text-[#3D4A2C]" />
                <span>Favorites</span>
              </Link>
              <div className="flex items-center gap-3 pl-4 border-l border-[#E3DCC8]">
                <span className="text-xs text-[#5C5A4E] bg-[#F4EFE3] px-3 py-1 rounded-sm border border-[#E3DCC8]">
                  {user?.firstName || user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-[#5C5A4E] hover:text-[#C1502E] text-sm transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign out</span>
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="flex items-center gap-1.5 text-[#5C5A4E] hover:text-[#C1502E] px-3 py-1.5 text-sm transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign in</span>
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-1.5 bg-[#C1502E] hover:bg-[#993C1D] text-[#FFFBF2] px-4 py-2 rounded-sm text-sm font-medium transition-colors"
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
