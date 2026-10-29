import React, { useState, useRef, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useCVEditor } from '../features/cv-editor/hooks/useCVEditor';
import { getCVByIdOrSlug } from '../data/mockProfiles';
import { getTemplateComponent } from '../features/cv-templates/TemplateRegistry';
import { exportCVToPDF } from '../services/exportPdfService';
import {
  ArrowLeft,
  Eye,
  RotateCcw,
  Check,
  Loader2,
  ChevronDown,
  User,
  Sparkles,
  Briefcase,
  GraduationCap,
  Code2,
  FolderGit2,
  Trophy,
  Award,
  Palette,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Moon,
  Sun,
  LogIn,
  BookmarkPlus,
  Globe,
  Lock,
  LayoutGrid,
  Layers,
  Share2,
} from 'lucide-react';
import { PersonalInfoSection } from '../features/cv-editor/components/sections/PersonalInfoSection';
import { SummarySection } from '../features/cv-editor/components/sections/SummarySection';
import { ExperienceSection } from '../features/cv-editor/components/sections/ExperienceSection';
import { EducationSection } from '../features/cv-editor/components/sections/EducationSection';
import { SkillsSection } from '../features/cv-editor/components/sections/SkillsSection';
import { ProjectsSection } from '../features/cv-editor/components/sections/ProjectsSection';
import { AchievementsSection } from '../features/cv-editor/components/sections/AchievementsSection';
import { CertificatesSection } from '../features/cv-editor/components/sections/CertificatesSection';
import { ThemeCustomizerSection } from '../features/cv-editor/components/sections/ThemeCustomizerSection';
import { LayoutCustomizerSection } from '../features/cv-editor/components/sections/LayoutCustomizerSection';
import { CustomSectionsEditor } from '../features/cv-editor/components/sections/CustomSectionsEditor';
import { PublishTemplateModal } from '../features/cv-editor/components/PublishTemplateModal';
import { NotFoundPage } from './NotFoundPage';
import { useAuthStore } from '../stores/useAuthStore';
import { UserDropdown } from '../components/auth/UserDropdown';
import { ShareDropdown } from '../components/common/ShareDropdown';
import { saveUserCV, createNewCV, getCVById } from '../services/cvStorageService';
import { useCVStore } from '../stores/useCVStore';
import { CVData } from '../types/cv';

type ActiveTabMobile = 'editor' | 'preview';

interface CVEditorPageProps {
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const CVEditorPage: React.FC<CVEditorPageProps> = ({ darkMode, onToggleDarkMode }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, openAuthModal } = useAuthStore();
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState<boolean>(false);

