import { Router } from 'express';
import mongoose from 'mongoose';
import { Lead } from '../models/Lead.js';
import { Unit } from '../models/Unit.js';
import { User } from '../models/User.js';
import { verifyToken, requireRole } from '../middleware/auth.js';
import { leadSubmissionLimiter } from '../middleware/rateLimiter.js';
import { sendLeadNotifications } from '../services/whatsappService.js';

const router = Router();
const intlPhoneRegex = /^\+?[1-9]\d{7,14}$/;

const getNextSalesAgent = async () => {
  try {
    const user = await User.findOne({ role: 'sales', isActive: true }).sort({ lastAssignedAt: 1, createdAt: 1 });
    if (user) { user.lastAssignedAt = new Date(); await user.save(); return user; }
  } catch (err) { console.warn('[Round-Robin Error]', err.message); }
  return null;
};

// POST /api/leads (Public Lead Capture with Duplicate Detection)
router.post('/leads', leadSubmissionLimiter, async (req, res) => {
  try {
    const { fullName, phone, unitCode, requestType, visitDate, visitTime, preferredTime, paymentMethod, notes, source } = req.body;
    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 3) {
      return res.status(400).json({ success: false, message: 'يرجى إدخال الاسم الثلاثي الكريم (3 أحرف على الأقل).' });
    }
    const cleanPhone = String(phone || '').trim().replace(/[\s\-()]/g, '');
    if (!intlPhoneRegex.test(cleanPhone)) {
      return res.status(400).json({ success: false, message: 'رقم الجوال يجب أن يكون رقماً دولياً صالحاً من 8 إلى 15 رقماً.' });
    }

    const cleanUnit = unitCode ? unitCode.toUpperCase().trim() : null;
    const existingLead = await Lead.findOne({ phone: cleanPhone, stage: { $ne: 'cancelled' } }).sort({ createdAt: -1 });
    if (existingLead) {
      const noteMsg = `طلب استفسار إضافي عبر الموقع${cleanUnit ? ` للوحدة ${cleanUnit}` : ''}${notes ? `: ${notes}` : ''}`;
      existingLead.activityLog.push({ note: noteMsg, authorName: 'النظام الآلي', authorRole: 'system', createdAt: new Date() });
      await existingLead.save();
      return res.status(200).json({
        success: true,
        isDuplicate: true,
        message: `لديك طلب سابق مسجل برقم (${existingLead.ticketNumber})${existingLead.assignedAgentName ? ` مع المستشار ${existingLead.assignedAgentName}` : ''}. تم تسجيل استفسارك الجديد بسجل المتابعة وسيتم التواصل معك قريباً.`,
        data: existingLead,
      });
    }

    const assignedUser = await getNextSalesAgent();
    const lead = new Lead({
      fullName: fullName.trim(), phone: cleanPhone, unitCode: cleanUnit,
      requestType: ['booking', 'inspection', 'waitlist'].includes(requestType) ? requestType : 'inspection',
      source: ['website', 'walk_in', 'phone', 'whatsapp'].includes(source) ? source : 'website',
      visitDate: visitDate ? String(visitDate).trim() : null,
      visitTime: visitTime ? String(visitTime).trim() : null,
      preferredTime: preferredTime ? String(preferredTime).trim() : null,
      paymentMethod: paymentMethod ? String(paymentMethod).trim() : 'تمويل بنكي مدعوم / مرابحة عقارية',
      notes: notes ? String(notes).trim().slice(0, 1000) : '', stage: 'prospective',
      assignedAgent: assignedUser ? assignedUser._id : null, assignedAgentName: assignedUser ? assignedUser.name : null,
    });

    await lead.save();
    let unit = lead.unitCode ? await Unit.findOne({ unitCode: lead.unitCode }) : null;
    sendLeadNotifications(lead, unit, assignedUser?.phone).catch(() => {});
    res.status(201).json({ success: true, message: 'تم تسجيل طلبك بنجاح.', data: lead });
  } catch (error) {
    console.error('[Create Lead Error]', error);
    res.status(500).json({ success: false, message: 'فشل تسجيل الطلب.' });
  }
});

