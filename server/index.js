import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import authRoutes from './routes/authRoutes.js';
import unitRoutes from './routes/unitRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import userRoutes from './routes/userRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import modelRoutes from './routes/modelRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import maintenanceRoutes from './routes/maintenanceRoutes.js';

dotenv.config();

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Normalize URL prefix for Vercel Serverless Function & Local proxies
app.use((req, res, next) => {
  if (req.url && !req.url.startsWith('/api') && !req.url.startsWith('/assets') && !req.url.startsWith('/images') && !req.url.startsWith('/brand')) {
    req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
  }
  next();
});

app.use('/api', apiLimiter);

app.use(async (req, res, next) => {
  if (process.env.MONGO_URI) {
    try {
      await connectDB();
    } catch (err) {
      console.error('[DB Middleware] Connection error:', err.message);
    }
  }
  next();
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'muyassar-backend',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api', (req, res) => {
  res.json({
    message: 'منصة ميسر للتطوير العقاري — واجهة برمجة التطبيقات الرسمية',
    version: '1.0.0',
  });
});

// Mounted Application Routes
app.use('/api/auth', authRoutes);
app.use('/api', unitRoutes);
app.use('/api', leadRoutes);
app.use('/api', settingsRoutes);
app.use('/api', modelRoutes);
app.use('/api', projectRoutes);
app.use('/api', maintenanceRoutes);
app.use('/api/admin/users', userRoutes);

app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'المسار المطلوب غير موجود.',
  });
});

app.use((err, req, res, next) => {
  console.error('[Server Error]', err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'حدث خطأ غير متوقع في الخادم.',
  });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[Server] Muyassar Backend running on port ${PORT}`);
  });
}

export default app;