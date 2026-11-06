/**
 * app.js — محرك العرض الديناميكي الكامل
 * مُيسّر للتطوير العقاري | تاون هاوس الشامخة
 * ─────────────────────────────────────────────────
 * يستهلك DATA من data.js ويُحوّله إلى DOM كامل.
 * لا يوجد أي محتوى ثابت (hardcoded) في هذا الملف.
 */

/* ═══════════════════════════════════════════════════
   HELPERS & ICONS (Must be evaluated first)
   ═══════════════════════════════════════════════════ */

/** تنسيق الأرقام بفواصل إنجليزية */
const fmt = (n) => new Intl.NumberFormat("en-US").format(n);

/** رسالة واتساب مشفّرة */
const waLink = (msg) => {
  const num = (typeof window !== "undefined" && window.DATA && window.DATA.brand) ? window.DATA.brand.whatsapp : (typeof DATA !== "undefined" && DATA.brand) ? DATA.brand.whatsapp : "966500550223";
  return `https://api.whatsapp.com/send?phone=${num}&text=${encodeURIComponent(msg)}`;
};

/** رسالة واتساب الافتراضية */
const waDefault = () =>
  waLink("السلام عليكم، أود الاستفسار عن مشروع تاون هاوس الشامخة بالدمام.");

/** أيقونة SVG مضمّنة (mini icon set) */
const icon = {
  whatsapp: `<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2zm5.78 14.07c-.24.68-1.2 1.26-1.68 1.34-.44.07-1.01.1-3.23-.82-2.84-1.18-4.66-4.08-4.8-4.27-.14-.19-1.16-1.54-1.16-2.94 0-1.4 1.05-1.74 1.4-1.89.24-.1.52-.1.7-.1.19 0 .38 0 .54.02.18.02.43-.07.67.5.24.58.82 2 .89 2.15.07.15.12.33.02.53-.1.19-.15.31-.3.49-.15.17-.31.39-.44.52-.15.15-.3.31-.13.61.17.3 1.06 1.75 2.27 2.83 1.57 1.39 2.89 1.82 3.3 2.03.41.21.65.17.89-.1.24-.28 1.03-1.2 1.3-1.62.27-.41.55-.35.92-.21.38.14 2.39 1.13 2.8 1.33.41.21.68.31.78.48.1.18.1.99-.14 1.67z"/></svg>`,
  phone:    `<svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.25 1.02l-2.2 2.2z"/></svg>`,
  arrow:    `<svg class="w-3.5 h-3.5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>`,
  check:    `<svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>`,
  map:      `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`,
  download: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>`,
  calendar: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>`,
  external: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>`,
  building: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>`,
  shield:   `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>`,
  bolt:     `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>`,
  home:     `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>`,
  lift:     `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>`,
  menu:     `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>`,
  close:    `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>`,
  checkCircle: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
};

/** إشعار توست */
function toast(msg, type = "info") {
  const c = document.getElementById("toast-container");
  if (!c) return;
  const colors = {
    success: "bg-emerald-950 text-emerald-100 border-emerald-700",
    error:   "bg-rose-950 text-rose-100 border-rose-700",
    info:    "bg-slate-900 text-slate-100 border-slate-700",
  };
  const dot = { success: "bg-emerald-400", error: "bg-rose-400", info: "bg-amber-400" };
  const el = document.createElement("div");
  el.className = `p-4 rounded-xl border shadow-xl flex items-center justify-between gap-3 text-xs pointer-events-auto transform transition duration-300 translate-y-2 opacity-0 ${colors[type] || colors.info}`;
  el.innerHTML = `<div class="flex items-center gap-2"><span class="w-2 h-2 rounded-full ${dot[type] || dot.info}"></span><span class="font-medium">${msg}</span></div><button onclick="this.parentElement.remove()" class="opacity-50 hover:opacity-100">✕</button>`;
  c.appendChild(el);
  requestAnimationFrame(() => el.classList.remove("translate-y-2", "opacity-0"));
  setTimeout(() => { el.classList.add("opacity-0", "translate-y-2"); setTimeout(() => el.remove(), 300); }, 4500);
}

/* ─── State ───────────────────────────────────────── */
const STATE = {
  unitStatusFilter: "all",
  activeModel: "A",
};

/* ═══════════════════════════════════════════════════
   1. SECTION BUILDERS
   ═══════════════════════════════════════════════════ */

/* ── 1.1 Info Bar ────────────────────────────────── */
function buildInfoBar() {
  const el = document.getElementById("info-bar");
  if (!el) return;
  const { phoneDisplay, whatsapp, workingHours, city, country } = DATA.brand;
  el.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
      <div class="flex items-center gap-2">
        <span class="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>خدمة العملاء والمبيعات: ${workingHours} | ${city} — ${country}</span>
      </div>
      <div class="flex items-center gap-4">
        <a href="tel:+${whatsapp}" class="hover:text-amber-400 transition flex items-center gap-1.5" dir="ltr">
          ${icon.phone}<span>${phoneDisplay}</span>
        </a>
        <span class="text-slate-700">|</span>
        <a href="${waDefault()}" target="_blank" rel="noopener noreferrer"
           class="text-emerald-400 hover:text-emerald-300 font-bold transition flex items-center gap-1.5">
          ${icon.whatsapp}<span>واتساب المبيعات الرسمي</span>
        </a>
      </div>
    </div>`;
}

/* ── 1.2 Navbar ──────────────────────────────────── */
function buildNavbar() {
  const el = document.getElementById("main-navbar");
  if (!el) return;
  const { developer, project, developerType } = DATA.brand;

  const navItems = DATA.navLinks.map(l =>
    `<a href="${l.href}" class="hover:text-emerald-800 transition text-xs font-bold text-slate-700">${l.label}</a>`
  ).join("");

  const mobileItems = DATA.navLinks.map(l =>
    `<a href="${l.href}" onclick="closeMobileMenu()" class="block text-xs font-bold text-slate-700 hover:text-emerald-800 py-1.5">${l.label}</a>`
  ).join("");

  el.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-20">

        <a href="#" class="flex items-center gap-3 group">
          <div class="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-900 to-slate-950 flex items-center justify-center text-amber-400 shadow-md group-hover:scale-105 transition">
            ${icon.building}
          </div>
          <div>
            <div class="flex items-center gap-1.5">
              <span class="text-lg font-black text-slate-900 font-heading tracking-tight">${developer}</span>
              <span class="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">${developerType}</span>
            </div>
            <div class="text-xs text-slate-500 font-semibold">${project}</div>
          </div>
        </a>

        <nav class="hidden lg:flex items-center gap-7">${navItems}</nav>

        <div class="flex items-center gap-3">
          <a href="#booking-section"
             class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-900 to-emerald-800 hover:from-emerald-800 hover:to-emerald-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition flex items-center gap-1.5">
            <span>احجز وحدتك الآن</span>${icon.arrow}
          </a>
          <button id="mobile-menu-btn" onclick="toggleMobileMenu()"
                  class="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100">
            ${icon.menu}
          </button>
        </div>
      </div>
    </div>

    <div id="mobile-menu" class="hidden lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3">
      ${mobileItems}
      <a href="#booking-section" onclick="closeMobileMenu()"
         class="block text-xs font-bold text-emerald-900 bg-emerald-50 px-3 py-2 rounded-xl">
        احجز وحدتك الآن
      </a>
    </div>`;
}

