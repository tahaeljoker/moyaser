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
    <section className="relative overflow-hidden bg-gradient-to-br from-[#061F17] via-[#0A2E23] to-[#0E3F30] border-b border-white/[0.08] min-h-[580px] lg:min-h-[660px] flex items-center" dir="rtl">
      {/* Soft Radial Architectural Glow */}
      <div className="absolute inset-0 pointer-events-none [background:radial-gradient(ellipse_70%_60%_at_75%_35%,rgba(20,105,80,0.35),transparent_70%)]" />

      {/* Hairline Architectural Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.45] bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:4.5rem_4.5rem] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_50%,#000_60%,transparent_100%)]" />

      {/* Raised Brand Logo Architectural Watermark */}
      <div className="absolute -left-10 lg:left-8 top-1/2 -translate-y-1/2 pointer-events-none select-none z-0">
        <div className="relative">
          {/* Subtle Soft Radial Light Behind Watermark */}
          <div className="absolute inset-0 -m-8 bg-[radial-gradient(circle_at_center,rgba(200,169,106,0.14)_0%,rgba(10,46,35,0.45)_50%,transparent_75%)] blur-2xl pointer-events-none" />
          <img
            src={brand.logo}
            alt=""
            aria-hidden="true"
            className="relative w-[340px] sm:w-[490px] lg:w-[630px] h-auto object-contain opacity-[0.16] filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.35)]"
          />
        </div>
      </div>

      {/* Secondary Staggered Watermark Seal */}
      <div className="absolute -right-20 -bottom-16 pointer-events-none select-none z-0">
        <img
          src={brand.logo}
          alt=""
          aria-hidden="true"
          className="w-[260px] lg:w-[380px] h-auto object-contain opacity-[0.05] rotate-12"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 w-full">
        <div className="max-w-3xl space-y-6">
          {/* Eyebrow */}
          <div
            translate="no"
            className={`notranslate inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.06] border border-[#D6B87A]/25 backdrop-blur-xs text-xs font-bold text-[#D6B87A] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#D6B87A] animate-pulse" />
            <span>مُيسر للتطوير العقاري | مجتمعات سكنية متكاملة بالمنطقة الشرقية</span>
          </div>

          {/* Headline */}
          <h1
            translate="no"
            className={`notranslate text-3xl sm:text-5xl lg:text-6xl font-black font-heading tracking-tight text-white leading-[1.18] transition-all duration-700 delay-100 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
          >
            نبتكر مجتمعات سكنية مستقلة تعزز جودة الحياة والاستقرار
          </h1>

          {/* Concise Description */}
          <p
            className={`text-sm sm:text-base text-stone-300 leading-relaxed max-w-2xl font-normal transition-all duration-700 delay-150 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
          >
            نطور مشاريع تاون هاوس حديثة بمعايير معمارية دقيقة تضمن الخصوصية التامة للعائلة وجودة البناء المستدامة، مع صكوك ملكية إلكترونية مستقلة وإفراغ فوري لكافة الوحدات.
          </p>

          {/* Action Buttons */}
          <div
            className={`flex flex-wrap items-center gap-3 pt-2 transition-all duration-700 delay-200 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
          >
            <Link
              to="/projects"
              className="px-7 py-3.5 rounded-xl bg-[#C8A96A] hover:bg-[#D6B87A] text-[#061F17] text-xs sm:text-sm font-bold transition-all duration-300 shadow-md inline-flex items-center gap-2 group"
            >
              <span>استكشف مشاريعنا</span>
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            </Link>
            <Link
              to="/contact"
              className="px-7 py-3.5 rounded-xl border border-white/25 text-white hover:bg-white/10 hover:border-white/40 text-xs sm:text-sm font-bold backdrop-blur-xs transition-all duration-300 inline-flex items-center gap-2"
            >
              <span>تواصل معنا</span>
              <ArrowUpRight className="w-4 h-4 text-white/60" />
            </Link>
          </div>

          {/* Trust Hallmarks */}
          <div
            className={`pt-6 border-t border-white/[0.08] flex flex-wrap items-center gap-6 text-xs text-stone-300 transition-all duration-700 delay-250 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#D6B87A] shrink-0" />
              <span>صكوك إلكترونية مستقلة</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#D6B87A] shrink-0" />
              <span>ضمانات إنشائية معتمدة</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D6B87A] shrink-0" />
              <span>مطابق لكود البناء السعودي</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
