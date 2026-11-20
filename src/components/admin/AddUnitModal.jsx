import { useState } from 'react';
import { X, Building, Upload, Image, Video, Compass, Trash2 } from 'lucide-react';
import { createUnit } from '../../services/api.js';

export default function AddUnitModal({ isOpen, onClose, onUnitCreated }) {
  const [form, setForm] = useState({
    unitCode: '', model: 'A', type: 'townhouse', area: '250 م²', facade: 'شمالية شارع 18م',
    price: '', status: 'available', videoUrl: '', tour3dUrl: '',
  });
  const [images, setImages] = useState([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !cloudName || !uploadPreset) return;
    try {
      setUploading(true);
      const fd = new FormData();
      fd.append('file', file);
      fd.append('upload_preset', uploadPreset);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body: fd });
      const data = await res.json();
      if (data.secure_url) setImages((prev) => [...prev, data.secure_url]);
    } catch {
      setError('تعذر رفع الصورة عبر خدمة Cloudinary، يمكنك إضافة الرابط يدوياً.');
    } finally {
      setUploading(false);
    }
  };

  const handleAddImageUrl = () => {
    if (newImageUrl.trim()) {
      setImages((prev) => [...prev, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!form.unitCode || !form.price) return setError('يرجى تحديد كود الوحدة وسعر البيع.');
    try {
      setLoading(true);
      const res = await createUnit({
        ...form, price: Number(form.price),
        media: { images, videoUrl: form.videoUrl.trim(), tour3dUrl: form.tour3dUrl.trim() },
      });
      if (res?.success) {
        if (onUnitCreated) onUnitCreated(res.data);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'تعذر إضافة الوحدة.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-xl relative text-slate-900 my-6">
        <button onClick={onClose} className="absolute top-4 left-4 text-slate-400 hover:text-slate-700 w-7 h-7 rounded-lg flex items-center justify-center hover:bg-slate-100" aria-label="إغلاق">
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-800">
            <Building className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-heading text-slate-900">إضافة وحدة عقارية جديدة</h3>
            <p className="text-xs text-slate-500">إدراج المواصفات المعمارية والوسائط (صور، فيديو، 3D).</p>
          </div>
        </div>

        {error && <div className="mb-3.5 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs max-h-[75vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">كود الوحدة *</label>
              <input type="text" required placeholder="مثال: U-25" value={form.unitCode} onChange={(e) => setForm({ ...form, unitCode: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 uppercase font-mono font-bold focus:ring-1 focus:ring-emerald-800" />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">النموذج المعماري *</label>
              <select value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 focus:ring-1 focus:ring-emerald-800">
                {['A', 'B', 'C', 'D', 'E', 'F'].map((m) => (<option key={m} value={m}>نموذج {m}</option>))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">نوع العقار</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 focus:ring-1 focus:ring-emerald-800">
                <option value="townhouse">تاون هاوس</option>
                <option value="apartment">شقة سكنية</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">الحالة</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 focus:ring-1 focus:ring-emerald-800">
                <option value="available">متاح</option>
                <option value="reserved">محجوز</option>
                <option value="sold">تم البيع</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">المساحة</label>
              <input type="text" placeholder="مثال: 310 م²" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 focus:ring-1 focus:ring-emerald-800" />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">السعر الصافي (ر.س) *</label>
              <input type="number" required placeholder="1450000" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-emerald-800 font-mono font-bold focus:ring-1 focus:ring-emerald-800" />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">الواجهة والشارع</label>
            <input type="text" placeholder="مثال: واجهة شمالية شارع 18م" value={form.facade} onChange={(e) => setForm({ ...form, facade: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 focus:ring-1 focus:ring-emerald-800" />
          </div>

          {/* Media Section */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
            <label className="block text-slate-800 font-bold flex items-center gap-1.5">
              <Image className="w-3.5 h-3.5 text-emerald-800" /><span>معرض صور الوحدة</span>
            </label>
            <div className="flex gap-2">
              <input type="url" placeholder="https://... أو رابط الصورة" value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-left font-mono text-xs" dir="ltr" />
              <button type="button" onClick={handleAddImageUrl} className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 rounded-lg text-slate-800 font-bold">إضافة</button>
            </div>
            {cloudName && uploadPreset && (
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 cursor-pointer font-bold">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploading ? 'جاري الرفع...' : 'رفع صورة من الجهاز (Cloudinary)'}</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} disabled={uploading} className="hidden" />
              </label>
            )}
            {images.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {images.map((img, idx) => (
                  <div key={idx} className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-slate-200 text-[11px]">
                    <span className="truncate max-w-[140px] font-mono" dir="ltr">{img}</span>
                    <button type="button" onClick={() => setImages(images.filter((_, i) => i !== idx))} className="text-rose-600 hover:text-rose-800"><Trash2 className="w-3 h-3" /></button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1"><Video className="w-3.5 h-3.5 text-slate-500" /><span>رابط فيديو (YouTube / Vimeo)</span></label>
              <input type="url" dir="ltr" placeholder="https://youtube.com/watch?v=..." value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 font-mono text-left focus:ring-1 focus:ring-emerald-800" />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1"><Compass className="w-3.5 h-3.5 text-slate-500" /><span>رابط جولة 3D (Matterport / Kuula)</span></label>
              <input type="url" dir="ltr" placeholder="https://my.matterport.com/show/?m=..." value={form.tour3dUrl} onChange={(e) => setForm({ ...form, tour3dUrl: e.target.value })} className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 font-mono text-left focus:ring-1 focus:ring-emerald-800" />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <button type="submit" disabled={loading} className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold transition flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-60">
              <Building className="w-3.5 h-3.5" /><span>{loading ? 'جاري الحفظ...' : 'حفظ الوحدة'}</span>
            </button>
            <button type="button" onClick={onClose} className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition">إلغاء</button>
          </div>
        </form>
      </div>
    </div>
  );
}