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

// GET /api/models (Public)
router.get('/models', async (req, res) => {
  try {
    const pFilter = await resolveProjectFilter(req.query);
    const filter = { isActive: true, ...pFilter };
    const models = await PropertyModel.find(filter).sort({ code: 1 });
    res.json({ success: true, count: models.length, data: models });
  } catch (error) {
    res.status(500).json({ success: false, message: 'تعذر جلب النماذج المعمارية.' });
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
