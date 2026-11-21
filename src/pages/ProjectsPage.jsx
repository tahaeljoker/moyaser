import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Building2, MapPin, RefreshCw } from 'lucide-react';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import FloatingWhatsApp from '../components/ui/FloatingWhatsApp.jsx';
import { fetchProjects } from '../services/api.js';

const statusTabs = [
  { id: 'all', label: 'الكل' },
  { id: 'available', label: 'متاح للحجز' },
  { id: 'under_development', label: 'قيد التطوير' },
  { id: 'completed', label: 'مكتمل' },
  { id: 'upcoming', label: 'قريباً' },
];

const statusBadge = {
  available: { label: 'متاح للحجز', cls: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  under_development: { label: 'قيد التطوير', cls: 'bg-amber-50 text-amber-800 border-amber-200' },
  completed: { label: 'مكتمل', cls: 'bg-blue-50 text-blue-800 border-blue-200' },
  upcoming: { label: 'قريباً', cls: 'bg-slate-100 text-slate-700 border-slate-200' },
};

const defaultShamkhaProject = {
  _id: 'shamkha-default',
  slug: 'shamkha',
  name: 'تاون هاوس الشامخة',
  tagline: '15 وحدة سكنية مستقلة بحي حديقة الأثير بالدمام',
  description: 'مشروع تاون هاوس فاخر يضم 15 وحدة مستقلة بالدمام، بصكوك إلكترونية مستقلة وتصاميم هندسية عصرية تجمع بين الخصوصية وجودة البناء المستدامة.',
  city: 'الدمام',
  district: 'حي حديقة الأثير',
  status: 'available',
  heroImageUrl: '/images/shamkha/hero-exterior.webp',
  regaLicense: '1100259837',
  valLicense: '1200021234',
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
          setProjects([defaultShamkhaProject]);
        }
      })
      .catch(() => {
        setProjects([defaultShamkhaProject]);
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

      <section className="bg-slate-950 text-white py-16 md:py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase">محفظة المشاريع السكنية</span>
          <h1 className="text-3xl sm:text-4xl font-black font-heading text-white">
            مشاريع مُيسر للتطوير العقاري
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
            استكشف مجتمعاتنا السكنية ومشاريع التاون هاوس الحديثة بالمنطقة الشرقية، المنفذة وفق أرقى مواصفات كود البناء السعودي.
          </p>
        </div>
      </section>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
          {statusTabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveFilter(t.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeFilter === t.id
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-20 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-emerald-800" />
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
                  key={proj._id}
                  className="group rounded-3xl bg-white border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-60 overflow-hidden bg-slate-100">
                      <img
                        src={proj.heroImageUrl || '/images/shamkha/hero-exterior.webp'}
                        alt={proj.name}
                        className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[11px] font-bold border backdrop-blur-md ${badge.cls}`}>
                        {badge.label}
                      </span>
                    </div>

                    <div className="p-6 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{proj.city} {proj.district ? `— ${proj.district}` : ''}</span>
                      </div>
                      <h2 className="text-lg font-bold text-slate-900 font-heading">{proj.name}</h2>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {proj.description || proj.tagline}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between">
                    <div className="text-[11px] text-slate-500 font-mono">
                      {proj.regaLicense ? `ترخيص: ${proj.regaLicense}` : 'صكوك مستقلة'}
                    </div>
                    <Link
                      to={`/projects/${proj.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-slate-900 group-hover:text-emerald-800 transition"
                    >
                      <span>عرض المشروع</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </Link>
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
