import { useState, useMemo, useEffect } from 'react';
import { Search, MessageCircle, Save, UserCheck, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { fetchAdminUsers } from '../../services/api.js';
import AddWalkInLeadModal from './AddWalkInLeadModal.jsx';

export default function LeadsPipeline({ leads = [], onUpdateLead, onRefresh }) {
  const { user } = useAuth();
  const isAdmin = ['super_admin', 'admin'].includes(user?.role);
  const canAddLead = ['super_admin', 'admin', 'receptionist', 'sales'].includes(user?.role);

  const [activeStage, setActiveStage] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingNotes, setEditingNotes] = useState({});
  const [savingId, setSavingId] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      fetchAdminUsers().then((res) => { if (res?.users) setStaffList(res.users); }).catch(() => {});
    }
  }, [isAdmin]);

  const stageBadgeClasses = {
    prospective: 'bg-sky-50 text-sky-800 border-sky-200',
    reserved: 'bg-amber-50 text-amber-800 border-amber-200',
    closed: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  };

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchStage = activeStage === 'all' || lead.stage === activeStage;
      const q = searchQuery.toLowerCase().trim();
      return (
        matchStage &&
        (!q ||
          lead.fullName?.toLowerCase().includes(q) ||
          lead.phone?.includes(q) ||
          lead.ticketNumber?.toLowerCase().includes(q) ||
          lead.unitCode?.toLowerCase().includes(q))
      );
    });
  }, [leads, activeStage, searchQuery]);

  const handleStageChange = async (leadId, newStage) => {
    try { await onUpdateLead(leadId, { stage: newStage }); } catch (err) { alert(err.message || 'فشل تحديث الحالة.'); }
  };

  const handleAgentReassign = async (leadId, newAgentId) => {
    try { await onUpdateLead(leadId, { assignedAgent: newAgentId || null }); } catch (err) { alert(err.message || 'فشل إسناد الطلب.'); }
  };

  const handleSaveNotes = async (leadId) => {
    const noteText = editingNotes[leadId];
    if (noteText === undefined) return;
    setSavingId(leadId);
    try {
      await onUpdateLead(leadId, { notes: noteText });
      const next = { ...editingNotes };
      delete next[leadId];
      setEditingNotes(next);
    } catch (err) { alert(err.message || 'فشل حفظ الملاحظة.'); } finally { setSavingId(null); }
  };

  const openWhatsApp = (phone, ticket, name) => {
    const digits = phone.replace(/\D/g, '').replace(/^0/, '966');
    const msg = `السلام عليكم ورحمة الله أستاذ ${name}، بخصوص طلبك (${ticket}) لدى شركة مُيسّر للتطوير العقاري.`;
    window.open(`https://wa.me/${digits}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const hasFilterOrSearch = activeStage !== 'all' || searchQuery.trim().length > 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 text-slate-900 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-base sm:text-lg font-bold font-heading text-slate-900">طلبات العملاء</h2>
          <p className="text-xs text-slate-500 mt-0.5">متابعة الاستفسارات، الحجوزات، والطلبات المسندة للمبيعات.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {canAddLead && (
            <button
              onClick={() => setShowAddModal(true)}
              className="py-2 px-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <UserPlus className="w-3.5 h-3.5 text-amber-300" />
              <span>تسجيل عميل</span>
            </button>
          )}

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث بالاسم، الجوال، التذكرة..."
              className="w-full pr-9 pl-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-800 focus:border-emerald-800"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 border-b border-slate-100">
        {[
          { id: 'all', label: 'الكل', count: leads.length },
          { id: 'prospective', label: 'استفسار', count: leads.filter((l) => l.stage === 'prospective').length },
          { id: 'reserved', label: 'حجز (بانتظار البنك)', count: leads.filter((l) => l.stage === 'reserved').length },
          { id: 'closed', label: 'تم الشراء', count: leads.filter((l) => l.stage === 'closed').length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveStage(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeStage === tab.id
                ? 'bg-emerald-800 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${activeStage === tab.id ? 'bg-emerald-900 text-white' : 'bg-slate-100 text-slate-600'}`}>{tab.count}</span>
          </button>
        ))}
      </div>

      {filteredLeads.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs font-medium text-slate-500">
          {hasFilterOrSearch ? 'لا توجد نتائج مطابقة للبحث' : 'لا توجد طلبات مسجلة حالياً'}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">رقم الطلب</th>
                <th className="py-3 px-3">العميل</th>
                <th className="py-3 px-3">الوحدة</th>
                <th className="py-3 px-3">المسؤول</th>
                <th className="py-3 px-3">الحالة</th>
                <th className="py-3 px-3">الملاحظات</th>
                <th className="py-3 px-3 text-center">التواصل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredLeads.map((lead) => {
                const currentNote = editingNotes[lead._id] ?? lead.notes ?? '';
                const hasUnsavedNote = editingNotes[lead._id] !== undefined && editingNotes[lead._id] !== lead.notes;
                const agentId = lead.assignedAgent?._id || lead.assignedAgent || '';

                return (
                  <tr key={lead._id} className="hover:bg-slate-50/75 transition">
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-[11px]">{lead.ticketNumber}</span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900 text-xs">{lead.fullName}</div>
                      <div className="text-[11px] text-slate-500 font-mono" dir="ltr">{lead.phone}</div>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      {lead.unitCode ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-mono font-bold border border-emerald-200">{lead.unitCode}</span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      {isAdmin ? (
                        <select
                          value={agentId}
                          onChange={(e) => handleAgentReassign(lead._id, e.target.value)}
                          className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-800"
                        >
                          <option value="">غير مسند</option>
                          {staffList.map((s) => (
                            <option key={s.id} value={s.id}>{s.name} ({s.role === 'sales' ? 'مبيعات' : s.role})</option>
                          ))}
                        </select>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-700 text-xs font-medium">
                          <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{lead.assignedAgentName || lead.assignedAgent?.name || 'مستشار المبيعات'}</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <select
                        value={lead.stage}
                        onChange={(e) => handleStageChange(lead._id, e.target.value)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold border focus:outline-none focus:ring-1 focus:ring-emerald-800 ${stageBadgeClasses[lead.stage]}`}
                      >
                        <option value="prospective">استفسار</option>
                        <option value="reserved">حجز (بانتظار البنك)</option>
                        <option value="closed">تم الشراء</option>
                      </select>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1 min-w-[160px]">
                        <input
                          type="text"
                          value={currentNote}
                          onChange={(e) => setEditingNotes({ ...editingNotes, [lead._id]: e.target.value })}
                          placeholder="ملاحظة..."
                          className="w-full px-2 py-1 rounded bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                        />
                        {hasUnsavedNote && (
                          <button onClick={() => handleSaveNotes(lead._id)} disabled={savingId === lead._id} className="p-1 rounded bg-emerald-800 hover:bg-emerald-700 text-white transition flex-shrink-0" title="حفظ">
                            <Save className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <button onClick={() => openWhatsApp(lead.phone, lead.ticketNumber, lead.fullName)} className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-medium text-xs inline-flex items-center gap-1 transition" title="محادثة واتساب">
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>واتساب</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <AddWalkInLeadModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onLeadCreated={onRefresh} />
    </div>
  );
}