window.toggleMobileMenu = () => document.getElementById("mobile-menu")?.classList.toggle("hidden");
window.closeMobileMenu  = () => document.getElementById("mobile-menu")?.classList.add("hidden");

/* ── 1.3 Hero ────────────────────────────────────── */
function buildHero() {
  const el = document.getElementById("hero-section");
  if (!el) return;
  const h = DATA.hero;

  const metricsHTML = h.metrics.map(m => `
    <div class="p-3 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-right">
      <span class="text-xs text-slate-300 block mb-1">${m.label}</span>
      <span class="text-xl sm:text-2xl font-black text-amber-400 font-heading">${m.value}</span>
      <span class="text-[11px] text-slate-400 block mt-0.5">${m.sub}</span>
    </div>`).join("");

  el.innerHTML = `
    <div class="absolute inset-0 z-0">
      <img src="${h.bgImage}" alt="${h.title}" class="w-full h-full object-cover opacity-35">
      <div class="hero-gradient-overlay absolute inset-0"></div>
    </div>
    <div class="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/80 backdrop-blur-md border border-emerald-500/30 text-amber-300 text-xs font-bold mb-6 shadow-lg">
        <span class="w-2 h-2 rounded-full bg-amber-400"></span>
        <span>${DATA.brand.developer} — المطور الحصري للمشروع</span>
      </div>
      <p class="text-sm sm:text-base font-semibold text-emerald-300 mb-2 font-heading tracking-wide">${h.tagline}</p>
      <h1 class="text-3xl sm:text-5xl lg:text-6xl font-black font-heading text-white tracking-tight leading-tight mb-6">
        ${h.title}
        <span class="block text-xl sm:text-3xl lg:text-4xl font-bold text-slate-200 mt-2">${h.titleSub}</span>
      </h1>
      <p class="text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10">${h.description}</p>
      <div id="hero-metrics" class="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto mb-10">${metricsHTML}</div>
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <a href="#matrix-section"
           class="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-slate-950 font-black text-sm shadow-xl hover:shadow-2xl transition flex items-center justify-center gap-2">
          <span>${h.ctaPrimary}</span>${icon.arrow}
        </a>
        <a href="${waDefault()}" target="_blank" rel="noopener noreferrer"
           class="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/25 backdrop-blur-md font-bold text-sm transition flex items-center justify-center gap-2">
          ${icon.whatsapp}<span>${h.ctaSecondary}</span>
        </a>
      </div>
    </div>`;
}

/* ── 1.4 Project Status Tabs ─────────────────────── */
function buildProjectTabs() {
  const el = document.getElementById("project-tabs");
  if (!el) return;
  el.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white rounded-2xl p-2 shadow-lg border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div class="flex items-center gap-2 w-full sm:w-auto">
          <button class="status-tab active px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2" data-target="ready">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>وحدات جاهزة للبيع — تاون هاوس الشامخة (${DATA.units.length} وحدة)</span>
          </button>
          <button class="status-tab px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition flex items-center gap-2" data-target="upcoming">
            <span class="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>مشاريع قيد التطوير</span>
          </button>
        </div>
        <div class="text-xs text-slate-500 px-3 hidden md:block">
          مشاريع مطورة ومملوكة مباشرة لشركة ${DATA.brand.developer}
        </div>
      </div>
    </div>`;

  // upcoming container
  const upcomingEl = document.getElementById("upcoming-projects-container");
  if (upcomingEl) {
    upcomingEl.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="text-center max-w-2xl mx-auto mb-8">
          <h3 class="text-2xl font-black text-slate-900 font-heading mb-2">مشاريع قيد التطوير بالمنطقة الشرقية</h3>
          <p class="text-xs text-slate-600">سجّل اهتمامك المبكر للحصول على أولوية الاختيار وأسعار الطرح الأولي.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          ${DATA.upcoming.map(p => `
            <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition">
              <div class="relative h-56 overflow-hidden">
                <img src="${p.image}" alt="${p.title}" class="w-full h-full object-cover">
                <div class="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-amber-300 text-xs px-3 py-1.5 rounded-lg font-bold">${p.status}</div>
              </div>
              <div class="p-6">
                <span class="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md inline-block mb-2">موعد الطرح: ${p.launchDate}</span>
                <h3 class="text-lg font-bold text-slate-900 font-heading mb-2">${p.title}</h3>
                <p class="text-xs text-slate-600 leading-relaxed mb-4">${p.desc}</p>
                <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span class="text-xs text-slate-500">${p.type}</span>
                  <a href="${waLink("السلام عليكم، أود تسجيل اهتمامي المبكر بمشروع: " + p.title)}"
                     target="_blank" rel="noopener noreferrer"
                     class="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1">
                    سجّل اهتمامك المبكر${icon.arrow}
                  </a>
                </div>
              </div>
            </div>`).join("")}
        </div>
      </div>`;
  }

  // Tab switching
  document.querySelectorAll(".status-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".status-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      const ready    = document.getElementById("ready-units-container");
      const upcoming = document.getElementById("upcoming-projects-container");
      if (tab.dataset.target === "ready") {
        ready?.classList.remove("hidden");
        upcoming?.classList.add("hidden");
      } else {
        ready?.classList.add("hidden");
        upcoming?.classList.remove("hidden");
      }
    });
  });
}

