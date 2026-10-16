import React, { useState, useRef, useEffect } from 'react';
import {
  Share2,
  Link2,
  Copy,
  Check,
  Mail,
  FileDown,
  Printer,
  Globe,
  Lock,
  ChevronDown,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { CVData } from '../../types/cv';
import { saveUserCV } from '../../services/cvStorageService';

export interface ShareDropdownProps {
  cv: CVData;
  isOwner?: boolean;
  onUpdateVisibility?: (isPublic: boolean) => void;
  className?: string;
  buttonLabel?: string;
  variant?: 'primary' | 'secondary' | 'outline';
}

export const ShareDropdown: React.FC<ShareDropdownProps> = ({
  cv,
  isOwner = true,
  onUpdateVisibility,
  className = '',
  buttonLabel = 'Chia sẻ',
  variant = 'secondary',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isPublicState, setIsPublicState] = useState<boolean>(Boolean(cv.isPublic));
  const [noticeToast, setNoticeToast] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Synchronize state when cv prop updates
  useEffect(() => {
    setIsPublicState(Boolean(cv.isPublic));
  }, [cv.isPublic]);

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const getShareUrl = (): string => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}/cv/${cv.id}`;
  };

  const handleToggleVisibility = () => {
    const nextState = !isPublicState;
    setIsPublicState(nextState);

    if (onUpdateVisibility) {
      onUpdateVisibility(nextState);
    } else {
      // Direct storage update if not in editor store
      saveUserCV({ ...cv, isPublic: nextState });
    }

    setNoticeToast(
      nextState
        ? 'Đã bật Công khai! CV của bạn có thể xem qua đường dẫn và xuất hiện tại Trang chủ.'
        : 'Đã chuyển sang Riêng tư! Chỉ bạn mới có thể xem hoặc chỉnh sửa CV này.'
    );
    setTimeout(() => setNoticeToast(null), 3500);
  };

  const handleCopyLink = async () => {
    const url = getShareUrl();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 2500);

      if (!isPublicState) {
        setNoticeToast('Lưu ý: CV đang ở chế độ Riêng tư. Người khác cần được bật Công khai để xem.');
        setTimeout(() => setNoticeToast(null), 4000);
      }
    } catch (err) {
      console.error('Không thể sao chép liên kết:', err);
    }
  };

  const handleShareEmail = () => {
    const url = getShareUrl();
    const candidateName = cv.personalInfo.fullName || 'Ứng viên';
    const jobTitle = cv.personalInfo.title ? ` - ${cv.personalInfo.title}` : '';
    const subject = encodeURIComponent(`Hồ sơ CV chuyên nghiệp: ${candidateName}${jobTitle}`);
    const body = encodeURIComponent(
      `Kính gửi,\n\nTôi xin gửi đường dẫn xem hồ sơ CV chuyên nghiệp của tôi:\n${url}\n\nTrân trọng,\n${candidateName}`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  const handleDisabledFeature = (featureName: string) => {
    setNoticeToast(`Tính năng "${featureName}" đang được hoàn thiện và sẽ sớm ra mắt!`);
    setTimeout(() => setNoticeToast(null), 3000);
  };

  // Button styling variants
  const getButtonClass = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-semibold shadow-sm';
      case 'outline':
        return 'bg-transparent border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200';
      case 'secondary':
      default:
        return 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 font-semibold';
    }
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        id="btn-share-dropdown-trigger"
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${getButtonClass()}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="Tùy chọn chia sẻ và xuất bản CV"
      >
        <Share2 className="w-3.5 h-3.5" />
        <span>{buttonLabel}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu Modal */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-88 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header: Visibility Status Banner */}
          <div className="p-4 bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {isPublicState ? (
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Globe className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center shrink-0">
                    <Lock className="w-4 h-4" />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {isPublicState ? 'Chế độ Công khai' : 'Chế độ Riêng tư'}
                    </h4>
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isPublicState
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {isPublicState ? 'Public' : 'Private'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                    {isPublicState
                      ? 'Ai có liên kết đều xem được và hiển thị ở Trang chủ.'
                      : 'Chỉ bạn mới có quyền xem và chỉnh sửa hồ sơ này.'}
                  </p>
                </div>
              </div>

              {/* Toggle Button (only when owner or updater provided) */}
              {isOwner && (
                <button
                  type="button"
                  id="btn-toggle-public-private"
                  onClick={handleToggleVisibility}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer shrink-0 ${
                    isPublicState
                      ? 'bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                  }`}
                  title="Thay đổi quyền riêng tư của CV"
                >
                  {isPublicState ? 'Để Cá Nhân' : 'Công Khai'}
                </button>
              )}
            </div>

            {/* Warning if private */}
            {!isPublicState && (
              <div className="mt-2.5 flex items-start gap-1.5 text-[11px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-2 rounded-xl border border-amber-200/60 dark:border-amber-800/40">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>
                  Đang ở chế độ riêng tư: Nhà tuyển dụng sẽ không truy cập được cho đến khi bạn bấm
                  <strong> "Công Khai"</strong>.
                </span>
              </div>
            )}
          </div>

          {/* Quick Copy Link Bar */}
          <div className="px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
              Đường dẫn hồ sơ CV của bạn:
            </p>
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <input
                type="text"
                readOnly
                value={getShareUrl()}
                className="w-full bg-transparent px-2 text-xs font-mono text-slate-700 dark:text-slate-300 focus:outline-none select-all truncate"
              />
              <button
                type="button"
                id="btn-copy-share-url-inline"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-semibold transition-colors shrink-0 cursor-pointer shadow-xs"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-200" />
                    <span>Đã chép</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Chép</span>
                  </>
                )}
              </button>
            </div>
            {/* Deploy environment notice */}
            <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400">
              {typeof window !== 'undefined' &&
              (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 animate-pulse" />
                  <span>
                    Đang ở <strong>Localhost</strong> (khi lên link deploy/Vercel sẽ tự đổi thành tên miền thật).
                  </span>
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>
                    Đường dẫn trực tiếp chính thức trên môi trường <strong>Production</strong>.
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Menu Options List */}
          <div className="p-2 space-y-1">
            {/* 1. Copy Link */}
            <button
              type="button"
              id="menu-item-copy-link"
              onClick={handleCopyLink}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Link2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    Sao chép đường dẫn
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Gửi link CV cho nhà tuyển dụng hoặc bạn bè
                  </p>
                </div>
              </div>
              {copied && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
            </button>

            {/* 2. Share via Email */}
            <button
              type="button"
              id="menu-item-share-email"
              onClick={handleShareEmail}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    Chia sẻ qua Email
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Soạn thư kèm đường dẫn CV chuyên nghiệp
                  </p>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
            </button>

            {/* 3. Export PDF (Disabled as requested) */}
            <div
              id="menu-item-export-pdf"
              onClick={() => handleDisabledFeature('Xuất file PDF')}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 text-left cursor-not-allowed select-none opacity-70 hover:opacity-80 transition-opacity"
              title="Tính năng xuất PDF đang hoàn thiện thêm"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <FileDown className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Xuất file PDF
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">
                    Tải về máy định dạng chuẩn in ấn
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 shrink-0">
                Đang phát triển
              </span>
            </div>

            {/* 4. Print A4 (Disabled as requested) */}
            <div
              id="menu-item-print-a4"
              onClick={() => handleDisabledFeature('In trực tiếp')}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 text-left cursor-not-allowed select-none opacity-70 hover:opacity-80 transition-opacity"
              title="Tính năng in trực tiếp đang hoàn thiện thêm"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <Printer className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    In ra giấy A4
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">
                    Hộp thoại in ấn trình duyệt
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 shrink-0">
                Đang phát triển
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Action Toast Feedback */}
      {noticeToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xl text-xs font-semibold animate-in slide-in-from-bottom-3 duration-200">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{noticeToast}</span>
        </div>
      )}
    </div>
  );
};
