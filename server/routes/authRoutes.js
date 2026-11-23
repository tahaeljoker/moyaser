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
    let user = null;
    try {
      user = await User.findOne({ email: cleanEmail });
    } catch (dbErr) {
      console.warn('[Auth] DB lookup warning:', dbErr.message);
    }

    // Direct fallback for main admin credentials if DB is connecting or waking up
    const fallbackAdminEmail = (process.env.ADMIN_EMAIL || 'admin@muyassar-ra.com').toLowerCase().trim();
    const fallbackAdminPass = process.env.ADMIN_PASSWORD || 'Muyassar@2025';

    if (!user) {
      if (cleanEmail === fallbackAdminEmail && String(password) === fallbackAdminPass) {
        user = {
          _id: 'admin-super-id',
          name: 'المدير العام',
          email: fallbackAdminEmail,
          role: 'admin',
        };
      } else {
        return res.status(401).json({ success: false, message: 'بيانات الدخول غير صحيحة.' });
      }
    } else {
      const isMatch = await user.comparePassword(String(password));
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'بيانات الدخول غير صحيحة.' });
      }
    }

    const secret = process.env.JWT_SECRET || 'muyassar_super_secure_jwt_secret_key_2025';

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
    let user = null;
    try {
      user = await User.findById(req.user.id).select('-passwordHash');
    } catch {}

    if (!user) {
      if (req.user && (req.user.role === 'admin' || req.user.id === 'admin-super-id')) {
        return res.json({
          success: true,
          user: {
            id: req.user.id,
            name: req.user.name || 'المدير العام',
            email: req.user.email,
            role: req.user.role || 'admin',
          },
        });
      }
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
