import { MoveUp, Zap, Shield } from 'lucide-react';
import { about } from '../../data/projectData.js';

export default function AboutSection() {
  const getIcon = (iconName) => {
    if (iconName === 'move-up') return <MoveUp className="w-5 h-5" />;
    if (iconName === 'zap') return <Zap className="w-5 h-5" />;
    return <Shield className="w-5 h-5" />;
  };

  return (
    <section id="about-section" className="bg-slate-50 border-b border-slate-200 py-14 md:py-20" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Storytelling & Stats */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-900 tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>{about.category}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-[40px] font-black text-slate-900 font-heading leading-[1.25] tracking-tight">
              {about.headline}
            </h2>

            <div className="space-y-3.5 text-slate-600 text-xs sm:text-sm leading-relaxed">
              <p className="font-medium text-slate-700 leading-relaxed">{about.lead}</p>
              <p className="text-slate-500 leading-relaxed">{about.subtext}</p>
            </div>

            <div className="pt-6 border-t border-slate-200/90 grid grid-cols-3 gap-4 sm:gap-6">
              {about.stats.map((s, idx) => (
                <div key={idx}>
                  <span className="block text-3xl sm:text-4xl lg:text-5xl font-black text-emerald-950 font-heading tracking-tight">
                    {s.num}
                  </span>
                  <span className="block text-xs sm:text-sm font-bold text-slate-700 mt-1">{s.label}</span>
                  {s.sub && <span className="text-[11px] text-slate-400 block mt-0.5">{s.sub}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Architectural Visual */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/90 shadow-lg group bg-slate-950">
              <img
                src={about.image}
                alt="واجهات تاون هاوس الشامخة المعمارية"
                className="w-full h-64 sm:h-80 lg:h-88 object-cover transition duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent pointer-events-none" />
              <div className="absolute bottom-4 right-4 left-4 text-white">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                  الإتقان الهندسي والواجهات
                </span>
                <p className="text-xs sm:text-sm font-medium text-slate-100 leading-snug">
                  {about.imageCaption}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {about.pills.map((p, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-start gap-3.5 hover:border-emerald-700/40 hover:shadow-md transition"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center flex-shrink-0 border border-emerald-100">
                    {getIcon(p.icon)}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 font-heading">{p.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
