import React, { useState } from 'react';
import { EducationItem } from '../../../../types/cv';
import {
  Plus,
  Trash2,
  GraduationCap,
  GripVertical,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';

interface EducationSectionProps {
  educations: EducationItem[];
  onAdd: () => void;
  onUpdate: (id: string, field: keyof EducationItem, value: any) => void;
  onRemove: (id: string) => void;
  onReorder?: (startIndex: number, endIndex: number) => void;
}

export const EducationSection: React.FC<EducationSectionProps> = ({
  educations,
  onAdd,
  onUpdate,
  onRemove,
  onReorder,
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [dragEnabledIndex, setDragEnabledIndex] = useState<number | null>(null);

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
    if (draggedIndex !== null && draggedIndex !== targetIndex && onReorder) {
      onReorder(draggedIndex, targetIndex);
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
          {educations.length} trường / bằng cấp (Kéo thả để sắp xếp)
        </span>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/60 text-teal-700 dark:text-teal-300 font-semibold text-xs border border-teal-200 dark:border-teal-800 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Thêm Học Vấn Mới</span>
        </button>
      </div>

      {educations.length === 0 ? (
        <div className="text-center py-6 px-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/40">
          <GraduationCap className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            Chưa có bằng cấp hoặc học vấn nào. Bấm nút phía trên để thêm!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {educations.map((edu, idx) => {
            const isDragging = draggedIndex === idx;
            const isDragOver = dragOverIndex === idx && draggedIndex !== idx;

            return (
              <div
                key={edu.id}
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
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <div
                    className="flex items-center gap-2 min-w-0 flex-1 cursor-grab active:cursor-grabbing"
                    onMouseEnter={() => setDragEnabledIndex(idx)}
                    onMouseLeave={() => {
                      if (draggedIndex === null) setDragEnabledIndex(null);
                    }}
                    title="Giữ và kéo để sắp xếp vị trí"
                  >
                    <GripVertical className="w-4 h-4 text-slate-400 hover:text-teal-600 shrink-0" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {idx + 1}. {edu.degree || 'Bằng cấp'} — {edu.school || 'Trường học'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {onReorder && educations.length > 1 && (
                      <>
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => onReorder(idx, idx - 1)}
                          className="p-1 rounded text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors cursor-pointer"
                          title="Chuyển lên trên"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === educations.length - 1}
                          onClick={() => onReorder(idx, idx + 1)}
                          className="p-1 rounded text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors cursor-pointer"
                          title="Chuyển xuống dưới"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                    <button
                      type="button"
                      onClick={() => onRemove(edu.id)}
                      className="p-1 rounded text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                      title="Xóa học vấn này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Trường Đại Học / Học Viện *
                    </label>
                    <input
                      type="text"
                      value={edu.school}
                      onChange={(e) => onUpdate(edu.id, 'school', e.target.value)}
                      placeholder="vd: Đại học Bách Khoa"
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Bằng Cấp / Học Vị *
                    </label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => onUpdate(edu.id, 'degree', e.target.value)}
                      placeholder="vd: Cử Nhân Công Nghệ Thông Tin"
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500 font-semibold text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Chuyên Ngành
                    </label>
                    <input
                      type="text"
                      value={edu.major}
                      onChange={(e) => onUpdate(edu.id, 'major', e.target.value)}
                      placeholder="Khoa học máy tính"
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Thời Gian (Năm bắt đầu - kết thúc)
                    </label>
                    <input
                      type="text"
                      value={`${edu.startDate} - ${edu.endDate}`}
                      onChange={(e) => {
                        const parts = e.target.value.split('-');
                        onUpdate(edu.id, 'startDate', parts[0]?.trim() || '');
                        onUpdate(edu.id, 'endDate', parts[1]?.trim() || '');
                      }}
                      placeholder="2019 - 2023"
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Điểm GPA / Xếp Loại
                    </label>
                    <input
                      type="text"
                      value={edu.gpa || ''}
                      onChange={(e) => onUpdate(edu.id, 'gpa', e.target.value)}
                      placeholder="3.65 / 4.0 (Loại Giỏi)"
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default EducationSection;
