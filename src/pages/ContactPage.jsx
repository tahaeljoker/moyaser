import { useState } from 'react';
import { Phone, MessageCircle, MapPin, Clock, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import FloatingWhatsApp from '../components/ui/FloatingWhatsApp.jsx';
import { createLead } from '../services/api.js';
import { brand } from '../data/projectData.js';

export default function ContactPage() {
  const [form, setForm] = useState({ fullName: '', phone: '', requestType: 'inspection', preferredTime: 'عصراً', notes: '' });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

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
        fullName: form.fullName.trim(), phone: form.phone.trim(), requestType: form.requestType,
        preferredTime: form.preferredTime, paymentMethod: 'تمويل بنكي مدعوم',
        notes: form.notes.trim() || 'استفسار عبر صفحة التواصل', source: 'website',
      });
      if (res?.success) {
        setSuccessMsg(res.message || 'تم تسجيل طلبك وتوليد تذكرة متابعة بنجاح.');
        setForm({ fullName: '', phone: '', requestType: 'inspection', preferredTime: 'عصراً', notes: '' });
      } else { setErrorMsg(res?.message || 'تعذر إرسال الطلب.'); }
    } catch (err) { setErrorMsg(err.message || 'حدث خطأ أثناء الإرسال.'); }
    finally { setLoading(false); }
  };

  const waUrl = `https://api.whatsapp.com/send?phone=${brand.whatsapp}&text=${encodeURIComponent('السلام عليكم، أود التواصل مع فريق مبيعات شركة مُيسر للتطوير العقاري.')}`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans" dir="rtl">
      <Navbar />

      <section className="bg-slate-950 text-white py-16 md:py-24 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase">قنوات الاتصال المباشرة</span>
          <h1 className="text-3xl sm:text-5xl font-black font-heading text-white">تواصل مع مُيسر للتطوير العقاري</h1>
          <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
            نسعد بالإجابة على استفساراتكم وحجز مواعيد المعاينة الميدانية لمشاريعنا بالدمام والمنطقة الشرقية.
          </p>
        </div>
      </section>

      <main className="flex-1 py-16 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-5 space-y-4 text-xs text-slate-700">
            <h2 className="text-xl font-bold font-heading text-slate-900 mb-2">معلومات الاتصال</h2>
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0"><Phone className="w-5 h-5" /></div>
              <div><span className="text-slate-400 block text-[10px]">الهاتف المباشر</span><a href={`tel:${brand.phone}`} className="font-bold text-slate-900 font-mono tabular-nums text-sm hover:text-emerald-800" dir="ltr">{brand.phoneDisplay}</a></div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0"><MessageCircle className="w-5 h-5" /></div>
              <div><span className="text-slate-400 block text-[10px]">الواتساب</span><a href={waUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-emerald-800 text-sm hover:underline">محادثة واتساب مبيعات</a></div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0"><MapPin className="w-5 h-5" /></div>
              <div><span className="text-slate-400 block text-[10px]">المقر</span><span className="font-bold text-slate-900 block">{brand.city} - {brand.district}</span></div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0"><Clock className="w-5 h-5" /></div>
              <div><span className="text-slate-400 block text-[10px]">أوقات العمل</span><span className="font-bold text-slate-900 block">{brand.workingHours}</span></div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
            <h2 className="text-xl font-bold font-heading text-slate-900 mb-2">تسجيل طلب استفسار أو معاينة</h2>
            <p className="text-xs text-slate-500 mb-6">يرجى ملء البيانات وسيتم الرد عليك في أقرب وقت.</p>

            {successMsg && <div className="p-4 mb-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" /><span>{successMsg}</span></div>}
            {errorMsg && <div className="p-4 mb-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2"><AlertCircle className="w-5 h-5 text-rose-700 shrink-0" /><span>{errorMsg}</span></div>}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div><label className="block text-slate-700 font-bold mb-1">الاسم الكريم *</label><input type="text" required placeholder="محمد أحمد..." value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden" /></div>
              <div><label className="block text-slate-700 font-bold mb-1">رقم الجوال *</label><input type="tel" required placeholder="05XXXXXXXX" dir="ltr" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden font-mono text-right tabular-nums" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-slate-700 font-bold mb-1">نوع الطلب</label><select value={form.requestType} onChange={(e) => setForm({ ...form, requestType: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden"><option value="inspection">معاينة ميدانية</option><option value="booking">حجز وحدة</option><option value="waitlist">استفسار عام</option></select></div>
                <div><label className="block text-slate-700 font-bold mb-1">الوقت المفضل</label><select value={form.preferredTime} onChange={(e) => setForm({ ...form, preferredTime: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden"><option value="صباحاً">صباحاً (9 - 12)</option><option value="ظهراً">ظهراً (1 - 4)</option><option value="عصراً">عصراً (4 - 9)</option></select></div>
              </div>
              <div><label className="block text-slate-700 font-bold mb-1">ملاحظات أو استفسار محدد</label><textarea rows={3} placeholder="أي تفاصيل تود الاستفسار عنها..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden" /></div>
              <button type="submit" disabled={loading} className="w-full py-3 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl transition duration-200 flex items-center justify-center gap-2 shadow-xs"><Send className="w-4 h-4" /><span>{loading ? 'جاري الإرسال...' : 'إرسال طلب الاستفسار'}</span></button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
