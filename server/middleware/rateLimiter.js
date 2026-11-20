import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'تم تجاوز الحد المسموح به من الطلبات، يرجى المحاولة بعد قليل.',
  },
});

export const leadSubmissionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 requests per IP per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'تم تجاوز الحد الأقصى لتسجيل الطلبات من هذا العنوان، يرجى المحاولة لاحقاً.',
  },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 login attempts per 15 mins
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'تم تجاوز محاولات تسجيل الدخول المسموح بها، يرجى الانتظار 15 دقيقة.',
  },
});
