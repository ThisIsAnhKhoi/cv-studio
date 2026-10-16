import { describe, it, expect, beforeEach } from 'vitest';
import {
  isCVOwner,
  getUserCVs,
  saveUserCV,
  deleteUserCV,
  cloneCV,
  createNewCV,
  getPublicCVs,
  getCVById,
} from '../cvStorageService';
import { mockCVData } from '../../data/mockCVData';

describe('cvStorageService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('isCVOwner', () => {
    it('should return true when user uid matches cv userId', () => {
      const cv = { ...mockCVData, userId: 'user-123' };
      const user = { uid: 'user-123' };
      expect(isCVOwner(cv, user)).toBe(true);
    });

    it('should return false when user uid differs from cv userId', () => {
      const cv = { ...mockCVData, userId: 'user-123' };
      const user = { uid: 'user-456' };
      expect(isCVOwner(cv, user)).toBe(false);
    });

    it('should return false when user or cv is null/undefined', () => {
      expect(isCVOwner(null, { uid: 'u1' })).toBe(false);
      expect(isCVOwner(mockCVData, null)).toBe(false);
      expect(isCVOwner(undefined, undefined)).toBe(false);
    });
  });

  describe('getUserCVs and saveUserCV', () => {
    it('should return empty list when no CVs exist for user', () => {
      const cvs = getUserCVs('user-empty');
      expect(cvs).toEqual([]);
    });

    it('should save and retrieve CVs for a specific user', () => {
      const testCV = { ...mockCVData, id: 'cv-test-1', userId: 'user-1' };
      saveUserCV(testCV, 'user-1');

      const retrieved = getUserCVs('user-1');
      expect(retrieved.length).toBe(1);
      expect(retrieved[0].id).toBe('cv-test-1');
      expect(retrieved[0].userId).toBe('user-1');
    });

    it('should isolate CVs between different users', () => {
      saveUserCV({ ...mockCVData, id: 'cv-u1', userId: 'user-1' }, 'user-1');
      saveUserCV({ ...mockCVData, id: 'cv-u2', userId: 'user-2' }, 'user-2');

      const u1CVs = getUserCVs('user-1');
      const u2CVs = getUserCVs('user-2');

      expect(u1CVs.map((c) => c.id)).toEqual(['cv-u1']);
      expect(u2CVs.map((c) => c.id)).toEqual(['cv-u2']);
    });
  });

  describe('deleteUserCV', () => {
    it('should remove CV draft and index entry for user', () => {
      saveUserCV({ ...mockCVData, id: 'cv-to-delete', userId: 'user-del' }, 'user-del');
      expect(getUserCVs('user-del').length).toBe(1);

      deleteUserCV('cv-to-delete', 'user-del');
      expect(getUserCVs('user-del').length).toBe(0);
      expect(localStorage.getItem('cv_studio_draft_cv-to-delete')).toBeNull();
    });
  });

  describe('cloneCV', () => {
    it('should create a clone with new id and assigned newUserId', () => {
      const clone = cloneCV(mockCVData, 'user-cloner');

      expect(clone.id).not.toBe(mockCVData.id);
      expect(clone.id.startsWith('cv-')).toBe(true);
      expect(clone.userId).toBe('user-cloner');
      expect(clone.personalInfo.fullName).toBe(mockCVData.personalInfo.fullName);

      const userCVs = getUserCVs('user-cloner');
      expect(userCVs.some((c) => c.id === clone.id)).toBe(true);
    });
  });

  describe('createNewCV', () => {
    it('should create a fresh CV with specified template and userId', () => {
      const newCV = createNewCV('template-warm-bold', 'user-creator');

      expect(newCV.id.startsWith('cv-')).toBe(true);
      expect(newCV.userId).toBe('user-creator');
      expect(newCV.personalInfo.fullName).toBe('Họ Và Tên Của Bạn');

      const userCVs = getUserCVs('user-creator');
      expect(userCVs.length).toBe(1);
    });
  });

  describe('getPublicCVs', () => {
    it('should fallback to mockProfilesList if no public drafts exist', async () => {
      const publicList = await getPublicCVs();
      expect(publicList.length).toBeGreaterThan(0);
      expect(publicList[0].id).toBeDefined();
    });

    it('should include local user drafts marked as isPublic', async () => {
      const publicDraft = {
        ...mockCVData,
        id: 'cv-local-pub-1',
        isPublic: true,
        updatedAt: new Date().toISOString(),
      };
      saveUserCV(publicDraft, 'user-pub');

      const publicList = await getPublicCVs();
      expect(publicList.some((c) => c.id === 'cv-local-pub-1')).toBe(true);
    });
  });

  describe('getCVById', () => {
    it('should resolve mock profiles by ID or Slug', async () => {
      const cv = await getCVById('thanh-truc');
      expect(cv).not.toBeNull();
      expect(cv?.personalInfo.fullName).toBe('Trần Anh Khôi');

      const cv2 = await getCVById('nguyen-le-thanh-truc');
      expect(cv2).not.toBeNull();
      expect(cv2?.personalInfo.fullName).toBe('Nguyễn Lê Thanh Trúc');
    });

    it('should resolve locally saved user draft by ID', async () => {
      const localCV = {
        ...mockCVData,
        id: 'cv-test-lookup-99',
        personalInfo: { ...mockCVData.personalInfo, fullName: 'Nguyễn Văn Tìm Kiếm' },
      };
      saveUserCV(localCV, 'u99');

      const resolved = await getCVById('cv-test-lookup-99');
      expect(resolved).not.toBeNull();
      expect(resolved?.personalInfo.fullName).toBe('Nguyễn Văn Tìm Kiếm');
    });

    it('should return null when CV does not exist', async () => {
      const notFound = await getCVById('non-existent-id-9999');
      expect(notFound).toBeNull();
    });
  });
});
