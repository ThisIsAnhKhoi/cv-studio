import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sparkles,
  Moon,
  Sun,
  ArrowUpRight,
  Compass,
  LayoutTemplate,
  Layers,
  LogIn,
  LayoutDashboard,
} from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';
import { UserDropdown } from '../auth/UserDropdown';

interface NavbarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ darkMode, onToggleDarkMode }) => {
  const location = useLocation();
  const { user, openAuthModal } = useAuthStore();

  const isHome = location.pathname === '/';
  const isDashboard = location.pathname === '/dashboard';

  return (
    <header className="no-print sticky top-0 z-50 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-xl"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 via-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight font-display bg-gradient-to-r from-teal-700 via-emerald-600 to-teal-500 dark:from-teal-300 dark:via-emerald-400 dark:to-teal-200 bg-clip-text text-transparent">
                CV Studio
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800/60">
                PRO
              </span>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium -mt-1 hidden sm:block">
              Nền Tảng CV & Portfolio Đẳng Cấp
            </span>
          </div>
        </Link>

        {/* Navigation Menu */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-semibold text-slate-600 dark:text-slate-300">
          <Link
            to="/"
            className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
              isHome
                ? 'text-teal-700 dark:text-teal-400 bg-teal-50/80 dark:bg-teal-950/40 font-bold'
                : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Khám Phá Hồ Sơ</span>
          </Link>

          {/* Quick link to Dashboard if logged in */}
          {user && (
            <Link
              to="/dashboard"
              className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
                isDashboard
                  ? 'text-teal-700 dark:text-teal-400 bg-teal-50/80 dark:bg-teal-950/40 font-bold'
                  : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Dashboard CV</span>
            </Link>
          )}

          <a
            href="/#templates-showcase"
            className="px-3.5 py-2 rounded-lg flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
          >
            <LayoutTemplate className="w-4 h-4" />
            <span>3 Mẫu CV Chuẩn</span>
          </a>
          <a
            href="/#features-section"
            className="px-3.5 py-2 rounded-lg flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
          >
            <Layers className="w-4 h-4" />
            <span>Quy Chuẩn A4</span>
          </a>
        </nav>

        {/* Actions Bar */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Dark / Light Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80 transition-all hover:scale-105 cursor-pointer"
            title={darkMode ? 'Chuyển sang Giao diện Sáng' : 'Chuyển sang Giao diện Tối'}
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* User Auth: Login Button or UserDropdown */}
          {user ? (
            <UserDropdown />
          ) : (
            <button
              id="btn-nav-login"
              type="button"
              onClick={() => openAuthModal('login')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white text-xs sm:text-sm font-semibold border border-slate-200 dark:border-slate-700/80 transition-all cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-600 dark:text-teal-400" />
              <span>Đăng Nhập</span>
            </button>
          )}

          {/* Primary CTA: Go to Editor */}
          <Link
            to="/editor"
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-teal-600 via-teal-700 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 active:scale-95 text-white font-semibold text-xs sm:text-sm shadow-md shadow-teal-700/20 hover:shadow-teal-700/30 transition-all duration-150 cursor-pointer"
          >
            <span className="hidden xs:inline sm:inline">Tạo CV</span>
            <span className="inline xs:hidden sm:hidden">Tạo</span>
            <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
