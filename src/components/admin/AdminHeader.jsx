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
    <header className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800/90 text-slate-100 sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Badge */}
          <div className="flex items-center gap-3.5">
            <Link to="/admin" className="flex items-center gap-2.5 group">
              {!logoError ? (
                <div className="p-1.5 rounded-xl bg-slate-950/80 border border-slate-800 shadow-sm flex items-center justify-center transition group-hover:border-emerald-700/60">
                  <img
                    src={brand.logo}
                    alt={brand.developer}
                    className="h-8 w-auto object-contain"
                    onError={() => setLogoError(true)}
                  />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-xl bg-emerald-950 border border-emerald-800 text-amber-400 flex items-center justify-center shadow-sm">
                  <Building2 className="w-5 h-5" />
                </div>
              )}
              <div className="hidden sm:block text-right">
                <span className="text-xs font-black font-heading text-white block leading-none tracking-tight">
                  {brand.developer}
                </span>
                <span className="text-[10px] font-bold text-emerald-400 block mt-1">
                  لوحة إدارة المبيعات والـ CRM
                </span>
              </div>
            </Link>

            <span className="text-slate-800 hidden sm:inline">|</span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 shadow-sm">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>{roleTitle}</span>
            </span>
          </div>

          {/* User profile & actions */}
          <div className="flex items-center gap-2.5">
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-300 px-3.5 py-1.5 rounded-xl bg-slate-950/90 border border-slate-800 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-bold text-slate-200">{user?.name || 'المستخدم'}</span>
            </div>

            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-bold transition flex items-center gap-1.5 border border-slate-700/80 shadow-sm active:scale-95"
              title="معاينة الموقع الحي"
            >
              <span>الموقع الحي</span>
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            </Link>

            <button
              onClick={logout}
              className="px-3.5 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/70 text-rose-300 hover:text-rose-100 text-xs font-bold transition flex items-center gap-1.5 border border-rose-800/50 shadow-sm active:scale-95"
              title="تسجيل الخروج"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">خروج</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
