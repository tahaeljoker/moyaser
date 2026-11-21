import { useState, useEffect } from 'react';
import { ArrowLeft, Compass } from 'lucide-react';
import { brand } from '../../data/projectData.js';

export default function Hero({ settings = null }) {
  const [mounted, setMounted] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const heroImg = settings?.heroImageUrl || '/images/shamkha/hero-exterior.webp';
  const tour3d = settings?.projectTour3dUrl || '';

  useEffect(() => {
    setMounted(true);
    const onScroll = () => { setScrollY(window.scrollY); };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section
      id="hero-section"
      className="relative overflow-hidden bg-[#F8F7F4] border-b border-stone-200/90 pt-8 pb-14 md:py-20"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Typography Column (Right in RTL) */}
          <div
            className={`lg:col-span-7 relative transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              mounted ? 'translate-y-0 opacity-100' : 'translate-y-[18px] opacity-0'
            }`}
          >
            {/* Subtle Brand Logo Watermark */}
            <div
              className="absolute -top-12 -right-8 w-72 h-72 sm:w-96 sm:h-96 pointer-events-none select-none opacity-[0.045] will-change-transform"
              style={{ transform: `translate3d(0, ${scrollY * 0.06}px, 0)` }}
              aria-hidden="true"
            >
              <img
                src="/brand/logo.svg"
                alt=""
                className="w-full h-full object-contain filter grayscale"
              />
            </div>

            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-semibold tracking-wider text-emerald-900 bg-emerald-100/60 px-3 py-1 rounded-full border border-emerald-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-800" />
                <span>الدمام — مشروع تاون هاوس الشامخة</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-slate-900 font-heading leading-[1.25] tracking-tight">
                {settings?.heroTitle || 'مُيسر، اسم تثق به في عالم العقار'}
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
                {settings?.heroSubtitle ||
                  '15 تاون هاوس دوبلكس مستقل بحي حديقة الأثير، يجمع بين الخصوصية التامة للفيلا وجودة البناء المستدامة وضمانات معتمدة تصل إلى 25 سنة.'}
              </p>

              {/* Architectural Hairline Divider */}
              <div className="h-px bg-stone-300 w-20 animate-draw-line my-5" />

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href="#models-showcase-section"
                  className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-emerald-950 text-white text-xs font-bold transition shadow-xs flex items-center gap-2"
                >
                  <span>استكشف النماذج</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </a>
                <a
                  href="#booking-section"
                  className="px-6 py-3 rounded-xl bg-white border border-stone-300 hover:border-slate-400 hover:bg-stone-50 text-slate-800 text-xs font-bold transition"
                >
                  <span>احجز معاينة</span>
                </a>
              </div>

              {/* Key Facts Strip */}
              <div className="pt-8 border-t border-stone-200/80 grid grid-cols-3 gap-4 max-w-md">
                <div>
                  <span className="block text-base sm:text-lg font-bold font-heading text-slate-900">
                    15 وحدة
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">سكنية مستقلة</span>
                </div>
                <div>
                  <span className="block text-base sm:text-lg font-bold font-heading text-slate-900">
                    6 نماذج
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">دوبلكس ورووف</span>
                </div>
                <div>
                  <span className="block text-base sm:text-lg font-bold font-heading text-slate-900">
                    25 سنة
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">ضمانات معتمدة</span>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Column (Left in RTL) */}
          <div
            className={`lg:col-span-5 relative transition-all duration-700 delay-150 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              mounted ? 'translate-y-0 opacity-100' : 'translate-y-[18px] opacity-0'
            }`}
          >
            <div className="relative h-[360px] sm:h-[460px] lg:h-[520px] rounded-3xl overflow-hidden border border-stone-200/90 shadow-sm bg-stone-100">
              <img
                src={heroImg}
                alt="الواجهة المعمارية لمشروع تاون هاوس الشامخة"
                className="w-full h-full object-cover animate-ken-burns-slow"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />

              {tour3d && (
                <a
                  href={tour3d}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/95 hover:bg-white text-slate-900 text-xs font-bold backdrop-blur-xs shadow-sm transition border border-stone-200"
                >
                  <Compass className="w-3.5 h-3.5 text-emerald-800" />
                  <span>جولة ثلاثية الأبعاد</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
