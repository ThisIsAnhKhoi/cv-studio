import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  checkAdminPermissions,
  SUPER_ADMIN_EMAIL,
  disableCV,
  restoreCV,
  disableUser,
  unlockUser,
  changeUserRole,
} from '../adminService';
import { AuthUser } from '../../stores/useAuthStore';

describe('adminService RBAC and Validation Logic', () => {
  const superAdminUser: AuthUser = {
    uid: 'super-admin-uid-123',
    email: 'thanhanhkhoi.work@gmail.com',
    displayName: 'Thành Anh Khôi',
    photoURL: null,
  };

  const normalUser: AuthUser = {
    uid: 'normal-user-uid-456',
    email: 'candidate@example.com',
    displayName: 'Nguyễn Văn A',
    photoURL: null,
  };

  describe('checkAdminPermissions', () => {
    it('grants full permissions to founder email unconditionally (fail-safe)', async () => {
      const perms = await checkAdminPermissions(superAdminUser);
      expect(perms.isSuperAdmin).toBe(true);
      expect(perms.isAdmin).toBe(true);
      expect(perms.isModerator).toBe(true);
    });

    it('denies permissions when user is null', async () => {
      const perms = await checkAdminPermissions(null);
      expect(perms.isSuperAdmin).toBe(false);
      expect(perms.isAdmin).toBe(false);
      expect(perms.isModerator).toBe(false);
    });

    it('denies permissions for regular user with no role records', async () => {
      const perms = await checkAdminPermissions(normalUser);
      expect(perms.isSuperAdmin).toBe(false);
      expect(perms.isAdmin).toBe(false);
      expect(perms.isModerator).toBe(false);
    });
  });

  describe('disableCV validation', () => {
    it('throws error if moderation reason is less than 5 characters', async () => {
      await expect(
        disableCV('cv-123', superAdminUser, 'abc')
      ).rejects.toThrow('Lý do vô hiệu hóa bắt buộc phải có tối thiểu 5 ký tự.');
    });

    it('throws error if moderation reason is empty or whitespace', async () => {
      await expect(
        disableCV('cv-123', superAdminUser, '   ')
      ).rejects.toThrow('Lý do vô hiệu hóa bắt buộc phải có tối thiểu 5 ký tự.');
    });
  });

  describe('restoreCV validation', () => {
    it('throws error if restore reason is less than 5 characters', async () => {
      await expect(
        restoreCV('cv-123', superAdminUser, 'ok')
      ).rejects.toThrow('Lý do khôi phục bắt buộc phải có tối thiểu 5 ký tự.');
    });
  });

  describe('disableUser safety guards', () => {
    it('prevents self-lockout: actor cannot lock their own account', async () => {
      await expect(
        disableUser(superAdminUser.uid, superAdminUser, 'Lý do hợp lệ')
      ).rejects.toThrow('An toàn hệ thống: Bạn không thể tự khóa tài khoản của chính mình!');
    });

    it('throws error if lock reason is less than 5 characters', async () => {
      await expect(
        disableUser('other-uid', superAdminUser, 'bad')
      ).rejects.toThrow('Lý do khóa tài khoản bắt buộc phải có tối thiểu 5 ký tự.');
    });
  });

  describe('unlockUser validation', () => {
    it('throws error if unlock reason is less than 5 characters', async () => {
      await expect(
        unlockUser('other-uid', superAdminUser, 'mở')
      ).rejects.toThrow('Lý do mở khóa bắt buộc phải có tối thiểu 5 ký tự.');
    });
  });

  describe('changeUserRole safety guards', () => {
    it('prevents self-demotion: admin cannot demote themselves to user/moderator', async () => {
      await expect(
        changeUserRole(superAdminUser.uid, 'user', superAdminUser, 'Lý do hợp lệ thay đổi')
      ).rejects.toThrow('An toàn hệ thống: Bạn không thể tự hạ quyền của chính mình!');
    });

    it('throws error if change role reason is less than 5 characters', async () => {
      await expect(
        changeUserRole('target-uid', 'moderator', superAdminUser, 'ngắn')
      ).rejects.toThrow('Lý do thay đổi vai trò bắt buộc phải có tối thiểu 5 ký tự.');
    });
  });
});
