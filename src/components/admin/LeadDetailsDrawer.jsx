import { useState, useEffect } from 'react';
import { X, Phone, MessageCircle, Save, CheckCircle2, AlertCircle, Building2, Calendar, DollarSign, ShieldCheck, AlertTriangle } from 'lucide-react';
import LeadActivityLog from './LeadActivityLog.jsx';
import WhatsAppTemplatesBar from './WhatsAppTemplatesBar.jsx';
import { addLeadActivity } from '../../services/api.js';

const banks = ['الراجحي', 'الأهلي', 'الإنماء', 'الرياض', 'البلاد', 'ساب', 'نقدي / كاش', 'أخرى'];
const cancelReasons = ['السعر', 'رفض البنك', 'الموقع', 'لا يرد', 'أخرى'];

const initialForm = (lead) => ({
  stage: lead?.stage || 'prospective',
  cancellationReason: lead?.cancellationReason || '',
  source: lead?.source || 'website',
  assignedAgent: lead?.assignedAgent?._id || lead?.assignedAgent || '',
  nextFollowUpDate: lead?.nextFollowUpDate ? lead.nextFollowUpDate.split('T')[0] : '',
  notes: lead?.notes || '',
  bankName: lead?.financing?.bankName || '',
  depositPaid: Boolean(lead?.financing?.depositPaid),
  depositAmount: lead?.financing?.depositAmount || '',
  expectedDeedDate: lead?.financing?.expectedDeedDate ? lead.financing.expectedDeedDate.split('T')[0] : '',
  handoverStatus: lead?.handover?.status || 'pending_deed',
  finalPrice: lead?.handover?.finalPrice || '',
  deliveredAt: lead?.handover?.deliveredAt ? lead.handover.deliveredAt.split('T')[0] : '',
});

