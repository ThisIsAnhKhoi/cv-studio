import React from 'react';
import {
  ThemeConfig,
  ColorPreset,
  HeadingFontOption,
  SectionId,
  SectionStyleConfig,
} from '../../../../types/cv';
import { TEMPLATES_REGISTRY } from '../../../cv-templates/TemplateRegistry';
import { Layout, Palette, Type, Check, Moon, Sun } from 'lucide-react';
import { SectionCustomizerPanel } from './SectionCustomizerPanel';
import { FONT_REGISTRY } from '../../utils/fontRegistry';

interface ThemeCustomizerSectionProps {
  themeConfig: ThemeConfig;
  onUpdateTheme: (updates: Partial<ThemeConfig>) => void;
  onUpdateSectionStyle?: (sectionId: SectionId, style: Partial<SectionStyleConfig>) => void;
  onResetSectionStyle?: (sectionId: SectionId) => void;
  onResetAllSectionStyles?: () => void;
  onApplyStyleToAllSections?: (style: SectionStyleConfig) => void;
}

export const ThemeCustomizerSection: React.FC<ThemeCustomizerSectionProps> = ({
  themeConfig,
  onUpdateTheme,
  onUpdateSectionStyle,
  onResetSectionStyle,
  onResetAllSectionStyles,
  onApplyStyleToAllSections,
}) => {
  const colorPresets: { id: ColorPreset; label: string; bgClass: string; hex: string }[] = [
    { id: 'teal', label: 'Teal Xanh Biển', bgClass: 'bg-[#0E7C6B]', hex: '#0E7C6B' },
    { id: 'orange', label: 'Tangerine Cam Ấm', bgClass: 'bg-orange-600', hex: '#EA580C' },
    { id: 'red', label: 'Crimson Đỏ Nhiệt', bgClass: 'bg-red-700', hex: '#B91C1C' },
    { id: 'blue', label: 'Royal Blue Xanh Dương', bgClass: 'bg-blue-700', hex: '#1D4ED8' },
    { id: 'purple', label: 'Violet Tím', bgClass: 'bg-purple-700', hex: '#7E22CE' },
    { id: 'emerald', label: 'Emerald Xanh Ngọc', bgClass: 'bg-emerald-700', hex: '#047857' },
  ];

  return (
    <div className="space-y-5">
      {/* 1. Chọn Mẫu Template */}
      <div>
        <label className="block text-xs font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
          <Layout className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <span>Lựa Chọn Mẫu CV Tuyển Dụng</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {Object.values(TEMPLATES_REGISTRY).map((tmpl) => {
            const isSelected = themeConfig.templateId === tmpl.id;
            return (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => {
                  let defaultColor: ColorPreset = 'teal';
                  if (tmpl.id === 'template-warm-bold') defaultColor = 'orange';
                  if (tmpl.id === 'template-modern-minimal') defaultColor = 'red';
                  onUpdateTheme({
                    templateId: tmpl.id,
                    primaryColorPreset: defaultColor,
                  });
                }}
                className={`p-3 rounded-xl border text-left transition-all relative cursor-pointer ${
                  isSelected
                    ? 'border-teal-500 bg-teal-50/80 dark:bg-teal-950/60 ring-2 ring-teal-500/30'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-teal-500/50 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    {tmpl.name.split(':')[0]}
                  </span>
                  {isSelected && (
                    <div className="w-4 h-4 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                  {tmpl.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Chọn Bảng Màu (Color Preset) */}
      <div>
        <label className="block text-xs font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
          <Palette className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <span>Bảng Màu Điểm Nhấn Toàn Trang (Global Accent)</span>
        </label>
        <div className="flex flex-wrap items-center gap-2.5">
          {colorPresets.map((c) => {
            const isSelected = themeConfig.primaryColorPreset === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() =>
                  onUpdateTheme({
                    primaryColorPreset: c.id,
                    primaryColor: c.hex,
                  })
                }
                title={c.label}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'border-teal-600 dark:border-teal-400 bg-teal-50 dark:bg-teal-950/80 text-teal-900 dark:text-teal-200 ring-2 ring-teal-500/30 shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-200'
                }`}
              >
                <span className={`w-3.5 h-3.5 rounded-full ${c.bgClass} shrink-0 ring-1 ring-black/10`} />
                <span>{c.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Chọn Font Chữ Tiêu Đề Toàn Cục */}
      <div>
        <label className="block text-xs font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
          <Type className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <span>Font Chữ Tiêu Đề Mặc Định Toàn Trang</span>
        </label>
        <select
          value={themeConfig.fontHeading}
          onChange={(e) =>
            onUpdateTheme({
              fontHeading: e.target.value as HeadingFontOption,
            })
          }
          className="w-full p-2.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
        >
          {FONT_REGISTRY.map((f) => (
            <option key={f.id} value={f.family} className="dark:bg-slate-900 text-slate-900 dark:text-white">
              {f.name} ({f.category})
            </option>
          ))}
        </select>
      </div>

      {/* 4. Tùy Chọn Nền Tờ CV (Light Paper vs Dark CV) */}
      <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800">
        <label className="block text-xs font-bold text-slate-900 dark:text-white mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            {themeConfig.darkMode ? <Moon className="w-3.5 h-3.5 text-teal-400" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
            <span>Màu Nền Tờ Giấy CV</span>
          </span>
          <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400">
            {themeConfig.darkMode ? 'Nền tối số hóa' : 'Giấy trắng in ấn chuẩn A4'}
          </span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onUpdateTheme({ darkMode: false })}
            className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              !themeConfig.darkMode
                ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 ring-2 ring-teal-500/20'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>Giấy Trắng (Mặc định)</span>
          </button>
          <button
            type="button"
            onClick={() => onUpdateTheme({ darkMode: true })}
            className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              themeConfig.darkMode
                ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 ring-2 ring-teal-500/20'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Moon className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <span>Nền Tối (Dark Paper)</span>
          </button>
        </div>
      </div>

      {/* 5. TÙY BIẾN CHI TIẾT THEO TỪNG PHẦN (BRIEF 6) */}
      <SectionCustomizerPanel
        themeConfig={themeConfig}
        onUpdateSectionStyle={onUpdateSectionStyle}
        onResetSectionStyle={onResetSectionStyle}
        onResetAllSectionStyles={onResetAllSectionStyles}
        onApplyStyleToAllSections={onApplyStyleToAllSections}
      />
    </div>
  );
};

export default ThemeCustomizerSection;

