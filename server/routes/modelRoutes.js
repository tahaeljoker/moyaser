import { Router } from 'express';
import { PropertyModel } from '../models/PropertyModel.js';
import { Project } from '../models/Project.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = Router();

const resolveProjectFilter = async (query) => {
  const { projectId, slug, projectSlug } = query;
  if (projectId) return { projectId };
  const s = slug || projectSlug;
  if (s) {
    const proj = await Project.findOne({ slug: s }).select('_id');
    if (proj) return { projectId: proj._id };
  }
  return {};
};

const fallbackAllModels = [
  { _id: 'm-a', projectId: 'shamkha', slug: 'shamkha', projectName: 'تاون هاوس الشامخة', code: 'A', name: 'الدوبلكس الأرضي الرحب', type: 'townhouse', area: '427.75 م²', bedrooms: 4, bathrooms: 5, floors: 'دور أرضي + دور أول + حوش خاص', startingPrice: 0, description: 'دوبلكس أرضي رحب مع حوش وارتداد خاص 177 م² وكراج مستقل.', renderImageUrl: '/images/shamkha/render-a.webp', floorPlanImageUrl: '/images/shamkha/plan-a-1.webp', isActive: true },
  { _id: 'm-b', projectId: 'shamkha', slug: 'shamkha', projectName: 'تاون هاوس الشامخة', code: 'B', name: 'الدوبلكس العلوي مع السطح', type: 'townhouse', area: '302 م²', bedrooms: 4, bathrooms: 4, floors: 'دور علوي + ملحق روف + جلسة سطح', startingPrice: 0, description: 'إطلالة مفتوحة وجلسة سطح خاصة وتوزيع ذكي.', renderImageUrl: '/images/shamkha/render-b.webp', floorPlanImageUrl: '/images/shamkha/plan-b-1.webp', isActive: true },
  { _id: 'm-r1', projectId: 'al-rafeeah', slug: 'al-rafeeah', projectName: 'تاون هاوس الرفيعة', code: 'R-1', name: 'فيلا الأفق المفتوح', type: 'townhouse', area: '345 م²', bedrooms: 4, bathrooms: 5, floors: 'دورين وملحق روف', startingPrice: 1580000, description: 'دوبلكس علوي واسع مع جلسة روف خارجية بإطلالة بانورامية وتأسيس مصعد وصالة عائلية فسيحة.', renderImageUrl: '/images/shamkha/render-b.webp', floorPlanImageUrl: '/images/shamkha/plan-b-1.webp', isActive: true },
  { _id: 'm-r2', projectId: 'al-rafeeah', slug: 'al-rafeeah', projectName: 'تاون هاوس الرفيعة', code: 'R-2', name: 'تاون هاوس الواحة الأرضي', type: 'townhouse', area: '395 م²', bedrooms: 4, bathrooms: 5, floors: 'دور أرضي + دور أول + حوش خاص', startingPrice: 1720000, description: 'دوبلكس أرضي رحب مع حديقة وارتداد خاص 140 م²، مجلس رجال مستقل ومدخل خاص مباشر.', renderImageUrl: '/images/shamkha/render-a.webp', floorPlanImageUrl: '/images/shamkha/plan-a-1.webp', isActive: true },
  { _id: 'm-n1', projectId: 'al-nakheel', slug: 'al-nakheel', projectName: 'دوبلكسات النخيل المعمارية', code: 'N-1', name: 'الدوبلكس الذكي الفاخر', type: 'townhouse', area: '320 م²', bedrooms: 4, bathrooms: 4, floors: '3 أدوار متصلة', startingPrice: 1420000, description: 'تصميم عصري مدمج بأنظمة المنزل الذكي وإضاءة سماوية طبيعية وصالة استقبال ضيوف فندقية.', renderImageUrl: '/images/shamkha/render-c.webp', floorPlanImageUrl: '/images/shamkha/plan-c-1.webp', isActive: true },
  { _id: 'm-n2', projectId: 'al-nakheel', slug: 'al-nakheel', projectName: 'دوبلكسات النخيل المعمارية', code: 'N-2', name: 'فيلا التراس البانورامي', type: 'townhouse', area: '365 م²', bedrooms: 5, bathrooms: 5, floors: 'دورين + ملحق روف مجهز', startingPrice: 1610000, description: 'مسطحات عائلية رحبة تضمن الخصوصية التامة مع تراس علوي مجهز لجلسات الشواء وإطلالة مفتوحة.', renderImageUrl: '/images/shamkha/hero-exterior.webp', floorPlanImageUrl: '/images/shamkha/plan-b-2.webp', isActive: true },
  { _id: 'm-s1', projectId: 'al-sarawat', slug: 'al-sarawat', projectName: 'تاون هاوس السروات', code: 'S-1', name: 'الدوبلكس الركني الكبير', type: 'townhouse', area: '415 م²', bedrooms: 5, bathrooms: 6, floors: 'دور أرضي + دور أول + ملحق', startingPrice: 1850000, description: 'الوحدة الأكثر رحابة في المشروع بموقع ركني مميز، واجهات زجاجية واسعة، حوش خاص، وكراج يتسع لسيارتين.', renderImageUrl: '/images/shamkha/render-a.webp', floorPlanImageUrl: '/images/shamkha/plan-a-2.webp', isActive: true },
  { _id: 'm-s2', projectId: 'al-sarawat', slug: 'al-sarawat', projectName: 'تاون هاوس السروات', code: 'S-2', name: 'تاون هاوس الرووف الملكي', type: 'townhouse', area: '330 م²', bedrooms: 4, bathrooms: 4, floors: 'دور علوي + ملحق روف', startingPrice: 1540000, description: 'تصميم مخصص للعائلات الباحثة عن الراحة والاستقلالية، يضم صالة عائلية مفتوحة وغرف نوم فسيحة.', renderImageUrl: '/images/shamkha/render-c.webp', floorPlanImageUrl: '/images/shamkha/plan-b-1.webp', isActive: true },
];

