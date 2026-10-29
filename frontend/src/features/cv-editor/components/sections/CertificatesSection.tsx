import React, { useState } from 'react';
import { CertificateItem } from '../../../../types/cv';
import {
  Plus,
  Trash2,
  Award,
  GripVertical,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';

interface CertificatesSectionProps {
  certificates: CertificateItem[];
  onAdd: () => void;
  onUpdate: (id: string, field: keyof CertificateItem, value: any) => void;
  onRemove: (id: string) => void;
  onReorder?: (startIndex: number, endIndex: number) => void;
}

export const CertificatesSection: React.FC<CertificatesSectionProps> = ({
  certificates = [],
  onAdd,
  onUpdate,
  onRemove,
  onReorder,
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [dragEnabledIndex, setDragEnabledIndex] = useState<number | null>(null);

  const handleDragStart = (index: number, e: React.DragEvent<HTMLDivElement>) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
  };

  const handleDragOver = (index: number, e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (targetIndex: number, e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== targetIndex && onReorder) {
      onReorder(draggedIndex, targetIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
    setDragEnabledIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
    setDragEnabledIndex(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          {certificates.length} chứng chỉ (Kéo thả để sắp xếp)
        </span>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/60 text-teal-700 dark:text-teal-300 font-semibold text-xs border border-teal-200 dark:border-teal-800 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Thêm Chứng Chỉ Mới</span>
        </button>
      </div>

      {certificates.length === 0 ? (
        <div className="text-center py-6 px-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/40">
          <Award className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            Chưa có chứng chỉ nào. Bấm nút phía trên để thêm!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {certificates.map((cert, idx) => {
            const isDragging = draggedIndex === idx;
            const isDragOver = dragOverIndex === idx && draggedIndex !== idx;

            return (
              <div
                key={cert.id}
                draggable={dragEnabledIndex === idx}
                onDragStart={(e) => handleDragStart(idx, e)}
                onDragOver={(e) => handleDragOver(idx, e)}
                onDrop={(e) => handleDrop(idx, e)}
                onDragEnd={handleDragEnd}
                className={`p-4 rounded-xl border transition-all space-y-3 ${
                  isDragging
                    ? 'opacity-50 scale-[0.99] border-teal-500 bg-teal-50/20 dark:bg-teal-950/20'
                    : isDragOver
                    ? 'border-teal-500 ring-2 ring-teal-500/30 bg-white dark:bg-slate-900'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/80'
                }`}
              >
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <div
                    className="flex items-center gap-2 min-w-0 flex-1 cursor-grab active:cursor-grabbing"
                    onMouseEnter={() => setDragEnabledIndex(idx)}
                    onMouseLeave={() => {
                      if (draggedIndex === null) setDragEnabledIndex(null);
                    }}
                    title="Giữ và kéo để sắp xếp chứng chỉ"
                  >
                    <GripVertical className="w-4 h-4 text-slate-400 hover:text-teal-600 shrink-0" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {idx + 1}. {cert.name || 'Chứng chỉ chuyên môn'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {onReorder && certificates.length > 1 && (
                      <>
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => onReorder(idx, idx - 1)}
                          className="p-1 rounded text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors cursor-pointer"
                          title="Chuyển lên trên"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === certificates.length - 1}
                          onClick={() => onReorder(idx, idx + 1)}
                          className="p-1 rounded text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors cursor-pointer"
                          title="Chuyển xuống dưới"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                    <button
                      type="button"
                      onClick={() => onRemove(cert.id)}
                      className="p-1 rounded text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                      title="Xóa chứng chỉ này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Tên Chứng Chỉ *
                    </label>
                    <input
                      type="text"
                      value={cert.name}
                      onChange={(e) => onUpdate(cert.id, 'name', e.target.value)}
                      placeholder="vd: AWS Certified Solutions Architect"
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500 font-semibold text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Tổ Chức / Đơn Vị Cấp *
                    </label>
                    <input
                      type="text"
                      value={cert.issuer}
                      onChange={(e) => onUpdate(cert.id, 'issuer', e.target.value)}
                      placeholder="vd: Amazon Web Services / Coursera"
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Ngày / Năm Cấp *
                    </label>
                    <input
                      type="text"
                      value={cert.issueDate}
                      onChange={(e) => onUpdate(cert.id, 'issueDate', e.target.value)}
                      placeholder="vd: 2023 hoặc 06/2023"
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Đường Dẫn Chứng Thực (Credential URL)
                    </label>
                    <input
                      type="text"
                      value={cert.credentialUrl || ''}
                      onChange={(e) => onUpdate(cert.id, 'credentialUrl', e.target.value)}
                      placeholder="vd: https://www.credly.com/badges/..."
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CertificatesSection;