/* ═══════════════════════════════════════════════════
   2. UNIT MATRIX
   ═══════════════════════════════════════════════════ */

function buildUnitMatrix() {
  const container = document.getElementById("matrix-section");
  if (!container) return;

  const counts = computeCounts();

  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div class="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200/60 mb-2">مخطط المبيعات الحي</div>
          <h2 class="text-2xl sm:text-3xl font-black text-slate-900 font-heading">مصفوفة الوحدات السكنية (${DATA.units.length} تاون هاوس)</h2>
          <p class="text-xs text-slate-600 mt-1 max-w-xl">استعرض حالة الوحدات لحظياً، واضغط على أي وحدة متاحة لحجزها مباشرة.</p>
        </div>
        <div id="matrix-counter" class="grid grid-cols-4 gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm text-center">
          ${counterCell("إجمالي", counts.total,     "text-slate-900", "")}
          ${counterCell("متاح",   counts.available, "text-emerald-900", "bg-emerald-50/70 rounded-xl border border-emerald-100")}
          ${counterCell("محجوز",  counts.reserved,  "text-amber-900",  "bg-amber-50/70 rounded-xl border border-amber-100")}
          ${counterCell("مباع",   counts.sold,      "text-slate-600",  "bg-slate-100 rounded-xl")}
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div class="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          ${["all","available","reserved","sold"].map((s, i) => {
            const labels = ["جميع الحالات","المتاحة فقط","المحجوزة","المباعة"];
            const dots   = ["","bg-emerald-500","bg-amber-500",""];
            return `<button class="matrix-status-btn matrix-filter-btn${s==="all"?" active":""} px-3.5 py-1.5 rounded-xl text-xs font-bold border border-slate-200 transition flex items-center gap-1.5" data-status="${s}">
              ${dots[i] ? `<span class="w-2 h-2 rounded-full ${dots[i]}"></span>` : ""}<span>${labels[i]}</span>
            </button>`;
          }).join("")}
        </div>
        <div class="flex items-center gap-2 w-full sm:w-auto">
          <label class="text-xs font-bold text-slate-600 whitespace-nowrap">النموذج:</label>
          <select id="matrix-model-select" class="w-full sm:w-48 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-800">
            <option value="all">جميع النماذج (A–F)</option>
            ${DATA.models.map(m => `<option value="${m.code}">نموذج ${m.code} — ${m.name}</option>`).join("")}
          </select>
        </div>
      </div>

      <!-- Grid -->
      <div id="units-matrix-grid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"></div>
    </div>`;

  renderMatrix();
  attachMatrixFilters();
}

function counterCell(label, val, textClass, wrapClass) {
  return `<div class="px-3 py-1.5 ${wrapClass}">
    <span class="text-[10px] text-slate-500 block">${label}</span>
    <span class="text-sm font-black ${textClass} font-heading">${val}</span>
  </div>`;
}

function computeCounts(list = DATA.units) {
  return {
    total:     list.length,
    available: list.filter(u => u.status === "available").length,
    reserved:  list.filter(u => u.status === "reserved").length,
    sold:      list.filter(u => u.status === "sold").length,
  };
}

function renderMatrix() {
  const grid = document.getElementById("units-matrix-grid");
  if (!grid) return;

  const statusF = STATE.unitStatusFilter;
  const modelF  = document.getElementById("matrix-model-select")?.value || "all";

  const filtered = DATA.units.filter(u =>
    (statusF === "all" || u.status === statusF) &&
    (modelF  === "all" || u.model  === modelF)
  );

  if (!filtered.length) {
    grid.innerHTML = `
      <div class="col-span-full py-12 text-center bg-white rounded-2xl border border-slate-200">
        <p class="text-sm font-bold text-slate-700 font-heading">لا توجد وحدات مطابقة للفلتر الحالي</p>
        <p class="text-xs text-slate-500 mt-1">جرّب تغيير معايير التصفية</p>
      </div>`;
    return;
  }

  grid.innerHTML = filtered.map(u => unitCard(u)).join("");
}

function unitCard(u) {
  const model = DATA.models.find(m => m.code === u.model);

  if (u.status === "available") {
    return `
      <div class="unit-card unit-available p-4 rounded-2xl border border-emerald-200/80 bg-white shadow-sm flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-1.5">
              <span class="w-7 h-7 rounded-lg bg-slate-900 text-amber-400 font-heading font-black text-xs flex items-center justify-center">${u.id}</span>
              <span class="text-xs font-bold text-slate-900 font-heading">نموذج ${u.model}</span>
            </div>
            <span class="badge-available px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>متاح
            </span>
          </div>
          <div class="text-xs font-medium text-slate-800 mb-2">${model?.name || ""}</div>
          <div class="space-y-1 text-[11px] text-slate-500">
            <div class="flex justify-between"><span>المساحة</span><span class="font-bold text-slate-700">${u.area}</span></div>
            <div class="flex justify-between"><span>السعر</span><span class="font-bold text-emerald-900">${fmt(u.price)} ر.س</span></div>
          </div>
        </div>
        <button onclick="selectUnit(${u.id})"
                class="w-full mt-3 py-2 bg-emerald-900 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1">
          طلب حجز الوحدة ${icon.arrow}
        </button>
      </div>`;
  }

  if (u.status === "reserved") {
    return `
      <div class="unit-card p-4 rounded-2xl border border-amber-200/70 bg-amber-50/20 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-1.5">
              <span class="w-7 h-7 rounded-lg bg-slate-900 text-amber-400 font-heading font-black text-xs flex items-center justify-center">${u.id}</span>
              <span class="text-xs font-bold text-slate-900 font-heading">نموذج ${u.model}</span>
            </div>
            <span class="badge-reserved px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>محجوز
            </span>
          </div>
          <div class="text-xs font-medium text-slate-800 mb-2">${model?.name || ""}</div>
          <div class="space-y-1 text-[11px] text-slate-500">
            <div class="flex justify-between"><span>المساحة</span><span class="font-bold text-slate-700">${u.area}</span></div>
            <div class="flex justify-between"><span>السعر</span><span class="font-bold text-slate-700">${fmt(u.price)} ر.س</span></div>
          </div>
        </div>
        <button onclick="notifyUnit(${u.id})"
                class="w-full mt-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition">
          إشعار عند الإتاحة
        </button>
      </div>`;
  }

  // sold
  return `
    <div class="unit-card p-4 rounded-2xl border border-slate-200 bg-slate-50/60 opacity-70 flex flex-col justify-between">
      <div>
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-1.5">
            <span class="w-7 h-7 rounded-lg bg-slate-300 text-slate-500 font-heading font-black text-xs flex items-center justify-center">${u.id}</span>
            <span class="text-xs font-bold text-slate-500 font-heading">نموذج ${u.model}</span>
          </div>
          <span class="badge-sold px-2.5 py-0.5 rounded-full text-[11px] font-bold">مباع</span>
        </div>
        <div class="text-xs font-medium text-slate-500 mb-2">${model?.name || ""}</div>
        <div class="text-[11px] text-slate-400">${u.area}</div>
      </div>
      <div class="w-full mt-3 py-2 bg-slate-100 text-slate-400 rounded-xl text-xs text-center">تم الإفراغ والتمليك</div>
    </div>`;
}

function attachMatrixFilters() {
  document.querySelectorAll(".matrix-status-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".matrix-status-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      STATE.unitStatusFilter = btn.dataset.status;
      renderMatrix();
    });
  });

  document.getElementById("matrix-model-select")?.addEventListener("change", renderMatrix);
}

/** يستخدمه زر "طلب حجز الوحدة" */
window.selectUnit = function(id) {
  const unit = DATA.units.find(u => u.id === id);
  if (!unit) return;
  const model = DATA.models.find(m => m.code === unit.model);

  const sel  = document.getElementById("booking-unit-select");
  const form = document.getElementById("booking-section");

  if (sel) {
    // ابحث عن option بالـ id
    for (const opt of sel.options) {
      if (opt.value === String(unit.id)) { sel.value = String(unit.id); break; }
    }
  }
  form?.scrollIntoView({ behavior: "smooth" });
  toast(`تم تحديد الوحدة (${unit.id}) نموذج ${unit.model}. أكمل بياناتك لتأكيد الحجز.`, "success");
};

/** زر "إشعار عند الإتاحة" */
window.notifyUnit = function(id) {
  const unit = DATA.units.find(u => u.id === id);
  if (!unit) return;
  window.open(waLink(`السلام عليكم، أرغب في تسجيلي بقائمة الانتظار للوحدة (${unit.id}) نموذج ${unit.model} في مشروع تاون هاوس الشامخة.`), "_blank");
};

/* ═══════════════════════════════════════════════════
   3. MODELS SHOWCASE
   ═══════════════════════════════════════════════════ */

function buildModelsShowcase() {
  const el = document.getElementById("models-section");
  if (!el) return;

  const tabs = DATA.models.map((m, i) => `
    <button class="model-tab${i === 0 ? " active" : ""} px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-200 bg-white text-slate-700 transition flex items-center gap-2 whitespace-nowrap" data-model="${m.code}">
      <span class="w-5 h-5 rounded-md ${i === 0 ? "bg-emerald-900 text-amber-400" : "bg-slate-900 text-white"} flex items-center justify-center font-heading text-[11px]">${m.code}</span>
      <span>نموذج ${m.code} — ${m.name}</span>
    </button>`).join("");

  el.innerHTML = `
    <div class="bg-slate-100/70 border-y border-slate-200/80 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-2xl mx-auto mb-10">
          <div class="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200/60 mb-2">تنوع هندسي يلبي كافة تطلعات العائلة</div>
          <h2 class="text-2xl sm:text-3xl font-black text-slate-900 font-heading">النماذج المعمارية — تاون هاوس الشامخة</h2>
          <p class="text-xs text-slate-600 mt-2">6 نماذج مدروسة من الدوبلكس الأرضي ذي الحوش الرحب حتى البنتهاوس ذي التراس الفندقي.</p>
        </div>
        <div class="flex items-center gap-2 overflow-x-auto pb-4 mb-8">${tabs}</div>
        <div id="model-detail-container" class="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm"></div>
      </div>
    </div>`;

  renderActiveModel();

  document.querySelectorAll(".model-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".model-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      STATE.activeModel = tab.dataset.model;
      renderActiveModel();
    });
  });
}

function renderActiveModel() {
  const container = document.getElementById("model-detail-container");
  if (!container) return;
  const m = DATA.models.find(m => m.code === STATE.activeModel);
  if (!m) return;

  const floorRows = m.floorPlan.map(f => `
    <div class="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
      <span class="font-bold text-emerald-900 font-heading block mb-1">${f.floor}</span>
      <p class="text-slate-600 leading-relaxed">${f.spaces}</p>
    </div>`).join("");

  const highlights = m.highlights.map(h => `
    <li class="flex items-start gap-2">
      <span class="text-emerald-600 mt-0.5">${icon.check}</span>
      <span>${h}</span>
    </li>`).join("");

  container.innerHTML = `
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <!-- Image & Actions -->
      <div class="lg:col-span-6 space-y-4">
        <div class="relative rounded-3xl overflow-hidden border border-slate-200 shadow-md group">
          <img src="${m.image}" alt="${m.name}" class="w-full h-80 sm:h-96 object-cover transition duration-500 group-hover:scale-105">
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20"></div>
          <div class="absolute top-4 right-4 bg-emerald-900/90 backdrop-blur-md text-amber-300 text-xs px-3.5 py-1.5 rounded-full font-bold shadow-lg">${m.badge}</div>
          <div class="absolute bottom-4 right-4 left-4 text-white">
            <span class="text-xs text-emerald-300 font-semibold mb-1 block">${DATA.brand.developer}</span>
            <h3 class="text-xl font-bold font-heading">نموذج ${m.code} — ${m.name}</h3>
            <p class="text-xs text-slate-200 mt-1">${m.subtitle}</p>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <button onclick="requestModelInspection('${m.code}')"
                  class="py-3 px-4 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm">
            ${icon.calendar}<span>طلب معاينة ميدانية</span>
          </button>
          <button onclick="downloadBrochure('${m.code}')"
                  class="py-3 px-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm">
            ${icon.download}<span>تحميل المخطط المعماري</span>
          </button>
        </div>
      </div>

      <!-- Details -->
      <div class="lg:col-span-6 space-y-5">
        <!-- Area chips -->
        <div class="grid grid-cols-3 gap-3">
          <div class="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-center">
            <span class="text-[11px] text-slate-500 block mb-1">مسطح البناء</span>
            <span class="text-base font-bold text-slate-900 font-heading">${m.builtArea} م²</span>
          </div>
          <div class="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-100 text-center">
            <span class="text-[11px] text-emerald-800 block mb-1">المساحة الإجمالية</span>
            <span class="text-base font-bold text-emerald-950 font-heading">${m.totalArea} م²</span>
          </div>
          <div class="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-100 text-center">
            <span class="text-[11px] text-amber-800 block mb-1">السعر يبدأ من</span>
            <span class="text-sm font-bold text-amber-950 font-heading">${m.priceFrom}</span>
          </div>
        </div>

        <!-- Floor plan -->
        <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <h4 class="text-sm font-bold text-slate-900 font-heading mb-3 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-700"></span>توزيع الأدوار والمساحات
          </h4>
          <div class="space-y-3">${floorRows}</div>
        </div>

        <!-- Highlights -->
        <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <h4 class="text-sm font-bold text-slate-900 font-heading mb-3 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-amber-500"></span>أبرز مزايا نموذج ${m.code}
          </h4>
          <ul class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">${highlights}</ul>
        </div>
      </div>
    </div>`;
}

window.requestModelInspection = function(code) {
  const sel = document.getElementById("booking-section");
  sel?.scrollIntoView({ behavior: "smooth" });
  toast(`تم تحديد نموذج ${code}. يرجى إكمال بياناتك لتنسيق المعاينة.`, "info");
};

window.downloadBrochure = function(code) {
  const m = DATA.models.find(m => m.code === code);
  window.open(waLink(`السلام عليكم ورحمة الله، أود الحصول على المخطط المعماري (PDF) لنموذج ${code} — ${m?.name || ""} في مشروع تاون هاوس الشامخة.`), "_blank");
};

/* ═══════════════════════════════════════════════════
   4. ABOUT + LOCATION SECTION
   ═══════════════════════════════════════════════════ */

function buildAboutSection() {
  const el = document.getElementById("about-section");
  if (!el) return;

  const perks = DATA.locationPerks.map(p => `
    <div class="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-3">
      <div class="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0">${icon[p.icon] || icon.shield}</div>
      <div>
        <h4 class="text-xs font-bold text-slate-900 font-heading mb-1">${p.title}</h4>
        <p class="text-[11px] text-slate-600 leading-normal">${p.desc}</p>
      </div>
    </div>`).join("");

  const distances = DATA.locationDistances.map(d => `
    <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
      <span class="font-medium text-slate-700">${d.place}</span>
      <span class="font-bold text-emerald-900 font-heading">${d.duration}</span>
    </div>`).join("");

  el.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

        <!-- Description & Perks -->
        <div class="lg:col-span-7 space-y-6">
          <div class="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200/60">عن مشروع تاون هاوس الشامخة</div>
          <h2 class="text-2xl sm:text-4xl font-black text-slate-900 font-heading leading-tight">رؤية معمارية ترتقي بمفهوم السكن العائلي المستقل في قلب الدمام</h2>
          <p class="text-sm text-slate-600 leading-relaxed">
            يُعد مشروع <strong class="text-slate-900">تاون هاوس الشامخة</strong> أحد أبرز المشاريع السكنية النوعية لشركة <strong class="text-emerald-900">${DATA.brand.developer}</strong>، يجمع بين استقلالية الفيلا الخاصة ووظيفة التاون هاوس العصري، في <strong class="text-slate-900">${DATA.brand.district} بـ${DATA.brand.city}</strong>.
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">${perks}</div>
        </div>

        <!-- Location -->
        <div id="location-section" class="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
              ${icon.map}<span>الموقع: ${DATA.brand.district} — ${DATA.brand.city}</span>
            </h3>
            <span class="text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-bold">موقع استراتيجي</span>
          </div>
          <p class="text-xs text-slate-600 leading-relaxed mb-4">منطقة سكنية حيوية وهادئة، محاطة بكافة المراكز التجارية والمدارس والحدائق العامة.</p>
          <div id="location-grid" class="space-y-2 mb-6">${distances}</div>
          <a href="${DATA.brand.mapQuery}" target="_blank" rel="noopener noreferrer"
             class="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center gap-2">
            ${icon.external}<span>فتح الموقع على خرائط Google</span>
          </a>
        </div>

      </div>
    </div>`;
}

