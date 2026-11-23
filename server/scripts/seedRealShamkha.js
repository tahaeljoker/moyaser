import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { Project } from '../models/Project.js';
import { Unit } from '../models/Unit.js';
import { PropertyModel } from '../models/PropertyModel.js';
import { SiteSettings } from '../models/SiteSettings.js';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/muyassar';

const shamkhaData = {
  name: 'تاون هاوس الشامخة', slug: 'shamkha',
  tagline: 'مجتمع سكني فاخر بتصاميم عصرية وضمانات شاملة',
  description: 'مشروع تاون هاوس الشامخة بالدمام يجمع بين الخصوصية التامة والاستقلالية المعمارية في موقع استراتيجي مطل على حديقة الأثير العامة.',
  city: 'الدمام', district: 'حي حديقة الأثير', status: 'available',
  heroImageUrl: '/images/shamkha/hero-exterior.webp', masterplanUrl: '/images/shamkha/masterplan.webp',
  contactPhone: '0500550223', whatsappNumber: '966500550223', mapUrl: 'https://maps.google.com/?q=Dammam+Al+Atheer+Park',
  regaLicense: '1200028491', valLicense: '',
  specs: ['صك إلكتروني مستقل لكل وحدة سكنية', 'عدادات مياه وكهرباء مستقلة', 'كراج سيارة خاص ومدخل مستقل', 'تأسيس مصعد بجميع النماذج العلوية', 'عزل حراري ومائي معتمد'],
  guarantees: [
    { title: 'الهيكل الإنشائي', duration: '10 سنوات', details: 'تأمين العيوب الخفية' }, { title: 'التمديدات الكهربائية', duration: '25 سنة', details: 'ضمان الفنار' },
    { title: 'التمديدات الصحية', duration: '15 سنة', details: 'ضمان معتمد' }, { title: 'العزل المائي والحراري', duration: '10 سنوات', details: 'ضمان عزل الأسطح' },
  ],
  afterSales: ['صيانة السنة الأولى', 'تسليم كتيب الإرشادات', 'توثيق شهادات الضمان'],
  visibleSections: { models: true, unitMatrix: true, gallery: true, location: true, specs: true, guarantees: true, afterSales: true },
  sortOrder: 0, isActive: true,
};

const shamkhaModels = [
  { code: 'A', name: 'الدوبلكس الأرضي الرحب', area: '250.75 + 177 (427.75 م²)', bedrooms: 3, bathrooms: 5, floors: 'دور أرضي + أول + حوش 177 م²', description: 'دوبلكس أرضي مستقل مع حوش خاص 177 م² وكراج مستقل.', renderImageUrl: '/images/shamkha/render-a.webp', floorPlanImageUrl: '/images/shamkha/plan-a-1.webp' },
  { code: 'B', name: 'الدوبلكس العلوي مع السطح', area: '233 + 69 (302 م²)', bedrooms: 3, bathrooms: 4, floors: 'دور علوي + ملحق روف + جلسة سطح 69 م²', description: 'دوبلكس علوي فاخر بإطلالة مفتوحة وجلسة سطح خاصة 69 م².', renderImageUrl: '/images/shamkha/render-b.webp', floorPlanImageUrl: '/images/shamkha/plan-b-1.webp' },
  { code: 'C', name: 'الدوبلكس الوسطي الذكي', area: '239 + 134 (373 م²)', bedrooms: 3, bathrooms: 4, floors: 'دورين متصلين + حوش 134 م²', description: 'أناقة معمارية واستغلال هندسي ذكي مع فناء إضاءة سماوية.', renderImageUrl: '/images/shamkha/render-c.webp', floorPlanImageUrl: '/images/shamkha/plan-c-1.webp' },
  { code: 'D', name: 'تاون هاوس الزاوية', area: '227 + 80 (307 م²)', bedrooms: 4, bathrooms: 6, floors: 'أرضي + أول + ملحق روف + حديقة جانبية', description: 'واجهتان معماريتان وإضاءة طبيعية وافرة مع كراج لسيارتين.', renderImageUrl: '/images/shamkha/render-d.webp', floorPlanImageUrl: '/images/shamkha/plan-d-1.webp' },
  { code: 'E', name: 'الدوبلكس المدمج', area: '247 + 161 (408 م²)', bedrooms: 3, bathrooms: 3, floors: 'دورين متصلين + حوش 161 م²', description: 'حلول سكنية مدروسة للعائلات بأعلى قيمة استثمارية.', renderImageUrl: '/images/shamkha/render-e.webp', floorPlanImageUrl: '/images/shamkha/plan-e-1.webp' },
  { code: 'F', name: 'الدوبلكس العلوي مع روف وحوش', area: '247 + 179 (426 م²)', bedrooms: 3, bathrooms: 5, floors: '3 أدوار (أول + ثانٍ + روف وحوش 179 م²)', description: 'دوبلكس علوي مستقل مع روف وحوش 179 م² ممتد على 3 أدوار.', renderImageUrl: '/images/shamkha/render-f.webp', floorPlanImageUrl: '/images/shamkha/plan-f-1.webp' },
];

