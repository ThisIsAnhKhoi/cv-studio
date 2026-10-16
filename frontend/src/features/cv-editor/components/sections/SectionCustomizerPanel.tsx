import React, { useState } from 'react';
import { SectionId, SectionStyleConfig, ThemeConfig } from '../../../../types/cv';
import { FONT_REGISTRY } from '../../utils/fontRegistry';
import {
  isValidHexColor,
  normalizeHexColor,
  evaluateContrast,
} from '../../../../utils/color';
import {
  Palette,
  Type,
  RotateCcw,
  Sparkles,
  SlidersHorizontal,
  Copy,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

interface SectionCustomizerPanelProps {
  themeConfig: ThemeConfig;
  onUpdateSectionStyle?: (sectionId: SectionId, style: Partial<SectionStyleConfig>) => void;
  onResetSectionStyle?: (sectionId: SectionId) => void;
  onResetAllSectionStyles?: () => void;
  onApplyStyleToAllSections?: (style: SectionStyleConfig) => void;
}

const SECTION_OPTIONS: { id: SectionId; label: string; icon: string }[] = [
  { id: 'header', label: 'Họ Tên & Tiêu Đề', icon: '👤' },
  { id: 'contact', label: 'Thông Tin Liên Hệ', icon: '📬' },
  { id: 'summary', label: 'Tóm Tắt Bản Thân', icon: '✨' },
  { id: 'experience', label: 'Kinh Nghiệm', icon: '💼' },
  { id: 'education', label: 'Học Vấn', icon: '🎓' },
  { id: 'skills', label: 'Kỹ Năng', icon: '⚡' },
  { id: 'projects', label: 'Dự Án', icon: '🚀' },
  { id: 'achievements', label: 'Thành Tựu', icon: '🏆' },
  { id: 'certificates', label: 'Chứng Chỉ', icon: '📜' },
];

const QUICK_COLORS = [
  { label: 'Teal Đậm', hex: '#0E7C6B' },
  { label: 'Cam Ấm', hex: '#EA580C' },
  { label: 'Đỏ Nhiệt', hex: '#B91C1C' },
  { label: 'Xanh Dương', hex: '#1D4ED8' },
  { label: 'Tím Đậm', hex: '#7E22CE' },
  { label: 'Xanh Ngọc', hex: '#047857' },
  { label: 'Đen Mực', hex: '#0F172A' },
  { label: 'Xám Than', hex: '#334155' },
  { label: 'Xám Nhạt', hex: '#64748B' },
  { label: 'Trắng Giấy', hex: '#FFFFFF' },
];

export const SectionCustomizerPanel: React.FC<SectionCustomizerPanelProps> = ({
  themeConfig,
  onUpdateSectionStyle,
  onResetSectionStyle,
  onResetAllSectionStyles,
  onApplyStyleToAllSections,
}) => {
  const [selectedSection, setSelectedSection] = useState<SectionId>('header');

  const currentStyles = themeConfig.sectionStyles || {};
  const activeStyle = currentStyles[selectedSection] || {};

  // Check if current section has overrides
  const hasCustomOverride = Boolean(
    activeStyle.headingColor ||
      activeStyle.textColor ||
      activeStyle.accentColor ||
      activeStyle.headingFont ||
      activeStyle.bodyFont
  );

  const hasAnyOverride = Object.keys(currentStyles).length > 0;

  // Background context for WCAG contrast evaluation
  const paperBackground = themeConfig.darkMode ? '#0F172A' : '#FFFFFF';

  // Contrast evaluations
  const headingContrast = activeStyle.headingColor
    ? evaluateContrast(activeStyle.headingColor, paperBackground, true)
    : null;

  const textContrast = activeStyle.textColor
    ? evaluateContrast(activeStyle.textColor, paperBackground, false)
    : null;

  const handleColorChange = (
    field: 'headingColor' | 'textColor' | 'accentColor',
    value: string
  ) => {
    if (onUpdateSectionStyle && (isValidHexColor(value) || value === '')) {
      onUpdateSectionStyle(selectedSection, {
        [field]: value ? normalizeHexColor(value) : undefined,
      });
    }
  };

  const handleFontChange = (
    field: 'headingFont' | 'bodyFont',
    value: string
  ) => {
    if (onUpdateSectionStyle) {
      onUpdateSectionStyle(selectedSection, {
        [field]: value || undefined,
      });
    }
  };

  return (
    <div className="space-y-4 pt-3 border-t border-slate-200/80 dark:border-slate-800">
      {/* Title & Section Selector */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
          <SlidersHorizontal className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <span>Tùy Biến Màu Sắc & Font Cho Từng Khối (Brief 6)</span>
        </label>
        {hasAnyOverride && onResetAllSectionStyles && (
          <button
            type="button"
            onClick={onResetAllSectionStyles}
            className="text-[11px] text-red-600 dark:text-red-400 hover:underline flex items-center gap-1 cursor-pointer"
            title="Xóa tất cả tùy biến màu/font của mọi khối"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Đặt lại toàn bộ</span>
          </button>
        )}
      </div>

      {/* Section Selector Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
        {SECTION_OPTIONS.map((sec) => {
          const isSelected = selectedSection === sec.id;
          const isCustomized = Boolean(currentStyles[sec.id]);
          return (
            <button
              key={sec.id}
              type="button"
              onClick={() => setSelectedSection(sec.id)}
              className={`shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                isSelected
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span>{sec.icon}</span>
              <span>{sec.label}</span>
              {isCustomized && (
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isSelected ? 'bg-amber-300' : 'bg-teal-500'
                  }`}
                  title="Khối này đang có tùy biến riêng"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Editor Panel for Selected Section */}
      <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 space-y-3.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            Khối đang chọn:{' '}
            <span className="text-teal-600 dark:text-teal-400">
              {SECTION_OPTIONS.find((s) => s.id === selectedSection)?.label}
            </span>
          </span>
          {hasCustomOverride ? (
            <span className="text-[11px] text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded-full border border-teal-200 dark:border-teal-800">
              Đang tùy biến riêng
            </span>
          ) : (
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Dùng mặc định của mẫu
            </span>
          )}
        </div>

        {/* 1. Color Pickers (Heading, Text, Accent) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Heading Color */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Palette className="w-3 h-3 text-teal-500" />
              <span>Màu Tiêu Đề</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                aria-label={`Màu tiêu đề khối ${selectedSection}`}
                value={activeStyle.headingColor || '#0E7C6B'}
                onChange={(e) => handleColorChange('headingColor', e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 dark:border-slate-600 bg-transparent p-0.5"
              />
              <input
                type="text"
                placeholder="#0E7C6B"
                value={activeStyle.headingColor || ''}
                onChange={(e) => handleColorChange('headingColor', e.target.value)}
                className="w-full text-xs px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-mono"
              />
            </div>
          </div>

          {/* Text Color */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Palette className="w-3 h-3 text-slate-500" />
              <span>Màu Nội Dung</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                aria-label={`Màu nội dung khối ${selectedSection}`}
                value={activeStyle.textColor || '#2D2D2D'}
                onChange={(e) => handleColorChange('textColor', e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 dark:border-slate-600 bg-transparent p-0.5"
              />
              <input
                type="text"
                placeholder="#2D2D2D"
                value={activeStyle.textColor || ''}
                onChange={(e) => handleColorChange('textColor', e.target.value)}
                className="w-full text-xs px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-mono"
              />
            </div>
          </div>

          {/* Accent Color */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Palette className="w-3 h-3 text-orange-500" />
              <span>Màu Nhấn (Accent)</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                aria-label={`Màu nhấn khối ${selectedSection}`}
                value={activeStyle.accentColor || '#EA580C'}
                onChange={(e) => handleColorChange('accentColor', e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 dark:border-slate-600 bg-transparent p-0.5"
              />
              <input
                type="text"
                placeholder="#EA580C"
                value={activeStyle.accentColor || ''}
                onChange={(e) => handleColorChange('accentColor', e.target.value)}
                className="w-full text-xs px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Quick Color Palette */}
        <div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1">
            Gợi ý bảng màu chuẩn:
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {QUICK_COLORS.map((c) => (
              <button
                key={c.hex}
                type="button"
                onClick={() => handleColorChange('headingColor', c.hex)}
                className="w-5 h-5 rounded-full border border-black/15 shadow-2xs hover:scale-115 transition-transform cursor-pointer"
                style={{ backgroundColor: c.hex }}
                title={`Chọn ${c.label} (${c.hex})`}
              />
            ))}
          </div>
        </div>

        {/* 2. Font Selectors (Heading Font & Body Font from Registry) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
          {/* Heading Font */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Type className="w-3 h-3 text-teal-500" />
              <span>Font Tiêu Đề</span>
            </label>
            <select
              value={activeStyle.headingFont || ''}
              onChange={(e) => handleFontChange('headingFont', e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 cursor-pointer"
            >
              <option value="">(Mặc định theo mẫu)</option>
              {FONT_REGISTRY.map((font) => (
                <option key={font.id} value={font.id}>
                  {font.name} ({font.category})
                </option>
              ))}
            </select>
          </div>

          {/* Body Font */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Type className="w-3 h-3 text-slate-500" />
              <span>Font Nội Dung</span>
            </label>
            <select
              value={activeStyle.bodyFont || ''}
              onChange={(e) => handleFontChange('bodyFont', e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 cursor-pointer"
            >
              <option value="">(Mặc định theo mẫu)</option>
              {FONT_REGISTRY.filter((f) => f.category === 'sans-serif' || f.category === 'serif').map(
                (font) => (
                  <option key={font.id} value={font.id}>
                    {font.name}
                  </option>
                )
              )}
            </select>
          </div>
        </div>

        {/* 3. WCAG Contrast Evaluation Badge */}
        {(headingContrast || textContrast) && (
          <div className="p-2 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-[11px] space-y-1">
            {headingContrast && (
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-300">
                  Tương phản Tiêu đề:
                </span>
                <span
                  className={`font-semibold px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1 ${
                    headingContrast.isCompliant
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}
                >
                  {headingContrast.isCompliant ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                  )}
                  <span>{headingContrast.message}</span>
                </span>
              </div>
            )}
            {textContrast && (
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-300">
                  Tương phản Nội dung:
                </span>
                <span
                  className={`font-semibold px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1 ${
                    textContrast.isCompliant
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}
                >
                  {textContrast.isCompliant ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                  )}
                  <span>{textContrast.message}</span>
                </span>
              </div>
            )}
          </div>
        )}

        {/* 4. Action Buttons (Reset, Apply to All) */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          {hasCustomOverride && onResetSectionStyle && (
            <button
              type="button"
              onClick={() => onResetSectionStyle(selectedSection)}
              className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Đặt lại khối này</span>
            </button>
          )}

          {hasCustomOverride && onApplyStyleToAllSections && (
            <button
              type="button"
              onClick={() => onApplyStyleToAllSections(activeStyle)}
              className="ml-auto text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-950 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900 flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Sao chép màu và font của khối này cho toàn bộ CV"
            >
              <Copy className="w-3 h-3" />
              <span>Áp dụng cho tất cả khối</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SectionCustomizerPanel;
