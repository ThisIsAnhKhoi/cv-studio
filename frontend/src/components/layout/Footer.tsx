import React from 'react';
import { Sparkles, Heart, FileCheck, ShieldCheck, Printer, ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="no-print bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors duration-200 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg tracking-tight font-display bg-gradient-to-r from-teal-700 to-emerald-600 dark:from-teal-300 dark:to-emerald-400 bg-clip-text text-transparent">
                CV Studio Platform
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-md">
              Nền tảng thế hệ mới tạo & quản lý CV/Portfolio trực tuyến chuẩn quốc tế. Hỗ trợ đa mẫu thiết kế, tối ưu 100% typography tiếng Việt, xuất file PDF 1-click và chuẩn in ấn A4 không tràn viền.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1">
                <FileCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" /> Chuẩn A4 Quốc Tế
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <Printer className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" /> Vector PDF Sắc Nét
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" /> Bảo Mật & Độc Lập
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-4">
              Khám Phá
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  Danh Sách Hồ Sơ Nổi Bật
                </Link>
              </li>
              <li>
                <a href="#templates-showcase" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  3 Mẫu CV Tuyển Dụng
                </a>
              </li>
              <li>
                <Link to="/cv/cv-thanhtruc-01" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  Mẫu 1: Classic Teal (Đã duyệt)
                </Link>
              </li>
              <li>
                <Link to="/cv/cv-thanhtruc-design" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  Mẫu 2: Warm Bold
                </Link>
              </li>
              <li>
                <Link to="/cv/cv-hoangnam-ai" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  Mẫu 3: Modern Minimal
                </Link>
              </li>
            </ul>
          </div>

          {/* Technology Stack */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-4">
              Công Nghệ Nền Tảng
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li>• React 18 + TypeScript</li>
              <li>• Tailwind CSS & Design Tokens</li>
              <li>• React Router DOM SPA</li>
              <li>• Self-hosted Web Fonts Tiếng Việt</li>
              <li>• html2pdf.js High-res Vector Engine</li>
              <li>• Kiến trúc 4 Lớp Clean Architecture</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p className="flex items-center gap-1">
            <span>© 2026 CV Studio. Thiết kế với</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>dành cho cộng đồng chuyên gia & nhân sự Việt Nam.</span>
          </p>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
          >
            <span>Về đầu trang</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
