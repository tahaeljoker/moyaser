import { useState, useEffect } from 'react';
import { UserPlus, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { fetchAdminUsers, createAdminUser, updateAdminUser } from '../../services/api.js';

const ROLE_BADGES = {
  super_admin: { label: 'مالك النظام', cls: 'bg-purple-50 text-purple-800 border-purple-200' },
  admin: { label: 'مدير', cls: 'bg-amber-50 text-amber-800 border-amber-200' },
  editor: { label: 'محرر محتوى', cls: 'bg-sky-50 text-sky-800 border-sky-200' },
  receptionist: { label: 'استقبال', cls: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  sales: { label: 'مبيعات', cls: 'bg-blue-50 text-blue-800 border-blue-200' },
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
      alert('لا يمكن تعديل حساب مالك النظام.');
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
        setSuccess('تم إنشاء الحساب بنجاح.');
        setTimeout(() => setSuccess(null), 3000);
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
    <div className="space-y-4 text-slate-900">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-base sm:text-lg font-bold font-heading text-slate-900">فريق العمل</h2>
          <p className="text-xs text-slate-500 mt-0.5">إدارة حسابات المبيعات، الاستقبال، والمحتوى.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={loadUsers} disabled={loading} className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition" title="تحديث">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-800' : ''}`} />
          </button>
          <button onClick={() => setShowAddModal(true)} className="py-2 px-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs">
            <UserPlus className="w-3.5 h-3.5 text-amber-300" />
            <span>إضافة مستخدم</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block">إجمالي المستخدمين</span>
          <span className="text-xl font-bold text-slate-900 font-heading mt-1 block">{users.length} مستخدم</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block">مستشاري المبيعات النشطين</span>
          <span className="text-xl font-bold text-emerald-800 font-heading mt-1 block">{activeSalesCount} مستشار</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block">إجمالي الطلبات المسندة</span>
          <span className="text-xl font-bold text-amber-700 font-heading mt-1 block">{totalLeads} طلب</span>
        </div>
      </div>

      {error && <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">{error}</div>}
      {success && <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">{success}</div>}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold">
              <tr>
                <th className="py-3 px-4">المستخدم</th>
                <th className="py-3 px-4">الدور</th>
                <th className="py-3 px-4">الجوال</th>
                <th className="py-3 px-4 text-center">الطلبات المسندة</th>
                <th className="py-3 px-4 text-center">الحالة</th>
                <th className="py-3 px-4 text-center">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {users.map((u) => {
                const b = ROLE_BADGES[u.role] || ROLE_BADGES.sales;
                const canModify = isSuperAdmin || u.role !== 'super_admin';
                return (
                  <tr key={u.id} className="hover:bg-slate-50/75 transition">
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block text-xs">{u.name}</span>
                      <span className="text-[11px] text-slate-500 font-mono block mt-0.5">{u.email}</span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${b.cls}`}>{b.label}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-600 whitespace-nowrap" dir="ltr">{u.phone || '—'}</td>
                    <td className="py-3 px-4 text-center font-bold text-slate-800 font-mono">{u.role === 'sales' ? u.assignedLeadsCount || 0 : '—'}</td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium ${u.isActive ? 'text-emerald-700' : 'text-slate-400'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${u.isActive ? 'bg-emerald-600' : 'bg-slate-400'}`} />
                        <span>{u.isActive ? 'نشط' : 'معطل'}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {canModify ? (
                        <button onClick={() => handleToggleActive(u)} disabled={actionLoading} className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition ${u.isActive ? 'border-rose-200 text-rose-700 hover:bg-rose-50' : 'border-emerald-200 text-emerald-800 hover:bg-emerald-50'}`}>
                          {u.isActive ? 'تعطيل' : 'تفعيل'}
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400">محمي</span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-5 sm:p-6 shadow-xl relative text-slate-900">
            <h3 className="text-sm font-bold font-heading text-slate-900 mb-3">إضافة مستخدم جديد</h3>
            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-700 font-bold block mb-1">الاسم الكامل *</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="مثال: تركي الشمري" className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-800" />
              </div>
              <div>
                <label className="text-slate-700 font-bold block mb-1">البريد الإلكتروني *</label>
                <input type="email" required dir="ltr" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="user@muyassar-ra.com" className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-800 text-left" />
              </div>
              <div>
                <label className="text-slate-700 font-bold block mb-1">رقم الجوال (إشعارات واتساب)</label>
                <input type="text" dir="ltr" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="05XXXXXXXX" className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-800 font-mono text-left" />
              </div>
              <div>
                <label className="text-slate-700 font-bold block mb-1">كلمة المرور المؤقتة *</label>
                <input type="password" required dir="ltr" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="6 أحرف على الأقل" className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-800 text-left" />
              </div>
              <div>
                <label className="text-slate-700 font-bold block mb-1">الدور الوظيفي *</label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-800">
                  <option value="sales">مستشار مبيعات</option>
                  <option value="receptionist">استقبال</option>
                  <option value="editor">محرر محتوى ووحدات</option>
                  <option value="admin">مدير</option>
                  {isSuperAdmin && <option value="super_admin">مالك النظام</option>}
                </select>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <button type="submit" disabled={actionLoading} className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold transition shadow-xs disabled:opacity-60">
                  {actionLoading ? 'جاري الحفظ...' : 'حفظ المستخدم'}
                </button>
                <button type="button" onClick={() => setShowAddModal(false)} className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition">
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
