import { Phone, MessageCircle } from 'lucide-react';
import { brand } from '../../data/projectData.js';

export default function InfoBar() {
  const waUrl = `https://api.whatsapp.com/send?phone=${brand.whatsapp}&text=${encodeURIComponent(
    'السلام عليكم، أود الاستفسار عن مشروع تاون هاوس الشامخة بالدمام.'
  )}`;

  return (
    <div className="bg-slate-950 text-slate-300 text-xs py-2 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>
            خدمة العملاء والمبيعات: {brand.workingHours} | {brand.city} — {brand.country}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href={`tel:${brand.phone}`}
            className="hover:text-amber-400 transition flex items-center gap-1.5"
            dir="ltr"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{brand.phoneDisplay}</span>
          </a>
          <span className="text-slate-700">|</span>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:text-emerald-300 font-bold transition flex items-center gap-1.5"
          >
            <MessageCircle className="w-4 h-4" />
            <span>واتساب المبيعات الرسمي</span>
          </a>
        </div>
      </div>
    </div>
  );
}
