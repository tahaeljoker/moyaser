import { Menu, RefreshCw, User, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AdminHeader({
  activeTabTitle = 'لوحة التحكم',
  onRefresh,
  isLoadingData = false,
  onOpenMobileMenu,
}) {
  const { user } = useAuth();

  const roleTitles = {
    super_admin: 'مالك النظام',
    admin: 'مدير',
    editor: 'محرر محتوى',
    receptionist: 'استقبال',
    sales: 'مبيعات',
  };
  const roleTitle = roleTitles[user?.role] || 'مستخدم';

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between">
      {/* Right: Mobile toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 lg:hidden transition"
          aria-label="فتح القائمة"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="text-base sm:text-lg font-bold font-heading text-slate-900">
          {activeTabTitle}
        </h1>
      </div>

      {/* Left: Refresh & User Profile */}
      <div className="flex items-center gap-3">
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isLoadingData}
            className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition shadow-xs disabled:opacity-60"
            title="تحديث البيانات"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingData ? 'animate-spin text-emerald-800' : ''}`} />
          </button>
        )}

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold">
            <User className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-slate-800 hidden sm:inline">{user?.name || 'المستخدم'}</span>
          <span className="text-slate-300 hidden sm:inline">|</span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-white text-slate-700 border border-slate-200">
            <Shield className="w-3 h-3 text-amber-600" />
            <span>{roleTitle}</span>
          </span>
        </div>
      </div>
    </header>
  );
}
