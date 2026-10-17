import React, { useState, useRef, useEffect } from 'react';
import { PersonalInfo, SocialLink } from '../../../../types/cv';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Image,
  Plus,
  Trash2,
  ExternalLink,
  ChevronDown,
  X,
  Share2,
  Upload,
  Camera,
  Link2,
  Sparkles,
  AlertCircle,
  Loader2,
  Check,
} from 'lucide-react';
import { processAvatarFile, PRESET_AVATARS } from '../../../../utils/image';
import {
  SOCIAL_PLATFORMS,
  SocialIcon,
  getNormalizedSocialLinks,
  syncLegacySocialFields,
} from '../../utils/socialPlatforms';
import { VIETNAM_PROVINCES, getGoogleMapsUrl } from '../../utils/locations';
import { generateId } from '../../../../stores/useCVStore';

interface PersonalInfoSectionProps {
  personalInfo: PersonalInfo;
  onChange: (fieldOrFields: any, value?: any) => void;
}

/**
 * Chuyển đổi định dạng ngày DD/MM/YYYY sang YYYY-MM-DD cho input type="date"
 */
function toInputDate(val?: string): string {
  if (!val) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
  const parts = val.split(/[/-]/);
  if (parts.length === 3 && parts[2].length === 4) {
    const d = parts[0].padStart(2, '0');
    const m = parts[1].padStart(2, '0');
    const y = parts[2];
    return `${y}-${m}-${d}`;
  }
  return '';
}

/**
 * Chuyển đổi định dạng ngày YYYY-MM-DD từ input date sang chuẩn DD/MM/YYYY cho CV
 */
