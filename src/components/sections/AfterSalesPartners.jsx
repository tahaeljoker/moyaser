import { Handshake, Wrench, FileSpreadsheet, Percent, Building } from 'lucide-react';

const afterSalesServices = [
  {
    icon: Wrench,
    title: 'محضر استلام هندسي وفحص نهائي',
    desc: 'معاينة مشتركة مع مهندس مُيسّر قبل توقيع الاستلام للتأكد من جاهزية كافة مرافق الوحدة واختبار التجهيزات.',
  },
  {
    icon: FileSpreadsheet,
    title: 'حقيبة المالك والمخططات التنفيذية (As-Built)',
    desc: 'تسليم المشتري حقيبة تشمل المخططات المعمارية والكهربائية والصحية لسهولة التعديل أو الصيانة مستقبلاً.',
  },
  {
    icon: Percent,
    title: 'خصومات حصرية للتأثيث والأنظمة الذكية',
    desc: 'شراكات مع بيوت الأثاث والمطابخ وأنظمة المنازل الذكية لتقديم أسعار تفضيلية حصرية لعملاء تاون هاوس الشامخة.',
  },
];

const partners = [
  { name: 'JOTUN', label: 'دهانات جوتن العالمية', role: 'الدهانات الخارجية والداخلية' },
  { name: 'أطلال الخليجية', label: 'أطلال الخليجية للألمنيوم', role: 'قطاعات الألمنيوم والواجهات الزجاجية' },
  { name: 'Elite Touch', label: 'Elite Touch Design', role: 'التصميم الداخلي والحلول المعمارية' },
  { name: 'الدرع الآمن', label: 'حلول الدرع الآمن', role: 'أنظمة الأمان والأبواب المصفحة' },
];

export default function AfterSalesPartners() {
  return (
    <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/70 border border-emerald-300 text-emerald-900 text-xs font-bold mb-3">
            <Handshake className="w-3.5 h-3.5 text-emerald-800" />
            <span>خدمات ما بعد البيع وشركاء النجاح</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
            علاقتنا معك تبدأ بعد استلام مفتاح وحدتك
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-2">
            نحرص على مرافقتك في مرحلة ما بعد الشراء من خلال خدمات تسليم دقيقة وشبكة شركاء رائدين بالمملكة.
          </p>
        </div>

        {/* After sales services */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
          {afterSalesServices.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <div key={idx} className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-800 mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">{srv.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{srv.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Partners Grid */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200">
          <div className="text-center mb-6">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">شركاء التوريد والتنفيذ المعتمدون</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {partners.map((p, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-center hover:border-emerald-300 transition">
                <div className="text-sm font-extrabold text-slate-900 font-heading mb-1">{p.name}</div>
                <div className="text-[11px] font-bold text-emerald-800">{p.label}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{p.role}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
