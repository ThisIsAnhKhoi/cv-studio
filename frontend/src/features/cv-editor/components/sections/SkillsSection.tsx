import React, { useState } from 'react';
import { SkillCategory } from '../../../../types/cv';
import { Plus, Trash2, Code2, X } from 'lucide-react';

interface SkillsSectionProps {
  categories: SkillCategory[];
  onAddCategory: () => void;
  onUpdateCategoryName: (id: string, name: string) => void;
  onRemoveCategory: (id: string) => void;
  onAddSkill: (categoryId: string, skillName: string) => void;
  onRemoveSkill: (categoryId: string, skillIndex: number) => void;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  categories,
  onAddCategory,
  onUpdateCategoryName,
  onRemoveCategory,
  onAddSkill,
  onRemoveSkill,
}) => {
  const [newSkillInputs, setNewSkillInputs] = useState<{ [catId: string]: string }>({});

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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          {categories.length} nhóm kỹ năng
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
        {categories.map((cat, idx) => (
          <div
            key={cat.id}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/80 space-y-3"
          >
            {/* Header: Category Name + Delete button */}
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <input
                type="text"
                value={cat.categoryName}
                onChange={(e) => onUpdateCategoryName(cat.id, e.target.value)}
                placeholder="vd: Kỹ Thuật Lập Trình / Công Cụ"
                className="font-bold text-xs text-slate-900 dark:text-white bg-transparent border-b border-dashed border-slate-300 dark:border-slate-600 focus:outline-none focus:border-teal-500 flex-1 py-0.5"
              />
              <button
                type="button"
                onClick={() => onRemoveCategory(cat.id)}
                className="p-1 rounded text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors shrink-0"
                title="Xóa nhóm kỹ năng này"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Existing skill pills */}
            <div className="flex flex-wrap gap-1.5 min-h-[28px] items-center">
              {cat.skills.map((skill, sIdx) => (
                <span
                  key={sIdx}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                >
                  <span>{skill.name}</span>
                  <button
                    type="button"
                    onClick={() => onRemoveSkill(cat.id, sIdx)}
                    className="p-0.5 text-slate-400 hover:text-rose-600 rounded"
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
        ))}
      </div>
    </div>
  );
};
export default SkillsSection;
