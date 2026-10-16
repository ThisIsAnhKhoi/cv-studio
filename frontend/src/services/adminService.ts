import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  writeBatch,
  getCountFromServer,
} from 'firebase/firestore';
import { db } from './firebase';
import { AuthUser } from '../stores/useAuthStore';
import { CVData, UserProfileData, AuditLogEntry, UserRole } from '../types/cv';

export const SUPER_ADMIN_EMAIL = 'thanhanhkhoi.work@gmail.com';

export interface AdminPermissions {
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isModerator: boolean;
}

export interface AdminMetrics {
  totalUsers: number;
  totalCVs: number;
  publicCVs: number;
  disabledCVs: number;
}

/**
 * Checks role permissions for a given authenticated user.
 * Prioritizes hardcoded fail-safe whitelist for founder.
 */
export async function checkAdminPermissions(user: AuthUser | null): Promise<AdminPermissions> {
  if (!user || !user.uid) {
    return { isSuperAdmin: false, isAdmin: false, isModerator: false };
  }

  // 1. Founder hardcoded fail-safe check
  if (user.email && user.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
    return { isSuperAdmin: true, isAdmin: true, isModerator: true };
  }

  if (!db) {
    return { isSuperAdmin: false, isAdmin: false, isModerator: false };
  }

  try {
    // 2. Check collection 'admins'
    const adminDocRef = doc(db, 'admins', user.uid);
    const adminSnap = await getDoc(adminDocRef);
    if (adminSnap.exists()) {
      return { isSuperAdmin: false, isAdmin: true, isModerator: true };
    }

    // 3. Check collection 'moderators'
    const modDocRef = doc(db, 'moderators', user.uid);
    const modSnap = await getDoc(modDocRef);
    if (modSnap.exists()) {
      return { isSuperAdmin: false, isAdmin: false, isModerator: true };
    }
  } catch (err) {
    console.warn('Lỗi khi kiểm tra phân quyền quản trị:', err);
  }

  return { isSuperAdmin: false, isAdmin: false, isModerator: false };
}

/**
 * Aggregates 4 high-level admin metrics using lightweight Firestore count() queries.
 */
export async function getAdminMetrics(): Promise<AdminMetrics> {
  if (!db) {
    return { totalUsers: 0, totalCVs: 8, publicCVs: 8, disabledCVs: 0 };
  }

  try {
    const usersCountSnap = await getCountFromServer(collection(db, 'users'));
    const cvsCountSnap = await getCountFromServer(collection(db, 'cvs'));
    const publicCountSnap = await getCountFromServer(
      query(collection(db, 'cvs'), where('isPublic', '==', true), where('status', '==', 'active'))
    );
    const disabledCountSnap = await getCountFromServer(
      query(collection(db, 'cvs'), where('status', '==', 'disabled'))
    );

    return {
      totalUsers: usersCountSnap.data().count,
      totalCVs: cvsCountSnap.data().count,
      publicCVs: publicCountSnap.data().count,
      disabledCVs: disabledCountSnap.data().count,
    };
  } catch (err) {
    console.warn('Lỗi khi lấy chỉ số admin metrics, fallback sang đếm client:', err);
    try {
      const snap = await getDocs(collection(db, 'cvs'));
      let publicCount = 0;
      let disabledCount = 0;
      snap.forEach((d) => {
        const data = d.data();
        if (data.isPublic && data.status === 'active') publicCount++;
        if (data.status === 'disabled') disabledCount++;
      });
      return {
        totalUsers: 0,
        totalCVs: snap.size,
        publicCVs: publicCount,
        disabledCVs: disabledCount,
      };
    } catch {
      return { totalUsers: 0, totalCVs: 8, publicCVs: 8, disabledCVs: 0 };
    }
  }
}

/**
 * Fetches all CVs for Admin moderation.
 */
export async function getAllCVsForAdmin(): Promise<CVData[]> {
  if (!db) return [];
  try {
    const q = query(collection(db, 'cvs'), orderBy('updatedAt', 'desc'), limit(100));
    const snap = await getDocs(q);
    const list: CVData[] = [];
    snap.forEach((d) => {
      list.push(d.data() as CVData);
    });
    return list;
  } catch (err) {
    console.warn('Lỗi khi tải danh sách CV cho Admin:', err);
    return [];
  }
}

