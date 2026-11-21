import { useState, useEffect } from 'react';
import { fetchSiteSettings } from '../services/api.js';
import InfoBar from './layout/InfoBar.jsx';
import Navbar from './layout/Navbar.jsx';
import Footer from './layout/Footer.jsx';
import Hero from './sections/Hero.jsx';
import Reveal from './ui/Reveal.jsx';
import AboutSection from './sections/AboutSection.jsx';
import ProjectGallery from './sections/ProjectGallery.jsx';
import ModelsShowcase from './sections/ModelsShowcase.jsx';
import UnitMatrix from './sections/UnitMatrix.jsx';
import LocationSection from './sections/LocationSection.jsx';
import NearbyLandmarks from './sections/NearbyLandmarks.jsx';
import QualityGuaranteesHub from './sections/QualityGuaranteesHub.jsx';
import BookingForm from './sections/BookingForm.jsx';
import InspectionModal from './modals/InspectionModal.jsx';
import VideoTourModal from './modals/VideoTourModal.jsx';
import FloorPlanModal from './modals/FloorPlanModal.jsx';
import BookingConfirmationModal from './modals/BookingConfirmationModal.jsx';
import Toast from './ui/Toast.jsx';

export default function PublicShowcase() {
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

      <main>
        <Reveal direction="up">
          <AboutSection />
        </Reveal>

        {vs?.gallery !== false && (
          <Reveal direction="up">
            <ProjectGallery settings={siteSettings} />
          </Reveal>
        )}

        {vs?.models !== false && (
          <Reveal direction="up">
            <ModelsShowcase
              onOpenVideo={handleOpenVideo}
              onOpenFloorPlan={handleOpenFloorPlan}
              onOpenInspection={handleOpenInspection}
            />
          </Reveal>
        )}

        {vs?.unitMatrix !== false && (
          <Reveal direction="up">
            <UnitMatrix onSelectUnit={(unit) => handleOpenInspection({ unitId: unit.id, unitCode: unit.unitCode, unit })} />
          </Reveal>
        )}

        {vs?.location !== false && (
          <Reveal direction="up">
            <LocationSection />
            <NearbyLandmarks />
          </Reveal>
        )}

        <Reveal direction="up">
          <QualityGuaranteesHub visibleSections={vs} />
        </Reveal>

        <Reveal direction="up">
          <BookingForm onBookingSuccess={handleBookingSuccess} onShowToast={showToast} />
        </Reveal>
      </main>

      <Footer settings={siteSettings} />

      <InspectionModal isOpen={inspectionModalOpen} onClose={() => setInspectionModalOpen(false)} data={inspectionData} onShowToast={showToast} />
      <VideoTourModal isOpen={videoModalOpen} onClose={() => setVideoModalOpen(false)} modelCode={videoModelCode} onOpenInspection={handleOpenInspection} />
      <FloorPlanModal isOpen={floorPlanModalOpen} onClose={() => setFloorPlanModalOpen(false)} modelCode={floorPlanModelCode} />
      <BookingConfirmationModal isOpen={confirmationModalOpen} onClose={() => setConfirmationModalOpen(false)} bookingData={confirmationData} />
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
