import { create } from 'zustand';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  AuthError,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../services/firebase';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  isAuthModalOpen: boolean;
  authModalTab: 'login' | 'register';

  // Actions
  openAuthModal: (tab?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  setAuthModalTab: (tab: 'login' | 'register') => void;
  clearError: () => void;

  loginWithGoogle: () => Promise<boolean>;
  loginWithEmail: (email: string, pass: string) => Promise<boolean>;
  registerWithEmail: (email: string, pass: string, displayName: string) => Promise<boolean>;
  logout: () => Promise<void>;
  initAuth: () => () => void;
}

/**
 * Translates Firebase Auth error codes into friendly Vietnamese messages.
 */
export function formatFirebaseAuthError(error: unknown): string {
  if (!error || typeof error !== 'object') {
    return 'Đã xảy ra lỗi không xác định. Vui lòng thử lại.';
  }

  const authError = error as AuthError;
  const code = authError.code || '';

  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.';
    case 'auth/email-already-in-use':
      return 'Địa chỉ email này đã được đăng ký. Vui lòng đăng nhập hoặc dùng email khác.';
    case 'auth/weak-password':
      return 'Mật khẩu quá ngắn. Vui lòng nhập mật khẩu tối thiểu 6 ký tự.';
    case 'auth/invalid-email':
      return 'Định dạng email không hợp lệ. Vui lòng kiểm tra lại.';
    case 'auth/popup-closed-by-user':
      return 'Cửa sổ đăng nhập Google đã bị đóng trước khi hoàn tất.';
    case 'auth/popup-blocked':
      return 'Trình duyệt đã chặn cửa sổ đăng nhập. Vui lòng cho phép popup để tiếp tục.';
    case 'auth/cancelled-popup-request':
      return 'Yêu cầu đăng nhập đã bị hủy.';
    case 'auth/network-request-failed':
      return 'Lỗi kết nối mạng. Vui lòng kiểm tra lại đường truyền internet.';
    case 'auth/too-many-requests':
      return 'Bạn đã thử đăng nhập sai quá nhiều lần. Vui lòng chờ vài phút rồi thử lại.';
    case 'auth/unauthorized-domain':
      return 'Tên miền trang web này chưa được cấp phép trong Firebase Console. Vui lòng vào Firebase Console > Authentication > Settings > Authorized domains và thêm tên miền này vào.';
    case 'auth/operation-not-allowed':
    case 'auth/configuration-not-found':
      return 'Phương thức đăng nhập này chưa được kích hoạt trên Firebase Console. Vui lòng liên hệ quản trị viên.';
    default:
      return authError.message || 'Đã xảy ra lỗi khi xác thực tài khoản. Vui lòng thử lại.';
  }
}

async function syncUserProfileToFirestore(firebaseUser: FirebaseUser | null): Promise<void> {
  if (!db || !firebaseUser?.uid) return;
  try {
    const userRef = doc(db, 'users', firebaseUser.uid);
    const userSnap = await getDoc(userRef);
    const now = new Date().toISOString();

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Người dùng',
        photoURL: firebaseUser.photoURL || null,
        role: 'user',
        status: 'active',
        createdAt: now,
        updatedAt: now,
      });
    } else {
      const existing = userSnap.data();
      const updates: Record<string, unknown> = {
        uid: firebaseUser.uid,
        updatedAt: now,
      };
      if (firebaseUser.email && !existing.email) updates.email = firebaseUser.email;
      if (
        firebaseUser.displayName &&
        (!existing.displayName || existing.displayName === 'Người dùng')
      ) {
        updates.displayName = firebaseUser.displayName;
      }
      if (firebaseUser.photoURL && !existing.photoURL) updates.photoURL = firebaseUser.photoURL;

      await setDoc(userRef, updates, { merge: true });
    }
  } catch (err) {
    // Non-blocking sync error
    console.warn('Lỗi đồng bộ hồ sơ người dùng lên Firestore:', err);
  }
}

function mapFirebaseUser(user: FirebaseUser | null): AuthUser | null {
  if (!user) return null;
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || user.email?.split('@')[0] || 'Người dùng',
    photoURL: user.photoURL,
  };
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isInitialized: false,
  error: null,
  isAuthModalOpen: false,
  authModalTab: 'login',

  openAuthModal: (tab = 'login') => {
    set({ isAuthModalOpen: true, authModalTab: tab, error: null });
  },

  closeAuthModal: () => {
    set({ isAuthModalOpen: false, error: null });
  },

  setAuthModalTab: (tab) => {
    set({ authModalTab: tab, error: null });
  },

  clearError: () => {
    set({ error: null });
  },

  loginWithGoogle: async () => {
    set({ isLoading: true, error: null });
    try {
      const result = await signInWithPopup(auth, googleProvider);
      syncUserProfileToFirestore(result.user).catch(() => {});
      set({
        user: mapFirebaseUser(result.user),
        isLoading: false,
        isAuthModalOpen: false,
        error: null,
      });
      return true;
    } catch (err) {
      const msg = formatFirebaseAuthError(err);
      set({ isLoading: false, error: msg });
      return false;
    }
  },

  loginWithEmail: async (email, pass) => {
    set({ isLoading: true, error: null });
    try {
      const result = await signInWithEmailAndPassword(auth, email.trim(), pass);
      syncUserProfileToFirestore(result.user).catch(() => {});
      set({
        user: mapFirebaseUser(result.user),
        isLoading: false,
        isAuthModalOpen: false,
        error: null,
      });
      return true;
    } catch (err) {
      const msg = formatFirebaseAuthError(err);
      set({ isLoading: false, error: msg });
      return false;
    }
  },

  registerWithEmail: async (email, pass, displayName) => {
    set({ isLoading: true, error: null });
    try {
      const result = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      if (displayName.trim()) {
        await updateProfile(result.user, { displayName: displayName.trim() });
      }
      syncUserProfileToFirestore(result.user).catch(() => {});
      set({
        user: mapFirebaseUser(result.user),
        isLoading: false,
        isAuthModalOpen: false,
        error: null,
      });
      return true;
    } catch (err) {
      const msg = formatFirebaseAuthError(err);
      set({ isLoading: false, error: msg });
      return false;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await signOut(auth);
      set({ user: null, isLoading: false, error: null });
    } catch (err) {
      set({ isLoading: false, error: formatFirebaseAuthError(err) });
    }
  },

  initAuth: () => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      set({
        user: mapFirebaseUser(firebaseUser),
        isLoading: false,
        isInitialized: true,
      });
      if (firebaseUser) {
        syncUserProfileToFirestore(firebaseUser).catch(() => {});
      }
    });
    return unsubscribe;
  },
}));
