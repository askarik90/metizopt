import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = Number(process.env.SMTP_PORT) || 465;
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";
const NOTIFY_TO = process.env.NOTIFY_EMAIL || "140@bugel.kz";
const NOTIFY_CC = process.env.NOTIFY_EMAIL_CC || "marketingbugel1@gmail.com";

export interface LeadEmailData {
  name: string;
  phone: string;
  company?: string;
  city?: string;
  message?: string;
  category?: string;
  searchQuery?: string;
  pageUrl?: string;
  utm_source?: string;
  utm_campaign?: string;
}

export async function sendLeadNotification(lead: LeadEmailData): Promise<void> {
  if (!SMTP_USER || !SMTP_PASS) {
    // Раньше тут был тихий return — из-за него форма считала письмо «отправленным»
    // и показывала ложный «успех», хотя заявка никуда не уходила. Теперь — честная ошибка.
    console.error("SMTP_USER/SMTP_PASS not set — lead email NOT sent");
    throw new Error("SMTP not configured");
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  const source = lead.utm_source
    ? `${lead.utm_source}${lead.utm_campaign ? ` / ${lead.utm_campaign}` : ""}`
    : lead.pageUrl || "прямой переход";

  const html = `<!DOCTYPE html>
    <html><head><meta charset="UTF-8"><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"></head><body>
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
          ${lead.searchQuery ? `
          <tr>
            <td style="padding:8px 0;color:#64748b;vertical-align:top">Искал на сайте</td>
            <td style="padding:8px 0;color:#0f172a;font-style:italic">"${lead.searchQuery}"</td>
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
          Все заявки: <a href="https://krp.kz/admin/dashboard" style="color:#ea580c">krp.kz/admin/dashboard</a>
        </div>
      </div>
    </div>
    </body></html>
  `;

  await transporter.sendMail({
    from: `KRP.kz <${SMTP_USER}>`,
    to: NOTIFY_TO,
    cc: NOTIFY_CC,
    subject: `📦 Новая заявка: ${lead.name} — ${lead.phone}`,
    html,
    encoding: "utf8",
  });
}
