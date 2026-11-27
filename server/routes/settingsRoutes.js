import { Router } from 'express';
import { SiteSettings } from '../models/SiteSettings.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = Router();

const SITE_COPY_LIMITS = {
  footerBadge1: 40,
  footerBadge2: 40,
  footerBadge3: 40,
  homeServicesConsultationDesc: 150,
  partnersMarketingSpec: 40,
  partnersWarrantyDesc: 100,
  whyUsIndependenceTitle: 40,
  whyUsIndependenceDesc: 90,
  servicesPageDevDesc: 160,
  projectsHeaderDesc: 210,
  projectsHeaderStat: 40,
  archVisionDesc: 180,
  archVisionSpec: 40,
  masterplanBadge: 40,
  showcaseIndependenceLabel: 40,
  showcaseIndependenceVal: 40,
  showcaseDesc: 170,
  showcaseStatusBadge: 40,
  showcaseFooterTag: 40,
};

// GET /api/settings (Public — Get Current Site Settings)
router.get('/settings', async (req, res) => {
  try {
    let settings = await SiteSettings.findOne().lean();
    if (!settings) settings = await SiteSettings.create({});
    res.json({ success: true, data: settings });
  } catch (error) {
    console.error('[SiteSettings Error] GET /settings:', error);
    res.status(500).json({ success: false, message: 'تعذر جلب إعدادات الموقع.' });
  }
});

// PUT /api/admin/settings (Protected: super_admin, admin, editor)
router.put('/admin/settings', verifyToken, requireRole(['admin', 'editor']), async (req, res) => {
  try {
    const {
      projectName, city, heroTitle, heroSubtitle, regaLicense, falLicense,
      whatsappNumber, phoneNumber, mapUrl, aboutText, heroImageUrl, heroVideoUrl,
      projectTour3dUrl, galleryImages, announcementBar, socialLinks, officeInfo, visibleSections, siteCopy,
    } = req.body;

    const updates = {};
    if (projectName !== undefined) updates.projectName = String(projectName).trim();
    if (city !== undefined) updates.city = String(city).trim();
    if (heroTitle !== undefined) updates.heroTitle = String(heroTitle).trim();
    if (heroSubtitle !== undefined) updates.heroSubtitle = String(heroSubtitle).trim();
    if (regaLicense !== undefined) updates.regaLicense = String(regaLicense).trim();
    if (falLicense !== undefined) updates.falLicense = String(falLicense).trim();
    if (whatsappNumber !== undefined) updates.whatsappNumber = String(whatsappNumber).trim();
    if (phoneNumber !== undefined) updates.phoneNumber = String(phoneNumber).trim();
    if (mapUrl !== undefined) updates.mapUrl = String(mapUrl).trim();
    if (aboutText !== undefined) updates.aboutText = String(aboutText).trim();
    if (heroImageUrl !== undefined) updates.heroImageUrl = String(heroImageUrl).trim();
    if (heroVideoUrl !== undefined) updates.heroVideoUrl = String(heroVideoUrl).trim();
    if (projectTour3dUrl !== undefined) updates.projectTour3dUrl = String(projectTour3dUrl).trim();
    if (Array.isArray(galleryImages)) updates.galleryImages = galleryImages;
    if (announcementBar && typeof announcementBar === 'object') updates.announcementBar = announcementBar;
    if (socialLinks && typeof socialLinks === 'object') updates.socialLinks = socialLinks;
    if (officeInfo && typeof officeInfo === 'object') updates.officeInfo = officeInfo;
    if (visibleSections && typeof visibleSections === 'object') updates.visibleSections = visibleSections;
    if (siteCopy !== undefined) {
      if (!siteCopy || typeof siteCopy !== 'object' || Array.isArray(siteCopy)) {
        return res.status(400).json({ success: false, message: 'الحقل siteCopy يجب أن يكون كائناً صالحاً.' });
      }
      const existing = await SiteSettings.findOne().lean();
      for (const [k, v] of Object.entries(siteCopy)) {
        if (!Object.prototype.hasOwnProperty.call(SITE_COPY_LIMITS, k)) {
          return res.status(400).json({ success: false, message: `الحقل siteCopy.${k} غير مسموح به.` });
        }
        if (typeof v !== 'string') {
          return res.status(400).json({ success: false, message: `قيمة الحقل siteCopy.${k} يجب أن تكون نصاً.` });
        }
        const trimmed = v.trim();
        const maxLen = SITE_COPY_LIMITS[k];
        const existingVal = typeof existing?.siteCopy?.[k] === 'string' ? existing.siteCopy[k] : '';
        if (trimmed.length > maxLen) {
          if (trimmed === existingVal) continue;
          return res.status(400).json({
            success: false,
            message: `الحقل siteCopy.${k} يتجاوز الحد الأقصى (${maxLen} حرفاً).`,
          });
        }
        updates[`siteCopy.${k}`] = trimmed;
      }
    }

    const settings = await SiteSettings.findOneAndUpdate(
      {},
      { $set: updates },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({ success: true, message: 'تم حفظ إعدادات وهوية الموقع بنجاح.', data: settings });
  } catch (error) {
    console.error('[SiteSettings Error] PUT /admin/settings:', error);
    res.status(500).json({ success: false, message: 'تعذر حفظ إعدادات الموقع.' });
  }
});

export default router;