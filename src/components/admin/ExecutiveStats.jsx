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
    <div className={`grid grid-cols-1 sm:grid-cols-2 ${showFinancials ? 'lg:grid-cols-4' : 'lg:grid-cols-2'} gap-3.5 mb-6`}>
      {/* 1. Sold Value */}
      {showFinancials && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">إجمالي المبيعات</span>
            <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-white font-heading">{fmt(totalSoldValue)}</span>
              <span className="text-xs text-slate-400">ر.س</span>
            </div>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              {soldUnits.length} وحدة مفرغة
            </span>
          </div>
        </div>
      )}

      {/* 2. Units Inventory */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-400">حالة الوحدات</span>
          <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 text-amber-400 flex items-center justify-center">
            <Building className="w-4 h-4 text-amber-400" />
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-emerald-400 font-heading">{availableCount}</span>
            <span className="text-xs text-slate-400">متاح</span>
            <span className="text-slate-700">/</span>
            <span className="text-lg font-bold text-amber-400 font-heading">{reservedCount}</span>
            <span className="text-xs text-slate-400">محجوز</span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-0.5">
            من إجمالي {units.length} وحدة
          </span>
        </div>
      </div>

      {/* 3. Total Leads */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-400">طلبات العملاء</span>
          <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 text-sky-400 flex items-center justify-center">
            <Users className="w-4 h-4 text-sky-400" />
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold text-white font-heading">{totalLeads}</span>
            <span className="text-xs text-slate-400">طلب</span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-0.5">
            {leadsSummary.prospective || 0} استفسار | {leadsSummary.reserved || 0} حجز
          </span>
        </div>
      </div>

      {/* 4. Conversion Rate */}
      {showFinancials && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">نسبة الإغلاق</span>
            <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 text-purple-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-purple-400" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-white font-heading">{conversionRate}%</span>
            </div>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              {closedLeads} تم شراؤها
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
