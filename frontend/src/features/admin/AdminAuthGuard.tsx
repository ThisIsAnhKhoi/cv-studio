import React, { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { ShieldAlert, ShieldCheck, LogIn, ArrowLeft, Loader2, Lock } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';
import { checkAdminPermissions, AdminPermissions } from '../../services/adminService';

interface AdminAuthGuardProps {
  children?: React.ReactNode;
}

export const AdminAuthGuard: React.FC<AdminAuthGuardProps> = ({ children }) => {
  const { user, isInitialized, openAuthModal } = useAuthStore();
  const [permissions, setPermissions] = useState<AdminPermissions>({
    isSuperAdmin: false,
    isAdmin: false,
    isModerator: false,
  });
  const [isVerifying, setIsVerifying] = useState<boolean>(true);

  useEffect(() => {
    if (!isInitialized) return;

    if (!user) {
      setPermissions({ isSuperAdmin: false, isAdmin: false, isModerator: false });
      setIsVerifying(false);
      return;
    }

    let isMounted = true;
    setIsVerifying(true);

    checkAdminPermissions(user)
      .then((perms) => {
        if (isMounted) {
          setPermissions(perms);
          setIsVerifying(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setPermissions({ isSuperAdmin: false, isAdmin: false, isModerator: false });
          setIsVerifying(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [user, isInitialized]);

  // Loading spinner while verifying credentials
  if (!isInitialized || isVerifying) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
            Đang xác thực quyền quản trị viên...
          </p>
        </div>
      </div>
    );
  }

  // Case 1: Not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 text-center">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Khu Vực Quản Trị Hệ Thống
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Bạn cần đăng nhập bằng tài khoản có đặc quyền quản trị viên hoặc kiểm duyệt viên để truy cập.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => openAuthModal('login')}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm transition-colors cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Đăng Nhập Quản Trị Viên</span>
            </button>
            <Link
              to="/"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Về Trang Chủ</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Case 2: Logged in but insufficient permissions (403 Forbidden)
  if (!permissions.isModerator && !permissions.isAdmin && !permissions.isSuperAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 text-center">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-slate-900 border border-rose-200/80 dark:border-rose-900/60 shadow-xl space-y-5">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400">
              403 Forbidden
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              Từ Chối Quyền Truy Cập
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Tài khoản <strong className="text-slate-900 dark:text-slate-200">{user.email}</strong> không nằm trong danh sách Quản trị viên (Admin) hoặc Kiểm duyệt viên (Moderator).
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay Lại Trang Chủ</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Case 3: Permitted
  return children ? <>{children}</> : <Outlet context={{ permissions }} />;
};
export default AdminAuthGuard;
