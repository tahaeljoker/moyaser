import { useState, useEffect, useCallback } from 'react';
import { Image as ImageIcon, Eye, X, ChevronRight, ChevronLeft, Map } from 'lucide-react';

const defaultGallery = [
  { url: '/images/shamkha/interior-1.webp', title: 'مجلس الضيوف الفاخر', category: 'interior' },
  { url: '/images/shamkha/interior-2.webp', title: 'صالة المعيشة والاستقبال', category: 'interior' },
  { url: '/images/shamkha/interior-3.webp', title: 'المطبخ وتوزيع المساحات', category: 'interior' },
  { url: '/images/shamkha/interior-4.webp', title: 'جناح الماستر الرئاسي', category: 'interior' },
  { url: '/images/shamkha/interior-5.webp', title: 'التشطيبات العصرية', category: 'interior' },
  { url: '/images/shamkha/masterplan.webp', title: 'المخطط العام للمشروع', category: 'masterplan' },
];

export default function ProjectGallery({ settings }) {
  const images = (settings?.galleryImages && settings.galleryImages.length > 0)
    ? settings.galleryImages
    : defaultGallery;

  const [activeIdx, setActiveIdx] = useState(null);

  const handlePrev = useCallback(() => {
    setActiveIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setActiveIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  }, [images.length]);

  useEffect(() => {
    if (activeIdx === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setActiveIdx(null);
      if (e.key === 'ArrowRight') handlePrev();
      if (e.key === 'ArrowLeft') handleNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeIdx, handlePrev, handleNext]);

  return (
    <section id="gallery-section" className="py-14 md:py-20 bg-white border-b border-slate-200" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80 mb-2">
            <ImageIcon className="w-3.5 h-3.5 text-emerald-800" />
            <span>معرض الصور والمخطط العام</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
            تفاصيل معمارية وتشطيبات متقنة
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            جولة مرئية توثق رحابة المجالس وتشطيبات مشروع تاون هاوس الشامخة ومخططه المعتمد.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {images.map((img, idx) => {
            const isMasterplan = img.category === 'masterplan' || img.url.includes('masterplan');
            return (
              <div
                key={idx}
                onClick={() => setActiveIdx(idx)}
                className="group relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 cursor-pointer shadow-xs hover:shadow-md transition duration-300"
              >
                <div className="h-56 sm:h-64 overflow-hidden">
                  <img
                    src={img.url}
                    alt={img.title || 'صورة من المشروع'}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80 group-hover:opacity-95 transition" />
                <div className="absolute top-3 left-3 p-2 rounded-xl bg-slate-900/70 text-white backdrop-blur-xs opacity-0 group-hover:opacity-100 transition">
                  <Eye className="w-4 h-4" />
                </div>
                <div className="absolute bottom-3.5 right-3.5 left-3.5 flex items-center justify-between text-white">
                  <span className="text-xs font-bold font-heading">{img.title}</span>
                  {isMasterplan && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-md">
                      <Map className="w-3 h-3" />
                      <span>المخطط</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {activeIdx !== null && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveIdx(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3.5 border-b border-white/10 text-white">
              <span className="text-xs font-bold font-heading">{images[activeIdx].title}</span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 font-mono">
                  {activeIdx + 1} / {images.length}
                </span>
                <button
                  onClick={() => setActiveIdx(null)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
                  aria-label="إغلاق المعاينة"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="relative max-h-[75vh] flex items-center justify-center bg-black p-2">
              <img
                src={images[activeIdx].url}
                alt={images[activeIdx].title}
                className="max-h-[70vh] w-auto max-w-full object-contain"
              />
              <button
                onClick={handlePrev}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-white/10 transition"
                aria-label="الصورة السابقة"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-white/10 transition"
                aria-label="الصورة التالية"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
