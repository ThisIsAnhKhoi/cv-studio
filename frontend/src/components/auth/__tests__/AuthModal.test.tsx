import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthModal } from '../AuthModal';
import { useAuthStore } from '../../../stores/useAuthStore';

describe('AuthModal Component', () => {
  beforeEach(() => {
    useAuthStore.setState({
      isAuthModalOpen: false,
      authModalTab: 'login',
      isLoading: false,
      error: null,
    });
  });

  it('renders nothing when isAuthModalOpen is false', () => {
    const { container } = render(<AuthModal />);
    expect(container.firstChild).toBeNull();
  });

  it('renders login tab when isAuthModalOpen is true', () => {
    useAuthStore.setState({ isAuthModalOpen: true, authModalTab: 'login' });
    render(<AuthModal />);

    expect(screen.getByText('Đăng Nhập CV Studio')).toBeDefined();
    expect(screen.getByPlaceholderText('name@example.com')).toBeDefined();
    expect(screen.getByText('Tiếp tục với Google')).toBeDefined();
  });

  it('switches to register tab when clicking register tab button', () => {
    useAuthStore.setState({ isAuthModalOpen: true, authModalTab: 'login' });
    render(<AuthModal />);

    const registerTabBtn = screen.getByRole('button', { name: /^đăng ký$/i });
    fireEvent.click(registerTabBtn);

    expect(screen.getByText('Tạo Tài Khoản Mới')).toBeDefined();
    expect(screen.getByPlaceholderText('Nguyễn Văn A')).toBeDefined();
  });

  it('calls closeAuthModal when close button is clicked', () => {
    const closeSpy = vi.fn();
    useAuthStore.setState({
      isAuthModalOpen: true,
      closeAuthModal: closeSpy,
    });

    render(<AuthModal />);
    const closeBtn = screen.getByRole('button', { name: /đóng/i });
    fireEvent.click(closeBtn);

    expect(closeSpy).toHaveBeenCalledTimes(1);
  });
});
