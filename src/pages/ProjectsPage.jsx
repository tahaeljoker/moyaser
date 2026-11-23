import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, ArrowLeft, ShieldCheck, Compass, Sparkles } from 'lucide-react';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import FloatingWhatsApp from '../components/ui/FloatingWhatsApp.jsx';
import ProjectsHeader from '../components/projects/ProjectsHeader.jsx';
import ProjectsFilterBar from '../components/projects/ProjectsFilterBar.jsx';
import ProjectCard from '../components/projects/ProjectCard.jsx';
import { fetchProjects } from '../services/api.js';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [activeStatus, setActiveStatus] = useState('all');
  const [activeCity, setActiveCity] = useState('all');
  const [viewMode, setViewMode] = useState('editorial');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects()
      .then((res) => {
        if (res?.data && res.data.length > 0) {
          setProjects(res.data);
        } else {
          setProjects([]);
        }
      })
      .catch((err) => {
        console.warn('[ProjectsPage] Fetch warning:', err.message);
        setProjects([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const cities = useMemo(() => {
    const list = projects.map((p) => p.city?.trim()).filter(Boolean);
    return Array.from(new Set(list));
  }, [projects]);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchStatus = activeStatus === 'all' || p.status === activeStatus;
      const matchCity = activeCity === 'all' || p.city?.trim() === activeCity;
      return matchStatus && matchCity;
    });
  }, [projects, activeStatus, activeCity]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans" dir="rtl">
      <Navbar />

      {/* Modern Editorial Architectural Header */}
      <ProjectsHeader projectCount={projects.length || 4} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full space-y-8">
        {/* Dynamic Architectural Filter Bar */}
        <ProjectsFilterBar
          activeStatus={activeStatus}
          onStatusChange={setActiveStatus}
          activeCity={activeCity}
          onCityChange={setActiveCity}
          cities={cities}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          resultCount={filtered.length}
        />

        {/* Content Presentation */}
        {loading ? (
          <div className="py-24 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-[#0A2E23]" />
            <span className="font-medium">جاري تحميل سجل المشاريع العقارية...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center space-y-3 bg-white rounded-3xl border border-slate-200/90 shadow-xs">
            <Compass className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold font-heading text-slate-900">لا توجد مشاريع مسجلة وفق هذا الفرز</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              يمكنك إعادة ضبط خيارات التصفية أو التواصل المباشر مع مستشارنا العقاري للاستفسار عن المشاريع المستقبلية.
            </p>
            <button
              onClick={() => {
                setActiveStatus('all');
                setActiveCity('all');
              }}
              className="mt-2 px-4 py-2 rounded-xl bg-[#F8F7F4] border border-slate-200 text-xs font-bold text-[#0A2E23] hover:bg-[#0A2E23] hover:text-white transition"
            >
              إعادة تعيين الفرز
            </button>
          </div>
        ) : viewMode === 'editorial' ? (
          <div className="space-y-8">
            {filtered.map((project) => (
              <ProjectCard key={project._id || project.slug} project={project} viewMode="editorial" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filtered.map((project) => (
              <ProjectCard key={project._id || project.slug} project={project} viewMode="grid" />
            ))}
          </div>
        )}

        {/* Tailored Real Estate Consultation Banner */}
        <section className="mt-16 rounded-3xl bg-gradient-to-br from-[#061F17] to-[#0A2E23] text-white p-8 sm:p-12 border border-[#0A2E23]/60 shadow-lg relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-xl space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#D6B87A]">
                <ShieldCheck className="w-4 h-4 text-[#D6B87A]" />
                <span>استشارات التملك والاستثمار العقاري</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black font-heading leading-tight">
                هل تبحث عن وحدة بمواصفات معمارية خاصة؟
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                مستشارونا الهندسيون متواجدون لمساعدتك في اختيار النموذج الملائم لأسرتك وتوضيح تفاصيل الصكوك المستقلة وتسهيلات التمويل البنكي.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                to="/contact"
                className="px-6 py-3 rounded-xl bg-white text-[#061F17] text-xs font-bold hover:bg-stone-100 transition shadow-xs flex items-center gap-2"
              >
                <span>طلب استشارة عقارية</span>
                <ArrowLeft className="w-4 h-4 text-[#0A2E23]" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
