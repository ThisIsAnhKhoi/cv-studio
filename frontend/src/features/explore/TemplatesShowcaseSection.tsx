import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Sparkles, ArrowRight, ShieldCheck, Printer, Layout } from 'lucide-react';
import { TEMPLATES_REGISTRY } from '../cv-templates/TemplateRegistry';

export const TemplatesShowcaseSection: React.FC = () => {
  const templatesList = [
    {
      id: 'template-classic-teal',
      name: 'Mẫu 1: Classic Teal',
      badge: 'ĐÃ DUYỆT (CHÍNH THỨC)',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
      description:
        'Bố cục 2 cột với sidebar màu ngọc lục bảo thanh lịch. Tối ưu cho giáo dục, kỹ thuật, quản lý và các ứng viên cần tính chuẩn mực cao.',
      highlights: ['Sidebar trang nhã', 'Điểm nhấn xanh Teal', 'Dễ scan thông tin tuyển dụng'],
      sampleCvId: 'cv-thanhtruc-01',
      accentBg: 'from-teal-600 to-emerald-700',
    },
    {
      id: 'template-warm-bold',
      name: 'Mẫu 2: Warm Bold',
      badge: 'NĂNG ĐỘNG & SÁNG TẠO',
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-800',
      description:
        'Banner header màu Ink nổi bật phối cùng vạch cam Tangerine ấm áp và cột cát Sand. Phù hợp cho IT, Product Designer và Marketing.',
      highlights: ['Banner header tương phản', 'Gam màu cam ấm áp', 'Timeline kinh nghiệm rõ ràng'],
      sampleCvId: 'cv-thanhtruc-design',
      accentBg: 'from-amber-600 to-orange-700',
    },
    {
      id: 'template-modern-minimal',
      name: 'Mẫu 3: Modern Minimal',
      badge: 'TỐI GIẢN & TINH TẾ',
      badgeColor: 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700',
      description:
        'Thiết kế phong cách Bắc Âu tối giản, đơn sắc tinh gọn kết hợp vạch đỏ Crimson nhấn tinh tế. Phù hợp cho AI, Data Scientist và Quản lý cấp cao.',
      highlights: ['Đơn sắc thanh lịch', 'Tập trung vào câu từ', 'Khung viền sắc nét'],
      sampleCvId: 'cv-hoangnam-ai',
      accentBg: 'from-slate-800 to-slate-900',
    },
  ];

  return (
    <section id="templates-showcase" className="py-16 sm:py-20 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100/80 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-semibold">
            <Layout className="w-3.5 h-3.5" />
            <span>Thư Viện Mẫu CV Tuyển Dụng</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white font-display">
            3 Phong Cách Thiết Kế Chuẩn Mực Tuyển Dụng
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Mọi mẫu CV đều được tính toán tỉ lệ chính xác theo khổ giấy A4, đảm bảo xuất file PDF nguyên vẹn và hiển thị hoàn hảo trên mọi thiết bị.
          </p>
        </div>

        {/* Templates Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {templatesList.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Header Visual Stripe */}
              <div className={`h-3 bg-gradient-to-r ${item.accentBg}`} />

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                    {item.name}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Highlights list */}
                  <ul className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                    {item.highlights.map((hl, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom CTA */}
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Link
                    to={`/cv/${item.sampleCvId}`}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-teal-600 hover:text-white dark:hover:bg-teal-500 dark:hover:text-white text-slate-800 dark:text-slate-200 text-xs font-bold transition-all shadow-xs cursor-pointer group"
                  >
                    <span>Xem Trực Tiếp Mẫu Này</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default TemplatesShowcaseSection;
