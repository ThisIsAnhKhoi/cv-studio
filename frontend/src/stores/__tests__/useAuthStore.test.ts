import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuthStore, formatFirebaseAuthError } from '../useAuthStore';

// Mock Firebase auth functions
vi.mock('firebase/auth', () => ({
  signInWithPopup: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  updateProfile: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn((_auth, callback) => {
    callback(null);
    return () => {};
  }),
  GoogleAuthProvider: vi.fn().mockImplementation(() => ({
    setCustomParameters: vi.fn(),
  })),
  getAuth: vi.fn(() => ({})),
}));

vi.mock('../../services/firebase', () => ({
  auth: {},
  googleProvider: {},
  app: {},
  db: {},
}));

describe('useAuthStore & formatFirebaseAuthError', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      isLoading: false,
      isInitialized: true,
      error: null,
      isAuthModalOpen: false,
      authModalTab: 'login',
    });
    vi.clearAllMocks();
  });

  describe('formatFirebaseAuthError', () => {
    it('translates common credential errors to Vietnamese', () => {
      expect(formatFirebaseAuthError({ code: 'auth/invalid-credential' })).toContain('Email hoặc mật khẩu không chính xác');
      expect(formatFirebaseAuthError({ code: 'auth/user-not-found' })).toContain('Email hoặc mật khẩu không chính xác');
      expect(formatFirebaseAuthError({ code: 'auth/wrong-password' })).toContain('Email hoặc mật khẩu không chính xác');
    });

    it('translates registration conflicts and password strength', () => {
      expect(formatFirebaseAuthError({ code: 'auth/email-already-in-use' })).toContain('Địa chỉ email này đã được đăng ký');
      expect(formatFirebaseAuthError({ code: 'auth/weak-password' })).toContain('Mật khẩu quá ngắn');
      expect(formatFirebaseAuthError({ code: 'auth/invalid-email' })).toContain('Định dạng email không hợp lệ');
    });

    it('translates popup and network errors', () => {
      expect(formatFirebaseAuthError({ code: 'auth/popup-closed-by-user' })).toContain('Cửa sổ đăng nhập Google đã bị đóng');
      expect(formatFirebaseAuthError({ code: 'auth/network-request-failed' })).toContain('Lỗi kết nối mạng');
    });

    it('handles unknown or string errors gracefully', () => {
      expect(formatFirebaseAuthError(null)).toBe('Đã xảy ra lỗi không xác định. Vui lòng thử lại.');
      expect(formatFirebaseAuthError({ message: 'Custom error' })).toBe('Custom error');
    });
  });

  describe('Modal Actions', () => {
    it('opens auth modal with default or specified tab', () => {
      const { openAuthModal } = useAuthStore.getState();
      openAuthModal('register');

      expect(useAuthStore.getState().isAuthModalOpen).toBe(true);
      expect(useAuthStore.getState().authModalTab).toBe('register');

      openAuthModal('login');
      expect(useAuthStore.getState().authModalTab).toBe('login');
    });

    it('closes auth modal and clears error', () => {
      useAuthStore.setState({ isAuthModalOpen: true, error: 'Some error' });
      const { closeAuthModal } = useAuthStore.getState();

      closeAuthModal();
      expect(useAuthStore.getState().isAuthModalOpen).toBe(false);
      expect(useAuthStore.getState().error).toBe(null);
    });

    it('clears error', () => {
      useAuthStore.setState({ error: 'Some error' });
      useAuthStore.getState().clearError();
      expect(useAuthStore.getState().error).toBe(null);
    });
  });
});
