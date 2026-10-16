import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  FileText,
  Globe,
  Ban,
  ArrowRight,
  ShieldCheck,
  ScrollText,
  Sparkles,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { getAdminMetrics, AdminMetrics } from '../../../services/adminService';

export const AdminOverviewPage: React.FC = () => {
  const [metrics, setMetrics] = useState<AdminMetrics>({
    totalUsers: 0,
    totalCVs: 8,
    publicCVs: 8,
    disabledCVs: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadData = () => {
    setIsLoading(true);
    getAdminMetrics()
      .then((data) => {
        setMetrics(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.warn('Lỗi khi tải metrics:', err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Banner & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
            Tổng Quan Hệ Thống
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Theo dõi khối lượng hồ sơ, trạng thái người dùng và an ninh hệ thống thời gian thực.
          </p>
        </div>
        <button
          type="button"
          onClick={loadData}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer disabled:opacity-50 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-teal-400' : ''}`} />
          <span>Làm Mới Số Liệu</span>
        </button>
      </div>

      {/* 4 Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Users */}
        <div className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700/80 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Tổng Người Dùng
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-white">
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin text-slate-500" /> : metrics.totalUsers}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Tài khoản đã đăng ký</span>
        </div>

        {/* Card 2: Total CVs */}
        <div className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700/80 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Tổng Số Hồ Sơ CV
            </span>
            <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-teal-400">
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin text-slate-500" /> : metrics.totalCVs}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Bao gồm công khai & nháp</span>
        </div>

        {/* Card 3: Public CVs */}
        <div className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700/80 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              CV Đang Công Khai
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-emerald-400">
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin text-slate-500" /> : metrics.publicCVs}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Đang hiển thị ở trang chủ</span>
        </div>

        {/* Card 4: Disabled CVs */}
        <div className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700/80 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              CV Đã Khóa
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <Ban className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-rose-400">
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin text-slate-500" /> : metrics.disabledCVs}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Đã vô hiệu hóa (Soft delete)</span>
        </div>
      </div>

      {/* Quick Action Navigation Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        <Link
          to="/admin/cvs"
          className="p-6 rounded-2xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/80 hover:border-teal-500/40 transition-all duration-200 group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-white group-hover:text-teal-400 transition-colors">
              Quản Lý Kiểm Duyệt CV
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Duyệt toàn bộ hồ sơ, lọc theo danh mục ngành nghề, khóa CV vi phạm có lưu lý do hoặc khôi phục hồ sơ hợp lệ.
            </p>
          </div>
          <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-teal-400">
            <span>Truy cập Quản lý CV</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          to="/admin/users"
          className="p-6 rounded-2xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/80 hover:border-blue-500/40 transition-all duration-200 group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors">
              Quản Lý Tài Khoản Người Dùng
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Xem danh sách người dùng, chuyển đổi vai trò (`user` ↔ `moderator`), vô hiệu hóa tài khoản và tự động đồng bộ ẩn CV.
            </p>
          </div>
          <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-blue-400">
            <span>Truy cập Quản lý User</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          to="/admin/logs"
          className="p-6 rounded-2xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/40 transition-all duration-200 group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <ScrollText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-white group-hover:text-amber-400 transition-colors">
              Nhật Ký Kiểm Toán (Audit Logs)
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Toàn bộ thao tác khóa/mở CV hoặc tài khoản đều được lưu vết bất biến trong Firestore, đảm bảo 100% minh bạch.
            </p>
          </div>
          <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-amber-400">
            <span>Xem Nhật ký kiểm toán</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      {/* Security Health Status Card */}
      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">
              Tình Trạng An Ninh & Giới Hạn Quota (Firebase Spark)
            </h3>
            <p className="text-xs text-slate-400">
              Quy tắc bảo mật Firestore Rules v2 đã kích hoạt với Fail-safe whitelist và bảo vệ nguyên tử.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-500 block">Quy tắc RBAC</span>
            <strong className="text-emerald-400 font-semibold mt-0.5 block">Đang hoạt động (Active)</strong>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-500 block">Fail-safe Super Admin</span>
            <strong className="text-white font-semibold mt-0.5 block">thanhanhkhoi.work@gmail.com</strong>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-500 block">Động cơ Đếm View</span>
            <strong className="text-teal-400 font-semibold mt-0.5 block">Khử trùng 30 phút / Safe updatedAt</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminOverviewPage;
