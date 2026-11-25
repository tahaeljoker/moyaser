import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, ShieldCheck, Layers, CheckCircle2, Award, ArrowLeft } from 'lucide-react';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import FloatingWhatsApp from '../components/ui/FloatingWhatsApp.jsx';
import { brand } from '../data/projectData.js';

const VALUES = [
  {
    icon: Layers,
    title: 'الاستقلالية المعمارية',
    desc: 'كل وحدة سكنية مصممة بعدادات منفصلة ومداخل وكراجات خاصة تضمن الخصوصية الكاملة.',
  },
  {
    icon: ShieldCheck,
    title: 'الجودة الإنشائية المستدامة',
    desc: 'التزام صارم باشتراطات كود البناء السعودي وتأمين شامل ضد العيوب الخفية يمتد إلى 10 سنوات.',
  },
  {
    icon: CheckCircle2,
    title: 'الشفافية والموثوقية',
    desc: 'توثيق لكافة مراحل التنفيذ وضمانات المواد.',
  },
  {
    icon: Award,
    title: 'خدمات ما بعد البيع',
    desc: 'مرافقة مستمرة للعميل تشمل الصيانة المجانية في السنة الأولى وتأسيس وإدارة اتحاد الملاك لتيسير السكن.',
  },
];

export default function AboutPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="min-h-screen bg-[#ece6d6] text-[#0a2e23] flex flex-col font-sans" dir="rtl">
      <Navbar />

      {/* 1. Hero */}
      <section
        className="relative text-[#f4efe2] pt-14 pb-28 sm:pt-18 sm:pb-32 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0b3a2c 0%, #06261c 100%)' }}
      >
        <div
          className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none motion-reduce:transform-none motion-reduce:opacity-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-10 lg:gap-8">
            {/* Right Column: Badge, 52px Two-Tone H1, Intro */}
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#c9ab68]/60 text-xs font-bold text-[#c9ab68]">
                <Building2 className="w-3.5 h-3.5 text-[#c9ab68]" />
                <span>عن مُيسر</span>
              </div>

              <h1
                className="text-3xl sm:text-4xl lg:text-[52px] font-extrabold font-heading pb-1"
                style={{ lineHeight: 1.65 }}
              >
                <span className="text-[#f4efe2] block">رواد ابتكار</span>
                <span className="text-[#c9ab68] block">المجتمعات السكنية المستقلة</span>
              </h1>

              <p className="text-[16px] leading-[1.95] text-[#f4efe2]/[0.82] max-w-[600px]">
                شركة مُيسر للتطوير العقاري هي مؤسسة وطنية متخصصة في تطوير مشاريع التاون هاوس والدوبلكسات الفاخرة بالمنطقة الشرقية، تركز على تلبية تطلعات الأسرة السعودية في مسكن يجمع بين الأناقة والاستدامة.
              </p>
            </div>

            {/* Left Column: 600x400 Straight-Line Rectangles + Unaltered Logo */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[600px] h-[280px] sm:h-[340px] lg:h-[400px]">
                {/* Rectangle 1: 420x300 at left 0 */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 w-[70%] max-w-[420px] h-[75%] max-h-[300px] border border-[#c9ab68]/45"
                />
                {/* Rectangle 2: Overlapping offset outline */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute left-[12%] top-[8%] w-[68%] max-w-[410px] h-[72%] max-h-[290px] border border-[#f4efe2]/25"
                />
                {/* Rectangle 3: Outer accent outline */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute right-0 bottom-[6%] w-[64%] max-w-[380px] h-[68%] max-h-[270px] border border-[#c9ab68]/25"
                />
                {/* Centered Unaltered Brand Logo */}
                <div className="relative z-10 h-full flex items-center justify-center p-4">
                  <div className="w-[220px] h-[240px] sm:w-[240px] sm:h-[260px] bg-[#fbf9f3] rounded-[14px] px-8 py-6 shadow-[0_24px_60px_-15px_rgba(2,15,10,0.6)] border border-[#c9ab68]/35 flex items-center justify-center">
                    <img
                      src={brand.logo}
                      alt={brand.developer}
                      className="h-[170px] sm:h-[190px] w-auto max-w-[160px] object-contain mx-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Developer Facts Bar */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-[56px] w-full">
        <div
          className={`bg-[#fbf9f3] rounded-[14px] border-t-[4px] border-t-[#c9ab68] shadow-[0_20px_50px_-15px_rgba(6,38,28,0.18)] overflow-hidden transition-all duration-700 delay-150 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none motion-reduce:transform-none motion-reduce:opacity-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3">
            <div className="min-w-0 p-4 sm:p-6 border-b sm:border-b-0 sm:border-l border-[#e3dbc6]">
              <span className="text-[11px] sm:text-xs text-slate-500 block font-medium">المقر الرئيسي</span>
              <span className="text-base sm:text-xl font-black font-heading text-[#0a2e23] leading-snug mt-1.5 block">
                {brand.city} — {brand.country}
              </span>
            </div>

            <div className="min-w-0 p-4 sm:p-6 border-b sm:border-b-0 sm:border-l border-[#e3dbc6]">
              <span className="text-[11px] sm:text-xs text-slate-500 block font-medium">كود البناء</span>
              <span className="text-base sm:text-xl font-black font-heading text-[#0a2e23] leading-snug tabular-nums mt-1.5 block">
                معتمد ومطابق 100%
              </span>
            </div>

            <div className="min-w-0 p-4 sm:p-6">
              <span className="text-[11px] sm:text-xs text-slate-500 block font-medium">تأمين العيوب الخفية</span>
              <span className="text-base sm:text-xl font-black font-heading text-[#0a2e23] leading-snug tabular-nums mt-1.5 block">
                10 سنوات
              </span>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14 w-full">
        {/* 2. Who We Are */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-stretch pt-20 md:pt-24 scroll-mt-32">
          <div className="lg:col-span-7 bg-[#fbf9f3] rounded-[14px] border border-[#e3dbc6] p-7 sm:p-9 shadow-[0_12px_32px_-12px_rgba(6,38,28,0.12)] space-y-4">
            <span className="text-xs font-bold text-[#c9ab68] uppercase tracking-wider block">
              منهجيتنا في التطوير
            </span>
            <h2
              className="text-2xl sm:text-3xl font-black font-heading text-[#0a2e23]"
              style={{ lineHeight: 1.7 }}
            >
              أكثر من مجرد مبانٍ.. نصنع أسلوب حياة عائلي
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              انطلقت شركة مُيسر برؤية ترتكز على معالجة التحديات السكنية التقليدية من خلال توفير وحدات تتمتع باستقلالية تامة شبيهة بالفيلا المستقلة وبقيمة استثمارية مدروسة تناسب برامج التمويل البنكي المدعوم.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              نختار مواقع مشاريعنا بعناية فائقة لتكون مجاورة للحدائق العامة والمحاور الحيوية، مع تطبيق معايير كفاءة الطاقة والإنارة الطبيعية والأفنية السماوية في كل تصميم.
            </p>
          </div>

          <div className="lg:col-span-5 group rounded-[14px] border border-[#e3dbc6] bg-[#06261c] overflow-hidden shadow-[0_12px_32px_-12px_rgba(6,38,28,0.18)] aspect-[16/10] lg:aspect-auto lg:h-full">
            <img
              src="/images/shamkha/hero-exterior.webp"
              alt={brand.developer}
              className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] motion-reduce:transform-none"
              loading="lazy"
            />
          </div>
        </section>

        {/* 3. Our Values (Split Panel) */}
        <section className="py-6 lg:py-[60px]">
          <div className="flex flex-col lg:flex-row lg:items-stretch gap-[28px]">
            {/* Right Side: Dark Green Heading Panel */}
            <div
              className="w-full lg:w-[380px] shrink-0 rounded-[18px] border-t-[4px] border-t-[#c9ab68] px-[34px] py-[40px] flex flex-col justify-center shadow-[0_20px_50px_-15px_rgba(6,38,28,0.22)]"
              style={{ background: 'linear-gradient(135deg, #0b3a2c 0%, #06261c 100%)' }}
            >
              <span className="text-[13px] font-bold text-[#c9ab68] block">
                ركائزنا الأساسية
              </span>
              <h2
                className="mt-3 text-2xl sm:text-3xl lg:text-[34px] font-extrabold font-heading text-[#f4efe2]"
                style={{ lineHeight: 1.65 }}
              >
                القيم التي نبني بها ثقة عملائنا
              </h2>
              <div className="w-[60px] h-[2px] bg-[#c9ab68] mt-5" />
            </div>

            {/* Left Side: 2x2 Values Cards Grid */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-[20px]">
              {VALUES.map((v, idx) => {
                const Icon = v.icon;
                return (
                  <div
                    key={idx}
                    className="px-[28px] py-[26px] rounded-[14px] bg-[#fbf9f3] border border-[#e3dbc6] shadow-[0_10px_30px_rgba(6,38,28,0.10)] hover:-translate-y-1 transition-transform duration-300 motion-reduce:transition-none motion-reduce:transform-none flex items-start gap-[18px]"
                  >
                    <div className="w-[50px] h-[50px] shrink-0 rounded-[12px] bg-[#0a2e23] text-[#c9ab68] border border-[#c9ab68]/30 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 space-y-1.5">
                      <h3 className="text-base font-bold text-[#0a2e23] font-heading" style={{ lineHeight: 1.7 }}>
                        {v.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{v.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. Dark Green CTA */}
        <section
          className="rounded-[14px] text-white p-8 pb-24 sm:p-12 sm:pb-24 md:pb-12 border border-[#c9ab68]/25 shadow-[0_20px_50px_-15px_rgba(6,38,28,0.25)] flex flex-col md:flex-row items-center justify-between gap-6"
          style={{ background: 'linear-gradient(135deg, #0b3a2c 0%, #06261c 100%)' }}
        >
          <div className="space-y-2 text-center md:text-right">
            <h3 className="text-xl sm:text-2xl font-black font-heading" style={{ lineHeight: 1.7 }}>
              تصفح مشاريعنا السكنية المتاحة
            </h3>
            <p className="text-xs sm:text-sm text-stone-200/90">
              تعرف على نماذج تاون هاوس الشامخة والخيارات السكنية المتاحة حالياً.
            </p>
          </div>
          <Link
            to="/projects"
            className="px-6 py-3 rounded-[8px] bg-[#c9ab68] hover:bg-[#d5b978] text-[#06261c] text-xs font-bold transition-all duration-300 hover:-translate-y-0.5 motion-reduce:transform-none whitespace-nowrap inline-flex items-center gap-2 shadow-xs shrink-0"
          >
            <span>دليل المشاريع</span>
            <ArrowLeft className="w-4 h-4 text-[#06261c]" />
          </Link>
        </section>
      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
