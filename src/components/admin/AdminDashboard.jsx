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
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300 text-xs gap-3">
        <RefreshCw className="w-5 h-5 text-emerald-400 animate-spin" />
        <span>جاري التحقق من الجلسة والصلاحيات...</span>
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

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black font-heading text-white tracking-tight">
              لوحة التحكم والمتابعة التشغيلية
            </h2>
            <div className="flex items-center gap-2 mt-1">
              {role === 'sales' && <span className="text-xs text-amber-400 font-bold">عرض خاص بطلبات المستشار: {user.name}</span>}
              {role === 'receptionist' && <span className="text-xs text-emerald-400 font-bold">مكتب الاستقبال وإدراج العملاء</span>}
              {role === 'editor' && <span className="text-xs text-sky-400 font-bold">إدارة المحتوى ومخزون الوحدات</span>}
              {['super_admin', 'admin'].includes(role) && <span className="text-xs text-slate-400">إشراف شامل على مؤشرات المبيعات، الوحدات، والـ CRM</span>}
            </div>
          </div>

          <button
            onClick={loadData}
            disabled={isLoadingData}
            className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-white transition border border-slate-800/90 shadow-sm self-start sm:self-auto active:scale-95"
            title="تحديث البيانات"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingData ? 'animate-spin text-emerald-400' : ''}`} />
          </button>
        </div>

        <ExecutiveStats units={units} leadsSummary={leadsSummary} role={role} />

        {/* Dynamic Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-6 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800/90 shadow-md w-fit backdrop-blur-sm">
          {canAccessCRM && (
            <button
              onClick={() => setActiveTab('leads')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'leads'
                  ? 'bg-gradient-to-r from-emerald-900 to-emerald-800 text-white shadow-md border border-emerald-700/60'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Users className="w-4 h-4 text-emerald-300" />
              <span>إدارة العملاء (CRM)</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-950/80 font-mono text-emerald-300">{leads.length}</span>
            </button>
          )}

          {canAccessUnits && (
            <button
              onClick={() => setActiveTab('units')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'units'
                  ? 'bg-gradient-to-r from-emerald-900 to-emerald-800 text-white shadow-md border border-emerald-700/60'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Building className="w-4 h-4 text-amber-300" />
              <span>مخزون الوحدات</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-950/80 font-mono text-amber-300">{units.length}</span>
            </button>
          )}

          {canAccessUsers && (
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'users'
                  ? 'bg-gradient-to-r from-emerald-900 to-emerald-800 text-white shadow-md border border-emerald-700/60'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <UserCheck className="w-4 h-4 text-amber-400" />
              <span>فريق العمل والصلاحيات</span>
            </button>
          )}

          {canAccessSettings && (
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'settings'
                  ? 'bg-gradient-to-r from-emerald-900 to-emerald-800 text-white shadow-md border border-emerald-700/60'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Settings className="w-4 h-4 text-sky-300" />
              <span>إعدادات الموقع والهوية</span>
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
