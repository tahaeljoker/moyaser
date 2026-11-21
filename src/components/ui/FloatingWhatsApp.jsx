import { MessageCircle } from 'lucide-react';
import { brand } from '../../data/projectData.js';

export default function FloatingWhatsApp({ whatsappNumber = null, projectName = null }) {
  const targetNumber = whatsappNumber || brand.whatsapp || '966500550223';
  const cleanNumber = String(targetNumber).replace(/\D/g, '');
  const digits = cleanNumber.startsWith('05') && cleanNumber.length === 10
    ? `966${cleanNumber.slice(1)}`
    : (cleanNumber.startsWith('5') && cleanNumber.length === 9 ? `966${cleanNumber}` : cleanNumber);

  const greeting = projectName
    ? `السلام عليكم، أود الاستفسار عن مشروع ${projectName} لدى شركة مُيسر للتطوير العقاري.`
    : 'السلام عليكم، أود الاستفسار عن مشاريع شركة مُيسر للتطوير العقاري.';

  const waUrl = `https://api.whatsapp.com/send?phone=${digits}&text=${encodeURIComponent(greeting)}`;

  return (
    <aside aria-label="محادثة واتساب المباشرة" className="fixed bottom-6 left-6 z-40">
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="تواصل معنا عبر واتساب"
        className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-700 hover:bg-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
      >
        <MessageCircle className="w-5 h-5 shrink-0" />
        <span className="text-xs font-bold font-heading hidden sm:inline whitespace-nowrap">
          محادثة واتساب
        </span>
      </a>
    </aside>
  );
}
