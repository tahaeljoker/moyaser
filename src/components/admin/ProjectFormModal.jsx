import { useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { createProject, updateProject } from '../../services/api.js';

export default function ProjectFormModal({ project, onClose, onSuccess }) {
  const isEdit = Boolean(project?._id);
  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: project?.name || '', slug: project?.slug || '', tagline: project?.tagline || '',
    description: project?.description || '', city: project?.city || 'الدمام', district: project?.district || '',
    status: project?.status || 'available', sortOrder: project?.sortOrder || 0,
    contactPhone: project?.contactPhone || '0500550223', whatsappNumber: project?.whatsappNumber || '966500550223',
    mapUrl: project?.mapUrl || '', regaLicense: project?.regaLicense || '', valLicense: project?.valLicense || '',
    heroImageUrl: project?.heroImageUrl || '', heroVideoUrl: project?.heroVideoUrl || '',
    tour3dUrl: project?.tour3dUrl || '', masterplanUrl: project?.masterplanUrl || '',
    specsText: Array.isArray(project?.specs) ? project.specs.join('\n') : '',
    afterSalesText: Array.isArray(project?.afterSales) ? project.afterSales.join('\n') : '',
    visibleSections: project?.visibleSections || { models: true, unitMatrix: true, gallery: true, location: true, specs: true, guarantees: true, afterSales: true },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('vs_')) {
      const sectionKey = name.replace('vs_', '');
      setForm((prev) => ({ ...prev, visibleSections: { ...prev.visibleSections, [sectionKey]: checked } }));
    } else {
      setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.slug.trim()) return setError('اسم المشروع والمعرف مطلوبان.');
    setError('');
    setLoading(true);

    const payload = {
      name: form.name.trim(), slug: form.slug.toLowerCase().trim(), tagline: form.tagline.trim(),
      description: form.description.trim(), city: form.city.trim(), district: form.district.trim(),
      status: form.status, sortOrder: Number(form.sortOrder) || 0, contactPhone: form.contactPhone.trim(),
      whatsappNumber: form.whatsappNumber.trim(), mapUrl: form.mapUrl.trim(), regaLicense: form.regaLicense.trim(),
      valLicense: form.valLicense.trim(), heroImageUrl: form.heroImageUrl.trim(), heroVideoUrl: form.heroVideoUrl.trim(),
      tour3dUrl: form.tour3dUrl.trim(), masterplanUrl: form.masterplanUrl.trim(),
      specs: form.specsText.split('\n').map((s) => s.trim()).filter(Boolean),
      afterSales: form.afterSalesText.split('\n').map((s) => s.trim()).filter(Boolean),
      visibleSections: form.visibleSections,
    };

    try {
      if (isEdit) await updateProject(project._id, payload);
      else await createProject(payload);
      onSuccess();
    } catch (err) {
      setError(err?.data?.message || err.message || 'فشل حفظ بيانات المشروع.');
    } finally { setLoading(false); }
  };

  const tabs = [
    { id: 'basic', label: 'الأساسيات' }, { id: 'contacts', label: 'التراخيص والاتصال' },
    { id: 'media', label: 'الوسائط' }, { id: 'specs', label: 'المواصفات والأقسام' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden text-right" dir="rtl">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 font-heading">{isEdit ? `تعديل: ${project?.name}` : 'مشروع عقاري جديد'}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50"><X className="w-4 h-4" /></button>
        </div>

        <div className="px-5 pt-3 border-b border-slate-100 flex gap-2">
          {tabs.map((t) => (
            <button key={t.id} type="button" onClick={() => setActiveTab(t.id)} className={`px-3 py-1.5 text-xs font-bold rounded-t-lg border-b-2 transition ${activeTab === t.id ? 'border-emerald-800 text-emerald-900 bg-emerald-50/50' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
              {t.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {error && <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2"><AlertCircle className="w-4 h-4 shrink-0" /><span>{error}</span></div>}

          {activeTab === 'basic' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div><label className="block text-slate-700 font-medium mb-1">اسم المشروع *</label><input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full px-3 py-2 border border-slate-200 rounded-xl" /></div>
              <div><label className="block text-slate-700 font-medium mb-1">معرف المشروع (Slug) *</label><input type="text" name="slug" value={form.slug} onChange={handleChange} required className="w-full px-3 py-2 border border-slate-200 rounded-xl" /></div>
              <div className="sm:col-span-2"><label className="block text-slate-700 font-medium mb-1">العنوان الفرعي</label><input type="text" name="tagline" value={form.tagline} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-xl" /></div>
              <div><label className="block text-slate-700 font-medium mb-1">المدينة</label><input type="text" name="city" value={form.city} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-xl" /></div>
              <div><label className="block text-slate-700 font-medium mb-1">الحي</label><input type="text" name="district" value={form.district} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-xl" /></div>
              <div><label className="block text-slate-700 font-medium mb-1">حالة المشروع</label>
                <select name="status" value={form.status} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-xl">
                  <option value="available">متاح للبيع</option><option value="under_development">قيد التطوير</option><option value="completed">مكتمل</option><option value="upcoming">قريباً</option>
                </select>
              </div>
              <div><label className="block text-slate-700 font-medium mb-1">ترتيب العرض</label><input type="number" name="sortOrder" value={form.sortOrder} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-xl tabular-nums" /></div>
              <div className="sm:col-span-2"><label className="block text-slate-700 font-medium mb-1">الوصف المعماري</label><textarea rows={3} name="description" value={form.description} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-xl" /></div>
            </div>
          )}

          {activeTab === 'contacts' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div><label className="block text-slate-700 font-medium mb-1">هاتف المبيعات</label><input type="text" name="contactPhone" value={form.contactPhone} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-xl tabular-nums" /></div>
              <div><label className="block text-slate-700 font-medium mb-1">واتساب المبيعات</label><input type="text" name="whatsappNumber" value={form.whatsappNumber} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-xl tabular-nums" /></div>
              <div><label className="block text-slate-700 font-medium mb-1">ترخيص الهيئة (REGA)</label><input type="text" name="regaLicense" value={form.regaLicense} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-xl tabular-nums" /></div>
              <div><label className="block text-slate-700 font-medium mb-1">ترخيص فال (VAL)</label><input type="text" name="valLicense" value={form.valLicense} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-xl tabular-nums" /></div>
              <div className="sm:col-span-2"><label className="block text-slate-700 font-medium mb-1">رابط خريطة الموقع</label><input type="url" name="mapUrl" value={form.mapUrl} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-xl" /></div>
            </div>
          )}

          {activeTab === 'media' && (
            <div className="space-y-3 text-xs">
              <div><label className="block text-slate-700 font-medium mb-1">صورة الواجهة الرئيسية (Hero WebP)</label><input type="text" name="heroImageUrl" value={form.heroImageUrl} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono" /></div>
              <div><label className="block text-slate-700 font-medium mb-1">رابط فيديو المشروع</label><input type="text" name="heroVideoUrl" value={form.heroVideoUrl} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono" /></div>
              <div><label className="block text-slate-700 font-medium mb-1">رابط الجولة 3D</label><input type="text" name="tour3dUrl" value={form.tour3dUrl} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono" /></div>
              <div><label className="block text-slate-700 font-medium mb-1">رابط المخطط العام (Masterplan)</label><input type="text" name="masterplanUrl" value={form.masterplanUrl} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono" /></div>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="space-y-3 text-xs">
              <div><label className="block text-slate-700 font-medium mb-1">مواصفات المشروع (سطر لكل مواصفة)</label><textarea rows={3} name="specsText" value={form.specsText} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono" /></div>
              <div><label className="block text-slate-700 font-medium mb-1">خدمات ما بعد البيع (سطر لكل خدمة)</label><textarea rows={3} name="afterSalesText" value={form.afterSalesText} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono" /></div>
              <div>
                <label className="block text-slate-700 font-bold mb-2">أقسام العرض الظاهرة بالموقع</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.entries(form.visibleSections).map(([sec, val]) => (
                    <label key={sec} className="flex items-center gap-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer">
                      <input type="checkbox" name={`vs_${sec}`} checked={val} onChange={handleChange} className="rounded text-emerald-800" />
                      <span className="text-slate-700 font-medium">{sec}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition">إلغاء</button>
            <button type="submit" disabled={loading} className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold transition">
              <Save className="w-4 h-4" /><span>{loading ? 'جاري الحفظ...' : isEdit ? 'حفظ التعديلات' : 'إنشاء المشروع'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
