import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
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
  const [scrolled, setScrolled] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [pill, setPill] = useState({ left: 0, width: 0, visible: false });
  const linkRefs = useRef([]);
  const { pathname } = useLocation();

  const activeIdx = navItems.findIndex((item) =>
    item.to === '/' ? pathname === '/' : pathname === item.to || pathname.startsWith(`${item.to}/`)
  );

  const updatePillTo = useCallback((idx) => {
    const el = idx >= 0 ? linkRefs.current[idx] : null;
    if (!el) {
      setPill((p) => (p.visible ? { ...p, visible: false } : p));
      return;
    }
    setPill({ left: el.offsetLeft, width: el.offsetWidth, visible: true });
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const target = hoveredIdx !== null ? hoveredIdx : activeIdx;
    const raf = requestAnimationFrame(() => updatePillTo(target));
    const onResize = () => updatePillTo(hoveredIdx !== null ? hoveredIdx : activeIdx);
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, [hoveredIdx, activeIdx, updatePillTo]);

  return (
    <>
      <div aria-hidden="true" className="h-[90px] sm:h-[114px] w-full shrink-0 bg-[#0a2e23]" />
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#0a2e23]" dir="rtl">
        <div
          className={`pointer-events-auto mt-[10px] mx-[10px] sm:mt-[18px] sm:mx-[60px] h-20 sm:h-24 px-4 sm:px-[36px] rounded-[24px] bg-[rgba(255,255,255,0.97)] backdrop-blur-md text-[#0a2e23] flex items-center justify-between transition-shadow duration-500 motion-reduce:transition-none ${
            scrolled ? 'shadow-[0_10px_30px_rgba(0,0,0,0.25)]' : 'shadow-none'
          }`}
        >
          <Link to="/" className="flex items-center py-1 group shrink-0" title={brand.developer}>
            {!logoError ? (
              <img
                src={brand.logo}
                alt={brand.developer}
                className="h-16 sm:h-20 w-auto max-w-none object-contain transition duration-300 group-hover:opacity-90"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-emerald-400 shadow-xs">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-slate-900 font-heading block">{brand.developer}</span>
                  <span className="text-[10px] text-slate-500 block">تطوير عقاري نوعي</span>
                </div>
              </div>
            )}
          </Link>

          <nav
            className="relative hidden lg:flex items-center gap-1"
            onMouseLeave={() => setHoveredIdx(null)}
          >
            <span
              aria-hidden="true"
              className="absolute top-1/2 -translate-y-1/2 h-[42px] rounded-full bg-[#e5eee9] pointer-events-none motion-reduce:transition-none"
              style={{
                left: 0,
                width: `${pill.width}px`,
                transform: `translate3d(${pill.left}px, -50%, 0)`,
                opacity: pill.visible ? 1 : 0,
                transition: 'transform 0.35s ease-in-out, width 0.35s ease-in-out, opacity 0.2s ease',
              }}
            />
            {navItems.map((item, idx) => (
              <NavLink
                key={item.to}
                to={item.to}
                ref={(el) => { linkRefs.current[idx] = el; }}
                onMouseEnter={() => setHoveredIdx(idx)}
                className="relative z-10 px-[18px] py-[10px] text-[15px] font-bold text-[#0a2e23] whitespace-nowrap transition-colors duration-200"
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              to="/contact"
              className="group relative overflow-hidden px-4 sm:px-5 py-2.5 rounded-xl bg-[#0a2e23] text-white hover:text-[#06261c] text-xs sm:text-[13px] font-bold shadow-xs transition-all duration-300 hover:-translate-y-[2px] motion-reduce:transition-none motion-reduce:transform-none inline-flex items-center gap-1.5 whitespace-nowrap"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-[#c9ab68] translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out motion-reduce:transition-none"
              />
              <span className="relative z-10 inline-flex items-center gap-1.5">
                <span>احجز معاينة</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen((o) => !o)}
              className="lg:hidden p-2 rounded-xl text-[#0a2e23] hover:bg-[#e5eee9]/60 transition"
              aria-label="القائمة الرئيسية"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="pointer-events-auto lg:hidden mt-2 mb-2.5 mx-[10px] sm:mx-[60px] max-h-[calc(100dvh-108px)] sm:max-h-[calc(100dvh-134px)] overflow-y-auto overscroll-contain rounded-2xl bg-[rgba(255,255,255,0.97)] backdrop-blur-md border border-slate-200/80 shadow-lg px-4 pt-3 pb-5 space-y-1.5">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block text-[15px] font-bold py-2.5 px-4 rounded-full transition-colors duration-150 ${
                    isActive ? 'bg-[#e5eee9] text-[#0a2e23]' : 'text-[#0a2e23] hover:bg-[#e5eee9]/60'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[13px] font-bold text-center py-2.5 rounded-xl bg-[#0a2e23] text-white mt-2"
            >
              احجز معاينة
            </Link>
          </div>
        )}
      </header>
    </>
  );
}
