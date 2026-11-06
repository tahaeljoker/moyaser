/**
 * app.js - المنطق التفاعلي لمنصة تاون هاوس الشامخة (الدمام)
 * المطور العقاري: مُيسر للتطوير العقاري
 */

document.addEventListener('DOMContentLoaded', () => {
  initProjectStatusTabs();
  initUnitMatrix();
  initModelsShowcase();
  initBookingForm();
});

/* ==========================================================================
   1. تبويبات حالة المشاريع (جاهز للبيع / قيد التطوير)
   ========================================================================== */
function initProjectStatusTabs() {
  const tabs = document.querySelectorAll('.status-tab');
  const readySection = document.getElementById('ready-units-container');
  const upcomingSection = document.getElementById('upcoming-projects-container');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const target = tab.dataset.target;
      if (target === 'ready') {
        if (readySection) readySection.classList.remove('hidden');
        if (upcomingSection) upcomingSection.classList.add('hidden');
      } else {
        if (readySection) readySection.classList.add('hidden');
        if (upcomingSection) {
          upcomingSection.classList.remove('hidden');
          renderUpcomingProjects();
        }
      }
    });
  });
}

function renderUpcomingProjects() {
  const container = document.getElementById('upcoming-projects-grid');
  if (!container || container.innerHTML.trim() !== '') return;

  container.innerHTML = upcomingProjects.map(p => `
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col transition hover:shadow-md">
      <div class="relative h-56 overflow-hidden">
        <img src="${p.image}" alt="${p.title}" class="w-full h-full object-cover">
        <div class="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-amber-300 text-xs px-3 py-1.5 rounded-lg font-bold">
          ${p.status}
        </div>
      </div>
      <div class="p-6 flex flex-col flex-1 justify-between">
        <div>
          <span class="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md inline-block mb-2">
            موعد الطرح: ${p.launchDate}
          </span>
          <h3 class="text-lg font-bold text-slate-900 font-heading mb-2">${p.title}</h3>
          <p class="text-xs text-slate-600 leading-relaxed mb-4">${p.desc}</p>
        </div>
        <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span class="text-xs text-slate-500 font-medium">${p.type}</span>
          <a href="https://api.whatsapp.com/send?phone=966500550223&text=${encodeURIComponent('السلام عليكم، أود تسجيل اهتمامي بمشاريع مُيسر قيد التطوير: ' + p.title)}"
             target="_blank" rel="noopener noreferrer"
             class="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950">
            <span>سجّل اهتمامك المبكر</span>
            <svg class="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  `).join('');
}

/* ==========================================================================
   2. مصفوفة الـ 24 وحدة السكنية التفاعلية (24-Unit Matrix)
   ========================================================================== */
let currentStatusFilter = 'all';
let currentModelFilter = 'all';

function initUnitMatrix() {
  updateMatrixStats();
  renderUnitMatrix();

  // فلاتر الحالة (الكل / متاح / محجوز / مباع)
  const statusButtons = document.querySelectorAll('.matrix-status-btn');
  statusButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      statusButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentStatusFilter = btn.dataset.status;
      renderUnitMatrix();
    });
  });

  // تصفية النماذج في المصفوفة (الكل / A..F)
  const modelSelect = document.getElementById('matrix-model-select');
  if (modelSelect) {
    modelSelect.addEventListener('change', (e) => {
      currentModelFilter = e.target.value;
      renderUnitMatrix();
    });
  }
}

function updateMatrixStats() {
  const total = unitsData.length;
  const available = unitsData.filter(u => u.status === 'available').length;
  const reserved = unitsData.filter(u => u.status === 'reserved').length;
  const sold = unitsData.filter(u => u.status === 'sold').length;

  const countTotalEl = document.getElementById('stat-total-units');
  const countAvailEl = document.getElementById('stat-available-units');
  const countResvEl = document.getElementById('stat-reserved-units');
  const countSoldEl = document.getElementById('stat-sold-units');

  if (countTotalEl) countTotalEl.textContent = total;
  if (countAvailEl) countAvailEl.textContent = available;
  if (countResvEl) countResvEl.textContent = reserved;
  if (countSoldEl) countSoldEl.textContent = sold;
}