const unitCodes = [
  { c: '118-G', m: 'A', f: 'أرضي', fc: 'شمالية' }, { c: '119-G', m: 'A', f: 'أرضي', fc: 'جنوبية' }, { c: '120-G', m: 'A', f: 'أرضي', fc: 'شمالية' },
  { c: '128-G', m: 'C', f: 'أرضي', fc: 'جنوبية' }, { c: '130-G', m: 'C', f: 'أرضي', fc: 'شمالية' }, { c: '126-G', m: 'E', f: 'أرضي', fc: 'جنوبية' },
  { c: '132-G', m: 'F', f: 'أرضي', fc: 'شمالية' }, { c: '117-U', m: 'B', f: 'علوي', fc: 'جنوبية' }, { c: '118-U', m: 'B', f: 'علوي', fc: 'شمالية' },
  { c: '119-U', m: 'B', f: 'علوي', fc: 'جنوبية' }, { c: '120-U', m: 'B', f: 'علوي', fc: 'شمالية' }, { c: '126-U', m: 'D', f: 'علوي', fc: 'جنوبية' },
  { c: '128-U', m: 'D', f: 'علوي', fc: 'شمالية' }, { c: '130-U', m: 'D', f: 'علوي', fc: 'جنوبية' }, { c: '132-U', m: 'D', f: 'علوي', fc: 'شمالية' },
];

