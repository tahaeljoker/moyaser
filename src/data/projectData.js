import { models } from './modelsData.js';
import { units } from './unitsData.js';

export { models, units };

const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || '966500550223';
const MAPS_QUERY = import.meta.env.VITE_GOOGLE_MAPS_QUERY || 'https://maps.google.com/?q=Dammam+Al+Atheer+Park';

export const brand = {
  developer: 'مُيسّر للتطوير العقاري',
  project: 'تاون هاوس الشامخة',
  city: 'الدمام',
  district: 'حي حديقة الأثير',
  country: 'المملكة العربية السعودية',
  phone: `+${WHATSAPP}`,
  phoneDisplay: '+966 50 055 0223',
  whatsapp: WHATSAPP,
  logo: '/brand/logo.png',
  workingHours: 'طوال أيام الأسبوع — 9:00 صباحاً حتى 9:00 مساءً',
  mapQuery: MAPS_QUERY,
  tagline: 'مشاريع سكنية نوعية بتصاميم عصرية وإتقان هندسي',
  developerType: 'مطور عقاري',
  regaLicense: '1200028491',
  falLicense: '1100248950',
};

export const hero = {
  eyebrow: 'مُيسّر للتطوير العقاري — المطور الحصري للمشروع',
  tagline: 'مشاريع سكنية نوعية بتصاميم عصرية وإتقان هندسي',
  title: 'تاون هاوس الشامخة',
  titleSub: 'عنوان الاستقرار والرفاهية العائلية بالدمام',
  description: 'وحدات دوبلكس مستقلة بمساحات من 227 م² حتى 427 م² بتشطيبات راقية وتوزيع هندسي ذكي في أرقى مواقع حي حديقة الأثير بالدمام.',
  ctaPrimary: 'استعرض مصفوفة الوحدات',
  ctaSecondary: 'تواصل واتساب مباشرة',
  bgImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85',
  metrics: [
    { label: 'إجمالي الوحدات', value: '15 وحدة', sub: 'دوبلكس مستقل' },
    { label: 'تنوع النماذج', value: '6 نماذج', sub: 'من نموذج A إلى F' },
    { label: 'المساحات المتوفرة', value: '227–427 م²', sub: 'أرضي وحوش وروف' },
    { label: 'الاستقلالية', value: '100%', sub: 'مدخل وكراج وخزان مستقل' },
  ],
};

export const locationDistances = [
  { place: 'مركز الملك عبدالعزيز الثقافي (إثراء)', duration: '16 دقيقة' },
  { place: 'مطار الملك فهد الدولي', duration: '24 دقيقة' },
  { place: 'المستشفى السعودي الألماني', duration: '14 دقيقة' },
  { place: 'كورنيش الدمام', duration: '18 دقيقة' },
];

export const locationPerks = [
  { icon: 'shield', title: 'استقلالية كاملة', desc: 'مدخل سيارة خاص، عداد كهرباء منفصل، وخزان مياه أرضي وعلوي مستقل لكل وحدة.' },
  { icon: 'zap', title: 'تأسيسات سمارت هوم', desc: 'تجهيزات ذكية للإنارة والتكييف، شبكة ألياف بصرية، وكاميرات مراقبة خارجية.' },
  { icon: 'home', title: 'الواجهة المعمارية', desc: 'حجر طبيعي مع زجاج استركتشر عازل حرارياً وتكسيات ديكورية مقاومة للرطوبة.' },
  { icon: 'move-up', title: 'مصاعد راكبة مجهزة', desc: 'مصاعد إيطالية راكبة في وحدات الروف والدوبلكس لراحة تامة لكافة أفراد العائلة.' },
];