function fromInputDate(isoDate: string): string {
  if (!isoDate) return '';
  const parts = isoDate.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return isoDate;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  personalInfo,
  onChange,
}) => {
  // Quản lý dropdown Tỉnh/Thành
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const locationDropdownRef = useRef<HTMLDivElement>(null);

  // Quản lý upload ảnh đại diện
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Xử lý tệp ảnh được chọn (từ file picker hoặc drop)
  const handleFileSelect = async (file?: File | null) => {
    if (!file) return;
    setUploadError(null);
    setIsUploading(true);
    try {
      const dataUrl = await processAvatarFile(file, {
        targetSize: 400,
        quality: 0.88,
      });
      onChange('avatarUrl', dataUrl);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Lỗi khi xử lý ảnh đại diện.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    if (e.target) e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  // Social Links động (giữ nguyên các liên kết đang soạn thảo, không filter rỗng)
  const socialLinks: SocialLink[] = getNormalizedSocialLinks(personalInfo, false);

  // Đóng dropdown vị trí khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (
        locationDropdownRef.current &&
        !locationDropdownRef.current.contains(e.target as Node)
      ) {
        setShowLocationDropdown(false);
      }
    };
    if (showLocationDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLocationDropdown]);

  // Bộ lọc Tỉnh/Thành
  const filteredProvinces = VIETNAM_PROVINCES.filter((p) =>
    p.toLowerCase().includes(locationSearch.toLowerCase().trim())
  );

  const handleSelectProvince = (province: string) => {
    onChange('location', province);
    setShowLocationDropdown(false);
    setLocationSearch('');
  };

  // Cập nhật ngày sinh
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = fromInputDate(e.target.value);
    onChange('birthday', formatted);
  };

  // Hàm đồng bộ danh sách mạng xã hội và legacy fields
  const commitSocialLinks = (updated: SocialLink[]) => {
    const legacy = syncLegacySocialFields(updated);
    // Cập nhật đồng bộ cả socialLinks lẫn legacy fields
    onChange({
      socialLinks: updated,
      ...legacy,
    });
  };

  // Thêm một liên kết mạng xã hội mới
  const handleAddSocialLink = () => {
    const newLink: SocialLink = {
      id: generateId('social'),
      platform: 'github',
      url: '',
    };
    const updated = [...socialLinks, newLink];
    commitSocialLinks(updated);
  };

  // Cập nhật một liên kết mạng xã hội
  const handleUpdateSocialLink = (
    index: number,
    field: keyof SocialLink,
    value: string
  ) => {
    const updated = [...socialLinks];
    updated[index] = { ...updated[index], [field]: value };
    commitSocialLinks(updated);
  };

  // Xóa liên kết mạng xã hội
  const handleRemoveSocialLink = (index: number) => {
    const updated = socialLinks.filter((_, i) => i !== index);
    commitSocialLinks(updated);
  };

  return (
    <div className="space-y-4">
      {/* 1. Avatar Preview & Upload Box */}
      <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Avatar Thumbnail with Camera Hover & Click */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative group cursor-pointer w-20 h-20 rounded-2xl overflow-hidden shrink-0 border-2 transition-all ${
              isDragOver
                ? 'border-teal-500 scale-105 shadow-lg shadow-teal-500/20'
                : 'border-slate-200 dark:border-slate-700 hover:border-teal-500'
            }`}
            title="Nhấn để tải ảnh hoặc kéo thả ảnh vào đây"
          >
            {personalInfo.avatarUrl ? (
              <img
                src={personalInfo.avatarUrl}
                alt={personalInfo.fullName || 'Avatar'}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-slate-200 dark:bg-slate-700 flex flex-col items-center justify-center text-slate-400">
                <Camera className="w-6 h-6 mb-1 text-slate-400" />
                <span className="text-[10px] font-medium">Chọn ảnh</span>
              </div>
            )}

            {/* Overlay on hover or loading */}
            <div
              className={`absolute inset-0 bg-black/50 backdrop-blur-xs flex flex-col items-center justify-center transition-opacity ${
                isUploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}
            >
              {isUploading ? (
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              ) : (
                <>
                  <Camera className="w-4 h-4 text-white mb-0.5" />
                  <span className="text-[9px] text-white font-medium">Đổi ảnh</span>
                </>
              )}
            </div>
          </div>

          {/* Action buttons & Details */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  Ảnh Đại Diện Cá Nhân
                </label>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Tải ảnh từ máy (tự động crop vuông 1:1, nén nhẹ &lt; 40kB).
                </p>
              </div>

              {personalInfo.avatarUrl && (
                <button
                  type="button"
                  onClick={() => {
                    onChange('avatarUrl', '');
                    setUploadError(null);
                  }}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-500 hover:text-rose-600 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Xóa ảnh</span>
                </button>
              )}
            </div>

            {/* Action buttons toolbar */}
            <div className="flex flex-wrap items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={handleInputChange}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{isUploading ? 'Đang xử lý...' : 'Tải Ảnh Từ Máy'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowPresets(!showPresets);
                  setShowUrlInput(false);
                }}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                  showPresets
                    ? 'bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Chọn Mẫu Có Sẵn</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowUrlInput(!showUrlInput);
                  setShowPresets(false);
                }}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                  showUrlInput
                    ? 'bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Link2 className="w-3.5 h-3.5" />
                <span>Dán Link URL</span>
              </button>
            </div>
          </div>
        </div>

        {/* Error message banner */}
        {uploadError && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span className="flex-1">{uploadError}</span>
            <button
              type="button"
              onClick={() => setUploadError(null)}
              className="text-rose-400 hover:text-rose-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Collapsible Presets Gallery */}
        {showPresets && (
          <div className="pt-2 border-t border-slate-200/80 dark:border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                Chọn avatar mẫu chuyên nghiệp:
              </span>
              <button
                type="button"
                onClick={() => setShowPresets(false)}
                className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                Đóng
              </button>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {PRESET_AVATARS.map((preset) => {
                const isSelected = personalInfo.avatarUrl === preset.url;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      onChange('avatarUrl', preset.url);
                      setUploadError(null);
                    }}
                    className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all group cursor-pointer ${
                      isSelected
                        ? 'border-teal-500 ring-2 ring-teal-500/30'
                        : 'border-slate-200 dark:border-slate-700 hover:border-teal-400'
                    }`}
                    title={preset.label}
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-teal-600/40 backdrop-blur-[1px] flex items-center justify-center">
                        <Check className="w-4 h-4 text-white font-bold" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Collapsible URL Input Field */}
        {showUrlInput && (
          <div className="pt-2 border-t border-slate-200/80 dark:border-slate-700/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                Đường dẫn ảnh trực tiếp (Direct URL):
              </label>
              <button
                type="button"
                onClick={() => setShowUrlInput(false)}
                className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                Đóng
              </button>
            </div>
            <div className="relative">
              <Link2 className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={personalInfo.avatarUrl}
                onChange={(e) => {
                  onChange('avatarUrl', e.target.value);
                  setUploadError(null);
                }}
                placeholder="https://images.unsplash.com/... hoặc link ảnh bất kỳ"
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        )}
      </div>

      {/* 2. Họ Tên & Chức Danh */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Họ và Tên *
          </label>
          <div className="relative">
            <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={personalInfo.fullName}
              onChange={(e) => onChange('fullName', e.target.value)}
              placeholder="Trần Anh Khôi"
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500 font-semibold text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Chức Danh / Vị Trí *
          </label>
          <input
            type="text"
            value={personalInfo.title}
            onChange={(e) => onChange('title', e.target.value)}
            placeholder="Senior Full-stack Developer"
            className="w-full px-3 py-2 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* 3. Email & Số Điện Thoại */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Email Liên Hệ
          </label>
          <div className="relative">
            <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              value={personalInfo.email}
              onChange={(e) => onChange('email', e.target.value)}
              placeholder="email@example.com"
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Số Điện Thoại
          </label>
          <div className="relative">
            <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={personalInfo.phone}
              onChange={(e) => onChange('phone', e.target.value)}
              placeholder="0912 345 678"
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* 4. Địa Chỉ / Tỉnh Thành & Ngày Sinh */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Địa chỉ với dropdown 63 Tỉnh/Thành & Mở Google Maps */}
        <div className="relative" ref={locationDropdownRef}>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Địa Chỉ / Tỉnh Thành
            </label>
            {personalInfo.location && (
              <a
                href={getGoogleMapsUrl(personalInfo.location)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-semibold text-teal-600 dark:text-teal-400 hover:underline inline-flex items-center gap-0.5"
                title="Mở định vị vị trí trên Google Maps"
              >
                <span>Mở Bản Đồ</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            )}
          </div>

          <div className="relative flex items-center">
            <MapPin className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
            <input
              type="text"
              value={personalInfo.location}
              onChange={(e) => onChange('location', e.target.value)}
              placeholder="Quận 1, TP. Hồ Chí Minh"
              className="w-full pl-9 pr-8 py-2 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-900 dark:text-white"
            />
            {/* Nút mở dropdown tỉnh thành */}
            <button
              type="button"
              onClick={() => setShowLocationDropdown((prev) => !prev)}
              className="absolute right-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md transition-colors cursor-pointer"
              title="Chọn nhanh từ danh sách 63 Tỉnh/Thành Việt Nam"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Dropdown danh sách Tỉnh/Thành */}
          {showLocationDropdown && (
            <div className="absolute left-0 top-full mt-1.5 w-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl z-50 overflow-hidden max-h-56 flex flex-col animate-in fade-in zoom-in-95 duration-150">
              <div className="p-2 border-b border-slate-100 dark:border-slate-800">
                <input
                  type="text"
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  placeholder="Tìm kiếm tỉnh/thành phố..."
                  className="w-full px-2.5 py-1 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                  autoFocus
                />
              </div>
              <div className="overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 p-1">
                {filteredProvinces.length > 0 ? (
                  filteredProvinces.map((prov) => (
                    <button
                      key={prov}
                      type="button"
                      onClick={() => handleSelectProvince(prov)}
                      className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-teal-950/50 hover:text-teal-700 dark:hover:text-teal-300 rounded-lg transition-colors cursor-pointer flex items-center justify-between"
                    >
                      <span>{prov}</span>
                      {personalInfo.location?.includes(prov) && (
                        <span className="text-[10px] text-teal-600 font-bold">Đã chọn</span>
                      )}
                    </button>
                  ))
                ) : (
                  <p className="text-center py-3 text-xs text-slate-400">
                    Không tìm thấy tỉnh/thành phù hợp
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Ngày sinh với Form chọn ngày (Calendar Picker) */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Ngày Sinh
            </label>
            {personalInfo.birthday && (
              <span className="text-[10px] font-medium text-slate-400">
                {personalInfo.birthday}
              </span>
            )}
          </div>
          <div className="relative flex items-center">
            <Calendar className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="date"
              value={toInputDate(personalInfo.birthday)}
              onChange={handleDateChange}
              className="w-full pl-9 pr-8 py-2 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-900 dark:text-white cursor-pointer"
            />
            {personalInfo.birthday && (
              <button
                type="button"
                onClick={() => onChange('birthday', '')}
                className="absolute right-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 transition-colors cursor-pointer"
                title="Xóa ngày sinh"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 5. Danh Sách Mạng Xã Hội & Kênh Liên Hệ Tùy Biến */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between mb-2.5">
          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
              Mạng Xã Hội & Kênh Thông Tin ({socialLinks.length})
            </label>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Thêm các kênh phù hợp với chuyên môn của bạn (GitHub, LinkedIn, Behance, v.v.)
            </p>
          </div>
          <button
            type="button"
            id="btn-add-social-link"
            onClick={handleAddSocialLink}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/60 text-teal-700 dark:text-teal-300 border border-teal-200/80 dark:border-teal-800/80 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm Kênh</span>
          </button>
        </div>

        {/* Dynamic Social Links List */}
        {socialLinks.length > 0 ? (
          <div className="space-y-2">
            {socialLinks.map((link, idx) => {
              const platformMeta =
                SOCIAL_PLATFORMS.find((p) => p.id === link.platform) ||
                SOCIAL_PLATFORMS[SOCIAL_PLATFORMS.length - 1];

              return (
                <div
                  key={link.id || idx}
                  className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/70"
                >
                  {/* Platform selector */}
                  <div className="relative shrink-0">
                    <select
                      value={link.platform}
                      onChange={(e) =>
                        handleUpdateSocialLink(idx, 'platform', e.target.value)
                      }
                      className="appearance-none pl-8 pr-6 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
                    >
                      {SOCIAL_PLATFORMS.map((plat) => (
                        <option
                          key={plat.id}
                          value={plat.id}
                          className="dark:bg-slate-900 text-slate-900 dark:text-white"
                        >
                          {plat.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-teal-600 dark:text-teal-400">
                      <SocialIcon platform={link.platform} className="w-3.5 h-3.5" />
                    </div>
                    <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>

                  {/* URL Input */}
                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      value={link.url}
                      onChange={(e) => handleUpdateSocialLink(idx, 'url', e.target.value)}
                      placeholder={platformMeta.placeholder}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
                    />
                  </div>

                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveSocialLink(idx)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors shrink-0 cursor-pointer"
                    title="Xóa kênh này"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-4 px-3 rounded-xl border border-dashed border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-800/30">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Chưa có kênh liên kết nào. Nhấn <strong>"Thêm Kênh"</strong> để bổ sung GitHub, LinkedIn, Behance, Facebook, v.v.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default PersonalInfoSection;
