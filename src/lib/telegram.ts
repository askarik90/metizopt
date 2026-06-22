// Уведомление о заявке в Telegram — надёжный канал без квот.
// Включается, когда заданы env TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID
// (chat_id можно несколько через запятую — отправим каждому).
const TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const CHATS = (process.env.TELEGRAM_CHAT_ID || "").split(",").map((s) => s.trim()).filter(Boolean);

export interface LeadTgData {
  name: string;
  phone: string;
  company?: string;
  city?: string;
  message?: string;
  category?: string;
  searchQuery?: string;
  pageUrl?: string;
}

export async function sendLeadTelegram(lead: LeadTgData): Promise<void> {
  if (!TOKEN || CHATS.length === 0) {
    throw new Error("Telegram not configured");
  }
  const text = [
    "🔔 Новая заявка — KRP.kz",
    `Имя: ${lead.name}`,
    `Телефон: ${lead.phone}`,
    lead.company ? `Компания: ${lead.company}` : "",
    lead.city ? `Город: ${lead.city}` : "",
    lead.category ? `Интерес: ${lead.category}` : "",
    lead.searchQuery ? `Искал: ${lead.searchQuery}` : "",
    lead.message ? `Сообщение: ${lead.message}` : "",
    lead.pageUrl ? `Страница: ${lead.pageUrl}` : "",
  ].filter(Boolean).join("\n");

  let okAny = false;
  let lastErr = "";
  for (const chat of CHATS) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chat, text, disable_web_page_preview: true }),
      });
      if (res.ok) okAny = true;
      else lastErr = `chat ${chat}: HTTP ${res.status}`;
    } catch (e) {
      lastErr = String(e);
    }
  }
  if (!okAny) throw new Error("Telegram send failed: " + lastErr);
}
