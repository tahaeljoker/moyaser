import { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Bell, Building, MessageCircle } from 'lucide-react';
import { models, brand } from '../../data/projectData.js';
import { fetchUnits } from '../../services/api.js';
import StatusBadge from '../ui/StatusBadge.jsx';

const fmt = (n) => new Intl.NumberFormat('en-US').format(n);

export default function UnitMatrix({ onSelectUnit }) {
  const [unitList, setUnitList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [modelFilter, setModelFilter] = useState('all');

  useEffect(() => {
    let isMounted = true;
    fetchUnits()
      .then((res) => {
        if (isMounted) {
          if (res?.data && Array.isArray(res.data)) {
            const mapped = res.data.map((dbUnit) => {
              const rawId = dbUnit.unitCode?.replace('U-', '');
              const numId = parseInt(rawId, 10);
              return {
                id: isNaN(numId) ? dbUnit.unitCode : numId,
                unitCode: dbUnit.unitCode,
                model: dbUnit.model,
                area: dbUnit.area,
                price: dbUnit.price,
                status: dbUnit.status,
              };
            });
            setUnitList(mapped);
          } else {
            setUnitList([]);
          }
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setUnitList([]);
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
      const matchStatus = statusFilter === 'all' || u.status === statusFilter;
      const matchModel = modelFilter === 'all' || u.model === modelFilter;
      return matchStatus && matchModel;
    });
  }, [unitList, statusFilter, modelFilter]);

  const notifyWaitlist = (unit) => {
    const code = unit.unitCode || `U-${unit.id}`;
    const waUrl = `https://api.whatsapp.com/send?phone=${brand.whatsapp}&text=${encodeURIComponent(
      `السلام عليكم، أرغب في تسجيلي بقائمة الانتظار للوحدة (${code}) نموذج ${unit.model} بمشروع تاون هاوس الشامخة بالدمام.`
    )}`;
    window.open(waUrl, '_blank');
  };

  if (!loading && unitList.length === 0) {
    return (
      <section id="matrix-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/90 shadow-sm p-8 max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center mx-auto mb-4">
            <Building className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold font-heading text-slate-900 mb-2">سيتم طرح الوحدات السكنية قريباً</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            يجري حالياً تجهيز وإدراج الوحدات السكنية لمشروع تاون هاوس الشامخة. يمكنك التواصل المباشر للاستفسار وحجز أولوية الطرح.
          </p>
          <a
            href={`https://wa.me/${brand.whatsapp}?text=${encodeURIComponent('السلام عليكم، أود تسجيل رغبتي لحجز أولوية الطرح في مشروع تاون هاوس الشامخة.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-bold transition shadow-sm active:scale-95"
          >
            <MessageCircle className="w-4 h-4 text-amber-300" />
            <span>تواصل لحجز أولوية الطرح</span>
          </a>
        </div>
      </section>
    );
  }

  return (
    <section id="matrix-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200/60 mb-2">
            مخطط المبيعات الحي
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
            مصفوفة الوحدات السكنية ({unitList.length} تاون هاوس)
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-xl">
            استعرض حالة الوحدات لحظياً من قاعدة البيانات، واضغط على أي وحدة متاحة لحجزها مباشرة.
          </p>
        </div>

        <div className="grid grid-cols-4 gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm text-center">
          <div className="px-3 py-1.5">
            <span className="text-[10px] text-slate-500 block">إجمالي</span>
            <span className="text-sm font-black text-slate-900 font-heading">{counts.total}</span>
          </div>
          <div className="px-3 py-1.5 bg-emerald-50/70 rounded-xl border border-emerald-100">
            <span className="text-[10px] text-slate-500 block">متاح</span>
            <span className="text-sm font-black text-emerald-900 font-heading">{counts.available}</span>
          </div>
          <div className="px-3 py-1.5 bg-amber-50/70 rounded-xl border border-amber-100">
            <span className="text-[10px] text-slate-500 block">محجوز</span>
            <span className="text-sm font-black text-amber-900 font-heading">{counts.reserved}</span>
          </div>
          <div className="px-3 py-1.5 bg-slate-100 rounded-xl">
            <span className="text-[10px] text-slate-500 block">مباع</span>
            <span className="text-sm font-black text-slate-600 font-heading">{counts.sold}</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'جميع الحالات' },
            { id: 'available', label: 'المتاحة فقط' },
            { id: 'reserved', label: 'المحجوزة' },
            { id: 'sold', label: 'المباعة' },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setStatusFilter(s.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 whitespace-nowrap ${
                statusFilter === s.id ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>{s.label}</span>
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
            const displayCode = u.unitCode || `U-${u.id}`;
            return (
              <div
                key={u.id}
                className={`p-4 rounded-2xl border shadow-sm flex flex-col justify-between transition duration-200 ${
                  u.status === 'available' ? 'border-emerald-200/80 bg-white hover:-translate-y-1 hover:shadow-md' : u.status === 'reserved' ? 'border-amber-200/70 bg-amber-50/20' : 'border-slate-200 bg-slate-50/60 opacity-75'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="w-7 h-7 rounded-lg bg-slate-900 text-amber-400 font-heading font-black text-xs flex items-center justify-center">
                        {u.id}
                      </span>
                      <span className="text-xs font-bold text-slate-900 font-heading">نموذج {u.model}</span>
                    </div>
                    <StatusBadge status={u.status} />
                  </div>
                  <div className="text-xs font-medium text-slate-800 mb-2 truncate">{modelInfo?.name || ''}</div>
                  <div className="space-y-1 text-[11px] text-slate-500">
                    <div className="flex justify-between"><span>المساحة</span><span className="font-bold text-slate-700">{u.area}</span></div>
                    <div className="flex justify-between"><span>السعر</span><span className="font-bold text-emerald-900">{fmt(u.price)} ر.س</span></div>
                  </div>
                </div>

                {u.status === 'available' && (
                  <button onClick={() => onSelectUnit({ ...u, unitCode: displayCode })} className="w-full mt-3 py-2 bg-emerald-900 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 active:scale-95">
                    <span>طلب حجز الوحدة</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                )}
                {u.status === 'reserved' && (
                  <button onClick={() => notifyWaitlist(u)} className="w-full mt-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 active:scale-95">
                    <Bell className="w-3.5 h-3.5" />
                    <span>إشعار عند الإتاحة</span>
                  </button>
                )}
                {u.status === 'sold' && (
                  <div className="w-full mt-3 py-2 bg-slate-100 text-slate-400 rounded-xl text-xs text-center">تم الإفراغ والتمليك</div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
