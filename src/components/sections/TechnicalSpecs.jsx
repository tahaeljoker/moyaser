import { Shield, Layers, Wind, Sparkles, Cpu, CheckCircle2, Home, Paintbrush } from 'lucide-react';

const specs = [
  {
    icon: Layers,
    title: 'عزل مائي وحراري',
    desc: 'منظومة عزل متكاملة للأسطح ودورات المياه والمطابخ لحماية المبنى وترشيد استهلاك الطاقة.',
  },
  {
    icon: Wind,
    title: 'نوافذ ألمنيوم دبل جلاس',
    desc: 'قطاعات ألمنيوم متينة مع زجاج مزدوج لعزل الصوت والحرارة وتوفير الهدوء الداخلي.',
  },
  {
    icon: Shield,
    title: 'أبواب خارجية قوية وآمنة',
    desc: 'أبواب خارجية متينة مصممة لتوفير أعلى درجات الأمان والخصوصية للمنزل.',
  },
  {
    icon: Cpu,
    title: 'تمديدات كهربائية وفق أعلى معايير السلامة',
    desc: 'شبكات وتمديدات كهربائية منفذة باحترافية تامة لتأمين استقرار الأحمال والسلامة الكهربائية.',
  },
  {
    icon: Home,
    title: 'أسقف جبسية',
    desc: 'تصاميم أسقف جبسية عصرية بتوزيع متناسق يتيح خيارات إنارة ديكورية حديثة.',
  },
  {
    icon: CheckCircle2,
    title: 'أنظمة سباكة بمواد بضمانات مصنعية',
    desc: 'شبكة تغذية وصرف بمواد معتمدة ذات جودة عالية مدعومة بضمانات مصنعية موثقة.',
  },
  {
    icon: Sparkles,
    title: 'أرضيات وبلاط فاخر',
    desc: 'أرضيات وبورسلان وبلاط عالي الجودة بتشطيبات أنيقة ومقاومة للاستخدام اليومي.',
  },
  {
    icon: Paintbrush,
    title: 'تشطيبات داخلية عالية الجودة',
    desc: 'تنفيذ دقيق لكافة تفاصيل التشطيب الداخلي من دهانات وأعمال ديكورية بمقاييس هندسية متقنة.',
  },
];

export default function TechnicalSpecs() {
  return (
    <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/70 border border-emerald-300 text-emerald-900 text-xs font-bold mb-3">
            <Shield className="w-3.5 h-3.5 text-emerald-800" />
            <span>المواصفات الفنية المعتمدة</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
            مواصفات إنشائية وفنية مطابقة للبروشور الرسمي
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-2">
            تم انتقاء كل عنصر في مشروع تاون هاوس الشامخة لضمان الجودة والمتانة والراحة الدائمة للأسرة.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {specs.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-800 mb-3">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-1.5">{item.title}</h3>
                  <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
