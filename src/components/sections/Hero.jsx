import { useState, useEffect } from 'react';
import { ArrowLeft, Compass } from 'lucide-react';

export default function Hero({ settings = null }) {
  const [mounted, setMounted] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  const heroImg = settings?.heroImageUrl || '/images/shamkha/hero-exterior.webp';
  const tour3d = settings?.projectTour3dUrl || '';

  const rawSlides = Array.isArray(settings?.galleryImages) && settings.galleryImages.length > 0
    ? settings.galleryImages.map((img) => (typeof img === 'string' ? img : img?.url)).filter(Boolean)
    : [];

  const slides = rawSlides.length > 0 ? [heroImg, ...rawSlides.filter((s) => s !== heroImg)] : [heroImg];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section
      id="hero-section"
      className="relative min-h-[560px] sm:min-h-[620px] lg:min-h-[700px] flex items-center overflow-hidden bg-slate-950 text-white"
      dir="rtl"
    >
      {/* Full-Bleed Visual Layer with Ken Burns Motion */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {slides.map((slide, idx) => (
          <img
            key={slide}
            src={slide}
            alt="مشروع تاون هاوس الشامخة — الدمام"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              idx === activeSlide ? 'opacity-100 animate-ken-burns-slow' : 'opacity-0 pointer-events-none'
            }`}
            loading={idx === 0 ? 'eager' : 'lazy'}
          />
        ))}
        {/* Directional dark gradient overlays for typography contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-slate-950/40" />
        <div className="absolute inset-0 bg-gradient-to-l from-slate-950/85 via-slate-950/50 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-16 md:py-24">
        <div
          className={`max-w-2xl transition-all duration-700 ease-out ${
            mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          {/* Plain-text architectural label */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-xs border border-white/15 text-xs text-stone-200 mb-5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>الدمام — مشروع تاون هاوس الشامخة | صكوك مستقلة</span>
          </div>

          {/* Bold Editorial Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight text-white leading-[1.25]">
            {settings?.heroTitle || 'مُيسر، اسم تثق به في عالم العقار'}
          </h1>

          {/* Subtitle / Description */}
          <p className="mt-4 text-xs sm:text-sm md:text-base text-stone-200 leading-relaxed max-w-xl">
            {settings?.heroSubtitle ||
              '15 تاون هاوس دوبلكس مستقل بحي حديقة الأثير، يجمع بين الخصوصية التامة وجودة البناء المستدامة وضمانات معتمدة تصل إلى 25 سنة.'}
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#models-showcase-section"
              className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-950/40 flex items-center gap-2"
            >
              <span>استكشف النماذج</span>
              <ArrowLeft className="w-4 h-4" />
            </a>
            <a
              href="#booking-section"
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition border border-white/20 backdrop-blur-xs"
            >
              <span>احجز معاينة</span>
            </a>
            {tour3d && (
              <a
                href={tour3d}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition border border-white/20 backdrop-blur-xs flex items-center gap-2"
              >
                <Compass className="w-4 h-4 text-emerald-400" />
                <span>جولة ثلاثية الأبعاد</span>
              </a>
            )}
          </div>

          {/* Bottom Summary Strip */}
          <div className="mt-12 pt-6 border-t border-white/15 grid grid-cols-3 gap-6 max-w-lg">
            <div>
              <span className="block text-xl sm:text-2xl font-bold font-heading text-white">15 وحدة</span>
              <span className="text-[11px] sm:text-xs text-stone-300 block mt-0.5">سكنية مستقلة</span>
            </div>
            <div>
              <span className="block text-xl sm:text-2xl font-bold font-heading text-white">6 نماذج</span>
              <span className="text-[11px] sm:text-xs text-stone-300 block mt-0.5">دوبلكس ورووف</span>
            </div>
            <div>
              <span className="block text-xl sm:text-2xl font-bold font-heading text-white">25 سنة</span>
              <span className="text-[11px] sm:text-xs text-stone-300 block mt-0.5">ضمانات معتمدة</span>
            </div>
          </div>
        </div>

        {/* Minimal slide indicators if multiple slides */}
        {slides.length > 1 && (
          <div className="mt-8 flex items-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveSlide(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === activeSlide ? 'w-8 bg-emerald-400' : 'w-2 bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`شريحة ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
