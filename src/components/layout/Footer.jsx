import { useState } from 'react';
import { MessageCircle, Phone, Building2 } from 'lucide-react';
import { brand, footerLinks } from '../../data/projectData.js';

export default function Footer() {
  const [logoError, setLogoError] = useState(false);

  const waUrl = `https://api.whatsapp.com/send?phone=${brand.whatsapp}&text=${encodeURIComponent(
    'السلام عليكم، أود الاستفسار عن مشروع تاون هاوس الشامخة بالدمام.'
  )}`;

  return (
    <footer id="contact-section" className="bg-slate-950 text-white border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-12 border-b border-slate-800">
          {/* Brand */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center">
              {!logoError ? (
                <img
                  src={brand.logo}
                  alt={brand.developer}
                  className="h-11 sm:h-12 w-auto object-contain"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-900 text-amber-400 flex items-center justify-center">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <span className="text-base font-black font-heading text-white">{brand.developer}</span>
                </div>
              )}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              شركة تطوير عقاري سعودية متخصصة في ابتكار مشاريع سكنية نوعية ومجتمعات تاون هاوس راقية تحقق الاستقلالية وجودة الحياة العائلية.
            </p>
            <div className="text-xs text-amber-300 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>
                {brand.city} — {brand.district} — {brand.country}
              </span>
            </div>

            {/* Regulatory Compliance (REGA & FAL) */}
            <div className="pt-2 border-t border-slate-800/80 space-y-1 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="text-slate-500">رقم ترخيص الهيئة العامة للعقار:</span>
                <span className="font-mono text-slate-300 font-bold">{brand.regaLicense}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500">رقم الترخيص الفال:</span>
                <span className="font-mono text-slate-300 font-bold">{brand.falLicense}</span>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-200 font-heading">قنوات التواصل والمبيعات</h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <span className="text-slate-500">الجوال:</span>
                <a href={`tel:${brand.phone}`} className="hover:text-amber-400 transition font-bold" dir="ltr">
                  {brand.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-slate-500">الواتساب:</span>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 transition font-bold flex items-center gap-1"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>محادثة فورية مباشرة</span>
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-slate-500">ساعات العمل:</span>
                <span>{brand.workingHours}</span>
              </li>
            </ul>
          </div>

          {/* Quick links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-slate-200 font-heading">روابط المشروع السريعة</h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
              {footerLinks.map((l) => (
                <a key={l.href} href={l.href} className="hover:text-white transition">
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
          <div>
            جميع الحقوق محفوظة © 2026 <strong className="text-slate-400">{brand.developer}</strong>.
          </div>
          <div className="text-slate-400">{brand.project} — المطور الحصري المباشر</div>
        </div>
      </div>
    </footer>
  );
}
