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
        setStatus({ type: 'success', msg: 'تم حفظ إعدادات الموقع بنجاح.' });
        setTimeout(() => setStatus({ type: null, msg: null }), 3000);
      }
    } catch (err) {
      setStatus({ type: 'error', msg: err.message || 'فشل حفظ الإعدادات.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 sm:p-6 text-slate-100 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-300">
            <Settings className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold font-heading text-white">إعدادات الموقع</h2>
            <p className="text-xs text-slate-400">تعديل معلومات المشروع وأرقام التواصل والتراخيص المعتمدة.</p>
          </div>
        </div>
        <button onClick={loadSettings} disabled={loading} className="p-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 self-start sm:self-auto transition" title="تحديث">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
        </button>
      </div>

      {status.msg && (
        <div className={`p-3 mb-4 rounded-xl text-xs font-medium border flex items-center gap-2 ${
          status.type === 'success' ? 'bg-emerald-950/70 border-emerald-800 text-emerald-300' : 'bg-rose-950/70 border-rose-800 text-rose-200'
        }`}>
          {status.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
          <span>{status.msg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-300 font-bold mb-1">اسم المشروع</label>
            <input type="text" value={form.projectName} onChange={(e) => setForm({ ...form, projectName: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-1 focus:ring-emerald-700" />
          </div>
          <div>
            <label className="block text-slate-300 font-bold mb-1">المدينة والحي</label>
            <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-1 focus:ring-emerald-700" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-300 font-bold mb-1">عنوان الواجهة الرئيسية</label>
            <input type="text" value={form.heroTitle} onChange={(e) => setForm({ ...form, heroTitle: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-1 focus:ring-emerald-700" />
          </div>
          <div>
            <label className="block text-slate-300 font-bold mb-1">العنوان الفرعي</label>
            <input type="text" value={form.heroSubtitle} onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-1 focus:ring-emerald-700" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-300 font-bold mb-1">رقم رخصة فال (FAL)</label>
            <input type="text" value={form.falLicense} onChange={(e) => setForm({ ...form, falLicense: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-amber-300 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-700" />
          </div>
          <div>
            <label className="block text-slate-300 font-bold mb-1">رقم ترخيص الإعلان (REGA)</label>
            <input type="text" value={form.regaLicense} onChange={(e) => setForm({ ...form, regaLicense: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-amber-300 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-700" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-300 font-bold mb-1">واتساب المبيعات (مع 966)</label>
            <input type="text" dir="ltr" value={form.whatsappNumber} onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:ring-1 focus:ring-emerald-700 text-left" />
          </div>
          <div>
            <label className="block text-slate-300 font-bold mb-1">هاتف التواصل</label>
            <input type="text" dir="ltr" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:ring-1 focus:ring-emerald-700 text-left" />
          </div>
        </div>

        <div>
          <label className="block text-slate-300 font-bold mb-1">رابط خرائط قوقل</label>
          <input type="url" dir="ltr" value={form.mapUrl} onChange={(e) => setForm({ ...form, mapUrl: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:ring-1 focus:ring-emerald-700 text-left" />
        </div>

        <div>
          <label className="block text-slate-300 font-bold mb-1">نبذة عن المشروع</label>
          <textarea rows={2} value={form.aboutText} onChange={(e) => setForm({ ...form, aboutText: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-1 focus:ring-emerald-700 resize-none" />
        </div>

        <div className="pt-1">
          <button type="submit" disabled={saving} className="py-2.5 px-5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-60">
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
