import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AdminAuthGuard } from '../AdminAuthGuard';
import { useAuthStore } from '../../../stores/useAuthStore';

// Mock checkAdminPermissions
vi.mock('../../../services/adminService', () => ({
  SUPER_ADMIN_EMAIL: 'thanhanhkhoi.work@gmail.com',
  checkAdminPermissions: vi.fn().mockImplementation(async (user) => {
    if (!user) return { isSuperAdmin: false, isAdmin: false, isModerator: false };
    if (user.email === 'thanhanhkhoi.work@gmail.com') {
      return { isSuperAdmin: true, isAdmin: true, isModerator: true };
    }
    return { isSuperAdmin: false, isAdmin: false, isModerator: false };
  }),
}));

describe('AdminAuthGuard Component', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      isInitialized: true,
      openAuthModal: vi.fn(),
    });
  });

  it('renders login prompt when user is not authenticated', async () => {
    render(
      <MemoryRouter>
        <AdminAuthGuard>
          <div>Trang Quản Trị Bí Mật</div>
        </AdminAuthGuard>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Khu Vực Quản Trị Hệ Thống')).toBeDefined();
      expect(screen.getByText('Đăng Nhập Quản Trị Viên')).toBeDefined();
    });
  });

  it('renders 403 Forbidden screen when user is authenticated but not an admin', async () => {
    useAuthStore.setState({
      user: {
        uid: 'user-normal-456',
        email: 'regular@example.com',
        displayName: 'Người Dùng Bình Thường',
        photoURL: null,
      },
      isInitialized: true,
    });

    render(
      <MemoryRouter>
        <AdminAuthGuard>
          <div>Trang Quản Trị Bí Mật</div>
        </AdminAuthGuard>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('403 Forbidden')).toBeDefined();
      expect(screen.getByText('Từ Chối Quyền Truy Cập')).toBeDefined();
      expect(
        screen.getByText(/không nằm trong danh sách Quản trị viên/i)
      ).toBeDefined();
    });
  });

  it('renders protected children when authenticated user is the Super Admin', async () => {
    useAuthStore.setState({
      user: {
        uid: 'founder-uid-123',
        email: 'thanhanhkhoi.work@gmail.com',
        displayName: 'Thành Anh Khôi',
        photoURL: null,
      },
      isInitialized: true,
    });

    render(
      <MemoryRouter>
        <AdminAuthGuard>
          <div>Trang Quản Trị Bí Mật</div>
        </AdminAuthGuard>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Trang Quản Trị Bí Mật')).toBeDefined();
    });
  });
});
