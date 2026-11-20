export default function StatusBadge({ status, label }) {
  if (status === 'available') {
    return (
      <span className="bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
        {label || 'متاح'}
      </span>
    );
  }

  if (status === 'reserved') {
    return (
      <span className="bg-amber-50 text-amber-800 border border-amber-200/80 px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        {label || 'محجوز'}
      </span>
    );
  }

  return (
    <span className="bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-sm">
      {label || 'مباع'}
    </span>
  );
}