export const about = {
  category: 'فلسفة البناء والتطوير',
  headline: 'استقلالية الفيلا الخاصة، بمرونة التاون هاوس العصري.',
  lead: 'في قلب حي حديقة الأثير بالدمام، يعيد مشروع تاون هاوس الشامخة صياغة مفهوم الخصوصية والاستقرار السكني. لم نكتفِ بتقديم مسكن، بل ابتكرنا نمط حياة متفرداً يمنح كل عائلة حرية الملكية التامة بلا قيود مجاورة مشتركة.',
  subtext: 'مدخل سيارة خاص، عداد كهرباء منفصل، وخزانات مياه علوية وأرضية مستقلة بالكامل لكل وحدة دوبلكس؛ لتستمتع بكامل استقلالية الفيلا المنفصلة مع كفاءة التصميم الهندسي الحديث وجودة البناء المستدامة.',
  stats: [
    { num: '100%', label: 'استقلالية المرافق والخزانات', sub: 'عداد وكراج وخزان مستقل' },
    { num: '6', label: 'نماذج معمارية متنوعة', sub: 'من نموذج A إلى F' },
    { num: '15', label: 'وحدة دوبلكس متكاملة', sub: 'بحي حديقة الأثير' },
  ],
  image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
  imageCaption: 'الواجهة بالحجر الطبيعي وزجاج استركتشر — تشطيبات تعزل الحرارة وتتحمل الأجواء الساحلية',
  pills: [
    { icon: 'move-up', title: 'مصاعد إيطالية راكبة', desc: 'جاهزة للتشغيل لوحدات الدوبلكس والروف لراحة العائلة.' },
    { icon: 'zap', title: 'تأسيس سمارت هوم وألياف', desc: 'بنية تحتية متطورة لأنظمة التكييف وكاميرات المراقبة.' },
  ],
};

export const properties = [
  {
    id: 'prop-1',
    title: 'تاون هاوس الشامخة — حي حديقة الأثير',
    category: 'تاون هاوس',
    city: 'الدمام',
    district: 'حي حديقة الأثير',
    cityDistrict: 'الدمام — حي حديقة الأثير',
    price: 1380000,
    area: '310 م²',
    builtArea: '265 م²',
    beds: 4,
    baths: 4,
    parking: 'مدخل سيارة خاص',
    badge: 'جاهز للإفراغ الفوري',
    status: 'available',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
    description: 'تاون هاوس دوبلكس مستقل بالكامل بمدخل سيارة وخزان أرضي وعلوي خاص، تصميم عصري وتشطيبات راقية.',
    features: ['مدخل سيارة خاص', 'خزان مستقل وعداد منفصل', 'تأسيس مصعد إيطالي', 'صك إلكتروني مستقل'],
  },
  {
    id: 'prop-2',
    title: 'فيلا مودرن درج صالة — بناء شخصي',
    category: 'فلل مستقلة',
    city: 'الدمام',
    district: 'حي الشاطئ الغربي',
    cityDistrict: 'الدمام — حي الشاطئ الغربي',
    price: 2650000,
    area: '375 م²',
    builtArea: '460 م²',
    beds: 5,
    baths: 6,
    parking: 'كراج سيارتين',
    badge: 'بناء شخصي',
    status: 'available',
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=85',
    description: 'فيلا فاخرة درج صالة بتصميم معماري حديث وتشطيب سوبر ديلوكس، مسبح خاص ومصعد راكب.',
    features: ['مصعد راكب مرحلة أولى', 'مسبح وجلسة حديقة', 'جناح ماستر ملكي', 'غرفة خادمة وسائق'],
  },
  {
    id: 'prop-3',
    title: 'شقة تمليك بتشطيب راقٍ',
    category: 'شقق تمليك فاخرة',
    city: 'الخبر',
    district: 'حي العليا',
    cityDistrict: 'الخبر — حي العليا',
    price: 850000,
    area: '185 م²',
    builtArea: '185 م²',
    beds: 3,
    baths: 3,
    parking: 'موقف خاص مظلل',
    badge: 'صك إلكتروني مستقل',
    status: 'available',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=85',
    description: 'شقة تمليك بموقف خاص مظلل، نظام دخول ذكي، تكييف مخفي مركزي.',
    features: ['دخول ذكي سمارت', 'تكييف كونسيلد مخفي', 'موقف خاص مظلل', 'اتحاد ملاك معتمد'],
  },
  {
    id: 'prop-4',
    title: 'دوبلكس أرضي بحوش خاص',
    category: 'أدوار سكنية',
    city: 'الدمام',
    district: 'حي الفاخرية',
    cityDistrict: 'الدمام — حي الفاخرية',
    price: 1220000,
    area: '280 م²',
    builtArea: '220 م²',
    beds: 4,
    baths: 4,
    parking: 'باكية سيارة خاصة',
    badge: 'حوش خاص واسع',
    status: 'available',
    image: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=85',
    description: 'دور دوبلكس أرضي بمواصفات فيلا مستقلة، حوش خاص واسع مهيأ للجلسات العائلية.',
    features: ['حوش خاص 60 م²', 'مدخل وكراج مستقل', 'غرفة خادمة وغسيل', 'شهادة إتمام بناء'],
  },
  {
    id: 'prop-5',
    title: 'دور علوي مع روف خاص',
    category: 'أدوار سكنية',
    city: 'الدمام',
    district: 'حي الواحة',
    cityDistrict: 'الدمام — حي الواحة',
    price: 980000,
    area: '260 م²',
    builtArea: '205 م²',
    beds: 4,
    baths: 4,
    parking: 'موقف خاص مستقل',
    badge: 'روف وجلسة خاصة',
    status: 'available',
    image: 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1200&q=85',
    description: 'دور علوي بمصعد راكب وسطح خاص واسع مهيأ لجلسات الشواء.',
    features: ['مصعد راكب يخدم الدور', 'سطح خاص وتراس 55 م²', 'صالة معيشة بإطلالة', 'عداد كهرباء ومياه مستقل'],
  },
  {
    id: 'prop-6',
    title: 'فيلا زاوية نيو كلاسيك',
    category: 'فلل مستقلة',
    city: 'الخبر',
    district: 'حي التحلية',
    cityDistrict: 'الخبر — حي التحلية',
    price: 3150000,
    area: '420 م²',
    builtArea: '520 م²',
    beds: 5,
    baths: 6,
    parking: 'كراج لـ 3 سيارات',
    badge: 'موقع زاوية',
    status: 'available',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85',
    description: 'فيلا مستقلة على شارعين متقاطعين، تصميم نيو كلاسيك، الواجهة بالحجر الطبيعي.',
    features: ['شارعان متقاطعان 20 م', 'تكييف مركزي كامل', 'الواجهة بالحجر الطبيعي', 'إشراف هندسي معتمد'],
  },
];

