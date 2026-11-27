import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema(
  {
    projectName: { type: String, default: 'تاون هاوس الشامخة', trim: true },
    city: { type: String, default: 'الدمام — حي حديقة الأثير', trim: true },
    heroTitle: { type: String, default: 'تاون هاوس الشامخة', trim: true },
    heroSubtitle: { type: String, default: 'عنوان الاستقرار والرفاهية العائلية بالدمام', trim: true },
    regaLicense: { type: String, default: '', trim: true },
    falLicense: { type: String, default: '', trim: true },
    whatsappNumber: { type: String, default: '966500550223', trim: true },
    phoneNumber: { type: String, default: '+966 50 055 0223', trim: true },
    mapUrl: { type: String, default: 'https://maps.google.com/?q=Dammam+Al+Atheer+Park', trim: true },
    aboutText: {
      type: String,
      default: 'وحدات دوبلكس سكنية مستقلة بتصاميم عصرية ومسطحات بناء واسعة تلبي تطلعات الأسرة السعودية.',
      trim: true,
    },
    heroImageUrl: { type: String, default: '', trim: true },
    heroVideoUrl: { type: String, default: '', trim: true },
    projectTour3dUrl: { type: String, default: '', trim: true },
    galleryImages: [
      {
        url: { type: String, required: true },
        title: { type: String, default: '' },
        category: { type: String, default: 'exterior' },
      },
    ],
    announcementBar: {
      enabled: { type: Boolean, default: false },
      text: { type: String, default: '' },
    },
    socialLinks: {
      snapchat: { type: String, default: '' },
      instagram: { type: String, default: '' },
      x: { type: String, default: '' },
      tiktok: { type: String, default: '' },
      email: { type: String, default: '' },
    },
    officeInfo: {
      address: { type: String, default: 'الدمام — حي حديقة الأثير' },
      workingHours: { type: String, default: 'السبت - الخميس: 9:00 ص - 9:00 م' },
    },
    visibleSections: {
      gallery: { type: Boolean, default: true },
      models: { type: Boolean, default: true },
      unitMatrix: { type: Boolean, default: true },
      location: { type: Boolean, default: true },
      specs: { type: Boolean, default: true },
      guarantees: { type: Boolean, default: true },
      afterSales: { type: Boolean, default: true },
      partners: { type: Boolean, default: true },
    },
    siteCopy: {
      footerBadge1: { type: String, default: '', trim: true, maxlength: 40 },
      footerBadge2: { type: String, default: '', trim: true, maxlength: 40 },
      footerBadge3: { type: String, default: '', trim: true, maxlength: 40 },
      homeServicesConsultationDesc: { type: String, default: '', trim: true, maxlength: 150 },
      partnersMarketingSpec: { type: String, default: '', trim: true, maxlength: 40 },
      partnersWarrantyDesc: { type: String, default: '', trim: true, maxlength: 100 },
      whyUsIndependenceTitle: { type: String, default: '', trim: true, maxlength: 40 },
      whyUsIndependenceDesc: { type: String, default: '', trim: true, maxlength: 90 },
      servicesPageDevDesc: { type: String, default: '', trim: true, maxlength: 160 },
      projectsHeaderDesc: { type: String, default: '', trim: true, maxlength: 210 },
      projectsHeaderStat: { type: String, default: '', trim: true, maxlength: 40 },
      archVisionDesc: { type: String, default: '', trim: true, maxlength: 180 },
      archVisionSpec: { type: String, default: '', trim: true, maxlength: 40 },
      masterplanBadge: { type: String, default: '', trim: true, maxlength: 40 },
      showcaseIndependenceLabel: { type: String, default: '', trim: true, maxlength: 40 },
      showcaseIndependenceVal: { type: String, default: '', trim: true, maxlength: 40 },
      showcaseDesc: { type: String, default: '', trim: true, maxlength: 170 },
      showcaseStatusBadge: { type: String, default: '', trim: true, maxlength: 40 },
      showcaseFooterTag: { type: String, default: '', trim: true, maxlength: 40 },
    },
    isDemoPurged: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const SiteSettings =
  mongoose.models.SiteSettings || mongoose.model('SiteSettings', siteSettingsSchema);

export default SiteSettings;
