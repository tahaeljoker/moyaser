import { useState, useMemo } from 'react';
import { Home, MapPin, Bed, Bath, ArrowLeft, Phone, Eye } from 'lucide-react';
import { brand, properties } from '../../data/projectData.js';

const fmt = (n) => new Intl.NumberFormat('en-US').format(n);

export default function PropertiesCatalog({ onOpenInspection }) {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = useMemo(() => [
    { id: 'all', label: 'جميع العروض المتاحة' },
    { id: 'تاون هاوس', label: 'تاون هاوس' },
    { id: 'فلل مستقلة', label: 'فلل مستقلة' },
    { id: 'شقق فاخرة', label: 'شقق تمليك' },
  ], []);

  const filteredProperties = useMemo(() => {
    if (activeCategory === 'all') return properties;
    return properties.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  return (
    <section id="properties-catalog-section" className="py-20 bg-slate-50 border-b border-slate-200" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-emerald-800 font-bold tracking-wider text-xs uppercase bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200/80">
            محفظة المشاريع السكنية
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 font-heading">
            عروض عقارية حصرية ومباشرة من المطور
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
            مجموعة مختارة من الفلل المستقلة، التاون هاوس، وشقق التمليك الفاخرة المتاحة للبيع الفوري.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3 max-w-4xl mx-auto mb-10">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition duration-200 cursor-pointer flex items-center gap-2 ${
                activeCategory === c.id
                  ? 'bg-emerald-900 text-white border-emerald-900 shadow-md ring-2 ring-emerald-900/20'
                  : 'bg-white text-slate-700 border-slate-200/90 hover:border-emerald-600/40 hover:bg-slate-50'
              }`}
            >
              <span>{c.label}</span>
            </button>
          ))}
        </div>

        {/* Grid */}
        {filteredProperties.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Home className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-800 font-heading">
              لا توجد عقارات متاحة حالياً في هذا التصنيف
            </p>
            <p className="text-xs text-slate-500 mt-1">
              يمكنك اختيار تصنيف آخر أو التواصل مع المستشار لحجز طلبك المخصص.
            </p>
            <button
              onClick={() => setActiveCategory('all')}
              className="mt-4 px-4 py-2 bg-emerald-900 text-white rounded-xl text-xs font-bold transition hover:bg-emerald-800"
            >
              عرض جميع العقارات
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
            {filteredProperties.map((p) => {
              const hasPrice = p.price && Number(p.price) > 0;
              return (
                <div
                  key={p.id}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-xs flex flex-col justify-between overflow-hidden group hover:-translate-y-1 hover:shadow-md transition duration-300"
                >
                  {/* Image & Badges */}
                  <div className="relative h-60 sm:h-64 overflow-hidden bg-slate-950">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                    <div className="absolute top-3.5 right-3.5 bg-slate-900/85 backdrop-blur-md text-amber-300 text-xs px-3 py-1 rounded-xl font-bold border border-white/10 shadow-xs">
                      {p.category}
                    </div>

                    <div className="absolute top-3.5 left-3.5 bg-emerald-900/90 backdrop-blur-md text-emerald-100 text-[11px] px-2.5 py-1 rounded-xl font-bold border border-emerald-500/20 shadow-xs flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{p.badge || 'جاهز للإفراغ الفوري'}</span>
                    </div>

                    <div className="absolute bottom-3 right-3 left-3 text-white flex items-center gap-1.5 text-xs">
                      <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      <span className="font-semibold drop-shadow-xs truncate">{p.cityDistrict}</span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-5 sm:p-6 flex flex-col justify-between flex-1 gap-4">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold font-heading text-slate-900 group-hover:text-emerald-900 transition-colors leading-snug mb-2">
                        {p.title}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-4">
                        {p.description}
                      </p>

                      <div className="py-3 px-3.5 rounded-2xl bg-slate-50 border border-slate-100/90 flex items-center justify-between mb-3.5">
                        <span className="text-xs font-semibold text-slate-500">السعر:</span>
                        <div className="text-left flex items-baseline gap-1">
                          {hasPrice ? (
                            <>
                              <span className="text-lg sm:text-xl font-black text-emerald-950 font-heading">
                                {fmt(p.price)}
                              </span>
                              <span className="text-xs font-bold text-emerald-800">ر.س</span>
                            </>
                          ) : (
                            <span className="text-xs font-bold text-emerald-900 font-heading">
                              تواصل لمعرفة السعر
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2 rounded-xl bg-white border border-slate-200/80">
                          <span className="text-[10px] text-slate-400 block mb-0.5">المساحة</span>
                          <span className="text-xs font-bold text-slate-800 font-heading">{p.area}</span>
                        </div>
                        <div className="p-2 rounded-xl bg-white border border-slate-200/80">
                          <span className="text-[10px] text-slate-400 block mb-0.5">غرف النوم</span>
                          <span className="text-xs font-bold text-slate-800 font-heading">{p.beds} غرف</span>
                        </div>
                        <div className="p-2 rounded-xl bg-white border border-slate-200/80">
                          <span className="text-[10px] text-slate-400 block mb-0.5">دورات المياه</span>
                          <span className="text-xs font-bold text-slate-800 font-heading">{p.baths}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => onOpenInspection({ propertyId: p.id })}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>طلب معاينة ميدانية</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
