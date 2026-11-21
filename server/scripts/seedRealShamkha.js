import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { Project } from '../models/Project.js';
import { Unit } from '../models/Unit.js';
import { PropertyModel } from '../models/PropertyModel.js';
import { SiteSettings } from '../models/SiteSettings.js';
import { Lead } from '../models/Lead.js';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/muyassar';

const shamkhaProjectData = {
  name: 'تاون هاوس الشامخة',
  slug: 'shamkha',
  tagline: 'مجتمع سكني فاخر بتصاميم عصرية وضمانات شاملة',
  description: 'مشروع تاون هاوس الشامخة بالدمام يجمع بين الخصوصية التامة والاستقلالية المعمارية في موقع استراتيجي مطل على حديقة الأثير العامة.',
  city: 'الدمام',
  district: 'حي حديقة الأثير',
  status: 'available',
  heroImageUrl: '/images/shamkha/hero-exterior.webp',
  masterplanUrl: '/images/shamkha/masterplan.webp',
  galleryImages: [
    { url: '/images/shamkha/interior-1.webp', title: 'مجلس الضيوف الفاخر', category: 'interior' },
    { url: '/images/shamkha/interior-2.webp', title: 'صالة الاستقبال والمعيشة', category: 'interior' },
    { url: '/images/shamkha/interior-3.webp', title: 'جناح الماستر الرئيسي', category: 'interior' },
    { url: '/images/shamkha/interior-4.webp', title: 'المطبخ وتوزيع المساحات', category: 'interior' },
    { url: '/images/shamkha/interior-5.webp', title: 'الإطلالات وجلسة السطح', category: 'interior' },
    { url: '/images/shamkha/masterplan.webp', title: 'المخطط العام للـ 15 وحدة', category: 'masterplan' },
  ],
  contactPhone: '0500550223',
  whatsappNumber: '966500550223',
  mapUrl: 'https://maps.google.com/?q=Dammam+Al+Atheer+Park',
  regaLicense: '1200028491',
  valLicense: '1100248950',
  landmarks: [
    { label: 'حديقة الأثير العامة', minutes: 2, nearby: 'مباشرة أمام المشروع' },
    { label: 'طريق الملك فهد', minutes: 5, nearby: 'محور رئيسي' },
    { label: 'مطار الملك فهد الدولي', minutes: 20, nearby: 'وصول مباشر' },
    { label: 'مجمع العثيم مول', minutes: 12, nearby: 'وجهة تسوق' },
  ],
  specs: [
    'صك إلكتروني مستقل لكل وحدة سكنية',
    'عدادات مياه وكهرباء مستقلة ومنفصلة',
    'كراج سيارة خاص ومدخل مستقل',
    'تأسيس مصعد بجميع النماذج العلوية',
    'عزل حراري ومائي معتمد من شركة الكهرباء',
  ],
  guarantees: [
    { title: 'الهيكل الإنشائي', duration: '10 سنوات', details: 'شهادة تأمين معتمدة ضد العيوب الخفية' },
    { title: 'القواطع والتمديدات الكهربائية', duration: '25 سنة', details: 'ضمان شركة الفنار المعتمد' },
    { title: 'الأنابيب والتمديدات الصحية', duration: '15 سنة', details: 'ضمان معتمد ضد التسريبات' },
    { title: 'العزل المائي والحراري', duration: '10 سنوات', details: 'ضمان عزل الأسطح ودورات المياه' },
  ],
  afterSales: [
    'خدمة صيانة ومتابعة مخصصة خلال السنة الأولى',
    'إدارة اتحاد الملاك وتسليم كتيب الإرشادات التشغيلية',
    'توثيق رسمي لكافة شهادات الضمان المعتمدة',
  ],
  visibleSections: {
    models: true, unitMatrix: true, gallery: true, location: true,
    specs: true, guarantees: true, afterSales: true,
  },
  isActive: true,
  sortOrder: 1,
};

