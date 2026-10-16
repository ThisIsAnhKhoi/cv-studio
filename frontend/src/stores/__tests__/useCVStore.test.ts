import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  useCVStore,
  getDraftStorageKey,
  migrateDraftData,
  clearAutoSaveTimers,
} from '../useCVStore';
import legacyDraft from '../../test/fixtures/legacyDraftFixture.json';
import { mockProfilesList } from '../../data/mockProfiles';

describe('useCVStore (Zustand v5 Store)', () => {
  beforeEach(() => {
    clearAutoSaveTimers();
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should migrate legacy draft data without sectionStyles or schemaVersion to version 2', () => {
    expect(legacyDraft.themeConfig).not.toHaveProperty('sectionStyles');
    expect(legacyDraft).not.toHaveProperty('schemaVersion');

    const migrated = migrateDraftData(legacyDraft);
    expect(migrated.themeConfig.schemaVersion).toBe(2);
    expect(migrated.themeConfig.sectionStyles).toEqual({});
    expect(migrated.personalInfo.fullName).toBe(legacyDraft.personalInfo.fullName);
  });

  it('should load a CV profile and restore persisted draft from localStorage', () => {
    const profile = mockProfilesList[0];
    const draftKey = getDraftStorageKey(profile.id);

    const savedDraft = {
      ...profile,
      personalInfo: {
        ...profile.personalInfo,
        fullName: 'Nguyễn Tải Draft',
      },
    };
    localStorage.setItem(draftKey, JSON.stringify(savedDraft));

    useCVStore.getState().loadCV(profile);

    const state = useCVStore.getState();
    expect(state.cvData.personalInfo.fullName).toBe('Nguyễn Tải Draft');
    expect(state.saveStatus).toBe('saved');
  });

  it('should debounce auto-save after modifications and persist to localStorage', () => {
    vi.useFakeTimers();
    try {
      const profile = mockProfilesList[0];
      const draftKey = getDraftStorageKey(profile.id);

      useCVStore.getState().loadCV(profile);
      expect(useCVStore.getState().saveStatus).toBe('saved');

      // Update personal info
      useCVStore.getState().updatePersonalInfo('fullName', 'Nguyễn Zustand v5');
      expect(useCVStore.getState().saveStatus).toBe('unsaved');

      // Advance by 599ms
      vi.advanceTimersByTime(599);
      expect(useCVStore.getState().saveStatus).toBe('unsaved');

      // Advance 1ms -> reaches 600ms -> saving
      vi.advanceTimersByTime(1);
      expect(useCVStore.getState().saveStatus).toBe('saving');

      const saved = JSON.parse(localStorage.getItem(draftKey) || '{}');
      expect(saved.personalInfo.fullName).toBe('Nguyễn Zustand v5');

      // Advance 300ms -> saved
      vi.advanceTimersByTime(300);
      expect(useCVStore.getState().saveStatus).toBe('saved');
    } finally {
      vi.useRealTimers();
    }
  });

  it('should update section styles and apply to all sections', () => {
    const profile = mockProfilesList[0];
    useCVStore.getState().loadCV(profile);

    // Update experience section style
    useCVStore.getState().updateSectionStyle('experience', {
      headingColor: '#0E7C6B',
      headingFont: 'montserrat',
    });

    let state = useCVStore.getState();
    expect(state.cvData.themeConfig.sectionStyles?.experience?.headingColor).toBe('#0E7C6B');
    expect(state.cvData.themeConfig.sectionStyles?.experience?.headingFont).toBe('montserrat');

    // Reset experience section style
    useCVStore.getState().resetSectionStyle('experience');
    state = useCVStore.getState();
    expect(state.cvData.themeConfig.sectionStyles?.experience).toBeUndefined();

    // Apply to all sections
    useCVStore.getState().applyStyleToAllSections({
      headingColor: '#E86C50',
      headingFont: 'outfit',
    });
    state = useCVStore.getState();
    expect(state.cvData.themeConfig.sectionStyles?.header?.headingColor).toBe('#E86C50');
    expect(state.cvData.themeConfig.sectionStyles?.skills?.headingColor).toBe('#E86C50');
    expect(state.cvData.themeConfig.sectionStyles?.projects?.headingColor).toBe('#E86C50');

    // Reset all
    useCVStore.getState().resetAllSectionStyles();
    state = useCVStore.getState();
    expect(state.cvData.themeConfig.sectionStyles).toEqual({});
  });
});
