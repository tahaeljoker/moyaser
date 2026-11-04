/**
 * بيانات العقارات المعتمدة - نسخة ES Module لـ Next.js / React
 * متوافقة مع متطلبات الهيئة العامة للعقار بالمملكة العربية السعودية
 */

export const properties = [
  {
    id: 1,
    title: "فيلا مودرن فاخرة - بناء شخصي",
    location: "حي النرجس، الرياض",
    city: "الرياض",
    neighborhood: "حي النرجس",
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
    primaryImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 2,
    title: "شقة تمليك فاخرة - سمارت هوم",
    location: "حي الملقا، الرياض",
    city: "الرياض",
    neighborhood: "حي الملقا",
    type: "شقة تمليك",
    purpose: "للبيع",
    price: "1,150,000 ر.س",
    numericPrice: 1150000,
    specs: { 
      area: "145 م²", 
      beds: 3, 
      baths: 3, 
      parking: "موقف خاص قبو" 
    },
    badges: ["رخصة فال: 11000245xx", "صك مستقل", "تقبل البنوك"],
    featured: false,
    falLicense: "11000245xx",
    primaryImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 3,
    title: "تاون هاوس مودرن بتصميم فندقي",
    location: "حي الياسمين، الرياض",
    city: "الرياض",
    neighborhood: "حي الياسمين",
    type: "تاون هاوس",
    purpose: "للبيع",
    price: "2,200,000 ر.س",
    numericPrice: 2200000,
    specs: { 
      area: "230 م²", 
      beds: 4, 
      baths: 5, 
      extras: "مسبح وكراج" 
    },
    badges: ["رخصة فال: 12000311xx", "ضمانات الهيكل الإنشائي"],
    featured: true,
    falLicense: "12000311xx",
    primaryImage: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80"
  }
];

export default properties;

