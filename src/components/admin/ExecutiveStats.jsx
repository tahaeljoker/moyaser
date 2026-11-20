import { DollarSign, Building, Users, TrendingUp } from 'lucide-react';

const fmt = (n) => new Intl.NumberFormat('en-US').format(n);

export default function ExecutiveStats({ units = [], leadsSummary = {}, role = 'admin' }) {
  // Hide revenue and conversion from receptionist, sales, and editor
  const showFinancials = !['receptionist', 'sales', 'editor'].includes(role);

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
    <div className={`grid grid-cols-1 sm:grid-cols-2 ${showFinancials ? 'lg:grid-cols-4' : 'lg:grid-cols-2'} gap-4`}>
      {/* 1. Sold Value */}
      {showFinancials && (
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500">إجمالي المبيعات</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-slate-900 font-heading">{fmt(totalSoldValue)}</span>
              <span className="text-xs text-slate-500 font-medium">ر.س</span>
            </div>
            <span className="text-[11px] text-slate-500 block mt-1">
              {soldUnits.length} وحدة مفرغة بالصك
            </span>
          </div>
        </div>
      )}

      {/* 2. Units Inventory */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-slate-500">حالة الوحدات</span>
          <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-100 text-amber-800 flex items-center justify-center">
            <Building className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-800 font-heading">{availableCount}</span>
            <span className="text-xs text-slate-500 font-medium">متاح</span>
            <span className="text-slate-300">/</span>
            <span className="text-xl font-bold text-amber-700 font-heading">{reservedCount}</span>
            <span className="text-xs text-slate-500 font-medium">محجوز</span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">
            من إجمالي {units.length} وحدة
          </span>
        </div>
      </div>

      {/* 3. Total Leads */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-slate-500">طلبات العملاء</span>
          <div className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-100 text-sky-800 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-slate-900 font-heading">{totalLeads}</span>
            <span className="text-xs text-slate-500 font-medium">طلب مسجل</span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">
            {leadsSummary.prospective || 0} استفسار | {leadsSummary.reserved || 0} حجز
          </span>
        </div>
      </div>

      {/* 4. Conversion Rate */}
      {showFinancials && (
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500">نسبة التحويل</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-100 text-purple-800 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-slate-900 font-heading">{conversionRate}%</span>
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
