import { Link } from 'react-router-dom';
import { Compass, Building, Users2, ArrowLeft } from 'lucide-react';

const SERVICES = [
  {
    icon: Building,
    title: 'تطوير المجتمعات السكنية',
    desc: 'انتقاء المواقع الحيوية في المنطقة الشرقية وتطوير مشاريع تاون هاوس متكاملة تجمع جمالية الواجهات وتكامل الخدمات الحضرية.',
  },
  {
    icon: Compass,
    title: 'الإشراف الهندسي وضبط الجودة',
    desc: 'مراقبة فنية صارمة لمراحل التنفيذ من الأساسات وحتى التشطيب النهائي بما يطابق كود البناء السعودي ويوفر ضمانات ممتدة.',
  },
  {
    icon: Users2,
    title: 'تسهيل التملك والاستشارات العقارية',
    desc: 'تقديم الاستشارات التخصصية لمساعدة الأسر في اختيار النموذج الأنسب، ومتابعة إجراءات التمويل البنكي.',
  },
];

export default function HomeServices({ settings = null }) {
  return (
    <section className="py-20 md:py-28 bg-[#F8F7F4] border-b border-slate-200/80 overflow-hidden" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-bold text-[#0A2E23] shadow-xs">
              <Compass className="w-3.5 h-3.5 text-[#0A2E23]" />
              <span>مجالات الاختصاص والتطوير</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black font-heading text-slate-900 leading-tight">
              خدماتنا في التطوير العقاري
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              نقدم حلولاً متكاملة ترتكز على الخبرة الإنشائية العميقة والشراكات المعتمدة لنلبي تطلعات التملك والاستثمار السكني الواعد.
            </p>
          </div>

          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 hover:border-[#0A2E23] text-[#0A2E23] text-xs font-bold transition duration-300 hover:bg-white self-start md:self-auto shadow-xs whitespace-nowrap shrink-0"
          >
            <span>عرض تفاصيل الخدمات</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        {/* 3 Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {SERVICES.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <div
                key={idx}
                className="group bg-white rounded-3xl border border-slate-200/90 p-8 shadow-xs hover:shadow-xl hover:border-[#0A2E23]/40 transition-all duration-500 hover:-translate-y-1 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#F8F7F4] border border-slate-200 flex items-center justify-center text-[#0A2E23] group-hover:bg-[#0A2E23] group-hover:text-white transition-colors duration-300">
                    <Icon className="w-7 h-7" />
                  </div>

                  <h3 className="text-xl font-bold font-heading text-slate-900 group-hover:text-[#0A2E23] transition-colors">
                    {srv.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {idx === 2 ? (settings?.siteCopy?.homeServicesConsultationDesc?.trim() || srv.desc) : srv.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-[#0A2E23] group-hover:text-emerald-700">
                  <span className="flex items-center gap-1.5">
                    <span>خدمة تطوير معتمدة</span>
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