/* ═══════════════════════════════════════════════════
   5. FINANCING CALCULATOR
   ═══════════════════════════════════════════════════ */

function buildCalculator() {
  const el = document.getElementById("calc-section");
  if (!el) return;

  const f = DATA.financing;

  const downBtns = f.downOptions.map(pct => `
    <button class="calc-down-btn px-2.5 py-1 rounded-lg text-[11px] font-bold ${pct === f.defaultDown ? 'bg-emerald-900 text-white' : 'bg-white/10 hover:bg-white/20 text-slate-300'} transition" data-pct="${pct}">
      ${pct}% ${pct === f.defaultDown ? '(الافتراضي)' : ''}
    </button>
  `).join("");

  const tenureOptions = f.tenureOptions.map(t => `
    <option value="${t.years}" ${t.default ? 'selected' : ''}>${t.label}</option>
  `).join("");

  el.innerHTML = `
    <div class="bg-gradient-to-b from-slate-900 to-slate-950 text-white py-16">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-2xl mx-auto mb-10">
          <div class="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-lg border border-emerald-800/80 mb-2">
            <span>تخطيط مالي ميسر وشفاف</span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-black font-heading text-white">حاسبة التمويل والدفعات التقديرية للتاون هاوس</h2>
          <p class="text-xs text-slate-300 mt-2">احسب التزاماتك التمويلية التقريبية عبر البنوك والجهات التمويلية المعتمدة في المملكة العربية السعودية.</p>
        </div>

        <div class="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <!-- Controls -->
            <div class="lg:col-span-7 space-y-6">
              <div>
                <div class="flex items-center justify-between text-xs mb-2">
                  <span class="font-bold text-slate-300">سعر الوحدة التقديري (ر.س):</span>
                  <div class="flex items-center gap-1">
                    <input type="number" id="calc-price-input" value="${f.defaultPrice}" min="${f.minPrice}" max="${f.maxPrice}" step="${f.priceStep}"
                           class="w-32 bg-white/10 border border-white/20 rounded-lg px-2.5 py-1 text-xs font-bold text-amber-400 font-heading text-left focus:outline-none focus:border-emerald-500">
                    <span class="text-[11px] text-slate-400">ر.س</span>
                  </div>
                </div>
                <input type="range" id="calc-price-slider" min="${f.minPrice}" max="${f.maxPrice}" step="${f.priceStep}" value="${f.defaultPrice}" class="w-full">
                <div class="flex justify-between text-[10px] text-slate-400 mt-1 font-heading">
                  <span>${fmt(f.minPrice)} ر.س</span>
                  <span>${fmt(Math.round((f.minPrice + f.maxPrice) / 2))} ر.س</span>
                  <span>${fmt(f.maxPrice)} ر.س</span>
                </div>
              </div>

              <div>
                <div class="flex items-center justify-between text-xs mb-2">
                  <span class="font-bold text-slate-300">نسبة الدفعة الأولى:</span>
                  <span id="calc-down-val" class="text-xs font-bold text-emerald-400 font-heading">${f.defaultDown}%</span>
                </div>
                <input type="range" id="calc-down-slider" min="10" max="40" step="5" value="${f.defaultDown}" class="w-full">
                <div class="flex items-center gap-2 mt-2">${downBtns}</div>
              </div>

              <div>
                <label for="calc-tenure" class="block text-xs font-bold text-slate-300 mb-2">مدة التمويل:</label>
                <select id="calc-tenure" class="w-full bg-slate-900 border border-white/20 rounded-xl px-3.5 py-2 text-xs font-bold text-white focus:outline-none focus:border-emerald-500">
                  ${tenureOptions}
                </select>
              </div>
            </div>

            <!-- Output -->
            <div class="lg:col-span-5 bg-white/10 border border-white/15 rounded-2xl p-6 text-center space-y-4">
              <div>
                <span class="text-xs text-slate-400 block mb-1">القسط الشهري التقديري</span>
                <div id="calc-out-monthly" class="text-2xl sm:text-3xl font-black text-amber-400 font-heading">-- ر.س/شهر</div>
                <span class="text-[10px] text-slate-400 mt-1 block">بناءً على نسبة أرباح سنوية تقديرية ${(f.annualRate * 100).toFixed(2)}%</span>
              </div>

              <div class="grid grid-cols-2 gap-2 pt-4 border-t border-white/10 text-right">
                <div class="p-2.5 rounded-xl bg-black/20">
                  <span class="text-[10px] text-slate-400 block">مبلغ الدفعة الأولى</span>
                  <span id="calc-out-down-sar" class="text-xs font-bold text-white font-heading">-- ر.س</span>
                </div>
                <div class="p-2.5 rounded-xl bg-black/20">
                  <span class="text-[10px] text-slate-400 block">مبلغ التمويل المتبقي</span>
                  <span id="calc-out-loan-sar" class="text-xs font-bold text-white font-heading">-- ر.س</span>
                </div>
              </div>

              <button id="calc-cta-btn" class="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-black transition shadow-lg flex items-center justify-center gap-1.5">
                <span>طلب استشارة تمويلية وحجز الوحدة</span>${icon.arrow}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>`;

  setupCalcListeners();
}

