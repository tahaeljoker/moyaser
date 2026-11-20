import { useState } from 'react';
import { X, Building, DollarSign, Home } from 'lucide-react';
import { createUnit } from '../../services/api.js';

export default function AddUnitModal({ isOpen, onClose, onUnitCreated }) {
  const [form, setForm] = useState({
    unitCode: '',
    model: 'A',
    type: 'townhouse',
    area: '250.75 م²',
    facade: 'شمالية شارع 20م',
    price: '',
    status: 'available',
    mediaUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!form.unitCode || !form.price) {
      setError('كود الوحدة وسعر البيع مطلوبان.');
      return;
    }

    try {
      setLoading(true);
      const res = await createUnit({
        ...form,
        price: Number(form.price),
        media: form.mediaUrl ? [form.mediaUrl.trim()] : [],
      });
      if (res?.success) {
        if (onUnitCreated) onUnitCreated(res.data);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'فشل إنشاء الوحدة.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="modal-enter bg-slate-900 border border-slate-800/90 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative text-slate-100 overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-600 via-amber-400 to-emerald-600" />

        <button onClick={onClose} className="absolute top-5 left-5 text-slate-400 hover:text-white transition w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-800" aria-label="إغلاق">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-800/80">
          <div className="w-11 h-11 rounded-2xl bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-amber-300 shadow-inner">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold font-heading text-white">إضافة وحدة سكنية جديدة للمشروع</h3>
            <p className="text-xs text-slate-400 mt-0.5">إدراج تفاصيل ومواصفات الوحدة في قاعدة البيانات الحية.</p>
          </div>
        </div>

        {error && <div className="mb-4 p-3.5 bg-rose-950/70 border border-rose-800/80 rounded-2xl text-xs text-rose-200 font-bold">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-slate-300 font-bold mb-1.5">كود الوحدة *</label>
              <input type="text" required placeholder="مثال: U-25" value={form.unitCode} onChange={(e) => setForm({ ...form, unitCode: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-amber-300 uppercase font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-700" />
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1.5">النموذج المعماري *</label>
              <select value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-700 font-medium">
                {['A', 'B', 'C', 'D', 'E', 'F'].map((m) => (
                  <option key={m} value={m}>نموذج {m}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-slate-300 font-bold mb-1.5">نوع العقار</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-700 font-medium">
                <option value="townhouse">تاون هاوس (دوبلكس)</option>
                <option value="apartment">شقة سكنية فاخرة</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1.5">حالة الوحدة</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-700 font-medium">
                <option value="available">متاح للبيع</option>
                <option value="reserved">محجوز</option>
                <option value="sold">تم البيع والإفراغ</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-slate-300 font-bold mb-1.5">المساحة الإجمالية</label>
              <input type="text" placeholder="مثال: 310 م²" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-700" />
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1.5">السعر الصافي (ر.س) *</label>
              <input type="number" required placeholder="1450000" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-emerald-400 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-700" />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1.5">الواجهة والشارع</label>
            <input type="text" placeholder="مثال: واجهة شمالية شارع 18م" value={form.facade} onChange={(e) => setForm({ ...form, facade: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-700" />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1.5">رابط صورة الوحدة (اختياري)</label>
            <input type="url" placeholder="https://... أو /media/exterior-day.webp" value={form.mediaUrl} onChange={(e) => setForm({ ...form, mediaUrl: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-700 text-left" dir="ltr" />
          </div>

          <div className="flex items-center gap-2.5 pt-3 border-t border-slate-800/80">
            <button type="submit" disabled={loading} className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-900 to-emerald-800 hover:from-emerald-800 hover:to-emerald-700 text-white font-bold transition flex items-center justify-center gap-2 shadow-md border border-emerald-700/60 active:scale-95">
              <Building className="w-4 h-4 text-amber-300" />
              <span>{loading ? 'جاري الحفظ...' : 'إضافة الوحدة للمخزون'}</span>
            </button>
            <button type="button" onClick={onClose} className="py-3 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 font-bold transition border border-slate-700/70">إلغاء</button>
          </div>
        </form>
      </div>
    </div>
  );
}
