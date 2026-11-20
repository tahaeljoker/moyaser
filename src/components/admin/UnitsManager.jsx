import { useState, useMemo } from 'react';
import { Building, Save, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { deleteUnit } from '../../services/api.js';
import StatusBadge from '../ui/StatusBadge.jsx';
import AddUnitModal from './AddUnitModal.jsx';

export default function UnitsManager({ units = [], onUpdateUnit, onRefresh }) {
  const { user } = useAuth();
  const canAdd = ['super_admin', 'admin', 'editor'].includes(user?.role);
  const canDelete = ['super_admin', 'admin'].includes(user?.role);

  const [statusFilter, setStatusFilter] = useState('all');
  const [modelFilter, setModelFilter] = useState('all');
  const [editingPrices, setEditingPrices] = useState({});
  const [savingCode, setSavingCode] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredUnits = useMemo(() => {
    return units.filter((u) => {
      const matchStatus = statusFilter === 'all' || u.status === statusFilter;
      const matchModel = modelFilter === 'all' || u.model === modelFilter;
      return matchStatus && matchModel;
    });
  }, [units, statusFilter, modelFilter]);

  const handleStatusChange = async (unitCode, newStatus) => {
    try { await onUpdateUnit(unitCode, { status: newStatus }); } catch (err) { alert(err.message || 'فشل تحديث حالة الوحدة.'); }
  };

  const handleSavePrice = async (unitCode) => {
    const numPrice = Number(editingPrices[unitCode]);
    if (isNaN(numPrice) || numPrice <= 0) {
      alert('يرجى إدخال سعر صحيح بالريال السعودي.');
      return;
    }
    setSavingCode(unitCode);
    try {
      await onUpdateUnit(unitCode, { price: numPrice });
      const next = { ...editingPrices };
      delete next[unitCode];
      setEditingPrices(next);
    } catch (err) {
      alert(err.message || 'فشل تحديث سعر الوحدة.');
    } finally {
      setSavingCode(null);
    }
  };

  const handleDeleteUnit = async (unitCode) => {
    if (!window.confirm(`هل أنت متأكد من حذف الوحدة (${unitCode}) نهائياً من النظام؟`)) return;
    try {
      await deleteUnit(unitCode);
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(err.message || 'فشل حذف الوحدة.');
    }
  };

  return (
    <div className="bg-slate-900/90 rounded-3xl border border-slate-800/90 p-5 sm:p-7 shadow-2xl text-slate-100 backdrop-blur-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-black font-heading text-white tracking-tight">
            إدارة مخزون الوحدات السكنية ({units.length} وحدة)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            تحديث الحالات والأسعار، وإضافة وحدات حقيقية أو حذفها من قاعدة البيانات الحية.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {canAdd && (
            <button
              onClick={() => setShowAddModal(true)}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-900 to-emerald-800 hover:from-emerald-800 hover:to-emerald-700 text-white text-xs font-bold transition flex items-center gap-2 shadow-md border border-emerald-700/60 active:scale-95"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>إضافة وحدة جديدة</span>
            </button>
          )}

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-bold text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-700"
          >
            <option value="all">جميع الحالات</option>
            <option value="available">المتاحة فقط</option>
            <option value="reserved">المحجوزة</option>
            <option value="sold">تم البيع والإفراغ</option>
          </select>

          <select
            value={modelFilter}
            onChange={(e) => setModelFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-bold text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-700"
          >
            <option value="all">جميع النماذج</option>
            {['A', 'B', 'C', 'D', 'E', 'F'].map((m) => (
              <option key={m} value={m}>نموذج {m}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredUnits.length === 0 ? (
        <div className="text-center py-14 bg-slate-950/40 rounded-2xl border border-slate-800/80 text-sm font-bold text-slate-400">
          لا توجد وحدات مطابقة للفلتر المحدد
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-800/80">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-950/70 text-slate-400 font-bold border-b border-slate-800/80">
              <tr>
                <th className="py-3.5 px-4">كود الوحدة</th>
                <th className="py-3.5 px-4">النموذج</th>
                <th className="py-3.5 px-4">المساحة</th>
                <th className="py-3.5 px-4">الواجهة</th>
                <th className="py-3.5 px-4">السعر (ر.س)</th>
                <th className="py-3.5 px-4">الحالة الحالية</th>
                <th className="py-3.5 px-4 text-center">تحديث الحالة</th>
                {canDelete && <th className="py-3.5 px-4 text-center">حذف</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
              {filteredUnits.map((u) => {
                const isPriceEditing = editingPrices[u.unitCode] !== undefined;
                const currentPriceVal = isPriceEditing ? editingPrices[u.unitCode] : u.price;

                return (
                  <tr key={u.unitCode} className="hover:bg-slate-800/50 transition">
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-mono font-black text-amber-300 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                        {u.unitCode}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">نموذج {u.model}</td>
                    <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">{u.area}</td>
                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">{u.facade || 'شمالية شارع 18م'}</td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          value={currentPriceVal}
                          onChange={(e) => setEditingPrices({ ...editingPrices, [u.unitCode]: e.target.value })}
                          className="w-28 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono font-bold text-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                        />
                        {isPriceEditing && (
                          <button
                            onClick={() => handleSavePrice(u.unitCode)}
                            disabled={savingCode === u.unitCode}
                            className="p-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white transition flex-shrink-0"
                            title="حفظ السعر"
                          >
                            <Save className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={u.status} />
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <select
                        value={u.status}
                        onChange={(e) => handleStatusChange(u.unitCode, e.target.value)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border focus:outline-none focus:ring-2 focus:ring-emerald-700 shadow-sm ${
                          u.status === 'available'
                            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80'
                            : u.status === 'reserved'
                            ? 'bg-amber-950/80 text-amber-300 border-amber-800/80'
                            : 'bg-slate-950 text-slate-400 border-slate-800'
                        }`}
                      >
                        <option value="available" className="bg-slate-900 text-emerald-300">متاح للبيع</option>
                        <option value="reserved" className="bg-slate-900 text-amber-300">محجوز</option>
                        <option value="sold" className="bg-slate-900 text-slate-400">تم البيع والإفراغ</option>
                      </select>
                    </td>
                    {canDelete && (
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => handleDeleteUnit(u.unitCode)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition"
                          title="حذف الوحدة"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <AddUnitModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onUnitCreated={() => {
          if (onRefresh) onRefresh();
        }}
      />
    </div>
  );
}
