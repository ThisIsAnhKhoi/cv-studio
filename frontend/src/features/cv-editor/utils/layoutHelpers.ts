import { LayoutConfig, SectionId, SectionStyleConfig, ThemeConfig } from '../../../types/cv';

export const MOVABLE_SECTIONS: SectionId[] = [
  'contact',
  'summary',
  'experience',
  'education',
  'skills',
  'projects',
  'achievements',
  'certificates',
];

export const DEFAULT_SIDEBAR_SECTIONS: SectionId[] = [
  'contact',
  'education',
  'skills',
  'certificates',
];

export const DEFAULT_MAIN_SECTIONS: SectionId[] = [
  'summary',
  'experience',
  'projects',
  'achievements',
];

export interface SectionMetadataItem {
  id: SectionId;
  label: string;
  defaultTitle: string;
  defaultColumn: 'sidebar' | 'main';
  description: string;
}

export const SECTION_METADATA: Record<SectionId, SectionMetadataItem> = {
  header: {
    id: 'header',
    label: 'Họ Tên & Tiêu Đề Đầu Trang',
    defaultTitle: 'Họ Tên & Chức Danh',
    defaultColumn: 'main',
    description: 'Ảnh đại diện, họ tên, vị trí ứng tuyển và thông tin cơ bản trên cùng',
  },
  contact: {
    id: 'contact',
    label: 'Thông Tin Liên Hệ & Mạng Xã Hội',
    defaultTitle: 'Thông Tin Liên Hệ',
    defaultColumn: 'sidebar',
    description: 'Email, số điện thoại và danh sách liên kết mạng xã hội / portfolio',
  },
  summary: {
    id: 'summary',
    label: 'Giới Thiệu Bản Thân',
    defaultTitle: 'Giới Thiệu Bản Thân',
    defaultColumn: 'main',
    description: 'Đoạn văn tóm tắt năng lực cốt lõi và mục tiêu nghề nghiệp',
  },
  experience: {
    id: 'experience',
    label: 'Kinh Nghiệm Làm Việc',
    defaultTitle: 'Kinh Nghiệm Làm Việc',
    defaultColumn: 'main',
    description: 'Lịch sử công tác, vị trí đảm nhiệm và thành tích đạt được',
  },
  education: {
    id: 'education',
    label: 'Học Vấn & Bằng Cấp',
    defaultTitle: 'Học Vấn',
    defaultColumn: 'sidebar',
    description: 'Trường đại học, chuyên ngành đào tạo, niên khóa và điểm GPA',
  },
  skills: {
    id: 'skills',
    label: 'Kỹ Năng Chuyên Môn',
    defaultTitle: 'Kỹ Năng',
    defaultColumn: 'sidebar',
    description: 'Các nhóm kỹ năng công nghệ, chuyên môn và kỹ năng mềm',
  },
  projects: {
    id: 'projects',
    label: 'Dự Án Tiêu Biểu',
    defaultTitle: 'Dự Án Tiêu Biểu',
    defaultColumn: 'main',
    description: 'Các dự án thực tế, vai trò, công nghệ sử dụng và liên kết demo',
  },
  achievements: {
    id: 'achievements',
    label: 'Thành Tựu & Giải Thưởng',
    defaultTitle: 'Thành Tựu & Giải Thưởng',
    defaultColumn: 'main',
    description: 'Giải thưởng, học bổng và các danh hiệu vinh danh nổi bật',
  },
  certificates: {
    id: 'certificates',
    label: 'Chứng Chỉ Chuyên Ngành',
    defaultTitle: 'Chứng Chỉ',
    defaultColumn: 'sidebar',
    description: 'Các chứng chỉ quốc tế, khóa học chuyên sâu và giấy phép hành nghề',
  },
};

/**
 * Pure, immutable array reordering utility.
 * Never throws; returns a shallow copy if indices are out of bounds.
 */
export function reorderArray<T>(list: T[], startIndex: number, endIndex: number): T[] {
  if (!Array.isArray(list)) return [];
  const result = [...list];
  if (
    startIndex < 0 ||
    startIndex >= result.length ||
    endIndex < 0 ||
    endIndex >= result.length ||
    startIndex === endIndex
  ) {
    return result;
  }
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

/**
 * Returns default layout config for a template.
 */
export function getDefaultLayoutConfig(_templateId?: string): LayoutConfig {
  return {
    sidebarSections: [...DEFAULT_SIDEBAR_SECTIONS],
    mainSections: [...DEFAULT_MAIN_SECTIONS],
    hiddenSections: [],
  };
}

/**
 * Safely resolves and reconciles a LayoutConfig from ThemeConfig.
 * Ensures all 8 movable sections are accounted for with zero duplicates or data loss.
 */
export function resolveLayoutConfig(theme?: Partial<ThemeConfig> | null): LayoutConfig {
  const fallback = getDefaultLayoutConfig(theme?.templateId);
  const raw = theme?.layoutConfig;
  if (!raw || typeof raw !== 'object') {
    return fallback;
  }

  const validSet = new Set<SectionId>(MOVABLE_SECTIONS);
  const seen = new Set<SectionId>();

  const sidebarSections: SectionId[] = [];
  if (Array.isArray(raw.sidebarSections)) {
    for (const id of raw.sidebarSections) {
      if (validSet.has(id) && !seen.has(id)) {
        seen.add(id);
        sidebarSections.push(id);
      }
    }
  }

  const mainSections: SectionId[] = [];
  if (Array.isArray(raw.mainSections)) {
    for (const id of raw.mainSections) {
      if (validSet.has(id) && !seen.has(id)) {
        seen.add(id);
        mainSections.push(id);
      }
    }
  }

  // Reconcile any missing sections so no section ever disappears due to corrupted config
  for (const secId of MOVABLE_SECTIONS) {
    if (!seen.has(secId)) {
      seen.add(secId);
      if (DEFAULT_SIDEBAR_SECTIONS.includes(secId)) {
        sidebarSections.push(secId);
      } else {
        mainSections.push(secId);
      }
    }
  }

  const hiddenSections: SectionId[] = [];
  const seenHidden = new Set<SectionId>();
  if (Array.isArray(raw.hiddenSections)) {
    for (const id of raw.hiddenSections) {
      if (validSet.has(id) && !seenHidden.has(id)) {
        seenHidden.add(id);
        hiddenSections.push(id);
      }
    }
  }

  return {
    sidebarSections,
    mainSections,
    hiddenSections,
  };
}

/**
 * Helper to get the display title of a section (supports custom user-defined title or fallback).
 */
export function getSectionTitle(
  sectionId: SectionId,
  sectionStyles?: Partial<Record<SectionId, SectionStyleConfig>>,
  fallbackOverride?: string
): string {
  const custom = sectionStyles?.[sectionId]?.customTitle?.trim();
  if (custom) return custom;
  if (fallbackOverride) return fallbackOverride;
  return SECTION_METADATA[sectionId]?.defaultTitle || sectionId;
}

/**
 * Checks if a section is currently visible according to resolved LayoutConfig.
 */
export function isSectionVisible(sectionId: SectionId, layout: LayoutConfig): boolean {
  return !layout.hiddenSections.includes(sectionId);
}