function setupCalcListeners() {
  const pInput = document.getElementById("calc-price-input");
  const pSlider = document.getElementById("calc-price-slider");
  const dSlider = document.getElementById("calc-down-slider");
  const dVal = document.getElementById("calc-down-val");
  const tenure = document.getElementById("calc-tenure");
  const cta = document.getElementById("calc-cta-btn");

  const recalc = () => {
    const price = parseFloat(pSlider?.value || DATA.financing.defaultPrice);
    const downPct = parseFloat(dSlider?.value || DATA.financing.defaultDown);
    const years = parseFloat(tenure?.value || 20);

    if (pInput && pInput.value != price) pInput.value = price;
    if (dVal) dVal.textContent = `${downPct}%`;

    const downSar = price * (downPct / 100);
    const loanSar = price - downSar;
    const profit = loanSar * DATA.financing.annualRate * years;
    const monthly = (loanSar + profit) / (years * 12);

    const mEl = document.getElementById("calc-out-monthly");
    const dEl = document.getElementById("calc-out-down-sar");
    const lEl = document.getElementById("calc-out-loan-sar");

    if (mEl) mEl.textContent = `${fmt(Math.round(monthly))} ر.س/شهر`;
    if (dEl) dEl.textContent = `${fmt(Math.round(downSar))} ر.س`;
    if (lEl) lEl.textContent = `${fmt(Math.round(loanSar))} ر.س`;
  };

  pSlider?.addEventListener("input", () => {
    if (pInput) pInput.value = pSlider.value;
    recalc();
  });

  pInput?.addEventListener("change", () => {
    let v = parseFloat(pInput.value);
    if (isNaN(v) || v < DATA.financing.minPrice) v = DATA.financing.minPrice;
    if (v > DATA.financing.maxPrice) v = DATA.financing.maxPrice;
    pInput.value = v;
    if (pSlider) pSlider.value = v;
    recalc();
  });

  dSlider?.addEventListener("input", recalc);
  tenure?.addEventListener("change", recalc);

  document.querySelectorAll(".calc-down-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".calc-down-btn").forEach(b => b.classList.remove("bg-emerald-900", "text-white"));
      btn.classList.add("bg-emerald-900", "text-white");
      if (dSlider) {
        dSlider.value = btn.dataset.pct;
        recalc();
      }
    });
  });

  cta?.addEventListener("click", () => {
    const bookSec = document.getElementById("booking-section");
    const paySelect = document.getElementById("b-payment");
    if (paySelect) paySelect.value = "تمويل بنكي مدعوم / مرابحة عقارية";
    bookSec?.scrollIntoView({ behavior: "smooth" });
    toast("تم ضبط طريقة الدفع على (تمويل بنكي مدعوم). يُرجى إكمال الحجز.", "success");
  });

  recalc();
}

