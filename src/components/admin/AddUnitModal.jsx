import { useState } from 'react';
import { X, Building } from 'lucide-react';
import { createUnit } from '../../services/api.js';

export default function AddUnitModal({ isOpen, onClose, onUnitCreated }) {
  const [form, setForm] = useState({
    unitCode: '',
    model: 'A',
    type: 'townhouse',
    area: '250 م²',
    facade: 'شمالية شارع 18م',
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
      setError('يرجى تحديد كود الوحدة وسعر البيع.');
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
      setError(err.message || 'تعذر إضافة الوحدة.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
      <div className="modal-enter bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-xl relative text-slate-100">
        <button onClick={onClose} className="absolute top-4 left-4 text-slate-400 hover:text-white transition w-7 h-7 rounded-lg flex items-center justify-center hover:bg-slate-800" aria-label="إغلاق">
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-amber-300">
            <Building className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-heading text-white">إضافة وحدة جديدة</h3>
            <p className="text-xs text-slate-400">إدراج مواصفات الوحدة في النظام.</p>
          </div>
        </div>

        {error && <div className="mb-3.5 p-2.5 bg-rose-950/70 border border-rose-800/80 rounded-xl text-xs text-rose-200">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-bold mb-1">كود الوحدة *</label>
              <input type="text" required placeholder="مثال: U-25" value={form.unitCode} onChange={(e) => setForm({ ...form, unitCode: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-amber-300 uppercase font-mono font-bold focus:outline-none focus:ring-1 focus:ring-emerald-700" />
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1">النموذج المعماري *</label>
              <select value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-1 focus:ring-emerald-700">
                {['A', 'B', 'C', 'D', 'E', 'F'].map((m) => (
                  <option key={m} value={m}>نموذج {m}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-bold mb-1">نوع العقار</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-1 focus:ring-emerald-700">
                <option value="townhouse">تاون هاوس</option>
                <option value="apartment">شقة سكنية</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1">الحالة</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-1 focus:ring-emerald-700">
                <option value="available">متاح</option>
                <option value="reserved">محجوز</option>
                <option value="sold">تم البيع</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-bold mb-1">المساحة</label>
              <input type="text" placeholder="مثال: 310 م²" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-1 focus:ring-emerald-700" />
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1">السعر الصافي (ر.س) *</label>
              <input type="number" required placeholder="1450000" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono font-bold focus:outline-none focus:ring-1 focus:ring-emerald-700" />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">الواجهة والشارع</label>
            <input type="text" placeholder="مثال: واجهة شمالية شارع 18م" value={form.facade} onChange={(e) => setForm({ ...form, facade: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-1 focus:ring-emerald-700" />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">رابط الصورة (اختياري)</label>
            <input type="url" placeholder="https://... أو /media/exterior-day.webp" value={form.mediaUrl} onChange={(e) => setForm({ ...form, mediaUrl: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:ring-1 focus:ring-emerald-700 text-left" dir="ltr" />
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
            <button type="submit" disabled={loading} className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold transition flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-60">
              <Building className="w-3.5 h-3.5" />
              <span>{loading ? 'جاري الحفظ...' : 'حفظ الوحدة'}</span>
            </button>
            <button type="button" onClick={onClose} className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-medium transition">إلغاء</button>
          </div>
        </form>
      </div>
    </div>
  );
}