// POST /api/admin/leads (Staff Entry with Duplicate Check)
router.post('/admin/leads', verifyToken, requireRole(['super_admin', 'admin', 'receptionist', 'sales']), async (req, res) => {
  try {
    const { fullName, phone, unitCode, stage, notes, source, nextFollowUpDate, preferredTime } = req.body;
    if (!fullName || !phone) return res.status(400).json({ success: false, message: 'الاسم ورقم الجوال مطلوبان.' });
    const cleanPhone = String(phone).trim().replace(/[\s\-()]/g, '');
    if (!intlPhoneRegex.test(cleanPhone)) return res.status(400).json({ success: false, message: 'رقم الجوال غير صحيح.' });

    const cleanUnit = unitCode ? unitCode.toUpperCase().trim() : null;
    const existingLead = await Lead.findOne({ phone: cleanPhone, stage: { $ne: 'cancelled' } }).sort({ createdAt: -1 });
    if (existingLead) {
      const noteMsg = `تسجيل زيارة/اتصال إضافي بواسطة ${req.user.name || 'الموظف'}${cleanUnit ? ` للوحدة ${cleanUnit}` : ''}${notes ? `: ${notes}` : ''}`;
      existingLead.activityLog.push({ note: noteMsg, authorName: req.user.name || 'موظف', authorRole: req.user.role || 'staff', createdAt: new Date() });
      await existingLead.save();
      return res.status(200).json({
        success: true,
        isDuplicate: true,
        message: `العميل مسجل مسبقاً برقم تذكرة (${existingLead.ticketNumber}). تمت إضافة الملاحظة لملف العميل القائم.`,
        data: existingLead,
      });
    }

    const assignedUser = req.user.role === 'sales' ? { _id: req.user.id, name: req.user.name, phone: req.user.phone } : await getNextSalesAgent();
    const leadStage = ['prospective', 'reserved', 'closed', 'cancelled'].includes(stage) ? stage : 'prospective';

    const lead = new Lead({
      fullName: fullName.trim(), phone: cleanPhone, unitCode: cleanUnit, requestType: 'inspection',
      source: ['website', 'walk_in', 'phone', 'whatsapp'].includes(source) ? source : 'walk_in',
      stage: leadStage, notes: notes ? String(notes).trim().slice(0, 1000) : 'تسجيل زيارة مكتبية / اتصال مباشر',
      preferredTime: preferredTime ? String(preferredTime).trim() : null,
      nextFollowUpDate: nextFollowUpDate ? new Date(nextFollowUpDate) : null,
      reservationExpiresAt: leadStage === 'reserved' ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : null,
      assignedAgent: assignedUser ? assignedUser._id : null, assignedAgentName: assignedUser ? assignedUser.name : null,
    });

    await lead.save();
    if (cleanUnit) {
      if (leadStage === 'reserved') await Unit.updateOne({ unitCode: cleanUnit }, { $set: { status: 'reserved' } });
      if (leadStage === 'closed') await Unit.updateOne({ unitCode: cleanUnit }, { $set: { status: 'sold' } });
    }
    res.status(201).json({ success: true, message: 'تم تسجيل العميل بنجاح.', data: lead });
  } catch (error) {
    console.error('[Staff Lead Error]', error);
    res.status(500).json({ success: false, message: 'فشل تسجيل العميل.' });
  }
});

// GET /api/admin/leads (Protected)
router.get('/admin/leads', verifyToken, requireRole(['super_admin', 'admin', 'receptionist', 'sales']), async (req, res) => {
  try {
    const { stage, unitCode, search } = req.query;
    const filter = {};
    if (req.user.role === 'sales') filter.assignedAgent = req.user.id;
    if (stage && ['prospective', 'reserved', 'closed', 'cancelled'].includes(stage)) filter.stage = stage;
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

    const summary = { prospective: 0, reserved: 0, closed: 0, cancelled: 0, total: 0 };
    counts.forEach((c) => { if (summary[c._id] !== undefined) summary[c._id] = c.count; summary.total += c.count; });
    res.json({ success: true, summary, count: leads.length, data: leads });
  } catch (error) {
    console.error('[Admin Leads Error]', error);
    res.status(500).json({ success: false, message: 'فشل استرجاع سجل الطلبات.' });
  }
});

