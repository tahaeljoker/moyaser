import { useEffect, useState } from 'react';
import { Wrench, Search, Upload, Trash2, Send, CheckCircle2, AlertCircle, Calendar, FileText } from 'lucide-react';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import FloatingWhatsApp from '../components/ui/FloatingWhatsApp.jsx';

const envUrl = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = (import.meta.env.PROD && (!envUrl || envUrl.includes('localhost'))) ? '/api' : (envUrl || '/api');

const STATUS_LABELS = {
  new: 'جديد — قيد المراجعة',
  scheduled: 'تم تحديد موعد الزيارة',
  inprogress: 'جاري التنفيذ',
  done: 'مكتمل',
  cancelled: 'ملغي',
};

export default function MaintenancePage() {
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({ unitNumber: '', customerName: '', customerPhone: '', description: '' });
  const [attachments, setAttachments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitResult, setSubmitResult] = useState(null);

  const [trackQuery, setTrackQuery] = useState({ unitNumber: '', customerPhone: '' });
  const [tracking, setTracking] = useState(false);
  const [trackError, setTrackError] = useState('');
  const [trackResult, setTrackResult] = useState(null);

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = '';
    if (!files.length || !cloudName || !uploadPreset) return;
    setUploadError('');
    setUploading(true);
    try {
      const uploaded = [];
      for (const file of files) {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('upload_preset', uploadPreset);
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, { method: 'POST', body: fd });
        const data = await res.json();
        if (!res.ok || !data?.secure_url) throw new Error('upload_failed');
        uploaded.push(data.secure_url);
      }
      setAttachments((prev) => [...prev, ...uploaded]);
    } catch {
      setUploadError('تعذر رفع المرفق عبر خدمة Cloudinary، يرجى المحاولة مرة أخرى.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitResult(null);
    const unitNumber = form.unitNumber.trim();
    const customerName = form.customerName.trim();
    const customerPhone = form.customerPhone.trim();
    const description = form.description.trim();

    if (!unitNumber) return setSubmitError('يرجى إدخال رقم الوحدة.');
    if (!customerName) return setSubmitError('يرجى إدخال الاسم الكامل.');
    if (!customerPhone || customerPhone.replace(/[\s\-()]/g, '').length < 8) {
      return setSubmitError('يرجى إدخال رقم جوال صحيح.');
    }
    if (!description) return setSubmitError('يرجى كتابة وصف طلب الصيانة.');

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL.replace(/\/$/, '')}/maintenance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ unitNumber, customerName, customerPhone, description, attachments }),
      });
      const data = await res.json();
      if (!res.ok) return setSubmitError(data?.message || 'تعذر إرسال طلب الصيانة.');
      setSubmitResult({ id: data.id, status: data.status, message: data.message });
      setForm({ unitNumber: '', customerName: '', customerPhone: '', description: '' });
      setAttachments([]);
    } catch {
      setSubmitError('حدث خطأ أثناء الاتصال بالخادم، يرجى المحاولة لاحقاً.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTrack = async (e) => {
    e.preventDefault();
    setTrackError('');
    setTrackResult(null);
    const unitNumber = trackQuery.unitNumber.trim();
    const customerPhone = trackQuery.customerPhone.trim();
    if (!unitNumber || !customerPhone) {
      return setTrackError('يرجى إدخال رقم الوحدة ورقم الجوال للمتابعة.');
    }

    setTracking(true);
    try {
      const params = new URLSearchParams({ unitNumber, customerPhone });
      const res = await fetch(`${API_BASE_URL.replace(/\/$/, '')}/maintenance/track?${params.toString()}`);
      const data = await res.json();
      if (res.status === 404 || !res.ok || !data?.data) {
        return setTrackError('لم يتم العثور على طلب صيانة مطابق لرقم الوحدة ورقم الجوال المدخلين.');
      }
      setTrackResult(data.data);
    } catch {
      setTrackError('تعذر الاستعلام عن الطلب حالياً، يرجى المحاولة لاحقاً.');
    } finally {
      setTracking(false);
    }
  };

  const inputClass = 'w-full px-4 py-2.5 rounded-xl bg-white border border-[#e3dbc6] focus:border-[#0a2e23] focus:outline-hidden';

  return (
    <div className="min-h-screen bg-[#ece6d6] text-[#0a2e23] flex flex-col font-sans" dir="rtl">
      <Navbar />

      <section className="relative text-white pt-8 pb-10 sm:pt-10 sm:pb-12 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0b3a2c 0%, #06261c 100%)' }}>
        <div className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="max-w-4xl space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-[#c9ab68]/40 text-xs font-bold text-[#c9ab68] backdrop-blur-md">
              <Wrench className="w-3.5 h-3.5 text-[#c9ab68]" />
              <span>خدمات ما بعد البيع</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-[44px] font-black font-heading text-white" style={{ lineHeight: 1.65 }}>
              طلبات الصيانة والمتابعة
            </h1>
            <p className="text-xs sm:text-sm text-stone-200/90 max-w-2xl leading-relaxed">
              خدمة مخصصة لملاك الوحدات لرفع طلبات الصيانة الدورية أو الطارئة ومتابعة حالة التنفيذ وموعد الزيارة.
            </p>
          </div>
        </div>
      </section>

      <main className="flex-1 py-12 sm:py-16 pb-24 sm:pb-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8">
        <div className="bg-[#fbf9f3] p-6 sm:p-8 rounded-[14px] border border-[#e3dbc6] border-t-[4px] border-t-[#c9ab68] shadow-[0_20px_50px_-15px_rgba(6,38,28,0.16)]">
          <h2 className="text-xl sm:text-2xl font-black font-heading text-[#0a2e23] mb-1.5" style={{ lineHeight: 1.7 }}>
            رفع طلب صيانة جديد
          </h2>
          <p className="text-xs text-slate-600 mb-6">يرجى تعبئة بيانات الوحدة ووصف الملاحظة بدقة لتسهيل خدمة فريق الصيانة.</p>

          {submitResult && (
            <div className="p-4 mb-5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-1">
              <div className="flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                <span>{submitResult.message || 'تم استلام طلب الصيانة بنجاح.'}</span>
              </div>
              <p className="pr-7">
                رقم الطلب: <span className="font-mono font-bold select-all" dir="ltr">{submitResult.id}</span>
              </p>
            </div>
          )}

          {submitError && (
            <div className="p-4 mb-5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-700 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#0a2e23] font-bold mb-1.5">رقم الوحدة *</label>
                <input type="text" required placeholder="مثال: A-101" value={form.unitNumber} onChange={(e) => setForm({ ...form, unitNumber: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="block text-[#0a2e23] font-bold mb-1.5">رقم الجوال *</label>
                <input type="tel" required placeholder="05XXXXXXXX" dir="ltr" value={form.customerPhone} onChange={(e) => setForm({ ...form, customerPhone: e.target.value })} className={`${inputClass} font-mono text-right tabular-nums`} />
              </div>
            </div>

            <div>
              <label className="block text-[#0a2e23] font-bold mb-1.5">الاسم الكامل *</label>
              <input type="text" required placeholder="الاسم الثلاثي..." value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} className={inputClass} />
            </div>

            <div>
              <label className="block text-[#0a2e23] font-bold mb-1.5">وصف طلب الصيانة *</label>
              <textarea rows={4} required placeholder="اشرح المشكلة أو الملاحظة ومكانها داخل الوحدة..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputClass} />
            </div>

            <div>
              <label className="block text-[#0a2e23] font-bold mb-1.5">مرفقات اختيارية (صور أو ملفات PDF)</label>
              {cloudName && uploadPreset ? (
                <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-dashed border-[#c9ab68] text-[#0a2e23] font-bold cursor-pointer hover:bg-[#f4efe2] transition-colors">
                  <Upload className="w-4 h-4 text-[#0b3a2c]" />
                  <span>{uploading ? 'جاري رفع المرفقات...' : 'اختيار صور أو PDF من الجهاز'}</span>
                  <input type="file" accept="image/*,.pdf,application/pdf" multiple onChange={handleFileUpload} disabled={uploading} className="hidden" />
                </label>
              ) : (
                <p className="text-[11px] text-slate-500">خدمة رفع المرفقات غير مفعلة حالياً في البيئة المحلية.</p>
              )}
              {uploadError && <p className="text-rose-700 mt-1.5">{uploadError}</p>}
              {attachments.length > 0 && (
                <ul className="mt-3 space-y-1.5">
                  {attachments.map((url, idx) => (
                    <li key={url + idx} className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-white border border-[#e3dbc6]">
                      <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[#0b3a2c] hover:underline truncate">
                        <FileText className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">مرفق {idx + 1}</span>
                      </a>
                      <button type="button" onClick={() => setAttachments((prev) => prev.filter((_, i) => i !== idx))} className="text-rose-700 hover:text-rose-900 p-1" aria-label="حذف المرفق">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button type="submit" disabled={submitting || uploading} className="w-full py-3 rounded-[8px] bg-[#0b3a2c] hover:bg-[#06261c] border border-[#c9ab68]/40 text-white font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-xs disabled:opacity-60">
              <Send className="w-4 h-4 text-[#c9ab68]" />
              <span>{submitting ? 'جاري الإرسال...' : 'إرسال طلب الصيانة'}</span>
            </button>
          </form>
        </div>

        <div className="bg-[#fbf9f3] p-6 sm:p-8 rounded-[14px] border border-[#e3dbc6] shadow-[0_12px_32px_-12px_rgba(6,38,28,0.12)]">
          <h2 className="text-lg sm:text-xl font-black font-heading text-[#0a2e23] mb-1.5" style={{ lineHeight: 1.7 }}>
            متابعة حالة طلب الصيانة
          </h2>
          <p className="text-xs text-slate-600 mb-5">أدخل رقم الوحدة ورقم الجوال المسجل في الطلب للاطلاع على آخر التحديثات.</p>

          <form onSubmit={handleTrack} noValidate className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end text-xs">
            <div>
              <label className="block text-[#0a2e23] font-bold mb-1.5">رقم الوحدة *</label>
              <input type="text" required placeholder="مثال: A-101" value={trackQuery.unitNumber} onChange={(e) => setTrackQuery({ ...trackQuery, unitNumber: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-[#0a2e23] font-bold mb-1.5">رقم الجوال *</label>
              <input type="tel" required placeholder="05XXXXXXXX" dir="ltr" value={trackQuery.customerPhone} onChange={(e) => setTrackQuery({ ...trackQuery, customerPhone: e.target.value })} className={`${inputClass} font-mono text-right tabular-nums`} />
            </div>
            <button type="submit" disabled={tracking} className="py-2.5 px-5 rounded-[8px] bg-[#0b3a2c] hover:bg-[#06261c] border border-[#c9ab68]/40 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-60">
              <Search className="w-4 h-4 text-[#c9ab68]" />
              <span>{tracking ? 'جاري البحث...' : 'استعلام عن الطلب'}</span>
            </button>
          </form>

          {trackError && (
            <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-700 shrink-0" />
              <span>{trackError}</span>
            </div>
          )}

          {trackResult && (
            <div className="mt-5 p-4 rounded-xl bg-white border border-[#e3dbc6] text-xs space-y-2.5">
              <div className="flex items-center justify-between gap-2 border-b border-[#ece6d6] pb-2">
                <span className="text-slate-600 font-bold">حالة الطلب:</span>
                <span className="px-3 py-1 rounded-full bg-[#0b3a2c]/10 text-[#0b3a2c] font-bold">
                  {STATUS_LABELS[trackResult.status] || trackResult.status}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-600 font-bold flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#c9ab68]" />
                  <span>موعد الزيارة:</span>
                </span>
                <span className="font-bold text-[#0a2e23]">
                  {trackResult.appointmentDate
                    ? new Date(trackResult.appointmentDate).toLocaleString('ar-SA', { dateStyle: 'medium', timeStyle: 'short' })
                    : 'لم يحدد بعد'}
                </span>
              </div>
              {trackResult.appointmentNotes && (
                <div className="pt-1 border-t border-[#ece6d6]">
                  <span className="text-slate-600 font-bold block mb-1">ملاحظات الموعد:</span>
                  <p className="text-[#0a2e23] leading-relaxed">{trackResult.appointmentNotes}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
