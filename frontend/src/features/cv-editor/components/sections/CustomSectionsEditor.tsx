import React, { useState } from 'react';
import { CustomSection, CustomSectionItem } from '../../../../types/cv';
import {
  Plus,
  Trash2,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Layers,
  Columns,
  ListPlus,
} from 'lucide-react';

interface CustomSectionsEditorProps {
  customSections: CustomSection[];
  onAddSection: (title?: string, column?: 'sidebar' | 'main') => void;
  onUpdateSection: (sectionId: string, updates: Partial<CustomSection>) => void;
  onRemoveSection: (sectionId: string) => void;
  onReorderSections: (startIndex: number, endIndex: number) => void;
  onAddItem: (sectionId: string) => void;
  onUpdateItem: (
    sectionId: string,
    itemId: string,
    field: keyof CustomSectionItem,
    value: string
  ) => void;
  onRemoveItem: (sectionId: string, itemId: string) => void;
  onReorderItems: (sectionId: string, startIndex: number, endIndex: number) => void;
}

const QUICK_CUSTOM_PRESETS = [
  { title: 'Ngoại Ngữ', column: 'sidebar' as const },
  { title: 'Hoạt Động Ngoại Khóa', column: 'main' as const },
  { title: 'Sở Thích Cá Nhân', column: 'sidebar' as const },
  { title: 'Người Tham Chiếu', column: 'main' as const },
];

