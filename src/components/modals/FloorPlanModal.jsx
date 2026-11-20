import { X, Download, Printer, MessageCircle, Check } from 'lucide-react';
import { brand, models } from '../../data/projectData.js';
import { triggerBrochurePrint, getBrochureWhatsAppUrl, formatBrochureDate } from '../../utils/brochurePrint.js';

export default function FloorPlanModal({ isOpen, onClose, modelCode }) {
  if (!isOpen) return null;

  const m = models.find((x) => x.code === modelCode) || models[0];
  const currentDate = formatBrochureDate();
  const waUrl = getBrochureWhatsAppUrl(m, brand);

  const handlePrint = () => {
    triggerBrochurePrint(m, brand);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div
        id="floorplan-print-area"
        className="modal-enter bg-white rounded-3xl border border-slate-200 max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative text-slate-900 my-8 print:p-0 print:border-none print:shadow-none"
      >
        <button
          onClick={onClose}
          className="no-print absolute top-5 left-5 text-slate-400 hover:text-slate-700 transition w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Official Branded Header */}
        <div className="p-5 rounded-2xl border border-slate-200 mb-6 bg-slate-50/50 print:bg-white print:border-slate-300">
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <img
                src={brand.logo}
                alt={brand.developer}
                className="w-12 h-12 object-contain rounded-lg border border-slate-200 bg-white p-1"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <div>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                  وثيقة مواصفات معتمدة من المطور
                </span>
                <h3 className="text-xl sm:text-2xl font-black font-heading text-slate-900 mt-1">
                  المخطط المعماري — نموذج {m.code} ({m.name})
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  مشروع تاون هاوس الشامخة | {brand.district} — {brand.city}
                </p>
              </div>
            </div>
            <div className="text-left flex-shrink-0 text-xs">
              <span className="text-[11px] text-slate-400 block">المطور المباشر</span>
              <span className="font-bold text-slate-800 font-heading block">{brand.developer}</span>
              <span className="text-[10px] text-slate-500 block">رخصة فال: {brand.falLicense}</span>
              <span className="text-[10px] text-slate-500 block">ترخيص إعلان: {brand.regaLicense}</span>
            </div>
          </div>

          {/* Key Metric Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
            <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 text-center">
              <span className="text-[10px] text-slate-500 block mb-0.5">مسطحات البناء</span>
              <span className="text-xs font-bold text-slate-900 font-heading">{m.builtArea} م²</span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 text-center">
              <span className="text-[10px] text-slate-500 block mb-0.5">المساحة الإجمالية</span>
              <span className="text-xs font-bold text-emerald-950 font-heading">{m.totalArea} م²</span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 text-center">
              <span className="text-[10px] text-slate-500 block mb-0.5">الأدوار</span>
              <span className="text-xs font-bold text-slate-900 font-heading truncate">{m.floors.split('+')[0]}</span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 text-center">
              <span className="text-[10px] text-slate-500 block mb-0.5">السعر يبدأ من</span>
              <span className="text-xs font-bold text-amber-900 font-heading">{m.priceFrom}</span>
            </div>
          </div>
        </div>

        {/* 3D Render Preview (Enhanced for Brochure) */}
        <div className="mb-6 rounded-2xl overflow-hidden border border-slate-200 max-h-48 relative bg-slate-900">
          <img
            src={m.mediaViews?.exterior?.local || m.image}
            alt={m.name}
            className="w-full h-48 object-cover"
            loading="lazy"
            onError={(e) => { e.currentTarget.src = m.image; }}
          />
          <div className="absolute bottom-2 right-3 left-3 bg-slate-950/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-xl text-xs flex items-center justify-between">
            <span className="font-bold">{m.subtitle}</span>
            <span className="text-amber-300 font-heading text-[11px]">{m.rooms}</span>
          </div>
        </div>

        {/* Floors Layout */}
        <div className="space-y-3 mb-6">
          <h4 className="text-xs font-bold text-slate-600 font-heading flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-800" />
            <span>توزيع وتفاصيل الأدوار والمساحات:</span>
          </h4>
          {m.floorPlan.map((f, i) => (
            <div
              key={i}
              className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm relative"
            >
              <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-emerald-900 text-amber-400 text-xs font-black flex items-center justify-center font-heading">
                    {i + 1}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 font-heading">{f.floor}</h4>
                </div>
                {f.area && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                    {f.area}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">{f.spaces}</p>
            </div>
          ))}
        </div>

        {/* Architectural Specifications */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-6 text-xs text-slate-600">
          <span className="font-bold text-slate-800 block mb-1.5">المعايير والمواصفات المعمارية للنموذج:</span>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {m.highlights.map((h, i) => (
              <li key={i} className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Dedicated Print-Only Official Footer */}
        <div className="print-only pt-4 border-t border-slate-300 text-[10px] text-slate-600 flex items-center justify-between">
          <div>
            <p className="font-bold text-slate-900">{brand.developer} — المطور الحصري</p>
            <p>الدمام، حي حديقة الأثير | هاتف وواتساب: {brand.phoneDisplay}</p>
            <p>رخصة فال: {brand.falLicense} | إعلان: {brand.regaLicense}</p>
          </div>
          <div className="text-left">
            <p>تم استخراج الوثيقة: {currentDate}</p>
            <p className="text-emerald-800 font-bold">صك إلكتروني مستقل وإفراغ فوري</p>
          </div>
        </div>

        {/* Actions (Hidden on Print) */}
        <div className="no-print flex flex-col sm:flex-row items-center gap-2.5 pt-2">
          <button
            onClick={handlePrint}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-md active:scale-95"
          >
            <Download className="w-4 h-4 text-amber-300" />
            <span>تحميل بروشور الوحدة (PDF)</span>
          </button>
          <button
            onClick={() => window.print()}
            className="w-full sm:w-auto py-3 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة سريعة</span>
          </button>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto py-3 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center justify-center gap-1.5"
          >
            <MessageCircle className="w-4 h-4 text-emerald-700" />
            <span>استفسار واتساب</span>
          </a>
          <button
            onClick={onClose}
            className="w-full sm:w-auto py-3 px-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold transition"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
