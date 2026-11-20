import { ArrowLeft } from 'lucide-react';
import { brand, upcoming } from '../../data/projectData.js';

export default function UpcomingProjects() {
  const waLink = (title) =>
    `https://api.whatsapp.com/send?phone=${brand.whatsapp}&text=${encodeURIComponent(
      `السلام عليكم، أود تسجيل اهتمامي المبكر بمشروع: ${title}`
    )}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h3 className="text-2xl font-black text-slate-900 font-heading mb-2">
          مشاريع قيد التطوير بالمنطقة الشرقية
        </h3>
        <p className="text-xs text-slate-600">
          سجّل اهتمامك المبكر للحصول على أولوية الاختيار وأسعار الطرح الأولي.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {upcoming.map((p, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition"
          >
            <div className="relative h-56 overflow-hidden">
              <img
                src={p.image}
                alt={p.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-amber-300 text-xs px-3 py-1.5 rounded-lg font-bold">
                {p.status}
              </div>
            </div>
            <div className="p-6">
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md inline-block mb-2">
                موعد الطرح: {p.launchDate}
              </span>
              <h3 className="text-lg font-bold text-slate-900 font-heading mb-2">{p.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">{p.desc}</p>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">{p.type}</span>
                <a
                  href={waLink(p.title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
                >
                  <span>سجّل اهتمامك المبكر</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
