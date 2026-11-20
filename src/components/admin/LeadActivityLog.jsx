import { useState } from 'react';
import { Send, Clock, UserCheck } from 'lucide-react';

const roleLabels = {
  super_admin: 'الإدارة العليا',
  admin: 'مدير النظام',
  sales: 'مستشار مبيعات',
  receptionist: 'الاستقبال',
  editor: 'محرر محتوى',
};

export default function LeadActivityLog({ activities = [], onAddActivity, saving = false }) {
  const [note, setNote] = useState('');
  const [nextDate, setNextDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!note.trim() || saving) return;
    onAddActivity(note.trim(), nextDate || null);
    setNote('');
    setNextDate('');
  };

  const sortedActivities = [...activities].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="space-y-3.5">
      <form onSubmit={handleSubmit} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
        <label className="block text-xs font-bold text-slate-800">إضافة سجل متابعة جديد</label>
        <textarea
          rows={2}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="تفاصيل الاتصال، نتيجة المعاينة، أو متطلبات العميل..."
          className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-800 resize-none"
        />
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>موعد المتابعة القادمة:</span>
            <input
              type="date"
              value={nextDate}
              onChange={(e) => setNextDate(e.target.value)}
              className="px-2 py-1 text-xs rounded bg-white border border-slate-200 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
            />
          </div>
          <button
            type="submit"
            disabled={!note.trim() || saving}
            className="py-1.5 px-3 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 disabled:opacity-50 shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{saving ? 'جاري الإضافة...' : 'تسجيل الملاحظة'}</span>
          </button>
        </div>
      </form>

      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {sortedActivities.length === 0 ? (
          <p className="text-center py-6 text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            لا توجد ملاحظات متابعة مسجلة حتى الآن.
          </p>
        ) : (
          sortedActivities.map((act, idx) => (
            <div key={idx} className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs shadow-xs space-y-1">
              <div className="flex items-center justify-between gap-2 text-slate-500 text-[11px]">
                <div className="flex items-center gap-1 font-medium text-slate-700">
                  <UserCheck className="w-3 h-3 text-emerald-800" />
                  <span>{act.authorName}</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 rounded text-slate-600">
                    {roleLabels[act.authorRole] || act.authorRole}
                  </span>
                </div>
                <time className="font-mono text-[10px]" dir="ltr">
                  {new Date(act.createdAt).toLocaleString('ar-SA', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  })}
                </time>
              </div>
              <p className="text-slate-800 text-xs leading-relaxed whitespace-pre-wrap">{act.note}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}