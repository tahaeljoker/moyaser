import { useState, useEffect } from 'react';
import { Settings, Save, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { fetchSiteSettings, updateSiteSettings } from '../../services/api.js';

export default function SiteSettingsManager() {
  const [form, setForm] = useState({
    projectName: '', city: '', heroTitle: '', heroSubtitle: '',
    regaLicense: '', falLicense: '', whatsappNumber: '', phoneNumber: '', mapUrl: '', aboutText: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: null, msg: null });

  const loadSettings = async () => {
    try {
      setLoading(true);
      setStatus({ type: null, msg: null });
      const res = await fetchSiteSettings();
      if (res?.data) {
        setForm({
          projectName: res.data.projectName || '',
          city: res.data.city || '',
          heroTitle: res.data.heroTitle || '',
          heroSubtitle: res.data.heroSubtitle || '',
          regaLicense: res.data.regaLicense || '',
          falLicense: res.data.falLicense || '',
          whatsappNumber: res.data.whatsappNumber || '',
          phoneNumber: res.data.phoneNumber || '',
          mapUrl: res.data.mapUrl || '',
          aboutText: res.data.aboutText || '',
        });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: err.message || 'تعذر تحميل إعدادات الموقع.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadSettings(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setStatus({ type: null, msg: null });
      const res = await updateSiteSettings(form);
      if (res?.success) {
        setStatus({ type: 'success', msg: 'تم حفظ وتحديث إعدادات الموقع بنجاح.' });
        setTimeout(() => setStatus({ type: null, msg: null }), 4000);
      }
    } catch (err) {
      setStatus({ type: 'error', msg: err.message || 'فشل حفظ الإعدادات.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-slate-900/90 rounded-3xl border border-slate-800/90 p-5 sm:p-7 shadow-2xl text-slate-100 max-w-4xl backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-amber-300 shadow-inner">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black font-heading text-white tracking-tight">إعدادات الموقع والهوية الحية (CMS)</h3>
            <p className="text-xs text-slate-400 mt-0.5">تعديل بيانات المشروع ورخص فال والإعلان وأرقام التواصل بشكل فوري.</p>
          </div>
        </div>
        <button onClick={loadSettings} disabled={loading} className="p-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 self-start sm:self-auto transition" title="تحديث">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
        </button>
      </div>

      {status.msg && (
        <div className={`p-3.5 mb-5 rounded-2xl text-xs font-bold border flex items-center gap-2.5 shadow-sm ${
          status.type === 'success' ? 'bg-emerald-950/80 border-emerald-800 text-emerald-300' : 'bg-rose-950/80 border-rose-800 text-rose-300'
        }`}>
          {status.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
          <span>{status.msg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-bold mb-1.5">اسم المشروع الرسمي</label>
            <input type="text" value={form.projectName} onChange={(e) => setForm({ ...form, projectName: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-700" />
          </div>
          <div>
            <label className="block text-slate-300 font-bold mb-1.5">المدينة والحي</label>
            <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-700" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-bold mb-1.5">عنوان الهيدر الرئيسي</label>
            <input type="text" value={form.heroTitle} onChange={(e) => setForm({ ...form, heroTitle: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-700" />
          </div>
          <div>
            <label className="block text-slate-300 font-bold mb-1.5">العنوان الفرعي</label>
            <input type="text" value={form.heroSubtitle} onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-700" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-bold mb-1.5">رخصة فال العقارية (FAL)</label>
            <input type="text" value={form.falLicense} onChange={(e) => setForm({ ...form, falLicense: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-amber-300 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-700" />
          </div>
          <div>
            <label className="block text-slate-300 font-bold mb-1.5">ترخيص الإعلان العقاري (REGA)</label>
            <input type="text" value={form.regaLicense} onChange={(e) => setForm({ ...form, regaLicense: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-amber-300 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-700" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-bold mb-1.5">واتساب المبيعات (مع 966)</label>
            <input type="text" dir="ltr" value={form.whatsappNumber} onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-700 text-left" />
          </div>
          <div>
            <label className="block text-slate-300 font-bold mb-1.5">هاتف التواصل المعروض</label>
            <input type="text" dir="ltr" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-700 text-left" />
          </div>
        </div>

        <div>
          <label className="block text-slate-300 font-bold mb-1.5">رابط خرائط قوقل</label>
          <input type="url" dir="ltr" value={form.mapUrl} onChange={(e) => setForm({ ...form, mapUrl: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-700 text-left" />
        </div>

        <div>
          <label className="block text-slate-300 font-bold mb-1.5">نبذة عن المشروع</label>
          <textarea rows={2} value={form.aboutText} onChange={(e) => setForm({ ...form, aboutText: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-700 resize-none" />
        </div>

        <div className="pt-2">
          <button type="submit" disabled={saving} className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-emerald-900 to-emerald-800 hover:from-emerald-800 hover:to-emerald-700 text-white font-bold transition flex items-center justify-center gap-2 shadow-md border border-emerald-700/60 active:scale-95">
            <Save className="w-4 h-4 text-amber-300" />
            <span>{saving ? 'جاري الحفظ...' : 'حفظ التعديلات الحية'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
