import { useState, useEffect } from 'react';
import { Settings, Save, RefreshCw, CheckCircle2, AlertCircle, Bell, Share2, Eye, MapPin } from 'lucide-react';
import { fetchSiteSettings, updateSiteSettings } from '../../services/api.js';

export default function SiteSettingsManager() {
  const [form, setForm] = useState({
    projectName: '', city: '', heroTitle: '', heroSubtitle: '',
    regaLicense: '', falLicense: '', whatsappNumber: '', phoneNumber: '', mapUrl: '', aboutText: '',
    announcementBar: { enabled: false, text: '' },
    socialLinks: { snapchat: '', instagram: '', x: '', tiktok: '', email: '' },
    officeInfo: { address: 'الدمام — حي حديقة الأثير', workingHours: 'السبت - الخميس: 9:00 ص - 9:00 م' },
    visibleSections: { gallery: true, models: true, unitMatrix: true, location: true, specs: true, guarantees: true, afterSales: true, partners: true },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: null, msg: null });

  const loadSettings = async () => {
    try {
      setLoading(true);
      const res = await fetchSiteSettings();
      if (res?.data) {
        setForm({
          projectName: res.data.projectName || '', city: res.data.city || '',
          heroTitle: res.data.heroTitle || '', heroSubtitle: res.data.heroSubtitle || '',
          regaLicense: res.data.regaLicense || '', falLicense: res.data.falLicense || '',
          whatsappNumber: res.data.whatsappNumber || '', phoneNumber: res.data.phoneNumber || '',
          mapUrl: res.data.mapUrl || '', aboutText: res.data.aboutText || '',
          announcementBar: res.data.announcementBar || { enabled: false, text: '' },
          socialLinks: res.data.socialLinks || { snapchat: '', instagram: '', x: '', tiktok: '', email: '' },
          officeInfo: res.data.officeInfo || { address: 'الدمام — حي حديقة الأثير', workingHours: 'السبت - الخميس: 9:00 ص - 9:00 م' },
          visibleSections: {
            gallery: true, models: true, unitMatrix: true, location: true, specs: true, guarantees: true, afterSales: true, partners: true,
            ...(res.data.visibleSections || {}),
          },
        });
      }
    } catch (err) { setStatus({ type: 'error', msg: err.message || 'تعذر تحميل الإعدادات.' }); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadSettings(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setStatus({ type: null, msg: null });
      const res = await updateSiteSettings(form);
      if (res?.success) {
        setStatus({ type: 'success', msg: 'تم حفظ كافة إعدادات وهوية الموقع بنجاح.' });
        setTimeout(() => setStatus({ type: null, msg: null }), 3000);
      }
    } catch (err) { setStatus({ type: 'error', msg: err.message || 'فشل حفظ الإعدادات.' }); }
    finally { setSaving(false); }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 text-slate-900 shadow-xs max-w-4xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-base sm:text-lg font-bold font-heading text-slate-900">إعدادات وهوية الموقع</h2>
          <p className="text-xs text-slate-500">معلومات المشروع، التراخيص، شريط الإعلانات، وحسابات التواصل.</p>
        </div>
        <button onClick={loadSettings} disabled={loading} className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-900 transition"><RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /></button>
      </div>

      {status.msg && (
        <div className={`p-2.5 rounded-xl text-xs font-medium border flex items-center gap-2 ${status.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-700'}`}>
          {status.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-700" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
          <span>{status.msg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Announcement Bar */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <label className="font-bold text-slate-800 flex items-center gap-1.5"><Bell className="w-3.5 h-3.5 text-amber-600" /><span>شريط الإعلانات العلوي بالموقع</span></label>
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium">
              <input type="checkbox" checked={form.announcementBar?.enabled} onChange={(e) => setForm({ ...form, announcementBar: { ...form.announcementBar, enabled: e.target.checked } })} className="rounded text-emerald-800" />
              <span>تفعيل الشريط</span>
            </label>
          </div>
          <input type="text" placeholder="مثال: خصم خاص بمناسبة إطلاق المرحلة الثانية..." value={form.announcementBar?.text || ''} onChange={(e) => setForm({ ...form, announcementBar: { ...form.announcementBar, text: e.target.value } })} className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200" />
        </div>

        {/* Basic Project Info */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
          <h3 className="font-bold text-slate-800">بيانات المشروع والتراخيص</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">اسم المشروع</label>
              <input type="text" value={form.projectName} onChange={(e) => setForm({ ...form, projectName: e.target.value })} className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200" />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">المدينة والحي</label>
              <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">رقم رخصة فال (FAL)</label>
              <input type="text" value={form.falLicense} onChange={(e) => setForm({ ...form, falLicense: e.target.value })} className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 font-mono" />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">رقم ترخيص الإعلان (REGA)</label>
              <input type="text" value={form.regaLicense} onChange={(e) => setForm({ ...form, regaLicense: e.target.value })} className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 font-mono" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">واتساب المبيعات</label>
              <input type="text" dir="ltr" value={form.whatsappNumber} onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })} className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 font-mono text-left" />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">هاتف التواصل</label>
              <input type="text" dir="ltr" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 font-mono text-left" />
            </div>
          </div>
          <div>
            <label className="block text-slate-700 font-bold mb-1">رابط خرائط قوقل</label>
            <input type="url" dir="ltr" value={form.mapUrl} onChange={(e) => setForm({ ...form, mapUrl: e.target.value })} className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 font-mono text-left" />
          </div>
        </div>

        {/* Social Links & Office */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
          <h3 className="font-bold text-slate-800 flex items-center gap-1.5"><Share2 className="w-3.5 h-3.5 text-emerald-800" /><span>روابط التواصل والمكتب</span></h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div><label className="block text-slate-600 mb-1">سناب شات</label><input type="text" dir="ltr" placeholder="@muyassar" value={form.socialLinks?.snapchat || ''} onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, snapchat: e.target.value } })} className="w-full px-2 py-1 rounded-lg bg-white border border-slate-200 font-mono text-left" /></div>
            <div><label className="block text-slate-600 mb-1">إنستغرام</label><input type="text" dir="ltr" placeholder="@muyassar" value={form.socialLinks?.instagram || ''} onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, instagram: e.target.value } })} className="w-full px-2 py-1 rounded-lg bg-white border border-slate-200 font-mono text-left" /></div>
            <div><label className="block text-slate-600 mb-1">منصة X</label><input type="text" dir="ltr" placeholder="@muyassar" value={form.socialLinks?.x || ''} onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, x: e.target.value } })} className="w-full px-2 py-1 rounded-lg bg-white border border-slate-200 font-mono text-left" /></div>
            <div><label className="block text-slate-600 mb-1">تيك توك</label><input type="text" dir="ltr" placeholder="@muyassar" value={form.socialLinks?.tiktok || ''} onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, tiktok: e.target.value } })} className="w-full px-2 py-1 rounded-lg bg-white border border-slate-200 font-mono text-left" /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div><label className="block text-slate-600 mb-1">عنوان المكتب</label><input type="text" value={form.officeInfo?.address || ''} onChange={(e) => setForm({ ...form, officeInfo: { ...form.officeInfo, address: e.target.value } })} className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200" /></div>
            <div><label className="block text-slate-600 mb-1">أوقات العمل</label><input type="text" value={form.officeInfo?.workingHours || ''} onChange={(e) => setForm({ ...form, officeInfo: { ...form.officeInfo, workingHours: e.target.value } })} className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200" /></div>
          </div>
        </div>

        {/* Section Visibility */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
          <h3 className="font-bold text-slate-800 flex items-center gap-1.5"><Eye className="w-3.5 h-3.5 text-emerald-800" /><span>إظهار وإخفاء أقسام الصفحة الرئيسية</span></h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {[
              { id: 'gallery', label: 'معرض الصور' },
              { id: 'models', label: 'النماذج المعمارية' },
              { id: 'unitMatrix', label: 'جدول الـ 24 وحدة' },
              { id: 'location', label: 'الموقع والمسافات' },
              { id: 'specs', label: 'المواصفات الفنية' },
              { id: 'guarantees', label: 'الضمانات والتأمين' },
              { id: 'afterSales', label: 'خدمات ما بعد البيع' },
              { id: 'partners', label: 'شركاء النجاح' },
            ].map((sec) => (
              <label key={sec.id} className="flex items-center gap-1.5 cursor-pointer bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-medium">
                <input type="checkbox" checked={form.visibleSections?.[sec.id] !== false} onChange={(e) => setForm({ ...form, visibleSections: { ...form.visibleSections, [sec.id]: e.target.checked } })} className="rounded text-emerald-800" />
                <span>{sec.label}</span>
              </label>
            ))}
          </div>
        </div>

        <button type="submit" disabled={saving} className="py-2.5 px-5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold transition flex items-center gap-1.5 shadow-xs disabled:opacity-60">
          <Save className="w-3.5 h-3.5" /><span>{saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}</span>
        </button>
      </form>
    </div>
  );
}
