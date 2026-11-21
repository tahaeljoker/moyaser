import { Award, Check } from 'lucide-react';

export const guarantees = [
  {
    period: '10 سنوات',
    title: 'تأمين التعاونية ضد العيوب الخفية',
    desc: 'تأمين رسمي ضد العيوب الخفية مصحوب بتقرير إشراف هندسي معتمد.',
  },
  {
    period: '25 سنة',
    title: 'الأسلاك والكابلات والمفاتيح والأفياش',
    desc: 'ضمان شامل وممتد على شبكة التوصيلات والتجهيزات الكهربائية.',
  },
  {
    period: '15 سنة',
    title: 'التمديدات الداخلية الحرارية والخلاطات والسيفونات',
    desc: 'ضمان طويل الأمد على شبكة السباكة الحرارية وقطع الأدوات الصحية.',
  },
  {
    period: '10 سنوات',
    title: 'الإنتركم',
    desc: 'ضمان على أنظمة الاتصال الداخلي والأجهزة التابعة لها.',
  },
  {
    period: '10 سنوات',
    title: 'خزانات المياه',
    desc: 'ضمان معتمد على الخزانات العلوية والأرضية ومتانتها.',
  },
  {
    period: '10 سنوات',
    title: 'عزل المطابخ والأسقف ودورات المياه',
    desc: 'ضمان رسمي على أعمال العزل المائي والحراري للأسقف والمرافق الرطبة.',
  },
  {
    period: '5 سنوات',
    title: 'السخانات',
    desc: 'ضمان استبدال وصيانة معتمد لسخانات المياه المركزية أو الفردية.',
  },
  {
    period: 'سنتان',
    title: 'الإنارة ومراوح الشفط وباب الكراج',
    desc: 'ضمان صيانة للتجهيزات الكهربائية التشغيلية ومحرك باب الكراج.',
  },
  {
    period: 'سنتان',
    title: 'الألمنيوم',
    desc: 'ضمان معتمد على قطاعات الألمنيوم والنوافذ والزجاج.',
  },
];

export default function ProjectGuarantees() {
  return (
    <section className="py-16 sm:py-20 bg-white border-b border-slate-200" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold mb-3">
            <Award className="w-3.5 h-3.5 text-amber-700" />
            <span>الضمانات المعتمدة للمشروع</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
            ضمانات رسمية موثقة وفق البروشور المعتمد
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-2">
            تسليم رسمي لكافة شهادات الضمان ووثائق التأمين لحفظ حقوق المالك وراحة الأسرة.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {guarantees.map((g, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-amber-900 bg-amber-100/70 border border-amber-200 px-2.5 py-1 rounded-lg">
                    {g.period}
                  </span>
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-1.5">{g.title}</h3>
                <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">{g.desc}</p>
              </div>
              <div className="pt-3 mt-3 border-t border-slate-200/60 flex items-center gap-1.5 text-emerald-800 text-[11px] font-bold">
                <Check className="w-3.5 h-3.5" />
                <span>ضمان رسمي معتمد</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
