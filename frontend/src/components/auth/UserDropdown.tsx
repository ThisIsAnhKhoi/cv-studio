import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import {
  User as UserIcon,
  LayoutDashboard,
  PlusCircle,
  LogOut,
  ChevronDown,
  Sparkles,
  Compass,
  ShieldCheck,
} from 'lucide-react';
import { isSuperAdminEmail } from '../../services/adminService';

interface UserDropdownProps {
  className?: string;
}

export const UserDropdown: React.FC<UserDropdownProps> = ({ className = '' }) => {
  const { user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!user) return null;

  const displayName = user.displayName || user.email?.split('@')[0] || 'Người dùng';
  const initialLetter = displayName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    navigate('/');
  };

  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
      {/* Trigger Button */}
      <button
        id="user-menu-button"
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label="Menu tài khoản người dùng"
        className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/80 transition-all duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
      >
        {/* Avatar or Initial Circle */}
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg overflow-hidden flex items-center justify-center font-bold text-xs sm:text-sm text-white bg-gradient-to-tr from-teal-600 via-teal-500 to-emerald-400 shadow-xs shrink-0">
          {user.photoURL && !avatarError ? (
            <img
              src={user.photoURL}
              alt={displayName}
              referrerPolicy="no-referrer"
              onError={() => setAvatarError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <span>{initialLetter}</span>
          )}
        </div>

        {/* Display Name (hidden on small mobile) */}
        <span className="hidden sm:inline font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-100 max-w-[120px] truncate">
          {displayName}
        </span>

        {/* Chevron Icon */}
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-500 dark:text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu Panel */}
      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu-button"
          className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xl shadow-slate-900/10 dark:shadow-black/40 py-2 z-50 animate-in fade-in zoom-in-95 duration-150 divide-y divide-slate-100 dark:divide-slate-800/80"
        >
          {/* User Info Header */}
          <div className="px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center font-bold text-sm text-white bg-gradient-to-tr from-teal-600 via-teal-500 to-emerald-400 shadow-xs shrink-0">
                {user.photoURL && !avatarError ? (
                  <img
                    src={user.photoURL}
                    alt={displayName}
                    referrerPolicy="no-referrer"
                    onError={() => setAvatarError(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{initialLetter}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {displayName}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {user.email || 'Đã liên kết'}
                </p>
              </div>
            </div>
            <div className="mt-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/60">
              <Sparkles className="w-2.5 h-2.5 text-teal-600 dark:text-teal-400" />
              <span>Tài khoản PRO Cá Nhân</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="py-1">
            <Link
              to="/dashboard"
              role="menuitem"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/70 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-slate-400 group-hover:text-teal-600" />
              <span>Quản Lý CV (Dashboard)</span>
            </Link>

            <Link
              to="/editor"
              role="menuitem"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/70 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            >
              <PlusCircle className="w-4 h-4 text-slate-400" />
              <span>Tạo CV Mới</span>
            </Link>

            <Link
              to="/"
              role="menuitem"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/70 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            >
              <Compass className="w-4 h-4 text-slate-400" />
              <span>Khám Phá Mẫu Hồ Sơ</span>
            </Link>

            {isSuperAdminEmail(user.email) && (
              <Link
                to="/admin"
                role="menuitem"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-xs sm:text-sm font-bold text-rose-600 dark:text-rose-400 bg-rose-50/60 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-rose-500" />
                <span>Trung Tâm Quản Trị (Admin)</span>
              </Link>
            )}
          </div>

          {/* Logout Action */}
          <div className="py-1">
            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs sm:text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors text-left cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-rose-500" />
              <span>Đăng Xuất</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
