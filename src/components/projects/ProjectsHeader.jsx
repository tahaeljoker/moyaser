import { useEffect, useState } from 'react';

export default function ProjectsHeader({ projectCount = 4, settings = null }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div dir="rtl">
      <section
        className="relative text-white pt-16 pb-28 sm:pt-20 sm:pb-32 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0b3a2c 0%, #06261c 100%)' }}
      >
        <div
          className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none motion-reduce:transform-none motion-reduce:opacity-100 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="max-w-3xl space-y-4 sm:space-y-5">
            <h1
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black font-heading pb-1.5"
              style={{ lineHeight: 1.7 }}
            >
              مشاريع سكنية صُممت لتدوم أجيالاً
            </h1>

            <p className="text-xs sm:text-sm text-stone-200/90 max-w-2xl leading-relaxed">
              {settings?.siteCopy?.projectsHeaderDesc?.trim() ||
                'استكشف مجتمعات تاون هاوس ودوبلكسات مُيسر للتطوير العقاري بالمنطقة الشرقية. وحدات مستقلة إنشائياً تُنفذ وفق متطلبات كود البناء السعودي.'}
            </p>
          </div>
        </div>
      </section>

      {/* Floating 4-Cell Stat Bar overlapping bottom of green band by ~60px */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-[60px]">
        <div
          className={`bg-[#fbf9f3] rounded-[14px] border-t-[4px] border-t-[#c9ab68] shadow-[0_20px_50px_-15px_rgba(6,38,28,0.18)] overflow-hidden transition-all duration-700 delay-150 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none motion-reduce:transform-none motion-reduce:opacity-100 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3">
            <div className="min-w-0 p-4 sm:p-6 border-b sm:border-b-0 sm:border-l border-[#e3dbc6]">
              <span className="text-[11px] sm:text-xs text-slate-500 block font-medium">المشاريع المطروحة</span>
              <span className="text-base sm:text-xl font-black font-heading text-[#0a2e23] leading-snug tabular-nums mt-1.5 block">
                {projectCount}+ مشاريع
              </span>
            </div>

            <div className="min-w-0 p-4 sm:p-6 border-b sm:border-b-0 sm:border-l border-[#e3dbc6]">
              <span className="text-[11px] sm:text-xs text-slate-500 block font-medium">الملكية العقارية</span>
              <span className="text-base sm:text-xl font-black font-heading text-[#0a2e23] leading-snug tabular-nums mt-1.5 block">
                {settings?.siteCopy?.projectsHeaderStat?.trim() || 'وحدات مستقلة'}
              </span>
            </div>

            <div className="min-w-0 p-4 sm:p-6">
              <span className="text-[11px] sm:text-xs text-slate-500 block font-medium">الضمانات المعتمدة</span>
              <span className="text-base sm:text-xl font-black font-heading text-[#0a2e23] leading-snug tabular-nums mt-1.5 block">
                حتى 25 سنة
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
