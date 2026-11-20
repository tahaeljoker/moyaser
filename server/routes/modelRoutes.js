import { Router } from 'express';
import { PropertyModel } from '../models/PropertyModel.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = Router();

// GET /api/models (Public)
router.get('/models', async (req, res) => {
  try {
    const models = await PropertyModel.find({ isActive: true }).sort({ code: 1 });
    res.json({ success: true, count: models.length, data: models });
  } catch (error) {
    console.error('[Model Route Error] GET /models:', error);
    res.status(500).json({ success: false, message: 'تعذر جلب النماذج المعمارية.' });
  }
});

// GET /api/admin/models (Protected: all models including inactive)
router.get('/admin/models', verifyToken, requireRole(['admin', 'editor']), async (req, res) => {
  try {
    const models = await PropertyModel.find().sort({ code: 1 });
    res.json({ success: true, count: models.length, data: models });
  } catch (error) {
    res.status(500).json({ success: false, message: 'تعذر جلب النماذج.' });
  }
});

// POST /api/admin/models (Protected)
router.post('/admin/models', verifyToken, requireRole(['admin', 'editor']), async (req, res) => {
  try {
    const { code, name, type, area, bedrooms, bathrooms, floors, startingPrice, description, features, floorPlanImageUrl, renderImageUrl, isActive } = req.body;
    if (!code || !name) {
      return res.status(400).json({ success: false, message: 'كود النموذج واسم النموذج مطلوبان.' });
    }
    const cleanCode = String(code).toUpperCase().trim();
    const existing = await PropertyModel.findOne({ code: cleanCode });
    if (existing) {
      return res.status(409).json({ success: false, message: `كود النموذج (${cleanCode}) مسجل مسبقاً.` });
    }

    const newModel = await PropertyModel.create({
      code: cleanCode,
      name: String(name).trim(),
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
    console.error('[Model Route Error] POST /admin/models:', error);
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