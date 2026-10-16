import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserDropdown } from '../UserDropdown';
import { useAuthStore } from '../../../stores/useAuthStore';

describe('UserDropdown Component', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      isLoading: false,
    });
  });

  it('renders nothing when user is not logged in', () => {
    const { container } = render(
      <MemoryRouter>
        <UserDropdown />
      </MemoryRouter>
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders user button with display name when user is logged in', () => {
    useAuthStore.setState({
      user: {
        uid: 'user-test-1',
        email: 'test@example.com',
        displayName: 'Trần Anh Khôi',
        photoURL: null,
      },
    });

    render(
      <MemoryRouter>
        <UserDropdown />
      </MemoryRouter>
    );

    const button = screen.getByRole('button', { name: /menu tài khoản người dùng/i });
    expect(button).toBeDefined();
    expect(screen.getByText('Trần Anh Khôi')).toBeDefined();
  });

  it('opens dropdown menu on click and displays navigation links and logout button', () => {
    const mockLogout = vi.fn().mockResolvedValue(undefined);
    useAuthStore.setState({
      user: {
        uid: 'user-test-1',
        email: 'test@example.com',
        displayName: 'Trần Anh Khôi',
        photoURL: null,
      },
      logout: mockLogout,
    });

    render(
      <MemoryRouter>
        <UserDropdown />
      </MemoryRouter>
    );

    const button = screen.getByRole('button', { name: /menu tài khoản người dùng/i });
    fireEvent.click(button);

    // Check menu options
    expect(screen.getByText(/quản lý cv \(dashboard\)/i)).toBeDefined();
    expect(screen.getByText(/tạo cv mới/i)).toBeDefined();
    expect(screen.getByText(/đăng xuất/i)).toBeDefined();

    // Trigger logout
    const logoutBtn = screen.getByText(/đăng xuất/i);
    fireEvent.click(logoutBtn);
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
