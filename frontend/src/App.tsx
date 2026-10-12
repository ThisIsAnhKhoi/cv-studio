import React, { useState, useEffect } from 'react';
import { mockCVData } from './data/mockCVData';
import { TEMPLATES_REGISTRY, getTemplateComponent } from './features/cv-templates/TemplateRegistry';
import { ColorPreset, HeadingFontOption, ThemeConfig } from './types/cv';
import { exportCVToPDF } from './services/exportPdfService';
import {
  Moon,
  Sun,
  Printer,
  Sparkles,
  Palette,
  Type,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  Loader2,
  Check,
  Layout,
} from 'lucide-react';

export const App: React.FC = () => {
  const [cvData] = useState(mockCVData);
  const [theme, setTheme] = useState<ThemeConfig>(mockCVData.themeConfig);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);

  // Sync dark mode class on document element
  useEffect(() => {
    if (theme.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme.darkMode]);

  const toggleDarkMode = () => {
    setTheme((prev) => ({ ...prev, darkMode: !prev.darkMode }));
  };

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

  // 1-Click Direct PDF Download (Sử dụng html2pdf.js)
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

  const colorPresets: { id: ColorPreset; label: string; bgClass: string }[] = [
    { id: 'teal', label: 'Teal Xanh Biển', bgClass: 'bg-[#0E7C6B]' },
    { id: 'orange', label: 'Tangerine Cam Ấm', bgClass: 'bg-orange-600' },
    { id: 'red', label: 'Crimson Đỏ Nhiệt', bgClass: 'bg-red-700' },
    { id: 'blue', label: 'Royal Blue Xanh Dương', bgClass: 'bg-blue-700' },
    { id: 'purple', label: 'Violet Tím', bgClass: 'bg-purple-700' },
    { id: 'emerald', label: 'Emerald Xanh Ngọc', bgClass: 'bg-emerald-700' },
  ];

  // Local fonts from user system
  const localFonts: { id: HeadingFontOption; label: string }[] = [
    { id: 'iCiel Cubano', label: 'iCiel Cubano (Font máy)' },
    { id: 'SVN-Optima', label: 'SVN-Optima (Font máy)' },
    { id: 'Gilroy', label: 'Gilroy (Font máy)' },
    { id: 'Be Vietnam Pro', label: 'Be Vietnam Pro (Chuẩn)' },
    { id: 'Montserrat', label: 'Montserrat (Font máy)' },
  ];

  const TemplateComponent = getTemplateComponent(theme.templateId);

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* ================= TOP NAVIGATION / CONTROL BAR ================= */}
      <header className="no-print sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm px-4 sm:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Logo & Template Tabs */}
          <div className="flex items-center flex-wrap gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg tracking-tight font-display bg-gradient-to-r from-teal-700 to-emerald-600 dark:from-teal-400 dark:to-emerald-400 bg-clip-text text-transparent">
                CV Studio
              </span>
            </div>

            {/* Template Switcher Buttons */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
              <Layout className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-0.5 shrink-0" />
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

          {/* Quick Customization Controls */}
          <div className="flex items-center flex-wrap gap-2">
            {/* Color Presets */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
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

            {/* Font Picker with Local Fonts */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
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

            {/* Dark/Light Mode Switch */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors text-slate-700 dark:text-slate-200"
              title={theme.darkMode ? 'Chuyển sang Giao diện Sáng' : 'Chuyển sang Giao diện Tối'}
            >
              {theme.darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

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

            {/* 1-Click Direct Download PDF */}
            <button
              onClick={handleDownloadPDF}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 active:scale-95 text-white font-semibold text-xs shadow-md transition-all disabled:opacity-60 cursor-pointer"
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
      </header>

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
            Có 3 mẫu CV: Mẫu 1 (Classic Teal), Mẫu 2 (Warm Bold), Mẫu 3 (Modern Minimal)
          </span>
        </div>
      </footer>
    </div>
  );
};

export default App;
