import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Compass, ShieldCheck, Cpu, ArrowLeft, CheckCircle2, Layers } from 'lucide-react';

const pillars = [
  {
    id: 'structural',
    tag: 'STR-01',
    title: 'الهيكل والاستقلالية الإنشائية',
    subtitle: 'استقلالية الفيلا بمرونة التاون هاوس الحديث',
    desc: 'تصميم إنشائي يوفر عزلاً تاماً لكل وحدة مع مدخل وكراج خاص، وخزان مياه أرضي وعلوي منفصل، وعدادات خدمات مستقلة بالكامل.',
    image: '/images/shamkha/render-a.webp',
    icon: Building2,
    specs: ['وحدات مستقلة', 'كراج ومدخل خاص', 'خزان وعدادات مستقلة'],
    metric: '100%',
    metricLabel: 'استقلالية تامة للمرافق',
  },
  {
    id: 'spatial',
    tag: 'ENG-02',
    title: 'التوزيع الهندسي والإضاءة الطبيعية',
    subtitle: 'مسطحات مدروسة تستغل كل متر بكفاءة',
    desc: 'مخططات هندسية تعتمد على فناء الإضاءة السماوية (Sky Light) لتدفق الضوء الطبيعي لجميع أرجاء المسكن مع توفير الخصوصية العائلية التامة دون إهدار بالمساحات.',
    image: '/images/shamkha/interior-2.webp',
    icon: Compass,
    specs: ['فناء إضاءة Sky Light', 'عزل صوتي متطور', 'توزيع مدروس للمساحات'],
    metric: '302–428 م²',
    metricLabel: 'مسطحات بناء واسعة',
  },
  {
    id: 'standards',
    tag: 'QAL-03',
    title: 'التشطيبات وعوازل كود البناء',
    subtitle: 'مطابقة صارمة لأعلى المعايير الإنشائية',
    desc: 'تنفيذ دقيق يطابق كود البناء السعودي (SBC) باستخدام عوازل مائية وحرارية معتمدة للأسطح ودورات المياه، وتمديدات كهربائية وصحية من كبرى الشركات المعتمدة.',
    image: '/images/shamkha/interior-1.webp',
    icon: ShieldCheck,
    specs: ['كود البناء السعودي SBC', 'عوازل مائية وحرارية', 'ضمانات إنشائية معتمدة'],
    metric: 'SBC',
    metricLabel: 'اعتماد هندسي كامل',
  },
  {
    id: 'technology',
    tag: 'TEC-04',
    title: 'البنية التحتية والجاهزية الذكية',
    subtitle: 'تأسيس تقني مستدام للمستقبل',
    desc: 'تجهيزات متكاملة للبنية التحتية تشمل تأسيس مصاعد تخدم الأدوار، وشبكات ألياف بصرية، وتأسيسات أنظمة التحكم الذكي بالإضاءة والتكييف وكاميرات المراقبة.',
    image: '/images/shamkha/render-b.webp',
    icon: Cpu,
    specs: ['تأسيس مصاعد راكبة', 'شبكة ألياف بصرية', 'تجهيزات سمارت هوم'],
    metric: 'Smart',
    metricLabel: 'بنية تحتية متطورة',
  },
];

