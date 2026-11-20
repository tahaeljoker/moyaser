/**
 * WhatsApp Notification Service via Green-API (or compatible gateway)
 * Non-blocking: failures will never throw or disrupt HTTP request flow.
 */

function formatChatId(rawPhone) {
  if (!rawPhone) return null;
  const digits = rawPhone.replace(/\D/g, '');
  if (digits.startsWith('966')) {
    return `${digits}@c.us`;
  }
  if (digits.startsWith('05')) {
    return `966${digits.slice(1)}@c.us`;
  }
  if (digits.startsWith('5') && digits.length === 9) {
    return `966${digits}@c.us`;
  }
  return `${digits}@c.us`;
}

function getWhatsAppClient() {
  const apiUrl = process.env.WHATSAPP_API_URL;
  const instanceId = process.env.WHATSAPP_INSTANCE_ID;
  const apiToken = process.env.WHATSAPP_API_TOKEN;

  if (!apiUrl || !instanceId || !apiToken) {
    return null;
  }

  const endpoint = `${apiUrl.replace(/\/$/, '')}/waInstance${instanceId}/sendMessage/${apiToken}`;
  return { endpoint };
}

async function sendTextMessage(endpoint, chatId, message) {
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId, message }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.warn(`[WhatsApp Service] API warning (${res.status}): ${errText}`);
    }
  } catch (error) {
    console.warn(`[WhatsApp Service] Network dispatch error: ${error.message}`);
  }
}

export async function sendLeadNotifications(lead, unit = null, agentPhone = null) {
  const client = getWhatsAppClient();
  if (!client) {
    return;
  }

  const adminNumber = process.env.ADMIN_WHATSAPP_NUMBER;
  const customerPhone = lead.phone;
  const cleanCustomerDigits = customerPhone.replace(/\D/g, '').replace(/^0/, '966');

  const requestTypeArabic = {
    booking: 'حجز وحدة سكنية',
    inspection: 'طلب معاينة ميدانية',
    waitlist: 'تسجيل في قائمة الانتظار',
  }[lead.requestType] || 'طلب عام';

  const unitDetails = unit
    ? `الوحدة: ${unit.unitCode} (نموذج ${unit.model} — ${unit.area})`
    : lead.unitCode
    ? `الوحدة: ${lead.unitCode}`
    : 'لم يتم تحديد وحدة معينة';

  const visitDetails =
    lead.visitDate && lead.visitTime
      ? `الموعد المقترح: ${lead.visitDate} — ${lead.visitTime}`
      : '';

  // 1. Alert to Admin & Assigned Sales Agent
  const targetNumbers = [...new Set([adminNumber, agentPhone].filter(Boolean))];
  for (const num of targetNumbers) {
    const alertChatId = formatChatId(num);
    if (alertChatId) {
      const alertMessage = [
        'إشعار طلب جديد — منصة ميسر للتطوير العقاري',
        '──────────────────────',
        `نوع الطلب: ${requestTypeArabic}`,
        `رقم التذكرة: ${lead.ticketNumber}`,
        `اسم العميل: ${lead.fullName}`,
        `رقم الجوال: ${lead.phone}`,
        `رابط المحادثة: https://wa.me/${cleanCustomerDigits}`,
        lead.assignedAgentName ? `المستشار المسؤول: ${lead.assignedAgentName}` : '',
        unitDetails,
        visitDetails,
        lead.paymentMethod ? `طريقة السداد: ${lead.paymentMethod}` : '',
        lead.notes ? `ملاحظات العميل: ${lead.notes}` : '',
        '──────────────────────',
        `التاريخ: ${new Date().toLocaleString('ar-SA')}`,
      ]
        .filter(Boolean)
        .join('\n');

      sendTextMessage(client.endpoint, alertChatId, alertMessage).catch(() => {});
    }
  }

  // 2. Confirmation to Customer
  const customerChatId = formatChatId(customerPhone);
  if (customerChatId) {
    const customerMessage = [
      'السلام عليكم ورحمة الله وبركاته',
      'شكراً لتواصلك مع شركة ميسر للتطوير العقاري.',
      '──────────────────────',
      `تم استلام طلبك بنجاح (${requestTypeArabic}).`,
      `رقم التذكرة المرجعي: ${lead.ticketNumber}`,
      unitDetails,
      visitDetails,
      '──────────────────────',
      'يقوم مستشار المبيعات بمراجعة التفاصيل وسيتواصل معك قريباً لتأكيد الموعد وإتمام الإجراءات.',
    ]
      .filter(Boolean)
      .join('\n');

    sendTextMessage(client.endpoint, customerChatId, customerMessage).catch(() => {});
  }
}

export default sendLeadNotifications;
