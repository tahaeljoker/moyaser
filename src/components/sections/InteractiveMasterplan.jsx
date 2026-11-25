import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowLeft, CheckCircle2, Building2 } from 'lucide-react';

const hotspots = [
  {
    id: '118-G',
    unitCode: '118-G',
    model: 'A',
    modelName: 'الدوبلكس الأرضي الرحب',
    x: 22,
    y: 38,
    area: '250.75 + 177 (427.75 م²)',
    highlight: 'حوش وارتداد خاص 177 م² وكراج مستقل',
    image: '/images/shamkha/render-a.webp',
  },
  {
    id: '117-U',
    unitCode: '117-U',
    model: 'B',
    modelName: 'الدوبلكس العلوي مع السطح',
    x: 35,
    y: 65,
    area: '233 + 69 (302 م²)',
    highlight: 'تراس سطح خاص 69 م² وإطلالة بانورامية',
    image: '/images/shamkha/render-b.webp',
  },
  {
    id: '128-G',
    unitCode: '128-G',
    model: 'C',
    modelName: 'الدوبلكس الوسطي الذكي',
    x: 52,
    y: 42,
    area: '239 + 134 (373 م²)',
    highlight: 'فناء إضاءة سماوية Sky Light وحوش 134 م²',
    image: '/images/shamkha/render-c.webp',
  },
  {
    id: '126-U',
    unitCode: '126-U',
    model: 'D',
    modelName: 'تاون هاوس الزاوية',
    x: 72,
    y: 68,
    area: '227 + 80 (307 م²)',
    highlight: 'موقع زاوية بواجهتين معماريتين وكراج لسيارتين',
    image: '/images/shamkha/render-d.webp',
  },
  {
    id: '126-G',
    unitCode: '126-G',
    model: 'E',
    modelName: 'الدوبلكس المدمج',
    x: 62,
    y: 36,
    area: '247 + 161 (408 م²)',
    highlight: 'حوش خاص 161 م² بأعلى قيمة استثمارية',
    image: '/images/shamkha/render-e.webp',
  },
  {
    id: '132-G',
    unitCode: '132-G',
    model: 'F',
    modelName: 'الدوبلكس العلوي مع روف وحوش',
    x: 84,
    y: 40,
    area: '247 + 179 (426 م²)',
    highlight: '3 أدوار باستقلالية تامة مع روف وحوش 179 م²',
    image: '/images/shamkha/render-f.webp',
  },
];

export default function InteractiveMasterplan({ settings = null }) {
  const [activePin, setActivePin] = useState(hotspots[0]);

  return (
    <section className="py-20 md:py-28 bg-white border-b border-slate-200/80 overflow-hidden" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-[#0A2E23]">
            <Building2 className="w-3.5 h-3.5" />
            <span>المخطط العام التفاعلي</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black font-heading text-slate-900 leading-tight">
            استكشف توزيع الوحدات بالمشروع (15 تاون هاوس)
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
            انقر أو مرر الفأرة فوق النقاط المضيئة على المخطط العام للتعرف على موقع كل وحدة سكنية، نموذجها المعماري، ومساحات الحوش والسطح التابعة لها.
          </p>
        </div>

        {/* Masterplan Interactive Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Map Viewport */}
          <div className="lg:col-span-8 relative rounded-3xl bg-[#061F17] border border-slate-300/80 overflow-hidden shadow-xl p-4 sm:p-6 group select-none">
            <div className="relative w-full h-[340px] sm:h-[460px] md:h-[520px] rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center">
              <img
                src="/images/shamkha/masterplan.webp"
                alt="المخطط العام لمشروع تاون هاوس الشامخة"
                className="w-full h-full object-contain filter contrast-105"
              />

              {/* Pulsing Hotspot Pins */}
              {hotspots.map((pin) => {
                const isSelected = activePin?.id === pin.id;
                return (
                  <button
                    key={pin.id}
                    onClick={() => setActivePin(pin)}
                    onMouseEnter={() => setActivePin(pin)}
                    style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group/pin z-20 focus:outline-none"
                    aria-label={`الوحدة ${pin.unitCode}`}
                  >
                    <span
                      className={`relative flex items-center justify-center transition-all duration-300 ${isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                        }`}
                    >
                      {/* Pulsing Wave Ring */}
                      <span
                        className={`absolute inline-flex h-8 w-8 rounded-full opacity-75 animate-ping ${isSelected ? 'bg-[#C8A96A]' : 'bg-emerald-400'
                          }`}
                      />
                      {/* Core Pin Badge */}
                      <span
                        className={`relative inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full text-[10px] font-mono font-bold shadow-xl border-2 transition-colors ${isSelected
                            ? 'bg-[#0A2E23] text-[#C8A96A] border-[#C8A96A]'
                            : 'bg-white text-slate-900 border-[#0A2E23]'
                          }`}
                      >
                        {pin.model}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Bottom Map Note */}
            <div className="mt-3 flex items-center justify-between text-[11px] text-stone-300 font-mono px-2">
              <span>حديقة الأثير العامة بالجهة الشمالية للمشروع</span>
              <span className="text-[#C8A96A]">انقر أي نقطة لاستعراض الوحدة</span>
            </div>
          </div>

          {/* Active Unit Focus Card */}
          <div className="lg:col-span-4">
            {activePin && (
              <div className="rounded-3xl bg-[#F8F7F4] border border-slate-200/90 p-6 sm:p-7 space-y-5 shadow-sm">
                <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-950 border border-slate-200">
                  <img
                    src={activePin.image}
                    alt={activePin.modelName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold bg-[#0A2E23] text-[#C8A96A] border border-[#C8A96A]/30">
                    وحدة {activePin.unitCode}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-emerald-800">
                      نموذج {activePin.model}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      متاح للحجز
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 font-heading">
                    {activePin.modelName}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {activePin.highlight}
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1 text-xs">
                  <span className="text-[10px] text-slate-400 block">إجمالي مسطحات الوحدة</span>
                  <span className="font-bold text-slate-900 tabular-nums block font-mono">
                    {activePin.area}
                  </span>
                </div>

                <div className="pt-2 flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-[#0A2E23] shrink-0" />
                  <span>{settings?.siteCopy?.masterplanBadge?.trim() || 'وحدات مستقلة'}</span>
                </div>

                <Link
                  to="/projects/shamkha"
                  className="w-full text-center px-5 py-3 rounded-xl bg-[#0A2E23] hover:bg-[#0E3F30] text-white text-xs font-bold transition shadow-xs flex items-center justify-center gap-2"
                >
                  <span>استعراض مخططات الوحدة</span>
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
