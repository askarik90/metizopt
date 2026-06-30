"use client";
import { useCallback } from "react";

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
    ym?: (id: number, action: string, ...args: unknown[]) => void;
  }
}

// один идентификатор на вкладку-сессию (sessionStorage живёт до закрытия вкладки)
function getSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = sessionStorage.getItem("krp_sid");
    if (!id) {
      id = crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      sessionStorage.setItem("krp_sid", id);
    }
    return id;
  } catch {
    return "";
  }
}

// true только при ПЕРВОМ вызове за сессию для данного ключа — для дедупликации
function firstInSession(key: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const k = `krp_once_${key}`;
    if (sessionStorage.getItem(k)) return false;
    sessionStorage.setItem(k, "1");
    return true;
  } catch {
    return true;
  }
}

// fire-and-forget — не блокируем UI
function track(type: string, meta?: { category?: string; page?: string }) {
  const page = typeof window !== "undefined" ? window.location.pathname : undefined;
  fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, page, sessionId: getSessionId(), ...meta }),
  }).catch(() => {});
}

// GA4 / Google Ads событие через gtag
function gtagEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params ?? {});
  }
}

// Яндекс Метрика — достижение цели (контекстологи заводят цели по этим идентификаторам)
const METRIKA_ID = 109915321;
function ymGoal(goal: string) {
  if (typeof window !== "undefined" && typeof window.ym === "function") {
    window.ym(METRIKA_ID, "reachGoal", goal);
  }
}

export function useAnalytics() {
  const push = useCallback((event: string, params?: Record<string, unknown>) => {
    if (typeof window === "undefined") return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...params });
  }, []);

  return {
    trackLeadFormOpen: (category?: string) => {
      push("lead_form_open", { category });
      gtagEvent("lead_form_open", { event_category: "engagement", event_label: category });
      track("formOpens", { category }); // сырой счётчик — каждое открытие
      // уникальное открытие: 1 на сессию (знаменатель конверсии)
      if (firstInSession("formOpen")) track("formOpenSessions", { category });
      ymGoal("form_open");
    },
    trackLeadFormSubmit: (category?: string, searchQuery?: string) => {
      push("lead_form_submit", { category, search_query: searchQuery });
      gtagEvent("generate_lead", {
        event_category: "lead",
        event_label: category,
        search_query: searchQuery,
        currency: "KZT",
        value: 0,
      });
      track("formSubmits", { category });
      ymGoal("lead");
    },
    trackWhatsAppClick: (category?: string) => {
      push("whatsapp_click", { category });
      gtagEvent("whatsapp_click", { event_category: "contact", event_label: category });
      track("whatsappClicks", { category });
      ymGoal("whatsapp");
    },
    trackPhoneClick: (category?: string) => {
      push("phone_click", { category });
      gtagEvent("phone_click", { event_category: "contact" });
      track("phoneClicks", { category });
      ymGoal("phone");
    },
    trackFileUpload: () => {
      push("file_upload");
      gtagEvent("file_upload", { event_category: "engagement" });
      track("fileUploads");
      ymGoal("file_upload");
    },
    trackSearch: (searchTerm: string, resultsCount: number) => {
      push("search", { search_term: searchTerm, results_count: resultsCount });
      gtagEvent("search", { search_term: searchTerm, results_count: resultsCount });
    },
    trackSearchResultClick: (searchTerm: string, targetSlug: string) => {
      push("search_result_click", { search_term: searchTerm, target: targetSlug });
      gtagEvent("select_content", {
        content_type: "category",
        item_id: targetSlug,
        search_term: searchTerm,
      });
    },
    trackCategoryView: (category: string) => {
      push("category_view", { category });
      gtagEvent("view_item_list", { item_list_id: category, item_list_name: category });
    },
    trackCategoryClick: (category: string) => push("category_click", { category }),
    trackQuoteRequestClick: () => push("quote_request_click"),
  };
}

// --- Атрибуция: ловим gclid + UTM при заходе с рекламы и храним в cookie (90 дней),
// чтобы источник не терялся, если клиент походил по сайту до отправки формы. ---
const ATTR_COOKIE = "krp_attr";
const ATTR_KEYS = [
  "gclid", "gbraid", "wbraid",
  "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term",
];

function readCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return m ? decodeURIComponent(m[1]) : "";
}
function writeCookie(name: string, value: string, days: number) {
  if (typeof document === "undefined") return;
  const exp = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${exp}; path=/; SameSite=Lax`;
}

// Вызывать на КАЖДОЙ загрузке страницы (см. <AttributionCapture/>): сохраняет «последний платный клик».
export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  const p = new URLSearchParams(window.location.search);
  const incoming: Record<string, string> = {};
  for (const k of ATTR_KEYS) {
    const v = p.get(k);
    if (v) incoming[k] = v;
  }
  // Перезаписываем cookie только при НОВОМ платном клике (gclid/gbraid/wbraid или utm_source) —
  // так атрибутирует и Google (last paid click). Прямые/органические заходы старое не затирают.
  if (incoming.gclid || incoming.gbraid || incoming.wbraid || incoming.utm_source) {
    const data: Record<string, string> = {
      ...incoming,
      landing_page: window.location.pathname + window.location.search,
      referrer: document.referrer || "",
      ts: new Date().toISOString(),
    };
    try {
      writeCookie(ATTR_COOKIE, JSON.stringify(data), 90);
    } catch {}
  }
}

// Полная атрибуция для отправки в форме/CRM: cookie (приоритет) + добор из текущего URL.
export function getUtmParams(): Record<string, string> {
  if (typeof window === "undefined") return {};
  let stored: Record<string, string> = {};
  try {
    stored = JSON.parse(readCookie(ATTR_COOKIE) || "{}");
  } catch {}
  const p = new URLSearchParams(window.location.search);
  const pick = (k: string) => stored[k] || p.get(k) || "";
  return {
    utm_source: pick("utm_source"),
    utm_medium: pick("utm_medium"),
    utm_campaign: pick("utm_campaign"),
    utm_content: pick("utm_content"),
    utm_term: pick("utm_term"),
    gclid: pick("gclid"),
    gbraid: pick("gbraid"),
    wbraid: pick("wbraid"),
    landing_page: stored.landing_page || window.location.pathname,
  };
}
