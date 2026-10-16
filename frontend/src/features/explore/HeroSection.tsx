import React from 'react';
import { Sparkles, ArrowRight, CheckCircle2, FileText, Download, Eye, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-slate-200/70 dark:border-slate-800/70 bg-gradient-to-b from-teal-50/40 via-white to-slate-50/80 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-teal-400/15 via-emerald-400/10 to-cyan-400/15 dark:from-teal-600/10 dark:via-emerald-600/5 dark:to-cyan-600/10 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100/80 dark:bg-teal-950/70 border border-teal-200 dark:border-teal-800/80 text-teal-800 dark:text-teal-300 text-xs font-semibold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 animate-pulse" />
            <span>Nền Tảng Hồ Sơ Năng Lực & CV Chuẩn Quốc Tế</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display leading-[1.2]">
            Tạo CV Chuẩn Tuyển Dụng &{' '}
            <span className="bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-500 dark:from-teal-400 dark:via-emerald-300 dark:to-teal-200 bg-clip-text text-transparent">
              Khẳng Định Thương Hiệu
            </span>{' '}
            Cá Nhân
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-2xl mx-auto">
            Khám phá danh bạ profile của các chuyên gia công nghệ, thiết kế và quản lý hàng đầu. Xem CV trực tuyến tương tác, đổi mẫu tức thì và tải file PDF chuẩn A4 1-click sắc nét.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <a
              href="#directory-section"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 active:scale-95 text-white font-bold text-sm shadow-lg shadow-teal-600/25 transition-all cursor-pointer"
            >
              <Users className="w-4 h-4" />
              <span>Khám Phá Hồ Sơ</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </a>

            <Link
              to="/cv/cv-thanhtruc-01"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 active:scale-95 text-slate-800 dark:text-slate-100 font-bold text-sm border border-slate-200 dark:border-slate-700 shadow-sm transition-all cursor-pointer"
            >
              <Eye className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Xem CV Mẫu (Đã duyệt)</span>
            </Link>
          </div>

          {/* Value Props Pills */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Khổ A4 (210mm × 297mm) Chuẩn</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>100% Typography Tiếng Việt Cân Đối</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Không Tràn Viền Khi In Ấn</span>
            </div>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="mt-14 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 p-3 sm:p-6 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-md">
          <div className="text-center p-2 border-r border-slate-100 dark:border-slate-800 last:border-none">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
              3 Mẫu
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
              Bố Cục Độc Quyền
            </div>
          </div>

          <div className="text-center p-2 border-r border-slate-100 dark:border-slate-800 last:border-none">
            <div className="text-2xl sm:text-3xl font-extrabold text-teal-600 dark:text-teal-400 font-display">
              1-Click
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
              In A4 Chuẩn Xác
            </div>
          </div>

          <div className="text-center p-2 border-r border-slate-100 dark:border-slate-800 last:border-none">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-display">
              100%
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
              Chuẩn Dấu Tiếng Việt
            </div>
          </div>

          <div className="text-center p-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
              A4 Vector
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
              Độ Phân Giải Cao 2x
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default HeroSection;
