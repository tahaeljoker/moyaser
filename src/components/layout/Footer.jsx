import { Link } from 'react-router-dom';
import { MessageCircle, Phone, Building2 } from 'lucide-react';
import { brand } from '../../data/projectData.js';

export default function Footer({ settings = null }) {
  const phone = settings?.phoneNumber || brand.phoneDisplay;
  const waNumber = settings?.whatsappNumber || brand.whatsapp;
  const waUrl = `https://api.whatsapp.com/send?phone=${waNumber}&text=${encodeURIComponent('السلام عليكم، أود الاستفسار عن مشاريع شركة مُيسر للتطوير العقاري.')}`;

  return (
    <footer
      className="text-[#f4efe2] border-t border-white/10 pt-16 pb-24"
      style={{ background: 'linear-gradient(135deg, #0b3a2c 0%, #06261c 100%)' }}
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-12 border-b border-white/10">
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center">
              <div className="bg-white/95 p-2 rounded-xl inline-flex items-center justify-center shadow-xs">
                <img src={brand.logo} alt={brand.developer} className="h-10 w-auto object-contain" />
              </div>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed max-w-sm">
              شركة تطوير عقاري سعودية متخصصة في ابتكار مشاريع سكنية نوعية ومجتمعات تاون هاوس راقية تحقق الاستقلالية وجودة الحياة العائلية بالمنطقة الشرقية.
            </p>
          </div>

          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold text-[#c9ab68] font-heading">قنوات التواصل والمبيعات</h4>
            <ul className="space-y-2 text-xs text-stone-200">
              <li className="flex items-center gap-2">
                <span className="text-stone-400">الهاتف:</span>
                <a href={`tel:${brand.phone}`} className="hover:text-[#c9ab68] transition font-bold tabular-nums" dir="ltr">{phone}</a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-stone-400">الواتساب:</span>
                <a href={waUrl} target="_blank" rel="noopener noreferrer" className="text-[#c9ab68] hover:text-[#d5b978] transition font-bold flex items-center gap-1">
                  <MessageCircle className="w-3.5 h-3.5" /><span>محادثة فورية مباشرة</span>
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-stone-400">المدينة:</span>
                <span>{brand.city} — {brand.country}</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-[#c9ab68] font-heading">روابط سريعة</h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-stone-300">
              <Link to="/" className="hover:text-[#c9ab68] transition">الرئيسية</Link>
              <Link to="/projects" className="hover:text-[#c9ab68] transition">مشاريعنا</Link>
              <Link to="/about" className="hover:text-[#c9ab68] transition">من نحن</Link>
              <Link to="/services" className="hover:text-[#c9ab68] transition">خدماتنا</Link>
              <Link to="/contact" className="hover:text-[#c9ab68] transition">تواصل معنا</Link>
              <Link to="/admin" className="hover:text-[#c9ab68] transition">لوحة التحكم</Link>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-300/80 gap-4">
          <p>{new Date().getFullYear()} {brand.developer} - جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>{settings?.siteCopy?.footerBadge1?.trim() || 'وحدات مستقلة'}</span>
            <span>•</span>
            <span>{settings?.siteCopy?.footerBadge2?.trim() || 'تصاميم عصرية'}</span>
            <span>•</span>
            <span>{settings?.siteCopy?.footerBadge3?.trim() || 'ضمانات شاملة'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
