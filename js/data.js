/**
 * data.js — المصدر الوحيد لكل بيانات المشروع
 * مُيسّر للتطوير العقاري | تاون هاوس الشامخة (الدمام)
 * ─────────────────────────────────────────────────
 * لا يحتوي هذا الملف على أي منطق برمجي (zero logic).
 * يتم استهلاكه حصرياً من app.js لعرض كل محتوى الصفحة.
 */

const DATA = {

  /* =========================================================
     1. الهوية المؤسسية (Brand)
     ========================================================= */
  brand: {
    developer:    "مُيسّر للتطوير العقاري",
    project:      "تاون هاوس الشامخة",
    city:         "الدمام",
    district:     "حي حديقة الأثير",
    country:      "المملكة العربية السعودية",
    phone:        "+966500550223",
    phoneDisplay: "+966 50 055 0223",
    whatsapp:     "966500550223",
    logo:         "https://muyassar-ra.com/brand/logo-transparent.png",
    workingHours: "طوال أيام الأسبوع — 9:00 صباحاً حتى 9:00 مساءً",
    mapQuery:     "https://maps.google.com/?q=Dammam+Al+Atheer+Park",
    tagline:      "مشاريع سكنية نوعية بتصاميم عصرية وإتقان هندسي",
    developerType: "مطور عقاري",
  },

  /* =========================================================
     2. قسم الواجهة الرئيسية (Hero)
     ========================================================= */
  hero: {
    eyebrow:     "مُيسّر للتطوير العقاري — المطور الحصري للمشروع",
    tagline:     "مشاريع سكنية نوعية بتصاميم عصرية وإتقان هندسي",
    title:       "تاون هاوس الشامخة",
    titleSub:    "عنوان الاستقرار والرفاهية العائلية بالدمام",
    description: "وحدات دوبلكس مستقلة بمساحات تبدأ من 227م² حتى 427م² بتشطيبات راقية وتوزيع هندسي ذكي في أرقى مواقع حي حديقة الأثير بالدمام.",
    ctaPrimary:  "استكشف مصفوفة الوحدات",
    ctaSecondary: "تواصل واتساب مباشرة",
    bgImage:     "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85",
    metrics: [
      { label: "إجمالي الوحدات",   value: "24 وحدة",    sub: "دوبلكس مستقل" },
      { label: "تنوع النماذج",     value: "6 نماذج",    sub: "من نموذج A إلى F" },
      { label: "المساحات المتوفرة", value: "227–427م²", sub: "أرضي وحوش وروف" },
      { label: "الخصوصية",         value: "100%",       sub: "مدخل وكراج وخزان مستقل" },
    ],
  },

  /* =========================================================
     3. المسافات والموقع (Location Distances)
     ========================================================= */
  locationDistances: [
    { place: "مركز الملك عبدالعزيز الثقافي (إثراء)",  duration: "16 دقيقة" },
    { place: "مطار الملك فهد الدولي",                  duration: "24 دقيقة" },
    { place: "المستشفى السعودي الألماني",              duration: "14 دقيقة" },
    { place: "كورنيش الدمام",                         duration: "18 دقيقة" },
  ],

  locationPerks: [
    { icon: "shield", title: "استقلالية كاملة", desc: "مدخل سيارة خاص، عداد كهرباء منفصل، وخزان مياه أرضي وعلوي مستقل لكل وحدة." },
    { icon: "bolt",   title: "تأسيسات تقنية سمارت هوم", desc: "تجهيزات ذكية للإنارة والتكييف، شبكة ألياف بصرية، وكاميرات مراقبة خارجية." },
    { icon: "home",   title: "واجهات معمارية راقية", desc: "حجر طبيعي مع زجاج استركتشر عازل حرارياً وتكسيات ديكورية مقاومة للرطوبة." },
    { icon: "lift",   title: "مصاعد راكبة مجهزة", desc: "مصاعد إيطالية راكبة في وحدات الروف والدوبلكس لراحة تامة لكافة أفراد العائلة." },
  ],

  /* =========================================================
     4. النماذج المعمارية الستة (Models A → F)
     ========================================================= */
  models: [
    {
      code:        "A",
      name:        "الدوبلكس الأرضي الرحب",
      subtitle:    "دوبلكس أرضي مع حوش وارتداد خاص وكراج مستقل",
      builtArea:   250.75,
      extraArea:   177,
      totalArea:   427.75,
      floors:      "دور أرضي + دور أول + حوش خارجي 177م²",
      rooms:       "3 غرف ماستر + مجلس ضيوف + صالة + غرفة عاملة",
      baths:       5,
      badge:       "الأكثر رحابة وحوش خاص",
      priceFrom:   "1,680,000 ر.س",
      image:       "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85",
      gallery: [
        { title: "الواجهة المعمارية الخارجية", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85" },
        { title: "صالة المعيشة والاستقبال الرحبة", url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85" },
        { title: "جناح النوم الرئيسي الماستر", url: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1400&q=85" },
        { title: "الحوش والارتداد الخاص 177م²", url: "https://images.unsplash.com/photo-1584738766473-61c083514bf4?auto=format&fit=crop&w=1400&q=85" },
      ],
      videoTour: {
        title: "جولة مرئية في نموذج A — الدوبلكس الأرضي الرحب",
        url: "https://assets.mixkit.co/videos/preview/mixkit-modern-interior-of-a-contemporary-home-41542-large.mp4",
        duration: "1:45 دقيقة",
        poster: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      },
      floorPlan: [
        { floor: "الدور الأرضي", spaces: "مجلس ضيوف (6.2 × 4.5 م)، صالة معيشة رئيسية (7.5 × 5.2 م)، مطبخ متكامل (4.0 × 3.8 م)، مستودع، حوش خاص 177 م²، كراج سيارة بمدخل خاص", area: "145.5 م²" },
        { floor: "الدور الأول", spaces: "جناح ماستر كينج (6.5 × 4.8 م) مع غرفة ملابس وحمام خاص، غرفتا نوم ماستر للأبناء (4.2 × 4.0 م)، صالة عائلية علوية (5.0 × 4.0 م)", area: "105.25 م²" },
        { floor: "الملحق والخدمات", spaces: "غرفة عاملة منزلية مستقلة بدورة مياه خاصة (3.2 × 3.0 م)، منطقة غسيل وتجفيف وكوي", area: "25.0 م²" },
      ],
      highlights: [
        "حوش وارتداد خاص 177م² للجلسة العائلية والحديقة الخاصة",
        "مجلس رجال مستقل بمدخل خاص ومغاسل رخامية",
        "جناح نوم رئيسي King مع غرفة ملابس وحمام خاص",
        "كراج داخلي بوابة أوتوماتيكية",
        "كافة الغرف بحمامات خاصة (All En-suite)",
        "غرفة عاملة منزلية مستقلة",
      ],
    },
    {
      code:        "B",
      name:        "الدوبلكس العلوي مع السطح",
      subtitle:    "إطلالة مفتوحة وجلسة سطح خاصة وتوزيع ذكي",
      builtArea:   310,
      extraArea:   0,
      totalArea:   310,
      floors:      "دور علوي + ملحق روف + جلسة سطح",
      rooms:       "3 غرف ماستر + مجلس ضيوف + صالتان",
      baths:       4,
      badge:       "إطلالة بانورامية وتراس سطح",
      priceFrom:   "1,450,000 ر.س",
      image:       "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=85",
      gallery: [
        { title: "الواجهة المعمارية الحديثة", url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=85" },
        { title: "صالة المعيشة البانورامية", url: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=85" },
        { title: "جناح النوم الماستر العلوي", url: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1400&q=85" },
        { title: "تراس السطح الخاص بالإطلالة المفتوحة", url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=85" },
      ],
      videoTour: {
        title: "جولة مرئية في نموذج B — الدوبلكس العلوي مع السطح",
        url: "https://assets.mixkit.co/videos/preview/mixkit-interior-of-a-luxury-modern-house-41544-large.mp4",
        duration: "1:30 دقيقة",
        poster: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      },
      floorPlan: [
        { floor: "الدور الأول", spaces: "مجلس ضيافة مستقل (5.8 × 4.2 م)، صالة معيشة مفتوحة (7.0 × 5.0 م)، مطبخ مجهز (4.0 × 3.5 م)، بلكونة زجاجية استركتشر", area: "135.0 م²" },
        { floor: "الدور الثاني", spaces: "جناح ماستر رئيسي (6.0 × 4.5 م) بحمام خاص، غرفتا نوم للأطفال (4.0 × 3.8 م)، صالة عائلية علوية (4.5 × 4.0 م)", area: "125.0 م²" },
        { floor: "ملحق السطح", spaces: "تراس فندقي مجهز لجلسات الشواء (8.0 × 6.0 م)، غرفة غسيل ومستودع (3.0 × 2.5 م)", area: "50.0 م²" },
      ],
      highlights: [
        "جلسة سطح Private Roof Terrace بإطلالة مفتوحة",
        "صالة عائلية علوية مهيأة كسينما منزلية",
        "مؤسس لمصعد راكب يصل لجميع الأدوار",
        "بلكونة زجاجية استركتشر",
        "موقف سيارة مظلل خاص",
      ],
    },
    {
      code:        "C",
      name:        "الدوبلكس الوسطي الذكي",
      subtitle:    "أناقة معمارية واستغلال هندسي عبقري للمساحات",
      builtArea:   265,
      extraArea:   0,
      totalArea:   265,
      floors:      "دورين متصلين + سطح مهيأ",
      rooms:       "3 غرف نوم + مجلس ضيوف + صالة",
      baths:       4,
      badge:       "إضاءة سماوية Sky Light",
      priceFrom:   "1,290,000 ر.س",
      image:       "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85",
      gallery: [
        { title: "الواجهة المعمارية الوسطية", url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85" },
        { title: "صالة المعيشة وفناء الإضاءة السماوية", url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=85" },
        { title: "جناح النوم الماستر الهادئ", url: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=1400&q=85" },
        { title: "المطبخ المودرن المفتوح", url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1400&q=85" },
      ],
      videoTour: {
        title: "جولة مرئية في نموذج C — الدوبلكس الوسطي الذكي",
        url: "https://assets.mixkit.co/videos/preview/mixkit-modern-living-room-with-large-windows-41545-large.mp4",
        duration: "1:20 دقيقة",
        poster: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      },
      floorPlan: [
        { floor: "الدور الأرضي", spaces: "مجلس استقبال (5.2 × 4.0 م)، دورة مياه، صالة معيشة مع فناء Sky Light (6.8 × 4.8 م)، مطبخ أمريكي عصري (3.8 × 3.5 م)، مخزن", area: "135.0 م²" },
        { floor: "الدور الأول", spaces: "جناح ماستر (5.5 × 4.2 م) بحمام خاص، غرفتا نوم (4.0 × 3.6 م)، دورة مياه عائلية، بلكونة استركتشر", area: "130.0 م²" },
      ],
      highlights: [
        "فناء داخلي Sky Light يضخ الإضاءة الطبيعية طوال النهار",
        "مطبخ أمريكي مفتوح مع قواطع زجاجية سحاب",
        "كفاءة عالية في استهلاك الطاقة والتكييف",
        "بلكونة زجاجية استركتشر",
      ],
    },
    {
      code:        "D",
      name:        "تاون هاوس الزاوية",
      subtitle:    "واجهتان معماريتان وإضاءة طبيعية وافرة",
      builtArea:   340,
      extraArea:   45,
      totalArea:   340,
      floors:      "أرضي + أول + ملحق روف + حديقة جانبية",
      rooms:       "4 أجنحة ماستر + مجلسان + غرفة عاملة",
      baths:       6,
      badge:       "موقع زاوية وكراج لسيارتين",
      priceFrom:   "1,750,000 ر.س",
      image:       "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=85",
      gallery: [
        { title: "الواجهة المعمارية المزدوجة (الزاوية)", url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=85" },
        { title: "صالة الاستقبال الملكية المزدوجة", url: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1400&q=85" },
        { title: "الجناح الرئيسي الملكي (Master Suite)", url: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1400&q=85" },
        { title: "الحديقة الجانبية الخاصة وكراج السيارتين", url: "https://images.unsplash.com/photo-1558036117-15d82a90b9b1?auto=format&fit=crop&w=1400&q=85" },
      ],
      videoTour: {
        title: "جولة مرئية في نموذج D — تاون هاوس الزاوية",
        url: "https://assets.mixkit.co/videos/preview/mixkit-large-luxury-house-with-a-pool-41543-large.mp4",
        duration: "2:00 دقيقة",
        poster: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
      },
      floorPlan: [
        { floor: "الدور الأرضي", spaces: "مدخلان مستقلان، مجلس رجال فخم (6.8 × 4.8 م)، صالة استقبال عائلية (8.0 × 5.5 م)، مطبخ رئيسي ومستودع، حديقة جانبية، كراج لسيارتين", area: "160.0 م²" },
        { floor: "الدور الأول", spaces: "3 أجنحة ماستر كاملة بحمامات خاصة (6.0 × 4.5 م، 4.5 × 4.2 م، 4.5 × 4.0 م)، صالة معيشة علوية، بلكونة زاوية بانورامية", area: "135.0 م²" },
        { floor: "ملحق الروف", spaces: "جناح ماستر رابع للضيوف (5.0 × 4.0 م)، غرفة عاملة منزلية مستقلة بدورة مياه، تراس سطحي فسيح", area: "45.0 م²" },
      ],
      highlights: [
        "موقع زاوية يوفر إطلالات مزدوجة وإضاءة وافرة",
        "حديقة جانبية خضراء بمدخل خاص إضافي",
        "كراج لسيارتين داخل حدود الوحدة",
        "4 أجنحة ماستر كاملة (Master Bedrooms)",
        "واجهات حجر الرياض مع إضاءة ليلية مخفية",
      ],
    },
    {
      code:        "E",
      name:        "الدوبلكس المدمج",
      subtitle:    "حلول سكنية مدروسة للعائلات الحديثة بلا مساحات مهدرة",
      builtArea:   227,
      extraArea:   0,
      totalArea:   227,
      floors:      "دورين متصلين + سطح خاص",
      rooms:       "3 غرف نوم + مجلس ضيوف + صالة",
      baths:       3,
      badge:       "أفضل قيمة استثمارية",
      priceFrom:   "1,180,000 ر.س",
      image:       "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=85",
      gallery: [
        { title: "الواجهة المعمارية المودرن المدمجة", url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=85" },
        { title: "الصالة المعيشية العصرية المفتوحة", url: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1400&q=85" },
        { title: "غرفة النوم الماستر المجهزة", url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=85" },
        { title: "جلسة السطح الخاصة الهادئة", url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=85" },
      ],
      videoTour: {
        title: "جولة مرئية في نموذج E — الدوبلكس المدمج",
        url: "https://assets.mixkit.co/videos/preview/mixkit-modern-interior-of-a-contemporary-home-41542-large.mp4",
        duration: "1:15 دقيقة",
        poster: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
      },
      floorPlan: [
        { floor: "الدور الأرضي", spaces: "مدخل مستقل، مجلس ضيوف (5.0 × 4.0 م)، صالة معيشة مفتوحة (6.2 × 4.5 م)، مطبخ عصري، مستودع ذكي تحت الدرج", area: "115.0 م²" },
        { floor: "الدور الأول", spaces: "جناح ماستر (5.2 × 4.0 م) بحمام خاص، غرفتا نوم للأطفال (3.8 × 3.5 م)، حمام عائلي، منطقة غسيل", area: "112.0 م²" },
      ],
      highlights: [
        "أعلى قيمة مقابل السعر في مشروع الشامخة",
        "تكلفة تشغيل وصيانة منخفضة",
        "نوافذ ممتدة من الأرض للسقف بالدور الأول",
        "موقف مجهز بشاحن سيارات كهربائية",
      ],
    },
    {
      code:        "F",
      name:        "الدوبلكس العلوي مع روف وحوش",
      subtitle:    "دوبلكس علوي مستقل مع روف وحوش / سطح — 3 أدوار",
      builtArea:   247,
      extraArea:   179,
      totalArea:   426,
      floors:      "3 أدوار (دور أول + دور ثانٍ + ملحق روف وسطح خاص)",
      rooms:       "3 غرف ماستر + مجلس ضيوف + صالتان + غرفة عاملة",
      baths:       5,
      badge:       "دوبلكس علوي مع روف وحوش (3 أدوار)",
      priceFrom:   "1,380,000 ر.س",
      image:       "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1400&q=85",
      gallery: [
        { title: "الواجهة المعمارية لـ 3 أدوار", url: "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1400&q=85" },
        { title: "صالة المعيشة العائلية الواسعة", url: "https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1400&q=85" },
        { title: "جناح الماستر الرئاسي الفاخر", url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1400&q=85" },
        { title: "تراس الروف الفندقي والحوش العلوي 179م²", url: "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1400&q=85" },
      ],
      videoTour: {
        title: "جولة مرئية في نموذج F — الدوبلكس العلوي مع روف وحوش (3 أدوار)",
        url: "https://assets.mixkit.co/videos/preview/mixkit-interior-of-a-luxury-modern-house-41544-large.mp4",
        duration: "1:55 دقيقة",
        poster: "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1200&q=80",
      },
      floorPlan: [
        { floor: "الدور الأول", spaces: "مجلس ضيافة مستقل (6.0 × 4.2 م) بدورة مياه خاصة، صالة معيشة عائلية فسيحة (7.2 × 5.0 م)، مطبخ عصري مجهز، مستودع", area: "125.0 م²" },
        { floor: "الدور الثاني", spaces: "جناح نوم رئيسي ماستر (6.2 × 4.6 م)، غرفتا نوم للأبناء (4.2 × 4.0 م)، صالة توزيع عائلية علوية، دورتان مياه", area: "122.0 م²" },
        { floor: "ملحق الروف والسطح", spaces: "تراس خارجي فندقي، حوش علوي وسطح خاص مهيأ للجلسات 179 م²، غرفة عاملة مع حمام، غرفة غسيل", area: "179.0 م² (روف وحوش)" },
      ],
      highlights: [
        "مساحة 247 + 179 م² (مسطح بناء 247 م² + روف وحوش خاص 179 م²)",
        "3 أدوار بتصميم معماري يحقق أقصى درجات الاستقلالية والخصوصية",
        "تراس روف فندقي وحوش علوي خاص مهيأ لجلسات الهواء الطلق",
        "مجلس رجال مستقل وصالتان للمعيشة العائلية",
        "تأسيس مصعد يخدم الأدوار بمرونة تامة",
        "موقف سيارة خاص مستقل",
      ],
    },
  ],

  /* =========================================================
     5. الوحدات السكنية الـ 24 (Units — Single Source of Truth)
     ========================================================= */
  units: [
    // الكتلة الأولى
    { id: 101, model: "A", area: "427.75م²", price: 1680000, status: "available" },
    { id: 102, model: "B", area: "310م²",    price: 1450000, status: "sold"      },
    { id: 103, model: "C", area: "265م²",    price: 1290000, status: "reserved"  },
    { id: 104, model: "D", area: "340م²",    price: 1750000, status: "available" },
    { id: 105, model: "E", area: "227م²",    price: 1180000, status: "sold"      },
    { id: 106, model: "F", area: "247 + 179 م²", price: 1380000, status: "reserved"  },
    // الكتلة الثانية
    { id: 107, model: "A", area: "427.75م²", price: 1680000, status: "available" },
    { id: 108, model: "B", area: "310م²",    price: 1450000, status: "sold"      },
    { id: 109, model: "C", area: "265م²",    price: 1290000, status: "sold"      },
    { id: 110, model: "D", area: "340م²",    price: 1750000, status: "available" },
    { id: 111, model: "E", area: "227م²",    price: 1180000, status: "reserved"  },
    { id: 112, model: "F", area: "247 + 179 م²", price: 1380000, status: "sold"      },
    // الكتلة الثالثة
    { id: 113, model: "A", area: "427.75م²", price: 1680000, status: "sold"      },
    { id: 114, model: "B", area: "310م²",    price: 1450000, status: "available" },
    { id: 115, model: "C", area: "265م²",    price: 1290000, status: "reserved"  },
    { id: 116, model: "D", area: "340م²",    price: 1750000, status: "sold"      },
    { id: 117, model: "E", area: "227م²",    price: 1180000, status: "sold"      },
    { id: 118, model: "F", area: "247 + 179 م²", price: 1380000, status: "available" },
    // الكتلة الرابعة
    { id: 119, model: "A", area: "427.75م²", price: 1680000, status: "reserved"  },
    { id: 120, model: "B", area: "310م²",    price: 1450000, status: "available" },
    { id: 121, model: "C", area: "265م²",    price: 1290000, status: "sold"      },
    { id: 122, model: "D", area: "340م²",    price: 1750000, status: "available" },
    { id: 123, model: "E", area: "227م²",    price: 1180000, status: "reserved"  },
    { id: 124, model: "F", area: "247 + 179 م²", price: 1380000, status: "available" },
  ],

  /* =========================================================
     6. المشاريع قيد التطوير (Upcoming Projects)
     ========================================================= */
  upcoming: [
    {
      title:      "مشروع ريفان السكني — الخبر (حي العزيزية)",
      type:       "فلل مستقلة فاخرة",
      status:     "أعمال الهيكل الإنشائي",
      launchDate: "الربع الثالث 2026",
      desc:       "18 فيلا بتصاميم مودرن، مساحات 380م²، مع مسابح ومصاعد خاصة.",
      image:      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80",
    },
    {
      title:      "مشروع سديم تاون هاوس — الدمام (حي الشاطئ)",
      type:       "تاون هاوس بحري مودرن",
      status:     "التخطيط والاعتمادات الهندسية",
      launchDate: "الربع الرابع 2026",
      desc:       "30 تاون هاوس بمجتمع مغلق وإطلالات بحرية وممرات مشاة وحدائق داخلية.",
      image:      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    },
  ],

  /* =========================================================
     7. روابط التنقل (Nav Links)
     ========================================================= */
  navLinks: [
    { label: "عن المشروع",         href: "#about-section"    },
    { label: "الموقع والمزايا",    href: "#location-section" },
    { label: "مصفوفة الوحدات",    href: "#matrix-section"   },
    { label: "النماذج (A–F)",      href: "#models-section"   },
    { label: "تواصل معنا",         href: "#contact-section"  },
  ],

  /* =========================================================
     8. روابط الفوتر السريعة (Footer Quick Links)
     ========================================================= */
  footerLinks: [
    { label: "عن المشروع",      href: "#about-section"    },
    { label: "مصفوفة الوحدات", href: "#matrix-section"   },
    { label: "النماذج السكنية", href: "#models-section"   },
    { label: "حجز وحدة",       href: "#booking-section"  },
    { label: "موقع المشروع",   href: "#location-section" },
    { label: "تواصل معنا",     href: "#contact-section"  },
  ],

};

// ضمان إتاحة الكائن عالمياً على نافذة المتصفح
if (typeof window !== "undefined") {
  window.DATA = DATA;
}
if (typeof global !== "undefined") {
  global.DATA = DATA;
}