const rawModels = [
  {
    code: 'A', name: 'الدوبلكس الأرضي الرحب', type: 'townhouse',
    area: '250.75 + 177 (427.75 م²)', bedrooms: 3, bathrooms: 5,
    floors: 'دور أرضي + دور أول + حوش 177 م²', startingPrice: 0,
    description: 'دوبلكس أرضي مستقل مع حوش وارتداد خاص 177 م² وكراج مستقل ومدخل خاص.',
    features: ['حوش وارتداد خاص 177 م²', 'مجلس رجال مستقل', '3 أجنحة نوم ماستر', 'كراج خاص'],
    renderImageUrl: '/images/shamkha/render-a.webp', floorPlanImageUrl: '/images/shamkha/plan-a-1.webp', isActive: true,
  },
  {
    code: 'B', name: 'الدوبلكس العلوي مع السطح', type: 'townhouse',
    area: '233 + 69 (302 م²)', bedrooms: 3, bathrooms: 4,
    floors: 'دور علوي + ملحق روف + جلسة سطح 69 م²', startingPrice: 0,
    description: 'دوبلكس علوي فاخر بإطلالة مفتوحة وجلسة سطح خاصة 69 م² وتوزيع ذكي للمساحات.',
    features: ['تراس سطح خاص 69 م²', 'صالة عائلية علوية', 'تأسيس مصعد', 'موقف مظلل'],
    renderImageUrl: '/images/shamkha/render-b.webp', floorPlanImageUrl: '/images/shamkha/plan-b-1.webp', isActive: true,
  },
  {
    code: 'C', name: 'الدوبلكس الوسطي الذكي', type: 'townhouse',
    area: '239 + 134 (373 م²)', bedrooms: 3, bathrooms: 4,
    floors: 'دورين متصلين + حوش 134 م²', startingPrice: 0,
    description: 'أناقة معمارية واستغلال هندسي ذكي مع فناء إضاءة سماوية وحوش 134 م².',
    features: ['حوش خاص 134 م²', 'فناء إضاءة سماوية Sky Light', 'مطبخ مفتوح', 'كفاءة في استهلاك الطاقة'],
    renderImageUrl: '/images/shamkha/render-c.webp', floorPlanImageUrl: '/images/shamkha/plan-c-1.webp', isActive: true,
  },
  {
    code: 'D', name: 'تاون هاوس الزاوية', type: 'townhouse',
    area: '227 + 80 (307 م²)', bedrooms: 4, bathrooms: 6,
    floors: 'أرضي + أول + ملحق روف + حديقة جانبية 80 م²', startingPrice: 0,
    description: 'واجهتان معماريتان وإضاءة طبيعية وافرة مع كراج لسيارتين وحديقة جانبية 80 م².',
    features: ['موقع زاوية', 'حديقة جانبية 80 م²', 'كراج لسيارتين', '4 أجنحة ماستر'],
    renderImageUrl: '/images/shamkha/render-d.webp', floorPlanImageUrl: '/images/shamkha/plan-d-1.webp', isActive: true,
  },
  {
    code: 'E', name: 'الدوبلكس المدمج', type: 'townhouse',
    area: '247 + 161 (408 م²)', bedrooms: 3, bathrooms: 3,
    floors: 'دورين متصلين + حوش 161 م²', startingPrice: 0,
    description: 'حلول سكنية مدروسة للعائلات الحديثة بأعلى قيمة استثمارية مع حوش 161 م².',
    features: ['حوش خاص 161 م²', 'أعلى قيمة مقابل السعر', 'تكلفة تشغيل منخفضة', 'نوافذ ممتدة'],
    renderImageUrl: '/images/shamkha/render-e.webp', floorPlanImageUrl: '/images/shamkha/plan-e-1.webp', isActive: true,
  },
  {
    code: 'F', name: 'الدوبلكس العلوي مع روف وحوش', type: 'townhouse',
    area: '247 + 179 (426 م²)', bedrooms: 3, bathrooms: 5,
    floors: '3 أدوار (أول + ثانٍ + روف وحوش 179 م²)', startingPrice: 0,
    description: 'دوبلكس علوي مستقل مع روف وحوش 179 م² ممتد على 3 أدوار باستقلالية تامة.',
    features: ['مسطح 247 م² + حوش 179 م²', '3 أدوار مستقلة', 'تراس روف علوي', 'تأسيس مصعد'],
    renderImageUrl: '/images/shamkha/render-f.webp', floorPlanImageUrl: '/images/shamkha/plan-f-1.webp', isActive: true,
  },
];

