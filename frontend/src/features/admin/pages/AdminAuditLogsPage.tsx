import React, { useState, useEffect, useMemo } from 'react';
import {
  ScrollText,
  Search,
  Filter,
  Ban,
  CheckCircle2,
  Lock,
  Unlock,
  ShieldCheck,
  Shield,
  Loader2,
  RefreshCw,
  Clock,
  User,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { getAuditLogs } from '../../../services/adminService';
import { AuditLogEntry, AdminActionType } from '../../../types/cv';
import { removeVietnameseTones } from '../../../utils/text';

export const AdminAuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedAction, setSelectedAction] = useState<'all' | AdminActionType>('all');

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const data = await getAuditLogs();
      setLogs(data);
    } catch (err) {
      console.warn('Lỗi khi tải nhật ký kiểm toán:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (selectedAction !== 'all' && log.action !== selectedAction) return false;

      if (searchQuery.trim()) {
        const cleanQuery = removeVietnameseTones(searchQuery.trim().toLowerCase());
        const actor = removeVietnameseTones(log.actorEmail || '').toLowerCase();
        const target = (log.targetId || '').toLowerCase();
        const reason = removeVietnameseTones(log.reason || '').toLowerCase();
        const action = (log.action || '').toLowerCase();

        const matches =
          actor.includes(cleanQuery) ||
          target.includes(cleanQuery) ||
          reason.includes(cleanQuery) ||
          action.includes(cleanQuery);

        if (!matches) return false;
      }

      return true;
    });
  }, [logs, searchQuery, selectedAction]);

  const renderActionBadge = (action: AdminActionType) => {
    switch (action) {
      case 'DISABLE_CV':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.8 rounded-lg text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
            <Ban className="w-3 h-3" />
            Khóa CV
          </span>
        );
      case 'RESTORE_CV':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.8 rounded-lg text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            <CheckCircle2 className="w-3 h-3" />
            Khôi Phục CV
          </span>
        );
      case 'LOCK_USER':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.8 rounded-lg text-[11px] font-bold bg-red-500/20 text-red-300 border border-red-500/40">
            <Lock className="w-3 h-3" />
            Khóa Tài Khoản
          </span>
        );
      case 'UNLOCK_USER':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.8 rounded-lg text-[11px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40">
            <Unlock className="w-3 h-3" />
            Mở Khóa Tài Khoản
          </span>
        );
      case 'CHANGE_ROLE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.8 rounded-lg text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <ShieldCheck className="w-3 h-3" />
            Đổi Vai Trò
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.8 rounded-lg text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
            {action}
          </span>
        );
    }
  };

  const formatTimestamp = (isoString?: string) => {
    if (!isoString) return '—';
    try {
      const d = new Date(isoString);
      return `${d.toLocaleDateString('vi-VN')} ${d.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })}`;
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight flex items-center gap-3">
            <span>Nhật Ký Kiểm Toán</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {logs.length} sự kiện
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Bản ghi bất biến của mọi quyết định kiểm duyệt, phân quyền và khóa tài khoản trên hệ thống.
          </p>
        </div>

        <button
          type="button"
          onClick={loadLogs}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer disabled:opacity-50 self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-teal-400' : ''}`} />
          <span>Làm Mới</span>
        </button>
      </div>

      {/* Security Immutable Banner */}
      <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-900/40 text-xs text-rose-300 flex items-start gap-3">
        <Shield className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-rose-200">Bảo Chứng Toàn Vẹn Dữ Liệu Kiểm Toán (Audit Immutability)</p>
          <p className="text-rose-300/80 text-[11px] mt-0.5">
            Nhật ký kiểm toán được bảo vệ bởi Firestore Security Rules ở tầng database: chỉ có thể thêm mới (create-only), nghiêm cấm sửa đổi (update: false) hoặc xóa bỏ (delete: false) dưới bất kỳ thẩm quyền nào.
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo email người thực hiện, ID đối tượng, lý do..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-hidden focus:border-rose-500 transition-colors"
            />
          </div>

          {/* Action Filter */}
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value as 'all' | AdminActionType)}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-hidden focus:border-rose-500 transition-colors cursor-pointer"
          >
            <option value="all">Tất cả loại thao tác</option>
            <option value="DISABLE_CV">Khóa hiển thị hồ sơ CV</option>
            <option value="RESTORE_CV">Khôi phục hiển thị hồ sơ CV</option>
            <option value="LOCK_USER">Khóa tài khoản người dùng</option>
            <option value="UNLOCK_USER">Mở khóa tài khoản người dùng</option>
            <option value="CHANGE_ROLE">Thay đổi phân quyền vai trò</option>
          </select>
        </div>

        {/* Counter */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
          <span>
            Đang hiển thị <strong className="text-slate-200">{filteredLogs.length}</strong> / {logs.length} bản ghi
          </span>
          {(searchQuery || selectedAction !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedAction('all');
              }}
              className="text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
            >
              Đặt lại bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* Logs Table */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
          <span className="text-xs text-slate-400">Đang tải lịch sử kiểm toán...</span>
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-slate-800/40 border border-slate-700/60 p-8 space-y-3">
          <ScrollText className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">Chưa có bản ghi kiểm toán nào</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Hệ thống chưa ghi nhận sự kiện nào khớp với điều kiện tìm kiếm.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl bg-slate-800/70 border border-slate-700/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-700/80 bg-slate-900/60 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-4">Thời Gian</th>
                  <th className="py-3 px-4">Người Thực Hiện</th>
                  <th className="py-3 px-4">Hành Động</th>
                  <th className="py-3 px-4">Đối Tượng</th>
                  <th className="py-3 px-4">Lý Do & Chi Tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50 text-xs">
                {filteredLogs.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-750/50 transition-colors">
                    {/* Time */}
                    <td className="py-3.5 px-4 text-slate-300 font-mono text-[11px] whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>{formatTimestamp(entry.timestamp)}</span>
                      </div>
                    </td>

                    {/* Actor */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-slate-700 flex items-center justify-center text-slate-300 shrink-0">
                          <User className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-white truncate max-w-[160px] sm:max-w-[200px]">
                            {entry.actorEmail}
                          </p>
                          <span className="text-[10px] text-slate-500 font-mono truncate block max-w-[140px]">
                            UID: {entry.actorUid}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {renderActionBadge(entry.action)}
                    </td>

                    {/* Target */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        {entry.targetType === 'cv' ? (
                          <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        ) : (
                          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        )}
                        <span className="font-mono text-slate-300 text-[11px] truncate max-w-[120px] sm:max-w-[160px]" title={entry.targetId}>
                          {entry.targetId}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">
                        {entry.targetType}
                      </span>
                    </td>

                    {/* Reason & Metadata */}
                    <td className="py-3.5 px-4">
                      <p className="text-slate-200 text-xs font-medium max-w-sm sm:max-w-md">
                        {entry.reason}
                      </p>
                      {entry.metadata && Object.keys(entry.metadata).length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {Object.entries(entry.metadata).map(([k, v]) => (
                            <span
                              key={k}
                              className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-900 border border-slate-700 text-slate-400"
                            >
                              {k}: {String(v)}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
