/**
 * بيانات العقارات المعتمدة - منصة ميسر للتطوير العقاري
 * متوافقة مع متطلبات الهيئة العامة للعقار بالمملكة العربية السعودية (رخصة فال)
 */

const properties = [
  {
    id: 1,
    title: "فيلا مودرن فاخرة - بناء شخصي",
    location: "حي النرجس، الرياض",
    city: "الرياض",
    neighborhood: "حي النرجس",
    locationDetail: "شمال الرياض - بالقرب من طريق الملك سلمان والجامعات",
    type: "فيلا مودرن",
    purpose: "للبيع",
    price: "3,750,000 ر.س",
    numericPrice: 3750000,
    specs: { 
      area: "375 م²", 
      beds: 5, 
      baths: 6, 
      street: "شارع 20م شمالي",
      parking: "كراج سيارتين ببوابة ذكية"
    },
    badges: ["رخصة فال: 12000189xx", "إتمام بناء", "تأمين ملاذ"],
    featured: true,
    falLicense: "12000189xx",
    adLicense: "7200194821",
    deedNumber: "310108029142",
    isSakaniEligible: true,
    hasBuildingCode: true,
    malathInsurance: "تأمين ملاذ 10 سنوات ضد العيوب الخفية",
    pricePerMeter: 10000,
    primaryImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "فيلا فاخرة بناء شخصي بإشراف هندسي معتمد في أرقى مربعات حي النرجس شمال الرياض. تتميز الفيلا بأسقف مرتفعة، واجهات زجاجية مزدوجة دبل جلاس مطلة على حديقة داخلية ومسبح شلال، ومصعد بانورامي يخدم جميع الأدوار، مع شهادة إتمام بناء وتأمين ملاذ الشامل.",
    features: [
      "شارع 20م شمالي وموقع هادئ",
      "شهادة إتمام بناء وامتثال كود البناء السعودي",
      "وثيقة تأمين ملاذ 10 سنوات ضد العيوب الخفية",
      "مسبح خاص مجهز بنظام شلال ومضخات ذكية",
      "كراج سيارتين ببوابة كهربائية ذكية",
      "مصعد بانورامي راكب ماركة أوتيس",
      "غرفة سائق خارجية بحمام مستقل",
      "جناح خادمة مستقل مع غرفة غسيل ومستودع",
      "تكييف مركزي كونسيلد (دايكن)"
    ]
  },
  {
    id: 2,
    title: "شقة تمليك فاخرة - سمارت هوم",
    location: "حي الملقا، الرياض",
    city: "الرياض",
    neighborhood: "حي الملقا",
    locationDetail: "شمال الرياض - بالقرب من طريق أنس بن مالك وطريق الملك فهد",
    type: "شقة تمليك",
    purpose: "للبيع",
    price: "1,150,000 ر.س",
    numericPrice: 1150000,
    specs: { 
      area: "145 م²", 
      beds: 3, 
      baths: 3, 
      parking: "موقف خاص قبو",
      street: "شارع 25م تجاري وسكني"
    },
    badges: ["رخصة فال: 11000245xx", "صك مستقل", "تقبل البنوك"],
    featured: false,
    falLicense: "11000245xx",
    adLicense: "7200194822",
    deedNumber: "310108029584",
    isSakaniEligible: true,
    hasBuildingCode: true,
    malathInsurance: "ضمان شركة ملاذ المعتمد",
    pricePerMeter: 7931,
    primaryImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "شقة سكنية متفردة بتشطيب سوبر ديلوكس في مجمع سكني خاص بحي الملقا بنظام المنزل الذكي الكامل. تجمع بين الفخامة والخصوصية بمدخل عائلي راقٍ، بلكونة ذات إطلالة ممتدة، وأجهزة منزلية راكبة بالكامل، مع صك إلكتروني مستقل جاهز للإفراغ الفوري عبر البورصة العقارية وتقبل كافة البنوك.",
    features: [
      "صك ملكية إلكتروني مستقل مفرز جاهز للإفراغ",
      "معتمدة وتقبل التمويل العقاري من كافة البنوك وسكني",
      "نظام سمارت هوم كامل للتحكم بالإضاءة والتكييف والدخول",
      "موقف خاص بالقبو مع شاحن سيارات كهربائية",
      "بلكونة واسعة ممتدة على الصالة الرئيسية",
      "مطبخ ألماني مجهز بكامل الأجهزة المدمجة",
      "اتحاد ملاك مسجل مع خدمات صيانة ونظافة وأمن"
    ]
  },
  {
    id: 3,
    title: "تاون هاوس مودرن بتصميم فندقي",
    location: "حي الياسمين، الرياض",
    city: "الرياض",
    neighborhood: "حي الياسمين",
    locationDetail: "شمال الرياض - بالقرب من طريق أبي بكر الصديق والبوليفارد",
    type: "تاون هاوس",
    purpose: "للبيع",
    price: "2,200,000 ر.س",
    numericPrice: 2200000,
    specs: { 
      area: "230 م²", 
      beds: 4, 
      baths: 5, 
      extras: "مسبح وكراج",
      street: "شارع 18م"
    },
    badges: ["رخصة فال: 12000311xx", "ضمانات الهيكل الإنشائي"],
    featured: true,
    falLicense: "12000311xx",
    adLicense: "7200194823",
    deedNumber: "310108031409",
    isSakaniEligible: true,
    hasBuildingCode: true,
    malathInsurance: "ضمانات الهيكل الإنشائي 15 سنة",
    pricePerMeter: 9565,
    primaryImage: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "تاون هاوس مودرن بتشطيبات فندقية فاخرة ومسبح خاص مع كراج مغلق في قلب حي الياسمين. يضم تراس علوي (روف جاردن) مجهز بجلسة شواء خارجية، فناء خلفي خاص، وضمانات ممتدة 15 سنة على الهيكل الإنشائي والعزل المائي والحراري.",
    features: [
      "مسبح خاص مع جلسة خارجية شلال",
      "كراج سيارة داخلي مع باب أوتوماتيكي",
      "ضمانات الهيكل الإنشائي 15 سنة وشهادات معتمدة",
      "حديقة فناء خلفية خاصة للعائلة",
      "تراس علوي (روف جاردن) مجهز بجلسة شواء",
      "غرفة عاملة منزلية مستقلة مع حمام خاص",
      "عزل حراري وصوتي عالي الكفاءة (زجاج دبل)"
    ]
  },
  {
    id: 4,
    title: "فيلا قصر مصغر نيوكلاسيك مع مسبح ومصعد بانورامي",
    location: "حي حطين، الرياض",
    city: "الرياض",
    neighborhood: "حي حطين",
    locationDetail: "الرياض - بالقرب من طريق الأمير تركي الأول وبوليفارد رياض سيتي",
    type: "فيلا مودرن",
    purpose: "للبيع",
    price: "6,900,000 ر.س",
    numericPrice: 6900000,
    specs: { 
      area: "500 م²", 
      beds: 6, 
      baths: 8, 
      street: "شارع 25م شمالي",
      extras: "مصعد بانورامي ومسبح أولمبي"
    },
    badges: ["رخصة فال: 12000284xx", "صك إلكتروني", "تأمين ملاذ"],
    featured: true,
    falLicense: "1200028422",
    adLicense: "7200194824",
    deedNumber: "310108035612",
    isSakaniEligible: false,
    hasBuildingCode: true,
    malathInsurance: "تأمين ملاذ 10 سنوات ضد العيوب الخفية",
    pricePerMeter: 13800,
    primaryImage: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "تحفة معمارية استثنائية في أرقى مواقع حطين النموذجي. صممت الفيلا بأعلى مقاييس الفخامة العالمية بمجلس رجال فخم مستقل، صالة عائلية دبل هايت مع زجاج مفتوح على المسبح والحديقة الإنجليزية، ومصعد بانورامي.",
    features: [
      "مجلس رجال فخم مع بهو استقبال ومغاسل رخام",
      "مسبح أولمبي خاص بنظام تدفئة وإنارة ليلية تحت الماء",
      "مصعد بانورامي زجاجي فائق الهدوء",
      "قبو ترفيهي وصالة سينما مجهزة",
      "نظام تكييف مركزي متطور VRF موفر للطاقة 40%"
    ]
  },
  {
    id: 5,
    title: "شقة بنتهاوس روف بإطلالة بحرية بانورامية",
    location: "حي الشاطئ، جدة",
    city: "جدة",
    neighborhood: "حي الشاطئ",
    locationDetail: "جدة - الواجهة البحرية، طريق الكورنيش الشمالي",
    type: "شقة تمليك",
    purpose: "للبيع",
    price: "2,800,000 ر.س",
    numericPrice: 2800000,
    specs: { 
      area: "285 م²", 
      beds: 4, 
      baths: 5, 
      extras: "تراس بحري 75 م²",
      parking: "موقفان خاصان بالقبو"
    },
    badges: ["رخصة فال: 12000284xx", "صك إلكتروني", "إطلالة مباشرة"],
    featured: false,
    falLicense: "1200028425",
    adLicense: "7200194825",
    deedNumber: "410108044721",
    isSakaniEligible: true,
    hasBuildingCode: true,
    malathInsurance: "ضمان ملاذ للتأمين الإنشائي",
    pricePerMeter: 9824,
    primaryImage: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "بنتهاوس فاخر بإطلالة ساحرة ومباشرة على شواطئ البحر الأحمر بجدة. تشطيبات عصرية بمساحات شاسعة، تراس خارجي مجهز بجلسة غروب زجاجية ومصعد خاص ينفذ إلى داخل الردهة.",
    features: [
      "إطلالة بانورامية لا تحجب على البحر والكورنيش",
      "تراس خارجي فسيح 75 م² مع جاكوزي خاص",
      "نادي صحي ومسبح لا متناهي مشترك بالبرج السكني",
      "خدمة كونسيرج واستقبال وأمن وحراسة 24/7"
    ]
  },
  {
    id: 6,
    title: "مجمع مكاتب تجارية فاخرة (درجة أولى A)",
    location: "حي الملقا، الرياض",
    city: "الرياض",
    neighborhood: "حي الملقا",
    locationDetail: "الرياض - تقاطع طريق أنس بن مالك مع طريق الخير",
    type: "استثمار تجاري",
    purpose: "استثمار تجاري",
    price: "18,500,000 ر.س",
    numericPrice: 18500000,
    specs: { 
      area: "1100 م²", 
      beds: 0, 
      baths: 8, 
      parking: "14 موقف سيارة خاص",
      street: "طريق رئيسي 40م"
    },
    badges: ["رخصة فال: 12000284xx", "عائد سنوي 8.5%", "عقود إيجار موثقة"],
    featured: false,
    falLicense: "1200028427",
    adLicense: "7200194827",
    deedNumber: "310108088910",
    isSakaniEligible: false,
    hasBuildingCode: true,
    malathInsurance: "وثيقة تأمين المباني التجارية",
    pricePerMeter: 16818,
    primaryImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "فرصة استثمارية واعدة بعائد سنوي مجزٍ يتجاوز 8.5%. مبنى تجاري إداري بدرجة أولى في أرقى عصب تجاري بشمال الرياض، مؤجر لشركات استشارية عالمية ومؤسسات تقنية بعقود طويلة الأجل موثقة عبر منصة إيجار.",
    features: [
      "عائد استثماري سنوي 8.5% بعقود إيجار موثقة عبر إيجار",
      "14 موقف سيارة خاص في القبو والسطح",
      "واجهات زجاجية كيرتن وول عازلة للحرارة والصوت",
      "نظام أمني متكامل ومكافحة حريق معتمد من الدفاع المدني"
    ]
  }
];