  const resolvePreset = (targetId?: string): CVData | undefined => {
    if (!targetId) return undefined;
    if (typeof localStorage !== 'undefined') {
      const draft = localStorage.getItem(`cv_studio_draft_${targetId}`);
      if (draft) {
        try {
          return JSON.parse(draft);
        } catch {
          // ignore corrupted JSON
        }
      }
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('cv_studio_draft_') && k !== 'cv_studio_draft_cv') {
          const item = localStorage.getItem(k);
          if (item) {
            try {
              const parsed: CVData = JSON.parse(item);
              if (parsed.id === targetId || parsed.slug === targetId) {
                return parsed;
              }
            } catch {}
          }
        }
      }
    }
    const mock = getCVByIdOrSlug(targetId);
    if (mock) return mock;
    return undefined;
  };

  // If navigating to /editor directly without id, create a unique CV and navigate to /editor/:id
  useEffect(() => {
    if (!id) {
      const fresh = createNewCV('template-classic-teal', user?.uid);
      navigate(`/editor/${fresh.id}`, { replace: true });
    }
  }, [id, user?.uid, navigate]);

  const [asyncLoading, setAsyncLoading] = useState<boolean>(Boolean(id && !resolvePreset(id)));
  const [asyncNotFound, setAsyncNotFound] = useState<boolean>(false);

  // Fetch from Firestore if not found locally
  useEffect(() => {
    if (!id) return;
    const local = resolvePreset(id);
    if (!local) {
      setAsyncLoading(true);
      getCVById(id)
        .then((found) => {
          if (found) {
            useCVStore.getState().loadCV(found);
            setAsyncNotFound(false);
          } else {
            setAsyncNotFound(true);
          }
          setAsyncLoading(false);
        })
        .catch(() => {
          setAsyncNotFound(true);
          setAsyncLoading(false);
        });
    }
  }, [id]);

  const initialPreset = id ? resolvePreset(id) : undefined;

  const {
    cvData,
    saveStatus,
    updateVisibility,
    updatePersonalInfo,
    updateSummary,
    addExperience,
    updateExperience,
    removeExperience,
    reorderExperiences,
    addExperienceDescription,
    updateExperienceDescription,
    removeExperienceDescription,
    addEducation,
    updateEducation,
    removeEducation,
    reorderEducations,
    addSkillCategory,
    updateSkillCategoryName,
    removeSkillCategory,
    reorderSkillCategories,
    addSkillToCategory,
    removeSkillFromCategory,
    reorderSkillsInCategory,
    addProject,
    updateProject,
    removeProject,
    reorderProjects,
    addAchievement,
    updateAchievement,
    removeAchievement,
    reorderAchievements,
    addCertificate,
    updateCertificate,
    removeCertificate,
    reorderCertificates,
    addCustomSection,
    updateCustomSection,
    removeCustomSection,
    reorderCustomSections,
    addCustomSectionItem,
    updateCustomSectionItem,
    removeCustomSectionItem,
    reorderCustomSectionItems,
    reorderSectionInColumn,
    moveSectionToColumn,
    toggleSectionVisibility,
    resetLayoutConfig,
    updateTheme,
    updateSectionStyle,
    resetSectionStyle,
    resetAllSectionStyles,
    applyStyleToAllSections,
    resetToDefault,
  } = useCVEditor(initialPreset);

  // Accordion open/close states
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    layout: true,
    theme: false,
    personal: true,
    summary: true,
    experience: true,
    education: false,
    skills: false,
    projects: false,
    achievements: false,
    certificates: false,
    customSections: false,
  });

  const toggleSection = (sectionKey: string) => {
    setOpenSections((prev) => ({ ...prev, [sectionKey]: !prev[sectionKey] }));
  };

  // Preview & Zoom controls
  const [zoomLevel, setZoomLevel] = useState<number>(85);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);
  const [activeMobileTab, setActiveMobileTab] = useState<ActiveTabMobile>('editor');
  const previewContainerRef = useRef<HTMLDivElement>(null);

  // Auto-fit initial zoom on smaller screens (mobile / tablet)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      const screenW = window.innerWidth - 32;
      const initialMobileZoom = Math.min(Math.max(Math.floor((screenW / 794) * 100), 38), 60);
      setZoomLevel(initialMobileZoom);
    }
  }, []);

  const handleFitToWidth = () => {
    if (previewContainerRef.current) {
      const containerWidth = previewContainerRef.current.clientWidth - 48;
      const optimalZoom = Math.min(Math.max(Math.floor((containerWidth / 794) * 100), 35), 110);
      setZoomLevel(optimalZoom);
    } else {
      setZoomLevel(85);
    }
  };

  // Auto-associate CV with logged-in user if it was anonymous
  useEffect(() => {
    if (user && cvData && cvData.userId !== user.uid) {
      if (cvData.userId === 'anonymous') {
        const updated: CVData = {
          ...cvData,
          userId: user.uid,
          status: 'active',
          ownerDisabled: false,
        };
        useCVStore.getState().loadCV(updated);
      }
    }
  }, [user, cvData?.userId]);

  // Tự động đồng bộ draft cá nhân và Firestore khi lưu tự động
  useEffect(() => {
    if (saveStatus === 'saved' && cvData && cvData.id && cvData.id !== 'cv-thanhtruc-01') {
      saveUserCV(cvData, user?.uid);
    }
  }, [saveStatus]);

  const handleVisibilityChange = (nextPublic: boolean) => {
    updateVisibility(nextPublic);
    saveUserCV({ ...cvData, isPublic: nextPublic }, user?.uid);
    setSaveToast(
      nextPublic
        ? 'Đã bật Công khai! CV của bạn có thể xem qua đường dẫn và xuất hiện tại Trang chủ.'
        : 'Đã chuyển sang Riêng tư!'
    );
    setTimeout(() => setSaveToast(null), 3500);
  };

  if (asyncLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
            Đang tải dữ liệu hồ sơ CV...
          </p>
        </div>
      </div>
    );
  }

  if (asyncNotFound) {
    return <NotFoundPage />;
  }

  // Handle PDF Export
  const handleDownloadPDF = async () => {
    if (isExporting) return;
    setIsExporting(true);
    const success = await exportCVToPDF('cv-printable-area', cvData.personalInfo.fullName);
    setIsExporting(false);
    if (success) {
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const TemplateComponent = getTemplateComponent(cvData.themeConfig.templateId);

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* ================= EDITOR HEADER BAR ================= */}
      <header className="no-print sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-2.5 shadow-xs">
        <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left: Back button + Title + Auto-save indicator */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Trang Chủ</span>
            </Link>

            <div className="h-4 w-px bg-slate-200 dark:border-slate-700" />

            <div className="flex items-center gap-2">
              <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                Trình Tạo & Chỉnh Sửa CV
              </span>

              {/* Auto-save status pill */}
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                {saveStatus === 'saving' ? (
                  <>
                    <Loader2 className="w-3 h-3 text-teal-600 animate-spin" />
                    <span className="text-slate-500">Đang lưu...</span>
                  </>
                ) : saveStatus === 'saved' ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-emerald-700 dark:text-emerald-300">Đã lưu tự động</span>
                  </>
                ) : (
                  <span className="text-amber-600">Chưa lưu...</span>
                )}
              </div>

              {/* Public / Private toggle pill */}
              <button
                type="button"
                id="btn-header-toggle-visibility"
                onClick={() => handleVisibilityChange(!cvData.isPublic)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                  cvData.isPublic
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                }`}
                title="Nhấp để chuyển đổi giữa Công khai và Riêng tư"
              >
                {cvData.isPublic ? (
                  <>
                    <Globe className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    <span>Công khai</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3 h-3 text-slate-500" />
                    <span>Riêng tư</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right: Actions (Theme Toggle, Reset, Publish Template, View Fullscreen, Share Dropdown) */}
          <div className="flex items-center gap-2">
            {/* Website Dark Mode Toggle */}
            {onToggleDarkMode && (
              <button
                id="btn-toggle-dark-mode"
                type="button"
                onClick={onToggleDarkMode}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/80 text-xs transition-colors cursor-pointer"
                title={darkMode ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'}
              >
                {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
              </button>
            )}

            {/* Reset to Default */}
            <button
              id="btn-reset-default"
              type="button"
              onClick={() => {
                if (window.confirm('Khôi phục lại dữ liệu mẫu gốc? Những nội dung bạn tự gõ sẽ bị xóa.')) {
                  resetToDefault();
                }
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs transition-colors cursor-pointer"
              title="Khôi phục dữ liệu mẫu ban đầu"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Publish Community Template Button */}
            <button
              id="btn-publish-community-template"
              type="button"
              onClick={() => setIsPublishModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-bold transition-colors cursor-pointer"
              title="Lưu & chia sẻ thiết kế CV này lên Thư viện Mẫu CV Cộng Đồng cho mọi người tham khảo dùng thử"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden xl:inline">
                {cvData.isCommunityTemplate ? 'Đã Lưu Mẫu Cộng Đồng' : 'Lưu Mẫu Lên Cộng Đồng'}
              </span>
              <span className="xl:hidden">Lưu Mẫu</span>
            </button>

            {/* View Fullscreen Page */}
            <Link
              id="btn-view-public"
              to={`/cv/${cvData.id}`}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white text-xs font-semibold transition-colors cursor-pointer"
              title="Xem bản CV trực tuyến toàn màn hình"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Xem Trực Tuyến</span>
            </Link>

            {/* Share Dropdown */}
            <ShareDropdown
              cv={cvData}
              isOwner={true}
              onUpdateVisibility={handleVisibilityChange}
              variant="primary"
            />

            {/* Save to Dashboard if user logged in and not yet owner */}
            {user && cvData.userId !== user.uid && (
              <button
                id="btn-save-to-dashboard"
                type="button"
                onClick={() => {
                  saveUserCV({ ...cvData, userId: user.uid }, user.uid);
                  setSaveToast('Đã lưu CV vào Dashboard cá nhân của bạn!');
                  setTimeout(() => setSaveToast(null), 3000);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-all cursor-pointer"
                title="Lưu hồ sơ này vào Dashboard cá nhân của bạn để quản lý"
              >
                <BookmarkPlus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Lưu Vào Dashboard</span>
              </button>
            )}

            {/* User Auth or Dropdown */}
            {user ? (
              <UserDropdown />
            ) : (
              <button
                id="btn-editor-login"
                type="button"
                onClick={() => openAuthModal('login')}
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>Đăng Nhập</span>
              </button>
            )}
          </div>
        </div>

        {/* Save Toast */}
        {saveToast && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 text-white shadow-xl text-xs sm:text-sm font-semibold animate-in slide-in-from-bottom-3 duration-200">
            <Check className="w-4 h-4" />
            <span>{saveToast}</span>
          </div>
        )}

        {/* Mobile Tab Switcher */}
        <div className="flex lg:hidden mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="grid grid-cols-2 w-full gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveMobileTab('editor')}
              className={`py-1.5 rounded-lg transition-all ${
                activeMobileTab === 'editor'
                  ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              ✏️ Điền Thông Tin & Kéo Thả
            </button>
            <button
              type="button"
              onClick={() => setActiveMobileTab('preview')}
              className={`py-1.5 rounded-lg transition-all ${
                activeMobileTab === 'preview'
                  ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              👁️ Xem Trước A4
            </button>
          </div>
        </div>
      </header>

      {/* ================= MAIN SPLIT-SCREEN WORKSPACE ================= */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-6 p-0 sm:p-4 lg:p-6 items-start">
        {/* ================= LEFT COLUMN: FORM ACCORDION PANEL (5/12 cols) ================= */}
        <div
          className={`lg:col-span-6 xl:col-span-5 space-y-3 p-4 sm:p-0 ${
            activeMobileTab === 'preview' ? 'hidden lg:block' : 'block'
          }`}
        >
          {/* 0. Drag & Drop Section Layout Builder Accordion */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-teal-500/30 dark:border-teal-500/30 overflow-hidden shadow-xs">
            <button
              type="button"
              onClick={() => toggleSection('layout')}
              className="w-full px-5 py-3.5 flex items-center justify-between text-left bg-gradient-to-r from-teal-50/70 via-emerald-50/40 to-transparent dark:from-teal-950/40 dark:via-slate-900 dark:to-slate-900 hover:from-teal-50 dark:hover:from-teal-950/60 transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <LayoutGrid className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <div>
                  <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    Tự Build Bố Cục & Kéo Thả Thứ Tự Khối
                  </span>
                  <span className="ml-2 px-2 py-0.5 text-[10px] font-bold rounded-full bg-teal-600 text-white">
                    Drag & Drop
                  </span>
                </div>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-transform duration-200 ${
                  openSections.layout ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openSections.layout && (
              <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/30">
                <LayoutCustomizerSection
                  themeConfig={cvData.themeConfig}
                  onReorderInColumn={reorderSectionInColumn}
                  onMoveToColumn={moveSectionToColumn}
                  onToggleVisibility={toggleSectionVisibility}
                  onResetLayout={resetLayoutConfig}
                  onUpdateSectionStyle={updateSectionStyle}
                />
              </div>
            )}
          </div>

          {/* 1. Theme Customizer Accordion */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <button
              type="button"
              onClick={() => toggleSection('theme')}
              className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Palette className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                  Tùy Biến Giao Diện (Mẫu CV, Màu Sắc, Font Chữ)
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-transform duration-200 ${
                  openSections.theme ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openSections.theme && (
              <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/40">
                <ThemeCustomizerSection
                  themeConfig={cvData.themeConfig}
                  onUpdateTheme={updateTheme}
                  onUpdateSectionStyle={updateSectionStyle}
                  onResetSectionStyle={resetSectionStyle}
                  onResetAllSectionStyles={resetAllSectionStyles}
                  onApplyStyleToAllSections={applyStyleToAllSections}
                />
              </div>
            )}
          </div>

          {/* 2. Personal Info Accordion */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <button
              type="button"
              onClick={() => toggleSection('personal')}
              className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                  Thông Tin Cá Nhân & Liên Hệ
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-transform duration-200 ${
                  openSections.personal ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openSections.personal && (
              <div className="p-5 border-t border-slate-100 dark:border-slate-800">
                <PersonalInfoSection
                  personalInfo={cvData.personalInfo}
                  onChange={updatePersonalInfo}
                />
              </div>
            )}
          </div>

          {/* 3. Summary Accordion */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <button
              type="button"
              onClick={() => toggleSection('summary')}
              className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                  Giới Thiệu Bản Thân / Tóm Tắt Năng Lực
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-transform duration-200 ${
                  openSections.summary ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openSections.summary && (
              <div className="p-5 border-t border-slate-100 dark:border-slate-800">
                <SummarySection summary={cvData.summary} onChange={updateSummary} />
              </div>
            )}
          </div>

          {/* 4. Experience Accordion */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <button
              type="button"
              onClick={() => toggleSection('experience')}
              className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Briefcase className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                  Kinh Nghiệm Làm Việc ({cvData.experiences.length})
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-transform duration-200 ${
                  openSections.experience ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openSections.experience && (
              <div className="p-5 border-t border-slate-100 dark:border-slate-800">
                <ExperienceSection
                  experiences={cvData.experiences}
                  onAdd={addExperience}
                  onUpdate={updateExperience}
                  onRemove={removeExperience}
                  onReorder={reorderExperiences}
                  onAddDesc={addExperienceDescription}
                  onUpdateDesc={updateExperienceDescription}
                  onRemoveDesc={removeExperienceDescription}
                />
              </div>
            )}
          </div>

          {/* 5. Education Accordion */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <button
              type="button"
              onClick={() => toggleSection('education')}
              className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <GraduationCap className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                  Học Vấn & Bằng Cấp ({cvData.educations.length})
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-transform duration-200 ${
                  openSections.education ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openSections.education && (
              <div className="p-5 border-t border-slate-100 dark:border-slate-800">
                <EducationSection
                  educations={cvData.educations}
                  onAdd={addEducation}
                  onUpdate={updateEducation}
                  onRemove={removeEducation}
                  onReorder={reorderEducations}
                />
              </div>
            )}
          </div>

          {/* 6. Skills Accordion */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <button
              type="button"
              onClick={() => toggleSection('skills')}
              className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Code2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                  Kỹ Năng Chuyên Môn ({cvData.skillCategories.length} nhóm)
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-transform duration-200 ${
                  openSections.skills ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openSections.skills && (
              <div className="p-5 border-t border-slate-100 dark:border-slate-800">
                <SkillsSection
                  categories={cvData.skillCategories}
                  onAddCategory={addSkillCategory}
                  onUpdateCategoryName={updateSkillCategoryName}
                  onRemoveCategory={removeSkillCategory}
                  onReorderCategories={reorderSkillCategories}
                  onAddSkill={addSkillToCategory}
                  onRemoveSkill={removeSkillFromCategory}
                  onReorderSkills={reorderSkillsInCategory}
                />
              </div>
            )}
          </div>

          {/* 7. Projects Accordion */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <button
              type="button"
              onClick={() => toggleSection('projects')}
              className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <FolderGit2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                  Dự Án Tiêu Biểu ({cvData.projects.length})
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-transform duration-200 ${
                  openSections.projects ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openSections.projects && (
              <div className="p-5 border-t border-slate-100 dark:border-slate-800">
                <ProjectsSection
                  projects={cvData.projects}
                  onAdd={addProject}
                  onUpdate={updateProject}
                  onRemove={removeProject}
                  onReorder={reorderProjects}
                />
              </div>
            )}
          </div>

          {/* 8. Achievements Accordion */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <button
              type="button"
              onClick={() => toggleSection('achievements')}
              className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Trophy className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                  Thành Tựu & Giải Thưởng ({cvData.achievements?.length || 0})
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-transform duration-200 ${
                  openSections.achievements ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openSections.achievements && (
              <div className="p-5 border-t border-slate-100 dark:border-slate-800">
                <AchievementsSection
                  achievements={cvData.achievements || []}
                  onAdd={addAchievement}
                  onUpdate={updateAchievement}
                  onRemove={removeAchievement}
                  onReorder={reorderAchievements}
                />
              </div>
            )}
          </div>

          {/* 9. Certificates Accordion */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <button
              type="button"
              onClick={() => toggleSection('certificates')}
              className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Award className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                  Chứng Chỉ Chuyên Ngành ({cvData.certificates?.length || 0})
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-transform duration-200 ${
                  openSections.certificates ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openSections.certificates && (
              <div className="p-5 border-t border-slate-100 dark:border-slate-800">
                <CertificatesSection
                  certificates={cvData.certificates || []}
                  onAdd={addCertificate}
                  onUpdate={updateCertificate}
                  onRemove={removeCertificate}
                  onReorder={reorderCertificates}
                />
              </div>
            )}
          </div>

          {/* 10. Custom Sections Accordion */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs mb-8">
            <button
              type="button"
              onClick={() => toggleSection('customSections')}
              className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                  Mục Tùy Chỉnh Tự Tạo ({cvData.customSections?.length || 0})
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                  Mới
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-transform duration-200 ${
                  openSections.customSections ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openSections.customSections && (
              <div className="p-5 border-t border-slate-100 dark:border-slate-800">
                <CustomSectionsEditor
                  customSections={cvData.customSections || []}
                  onAddSection={addCustomSection}
                  onUpdateSection={updateCustomSection}
                  onRemoveSection={removeCustomSection}
                  onReorderSections={reorderCustomSections}
                  onAddItem={addCustomSectionItem}
                  onUpdateItem={updateCustomSectionItem}
                  onRemoveItem={removeCustomSectionItem}
                  onReorderItems={reorderCustomSectionItems}
                />
              </div>
            )}
          </div>
        </div>

        {/* ================= RIGHT COLUMN: STICKY LIVE A4 PREVIEW (7/12 cols) ================= */}
        <div
          ref={previewContainerRef}
          className={`lg:col-span-6 xl:col-span-7 sticky top-20 flex flex-col items-center bg-slate-200/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 sm:p-6 overflow-hidden ${
            activeMobileTab === 'editor' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Preview Toolbar */}
          <div className="w-full flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-300/80 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="truncate">Bản Xem Trước Trực Tiếp (A4 Live Preview)</span>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-white dark:bg-slate-800 px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 text-xs shrink-0">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(z - 10, 35))}
                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                title="Thu nhỏ"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-semibold text-[11px] w-9 text-center text-slate-800 dark:text-slate-200">{zoomLevel}%</span>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(z + 10, 120))}
                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                title="Phóng to"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleFitToWidth}
                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-teal-600 dark:hover:text-teal-400 transition-colors ml-0.5 cursor-pointer"
                title="Vừa chiều ngang màn hình"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel(85)}
                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                title="Mặc định 85%"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Scaled A4 Container */}
          <div className="w-full overflow-x-auto flex justify-center py-2">
            <div
              className="cv-zoom-outer relative flex justify-center items-start shrink-0 transition-all duration-150"
              style={{
                width: `${Math.round(794 * (zoomLevel / 100))}px`,
                height: `${Math.round(1123 * (zoomLevel / 100))}px`,
              }}
            >
              <div
                className="cv-zoom-wrapper origin-top-left transition-transform duration-150"
                style={{
                  transform: `scale(${zoomLevel / 100})`,
                  width: '210mm',
                  minHeight: '297mm',
                }}
              >
                <div id="cv-printable-area">
                  <TemplateComponent data={cvData} theme={cvData.themeConfig} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Publish Community Template Modal */}
      <PublishTemplateModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        cvData={cvData}
        userId={user?.uid}
        onPublished={(published) => {
          useCVStore.getState().loadCV(published);
          setSaveToast('Đã lưu và chia sẻ Mẫu CV của bạn lên Cộng Đồng!');
          setTimeout(() => setSaveToast(null), 4000);
        }}
      />
    </div>
  );
};

export default CVEditorPage;
