import React from 'react';
import { AchievementItem } from '../../../../types/cv';
import { Plus, Trash2, Trophy } from 'lucide-react';

interface AchievementsSectionProps {
  achievements: AchievementItem[];
  onAdd: () => void;
  onUpdate: (id: string, field: keyof AchievementItem, value: any) => void;
  onRemove: (id: string) => void;
}

export const AchievementsSection: React.FC<AchievementsSectionProps> = ({
  achievements = [],
  onAdd,
  onUpdate,
  onRemove,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          {achievements.length} thành tích / giải thưởng
        </span>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/60 text-teal-700 dark:text-teal-300 font-semibold text-xs border border-teal-200 dark:border-teal-800 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Thêm Thành Tựu Mới</span>
        </button>
      </div>

      {achievements.length === 0 ? (
        <div className="text-center py-6 px-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/40">
          <Trophy className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            Chưa có giải thưởng hoặc thành tích nào. Bấm nút phía trên để thêm!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {achievements.map((ach, idx) => (
            <div
              key={ach.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/80 space-y-3"
            >
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {idx + 1}. {ach.title || 'Giải thưởng / Thành tích'}
                </span>
                <button
                  type="button"
                  onClick={() => onRemove(ach.id)}
                  className="p-1 rounded text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                  title="Xóa thành tích này"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Tên Giải Thưởng / Danh Hiệu *
                  </label>
                  <input
                    type="text"
                    value={ach.title}
                    onChange={(e) => onUpdate(ach.id, 'title', e.target.value)}
                    placeholder="vd: Quán quân Hackathon Quốc Gia"
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500 font-semibold text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Đơn Vị Trao Giải / Tổ Chức *
                  </label>
                  <input
                    type="text"
                    value={ach.issuer}
                    onChange={(e) => onUpdate(ach.id, 'issuer', e.target.value)}
                    placeholder="vd: Bộ TT&TT / Google Developer Group"
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Năm Đạt Được
                  </label>
                  <input
                    type="text"
                    value={ach.year}
                    onChange={(e) => onUpdate(ach.id, 'year', e.target.value)}
                    placeholder="vd: 2023"
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Mô Tả Chi Tiết / Ý Nghĩa Thành Tích
                  </label>
                  <input
                    type="text"
                    value={ach.description || ''}
                    onChange={(e) => onUpdate(ach.id, 'description', e.target.value)}
                    placeholder="vd: Dự án vượt qua 120 đội thi, ứng dụng AI hỗ trợ xử lý dữ liệu..."
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

export default AchievementsSection;
