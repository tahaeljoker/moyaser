import { useState, useEffect } from 'react';
import { UserPlus, RefreshCw, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { fetchAdminUsers, createAdminUser, updateAdminUser } from '../../services/api.js';

const ROLE_BADGES = {
  super_admin: { label: 'مالك النظام', cls: 'bg-purple-50 text-purple-800 border-purple-200' },
  admin: { label: 'مدير الشركة', cls: 'bg-amber-50 text-amber-800 border-amber-200' },
  editor: { label: 'إدارة المحتوى', cls: 'bg-sky-50 text-sky-800 border-sky-200' },
  receptionist: { label: 'مكتب الاستقبال', cls: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  sales: { label: 'مستشار مبيعات', cls: 'bg-blue-50 text-blue-800 border-blue-200' },
};

export default function UsersManager() {
  const { user: currentUser } = useAuth();
  const isSuperAdmin = currentUser?.role === 'super_admin';

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', role: 'sales' });

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchAdminUsers();
      if (res?.users) setUsers(res.users);
    } catch (err) {
      setError(err.message || 'تعذر تحميل بيانات المستخدمين.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const handleToggleActive = async (targetUser) => {
    if (targetUser.role === 'super_admin' && !isSuperAdmin) {
      alert('لا يمكن تعديل حالة حساب مالك النظام.');
      return;
    }
    try {
      setActionLoading(true);
      const nextStatus = !targetUser.isActive;
      await updateAdminUser(targetUser.id, { isActive: nextStatus });
      setUsers((prev) => prev.map((u) => (u.id === targetUser.id ? { ...u, isActive: nextStatus } : u)));
      setSuccess(`تم ${nextStatus ? 'تفعيل' : 'تعطيل'} حساب ${targetUser.name}.`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message || 'فشل تحديث حالة المستخدم.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      setError(null);
      const res = await createAdminUser(form);
      if (res?.user) {
        setUsers((prev) => [res.user, ...prev]);
        setShowAddModal(false);
        setForm({ name: '', email: '', phone: '', password: '', role: 'sales' });
        setSuccess('تم إنشاء حساب المستخدم بنجاح.');
        setTimeout(() => setSuccess(null), 4000);
      }
    } catch (err) {
      setError(err.message || 'تعذر إضافة المستخدم.');
    } finally {
      setActionLoading(false);
    }
  };

  const activeSalesCount = users.filter((u) => u.isActive && u.role === 'sales').length;
  const totalLeads = users.reduce((acc, u) => acc + (u.assignedLeadsCount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold font-heading text-slate-900">إدارة فريق العمل والصلاحيات (5-Tier RBAC)</h2>
          <p className="text-xs text-slate-500 mt-0.5">توزيع الأدوار الوظيفية وإدارة استقبال مبيعات التاون هاوس.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={loadUsers} disabled={loading} className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={() => setShowAddModal(true)} className="py-2.5 px-4 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95">
            <UserPlus className="w-4 h-4 text-amber-300" />
            <span>إضافة عضو جديد</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-500 block">إجمالي أعضاء الفريق</span>
          <span className="text-xl font-black text-slate-900 font-heading mt-1 block">{users.length} مستخدم</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-emerald-800 block">مستشاري المبيعات النشطين</span>
          <span className="text-xl font-black text-emerald-950 font-heading mt-1 block">{activeSalesCount} مستشار</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-500 block">إجمالي الطلبات المسندة</span>
          <span className="text-xl font-black text-amber-900 font-heading mt-1 block">{totalLeads} طلب</span>
        </div>
      </div>

      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-bold">{error}</div>}
      {success && <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold">{success}</div>}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-heading">
              <tr>
                <th className="py-3 px-4">العضو / البريد</th>
                <th className="py-3 px-4">الصلاحية الوظيفية</th>
                <th className="py-3 px-4">الجوال</th>
                <th className="py-3 px-4 text-center">الطلبات المسندة</th>
                <th className="py-3 px-4 text-center">الحالة</th>
                <th className="py-3 px-4 text-center">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => {
                const b = ROLE_BADGES[u.role] || ROLE_BADGES.sales;
                const canModify = isSuperAdmin || u.role !== 'super_admin';
                return (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block">{u.name}</span>
                      <span className="text-[10px] text-slate-400 block">{u.email}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${b.cls}`}>{b.label}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-600">{u.phone || '—'}</td>
                    <td className="py-3 px-4 text-center font-bold text-slate-800">{u.role === 'sales' ? u.assignedLeadsCount || 0 : '—'}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${u.isActive ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${u.isActive ? 'bg-emerald-600' : 'bg-slate-400'}`} />
                        <span>{u.isActive ? 'نشط' : 'معطل'}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {canModify ? (
                        <button onClick={() => handleToggleActive(u)} disabled={actionLoading} className={`text-[11px] font-bold px-3 py-1 rounded-lg border transition ${u.isActive ? 'border-red-200 text-red-600 hover:bg-red-50' : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'}`}>
                          {u.isActive ? 'تعطيل' : 'تفعيل'}
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-bold">محمي</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 shadow-2xl relative">
            <h3 className="text-base font-bold font-heading text-slate-900 mb-4">إضافة عضو جديد للفريق</h3>
            <form onSubmit={handleCreateUser} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">الاسم الكامل *</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="مثال: تركي الشمري" className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-800" />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">البريد الإلكتروني *</label>
                <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="user@muyassar-ra.com" className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-800" />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">رقم الجوال السعودي (إشعارات واتساب)</label>
                <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="05XXXXXXXX" className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-800 font-mono" />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">كلمة المرور المؤقتة *</label>
                <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="6 أحرف على الأقل" className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-800" />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">الصلاحية الوظيفية *</label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-800">
                  <option value="sales">مستشار مبيعات (Sales)</option>
                  <option value="receptionist">موظف استقبال (Receptionist)</option>
                  <option value="editor">مسؤول محتوى ووحدات (Editor)</option>
                  <option value="admin">مدير شركة (Admin)</option>
                  {isSuperAdmin && <option value="super_admin">مالك نظام ومطور (Super Admin)</option>}
                </select>
              </div>
              <div className="flex items-center gap-2 pt-3">
                <button type="submit" disabled={actionLoading} className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-bold transition shadow-sm">
                  {actionLoading ? 'جاري الحفظ...' : 'حفظ وإضافة'}
                </button>
                <button type="button" onClick={() => setShowAddModal(false)} className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition">
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
