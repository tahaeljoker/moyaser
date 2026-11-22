// Branded Unit Brochure Print & PDF Utility for Muyassar Real Estate

export const triggerBrochurePrint = (model, brand) => {
  if (!model) return;

  const originalTitle = document.title;
  const fileName = `بروشور_معماري_تاون_هاوس_الشامخة_نموذج_${model.code}_ميسر_للتطوير_العقاري`;

  // Set document title to format default PDF file name when saving
  document.title = fileName;

  const restoreTitle = () => {
    document.title = originalTitle;
    window.removeEventListener('afterprint', restoreTitle);
  };

  window.addEventListener('afterprint', restoreTitle);

  // Trigger browser print dialog (which supports Save as PDF natively)
  window.print();

  // Safety fallback to restore title in case afterprint does not fire
  setTimeout(() => {
    document.title = originalTitle;
  }, 3000);
};

export const getBrochureWhatsAppUrl = (model, brand) => {
  const phone = brand?.whatsapp || '966500550223';
  const text = encodeURIComponent(
    `السلام عليكم ورحمة الله، أود الاستفسار عن تفاصيل نموذج ${model?.code || ''} (${model?.name || ''}) بمشروع تاون هاوس الشامخة بالدمام.`
  );
  return `https://wa.me/${phone}?text=${text}`;
};

export const formatBrochureDate = () => {
  try {
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date());
  } catch {
    return new Date().toLocaleDateString('ar-EG');
  }
};
