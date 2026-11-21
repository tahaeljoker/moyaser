import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, ShieldCheck } from 'lucide-react';
import AnimatedCounter from '../ui/AnimatedCounter.jsx';
import { brand } from '../../data/projectData.js';

export default function Hero({ settings = null }) {
  const [mounted, setMounted] = useState(false);
  const heroImg = settings?.heroImageUrl || '/images/shamkha/hero-exterior.webp';

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white min-h-[640px] lg:min-h-[720px] flex items-center" dir="rtl">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src={heroImg}
          alt="مُيسر للتطوير العقاري"
          className="w-full h-full object-cover animate-ken-burns-slow scale-105"
          style={{ animationDuration: '20s' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />
        <div className="absolute inset-0 bg-gradient-to-l from-slate-950/90 via-slate-950/60 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div
            className={`lg:col-span-7 space-y-6 transition-all duration-700 ease-out ${
              mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-stone-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>مُيسر للتطوير العقاري | مشاريع سكنية ومجتمعات متكاملة</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-heading tracking-tight text-white leading-[1.18]">
              نصنع بيئات سكنية تعزز جودة الحياة والاستقرار
            </h1>

            <p className="text-sm sm:text-base text-stone-300 leading-relaxed max-w-2xl font-light">
              نطور مجتمعات سكنية متفردة بتصاميم معمارية معاصرة في المنطقة الشرقية، ترتكز على الخصوصية التامة، وجودة التنفيذ الفائقة، وضمانات معتمدة تعزز الثقة والأمان الاستثماري.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/projects"
                className="px-6 py-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold transition shadow-lg shadow-emerald-950/50 inline-flex items-center gap-2 group"
              >
                <span>استكشف مشاريعنا</span>
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              </Link>
              <Link
                to="/contact"
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-bold transition border border-white/20 backdrop-blur-xs inline-flex items-center gap-2"
              >
                <span>تواصل معنا</span>
                <ArrowUpRight className="w-4 h-4 text-stone-400" />
              </Link>
            </div>
          </div>

          <div
            className={`lg:col-span-5 transition-all duration-700 delay-150 ease-out ${
              mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
          >
            <div className="relative rounded-3xl bg-slate-900/70 backdrop-blur-md border border-white/15 p-6 sm:p-8 shadow-2xl">
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-white/10 border border-white/20">
                    <img src={brand.logo} alt={brand.developer} className="h-10 w-auto object-contain" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white font-heading">{brand.developer}</h2>
                    <span className="text-[11px] text-stone-400">سجل تجاري وترخيص فال معتمد</span>
                  </div>
                </div>
                <div className="text-left">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-900/80 text-emerald-300 border border-emerald-700/60">
                    موثق رسمياً
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-6">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-2xl font-bold font-heading text-white block">
                    <AnimatedCounter end={15} suffix="+" />
                  </span>
                  <span className="text-[11px] text-stone-300 mt-1 block">وحدة سكنية مستقلة</span>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-2xl font-bold font-heading text-white block">
                    <AnimatedCounter end={6} />
                  </span>
                  <span className="text-[11px] text-stone-300 mt-1 block">نماذج معمارية متنوعة</span>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-2xl font-bold font-heading text-emerald-400 block">
                    <AnimatedCounter end={25} suffix=" عام" />
                  </span>
                  <span className="text-[11px] text-stone-300 mt-1 block">ضمانات إنشائية وفنية</span>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-2xl font-bold font-heading text-white block">
                    <AnimatedCounter end={100} suffix="%" />
                  </span>
                  <span className="text-[11px] text-stone-300 mt-1 block">إفراغ فوري وصك إلكتروني</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-stone-300">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>تراخيص الهيئة العامة للعقار</span>
                </span>
                <span className="font-mono text-stone-400 text-[11px] tabular-nums">REGA #{brand.licenseNumber || '1200028945'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
