import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Building2, Layers, ArrowLeft } from 'lucide-react';

const MODEL_OPTIONS = [
  { val: '', label: 'جميع النماذج المعمارية' },
  { val: 'A', label: 'نموذج A — دوبلكس أرضي بحوش 177 م²' },
  { val: 'B', label: 'نموذج B — دوبلكس علوي بروف 69 م²' },
  { val: 'C', label: 'نموذج C — دوبلكس وسطي بحوش 134 م²' },
  { val: 'D', label: 'نموذج D — دوبلكس زاوية مفتوح' },
  { val: 'E', label: 'نموذج E — دوبلكس علوي واسع' },
  { val: 'F', label: 'نموذج F — دوبلكس عائلي رحب' },
];

export default function HeroQuickBar({ projects = [] }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('explore');
  const [selectedSlug, setSelectedSlug] = useState('shamkha');
  const [selectedModel, setSelectedModel] = useState('');

  const projectList = projects.length > 0
    ? projects
    : [{ slug: 'shamkha', name: 'تاون هاوس الشامخة — الدمام' }];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === 'consult') {
      navigate('/contact');
      return;
    }
    const query = selectedModel ? `?model=${encodeURIComponent(selectedModel)}` : '';
    navigate(`/projects/${selectedSlug || 'shamkha'}${query}`);
  };

  return (
    <div className="-mt-10 relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full" dir="rtl">
      {/* Overlapping Quick Unit Finder Card */}
      <div className="bg-white rounded-2xl shadow-lg shadow-slate-900/5 border border-slate-200/80 p-4 sm:p-5">
        {/* Quick Mode Tabs */}
        <div className="flex items-center gap-2 mb-4">
          <button
            type="button"
            onClick={() => setActiveTab('explore')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'explore'
                ? 'bg-[#0A2E23] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            استكشف الوحدات
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('consult');
              navigate('/contact');
            }}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition inline-flex items-center gap-1.5 ${
              activeTab === 'consult'
                ? 'bg-[#0A2E23] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>اطلب استشارة عقارية</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Dynamic Selectors & Action Bar */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Project Selector */}
          <div className="md:col-span-5 flex items-center gap-3 p-3 rounded-xl bg-[#F8F7F4] border border-slate-200/80">
            <Building2 className="w-4 h-4 text-[#0A2E23] shrink-0" />
            <div className="min-w-0 flex-1">
              <label htmlFor="quick-project" className="text-[10px] text-slate-500 block font-semibold">المشروع السكني</label>
              <select
                id="quick-project"
                value={selectedSlug}
                onChange={(e) => setSelectedSlug(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 outline-none cursor-pointer truncate"
              >
                {projectList.map((p) => (
                  <option key={p.slug || p._id} value={p.slug || 'shamkha'}>
                    {p.name} {p.city ? `— ${p.city}` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Model Selector */}
          <div className="md:col-span-4 flex items-center gap-3 p-3 rounded-xl bg-[#F8F7F4] border border-slate-200/80">
            <Layers className="w-4 h-4 text-[#C8A96A] shrink-0" />
            <div className="min-w-0 flex-1">
              <label htmlFor="quick-model" className="text-[10px] text-slate-500 block font-semibold">النموذج المعماري</label>
              <select
                id="quick-model"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 outline-none cursor-pointer truncate"
              >
                {MODEL_OPTIONS.map((opt) => (
                  <option key={opt.val} value={opt.val}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit Action Button */}
          <div className="md:col-span-3">
            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-[#0A2E23] hover:bg-[#0E3F30] text-white text-xs sm:text-sm font-bold transition shadow-xs flex items-center justify-center gap-2 group cursor-pointer"
            >
              <Search className="w-4 h-4 text-[#C8A96A] transition-transform group-hover:scale-110" />
              <span>استعرض الوحدات</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
