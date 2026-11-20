import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { verifyToken } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// POST /api/auth/login
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'يرجى إدخال البريد الإلكتروني وكلمة المرور.',
      });
    }

    const cleanEmail = String(email).toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'بيانات الدخول غير صحيحة.',
      });
    }

    const isMatch = await user.comparePassword(String(password));
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'بيانات الدخول غير صحيحة.',
      });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({
        success: false,
        message: 'خطأ في إعدادات الخادم الأمنية.',
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      secret,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('[Auth Route Error]', error);
    res.status(500).json({
      success: false,
      message: 'فشل تسجيل الدخول، يرجى المحاولة لاحقاً.',
    });
  }
});

// GET /api/auth/me
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود.',
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'فشل استرجاع بيانات المستخدم.',
    });
  }
});

export default router;
