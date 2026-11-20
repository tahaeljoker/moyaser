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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="modal-enter bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative text-slate-100">
        <button onClick={onClose} className="absolute top-5 left-5 text-slate-400 hover:text-white transition w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-800" aria-label="إغلاق">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-emerald-900/60 border border-emerald-700/60 flex items-center justify-center text-amber-300">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold font-heading text-white">إضافة وحدة سكنية جديدة للمشروع</h3>
            <p className="text-xs text-slate-400">إدراج تفاصيل ومواصفات الوحدة في قاعدة البيانات الحية.</p>
          </div>
        </div>

        {error && <div className="mb-4 p-3 bg-red-950/60 border border-red-800/80 rounded-xl text-xs text-red-300 font-bold">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-bold mb-1">كود الوحدة *</label>
              <input type="text" required placeholder="مثال: U-25" value={form.unitCode} onChange={(e) => setForm({ ...form, unitCode: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white uppercase font-mono focus:outline-none focus:ring-2 focus:ring-emerald-700" />
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1">النموذج المعماري *</label>
              <select value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-700 font-medium">
                {['A', 'B', 'C', 'D', 'E', 'F'].map((m) => (
                  <option key={m} value={m}>نموذج {m}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-bold mb-1">نوع العقار</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-700 font-medium">
                <option value="townhouse">تاون هاوس (دوبلكس)</option>
                <option value="apartment">شقة سكنية فاخرة</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1">حالة الوحدة</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-700 font-medium">
                <option value="available">متاح للبيع</option>
                <option value="reserved">محجوز</option>
                <option value="sold">تم البيع والإفراغ</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-bold mb-1">المساحة الإجمالية</label>
              <input type="text" placeholder="مثال: 310 م²" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-700" />
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1">السعر الصافي (ر.س) *</label>
              <input type="number" required placeholder="1450000" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-700" />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">الواجهة والشارع</label>
            <input type="text" placeholder="مثال: واجهة شمالية شارع 18م" value={form.facade} onChange={(e) => setForm({ ...form, facade: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-700" />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">رابط صورة الوحدة (اختياري)</label>
            <input type="url" placeholder="https://... أو /media/exterior-day.webp" value={form.mediaUrl} onChange={(e) => setForm({ ...form, mediaUrl: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-700 text-left" dir="ltr" />
          </div>

          <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
            <button type="submit" disabled={loading} className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white font-bold transition flex items-center justify-center gap-2 shadow-sm active:scale-95">
              <Building className="w-4 h-4 text-amber-300" />
              <span>{loading ? 'جاري الحفظ...' : 'إضافة الوحدة للمخزون'}</span>
            </button>
            <button type="button" onClick={onClose} className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition">إلغاء</button>
          </div>
        </form>
      </div>
    </div>
  );
}
