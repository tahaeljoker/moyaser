import { useState, useEffect } from 'react';
import { Video, FileText, Calendar, Layers, Sparkles, Compass } from 'lucide-react';
import { models as fallbackModels } from '../../data/projectData.js';
import { fetchModels } from '../../services/api.js';

const VIEW_TABS = [
  { key: 'exterior', label: 'الواجهة المعمارية', icon: Layers },
  { key: 'interior', label: 'التشطيبات الداخلية', icon: Sparkles },
  { key: 'floorplan', label: 'المخططات الهندسية', icon: Compass },
];

const formatPrice = (priceFrom, startingPrice) => {
  if (startingPrice && Number(startingPrice) > 0) return `${Number(startingPrice).toLocaleString('en-US')} ر.س`;
  if (priceFrom && !priceFrom.startsWith('0') && priceFrom !== '0 ر.س') return priceFrom;
  return 'تواصل لمعرفة السعر';
};

export default function ModelsShowcase({ onOpenVideo, onOpenFloorPlan, onOpenInspection }) {
  const [modelList, setModelList] = useState(fallbackModels);
  const [activeCode, setActiveCode] = useState('A');
  const [activeView, setActiveView] = useState('exterior');
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    fetchModels()
      .then((res) => {
        if (isMounted && res?.data && Array.isArray(res.data) && res.data.length > 0) {
          const merged = fallbackModels.map((fb) => {
            const live = res.data.find((m) => m.code === fb.code);
            if (!live) return fb;
            return {
              ...fb,
              name: live.name || fb.name,
              area: live.area || fb.area,
              areaDisplay: live.area || fb.area,
              floors: live.floors || fb.floors,
              baths: live.bathrooms || fb.baths,
              startingPrice: live.startingPrice !== undefined ? live.startingPrice : fb.startingPrice,
              description: live.description || fb.description,
              highlights: (live.features && live.features.length > 0) ? live.features : fb.highlights,
            };
          });
          setModelList(merged);
        }
      })
      .catch(() => {});
    return () => { isMounted = false; };
  }, []);

  const currentModel = modelList.find((m) => m.code === activeCode) || modelList[0];
  const activeMedia = currentModel.mediaViews?.[activeView] || {
    local: currentModel.image,
    fallback: currentModel.image,
    title: currentModel.name,
  };

  const handleModelChange = (code) => {
    setActiveCode(code);
    setImageError(false);
  };

  const handleViewChange = (viewKey) => {
    setActiveView(viewKey);
    setImageError(false);
  };

  const imgSrc = imageError ? activeMedia.fallback : (activeMedia.local || activeMedia.fallback);
  const displayPrice = formatPrice(currentModel.priceFrom, currentModel.startingPrice);

  return (
    <section id="models-showcase-section" className="py-14 md:py-20 bg-slate-50 border-b border-slate-200" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80 mb-2">
          معرض النماذج والتفاصيل المعمارية
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
          النماذج المعمارية (A — F)
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-2">
          6 نماذج دوبلكس بتوزيعات هندسية مدروسة وواجهات معمارية وتشطيبات متكاملة.
        </p>
      </div>

      {/* Model Tabs (A to F) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-8">
        {modelList.map((m) => (
          <button
            key={m.code}
            onClick={() => handleModelChange(m.code)}
            className={`p-3 rounded-2xl border text-center transition ${
              activeCode === m.code
                ? 'bg-emerald-900 text-white border-emerald-900 shadow-md ring-2 ring-emerald-900/20'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span className="text-xs font-black font-heading block">نموذج {m.code}</span>
            <span className={`text-[10px] block mt-0.5 truncate ${activeCode === m.code ? 'text-amber-300' : 'text-slate-500'}`}>
              {m.areaDisplay || m.area || `${m.totalArea} م²`}
            </span>
          </button>
        ))}
      </div>

      {/* Showcase Card with 3D Media Switcher */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
        {/* Media Frame */}
        <div className="lg:col-span-7 relative min-h-[340px] sm:min-h-[420px] bg-slate-950 flex flex-col justify-between p-6 overflow-hidden">
          <img
            key={`${activeCode}-${activeView}`}
            src={imgSrc}
            alt={`${currentModel.name} - ${activeMedia.title}`}
            onError={() => setImageError(true)}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-90"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-slate-950/40 pointer-events-none" />

          {/* Top Pill & View Tabs */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-2">
            <span className="bg-emerald-900/90 backdrop-blur-md text-amber-300 text-xs px-3.5 py-1 rounded-full font-bold border border-emerald-500/30">
              نموذج {currentModel.code} — {currentModel.badge}
            </span>

            <div className="flex items-center gap-1 bg-slate-900/80 backdrop-blur-md p-1 rounded-2xl border border-white/10">
              {VIEW_TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeView === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => handleViewChange(tab.key)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                      isActive ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Title Overlay */}
          <div className="relative z-10 text-white mt-auto pt-6">
            <h3 className="text-xl sm:text-2xl font-bold font-heading">{currentModel.name}</h3>
            <p className="text-xs text-slate-300 mt-1 max-w-lg">{currentModel.subtitle}</p>
          </div>
        </div>

        {/* Specs & Actions Panel */}
        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500">السعر يبدأ من:</span>
              <span className="text-lg sm:text-xl font-black text-emerald-950 font-heading">
                {displayPrice}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block mb-0.5">المساحة الإجمالية</span>
                <span className="text-xs font-bold text-slate-800 font-heading">{currentModel.areaDisplay || `${currentModel.totalArea} م²`}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block mb-0.5">مسطح البناء</span>
                <span className="text-xs font-bold text-slate-800 font-heading">{currentModel.builtArea} م²</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block mb-0.5">دورات المياه</span>
                <span className="text-xs font-bold text-slate-800 font-heading">{currentModel.baths}</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50/60 p-4 rounded-2xl border border-slate-100">
              <span className="font-bold text-slate-800 block mb-1">المزايا الهندسية المعتمدة:</span>
              <p className="text-slate-700 font-medium">{currentModel.rooms}</p>
              <p className="text-slate-500 text-[11px]">{currentModel.floors}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
            <button
              onClick={() => onOpenFloorPlan(currentModel.code)}
              className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>المخطط والبروشور</span>
            </button>
            <button
              onClick={() => onOpenVideo(currentModel.code)}
              className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Video className="w-3.5 h-3.5" />
              <span>جولة الفيديو</span>
            </button>
            <button
              onClick={() => onOpenInspection({ modelCode: currentModel.code })}
              className="py-2.5 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>حجز معاينة</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
  );
}