export default function ArchitecturalVision({ settings = null }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -60px 0px', threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const activePillar = pillars[activeIdx];
  const ActiveIcon = activePillar.icon;

  return (
    <section ref={sectionRef} className="py-20 md:py-28 bg-[#F8F7F4] border-b border-slate-200/80 overflow-hidden" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          className={`max-w-3xl mb-14 space-y-3 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/10 border border-emerald-900/20 text-xs font-bold text-[#0A2E23]">
            <Layers className="w-3.5 h-3.5" />
            <span>فلسفة التطوير والبناء</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black font-heading text-slate-900 leading-tight">
            الرؤية المعمارية ومعايير الجودة الإنشائية
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
            نطور مشاريع تاون هاوس نوعية بمواصفات هندسية تضمن الاستقلالية التامة لكل أسرة، وتدمج بين جمالية الواجهات وحرفية البناء المستدام.
          </p>
        </div>

        {/* Interactive Architectural Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Pillars Selector List */}
          <div className="lg:col-span-5 space-y-3 flex flex-col justify-between">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              const isActive = activeIdx === idx;
              return (
                <div
                  key={pillar.id}
                  onClick={() => setActiveIdx(idx)}
                  onMouseEnter={() => setActiveIdx(idx)}
                  className={`group relative p-5 rounded-2xl cursor-pointer transition-all duration-300 border text-right select-none ${
                    isActive
                      ? 'bg-white border-[#0A2E23] shadow-md shadow-emerald-950/5'
                      : 'bg-white/60 border-slate-200/80 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  {/* Active Indicator Bar */}
                  <div
                    className={`absolute right-0 top-3 bottom-3 w-1.5 rounded-l-full bg-[#0A2E23] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isActive ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-50'
                    }`}
                  />

                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300 ${
                        isActive ? 'bg-[#0A2E23] text-[#C8A96A]' : 'bg-slate-100 text-slate-600 group-hover:text-slate-900'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-mono text-[10px] font-bold text-emerald-800 tracking-wider">
                          {pillar.tag}
                        </span>
                        {isActive && (
                          <span className="text-[10px] font-bold text-[#C8A96A] bg-[#0A2E23] px-2 py-0.5 rounded-full">
                            مُفعل
                          </span>
                        )}
                      </div>
                      <h3 className={`text-sm sm:text-base font-bold font-heading transition-colors ${isActive ? 'text-[#0A2E23]' : 'text-slate-900'}`}>
                        {pillar.title}
                      </h3>
                      <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed mt-1 line-clamp-2">
                        {pillar.subtitle}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cinematic Blueprint & Media Stage */}
          <div className="lg:col-span-7 relative rounded-3xl bg-white border border-slate-200/90 overflow-hidden shadow-sm flex flex-col justify-between min-h-[420px]">
            {/* Top CAD Drafting Accents */}
            <div className="absolute top-3 left-4 right-4 z-20 flex items-center justify-between pointer-events-none text-[10px] font-mono text-slate-500">
              <span className="bg-slate-900/75 backdrop-blur-xs text-stone-200 px-2.5 py-1 rounded-md border border-white/10">
                MUYASSAR // {activePillar.tag}
              </span>
              <span className="bg-white/85 backdrop-blur-xs text-emerald-950 px-2.5 py-1 rounded-md border border-slate-200/80 font-bold tabular-nums">
                {activePillar.metricLabel}: {activePillar.metric}
              </span>
            </div>

            {/* Media Canvas with Cross-fade */}
            <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-950">
              <img
                key={activePillar.id}
                src={activePillar.image}
                alt={activePillar.title}
                className="w-full h-full object-cover animate-ken-burns-slow transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              {/* Floating Architectural Badge */}
              <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#0A2E23] text-emerald-300 flex items-center justify-center border border-emerald-700/40 shadow-xs">
                  <ActiveIcon className="w-4 h-4" />
                </div>
                <div className="text-right">
                  <span className="text-white text-xs font-bold block">{activePillar.title}</span>
                  <span className="text-stone-300 text-[10px] block font-mono">{activePillar.metricLabel}</span>
                </div>
              </div>
            </div>

            {/* Detailed Architectural Specs Bar */}
            <div className="p-6 sm:p-7 bg-white space-y-4">
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {activeIdx === 0 ? (settings?.siteCopy?.archVisionDesc?.trim() || activePillar.desc) : activePillar.desc}
              </p>

              {/* Verified Badges */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  {activePillar.specs.map((spec, i) => (
                    <div
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#F8F7F4] border border-slate-200 text-[11px] font-bold text-slate-800"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0A2E23]" />
                      <span>{activeIdx === 0 && i === 0 ? (settings?.siteCopy?.archVisionSpec?.trim() || spec) : spec}</span>
                    </div>
                  ))}
                </div>

                <Link
                  to="/projects/shamkha"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0A2E23] hover:text-[#0E3F30] transition group"
                >
                  <span>استكشف النماذج المعمارية</span>
                  <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
