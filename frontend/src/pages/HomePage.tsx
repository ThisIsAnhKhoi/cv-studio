import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HeroSection } from '../features/explore/HeroSection';
import { SearchFilterBar } from '../features/explore/SearchFilterBar';
import { ProfileCard } from '../features/explore/ProfileCard';
import { TemplatesShowcaseSection } from '../features/explore/TemplatesShowcaseSection';
import { mockProfilesList } from '../data/mockProfiles';
import { getTopViewedCVs } from '../services/cvStorageService';
import { CVData } from '../types/cv';
import { stripHtml, removeVietnameseTones } from '../utils/text';
import { Users, Sparkles, FileText, CheckCircle, SearchX, Loader2, ArrowRight, Compass } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [profiles, setProfiles] = useState<CVData[]>(mockProfilesList.slice(0, 6));
  const [isLoadingProfiles, setIsLoadingProfiles] = useState<boolean>(true);

  // Load Top 6 most viewed public CVs from Firestore (saving 90% Firestore read quota)
  useEffect(() => {
    let isMounted = true;
    getTopViewedCVs(6)
      .then((topList) => {
        if (isMounted) {
          if (topList && topList.length > 0) {
            setProfiles(topList);
          }
          setIsLoadingProfiles(false);
        }
      })
      .catch((err) => {
        console.warn('Lỗi khi tải hồ sơ xem nhiều nhất:', err);
        if (isMounted) setIsLoadingProfiles(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter profiles based on query and category
  const filteredProfiles = useMemo(() => {
    return profiles.filter((profile) => {
      // 1. Category filter
      if (selectedCategory !== 'all') {
        if (profile.category) {
          if (profile.category !== selectedCategory) return false;
        } else {
          const titleLower = profile.personalInfo.title.toLowerCase();
          const skillsLower = profile.skillCategories
            .flatMap((c) => c.skills.map((s) => s.name.toLowerCase()))
            .join(' ');

          if (selectedCategory === 'tech') {
            const isTech =
              titleLower.includes('developer') ||
              titleLower.includes('lập trình') ||
              titleLower.includes('engineer') ||
              titleLower.includes('mobile');
            if (!isTech) return false;
          } else if (selectedCategory === 'design') {
            const isDesign =
              titleLower.includes('designer') ||
              titleLower.includes('thiết kế') ||
              titleLower.includes('ux');
            if (!isDesign) return false;
          } else if (selectedCategory === 'data-ai') {
            const isAI =
              titleLower.includes('data') ||
              titleLower.includes('ai') ||
              skillsLower.includes('pytorch') ||
              skillsLower.includes('machine learning');
            if (!isAI) return false;
          } else if (selectedCategory === 'marketing') {
            const isMarketing =
              titleLower.includes('marketing') || titleLower.includes('growth');
            if (!isMarketing) return false;
          } else if (selectedCategory === 'hr') {
            const isHR =
              titleLower.includes('hr') ||
              titleLower.includes('talent') ||
              titleLower.includes('nhân sự');
            if (!isHR) return false;
          }
        }
      }

      // 2. Search query filter with Vietnamese tone removal
      if (searchQuery.trim()) {
        const qNorm = removeVietnameseTones(searchQuery);
        const nameNorm = removeVietnameseTones(profile.personalInfo.fullName);
        const titleNorm = removeVietnameseTones(profile.personalInfo.title);
        const locationNorm = removeVietnameseTones(profile.personalInfo.location);
        const skillsNorm = removeVietnameseTones(
          profile.skillCategories.flatMap((c) => c.skills.map((s) => s.name)).join(' ')
        );
        const summaryNorm = removeVietnameseTones(stripHtml(profile.summary));

        return (
          nameNorm.includes(qNorm) ||
          titleNorm.includes(qNorm) ||
          locationNorm.includes(qNorm) ||
          skillsNorm.includes(qNorm) ||
          summaryNorm.includes(qNorm)
        );
      }

      return true;
    });
  }, [profiles, searchQuery, selectedCategory]);

  return (
    <div className="space-y-0">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Top 6 Showcase Directory Section */}
      <section id="directory-section" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100/70 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 text-xs font-semibold mb-2">
                <Users className="w-3.5 h-3.5" />
                <span>Top 6 Hồ Sơ Xem Nhiều Nhất</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
                Ứng Viên Tiêu Biểu & Portfolio Xuất Sắc
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
                Những hồ sơ được quan tâm nhiều nhất trong tuần. Bấm "Khám Phá Toàn Bộ" để xem danh bạ đầy đủ theo từng ngành nghề.
              </p>
            </div>
            {isLoadingProfiles && (
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-600" />
                <span>Đang đồng bộ Top 6 xem nhiều...</span>
              </div>
            )}
          </div>

          {/* Search & Category Filter Bar */}
          <SearchFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            totalCount={profiles.length}
            filteredCount={filteredProfiles.length}
          />

          {/* Profile Cards Grid (Top 6) */}
          {filteredProfiles.length > 0 ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                {filteredProfiles.map((cv) => (
                  <ProfileCard key={cv.id} cv={cv} />
                ))}
              </div>

              {/* Call to action: Explore all CVs */}
              <div className="text-center pt-4">
                <Link
                  to="/explore"
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-sm shadow-lg shadow-teal-700/20 hover:shadow-teal-700/30 active:scale-95 transition-all cursor-pointer"
                >
                  <Compass className="w-4 h-4" />
                  <span>Khám Phá Toàn Bộ Danh Bạ Hồ Sơ & Bộ Lọc Nâng Cao</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <SearchX className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                Không tìm thấy hồ sơ phù hợp trong Top xem nhiều
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                Hãy thử đặt lại từ khóa tìm kiếm hoặc chuyển sang trang Khám Phá để tìm kiếm trên toàn bộ cơ sở dữ liệu.
              </p>
              <div className="mt-4 flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  Đặt lại bộ lọc
                </button>
                <Link
                  to="/explore"
                  className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors"
                >
                  Đến trang Khám Phá
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3. 3-Templates Showcase */}
      <TemplatesShowcaseSection />

      {/* 4. Value / Features Section */}
      <section id="features-section" className="py-16 sm:py-20 border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Tiêu Chuẩn Đẳng Cấp
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
              Tại Sao CV Studio Là Nền Tảng Hàng Đầu?
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Được thiết kế dựa trên khảo sát thực tế các tiêu chuẩn tuyển dụng khắt khe và công nghệ web hiện đại.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold">
                A4
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Khổ Giấy A4 Chuẩn Tuyệt Đối
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Tỷ lệ 210mm × 297mm chính xác từng milimet. Khi in ấn (Ctrl + P) hoặc xuất PDF không bao giờ bị đứt trang, nhảy dòng hay tràn viền.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
                VN
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Typography Tiếng Việt 100%
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Hỗ trợ cả font chữ cục bộ trên máy tính lẫn bộ font tự đóng gói (Self-hosted Web Fonts), đảm bảo dấu tiếng Việt chuẩn đẹp trên mọi máy và khi deploy Vercel.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold">
                PDF
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Xuất PDF 1-Click Tức Thì
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Tích hợp công nghệ chụp trang vector độ phân giải cao 2x. Bấm 1 nút là tải ngay file .pdf chất lượng in sắc nét về máy mà không cần thao tác phức tạp.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default HomePage;
