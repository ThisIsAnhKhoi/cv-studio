import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Compass,
  Search,
  Sparkles,
  SearchX,
  Loader2,
  TrendingUp,
  Clock,
  ArrowUpDown,
  RotateCcw,
  Layers,
} from 'lucide-react';
import { ProfileCard } from '../features/explore/ProfileCard';
import { getExploreCVs } from '../services/cvStorageService';
import { CVData, CVCategory, CV_CATEGORIES } from '../types/cv';
import { removeVietnameseTones, stripHtml } from '../utils/text';
import { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';

export const ExplorePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read URL params with fallbacks
  const initialCategory = (searchParams.get('category') as CVCategory | 'all') || 'all';
  const initialSort = (searchParams.get('sort') as 'views' | 'newest') || 'views';
  const initialQuery = searchParams.get('q') || '';

  const [selectedCategory, setSelectedCategory] = useState<CVCategory | 'all'>(initialCategory);
  const [selectedSort, setSelectedSort] = useState<'views' | 'newest'>(initialSort);
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);

  const [profiles, setProfiles] = useState<CVData[]>([]);
  const [cursor, setCursor] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  // Sync state to URL search params
  const updateUrlParams = useCallback(
    (cat: string, sort: string, q: string) => {
      const params = new URLSearchParams();
      if (cat && cat !== 'all') params.set('category', cat);
      if (sort && sort !== 'views') params.set('sort', sort);
      if (q && q.trim()) params.set('q', q.trim());
      setSearchParams(params, { replace: true });
    },
    [setSearchParams]
  );

  // Initial load or when category/sort changes
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    getExploreCVs({
      category: selectedCategory,
      sort: selectedSort,
      cursor: null,
      limitCount: 24,
    })
      .then((res) => {
        if (!isMounted) return;
        setProfiles(res.cvs);
        setCursor(res.lastVisible);
        setHasMore(res.hasMore);
        setIsLoading(false);
      })
      .catch((err) => {
        console.warn('Lỗi khi tải danh sách CV khám phá:', err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedCategory, selectedSort]);

  // Handle Load More pagination
  const handleLoadMore = async () => {
    if (!cursor || isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);

    try {
      const res = await getExploreCVs({
        category: selectedCategory,
        sort: selectedSort,
        cursor,
        limitCount: 24,
      });

      setProfiles((prev) => [...prev, ...res.cvs]);
      setCursor(res.lastVisible);
      setHasMore(res.hasMore);
    } catch (err) {
      console.warn('Lỗi khi tải thêm CV:', err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Instant filter using removeVietnameseTones
  const filteredProfiles = useMemo(() => {
    if (!searchQuery.trim()) return profiles;

    const queryNormalized = removeVietnameseTones(searchQuery);

    return profiles.filter((p) => {
      const nameNorm = removeVietnameseTones(p.personalInfo.fullName);
      const titleNorm = removeVietnameseTones(p.personalInfo.title);
      const locationNorm = removeVietnameseTones(p.personalInfo.location);
      const summaryNorm = removeVietnameseTones(stripHtml(p.summary));
      const skillsNorm = removeVietnameseTones(
        p.skillCategories.flatMap((c) => c.skills.map((s) => s.name)).join(' ')
      );

      return (
        nameNorm.includes(queryNormalized) ||
        titleNorm.includes(queryNormalized) ||
        locationNorm.includes(queryNormalized) ||
        skillsNorm.includes(queryNormalized) ||
        summaryNorm.includes(queryNormalized)
      );
    });
  }, [profiles, searchQuery]);

  const handleCategoryChange = (cat: CVCategory | 'all') => {
    setSelectedCategory(cat);
    updateUrlParams(cat, selectedSort, searchQuery);
  };

  const handleSortChange = (sort: 'views' | 'newest') => {
    setSelectedSort(sort);
    updateUrlParams(selectedCategory, sort, searchQuery);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    updateUrlParams(selectedCategory, selectedSort, val);
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedSort('views');
    setSearchQuery('');
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100/80 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 text-xs font-semibold">
            <Compass className="w-3.5 h-3.5" />
            <span>Danh Bạ Ứng Viên Công Khai</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight">
            Khám Phá Hồ Sơ & Portfolio
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            Tìm kiếm ứng viên tài năng theo chuyên ngành, trải nghiệm xem CV trực tuyến chuẩn A4, và học hỏi cách trình bày hồ sơ chuyên nghiệp.
          </p>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
          {/* Search Input & Sort Selector */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Tìm kiếm theo họ tên, chức danh, kỹ năng (ví dụ: React, UI/UX, Python)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-xs sm:text-sm placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => handleSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  Xóa
                </button>
              )}
            </div>

            {/* Sort Toggle */}
            <div className="flex items-center gap-1.5 shrink-0 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => handleSortChange('views')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedSort === 'views'
                    ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Xem Nhiều Nhất</span>
              </button>
              <button
                type="button"
                onClick={() => handleSortChange('newest')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedSort === 'newest'
                    ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Mới Cập Nhật</span>
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
            <button
              type="button"
              onClick={() => handleCategoryChange('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Tất Cả Ngành Nghề
            </button>
            {CV_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat.shortLabel}
              </button>
            ))}
          </div>
        </div>

        {/* Status / Loading State */}
        {isLoading ? (
          <div className="py-24 text-center">
            <Loader2 className="w-8 h-8 text-teal-600 animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              Đang tải danh bạ ứng viên...
            </p>
          </div>
        ) : filteredProfiles.length > 0 ? (
          <>
            {/* Grid of Profile Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProfiles.map((cv) => (
                <ProfileCard key={cv.id} cv={cv} />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="pt-8 text-center">
                <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-teal-500 text-sm font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {isLoadingMore ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
                      <span>Đang tải thêm...</span>
                    </>
                  ) : (
                    <>
                      <Layers className="w-4 h-4 text-teal-600" />
                      <span>Tải Thêm Hồ Sơ Khác</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {!hasMore && profiles.length > 0 && (
              <p className="text-center text-xs font-semibold text-slate-400 pt-8">
                Bạn đã xem hết toàn bộ hồ sơ trong danh mục này.
              </p>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-20 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <SearchX className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Không tìm thấy hồ sơ nào phù hợp
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Không có ứng viên nào khớp với từ khóa "{searchQuery}" hoặc danh mục bạn đã chọn.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-5 inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/60 border border-teal-200 dark:border-teal-800 rounded-xl transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Đặt Lại Bộ Lọc & Tìm Kiếm</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default ExplorePage;
