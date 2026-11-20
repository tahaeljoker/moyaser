import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema(
  {
    projectName: { type: String, default: 'تاون هاوس الشامخة', trim: true },
    city: { type: String, default: 'الدمام — حي حديقة الأثير', trim: true },
    heroTitle: { type: String, default: 'تاون هاوس الشامخة', trim: true },
    heroSubtitle: { type: String, default: 'عنوان الاستقرار والرفاهية العائلية بالدمام', trim: true },
    regaLicense: { type: String, default: '1200028491', trim: true },
    falLicense: { type: String, default: '1100248950', trim: true },
    whatsappNumber: { type: String, default: '966500550223', trim: true },
    phoneNumber: { type: String, default: '+966 50 055 0223', trim: true },
    mapUrl: { type: String, default: 'https://maps.google.com/?q=Dammam+Al+Atheer+Park', trim: true },
    aboutText: {
      type: String,
      default: 'وحدات دوبلكس سكنية مستقلة بتصاميم عصرية ومسطحات بناء واسعة تلبي تطلعات الأسرة السعودية.',
      trim: true,
    },
    isDemoPurged: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const SiteSettings =
  mongoose.models.SiteSettings || mongoose.model('SiteSettings', siteSettingsSchema);

export default SiteSettings;
