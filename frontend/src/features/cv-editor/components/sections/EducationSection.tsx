import React from 'react';
import { EducationItem } from '../../../../types/cv';
import { Plus, Trash2, GraduationCap } from 'lucide-react';

interface EducationSectionProps {
  educations: EducationItem[];
  onAdd: () => void;
  onUpdate: (id: string, field: keyof EducationItem, value: any) => void;
  onRemove: (id: string) => void;
}

export const EducationSection: React.FC<EducationSectionProps> = ({
  educations,
  onAdd,
  onUpdate,
  onRemove,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          {educations.length} trường / bằng cấp
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
          {educations.map((edu, idx) => (
            <div
              key={edu.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/80 space-y-3"
            >
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {idx + 1}. {edu.degree || 'Bằng cấp'} — {edu.school || 'Trường học'}
                </span>
                <button
                  type="button"
                  onClick={() => onRemove(edu.id)}
                  className="p-1 rounded text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  title="Xóa học vấn này"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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

                <div>
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
          ))}
        </div>
      )}
    </div>
  );
};
export default EducationSection;
