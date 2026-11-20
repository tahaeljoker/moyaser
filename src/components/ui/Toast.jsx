import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      {toasts.map((t) => {
        const isSuccess = t.type === 'success';
        const isError = t.type === 'error';

        const bgClass = isSuccess
          ? 'bg-emerald-950 text-emerald-100 border-emerald-700'
          : isError
          ? 'bg-rose-950 text-rose-100 border-rose-700'
          : 'bg-slate-900 text-slate-100 border-slate-700';

        const dotClass = isSuccess
          ? 'text-emerald-400'
          : isError
          ? 'text-rose-400'
          : 'text-amber-400';

        return (
          <div
            key={t.id}
            className={`p-4 rounded-xl border shadow-xl flex items-center justify-between gap-3 text-xs pointer-events-auto transform transition duration-300 ${bgClass}`}
          >
            <div className="flex items-center gap-2">
              {isSuccess && <CheckCircle2 className={`w-4 h-4 ${dotClass}`} />}
              {isError && <AlertCircle className={`w-4 h-4 ${dotClass}`} />}
              {!isSuccess && !isError && <Info className={`w-4 h-4 ${dotClass}`} />}
              <span className="font-medium leading-relaxed">{t.message}</span>
            </div>
            <button
              onClick={() => onDismiss(t.id)}
              className="opacity-60 hover:opacity-100 transition p-1"
              aria-label="إغلاق"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