// PATCH /api/admin/leads/:id (Protected)
router.patch('/admin/leads/:id', verifyToken, requireRole(['super_admin', 'admin', 'receptionist', 'sales']), async (req, res) => {
  try {
    const { stage, cancellationReason, reservationExpiresAt, assignedAgent, notes, source, nextFollowUpDate, preferredTime, financing, handover } = req.body;
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'طلب العميل غير موجود.' });

    if (req.user.role === 'sales' && String(lead.assignedAgent) !== req.user.id) {
      return res.status(403).json({ success: false, message: 'غير مصرح بتعديل طلب غير مسند إليك.' });
    }

    if (stage && ['prospective', 'reserved', 'closed', 'cancelled'].includes(stage)) {
      const prevStage = lead.stage;
      lead.stage = stage;
      if (stage === 'reserved' && !lead.reservationExpiresAt) {
        lead.reservationExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      }
      if (lead.unitCode) {
        if (stage === 'reserved') await Unit.updateOne({ unitCode: lead.unitCode }, { $set: { status: 'reserved' } });
        else if (stage === 'closed') await Unit.updateOne({ unitCode: lead.unitCode }, { $set: { status: 'sold' } });
        else if (['prospective', 'cancelled'].includes(stage) && ['reserved', 'closed'].includes(prevStage)) {
          const other = await Lead.findOne({ _id: { $ne: lead._id }, unitCode: lead.unitCode, stage: 'reserved' });
          if (!other) await Unit.updateOne({ unitCode: lead.unitCode }, { $set: { status: 'available' } });
        }
      }
    }

    if (cancellationReason !== undefined) {
      lead.cancellationReason = ['السعر', 'رفض البنك', 'الموقع', 'لا يرد', 'أخرى'].includes(cancellationReason) ? cancellationReason : null;
    }
    if (reservationExpiresAt !== undefined) {
      lead.reservationExpiresAt = reservationExpiresAt ? new Date(reservationExpiresAt) : null;
    }
    if (source && ['website', 'walk_in', 'phone', 'whatsapp'].includes(source)) lead.source = source;
    if (preferredTime !== undefined) lead.preferredTime = preferredTime ? String(preferredTime).trim() : null;
    if (nextFollowUpDate !== undefined) lead.nextFollowUpDate = nextFollowUpDate ? new Date(nextFollowUpDate) : null;
    if (financing && typeof financing === 'object') {
      lead.financing = {
        bankName: financing.bankName !== undefined ? String(financing.bankName).trim() : (lead.financing?.bankName || ''),
        depositPaid: financing.depositPaid !== undefined ? Boolean(financing.depositPaid) : (lead.financing?.depositPaid || false),
        depositAmount: financing.depositAmount !== undefined ? Number(financing.depositAmount) || 0 : (lead.financing?.depositAmount || 0),
        expectedDeedDate: financing.expectedDeedDate ? new Date(financing.expectedDeedDate) : (financing.expectedDeedDate === null ? null : (lead.financing?.expectedDeedDate || null)),
      };
    }
    if (handover && typeof handover === 'object') {
      lead.handover = {
        status: ['pending_deed', 'preparing_unit', 'delivered'].includes(handover.status) ? handover.status : (lead.handover?.status || 'pending_deed'),
        finalPrice: handover.finalPrice !== undefined ? Number(handover.finalPrice) || 0 : (lead.handover?.finalPrice || 0),
        deliveredAt: handover.deliveredAt ? new Date(handover.deliveredAt) : (handover.deliveredAt === null ? null : (lead.handover?.deliveredAt || null)),
      };
    }
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

// POST /api/admin/leads/:id/activities (Append Timestamped Follow-up Note)
router.post('/admin/leads/:id/activities', verifyToken, requireRole(['super_admin', 'admin', 'receptionist', 'sales']), async (req, res) => {
  try {
    const { note, nextFollowUpDate } = req.body;
    if (!note || typeof note !== 'string' || note.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'يرجى كتابة نص الملاحظة (حرفين على الأقل).' });
    }
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'طلب العميل غير موجود.' });
    if (req.user.role === 'sales' && String(lead.assignedAgent) !== req.user.id) {
      return res.status(403).json({ success: false, message: 'غير مصرح بإضافة متابعة لطلب غير مسند إليك.' });
    }

    lead.activityLog.push({
      note: note.trim(), authorName: req.user.name || 'موظف مُيسّر',
      authorRole: req.user.role || 'staff', createdAt: new Date(),
    });
    if (nextFollowUpDate !== undefined) lead.nextFollowUpDate = nextFollowUpDate ? new Date(nextFollowUpDate) : null;

    await lead.save();
    res.status(201).json({ success: true, message: 'تمت إضافة سجل المتابعة بنجاح.', data: lead });
  } catch (error) {
    console.error('[Lead Activity Error]', error);
    res.status(500).json({ success: false, message: 'فشل إضافة سجل المتابعة.' });
  }
});

export default router;
