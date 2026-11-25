import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import { brand } from '../../data/projectData.js';

export default function Hero({ settings = null }) {
  const heroRef = useRef(null);
  const glowRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    const rafId = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(rafId);
  }, []);

  useEffect(() => {
    const heroEl = heroRef.current;
    const glowEl = glowRef.current;
    if (!heroEl || !glowEl) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobileOrTouch = window.matchMedia('(max-width: 899px), (pointer: coarse), (hover: none)');
    if (reducedMotion.matches || mobileOrTouch.matches) {
      glowEl.style.transform = '';
      return;
    }

    const rect = heroEl.getBoundingClientRect();
    let targetX = rect.width * 0.5;
    let targetY = rect.height * 0.5;
    let currentX = targetX;
    let currentY = targetY;
    let frameId = null;

    const onPointerMove = (e) => {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      const bounds = heroEl.getBoundingClientRect();
      targetX = e.clientX - bounds.left;
      targetY = e.clientY - bounds.top;
    };

    const tick = () => {
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;
      glowEl.style.transform = `translate3d(${currentX - 500}px, ${currentY - 500}px, 0)`;
      frameId = requestAnimationFrame(tick);
    };

    heroEl.addEventListener('pointermove', onPointerMove, { passive: true });
    frameId = requestAnimationFrame(tick);

    return () => {
      heroEl.removeEventListener('pointermove', onPointerMove);
      if (frameId !== null) cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <section
      ref={heroRef}
      dir="rtl"
      className="e6-hero relative w-full min-h-[calc(100vh-90px)] sm:min-h-[calc(100vh-114px)] flex items-center overflow-hidden text-[#F8F7F4]"
      style={{ background: 'linear-gradient(135deg, #0b3a2c 0%, #06261c 70%)' }}
    >
      <style>{`
        .e6-ease { transition-timing-function: cubic-bezier(0.2, 0.7, 0.2, 1); }
        .e6-divider {
          transform-origin: top center;
          transition: transform 900ms cubic-bezier(0.2, 0.7, 0.2, 1), opacity 700ms cubic-bezier(0.2, 0.7, 0.2, 1);
        }
        @keyframes e6GlowDrift {
          0% { transform: translate3d(-44%, -46%, 0); }
          50% { transform: translate3d(-56%, -40%, 0); }
          100% { transform: translate3d(-48%, -56%, 0); }
        }
        .e6-follower-glow { left: 0; top: 0; will-change: transform; }
        @media (max-width: 899px), (pointer: coarse), (hover: none) {
          .e6-follower-glow { left: 50%; top: 45%; animation: e6GlowDrift 20s ease-in-out infinite alternate; }
          .e6-desktop-grid { grid-template-columns: 1fr !important; gap: 36px !important; }
          .e6-logo-col { order: 1 !important; }
          .e6-text-col { order: 2 !important; text-align: center !important; align-items: center !important; }
          .e6-eyebrow, .e6-buttons, .e6-project-line { justify-content: center !important; }
          .e6-gold-line { display: none !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .e6-anim, .e6-divider, .e6-follower-glow { animation: none !important; transition: none !important; }
          .e6-anim { opacity: 1 !important; transform: none !important; }
          .e6-divider { opacity: 1 !important; transform: scaleY(1) !important; }
          .e6-follower-glow { left: 50%; top: 50%; transform: translate3d(-50%, -50%, 0) !important; }
        }
      `}</style>

      {/* Background Glow Layer */}
      <div aria-hidden="true" className="pointer-events-none select-none absolute inset-0 overflow-hidden">
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] opacity-[0.28]"
          style={{ background: 'radial-gradient(circle, rgba(44, 130, 96, 0.38) 0%, transparent 65%)' }}
        />
        <div
          ref={glowRef}
          className="e6-follower-glow absolute w-[1000px] h-[1000px] opacity-[0.85]"
          style={{ background: 'radial-gradient(circle, rgba(44, 130, 96, 0.38) 0%, transparent 65%)' }}
        />
        <div
          className={`e6-gold-line e6-divider absolute top-10 bottom-10 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-[#c9ab68]/55 to-transparent ${
            mounted ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'
          }`}
        />
      </div>

      {/* Main Two-Column Container */}
      <div className="relative z-10 w-full px-5 sm:px-8 min-[900px]:px-[120px] pt-12 pb-28 min-[900px]:py-16">
        <div className="e6-desktop-grid grid grid-cols-2 items-center gap-[60px] max-w-[1200px] mx-auto">
          {/* Right Column (RTL first): Text Block */}
          <div className="e6-text-col flex flex-col items-start text-right max-w-[430px] w-full mx-auto min-[900px]:mx-0">
            <div
              className={`e6-gold-line e6-anim e6-ease w-full h-px mb-7 bg-gradient-to-l from-[#c9ab68]/60 via-[#c9ab68]/25 to-transparent transition-all duration-700 delay-300 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[26px]'
              }`}
            />

            {/* Eyebrow */}
            <div
              className={`e6-eyebrow e6-anim e6-ease flex items-center gap-2.5 text-[14px] font-semibold text-[#c9ab68] transition-all duration-700 delay-[450ms] ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[26px]'
              }`}
            >
              <span className="inline-block w-[8px] h-[8px] bg-[#c9ab68] shrink-0" />
              <span>ميسر للتطوير العقاري</span>
            </div>

            {/* Two-Line H1 */}
            <h1
              className={`e6-anim e6-ease mt-4 text-[28px] leading-[1.6] font-extrabold text-[#F8F7F4] transition-all duration-700 delay-[700ms] ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[26px]'
              }`}
            >
              مجتمعات سكنية مستقلة
              <br />
              بالمنطقة الشرقية
            </h1>

            {/* Subline */}
            <p
              className={`e6-anim e6-ease mt-4 text-[16px] leading-relaxed text-[#F8F7F4]/85 transition-all duration-700 delay-[950ms] ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[26px]'
              }`}
            >
              {settings?.heroSubtitle?.trim() || 'تصاميم عصرية.'}
            </p>

            {/* Action Buttons */}
            <div
              className={`e6-buttons e6-anim e6-ease mt-7 flex flex-wrap items-center gap-3.5 transition-all duration-700 delay-[1200ms] ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[26px]'
              }`}
            >
              <Link
                to="/projects"
                className="px-6 py-3 rounded-[6px] bg-[#0d3a2c] border border-[#c9ab68]/75 hover:border-[#c9ab68] text-[#F8F7F4] text-sm font-bold inline-flex items-center gap-2 group transition-all duration-300 hover:-translate-y-[2px] motion-reduce:transform-none"
              >
                استكشف مشاريعنا ←
              </Link>
              <Link
                to="/contact"
                className="px-6 py-3 rounded-[6px] bg-[#c9ab68] hover:bg-[#d5b978] border border-[#c9ab68] text-[#06261c] text-sm font-bold transition-all duration-300 hover:-translate-y-[2px] motion-reduce:transform-none"
              >
                احجز معاينة
              </Link>
            </div>

            {/* Project Line */}
            <div
              className={`e6-project-line e6-anim e6-ease mt-6 flex items-center gap-2.5 text-[14px] text-[#F8F7F4]/85 transition-all duration-700 delay-[1450ms] ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[26px]'
              }`}
            >
              <span>{settings?.projectName?.trim() ? `◆ ${settings.projectName.trim()}` : '◆ تاون هاوس الشامخة – الدمام'}</span>
            </div>
          </div>

          {/* Left Column (RTL second): Logo Card */}
          <div className="e6-logo-col flex flex-col items-center justify-center w-full">
            <div
              className={`e6-anim e6-ease w-[340px] max-w-full h-[380px] rounded-[14px] bg-[#fbf9f3] shadow-[0_32px_70px_-15px_rgba(2,15,10,0.68)] flex items-center justify-center p-8 transition-all duration-[900ms] delay-200 ${
                mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-[40px]'
              }`}
            >
              {!logoError ? (
                <img
                  src={brand.logo}
                  alt={brand.developer}
                  className="w-[250px] max-w-full h-auto object-contain"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div className="w-24 h-24 rounded-[14px] bg-white border border-stone-200 flex items-center justify-center text-[#0b3a2c]">
                  <Building2 className="w-12 h-12" />
                </div>
              )}
            </div>

            <div
              className={`e6-gold-line e6-anim e6-ease w-[340px] max-w-full h-px mt-7 bg-gradient-to-r from-transparent via-[#c9ab68]/50 to-transparent transition-all duration-700 delay-500 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[26px]'
              }`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
