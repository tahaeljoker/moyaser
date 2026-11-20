import { X, Calendar } from 'lucide-react';
import { models } from '../../data/projectData.js';

export default function VideoTourModal({ isOpen, onClose, modelCode, onOpenInspection }) {
  if (!isOpen) return null;

  const m = models.find((x) => x.code === modelCode) || models[0];
  const v = m.videoTour || {
    title: `جولة فيديو افتراضية — نموذج ${m.code}`,
    url: 'https://assets.mixkit.co/videos/preview/mixkit-modern-interior-of-a-contemporary-home-41542-large.mp4',
    duration: '1:30 دقيقة',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-sm">
      <div className="modal-enter bg-slate-950 border border-slate-800 rounded-3xl max-w-3xl w-full p-4 sm:p-6 shadow-2xl relative text-white">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-900/80 text-amber-400 flex items-center justify-center font-black">
              {m.code}
            </div>
            <div>
              <span className="text-xs text-amber-400 font-bold block">مشاهدة جولة الفيديو (Video Tour)</span>
              <h3 className="text-base sm:text-lg font-bold font-heading">{v.title}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition flex items-center justify-center"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative rounded-2xl overflow-hidden bg-black aspect-video shadow-inner mb-4">
          <video controls autoPlay playsInline className="w-full h-full object-cover">
            <source src={v.url} type="video/mp4" />
            متصفحك لا يدعم تشغيل الفيديو مباشرة.
          </video>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>
              مدة الجولة: <strong className="text-slate-200">{v.duration}</strong>
            </span>
            <span className="text-slate-600">|</span>
            <span>
              المساحة: <strong className="text-slate-200">{m.totalArea} م²</strong>
            </span>
          </div>
          <button
            onClick={() => {
              onClose();
              onOpenInspection({ modelCode: m.code });
            }}
            className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold transition flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
          >
            <Calendar className="w-4 h-4" />
            <span>حجز موعد معاينة ميدانية</span>
          </button>
        </div>
      </div>
    </div>
  );
}
