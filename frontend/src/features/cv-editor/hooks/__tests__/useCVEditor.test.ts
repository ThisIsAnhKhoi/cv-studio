import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCVEditor, getDraftStorageKey } from '../useCVEditor';
import { mockProfilesList } from '../../../../data/mockProfiles';

describe('useCVEditor hook', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('test_draft_isolation_per_cv_id: should isolate drafts by CV id in localStorage', () => {
    const profileA = mockProfilesList[0];
    const profileB = mockProfilesList[1];

    const keyA = getDraftStorageKey(profileA.id);
    const keyB = getDraftStorageKey(profileB.id);

    expect(keyA).toBe(`cv_studio_draft_${profileA.id}`);
    expect(keyB).toBe(`cv_studio_draft_${profileB.id}`);
    expect(keyA).not.toBe(keyB);
  });

  it('test_draft_persistence_f5: should load persisted draft from localStorage for specific ID', () => {
    const profile = { ...mockProfilesList[0] };
    const draftKey = getDraftStorageKey(profile.id);

    const modifiedDraft = {
      ...profile,
      personalInfo: {
        ...profile.personalInfo,
        fullName: 'Nguyễn Văn Đang Soạn',
      },
    };

    localStorage.setItem(draftKey, JSON.stringify(modifiedDraft));

    const { result } = renderHook(() => useCVEditor(profile));

    expect(result.current.cvData.personalInfo.fullName).toBe('Nguyễn Văn Đang Soạn');
  });

  it('test_editor_add_remove_experience: should add and remove experiences correctly', () => {
    const { result } = renderHook(() => useCVEditor());
    const initialCount = result.current.cvData.experiences.length;

    act(() => {
      result.current.addExperience();
    });

    expect(result.current.cvData.experiences.length).toBe(initialCount + 1);
    const addedId = result.current.cvData.experiences[0].id;

    act(() => {
      result.current.removeExperience(addedId);
    });

    expect(result.current.cvData.experiences.length).toBe(initialCount);
  });

  it('test_editor_add_remove_skills: should manage skills categories and individual skills', () => {
    const { result } = renderHook(() => useCVEditor());
    const initialCatCount = result.current.cvData.skillCategories.length;

    act(() => {
      result.current.addSkillCategory();
    });

    expect(result.current.cvData.skillCategories.length).toBe(initialCatCount + 1);
    const newCategory = result.current.cvData.skillCategories[result.current.cvData.skillCategories.length - 1];

    act(() => {
      result.current.addSkillToCategory(newCategory.id, 'Kubernetes');
    });

    const updatedCategory = result.current.cvData.skillCategories.find((c) => c.id === newCategory.id);
    expect(updatedCategory?.skills.some((s) => s.name === 'Kubernetes')).toBe(true);

    act(() => {
      result.current.removeSkillCategory(newCategory.id);
    });

    expect(result.current.cvData.skillCategories.length).toBe(initialCatCount);
  });

  it('test_editor_add_remove_achievements_and_certificates: should add and remove achievements and certificates', () => {
    const { result } = renderHook(() => useCVEditor());
    const initialAchCount = result.current.cvData.achievements?.length || 0;
    const initialCertCount = result.current.cvData.certificates?.length || 0;

    act(() => {
      result.current.addAchievement();
    });
    expect(result.current.cvData.achievements?.length).toBe(initialAchCount + 1);
    const addedAchId = result.current.cvData.achievements[0].id;

    act(() => {
      result.current.removeAchievement(addedAchId);
    });
    expect(result.current.cvData.achievements?.length).toBe(initialAchCount);

    act(() => {
      result.current.addCertificate();
    });
    expect(result.current.cvData.certificates?.length).toBe(initialCertCount + 1);
    const addedCertId = result.current.cvData.certificates[0].id;

    act(() => {
      result.current.removeCertificate(addedCertId);
    });
    expect(result.current.cvData.certificates?.length).toBe(initialCertCount);
  });

  it('test_editor_update_personal_info_and_summary: should update personal info fields and summary', () => {
    const { result } = renderHook(() => useCVEditor());

    act(() => {
      result.current.updatePersonalInfo('fullName', 'Trần Khôi');
      result.current.updatePersonalInfo('title', 'Senior Architect');
      result.current.updateSummary('Tóm tắt nghề nghiệp mới với đầy đủ dấu tiếng Việt: Cần mẫn, sáng tạo.');
    });

    expect(result.current.cvData.personalInfo.fullName).toBe('Trần Khôi');
    expect(result.current.cvData.personalInfo.title).toBe('Senior Architect');
    expect(result.current.cvData.summary).toBe('Tóm tắt nghề nghiệp mới với đầy đủ dấu tiếng Việt: Cần mẫn, sáng tạo.');
  });

  it('test_editor_education_and_projects: should add, update and remove education and projects', () => {
    const { result } = renderHook(() => useCVEditor());

    // Education
    const initEduCount = result.current.cvData.educations.length;
    act(() => {
      result.current.addEducation();
    });
    expect(result.current.cvData.educations.length).toBe(initEduCount + 1);
    const newEduId = result.current.cvData.educations[0].id;

    act(() => {
      result.current.updateEducation(newEduId, 'school', 'Đại Học Bách Khoa');
    });
    expect(result.current.cvData.educations.find((e) => e.id === newEduId)?.school).toBe('Đại Học Bách Khoa');

    act(() => {
      result.current.removeEducation(newEduId);
    });
    expect(result.current.cvData.educations.length).toBe(initEduCount);

    // Projects
    const initProjCount = result.current.cvData.projects.length;
    act(() => {
      result.current.addProject();
    });
    expect(result.current.cvData.projects.length).toBe(initProjCount + 1);
    const newProjId = result.current.cvData.projects[0].id;

    act(() => {
      result.current.updateProject(newProjId, 'name', 'CV Studio SaaS');
    });
    expect(result.current.cvData.projects.find((p) => p.id === newProjId)?.name).toBe('CV Studio SaaS');

    act(() => {
      result.current.removeProject(newProjId);
    });
    expect(result.current.cvData.projects.length).toBe(initProjCount);
  });

  it('test_editor_theme_customization: should update theme config properties', () => {
    const { result } = renderHook(() => useCVEditor());

    act(() => {
      result.current.updateTheme({
        primaryColor: '#0E7C6B',
        templateId: 'template-warm-bold',
      });
    });

    expect(result.current.cvData.themeConfig.primaryColor).toBe('#0E7C6B');
    expect(result.current.cvData.themeConfig.templateId).toBe('template-warm-bold');
  });

  it('test_editor_autosave_debounce: should debounce auto-save to localStorage after 600ms + 300ms', () => {
    vi.useFakeTimers();
    try {
      const profile = { ...mockProfilesList[0] };
      const draftKey = getDraftStorageKey(profile.id);

      const { result } = renderHook(() => useCVEditor(profile));
      expect(result.current.saveStatus).toBe('saved');

      // Trigger an update
      act(() => {
        result.current.updatePersonalInfo('fullName', 'Nguyễn Tự Động Lưu');
      });

      expect(result.current.saveStatus).toBe('unsaved');

      // Advance by 599ms -> still unsaved
      act(() => {
        vi.advanceTimersByTime(599);
      });
      expect(result.current.saveStatus).toBe('unsaved');

      // Advance by 1ms -> reaches 600ms debounce -> saving
      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(result.current.saveStatus).toBe('saving');

      // Verify localStorage was updated
      const savedInStorage = JSON.parse(localStorage.getItem(draftKey) || '{}');
      expect(savedInStorage.personalInfo?.fullName).toBe('Nguyễn Tự Động Lưu');

      // Advance by 300ms -> transition to saved
      act(() => {
        vi.advanceTimersByTime(300);
      });
      expect(result.current.saveStatus).toBe('saved');
    } finally {
      vi.useRealTimers();
    }
  });

  it('test_editor_reset_to_default: should restore default/preset and persist to localStorage', () => {
    vi.useFakeTimers();
    try {
      const profile = { ...mockProfilesList[0] };
      const draftKey = getDraftStorageKey(profile.id);

      const { result } = renderHook(() => useCVEditor(profile));

      // Modify state
      act(() => {
        result.current.updatePersonalInfo('fullName', 'Tên Tạm Thời');
      });
      expect(result.current.cvData.personalInfo.fullName).toBe('Tên Tạm Thời');

      // Reset to default
      act(() => {
        result.current.resetToDefault(profile);
      });

      expect(result.current.cvData.personalInfo.fullName).toBe(profile.personalInfo.fullName);

      // Advance debounce timer (600ms debounce + 300ms saving)
      act(() => {
        vi.advanceTimersByTime(900);
      });
      expect(result.current.saveStatus).toBe('saved');

      const stored = JSON.parse(localStorage.getItem(draftKey) || '{}');
      expect(stored.personalInfo.fullName).toBe(profile.personalInfo.fullName);
    } finally {
      vi.useRealTimers();
    }
  });
});

