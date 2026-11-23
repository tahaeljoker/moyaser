import { LayoutGrid, Rows3, SlidersHorizontal, MapPin } from 'lucide-react';

const STATUS_OPTIONS = [
  { id: 'all', label: 'كافة الحالات' },
  { id: 'available', label: 'متاح للحجز والإفراغ' },
  { id: 'under_development', label: 'قيد التطوير' },
  { id: 'completed', label: 'مكتمل' },
];

export default function ProjectsFilterBar({
  activeStatus,
  onStatusChange,
  activeCity,
  onCityChange,
  cities = [],
  viewMode,
  onViewModeChange,
  resultCount = 0,
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4" dir="rtl">
      {/* Top Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {STATUS_OPTIONS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onStatusChange(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeStatus === tab.id
                  ? 'bg-[#0A2E23] text-white shadow-xs'
                  : 'bg-[#F8F7F4] border border-slate-200/80 text-slate-700 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* View Switcher and Live Count */}
        <div className="flex items-center justify-between lg:justify-end gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
          <span className="text-xs font-medium text-slate-500 tabular-nums">
            عرض {resultCount} {resultCount === 1 ? 'مشروع' : 'مشاريع'}
          </span>

          <div className="flex items-center bg-[#F8F7F4] p-1 rounded-xl border border-slate-200/80">
            <button
              onClick={() => onViewModeChange('editorial')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'editorial'
                  ? 'bg-white text-[#0A2E23] shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="عرض المخطط التحريري"
            >
              <Rows3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'grid'
                  ? 'bg-white text-[#0A2E23] shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="عرض الشبكة المعمارية"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* City Chips Row */}
      {cities.length > 0 && (
        <div className="flex items-center gap-2 pt-3 border-t border-slate-100 overflow-x-auto pb-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 shrink-0 ml-1">
            <MapPin className="w-3.5 h-3.5 text-[#0A2E23]" />
            <span>المدينة:</span>
          </div>
          <button
            onClick={() => onCityChange('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
              activeCity === 'all'
                ? 'bg-[#0A2E23]/10 text-[#0A2E23] font-bold border border-[#0A2E23]/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            كافة المدن
          </button>
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => onCityChange(city)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                activeCity === city
                  ? 'bg-[#0A2E23]/10 text-[#0A2E23] font-bold border border-[#0A2E23]/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