const sampleProjects = [
  {
    data: {
      name: 'تاون هاوس الرفيعة', slug: 'al-rafeeah', tagline: 'مجتمع تاون هاوس حديث بإطلالات مفتوحة وتشطيبات فاخرة',
      description: 'مشروع تاون هاوس سكني متكامل بمدينة الخبر، يضم وحدات دوبلكس بتصاميم عصرية مستقلة توفر خصوصية استثنائية للعائلة السعودية.',
      city: 'الخبر', district: 'حي الرفيعة', status: 'available', heroImageUrl: '/images/shamkha/hero-exterior.webp',
      masterplanUrl: '/images/shamkha/masterplan.webp', contactPhone: '0500550223', whatsappNumber: '966500550223',
      mapUrl: 'https://maps.google.com/?q=Al+Khobar+Al+Rafeeah', regaLicense: '1200028491',
      specs: ['صك إلكتروني مستقل لكل وحدة', 'عدادات مياه وكهرباء مستقلة', 'كراج سيارة خاص', 'تأسيس مصاعد راكبة', 'عزل حراري ومائي'],
      guarantees: [{ title: 'الهيكل الإنشائي', duration: '10 سنوات', details: 'تأمين العيوب الخفية' }, { title: 'التمديدات الكهربائية', duration: '25 سنة', details: 'ضمان الفنار' }],
      afterSales: ['صيانة السنة الأولى', 'تسليم كتيب الإرشادات'], visibleSections: { models: true, gallery: true, location: true, specs: true, guarantees: true, afterSales: true }, sortOrder: 1, isActive: true,
    },
    models: [
      { code: 'R-1', name: 'فيلا الأفق المفتوح', area: '345 م²', floors: 'دورين وملحق روف', bedrooms: 4, bathrooms: 5, startingPrice: 1580000, description: 'دوبلكس علوي واسع مع جلسة روف خارجية بإطلالة بانورامية وتأسيس مصعد.', renderImageUrl: '/images/shamkha/render-b.webp', floorPlanImageUrl: '/images/shamkha/plan-b-1.webp' },
      { code: 'R-2', name: 'تاون هاوس الواحة الأرضي', area: '395 م²', floors: 'دور أرضي + دور أول + حوش خاص', bedrooms: 4, bathrooms: 5, startingPrice: 1720000, description: 'دوبلكس أرضي رحب مع حديقة وارتداد خاص 140 م²، مجلس رجال مستقل ومدخل خاص مباشر.', renderImageUrl: '/images/shamkha/render-a.webp', floorPlanImageUrl: '/images/shamkha/plan-a-1.webp' },
    ],
  },
  {
    data: {
      name: 'دوبلكسات النخيل المعمارية', slug: 'al-nakheel', tagline: 'هندسة معمارية مستدامة واستقلالية إنشائية تامة',
      description: 'مشروع سكني نوعي في قلب حي النخيل بالدمام يركز على كفاءة الطاقة والإنارة الطبيعية مع استقلالية تامة في الجدران الإنشائية.',
      city: 'الدمام', district: 'حي النخيل', status: 'under_development', heroImageUrl: '/images/shamkha/interior-1.webp',
      masterplanUrl: '/images/shamkha/masterplan.webp', contactPhone: '0500550223', whatsappNumber: '966500550223',
      mapUrl: 'https://maps.google.com/?q=Dammam+Al+Nakheel', regaLicense: '1200028491',
      specs: ['استقلالية إنشائية كاملة بدون فواصل مشتركة', 'نوافذ زجاجية مزدوجة عازلة للحرارة', 'صك ملكية إلكتروني مستقل'],
      guarantees: [{ title: 'الهيكل الإنشائي', duration: '10 سنوات', details: 'تأمين العيوب الخفية' }, { title: 'التمديدات والأنابيب', duration: '15 سنة', details: 'ضمان معتمد' }],
      afterSales: ['صيانة السنة الأولى', 'فحص الجودة الدوري'], visibleSections: { models: true, gallery: true, location: true, specs: true, guarantees: true, afterSales: true }, sortOrder: 2, isActive: true,
    },
    models: [
      { code: 'N-1', name: 'الدوبلكس الذكي الفاخر', area: '320 م²', floors: '3 أدوار متصلة', bedrooms: 4, bathrooms: 4, startingPrice: 1420000, description: 'تصميم عصري مدمج بأنظمة المنزل الذكي وإضاءة سماوية طبيعية.', renderImageUrl: '/images/shamkha/render-c.webp', floorPlanImageUrl: '/images/shamkha/plan-c-1.webp' },
      { code: 'N-2', name: 'فيلا التراس البانورامي', area: '365 م²', floors: 'دورين + ملحق روف مجهز', bedrooms: 5, bathrooms: 5, startingPrice: 1610000, description: 'مسطحات عائلية رحبة تضمن الخصوصية التامة مع تراس علوي مجهز.', renderImageUrl: '/images/shamkha/hero-exterior.webp', floorPlanImageUrl: '/images/shamkha/plan-b-2.webp' },
    ],
  },
  {
    data: {
      name: 'تاون هاوس السروات', slug: 'al-sarawat', tagline: 'فلل وتاون هاوس عائلية مستقلة بصكوك إلكترونية',
      description: 'مجمع سكني مرموق بالقرب من واحة الظهران، يتميز بتصاميم تجمع أصالة الهوية المعمارية مع أحدث حلول الاستدامة وجودة البناء.',
      city: 'الظهران', district: 'حي القصور', status: 'available', heroImageUrl: '/images/shamkha/render-b.webp',
      masterplanUrl: '/images/shamkha/masterplan.webp', contactPhone: '0500550223', whatsappNumber: '966500550223',
      mapUrl: 'https://maps.google.com/?q=Dhahran+Al+Qusoor', regaLicense: '1200028491',
      specs: ['موقع استراتيجي راقٍ بالقرب من المراكز الحيوية', 'صكوك ملكية فورية مستقلة', 'جدران مزدوجة بعوازل صخرية', 'كراج سيارة مظلل'],
      guarantees: [{ title: 'الهيكل الإنشائي', duration: '10 سنوات', details: 'تأمين العيوب الخفية' }, { title: 'تمديدات الكهرباء والسباكة', duration: '20 سنة', details: 'ضمان معتمد' }],
      afterSales: ['صيانة السنة الأولى', 'خدمة العملاء على مدار الساعة'], visibleSections: { models: true, gallery: true, location: true, specs: true, guarantees: true, afterSales: true }, sortOrder: 3, isActive: true,
    },
    models: [
      { code: 'S-1', name: 'الدوبلكس الركني الكبير', area: '415 م²', floors: 'دور أرضي + أول + ملحق', bedrooms: 5, bathrooms: 6, startingPrice: 1850000, description: 'الوحدة الأكثر رحابة في المشروع بموقع ركني مميز، واجهات زجاجية واسعة، حوش خاص.', renderImageUrl: '/images/shamkha/render-a.webp', floorPlanImageUrl: '/images/shamkha/plan-a-2.webp' },
      { code: 'S-2', name: 'تاون هاوس الرووف الملكي', area: '330 م²', floors: 'دور علوي + ملحق روف', bedrooms: 4, bathrooms: 4, startingPrice: 1540000, description: 'تصميم مخصص للعائلات الباحثة عن الراحة والاستقلالية، يضم صالة عائلية مفتوحة.', renderImageUrl: '/images/shamkha/render-c.webp', floorPlanImageUrl: '/images/shamkha/plan-b-1.webp' },
    ],
  },
];

