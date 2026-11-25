import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Compass, Layers, Cpu, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import FloatingWhatsApp from '../components/ui/FloatingWhatsApp.jsx';
import { fetchSiteSettings } from '../services/api.js';

const servicesList = [
  {
    icon: Building2,
    num: '01',
    title: 'التطوير العقاري السكني الشامل',
    desc: 'تخطيط وتنفيذ مجتمعات تاون هاوس حديثة بمعايير هندسية متقدمة تضمن الاستقلالية التامة للوحدة والمدخل والكراج.',
    features: ['إشراف هندسي معتمد في جميع مراحل البناء', 'مطابقة شاملة لكود البناء السعودي الصارم'],
  },
  {
    icon: Compass,
    num: '02',
    title: 'التصميم المعماري الداخلي واستغلال الفراغات',
    desc: 'دراسات هندسية دقيقة لتوزيع المساحات تحقق أقصى درجات الراحة والخصوصية للعائلة، مع توظيف الأفنية السماوية (Sky Light) لتحقيق وفرة في الإنارة الطبيعية وتقليل استهلاك الطاقة.',
    features: ['مخططات وظيفية مدروسة للحياة اليومية', 'توزيع متوازن بين أجنحة النوم ومساحات الاستقبال', 'واجهات عصرية متناسقة مع الهوية العمرانية'],
  },
  {
    icon: Layers,
    num: '03',
    title: 'المطابخ والتشطيبات الفاخرة المعتمدة',
    desc: 'توريد وتركيب مواد تشطيب عالية الجودة بشراكة مع كبرى العلامات المعتمدة، لضمان استدامة التمديدات والدهانات والعوازل مع شهادات ضمان موثقة وممتدة.',
    features: ['دهانات جوتن المعتمدة عالمياً ومحلياً', 'قواطع وتمديدات كهربائية من الفنار بضمان 25 سنة', 'عوازل مائية وحرارية معتمدة من شركة الكهرباء'],
  },
  {
    icon: Cpu,
    num: '04',
    title: 'تأسيس البنية الذكية وحلول الأتمتة',
    desc: 'تجهيز الوحدات بالبنية التحتية اللازمة لدعم حلول المنازل الذكية، بما في ذلك أقفال الأبواب الإلكترونية، وأجهزة التحكم بالإضاءة والتكييف، وتأسيس شبكات الألياف البصرية.',
    features: ['تأسيس مسبق لتمديدات المصاعد في النماذج العلوية', 'نقاط تحكم ذكية للأمان ومراقبة المداخل', 'بنية اتصالات متطورة لتغطية كامل أرجاء المسكن'],
  },
];

export default function ServicesPage() {
  const [settings, setSettings] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    fetchSiteSettings().then((r) => r?.data && setSettings(r.data)).catch(() => {});
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="min-h-screen bg-[#ece6d6] text-[#0a2e23] flex flex-col font-sans" dir="rtl">
      <Navbar />

      {/* 1. Hero */}
      <section
        className="relative text-white pt-16 pb-20 sm:pt-20 sm:pb-24 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0b3a2c 0%, #06261c 100%)' }}
      >
        <div
          className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none motion-reduce:transform-none motion-reduce:opacity-100 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-[#c9ab68]/40 text-xs font-bold text-[#c9ab68] backdrop-blur-md">
              <Compass className="w-3.5 h-3.5 text-[#c9ab68]" />
              <span>مجالات اختصاصنا</span>
            </div>

            <h1
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black font-heading text-white pb-1.5"
              style={{ lineHeight: 1.7 }}
            >
              خدمات عقارية متكاملة تبدأ من الفكرة حتى السكن
            </h1>

            <p className="text-xs sm:text-sm text-stone-200/90 max-w-2xl leading-relaxed">
              نقدم منظومة تطويرية متكاملة تضمن أعلى درجات الموثوقية الهندسية والقيمة الاستثمارية المستدامة لعملائنا في المنطقة الشرقية.
            </p>
          </div>
        </div>
      </section>

      <main className="flex-1 py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 w-full">
        {/* 2. Services Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[28px]">
          {servicesList.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <div
                key={idx}
                className="p-7 sm:p-8 rounded-[14px] bg-[#fbf9f3] border border-[#e3dbc6] shadow-[0_12px_32px_-12px_rgba(6,38,28,0.14)] hover:shadow-[0_20px_44px_-12px_rgba(6,38,28,0.2)] hover:-translate-y-1 transition-all duration-300 motion-reduce:transition-none motion-reduce:transform-none flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-[#0b3a2c] text-[#c9ab68] border border-[#c9ab68]/30 flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="font-mono text-xs font-bold text-[#0a2e23] bg-[#ece6d6] px-3 py-1 rounded-full border border-[#c9bd9c] tabular-nums">
                      {srv.num}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-[#0a2e23] font-heading" style={{ lineHeight: 1.7 }}>
                    {srv.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {idx === 0 ? (settings?.siteCopy?.servicesPageDevDesc?.trim() || srv.desc) : srv.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#e3dbc6] space-y-2.5 text-xs text-slate-700">
                  {srv.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#0a2e23] shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* 3. Consultation CTA */}
        <section
          className="rounded-[14px] text-white p-8 pb-24 sm:p-12 sm:pb-24 md:pb-12 border border-[#c9ab68]/25 shadow-[0_20px_50px_-15px_rgba(6,38,28,0.25)] flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-right"
          style={{ background: 'linear-gradient(135deg, #0b3a2c 0%, #06261c 100%)' }}
        >
          <div className="space-y-2">
            <h3 className="text-lg md:text-2xl font-black font-heading" style={{ lineHeight: 1.7 }}>
              ترغب في استشارة هندسية أو استفسار عن خدماتنا؟
            </h3>
            <p className="text-xs sm:text-sm text-stone-200/90">
              فريقنا متاح لتزويدك بكافة المخططات وجداول الكميات المعتمدة.
            </p>
          </div>
          <Link
            to="/contact"
            className="px-6 py-3 rounded-[8px] bg-[#c9ab68] hover:bg-[#d5b978] text-[#06261c] text-xs font-bold transition-all duration-300 hover:-translate-y-0.5 motion-reduce:transform-none inline-flex items-center gap-2 whitespace-nowrap shadow-xs shrink-0"
          >
            <span>تواصل مع الفريق الهندسي</span>
            <ArrowLeft className="w-4 h-4 text-[#06261c]" />
          </Link>
        </section>
      </main>

      <Footer settings={settings} />
      <FloatingWhatsApp />
    </div>
  );
}
