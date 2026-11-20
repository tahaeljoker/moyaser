import { ArrowLeft, MessageCircle, Compass } from 'lucide-react';
import { brand, hero } from '../../data/projectData.js';

export default function Hero({ settings = null }) {
  const currentWhatsApp = settings?.whatsappNumber || brand.whatsapp;
  const currentTitle = settings?.heroTitle || hero.title;
  const currentSubtitle = settings?.heroSubtitle || hero.titleSub;
  const currentDescription = settings?.aboutText || hero.description;
  const heroImg = settings?.heroImageUrl || hero.bgImage;
  const tour3d = settings?.projectTour3dUrl || '';

  const waUrl = `https://api.whatsapp.com/send?phone=${currentWhatsApp}&text=${encodeURIComponent(
    'السلام عليكم ورحمة الله، أود الاستفسار عن مشروع تاون هاوس الشامخة بالدمام.'
  )}`;

  return (
    <section
      id="hero-section"
      className="relative min-h-[580px] lg:min-h-[640px] flex items-center justify-center overflow-hidden bg-slate-950 text-white"
    >
      <div className="absolute inset-0 z-0">
        <img
          src={heroImg}
          alt={currentTitle}
          className="w-full h-full object-cover opacity-35"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/90 via-slate-950/90 to-slate-950" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/80 backdrop-blur-md border border-emerald-500/30 text-amber-300 text-xs font-bold mb-6 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span>{brand.developer} — المطور الحصري للمشروع</span>
        </div>

        <p className="text-sm sm:text-base font-semibold text-emerald-300 mb-2 font-heading tracking-wide">
          {hero.tagline}
        </p>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-heading text-white tracking-tight leading-tight mb-6">
          {currentTitle}
          <span className="block text-xl sm:text-3xl lg:text-4xl font-bold text-slate-200 mt-2 font-heading">
            {currentSubtitle}
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10">
          {currentDescription}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto mb-10">
          {hero.metrics.map((m, idx) => (
            <div
              key={idx}
              className="p-3 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-right"
            >
              <span className="text-xs text-slate-300 block mb-1">{m.label}</span>
              <span className="text-xl sm:text-2xl font-black text-amber-400 font-heading block">
                {m.value}
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">{m.sub}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="#matrix-section"
            className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-slate-950 font-black text-xs shadow-xl transition flex items-center justify-center gap-2"
          >
            <span>{hero.ctaPrimary}</span>
            <ArrowLeft className="w-4 h-4" />
          </a>
          {tour3d && (
            <a
              href={tour3d}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-purple-900/60 hover:bg-purple-800 text-white border border-purple-500/40 backdrop-blur-md font-bold text-xs transition flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4 text-purple-300" />
              <span>جولة 3D في المشروع</span>
            </a>
          )}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/25 backdrop-blur-md font-bold text-xs transition flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>{hero.ctaSecondary}</span>
          </a>
        </div>
      </div>
    </section>
  );
}