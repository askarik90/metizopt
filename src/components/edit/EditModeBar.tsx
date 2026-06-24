"use client";
import { useEffect, useState } from "react";

// Глобальный флаг «режим правки» — хранится в localStorage (per-origin),
// включается из админки. Видим только тому, кто включил.
const KEY = "krp_edit";

export default function EditModeBar() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const read = () => {
      try {
        setOn(localStorage.getItem(KEY) === "1");
      } catch {
        setOn(false);
      }
    };
    read();
    window.addEventListener("krp-edit-change", read);
    return () => window.removeEventListener("krp-edit-change", read);
  }, []);

  if (!on) return null;

  const off = () => {
    try {
      localStorage.removeItem(KEY);
    } catch {}
    window.dispatchEvent(new Event("krp-edit-change"));
  };

  return (
    <div className="fixed bottom-4 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-3 rounded-full bg-slate-900 px-5 py-2.5 text-sm text-white shadow-xl ring-1 ring-white/10">
      <span className="font-medium">✎ Режим правки</span>
      <span className="hidden text-xs text-slate-400 sm:inline">наведитесь на фото и нажмите значок</span>
      <button onClick={off} className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold hover:bg-white/25">
        Выключить
      </button>
    </div>
  );
}