/* ═══════════════════════════════════════════════════
   6. BOOKING FORM
   ═══════════════════════════════════════════════════ */

function buildBookingForm() {
  const el = document.getElementById("booking-section");
  if (!el) return;

  const availableUnits = DATA.units.filter(u => u.status === "available");
  const unitOptions = `<option value="">— اختر الوحدة أو اترك للمستشار —</option>` +
    availableUnits.map(u => {
      const model = DATA.models.find(m => m.code === u.model);
      return `<option value="${u.id}">وحدة ${u.id} — نموذج ${u.model} (${model?.name || ""}) — ${u.area} — ${fmt(u.price)} ر.س</option>`;
    }).join("");

  const modelOptions = DATA.models.map(m =>
    `<option value="${m.code}">نموذج ${m.code} — ${m.name} (${m.totalArea} م²)</option>`
  ).join("");

  el.innerHTML = `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-lg">
        <div class="text-center max-w-xl mx-auto mb-8">
          <div class="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200/60 mb-2">حجز ومعاينة رسمية مباشرة</div>
          <h2 class="text-2xl sm:text-3xl font-black text-slate-900 font-heading">سجّل اهتمامك واحجز وحدتك</h2>
          <p class="text-xs text-slate-600 mt-2">سيصدر لك رقم تذكرة رسمي ويُربطك مباشرة بمدير المبيعات عبر الواتساب لتنسيق المعاينة.</p>
        </div>
        <form id="booking-lead-form" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="b-name" class="block text-xs font-bold text-slate-700 mb-1.5">الاسم الثلاثي الكريم *</label>
              <input type="text" id="b-name" required placeholder="مثال: عبدالمحسن عبدالله الشمري"
                     class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-800">
            </div>
            <div>
              <label for="b-phone" class="block text-xs font-bold text-slate-700 mb-1.5">رقم الجوال (+966) *</label>
              <input type="tel" id="b-phone" required placeholder="05xxxxxxxx" dir="ltr"
                     class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-right focus:outline-none focus:ring-2 focus:ring-emerald-800">
            </div>
            <div>
              <label for="booking-unit-select" class="block text-xs font-bold text-slate-700 mb-1.5">الوحدة المتاحة المرغوبة</label>
              <select id="booking-unit-select" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-800">
                ${unitOptions}
              </select>
            </div>
            <div>
              <label for="b-model" class="block text-xs font-bold text-slate-700 mb-1.5">النموذج المعماري المفضل</label>
              <select id="b-model" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-800">
                ${modelOptions}
              </select>
            </div>
            <div class="sm:col-span-2">
              <label for="b-payment" class="block text-xs font-bold text-slate-700 mb-1.5">طريقة الشراء المفضلة</label>
              <select id="b-payment" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-800">
                <option>شراء نقدي (كاش)</option>
                <option selected>تمويل بنكي مدعوم / مرابحة عقارية</option>
                <option>خطة دفعات مرحلية مع المطور</option>
              </select>
            </div>
          </div>
          <div>
            <label for="b-notes" class="block text-xs font-bold text-slate-700 mb-1.5">الموعد المفضل للمعاينة أو ملاحظات</label>
            <textarea id="b-notes" rows="2" placeholder="مثال: أفضل المعاينة يوم السبت بعد صلاة العصر..."
                      class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-800"></textarea>
          </div>
          <div class="pt-2">
            <button type="submit"
                    class="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 hover:from-emerald-800 hover:to-slate-800 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2">
              ${icon.checkCircle}<span>تأكيد تسجيل الاهتمام وتوليد تذكرة الحجز الرسمية</span>
            </button>
            <p class="text-[11px] text-slate-400 text-center mt-2">بياناتك محمية ومخصصة حصرياً لـ ${DATA.brand.project}.</p>
          </div>
        </form>
      </div>
    </div>`;

  document.getElementById("booking-lead-form")?.addEventListener("submit", handleBookingSubmit);
}

