import { Link } from 'react-router-dom';
import { MapPin, ArrowLeft, CheckCircle2, ShieldCheck, MessageCircle, FileText } from 'lucide-react';

const statusBadge = {
  available: { label: 'متاح للحجز والإفراغ', cls: 'bg-[#0A2E23] text-[#C8A96A] border-[#C8A96A]/30' },
  under_development: { label: 'قيد التطوير والإنشاء', cls: 'bg-amber-900/90 text-amber-200 border-amber-500/30' },
  completed: { label: 'مكتمل بالكامل', cls: 'bg-slate-900/90 text-slate-200 border-white/20' },
};

export default function ProjectCard({ project, viewMode = 'editorial' }) {
  const badge = statusBadge[project.status] || statusBadge.available;
  const whatsappUrl = `https://wa.me/${project.whatsappNumber || '966500550223'}?text=${encodeURIComponent(
    `السلام عليكم، أود الاستفسار عن تفاصيل وحجز وحدات مشروع (${project.name}).`
  )}`;

  if (viewMode === 'editorial') {
    return (
      <div className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-[#0A2E23]/40 transition-all duration-500" dir="rtl">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Visual Media Column (5 cols) */}
          <div className="lg:col-span-5 relative min-h-[280px] sm:min-h-[340px] bg-slate-950 overflow-hidden">
            <img
              src={project.heroImageUrl || '/images/shamkha/hero-exterior.webp'}
              alt={project.name}
              className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />

            <div className="absolute top-4 right-4 z-10">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md shadow-sm ${badge.cls}`}>
                {badge.label}
              </span>
            </div>

            {project.regaLicense && (
              <div className="absolute bottom-4 right-4 z-10 text-[11px] font-mono text-slate-300 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                ترخيص فال: #{project.regaLicense}
              </div>
            )}
          </div>

          {/* Editorial Specs & Action Column (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <MapPin className="w-4 h-4 text-[#0A2E23]" />
                <span>{project.city} {project.district ? `— ${project.district}` : ''}</span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 group-hover:text-[#0A2E23] transition-colors leading-tight">
                  {project.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  {project.tagline || project.description}
                </p>
              </div>

              {/* Architectural Key Specs */}
              {project.specs && project.specs.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  {project.specs.slice(0, 4).map((spec, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-700 bg-[#F8F7F4] p-2.5 rounded-xl border border-slate-200/70">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0A2E23] shrink-0" />
                      <span className="truncate">{spec}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Guarantees Highlight */}
              {project.guarantees && project.guarantees.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-emerald-900">
                  <span className="font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#0A2E23]" />
                    <span>الضمانات:</span>
                  </span>
                  {project.guarantees.slice(0, 3).map((g, idx) => (
                    <span key={idx} className="bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60 font-medium">
                      {g.title} ({g.duration})
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Actions Row */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">حالة التسعير</span>
                <span className="text-xs sm:text-sm font-bold text-slate-800">تواصل لمعرفة السعر</span>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:text-emerald-900 hover:border-emerald-800 hover:bg-emerald-50/50 text-xs font-bold transition flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-800" />
                  <span>استفسار فوري</span>
                </a>

                <Link
                  to={`/projects/${project.slug}`}
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
    );
  }

  // Grid Mode (Architectural Vertical Card)
  return (
    <div className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-[#0A2E23]/40 transition-all duration-500 hover:-translate-y-1 flex flex-col justify-between" dir="rtl">
      <div>
        <div className="relative aspect-16/10 overflow-hidden bg-slate-950">
          <img
            src={project.heroImageUrl || '/images/shamkha/hero-exterior.webp'}
            alt={project.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
          <div className="absolute top-4 right-4">
            <span className={`px-3 py-1 rounded-full text-[11px] font-bold border backdrop-blur-md ${badge.cls}`}>
              {badge.label}
            </span>
          </div>
          {project.regaLicense && (
            <div className="absolute bottom-3 right-4 text-[10px] text-slate-300 font-mono">
              ترخيص: {project.regaLicense}
            </div>
          )}
        </div>

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
}
