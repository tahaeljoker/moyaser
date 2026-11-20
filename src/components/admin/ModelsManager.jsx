import { useState, useEffect } from 'react';
import { Layers, Plus, Trash2, Edit3, Save, X, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { fetchAdminModels, createModel, updateModel, deleteModel } from '../../services/api.js';

export default function ModelsManager() {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState({ type: null, msg: null });
  const [form, setForm] = useState({
    code: '', name: '', type: 'townhouse', area: '250 م²', bedrooms: 4, bathrooms: 5,
    floors: 'دورين وملحق', startingPrice: 1350000, renderImageUrl: '', floorPlanImageUrl: '', isActive: true,
  });

  const loadModels = async () => {
    try {
      setLoading(true);
      const res = await fetchAdminModels();
      if (res?.data) setModels(res.data);
    } catch {
      setStatus({ type: 'error', msg: 'تعذر جلب النماذج المعمارية.' });
    } finally { setLoading(false); }
  };

  useEffect(() => { loadModels(); }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm({ code: '', name: '', type: 'townhouse', area: '250 م²', bedrooms: 4, bathrooms: 5, floors: 'دورين وملحق', startingPrice: 1350000, renderImageUrl: '', floorPlanImageUrl: '', isActive: true });
    setShowModal(true);
  };

  const handleOpenEdit = (m) => {
    setEditingId(m._id);
    setForm({
      code: m.code, name: m.name, type: m.type || 'townhouse', area: m.area || '250 م²',
      bedrooms: m.bedrooms || 4, bathrooms: m.bathrooms || 5, floors: m.floors || 'دورين وملحق',
      startingPrice: m.startingPrice || 0, renderImageUrl: m.renderImageUrl || '', floorPlanImageUrl: m.floorPlanImageUrl || '', isActive: m.isActive !== false,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateModel(editingId, { ...form, startingPrice: Number(form.startingPrice) });
        setStatus({ type: 'success', msg: 'تم تحديث النموذج بنجاح.' });
      } else {
        await createModel({ ...form, startingPrice: Number(form.startingPrice) });
        setStatus({ type: 'success', msg: 'تمت إضافة النموذج بنجاح.' });
      }
      setShowModal(false);
      loadModels();
      setTimeout(() => setStatus({ type: null, msg: null }), 3000);
    } catch (err) {
      alert(err.message || 'فشل حفظ النموذج.');
    }
  };

  const handleDelete = async (id, code) => {
    if (!window.confirm(`هل أنت متأكد من حذف النموذج (${code})؟`)) return;
    try {
      await deleteModel(id);
      loadModels();
    } catch (err) { alert(err.message || 'تعذر حذف النموذج.'); }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 text-slate-900 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-base sm:text-lg font-bold font-heading text-slate-900">النماذج والمخططات الهندسية ({models.length})</h2>
          <p className="text-xs text-slate-500">إدارة نماذج الدوبلكس، المساحات، ومخططات الأدوار المعمارية.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={loadModels} disabled={loading} className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-900 transition"><RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /></button>
          <button onClick={handleOpenAdd} className="py-2 px-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs">
            <Plus className="w-3.5 h-3.5 text-amber-300" /><span>إضافة نموذج</span>
          </button>
        </div>
      </div>

      {status.msg && (
        <div className={`p-2.5 rounded-xl text-xs font-medium border flex items-center gap-2 ${status.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-700'}`}>
          {status.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-700" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
          <span>{status.msg}</span>
        </div>
      )}

      {models.length === 0 ? (
        <div className="text-center py-10 text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">لا توجد نماذج مضافة في قاعدة البيانات حالياً.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {models.map((m) => (
            <div key={m._id} className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-2">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono font-bold text-xs bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">نموذج {m.code}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${m.isActive ? 'text-emerald-700 bg-emerald-50' : 'text-slate-400 bg-slate-100'}`}>{m.isActive ? 'مفعل' : 'معطل'}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm font-heading">{m.name}</h3>
                <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
                  <span>المساحة: {m.area}</span>
                  <span className="font-mono font-bold text-emerald-800">{Number(m.startingPrice).toLocaleString('en-US')} ر.س</span>
                </div>
              </div>
              <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-slate-100">
                <button onClick={() => handleOpenEdit(m)} className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition" title="تعديل"><Edit3 className="w-3.5 h-3.5" /></button>
                <button onClick={() => handleDelete(m._id, m.code)} className="p-1.5 rounded-lg text-rose-600 hover:text-rose-800 hover:bg-rose-50 transition" title="حذف"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-5 shadow-xl text-slate-900 text-xs">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">{editingId ? 'تعديل النموذج' : 'إضافة نموذج جديد'}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-2.5 max-h-[75vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">كود النموذج *</label>
                  <input type="text" required placeholder="A" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 uppercase font-mono font-bold" />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">اسم النموذج *</label>
                  <input type="text" required placeholder="تاون هاوس الأصالة" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">المساحة الإجمالية</label>
                  <input type="text" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200" />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">السعر يبدأ من (ر.س)</label>
                  <input type="number" value={form.startingPrice} onChange={(e) => setForm({ ...form, startingPrice: e.target.value })} className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 font-mono" />
                </div>
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">رابط صورة الواجهة 3D</label>
                <input type="url" dir="ltr" placeholder="https://..." value={form.renderImageUrl} onChange={(e) => setForm({ ...form, renderImageUrl: e.target.value })} className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 font-mono text-left" />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">رابط صورة المخطط المعماري</label>
                <input type="url" dir="ltr" placeholder="https://..." value={form.floorPlanImageUrl} onChange={(e) => setForm({ ...form, floorPlanImageUrl: e.target.value })} className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 font-mono text-left" />
              </div>
              <div className="flex items-center gap-2 pt-1">
                <input type="checkbox" id="modelActive" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="rounded text-emerald-800" />
                <label htmlFor="modelActive" className="text-slate-700 font-medium">عرض النموذج في الموقع العام</label>
              </div>
              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button type="submit" className="flex-1 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-xs">حفظ النموذج</button>
                <button type="button" onClick={() => setShowModal(false)} className="py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}