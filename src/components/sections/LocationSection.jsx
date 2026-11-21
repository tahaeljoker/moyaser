import { MapPin, ExternalLink } from 'lucide-react';
import { brand, locationDistances } from '../../data/projectData.js';

export default function LocationSection() {
  return (
    <section id="location-section" className="bg-slate-50 pt-14 md:pt-20 pb-6" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200/60 mb-2">
              الموقع الاستراتيجي والمسافات الحيوية
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
              في قلب الدمام — {brand.district}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
              موقع نوعي هادئ ومتميز يضعك على مقربة من أهم المعالم الثقافية، المستشفيات، الكورنيش ومطار الملك فهد الدولي.
            </p>
          </div>
          <a
            href={brand.mapQuery}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-sm flex-shrink-0"
          >
            <ExternalLink className="w-4 h-4" />
            <span>فتح الموقع في خرائط Google</span>
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {locationDistances.map((d, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-200/60 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {d.duration}
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 font-heading leading-snug">{d.place}</h4>
                <p className="text-[11px] text-slate-500 mt-1">وصول سريع وسلس عبر الشرايين الرئيسية</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
