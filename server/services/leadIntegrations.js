function formatPhone(raw) {
  if (!raw) return '';
  const digits = String(raw).replace(/\D/g, '');
  if (digits.startsWith('966')) return digits;
  if (digits.startsWith('05')) return `966${digits.slice(1)}`;
  if (digits.startsWith('5') && digits.length === 9) return `966${digits}`;
  return digits;
}

export async function syncLeadToGoogleSheet(lead) {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!webhookUrl) return;
  try {
    const payload = {
      ticket: lead?.ticketNumber || '',
      name: lead?.fullName || '',
      phone: lead?.phone || '',
      projectName: lead?.projectName || '',
      unitCode: lead?.unitCode || '',
      modelCode: lead?.modelCode || lead?.model || '',
      status: lead?.stage || 'prospective',
      notes: lead?.notes || '',
      createdAt: lead?.createdAt ? new Date(lead.createdAt).toISOString() : new Date().toISOString(),
    };
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.warn('[Google Sheets Sync Error]', err.message);
  }
}

export async function notifySalesViaWhatsApp(lead, project = null) {
  const apiUrl = process.env.WHATSAPP_API_URL;
  const instanceId = process.env.WHATSAPP_INSTANCE_ID;
  const apiToken = process.env.WHATSAPP_API_TOKEN;
  if (!apiUrl || !instanceId || !apiToken) return;

  const targetRecipient = project?.whatsappNumber || process.env.SALES_WHATSAPP_NUMBER || process.env.ADMIN_WHATSAPP_NUMBER;
  if (!targetRecipient) return;

  try {
    const formattedPhone = formatPhone(targetRecipient);
    if (!formattedPhone) return;

    const endpoint = `${apiUrl.replace(/\/$/, '')}/waInstance${instanceId}/sendMessage/${apiToken}`;
    const projectName = lead?.projectName || project?.name || 'غير محدد';
    const unitCode = lead?.unitCode || 'استفسار عام';
    const ticket = lead?.ticketNumber || 'بدون تذكرة';
    const adminUrl = process.env.APP_URL ? `${process.env.APP_URL.replace(/\/$/, '')}/admin` : '/admin';

    const message = [
      'تنبيه طلب جديد - منصة ميسر للتطوير العقاري',
      '--------------------------------',
      `المشروع: ${projectName}`,
      `العميل: ${lead?.fullName || '-'}`,
      `الجوال: ${lead?.phone || '-'}`,
      `الوحدة: ${unitCode}`,
      `رقم التذكرة: ${ticket}`,
      `طريقة السداد: ${lead?.paymentMethod || 'غير محدد'}`,
      `رابط المتابعة: ${adminUrl}`,
    ].join('\n');

    await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chatId: `${formattedPhone}@c.us`,
        message,
      }),
    });
  } catch (err) {
    console.warn('[WhatsApp Sales Alert Error]', err.message);
  }
}
