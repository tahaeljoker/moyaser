import { Router } from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { Project } from '../models/Project.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = Router();

const canViewInactive = (req) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ') || !process.env.JWT_SECRET) return false;
  try {
    const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
    return ['super_admin', 'admin', 'editor'].includes(decoded.role);
  } catch { return false; }
};

const shamkhaFallback = {
  _id: 'shamkha-fallback',
  name: 'تاون هاوس الشامخة',
  slug: 'shamkha',
  tagline: 'مجتمع سكني فاخر بتصاميم عصرية وضمانات شاملة',
  description: 'مشروع تاون هاوس الشامخة بالدمام يجمع بين الخصوصية التامة والاستقلالية المعمارية في موقع استراتيجي مطل على حديقة الأثير العامة.',
  city: 'الدمام',
  district: 'حي حديقة الأثير',
  status: 'available',
  heroImageUrl: '/images/shamkha/hero-exterior.webp',
  masterplanUrl: '/images/shamkha/masterplan.webp',
  contactPhone: '0500550223',
  whatsappNumber: '966500550223',
  mapUrl: 'https://maps.google.com/?q=Dammam+Al+Atheer+Park',
  regaLicense: '1200028491',
  valLicense: '1100248950',
  specs: [
    'صك إلكتروني مستقل لكل وحدة سكنية',
    'عدادات مياه وكهرباء مستقلة ومنفصلة',
    'كراج سيارة خاص ومدخل مستقل',
    'تأسيس مصعد بجميع النماذج العلوية',
    'عزل حراري ومائي معتمد من شركة الكهرباء',
  ],
  guarantees: [
    { title: 'الهيكل الإنشائي', duration: '10 سنوات', details: 'شهادة تأمين معتمدة ضد العيوب الخفية' },
    { title: 'القواطع والتمديدات الكهربائية', duration: '25 سنة', details: 'ضمان شركة الفنار المعتمد' },
    { title: 'الأنابيب والتمديدات الصحية', duration: '15 سنة', details: 'ضمان معتمد ضد التسريبات' },
    { title: 'العزل المائي والحراري', duration: '10 سنوات', details: 'ضمان عزل الأسطح ودورات المياه' },
  ],
  afterSales: [
    'خدمة صيانة ومتابعة مخصصة خلال السنة الأولى',
    'إدارة اتحاد الملاك وتسليم كتيب الإرشادات التشغيلية',
    'توثيق رسمي لكافة شهادات الضمان المعتمدة',
  ],
  visibleSections: {
    models: true, unitMatrix: true, gallery: true, location: true,
    specs: true, guarantees: true, afterSales: true,
  },
  isActive: true,
  sortOrder: 1,
};

// GET /api/projects (Public)
router.get('/projects', async (req, res) => {
  try {
    const filter = (req.query.includeInactive === 'true' && canViewInactive(req)) ? {} : { isActive: true };
    const projects = await Project.find(filter).sort({ sortOrder: 1, createdAt: -1 });
    if (projects.length === 0) {
      return res.json({ success: true, count: 1, data: [shamkhaFallback] });
    }
    res.json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: 'تعذر جلب المشاريع.' });
  }
});

// GET /api/projects/:slug (Public)
router.get('/projects/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const isId = mongoose.Types.ObjectId.isValid(slug);
    let project = await Project.findOne(isId ? { $or: [{ slug }, { _id: slug }] } : { slug });
    if (!project && slug === 'shamkha') {
      project = shamkhaFallback;
    }
    if (!project) return res.status(404).json({ success: false, message: 'المشروع غير موجود.' });
    res.json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: 'تعذر جلب تفاصيل المشروع.' });
  }
});

// Admin Routes (Protected)
const adminAuth = [verifyToken, requireRole(['admin', 'editor'])];

router.post('/admin/projects', ...adminAuth, async (req, res) => {
  try {
    const { name, slug } = req.body;
    if (!name || !slug) return res.status(400).json({ success: false, message: 'اسم المشروع والمعرف مطلوبان.' });
    const cleanSlug = String(slug).toLowerCase().trim();
    const existing = await Project.findOne({ slug: cleanSlug });
    if (existing) return res.status(409).json({ success: false, message: 'المعرف مستخدم لمشروع آخر.' });
    const project = await Project.create({ ...req.body, slug: cleanSlug });
    res.status(201).json({ success: true, message: 'تم إنشاء المشروع بنجاح.', data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: 'فشل إنشاء المشروع.' });
  }
});

router.put('/admin/projects/:id', ...adminAuth, async (req, res) => {
  try {
    const updated = await Project.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, message: 'المشروع غير موجود.' });
    res.json({ success: true, message: 'تم تحديث المشروع بنجاح.', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'تعذر تحديث المشروع.' });
  }
});

router.patch('/admin/projects/:id/toggle', ...adminAuth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'المشروع غير موجود.' });
    project.isActive = !project.isActive;
    await project.save();
    res.json({ success: true, message: 'تم تغيير حالة المشروع.', data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: 'تعذر تغيير حالة المشروع.' });
  }
});

router.delete('/admin/projects/:id', ...adminAuth, async (req, res) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'المشروع غير موجود للحذف.' });
    res.json({ success: true, message: 'تم حذف المشروع بنجاح.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'تعذر حذف المشروع.' });
  }
});

export default router;
