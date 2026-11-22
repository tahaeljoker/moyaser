import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowLeft, Building2, CheckCircle2, ShieldCheck, ArrowUpRight, Maximize2 } from 'lucide-react';
import CinematicLightbox from '../ui/CinematicLightbox.jsx';

const projectThumbnails = [
  { title: 'الواجهة الخارجية لمشروع تاون هاوس الشامخة', label: 'الواجهة الخارجية', url: '/images/shamkha/hero-exterior.webp' },
  { title: 'التشطيبات وصالات الاستقبال الفاخرة', label: 'التشطيبات الداخلية', url: '/images/shamkha/interior-1.webp' },
  { title: 'المخطط الهندسي العام لـ 15 وحدة', label: 'المخطط العام', url: '/images/shamkha/masterplan.webp' },
];

const SPECS = [
  { label: 'إجمالي الوحدات', val: '15 تاون هاوس' },
  { label: 'تنوع النماذج', val: '6 نماذج (A–F)' },
  { label: 'مسطحات البناء', val: '302 – 428 م²' },
  { label: 'الملكية', val: 'صك إلكتروني مستقل' },
];

export default function ProjectsShowcase({ projects = [], loading = false }) {
  const [activeMedia, setActiveMedia] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); observer.disconnect(); }
    }, { threshold: 0.1 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const primaryProject = projects[0] || {
    slug: 'shamkha',
    name: 'تاون هاوس الشامخة',
    description: 'مشروع تاون هاوس سكني فاخر يدمج بين الاستقلالية الإنشائية التامة وجودة البناء المستدامة بموقع مميز مطل على حديقة الأثير العامة.',
    city: 'الدمام',
    district: 'حي حديقة الأثير',
    heroImageUrl: '/images/shamkha/hero-exterior.webp',
    regaLicense: '1200028491',
  };

  const otherProjects = projects.slice(1);

  return (
    <section ref={sectionRef} className="py-20 md:py-28 bg-white border-b border-slate-200/80 overflow-hidden" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          className={`flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-xs font-bold text-[#0A2E23]">
              <Building2 className="w-3.5 h-3.5" />
              <span>محفظة التطوير السكني</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black font-heading text-slate-900 leading-tight">
              مشاريع سكنية مستقلة تُصاغ بأعلى دقة هندسية
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              نطور مجتمعات تاون هاوس حديثة بالمنطقة الشرقية تلبي تطلعات السكن الراقي وتمنح كل عائلة خصوصية الفيلا المنفصلة بصك إلكتروني مستقل.
            </p>
          </div>

          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 hover:border-[#0A2E23] text-[#0A2E23] text-xs font-bold transition duration-300 self-start md:self-auto hover:bg-[#F8F7F4]"
          >
            <span>عرض دليل المشاريع</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        {/* Flagship Architectural Master Card */}
        <div
          className={`relative rounded-3xl bg-[#F8F7F4] border border-slate-200/80 overflow-hidden shadow-xs transition-all duration-700 delay-100 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Visual Media Showcase with Click to Expand */}
            <div
              onClick={() => setLightboxOpen(true)}
              className="lg:col-span-7 relative min-h-[340px] sm:min-h-[420px] bg-slate-950 overflow-hidden group cursor-pointer"
            >
              <img
                src={projectThumbnails[activeMedia]?.url || primaryProject.heroImageUrl}
                alt={primaryProject.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />

              {/* Status & Maximize Button */}
              <div className="absolute top-4 right-4 z-10 flex flex-wrap items-center gap-2">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#0A2E23]/90 text-[#C8A96A] border border-[#C8A96A]/30 backdrop-blur-md shadow-sm">
                  متاح للحجز والإفراغ الفوري
                </span>
                <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/90 text-slate-900 backdrop-blur-md inline-flex items-center gap-1.5 shadow-sm">
                  <MapPin className="w-3.5 h-3.5 text-emerald-800" />
                  <span>{primaryProject.city} — {primaryProject.district}</span>
                </span>
              </div>

              <div className="absolute top-4 left-4 z-10 p-2 rounded-xl bg-slate-950/70 border border-white/20 text-white opacity-0 group-hover:opacity-100 transition duration-300">
                <Maximize2 className="w-4 h-4" />
              </div>

              {/* Interactive Thumbnail Gallery Peeks */}
              <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-2 bg-slate-950/70 p-1.5 rounded-2xl backdrop-blur-md border border-white/15">
                  {projectThumbnails.map((thumb, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveMedia(idx)}
                      className={`relative px-3 py-1 rounded-xl text-[11px] font-bold transition duration-300 ${
                        activeMedia === idx
                          ? 'bg-[#0A2E23] text-white shadow-xs'
                          : 'text-stone-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {thumb.label}
                    </button>
                  ))}
                </div>

                <span className="hidden sm:inline-flex text-[11px] text-stone-300 font-mono bg-slate-950/70 px-3 py-1 rounded-xl backdrop-blur-md border border-white/15 tabular-nums">
                  REGA #{primaryProject.regaLicense || '1200028491'}
                </span>
              </div>
            </div>

            {/* Editorial Information Column */}
            <div className="lg:col-span-5 p-7 sm:p-9 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-widest block font-mono">
                    المشروع المميز // FLAGSHIP
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 leading-snug">
                    {primaryProject.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                    {primaryProject.description}
                  </p>
                </div>

                {/* Key Architectural Specifications Grid */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  {SPECS.map((s, i) => (
                    <div key={i} className="p-3.5 rounded-2xl bg-white border border-slate-200/80">
                      <span className="text-[10px] text-slate-400 block font-semibold">{s.label}</span>
                      <span className="text-sm font-bold text-slate-900 tabular-nums">{s.val}</span>
                    </div>
                  ))}
                </div>

                {/* Trust and Assurance Hallmarks */}
                <div className="space-y-2 pt-1 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#0A2E23] shrink-0" />
                    <span>كراج سيارة مستقل ومدخل خاص لكل وحدة</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#0A2E23] shrink-0" />
                    <span>تأسيس مصاعد راكبة وعزل معتمد بكود البناء</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center gap-3">
                <Link
                  to={`/projects/${primaryProject.slug}`}
                  className="flex-1 text-center px-5 py-3 rounded-xl bg-[#0A2E23] hover:bg-[#0E3F30] text-white text-xs font-bold transition shadow-xs inline-flex items-center justify-center gap-2"
                >
                  <span>استكشف تفاصيل المشروع</span>
                  <ArrowLeft className="w-4 h-4" />
                </Link>
                <Link
                  to="/contact"
                  className="px-5 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold transition inline-flex items-center justify-center gap-1.5"
                >
                  <span>احجز معاينة</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-500" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Projects Grid (When Additional Projects Exist) */}
        {otherProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-10">
            {otherProjects.map((proj) => (
              <div
                key={proj._id}
                className="group rounded-3xl bg-[#F8F7F4] border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-56 overflow-hidden bg-slate-950">
                    <img
                      src={proj.heroImageUrl || '/images/shamkha/hero-exterior.webp'}
                      alt={proj.name}
                      className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-[11px] font-bold bg-[#0A2E23]/90 text-white backdrop-blur-xs">
                      {proj.city} {proj.district ? `— ${proj.district}` : ''}
                    </span>
                  </div>
                  <div className="p-6 space-y-2">
                    <h4 className="text-lg font-bold text-slate-900 font-heading">{proj.name}</h4>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{proj.description || proj.tagline}</p>
                  </div>
                </div>
                <div className="p-6 pt-0 border-t border-slate-200/60 mt-4 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-800 font-mono">صكوك إلكترونية</span>
                  <Link
                    to={`/projects/${proj.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#0A2E23] hover:underline"
                  >
                    <span>تفاصيل المشروع</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cinematic Fullscreen Lightbox */}
      <CinematicLightbox
        isOpen={lightboxOpen}
        images={projectThumbnails}
        currentIndex={activeMedia}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(idx) => setActiveMedia(idx)}
      />
    </section>
  );
}
