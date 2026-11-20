import { useState, useMemo, useEffect } from 'react';
import { Search, MessageCircle, Save, UserCheck, UserPlus, Filter } from 'lucide-react';
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
    prospective: 'bg-sky-950/80 text-sky-300 border-sky-800/80',
    reserved: 'bg-amber-950/80 text-amber-300 border-amber-800/80',
    closed: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80',
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
    try { await onUpdateLead(leadId, { stage: newStage }); } catch (err) { alert(err.message || 'فشل تحديث المرحلة.'); }
  };

  const handleAgentReassign = async (leadId, newAgentId) => {
    try { await onUpdateLead(leadId, { assignedAgent: newAgentId || null }); } catch (err) { alert(err.message || 'فشل إعادة إسناد الطلب.'); }
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
    const msg = `السلام عليكم ورحمة الله أستاذ ${name}، بخصوص طلبك المرجعي (${ticket}) لدى شركة مُيسر للتطوير العقاري.`;
    window.open(`https://wa.me/${digits}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="bg-slate-900/90 rounded-3xl border border-slate-800/90 p-5 sm:p-7 shadow-2xl text-slate-100 backdrop-blur-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-black font-heading text-white tracking-tight">
            خط إدارة طلبات العملاء (3-Stage CRM Pipeline)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            تتبع مسار العميل، التوزيع الذكي، والمزامنة اللحظية مع مخزون الوحدات.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {canAddLead && (
            <button
              onClick={() => setShowAddModal(true)}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-900 to-emerald-800 hover:from-emerald-800 hover:to-emerald-700 text-white text-xs font-bold transition flex items-center gap-2 shadow-md border border-emerald-700/60 active:scale-95"
            >
              <UserPlus className="w-4 h-4 text-amber-300" />
              <span>تسجيل عميل جديد (زيارة / اتصال)</span>
            </button>
          )}

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث بالاسم، الجوال، التذكرة..."
              className="w-full pr-10 pl-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>
        </div>
      </div>

      {/* 3-Stage Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 border-b border-slate-800/80 scrollbar-none">
        {[
          { id: 'all', label: 'جميع الطلبات', count: leads.length },
          { id: 'prospective', label: 'استفسار / جمع بيانات', count: leads.filter((l) => l.stage === 'prospective').length },
          { id: 'reserved', label: 'حجز بانتظار التمويل البنكي', count: leads.filter((l) => l.stage === 'reserved').length },
          { id: 'closed', label: 'تم الشراء (بانتظار التسليم)', count: leads.filter((l) => l.stage === 'closed').length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveStage(tab.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeStage === tab.id
                ? 'bg-emerald-900 text-white shadow-md border border-emerald-700/60'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/70 border border-transparent'
            }`}
          >
            <span>{tab.label}</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-950/80 font-mono text-amber-300">{tab.count}</span>
          </button>
        ))}
      </div>

      {filteredLeads.length === 0 ? (
        <div className="text-center py-14 bg-slate-950/40 rounded-2xl border border-slate-800/80 text-sm font-bold text-slate-400">
          لا توجد طلبات مطابقة للمعايير المحددة
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-800/80">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-950/70 text-slate-400 font-bold border-b border-slate-800/80">
              <tr>
                <th className="py-3.5 px-4">التذكرة</th>
                <th className="py-3.5 px-4">العميل</th>
                <th className="py-3.5 px-4">الوحدة</th>
                <th className="py-3.5 px-4">المستشار المسؤول</th>
                <th className="py-3.5 px-4">المرحلة الحالية</th>
                <th className="py-3.5 px-4">الملاحظات</th>
                <th className="py-3.5 px-4 text-center">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
              {filteredLeads.map((lead) => {
                const currentNote = editingNotes[lead._id] ?? lead.notes ?? '';
                const hasUnsavedNote = editingNotes[lead._id] !== undefined && editingNotes[lead._id] !== lead.notes;
                const agentId = lead.assignedAgent?._id || lead.assignedAgent || '';

                return (
                  <tr key={lead._id} className="hover:bg-slate-800/50 transition">
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-mono font-bold text-amber-300 bg-slate-950/90 px-2.5 py-1 rounded-lg border border-slate-800">{lead.ticketNumber}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white text-xs">{lead.fullName}</div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5" dir="ltr">{lead.phone}</div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {lead.unitCode ? (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-950/70 text-emerald-300 font-mono font-bold border border-emerald-800/60">{lead.unitCode}</span>
                      ) : (
                        <span className="text-slate-500 font-medium">عام</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {isAdmin ? (
                        <select
                          value={agentId}
                          onChange={(e) => handleAgentReassign(lead._id, e.target.value)}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-[11px] focus:outline-none focus:ring-1 focus:ring-emerald-700"
                        >
                          <option value="">غير مسند</option>
                          {staffList.map((s) => (
                            <option key={s.id} value={s.id}>{s.name} ({s.role === 'sales' ? 'مبيعات' : s.role})</option>
                          ))}
                        </select>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300 text-[11px] font-bold">
                          <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{lead.assignedAgentName || lead.assignedAgent?.name || 'مستشار المبيعات'}</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <select
                        value={lead.stage}
                        onChange={(e) => handleStageChange(lead._id, e.target.value)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border focus:outline-none focus:ring-2 focus:ring-emerald-700 shadow-sm ${stageBadgeClasses[lead.stage]}`}
                      >
                        <option value="prospective" className="bg-slate-900 text-sky-300">استفسار / جمع بيانات</option>
                        <option value="reserved" className="bg-slate-900 text-amber-300">حجز بانتظار التمويل البنكي</option>
                        <option value="closed" className="bg-slate-900 text-emerald-300">تم الشراء (بانتظار التسليم)</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 min-w-[170px]">
                        <input
                          type="text"
                          value={currentNote}
                          onChange={(e) => setEditingNotes({ ...editingNotes, [lead._id]: e.target.value })}
                          placeholder="ملاحظات المبيعات..."
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                        />
                        {hasUnsavedNote && (
                          <button onClick={() => handleSaveNotes(lead._id)} disabled={savingId === lead._id} className="p-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white transition flex-shrink-0" title="حفظ">
                            <Save className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <button onClick={() => openWhatsApp(lead.phone, lead.ticketNumber, lead.fullName)} className="px-3 py-1.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/80 font-bold text-xs inline-flex items-center gap-1.5 transition active:scale-95 shadow-sm" title="محادثة واتساب">
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
