import { useState } from 'react';
import { Menu, X, ArrowLeft, Building2 } from 'lucide-react';
import { brand, navLinks } from '../../data/projectData.js';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-sm transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <a href="#" className="flex items-center group py-1" title={brand.developer}>
            {!logoError ? (
              <img
                src={brand.logo}
                alt={brand.developer}
                className="h-11 sm:h-12 md:h-14 w-auto object-contain transition group-hover:opacity-90"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-900 to-slate-950 flex items-center justify-center text-amber-400 shadow-md">
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="text-right">
                  <span className="text-base font-black text-slate-900 font-heading block leading-none">
                    {brand.developer}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-800 block mt-0.5">
                    {brand.project}
                  </span>
                </div>
              </div>
            )}
          </a>

          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="hover:text-emerald-800 transition text-xs font-bold text-slate-700"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#booking-section"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-900 to-emerald-800 hover:from-emerald-800 hover:to-emerald-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition flex items-center gap-1.5"
            >
              <span>احجز وحدتك الآن</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={() => setMobileMenuOpen((o) => !o)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition"
              aria-label="القائمة الرئيسية"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-xs font-bold text-slate-700 hover:text-emerald-800 py-1.5"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#booking-section"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs font-bold text-emerald-900 bg-emerald-50 px-3 py-2 rounded-xl text-center"
          >
            احجز وحدتك الآن
          </a>
        </div>
      )}
    </header>
  );
}
