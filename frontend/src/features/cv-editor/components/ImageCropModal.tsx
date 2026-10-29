import React, { useState, useRef, useEffect } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  Check,
  X,
  Crop,
  Move,
  Maximize2,
  Minimize2,
  User,
  Loader2,
} from 'lucide-react';
import { cropAndExportAvatar, CropTransform } from '../../../utils/image';

interface ImageCropModalProps {
  isOpen: boolean;
  imageSrc: string;
  onClose: () => void;
  onApply: (croppedDataUrl: string) => void;
  cropSize?: number; // Kích thước khung cắt trên UI (mặc định 280px)
  targetSize?: number; // Độ phân giải xuất file chuẩn 1:1 (mặc định 400px)
}

export const ImageCropModal: React.FC<ImageCropModalProps> = ({
  isOpen,
  imageSrc,
  onClose,
  onApply,
  cropSize = 280,
  targetSize = 400,
}) => {
  const [naturalSize, setNaturalSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });
  const [zoom, setZoom] = useState<number>(1.0);
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [rotation, setRotation] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [cropShape, setCropShape] = useState<'circle' | 'square'>('circle');
  const [activePreset, setActivePreset] = useState<'fit' | 'fill' | 'portrait' | 'custom'>('fit');
  const [isApplying, setIsApplying] = useState<boolean>(false);

  const imgRef = useRef<HTMLImageElement>(null);
  const dragStartRef = useRef<{ x: number; y: number; originX: number; originY: number }>({
    x: 0,
    y: 0,
    originX: 0,
    originY: 0,
  });

  // Tính toán kích thước chuẩn theo tỷ lệ ảnh gốc
  const naturalW = naturalSize.width || cropSize;
  const naturalH = naturalSize.height || cropSize;
  const minSide = Math.min(naturalW, naturalH);
  const maxSide = Math.max(naturalW, naturalH);
  const baseScale = cropSize / (minSide || 1);
  const displayedW = naturalW * baseScale;
  const displayedH = naturalH * baseScale;

  // Tỷ lệ thu nhỏ để hiển thị trọn vẹn 100% ảnh trong khung vuông (không bị cắt xén)
  const fitRatio = Math.max(0.08, Number((minSide / (maxSide || 1)).toFixed(2)));
  // Giới hạn zoom tối thiểu linh hoạt theo tỷ lệ ảnh để có thể thu nhỏ nhìn toàn cảnh
  const minZoom = Math.min(0.2, Number((fitRatio * 0.75).toFixed(2)));
  const maxZoom = 3.5;

  // Tự động tải kích thước gốc và thiết lập mặc định khi mở modal hoặc đổi ảnh
  useEffect(() => {
    if (!isOpen || !imageSrc) return;

    const img = new Image();
    img.onload = () => {
      const nw = img.naturalWidth || cropSize;
      const nh = img.naturalHeight || cropSize;
      setNaturalSize({ width: nw, height: nh });

      const minS = Math.min(nw, nh);
      const maxS = Math.max(nw, nh);
      const initialFit = Math.max(0.08, Number((minS / (maxS || 1)).toFixed(2)));

      // Mặc định chọn chế độ Fit Full để hiển thị toàn bộ ảnh, không bị phóng to bất thường
      setZoom(initialFit);
      setOffset({ x: 0, y: 0 });
      setRotation(0);
      setActivePreset('fit');
    };
    img.src = imageSrc;
  }, [isOpen, imageSrc, cropSize]);

  // Điều chỉnh mức thu phóng
  const handleZoomChange = (newZoom: number) => {
    const clamped = Math.min(Math.max(Number(newZoom.toFixed(2)), minZoom), maxZoom);
    setZoom(clamped);

    if (Math.abs(clamped - fitRatio) < 0.03) {
      setActivePreset('fit');
    } else if (Math.abs(clamped - 1.0) < 0.03) {
      setActivePreset('fill');
    } else if (Math.abs(clamped - 1.35) < 0.03) {
      setActivePreset('portrait');
    } else {
      setActivePreset('custom');
    }
  };

  // Các preset cắt nhanh
  const handlePresetFit = () => {
    setZoom(fitRatio);
    setOffset({ x: 0, y: 0 });
    setActivePreset('fit');
  };

  const handlePresetFill = () => {
    setZoom(1.0);
    setOffset({ x: 0, y: 0 });
    setActivePreset('fill');
  };

  const handlePresetPortrait = () => {
    setZoom(1.35);
    setOffset({ x: 0, y: 0 });
    setActivePreset('portrait');
  };

  // Kéo di chuyển ảnh (Pointer Events)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      originX: offset.x,
      originY: offset.y,
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setOffset({
      x: dragStartRef.current.originX + dx,
      y: dragStartRef.current.originY + dy,
    });
    setActivePreset('custom');
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  // Cuộn chuột để thu phóng
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.06 : -0.06;
    handleZoomChange(zoom + delta);
  };

  // Đặt lại trạng thái ban đầu
  const handleReset = () => {
    setZoom(fitRatio);
    setOffset({ x: 0, y: 0 });
    setRotation(0);
    setActivePreset('fit');
  };

  // Xoay ảnh 90 độ theo chiều kim đồng hồ
  const handleRotate = () => {
    setRotation((r) => (r + 90) % 360);
    setActivePreset('custom');
  };

  // Cắt và xuất ảnh
  const handleApplyCrop = () => {
    if (!imgRef.current) return;
    setIsApplying(true);
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
    } finally {
      setIsApplying(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="crop-modal-title"
      >
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 flex items-center justify-center">
              <Crop className="w-4 h-4" />
            </div>
            <div>
              <h3 id="crop-modal-title" className="text-sm font-bold text-slate-900 dark:text-white">
                Cắt & Điều Chỉnh Ảnh Đại Diện
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Lấy trọn toàn bộ ảnh hoặc phóng to theo mong muốn
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
        <div
          className="relative w-full h-[370px] bg-slate-950 overflow-hidden cursor-grab active:cursor-grabbing touch-none select-none flex items-center justify-center"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onWheel={handleWheel}
        >
          {/* Background Canvas representation */}
          <div
            className="absolute bg-white transition-all shadow-lg"
            style={{
              width: `${cropSize}px`,
              height: `${cropSize}px`,
              borderRadius: cropShape === 'circle' ? '9999px' : '1.5rem',
            }}
          />

          {/* The Image Element */}
          <img
            ref={imgRef}
            src={imageSrc}
            alt="Cắt ảnh đại diện"
            draggable={false}
            className="absolute pointer-events-none select-none origin-center transition-none max-w-none max-h-none"
            style={{
              width: `${displayedW}px`,
              height: `${displayedH}px`,
              left: '50%',
              top: '50%',
              transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) rotate(${rotation}deg) scale(${zoom})`,
              transformOrigin: 'center center',
            }}
          />

          {/* The Crop Frame Box with Backdrop Shadow & Guides */}
          <div
            className="absolute pointer-events-none flex items-center justify-center"
            style={{ width: `${cropSize}px`, height: `${cropSize}px` }}
          >
            {/* Darkened mask covering everything outside the crop frame */}
            <div
              className={`absolute inset-0 border-2 border-white/95 shadow-[0_0_0_9999px_rgba(2,6,23,0.72)] transition-all ${
                cropShape === 'circle' ? 'rounded-full' : 'rounded-3xl'
              }`}
            />

            {/* Rule-of-Thirds Grid */}
            <div
              className={`absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-20 pointer-events-none ${
                cropShape === 'circle' ? 'rounded-full overflow-hidden' : 'rounded-3xl overflow-hidden'
              }`}
            >
              <div className="border-r border-b border-white" />
              <div className="border-r border-b border-white" />
              <div className="border-b border-white" />
              <div className="border-r border-b border-white" />
              <div className="border-r border-b border-white" />
              <div className="border-b border-white" />
              <div className="border-r border-white" />
              <div className="border-r border-white" />
              <div />
            </div>

            {/* Center crosshair */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
              <div className="w-3.5 h-0.5 bg-white rounded-full" />
              <div className="h-3.5 w-0.5 bg-white rounded-full absolute" />
            </div>
          </div>

          {/* Top Resolution and Mode Badges */}
          <div className="absolute top-3 left-3 pointer-events-none flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-[11px] font-mono font-medium text-slate-300">
              {naturalW} × {naturalH} px
            </span>
            {activePreset === 'fit' && (
              <span className="px-2.5 py-1 rounded-full bg-teal-500/20 backdrop-blur-md border border-teal-500/40 text-[11px] font-semibold text-teal-300">
                Toàn bộ ảnh
              </span>
            )}
            {activePreset === 'fill' && (
              <span className="px-2.5 py-1 rounded-full bg-blue-500/20 backdrop-blur-md border border-blue-500/40 text-[11px] font-semibold text-blue-300">
                Lấp đầy khung 1:1
              </span>
            )}
            {activePreset === 'portrait' && (
              <span className="px-2.5 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/40 text-[11px] font-semibold text-amber-300">
                Cận chân dung
              </span>
            )}
          </div>

          {/* Bottom Hint */}
          <div className="absolute bottom-2.5 inset-x-0 pointer-events-none flex justify-center">
            <p className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-[11px] text-slate-300 inline-flex items-center gap-1.5 shadow-sm">
              <Move className="w-3 h-3 text-teal-400" />
              <span>Kéo để di chuyển • Cuộn chuột để thu phóng</span>
            </p>
          </div>
        </div>

        {/* Quick Presets Toolbar */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden sm:inline">
            Cắt nhanh:
          </span>

          <div className="flex items-center gap-2 flex-1 sm:flex-initial justify-between sm:justify-start">
            <button
              type="button"
              onClick={handlePresetFit}
              className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activePreset === 'fit'
                  ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/30'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
              title="Thu nhỏ để lấy toàn bộ ảnh không bị cắt"
            >
              <Minimize2 className="w-3.5 h-3.5" />
              <span>Cắt Toàn Bộ Ảnh</span>
            </button>

            <button
              type="button"
              onClick={handlePresetFill}
              className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activePreset === 'fill'
                  ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/30'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
              title="Phủ kín khung 1:1"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Lấp Đầy Khung</span>
            </button>

            <button
              type="button"
              onClick={handlePresetPortrait}
              className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activePreset === 'portrait'
                  ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/30'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
              title="Cận cảnh gương mặt chân dung"
            >
              <User className="w-3.5 h-3.5" />
              <span>Cận Chân Dung</span>
            </button>
          </div>
        </div>

        {/* Detailed Controls */}
        <div className="p-5 space-y-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
          {/* Zoom Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <ZoomIn className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>Thu phóng (Zoom)</span>
              </span>
              <span className="text-teal-700 dark:text-teal-400 font-mono text-[11px] font-bold">
                {Math.round(zoom * 100)}%
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleZoomChange(zoom - 0.05)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                title="Thu nhỏ"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <input
                type="range"
                min={minZoom}
                max={maxZoom}
                step="0.01"
                value={zoom}
                onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
                className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
              <button
                type="button"
                onClick={() => handleZoomChange(zoom + 0.05)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                title="Phóng to"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Secondary Tools: Rotate, Shape, Reset */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRotate}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors cursor-pointer"
                title="Xoay ảnh 90 độ"
              >
                <RotateCw className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>Xoay 90°</span>
              </button>

              <button
                type="button"
                onClick={() => setCropShape((s) => (s === 'circle' ? 'square' : 'circle'))}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors cursor-pointer"
                title="Chuyển đổi giữa Khung Tròn và Khung Vuông"
              >
                <span>{cropShape === 'circle' ? 'Khung Tròn' : 'Khung Vuông'}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer"
              title="Đặt lại vị trí và tỷ lệ ban đầu"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Đặt lại</span>
            </button>
          </div>

          {/* Action Footer */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isApplying}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="button"
              id="btn-apply-crop"
              onClick={handleApplyCrop}
              disabled={isApplying}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-xs shadow-md shadow-teal-700/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              {isApplying ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Cắt & Áp Dụng</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ImageCropModal;
