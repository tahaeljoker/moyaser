import { LayoutGrid, Rows3, MapPin } from 'lucide-react';

const STATUS_OPTIONS = [
  { id: 'all', label: 'كافة الحالات' },
  { id: 'available', label: 'متاح للحجز' },
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
    <div className="py-2 space-y-3 border-b border-[#e3dbc6]" dir="rtl">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3">
        {/* Status Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          {STATUS_OPTIONS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onStatusChange(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold border transition-colors duration-200 whitespace-nowrap ${
                activeStatus === tab.id
                  ? 'bg-[#0a2e23] border-[#0a2e23] text-white shadow-xs'
                  : 'bg-[#fbf9f3]/70 border-[#c9bd9c] text-[#0a2e23] hover:bg-[#fbf9f3]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* View Switcher and Live Count */}
        <div className="flex items-center justify-between lg:justify-end gap-3">
          <span className="text-xs font-bold text-[#0a2e23] tabular-nums">
            عرض {resultCount} {resultCount === 1 ? 'مشروع' : 'مشاريع'}
          </span>

          <div className="flex items-center bg-[#fbf9f3] p-1 rounded-full border border-[#c9bd9c]">
            <button
              onClick={() => onViewModeChange('editorial')}
              className={`p-1.5 rounded-full transition-colors duration-200 ${
                viewMode === 'editorial'
                  ? 'bg-[#0a2e23] text-white'
                  : 'text-[#0a2e23]/70 hover:text-[#0a2e23]'
              }`}
              title="عرض المخطط التحريري"
            >
              <Rows3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 rounded-full transition-colors duration-200 ${
                viewMode === 'grid'
                  ? 'bg-[#0a2e23] text-white'
                  : 'text-[#0a2e23]/70 hover:text-[#0a2e23]'
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
        <div className="flex items-center gap-2 pt-2 pb-2 border-t border-[#e3dbc6]/70 overflow-x-auto">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0a2e23] shrink-0 ml-1">
            <MapPin className="w-3.5 h-3.5 text-[#0a2e23]" />
            <span>المدينة:</span>
          </div>
          <button
            onClick={() => onCityChange('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors duration-200 whitespace-nowrap ${
              activeCity === 'all'
                ? 'bg-[#0a2e23] border-[#0a2e23] text-white'
                : 'bg-[#fbf9f3]/70 border-[#c9bd9c] text-[#0a2e23] hover:bg-[#fbf9f3]'
            }`}
          >
            كافة المدن
          </button>
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => onCityChange(city)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors duration-200 whitespace-nowrap ${
                activeCity === city
                  ? 'bg-[#0a2e23] border-[#0a2e23] text-white'
                  : 'bg-[#fbf9f3]/70 border-[#c9bd9c] text-[#0a2e23] hover:bg-[#fbf9f3]'
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
