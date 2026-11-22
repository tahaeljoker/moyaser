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
    <section className="relative overflow-hidden bg-gradient-to-br from-[#061F17] via-[#0A2E23] to-[#0E3F30] border-b border-white/[0.08] min-h-[620px] lg:min-h-[700px] flex items-center" dir="rtl">
      {/* Soft Radial Architectural Glow */}
      <div className="absolute inset-0 pointer-events-none [background:radial-gradient(ellipse_75%_65%_at_70%_35%,rgba(20,105,80,0.35),transparent_70%)]" />

      {/* Hairline Architectural Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.4] bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:4.5rem_4.5rem] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_50%,#000_60%,transparent_100%)]" />

      {/* Ambient Large Architectural Background Emblem */}
      <div className="absolute -left-16 top-1/2 -translate-y-1/2 pointer-events-none select-none z-0">
        <img
          src={brand.logo}
          alt=""
          aria-hidden="true"
          className="w-[420px] lg:w-[580px] h-auto object-contain opacity-[0.035] brightness-0 invert"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Main Editorial Content Column */}
          <div className="lg:col-span-7 space-y-6">
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

          {/* Luminous Architectural Brand Emblem Pedestal */}
          <div
            className={`lg:col-span-5 flex justify-center lg:justify-end transition-all duration-700 delay-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              mounted ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-6 opacity-0 scale-95'
            }`}
          >
            <div className="relative w-full max-w-[340px] sm:max-w-[380px] rounded-3xl border border-white/15 bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-xl p-8 sm:p-10 shadow-2xl overflow-hidden group">
              {/* Soft Golden Ambient Illumination behind Emblem */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(200,169,106,0.18)_0%,transparent_75%)] pointer-events-none" />

              {/* Corner CAD drafting marks */}
              <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-[#C8A96A]/40 pointer-events-none" />
              <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-[#C8A96A]/40 pointer-events-none" />
              <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-[#C8A96A]/40 pointer-events-none" />
              <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-[#C8A96A]/40 pointer-events-none" />

              <div className="relative z-10 flex flex-col items-center text-center">
                {/* Official Crisp White Inverted Logo */}
                <div className="relative py-2 flex items-center justify-center">
                  <div className="absolute inset-0 -m-4 bg-[radial-gradient(circle,rgba(214,184,122,0.2)_0%,transparent_70%)] blur-xl pointer-events-none" />
                  <img
                    src={brand.logo}
                    alt={brand.developer}
                    className="relative w-36 sm:w-44 h-auto object-contain brightness-0 invert opacity-95 transition-transform duration-500 group-hover:scale-105 filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]"
                  />
                </div>

                {/* Subtle Divider Bar */}
                <div className="w-12 h-0.5 bg-[#C8A96A]/60 my-4 rounded-full" />

                {/* Developer Stamp */}
                <span translate="no" className="notranslate text-base sm:text-lg font-bold text-white font-heading tracking-wide block">
                  {brand.developer}
                </span>
                <span className="text-xs text-[#D6B87A] block mt-1 font-medium">
                  تطوير عقاري نوعي • صكوك إلكترونية مستقلة
                </span>

                {/* Official Accreditation Strip */}
                <div className="mt-6 pt-4 border-t border-white/10 w-full flex items-center justify-between text-[11px] text-stone-300 font-mono tabular-nums">
                  <span className="bg-white/10 px-3 py-1 rounded-md border border-white/15">
                    ترخيص الهيئة #{brand.regaLicense}
                  </span>
                  <span className="bg-emerald-900/60 text-emerald-300 px-3 py-1 rounded-md border border-emerald-500/30 font-sans">
                    كود البناء السعودي
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
