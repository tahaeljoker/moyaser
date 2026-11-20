import { Phone, MessageCircle, Bell } from 'lucide-react';
import { brand } from '../../data/projectData.js';

export default function InfoBar({ settings = null }) {
  const currentWhatsApp = settings?.whatsappNumber || brand.whatsapp;
  const currentPhone = settings?.phoneNumber || brand.phoneDisplay;
  const waUrl = `https://api.whatsapp.com/send?phone=${currentWhatsApp}&text=${encodeURIComponent(
    'السلام عليكم، أود الاستفسار عن مشروع تاون هاوس الشامخة بالدمام.'
  )}`;

  const announcement = settings?.announcementBar?.enabled && settings?.announcementBar?.text
    ? settings.announcementBar.text
    : null;

  return (
    <div className="bg-slate-950 text-slate-300 text-xs border-b border-slate-800">
      {announcement && (
        <div className="bg-emerald-900/90 text-white py-1.5 px-4 text-center font-bold text-[11px] flex items-center justify-center gap-1.5 border-b border-emerald-800">
          <Bell className="w-3.5 h-3.5 text-amber-300" />
          <span>{announcement}</span>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>خدمة العملاء: {settings?.officeInfo?.workingHours || brand.workingHours} | {settings?.city || brand.city}</span>
        </div>
        <div className="flex items-center gap-4">
          <a href={`tel:${brand.phone}`} className="hover:text-amber-400 transition flex items-center gap-1.5" dir="ltr">
            <Phone className="w-3.5 h-3.5" />
            <span>{currentPhone}</span>
          </a>
          <span className="text-slate-700">|</span>
          <a href={waUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 font-bold transition flex items-center gap-1.5">
            <MessageCircle className="w-4 h-4" />
            <span>واتساب المبيعات الرسمي</span>
          </a>
        </div>
      </div>
    </div>
  );
}
