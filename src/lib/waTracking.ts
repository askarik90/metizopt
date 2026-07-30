// WhatsApp атрибуция: генерация токена, отправка маячка, открытие ватсапа
// Client-side утилита для отправки маячков в CRM через /api/wa-click

import { COMPANY } from "@/config/company";
import { getUtmParams } from "@/hooks/useAnalytics";

/**
 * Генерирует токен в формате KRP-[A-Z2-7]{16}
 * Алфавит base32: ABCDEFGHIJKLMNOPQRSTUVWXYZ234567
 */
export function genWaToken(): string {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let token = "";
  for (let i = 0; i < 16; i++) {
    token += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `KRP-${token}`;
}

export interface WaClickBeaconPayload {
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
}

/**
 * Fire-and-forget отправка маячка в CRM
 * Не блокирует и не ловит ошибки (жизненно важно для UX)
 */
async function sendWaClickBeacon(payload: WaClickBeaconPayload): Promise<void> {
  try {
    // keepalive: true — браузер отправит запрос даже если пользователь
    // закроет вкладку или уйдёт на сайт ватсапа
    await fetch("/api/wa-click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch {
    // Тихо игнорируем ошибки отправки маячка
  }
}

/**
 * Открывает WhatsApp с атрибуцией
 * Client-side: генерирует токен, собирает атрибуцию, шлёт маячок, открывает ватсап
 * @param text Текст сообщения (опционально, используется дефолт)
 * @param category Категория (опционально, для аналитики)
 */
export function openWhatsApp(text?: string, category?: string): void {
  if (typeof window === "undefined") return;

  const token = genWaToken();

  // Собираем атрибуцию из getUtmParams
  let attr: Record<string, string> = {};
  try {
    attr = getUtmParams() || {};
  } catch {
    // Если не смогли получить, просто пропускаем (код работает без этого)
  }

  // Шлём маячок в CRM (fire-and-forget)
  const payload: WaClickBeaconPayload = {
    token,
    gclid: attr.gclid || undefined,
    gbraid: attr.gbraid || undefined,
    wbraid: attr.wbraid || undefined,
    utm_source: attr.utm_source || undefined,
    utm_medium: attr.utm_medium || undefined,
    utm_campaign: attr.utm_campaign || undefined,
    utm_content: attr.utm_content || undefined,
    utm_term: attr.utm_term || undefined,
    landing_page: attr.landing_page || (typeof window !== "undefined" ? window.location.pathname + window.location.search : undefined),
  };
  sendWaClickBeacon(payload);

  // Формируем текст сообщения с кодом заявки
  const baseText = text || COMPANY.whatsappDefaultText;
  const msgWithToken = `${baseText} (код заявки: ${token})`;
  const encodedMsg = encodeURIComponent(msgWithToken);

  // Открываем ватсап
  const waUrl = `https://wa.me/${COMPANY.whatsapp}?text=${encodedMsg}`;
  window.open(waUrl, "_blank");
}
