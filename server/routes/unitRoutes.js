import { Router } from 'express';
import { Unit } from '../models/Unit.js';
import { Lead } from '../models/Lead.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = Router();

// GET /api/units (Public)
router.get('/units', async (req, res) => {
  try {
    const { status, model, type } = req.query;
    const filter = {};
    if (status && status !== 'all') filter.status = status;
    if (model && model !== 'all') filter.model = model.toUpperCase();
    if (type && type !== 'all') filter.type = type;

    const units = await Unit.find(filter).sort({ unitCode: 1 });
    res.json({ success: true, count: units.length, data: units });
  } catch (error) {
    console.error('[Unit Route Error]', error);
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
  } catch (error) {
    res.status(500).json({ success: false, message: 'فشل استرجاع تفاصيل الوحدة.' });
  }
});

// POST /api/admin/units (Protected: super_admin, admin, editor)
router.post('/admin/units', verifyToken, requireRole(['admin', 'editor']), async (req, res) => {
  try {
    const { unitCode, model, type, area, facade, price, status, floorPlanSpecs, media } = req.body;
    if (!unitCode || !price) {
      return res.status(400).json({ success: false, message: 'كود الوحدة والسعر مطلوبان.' });
    }

    const cleanCode = unitCode.toUpperCase().trim();
    const existing = await Unit.findOne({ unitCode: cleanCode });
    if (existing) {
      return res.status(409).json({ success: false, message: `كود الوحدة (${cleanCode}) مسجل مسبقاً.` });
    }

    const newUnit = await Unit.create({
      unitCode: cleanCode,
      model: model ? String(model).toUpperCase().trim() : 'A',
      type: type === 'apartment' ? 'apartment' : 'townhouse',
      area: area ? String(area).trim() : '250 م²',
      facade: facade ? String(facade).trim() : 'شمالية',
      price: Number(price),
      status: ['available', 'reserved', 'sold'].includes(status) ? status : 'available',
      floorPlanSpecs: floorPlanSpecs || {},
      media: Array.isArray(media) ? media : [],
    });

    res.status(201).json({ success: true, message: 'تمت إضافة الوحدة بنجاح.', data: newUnit });
  } catch (error) {
    console.error('[Create Unit Error]', error);
    res.status(500).json({ success: false, message: 'فشل إنشاء الوحدة.' });
  }
});

// PATCH /api/admin/units/:unitCode (Protected: super_admin, admin, editor)
router.patch('/admin/units/:unitCode', verifyToken, requireRole(['admin', 'editor']), async (req, res) => {
  try {
    const unitCode = req.params.unitCode.toUpperCase().trim();
    const { status, price, media, facade, area, model, type } = req.body;
    const allowed = {};

    if (status && ['available', 'reserved', 'sold'].includes(status)) allowed.status = status;
    if (typeof price === 'number' && price > 0) allowed.price = price;
    if (Array.isArray(media)) allowed.media = media;
    if (typeof facade === 'string') allowed.facade = facade.trim();
    if (typeof area === 'string') allowed.area = area.trim();
    if (typeof model === 'string') allowed.model = model.toUpperCase().trim();
    if (type && ['townhouse', 'apartment'].includes(type)) allowed.type = type;

    if (Object.keys(allowed).length === 0) {
      return res.status(400).json({ success: false, message: 'لا توجد بيانات صالحة للتحديث.' });
    }

    const updated = await Unit.findOneAndUpdate({ unitCode }, { $set: allowed }, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, message: 'الوحدة غير موجودة للتحديث.' });

    res.json({ success: true, message: 'تم تحديث بيانات الوحدة بنجاح.', data: updated });
  } catch (error) {
    console.error('[Admin Unit Update Error]', error);
    res.status(500).json({ success: false, message: 'فشل تحديث بيانات الوحدة.' });
  }
});

// DELETE /api/admin/units/:unitCode (Protected: super_admin, admin)
router.delete('/admin/units/:unitCode', verifyToken, requireRole(['admin']), async (req, res) => {
  try {
    const unitCode = req.params.unitCode.toUpperCase().trim();

    // Prevent deletion if linked to an active reserved or closed lead
    const linkedLead = await Lead.findOne({ unitCode, stage: { $in: ['reserved', 'closed'] } });
    if (linkedLead) {
      return res.status(409).json({
        success: false,
        message: `لا يمكن حذف الوحدة (${unitCode}) لأنها مرتبطة بطلب حجز أو شراء نشط (${linkedLead.ticketNumber}).`,
      });
    }

    const deleted = await Unit.findOneAndDelete({ unitCode });
    if (!deleted) return res.status(404).json({ success: false, message: 'الوحدة غير موجودة للحذف.' });

    res.json({ success: true, message: `تم حذف الوحدة (${unitCode}) بنجاح.` });
  } catch (error) {
    console.error('[Admin Unit Delete Error]', error);
    res.status(500).json({ success: false, message: 'فشل حذف الوحدة.' });
  }
});

export default router;
