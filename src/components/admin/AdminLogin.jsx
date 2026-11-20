import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowLeft, Building2, AlertCircle, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { brand } from '../../data/projectData.js';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(email.trim(), password);
      navigate('/admin');
    } catch (err) {
      setError(err?.data?.message || err.message || 'بيانات الدخول غير صحيحة، يرجى المحاولة ثانية.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(6,78,59,0.25),rgba(2,44,34,0)_70%)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 text-slate-100 selection:bg-emerald-800 selection:text-white" dir="rtl">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center mb-5">
          {!logoError ? (
            <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl inline-flex items-center justify-center ring-1 ring-emerald-500/20 backdrop-blur-sm">
              <img
                src={brand.logo}
                alt={brand.developer}
                className="h-16 w-auto object-contain"
                onError={() => setLogoError(true)}
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-900 to-slate-900 border border-emerald-700/60 text-amber-400 flex items-center justify-center shadow-xl">
              <Building2 className="w-8 h-8" />
            </div>
          )}
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-800/60 text-[11px] font-bold text-emerald-300 mb-3 shadow-inner">
          <Shield className="w-3.5 h-3.5 text-amber-400" />
          <span>بوابة الدخول الموحدة للأنظمة التشغيلية</span>
        </div>

        <h2 className="text-2xl font-black font-heading text-white tracking-tight">
          لوحة إدارة المبيعات والـ CRM
        </h2>
        <p className="mt-1.5 text-xs text-slate-400 font-medium">
          شركة {brand.developer} — {brand.project}
        </p>
      </div>

      <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900/90 border border-slate-800/90 backdrop-blur-md py-8 px-6 sm:px-9 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-700 via-amber-400 to-emerald-700 opacity-80" />

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-950/70 border border-rose-800/80 text-rose-200 text-xs flex items-center gap-2.5 shadow-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>البريد الإلكتروني المعتمد</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@muyassar-ra.com"
                dir="ltr"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition text-left"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>كلمة المرور</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                dir="ltr"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition text-left"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-800 to-emerald-700 hover:from-emerald-700 hover:to-emerald-600 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 active:scale-[0.98] disabled:opacity-60 border border-emerald-600/40"
              >
                <span>{isSubmitting ? 'جاري التحقق من الصلاحيات...' : 'تسجيل الدخول للنظام'}</span>
                <ArrowLeft className="w-4 h-4 text-amber-300" />
              </button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
            <Link
              to="/"
              className="text-xs font-bold text-slate-400 hover:text-emerald-300 transition inline-flex items-center gap-1.5 group"
            >
              <span>العودة إلى واجهة العرض العامة للمشروع</span>
              <ArrowLeft className="w-3.5 h-3.5 text-emerald-400 group-hover:-translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