// GET /api/models (Public)
router.get('/models', async (req, res) => {
  try {
    const pFilter = await resolveProjectFilter(req.query);
    const filter = { isActive: true, ...pFilter };
    const models = await PropertyModel.find(filter).sort({ code: 1 });
    if (models.length === 0) {
      const targetSlug = req.query.slug || req.query.projectSlug;
      const matched = targetSlug ? fallbackAllModels.filter((m) => m.slug === targetSlug || m.projectId === targetSlug) : fallbackAllModels;
      return res.json({ success: true, count: matched.length, data: matched });
    }
    res.json({ success: true, count: models.length, data: models });
  } catch (error) {
    const targetSlug = req.query.slug || req.query.projectSlug;
    const matched = targetSlug ? fallbackAllModels.filter((m) => m.slug === targetSlug || m.projectId === targetSlug) : fallbackAllModels;
    res.json({ success: true, count: matched.length, data: matched });
  }
});

// GET /api/admin/models (Protected)
router.get('/admin/models', verifyToken, requireRole(['admin', 'editor']), async (req, res) => {
  try {
    const pFilter = await resolveProjectFilter(req.query);
    const models = await PropertyModel.find(pFilter).sort({ code: 1 });
    res.json({ success: true, count: models.length, data: models });
  } catch (error) {
    res.status(500).json({ success: false, message: 'تعذر جلب النماذج.' });
  }
});

// POST /api/admin/models (Protected)
router.post('/admin/models', verifyToken, requireRole(['admin', 'editor']), async (req, res) => {
  try {
    const { code, name, type, area, bedrooms, bathrooms, floors, startingPrice, description, features, floorPlanImageUrl, renderImageUrl, isActive, projectId, projectName } = req.body;
    if (!code || !name) {
      return res.status(400).json({ success: false, message: 'كود النموذج واسم النموذج مطلوبان.' });
    }
    const cleanCode = String(code).toUpperCase().trim();
    let finalProjectName = projectName || '';
    if (projectId && !finalProjectName) {
      const proj = await Project.findById(projectId).select('name');
      if (proj) finalProjectName = proj.name;
    }

    const newModel = await PropertyModel.create({
      code: cleanCode,
      name: String(name).trim(),
      projectId: projectId || null,
      projectName: finalProjectName,
      type: type ? String(type).trim() : 'townhouse',
      area: area ? String(area).trim() : '250 م²',
      bedrooms: Number(bedrooms) || 4,
      bathrooms: Number(bathrooms) || 5,
      floors: floors ? String(floors).trim() : 'دورين وملحق',
      startingPrice: Number(startingPrice) || 0,
      description: description ? String(description).trim() : '',
      features: Array.isArray(features) ? features : [],
      floorPlanImageUrl: floorPlanImageUrl ? String(floorPlanImageUrl).trim() : '',
      renderImageUrl: renderImageUrl ? String(renderImageUrl).trim() : '',
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });

    res.status(201).json({ success: true, message: 'تمت إضافة النموذج المعماري بنجاح.', data: newModel });
  } catch (error) {
    res.status(500).json({ success: false, message: 'فشل حفظ النموذج المعماري.' });
  }
});

// PATCH /api/admin/models/:id (Protected)
router.patch('/admin/models/:id', verifyToken, requireRole(['admin', 'editor']), async (req, res) => {
  try {
    const updated = await PropertyModel.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, message: 'النموذج غير موجود.' });
    res.json({ success: true, message: 'تم تحديث النموذج بنجاح.', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'تعذر تحديث بيانات النموذج.' });
  }
});

// DELETE /api/admin/models/:id (Protected)
router.delete('/admin/models/:id', verifyToken, requireRole(['admin', 'editor']), async (req, res) => {
  try {
    const deleted = await PropertyModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'النموذج غير موجود للحذف.' });
    res.json({ success: true, message: 'تم حذف النموذج المعماري بنجاح.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'فشل حذف النموذج.' });
  }
});

export default router;
