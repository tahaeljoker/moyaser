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
    admin: 'مدير',
    editor: 'محرر محتوى',
    receptionist: 'استقبال',
    sales: 'مبيعات',
  };
  const roleTitle = roleTitles[user?.role] || 'مستخدم';

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Badge */}
          <div className="flex items-center gap-3">
            <Link to="/admin" className="flex items-center gap-2.5">
              {!logoError ? (
                <div className="p-1 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center">
                  <img
                    src={brand.logo}
                    alt={brand.developer}
                    className="h-8 w-auto object-contain"
                    onError={() => setLogoError(true)}
                  />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-lg bg-emerald-900 text-amber-300 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
              )}
              <div className="hidden sm:block text-right">
                <span className="text-xs font-bold text-white block leading-none font-heading">
                  {brand.developer}
                </span>
                <span className="text-[11px] text-slate-400 block mt-1">
                  لوحة التحكم
                </span>
              </div>
            </Link>

            <span className="text-slate-800 hidden sm:inline">|</span>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
              <Shield className="w-3 h-3 text-amber-400" />
              <span>{roleTitle}</span>
            </span>
          </div>

          {/* User profile & actions */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-300 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-medium text-slate-200">{user?.name || 'المستخدم'}</span>
            </div>

            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium transition flex items-center gap-1.5 border border-slate-700"
              title="معاينة الموقع"
            >
              <span>الموقع</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </Link>

            <button
              onClick={logout}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 hover:text-rose-300 text-slate-300 text-xs font-medium transition flex items-center gap-1.5 border border-slate-700"
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
