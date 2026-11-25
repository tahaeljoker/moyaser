import { useEffect, useState } from 'react';
import { Phone, MessageCircle, MapPin, Clock, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import FloatingWhatsApp from '../components/ui/FloatingWhatsApp.jsx';
import { createLead } from '../services/api.js';
import { brand } from '../data/projectData.js';

export default function ContactPage() {
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    requestType: 'inspection',
    preferredTime: 'عصراً',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (!form.fullName.trim() || !form.phone.trim()) {
      return setErrorMsg('يرجى إدخال الاسم ورقم الجوال.');
    }

    setLoading(true);
    try {
      const res = await createLead({
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        requestType: form.requestType,
        preferredTime: form.preferredTime,
        paymentMethod: 'تمويل بنكي مدعوم',
        notes: form.notes.trim() || 'استفسار عبر صفحة التواصل',
        source: 'website',
      });
      if (res?.success) {
        setSuccessMsg(res.message || 'تم تسجيل طلبك وتوليد تذكرة متابعة بنجاح.');
        setForm({ fullName: '', phone: '', requestType: 'inspection', preferredTime: 'عصراً', notes: '' });
      } else {
        setErrorMsg(res?.message || 'تعذر إرسال الطلب.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'حدث خطأ أثناء الإرسال.');
    } finally {
      setLoading(false);
    }
  };

  const waUrl = `https://api.whatsapp.com/send?phone=${brand.whatsapp}&text=${encodeURIComponent(
    'السلام عليكم، أود التواصل مع فريق مبيعات شركة مُيسر للتطوير العقاري.'
  )}`;

  const contactCards = [
    { icon: Phone, label: 'الهاتف المباشر', content: <a href={`tel:${brand.phone}`} className="font-bold text-[#0a2e23] font-mono tabular-nums text-sm hover:text-[#134e3e] transition-colors" dir="ltr">{brand.phoneDisplay}</a> },
    { icon: MessageCircle, label: 'الواتساب', content: <a href={waUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-[#0a2e23] text-sm hover:underline">محادثة واتساب مبيعات</a> },
    { icon: MapPin, label: 'المقر', content: <span className="font-bold text-[#0a2e23] block">{brand.city} - {brand.district}</span> },
    { icon: Clock, label: 'أوقات العمل', content: <span className="font-bold text-[#0a2e23] block">{brand.workingHours}</span> },
  ];

  return (
    <div className="min-h-screen bg-[#ece6d6] text-[#0a2e23] flex flex-col font-sans" dir="rtl">
      <Navbar />

      {/* 1. Hero */}
      <section
        className="relative text-white pt-8 pb-10 sm:pt-10 sm:pb-12 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0b3a2c 0%, #06261c 100%)' }}
      >
        <div
          className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none motion-reduce:transform-none motion-reduce:opacity-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
        >
          <div className="max-w-4xl space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-[#c9ab68]/40 text-xs font-bold text-[#c9ab68] backdrop-blur-md">
              <Phone className="w-3.5 h-3.5 text-[#c9ab68]" />
              <span>قنوات الاتصال المباشرة</span>
            </div>

            <h1
              className="text-2xl sm:text-3xl lg:text-[44px] lg:whitespace-nowrap font-black font-heading text-white"
              style={{ lineHeight: 1.65 }}
            >
              تواصل مع مُيسر
            </h1>

            <p className="text-xs sm:text-sm text-stone-200/90 max-w-2xl leading-relaxed">
              نسعد بالإجابة على استفساراتكم وحجز مواعيد المعاينة الميدانية لمشاريعنا بالدمام والمنطقة الشرقية.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Contact Info & Form */}
      <main className="flex-1 py-12 sm:py-16 pb-24 sm:pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[28px] items-start">
          <div className="lg:col-span-5 space-y-4 text-xs text-slate-700">
            <h2 className="text-xl sm:text-2xl font-black font-heading text-[#0a2e23] mb-2" style={{ lineHeight: 1.7 }}>
              معلومات الاتصال
            </h2>
            {contactCards.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-4 sm:p-5 rounded-[14px] bg-[#fbf9f3] border border-[#e3dbc6] shadow-[0_12px_32px_-12px_rgba(6,38,28,0.12)] flex items-center gap-3.5"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#0b3a2c] text-[#c9ab68] border border-[#c9ab68]/30 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-slate-500 block text-[11px] font-medium">{item.label}</span>
                    {item.content}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-7 bg-[#fbf9f3] p-6 sm:p-8 rounded-[14px] border border-[#e3dbc6] border-t-[4px] border-t-[#c9ab68] shadow-[0_20px_50px_-15px_rgba(6,38,28,0.16)]">
            <h2 className="text-xl sm:text-2xl font-black font-heading text-[#0a2e23] mb-1.5" style={{ lineHeight: 1.7 }}>
              تسجيل طلب استفسار أو معاينة
            </h2>
            <p className="text-xs text-slate-600 mb-6">يرجى ملء البيانات وسيتم الرد عليك في أقرب وقت.</p>

            {successMsg && (
              <div className="p-4 mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}
            {errorMsg && (
              <div className="p-4 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-700 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#0a2e23] font-bold mb-1.5">الاسم الكريم *</label>
                <input
                  type="text"
                  required
                  placeholder="محمد أحمد..."
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#e3dbc6] focus:border-[#0a2e23] focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[#0a2e23] font-bold mb-1.5">رقم الجوال *</label>
                <input
                  type="tel"
                  required
                  placeholder="05XXXXXXXX"
                  dir="ltr"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#e3dbc6] focus:border-[#0a2e23] focus:outline-hidden font-mono text-right tabular-nums"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#0a2e23] font-bold mb-1.5">نوع الطلب</label>
                  <select
                    value={form.requestType}
                    onChange={(e) => setForm({ ...form, requestType: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#e3dbc6] focus:border-[#0a2e23] focus:outline-hidden"
                  >
                    <option value="inspection">معاينة ميدانية</option>
                    <option value="booking">حجز وحدة</option>
                    <option value="waitlist">استفسار عام</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#0a2e23] font-bold mb-1.5">الوقت المفضل</label>
                  <select
                    value={form.preferredTime}
                    onChange={(e) => setForm({ ...form, preferredTime: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#e3dbc6] focus:border-[#0a2e23] focus:outline-hidden"
                  >
                    <option value="صباحاً">صباحاً (9 - 12)</option>
                    <option value="ظهراً">ظهراً (1 - 4)</option>
                    <option value="عصراً">عصراً (4 - 9)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[#0a2e23] font-bold mb-1.5">ملاحظات أو استفسار محدد</label>
                <textarea
                  rows={3}
                  placeholder="أي تفاصيل تود الاستفسار عنها..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#e3dbc6] focus:border-[#0a2e23] focus:outline-hidden"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-[8px] bg-[#0b3a2c] hover:bg-[#06261c] border border-[#c9ab68]/40 text-white font-bold transition-all duration-300 hover:-translate-y-0.5 motion-reduce:transform-none flex items-center justify-center gap-2 shadow-xs disabled:opacity-60"
              >
                <Send className="w-4 h-4 text-[#c9ab68]" />
                <span>{loading ? 'جاري الإرسال...' : 'إرسال طلب الاستفسار'}</span>
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
