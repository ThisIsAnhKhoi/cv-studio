import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getCVByIdOrSlug, mockProfilesList } from '../data/mockProfiles';
import { TEMPLATES_REGISTRY, getTemplateComponent } from '../features/cv-templates/TemplateRegistry';
import { ColorPreset, HeadingFontOption, ThemeConfig, CVData } from '../types/cv';
import { exportCVToPDF } from '../services/exportPdfService';
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
  ExternalLink,
  Edit3,
} from 'lucide-react';

interface CVViewPageProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const CVViewPage: React.FC<CVViewPageProps> = ({ darkMode }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Find candidate by id or fallback to first candidate
  const initialData = (id ? getCVByIdOrSlug(id) : undefined) || mockProfilesList[0];

  const [cvData, setCvData] = useState<CVData>(initialData);
  const [theme, setTheme] = useState<ThemeConfig>(initialData.themeConfig);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Update cvData when route id changes
  useEffect(() => {
    if (id) {
      const found = getCVByIdOrSlug(id);
      if (found) {
        setCvData(found);
        setTheme(found.themeConfig);
      }
    }
  }, [id]);

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

  // 1-Click Direct PDF Download
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

  // Browser Print Dialog (Ctrl + P)
  const handlePrint = () => {
    window.print();
  };

  // Copy shareable URL
  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay Lại Danh Sách</span>
            </Link>

            <div className="h-4 w-px bg-slate-200 dark:border-slate-700 hidden sm:block" />

            <div className="flex items-center gap-2">
              <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate max-w-[150px] sm:max-w-xs">
                {cvData.personalInfo.fullName}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 hidden md:inline-flex items-center gap-1">
                <Globe className="w-2.5 h-2.5" />
                Công Khai
              </span>
            </div>

            {/* Template Switcher Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs ml-0 sm:ml-2">
              <Layout className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-0.5 shrink-0 hidden sm:block" />
              {Object.values(TEMPLATES_REGISTRY).map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => handleTemplateChange(tmpl.id)}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                    theme.templateId === tmpl.id
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white'
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
                  className={`w-5 h-5 rounded-full ${c.bgClass} transition-transform ${
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
                className="p-0.5 hover:text-black dark:hover:text-white"
                title="Thu nhỏ"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-semibold text-[11px] w-9 text-center">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(z + 10, 130))}
                className="p-0.5 hover:text-black dark:hover:text-white"
                title="Phóng to"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(100)}
                className="p-0.5 hover:text-black dark:hover:text-white ml-0.5 text-slate-400"
                title="Mặc định 100%"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>

            {/* Edit in Editor Button */}
            <Link
              to={`/editor/${id || cvData.id}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/60 text-teal-700 dark:text-teal-300 font-semibold text-xs border border-teal-200 dark:border-teal-800 transition-colors"
              title="Mở trình chỉnh sửa CV này"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Chỉnh Sửa CV</span>
            </Link>

            {/* Share Link Button */}
            <button
              onClick={handleCopyShareLink}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-slate-700 transition-colors"
              title="Sao chép đường dẫn CV để chia sẻ"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-600 dark:text-emerald-400">Đã chép link!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Chia sẻ</span>
                </>
              )}
            </button>

            {/* 1-Click Direct Download PDF */}
            <button
              onClick={handleDownloadPDF}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 active:scale-95 text-white font-semibold text-xs shadow-md transition-all disabled:opacity-60 cursor-pointer"
              title="Xuất trực tiếp file .pdf chuẩn A4 tải về máy tính"
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
                  <span>Tải file PDF</span>
                </>
              )}
            </button>

            {/* Print / Ctrl + P */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 active:scale-95 text-white font-semibold text-xs shadow-sm transition-all"
              title="Mở hộp thoại in ấn trình duyệt (Ctrl + P)"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In (Ctrl+P)</span>
            </button>
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
