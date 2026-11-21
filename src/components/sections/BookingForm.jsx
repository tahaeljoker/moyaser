import { useState } from 'react';
import { CheckCircle2, Clock } from 'lucide-react';
import { brand, properties } from '../../data/projectData.js';
import { createLead } from '../../services/api.js';
import PhoneInputWithCountry from '../ui/PhoneInputWithCountry.jsx';

const fmt = (n) => new Intl.NumberFormat('en-US').format(n);

export default function BookingForm({ onBookingSuccess, onShowToast, projectId = null, projectName = '', selectedUnitCode = '' }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+966');
  const [propertyId, setPropertyId] = useState('');
  const [preferredTime, setPreferredTime] = useState('عصراً');
  const [payment, setPayment] = useState('تمويل بنكي مدعوم');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || name.trim().length < 3) {
      onShowToast('يرجى إدخال الاسم الكريم بشكل صحيح.', 'error');
      return;
    }

    const cleanPhone = String(phone || '').trim().replace(/[\s\-()]/g, '');
    if (!cleanPhone || !/^\+?[1-9]\d{7,14}$/.test(cleanPhone)) {
      onShowToast('يرجى إدخال رقم جوال دولي صالح من 8 إلى 15 رقماً.', 'error');
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
        projectId: projectId || undefined,
        projectName: projectName || undefined,
        unitCode: selectedUnitCode || undefined,
        notes: `${selectedProp ? `العقار: ${propLabel} | ` : ''}${notes.trim()}`,
      });

      if (res?.data?.ticketNumber) {
        ticket = res.data.ticketNumber;
      }
      if (res?.isDuplicate) {
        onShowToast(res.message, 'info');
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
      property: propLabel,
      preferredTime,
      paymentMethod: payment,
      timestamp: new Date().toLocaleDateString('ar-SA', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    };

    onBookingSuccess(bookingPayload);
  };

  return (
    <section id="booking-section" className="py-20 bg-slate-900 relative overflow-hidden" dir="rtl">
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-amber-400 font-bold tracking-wider text-xs uppercase bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
            خطوة نحو الاستقرار
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-3 font-heading">
            احجز استشارتك أو وحدتك في تاون هاوس الشامخة
          </h2>
          <p className="text-slate-400 mt-2 text-xs sm:text-sm">
            فريق مُيسّر للتطوير العقاري مستعد لتسهيل إجراءات التملك والتمويل البنكي المتوافق مع الشريعة.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">الاسم الثلاثي الكريم *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: محمد بن سعد القحطاني"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">رقم الجوال (واتساب) *</label>
              <PhoneInputWithCountry
                value={phone}
                onChange={setPhone}
                required
                className="bg-slate-900/80 border-slate-700 text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">الوحدة أو النموذج المرغوب</label>
              <select
                value={propertyId}
                onChange={(e) => setPropertyId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-amber-400"
              >
                <option value="">استشارة عامة لكافة النماذج المتاحة</option>
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} — {p.cityDistrict} ({p.area})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">الوقت المفضل للتواصل</label>
              <div className="grid grid-cols-3 gap-2">
                {['صباحاً (9 - 12)', 'ظهراً (1 - 4)', 'عصراً (4 - 9)'].map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setPreferredTime(time.split(' ')[0])}
                    className={`py-2 px-1 text-center rounded-xl text-xs font-medium border transition ${preferredTime === time.split(' ')[0]
                        ? 'bg-amber-400/20 text-amber-300 border-amber-400/60 font-bold'
                        : 'bg-slate-900/50 text-slate-400 border-slate-700 hover:text-white'
                      }`}
                  >
                    {time.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">آلية الشراء المفضلة</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                'تمويل بنكي مدعوم',
                'دفع نقدي كامل (كاش)',
              ].map((opt) => (
                <label
                  key={opt}
                  className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer text-xs transition ${payment === opt
                      ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300'
                      : 'bg-slate-900/40 border-slate-700 text-slate-400 hover:text-slate-300'
                    }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={opt}
                    checked={payment === opt}
                    onChange={(e) => setPayment(e.target.value)}
                    className="text-emerald-500 focus:ring-0"
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">ملاحظات أو استفسارات إضافية</label>
            <textarea
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="هل لديك بنك مفضل، أو تفاصيل خاصة بتمويل سكني؟"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400 resize-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition disabled:opacity-60"
            >
              {isSubmitting ? 'جاري إرسال الطلب...' : 'تأكيد إرسال الطلب وحجز موعد استشارة'}
            </button>
            <p className="text-center text-[11px] text-slate-400 mt-3">
              معلوماتك محمية ومشفرة وفق أعلى معايير الخصوصية السعودية.
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