function handleBookingSubmit(e) {
  e.preventDefault();
  const name    = document.getElementById("b-name")?.value.trim();
  const phone   = document.getElementById("b-phone")?.value.trim();
  const unitId  = document.getElementById("booking-unit-select")?.value;
  const model   = document.getElementById("b-model")?.value;
  const payment = document.getElementById("b-payment")?.value;
  const notes   = document.getElementById("b-notes")?.value.trim() || "لا ملاحظات";

  if (!name || name.length < 3)             { toast("يرجى إدخال الاسم الكريم بشكل صحيح.", "error"); return; }
  if (!phone || !/^0?5[0-9]{8}$/.test(phone.replace(/[\s-]/g, ""))) {
    toast("يرجى إدخال رقم جوال سعودي صالح (مثال: 0500550223).", "error"); return;
  }

  const ticket = `#MS-${Math.floor(1000 + Math.random() * 9000)}`;

  // حفظ في localStorage (محاكاة CRM)
  const leads = JSON.parse(localStorage.getItem("ms_leads") || "[]");
  leads.push({ ticket, name, phone, unitId, model, payment, notes, ts: new Date().toISOString() });
  localStorage.setItem("ms_leads", JSON.stringify(leads));

  openConfirmationModal({ ticket, name, phone, unitId, model, payment, notes });
  e.target.reset();
}

/* ═══════════════════════════════════════════════════
   6. CONFIRMATION MODAL
   ═══════════════════════════════════════════════════ */

function buildModal() {
  const el = document.getElementById("booking-modal");
  if (!el) return;

  el.innerHTML = `
    <div id="modal-box" class="modal-content-box bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-slate-900">
      <button onclick="closeModal()" class="absolute top-5 left-5 text-slate-400 hover:text-slate-700 transition">${icon.close}</button>
      <div class="text-center mb-6">
        <div class="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-3">${icon.checkCircle}</div>
        <span class="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">تم إنشاء تذكرة الحجز بنجاح</span>
        <h3 class="text-xl font-black font-heading text-slate-900 mt-3">شكراً لتسجيل اهتمامك في تاون هاوس الشامخة</h3>
      </div>
      <div id="modal-body" class="bg-slate-50 rounded-2xl border border-slate-200 p-4 mb-6 space-y-2 text-xs"></div>
      <div class="space-y-2">
        <a id="modal-wa-btn" href="#" target="_blank" rel="noopener noreferrer"
           class="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-md">
          ${icon.whatsapp}<span>إرسال التذكرة وتأكيد الموعد عبر الواتساب</span>
        </a>
        <button onclick="closeModal()" class="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition">إغلاق</button>
      </div>
    </div>`;
}

