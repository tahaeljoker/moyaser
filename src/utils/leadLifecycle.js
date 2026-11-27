export const LIFECYCLE_STAGES = [
  {
    id: 'inquiry_recorded',
    title: '١. تسجيل الاستفسار',
    subtitle: 'استلام الطلب والتواصل المبدئي',
  },
  {
    id: 'reservation',
    title: '٢. الحجز والتمويل',
    subtitle: 'التمويل المستقل وسداد العربون',
  },
  {
    id: 'closing',
    title: '٣. الأوراق والمعاينة والتسليم',
    subtitle: 'اكتمال الأوراق ثم المعاينة والتسليم',
  },
];

export const PAPER_ITEMS = [
  { id: 'nationalId', label: 'الهوية الوطنية' },
  { id: 'financingApproval', label: 'إثبات التمويل المستقل' },
  { id: 'depositReceipt', label: 'إيصال العربون' },
  { id: 'allocationForm', label: 'نموذج التخصيص' },
];

export function getLeadStage(lead) {
  const valid = LIFECYCLE_STAGES.map((s) => s.id);
  return valid.includes(lead?.stage) ? lead.stage : 'inquiry_recorded';
}

export function arePapersComplete(lead) {
  const papers = lead?.papers || {};
  return PAPER_ITEMS.every((item) => Boolean(papers[item.id]));
}

/**
 * Display-only rule: a unit is shown as sold only when papers are complete
 * AND the lead is in stage 3 ('closing') at 'inspection' or 'handover'.
 * Never mutates or writes to unit inventory.
 */
export function isUnitSold(lead) {
  if (getLeadStage(lead) !== 'closing') return false;
  if (!arePapersComplete(lead)) return false;
  return lead?.subStatus === 'inspection' || lead?.subStatus === 'handover';
}

export function getFinancingBadge(lead) {
  if (lead?.financingType === 'cash') {
    return { label: 'دفع نقدي (كاش)', tone: 'emerald' };
  }
  if (lead?.financingIndependent) {
    return {
      label: lead?.financingApproved ? 'تمويل مستقل معتمد' : 'تمويل مستقل (قيد الإجراء)',
      tone: lead?.financingApproved ? 'emerald' : 'amber',
    };
  }
  return { label: 'بانتظار تحديد التمويل', tone: 'slate' };
}

export function getDepositBadge(lead) {
  if (lead?.depositPaid) {
    const amount = Number(lead.depositAmount) > 0 ? ` (${Number(lead.depositAmount).toLocaleString('en-US')} ر.س)` : '';
    return { label: `تم سداد العربون${amount}`, tone: 'emerald' };
  }
  return { label: 'بانتظار العربون', tone: 'rose' };
}

export function groupLeadsByStage(leads = []) {
  const grouped = {
    inquiry_recorded: [],
    reservation: [],
    closing: [],
  };
  for (const lead of leads) {
    grouped[getLeadStage(lead)].push(lead);
  }
  return grouped;
}
