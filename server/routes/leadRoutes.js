import { Router } from 'express';
import mongoose from 'mongoose';
import { Lead } from '../models/Lead.js';
import { Unit } from '../models/Unit.js';
import { User } from '../models/User.js';
import { Project } from '../models/Project.js';
import { verifyToken, requireRole } from '../middleware/auth.js';
import { leadSubmissionLimiter } from '../middleware/rateLimiter.js';
import { sendLeadNotifications } from '../services/whatsappService.js';
import { syncLeadToGoogleSheet, notifySalesViaWhatsApp } from '../services/leadIntegrations.js';

const router = Router();
const intlPhoneRegex = /^\+?[1-9]\d{7,14}$/;

const getNextSalesAgent = async () => {
  try {
    const user = await User.findOne({ role: 'sales', isActive: true }).sort({ lastAssignedAt: 1, createdAt: 1 });
    if (user) { user.lastAssignedAt = new Date(); await user.save(); return user; }
  } catch (err) { console.warn('[Round-Robin Error]', err.message); }
  return null;
};

// POST /api/leads (Public)
router.post('/leads', leadSubmissionLimiter, async (req, res) => {
  try {
    const { fullName, phone, unitCode, requestType, visitDate, visitTime, preferredTime, paymentMethod, notes, source, projectId, projectName } = req.body;
    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 3) {
      return res.status(400).json({ success: false, message: 'يرجى إدخال الاسم الثلاثي (3 أحرف على الأقل).' });
    }
    const cleanPhone = String(phone || '').trim().replace(/[\s\-()]/g, '');
    if (!intlPhoneRegex.test(cleanPhone)) {
      return res.status(400).json({ success: false, message: 'رقم الجوال يجب أن يكون رقماً صالحاً.' });
    }

    const cleanUnit = unitCode ? unitCode.toUpperCase().trim() : null;
    let resolvedProjectId = projectId || null;
    let resolvedProjectName = projectName || '';
    let unit = cleanUnit ? await Unit.findOne({ unitCode: cleanUnit }) : null;
    if (unit && !resolvedProjectId && unit.projectId) {
      resolvedProjectId = unit.projectId;
      resolvedProjectName = unit.projectName || '';
    }
    if (resolvedProjectId && !resolvedProjectName) {
      const proj = await Project.findById(resolvedProjectId).select('name');
      if (proj) resolvedProjectName = proj.name;
    }

    const existingLead = await Lead.findOne({ phone: cleanPhone, stage: { $ne: 'cancelled' } }).sort({ createdAt: -1 });
    if (existingLead) {
      existingLead.activityLog.push({
        note: `استفسار إضافي${cleanUnit ? ` للوحدة ${cleanUnit}` : ''}${notes ? `: ${notes}` : ''}`,
        authorName: 'النظام الآلي', authorRole: 'system', createdAt: new Date(),
      });
      await existingLead.save();
      return res.status(200).json({
        success: true, isDuplicate: true,
        message: `طلبك مسجل مسبقاً (${existingLead.ticketNumber}). تم تحديث ملفك وسنتواصل معك قريباً.`,
        data: existingLead,
      });
    }

    const assignedUser = await getNextSalesAgent();
    const lead = new Lead({
      fullName: fullName.trim(), phone: cleanPhone, unitCode: cleanUnit,
      projectId: resolvedProjectId, projectName: resolvedProjectName,
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
    const project = resolvedProjectId ? await Project.findById(resolvedProjectId) : null;
    syncLeadToGoogleSheet(lead).catch(() => {});
    notifySalesViaWhatsApp(lead, project).catch(() => {});
    sendLeadNotifications(lead, unit, assignedUser?.phone).catch(() => {});

    res.status(201).json({ success: true, message: 'تم تسجيل طلبك بنجاح.', data: lead });
  } catch (error) {
    res.status(500).json({ success: false, message: 'فشل تسجيل الطلب.' });
  }
});

// POST /api/admin/leads (Staff Entry)
router.post('/admin/leads', verifyToken, requireRole(['super_admin', 'admin', 'receptionist', 'sales']), async (req, res) => {
  try {
    const { fullName, phone, unitCode, stage, notes, source, nextFollowUpDate, preferredTime, projectId, projectName } = req.body;
    if (!fullName || !phone) return res.status(400).json({ success: false, message: 'الاسم ورقم الجوال مطلوبان.' });
    const cleanPhone = String(phone).trim().replace(/[\s\-()]/g, '');
    if (!intlPhoneRegex.test(cleanPhone)) return res.status(400).json({ success: false, message: 'رقم الجوال غير صحيح.' });

    const cleanUnit = unitCode ? unitCode.toUpperCase().trim() : null;
    let resolvedProjectId = projectId || null;
    let resolvedProjectName = projectName || '';
    if (resolvedProjectId && !resolvedProjectName) {
      const proj = await Project.findById(resolvedProjectId).select('name');
      if (proj) resolvedProjectName = proj.name;
    }

    const assignedUser = req.user.role === 'sales' ? { _id: req.user.id, name: req.user.name, phone: req.user.phone } : await getNextSalesAgent();
    const leadStage = ['prospective', 'reserved', 'closed', 'cancelled'].includes(stage) ? stage : 'prospective';

    const lead = new Lead({
      fullName: fullName.trim(), phone: cleanPhone, unitCode: cleanUnit, requestType: 'inspection',
      projectId: resolvedProjectId, projectName: resolvedProjectName,
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
    const project = resolvedProjectId ? await Project.findById(resolvedProjectId) : null;
    syncLeadToGoogleSheet(lead).catch(() => {});
    notifySalesViaWhatsApp(lead, project).catch(() => {});

    res.status(201).json({ success: true, message: 'تم تسجيل العميل بنجاح.', data: lead });
  } catch (error) {
    res.status(500).json({ success: false, message: 'فشل تسجيل العميل.' });
  }
});

// GET /api/admin/leads (Protected)
router.get('/admin/leads', verifyToken, requireRole(['super_admin', 'admin', 'receptionist', 'sales']), async (req, res) => {
  try {
    const { stage, unitCode, search, projectId, slug, projectSlug } = req.query;
    const filter = {};
    if (req.user.role === 'sales') filter.assignedAgent = req.user.id;
    if (stage && ['prospective', 'reserved', 'closed', 'cancelled'].includes(stage)) filter.stage = stage;
    if (unitCode) filter.unitCode = unitCode.toUpperCase().trim();
    if (projectId) filter.projectId = projectId;
    else if (slug || projectSlug) {
      const proj = await Project.findOne({ slug: slug || projectSlug }).select('_id');
      if (proj) filter.projectId = proj._id;
    }
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
    res.status(500).json({ success: false, message: 'فشل استرجاع سجل الطلبات.' });
  }
});

// PATCH /api/admin/leads/:id (Protected)
router.patch('/admin/leads/:id', verifyToken, requireRole(['super_admin', 'admin', 'receptionist', 'sales']), async (req, res) => {
  try {
    const { stage, cancellationReason, reservationExpiresAt, assignedAgent, notes, source, nextFollowUpDate, preferredTime, financing, handover, projectId, projectName } = req.body;
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

    if (cancellationReason !== undefined) lead.cancellationReason = cancellationReason;
    if (reservationExpiresAt !== undefined) lead.reservationExpiresAt = reservationExpiresAt ? new Date(reservationExpiresAt) : null;
    if (source) lead.source = source;
    if (preferredTime !== undefined) lead.preferredTime = preferredTime;
    if (nextFollowUpDate !== undefined) lead.nextFollowUpDate = nextFollowUpDate ? new Date(nextFollowUpDate) : null;
    if (projectId !== undefined) lead.projectId = projectId || null;
    if (projectName !== undefined) lead.projectName = String(projectName).trim();
    if (financing) lead.financing = { ...lead.financing?.toObject(), ...financing };
    if (handover) lead.handover = { ...lead.handover?.toObject(), ...handover };
    if (assignedAgent !== undefined && ['super_admin', 'admin'].includes(req.user.role)) {
      const agent = assignedAgent ? await User.findById(assignedAgent) : null;
      lead.assignedAgent = agent ? agent._id : null;
      lead.assignedAgentName = agent ? agent.name : null;
    }
    if (typeof notes === 'string') lead.notes = notes.trim().slice(0, 1000);

    await lead.save();
    res.json({ success: true, message: 'تم تحديث بيانات الطلب بنجاح.', data: lead });
  } catch (error) {
    res.status(500).json({ success: false, message: 'فشل تحديث بيانات الطلب.' });
  }
});

// POST /api/admin/leads/:id/activities (Protected)
router.post('/admin/leads/:id/activities', verifyToken, requireRole(['super_admin', 'admin', 'receptionist', 'sales']), async (req, res) => {
  try {
    const { note, nextFollowUpDate } = req.body;
    if (!note || typeof note !== 'string' || note.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'يرجى كتابة نص الملاحظة.' });
    }
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'طلب العميل غير موجود.' });
    if (req.user.role === 'sales' && String(lead.assignedAgent) !== req.user.id) {
      return res.status(403).json({ success: false, message: 'غير مصرح بإضافة متابعة لطلب غير مسند إليك.' });
    }

    lead.activityLog.push({ note: note.trim(), authorName: req.user.name || 'موظف ميسر', authorRole: req.user.role || 'staff', createdAt: new Date() });
    if (nextFollowUpDate !== undefined) lead.nextFollowUpDate = nextFollowUpDate ? new Date(nextFollowUpDate) : null;
    await lead.save();
    res.status(201).json({ success: true, message: 'تمت إضافة سجل المتابعة بنجاح.', data: lead });
  } catch (error) {
    res.status(500).json({ success: false, message: 'فشل إضافة سجل المتابعة.' });
  }
});

export default router;
