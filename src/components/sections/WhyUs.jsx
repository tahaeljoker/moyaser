import { ShieldCheck, FileCheck, Layers, Award } from 'lucide-react';

const PILLARS = [
  {
    icon: Layers,
    title: 'استقلالية إنشائية تامة',
    desc: 'نضمن الخصوصية العائلية المطلقة عبر مداخل وكراجات سيارات مستقلة، وجدران إنشائية منفصلة بدون أي فواصل مشتركة.',
  },
  {
    icon: FileCheck,
    title: 'استقلالية كاملة للوحدات',
    desc: 'كافة وحداتنا متوافقة مع حلول كافة البنوك والجهات التمويلية.',
  },
  {
    icon: ShieldCheck,
    title: 'كود البناء السعودي وتأمين العيوب',
    desc: 'تطبيق دقيق لكافة اشتراطات كود البناء السعودي تحت إشراف هندسي معتمد، مع وثيقة تأمين شاملة لمدة 10 سنوات ضد العيوب الخفية.',
  },
  {
    icon: Award,
    title: 'ضمانات ممتدة من الشركات المصنعة',
    desc: 'توريدات معتمدة من كبرى المصانع الوطنية مباشرة، تشمل ضمان 25 سنة على القواطع الكهربائية وضمان 10 سنوات على العزل.',
  },
];

export default function WhyUs({ settings = null }) {
  return (
    <section className="py-20 md:py-28 bg-white border-b border-slate-200/80 overflow-hidden" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F8F7F4] border border-slate-200 text-xs font-bold text-[#0A2E23]">
            <Award className="w-3.5 h-3.5 text-[#C8A96A]" />
            <span>معايير التطوير العقاري</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black font-heading text-slate-900 leading-tight">
            لماذا تختار السكن في مشاريع مُيسر؟
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            نعمل وفق فلسفة تطويرية واضحة تضع راحة العائلة السعودية واستدامة العقار على المدى الطويل في صميم كل تفصيلة هندسية.
          </p>
        </div>

        {/* 4 Architectural Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PILLARS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 sm:p-7 rounded-3xl bg-[#F8F7F4] border border-slate-200/80 hover:border-[#0A2E23]/40 hover:bg-white hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-[#0A2E23] shadow-xs">
                  <Icon className="w-6 h-6 text-[#0A2E23]" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-bold font-heading text-slate-900 leading-snug">
                    {idx === 1 ? (settings?.siteCopy?.whyUsIndependenceTitle?.trim() || item.title) : item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {idx === 1 ? (settings?.siteCopy?.whyUsIndependenceDesc?.trim() || item.desc) : item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
