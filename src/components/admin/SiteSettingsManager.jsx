import { useState, useEffect } from 'react';
import { Settings, Save, RefreshCw, CheckCircle2 } from 'lucide-react';
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
    <div className="bg-slate-900 rounded-3xl border border-slate-800 p-5 sm:p-7 shadow-xl text-slate-100 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-900/60 border border-emerald-700/60 flex items-center justify-center text-amber-300">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black font-heading text-white">إعدادات الموقع والهوية الحية (CMS)</h3>
            <p className="text-xs text-slate-400">تعديل بيانات المشروع ورخص فال والإعلان وأرقام التواصل بشكل فوري.</p>
          </div>
        </div>
        <button onClick={loadSettings} disabled={loading} className="p-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 self-start sm:self-auto" title="تحديث">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {status.msg && (
        <div className={`p-3.5 mb-5 rounded-xl text-xs font-bold border flex items-center gap-2 ${
          status.type === 'success' ? 'bg-emerald-950/80 border-emerald-800 text-emerald-300' : 'bg-red-950/80 border-red-800 text-red-300'
        }`}>
          {status.type === 'success' && <CheckCircle2 className="w-4 h-4" />}
          <span>{status.msg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-bold mb-1">اسم المشروع</label>
            <input type="text" value={form.projectName} onChange={(e) => setForm({ ...form, projectName: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-700" />
          </div>
          <div>
            <label className="block text-slate-300 font-bold mb-1">المدينة والحي</label>
            <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-700" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-bold mb-1">عنوان الهيدر الرئيسي</label>
            <input type="text" value={form.heroTitle} onChange={(e) => setForm({ ...form, heroTitle: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-700" />
          </div>
          <div>
            <label className="block text-slate-300 font-bold mb-1">العنوان الفرعي</label>
            <input type="text" value={form.heroSubtitle} onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-700" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-bold mb-1">رخصة فال العقارية</label>
            <input type="text" value={form.falLicense} onChange={(e) => setForm({ ...form, falLicense: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-700" />
          </div>
          <div>
            <label className="block text-slate-300 font-bold mb-1">ترخيص الإعلان العقاري</label>
            <input type="text" value={form.regaLicense} onChange={(e) => setForm({ ...form, regaLicense: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-700" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-bold mb-1">واتساب المبيعات (مع 966)</label>
            <input type="text" dir="ltr" value={form.whatsappNumber} onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-700 text-left" />
          </div>
          <div>
            <label className="block text-slate-300 font-bold mb-1">هاتف التواصل المعروض</label>
            <input type="text" dir="ltr" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-700 text-left" />
          </div>
        </div>

        <div>
          <label className="block text-slate-300 font-bold mb-1">رابط خرائط قوقل</label>
          <input type="url" dir="ltr" value={form.mapUrl} onChange={(e) => setForm({ ...form, mapUrl: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-700 text-left" />
        </div>

        <div>
          <label className="block text-slate-300 font-bold mb-1">نبذة عن المشروع</label>
          <textarea rows={2} value={form.aboutText} onChange={(e) => setForm({ ...form, aboutText: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-700 resize-none" />
        </div>

        <div className="pt-2">
          <button type="submit" disabled={saving} className="py-2.5 px-6 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white font-bold transition flex items-center justify-center gap-2 shadow-sm active:scale-95">
            <Save className="w-4 h-4 text-amber-300" />
            <span>{saving ? 'جاري الحفظ...' : 'حفظ التعديلات الحية'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
