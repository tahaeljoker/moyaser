import { useState, useMemo, useEffect } from 'react';
import { Search, MessageCircle, FileText, UserCheck, UserPlus, Clock, Download, AlertTriangle, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { fetchAdminUsers, fetchProjects } from '../../services/api.js';
import { exportToCsv } from '../../utils/exportCsv.js';
import AddWalkInLeadModal from './AddWalkInLeadModal.jsx';
import LeadDetailsDrawer from './LeadDetailsDrawer.jsx';

const stageBadges = {
  prospective: 'bg-sky-50 text-sky-800 border-sky-200',
  reserved: 'bg-amber-50 text-amber-800 border-amber-200',
  closed: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  cancelled: 'bg-slate-100 text-slate-700 border-slate-300',
};

const getFollowUpStatus = (dateStr) => {
  if (!dateStr) return null;
  const target = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  const diffDays = Math.round((target - today) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return { label: 'متابعة متأخرة', cls: 'bg-rose-50 text-rose-700 border-rose-200' };
  if (diffDays === 0) return { label: 'متابعة اليوم', cls: 'bg-amber-50 text-amber-800 border-amber-200' };
  return null;
};

const sourceMap = { website: 'الموقع الإلكتروني', walk_in: 'زيارة للمكتب', phone: 'اتصال هاتفي', whatsapp: 'محادثة واتساب' };
const stageMap = { prospective: 'استفسار', reserved: 'حجز (بانتظار البنك)', closed: 'تم الشراء', cancelled: 'ملغي' };

export default function LeadsPipeline({ leads = [], onUpdateLead, onRefresh }) {
  const { user } = useAuth();
  const isAdmin = ['super_admin', 'admin'].includes(user?.role);
  const canAddLead = ['super_admin', 'admin', 'receptionist', 'sales'].includes(user?.role);

  const [projects, setProjects] = useState([]);
  const [projectFilter, setProjectFilter] = useState('all');
  const [activeStage, setActiveStage] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [staffList, setStaffList] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  useEffect(() => {
    fetchProjects(true).then((res) => { if (res?.data) setProjects(res.data); }).catch(() => {});
    if (isAdmin) fetchAdminUsers().then((res) => { if (res?.users) setStaffList(res.users); }).catch(() => {});
  }, [isAdmin]);

  const activeLeadInList = useMemo(() => {
    if (!selectedLead) return null;
    return leads.find((l) => l._id === selectedLead._id) || selectedLead;
  }, [leads, selectedLead]);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchProject = projectFilter === 'all' || String(lead.projectId) === projectFilter;
      const matchStage = activeStage === 'all' || lead.stage === activeStage;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q ||
        lead.fullName?.toLowerCase().includes(q) ||
        lead.phone?.includes(q) ||
        lead.ticketNumber?.toLowerCase().includes(q) ||
        lead.unitCode?.toLowerCase().includes(q) ||
        lead.projectName?.toLowerCase().includes(q);
      return matchProject && matchStage && matchSearch;
    });
  }, [leads, projectFilter, activeStage, searchQuery]);

  const handleExport = () => {
    const headers = ['رقم الطلب', 'المشروع', 'الاسم', 'الجوال', 'المصدر', 'الوحدة', 'المرحلة', 'المستشار', 'تاريخ التسجيل'];
    const rows = filteredLeads.map((l) => [
      l.ticketNumber, l.projectName || '—', l.fullName, l.phone, sourceMap[l.source] || 'الموقع',
      l.unitCode || '—', stageMap[l.stage] || l.stage, l.assignedAgentName || 'غير مسند',
      new Date(l.createdAt).toLocaleDateString('ar-SA'),
    ]);
    exportToCsv(`muyassar-leads-${new Date().toISOString().slice(0, 10)}`, headers, rows);
  };

  const openWhatsApp = (e, lead) => {
    e.stopPropagation();
    const proj = projects.find((p) => p._id === lead.projectId || p.name === lead.projectName);
    const cleanDigits = String(lead.phone || '').replace(/\D/g, '');
    const digits = cleanDigits.startsWith('05') && cleanDigits.length === 10
      ? `966${cleanDigits.slice(1)}`
      : (cleanDigits.startsWith('5') && cleanDigits.length === 9 ? `966${cleanDigits}` : cleanDigits);

    const projName = lead.projectName || proj?.name || 'مُيسّر للتطوير العقاري';
    const msg = `السلام عليكم أستاذ ${lead.fullName}، بخصوص اهتمامك بمشروع ${projName} (طلب رقم ${lead.ticketNumber}).`;
    window.open(`https://api.whatsapp.com/send?phone=${digits}&text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 text-slate-900 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-base sm:text-lg font-bold font-heading text-slate-900">طلبات العملاء ({filteredLeads.length})</h2>
          <p className="text-xs text-slate-500 mt-0.5">متابعة الاستفسارات، الحجوزات، والملفات حسب المشروع العقاري.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {isAdmin && (
            <button onClick={handleExport} className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 border border-slate-200" title="تصدير إكسل">
              <Download className="w-3.5 h-3.5 text-slate-600" /><span>تصدير</span>
            </button>
          )}
          {canAddLead && (
            <button onClick={() => setShowAddModal(true)} className="py-2 px-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs">
              <UserPlus className="w-3.5 h-3.5 text-amber-300" /><span>تسجيل عميل</span>
            </button>
          )}
          <select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)} className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 focus:outline-hidden">
            <option value="all">جميع المشاريع</option>
            {projects.map((p) => (<option key={p._id} value={p._id}>{p.name}</option>))}
          </select>
          <div className="relative w-full sm:w-48">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="بحث..." className="w-full pr-8 pl-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-hidden" />
          </div>
          <button onClick={onRefresh} className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-900 transition" title="تحديث">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 border-b border-slate-100">
        {[
          { id: 'all', label: 'الكل', count: leads.length },
          { id: 'prospective', label: 'استفسار', count: leads.filter((l) => l.stage === 'prospective').length },
          { id: 'reserved', label: 'حجز (بانتظار البنك)', count: leads.filter((l) => l.stage === 'reserved').length },
          { id: 'closed', label: 'تم الشراء', count: leads.filter((l) => l.stage === 'closed').length },
          { id: 'cancelled', label: 'ملغي', count: leads.filter((l) => l.stage === 'cancelled').length },
        ].map((tab) => (
          <button key={tab.id} onClick={() => setActiveStage(tab.id)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${activeStage === tab.id ? 'bg-emerald-800 text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}>
            <span>{tab.label}</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono tabular-nums ${activeStage === tab.id ? 'bg-emerald-900 text-white' : 'bg-slate-100 text-slate-600'}`}>{tab.count}</span>
          </button>
        ))}
      </div>

      {filteredLeads.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs font-medium text-slate-500">
          لا توجد طلبات مطابقة للبحث أو المشروع المحدد.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">رقم الطلب</th>
                <th className="py-3 px-3">المشروع</th>
                <th className="py-3 px-3">العميل</th>
                <th className="py-3 px-3">الوحدة</th>
                <th className="py-3 px-3">المسؤول</th>
                <th className="py-3 px-3">الحالة</th>
                <th className="py-3 px-3">المتابعة القادمة</th>
                <th className="py-3 px-3 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredLeads.map((lead) => {
                const followUp = getFollowUpStatus(lead.nextFollowUpDate);
                const isExpired = lead.stage === 'reserved' && !lead.financing?.depositPaid && lead.reservationExpiresAt && new Date(lead.reservationExpiresAt) < new Date();
                return (
                  <tr key={lead._id} onClick={() => setSelectedLead(lead)} className="hover:bg-slate-50/80 transition cursor-pointer">
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-[11px] tabular-nums">{lead.ticketNumber}</span>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="text-xs font-medium text-slate-700">{lead.projectName || '—'}</span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900 text-xs">{lead.fullName}</div>
                      <div className="text-[11px] text-slate-500 font-mono tabular-nums" dir="ltr">{lead.phone}</div>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      {lead.unitCode ? <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-mono font-bold border border-emerald-200 tabular-nums">{lead.unitCode}</span> : <span className="text-slate-400">—</span>}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-slate-700 text-xs font-medium">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{lead.assignedAgentName || lead.assignedAgent?.name || 'غير مسند'}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1 flex-wrap">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border inline-block ${stageBadges[lead.stage]}`}>{stageMap[lead.stage] || lead.stage}</span>
                        {isExpired && (
                          <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300 text-[10px] font-bold inline-flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-rose-700" /><span>انتهت مدة الحجز</span>
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      {followUp ? (
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[11px] font-bold ${followUp.cls}`}>
                          <Clock className="w-3 h-3" /><span>{followUp.label}</span>
                        </span>
                      ) : lead.nextFollowUpDate ? (
                        <span className="text-slate-500 font-mono text-[11px] tabular-nums" dir="ltr">{new Date(lead.nextFollowUpDate).toLocaleDateString('ar-SA')}</span>
                      ) : (<span className="text-slate-400">—</span>)}
                    </td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setSelectedLead(lead)} className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-medium text-xs inline-flex items-center gap-1 transition" title="تفاصيل الطلب">
                          <FileText className="w-3.5 h-3.5 text-slate-600" /><span>تفاصيل</span>
                        </button>
                        <button onClick={(e) => openWhatsApp(e, lead)} className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-medium text-xs inline-flex items-center gap-1 transition" title="محادثة واتساب">
                          <MessageCircle className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <LeadDetailsDrawer lead={activeLeadInList} isOpen={Boolean(selectedLead)} onClose={() => setSelectedLead(null)} onUpdateLead={onUpdateLead} staffList={staffList} isAdmin={isAdmin} />
      <AddWalkInLeadModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onLeadCreated={onRefresh} />
    </div>
  );
}
