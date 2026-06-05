import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Получатель уведомлений — из настроек или fallback
const NOTIFY_TO = process.env.NOTIFY_EMAIL || "140@bugel.kz";
const FROM = process.env.RESEND_FROM || "KRP.kz <onboarding@resend.dev>";

export interface LeadEmailData {
  name: string;
  phone: string;
  company?: string;
  city?: string;
  message?: string;
  category?: string;
  pageUrl?: string;
  utm_source?: string;
  utm_campaign?: string;
}

export async function sendLeadNotification(lead: LeadEmailData): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.log("⚠️  RESEND_API_KEY not set — email skipped");
    return;
  }

  const source = lead.utm_source
    ? `${lead.utm_source}${lead.utm_campaign ? ` / ${lead.utm_campaign}` : ""}`
    : lead.pageUrl || "прямой переход";

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:#ea580c;padding:20px 24px;border-radius:8px 8px 0 0">
        <h1 style="color:#fff;margin:0;font-size:20px">🔔 Новая заявка — KRP.kz</h1>
      </div>
      <div style="background:#f8fafc;padding:24px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px">
        <table style="width:100%;border-collapse:collapse">
          <tr>
            <td style="padding:8px 0;color:#64748b;width:140px;vertical-align:top">Имя</td>
            <td style="padding:8px 0;font-weight:bold;color:#0f172a">${lead.name}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#64748b;vertical-align:top">Телефон</td>
            <td style="padding:8px 0;font-weight:bold;color:#0f172a">
              <a href="tel:${lead.phone}" style="color:#ea580c">${lead.phone}</a>
            </td>
          </tr>
          ${lead.company ? `
          <tr>
            <td style="padding:8px 0;color:#64748b;vertical-align:top">Компания</td>
            <td style="padding:8px 0;color:#0f172a">${lead.company}</td>
          </tr>` : ""}
          ${lead.city ? `
          <tr>
            <td style="padding:8px 0;color:#64748b;vertical-align:top">Город</td>
            <td style="padding:8px 0;color:#0f172a">${lead.city}</td>
          </tr>` : ""}
          ${lead.category ? `
          <tr>
            <td style="padding:8px 0;color:#64748b;vertical-align:top">Интерес</td>
            <td style="padding:8px 0;color:#0f172a">${lead.category}</td>
          </tr>` : ""}
          ${lead.message ? `
          <tr>
            <td style="padding:8px 0;color:#64748b;vertical-align:top">Сообщение</td>
            <td style="padding:8px 0;color:#0f172a">${lead.message}</td>
          </tr>` : ""}
          <tr>
            <td style="padding:8px 0;color:#64748b;vertical-align:top">Источник</td>
            <td style="padding:8px 0;color:#0f172a">${source}</td>
          </tr>
        </table>
        <div style="margin-top:20px;padding-top:16px;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8">
          Все заявки: <a href="https://krp.kz/admin/leads" style="color:#ea580c">krp.kz/admin/leads</a>
        </div>
      </div>
    </div>
  `;

  await resend.emails.send({
    from: FROM,
    to: [NOTIFY_TO],
    subject: `📦 Новая заявка: ${lead.name} — ${lead.phone}`,
    html,
  });
}
