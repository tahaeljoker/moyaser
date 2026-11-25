import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowLeft, CheckCircle2, ShieldCheck, Layers, Maximize2 } from 'lucide-react';

const MEDIA_VIEWS = [
  { label: 'الواجهة الخارجية', url: '/images/shamkha/hero-exterior.webp' },
  { label: 'التشطيبات الداخلية', url: '/images/shamkha/interior-1.webp' },
  { label: 'المخطط العام', url: '/images/shamkha/masterplan.webp' },
];

const SPECS = [
  { label: 'الوحدات', value: '15 تاون هاوس' },
  { label: 'النماذج', value: '6 نماذج (A–F)' },
  { label: 'المسطحات', value: '302 – 428 م²' },
  { label: 'الاستقلالية', value: 'وحدات مستقلة بالكامل' },
];

export default function FeaturedShamkha() {
  const [activeMedia, setActiveMedia] = useState(0);

  return (
    <section className="py-20 md:py-28 bg-white border-b border-slate-200/80 overflow-hidden" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-xs font-bold text-[#0A2E23]">
              <Layers className="w-3.5 h-3.5 text-[#0A2E23]" />
              <span>المشروع الأيقوني الرائد</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black font-heading text-slate-900 leading-tight">
              تاون هاوس الشامخة — الدمام
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              مجتمع سكني متكامل يجمع بين الاستقلالية الإنشائية التامة وجودة البناء المستدامة في موقع استراتيجي مطل مباشرة على حديقة الأثير العامة.
            </p>
          </div>

          <Link
            to="/projects/shamkha"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 hover:border-[#0A2E23] text-[#0A2E23] text-xs font-bold transition duration-300 hover:bg-[#F8F7F4] self-start md:self-auto whitespace-nowrap shrink-0"
          >
            <span>استعرض تفاصيل المشروع</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        {/* Architectural Showcase Card */}
        <div className="rounded-3xl bg-[#F8F7F4] border border-slate-200/90 overflow-hidden shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Visual Media Column */}
            <div className="lg:col-span-7 relative min-h-[320px] sm:min-h-[420px] bg-slate-950 overflow-hidden group">
              <img
                src={MEDIA_VIEWS[activeMedia].url}
                alt="تاون هاوس الشامخة"
                className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

              {/* Status Badge */}
              <div className="absolute top-4 right-4 z-10">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#0A2E23]/90 text-[#C8A96A] border border-[#C8A96A]/30 backdrop-blur-md shadow-xs">
                  متاح للحجز
                </span>
              </div>

              {/* Media Thumbnails Switcher */}
              <div className="absolute bottom-4 right-4 left-4 z-10 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {MEDIA_VIEWS.map((view, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveMedia(idx)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition backdrop-blur-md ${
                        activeMedia === idx
                          ? 'bg-[#C8A96A] text-[#061F17] shadow-sm'
                          : 'bg-black/60 text-white hover:bg-black/80'
                      }`}
                    >
                      {view.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Editorial Content & Specs Column */}
            <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6 bg-white">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <MapPin className="w-4 h-4 text-[#0A2E23]" />
                  <span>الدمام — حي حديقة الأثير</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black font-heading text-slate-900 leading-tight">
                  خصوصية فيلا منفصلة بتصميم تاون هاوس ذكي
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  تتميز كل وحدة بمدخل وكراج سيارة خاص، وعدادات مياه وكهرباء مستقلة، وتأسيس مصعد لجميع النماذج العلوية، مع عوازل حرارية ومائية معتمدة.
                </p>

                {/* Key Spec Grid */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  {SPECS.map((item, i) => (
                    <div key={i} className="p-3 rounded-xl bg-[#F8F7F4] border border-slate-200/80">
                      <span className="text-[10px] text-slate-500 block font-medium">{item.label}</span>
                      <span className="text-xs sm:text-sm font-bold text-slate-900 font-heading tabular-nums mt-0.5 block">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Guarantees Hallmarks */}
                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#0A2E23] shrink-0" />
                    <span>تأمين شامل 10 سنوات على الهيكل الإنشائي ضد العيوب الخفية</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#0A2E23] shrink-0" />
                    <span>ضمان 25 سنة على القواطع والتمديدات الكهربائية (شركة الفنار)</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">حالة الحجز</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-800">تواصل لمعرفة السعر</span>
                </div>

                <Link
                  to="/projects/shamkha"
                  className="px-5 py-2.5 rounded-xl bg-[#0A2E23] hover:bg-[#0E3F30] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                >
                  <span>استكشف النماذج والوحدات</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
