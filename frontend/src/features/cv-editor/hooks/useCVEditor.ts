import { useState, useEffect, useCallback, useRef } from 'react';
import {
  CVData,
  PersonalInfo,
  ExperienceItem,
  EducationItem,
  SkillCategory,
  ProjectItem,
  ThemeConfig,
  ColorPreset,
  HeadingFontOption,
} from '../../../types/cv';
import { mockCVData } from '../../../data/mockCVData';

export const DRAFT_STORAGE_KEY = 'cv_studio_draft_cv';

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
}

export type SaveStatus = 'saved' | 'saving' | 'unsaved';

export function useCVEditor(initialData?: CVData) {
  // Load draft from localStorage if available, otherwise use initialData or mockCVData
  const [cvData, setCvData] = useState<CVData>(() => {
    if (initialData) return initialData;
    try {
      const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (savedDraft) {
        return JSON.parse(savedDraft);
      }
    } catch (e) {
      console.warn('Lỗi khi đọc draft từ localStorage:', e);
    }
    return mockCVData;
  });

  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const isInitialMount = useRef(true);

  // Auto-save debounce effect (600ms)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    setSaveStatus('unsaved');
    const timer = setTimeout(() => {
      setSaveStatus('saving');
      try {
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(cvData));
        setTimeout(() => setSaveStatus('saved'), 300);
      } catch (err) {
        console.error('Không thể lưu draft vào localStorage:', err);
        setSaveStatus('unsaved');
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [cvData]);

  // 1. Personal Info Updaters
  const updatePersonalInfo = useCallback((field: keyof PersonalInfo, value: string) => {
    setCvData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  }, []);

  // 2. Summary Updater
  const updateSummary = useCallback((summary: string) => {
    setCvData((prev) => ({ ...prev, summary }));
  }, []);

  // 3. Work Experience Updaters
  const addExperience = useCallback(() => {
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
    setCvData((prev) => ({
      ...prev,
      experiences: [newItem, ...prev.experiences],
    }));
  }, []);

  const updateExperience = useCallback((id: string, field: keyof ExperienceItem, value: any) => {
    setCvData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    }));
  }, []);

  const removeExperience = useCallback((id: string) => {
    setCvData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((exp) => exp.id !== id),
    }));
  }, []);

  const addExperienceDescription = useCallback((expId: string) => {
    setCvData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp) =>
        exp.id === expId
          ? { ...exp, descriptions: [...(exp.descriptions || []), 'Nội dung kết quả mới...'] }
          : exp
      ),
    }));
  }, []);

  const updateExperienceDescription = useCallback(
    (expId: string, descIndex: number, text: string) => {
      setCvData((prev) => ({
        ...prev,
        experiences: prev.experiences.map((exp) => {
          if (exp.id !== expId) return exp;
          const updatedDescs = [...(exp.descriptions || [])];
          updatedDescs[descIndex] = text;
          return { ...exp, descriptions: updatedDescs };
        }),
      }));
    },
    []
  );

  const removeExperienceDescription = useCallback((expId: string, descIndex: number) => {
    setCvData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp) => {
        if (exp.id !== expId) return exp;
        const updatedDescs = (exp.descriptions || []).filter((_, i) => i !== descIndex);
        return { ...exp, descriptions: updatedDescs };
      }),
    }));
  }, []);

  // 4. Education Updaters
  const addEducation = useCallback(() => {
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
    setCvData((prev) => ({
      ...prev,
      educations: [newItem, ...prev.educations],
    }));
  }, []);

  const updateEducation = useCallback((id: string, field: keyof EducationItem, value: any) => {
    setCvData((prev) => ({
      ...prev,
      educations: prev.educations.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    }));
  }, []);

  const removeEducation = useCallback((id: string) => {
    setCvData((prev) => ({
      ...prev,
      educations: prev.educations.filter((edu) => edu.id !== id),
    }));
  }, []);

  // 5. Skills Updaters
  const addSkillCategory = useCallback(() => {
    const newCat: SkillCategory = {
      id: generateId('skillcat'),
      categoryName: 'Nhóm Kỹ Năng Mới',
      skills: [{ name: 'Kỹ Năng 1', level: 5 }],
    };
    setCvData((prev) => ({
      ...prev,
      skillCategories: [...prev.skillCategories, newCat],
    }));
  }, []);

  const updateSkillCategoryName = useCallback((catId: string, name: string) => {
    setCvData((prev) => ({
      ...prev,
      skillCategories: prev.skillCategories.map((c) =>
        c.id === catId ? { ...c, categoryName: name } : c
      ),
    }));
  }, []);

  const removeSkillCategory = useCallback((catId: string) => {
    setCvData((prev) => ({
      ...prev,
      skillCategories: prev.skillCategories.filter((c) => c.id !== catId),
    }));
  }, []);

  const addSkillToCategory = useCallback((catId: string, skillName: string) => {
    if (!skillName.trim()) return;
    setCvData((prev) => ({
      ...prev,
      skillCategories: prev.skillCategories.map((c) => {
        if (c.id !== catId) return c;
        return {
          ...c,
          skills: [...c.skills, { name: skillName.trim(), level: 5 }],
        };
      }),
    }));
  }, []);

  const removeSkillFromCategory = useCallback((catId: string, skillIndex: number) => {
    setCvData((prev) => ({
      ...prev,
      skillCategories: prev.skillCategories.map((c) => {
        if (c.id !== catId) return c;
        return {
          ...c,
          skills: c.skills.filter((_, i) => i !== skillIndex),
        };
      }),
    }));
  }, []);

  // 6. Projects Updaters
  const addProject = useCallback(() => {
    const newProj: ProjectItem = {
      id: generateId('proj'),
      name: 'Tên Dự Án Mới',
      role: 'Vai Trò Đảm Nhiệm',
      description: 'Mô tả giá trị đạt được và kết quả nổi bật của dự án...',
      techStack: ['Công nghệ 1', 'Công nghệ 2'],
      link: 'https://github.com/...',
    };
    setCvData((prev) => ({
      ...prev,
      projects: [newProj, ...prev.projects],
    }));
  }, []);

  const updateProject = useCallback((id: string, field: keyof ProjectItem, value: any) => {
    setCvData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    }));
  }, []);

  const removeProject = useCallback((id: string) => {
    setCvData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
  }, []);

  // 7. Theme Customizer Updaters
  const updateTheme = useCallback((updates: Partial<ThemeConfig>) => {
    setCvData((prev) => ({
      ...prev,
      themeConfig: {
        ...prev.themeConfig,
        ...updates,
      },
    }));
  }, []);

  // Reset to default sample
  const resetToDefault = useCallback((presetData?: CVData) => {
    const base = presetData || mockCVData;
    setCvData(base);
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(base));
    setSaveStatus('saved');
  }, []);

  return {
    cvData,
    saveStatus,
    updatePersonalInfo,
    updateSummary,
    addExperience,
    updateExperience,
    removeExperience,
    addExperienceDescription,
    updateExperienceDescription,
    removeExperienceDescription,
    addEducation,
    updateEducation,
    removeEducation,
    addSkillCategory,
    updateSkillCategoryName,
    removeSkillCategory,
    addSkillToCategory,
    removeSkillFromCategory,
    addProject,
    updateProject,
    removeProject,
    updateTheme,
    resetToDefault,
  };
}
