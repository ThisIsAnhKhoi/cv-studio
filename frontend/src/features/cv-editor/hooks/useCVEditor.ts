import { useEffect, useRef } from 'react';
import { CVData } from '../../../types/cv';
import { mockCVData } from '../../../data/mockCVData';
import {
  useCVStore,
  getDraftStorageKey,
  generateId,
  SaveStatus,
} from '../../../stores/useCVStore';

export { getDraftStorageKey, generateId };
export type { SaveStatus };
export const DRAFT_STORAGE_KEY = 'cv_studio_draft_cv';

/**
 * Strangler Fig wrapper facade:
 * Preserves 100% backward compatibility for all existing components and tests
 * while routing all state reads, writes, and auto-save debounces to the global Zustand store.
 */
export function useCVEditor(initialData?: CVData) {
  const target = initialData || mockCVData;
  const isInitialMount = useRef(true);
  const currentIdRef = useRef(target.id);

  // Synchronously initialize/load on initial mount
  if (isInitialMount.current) {
    isInitialMount.current = false;
    currentIdRef.current = target.id;
    useCVStore.getState().loadCV(target);
  }

  useEffect(() => {
    if (target.id !== currentIdRef.current) {
      currentIdRef.current = target.id;
      useCVStore.getState().loadCV(target);
    }
  }, [target.id]);

  const cvData = useCVStore((s) => s.cvData);
  const saveStatus = useCVStore((s) => s.saveStatus);

  // Stable action references from Zustand store
  const store = useCVStore.getState();

  return {
    cvData,
    saveStatus,
    updatePersonalInfo: store.updatePersonalInfo,
    updateSummary: store.updateSummary,
    addExperience: store.addExperience,
    updateExperience: store.updateExperience,
    removeExperience: store.removeExperience,
    addExperienceDescription: store.addExperienceDescription,
    updateExperienceDescription: store.updateExperienceDescription,
    removeExperienceDescription: store.removeExperienceDescription,
    addEducation: store.addEducation,
    updateEducation: store.updateEducation,
    removeEducation: store.removeEducation,
    addSkillCategory: store.addSkillCategory,
    updateSkillCategoryName: store.updateSkillCategoryName,
    removeSkillCategory: store.removeSkillCategory,
    addSkillToCategory: store.addSkillToCategory,
    removeSkillFromCategory: store.removeSkillFromCategory,
    addProject: store.addProject,
    updateProject: store.updateProject,
    removeProject: store.removeProject,
    addAchievement: store.addAchievement,
    updateAchievement: store.updateAchievement,
    removeAchievement: store.removeAchievement,
    addCertificate: store.addCertificate,
    updateCertificate: store.updateCertificate,
    removeCertificate: store.removeCertificate,
    updateTheme: store.updateTheme,
    updateSectionStyle: store.updateSectionStyle,
    resetSectionStyle: store.resetSectionStyle,
    resetAllSectionStyles: store.resetAllSectionStyles,
    applyStyleToAllSections: store.applyStyleToAllSections,
    resetToDefault: (presetData?: CVData) => {
      useCVStore.getState().resetToDefault(presetData || initialData);
    },
  };
}
