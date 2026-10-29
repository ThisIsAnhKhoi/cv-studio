import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  Check,
  X,
  Crop,
  Move,
  Sparkles,
} from 'lucide-react';
import { cropAndExportAvatar, CropTransform } from '../../../utils/image';

interface ImageCropModalProps {
  isOpen: boolean;
  imageSrc: string;
  onClose: () => void;
  onApply: (croppedDataUrl: string) => void;
  cropSize?: number; // Size in px of crop frame in UI (default 260)
  targetSize?: number; // Output resolution in px (default 400)
}

export const ImageCropModal: React.FC<ImageCropModalProps> = ({
  isOpen,
  imageSrc,
  onClose,
  onApply,
  cropSize = 260,
  targetSize = 400,
}) => {
  const [zoom, setZoom] = useState<number>(1.0);
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [rotation, setRotation] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [cropShape, setCropShape] = useState<'circle' | 'square'>('circle');

  const imgRef = useRef<HTMLImageElement>(null);
  const dragStartRef = useRef<{ x: number; y: number; originX: number; originY: number }>({
    x: 0,
    y: 0,
    originX: 0,
    originY: 0,
  });

  // Reset state when opening a new image
  useEffect(() => {
    if (isOpen) {
      setZoom(1.0);
      setOffset({ x: 0, y: 0 });
      setRotation(0);
    }
  }, [isOpen, imageSrc]);

  // Pointer drag handling
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      originX: offset.x,
      originY: offset.y,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setOffset({
      x: dragStartRef.current.originX + dx,
      y: dragStartRef.current.originY + dy,
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  // Wheel zoom handling
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.08 : -0.08;
    setZoom((prev) => Math.min(Math.max(Number((prev + delta).toFixed(2)), 1.0), 3.0));
  };

  // Reset to initial center
  const handleReset = () => {
    setZoom(1.0);
    setOffset({ x: 0, y: 0 });
    setRotation(0);
  };

  // Rotate by 90 degrees
  const handleRotate = () => {
    setRotation((r) => (r + 90) % 360);
  };

  // Apply cropping and output
  const handleApplyCrop = () => {
    if (!imgRef.current) return;
    try {
      const transform: CropTransform = {
        zoom,
        offsetX: offset.x,
        offsetY: offset.y,
        rotation,
      };
      const resultDataUrl = cropAndExportAvatar(
        imgRef.current,
        transform,
        cropSize,
        targetSize,
        0.88,
        'image/jpeg'
      );
      onApply(resultDataUrl);
      onClose();
    } catch (err) {
      console.error('Lỗi khi cắt ảnh:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="crop-modal-title"
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 flex items-center justify-center">
              <Crop className="w-4 h-4" />
            </div>
            <div>
              <h3 id="crop-modal-title" className="text-sm font-bold text-slate-900 dark:text-white">
                Cắt & Điều Chỉnh Ảnh Đại Diện
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Kéo di chuyển hoặc phóng to để vừa khung hình đẹp nhất
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Interactive Viewport Area */}
        <div className="p-6 bg-slate-950 flex flex-col items-center justify-center select-none">
          {/* Crop Frame Box */}
          <div
            className="relative overflow-hidden cursor-grab active:cursor-grabbing touch-none"
            style={{ width: `${cropSize}px`, height: `${cropSize}px` }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onWheel={handleWheel}
          >
            {/* The Image being transformed */}
            <img
              ref={imgRef}
              src={imageSrc}
              alt="Crop target"
              draggable={false}
              className="absolute pointer-events-none transition-none origin-center"
              style={{
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) rotate(${rotation}deg) scale(${zoom})`,
                maxWidth: 'none',
                minWidth: `${cropSize}px`,
                minHeight: `${cropSize}px`,
                objectFit: 'cover',
              }}
            />

            {/* Visual Mask Overlay */}
            <div
              className={`absolute inset-0 pointer-events-none border-2 border-white/90 shadow-[0_0_0_9999px_rgba(15,23,42,0.65)] transition-all ${
                cropShape === 'circle' ? 'rounded-full' : 'rounded-2xl'
              }`}
            />

            {/* Center crosshair indicator */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
              <div className="w-3 h-px bg-white" />
              <div className="h-3 w-px bg-white absolute" />
            </div>
          </div>

          <p className="text-[11px] text-slate-400 mt-3 inline-flex items-center gap-1.5">
            <Move className="w-3 h-3 text-teal-400" />
            <span>Kéo thả để định vị • Cuộn chuột để thu phóng</span>
          </p>
        </div>

        {/* Controls Toolbar */}
        <div className="p-5 space-y-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
          {/* Zoom Control Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1">
                <ZoomIn className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>Thu phóng (Zoom)</span>
              </span>
              <span className="text-teal-700 dark:text-teal-400 font-mono text-[11px]">
                {Math.round(zoom * 100)}%
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(Number((z - 0.1).toFixed(2)), 1.0))}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                title="Thu nhỏ"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <input
                type="range"
                min="1.0"
                max="3.0"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(Number((z + 0.1).toFixed(2)), 3.0))}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                title="Phóng to"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Secondary Quick Action Tools: Rotate, Shape, Reset */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleRotate}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors cursor-pointer"
                title="Xoay 90 độ"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Xoay 90°</span>
              </button>

              <button
                type="button"
                onClick={() => setCropShape((s) => (s === 'circle' ? 'square' : 'circle'))}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors cursor-pointer"
                title="Đổi khung xem dạng Tròn / Vuông"
              >
                <span>{cropShape === 'circle' ? 'Khung Tròn' : 'Khung Vuông'}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
              title="Đặt lại vị trí ban đầu"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Đặt lại</span>
            </button>
          </div>

          {/* Action Footer Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="button"
              id="btn-apply-crop"
              onClick={handleApplyCrop}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-xs shadow-md shadow-teal-700/20 active:scale-95 transition-all cursor-pointer"
            >
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Cắt & Áp Dụng</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
