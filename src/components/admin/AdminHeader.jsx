import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, ExternalLink, Shield, User, Building2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { brand } from '../../data/projectData.js';

export default function AdminHeader() {
  const { user, logout } = useAuth();
  const [logoError, setLogoError] = useState(false);

  const roleTitles = {
    super_admin: 'مالك النظام',
    admin: 'مدير الشركة',
    editor: 'إدارة المحتوى',
    receptionist: 'مكتب الاستقبال',
    sales: 'مستشار مبيعات',
  };
  const roleTitle = roleTitles[user?.role] || 'مستخدم النظام';

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Badge */}
          <div className="flex items-center gap-3">
            <Link to="/admin" className="flex items-center gap-2">
              {!logoError ? (
                <img
                  src={brand.logo}
                  alt={brand.developer}
                  className="h-9 w-auto object-contain"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-emerald-900 text-amber-400 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
              )}
              <div className="hidden sm:block text-right">
                <span className="text-xs font-black font-heading text-white block leading-none">
                  {brand.developer}
                </span>
                <span className="text-[10px] font-bold text-emerald-400 block mt-0.5">
                  لوحة إدارة المبيعات والـ CRM
                </span>
              </div>
            </Link>

            <span className="text-slate-700 hidden sm:inline">|</span>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/80">
              <Shield className="w-3 h-3 text-emerald-400" />
              <span>{roleTitle}</span>
            </span>
          </div>

          {/* User profile & actions */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-300 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-bold">{user?.name || 'المستخدم'}</span>
            </div>

            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5 border border-slate-700"
              title="معاينة الموقع الحي"
            >
              <span>الموقع الحي</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={logout}
              className="px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 hover:text-rose-100 text-xs font-bold transition flex items-center gap-1.5 border border-rose-800/60"
              title="تسجيل الخروج"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
