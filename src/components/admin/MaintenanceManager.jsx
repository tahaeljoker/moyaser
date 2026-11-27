import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Save, FileText, CheckCircle2, AlertCircle, ShieldCheck, ShieldAlert } from 'lucide-react';
import { getToken } from '../../services/api.js';

const envUrl = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = (import.meta.env.PROD && (!envUrl || envUrl.includes('localhost'))) ? '/api' : (envUrl || '/api');

const STATUS_OPTIONS = [
  { value: 'new', label: 'جديد' },
  { value: 'scheduled', label: 'مجدول' },
  { value: 'inprogress', label: 'قيد التنفيذ' },
  { value: 'done', label: 'مكتمل' },
  { value: 'cancelled', label: 'ملغي' },
];

const toLocalDateTimeInput = (isoValue) => {
  if (!isoValue) return '';
  const d = new Date(isoValue);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export default function MaintenanceManager() {
  const [requests, setRequests] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const loadRequests = useCallback(async () => {
    setLoading(true);
    setFeedback({ type: '', message: '' });
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE_URL.replace(/\/$/, '')}/admin/maintenance`, {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'تعذر جلب طلبات الصيانة.');
      const list = Array.isArray(data?.data) ? data.data : [];
      setRequests(list);
      const nextDrafts = {};
      for (const item of list) {
        nextDrafts[item._id] = {
          status: item.status || 'new',
          appointmentDate: toLocalDateTimeInput(item.appointmentDate),
        };
      }
      setDrafts(nextDrafts);
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'فشل تحميل طلبات الصيانة.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const updateDraft = (id, field, value) => {
    setDrafts((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || {}), [field]: value },
    }));
  };

  const handleSave = async (id) => {
    const draft = drafts[id];
    if (!draft) return;
    setSavingId(id);
    setFeedback({ type: '', message: '' });
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE_URL.replace(/\/$/, '')}/admin/maintenance/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          status: draft.status,
          appointmentDate: draft.appointmentDate ? new Date(draft.appointmentDate).toISOString() : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'فشل حفظ التحديث.');
      setRequests((prev) => prev.map((item) => (item._id === id ? data.data : item)));
      setFeedback({ type: 'success', message: 'تم حفظ حالة وموعد طلب الصيانة بنجاح.' });
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'تعذر حفظ التحديث.' });
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 text-slate-900 shadow-xs space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold font-heading text-slate-900">
            طلبات الصيانة ({requests.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            متابعة طلبات صيانة ما بعد البيع وتحديد المواعيد والحالة.
          </p>
        </div>
        <button
          onClick={loadRequests}
          disabled={loading}
          className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-900 transition disabled:opacity-50"
          title="تحديث"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {feedback.message && (
        <div
          className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-xs text-slate-500">جاري تحميل طلبات الصيانة...</div>
      ) : requests.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-500">
          لا توجد طلبات صيانة مسجلة حالياً.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">الوحدة</th>
                <th className="py-3 px-3">العميل</th>
                <th className="py-3 px-3">الوصف والمرفقات</th>
                <th className="py-3 px-3">التحقق</th>
                <th className="py-3 px-3">موعد الزيارة</th>
                <th className="py-3 px-3">الحالة</th>
                <th className="py-3 px-3 text-center">حفظ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {requests.map((item) => {
                const draft = drafts[item._id] || { status: item.status || 'new', appointmentDate: '' };
                const isConfirmed = item.verificationStatus === 'confirmed';
                return (
                  <tr key={item._id} className="hover:bg-slate-50/70 align-top">
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-mono font-bold border border-emerald-200 tabular-nums">
                        {item.unitNumber}
                      </span>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="font-bold text-slate-900">{item.customerName}</div>
                      <div className="text-[11px] text-slate-500 font-mono tabular-nums" dir="ltr">
                        {item.customerPhone}
                      </div>
                    </td>
                    <td className="py-3 px-3 min-w-[220px] max-w-xs space-y-1.5">
                      <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{item.description}</p>
                      {Array.isArray(item.attachments) && item.attachments.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {item.attachments.map((url, idx) => (
                            <a
                              key={url + idx}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-[11px]"
                            >
                              <FileText className="w-3 h-3 text-emerald-700" />
                              <span>مرفق {idx + 1}</span>
                            </a>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      {isConfirmed ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>مؤكد</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>غير مؤكد</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <input
                        type="datetime-local"
                        value={draft.appointmentDate}
                        onChange={(e) => updateDraft(item._id, 'appointmentDate', e.target.value)}
                        dir="ltr"
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 text-[11px] font-mono"
                      />
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <select
                        value={draft.status}
                        onChange={(e) => updateDraft(item._id, 'status', e.target.value)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 text-xs font-medium"
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleSave(item._id)}
                        disabled={savingId === item._id}
                        className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-1 transition disabled:opacity-60"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{savingId === item._id ? 'جاري الحفظ...' : 'حفظ'}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
