import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Building2, MapPin, RefreshCw } from 'lucide-react';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import Hero from '../components/sections/Hero.jsx';
import FloatingWhatsApp from '../components/ui/FloatingWhatsApp.jsx';
import { fetchProjects, fetchSiteSettings } from '../services/api.js';

const partners = [
  { name: 'JOTUN', role: 'الدهانات المعتمدة' },
  { name: 'أطلال الخليجية', role: 'التوريدات الإنشائية' },
  { name: 'Elite Touch Design', role: 'التصاميم المعمارية الداخلية' },
  { name: 'حلول الدرع الآمن', role: 'العزل المائي والحراري' },
];

const services = [
  { num: '01', title: 'التطوير العقاري السكني', desc: 'ابتكار مجتمعات تاون هاوس حديثة باستقلالية كاملة وصكوك ملكية إلكترونية فورية.' },
  { num: '02', title: 'التصميم المعماري الداخلي', desc: 'توزيع هندسي ذكي للمساحات يدمج بين الخصوصية العائلية والإنارة الطبيعية.' },
  { num: '03', title: 'المطابخ والتشطيبات الفاخرة', desc: 'تنفيذ خامات عالية الجودة تضمن الاستدامة وكفاءة التشغيل على المدى الطويل.' },
  { num: '04', title: 'أنظمة المنازل الذكية', desc: 'تأسيس بنية تحتية رقمية متطورة لأنظمة الأمان والتحكم الذكي بالإضاءة والتكييف.' },
];

export default function HomePage() {
  const [projects, setProjects] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchProjects(), fetchSiteSettings()])
      .then(([projRes, setRes]) => {
        if (projRes?.data) setProjects(projRes.data);
        if (setRes?.data) setSettings(setRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans" dir="rtl">
      <Navbar />
      <Hero settings={settings} />

      {/* Corporate Overview & Quality Pillars */}
      <section className="py-20 md:py-28 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-14">
            <span className="text-xs font-bold text-emerald-800 tracking-wider uppercase">رؤيتنا المعمارية</span>
            <h2 className="text-2xl sm:text-4xl font-black font-heading text-slate-900 leading-tight">
              أصالة التطوير وجودة التنفيذ في مشاريع ميسر
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              نلتزم بأعلى المعايير الهندسية والإنشائية المعتمدة في المملكة لنمنح عملاءنا منازل تجمع بين الاستقلالية والجمالية والقيمة العقارية المتصاعدة.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.map((s, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#F8F7F4] border border-slate-200/80 hover:border-emerald-800/40 hover:bg-white hover:shadow-xs transition duration-300 flex flex-col justify-between min-h-[190px]"
              >
                <div className="space-y-3">
                  <span className="w-8 h-8 rounded-lg bg-white border border-slate-200/90 text-emerald-900 font-mono font-bold text-xs flex items-center justify-center">
                    {s.num}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 font-heading leading-snug">{s.title}</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pt-2">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic Projects Showcase */}
      <section className="py-20 md:py-28 bg-[#F8F7F4] border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-bold text-emerald-800 tracking-wider uppercase">سجل الإنجاز</span>
              <h2 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 mt-1">مشاريعنا السكنية</h2>
            </div>
            <Link to="/projects" className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-900">
              <span>عرض كافة المشاريع</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="py-16 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-emerald-800" />
              <span>جاري تحميل المشاريع...</span>
            </div>
          ) : projects.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
              لا توجد مشاريع منشورة حالياً.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {projects.map((proj) => (
                <div key={proj._id} className="group rounded-3xl bg-white border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition duration-300 flex flex-col justify-between">
                  <div>
                    <div className="relative h-60 overflow-hidden bg-slate-100">
                      <img
                        src={proj.heroImageUrl || '/images/shamkha/hero-exterior.webp'}
                        alt={proj.name}
                        className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-[11px] font-bold bg-slate-900/80 text-white backdrop-blur-xs">
                        {proj.city} {proj.district ? `- ${proj.district}` : ''}
                      </span>
                    </div>
                    <div className="p-6 space-y-2">
                      <h3 className="text-lg font-bold text-slate-900 font-heading">{proj.name}</h3>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{proj.description || proj.tagline}</p>
                    </div>
                  </div>
                  <div className="p-6 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-800 font-mono">صكوك مستقلة</span>
                    <Link
                      to={`/projects/${proj.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-slate-900 group-hover:text-emerald-800 transition"
                    >
                      <span>تفاصيل المشروع</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Partners Strip with Infinite Marquee */}
      <section className="py-14 bg-white border-b border-slate-200/80 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <div className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
            شركاء النجاح والجودة
          </div>
        </div>
        <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="animate-marquee flex gap-6 items-center">
            {[...partners, ...partners, ...partners].map((p, i) => (
              <div
                key={i}
                className="px-6 py-3.5 rounded-2xl bg-[#F8F7F4] border border-slate-200/80 text-center shrink-0 min-w-[210px] transition hover:border-emerald-800/40"
              >
                <span className="text-xs font-bold text-slate-900 font-heading block">{p.name}</span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">{p.role}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Quick Banner */}
      <section className="py-16 bg-emerald-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black font-heading">هل تبحث عن مستشارك العقاري الموثوق؟</h2>
          <p className="text-xs sm:text-sm text-stone-200 max-w-xl mx-auto">
            فريقنا الهندسي والتسويقي على أتم الاستعداد لتقديم الاستشارات السكنية والتمويلية لجميع مشاريعنا.
          </p>
          <div className="pt-2">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-emerald-950 font-bold text-xs hover:bg-stone-100 transition shadow-md"
            >
              <span>احجز جلسة استشارية</span>
              <ArrowLeft className="w-4 h-4 text-emerald-900" />
            </Link>
          </div>
        </div>
      </section>

      <Footer settings={settings} />
      <FloatingWhatsApp whatsappNumber={settings?.whatsappNumber} />
    </div>
  );
}