async function seed() {
  console.log('[Seed Database] Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI);

  // 1. Seed or Update Flagship: Shamkha
  let shamkha = await Project.findOne({ slug: 'shamkha' });
  if (!shamkha) {
    shamkha = await Project.create(shamkhaData);
  } else {
    await Project.updateOne({ _id: shamkha._id }, { $set: shamkhaData });
    shamkha = await Project.findById(shamkha._id);
  }

  // Clear & re-seed Shamkha official models and units
  await PropertyModel.deleteMany({ projectId: shamkha._id });
  await PropertyModel.insertMany(shamkhaModels.map((m) => ({ ...m, projectId: shamkha._id, projectName: shamkha.name, startingPrice: 0, isActive: true })));

  await Unit.deleteMany({ projectId: shamkha._id });
  await Unit.insertMany(unitCodes.map((u) => {
    const m = shamkhaModels.find((mod) => mod.code === u.m);
    return { unitCode: u.c, projectId: shamkha._id, projectName: shamkha.name, model: u.m, type: 'townhouse', area: m.area, price: 0, status: 'available', facade: u.fc, media: { images: ['/images/shamkha/hero-exterior.webp'], videoUrl: '', tour3dUrl: '' } };
  }));

  // 2. Seed Clean Manageable Projects (al-rafeeah, al-nakheel, al-sarawat)
  for (const item of sampleProjects) {
    let proj = await Project.findOne({ slug: item.data.slug });
    if (!proj) {
      proj = await Project.create(item.data);
      console.log(`[Seed Database] Created project: ${proj.name} (${proj.slug})`);
    }
    // Seed models for this project if empty
    const existingModels = await PropertyModel.countDocuments({ projectId: proj._id });
    if (existingModels === 0) {
      await PropertyModel.insertMany(item.models.map((m) => ({ ...m, projectId: proj._id, projectName: proj.name, isActive: true })));
      console.log(`   -> Seeded ${item.models.length} models for ${proj.name}`);
    }
  }

  // 3. Site Settings update
  const siteSettingsUpdate = {
    projectName: 'تاون هاوس الشامخة — الدمام', city: 'الدمام — حي حديقة الأثير',
    heroTitle: 'تاون هاوس الشامخة', heroSubtitle: 'عنوان الاستقرار والرفاهية العائلية بالدمام',
    regaLicense: '1200028491', falLicense: '', whatsappNumber: '966500550223', phoneNumber: '+966 50 055 0223',
    mapUrl: 'https://maps.google.com/?q=Dammam+Al+Atheer+Park', heroImageUrl: '/images/shamkha/hero-exterior.webp',
  };
  const settings = await SiteSettings.findOne();
  if (settings) await SiteSettings.updateOne({ _id: settings._id }, { $set: siteSettingsUpdate });
  else await SiteSettings.create(siteSettingsUpdate);

  console.log('[Seed Database] Seed completed successfully. All projects exist in MongoDB and are manageable in /admin.');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('[Seed Error]', err);
  process.exit(1);
});
