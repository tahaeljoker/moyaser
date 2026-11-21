import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { brand } from '../../data/projectData.js';

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#F8F7F4] border-b border-stone-200/80 min-h-[580px] lg:min-h-[660px] flex items-center" dir="rtl">
      {/* Subtle Architectural Grid Texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.35] bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:4.5rem_4.5rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_60%,transparent_100%)]" />

      {/* Prominent Architectural Brand Logo Watermark Motif */}
      <div className="absolute -left-12 lg:left-10 top-1/2 -translate-y-1/2 pointer-events-none select-none z-0">
        <img
          src={brand.logo}
          alt=""
          aria-hidden="true"
          className="w-[340px] sm:w-[480px] lg:w-[620px] h-auto object-contain opacity-[0.065] grayscale contrast-125 transition-transform duration-1000 ease-out hover:scale-105"
        />
      </div>

      {/* Secondary Staggered Architectural Watermark Accent */}
      <div className="absolute -right-20 -bottom-16 pointer-events-none select-none z-0">
        <img
          src={brand.logo}
          alt=""
          aria-hidden="true"
          className="w-[260px] lg:w-[380px] h-auto object-contain opacity-[0.04] grayscale rotate-12"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 w-full">
        <div className="max-w-3xl space-y-6">
          {/* Eyebrow */}
          <div
            className={`inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-stone-200/90 shadow-xs text-xs font-bold text-emerald-900 transition-all duration-700 ease-out ${
              mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-700 animate-pulse" />
            <span>مُيسر للتطوير العقاري | مجتمعات سكنية متكاملة بالمنطقة الشرقية</span>
          </div>

          {/* Headline */}
          <h1
            className={`text-3xl sm:text-5xl lg:text-6xl font-black font-heading tracking-tight text-slate-900 leading-[1.18] transition-all duration-700 delay-100 ease-out ${
              mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
          >
            نبتكر مجتمعات سكنية مستقلة تعزز جودة الحياة والاستقرار
          </h1>

          {/* Concise Description */}
          <p
            className={`text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl font-normal transition-all duration-700 delay-150 ease-out ${
              mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
          >
            نطور مشاريع تاون هاوس حديثة بمعايير معمارية دقيقة تضمن الخصوصية التامة للعائلة وجودة البناء المستدامة، مع صكوك ملكية إلكترونية مستقلة وإفراغ فوري لكافة الوحدات.
          </p>

          {/* Action Buttons */}
          <div
            className={`flex flex-wrap items-center gap-3 pt-2 transition-all duration-700 delay-200 ease-out ${
              mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
          >
            <Link
              to="/projects"
              className="px-7 py-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold transition shadow-md inline-flex items-center gap-2 group"
            >
              <span>استكشف مشاريعنا</span>
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            </Link>
            <Link
              to="/contact"
              className="px-7 py-3.5 rounded-xl bg-white hover:bg-stone-50 text-slate-800 text-xs sm:text-sm font-bold transition border border-stone-300/80 shadow-xs inline-flex items-center gap-2"
            >
              <span>تواصل معنا</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400" />
            </Link>
          </div>

          {/* Trust Hallmarks */}
          <div
            className={`pt-6 border-t border-stone-200/80 flex flex-wrap items-center gap-6 text-xs text-slate-600 transition-all duration-700 delay-250 ease-out ${
              mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0" />
              <span>صكوك إلكترونية مستقلة</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-800 shrink-0" />
              <span>ضمانات إنشائية معتمدة</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-400 shrink-0" />
              <span>مطابق لكود البناء السعودي</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
