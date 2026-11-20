import { useState } from 'react';
import { X, UserPlus, Phone, Home, FileText } from 'lucide-react';
import { createAdminLead } from '../../services/api.js';

export default function AddWalkInLeadModal({ isOpen, onClose, onLeadCreated }) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
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

    const cleanPhone = formData.phone.trim().replace(/[\s-]/g, '');
    if (!/^05[0-9]{8}$/.test(cleanPhone)) {
      setError('رقم الجوال يجب أن يبدأ بـ 05 ويتكون من 10 أرقام.');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
      <div className="modal-enter bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-xl relative text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-slate-400 hover:text-white transition w-7 h-7 rounded-lg flex items-center justify-center hover:bg-slate-800"
          aria-label="إغلاق"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-emerald-400">
            <UserPlus className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-heading text-white">تسجيل عميل جديد</h3>
            <p className="text-xs text-slate-400">إضافة بيانات العميل وتعيين مستشار المبيعات.</p>
          </div>
        </div>

        {error && (
          <div className="mb-3.5 p-2.5 bg-rose-950/70 border border-rose-800/80 rounded-xl text-xs text-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-300 font-bold mb-1">اسم العميل *</label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="مثال: تركي الدوسري"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-700"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-bold mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>رقم الجوال *</span>
              </label>
              <input
                type="text"
                required
                dir="ltr"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="05XXXXXXXX"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-700 font-mono text-left"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1 flex items-center gap-1">
                <Home className="w-3.5 h-3.5 text-slate-400" />
                <span>الوحدة (اختياري)</span>
              </label>
              <input
                type="text"
                value={formData.unitCode}
                onChange={(e) => setFormData({ ...formData, unitCode: e.target.value })}
                placeholder="مثال: U-01"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-amber-300 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-700 font-mono uppercase"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">حالة الطلب *</label>
            <select
              value={formData.stage}
              onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-1 focus:ring-emerald-700"
            >
              <option value="prospective">استفسار</option>
              <option value="reserved">حجز (بانتظار البنك)</option>
              <option value="closed">تم الشراء</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>ملاحظات</span>
            </label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="أي تفاصيل تخص موعد المعاينة أو رغبات العميل..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-700 resize-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold transition flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-60"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{loading ? 'جاري الحفظ...' : 'حفظ العميل'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-medium transition"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
