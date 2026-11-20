import { Router } from 'express';
import mongoose from 'mongoose';
import { Lead } from '../models/Lead.js';
import { Unit } from '../models/Unit.js';
import { User } from '../models/User.js';
import { verifyToken, requireRole } from '../middleware/auth.js';
import { leadSubmissionLimiter } from '../middleware/rateLimiter.js';
import { sendLeadNotifications } from '../services/whatsappService.js';

const router = Router();
const saudiPhoneRegex = /^05[0-9]{8}$/;

const getNextSalesAgent = async () => {
  try {
    const user = await User.findOne({ role: 'sales', isActive: true }).sort({ lastAssignedAt: 1, createdAt: 1 });
    if (user) {
      user.lastAssignedAt = new Date();
      await user.save();
      return user;
    }
  } catch (err) {
    console.warn('[Round-Robin Error]', err.message);
  }
  return null;
};

// POST /api/leads (Public Lead Capture with Round-Robin)
router.post('/leads', leadSubmissionLimiter, async (req, res) => {
  try {
    const { fullName, phone, unitCode, requestType, visitDate, visitTime, paymentMethod, notes } = req.body;
    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 3) {
      return res.status(400).json({ success: false, message: 'يرجى إدخال الاسم الثلاثي الكريم (3 أحرف على الأقل).' });
    }
    const cleanPhone = String(phone || '').trim().replace(/[\s-]/g, '');
    if (!saudiPhoneRegex.test(cleanPhone)) {
      return res.status(400).json({ success: false, message: 'رقم الجوال يجب أن يبدأ بـ 05 ويتكون من 10 أرقام.' });
    }

    const assignedUser = await getNextSalesAgent();
    const lead = new Lead({
      fullName: fullName.trim(),
      phone: cleanPhone,
      unitCode: unitCode ? unitCode.toUpperCase().trim() : null,
      requestType: ['booking', 'inspection', 'waitlist'].includes(requestType) ? requestType : 'inspection',
      visitDate: visitDate ? String(visitDate).trim() : null,
      visitTime: visitTime ? String(visitTime).trim() : null,
      paymentMethod: paymentMethod ? String(paymentMethod).trim() : 'تمويل بنكي مدعوم / مرابحة عقارية',
      notes: notes ? String(notes).trim().slice(0, 1000) : '',
      stage: 'prospective',
      assignedAgent: assignedUser ? assignedUser._id : null,
      assignedAgentName: assignedUser ? assignedUser.name : null,
    });

    await lead.save();
    let unit = lead.unitCode ? await Unit.findOne({ unitCode: lead.unitCode }) : null;
    sendLeadNotifications(lead, unit, assignedUser?.phone).catch(() => {});

    res.status(201).json({ success: true, message: 'تم تسجيل طلبك بنجاح، وسيتم التواصل معك لتأكيد الموعد.', data: lead });
  } catch (error) {
    console.error('[Create Lead Error]', error);
    res.status(500).json({ success: false, message: 'فشل تسجيل الطلب، يرجى المحاولة لاحقاً.' });
  }
});

// POST /api/admin/leads (Staff Walk-in / Phone Call Lead Entry)
router.post('/admin/leads', verifyToken, requireRole(['super_admin', 'admin', 'receptionist', 'sales']), async (req, res) => {
  try {
    const { fullName, phone, unitCode, stage, notes } = req.body;
    if (!fullName || !phone) {
      return res.status(400).json({ success: false, message: 'الاسم ورقم الجوال مطلوبان.' });
    }
    const cleanPhone = String(phone).trim().replace(/[\s-]/g, '');
    if (!saudiPhoneRegex.test(cleanPhone)) {
      return res.status(400).json({ success: false, message: 'رقم الجوال يجب أن يبدأ بـ 05 ويتكون من 10 أرقام.' });
    }

    const assignedUser = req.user.role === 'sales'
      ? { _id: req.user.id, name: req.user.name, phone: req.user.phone }
      : await getNextSalesAgent();

    const leadStage = ['prospective', 'reserved', 'closed'].includes(stage) ? stage : 'prospective';
    const cleanUnit = unitCode ? unitCode.toUpperCase().trim() : null;

    const lead = new Lead({
      fullName: fullName.trim(),
      phone: cleanPhone,
      unitCode: cleanUnit,
      requestType: 'inspection',
      stage: leadStage,
      notes: notes ? String(notes).trim().slice(0, 1000) : 'تسجيل زيارة مكتبية / اتصال مباشر',
      assignedAgent: assignedUser ? assignedUser._id : null,
      assignedAgentName: assignedUser ? assignedUser.name : null,
    });

    await lead.save();

    if (cleanUnit) {
      if (leadStage === 'reserved') await Unit.updateOne({ unitCode: cleanUnit }, { $set: { status: 'reserved' } });
      if (leadStage === 'closed') await Unit.updateOne({ cleanUnit }, { $set: { status: 'sold' } });
    }

    res.status(201).json({ success: true, message: 'تم تسجيل العميل بنجاح في خط المبيعات.', data: lead });
  } catch (error) {
    console.error('[Staff Lead Error]', error);
    res.status(500).json({ success: false, message: 'فشل تسجيل العميل.' });
  }
});