const unitSpecs = [
  { unitCode: '118-G', model: 'A', floor: 'أرضي', facade: 'شمالية' },
  { unitCode: '119-G', model: 'A', floor: 'أرضي', facade: 'جنوبية' },
  { unitCode: '120-G', model: 'A', floor: 'أرضي', facade: 'شمالية' },
  { unitCode: '128-G', model: 'C', floor: 'أرضي', facade: 'جنوبية' },
  { unitCode: '130-G', model: 'C', floor: 'أرضي', facade: 'شمالية' },
  { unitCode: '126-G', model: 'E', floor: 'أرضي', facade: 'جنوبية' },
  { unitCode: '132-G', model: 'F', floor: 'أرضي', facade: 'شمالية' },
  { unitCode: '117-U', model: 'B', floor: 'علوي', facade: 'جنوبية' },
  { unitCode: '118-U', model: 'B', floor: 'علوي', facade: 'شمالية' },
  { unitCode: '119-U', model: 'B', floor: 'علوي', facade: 'جنوبية' },
  { unitCode: '120-U', model: 'B', floor: 'علوي', facade: 'شمالية' },
  { unitCode: '126-U', model: 'D', floor: 'علوي', facade: 'جنوبية' },
  { unitCode: '128-U', model: 'D', floor: 'علوي', facade: 'شمالية' },
  { unitCode: '130-U', model: 'D', floor: 'علوي', facade: 'جنوبية' },
  { unitCode: '132-U', model: 'D', floor: 'علوي', facade: 'شمالية' },
];

async function seed() {
  console.log('[Seed Shamkha] Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI);

  let project = await Project.findOne({ slug: 'shamkha' });
  if (!project) {
    project = await Project.create(shamkhaProjectData);
  } else {
    await Project.updateOne({ _id: project._id }, { $set: shamkhaProjectData });
    project = await Project.findById(project._id);
  }

  try {
    await PropertyModel.collection.dropIndex('code_1');
  } catch {}

  await PropertyModel.deleteMany({});
  const modelsToInsert = rawModels.map((m) => ({
    ...m,
    projectId: project._id,
    projectName: project.name,
  }));
  await PropertyModel.insertMany(modelsToInsert);

  await Unit.deleteMany({});
  const unitsToInsert = unitSpecs.map((u) => {
    const m = rawModels.find((mod) => mod.code === u.model);
    return {
      unitCode: u.unitCode,
      projectId: project._id,
      projectName: project.name,
      model: u.model,
      type: 'townhouse',
      area: m.area,
      price: 0,
      status: 'available',
      facade: u.facade,
      media: {
        images: ['/images/shamkha/hero-exterior.webp'],
        videoUrl: '',
        tour3dUrl: '',
      },
    };
  });
  await Unit.insertMany(unitsToInsert);

  const siteSettingsUpdate = {
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
  };
  const settings = await SiteSettings.findOne();
  if (settings) {
    await SiteSettings.updateOne({ _id: settings._id }, { $set: siteSettingsUpdate });
  } else {
    await SiteSettings.create(siteSettingsUpdate);
  }

  console.log('[Seed Shamkha] Seeded project, 6 models, and 15 units successfully.');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('[Seed Shamkha Error]', err);
  process.exit(1);
});
