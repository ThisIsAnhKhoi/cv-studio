import React from 'react';
import { Sparkles } from 'lucide-react';
import { RichTextEditor } from '../../../../components/common/RichTextEditor';

interface SummarySectionProps {
  summary: string;
  onChange: (value: string) => void;
}

export const SummarySection: React.FC<SummarySectionProps> = ({ summary, onChange }) => {
  // Visible character count excluding HTML tags
  const visibleTextLength = summary ? summary.replace(/<[^>]*>/g, '').trim().length : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          Đoạn giới thiệu năng lực cốt lõi / Mục tiêu nghề nghiệp
        </label>
        <span className="text-[11px] text-slate-400 font-medium">
          {visibleTextLength} ký tự
        </span>
      </div>

      <RichTextEditor
        value={summary}
        onChange={onChange}
        placeholder="Tóm tắt ngắn gọn từ 2-4 câu về kinh nghiệm, thế mạnh chuyên môn và định hướng phát triển của bạn..."
        minHeight="120px"
      />

      <div className="flex items-start gap-2 p-2.5 bg-teal-50/60 dark:bg-teal-950/40 rounded-lg border border-teal-100 dark:border-teal-900/40 text-[11px] text-teal-800 dark:text-teal-300">
        <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5 text-teal-600 dark:text-teal-400" />
        <span>
          <strong>Mẹo:</strong> Nêu rõ số năm kinh nghiệm, các kỹ năng trọng tâm và kết quả định lượng cụ thể (ví dụ: đã tối ưu hóa, đã dẫn dắt bao nhiêu thành viên/học viên).
        </span>
      </div>
    </div>
  );
};
export default SummarySection;