export const CustomSectionsEditor: React.FC<CustomSectionsEditorProps> = ({
  customSections = [],
  onAddSection,
  onUpdateSection,
  onRemoveSection,
  onReorderSections,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
  onReorderItems,
}) => {
  const [draggedSecIdx, setDraggedSecIdx] = useState<number | null>(null);
  const [dragEnabledSecIdx, setDragEnabledSecIdx] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
            {customSections.length} khối tùy chỉnh tự tạo
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Tự do tạo thêm các mục như Ngoại ngữ, Hoạt động, Sở thích, Người tham chiếu...
          </span>
        </div>
        <button
          type="button"
          onClick={() => onAddSection('Mục Tùy Chỉnh Mới', 'main')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tạo Mục Mới</span>
        </button>
      </div>

      {/* Quick Presets */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] text-slate-400 font-medium mr-1">Thêm nhanh:</span>
        {QUICK_CUSTOM_PRESETS.map((preset) => (
          <button
            key={preset.title}
            type="button"
            onClick={() => onAddSection(preset.title, preset.column)}
            className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950/50 text-slate-700 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          >
            + {preset.title}
          </button>
        ))}
      </div>

      {customSections.length === 0 ? (
        <div className="text-center py-6 px-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/40">
          <Layers className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            Chưa có mục tùy chỉnh nào. Nhấn <strong>"Tạo Mục Mới"</strong> hoặc các gợi ý bên trên để tự build thêm khối cho CV!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {customSections.map((sec, secIdx) => (
            <div
              key={sec.id}
              draggable={dragEnabledSecIdx === secIdx}
              onDragStart={(e) => {
                setDraggedSecIdx(secIdx);
                e.dataTransfer.effectAllowed = 'move';
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
              }}
              onDrop={(e) => {
                e.preventDefault();
                if (draggedSecIdx !== null && draggedSecIdx !== secIdx) {
                  onReorderSections(draggedSecIdx, secIdx);
                }
                setDraggedSecIdx(null);
                setDragEnabledSecIdx(null);
              }}
              onDragEnd={() => {
                setDraggedSecIdx(null);
                setDragEnabledSecIdx(null);
              }}
              className={`p-4 rounded-xl border transition-all space-y-3 ${
                draggedSecIdx === secIdx
                  ? 'opacity-50 border-teal-500 bg-teal-50/20'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/80'
              }`}
            >
              {/* Section Header: Drag Handle, Title Input, Column Selector, Up/Down, Delete */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 flex-1 min-w-[180px]">
                  <div
                    className="cursor-grab active:cursor-grabbing p-0.5 text-slate-400 hover:text-teal-600"
                    onMouseEnter={() => setDragEnabledSecIdx(secIdx)}
                    onMouseLeave={() => {
                      if (draggedSecIdx === null) setDragEnabledSecIdx(null);
                    }}
                    title="Kéo thả để sắp xếp khối"
                  >
                    <GripVertical className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={sec.title}
                    onChange={(e) => onUpdateSection(sec.id, { title: e.target.value })}
                    placeholder="Tên khối (vd: Ngoại Ngữ, Giải Thưởng...)"
                    className="font-bold text-xs text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500 flex-1"
                  />
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Column switcher */}
                  <div className="inline-flex items-center rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700 text-[10px] font-semibold">
                    <button
                      type="button"
                      onClick={() => onUpdateSection(sec.id, { column: 'sidebar' })}
                      className={`px-2 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                        sec.column === 'sidebar'
                          ? 'bg-teal-600 text-white shadow-2xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                      title="Hiển thị ở Cột Phụ (Sidebar)"
                    >
                      <Columns className="w-3 h-3" />
                      <span>Cột Phụ</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onUpdateSection(sec.id, { column: 'main' })}
                      className={`px-2 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                        sec.column === 'main'
                          ? 'bg-teal-600 text-white shadow-2xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                      title="Hiển thị ở Cột Chính (Main)"
                    >
                      <Columns className="w-3 h-3" />
                      <span>Cột Chính</span>
                    </button>
                  </div>

                  {customSections.length > 1 && (
                    <>
                      <button
                        type="button"
                        disabled={secIdx === 0}
                        onClick={() => onReorderSections(secIdx, secIdx - 1)}
                        className="p-1 rounded text-slate-400 hover:text-teal-600 disabled:opacity-30 cursor-pointer"
                        title="Đưa khối lên trên"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={secIdx === customSections.length - 1}
                        onClick={() => onReorderSections(secIdx, secIdx + 1)}
                        className="p-1 rounded text-slate-400 hover:text-teal-600 disabled:opacity-30 cursor-pointer"
                        title="Đưa khối xuống dưới"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={() => onRemoveSection(sec.id)}
                    className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    title="Xóa khối tùy chỉnh này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Items inside Custom Section */}
              <div className="space-y-2.5">
                {(sec.items || []).map((item, itemIdx) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/70 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400">
                        Mục #{itemIdx + 1}
                      </span>
                      <div className="flex items-center gap-1">
                        {(sec.items || []).length > 1 && (
                          <>
                            <button
                              type="button"
                              disabled={itemIdx === 0}
                              onClick={() => onReorderItems(sec.id, itemIdx, itemIdx - 1)}
                              className="p-0.5 text-slate-400 hover:text-teal-600 disabled:opacity-30 cursor-pointer"
                              title="Lên trên"
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={itemIdx === sec.items.length - 1}
                              onClick={() => onReorderItems(sec.id, itemIdx, itemIdx + 1)}
                              className="p-0.5 text-slate-400 hover:text-teal-600 disabled:opacity-30 cursor-pointer"
                              title="Xuống dưới"
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                        <button
                          type="button"
                          onClick={() => onRemoveItem(sec.id, item.id)}
                          className="p-0.5 text-slate-400 hover:text-rose-600 cursor-pointer"
                          title="Xóa mục này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => onUpdateItem(sec.id, item.id, 'title', e.target.value)}
                        placeholder="Tiêu đề chính (vd: Tiếng Anh IELTS 7.5)"
                        className="px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                      <input
                        type="text"
                        value={item.subtitle || ''}
                        onChange={(e) => onUpdateItem(sec.id, item.id, 'subtitle', e.target.value)}
                        placeholder="Phụ đề / Đơn vị (tùy chọn)"
                        className="px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                      <input
                        type="text"
                        value={item.date || ''}
                        onChange={(e) => onUpdateItem(sec.id, item.id, 'date', e.target.value)}
                        placeholder="Thời gian (tùy chọn)"
                        className="px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>

                    <textarea
                      rows={2}
                      value={item.description || ''}
                      onChange={(e) => onUpdateItem(sec.id, item.id, 'description', e.target.value)}
                      placeholder="Mô tả chi tiết nội dung (tùy chọn)..."
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500 resize-y"
                    />
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => onAddItem(sec.id)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline pt-1 cursor-pointer"
                >
                  <ListPlus className="w-3.5 h-3.5" />
                  <span>+ Thêm dòng nội dung vào "{sec.title}"</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSectionsEditor;

