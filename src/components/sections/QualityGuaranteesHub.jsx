import { useState, useMemo } from 'react';
import { ShieldCheck, Award, Wrench, Handshake, Check } from 'lucide-react';
import { specs } from './TechnicalSpecs.jsx';
import { guarantees } from './ProjectGuarantees.jsx';
import { afterSalesServices, partners } from './AfterSalesPartners.jsx';

export default function QualityGuaranteesHub({ visibleSections: vs }) {
  const tabs = useMemo(() => [
    vs?.specs !== false && { id: 'specs', label: 'المواصفات الفنية', icon: ShieldCheck },
    vs?.guarantees !== false && { id: 'guarantees', label: 'الضمانات والتأمين', icon: Award },
    vs?.afterSales !== false && { id: 'afterSales', label: 'خدمات ما بعد البيع', icon: Wrench },
  ].filter(Boolean), [vs]);

  const [activeTab, setActiveTab] = useState(tabs[0]?.id || 'specs');

  if (tabs.length === 0 && vs?.partners === false) return null;

  return (
    <section id="quality-section" className="py-14 md:py-20 bg-white border-b border-slate-200" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-2">
            <Handshake className="w-3.5 h-3.5 text-emerald-800" />
            <span>الجودة والضمانات المعتمدة</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
            بناء مستدام وضمانات موثقة تحمي استثمارك
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            مواصفات هندسية مطابقة لكود البناء السعودي مع تغطية تأمينية وضمانات تمتد حتى 25 سنة.
          </p>
        </div>

        {/* 3 Sleek Light-Mode Tabs */}
        {tabs.length > 1 && (
          <div className="flex items-center justify-center gap-2 mb-10 overflow-x-auto pb-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = (activeTab || tabs[0]?.id) === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-emerald-900 text-white border-emerald-900 shadow-sm ring-2 ring-emerald-900/20'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Tab 1: Technical Specs */}
        {(activeTab || tabs[0]?.id) === 'specs' && vs?.specs !== false && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {specs.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between transition duration-500 ease-out hover:-translate-y-0.5 hover:shadow-xs">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-emerald-800 mb-3 shadow-xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1.5">{item.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Guarantees */}
        {(activeTab || tabs[0]?.id) === 'guarantees' && vs?.guarantees !== false && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {guarantees.map((item, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between transition duration-500 ease-out hover:-translate-y-0.5 hover:shadow-xs">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-bold font-mono">
                      <Check className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{item.period}</span>
                    </span>
                    <Award className="w-4 h-4 text-amber-600" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1.5">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: After-Sales Services */}
        {(activeTab || tabs[0]?.id) === 'afterSales' && vs?.afterSales !== false && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
            {afterSalesServices.map((srv, idx) => {
              const Icon = srv.icon;
              return (
                <div key={idx} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs transition duration-500 ease-out hover:-translate-y-0.5 hover:shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-emerald-800 mb-3 shadow-xs">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2">{srv.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{srv.desc}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Partners Strip (when vs?.partners !== false) */}
        {vs?.partners !== false && (
          <div className="pt-8 border-t border-slate-200">
            <div className="text-center mb-5">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                شركاء التوريد والتنفيذ المعتمدون
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {partners.map((p, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <div className="text-sm font-black text-slate-900 font-heading mb-0.5">{p.name}</div>
                  <div className="text-[11px] font-bold text-emerald-800">{p.label}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{p.role}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
