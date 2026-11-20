import { Shield, Layers, Wind, Sparkles, Cpu, CheckCircle2 } from 'lucide-react';

const specs = [
  {
    icon: Layers,
    title: 'عزل حراري ومائي مزدوج 10 سنوات',
    desc: 'نظام عزل فوم بولي يوريثان معتمد لكامل الأسطح ودورات المياه، يطابق اشتراطات كود البناء السعودي ويرشد استهلاك التكييف بنسبة 40%.',
    badge: 'معتمد رسمياً',
  },
  {
    icon: Wind,
    title: 'ألمنيوم دبل غلاس عازل للصوت والحرارة',
    desc: 'قطاعات ألمنيوم معالجة بسماكة عالية مع زجاج مزدوج يفصل بينهما غاز خامل يضمن أقصى عزل صوتي وأمان حراري فائق.',
    badge: 'زجاج مزدوج',
  },
  {
    icon: Shield,
    title: 'أبواب أمان مصفحة ومقاومة للحريق',
    desc: 'أبواب مداخل رئيسية مدعمة بفولاذ صلب ومفصلات أمان متعددة النقاط، تجمع بين الفخامة المعمارية والأمان الأسري التام.',
    badge: 'حماية متقدمة',
  },
  {
    icon: Sparkles,
    title: 'أرضيات بورسلان نخب أول مقاسات واسعة',
    desc: 'تشطيبات أرضيات إسبانية وسعودية فاخرة مقاسات 120×60 سم مع فواصل تمدد هندسية مقاومة للخدش والتآكل وسهلة التنظيف.',
    badge: 'نخب أول',
  },
  {
    icon: Cpu,
    title: 'تمديدات كهربائية وسباكة معتمدة',
    desc: 'قواطع وأفياش شركة الفنار المعتمدة، وشبكة تغذية حرارية نيبرو وأنابيب خضراء ألمانية مقاومة للضغط العالي مع فحص ضغط موثق.',
    badge: 'الفنار + نيبرو',
  },
  {
    icon: CheckCircle2,
    title: 'مطابقة تامة للمواصفات والمقاييس (SASO)',
    desc: 'كافة المواد الإنشائية والكهربائية والميكانيكية حاصلة على علامة الجودة السعودية ومطابقة لمتطلبات كود البناء السعودي الصارم.',
    badge: 'كود البناء السعودي',
  },
];

export default function TechnicalSpecs() {
  return (
    <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/70 border border-emerald-300 text-emerald-900 text-xs font-bold mb-3">
            <Shield className="w-3.5 h-3.5 text-emerald-800" />
            <span>الجودة والمعايير الهندسية</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
            مواصفات إنشائية وفنية صُممت لتدوم لعقود
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-2">
            نعتمد في مُيسّر للتطوير العقاري مواد بناء رائدة واختبارات هندسية موثقة تمنحك وعائلتك راحة البال واستدامة الاستثمار.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {specs.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-800">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
