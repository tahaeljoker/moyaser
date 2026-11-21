import { Link } from 'react-router-dom';
import { MessageCircle, Phone, Building2 } from 'lucide-react';
import { brand } from '../../data/projectData.js';

export default function Footer({ settings = null }) {
  const rega = settings?.regaLicense || brand.regaLicense || '1200028945';
  const fal = settings?.falLicense || brand.falLicense || '1100012345';
  const phone = settings?.phoneNumber || brand.phoneDisplay;
  const waNumber = settings?.whatsappNumber || brand.whatsapp;
  const waUrl = `https://api.whatsapp.com/send?phone=${waNumber}&text=${encodeURIComponent('السلام عليكم، أود الاستفسار عن مشاريع شركة مُيسر للتطوير العقاري.')}`;

  return (
    <footer className="bg-slate-950 text-white border-t border-slate-800 pt-16 pb-12" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-12 border-b border-slate-800">
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center">
              <div className="bg-white/95 p-2 rounded-xl inline-flex items-center justify-center shadow-xs">
                <img src={brand.logo} alt={brand.developer} className="h-10 w-auto object-contain" />
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              شركة تطوير عقاري سعودية متخصصة في ابتكار مشاريع سكنية نوعية ومجتمعات تاون هاوس راقية تحقق الاستقلالية وجودة الحياة العائلية بالمنطقة الشرقية.
            </p>
            <div className="pt-2 border-t border-slate-800/80 space-y-1 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="text-slate-500">رقم ترخيص الهيئة العامة للعقار:</span>
                <span className="font-mono text-slate-300 font-bold tabular-nums">{rega}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500">رقم الترخيص الفال:</span>
                <span className="font-mono text-slate-300 font-bold tabular-nums">{fal}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-200 font-heading">قنوات التواصل والمبيعات</h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <span className="text-slate-500">الهاتف:</span>
                <a href={`tel:${brand.phone}`} className="hover:text-emerald-400 transition font-bold tabular-nums" dir="ltr">{phone}</a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-slate-500">الواتساب:</span>
                <a href={waUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 transition font-bold flex items-center gap-1">
                  <MessageCircle className="w-3.5 h-3.5" /><span>محادثة فورية مباشرة</span>
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-slate-500">المدينة:</span>
                <span>{brand.city} — {brand.country}</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-slate-200 font-heading">روابط سريعة</h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
              <Link to="/" className="hover:text-white transition">الرئيسية</Link>
              <Link to="/projects" className="hover:text-white transition">مشاريعنا</Link>
              <Link to="/about" className="hover:text-white transition">من نحن</Link>
              <Link to="/services" className="hover:text-white transition">خدماتنا</Link>
              <Link to="/contact" className="hover:text-white transition">تواصل معنا</Link>
              <Link to="/admin" className="hover:text-white transition">لوحة التحكم</Link>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>{new Date().getFullYear()} {brand.developer} - جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>صكوك مستقلة</span>
            <span>•</span>
            <span>إفراغ فوري</span>
            <span>•</span>
            <span>ضمانات شاملة</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
