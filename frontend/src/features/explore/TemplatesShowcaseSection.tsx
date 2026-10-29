import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Check,
  Sparkles,
  ArrowRight,
  Layout,
  Copy,
  Users,
  Eye,
  PlusCircle,
} from 'lucide-react';
import { TEMPLATES_REGISTRY } from '../cv-templates/TemplateRegistry';
import { getCommunityTemplates, cloneCV, createNewCV } from '../../services/cvStorageService';
import { CVData } from '../../types/cv';
import { useAuthStore } from '../../stores/useAuthStore';

export const TemplatesShowcaseSection: React.FC = () => {
  const [communityTemplates, setCommunityTemplates] = useState<CVData[]>([]);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    let isMounted = true;
    getCommunityTemplates()
      .then((list) => {
        if (isMounted) {
          setCommunityTemplates(list.slice(0, 6));
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const handleUseOfficialTemplate = (templateId: string) => {
    const fresh = createNewCV(templateId, user?.uid);
    navigate(`/editor/${fresh.id}`);
  };

  const handleCloneCommunityTemplate = (cv: CVData) => {
    const cloned = cloneCV(cv, user?.uid);
    navigate(`/editor/${cloned.id}`);
  };

  const templatesList = [
    {
      id: 'template-classic-teal',
      name: 'Mẫu 1: Classic Teal',
      badge: 'ĐÃ DUYỆT (CHÍNH THỨC)',
      badgeColor:
        'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
      description:
        'Bố cục 2 cột với sidebar màu ngọc lục bảo thanh lịch. Tối ưu cho giáo dục, kỹ thuật, quản lý và các ứng viên cần tính chuẩn mực cao.',
      highlights: ['Sidebar trang nhã', 'Điểm nhấn xanh Teal', 'Hỗ trợ kéo thả thứ tự mọi mục'],
      sampleCvId: 'cv-thanhtruc-01',
      accentBg: 'from-teal-600 to-emerald-700',
    },
    {
      id: 'template-warm-bold',
      name: 'Mẫu 2: Warm Bold',
      badge: 'NĂNG ĐỘNG & SÁNG TẠO',
      badgeColor:
        'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-800',
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
      badgeColor:
        'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700',
      description:
        'Thiết kế phong cách Bắc Âu tối giản, đơn sắc tinh gọn kết hợp vạch đỏ Crimson nhấn tinh tế. Phù hợp cho AI, Data Scientist và Quản lý cấp cao.',
      highlights: ['Đơn sắc thanh lịch', 'Tập trung vào câu từ', 'Khung viền sắc nét'],
      sampleCvId: 'cv-hoangnam-ai',
      accentBg: 'from-slate-800 to-slate-900',
    },
  ];

  return (
    <section
      id="templates-showcase"
      className="py-16 sm:py-20 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* ================= PART 1: 3 OFFICIAL CORE TEMPLATES ================= */}
        <div>
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100/80 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-semibold">
              <Layout className="w-3.5 h-3.5" />
              <span>Thư Viện Mẫu CV Tuyển Dụng</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white font-display">
              3 Phong Cách Thiết Kế Chuẩn Mực Tuyển Dụng
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Mọi mẫu CV đều được tính toán tỉ lệ chính xác theo khổ giấy A4, hỗ trợ kéo thả sắp xếp
              tự do các khối và xuất file PDF nguyên vẹn trên mọi thiết bị.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {templatesList.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className={`h-3 bg-gradient-to-r ${item.accentBg}`} />

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${item.badgeColor}`}
                      >
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                      {item.name}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                      {item.description}
                    </p>

                    <ul className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                      {item.highlights.map((hl, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2">
                    <Link
                      to={`/cv/${item.sampleCvId}`}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Xem Mẫu</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleUseOfficialTemplate(item.id)}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer group"
                    >
                      <span>Tạo Từ Mẫu</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= PART 2: COMMUNITY TEMPLATES LIBRARY ================= */}
        {communityTemplates.length > 0 && (
          <div className="pt-8 border-t border-slate-200/80 dark:border-slate-800/80">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div className="space-y-2.5 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Cộng Đồng Sáng Tạo & Chia Sẻ</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
                  Mẫu CV Cộng Đồng — Nhân Bản & Dùng Thử 1-Click
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Các bố cục CV được tùy biến sẵn (đổi thứ tự khối, thêm mục Ngoại ngữ / Ấn phẩm khoa
                  học, phối màu riêng) do cộng đồng chia sẻ. Nhấn{' '}
                  <strong>"Dùng Thử Mẫu Này"</strong> để tạo ngay bản sao của riêng bạn!
                </p>
              </div>

              <Link
                to="/explore?tab=templates"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-xs transition-all shrink-0 self-start md:self-auto"
              >
                <Users className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>Xem Tất Cả Mẫu Cộng Đồng</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {communityTemplates.map((tpl) => {
                const baseMeta =
                  TEMPLATES_REGISTRY[tpl.themeConfig.templateId] ||
                  TEMPLATES_REGISTRY['template-classic-teal'];
                return (
                  <div
                    key={tpl.id}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:shadow-xl hover:border-amber-500/40 dark:hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          <span>{baseMeta.name.split(':')[0]} • Tùy Biến</span>
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                          {tpl.cloneCount || 1} lượt dùng thử
                        </span>
                      </div>

                      <h4 className="font-bold text-base text-slate-900 dark:text-white line-clamp-1">
                        {tpl.templateTitle || `${tpl.personalInfo.title} — Mẫu Cộng Đồng`}
                      </h4>

                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 line-clamp-2 leading-relaxed">
                        {tpl.templateDescription || tpl.summary}
                      </p>

                      {/* Author info */}
                      <div className="flex items-center gap-2.5 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                        <img
                          src={tpl.personalInfo.avatarUrl}
                          alt={tpl.authorName || tpl.personalInfo.fullName}
                          className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(tpl.personalInfo.fullName)}&background=0d9488&color=fff&bold=true`;
                          }}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">
                            Tác giả: {tpl.authorName || tpl.personalInfo.fullName}
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                            {tpl.personalInfo.title}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2">
                      <Link
                        to={`/cv/${tpl.id}`}
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Xem Tham Khảo</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleCloneCommunityTemplate(tpl)}
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Dùng Thử Mẫu Này</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
export default TemplatesShowcaseSection;
