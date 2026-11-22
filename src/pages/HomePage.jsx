import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import Hero from '../components/sections/Hero.jsx';
import ArchitecturalVision from '../components/sections/ArchitecturalVision.jsx';
import FloatingWhatsApp from '../components/ui/FloatingWhatsApp.jsx';
import { fetchProjects, fetchSiteSettings } from '../services/api.js';

const partners = [
  { name: 'JOTUN', role: 'الدهانات المعتمدة' },
  { name: 'أطلال الخليجية', role: 'التوريدات الإنشائية' },
  { name: 'Elite Touch Design', role: 'التصاميم المعمارية الداخلية' },
  { name: 'حلول الدرع الآمن', role: 'العزل المائي والحراري' },
];

const defaultShamkhaProject = {
  _id: 'shamkha-default', slug: 'shamkha', name: 'تاون هاوس الشامخة',
  tagline: '15 وحدة سكنية مستقلة بحي حديقة الأثير بالدمام',
  description: 'مشروع تاون هاوس فاخر يضم 15 وحدة مستقلة بالدمام، بصكوك إلكترونية مستقلة وتصاميم هندسية عصرية تجمع بين الخصوصية وجودة البناء المستدامة.',
  city: 'الدمام', district: 'حي حديقة الأثير', status: 'available', heroImageUrl: '/images/shamkha/hero-exterior.webp',
};

export default function HomePage() {
  const [projects, setProjects] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchProjects(), fetchSiteSettings()])
      .then(([projRes, setRes]) => {
        setProjects(projRes?.data && projRes.data.length > 0 ? projRes.data : [defaultShamkhaProject]);
        if (setRes?.data) setSettings(setRes.data);
      })
      .catch(() => setProjects([defaultShamkhaProject]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans" dir="rtl">
      <Navbar />
      <Hero settings={settings} />

      {/* Modern Interactive Architectural Vision */}
      <ArchitecturalVision />

      {/* Dynamic Projects Showcase */}
      <section className="py-20 md:py-28 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-bold text-emerald-800 tracking-wider uppercase">سجل الإنجاز</span>
              <h2 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 mt-1">مشاريعنا السكنية</h2>
            </div>
            <Link to="/projects" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0A2E23] hover:text-[#0E3F30]">
              <span>عرض كافة المشاريع</span><ArrowLeft className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="py-16 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-[#0A2E23]" /><span>جاري تحميل المشاريع...</span>
            </div>
          ) : projects.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">لا توجد مشاريع منشورة حالياً.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {projects.map((proj) => (
                <div key={proj._id} className="group rounded-3xl bg-[#F8F7F4] border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition duration-300 flex flex-col justify-between">
                  <div>
                    <div className="relative h-60 overflow-hidden bg-slate-100">
                      <img src={proj.heroImageUrl || '/images/shamkha/hero-exterior.webp'} alt={proj.name} className="w-full h-full object-cover transition duration-500 group-hover:scale-105" />
                      <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-[11px] font-bold bg-slate-900/80 text-white backdrop-blur-xs">
                        {proj.city} {proj.district ? `- ${proj.district}` : ''}
                      </span>
                    </div>
                    <div className="p-6 space-y-2">
                      <h3 className="text-lg font-bold text-slate-900 font-heading">{proj.name}</h3>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{proj.description || proj.tagline}</p>
                    </div>
                  </div>
                  <div className="p-6 pt-0 border-t border-slate-200/60 mt-4 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-800 font-mono">صكوك مستقلة</span>
                    <Link to={`/projects/${proj.slug}`} className="inline-flex items-center gap-1 text-xs font-bold text-slate-900 group-hover:text-[#0A2E23] transition">
                      <span>تفاصيل المشروع</span><ArrowLeft className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Partners Strip */}
      <section className="py-14 bg-[#F8F7F4] border-b border-slate-200/80 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <div className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest">شركاء النجاح والجودة</div>
        </div>
        <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="animate-marquee flex gap-6 items-center">
            {[...partners, ...partners, ...partners].map((p, i) => (
              <div key={i} className="px-6 py-4 rounded-2xl bg-white border border-slate-200/80 text-center shrink-0 min-w-[220px] transition-colors duration-200 hover:border-emerald-800/40">
                <span className="text-xs font-bold text-slate-900 font-heading block">{p.name}</span>
                <span className="text-[11px] text-slate-500 mt-1 block">{p.role}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Contact Banner */}
      <section className="py-16 bg-[#0A2E23] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black font-heading">هل تبحث عن مستشارك العقاري الموثوق؟</h2>
          <p className="text-xs sm:text-sm text-stone-200 max-w-xl mx-auto">
            فريقنا الهندسي والتسويقي على أتم الاستعداد لتقديم الاستشارات السكنية لكافة مشاريعنا.
          </p>
          <div className="pt-2">
            <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-[#061F17] font-bold text-xs hover:bg-stone-100 transition shadow-md">
              <span>احجز جلسة استشارية</span><ArrowLeft className="w-4 h-4 text-[#0A2E23]" />
            </Link>
          </div>
        </div>
      </section>

      <Footer settings={settings} />
      <FloatingWhatsApp whatsappNumber={settings?.whatsappNumber} />
    </div>
  );
}