// GET /api/admin/leads (Protected: super_admin, admin, receptionist, sales)
router.get('/admin/leads', verifyToken, requireRole(['super_admin', 'admin', 'receptionist', 'sales']), async (req, res) => {
  try {
    const { stage, unitCode, search } = req.query;
    const filter = {};

    if (req.user.role === 'sales') filter.assignedAgent = req.user.id;
    if (stage && ['prospective', 'reserved', 'closed'].includes(stage)) filter.stage = stage;
    if (unitCode) filter.unitCode = unitCode.toUpperCase().trim();
    if (search) {
      const q = String(search).trim();
      filter.$or = [{ fullName: { $regex: q, $options: 'i' } }, { phone: { $regex: q, $options: 'i' } }, { ticketNumber: { $regex: q, $options: 'i' } }];
    }

    const matchStage = req.user.role === 'sales' ? [{ $match: { assignedAgent: new mongoose.Types.ObjectId(req.user.id) } }] : [];
    const [leads, counts] = await Promise.all([
      Lead.find(filter).sort({ createdAt: -1 }).populate('assignedAgent', 'name email phone'),
      Lead.aggregate([...matchStage, { $group: { _id: '$stage', count: { $sum: 1 } } }]),
    ]);

    const summary = { prospective: 0, reserved: 0, closed: 0, total: 0 };
    counts.forEach((c) => {
      if (summary[c._id] !== undefined) summary[c._id] = c.count;
      summary.total += c.count;
    });

    res.json({ success: true, summary, count: leads.length, data: leads });
  } catch (error) {
    console.error('[Admin Leads Error]', error);
    res.status(500).json({ success: false, message: 'فشل استرجاع سجل الطلبات.' });
  }
});

// PATCH /api/admin/leads/:id (Protected: super_admin, admin, receptionist, sales)
router.patch('/admin/leads/:id', verifyToken, requireRole(['super_admin', 'admin', 'receptionist', 'sales']), async (req, res) => {
  try {
    const { stage, assignedAgent, notes } = req.body;
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'طلب العميل غير موجود.' });

    if (req.user.role === 'sales' && String(lead.assignedAgent) !== req.user.id) {
      return res.status(403).json({ success: false, message: 'غير مصرح بتعديل طلب غير مسند إليك.' });
    }

    if (stage && ['prospective', 'reserved', 'closed'].includes(stage)) {
      lead.stage = stage;
      if (lead.unitCode) {
        if (stage === 'reserved') await Unit.updateOne({ unitCode: lead.unitCode }, { $set: { status: 'reserved' } });
        else if (stage === 'closed') await Unit.updateOne({ unitCode: lead.unitCode }, { $set: { status: 'sold' } });
        else if (stage === 'prospective') {
          const other = await Lead.findOne({ _id: { $ne: lead._id }, unitCode: lead.unitCode, stage: 'reserved' });
          if (!other) await Unit.updateOne({ unitCode: lead.unitCode }, { $set: { status: 'available' } });
        }
      }
    }

    // Reassign agent (Admin / Super Admin only)
    if (assignedAgent !== undefined && ['super_admin', 'admin'].includes(req.user.role)) {
      if (assignedAgent) {
        const agent = await User.findById(assignedAgent);
        if (agent) { lead.assignedAgent = agent._id; lead.assignedAgentName = agent.name; }
      } else { lead.assignedAgent = null; lead.assignedAgentName = null; }
    }

    if (typeof notes === 'string') lead.notes = notes.trim().slice(0, 1000);
    await lead.save();

    res.json({ success: true, message: 'تم تحديث بيانات الطلب بنجاح.', data: lead });
  } catch (error) {
    console.error('[Admin Lead Update Error]', error);
    res.status(500).json({ success: false, message: 'فشل تحديث بيانات الطلب.' });
  }
});

export default router;
