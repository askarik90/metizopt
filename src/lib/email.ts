import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = Number(process.env.SMTP_PORT) || 465;
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";
// Кому письмо о заявке (решение владельца 24.09.2026): с рекламы — менеджеру рекламной воронки (Айгерим),
// остальные — в отдел продаж. Старую переменную NOTIFY_EMAIL (140@bugel.kz, колл-центр) намеренно НЕ читаем:
// если она осталась в настройках Vercel, она перебила бы новую маршрутизацию.
const NOTIFY_ADS = process.env.NOTIFY_EMAIL_ADS || "131@bugel.kz";
const NOTIFY_OTHER = process.env.NOTIFY_EMAIL_OTHER || "sales@bugel.kz";
const NOTIFY_CC = process.env.NOTIFY_EMAIL_CC || "marketingbugel1@gmail.com";
// Маячки wa-click нужны только CRM (она читает ящик отправителя по FROM) — людям их не шлём (было 137 шт в 140@).
const BEACON_TO = process.env.BEACON_EMAIL || SMTP_USER;

/** Заявка пришла по клику на объявление: метка Google Ads или платная UTM. */
function isFromAds(lead: LeadEmailData): boolean {
  return Boolean(lead.gclid || lead.gbraid || lead.wbraid || (lead.utm_medium || "").toLowerCase() === "cpc");
}

// Экранирование пользовательских полей в HTML письма (защита от инъекций)
const esc = (s = "") =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));

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
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  landing_page?: string;
  whatsapp?: string;
  ga_client_id?: string;
  ga_session_id?: string;
  attachment?: { filename: string; content: Buffer };
}

