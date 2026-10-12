import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCVEditor } from '../features/cv-editor/hooks/useCVEditor';
import { getCVByIdOrSlug } from '../data/mockProfiles';
import { getTemplateComponent } from '../features/cv-templates/TemplateRegistry';
import { exportCVToPDF } from '../services/exportPdfService';
import {
  ArrowLeft,
  Eye,
  Download,
  Printer,
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
  Palette,
  ZoomIn,
  ZoomOut,
  Moon,
  Sun,
} from 'lucide-react';
import { PersonalInfoSection } from '../features/cv-editor/components/sections/PersonalInfoSection';
import { SummarySection } from '../features/cv-editor/components/sections/SummarySection';
import { ExperienceSection } from '../features/cv-editor/components/sections/ExperienceSection';
import { EducationSection } from '../features/cv-editor/components/sections/EducationSection';
import { SkillsSection } from '../features/cv-editor/components/sections/SkillsSection';
import { ProjectsSection } from '../features/cv-editor/components/sections/ProjectsSection';
import { ThemeCustomizerSection } from '../features/cv-editor/components/sections/ThemeCustomizerSection';

type ActiveTabMobile = 'editor' | 'preview';

interface CVEditorPageProps {
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const CVEditorPage: React.FC<CVEditorPageProps> = ({ darkMode, onToggleDarkMode }) => {
  const { id } = useParams<{ id: string }>();
  const initialPreset = id ? getCVByIdOrSlug(id) : undefined;

  const {
    cvData,
    saveStatus,
    updatePersonalInfo,
    updateSummary,
    addExperience,
    updateExperience,
    removeExperience,
    addExperienceDescription,
    updateExperienceDescription,
    removeExperienceDescription,
    addEducation,
    updateEducation,
    removeEducation,
    addSkillCategory,
    updateSkillCategoryName,
    removeSkillCategory,
    addSkillToCategory,
    removeSkillFromCategory,
    addProject,
    updateProject,
    removeProject,
    updateTheme,
    resetToDefault,
  } = useCVEditor(initialPreset);

  // Accordion open/close states
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    personal: true,
    summary: true,
    experience: true,
    education: false,
    skills: false,
    projects: false,
    theme: false,
  });

  const toggleSection = (sectionKey: string) => {
    setOpenSections((prev) => ({ ...prev, [sectionKey]: !prev[sectionKey] }));
  };

  // Preview & Zoom controls
  const [zoomLevel, setZoomLevel] = useState<number>(85);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);
  const [activeMobileTab, setActiveMobileTab] = useState<ActiveTabMobile>('editor');

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
            </div>
          </div>

          {/* Right: Actions (Theme Toggle, Reset, View Fullscreen, Download PDF, Print) */}
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

            {/* View Public Mode */}
            <Link
              id="btn-view-public"
              to={`/cv/${cvData.id}`}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white text-xs font-semibold transition-colors cursor-pointer"
              title="Xem bản CV toàn màn hình"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Xem Công Khai</span>
            </Link>

            {/* 1-Click Download PDF */}
            <button
              id="btn-download-pdf"
              type="button"
              onClick={handleDownloadPDF}
              disabled={isExporting}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 active:scale-95 text-white font-semibold text-xs shadow-md transition-all disabled:opacity-60 cursor-pointer"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Đang xuất...</span>
                </>
              ) : exportSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-200" />
                  <span>Đã tải PDF!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải PDF</span>
                </>
              )}
            </button>

            {/* Print Ctrl + P */}
            <button
              type="button"
              onClick={handlePrint}
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-semibold text-xs shadow-xs transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In A4</span>
            </button>
          </div>
        </div>

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
              ✏️ Điền Thông Tin
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
                  onAddSkill={addSkillToCategory}
                  onRemoveSkill={removeSkillFromCategory}
                />
              </div>
            )}
          </div>

          {/* 7. Projects Accordion */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs mb-8">
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
                />
              </div>
            )}
          </div>
        </div>

        {/* ================= RIGHT COLUMN: STICKY LIVE A4 PREVIEW (7/12 cols) ================= */}
        <div
          className={`lg:col-span-6 xl:col-span-7 sticky top-20 flex flex-col items-center bg-slate-200/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 sm:p-6 overflow-hidden ${
            activeMobileTab === 'editor' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Preview Toolbar */}
          <div className="w-full flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-300/80 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Bản Xem Trước Trực Tiếp (A4 Live Preview)</span>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-white dark:bg-slate-800 px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 text-xs">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(z - 10, 50))}
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
                onClick={() => setZoomLevel(85)}
                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors ml-0.5 cursor-pointer"
                title="Mặc định 85%"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Scaled A4 Container */}
          <div className="w-full overflow-x-auto flex justify-center py-2">
            <div
              className="cv-zoom-wrapper transition-transform duration-150 origin-top"
              style={{ transform: `scale(${zoomLevel / 100})` }}
            >
              <div id="cv-printable-area">
                <TemplateComponent data={cvData} theme={cvData.themeConfig} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CVEditorPage;
