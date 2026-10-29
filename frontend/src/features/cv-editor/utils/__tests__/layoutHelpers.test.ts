import { describe, it, expect } from 'vitest';
import {
  reorderArray,
  resolveLayoutConfig,
  getDefaultLayoutConfig,
  getSectionTitle,
  isSectionVisible,
  MOVABLE_SECTIONS,
} from '../layoutHelpers';
import { useCVStore, clearAutoSaveTimers } from '../../../../stores/useCVStore';
import { mockProfilesList } from '../../../../data/mockProfiles';

describe('layoutHelpers & Drag-and-Drop Reorder Engine', () => {
  it('reorderArray should immutably swap items and handle out-of-bounds safely', () => {
    const arr = ['a', 'b', 'c', 'd'];
    expect(reorderArray(arr, 0, 2)).toEqual(['b', 'c', 'a', 'd']);
    expect(reorderArray(arr, 3, 1)).toEqual(['a', 'd', 'b', 'c']);
    // Out of bounds / no-op safety
    expect(reorderArray(arr, -1, 2)).toEqual(['a', 'b', 'c', 'd']);
    expect(reorderArray(arr, 0, 99)).toEqual(['a', 'b', 'c', 'd']);
    expect(reorderArray(arr, 1, 1)).toEqual(['a', 'b', 'c', 'd']);
    // Original array untouched
    expect(arr).toEqual(['a', 'b', 'c', 'd']);
  });

  it('resolveLayoutConfig should auto-reconcile missing sections and deduplicate', () => {
    const partial = resolveLayoutConfig({
      templateId: 'template-classic-teal',
      layoutConfig: {
        sidebarSections: ['skills', 'skills', 'contact'],
        mainSections: ['projects'],
        hiddenSections: ['certificates'],
      },
    });

    // No duplicates, and all 8 movable sections are present across sidebar + main
    const combined = [...partial.sidebarSections, ...partial.mainSections];
    expect(combined.length).toBe(MOVABLE_SECTIONS.length);
    expect(new Set(combined).size).toBe(MOVABLE_SECTIONS.length);
    expect(partial.sidebarSections[0]).toBe('skills');
    expect(partial.sidebarSections[1]).toBe('contact');
    expect(partial.mainSections[0]).toBe('projects');
    expect(isSectionVisible('certificates', partial)).toBe(false);
    expect(isSectionVisible('projects', partial)).toBe(true);
  });

  it('getSectionTitle should prioritize customTitle over defaultTitle', () => {
    expect(
      getSectionTitle('experience', {
        experience: { customTitle: 'Lịch Sử Công Tác' },
      })
    ).toBe('Lịch Sử Công Tác');
    expect(getSectionTitle('experience', {})).toBe('Kinh Nghiệm Làm Việc');
  });

  it('useCVStore should reorder items and sections without errors', () => {
    clearAutoSaveTimers();
    const profile = mockProfilesList[0];
    useCVStore.getState().loadCV(profile);

    // Reorder experiences
    const initialExpIds = useCVStore.getState().cvData.experiences.map((e) => e.id);
    if (initialExpIds.length >= 2) {
      useCVStore.getState().reorderExperiences(0, 1);
      const afterExpIds = useCVStore.getState().cvData.experiences.map((e) => e.id);
      expect(afterExpIds[0]).toBe(initialExpIds[1]);
      expect(afterExpIds[1]).toBe(initialExpIds[0]);
    }

    // Move 'skills' from sidebar to main at index 0
    useCVStore.getState().moveSectionToColumn('skills', 'main', 0);
    let layout = resolveLayoutConfig(useCVStore.getState().cvData.themeConfig);
    expect(layout.mainSections[0]).toBe('skills');
    expect(layout.sidebarSections).not.toContain('skills');

    // Toggle visibility of 'certificates'
    useCVStore.getState().toggleSectionVisibility('certificates');
    layout = resolveLayoutConfig(useCVStore.getState().cvData.themeConfig);
    expect(layout.hiddenSections).toContain('certificates');

    // Reset layout
    useCVStore.getState().resetLayoutConfig();
    layout = resolveLayoutConfig(useCVStore.getState().cvData.themeConfig);
    expect(layout).toEqual(getDefaultLayoutConfig());

    // Add and reorder custom sections
    useCVStore.getState().addCustomSection('Ngoại Ngữ', 'sidebar');
    useCVStore.getState().addCustomSection('Hoạt Động Xã Hội', 'main');
    expect(useCVStore.getState().cvData.customSections?.length).toBe(2);
    useCVStore.getState().reorderCustomSections(0, 1);
    expect(useCVStore.getState().cvData.customSections?.[0].title).toBe('Hoạt Động Xã Hội');
  });
});

