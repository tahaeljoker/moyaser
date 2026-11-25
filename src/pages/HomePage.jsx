import { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import Hero from '../components/sections/Hero.jsx';
import FeaturedShamkha from '../components/sections/FeaturedShamkha.jsx';
import HomeProjects from '../components/sections/HomeProjects.jsx';
import WhyUs from '../components/sections/WhyUs.jsx';
import HomeServices from '../components/sections/HomeServices.jsx';
import HomeContactCta from '../components/sections/HomeContactCta.jsx';
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

      {/* 1. Hero with large property visual primacy */}
      <Hero settings={settings} />

      {/* 2. Featured Flagship Project: Shamkha Townhouse */}
      <FeaturedShamkha />

      {/* 3. Projects from Data */}
      <HomeProjects projects={projects} loading={loading} />

      {/* 4. Short Why Us (Core Architectural Pillars) */}
      <WhyUs settings={settings} />

      {/* 5. Short Services (Developer Capabilities) */}
      <HomeServices settings={settings} />

      {/* 6. Contact Call to Action */}
      <HomeContactCta settings={settings} />

      <Footer settings={settings} />
      <FloatingWhatsApp whatsappNumber={settings?.whatsappNumber} />
    </div>
  );
}
