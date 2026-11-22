import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, ArrowLeft, RefreshCw, CheckCircle2, ShieldCheck } from 'lucide-react';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import FloatingWhatsApp from '../components/ui/FloatingWhatsApp.jsx';
import BookingForm from '../components/sections/BookingForm.jsx';
import { fetchProject, fetchModels, fetchUnits } from '../services/api.js';
import { models as staticModels } from '../data/modelsData.js';
import { units as staticUnits } from '../data/unitsData.js';

const fallbackShamkhaProject = {
  _id: 'shamkha-authentic', slug: 'shamkha', name: 'تاون هاوس الشامخة',
  tagline: 'مجتمع سكني فاخر بتصاميم عصرية وضمانات شاملة',
  description: 'مشروع تاون هاوس الشامخة بالدمام يجمع بين الخصوصية التامة والاستقلالية المعمارية في موقع استراتيجي مطل على حديقة الأثير العامة.',
  city: 'الدمام', district: 'حي حديقة الأثير', status: 'available',
  heroImageUrl: '/images/shamkha/hero-exterior.webp', masterplanUrl: '/images/shamkha/masterplan.webp',
  contactPhone: '0500550223', whatsappNumber: '966500550223', mapUrl: 'https://maps.google.com/?q=Dammam+Al+Atheer+Park',
  regaLicense: '1200028491', valLicense: '1100248950',
  specs: ['صك إلكتروني مستقل لكل وحدة سكنية', 'عدادات مياه وكهرباء مستقلة', 'كراج سيارة خاص ومدخل مستقل', 'تأسيس مصعد بجميع النماذج العلوية', 'عزل حراري ومائي معتمد'],
  guarantees: [
    { title: 'الهيكل الإنشائي', duration: '10 سنوات', details: 'تأمين العيوب الخفية' }, { title: 'التمديدات الكهربائية', duration: '25 سنة', details: 'ضمان الفنار' },
    { title: 'التمديدات الصحية', duration: '15 سنة', details: 'ضمان معتمد' }, { title: 'العزل المائي والحراري', duration: '10 سنوات', details: 'ضمان عزل الأسطح' },
  ],
  afterSales: ['صيانة السنة الأولى', 'تسليم كتيب الإرشادات', 'توثيق شهادات الضمان'],
  visibleSections: { models: true, unitMatrix: true, gallery: true, location: true, specs: true, guarantees: true, afterSales: true },
  isActive: true,
};

