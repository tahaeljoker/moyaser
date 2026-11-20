import { MessageCircle, MapPin, Calendar, FileCheck } from 'lucide-react';

const formatWhatsAppNumber = (phone) => {
  if (!phone) return '';
  const digits = String(phone).replace(/\D/g, '');
  if (digits.startsWith('05') && digits.length === 10) return `966${digits.slice(1)}`;
  if (digits.startsWith('5') && digits.length === 9) return `966${digits}`;
  return digits;
};

export default function WhatsAppTemplatesBar({ lead, projectName = 'تاون هاوس الشامخة بالدمام', mapUrl = 'https://maps.google.com/?q=Dammam+Al+Atheer+Park' }) {
  if (!lead || !lead.phone) return null;

  const digits = formatWhatsAppNumber(lead.phone);

  const templates = [
    {
      id: 'welcome_location',
      label: 'ترحيب وموقع المشروع',
      icon: MapPin,
      text: `السلام عليكم أستاذ ${lead.fullName}، يسعدنا تواصلك مع شركة مُيسّر للتطوير العقاري بخصوص مشروع ${projectName}. إليك موقع المشروع على خرائط جوجل للاطلاع: ${mapUrl}`,
    },
    {
      id: 'inspection_reminder',
      label: 'تذكير بالمعاينة',
      icon: Calendar,
      text: `السلام عليكم أستاذ ${lead.fullName}، نذكّرك بموعد زيارة ومعاينة مشروع ${projectName} ${lead.unitCode ? `للوحدة (${lead.unitCode})` : ''}. فريق المبيعات بانتظار تشريفك لتفقد الوحدات على الطبيعة.`,
    },
    {
      id: 'financing_docs',
      label: 'طلب أوراق التمويل',
      icon: FileCheck,
      text: `السلام عليكم أستاذ ${lead.fullName}، بخصوص حجزك في مشروع ${projectName} ${lead.unitCode ? `(الوحدة ${lead.unitCode})` : ''}، نرجو التكرم بتزويدنا بصورة الهوية وتعريف الراتب المحدث للبدء في إجراءات التمويل البنكي وتأكيد الحجز.`,
    },
  ];

  const handleSend = (text) => {
    const url = `https://api.whatsapp.com/send?phone=${digits}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/80 space-y-2">
      <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-900">
        <MessageCircle className="w-3.5 h-3.5 text-emerald-700" />
        <span>قوالب واتساب السريعة للعميل:</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
        {templates.map((tpl) => {
          const Icon = tpl.icon;
          return (
            <button
              key={tpl.id}
              type="button"
              onClick={() => handleSend(tpl.text)}
              className="py-1.5 px-2 bg-white hover:bg-emerald-100/60 text-emerald-900 border border-emerald-300 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition shadow-2xs"
            >
              <Icon className="w-3 h-3 text-emerald-700" />
              <span>{tpl.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
