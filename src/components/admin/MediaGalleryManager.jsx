import { useState, useEffect } from 'react';
import { Image, Video, Compass, Save, Trash2, Upload, RefreshCw, CheckCircle2, AlertCircle, Plus } from 'lucide-react';
import { fetchSiteSettings, updateSiteSettings } from '../../services/api.js';

export default function MediaGalleryManager() {
  const [heroImage, setHeroImage] = useState('');
  const [heroVideo, setHeroVideo] = useState('');
  const [project3d, setProject3d] = useState('');
  const [gallery, setGallery] = useState([]);
  const [newImg, setNewImg] = useState({ url: '', title: '', category: 'exterior' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState({ type: null, msg: null });

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const loadMedia = async () => {
    try {
      setLoading(true);
      const res = await fetchSiteSettings();
      if (res?.data) {
        setHeroImage(res.data.heroImageUrl || '');
        setHeroVideo(res.data.heroVideoUrl || '');
        setProject3d(res.data.projectTour3dUrl || '');
        setGallery(Array.isArray(res.data.galleryImages) ? res.data.galleryImages : []);
      }
    } catch (err) {
      setStatus({ type: 'error', msg: err.message || 'تعذر تحميل الوسائط.' });
    } finally { setLoading(false); }
  };

  useEffect(() => { loadMedia(); }, []);

  const handleUpload = async (e, target) => {
    const file = e.target.files?.[0];
    if (!file || !cloudName || !uploadPreset) return;
    try {
      setUploading(true);
      const fd = new FormData();
      fd.append('file', file);
      fd.append('upload_preset', uploadPreset);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body: fd });
      const data = await res.json();
      if (data.secure_url) {
        if (target === 'hero') setHeroImage(data.secure_url);
        else setNewImg((p) => ({ ...p, url: data.secure_url }));
      }
    } catch {
      setStatus({ type: 'error', msg: 'فشل رفع الملف عبر Cloudinary.' });
    } finally { setUploading(false); }
  };

  const handleAddGalleryItem = () => {
    if (!newImg.url.trim()) return;
    setGallery((prev) => [...prev, { ...newImg, url: newImg.url.trim(), title: newImg.title.trim() }]);
    setNewImg({ url: '', title: '', category: 'exterior' });
  };

  const handleSaveAll = async (e) => {
    e?.preventDefault();
    try {
      setSaving(true);
      setStatus({ type: null, msg: null });
      const res = await updateSiteSettings({
        heroImageUrl: heroImage.trim(),
        heroVideoUrl: heroVideo.trim(),
        projectTour3dUrl: project3d.trim(),
        galleryImages: gallery,
      });
      if (res?.success) {
        setStatus({ type: 'success', msg: 'تم حفظ إعدادات المعرض والوسائط بنجاح.' });
        setTimeout(() => setStatus({ type: null, msg: null }), 3000);
      }
    } catch (err) {
      setStatus({ type: 'error', msg: err.message || 'فشل حفظ الوسائط.' });
    } finally { setSaving(false); }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 text-slate-900 shadow-xs max-w-4xl space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-base sm:text-lg font-bold font-heading text-slate-900">المعرض والوسائط الرقمية</h2>
          <p className="text-xs text-slate-500">إدارة فيديو الواجهة، جولة المشروع 3D، وصور المعرض العام.</p>
        </div>
        <button onClick={loadMedia} disabled={loading} className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 self-start sm:self-auto transition">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-800' : ''}`} />
        </button>
      </div>

      {status.msg && (
        <div className={`p-2.5 rounded-xl text-xs font-medium border flex items-center gap-2 ${status.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-700'}`}>
          {status.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-700" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
          <span>{status.msg}</span>
        </div>
      )}

      {/* Hero & 3D Media */}
      <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
        <h3 className="font-bold text-slate-800 flex items-center gap-1.5"><Video className="w-4 h-4 text-emerald-800" /><span>وسائط الواجهة والمشروع الرئيسية</span></h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-700 font-bold mb-1">صورة الغلاف الرئيسية (Hero Image)</label>
            <div className="flex gap-2">
              <input type="url" dir="ltr" placeholder="https://... أو رابط الصورة" value={heroImage} onChange={(e) => setHeroImage(e.target.value)} className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-left font-mono text-xs focus:ring-1 focus:ring-emerald-800" />
              {cloudName && (
                <label className="p-1.5 bg-slate-200 hover:bg-slate-300 rounded-lg cursor-pointer flex items-center" title="رفع من الجهاز">
                  <Upload className="w-3.5 h-3.5 text-slate-700" /><input type="file" accept="image/*" onChange={(e) => handleUpload(e, 'hero')} className="hidden" />
                </label>
              )}
            </div>
          </div>
          <div>
            <label className="block text-slate-700 font-bold mb-1">رابط فيديو الواجهة (YouTube / Vimeo)</label>
            <input type="url" dir="ltr" placeholder="https://youtube.com/watch?v=..." value={heroVideo} onChange={(e) => setHeroVideo(e.target.value)} className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-left font-mono text-xs focus:ring-1 focus:ring-emerald-800" />
          </div>
        </div>
        <div>
          <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1"><Compass className="w-3.5 h-3.5 text-slate-500" /><span>رابط الجولة الافتراضية 3D للمشروع (Matterport / Kuula)</span></label>
          <input type="url" dir="ltr" placeholder="https://my.matterport.com/show/?m=..." value={project3d} onChange={(e) => setProject3d(e.target.value)} className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-left font-mono text-xs focus:ring-1 focus:ring-emerald-800" />
        </div>
      </div>

      {/* Gallery Images */}
      <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
        <h3 className="font-bold text-slate-800 flex items-center gap-1.5"><Image className="w-4 h-4 text-emerald-800" /><span>معرض صور المشروع</span></h3>
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
          <input type="url" dir="ltr" placeholder="رابط الصورة https://..." value={newImg.url} onChange={(e) => setNewImg({ ...newImg, url: e.target.value })} className="sm:col-span-5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 font-mono text-xs text-left" />
          <input type="text" placeholder="عنوان الصورة (مثال: صالة الضيوف)" value={newImg.title} onChange={(e) => setNewImg({ ...newImg, title: e.target.value })} className="sm:col-span-4 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs" />
          <select value={newImg.category} onChange={(e) => setNewImg({ ...newImg, category: e.target.value })} className="sm:col-span-2 px-2 py-1.5 rounded-lg bg-white border border-slate-200 text-xs">
            <option value="exterior">واجهات</option><option value="interior">داخلي</option><option value="finishes">تشطيبات</option>
          </select>
          <button type="button" onClick={handleAddGalleryItem} className="sm:col-span-1 p-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg flex items-center justify-center font-bold" title="إضافة للمعرض"><Plus className="w-4 h-4" /></button>
        </div>

        {gallery.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
            {gallery.map((img, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-slate-200 overflow-hidden relative group">
                <img src={img.url} alt={img.title || ''} className="w-full h-24 object-cover" />
                <div className="p-1.5 text-[11px] truncate font-medium text-slate-700">{img.title || 'صورة'}</div>
                <button type="button" onClick={() => setGallery(gallery.filter((_, i) => i !== idx))} className="absolute top-1 left-1 p-1 rounded-md bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition shadow-xs" title="حذف"><Trash2 className="w-3 h-3" /></button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-4 text-slate-400">لا توجد صور مضافة للمعرض حالياً.</p>
        )}
      </div>

      <button onClick={handleSaveAll} disabled={saving} className="py-2.5 px-5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs disabled:opacity-60">
        <Save className="w-3.5 h-3.5" /><span>{saving ? 'جاري الحفظ...' : 'حفظ وسائط المعرض'}</span>
      </button>
    </div>
  );
}