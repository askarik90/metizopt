"use client";
import { useEffect } from "react";
import { captureAttribution } from "@/hooks/useAnalytics";

// Невидимый компонент: при каждой загрузке страницы сохраняет gclid/UTM в cookie,
// чтобы источник рекламы не терялся до отправки формы.
export default function AttributionCapture() {
  useEffect(() => {
    captureAttribution();
  }, []);
  return null;
}
