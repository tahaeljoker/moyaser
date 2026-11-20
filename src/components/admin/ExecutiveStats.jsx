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
      {/* 1. Sold Value */}
      {showFinancials && (
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800/90 shadow-xl flex flex-col justify-between relative overflow-hidden group hover:border-emerald-700/60 transition">
          <div className="absolute top-0 inset-x-0 h-1 bg-emerald-500/80" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400">إجمالي المبيعات المحققة</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 flex items-center justify-center shadow-inner">
              <DollarSign className="w-5 h-5 text-amber-300" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-white font-heading tracking-tight">{fmt(totalSoldValue)}</span>
              <span className="text-xs font-bold text-amber-400">ر.س</span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium block mt-1">
              تم إفراغ {soldUnits.length} وحدة دوبلكس بالصك
            </span>
          </div>
        </div>
      )}

      {/* 2. Units Inventory */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800/90 shadow-xl flex flex-col justify-between relative overflow-hidden group hover:border-amber-700/60 transition">
        <div className="absolute top-0 inset-x-0 h-1 bg-amber-500/80" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-400">مخزون الوحدات السكنية</span>
          <div className="w-10 h-10 rounded-2xl bg-amber-950/80 text-amber-400 border border-amber-800/60 flex items-center justify-center shadow-inner">
            <Building className="w-5 h-5" />
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-400 font-heading tracking-tight">{availableCount}</span>
            <span className="text-xs text-slate-400 font-bold">متاح</span>
            <span className="text-slate-700">|</span>
            <span className="text-xl font-black text-amber-400 font-heading tracking-tight">{reservedCount}</span>
            <span className="text-xs text-slate-400 font-bold">محجوز</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium block mt-1">
            من إجمالي {units.length} وحدة معتمدة بالمشروع
          </span>
        </div>
      </div>

      {/* 3. Total Leads */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800/90 shadow-xl flex flex-col justify-between relative overflow-hidden group hover:border-sky-700/60 transition">
        <div className="absolute top-0 inset-x-0 h-1 bg-sky-500/80" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-400">إجمالي طلبات العملاء (Leads)</span>
          <div className="w-10 h-10 rounded-2xl bg-sky-950/80 text-sky-400 border border-sky-800/60 flex items-center justify-center shadow-inner">
            <Users className="w-5 h-5" />
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-white font-heading tracking-tight">{totalLeads}</span>
            <span className="text-xs font-bold text-slate-400">طلب مسجل</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium block mt-1">
            {leadsSummary.prospective || 0} استفسار | {leadsSummary.reserved || 0} حجز بنكي
          </span>
        </div>
      </div>

      {/* 4. Conversion Rate */}
      {showFinancials && (
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800/90 shadow-xl flex flex-col justify-between relative overflow-hidden group hover:border-purple-700/60 transition">
          <div className="absolute top-0 inset-x-0 h-1 bg-purple-500/80" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400">معدل الإغلاق والتحويل</span>
            <div className="w-10 h-10 rounded-2xl bg-purple-950/80 text-purple-400 border border-purple-800/60 flex items-center justify-center shadow-inner">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-white font-heading tracking-tight">{conversionRate}%</span>
              <span className="text-xs font-bold text-emerald-400 font-medium">نسبة التحويل</span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium block mt-1">
              {closedLeads} صفقات شراء مؤكدة
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
