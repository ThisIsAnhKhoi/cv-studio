import { create } from 'zustand';
import {
  CVData,
  PersonalInfo,
  ExperienceItem,
  EducationItem,
  SkillCategory,
  ProjectItem,
  AchievementItem,
  CertificateItem,
  ThemeConfig,
  ColorPreset,
  HeadingFontOption,
  SectionId,
  SectionStyleConfig,
  CustomSection,
  CustomSectionItem,
} from '../types/cv';
import { mockCVData } from '../data/mockCVData';
import {
  reorderArray,
  resolveLayoutConfig,
  getDefaultLayoutConfig,
} from '../features/cv-editor/utils/layoutHelpers';

export type SaveStatus = 'saved' | 'saving' | 'unsaved';
export type { SectionId, SectionStyleConfig };

export const getDraftStorageKey = (id?: string) =>
  id ? `cv_studio_draft_${id}` : 'cv_studio_draft_cv';

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
}

export interface CVState {
  cvData: CVData;
  saveStatus: SaveStatus;
  activeSection: string;

  // Actions
  loadCV: (data: CVData) => void;
  setSaveStatus: (status: SaveStatus) => void;
  setActiveSection: (section: string) => void;

  // Updaters
  updateVisibility: (isPublic: boolean) => void;
  updatePersonalInfo: (
    fieldOrFields: keyof PersonalInfo | Partial<PersonalInfo>,
    value?: any
  ) => void;
  updateSummary: (summary: string) => void;

  // Experience
  addExperience: () => void;
  updateExperience: (id: string, field: keyof ExperienceItem, value: any) => void;
  removeExperience: (id: string) => void;
  reorderExperiences: (startIndex: number, endIndex: number) => void;
  addExperienceDescription: (expId: string) => void;
  updateExperienceDescription: (expId: string, descIndex: number, text: string) => void;
  removeExperienceDescription: (expId: string, descIndex: number) => void;

  // Education
  addEducation: () => void;
  updateEducation: (id: string, field: keyof EducationItem, value: any) => void;
  removeEducation: (id: string) => void;
  reorderEducations: (startIndex: number, endIndex: number) => void;

  // Skills
  addSkillCategory: () => void;
  updateSkillCategoryName: (catId: string, name: string) => void;
  removeSkillCategory: (catId: string) => void;
  reorderSkillCategories: (startIndex: number, endIndex: number) => void;
  addSkillToCategory: (catId: string, skillName: string) => void;
  removeSkillFromCategory: (catId: string, skillIndex: number) => void;
  reorderSkillsInCategory: (catId: string, startIndex: number, endIndex: number) => void;

  // Projects
  addProject: () => void;
  updateProject: (id: string, field: keyof ProjectItem, value: any) => void;
  removeProject: (id: string) => void;
  reorderProjects: (startIndex: number, endIndex: number) => void;

  // Achievements
  addAchievement: () => void;
  updateAchievement: (id: string, field: keyof AchievementItem, value: any) => void;
  removeAchievement: (id: string) => void;
  reorderAchievements: (startIndex: number, endIndex: number) => void;

  // Certificates
  addCertificate: () => void;
  updateCertificate: (id: string, field: keyof CertificateItem, value: any) => void;
  removeCertificate: (id: string) => void;
  reorderCertificates: (startIndex: number, endIndex: number) => void;

  // Custom Sections (Tự Build Khối Tùy Chỉnh)
  addCustomSection: (title?: string, column?: 'sidebar' | 'main') => void;
  updateCustomSection: (sectionId: string, updates: Partial<CustomSection>) => void;
  removeCustomSection: (sectionId: string) => void;
  reorderCustomSections: (startIndex: number, endIndex: number) => void;
  addCustomSectionItem: (sectionId: string) => void;
  updateCustomSectionItem: (
    sectionId: string,
    itemId: string,
    field: keyof CustomSectionItem,
    value: string
  ) => void;
  removeCustomSectionItem: (sectionId: string, itemId: string) => void;
  reorderCustomSectionItems: (sectionId: string, startIndex: number, endIndex: number) => void;

