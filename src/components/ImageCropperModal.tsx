import React, { useState, useRef, useEffect } from 'react';
import { X, Check, ZoomIn, ZoomOut, RotateCw, RefreshCw, Move } from 'lucide-react';

interface ImageCropperModalProps {
  imageSrc: string | null;
  isOpen: boolean;
  onClose: () => void;
  onCropComplete: (croppedDataUrl: string) => void;
}

export const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  imageSrc,
  isOpen,
  onClose,
  onCropComplete,
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Load image
  useEffect(() => {
    if (!imageSrc) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageRef.current = img;
      setZoom(1);
      setRotation(0);
      setOffset({ x: 0, y: 0 });
    };
    img.src = imageSrc;
  }, [imageSrc]);

  if (!isOpen || !imageSrc) return null;

  // Handle Drag to Reposition
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - offset.x,
        y: e.touches[0].clientY - offset.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setOffset({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  // Apply Crop and output 300x300 Data URL
  const handleApplyCrop = () => {
    const img = imageRef.current;
    if (!img) return;

    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = 320;
    exportCanvas.height = 320;
    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return;

    // Viewport box is 260x260
    const viewportSize = 260;
    const scale = exportCanvas.width / viewportSize;

    ctx.save();
    ctx.translate(exportCanvas.width / 2, exportCanvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom * scale, zoom * scale);

    // Center image
    const imgRatio = img.width / img.height;
    let drawWidth = viewportSize;
    let drawHeight = viewportSize;
    if (imgRatio > 1) {
      drawWidth = viewportSize * imgRatio;
    } else {
      drawHeight = viewportSize / imgRatio;
    }

    ctx.drawImage(
      img,
      -drawWidth / 2 + (offset.x / (zoom || 1)),
      -drawHeight / 2 + (offset.y / (zoom || 1)),
      drawWidth,
      drawHeight
    );
    ctx.restore();

    const croppedDataUrl = exportCanvas.toDataURL('image/jpeg', 0.92);
    onCropComplete(croppedDataUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl relative select-none">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          aria-label="Batal pangkas"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
          Pangkas Foto Profil
        </h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">
          Geser atau perbesar foto agar pas di dalam lingkaran profil.
        </p>

        {/* Viewport & Mask */}
        <div
          className="relative w-[260px] h-[260px] mx-auto rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center cursor-move touch-none border border-slate-800"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
        >
          {/* Image rendered inside container */}
          <div
            className="absolute transition-transform duration-75 pointer-events-none"
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px) rotate(${rotation}deg) scale(${zoom})`,
            }}
          >
            <img
              src={imageSrc}
              alt="Crop target"
              className="max-w-none w-[260px] h-[260px] object-cover pointer-events-none"
            />
          </div>

          {/* Circular mask overlay */}
          <div className="absolute inset-0 pointer-events-none border-[30px] border-slate-950/80 rounded-full box-border" />
          <div className="absolute inset-0 pointer-events-none rounded-full border-2 border-indigo-400/80 shadow-[0_0_0_9999px_rgba(15,23,42,0.65)]" />

          {/* Guide icon */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-slate-900/80 text-[10px] text-slate-300 pointer-events-none flex items-center gap-1">
            <Move className="w-2.5 h-2.5" />
            <span>Tahan &amp; geser foto</span>
          </div>
        </div>

        {/* Controls: Zoom slider & Rotate */}
        <div className="mt-5 space-y-3">
          <div className="flex items-center gap-3">
            <ZoomOut className="w-4 h-4 text-slate-400" />
            <input
              type="range"
              min="0.8"
              max="3"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="flex-1 accent-indigo-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />
            <ZoomIn className="w-4 h-4 text-slate-400" />
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => setRotation((r) => (r + 90) % 360)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Putar 90°</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setZoom(1);
                setRotation(0);
                setOffset({ x: 0, y: 0 });
              }}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleApplyCrop}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Terapkan Pangkas</span>
          </button>
        </div>
      </div>
    </div>
  );
};