/**
 * Soft-deletes a CV and creates an immutable audit log atomically.
 */
export async function disableCV(cvId: string, actor: AuthUser, reason: string): Promise<void> {
  if (!db || !cvId) return;
  if (!reason || reason.trim().length < 5) {
    throw new Error('Lý do vô hiệu hóa bắt buộc phải có tối thiểu 5 ký tự.');
  }

  const batch = writeBatch(db);
  const now = new Date().toISOString();

  // 1. Update CV document
  const cvRef = doc(db, 'cvs', cvId);
  batch.update(cvRef, {
    status: 'disabled',
    disabledAt: now,
    disabledBy: actor.uid,
    disabledReason: reason.trim(),
    updatedAt: now,
  });

  // 2. Append immutable audit log
  const logId = `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const logRef = doc(db, 'auditLogs', logId);
  const logEntry: AuditLogEntry = {
    id: logId,
    actorUid: actor.uid,
    actorEmail: actor.email || 'unknown',
    action: 'DISABLE_CV',
    targetType: 'cv',
    targetId: cvId,
    reason: reason.trim(),
    timestamp: now,
  };
  batch.set(logRef, logEntry);

  await batch.commit();
}

/**
 * Restores a disabled CV and creates an immutable audit log atomically.
 */
export async function restoreCV(cvId: string, actor: AuthUser, reason: string): Promise<void> {
  if (!db || !cvId) return;
  if (!reason || reason.trim().length < 5) {
    throw new Error('Lý do khôi phục bắt buộc phải có tối thiểu 5 ký tự.');
  }

  const batch = writeBatch(db);
  const now = new Date().toISOString();

  // 1. Restore CV document
  const cvRef = doc(db, 'cvs', cvId);
  batch.update(cvRef, {
    status: 'active',
    disabledAt: null,
    disabledBy: null,
    disabledReason: null,
    updatedAt: now,
  });

  // 2. Append immutable audit log
  const logId = `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const logRef = doc(db, 'auditLogs', logId);
  const logEntry: AuditLogEntry = {
    id: logId,
    actorUid: actor.uid,
    actorEmail: actor.email || 'unknown',
    action: 'RESTORE_CV',
    targetType: 'cv',
    targetId: cvId,
    reason: reason.trim(),
    timestamp: now,
  };
  batch.set(logRef, logEntry);

  await batch.commit();
}

/**
 * Fetches all registered users for Admin account management.
 */
export async function getAllUsersForAdmin(): Promise<UserProfileData[]> {
  if (!db) return [];
  try {
    const q = query(collection(db, 'users'), limit(100));
    const snap = await getDocs(q);
    const list: UserProfileData[] = [];
    snap.forEach((d) => {
      list.push(d.data() as UserProfileData);
    });
    return list;
  } catch (err) {
    console.warn('Lỗi khi tải danh sách người dùng cho Admin:', err);
    return [];
  }
}

/**
 * Disables a user account and denormalizes ownerDisabled: true onto all their CVs in a batch.
 */
