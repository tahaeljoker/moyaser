import { MapPin, Navigation, Compass, Car } from 'lucide-react';

const landmarks = [
  { name: 'حديقة الأثير الترفيهية', time: '2 دقيقة', type: 'ترفيه وطبيعة', desc: 'متنفس عائلي وممشى رياضي مجاور للمشروع مباشرة' },
  { name: 'مجمع النخيل مول', time: '12 دقيقة', type: 'تسوق وترفيه', desc: 'أبرز وجهات التسوق والمطاعم والماركات العالمية بالدمام' },
  { name: 'المستشفى السعودي الألماني', time: '14 دقيقة', type: 'رعاية صحية', desc: 'صرح طبي متكامل يقدم أعلى معايير الرعاية الصحية التخصصية' },
  { name: 'مركز إثراء الثقافي العالمي', time: '16 دقيقة', type: 'ثقافة ومعرفة', desc: 'أيقونة أرامكو السعودية الثقافية والمعرفية بالمنطقة الشرقية' },
  { name: 'سينما ڤوكس ومجمع الراشد', time: '10 دقائق', type: 'ترفيه وسينما', desc: 'خيارات ترفيهية متكاملة ومراكز ألعاب وسينما حديثة' },
  { name: 'مطار الملك فهد الدولي', time: '24 دقيقة', type: 'نقل وسفر', desc: 'طرق سريعة مباشرة تربط الحي بالبوابة الجوية للمنطقة الشرقية' },
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
            دقائق معدودة تفصلك عن أهم وجهات الدمام والظهران
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-2">
            موقع استثنائي في حي حديقة الأثير بالدمام يوفر اتصالاً سريعاً بالطرق المحورية وشبكة الخدمات الحيوية.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {landmarks.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700">
                  {item.type}
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
      </div>
    </section>
  );
}
