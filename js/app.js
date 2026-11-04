/**
 * تطبيق منصة ميسر للتطوير العقاري - Main Application Logic
 * تجربة مستخدم رقمية سعودية متكاملة
 */

// حالة التطبيق العامة
const AppState = {
  activePurpose: 'للبيع', // 'للبيع' | 'للإيجار' | 'استثمار تجاري'
  selectedCity: 'الرياض',
  selectedNeighborhood: 'الكل',
  selectedType: 'الكل',
  maxPrice: 100000000,
  requireFalLicense: true,
  requireSakani: false,
  requireBuildingCode: false,
  searchQuery: '',
  favorites: JSON.parse(localStorage.getItem('muyassar_favorites') || '[]'),
  currentModalProperty: null
};

// تهيئة التطبيق عند اكتمال تحميل المستند
document.addEventListener('DOMContentLoaded', () => {
  initLucideIcons();
  initCityAndNeighborhoodSelectors();
  initSearchFilters();
  initPropertiesGrid();
  initFavoritesSystem();
  initLeadCaptureForm();
  initAddPropertyModal();
  initPropertyDetailsModal();
});

// تهيئة أيقونات Lucide
function initLucideIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// تحديث الأحياء بناءً على المدينة المختارة
function initCityAndNeighborhoodSelectors() {
  const citySelect = document.getElementById('filter-city');
  const neighborhoodSelect = document.getElementById('filter-neighborhood');

  if (!citySelect || !neighborhoodSelect) return;

  function populateNeighborhoods(city) {
    neighborhoodSelect.innerHTML = '<option value="الكل">كافة الأحياء</option>';
    const neighborhoods = (typeof saudiLocations !== 'undefined' ? saudiLocations[city] : []) || [];
    neighborhoods.forEach(nh => {
      const option = document.createElement('option');
      option.value = nh;
      option.textContent = nh;
      neighborhoodSelect.appendChild(option);
    });
  }

  // التعبئة الأولية لمدينة الرياض
  populateNeighborhoods(AppState.selectedCity);

  citySelect.addEventListener('change', (e) => {
    AppState.selectedCity = e.target.value;
    AppState.selectedNeighborhood = 'الكل';
    populateNeighborhoods(AppState.selectedCity);
    applyFilters();
  });

  neighborhoodSelect.addEventListener('change', (e) => {
    AppState.selectedNeighborhood = e.target.value;
    applyFilters();
  });
}

