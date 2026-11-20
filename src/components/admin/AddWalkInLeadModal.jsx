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
      setError(err.message || 'فشل تسجيل العميل، يرجى التحقق من المدخلات.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="modal-enter bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-5 left-5 text-slate-400 hover:text-white transition w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-800"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-emerald-900/60 border border-emerald-700/60 flex items-center justify-center text-amber-300">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold font-heading text-white">تسجيل عميل جديد (زيارة / اتصال)</h3>
            <p className="text-xs text-slate-400">إدراج العميل مباشرة وتوجيهه بالتناوب إلى مستشاري المبيعات.</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-950/60 border border-red-800/80 rounded-xl text-xs text-red-300 font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-bold mb-1">اسم العميل الكريم *</label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="مثال: عبدالله محمد الدوسري"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-bold mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>رقم الجوال السعودي *</span>
              </label>
              <input
                type="text"
                required
                dir="ltr"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="05XXXXXXXX"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-700 font-mono text-left"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1 flex items-center gap-1">
                <Home className="w-3.5 h-3.5 text-amber-400" />
                <span>كود الوحدة (اختياري)</span>
              </label>
              <input
                type="text"
                value={formData.unitCode}
                onChange={(e) => setFormData({ ...formData, unitCode: e.target.value })}
                placeholder="مثال: U-01"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-700 font-mono uppercase"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">مرحلة العميل الحالية *</label>
            <select
              value={formData.stage}
              onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-700 font-medium"
            >
              <option value="prospective">استفسار / جمع بيانات</option>
              <option value="reserved">حجز بانتظار التمويل البنكي</option>
              <option value="closed">تم الشراء (بانتظار التسليم)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>ملاحظات وتفاصيل الزيارة</span>
            </label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="اكتب أي متطلبات خاصة بالعميل أو تفاصيل الموعد..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-700 resize-none"
            />
          </div>

          <div className="flex items-center gap-2.5 pt-3 border-t border-slate-800">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-4 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white font-bold transition flex items-center justify-center gap-2 shadow-sm active:scale-95"
            >
              <UserPlus className="w-4 h-4 text-amber-300" />
              <span>{loading ? 'جاري التسجيل...' : 'حفظ وإدراج العميل'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
