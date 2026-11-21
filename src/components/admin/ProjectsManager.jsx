import { useState, useEffect } from 'react';
import { Plus, Search, Edit3, Trash2, Eye, EyeOff, Building, MapPin, RefreshCw, ExternalLink } from 'lucide-react';
import { fetchProjects, toggleProjectActive, deleteProject } from '../../services/api.js';
import ProjectFormModal from './ProjectFormModal.jsx';

const statusLabels = {
  available: { label: 'متاح للبيع', class: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  under_development: { label: 'قيد التطوير', class: 'bg-amber-50 text-amber-800 border-amber-200' },
  completed: { label: 'مكتمل', class: 'bg-blue-50 text-blue-800 border-blue-200' },
  upcoming: { label: 'قريباً', class: 'bg-slate-100 text-slate-700 border-slate-200' },
};

export default function ProjectsManager() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const res = await fetchProjects(true);
      if (res?.data) setProjects(res.data);
    } catch (err) {
      console.warn('[ProjectsManager] Load error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProjects(); }, []);

  const handleToggle = async (id) => {
    try {
      await toggleProjectActive(id);
      await loadProjects();
    } catch {
      alert('تعذر تغيير حالة المشروع');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`هل أنت متأكد من حذف المشروع (${name})؟`)) return;
    setActionLoading(true);
    try {
      await deleteProject(id);
      await loadProjects();
    } catch {
      alert('تعذر حذف المشروع.');
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = projects.filter((p) => {
    const q = search.toLowerCase();
    return p.name?.toLowerCase().includes(q) || p.slug?.toLowerCase().includes(q) || p.city?.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 font-heading">إدارة المشاريع العقارية</h2>
          <p className="text-xs text-slate-500 mt-0.5">إدارة المشاريع السكنية والتفاصيل المعمارية والتراخيص</p>
        </div>
        <button
          onClick={() => { setSelectedProject(null); setModalOpen(true); }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>مشروع جديد</span>
        </button>
      </div>

      <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200/80">
        <Search className="w-4 h-4 text-slate-400 mr-2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث باسم المشروع، المعرف، أو المدينة..."
          className="w-full text-xs text-slate-800 focus:outline-hidden"
        />
        {loading && <RefreshCw className="w-4 h-4 text-slate-400 animate-spin" />}
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">جاري تحميل المشاريع...</div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
          لا توجد مشاريع مطابقة للبحث.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((proj) => {
            const st = statusLabels[proj.status] || statusLabels.available;
            return (
              <div key={proj._id} className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs flex flex-col justify-between">
                <div>
                  <div className="relative h-40 bg-slate-100">
                    {proj.heroImageUrl ? (
                      <img src={proj.heroImageUrl} alt={proj.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <Building className="w-10 h-10 stroke-[1.2]" />
                      </div>
                    )}
                    <span className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full border ${st.class}`}>
                      {st.label}
                    </span>
                    <span className={`absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      proj.isActive ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
                    }`}>
                      {proj.isActive ? 'نشط' : 'معطل'}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-900 font-heading">{proj.name}</h3>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{proj.slug}</span>
                    </div>
                    {proj.tagline && <p className="text-xs text-slate-500 line-clamp-1">{proj.tagline}</p>}
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{proj.city} {proj.district ? `— ${proj.district}` : ''}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-slate-100 mt-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggle(proj._id)}
                      title={proj.isActive ? 'تعطيل المشروع' : 'تفعيل المشروع'}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
                    >
                      {proj.isActive ? <Eye className="w-4 h-4 text-emerald-700" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
                    </button>
                    <a
                      href={`/projects/${proj.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="معاينة الصفحة العامة"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => { setSelectedProject(proj); setModalOpen(true); }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg font-medium transition"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                      <span>تعديل</span>
                    </button>
                    <button
                      onClick={() => handleDelete(proj._id, proj.name)}
                      disabled={actionLoading}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition"
                      title="حذف المشروع"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modalOpen && (
        <ProjectFormModal
          project={selectedProject}
          onClose={() => { setModalOpen(false); setSelectedProject(null); }}
          onSuccess={() => { setModalOpen(false); setSelectedProject(null); loadProjects(); }}
        />
      )}
    </div>
  );
}