export async function disableUser(targetUid: string, actor: AuthUser, reason: string): Promise<void> {
  if (!db || !targetUid) return;
  if (targetUid === actor.uid) {
    throw new Error('An toàn hệ thống: Bạn không thể tự khóa tài khoản của chính mình!');
  }
  if (!reason || reason.trim().length < 5) {
    throw new Error('Lý do khóa tài khoản bắt buộc phải có tối thiểu 5 ký tự.');
  }

  const batch = writeBatch(db);
  const now = new Date().toISOString();

  // 1. Update user profile document
  const userRef = doc(db, 'users', targetUid);
  batch.set(
    userRef,
    {
      status: 'disabled',
      disabledAt: now,
      disabledBy: actor.uid,
      disabledReason: reason.trim(),
      updatedAt: now,
    },
    { merge: true }
  );

  // 2. Query all CVs owned by target user to mark ownerDisabled: true
  const userCVsQuery = query(collection(db, 'cvs'), where('userId', '==', targetUid));
  const cvsSnap = await getDocs(userCVsQuery);
  cvsSnap.forEach((docSnap) => {
    batch.update(docSnap.ref, { ownerDisabled: true });
  });

  // 3. Append immutable audit log
  const logId = `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const logRef = doc(db, 'auditLogs', logId);
  const logEntry: AuditLogEntry = {
    id: logId,
    actorUid: actor.uid,
    actorEmail: actor.email || 'unknown',
    action: 'LOCK_USER',
    targetType: 'user',
    targetId: targetUid,
    reason: reason.trim(),
    timestamp: now,
  };
  batch.set(logRef, logEntry);

  await batch.commit();
}

/**
 * Unlocks a user account and restores ownerDisabled: false onto all their CVs in a batch.
 */
export async function unlockUser(targetUid: string, actor: AuthUser, reason: string): Promise<void> {
  if (!db || !targetUid) return;
  if (!reason || reason.trim().length < 5) {
    throw new Error('Lý do mở khóa bắt buộc phải có tối thiểu 5 ký tự.');
  }

  const batch = writeBatch(db);
  const now = new Date().toISOString();

  // 1. Update user profile document
  const userRef = doc(db, 'users', targetUid);
  batch.set(
    userRef,
    {
      status: 'active',
      disabledAt: null,
      disabledBy: null,
      disabledReason: null,
      updatedAt: now,
    },
    { merge: true }
  );

  // 2. Query all CVs owned by target user to mark ownerDisabled: false
  const userCVsQuery = query(collection(db, 'cvs'), where('userId', '==', targetUid));
  const cvsSnap = await getDocs(userCVsQuery);
  cvsSnap.forEach((docSnap) => {
    batch.update(docSnap.ref, { ownerDisabled: false });
  });

  // 3. Append immutable audit log
  const logId = `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const logRef = doc(db, 'auditLogs', logId);
  const logEntry: AuditLogEntry = {
    id: logId,
    actorUid: actor.uid,
    actorEmail: actor.email || 'unknown',
    action: 'UNLOCK_USER',
    targetType: 'user',
    targetId: targetUid,
    reason: reason.trim(),
    timestamp: now,
  };
  batch.set(logRef, logEntry);

  await batch.commit();
}

/**
 * Changes user role (user <-> moderator) with safety guards and logs action.
 */
export async function changeUserRole(
  targetUid: string,
  newRole: UserRole,
  actor: AuthUser,
  reason: string
): Promise<void> {
  if (!db || !targetUid) return;
  if (targetUid === actor.uid && newRole !== 'admin') {
    throw new Error('An toàn hệ thống: Bạn không thể tự hạ quyền của chính mình!');
  }
  if (!reason || reason.trim().length < 5) {
    throw new Error('Lý do thay đổi vai trò bắt buộc phải có tối thiểu 5 ký tự.');
  }

  const batch = writeBatch(db);
  const now = new Date().toISOString();

  // 1. Update user profile document
  const userRef = doc(db, 'users', targetUid);
  batch.set(userRef, { role: newRole, updatedAt: now }, { merge: true });

  // 2. Update moderators collection
  const modRef = doc(db, 'moderators', targetUid);
  if (newRole === 'moderator') {
    batch.set(modRef, { assignedBy: actor.uid, assignedAt: now });
  } else {
    batch.delete(modRef);
  }

  // 3. Append immutable audit log
  const logId = `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const logRef = doc(db, 'auditLogs', logId);
  const logEntry: AuditLogEntry = {
    id: logId,
    actorUid: actor.uid,
    actorEmail: actor.email || 'unknown',
    action: 'CHANGE_ROLE',
    targetType: 'user',
    targetId: targetUid,
    reason: reason.trim(),
    metadata: { newRole },
    timestamp: now,
  };
  batch.set(logRef, logEntry);

  await batch.commit();
}

/**
 * Fetches immutable audit logs sorted by timestamp descending.
 */
export async function getAuditLogs(): Promise<AuditLogEntry[]> {
  if (!db) return [];
  try {
    const q = query(collection(db, 'auditLogs'), orderBy('timestamp', 'desc'), limit(100));
    const snap = await getDocs(q);
    const list: AuditLogEntry[] = [];
    snap.forEach((d) => {
      list.push(d.data() as AuditLogEntry);
    });
    return list;
  } catch (err) {
    console.warn('Lỗi khi tải nhật ký kiểm toán:', err);
    return [];
  }
}
