import { useState, useMemo } from 'react';
import { Plus, Trash2, Download, Edit3, Image, Video, Compass } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { deleteUnit } from '../../services/api.js';
import { exportToCsv } from '../../utils/exportCsv.js';
import StatusBadge from '../ui/StatusBadge.jsx';
import AddUnitModal from './AddUnitModal.jsx';
import EditUnitModal from './EditUnitModal.jsx';

const statusMap = { available: 'متاح', reserved: 'محجوز', sold: 'تم البيع' };
const typeMap = { townhouse: 'تاون هاوس', apartment: 'شقة سكنية' };

export default function UnitsManager({ units = [], onUpdateUnit, onRefresh }) {
  const { user } = useAuth();
  const isAdmin = ['super_admin', 'admin'].includes(user?.role);
  const canAdd = ['super_admin', 'admin', 'editor'].includes(user?.role);
  const canDelete = isAdmin;

  const [statusFilter, setStatusFilter] = useState('all');
  const [modelFilter, setModelFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUnit, setEditingUnit] = useState(null);

  const filteredUnits = useMemo(() => {
    return units.filter((u) => {
      const matchStatus = statusFilter === 'all' || u.status === statusFilter;
      const matchModel = modelFilter === 'all' || u.model === modelFilter;
      return matchStatus && matchModel;
    });
  }, [units, statusFilter, modelFilter]);

  const handleExport = () => {
    const headers = ['كود الوحدة', 'النموذج', 'النوع', 'المساحة', 'الواجهة', 'السعر (ر.س)', 'الحالة', 'الصور', 'فيديو', '3D'];
    const rows = filteredUnits.map((u) => [
      u.unitCode, `نموذج ${u.model}`, typeMap[u.type] || u.type, u.area, u.facade || 'شمالية', u.price, statusMap[u.status] || u.status,
      u.media?.images?.length || 0, u.media?.videoUrl ? 'نعم' : 'لا', u.media?.tour3dUrl ? 'نعم' : 'لا',
    ]);
    exportToCsv(`muyassar-units-${new Date().toISOString().slice(0, 10)}`, headers, rows);
  };

  const handleDeleteUnit = async (unitCode) => {
    if (!window.confirm(`هل أنت متأكد من حذف الوحدة (${unitCode}) نهائياً؟`)) return;
    try {
      await deleteUnit(unitCode);
      if (onRefresh) onRefresh();
    } catch (err) { alert(err.message || 'فشل حذف الوحدة.'); }
  };

  const hasFilter = statusFilter !== 'all' || modelFilter !== 'all';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 text-slate-900 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-base sm:text-lg font-bold font-heading text-slate-900">الوحدات السكنية ({units.length})</h2>
          <p className="text-xs text-slate-500 mt-0.5">متابعة الحالات، تعديل الأسعار، ومواصفات النماذج والوسائط 3D.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isAdmin && (
            <button onClick={handleExport} className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 border border-slate-200" title="تصدير ملف إكسل">
              <Download className="w-3.5 h-3.5 text-slate-600" /><span>تصدير إكسل</span>
            </button>
          )}

          {canAdd && (
            <button onClick={() => setShowAddModal(true)} className="py-2 px-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs">
              <Plus className="w-3.5 h-3.5 text-amber-300" /><span>إضافة وحدة</span>
            </button>
          )}

          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-800">
            <option value="all">جميع الحالات</option>
            <option value="available">المتاح</option>
            <option value="reserved">المحجوز</option>
            <option value="sold">تم البيع</option>
          </select>

          <select value={modelFilter} onChange={(e) => setModelFilter(e.target.value)} className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-800">
            <option value="all">جميع النماذج</option>
            {['A', 'B', 'C', 'D', 'E', 'F'].map((m) => (<option key={m} value={m}>نموذج {m}</option>))}
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
                <th className="py-3 px-3">السعر (ر.س)</th>
                <th className="py-3 px-3">الوسائط</th>
                <th className="py-3 px-3">الحالة</th>
                <th className="py-3 px-3 text-center">الإجراءات</th>
                {canDelete && <th className="py-3 px-3 text-center">حذف</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredUnits.map((u) => {
                const imgCount = u.media?.images?.length || 0;
                const hasVideo = Boolean(u.media?.videoUrl);
                const has3d = Boolean(u.media?.tour3dUrl);

                return (
                  <tr key={u.unitCode} className="hover:bg-slate-50/75 transition">
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-[11px]">{u.unitCode}</span>
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-800 whitespace-nowrap">نموذج {u.model}</td>
                    <td className="py-3 px-3 text-slate-600 whitespace-nowrap">{u.area}</td>
                    <td className="py-3 px-3 whitespace-nowrap font-mono font-bold text-emerald-800">{Number(u.price).toLocaleString('en-US')}</td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        {imgCount > 0 ? (
                          <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200" title={`${imgCount} صور`}>
                            <Image className="w-3 h-3" /><span>{imgCount}</span>
                          </span>
                        ) : null}
                        {hasVideo && <Video className="w-3.5 h-3.5 text-sky-600" title="يوجد فيديو" />}
                        {has3d && <Compass className="w-3.5 h-3.5 text-purple-600" title="يوجد جولة 3D" />}
                        {imgCount === 0 && !hasVideo && !has3d && <span className="text-slate-400">—</span>}
                      </div>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <StatusBadge status={u.status} />
                    </td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <button onClick={() => setEditingUnit(u)} className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold border border-slate-200 inline-flex items-center gap-1 transition" title="تعديل الوحدة">
                        <Edit3 className="w-3 h-3 text-slate-600" /><span>تعديل</span>
                      </button>
                    </td>
                    {canDelete && (
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <button onClick={() => handleDeleteUnit(u.unitCode)} className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition" title="حذف الوحدة">
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

      <AddUnitModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onUnitCreated={() => { if (onRefresh) onRefresh(); }} />
      <EditUnitModal unit={editingUnit} isOpen={Boolean(editingUnit)} onClose={() => setEditingUnit(null)} onUnitUpdated={() => { if (onRefresh) onRefresh(); }} />
    </div>
  );
}