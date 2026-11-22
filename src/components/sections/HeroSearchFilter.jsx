import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Building2, Maximize2, CheckCircle2, ShieldCheck, Award } from 'lucide-react';

const TABS = [
  { id: 'all', label: 'كافة الوحدات المتاحة' },
  { id: 'ground', label: 'نماذج أرضية بحوش خاص' },
  { id: 'upper', label: 'دوبلكس علوي مع روف' },
  { id: 'projects', label: 'مشاريع الشامخة' },
];

const MODELS = [
  { code: 'ALL', name: 'جميع النماذج المعمارية (A–F)' },
  { code: 'A', name: 'نموذج A — دوبلكس أرضي بحوش 177 م²' },
  { code: 'B', name: 'نموذج B — دوبلكس علوي بروف 69 م²' },
  { code: 'C', name: 'نموذج C — دوبلكس وسطي بحوش 134 م²' },
  { code: 'D', name: 'نموذج D — دوبلكس زاوية مفتوح' },
  { code: 'E', name: 'نموذج E — دوبلكس علوي واسع' },
  { code: 'F', name: 'نموذج F — دوبلكس عائلي رحب' },
];

const QUICK_TAGS = [
  'تاون هاوس الشامخة',
  'حي حديقة الأثير بالدمام',
  'صكوك إلكترونية مستقلة',
  'كود البناء السعودي',
  'تأسيس مصاعد راكبة',
];

export default function HeroSearchFilter() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedModel, setSelectedModel] = useState('ALL');
  const [selectedArea, setSelectedArea] = useState('all');

  const handleSearch = (e) => {
    e.preventDefault();
    const targetElement = document.getElementById('models-showcase-section') || document.querySelector('section[dir="rtl"]');
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/projects/shamkha');
    }
  };

  return (
    <div className="w-full pt-10 sm:pt-14" dir="rtl">
      {/* Elevated Architectural Discovery Card */}
      <div className="relative rounded-3xl bg-white/95 backdrop-blur-xl border border-white/40 shadow-2xl p-4 sm:p-6 text-slate-900 overflow-hidden">
        {/* Ambient Top Glow Line */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-600 via-[#C8A96A] to-emerald-800" />

        {/* Category Tabs */}
        <div className="flex items-center gap-2 pb-4 overflow-x-auto no-scrollbar border-b border-slate-200/80">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#0A2E23] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Input Fields Filter Bar */}
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 pt-4 items-center">
          {/* Location / District */}
          <div className="lg:col-span-4 p-3 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-[#0A2E23] shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-slate-400 block font-semibold">المدينة والحي</span>
              <span className="text-xs sm:text-sm font-bold text-slate-900 truncate block">الدمام — حي حديقة الأثير</span>
            </div>
          </div>

          {/* Architectural Model Selection */}
          <div className="lg:col-span-4 p-3 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-800 shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <label htmlFor="model-select" className="text-[10px] text-slate-400 block font-semibold">نوع النموذج المعماري</label>
              <select
                id="model-select"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 outline-none cursor-pointer truncate"
              >
                {MODELS.map((m) => (
                  <option key={m.code} value={m.code}>{m.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Area Specification */}
          <div className="lg:col-span-2 p-3 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-stone-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
              <Maximize2 className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <label htmlFor="area-select" className="text-[10px] text-slate-400 block font-semibold">مسطح البناء</label>
              <select
                id="area-select"
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 outline-none cursor-pointer"
              >
                <option value="all">302 – 428 م²</option>
                <option value="300">أكثر من 300 م²</option>
                <option value="400">أكثر من 400 م²</option>
              </select>
            </div>
          </div>

          {/* Action Search CTA */}
          <div className="lg:col-span-2">
            <button
              type="submit"
              className="w-full h-13 rounded-2xl bg-[#0A2E23] hover:bg-[#0E3F30] text-white text-xs sm:text-sm font-bold transition shadow-md flex items-center justify-center gap-2 group cursor-pointer"
            >
              <Search className="w-4 h-4 text-[#C8A96A] transition-transform group-hover:scale-110" />
              <span>استكشف الوحدات</span>
            </button>
          </div>
        </form>

        {/* Quick Search Tags Strip */}
        <div className="pt-4 mt-3 border-t border-slate-200/70 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[11px] font-bold text-slate-400">الأكثر طلباً:</span>
          {QUICK_TAGS.map((tag, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-[11px] font-medium transition cursor-default"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Floating Trust & Real Estate Stats Strip */}
      <div className="mt-3 rounded-2xl bg-white/90 backdrop-blur-md border border-white/30 shadow-lg px-4 sm:px-8 py-3.5 text-slate-900">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center text-center divide-x divide-x-reverse divide-slate-200/70">
          <div className="px-2">
            <span className="text-base sm:text-lg font-black font-heading text-[#0A2E23] block tabular-nums">15 تاون هاوس</span>
            <span className="text-[11px] text-slate-500 font-medium">مشروع الشامخة بالدمام</span>
          </div>
          <div className="px-2">
            <span className="text-base sm:text-lg font-black font-heading text-[#0A2E23] block">100% مستقلة</span>
            <span className="text-[11px] text-slate-500 font-medium">صكوك إلكترونية وإفراغ فوري</span>
          </div>
          <div className="px-2">
            <div className="inline-flex items-center gap-1.5 justify-center">
              <ShieldCheck className="w-4 h-4 text-[#0A2E23]" />
              <span className="text-xs sm:text-sm font-bold text-slate-900">كود البناء السعودي</span>
            </div>
            <span className="text-[10px] text-slate-500 block">فحص وضمانات معتمدة</span>
          </div>
          <div className="px-2">
            <span className="text-xs sm:text-sm font-mono font-bold text-slate-900 block tabular-nums">1200028491#</span>
            <span className="text-[10px] text-slate-500 block">ترخيص الهيئة العامة للعقار</span>
          </div>
        </div>
      </div>
    </div>
  );
}
