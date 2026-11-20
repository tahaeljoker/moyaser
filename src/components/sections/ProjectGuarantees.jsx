import { ShieldCheck, Award, FileText, Check } from 'lucide-react';

const guarantees = [
  {
    period: '10 سنوات',
    title: 'تأمين العيوب الخفية والهيكل الإنشائي',
    provider: 'شركة ملاذ / التعاونية للتأمين',
    desc: 'وثيقة تأمين إلزامية تغطي الهيكل الإنشائي والأساسات الخرسانية، بإشراف مكتب فحص هندسي مستقل معتمد.',
  },
  {
    period: '25 سنة',
    title: 'القواطع الكهربائية والمفاتيح',
    provider: 'شركة الفنار للصناعات الكهربائية',
    desc: 'ضمان استبدال معتمد من المصنّع على لوحات التوزيع والقواطع ومفاتيح الإنارة المطابقة لأعلى معايير السلامة.',
  },
  {
    period: '15 سنة',
    title: 'شبكات السباكة وتمديدات المياه',
    provider: 'أنابيب نيبرو / الشركاء المعتمدون',
    desc: 'ضمان موثق بشهادة فحص ضغط رسمي للشبكات الداخلية وشبكات الصرف والتغذية ضد أي عيوب تصنيع أو تسريب.',
  },
  {
    period: '10 سنوات',
    title: 'العوازل المائية والحرارية والخزانات',
    provider: 'شركات العزل المتخصصة',
    desc: 'شهادة ضمان مختومة لعوازل الأسطح والحمامات والخزانات الأرضية والعلوية المقاومة للرطوبة وتسربات المياه.',
  },
  {
    period: 'سنتان',
    title: 'الألمنيوم والدهانات والتجهيزات',
    provider: 'مُيسّر للتطوير العقاري والشركاء',
    desc: 'ضمان صيانة ومتابعة شامل للأبواب، النوافذ، الإكسسوارات، والدهانات الداخلية والخارجية بعد تاريخ الاستلام.',
  },
];

export default function ProjectGuarantees() {
  return (
    <section className="py-16 sm:py-20 bg-white border-b border-slate-200" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold mb-3">
            <Award className="w-3.5 h-3.5 text-amber-700" />
            <span>الضمانات والتأمين المعتمد</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
            وثائق وضمانات رسمية تسلم للمشتري عند الإفراغ
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-2">
            نلتزم بتسليم ملف ضمانات متكامل يوثق كافة حقوق المالك ويضمن راحة واستقرار الأسرة لسنوات طويلة.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {guarantees.map((g, idx) => (
            <div
              key={idx}
              className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-300 hover:bg-amber-50/20 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-amber-900 bg-amber-100/70 border border-amber-200 px-2.5 py-1 rounded-lg">
                    {g.period}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">{g.provider}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">{g.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{g.desc}</p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-200/60 flex items-center gap-1.5 text-emerald-800 text-[11px] font-bold">
                <Check className="w-3.5 h-3.5" />
                <span>شهادة ضمان رسمية موثقة</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
