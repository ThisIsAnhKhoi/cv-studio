import { CVData, CVCategory } from '../types/cv';
import { mockCVData } from '../data/mockCVData';
import { mockProfilesList, getCVByIdOrSlug } from '../data/mockProfiles';
import { generateId, getDraftStorageKey } from '../stores/useCVStore';
import { db } from './firebase';
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  increment,
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
} from 'firebase/firestore';

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

  // 3. Asynchronously sync to Firestore (cloud persistence)
  syncCVToFirestore(updatedCV);
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

  // 3. Remove from Firestore
  deleteCVFromFirestore(cvId);
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

/**
 * Asynchronously synchronizes a CV document to Firestore 'cvs' collection.
 */
export async function syncCVToFirestore(cv: CVData): Promise<void> {
  if (!db || !cv.id) return;
  try {
    const cvRef = doc(db, 'cvs', cv.id);
    await setDoc(cvRef, cv, { merge: true });
  } catch (err) {
    console.warn('Không thể đồng bộ CV lên Firestore (dùng offline/localStorage):', err);
  }
}

/**
 * Removes a CV from Firestore.
 */
export async function deleteCVFromFirestore(cvId: string): Promise<void> {
  if (!db || !cvId) return;
  try {
    const cvRef = doc(db, 'cvs', cvId);
    await deleteDoc(cvRef);
  } catch (err) {
    console.warn('Không thể xóa CV khỏi Firestore:', err);
  }
}

/**
 * Retrieves public CVs for the Homepage community showcase.
 * Prioritizes user-published public CVs, falling back to mock profiles if none exist.
 */
export async function getPublicCVs(): Promise<CVData[]> {
  const publicCVs: CVData[] = [];
  const seenIds = new Set<string>();

  // 1. Fetch from Firestore
  try {
    if (db) {
      const q = query(
        collection(db, 'cvs'),
        where('isPublic', '==', true),
        limit(30)
      );
      const snapshot = await getDocs(q);
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as CVData;
        if (data && data.id && !seenIds.has(data.id)) {
          seenIds.add(data.id);
          publicCVs.push(data);
        }
      });
    }
  } catch (err) {
    console.warn('Không thể truy vấn Firestore public CVs:', err);
  }

  // 2. Scan localStorage for any local user drafts that are marked isPublic
  if (typeof localStorage !== 'undefined') {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('cv_studio_draft_') && key !== 'cv_studio_draft_cv') {
          const raw = localStorage.getItem(key);
          if (raw) {
            try {
              const parsed: CVData = JSON.parse(raw);
              if (parsed.isPublic && parsed.id && !seenIds.has(parsed.id)) {
                seenIds.add(parsed.id);
                publicCVs.push(parsed);
              }
            } catch {
              // ignore
            }
          }
        }
      }
    } catch {
      // ignore
    }
  }

  // 3. If no public CVs exist yet, fallback to mockProfilesList so the gallery is never empty
  if (publicCVs.length === 0) {
    return mockProfilesList;
  }

  // Return public CVs sorted newest first
  return publicCVs.sort(
    (a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()
  );
}

/**
 * Resolves a CV by ID or Slug from mock profiles, localStorage, or Firestore.
 */
export async function getCVById(targetId: string): Promise<CVData | null> {
  if (!targetId) return null;

  // 1. Mock profiles
  const mock = getCVByIdOrSlug(targetId);
  if (mock) return mock;

  // 2. Local storage draft
  if (typeof localStorage !== 'undefined') {
    const key = getDraftStorageKey(targetId);
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {}
    }
  }

  // 3. Firestore
  try {
    if (db) {
      const cvRef = doc(db, 'cvs', targetId);
      const snap = await getDoc(cvRef);
      if (snap.exists()) {
        return snap.data() as CVData;
      }
    }
  } catch (err) {
    console.warn('Lỗi khi tải CV từ Firestore:', err);
  }

  return null;
}

/**
 * Atomically increments the view count of a CV on Firestore without updating updatedAt.
 * Follows Rule of Safety: viewCount updates NEVER modify updatedAt.
 */
