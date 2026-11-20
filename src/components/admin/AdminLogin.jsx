import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowLeft, Building2, AlertCircle } from 'lucide-react';
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
      setError(err?.data?.message || err.message || 'بيانات الدخول غير صحيحة، يرجى التأكد من البريد وكلمة المرور.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 text-slate-100 selection:bg-emerald-800 selection:text-white" dir="rtl">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center mb-4">
          {!logoError ? (
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 inline-flex items-center justify-center">
              <img
                src={brand.logo}
                alt={brand.developer}
                className="h-14 w-auto object-contain"
                onError={() => setLogoError(true)}
              />
            </div>
          ) : (
            <div className="w-14 h-14 rounded-xl bg-emerald-900 text-amber-300 flex items-center justify-center">
              <Building2 className="w-7 h-7" />
            </div>
          )}
        </div>

        <h1 className="text-xl font-bold font-heading text-white">تسجيل الدخول</h1>
        <p className="mt-1 text-xs text-slate-400">
          لوحة التحكم — {brand.developer}
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900 border border-slate-800 py-6 px-5 sm:px-8 rounded-2xl shadow-lg">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/70 border border-rose-800/80 text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>البريد الإلكتروني</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@muyassar-ra.com"
                dir="ltr"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 transition text-left"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>كلمة المرور</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                dir="ltr"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 transition text-left"
              />
            </div>

            <div className="pt-1">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-60"
              >
                <span>{isSubmitting ? 'جاري التحقق...' : 'دخول'}</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="mt-5 pt-4 border-t border-slate-800 text-center">
            <Link
              to="/"
              className="text-xs text-slate-400 hover:text-slate-200 transition inline-flex items-center gap-1"
            >
              <span>العودة للموقع الرئيسي</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
