import React from 'react';
import { Search, X, SlidersHorizontal, Users } from 'lucide-react';

export interface CategoryOption {
  id: string;
  label: string;
  count?: number;
}

interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  totalCount: number;
  filteredCount: number;
}

export const CATEGORIES: CategoryOption[] = [
  { id: 'all', label: 'Tất Cả Ngành Nghề' },
  { id: 'tech', label: 'Lập Trình & Full-stack' },
  { id: 'design', label: 'Thiết Kế & UI/UX' },
  { id: 'data-ai', label: 'Dữ Liệu & Trí Tuệ Nhân Tạo' },
  { id: 'marketing', label: 'Marketing & Tăng Trưởng' },
  { id: 'hr', label: 'Nhân Sự & Tuyển Dụng' },
];

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  totalCount,
  filteredCount,
}) => {
  return (
    <div className="space-y-4">
      {/* Search Input Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input Box */}
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm theo tên ứng viên, vị trí (Full-stack, Designer...), hoặc kỹ năng (React, Figma...)"
            className="w-full pl-11 pr-10 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 text-sm shadow-xs transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md"
              title="Xóa tìm kiếm"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Counter Badge */}
        <div className="shrink-0 flex items-center justify-between sm:justify-end gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium px-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
            <Users className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>
              Hiển thị <strong className="text-slate-800 dark:text-slate-200">{filteredCount}</strong> / {totalCount} hồ sơ
            </span>
          </div>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 shrink-0 flex items-center gap-1 mr-1">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Bộ lọc:
        </span>
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-teal-600 dark:bg-teal-500 text-white shadow-sm shadow-teal-600/30 font-semibold scale-102'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
export default SearchFilterBar;
