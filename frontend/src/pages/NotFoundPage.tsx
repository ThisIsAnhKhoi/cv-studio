import React from 'react';
import { Link } from 'react-router-dom';
import { Home, FileQuestion } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-teal-100 dark:bg-teal-950 flex items-center justify-center text-teal-600 dark:text-teal-400 mb-4 shadow-sm">
        <FileQuestion className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">
        404 — Không Tìm Thấy Trang
      </h1>
      <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mt-2">
        Đường dẫn bạn yêu cầu không tồn tại hoặc hồ sơ này đã được gỡ bỏ khỏi hệ thống.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-bold text-xs shadow-md transition-all"
      >
        <Home className="w-4 h-4" />
        <span>Trở Về Trang Chủ Khám Phá</span>
      </Link>
    </div>
  );
};
export default NotFoundPage;
