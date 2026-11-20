import { DollarSign, Building, Users, TrendingUp } from 'lucide-react';

const fmt = (n) => new Intl.NumberFormat('en-US').format(n);

export default function ExecutiveStats({ units = [], leadsSummary = {}, role = 'admin' }) {
  const showFinancials = !['receptionist', 'editor'].includes(role);

  // 1. Total Sold Value
  const soldUnits = units.filter((u) => u.status === 'sold');
  const totalSoldValue = soldUnits.reduce((acc, u) => acc + (Number(u.price) || 0), 0);

  // 2. Available vs Reserved
  const availableCount = units.filter((u) => u.status === 'available').length;
  const reservedCount = units.filter((u) => u.status === 'reserved').length;

  // 3. Leads Total
  const totalLeads = leadsSummary.total || 0;
  const closedLeads = leadsSummary.closed || 0;

  // 4. Conversion Rate
  const conversionRate = totalLeads > 0 ? ((closedLeads / totalLeads) * 100).toFixed(1) : 0;

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 ${showFinancials ? 'lg:grid-cols-4' : 'lg:grid-cols-2'} gap-4 mb-8`}>
      {/* 1. Sold Value (Hidden for Receptionist & Editor) */}
      {showFinancials && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400">إجمالي المبيعات المحققة</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800/60 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-white font-heading">{fmt(totalSoldValue)}</span>
              <span className="text-xs font-bold text-emerald-400">ر.س</span>
            </div>
            <span className="text-[11px] text-slate-500 block mt-1">
              تم إفراغ {soldUnits.length} وحدة دوبلكس
            </span>
          </div>
        </div>
      )}

      {/* 2. Units Inventory */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-400">مخزون الوحدات السكنية</span>
          <div className="w-9 h-9 rounded-xl bg-amber-950 text-amber-400 border border-amber-800/60 flex items-center justify-center">
            <Building className="w-5 h-5" />
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-400 font-heading">{availableCount}</span>
            <span className="text-xs text-slate-400">متاح</span>
            <span className="text-slate-600">/</span>
            <span className="text-xl font-black text-amber-400 font-heading">{reservedCount}</span>
            <span className="text-xs text-slate-400">محجوز</span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">
            من إجمالي {units.length} وحدة بالمشروع
          </span>
        </div>
      </div>

      {/* 3. Total Leads */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-400">إجمالي طلبات العملاء</span>
          <div className="w-9 h-9 rounded-xl bg-blue-950 text-blue-400 border border-blue-800/60 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-white font-heading">{totalLeads}</span>
            <span className="text-xs font-bold text-slate-400">عميل مسجل</span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">
            {leadsSummary.prospective || 0} استفسار | {leadsSummary.reserved || 0} حجز بانتظار التمويل
          </span>
        </div>
      </div>

      {/* 4. Conversion Rate (Hidden for Receptionist & Editor) */}
      {showFinancials && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400">معدل إغلاق الصفقات</span>
            <div className="w-9 h-9 rounded-xl bg-purple-950 text-purple-400 border border-purple-800/60 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-white font-heading">{conversionRate}%</span>
              <span className="text-xs font-bold text-emerald-400">نسبة التحويل</span>
            </div>
            <span className="text-[11px] text-slate-500 block mt-1">
              {closedLeads} صفقات شراء مؤكدة
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
