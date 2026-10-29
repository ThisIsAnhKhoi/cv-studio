import React, { useState } from 'react';
import { SectionId, SectionStyleConfig, ThemeConfig } from '../../../../types/cv';
import {
  resolveLayoutConfig,
  SECTION_METADATA,
  getSectionTitle,
} from '../../utils/layoutHelpers';
import {
  GripVertical,
  ChevronUp,
  ChevronDown,
  ArrowLeftRight,
  Eye,
  EyeOff,
  RotateCcw,
  Columns,
  Sparkles,
  Edit3,
  Check,
} from 'lucide-react';

interface LayoutCustomizerSectionProps {
  themeConfig: ThemeConfig;
  onReorderInColumn: (column: 'sidebar' | 'main', startIndex: number, endIndex: number) => void;
  onMoveToColumn: (
    sectionId: SectionId,
    targetColumn: 'sidebar' | 'main',
    targetIndex?: number
  ) => void;
  onToggleVisibility: (sectionId: SectionId) => void;
  onResetLayout: () => void;
  onUpdateSectionStyle?: (sectionId: SectionId, style: Partial<SectionStyleConfig>) => void;
}

export const LayoutCustomizerSection: React.FC<LayoutCustomizerSectionProps> = ({
  themeConfig,
  onReorderInColumn,
  onMoveToColumn,
  onToggleVisibility,
  onResetLayout,
  onUpdateSectionStyle,
}) => {
  const layout = resolveLayoutConfig(themeConfig);

  const [dragState, setDragState] = useState<{
    sectionId: SectionId;
    sourceColumn: 'sidebar' | 'main';
    sourceIndex: number;
  } | null>(null);

  const [dragOverTarget, setDragOverTarget] = useState<{
    column: 'sidebar' | 'main';
    index: number;
  } | null>(null);

  const [editingTitleId, setEditingTitleId] = useState<SectionId | null>(null);
  const [titleDraft, setTitleDraft] = useState<string>('');

  const startEditingTitle = (secId: SectionId) => {
    const currentTitle = getSectionTitle(secId, themeConfig.sectionStyles);
    setEditingTitleId(secId);
    setTitleDraft(currentTitle);
  };

  const saveCustomTitle = (secId: SectionId) => {
    if (onUpdateSectionStyle) {
      onUpdateSectionStyle(secId, { customTitle: titleDraft.trim() || undefined });
    }
    setEditingTitleId(null);
  };

  const handleDragStart = (
    sectionId: SectionId,
    sourceColumn: 'sidebar' | 'main',
    sourceIndex: number,
    e: React.DragEvent<HTMLDivElement>
  ) => {
    setDragState({ sectionId, sourceColumn, sourceIndex });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', `${sourceColumn}:${sourceIndex}:${sectionId}`);
  };

  const handleDragOverItem = (
    column: 'sidebar' | 'main',
    index: number,
    e: React.DragEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverTarget?.column !== column || dragOverTarget?.index !== index) {
      setDragOverTarget({ column, index });
    }
  };

  const handleDropOnItem = (
    targetColumn: 'sidebar' | 'main',
    targetIndex: number,
    e: React.DragEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (!dragState) return;

    if (dragState.sourceColumn === targetColumn) {
      if (dragState.sourceIndex !== targetIndex) {
        onReorderInColumn(targetColumn, dragState.sourceIndex, targetIndex);
      }
    } else {
      onMoveToColumn(dragState.sectionId, targetColumn, targetIndex);
    }

    setDragState(null);
    setDragOverTarget(null);
  };

  const handleDropOnEmptyColumn = (
    targetColumn: 'sidebar' | 'main',
    e: React.DragEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
    if (!dragState) return;
    if (dragState.sourceColumn !== targetColumn) {
      onMoveToColumn(dragState.sectionId, targetColumn);
    }
    setDragState(null);
    setDragOverTarget(null);
  };

  const renderSectionCard = (
    secId: SectionId,
    column: 'sidebar' | 'main',
    index: number,
    totalInColumn: number
  ) => {
    const meta = SECTION_METADATA[secId];
    const isHidden = layout.hiddenSections.includes(secId);
    const isDragging = dragState?.sectionId === secId;
    const isDragOver =
      dragOverTarget?.column === column &&
      dragOverTarget?.index === index &&
      dragState?.sectionId !== secId;
    const displayTitle = getSectionTitle(secId, themeConfig.sectionStyles);
    const isEditing = editingTitleId === secId;

    return (
      <div
        key={secId}
        draggable={!isEditing}
        onDragStart={(e) => handleDragStart(secId, column, index, e)}
        onDragOver={(e) => handleDragOverItem(column, index, e)}
        onDrop={(e) => handleDropOnItem(column, index, e)}
        onDragEnd={() => {
          setDragState(null);
          setDragOverTarget(null);
        }}
        className={`p-3 rounded-xl border transition-all select-none ${
          isDragging
            ? 'opacity-40 scale-95 border-teal-500 bg-teal-50/30 dark:bg-teal-950/30'
            : isDragOver
            ? 'border-teal-500 ring-2 ring-teal-500/40 bg-teal-50/40 dark:bg-teal-950/40 -translate-y-0.5'
            : isHidden
            ? 'border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 opacity-60'
            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-teal-500/50 shadow-2xs'
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1 cursor-grab active:cursor-grabbing">
            <GripVertical className="w-4 h-4 text-slate-400 hover:text-teal-600 shrink-0" />
            <span className="w-5 h-5 rounded-md bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 text-[10px] font-bold flex items-center justify-center shrink-0">
              {index + 1}
            </span>

            {isEditing ? (
              <div className="flex items-center gap-1 flex-1 min-w-0">
                <input
                  type="text"
                  value={titleDraft}
                  onChange={(e) => setTitleDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveCustomTitle(secId);
                    if (e.key === 'Escape') setEditingTitleId(null);
                  }}
                  autoFocus
                  placeholder={meta.defaultTitle}
                  className="w-full px-2 py-0.5 text-xs font-bold rounded bg-slate-50 dark:bg-slate-800 border border-teal-500 text-slate-900 dark:text-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => saveCustomTitle(secId)}
                  className="p-1 rounded bg-teal-600 text-white hover:bg-teal-700 shrink-0 cursor-pointer"
                  title="Lưu tên tiêu đề"
                >
                  <Check className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-xs font-bold truncate ${
                      isHidden
                        ? 'line-through text-slate-400 dark:text-slate-500'
                        : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {displayTitle}
                  </span>
                  {onUpdateSectionStyle && (
                    <button
                      type="button"
                      onClick={() => startEditingTitle(secId)}
                      className="p-0.5 rounded text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer"
                      title="Đổi tên tiêu đề mục này trên CV"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                  {meta.label}
                </p>
              </div>
            )}
          </div>

          {/* Action Controls: Up, Down, Switch Column, Hide/Show */}
          <div className="flex items-center gap-0.5 shrink-0">
            <button
              type="button"
              disabled={index === 0}
              onClick={() => onReorderInColumn(column, index, index - 1)}
              className="p-1 rounded text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-25 transition-colors cursor-pointer"
              title="Đưa lên trên"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              disabled={index === totalInColumn - 1}
              onClick={() => onReorderInColumn(column, index, index + 1)}
              className="p-1 rounded text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-25 transition-colors cursor-pointer"
              title="Đưa xuống dưới"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() =>
                onMoveToColumn(secId, column === 'sidebar' ? 'main' : 'sidebar')
              }
              className="p-1 rounded text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors cursor-pointer"
              title={
                column === 'sidebar'
                  ? 'Chuyển sang Cột Chính (Main)'
                  : 'Chuyển sang Cột Phụ (Sidebar)'
              }
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onToggleVisibility(secId)}
              className={`p-1 rounded transition-colors cursor-pointer ${
                isHidden
                  ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100'
                  : 'text-slate-400 hover:text-teal-600 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={isHidden ? 'Đang ẩn — Nhấn để hiện lại trên CV' : 'Nhấn để ẩn mục này trên CV'}
            >
              {isHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
            Kéo thả các mục để đổi thứ tự hiển thị, chuyển đổi giữa 2 cột hoặc bấm icon bút chì để đổi tên tiêu đề mục.
          </p>
        </div>

        <button
          type="button"
          onClick={onResetLayout}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer shrink-0"
          title="Đặt lại thứ tự bố cục chuẩn ban đầu"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Mặc định</span>
        </button>
      </div>

      {/* 2-Column Visual Drag & Drop Builder */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Column 1: Sidebar */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
          }}
          onDrop={(e) => handleDropOnEmptyColumn('sidebar', e)}
          className="p-3 rounded-2xl bg-slate-50/90 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-2.5 min-h-[220px]"
        >
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/70 dark:border-slate-800">
            <span className="text-xs font-extrabold uppercase tracking-wider text-teal-700 dark:text-teal-400 flex items-center gap-1.5">
              <Columns className="w-3.5 h-3.5" />
              <span>Cột Phụ (Sidebar)</span>
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
              {layout.sidebarSections.length} mục
            </span>
          </div>

          <div className="space-y-2">
            {layout.sidebarSections.map((secId, idx) =>
              renderSectionCard(secId, 'sidebar', idx, layout.sidebarSections.length)
            )}
            {layout.sidebarSections.length === 0 && (
              <div className="py-8 text-center text-xs text-slate-400 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
                Kéo thả mục vào Cột Phụ tại đây
              </div>
            )}
          </div>
        </div>

        {/* Column 2: Main Content */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
          }}
          onDrop={(e) => handleDropOnEmptyColumn('main', e)}
          className="p-3 rounded-2xl bg-slate-50/90 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-2.5 min-h-[220px]"
        >
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/70 dark:border-slate-800">
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
              <Columns className="w-3.5 h-3.5" />
              <span>Cột Chính (Main)</span>
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300">
              {layout.mainSections.length} mục
            </span>
          </div>

          <div className="space-y-2">
            {layout.mainSections.map((secId, idx) =>
              renderSectionCard(secId, 'main', idx, layout.mainSections.length)
            )}
            {layout.mainSections.length === 0 && (
              <div className="py-8 text-center text-xs text-slate-400 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
                Kéo thả mục vào Cột Chính tại đây
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayoutCustomizerSection;

