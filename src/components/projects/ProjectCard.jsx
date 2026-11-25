import { Link } from 'react-router-dom';
import { MapPin, ArrowLeft, CheckCircle2, ShieldCheck, MessageCircle } from 'lucide-react';

const statusBadge = {
  available: { label: 'متاح للحجز', cls: 'bg-[#0a2e23] text-[#c9ab68] border-[#c9ab68]/40' },
  under_development: { label: 'قيد التطوير والإنشاء', cls: 'bg-amber-900/90 text-amber-200 border-amber-500/30' },
  completed: { label: 'مكتمل بالكامل', cls: 'bg-slate-900/90 text-slate-200 border-white/20' },
};

export default function ProjectCard({ project, viewMode = 'grid' }) {
  const badge = statusBadge[project.status] || statusBadge.available;
  const whatsappUrl = `https://wa.me/${project.whatsappNumber || '966500550223'}?text=${encodeURIComponent(
    `السلام عليكم، أود الاستفسار عن تفاصيل وحجز وحدات مشروع (${project.name}).`
  )}`;

  if (viewMode === 'editorial') {
    return (
      <div
        className="group bg-[#fbf9f3] rounded-[14px] border border-[#e3dbc6] overflow-hidden shadow-[0_12px_32px_-12px_rgba(6,38,28,0.14)] hover:shadow-[0_20px_44px_-12px_rgba(6,38,28,0.2)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
        dir="rtl"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-5 relative aspect-[16/10] lg:aspect-auto lg:min-h-[320px] bg-[#06261c] overflow-hidden">
            <img
              src={project.heroImageUrl || '/images/shamkha/hero-exterior.webp'}
              alt={project.name}
              className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] motion-reduce:transform-none"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/15 to-transparent pointer-events-none" />
            <div className="absolute top-4 right-4 z-10">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md shadow-xs ${badge.cls}`}>
                {badge.label}
              </span>
            </div>
          </div>

          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <MapPin className="w-4 h-4 text-[#0a2e23]" />
                <span>{project.city} {project.district ? `— ${project.district}` : ''}</span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-black font-heading text-[#0a2e23] leading-snug">
                  {project.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  {project.tagline || project.description}
                </p>
              </div>

              {project.specs && project.specs.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {project.specs.slice(0, 4).map((spec, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-700 bg-white/80 p-2.5 rounded-xl border border-[#e3dbc6]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0a2e23] shrink-0" />
                      <span className="truncate">{spec}</span>
                    </div>
                  ))}
                </div>
              )}

              {project.guarantees && project.guarantees.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-[#0a2e23]">
                  <span className="font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#0a2e23]" />
                    <span>الضمانات:</span>
                  </span>
                  {project.guarantees.slice(0, 3).map((g, idx) => (
                    <span key={idx} className="bg-white/90 px-2.5 py-0.5 rounded-md border border-[#e3dbc6] font-medium">
                      {g.title} ({g.duration})
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-5 border-t border-[#e3dbc6] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-slate-500 block font-semibold">حالة التسعير</span>
                <span className="text-xs sm:text-sm font-bold text-[#0a2e23]">تواصل لمعرفة السعر</span>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl border border-[#c9bd9c] text-[#0a2e23] hover:bg-white text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#0a2e23]" />
                  <span>استفسار فوري</span>
                </a>

                <Link
                  to={`/projects/${project.slug}`}
                  className="px-5 py-2.5 rounded-xl bg-[#0a2e23] hover:bg-[#0e3f30] text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
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

  // P3 Grid Card
  return (
    <div
      className="group bg-[#fbf9f3] rounded-[14px] border border-[#e3dbc6] overflow-hidden shadow-[0_12px_32px_-12px_rgba(6,38,28,0.14)] hover:shadow-[0_20px_44px_-12px_rgba(6,38,28,0.2)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 motion-reduce:transition-none motion-reduce:transform-none flex flex-col justify-between"
      dir="rtl"
    >
      <div>
        <div className="relative aspect-[16/10] overflow-hidden bg-[#06261c]">
          <img
            src={project.heroImageUrl || '/images/shamkha/hero-exterior.webp'}
            alt={project.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] motion-reduce:transform-none"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent pointer-events-none" />
          <div className="absolute top-4 right-4">
            <span className={`px-3 py-1 rounded-full text-[11px] font-bold border backdrop-blur-md ${badge.cls}`}>
              {badge.label}
            </span>
          </div>
        </div>

        <div className="p-6 space-y-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-[#0a2e23]" />
            <span>{project.city} {project.district ? `— ${project.district}` : ''}</span>
          </div>

          <h3 className="text-xl font-bold font-heading text-[#0a2e23]">
            {project.name}
          </h3>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {project.tagline || project.description}
          </p>

          {project.specs && project.specs.length > 0 && (
            <div className="pt-2 flex flex-wrap gap-1.5">
              {project.specs.slice(0, 2).map((s, i) => (
                <span key={i} className="text-[10px] bg-white/80 text-[#0a2e23] px-2.5 py-1 rounded-lg border border-[#e3dbc6] font-medium">
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="p-6 pt-4 border-t border-[#e3dbc6] flex items-center justify-between">
        <span className="text-[11px] font-bold text-slate-600">تواصل لمعرفة السعر</span>
        <Link
          to={`/projects/${project.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0a2e23] hover:text-[#134e3e] transition-colors"
        >
          <span>التفاصيل والنماذج</span>
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform motion-reduce:transform-none" />
        </Link>
      </div>
    </div>
  );
}
