import { useState, useEffect, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { fetchUnits, fetchAdminLeads, updateLead, updateUnit } from '../../services/api.js';
import AdminSidebar from './AdminSidebar.jsx';
import AdminHeader from './AdminHeader.jsx';
import ExecutiveStats from './ExecutiveStats.jsx';
import LeadsPipeline from './LeadsPipeline.jsx';
import UnitsManager from './UnitsManager.jsx';
import UsersManager from './UsersManager.jsx';
import SiteSettingsManager from './SiteSettingsManager.jsx';

export default function AdminDashboard() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const role = user?.role || 'sales';

  const canAccessCRM = ['super_admin', 'admin', 'receptionist', 'sales'].includes(role);
  const canAccessUnits = ['super_admin', 'admin', 'editor'].includes(role);
  const canAccessUsers = ['super_admin', 'admin'].includes(role);
  const canAccessSettings = ['super_admin', 'admin', 'editor'].includes(role);

  const initialTab = role === 'editor' ? 'units' : 'leads';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-500 text-xs gap-2">
        <RefreshCw className="w-5 h-5 text-emerald-800 animate-spin" />
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

  const tabTitles = {
    leads: 'طلبات العملاء',
    units: 'الوحدات السكنية',
    users: 'فريق العمل والصلاحيات',
    settings: 'إعدادات الموقع',
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex selection:bg-emerald-800 selection:text-white" dir="rtl">
      {/* Fixed Right Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        role={role}
        leadsCount={leads.length}
        unitsCount={units.length}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={logout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:mr-64 min-w-0">
        <AdminHeader
          activeTabTitle={tabTitles[activeTab] || 'لوحة التحكم'}
          onRefresh={loadData}
          isLoadingData={isLoadingData}
          onOpenMobileMenu={() => setSidebarOpen(true)}
        />

        <main className="p-4 sm:p-6 max-w-7xl w-full mx-auto space-y-6">
          <ExecutiveStats units={units} leadsSummary={leadsSummary} role={role} />

          {activeTab === 'leads' && canAccessCRM && (
            <LeadsPipeline leads={leads} onUpdateLead={handleUpdateLead} onRefresh={loadData} />
          )}

          {activeTab === 'units' && canAccessUnits && (
            <UnitsManager units={units} onUpdateUnit={handleUpdateUnit} onRefresh={loadData} />
          )}

          {activeTab === 'users' && canAccessUsers && <UsersManager />}

          {activeTab === 'settings' && canAccessSettings && <SiteSettingsManager />}
        </main>
      </div>
    </div>
  );
}
