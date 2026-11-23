import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Building2, MapPin, RefreshCw, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import FloatingWhatsApp from '../components/ui/FloatingWhatsApp.jsx';
import { fetchProjects } from '../services/api.js';

const statusTabs = [
  { id: 'all', label: 'كافة المشاريع' },
  { id: 'available', label: 'متاح للحجز' },
  { id: 'under_development', label: 'قيد التطوير' },
  { id: 'completed', label: 'مكتمل' },
];

const statusBadge = {
  available: { label: 'متاح للحجز والإفراغ', cls: 'bg-[#0A2E23] text-[#C8A96A] border-[#C8A96A]/30' },
  under_development: { label: 'قيد الإنشاء', cls: 'bg-amber-900/90 text-amber-200 border-amber-500/30' },
  completed: { label: 'مكتمل بالكامل', cls: 'bg-slate-900/90 text-slate-200 border-white/20' },
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
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

  const filtered = useMemo(() => {
    if (activeFilter === 'all') return projects;
    return projects.filter((p) => p.status === activeFilter);
  }, [projects, activeFilter]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans" dir="rtl">
      <Navbar />

      {/* Page Header */}
      <section className="bg-gradient-to-br from-[#061F17] via-[#0A2E23] to-[#0E3F30] text-white py-16 md:py-24 border-b border-white/10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-[#D6B87A]">
            <Building2 className="w-3.5 h-3.5" />
            <span>سجل الإنجاز والتطوير</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-heading text-white">
            المشاريع السكنية
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
            استكشف مجتمعات تاون هاوس مُيسر للتطوير العقاري بالمنطقة الشرقية، المنفذة وفق أرقى مواصفات كود البناء السعودي مع صكوك ملكية إلكترونية مستقلة.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-8">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
          {statusTabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveFilter(t.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeFilter === t.id
                  ? 'bg-[#0A2E23] text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-[#0A2E23]" />
            <span>جاري تحميل دليل المشاريع...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
            لا توجد مشاريع مسجلة تحت هذا التصنيف حالياً.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filtered.map((proj) => {
              const badge = statusBadge[proj.status] || statusBadge.available;
              return (
                <div
                  key={proj._id || proj.slug}
                  className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-500 hover:-translate-y-1 flex flex-col"
                >
                  <div className="relative aspect-16/10 overflow-hidden bg-slate-950">
                    <img
                      src={proj.heroImageUrl || '/images/shamkha/hero-exterior.webp'}
                      alt={proj.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold border backdrop-blur-md ${badge.cls}`}>
                        {badge.label}
                      </span>
                    </div>
                    {proj.regaLicense && (
                      <div className="absolute bottom-3 right-4 text-[10px] text-slate-300 font-mono">
                        ترخيص: {proj.regaLicense}
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-[#0A2E23]" />
                        <span>{proj.city} {proj.district ? `- ${proj.district}` : ''}</span>
                      </div>
                      <h3 className="text-lg font-bold font-heading text-slate-900 group-hover:text-[#0A2E23] transition-colors">
                        {proj.name}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {proj.tagline || proj.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-[11px] font-medium text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>إفراغ وصك مستقل</span>
                      </div>
                      <Link
                        to={`/projects/${proj.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#0A2E23] group-hover:text-emerald-700 transition"
                      >
                        <span>التفاصيل</span>
                        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
