import React from 'react';

export const PageSkeleton: React.FC = () => {
  return (
    <div
      role="status"
      aria-label="Đang tải trang..."
      className="min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-4 animate-fade-in"
    >
      <div className="relative w-12 h-12">
        <div className="w-12 h-12 rounded-full border-4 border-teal-200 dark:border-teal-900 border-t-teal-600 dark:border-t-teal-400 animate-spin" />
      </div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse">
        Đang tải giao diện Studio...
      </p>
    </div>
  );
};

export default PageSkeleton;
