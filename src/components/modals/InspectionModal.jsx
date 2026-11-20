import { useState } from 'react';
import { X, Calendar, Clock, MessageCircle } from 'lucide-react';
import { brand, models, properties, units } from '../../data/projectData.js';
import { createLead } from '../../services/api.js';

const fmt = (n) => new Intl.NumberFormat('en-US').format(n);

export default function InspectionModal({ isOpen, onClose, data, onShowToast }) {
  if (!isOpen) return null;

  const [preferredDay, setPreferredDay] = useState('غداً');
  const [preferredTime, setPreferredTime] = useState('عصراً (4:00 - 6:30 م)');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const prop = data?.propertyId ? properties.find((p) => p.id === data.propertyId) : null;
  const unit = data?.unitId ? units.find((u) => u.id === Number(data.unitId)) : null;
  const targetCode = unit ? unit.model : (data?.modelCode || 'A');
  const m = models.find((x) => x.code === targetCode) || models[0];

  const title = prop ? prop.title : (unit ? `وحدة #${unit.id} — نموذج ${unit.model}` : `نموذج ${m.code} — ${m.name}`);
  const subtitle = prop ? prop.cityDistrict : (unit ? `${unit.area} — تاون هاوس الشامخة` : m.subtitle);
  const areaDisplay = prop ? prop.area : (unit ? unit.area : `${m.totalArea} م²`);
  const priceDisplay = prop ? `${fmt(prop.price)} ر.س` : (unit ? `${fmt(unit.price)} ر.س` : m.priceFrom);
  const typeDisplay = prop ? prop.category : (m ? m.floors.split('+')[0] : 'سكن فاخر');

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
    } catch (err) {
      console.warn('[InspectionModal] API sync fallback:', err.message);
    } finally {
      setIsSubmitting(false);
    }

    let itemInfo = '';
    if (prop) {
      itemInfo = `العقار المطلوب: ${prop.title}\nالموقع: ${prop.cityDistrict}\nالمساحة: ${prop.area}\nالسعر: ${fmt(prop.price)} ر.س`;
    } else if (unit) {
      itemInfo = `المشروع: تاون هاوس الشامخة\nالوحدة: وحدة رقم (${unit.id}) — نموذج ${unit.model}\nالمساحة: ${unit.area}\nالسعر: ${fmt(unit.price)} ر.س`;
    } else {
      itemInfo = `المشروع: تاون هاوس الشامخة\nالنموذج: نموذج ${m.code} — ${m.name}\nالمساحة: ${m.totalArea} م²`;
    }

    const msg = `السلام عليكم ورحمة الله وبركاته،\nأود حجز موعد معاينة ميدانية عبر موقع شركة ${brand.developer}:\n──────────────────────\n${itemInfo}\nاليوم المفضل: ${preferredDay}\nالتوقيت المفضل: ${preferredTime}\nالاسم: ${name.trim()}\nرقم الجوال: ${cleanPhone}\nرقم التذكرة: ${ticket}\n──────────────────────\nيرجى تأكيد الاستقبال والموعد.`;

    try {
      const existingLeads = JSON.parse(localStorage.getItem('ms_leads') || '[]');
      existingLeads.push({
        ticket,
        name: name.trim(),
        phone: cleanPhone,
        propertyId: prop?.id || null,
        unitId: unit?.id || null,
        model: m?.code || null,
        preferredDay,
        preferredTime,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('ms_leads', JSON.stringify(existingLeads));
    } catch {
      // Ignore localStorage errors
    }

    onShowToast(`تم تسجيل طلب المعاينة بنجاح (${ticket}). جاري التحويل للواتساب...`, 'success');
    onClose();
    window.open(`https://api.whatsapp.com/send?phone=${brand.whatsapp}&text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="modal-enter bg-white rounded-3xl border border-slate-200 max-w-xl w-full p-6 sm:p-8 shadow-2xl relative text-slate-900 my-8">
        <button
          onClick={onClose}
          className="absolute top-5 left-5 text-slate-400 hover:text-slate-700 transition w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-5 pb-4 border-b border-slate-100">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/80 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            حجز موعد معاينة ميدانية رسمية
          </div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-xl sm:text-2xl font-black font-heading text-slate-900">{title}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
            </div>
            {unit && (
              <div className="text-left flex-shrink-0 bg-slate-900 text-white px-3 py-1.5 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 block">الوحدة المحددة</span>
                <span className="text-sm font-black text-amber-400 font-heading">#{unit.id}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-4">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-500 block">المساحة</span>
              <span className="text-xs font-bold text-slate-900 font-heading">{areaDisplay}</span>
            </div>
            <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100">
              <span className="text-[10px] text-emerald-800 block">السعر</span>
              <span className="text-xs font-bold text-emerald-950 font-heading">{priceDisplay}</span>
            </div>
            <div className="bg-amber-50/70 p-2.5 rounded-xl border border-amber-100 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-amber-800 block">التصنيف</span>
              <span className="text-xs font-bold text-amber-950 font-heading truncate">{typeDisplay}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>اليوم المفضل للمعاينة الميدانية:</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['اليوم', 'غداً', 'نهاية الأسبوع'].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setPreferredDay(d)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition text-center ${
                    preferredDay === d
                      ? 'bg-emerald-900 text-white border-emerald-900'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>الفترة الزمنية المناسبة:</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['عصراً (4:00 - 6:30 م)', 'مساءً (6:30 - 9:00 م)'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setPreferredTime(t)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition text-center ${
                    preferredTime === t
                      ? 'bg-emerald-900 text-white border-emerald-900'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label htmlFor="insp-name" className="block text-xs font-bold text-slate-700 mb-1">
                الاسم الكريم *
              </label>
              <input
                type="text"
                id="insp-name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: محمد بن سعد"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-800 bg-slate-50/50"
              />
            </div>
            <div>
              <label htmlFor="insp-phone" className="block text-xs font-bold text-slate-700 mb-1">
                رقم الجوال (+966) *
              </label>
              <input
                type="tel"
                id="insp-phone"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="05xxxxxxxx"
                dir="ltr"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-right focus:outline-none focus:ring-2 focus:ring-emerald-800 bg-slate-50/50"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-900 to-emerald-800 hover:from-emerald-800 hover:to-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-75"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{isSubmitting ? 'جاري تسجيل الطلب...' : 'تأكيد موعد المعاينة عبر واتساب المبيعات'}</span>
            </button>
            <p className="text-[11px] text-slate-400 text-center mt-2">
              سيتم فتح محادثة فورية مباشرة مع مسؤول المبيعات بتفاصيل طلبك ورقم التذكرة.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
