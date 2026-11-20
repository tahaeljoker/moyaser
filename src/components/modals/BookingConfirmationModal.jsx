import { CheckCircle2, MessageCircle, X } from 'lucide-react';
import { brand } from '../../data/projectData.js';

export default function BookingConfirmationModal({ isOpen, onClose, bookingData }) {
  if (!isOpen || !bookingData) return null;

  const { ticket, name, phone, property, payment, notes } = bookingData;

  const msg = `السلام عليكم ورحمة الله وبركاته،\nأود تأكيد تسجيل اهتمامي وحجز موعد معاينة لدى شركة ${brand.developer}:\n──────────────────────\nرقم التذكرة: ${ticket}\nالاسم: ${name}\nالجوال: ${phone}\nالعقار المطلوب: ${property}\nطريقة السداد: ${payment}\nملاحظات: ${notes}\n──────────────────────\nشاكر لكم.`;

  const waUrl = `https://api.whatsapp.com/send?phone=${brand.whatsapp}&text=${encodeURIComponent(msg)}`;

  const rows = [
    ['رقم التذكرة', ticket],
    ['الاسم', name],
    ['الجوال', phone],
    ['العقار المطلوب', property || 'حسب الاختيار'],
    ['طريقة السداد', payment],
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="modal-enter bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-slate-900">
        <button
          onClick={onClose}
          className="absolute top-5 left-5 text-slate-400 hover:text-slate-700 transition"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-700" />
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            تم إنشاء تذكرة الحجز بنجاح
          </span>
          <h3 className="text-xl font-black font-heading text-slate-900 mt-3">
            شكراً لتسجيل اهتمامك لدى شركة {brand.developer}
          </h3>
        </div>

        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 mb-6 space-y-2 text-xs">
          {rows.map(([k, v], idx) => (
            <div
              key={idx}
              className="flex items-center justify-between border-b border-slate-100 pb-2 last:border-0 last:pb-0"
            >
              <span className="text-slate-500">{k}:</span>
              <span className={`font-bold text-slate-800 text-left ${idx === 0 ? 'text-emerald-900 font-heading text-sm' : ''}`}>
                {v}
              </span>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-md active:scale-95"
          >
            <MessageCircle className="w-4 h-4" />
            <span>إرسال التذكرة وتأكيد الموعد عبر الواتساب</span>
          </a>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
