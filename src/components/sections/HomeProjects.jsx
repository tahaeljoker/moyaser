import { Link } from 'react-router-dom';
import { MapPin, ArrowLeft, Building2, RefreshCw } from 'lucide-react';

const statusBadge = {
  available: { label: 'متاح للحجز', cls: 'bg-[#0A2E23] text-[#C8A96A] border-[#C8A96A]/30' },
  under_development: { label: 'قيد التطوير والإنشاء', cls: 'bg-amber-900/90 text-amber-200 border-amber-500/30' },
  completed: { label: 'مكتمل بالكامل', cls: 'bg-slate-900/90 text-slate-200 border-white/20' },
};

export default function HomeProjects({ projects = [], loading = false }) {
  // Present other developments (or all active projects if Shamkha is already featured)
  const displayProjects = projects.length > 0
    ? projects.filter((p) => p.slug !== 'shamkha')
    : [];

  const effectiveProjects = displayProjects.length > 0 ? displayProjects : projects;

  return (
    <section className="py-20 md:py-28 bg-[#F8F7F4] border-b border-slate-200/80 overflow-hidden" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-bold text-[#0A2E23] shadow-xs">
              <Building2 className="w-3.5 h-3.5 text-[#0A2E23]" />
              <span>محفظة التطوير السكني</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black font-heading text-slate-900 leading-[1.3]">
              مشاريع سكنية نوعية بالمنطقة الشرقية
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              نطور مجتمعات تاون هاوس حديثة تلبي تطلعات السكن الراقي والاستثمار الآمن، مع التزام تام بجودة التنفيذ واستقلالية الوحدات.
            </p>
          </div>

          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 hover:border-[#0A2E23] text-[#0A2E23] text-xs font-bold transition duration-300 hover:bg-white self-start md:self-auto shadow-xs whitespace-nowrap shrink-0"
          >
            <span>دليل المشاريع السكنية</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        {/* Dynamic Project Cards */}
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-5 h-5 animate-spin text-[#0A2E23]" />
            <span>جاري تحديث بيانات المشاريع...</span>
          </div>
        ) : effectiveProjects.length === 0 ? (
          <div className="p-12 text-center space-y-2 bg-white rounded-3xl border border-slate-200 text-xs text-slate-500">
            <p>يتم حالياً تجهيز وإطلاق المشاريع السكنية القادمة من قبل فريق التطوير.</p>
            <Link to="/contact" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0A2E23] pt-2">
              <span>تواصل للاستفسار عن الطروحات الجديدة</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {effectiveProjects.slice(0, 3).map((project) => {
              const badge = statusBadge[project.status] || statusBadge.available;
              return (
                <div
                  key={project._id || project.slug}
                  className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-[#0A2E23]/40 transition-all duration-500 hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div>
                    {/* Media Header */}
                    <div className="relative aspect-16/10 overflow-hidden bg-slate-950">
                      <img
                        src={project.heroImageUrl || '/images/shamkha/hero-exterior.webp'}
                        alt={project.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                      <div className="absolute top-4 right-4 z-10">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold border backdrop-blur-md shadow-xs ${badge.cls}`}>
                          {badge.label}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-[#0A2E23]" />
                        <span>{project.city} {project.district ? `— ${project.district}` : ''}</span>
                      </div>

                      <h3 className="text-xl font-bold font-heading text-slate-900 group-hover:text-[#0A2E23] transition-colors">
                        {project.name}
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {project.tagline || project.description}
                      </p>

                      {project.specs && project.specs.length > 0 && (
                        <div className="pt-2 flex flex-wrap gap-1.5">
                          {project.specs.slice(0, 2).map((s, i) => (
                            <span key={i} className="text-[10px] bg-[#F8F7F4] text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200">
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between mt-4">
                    <span className="text-[11px] font-bold text-slate-600">تواصل لمعرفة السعر</span>
                    <Link
                      to={`/projects/${project.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#0A2E23] group-hover:text-emerald-700 transition"
                    >
                      <span>التفاصيل والنماذج</span>
                      <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
