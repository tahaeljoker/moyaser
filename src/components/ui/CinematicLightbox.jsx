import { useEffect, useCallback } from 'react';
import { X, ChevronRight, ChevronLeft, Maximize2, Layers } from 'lucide-react';

export default function CinematicLightbox({ isOpen, images = [], currentIndex = 0, onClose, onNavigate }) {
  const handleKeyDown = useCallback(
    (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNavigate((currentIndex - 1 + images.length) % images.length);
      if (e.key === 'ArrowLeft') onNavigate((currentIndex + 1) % images.length);
    },
    [isOpen, currentIndex, images.length, onClose, onNavigate]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    if (isOpen) document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || images.length === 0) return null;

  const currentImg = images[currentIndex];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-2xl transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
      dir="rtl"
    >
      {/* Top Architectural Control Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-5 border-b border-white/10 bg-slate-950/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-[#C8A96A] border border-white/15">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-heading">
              {currentImg?.title || 'المعرض المعماري الفاخر'}
            </h3>
            <span className="text-[11px] text-stone-400 block font-mono">
              مُيسر للتطوير العقاري // تاون هاوس الشامخة
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs font-mono font-bold text-[#C8A96A] bg-white/10 px-3 py-1 rounded-lg border border-white/15 tabular-nums">
            {currentIndex + 1} / {images.length}
          </span>
          <button
            onClick={onClose}
            aria-label="إغلاق المعرض"
            className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition duration-200 border border-white/15"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Viewport Stage */}
      <div className="relative w-full h-full max-w-6xl max-h-[85vh] p-6 flex items-center justify-center pt-24 pb-20">
        <div className="relative max-w-full max-h-full rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-black">
          <img
            src={currentImg?.url || currentImg}
            alt={currentImg?.title || 'معاينة معمارية'}
            className="w-auto h-auto max-w-full max-h-[75vh] object-contain transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          />
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => onNavigate((currentIndex - 1 + images.length) % images.length)}
              aria-label="الصورة السابقة"
              className="absolute right-6 top-1/2 -translate-y-1/2 p-3.5 rounded-2xl bg-slate-900/80 hover:bg-[#0A2E23] text-white border border-white/15 shadow-xl transition-all duration-200 hover:scale-105"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            <button
              onClick={() => onNavigate((currentIndex + 1) % images.length)}
              aria-label="الصورة التالية"
              className="absolute left-6 top-1/2 -translate-y-1/2 p-3.5 rounded-2xl bg-slate-900/80 hover:bg-[#0A2E23] text-white border border-white/15 shadow-xl transition-all duration-200 hover:scale-105"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Bottom Thumbnails Strip */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-6 right-6 z-20 flex items-center justify-center gap-2 overflow-x-auto py-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => onNavigate(i)}
              className={`relative w-16 h-12 rounded-xl overflow-hidden border transition-all duration-300 shrink-0 ${
                currentIndex === i
                  ? 'border-[#C8A96A] scale-105 shadow-md ring-2 ring-[#C8A96A]/40'
                  : 'border-white/20 opacity-50 hover:opacity-100'
              }`}
            >
              <img src={img?.url || img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
