import { Link } from 'react-router-dom';
import { Users, Building, UserCheck, Settings, ExternalLink, LogOut, X } from 'lucide-react';
import { brand } from '../../data/projectData.js';

export default function AdminSidebar({
  activeTab,
  onSelectTab,
  role,
  leadsCount = 0,
  unitsCount = 0,
  isOpen = false,
  onClose,
  onLogout,
}) {
  const canAccessCRM = ['super_admin', 'admin', 'receptionist', 'sales'].includes(role);
  const canAccessUnits = ['super_admin', 'admin', 'editor'].includes(role);
  const canAccessUsers = ['super_admin', 'admin'].includes(role);
  const canAccessSettings = ['super_admin', 'admin', 'editor'].includes(role);

  const navItems = [
    canAccessCRM && { id: 'leads', label: 'طلبات العملاء', icon: Users, count: leadsCount },
    canAccessUnits && { id: 'units', label: 'الوحدات', icon: Building, count: unitsCount },
    canAccessUsers && { id: 'users', label: 'فريق العمل', icon: UserCheck },
    canAccessSettings && { id: 'settings', label: 'الإعدادات', icon: Settings },
  ].filter(Boolean);

  const handleNavClick = (id) => {
    onSelectTab(id);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Fixed Right Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-screen w-64 bg-white border-l border-slate-200 z-50 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Top: Brand & Logo */}
        <div>
          <div className="h-16 px-5 border-b border-slate-100 flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-2.5">
              <img
                src={brand.logo}
                alt={brand.developer}
                className="h-8 w-auto object-contain"
              />
              <div className="text-right">
                <span className="text-xs font-bold font-heading text-slate-900 block leading-tight">
                  {brand.developer}
                </span>
                <span className="text-[10px] text-slate-500 font-medium block">
                  لوحة التحكم
                </span>
              </div>
            </Link>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 lg:hidden"
              aria-label="إغلاق القائمة"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-900 font-bold border-r-4 border-emerald-800'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-800' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.count !== undefined && item.count > 0 && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        isActive
                          ? 'bg-emerald-800 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-slate-100 space-y-1 bg-slate-50/50">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium transition"
          >
            <span>الموقع العام</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-rose-700 hover:bg-rose-50 font-medium transition"
          >
            <span>تسجيل الخروج</span>
            <LogOut className="w-3.5 h-3.5 text-rose-500" />
          </button>
        </div>
      </aside>
    </>
  );
}
