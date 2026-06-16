import { Lead } from "@/types/lead";

/**
 * Пересылка лида в Хаб лидов (lead_hub).
 * Best-effort: при отсутствии конфигурации или ошибке тихо выходит, не ломая приём заявки.
 * Конфиг через env:
 *   LEADHUB_URL     — базовый URL хаба, напр. https://crm.bugel.kz
 *   LEADHUB_API_KEY — ключ канала krp из LEADHUB_API_KEYS на стороне хаба
 */
export async function forwardLeadToHub(lead: Lead): Promise<void> {
  const base = process.env.LEADHUB_URL;
  const apiKey = process.env.LEADHUB_API_KEY;
  if (!base || !apiKey) {
    return; // хаб ещё не настроен — пропускаем
  }

  // Собираем контекст в одно поле message (у хаба нет отдельных company/city/whatsapp)
  const parts = [
    lead.message,
    lead.category ? `Категория: ${lead.category}` : "",
    lead.search_query ? `Искал: ${lead.search_query}` : "",
    lead.company ? `Компания: ${lead.company}` : "",
    lead.city ? `Город: ${lead.city}` : "",
    lead.whatsapp ? `WhatsApp: ${lead.whatsapp}` : "",
    lead.page_url ? `Страница: ${lead.page_url}` : "",
    lead.fileUrl ? `Файл: ${lead.fileUrl}` : "",
  ].filter(Boolean);

  const payload = {
    source: "krp",
    name: lead.name,
    phone: lead.phone,
    message: parts.join("\n"),
    utm_source: lead.utm_source || "",
    utm_medium: lead.utm_medium || "",
    utm_campaign: lead.utm_campaign || "",
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);
  try {
    const res = await fetch(`${base.replace(/\/$/, "")}/api/lead`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-API-Key": apiKey },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    if (!res.ok) {
      console.error("Hub forward failed:", res.status, await res.text());
    } else {
      console.log("✅ Lead forwarded to hub");
    }
  } catch (e) {
    console.error("Hub forward error:", e);
  } finally {
    clearTimeout(timeout);
  }
}
