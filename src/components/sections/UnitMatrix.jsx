import { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Bell, Building, MessageCircle } from 'lucide-react';
import { models, brand } from '../../data/projectData.js';
import { units as fallbackUnits } from '../../data/unitsData.js';
import { fetchUnits } from '../../services/api.js';
import StatusBadge from '../ui/StatusBadge.jsx';

const fmt = (n) => new Intl.NumberFormat('en-US').format(n);

export default function UnitMatrix({ onSelectUnit }) {
  const [unitList, setUnitList] = useState(fallbackUnits || []);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [modelFilter, setModelFilter] = useState('all');

  useEffect(() => {
    let isMounted = true;
    fetchUnits()
      .then((res) => {
        if (isMounted) {
          if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
            const mapped = res.data.map((dbUnit) => ({
              id: dbUnit.unitCode || dbUnit._id,
              unitCode: dbUnit.unitCode,
              model: dbUnit.model,
              area: dbUnit.area,
              price: dbUnit.price,
              status: dbUnit.status,
              floor: dbUnit.floor,
              facade: dbUnit.facade,
            }));
            setUnitList(mapped);
          } else {
            setUnitList(fallbackUnits || []);
          }
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setUnitList(fallbackUnits || []);
          setLoading(false);
        }
      });

    return () => { isMounted = false; };
  }, []);

  const counts = useMemo(() => ({
    total: unitList.length,
    available: unitList.filter((u) => u.status === 'available').length,
    reserved: unitList.filter((u) => u.status === 'reserved').length,
    sold: unitList.filter((u) => u.status === 'sold').length,
  }), [unitList]);

  const filteredUnits = useMemo(() => {
    return unitList.filter((u) => {
      const uStatus = String(u.status || '').toLowerCase().trim();
      const uModel = String(u.model || '').toUpperCase().trim();
      const matchStatus = statusFilter === 'all' || uStatus === statusFilter.toLowerCase().trim();
      const matchModel = modelFilter === 'all' || uModel === modelFilter.toUpperCase().trim();
      return matchStatus && matchModel;
    });
  }, [unitList, statusFilter, modelFilter]);

  const notifyWaitlist = (unit) => {
    const code = unit.unitCode || unit.id;
    const waUrl = `https://api.whatsapp.com/send?phone=${brand.whatsapp}&text=${encodeURIComponent(
      `السلام عليكم، أرغب في تسجيلي بقائمة الانتظار للوحدة (${code}) نموذج ${unit.model} بمشروع تاون هاوس الشامخة بالدمام.`
    )}`;
    window.open(waUrl, '_blank');
  };

  return (
    <section id="matrix-section" className="py-14 md:py-20 bg-white border-b border-slate-200" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">تحديث فوري ومباشر</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              مصفوفة الوحدات السكنية ({unitList.length} وحدة) — تاون هاوس الشامخة
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              اختر وحدتك واستكشف المخطط الهندسي وأبعاد مسطحات البناء المعتمدة.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200/90 shadow-xs text-xs font-bold">
            <span className="text-slate-500 px-2">الإجمالي: {counts.total}</span>
            <span className="w-px h-4 bg-slate-200" />
            <span className="text-emerald-700 px-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> متاح: {counts.available}
            </span>
            <span className="w-px h-4 bg-slate-200" />
            <span className="text-amber-700 px-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> محجوز: {counts.reserved}
            </span>
            <span className="w-px h-4 bg-slate-200" />
            <span className="text-slate-600 px-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-400" /> مباع: {counts.sold}
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {[
              { key: 'all', label: 'كافة الحالات' },
              { key: 'available', label: 'المتاح فقط' },
              { key: 'reserved', label: 'المحجوز' },
              { key: 'sold', label: 'المباع' },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setStatusFilter(f.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${statusFilter === f.key
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label className="text-xs font-bold text-slate-600 whitespace-nowrap">النموذج:</label>
            <select
              value={modelFilter}
              onChange={(e) => setModelFilter(e.target.value)}
              className="w-full sm:w-48 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-800"
            >
              <option value="all">جميع النماذج (A–F)</option>
              {models.map((m) => (
                <option key={m.code} value={m.code}>نموذج {m.code} — {m.name}</option>
              ))}
            </select>
          </div>
        </div>

        {filteredUnits.length === 0 ? (
          <div className="py-12 text-center bg-white rounded-2xl border border-slate-200">
            <p className="text-sm font-bold text-slate-700 font-heading">لا توجد وحدات مطابقة للفلتر الحالي</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredUnits.map((u) => {
              const modelInfo = models.find((m) => m.code === u.model);
              const hasPrice = u.price && Number(u.price) > 0;
              return (
                <div
                  key={u.id}
                  className={`p-4 rounded-2xl border shadow-xs flex flex-col justify-between transition duration-200 ${u.status === 'available' ? 'border-emerald-200/80 bg-white hover:-translate-y-1 hover:shadow-md' : u.status === 'reserved' ? 'border-amber-200/70 bg-amber-50/20' : 'border-slate-200 bg-slate-50/60 opacity-75'
                    }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-lg bg-slate-900 text-amber-400 font-mono font-bold text-xs flex items-center justify-center">
                          {u.unitCode || u.id}
                        </span>
                        <span className="text-xs font-bold text-slate-900 font-heading">نموذج {u.model}</span>
                      </div>
                      <StatusBadge status={u.status} />
                    </div>
                    <div className="text-xs font-medium text-slate-800 mb-2 truncate">{modelInfo?.name || ''}</div>
                    <div className="space-y-1 text-[11px] text-slate-500">
                      <div className="flex justify-between"><span>المساحة</span><span className="font-bold text-slate-700">{u.area}</span></div>
                      <div className="flex justify-between">
                        <span>السعر</span>
                        <span className="font-bold text-emerald-900">
                          {hasPrice ? `${fmt(u.price)} ر.س` : 'تواصل لمعرفة السعر'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100">
                    {u.status === 'available' ? (
                      <button
                        onClick={() => onSelectUnit(u)}
                        className="w-full py-2 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <span>حجز معاينة للوحدة</span>
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => notifyWaitlist(u)}
                        className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center justify-center gap-1.5"
                      >
                        <Bell className="w-3.5 h-3.5 text-amber-600" />
                        <span>إشعار في حال الإتاحة</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
