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

const formatPrice = (price, priceFrom) => {
  if (price && Number(price) > 0) return `${Number(price).toLocaleString('en-US')} ر.س`;
  if (priceFrom && !priceFrom.startsWith('0') && priceFrom !== '0 ر.س') return priceFrom;
  return 'تواصل لمعرفة السعر';
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

  const currentPriceText = formatPrice(unit?.price, m.priceFrom);
  const shareText = `السلام عليكم ورحمة الله، اطلع على تفاصيل ${unit?.unitCode ? `الوحدة (${unit.unitCode})` : `نموذج (${m.code})`} في مشروع تاون هاوس الشامخة — شركة مُيسّر للتطوير العقاري:
• النموذج: ${m.name} (${m.code})
• المساحة: ${unit?.area || `${m.totalArea} م²`}
• السعر: ${currentPriceText}
• الرابط: ${window.location.origin}`;
  const shareWhatsAppUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto" dir="rtl">
      <div id="floorplan-print-area" className="modal-enter bg-white rounded-3xl border border-slate-200 max-w-2xl w-full p-5 sm:p-7 shadow-2xl relative text-slate-900 my-6 print:p-0 print:border-none print:shadow-none">
        <button onClick={onClose} className="no-print absolute top-5 left-5 text-slate-400 hover:text-slate-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100" aria-label="إغلاق">
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <span className="w-10 h-10 rounded-2xl bg-slate-900 text-amber-400 font-heading font-black text-base flex items-center justify-center">
            {m.code}
          </span>
          <div>
            <h3 className="text-lg sm:text-xl font-bold font-heading text-slate-900">
              {unit?.unitCode ? `وحدة ${unit.unitCode} — ` : ''}{m.name}
            </h3>
            <p className="text-xs text-slate-500">{m.subtitle}</p>
          </div>
        </div>

        {/* Media Tabs */}
        {availableTabs.length > 1 && (
          <div className="no-print flex items-center gap-2 mb-4 border-b border-slate-100 pb-2 overflow-x-auto">
            {availableTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                    activeTab === tab.id ? 'bg-emerald-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
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
                <span className="text-[10px] text-slate-500 block">السعر</span>
                <span className="text-xs font-bold text-amber-900">{currentPriceText}</span>
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
        {activeTab === 'images' && images.length > 0 && (
          <div className="space-y-3 mb-5">
            <div className="rounded-2xl overflow-hidden border border-slate-200 max-h-64 bg-slate-900">
              <img src={selectedImg || images[0]} alt="صورة الوحدة" className="w-full h-64 object-cover" />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((img, idx) => (
                  <button key={idx} onClick={() => setSelectedImg(img)} className={`rounded-xl overflow-hidden border-2 transition ${selectedImg === img ? 'border-emerald-800' : 'border-transparent'}`}>
                    <img src={img} alt={`صورة ${idx + 1}`} className="w-full h-14 object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Video */}
        {activeTab === 'video' && videoUrl && (
          <div className="rounded-2xl overflow-hidden border border-slate-200 aspect-video mb-5 bg-slate-900">
            <iframe src={getEmbedUrl(videoUrl)} title="فيديو تعريفي" className="w-full h-full" allowFullScreen allow="autoplay; encrypted-media" />
          </div>
        )}

        {/* TAB 4: 3D Tour */}
        {activeTab === 'tour3dUrl' && tour3dUrl && (
          <div className="space-y-3 mb-5">
            <div className="rounded-2xl overflow-hidden border border-slate-200 aspect-video bg-slate-900">
              <iframe src={tour3dUrl} title="جولة 3D تفاعلية" className="w-full h-full" allowFullScreen />
            </div>
            <a href={tour3dUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-emerald-800 font-bold hover:underline">
              <span>فتح الجولة في نافذة كاملة</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* Action Buttons */}
        <div className="no-print pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button onClick={handlePrint} className="flex-1 sm:flex-none py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center justify-center gap-1.5">
              <Printer className="w-3.5 h-3.5 text-slate-600" /><span>طباعة كرت الوحدة</span>
            </button>
            <a href={shareWhatsAppUrl} target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center justify-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-emerald-700" /><span>مشاركة الوحدة</span>
            </a>
          </div>
          <a href={waInquiryUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto py-2 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm">
            <MessageCircle className="w-3.5 h-3.5" /><span>استفسار واتساب بخصوص هذا النموذج</span>
          </a>
        </div>
      </div>
    </div>
  );
}
