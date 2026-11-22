import { useState, useRef, useCallback } from 'react';
import { ChevronsLeftRight, Sparkles, Layers } from 'lucide-react';

const scenes = [
  {
    id: 'facade',
    label: 'الواجهة المعمارية والاستقلالية',
    code: 'MODEL-A',
    blueprint: '/images/shamkha/plan-a-1.webp',
    reality: '/images/shamkha/render-a.webp',
    desc: 'مقارنة المخطط الهندسي للدور الأرضي مع الواجهة المعمارية المنفذة بالحجر والزجاج العازل.',
  },
  {
    id: 'living',
    label: 'صالة المعيشة والتوزيع الداخلي',
    code: 'INTERIOR',
    blueprint: '/images/shamkha/plan-b-1.webp',
    reality: '/images/shamkha/interior-2.webp',
    desc: 'انتقال الفراغات من توزيع المسقط الأفقي إلى الإضاءة الطبيعية والتشطيبات الفاخرة.',
  },
  {
    id: 'skylight',
    label: 'أفنية الإضاءة السماوية Sky Light',
    code: 'MODEL-C',
    blueprint: '/images/shamkha/plan-c-1.webp',
    reality: '/images/shamkha/interior-3.webp',
    desc: 'استغلال هندسي ذكي يحول فناء الإضاءة الهندسي إلى انسيابية ضوئية في قلب المسكن.',
  },
];

export default function BlueprintRealitySlider() {
  const [activeScene, setActiveScene] = useState(0);
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef(null);
  const isDragging = useRef(false);

  const scene = scenes[activeScene];

  const updatePosition = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.min(Math.max((x / rect.width) * 100, 5), 95);
    setSliderPos(percentage);
  }, []);

  const handlePointerDown = () => {
    isDragging.current = true;
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current) return;
    updatePosition(e.clientX);
  };

  return (
    <section className="py-20 md:py-28 bg-[#F8F7F4] border-b border-slate-200/80 overflow-hidden" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/10 border border-emerald-900/20 text-xs font-bold text-[#0A2E23]">
            <Sparkles className="w-3.5 h-3.5 text-[#C8A96A]" />
            <span>تجربة بصرية تفاعلية</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black font-heading text-slate-900 leading-tight">
            من دقة المخطط الهندسي إلى بهاء الواقع
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
            اسحب المقبض التفاعلي لاستكشاف كيف تتحول الرسومات الهندسية الدقيقة إلى مجتمعات سكنية متكاملة تنبض بالحياة.
          </p>
        </div>

        {/* Scene Selection Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6">
          {scenes.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => {
                setActiveScene(idx);
                setSliderPos(50);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${
                activeScene === idx
                  ? 'bg-[#0A2E23] text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="font-mono text-[10px] opacity-75">{s.code}</span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>

        {/* Interactive Comparison Stage */}
        <div className="relative rounded-3xl bg-slate-950 border border-slate-300/80 overflow-hidden shadow-xl">
          <div
            ref={containerRef}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerUp}
            className="relative w-full h-[360px] sm:h-[480px] md:h-[560px] cursor-ew-resize select-none overflow-hidden touch-none"
          >
            {/* Base Layer: Blueprint Drawing (Underneath, right side) */}
            <div className="absolute inset-0 bg-[#061F17] blueprint-paper flex items-center justify-center p-6">
              <img
                src={scene.blueprint}
                alt="المخطط المعماري"
                className="max-h-full max-w-full object-contain filter invert opacity-80"
              />
              <div className="absolute bottom-5 right-6 z-10 px-3.5 py-1.5 rounded-full bg-slate-950/80 border border-white/15 text-[11px] font-bold text-stone-200 backdrop-blur-md">
                المخطط الهندسي (2D Blueprint)
              </div>
            </div>

            {/* Clipped Top Layer: 3D Reality Render */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
            >
              <div className="absolute inset-0 bg-slate-950 flex items-center justify-center">
                <img
                  src={scene.reality}
                  alt="الرندر الواقعي"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-5 left-6 z-10 px-3.5 py-1.5 rounded-full bg-[#0A2E23]/90 border border-[#C8A96A]/30 text-[11px] font-bold text-[#C8A96A] backdrop-blur-md">
                  الواقع المعماري (3D Reality)
                </div>
              </div>
            </div>

            {/* Draggable Divider Handle Line */}
            <div
              className="absolute top-0 bottom-0 z-30 pointer-events-none"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="relative w-0.5 h-full bg-[#C8A96A] shadow-[0_0_15px_rgba(200,169,106,0.8)] flex items-center justify-center">
                <div className="w-10 h-10 -ml-5 rounded-full bg-[#0A2E23] border-2 border-[#C8A96A] text-[#C8A96A] flex items-center justify-center shadow-2xl">
                  <ChevronsLeftRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Scene Description Bar */}
          <div className="p-5 sm:p-6 bg-white border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#0A2E23] flex items-center justify-center shrink-0 border border-emerald-200">
                <Layers className="w-4 h-4" />
              </div>
              <p className="leading-relaxed font-medium">{scene.desc}</p>
            </div>
            <span className="text-slate-400 font-mono text-[11px] shrink-0">
              اسحب المؤشر لليمين واليسار للمقارنة
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
