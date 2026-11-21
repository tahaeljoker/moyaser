import { useState, useEffect } from 'react';
import { fetchSiteSettings } from '../services/api.js';
import InfoBar from './layout/InfoBar.jsx';
import Navbar from './layout/Navbar.jsx';
import Footer from './layout/Footer.jsx';
import Hero from './sections/Hero.jsx';
import ProjectTabs from './sections/ProjectTabs.jsx';
import UpcomingProjects from './sections/UpcomingProjects.jsx';
import UnitMatrix from './sections/UnitMatrix.jsx';
import ModelsShowcase from './sections/ModelsShowcase.jsx';
import PropertiesCatalog from './sections/PropertiesCatalog.jsx';
import AboutSection from './sections/AboutSection.jsx';
import LocationSection from './sections/LocationSection.jsx';
import NearbyLandmarks from './sections/NearbyLandmarks.jsx';
import TechnicalSpecs from './sections/TechnicalSpecs.jsx';
import ProjectGuarantees from './sections/ProjectGuarantees.jsx';
import AfterSalesPartners from './sections/AfterSalesPartners.jsx';
import BookingForm from './sections/BookingForm.jsx';
import InspectionModal from './modals/InspectionModal.jsx';
import VideoTourModal from './modals/VideoTourModal.jsx';
import FloorPlanModal from './modals/FloorPlanModal.jsx';
import BookingConfirmationModal from './modals/BookingConfirmationModal.jsx';
import Toast from './ui/Toast.jsx';

export default function PublicShowcase() {
  const [projectTab, setProjectTab] = useState('ready');
  const [siteSettings, setSiteSettings] = useState(null);

  useEffect(() => {
    fetchSiteSettings().then((res) => {
      if (res?.data) setSiteSettings(res.data);
    }).catch(() => { });
  }, []);

  // Modal states
  const [inspectionModalOpen, setInspectionModalOpen] = useState(false);
  const [inspectionData, setInspectionData] = useState(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [videoModelCode, setVideoModelCode] = useState('A');
  const [floorPlanModalOpen, setFloorPlanModalOpen] = useState(false);
  const [floorPlanModelCode, setFloorPlanModelCode] = useState('A');
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [confirmationData, setConfirmationData] = useState(null);

  // Toasts
  const [toasts, setToasts] = useState([]);
  const showToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => { setToasts((prev) => prev.filter((t) => t.id !== id)); }, 4500);
  };
  const dismissToast = (id) => { setToasts((prev) => prev.filter((t) => t.id !== id)); };

  const handleOpenInspection = (data = {}) => { setInspectionData(data); setInspectionModalOpen(true); };
  const handleOpenVideo = (code = 'A') => { setVideoModelCode(code); setVideoModalOpen(true); };
  const handleOpenFloorPlan = (code = 'A') => { setFloorPlanModelCode(code); setFloorPlanModalOpen(true); };
  const handleBookingSuccess = (payload) => {
    setConfirmationData(payload);
    setConfirmationModalOpen(true);
    showToast(`تم تسجيل طلبك بنجاح (${payload.ticket})`, 'success');
  };

  const vs = siteSettings?.visibleSections;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased selection:bg-emerald-800 selection:text-white" dir="rtl">
      <InfoBar settings={siteSettings} />
      <Navbar />
      <Hero settings={siteSettings} />
      <ProjectTabs activeTab={projectTab} setActiveTab={setProjectTab} />

      {projectTab === 'upcoming' ? (
        <UpcomingProjects />
      ) : (
        <div>
          {vs?.unitMatrix !== false && (
            <UnitMatrix onSelectUnit={(unit) => handleOpenInspection({ unitId: unit.id, unitCode: unit.unitCode, unit })} />
          )}

          {vs?.models !== false && (
            <ModelsShowcase
              onOpenVideo={handleOpenVideo}
              onOpenFloorPlan={handleOpenFloorPlan}
              onOpenInspection={handleOpenInspection}
            />
          )}

          <PropertiesCatalog onOpenInspection={handleOpenInspection} />
          <AboutSection />

          {vs?.location !== false && (
            <>
              <LocationSection />
              <NearbyLandmarks />
            </>
          )}

          {vs?.specs !== false && <TechnicalSpecs />}
          {vs?.guarantees !== false && <ProjectGuarantees />}
          {(vs?.afterSales !== false || vs?.partners !== false) && <AfterSalesPartners />}

          <BookingForm onBookingSuccess={handleBookingSuccess} onShowToast={showToast} />
        </div>
      )}

      <Footer settings={siteSettings} />

      <InspectionModal isOpen={inspectionModalOpen} onClose={() => setInspectionModalOpen(false)} data={inspectionData} onShowToast={showToast} />
      <VideoTourModal isOpen={videoModalOpen} onClose={() => setVideoModalOpen(false)} modelCode={videoModelCode} onOpenInspection={handleOpenInspection} />
      <FloorPlanModal isOpen={floorPlanModalOpen} onClose={() => setFloorPlanModalOpen(false)} modelCode={floorPlanModelCode} />
      <BookingConfirmationModal isOpen={confirmationModalOpen} onClose={() => setConfirmationModalOpen(false)} bookingData={confirmationData} />
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
