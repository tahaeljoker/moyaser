import { Router } from 'express';
import { Unit } from '../models/Unit.js';
import { Lead } from '../models/Lead.js';
import { Project } from '../models/Project.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = Router();

const parseMedia = (media) => {
  if (media && typeof media === 'object' && !Array.isArray(media)) {
    return {
      images: Array.isArray(media.images) ? media.images.map((s) => String(s).trim()).filter(Boolean) : [],
      videoUrl: media.videoUrl ? String(media.videoUrl).trim() : '',
      tour3dUrl: media.tour3dUrl ? String(media.tour3dUrl).trim() : '',
    };
  }
  if (Array.isArray(media)) {
    return {
      images: media.map((m) => (typeof m === 'string' ? m.trim() : m?.url ? String(m.url).trim() : '')).filter(Boolean),
      videoUrl: '', tour3dUrl: '',
    };
  }
  return { images: [], videoUrl: '', tour3dUrl: '' };
};

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

// GET /api/units (Public)
router.get('/units', async (req, res) => {
  try {
    const { status, model, type } = req.query;
    const pFilter = await resolveProjectFilter(req.query);
    const filter = { ...pFilter };
    if (status && status !== 'all') filter.status = status;
    if (model && model !== 'all') filter.model = model.toUpperCase();
    if (type && type !== 'all') filter.type = type;

    const units = await Unit.find(filter).sort({ unitCode: 1 });
    res.json({ success: true, count: units.length, data: units });
  } catch (error) {
    res.status(500).json({ success: false, message: 'فشل استرجاع بيانات الوحدات السكنية.' });
  }
});

// GET /api/units/:unitCode (Public)
router.get('/units/:unitCode', async (req, res) => {
  try {
    const unitCode = req.params.unitCode.toUpperCase().trim();
    const unit = await Unit.findOne({ unitCode });
    if (!unit) return res.status(404).json({ success: false, message: 'الوحدة غير موجودة.' });
    res.json({ success: true, data: unit });
  } catch {
    res.status(500).json({ success: false, message: 'فشل استرجاع تفاصيل الوحدة.' });
  }
});

// POST /api/admin/units (Protected)
router.post('/admin/units', verifyToken, requireRole(['admin', 'editor']), async (req, res) => {
  try {
    const { unitCode, model, type, area, facade, price, status, floorPlanSpecs, media, projectId, projectName } = req.body;
    if (!unitCode) return res.status(400).json({ success: false, message: 'كود الوحدة مطلوب.' });
    const cleanCode = unitCode.toUpperCase().trim();
    const existing = await Unit.findOne({ unitCode: cleanCode });
    if (existing) return res.status(409).json({ success: false, message: `كود الوحدة (${cleanCode}) مسجل مسبقاً.` });

    let finalProjectName = projectName || '';
    if (projectId && !finalProjectName) {
      const proj = await Project.findById(projectId).select('name');
      if (proj) finalProjectName = proj.name;
    }

    const newUnit = await Unit.create({
      unitCode: cleanCode,
      projectId: projectId || null,
      projectName: finalProjectName,
      model: model ? String(model).toUpperCase().trim() : 'A',
      type: type === 'apartment' ? 'apartment' : 'townhouse',
      area: area ? String(area).trim() : '250 م²',
      facade: facade ? String(facade).trim() : 'شمالية',
      price: Number(price) || 0,
      status: ['available', 'reserved', 'sold'].includes(status) ? status : 'available',
      floorPlanSpecs: floorPlanSpecs || {},
      media: parseMedia(media),
    });

    res.status(201).json({ success: true, message: 'تمت إضافة الوحدة بنجاح.', data: newUnit });
  } catch (error) {
    res.status(500).json({ success: false, message: 'فشل إنشاء الوحدة.' });
  }
});

// PATCH /api/admin/units/:unitCode (Protected)
router.patch('/admin/units/:unitCode', verifyToken, requireRole(['admin', 'editor']), async (req, res) => {
  try {
    const unitCode = req.params.unitCode.toUpperCase().trim();
    const { status, price, media, facade, area, model, type, projectId, projectName } = req.body;
    const allowed = {};

    if (status && ['available', 'reserved', 'sold'].includes(status)) allowed.status = status;
    if (price !== undefined) allowed.price = Number(price) || 0;
    if (media !== undefined) allowed.media = parseMedia(media);
    if (typeof facade === 'string') allowed.facade = facade.trim();
    if (typeof area === 'string') allowed.area = area.trim();
    if (typeof model === 'string') allowed.model = model.toUpperCase().trim();
    if (type && ['townhouse', 'apartment'].includes(type)) allowed.type = type;
    if (projectId !== undefined) allowed.projectId = projectId || null;
    if (projectName !== undefined) allowed.projectName = String(projectName).trim();

    if (Object.keys(allowed).length === 0) {
      return res.status(400).json({ success: false, message: 'لا توجد بيانات صالحة للتحديث.' });
    }

    const updated = await Unit.findOneAndUpdate({ unitCode }, { $set: allowed }, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, message: 'الوحدة غير موجودة للتحديث.' });
    res.json({ success: true, message: 'تم تحديث بيانات الوحدة بنجاح.', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'فشل تحديث بيانات الوحدة.' });
  }
});

// DELETE /api/admin/units/:unitCode (Protected)
router.delete('/admin/units/:unitCode', verifyToken, requireRole(['admin']), async (req, res) => {
  try {
    const unitCode = req.params.unitCode.toUpperCase().trim();
    const linkedLead = await Lead.findOne({ unitCode, stage: { $in: ['reserved', 'closed'] } });
    if (linkedLead) {
      return res.status(409).json({
        success: false,
        message: `لا يمكن حذف الوحدة (${unitCode}) لارتباطها بطلب نشط (${linkedLead.ticketNumber}).`,
      });
    }

    const deleted = await Unit.findOneAndDelete({ unitCode });
    if (!deleted) return res.status(404).json({ success: false, message: 'الوحدة غير موجودة للحذف.' });
    res.json({ success: true, message: `تم حذف الوحدة (${unitCode}) بنجاح.` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'فشل حذف الوحدة.' });
  }
});

export default router;
