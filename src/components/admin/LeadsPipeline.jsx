import { useState, useMemo, useEffect } from 'react';
import { Search, MessageCircle, FileText, UserCheck, UserPlus, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { fetchAdminUsers } from '../../services/api.js';
import AddWalkInLeadModal from './AddWalkInLeadModal.jsx';
import LeadDetailsDrawer from './LeadDetailsDrawer.jsx';

const stageBadges = {
  prospective: 'bg-sky-50 text-sky-800 border-sky-200',
  reserved: 'bg-amber-50 text-amber-800 border-amber-200',
  closed: 'bg-emerald-50 text-emerald-800 border-emerald-200',
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

export default function LeadsPipeline({ leads = [], onUpdateLead, onRefresh }) {
  const { user } = useAuth();
  const isAdmin = ['super_admin', 'admin'].includes(user?.role);
  const canAddLead = ['super_admin', 'admin', 'receptionist', 'sales'].includes(user?.role);

  const [activeStage, setActiveStage] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [staffList, setStaffList] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  useEffect(() => {
    if (isAdmin) {
      fetchAdminUsers().then((res) => { if (res?.users) setStaffList(res.users); }).catch(() => {});
    }
  }, [isAdmin]);

  const activeLeadInList = useMemo(() => {
    if (!selectedLead) return null;
    return leads.find((l) => l._id === selectedLead._id) || selectedLead;
  }, [leads, selectedLead]);

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

  const openWhatsApp = (e, phone, ticket, name) => {
    e.stopPropagation();
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
          <p className="text-xs text-slate-500 mt-0.5">متابعة الاستفسارات، التمويل البنكي، والعقود والملفات.</p>
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
              className="w-full pr-9 pl-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-800"
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
              activeStage === tab.id ? 'bg-emerald-800 text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
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
                <th className="py-3 px-3">المتابعة القادمة</th>
                <th className="py-3 px-3 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredLeads.map((lead) => {
                const followUp = getFollowUpStatus(lead.nextFollowUpDate);
                return (
                  <tr
                    key={lead._id}
                    onClick={() => setSelectedLead(lead)}
                    className="hover:bg-slate-50/80 transition cursor-pointer"
                  >
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
                      <span className="inline-flex items-center gap-1 text-slate-700 text-xs font-medium">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{lead.assignedAgentName || lead.assignedAgent?.name || 'غير مسند'}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border inline-block ${stageBadges[lead.stage]}`}>
                        {lead.stage === 'prospective' && 'استفسار'}
                        {lead.stage === 'reserved' && 'حجز (بانتظار البنك)'}
                        {lead.stage === 'closed' && 'تم الشراء'}
                      </span>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      {followUp ? (
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[11px] font-bold ${followUp.cls}`}>
                          <Clock className="w-3 h-3" />
                          <span>{followUp.label}</span>
                        </span>
                      ) : lead.nextFollowUpDate ? (
                        <span className="text-slate-500 font-mono text-[11px]" dir="ltr">
                          {new Date(lead.nextFollowUpDate).toLocaleDateString('ar-SA')}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-medium text-xs inline-flex items-center gap-1 transition"
                          title="تفاصيل الطلب والمتابعة"
                        >
                          <FileText className="w-3.5 h-3.5 text-slate-600" />
                          <span>تفاصيل</span>
                        </button>
                        <button
                          onClick={(e) => openWhatsApp(e, lead.phone, lead.ticketNumber, lead.fullName)}
                          className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-medium text-xs inline-flex items-center gap-1 transition"
                          title="محادثة واتساب"
                        >
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

      <LeadDetailsDrawer
        lead={activeLeadInList}
        isOpen={Boolean(selectedLead)}
        onClose={() => setSelectedLead(null)}
        onUpdateLead={onUpdateLead}
        staffList={staffList}
        isAdmin={isAdmin}
      />

      <AddWalkInLeadModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onLeadCreated={onRefresh} />
    </div>
  );
}