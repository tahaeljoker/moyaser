import { useState, useEffect, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { Users, Building, RefreshCw, UserCheck, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { fetchUnits, fetchAdminLeads, updateLead, updateUnit } from '../../services/api.js';
import AdminHeader from './AdminHeader.jsx';
import ExecutiveStats from './ExecutiveStats.jsx';
import LeadsPipeline from './LeadsPipeline.jsx';
import UnitsManager from './UnitsManager.jsx';
import UsersManager from './UsersManager.jsx';
import SiteSettingsManager from './SiteSettingsManager.jsx';

export default function AdminDashboard() {
  const { user, loading, isAuthenticated } = useAuth();
  const role = user?.role || 'sales';

  const canAccessCRM = ['super_admin', 'admin', 'receptionist', 'sales'].includes(role);
  const canAccessUnits = ['super_admin', 'admin', 'editor'].includes(role);
  const canAccessUsers = ['super_admin', 'admin'].includes(role);
  const canAccessSettings = ['super_admin', 'admin', 'editor'].includes(role);

  const [activeTab, setActiveTab] = useState(canAccessCRM ? 'leads' : 'units');
  const [units, setUnits] = useState([]);
  const [leads, setLeads] = useState([]);
  const [leadsSummary, setLeadsSummary] = useState({});
  const [isLoadingData, setIsLoadingData] = useState(true);

  const loadData = useCallback(async () => {
    setIsLoadingData(true);
    try {
      const promises = [
        canAccessUnits ? fetchUnits() : Promise.resolve({ data: [] }),
        canAccessCRM ? fetchAdminLeads() : Promise.resolve({ data: [], summary: {} }),
      ];
      const [unitsRes, leadsRes] = await Promise.all(promises);
      if (unitsRes?.data) setUnits(unitsRes.data);
      if (leadsRes?.data) setLeads(leadsRes.data);
      if (leadsRes?.summary) setLeadsSummary(leadsRes.summary);
    } catch (err) {
      console.warn('[AdminDashboard] Fetch error:', err.message);
    } finally {
      setIsLoadingData(false);
    }
  }, [canAccessUnits, canAccessCRM]);

  useEffect(() => {
    if (isAuthenticated) loadData();
  }, [isAuthenticated, loadData]);

  useEffect(() => {
    if (!canAccessCRM && activeTab === 'leads') setActiveTab('units');
    if (!canAccessUnits && activeTab === 'units') setActiveTab('leads');
    if (!canAccessUsers && activeTab === 'users') setActiveTab('leads');
    if (!canAccessSettings && activeTab === 'settings') setActiveTab('leads');
  }, [role, canAccessCRM, canAccessUnits, canAccessUsers, canAccessSettings, activeTab]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 text-xs gap-2">
        <RefreshCw className="w-5 h-5 text-emerald-400 animate-spin" />
        <span>جاري التحميل...</span>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

  const handleUpdateLead = async (leadId, updates) => {
    const res = await updateLead(leadId, updates);
    await loadData();
    return res;
  };

  const handleUpdateUnit = async (unitCode, updates) => {
    const res = await updateUnit(unitCode, updates);
    await loadData();
    return res;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-800 selection:text-white" dir="rtl">
      <AdminHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h1 className="text-lg sm:text-xl font-bold font-heading text-white">
              لوحة التحكم
            </h1>
            <div className="text-xs text-slate-400 mt-0.5">
              {role === 'sales' && <span>طلبات المستشار: {user.name}</span>}
              {role === 'receptionist' && <span>تسجيل وتوجيه الزوار</span>}
              {role === 'editor' && <span>إدارة الوحدات والمحتوى</span>}
              {['super_admin', 'admin'].includes(role) && <span>مشروع تاون هاوس الشامخة — الدمام</span>}
            </div>
          </div>

          <button
            onClick={loadData}
            disabled={isLoadingData}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition border border-slate-800 self-start sm:self-auto"
            title="تحديث البيانات"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingData ? 'animate-spin text-emerald-400' : ''}`} />
          </button>
        </div>

        <ExecutiveStats units={units} leadsSummary={leadsSummary} role={role} />

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 mb-5 bg-slate-900 p-1 rounded-xl border border-slate-800 w-fit">
          {canAccessCRM && (
            <button
              onClick={() => setActiveTab('leads')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'leads'
                  ? 'bg-emerald-800 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>طلبات العملاء</span>
              <span className="px-1.5 py-0.5 rounded text-[11px] bg-slate-950 font-mono text-slate-300">{leads.length}</span>
            </button>
          )}

          {canAccessUnits && (
            <button
              onClick={() => setActiveTab('units')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'units'
                  ? 'bg-emerald-800 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              <span>الوحدات</span>
              <span className="px-1.5 py-0.5 rounded text-[11px] bg-slate-950 font-mono text-slate-300">{units.length}</span>
            </button>
          )}

          {canAccessUsers && (
            <button
              onClick={() => setActiveTab('users')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'users'
                  ? 'bg-emerald-800 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>فريق العمل</span>
            </button>
          )}

          {canAccessSettings && (
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'settings'
                  ? 'bg-emerald-800 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>الإعدادات</span>
            </button>
          )}
        </div>

        {activeTab === 'leads' && canAccessCRM && <LeadsPipeline leads={leads} onUpdateLead={handleUpdateLead} onRefresh={loadData} />}
        {activeTab === 'units' && canAccessUnits && <UnitsManager units={units} onUpdateUnit={handleUpdateUnit} onRefresh={loadData} />}
        {activeTab === 'users' && canAccessUsers && <UsersManager />}
        {activeTab === 'settings' && canAccessSettings && <SiteSettingsManager />}
      </main>
    </div>
  );
}
