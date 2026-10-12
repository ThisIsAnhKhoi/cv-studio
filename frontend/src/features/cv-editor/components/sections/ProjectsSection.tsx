import React from 'react';
import { ProjectItem } from '../../../../types/cv';
import { Plus, Trash2, FolderGit2, ExternalLink } from 'lucide-react';

interface ProjectsSectionProps {
  projects: ProjectItem[];
  onAdd: () => void;
  onUpdate: (id: string, field: keyof ProjectItem, value: any) => void;
  onRemove: (id: string) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects,
  onAdd,
  onUpdate,
  onRemove,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          {projects.length} dự án tiêu biểu
        </span>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/60 text-teal-700 dark:text-teal-300 font-semibold text-xs border border-teal-200 dark:border-teal-800 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Thêm Dự Án Mới</span>
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-6 px-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/40">
          <FolderGit2 className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            Chưa có dự án nào. Bấm nút phía trên để thêm dự án thực tế của bạn!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((proj, idx) => (
            <div
              key={proj.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/80 space-y-3"
            >
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {idx + 1}. {proj.name || 'Dự án mới'}
                </span>
                <button
                  type="button"
                  onClick={() => onRemove(proj.id)}
                  className="p-1 rounded text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  title="Xóa dự án này"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Tên Dự Án *
                  </label>
                  <input
                    type="text"
                    value={proj.name}
                    onChange={(e) => onUpdate(proj.id, 'name', e.target.value)}
                    placeholder="vd: E-Commerce Mobile App"
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500 font-semibold text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Vai Trò Đảm Nhiệm
                  </label>
                  <input
                    type="text"
                    value={proj.role}
                    onChange={(e) => onUpdate(proj.id, 'role', e.target.value)}
                    placeholder="vd: Lead Frontend Developer"
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Mô Tả & Kết Quả Đạt Được
                </label>
                <textarea
                  rows={2}
                  value={proj.description}
                  onChange={(e) => onUpdate(proj.id, 'description', e.target.value)}
                  placeholder="Mô tả mục tiêu sản phẩm, quy mô người dùng hoặc thành tích số liệu đạt được..."
                  className="w-full p-2.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-900 dark:text-white resize-y"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Công Nghệ Sử Dụng (phân cách bằng dấu phẩy)
                  </label>
                  <input
                    type="text"
                    value={(proj.techStack || []).join(', ')}
                    onChange={(e) => {
                      const tags = e.target.value
                        .split(',')
                        .map((t) => t.trim())
                        .filter(Boolean);
                      onUpdate(proj.id, 'techStack', tags);
                    }}
                    placeholder="React, TypeScript, Tailwind, Node.js"
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Đường Dẫn Demo / GitHub
                  </label>
                  <div className="relative">
                    <ExternalLink className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={proj.link || ''}
                      onChange={(e) => onUpdate(proj.id, 'link', e.target.value)}
                      placeholder="https://github.com/..."
                      className="w-full pl-8 pr-2 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default ProjectsSection;
