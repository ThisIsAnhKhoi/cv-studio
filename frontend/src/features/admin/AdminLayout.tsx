import React from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Users,
  ScrollText,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';
import { SUPER_ADMIN_EMAIL } from '../../services/adminService';

export const AdminLayout: React.FC = () => {
  const { user } = useAuthStore();
  const location = useLocation();

  const isSuperAdmin = user?.email?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();

  const navItems = [
    { to: '/admin', label: 'Tổng Quan', icon: LayoutDashboard, end: true },
    { to: '/admin/cvs', label: 'Quản Lý CV', icon: FileText, end: false },
    { to: '/admin/users', label: 'Quản Lý Người Dùng', icon: Users, end: false },
    { to: '/admin/logs', label: 'Nhật Ký Kiểm Toán', icon: ScrollText, end: false },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Top Admin Navigation Bar */}
      <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <Link to="/admin" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-rose-900/30">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base tracking-tight text-white font-display">
                    CV Studio
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
                    ADMIN
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 -mt-0.5 hidden sm:block">
                  Trung Tâm Quản Trị & Kiểm Duyệt
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.end
                ? location.pathname === item.to
                : location.pathname.startsWith(item.to);

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Right: User Profile & Website Link */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-slate-800/80 px-2.5 py-1 rounded-xl border border-slate-700/80 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-medium text-slate-300 truncate max-w-[140px]">
                {user?.displayName || user?.email}
              </span>
              <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                {isSuperAdmin ? 'Super Admin' : 'Admin'}
              </span>
            </div>

            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors"
              title="Về trang chủ website chính"
            >
              <span>Về Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="md:hidden flex items-center gap-1 overflow-x-auto pt-2.5 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.end
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                  isActive
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </header>

      {/* Main Admin Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};
export default AdminLayout;
