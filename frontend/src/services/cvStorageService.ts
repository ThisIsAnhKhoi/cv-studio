import { CVData } from '../types/cv';
import { mockCVData } from '../data/mockCVData';
import { mockProfilesList } from '../data/mockProfiles';
import { generateId, getDraftStorageKey } from '../stores/useCVStore';

const USER_CVS_KEY_PREFIX = 'cv_studio_user_cvs_';

export function getUserCVsStorageKey(userId: string): string {
  return `${USER_CVS_KEY_PREFIX}${userId}`;
}

/**
 * Checks whether a given user is the owner of the CV.
 */
export function isCVOwner(
  cv: CVData | null | undefined,
  user: { uid: string } | null | undefined
): boolean {
  if (!cv || !user || !user.uid) return false;
  return cv.userId === user.uid;
}

/**
 * Retrieves the list of CVs owned by a specific user from local storage.
 */
export function getUserCVs(userId: string): CVData[] {
  if (!userId || typeof localStorage === 'undefined') return [];

  try {
    const rawList = localStorage.getItem(getUserCVsStorageKey(userId));
    if (!rawList) return [];

    const idList: string[] = JSON.parse(rawList);
    if (!Array.isArray(idList)) return [];

    const result: CVData[] = [];
    for (const id of idList) {
      const draftKey = getDraftStorageKey(id);
      const rawDraft = localStorage.getItem(draftKey);
      if (rawDraft) {
        try {
          const parsed: CVData = JSON.parse(rawDraft);
          result.push(parsed);
        } catch {
          // ignore corrupted single draft
        }
      }
    }

    // Sort by updatedAt descending (newest first)
    return result.sort(
      (a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()
    );
  } catch (err) {
    console.error('Lỗi khi đọc danh sách CV người dùng:', err);
    return [];
  }
}

/**
 * Saves or updates a CV into the user's personal list and local storage draft.
 */
export function saveUserCV(cv: CVData, userId?: string): void {
  if (typeof localStorage === 'undefined') return;

  const targetUserId = userId || cv.userId;
  const updatedCV: CVData = {
    ...cv,
    userId: targetUserId,
    updatedAt: new Date().toISOString(),
  };

  // 1. Save the draft
  const draftKey = getDraftStorageKey(updatedCV.id);
  localStorage.setItem(draftKey, JSON.stringify(updatedCV));

  // 2. If assigned to a user, update their CV list index
  if (targetUserId && targetUserId !== 'anonymous') {
    try {
      const listKey = getUserCVsStorageKey(targetUserId);
      const rawList = localStorage.getItem(listKey);
      let idList: string[] = rawList ? JSON.parse(rawList) : [];
      if (!Array.isArray(idList)) idList = [];

      if (!idList.includes(updatedCV.id)) {
        idList.unshift(updatedCV.id);
        localStorage.setItem(listKey, JSON.stringify(idList));
      }
    } catch (err) {
      console.error('Lỗi khi cập nhật danh sách index CV người dùng:', err);
    }
  }
}

/**
 * Removes a CV from the user's list and deletes its draft.
 */
export function deleteUserCV(cvId: string, userId: string): void {
  if (typeof localStorage === 'undefined') return;

  // 1. Remove draft
  localStorage.removeItem(getDraftStorageKey(cvId));

  // 2. Remove from user index
  if (userId) {
    try {
      const listKey = getUserCVsStorageKey(userId);
      const rawList = localStorage.getItem(listKey);
      if (rawList) {
        const idList: string[] = JSON.parse(rawList);
        if (Array.isArray(idList)) {
          const filtered = idList.filter((id) => id !== cvId);
          localStorage.setItem(listKey, JSON.stringify(filtered));
        }
      }
    } catch (err) {
      console.error('Lỗi khi xóa CV khỏi index người dùng:', err);
    }
  }
}

/**
 * Clones an existing CV into a brand new CV instance owned by target user.
 */
export function cloneCV(source: CVData, newUserId?: string): CVData {
  const newId = generateId('cv');
  const now = new Date().toISOString();

  const cloned: CVData = {
    ...JSON.parse(JSON.stringify(source)),
    id: newId,
    userId: newUserId || 'anonymous',
    slug: `${source.slug || 'cv'}-copy-${Math.random().toString(36).substring(2, 6)}`,
    createdAt: now,
    updatedAt: now,
  };

  // Save the new clone
  saveUserCV(cloned, newUserId);
  return cloned;
}

/**
 * Creates a brand new CV from a chosen template.
 */
export function createNewCV(templateId = 'template-classic-teal', userId?: string): CVData {
  // Find a base template profile to copy structure from
  const baseProfile =
    mockProfilesList.find((p) => p.themeConfig.templateId === templateId) || mockCVData;

  const newId = generateId('cv');
  const now = new Date().toISOString();

  const freshCV: CVData = {
    ...JSON.parse(JSON.stringify(baseProfile)),
    id: newId,
    userId: userId || 'anonymous',
    slug: `cv-moi-${Math.random().toString(36).substring(2, 6)}`,
    personalInfo: {
      ...baseProfile.personalInfo,
      fullName: 'Họ Và Tên Của Bạn',
      title: 'Chức Danh Chuyên Môn Của Bạn',
    },
    createdAt: now,
    updatedAt: now,
  };

  saveUserCV(freshCV, userId);
  return freshCV;
}