export const upcoming = [
  {
    title: 'مشروع ريفان السكني — الخبر (حي العزيزية)',
    type: 'فلل مستقلة',
    status: 'أعمال الهيكل الإنشائي',
    launchDate: 'الربع الثالث 2026',
    desc: '18 فيلا بتصاميم عصرية، مساحات 380 م²، مع مسابح ومصاعد خاصة.',
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'مشروع سديم تاون هاوس — الدمام (حي الشاطئ)',
    type: 'تاون هاوس بحري',
    status: 'التخطيط والاعتمادات الهندسية',
    launchDate: 'الربع الرابع 2026',
    desc: '30 تاون هاوس بمجتمع مغلق وإطلالات بحرية وممرات مشاة وحدائق داخلية.',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
  },
];

export const navLinks = [
  { label: 'عن المشروع', href: '#about-section' },
  { label: 'الموقع والمزايا', href: '#location-section' },
  { label: 'مصفوفة الوحدات', href: '#matrix-section' },
  { label: 'العقارات المتاحة', href: '#models-section' },
  { label: 'تواصل معنا', href: '#contact-section' },
];

export const footerLinks = [
  { label: 'عن المشروع', href: '#about-section' },
  { label: 'مصفوفة الوحدات', href: '#matrix-section' },
  { label: 'العقارات المتاحة', href: '#models-section' },
  { label: 'حجز وحدة', href: '#booking-section' },
  { label: 'موقع المشروع', href: '#location-section' },
  { label: 'تواصل معنا', href: '#contact-section' },
];
