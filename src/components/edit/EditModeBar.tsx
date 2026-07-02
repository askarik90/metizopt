"use client";
import { useEffect, useState } from "react";
import { getPending, removeSavedKeys, pendingCount, onPendingChange } from "@/lib/editPending";

// Глобальный флаг «режим правки» — хранится в localStorage (per-origin),
// включается из админки. Видим только тому, кто включил.
const KEY = "krp_edit";

export default function EditModeBar() {
  const [on, setOn] = useState(false);
  const [count, setCount] = useState(0);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

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

  useEffect(() => {
    const refresh = () => setCount(pendingCount());
    refresh();
    return onPendingChange(refresh);
  }, []);

  if (!on) return null;

  const off = () => {
    try {
      localStorage.removeItem(KEY);
    } catch {}
    window.dispatchEvent(new Event("krp-edit-change"));
  };

  // Публикуем ВСЕ накопленные правки одним запросом → один коммит → один редеплой.
  const saveAll = async () => {
    const pend = getPending(); // snapshot того, что реально отправляем
    const n = Object.keys(pend).length;
    if (!n || saving) return;
    setSaving(true);
    setMsg("");
    try {
      const r = await fetch("/api/image-positions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ merge: true, positions: pend }),
      });
      if (r.ok) {
        removeSavedKeys(pend); // чистим только отправленное; правки во время сохранения остаются
        setMsg(`✓ ${n} фото сохранено — применится за ~1 мин (передеплой)`);
      } else if (r.status === 401) {
        setMsg("Войдите в админку, чтобы сохранять");
      } else {
        setMsg("Не удалось сохранить");
      }
    } catch {
      setMsg("Не удалось сохранить");
    }
    setSaving(false);
  };

  return (
    <div className="fixed bottom-4 left-1/2 z-[60] flex max-w-[95vw] -translate-x-1/2 flex-col items-center gap-1">
      <div className="flex items-center gap-3 rounded-full bg-slate-900 px-5 py-2.5 text-sm text-white shadow-xl ring-1 ring-white/10">
        <span className="font-medium">✎ Режим правки</span>
        <span className="hidden text-xs text-slate-400 sm:inline">наведитесь на фото → значок → «Применить»</span>
        <button
          onClick={saveAll}
          disabled={count === 0 || saving}
          className="rounded-full bg-orange-600 px-3 py-1 text-xs font-semibold enabled:hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {saving ? "Сохраняю…" : `Сохранить всё${count ? ` (${count})` : ""}`}
        </button>
        <button onClick={off} className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold hover:bg-white/25">
          Выключить
        </button>
      </div>
      {msg && (
        <div className="rounded-full bg-slate-800 px-3 py-1 text-[11px] text-slate-200 shadow">{msg}</div>
      )}
    </div>
  );
}