function renderUnitMatrix() {
  const container = document.getElementById('units-matrix-grid');
  if (!container) return;

  const filtered = unitsData.filter(unit => {
    const matchesStatus = (currentStatusFilter === 'all') || (unit.status === currentStatusFilter);
    const matchesModel = (currentModelFilter === 'all') || (unit.model === currentModelFilter);
    return matchesStatus && matchesModel;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-12 text-center bg-white rounded-2xl border border-slate-200">
        <svg class="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
        </svg>
        <p class="text-sm font-bold text-slate-700 font-heading">لا توجد وحدات مطابقة لمعايير التصفية الحالية</p>
        <p class="text-xs text-slate-500 mt-1">جرّب تغيير حالة الفلتر أو اختيار نموذج آخر</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(unit => {
    let statusBadge = '';
    let cardClass = '';
    let actionBtn = '';

    if (unit.status === 'available') {
      statusBadge = `<span class="badge-available px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span> متاح
      </span>`;
      cardClass = 'unit-available border-emerald-200/80 bg-white shadow-sm';
      actionBtn = `
        <button onclick="handleUnitSelect(${unit.id})" 
                class="w-full mt-3 py-2 bg-emerald-900 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1">
          <span>طلب حجز الوحدة</span>
          <svg class="w-3.5 h-3.5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
          </svg>
        </button>
      `;
    } else if (unit.status === 'reserved') {
      statusBadge = `<span class="badge-reserved px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1">
        <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span> محجوز
      </span>`;
      cardClass = 'border-amber-200/70 bg-amber-50/20';
      actionBtn = `
        <button onclick="handleNotifyUnit(${unit.id})" 
                class="w-full mt-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition">
          إشعار في حال الإلغاء
        </button>
      `;
    } else {
      statusBadge = `<span class="badge-sold px-2.5 py-0.5 rounded-full text-[11px] font-bold">
        مباع
      </span>`;
      cardClass = 'border-slate-200 bg-slate-50/60 opacity-80';
      actionBtn = `
        <div class="w-full mt-3 py-2 bg-slate-100 text-slate-400 rounded-xl text-xs font-medium text-center">
          تم الإفراغ والتمليك
        </div>
      `;
    }

    return `
      <div class="unit-card p-4 rounded-2xl border ${cardClass} flex flex-col justify-between">
        <div>
          <!-- رأس بطاقة الوحدة -->
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-1.5">
              <span class="w-7 h-7 rounded-lg bg-slate-900 text-amber-400 font-heading font-black text-xs flex items-center justify-center">
                ${unit.unitNumber}
              </span>
              <span class="text-xs font-bold text-slate-900 font-heading">
                نموذج ${unit.model}
              </span>
            </div>
            ${statusBadge}
          </div>

          <!-- تفاصيل الوحدة -->
          <div class="space-y-1.5 text-xs text-slate-600 mb-3">
            <div class="font-medium text-slate-800 line-clamp-1">${unit.type}</div>
            <div class="flex items-center justify-between text-slate-500 text-[11px]">
              <span>المساحة:</span>
              <span class="font-bold text-slate-700">${unit.area}</span>
            </div>
            <div class="flex items-center justify-between text-slate-500 text-[11px]">
              <span>التوزيع:</span>
              <span>${unit.beds} غرف | ${unit.baths} دورات مياه</span>
            </div>
          </div>
        </div>

        <div>
          <!-- السعر التقديري للوحدة -->
          <div class="pt-2 border-t border-slate-100 flex items-baseline justify-between">
            <span class="text-[10px] text-slate-400">السعر التقديري</span>
            <span class="text-xs font-bold text-emerald-900 font-heading">${unit.price}</span>
          </div>

          ${actionBtn}
        </div>
      </div>
    `;
  }).join('');
}

// اختيار وحدة متاحة للحجز
window.handleUnitSelect = function(unitId) {
  const unit = unitsData.find(u => u.id === unitId);
  if (!unit) return;

  // تعبئة البيانات تلقائياً في فورم الحجز
  const unitInput = document.getElementById('booking-unit');
  const modelSelect = document.getElementById('booking-model');
  const bookingSection = document.getElementById('booking-section');

  if (unitInput) {
    unitInput.value = `الوحدة رقم (${unit.unitNumber}) — نموذج ${unit.model} (${unit.type})`;
  }
  if (modelSelect) {
    modelSelect.value = unit.model;
  }

  // تمرير سلس لفورم الحجز
  if (bookingSection) {
    bookingSection.scrollIntoView({ behavior: 'smooth' });
  }

  showToast(`تم تحديد الوحدة (${unit.unitNumber}) بنجاح! أكمل بياناتك لتأكيد الحجز.`, 'success');
};

// طلب إشعار في حال إلغاء حجز وحدة
window.handleNotifyUnit = function(unitId) {
  const unit = unitsData.find(u => u.id === unitId);
  if (!unit) return;
  const msg = `السلام عليكم، أرغب في تسجيلي بقائمة الانتظار للوحدة رقم (${unit.unitNumber}) نموذج ${unit.model} في حال تم إلغاء حجزها في مشروع تاون هاوس الشامخة.`;
  const url = `https://api.whatsapp.com/send?phone=966500550223&text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
};

/* ==========================================================================
   3. معرض النماذج الستة (Models Showcase A - F)
   ========================================================================== */
let activeModelCode = 'A';

function initModelsShowcase() {
  const modelTabs = document.querySelectorAll('.model-tab');
  modelTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      modelTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeModelCode = tab.dataset.model;
      renderActiveModel();
    });
  });

  renderActiveModel();
}

function renderActiveModel() {
  const model = modelsData[activeModelCode];
  if (!model) return;

  const container = document.getElementById('model-detail-container');
  if (!container) return;

  container.innerHTML = `
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <!-- عمود الصورة والمخطط الهندسي -->
      <div class="lg:col-span-6 space-y-4">
        <div class="relative rounded-3xl overflow-hidden border border-slate-200 shadow-md group">
          <img src="${model.image}" alt="${model.title}" class="w-full h-80 sm:h-96 object-cover transition duration-500 group-hover:scale-105">
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20"></div>
          <div class="absolute top-4 right-4 bg-emerald-900/90 backdrop-blur-md text-amber-300 text-xs px-3.5 py-1.5 rounded-full font-bold shadow-lg">
            ${model.badge}
          </div>
          <div class="absolute bottom-4 right-4 left-4 text-white">
            <span class="text-xs text-emerald-300 font-semibold mb-1 block">مُيسر للتطوير العقاري</span>
            <h3 class="text-xl font-bold font-heading">${model.title}</h3>
            <p class="text-xs text-slate-200 mt-1">${model.subtitle}</p>
          </div>
        </div>

        <!-- أزرار تفاعلية للمخطط والمعاينة -->
        <div class="grid grid-cols-2 gap-3">
          <button onclick="handleModelInspection('${model.code}')" 
                  class="py-3 px-4 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm">
            <svg class="w-4 h-4 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <span>طلب معاينة ميدانية</span>
          </button>
          <button onclick="handleDownloadPlan('${model.code}')" 
                  class="py-3 px-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm">
            <svg class="w-4 h-4 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            <span>تحميل المخطط المعماري</span>
          </button>
        </div>
      </div>

      <!-- عمود البيانات والمواصفات وتوزيع الأدوار -->
      <div class="lg:col-span-6 space-y-6">
        <!-- بطاقات المساحات السريعة -->
        <div class="grid grid-cols-3 gap-3">
          <div class="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-center">
            <span class="text-[11px] text-slate-500 block mb-1">مسطح البناء</span>
            <span class="text-base font-bold text-slate-900 font-heading">${model.builtArea} م²</span>
          </div>
          <div class="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-100 text-center">
            <span class="text-[11px] text-emerald-800 block mb-1">المساحة الإجمالية</span>
            <span class="text-base font-bold text-emerald-950 font-heading">${model.totalArea} م²</span>
          </div>
          <div class="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-100 text-center">
            <span class="text-[11px] text-amber-800 block mb-1">السعر التقديري</span>
            <span class="text-base font-bold text-amber-950 font-heading">${model.priceEstimate}</span>
          </div>
        </div>

        <!-- توزيع الأدوار والمساحات -->
        <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <h4 class="text-sm font-bold text-slate-900 font-heading mb-3 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-700"></span>
            توزيع الأدوار والمساحات الداخلية
          </h4>
          <div class="space-y-3">
            ${model.roomDistribution.map(r => `
              <div class="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <span class="font-bold text-emerald-900 block mb-1 font-heading">${r.floor}</span>
                <p class="text-slate-600 leading-relaxed">${r.spaces}</p>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- مزايا وتجهيزات النموذج -->
        <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <h4 class="text-sm font-bold text-slate-900 font-heading mb-3 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-amber-500"></span>
            أبرز مزايا وتجهيزات ${model.title}
          </h4>
          <ul class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
            ${model.highlights.map(h => `
              <li class="flex items-start gap-2">
                <svg class="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                </svg>
                <span>${h}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>
    </div>
  `;
}

window.handleModelInspection = function(modelCode) {
  const modelSelect = document.getElementById('booking-model');
  const bookingSection = document.getElementById('booking-section');
  if (modelSelect) modelSelect.value = modelCode;
  if (bookingSection) bookingSection.scrollIntoView({ behavior: 'smooth' });
  showToast(`تم تحديد نموذج ${modelCode}، يرجى كتابة اسمك ورقم جوالك لتأكيد المعاينة.`, 'info');
};

window.handleDownloadPlan = function(modelCode) {
  const model = modelsData[modelCode];
  if (!model) return;
  const msg = `السلام عليكم ورحمة الله، أود الحصول على نسخة المخطط المعماري الكامل (PDF) لـ ${model.title} في مشروع تاون هاوس الشامخة بالدمام.`;
  const url = `https://api.whatsapp.com/send?phone=966500550223&text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
};

/* ==========================================================================
   4. استمارة الحجز المباشر وتوليد كود التذكرة (#MS-XXXX)
   ========================================================================== */
function initBookingForm() {
  const form = document.getElementById('booking-lead-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('booking-name')?.value.trim();
    const phone = document.getElementById('booking-phone')?.value.trim();
    const model = document.getElementById('booking-model')?.value;
    const unit = document.getElementById('booking-unit')?.value.trim() || 'لم يتم تحديد وحدة معينة';
    const payment = document.getElementById('booking-payment')?.value || 'تمويل بنكي';
    const notes = document.getElementById('booking-notes')?.value.trim() || 'لا توجد ملاحظات إضافية';

    // التحقق من الحقول
    if (!name || name.length < 3) {
      showToast('يرجى إدخال الاسم الكريم بشكل صحيح.', 'error');
      return;
    }

    if (!phone || !/^0?5[0-9]{8}$/.test(phone.replace(/[\s-]/g, ''))) {
      showToast('يرجى إدخال رقم جوال سعودي صالح (مثال: 0500550223).', 'error');
      return;
    }

    // توليد رقم مرجعي رسمي للحجز
    const ticketNumber = `#MS-${Math.floor(1000 + Math.random() * 9000)}`;

    // فتح نافذة تأكيد الحجز الرسمية
    openBookingConfirmationModal({
      ticketNumber,
      name,
      phone,
      model,
      unit,
      payment,
      notes
    });

    form.reset();
  });
}

function openBookingConfirmationModal(data) {
  const modal = document.getElementById('booking-modal');
  if (!modal) return;

  const ticketEl = document.getElementById('modal-ticket-id');
  const nameEl = document.getElementById('modal-client-name');
  const phoneEl = document.getElementById('modal-client-phone');
  const modelEl = document.getElementById('modal-client-model');
  const unitEl = document.getElementById('modal-client-unit');
  const paymentEl = document.getElementById('modal-client-payment');
  const whatsappBtn = document.getElementById('modal-whatsapp-cta');

  if (ticketEl) ticketEl.textContent = data.ticketNumber;
  if (nameEl) nameEl.textContent = data.name;
  if (phoneEl) phoneEl.textContent = data.phone;
  if (modelEl) modelEl.textContent = `نموذج ${data.model}`;
  if (unitEl) unitEl.textContent = data.unit;
  if (paymentEl) paymentEl.textContent = data.payment;

  if (whatsappBtn) {
    const message = `السلام عليكم ورحمة الله وبركاته،
أود تأكيد موعد معاينة وحجز في مشروع "تاون هاوس الشامخة — الدمام".
-------------------------------
📌 رقم التذكرة المرجعي: ${data.ticketNumber}
👤 الاسم: ${data.name}
📱 رقم الجوال: ${data.phone}
🏠 النموذج المفضل: نموذج ${data.model}
🔢 الوحدة المحددة: ${data.unit}
💳 طريقة السداد: ${data.payment}
📝 ملاحظات: ${data.notes}
-------------------------------
شاكر لكم ومقدّر.`;

    whatsappBtn.href = `https://api.whatsapp.com/send?phone=966500550223&text=${encodeURIComponent(message)}`;
  }

  modal.classList.remove('hidden');
}

window.closeBookingModal = function() {
  const modal = document.getElementById('booking-modal');
  if (modal) modal.classList.add('hidden');
};

/* ==========================================================================
   6. دوال مساعدة عامة وتنبيهات التوست
   ========================================================================== */
function formatNumber(num) {
  return new Intl.NumberFormat('en-US').format(num);
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  const bgColors = {
    success: 'bg-emerald-950 text-emerald-100 border-emerald-700',
    error: 'bg-rose-950 text-rose-100 border-rose-700',
    info: 'bg-slate-900 text-slate-100 border-slate-700'
  };

  toast.className = `p-4 rounded-xl border shadow-xl flex items-center justify-between gap-3 text-xs pointer-events-auto transform transition duration-300 translate-y-2 opacity-0 ${bgColors[type] || bgColors.info}`;
  toast.innerHTML = `
    <div class="flex items-center gap-2">
      <span class="w-2 h-2 rounded-full ${type === 'success' ? 'bg-emerald-400' : type === 'error' ? 'bg-rose-400' : 'bg-amber-400'}"></span>
      <span class="font-medium">${message}</span>
    </div>
    <button onclick="this.parentElement.remove()" class="text-slate-400 hover:text-white">✕</button>
  `;

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  });

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 4500);
}
