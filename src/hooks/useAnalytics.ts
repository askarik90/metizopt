"use client";
import { useCallback } from "react";

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
    ym?: (id: number, action: string, ...args: unknown[]) => void;
  }
}

export function useAnalytics() {
  const push = useCallback((event: string, params?: Record<string, unknown>) => {
    if (typeof window === "undefined") return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...params });
  }, []);

  return {
    trackLeadFormOpen: () => push("lead_form_open"),
    trackLeadFormSubmit: (category?: string) => push("lead_form_submit", { category }),
    trackWhatsAppClick: (category?: string) => push("whatsapp_click", { category }),
    trackPhoneClick: () => push("phone_click"),
    trackFileUpload: () => push("file_upload"),
    trackCategoryClick: (category: string) => push("category_click", { category }),
    trackQuoteRequestClick: () => push("quote_request_click"),
  };
}

// Читаем UTM напрямую из URL при сабмите — не использует useSearchParams (нет Suspense)
export function getUtmParams(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const p = new URLSearchParams(window.location.search);
  return {
    utm_source: p.get("utm_source") || "",
    utm_medium: p.get("utm_medium") || "",
    utm_campaign: p.get("utm_campaign") || "",
    utm_content: p.get("utm_content") || "",
    utm_term: p.get("utm_term") || "",
  };
}
