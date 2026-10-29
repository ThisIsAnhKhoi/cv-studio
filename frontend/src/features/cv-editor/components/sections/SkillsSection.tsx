import React, { useState } from 'react';
import { SkillCategory } from '../../../../types/cv';
import {
  Plus,
  Trash2,
  X,
  GripVertical,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface SkillsSectionProps {
  categories: SkillCategory[];
  onAddCategory: () => void;
  onUpdateCategoryName: (id: string, name: string) => void;
  onRemoveCategory: (id: string) => void;
  onReorderCategories?: (startIndex: number, endIndex: number) => void;
  onAddSkill: (categoryId: string, skillName: string) => void;
  onRemoveSkill: (categoryId: string, skillIndex: number) => void;
  onReorderSkills?: (categoryId: string, startIndex: number, endIndex: number) => void;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  categories,
  onAddCategory,
  onUpdateCategoryName,
  onRemoveCategory,
  onReorderCategories,
  onAddSkill,
  onRemoveSkill,
  onReorderSkills,
}) => {
  const [newSkillInputs, setNewSkillInputs] = useState<{ [catId: string]: string }>({});
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [dragEnabledIndex, setDragEnabledIndex] = useState<number | null>(null);

  const handleInputKeyDown = (catId: string, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = (newSkillInputs[catId] || '').trim();
      if (val) {
        onAddSkill(catId, val);
        setNewSkillInputs((prev) => ({ ...prev, [catId]: '' }));
      }
    }
  };

  const handleAddSkillClick = (catId: string) => {
    const val = (newSkillInputs[catId] || '').trim();
    if (val) {
      onAddSkill(catId, val);
      setNewSkillInputs((prev) => ({ ...prev, [catId]: '' }));
    }
  };

  const handleDragStart = (index: number, e: React.DragEvent<HTMLDivElement>) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
  };

  const handleDragOver = (index: number, e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (targetIndex: number, e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== targetIndex && onReorderCategories) {
      onReorderCategories(draggedIndex, targetIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
    setDragEnabledIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
    setDragEnabledIndex(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          {categories.length} nhóm kỹ năng (Kéo thả để sắp xếp)
        </span>
        <button
          type="button"
          onClick={onAddCategory}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/60 text-teal-700 dark:text-teal-300 font-semibold text-xs border border-teal-200 dark:border-teal-800 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Thêm Nhóm Kỹ Năng Mới</span>
        </button>
      </div>

      <div className="space-y-3">
        {categories.map((cat, idx) => {
          const isDragging = draggedIndex === idx;
          const isDragOver = dragOverIndex === idx && draggedIndex !== idx;

          return (
            <div
              key={cat.id}
              draggable={dragEnabledIndex === idx}
              onDragStart={(e) => handleDragStart(idx, e)}
              onDragOver={(e) => handleDragOver(idx, e)}
              onDrop={(e) => handleDrop(idx, e)}
              onDragEnd={handleDragEnd}
              className={`p-4 rounded-xl border transition-all space-y-3 ${
                isDragging
                  ? 'opacity-50 scale-[0.99] border-teal-500 bg-teal-50/20 dark:bg-teal-950/20'
                  : isDragOver
                  ? 'border-teal-500 ring-2 ring-teal-500/30 bg-white dark:bg-slate-900'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/80'
              }`}
            >
              {/* Header: Drag Handle + Category Name + Up/Down + Delete button */}
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                <div
                  className="flex items-center gap-1.5 cursor-grab active:cursor-grabbing shrink-0"
                  onMouseEnter={() => setDragEnabledIndex(idx)}
                  onMouseLeave={() => {
                    if (draggedIndex === null) setDragEnabledIndex(null);
                  }}
                  title="Giữ và kéo để sắp xếp nhóm kỹ năng"
                >
                  <GripVertical className="w-4 h-4 text-slate-400 hover:text-teal-600" />
                </div>

                <input
                  type="text"
                  value={cat.categoryName}
                  onChange={(e) => onUpdateCategoryName(cat.id, e.target.value)}
                  placeholder="vd: Kỹ Thuật Lập Trình / Công Cụ"
                  className="font-bold text-xs text-slate-900 dark:text-white bg-transparent border-b border-dashed border-slate-300 dark:border-slate-600 focus:outline-none focus:border-teal-500 flex-1 py-0.5"
                />

                <div className="flex items-center gap-1 shrink-0">
                  {onReorderCategories && categories.length > 1 && (
                    <>
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => onReorderCategories(idx, idx - 1)}
                        className="p-1 rounded text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors cursor-pointer"
                        title="Chuyển nhóm kỹ năng lên trên"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === categories.length - 1}
                        onClick={() => onReorderCategories(idx, idx + 1)}
                        className="p-1 rounded text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors cursor-pointer"
                        title="Chuyển nhóm kỹ năng xuống dưới"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => onRemoveCategory(cat.id)}
                    className="p-1 rounded text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors shrink-0 cursor-pointer"
                    title="Xóa nhóm kỹ năng này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Existing skill pills */}
              <div className="flex flex-wrap gap-1.5 min-h-[28px] items-center">
                {cat.skills.map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="group/pill inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                  >
                    {onReorderSkills && cat.skills.length > 1 && sIdx > 0 && (
                      <button
                        type="button"
                        onClick={() => onReorderSkills(cat.id, sIdx, sIdx - 1)}
                        className="text-slate-400 hover:text-teal-600 hidden group-hover/pill:inline-flex"
                        title="Sang trái"
                      >
                        <ChevronLeft className="w-3 h-3" />
                      </button>
                    )}
                    <span>{skill.name}</span>
                    {onReorderSkills && cat.skills.length > 1 && sIdx < cat.skills.length - 1 && (
                      <button
                        type="button"
                        onClick={() => onReorderSkills(cat.id, sIdx, sIdx + 1)}
                        className="text-slate-400 hover:text-teal-600 hidden group-hover/pill:inline-flex"
                        title="Sang phải"
                      >
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onRemoveSkill(cat.id, sIdx)}
                      className="p-0.5 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                      title="Xóa kỹ năng này"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Input to add a new skill to this category */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={newSkillInputs[cat.id] || ''}
                  onChange={(e) =>
                    setNewSkillInputs((prev) => ({ ...prev, [cat.id]: e.target.value }))
                  }
                  onKeyDown={(e) => handleInputKeyDown(cat.id, e)}
                  placeholder="Gõ tên kỹ năng rồi nhấn Enter (vd: TypeScript, Figma...)"
                  className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => handleAddSkillClick(cat.id)}
                  className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition-colors shrink-0 cursor-pointer"
                >
                  + Thêm
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default SkillsSection;