function getTransporter() {
  if (!SMTP_USER || !SMTP_PASS) {
    throw new Error("SMTP not configured");
  }
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

export async function sendLeadNotification(lead: LeadEmailData): Promise<void> {
  if (!SMTP_USER || !SMTP_PASS) {
    // Раньше тут был тихий return — из-за него форма считала письмо «отправленным»
    // и показывала ложный «успех», хотя заявка никуда не уходила. Теперь — честная ошибка.
    console.error("SMTP_USER/SMTP_PASS not set — lead email NOT sent");
    throw new Error("SMTP not configured");
  }

  const transporter = getTransporter();

  const source = esc(
    lead.utm_source
      ? `${lead.utm_source}${lead.utm_campaign ? ` / ${lead.utm_campaign}` : ""}`
      : lead.pageUrl || "прямой переход",
  );
  const v = {
    name: esc(lead.name),
    phone: esc(lead.phone),
    company: esc(lead.company || ""),
    city: esc(lead.city || ""),
    category: esc(lead.category || ""),
    searchQuery: esc(lead.searchQuery || ""),
    message: esc(lead.message || "").replace(/\n/g, "<br>"),
  };

  // Машиночитаемый блок для CRM «Хаб лидов»: полные данные + атрибуция (gclid/UTM).
  // CRM ловит LEADHUB-JSON:{...}:LEADHUB и берёт поля напрямую (см. email_collector.parse_lead_email).
  const crmParts: string[] = [];
  if (lead.company) crmParts.push(`Компания: ${lead.company}`);
  if (lead.city) crmParts.push(`Город: ${lead.city}`);
  if (lead.category) crmParts.push(`Интерес: ${lead.category}`);
  if (lead.searchQuery) crmParts.push(`Искал: ${lead.searchQuery}`);
  if (lead.whatsapp) crmParts.push(`WhatsApp: ${lead.whatsapp}`);
  if (lead.message) crmParts.push(lead.message);
  const crmJson = {
    name: lead.name,
    phone: lead.phone,
    message: crmParts.join("\n"),
    utm_source: lead.utm_source || "",
    utm_medium: lead.utm_medium || "",
    utm_campaign: lead.utm_campaign || "",
    utm_content: lead.utm_content || "",
    utm_term: lead.utm_term || "",
    gclid: lead.gclid || lead.gbraid || lead.wbraid || "",
    landing_page: lead.landing_page || lead.pageUrl || "",
    ga_client_id: lead.ga_client_id || "",
    ga_session_id: lead.ga_session_id || "",
  };
  const jsonBlock = `LEADHUB-JSON:${JSON.stringify(crmJson)}:LEADHUB`;

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
            <td style="padding:8px 0;font-weight:bold;color:#0f172a">${v.name}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#64748b;vertical-align:top">Телефон</td>
            <td style="padding:8px 0;font-weight:bold;color:#0f172a">
              <a href="tel:${v.phone}" style="color:#ea580c">${v.phone}</a>
            </td>
          </tr>
          ${lead.company ? `
          <tr>
            <td style="padding:8px 0;color:#64748b;vertical-align:top">Компания</td>
            <td style="padding:8px 0;color:#0f172a">${v.company}</td>
          </tr>` : ""}
          ${lead.city ? `
          <tr>
            <td style="padding:8px 0;color:#64748b;vertical-align:top">Город</td>
            <td style="padding:8px 0;color:#0f172a">${v.city}</td>
          </tr>` : ""}
          ${lead.category ? `
          <tr>
            <td style="padding:8px 0;color:#64748b;vertical-align:top">Интерес</td>
            <td style="padding:8px 0;color:#0f172a">${v.category}</td>
          </tr>` : ""}
          ${lead.searchQuery ? `
          <tr>
            <td style="padding:8px 0;color:#64748b;vertical-align:top">Искал на сайте</td>
            <td style="padding:8px 0;color:#0f172a;font-style:italic">"${v.searchQuery}"</td>
          </tr>` : ""}
          ${lead.message ? `
          <tr>
            <td style="padding:8px 0;color:#64748b;vertical-align:top">Сообщение</td>
            <td style="padding:8px 0;color:#0f172a">${v.message}</td>
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
    <div style="display:none;color:#fff;font-size:1px">${jsonBlock}</div>
    </body></html>
  `;

  const fromAds = isFromAds(lead);
  await transporter.sendMail({
    from: `KRP.kz <${SMTP_USER}>`,
    to: fromAds ? NOTIFY_ADS : NOTIFY_OTHER,
    cc: NOTIFY_CC,
    // \r\n из полей убираем — защита от инъекции заголовков
    subject: `${fromAds ? "🎯 " : ""}📦 Новая заявка: ${lead.name.replace(/[\r\n]+/g, " ")} — ${lead.phone.replace(/[\r\n]+/g, " ")}`,
    html,
    attachments: lead.attachment ? [lead.attachment] : undefined,
    encoding: "utf8",
  });
}

/**
 * Отправляет маячок WhatsApp-клика в CRM
 * Тот же SMTP-конфиг, что и для лидов
 */
export interface WaClickBeaconFields {
  token: string;
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  landing_page?: string;
  ga_client_id?: string;
  ga_session_id?: string;
}

export async function sendWaClickBeacon(fields: WaClickBeaconFields): Promise<void> {
  if (!SMTP_USER || !SMTP_PASS) {
    console.error("SMTP_USER/SMTP_PASS not set — wa-click beacon NOT sent");
    throw new Error("SMTP not configured");
  }

  const transporter = getTransporter();

  // Машиночитаемый блок для CRM: тот же формат, что в лидах
  const crmJson = {
    type: "wa_click",
    token: fields.token,
    gclid: fields.gclid || "",
    gbraid: fields.gbraid || "",
    wbraid: fields.wbraid || "",
    utm_source: fields.utm_source || "",
    utm_medium: fields.utm_medium || "",
    utm_campaign: fields.utm_campaign || "",
    utm_content: fields.utm_content || "",
    utm_term: fields.utm_term || "",
    landing_page: fields.landing_page || "",
    ga_client_id: fields.ga_client_id || "",
    ga_session_id: fields.ga_session_id || "",
  };
  const jsonBlock = `LEADHUB-JSON:${JSON.stringify(crmJson)}:LEADHUB`;

  const html = `<!DOCTYPE html>
    <html><head><meta charset="UTF-8"><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"></head><body>
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:#ea580c;padding:20px 24px;border-radius:8px 8px 0 0">
        <h1 style="color:#fff;margin:0;font-size:20px">📱 Клик WhatsApp — KRP.kz</h1>
      </div>
      <div style="background:#f8fafc;padding:24px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px">
        <table style="width:100%;border-collapse:collapse">
          <tr>
            <td style="padding:8px 0;color:#64748b;width:140px;vertical-align:top">Код заявки</td>
            <td style="padding:8px 0;font-weight:bold;color:#0f172a;font-family:monospace">${esc(fields.token)}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#64748b;vertical-align:top">Источник</td>
            <td style="padding:8px 0;color:#0f172a">${fields.utm_source || "—"}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#64748b;vertical-align:top">Кампания</td>
            <td style="padding:8px 0;color:#0f172a">${fields.utm_campaign || "—"}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#64748b;vertical-align:top">Страница</td>
            <td style="padding:8px 0;color:#0f172a;font-family:monospace;word-break:break-all">${esc(fields.landing_page || "—")}</td>
          </tr>
        </table>
      </div>
    </div>
    <div style="display:none;color:#fff;font-size:1px">${jsonBlock}</div>
    </body></html>
  `;

  await transporter.sendMail({
    from: `KRP.kz <${SMTP_USER}>`,
    to: BEACON_TO,
    subject: `📱 wa-click: ${fields.token}`,
    html,
    encoding: "utf8",
  });
}
