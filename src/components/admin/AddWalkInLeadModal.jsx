import { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import { createAdminLead } from '../../services/api.js';
import PhoneInputWithCountry from '../ui/PhoneInputWithCountry.jsx';

export default function AddWalkInLeadModal({ isOpen, onClose, onLeadCreated }) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '+966',
    unitCode: '',
    stage: 'prospective',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const cleanPhone = String(formData.phone || '').trim().replace(/[\s\-()]/g, '');
    if (!cleanPhone || !/^\+?[1-9]\d{7,14}$/.test(cleanPhone)) {
      setError('رقم الجوال يجب أن يكون رقماً دولياً صالحاً من 8 إلى 15 رقماً.');
      return;
    }

    try {
      setLoading(true);
      const res = await createAdminLead({
        ...formData,
        phone: cleanPhone,
        unitCode: formData.unitCode ? formData.unitCode.toUpperCase().trim() : null,
      });

      if (res?.success) {
        if (onLeadCreated) onLeadCreated(res.data);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'تعذر تسجيل العميل، يرجى التأكد من البيانات.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="modal-enter bg-white border border-slate-200 rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-xl relative text-slate-900">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-slate-400 hover:text-slate-700 transition w-7 h-7 rounded-lg flex items-center justify-center hover:bg-slate-100"
          aria-label="إغلاق"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-800">
            <UserPlus className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-heading text-slate-900">تسجيل زيارة أو اتصال عميل</h3>
            <p className="text-[11px] text-slate-500">إضافة طلب عميل لمتابعة التمويل والمعاينة.</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">الاسم الثلاثي للعميل *</label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="مثال: فهد بن عبدالعزيز"
              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-800"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">رقم الجوال الدولي *</label>
            <PhoneInputWithCountry
              value={formData.phone}
              onChange={(p) => setFormData({ ...formData, phone: p })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-slate-700 font-bold mb-1">كود الوحدة (اختياري)</label>
              <input
                type="text"
                placeholder="مثال: A-01"
                value={formData.unitCode}
                onChange={(e) => setFormData({ ...formData, unitCode: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 font-mono uppercase focus:outline-none focus:ring-1 focus:ring-emerald-800"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">مرحلة العميل</label>
              <select
                value={formData.stage}
                onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-800"
              >
                <option value="prospective">استفسار</option>
                <option value="reserved">حجز (بانتظار البنك)</option>
                <option value="closed">تم الشراء</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">ملاحظات الزيارة أو الاتصال</label>
            <textarea
              rows="2"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="تفاصيل التمويل، البنك المفضل، الميزانية..."
              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-800 resize-none"
            />
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold transition shadow-xs disabled:opacity-60"
            >
              {loading ? 'جاري التسجيل...' : 'تسجيل العميل في النظام'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
