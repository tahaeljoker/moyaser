import jwt from 'jsonwebtoken';

export function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'غير مصرح بالوصول: رمز المصادقة مفقود أو غير صالح.',
    });
  }

  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.error('[Auth Error] JWT_SECRET is not configured');
    return res.status(500).json({
      success: false,
      message: 'خطأ في إعدادات الخادم الأمنية.',
    });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'انتهت صلاحية الجلسة أو الرمز غير صالح.',
    });
  }
}

export function requireRole(allowedRoles) {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'مطلوب تسجيل الدخول.' });
    }
    // super_admin has unrestricted access to all system endpoints
    if (req.user.role === 'super_admin' || roles.includes(req.user.role)) {
      return next();
    }
    return res.status(403).json({
      success: false,
      message: 'ليس لديك الصلاحية الكافية لتنفيذ هذا الإجراء.',
    });
  };
}
