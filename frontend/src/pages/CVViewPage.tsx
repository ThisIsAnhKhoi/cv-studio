import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getCVByIdOrSlug, mockProfilesList } from '../data/mockProfiles';
import { TEMPLATES_REGISTRY, getTemplateComponent } from '../features/cv-templates/TemplateRegistry';
import { ColorPreset, HeadingFontOption, ThemeConfig, CVData } from '../types/cv';
import { exportCVToPDF } from '../services/exportPdfService';
import { useAuthStore } from '../stores/useAuthStore';
import { isCVOwner, cloneCV, saveUserCV, getCVById } from '../services/cvStorageService';
import { NotFoundPage } from './NotFoundPage';
import { ShareDropdown } from '../components/common/ShareDropdown';
import {
  ArrowLeft,
  Share2,
  Download,
  Printer,
  Sparkles,
  Palette,
  Type,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Loader2,
  Check,
  Layout,
  Globe,
  Lock,
  ExternalLink,
  Edit3,
  Copy,
  LogIn,
} from 'lucide-react';

interface CVViewPageProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const CVViewPage: React.FC<CVViewPageProps> = ({ darkMode }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, openAuthModal } = useAuthStore();
  const [isLoading, setIsLoading] = useState<boolean>(Boolean(id));
  const [notFound, setNotFound] = useState<boolean>(false);

  const getInitialCV = (): CVData => {
    if (!id) return mockProfilesList[0];
    const mock = getCVByIdOrSlug(id);
    if (mock) return mock;
    if (typeof localStorage !== 'undefined') {
      const draft = localStorage.getItem(`cv_studio_draft_${id}`);
      if (draft) {
        try {
          return JSON.parse(draft);
        } catch {
          // ignore
        }
      }
    }
    return mockProfilesList[0];
  };

  const [cvData, setCvData] = useState<CVData>(getInitialCV());
  const [theme, setTheme] = useState<ThemeConfig>(cvData.themeConfig);
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  // Fetch CV asynchronously (Mock, LocalStorage, or Firestore cloud)
  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    getCVById(id)
      .then((found) => {
        if (!isMounted) return;
        if (found) {
          setCvData(found);
          setTheme(found.themeConfig);
          setNotFound(false);
        } else {
          setNotFound(true);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Lỗi khi tải CV:', err);
        if (isMounted) {
          setNotFound(true);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const isOwner = isCVOwner(cvData, user);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
            Đang tải hồ sơ CV trực tuyến...
          </p>
        </div>
      </div>
    );
  }

  if (notFound) {
    return <NotFoundPage />;
  }

  // Private CV protection: If not public and current viewer is not the creator
  if (!cvData.isPublic && !isOwner) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 text-center">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Hồ Sơ Này Đang Ở Chế Độ Riêng Tư
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Chủ sở hữu của hồ sơ này đã thiết lập quyền riêng tư. Chỉ tác giả mới có thể xem và chỉnh sửa thông tin.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2.5">
            <Link
              to="/"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Về Trang Chủ Khám Phá CV</span>
            </Link>
            {!user && (
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm transition-colors cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Đăng Nhập Nếu Đây Là CV Của Bạn</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const handleTemplateChange = (templateId: string) => {
    let defaultColor: ColorPreset = 'teal';
    if (templateId === 'template-warm-bold') defaultColor = 'orange';
    if (templateId === 'template-modern-minimal') defaultColor = 'red';

    setTheme((prev) => ({
      ...prev,
      templateId,
      primaryColorPreset: defaultColor,
    }));
  };

  const handleColorChange = (preset: ColorPreset) => {
    setTheme((prev) => ({
      ...prev,
      primaryColorPreset: preset,
    }));
  };

  const handleFontChange = (font: HeadingFontOption) => {
    setTheme((prev) => ({
      ...prev,
      fontHeading: font,
    }));
  };

  const colorPresets: { id: ColorPreset; label: string; bgClass: string }[] = [
    { id: 'teal', label: 'Teal Xanh Biển', bgClass: 'bg-[#0E7C6B]' },
    { id: 'orange', label: 'Tangerine Cam Ấm', bgClass: 'bg-orange-600' },
    { id: 'red', label: 'Crimson Đỏ Nhiệt', bgClass: 'bg-red-700' },
    { id: 'blue', label: 'Royal Blue Xanh Dương', bgClass: 'bg-blue-700' },
    { id: 'purple', label: 'Violet Tím', bgClass: 'bg-purple-700' },
    { id: 'emerald', label: 'Emerald Xanh Ngọc', bgClass: 'bg-emerald-700' },
  ];

  const localFonts: { id: HeadingFontOption; label: string }[] = [
    { id: 'Gilroy', label: 'Gilroy (Font máy)' },
    { id: 'iCiel Cubano', label: 'iCiel Cubano (Font máy)' },
    { id: 'SVN-Optima', label: 'SVN-Optima (Font máy)' },
    { id: 'Be Vietnam Pro', label: 'Be Vietnam Pro (Chuẩn)' },
    { id: 'Montserrat', label: 'Montserrat (Font máy)' },
  ];

  const TemplateComponent = getTemplateComponent(theme.templateId);

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* ================= TOP ACTION BAR ================= */}
      <div className="no-print sticky top-16 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-2.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left: Back button + Candidate Name + Status */}
          <div className="flex items-center flex-wrap gap-2.5">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay Lại Danh Sách</span>
            </Link>

            <div className="h-4 w-px bg-slate-200 dark:border-slate-700 hidden sm:block" />

            <div className="flex items-center gap-2">
              <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate max-w-[150px] sm:max-w-xs">
                {cvData.personalInfo.fullName}
              </span>
              {isOwner ? (
                <button
                  type="button"
                  onClick={() => {
                    const nextState = !cvData.isPublic;
                    const updated = { ...cvData, isPublic: nextState };
                    saveUserCV(updated, user?.uid);
                    setCvData(updated);
                  }}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border inline-flex items-center gap-1 transition-colors cursor-pointer ${
                    cvData.isPublic
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-200'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800 hover:bg-amber-200'
                  }`}
                  title="Nhấp để chuyển đổi giữa Công khai và Riêng tư"
                >
                  {cvData.isPublic ? <Globe className="w-2.5 h-2.5" /> : <Lock className="w-2.5 h-2.5" />}
                  <span>{cvData.isPublic ? 'Công Khai (CV Của Bạn)' : 'Riêng Tư (CV Của Bạn)'}</span>
                </button>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hidden md:inline-flex items-center gap-1">
                  <Globe className="w-2.5 h-2.5" />
                  Công Khai
                </span>
              )}
            </div>

            {/* Template Switcher Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs ml-0 sm:ml-2">
              <Layout className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-0.5 shrink-0 hidden sm:block" />
              {Object.values(TEMPLATES_REGISTRY).map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => handleTemplateChange(tmpl.id)}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                    theme.templateId === tmpl.id
                      ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
                  }`}
                  title={tmpl.description}
                >
                  {tmpl.name.split(':')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Customization Controls & Action Buttons */}
          <div className="flex items-center flex-wrap gap-2">
            {/* Color Presets */}
            <div className="hidden lg:flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
              <Palette className="w-3.5 h-3.5 text-slate-400 ml-1 mr-0.5" />
              {colorPresets.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleColorChange(c.id)}
                  title={c.label}
                  className={`w-5 h-5 rounded-full ${c.bgClass} transition-transform cursor-pointer ${
                    theme.primaryColorPreset === c.id
                      ? 'ring-2 ring-offset-2 ring-slate-800 dark:ring-white scale-110 shadow-sm'
                      : 'hover:scale-105 opacity-80 hover:opacity-100'
                  }`}
                />
              ))}
            </div>

            {/* Font Picker */}
            <div className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
              <Type className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                value={theme.fontHeading}
                onChange={(e) => handleFontChange(e.target.value as any)}
                className="bg-transparent font-semibold focus:outline-none cursor-pointer text-slate-800 dark:text-slate-200 text-xs"
              >
                {localFonts.map((f) => (
                  <option key={f.id} value={f.id} className="dark:bg-slate-900 text-slate-900 dark:text-white">
                    {f.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Zoom Controls */}
            <div className="hidden xl:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
              <button
                onClick={() => setZoomLevel((z) => Math.max(z - 10, 70))}
                className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                title="Thu nhỏ"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-semibold text-[11px] w-9 text-center text-slate-800 dark:text-slate-200">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(z + 10, 130))}
                className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                title="Phóng to"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(100)}
                className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white ml-0.5 text-slate-400 transition-colors cursor-pointer"
                title="Mặc định 100%"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>

            {/* Edit / Clone Button based on Ownership */}
            {isOwner ? (
              <Link
                to={`/editor/${cvData.id}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
                title="Mở trình chỉnh sửa CV của bạn"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Chỉnh Sửa CV Của Bạn</span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  const cloned = cloneCV(cvData, user?.uid);
                  navigate(`/editor/${cloned.id}`);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-semibold text-xs shadow-xs transition-all cursor-pointer"
                title="Tạo bản sao từ mẫu này để chỉnh sửa thành CV của bạn"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Dùng Mẫu Này</span>
              </button>
            )}

            {/* Share Dropdown: includes Copy Link, Email, and disabled PDF & Print options */}
            <ShareDropdown
              cv={cvData}
              isOwner={isOwner}
              onUpdateVisibility={(nextIsPublic) => {
                const updated = { ...cvData, isPublic: nextIsPublic };
                saveUserCV(updated, user?.uid);
                setCvData(updated);
              }}
              variant="primary"
            />
          </div>
        </div>
      </div>

      {/* ================= WORKSPACE BODY / PREVIEW CONTAINER ================= */}
      <main className="flex-1 py-8 px-4 overflow-x-auto flex justify-center items-start print:p-0 print:m-0 print:overflow-visible">
        <div
          className="cv-zoom-wrapper transition-transform duration-200 origin-top print:transform-none"
          style={{ transform: `scale(${zoomLevel / 100})` }}
        >
          {/* Printable Element with ID */}
          <div id="cv-printable-area">
            <TemplateComponent data={cvData} theme={theme} />
          </div>
        </div>
      </main>

      {/* ================= BOTTOM HELPER BAR ================= */}
      <footer className="no-print bg-white/85 dark:bg-slate-900/85 border-t border-slate-200 dark:border-slate-800 py-2.5 px-4 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Đang xem: <strong>{TEMPLATES_REGISTRY[theme.templateId]?.name}</strong> • Khổ giấy: <strong>210mm × 297mm (Chuẩn A4)</strong>
          </span>
          <span className="text-[11px] text-teal-600 dark:text-teal-400 font-medium">
            Ứng viên: <strong>{cvData.personalInfo.fullName}</strong> ({cvData.personalInfo.title})
          </span>
        </div>
      </footer>
    </div>
  );
};
export default CVViewPage;
