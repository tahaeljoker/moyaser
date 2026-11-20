import { useState } from 'react';
import { CheckCircle2, Clock } from 'lucide-react';
import { brand, properties } from '../../data/projectData.js';
import { createLead } from '../../services/api.js';

const fmt = (n) => new Intl.NumberFormat('en-US').format(n);

export default function BookingForm({ onBookingSuccess, onShowToast }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [propertyId, setPropertyId] = useState('');
  const [preferredTime, setPreferredTime] = useState('عصراً');
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
        preferredTime,
        paymentMethod: payment,
        notes: `${selectedProp ? `العقار: ${propLabel} | ` : ''}${notes.trim()}`,
      });

      if (res?.data?.ticketNumber) {
        ticket = res.data.ticketNumber;
      }
    } catch (err) {
      console.warn('[BookingForm] API sync fallback:', err.message);
    } finally {
      setIsSubmitting(false);
    }

    const bookingPayload = {
      ticket,
      name: name.trim(),
      phone: cleanPhone,
      unitId: propertyId || 'غير محدد',
      paymentMethod: payment,
      preferredTime,
    };

    onBookingSuccess(bookingPayload);
  };

  return (
    <section id="booking-section" className="bg-slate-900 text-white py-16 sm:py-20 lg:py-24 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 bg-amber-950/70 px-3.5 py-1 rounded-full border border-amber-800/80 mb-2.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>طلب معاينة وحجز رسمي</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-heading tracking-tight text-white">
            احجز موعد معاينة أو استفسر عن الوحدات
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            سيتواصل معك مستشار المبيعات المعتمد لتأكيد الموعد وتقديم المشورة التمويلية.
          </p>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl backdrop-blur-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">الاسم الكريم *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: محمد بن سعد العتيبي"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">رقم الجوال *</label>
                <input
                  type="tel"
                  required
                  dir="ltr"
                  placeholder="05XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-600 font-mono text-left"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">العقار أو المشروع المطلوب</label>
                <select
                  value={propertyId}
                  onChange={(e) => setPropertyId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600"
                >
                  <option value="">مشروع تاون هاوس الشامخة (الدمام)</option>
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} — {p.cityDistrict} ({fmt(p.price)} ر.س)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>الوقت المفضل للاتصال</span>
                </label>
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600"
                >
                  <option value="صباحاً">صباحاً (9:00 ص - 12:00 م)</option>
                  <option value="عصراً">عصراً (4:00 م - 6:30 م)</option>
                  <option value="مساءً">مساءً (6:30 م - 9:00 م)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">خيار الشراء والتمويل المفضل</label>
              <select
                value={payment}
                onChange={(e) => setPayment(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600"
              >
                <option value="تمويل بنكي مدعوم / مرابحة عقارية">تمويل بنكي مدعوم / مرابحة عقارية (سكني)</option>
                <option value="سداد نقدي / كاش مباشر">سداد نقدي / كاش مباشر</option>
                <option value="تمويل تجاري / جهات معتمدة">تمويل تجاري / جهات معتمدة</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">ملاحظات أو استفسارات إضافية</label>
              <textarea
                rows={2}
                placeholder="أي استفسار يخص الدفعة الأولى أو رغبة في تفاصيل نموذج معين..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-600 resize-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white text-sm font-bold shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSubmitting ? 'جاري إرسال الطلب...' : 'إرسال طلب الحجز والمعاينة'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}