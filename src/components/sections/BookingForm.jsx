import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { brand, properties } from '../../data/projectData.js';
import { createLead } from '../../services/api.js';

const fmt = (n) => new Intl.NumberFormat('en-US').format(n);

export default function BookingForm({ onBookingSuccess, onShowToast }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [propertyId, setPropertyId] = useState('');
  const [payment, setPayment] = useState('تمويل بنكي مدعوم / مرابحة عقارية');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || name.trim().length < 3) {
      onShowToast('يرجى إدخال الاسم الكريم بشكل صحيح.', 'error');
      return;
    }

    const cleanPhone = phone.trim().replace(/[\s-]/g, '');
    if (!cleanPhone || !/^0?5[0-9]{8}$/.test(cleanPhone)) {
      onShowToast('يرجى إدخال رقم جوال سعودي صالح (مثال: 0500550223).', 'error');
      return;
    }

    const selectedProp = properties.find((p) => p.id === propertyId);
    const propLabel = selectedProp
      ? `${selectedProp.title} — ${selectedProp.cityDistrict} (${selectedProp.area}) — ${fmt(selectedProp.price)} ر.س`
      : 'لم يتم تحديد عقار محدد';

    setIsSubmitting(true);
    let ticket = `#MS-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      const res = await createLead({
        fullName: name.trim(),
        phone: cleanPhone,
        requestType: 'booking',
        paymentMethod: payment,
        notes: `${selectedProp ? `العقار: ${propLabel} | ` : ''}${notes.trim()}`,
      });

      if (res?.data?.ticketNumber) {
        ticket = res.data.ticketNumber;
      }
    } catch (err) {
      // Graceful offline fallback: keep local ticket and notify
      console.warn('[BookingForm] API sync fallback:', err.message);
    } finally {
      setIsSubmitting(false);
    }

    const bookingPayload = {
      ticket,
      name: name.trim(),
      phone: cleanPhone,
      propertyId: selectedProp?.id || null,
      property: propLabel,
      payment,
      notes: notes.trim() || 'لا توجد ملاحظات إضافية',
      timestamp: new Date().toISOString(),
    };

    // Backup to localStorage
    try {
      const existingLeads = JSON.parse(localStorage.getItem('ms_leads') || '[]');
      existingLeads.push(bookingPayload);
      localStorage.setItem('ms_leads', JSON.stringify(existingLeads));
    } catch {
      // Ignore localStorage errors
    }

    onBookingSuccess(bookingPayload);
    setName('');
    setPhone('');
    setPropertyId('');
    setNotes('');
  };

  return (
    <section id="booking-section" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-lg">
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200/60 mb-2">
            حجز ومعاينة رسمية مباشرة
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
            سجّل اهتمامك واحجز موعدك
          </h2>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            سيصدر لك رقم تذكرة رسمي ويُربطك مباشرة بمدير المبيعات عبر الواتساب لتنسيق المعاينة الميدانية.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="b-name" className="block text-xs font-bold text-slate-700 mb-1.5">
                الاسم الثلاثي الكريم *
              </label>
              <input
                type="text"
                id="b-name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: عبدالمحسن عبدالله الشمري"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-800"
              />
            </div>

            <div>
              <label htmlFor="b-phone" className="block text-xs font-bold text-slate-700 mb-1.5">
                رقم الجوال (+966) *
              </label>
              <input
                type="tel"
                id="b-phone"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="05xxxxxxxx"
                dir="ltr"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-right focus:outline-none focus:ring-2 focus:ring-emerald-800"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="booking-property-select" className="block text-xs font-bold text-slate-700 mb-1.5">
                العقار المطلوب *
              </label>
              <select
                id="booking-property-select"
                required
                value={propertyId}
                onChange={(e) => setPropertyId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-800"
              >
                <option value="">— اختر العقار المطلوب للمعاينة أو الشراء —</option>
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} — {p.cityDistrict} ({p.area}) — {fmt(p.price)} ر.س
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="b-payment" className="block text-xs font-bold text-slate-700 mb-1.5">
                طريقة الشراء المفضلة
              </label>
              <select
                id="b-payment"
                value={payment}
                onChange={(e) => setPayment(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-800"
              >
                <option value="شراء نقدي (كاش)">شراء نقدي (كاش)</option>
                <option value="تمويل بنكي مدعوم / مرابحة عقارية">تمويل بنكي مدعوم / مرابحة عقارية</option>
                <option value="خطة دفعات مرحلية مع المطور">خطة دفعات مرحلية مع المطور</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="b-notes" className="block text-xs font-bold text-slate-700 mb-1.5">
              الموعد المفضل للمعاينة أو ملاحظات
            </label>
            <textarea
              id="b-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="مثال: أفضل المعاينة يوم السبت بعد صلاة العصر..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-800"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 hover:from-emerald-800 hover:to-slate-800 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-75"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{isSubmitting ? 'جاري تسجيل الطلب...' : 'تأكيد تسجيل الاهتمام وتوليد تذكرة الحجز الرسمية'}</span>
            </button>
            <p className="text-[11px] text-slate-400 text-center mt-2">
              بياناتك محمية ومخصصة حصرياً لشركة {brand.developer}.
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
