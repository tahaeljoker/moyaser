import { useState, useMemo } from 'react';
import { ShieldCheck, CheckCircle2, Award, Building2, Layers, Cpu, Compass, FileCheck } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'كافة الشركاء' },
  { id: 'engineering', label: 'الهندسة والإنشاءات' },
  { id: 'insulation', label: 'العزل والاستدامة' },
  { id: 'finishes', label: 'التشطيبات والتصميم' },
  { id: 'governance', label: 'الحوكمة والاعتماد' },
];

const PARTNERS = [
  {
    id: 'jotun',
    name: 'جوتن — JOTUN',
    latin: 'Jotun Paints KSA',
    category: 'finishes',
    role: 'أنظمة الدهانات المعمارية المعتمدة',
    spec: 'دهانات داخلية وخارجية مقاومة للرطوبة والمناخ الساحلي',
    guarantee: 'معتمد للمناخ الخليجي',
    icon: Compass,
    accent: 'border-amber-500/30 bg-amber-500/5 text-amber-700',
  },
  {
    id: 'alfanar',
    name: 'شركة الفنار — ALFANAR',
    latin: 'Alfanar Electric',
    category: 'engineering',
    role: 'القواطع والتمديدات واللوحات الكهربائية',
    spec: 'قواطع وأسلاك نحاسية عالية الجودة مطابقة للمواصفات السعودية (SASO)',
    guarantee: 'ضمان مصنعي 25 سنة',
    icon: Cpu,
    accent: 'border-emerald-600/30 bg-emerald-600/5 text-emerald-800',
  },
  {
    id: 'atlal',
    name: 'أطلال الخليجية للمقاولات',
    latin: 'Atlal Al-Khaleej Contracting',
    category: 'engineering',
    role: 'التوريدات الإنشائية واختبارات الخرسانة',
    spec: 'خرسانة جاهزة معالجة وإشراف إنشائي معتمد على مراحل الصب والحديد',
    guarantee: 'مطابق لكود البناء السعودي (SBC)',
    icon: Building2,
    accent: 'border-slate-400/30 bg-slate-500/5 text-slate-800',
  },
  {
    id: 'dera',
    name: 'حلول الدرع الآمن',
    latin: 'Safe Shield Insulation',
    category: 'insulation',
    role: 'العزل المائي والحراري المعتمد',
    spec: 'عزل فوم بولي يوريثان وعوازل مائية متعددة الطبقات للأسطح ودورات المياه',
    guarantee: 'ضمان معتمد 10 سنوات',
    icon: ShieldCheck,
    accent: 'border-blue-500/30 bg-blue-500/5 text-blue-800',
  },
  {
    id: 'elite',
    name: 'إيليت تاتش — Elite Touch',
    latin: 'Elite Touch Design',
    category: 'finishes',
    role: 'الهندسة المعمارية والتصميم الداخلي',
    spec: 'توزيع فراغات معاصرة ودراسة تدفق الإنارة الطبيعية والممرات العائلية',
    guarantee: 'معايير السكن العصري المريح',
    icon: Layers,
    accent: 'border-purple-500/30 bg-purple-500/5 text-purple-800',
  },
];

const TRUST_PILLARS = [
  {
    title: 'سلاسل توريد معتمدة',
    desc: 'انتقاء صارم للموردين والمصانع المعتمدة من الهيئة السعودية للمواصفات والمقاييس (SASO).',
  },
  {
    title: 'ضمانات موثقة وممتدة',
    desc: 'تسليم شهادات الضمان الرسمية المباشرة من الشركات المصنعة للعميل.',
  },
  {
    title: 'فحص وضبط الجودة',
    desc: 'إشراف هندسي مستمر واختبارات معملية دورية لكافة تمديدات المياه والكهرباء والخرسانة.',
  },
];

export default function PartnersSection({ settings = null }) {
  const [activeTab, setActiveTab] = useState('all');

  const filtered = useMemo(() => {
    if (activeTab === 'all') return PARTNERS;
    return PARTNERS.filter((p) => p.category === activeTab);
  }, [activeTab]);

  return (
    <section className="py-20 md:py-28 bg-[#F8F7F4] border-b border-slate-200/80 overflow-hidden" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-bold text-[#0A2E23] shadow-xs">
              <Award className="w-3.5 h-3.5 text-[#C8A96A]" />
              <span>منظومة الجودة وسلاسل التوريد</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black font-heading text-slate-900 leading-tight">
              شركاء النجاح والجودة الإنشائية
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              نتعاون مع كبرى الشركات الوطنية والعالمية المصنعة لضمان تطبيق أعلى مواصفات كود البناء السعودي وتوفير ضمانات حقيقية ممتدة لكافة وحداتنا السكنية.
            </p>
          </div>

          {/* Interactive Category Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 self-start md:self-auto max-w-full">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${activeTab === cat.id
                    ? 'bg-[#0A2E23] text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Partners Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.id}
                className="group relative bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:shadow-xl hover:border-[#0A2E23]/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-xl bg-[#F8F7F4] border border-slate-200 flex items-center justify-center text-[#0A2E23] group-hover:bg-[#0A2E23] group-hover:text-white transition-colors duration-300">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${item.accent}`}>
                      {item.guarantee}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold font-heading text-slate-900 group-hover:text-[#0A2E23] transition-colors">
                      {item.name}
                    </h3>
                    <span className="text-[10px] font-mono text-slate-400 block tracking-wider mt-0.5" dir="ltr">
                      {item.latin}
                    </span>
                  </div>

                  <p className="text-xs font-medium text-emerald-900/90 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100/80 leading-relaxed">
                    {item.role}
                  </p>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.id === 'rega' ? (settings?.siteCopy?.partnersMarketingSpec?.trim() || item.spec) : item.spec}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0A2E23]" />
                    <span>شريك معتمد وموثق</span>
                  </span>
                  <span className="font-mono text-[10px] text-slate-400 uppercase">
                    معتمد لدى مُيسر
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Pillars Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-slate-100">
            {TRUST_PILLARS.map((pillar, i) => (
              <div key={i} className={`space-y-1.5 ${i > 0 ? 'pt-4 md:pt-0' : ''}`}>
                <div className="flex items-center gap-2 text-xs font-bold font-heading text-slate-900">
                  <ShieldCheck className="w-4 h-4 text-[#0A2E23]" />
                  <h4>{pillar.title}</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {i === 1 ? (settings?.siteCopy?.partnersWarrantyDesc?.trim() || pillar.desc) : pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