// تهيئة فلاتر وألسنة البحث
function initSearchFilters() {
  // ألسنة الغرض: للبيع / للإيجار / استثمار تجاري
  const purposeTabs = document.querySelectorAll('.filter-purpose-tab');
  purposeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      purposeTabs.forEach(t => {
        t.classList.remove('active', 'bg-emerald-800', 'text-white', 'shadow-sm');
        t.classList.add('bg-slate-100', 'text-slate-600', 'hover:bg-slate-200');
      });
      tab.classList.remove('bg-slate-100', 'text-slate-600', 'hover:bg-slate-200');
      tab.classList.add('active', 'bg-emerald-800', 'text-white', 'shadow-sm');

      AppState.activePurpose = tab.dataset.purpose;
      applyFilters();
    });
  });

  // نوع العقار
  const typeSelect = document.getElementById('filter-type');
  if (typeSelect) {
    typeSelect.addEventListener('change', (e) => {
      AppState.selectedType = e.target.value;
      applyFilters();
    });
  }

  // السعر الأقصى
  const priceSelect = document.getElementById('filter-price');
  if (priceSelect) {
    priceSelect.addEventListener('change', (e) => {
      AppState.maxPrice = parseInt(e.target.value, 10) || 100000000;
      applyFilters();
    });
  }

  // مربعات التحديد السريعة (رخصة فال، التمويل، كود البناء)
  const toggleFal = document.getElementById('toggle-fal');
  if (toggleFal) {
    toggleFal.checked = AppState.requireFalLicense;
    toggleFal.addEventListener('change', (e) => {
      AppState.requireFalLicense = e.target.checked;
      applyFilters();
    });
  }

  const toggleSakani = document.getElementById('toggle-sakani');
  if (toggleSakani) {
    toggleSakani.addEventListener('change', (e) => {
      AppState.requireSakani = e.target.checked;
      applyFilters();
    });
  }

  const toggleBuildingCode = document.getElementById('toggle-building-code');
  if (toggleBuildingCode) {
    toggleBuildingCode.addEventListener('change', (e) => {
      AppState.requireBuildingCode = e.target.checked;
      applyFilters();
    });
  }

  // زر تطبيق البحث في الهيرو
  const heroSearchBtn = document.getElementById('hero-search-btn');
  if (heroSearchBtn) {
    heroSearchBtn.addEventListener('click', () => {
      applyFilters();
      const gridSection = document.getElementById('properties-section');
      if (gridSection) {
        gridSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // حقل البحث النصي السريع إن وُجد
  const keywordSearch = document.getElementById('filter-keyword');
  if (keywordSearch) {
    keywordSearch.addEventListener('input', (e) => {
      AppState.searchQuery = e.target.value.trim().toLowerCase();
      applyFilters();
    });
  }
}

// استخراج السعر الرقمي الصافي للعقار
function getNumericPrice(prop) {
  if (prop.numericPrice) return prop.numericPrice;
  if (typeof prop.price === 'number') return prop.price;
  const parsed = parseInt(String(prop.price).replace(/[^0-9]/g, ''), 10);
  return isNaN(parsed) ? 0 : parsed;
}

// تصفية العقارات بناءً على الحالة الحالية
function getFilteredProperties() {
  const dataset = (typeof properties !== 'undefined' ? properties : propertiesData) || [];

  return dataset.filter(prop => {
    // التحقق من الغرض
    if (AppState.activePurpose !== 'الكل' && prop.purpose && prop.purpose !== AppState.activePurpose) {
      return false;
    }

    // المدينة
    if (AppState.selectedCity !== 'الكل' && prop.city && prop.city !== AppState.selectedCity) {
      return false;
    }

    // الحي
    if (AppState.selectedNeighborhood !== 'الكل' && prop.neighborhood && prop.neighborhood !== AppState.selectedNeighborhood) {
      return false;
    }

    // نوع العقار
    if (AppState.selectedType !== 'الكل' && prop.type && prop.type !== AppState.selectedType) {
      return false;
    }

    // السعر الأقصى
    const numPrice = getNumericPrice(prop);
    if (numPrice > AppState.maxPrice) {
      return false;
    }

    // رخصة فال
    if (AppState.requireFalLicense) {
      const hasFalBadge = prop.badges && prop.badges.some(b => b.includes('فال'));
      if (!prop.falLicense && !hasFalBadge) {
        return false;
      }
    }

    // التمويل العقاري المدعوم
    if (AppState.requireSakani) {
      const hasBankBadge = prop.badges && prop.badges.some(b => b.includes('بنوك') || b.includes('تمويل'));
      if (!prop.isSakaniEligible && !hasBankBadge) {
        return false;
      }
    }

    // كود البناء السعودي وتأمين ملاذ
    if (AppState.requireBuildingCode) {
      const hasMalathBadge = prop.badges && prop.badges.some(b => b.includes('ملاذ') || b.includes('إتمام بناء') || b.includes('ضمان'));
      if (!prop.hasBuildingCode && !hasMalathBadge) {
        return false;
      }
    }

    // البحث النصي بالكلمة
    if (AppState.searchQuery) {
      const hay = `${prop.title} ${prop.location || ''} ${prop.neighborhood || ''} ${prop.city || ''} ${prop.description || ''}`.toLowerCase();
      if (!hay.includes(AppState.searchQuery)) {
        return false;
      }
    }

    return true;
  });
}

// تطبيق الفلاتر وإعادة رسم الشبكة
function applyFilters() {
  const filtered = getFilteredProperties();
  renderPropertiesGrid(filtered);

  // تحديث عداد العقارات المتاحة
  const countEl = document.getElementById('results-count');
  if (countEl) {
    countEl.textContent = `${filtered.length} عقار متاح`;
  }
}

// تهيئة ورسم شبكة العقارات
function initPropertiesGrid() {
  applyFilters();
}

// دالة إنشاء كرت العقار
function createPropertyCard(prop) {
  const propIdStr = String(prop.id);
  const isFavorite = AppState.favorites.includes(propIdStr);
  const numPrice = getNumericPrice(prop);
  
  // تنسيق السعر
  const formattedPrice = typeof prop.price === 'string' && prop.price.includes('ر.س')
    ? prop.price
    : `${new Intl.NumberFormat('en-US').format(numPrice)} ر.س`;

  // استخراج المواصفات من specs أو الخصائص المباشرة
  const areaVal = prop.specs?.area || (prop.area ? `${prop.area} م²` : '—');
  const bedsVal = prop.specs?.beds ?? prop.bedrooms ?? '—';
  const bathsVal = prop.specs?.baths ?? prop.bathrooms ?? '—';
  const extraFeature = prop.specs?.street || prop.specs?.parking || prop.specs?.extras || (prop.parking ? `موقف ${prop.parking} سيارات` : null);

  // استخراج رخصة فال
  let falLabel = prop.falLicense ? `رخصة فال: ${prop.falLicense}` : '';
  if (!falLabel && prop.badges) {
    const found = prop.badges.find(b => b.includes('فال'));
    if (found) falLabel = found;
  }
  if (!falLabel) falLabel = 'رخصة فال معتمدة';

  // رقم الواتساب للوسيط
  const waText = encodeURIComponent(`السلام عليكم، أود الاستفسار عن العقار المعروض بمنصة ميسر: "${prop.title}" بـ ${prop.location || prop.neighborhood}، السعر: ${formattedPrice}. ${falLabel}`);
  const waUrl = `https://api.whatsapp.com/send?text=${waText}`;

  // حساب سعر المتر التقديري
  const rawAreaNum = parseInt(String(areaVal).replace(/[^0-9]/g, ''), 10);
  const perMeterStr = (rawAreaNum && numPrice) ? `${new Intl.NumberFormat('en-US').format(Math.round(numPrice / rawAreaNum))} ر.س/م²` : null;

  return `
    <article class="property-card bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group">
      <!-- صورة العقار مع الشارات التوثيقية -->
      <div class="relative w-full h-64 overflow-hidden bg-slate-100">
        <img 
          src="${prop.primaryImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'}" 
          alt="${prop.title}" 
          loading="lazy"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onerror="this.src='https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'"
        />

        <!-- تدرج ظل سفلي لقراءة النص -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none"></div>

        <!-- الشارات العلوية -->
        <div class="absolute top-3.5 right-3.5 flex flex-wrap gap-1.5 items-center z-10">
          <span class="inline-flex items-center gap-1 bg-emerald-900/90 backdrop-blur-md text-emerald-100 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-700/50">
            <i data-lucide="shield-check" class="w-3.5 h-3.5 text-emerald-400"></i>
            ${falLabel}
          </span>
          ${prop.featured ? `
            <span class="bg-amber-600/90 backdrop-blur-md text-amber-50 text-xs font-medium px-2 py-1 rounded-full">
              مميز
            </span>
          ` : ''}
        </div>

        <!-- زر المفضلة -->
        <button 
          type="button" 
          onclick="toggleFavorite('${propIdStr}')"
          title="حفظ في المفضلة"
          aria-label="حفظ في المفضلة"
          class="favorite-btn absolute top-3.5 left-3.5 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white text-slate-700 hover:text-rose-600 flex items-center justify-center transition-colors shadow-sm z-10 ${isFavorite ? 'text-rose-600 !bg-rose-50' : ''}"
        >
          <i data-lucide="heart" class="w-4 h-4 ${isFavorite ? 'fill-current' : ''}"></i>
        </button>

        <!-- الشارة السفلية: الصك ونوع العقار -->
        <div class="absolute bottom-3 right-3 left-3 flex justify-between items-end text-white text-xs z-10">
          <span class="inline-flex items-center gap-1 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-md">
            <i data-lucide="file-check-2" class="w-3.5 h-3.5 text-emerald-400"></i>
            صك إلكتروني موثق
          </span>
          <span class="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-slate-100 font-medium">
            ${prop.type || 'عقار سكني'}
          </span>
        </div>
      </div>

      <!-- محتوى الكرت -->
      <div class="p-5 flex-1 flex flex-col justify-between">
        <div>
          <!-- الحي والمدينة -->
          <div class="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
            <i data-lucide="map-pin" class="w-3.5 h-3.5 text-emerald-700 shrink-0"></i>
            <span class="font-medium text-slate-700">${prop.location || `${prop.neighborhood}، ${prop.city}`}</span>
          </div>

          <!-- عنوان العقار -->
          <h3 class="text-base font-bold text-slate-900 leading-snug hover:text-emerald-800 transition-colors cursor-pointer mb-2.5" onclick="openPropertyModal('${propIdStr}')">
            ${prop.title}
          </h3>

          <!-- المواصفات الأساسية (المساحة، الغرف، دورات المياه) -->
          <div class="grid grid-cols-3 gap-2 py-2.5 my-2 border-y border-slate-100 text-slate-700 text-xs">
            <div class="flex items-center gap-1.5">
              <i data-lucide="maximize" class="w-4 h-4 text-emerald-700"></i>
              <div>
                <span class="font-bold text-slate-900">${areaVal}</span>
                <span class="text-[10px] text-slate-400 block">المساحة</span>
              </div>
            </div>
            <div class="flex items-center gap-1.5">
              <i data-lucide="bed" class="w-4 h-4 text-emerald-700"></i>
              <div>
                <span class="font-bold text-slate-900">${bedsVal}</span>
                <span class="text-[10px] text-slate-400 block">غرف نوم</span>
              </div>
            </div>
            <div class="flex items-center gap-1.5">
              <i data-lucide="bath" class="w-4 h-4 text-emerald-700"></i>
              <div>
                <span class="font-bold text-slate-900">${bathsVal}</span>
                <span class="text-[10px] text-slate-400 block">دورات مياه</span>
              </div>
            </div>
          </div>

          <!-- ميزة إضافية مخصصة (الشارع أو الموقف أو المسبح) -->
          ${extraFeature ? `
            <div class="text-[11px] text-slate-600 flex items-center gap-1.5 mb-2.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100">
              <i data-lucide="sparkles" class="w-3.5 h-3.5 text-emerald-700 shrink-0"></i>
              <span class="font-medium text-slate-800">${extraFeature}</span>
            </div>
          ` : ''}

          <!-- وسوم badges الواقعية المعتمدة -->
          <div class="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-700 mb-4">
            ${prop.badges && prop.badges.length > 0 ? prop.badges.map((badge, idx) => `
              <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-medium ${idx === 0 ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-700'}">
                <i data-lucide="${idx === 0 ? 'shield-check' : 'check'}" class="w-3 h-3 ${idx === 0 ? 'text-emerald-600' : 'text-slate-500'}"></i>
                ${badge}
              </span>
            `).join('') : `
              <span class="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                <i data-lucide="check" class="w-3 h-3 text-emerald-600"></i>
                صك إلكتروني موثق
              </span>
            `}
          </div>
        </div>

        <!-- السعر وأزرار التفاعل -->
        <div class="pt-3 border-t border-slate-100">
          <div class="flex items-baseline justify-between mb-3">
            <div>
              <span class="text-[11px] text-slate-500 block">السعر المطلوب</span>
              <div class="flex items-baseline gap-1">
                <span class="text-xl font-black text-emerald-900 tracking-tight">${formattedPrice}</span>
              </div>
            </div>
            ${perMeterStr ? `
              <div class="text-left">
                <span class="text-[10px] text-slate-400 block">سعر المتر التقديري</span>
                <span class="text-xs font-semibold text-slate-600">${perMeterStr}</span>
              </div>
            ` : ''}
          </div>

          <!-- أزرار الإجراءات: "معاينة العقار" و "تواصل عبر واتساب" -->
          <div class="grid grid-cols-2 gap-2">
            <button 
              type="button" 
              onclick="openPropertyModal('${propIdStr}')"
              class="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-emerald-800 text-emerald-900 hover:bg-emerald-50 text-xs font-bold transition-colors"
            >
              <i data-lucide="eye" class="w-4 h-4"></i>
              معاينة العقار
            </button>
            <a 
              href="${waUrl}" 
              target="_blank" 
              rel="noopener noreferrer"
              class="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-all shadow-sm"
            >
              <i data-lucide="message-circle" class="w-4 h-4"></i>
              تواصل عبر واتساب
            </a>
          </div>
        </div>
      </div>
    </article>
  `;
}

// رسم شبكة العقارات في DOM
function renderPropertiesGrid(props) {
  const container = document.getElementById('properties-grid');
  if (!container) return;

  if (props.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-16 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-8">
        <div class="w-16 h-16 rounded-full bg-slate-200 text-slate-500 mx-auto flex items-center justify-center mb-4">
          <i data-lucide="search-x" class="w-8 h-8"></i>
        </div>
        <h4 class="text-lg font-bold text-slate-800 mb-1">لا توجد عقارات تطابق معايير البحث الحالية</h4>
        <p class="text-slate-500 text-sm max-w-md mx-auto mb-5">
          يمكنك تعديل خيارات التصفية أو تسجيل طلبك العقاري الخاص وسيتولى فريقنا توفيره لك.
        </p>
        <button 
          onclick="resetFilters()" 
          class="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-800 text-white rounded-xl text-sm font-semibold hover:bg-emerald-900 transition-colors"
        >
          <i data-lucide="rotate-ccw" class="w-4 h-4"></i>
          إعادة ضبط الفلاتر
        </button>
      </div>
    `;
    initLucideIcons();
    return;
  }

  container.innerHTML = props.map(p => createPropertyCard(p)).join('');
  initLucideIcons();
}

// إعادة ضبط الفلاتر
window.resetFilters = function() {
  AppState.selectedCity = 'الرياض';
  AppState.selectedNeighborhood = 'الكل';
  AppState.selectedType = 'الكل';
  AppState.maxPrice = 100000000;
  AppState.activePurpose = 'للبيع';
  AppState.requireFalLicense = true;
  AppState.requireSakani = false;
  AppState.requireBuildingCode = false;
  AppState.searchQuery = '';

  const citySelect = document.getElementById('filter-city');
  if (citySelect) citySelect.value = 'الرياض';

  const typeSelect = document.getElementById('filter-type');
  if (typeSelect) typeSelect.value = 'الكل';

  const priceSelect = document.getElementById('filter-price');
  if (priceSelect) priceSelect.value = '100000000';

  const toggleFal = document.getElementById('toggle-fal');
  if (toggleFal) toggleFal.checked = true;

  const toggleSakani = document.getElementById('toggle-sakani');
  if (toggleSakani) toggleSakani.checked = false;

  const toggleBuildingCode = document.getElementById('toggle-building-code');
  if (toggleBuildingCode) toggleBuildingCode.checked = false;

  initCityAndNeighborhoodSelectors();
  applyFilters();
};

// نظام المفضلة
function initFavoritesSystem() {
  updateFavoritesBadge();
}

window.toggleFavorite = function(propertyId) {
  const idStr = String(propertyId);
  const idx = AppState.favorites.indexOf(idStr);
  if (idx > -1) {
    AppState.favorites.splice(idx, 1);
    showToast('تمت إزالة العقار من قائمة المحفوظات', 'info');
  } else {
    AppState.favorites.push(idStr);
    showToast('تم حفظ العقار في قائمة مفضلاتك', 'success');
  }

  localStorage.setItem('muyassar_favorites', JSON.stringify(AppState.favorites));
  updateFavoritesBadge();
  applyFilters();
};

function updateFavoritesBadge() {
  const badge = document.getElementById('favorites-badge');
  if (badge) {
    badge.textContent = AppState.favorites.length;
    badge.classList.toggle('hidden', AppState.favorites.length === 0);
  }
}

// فتح نافذة المعاينة التفاعلية للعقار
// فتح نافذة المعاينة التفاعلية للعقار بتصميم هادئ ومقاسات مدروسة ومتوازنة
window.openPropertyModal = function(propertyId) {
  const dataset = (typeof properties !== 'undefined' ? properties : propertiesData) || [];
  const prop = dataset.find(p => String(p.id) === String(propertyId));
  if (!prop) return;

  AppState.currentModalProperty = prop;
  const modal = document.getElementById('property-modal');
  const modalBody = document.getElementById('property-modal-body');

  if (!modal || !modalBody) return;

  const numPrice = getNumericPrice(prop);
  const formattedPrice = typeof prop.price === 'string' && prop.price.includes('ر.س')
    ? prop.price
    : new Intl.NumberFormat('en-US').format(numPrice) + ' ر.س';

  const waText = encodeURIComponent(`السلام عليكم، أود الاستفسار وحجز موعد لمعاينة العقار المعروض بمنصة ميسر: "${prop.title}" بـ ${prop.location || prop.neighborhood}، السعر: ${formattedPrice}. ${falLabel}`);
  const waUrl = `https://api.whatsapp.com/send?text=${waText}`;

  const areaVal = prop.specs?.area || (prop.area ? (prop.area + ' م²') : '—');
  const bedsVal = prop.specs?.beds ?? prop.bedrooms ?? '—';
  const bathsVal = prop.specs?.baths ?? prop.bathrooms ?? '—';
  const extraFeature = prop.specs?.street || prop.specs?.parking || prop.specs?.extras || (prop.parking ? ('موقف ' + prop.parking + ' سيارات') : 'مكتمل المرافق');

  // حساب سعر المتر التقديري
  const rawAreaNum = parseInt(String(areaVal).replace(/[^0-9]/g, ''), 10);
  const perMeterStr = (rawAreaNum && numPrice) ? (new Intl.NumberFormat('en-US').format(Math.round(numPrice / rawAreaNum)) + ' ر.س/م²') : null;

  modalBody.innerHTML = `
    <!-- 1. شريط علوي هادئ وأنيق -->
    <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
      <div class="flex items-center gap-2 text-xs text-slate-500">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-bold">
          <i data-lucide="shield-check" class="w-3.5 h-3.5 text-emerald-600"></i>
          ${falLabel}
        </span>
        <span class="text-slate-300">•</span>
        <span class="font-medium text-slate-600">${prop.location || (prop.neighborhood + '، ' + prop.city)}</span>
      </div>

      <!-- زر إغلاق ناعم -->
      <button 
        type="button" 
        onclick="closePropertyModal()" 
        aria-label="إغلاق النافذة"
        class="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
      >
        <i data-lucide="x" class="w-4 h-4"></i>
      </button>
    </div>

    <!-- 2. محتوى النافذة القابل للتمرير بسلاسة وهدوء وبأبعاد مريحة -->
    <div class="overflow-y-auto modal-scroll p-5 sm:p-7 space-y-6 flex-1 bg-white">
      
      <!-- معرض الصور الرئيسي -->
      <div class="space-y-2.5">
        <div class="relative w-full h-56 sm:h-72 rounded-2xl overflow-hidden bg-slate-900 shadow-sm border border-slate-100">
          <img 
            id="modal-main-image" 
            src="${prop.primaryImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'}" 
            alt="${prop.title}" 
            class="w-full h-full object-cover transition-all duration-300"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
          
          <!-- شارات أسفل الصورة -->
          <div class="absolute bottom-3 right-3 left-3 flex items-center justify-between text-white text-xs z-10">
            <span class="inline-flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-mono border border-white/10">
              <i data-lucide="file-check" class="w-3.5 h-3.5 text-emerald-400"></i>
              صك إلكتروني: ${prop.deedNumber || 'موثق بالبورصة العقارية'}
            </span>
            <span class="bg-emerald-900/90 text-emerald-200 border border-emerald-700/50 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-semibold">
              ${prop.type || 'عقار فاخر'}
            </span>
          </div>
        </div>

        <!-- شريط مصغرات الصور إن وُجدت -->
        ${prop.gallery && prop.gallery.length > 1 ? `
          <div class="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5">
            ${prop.gallery.map((img, i) => `
              <button 
                type="button"
                onclick="document.getElementById('modal-main-image').src='${img}'"
                class="w-16 h-12 rounded-xl overflow-hidden shrink-0 border-2 border-transparent hover:border-emerald-600 focus:border-emerald-600 transition-all opacity-80 hover:opacity-100"
              >
                <img src="${img}" alt="معاينة ${i+1}" class="w-full h-full object-cover" />
              </button>
            `).join('')}
          </div>
        ` : ''}
      </div>

      <!-- العنوان والسعر المطلوب -->
      <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 class="text-xl sm:text-2xl font-bold font-heading text-slate-900 leading-snug">
            ${prop.title}
          </h2>
          <div class="flex items-center gap-1.5 text-xs text-slate-500 mt-1.5">
            <i data-lucide="map-pin" class="w-3.5 h-3.5 text-emerald-700"></i>
            <span>${prop.location || (prop.neighborhood + '، ' + prop.city)}</span>
            ${prop.locationDetail ? ('<span class="text-slate-300">•</span><span class="text-slate-500">' + prop.locationDetail + '</span>') : ''}
          </div>
        </div>

        <!-- بطاقة السعر المهدئة -->
        <div class="sm:text-left bg-emerald-50/70 border border-emerald-200/80 px-4 py-2.5 rounded-2xl shrink-0">
          <span class="text-[11px] text-slate-500 block">السعر المطلوب</span>
          <div class="text-2xl font-black text-emerald-900 font-heading">
            ${formattedPrice}
          </div>
          ${perMeterStr ? ('<span class="text-[10px] text-emerald-700/80 block font-semibold mt-0.5">' + perMeterStr + '</span>') : ''}
        </div>
      </div>

      <!-- شارات التوثيق والضمانات الرسمية -->
      ${prop.badges && prop.badges.length > 0 ? `
        <div class="flex flex-wrap items-center gap-2">
          ${prop.badges.map((b, idx) => `
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${idx === 0 ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-700 border border-slate-200/60'}">
              <i data-lucide="${idx === 0 ? 'shield-check' : 'check'}" class="w-3.5 h-3.5 ${idx === 0 ? 'text-emerald-700' : 'text-slate-500'}"></i>
              ${b}
            </span>
          `).join('')}
        </div>
      ` : ''}

      <!-- المواصفات الأساسية المنسقة بأبعاد متوازنة -->
      <div>
        <h4 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <i data-lucide="layout-grid" class="w-3.5 h-3.5 text-emerald-700"></i>
          المواصفات الفنية المعتمدة
        </h4>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-slate-700 text-sm">
          <div class="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-150/80 flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-white text-emerald-800 flex items-center justify-center shrink-0 border border-slate-100 shadow-2xs">
              <i data-lucide="maximize" class="w-4 h-4"></i>
            </div>
            <div>
              <span class="text-[11px] text-slate-400 block">المساحة</span>
              <strong class="text-slate-900 font-bold text-sm">${areaVal}</strong>
            </div>
          </div>

          <div class="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-150/80 flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-white text-emerald-800 flex items-center justify-center shrink-0 border border-slate-100 shadow-2xs">
              <i data-lucide="bed" class="w-4 h-4"></i>
            </div>
            <div>
              <span class="text-[11px] text-slate-400 block">غرف النوم</span>
              <strong class="text-slate-900 font-bold text-sm">${bedsVal} غرف</strong>
            </div>
          </div>

          <div class="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-150/80 flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-white text-emerald-800 flex items-center justify-center shrink-0 border border-slate-100 shadow-2xs">
              <i data-lucide="bath" class="w-4 h-4"></i>
            </div>
            <div>
              <span class="text-[11px] text-slate-400 block">دورات المياه</span>
              <strong class="text-slate-900 font-bold text-sm">${bathsVal} دورات</strong>
            </div>
          </div>

          <div class="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-150/80 flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-white text-emerald-800 flex items-center justify-center shrink-0 border border-slate-100 shadow-2xs">
              <i data-lucide="sparkles" class="w-4 h-4"></i>
            </div>
            <div class="truncate">
              <span class="text-[11px] text-slate-400 block">الميزة الإضافية</span>
              <strong class="text-slate-900 font-bold text-xs truncate block" title="${extraFeature}">${extraFeature}</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- نبذة عن العقار -->
      <div class="bg-slate-50/60 p-4 rounded-2xl border border-slate-100">
        <h4 class="text-xs font-bold text-slate-700 mb-1.5">الوصف العقاري</h4>
        <p class="text-slate-600 text-xs sm:text-sm leading-relaxed">
          ${prop.description || 'عقار سكني متميز بموقع استراتيجي هادئ مكتمل البنية التحتية، تم فحصه والتأكد من سلامته الإنشائية ومطابقته لكود البناء السعودي مع صك إلكتروني جاهز للإفراغ المباشر عبر البورصة العقارية.'}
        </p>
      </div>

      <!-- المزايا التفصيلية والضمانات -->
      ${prop.features && prop.features.length > 0 ? `
        <div>
          <h4 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <i data-lucide="badge-check" class="w-3.5 h-3.5 text-emerald-700"></i>
            المزايا والضمانات المشمولة
          </h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
            ${prop.features.map(f => `
              <div class="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                <i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-emerald-700 shrink-0"></i>
                <span class="font-medium text-slate-800">${f}</span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- الامتثال والتراخيص النظامية -->
      <div class="p-3.5 rounded-2xl bg-slate-100/80 text-xs text-slate-600 border border-slate-200/70">
        <div class="flex flex-wrap items-center justify-between gap-2 text-[11px]">
          <span>رخصة فال للتسويق: <strong class="text-slate-800 font-mono">${prop.falLicense || '1200034918'}</strong></span>
          <span>ترخيص الإعلان: <strong class="text-slate-800 font-mono">${prop.adLicense || '7200194821'}</strong></span>
          <span>الصك الإلكتروني: <strong class="text-slate-800 font-mono">${prop.deedNumber || 'موثق'}</strong></span>
        </div>
      </div>

    </div>

    <!-- 3. شريط إجراءات ثابت في الأسفل (Sticky Footer) -->
    <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
      
      <!-- معلومات الاستشارة والوساطة المعتمدة -->
      <div class="flex items-center gap-3 w-full sm:w-auto">
        <div class="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center shrink-0 shadow-sm">
          <i data-lucide="shield-check" class="w-5 h-5 text-emerald-300"></i>
        </div>
        <div>
          <div class="font-bold text-slate-900 text-xs sm:text-sm">المستشار العقاري المختص</div>
          <div class="text-[11px] text-slate-500">وساطة وتسويق معتمد • رخصة فال</div>
        </div>
      </div>

      <!-- أزرار الإجراءات الرسمية -->
      <div class="flex items-center gap-2 w-full sm:w-auto">
        <button 
          type="button"
          onclick="closePropertyModal(); document.getElementById('lead-capture-section').scrollIntoView({behavior:'smooth'});"
          class="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors shadow-2xs"
        >
          <i data-lucide="calendar-check" class="w-3.5 h-3.5 text-slate-600"></i>
          <span>طلب معاينة ميدانية</span>
        </button>
        <a 
          href="${waUrl}" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-all shadow-sm"
        >
          <i data-lucide="message-circle" class="w-4 h-4 text-emerald-300"></i>
          <span>محادثة واتساب</span>
        </a>
      </div>

    </div>
  `;

  modal.classList.remove('hidden');
  document.body.classList.add('overflow-hidden');
  initLucideIcons();
};

window.closePropertyModal = function() {
  const modal = document.getElementById('property-modal');
  if (modal) {
    modal.classList.add('hidden');
  }
  document.body.classList.remove('overflow-hidden');
};

function initPropertyDetailsModal() {
  const modal = document.getElementById('property-modal');
  if (!modal) return;

  // إغلاق عند النقر على الخلفية
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closePropertyModal();
    }
  });

  // إغلاق عبر زر ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closePropertyModal();
      closeAddPropertyModal();
    }
  });
}

// نموذج CRM طلب عقار خاص
function initLeadCaptureForm() {
  const form = document.getElementById('lead-capture-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('lead-name');
    const phoneInput = document.getElementById('lead-phone');

    if (!nameInput.value || !phoneInput.value) {
      showToast('يرجى كتابة الاسم ورقم الجوال للتواصل', 'error');
      return;
    }

    // توليد رقم طلب مرجعي سعودي واقعي
    const ticketId = 'REQ-' + Math.floor(100000 + Math.random() * 900000);

    // حالة النجاح في الكرت
    form.innerHTML = `
      <div class="text-center py-8 space-y-4">
        <div class="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
          <i data-lucide="check" class="w-8 h-8"></i>
        </div>
        <h3 class="text-xl font-black text-slate-900">تم تسجيل طلبك العقاري بنجاح</h3>
        <p class="text-slate-600 text-sm max-w-md mx-auto">
          شكراً لك، أ. <span class="font-bold text-slate-900">${nameInput.value}</span>. تم تعيين مستشارك العقاري المختص وسيتواصل معك خلال 24 ساعة لتقديم الخيارات المطابقة.
        </p>
        <div class="inline-block bg-slate-100 px-4 py-2 rounded-lg text-xs font-mono font-bold text-slate-700">
          رقم الطلب المرجعي: ${ticketId}
        </div>
        <div class="pt-4">
          <a 
            href="https://api.whatsapp.com/send?text=${encodeURIComponent('السلام عليكم، سجلت طلبي العقاري برقم ' + ticketId + ' وأود المتابعة.')}"
            target="_blank" 
            class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-800 text-white font-bold text-sm hover:bg-emerald-900 transition-colors shadow-sm"
          >
            <i data-lucide="message-circle" class="w-4 h-4"></i>
            متابعة فورية عبر واتساب
          </a>
        </div>
      </div>
    `;
    initLucideIcons();
    showToast(`تم تسجيل طلبك برقم ${ticketId}`, 'success');
  });
}

