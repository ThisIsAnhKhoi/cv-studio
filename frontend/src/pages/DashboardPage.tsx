import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { CVData } from '../types/cv';
import {
  getUserCVs,
  deleteUserCV,
  cloneCV,
  createNewCV,
} from '../services/cvStorageService';
import { TEMPLATES_REGISTRY } from '../features/cv-templates/TemplateRegistry';
import {
  LayoutDashboard,
  PlusCircle,
  Eye,
  Edit3,
  Copy,
  Trash2,
  Sparkles,
  Calendar,
  Globe,
  Lock,
  ArrowRight,
  LogIn,
  Layers,
  Check,
  AlertTriangle,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, isInitialized, openAuthModal } = useAuthStore();
  const [userCVs, setUserCVs] = useState<CVData[]>([]);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const navigate = useNavigate();

  // Load CVs whenever user changes
  useEffect(() => {
    if (user?.uid) {
      const list = getUserCVs(user.uid);
      setUserCVs(list);
    } else {
      setUserCVs([]);
    }
  }, [user]);

  const showNotification = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleCreateNew = (templateId = 'template-classic-teal') => {
    if (!user) {
      openAuthModal('login');
      return;
    }
    const fresh = createNewCV(templateId, user.uid);
    showNotification('Đã khởi tạo CV mới thành công!');
    navigate(`/editor/${fresh.id}`);
  };

  const handleClone = (cv: CVData) => {
    if (!user) {
      openAuthModal('login');
      return;
    }
    const cloned = cloneCV(cv, user.uid);
    setUserCVs(getUserCVs(user.uid));
    showNotification(`Đã tạo bản sao "${cv.personalInfo.fullName}" thành công!`);
  };

  const handleDelete = (cvId: string) => {
    if (!user) return;
    deleteUserCV(cvId, user.uid);
    setUserCVs(getUserCVs(user.uid));
    setDeleteConfirmId(null);
    showNotification('Đã xóa CV thành công.');
  };

  const publicCount = userCVs.filter((c) => c.isPublic).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Notification Toast */}
        {actionNotice && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-teal-600 text-white shadow-xl shadow-teal-900/20 text-sm font-semibold animate-in slide-in-from-bottom-3 duration-200">
            <Check className="w-4 h-4" />
            <span>{actionNotice}</span>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6">
              <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400 mb-3">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                  Xác Nhận Xóa CV
                </h3>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
                Bạn có chắc chắn muốn xóa bản CV này? Thao tác này không thể hoàn tác sau khi thực hiện.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-md transition-colors cursor-pointer"
                >
                  Xóa Vĩnh Viễn
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-slate-200/80 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-xl bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <LayoutDashboard className="w-4 h-4" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight">
                Quản Lý Hồ Sơ CV
              </h1>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {user
                ? `Chào mừng ${user.displayName || user.email}! Quản lý các phiên bản CV và portfolio trực tuyến của bạn.`
                : 'Đăng nhập để lưu trữ và quản lý đồng bộ các CV của bạn.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <button
                id="btn-dashboard-create-cv"
                type="button"
                onClick={() => handleCreateNew('template-classic-teal')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 via-teal-700 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-semibold text-sm shadow-md shadow-teal-700/20 hover:shadow-teal-700/30 active:scale-95 transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Tạo CV Mới</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow-md transition-colors cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Đăng Nhập Ngay</span>
              </button>
            )}
          </div>
        </div>

        {/* Not Logged In Banner */}
        {!user && isInitialized && (
          <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-teal-500/10 via-emerald-500/5 to-transparent border border-teal-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-lg shadow-teal-600/30 shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Đăng nhập để sở hữu Dashboard cá nhân
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                  Lưu trữ không giới hạn số lượng CV, tự động đồng bộ trên mọi thiết bị và xuất bản link CV cá nhân.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => openAuthModal('login')}
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm shadow-md transition-all shrink-0 cursor-pointer"
            >
              Đăng Nhập / Đăng Ký
            </button>
          </div>
        )}

        {/* Stats Row (when logged in) */}
        {user && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Tổng Số CV
              </p>
              <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                {userCVs.length}
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                CV Công Khai
              </p>
              <p className="text-3xl font-black text-teal-600 dark:text-teal-400 mt-1">
                {publicCount}
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Mẫu Chuẩn Khả Dụng
              </p>
              <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                3 Mẫu
              </p>
            </div>
          </div>
        )}

        {/* CV List Section */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <span>Danh Sách CV Của Bạn ({userCVs.length})</span>
            </h2>
          </div>

          {user && userCVs.length === 0 ? (
            /* Empty State */
            <div className="text-center py-16 px-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4">
                <PlusCircle className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Bạn chưa có hồ sơ CV nào
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1 mb-6">
                Bắt đầu ngay hôm nay bằng cách chọn một trong 3 mẫu CV chuẩn bên dưới để cá nhân hóa thông tin của bạn.
              </p>
              <button
                type="button"
                onClick={() => handleCreateNew('template-classic-teal')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow-md transition-colors cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Tạo CV Đầu Tiên</span>
              </button>
            </div>
          ) : (
            /* Grid of CVs */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userCVs.map((cv) => {
                const template =
                  TEMPLATES_REGISTRY[cv.themeConfig.templateId] ||
                  TEMPLATES_REGISTRY['template-classic-teal'];
                const updatedTime = cv.updatedAt
                  ? new Date(cv.updatedAt).toLocaleDateString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })
                  : 'Gần đây';

                return (
                  <div
                    key={cv.id}
                    className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-lg hover:border-teal-500/40 dark:hover:border-teal-500/40 transition-all duration-200 flex flex-col justify-between overflow-hidden"
                  >
                    {/* Top card banner */}
                    <div className="p-5 border-b border-slate-100 dark:border-slate-800/80">
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/60 truncate max-w-[170px]">
                          {template.name}
                        </span>

                        <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                          {cv.isPublic ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                              <Globe className="w-3 h-3" />
                              Công khai
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-slate-400">
                              <Lock className="w-3 h-3" />
                              Riêng tư
                            </span>
                          )}
                        </div>
                      </div>

                      <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors line-clamp-1">
                        {cv.personalInfo.fullName || 'Chưa đặt tên'}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {cv.personalInfo.title || 'Chưa có chức danh'}
                      </p>

                      <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-4">
                        <Calendar className="w-3 h-3" />
                        <span>Cập nhật: {updatedTime}</span>
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="px-4 py-3 bg-slate-50/70 dark:bg-slate-950/50 flex items-center justify-between gap-1.5 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-1.5">
                        <Link
                          to={`/cv/${cv.id}`}
                          className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-white dark:hover:bg-slate-800 transition-colors"
                          title="Xem trực tiếp trang CV"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleClone(cv)}
                          className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Tạo bản sao CV này"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(cv.id)}
                          className="p-2 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                          title="Xóa CV"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <Link
                        to={`/editor/${cv.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-xs transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Chỉnh Sửa</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Template Starters Section */}
        <div className="mt-16 pt-12 border-t border-slate-200 dark:border-slate-800">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Khởi Tạo Nhanh Từ 3 Mẫu Chuẩn Doanh Nghiệp
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Chọn ngay một phong cách thiết kế để tạo mới hồ sơ của bạn với đầy đủ 9 khối thông tin chuyên nghiệp.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.values(TEMPLATES_REGISTRY).map((tpl) => (
              <div
                key={tpl.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500/60 dark:hover:border-teal-500/60 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-base text-slate-900 dark:text-white">
                      {tpl.name}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {tpl.recommendedRole.split(',')[0]}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                    {tpl.description}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleCreateNew(tpl.id)}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-teal-600 dark:bg-slate-800 dark:hover:bg-teal-600 text-slate-700 hover:text-white dark:text-slate-200 dark:hover:text-white font-semibold text-xs sm:text-sm transition-all duration-150 cursor-pointer group"
                >
                  <span>Dùng Mẫu Này</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
