import React, { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import { FONT_REGISTRY } from '../../features/cv-editor/utils/fontRegistry';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Palette,
  Type,
  RemoveFormatting,
  List,
  ListOrdered,
  RotateCcw,
  RotateCw,
  ChevronDown,
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
  className?: string;
}

// Preset color palette designed for high contrast and professional CV aesthetic
const COLOR_PRESETS = [
  { name: 'Mặc định (Đen)', color: '#0f172a' },
  { name: 'Teal Xanh Biển', color: '#0E7C6B' },
  { name: 'Tangerine Cam Ấm', color: '#ea580c' },
  { name: 'Crimson Đỏ Nhiệt', color: '#b91c1c' },
  { name: 'Royal Blue', color: '#1d4ed8' },
  { name: 'Emerald Xanh Ngọc', color: '#047857' },
  { name: 'Violet Tím', color: '#6d28d9' },
  { name: 'Slate Xám Đậm', color: '#475569' },
];

const SAFE_FONT_SIZES = [
  { label: 'Cỡ chữ nhỏ (11px)', value: '11px' },
  { label: 'Cỡ chữ chuẩn CV (12px)', value: '12px' },
  { label: 'Cỡ chữ vừa (13px)', value: '13px' },
  { label: 'Cỡ chữ nhấn mạnh (14px)', value: '14px' },
  { label: 'Cỡ chữ tiêu đề phụ (15px)', value: '15px' },
];

/**
 * Custom TextStyle extension supporting constrained font-size attribute
 */