// نافذة أضف عقارك كمعلن / وسيط
function initAddPropertyModal() {
  const modal = document.getElementById('add-property-modal');
  const openButtons = document.querySelectorAll('.open-add-property-btn');
  const form = document.getElementById('add-property-form');

  if (!modal) return;

  openButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      modal.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
    });
  });

  window.closeAddPropertyModal = function() {
    modal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  };

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeAddPropertyModal();
    }
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      closeAddPropertyModal();
      showToast('تم استلام طلب إضافة العقار وجارٍ مراجعة رخصة فال والصك الإلكتروني', 'success');
      form.reset();
    });
  }
}

// إشعارات التوست الأنيقة
window.showToast = function(message, type = 'info') {
  const toastContainer = document.getElementById('toast-container');
  if (!toastContainer) return;

  const toast = document.createElement('div');
  const typeStyles = {
    success: 'bg-emerald-900 text-white border-emerald-700',
    error: 'bg-rose-900 text-white border-rose-700',
    info: 'bg-slate-900 text-white border-slate-700'
  };

  const icons = {
    success: 'check-circle-2',
    error: 'alert-circle',
    info: 'info'
  };

  toast.className = `flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border text-xs font-semibold transform transition-all duration-300 translate-y-4 opacity-0 pointer-events-auto ${typeStyles[type] || typeStyles.info}`;
  toast.innerHTML = `
    <i data-lucide="${icons[type] || 'info'}" class="w-4 h-4 shrink-0"></i>
    <span class="flex-1">${message}</span>
  `;

  toastContainer.appendChild(toast);
  initLucideIcons();

  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-4', 'opacity-0');
  });

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 4000);
};
