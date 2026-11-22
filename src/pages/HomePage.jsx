import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import Hero from '../components/sections/Hero.jsx';
import HeroQuickBar from '../components/sections/HeroQuickBar.jsx';
import ProjectsShowcase from '../components/sections/ProjectsShowcase.jsx';
import ArchitecturalVision from '../components/sections/ArchitecturalVision.jsx';
import InteractiveMasterplan from '../components/sections/InteractiveMasterplan.jsx';
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
  regaLicense: '1200028491',
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
      <HeroQuickBar projects={projects} />

      {/* Flagship Projects Showcase */}
      <ProjectsShowcase projects={projects} loading={loading} />

      {/* Modern Interactive Architectural Vision */}
      <ArchitecturalVision />

      {/* Interactive Masterplan Hotspots */}
      <InteractiveMasterplan />

      {/* Partners Strip */}
      <section className="py-14 bg-white border-b border-slate-200/80 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <div className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest">شركاء النجاح والجودة</div>
        </div>
        <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="animate-marquee flex gap-6 items-center">
            {[...partners, ...partners, ...partners].map((p, i) => (
              <div key={i} className="px-6 py-4 rounded-2xl bg-[#F8F7F4] border border-slate-200/80 text-center shrink-0 min-w-[220px] transition-colors duration-200 hover:border-emerald-800/40 hover:bg-white">
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