const CustomTextStyle = TextStyle.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      fontSize: {
        default: null,
        parseHTML: (element: HTMLElement) => element.style.fontSize?.replace(/['"]+/g, '') || null,
        renderHTML: (attributes: Record<string, any>) => {
          if (!attributes.fontSize) return {};
          return {
            style: `font-size: ${attributes.fontSize}`,
          };
        },
      },
    };
  },
});

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Nhập nội dung...',
  minHeight = '110px',
  className = '',
}) => {
  const [isEmpty, setIsEmpty] = useState(() => !value || value === '<p></p>');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close color picker on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(e.target as Node)) {
        setShowColorPicker(false);
      }
    };
    if (showColorPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showColorPicker]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
        blockquote: false,
        horizontalRule: false,
      }),
      Underline,
      CustomTextStyle,
      Color,
      FontFamily,
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class:
          'focus:outline-none p-3 text-xs leading-relaxed text-slate-800 dark:text-slate-100 min-h-full rich-text-content',
        style: `min-height: ${minHeight};`,
      },
    },
    onUpdate: ({ editor: ed }) => {
      if (!ed || ed.isDestroyed) return;
      setIsEmpty(ed.isEmpty);
      // Debounce onChange by 300ms to preserve 120fps typing and prevent React parent re-render lock
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        if (!ed || ed.isDestroyed) return;
        try {
          const html = ed.getHTML();
          // If user deleted everything (empty paragraph), send empty string
          const cleaned = html === '<p></p>' ? '' : html;
          onChange(cleaned);
        } catch {
          // ignore if unmounted
        }
      }, 300);
    },
    onDestroy: () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    },
  });

  // Vietnamese IME & external value sync:
  // CRITICAL: NEVER call setContent while the user is actively focused or composing with Telex/VNI IME!
  useEffect(() => {
    if (!editor || editor.isDestroyed) return;

    try {
      if (!editor.isFocused && value !== editor.getHTML()) {
        editor.commands.setContent(value || '', { emitUpdate: false });
        setIsEmpty(!value || value === '<p></p>');
      }
    } catch {
      // guard against destroyed editor or unmounted schema
    }
  }, [value, editor]);

  // Clean up debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  if (!editor || editor.isDestroyed) {
    return (
      <div
        className={`w-full rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-pulse ${className}`}
        style={{ minHeight }}
      />
    );
  }

  const activeColor = editor.getAttributes('textStyle').color || '#0f172a';
  const activeFontFamily = editor.getAttributes('textStyle').fontFamily || '';
  const activeFontSize = editor.getAttributes('textStyle').fontSize || '';

  const setFontSize = (size: string) => {
    if (!size) {
      editor.chain().focus().setMark('textStyle', { fontSize: null }).run();
    } else {
      editor.chain().focus().setMark('textStyle', { fontSize: size }).run();
    }
  };

  return (
    <div
      className={`rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xs overflow-hidden transition-all focus-within:ring-2 focus-within:ring-teal-500/20 focus-within:border-teal-500 ${className}`}
    >
      {/* ================= FIXED TOP TOOLBAR ================= */}
      <div className="flex flex-wrap items-center justify-between gap-1 p-1.5 bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 text-xs">
        {/* Left Formatting Group */}
        <div className="flex flex-wrap items-center gap-1">
          {/* Font Family Selector */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
            <Type className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={activeFontFamily}
              onChange={(e) => {
                const val = e.target.value;
                if (!val) {
                  editor.chain().focus().unsetFontFamily().run();
                } else {
                  editor.chain().focus().setFontFamily(val).run();
                }
              }}
              className="bg-transparent text-[11px] font-semibold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer max-w-[125px] truncate"
              title="Phông chữ"
            >
              <option value="" className="dark:bg-slate-900 text-slate-900 dark:text-white">Font mặc định</option>
              {FONT_REGISTRY.map((f) => (
                <option key={f.id} value={f.family} className="dark:bg-slate-900 text-slate-900 dark:text-white">
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          {/* Font Size Selector */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
            <select
              value={activeFontSize}
              onChange={(e) => setFontSize(e.target.value)}
              className="bg-transparent text-[11px] font-semibold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer max-w-[110px] truncate"
              title="Cỡ chữ"
            >
              <option value="" className="dark:bg-slate-900 text-slate-900 dark:text-white">Cỡ chuẩn</option>
              {SAFE_FONT_SIZES.map((s) => (
                <option key={s.value} value={s.value} className="dark:bg-slate-900 text-slate-900 dark:text-white">
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-0.5" />

          {/* Bold */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              editor.isActive('bold')
                ? 'bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
            title="In đậm (Ctrl+B)"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>

          {/* Italic */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
              editor.isActive('italic')
                ? 'bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
            title="In nghiêng (Ctrl+I)"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>

          {/* Underline */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
              editor.isActive('underline')
                ? 'bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
            title="Gạch chân (Ctrl+U)"
          >
            <UnderlineIcon className="w-3.5 h-3.5" />
          </button>

          {/* Color Picker Popover */}
          <div className="relative inline-block" ref={colorPickerRef}>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setShowColorPicker((prev) => !prev)}
              className="flex items-center gap-1 p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              title="Đổi màu chữ"
            >
              <Palette className="w-3.5 h-3.5" />
              <span
                className="w-3 h-3 rounded-full border border-slate-300 dark:border-slate-600 inline-block"
                style={{ backgroundColor: activeColor }}
              />
              <ChevronDown className="w-2.5 h-2.5 opacity-60" />
            </button>

            {showColorPicker && (
              <div className="absolute left-0 mt-1 z-30 w-48 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl animate-in fade-in zoom-in-95 duration-150">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Bảng màu CV đề xuất
                </p>
                <div className="grid grid-cols-4 gap-1.5 mb-3">
                  {COLOR_PRESETS.map((p) => (
                    <button
                      key={p.color}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        editor.chain().focus().setColor(p.color).run();
                        setShowColorPicker(false);
                      }}
                      className="w-8 h-8 rounded-lg flex items-center justify-center hover:scale-110 transition-transform cursor-pointer border border-slate-200 dark:border-slate-700"
                      style={{ backgroundColor: p.color }}
                      title={p.name}
                    />
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <label className="text-[11px] font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="color"
                      value={activeColor}
                      onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
                      className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent p-0"
                    />
                    <span>Màu tùy chọn</span>
                  </label>

                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      editor.chain().focus().unsetColor().run();
                      setShowColorPicker(false);
                    }}
                    className="text-[10px] text-slate-400 hover:text-rose-500 font-semibold"
                  >
                    Mặc định
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-0.5" />

          {/* Bullet List */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
              editor.isActive('bulletList')
                ? 'bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
            title="Danh sách dấu chấm"
          >
            <List className="w-3.5 h-3.5" />
          </button>

          {/* Numbered List */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
              editor.isActive('orderedList')
                ? 'bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
            title="Danh sách số thứ tự"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>

          {/* Clear Formatting */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            title="Xóa định dạng đoạn chọn"
          >
            <RemoveFormatting className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right History Undo/Redo */}
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 transition-colors cursor-pointer"
            title="Hoàn tác (Ctrl+Z)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 transition-colors cursor-pointer"
            title="Làm lại (Ctrl+Y)"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ================= EDITABLE CONTENT AREA ================= */}
      <div className="relative">
        <EditorContent editor={editor} />
        {isEmpty && (
          <div className="absolute top-3 left-3 text-xs text-slate-400 pointer-events-none select-none">
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
};

export default RichTextEditor;
