import { Compass, Car, MapPin } from 'lucide-react';

const timedLandmarks = [
  { name: 'مستشفى السعودي الألماني', time: '14 دقيقة', desc: 'صرح طبي متكامل يقدم أعلى معايير الرعاية الصحية' },
  { name: 'مركز الملك عبد العزيز الثقافي (إثراء)', time: '16 دقيقة', desc: 'أيقونة المعرفة والثقافة الرائدة في المنطقة الشرقية' },
  { name: 'مطار الملك فهد الدولي', time: '24 دقيقة', desc: 'اتصال سريع ومباشر بالبوابة الجوية للمنطقة الشرقية' },
];

const nearbyLandmarks = [
  { name: 'النخيل مول', desc: 'أبرز وجهات التسوق والترفيه والمطاعم' },
  { name: 'حديقة الأثير', desc: 'متنفس عائلي وممشى رياضي مجاور' },
  { name: 'فوكس سينما', desc: 'خيارات ترفيهية وعروض سينمائية حديثة' },
];

export default function NearbyLandmarks() {
  return (
    <section className="py-16 sm:py-20 bg-white border-b border-slate-100" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>الموقع الاستراتيجي والمعالم القريبة</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
            موقع حيوي متصل بأهم وجهات الدمام
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-2">
            موقع استثنائي في حي حديقة الأثير بالدمام يوفر وصولاً سريعاً للمرافق الحيوية والمعالم الرئيسية.
          </p>
        </div>

        {/* Timed landmarks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6">
          {timedLandmarks.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 transition-all group"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100/70 text-emerald-900">
                  وجهة رئيسية
                </span>
                <span className="inline-flex items-center gap-1 text-emerald-800 font-mono font-bold text-xs bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  <Car className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{item.time}</span>
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition">
                {item.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Nearby landmarks without invented minutes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {nearbyLandmarks.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-50/60 border border-slate-200 flex items-center justify-between gap-3"
            >
              <div>
                <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
              </div>
              <span className="text-[10px] font-bold text-slate-600 bg-white border border-slate-200 px-2 py-1 rounded-md shrink-0">
                بالقرب من المشروع
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
