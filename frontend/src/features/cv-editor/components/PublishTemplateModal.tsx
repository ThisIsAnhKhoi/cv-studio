import React, { useState, useEffect, useMemo } from 'react';
import { CVData, CVCategory } from '../../../types/cv';
import {
  publishCommunityTemplate,
  validateCVForPublishing,
  CVValidationReport,
} from '../../../services/cvStorageService';
import {
  Sparkles,
  X,
  Check,
  Share2,
  Users,
  LayoutGrid,
  Palette,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showChecklistDetails, setShowChecklistDetails] = useState(false);

  useEffect(() => {
    if (isOpen && cvData) {
      setTemplateTitle(
        cvData.templateTitle ||
          (cvData.personalInfo?.title
            ? `CV ${cvData.personalInfo.title} — Mẫu Chuẩn Chuyên Nghiệp`
            : 'Mẫu CV Bố Cục Tùy Chỉnh Chuyên Nghiệp')
      );
      setTemplateDescription(
        cvData.templateDescription ||
          `Bố cục CV được tinh chỉnh và sắp xếp tối ưu cho vị trí ${
            cvData.personalInfo?.title || 'chuyên môn'
          }, hỗ trợ nhân bản và tùy biến tự do.`
      );
      setAuthorName(cvData.authorName || cvData.personalInfo?.fullName || 'Thành viên CV Studio');
      setCategory(cvData.category || 'tech');
      setIsSuccess(false);
      setErrorMessage(null);
    }
  }, [isOpen, cvData]);

  // Kiểm duyệt chất lượng CV theo thời gian thực
  const validationReport: CVValidationReport = useMemo(() => {
    if (!cvData) {
      return { isValid: false, completionRate: 0, passedCount: 0, totalCount: 9, rules: [] };
    }
    return validateCVForPublishing(cvData, {
      templateTitle,
      templateDescription,
    });
  }, [cvData, templateTitle, templateDescription]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validationReport.isValid) {
      const missingLabels = validationReport.rules
        .filter((r) => !r.passed)
        .map((r) => r.label)
        .join(', ');
      setErrorMessage(
        `Vui lòng hoàn thiện các thông tin bắt buộc trước khi chia sẻ: ${missingLabels}`
      );
      setShowChecklistDetails(true);
      return;
    }

    try {
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
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Lỗi khi đăng mẫu CV lên cộng đồng.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg max-h-[92vh] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Top Gradient Header */}
        <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 px-6 py-4.5 text-white relative shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Đóng"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center shrink-0 shadow-sm">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">
                Lưu & Chia Sẻ Mẫu CV Lên Cộng Đồng
              </h3>
              <p className="text-xs text-teal-100 mt-0.5">
                Đóng góp bố cục CV chỉn chu của bạn để mọi người tham khảo và nhân bản dùng thử
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-4.5">
          {isSuccess ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
                <Check className="w-8 h-8 stroke-[2.5]" />
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                  Đã Đăng Tải Mẫu CV Lên Cộng Đồng Thành Công!
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                  Mẫu CV <strong>"{templateTitle}"</strong> của bạn đã vượt qua kiểm duyệt chất lượng
                  và hiện diện tại <strong>Thư Viện Mẫu CV Cộng Đồng</strong>. Mọi người đều có thể
                  xem mẫu hoặc nhấn <em>"Dùng Thử Mẫu Này"</em> để kế thừa bố cục chuyên nghiệp.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-3">
                <a
                  href="/explore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Xem Thư Viện Mẫu
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white shadow-sm transition-colors cursor-pointer"
                >
                  Hoàn Tất
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4.5">
              {/* Quality Standards Card */}
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  validationReport.isValid
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60'
                    : 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/60'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    {validationReport.isValid ? (
                      <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                    )}
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>Tiêu Chuẩn Chất Lượng Khi Đăng Mẫu</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            validationReport.isValid
                              ? 'bg-emerald-200/70 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                              : 'bg-amber-200/70 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                          }`}
                        >
                          {validationReport.passedCount}/{validationReport.totalCount} Tiêu chí (
                          {validationReport.completionRate}%)
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {validationReport.isValid
                          ? 'CV của bạn đạt 100% tiêu chuẩn bắt buộc để chia sẻ cho cộng đồng!'
                          : 'Cần điền đầy đủ các thông tin bắt buộc trước khi đăng để tránh mẫu trống rác.'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowChecklistDetails((prev) => !prev)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                    title={showChecklistDetails ? 'Thu gọn' : 'Xem chi tiết tiêu chuẩn'}
                  >
                    {showChecklistDetails ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mt-3 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      validationReport.isValid
                        ? 'bg-emerald-500'
                        : 'bg-gradient-to-r from-amber-500 to-teal-500'
                    }`}
                    style={{ width: `${validationReport.completionRate}%` }}
                  />
                </div>

                {/* Detailed Checklist Accordion */}
                {showChecklistDetails && (
                  <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    {validationReport.rules.map((rule) => (
                      <div
                        key={rule.id}
                        className={`flex items-start gap-1.5 p-1.5 rounded-lg ${
                          rule.passed
                            ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-100/40 dark:bg-emerald-950/40'
                            : 'text-amber-800 dark:text-amber-300 bg-amber-100/50 dark:bg-amber-950/40'
                        }`}
                      >
                        {rule.passed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                        )}
                        <div className="min-w-0">
                          <span className="font-semibold">{rule.label}</span>
                          {!rule.passed && (
                            <p className="text-[10px] opacity-80 leading-tight mt-0.5">
                              {rule.message}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Error banner if submission blocked */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Form Fields */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200">
                  Tên Mẫu CV Cộng Đồng <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={templateTitle}
                  onChange={(e) => setTemplateTitle(e.target.value)}
                  placeholder="VD: CV Senior Full-stack Developer — Bố Cục Ưu Tiên Dự Án"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200">
                    Nhóm Ngành Nghề
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CVCategory)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                  Mô Tả Điểm Nổi Bật Của Mẫu Này <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={templateDescription}
                  onChange={(e) => setTemplateDescription(e.target.value)}
                  placeholder="Chia sẻ lý do bố cục này hữu ích (VD: Đưa mục Dự án lên đầu, thêm mục Ngoại ngữ & Ấn phẩm khoa học, màu sắc tương phản cao...)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>

              {/* Highlights pills */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/70 text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <LayoutGrid className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                  <span>Bố cục kéo thả 2 cột</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <Palette className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Giữ màu sắc & Font</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <Users className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span>Dùng thử 1-Click</span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={!validationReport.isValid}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white shadow-md shadow-teal-600/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                  title={
                    validationReport.isValid
                      ? 'Lưu và chia sẻ mẫu CV'
                      : 'Vui lòng hoàn thiện các tiêu chuẩn bắt buộc phía trên'
                  }
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Lưu & Chia Sẻ Mẫu Lên Cộng Đồng</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
export default PublishTemplateModal;