export default function LeadDetailsDrawer({ lead, isOpen, onClose, onUpdateLead, staffList = [], isAdmin = false }) {
  if (!isOpen || !lead) return null;

  const [form, setForm] = useState(() => initialForm(lead));
  const [savingDetails, setSavingDetails] = useState(false);
  const [savingActivity, setSavingActivity] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: null, text: null });

  useEffect(() => { setForm(initialForm(lead)); }, [lead]);

  const isReservationExpired = lead.stage === 'reserved' && !lead.financing?.depositPaid && lead.reservationExpiresAt && new Date(lead.reservationExpiresAt) < new Date();

  const handleSaveDetails = async (e) => {
    e?.preventDefault();
    setSavingDetails(true);
    setStatusMsg({ type: null, text: null });
    try {
      await onUpdateLead(lead._id, {
        stage: form.stage,
        cancellationReason: form.stage === 'cancelled' ? (form.cancellationReason || 'أخرى') : null,
        source: form.source,
        assignedAgent: isAdmin ? (form.assignedAgent || null) : undefined,
        nextFollowUpDate: form.nextFollowUpDate || null,
        notes: form.notes,
        financing: {
          bankName: form.bankName, depositPaid: form.depositPaid,
          depositAmount: Number(form.depositAmount) || 0,
          expectedDeedDate: form.expectedDeedDate || null,
        },
        handover: {
          status: form.handoverStatus, finalPrice: Number(form.finalPrice) || 0, deliveredAt: form.deliveredAt || null,
        },
      });
      setStatusMsg({ type: 'success', text: 'تم حفظ تفاصيل الطلب بنجاح.' });
      setTimeout(() => setStatusMsg({ type: null, text: null }), 3000);
    } catch (err) { setStatusMsg({ type: 'error', text: err.message || 'فشل حفظ التعديلات.' }); }
    finally { setSavingDetails(false); }
  };

  const handleAddActivity = async (note, nextDate) => {
    setSavingActivity(true);
    try {
      const res = await addLeadActivity(lead._id, note, nextDate);
      if (res?.data) {
        if (nextDate) setForm((p) => ({ ...p, nextFollowUpDate: nextDate }));
        await onUpdateLead(lead._id, res.data);
      }
    } catch (err) { alert(err.message || 'فشل إضافة سجل المتابعة.'); }
    finally { setSavingActivity(false); }
  };

  const openWhatsApp = () => {
    const digits = lead.phone.replace(/\D/g, '').replace(/^0/, '966');
    window.open(`https://api.whatsapp.com/send?phone=${digits}&text=${encodeURIComponent(`السلام عليكم أستاذ ${lead.fullName}، بخصوص طلبك (${lead.ticketNumber}) لدى شركة مُيسّر للتطوير العقاري.`)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-start bg-slate-900/40 backdrop-blur-xs transition-opacity" dir="rtl">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col text-slate-900 border-l border-slate-200">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-xs bg-slate-200/70 text-slate-800 px-2 py-0.5 rounded border border-slate-300/60">{lead.ticketNumber}</span>
              <h2 className="text-sm sm:text-base font-bold font-heading text-slate-900">{lead.fullName}</h2>
            </div>
            <p className="text-[11px] text-slate-500 font-mono mt-0.5" dir="ltr">{lead.phone}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition" aria-label="إغلاق"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs">
          {statusMsg.text && (
            <div className={`p-2.5 rounded-xl text-xs font-medium border flex items-center gap-2 ${statusMsg.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-700'}`}>
              {statusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-700" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
              <span>{statusMsg.text}</span>
            </div>
          )}

          {isReservationExpired && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2 font-medium">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>تنبيه: انتهت مهلة الحجز المحددة (7 أيام) دون تأكيد سداد العربون. يرجى المتابعة مع العميل أو تحرير الوحدة.</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button onClick={openWhatsApp} className="py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold flex items-center justify-center gap-1.5 transition">
              <MessageCircle className="w-4 h-4" /><span>محادثة مباشرة</span>
            </button>
            <a href={`tel:${lead.phone}`} className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-bold flex items-center justify-center gap-1.5 transition text-center">
              <Phone className="w-4 h-4 text-slate-500" /><span>اتصال هاتفي</span>
            </a>
          </div>

          <WhatsAppTemplatesBar lead={lead} />

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <h3 className="font-bold text-slate-800 flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5 text-emerald-800" /><span>بيانات الطلب الأساسية</span></h3>
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-slate-600 mb-1">المرحلة الحالية</label>
                <select value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value })} className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 font-bold focus:outline-none focus:ring-1 focus:ring-emerald-800">
                  <option value="prospective">استفسار</option>
                  <option value="reserved">حجز (بانتظار البنك)</option>
                  <option value="closed">تم الشراء</option>
                  <option value="cancelled">ملغي</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-600 mb-1">مصدر الطلب</label>
                <select value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-800">
                  <option value="website">الموقع الإلكتروني</option>
                  <option value="walk_in">زيارة للمكتب</option>
                  <option value="phone">اتصال هاتفي</option>
                  <option value="whatsapp">محادثة واتساب</option>
                </select>
              </div>
            </div>

            {form.stage === 'cancelled' && (
              <div>
                <label className="block text-rose-700 mb-1 font-bold">سبب الإلغاء</label>
                <select value={form.cancellationReason} onChange={(e) => setForm({ ...form, cancellationReason: e.target.value })} className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-rose-300 text-rose-900 focus:outline-none focus:ring-1 focus:ring-rose-600">
                  <option value="">اختر سبب الإلغاء...</option>
                  {cancelReasons.map((r) => (<option key={r} value={r}>{r}</option>))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-slate-600 mb-1">المسؤول عن الطلب</label>
                {isAdmin ? (
                  <select value={form.assignedAgent} onChange={(e) => setForm({ ...form, assignedAgent: e.target.value })} className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-800">
                    <option value="">غير مسند</option>
                    {staffList.map((s) => (<option key={s.id} value={s.id}>{s.name} ({s.role === 'sales' ? 'مبيعات' : s.role})</option>))}
                  </select>
                ) : (
                  <div className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700">{lead.assignedAgentName || 'مستشار المبيعات'}</div>
                )}
              </div>
              <div>
                <label className="block text-slate-600 mb-1 flex items-center gap-1"><Calendar className="w-3 h-3 text-slate-400" /><span>موعد المتابعة القادمة</span></label>
                <input type="date" value={form.nextFollowUpDate} onChange={(e) => setForm({ ...form, nextFollowUpDate: e.target.value })} className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-800" />
              </div>
            </div>
          </div>

          {form.stage === 'reserved' && (
            <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200 space-y-3">
              <h3 className="font-bold text-amber-900 flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5 text-amber-800" /><span>التمويل البنكي والعربون (حجز مؤكد)</span></h3>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-amber-900 mb-1">جهة التمويل البنكي</label>
                  <select value={form.bankName} onChange={(e) => setForm({ ...form, bankName: e.target.value })} className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-amber-300 text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-700">
                    <option value="">اختر البنك...</option>
                    {banks.map((b) => (<option key={b} value={b}>{b}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-amber-900 mb-1">مبلغ العربون (ر.س)</label>
                  <input type="number" placeholder="50000" value={form.depositAmount} onChange={(e) => setForm({ ...form, depositAmount: e.target.value })} className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-amber-300 text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-amber-700" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2.5 items-center">
                <label className="flex items-center gap-2 cursor-pointer bg-white px-2.5 py-2 rounded-lg border border-amber-300 text-amber-950 font-medium">
                  <input type="checkbox" checked={form.depositPaid} onChange={(e) => setForm({ ...form, depositPaid: e.target.checked })} className="rounded text-emerald-800 focus:ring-emerald-800" />
                  <span>تم استلام العربون رسمياً</span>
                </label>
                <div>
                  <label className="block text-amber-900 mb-1 text-[11px]">تاريخ الإفراغ المتوقع</label>
                  <input type="date" value={form.expectedDeedDate} onChange={(e) => setForm({ ...form, expectedDeedDate: e.target.value })} className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-amber-300 text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-700" />
                </div>
              </div>
            </div>
          )}

          {form.stage === 'closed' && (
            <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-3">
              <h3 className="font-bold text-emerald-950 flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-800" /><span>إجراءات الإفراغ وتسليم الوحدة (تم الشراء)</span></h3>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-emerald-900 mb-1">حالة التسليم</label>
                  <select value={form.handoverStatus} onChange={(e) => setForm({ ...form, handoverStatus: e.target.value })} className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-emerald-300 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-700">
                    <option value="pending_deed">بانتظار الإفراغ</option>
                    <option value="preparing_unit">تجهيز الوحدة</option>
                    <option value="delivered">تم التسليم للعميل</option>
                  </select>
                </div>
                <div>
                  <label className="block text-emerald-900 mb-1">قيمة البيع النهائية (ر.س)</label>
                  <input type="number" placeholder="1450000" value={form.finalPrice} onChange={(e) => setForm({ ...form, finalPrice: e.target.value })} className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-emerald-300 text-slate-800 font-mono font-bold focus:outline-none focus:ring-1 focus:ring-emerald-700" />
                </div>
              </div>
              <div>
                <label className="block text-emerald-900 mb-1 text-[11px]">تاريخ التسليم الفعلي</label>
                <input type="date" value={form.deliveredAt} onChange={(e) => setForm({ ...form, deliveredAt: e.target.value })} className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-emerald-300 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-700" />
              </div>
            </div>
          )}

          <button onClick={handleSaveDetails} disabled={savingDetails} className="w-full py-2.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold transition flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-60">
            <Save className="w-3.5 h-3.5" /><span>{savingDetails ? 'جاري الحفظ...' : 'حفظ التعديلات'}</span>
          </button>

          <div className="pt-2 border-t border-slate-100">
            <h3 className="font-bold text-slate-800 mb-2">سجل المتابعات والاتصالات</h3>
            <LeadActivityLog activities={lead.activityLog || []} onAddActivity={handleAddActivity} saving={savingActivity} />
          </div>
        </div>
      </div>
    </div>
  );
}
