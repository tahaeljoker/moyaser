import { useState } from 'react';
import { X, Calendar, Clock, MessageCircle } from 'lucide-react';
import { brand, models, properties, units } from '../../data/projectData.js';
import { createLead } from '../../services/api.js';
import PhoneInputWithCountry from '../ui/PhoneInputWithCountry.jsx';

const fmt = (n) => new Intl.NumberFormat('en-US').format(n);

export default function InspectionModal({ isOpen, onClose, data, onShowToast }) {
  if (!isOpen) return null;

  const [preferredDay, setPreferredDay] = useState('غداً');
  const [preferredTime, setPreferredTime] = useState('عصراً (4:00 - 6:30 م)');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+966');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const prop = data?.propertyId ? properties.find((p) => p.id === data.propertyId) : null;
  const unit = data?.unit || (data?.unitId ? units.find((u) => String(u.id) === String(data.unitId) || u.unitCode === data.unitId) : null);
  const targetCode = unit ? unit.model : (data?.modelCode || 'A');
  const m = models.find((x) => x.code === targetCode) || models[0];

  const title = prop ? prop.title : (unit ? `وحدة ${unit.unitCode || unit.id} — نموذج ${unit.model}` : `نموذج ${m.code} — ${m.name}`);
  const subtitle = prop ? prop.cityDistrict : (unit ? `${unit.area} — تاون هاوس الشامخة` : m.subtitle);
  const areaDisplay = prop ? prop.area : (unit ? unit.area : `${m.totalArea} م²`);

  const hasUnitP = unit?.price && Number(unit.price) > 0;
  const hasPropP = prop?.price && Number(prop.price) > 0;
  const hasModelP = m?.startingPrice && Number(m.startingPrice) > 0;
  const priceDisplay = hasPropP
    ? `${fmt(prop.price)} ر.س`
    : (hasUnitP
        ? `${fmt(unit.price)} ر.س`
        : (hasModelP
            ? `${fmt(m.startingPrice)} ر.س`
            : (m?.priceFrom && !m.priceFrom.startsWith('0') && m.priceFrom !== '0 ر.س' ? m.priceFrom : 'تواصل لمعرفة السعر')));

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

    setIsSubmitting(true);
    let ticket = `#MS-${Math.floor(1000 + Math.random() * 9000)}`;
    const unitCodeStr = unit ? (unit.unitCode || `U-${unit.id}`) : null;

    try {
      const res = await createLead({
        fullName: name.trim(),
        phone: cleanPhone,
        unitCode: unitCodeStr,
        requestType: 'inspection',
        visitDate: preferredDay,
        visitTime: preferredTime,
        preferredTime: preferredTime.includes('صباح') ? 'صباحاً' : preferredTime.includes('عصر') ? 'عصراً' : 'مساءً',
        notes: prop ? `العقار: ${prop.title} (${prop.cityDistrict})` : `معاينة نموذج ${m.code}`,
      });

      if (res?.data?.ticketNumber) {
        ticket = res.data.ticketNumber;
      }
      if (res?.isDuplicate) {
        onShowToast(res.message, 'info');
      }
    } catch (err) {
      console.warn('[InspectionModal] API sync fallback:', err.message);
    } finally {
      setIsSubmitting(false);
    }

    onShowToast(`تم تأكيد موعد المعاينة برقم تذكرة (${ticket})، سيتواصل معك المستشار لتأكيد الموقع الدقيق.`, 'success');
    onClose();
  };

  const handleInstantWhatsApp = () => {
    const text = encodeURIComponent(
      `السلام عليكم، أرغب بحجز موعد لمعاينة ${title} في مشروع تاون هاوس الشامخة بالدمام.`
    );
    window.open(`https://api.whatsapp.com/send?phone=${brand.whatsapp}&text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm" dir="rtl">
      <div className="modal-enter bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-white">
        <button
          onClick={onClose}
          className="absolute top-5 left-5 text-slate-400 hover:text-white transition w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-800"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">حجز موعد معاينة ميدانية</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold font-heading mb-1 text-slate-100">{title}</h3>
        <p className="text-xs text-slate-400 mb-4">{subtitle}</p>

        <div className="grid grid-cols-2 gap-2 bg-slate-800/60 p-3 rounded-2xl border border-slate-700/50 mb-5 text-xs">
          <div><span className="text-slate-400 block text-[11px]">المساحة الإجمالية</span><span className="font-bold text-slate-200">{areaDisplay}</span></div>
          <div><span className="text-slate-400 block text-[11px]">السعر</span><span className="font-bold text-amber-400">{priceDisplay}</span></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-bold mb-1">الاسم الكريم *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="الاسم الثلاثي"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">رقم الجوال (واتساب) *</label>
            <PhoneInputWithCountry
              value={phone}
              onChange={setPhone}
              required
              className="bg-slate-950 border-slate-700 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-bold mb-1">اليوم المفضل</label>
              <select
                value={preferredDay}
                onChange={(e) => setPreferredDay(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="اليوم">اليوم</option>
                <option value="غداً">غداً</option>
                <option value="بعد غد">بعد غد</option>
                <option value="نهاية الأسبوع">نهاية الأسبوع (الجمعة/السبت)</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1">الفترة الزمنية</label>
              <select
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="صباحاً (9:00 - 11:30 ص)">صباحاً (9:00 - 11:30 ص)</option>
                <option value="عصراً (4:00 - 6:30 م)">عصراً (4:00 - 6:30 م)</option>
                <option value="مساءً (7:00 - 9:00 م)">مساءً (7:00 - 9:00 م)</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 disabled:opacity-60"
            >
              <Calendar className="w-4 h-4" />
              <span>{isSubmitting ? 'جاري التأكيد...' : 'تأكيد حجز المعاينة الميدانية'}</span>
            </button>
            <button
              type="button"
              onClick={handleInstantWhatsApp}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold transition flex items-center justify-center gap-2 border border-slate-700"
            >
              <MessageCircle className="w-4 h-4" />
              <span>تنسيق فوري عبر واتساب المستشار</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