export async function incrementCVViewCount(cvId: string): Promise<void> {
  if (!cvId) return;

  // 1. Update Firestore atomically
  try {
    if (db) {
      const cvRef = doc(db, 'cvs', cvId);
      await updateDoc(cvRef, {
        viewCount: increment(1),
      });
    }
  } catch (err) {
    console.warn('Lỗi khi tăng viewCount trên Firestore:', err);
  }

  // 2. Also keep local storage draft in sync if present
  if (typeof localStorage !== 'undefined') {
    try {
      const draftKey = getDraftStorageKey(cvId);
      const raw = localStorage.getItem(draftKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        parsed.viewCount = (parsed.viewCount || 0) + 1;
        localStorage.setItem(draftKey, JSON.stringify(parsed));
      }
    } catch {
      // ignore
    }
  }
}

/**
 * Retrieves the Top N most viewed public CVs for the Homepage showcase.
 * Only fetches active, public CVs whose owners are not disabled.
 */
export async function getTopViewedCVs(limitCount = 6): Promise<CVData[]> {
  const result: CVData[] = [];

  try {
    if (db) {
      const q = query(
        collection(db, 'cvs'),
        where('isPublic', '==', true),
        where('status', '==', 'active'),
        where('ownerDisabled', '==', false),
        orderBy('viewCount', 'desc'),
        orderBy('updatedAt', 'desc'),
        limit(limitCount)
      );
      const snapshot = await getDocs(q);
      snapshot.forEach((docSnap) => {
        result.push(docSnap.data() as CVData);
      });
    }
  } catch (err) {
    console.warn('Không thể truy vấn Top CV xem nhiều nhất từ Firestore:', err);
  }

  if (result.length > 0) {
    return result;
  }

  // Fallback to mock profiles sorted by viewCount if offline or empty
  return [...mockProfilesList]
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    .slice(0, limitCount);
}

export interface ExploreFilterOptions {
  category?: CVCategory | 'all';
  sort?: 'views' | 'newest';
  cursor?: QueryDocumentSnapshot<DocumentData> | null;
  limitCount?: number;
}

export interface ExploreCVsResult {
  cvs: CVData[];
  lastVisible: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
}

/**
 * Retrieves paginated public CVs for the Explore Directory page using Cursor pagination.
 */
export async function getExploreCVs(
  options: ExploreFilterOptions = {}
): Promise<ExploreCVsResult> {
  const { category = 'all', sort = 'views', cursor = null, limitCount = 24 } = options;
  const cvs: CVData[] = [];
  let lastVisible: QueryDocumentSnapshot<DocumentData> | null = null;
  let hasMore = false;

  try {
    if (db) {
      const constraints: any[] = [
        where('isPublic', '==', true),
        where('status', '==', 'active'),
        where('ownerDisabled', '==', false),
      ];

      if (category && category !== 'all') {
        constraints.push(where('category', '==', category));
      }

      if (sort === 'views') {
        constraints.push(orderBy('viewCount', 'desc'));
        constraints.push(orderBy('updatedAt', 'desc'));
      } else {
        constraints.push(orderBy('updatedAt', 'desc'));
      }

      if (cursor) {
        constraints.push(startAfter(cursor));
      }

      constraints.push(limit(limitCount));

      const q = query(collection(db, 'cvs'), ...constraints);
      const snapshot = await getDocs(q);

      snapshot.forEach((docSnap) => {
        cvs.push(docSnap.data() as CVData);
      });

      if (snapshot.docs.length > 0) {
        lastVisible = snapshot.docs[snapshot.docs.length - 1];
        hasMore = snapshot.docs.length === limitCount;
      }
    }
  } catch (err) {
    console.warn('Lỗi khi tải danh sách Explore CVs từ Firestore:', err);
  }

  // Fallback if offline / empty and no cursor
  if (cvs.length === 0 && !cursor) {
    let filtered = [...mockProfilesList];
    if (category && category !== 'all') {
      filtered = filtered.filter((p) => p.category === category);
    }
    if (sort === 'views') {
      filtered.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
    } else {
      filtered.sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime());
    }
    return {
      cvs: filtered.slice(0, limitCount),
      lastVisible: null,
      hasMore: filtered.length > limitCount,
    };
  }

  return { cvs, lastVisible, hasMore };
}

