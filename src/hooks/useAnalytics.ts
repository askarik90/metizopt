"use client";
import { useCallback } from "react";

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
    ym?: (id: number, action: string, ...args: unknown[]) => void;
  }
}

// fire-and-forget — не блокируем UI
function track(type: string, meta?: { category?: string; page?: string }) {
  const page = typeof window !== "undefined" ? window.location.pathname : undefined;
  fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, page, ...meta }),
  }).catch(() => {});
}

// GA4 / Google Ads событие через gtag
function gtagEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params ?? {});
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
      track("formOpens", { category });
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
    },
    trackWhatsAppClick: (category?: string) => {
      push("whatsapp_click", { category });
      gtagEvent("whatsapp_click", { event_category: "contact", event_label: category });
      track("whatsappClicks", { category });
    },
    trackPhoneClick: (category?: string) => {
      push("phone_click", { category });
      gtagEvent("phone_click", { event_category: "contact" });
      track("phoneClicks", { category });
    },
    trackFileUpload: () => {
      push("file_upload");
      gtagEvent("file_upload", { event_category: "engagement" });
      track("fileUploads");
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
