"use client";
import { useState, useEffect } from "react";
import { COMPANY } from "@/config/company";

/**
 * Телефон для звонка. По субботам (по времени Алматы) переводится на отдельный
 * номер COMPANY.phoneSat. Начальное значение — будний номер, поэтому SSR и первый
 * клиентский рендер совпадают (без ошибок гидрации); переключение — после монтирования.
 */
export function usePhone() {
  const [state, setState] = useState<{ phone: string; phoneRaw: string; isSat: boolean }>({
    phone: COMPANY.phone,
    phoneRaw: COMPANY.phoneRaw,
    isSat: false,
  });

  useEffect(() => {
    try {
      const weekday = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Almaty",
        weekday: "short",
      }).format(new Date());
      if (weekday === "Sat") {
        setState({ phone: COMPANY.phoneSat, phoneRaw: COMPANY.phoneSatRaw, isSat: true });
      }
    } catch {
      /* Intl/timeZone недоступен — оставляем будний номер */
    }
  }, []);

  return state;
}
