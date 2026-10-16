import React, { useState, useEffect, useMemo } from 'react';
import {
  FileText,
  Search,
  Filter,
  Eye,
  Ban,
  CheckCircle2,
  ExternalLink,
  AlertTriangle,
  Loader2,
  RefreshCw,
  X,
  ShieldAlert,
} from 'lucide-react';
import { getAllCVsForAdmin, disableCV, restoreCV } from '../../../services/adminService';
import { CVData, CVCategory, CV_CATEGORIES } from '../../../types/cv';
import { removeVietnameseTones } from '../../../utils/text';
import { useAuthStore } from '../../../stores/useAuthStore';

export const AdminCVsPage: React.FC = () => {
  const { user } = useAuthStore();
  const [cvs, setCvs] = useState<CVData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'disabled'>('all');
  const [selectedVisibility, setSelectedVisibility] = useState<'all' | 'public' | 'private'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modal State for Moderation Action
  const [activeModalCV, setActiveModalCV] = useState<CVData | null>(null);
  const [modalActionType, setModalActionType] = useState<'disable' | 'restore'>('disable');
  const [actionReason, setActionReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const loadCVs = async () => {
    setIsLoading(true);
    try {
      const list = await getAllCVsForAdmin();
      setCvs(list);
    } catch (err) {
      console.warn('Lỗi khi tải danh sách CV admin:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCVs();
  }, []);

  // Filtered CVs
  const filteredCVs = useMemo(() => {
    return cvs.filter((cv) => {
      // 1. Status Filter
      if (selectedStatus === 'active' && cv.status === 'disabled') return false;
      if (selectedStatus === 'disabled' && cv.status !== 'disabled') return false;

      // 2. Visibility Filter
      if (selectedVisibility === 'public' && !cv.isPublic) return false;
      if (selectedVisibility === 'private' && cv.isPublic) return false;

      // 3. Category Filter
      if (selectedCategory !== 'all' && cv.category !== selectedCategory) return false;

      // 4. Search Filter
      if (searchQuery.trim()) {
        const cleanQuery = removeVietnameseTones(searchQuery.trim().toLowerCase());
        const candidateName = removeVietnameseTones(cv.personalInfo?.fullName || '').toLowerCase();
        const cvTitle = removeVietnameseTones(cv.personalInfo?.title || '').toLowerCase();
        const cvId = (cv.id || '').toLowerCase();

        const matches =
          candidateName.includes(cleanQuery) ||
          cvTitle.includes(cleanQuery) ||
          cvId.includes(cleanQuery);

        if (!matches) return false;
      }

      return true;
    });
  }, [cvs, searchQuery, selectedStatus, selectedVisibility, selectedCategory]);

  const handleOpenModal = (cv: CVData, type: 'disable' | 'restore') => {
    setActiveModalCV(cv);
    setModalActionType(type);
    setActionReason('');
    setActionError(null);
  };

  const handleCloseModal = () => {
    if (isSubmitting) return;
    setActiveModalCV(null);
    setActionReason('');
    setActionError(null);
  };

  const handleSubmitAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalCV || !user) return;

    if (!actionReason || actionReason.trim().length < 5) {
      setActionError('Lý do kiểm duyệt bắt buộc phải có ít nhất 5 ký tự.');
      return;
    }

    setIsSubmitting(true);
    setActionError(null);

    try {
      if (modalActionType === 'disable') {
        await disableCV(activeModalCV.id, user, actionReason);
        setCvs((prev) =>
          prev.map((item) =>
            item.id === activeModalCV.id
              ? {
                  ...item,
                  status: 'disabled',
                  disabledReason: actionReason.trim(),
                  disabledBy: user.uid,
                }
              : item
          )
        );
        setSuccessToast(`Đã vô hiệu hóa hiển thị hồ sơ "${activeModalCV.personalInfo?.title || 'Hồ sơ'}".`);
      } else {
        await restoreCV(activeModalCV.id, user, actionReason);
        setCvs((prev) =>
          prev.map((item) =>
            item.id === activeModalCV.id
              ? {
                  ...item,
                  status: 'active',
                  disabledReason: undefined,
                  disabledBy: undefined,
                }
              : item
          )
        );
        setSuccessToast(`Đã khôi phục trạng thái hoạt động cho hồ sơ "${activeModalCV.personalInfo?.title || 'Hồ sơ'}".`);
      }

      setActiveModalCV(null);
      setTimeout(() => setSuccessToast(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Có lỗi xảy ra khi thực hiện thao tác.';
      setActionError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryLabel = (catKey?: CVCategory) => {
    const found = CV_CATEGORIES.find((c) => c.id === catKey);
    return found ? found.label : 'Chưa phân loại';
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-emerald-950/95 border border-emerald-500/50 text-emerald-200 px-4 py-3 rounded-2xl shadow-xl backdrop-blur-md animate-fade-in text-xs font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight flex items-center gap-3">
            <span>Quản Lý Hồ Sơ CV</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {cvs.length} hồ sơ
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Kiểm duyệt nội dung, quản lý trạng thái công khai và bảo vệ cộng đồng khỏi nội dung vi phạm.
          </p>
        </div>

        <button
          type="button"
          onClick={loadCVs}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer disabled:opacity-50 self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-teal-400' : ''}`} />
          <span>Làm Mới</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên, chức danh, ID..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-hidden focus:border-rose-500/80 transition-colors"
            />
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as 'all' | 'active' | 'disabled')}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-hidden focus:border-rose-500/80 transition-colors cursor-pointer"
          >
            <option value="all">Tất cả trạng thái duyệt</option>
            <option value="active">Đang hoạt động (Active)</option>
            <option value="disabled">Đã vô hiệu hóa (Disabled)</option>
          </select>

          {/* Visibility Filter */}
          <select
            value={selectedVisibility}
            onChange={(e) => setSelectedVisibility(e.target.value as 'all' | 'public' | 'private')}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-hidden focus:border-rose-500/80 transition-colors cursor-pointer"
          >
            <option value="all">Tất cả chế độ xem</option>
            <option value="public">Công khai (Public)</option>
            <option value="private">Riêng tư (Private)</option>
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-hidden focus:border-rose-500/80 transition-colors cursor-pointer"
          >
            <option value="all">Tất cả danh mục nghề</option>
            {CV_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Filter results counter */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
          <span>
            Đang hiển thị <strong className="text-slate-200">{filteredCVs.length}</strong> / {cvs.length} hồ sơ
          </span>
          {(searchQuery || selectedStatus !== 'all' || selectedVisibility !== 'all' || selectedCategory !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedStatus('all');
                setSelectedVisibility('all');
                setSelectedCategory('all');
              }}
              className="text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
            >
              Đặt lại bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* Main Table / Card List */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
          <span className="text-xs text-slate-400">Đang tải danh sách hồ sơ...</span>
        </div>
      ) : filteredCVs.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-slate-800/40 border border-slate-700/60 p-8 space-y-3">
          <FileText className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">Không tìm thấy hồ sơ nào</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Không có hồ sơ CV nào phù hợp với bộ lọc hoặc từ khóa tìm kiếm hiện tại.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl bg-slate-800/70 border border-slate-700/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-700/80 bg-slate-900/60 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-4">Hồ Sơ & Ứng Viên</th>
                  <th className="py-3 px-4">Ngành Nghề</th>
                  <th className="py-3 px-4">Trạng Thái</th>
                  <th className="py-3 px-4 text-center">Lượt Xem</th>
                  <th className="py-3 px-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50 text-xs">
                {filteredCVs.map((cv) => {
                  const isCvDisabled = cv.status === 'disabled';
                  const isOwnerDisabled = cv.ownerDisabled === true;

                  return (
                    <tr
                      key={cv.id}
                      className={`hover:bg-slate-750/50 transition-colors ${
                        isCvDisabled ? 'bg-rose-950/15' : ''
                      }`}
                    >
                      {/* Name & Title */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-700 border border-slate-600/80 flex items-center justify-center font-bold text-white shrink-0 overflow-hidden">
                            {cv.personalInfo?.avatarUrl ? (
                              <img
                                src={cv.personalInfo.avatarUrl}
                                alt={cv.personalInfo.fullName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span>{(cv.personalInfo?.fullName || 'CV').charAt(0)}</span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-white truncate max-w-[200px] sm:max-w-[260px]">
                              {cv.personalInfo?.title || 'Hồ sơ chuyên nghiệp'}
                            </p>
                            <p className="text-[11px] text-slate-400 truncate max-w-[200px]">
                              {cv.personalInfo?.fullName}
                            </p>
                            <span className="text-[10px] text-slate-500 font-mono">ID: {cv.id}</span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-900 border border-slate-700 text-slate-300">
                          {getCategoryLabel(cv.category)}
                        </span>
                      </td>

                      {/* Status Badges */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-1 items-start">
                          {isCvDisabled ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                              <Ban className="w-3 h-3" />
                              Bị Vô Hiệu Hóa
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                              <CheckCircle2 className="w-3 h-3" />
                              Hoạt Động
                            </span>
                          )}

                          <div className="flex items-center gap-1.5">
                            {cv.isPublic ? (
                              <span className="text-[10px] text-teal-400 font-medium">Công khai</span>
                            ) : (
                              <span className="text-[10px] text-slate-400 font-medium">Riêng tư</span>
                            )}

                            {isOwnerDisabled && (
                              <span
                                className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/30"
                                title="Chủ sở hữu hồ sơ này đang bị khóa tài khoản"
                              >
                                Tác giả bị khóa
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* View Count */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex items-center gap-1 text-slate-300 font-bold">
                          <Eye className="w-3.5 h-3.5 text-slate-400" />
                          <span>{(cv.viewCount || 0).toLocaleString('vi-VN')}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          {/* View CV link */}
                          <a
                            href={`/cv/${cv.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-slate-700/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="Mở xem hồ sơ"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>

                          {/* Moderate Action */}
                          {isCvDisabled ? (
                            <button
                              type="button"
                              onClick={() => handleOpenModal(cv, 'restore')}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-semibold transition-colors cursor-pointer"
                            >
                              Khôi Phục
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleOpenModal(cv, 'disable')}
                              className="px-2.5 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-[11px] font-semibold transition-colors cursor-pointer"
                            >
                              Vô Hiệu Hóa
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Action Confirmation Modal */}
      {activeModalCV && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    modalActionType === 'disable'
                      ? 'bg-rose-500/20 text-rose-400'
                      : 'bg-emerald-500/20 text-emerald-400'
                  }`}
                >
                  {modalActionType === 'disable' ? (
                    <Ban className="w-5 h-5" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">
                    {modalActionType === 'disable' ? 'Vô Hiệu Hóa Hồ Sơ' : 'Khôi Phục Hồ Sơ'}
                  </h3>
                  <p className="text-[11px] text-slate-400">Kiểm duyệt nội dung CV Studio</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={isSubmitting}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700 text-xs space-y-1">
              <p className="text-slate-300">
                <strong className="text-white">Tiêu đề:</strong> {activeModalCV.personalInfo?.title || 'Hồ sơ chuyên nghiệp'}
              </p>
              <p className="text-slate-400">
                <strong>Ứng viên:</strong> {activeModalCV.personalInfo?.fullName} (ID: {activeModalCV.id})
              </p>
            </div>

            <form onSubmit={handleSubmitAction} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-200 block">
                  Lý do thực hiện <span className="text-rose-400">*</span>
                  <span className="text-[10px] text-slate-400 font-normal ml-1">
                    (Ghi vào nhật ký kiểm toán không thể xóa)
                  </span>
                </label>
                <textarea
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  placeholder={
                    modalActionType === 'disable'
                      ? 'Ví dụ: Vi phạm quy chuẩn cộng đồng, chứa thông tin sai lệch...'
                      : 'Ví dụ: Đã kiểm tra và xác nhận hồ sơ tuân thủ quy định...'
                  }
                  rows={3}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-hidden focus:border-rose-500 transition-colors"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Tối thiểu 5 ký tự</span>
                  <span>{actionReason.trim().length} ký tự</span>
                </div>
              </div>

              {actionError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{actionError}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || actionReason.trim().length < 5}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all cursor-pointer disabled:opacity-50 ${
                    modalActionType === 'disable'
                      ? 'bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-900/30'
                      : 'bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-900/30'
                  }`}
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>
                    {modalActionType === 'disable' ? 'Xác Nhận Vô Hiệu Hóa' : 'Xác Nhận Khôi Phục'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