  // Theme, Section Customization & Layout Reorder
  updateTheme: (updates: Partial<ThemeConfig>) => void;
  updateSectionStyle: (sectionId: SectionId, style: Partial<SectionStyleConfig>) => void;
  resetSectionStyle: (sectionId: SectionId) => void;
  resetAllSectionStyles: () => void;
  applyStyleToAllSections: (style: SectionStyleConfig) => void;
  reorderSectionInColumn: (
    column: 'sidebar' | 'main',
    startIndex: number,
    endIndex: number
  ) => void;
  moveSectionToColumn: (
    sectionId: SectionId,
    targetColumn: 'sidebar' | 'main',
    targetIndex?: number
  ) => void;
  toggleSectionVisibility: (sectionId: SectionId) => void;
  resetLayoutConfig: () => void;

  // Reset
  resetToDefault: (presetData?: CVData) => void;
}

// Timer references for debounce auto-save
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let savedTransitionTimer: ReturnType<typeof setTimeout> | null = null;

export const clearAutoSaveTimers = () => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }
  if (savedTransitionTimer) {
    clearTimeout(savedTransitionTimer);
    savedTransitionTimer = null;
  }
};

/**
 * Migration function for legacy drafts to ensure schemaVersion 2 compatibility.
 */
export function migrateDraftData(raw: any): CVData {
  if (!raw || typeof raw !== 'object') return mockCVData;

  const migrated = { ...raw };

  // Ensure themeConfig exists and has schemaVersion 2
  migrated.themeConfig = {
    ...mockCVData.themeConfig,
    ...(raw.themeConfig || {}),
    schemaVersion: 2,
    sectionStyles: raw.themeConfig?.sectionStyles || {},
  };

  return migrated as CVData;
}

/**
 * Trigger debounced auto-save to localStorage
 */
function triggerDebouncedAutoSave(
  get: () => CVState,
  set: (fn: (prev: CVState) => Partial<CVState>) => void
) {
  clearAutoSaveTimers();
  set(() => ({ saveStatus: 'unsaved' }));

  debounceTimer = setTimeout(() => {
    set(() => ({ saveStatus: 'saving' }));
    try {
      const currentData = get().cvData;
      const key = getDraftStorageKey(currentData.id);
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(currentData));
      }
      savedTransitionTimer = setTimeout(() => {
        set(() => ({ saveStatus: 'saved' }));
      }, 300);
    } catch (err) {
      console.error('Không thể lưu draft vào localStorage:', err);
      set(() => ({ saveStatus: 'unsaved' }));
    }
  }, 600);
}