// قائمة المدن والأحياء المتاحة
const saudiLocations = {
  'الرياض': [
    'حي النرجس',
    'حي الملقا',
    'حي الياسمين',
    'حي حطين',
    'حي قرطبة',
    'حي العارض',
    'حي الرمال',
    'حي الصحافة'
  ],
  'جدة': [
    'حي الشاطئ',
    'حي أبحر الشمالية',
    'حي الروضة',
    'حي المحمدية',
    'حي الحمراء',
    'حي النعيم'
  ],
  'الخبر': [
    'حي الحزام الأخضر',
    'حي الحزام الذهبي',
    'حي الشاطئ الشرقي',
    'حي الصواري'
  ],
  'مكة المكرمة': [
    'حي العوالي',
    'حي الشوقية',
    'حي بطحاء قريش',
    'حي النسيم'
  ]
};

// أنواع العقارات
const propertyTypes = [
  'الكل',
  'فيلا مودرن',
  'شقة تمليك',
  'تاون هاوس',
  'دور مستقل',
  'أرض سكنية',
  'استثمار تجاري'
];

// تصدير العقارات بالاسمين للتوافق التام (properties و propertiesData)
const propertiesData = properties;

if (typeof window !== 'undefined') {
  window.properties = properties;
  window.propertiesData = properties;
  window.saudiLocations = saudiLocations;
  window.propertyTypes = propertyTypes;
}

// دعم بيئة Node / CommonJS
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { properties, propertiesData, saudiLocations, propertyTypes };
}
