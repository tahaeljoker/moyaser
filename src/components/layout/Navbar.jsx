import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, ArrowLeft, Building2 } from 'lucide-react';
import { brand } from '../../data/projectData.js';

const navItems = [
  { to: '/', label: 'الرئيسية' },
  { to: '/projects', label: 'مشاريعنا' },
  { to: '/about', label: 'من نحن' },
  { to: '/services', label: 'خدماتنا' },
  { to: '/contact', label: 'تواصل معنا' },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs transition" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center py-1 group" title={brand.developer}>
            {!logoError ? (
              <img
                src={brand.logo}
                alt={brand.developer}
                className="h-11 sm:h-12 md:h-14 w-auto object-contain transition group-hover:opacity-90"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-emerald-400 shadow-xs">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-slate-900 font-heading block">{brand.developer}</span>
                  <span className="text-[10px] text-slate-500 block">تطوير عقاري نوعي</span>
                </div>
              </div>
            )}
          </Link>

          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `text-xs font-bold transition py-1 border-b-2 ${
                    isActive
                      ? 'border-emerald-800 text-emerald-900'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/contact"
              className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition inline-flex items-center gap-1.5"
            >
              <span>احجز معاينة</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen((o) => !o)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition"
              aria-label="القائمة الرئيسية"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-slate-800" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block text-xs font-bold py-2 px-3 rounded-lg ${
                  isActive ? 'bg-emerald-50 text-emerald-900' : 'text-slate-700 hover:bg-slate-50'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs font-bold text-center py-2.5 rounded-xl bg-emerald-800 text-white mt-2"
          >
            احجز معاينة
          </Link>
        </div>
      )}
    </header>
  );
}
