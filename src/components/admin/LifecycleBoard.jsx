import { CheckCircle2, XCircle, Wallet, Landmark, ClipboardCheck, Home } from 'lucide-react';
import {
  LIFECYCLE_STAGES,
  PAPER_ITEMS,
  arePapersComplete,
  isUnitSold,
  getFinancingBadge,
  getDepositBadge,
  groupLeadsByStage,
} from '../../utils/leadLifecycle.js';

const TONE_CLASSES = {
  emerald: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  amber: 'bg-amber-50 text-amber-800 border-amber-200',
  rose: 'bg-rose-50 text-rose-700 border-rose-200',
  slate: 'bg-slate-100 text-slate-600 border-slate-200',
};

const SUB_STATUS_LABELS = {
  papers_review: 'مراجعة الأوراق',
  inspection: 'مرحلة المعاينة',
  handover: 'مرحلة التسليم',
};

export default function LifecycleBoard({ leads = [], onTogglePaper, onChangeSubStatus }) {
  const grouped = groupLeadsByStage(leads);

  return (
    <div className="space-y-4" dir="rtl">
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-xs text-amber-900 font-medium">
        معاينة محلية تفاعلية ببيانات تجريبية فقط — عرض حالة الوحدة كمباعة للعرض فقط ولا يكتب إلى المخزون.
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        {LIFECYCLE_STAGES.map((stage) => {
          const items = grouped[stage.id] || [];
          return (
            <section
              key={stage.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
            >
              <header className="px-4 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 font-heading">{stage.title}</h2>
                  <p className="text-[11px] text-slate-500 mt-0.5">{stage.subtitle}</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white border border-slate-200 text-slate-700 tabular-nums">
                  {items.length}
                </span>
              </header>

              <div className="p-3.5 space-y-3">
                {items.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6">لا توجد طلبات في هذه المرحلة</p>
                ) : (
                  items.map((lead) => {
                    const financing = getFinancingBadge(lead);
                    const deposit = getDepositBadge(lead);
                    const papersDone = arePapersComplete(lead);
                    const sold = isUnitSold(lead);

                    return (
                      <article
                        key={lead.id}
                        className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 space-y-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-xs font-bold text-slate-900">{lead.fullName}</h3>
                            <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 font-mono tabular-nums">
                              <span>{lead.unitCode}</span>
                              <span>•</span>
                              <span dir="ltr">{lead.phone}</span>
                            </div>
                          </div>

                          {sold && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-800 text-white shrink-0">
                              <Home className="w-3 h-3" />
                              <span>مباع</span>
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold border ${TONE_CLASSES[financing.tone]}`}>
                            <Landmark className="w-3 h-3 shrink-0" />
                            <span>{financing.label}</span>
                          </span>
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold border ${TONE_CLASSES[deposit.tone]}`}>
                            <Wallet className="w-3 h-3 shrink-0" />
                            <span>{deposit.label}</span>
                          </span>
                        </div>

                        <div className="bg-white rounded-lg border border-slate-200/80 p-2.5 space-y-1.5">
                          <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                            <span className="inline-flex items-center gap-1">
                              <ClipboardCheck className="w-3.5 h-3.5 text-emerald-800" />
                              <span>قائمة الأوراق</span>
                            </span>
                            <span className={papersDone ? 'text-emerald-700' : 'text-amber-700'}>
                              {papersDone ? 'مكتملة' : 'ناقصة'}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-1.5 pt-1">
                            {PAPER_ITEMS.map((p) => {
                              const checked = Boolean(lead.papers?.[p.id]);
                              return (
                                <button
                                  key={p.id}
                                  type="button"
                                  onClick={() => onTogglePaper && onTogglePaper(lead.id, p.id)}
                                  className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded border text-right transition ${
                                    checked
                                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                                      : 'bg-slate-50 border-slate-200 text-slate-500'
                                  }`}
                                >
                                  {checked ? (
                                    <CheckCircle2 className="w-3 h-3 text-emerald-700 shrink-0" />
                                  ) : (
                                    <XCircle className="w-3 h-3 text-slate-400 shrink-0" />
                                  )}
                                  <span className="truncate">{p.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {stage.id === 'closing' && (
                          <div className="flex items-center justify-between gap-2 pt-1 text-[11px]">
                            <span className="text-slate-600 font-medium">حالة المرحلة:</span>
                            <div className="flex items-center gap-1">
                              {Object.entries(SUB_STATUS_LABELS).map(([key, label]) => (
                                <button
                                  key={key}
                                  type="button"
                                  onClick={() => onChangeSubStatus && onChangeSubStatus(lead.id, key)}
                                  className={`px-2 py-0.5 rounded-md border text-[10px] font-semibold transition ${
                                    lead.subStatus === key
                                      ? 'bg-emerald-800 border-emerald-800 text-white'
                                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                                  }`}
                                >
                                  {label}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </article>
                    );
                  })
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
