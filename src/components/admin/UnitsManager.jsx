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
    if (!window.confirm(`هل أنت متأكد من حذف الوحدة (${unitCode}) نهائياً؟`)) return;
    try {
      await deleteUnit(unitCode);
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(err.message || 'فشل حذف الوحدة.');
    }
  };

  const hasFilter = statusFilter !== 'all' || modelFilter !== 'all';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 text-slate-900 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-base sm:text-lg font-bold font-heading text-slate-900">الوحدات السكنية ({units.length})</h2>
          <p className="text-xs text-slate-500 mt-0.5">متابعة الحالات، تعديل الأسعار، ومواصفات النماذج.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {canAdd && (
            <button
              onClick={() => setShowAddModal(true)}
              className="py-2 px-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 text-amber-300" />
              <span>إضافة وحدة</span>
            </button>
          )}

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-800"
          >
            <option value="all">جميع الحالات</option>
            <option value="available">المتاح</option>
            <option value="reserved">المحجوز</option>
            <option value="sold">تم البيع</option>
          </select>

          <select
            value={modelFilter}
            onChange={(e) => setModelFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-800"
          >
            <option value="all">جميع النماذج</option>
            {['A', 'B', 'C', 'D', 'E', 'F'].map((m) => (
              <option key={m} value={m}>نموذج {m}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredUnits.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs font-medium text-slate-500">
          {hasFilter ? 'لا توجد وحدات مطابقة للفلتر المحدد' : 'لا توجد وحدات مسجلة حالياً'}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">الوحدة</th>
                <th className="py-3 px-3">النموذج</th>
                <th className="py-3 px-3">المساحة</th>
                <th className="py-3 px-3">الواجهة</th>
                <th className="py-3 px-3">السعر (ر.س)</th>
                <th className="py-3 px-3">الحالة</th>
                <th className="py-3 px-3 text-center">تعديل الحالة</th>
                {canDelete && <th className="py-3 px-3 text-center">حذف</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredUnits.map((u) => {
                const isPriceEditing = editingPrices[u.unitCode] !== undefined;
                const currentPriceVal = isPriceEditing ? editingPrices[u.unitCode] : u.price;

                return (
                  <tr key={u.unitCode} className="hover:bg-slate-50/75 transition">
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-[11px]">
                        {u.unitCode}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-800 whitespace-nowrap">نموذج {u.model}</td>
                    <td className="py-3 px-3 text-slate-600 whitespace-nowrap">{u.area}</td>
                    <td className="py-3 px-3 text-slate-500 whitespace-nowrap">{u.facade || 'شمالية'}</td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={currentPriceVal}
                          onChange={(e) => setEditingPrices({ ...editingPrices, [u.unitCode]: e.target.value })}
                          className="w-24 px-2 py-1 rounded bg-white border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                        />
                        {isPriceEditing && (
                          <button
                            onClick={() => handleSavePrice(u.unitCode)}
                            disabled={savingCode === u.unitCode}
                            className="p-1 rounded bg-emerald-800 hover:bg-emerald-700 text-white transition flex-shrink-0"
                            title="حفظ السعر"
                          >
                            <Save className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <StatusBadge status={u.status} />
                    </td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <select
                        value={u.status}
                        onChange={(e) => handleStatusChange(u.unitCode, e.target.value)}
                        className={`px-2 py-1 rounded-lg text-xs font-bold border focus:outline-none focus:ring-1 focus:ring-emerald-800 ${
                          u.status === 'available'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : u.status === 'reserved'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        <option value="available">متاح</option>
                        <option value="reserved">محجوز</option>
                        <option value="sold">تم البيع</option>
                      </select>
                    </td>
                    {canDelete && (
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <button
                          onClick={() => handleDeleteUnit(u.unitCode)}
                          className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="حذف الوحدة"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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
