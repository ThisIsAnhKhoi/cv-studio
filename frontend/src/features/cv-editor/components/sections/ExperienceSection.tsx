import React from 'react';
import { ExperienceItem } from '../../../../types/cv';
import { Plus, Trash2, Briefcase, Calendar, MapPin, ListPlus, X } from 'lucide-react';

interface ExperienceSectionProps {
  experiences: ExperienceItem[];
  onAdd: () => void;
  onUpdate: (id: string, field: keyof ExperienceItem, value: any) => void;
  onRemove: (id: string) => void;
  onAddDesc: (id: string) => void;
  onUpdateDesc: (id: string, index: number, text: string) => void;
  onRemoveDesc: (id: string, index: number) => void;
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  experiences,
  onAdd,
  onUpdate,
  onRemove,
  onAddDesc,
  onUpdateDesc,
  onRemoveDesc,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Tổng cộng {experiences.length} vị trí công việc
        </span>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/60 text-teal-700 dark:text-teal-300 font-semibold text-xs border border-teal-200 dark:border-teal-800 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Thêm Kinh Nghiệm Mới</span>
        </button>
      </div>

      {experiences.length === 0 ? (
        <div className="text-center py-8 px-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/40">
          <Briefcase className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            Chưa có kinh nghiệm làm việc nào. Bấm nút bên trên để thêm!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp, index) => (
            <div
              key={exp.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/80 space-y-3 relative group"
            >
              {/* Header row: Position title + Delete button */}
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 text-[11px] font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {exp.position || 'Chức danh chưa đặt'} — {exp.company || 'Công ty'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onRemove(exp.id)}
                  className="p-1 rounded text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  title="Xóa kinh nghiệm này"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Form fields: Company & Position */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Chức Danh / Vị Trí *
                  </label>
                  <input
                    type="text"
                    value={exp.position}
                    onChange={(e) => onUpdate(exp.id, 'position', e.target.value)}
                    placeholder="vd: Senior Frontend Developer"
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500 font-semibold text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Công Ty / Doanh Nghiệp *
                  </label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => onUpdate(exp.id, 'company', e.target.value)}
                    placeholder="vd: FPT Software"
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Form fields: Dates & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Bắt Đầu (Tháng/Năm)
                  </label>
                  <div className="relative">
                    <Calendar className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={exp.startDate}
                      onChange={(e) => onUpdate(exp.id, 'startDate', e.target.value)}
                      placeholder="09/2021"
                      className="w-full pl-8 pr-2 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Kết Thúc (Tháng/Năm)
                  </label>
                  <input
                    type="text"
                    value={exp.isCurrent ? 'Hiện tại' : exp.endDate}
                    disabled={exp.isCurrent}
                    onChange={(e) => onUpdate(exp.id, 'endDate', e.target.value)}
                    placeholder="12/2023"
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:opacity-60 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Địa Điểm
                  </label>
                  <div className="relative">
                    <MapPin className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={exp.location || ''}
                      onChange={(e) => onUpdate(exp.id, 'location', e.target.value)}
                      placeholder="TP. Hồ Chí Minh"
                      className="w-full pl-8 pr-2 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Checkbox: Is Current Job */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`current-job-${exp.id}`}
                  checked={exp.isCurrent}
                  onChange={(e) => {
                    const isCur = e.target.checked;
                    onUpdate(exp.id, 'isCurrent', isCur);
                    if (isCur) onUpdate(exp.id, 'endDate', 'Hiện tại');
                  }}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                />
                <label
                  htmlFor={`current-job-${exp.id}`}
                  className="text-xs text-slate-600 dark:text-slate-300 font-medium cursor-pointer"
                >
                  Tôi đang làm việc tại đây
                </label>
              </div>

              {/* Descriptions bullet points */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    Các gạch đầu dòng kết quả & trách nhiệm:
                  </label>
                  <button
                    type="button"
                    onClick={() => onAddDesc(exp.id)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
                  >
                    <ListPlus className="w-3 h-3" />
                    <span>Thêm dòng</span>
                  </button>
                </div>

                <div className="space-y-1.5">
                  {(exp.descriptions || []).map((desc, dIdx) => (
                    <div key={dIdx} className="flex items-start gap-1.5">
                      <span className="text-slate-400 text-xs mt-1 shrink-0">•</span>
                      <textarea
                        rows={2}
                        value={desc}
                        onChange={(e) => onUpdateDesc(exp.id, dIdx, e.target.value)}
                        placeholder="Mô tả công việc hoặc thành tích đạt được..."
                        className="flex-1 px-2.5 py-1 text-xs rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-900 dark:text-white resize-y"
                      />
                      {(exp.descriptions || []).length > 1 && (
                        <button
                          type="button"
                          onClick={() => onRemoveDesc(exp.id, dIdx)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded mt-0.5"
                          title="Xóa dòng này"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default ExperienceSection;