export const useCVStore = create<CVState>((set, get) => ({
  cvData: mockCVData,
  saveStatus: 'saved',
  activeSection: 'personal',

  loadCV: (data: CVData) => {
    clearAutoSaveTimers();
    const key = getDraftStorageKey(data.id);
    let resolvedData = data;
    try {
      if (typeof localStorage !== 'undefined') {
        const savedDraft = localStorage.getItem(key);
        if (savedDraft) {
          resolvedData = migrateDraftData(JSON.parse(savedDraft));
        }
      }
    } catch (e) {
      console.warn('Lỗi khi đọc draft từ localStorage:', e);
    }
    set({ cvData: resolvedData, saveStatus: 'saved' });
  },

  setSaveStatus: (status: SaveStatus) => set({ saveStatus: status }),
  setActiveSection: (section: string) => set({ activeSection: section }),

  updateVisibility: (isPublic: boolean) => {
    set((prev) => ({
      cvData: {
        ...prev.cvData,
        isPublic,
        updatedAt: new Date().toISOString(),
      },
    }));
    triggerDebouncedAutoSave(get, set);
  },

  updatePersonalInfo: (
    fieldOrFields: keyof PersonalInfo | Partial<PersonalInfo>,
    value?: any
  ) => {
    set((prev) => {
      const updatedPersonalInfo =
        typeof fieldOrFields === 'string'
          ? { ...prev.cvData.personalInfo, [fieldOrFields]: value }
          : { ...prev.cvData.personalInfo, ...fieldOrFields };

      return {
        cvData: {
          ...prev.cvData,
          personalInfo: updatedPersonalInfo,
        },
      };
    });
    triggerDebouncedAutoSave(get, set);
  },

  updateSummary: (summary: string) => {
    set((prev) => ({
      cvData: { ...prev.cvData, summary },
    }));
    triggerDebouncedAutoSave(get, set);
  },

  addExperience: () => {
    const newItem: ExperienceItem = {
      id: generateId('exp'),
      company: 'Tên Công Ty / Đơn Vị',
      position: 'Chức Danh Nghề Nghiệp',
      startDate: '01/2023',
      endDate: 'Hiện tại',
      isCurrent: true,
      location: 'TP. Hồ Chí Minh',
      descriptions: ['Mô tả kết quả công việc nổi bật hoặc số liệu đạt được...'],
    };
    set((prev) => ({
      cvData: {
        ...prev.cvData,
        experiences: [newItem, ...prev.cvData.experiences],
      },
    }));
    triggerDebouncedAutoSave(get, set);
  },

  updateExperience: (id: string, field: keyof ExperienceItem, value: any) => {
    set((prev) => ({
      cvData: {
        ...prev.cvData,
        experiences: prev.cvData.experiences.map((exp) =>
          exp.id === id ? { ...exp, [field]: value } : exp
        ),
      },
    }));
    triggerDebouncedAutoSave(get, set);
  },

  removeExperience: (id: string) => {
    set((prev) => ({
      cvData: {
        ...prev.cvData,
        experiences: prev.cvData.experiences.filter((exp) => exp.id !== id),
      },
    }));
    triggerDebouncedAutoSave(get, set);
  },

  reorderExperiences: (startIndex: number, endIndex: number) => {
    set((prev) => ({
      cvData: {
        ...prev.cvData,
        experiences: reorderArray(prev.cvData.experiences || [], startIndex, endIndex),
      },
    }));
    triggerDebouncedAutoSave(get, set);
  },

  addExperienceDescription: (expId: string) => {
    set((prev) => ({
      cvData: {
        ...prev.cvData,
        experiences: prev.cvData.experiences.map((exp) =>
          exp.id === expId
            ? { ...exp, descriptions: [...(exp.descriptions || []), 'Nội dung kết quả mới...'] }
            : exp
        ),
      },
    }));
    triggerDebouncedAutoSave(get, set);
  },

  updateExperienceDescription: (expId: string, descIndex: number, text: string) => {
    set((prev) => ({
      cvData: {
        ...prev.cvData,
        experiences: prev.cvData.experiences.map((exp) => {
          if (exp.id !== expId) return exp;
          const updatedDescs = [...(exp.descriptions || [])];
          updatedDescs[descIndex] = text;
          return { ...exp, descriptions: updatedDescs };
        }),
      },
    }));
    triggerDebouncedAutoSave(get, set);
  },

  removeExperienceDescription: (expId: string, descIndex: number) => {
    set((prev) => ({
      cvData: {
        ...prev.cvData,
        experiences: prev.cvData.experiences.map((exp) => {
          if (exp.id !== expId) return exp;
          const updatedDescs = (exp.descriptions || []).filter((_, i) => i !== descIndex);
          return { ...exp, descriptions: updatedDescs };
        }),
      },
    }));
    triggerDebouncedAutoSave(get, set);
  },

  addEducation: () => {
    const newItem: EducationItem = {
      id: generateId('edu'),
      school: 'Tên Trường Đại Học / Học Viện',
      degree: 'Cử Nhân / Kỹ Sư',
      major: 'Chuyên Ngành Đào Tạo',
      startDate: '2019',
      endDate: '2023',
      gpa: '3.6 / 4.0',
      honors: '',
    };
    set((prev) => ({
      cvData: {
        ...prev.cvData,
        educations: [newItem, ...prev.cvData.educations],
      },
    }));
    triggerDebouncedAutoSave(get, set);
  },

  updateEducation: (id: string, field: keyof EducationItem, value: any) => {
    set((prev) => ({
      cvData: {
        ...prev.cvData,
        educations: prev.cvData.educations.map((edu) =>
          edu.id === id ? { ...edu, [field]: value } : edu
        ),
      },
    }));
    triggerDebouncedAutoSave(get, set);
  },

  removeEducation: (id: string) => {
    set((prev) => ({
      cvData: {
        ...prev.cvData,
        educations: prev.cvData.educations.filter((edu) => edu.id !== id),
      },
    }));
    triggerDebouncedAutoSave(get, set);
  },

  reorderEducations: (startIndex: number, endIndex: number) => {
    set((prev) => ({
      cvData: {
        ...prev.cvData,
        educations: reorderArray(prev.cvData.educations || [], startIndex, endIndex),
      },
    }));
    triggerDebouncedAutoSave(get, set);
  },

  addSkillCategory: () => {
    const newCat: SkillCategory = {
      id: generateId('skillcat'),
      categoryName: 'Nhóm Kỹ Năng Mới',
      skills: [{ name: 'Kỹ Năng 1', level: 5 }],
    };
    set((prev) => ({
      cvData: {
        ...prev.cvData,
        skillCategories: [...prev.cvData.skillCategories, newCat],
      },
    }));
    triggerDebouncedAutoSave(get, set);
  },

  updateSkillCategoryName: (catId: string, name: string) => {
    set((prev) => ({
      cvData: {
        ...prev.cvData,
        skillCategories: prev.cvData.skillCategories.map((c) =>
          c.id === catId ? { ...c, categoryName: name } : c
        ),
      },
    }));
    triggerDebouncedAutoSave(get, set);
  },

  removeSkillCategory: (catId: string) => {
    set((prev) => ({
      cvData: {
        ...prev.cvData,
        skillCategories: prev.cvData.skillCategories.filter((c) => c.id !== catId),
      },
    }));
    triggerDebouncedAutoSave(get, set);
  },

  reorderSkillCategories: (startIndex: number, endIndex: number) => {
    set((prev) => ({
      cvData: {
        ...prev.cvData,
        skillCategories: reorderArray(prev.cvData.skillCategories || [], startIndex, endIndex),
      },
    }));
    triggerDebouncedAutoSave(get, set);
  },

  addSkillToCategory: (catId: string, skillName: string) => {
    if (!skillName.trim()) return;
    set((prev) => ({
      cvData: {
        ...prev.cvData,
        skillCategories: prev.cvData.skillCategories.map((c) => {
          if (c.id !== catId) return c;
          return {
            ...c,
            skills: [...c.skills, { name: skillName.trim(), level: 5 }],
          };
        }),
      },
    }));
    triggerDebouncedAutoSave(get, set);
  },

  removeSkillFromCategory: (catId: string, skillIndex: number) => {
    set((prev) => ({
      cvData: {
        ...prev.cvData,
        skillCategories: prev.cvData.skillCategories.map((c) => {
          if (c.id !== catId) return c;
          return {
            ...c,
            skills: c.skills.filter((_, i) => i !== skillIndex),
          };
        }),
      },
    }));
    triggerDebouncedAutoSave(get, set);
  },

  reorderSkillsInCategory: (catId: string, startIndex: number, endIndex: number) => {
    set((prev) => ({
      cvData: {
        ...prev.cvData,
        skillCategories: prev.cvData.skillCategories.map((c) => {
          if (c.id !== catId) return c;
          return {
            ...c,
            skills: reorderArray(c.skills || [], startIndex, endIndex),
          };
        }),
      },
    }));
    triggerDebouncedAutoSave(get, set);
  },

  addProject: () => {
    const newProj: ProjectItem = {
      id: generateId('proj'),
      name: 'Tên Dự Án Mới',
      role: 'Vai Trò Đảm Nhiệm',
      description: 'Mô tả giá trị đạt được và kết quả nổi bật của dự án...',
      techStack: ['Công nghệ 1', 'Công nghệ 2'],
      link: 'https://github.com/...',
    };
    set((prev) => ({
      cvData: {
        ...prev.cvData,
        projects: [newProj, ...prev.cvData.projects],
      },
    }));
    triggerDebouncedAutoSave(get, set);
  },

  updateProject: (id: string, field: keyof ProjectItem, value: any) => {
    set((prev) => ({
      cvData: {
        ...prev.cvData,
        projects: prev.cvData.projects.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
      },
    }));
    triggerDebouncedAutoSave(get, set);
  },

  removeProject: (id: string) => {
    set((prev) => ({
      cvData: {
        ...prev.cvData,
        projects: prev.cvData.projects.filter((p) => p.id !== id),
      },
    }));
    triggerDebouncedAutoSave(get, set);
  },

  reorderProjects: (startIndex: number, endIndex: number) => {
    set((prev) => ({
      cvData: {
        ...prev.cvData,
        projects: reorderArray(prev.cvData.projects || [], startIndex, endIndex),
      },
    }));
    triggerDebouncedAutoSave(get, set);
  },

  addAchievement: () => {
    const newItem: AchievementItem = {
      id: generateId('achieve'),
      title: 'Tên Giải Thưởng / Thành Tích',
      issuer: 'Đơn Vị Trao Giải / Tổ Chức',
      year: new Date().getFullYear().toString(),
      description: 'Mô tả ngắn gọn về giải thưởng hoặc thành tích đạt được...',
    };
    set((prev) => ({
      cvData: {
        ...prev.cvData,
        achievements: [newItem, ...(prev.cvData.achievements || [])],
      },
    }));
    triggerDebouncedAutoSave(get, set);
  },

  updateAchievement: (id: string, field: keyof AchievementItem, value: any) => {
    set((prev) => ({
      cvData: {
        ...prev.cvData,
        achievements: (prev.cvData.achievements || []).map((item) =>
          item.id === id ? { ...item, [field]: value } : item
        ),
      },
    }));
    triggerDebouncedAutoSave(get, set);
  },

  removeAchievement: (id: string) => {
    set((prev) => ({
      cvData: {
        ...prev.cvData,
        achievements: (prev.cvData.achievements || []).filter((item) => item.id !== id),
      },
    }));
    triggerDebouncedAutoSave(get, set);
  },

  reorderAchievements: (startIndex: number, endIndex: number) => {
    set((prev) => ({
      cvData: {
        ...prev.cvData,
        achievements: reorderArray(prev.cvData.achievements || [], startIndex, endIndex),
      },
    }));
    triggerDebouncedAutoSave(get, set);
  },

  addCertificate: () => {
    const newItem: CertificateItem = {
      id: generateId('cert'),
      name: 'Tên Chứng Chỉ Chuyên Ngành',
      issuer: 'Tổ Chức Cấp (Google, AWS, Coursera,...)',
      issueDate: '2023',
      credentialUrl: '',
    };
    set((prev) => ({
      cvData: {
        ...prev.cvData,
        certificates: [newItem, ...(prev.cvData.certificates || [])],
      },
    }));
    triggerDebouncedAutoSave(get, set);
  },

  updateCertificate: (id: string, field: keyof CertificateItem, value: any) => {
    set((prev) => ({
      cvData: {
        ...prev.cvData,
        certificates: (prev.cvData.certificates || []).map((item) =>
          item.id === id ? { ...item, [field]: value } : item
        ),
      },
    }));
    triggerDebouncedAutoSave(get, set);
  },

  removeCertificate: (id: string) => {
    set((prev) => ({
      cvData: {
        ...prev.cvData,
        certificates: (prev.cvData.certificates || []).filter((item) => item.id !== id),
      },
    }));
    triggerDebouncedAutoSave(get, set);
  },

  reorderCertificates: (startIndex: number, endIndex: number) => {
    set((prev) => ({
      cvData: {
        ...prev.cvData,
        certificates: reorderArray(prev.cvData.certificates || [], startIndex, endIndex),
      },
    }));
    triggerDebouncedAutoSave(get, set);
  },

  // Custom Sections (Tự Build Khối Tùy Chỉnh)
  addCustomSection: (title = 'Hoạt Động & Sở Thích', column = 'main') => {
    const newSection: CustomSection = {
      id: generateId('customsec'),
      title,
      column,
      items: [
        {
          id: generateId('customitem'),
          title: 'Tiêu đề mục (vd: Câu lạc bộ / Ngoại ngữ / Tình nguyện)',
          subtitle: 'Vai trò hoặc tổ chức',
          date: '2024 – Hiện tại',
          description: 'Mô tả chi tiết hoạt động hoặc thông tin bổ sung...',
        },
      ],
    };
    set((prev) => ({
      cvData: {
        ...prev.cvData,
        customSections: [...(prev.cvData.customSections || []), newSection],
      },
    }));
    triggerDebouncedAutoSave(get, set);
  },

  updateCustomSection: (sectionId: string, updates: Partial<CustomSection>) => {
    set((prev) => ({
      cvData: {
        ...prev.cvData,
        customSections: (prev.cvData.customSections || []).map((sec) =>
          sec.id === sectionId ? { ...sec, ...updates } : sec
        ),
      },
    }));
    triggerDebouncedAutoSave(get, set);
  },

  removeCustomSection: (sectionId: string) => {
    set((prev) => ({
      cvData: {
        ...prev.cvData,
        customSections: (prev.cvData.customSections || []).filter((sec) => sec.id !== sectionId),
      },
    }));
    triggerDebouncedAutoSave(get, set);
  },

  reorderCustomSections: (startIndex: number, endIndex: number) => {
    set((prev) => ({
      cvData: {
        ...prev.cvData,
        customSections: reorderArray(prev.cvData.customSections || [], startIndex, endIndex),
      },
    }));
    triggerDebouncedAutoSave(get, set);
  },

  addCustomSectionItem: (sectionId: string) => {
    const newItem: CustomSectionItem = {
      id: generateId('customitem'),
      title: 'Mục thông tin mới',
      subtitle: 'Đơn vị / Ghi chú phụ',
      date: '2025',
      description: 'Nội dung chi tiết...',
    };
    set((prev) => ({
      cvData: {
        ...prev.cvData,
        customSections: (prev.cvData.customSections || []).map((sec) =>
          sec.id === sectionId ? { ...sec, items: [...(sec.items || []), newItem] } : sec
        ),
      },
    }));
    triggerDebouncedAutoSave(get, set);
  },

  updateCustomSectionItem: (
    sectionId: string,
    itemId: string,
    field: keyof CustomSectionItem,
    value: string
  ) => {
    set((prev) => ({
      cvData: {
        ...prev.cvData,
        customSections: (prev.cvData.customSections || []).map((sec) => {
          if (sec.id !== sectionId) return sec;
          return {
            ...sec,
            items: (sec.items || []).map((it) =>
              it.id === itemId ? { ...it, [field]: value } : it
            ),
          };
        }),
      },
    }));
    triggerDebouncedAutoSave(get, set);
  },

  removeCustomSectionItem: (sectionId: string, itemId: string) => {
    set((prev) => ({
      cvData: {
        ...prev.cvData,
        customSections: (prev.cvData.customSections || []).map((sec) => {
          if (sec.id !== sectionId) return sec;
          return {
            ...sec,
            items: (sec.items || []).filter((it) => it.id !== itemId),
          };
        }),
      },
    }));
    triggerDebouncedAutoSave(get, set);
  },

  reorderCustomSectionItems: (sectionId: string, startIndex: number, endIndex: number) => {
    set((prev) => ({
      cvData: {
        ...prev.cvData,
        customSections: (prev.cvData.customSections || []).map((sec) => {
          if (sec.id !== sectionId) return sec;
          return {
            ...sec,
            items: reorderArray(sec.items || [], startIndex, endIndex),
          };
        }),
      },
    }));
    triggerDebouncedAutoSave(get, set);
  },

  updateTheme: (updates: Partial<ThemeConfig>) => {
    set((prev) => ({
      cvData: {
        ...prev.cvData,
        themeConfig: {
          ...prev.cvData.themeConfig,
          ...updates,
        },
      },
    }));
    triggerDebouncedAutoSave(get, set);
  },

  updateSectionStyle: (sectionId: SectionId, style: Partial<SectionStyleConfig>) => {
    set((prev) => {
      const existingSections = prev.cvData.themeConfig.sectionStyles || {};
      const existing = existingSections[sectionId] || {};
      return {
        cvData: {
          ...prev.cvData,
          themeConfig: {
            ...prev.cvData.themeConfig,
            sectionStyles: {
              ...existingSections,
              [sectionId]: {
                ...existing,
                ...style,
              },
            },
          },
        },
      };
    });
    triggerDebouncedAutoSave(get, set);
  },

  resetSectionStyle: (sectionId: SectionId) => {
    set((prev) => {
      const existingSections = { ...(prev.cvData.themeConfig.sectionStyles || {}) };
      delete existingSections[sectionId];
      return {
        cvData: {
          ...prev.cvData,
          themeConfig: {
            ...prev.cvData.themeConfig,
            sectionStyles: existingSections,
          },
        },
      };
    });
    triggerDebouncedAutoSave(get, set);
  },

  resetAllSectionStyles: () => {
    set((prev) => ({
      cvData: {
        ...prev.cvData,
        themeConfig: {
          ...prev.cvData.themeConfig,
          sectionStyles: {},
        },
      },
    }));
    triggerDebouncedAutoSave(get, set);
  },

  applyStyleToAllSections: (style: SectionStyleConfig) => {
    const allSections: SectionId[] = [
      'header',
      'contact',
      'summary',
      'experience',
      'education',
      'skills',
      'projects',
      'achievements',
      'certificates',
    ];
    set((prev) => {
      const newStyles: Partial<Record<SectionId, SectionStyleConfig>> = {};
      allSections.forEach((sec) => {
        newStyles[sec] = { ...style };
      });
      return {
        cvData: {
          ...prev.cvData,
          themeConfig: {
            ...prev.cvData.themeConfig,
            sectionStyles: newStyles,
          },
        },
      };
    });
    triggerDebouncedAutoSave(get, set);
  },

  reorderSectionInColumn: (
    column: 'sidebar' | 'main',
    startIndex: number,
    endIndex: number
  ) => {
    set((prev) => {
      const currentLayout = resolveLayoutConfig(prev.cvData.themeConfig);
      const updatedLayout = {
        ...currentLayout,
        sidebarSections:
          column === 'sidebar'
            ? reorderArray(currentLayout.sidebarSections, startIndex, endIndex)
            : currentLayout.sidebarSections,
        mainSections:
          column === 'main'
            ? reorderArray(currentLayout.mainSections, startIndex, endIndex)
            : currentLayout.mainSections,
      };
      return {
        cvData: {
          ...prev.cvData,
          themeConfig: {
            ...prev.cvData.themeConfig,
            layoutConfig: updatedLayout,
          },
        },
      };
    });
    triggerDebouncedAutoSave(get, set);
  },

  moveSectionToColumn: (
    sectionId: SectionId,
    targetColumn: 'sidebar' | 'main',
    targetIndex?: number
  ) => {
    if (sectionId === 'header') return;
    set((prev) => {
      const currentLayout = resolveLayoutConfig(prev.cvData.themeConfig);
      const nextSidebar = currentLayout.sidebarSections.filter((s) => s !== sectionId);
      const nextMain = currentLayout.mainSections.filter((s) => s !== sectionId);

      if (targetColumn === 'sidebar') {
        const idx =
          typeof targetIndex === 'number' && targetIndex >= 0 && targetIndex <= nextSidebar.length
            ? targetIndex
            : nextSidebar.length;
        nextSidebar.splice(idx, 0, sectionId);
      } else {
        const idx =
          typeof targetIndex === 'number' && targetIndex >= 0 && targetIndex <= nextMain.length
            ? targetIndex
            : nextMain.length;
        nextMain.splice(idx, 0, sectionId);
      }

      return {
        cvData: {
          ...prev.cvData,
          themeConfig: {
            ...prev.cvData.themeConfig,
            layoutConfig: {
              ...currentLayout,
              sidebarSections: nextSidebar,
              mainSections: nextMain,
            },
          },
        },
      };
    });
    triggerDebouncedAutoSave(get, set);
  },

  toggleSectionVisibility: (sectionId: SectionId) => {
    if (sectionId === 'header') return;
    set((prev) => {
      const currentLayout = resolveLayoutConfig(prev.cvData.themeConfig);
      const isHidden = currentLayout.hiddenSections.includes(sectionId);
      const nextHidden = isHidden
        ? currentLayout.hiddenSections.filter((s) => s !== sectionId)
        : [...currentLayout.hiddenSections, sectionId];

      return {
        cvData: {
          ...prev.cvData,
          themeConfig: {
            ...prev.cvData.themeConfig,
            layoutConfig: {
              ...currentLayout,
              hiddenSections: nextHidden,
            },
          },
        },
      };
    });
    triggerDebouncedAutoSave(get, set);
  },

  resetLayoutConfig: () => {
    set((prev) => ({
      cvData: {
        ...prev.cvData,
        themeConfig: {
          ...prev.cvData.themeConfig,
          layoutConfig: getDefaultLayoutConfig(prev.cvData.themeConfig.templateId),
        },
      },
    }));
    triggerDebouncedAutoSave(get, set);
  },

  resetToDefault: (presetData?: CVData) => {
    clearAutoSaveTimers();
    const base = presetData || mockCVData;
    set({ cvData: base, saveStatus: 'saved' });
    const key = getDraftStorageKey(base.id);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(base));
    }
  },
}));
