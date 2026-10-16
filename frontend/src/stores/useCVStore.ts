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
} from '../types/cv';
import { mockCVData } from '../data/mockCVData';

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
  updatePersonalInfo: (field: keyof PersonalInfo, value: string) => void;
  updateSummary: (summary: string) => void;

  // Experience
  addExperience: () => void;
  updateExperience: (id: string, field: keyof ExperienceItem, value: any) => void;
  removeExperience: (id: string) => void;
  addExperienceDescription: (expId: string) => void;
  updateExperienceDescription: (expId: string, descIndex: number, text: string) => void;
  removeExperienceDescription: (expId: string, descIndex: number) => void;

  // Education
  addEducation: () => void;
  updateEducation: (id: string, field: keyof EducationItem, value: any) => void;
  removeEducation: (id: string) => void;

  // Skills
  addSkillCategory: () => void;
  updateSkillCategoryName: (catId: string, name: string) => void;
  removeSkillCategory: (catId: string) => void;
  addSkillToCategory: (catId: string, skillName: string) => void;
  removeSkillFromCategory: (catId: string, skillIndex: number) => void;

  // Projects
  addProject: () => void;
  updateProject: (id: string, field: keyof ProjectItem, value: any) => void;
  removeProject: (id: string) => void;

  // Achievements
  addAchievement: () => void;
  updateAchievement: (id: string, field: keyof AchievementItem, value: any) => void;
  removeAchievement: (id: string) => void;

  // Certificates
  addCertificate: () => void;
  updateCertificate: (id: string, field: keyof CertificateItem, value: any) => void;
  removeCertificate: (id: string) => void;

  // Theme & Section Customization
  updateTheme: (updates: Partial<ThemeConfig>) => void;
  updateSectionStyle: (sectionId: SectionId, style: Partial<SectionStyleConfig>) => void;
  resetSectionStyle: (sectionId: SectionId) => void;
  resetAllSectionStyles: () => void;
  applyStyleToAllSections: (style: SectionStyleConfig) => void;

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
function triggerDebouncedAutoSave(get: () => CVState, set: (fn: (prev: CVState) => Partial<CVState>) => void) {
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

  updatePersonalInfo: (field: keyof PersonalInfo, value: string) => {
    set((prev) => ({
      cvData: {
        ...prev.cvData,
        personalInfo: {
          ...prev.cvData.personalInfo,
          [field]: value,
        },
      },
    }));
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