const fallbackFormattedModels = staticModels.map((m) => ({
  _id: `model-${m.code}`, code: m.code, name: m.name, area: m.area, floors: m.floors, bedrooms: m.rooms || 3, bathrooms: m.baths || 4, startingPrice: 0, description: m.subtitle || m.description || '', floorPlanImageUrl: m.mediaViews?.floorplan?.local || m.image, renderImageUrl: m.image,
}));

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [models, setModels] = useState([]);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeModel, setActiveModel] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [activeTab, setActiveTab] = useState('specs');

  useEffect(() => {
    setLoading(true);
    const isShamkha = !slug || slug === 'shamkha';
    Promise.allSettled([fetchProject(slug), fetchModels({ slug }), fetchUnits({ slug })])
      .then(([projRes, modelsRes, unitsRes]) => {
        const projData = projRes.status === 'fulfilled' ? projRes.value?.data : null;
        const modelsData = modelsRes.status === 'fulfilled' ? modelsRes.value?.data : null;
        const unitsData = unitsRes.status === 'fulfilled' ? unitsRes.value?.data : null;
        if (projData) setProject(projData);
        else if (isShamkha) setProject(fallbackShamkhaProject);
        const effModels = (modelsData && modelsData.length > 0) ? modelsData : (isShamkha ? fallbackFormattedModels : []);
        setModels(effModels);
        if (effModels.length > 0) setActiveModel(effModels[0]);
        const effUnits = (unitsData && unitsData.length > 0) ? unitsData : (isShamkha ? staticUnits : []);
        setUnits(effUnits);
      })
      .catch(() => {
        if (isShamkha) {
          setProject(fallbackShamkhaProject);
          setModels(fallbackFormattedModels);
          setActiveModel(fallbackFormattedModels[0]);
          setUnits(staticUnits);
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-500 gap-2" dir="rtl">
        <RefreshCw className="w-5 h-5 text-[#0A2E23] animate-spin" /><span>جاري تحميل بيانات المشروع...</span>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between" dir="rtl">
        <Navbar />
        <div className="max-w-md mx-auto text-center py-24 space-y-4 px-4">
          <h1 className="text-xl font-bold text-slate-900 font-heading">المشروع غير موجود</h1>
          <p className="text-xs text-slate-500">تأكد من صحة الرابط أو تصفح المشاريع المتاحة.</p>
          <Link to="/projects" className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0A2E23] text-white text-xs font-bold rounded-xl">
            <span>العودة للمشاريع</span><ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const vs = project.visibleSections || {};

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans" dir="rtl">
      <Navbar />
      <section className="relative bg-slate-950 text-white py-16 md:py-24 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 z-0 opacity-40">
          <img src={project.heroImageUrl || '/images/shamkha/hero-exterior.webp'} alt={project.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs text-emerald-300 border border-white/15">
            <MapPin className="w-3.5 h-3.5" /><span>{project.city} {project.district ? `- ${project.district}` : ''}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-heading text-white">{project.name}</h1>
          <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">{project.description || project.tagline}</p>
          <div className="flex flex-wrap items-center gap-4 pt-3 text-xs">
            {project.regaLicense && <span className="font-mono bg-white/10 px-3 py-1 rounded-lg border border-white/15 tabular-nums">REGA #{project.regaLicense}</span>}
            {project.valLicense && <span className="font-mono bg-white/10 px-3 py-1 rounded-lg border border-white/15 tabular-nums">VAL #{project.valLicense}</span>}
            <a href="#booking" className="px-5 py-2.5 bg-[#0A2E23] hover:bg-[#0E3F30] text-white rounded-xl font-bold transition">احجز استشارة المشروع</a>
          </div>
        </div>
      </section>

      {vs.models !== false && models.length > 0 && (
        <section className="py-16 md:py-20 bg-white border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">التصاميم الهندسية</span>
              <h2 className="text-2xl font-black font-heading text-slate-900 mt-1">النماذج والمخططات المعمارية</h2>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-100">
              {models.map((m) => (
                <button key={m._id || m.code} onClick={() => setActiveModel(m)} className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${activeModel?.code === m.code ? 'bg-[#0A2E23] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                  نموذج {m.code}: {m.name}
                </button>
              ))}
            </div>
            {activeModel && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-stone-50/60 p-6 sm:p-8 rounded-3xl border border-slate-200/80">
                <div className="lg:col-span-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold font-heading text-slate-900">نموذج {activeModel.code} - {activeModel.name}</h3>
                    <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 tabular-nums">
                      {Number(activeModel.startingPrice) > 0 ? `${Number(activeModel.startingPrice).toLocaleString('en-US')} ر.س` : 'تواصل لمعرفة السعر'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{activeModel.description}</p>
                  <div className="grid grid-cols-2 gap-3 text-xs pt-2">
                    {[['المساحة', activeModel.area], ['الأدوار', activeModel.floors], ['غرف النوم', `${activeModel.bedrooms} أجنحة`], ['دورات المياه', activeModel.bathrooms]].map(([lbl, val], idx) => (
                      <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200">
                        <span className="text-slate-400 block text-[10px]">{lbl}</span><span className="font-bold tabular-nums">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="lg:col-span-6 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                  <img src={activeModel.floorPlanImageUrl || activeModel.renderImageUrl || '/images/shamkha/masterplan.webp'} alt={activeModel.name} className="w-full h-80 object-contain p-4" />
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {vs.unitMatrix !== false && units.length > 0 && (
        <section className="py-16 md:py-20 bg-[#F8F7F4] border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">مصفوفة الوحدات السكنية</span>
              <h2 className="text-2xl font-black font-heading text-slate-900 mt-1">الوحدات وحالة التوفر ({units.length} وحدة)</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {units.map((u) => {
                const isSelected = selectedUnit?.unitCode === u.unitCode;
                const priceLabel = Number(u.price) > 0 ? `${Number(u.price).toLocaleString('en-US')} ر.س` : 'تواصل لمعرفة السعر';
                return (
                  <div key={u.unitCode} onClick={() => setSelectedUnit(u)} className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${isSelected ? 'bg-[#0A2E23] text-white border-emerald-950 shadow-md' : 'bg-white border-slate-200/80 text-slate-900 hover:border-slate-400'}`}>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono font-bold text-xs tabular-nums">{u.unitCode}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${u.status === 'available' ? 'bg-emerald-100 text-emerald-900' : 'bg-slate-200 text-slate-700'}`}>{u.status === 'available' ? 'متاح' : u.status === 'reserved' ? 'محجوز' : 'مباع'}</span>
                      </div>
                      <span className={`text-[11px] block ${isSelected ? 'text-stone-300' : 'text-slate-500'}`}>نموذج {u.model}</span>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-100/30 text-[11px] font-bold tabular-nums">{priceLabel}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex gap-2 border-b border-slate-200 pb-2">
            {[['specs', 'المواصفات الفنية'], ['guarantees', 'الضمانات المعتمدة'], ['afterSales', 'خدمات ما بعد البيع']].map(([k, lbl]) => (
              <button key={k} onClick={() => setActiveTab(k)} className={`px-4 py-2 rounded-xl text-xs font-bold transition ${activeTab === k ? 'bg-[#0A2E23] text-white' : 'bg-slate-50 text-slate-600 hover:text-slate-900'}`}>
                {lbl}
              </button>
            ))}
          </div>
          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              {(project.specs?.length ? project.specs : ['صك إلكتروني مستقل', 'عوازل معتمدة', 'كراج خاص']).map((s, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#0A2E23] shrink-0" /><span>{s}</span></div>
              ))}
            </div>
          )}
          {activeTab === 'guarantees' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              {(project.guarantees || []).map((g, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-900 font-heading block">{g.title}</span><span className="text-[#0A2E23] font-bold block">{g.duration}</span><span className="text-slate-500 text-[11px] block">{g.details}</span>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'afterSales' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              {(project.afterSales || []).map((a, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#0A2E23] shrink-0" /><span>{a}</span></div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="booking" className="py-16 bg-[#F8F7F4]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-2 mb-8">
            <h2 className="text-2xl font-black font-heading text-slate-900">حجز معاينة في {project.name}</h2>
            <p className="text-xs text-slate-600">سجل اهتمامك وسيتم التواصل معك من قبل مستشار المبيعات المسؤول.</p>
          </div>
          <BookingForm projectId={project._id} projectName={project.name} selectedUnitCode={selectedUnit?.unitCode} onShowToast={() => {}} />
        </div>
      </section>

      <Footer />
      <FloatingWhatsApp whatsappNumber={project.whatsappNumber} projectName={project.name} />
    </div>
  );
}
