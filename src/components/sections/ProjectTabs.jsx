import { brand, units } from '../../data/projectData.js';

export default function ProjectTabs({ activeTab, setActiveTab }) {
  return (
    <section id="project-tabs" className="-mt-6 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-2 shadow-lg border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('ready')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'ready'
                  ? 'bg-emerald-900 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>وحدات جاهزة للبيع — تاون هاوس الشامخة ({units.length} وحدة)</span>
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'upcoming'
                  ? 'bg-emerald-900 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>مشاريع قيد التطوير</span>
            </button>
          </div>
          <div className="text-xs text-slate-500 px-3 hidden md:block">
            مشاريع مطورة ومملوكة مباشرة لشركة {brand.developer}
          </div>
        </div>
      </div>
    </section>
  );
}
