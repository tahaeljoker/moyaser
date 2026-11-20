import express from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Lead } from '../models/Lead.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();
const ALLOWED_ROLES = ['super_admin', 'admin', 'editor', 'receptionist', 'sales'];

// Require admin or super_admin authentication for all user management routes
router.use(verifyToken, requireRole(['admin']));

// GET /api/admin/users - List all team members with lead counts
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 }).lean();

    const leadCounts = await Lead.aggregate([
      { $match: { assignedAgent: { $ne: null } } },
      { $group: { _id: '$assignedAgent', count: { $sum: 1 } } },
    ]);

    const countMap = {};
    leadCounts.forEach((c) => { countMap[c._id.toString()] = c.count; });

    const populatedUsers = users.map((u) => ({
      ...u,
      id: u._id.toString(),
      assignedLeadsCount: countMap[u._id.toString()] || 0,
    }));

    return res.json({ success: true, count: populatedUsers.length, users: populatedUsers });
  } catch (error) {
    console.error('[User Routes Error] GET /users:', error);
    return res.status(500).json({ success: false, message: 'تعذر جلب قائمة المستخدمين.' });
  }
});

// POST /api/admin/users - Create new team member (super_admin, admin, editor, receptionist, sales)
router.post('/', async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'الاسم، البريد الإلكتروني وكلمة المرور مطلوبة.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'كلمة المرور يجب أن لا تقل عن 6 أحرف.' });
    }

    if (phone && !/^05[0-9]{8}$/.test(phone)) {
      return res.status(400).json({ success: false, message: 'رقم الجوال يجب أن يكون سعودياً صحيحاً يبدأ بـ 05 (10 أرقام).' });
    }

    // Role check: Only super_admin can create another super_admin
    const targetRole = ALLOWED_ROLES.includes(role) ? role : 'sales';
    if (targetRole === 'super_admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({ success: false, message: 'لا يمكن إنشاء حساب مالك نظام إلا بواسطة مالك النظام نفسه.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ success: false, message: 'البريد الإلكتروني مسجل مسبقاً لمستخدم آخر.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone ? phone.trim() : null,
      passwordHash,
      role: targetRole,
      isActive: true,
      lastAssignedAt: null,
    });

    return res.status(201).json({
      success: true,
      message: 'تم إنشاء حساب المستخدم بنجاح.',
      user: {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        isActive: newUser.isActive,
        assignedLeadsCount: 0,
      },
    });
  } catch (error) {
    console.error('[User Routes Error] POST /users:', error);
    return res.status(500).json({ success: false, message: 'حدث خطأ أثناء إنشاء المستخدم.' });
  }
});

// PATCH /api/admin/users/:id - Toggle status or update details
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive, name, phone, role } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'المستخدم غير موجود.' });
    }

    // Admin cannot modify super_admin account
    if (user.role === 'super_admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({ success: false, message: 'لا يمكن لغير مالك النظام تعديل حساب المطور أو مالك النظام.' });
    }

    if (typeof isActive === 'boolean') user.isActive = isActive;
    if (name && typeof name === 'string') user.name = name.trim();
    if (phone !== undefined) {
      if (phone && !/^05[0-9]{8}$/.test(phone)) {
        return res.status(400).json({ success: false, message: 'رقم الجوال يجب أن يبدأ بـ 05 ويتكون من 10 أرقام.' });
      }
      user.phone = phone ? phone.trim() : null;
    }
    if (role && ALLOWED_ROLES.includes(role)) {
      if (role === 'super_admin' && req.user.role !== 'super_admin') {
        return res.status(403).json({ success: false, message: 'لا يمكن ترقية الحساب إلى مالك نظام.' });
      }
      user.role = role;
    }

    await user.save();

    return res.json({
      success: true,
      message: 'تم تحديث بيانات المستخدم بنجاح.',
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error('[User Routes Error] PATCH /users/:id:', error);
    return res.status(500).json({ success: false, message: 'حدث خطأ أثناء تعديل بيانات المستخدم.' });
  }
});

export default router;
