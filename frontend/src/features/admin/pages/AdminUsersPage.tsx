import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Search,
  Shield,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  UserX,
  Lock,
  Unlock,
  Loader2,
  RefreshCw,
  X,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import {
  getAllUsersForAdmin,
  disableUser,
  unlockUser,
  changeUserRole,
  SUPER_ADMIN_EMAIL,
} from '../../../services/adminService';
import { UserProfileData, UserRole } from '../../../types/cv';
import { removeVietnameseTones } from '../../../utils/text';
import { useAuthStore } from '../../../stores/useAuthStore';

export const AdminUsersPage: React.FC = () => {
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState<UserProfileData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<'all' | UserRole>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'disabled'>('all');

  // Modal State for Lock/Unlock Action
  const [lockModalTarget, setLockModalTarget] = useState<UserProfileData | null>(null);
  const [lockModalType, setLockModalType] = useState<'lock' | 'unlock'>('lock');

  // Modal State for Change Role Action
  const [roleModalTarget, setRoleModalTarget] = useState<UserProfileData | null>(null);
  const [targetNewRole, setTargetNewRole] = useState<UserRole>('moderator');

  // Form Fields
  const [actionReason, setActionReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const list = await getAllUsersForAdmin();
      setUsers(list);
    } catch (err) {
      console.warn('Lỗi khi tải danh sách người dùng:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      // 1. Role Filter
      if (selectedRole !== 'all' && u.role !== selectedRole) return false;

      // 2. Status Filter
      if (selectedStatus === 'active' && u.status === 'disabled') return false;
      if (selectedStatus === 'disabled' && u.status !== 'disabled') return false;

      // 3. Search Filter
      if (searchQuery.trim()) {
        const cleanQuery = removeVietnameseTones(searchQuery.trim().toLowerCase());
        const name = removeVietnameseTones(u.displayName || '').toLowerCase();
        const email = (u.email || '').toLowerCase();
        const uid = (u.uid || '').toLowerCase();

        const matches = name.includes(cleanQuery) || email.includes(cleanQuery) || uid.includes(cleanQuery);
        if (!matches) return false;
      }

      return true;
    });
  }, [users, searchQuery, selectedRole, selectedStatus]);

  // Handle Lock/Unlock Modal
  const handleOpenLockModal = (target: UserProfileData, type: 'lock' | 'unlock') => {
    setLockModalTarget(target);
    setLockModalType(type);
    setActionReason('');
    setActionError(null);
  };

  const handleCloseLockModal = () => {
    if (isSubmitting) return;
    setLockModalTarget(null);
    setActionReason('');
    setActionError(null);
  };

  const handleSubmitLockAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lockModalTarget || !currentUser) return;

    if (!actionReason || actionReason.trim().length < 5) {
      setActionError('Lý do thực hiện bắt buộc phải có ít nhất 5 ký tự.');
      return;
    }

    setIsSubmitting(true);
    setActionError(null);

    try {
      if (lockModalType === 'lock') {
        await disableUser(lockModalTarget.uid, currentUser, actionReason);
        setUsers((prev) =>
          prev.map((u) =>
            u.uid === lockModalTarget.uid
              ? {
                  ...u,
                  status: 'disabled',
                  disabledReason: actionReason.trim(),
                  disabledBy: currentUser.uid,
                }
              : u
          )
        );
        setSuccessToast(`Đã khóa tài khoản "${lockModalTarget.email || lockModalTarget.displayName}".`);
      } else {
        await unlockUser(lockModalTarget.uid, currentUser, actionReason);
        setUsers((prev) =>
          prev.map((u) =>
            u.uid === lockModalTarget.uid
              ? {
                  ...u,
                  status: 'active',
                  disabledReason: undefined,
                  disabledBy: undefined,
                }
              : u
          )
        );
        setSuccessToast(`Đã mở khóa tài khoản "${lockModalTarget.email || lockModalTarget.displayName}".`);
      }

      setLockModalTarget(null);
      setTimeout(() => setSuccessToast(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi khi cập nhật trạng thái tài khoản.';
      setActionError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Change Role Modal
  const handleOpenRoleModal = (target: UserProfileData) => {
    setRoleModalTarget(target);
    setTargetNewRole(target.role === 'moderator' ? 'user' : 'moderator');
    setActionReason('');
    setActionError(null);
  };

  const handleCloseRoleModal = () => {
    if (isSubmitting) return;
    setRoleModalTarget(null);
    setActionReason('');
    setActionError(null);
  };

  const handleSubmitRoleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleModalTarget || !currentUser) return;

    if (!actionReason || actionReason.trim().length < 5) {
      setActionError('Lý do đổi vai trò bắt buộc phải có ít nhất 5 ký tự.');
      return;
    }

    setIsSubmitting(true);
    setActionError(null);

    try {
      await changeUserRole(roleModalTarget.uid, targetNewRole, currentUser, actionReason);
      setUsers((prev) =>
        prev.map((u) =>
          u.uid === roleModalTarget.uid
            ? {
                ...u,
                role: targetNewRole,
              }
            : u
        )
      );
      setSuccessToast(
        `Đã đổi quyền của ${roleModalTarget.email || roleModalTarget.displayName} thành ${targetNewRole.toUpperCase()}.`
      );
      setRoleModalTarget(null);
      setTimeout(() => setSuccessToast(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi khi thay đổi vai trò người dùng.';
      setActionError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-emerald-950/95 border border-emerald-500/50 text-emerald-200 px-4 py-3 rounded-2xl shadow-xl backdrop-blur-md animate-fade-in text-xs font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight flex items-center gap-3">
            <span>Quản Lý Người Dùng</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {users.length} tài khoản
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Phân quyền kiểm duyệt viên, kiểm soát an ninh tài khoản và bảo vệ toàn vẹn hệ thống.
          </p>
        </div>

        <button
          type="button"
          onClick={loadUsers}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer disabled:opacity-50 self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-teal-400' : ''}`} />
          <span>Làm Mới</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên, email, UID..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-hidden focus:border-rose-500 transition-colors"
            />
          </div>

          {/* Role Filter */}
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as 'all' | UserRole)}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-hidden focus:border-rose-500 transition-colors cursor-pointer"
          >
            <option value="all">Tất cả vai trò</option>
            <option value="user">Người dùng (User)</option>
            <option value="moderator">Kiểm duyệt viên (Moderator)</option>
            <option value="admin">Quản trị viên (Admin)</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as 'all' | 'active' | 'disabled')}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-hidden focus:border-rose-500 transition-colors cursor-pointer"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Hoạt động (Active)</option>
            <option value="disabled">Đang bị khóa (Disabled)</option>
          </select>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
          <span>
            Đang hiển thị <strong className="text-slate-200">{filteredUsers.length}</strong> / {users.length} tài khoản
          </span>
          {(searchQuery || selectedRole !== 'all' || selectedStatus !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedRole('all');
                setSelectedStatus('all');
              }}
              className="text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
            >
              Đặt lại bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* User Table */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
          <span className="text-xs text-slate-400">Đang tải danh sách tài khoản...</span>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-slate-800/40 border border-slate-700/60 p-8 space-y-3">
          <Users className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">Không tìm thấy tài khoản nào</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Không có người dùng nào khớp với bộ lọc hoặc từ khóa tìm kiếm.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl bg-slate-800/70 border border-slate-700/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-700/80 bg-slate-900/60 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-4">Người Dùng</th>
                  <th className="py-3 px-4">Vai Trò</th>
                  <th className="py-3 px-4">Trạng Thái</th>
                  <th className="py-3 px-4">Ngày Tham Gia</th>
                  <th className="py-3 px-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50 text-xs">
                {filteredUsers.map((item) => {
                  const isItemDisabled = item.status === 'disabled';
                  const isCurrent = currentUser?.uid === item.uid;
                  const isSuperAdminUser =
                    item.email?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();

                  return (
                    <tr
                      key={item.uid}
                      className={`hover:bg-slate-750/50 transition-colors ${
                        isItemDisabled ? 'bg-rose-950/15' : ''
                      }`}
                    >
                      {/* User Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-700 border border-slate-600/80 flex items-center justify-center font-bold text-white shrink-0 overflow-hidden">
                            {item.photoURL ? (
                              <img
                                src={item.photoURL}
                                alt={item.displayName || 'Avatar'}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span>{(item.displayName || item.email || 'U').charAt(0).toUpperCase()}</span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="font-bold text-white truncate max-w-[180px] sm:max-w-[240px]">
                                {item.displayName || 'Chưa đặt tên'}
                              </p>
                              {isCurrent && (
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-teal-500/20 text-teal-300 border border-teal-500/40">
                                  Bạn
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400 truncate max-w-[200px]">
                              {item.email || 'Không có email'}
                            </p>
                            <span className="text-[10px] text-slate-500 font-mono">UID: {item.uid}</span>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-3.5 px-4">
                        {item.role === 'admin' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                            <ShieldAlert className="w-3.5 h-3.5" />
                            Admin
                          </span>
                        ) : item.role === 'moderator' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Moderator
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-900 border border-slate-700 text-slate-300">
                            <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                            Thành Viên
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {isItemDisabled ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                            <Lock className="w-3 h-3" />
                            Đã Khóa
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            <CheckCircle2 className="w-3 h-3" />
                            Hoạt Động
                          </span>
                        )}
                      </td>

                      {/* Created At */}
                      <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : '—'}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          {/* Role Switcher Button */}
                          {!isSuperAdminUser && (
                            <button
                              type="button"
                              onClick={() => handleOpenRoleModal(item)}
                              disabled={isCurrent}
                              title={isCurrent ? 'Bạn không thể tự đổi vai trò của mình' : 'Thay đổi quyền'}
                              className="px-2 py-1.5 rounded-lg bg-slate-700/80 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-semibold transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              Đổi Quyền
                            </button>
                          )}

                          {/* Lock / Unlock Account Button */}
                          {!isSuperAdminUser && (
                            isItemDisabled ? (
                              <button
                                type="button"
                                onClick={() => handleOpenLockModal(item, 'unlock')}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-semibold transition-colors cursor-pointer"
                              >
                                <Unlock className="w-3 h-3" />
                                <span>Mở Khóa</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleOpenLockModal(item, 'lock')}
                                disabled={isCurrent}
                                title={isCurrent ? 'Bạn không thể tự khóa tài khoản của mình' : 'Khóa tài khoản'}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-[11px] font-semibold transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                              >
                                <Lock className="w-3 h-3" />
                                <span>Khóa</span>
                              </button>
                            )
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Lock/Unlock Modal */}
      {lockModalTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    lockModalType === 'lock'
                      ? 'bg-rose-500/20 text-rose-400'
                      : 'bg-emerald-500/20 text-emerald-400'
                  }`}
                >
                  {lockModalType === 'lock' ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">
                    {lockModalType === 'lock' ? 'Khóa Tài Khoản Người Dùng' : 'Mở Khóa Tài Khoản'}
                  </h3>
                  <p className="text-[11px] text-slate-400">Đồng bộ tự động trạng thái hồ sơ của người dùng</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseLockModal}
                disabled={isSubmitting}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700 text-xs space-y-1">
              <p className="text-slate-300">
                <strong className="text-white">Người dùng:</strong> {lockModalTarget.displayName || 'Chưa đặt tên'}
              </p>
              <p className="text-slate-400">
                <strong>Email:</strong> {lockModalTarget.email || '—'}
              </p>
              {lockModalType === 'lock' && (
                <p className="text-amber-400 text-[11px] font-semibold pt-1">
                  * Toàn bộ hồ sơ CV thuộc người dùng này sẽ tự động ẩn khỏi cộng đồng cho đến khi được mở khóa.
                </p>
              )}
            </div>

            <form onSubmit={handleSubmitLockAction} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-200 block">
                  Lý do thực hiện <span className="text-rose-400">*</span>
                  <span className="text-[10px] text-slate-400 font-normal ml-1">
                    (Ghi vào nhật ký kiểm toán không thể xóa)
                  </span>
                </label>
                <textarea
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  placeholder={
                    lockModalType === 'lock'
                      ? 'Ví dụ: Vi phạm điều khoản bảo mật, spam nội dung...'
                      : 'Ví dụ: Người dùng đã khiếu nại thành công và xác minh lại...'
                  }
                  rows={3}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-hidden focus:border-rose-500 transition-colors"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Tối thiểu 5 ký tự</span>
                  <span>{actionReason.trim().length} ký tự</span>
                </div>
              </div>

              {actionError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{actionError}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleCloseLockModal}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || actionReason.trim().length < 5}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all cursor-pointer disabled:opacity-50 ${
                    lockModalType === 'lock'
                      ? 'bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-900/30'
                      : 'bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-900/30'
                  }`}
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{lockModalType === 'lock' ? 'Xác Nhận Khóa' : 'Xác Nhận Mở Khóa'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Role Modal */}
      {roleModalTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Thay Đổi Quyền Hạn</h3>
                  <p className="text-[11px] text-slate-400">Phân quyền vai trò hệ thống</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseRoleModal}
                disabled={isSubmitting}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700 text-xs space-y-1">
              <p className="text-slate-300">
                <strong className="text-white">Người dùng:</strong> {roleModalTarget.displayName || roleModalTarget.email}
              </p>
              <p className="text-slate-400">
                <strong>Vai trò hiện tại:</strong>{' '}
                <span className="uppercase font-bold text-teal-400">{roleModalTarget.role || 'user'}</span>
              </p>
            </div>

            <form onSubmit={handleSubmitRoleAction} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-200 block">Chọn vai trò mới</label>
                <select
                  value={targetNewRole}
                  onChange={(e) => setTargetNewRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:outline-hidden focus:border-rose-500 transition-colors cursor-pointer"
                >
                  <option value="user">Người dùng (User) - Quyền tiêu chuẩn</option>
                  <option value="moderator">Kiểm duyệt viên (Moderator) - Quyền kiểm duyệt CV</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-200 block">
                  Lý do thay đổi <span className="text-rose-400">*</span>
                </label>
                <textarea
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  placeholder="Ví dụ: Bổ nhiệm làm kiểm duyệt viên nội dung ngành IT..."
                  rows={3}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-hidden focus:border-rose-500 transition-colors"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Tối thiểu 5 ký tự</span>
                  <span>{actionReason.trim().length} ký tự</span>
                </div>
              </div>

              {actionError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{actionError}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleCloseRoleModal}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || actionReason.trim().length < 5}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-md shadow-teal-900/30 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Xác Nhận Đổi Quyền</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
