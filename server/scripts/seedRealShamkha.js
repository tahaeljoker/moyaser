import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { Unit } from '../models/Unit.js';
import { PropertyModel } from '../models/PropertyModel.js';
import { SiteSettings } from '../models/SiteSettings.js';
import { Lead } from '../models/Lead.js';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/muyassar';

const shamkhaModels = [
  {
    code: 'A',
    name: 'الدوبلكس الأرضي الرحب',
    type: 'townhouse',
    area: '250.75 + 177 م²',
    bedrooms: 3,
    bathrooms: 5,
    floors: 'دور أرضي + دور أول + حوش 177 م²',
    startingPrice: 0,
    description: 'دوبلكس أرضي مستقل مع حوش وارتداد خاص 177 م² وكراج مستقل ومدخل خاص.',
    features: ['حوش وارتداد خاص 177 م²', 'مجلس رجال مستقل', '3 أجنحة نوم ماستر', 'كراج خاص'],
    renderImageUrl: '/images/shamkha/hero-exterior.webp',
    floorPlanImageUrl: '/images/shamkha/plan-a-1.webp',
    isActive: true,
  },
  {
    code: 'B',
    name: 'الدوبلكس العلوي مع السطح',
    type: 'townhouse',
    area: '310 م²',
    bedrooms: 3,
    bathrooms: 4,
    floors: 'دور علوي + ملحق روف + جلسة سطح',
    startingPrice: 0,
    description: 'دوبلكس علوي فاخر بإطلالة مفتوحة وجلسة سطح خاصة وتوزيع ذكي للمساحات.',
    features: ['تراس سطح خاص', 'صالة عائلية علوية', 'تأسيس مصعد', 'موقف مظلل'],
    renderImageUrl: '/images/shamkha/hero-exterior.webp',
    floorPlanImageUrl: '/images/shamkha/plan-b-1.webp',
    isActive: true,
  },
  {
    code: 'C',
    name: 'الدوبلكس الوسطي الذكي',
    type: 'townhouse',
    area: '265 م²',
    bedrooms: 3,
    bathrooms: 4,
    floors: 'دورين متصلين + سطح مهيأ',
    startingPrice: 0,
    description: 'أناقة معمارية واستغلال هندسي ذكي مع فناء إضاءة سماوية.',
    features: ['فناء إضاءة سماوية Sky Light', 'مطبخ مفتوح', 'كفاءة في استهلاك الطاقة'],
    renderImageUrl: '/images/shamkha/hero-exterior.webp',
    floorPlanImageUrl: '/images/shamkha/plan-c-1.webp',
    isActive: true,
  },
  {
    code: 'D',
    name: 'تاون هاوس الزاوية',
    type: 'townhouse',
    area: '340 م²',
    bedrooms: 4,
    bathrooms: 6,
    floors: 'أرضي + أول + ملحق روف + حديقة جانبية',
    startingPrice: 0,
    description: 'واجهتان معماريتان وإضاءة طبيعية وافرة مع كراج لسيارتين وحديقة جانبية.',
    features: ['موقع زاوية', 'حديقة جانبية', 'كراج لسيارتين', '4 أجنحة ماستر'],
    renderImageUrl: '/images/shamkha/hero-exterior.webp',
    floorPlanImageUrl: '/images/shamkha/plan-d-1.webp',
    isActive: true,
  },
  {
    code: 'E',
    name: 'الدوبلكس المدمج',
    type: 'townhouse',
    area: '227 م²',
    bedrooms: 3,
    bathrooms: 3,
    floors: 'دورين متصلين + سطح خاص',
    startingPrice: 0,
    description: 'حلول سكنية مدروسة للعائلات الحديثة بأعلى قيمة استثمارية.',
    features: ['أعلى قيمة مقابل السعر', 'تكلفة تشغيل منخفضة', 'نوافذ ممتدة'],
    renderImageUrl: '/images/shamkha/hero-exterior.webp',
    floorPlanImageUrl: '/images/shamkha/plan-e-1.webp',
    isActive: true,
  },
  {
    code: 'F',
    name: 'الدوبلكس العلوي مع روف وحوش',
    type: 'townhouse',
    area: '247 + 179 م²',
    bedrooms: 3,
    bathrooms: 5,
    floors: '3 أدوار (أول + ثانٍ + روف وحوش 179 م²)',
    startingPrice: 0,
    description: 'دوبلكس علوي مستقل مع روف وحوش 179 م² ممتد على 3 أدوار باستقلالية تامة.',
    features: ['مسطح 247 م² + حوش 179 م²', '3 أدوار مستقلة', 'تراس روف علوي', 'تأسيس مصعد'],
    renderImageUrl: '/images/shamkha/hero-exterior.webp',
    floorPlanImageUrl: '/images/shamkha/plan-f-1.webp',
    isActive: true,
  },
];