function openConfirmationModal(d) {
  const modal = document.getElementById("booking-modal");
  const body  = document.getElementById("modal-body");
  const waBtn = document.getElementById("modal-wa-btn");
  if (!modal) return;

  const unit = DATA.units.find(u => u.id === Number(d.unitId));
  const unitLabel = unit ? `وحدة ${unit.id} — نموذج ${unit.model} (${unit.area})` : "لم يتم تحديد وحدة";

  if (body) {
    const rows = [
      ["رقم التذكرة",   `<span class="font-black text-emerald-900 font-heading text-sm">${d.ticket}</span>`],
      ["الاسم",         d.name],
      ["الجوال",        d.phone],
      ["النموذج",       `نموذج ${d.model}`],
      ["الوحدة",        unitLabel],
      ["طريقة السداد",  d.payment],
    ];
    body.innerHTML = rows.map(([k,v]) =>
      `<div class="flex items-center justify-between border-b border-slate-100 pb-2 last:border-0 last:pb-0"><span class="text-slate-500">${k}:</span><span class="font-bold text-slate-800">${v}</span></div>`
    ).join("");
  }

  if (waBtn) {
    const msg = `السلام عليكم ورحمة الله وبركاته،
أود تأكيد الحجز في مشروع "${DATA.brand.project}" — ${DATA.brand.city}.
──────────────────────
📌 رقم التذكرة: ${d.ticket}
👤 الاسم: ${d.name}
📱 الجوال: ${d.phone}
🏠 النموذج: نموذج ${d.model}
🔢 الوحدة: ${unitLabel}
💳 طريقة السداد: ${d.payment}
📝 ملاحظات: ${d.notes}
──────────────────────
شاكر لكم.`;
    waBtn.href = waLink(msg);
  }

  modal.classList.remove("hidden");
}

window.closeModal = () => document.getElementById("booking-modal")?.classList.add("hidden");

/* ═══════════════════════════════════════════════════
   7. FOOTER
   ═══════════════════════════════════════════════════ */

function buildFooter() {
  const el = document.getElementById("main-footer");
  if (!el) return;
  const { developer, project, city, district, country, phoneDisplay, whatsapp, workingHours } = DATA.brand;

  const quickLinks = DATA.footerLinks.map(l =>
    `<a href="${l.href}" class="hover:text-white transition">${l.label}</a>`
  ).join("");

  el.innerHTML = `
    <div id="contact-section" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-12 border-b border-slate-800">

        <!-- Brand -->
        <div class="lg:col-span-5 space-y-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-900 text-amber-400 flex items-center justify-center">${icon.building}</div>
            <div>
              <span class="text-base font-black font-heading text-white">${developer}</span>
              <span class="text-[11px] text-slate-400 block">${project} — ${city}</span>
            </div>
          </div>
          <p class="text-xs text-slate-400 leading-relaxed max-w-sm">شركة تطوير عقاري سعودية متخصصة في ابتكار مشاريع سكنية نوعية ومجتمعات تاون هاوس راقية تحقق الاستقلالية وجودة الحياة العائلية.</p>
          <div class="text-xs text-amber-300 font-bold flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>${city} — ${district} — ${country}</span>
          </div>
        </div>

        <!-- Contact -->
        <div class="lg:col-span-4 space-y-3">
          <h4 class="text-xs font-bold text-slate-200 font-heading">قنوات التواصل والمبيعات</h4>
          <ul class="space-y-2 text-xs text-slate-300">
            <li class="flex items-center gap-2"><span class="text-slate-500">الجوال:</span>
              <a href="tel:+${whatsapp}" class="hover:text-amber-400 transition font-bold" dir="ltr">${phoneDisplay}</a>
            </li>
            <li class="flex items-center gap-2"><span class="text-slate-500">الواتساب:</span>
              <a href="${waDefault()}" target="_blank" class="text-emerald-400 hover:text-emerald-300 transition font-bold">محادثة فورية مباشرة</a>
            </li>
            <li class="flex items-center gap-2"><span class="text-slate-500">ساعات العمل:</span><span>${workingHours}</span></li>
          </ul>
        </div>

        <!-- Quick links -->
        <div class="lg:col-span-3 space-y-3">
          <h4 class="text-xs font-bold text-slate-200 font-heading">روابط المشروع السريعة</h4>
          <div class="grid grid-cols-2 gap-2 text-xs text-slate-400">${quickLinks}</div>
        </div>

      </div>
      <div class="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
        <div>جميع الحقوق محفوظة © 2026 <strong class="text-slate-400">${developer}</strong>.</div>
        <div class="text-slate-400">${project} — المطور الحصري المباشر</div>
      </div>
    </div>`;
}

/* ═══════════════════════════════════════════════════
   8. INITIALIZATION & RESILIENCE
   ═══════════════════════════════════════════════════ */

function initApp() {
  const dataObj = (typeof window !== "undefined" && window.DATA) || (typeof DATA !== "undefined" ? DATA : null);
  if (!dataObj) {
    console.warn("DATA not ready yet, retrying in 30ms...");
    setTimeout(initApp, 30);
    return;
  }

  const builders = [
    ["info-bar", buildInfoBar],
    ["main-navbar", buildNavbar],
    ["hero-section", buildHero],
    ["project-tabs", buildProjectTabs],
    ["matrix-section", buildUnitMatrix],
    ["models-section", buildModelsShowcase],
    ["about-section", buildAboutSection],
    ["calc-section", buildCalculator],
    ["booking-section", buildBookingForm],
    ["booking-modal", buildModal],
    ["main-footer", buildFooter],
  ];

  for (const [name, fn] of builders) {
    try {
      fn();
    } catch (err) {
      console.error(`Error rendering ${name}:`, err);
    }
  }
}

// تشغيل فوري إذا كانت الصفحة جاهزة بالفعل، أو الاستماع للحدث
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
  } else {
    initApp();
  }
}
