import { Link } from 'react-router-dom';
import { ArrowLeft, MessageCircle, ShieldCheck } from 'lucide-react';

export default function HomeContactCta({ settings }) {
  const whatsappNumber = settings?.whatsappNumber || '966500550223';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'السلام عليكم، أود حجز موعد استشارة عقارية لمشاريع شركة مُيسر للتطوير العقاري.'
  )}`;

  return (
    <section className="py-20 lg:py-24 bg-[#061F17] text-white relative overflow-hidden" dir="rtl">
      {/* Subtle Radial Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#C8A96A_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-[#C8A96A]/30 text-xs font-semibold text-[#D6B87A] backdrop-blur-md">
          <ShieldCheck className="w-4 h-4 text-[#C8A96A]" />
          <span>استشارات التملك والاستثمار السكني</span>
        </div>

        <h2
          className="text-2xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight leading-tight"
          style={{ lineHeight: 1.7 }}
        >
          هل تبحث عن مستشارك العقاري الموثوق بالمنطقة الشرقية؟
        </h2>

        <p className="text-xs sm:text-base text-stone-300 max-w-2xl mx-auto leading-relaxed font-normal">
          فريقنا الهندسي والتسويقي على أتم الاستعداد لمناقشة تطلعاتكم السكنية والإجابة على كافة الاستفسارات المتعلقة بالمشاريع والوحدات وتسهيلات التمويل البنكي.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-4">
          <Link
            to="/contact"
            className="px-7 py-3.5 rounded-xl bg-[#C8A96A] hover:bg-[#D6B87A] text-[#061F17] font-bold text-xs sm:text-sm transition-colors duration-300 shadow-md inline-flex items-center gap-2"
          >
            <span>احجز جلسة استشارية</span>
            <ArrowLeft className="w-4 h-4 text-[#061F17]" />
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-7 py-3.5 rounded-xl border border-white/25 text-white hover:bg-white/10 text-xs sm:text-sm font-bold transition-colors duration-300 inline-flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4 text-[#D6B87A]" />
            <span>محادثة واتساب مباشرة</span>
          </a>
        </div>
      </div>
    </section>
  );
}
