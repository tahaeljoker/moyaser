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
import PartnersSection from '../components/sections/PartnersSection.jsx';
import FloatingWhatsApp from '../components/ui/FloatingWhatsApp.jsx';
import { fetchProjects, fetchSiteSettings } from '../services/api.js';

export default function HomePage() {
  const [projects, setProjects] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchProjects(), fetchSiteSettings()])
      .then(([projRes, setRes]) => {
        if (projRes?.data && projRes.data.length > 0) {
          setProjects(projRes.data);
        }
        if (setRes?.data) setSettings(setRes.data);
      })
      .catch((err) => {
        console.warn('[HomePage] Data fetch notice:', err.message);
      })
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

      {/* World-Class Success & Engineering Partners Section */}
      <PartnersSection />

      {/* Quick Contact Banner */}
      <section className="py-16 bg-[#0A2E23] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black font-heading">هل تبحث عن مستشارك العقاري الموثوق؟</h2>
          <p className="text-xs sm:text-sm text-stone-200 max-w-xl mx-auto">
            فريقنا الهندسي والتسويقي على أتم الاستعداد لتقديم الاستشارات السكنية لكافة مشاريعنا.
          </p>
          <div className="pt-2">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-[#061F17] font-bold text-xs hover:bg-stone-100 transition shadow-md"
            >
              <span>احجز جلسة استشارية</span>
              <ArrowLeft className="w-4 h-4 text-[#0A2E23]" />
            </Link>
          </div>
        </div>
      </section>

      <Footer settings={settings} />
      <FloatingWhatsApp whatsappNumber={settings?.whatsappNumber} />
    </div>
  );
}
