import { useState } from 'react';
import { X, Download, Printer, MessageCircle, Check, FileText, Image, Video, Compass, ExternalLink, Share2 } from 'lucide-react';
import { brand, models } from '../../data/projectData.js';
import { triggerBrochurePrint, getBrochureWhatsAppUrl, formatBrochureDate } from '../../utils/brochurePrint.js';

const getEmbedUrl = (url) => {
  if (!url) return '';
  if (url.includes('youtu.be/')) {
    const id = url.split('youtu.be/')[1]?.split(/[?&]/)[0];
    return `https://www.youtube-nocookie.com/embed/${id}`;
  }
  if (url.includes('watch?v=')) {
    const id = url.split('watch?v=')[1]?.split('&')[0];
    return `https://www.youtube-nocookie.com/embed/${id}`;
  }
  if (url.includes('vimeo.com/')) {
    const id = url.split('vimeo.com/')[1]?.split(/[?&]/)[0];
    return `https://player.vimeo.com/video/${id}`;
  }
  return url;
};

export default function FloorPlanModal({ isOpen, onClose, modelCode, unit }) {
  if (!isOpen) return null;

  const m = models.find((x) => x.code === modelCode) || models[0];
  const currentDate = formatBrochureDate();
  const waInquiryUrl = getBrochureWhatsAppUrl(m, brand);

  const images = unit?.media?.images?.length ? unit.media.images : [];
  const videoUrl = unit?.media?.videoUrl || '';
  const tour3dUrl = unit?.media?.tour3dUrl || '';

  const availableTabs = [
    { id: 'specs', label: 'المواصفات والمخطط', icon: FileText },
    images.length > 0 && { id: 'images', label: `الصور (${images.length})`, icon: Image },
    videoUrl && { id: 'video', label: 'الفيديو التعريفي', icon: Video },
    tour3dUrl && { id: 'tour3d', label: 'جولة 3D تفاعلية', icon: Compass },
  ].filter(Boolean);

  const [activeTab, setActiveTab] = useState('specs');
  const [selectedImg, setSelectedImg] = useState(images[0] || null);

  const handlePrint = () => { triggerBrochurePrint(m, brand); };

  const shareText = `السلام عليكم ورحمة الله، اطلع على تفاصيل ${unit?.unitCode ? `الوحدة (${unit.unitCode})` : `نموذج (${m.code})`} في مشروع تاون هاوس الشامخة — شركة مُيسّر للتطوير العقاري:
• النموذج: ${m.name} (${m.code})
• المساحة: ${unit?.area || `${m.totalArea} م²`}
• السعر: ${unit?.price ? `${Number(unit.price).toLocaleString('en-US')} ر.س` : m.priceFrom}
• الرابط: ${window.location.origin}`;
  const shareWhatsAppUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto" dir="rtl">
      <div id="floorplan-print-area" className="modal-enter bg-white rounded-3xl border border-slate-200 max-w-2xl w-full p-5 sm:p-7 shadow-2xl relative text-slate-900 my-6 print:p-0 print:border-none print:shadow-none">
        <button onClick={onClose} className="no-print absolute top-5 left-5 text-slate-400 hover:text-slate-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100" aria-label="إغلاق">
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-200">
          <img src={brand.logo} alt={brand.developer} className="w-11 h-11 object-contain rounded-lg border border-slate-200 bg-white p-1" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          <div>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {unit?.unitCode ? `الوحدة ${unit.unitCode} — ` : ''}نموذج {m.code} ({m.name})
            </span>
            <h3 className="text-lg sm:text-xl font-black font-heading text-slate-900 mt-0.5">مشروع تاون هاوس الشامخة</h3>
          </div>
        </div>

        {/* Media Navigation Tabs */}
        {availableTabs.length > 1 && (
          <div className="no-print flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 border-b border-slate-100">
            {availableTabs.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === t.id ? 'bg-emerald-800 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* TAB 1: Specs & Floorplan */}
        {activeTab === 'specs' && (
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 block">مسطح البناء</span>
                <span className="text-xs font-bold text-slate-900">{m.builtArea} م²</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 block">المساحة الإجمالية</span>
                <span className="text-xs font-bold text-emerald-950">{m.totalArea} م²</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 block">الأدوار</span>
                <span className="text-xs font-bold text-slate-900 truncate">{m.floors.split('+')[0]}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 block">السعر يبدأ من</span>
                <span className="text-xs font-bold text-amber-900">{unit?.price ? `${Number(unit.price).toLocaleString('en-US')} ر.س` : m.priceFrom}</span>
              </div>
            </div>

            <div className="mb-5 rounded-2xl overflow-hidden border border-slate-200 max-h-44 relative bg-slate-900">
              <img src={m.mediaViews?.exterior?.local || m.image} alt={m.name} className="w-full h-44 object-cover" loading="lazy" />
              <div className="absolute bottom-2 right-3 left-3 bg-slate-950/70 backdrop-blur-sm text-white px-3 py-1 rounded-xl text-xs flex items-center justify-between">
                <span className="font-bold">{m.subtitle}</span>
                <span className="text-amber-300 text-[11px] font-mono">{m.rooms}</span>
              </div>
            </div>

            <div className="space-y-2 mb-5">
              <h4 className="text-xs font-bold text-slate-700">توزيع الأدوار:</h4>
              {m.floorPlan.map((f, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex items-center justify-between pb-1 mb-1 border-b border-slate-200/60 font-bold">
                    <span>{i + 1}. {f.floor}</span>
                    {f.area && <span className="text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border">{f.area}</span>}
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">{f.spaces}</p>
                </div>
              ))}
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 mb-5 text-xs">
              <span className="font-bold text-slate-800 block mb-1">المواصفات المعمارية:</span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-slate-600">
                {m.highlights.map((h, i) => (
                  <li key={i} className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-700" /><span>{h}</span></li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* TAB 2: Images Gallery */}
        {activeTab === 'images' && (
          <div className="space-y-3 mb-5">
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 h-64 flex items-center justify-center">
              <img src={selectedImg || images[0]} alt="صورة الوحدة" className="w-full h-full object-contain" />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button key={idx} onClick={() => setSelectedImg(img)} className={`w-16 h-16 rounded-xl border-2 overflow-hidden flex-shrink-0 ${selectedImg === img ? 'border-emerald-800' : 'border-slate-200 opacity-70'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Video Embed */}
        {activeTab === 'video' && (
          <div className="mb-5 space-y-2">
            <div className="rounded-2xl overflow-hidden border border-slate-200 aspect-video bg-black">
              <iframe src={getEmbedUrl(videoUrl)} title="فيديو الوحدة" className="w-full h-full" allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
            </div>
            <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-800 font-bold inline-flex items-center gap-1 hover:underline">
              <span>فتح الفيديو في نافذة مستقلة</span><ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}

        {/* TAB 4: 3D Tour */}
        {activeTab === 'tour3d' && (
          <div className="mb-5 space-y-2">
            <div className="rounded-2xl overflow-hidden border border-slate-200 h-80 bg-slate-900">
              <iframe src={tour3dUrl} title="جولة ثلاثية الأبعاد" className="w-full h-full" allowFullScreen />
            </div>
            <a href={tour3dUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-800 font-bold inline-flex items-center gap-1 hover:underline">
              <span>فتح الجولة 3D في شاشة كاملة</span><ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}

        {/* Footer Actions */}
        <div className="no-print flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <button onClick={handlePrint} className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs">
            <Download className="w-3.5 h-3.5 text-amber-300" /><span>تحميل بروشور (PDF)</span>
          </button>
          <a href={shareWhatsAppUrl} target="_blank" rel="noopener noreferrer" className="py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition flex items-center justify-center gap-1.5">
            <Share2 className="w-3.5 h-3.5 text-emerald-700" /><span>مشاركة عبر واتساب</span>
          </a>
          <button onClick={() => window.print()} className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs">
            <Printer className="w-3.5 h-3.5" /><span>طباعة</span>
          </button>
          <a href={waInquiryUrl} target="_blank" rel="noopener noreferrer" className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center justify-center gap-1.5">
            <MessageCircle className="w-3.5 h-3.5 text-emerald-700" /><span>استفسار</span>
          </a>
        </div>
      </div>
    </div>
  );
}