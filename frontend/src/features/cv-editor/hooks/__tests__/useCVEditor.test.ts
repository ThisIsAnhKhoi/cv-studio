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
});
