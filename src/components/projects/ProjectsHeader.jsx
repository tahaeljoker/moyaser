import { Building2, ShieldCheck, Award, FileCheck } from 'lucide-react';

export default function ProjectsHeader({ projectCount = 4 }) {
  return (
    <section className="relative bg-[#061F17] text-white py-16 md:py-24 border-b border-[#0A2E23]/60 overflow-hidden" dir="rtl">
      {/* Subtle Architectural Grid Lines */}
      <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#C8A96A_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#0A2E23]/40 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-[#D6B87A] backdrop-blur-md shadow-xs">
            <Building2 className="w-3.5 h-3.5 text-[#D6B87A]" />
            <span>سجل التطوير السكني المعتمد</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-heading tracking-tight leading-tight">
            مشاريع سكنية صُممت لتدوم أجيالاً
          </h1>

          <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
            استكشف مجتمعات تاون هاوس ودوبلكسات مُيسر للتطوير العقاري بالمنطقة الشرقية. وحدات مستقلة إنشائياً تُنفذ وفق متطلبات كود البناء السعودي مع صكوك ملكية إلكترونية مستقلة وإفراغ فوري.
          </p>
        </div>

        {/* Live Architectural Metrics Pillows */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-4 border-t border-white/10">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <span className="text-[11px] text-stone-400 block font-medium">المشاريع المطروحة</span>
            <span className="text-xl sm:text-2xl font-black font-heading text-white tabular-nums mt-1 block">
              {projectCount}+ مشاريع
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <span className="text-[11px] text-stone-400 block font-medium">الملكية العقارية</span>
            <span className="text-xl sm:text-2xl font-black font-heading text-white tabular-nums mt-1 block">
              100% صك مستقل
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <span className="text-[11px] text-stone-400 block font-medium">الضمانات المعتمدة</span>
            <span className="text-xl sm:text-2xl font-black font-heading text-white tabular-nums mt-1 block">
              حتى 25 سنة
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <span className="text-[11px] text-stone-400 block font-medium">التراخيص والحوكمة</span>
            <span className="text-xl sm:text-2xl font-black font-heading text-[#D6B87A] tabular-nums mt-1 block text-ellipsis overflow-hidden whitespace-nowrap">
              رخصة فال معتمدة
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