const shamkhaUnits = Array.from({ length: 24 }, (_, i) => {
  const num = i + 1;
  const modelCode = num <= 4 ? 'A' : num <= 8 ? 'B' : num <= 12 ? 'C' : num <= 16 ? 'D' : num <= 20 ? 'E' : 'F';
  const model = shamkhaModels.find((m) => m.code === modelCode);
  return {
    unitCode: `U-${String(num).padStart(2, '0')}`,
    model: modelCode,
    type: 'townhouse',
    area: model.area,
    price: 0,
    status: 'available',
    floor: num <= 12 ? 'أرضي' : 'علوي',
    facade: num % 2 === 0 ? 'شمالية' : 'جنوبية',
    media: {
      images: ['/images/shamkha/hero-exterior.webp'],
      videoUrl: '',
      tour3dUrl: '',
    },
  };
});

async function seed() {
  console.log('[Seed Real Shamkha] Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI);
  console.log('[Seed Real Shamkha] Connected.');

  // 1. Clear ONLY demo units and demo models
  console.log('[Seed Real Shamkha] Clearing units and models...');
  await Unit.deleteMany({});
  await PropertyModel.deleteMany({});
  await Lead.deleteMany({ notes: /تجريبي|demo/i });

  // 2. Insert Models
  console.log('[Seed Real Shamkha] Seeding 6 Official Models (A to F)...');
  await PropertyModel.insertMany(shamkhaModels);

  // 3. Insert Units
  console.log('[Seed Real Shamkha] Seeding 24 Official Units...');
  await Unit.insertMany(shamkhaUnits);

  // 4. Update Site Settings
  console.log('[Seed Real Shamkha] Updating Site Settings...');
  const settingsData = {
    projectName: 'تاون هاوس الشامخة — الدمام',
    city: 'الدمام — حي حديقة الأثير',
    heroTitle: 'تاون هاوس الشامخة',
    heroSubtitle: 'عنوان الاستقرار والرفاهية العائلية بالدمام',
    regaLicense: '1200028491',
    falLicense: '1100248950',
    whatsappNumber: '966500550223',
    phoneNumber: '+966 50 055 0223',
    mapUrl: 'https://maps.google.com/?q=Dammam+Al+Atheer+Park',
    heroImageUrl: '/images/shamkha/hero-exterior.webp',
    socialLinks: {
      tiktok: 'https://www.tiktok.com/@muyassr.re',
      snapchat: 'https://www.snapchat.com/add/muyassr.re',
      instagram: 'https://www.instagram.com/muyassr.re',
      x: 'https://x.com/muyassr_re',
      email: 'info@muyassar-re.com',
    },
    galleryImages: [
      { url: '/images/shamkha/interior-1.webp', title: 'مجلس الضيوف الفاخر', category: 'interior' },
      { url: '/images/shamkha/interior-2.webp', title: 'صالة الاستقبال والمعيشة', category: 'interior' },
      { url: '/images/shamkha/interior-3.webp', title: 'جناح الماستر الرئيسي', category: 'interior' },
      { url: '/images/shamkha/interior-4.webp', title: 'المطبخ وتوزيع المساحات', category: 'interior' },
      { url: '/images/shamkha/interior-5.webp', title: 'الإطلالات وجلسة السطح', category: 'interior' },
      { url: '/images/shamkha/masterplan.webp', title: 'المخطط العام للـ 24 وحدة', category: 'masterplan' },
    ],
    visibleSections: {
      gallery: true, models: true, unitMatrix: true, location: true,
      specs: true, guarantees: true, afterSales: true, partners: true,
    },
    isDemoPurged: true,
  };

  const existingSettings = await SiteSettings.findOne();
  if (existingSettings) {
    await SiteSettings.updateOne({ _id: existingSettings._id }, { $set: settingsData });
  } else {
    await SiteSettings.create(settingsData);
  }

  console.log('[Seed Real Shamkha] Finished successfully!');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('[Seed Real Shamkha Error]', err);
  process.exit(1);
});
