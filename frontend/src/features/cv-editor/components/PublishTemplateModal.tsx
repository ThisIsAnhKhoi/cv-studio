import React, { useState, useEffect } from 'react';
import { CVData, CVCategory } from '../../../types/cv';
import { publishCommunityTemplate } from '../../../services/cvStorageService';
import {
  Sparkles,
  X,
  Check,
  Share2,
  Users,
  LayoutGrid,
  Palette,
  ExternalLink,
} from 'lucide-react';

interface PublishTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  cvData: CVData;
  userId?: string;
  onPublished?: (published: CVData) => void;
}

const CATEGORY_OPTIONS: { value: CVCategory; label: string }[] = [
  { value: 'tech', label: 'Công nghệ / Phần mềm (IT)' },
  { value: 'design', label: 'Thiết kế / Sáng tạo (UX/UI, Graphic)' },
  { value: 'data-ai', label: 'Dữ liệu & Trí tuệ nhân tạo (Data / AI)' },
  { value: 'marketing', label: 'Tiếp thị & Truyền thông (Marketing)' },
  { value: 'business', label: 'Kinh doanh & Quản trị (Business / Sales)' },
  { value: 'hr', label: 'Nhân sự & Tuyển dụng (HR)' },
  { value: 'other', label: 'Ngành nghề khác' },
];

export const PublishTemplateModal: React.FC<PublishTemplateModalProps> = ({
  isOpen,
  onClose,
  cvData,
  userId,
  onPublished,
}) => {
  const [templateTitle, setTemplateTitle] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [category, setCategory] = useState<CVCategory>('tech');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen && cvData) {
      setTemplateTitle(
        cvData.templateTitle ||
          `${cvData.personalInfo.title || 'CV Chuyên Nghiệp'} — Mẫu Tùy Chỉnh`
      );
      setTemplateDescription(
        cvData.templateDescription ||
          `Bố cục CV được thiết kế và sắp xếp tối ưu cho vị trí ${
            cvData.personalInfo.title || 'chuyên môn'
          }, hỗ trợ kéo thả tùy biến từng mục.`
      );
      setAuthorName(cvData.authorName || cvData.personalInfo.fullName || 'Thành viên CV Studio');
      setCategory(cvData.category || 'tech');
      setIsSuccess(false);
    }
  }, [isOpen, cvData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const published = publishCommunityTemplate(
      cvData,
      {
        templateTitle,
        templateDescription,
        authorName,
        category,
      },
      userId
    );
    setIsSuccess(true);
    if (onPublished) {
      onPublished(published);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Top Gradient Banner */}
        <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 px-6 py-5 text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Đóng"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">
                Lưu & Chia Sẻ Mẫu CV Lên Cộng Đồng
              </h3>
              <p className="text-xs text-teal-100 mt-0.5">
                Đóng góp bố cục CV tùy chỉnh của bạn để mọi người tham khảo và nhân bản dùng thử
              </p>
            </div>
          </div>
        </div>

        {isSuccess ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                Đã Đăng Tải Mẫu CV Lên Cộng Đồng!
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                Mẫu CV <strong>"{templateTitle}"</strong> của bạn đã xuất hiện trong{' '}
                <strong>Thư Viện Mẫu CV Cộng Đồng</strong> tại Trang Chủ và trang Khám Phá. Bất kỳ ai
                cũng có thể xem tham khảo hoặc nhấn <em>"Dùng Thử Mẫu Này"</em> để tạo bản sao riêng.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <a
                href="/explore"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Xem Thư Viện Cộng Đồng
              </a>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white shadow-sm transition-colors"
              >
                Tiếp Tục Chỉnh Sửa
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Highlights of what gets shared */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/70 text-[11px]">
              <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                <LayoutGrid className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                <span>Giữ nguyên bố cục 2 cột</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                <Palette className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Giữ màu sắc & Font chữ</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                <Users className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span>Cho phép Dùng thử 1-Click</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200">
                Tên Mẫu CV Cộng Đồng <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={templateTitle}
                onChange={(e) => setTemplateTitle(e.target.value)}
                placeholder="VD: CV Full-stack Developer — Bố Cục Ưu Tiên Dự Án"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200">
                  Tên Tác Giả Chia Sẻ
                </label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Tên của bạn"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200">
                  Nhóm Ngành Nghề
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CVCategory)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200">
                Mô Tả Điểm Nổi Bật Của Mẫu Này
              </label>
              <textarea
                rows={3}
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
                placeholder="Chia sẻ vì sao bố cục này hiệu quả (VD: Đưa mục Dự án lên đầu, thêm mục Ngoại ngữ & Ấn phẩm khoa học...)"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white shadow-md shadow-teal-600/20 transition-all"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Lưu & Chia Sẻ Mẫu Lên Cộng Đồng</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

