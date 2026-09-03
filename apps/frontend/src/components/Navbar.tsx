import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Utensils, Bookmark, LogIn, UserPlus, LogOut, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-amber-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 font-extrabold text-xl text-amber-800 hover:text-amber-900 transition-colors"
        >
          <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-xl shadow-md shadow-orange-500/20">
            <Utensils className="w-5 h-5" />
          </div>
          <span className="tracking-tight">
            Reciptor <span className="text-orange-500 font-semibold text-sm">AI</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-4 sm:gap-6">
          {isAuthenticated ? (
            <>
              <Link
                to="/"
                className="flex items-center gap-1.5 text-stone-600 hover:text-amber-800 transition-colors font-medium text-sm"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Генератор</span>
              </Link>
              <Link
                to="/favorites"
                className="flex items-center gap-1.5 text-stone-600 hover:text-amber-800 transition-colors font-medium text-sm"
              >
                <Bookmark className="w-4 h-4 text-orange-500" />
                <span>Избранное</span>
              </Link>
              <div className="flex items-center gap-3 pl-4 border-l border-amber-200/60">
                <span className="text-xs sm:text-sm font-semibold text-stone-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200/60">
                  {user?.firstName || user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 px-3 py-1.5 rounded-xl text-xs sm:text-sm transition-colors font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Выйти</span>
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="flex items-center gap-1.5 text-stone-600 hover:text-amber-800 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Вход</span>
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-md shadow-orange-500/20"
              >
                <UserPlus className="w-4 h-4" />
                <span>Регистрация</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
